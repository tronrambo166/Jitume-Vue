<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\homeController;
use App\Http\Controllers\testController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


//ADMIN ROUTES

Route::prefix('/admin')->name('admin.')->namespace('Admin')
->group(function(){
  //All the admin routes will be defined here...
//});
Route::get('admin', 'AdminController@dashboard');
Route::get('admin/login', 'AdminController@login')->name('login');
//Route::get('admin/profile', 'AdminController@profile')->name('profile');
Route::get('admin/dashboard', 'AdminController@dashboard')->name('dashboard');
Route::get('admin/editprofile', 'AdminController@editprofile')->name('editprofile');
Route::get('admin/add-product', 'AdminController@addproduct')->name('addproduct');

Route::get('admin/manage-product', 'AdminController@manpro')->name('manpro');
Route::get('admin/edit-product/{id}', 'AdminController@editpro');//->name('editpro');
Route::post('admin/uppro/{id}', 'AdminController@uppro')->name('uppro');
Route::post('admin/save-product', 'AdminController@saveproduct')->name('saveproduct');

Route::post('/delcats', 'AdminController@delcats');//->name('delcat');
Route::get('/delpro/{id}', 'AdminController@delpro');//->name('delpro');
Route::get('/productStatus/{id}/{status}', 'AdminController@productStatus');////->name('changeStatus');

//POST Methods/Form submit (Add, Edit, Update,Delete(GET))
Route::post('admin/login', 'AdminController@adminLogin')->name('admin/login');
Route::post('admin/logout', 'AdminController@adminLogout')->name('admin/logout');

});


//MAIN/BACKEND/VUE
Route::get('/', 'PagesController@home')->name('/'); 
Route::get('/home', 'PagesController@home')->name('home');

//Route::group(['middleware'=>['auth']], function(){ 

Route::get('/create-listing', 'PagesController@create_event')->name('create-listing'); 
Route::get('/create-service','PagesController@create_service')->name('create-service');
Route::post('/create-service','PagesController@save_service')->name('create-service-post');

Route::get('/profile', 'PagesController@profile')->name('profile');
Route::post('/up_profile', 'PagesController@up_profile')->name('up_profile');

//});

Route::get('/get_suggest/{search}', 'PagesController@getAddress')->name('get_suggest');
Route::post('search', 'PagesController@search')->name('search');
Route::get('searchResults/{ids}', 'PagesController@searchResults')->name('searchResults');
Route::get('priceFilter/{min}/{max}/{ids}', 'PagesController@priceFilter')->name('priceFilter');

Route::post('searchService', 'PagesController@searchService')->name('searchService');
Route::get('ServiceResults/{ids}', 'PagesController@ServiceResults')->name('ServiceResults'); 
Route::get('categoryResults/{catName}', 'PagesController@categoryResults')->name('categoryResults');

Route::get('equipments/{id}', 'PagesController@equipments')->name('equipments');
Route::get('invest/{listing_id}/{id}/{value}/{amount}/{type}', 'PagesController@invest')->name('equipments');
Route::get('addToCart/{id}-{qty}', 'PagesController@addToCart')->name('addToCart');
Route::get('removeCart/{id}', 'PagesController@removeCart')->name('removeCart');
Route::get('cart', 'PagesController@cart')->name('cart');
Route::get('download_business/{id}', 'PagesController@download_business')->name('download_business');

// <--milestones-->
Route::get('getMilestones/{id}', 'BusinessController@getMilestones')->name('getMilestones');
Route::get('getMilestonesS/{id}', 'ServiceController@getMilestones')->name('getMilestonesS');
//Route::get('milestoneCommits/{amount}/{business_id}/{percent}', 'BusinessController@milestoneCommits')->name('milestoneCommits');
Route::get('milestoneCommitsEQP/{ids}', 'BusinessController@milestoneCommitsEQP')->name('milestoneCommitsEQP');


Route::get('download_milestoneDoc/{id}/{mile_id}', 'BusinessController@download_milestone_doc')->name('download_milestoneDoc');
Route::get('download_milestoneDocS/{id}/{mile_id}', 'ServiceController@download_milestone_doc')->name('download_milestoneDocS');
// <--milestones-->
Route::get('latBusiness', 'PagesController@latBusiness')->name('latBusiness');

//MAIN/BACKEND/VUE

//EXTRA ROUTES
Route::get('{/anypath}', 'PagesController@home')->where('path', '.*');
//Route::get('admin/{anypath}', 'AdminController@dashboard')->where('path', '.*');
Route::get('profile/{id}', 'PagesController@profile');
Route::post('profile/edit/{id}', 'PagesController@updateProfile');
//EXTRA ROUTES


// LARAVEL ROUTES
Auth::routes();

//--Dashboard --  Business ROUTES
Route::post('loginB', 'PagesController@loginB')->name('loginB');
//Route::get('logoutB', 'BusinessController@logoutB')->name('logoutB'); 
Route::post('registerB', 'PagesController@registerB')->name('registerB'); 
Route::post('registerI', 'PagesController@registerI')->name('registerI');
Route::get('business', 'BusinessController@business')->name('business');

Route::prefix('/business')->group(function(){
Route::get('add-listing', 'BusinessController@add_listing')->name('add-listing');
Route::post('create-listing', 'BusinessController@save_listing')->name('create-listing');
Route::get('index', 'BusinessController@home')->name('business');
Route::get('listings', 'BusinessController@listings')->name('listings');
Route::post('add_eqp', 'BusinessController@add_eqp')->name('add_eqp');
Route::post('up_listing', 'BusinessController@up_listing')->name('up_listing');
Route::get('delete_listing/{id}', 'BusinessController@delete_listing')->name('delete_listing');
Route::get('business_bids', 'BusinessController@business_bids')->name('business_bids');
// --- MILESTONE
Route::get('add_milestones', 'BusinessController@add_milestones')->name('add_milestones');

Route::get('milestones-{id}', 'BusinessController@milestones')->name('milestones');
Route::post('save_milestone', 'BusinessController@save_milestone')->name('save_milestone');
Route::post('up_milestones', 'BusinessController@up_milestone')->name('up_milestones');
Route::get('delete_milestone/{id}', 'BusinessController@delete_milestone')->name('delete_milestone');
Route::get('applyForShow', 'BusinessController@applyForShow')->name('applyForShow');
Route::post('mile_status', 'BusinessController@mile_status')->name('mile_status');
// --- MILESTONE
Route::post('add_doc', 'BusinessController@add_docs')->name('add_doc');
Route::post('add_video', 'BusinessController@add_video')->name('add_video');
Route::post('embed_business_video', 'BusinessController@embed_business_video')->name('embed_business_video');


//Dashboard -- Service
Route::get('services', 'ServiceController@services')->name('services');
Route::get('add-services', 'ServiceController@add_listing')->name('add-services');
Route::post('create-service', 'ServiceController@save_listing')->name('create-service');
// --- MILESTONE
Route::get('add_s_milestones', 'ServiceController@add_milestones')->name('add_s_milestones');
Route::get('s_milestones-{id}', 'ServiceController@milestones')->name('s_milestones');
Route::post('save_s_milestone', 'ServiceController@save_milestone')->name('save_s_milestone');
Route::post('up_milestones', 'ServiceController@up_milestone')->name('up_s_milestones');
Route::get('delete_s_milestone/{id}', 'ServiceController@delete_milestone')->name('delete_milestone');
Route::post('mile_s_status', 'ServiceController@mile_status')->name('mile_s_status');
// --- MILESTONE
Route::get('/', 'BusinessController@home')->name('services/index');
Route::get('services', 'ServiceController@listings')->name('services');
//Route::post('add_eqp', 'ServiceController@add_eqp')->name('add_eqp');
Route::post('up_service', 'ServiceController@up_listing')->name('up_service');
Route::get('delete_service/{id}', 'ServiceController@delete_service')->name('delete_service');

Route::post('add_doc', 'ServiceController@add_docs')->name('add_docs');
Route::post('add_video', 'ServiceController@add_video')->name('add_videos');
Route::post('embed_service_videos', 'ServiceController@embed_service_videos')->name('embed_service_videos');

});


//-- Investor ROUTES
Route::post('loginI', 'PagesController@loginI')->name('loginI');
//Route::get('logoutS', 'ServiceController@logoutS')->name('logoutS'); 
Route::post('registerI', 'PagesController@registerI')->name('registerI'); 


//Route::prefix('/services')->group(function(){});



Route::get('forgot/{remail}', 'testController@forgot')->name('forgot');
Route::post('send_reset_email', 'testController@send_reset_email')->name('send_reset_email');
Route::post('reset/{remail}', 'testController@reset')->name('reset');

Route::get('/clear', function() {
   \Artisan::call('config:cache');
    \Artisan::call('view:clear');
    \Artisan::call('route:clear');
    \Artisan::call('cache:clear');
    dd("Cache is cleared");
});

Auth::routes();

// <!-- Payment Routes -->

Route::get('/stripe', 'checkoutController@goCheckout')->name('stripe');
//Invest
Route::post('/stripe', 'checkoutController@stripePost')->name('stripe.post');
//Subscribe
Route::post('/stripe', 'checkoutController@stripeConversation')->name('stripe.post.coversation');

//CART
Route::get('cartStripe', 'checkoutController@cartCheckout')->name('cartStripe');
Route::post('cartstripe', 'checkoutController@cartStripePost')->name('cartstripe.post');

Route::get('milestoneStripe', 'checkoutController@milestoneCheckout')->name('milestoneStripe');
Route::post('milestonestripe', 'checkoutController@milestoneStripePost')->name('milestonestripe.post');

Route::get('milestoneService', 'checkoutController@milestoneCheckoutS')->name('milestoneService');
Route::post('milestoneService', 'checkoutController@milestoneStripePostS')->name('milestoneService.post');
Route::get('milestoneInvestEQP/{listing_id}/{mile_id}/{investor_id}/{owner_id}', 'checkoutController@milestoneInvestEQP')->name('milestoneInvestEQP');
// Payment Routes


//<!-- BIDS -->
Route::post('bidsAccepted', 'bidsEmailController@bidsAccepted')->name('bidsAccepted');

Route::get('bidCommits/{amount}/{business_id}/{percent}', 'checkoutController@bidCommitsForm')->name('bidCommits');
Route::post('bidCommits', 'checkoutController@bidCommits')->name('bidCommits');
//<!-- BIDS -->


//SOCIAL
Route::get('social_login',function (){return view('social_types');})->name('social_login');

Route::get('/google', function (){
return Socialite::driver('google')->redirect(); })->name('login.google');
Route::get('google/callback','socialController@google');
 
Route::get('/facebook', function () {
return Socialite::driver('facebook')->redirect(); })->name('login.facebook');
Route::get('facebook/callback', 'socialController@facebook');

Route::get('skip', 'PagesController@skip')->name('skip');

//TERMS
Route::get('terms', function (){return view('terms');} )->name('terms');
Route::get('privacy-policy', function (){return view('privacy-policy');} )->name('privacy-policy');

Route::post('ApplyForShow', 'socialController@ApplyForShow')->name('ApplyForShow');

