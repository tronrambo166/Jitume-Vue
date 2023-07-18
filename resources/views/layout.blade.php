
<!DOCTYPE HTML>
<head>
    <title>JITUME</title>
    <link rel="icon" href="images/favicon2.ico" type="image/x-icon" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
     <link rel="stylesheet"href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
 
   <style type="text/css"> 
   .btn-success{background:#72c537;color:white;}
   </style>
    
    
    
    <link href="slider/dist/nouislider.css" rel="stylesheet">
    <script src="slider/dist/nouislider.js"></script>
    
    <!-- <link href='http://fonts.googleapis.com/css?family=Monda' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Doppio+One' rel='stylesheet' type='text/css'> -->

   <link href="{{ asset('/css/app.css') }}" rel="stylesheet">
   <link href="{{ asset('/css/style.css') }}" rel="stylesheet"/>

     <link href="https://cdn.datatables.net/1.10.20/css/dataTables.bootstrap4.min.css" rel="stylesheet" crossorigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" integrity="sha512-vKMx8UnXk60zUwyUnUPM3HbQo8QfmNx7+ltw8Pm5zLusl1XIfwcxo8DbWCqMGKaWeNxWA8yrx5v3SaVpMvR3CA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        
        <link rel="stylesheet" href="https://cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <!-- {{-- Vue component files --}}
        <script src="https://unpkg.com/vue"></script>
        <script src="https://unpkg.com/http-vue-loader"></script>
          {{-- Vue component files --}} -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">

  
</head>



<body class="">     

<div class="app " style="background: white;" >
 

<!-- Layout -->


<nav class="navbar navbar-expand-lg primary_bg">

  <a href="./"><img class="img-fluid pb-2" width="170px" height="45px" src="images/logo.png" style="margin-left: 45px;"></a>


  <button class="navbar-toggler bg-white text-white mr-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto text-white">


      <!-- <li class="nav-item active" >
        <a class="nav-link" href="/home" style="color:white;">Home <span class="sr-only">(current)</span></a>
      </li> -->

      <li class="nav-item py-1 px-3 active " >
        <router-link  to="/home" class="header_buttons py-1 px-3">     Home
        </router-link>
      </li>


      <li class="nav-item py-1 px-3 text-light ">
        <router-link to="/services" class=" header_buttons py-1 px-3 "> 
            Jitume Services 
        </router-link>
      </li>



    </ul>

    <div class="my-2 my-lg-0">
      
        <div class="py-1 px-md-3">

            @if(Auth::check()) 
            <div class="ml-3 ml-md-0 d-flex">

                <div class="nav-item">
                     <a  href="{{route('business')}}" class="header_buttons px-sm-3 my-1 mr-2 px-1 py-1 " ><b>Dashboard</b></a> 
                </div> 
               
                <div class="nav-item">
                    <a v-if="" onclick="event.preventDefault();
                 document.getElementById('logout-form').submit();" class=" sign_in_btn  px-sm-3 my-1 mr-2 px-1 py-1 " ><b>Sign Out</b></a>
                </div> 

            </div>


            @elseif (Session::has('investor_auth') && Session::get('investor_auth') == true)

            <div class="ml-3 ml-md-0 d-flex">
   
                <div class="nav-item">

                    <a  href="{{route('business')}}" class="header_buttons px-sm-3 my-1 mr-2 px-1 py-1" ><b>Dashboard</b></a> 
                </div> 
               
                <div class="nav-item">
                    <a v-if="" onclick="event.preventDefault();
                     document.getElementById('logout-form').submit();" class="sign_in_btn px-sm-3 my-1 mr-2 px-1 py-1" ><b>Sign Out</b>
                    </a>
                </div> 

            </div>

            @else

            <div class="ml-3 ml-md-0 d-flex">

                <div class="" id="call_to">

                  <a onclick="c_to_action();" data-target="#loginModal" data-toggle="modal" class="header_buttons my-1 mr-2 px-2 py-1" style="color: white;"><span id="c_to_ac">
                  Add Your Business</span></a> 
                </div>

                <a  data-target="#loginModal" data-toggle="modal" class=" sign_in_btn px-sm-3 my-1 mr-2 px-1 py-1 d-inline-block  text-center ml-md-3" >Sign In</a>


            </div> 

            

            

            @endif

        </div>
    </div>
  </div>
</nav>



<!-- Commenting Previous Navigation Bar -->
@php
/*

<div class="row border_dark p-0" style="background: #001C30;">

    <div class="col-8">

        <div class="navbar navbar-expand-sm p-0 navy  ">
       
            <ul class="navbar-nav py-1 ">

            
                <li class="nav-item py-1 pr-5">
                    <a href="./"><img class="" src="images/logo.png" width="170px" height="45px" style="margin-left: 45px;"></a>
                </li>

                    <div class="navbar navbar-expand-sm pl-4">
                        <ul class="navbar-nav ">
                    
                            <li class="nav-item py-1 px-3 active"><router-link to="/home" class=" header_buttons py-1 px-3"> <b style="">Home</b></router-link></li>

                            <li class="nav-item py-1 px-3 text-light"><router-link to="/services" class=" header_buttons py-1 px-3 "> 
                                <b style=""> Jitume Services </b></router-link></li>

                            <!-- <li class="font-weight-bold nav-item py-1 px-3"><router-link to="/applyShow" class="">Apply for Show
                            </router-link></li> -->

                        </ul>

                    </div>

            </ul>
         </div>

    </div>

    
    
    <div class="col-3 px-0">

        <ul style="padding:0;">
       
            <li style="list-style-type: none;" class="w-100 ml-2 mt-3 nav-item py-1 px-3 text-light ">

                <!-- 
                (Session::has('business_auth') && Session::get('business_auth') == true)

                <div class="row">
                 <div class="col-sm-6 py-1 text-center">
                     <a  href="./business" style="background: aliceblue; border-radius: 15px;" class=" text-dark small d-inline px-3 py-2 d-inline-block text-center" ><b>Dashboard</b></a> 
                </div> 
                   
                <div class="col-sm-6 py-1 text-center">
                    <a v-if="" onclick="event.preventDefault();
                 document.getElementById('logout-form').submit();" style="background: white; border-radius: 15px;cursor: pointer;" class=" text-dark d-inline px-3 py-2 d-inline-block text-center small" ><b>Logout</b></a>
                  </div> 

                 </div>


                (Session::has('service_auth') && Session::get('service_auth') == true)

                <div class="row">
                 <div class="col-sm-6 py-1 text-center">
                    <a  href="./services" style="background: aliceblue; border-radius: 15px; " class=" text-dark d-inline px-3 py-2 d-inline-block small text-center" ><b>Dashboard</b></a> 
                    </div>

                    <div class="col-sm-6 py-1 text-center">
                    <a v-if="" onclick="event.preventDefault();
                 document.getElementById('logout-form').submit();" style="background: white; border-radius: 15px;cursor: pointer;" class=" text-dark d-inline px-3 py-2 d-inline-block text-center small" ><b>Sign Out</b></a>

                  </div> 

                 </div>
             -->

            @if(Auth::check()) 
            <div class="row">
                <div class="col-sm-2"></div>

                <div class="col-sm-4 py-1 text-center">
                     <a  href="{{route('business')}}" style="background: aliceblue; border-radius: 15px;" class="ml-2 header_buttons text-dark px-sm-3 my-1 mr-2 px-1 py-1 d-inline-block small text-center" ><b>Dashboard</b></a> 
                </div> 
               
                <div class="col-sm-6 py-1 text-center">
                    <a v-if="" onclick="event.preventDefault();
                 document.getElementById('logout-form').submit();" style="background: white;" class=" header_buttons text-dark px-sm-3 my-1 mr-2 px-1 py-1 d-inline-block small text-center" ><b>Sign Out</b></a>
                </div> 

            </div>


            @elseif (Session::has('investor_auth') && Session::get('investor_auth') == true)

            <div class="row">

                <div class="col-sm-2"></div>   
                <div class="col-sm-4 py-1 text-center">

                    <a  href="{{route('business')}}" style="background: aliceblue; border-radius: 15px;" class="ml-2 header_buttons text-dark px-sm-3 my-1 mr-2 px-1 py-1 d-inline-block small text-center" ><b>Dashboard</b></a> 
                </div> 
               
                <div class="col-sm-6 py-1 text-center">
                    <a v-if="" onclick="event.preventDefault();
                 document.getElementById('logout-form').submit();" style="background: white; border-radius: 15px;cursor: pointer;" class=" header_buttons text-dark d-inline px-sm-3 my-1 mr-2 px-1 py-1 d-inline-block small text-center" ><b>Sign Out</b></a>
                  </div> 

             </div>

            @else 

            <div class="d-inline-block" id="call_to">

                  <a onclick="c_to_action();" data-target="#loginModal" data-toggle="modal" style="background: #176B87; border-radius: 15px;cursor: pointer;" class=" header_buttons text-light px-sm-3 my-1 px-1 py-1 ml-5 d-inline-block small text-center" ><span style="font-weight:bolder;" id="c_to_ac">
                  Add Your Business</span></a> 
            </div>

            <a  data-target="#loginModal" data-toggle="modal" style="background: white; border-radius: 15px;cursor: pointer;" class=" header_buttons float-right text-dark px-sm-3 my-1 mr-2 px-1 py-1 d-inline-block small text-center" ><b>Sign In</b></a>

            @endif

        </li>
                                    
        </ul>
        
    </div> 

</div> 
        
*/

@endphp   

<!-- Layout -->



<!-- Body -->

<div class="">

       <!--  @if(Session::has('login_err'))
        <div class="w-50 m-auto alert alert-danger alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{Session::get('login_err')}}   @php Session::forget('login_err'); @endphp </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>  @endif -->


        @if(Session::has('auth_service'))
        <div class="w-50 m-auto alert alert-success alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{Session::get('auth_service')}}   @php Session::forget('auth_service'); @endphp </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>  
        @endif


        @if(Session::has('auth_business'))
        <div class="w-50 m-auto alert alert-success alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{Session::get('auth_business')}}   @php Session::forget('auth_business'); @endphp </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>  
        @endif


        @if(Session::has('auth_investor'))
        <div class="w-50 m-auto alert alert-success alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{Session::get('auth_investor')}}   @php Session::forget('auth_investor'); @endphp </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>  
        @endif 



        @if(isset($errors))

            @foreach ($errors->all() as $error)
                <div class="w-50 m-auto alert alert-danger alert-dismissible fade show" role="alert">
                  <p class="font-weight-bold">{{$error}} </p>
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div> 
            @break; @endforeach

        @endif

        <!--  @error('email')
        <div class="w-50 m-auto alert alert-danger alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{$message}} </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div> 
        @enderror

        @error('password')
        <div class="w-50 m-auto alert alert-danger alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{$message}} </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div> 
        @enderror


         @error('name')
        <div class="w-50 m-auto alert alert-danger alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{$message}} </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div> 
        @enderror
        -->
                   
    </div>
       

                    
                   


        @if(Session::has('reset'))
            <p class="text-light font-weight-bold">{{Session::get('reset')}}   @php Session::forget('reset'); @endphp </p>
        @endif                         


        @if(Session::has('loginFailed'))
            <p style="position: absolute;background: chartreuse;right: 0px;border-radius: 10px;" class="mb-3 text-danger font-weight-bold float-right">{{Session::get('loginFailed')}} @php Session::forget('loginFailed'); @endphp </p>
        @endif


        @if(Session::has('Stripe_pay'))
            <p style="position: absolute;background: #00ff89;right: 0px;border-radius: 0px;" class="text-center mb-2 w-25 shadow font-weight-bold float-right">{{Session::get('Stripe_pay')}} @php Session::forget('Stripe_pay'); @endphp </p>
        @endif

        <!-- yield('page') -->
        <router-view :auth_user='@json($auth_user)' :app_url='@json($app_url)' 
        :business='@json($business)' ></router-view>
        <!-- yield('page') -->

</div>

<!-- Vue Body End -->

<footer class="secondary_bg pt-3 text-light">

    <div class="container-xl row mx-auto my-3 d-flex align-items-center">
        <div class="col-12 col-sm-6 d-flex justify-content-start">
            <div class="">
                <img style="max-width: 438px;" class="w-100" src="images/logo_footer.png" />
            </div>
        </div>

        <div class="col-12 col-sm-3 d-flex justify-content-center">
            <ul class="text-light">     
                <li style="list-style-type:none;">
                     @if(Session::has('business_auth') && Session::get('business_auth') == true)
                    <a href="./business/listings" class="footer_txt" href="#"><i class="mr-2 fa fa-angle-right"></i>My Listings</a>

                     @elseif(Session::has('service_auth') && Session::get('service_auth') == true)
                    
                    <a href="./services/services" class="footer_txt" href="#"><i class="mr-2 fa fa-angle-right"></i>My Services</a>
                      @endif
              </li>


               

                <li style="list-style-type:none;">
                   @if(Session::has('business_auth') && Session::get('business_auth') == true)
                    <a href="./business/add-listing" class="footer_txt" href="#"><i class="mr-2 fa fa-angle-right"></i>Add Listing</a>

                     @elseif(Session::has('service_auth') && Session::get('service_auth') == true)
                    
                    <a href="./services/add-services" class="footer_txt" href="#"><i class="mr-2 fa fa-angle-right"></i>Add Service</a>
                      @endif
                </li>
            </ul>
        </div>

        <div class="col-12 col-sm-3 pt-2 d-flex justify-content-center">
             <ul class="text-light">
                
                <h3 class="h3">Contact Us</h3>

                <li style="list-style-type:none;">
                    <span class="footer_txt text-light">
                        E-Mail:<a class="footer_txt text-light d-inline" href="mailto:info@thedtagency.com"> info@thedtagency.com</a>
                    </span>
                    
                </li>

                
            </ul>
        </div>
    
    </div>


    <div class="w-100 primary_bg py-2">
        <div class="w-100">
            <div class="py-2">

                 <div class="col-sm-6 m-auto text-center">
                    
                    <p class="text-center pt-2">© JITUME. All Rights Reserved.
                    </p>
                </div>  

                
            </div>
        </div>

    </div>
        
</footer>


</div>
    
    
    



<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script> 
 <!-- <script src="https://code.jquery.com/jquery-3.6.0.js"></script> -->
       

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

<script src="slider/dist/nouislider.js"></script>


<script type="text/javascript">
    function suggest(search){  $("#result_list").html('');  
        var searchText=search;

$.ajax({
url:'get_suggest/'+searchText,
method:'get',
dataType:'json',
                success: function (response) {
                    console.log(response);
                
               for (i=0; i < 10; i++){ //console.log(response.data[i].name);
                    var name=response.data[i].name;
                    var city=response.data[i].city;
                    var country=response.data[i].country;
                    $("#result_list").show();

        $("#result_list").append(' <div onclick="address(\'' + name +','+ city +','+ country + '\');" style="" data-id="'+response.data[i].name+'" class="address  py-0 my-0 border broder-dark bg-light shadow single_comms">  <h6 class="font-weight-bold text-dark d-inline" ><i class="fa fa-map-marker text-success" aria-hidden="true"></i> '+name+'</h6> <p  class="d-inline text-dark"> Loc: <small>'+city+', '+country+'</small> </p> </div>');



                        }  
                    //document.getElementById('result_list').style.overflowY="scroll";   

     },
      error:function(error){  console.log(error);}

});

    }

  
</script>


    
<script type="text/javascript" src="js/app.js"></script>

 <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" integrity="sha512-VEd+nq25CkR676O+pLBnDW09R7VQX9Mdiij052gVCp5yVH3jGtH70Ho/UUv4mJDsEdTvqRCFZg0NKGiojGnUCw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

       
        <script src="https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js" crossorigin="anonymous"></script>
        <script src="https://cdn.datatables.net/1.10.20/js/dataTables.bootstrap4.min.js" crossorigin="anonymous"></script>
 


<script type="text/javascript">
    function address(place){
        //var place = $(this).attr('data-id');
        document.getElementById('searchbox').value = place;
        //$("#result_list").html('');
       document.getElementById("result_list").style.display='none';

}

</script>
 
<!-- DATEPICKER -->
<link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/resources/demos/style.css">
  <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
  <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
  <!-- DATEPICKER -->

  <!-- Price SLIDER -->
  
  

  <script type="text/javascript"></script>
  <!-- Price SLIDER -->
  
  <script>
$( function() {
//DATE
$( "#datepicker" ).datepicker();
$( "#datepicker3" ).datepicker();
$( "#datepicker4" ).datepicker();
$( "#datepickerHome1" ).datepicker();
$( "#datepickerHome2" ).datepicker();

//Start
$( "#datepicker" ).datepicker({dateFormat: "yy-mm-dd"});
var dateFormat = $( "#datepicker" ).datepicker( "option", "dateFormat" );
$( "#datepicker" ).datepicker( "option", "dateFormat", "yy-mm-dd" );
//Min Date
$( "#datepicker" ).datepicker({
  minDate: new Date()
});
var minDate = $( "#datepicker" ).datepicker( "option", "minDate" );
$( "#datepicker" ).datepicker( "option", "minDate", new Date() );

//End
$( "#datepicker2" ).datepicker({dateFormat: "yy-mm-dd"});
var dateFormat = $( "#datepicker2" ).datepicker( "option", "dateFormat" );
$( "#datepicker2" ).datepicker( "option", "dateFormat", "yy-mm-dd" );
//Min Date
$( "#datepicker2" ).datepicker({
  minDate: new Date()
});
var minDate = $( "#datepicker2" ).datepicker( "option", "minDate" );
$( "#datepicker2" ).datepicker( "option", "minDate", new Date() );

  } );


 //if(currentDate !=null) console.log(currentDate);

  </script>

  <script type="text/javascript">
      //EndDate
$("#datepicker2").datepicker({
                onSelect: function (date, datepicker) {
                    var date_start = $('#datepicker').val();
                    if (date != "") {
                        if(date_start > date)
                            alert('End date cannot be earlier than start date!!')
                        const date1 = new Date(date_start);
                        const date2 = new Date(date);
                        const diffTime = Math.abs(date2 - date1);
                        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        diffDays = diffDays+1; 
                        $('#days').html(diffDays);

                        var per_day = $('#per_day').val();
                        var price = (per_day*diffDays);
                        var s_fee = 200; var total = price + s_fee;
                        $('#price').html('$'+price);
                        $('#total_price').html('$'+total);
                        $('#t_price').html('$'+total);
                        $('#due').html('$'+total);
                      
                    }
                }
            });
 //DATE
  </script>




<!-- LOGIN MODAL -->
  <div  class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content" style="max-width: 620px;border-radius: 2px;">
      <div id="header"  class="modal-header">

        <div class="card-header w-100">
            <button id="login" onclick="logins()" class="w-25 btn   px-4 mr-2">{{ __('Sign In') }}</button>
            <button  id="register" onclick="registers()" class="w-25 btn  px-4">{{ __('Register') }}</button>

             @if(Session::has('email')) <p class="text-danger ml-5">{{Session::get('email')}} @php Session::forget('email'); @endphp </p> @endif
        </div>

              

        <button type="button" class="m-0 close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    
    
      <div class="modal-body">

         <div id="choose" class="px-0 collapse">
          <h5 class="text-secondary font-weight-bold text-center btn btn-light w-100 m-auto">Please choose the account type!</h5>
          </div> 

        
      <div class="hidden_currency ">

    <div class="row justify-content-center py-3 mb-5">
        <div class="px-0 w-100 py-2">
            <div class="card collapse" id="all_registers">

            <div class="text-center User-Artist-Select">
            <div class="col-md-5"></div>                
            
           <!--  <div class="card-header w-100">
            <button  id="user"onclick="user()" class="w-25 btn  font-weight-bold px-3 mr-2">{{ __('Investor') }}</button>
            <button  id="business" onclick="business()" class="font-weight-bold w-25 btn px-3 mr-2">{{ __("Business") }}</button>

             <button  id="service" onclick="service()" class="font-weight-bold w-25 btn px-3 mr-2">{{ __("Service") }}</button>
            </div> -->

             <div id="errors" class="w-100">
                
            </div> 

             <p id="typeZero" class="font-weight-bold text-center">Register a new account or log in to Jitume</p>
            </div> 

                



                <!-- HIDDEN Investor REG -->


            <!-- TYPES -->    
            <input hidden type="number" value="" id="type"/>
            <div id="types" class="collapse card-header w-100 text-center">

            <button  id="user"onclick="user()" class="w-25 btn  font-weight-bold px-3 mr-2">{{ __('Investor') }}</button>

            
            
            <button  id="business" onclick="business()" class="font-weight-bold w-25 btn px-3 mr-2">{{ __("Business") }}</button>

             <button  id="service" onclick="service()" class="font-weight-bold w-25 btn px-3 mr-2">{{ __("Service") }}</button>
            </div>


            <div class="row collapse" id="skip">
                <div class="col-md-12 ">
                                <p  class="text-center mb-0 mt-2">Or
                                </p>
                            </div>

                            <div class="col-md-12 ">
                                <a href="{{route('home')}}" class="mt-0 w-25 d-block mx-auto btn px-2 py-1 create">
                                    {{ __('Skip') }}
                                </a>
                            </div>

                            <div class="col-md-12 ">
                                <p  class="text-center w-75 mx-auto my-2">To create regular Jitume account and donate/puchase business services
                                </p>
                            </div>
            </div>
            <!-- TYPES --> 



                    <div id="user_reg" class=" card-body">
                    <!-- onsubmit="register_main(event);" -->
                    <form method="POST" action="{{ route('register') }}" id="register_main" enctype="multipart/form-data">
                        @csrf

                    <input hidden id="c_to_action" type="text" class="form-control" name="c_to_action" value="" >

                       
                         <div class="row mb-3">
                            <label for="name" class="col-md-4 col-form-label text-md-left">{{ __('First Name') }} <span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control" name="fname" value="{{ old('fname') }}" required autocomplete="name" autofocus>

                               
                            </div>
                        </div>


                         <div class="row mb-3">
                            <label for="name" class="col-md-4 col-form-label text-md-left">{{ __('Middle Name') }} <span title="Required" class="text-danger"></span></label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="mname" value="{{ old('mname') }}"  autocomplete="name" autofocus>

                               
                            </div>
                        </div>


                         <div class="row mb-3">
                            <label for="name" class="col-md-4 col-form-label text-md-left">{{ __('Last Name') }} <span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="lname" value="{{ old('lname') }}" required autocomplete="name" autofocus>

                               
                            </div>
                        </div>


                        <div class="row mb-3">
                            <label for="name" class="col-md-4 col-form-label text-md-left">{{ __('Gender') }} <span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                               <select required name="gender" class="dropdown-toggle py-1 px-4">
                                <option hidden value="">Select Gender</option>
                                   <option value="M">M</option>
                                    <option value="F">F</option>
                                     <option value="N/A">N/A</option>
                               </select>

                               
                            </div>
                        </div>
           


                        <div class="row mb-3">
                            <label for="email" class="col-md-4 col-form-label text-md-left">{{ __('E-Mail') }} <span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                                
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-left">{{ __('Password') }} <span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                               
                            </div>
                        </div>
                        
                        
                         <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-left">{{ __('Confirm Password') }}<span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password_confirmation" required autocomplete="new-password">

                               
                            </div>
                        </div>



                        <div class="row w-75 m-auto">
                            <div class="col-md-1">
                                <input id="password" type="checkbox" class=" "name="terms" required >     
                            </div>

                            <div class="col-md-10">
                                <p style="font-family:system-ui;" class="text-secondary small mb-0">I have read and agree to the<a class="small d-inline"  target="_black" href="terms">Terms of Use</a> and<a class="small d-inline" target="_black" href="privacy-policy">Privacy Policy</a></p>
                            </div>
                        </div>



                        <div class="row mb-1 w-75 m-auto">
                            <div class="col-md-1">
                                <input id="password" type="checkbox" class=" "name="terms"  >     
                            </div>

                            <div class="col-md-10">
                                <p style="font-family:system-ui;" class="small text-secondary ">I want to receive updates</p>
                            </div>
                        </div>



                        <div class="row mb-3 w-75 m-auto">
                            <!-- <div class="col-md-12">
                                @if(config('services.recaptcha.key'))
                                    <div class="g-recaptcha"
                                        data-sitekey="{{config('services.recaptcha.key')}}">
                                    </div>
                                @endif
                            </div> -->
                        </div>


                        <div class="row mb-4">
                            <div class="col-md-12 ">
                                <button type="submit" class="w-25 d-block mx-auto btn btn-outline-success">
                                    {{ __('Register') }}
                                </button>
                            </div>
                            </div> <hr>
                             
                    </form>


                     <div class="row mb-3 w-75 m-auto">
                            <div class="col-md-12">
                            <a href="{{route('login.facebook')}}" class="social_btn text-light w-100" >
                            <i class="fa fa-facebook-f mr-2 px-1" style="font-size:14px;background: white;color:#3B5998;"></i>Register with Facebook</a >
                            </div>
                        </div>


                         <div class="row mb-3 w-75 m-auto">
                            <div class="col-md-12">
                            <a href="{{route('login.google')}}" class="social_btn2 text-dark w-100" >
                            <i class="fab fa-google mr-2" style="font-size:15px;color:#3B5998;"></i>Register with Google</a >
                            </div>
                        </div>


                </div>

                <!-- HIDDEN USER REG -->




<!-- HIDDEN Investor REG -->

                <div id="investor_reg" class=" collapse card-body">
                    <form method="POST" action="{{route('registerI')}}" enctype="multipart/form-data">
                        @csrf    

                        <div class="row mb-1">
                            <label for="password" class="col-md-4 col-form-label text-md-left">{{ __('Upload Id/Passport') }}<span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                            <div class="upload-btn-wrapper ml-2">
                              <button class="btnUp_listing mr-2"> Id / Passport
                              <img src="images/up.svg" width="24px"> </button>
                              <input required="" type="file" name="id_passport" />
                            </div>

                               
                            </div>
                        </div>


                        <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-left">{{ __('Upload Pin') }}<span title="Required" class="text-danger"></span></label>

                            <div class="col-md-6">
                            <div class="upload-btn-wrapper ml-2">
                              <button class="btnUp_listing mr-2"> Pin
                              <img src="images/up.svg" width="24px"> </button>
                              <input  type="file" name="pin" />
                            </div>

                               
                            </div>
                        </div>
          
                        <div class="row mb-4">
                            <div class="col-md-12 ">
                                <button type="submit" class="mt-3 w-25 d-block mx-auto btn px-2 create">
                                    {{ __('Create account') }}
                                </button>
                            </div>

                            <div class="col-md-12 ">
                                <p  class="text-center mb-0 mt-2">Or
                                </p>
                            </div>

                            <div class="col-md-12 ">
                                <a href="{{route('home')}}" class="py-1 mt-0 w-25 d-block mx-auto btn px-2 create">
                                    {{ __('Skip') }}
                                </a>
                            </div>

                            <div class="col-md-12 ">
                                <p  class="text-center w-75 mx-auto my-2">To create regular Jitume account and donate/puchase business services
                                </p>
                            </div>

                            </div>
                    </form>
                </div>
<!-- HIDDEN Investor REG -->


       <!-- HIDDEN Business REG -->

                <div id="business_reg" class=" collapse card-body">
                    <form method="POST" action="{{route('registerB')}}" enctype="multipart/form-data">
                        @csrf    
          
                       
                        <div class="row mb-4">
                            <div class="col-md-12 ">
                                <button type="submit" class="mt-3 w-25 d-block mx-auto btn px-2 create">
                                    {{ __('Create account') }}
                                </button>
                            </div>

                            <div class="col-md-12 ">
                                <p  class="text-center mb-0 mt-2">Or
                                </p>
                            </div>

                            <div class="col-md-12 ">
                                <a href="{{route('home')}}" class="mt-0 w-25 d-block mx-auto btn px-2 py-1 create">
                                    {{ __('Skip') }}
                                </a>
                            </div>

                            <div class="col-md-12 ">
                                <p  class="text-center w-75 mx-auto my-2">To create regular Jitume account and donate/puchase business services
                                </p>
                            </div>

                            </div>
                    </form>
                </div>
                <!-- HIDDEN Business REG -->


                <!-- HIDDEN SERVICE REG -->

                <div id="serv_reg" class=" collapse card-body">
                    <form method="POST" action="" enctype="multipart/form-data">
                        @csrf    
                     
                        <div class="row mb-4">
                            <div class="col-md-12 ">
                                <button type="submit" class="mt-3 w-25 d-block mx-auto btn px-2 create">
                                    {{ __('Create account') }}
                                </button>
                            </div>

                            <div class="col-md-12 ">
                                <p  class="text-center mb-0 mt-2">Or
                                </p>
                            </div>

                            <div class="col-md-12 ">
                                <a href="{{route('home')}}" class="mt-0 w-25 d-block mx-auto btn px-2 py-1 create">
                                    {{ __('Skip') }}
                                </a>
                            </div>

                            <div class="col-md-12 ">
                                <p  class="text-center w-75 mx-auto my-2">To create regular Jitume account and donate/puchase business services
                                </p>
                            </div>

                            </div>

                              
                    </form>

                </div>
                <!-- HIDDEN SERVICE REG -->

                </div>



 <!-- Logout-->

<form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                        @csrf
                                    </form>



 <!-- HIDDEN login-->  <!-- HIDDEN login-->  <!-- HIDDEN login-->  <!-- login-->

  <div class="card" id="all_logins">

    <!-- <div class="card-header w-100 text-center">
            <button  id="usr_log"onclick="user_log()" class="w-25 btn  font-weight-bold px-3 mr-2">{{ __('Investor') }}</button>
            <button  id="art_log" onclick="business_log()" class="font-weight-bold w-25 btn px-3 mr-2">{{ __("Business") }}</button>

             <button  id="service_log" onclick="service_log()" class="font-weight-bold w-25 btn px-3 mr-2">{{ __("Service") }}</button>

            </div> -->

 <div id="user_log" class="card-body text-center py-0">

                          <form method="POST" class="" action="{{route('login')}}">
                           @csrf

                           <input type="text" hidden name="c_to_action_login" id="c_to_action_login" value="">

                                           <input class=" w-50 d-inline my-2 form-control my-1 px-2 py-1 mr-1" type="email" name="email" placeholder="Enter email" id="inputEmailAddress" 
                                            value=""    />
                                                                       
                                          
                                            <input class=" w-50 d-inline my-2 form-control my-1 px-2 py-1 mr-1" name="password" id="inputPassword" type="password" placeholder="Enter password"
                                            value=""  />
                                            

                                          

                                         <!--  @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                           @enderror -->

                                       
                                           
                                            @if (Route::has('forgetPass')) 
                                            <a href="{{ route('password.request') }}" class="small text">Forgot password ?</a> @endif
                                            
                                            <input  type="submit"class=" d-block w-25 mx-auto my-2 btn btn-outline-success  font-weight-bold " href="" name="Log In" value="Login" />
                    </form>

                    
                    
                   
                        
                       <hr>  <div class="row">
                              <div class="col-sm-12 pr-1">
                    <a href="{{ route('forgot','email') }}" class=" text-responsive font-weight-bold text-info mx-auto my-2 d-inline-block py-0 small">Forgot Password?</a>
                    </div>
                  
                    
                    </div>
                    

                </div>




  <!-- HIDDEN SERVICE LOG -->
  <div id="serv_log" class="collapse card-body text-center py-0">

                    <form action="" method="POST" class="d-inline form-inline" >
                        @csrf
                                  
                                            <input class=" w-50 d-inline my-2 form-control my-1 px-2 py-1 mr-1" type="email" name="email" placeholder="Enter email" id="inputEmailAddress" 
                                            value=""    />
                                                                       
                                          
                                            <input class=" w-50 d-inline my-2 form-control my-1 px-2 py-1 mr-1" name="password" id="inputPassword" type="password" placeholder="Enter password"
                                            value=""  />
                                            

                                          

                                          @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                           @enderror

                                       
                                           
                                            @if (Route::has('forgetPass')) 
                                            <a href="{{ route('password.request') }}" class="small text">Forgot password ?</a> @endif
                                            
                                            <input  type="submit"class=" d-block w-25 mx-auto my-2 btn btn-outline-success  font-weight-bold " href="" name="Log In" value="Login" />
                    </form>
                    
                    @if(Session::has('reset'))<p class="text-light font-weight-bold">{{Session::get('reset')}}  </p>
                      @php Session::forget('reset'); @endphp @endif
                    
                    @if(Session::has('login_success'))
                    <p class="text-success ">{{Session::get('login_success')}}</p>@php Session::forget('login_success'); 
                    @endphp @endif

                   @if(Session::has('login_err'))
                    <p class="text-danger ">{{Session::get('login_err')}}</p>@php Session::forget('login_err'); 
                    @endphp @endif
                        
                     <hr>   <div class="row">
                              <div class="col-sm-12 pr-1">
                    <a href="{{ route('forgot','email') }}" class=" text-responsive font-weight-bold text-info mx-auto my-2 d-inline-block py-0 small">Forgot Password?</a>
                    </div>
                  
                    
                    </div>

                </div>

                <!-- ARTIST LOG -->
                 <div id="artist_log" class="collapse card-body text-center py-0">

                    <form action="{{route('loginB')}}" method="POST" class="d-inline form-inline" >
                        @csrf
                                  
                                            <input class=" w-50 d-inline my-2 form-control my-1 px-2 py-1 mr-1" type="email" name="email" placeholder="Enter email" id="inputEmailAddress" 
                                            value=""    />
                                                                       
                                          
                                            <input class=" w-50 d-inline my-2 form-control my-1 px-2 py-1 mr-1" name="password" id="inputPassword" type="password" placeholder="Enter password"
                                            value=""  />
                                            

                                          

                                          @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                           @enderror

                                       
                                           
                                            @if (Route::has('forgetPass')) 
                                            <a href="{{ route('password.request') }}" class="small text">Forgot password ?</a> @endif
                                            
                                            <input  type="submit"class=" d-block w-25 mx-auto my-2 btn btn-outline-success  font-weight-bold " href="" name="Log In" value="Login" />
                    </form>
                    
                    @if(Session::has('reset'))<p class="text-light font-weight-bold">{{Session::get('reset')}}  </p>
                      @php Session::forget('reset'); @endphp @endif
                    

                   @if(Session::has('login_err'))
                    <p class="text-danger ">{{Session::get('login_err')}}</p>@php Session::forget('login_err'); 
                    @endphp @endif
                        
                     <hr>   <div class="row">
                              <div class="col-sm-12 pr-1">
                    <a href="{{ route('forgot','email') }}" class=" text-responsive font-weight-bold text-info mx-auto my-2 d-inline-block py-0 small">Forgot Password?</a>
                    </div>
                  
                    
                    </div>

                </div>
                <!-- ARTIST -->

            </div>
        </div>
    </div>
  
  </div>
    
    
      </div>
    
    
     
    </div>
  </div>
</div>





<!-- INVEST/Susbcribe LOGIN MODAL --> <!-- INVEST LOGIN MODAL -->  <!-- INVEST LOGIN MODAL -->

  <div  class="modal fade" id="loginmodal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">

         <div class="card-header w-100">
            <button style="border: 1px solid darkblue;background: #72c537;" id="logins" onclick="login()" class=" w-25 btn   px-4 mr-2">{{ __('Log In') }}</button>
            <button style="border: 1px solid darkblue;" id="registers" onclick="register()" class=" w-50 btn  px-4">{{ __('Create Investor Account') }}</button>

             @if(Session::has('email')) <p class="text-danger ml-5">{{Session::get('email')}} @php Session::forget('email'); @endphp </p> @endif
        </div>

              

        <button type="button" class="m-0 close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    
    
      <div class="modal-body">       
      <div class="hidden_currency ">

      <div class="row justify-content-center py-3 ">
        <div class="px-0 w-100 py-2">
            <div class="card collapse" id="all_register">

            <div class=" mt-2 text-center User-Artist-Select">
            <div class="col-md-5"></div>                
                             </div>

                <!-- HIDDEN USER REG -->

                    <div id="user_regs" class=" collapse card-body">
                  <form method="POST" action="{{route('registerI')}}" enctype="multipart/form-data">
                        @csrf    


                        <div class="row mb-3">
                            <label for="name" class="col-md-4 col-form-label text-md-left">{{ __('First Name') }} <span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control" name="fname" value="{{ old('fname') }}" required autocomplete="name" autofocus>

                               
                            </div>
                        </div>


                         <div class="row mb-3">
                            <label for="name" class="col-md-4 col-form-label text-md-left">{{ __('Middle Name') }} <span title="Required" class="text-danger"></span></label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="mname" value="{{ old('mname') }}"  autocomplete="name" autofocus>

                               
                            </div>
                        </div>


                         <div class="row mb-3">
                            <label for="name" class="col-md-4 col-form-label text-md-left">{{ __('Last Name') }} <span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="lname" value="{{ old('lname') }}" required autocomplete="name" autofocus>

                               
                            </div>
                        </div>


           


                        <div class="row mb-3">
                            <label for="email" class="col-md-4 col-form-label text-md-left">{{ __('E-Mail') }} <span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                                
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-left">{{ __('Password') }} <span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                               
                            </div>
                        </div>
                        
                        
                         <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-left">{{ __('Confirm Password') }}<span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password_confirmation" required autocomplete="new-password">

                               
                            </div>
                        </div>


                        <div class="row mb-1">
                            <label for="password" class="col-md-4 col-form-label text-md-left">{{ __('Upload Id/Passport') }}<span title="Required" class="text-danger">*</span></label>

                            <div class="col-md-6">
                            <div class="upload-btn-wrapper ml-2">
                              <button class="btnUp_listing mr-2"> Id / Passport
                              <img src="images/up.svg" width="24px"> </button>
                              <input required="" type="file" name="id_passport" />
                            </div>

                               
                            </div>
                        </div>


                        <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-left">{{ __('Upload Pin') }}<span title="Required" class="text-danger"></span></label>

                            <div class="col-md-6">
                            <div class="upload-btn-wrapper ml-2">
                              <button class="btnUp_listing mr-2"> Pin
                              <img src="images/up.svg" width="24px"> </button>
                              <input  type="file" name="pin" />
                            </div>

                               
                            </div>
                        </div>


                          <div class="row w-75 m-auto">
                            <div class="col-md-1">
                                <input id="password" type="checkbox" class=" "name="terms" required >     
                            </div>

                            <div class="col-md-10">
                                <p style="font-family:system-ui;" class="text-secondary small mb-0">I have read and agree to the<a class="small d-inline"  target="_black" href="terms">Terms of Use</a> and<a class="small d-inline" target="_black" href="privacy-policy">Privacy Policy</a></p>
                            </div>
                        </div>

          
                        <div class="row mb-4">
                            <div class="col-md-12 ">
                                <button type="submit" class="mt-3 w-25 d-block mx-auto btn px-2 create">
                                    {{ __('Create account') }}
                                </button>
                            </div>

                           <!--  <div class="col-md-12 ">
                                <p  class="text-center mb-0 mt-2">Or
                                </p>
                            </div>

                            <div class="col-md-12 ">
                                <a href="{{route('home')}}" class="py-1 mt-0 w-25 d-block mx-auto btn px-2 create">
                                    {{ __('Skip') }}
                                </a>
                            </div> 

                            <div class="col-md-12 ">
                                <p  class="text-center w-75 mx-auto my-2">To create regular Jitume account and donate/puchase business services
                                </p>
                            </div> -->

                            </div>
                    </form>

                </div>

                <!-- HIDDEN USER REG -->

                </div>
                 <!-- Logout-->


<form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                        @csrf
                                    </form>



                <!-- HIDDEN login-->
                <!-- HIDDEN login-->
                <!-- HIDDEN login-->

  <div class="" id="all_logins">

 <div id="user_logs" class="text-center py-0">

                          <form method="POST" class="" action="{{route('login')}}">
                           @csrf

                           <input type="text" hidden name="c_to_action_login2" id="c_to_action_login2" value="">

                                          <div class="row">  <span style="padding-left: 30px;" class="font-weight-bold w-25 mt-3 text-left">Email</span>   <input style="border: 1px solid;" class=" w-50 d-inline my-2 form-control my-1 px-2 py-1 mr-1" type="email" name="email" placeholder="" id="inputEmailAddress" 
                                            value=""    /> </div>
                                                                       
                                          
                                         <div class="row"> <span class=" w-25 mt-3 font-weight-bold">Password</span>  <input style="border: 1px solid;" class=" w-50 d-inline my-2 form-control my-1 px-2 py-1 mr-1" name="password" id="inputPassword" type="password" placeholder=""
                                            value=""  /> </div>
                                            

                                          

                                          @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                           @enderror

                                       
                                           
                                            @if (Route::has('forgetPass')) 
                                            <a href="{{ route('password.request') }}" class="small text">Forgot password ?</a> @endif
                                            
                                            <input  type="submit"class=" d-block w-25 mx-auto my-2 btn loginBtn  font-weight-bold " href="" name="Log In" value="Sign In" />
                    </form>

                    
                    
                   
                        
                       <hr>  <div class="row">
                              <div class="col-sm-12 pr-1">
                    <a href="{{ route('forgot','email') }}" class=" text-responsive font-weight-bold text-info mx-auto my-2 d-inline-block py-0 small">Forgot Password?</a>
                    </div>
                  
                    
                    </div>
                    

                </div>

            </div>
        </div>
    </div>
  
  </div>
    
    
      </div>
    
    
     
    </div>
  </div>
</div>

<!-- INVEST/Susbcribe LOGIN MODAL --> <!-- INVEST LOGIN MODAL -->  <!-- INVEST LOGIN MODAL -->




<script type="text/javascript">
    $('#login').css('background', '#72c537');
    $('#business_reg').hide();
    
    function login(){
    $('#registers').css('background', 'none');    
    $('#logins').css('background', '#72c537');

    $('#user_logs').show();
    $('#all_logins').show();
    $('#user_regs').hide();
    $('#all_register').hide();
    }

    function register(){ 
    $('#logins').css('background', 'none');
    $('#login').css('border', 'none');
    $('#registers').css('background', '#72c537');

    $('#user_logs').hide();
    $('#all_register').show();
    $('#user_regs').show();
    
    }


    function logins(){
    $('#register').css('background', 'none');    
    $('#login').css('background', '#72c537');

    $('#art_log').css('border-bottom', 'none');
    $('#service_log').css('border-bottom', 'none');      
    $('#usr_log').css('border-bottom', '2px solid #72c537');

    $('#user_log').show();
    $('#artist_log').hide();
    $('#serv_log').hide();
    $('#user_reg').hide();
    $('#all_registers').hide();
    $('#all_logins').show();
    }

    function registers(){ 
    $('#login').css('background', 'none');
    $('#register').css('background', '#72c537');

    //$('#user_log').hide();
    $('#all_logins').hide();

    var type = $('#type').val();
    if(type == 1){
    $('#all_registers').show();
    $('#user_reg').hide();
 }
 else{
    $('#all_registers').show();
    $('#user_reg').show();
 }
    
    }


</script>


<script type="text/javascript">
    $('#usr_log').css('border-bottom', '2px solid #72c537');

    function user_log(){
    $('#art_log').css('border-bottom', 'none');
    $('#service_log').css('border-bottom', 'none');      
    $('#usr_log').css('border-bottom', '2px solid #72c537');
    $('#user_log').show();
    $('#artist_log').hide();
     $('#serv_log').hide();
    }

     function business_log(){ 
    $('#usr_log').css('border-bottom', 'none');   
    $('#service_log').css('border-bottom', 'none');   
    $('#art_log').css('border-bottom', '2px solid #72c537');

    $('#artist_log').show();
    $('#user_log').hide();
    $('#serv_log').hide();
    
    }

    function service_log(){ 
    $('#usr_log').css('border-bottom', 'none');   
    $('#art_log').css('border-bottom', 'none');   
    $('#service_log').css('border-bottom', '2px solid #72c537');

    $('#artist_log').hide();
    $('#user_log').hide();
    $('#serv_log').show();
    
    }


</script>


<script type="text/javascript">

    function user(){

    $('#user').css({'background-color' : '#72c537'});
    $('#business').css({'background-color' : ''});
    $('#service').css({'background-color' : ''});

    investor_reg
     $('#investor_reg').show();
     $('#user_reg').hide();
     $('#business_reg').hide();
     $('#serv_reg').hide();

     $('#skip').hide();
    }

    

     function business(){
    $('#business').css({'background-color' : '#72c537'});
    $('#user').css({'background-color' : ''});
    $('#service').css({'background-color' : ''});

    $('#investor_reg').hide();
    $('#user_reg').hide();
    $('#business_reg').show();
    $('#serv_reg').hide();

    $('#skip').hide();
    
    }

    function service(){
    $('#service').css({'background-color' : '#72c537'});
     $('#business').css({'background-color' : ''});
    $('#user').css({'background-color' : ''});

    $('#investor_reg').hide();
    $('#user_reg').hide();
    $('#business_reg').hide();
    $('#serv_reg').show();

    $('#skip').hide();
    
    }


</script>


<script>

     function register_main(e){ 
        e.preventDefault();
            $.ajax({
                url: "register",
                method: "POST",
                data: $('#register_main').serialize(),
                dataType:'json',
                success: function (response) {
                    //console.log(response);
                    $('#user_reg').hide();
                    $('#types').show();
                    document.getElementById('type').value=1;
                    $('#typeZero').hide();
                    $('#header').hide();
                    $('#choose').show();
                    $('#skip').show();

                     $('#errors').html('');

                                       
                },
                error:function(error){
                    var err = JSON.parse(error.responseText);
                    console.log(err.errors);
                    if(err.errors.email)
                    $('#errors').html('<p class="btn btn-light text-center text-danger">'+err.errors.email+'</p>');

                if(err.errors.password)
                    $('#errors').html('<p class="btn btn-light text-center text-danger">'+err.errors.password+'</p>');
                     }

           
            });
 
}

function c_to_action(){
  document.getElementById('c_to_action').value = 'True';
  document.getElementById('c_to_action_login').value = 'True';
}
function c_to_actionS(){
  document.getElementById('c_to_action').value = 'TrueS';
  document.getElementById('c_to_action_login').value = 'TrueS';
}


</script>

<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
</body>
</html>