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

class PayStackController extends Controller
{   
    public function __construct()
    {   
        $this->public = 'pk_test_05479d57206db767b2cc76467cab1c7824237ffa';
        $this->secret = 'sk_test_fb3bf64f0b4da439f52bf6b482fa7395a5b4511b';
        //$this->Bearer = $this->secret;
    }

    public function initialize(Request $request)
    {   
        $investor_id = Auth::id();
        $business_id = $request->listing;
        $Business = listing::where('id',$business_id)->first();
        $owner = User::where('id', $Business->user_id)->first();
        $amount= round($request->amount,2); 
        $amountReal= round($request->amountOriginal,2);

        $JitumeAmount = round( ($amount - $amountReal), 2);

        try {
          $amount = round( (($amount)*128.5*100), 2); //$ to KES
          $subaccount = 'ACCT_n9mpmg5jdy7nit2';//$owner->subaccount_id;
          $url = "https://api.paystack.co/transaction/initialize";
          $fields = [
            'email' => "customer@email.com",
            'amount' => $amount,
            'subaccount' => $subaccount,
            'transaction_charge' => $JitumeAmount,
            //'callback_url' => 'http://localhost:81/' 
          ];
          $fields_string = http_build_query($fields);
          //open connection
          $ch = curl_init();
          //set the url, number of POST vars, POST data
          curl_setopt($ch,CURLOPT_URL, $url);
          curl_setopt($ch,CURLOPT_POST, true);
          curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
          curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Authorization: Bearer ".$this->secret,
            "Cache-Control: no-cache",
          )); 
          //So that curl_exec returns the contents of the cURL; rather than echoing it
          curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 
          //execute post
          $result = curl_exec($ch);
          $resultArray = json_decode($result, true);
          $ref = $resultArray['data']['reference'];
          //$validAmount = $this->verify($ref);
          
          
          return response($result);
          //else response(['Error: Verification failed!'],400);
          //echo '<pre>'; print_r($result); echo '<pre>';

        } catch (\Exception $e) {
            return response()->json(['status' => 400, 'message' => $e->getMessage()]);
        }
    }

    public function verify($ref)
    { 

        try {
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
          
          if ($err)
            { return false;} 
          else 
            {return $response;}
            //{return $response['data']['amount'];}
          
          //echo '<pre>'; print_r($result); echo '<pre>';
        } catch (\Exception $e) {
            return response()->json(['status' => 400, 'message' => $e->getMessage()]);
        }
    }


    public function create_subaccount()
    {       

          $url = "https://api.paystack.co/subaccount";
          $fields = [
            'business_name' => "Oasis Wasis",
            'bank_code' => "057",
            'account_number' => "0000000000",
            'percentage_charge' => 95
          ];

          $fields_string = json_encode($fields);
          //open connection
          $ch = curl_init();
          //set the url, number of POST vars, POST data
          curl_setopt($ch,CURLOPT_URL, $url);
          curl_setopt($ch,CURLOPT_POST, true);
          curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
          curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Authorization: Bearer ".$this->secret,
            "Cache-Control: no-cache",
            "content-type: application/json"
          ));
          //So that curl_exec returns the contents of the cURL; rather than echoing it
          curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 
          //execute post
          $result = curl_exec($ch);
          $result = json_decode($result,true);
           echo '<pre>'; print_r($result); echo '<pre>';
    }


//Class Ends
}
