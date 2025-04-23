<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Models\Listing;
use App\Models\ServiceMileStatus;
use App\Models\Smilestones;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Mail;

class AuthController extends Controller
{
    public function checkAuth() {
         $user = User::select('email','id', 'fname', 'lname', 'gender','image','investor')
         ->where('id', Auth::id())->first();
         return response()->json([
            'user' => $user
        ]);
    }

    public function fetchUser($id) {
         if($id == 0) return false;
         $user1 = array();
         $user = User::select('email','id', 'fname', 'lname', 'gender','image')
         ->where('id', $id)->get();
         $user[0]->from_id = Auth::id();
         $user[0]->to_id = $user[0]->id;
         $user[0]->sender = $user[0]->fname.' '.$user[0]->lname;
         $user[0]->messages = [];
         $user[0]->service_id = 0;
         $user1 = json_decode($user[0], true);;
         return response()->json([
            'user' => $user1, 'status' => 200
        ]);
    }

    public function partiesInfo($listing_id) {
         $listing = listing::select('user_id')->where('id', $listing_id)->first();
         $owner = User::select('email')
         ->where('id', $listing->user_id)->first();
         return response()->json([
            'user' => Auth::user(),
            'owner' => $owner
            //'auth' => Auth::check()
        ]);
    }

    public function PartiesServiceMile($rep_mile_id)
    {
        $mileid = ServiceMileStatus::select('mile_id')->where('id',$rep_mile_id)->first()->mile_id;

        $mile = Smilestones::select('id','user_id')->where('id',$mileid)->first();

        $owner = User::select('paystack_acc_id')
         ->where('id', $mile->user_id)->first();
         $owner->true_mile_id = $mile->id;
        return response()->json([
            'user' => Auth::user(),
            'owner' => $owner
            //'auth' => Auth::check()
        ]);
    }

    public function emailExists($email) {
        $user = User::where('email', $email)->first();
        if($user)
         return response()->json(['status' => 400, 'message' => 'Email already exists!']);
        else
            return response()->json(['status' => 200]);
    }

    public function emailVerify($email,$code) {
        try{

                $info=['email'=>$email, 'code'=>$code];
                $user['to'] = $email;
                $subject = "Email Verification";
                $headers = "From: webmaster@Jitume.com";

                Mail::send('verify_mail', $info, function($msg) use ($user){
                        $msg->to($user['to']);
                        $msg->subject('Email Verification');
                    });



         return response()->json([ 'status' => 200, 'message' => 'Success!']);
            }
        catch(\Exception $e){
            return response()->json([ 'status' => 404, 'message' => $e->getMessage() ]);
            }
    }


    public function login(LoginRequest $request)
    {
        //if(Auth::check()) return 'yes'; else return 'no';
        if(!$request->browserLoginCheck)
        return response([
                'error' => '401! Unauthorized.',
            ]);

        $data = $request->validated();
        if(!Auth::attempt($data)){
            return response([
                'message' => 'Email or Password is wrong',
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

          $size=($passport->getSize())/1048576; // Get MB
          if($size == 2 || $size > 2)
          {
            return response()->json([ 'status' => 400, 'message' => 'Document size must be less than 2MB!']);
          }

          if($ext!='pdf' && $ext!= 'docx')
          {
            return response()->json([ 'status' => 400, 'message' => 'Only pdf & docx are allowed!']);
          }
        }


        if(isset($data['pin'])){
        $pin=$data['pin'];
          $ext=strtolower($pin->getClientOriginalExtension());

          $size=($pin->getSize())/1048576; // Get MB
          if($size == 2 || $size > 2)
          {
            return response()->json([ 'status' => 400, 'message' => 'Document size must be less than 2MB!']);
          }

          if($ext!='pdf' && $ext!= 'docx')
          {
            return response()->json([ 'status' => 400, 'message' => 'Only pdf & docx are allowed!']);
          }
        }

            //File Type Check END!

            if(isset($request->switch) && $request->switch == 1)
            {
                $user = User::select('id')->where('email',$data['email'])->first();

                $update = User::where('email',$data['email'])
                ->update([
                'investor' => $investor,
                'id_no' => $id_no,
                'tax_pin' => $tax_pin,
                'inv_range' =>  json_encode($inv_range),
                'interested_cats' =>  json_encode($interested_cats),
                'past_investment' => $past_investment,
                'website' => $website
                ]);

            }
            else
            {
                $userCheck = User::where('email',$data['email'])->first();
                if($userCheck){
                    return response()->json([ 'status' => 400, 'message' => 'Email already exists!']);
                 }

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
            }



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
            if(isset($request->investor) && $request->investor == 2)
            {
                $data = $request->all();
                $register = $this->grantRegister($data);
                return $register;
            }

            if(isset($request->investor) && $request->investor == 3)
            {
                $data = $request->all();
                $register = $this->invCapitalRegister($data);
                return $register;
            }


        //Regular User Register
        $mname = $request->mname;
        $gender = $request->gender;
        $dob = $request->dob;

        $data = $request->validated();
        $user = User::create([

            'fname' => $data['fname'],
            'mname' => $mname,
            'lname' => $data['lname'],
            'email' => $data['email'],
            'gender' => $gender,
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


    public function reset($email, $password)
    {

        try{
            $checkUser = User::where('email', $email)
            ->first();
            if(!$checkUser)
            return response()->json([ 'status' => 400, 'message' => 'User do not exist!']);

            $password= bcrypt($password);
            $update= User::where('email', $email)
            -> limit(1)->update(['password'=> $password]);

            if($update)
            return response()->json([ 'status' => 200, 'message' => 'Reset Success!']);
        }
        catch(\Exception $e){
            return response()->json([ 'status' => 404, 'message' => $e->getMessage() ]);
            }

    }


    // REGISTER SUB FUNCTIONS...

    public function grantRegister($data)
    {
         $investor = 2;
         $interested_cats = $data['interested_cats'];
         $website = $data['website'];

         //File Type Check!
        $passport=$data['document'];
        if($passport) {
          $ext=strtolower($passport->getClientOriginalExtension());

          $size=($passport->getSize())/1048576; // Get MB
          if($size == 3 || $size > 3)
          {
            return response()->json([ 'status' => 400, 'message' => 'Document size must be less than 2MB!']);
          }

          if($ext!='pdf' && $ext!= 'docx')
          {
            return response()->json([ 'status' => 400, 'message' => 'Only pdf & docx are allowed!']);
          }
        }

            //File Type Check END!

                $userCheck = User::where('email',$data['email'])->first();
                if($userCheck){
                    return response()->json([ 'status' => 400, 'message' => 'Email already exists!']);
                 }

                $user = User::create([
                'fname' => $data['fname'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'investor' => $investor,
                'interested_cats' =>  json_encode($interested_cats),
                'org_type' => $data['org_type'],
                'phone' => $data['phone'],
                'mission' => $data['mission'],
                'regions' => $data['regions'],
                'website' => $website
                ]);




            //Upload
            $inv_id = $user->id;

            try {
            if (!file_exists('files/investor/'.$inv_id))
                      mkdir('files/investor/'.$inv_id, 0777, true);
                      $loc='files/investor/'.$inv_id.'/';

            if($passport) {
                      $uniqid=hexdec(uniqid());
                      $ext=strtolower($passport->getClientOriginalExtension());
                      $create_name=$uniqid.'.'.$ext;
                      $passport->move($loc, $create_name);
                      $final_passport=$loc.$create_name;
            }else $final_passport='';

                         User::where('id',$inv_id)->update([
                        'id_passport' => $final_passport
                       ]);
                       $token = $user->createToken('main')->plainTextToken;
                        return response()->json([
                            'user' => $user,
                            'token' => $token,
                            'auth' => true
                        ]);

                        } catch (\Exception $e) {
                           return response()->json([ 'status' => 400, 'message' => $e->getMessage() ]);

                        }
    }


    public function invCapitalRegister($data)
    {
         $investor = 3;
         $interested_cats = $data['interested_cats'];
         $website = $data['website'];

         //File Type Check!
        $passport=$data['document'];
        if($passport) {
          $ext=strtolower($passport->getClientOriginalExtension());

          $size=($passport->getSize())/1048576; // Get MB
          if($size == 3 || $size > 3)
          {
            return response()->json([ 'status' => 400, 'message' => 'Document size must be less than 2MB!']);
          }

          if($ext!='pdf' && $ext!= 'docx')
          {
            return response()->json([ 'status' => 400, 'message' => 'Only pdf & docx are allowed!']);
          }
        }

            //File Type Check END!

                $userCheck = User::where('email',$data['email'])->first();
                if($userCheck){
                    return response()->json([ 'status' => 400, 'message' => 'Email already exists!']);
                 }

                $user = User::create([
                'fname' => $data['fname'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'investor' => $investor,
                'interested_cats' =>  json_encode($interested_cats),
                'org_type' => $data['org_type'],
                'phone' => $data['phone'],
                'startup_stage' => $data['startup_stage'],
                'inv_range' => $data['inv_range'],
                'eng_prefer' => $data['eng_prefer'],
                'regions' => $data['regions'],
                'website' => $website
                ]);




            //Upload
            $inv_id = $user->id;

            try {
            if (!file_exists('files/investor/'.$inv_id))
                      mkdir('files/investor/'.$inv_id, 0777, true);
                      $loc='files/investor/'.$inv_id.'/';

            if($passport) {
                      $uniqid=hexdec(uniqid());
                      $ext=strtolower($passport->getClientOriginalExtension());
                      $create_name=$uniqid.'.'.$ext;
                      $passport->move($loc, $create_name);
                      $final_passport=$loc.$create_name;
            }else $final_passport='';

                         User::where('id',$inv_id)->update([
                        'id_passport' => $final_passport
                       ]);
                       $token = $user->createToken('main')->plainTextToken;
                        return response()->json([
                            'user' => $user,
                            'token' => $token,
                            'auth' => true
                        ]);

                        } catch (\Exception $e) {
                           return response()->json([ 'status' => 400, 'message' => $e->getMessage() ]);

                        }
    }



}
