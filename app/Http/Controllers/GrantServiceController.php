<?php

namespace App\Http\Controllers;

use App\Models\AcceptedBids;
use App\Models\Listing;
use App\Models\Services;
use App\Models\User;
use Illuminate\Http\Request;
use Auth;

class GrantServiceController extends Controller
{
    public function grantWritingServices(){
        try{
            $user_id = Auth::id();
            //$this_business = Listing::where('id',$business_id)->first();
            $this_business = Listing::where('user_id', $user_id)->latest()->first();

            if($this_business) {
                $business_loc = $this_business->location;
                $lat = (float)$this_business->lat;
                $lng = (float)$this_business->lng;
                $services = $this->findNearestServices($lat, $lng, 100);
                return response()->json(['results' => $services, 'loc' => 'true',
                    'lat' => $lat, 'lng' => $lng], 200);
            }
            return response()->json(['message' => "You do not have any business."], 200);
        }
        catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage()],400);
        }
    }


    public function pitchCoachingServices($listing_id){
        try{
            $results = array();
            $this_grant = Listing::where('id',$listing_id)->first();
            $grant_loc = $this_grant->location;
            $lat = (float)$this_grant->lat;
            $lng = (float)$this_grant->lng;
            $services = $this->findNearestServices($lat,$lng,100);
            return response()->json(['results' => $services, 'loc'=>'true',
                'lat'=>$lat, 'lng'=>$lng],200);
        }
        catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage()],400);
        }
    }

    public function findNearestServices($latitude, $longitude, $radius = 100)
    {
        $listings = Services::selectRaw("* ,
             ( 3956 * acos( cos( radians(?) ) *
               cos( radians( lat ) )
               * cos( radians( lng ) - radians(?)
               ) + sin( radians(?) ) *
               sin( radians( lat ) ) )
             ) AS distance", [$latitude, $longitude, $latitude])
             ->where('category', '=', 'Business Planning')
             ->having("distance", "<", $radius)
             ->orderBy("distance",'asc')
             ->offset(0)
             ->limit(20)
             ->get();

             foreach($listings as $list){
                 if(strlen($list->location) > 30)
                     $list->location = substr($list->location,0,30).'...';

                 $user = User::where('id', $list->shop_id)->first();
                     if($user){
                         $list->manager = $user->fname.' '.$user->lname;
                         $list->contact = $user->email;
                      }
            }

        return $listings;
    }
}
