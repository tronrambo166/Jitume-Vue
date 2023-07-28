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
use Session; 
use Hash;
use Auth;
use Mail;
use Stripe;
use App\Models\taxes;
use App\Models\BusinessBids;


class checkoutController extends Controller
{
    // PAYMENT
     public function goCheckout(Request $request)
    {
      // $id=$request->id;
      // $listing=$request->listing;
      // $value=$request->value;
      // $amount=$request->amount;
      $listing=$request->listing_id;

      $base_price=$request->price;
      $price = round( $base_price+($base_price*0.07),2 );
      //$ids=Crypt::decryptString($ids);
      
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

        //STRIPE
         $curr='USD'; //$request->currency; 
         $price=round($request->price);

        Stripe\Stripe::setApiKey('sk_test_51JFWrpJkjwNxIm6zcIxSq9meJlasHB3MpxJYepYx1RuQnVYpk0zmoXSXz22qS62PK5pryX4ptYGCHaudKePMfGyH00sO7Jwion');

        Stripe\Charge::create ([ 

                //"billing_address_collection": null,
                "amount" => $price*100, //100 * 100,
                "currency" => $curr,
                "source" => $request->stripeToken,
                "description" => "This payment is tested purpose only!"
        ]);
   

//DB INSERT
    Conversation::create([
        'investor_id' => Auth::id(),
        'listing_id' => $listing_id,
        'package' => $package,
        'price' => $price
    ]);

        // $info=['eq_name'=>$Equipment->eq_name, 
        //     'Name'=>$investor->name,'amount'=>$amount,
        //     'email' => $investor->email, 'type'=>'invest']; 
        // $user['to'] = 'sohaankane@gmail.com';//$listing->contact_mail;

        // Mail::send('invest_mail', $info, function($msg) use ($user){
        //     $msg->to($user['to']);
        //     $msg->subject('Test Invest Alert!');
        // });  

       Session::put('Stripe_pay','Success!');
       return redirect("/");

    }



    public function stripePost(Request $request)
    {
    $id = $request->id;
    $listing_id = $request->listing;
    $amount = $request->value;
    $realAmount = $request->realAmount;

    

        //STRIPE
         $curr='USD'; //$request->currency; 
         $price=round($request->price);

        Stripe\Stripe::setApiKey('sk_test_51JFWrpJkjwNxIm6zcIxSq9meJlasHB3MpxJYepYx1RuQnVYpk0zmoXSXz22qS62PK5pryX4ptYGCHaudKePMfGyH00sO7Jwion');

        Stripe\Charge::create ([ 

                //"billing_address_collection": null,
                "amount" => $price*100, //100 * 100,
                "currency" => $curr,
                "source" => $request->stripeToken,
                "description" => "This payment is tested purpose only!"
        ]);
   

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


    //CART

     public function cartCheckout(Request $request)
    {

    $total =0;$cart = Cart::where('user_id',Auth::id())->get();$id='';
    foreach($cart as $c) {
        $total = $total + ($c->price*$c->qty);
        $ids = $id.$c->id.',';

    }
    $total = $total+($total*0.07);
    $total = round(($total/136),2);
 
        return view('cart.stripe',compact('total','ids'));
    }

   
    public function cartStripePost(Request $request)
    {
        $ids = $request->ids; //explode(',',$request->ids);


        //STRIPE
         $curr='USD'; //$request->currency; 
         $amount=round($request->amount);

        Stripe\Stripe::setApiKey('sk_test_51JFWrpJkjwNxIm6zcIxSq9meJlasHB3MpxJYepYx1RuQnVYpk0zmoXSXz22qS62PK5pryX4ptYGCHaudKePMfGyH00sO7Jwion');

        Stripe\Charge::create ([ 

                //"billing_address_collection": null,
                "amount" => $amount*100, //100 * 100,
                "currency" => $curr,
                "source" => $request->stripeToken,
                "description" => "This payment is tested purpose only!"
        ]);
   

//DB INSERT
  
       
    orders::create([
            'user_id' => Auth::id(),
            'service_id' => str_replace(',','_',$ids),    
            'price' => $amount
           ]);

      $ids = explode(',',$ids);
      foreach ($ids as $id) {
      if($id!=''){
     $cart = Cart::where('id',$id)->delete();

     } }

        $order = orders::latest()->first();
        $info=[ 
            'order_id'=>$order->id
           ]; 

        $user['to'] = 'sohaankane@gmail.com';//$request->email;

        // Mail::send('cart.cart_mail', $info, function($msg) use ($user){
        //     $msg->to($user['to']);
        //     $msg->subject('Test Checkout Alert!');
        // });  


       Session::put('Stripe_pay','Order created successfully!');
       return redirect("/");

    }


    //  MILESTONES

    //CART

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
            Session::put('Stripe_pay', $e->getMessage());
            return redirect("/");
        }

    }


    //  MILESTONES Services

    //CART

     public function milestoneCheckoutS(Request $request)
    {
    $tax = taxes::where('id',1)->first();
    $tax = $tax->tax+$tax->vat;
    $amount =($request->amount)+($request->amount)*($tax/100);
    $milestone_id =$request->milestone_id;
 
        return view('milestoneS.stripe',compact('amount','milestone_id','tax'));
    }

   
    public function milestoneStripePostS(Request $request)
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

    $id = $request->milestone_id; //explode(',',$request->ids);

    $mile = Smilestones::where('id',$id)->first();    
    $tax = taxes::where('id',1)->first();$tax = $tax->tax+$tax->vat;
    $amount =($mile->amount)+($mile->amount)*($tax/100);

    $user_id = $mile->user_id;


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
        $business = Services::where('id',$mile->listing_id)->first();

        $info=[  'name'=>$mile->title,  'amount'=>$mile->amount, 'business'=>$business->name, ]; 
        $user['to'] = $request->email;//'sohaankane@gmail.com';

         Mail::send('milestoneS.milestone_mail', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Milestone Status Changed!');
         });  


//DB INSERT
        
    Smilestones::where('id',$id)->update([ 'status' => 'Done']);
    $mileLat = Smilestones::where('user_id',$user_id)->where('status','On Hold')->first();

if($mileLat != null)
    Smilestones::where('id',$mileLat->id)->update([ 'status' => 'In Progress']);
else {
    //Completed, order place
    try{
        $total = 0;
        $all_milestone = Smilestones::where('listing_id',$mile->listing_id)->get();
        foreach($all_milestone as $all_m){
            $total = $total+$all_m->amount;
        }
        orders::create([
            'user_id' => $mile->user_id,
            'service_id' => $mile->listing_id,
            'price' => $total
        ]);
    }
    catch(\Exception $e){
    Session::put('Stripe_pay', $e->getMessage());
    return redirect("/");
}
}


       Session::put('Stripe_pay','Milestone paid successfully!');
       return redirect("/");

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

        $user['to'] = 'tottenham266@gmail.com'; //$owner->email;

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
    $business_id = base64_decode($business_id);
    $percent = base64_decode($percent);
    $total = $amount+($amount*0.05);
    $amount = round($total,2);
 
        return view('bids.stripe',compact('amount','business_id','percent'));
}

public function bidCommits(Request $request){
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

    //Stripe
        $curr='USD'; //$request->currency; 
        $amount=$request->price;
        $amount=$amount-($amount*.05);
        Stripe\Stripe::setApiKey('sk_test_51JFWrpJkjwNxIm6zcIxSq9meJlasHB3MpxJYepYx1RuQnVYpk0zmoXSXz22qS62PK5pryX4ptYGCHaudKePMfGyH00sO7Jwion');
        Stripe\Charge::create ([ 
                //"billing_address_collection": null,
                "amount" => $amount*100, //100 * 100,
                "currency" => $curr,
                "source" => $request->stripeToken,
                "description" => "This payment is tested purpose only!"
        ]);
    //Stripe

    $business_id = $request->listing;
    $percent = $request->percent;
    $type = 'Monetery';
    $bids = BusinessBids::create([
      'date' => date('Y-m-d'),
      'investor_id' => $investor_id,
      'business_id' => $business_id,
      'type' => $type,
      'amount' => $amount,
      'representation' => $percent
    ]);

// Milestone Fulfill check
    $total_bid_amount = 0;
    $mile1 = Milestones::where('listing_id',$business_id)->first();
    $this_bids = BusinessBids::where('business_id',$business_id)->get();
    foreach($this_bids as $b)
    $total_bid_amount = $total_bid_amount+($b->amount);

    if($total_bid_amount >= $mile1->amount){
        $list = listing::where('id',$business_id)->first();
        $owner = User::where('id',$list->user_id)->first();
        $info=[ 'business_name'=>$list->name ];
        $user['to'] = 'tottenham266@gmail.com'; //$owner->email;
         Mail::send('bids.mile_fulfill', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Fulfills a milestone!');
         });
     }
// Milestone Fulfill check

if($bids){
    Session::put('Stripe_pay','Bid placed! you will get a notification if your bid is accepted!');
    return redirect("/");
         }
}

catch(\Exception $e){
  return response()->json(['failed' =>  $e->getMessage()]);
}

}


}
