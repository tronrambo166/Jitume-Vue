<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Hash;
use Session;
use App\Models\User;
use App\Models\ApplyShow;
use Mail;
use Laravel\Socialite\Facades\Socialite;
use DateTime;
use DateTimeZone;
use DB;

class socialController extends Controller
{

     //Social Login
    public  function google(){
       $user = Socialite::driver('google')->stateless()->user(); 
        try { 
        $register = $this->patient_reg($user);
        }
         catch (Exception $e) {
            return $e->message();
        }
             
    }

    public  function facebook(){ 
        $user = Socialite::driver('facebook')->stateless()->user();
        try { //return $user->name;
        $register = $this->patient_reg($user);
        }
         catch (Exception $e) {
            return $e->message();
        }
    }

    //Social Login


    //PATIENTS
    public function patient_reg($hos)
    { 
      $name=explode(' ',$hos->name); 
      $fname = $name[0];
      if (isset($name[2]))
      $lname = $name[1].' '.$name[2];
      else $lname = $name[1];
      $email=$hos->email;

    if($email == null) {
        $email='test@gmail.com';
        echo "<script> alert('You must have an email associated with the facebook id!') </script>"; 
        //redirect()->to(config('app.app_url'))->send();
    }

     $user= User::where('email', $email)->get(); 
     if($user->count() > 0 ) {
          $token = 'a123456789';//$user->createToken('main')->plainTextToken;
          redirect()->to(config('app.app_url').'?user='.json_encode($user).'&token='.$token)->send();
     }

     else
     { 

        try{
            $user = User::create([

                'fname'=> $fname,
                'lname' => $lname,
                'email' => $email,
                'password'=> bcrypt('a123456789')
             ]);
             $token = 'a123456789';//$user->createToken('main')->plainTextToken;

            redirect()->to(config('app.app_url').'?user='.json_encode($user).'&token='.$token)->send();
            
            // Auth::login($user1);
         }
         catch (Exception $e) {
              return $e->message();
          }

     }

    }


public function ApplyForShow(Request $request){

  $data['user_id'] = Auth::id();
  $data['business_name'] = $request->business_name;
  $data['business_site'] = $request->business_site;
  $data['s_description'] = $request->s_description;
  $data['y_turnover'] = $request->y_turnover;
  $data['firstN'] = $request->firstN;
  $data['lastN'] = $request->lastN;
  $data['legal_name'] = $request->legal_name;
  $data['home_address'] = $request->home_address;
  $data['st_address'] = $request->st_address;
  $data['city'] = $request->city;
  $data['state'] = $request->state;
  $data['zip'] = $request->zip;
  $data['country'] = $request->country;
  $data['B_address'] = $request->B_address;
  $data['B_st_address'] = $request->B_st_address;
  $data['B_city'] = $request->B_city;
  $data['B_state'] = $request->B_state;
  $data['B_zip'] = $request->B_zip;
  $data['B_country'] = $request->B_country;
  $data['B_phone'] = $request->B_phone;
  $data['p_phone'] = $request->p_phone;
  $data['a_phone'] = $request->a_phone;
  $data['email'] = $request->email;
  $data['facebook'] = $request->facebook;
  $data['twitter'] = $request->twitter;
  $data['e_firstN'] = $request->e_firstN;
  $data['e_lastN'] = $request->e_lastN;
  $data['relation'] = $request->relation;
  $data['e_phone'] = $request->e_phone;
  $data['how_u_heard'] = $request->how_u_heard;
  $data['business_details'] = $request->business_details;
  $data['business_idea'] = $request->business_idea;
  $data['how_long'] = $request->how_long;
  $data['business_partners'] = $request->business_partners;
  $data['employees'] = $request->employees;
  $data['how_m_invested'] = $request->how_m_invested;

  $data['challenge'] = $request->challenge;
  $data['business_improved'] = $request->business_improved;
  $data['business_suffering'] = $request->business_suffering;
  $data['business_profitable'] = $request->business_profitable;
  $data['short_term_goals'] = $request->short_term_goals;
  $data['long_term_goals'] = $request->long_term_goals;
  
  //Images

  try{

    if (!file_exists('files/applyShow/'.$data['user_id'])) 
          mkdir('files/applyShow/'.$data['user_id'], 0777, true);
          $loc='files/applyShow/'.$data['user_id'].'/';
    
    if(isset($request->image1) && $request->image1 != null){
          $image1 = $request->image1;
          $uniqid=hexdec(uniqid());
          $ext=strtolower($image1->getClientOriginalExtension());
          $create_name=$uniqid.'.'.$ext;    
          //Move uploaded file
          $image1->move($loc, $create_name);
          $data['image1']=$loc.$create_name;
          }

    if(isset($request->image2) && $request->image2 != null){
          $image2 = $request->image2;
          $uniqid=hexdec(uniqid());
          $ext=strtolower($image2->getClientOriginalExtension());
          $create_name=$uniqid.'.'.$ext;    
          //Move uploaded file
          $image2->move($loc, $create_name);
          $data['image2']=$loc.$create_name;
          }

          if(isset($request->image3) && $request->image3 != null){
          $image3 = $request->image3;
          $uniqid=hexdec(uniqid());
          $ext=strtolower($image3->getClientOriginalExtension());
          $create_name=$uniqid.'.'.$ext;    
          //Move uploaded file
          $image3->move($loc, $create_name);
          $data['image3']=$loc.$create_name;
          }

          if(isset($request->image4) && $request->image4 != null){
          $image4 = $request->image4;
          $uniqid=hexdec(uniqid());
          $ext=strtolower($image4->getClientOriginalExtension());
          $create_name=$uniqid.'.'.$ext;    
          //Move uploaded file
          $image4->move($loc, $create_name);
          $data['image4']=$loc.$create_name;
          }

      //Images

$create = ApplyShow::create($data);
Session::put('success','Applied for show success!');
}
catch(\Exception $e){
  Session::put('failed',$e->getMessage());
}
return redirect()->back();
}




}


