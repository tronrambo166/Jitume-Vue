<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function checkAuth() {
         return response()->json([
            'user' => Auth::user()
            //'auth' => Auth::check()
        ]);
    }
    
    public function login(LoginRequest $request)
    {   
        //if(Auth::check()) return 'yes'; else return 'no';
        $data = $request->validated();
        if(!Auth::attempt($data)){
            return response([
                'message' => 'email or password are wrong',
                'auth' => Auth::check()
            ]);
        }
        $user = Auth::user(); 
        $token = $user->createToken('main')->plainTextToken; 

        return response()->json([
            'user' => $user,
            'token' => $token,
            'auth' => Auth::check()
        ]);

    }

    public function register(RegisterRequest $request)
    {   
        //INVESTOR ACCOUNT
        if(isset($request->investor) && $request->investor == 1)
        {
        $data = $request->all();
        $investor = 1; 
        $user = User::where('email',$data['email'])->first();
            if($user!=''){ 
            return response()->json([ 'status' => 400, 'message' => 'Only pdf & docx are allowed!']);
             } 

         $inv_range = $data['inv_range'];
         $interested_cats = $data['interested_cats'];  
         $past_investment = $data['past_investment'];
         $website = $data['website'];
         $id_no = $data['id_no'];
         $tax_pin = $data['tax_pin']; 

         //File Type Check!
        $passport=$data['id_passport'];
        if($passport) {
          $ext=strtolower($passport->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            return response()->json([ 'status' => 400, 'message' => 'Only pdf & docx are allowed!']);
          } }


        if(isset($data['pin'])){
        $pin=$data['pin'];
          $ext=strtolower($pin->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            return response()->json([ 'status' => 400, 'message' => 'Only pdf & docx are allowed!']);
          } }

            //File Type Check END!

            $user = User::create([
            'fname' => $data['fname'],
            'mname' => $data['mname'],
            'lname' => $data['lname'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'investor' => $investor,
            'id_no' => $id_no,
            'tax_pin' => $tax_pin,
            'inv_range' =>  json_encode($inv_range),
            'interested_cats' =>  json_encode($interested_cats), 
            'past_investment' => $past_investment,
            'website' => $website         
           ]);   

            //Upload
            $inv_id = $user->id;

             try {
             if (!file_exists('files/investor/'.$inv_id)) 
                      mkdir('files/investor/'.$inv_id, 0777, true);
                      $loc='files/investor/'.$inv_id.'/';
             if(isset($pin) && $pin !=null) {
                      $uniqid=hexdec(uniqid());
                      $ext=strtolower($pin->getClientOriginalExtension());
                      $create_name=$uniqid.'.'.$ext;    
                      //Move uploaded file
                      $pin->move($loc, $create_name);
                      $final_pin=$loc.$create_name;
                         } else $final_pin=null;

            if($passport) {
                      $uniqid=hexdec(uniqid());
                      $ext=strtolower($passport->getClientOriginalExtension());
                      $create_name=$uniqid.'.'.$ext;
                      $passport->move($loc, $create_name);
                      $final_passport=$loc.$create_name;
                         }else $final_passport=''; 

                         User::where('id',$inv_id)->update([
                        'pin' => $final_pin,
                        'id_passport' => $final_passport              
                       ]);  
                       $token = $user->createToken('main')->plainTextToken;
                        return response()->json([
                            'user' => $user,
                            'token' => $token,
                            'auth' => Auth::check()
                        ]); 

                        } catch (\Exception $e) {
                           return response()->json([ 'status' => 400, 'message' => $e->getMessage() ]);
                              
                        }
            }           

        //INVESTOR ACCOUNT ENDS


        $mname = $request->mname;
        $gender = $request->gender;
        $dob = $request->dob;

        $data = $request->validated();
        $user = User::create([

            'fname' => $data['fname'],
            'mname' => $mname,
            'lname' => $data['lname'],
            'email' => $data['email'],
            'gender' => $mname,
            'dob' => $dob,
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'auth' => Auth::check()
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response('',204);
    }
}