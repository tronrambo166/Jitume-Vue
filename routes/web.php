<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\checkoutController;
use App\Http\Controllers\adminController;
use App\Http\Controllers\PayPalController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PayStackController;
use App\Http\Controllers\MpesaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    echo 'Redirecting to beta...';
    echo "<script>window.location.href='https://beta.tujitume.com/'</script>";

});


Route::get('/stripeSubscribe/{amount}/{plan}/{days}/{range}/{inv}', [checkoutController::class, 'stripeSubscribeGet'])->name('stripeSubscribe');
Route::get('/stripeSubscribeSuccess', [checkoutController::class, 'stripeSubscribeSuccess'])->name('stripeSubscribeSuccess');

Route::get('/connect/{id}', [checkoutController::class, 'connect'])->name('connect.stripe');
Route::get('/saveStripe/{token}', [checkoutController::class, 'saveStripe'])->name('return.stripe');

Route::get('milestoneService/{milestone_id}/{amount}', [checkoutController::class, 'milestoneCheckoutS'])->name('milestoneService');

// Route::middleware('auth:sanctum')->group(function() {
//  Route::post('milestoneService', [checkoutController::class, 'milestoneStripePostS'])->name('milestoneService.post');
// });

Route::get('paypal-payment',[PayPalController::class,"payment"])->name('paypal.payment');
Route::get('paypal-success',[PayPalController::class,"success"])->name('paypal.success');
Route::get('paypal-cancel',[PayPalController::class,'cancel'])->name('paypal.cancel');

// PayStack  ROUTES for Test
    Route::get('/mpesaStk', [MpesaController::class,'stk']);
    Route::get('/AccountBalance', [MpesaController::class,'AccountBalance']);
    Route::get('/b2cSplit', [MpesaController::class,'b2c_Split']);

    Route::get('/initialize', [PayStackController::class, 'initialize']);
    Route::get('/create-subaccount', [PayStackController::class, 'create_subaccount']);
    Route::get('/verify', [PayStackController::class, 'verify']);
    Route::get('/transfer', [PayStackController::class, 'transfer_funds']);


//** __________________________________________ADMIN_____________________________________________ **//

Route::group([ 'prefix' => 'admin'], function(){ 
    
    Route::post('/searchInAdmin', [adminController::class,'searchInAdmin'])->name('searchInAdmin');
    Route::get('/',[adminController::class,'login'])->name('loginA');
    Route::get('/login',[adminController::class,'login'])->name('loginA');

    Route::get('/index_admin', [adminController::class, 'index_admin'])->name('index_admin');
    Route::get('/logout',[UserController::class,'logout'])->name('logout');

    Route::get('/approve/{id}', [adminController::class,'approve'])->name('approve');
    Route::get('/restrict/{id}', [adminController::class,'restrict'])->name('restrict');
    Route::get('/del_users/{id}', [adminController::class,'del_artist'])->name('del_users');
    Route::get('/remove_dispute/{id}', [adminController::class,'remove_dispute'])->name('remove_dispute');
  
    Route::get('/users', [adminController::class,'users'])->name('users');   
    Route::get('/listings-active', [adminController::class,'listings_active']);
    Route::get('/services-active', [adminController::class,'services_active']);
    Route::get('/prospects', [adminController::class,'prospects']);
    Route::get('/disputes', [adminController::class,'disputes']);
    Route::get('/reports', [adminController::class,'reports']);
    Route::get('otherReports/{id}', [adminController::class,'otherReports']);
    Route::get('reportDownload/{id}', [adminController::class,'reportDownload'])
    ->name('reportDownload');
             
    Route::post('/adminLogin', [UserController::class, 'adminLogin'])->name('adminLogin');
    Route::get('/reviews', function () {
    return view('admin.reviews');
    })->name('reviews');

    Route::get('forgot/{remail}', [adminController::class,'forgot'])->name('forgot');
    Route::post('send_reset_email', [adminController::class,'send_reset_email'])->name('send_reset_email');
    Route::post('reset/{remail}', [adminController::class,'reset'])->name('reset');    

});
 Route::get('admin/login', function () {return view('admin.login');})->name('loginA');
//** __________________________________________ADMIN_____________________________________________ **//