<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\checkoutController;
use App\Http\Controllers\adminController;

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
    echo 'Unauthorized!';
    echo 'Redirecting...';
    echo "<script>window.location.href='http://test.jitume.com:81/'</script>";

});


Route::get('/stripeSubscribe/{amount}/{plan}/{days}/{range}/{inv}', [checkoutController::class, 'stripeSubscribeGet'])->name('stripeSubscribe');
Route::get('/stripeSubscribeSuccess', [checkoutController::class, 'stripeSubscribeSuccess'])->name('stripeSubscribeSuccess');

Route::get('/connect/{id}', [checkoutController::class, 'connect'])->name('connect.stripe');
Route::get('/saveStripe/{token}', [checkoutController::class, 'saveStripe'])->name('return.stripe');

Route::get('milestoneService/{milestone_id}/{amount}', [checkoutController::class, 'milestoneCheckoutS'])->name('milestoneService');

// Route::middleware('auth:sanctum')->group(function() {
//  Route::post('milestoneService', [checkoutController::class, 'milestoneStripePostS'])->name('milestoneService.post');
// });


//** __________________________________________ADMIN_____________________________________________ **//

Route::group([ 'prefix' => 'admin'], function(){ 
    
    Route::get('/', function () {return view('admin.login');})->name('loginA');
    Route::get('/index_admin',[adminController::class, 'index_admin'])->name('index_admin');
    Route::get('/logout',[adminController::class,'logout'])->name('logout');

        Route::get('/artists', [adminController::class,'artists'])->name('artistsList');
        Route::get('/approve/{id}', [adminController::class,'approve'])->name('approve');
        Route::get('/restrict/{id}', [adminController::class,'restrict'])->name('restrict');
        Route::get('/del_artist/{id}', [adminController::class,'del_artist'])->name('del_artist');
        Route::get('/remove_song/{id}', [adminController::class,'remove_song'])->name('remove_song');
      
        Route::get('/users', [adminController::class,'users'])->name('users');   
        Route::get('/songs', [adminController::class,'songs'])->name('songs');         
        Route::post('/adminLogin', [adminController::class, 'adminLogin'])->name('adminLogin');
        Route::get('/reviews', function () {
        return view('admin.reviews');
        })->name('reviews');

    Route::get('forgot/{remail}', [adminController::class,'forgot'])->name('forgot');
    Route::post('send_reset_email', [adminController::class,'send_reset_email'])->name('send_reset_email');
    Route::post('reset/{remail}', [adminController::class,'reset'])->name('reset');

      
        //Route::get('/', function () {return view('admin.login');})->name('login');
       

});
 Route::get('admin/login', function () {return view('admin.login');})->name('loginA');
//** __________________________________________ADMIN_____________________________________________ **//