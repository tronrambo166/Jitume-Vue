<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\testController;
use App\Models\Listing;
use App\Models\Services;
use App\Models\User;
use App\Models\Notifications;
use App\Models\CapitalOffer;
use App\Models\StartupPitches;
use Illuminate\Support\Facades\File;
use Response;
use Session; 
use Hash;
use Auth;
use Mail;
use DateTime;

class InvCapitalController extends Controller
{
    /**
     * Display a listing of grants.
     */
    public function index()
    {
        $capital = CapitalOffer::all();
        return response()->json(['capital' => $capital]);
    }

    public function pitches($capital_id)
    {
        $pitches = StartupPitches::where('capital_id',$capital_id)->latest()->get();
        return response()->json(['pitches' => $pitches]);
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
        ]);
            
            $capital = CapitalOffer::create([
            'offer_title' => $request->offer_title,
            'total_capital_available' => $request->total_capital_available,
            'per_startup_allocation' => $request->per_startup_allocation,
            'milestone_requirements' => $request->milestone_requirements,
            'startup_stage' => $request->startup_stage,
            'sectors' => $request->sectors,
            'regions' => $request->regions,
            'required_docs' => $request->required_docs,
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
                'pitch_video' => 'nullable|file|mimes:mp4,avi,mkv|max:2048',
                'business_plan' => 'nullable|file|mimes:pdf,docx|max:2048',
                'social_impact_areas' => 'nullable|string',
                'cac_ltv' => 'nullable|numeric',
                'burn_rate' => 'required|numeric',
                'irr_projection' => 'nullable|numeric',
                'exit_strategy' => 'nullable|string',
            ]);

            $capital = StartupPitches::create([
                'business_id' => $request->business_id,
                'capital_id' => $request->capital_id,
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

            ]);

            //Upload Files
            $pitch_deck_file = $request->file('pitch_deck_file');
            $pitch_video = $request->file('pitch_video');
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

            return response()->json(['message' => 'Investment Application Successfull.'], 200);
        }
        catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    // Display the specified grant.

    public function show($id)
    {
        $capital = CapitalOffer::findOrFail($id);
        return response()->json($capital);
    }


    /**
     * Update the specified grant in storage.
     */
    public function update(Request $request, $id)
    {
        try{
            $capital = CapitalOffer::findOrFail($id);

            $request->validate([
                'offer_title' => 'required|string|max:255',
                'total_capital_available' => 'required|numeric',
                'per_startup_allocation' => 'required|numeric',
                'milestone_requirements' => 'nullable|string',
                'startup_stage' => 'required|string',
                'sectors' => 'required|string',
                'regions' => 'required|string',
                'required_docs' => 'nullable|string',
                //'offer_brief_file' => 'nullable|file|mimes:pdf|max:2048',
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

            $request->offer_brief_file=$final_pdf;
            $capital->update($request->all());

            return response()->json(['message' => 'Capital updated successfully', 'capital' => $capital],200);
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
        $capital = CapitalOffer::findOrFail($id);
        $capital->delete();

        return response()->json(['message' => 'Capital Offer deleted successfully']);
    }
}
