<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Milestones;
use App\Models\BusinessBids;
use App\Models\AcceptedBids;
use App\Models\Listing;
use App\Models\Notifications;
use Stripe\StripeClient;
use Session; 
use Auth;
use Mail;
use DateTime;
use DB;

class investProgressReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:invest_progress_reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
        public function handle()
    { 
        $bids = AcceptedBids::where('status','awaiting_payment')->orWhere('status','Confirmed')->orWhere('status','verified')->latest()->get();
        $cnt=0;
        $sent_businesses = array();
        foreach($bids as $bid)
        {   
            $sent=0;
            $bid_placed = date( "Y-m-d H:i:s",strtotime($bid->updated_at));
            $start_date = new DateTime(date("Y-m-d H:i:s"));
            $since_start = $start_date->diff(new DateTime($bid_placed));
            $time_past = $since_start->d.' days, '.$since_start->h.' hours, '. $since_start->i.' minutes';
            echo $time_past.$bid->id; exit;

            $business = Listing::select('name')->where('id', $bid->business_id)->first();

            //Send Reminder Mail
            if(($since_start->d == 3 || $since_start->d == 7 || 
                $since_start->d == 14) && $since_start->h == 0)
            {   
                foreach($sent_businesses as $s)
                if($s == $bid->business_id)
                    $sent++;

                if ($sent == 0) {
                    $owner = User::select('fname','email')
                    ->where('id',$bid->owner_id)->first();

                    $info=['business'=>$business->name, 
                    'owner' => $owner->fname]; 
                    $user['to'] = $owner->email;

                    Mail::send('bids.reminder.bid_approve_reminder', 
                    $info, function($msg) 
                    use ($user){
                    $msg->to($user['to']);
                    $msg->subject('Bid Approval Reminder');
                    });
                    $sent_businesses[] = $bid->business_id;
                }
                
                //High value alert
                if($bid->amount > 20000){
                    //... Logic
                }
            }

        }
          
    }
}
