<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\admins;
use Session;
use Auth;
use Exception;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    	//if(Auth::check()) return 'yes'; else return 'no';
        $user = User::orderBy('id','desc')->get();
        $user = json_decode($user, true);
        return $user;//  
        //response()->json(['user' => $user]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //$data = $request->validated();
        $data['name'] = $request->name;
        $data['email'] = $request->email;
        $data['password'] = $request->password;
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);
        return $user;
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $data['name'] = $request->name;
        $data['email'] = $request->email;
        if($request->password != null){
        $data['password'] = $request->password;
        if(isset($data['password'])){
            $data['password'] = bcrypt($data['password']);
        }
    	}

        try{ 
        	//$request->except('_token');
        	$update = User::where('id', $request->id)->update($data); 
        	return 'success';
    	}
        catch(Exception $e){
        	return $e->getMessage();
        }
  
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        User::where('id',$id)->delete();

        return response('',204);
    }

    //ADMIN
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


 public function logout()
    {  
        Session::forget('admin');
     //$request->session()->invalidate();
     //$request->session()->regenerateToken();
        return redirect('admin/login'); 
    }

    public function adminLogout(Request $request)
{
    Auth::guard('admin')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('admin/login');
}

    //** Login attempt and Custom Authentication
}