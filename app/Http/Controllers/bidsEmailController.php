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

class bidsEmailController extends Controller
{

public function __construct(StripeClient $client)
    {
        $this->Client = $client;
    }

public function bidsAccepted(Request $request)
{

    try { 
        $bid_ids = $request->bid_ids;
        $business_id = $request->business_id;

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
         Mail::send('bids.rejected', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Bid Rejected!');
         });

         //Refund
         $this->Client->refunds->create(['charge' => $bid->stripe_charge_id ]);
         //Refund
         
         $bid_remove = BusinessBids::where('id',$id)->delete();
         //remove
           }
          }
        Session::put('success','Rejected!');
        return redirect()->back();
        }
        //REJECT 

        foreach($bid_ids as $id){
        if($id !=''){
        $bid = BusinessBids::where('id',$id)->first();
        $investor = User::where('id',$bid->investor_id)->first();
        $investor_mail = $investor->email;
        

         //remove
        // if($bid->legal_doc !=null)
        //     unlink($bid->legal_doc);
        // if($bid->optional_doc !=null)
        //     unlink($bid->legal_doc);
        // if($bid->photos !=null){
        //     $photos = explode(',',$bid->photos);
        //     foreach($photos as $p) if($p !='')  unlink($p);
        //     }

         $list = listing::where('id',$bid->business_id)->first();
         $owner = User::where('id',$list->user_id)->first();

         if($bid->type == 'Monetery')
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

        //Mail
        $info=[ 'business_name'=>$list->name, 'bid_id'=>$id, 'type' => $bid->type ];
        $user['to'] = $investor_mail; //'tottenham266@gmail.com'; //
         Mail::send('bids.accepted', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Bid accepted!');
         });
        
        //Mail


              AcceptedBids::create([
              'bid_id' => $id,
              'date' => $bid->date,
              'investor_id' => $bid->investor_id,
              'business_id' => $bid->business_id,
              'type' => $bid->type,
              'amount' => $bid->amount,
              'representation' => $bid->representation,
              'serial' => $bid->serial,
              'legal_doc' => $bid->legal_doc,
              'optional_doc' => $bid->optional_doc,
              'photos' => $bid->photos
            ]);
                


         $bid_remove = BusinessBids::where('id',$id)->delete();
         //remove
         }
       }
        Session::put('success','Accepted!');
        return redirect()->back();
     
       }
        catch(\Exception $e){
            Session::put('failed',$e->getMessage());
            return redirect()->back();
       }  

   }


public function agreeToBid($bidId)
{
    try { 
        AcceptedBids::where('bid_id',$bidId)->update([
              'investor_agree' => 1       
        ]);
        Session::put('login_success','Thanks for your review, you will get an email when this milestone completes!');
        return redirect('/');
     
       }
        catch(\Exception $e){
            Session::put('failed',$e->getMessage());
            return redirect()->back();
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
     
       }
        catch(\Exception $e){
            return response()->json(['failed' => 'Something went wrong!']);
       }  
}



public function agreeToMileS($s_id,$booker_id)
{
    $mileLat = ServiceMileStatus::where('service_id',$s_id)->where('booker_id',$booker_id)->where('status','To Do')->first();

    $s_id = base64_encode(base64_encode($s_id));

    if($mileLat)
    ServiceMileStatus::where('id',$mileLat->id)->update([ 'active' => 1]);
    Session::put('login_success','Thanks for your review, next milestone can be paid for to begin!!');
       return redirect()->to('/#/service-milestone/'.$s_id);
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
            return redirect('/');
       } 
        }

        Session::put('login_success','Thanks for your review, you will get an email when this milestone completes!');
        return redirect('/');
     
       }
        catch(\Exception $e){
            Session::put('failed',$e->getMessage());
            return redirect()->back();
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

    $type = 'Monetery';
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

public function bidCommitsEQP(Request $request){ 

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

// DOCS UPLOAD
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
            return response()->json(['failed' => 'For business document, Only pdf & docx are allowed!']);
          }
          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/bidsEquip/'.$listing_id.'/'.$investor_id)) 
          mkdir('files/bidsEquip/'.$listing_id.'/'.$investor_id, 0777, true);

          $loc='files/bidsEquip/'.$listing_id.'/'.$investor_id.'/';
          //Move uploaded file
          $optional_doc->move($loc, $create_name);
          $final_optional_doc=$loc.$create_name;
             }else $final_optional_doc='';
               

          $photos=$request->file('photos');$total_img='';
          if($photos !='') {
          foreach ($photos as $single_img) { 
            # code... 
          $uniqid=hexdec(uniqid());
          $ext=strtolower($single_img->getClientOriginalExtension());
          $create_name=$uniqid.'.'.$ext;
          $loc='files/bidsEquip/'.$listing_id.'/'.$investor_id.'/';
          //Move uploaded file
          $single_img->move($loc, $create_name);
          $final_img=$loc.$create_name;

          $total_img = $total_img.$final_img.',';
            }
           }  
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
      'photos' => $total_img
    ]);

    if($bids){
    // Milestone Fulfill check
    $total_bid_amount = 0; $business_id = $listing_id;
    $mile1 = Milestones::where('listing_id',$business_id)
    ->where('status','In Progress')->first();
    $this_bids = BusinessBids::where('business_id',$business_id)->get();
    foreach($this_bids as $b)
    $total_bid_amount = $total_bid_amount+($b->amount);

    if($total_bid_amount >= $mile1->amount){
        $list = listing::where('id',$business_id)->first();
        $owner = User::where('id',$list->user_id)->first();
        $info=[ 'business_name'=>$list->name ];
        $user['to'] = $owner->email; //'tottenham266@gmail.com'; //$owner->email;
         Mail::send('bids.mile_fulfill', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Fulfills a milestone!');
         });
     }
     // Milestone Fulfill check

      return response()->json(['success' => 'Success! You will get a notification if your bid is accepted!']);
    }
}

    catch(\Exception $e){
      return response()->json(['failed' =>  $e->getMessage()]);
    }

}


public function bookingAccepted(Request $request)
{
    try { 
        $bid_ids = $request->bid_ids;
        foreach($bid_ids as $id){
        if($id !=''){
        $bid = serviceBook::where('id',$id)->first();
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
       }
        Session::put('success','Confirmed!');
        return redirect()->back();
     
       }
        catch(\Exception $e){
            Session::put('failed',$e->getMessage());
            return redirect()->back();
       }  

   }



    //Class Ends Below
}
