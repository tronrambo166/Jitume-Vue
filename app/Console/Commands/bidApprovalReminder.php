<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\ServiceMileStatus;
use App\Models\serviceBook;
use App\Models\Services;
use App\Models\Notifications;
use Stripe\StripeClient;
use Session; 
use Auth;
use Mail;
use DateTime;
use DB;

class releaseMilestonePayment extends Command
{   
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:bid_approval_reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This is a bid approval remider when business owner is inactive.';

    /**
     * Execute the console command.
     */
    public function handle()
    { 
        $bookings = serviceBook::where('paid', 1)->latest()->get(); $c=0;$d=0;
        foreach($bookings as $booking)
        {   
            $milestone = ServiceMileStatus::where('booking_id', $booking->id)->get();
            foreach($milestone as $mile)
            {   
                if($mile->status == 'Done' && $mile->released != 1)
                {
                    $time_due_date = date( "Y-m-d H:i:s",strtotime($mile->updated_at));
                    $start_date = new DateTime(date("Y-m-d H:i:s"));
                    $since_start = $start_date->diff(new DateTime($time_due_date));
                    $time_past = $since_start->d.' days, '.$since_start->h.' hours, '. $since_start->i.' minutes';
                    //echo $time_past.$mile->id; exit;

                    $business = Services::where('id', $mile->service_id)
                    ->first();

                    //Send Reminder Mail
                    if(($since_start->d == 5 || $since_start->d == 7) && 
                        $since_start->h == 0)
                    {   
                        $customer = User::where('id',$mile->booker_id)->first();

                        $info=[ 'd'=>$since_start->d, 'name'=>$mile->title,
                        'amount'=>$mile->amount, 'business'=>$business->name, 's_id' => $business->id,'booker_id' => $mile->booker_id, 'rep_id' => $mile->id ]; 

                        $user['to'] = $customer->email;
                        Mail::send('milestoneS.payment_release_reminder', $info, function($msg) 
                        use ($user){
                        $msg->to($user['to']);
                        $msg->subject('Milestone Payment Release Request');
                        });  
                    }

                    echo $time_past.$mile->id;
                    //Payment Release and Alert
                    if($since_start->d > 7  && $since_start->h == 1)
                    {   
                        $random = $mile->id + 51;$random2 = $mile->booker_id + 47;
                        $rep_id = base64_encode($mile->id.'.'.$random);
                        $booker_id = base64_encode($mile->booker_id.'.'.$random2);

                        $this->Release($rep_id, $booker_id);
                    }
                }

            }
        }
          
    }


    public function createNotification($receiver_id,$customer_id,$text,$link,$type)
    {
        $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
        $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $receiver_id,
            'customer_id' => $customer_id,
            'text' => $text,
            'link' => $link,
            'type' => $type,
        ]);
    }


}
