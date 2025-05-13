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
                'api_key' => 'a52b00aa0de1cc4fc742876b92e480e9',
                'api_secret' => '9c87f7c6d71312d89a86473eeefec46f',
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


    public function initiate_payment()
    {
        try {
            $token = $this->auth();
            $url = "https://dev-api.lipr.io/merchant/api/v1/payments/collect_via_mobile";
            $fields = [
                "wallet_account" => "3e391f4b-26c9-4aa1-86b0-55ed92a85ba8",
                //"customer_account_number" => "254712836398", //Kelvo
                "customer_account_number" => "254721601031", //Owen 721 601031
                "amount" => "10",
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
            Log::info('Lipr Callback Received:', $request->all());

            // Extract necessary data from the request
            $transactionId = $request->input('transaction_id');
            $status = $request->input('status'); // e.g., 'success' or 'failure'
            $amount = $request->amount;
            //$amount = $request->input('amount');
            //$amount = $request->input('amount');
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

    public function checkStatus($referenceId)
    {
        $payment = LiprPayment::where('reference_id', $referenceId)->first();
        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        return response()->json([
            'status' => $payment->status,
            'updated_at' => $payment->updated_at,
        ],200);
    }


//Class Ends
}
