<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB; 
use Illuminate\Support\Facades\Auth;
use Hash;
use App\Models\admins;
use App\Models\User;
// use App\Models\visitors;
// use App\Models\liveSongs;
// use App\Models\RemovedSongs;
// use App\Models\mymusic;
// use App\Models\albums;
use App\Models\BusinessBids;
use App\Models\AcceptedBids;
use App\Models\serviceBook;
use App\Models\Listing;
use App\Models\Services;
use Mail;
use Session;
use Exception;
use stdClass;
class AdminController extends Controller
{

  public function login()
    {  
        return view('admin.login'); 
    }

     public function logout()
    {  
        Session::forget('admin');
     //$request->session()->invalidate();
     //$request->session()->regenerateToken();
        return redirect('admin/login'); 
    }

     public function index_admin()
    {          
        $artists= User::get();
        $users= [];// visitors::get();
       
        return view('admin.index_admin', compact('artists','users')); 
 }


 // Approve

    public function approve($id)
 {      
    try{
       User::where('id',$id)->update(['approved' => 1]);
       $artist=User::where('id',$id)->first();

       /* Send Email
    $email=$artist->email;
        $info=['art_id'=>$artist->art_id, 'email' => $email];
        $user['to']= $email;
        Mail::send('mails.approve_mail', $info, function($msg) use ($user){
            $msg->to($user['to']);
            $msg->subject('Approve Mail');

        });
         Send Email */
    

       return back()->with('success', "Approved!");
       }
       catch(\Exception $e){
      Session::put('exception',$e->getMessage());
      return redirect()->back();
     } 
   }


    public function restrict($id)
 {     

    try{
       User::where('id',$id)->update(['approved' => 0]);
       return back()->with('success', "Restricted!"); 
   }
   catch(\Exception $e){
      Session::put('exception',$e->getMessage());
      return redirect()->back();
     }
   }


 public function del_artist($id)
    {           
       User::where('id', $id)->delete();
       return back()->with('success', "Deleted!"); 
 }
 
 // Approve



public function users()
    {       
    $users= User::get();
    $data = array();

    foreach($users as $user){
        $investedBusiness = DB::table('business_bids')
        ->where('investor_id', $user->id)
            ->join('listings', 'business_bids.business_id', '=', 'listings.id')
            ->select('business_bids.*', 'listings.name')
            ->get();

        $activeBusiness = DB::table('business_bids')
            ->where('owner_id', $user->id)
            ->join('listings', 'business_bids.business_id', '=', 'listings.id')
            ->groupBy('business_bids.business_id')
            ->select('business_bids.*', 'listings.name', 'listings.investment_needed', 'listings.category')
            ->get();

        $bookedServices = DB::table('service_books')
        ->where('booker_id', '=', $user->id)
        ->join('services', 'service_books.service_id', '=', 'services.id')
        ->select('service_books.*', 'services.name','services.price')
        ->get();

        $user->investedBusiness = $investedBusiness;
        $user->bookedServices = $bookedServices;  
        $user->activeBusiness = $activeBusiness;        
    }
    //return $users;
    return view('admin.users', compact('users'));       
    }


public function listings_active()
    {       
        $acceptedBids = AcceptedBids::groupBy('business_id')->get();

        $businesses = new stdClass; $i=0;
        foreach($acceptedBids as $aBid){
            $row = DB::table('listings')
            ->where('listings.id',$aBid->business_id)
            ->join('users', 'listings.user_id', '=', 'users.id')
            ->select('listings.*', 'users.fname', 'users.lname', 'users.email')
            ->get();
        // ->join('milestones', 'listings.id', '=', 'milestones.listings_id')
            $businesses->$i = $row; $i++;
        }
        //return $businesses;
        
        return view('admin.listings_active',compact('businesses'));     
    }


    public function services_active()
    {       
        $acceptedBids = serviceBook::groupBy('service_id')->get();

        $businesses = new stdClass; $i=0;
        foreach($acceptedBids as $booking){
            $row = DB::table('services')
            ->where('services.id',$booking->service_id)
            ->join('users', 'services.shop_id', '=', 'users.id')
            ->select('services.*', 'users.fname', 'users.lname', 'users.email')
            ->get();
            $businesses->$i = $row; $i++;
        }
        //return $businesses;
        
        return view('admin.services_active',compact('businesses'));     
    }







//** Forgot

public function forgot($remail)
    { 

         return view('admin.forgot_password',compact('remail'));
     
    }


public function send_reset_email(Request $request)
    {

        try{
        $remail=$request->email;   
        // Send Email

        $info=['Name'=>'Dele', 'email' => $remail];
        $user['to']= $remail;
        Mail::send('admin.mail', $info, function($msg) use ($user){

            $msg->to($user['to']);
            $msg->subject('Test Mail');

        });

        echo "Check your email"; exit;
    }
    catch(\Exception $e){
      Session::put('exception',$e->getMessage());
      return redirect()->back();
     }
        // Send Email

    }


public function reset(Request $request, $remail)
    {
    try{ 
       $email=$remail;
       $password_1=$request->password; 
       $password=$request->c_password; 

       if($password_1==$password) {
     $password_1= Hash::make($password_1);
     $update= DB::table('admins')->where('email', $email)
     -> limit(1)->update(['password'=> $password_1]);

     if($update) {Session::put('reset', 'password reset success!');return redirect('admin/login'); }
       }    
          else {
            Session::put('wrong_pwd', 'password do not match! try again');
          return redirect()->back();
      }
  }
  catch(\Exception $e){
      Session::put('exception',$e->getMessage());
      return redirect()->back();
     }
}


//______________________________________________________________________________


public function adminLogin(Request $formData)
{    

try{  
$email = $formData->email;
$password = $formData->password;
$user= admins::where('email', $email)->get(); 
$check_user=json_decode($user);
//print_r($check_user); echo $check_user[0]->password; exit;

if($user->count() >0 ) {
$db_password=$check_user[0]->password; //opd_admin
if(password_verify($password, $db_password)) { 
    Session::put('admin','Logged!'); 
    return redirect('admin/index_admin'); }
else{
    Session::put('auth_failed','Password wrong!'); return redirect()->back();
   

}
    }

      Session::put('auth_failed','User dont exist!'); return redirect()->back();
  }
  catch(\Exception $e){
      Session::put('auth_failed',$e->getMessage());
      return redirect()->back();
     }

}




    public function adminLogout(Request $request)
{
    Auth::guard('admin')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('admin/login');
}

    //** Login attempt and Custom Authentication




// Remove special chars
    function clean($string) {
   $string = str_replace(' ', '', $string); // Replaces all spaces with hyphens.

   return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}




      public function get_sugges($sText) {   
      $searchName=$sText; 
      $cat=DB::table('categories')->where('name', 'like', '%'.$searchName.'%')->get();
      $cats=DB::table('categories')->where('name', 'like', '%'.$searchName.'%')->first();

      if($cat->count()>0) $cat_doc_id=$cats->id; else $cat_doc_id=0;

      $result=DB::table('doctors')->where('name', 'like', '%'.$searchName.'%')->
      orWhere('category_id',$cat_doc_id)->get();

         return response()->json([ 'data'=>$result ]);

     }


     public function searchInAdmin(Request $request) {   
      $searchText=trim($request->text); 
      $users = User::where('fname', 'like', '%'.$searchText.'%')
      ->orWhere('fname', 'like', '%'.$searchText.'%')
      ->orWhere('lname', 'like', '%'.$searchText.'%')
      ->orWhere('email', 'like', '%'.$searchText.'%')
      ->orWhere('website', 'like', '%'.$searchText.'%')
      ->get();
      //return $users;

      return view('admin.users', compact('users'));     

     }


}