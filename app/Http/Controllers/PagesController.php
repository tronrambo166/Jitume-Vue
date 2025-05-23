<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Models\Listing;
use App\Models\Grant;
use App\Models\CapitalOffer;
use App\Models\Services;
use App\Models\Cart;
use App\Models\Shop;
use App\Models\Equipments;
use App\Models\businessDocs;
use App\Models\User;
use App\Models\Conversation;
use App\Models\serviceBook;
use App\Models\Prospects;
use App\Models\Reports;
use Session;
use Hash;
use Auth;
use Mail;
use PDF;
use Response;
use App\Http\Controllers\testController;



class PagesController extends Controller
{
    protected $api_base_url;
    public function __construct()
    {
        $this->api_base_url = env('API_BASE_URL');
    }


    public function skip(){
        Session::put('investor_auth',true);
        return redirect('/');
    }

    public function loginB(Request $request){
    $email = $request->email;
    $password = $request->password;
    $user = User::where('email',$email)->where('business',1)->first();
    if($user!=''){
    if(password_verify($password, $user->password)){
        Session::put('business_email', $email);
        Session::put('business_auth',true);
        return redirect('business');// view('business.index');
    }

    else {
        Session::put('login_err','Incorrect Credentials!');
        return redirect('home');
    } }
    else{
        Session::put('login_err','Business User do not exist!');
        return redirect('home');
    }

    }


    public function loginI(Request $request){
    $email = $request->email;
    $password = $request->password;
    $user = User::where('email',$email)->first();
    if($user!=''){
    if(password_verify($password, $user->password)){
    Session::put('investor_email', $user->email);
        Session::put('investor_auth',true);
    return redirect('home');
    }

    else
    {
        Session::put('login_err','Incorrect Credentials!');
        return redirect('home');
    } }

    else{
        Session::put('login_err','Service Provider do not exist!');
        return redirect('home');
    }

    }

public function registerS(Request $request){
$service = 1;
$user = User::latest()->first();

try {
 User::where('id',$user->id)->update([
            'service' => $service
           ]);
        Session::put('service_email', $user->email);
        Session::put('auth_service','Registration Success! Please Log In to continue.');

        if (Session::has('social_reg')) {
         Session::put('service_auth',true);
         return redirect('services');

          }

        Auth::logout();
        session_unset();
        return redirect('/');

} catch (\Exception $e) {

Session::put('login_err',$e->getMessage());
    return redirect()->back();
}
}



public function registerB(Request $request){
$business = 1;
$user = User::latest()->first();

try {
 User::where('id',$user->id)->update([
            'business' => $business
           ]);

        Session::put('business_email', $user->email);
        Session::put('auth_business','Registration Success! Please Log In to continue!');

        if (Session::has('social_reg')){
            Session::put('business_auth',true);
            return redirect('business');
        }


        Auth::logout();
        session_unset();
        return redirect('/');

} catch (\Exception $e) {

Session::put('login_err',$e->getMessage());
    return redirect()->back();
}
}

public function registerI(Request $request){

//Session
 Session::put('old_fname',$request->fname);
 Session::put('old_lname',$request->lname);
 Session::put('old_mname',$request->mname);
 Session::put('old_email',$request->email);
 Session::put('old_id_no',$request->id_no);
 Session::put('old_tax_pin',$request->tax_pin);
 Session::put('old_past_investment',$request->past_investment);
 Session::put('old_website',$request->website);
//Session

$investor = 1;
$user = User::where('email',$request->email)->first();
    if($user!=''){
    Session::put('login_err','User already exists!');
     return redirect('/');
     }

 $inv_range = $request->inv_range;
 $interested_cats = $request->interested_cats;
 $past_investment = $request->past_investment;
 $website = $request->website;
 $id_no = $request->id_no;
 $tax_pin = $request->tax_pin;

//Upload
$user = User::latest()->first();
$inv_id = $user->id+1;

try {
 $passport=$request->file('id_passport');
 if(isset($request->pin))
 $pin=$request->file('pin');

 if (!file_exists('files/investor/'.$inv_id))
          mkdir('files/investor/'.$inv_id, 0777, true);
          $loc='files/investor/'.$inv_id.'/';

 if(isset($pin) && $pin !=null) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($pin->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('login_err','For pin, Only pdf & docx are allowed!');
            return redirect('/');
          }

          $create_name=$uniqid.'.'.$ext;
          //Move uploaded file
          $pin->move($loc, $create_name);
          $final_pin=$loc.$create_name;
             } else $final_pin=null;

   if($passport) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($passport->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('login_err','For passport, Only pdf & docx are allowed!');
            return redirect('/');
          }

          $create_name=$uniqid.'.'.$ext;
          $passport->move($loc, $create_name);
          $final_passport=$loc.$create_name;
             }else $final_passport='';
//Upload

            User::create([
            'fname' => $request->fname,
            'mname' => $request->mname,
            'lname' => $request->lname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'pin' => $final_pin,
            'id_passport' => $final_passport,
            'investor' => $investor,
            'id_no' => $id_no,
            'tax_pin' => $tax_pin,
            'inv_range' =>  json_encode($inv_range),
            'interested_cats' =>  json_encode($interested_cats),
            'past_investment' => $past_investment,
            'website' => $website
           ]);

       Session::put('login_success','Registration successfull! Please login to continue.');
       return redirect('/');

        Session::put('investor_email', $user->email);
        Session::put('investor_auth',true);
         return redirect('/');


} catch (\Exception $e) {
   return $e->getMessage();
    Session::put('login_err',$e->getMessage());
     return redirect('/');
}

}

//-------------------Login-Register
//public function clear(){ \Artisan::call('config:cache'); return redirect('home'); }

 public function home(){

         $app_url = config('app.url');
         $auth_user = auth()->user();
         $business=0;
         if($auth_user){
         $auth_user = true;
         }
         else {
         if(Session::has('investor_email')){
         $mail = Session::get('investor_email');
         $user = User::where('email',$mail)->first();
         if($user->investor == 1 )
            $auth_user = true;
    }
    }

         return view('home',compact('auth_user','app_url','business'));

    }


public function getAddress($search){
// Read the JSON file
$json = file_get_contents("js/airports.json");

// Decode the JSON file
$array = json_decode($json, true);
// Display data
$results=array();$i=0;
foreach ($array as $loc) {

    if(strtolower($loc['name']) == $search || strtolower($loc['city']) == $search || strtolower($loc['country']) == $search) {
    $results[$i]['name']  = $loc['name'];
    $results[$i]['city']  = $loc['city'];
    $results[$i]['country']  = $loc['country'];$i++;
}

   else if(str_contains(strtolower($loc['name']), $search) || str_contains(strtolower($loc['city']), $search) || str_contains(strtolower($loc['country']), $search)) {
    $results[$i]['name']  = $loc['name'];
    $results[$i]['city']  = $loc['city'];
    $results[$i]['country']  = $loc['country'];$i++;
}
}
return response()->json(['data'=>$results]);

    }


public function search(Request $request){
$listing_name = $request->listing_name;

$location = $request->location;
$lat = (float)$request->lat;
$lng = (float)$request->lng;
$category = $request->category;
$results = array();


if($listing_name) {
    $check_listing = Listing::where('name', 'like', '%'.$listing_name.'%')->get();
}

else if($location =='' && $category == '')
$check_listing = Listing::where('active',1)->get();

else if($location !='' && $category == '')
$check_listing = $this->findNearestListings($lat,$lng,100);


else if($location =='' && $category != '')
$check_listing = Listing::where('active',1)->where('category',$category)
->get();

else
$check_listing = $this->findNearestListings($lat,$lng,100);

if($location != '') $loc = true; else $loc = false;

//Test

//Test

$listings = $check_listing;
return response()->json(['results'=>$listings, 'loc' => $loc, 'success' => "Success"]);

}

public function searchResults($ids){

$results = array();
if($ids==0)
    return response()->json([ 'data' => $results, 'count'=>0] );

$ids = explode(',',$ids);
$max_range = 0;
$store_range = array();
foreach($ids as $id){

     //if(strlen($id) > 3) $id = dechex($id); return $id;
    if($id!=''){
    $conv = Conversation::where('investor_id',Auth::id())->
    where('listing_id',$id)->where('active',1)->first();

    $listing = Listing::where('id',$id)->first();
    $files = businessDocs::where('business_id',$id)
    ->where('media',1)->first();

    if($listing){
    if(isset($files->file))
    $listing->file = $files->file;
    else
      $listing->file = false;
    $listing->investment_needed = $listing->investment_needed;


    $range = explode('-', $listing->y_turnover);
    //$range[0] = number_format($range[0]);
    //$range[1] = number_format($range[1]);
    $store_range[] = $range[1];
    //$listing->y_turnover = implode('-', $range);

    $listing->lat = (float)$listing->lat;
    $listing->lng = (float)$listing->lng;

    $listing->id = $listing->id;
  }
    $results[] = $listing;
}
}

rsort($store_range);
$max_range = $store_range[0];
if($conv!=null)$conv = true;else $conv=false;
return response()->json([ 'data' => $results, 'count'=>count($results), 'max_range' => $max_range] );
}


public function latBusiness(){
$results = array();

    try{
        $listingSpecial = Listing::where('category','Agriculture')
            ->orWhere('category','Renewable/Energy')
            ->where('active',1)->latest()->get();
        $results = $listingSpecial;

        $listings = Listing::where('active',1)->latest()->get();$i=1;
        foreach($listings as $listing){
            if(strlen($listing->location) > 30)
                $listing->location = substr($listing->location,0,30).'...';
            $listing->investment_needed = number_format($listing->investment_needed);
            $listing->file=null;
            if($i<11 && ($listing->category!='Agriculture' && $listing->category!='Renewable/Energy') )
                $results[] = $listing;$i++;
        }

        $grants = Grant::where('visible',1)->latest()->get();
        $capitals = CapitalOffer::where('visible',1)->latest()->get();

        return response()->json([ 'data' => $results, 'grants' => $grants, 'capitals' => $capitals],200 );
    }
    catch (\Exception $e){
        return response()->json([ 'mesasge' => $e->getMessage()],400 );
    }

}

public function latServices(){
$results = array();
    $listings = Services::latest()->get();$i=1;
    foreach($listings as $listing){
        if(strlen($listing->location) > 30)
        $listing->location = substr($listing->location,0,30).'...';
        $listing->price = number_format($listing->price);
        $listing->file=null;
        if($i<11)
         $results[] = $listing;$i++;
     }

return response()->json([ 'data' => $results ]);
}

public function searchService(Request $request){
$listing_name = $request->listing_name;
$location = $request->search;
$category = $request->category;
$lat = (float)$request->lat;
$lng = (float)$request->lng;
$results = array();
$loc = false;
//return response()->json(['success' => $location]);

if($location != ''){
    $check_listing = $this->findNearestServices($lat,$lng,100);
    $loc = true;
}

else if($listing_name !='' ){
  $check_listing = Services::where('name', 'like', '%'.$listing_name.'%')->get();
  return response()->json(['results'=>$check_listing,'loc'=>$loc, 'success' => "Success", 'count'=>count($check_listing)]);
}

else if($listing_name =='' && $location == '' && $category == ''){
  $check_listing = Services::get();
  return response()->json(['results'=>$check_listing,'loc'=>$loc, 'success' => "Success", 'count'=>count($check_listing)]);
}

else
$check_listing = Services::where('category',$category)->get();

// foreach($check_listing as $service){
//     if (str_contains(strtolower($service->name), $listing_name)) {
//         $results[] = $service;
// } }

// foreach($check_listing as $service){
//     if (!str_contains(strtolower($service->name), $listing_name)) {
//         $results[] = $service;
// } }

$listings = $check_listing; //$results;
return response()->json(['results'=>$listings,'loc'=>$loc, 'success' => "Success"]);

}

public function serviceResults($ids){
$results = array();$count = 0;
$ids = explode(',',$ids);
foreach($ids as $id){
    if($id!='' && $id != 'no-results'){
    $listing = Services::where('id',$id)->first();

    if($listing){
    $listing->price = number_format($listing->price);

    $listing->lat = (float)$listing->lat;
    $listing->lng = (float)$listing->lng;


//Booking check
$booking = serviceBook::where('service_id',$id)
->where('booker_id', Auth::id())->first();
if($booking) $listing->booked = 1; else $listing->booked = 0;

    $count++;
    $results[] = $listing;
}
}
}

return response()->json([ 'data' => $results, 'count'=>$count] );
}


public function serviceResultsAuth($ids){
$results = array();$count = 0;
$ids = explode(',',$ids);
foreach($ids as $id){
    if($id!='' && $id != 'no-results'){
    $listing = Services::where('id',$id)->first();

    if($listing){
    $listing->price = number_format($listing->price);

    $listing->lat = (float)$listing->lat;
    $listing->lng = (float)$listing->lng;


//Booking check
$booking = serviceBook::where('service_id',$id)
->where('booker_id', Auth::id())->first();
if($booking) $listing->booked = 1; else $listing->booked = 0;

    $count++;
    $results[] = $listing;
}
}
}

return response()->json([ 'data' => $results, 'count'=>$count] );
}


public function categoryResults($name){
$results = array();
if($name == 'Project-Management')
$name == '0';
$name = str_replace('-','/',$name);
$name = str_replace('_',' ',$name);

$listing = Listing::where('active',1)->where('category',$name)->get();
foreach($listing as $list){

    $files = businessDocs::where('business_id',$list->id)
    ->where('media',1)->first();
    if(isset($files->file))
    $list->file = $files->file;
    else $list->file = false;

    $list->investment_needed = number_format($list->investment_needed);

    $results[] = $list;
}

$services = Services::where('category',$name)->get();

return response()->json([ 'data' => $results, 'services' => $services] );
}


public function categoryCount(){
//$name = str_replace('-','/',$name);
//$name = str_replace('_',' ',$name);
$listing = Listing::groupBy('category')->select('category', DB::raw('count(*) as total'))->get();
$all_listing = Listing::get();
return response()->json([ 'data' => $listing, 'listing_count' => $all_listing->count() ] );
}




public function equipments($id){

    $Equipment = Equipments::where('listing_id',$id)->get();
    return response()->json(['data' => $Equipment] );
}


public function invest($listing_id,$id,$amount,$realAmount,$type){
    $investor = User::where('id',Auth::id())->first();

    $Equipment = Equipments::where('id',$id)->first();
    Equipments::where('id',$id)->update([
        'status' => 'inactive'
    ]);

    $listing = listing::where('id',$listing_id)->first();
    $old_amount = $listing->investment_needed;
    $old_share = $listing->share;
    $new_share = ($amount*$old_share)/$old_amount;

    if($old_amount<$amount)
    return response()->json(['response' => '<p class="font-weight-bold text-danger">Error: Value needed is less than given value!</p>'] );

    listing::where('id',$listing_id)->update([
        'investment_needed' => $old_amount-$amount,
        'share' => $old_share-$new_share
    ]);

        $info=['eq_name'=>$Equipment->eq_name,
            'Name'=>$investor->name,'amount'=>$amount,
            'email' => $investor->email, 'type'=>$type];

        $user['to'] = 'sohaankane@gmail.com';//$listing->contact_mail;

        Mail::send('invest_mail', $info, function($msg) use ($user){
            $msg->to($user['to']);
            $msg->subject('Test Invest Alert!');
        });

    if($type=='donate')
    return response()->json(['response' => 'Donate request sent successfully!'] );
    else
    return response()->json(['response' => 'Invest request sent successfully!'] );
}


public function priceFilter($min, $max, $ids){
    $results = array();
    $ids = explode(',',$ids);
    foreach($ids as $id){
    if($id!=''){
    $listing = Listing::where('id',$id)->first();
    $range = explode('-',$listing->y_turnover);
    $db_min = $range[0];$db_max = $range[1];

//Video check
    $files = businessDocs::where('business_id',$id)
    ->where('media',1)->first();
    if(isset($files->file))
    $listing->file = $files->file;
    else $listing->file = false;
//Video check

    $listing->lat = (float)$listing->lat;
    $listing->lng = (float)$listing->lng;

    $listing->investment_needed = number_format($listing->investment_needed);

    $range[0] = number_format($range[0]); $range[1] = number_format($range[1]);
    $listing->y_turnover = implode('-', $range);

    if((int)$min <= $db_max && (int)$max >= $db_max)
        //return response()->json([ 'data' => (int)$min .'<='. $db_min .'//'.(int)$max .'>='. $db_max]);
    //if($db_max >= (int)$max)
    $results[] = $listing;
}
}

    return response()->json([ 'data' => $results]);
}


public function priceFilterS($min, $max, $ids){  //return $ids;

    $results = array();
    $ids = explode(',',$ids);

    try {
    foreach($ids as $id){
    if($id!=''){
    $listing = Services::where('id',$id)->first();
        if($listing){
        $range = $listing->price;
        $db_price = $range;

        $listing->lat = (float)$listing->lat;
        $listing->lng = (float)$listing->lng;

        $listing->price = number_format($listing->price);
        if((int)$min <= $db_price && (int)$max >= $db_price)
        $results[] = $listing;
    }
}
}
}
catch (Exception $e) {
       return response()->json($e->getMessage());
}

    return response()->json([ 'data' => $results]);
}


public function priceFilter_amount($min, $max, $ids){
    $results = array();
    $ids = explode(',',$ids);
    foreach($ids as $id){
    if($id!=''){
    $listing = Listing::where('id',$id)->first();
    $range = $listing->investment_needed;
    //$db_min = $range[0];$db_max = $range[1];

//Video check
    $files = businessDocs::where('business_id',$id)
    ->where('media',1)->first();
    if(isset($files->file))
    $listing->file = $files->file;
    else $listing->file = false;
//Video check

    $listing->lat = (float)$listing->lat;
    $listing->lng = (float)$listing->lng;

    $listing->investment_needed = number_format($listing->investment_needed);
    $turnover = explode('-', $listing->y_turnover);
    $turnover[0] = number_format($turnover[0]);
    $turnover[1] = number_format($turnover[1]);
    $listing->y_turnover = implode('-', $turnover);

    if((int)$min <= $range && (int)$max >= $range)
        //return response()->json([ 'data' => (int)$min .'<='. $db_min .'//'.(int)$max .'>='. $db_max]);
    $results[] = $listing;
}
}

    return response()->json([ 'data' => $results]);
}


public function create_service(){
$events = Events::latest()->get();
return view('create_service',compact('events'));

}


public function addToCart($id,$qty){
$service = Services::where('id',$id)->first();
$user_id = Auth::id();
$name = $service->name;
$service_id = $service->id;
$category = $service->category;
$price = $service->price;
$details = $service->details;
$user_id = Auth::id();
//return response()->json(['response' => 'Added to cart!'] );

Cart::create([
            'user_id' => $user_id,
            'name' => $name,
            'service_id' => $service_id,
            'category' => $category,
            'price' => $price,
            'details' => $details,
            'qty' => $qty
           ]);
return response()->json(['response' => 'Added to cart!'] );
}


public function cart(){
    $total =0;
    $cart = Cart::where('user_id',Auth::id())->get();
    foreach($cart as $c)
        $total = $total + ($c->price*$c->qty);

    $cartCount = count($cart);
    return response()->json(['data'=>$cart, 'cart' => $cartCount,
        'total'=>$total] );
    }

public function removeCart($id){
    $cart = Cart::where('id',$id)->delete();

    $total =0;$cart = Cart::where('user_id',Auth::id())->get();
    foreach($cart as $c)
        $total = $total + ($c->price*$c->qty);
    return response()->json(['data'=>'success','total'=>$total]);
    }


  public function download_business($id){
    $doc = Listing::where('id',$id)->first();
    $file=$doc->document;
    if( $file == null || !file_exists(public_path($file)) ){
        return response('404');
    }

    $headers = array('Content-Type'=> 'application/pdf');
    $url= public_path($file);
    $extension = pathinfo($url, PATHINFO_EXTENSION);

    response()->json(['type'=>$extension]);
    return response()->download($url);
    //return response()->json(['data'=>'success']);

    }

    public function download_statement($id){
    $doc = Listing::where('id',$id)->first();
    $file=$doc->yeary_fin_statement;
    if( $file == null || !file_exists(public_path($file)) ){

        return response('404');
    }


    else{
    $headers = array('Content-Type'=> 'application/pdf');
    $url= public_path($file);
    $extension = pathinfo($url, PATHINFO_EXTENSION);

    response()->json(['type'=>$extension]);
    return response()->download($url);
    }
    //return Response::download($file, 'business_statement.pdf', $headers);

    }


public function update_profile(Request $req)
{
    $obj = new testController();
    try{
         $user_id=Auth::id();
         $current = User::where('id',$user_id)->first();
         $data['fname'] = $req->fname;
         $data['lname'] = $req->lname;
         $data['mname'] =  $req->mname;
         //$data['email'] = $req->email;
         $data['dob'] = $req->dob;
         $data['gender'] = $req->gender;
         $old_cover = $current->image;

         // if($req->password!=null)
         // $data['password'] = password_hash($req->password,PASSWORD_DEFAULT)

         //FILE
          $image=$req->file('image');
          if($image) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($image->getClientOriginalExtension());
          $create_name=$uniqid.'.'.$ext;
          $loc='images/users/';
          //Move uploaded file
          //$image->move($loc, $create_name);
          $final_img=$this->api_base_url.$loc.$create_name;
          //Compress
          $compressedImage = $obj->compressImage($image, $loc.$create_name, 60);
          $data['image'] = $final_img;

          if($old_cover!=null && file_exists($old_cover))
           unlink($old_cover);

          }

         $Update = User::where('id',$user_id)->update($data);

         if($Update)
         return response()->json([ 'status' => 200, 'message' => 'Success!']);
        }
        catch(\Exception $e){
            return response()->json([ 'status' => 404, 'message' => $e->getMessage() ]);
        }

}



public function profile(){
$id = Auth::id();
$user = User::where('id',$id)->first();
return view('profile',compact('user'));

}

public function JitumeSubscribeEmail($email){
    $user['to'] = $email;
    $info = [];
    $prospect = Prospects::create([
        'email' => $email
    ]);
    Mail::send('subscribe_mail', $info, function($msg) use ($user){
        $msg->to($user['to']);
        $msg->subject('Subscribe to Jitume');
    });
    return response()->json(['status' => 200, 'message' => 'Thank you for Subscribing, you will receive an email with updates!']);

}

public function submitReport(Request $request){

    try{
        $listing_id = $request->listing_id;

        if($request->type == 1){
            $listing = Listing::where('id',$listing_id)->first();
        }
        else{
            $listing = Services::where('id',$listing_id)->first();
        }

          $user = User::select('fname','email')->where('id', Auth::id())->first();
          $document=$request->file('document');
          if($document) {
          $ext=strtolower($document->getClientOriginalExtension());
          // if($ext!='pdf' && $ext!= 'docx')
          // {
          //   return response()->json([ 'status' => 404, 'message' => 'Only pdf & docx are allowed!']);
          // }
          }

        $report = Reports::create([
            'user_id' => Auth::id(),
            'listing_id' => $listing_id,
            'listing_name' => $listing->name,
            'owner_id' => $listing->user_id,
            'type' => $request->type,
            'category' => $request->category,
            'details' => $request->details,
            'document' => null,
        ]);

        $report_id = $report->id;

        if($document) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($document->getClientOriginalExtension());
          $create_name=$uniqid.'.'.$ext;
          if(!file_exists('files/reports/'.$report_id))
          mkdir('files/reports/'.$report_id, 0777, true);

          $loc='files/reports/'.$report_id.'/';
          //Move uploaded file
          $document->move($loc, $create_name);
          $final_document=$loc.$create_name;
        }
        else $final_document='';

        $update = Reports::where('id',$report_id)->update([
            'document' => $final_document,
        ]);

        //Mail
        $user['to'] = $user->email; $info = ['listing_name'=> $listing->name, 'category'=>
        $request->category, 'id'=> $report->id];
        Mail::send('report_mail', $info, function($msg) use ($user){
            $msg->to($user['to']);
            $msg->subject('Report Submitted');
        });
        return response()->json(['status' => 200, 'message' => 'Report Submitted!']);
    }
    catch(\Exception $e){
        return response()->json(['status' => 400, 'message' => $e->getMessage()]);

    }

}


//Distance
public function findNearestListings($latitude, $longitude, $radius = 100)
    {
        /*
         * using eloquent approach, make sure to replace the "Restaurant" with your actual model name
         * replace 6371000 with 6371 for kilometer and 3956 for miles
         */
        $listings = Listing::selectRaw("* ,
                         ( 3956 * acos( cos( radians(?) ) *
                           cos( radians( lat ) )
                           * cos( radians( lng ) - radians(?)
                           ) + sin( radians(?) ) *
                           sin( radians( lat ) ) )
                         ) AS distance", [$latitude, $longitude, $latitude])
            ->where('active', '=', 1)
            ->having("distance", "<", $radius)
            ->orderBy("distance",'asc')
            ->offset(0)
            ->limit(20)
            ->get();

        return $listings;
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
            //->where('active', '=', 1)
            ->having("distance", "<", $radius)
            ->orderBy("distance",'asc')
            ->offset(0)
            ->limit(20)
            ->get();

        return $listings;
    }


//Class closes
}
