<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\Services;
use App\Models\Shop;
use App\Models\Equipments;
use App\Models\Smilestones;
use App\Models\serviceDocs;
use App\Models\User;
use DateTime;
use Session; 
use Hash;
use Auth;
use Mail;
use DB;
use Exception;
use Response;

class ServiceController extends Controller
{

 public function __construct()
    {
        $this->middleware('business');
    }

public function auth_id(){
  $auth_email = Session::get('service_email');
  $auth= User::where('email',$auth_email)->first();
  return $auth->id;
}

public function logoutS(){
  Session::forget('service_login');
  return redirect('home');
}


public function services(){
$listings = Services::where('shop_id',Auth::id())->latest()->get();
return view('services.listings',compact('listings'));
}

public function add_listing(){
//$events = Events::latest()->get();
return view('services.add-listing');

}

public function home(){
$services = Services::where('shop_id',Auth::id())->get();
return view('services.index',compact('services'));
}

public function listings(){
$listings = Services::where('shop_id',Auth::id())->latest()->get();
return view('services.listings',compact('listings'));
}


public function save_listing(Request $request){
$title = $request->title;
$category = $request->category;
$details = $request->details;
$price = $request->price;
$location = $request->location;

$pin = $request->pin;
$identification = $request->identification;
$document = $request->document;
$video = $request->video;
$user_id = Auth::id();

$listing = Services::latest()->first();
$listing = ($listing->id)+1;

//FILES 
 $image=$request->file('image');
 if($image) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($image->getClientOriginalExtension());
          if($ext!='jpg' && $ext!= 'png' && $ext!='jpeg' && $ext!= 'svg'&& $ext!='gif')
          {
            Session::put('error','For Cover, Only images are allowed!');
            return redirect()->back();
          }
          $create_name=$uniqid.'.'.$ext;
          $loc='images/services/';
          //Move uploaded file
          $image->move($loc, $create_name);
          $final_img=$loc.$create_name;
             }
          else $final_img='';


  $pin=$request->file('pin');
 if($pin) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($pin->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('error','For pin, Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/services/'.$listing)) 
          mkdir('files/services/'.$listing, 0777, true);

          $loc='files/services/'.$listing.'/';
          //Move uploaded file
          $pin->move($loc, $create_name);
          $final_pin=$loc.$create_name;
             }else $final_pin='';


 $identification=$request->file('identification');
 if($identification) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($identification->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('error','For identification, Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/services/'.$listing)) 
          mkdir('files/services/'.$listing, 0777, true);

          $loc='files/services/'.$listing.'/';
          //Move uploaded file
          $identification->move($loc, $create_name);
          $final_identification=$loc.$create_name;
             }else $final_identification='';


 $document=$request->file('document');
 if($document) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($document->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('error','For service document, Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/services/'.$listing)) 
          mkdir('files/services/'.$listing, 0777, true);

          $loc='files/services/'.$listing.'/';
          //Move uploaded file
          $document->move($loc, $create_name);
          $final_document=$loc.$create_name;
             }else $final_document='';
             


 $video=$request->file('video');
 if($video) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($video->getClientOriginalExtension());
          if($ext!='mpg' && $ext!= 'mpeg' && $ext!='webm' && $ext!= 'mp4' 
            && $ext!='avi' && $ext!= 'wmv')
          { 
            Session::put('error','For video, Only mpg || mpeg || webm || mp4 
            avi || wmv are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/services/'.$listing)) 
          mkdir('files/services/'.$listing, 0777, true);

          $loc='files/services/'.$listing.'/';
          //Move uploaded file
          $video->move($loc, $create_name);
          $final_video=$loc.$create_name;
             }else $final_video=$request->link;                     

          

//FILES         

Services::create([
            'name' => $title,
            'shop_id' => $user_id,
            'price' => $price,
            'category' => $category,
            'details' => $details,
            'location' => $location,
            'image' => $final_img,
            'pin' => $final_pin,
            'identification' => $final_identification,
            'document' => $final_document,
            'video' => $final_video           
           ]);       

        Session::put('success','Service added!');
        return redirect()->back();

}

public function up_listing(Request $request){
$user_id = Auth::id();
$id = $request->id;

$listing = $request->id;
$data = $request->except(['_token','link']);
$current = Services::where('id',$id)->first();

$old_cover = $current->image;
$old_pin = $current->pin;
$old_identification = $current->identification;
$old_video = $current->video;
$old_document = $current->document;

 //FILES
 $image=$request->file('image');
 if($image) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($image->getClientOriginalExtension());
          if($ext!='jpg' && $ext!= 'png' && $ext!='jpeg' && $ext!= 'svg'&& $ext!='gif')
          {
            Session::put('error','For Cover, Only images are allowed!');
            return redirect()->back();
          }
          $create_name=$uniqid.'.'.$ext;
          $loc='images/services/';
          //Move uploaded file
          $image->move($loc, $create_name);
          $final_img=$loc.$create_name;
          $data['image'] = $final_img;
          if($old_cover!=null) unlink($old_cover);
             }

 $pin=$request->file('pin');
 if($pin) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($pin->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('error','For pin, Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/services/'.$listing)) 
          mkdir('files/services/'.$listing, 0777, true);

          $loc='files/services/'.$listing.'/';
          //Move uploaded file
          $pin->move($loc, $create_name);
          $final_pin=$loc.$create_name;
          $data['pin'] = $final_pin;
          if($old_pin!=null) unlink($old_pin);
             }


 $identification=$request->file('identification');
 if($identification) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($identification->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('error','For identification, Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/services/'.$listing)) 
          mkdir('files/services/'.$listing, 0777, true);

          $loc='files/services/'.$listing.'/';
          //Move uploaded file
          $identification->move($loc, $create_name);
          $final_identification=$loc.$create_name;
          $data['identification'] = $final_identification;
          if($old_identification!=null) unlink($old_identification);
             }


 $document=$request->file('document');
 if($document) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($document->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('error','For services document, Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/services/'.$listing)) 
          mkdir('files/services/'.$listing, 0777, true);

          $loc='files/services/'.$listing.'/';
          //Move uploaded file
          $document->move($loc, $create_name);
          $final_document=$loc.$create_name;
          $data['document'] = $final_document;
          if($old_document!=null) unlink($old_document);
             }
             


 $video=$request->file('video');
 if($video) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($video->getClientOriginalExtension());
          if($ext!='mpg' && $ext!= 'mpeg' && $ext!='webm' && $ext!= 'mp4' 
            && $ext!='avi' && $ext!= 'wmv')
          { 
            Session::put('error','For video, Only mpg || mpeg || webm || mp4 
            avi || wmv are allowed!');
             
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/services/'.$listing)) 
          mkdir('files/services/'.$listing, 0777, true);

          $loc='files/services/'.$listing.'/';
          //Move uploaded file
          $video->move($loc, $create_name);
          $final_video=$loc.$create_name;
          $data['video'] = $final_video;
          if($old_video!=null) unlink($old_video);
             }                     

          

//FILES
if(isset($request->link)) $data['video'] = $request->link;
Services::where('id',$id)->update($data);   

        Session::put('success','Service Updated!');
        return redirect()->back();

}


public function delete_service($id){
$milestone = Services::where('id',$id)->first();

if($milestone->document!= null && file_exists($milestone->document)) 
  unlink($milestone->document);

if($milestone->image!= null && file_exists($milestone->image)) 
  unlink($milestone->image);

if($milestone->pin!= null && file_exists($milestone->pin)) unlink($milestone->pin);

if($milestone->identification  != null && file_exists($milestone->identification)) 
  unlink($milestone->identification);
if($milestone->video!= null && file_exists($milestone->video)) 
  unlink($milestone->video);

$milestones = Services::where('id',$id)->delete();
return redirect()->back();
}


public function add_eqp(Request $request){
$listing_id = $request->id;
$eq_name = $request->eq_name;
$value = $request->value;
$amount = $request->amount;
$details = $request->details;
$user_id = Auth::id();

Equipments::create([
            'eq_name' => $eq_name,
            'value' => $value,
            'amount' => $amount,
            'details' => $details,
            'listing_id' => $listing_id  
           ]);       
        Session::put('success','Equipment added!');
        return redirect()->back();
}

public function add_docs(Request $request){
//$name = $request->name;
$listing = $request->listing;
$user_id = Auth::id();

          $files=$request->file('files'); //print_r($files);
 
          foreach ($files as $single_img) { 
            # code...
          $uniqid=hexdec(uniqid());
          $ext=strtolower($single_img->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('file_error','Only pdf & docx are allowed!');
            return redirect('services');
          }

          $create_name=$uniqid.'.'.$ext;

          if (!file_exists('files/services/'.$user_id)) 
          mkdir('files/services/'.$user_id, 0777, true);

          $loc='files/services/'.$user_id.'/';
          //Move uploaded file
          $single_img->move($loc, $create_name);
          $final_file=$loc.$create_name;
           
           serviceDocs::create([
            'user_id' => $user_id,
            'service_id' => $listing,
            'file' => $final_file         
           ]);

             } 

        Session::put('success','Documents added!');
        return redirect('services');

}


public function add_video(Request $request){
//$name = $request->name;
$listing = $request->listing;
$user_id = Auth::id();


          $single_img=$request->file('files'); //print_r($files);
 
          $uniqid=hexdec(uniqid());
          $ext=strtolower($single_img->getClientOriginalExtension());
          if($ext!='mpg' && $ext!= 'mpeg' && $ext!='webm' && $ext!= 'mp4' 
            && $ext!='avi' && $ext!= 'wmv')
          {
            Session::put('file_error','Only mpg || mpeg || webm || mp4 
            avi || wmv are allowed!');
            return redirect('services');
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/services/'.$user_id)) 
          mkdir('files/services/'.$user_id, 0777, true);

          $loc='files/services/'.$user_id.'/';
          //Move uploaded file
          $single_img->move($loc, $create_name);
          $final_file=$loc.$create_name;
           
           serviceDocs::create([
            'user_id' => $user_id,
            'service_id' => $listing,
            'file' => $final_file,
            'media' => 1
          
           ]);

        Session::put('success','Media added!');
        return redirect('services');

}


public function embed_service_videos(Request $request){
$link = $request->link;
$listing = $request->listing;
$user_id = Auth::id();

           serviceDocs::create([
            'user_id' => $user_id,
            'service_id' => $listing,
            'file' => $link,
            'media' => 1        
           ]);

        Session::put('success','Media Embedded!');
        return redirect('services');

}


//MILESTONES
public function delete_milestone($id){
$milestones = Smilestones::where('id',$id)->delete();
return redirect()->back();
}

public function add_milestones(){
$milestones = Smilestones::where('user_id',Auth::id())->latest()->get();
$business = Services::where('shop_id',Auth::id())->get();
return view('services.add_milestones',compact('business','milestones'));
}

public function getMilestones($id){ 
 $milestones = Smilestones::where('listing_id',$id)->get(); $c=0;$d=0;$test='';

try{
  foreach($milestones as $mile){
  if($mile->status == 'In Progress') $c++;
  if($mile->status != 'Done') $d++; 

  //SETTING Time Diffrence
$time_due_date = date( "Y-m-d H:i:s", strtotime($mile->created_at.' +'.$mile->n_o_days.' days 0 hours 0 minutes'));
$start_date = new DateTime(date("Y-m-d H:i:s"));
$since_start = $start_date->diff(new DateTime($time_due_date));

$time_left = $since_start->d.' days, '.$since_start->h.' hours, '. $since_start->i.' minutes';
$mile->time_left = $time_left;

$time_now = date("Y-m-d H:i:s");
if($time_now > $time_due_date)
  $mile->time_left = 'L A T E !';

} 

 if($c==0 && $d!=0){
  
  $milestones[0]->status = 'In Progress';
}

if($d == 0 && count($milestones)!=0)
{
  $done_msg = 'Milestone completed! Order placed!';
}
else $done_msg = null;

}
catch(\Exception $e){
  return response()->json([ 'data' => $e->getMessage() ]);
}

return response()->json([ 'data' => $milestones, 'done_msg' => $done_msg ]);

 }

 public function download_milestone_doc($id, $mile_id){
    
    $doc = Smilestones::where('id',$mile_id)->first();
    $file=$doc->document;
    $headers = array('Content-Type'=> 'application/pdf');
    return Response::download($file, 'milestone.pdf', $headers);
    return response()->json(['data'=>'success']);

    }



public function milestones($id){
if($id == 'all'){
  $listing = Services::where('shop_id', Auth::id())->latest()->first();
  if($listing != null){
  $milestones = Smilestones::where('listing_id', $listing->id)->get();
 }
  else $milestones = [];
  $business_name = 'Select Service';//$listing->name;
}
else{
  $milestones = Smilestones::where('listing_id', $id)->get();
  $listing = Services::where('id', $id)->first();
  $business_name = $listing->name;
}

$business = Services::where('shop_id',Auth::id())->get();
return view('services.milestones',compact('milestones','business', 'business_name'));
}



public function save_milestone(Request $request){
$title = $request->title;
$business_id = $request->business_id;
$amount = $request->amount;
$user_id = Auth::id();
$status = 'Created';

$time_type = $request->time_type;
$n_o_days = $request->n_o_days;
if($time_type == 'Weeks')
$n_o_days = 7*$n_o_days;
if($time_type == 'Months')
$n_o_days = 30*$n_o_days;

$mile = Smilestones::where('listing_id',$business_id)->where('status','Created')->first();

if(isset($mile->status) &&  $mile->status ==  'Created')
$status = 'On Hold';

try{
 $single_img=$request->file('file');
 
          $uniqid=hexdec(uniqid());
          $ext=strtolower($single_img->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('file_error','Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;

          if (!file_exists('files/Smilestones/'.$business_id)) 
          mkdir('files/Smilestones/'.$business_id, 0777, true);

          $loc='files/Smilestones/'.$business_id.'/';
          //Move uploaded file
          $single_img->move($loc, $create_name);
          $final_file=$loc.$create_name;
           

Smilestones::create([
            'user_id' => $user_id,
            'title' => $title,
            'listing_id' => $business_id,
            'amount' => $amount,
            'document' => $final_file,
            'n_o_days' => $n_o_days,
            'status' => $status           
           ]);       
}
catch(\Exception $e){
  Session::put('failed', $e->getMessage()); ;
}
        Session::put('success','Milestone added!');
        return redirect()->back();

}


public function mile_status(Request $request){
$milestones = Smilestones::where('id',$request->id)
->update([
'status' => $request->status
]);
return redirect()->back();
}


public function up_milestone(Request $request){
$title = $request->title;
$contact = $request->contact;
$category = $request->category;
$details = $request->details;
$location = $request->location;
$investment_needed = $request->investment_needed;
$share = $request->share;
//$contact_mail = $request->contact_mail;
$user_id = Auth::id();
$id = $request->id;

 $image=$request->file('image');
 if($image) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($image->getClientOriginalExtension());
          $create_name=$uniqid.'.'.$ext;
          $loc='images/listing/';
          //Move uploaded file
          $image->move($loc, $create_name);
          $final_img=$loc.$create_name;
          Smilestones::where('id',$id)->update(['image' => $final_img ]); 
             }

Smilestones::where('id',$id)->update([
            'name' => $title,
            'contact' => $contact,
            'category' => $category,
            'details' => $details,
            'location' => $location,
            'investment_needed' => $investment_needed,
            'share' => $share     
           ]);       

        Session::put('success','Business Updated!');
        return redirect()->back();

}

//END MILESTONES


//CLASS

}
