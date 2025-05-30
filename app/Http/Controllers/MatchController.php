<?php

namespace App\Http\Controllers;

use App\Models\Grant;
use App\Service\MatchScore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MatchController extends Controller
{
    public function score(MatchScore $match, Request $request, $grant_id)
    {
        $score = $match->grant($request, $grant_id);
        return response()->json($score,200);
    }

    public function score_capital(MatchScore $match, Request $request, $capital_id)
    {
        $score = $match->capital($request, $capital_id);
        return response()->json($score,200);
    }
}
