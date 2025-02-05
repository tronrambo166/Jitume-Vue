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
use App\Models\serviceBook;
use App\Models\ServiceMileStatus;
use Session; 
use Hash;
use Auth;
use Mail;
use Stripe\StripeClient;
use App\Models\taxes;
use App\Models\BusinessBids;
use App\Models\BusinessSubscriptions;
use App\Models\AcceptedBids;
use App\Models\Notifications;


class checkoutController extends Controller
{
     public function __construct(StripeClient $client)
    {
        $this->Client = $client;
    }

    //UNLOCK PAYMENT
     public function goCheckout($amount, $listing_id)
    {
      // $id=$request->id;
      // $listing=$request->listing;
      // $value=$request->value;
      // $amount=$request->amount;
      $listing=base64_decode($listing_id);

      $base_price=base64_decode($amount);
      $price = round( $base_price+($base_price*0.05),2 );
      //$ids=Crypt::decryptString($ids);

    Session::put('small_fee_new_price', $price);
      
        return view('checkout.stripe',compact('price','listing'));
    }

   
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */

     public function stripeConversation(Request $request)
    {   
        $listing_id=$request->listing;
        $package=$request->package;

        //Stripe
    try{ 

        $curr='USD'; //$request->currency; 
        $amount= $request->amount; //Session::get('small_fee_new_price'); //$request->price;
        $transferAmount= round($amount-($amount*.05),2);


        $this->validate($request, [
            'stripeToken' => ['required', 'string']
        ]); 
        $charge = $this->Client->charges->create ([ 
                //"billing_address_collection": null,
                "amount" => $amount*100, //100 * 100,
                "currency" => $curr,
                "source" => $request->stripeToken,
                "description" => "This payment is test purpose only!"
        ]);
        
        }
      catch(\Exception $e){
      return response()->json(['status' => 400, 'message' => $e->getMessage()]);
      //return redirect()->back();
    }


    $business_id = $request->listing;
    $Business = listing::where('id',$business_id)->first();
    $owner = User::where('id', $Business->user_id)->first();

//Split
 try{

        $curr='USD'; //$request->currency; 
        $tranfer = $this->Client->transfers->create ([ 
                //"billing_address_collection": null,
                "amount" => $transferAmount*100, //100 * 100,
                "currency" => $curr,
                "source_transaction" => $charge->id,
                'destination' => $owner->connect_id
        ]);

        //DB INSERT
        Conversation::create([
            'investor_id' => Auth::id(),
            'listing_id' => $listing_id,
            'package' => $package,
            'price' => $amount
        ]); 
       return response()->json(['status' => 200, 'message' => 'success']);
      }

 catch(\Exception $e){
  return response()->json(['status' => 400, 'message' => $e->getMessage()]);
}

 //Stripe


}

    //UNLOCK PAYMENT



     //__________________________SUBSCRIBE________________________
     public function stripeSubscribeGet($amount,$plan,$days,$range,$inv_id)
    {
      //$listing=base64_decode($listing_id);
      $days=base64_decode($days);
      $range=base64_decode($range);
      $plan=base64_decode($plan);
      $base_price=base64_decode($amount);
      $price = round( $base_price+($base_price*0.05),2 );
      Session::put('subscribe_price', $price); 

    //If trial
      $trial_price = 0;
      if($plan == 'silver-trial'){ $trial_price = 9.99;  $payLink = 'https://buy.stripe.com/test_aEU4jm4kNg0PgF2000'; }

      else if($plan == 'gold-trial'){ $trial_price = 29.99; $payLink = 'https://buy.stripe.com/test_4gw3fi18B6qffAY3cd'; }

      else if($plan == 'platinum-trial'){ $trial_price = 69.99; $payLink = 'https://buy.stripe.com/test_00g9DGeZr15V88w5km'; }

      else $trial_price = $price;

      if($price == 0)
        echo "<script>location.href='$payLink'</script>";
        //return view('checkoutSubscribe.stripe',compact('price','plan','payLink','trial_price','base_price'));
    //If trial

      if($plan == 'silver' && $days == 30) $price_id = 'price_1O6uaiJkjwNxIm6zzQ5b2t46';
      if($plan == 'gold' && $days == 30) $price_id = 'price_1M7aX9JkjwNxIm6z5ut8ixWC';
      if($plan == 'platinum' && $days == 30) $price_id = 'price_1O7bheJkjwNxIm6zutl9T3HR';

      if($plan == 'silver' && $days == 365) $price_id = 'price_1O7bXyJkjwNxIm6zpTcQdjYg';
      if($plan == 'gold' && $days == 365) $price_id = 'price_1O7bdzJkjwNxIm6zwGCyyLpg';
      if($plan == 'platinum' && $days == 365) $price_id = 'price_1O7bhfJkjwNxIm6zMLsZZTGP';
//
      $session = $this->Client->checkout->sessions->create([
              // https://test.jitume.com, http://127.0.0.1:8000
              'success_url' => 'https://test.jitume.com/stripeSubscribeSuccess?session_id={CHECKOUT_SESSION_ID}',
              'cancel_url' => 'https://example.com/canceled.html',
              'mode' => 'subscription',
              'line_items' => [[
                'price' => $price_id,
                // For metered billing, do not pass quantity
                'quantity' => 1
              ]],
              'client_reference_id' =>$plan.'_'.$range.'_'.$inv_id
            ]);
            echo "<script>location.href='$session->url'</script>";
            //header("Location: " . $session->url);

      //return view('checkoutSubscribe.stripe',compact('price','plan','days','range','trial_price','base_price'));
    }


     public function stripeSubscribeSuccess()
    {
        $session_id = $_GET['session_id'];
        $checkout = $this->Client->checkout->sessions->retrieve(
          $session_id,
          []
        );

        //echo '<pre>'; print_r($checkout);  echo '<pre>'; exit;
        $stripe_sub_id = $checkout->subscription;
        $user_email = $checkout->customer_details->email;

        if($checkout->amount_total == 0){
          $inv = User::where('email', $user_email)->first();

          if(!$inv)
          return response()->json(['error' => 'Your email was not found in Jitume database!']);

          $investor_id = $inv->id;

            $sub = $this->Client->subscriptions->retrieve(
              $stripe_sub_id, []
        );
          
        $transferAmount=0;
        $original_amount = ($sub->items->data[0]->plan->amount)/100;
        if($original_amount == 69.99) $plan = 'platinum-trial';
        if($original_amount == 29.99) $plan = 'gold-trial';
        if($original_amount == 9.99) $plan = 'silver-trial';
        $range = null;
       }

       else{

        $original_amount = ($checkout->amount_total)/100;
        $transferAmount=($checkout->amount_total)/100;
        $plan_range=explode('_',$checkout->client_reference_id);
        $plan = $plan_range[0];
        $range = $plan_range[1];
        $investor_id = $plan_range[2];
       }

       //echo $investor_id; exit;

       
        $start_date = date('Y-m-d');
        $expire_date = date('Y-m-d', strtotime($start_date. '+30 days'));

        $token_remaining = null;
        if($plan == 'silver' || $plan=='silver-trial' || $plan=='gold-trial'){
            $token_remaining = 10;
        }

        $trial = 0;
        if($plan=='silver-trial' || $plan=='gold-trial' || $plan =='platinum-trial'){
            $trial = 1;
            $expire_date = date('Y-m-d', strtotime($start_date. '+7 days'));
        }

        if($plan == 'gold')
          $token_remaining = 30;

    //Stripe
    //$investor_id = base64_decode($investor_id);

    if($investor_id == '' || $investor_id == null)
      $investor_id = Auth::id();

    try{

         //DB INSERT
         BusinessSubscriptions::create([
        'plan' => $plan,
        'investor_id' => $investor_id,
        'amount' => $transferAmount,
        'start_date' => $start_date,
        'expire_date' => $expire_date,
        'token_remaining' => $token_remaining,
        'chosen_range' => $range,
        'trial' => $trial,
        'stripe_sub_id' => $stripe_sub_id
        ]); 

        if($trial == 1)
        $message = 'Your trial expires in 7 days';
        else if( $original_amount == 95.99 || $original_amount == 287.99 || $original_amount == 671.99 )
            $message = 'Your '.ucwords($plan).' plan expires in 365 days';
        else
        $message = 'Your '.ucwords($plan).' plan expires in 30 days';
       Session::put('Stripe_pay','Success! '.$message);
       return redirect(config('app.app_url'));

        }
      catch(\Exception $e){
        Session::put('Stripe_failed',$e->getMessage());
        return $e;
        //return response()->json(['message' => $e->getMessage()]);
    }

    //Stripe


    }

    //SUSBCRIPTION
    public function getCurrSubscription(){
    $user_id = Auth::id();
    $subscribed = BusinessSubscriptions::where('investor_id',$user_id)
    ->where('active',1)->orderBy('id','DESC')->first();
    return response()->json(['mySub'=>$subscribed], 200);
    }

     public function cancelSubscription($id)
    {
        $investor_id = Auth::id();
        $subs = BusinessSubscriptions::where('id',$id)->first();

    try{
        $cancel = $this->Client->subscriptions->cancel(
        $subs->stripe_sub_id,[]
        );
        return response()->json(['message'=>'Subscription canceled!'], 200);
    }
    catch(\Exception $e){
        BusinessSubscriptions::where('id',$id)->delete();
        return response()->json(['message'=>'Subscription does not exist!'], 400);
    }


        BusinessSubscriptions::where('id',$id)->update(['active' => 0]);

        BusinessSubscriptions::where('id',$id)->delete();
        return response()->json(['message'=>'Subscription canceled!'], 200);
    }
//SUBSCRIBE________________________



    public function stripePost(Request $request)
    {
    $id = $request->id;
    $listing_id = $request->listing;
    $amount = $request->value;
    $realAmount = $request->realAmount;


    //Stripe
    try{

        $curr='USD'; //$request->currency; 
        $amount=$request->price;
        $transferAmount=$amount-($amount*.05);

        $this->validate($request, [
            'stripeToken' => ['required', 'string']
        ]);
        $charge = $this->Client->charges->create ([ 
                //"billing_address_collection": null,
                "amount" => $amount*100, //100 * 100,
                "currency" => $curr,
                "source" => $request->stripeToken,
                "description" => "This payment is test purpose only!"
        ]);
        }
      catch(\Exception $e){
      Session::put('Stripe_failed',$e->getMessage());
      return redirect()->back();
    }

    $business_id = $request->listing;
    $Business = listing::where('id',$business_id)->first();
    $owner = User::where('id', $Business->user_id)->first();

//Split
 try{

        $curr='USD'; //$request->currency; 
        $tranfer = $this->Client->transfers->create ([ 
                //"billing_address_collection": null,
                "amount" => $transferAmount*100, //100 * 100,
                "currency" => $curr,
                "source_transaction" => $charge->id,
                'destination' => $owner->connect_id
        ]);
        }

catch(\Exception $e){
  Session::put('Stripe_failed',$e->getMessage());
    return redirect()->back();
}

 //Stripe

   

//DB INSERT
    $investor = User::where('id',Auth::id())->first();
    $Equipment = Equipments::where('id',$id)->first();
    Equipments::where('id',$id)->update([
        'status' => 'inactive'
    ]);

    $listing = listing::where('id',$listing_id)->first();
    $old_amount = $listing->investment_needed;
    $old_share = $listing->share;
    $new_share = ($amount*$old_share)/$old_amount;

    if($old_amount<$amount)
    return response()->json(['response' => '<p class="font-weight-bold text-danger">Error: Value needed is less than given value!</p>'] );

    listing::where('id',$listing_id)->update([
        'investment_needed' => $old_amount-$amount,
        'share' => $old_share-$new_share
    ]); 

        $info=['eq_name'=>$Equipment->eq_name, 
            'Name'=>$investor->name,'amount'=>$amount,
            'email' => $investor->email, 'type'=>'invest']; 

        $user['to'] = 'sohaankane@gmail.com';//$listing->contact_mail;

        Mail::send('invest_mail', $info, function($msg) use ($user){
            $msg->to($user['to']);
            $msg->subject('Test Invest Alert!');
        });  


       Session::put('Stripe_pay','Invest request sent successfully!');
       return redirect("/");

    }



     public function milestoneCheckout(Request $request)
    {

    if(Auth::check())
                $investor_id = Auth::id();
            else {
                if(Session::has('investor_email')){   
                $mail = Session::get('investor_email');
                $investor = User::where('email',$mail)->first();
                $investor_id = $investor->id;
              }
            }

    $tax = taxes::where('id',1)->first();
    $tax = $tax->tax+$tax->vat;
    $amount =($request->amount)+($request->amount)*($tax/100);
    $milestone_id =$request->milestone_id;

                //First ML check
                $discount='';
                $first_ml = Milestones::where('investor_id',$investor_id)->where('status','Done')->first();

                $conv = Conversation::where('investor_id',$investor_id)
                ->where('listing_id',$request->lisitng_id)->first();
                
                if(!$first_ml && $conv){
                    $amount = $amount-15;
                    $discount = 'discount - $15! from '.($amount+15).' (conversation fee)';
                    
                }
                //Frist ML check
 
        return view('milestone.stripe',compact('amount','milestone_id','tax','discount'));
    }

   
    public function milestoneStripePost(Request $request)
    {
            if(Auth::check())
                $investor_id = Auth::id();
            else {
                if(Session::has('investor_email')){   
                $mail = Session::get('investor_email');
                $investor = User::where('email',$mail)->first();
                $investor_id = $investor->id;
              }
            }

            try{

            $id = $request->milestone_id; //explode(',',$request->ids);
            $mile = Milestones::where('id',$id)->first();    
            $tax = taxes::where('id',1)->first();$tax = $tax->tax+$tax->vat;
            $amount =($mile->amount)+($mile->amount)*($tax/100);
            $user_id = $mile->user_id;

                //First ML check
                $first_ml = Milestones::where('investor_id',$investor_id)->where('status','Done')->first();
                $conv = Conversation::where('investor_id',$investor_id)
                ->where('listing_id',$mile->listing_id)->first();
                if(!$first_ml){
                    $amount = $amount-15;
                }
                //Frist ML check


                //STRIPE
                 $curr='USD'; //$request->currency; 
                 $amount=round($amount);

                Stripe\Stripe::setApiKey('sk_test_51JFWrpJkjwNxIm6zcIxSq9meJlasHB3MpxJYepYx1RuQnVYpk0zmoXSXz22qS62PK5pryX4ptYGCHaudKePMfGyH00sO7Jwion');

                Stripe\Charge::create ([ 

                        //"billing_address_collection": null,
                        "amount" => $amount*100, //100 * 100,
                        "currency" => $curr,
                        "source" => $request->stripeToken,
                        "description" => "This payment is tested purpose only!"
                ]);
           


           //MAIL
                $business = listing::where('id',$mile->listing_id)->first();

                $info=[  'name'=>$mile->title,  'amount'=>$mile->amount, 'business'=>$business->name, ]; 
                $user['to'] = $request->email;//'sohaankane@gmail.com';

                 Mail::send('milestone.milestone_mail', $info, function($msg) use ($user){
                     $msg->to($user['to']);
                     $msg->subject('Milestone Status Changed!');
                 });  


        //DB INSERT
            $old_investment = $business->investment_needed;
            $new_investment = $old_investment - $mile->amount;
            listing::where('id',$mile->listing_id)->update(['investment_needed' => $new_investment]);

            Milestones::where('id',$id)->update([ 
                'status' => 'Done'
            ]);

        $mileLat = Milestones::where('investor_id',$investor_id)->where('status','To Do')->first();

        if($mileLat != null) {
            Milestones::where('id',$mileLat->id)->update([ 'status' => 'In Progress']);
        }
        else {
            $mileLat = Milestones::where('status','To Do')
            ->where('listing_id',$mile->listing_id)->first();
            if($mileLat != null) {
            Milestones::where('id',$mileLat->id)->update([ 'status' => 'In Progress']);
        }
        }

               Session::put('Stripe_pay','Milestone paid successfully!');
               return redirect("/");
         }
            catch(\Exception $e){
            Session::put('Stripe_failed',$e->getMessage());
            return redirect()->back();
        }

    }


    //__________ MILESTONES Services _________________________________________

     public function milestoneCheckoutS($milestone_id, $amount)
    {
    $tax = taxes::where('id',1)->first();
    $tax = $tax->tax;
    $amountReal = base64_decode($amount);
    $amount =($amountReal)+($amountReal*($tax/100));
    $milestone_id =base64_decode($milestone_id);

    Session::put('service_part_amount', $amount);
    Session::put('service_part_amount_real', $amountReal);
 
        return view('milestoneS.stripe',compact('amount','milestone_id','tax'));
    }

   
    public function milestoneStripePostS(Request $request)
    { 

    if(Auth::check())
    {
        $investor_id = Auth::id();
        $investor = User::where('id',$investor_id)->first();
    }    
    else {

        return response()->json(['message' =>  'Unauthorized!','status' => 400 ]);
      }

    $rep_id = $request->milestone_id; //For Replica table
    $mileRep = ServiceMileStatus::select('id','mile_id')
    ->where('id',$rep_id)->first();

    $id = $mileRep->mile_id; 
    $mile = Smilestones::where('id',$id)->first();    
    $tax = taxes::where('id',1)->first();$tax = $tax->tax+$tax->vat;

    $amount= $request->amount; 
    $transferAmount= round($amount-($amount*.05),2);
    $amountReal= $request->amountOriginal; //$request->amountReal;
    $transferAmount=round($amountReal,2);

    $user_id = $mile->user_id;
    $business_id = $mile->listing_id;

    //Stripe
    try{ 

        $curr='USD'; //$request->currency; 
        $amount=round($amount,2);
        $transferAmount=round($transferAmount,2);

        $this->validate($request, [
            'stripeToken' => ['required', 'string']
        ]);
        $charge = $this->Client->charges->create ([ 
                //"billing_address_collection": null,
                "amount" => $amount*100, //100 * 100,
                "currency" => $curr,
                "source" => $request->stripeToken,
                "description" => "This payment is test purpose only!"
        ]);
    }
    catch(\Exception $e){
      return response()->json(['error' => $e,'message' =>  $e->getMessage(),'status' => 400 ]);
    }
    //return $request->all();

    $Business = Services::select('shop_id','category')->where('id',$business_id)
    ->first();
    $ownerS = User::select('fname','lname','id','email','connect_id')->where('id', $Business->shop_id)
    ->first();

    
    try{

    //Split
        // $curr='USD'; //$request->currency; 
        // $tranfer = $this->Client->transfers->create ([ 
        //         //"billing_address_collection": null,
        //         "amount" => $transferAmount*100, //100 * 100,
        //         "currency" => $curr,
        //         "source_transaction" => $charge->id,
        //         'destination' => $ownerS->connect_id
        // ]);
    //Split

        ServiceMileStatus::where('id',$rep_id)->update([ 'status' => 'In Progress']);
        
        //Asset-related
        $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
        if ($Business->category == '0') 
        {
            $investor = User::select('fname','lname','id','email')->where('id',$investor_id)->first();
            $booking = serviceBook::where('service_id',$business_id)
            ->where('booker_id',$investor_id)->first();
            $accepted_bids = AcceptedBids::select('business_id','owner_id','id')
            ->where('id',$booking->business_bid_id)->first();
            $ownerB = User::select('id','email')
            ->where('id',$accepted_bids->owner_id)->first();

            AcceptedBids::where('id',$booking->business_bid_id)->update([
                'status' => 'manager_assigned', 'project_manager'=>$ownerS->id ]);

            //M. Assigned Alert, BOwner
                $investor_name = $investor->fname. ' '.$investor->lname;
                $manager = $ownerS->fname. ' '.$ownerS->lname;

                $info=['mail_to'=>'owner','manager_name'=>$manager, 'contact'=>$ownerS->email, 'investor_name' => $investor_name]; 
                $user['to'] = $ownerB->email; 
                $mail1 = Mail::send('bids.owner_manager_alert', $info, function($msg) use ($user){
                $msg->to($user['to']);
                $msg->subject('Project Manger Assigned!');
            }); 
             
            //Notifications
                $addNoti = Notifications::create([
                'date' => $date,
                'receiver_id' => $ownerB->id,
                'customer_id' => $ownerS->id,
                'text' => 'Project Manager '.$manager.' has been assigned to help verify the equipment from the investor '.$investor_name,
                'link' => 'verify_request_manager',
                'bid_id' => $accepted_bids->id,
                'type' => 'business',
                ]);
            //M. Assigned Alert, Owner

            //**MANAGER, Assigned Alert
                $investor_name = $investor->fname. ' '.$investor->lname;
                $manager = $ownerS->fname. ' '.$ownerS->lname;

                $info=['mail_to'=>'manager', 'contact'=>$ownerB->email, 'investor_name' => $investor_name];
                $user['to'] = $ownerS->email;
                $mail1 = Mail::send('bids.owner_manager_alert', $info, function($msg) use ($user){
                $msg->to($user['to']);
                $msg->subject('Project Manger Assigned!');
            });
             
            //Notifications
                $addNoti = Notifications::create([
                'date' => $date,
                'receiver_id' => $ownerS->id,
                'customer_id' => $ownerB->id,
                'text' => 'You been assigned to help verify the equipment from the investor '.$investor_name,
                'link' => '/',
                'bid_id' => $accepted_bids->id,
                'type' => 'business',
                ]);
            //**MANAGER, Assigned Alert
        }
        //Asset-related

        //MAIL
        $business = Services::where('id',$mile->listing_id)->first();
        $customer = User::where('id',Auth::id())->first();
        $info=[  'name'=>$mile->title,  'amount'=>$mile->amount, 'business'=>$business->name, 's_id' => $business_id, 'customer'=>$customer->fname. ' '.$customer->lname ]; 
        $user['to'] = $ownerS->email;//'sohaankane@gmail.com';

         Mail::send('milestoneS.milestone_mail', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Milestone Paid!');
         });
        //MAIL 

        $s_id = base64_encode(base64_encode($business->id));
        return response()->json(['message' =>  'Success', 
                        'service_id' => $s_id, 'status' => 200]);

        }

    catch(\Exception $e){
        return response()->json(['error' => $e,'message' =>  $e->getMessage(),'status' => 400 ]);
    }
   
  }


     public function milestoneInvestEQP($listing_id,$mile_id,$investor_id,$owner_id)
    {
        $investor = User::where('id',$investor_id)->first();
        $investor_name = $investor->fname.' '.$investor->lname;
        $owner = User::where('id',$owner_id)->first();
        $business = listing::where('id',$listing_id)->first();
        $mile = Milestones::where('id',$mile_id)->first();

        //MAIL
        try{

        $info=[ 'mile_name'=>$mile->title, 
        'inv_name'=>$investor_name, 
        'inv_contact'=>$investor->email ];

        $user['to'] =  $owner->email; //'tottenham266@gmail.com';

         Mail::send('milestone.milestone_eqp', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Request to invest with equipments!');
         });

        return response()->json(['success' => 'success']);
        }

        catch(\Exception $e){
            return response()->json(['error' => $e->getMessage()]);
        }
    }

//BIDS

public function bidCommitsForm($amount,$business_id,$percent)
{   $amount = base64_decode($amount);
    $amountBase = $amount;
    $business_id = base64_decode($business_id);
    $percent = base64_decode($percent);
    $total = $amount+($amount*0.05);
    $amount = round($total,2);
    $amountReal = $amountBase;

    Session::put('bid_new_price', $amount);
    Session::put('bid_original_price', $amountReal);
 
        return view('bids.stripe',compact('amountReal','amount','business_id','percent'));
}

public function bidCommits(Request $request){
 //return $request->all();
   if(Auth::check()){
        $investor_id = Auth::id();
        $investor = User::select('email','id')->where('id',$investor_id)->first();
    }
    else {
        return response()->json(['message' => 'Unauthorized!','status' => 401 ]);
    }

 try{
    //Stripe
        $partialAmount = round($request->partialAmount,2);
        $curr='USD'; //$request->currency;
        $amount= $request->amount; 
        $amountReal= $request->amountOriginal; //$request->amountReal;

        $transferAmount=round($amountReal,2);
        $amount = round($amount,2);

        $this->validate($request, [
            'stripeToken' => ['required', 'string']
        ]);
        $charge = $this->Client->charges->create ([ 
                //"billing_address_collection": null,
                "amount" => $partialAmount*100, //100 * 100,
                "currency" => $curr,
                "source" => $request->stripeToken,
                "description" => "This payment is test purpose only!"
        ]);
    //Stripe

        }

    catch(\Exception $e){
      return response()->json(['message' =>  $e->getMessage(),'status' => 400 ]);
    }


    $business_id = $request->listing;
    $Business = listing::where('id',$business_id)->first();
    $owner = User::where('id', $Business->user_id)->first();

    //$business_id = $request->listing;
    $percent = $request->percent;

     try{
        $type = 'Monetary';
        $bids = BusinessBids::create([
          'date' => date('Y-m-d'),
          'investor_id' => $investor_id,
          'business_id' => $business_id,
          'owner_id' => $Business->user_id,
          'type' => $type,
          'amount' => $transferAmount,
          'representation' => $percent,
          'stripe_charge_id' => $charge->id
        ]);

    // Milestone Fulfill check
        $total_bid_amount = 0;
        $mile1 = Milestones::where('listing_id',$business_id)
        ->where('status','In Progress')->first();
        $this_bids = BusinessBids::where('business_id',$business_id)->get();
        foreach($this_bids as $b)
        if($b)
        $total_bid_amount = $total_bid_amount+($b->amount);

        if($mile1)
        if($total_bid_amount >= $mile1->amount){
            listing::where('id',$business_id)->update(['threshold_met' => 1]);

            $list = listing::select('id','user_id','name')->where('id',$business_id)->first();
            $owner = User::select('id','email')->where('id',$list->user_id)->first();
            $info=[ 'business_name'=>$list->name ];
            $user['to'] = $owner->email; //'tottenham266@gmail.com'; //
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

     //Notification
         $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
         $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $Business->user_id,
            'customer_id' => $investor_id,
            'text' => 'You have a new bid from _name!',
            'link' => 'investment-bids',
            'type' => 'investor',

          ]);
    //Notification

    //Mail
        $info=[ 'business_name'=>$Business->name, 'bid_id'=>$bids->id, 'type' => 
        'Monetary' ];
        $user['to'] = $investor->email; //'tottenham266@gmail.com'; //
         if($investor)
            Mail::send('bids.under_review', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Bid Under Review!');
         });
    //Mail

}

catch(\Exception $e){
  return response()->json(['message' =>  $e->getMessage(), 'status' => 400]);
}

if($bids){
    return response()->json(['message' =>  'Stripe_pay','Bid placed! you will get a notification if your bid is accepted!', 'status' => 200]);
    //return redirect("/#/listingDetails/".$business_id);
         }

}



public function bidCommitsAwaiting(Request $request){
   if(Auth::check()){
        $investor_id = Auth::id();
        $investor = User::select('email','id')->where('id',$investor_id)->first();
    }
    else {
        return response()->json(['message' => 'Unauthorized!','status' => 401 ]);
    }

    try{
        //Stripe
        $curr='USD'; //$request->currency;
        $amount= $request->amount; 
        $amountReal= $request->amountOriginal; //$request->amountReal;

        $transferAmount=round($amountReal,2);
        $amount = round($amount,2);

        $this->validate($request, [
            'stripeToken' => ['required', 'string']
        ]);
        $charge = $this->Client->charges->create ([ 
                //"billing_address_collection": null,
                "amount" => $amount*100, //100 * 100,
                "currency" => $curr,
                "source" => $request->stripeToken,
                "description" => "This payment is test purpose only!"
        ]);
        //Stripe

        //UPDATE DATABASE
        $bid_id = $request->bid_id;
        $bid = AcceptedBids::select('id','stripe_charge_id','business_id','type')
        ->where('id',$bid_id)->first();
        
        $Business = listing::select('name','user_id')->where('id',$bid->business_id)->first();
        $owner = User::select('email')->where('id', $Business->user_id)->first();

        $stripe_charge_id = $bid->stripe_charge_id.','.$charge->id;
        $amountUpdate = AcceptedBids::where('id',$bid_id)->update([
          'status' => 'Confirmed',
          'stripe_charge_id' => $stripe_charge_id
        ]);

        //Email & Notifications
        //Notification
         $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
         $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $investor->id,
            'customer_id' =>$Business->user_id,
            'text' => 'Your bid to business '.$Business->name.' is confirmed!',
            'link' => '/',
            'type' => 'business',

          ]);

        //Mail
        $info=[ 'business_name'=>$Business->name, 'bid_id'=>
            base64_encode($bid_id), 'type' => $bid->type ];

            $user['to'] = $investor->email; //'tottenham266@gmail.com'; //
             if($investor)
                Mail::send('bids.accepted' , $info, function($msg) use ($user){
                 $msg->to($user['to']);
                 $msg->subject('Bid Confirmed!');
             });
        //Mail

        if($amountUpdate)
        return response()->json(['message' => 'Bid Confirmed! Please goto dashboard or check email!', 'status' => 200]);

    }

    catch(\Exception $e){
      return response()->json(['message' =>  $e->getMessage(),'status' => 400 ]);
    }
}


// Onboarding / Connect to stripe 
 public function connect($id) { 
    $seller = User::where('id',$id)->first();
    if(!$seller->completed_onboarding){
        $token = hexdec(uniqid());
        User::where('id',$id)->update(['token'=>$token]);
    }

   if(!$seller->connect_id || !$seller->completed_onboarding){
    try{
    $account = $this->Client->accounts->create([
                'country' => 'us',
                'type' => 'express',
                'settings' => [
                  'payouts' => [
                    'schedule' => [
                      'interval' => 'manual',
                    ],
                  ],
                ],
              ]);
              
$account_id=$account['id']; 
User::where('id',$id)->update(['connect_id'=>$account_id]);

$account_links = $this->Client->accountLinks->create([
              'account' => $account_id,
              'refresh_url' => route('connect.stripe',['id'=>$id]),
              'return_url' => route('return.stripe',['token'=>$token]),
              'type' => 'account_onboarding',
            ]); 

    redirect()->to($account_links->url)->send();
    //echo "<script>window.location.href='$account_links->url'</script>";

    }
    catch(\Exception $e){
    Session::put('loginFailed', $e->getMessage());
    return response()->json(['message' =>  $e->getMessage(), 'status' => 400]);
    }
    }

    
    try{
        $login_link = $this->Client->accounts->createLoginLink($seller->connect_id);
        return redirect($login_link->url);
    }
    catch(\Exception $e){
              Session::put('failed',$e->getMessage());
              DB::table('users')->where('id',$seller->id)
              ->update(['completed_onboarding'=>0]);
              return response()->json(['message' =>  $e->getMessage(), 'status' => 400]);
}
    
//echo '<pre>'; print_r($account_links); echo '<pre>';
}


//After return 
public function saveStripe($token) {
    $seller = User::where('token',$token)->first();
    if($seller){
        DB::table('users')->where('id',$seller->id)
        ->update(['completed_onboarding'=>1]);
    }

    redirect()->to(config('app.app_url').'/dashboard/addbusiness')->send();
    //return redirect('http://127.0.0.1:5173/dashboard/add-business');
 }
// CONNECT


}
