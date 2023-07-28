<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\Services;
use App\Models\Shop;
use App\Models\Equipments;
use App\Models\User;
use App\Models\businessDocs;
use App\Models\Milestones;
use App\Models\Conversation;
use App\Models\BusinessBids;

use Response;
use Session; 
use Hash;
use Auth;
use Mail;
use DB;
use DateTime;

class BusinessController extends Controller
{

  public function test(){
    return response()->json(['data' => 'OKAY']);
  }

//private $auth_id;
   public function __construct()
    { 
        $this->middleware('business');   
    }

public function auth_id(){
  $auth_email = Session::get('business_email');
  $auth= User::where('email',$auth_email)->first();
  return $auth->id;
}

public function logoutB(){
  Session::forget('service_login');
  return redirect('home');
}


public function business(){
$business = listing::where('user_id',Auth::id())->get();
$services = Services::where('shop_id',Auth::id())->get();
return view('business.index',compact('business','services'));
}

public function add_listing(){
//$events = Events::latest()->get();
return view('business.add-listing');

}

public function applyForShow(){
return view('business.applyForShow');
}

public function home(){
if(Session::has('c_to_action') && Session::get('c_to_action') == true){
  Session::forget('c_to_action');
  return redirect('business/add-listing');
}

else if(Session::has('c_to_actionS') && Session::get('c_to_actionS') == true){
  Session::forget('c_to_actionS');
  return redirect('business/add-services');
}
else if(Session::has('c_to_action_Service') && Session::get('c_to_action_Service') == true){
  Session::forget('c_to_action_Service');
  return redirect('/');
}

$investor ='';
$business = listing::where('user_id',Auth::id())->get();
$services = Services::where('shop_id',Auth::id())->get();
$investor_ck = User::where('id',Auth::id())->first();

if($investor_ck == null){
if(Session::has('investor_email')){   
$mail = Session::get('investor_email');
$investor_ck = User::where('email',$mail)->first();
if ($investor_ck->investor == 1) $investor = true;
else $investor = false;

} }
else{
if ($investor_ck->investor == 1) $investor = true;
else $investor = false;
} 

//Investments
$results = []; $t_share = 0;
if ($investor_ck->investor == 1) {
$convs = Conversation::where('investor_id',Auth::id())->get();
foreach($convs as $conv){ 
  $miles = Milestones::where('investor_id',Auth::id())
  ->where('listing_id',$conv->listing_id)->get();
  foreach($miles as $share)
    $t_share = $t_share+$share->share;

  $my_listing =listing::where('id',$conv->listing_id)->first();
  $my_listing->myShare = $t_share;
  $results[] = $my_listing;
}
//echo '<pre>'; print_r($results); echo '<pre>';exit;
}
//Investments
return view('business.index',compact('business','investor','results','services'));
}


public function listings(){
$listings = Listing::where('user_id',Auth::id())->latest()->get();
return view('business.listings',compact('listings'));
}


public function save_listing(Request $request){
$title = $request->title;
$contact = $request->contact;
$category = $request->category;
$details = $request->details;
$location = $request->location;
$investment_needed = $request->investment_needed;
$share = $request->share;
$contact_mail = $request->contact_mail;
$reason = $request->reason;
$y_turnover = $request->y_turnover;
$investors_fee = $request->investors_fee;
$id_no = $request->id_no;
$tax_pin = $request->tax_pin;

$yeary_fin_statement = $request->yeary_fin_statement;
$pin = $request->pin;
$identification = $request->identification;
$document = $request->document;
$video = $request->video;
$user_id = Auth::id();

$listing = Listing::latest()->first();
$listing = ($listing->id)+1;

try{
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
          $loc='images/listing/';
          //Move uploaded file
          $image->move($loc, $create_name);
          $final_img=$loc.$create_name;
             }
          else $final_img='';

 $yeary_fin_statement=$request->file('yeary_fin_statement');
 if($yeary_fin_statement) {
          $uniqid=hexdec(uniqid());
          $ext=strtolower($yeary_fin_statement->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('error','For Yearly Statement, Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/business/'.$listing)) 
          mkdir('files/business/'.$listing, 0777, true);

          $loc='files/business/'.$listing.'/';
          //Move uploaded file
          $yeary_fin_statement->move($loc, $create_name);
          $final_statement=$loc.$create_name;
             }else $final_statement='';


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
          if (!file_exists('files/business/'.$listing)) 
          mkdir('files/business/'.$listing, 0777, true);

          $loc='files/business/'.$listing.'/';
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
          if (!file_exists('files/business/'.$listing)) 
          mkdir('files/business/'.$listing, 0777, true);

          $loc='files/business/'.$listing.'/';
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
            Session::put('error','For business document, Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/business/'.$listing)) 
          mkdir('files/business/'.$listing, 0777, true);

          $loc='files/business/'.$listing.'/';
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
          if (!file_exists('files/business/'.$listing)) 
          mkdir('files/business/'.$listing, 0777, true);

          $loc='files/business/'.$listing.'/';
          //Move uploaded file
          $video->move($loc, $create_name);
          $final_video=$loc.$create_name;
             }else $final_video=$request->link;                     

          

//FILES

Listing::create([
            'name' => $title,
            'user_id' => $user_id,
            'contact' => $contact,
            'contact_mail' => $contact_mail,
            'category' => $category,
            'details' => $details,
            'location' => $location,
            'investment_needed' => $investment_needed,
            'share' => $share,
            'image' => $final_img,
            'reason' => $reason,
            'y_turnover' => $y_turnover,
            'pin' => $final_pin,
            'y_turnover' => $y_turnover,
            'id_no' => $id_no,
            'tax_pin' => $tax_pin,
            'document' => $final_document,
            'video' => $final_video,
            'yeary_fin_statement' => $final_statement,
            'investors_fee' => $investors_fee

            
           ]);       

        Session::put('success','Business added!');
        return redirect()->back();
}
catch (\Exception $e) {

    Session::put('loginFailed',$e->getMessage());
    return redirect()->back(); 
}
}

public function up_listing(Request $request){
$user_id = Auth::id();
$id = $request->id;
$listing = $request->id;
$data = $request->except(['_token','link']);
$current = Listing::where('id',$id)->first();

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
          $loc='images/listing/';
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
          if (!file_exists('files/business/'.$listing)) 
          mkdir('files/business/'.$listing, 0777, true);

          $loc='files/business/'.$listing.'/';
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
          if (!file_exists('files/business/'.$listing)) 
          mkdir('files/business/'.$listing, 0777, true);

          $loc='files/business/'.$listing.'/';
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
            Session::put('error','For business document, Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/business/'.$listing)) 
          mkdir('files/business/'.$listing, 0777, true);

          $loc='files/business/'.$listing.'/';
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
          if (!file_exists('files/business/'.$listing)) 
          mkdir('files/business/'.$listing, 0777, true);

          $loc='files/business/'.$listing.'/';
          //Move uploaded file
          $video->move($loc, $create_name);
          $final_video=$loc.$create_name;
          $data['video'] = $final_video;
          if($old_video!=null) unlink($old_video);
             }                     

          

//FILES
if(isset($request->link)) $data['video'] = $request->link;
Listing::where('id',$id)->update($data);       
Session::put('success_update','Business Updated!');
return redirect()->back();

}


public function delete_listing($id){

$milestone = Listing::where('id',$id)->first();

if($milestone->document!= null && file_exists($milestone->document)) 
  unlink($milestone->document);  
  
if($milestone->image!= null && file_exists($milestone->image)) 
  unlink($milestone->image);

if($milestone->pin!= null && file_exists($milestone->pin)) unlink($milestone->pin);

if($milestone->identification  != null && file_exists($milestone->identification)) 
  unlink($milestone->identification);
if($milestone->video!= null && file_exists($milestone->video)) 
  unlink($milestone->video);

$milestones = Listing::where('id',$id)->delete();
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


//MILESTONES
public function delete_milestone($id){
$milestones = Milestones::where('id',$id)->delete();
return redirect()->back();
}

public function add_milestones(){
$milestones = Milestones::where('user_id',Auth::id())->latest()->get();
$business = listing::where('user_id',Auth::id())->get();
return view('business.add_milestones',compact('business','milestones'));
}

public function getMilestones($id){
    if(Auth::check())
        $investor_id = Auth::id();
    else {
        if(Session::has('investor_email')){   
        $mail = Session::get('investor_email');
        $investor = User::where('email',$mail)->first();
        $investor_id = $investor->id;
      }
      else $investor_id = null;
    }

 $milestones = Milestones::where('listing_id',$id)->get(); 
 $done = 0; $c=0;$d=0; $progress=0;$share=0;

 if($milestones->count() !=0 ){
  foreach($milestones as $mile){
  if($mile->investor_id == $investor_id)
    $mile->access = true;
  //Status Determine
  //if($mile->status == 'In Progress') $c++;if($mile->status != 'Done') $d++;
  //Status Determine

if($mile->status == 'Done') $done++;

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

$total_mile = count($milestones);
$progress = ($done/$total_mile)*100;
$list = Listing::where('id',$id)->first();
$share = ($list->share)/100;

}

 //if($c==0 && $d!=0){ $milestones[0]->status = 'In Progress';}
return response()->json([ 'data' => $milestones, 'progress' => $progress,
'share' => $share ]);

 }

 public function download_milestone_doc($id, $mile_id){
    
    $doc = Milestones::where('id',$mile_id)->first();
    $file=$doc->document;
    $headers = array('Content-Type'=> 'application/pdf');
    return Response::download($file, 'milestone.pdf', $headers);
    return response()->json(['data'=>'success']);
 

    }



public function milestones($id){
if($id == 'all'){
  $listing = listing::where('user_id', Auth::id())->latest()->first();
  if($listing !=null){
  $milestones = Milestones::where('listing_id', $listing->id)->get();
 }
  else $milestones = [];
  $business_name = 'Select Business';//$listing->name;
}
else{
  $milestones = Milestones::where('listing_id', $id)->get();
  $listing = listing::where('id', $id)->first();
  $business_name = $listing->name;
}

$business = listing::where('user_id',Auth::id())->get();
return view('business.milestones',compact('milestones','business', 'business_name'));
}



public function save_milestone(Request $request){
$title = $request->title;
$business_id = $request->business_id;
$amount = $request->amount;
$user_id = Auth::id();
$status = 'To Do';

$time_type = $request->time_type;
$n_o_days = $request->n_o_days;
if($time_type == 'Weeks')
$n_o_days = 7*$n_o_days;
if($time_type == 'Months')
$n_o_days = 30*$n_o_days;

//$mile = Milestones::where('listing_id',$business_id)->latest()->first();
//if($mile  &&  ($mile->status ==  'Created' || $mile->status ==  'In Progress'))
//$status = 'On Hold';if($mile  && $mile->status ==  'Done') $status = 'In Progress';

$this_listing = Listing::where('id',$business_id)->first();
$inv_need = $this_listing->investment_needed;
$share = round(( round($amount)/round($inv_need) )*$this_listing->share, 2);

$mile_shares = Milestones::where('listing_id',$business_id)->get();
$total_share_amount = 0;
foreach($mile_shares as $single){
$total_share_amount = $total_share_amount+$single->amount;
}
$total_share_amount = $total_share_amount+$amount;
if($total_share_amount>$inv_need){
Session::put('failed','The amount exceeds the total investment needed!');
        return redirect()->back();
}

 $single_img=$request->file('file');
 
          $uniqid=hexdec(uniqid());
          $ext=strtolower($single_img->getClientOriginalExtension());
          if($ext!='pdf' && $ext!= 'docx')
          {
            Session::put('file_error','Only pdf & docx are allowed!');
            return redirect()->back();
          }

          $create_name=$uniqid.'.'.$ext;

          if (!file_exists('files/milestones/'.$business_id)) 
          mkdir('files/milestones/'.$business_id, 0777, true);

          $loc='files/milestones/'.$business_id.'/';
          //Move uploaded file
          $single_img->move($loc, $create_name);
          $final_file=$loc.$create_name;
           

Milestones::create([
            'user_id' => $user_id,
            'title' => $title,
            'listing_id' => $business_id,
            'amount' => $amount,
            'document' => $final_file,
      			'n_o_days' => $n_o_days,
            'status' => $status,
            'share'  => $share           
           ]);       

        Session::put('success','Milestone added!');
        return redirect()->back();

}


public function mile_status(Request $request){
$thisMile = Milestones::where('id',$request->id)->first();

$milestones = Milestones::where('id',$request->id)
->update([
'status' => $request->status
]);
$next_mile = Milestones::where('listing_id',$thisMile->listing_id)
->where('status','To Do')->first();

if($next_mile && $next_mile->id > $request->id)
Milestones::where('id',$next_mile->id)->update(['status' => 'In Progress' ]);

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
          Milestones::where('id',$id)->update(['image' => $final_img ]); 
             }

Milestones::where('id',$id)->update([
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

public function milestoneCommits($amount,$business_id,$percent){
  try{

   if(Auth::check())
        $investor_id = Auth::id();
    else {
        if(Session::has('investor_email')){   
        $mail = Session::get('investor_email');
        $investor = User::where('email',$mail)->first();
        $investor_id = $investor->id;
      }
    }

    $type = 'Monetery';
    $bids = BusinessBids::create([
      'date' => date('Y-m-d'),
      'investor_id' => $investor_id,
      'business_id' => $business_id,
      'type' => $type,
      'amount' => $amount,
      'representation' => $percent
    ]);

if($bids)
  return response()->json(['success' => 'Success!']);
}

catch(\Exception $e){
  return response()->json(['failed' =>  $e->getMessage()]);
}

}


public function milestoneCommitsEQP($ids){
  if(Auth::check())
        $investor_id = Auth::id();
    else {
        if(Session::has('investor_email')){   
        $mail = Session::get('investor_email');
        $investor = User::where('email',$mail)->first();
        $investor_id = $investor->id;
      }
    }

$i = 1;
$commited = explode(',',$ids);
    //Check in progress
    $mile = Milestones::where('id',$commited[0])->first();
    $check = Milestones::where('listing_id',$mile->listing_id)
    ->where('status','In Progress')->first();
    //Check in progress

foreach($commited as $commit_id){
  if ($commit_id != '') {
    if($i == 1 && !$check)
    $milestones = Milestones::where('id',$commit_id)
    ->update(['investor_id' => $investor_id, 'with_equip' => 1, 'status' => 'In Progress']);
    else
    $milestones = Milestones::where('id',$commit_id)
    ->update(['investor_id' => $investor_id, 'with_equip' => 1]);
    $i++;
  }
}

return response()->json(['success' => 'committed']);
}

//END MILESTONES

public function business_bids(){
$res = BusinessBids::get();
$bids = array();
try{
foreach($res as $r){
  $inv = User::where('id',$r->investor_id)->first();
  $r->investor = $inv->fname.' '.$inv->lname;
  $business = listing::where('id',$r->business_id)->first();
  $r->business = $business->name;

  $bids[] = $r;
}
return view('business.bids',compact('bids'));
}
 catch(\Exception $e){
  Session::put('failed',$e->getMessage());
  return redirect()->back();
 }
}


public function add_docs(Request $request){
//$name = $request->name;
  //return $request->all();
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
            return redirect('business');
          }

          $create_name=$uniqid.'.'.$ext;

          if (!file_exists('files/business/'.$listing)) 
          mkdir('files/business/'.$listing, 0777, true);

          $loc='files/business/'.$listing.'/';
          //Move uploaded file
          $single_img->move($loc, $create_name);
          $final_file=$loc.$create_name;
           
           businessDocs::create([
            'user_id' => $user_id,
            'business_id' => $listing,
            'file' => $final_file         
           ]);

             } 

        Session::put('success','Documents added!');
        return redirect('business');

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
            return redirect('business');
          }

          $create_name=$uniqid.'.'.$ext;
          if (!file_exists('files/business/'.$user_id)) 
          mkdir('files/business/'.$user_id, 0777, true);

          $loc='files/business/'.$user_id.'/';
          //Move uploaded file
          $single_img->move($loc, $create_name);
          $final_file=$loc.$create_name;
           
           businessDocs::create([
            'user_id' => $user_id,
            'business_id' => $listing,
            'file' => $final_file,
            'media' => 1
          
           ]);

        Session::put('success','Media added!');
        return redirect('business');

}


public function embed_business_video(Request $request){
$link = $request->link;
$listing = $request->listing;
$user_id = Auth::id();

           businessDocs::create([
            'user_id' => $user_id,
            'business_id' => $listing,
            'file' => $link,
            'media' => 1        
           ]);

        Session::put('success','Media Embedded!');
        return redirect('business');

}


//Class Bracket
}
