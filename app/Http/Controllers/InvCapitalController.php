<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InvCapitalController extends Controller
{
    /**
     * Display a listing of investment opportunities.
     */
    public function index()
    {
        $investments = InvestCapital::all();
        return response()->json($investments);
    }

    /**
     * Show the form for creating a new investment opportunity.
     */
    public function create()
    {
        return view('investments.create');
    }

    /**
     * Store a newly created investment opportunity in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'offer_title' => 'required|string|max:255',
            'total_capital_available' => 'required|numeric',
            'per_startup_allocation' => 'required|numeric',
            'milestone_requirements' => 'nullable|string',
            'startup_stage' => 'required|string',
            'sectors' => 'required|string',
            'regions' => 'required|string',
            'required_docs' => 'nullable|json',
            'offer_brief_file' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $investment = InvestCapital::create($request->all());

        return response()->json(['message' => 'Investment opportunity created successfully', 'investment' => $investment], 201);
    }

    /**
     * Display the specified investment opportunity.
     */
    public function show($id)
    {
        $investment = InvestCapital::findOrFail($id);
        return response()->json($investment);
    }

    /**
     * Show the form for editing the specified investment opportunity.
     */
    public function edit($id)
    {
        $investment = InvestCapital::findOrFail($id);
        return view('investments.edit', compact('investment'));
    }

    /**
     * Update the specified investment opportunity in storage.
     */
    public function update(Request $request, $id)
    {
        $investment = InvestCapital::findOrFail($id);

        $request->validate([
            'offer_title' => 'sometimes|string|max:255',
            'total_capital_available' => 'sometimes|numeric',
            'per_startup_allocation' => 'sometimes|numeric',
            'milestone_requirements' => 'nullable|string',
            'startup_stage' => 'sometimes|string',
            'sectors' => 'sometimes|string',
            'regions' => 'sometimes|string',
            'required_docs' => 'nullable|json',
            'offer_brief_file' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $investment->update($request->all());

        return response()->json(['message' => 'Investment opportunity updated successfully', 'investment' => $investment]);
    }

    /**
     * Remove the specified investment opportunity from storage.
     */
    public function destroy($id)
    {
        $investment = InvestCapital::findOrFail($id);
        $investment->delete();

        return response()->json(['message' => 'Investment opportunity deleted successfully']);
    }
}
