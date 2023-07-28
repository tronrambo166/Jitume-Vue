<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Models\Listing;
use App\Models\Services;
use App\Models\Cart;
use App\Models\Shop;
use App\Models\Equipments;
use App\Models\businessDocs;
use App\Models\User;
use App\Models\Conversation;
use Session; 
use Hash;
use Auth;
use Mail;
use PDF;



class PagesController extends Controller
{
    //-------------------Login-Register

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
$investor = 1;
$user = User::where('email',$request->email)->first();
    if($user!=''){ 
    Session::put('login_err','User already exists!');
     return redirect('home');
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
            'inv_range' =>  $inv_range,
            'interested_cats' =>  $interested_cats, 
            'past_investment' => $past_investment,
            'website' => $website         
           ]);  
       
       Session::put('login_success','Registration successfull! Please login to continue.');
       return redirect('/');

        Session::put('investor_email', $user->email);    
        Session::put('investor_auth',true);
         return redirect('home');             


} catch (\Exception $e) {
   return $e->getMessage();
    Session::put('login_err',$e->getMessage());
     return redirect('home'); 
}

}

//-------------------Login-Register


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
//$listing_name = $request->listing_name;
$location = $request->search;
$category = $request->category;
$results = array();
//return response()->json(['success' => $category]);

$check_listing = Listing::where('location',$location)
->where('category',$category)
->get();

// foreach($check_listing as $service){ 
//     if (str_contains(strtolower($service->name), $listing_name)) {
//         $results[] = $service;
// } }

// foreach($check_listing as $service){ 
//     if (!str_contains(strtolower($service->name), $listing_name)) {
//         $results[] = $service;
// } }

$listings = $check_listing; // $results;
return response()->json(['results'=>$listings, 'success' => "Success"]);

}

public function searchResults($ids){
$results = array();
$ids = explode(',',$ids); 
foreach($ids as $id){ 
    if($id!=''){ 
    $conv = Conversation::where('investor_id',Auth::id())->
    where('listing_id',$id)->first();

    $listing = Listing::where('id',$id)->first();
    $files = businessDocs::where('business_id',$id)
    ->where('media',1)->first();
    if(isset($files->file))
    $listing->file = $files->file;
    else $listing->file = false;

    $results[] = $listing;
}
}
if($conv!=null)$conv = true;else $conv=false;
return response()->json([ 'data' => $results, 'conv'=>$conv] );
}


public function latBusiness(){
$results = array();
    $listings = Listing::latest()->get();$i=1;
    foreach($listings as $listing){
        $listing->file=null;
        if($i<5)
         $results[] = $listing;$i++;
     }

return response()->json([ 'data' => $results] );
}

public function searchService(Request $request){
$listing_name = $request->listing_name;
$location = $request->search;
$category = $request->category;
$results = array();
//return response()->json(['success' => $category]);

$check_listing = Services::where('category',$category)
//->where('category',$category)
->get();

foreach($check_listing as $service){ 
    if (str_contains(strtolower($service->name), $listing_name)) {
        $results[] = $service;
} }

foreach($check_listing as $service){ 
    if (!str_contains(strtolower($service->name), $listing_name)) {
        $results[] = $service;
} }

$listings = $results;
return response()->json(['results'=>$listings, 'success' => "Success"]);

}

public function serviceResults($ids){
$results = array();
$ids = explode(',',$ids); 
foreach($ids as $id){ 
    if($id!=''){ 
    $listing = Services::where('id',$id)->first();
    $results[] = $listing;
}
}
return response()->json([ 'data' => $results] );
}


public function categoryResults($name){
$results = array();
$name = str_replace('-','/',$name);
$name = str_replace('_',' ',$name);

$listing = Listing::where('category',$name)->get();
foreach($listing as $list){ 

    $files = businessDocs::where('business_id',$list->id)
    ->where('media',1)->first();
    if(isset($files->file))
    $list->file = $files->file;
    else $list->file = false;

    $results[] = $list;
}

$services = Services::where('category',$name)->get();

return response()->json([ 'data' => $results, 'services' => $services] );
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
  
    if((int)$min <= $db_min && (int)$max >= $db_max)
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
    $data = '';
    $pdf = PDF::loadView('download.business_details'); 
    return $pdf->download('business_details.pdf'); 

    //return response()->json(['data'=>'success']);

    }

public function save_service(Request $request){
$s_name = $request->s_name;
$phone = $request->phone;
$service_cats = implode(',', $request->service_cats);
$instant_book = $request->instant_book;
$s_details = $request->s_details;
$s_loction = $request->s_loction;
$max_guests = $request->max_guests;
$min_guests = $request->min_guests;
$reservation_start = $request->reservation_start;
$reservation_end = $request->reservation_end;
$s_per_day = $request->s_per_day;
$s_per_hour = $request->s_per_hour;

$user_id = Auth::id();



Services::create([
            'user_id' => $user_id,
            's_name' => $s_name,
            'phone' => $phone,
            'service_cats' => $service_cats,
            'instant_book' => $instant_book,
            's_details' => $s_details,
            's_loction' => $s_loction,
            'max_guests' => $max_guests,
            'min_guests' => $min_guests,
            'reservation_start' => $reservation_start,
            'reservation_end' => $reservation_end,
            's_per_day' => $s_per_day,
            's_per_hour' => $s_per_hour
           ]);

          $image=$request->file('s_posters'); //print_r($image);

          if($image) {
          foreach ($image as $single_img) { 
            # code...
          $uniqid=hexdec(uniqid());
          $ext=strtolower($single_img->getClientOriginalExtension());
          $create_name=$uniqid.'.'.$ext;
          $loc='images/services/';
          //Move uploaded file
          $single_img->move($loc, $create_name);
          $final_img=$loc.$create_name;
           //getting event id
          $ev=Services::orderBy('id', 'DESC')->first();
          $ev_id=($ev->id);

           Images::create([
            'img_name' => $create_name,
            's_id' => $ev_id
           ]);

             } }

        Session::put('success','Service added!');
        return redirect('home');

}


public function up_profile(Request $req){
       
// if (Auth::attempt(['email' => $request['email'], 'password' => $request['password']])) {
     // return redirect()->route('dashboard');} else return redirect()->back();
// use above or below both are okay
         $user_id=Auth::id();      
         $data['fname'] = $req->fname;
         $data['lname'] = $req->lname;
         $data['name'] =  $req->name;
         $data['email'] = $req->email;
         if($req->password!=null)
         $data['password'] = password_hash($req->password,PASSWORD_DEFAULT);
        
         User::where('id',$user_id)->update($data);
         return back()->with('success', 'Updated!');
       
    }
    


public function profile(){
$id = Auth::id();
$user = User::where('id',$id)->first();
return view('profile',compact('user'));

}



//Class closes
}
