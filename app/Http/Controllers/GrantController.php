<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\testController;
use App\Models\Listing;
use App\Models\Services;
use App\Models\User;
use App\Models\Notifications;
use App\Models\Grant;
use App\Models\GrantApplication;
use App\Models\GrantMilestone;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Response;
use Session;
use Hash;
use Mail;
use DateTime;
use App\Service\Notification;
use Stripe\StripeClient;

class GrantController extends Controller
{
    /**
     * Display a listing of grants.
     */

    protected $api_base_url;
    protected $Client;

    public function __construct(StripeClient $client)
    {
        $this->Client = $client;
        $this->api_base_url = env('API_BASE_URL');
        //$this->middleware('business');

    }
    public function index()
    {
        if(Auth::check()){
            $user_id = Auth::id();
            $user = User::select('investor','id')->where('id',$user_id)->first();
            if($user->investor == 2){
                $grants = Grant::where('user_id',$user_id)->latest()->get();
                foreach ($grants as $grant){
                    $pitches = GrantApplication::where('grant_id',$grant->id)->count();
                    $grant->pitch_count = $pitches;
                }

                return response()->json(['grants' => $grants]);
            }

        }

        $grants = Grant::all();
        foreach ($grants as $grant){
            $pitches = GrantApplication::where('grant_id',$grant->id)->count();
            $grant->pitch_count = $pitches;
        }
        return response()->json(['grants' => $grants]);
    }

    public function get_grant($id)
    {
        try{
            $grant = Grant::find($id);
            return response()->json(['grant-data' => $grant],200);
        }
        catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage()],400);
        }
    }

    public function visibility($grant_id)
    {
        try {
            $grant = Grant::where('id',$grant_id)->latest()->first();
            if ($grant->visible == 1) {
                Grant::where('id', $grant_id)->update([
                    'visible' => 0
                ]);
            }
            else{
                Grant::where('id', $grant_id)->update([
                    'visible' => 1
                ]);
            }
            return response()->json(['message' => 'Visibility Changed.'], 200);
        }
        catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

    }

    public function pitches($grant_id)
    {
        $user_id = Auth::id();
        if($grant_id == 'latest'){
            $grant = Grant::where('user_id',$user_id)->latest()->first();
            $pitches = GrantApplication::with('grant_milestone')->where('grant_id',$grant->id)->latest()->get();
            return response()->json(['pitches' => $pitches]);
        }

        $pitches = GrantApplication::with('grant_milestone')->where('grant_id',$grant_id)->latest()->get();
        return response()->json(['pitches' => $pitches]);
    }

    public function mypitches()
    {
        $user_id = Auth::id();
        $pitches = GrantApplication::with('grant')->where('user_id',$user_id)->latest()->get();
        return response()->json(['pitches' => $pitches]);
    }


    /**
     * Store a newly created grant in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
                "grantTitle" => "required|string|max:255",
                "totalGrantAmount" => "required|numeric",
                "fundingPerBusiness" => "required|numeric",
                "eligibilityCriteria" => "nullable|string",
                "applicationDeadline" => "required|date",
                "grantFocus" => "required|string",
                "regions" => "nullable|string",
                "impactObjectives" => "nullable|string",
                "evaluationCriteria" => "nullable|string",
                "grantBriefPDF" => "nullable|file|mimes:pdf|max:2048",

        ]);

        try{
            $grant = Grant::create([
                'user_id' => Auth::id(),
                'grant_title' => $request->grantTitle,
                'total_grant_amount' => $request->totalGrantAmount,
                'available_amount' => $request->totalGrantAmount,
                'funding_per_business' => $request->fundingPerBusiness,
                'eligibility_criteria' => $request->eligibilityCriteria,
                'required_documents' => $request->requiredDocuments,
                'application_deadline' => $request->applicationDeadline,
                'grant_focus' => $request->grantFocus,
                'regions' => $request->regions,
                'startup_stage_focus' => $request->startupStageFocus,
                'impact_objectives' => $request->impactObjectives,
                'evaluation_criteria' => $request->evaluationCriteria,
                //'grant_brief_pdf' => $request->grantBriefPDF,
            ]);

            //Upload File
            $grant_brief_pdf = $request->file('grantBriefPDF');
            if (!file_exists('files/grants/'.$grant->id))
                mkdir('files/grants/'.$grant->id, 0777, true);

            $loc='files/grants/'.$grant->id.'/';
            if($grant_brief_pdf) {
                $uniqid=hexdec(uniqid());
                $ext=strtolower($grant_brief_pdf->getClientOriginalExtension());
                $create_name=$uniqid.'.'.$ext;
                $grant_brief_pdf->move($loc, $create_name);
                $final_pdf=$loc.$create_name;
            }
            else $final_pdf='';
            Grant::where('id',$grant->id)->update([
                'grant_brief_pdf' => $final_pdf
            ]);

            return response()->json(['message' => 'Grant created successfully'], 200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    // Store Grant Application
    public function store_application(Request $request)
    {

        try{

            $request->validate([
                'grant_id' => 'nullable|numeric',
                'business_id' => 'nullable|numeric',
                'startup_name' => 'required|string|max:255',
                'contact_name' => 'required|string|max:255',
                'contact_email' => 'required|email|max:255',
                'sector' => 'required|string|max:255',
                'headquarters_location' => 'required|string|max:255',
                'stage' => 'required|string|max:255',
                'revenue_last_12_months' => 'nullable|numeric',
                'team_experience_avg_years' => 'nullable|numeric',
                'traction_kpis' => 'nullable|string',
                'pitchDeck_file' => 'nullable|file|mimes:pdf,docx',
                'pitchVideo_file' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:3048',
                'businessPlan_file' => 'nullable|file|mimes:pdf,docx',
                'social_impact_areas' => 'nullable|string',
                'bonus_points' => 'nullable|string',
                'score' => 'nullable|numeric',
                'score_breakdown' => 'nullable|string',
                'milestones' => 'nullable|array',
            ]);
            $grant_owner_id = Grant::where('id',$request->grant_id)->first()->user_id;

            $grant = GrantApplication::create([
                'user_id' => Auth::id(),
                'grant_id' => $request->grant_id,
                'grant_owner_id' => $grant_owner_id,
                'business_id' => $request->business_id,
                'startup_name' => $request->startup_name,
                'contact_person_name' => $request->contact_name,
                'contact_person_email' => $request->contact_email,
                'sector' => $request->sector,
                'headquarters_location' => $request->headquarters_location,
                'stage' => $request->stage,
                'revenue_last_12_months' => $request->revenue_last_12_months,
                'team_experience_avg_years' => $request->team_experience_avg_years,
                'traction_kpis' => $request->traction_kpis,
                //'pitch_deck_file' => $pitchDeckFile ?? null,
                //'pitch_video' => $pitchVideoFile ?? null,
                //'business_plan_file' => $businessPlanFile ?? null,
                'social_impact_areas' => $request->social_impact_areas,
                'bonus_points' => $request->social_impact_areas,
                'score' => $request->score,
                'score_breakdown' => $request->score_breakdown
            ]);

            //Upload Files
            $pitch_deck_file = $request->file('pitchDeck_file');
            $pitch_video = $request->file('pitchVideo_file');
            $business_plan_file = $request->file('businessPlan_file');

            if (!file_exists('files/grantApps/'.$grant->id))
                mkdir('files/grantApps/'.$grant->id, 0777, true);
            $loc='files/grantApps/'.$grant->id.'/';

            if($pitch_deck_file) {
                $uniqid=hexdec(uniqid());
                $ext=strtolower($pitch_deck_file->getClientOriginalExtension());
                $create_name=$uniqid.'.'.$ext;
                $pitch_deck_file->move($loc, $create_name);
                $pitch_deck_path=$loc.$create_name;
            }
            else $pitch_deck_path='';

            if($pitch_video) {
                $uniqid=hexdec(uniqid());
                $ext=strtolower($pitch_video->getClientOriginalExtension());
                $create_name=$uniqid.'.'.$ext;
                $pitch_video->move($loc, $create_name);
                $pitch_video_path=$loc.$create_name;
            }
            else $pitch_video_path='';

            if($business_plan_file) {
                $uniqid=hexdec(uniqid());
                $ext=strtolower($business_plan_file->getClientOriginalExtension());
                $create_name=$uniqid.'.'.$ext;
                $business_plan_file->move($loc, $create_name);
                $business_plan_path=$loc.$create_name;
            }
            else $business_plan_path='';

            GrantApplication::where('id',$grant->id)->update([
                'pitch_deck_file' => $pitch_deck_path,
                'pitch_video' => $pitch_video_path,
                'business_plan_file' => $business_plan_path
            ]);

            if (!file_exists('files/grantMiles/'.$grant->id))
                mkdir('files/grantMiles/'.$grant->id, 0777, true);
            $loc='files/grantMiles/'.$grant->id.'/';

            // M I L E S T O N E S
            $milestones = $request->milestones;
            foreach($milestones as $milestone){
                $document = $request->file('milestones.0.deliverable.file');
                if($document) {
                    $uniqid=hexdec(uniqid());
                    $ext=strtolower($document->getClientOriginalExtension());
                    $create_name=$uniqid.'.'.$ext;
                    $document->move($loc, $create_name);
                    $document=$loc.$create_name;
                }
                else $document='';
                $mile = GrantMilestone::create([
                    'app_id' => $grant->id,
                    'title' => $milestone['title'],
                    'amount' => $milestone['amount'],
                    'description' => $milestone['description'],
                    'document' => $document
                ]);
            }


            return response()->json(['message' => 'Grant Application Successfull.'], 200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    // Display the specified grant.

    public function show($id)
    {
        $grant = Grant::findOrFail($id);
        return response()->json($grant);
    }


    /**
     * Update the specified grant in storage.
     */
    public function update(Request $request)
    {
        try{
            $grant = Grant::findOrFail($request->id);

            $request->validate([
                "id" => "required|numeric",
                "grant_title" => "required|string|max:255",
                "funding_per_business" => "required|numeric",
                "eligibility_criteria" => "nullable|string",
                "required_documents" => "nullable|string",
                "application_deadline" => "required|date",
                "grant_focus" => "required|string",
                "regions" => "nullable|string",
                "startup_stage_focus" => "nullable|string",
                "impact_objectives" => "nullable|string",
                "evaluation_criteria" => "nullable|string",
            ]);
            $data = $request->except('grant_brief_pdf'); // get all fields except the file path

            //Upload File
            $grant_brief_pdf = $request->file('grant_brief_pdf');
            if (!file_exists('files/grants/'.$grant->id))
                mkdir('files/grants/'.$grant->id, 0777, true);

            $loc='files/grants/'.$grant->id.'/';
            if($grant_brief_pdf) {
                $uniqid=hexdec(uniqid());
                $ext=strtolower($grant_brief_pdf->getClientOriginalExtension());
                $create_name=$uniqid.'.'.$ext;
                $grant_brief_pdf->move($loc, $create_name);
                $final_pdf=$loc.$create_name;
                $data['grant_brief_pdf'] = $final_pdf;
                //Unlink
                if($grant->grant_brief_pdf !=null && file_exists($grant->grant_brief_pdf)){
                    unlink($grant->grant_brief_pdf);
                }
            }
            $grant->update($data);
            return response()->json(['message' => 'Grant updated successfully', 'grant' => $grant],200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified grant from storage.
     */
    public function destroy($id)
    {
        $grant = Grant::findOrFail($id);
        $grant->delete();

        return response()->json(['message' => 'Grant deleted successfully']);
    }

    public function accept($pitch_id)
    {
        try{
            $pitch = GrantApplication::with('grant')->where('id',$pitch_id)->first();
            $app = GrantApplication::where('id',$pitch_id)
                ->update([
                    'status' => 1
                ]);

             $text = 'Your application to the Grant'.$pitch->grant->grant_title.'
                 has been accepted. You can now connect with the grant owner';
             $notification = new Notification();
             $notification->create($pitch->user_id,$pitch->grant->user_id,$text
                 ,'grants-overview/grants/discover',' grant');

            return response()->json(['message' => 'Pitch Accepted.'], 200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function reject($pitch_id)
    {
        try{
            $pitch = GrantApplication::with('grant')->where('id',$pitch_id)->first();
            $text = 'Your application to the Grant'.$pitch->grant->grant_title.'
                 has been rejected. Please read the application rejection reasons.';
            $notification = new Notification();
            $notification->create($pitch->user_id,$pitch->grant->user_id,$text
                ,'grants-overview/grants/discover',' grant');
            GrantApplication::where('id',$pitch_id)->delete();

            return response()->json(['message' => 'Pitch Rejected.'], 200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function fund_request($pitch_id)
    {
        try{
            $pitch = GrantApplication::with('grant')->where('id',$pitch_id)->first();
            $user = User::select('fname','lname')->where('id',$pitch->user_id)->first();

            $text = $user->fname.' '.$user->lname. 'Has requested funding to the Grant'.$pitch->grant->grant_title;
            $notification = new Notification();
            $notification->create($pitch->grant->user_id,$pitch->user_id,$text
                ,'grants-overview/grants/discover',' grant');

            //MAIL
            return response()->json(['message' => 'Fund Requested.'], 200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function release_milestone(Request $request)
    {
        try{ //return $request->all();
            $milestone = GrantMilestone::where('id',$request->listing)->first();
            $pitch = GrantApplication::with('grant')->where('id',$milestone->app_id)->first();
            $owner = User::select('fname','email','connect_id')->where('id',$pitch->user_id)->first();

            //T r a n s f e r
            $curr='USD'; //$request->currency;
            $db_amount= ($milestone->amount)+$milestone->amount*0.05;
            $amount= $request->amount; //Session::get('small_fee_new_price');
            $amountOriginal= $request->amountOriginal;
            $transferAmount= round($amount-($amountOriginal*.05),2);
            $this->validate($request, [
                'stripeToken' => ['required', 'string']
            ]);
            if($request->percent != 100 && $db_amount != $amount){
                return response()->json(['message' => 'Amount does not match!'], 400);
            }


            if($request->percent != 100){
                $charge = $this->Client->charges->create ([
                    //"billing_address_collection": null,
                    "amount" => $amount*100, //100 * 100,
                    "currency" => $curr,
                    "source" => $request->stripeToken,
                    "description" => "Release Milestone Funds"
                ]);
                //D a t a b a s e
                $milestone->update([
                    'status' => 1,
                ]);
                $grantUp = Grant::where('id', $pitch->grant_id)->update([
                    'available_amount' => DB::raw("available_amount - {$amount}")
                ]);
            }
            else{
                $charge = $this->Client->charges->create ([
                    //"billing_address_collection": null,
                    "amount" => $pitch->total_amount_requested*100, //100 * 100,
                    "currency" => $curr,
                    "source" => $request->stripeToken,
                    "description" => "Release Milestone Funds"
                ]);
                //D a t a b a s e
                GrantMilestone::where('app_id',$milestone->app_id)->update([
                    'status' => 1,
                ]);
                $grantUp = Grant::where('id', $pitch->grant_id)->update([
                    'available_amount' => DB::raw("available_amount - {$pitch->total_amount_requested}")
                ]);
            }

            $text = $milestone->title.' fund for '.$pitch->grant->grant_title.' has been released.';
            $notification = new Notification();
            $notification->create($pitch->user_id,$pitch->grant->user_id,$text
                ,'grants-overview/grants/discover',' grant');

            //MAIL

            //MAIL
            return response()->json(['message' => 'Fund Release Success.', 'status' =>200]);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
