<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
        $this->public = env('MPESA_CONSUMER_KEY');
        $this->secret = env('MPESA_CONSUMER_SECRET');
        //$this->Bearer = $this->secret;
    }

     public function stk()
    {   
        //Auth
        // $ch = curl_init('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials');
        // curl_setopt($ch, CURLOPT_HTTPHEADER, [
        // 'Authorization: Basic ' . base64_encode($this->public.':'.$this->secret)
        // ]);
        // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        // $response = curl_exec($ch);
        // echo json_decode($response); //exit;
        //Auth

        $mpesa= new \Safaricom\Mpesa\Mpesa();
        $BusinessShortCode = '174379';
        $LipaNaMpesaPasskey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
        $TransactionType = 'CustomerPayBillOnline';
        $Amount = '10';
        $PartyA = '254721601031';//254 708374149
        $PartyB = '174379';
        $PhoneNumber = '254721601031';
        $CallBackURL = 'https://yourdomain.com/api/mpesaCallback';
        $AccountReference = 'TuJitume';
        $TransactionDesc = 'TransactionDesc';
        $Remarks = 'Remarks';
        $Timestamp = date('YYYYMMDDHHmmss');
        //$Password = base64_encode($BusinessShortCode.':'.$LipaNaMpesaPasskey.':'.$Timestamp);

        $stkPushSimulation=$mpesa->STKPushSimulation(
            //$Password,
            $BusinessShortCode,
            $LipaNaMpesaPasskey,
            $TransactionType,
            $Amount,
            $PartyA,
            $PartyB,
            $PhoneNumber,
            $CallBackURL,
            $AccountReference,
            $TransactionDesc,
            $Remarks
         );

        //$stkPushSimulation = json_encode($stkPushSimulation);
        //print_r(json_decode($stkPushSimulation,true));
        //$merchant_request_id = $stkPushSimulation->MerchantRequestID;
        //$checkout_request_id = $stkPushSimulation->CheckoutRequestID;
        
        $callbackData=$mpesa->getDataFromCallback();
        return $callbackData;
    }


    public function AccountBalance() 
    {
        $mpesa= new \Safaricom\Mpesa\Mpesa();
        $CommandID = 'AccountBalance';
        $Initiator = 'testapiuser';
        $IdentifierType = '4';
        $SecurityCredential = 'WN+80die7gzcSO7qLKo9rcClqsm17xj2Qm4V/SdprNq6jmf3fBS97N8EbbqU0/A90+gb8URI1rlKYNerxAsheTMSOZOqUN8UeLziGQ58vGMDYOlhVHxmJ+SilsRhNMGJqO2fTiqcakRT1WjlONm4o5T65hYcjRmS73r6U+8s8MZAt7b6iABo1mlsmQjh6z7HQC7Axy1iZKP785NaYgw8tCLhuVaidsgkL28vXq6AiiciVnAn+fCI5OYGVa4gK8uzAm54LAY0Z+mUdakvwPC90/UFhecmee3AYbUTAEpSjYO2lpYo51mopB8Vo06GqqKVaQOBRhn4JgWDxPh/4OB7YQ==';
        $PartyA = '600987';//254 708374149

        $QueueTimeOutURL = 'https://mydomain.com/AccountBalance/queue/';
        $ResultURL = 'https://mydomain.com/AccountBalance/result/';
        $Remarks = 'Remarks';

        $balanceInquiry=$mpesa->accountBalance(
            $CommandID,
             $Initiator, 
             $SecurityCredential,
              $PartyA,
               $IdentifierType,
                $Remarks,
                 $QueueTimeOutURL,
                  $ResultURL
              );
        return $balanceInquiry;
    }


    public function b2c_Split() 
    {
        $mpesa= new \Safaricom\Mpesa\Mpesa();
        $CommandID = 'AccountBalance';
        $InitiatorName = 'testAPIuser';
        $IdentifierType = '4';
        $SecurityCredential = 'WN+80die7gzcSO7qLKo9rcClqsm17xj2Qm4V/SdprNq6jmf3fBS97N8EbbqU0/A90+gb8URI1rlKYNerxAsheTMSOZOqUN8UeLziGQ58vGMDYOlhVHxmJ+SilsRhNMGJqO2fTiqcakRT1WjlONm4o5T65hYcjRmS73r6U+8s8MZAt7b6iABo1mlsmQjh6z7HQC7Axy1iZKP785NaYgw8tCLhuVaidsgkL28vXq6AiiciVnAn+fCI5OYGVa4gK8uzAm54LAY0Z+mUdakvwPC90/UFhecmee3AYbUTAEpSjYO2lpYo51mopB8Vo06GqqKVaQOBRhn4JgWDxPh/4OB7YQ==';
        $Amount = '10';
        $PartyA = '600987';//254 708374149
        $PartyA = '254 708374149';

        $QueueTimeOutURL = 'https://mydomain.com/AccountBalance/queue/';
        $ResultURL = 'https://mydomain.com/AccountBalance/result/';
        $Remarks = 'Remarks';
        $Occasion = 'Occasion';

        $b2cTransaction=$mpesa->b2c(
        $InitiatorName,
        $SecurityCredential,
        $CommandID,
        $Amount,
        $PartyA,
        $PartyB,
        $Remarks,
        $QueueTimeOutURL,
        $ResultURL,
        $Occasion
        );
        return $b2cTransaction;
    }


    public function mpesaCallback() 
    {
        $mpesa= new \Safaricom\Mpesa\Mpesa();

        $callbackData=$mpesa->getDataFromCallback();
        //$callbackData=$mpesa->finishTransaction();
        return $callbackData;
        //if(fails)
        //$callbackData=$mpesa->finishTransaction(false)
    }


// ...... MPESA ENDS .......


    public function verify($business_id,$percent,$amountKFront,$amountReal,$ref)
    {   
        try {
            //$ref = "T751929395745907";
            $curl = curl_init();
            curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.paystack.co/transaction/verify/".$ref,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
              "Authorization: Bearer ".$this->secret,
              "Cache-Control: no-cache",
            ),
          ));
          
          $response = curl_exec($curl);
          $response = json_decode($response, true);
          $err = curl_error($curl);
          curl_close($curl);
          
        if($err) { 
            return response()->json(['error' =>$err, 'status' => 400 ]);
          } 
        else {
            $amountKEN = $response['data']['amount'];
            $status = $response['data']['status'];
            //$subaccount=$response['data']['subaccount']['subaccount_code'];
            //BACKEND UPADATE
            if($status == 'success' && $amountKEN == $amountKFront)
            {               
                $investor_id = Auth::id();
                //$business_id = $request->listing;
                $Business = listing::where('id',$business_id)->first();
                $owner = User::where('id', $Business->user_id)->first();
                //$percent = $request->percent;
                    $type = 'Monetery';
                    $bids = BusinessBids::create([
                      'date' => date('Y-m-d'),
                      'investor_id' => $investor_id,
                      'business_id' => $business_id,
                      'owner_id' => $Business->user_id,
                      'type' => $type,
                      'amount' => $amountReal,
                      'representation' => $percent,
                      'paystack_charge_id' => $ref
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
                        $owner = User::where('id',$Business->user_id)->first();
                        $info=[ 'business_name'=>$Business->name ];
                        $user['to'] = $owner->email; //'tottenham266@gmail.com'; //
                         Mail::send('bids.mile_fulfill', $info, function($msg) use ($user){
                             $msg->to($user['to']);
                             $msg->subject('Fulfills a milestone!');
                         });
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
                    if($bids){
                    return response()->json(['message' =>  'Bid placed! you will get a notification if your bid is accepted!', 'status' => 200]);
                    }
                    else {
                      return response()->json(['error' =>'Amount mismatch!', 'status' => 422 ]);
                    }
            
           }
           //BACKEND UPADATE
        }      
         // echo '<pre>'; print_r($response); echo '<pre>';
        } catch (\Exception $e) {
            return response()->json(['status' => 400, 'message' => $e->getMessage()]);
        }
    }



//Class Ends
}
