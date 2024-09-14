<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\checkoutController;

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
    return 'Welcome!';

});


Route::get('/stripeSubscribe/{amount}/{plan}/{days}/{range}/{inv}', [checkoutController::class, 'stripeSubscribeGet'])->name('stripeSubscribe');
Route::get('/stripeSubscribeSuccess', [checkoutController::class, 'stripeSubscribeSuccess'])->name('stripeSubscribeSuccess');

Route::get('/connect/{id}', [checkoutController::class, 'connect'])->name('connect.stripe');
Route::get('/saveStripe/{token}', [checkoutController::class, 'saveStripe'])->name('return.stripe');

Route::get('milestoneService/{milestone_id}/{amount}', [checkoutController::class, 'milestoneCheckoutS'])->name('milestoneService');

// Route::middleware('auth:sanctum')->group(function() {
//  Route::post('milestoneService', [checkoutController::class, 'milestoneStripePostS'])->name('milestoneService.post');
// });