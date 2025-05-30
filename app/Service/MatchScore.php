<?php
namespace App\Service;
use Illuminate\Http\Request;
use App\Models\Notifications;
use App\Models\GrantApplication;
use App\Models\StartupPitches;
use App\Models\Listing;
use App\Models\Grant;
use App\Models\CapitalOffer;
use Illuminate\Support\Str;

class MatchScore
{
    public function grant($request, $grant_id)
    {
        $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
        $grant = Grant::where('id',$grant_id)->first();
        $business = Listing::where('id',$request->business_id)->first();
        //$pitch = GrantApplication::with('listing')->where('id',$pitch_id)->first();
        $score = 0;
        try{
            // Input data
            $business = [
                'sectors' => explode(',',$request->sector),
                'region' => $request->headquarters_location,
                'stage' => $request->stage,
                'revenue' => (float) $request->revenue_last_12_months,
                'team_size' => $request->team_experience_avg_years,
                'impact_score' => collect(explode(',', $request->social_impact_areas))
                    ->flatMap(fn($area) => explode(' ', strtolower(trim($area)))),
                'milestones_achieved' => true,
                'documents_submitted' => $request->file('businessPlan_file') != null ? true : false,
                //'is_gender_led' => true,
                //'is_youth_led' => false,
                //'is_rural_based' => true,
                //'uses_local_sourcing' => true,
            ];

            $org = [
                'preferred_sectors' => [$grant->grant_focus],
                'target_regions' => json_decode($grant->regions, true),
                'target_stages' => json_decode($grant->startup_stage_focus, true),
                'revenue' => $grant->funding_per_business,
                'team_size' => $request->evaluation_criteria,
                'impact_score' => collect(explode(' ', strtolower($grant->impact_objectives)))
                    ->map(fn($item) => trim($item)),// Split by words
                'milestones_achieved' => false,
                'documents_submitted' => $request->file('grant_brief_pdf') != null ? true : false,
            ];

            // Sector Alignment (30%)
            $commonSectors = array_intersect($business['sectors'], $org['preferred_sectors']);
            $sectorScore = count($commonSectors) / count($org['preferred_sectors']) * 100;
            $score += $sectorScore * 0.30;

            // Geographic Fit (15%)
            $geoScore = in_array($business['region'], $org['target_regions']) ? 100 : 0;
            $score += $geoScore * 0.15;

            // Startup Stage Compatibility (10%)
            $stageScore = in_array($business['stage'], $org['target_stages']) ? 100 : 0;
            $score += $stageScore * 0.10;

            // Revenue Traction/Projection (10%)
            $revenueScore = $business['revenue'] >= $org['revenue'] ? 100 : 0;
            $score += $revenueScore * 0.10;

            // Team Experience / Background (10%)
            //$teamScore = $business['team_size'] >= $org['team_threshold'] ? 100 : 0;
            //$score += $teamScore * 0.10;

            // Impact Focus (10%)
            //$matchCount = collect($business['impact_score']) // For Unique match
                //->filter(fn($item) => Str::contains($org['impact_score'], strtolower(trim($item))))->count();
            $matchCount = 0;
            foreach ($business['impact_score'] as $item) {
                $matchCount += substr_count($org['impact_score'], $item);
            }

            $impactScore = $matchCount >= 2 ? 100 : 0;
            $score += $impactScore * 0.10;

            // Milestone Success (10%)
            foreach ($request->file('milestones') ?? [] as $milestone) {
                if (isset($milestone['deliverable']) && $milestone['deliverable'] instanceof \Illuminate\Http\UploadedFile) {
                    $business['milestones_achieved'] = true;
                    break;
                }
            }
            $milestoneScore = $business['milestones_achieved'] ? 100 : 0;
            $score += $milestoneScore * 0.10;

            // Document Completeness (5%)
            $documentScore = $business['documents_submitted'] ? 100 : 0;
            $score += $documentScore * 0.05;

            // Bonus (up to +20)
            $bonus_points = explode(',',$request->bonus_points); $bo = 0;
            foreach ($bonus_points as $bonus) {
                if ($bonus == 'gender_led' || $bonus == 'youth_led' ||
                    $bonus == 'rural_based' || $bonus == 'uses_local_sourcing' )
                {
                    $bo = $bo + 5;
                }
            }
            $score += $bo;

            $score = min($score, 100);

        // Final Result
            if ($score >= 80) {
                $result = "Ideal Match";
            } elseif ($score >= 60) {
                $result = "Strong Match";
            } else {
                $result = "Needs Revision";
            }

//            $value_compare = [
//                'Sector Alignment' => implode(',', $business['sectors']) . ' <=> ' . implode(',', $org['preferred_sectors']),
//                'Geographic Fit' => $business['region'] . ' <=> ' . implode(',', $org['target_regions']),
//                'Startup Stage Compatibility' => $business['stage'] . ' <=> ' . implode(',', $org['target_stages']),
//                'Revenue Traction' => $business['revenue'] . ' <=> ' . $org['revenue'],
//                'Impact Focus' => $business['impact_score']."#".$matchCount . ' <=> ' . $org['impact_score'],
//            ];


            return response()->json([
                'score' => round($score, 2),
                'result' => $result,
                'score_breakdown' => [
                    'Sector Alignment' => round($sectorScore * 0.30, 2),
                    'Geographic Fit' => round($geoScore * 0.15, 2),
                    'Startup Stage Compatibility' => round($stageScore * 0.10, 2),
                    'Revenue Traction' => round($revenueScore * 0.10, 2),
                    'Impact Focus' => round($impactScore * 0.10, 2),
                    'Milestone Success' => round($milestoneScore * 0.10, 2),
                    'Document Completeness' => round($documentScore * 0.05, 2),
                    'Bonus ' => $bo
                ],
                //'value_sent' => $request->all(),
                //'value_compare' => $value_compare
            ]);
        }
        catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function capital($request, $capital_id)
    {
        $now = date("Y-m-d H:i");
        $date = date('d M, h:i a', strtotime($now));
        $capital = CapitalOffer::where('id', $capital_id)->first();
        $score = 0;

        try {
            // Input data
            $business = [
                'sectors' => explode(',', $request->sector),
                'region' => explode(',', $request->headquarters_location), // Modified: treat region as array
                'stage' => $request->stage,
                'revenue' => (float) $request->revenue_last_12_months,
                'team_size' => $request->team_experience_avg_years,
                'impact_score' => collect(explode(',', $request->social_impact_areas))
                    ->flatMap(fn($area) => explode(' ', strtolower(trim($area)))), // Modified: flatten for keywords
                'milestones_achieved' => false, // Modified: initially false
                'documents_submitted' => $request->file('business_plan_file') != null ? true : false,
            ];

            $org = [
                'preferred_sectors' => explode(',', $capital->sectors),
                'target_regions' => explode(',', $capital->regions),
                'target_stages' => explode(',', $capital->startup_stage),
                'revenue' => $capital->per_startup_allocation,
                'team_size' => $request->exit_strategy,
                'impact_score' => collect(explode(' ', strtolower($capital->impact_objectives)))
                    ->map(fn($item) => trim($item)), // Modified: normalize for keyword match
                'milestones_achieved' => false,
                'documents_submitted' => $request->file('offer_brief_file') != null ? true : false,
            ];

            // Sector Alignment (30%)
            $commonSectors = array_intersect($business['sectors'], $org['preferred_sectors']);
            $sectorScore = count($commonSectors) / count($org['preferred_sectors']) * 100;
            $score += $sectorScore * 0.30;

            // Geographic Fit (15%) - Modified
            $geoMatch = array_intersect($business['region'], $org['target_regions']);
            $geoScore = count($geoMatch) > 0 ? 100 : 0;
            $score += $geoScore * 0.15;

            // Startup Stage Compatibility (10%)
            $stageScore = in_array($business['stage'], $org['target_stages']) ? 100 : 0;
            $score += $stageScore * 0.10;

            // Revenue Traction/Projection (10%)
            $revenueScore = $business['revenue'] >= $org['revenue'] ? 100 : 0;
            $score += $revenueScore * 0.10;

            // Impact Focus (10%) - Modified
            $matchCount = 0;
            foreach ($business['impact_score'] as $item) {
                $matchCount += substr_count(implode(' ', $org['impact_score']->toArray()), $item);
            }
            $impactScore = $matchCount >= 2 ? 100 : 0;
            $score += $impactScore * 0.10;

            // Milestone Success (10%) - Modified
            foreach ($request->file('milestones') ?? [] as $milestone) {
                if (isset($milestone['deliverable']) && $milestone['deliverable'] instanceof \Illuminate\Http\UploadedFile) {
                    $business['milestones_achieved'] = true;
                    break;
                }
            }
            $milestoneScore = $business['milestones_achieved'] ? 100 : 0;
            $score += $milestoneScore * 0.10;

            // Document Completeness (5%)
            $documentScore = $business['documents_submitted'] ? 100 : 0;
            $score += $documentScore * 0.05;

            // Bonus (up to +20) - Modified
            $bonus_points = explode(',', $request->bonus_points);
            $bo = 0;
            foreach ($bonus_points as $bonus) {
                if (in_array($bonus, ['gender_led', 'youth_led', 'rural_based', 'uses_local_sourcing'])) {
                    $bo += 5;
                }
            }
            $score += $bo;

            // Cap score
            $score = min($score, 100);

            // Final Result
            if ($score >= 80) {
                $result = "Ideal Match";
            } elseif ($score >= 60) {
                $result = "Strong Match";
            } else {
                $result = "Needs Revision";
            }

            return response()->json([
                'score' => round($score, 2),
                'result' => $result,
                'score_breakdown' => [
                    'Sector Alignment' => round($sectorScore * 0.30, 2),
                    'Geographic Fit' => round($geoScore * 0.15, 2),
                    'Startup Stage Compatibility' => round($stageScore * 0.10, 2),
                    'Revenue Traction' => round($revenueScore * 0.10, 2),
                    'Impact Focus' => round($impactScore * 0.10, 2),
                    'Milestone Success' => round($milestoneScore * 0.10, 2),
                    'Document Completeness' => round($documentScore * 0.05, 2),
                    'Bonus' => $bo
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

}
