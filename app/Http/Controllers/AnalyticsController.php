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
            $user_id = Auth::id();
            $user = User::select('investor','id')->where('id',$user_id)->first();
            if($user->investor == 2){
                //$grants = Grant::where('user_id',$user_id)->get();

                    $pitches = GrantApplication::where('$user_id',$user->id)->get();
                    $pitches_count = GrantApplication::where('$user_id',$user->id)->count();
                    $score = 0;
                    foreach ($pitches as $pitch){
                        $score = $pitch->score+$score;
                    }
                    $avg_score = $score/$pitches_count;

                    return response()->json(['grants' => $avg_score]);
            }


        $grants = Grant::all();
        return response()->json(['grants' => $grants]);
    }
}
