<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Models\Listing;
use App\Models\Services;
use App\Models\Shop;
use App\Models\Equipments;
use App\Models\User;
use App\Models\Cart;
use App\Models\orders;
use App\Models\Conversation;
use App\Models\Milestones;
use App\Models\Smilestones;
use App\Models\AcceptedBids;
use App\Models\serviceBook;
use Session; 
use Hash;
use Auth;
use Mail;
use Stripe\StripeClient;
use App\Models\taxes;
use App\Models\BusinessBids;
use App\Models\ServiceMileStatus;
use App\Models\Notifications;
use App\Http\Controllers\testController;

class bidsEmailController extends Controller
{

protected $api_base_url;
protected $Client;
public function __construct(StripeClient $client)
    {
        $this->Client = $client;
        $this->api_base_url = env('API_BASE_URL');
    }

public function bid_info($id)
{
    try{
        $bid = AcceptedBids::where('id', $id)->first();
        $investor = User::select('fname')->where('id', $bid->investor_id)->first()
        ->fname;
        return response()->json(['status' => 200, 'data' => $bid, 'investor'=>
        $investor]);
    }
    catch(\Exception $e){
        Session::put('failed',$e->getMessage());
        return response()->json(['status' => 400, 'message' => $e->getMessage()]);
    }
}


public function bidsAccepted(Request $request)
{
    //return $request->all();
    try {
        $bid_ids = $request->bid_ids;

        //REJECT
        if(isset($request->reject) && $request->reject == 1){
        foreach($bid_ids as $id){
        if($id !=''){
        $bid = BusinessBids::where('id',$id)->first();
        $investor = User::where('id',$bid->investor_id)->first();
        $investor_mail = $investor->email;
        $list = listing::where('id',$bid->business_id)->first();
        $info=[ 'business_name'=>$list->name ];
        $user['to'] = $investor_mail; //'tottenham266@gmail.com'; //
         
         if($investor)
            Mail::send('bids.rejected', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Bid Rejected!');
         });

         //Refund

         if($bid->type == 'Monetary' && $bid->stripe_charge_id){
            $actual_paid_amount = ($bid->amount)*0.25;
            $refund_amount = ($actual_paid_amount)*0.98;
            $this->Client->refunds->create([
                'charge' => $bid->stripe_charge_id,
                'amount' => $refund_amount*100
            ]);
         }
         //Refund

         
         $bid_remove = BusinessBids::where('id',$id)->delete();
         //remove

         //Notifications
         $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
         $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $bid->investor_id,
            'customer_id' => $bid->business_id,
            'text' => 'Sorry your bid to _name has been rejected, please try again properly!',
            'link' => '/',
            'type' => 'business',
          ]);
         //Notifications

           }
          }
        Session::put('success','Rejected!');
        return response()->json(['message' => 'Rejected!']);
        }
        //REJECT 


        foreach($bid_ids as $id){
        if($id !=''){
        $bid = BusinessBids::where('id',$id)->first();
        $investor = User::where('id',$bid->investor_id)->first();
        $investor_mail = $investor->email;

         $ms_id = Milestones::select('id')->where('listing_id',$bid->business_id)
         ->where('status','In Progress')->first()->id;
         $list = listing::where('id',$bid->business_id)->first();
         $owner = User::where('id',$list->user_id)->first();
         $recipient = $owner->paystack_acc_id;
         $usdToKen = 100*128.5;

         //Check Amount Requested Exceed
         $amount_needed = ($list->investment_needed - $list->amount_collected);
         if($bid->amount > $amount_needed){
             return response()->json(['message' => 'Selected bid amount exceeds
             the amount needed for this business'],400);
         }

         //TRANSFERRING FUNDS
         // if($bid->type == 'Monetary' && $bid->stripe_charge_id)
         // {
                //Split
                    // $curr='USD'; //$request->currency; 
                    // $tranfer = $this->Client->transfers->create ([ 
                    //         //"billing_address_collection": null,
                    //         "amount" => $bid->amount*100, //100 * 100,
                    //         "currency" => $curr,
                    //         "source_transaction" => $bid->stripe_charge_id,
                    //         'destination' => $owner->connect_id
                    // ]);
                //Stripe
         //}
         //TRANSFERRING FUNDS

            if($bid->type == 'Monetary') 
              $status ='awaiting_payment'; else $status ='under_verification';

              $accepted =  AcceptedBids::create([
              'bid_id' => $id,
              'ms_id' => $ms_id,
              'date' => $bid->date,
              'investor_id' => $bid->investor_id,
              'business_id' => $bid->business_id,
              'owner_id' => $bid->owner_id,
              'type' => $bid->type,
              'amount' => $bid->amount,
              'representation' => $bid->representation,
              'serial' => $bid->serial,
              'legal_doc' => $bid->legal_doc,
              'optional_doc' => $bid->optional_doc,
              'photos' => $bid->photos,
              'stripe_charge_id' => $bid->stripe_charge_id,
              'status' => $status,
            ]);
            
            //After Bid is Accepted
              $amount_collected = $list->amount_collected + $bid->amount;
              $invest_count = $list->invest_count + 1;
              Listing::where('id', $bid->business_id)->update([
                'amount_collected' => $amount_collected,
                'invest_count' => $invest_count
              ]);


            //Mail
                $info=[ 'business_name'=>$list->name, 'bid_id'=>
                base64_encode($accepted->id), 'type' => $bid->type, 
                'amount' => base64_encode($bid->amount), 'id' => $list->id ];

                $user['to'] = $investor_mail; //'tottenham266@gmail.com'; //
                 if($investor)
                    Mail::send('bids.initially_accepted' , $info, function($msg) use ($user){
                     $msg->to($user['to']);
                     $msg->subject('Bid accepted!');
                 });
            //Mail

         //Notifications
         $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
         $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $bid->investor_id,
            'customer_id' => $bid->business_id,
            'text' => 'Your bid to _name has been accepted!',
            'link' => '/',
            'type' => 'business',
          ]);
         //Notifications
          $bid_remove = BusinessBids::where('id',$id)->delete();
         //remove

         }
       }
      return response()->json(['message' => 'Accepted!'], 200);
     
       }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()],400);
       }  

   }


public function agreeToProgressWithMilestone($bidId)
{   
    $bidId = base64_decode($bidId);
    try { 
        $bid = AcceptedBids::select('ms_id','business_id','owner_id','investor_id')
        ->where('id',$bidId)->first();
        $agreeVote = AcceptedBids::where('id',$bidId)
        ->where('ms_id',$bid->ms_id)->update([
            'investor_agree' => 1       
        ]);//$business_id = base64_encode(base64_encode($bid->business_id));

        //Release Payment - VOTE COUNT
        $t_mo_amount=0; $t_rating=0; $release = array();$i=0;
        $listing = listing::select('id','name','user_id','share','investment_needed')
        ->where('id',$bid->business_id)->first();
        $share = $listing->share; //50%
        $needed = $listing->investment_needed; // 1000

        $investor_agree = AcceptedBids::where('business_id',$bid->business_id)
        ->where('ms_id',$bid->ms_id)->where('investor_agree',1)->get();
        
        $owner = User::select('connect_id','email')->where('id',$listing->user_id)
        ->first();

        foreach($investor_agree as $Iagree)
        {   $bid_amount = ($Iagree->amount);
            $rating = round(($bid_amount/$needed)*10, 2);
            if($Iagree->project_manager != null)
            $rating = $rating+1;

            $t_rating = $t_rating+$rating;
            $release[$i]['amount'] = $bid_amount;
            $release[$i]['type'] = $Iagree->type;
            $release[$i]['stripe_charge_id'] = $Iagree->stripe_charge_id; $i++;
            //echo '('.$bid_amount.'/'.$needed.'\n';echo $rating.' ),';

            if($Iagree->type == 'Monetary')
                $t_mo_amount = $t_mo_amount+$bid_amount;

        }  
        
        if($t_rating >= 5.10)
        {   
            //Release
            foreach ($release as $releasing) {
                if($releasing['type'] == 'Monetary'){
                $curr='USD'; //$request->currency; 
                $tranfer = $this->Client->transfers->create ([ 
                        //"billing_address_collection": null,
                        "amount" => $releasing['amount']*100, //100*100,
                        "currency" => $curr,
                        //"source_transaction" => $releasing['stripe_charge_id'],
                        'destination' => $owner->connect_id
                ]);
                }
                
            }

             //Notifications
             $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
             $milestone = Milestones::select('title')->where('id',$bid->ms_id)
             ->first()->title;
             $addNoti = Notifications::create([
                'date' => $date,
                'receiver_id' => $bid->owner_id,
                'customer_id' => $bid->investor_id,
                'bid_id' => $bidId,
                'text' => 'All payments for Milestone '.$milestone.' of Business '
                .$listing->name.' are now released!',
                'link' => '/',
                'type' => 'investor',
              ]);
            
             // //Email
             // $info=[ 'business_name'=>$listing->name ];
             // $user['to'] = $owner->email; //'tottenham266@gmail.com'; //
             // if($owner)
             //    Mail::send('bids.verify_request', $info, function($msg) use ($user){
             //     $msg->to($user['to']);
             //     $msg->subject('Equipment Verify request!');
             // });
             //Notifications
            //Release
        }
        //Release Payment - VOTE COUNT
       return redirect()->to(config('app.app_url').'?agreetobid=yes');
     
       }
        catch(\Exception $e){
            return $e->getMessage();
            return redirect()->to(config('app.app_url'));
       }  
}


public function withdraw_investment($bidId)
{
    try {
        $bid = AcceptedBids::where('id',$bidId)->first();
        $investor = User::select('fname','lname','id','email')
        ->where('id',$bid->investor_id)->first();
        $inv_name = $investor->fname.' '.$investor->lname;
        //$bid_percentage = $bid->representation;

        $business = Listing::select('name','user_id','id','amount_collected')
        ->where('id',$bid->business_id)->first();
        $owner = User::select('fname','lname','id','email')
        ->where('id',$business->user_id)->first();

        //Financial Reallocation: Refund 98%;
        if($bid->type == 'Monetary'){
            $actual_paid_amount = ($bid->amount)*0.25;
            $refund_amount = ($actual_paid_amount)*0.98;
            $this->Client->refunds->create([
                'charge' => $bid->stripe_charge_id,
                'amount' => $refund_amount*100
                 ]);
            
            $new_amount_collected = ($business->amount_collected) - ($bid->amount);
            Listing::where('id',$bid->business_id)->update([
                'amount_collected' => $new_amount_collected
            ]);
        }
        
        //Notification and Transparency:
        $text = 'A bid to business '.$business->name.' was withdrawn by '.$inv_name;
        $this->createNotification($owner->id,$investor->id,$text,'/',' business');

        $text = 'Your bid to business '.$business->name.' was withdrawn, you will get the refund in 7 business days';
        $this->createNotification($investor->id,$owner->id,$text,'/',' business');

        
        AcceptedBids::where('id',$bidId)->delete();
        return response()->json(['status'=>200, 'message' =>'Bid Withdrawn!']);
     
   }
    catch(\Exception $e){
        return response()->json(['status'=>400, 'message' => $e->getMessage()]);
   }  
}


public function CancelAssetBid($bidId, $action)
{   
    $bidId = base64_decode($bidId); 
    try { 
        $bid = AcceptedBids::where('id',$bidId)->first();
        $investor = User::select('fname','fname','email')->where('id',$bid->investor_id)->first();
        $inv_name = $investor->fname.' '.$investor->lname;
        $business = Listing::select('name','user_id','id')->where('id',$bid->business_id)->first();
        $owner = User::select('email','id')->where('id',$business->user_id)->first();

        if($action == 'confirm')
        {
            $info=['inv_name'=>$inv_name,'type'=>$bid->type,'bid_id'=>base64_encode($bidId),'asset_name'=>$bid->serial,'business_name'=>$business->name];
            
            $user['to'] = $investor->email;
            Mail::send('bids.cancel_confirm', $info, function($msg) use ($user){
                $msg->to($user['to']);
                $msg->subject('Bid Cancel Confirmation!');
         });

            //Notifications
             $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
             $addNoti = Notifications::create([
                'date' => $date,
                'receiver_id' => $bid->investor_id,
                'customer_id' => $owner->id,
                'bid_id' => $bidId,
                'text' => 'Your bid to business '.$business->name.' will be cancelled.',
                'link' => 'bid_cancel_confirm',
                'type' => 'business',
              ]);
          //Notifications
        }
        else
        {
            $info=['investor'=>$inv_name,'type'=>$bid->type,'business_name'=>$business->name];
            $user['to'] = $owner->email; //'tottenham266@gmail.com';
             Mail::send('bids.cancelled', $info, function($msg) use ($user){
                 $msg->to($user['to']);
                 $msg->subject('Bid Cancel!');
             });

            //Notifications
             $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
             $addNoti = Notifications::create([
                'date' => $date,
                'receiver_id' => $owner->id,
                'customer_id' => $bid->investor_id,
                'text' => 'A bid to business '.$business->name.' was cancelled by '.$inv_name,
                'link' => 'investment-bids',
                'type' => 'business',
              ]);

             $addNoti2 = Notifications::create([
                'date' => $date,
                'receiver_id' => $bid->investor_id,
                'customer_id' => $owner->id,
                'text' => 'Your bid to business '.$business->name.' was cancelled.',
                'link' => 'investment-bids',
                'type' => 'business',
              ]);
            //Notifications
              AcceptedBids::where('id',$bidId)->delete();
        }
         
         return redirect()->to(config('app.app_url').'dashboard')->send();
     
       }
        catch(\Exception $e){
            //return $e->getMessage();
            return redirect()->to(config('app.app_url').'dashboard')->send();
       }  
}


public function CancelEquipmentRelease($bidId, $action)
{   
    $bidId = base64_decode($bidId); 
    try { 
        $bid = AcceptedBids::where('id',$bidId)->first();
        $investor = User::select('fname','fname','email')->where('id',$bid->investor_id)->first();
        $inv_name = $investor->fname.' '.$investor->fname;
        $business = Listing::select('name','user_id','id')->where('id',$bid->business_id)->first();
        $owner = User::select('email','id')->where('id',$business->user_id)->first();

        if($action == 'confirm')
        {
            $info=[ 'business_name'=>$business->name, 'business_owner'=>$bid->business_id, 'manager'=>$bid->project_manager, 'bid_id'=> base64_encode($bidId)];
            
            $user['to'] = $investor->email;
            Mail::send('bids.eqp_cancel_confirm', $info, function($msg) use ($user){
                $msg->to($user['to']);
                $msg->subject('Equipment Cancel Confirmation!');
            });

            //Notifications
             $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
             $addNoti = Notifications::create([
                'date' => $date,
                'receiver_id' => $bid->investor_id,
                'customer_id' => $owner->id,
                'bid_id' => $bidId,
                'text' => 'Your bid to business '.$business->name.' will be cancelled.',
                'link' => 'eqp_cancel_confirm',
                'type' => 'business',
              ]);
          //Notifications
        }
        else
        {
            $info=['investor'=>$inv_name,'type'=>$bid->type,'business_name'=>$business->name];
            $user['to'] = $owner->email; //'tottenham266@gmail.com';
             Mail::send('bids.cancelled', $info, function($msg) use ($user){
                 $msg->to($user['to']);
                 $msg->subject('Bid Cancel!');
             });

            //Notifications
             $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
             $addNoti = Notifications::create([
                'date' => $date,
                'receiver_id' => $owner->id,
                'customer_id' => $bid->investor_id,
                'text' => 'A bid to business '.$business->name.' was cancelled by '.$inv_name,
                'link' => 'investment-bids',
                'type' => 'business',
              ]);

             $addNoti2 = Notifications::create([
                'date' => $date,
                'receiver_id' => $bid->investor_id,
                'customer_id' => $owner->id,
                'text' => 'Your bid to business '.$list->name.' was cancelled.',
                'link' => 'investment-bids',
                'type' => 'business',
              ]);
            //Notifications
              AcceptedBids::where('id',$bidId)->delete();
        }

         return redirect()->to(config('app.app_url').'dashboard')->send();
     
       }
        catch(\Exception $e){
            //return $e->getMessage().config('app.app_url/dashboard');
            return redirect()->to(config('app.app_url').'dashboard')->send();
       }  
}


public function CancelBookingConfirm($booking_id, $action)
{   
    $booking_id = base64_decode($booking_id); 
    try { 
        $bid = serviceBook::where('id',$booking_id)->first();
        if(!$bid) 
        return response()->json(['message'=>'Bid does not exist!', 'status'=>400]);

        $booker = User::select('fname','lname','email','id')
        ->where('id',$bid->booker_id)->first();
        $business = Services::select('name','shop_id','id')->where('id',$bid->service_id)->first();
        $owner = User::select('email','id')->where('id',$business->shop_id)->first();
        $booker_name = $booker->fname.' '.$booker->lname;
        $s_id = base64_encode(base64_encode($business->id));

        if($action == 'confirm')
        {
            $info=[ 'business_name'=>$business->name, 'booking_id'=>
             base64_encode($booking_id), 's_id' => $s_id ];
            
            $user['to'] = $booker->email;
            Mail::send('services.booking_cancel_confirm', $info, function($msg) use ($user){
                $msg->to($user['to']);
                $msg->subject('Booking Cancel Confirmation!');
            });

            //Notifications
             $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
             $addNoti = Notifications::create([
                'date' => $date,
                'receiver_id' => $bid->booker_id,
                'customer_id' => $owner->id,
                'bid_id' => $booking_id,
                'text' => 'Your booking to Service '.$business->name.' will be cancelled with.',
                'link' => 'booking_cancel_confirm',
                'type' => 'service',
              ]);
          //Notifications
        }
        else
        {
            $info=['investor'=>$booker_name,'business_name'=>$business->name];
            $user['to'] = $owner->email; //'tottenham266@gmail.com';
             Mail::send('services.booking_cancelled', $info, function($msg) use ($user){
                 $msg->to($user['to']);
                 $msg->subject('Booking Cancel!');
             });

            //Notifications
             $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
             $addNoti = Notifications::create([
                'date' => $date,
                'receiver_id' => $owner->id,
                'customer_id' => $booker->id,
                'text' => 'A booking to Service '.$business->name.' was cancelled by '.$booker_name,
                'link' => 'service-bookings',
                'type' => 'service',
              ]);

             $addNoti2 = Notifications::create([
                'date' => $date,
                'receiver_id' => $booker->id,
                'customer_id' => $owner->id,
                'text' => 'Your bid to Service '.$business->name.' was cancelled.',
                'link' => 'service-bookings',
                'type' => 'service',
              ]);
            //Notifications
              ServiceBook::where('id',$booking_id)->delete();

              if($action == 'ok_response')
              return response()->json(['status'=>200, 'message'=> 'Booking Cancelled!']);
        }

         return redirect()->to(config('app.app_url').'dashboard')->send();
     
       }
        catch(\Exception $e){
            return $e->getMessage();
            return redirect()->to(config('app.app_url').'dashboard')->send();
       }  
}


public function releaseEquipment($business_id, $manager_id, $bid_id){
//if(!$this_bid) return response()->json(['error:'=>'Bid does not exist!']);
    $b = Listing::select('name','user_id')->where('id',$business_id)->first();
    $b_name = $b->name;
    $b_owner = User::select('id','fname','lname','email')->where('id',$b->user_id)
    ->first();
    $manager = User::select('id','fname','lname','email')->where('id',$manager_id)
    ->first();
    $investor = User::select('id','fname','lname','email')->where('id',Auth::id())
    ->first();

    $b_owner_name = $b_owner->fname.' '.$b_owner->lname;
    $manager_name = $manager->fname.' '.$manager->lname;
    $investor_name = $investor->fname.' '.$investor->lname;

  try
  {  
    //Voting
          $voting = $this->agreeToProgressWithReleaseEqp($bid_id);

    //Notification to B Owner
            $info=['investor_name'=>$investor_name, 'contact'=>$investor->email,
            'owner_name'=>$manager_name,'contact2'=>$manager->email,'b_name' => $b_name, 'to'=>'BO'];
            $user['to'] = $b_owner->email;
            $mail2 =  Mail::send('bids.manager_eqp_alert', $info, function($msg) use ($user){
                 $msg->to($user['to']);
                 $msg->subject('Equipment released!');
             });

            $text = 'Equipment X from '.$investor_name.' is ready to release.';
            $this->createNotification($b_owner->id,$investor->id,$text
                ,'/','investor');

    //Notification to Project Manger
            $info=['investor_name'=>$investor_name, 'contact'=>$investor->email,
            'owner_name'=>$b_owner_name,'contact2'=>$b_owner->email,'b_name' => $b_name, 'to'=>'PM'];
            $user['to'] = $manager->email;
            $mail2 =  Mail::send('bids.manager_eqp_alert', $info, function($msg) use ($user){
                 $msg->to($user['to']);
                 $msg->subject('Equipment released!');
             });

            $text = 'Equipment from '.$investor_name.' is ready to release.';
            $this->createNotification($manager->id,$investor->id,$text
                ,'/','investor');

          //Update Status
             AcceptedBids::where('id',base64_decode($bid_id))->update([
              'status' => 'equipment_released']);
             return response()->json(['status' => 200, 'message' 
                =>'?agreetobid=equipment_released']);


    //return response()->json(['status' => 200, 'business' => $b_name,'manager' => $manager_name,'owner' => $b_owner_name,'investor' => $investor_name, 'message' =>'Success' ]);
  }
  catch(\Exception $e){
    return response()->json(['status' => 400, 'message' =>$e->getMessage()]);
  }
    
}


public function agreeToMileS($rep_id,$booker_id)
{
    try{

    $mileThis = ServiceMileStatus::select('id','service_id','amount','title')
    ->where('id',$rep_id)->first();

    if(!$mileThis) return 'dont exist';

    $mileLat = ServiceMileStatus::where('service_id',$mileThis->service_id)
    ->where('booker_id',$booker_id)->where('status','To Do')->first();
    $serv= Services::select('shop_id')->where('id',$mileThis->service_id)->first();
    $owner = User::select('id','connect_id')->where('id',$serv->shop_id)->first();

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

        $text = 'Milestone payment for '.$mileThis->title.' has been released.';
        $this->createNotification($owner->id,null,$text,'/',' service');

        $text = 'Milestone payment for '.$mileThis->title.' has been released. Next Milestone is in progress';
        $this->createNotification($booker_id,null,$text,'/',' service');

        //Check if Service is done
        $Last = ServiceMileStatus::where('service_id',$mileThis->service_id)
        ->where('booker_id',$booker_id)->where('status','To Do')
        ->orWhere('status','In Progress')->first();

        if(!$Last)
        {
            $info=[ 's_id' => $business->id, 'owner' => $owner->fname. ' '.$owner->lname, ]; 

            $user['to'] = $customer->email;//'sohaankane@gmail.com';
             Mail::send('service_done_mail', $info, function($msg) use ($user){
                 $msg->to($user['to']);
                 $msg->subject('Service Done!');
             });  
        }

        return redirect()->to(config('app.app_url').'service-milestones/'.$s_id);
    }
   catch(\Exception $e){
        return $e->getMessage();
        return redirect()->to(config('app.app_url'));
   }  
    
}


public function agreeToNextmile($bidId)
{
    try { 
        AcceptedBids::where('id',$bidId)->update([
              'next_mile_agree' => 1       
        ]);

        //VOTE COUNT
        $total_vote = 0;
        $bid = AcceptedBids::where('id',$bidId)->first();
        $listing = listing::where('id',$bid->business_id)->first();
        $share = $listing->investment_needed;//$listing->share;
        $nextMileAgree = AcceptedBids::where('business_id',$bid->business_id)
        ->where('ms_id',$bid->ms_id)->where('next_mile_agree',1)->get();
        foreach($nextMileAgree as $agree)
        {   $next_vote = ($agree->amount)/$share;
            $next_vote = round($next_vote*10,1);
            if($agree->project_manager != null)
            $next_vote = $next_vote+1;

            $total_vote = $total_vote+$next_vote;
        } 
        
        if($total_vote >= 5.1)
        {   
            $milestone = Milestones::where('listing_id',$bid->business_id)
            ->where('status','To Do')->first();
            Milestones::where('id',$milestone->id)
            ->update(['status' => 'In Progress']);
        }
        //VOTE COUNT
        return redirect()->to(config('app.app_url').'?agreetonext=yes'); 
       }
        catch(\Exception $e){
            return redirect()->to(config('app.app_url'));
       }  
}  


public function milestoneCommits($amount,$business_id,$percent){
  try{

   if(Auth::check())
        $investor_id = Auth::id();
    else {
        if(Session::has('investor_email')){   
        $mail = Session::get('investor_email');
        $investor = User::where('email',$mail)->first();
        $investor_id = $investor->id;
      }
    }

    $type = 'Monetary';
    $bids = BusinessBids::create([
      'date' => date('Y-m-d'),
      'investor_id' => $investor_id,
      'business_id' => $business_id,
      'type' => $type,
      'amount' => $amount,
      'representation' => $percent
    ]);

if($bids)
  return response()->json(['success' => 'Success!']);
}

catch(\Exception $e){
  return response()->json(['failed' =>  $e->getMessage()]);
}

}

public function  bidCommitsEQP(Request $request){ 
  $obj = new testController();
  try{ 

   if(Auth::check())
        $investor_id = Auth::id();
    else {
        if(Session::has('investor_email')){   
        $mail = Session::get('investor_email');
        $investor = User::where('email',$mail)->first();
        $investor_id = $investor->id;
      }
    }

        $listing_id=$request->listing_id;
        $amount=$request->amount;
        $percent=$request->percent;
        $serial=$request->serial;

        $legal_doc=$request->file('legal_doc');
        $optional_doc=$request->file('optional_doc');
        $photos=$request->file('photos');

// DOCS UPLOAD
        //$total_img='';
          if($photos !='') {
          if (!file_exists('files/bidsEquip/'.$listing_id.'/'.$investor_id)) 
          mkdir('files/bidsEquip/'.$listing_id.'/'.$investor_id, 0777, true);

            //foreach ($photos as $single_img) { 
          $uniqid=hexdec(uniqid());
          $ext=strtolower($photos->getClientOriginalExtension());
          $create_name=$uniqid.'.'.$ext;
          $loc = 'files/bidsEquip/'.$listing_id.'/'.$investor_id.'/';
          //Move uploaded file
          $up_img=$loc.$create_name;

          //Compress
          $compressedImage = $obj->compressImage($photos, $up_img, 60);
          $final_img=$this->api_base_url.$up_img;

          //$total_img = $total_img.$final_img.',';
            //}
           } 

          if($legal_doc) { 
          $uniqid=hexdec(uniqid());
          $ext=strtolower($legal_doc->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            return response()->json(['failed' => 'For business document, Only pdf & docx are allowed!']);
          } 
          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/bidsEquip/'.$listing_id.'/'.$investor_id)) 
          mkdir('files/bidsEquip/'.$listing_id.'/'.$investor_id, 0777, true);

          $loc='files/bidsEquip/'.$listing_id.'/'.$investor_id.'/';
          //Move uploaded file
          $legal_doc->move($loc, $create_name);
          $final_legal_doc=$loc.$create_name;
             }else $final_legal_doc='';


          if($optional_doc) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($optional_doc->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            return response()->json(['status' => 400, 'message' => 'For business document, Only pdf & docx are allowed!']);
          }
          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/bidsEquip/'.$listing_id.'/'.$investor_id)) 
          mkdir('files/bidsEquip/'.$listing_id.'/'.$investor_id, 0777, true);

          $loc='files/bidsEquip/'.$listing_id.'/'.$investor_id.'/';
          //Move uploaded file
          $optional_doc->move($loc, $create_name);
          $final_optional_doc=$loc.$create_name;
             }else $final_optional_doc='';
                
// DOCS UPLOAD
    $Business = listing::where('id',$listing_id)->first();
    $type = 'Asset';
    $bids = BusinessBids::create([
      'date' => date('Y-m-d'),
      'investor_id' => $investor_id,
      'business_id' => $listing_id,
      'owner_id' => $Business->user_id,
      'type' => $type,
      'amount' => $amount,
      'representation' => $percent,
      'serial' => $serial,
      'legal_doc' => $final_legal_doc,
      'optional_doc' => $final_optional_doc,
      'photos' => $final_img
    ]);

    if($bids){
    // Milestone Fulfill check
    $total_bid_amount = 0; $business_id = $listing_id;
    $mile1 = Milestones::where('listing_id',$business_id)
    ->where('status','In Progress')->first();
    $this_bids = BusinessBids::where('business_id',$business_id)->get();
    foreach($this_bids as $b)
    $total_bid_amount = $total_bid_amount+($b->amount);

    $list = listing::select('id','user_id','name')->where('id',$business_id)->first();
    if($total_bid_amount >= $mile1->amount && $list->threshold_met == null){
        listing::where('id',$business_id)->update(['threshold_met' => 1]);

        $owner = User::select('id','email')->where('id',$list->user_id)->first();
        $info=[ 'business_name'=>$list->name ];
        $user['to'] = $owner->email; //'tottenham266@gmail.com'; //$owner->email;
         Mail::send('bids.mile_fulfill', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Fulfills a milestone!');
         });

        //Notifications
         $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
         $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $owner->id,
            'customer_id' => $investor_id,
            'text' => 'A milestone for your business '.$Business->name.' can now be fulfilled. You can start reviewing/accepting bids as well.',
            'link' => 'investment-bids',
            'type' => 'investor',

          ]);
        //Notifications
     }
     // Milestone Fulfill check

     //Notifications
         $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
         $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $owner->id,
            'customer_id' => $investor_id,
            'text' => 'You have a new bid from _name!',
            'link' => 'investment-bids',
            'type' => 'investor',

          ]);
         //Notifications

      return response()->json(['status' => 200, 'message' => 'Success! You will get a notifications if your bid is accepted!']);
    }
}

    catch(\Exception $e){
      return response()->json(['status' => 400,'message' =>  $e->getMessage()]);
    }

}


public function bookingAccepted(Request $request)
{
    
        $bid_ids = $request->bid_ids;

        try {
        foreach($bid_ids as $id){
        if($id !=''){
        $bid = serviceBook::where('id',$id)->first();
        
        if($bid)
        { 
        $investor = User::select('id','email')->where('id',$bid->booker_id)
        ->first();
        $investor_mail = $investor->email;
        $list = Services::select('id','name')->where('id',$bid->service_id)
        ->first();
        $confirm = serviceBook::where('id',$id)->update(['status' => 'Confirmed']);

        //Replicate Miles
        $booker_id = $bid->booker_id;
        $service_id = $bid->service_id;
        $this_miles = Smilestones::where('listing_id',$service_id)->get();
        $i = 1;
        foreach($this_miles as $mile){
        if($i == 1) $active = 1; else $active = 0;
            ServiceMileStatus::create([
                'mile_id' => $mile->id,
                'service_id' => $service_id,
                'booker_id' => $booker_id,
                'title' => $mile->title,
                'amount' => $mile->amount,
                'document' => $mile->document,
                'active' => $active,
                'status' => 'To Do',
                'created_at' => $mile->created_at,
                'n_o_days' => $mile->n_o_days
                
            ]); $i++;
        }
        //Replicate Miles

        //Notifications
         $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
         $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $booker_id,
            'customer_id' => $service_id,
            'text' => 'Your booking to _name has been accepted!',
            'link' => 'mybookings',
            'type' => 'service',

          ]);
         //Notifications

        $info=['business_name'=>$list->name,'s_id'=>base64_encode(base64_encode($list->id)), 'booking_id'=>base64_encode($id), 'reason' => 0];
        $user['to'] = $investor_mail;
         Mail::send('services.booking_mail', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Booking accepted!');
         });

        }

       }
       }
        Session::put('success','Confirmed!');
        return response()->json(['status' => 200, 'message' => 'Success']);
     
       }
        catch(\Exception $e){
            Session::put('failed',$e->getMessage());
            return response()->json(['status' => 400, 'message'=>$e->getMessage()]);
       }  

   }


   //REJECT BOOKING
   public function bookingRejected(Request $request)
   {
    
    $bid_ids = $request->bid_ids;
    try {
    foreach($bid_ids as $id){
    if($id !=''){
        $bid = serviceBook::where('id',$id)->first();
        $investor = User::select('id','email')->where('id',$bid->booker_id)
        ->first(); $investor_mail = $investor->email;

        $list = Services::select('id','name')->where('id',$bid->service_id)
        ->first(); $remove = serviceBook::where('id',$id)->delete();
        $reason = 'Unknown Reason';

        //Notifications
         $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
         $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $booker_id,
            'customer_id' => $service_id,
            'text' => 'Your booking to _name has been rejected due to '.$reason,
            'link' => 'mybookings',
            'type' => 'service',
          ]);

         $info=['business_name'=>$list->name,'s_id'=>base64_encode(base64_encode($list->id)), 'reason' => $reason ]; $user['to'] = $investor_mail;
         Mail::send('services.booking_mail', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Booking Rejected!');
         }); 
        //Notifications   

    }
    }
        Session::put('success','Rejected!');
        return response()->json(['status' => 200, 'message' => 'Success']);
     
    }
    catch(\Exception $e){
        Session::put('failed',$e->getMessage());
        return response()->json(['status' => 400, 'message'=>$e->getMessage()]);
    }  

   }


   public function agreeToProgressWithReleaseEqp($bidId)
   {   
    $bidId = base64_decode($bidId);
    try { 
        $bid = AcceptedBids::select('ms_id','business_id','owner_id','investor_id')
        ->where('id',$bidId)->first();
        $agreeVote = AcceptedBids::where('id',$bidId)
        ->where('ms_id',$bid->ms_id)->update([
            'investor_agree' => 1       
        ]);//$business_id = base64_encode(base64_encode($bid->business_id));

        //Release Payment - VOTE COUNT
        $t_mo_amount=0; $t_rating=0; $release = array();$i=0;
        $listing = listing::select('id','name','user_id','share','investment_needed')
        ->where('id',$bid->business_id)->first();
        $share = $listing->share; //50%
        $needed = $listing->investment_needed; // 1000

        $investor_agree = AcceptedBids::where('business_id',$bid->business_id)
        ->where('ms_id',$bid->ms_id)->where('investor_agree',1)->get();
        
        $owner = User::select('connect_id','email')->where('id',$listing->user_id)
        ->first();
        $milestone = Milestones::select('title','amount')->where('id',$bid->ms_id)
             ->first();

        foreach($investor_agree as $Iagree)
        {   $bid_amount = ($Iagree->amount);
            $rating = round(($bid_amount/$milestone->amount)*10, 2);
            if($Iagree->project_manager != null)
            $rating = $rating+1;

            $t_rating = $t_rating+$rating;
            $release[$i]['amount'] = $bid_amount;
            $release[$i]['type'] = $Iagree->type;
            $release[$i]['stripe_charge_id'] = $Iagree->stripe_charge_id; $i++;
            //echo '('.$bid_amount.'/'.$needed.'\n';echo $rating.' ),';

            if($Iagree->type == 'Monetary')
                $t_mo_amount = $t_mo_amount+$bid_amount;

        }  
        
        if($t_rating >= 5.10)
        {   
            //Release
            foreach ($release as $releasing) {
                if($releasing['type'] == 'Monetary'){
                $curr='USD'; //$request->currency; 
                $tranfer = $this->Client->transfers->create ([ 
                        //"billing_address_collection": null,
                        "amount" => $releasing['amount']*100, //100*100,
                        "currency" => $curr,
                        //"source_transaction" => $releasing['stripe_charge_id'],
                        'destination' => $owner->connect_id
                ]);
                }
                
            }

             //Notifications
             $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
             $addNoti = Notifications::create([
                'date' => $date,
                'receiver_id' => $bid->owner_id,
                'customer_id' => $bid->investor_id,
                'bid_id' => $bidId,
                'text' => 'All payments for Milestone '.$milestone->title.' of Business '
                .$listing->name.' are now released!',
                'link' => '/',
                'type' => 'investor',
              ]);
            
             // //Email
             // $info=[ 'business_name'=>$listing->name ];
             // $user['to'] = $owner->email; //'tottenham266@gmail.com'; //
             // if($owner)
             //    Mail::send('bids.verify_request', $info, function($msg) use ($user){
             //     $msg->to($user['to']);
             //     $msg->subject('Equipment Verify request!');
             // });
             //Notifications
            //Release
        }
        //Release Payment - VOTE COUNT
       if($addNoti)
       return $t_rating;
        else return $t_rating.'no';

       //return redirect()->to(config('app.app_url').'dashboard?agreetobid=equipment_released');
     
       }
        catch(\Exception $e){
            return $e->getMessage();
            //return redirect()->to(config('app.app_url'));
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



    //Class Ends Below
}
