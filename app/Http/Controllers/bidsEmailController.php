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

class bidsEmailController extends Controller
{
    
public function bidsAccepted(Request $request)
{

    try { 
    $bid_ids = $request->bid_ids;
    //$investor_mails = array();
    $business_id = $request->business_id;
    foreach($bid_ids as $id){
        if($id !=''){
        $bid = BusinessBids::where('id',$id)->first();
        $investor = User::where('id',$bid->investor_id)->first();
        $investor_mail = $investor->email;

        $list = listing::where('id',$bid->business_id)->first();
        $info=[ 'business_name'=>$list->name ];
        $user['to'] = 'tottenham266@gmail.com'; //$investor_mail;
         Mail::send('bids.accepted', $info, function($msg) use ($user){
             $msg->to($user['to']);
             $msg->subject('Bid accepted!');
         });

         //remove
         $bid_remove = BusinessBids::where('id',$id)->delete();
         }
       }
        Session::put('success','Accepted!');
        return redirect()->back();
     
       }
        catch(\Exception $e){
            return response()->json(['failed' =>  $e->getMessage()]);
       }  

   }



    //Class Ends Below
}
