<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="icon" href="../../../../images/favicon.ico" type="image/x-icon" />
    <title>Pay With Stripe</title>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
    <meta name="description" content="">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
    <meta name="keywords" content="bibimcart, ">
    <meta name="author" content="">
    <link href="{{ asset('/css/style.css') }}" rel="stylesheet"/>
     <link rel="stylesheet"href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
    
   </head>



<body>
<div class="container">
    @if(Session::has('Stripe_failed'))
        <!-- Pop up Modal -->
            <div class="success_message modal" style="display:block;" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content popup_success">

                        <div class="modal-body">
                            <h2 class="my-4 modal-title text-center w-100" id="exampleModalLabel">Failed</h2>

                            <p class="text-center text-danger">{{Session::get('Stripe_failed')}} @php Session::forget('Stripe_failed'); @endphp</p>
                        </div>
                        <div class="modal-footer">
                            <button onclick="popupClose();" type="button" class="w-50 py-2 my-3 h5 m-auto btn text-white" style="background:red;font-size: 18px;" data-dismiss="modal">Ok</button>

                        </div>
                    </div>
                </div>
            </div>
            <!-- Pop up Modal -->
        @endif
   
	
  <div class="col-sm-12">
         <div class="row float-right"> <a class="btn btn-primary float-right" href="/">Back to home</a></div>

         <h5 class="text-center w-75 my-3 text-left">Pay with your Credit/Debit Card via Stripe    <i  class="fab fa-cc-mastercard fa-1x"></i> <i style="color:red" class="fab fa-cc-visa fa-1x"></i> </h5>

         @php $expire_date = date('Y-m-d', strtotime(date('Y-m-d'). '+7 days'));
         @endphp
         <div class="row w-75 bg-light m-auto ">
            <div class="col-md-12">
                 @if($base_price == 0)
                 <div class="alert bg-primary text-light system_ui alert-dismissible fade show mb-0 py-1 text-center" role="alert">
                  Your first 7 days are free. Cancel anytime, with no fee until  {{date('d M, Y',strtotime($expire_date)) }}.
                  <button type="button" class="py-1 close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                @endif
            </div>

            <div class="col-md-6 mx-auto col-md-offset-3 py-2">
                
               <div class="panel m-auto panel-default credit-card-box">
                  <div class="panel-heading display-table" >
                     <div class="row display-tr" >
                        <div class="display-td" >                            
                           
                        </div>
                     </div>
                  </div>
                  <div class="panel-body">
                     @if (Session::has('success'))
                     <div class="alert alert-success text-center">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>
                        <p>{{ Session::get('success') }}</p>
                     </div>
                     @endif



                        <!-- Form Starts Here -->
  <!--                    <form     
                        role="form"
                        
                        method="post"
                        class="require-validation m-auto"
                        data-cc-on-file="false"
                        data-stripe-publishable-key="pk_test_51JFWrpJkjwNxIm6zf1BN9frgMmLdlGWlSjkcdVpgVueYK5fosCf1fAKlMpGrkfGoiXGMb0PpcMEOdINTEVcJoCNa00tJop21w6"
                        id="payment-form">
                        @csrf

  
                        <div class="row error mx-1 text-center collapse"><p style="color:#e31313; background: #cfcfcf82;font-weight: 600;" class="alert my-2 py-1 w-100"></p></div> 
                         
                        <div class='form-row row my-2'>
                           <div class='col-sm-12 my-0 form-group required'>
                              <label class='control-label small'><b>  Amount(USD) </b> <small>5% + tax added</small></label> 

                              <input class='form-control' size='4' name="price" id="price" type='number' value="{{$price}}" readonly >


                           </div> 

                        </div>  

                        <div class='form-row row my-2'>
                           <div class='col-sm-12 my-0 form-group required'>
                              <label class='control-label small'><b>  Email </b></label> 
                              <input class='form-control' size='4' name="email" id="" type='email'  >

                           </div> 

                        </div> 

                     <input hidden type="text" name="plan" value="{{$plan}}">
                      <input hidden type="number" name="listing" value=""> 


                        <div class='form-row row my-2'>
                           <div class='col-sm-12 my-0 form-group required'>
                              <label class='control-label small'><b> Name on Card </b></label> <input name="name" 
                                 class='form-control' size='4' type='text'>
                           </div>


                        </div>
                        <div class='form-row row my-2'>
                           <div class='col-sm-12 my-0 form-group card required'>
                              <label class='control-label small'><b> Card Number </b></label> <input autocomplete='on'
                                 autocomplete='off' class='form-control card-number' size='20'
                                 type='text'>

                                          

                           </div>

                         
                        </div>
                        <div class='form-row row my-2'>
                           <div class='col-xs-12 col-md-4 form-group cvc required'>
                              <label class='control-label small'><b> CVC </b></label> <input autocomplete='off'
                                 class='form-control card-cvc' placeholder='ex. 311' size='4'
                                 type='text'>
                           </div>
                           <div class='col-xs-12 col-md-4 form-group expiration required'>
                              <label class='control-label small'><b> Exp. Month </b></label> <input autocomplete='on'
                                 class='form-control card-expiry-month' placeholder='MM/Ex.  07' size='2'
                                 type='text'>
                           </div>
                           <div class='col-xs-12 col-md-4 form-group expiration required'>
                              <label class='control-label small'><b> Exp. Year </b></label> <input autocomplete='on'
                                 class='form-control card-expiry-year' placeholder='YYYY/Ex. 2022' size='4'
                                 type='text'>
                           </div>
                        </div>
                        


                        <div class="privacy-wrp ">
                                            
                                                <input type="checkbox" required="" id="AND">
                                                <label for="AND" class="allterms d-inline"> 
                                                    <p class="d-inline small" style="font-size: 12px;">I HAVE READ AND AGREE TO THE WEBSITE <a class="text-light" href="#" disbaled> TERMS AND CONDITIONS</a></p>
                                                </label>  </div>


                        <div class="row">
                           <div class="col-sm-12 text-center">
                              <button id ="" class=" font-weight-bold btn pay_btns m-auto btn-lg btn-block" type="submit" >Pay <span id="paynow"></span><span id="stripBtn"></span></button>
                           </div>
                        </div>

                     </form> -->

                     <a href="{{$payLink}}" class=" font-weight-bold btn btn-success mx-auto my-5 btn-lg btn-block text-light" type="submit" >Continue <span id="paynow"></span><span id="stripBtn"></span></a>


                  </div>
               </div>
            </div>

            <div class="col-md-6" id="info">
                <div class=" wrapper bg-white">
                    <div class="p-3">
                    <h5 class="p-2">{{ucwords($plan)}} Plan</h5>

                    @if($base_price == 0)
                    <div class="p-2 my-2 rounded bg-warning">
                    <h6 class="ml-2">RISK-FREE TRIAL
                        </h6>
                        <p class="ml-2 my-0 small ">Your first 7 days are free</p>
                        </div>
                        <hr>
                        @endif

                        @php if($base_price == 0){ $base_price = $trial_price; 
                        $base_price_old = 0; } @endphp
                        <div class="px-3">
                            <div class="row">
                                <div class="col-md-6">
                                    <p>Subtotal:</p>
                                </div>
                                <div class="col-md-6">
                                    <p style="font-weight:500;">${{round($trial_price,2)}}/mo</p>
                                </div>

                                <!-- <div class="col-md-6">
                                    <p>Tax(5%):</p>
                                </div>
                                <div class="col-md-6">
                                    <p style="font-weight:500;">${{round($base_price*0.05,2)}}</p>
                                </div> -->

                                <div class="col-md-6">
                                    <p class="h6" style="font-weight:500;">Due Now:</p>
                                </div>
                                <div class="col-md-6">
                                    <p class="h6" style="font-weight:500;">${{number_format((float)$price, 2, '.', '');}}/mo</p>
                                </div>


                                @if(isset($base_price_old) && $base_price_old ==0)
                                <div class="col-md-6">
                                    <p class="font-weight-bold small" style="font-weight:500;">After trial ends on {{date('d M, Y',strtotime($expire_date)) }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p class="font-weight-bold small" style="font-weight:500;">${{round($trial_price,2)}}/mo</p>
                                </div>


                                <div class="col-md-12 my-3">
                                    <div class="wrapper m-auto">
                                        <h6>Free plan terms</h6> <hr>

                                        <p class="small"> <i class="fa fa-check-circle" aria-hidden="true"></i> &nbsp; Billing automatically starts after free trial ends</p>
                                        <p class="small"> <i class="fa fa-check-circle" aria-hidden="true"></i> &nbsp; Cancel before {{date('d M',strtotime($expire_date)) }} to avoid getting billed</p>
                                        <p class="small"> <i class="fa fa-check-circle" aria-hidden="true"></i> &nbsp; We will remind you 7 days before trial ends</p>
                                    </div>
                                </div>
                                @endif
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            

         </div>
      </div>

	
</div>








<script type="text/javascript" src="https://js.stripe.com/v2/"></script>

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    

   <script type="text/javascript">


    $(function() {
    var $form = $(".require-validation");
    $('form.require-validation').bind('submit', function(e) {
        var $form = $(".require-validation"),
            inputSelector = ['input[type=email]', 'input[type=password]',
                'input[type=text]', 'input[type=file]',
                'textarea'
            ].join(', '),
            $inputs = $form.find('.required').find(inputSelector),
            $errorMessage = $form.find('div.error'),
            valid = true;
        $errorMessage.addClass('hide');
        $('.has-error').removeClass('has-error');
        $inputs.each(function(i, el) {
            var $input = $(el);
            if ($input.val() === '') {
                $input.parent().addClass('has-error');
                $errorMessage.removeClass('hide');
                e.preventDefault();
            }
        });
        if (!$form.data('cc-on-file')) {
            e.preventDefault();
            Stripe.setPublishableKey($form.data('stripe-publishable-key'));
            Stripe.createToken({
                number: $('.card-number').val(),
                cvc: $('.card-cvc').val(),
                exp_month: $('.card-expiry-month').val(),
                exp_year: $('.card-expiry-year').val()
            }, stripeResponseHandler);
        }
    });
    function stripeResponseHandler(status, response) {
        if (response.error) { 
            $('.error')
                .removeClass('collapse')
                .find('.alert')
                .text(response.error.message);
        } else {
            /* token contains id, last4, and card type */
            var token = response['id'];
            $form.find('input[type=text]').empty();
            $form.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
            $form.get(0).submit();
        }
    }
});

      function popupClose() {
            $('.success_message').css('display', 'none');
        }
   </script>

</body>

</html>
