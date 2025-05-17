<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\checkoutController;
use App\Http\Controllers\bidsEmailController;
use App\Http\Controllers\socialController;
use App\Http\Controllers\PayStackController;
use App\Http\Controllers\MpesaController;
use App\Http\Controllers\GrantController;
use App\Http\Controllers\InvCapitalController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\AnalyticsController;

// PayStack/LIPA  ROUTES
Route::get('/log-test', function () {
    Log::info('Test log message');
    return 'Log written';
});
Route::get('/lipr-authorize', [MpesaController::class,'auth']);
Route::get('/wallets', [MpesaController::class,'wallets']);
Route::get('/create-wallet', [MpesaController::class,'create_wallet']);
Route::post('/lipr-callback', [MpesaController::class,'callback']);

//P R O T E C T E D    R O U T E S
Route::middleware('auth:sanctum')->group(function() {
    Route::get('logout',[AuthController::class,'logout']);
    Route::post('serviceBook', [ServiceController::class, 'serviceBook'])->name('serviceBook');
    Route::get('rebook_service/{id}', [ServiceController::class, 'rebook_service'])->name('rebook_service');
    Route::post('serviceMsg', [ServiceController::class, 'serviceMsg'])->name('serviceMsg');
    Route::post('serviceReply', [ServiceController::class, 'serviceReply'])->name('serviceReply');

    Route::get('equipments/{id}', [PagesController::class, 'equipments'])->name('equipment');
    Route::get('invest/{listing_id}/{id}/{value}/{amount}/{type}', [PagesController::class, 'invest'])->name('equipments');
    Route::get('download_business/{id}', [PagesController::class, 'download_business'])->name('download_business');
    Route::get('download_statement/{id}', [PagesController::class, 'download_statement'])->name('download_statement');
    Route::get('searchResults/{ids}', [PagesController::class,'searchResults'])->name('searchResults');

    // --- MIDDLEWARE
    //Route::group(['middleware'=>['auth']], function(){
    // <--milestones-->

    Route::get('download_milestoneDoc/{id}/{mile_id}', [BusinessController::class, 'download_milestone_doc'])->name('download_milestoneDoc');
    Route::get('download_milestoneDocS/{id}/{mile_id}', [ServiceController::class, 'download_milestone_doc'])->name('download_milestoneDocS');
    Route::get('download_bids_doc/{id}', [BusinessController::class, 'download_bids_doc'])->name('download_bids_doc');
    // <--milestones-->
    Route::get('ratingListing/{id}/{rating}/{text}', [BusinessController::class, 'ratingListing'])->name('ratingListing');
    Route::get('ratingService/{id}/{rating}/{text}', [ServiceController::class, 'ratingService'])->name('ratingService');
    Route::get('unlockBySubs/{id}/{sub_id}/{plan}', [BusinessController::class, 'unlockBySubs'])->name('unlockBySubs');

    //B I D S
    Route::post('bidCommitsEQP', [bidsEmailController::class, 'bidCommitsEQP'])->name('bidCommitsEQP');
    Route::get('bidCommits/{amount}/{business_id}/{percent}', [checkoutController::class, 'bidCommitsForm'])->name('bidCommits');
    Route::post('bidCommits', [checkoutController::class, 'bidCommits'])->name('bidCommits');
    Route::post('bidCommitsAwaiting', [checkoutController::class, 'bidCommitsAwaiting']);


    Route::post('bookingAccepted', [bidsEmailController::class, 'bookingAccepted'])->name('bookingAccepted');
    Route::post('bookingRejected', [bidsEmailController::class, 'bookingRejected'])->name('bookingRejected');

    Route::get('FindProjectManagers/{bid_id}', [BusinessController::class, 'FindProjectManagers'])->name('FindProjectManagers');
    Route::get('releaseEquipment/{b_owner_id}/{manager_id}/{bid_id}', [bidsEmailController::class, 'releaseEquipment'])->name('releaseEquipment');
    Route::post('raise-dispute', [BusinessController::class, 'raiseDispute']);

    //});

    // P A Y M E N T  R O U T E S
    Route::get('/stripe/{amount}/{business_id}', [checkoutController::class, 'goCheckout'])->name('stripe');
    Route::post('/stripe', [checkoutController::class, 'stripePost'])->name('stripe.post');
    //Unlock small fee
    Route::post('/stripe.post.coversation', [checkoutController::class, 'stripeConversation'])->name('stripe.post.coversation');

    // L I P R
    Route::get('/lipr-status-bids/{reference_id}/{listing_id}/{amountReal}', [MpesaController::class,'status_bids']);
    Route::get('/lipr-status-service/{reference_id}/{listing_id}/{amountReal}', [MpesaController::class,'status_service']);
    Route::get('/lipr-status-smallFee/{reference_id}/{listing_id}/{amountReal}', [MpesaController::class,'status_smallFee']);
    Route::post('/initiate_payment', [MpesaController::class,'initiate_payment']);

    Route::post('/initialize', [PayStackController::class, 'initialize']);
    Route::get('/create-subaccount', [PayStackController::class, 'create_subaccount']);
    Route::get('/paystackVerify/{business_id}/{percent}/{amountKFront}/{amountReal}/{ref}', [PayStackController::class, 'verify']);

    Route::get('/paystackVerifySmallFee/{package}/{business_id}/{amountKFront}/{amountReal}/{ref}', [PayStackController::class, 'verifySmallFee']);

    Route::get('/paystackVerifyService/{true_mile_id}/{rep_id}/{amountKFront}/{amountReal}/{ref}', [PayStackController::class, 'verifyService']);

    Route::get('/partiesInfo/{listing_id}', [AuthController::class,'partiesInfo']);
    Route::get('/partiesServiceMile/{rep_mile_id}', [AuthController::class,'PartiesServiceMile']);

    //Subscribe***
    Route::get('isSubscribed/{id}', [BusinessController::class, 'isSubscribed'])->name('isSubscribed');

    Route::get('/stripeSubscribe/{amount}/{plan}/{days}/{range}/{inv}', [checkoutController::class, 'stripeSubscribeGet'])->name('stripeSubscribe');
    Route::get('/stripeSubscribeSuccess', [checkoutController::class, 'stripeSubscribeSuccess'])->name('stripeSubscribeSuccess');

    Route::get('milestoneStripe', [checkoutController::class, 'milestoneCheckout'])->name('milestoneStripe');
    Route::post('milestonestripe', [checkoutController::class, 'milestoneStripePost'])->name('milestonestripe.post');

    Route::get('milestoneService/{milestone_id}/{amount}', [checkoutController::class, 'milestoneCheckoutS'])->name('milestoneService');
    Route::post('milestoneService', [checkoutController::class, 'milestoneStripePostS'])->name('milestoneService.post');
    // Route::get('milestoneInvestEQP/{listing_id}/{mile_id}/{investor_id}/{owner_id}', [checkoutController::class, 'milestoneInvestEQP'])->name('milestoneInvestEQP');


    Route::post('bidsAccepted', [bidsEmailController::class, 'bidsAccepted'])->name('bidsAccepted');

    // Payment Routes
    //Stripe-Connect
    Route::get('/connect/{id}', [checkoutController::class, 'connect'])->name('connect.stripe');
    Route::get('/saveStripe/{token}', [checkoutController::class, 'saveStripe'])->name('return.stripe');
    Route::get('/checkAuth', [AuthController::class,'checkAuth']);


// B U S I N E S S    P R O T E C T E D
Route::prefix('/business')->group(function(){

Route::post('update-profile', [PagesController::class, 'update_profile'])->name('update-profile');

Route::get('bBQhdsfE_WWe4Q-_f7ieh7Hdhf2E_', [BusinessController::class, 'add_listing'])->name('add-listing');
Route::post('create-listing', [BusinessController::class, 'save_listing'])->name('create-listing');
Route::get('/bBQhdsfE_WWe4Q-_f7ieh7Hdhf1E_', [BusinessController::class, 'home'])->name('business');
Route::get('bBQhdsfE_WWe4Q-_f7ieh7Hdhf3E_', [BusinessController::class, 'listings'])->name('listings');
Route::post('add_eqp', [BusinessController::class, 'add_eqp'])->name('add_eqp');
Route::post('up_listing', [BusinessController::class, 'up_listing'])->name('up_listing');
Route::get('delete_listing/{id}', [BusinessController::class, 'delete_listing'])->name('delete_listing');
Route::get('business_bids', [BusinessController::class, 'business_bids'])->name('business_bids');
Route::get('confirmed_bids', [BusinessController::class, 'confirmed_bids'])->name('confirmed_bids');
Route::get('bBQhdsfE_WWe4Q-_f7ieh7Hdhf5E_', [BusinessController::class, 'my_bids'])->name('my_bids');
Route::get('remove_bids/{id}', [BusinessController::class, 'remove_bids'])->name('remove_bids');
Route::get('remove_active_bids/{id}', [BusinessController::class, 'remove_active_bids'])->name('remove_active_bids');

Route::get('askInvestorToVerify/{bid_id}', [BusinessController::class, 'askInvestorToVerify']);
Route::get('requestOwnerToVerify/{bid_id}', [BusinessController::class, 'requestOwnerToVerify']);
Route::get('markAsVerified/{bid_id}', [BusinessController::class, 'markAsVerified']);
Route::get('assetEquip/download/{id}/{type}', [BusinessController::class, 'assetEquip_download'])->name('assetEquip/download');
Route::get('account', [BusinessController::class, 'account'])->name('account');

// --- MILESTONE
Route::get('add_milestones', [BusinessController::class, 'add_milestones'])->name('add_milestones');

Route::get('activate_milestone/{id}', [BusinessController::class, 'activate_milestone'])->name('activate_milestone');
Route::get('bBQhdsfE_WWe4Q-_f7ieh7Hdhf7E_-{id}', [BusinessController::class, 'milestones'])->name('milestones');
Route::post('save_milestone', [BusinessController::class, 'save_milestone'])->name('save_milestone');

Route::get('delete_milestone/{id}', [BusinessController::class, 'delete_milestone'])->name('delete_milestone');
Route::get('bBQhdsfE_WWe4Q-_f7ieh7Hdhf_E_', [BusinessController::class, 'applyForShow'])->name('applyForShow');
Route::post('mile_status', [BusinessController::class, 'mile_status'])->name('mile_status');
// --- MILESTONE
Route::post('add_doc', [BusinessController::class, 'add_docs'])->name('add_doc');
Route::post('add_video', [BusinessController::class, 'add_video'])->name('add_video');
Route::post('embed_business_video', [BusinessController::class, 'embed_business_video'])->name('embed_business_video');

Route::get('/notifications', [BusinessController::class, 'notifications']);
Route::get('/notifSetRead', [BusinessController::class, 'notifSetRead']);

//Dashboard -- Service ROUTES
Route::get('bBQhdsfE_WWe4Q-_f7ieh7Hdhf8F_', [ServiceController::class, 'services'])->name('services');
Route::get('bBQhdsfE_WWe4Q-_f7ieh7Hdhf2F_', [ServiceController::class, 'add_listing'])->name('add-services');
Route::post('create-service', [ServiceController::class, 'save_listing'])->name('create-service');
// --- MILESTONE
Route::get('add_s_milestones', [ServiceController::class, 'add_milestones'])->name('add_s_milestones');
Route::get('bBQhdsfE_WWe4Q-_f7ieh7Hdhf4F_-{id}', [ServiceController::class, 'milestones'])->name('s_milestones');
Route::get('findMilestones/{s_id}/{booker_id}', [ServiceController::class, 'findMilestones'])->name('findMilestones');

Route::post('save_s_milestone', [ServiceController::class, 'save_milestone'])->name('save_s_milestone');
Route::post('up_milestones', [ServiceController::class, 'up_milestone'])->name('up_s_milestones');
Route::get('delete_s_milestone/{id}', [ServiceController::class, 'delete_milestone'])->name('delete_s_milestone');
Route::post('mile_s_status', [ServiceController::class, 'mile_status'])->name('mile_s_status');
// --- MILESTONE
Route::get('service_booking', [ServiceController::class, 'service_booking'])->name('service_booking');
Route::get('my_booking', [ServiceController::class, 'my_booking'])->name('my_booking');
Route::get('bBQhdsfE_WWe4Q-_f7ieh7Hdhf6F__', [ServiceController::class, 'booker_milestones'])->name('booker-milestones');
Route::get('getBookers/{s_id}', [ServiceController::class, 'getBookers'])->name('getBookers');
Route::get('service_messages/{from}', [ServiceController::class, 'service_messages'])->name('service-messages');
Route::get('service_messages_count/{from}', [ServiceController::class, 'service_messages_count']);


Route::get('/dashhome/{query}', [BusinessController::class, 'home']);
Route::get('bBQhdsfE_WWe4Q-_f7ieh7Hdhf8F_', [ServiceController::class, 'listings'])->name('services');
//Route::post('add_eqp', [ServiceController::class, 'add_eqp'])->name('add_eqp');
Route::post('up_service', [ServiceController::class, 'up_listing'])->name('up_service');
Route::get('delete_service/{id}', [ServiceController::class, 'delete_service'])->name('delete_service');

Route::post('add_doc', [ServiceController::class, 'add_docs'])->name('add_docs');
Route::post('add_video', [ServiceController::class, 'add_video'])->name('add_videos');
Route::post('embed_service_videos', [ServiceController::class, 'embed_service_videos'])->name('embed_service_videos');

Route::get('/getCurrSubscription', [checkoutController::class, 'getCurrSubscription'])->name('getCurrSubscription');
Route::get('cancelSubscription/{id}', [checkoutController::class, 'cancelSubscription'])->name('cancelSubscription');
Route::get('fetchUser/{id}', [AuthController::class, 'fetchUser']);
Route::get('bidInfo/{id}', [bidsEmailController::class, 'bid_info']);
Route::get('withdraw_investment/{id}', [bidsEmailController::class, 'withdraw_investment']);

});

// B U S I N E S S    P R O T E C T E D   ENDS


// G R A N T S    P R O T E C T E D

Route::prefix('/grant')->group(function(){
   //Grant
   Route::post('create-grant', [GrantController::class, 'store']);
   Route::post('grant-application',[GrantController::class,'store_application']);
   Route::get('grants', [GrantController::class, 'index']);
   Route::get('pitches/{grant_id}', [GrantController::class, 'pitches']);
   Route::get('my_pitches', [GrantController::class, 'mypitches']);
   Route::post('update-grant', [GrantController::class, 'update']);
   Route::get('visibility/{grant_id}', [GrantController::class, 'visibility']);
   Route::get('delete-grant/{id}', [GrantController::class, 'destroy']);
   Route::get('accept/{pitch_id}', [GrantController::class, 'accept']);
   Route::get('reject/{pitch_id}', [GrantController::class, 'reject']);
   Route::get('fund-release-request/{pitch_id}', [GrantController::class, 'fund_request']);
   Route::post('grant-milestone', [GrantController::class, 'release_milestone']);
   Route::post('match-score/{grant_id}', [MatchController::class, 'score']);
   Route::get('analytics', [AnalyticsController::class, 'index']);


});

Route::prefix('/capital')->group(function(){
   //Capital
   Route::post('create-capital-offer', [InvCapitalController::class, 'store']);
   Route::post('investment-application',[InvCapitalController::class,'store_application']);
   Route::get('capital-offers', [InvCapitalController::class, 'index']);
   Route::get('pitches/{capital_id}', [InvCapitalController::class, 'pitches']);
   Route::get('my_pitches', [InvCapitalController::class, 'mypitches']);
   Route::post('update-capital', [InvCapitalController::class, 'update']);
   Route::get('visibility/{capital_id}', [InvCapitalController::class, 'visibility']);
   Route::get('delete-capital/{id}', [InvCapitalController::class, 'destroy']);
   Route::get('accept/{pitch_id}', [InvCapitalController::class, 'accept']);
   Route::get('reject/{pitch_id}', [InvCapitalController::class, 'reject']);
   Route::get('fund-release-request/{pitch_id}', [InvCapitalController::class, 'fund_request']);
   Route::get('analytics', [AnalyticsController::class, 'index_capital']);
});

// G R A N T S    P R O T E C T E D   ENDS

Route::get('serviceResultsAuth/{ids}', [PagesController::class, 'serviceResultsAuth']);
Route::get('getMilestonesS_Auth/{id}', [ServiceController::class, 'getMilestones'])->name('getMilestonesS');

Route::get('getMilestonesAuth/{id}', [BusinessController::class ,'getMilestones'])->name('getMilestones');
Route::get('checkDispute/{id}/{type}', [BusinessController::class ,'checkDispute']);
Route::post('submitReport', [PagesController::class, 'submitReport']);
});
//P R O T E C T E D    R O U T E S   ENDS

Route::get('JitumeSubscribeEmail/{email}', [PagesController::class, 'JitumeSubscribeEmail']);
 Route::get('CancelAssetBid/{id}/{action}',[bidsEmailController::class,'CancelAssetBid']);
 Route::get('CancelEquipmentRelease/{id}/{action}',[bidsEmailController::class,'CancelEquipmentRelease']);
Route::get('CancelBookingConfirm/{id}/{action}',[bidsEmailController::class,'CancelBookingConfirm']);




//Email Click Routes
Route::get('emailVerify/{email}/{code}',[AuthController::class,'emailVerify']);
Route::get('agreeToMileS/{s_id}/{booker_id}', [bidsEmailController::class, 'agreeToMileS'])->name('agreeToMileS');
Route::get('agreeToProgressWithMilestone/{bidId}', [bidsEmailController::class, 'agreeToProgressWithMilestone']);
Route::get('agreeToNextmile/{bidId}', [bidsEmailController::class, 'agreeToNextmile'])->name('agreeToNextmile');
Route::get('emailExists/{email}',[AuthController::class,'emailExists']);



Route::get('latBusiness', [PagesController::class,'latBusiness'])->name('latBusiness');
Route::get('latServices', [PagesController::class, 'latServices'])->name('latServices');
Route::get('searchResults/{ids}', [PagesController::class,'searchResults'])->name('searchResults');
Route::get('ServiceResults/{ids}', [PagesController::class, 'ServiceResults'])->name('ServiceResults');
Route::get('categoryResults/{catName}', [PagesController::class, 'categoryResults'])->name('categoryResults');

Route::get('categoryCount', [PagesController::class, 'categoryCount'])->name('categoryCount');

Route::get('getMilestones/{id}', [BusinessController::class ,'getMilestones'])->name('getMilestones');
Route::get('getMilestonesS/{id}', [ServiceController::class, 'getMilestones'])->name('getMilestonesS');

Route::post('search', [PagesController::class, 'search'])->name('search');
Route::post('searchService', [PagesController::class, 'searchService'])->name('searchService');

Route::get('priceFilter/{min}/{max}/{ids}', [PagesController::class, 'priceFilter'])->name('priceFilter');
Route::get('priceFilterS/{min}/{max}/{ids}', [PagesController::class, 'priceFilterS'])->name('priceFilterS');
Route::get('priceFilter_amount/{min}/{max}/{ids}', [PagesController::class, 'priceFilter_amount'])->name('priceFilter_amount');


//SOCIAL
Route::get('social_login',function (){ return view('social_types'); })->name('social_login');
Route::get('/google', function (){
return Socialite::driver('google')->stateless()->redirect(); })->name('login.google');
Route::get('google/callback',[socialController::class, 'google']);

Route::get('/facebook', function () {
return Socialite::driver('facebook')->stateless()->redirect(); })->name('login.facebook');
Route::get('facebook/callback', [socialController::class, 'facebook']);
Route::get('skip', [PagesController::class, 'skip'])->name('skip');

//TERMS
Route::get('terms', function (){return view('terms');} )->name('terms');
Route::get('privacy-policy', function (){return view('privacy-policy');} )->name('privacy-policy');
Route::post('ApplyForShow', [socialController::class, 'ApplyForShow'])->name('ApplyForShow');

// Terms & Privacy
 Route::get('terms', function(){ return view('policy.terms'); } )->name('terms');
 Route::get('policy', function(){ return view('policy.privacy_policy'); } )->name('policy');

//EXTRA ROUTES
Route::get('{/anypath}', [PagesController::class, 'home'])->where('path', '.*');
Route::get('profile/{id}', [PagesController::class, 'profile']);
Route::post('profile/edit/{id}', [PagesController::class, 'updateProfile']);

Route::get('resetPassword/{email}/{password}', [AuthController::class, 'reset']);


Route::get('/clear', function() {
   \Artisan::call('config:cache');
    \Artisan::call('view:clear');
    \Artisan::call('route:clear');
    \Artisan::call('cache:clear');
    dd("Cache is cleared");

});
//EXTRA ROUTES

//Login Routes
Route::post('login',[AuthController::class,'login'])->name('login');
Route::post('register', [AuthController::class,'register'])->name('register');
Route::post('registerI', [PagesController::class, 'registerI'])->name('registerI');

//Default CRUD
// Route::post('/create', [UserController::class, 'store']);
// Route::put('/update/{id}', [UserController::class, 'update']);
// Route::get('/delete/{id}', [UserController::class, 'destroy']);
 //Route::get('/checkAuth', [AuthController::class,'checkAuth']);
