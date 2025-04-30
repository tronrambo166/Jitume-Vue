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
class AnalyticsController extends Controller
{
    public function efficiency()
    {
        try {
            $user_id = Auth::id();
            $pitches = GrantApplication::where('user_id',$user_id)->get();
            $pitches_funded = GrantApplication::where('user_id',$user_id)->where('status',1)->count();
            $pitches_count = GrantApplication::where('user_id',$user_id)->count();
            $score = 0;
            $break = [
                'sector' => 0,
                'geo' => 0,
                'stage' => 0,
                'revenue' => 0,
                'team' => 0,
                'impact' => 0
            ];
            $dist = [
                '90-100' => 0,
                '80-89' => 0,
                '70-79' => 0,
                '60-69' => 0,
                '<60' => 0
            ];
            $currentMonth = now()->month;$i=0;
            $monthData = [];

            //Performance Last 6 Months
            $applicationsByMonth = GrantApplication::
            selectRaw('
                MONTH(created_at) as month,
                COUNT(*) as total,
                SUM(CASE WHEN score >= 60 THEN 1 ELSE 0 END) as passed
            ')
                ->where('user_id', $user_id)
                ->groupBy('month')->get();

            foreach ($applicationsByMonth as $row) {
                $monthName = DateTime::createFromFormat('!m', $row->month)->format('M'); // e.g., "Apr"
                $monthData[$monthName] = [
                'applications' => $row->total,
                'match' => $row->passed,
                'conversion' => round(($row->passed/$row->total) * 100)
                ];
                //$matches = GrantApplication::select('score')->where('score', '>=', 60)->get();
            }

            foreach ($pitches as $pitch){
                $score = $pitch->score+$score;

                //Matching Condition
                if($pitch->score >= 60){
                    $created = $pitch->created_at;
                    $createdMonth = (new DateTime($created))->format('M');

                }

                //Distribution
                if($pitch->score >= 90)
                    $dist['90-100'] += 1;
                else if ($pitch->score >= 80 && $pitch->score < 90)
                    $dist['80-89'] += 1;
                else if ($pitch->score >= 70 && $pitch->score < 80)
                    $dist['70-79'] += 1;
                else if ($pitch->score >= 60 && $pitch->score < 70)
                    $dist['60-69'] += 1;
                else
                    $dist['<60'] += 1;

                //Scroe Breakdown
                $breakdown = explode(',',$pitch->score_breakdown);
                $break['sector'] = (float) $breakdown[0] + $break['sector'];
                $break['geo'] = (float) $breakdown[1] + $break['geo'];
                $break['stage'] = (float) $breakdown[2] + $break['stage'];
                $break['revenue'] = (float) $breakdown[3] + $break['revenue'];
                $break['team'] = (float) $breakdown[4] + $break['team'];
                $break['impact'] = (float) $breakdown[5] + $break['impact'];
            }
            $avg_score = round($score/$pitches_count,2);

            $break_avg = collect($break)->map(function ($value, $key) use ($pitches_count) {
                return $value = round($value/$pitches_count,2);
            })->toArray();

            return response()->json([
                'avg_score' => $avg_score,
                'funded' => $pitches_funded,
                'total_match' => $pitches_count,
                'distribution' => $dist,
                'breakdown' => $break_avg,
                'performance_month' => $monthData
            ],200);
        }
        catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

    }
}
