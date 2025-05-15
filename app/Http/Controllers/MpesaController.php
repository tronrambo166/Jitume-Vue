<?php

namespace App\Http\Controllers;

use App\Models\LiprPayment;
use App\Service\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
use Stripe\StripeClient;
use App\Models\taxes;
use App\Models\BusinessBids;
use App\Models\BusinessSubscriptions;
use App\Models\AcceptedBids;
use App\Models\Notifications;
use Session;
use Hash;
use Auth;
use Mail;

class MpesaController extends Controller
{
    public function __construct()
    {
        $this->public = env('LIPA_PUBLIC_KEY');
        $this->secret = env('LIPA_SECRET');
        //$this->Bearer = $this->secret;
    }

     public function auth()
    {
        //Auth
        try {

            $url = "https://dev-api.lipr.io/merchant/api/v1/sessions";
            $fields = [
                'api_key' => $this->public,
                'api_secret' => $this->secret,
            ];
            $fields_string = json_encode($fields);
            //open connection
            $ch = curl_init();
            curl_setopt($ch,CURLOPT_URL, $url);
            curl_setopt($ch,CURLOPT_POST, true);
            curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json'
            ));

            curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
            $result = curl_exec($ch);
            $resultArray = json_decode($result, true);
            return $token = $resultArray['data']['token'];
            //echo '<pre>'; print_r($resultArray); echo '<pre>'; return $result;


        } catch (\Exception $e) {
            return response()->json(['status' => 400, 'message' => $e->getMessage()]);
        }
        //Auth

    }


    public function wallets()
    {
        try {
            //$ref = "T751929395745907";
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://dev-api.lipr.io/merchant/api/v1/wallets",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array(
                    "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImV4cCI6MTc0NjcxMzY2NX0.4Ymdr-E0pWFIzJ8imlFi6vn4PnnojvnS6SfoUw_e6Wg",
                    "Cache-Control: no-cache",
                ),
            ));

            $response = curl_exec($curl);
            $response = json_decode($response, true);
            $err = curl_error($curl);
            curl_close($curl);

            if($err)
                return $err;
            echo '<pre>'; print_r($response); echo '<pre>';
        } catch (\Exception $e) {
            return response()->json(['status' => 400, 'message' => $e->getMessage()]);
        }
    }


    public function initiate_payment(Request $request)
    {
        if(Auth::check()){
            $investor_id = Auth::id();
            $investor = User::select('email','id')->where('id',$investor_id)->first();
        }
        else
            return response()->json(['message' => 'Unauthorized!','status' => 401 ]);


        try {
            $token = $this->auth();
            $url = "https://dev-api.lipr.io/merchant/api/v1/payments/collect_via_mobile";
            $fields = [
                "wallet_account" => "3e391f4b-26c9-4aa1-86b0-55ed92a85ba8", //$investor->lipr_wallet
                //"customer_account_number" => "254712836398", //Kelvo
                "customer_account_number" => $request->acc_number, // "254721601031",Owen
                "amount" => $request->amount, //KES
                "receiver_business_number" => "22",
                "narration" => "collect money",
                "callback_url" => "https://tujitume.com/api/lipr-callback"
            ];

            $fields_string = json_encode($fields);
            //open connection
            $ch = curl_init();
            curl_setopt($ch,CURLOPT_URL, $url);
            curl_setopt($ch,CURLOPT_POST, true);
            curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                "Authorization: Bearer ".$token,
                "Cache-Control: no-cache",
                'Content-Type: application/json'
            ));
            //So that curl_exec returns the contents of the cURL; rather than echoing it
            curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
            $result = curl_exec($ch);
            $result = json_decode($result, true);
            return response()->json(['status' => 200, 'data' => $result]);
            //echo '<pre>'; print_r($result); echo '<pre>';

        } catch (\Exception $e) {
            return response()->json(['status' => 400, 'message' => $e->getMessage()]);
        }

    }


    public function create_wallet()
    {
        try {
            $token = $this->auth();
            $url = "https://dev-api.lipr.io/merchant/api/v1/wallet";
            $fields = [
                "wallet_account" => "3e391f4b-26c9-4aa1-86b0-55ed92a85ba8",
                "customer_account_number" => "254721601031", //Owen
                "amount" => "10",
                "narration" => "collect money",
                "callback_url" => "https://beta.tujitume.com"
            ];

            $fields_string = json_encode($fields);
            //open connection
            $ch = curl_init();
            curl_setopt($ch,CURLOPT_URL, $url);
            curl_setopt($ch,CURLOPT_POST, true);
            curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                "Authorization: Bearer ".$token,
                "Cache-Control: no-cache",
                'Content-Type: application/json'
            ));
            //So that curl_exec returns the contents of the cURL; rather than echoing it
            curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
            $result = curl_exec($ch);
            $result = json_decode($result, true);
            //return $result
            echo '<pre>'; print_r($result); echo '<pre>';

        } catch (\Exception $e) {
            return response()->json(['status' => 400, 'message' => $e->getMessage()]);
        }

    }

    public function callback(Request $request)
    {
        try {
            //Log::info('Lipr Callback Received:', $request->all());

            // Extract necessary data from the request
            $transactionId = $request->transaction_id;
            $status = $request->status; // e.g., 'success' or 'failure'
            $amount = $request->amount;

            $lipr = LiprPayment::create([
                'reference_id' => $transactionId,
                'status' => $status,
                'amount' => $amount,
                //'purpose' => $purpose,
                //'listing_id' => $listing_id,
            ]);
            return response()->json(['message' => 'Callback received'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 400, 'message' => $e->getMessage()]);
        }
    }

    public function checkStatus($referenceId, $business_id,$amounts_passed)
    {
        if(Auth::check()){
            $investor_id = Auth::id();
            $investor = User::select('email','id')->where('id',$investor_id)->first();
        }
        else {
            return response()->json(['message' => 'Unauthorized!','status' => 401 ]);
        }
        $investor_id = 112;
        $payment = LiprPayment::where('reference_id', $referenceId)->first();
        if (!$payment) {
            return response()->json(['error' => 'Payment not found','status' => 404]);
        }

        try{
            $notification = new Notification();
            $amountsPassed = explode('_',$amounts_passed);
            $amountRealUSD = $amountsPassed[0];
            $amountPaid = (int)$amountsPassed[1];
            $amountPaidDB = $payment->amount;
            $Business = listing::where('id',$business_id)->first();
            $owner = User::where('id', $Business->user_id)->first();

            if($amountPaid != $amountPaidDB)
            return response()->json([
                'error_in' => $amountPaid .'!='. $amountPaidDB,
                'message' => 'Amount does not match the original amount!',
                'status' => 400,
            ]);

            $type = 'Monetary';
            $bids = BusinessBids::create([
                'date' => date('Y-m-d'),
                'investor_id' => $investor_id,
                'business_id' => $business_id,
                'owner_id' => $owner->id,
                'type' => $type,
                'amount' => $amountRealUSD,
                'representation' => $payment->share,
                'lipr_transaction_id' => $referenceId
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

                    //Notification.php
                    $text = 'A milestone for your business '.$Business->name.' can now be fulfilled. You can start reviewing/accepting bids as well.';
                    $notification->createNotification($owner->id,$investor_id,$text,'investment-bids','investor');
                    //Notification.php
                }
            // Milestone Fulfill check

            $text = 'You have a new bid from _name.';
            $notification->create($Business->user_id,$investor_id,$text,'investment-bids','investor');
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

            return response()->json([
                'status' => $payment->status,
                'updated_at' => $payment->updated_at,
            ],200);

        }

        catch(\Exception $e){
            return response()->json(['message' =>  $e->getMessage(), 'status' => 400]);

        }
    }


//Class Ends
}
