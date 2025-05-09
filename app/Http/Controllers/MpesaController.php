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
        $this->public = env('LIPA_PUBLIC_KEY');
        $this->secret = env('LIPA_SECRET');
        //$this->Bearer = $this->secret;
    }

     public function authorizes()
    {
        //Auth
        try {

            $url = "https://dev-api.lipr.io/merchant/api/v1/sessions";
            $fields = [
                'api_key' => $this->public,
                'api_secret' => $this->secret,
            ];
            $fields_string = http_build_query($fields);
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
            return response($resultArray);

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
                return $err
            echo '<pre>'; print_r($response); echo '<pre>';
        } catch (\Exception $e) {
            return response()->json(['status' => 400, 'message' => $e->getMessage()]);
        }
    }


    public function collect_payment()
    {
        try {
            $token = $this->authorizes();
            $url = "https://dev-api.lipr.io/merchant/api/v1/payments/collect_via_mobile";
            $fields = [
                "phone_number" => "254721601031",
                "amount"=> 100.00,
                "currency"=> "KES",
                "description"=> "Payment for order #1234",
                "wallet_id"=> 104
            ];
            $fields_string = http_build_query($fields);
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



//Class Ends
}
