<?php

namespace App\Http\Controllers;

use App\Models\CapitalWatchlist;
use App\Models\Grant;
use App\Models\GrantApplication;
use App\Models\GrantMilestone;
use App\Service\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\testController;
use App\Models\Listing;
use App\Models\Services;
use App\Models\User;
use App\Models\Notifications;
use App\Models\CapitalOffer;
use App\Models\StartupPitches;
use App\Models\CapitalMilestone;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Response;
use Session;
use Hash;
use Mail;
use DB;
use DateTime;
use Stripe\StripeClient;

class InvCapitalController extends Controller
{
    /**
     * Display a listing of capital.
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
            if($user->investor == 3){
                $capitals = CapitalOffer::where('user_id',$user_id)->latest()->get();
                foreach ($capitals as $capital){
                    $pitches = StartupPitches::where('capital_id',$capital->id)->count();
                    $capital->pitch_count = $pitches;
                }
                return response()->json(['capital' => $capitals]);
            }

        }
        $capital = CapitalOffer::all();
        return response()->json(['capital' => $capital]);
    }

    public function get_capital($id)
    {
        try{
            $capital = CapitalOffer::find($id);
            return response()->json(['capital-data' => $capital],200);
        }
        catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage()],400);
        }
    }

    public function visibility($capital_id)
    {
        try {
            $capital = CapitalOffer::where('id',$capital_id)->first();
            if ($capital->visible == 1) {
                CapitalOffer::where('id',$capital_id)->update([
                    'visible' => 0
                ]);
            }
            else{
                CapitalOffer::where('id',$capital_id)->update([
                    'visible' => 1
                ]);
            }
            return response()->json(['message' => 'Visibility Changed.'], 200);
        }
        catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

    }

    public function pitches($capital_id)
    {
        $user_id = Auth::id();
        $match_score = 0;
        if($capital_id == 'latest'){
            $capital = CapitalOffer::where('user_id',$user_id)->latest()->first();
            $pitches = StartupPitches::with('capital_milestone')->where('capital_id',$capital->id)->latest()->get();
            return response()->json(['pitches' => $pitches]);
        }
        $capital_pitches = StartupPitches::with('capital_milestone')->where('capital_owner_id',$user_id)->latest()->get();
        $pitch_count = $capital_pitches->count();
        $pitch_count_accept = StartupPitches::where('capital_owner_id',$user_id)
            ->where('status',1)->count();

        foreach ($capital_pitches as $pitch){
            $match_score = $match_score + $pitch->score;
        }
        $pitch_count_pending = $pitch_count-$pitch_count_accept;
        $avg_match_score = round($pitch_count > 0 ? $match_score/$pitch_count : 0, 2);;
        $accept_rate = round( ($pitch_count_accept/$pitch_count)*100, 2);

        return response()->json([
            'pitches' => $capital_pitches,
            'avg_match_score' => $avg_match_score,
            'accept_rate' => $accept_rate,
            'pitch_count' => $pitch_count,
            'pitch_count_pending' => $pitch_count_pending,
        ]);
    }


    /**
     * Store a newly created Capital in storage.
     */
    public function store(Request $request)
    {


        try{
            $request->validate([
            'offer_title' => 'required|string|max:255',
            'total_capital_available' => 'required|numeric',
            'per_startup_allocation' => 'required|numeric',
            'milestone_requirements' => 'nullable|string',
            'startup_stage' => 'required|string',
            'sectors' => 'required|string',
            'regions' => 'required|string',
            'required_docs' => 'nullable|string',
            'offer_brief_file' => 'nullable|file|mimes:pdf|max:2048',
            "end_date" => "nullable|string",
            "start_date" => "nullable|string",
        ]);

            $capital = CapitalOffer::create([
                'user_id' => Auth::id(),
                'offer_title' => $request->offer_title,
                'total_capital_available' => $request->total_capital_available,
                'available_amount' => $request->total_capital_available,
                'per_startup_allocation' => $request->per_startup_allocation,
                'milestone_requirements' => $request->milestone_requirements,
                'startup_stage' => $request->startup_stage,
                'sectors' => $request->sectors,
                'regions' => $request->regions,
                'required_docs' => $request->required_docs,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            //'offer_brief_file' => $request->offer_brief_file,
        ]);

            //Upload File
            $offer_brief_file = $request->file('offer_brief_file');
            if (!file_exists('files/capitals/'.$capital->id))
                mkdir('files/capitals/'.$capital->id, 0777, true);

            $loc='files/capitals/'.$capital->id.'/';
            if($offer_brief_file) {
                $uniqid=hexdec(uniqid());
                $ext=strtolower($offer_brief_file->getClientOriginalExtension());
                $create_name=$uniqid.'.'.$ext;
                $offer_brief_file->move($loc, $create_name);
                $final_pdf=$loc.$create_name;
            }
            else $final_pdf='';
            CapitalOffer::where('id',$capital->id)->update([
                'offer_brief_file' => $final_pdf
            ]);

            return response()->json(['message' => 'List Capital created successfully'], 200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    // Store Capital Application
    public function store_application(Request $request)
    {

        try{

            $request->validate([
                'business_id' => 'nullable|integer',
                'capital_id' => 'nullable|integer',
                'startup_name' => 'required|string|max:255',
                'contact_person_name' => 'required|string|max:100',
                'contact_person_email' => 'required|email|max:100',
                'sector' => 'required|string|max:255',
                'headquarters_location' => 'required|string|max:255',
                'stage' => 'required|string|max:200',
                'revenue_last_12_months' => 'nullable|numeric',
                'team_experience_avg_years' => 'nullable|integer',
                'traction_kpis' => 'nullable|string',
                'pitch_deck_file' => 'nullable|file|mimes:pdf,docx|max:2048',
                'pitch_video_file' => 'nullable|file|mimes:mp4,avi,mkv|max:2048',
                'business_plan' => 'nullable|file|mimes:pdf,docx|max:2048',
                'social_impact_areas' => 'nullable|string',
                'cac_ltv' => 'nullable|numeric',
                'burn_rate' => 'required|numeric',
                'irr_projection' => 'nullable|numeric',
                'exit_strategy' => 'nullable|string',
                'milestones' => 'nullable|array',
                'score' => 'nullable|numeric',
                'score_breakdown' => 'nullable|numeric',
            ]);
            $this_capital= CapitalOffer::select('user_id','capital_title')->where('id',$request->capital_id)->first()->user_id;
            $capital_owner_id = $this_capital->user_id;
            $capital_owner_email = User::select('email')->where('id',$capital_owner_id)->first()->email;

            $capital = StartupPitches::create([
                'user_id' => Auth::id(),
                'business_id' => $request->business_id,
                'capital_id' => $request->capital_id,
                'capital_owner_id' => $capital_owner_id,
                'startup_name' => $request->startup_name,
                'contact_person_name' => $request->contact_person_name,
                'contact_person_email' => $request->contact_person_email,
                'sector' => $request->sector,
                'headquarters_location' => $request->headquarters_location,
                'stage' => $request->stage,
                'revenue_last_12_months' => $request->revenue_last_12_months,
                'team_experience_avg_years' => $request->team_experience_avg_years,
                'traction_kpis' => $request->traction_kpis,
                //'pitch_deck_file' => $request->pitch_deck_file,
                //'pitch_video' => $request->pitch_video,
                //'business_plan' => $request->business_plan,
                'social_impact_areas' => $request->social_impact_areas,
                'cac_ltv' => $request->cac_ltv,
                'burn_rate' => $request->burn_rate,
                'irr_projection' => $request->irr_projection,
                'exit_strategy' => $request->exit_strategy,
                'score' => $request->score,
                'score_breakdown' => $request->score_breakdown
            ]);

            //Upload Files
            $pitch_deck_file = $request->file('pitch_deck_file');
            $pitch_video = $request->file('pitch_video_file');
            $business_plan_file = $request->file('business_plan');

            if (!file_exists('files/capitalPitches/'.$capital->id))
                mkdir('files/capitalPitches/'.$capital->id, 0777, true);
            $loc='files/capitalPitches/'.$capital->id.'/';

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

            StartupPitches::where('id',$capital->id)->update([
                'pitch_deck_file' => $pitch_deck_path,
                'pitch_video' => $pitch_video_path,
                'business_plan' => $business_plan_path
            ]);

            if (!file_exists('files/capitalMiles/'.$capital->id))
                mkdir('files/grantMiles/'.$capital->id, 0777, true);
            $loc='files/grantMiles/'.$capital->id.'/';

            // M I L E S T O N E S
            $milestones = $request->milestones;
            foreach($milestones as $milestone){
                $document = $request->file($milestone['deliverables'][0]);
                if($document) {
                    $uniqid=hexdec(uniqid());
                    $ext=strtolower($document->getClientOriginalExtension());
                    $create_name=$uniqid.'.'.$ext;
                    $document->move($loc, $create_name);
                    $document=$loc.$create_name;
                }
                else $document='';
                $mile = CapitalMilestone::create([
                    'app_id' => $capital->id,
                    'title' => $milestone['title'],
                    'amount' => $milestone['amount'],
                    'description' => $milestone['description'],
                    'document' => $document
                ]);
            }

            $text = 'You have a new application pitch.';
            $notification = new Notification();
            $notification->create($capital_owner_id,$capital->user_id,$text
                ,'overview/capital-pitch',' capital');

            // E M A I L
            $info=[ 'capital'=>$this_capital->offer_title, 'SME'=>$request->startup_name ];
            $user['to'] = $capital_owner_email; //'tottenham266@gmail.com'; //
            Mail::send('opportunities.capital_pitch', $info, function($msg) use ($user){
                $msg->to($user['to']);
                $msg->subject('Capital Pitch Received');
            });
            // E M A I L

            return response()->json(['message' => 'Investment Application Successfull.'], 200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    // Display the specified capital.

    public function show($id)
    {
        $capital = CapitalOffer::findOrFail($id);
        return response()->json($capital);
    }


    /**
     * Update the specified capital in storage.
     */
    public function update(Request $request)
    {
        try{
            $capital = CapitalOffer::findOrFail($request->id);

            $request->validate([
                "id" => "required|numeric",
                'offer_title' => 'required|string|max:255',
                'per_startup_allocation' => 'required|numeric',
                'milestone_requirements' => 'nullable|string',
                'startup_stage' => 'required|string',
                'sectors' => 'required|string',
                'regions' => 'required|string',
                'required_docs' => 'nullable|string',
                //'offer_brief_file' => 'nullable|file|mimes:pdf|max:2048',
            ]);
            $data = $request->except('grant_brief_pdf');

            //Upload File
            $offer_brief_file = $request->file('offer_brief_file');
            if (!file_exists('files/capitals/'.$capital->id))
                mkdir('files/capitals/'.$capital->id, 0777, true);

            $loc='files/capitals/'.$capital->id.'/';
            if($offer_brief_file) {
                $uniqid=hexdec(uniqid());
                $ext=strtolower($offer_brief_file->getClientOriginalExtension());
                $create_name=$uniqid.'.'.$ext;
                $offer_brief_file->move($loc, $create_name);
                $final_pdf=$loc.$create_name;
                $data['offer_brief_file'] = $final_pdf;

                if($capital->offer_brief_file !=null && file_exists($capital->offer_brief_file)){
                    unlink($capital->offer_brief_file);
                }
            }

            $capital->update($data);
            return response()->json(['message' => 'Capital updated successfully', 'capital' => $capital],200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified capital from storage.
     */
    public function destroy($id)
    {
        $capital = CapitalOffer::findOrFail($id);
        $capital->delete();

        return response()->json(['message' => 'Capital Offer deleted successfully']);
    }

    public function accept($pitch_id)
    {
        try{
            $pitch = StartupPitches::with('capital_offer')->where('id',$pitch_id)->first();
            $app = StartupPitches::where('id',$pitch_id)
                ->update([
                    'status' => 1
                ]);
            $text = 'Your application to the Capital'.$pitch->capital_offer->offer_title.'
                 has been accepted. You can now connect with the Capital owner';
            $notification = new Notification();
            $notification->create($pitch->user_id,$pitch->capital_offer->user_id,$text
                ,'capital-overview/capital/discover',' capital');

            return response()->json(['message' => 'Pitch Accepted.'], 200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function reject($pitch_id)
    {
        try{
            $pitch = StartupPitches::with('capital_offer')->where('id',$pitch_id)->first();
            $text = 'Your application to the Capital'.$pitch->capital_offer->offer_title.'
                 has been accepted. You can now connect with the Capital owner';
            $notification = new Notification();
            $notification->create($pitch->user_id,$pitch->capital_offer->user_id,$text
                ,'capital-overview/capital/discover',' capital');
            StartupPitches::where('id',$pitch_id)->delete();

            return response()->json(['message' => 'Pitch Rejected.'], 200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function release_milestone(Request $request)
    {
        try {
            $milestone = CapitalMilestone::where('id', $request->listing)->first();
            $pitch = StartupPitches::with('capital')->where('id', $milestone->app_id)->first();

            $emails = User::whereIn('id', [$pitch->user_id, $pitch->capital_owner_id])
                ->pluck('email', 'id');
            $sme_email = $emails[$pitch->user_id];
            $capital_owner_email = $emails[$pitch->capital_owner_id];

            // T r a n s f e r
            $curr = 'USD';
            $db_amount = $milestone->amount + $milestone->amount * 0.05;
            $amount = $request->amount;
            $amountOriginal = $request->amountOriginal;
            $transferAmount = round($amount - ($amountOriginal * 0.05), 2);

            $this->validate($request, [
                'stripeToken' => ['required', 'string']
            ]);

            if ($request->percent != 100 && $db_amount != $amount) {
                return response()->json(['message' => 'Amount does not match!'], 400);
            }

            if ($request->percent != 100) {
                $charge = $this->Client->charges->create([
                    "amount" => $amount * 100,
                    "currency" => $curr,
                    "source" => $request->stripeToken,
                    "description" => "Release Capital Milestone Funds"
                ]);

                $milestone->update([
                    'status' => 1,
                ]);

                $capitalUp = CapitalOffer::where('id', $pitch->capital_id)->update([
                    'available_amount' => DB::raw("available_amount - {$amount}")
                ]);
            } else {
                $charge = $this->Client->charges->create([
                    "amount" => $pitch->total_amount_requested * 100,
                    "currency" => $curr,
                    "source" => $request->stripeToken,
                    "description" => "Release Capital Milestone Funds"
                ]);

                CapitalMilestone::where('app_id', $milestone->app_id)->update([
                    'status' => 1,
                ]);

                $capitalUp = CapitalOffer::where('id', $pitch->capital_id)->update([
                    'available_amount' => DB::raw("available_amount - {$pitch->total_amount_requested}")
                ]);
            }

            $text = $milestone->title . ' fund for ' . $pitch->capital->offer_title . ' has been released.';
            $notification = new Notification();
            $notification->create($pitch->user_id, $pitch->capital->user_id, $text, 'capital-overview/capital/discover', 'capital');

            // E M A I L
            $info=[
                'capital'=>$pitch->capital->offer_title,
                'amount'=>$milestone->amount,
                'milestone_title' => $milestone->title
            ];
            $user['to'] = [$capital_owner_email, $sme_email]; //'tottenham266@gmail.com'; //
            Mail::send('opportunities.capital_milestone', $info, function($msg) use ($user){
                $msg->to($user['to']);
                $msg->subject(' Capital Milestone');
            });
            // E M A I L
            return response()->json(['message' => 'Fund Release Success.', 'status' => 200]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function store_watchlist($pitch_id)
    {
        try{
            $capital_owner_id = Auth::id();
            $watchlist = CapitalWatchlist::firstOrCreate([
                'pitch_id' => $pitch_id,
                'capital_owner_id' => $capital_owner_id
            ]);
            if (!$watchlist->wasRecentlyCreated)
                return response()->json(['message' => 'Already exists'],200);
            return response()->json(['message' => 'Added to watchlist'],200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function get_watchlist()
    {
        try{
            $capital_owner_id = Auth::id();
            $watchlists = CapitalWatchlist::with('pitch')
                ->where('capital_owner_id', $capital_owner_id)
                ->latest()->get();
            $pitches = $watchlists->pluck('pitch')->filter()->values();
            return response()->json(['pitches' => $pitches],200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function update_profile(Request $request)
    {
        try{
            $id = Auth::id();
            $user = User::findOrFail($id);
            $request->validate([
                'fname' => 'required|string|max:255', // Org name
                'interested_cats' => 'required', // Preferred Sectors
                'org_type' => 'required|string',
                'phone' => 'required|string|max:20',
                'startup_stage' => 'required|string', //Startup Stage Preferences
                'inv_range' => 'required|string', //Investment Range
                'eng_prefer' => 'required|string', //Preferred Engagement Types
                'regions' => 'required|string', // Geographic Focus
                'website' => 'nullable|url',
            ]);
            $user->update($request->all());
            return response()->json(['message' => 'Profile updated successfully'],200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

}
