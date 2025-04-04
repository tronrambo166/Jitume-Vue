<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\testController;
use App\Models\Listing;
use App\Models\Services;
use App\Models\User;
use App\Models\Notifications;
use App\Models\Grant;
use Illuminate\Support\Facades\File;
use Response;
use Session; 
use Hash;
use Auth;
use Mail;
use DateTime;


class GrantController extends Controller
{
    /**
     * Display a listing of grants.
     */
    public function index()
    {
        $grants = Grant::all();
        return response()->json(['grants' => $grants]);
    }

    /**
     * Show the form for creating a new grant.
     */
    public function create()
    {
        return view('grants.create');
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
                "impactObjectives" => "nullable|string",
                "evaluationCriteria" => "nullable|string",
                "grantBriefPDF" => "nullable|file|mimes:pdf|max:2048",

        ]);

        try{    
            $grant = Grant::create([
            'grant_title' => $request->grantTitle,
            'total_grant_amount' => $request->totalGrantAmount,
            'funding_per_business' => $request->fundingPerBusiness,
            'eligibility_criteria' => $request->eligibilityCriteria,
            'required_documents' => $request->requiredDocuments,
            'application_deadline' => $request->applicationDeadline,
            'grant_focus' => $request->grantFocus,
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


    // Display the specified grant.

    public function show($id)
    {
        $grant = Grant::findOrFail($id);
        return response()->json($grant);
    }

    /**
     * Show the form for editing the specified grant.
     */
    public function edit($id)
    {
        $grant = Grant::findOrFail($id);
        return view('grants.edit', compact('grant'));
    }

    /**
     * Update the specified grant in storage.
     */
    public function update(Request $request, $id)
    {
        $grant = Grant::findOrFail($id);

        $request->validate([
            'grant_title' => 'sometimes|string|max:255',
            'total_grant_amount' => 'sometimes|numeric',
            'funding_per_business' => 'sometimes|numeric',
            'eligibility_criteria' => 'nullable|string',
            'required_documents' => 'nullable|json',
            'application_deadline' => 'sometimes|date',
            'grant_focus' => 'sometimes|string',
            'startup_stage_focus' => 'nullable|json',
            'impact_objectives' => 'nullable|string',
            'evaluation_criteria' => 'nullable|string',
            'grant_brief_pdf' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $grant->update($request->all());

        return response()->json(['message' => 'Grant updated successfully', 'grant' => $grant]);
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
}
