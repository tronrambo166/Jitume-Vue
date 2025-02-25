<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\ServiceMileStatus;
use App\Models\serviceBook;
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
    protected $signature = 'release:service_milestone_payment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This is a auto milestone releasing service when service customer is inactive.';

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
                    //echo $time_past.$mile->id; //exit;

                    //Send Reminder Mail
                    if(($since_start->d == 5 || $since_start->d == 5) && 
                        $since_start->h == 0)
                    {   
                        $customer = User::where('id',$mile->booker_id)->first();
                        $info=['d'=>1, 'name'=>$mile->title,'amount'=>$mile->amount,];
                        $user['to'] = $customer->email;
                        Mail::send('milestone.milestone_due_mail', $info, function($msg) 
                        use ($user){
                        $msg->to($user['to']);
                        $msg->subject('Milestone Release Request');
                        });  
                    }

                    //Payment Release and Alert
                    if($since_start->d > 7  && $since_start->h == 0)
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


    public function Release($rep_id,$booker_id)
    {   
        $Arr1 = explode('.', base64_decode($rep_id));
        $Arr2 = explode('.', base64_decode($booker_id));

        $rep_id = $Arr1[0];
        $booker_id = $Arr2[0];

        try{

        $mileThis = ServiceMileStatus::select('id','service_id','amount','title','released')->where('id',$rep_id)->first();

        if(!$mileThis) return 'Milestone do not exist!';
        if($mileThis && $mileThis->released == 1) return 'Payment already released for this milestone!';

        $mileLat = ServiceMileStatus::where('service_id',$mileThis->service_id)
        ->where('booker_id',$booker_id)->where('status','To Do')->first();
        $serv= Services::select('name','id','shop_id','price')->where('id',$mileThis->service_id)->first();
        $owner = User::select('fname','id','connect_id')->where('id',$serv->shop_id)->first();
        $customer = User::select('fname','email')->where('id',$booker_id)->first();

        if($mileLat)
        ServiceMileStatus::where('id',$mileLat->id)->update([ 
            'active' => 1, 
            'status'=> 'In Progress'
        ]);

        $s_id = base64_encode(base64_encode($mileThis->service_id));

        $transferAmount = round($mileThis->amount,2);
        
        //Release Milestone Payment
            $curr='USD'; //$request->currency; 
            $tranfer = $this->Client->transfers->create ([ 
                    "amount" => $transferAmount*100, //100 * 100,
                    "currency" => $curr,
                    //"source_transaction" => $charge->id,
                    'destination' => $owner->connect_id
            ]);
        //Release Milestone Payment
            $released = ServiceMileStatus::where('id',$rep_id)
            ->update([
                'released' => 1
            ]);

            $text = 'Milestone payment for '.$mileThis->title.' has been released to your account..';
            $this->createNotification($owner->id,null,$text,'/',' service');

            $text = 'Milestone payment for '.$mileThis->title.' has been released. Next Milestone is in progress';
            $this->createNotification($booker_id,null,$text,'/',' service');

            //Check if Service is done
            $Last = ServiceMileStatus::where('service_id',$mileThis->service_id)
            ->where('booker_id',$booker_id)->where('status','To Do')->first();

            $Last2 = ServiceMileStatus::where('service_id',$mileThis->service_id)
            ->where('booker_id',$booker_id)->where('status','In Progress')->first();


            if(!$Last && !$Last2)
            {   
                //Customer
                $info=[ 's_id' => base64_encode(base64_encode($serv->id)), 
                'service' => $serv->name, 'amount' => $serv->price, 'to'=>1, 'user_name'=> $customer->fname ]; 

                $user['to'] = $customer->email;//'sohaankane@gmail.com';
                 Mail::send('milestoneS.service_done_mail', $info, function($msg) use ($user){
                     $msg->to($user['to']);
                     $msg->subject('Service Done!'); 
                 }); 


                //Owner
                 $info=[ 's_id' => base64_encode(base64_encode($serv->id)), 
                'service' => $serv->name, 'amount' => $serv->price, 'to'=>2, 'user_name'=> $owner->fname ]; 

                $user['to'] = $customer->email;//'sohaankane@gmail.com';
                 Mail::send('milestoneS.service_done_mail', $info, function($msg) use ($user){
                     $msg->to($user['to']);
                     $msg->subject('Service Done!'); 
                 }); 

            }

            //return redirect()->to(config('app.app_url').'service-milestones/'.$s_id);
        }
        catch(\Exception $e){
            return $e->getMessage();
        }  
    
    }

}
