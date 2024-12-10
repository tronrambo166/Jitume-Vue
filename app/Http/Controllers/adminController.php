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
use Mail;
use Session;
use Exception;
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




 // Artists

public function artists()
    {       
        $artists= User::latest('id')->get();
        return view('admin.artists', compact('artists'));       
    }


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

 public function remove_song($id)
    {  
       try{ 
       $song = array();
       $removed = DB::table('live_songs')->where('position',$id)->first();

       DB::table('live_songs')->where('position', $id)->delete();
	   for($i=$id+1;$i<26;$i++){
	   $pos = DB::table('live_songs')->where('position',$i)->first();

       if($pos != null)
	   DB::table('live_songs')->where('position', $i)->
       update(['position' => $pos->position-1]);
	   }

       //Adding to DB
       $song['artist'] = $removed->artist;
       $song['song'] = $removed->song;
       RemovedSongs::insert($song);
       return back()->with('success', "Deleted!"); 
   }
   catch(\Exception $e){
      Session::put('exception',$e->getMessage());
      return redirect()->back();
     }
 }
 
 // Artists



public function users()
    {       
    $users= User::get();

    foreach($users as $user){
        //$investedBusiness= BusinessBids::where('investor_id', $user->id)->
        //->join('listings', 'BusinessBids.business_id', '=', 'listings.id')
           // ->select('users.*', 'contacts.phone', 'orders.price')get();
        //$bookedServices= User::get();

        // $investedBusiness = DB::table('business_bids')
        // ->join('listings', function ($join) {
        //     $join->on('business_bids.business_id', '=', 'listings.id')
        //          ->where('business_bids.investor_id', '=', $user->id);
        // })
        // ->get();

        // $bookedServices = DB::table('service_books')
        // ->join('services', function ($join) {
        //     $join->on('service_books.service_id', '=', 'services.id')
        //          ->where('service_books.booker_id', '=', $user->id);
        // })
        // ->get();
        //return $investedBusiness;
    }
    
    return view('admin.users', compact('users'));       
    }


public function songs()
    {       
   $static20=liveSongs::take(20)->get();
   $lastDay=DB::table('last_day_songs')->get();
   return view('admin.songs',compact('static20','lastDay'));     
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

public function editorLogin(Request $formData)
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
    Session::put('edit_permit',true);
    setcookie("edit_permit", true, time() + (60 * 30)); 
    return redirect('/'); 
	}
else{
    Session::put('log_err','Password wrong!'); return redirect()->back();
   

}
    }

      Session::put('log_err','User dont exist!'); return redirect()->back();
  }
  catch(\Exception $e){
      Session::put('exception',$e->getMessage());
      return redirect()->back();
     }

}


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