<?php
namespace App\Service;
use Illuminate\Http\Request;
use App\Models\Notifications;
use App\Models\GrantApplication;
use App\Models\StartupPitches;
use App\Models\Listing;
use App\Models\Grant;
use App\Models\CapitalOffer;

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
                'region' => explode(',',$request->headquarters_location),
                'stage' => $request->stage,
                'revenue' => $request->revenue_last_12_months,
                'team_size' => $request->team_experience_avg_years,
                'impact_score' => explode(',',$request->social_impact_areas),
                'milestones_achieved' => true,
                'documents_submitted' => $request->file('business_plan_file') != null ? true : false,
                //'is_gender_led' => true,
                //'is_youth_led' => false,
                //'is_rural_based' => true,
                //'uses_local_sourcing' => true,
            ];

            $org = [
                'preferred_sectors' => explode(',',$grant->grant_focus),
                'target_regions' => explode(',',$grant->regions),
                'target_stages' => explode(',',$grant->startup_stage_focus),
                'revenue' => $grant->funding_per_business,
                'team_size' => $request->evaluation_criteria,
                'impact_score' => explode(',',$request->impact_objectives),
                'milestones_achieved' => true,
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
            $impactScore = array_intersect($business['impact_score'], $org['impact_score']) ? 100 : 0;
            $score += $impactScore * 0.10;

            // Milestone Success (10%)
            $milestoneScore = $business['milestones_achieved'] ? 100 : 0;
            $score += $milestoneScore * 0.10;

            // Document Completeness (5%)
            $documentScore = $business['documents_submitted'] ? 100 : 0;
            $score += $documentScore * 0.05;

            // Bonus (up to +20)
            $bonus_points = explode(',',$request->bonus_points);$bonus = 0;
            foreach ($bonus_points as $bonus) {
                if ($bonus == 'gender_led') $score += 5;
                else if ($bonus == 'youth_led') $score += 5;
                else if ($bonus == 'rural_based') $score += 5;
                else if($bonus == 'uses_local_sourcing') $score += 5;
            }

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
                    'Document Completeness' => round($documentScore * 0.05, 2)
                ],
            ]);
        }
        catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function capital($org_id,$pitch_id)
    {
        $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));

        try{
            // Input data
            $business = [
                'sectors' => ['Agri', 'Health'],
                'region' => 'East Africa',
                'stage' => 'Growth',
                'revenue' => 150000,
                'team_size' => 6,
                'impact_score' => 85,
                'milestones_achieved' => true,
                'documents_submitted' => true,
                'is_gender_led' => true,
                'is_youth_led' => false,
                'is_rural_based' => true,
                'uses_local_sourcing' => true,
            ];

            $org = [
                'preferred_sectors' => ['Agri', 'Clean Energy'],
                'target_regions' => ['East Africa', 'West Africa'],
                'target_stages' => ['Idea', 'Growth'],
                'min_revenue' => 50000,
                'team_threshold' => 3,
                'impact_threshold' => 70,
            ];

            // Sector Alignment (30%)
            $commonSectors = array_intersect($business['sectors'], $fund['preferred_sectors']);
            $sectorScore = count($commonSectors) / count($fund['preferred_sectors']) * 100;
            $score += $sectorScore * 0.30;

            // Geographic Fit (15%)
            $geoScore = in_array($business['region'], $fund['target_regions']) ? 100 : 0;
            $score += $geoScore * 0.15;

            // Startup Stage Compatibility (10%)
            $stageScore = in_array($business['stage'], $fund['target_stages']) ? 100 : 0;
            $score += $stageScore * 0.10;

            // Revenue Traction/Projection (10%)
            $revenueScore = $business['revenue'] >= $fund['min_revenue'] ? 100 : 0;
            $score += $revenueScore * 0.10;

            // Team Experience / Background (10%)
            $teamScore = $business['team_size'] >= $fund['team_threshold'] ? 100 : 0;
            $score += $teamScore * 0.10;

            // Impact Focus (10%)
            $impactScore = $business['impact_score'] >= $fund['impact_threshold'] ? 100 : 0;
            $score += $impactScore * 0.10;

            // Milestone Success (10%)
            $milestoneScore = $business['milestones_achieved'] ? 100 : 0;
            $score += $milestoneScore * 0.10;

            // Document Completeness (5%)
            $documentScore = $business['documents_submitted'] ? 100 : 0;
            $score += $documentScore * 0.05;

            // Bonus (up to +20)
            if (!empty($business['is_gender_led'])) $score += 5;
            if (!empty($business['is_youth_led'])) $score += 5;
            if (!empty($business['is_rural_based'])) $score += 5;
            if (!empty($business['uses_local_sourcing'])) $score += 5;

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
            ]);
        }
        catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
