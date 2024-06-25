<!DOCTYPE html>
<html lang="en">

<head>

<script src="https://use.fontawesome.com/53ab3d1fac.js"></script>

   <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
   <link href="{{ asset('/css/style.css') }}" rel="stylesheet"/>
     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"/>
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
    <meta name="description" content="">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
    <meta name="keywords" content="bibimcart, ">
    <meta name="author" content="">
    
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
   
<div class="container mt-5 mb-5">
    <form role="form" action="{{ route('stripe.post.coversation') }}" method="post" class="require-validation m-auto" data-cc-on-file="false" data-stripe-publishable-key="pk_test_51JFWrpJkjwNxIm6zf1BN9frgMmLdlGWlSjkcdVpgVueYK5fosCf1fAKlMpGrkfGoiXGMb0PpcMEOdINTEVcJoCNa00tJop21w6" id="payment-form">
                            @csrf
    <div class="right-content float-right bg-white shadow-md " style="margin-top: 50px; padding-left: 0;">

           <div class='form-row row my-2'>
                                <div class='col-sm-12 form-group required'>
                                    <label class=''><b>Amount(USD)</b> <small>5% + tax added</small></label> 
                                    <input class='form-control' size='4' name="price" id="price" type='number' value="{{$price}}" readonly>
                                </div> 
                            </div> 
 <div class="d-flex flex-column  gap-3">

        <!-- Purpose -->
        <label class=" purpose">Purpose</label>
         <p id="purpose"></p>

    </div>

     <!-- total -->
      <h2 class="py-2">Total:</h2>



             <div class="privacy-wrp" style="display: flex; align-items: center;">
    <label for="AND" class="allterms" style="display: flex; align-items: center; font-size: 12px;">
            <input type="checkbox" required id="AND" style="margin-right: 5px;">

        <span style="white-space: nowrap; text-transform: lowercase; font-size:13px;">I HAVE READ AND AGREE TO THE WEBSITE</span>
        <a id="terms" class=" bold" href="#" disabled style="margin-left: 5px;" style="font-size: 12px; color:red; font-weight: bold;">TERMS AND CONDITIONS</a>
    </label>
</div>






                            <div class="row mt-2">
                                <div class="col-sm-12 text-center">
                                    <button id="pay" class="font-weight-bold btn  m-auto btn-lg btn-block" type="submit">Pay <span id="paynow"></span><span id="stripBtn"></span></button>
                                </div>
                            </div>  




    </div>

</form>


    <div class="">
        <div class="col-lg-6">

            <div class="card bg-white shadow-md text-black" style="width: 95%;">
                <div class="float-left " style="padding-top: 20px; margin-left: 20px; text-decoration: none; color:gray;">
    <a href="{{ route('/') }}" class="btn btn-link text-dark"><i class="fas fa-home text-dark"></i> Home</a>
</div>

 






                <div class="card-body">
                    @if (Session::has('success'))
                    <div class="alert alert-success text-center">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>
                        <p>{{ Session::get('success') }}</p>
                    </div>
                    @endif
                  <div class="pb-3 pt-2 text-center" style="background-color: ;">
    <h6 class=" fw-bold" style="font-size: 1.25rem; color: rgb(22 101 52);">A Secure and Easy Checkout Experience</h6>
    <h5 class="text-dark fw-bold" style="font-size: 1rem;">Pay with your Credit/Debit Card via Stripe</h5>
</div>


                     
                    <div class="card-text right-contentz">
                        <form role="form" action="{{ route('stripe.post.coversation') }}" method="post" class="require-validation m-auto" data-cc-on-file="false" data-stripe-publishable-key="pk_test_51JFWrpJkjwNxIm6zf1BN9frgMmLdlGWlSjkcdVpgVueYK5fosCf1fAKlMpGrkfGoiXGMb0PpcMEOdINTEVcJoCNa00tJop21w6" id="payment-form">
                           @csrf 


                           <input hidden type="number" name="listing" value="{{$listing}}">
                            <div class="row error mx-1 text-center collapse">
                                <p style="color:#e31313; background: #cfcfcf82;font-weight: 600;" class="alert my-2 py-1 w-100"></p>
                            </div> 

                            <div class="errorPopup" id="errorPopup">
    <div class="errorPopup-content">
        <span class="close-button" onclick="closeErrorPopup()">&times;</span>
        <p style="color:#e31313; background: #cfcfcf82; font-weight: 600;" class="alert my-2 py-1 w-100">Error message here</p>
    </div>
</div>

                             <div class='col-sm-12 form-group required ms-content'>
        <label class=''><b>Amount(USD)</b> <small>5% + tax added</small></label> 
        <input class='form-control' size='4' name="price2" id="price2" type='number' value="{{$price}}" readonly>
    </div> 

                            <div class='form-row row my-2'>
    <div class='col-sm-12 form-group required'>
        <label class='control-label text-'><b>Email</b></label> 
        <input class='form-control' size='4' name="email" id="" type='email' placeholder="Enter your email">
    </div> 
</div> 

<div class='form-row row my-2'>
    <div class='col-sm-12 form-group required'>
        <label class='control-label'><b>Name on Card</b></label> 
        <input name="name" class='form-control' size='4' type='text' placeholder="Enter name on card">
    </div>
</div>


                           <div class='form-row row my-2'>
    <div class='col-sm-12 form-group  required bd-rm'>
        <label class='control-label'><b>Card Number</b></label> 
        <div class="input-group">
            <div  class="input-group-prepend ">
                <span id="icon" class="input-group-text"><i class="fas fa-credit-card  "></i></span>
            </div>
            <input autocomplete='on' class='form-control card-number' size='20' type='text'>
        </div>
    </div>


</div>
<div class='form-row row my-2'>
        <div class='col-xs-12 col-md-4 form-group cvc required'>
            <label class='control-label'><b>CVC</b></label> 
            <input autocomplete='off' class='form-control card-cvc' placeholder='ex. 311' size='4' type='text'>
        </div>
        <div class='col-xs-12 col-md-4 form-group expiration required'>
            <label class='control-label'><b>Exp. Month</b></label> 
            <input autocomplete='on' class='form-control card-expiry-month' placeholder='MM/Ex. 07' size='2' type='text'>
        </div>
        <div class='col-xs-12 col-md-4 form-group expiration required'>
            <label class='control-label'><b>Exp. Year</b></label> 
            <input autocomplete='on' class='form-control card-expiry-year' placeholder='YYYY/Ex. 2022' size='4' type='text'>
        </div>
    </div>


<div class="ms-content  ">
   
    
<div class="d-flex flex-column  gap-3">

        <!-- Purpose -->
        <label class=" purpose">Purpose</label>

        <p id="purpose"></p>
    </div>

     <!-- total -->
      <h2 class="py-2">Total:</h2>

    <div class="privacy-wrp" style="display: flex; align-items: center;">
         


        <label for="AND" class="allterms" style="display: flex; align-items: center; font-size: 12px;">
            <input type="checkbox" required id="AND" style="margin-right: 5px;">
            <span style="white-space: nowrap; text-transform: lowercase; font-size:13px;">I HAVE READ AND AGREE TO THE WEBSITE</span>
            <a id="terms" class=" bold" href="#" disabled style="margin-left: 5px;" style="font-size: 12px; color:red; font-weight: bold;">TERMS AND CONDITIONS</a>
        </label>
    </div>
 <div class="row mt-2">
        <div class="col-sm-12 text-center">
            <button id="pay" class="font-weight-bold btn  m-auto btn-lg btn-block" type="submit">Pay<span id="paynow"></span><span id="stripBtn"></span></button>
        </div>
    </div> 
</div>


                           
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>










	     <!--    <div class=" float-right"> <a class="btn btn-dark float-right" href="{{route('/')}}">Back to home</a></div>-->

  
	
</div>






    <script src="js/slider2.js"></script>


<script type="text/javascript" src="https://js.stripe.com/v2/"></script>

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    

   <script type="text/javascript">

var x = sessionStorage.getItem("purpose");

document.getElementById("purpose").innerHTML= x;

        console.log(x)

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
