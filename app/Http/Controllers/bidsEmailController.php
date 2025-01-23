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
         if($bid->type == 'Monetary' && $bid->paystack_charge_id){
            //Paystack Refund
         }

         if($bid->type == 'Monetary' && $bid->stripe_charge_id)
         $this->Client->refunds->create(['charge' => $bid->stripe_charge_id]);
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

         $list = listing::where('id',$bid->business_id)->first();
         $owner = User::where('id',$list->user_id)->first();
         $recipient = $owner->paystack_acc_id;
         $usdToKen = 100*128.5;

         //TRANSFERRING FUNDS
         if($bid->type == 'Monetary' && $bid->paystack_charge_id)
         {    $bidAmountKen = $bid->amount*$usdToKen;
              $url = "https://api.paystack.co/transfer"; 
              $fields = [
                "source" => "balance", "reason" => "Calm down", 
                "amount" => $bidAmountKen, "recipient" => $recipient];
              $fields_string = http_build_query($fields);$ch = curl_init();
              curl_setopt($ch,CURLOPT_URL, $url);
              curl_setopt($ch,CURLOPT_POST, true);
              curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
              curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                "Authorization: Bearer sk_test_fb3bf64f0b4da439f52bf6b482fa7395a5b4511b",
                "Cache-Control: no-cache",
              ));
              curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 
              $result = curl_exec($ch);
              //echo '<pre>'; print_r($result); echo '<pre>';
         }

         if($bid->type == 'Monetary' && $bid->stripe_charge_id)
         {
                //Split
                    $curr='USD'; //$request->currency; 
                    $tranfer = $this->Client->transfers->create ([ 
                            //"billing_address_collection": null,
                            "amount" => $bid->amount*100, //100 * 100,
                            "currency" => $curr,
                            "source_transaction" => $bid->stripe_charge_id,
                            'destination' => $owner->connect_id
                    ]);
                //Stripe
         }
         //TRANSFERRING FUNDS

              $accepted =  AcceptedBids::create([
              'bid_id' => $id,
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
              'photos' => $bid->photos
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
                base64_encode($accepted->id), 'type' => $bid->type ];
                $user['to'] = $investor_mail; //'tottenham266@gmail.com'; //
                 if($investor)
                    Mail::send('bids.accepted', $info, function($msg) use ($user){
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


public function agreeToBid($bidId)
{
    try { 
        $bid = AcceptedBids::where('bid_id',$bidId)->first();
        AcceptedBids::where('bid_id',$bidId)->update([
              'investor_agree' => 1       
        ]);
        $business_id = base64_encode(base64_encode($bid->business_id));
        Session::put('login_success','Thanks for your review, you will get an email when this milestone completes!');
       return redirect()->to(config('app.app_url').'business-milestones/'.$business_id);
     
       }
        catch(\Exception $e){
            Session::put('failed',$e->getMessage());
            return redirect()->to(config('app.app_url'));
       }  
}


public function withdraw_investment($bidId)
{
    try { 
        $bid = AcceptedBids::where('bid_id',$bidId)->first();
        $investor = User::where('id',$bid->investor_id)->first();
        $inv_name = $investor->fname.' '.$investor->lname;

        $business = Listing::where('id',$bid->business_id)->first();
        $owner = User::where('id',$business->user_id)->first();

        if($bid->type == 'Asset'){
            $info=[ 'inv_name'=>$inv_name, 'asset_name'=>$bid->serial ];
            $user['to'] = $owner->email; //'tottenham266@gmail.com';
             Mail::send('bids.bid_cancel', $info, function($msg) use ($user){
                 $msg->to($user['to']);
                 $msg->subject('Milestone Cancel!');
             });
        }

        else{

        }

        
         AcceptedBids::where('bid_id',$bidId)->delete();
         return response()->json(['status'=>200, 'message' => 'Thanks for your feedback!']);
     
       }
        catch(\Exception $e){
            return response()->json(['status'=>400, 'message' => $e->getMessage()]);
       }  
}


public function CancelAssetBid($bidId)
{
    try { 
        $bid = AcceptedBids::where('bid_id',$bidId)->first();
        $investor = User::where('id',$bid->investor_id)->first();
        $inv_name = $investor->fname.' '.$investor->lname;

        $business = Listing::where('id',$bid->business_id)->first();
        $owner = User::where('id',$business->user_id)->first();

        $info=[ 'inv_name'=>$inv_name, 'asset_name'=>$bid->serial ];
        $user['to'] = $owner->email; //'tottenham266@gmail.com'; //$owner->email;

         Mail::send('bids.bid_cancel', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Milestone Cancel!');
         });
         AcceptedBids::where('bid_id',$bidId)->delete();
        return response()->json(['success' => 'Thanks for your feedback!']);
        //return redirect()->to(config('app.app_url'));
     
       }
        catch(\Exception $e){
            return response()->json(['failed' => 'Something went wrong!']);
            //return redirect()->to(config('app.app_url'));
       }  
}



public function agreeToMileS($s_id,$booker_id)
{
    $mileLat = ServiceMileStatus::where('service_id',$s_id)->where('booker_id',$booker_id)->where('status','To Do')->first();

    $s_id = base64_encode(base64_encode($s_id));

    if($mileLat)
    ServiceMileStatus::where('id',$mileLat->id)->update([ 'active' => 1]);
    Session::put('login_success','Thanks for your review, next milestone can be paid for to begin!!');
       return redirect()->to(config('app.app_url').'service-milestones/'.$s_id);
}

public function agreeToNextmile($bidId)
{
    try { 
        AcceptedBids::where('id',$bidId)->update([
              'next_mile_agree' => 1       
        ]);

        //Vote
        $total_vote = 0;
        $bid = AcceptedBids::where('id',$bidId)->first();
        $listing = listing::where('id',$bid->business_id)->first();
        $share = $listing->share;
        $nextMileAgree = AcceptedBids::where('business_id',$bid->business_id)
        ->where('next_mile_agree',1)->get();
        foreach($nextMileAgree as $agree)
        {   $next_vote = ($agree->representation)/$share;
            $next_vote = round($next_vote*10,1);
            if($agree->project_manager == 1)
                $next_vote = $next_vote+1;
            $total_vote = $total_vote+$next_vote;
        } 
        //Vote
        if($total_vote >= 5.1)
        {   
            try{
            $milestone = Milestones::where('listing_id',$bid->business_id)
            ->where('status','To Do')->first();
            Milestones::where('id',$milestone->id)
            ->update(['status' => 'In Progress']);
        }
        catch(\Exception $e){
            Session::put('failed',$e->getMessage());
            return redirect()->to(config('app.app_url'));
       } 
        }

        Session::put('login_success','Thanks for your review, you will get an email when this milestone completes!');
        return redirect()->to(config('app.app_url'));
        //return redirect('/');
     
       }
        catch(\Exception $e){
            Session::put('failed',$e->getMessage());
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
    if($total_bid_amount >= $mile1->amount && !$list->threshold_met){
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
        if($bid){ 
        $investor = User::where('id',$bid->booker_id)->first();
        $investor_mail = $investor->email;

        $list = Services::where('id',$bid->service_id)->first();
        $info=['business_name'=>$list->name,'s_id'=>base64_encode(base64_encode($list->id))];
        $user['to'] = $investor_mail;
         Mail::send('services.booking_mail', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Booking accepted!');
         });

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

         }

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

       }
       }
        Session::put('success','Confirmed!');
        return response()->json(['message' => 'Success']);
     
       }
        catch(\Exception $e){
            Session::put('failed',$e->getMessage());
            return response()->json(['message' => $e->getMessage()]);
       }  

   }



    //Class Ends Below
}
