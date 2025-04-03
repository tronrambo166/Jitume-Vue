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
        return response()->json($grants);
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
            'grant_title' => 'required|string|max:255',
            'total_grant_amount' => 'required|numeric',
            'funding_per_business' => 'required|numeric',
            'eligibility_criteria' => 'nullable|string',
            'required_documents' => 'nullable|json',
            'application_deadline' => 'required|date',
            'grant_focus' => 'required|string',
            'startup_stage_focus' => 'nullable|json',
            'impact_objectives' => 'nullable|string',
            'evaluation_criteria' => 'nullable|string',
            'grant_brief_pdf' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $grant = Grant::create([
            'grant_title' => $request->grant_title,
            'total_grant_amount' => $request->total_grant_amount,
            'funding_per_business' => $request->funding_per_business,
            'eligibility_criteria' => $request->eligibility_criteria,
            'required_documents' => $request->required_documents,
            'application_deadline' => $request->application_deadline,
            'grant_focus' => $request->grant_focus,
            'startup_stage_focus' => $request->startup_stage_focus,
            'impact_objectives' => $request->impact_objectives,
            'evaluation_criteria' => $request->evaluation_criteria,
            'grant_brief_pdf' => $request->grant_brief_pdf,
        ]);

        //Upload File

        return response()->json(['message' => 'Grant created successfully', 'grant' => $grant], 201);
    }

    /**
     * Display the specified grant.
     */
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
