<!DOCTYPE HTML>

<head>
    <script type="module" src="places.js"></script>
    <!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDnKB7p3g8iG6IGE9nXX4PqlZ6EPHNUo3w&callback=initAutocomplete&libraries=places&v=weekly" async ></script> -->

    

    <title>JITUME</title>
    <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">

    <!-- Rating CSS -->
    <link rel="stylesheet" href="rating/css/rates.css" />

    <style type="text/css">
        .btn-success {
            background: #266A2E; /*#72c537;*/
            color: white;
        }
    </style>
    <!-- Rating CSS -->


    <link href="slider/dist/nouislider.css" rel="stylesheet">
    <script src="slider/dist/nouislider.js"></script>

    <!-- <link href='http://fonts.googleapis.com/css?family=Monda' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Doppio+One' rel='stylesheet' type='text/css'> -->

    <link href="{{ asset('/css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/style.css') }}" rel="stylesheet" />

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
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>



</head>



<body class="">

    <div class="app" style="background: white; height:100%;">


        <!-- Layout -->


        <nav class="navbar navbar-expand-lg primary_bg py-1">

            <a href="./"><img class="logo img-fluid pb-0" width="170px" height="45px" src="images/logo.png" ></a>


            <button class="navbar-toggler bg-white text-white mr-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto text-white">
                    <li class="nav-item py-1 active header_btn_width mr-md-2">
                        <router-link to="/home" class="py-1  pr-0 pl-1"> 
                            <div class="d-inline rounded-circle px-2 pb-2 pt-1 mr-1" style="background: #6d8b8291;">
                               <img width="14px" class="" src="images/home-Icon.png" />

                            </div>
                        </router-link>
                    </li>

                    <li class="border-none nav-item py-1 text-light header_btn_width ">
                        <router-link to="/services" class="border-none text-light py-1 px-md-3 ">
                           <div class="d-inline rounded-circle px-2 pb-2 pt-1 mr-1" style="background: #6d8b8291;">
                               <img width="14px" class="" src="images/service-icon.png" />

                           </div>  Services
                        </router-link>
                    </li>
                </ul>

                <div class="clearfix"></div>
                <div class="my-2 my-lg-0 right_bar">
                    <div class="py-1 px-md-3">
                        @if(Auth::check())
                        <div class="ml-3 ml-md-0 d-md-flex">
                            <div class="nav-item ">
                                <a href="{{route('business')}}" class="header_buttons px-sm-3 my-1 mr-2 px-1 py-1"><i class="fa fa-bell"></i></a>
                            </div>
                            <div class="nav-item ">

                                <a href="{{route('service-messages')}}" class="header_buttons px-sm-3 my-1 mr-2 px-1 py-1"><i class="fa fa-envelope"></i></a>
                            </div>

                            <div class="nav-item mr-md-4">
                                <a href="{{route('business')}}" class="header_buttons px-sm-3 my-1 mr-2 px-1 py-1 "><b>Dashboard</b></a>
                            </div>

                            <div class="nav-item">
                            <a  v-if="" onclick="event.preventDefault();
                 document.getElementById('logout-form').submit();" class=" sign_in_btn  px-sm-3 header_buttons my-1 mr-2 px-1 py-1 "><b>Sign Out</b></a>
                            </div>

                        </div>


                        @elseif (Session::has('investor_auth') && Session::get('investor_auth') == true)

                        <div class="ml-3 ml-md-0 d-flex">
                            <div class="nav-item mr-4">

                                <a href="{{route('business')}}" class="header_buttons px-sm-3 my-1 mr-2 px-1 py-1"><b>Dashboard</b></a>
                            </div>

                            <div class="nav-item">
                                <a v-if="" onclick="event.preventDefault();
                             document.getElementById('logout-form').submit();" class="sign_in_btn header_buttons px-sm-3 my-1 mr-2 px-1 py-1"><b>Sign Out</b>
                                </a>
                            </div>

                        </div>

                        @else

                        <div class="ml-3 ml-md-0">

                            <div class="" id="call_to">
                                <a onclick="c_to_action();" data-target="#loginModal" data-toggle="modal" style="color:black;cursor: pointer; " class="header_buttons px-3 my-1 px-1 py-1 mx-1 d-inline-block small text-center"><span id="c_to_ac">
                                        Add Your Business</span></a>
                            </div>


                            <div class="" id="create_investor">
                                <a data-target="#loginmodal2" data-toggle="modal" style="color:black; cursor: pointer; " class="header_buttons px-3 my-1 px-1 py-1 mr-1 ml-3 d-inline-block small text-center"><span id="c_to_ac">Create Investor Account</span></a>
                            </div>

                            <a data-target="#loginModal" data-toggle="modal" class=" sign_in_btn px-3 my-1 mr-1 px-1 py-1 text-center ml-md-3">Sign In</a>


                        </div>





                        @endif

                    </div>
                </div>
            </div>
        </nav>



        <!-- Commenting Previous Navigation Bar -->

        <!-- Layout -->



        <!-- Body -->

        <div class="">

            @if(Session::has('login_err'))
            <div class="w-50 m-auto alert alert-danger alert-dismissible fade show" role="alert">
                <p class="font-weight-bold">{{Session::get('login_err')}} @php Session::forget('login_err'); @endphp </p>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div> @endif


            @if(Session::has('auth_service'))
            <div class="w-50 m-auto alert alert-success alert-dismissible fade show" role="alert">
                <p class="font-weight-bold">{{Session::get('auth_service')}} @php Session::forget('auth_service'); @endphp </p>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            @endif


            @if(Session::has('auth_business'))
            <div class="w-50 m-auto alert alert-success alert-dismissible fade show" role="alert">
                <p class="font-weight-bold">{{Session::get('auth_business')}} @php Session::forget('auth_business'); @endphp </p>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            @endif


            @if(Session::has('auth_investor'))
            <div class="w-50 m-auto alert alert-success alert-dismissible fade show" role="alert">
                <p class="font-weight-bold">{{Session::get('auth_investor')}} @php Session::forget('auth_investor'); @endphp </p>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            @endif


            @if(Session::has('login_success'))

            <!-- Pop up Modal -->
            <div class="success_message modal" style="display:block;" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content popup_success">

                        <div class="modal-body">
                            <h2 class="my-4 modal-title text-center w-100" id="exampleModalLabel">Thank You!</h2>

                            <p class="text-center">{{Session::get('login_success')}} @php Session::forget('login_success'); @endphp</p>
                        </div>
                        <div class="modal-footer">
                            <button onclick="popupClose();" type="button" class="w-50 py-2 my-3 h5 m-auto btn text-white" style="background:green;font-size: 18px;" data-dismiss="modal">Ok</button>

                        </div>
                    </div>
                </div>
            </div>
            <!-- Pop up Modal -->

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
        <p class="text-light font-weight-bold">{{Session::get('reset')}} @php Session::forget('reset'); @endphp </p>
        @endif


        @if(Session::has('loginFailed'))
        <p style="position: absolute;background: chartreuse;right: 0px;border-radius: 10px;" class="mb-3 text-danger font-weight-bold float-right">{{Session::get('loginFailed')}} @php Session::forget('loginFailed'); @endphp </p>
        @endif


        @if(Session::has('Stripe_pay'))
        <!-- Pop up Modal -->
        <div class="success_message modal" style="display:block;" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content popup_success">

                    <div class="modal-body">
                        <h2 class="my-4 modal-title text-center w-100" id="exampleModalLabel">Success</h2>

                        <p class="text-center">{{Session::get('Stripe_pay')}} @php Session::forget('Stripe_pay'); @endphp</p>
                    </div>
                    <div class="modal-footer">
                        <button onclick="popupClose();" type="button" class="w-50 py-2 my-3 h5 m-auto btn text-white" style="background:green;font-size: 18px;" data-dismiss="modal">Ok</button>

                    </div>
                </div>
            </div>
        </div>
        <!-- Pop up Modal -->
        @endif

        <!-- yield('page') -->
        <router-view :auth_user='@json($auth_user)' :app_url='@json($app_url)' :business='@json($business)'></router-view>
        <!-- yield('page') -->

    </div>

    <!-- Vue Body End -->

    <footer id="footer" class="secondary_bg pt-3 text-light ">

        <div class="container-xl row mx-auto my-0 d-flex align-items-center">
           
            <div class="col-12 col-sm-4 d-flex justify-content-start">
                <div class="">
                   <!--  <img style="max-width: 438px;" class="w-100" src="images/logo_footer.png" /> -->

                   <ul class="foot_menu_ui px-5">
                       <li>
                        <a onclick="c_to_actionS();" data-target="#loginModal" data-toggle="modal" class=" " ><span id="c_to_ac">Sign Up/Sign In as A Project Manager</a>
                       </li>

                       <li>
                        <a onclick="c_to_actionS();" data-target="#loginModal" data-toggle="modal" class=" " ><span id="c_to_ac">Add a Business Service</a>
                       </li>

                       <li><a class="foot_menu" href="">How It Works</a></li>

                       <!-- <li><a class="foot_menu" href="">FAQs</a></li>

                       <li><a class="foot_menu" href="">Contact Us</a></li>

                       <li><a class="foot_menu" href="">Help</a></li> -->

                   </ul>
                </div>
            </div>

                <div class="col-12 col-sm-4 text-sm-center">
                <div class="">
                   <ul class="foot_menu_ui px-5">

                       <li><a class="foot_menu" href="">FAQs</a></li>

                       <li><a class="foot_menu" href="">Contact Us</a></li>

                       <li><a class="foot_menu" href="">Help</a></li>

                   </ul>
                   </div>
                </div>

            <div class="col-12 col-sm-4 pt-2 text-sm-right">
                    <div class="py-0">
                        <ul class="foot_menu_ui mb-1 px-5">
                        <li>
                              <a href="./policy" target="_blank" class="text-light font-weight-bold d-block">Privacy Policy</a>
                              </li>
                              
                              <li>
                              
                                <a href="./terms" target="_blank" class="text-light font-weight-bold">Terms and Conditions</a>
                              </li> 
                              </ul>
                    </div>

                    <div class="px-5 d-flex flex-wrap pb-2 justify-content-end social">
                    <a class="" href="twitter.com" target="_black">
                        <img width="31px" src="images/randomIcons/twitter.png" class="rounded p-1"></a>

                    <a href="twitter.com" target="_black">
                        <img width="31px" src="images/randomIcons/instagram.png" class="rounded p-1"></a>

                    <a href="twitter.com" target="_black">
                        <img width="31px" src="images/randomIcons/facebook.png" class="rounded p-1">
                    </a>

                    <a href="twitter.com" target="_black">
                        <img width="31px" src="images/randomIcons/youtube.png" class="rounded p-1">
                    </a>

                    <!-- <ul class="text-light px-2">
                    <h3 class="h3">Contact Us</h3>
                    <li style="list-style-type:none;">
                        <a class="footer_txt px-0 text-light d-inline small" href="mailto:info@thedtagency.com"> E-Mail: info@thedtagency.com</a>
                    </li>
                </ul>  -->

                </div>   
          
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





    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="js/openMap.js"> </script>
    
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <!-- <script src="https://code.jquery.com/jquery-3.6.0.js"></script> -->


    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

    <script src="slider/dist/nouislider.js"></script>


    <script type="text/javascript">
        function suggest(search) {
            $("#result_list").html('');
            var searchText = search;

            $.ajax({
                url: 'https://photon.komoot.io/api/?q=' + encodeURIComponent(searchText),
                method: 'get',
                dataType: 'json',
                success: function(response) {
                    //console.log(response.features);
                
                    for (i = 0; i < 10; i++) { //console.log(response.features[i].name);
                        var name = response.features[i].properties.name;
                        var city = response.features[i].properties.city;
                        if(city == null || city == 'undefined')
                        city = '';
                        var country = response.features[i].properties.country;
                        var lng = response.features[i].geometry.coordinates[0];
                        var lat = response.features[i].geometry.coordinates[1];

                        $("#result_list").show();
                            if(i<10)

                            if(city == '')
                            $("#result_list").append(' <div onclick="address(\'' + name + ','  + country + '\', \'' + lat + '\', \'' + lng + '\');" style="" data-id="' + name + '" class="address  py-1 px-1 my-0 border-top bg-white single_comms">  <p class="h6 text-dark d-inline" ><i class="fa fa-map-marker mr-1 text-dark" aria-hidden="true"></i> ' + name + '</p> <p  class="d-inline text-dark"><small>, ' + country + '</small> </p> </div>');
                            else
                            $("#result_list").append(' <div onclick="address(\'' + name + ','+ city + ','  + country + '\', \'' + lat + '\', \'' + lng + '\');" style="" data-id="' + name + '" class="address  py-1 px-1 my-0 border-top bg-white single_comms">  <p class="h6 text-dark d-inline" ><i class="fa fa-map-marker mr-1 text-dark" aria-hidden="true"></i> ' + name + '</p> <p  class="d-inline text-dark"><small>, ' + city + ',' + country + '</small> </p> </div>');


                        }
                        //document.getElementById('result_list').style.overflowY="scroll";                      
                },
                error: function(error) {
                    console.log(error);
                }

            });

        }
    </script>



    <script type="text/javascript" src="js/app.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" integrity="sha512-VEd+nq25CkR676O+pLBnDW09R7VQX9Mdiij052gVCp5yVH3jGtH70Ho/UUv4mJDsEdTvqRCFZg0NKGiojGnUCw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>


    <script src="https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.datatables.net/1.10.20/js/dataTables.bootstrap4.min.js" crossorigin="anonymous"></script>



    <script type="text/javascript">
        function address(place,lat2,lng2) {
            document.getElementById('searchbox').value = place;
            //$("#result_list").html('');
            document.getElementById("result_list").style.display = 'none';

              const lat = document.getElementById('lat');
              const lng = document.getElementById('lng');

              lat.value = lat2;
              lng.value = lng2;

        }
    </script>

    <!-- DATEPICKER -->
    <link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
    <!-- <link rel="stylesheet" href="/resources/demos/style.css"> -->
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
    <!-- DATEPICKER -->

    <!-- Price SLIDER -->



    <script type="text/javascript"></script>
    <!-- Price SLIDER -->

    <script>
        $(function() {
            //DATE
            $("#datepicker").datepicker();
            $("#datepicker3").datepicker();
            $("#datepicker4").datepicker();
            $("#datepickerHome1").datepicker();
            $("#datepickerHome2").datepicker();

            //Start
            $("#datepicker").datepicker({
                dateFormat: "yy-mm-dd"
            });
            var dateFormat = $("#datepicker").datepicker("option", "dateFormat");
            $("#datepicker").datepicker("option", "dateFormat", "yy-mm-dd");
            //Min Date
            $("#datepicker").datepicker({
                minDate: new Date()
            });
            var minDate = $("#datepicker").datepicker("option", "minDate");
            $("#datepicker").datepicker("option", "minDate", new Date());

            //End
            $("#datepicker2").datepicker({
                dateFormat: "yy-mm-dd"
            });
            var dateFormat = $("#datepicker2").datepicker("option", "dateFormat");
            $("#datepicker2").datepicker("option", "dateFormat", "yy-mm-dd");
            //Min Date
            $("#datepicker2").datepicker({
                minDate: new Date()
            });
            var minDate = $("#datepicker2").datepicker("option", "minDate");
            $("#datepicker2").datepicker("option", "minDate", new Date());

        });


        //if(currentDate !=null) console.log(currentDate);
    </script>

    <script type="text/javascript">
        //EndDate
        $("#datepicker2").datepicker({
            onSelect: function(date, datepicker) {
                var date_start = $('#datepicker').val();
                if (date != "") {
                    if (date_start > date)
                        alert('End date cannot be earlier than start date!!')
                    const date1 = new Date(date_start);
                    const date2 = new Date(date);
                    const diffTime = Math.abs(date2 - date1);
                    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    diffDays = diffDays + 1;
                    $('#days').html(diffDays);

                    var per_day = $('#per_day').val();
                    var price = (per_day * diffDays);
                    var s_fee = 200;
                    var total = price + s_fee;
                    $('#price').html('$' + price);
                    $('#total_price').html('$' + total);
                    $('#t_price').html('$' + total);
                    $('#due').html('$' + total);

                }
            }
        });
        //DATE
    </script>




    <!-- LOGIN MODAL -->
    <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" style="width: 585px;border-radius: 20px;">

                 <button type="button" class="m-0 close float-left text-left d-inline-block pt-2 pl-3 h3" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>

                <div id="header" class="py-0 m-auto modal-header" style="width: 75%; border-bottom:1px solid #66666630;">

                    <div class="d-block mx-auto my-3 rounded-circle border-bottom text-center" style="background: #C4C4C4">
                        <div class="mini_logo rounded-circle p-2">
                             <img width="31px" class=" pl-1" src="images/randomIcons/mini_logo.png">
                        </div>
                       
                    </div>
                </div>


                <div class="m-auto modal-body text-center" style="width: 75%;">

                    <div class="card-header d-block w-50 m-auto">
                        <div class="row">
                            
                        <div class="col-md-6">
                            <button id="login" onclick="logins()" class=" pb-1 font-weight-bold   px-1 ">{{ __('Sign In') }}</button>
                        </div>

                        <div class="col-md-6">
                             <button id="register" onclick="registers()" class=" pb-1  font-weight-bold  px-2">{{ __('Sign Up') }}</button>
                        </div>              

                        @if(Session::has('email')) <p class="text-danger ml-5">{{Session::get('email')}} @php Session::forget('email'); @endphp </p> @endif

                        </div>
                    </div>


                   <!--  <div id="choose" class="px-0 collapse">
                        <h5 class="text-secondary font-weight-bold text-center btn btn-light w-100 m-auto">Please choose the account type!</h5>
                    </div> -->


                    <div class="hidden_currency ">

                        <div class="row justify-content-center py-2 mb-2">
                            <div class="px-0 w-100 py-0">


                                <div class="collapse" id="all_registers">

                               
                                    <div class="text-center User-Artist-Select">
                                        <a style="cursor: pointer;" id="reg_back" class="float-left bg-light collapse" onclick="step_one();">
                                            <i class="fa fa-arrow-left"></i> back</a>

                                     <div class="col-md-5"></div>
                                      <div id="errors" class="w-100">
                                        </div>
                                        <div class="card-header d-block w-75 mx-auto mt-5 mb-4">
                                            <div class="row">
                                                
                                            <div class="col-md-12 text-center sinup_text">
                                                <h2 class="">Registration</h2>
                                                <h4 >Step <span id="steps">1 </span> of 2</h4>
                                            </div>

                                            

                                            </div>
                                        </div>
                                    </div>





                                    <!-- User REG -->

                                    <div id="user_reg" class="px-4 card-body">
                                        <!-- onsubmit="register_main(event);" -->
                                        <form method="POST" action="{{ route('register') }}" id="register_main" enctype="multipart/form-data">
                                            @csrf

                                        <div class="" id="step_one">

                                            <input hidden id="c_to_action" type="text" class="form-control" name="c_to_action" value="">

                                            <div class="row">
                                            <div id="form_fields" class="col-md-6">
                                            <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">First Name </p></label>
                                           
                                            <input onkeyup="fill(this.value);" class="border w-100 py-2 mr-1" type="text" name="fname" value="{{ old('fname') }}" id="fname" required />

                                            <span id="er_fname" class="collapse float-left text-danger small">Error: Invalid email</span>
                                            </div>

                                            <div id="form_fields" class="col-md-6">
                                            <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">Middle Name </p></label>
                                           
                                            <input onkeyup="fill(this.value);" class="border w-100 py-2 mr-1" type="text" name="mname" value="{{ old('mname') }}" id="mname" required />

                                            <span id="er_mname" class="collapse float-left text-danger small">Error: Invalid email</span>
                                            </div>

                                            </div>


                                            <div id="form_fields">
                                            <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">Last Name </p></label>
                                           
                                            <input onkeyup="fill(this.value);" class="border w-100 py-2 mr-1" type="text" name="lname" value="{{ old('lname') }}" id="lname" required />

                                            <span id="er_lname" class="collapse float-left text-danger small">Error: Invalid email</span>
                                            </div>


                                           <div class="row my-3 form_fields_black" style="width: 80%;">
                                            <div class="col-md-12">
                                                <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left ">What's your gender?(optional) </p></label>
                                            </div>

                                            <div id="" class="form_fields_black col-md-4">
                                            
                                            <div class="row">
                                            <div class="col-sm-1"><input class="" type="radio" name="gender" value="F" id="F" />
                                             </div>
                                            <div class="col-sm-8">
                                            <label class="mb-0 w-100">
                                                <p class="mb-0 d-block w-100 float-left text-left small">Female
                                            </p></label>                                 
                                            </div>
                                            </div>   
                                            </div>

                                            <div id="" class="form_fields_black col-md-3">
                                            
                                            <div class="row">
                                            <div class="col-sm-1"><input class="" type="radio" name="gender" value="M" id="M" />
                                             </div>
                                            <div class="col-sm-8">
                                            <label class="mb-0 w-100">
                                                <p class="mb-0 d-block w-100 float-left text-left small">Male
                                            </p></label>                                 
                                            </div>
                                            </div>   
                                            </div>

                                            <div id="" class="form_fields_black col-md-5">
                                            
                                            <div class="row">
                                            <div class="col-sm-1"><input class="" type="radio" name="gender" value="N/A" id="N/A" />
                                             </div>
                                            <div class="col-sm-9">
                                            <label class="mb-0 w-100">
                                                <p class="mb-0 d-block w-100 float-left text-left small">Non-Binary
                                            </p></label>                                 
                                            </div>
                                            </div>   
                                            </div>

                                            </div>
                                


                                            <div class="row my-2">
                                            <div class="col-md-12 form_fields_black">
                                                <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left ">What's your date of birth? </p></label>
                                            </div>

                                            <div id="form_fields_black" class="col-md-4">
                                            
                                            <div class="row">
                                            <div class="col-sm-12">
                                            <label class="mb-0 w-100">
                                                <p class="mb-0 d-block w-100 float-left text-left py-1 small">Month
                                            </p></label>                                 
                                            </div>

                                            <div class="col-sm-12">
                                                <select  onchange="fill(this.value);" name="month" id="month" class="text-center dob border w-100 ">
                                                    <option value="">Month</option>
                                                    <option value="01">January</option>
                                                    <option value="02">February</option>
                                                    <option value="03">March</option>
                                                    <option value="04">April</option>
                                                    <option value="05">May</option>
                                                    <option value="06">June</option>
                                                    <option value="07">July</option>
                                                    <option value="08">August</option>
                                                    <option value="09">September</option>
                                                    <option value="10">October</option>
                                                    <option value="11">November</option>
                                                    <option value="12">December</option>
                                                </select>
                                             </div>

                                            </div>   
                                            </div>

                                            <div id="form_fields_black" class="col-md-4">
                                            
                                            <div class="row">
                                            <div class="col-sm-12">
                                            <label class="mb-0 w-100">
                                                <p class="mb-0 d-block w-100 float-left text-left py-1 small">Day
                                            </p></label>                                 
                                            </div>

                                            <div class="col-sm-12">
                                                <select  onchange="fill(this.value);" id="day" name="day" class="text-center dob border w-100 ">
                                                    <option value="">day</option>
                                                    <option value="01">01</option>
                                                    <option value="02">02</option>
                                                    <option value="03">03</option>
                                                    <option value="04">04</option>
                                                    <option value="05">05</option>
                                                    <option value="06">06</option>
                                                    <option value="07">07</option>
                                                    <option value="08">08</option>
                                                    <option value="09">09</option>
                                                    <option value="10">10</option>
                                                    <option value="11">11</option>
                                                    <option value="12">12</option>
                                                    <option value="13">13</option>
                                                    <option value="14">14</option>
                                                    <option value="15">15</option>
                                                    <option value="16">16</option>
                                                    <option value="17">17</option>
                                                    <option value="18">18</option>
                                                    <option value="19">19</option>
                                                    <option value="20">20</option>
                                                    <option value="21">21</option>
                                                    <option value="22">22</option>
                                                    <option value="23">23</option>
                                                    <option value="24">24</option>
                                                    <option value="25">25</option>
                                                    <option value="26">26</option>
                                                    <option value="27">27</option>
                                                    <option value="28">28</option>
                                                    <option value="29">29</option>
                                                    <option value="30">30</option>
                                                    <option value="31">31</option>
                                                    
                                                </select>
                                             </div>

                                            </div>  
                                            </div>

                                            <div id="form_fields_black" class="col-md-4">
                                            
                                            <div class="row">
                                            <div class="col-sm-12">
                                            <label class="mb-0 w-100">
                                                <p class="mb-0 d-block w-100 float-left text-left py-1 small">Year
                                            </p></label>                                 
                                            </div>

                                            <div class="col-sm-12">
                                                <select  onchange="fill(this.value);" id="year" name="year" class="text-center dob border w-100 ">
                                                    <option value="">Year</option>
                                                    <option value="1960">1960</option>
                                                    <option value="1961">1961</option>
                                                    <option value="1962">1962</option>
                                                    <option value="1963">1963</option>
                                                    <option value="1964">1964</option>
                                                    <option value="1965">1965</option>
                                                    <option value="1966">1966</option>
                                                    <option value="1967">1967</option>
                                                    <option value="1968">1968</option>
                                                    <option value="1969">1969</option>
                                                    <option value="1970">1970</option>
                                                    <option value="1971">1971</option>
                                                    <option value="1972">1972</option>
                                                    <option value="1973">1973</option>
                                                    <option value="1974">1974</option>
                                                    <option value="1975">1975</option>
                                                    <option value="1976">1976</option>
                                                    <option value="1977">1977</option>
                                                    <option value="1978">1978</option>
                                                    <option value="1979">1979</option>
                                                    <option value="1980">1980</option>
                                                    <option value="1981">1981</option>
                                                    <option value="1982">1982</option>
                                                    <option value="1983">1983</option>
                                                    <option value="1984">1984</option>
                                                    <option value="1985">1985</option>
                                                    <option value="1986">1986</option>
                                                    <option value="1987">1987</option>
                                                    <option value="1988">1988</option>
                                                    <option value="1989">1989</option>
                                                    <option value="1990">1990</option>
                                                    <option value="1991">1991</option>
                                                    <option value="1992">1992</option>
                                                    <option value="1993">1993</option>
                                                    <option value="1994">1994</option>
                                                    <option value="1995">1995</option>
                                                    <option value="1996">1996</option>
                                                    <option value="1997">1997</option>
                                                    <option value="1998">1998</option>
                                                    <option value="1999">1999</option>
                                                    <option value="2000">2000</option>
                                                    <option value="2001">2001</option>
                                                    <option value="2002">2002</option>
                                                    <option value="2003">2003</option>
                                                    <option value="2004">2004</option>
                                                    <option value="2005">2005</option>
                                                    <option value="2006">2006</option>
                                                    <option value="2007">2007</option>
                                                    <option value="2008">2008</option>
                                                    <option value="2009">2009</option>
                                                    <option value="2010">2010</option>
                                                </select>
                                             </div>

                                            </div>  
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
                                                    <button id="next_reg" onclick="next();" style="width: 99%;" class="d-block mx-auto my-3 pt-3 proceed_btn" disabled> Next </button>
                                                </div>
                                            </div>

                                            </div>
                                            <!-- Step 1 ENDS -->
                                            <input type="number" hidden id="filled" value="">


                    <!-- Step 2 -->
                                            <div id="step_two" class="collapse">

                                            <div id="form_fields">
                                            <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">Email Address</p></label>
                                           
                                            <input onkeyup="fill2(this.value);" onkeyup="email_ck2(this.value);" class="border w-100 py-2 mr-1" type="email" name="email" placeholder="" id="inputEmailAddress2" value="" required />

                                            <span id="er_email2" class="collapse float-left text-danger small">Error: Invalid email</span>
                                            </div>

                                            <div id="form_fields2" class="mt-3">
                                                <label class="mb-0 w-100"><p class="mb-0 d-block w-50 float-left small small_label">Password</p>
                                                    <span id="hideButton3" onclick="passShow3();" class="float-right p-0 w-50 text-right small_label px-2">
                                                     <img id="passIcon3" width="15px" src="images/randomIcons/see.png"> <span id="hide3">Show</span>  
                                                    </span>
                                                </label>
                                           
                                            <input onkeyup="pass_match1(this.value); fill2(this.value);" class="border w-100 py-2 mr-1" name="password" id="inputPassword3" type="password" value="" required />
                                            </div>

                                            <div id="form_fields2" class="my-3">
                                                <label class="mb-0 w-100"><p class="mb-0 d-block w-50 float-left small small_label">Confirm Password</p>
                                                    <span id="hideButton2" onclick="passShow2();" class="float-right p-0 w-50 text-right small_label px-2">
                                                     <img id="passIcon2" width="15px" src="images/randomIcons/see.png"> <span id="hide2">Show</span>  
                                                    </span>
                                                </label>
                                           
                                            <input onkeyup="pass_match2(this.value); fill2(this.value);" class="border w-100 py-2 mr-1" name="password_confirmation" id="inputPassword2" type="password" value="" required />

                                            <span id="er_pass" class="collapse float-left text-danger small">Error: Passwords do not match!</span>

                                            </div>
                                            

                                            <div id="form_fields">
                                            <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label2">By creating an account, you agree to the<a class="small d-inline" target="_black" href="terms">Terms of Use</a> and <a class="small d-inline" target="_black" href="privacy-policy">Privacy Policy</a></p></label>                                            
                                            </div>


                                            <input type="text" id="captcha" hidden value="" name="">
                                            <div id="form_fields4">
                                                <div class="col-md-12 px-0">
                                                    @if(config('services.recaptcha.key'))
                                                        <div class="g-recaptcha" data-callback="thecallback"
                                                            data-sitekey="{{config('services.recaptcha.key')}}">
                                                        </div>
                                                    @endif
                                                </div>                                       </div>

                                            <div class="row my-4">
                                                <div class="col-md-12 ">
                                                    <button id="proceed_reg" type="submit" style="width: 99%;" class="d-block mx-auto my-3 pt-2 proceed_btn text-light " disabled> Register </button>


                                                </div>
                                            </div>

                                        </div>
                    <!-- Step 2 ENDS -->

                                        </form>

                                        <div class="row">
                                            <div class="col-md-4 px-0">
                                                <hr class="thick_border">
                                            </div>
                                            <div class="mb-0 col-md-4 form_fields_black">
                                                <p>Or continue with</p>
                                            </div>
                                            <div class="col-md-4 px-0">
                                                <hr class="thick_border">
                                            </div>
                                        </div>

                                        <div class="row mb-3 w-50 px-4 m-auto">
                                            <div class="col-md-6">
                                                <a href="{{route('login.facebook')}}" class="social_btn text-light">
                                                    <img class="shadow" src="images/randomIcons/fb.png"></a>
                                            </div>
                                        
                                            <div class="col-md-6">
                                                <a href="{{route('login.google')}}" class="social_btn text-dark">
                                                    <img class="shadow" src="images/randomIcons/google.png"></a>
                                            </div>
                                        </div>


                                    </div>

                                 <!-- HIDDEN USER REG -->
                                    
                                </div>



                                <!-- Logout-->

                                <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                    @csrf
                                </form>



                                <!-- HIDDEN login--> <!-- HIDDEN login--> <!-- HIDDEN login--> <!-- login-->

                                <div class="" id="all_logins">
                                    <div id="user_log" class="px-4 py-0">

                                        <div class="card-header d-block w-75 mx-auto mt-5 mb-4">
                                            <div class="row">
                                                
                                            <div class="col-md-12 text-center sign_text">
                                                <h2 class="font-weight-bold">Sign In</h2>
                                                <h4>Enter details to log in</h4>
                                            </div>

                                            

                                            </div>
                                        </div>

                                        <form method="POST" class="" action="{{route('login')}}">
                                            @csrf


                                            <input type="text" hidden name="c_to_action_login" id="c_to_action_login" value="">

                                            <div id="form_fields">
                                                <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">Email Address</p></label>
                                           
                                            <input onkeyup="email_ck(this.value);" class="border w-100 py-2 mr-1" type="email" name="email" placeholder="" id="inputEmailAddress" value="{{ old('email') }}" required />

                                            <span id="er_email" class="collapse float-left text-danger small">Error: Invalid email</span>
                                            </div>

                                            <div id="form_fields2" class="mt-3">
                                                <label class="mb-0 w-100"><p class="mb-0 d-block w-50 float-left small small_label">Password</p>
                                                    <span id="hideButton" onclick="passShow();" class="float-right p-0 w-50 text-right small_label px-2">
                                                     <img id="passIcon" width="15px" src="images/randomIcons/see.png"> <span id="hide">Show</span>  
                                                    </span>
                                                </label>
                                           
                                            <input onkeyup="pass_ck(this.value);" class="border w-100 py-2 mr-1" name="password" id="inputPassword" type="password" value="" required />
                                            </div>




                                            <!--  @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                           @enderror -->
                                           <div class="row">
                                            <div class="col-sm-12 pr-1 text-center">
                                                <a href="{{ route('forgot','email') }}" style="color:black;" class=" text-responsive font-weight-bold mx-auto my-2 d-inline-block py-0 small">Forgot Password?</a>
                                            </div>
                                        </div>


                                            @if (Route::has('forgetPass'))
                                            <a href="{{ route('password.request') }}" class="small text">Forgot password ?</a> @endif

                                            <button id="login_btn" type="submit" style="width: 99%;" class="d-block mx-auto my-3 pt-2 proceed_btn text-light " disabled> Proceed </button>
                                        </form>

                                    </div>   

                                </div>
                            </div>
                        </div>

                    </div>


                </div>



            </div>
        </div>
    </div>





    <!-- INVEST/Susbcribe LOGIN MODAL --> <!-- INVEST LOGIN MODAL --> <!-- INVEST LOGIN MODAL -->

    <div class="modal fade" id="loginmodal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <div class="card-header w-100">
                        <div class="card-header row my-2">
                            <button style="" class="ml-2 w-50 text-center text-dark bg-light font-weight-bold btn px-4 mr-2">{{ __('Join Jitume') }}</button>
                        </div>

                        <button style="border: 1px solid darkblue;background: #72c537;" id="logins" onclick="login()" class=" w-25 btn   px-1 mr-2">{{ __('Log In') }}</button>
                        <button style="border: 1px solid darkblue;width:70%;" id="registers" onclick="register()" class=" btn  px-1 py-2 ">{{ __('Create Investor Account') }}</button>

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
                                        <form method="POST" action="{{route('register')}}" enctype="multipart/form-data">
                                            @csrf

                                    <input hidden type="number" name="investor" value="1">
                                    <input type="text" hidden name="c_to_listing_reg" id="c_to_listing_reg" value="">

                                            <div class="row mb-3">
                                                <label for="name" class="col-md-4 col-form-label text-md-left">{{ __('First Name') }} <span title="Required" class="text-danger">*</span></label>

                                                <div class="col-md-6">
                                                    <input id="name" type="text" class="form-control" name="fname" 
                                                    @if(Session::has('old_fname')) value="{{Session::get('old_fname')}}" @endif required autocomplete="name" autofocus>


                                                </div>
                                            </div>


                                            <div class="row mb-3">
                                                <label for="name" class="col-md-4 col-form-label text-md-left">{{ __('Middle Name') }} <span title="Required" class="text-danger"></span></label>

                                                <div class="col-md-6">
                                                    <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="mname" @if(Session::has('old_mname')) value="{{Session::get('old_mname')}}" @endif autocomplete="name" autofocus>


                                                </div>
                                            </div>


                                            <div class="row mb-3">
                                                <label for="name" class="col-md-4 col-form-label text-md-left">{{ __('Last Name') }} <span title="Required" class="text-danger">*</span></label>

                                                <div class="col-md-6">
                                                    <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="lname" @if(Session::has('old_lname')) value="{{Session::get('old_lname')}}" @endif required autocomplete="name" autofocus>


                                                </div>
                                            </div>





                                            <div class="row mb-3">
                                                <label for="email" class="col-md-4 col-form-label text-md-left">{{ __('E-Mail') }} <span title="Required" class="text-danger">*</span></label>

                                                <div class="col-md-6">
                                                    <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" @if(Session::has('old_email')) value="{{Session::get('old_email')}}" @endif required autocomplete="email">


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

                                            <div class="row mb-3">
                                                <label for="password" class="pr-0 col-md-5 col-form-label text-md-left">{{ __('Enter your passport/Id no*') }}<span title="Required" class="text-danger">*</span></label>

                                                <div class="col-md-5">
                                                    <input required class="text-left form-control" type="text" name="id_no" @if(Session::has('old_id_no')) value="{{Session::get('old_id_no')}}" @endif >


                                                </div>
                                            </div>


                                            <div class="row mb-3">
                                                <label for="password" class="pr-0 col-md-5 col-form-label text-md-left">{{ __('Enter your individual/company tax pin*') }}<span title="Required" class="text-danger">*</span></label>

                                                <div class="col-md-5">
                                                    <input required class="text-left form-control" type="text" name="tax_pin" @if(Session::has('old_tax_pin')) value="{{Session::get('old_tax_pin')}}" @endif >


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
                                                        <input type="file" name="pin" />
                                                    </div>


                                                </div>
                                            </div>



                                            <div class="row mb-3">
                                                <label for="password" class="col-md-4 col-form-label text-md-left">{{ __('Potential Investment Range') }}<span title="Required" class="text-danger"></span></label>

                                                <div class="col-md-6">

                                                    <div class="dropdown show d-block ml-2">
                                                        <a class="mile btn mt-2 py-1 w-75 dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Select
                                                        </a>
                                                        <div class="dropdown-menu py-0" aria-labelledby="dropdownMenuLink">
                                                            <li style="list-style-type: none;" class="mt-3 nav-item p-0 text-secondary">

                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c1');" class="mr-2" type="checkbox" name="inv_range[]" value="0-10000" id="inv_range">$0-$10000</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c1');" class="mr-2" type="checkbox" name="inv_range[]" value="10000-100000">$10000-$100000</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c1');" class="mr-2" type="checkbox" name="inv_range[]" value="100000-250000">$100000-$250000</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c1');" class="mr-2" type="checkbox" name="inv_range[]" value="250000-500000">$250000-$500000</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c1');" class="mr-2" type="checkbox" name="inv_range[]" value="500000-">$500000+</a>

                                                            </li>
                                                        </div>
                                                    </div>
                                                    <p class="text-danger ml-2 small" id="sudo"></p>

                                                </div>

                                            </div>



                                            <div class="row mb-3">
                                                <label for="password" class="col-md-4 col-form-label text-md-left">{{ __('Which industries are you interested in investing?') }}<span title="Required" class="text-danger"></span></label>

                                                <div class="col-md-6">

                                                    <div class="dropdown show d-block ml-2">
                                                        <a class="mile btn mt-2 py-1 w-75 dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Select
                                                        </a>
                                                        <div class="dropdown-menu py-0" aria-labelledby="dropdownMenuLink">
                                                            <li style="list-style-type: none;" class="mt-3 nav-item p-0 text-secondary">

                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Agriculture">Agriculture</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Arts / Culture">Arts/Culture</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Auto">Auto</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Sports/Gaming">Sports/Gaming</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Real State">Real State</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Food">Food</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Legal">Legal</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Security">Security</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Media / Internet">Media/Internet</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Fashion">Fashion</a>

                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Technology / Communications">Technology/Communications</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[][]" value="Retail">Retail</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[]" value="Finance/Accounting">Finance/Accounting</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[]" value="Pets">Pets</a>
                                                                <a class="pr-0 py-1" style="font-size:13px;" class="dropdown-item">
                                                                    <input onchange="inv_record('c2');" class="mr-2" type="checkbox" name="interested_cats[]" value="Domestic (Home Help etc)">Domestic (Home Help etc)</a>

                                                            </li>
                                                        </div>
                                                    </div>
                                                    <p class="text-danger ml-2 small" id="sudo2"></p>

                                                </div>
                                            </div>


                                            <div class="row mb-3">
                                                <label for="password" class="col-md-12 col-form-label text-md-left">{{ __('Please Enter details of your past investments & track records') }}<span title="Required" class="text-danger"></span></label>

                                                <div class="col-md-12">
                                                    <textarea name="past_investment" rows="2" cols="50">
                                                        @if(Session::has('old_past_investment')) value="{{Session::get('old_past_investment')}}" @endif
                                                    </textarea>

                                                </div>
                                            </div>


                                            <div class="row mb-3">
                                                <label for="password" class="col-md-12 col-form-label text-md-left">{{ __('Please Enter your current website or web presence') }}<span title="Required" class="text-danger"></span></label>

                                                <div class="col-md-12">
                                                    <input type="text" name="website" class="w-75" @if(Session::has('old_website')) value="{{Session::get('old_website')}}" @endif />

                                                </div>
                                            </div>




                                            <div class="row w-75">
                                                <div class="col-md-1">
                                                    <input id="password" type="checkbox" class=" " name="terms" required>
                                                </div>

                                                <div class="col-md-10">
                                                    <p style="font-family:system-ui;" class="text-secondary small mb-0">I have read and agree to the<a class="small d-inline" target="_black" href="terms">Terms of Use</a> and<a class="small d-inline" target="_black" href="privacy-policy">Privacy Policy</a></p>
                                                </div>
                                            </div>


                                            <input type="number" hidden id="c1">
                                            <input type="number" hidden id="c2">

                                            <div class="row mb-4">
                                                <div class="col-md-12 text-center">
                                                    <button id="b2" onclick="event.preventDefault();inv_range_check();" class="mt-3 w-25 mx-auto btn px-2 create">
                                                        {{ __('Create account') }}
                                                    </button>

                                                    <button id="b1" type="submit" class="collapse mt-3 w-25 mx-auto btn px-2 create">
                                                        {{ __('Create account') }}
                                                    </button>
                                                </div>





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

                                            <div class="row"> <span style="padding-left: 30px;" class="font-weight-bold w-25 mt-3 text-left">Email</span> <input style="border: 1px solid;" class=" w-50 d-inline my-2 form-control my-1 px-2 py-1 mr-1" type="email" name="email" placeholder="" id="inputEmailAddress" value="" required /> </div>


                                            <div class="row"> <span class=" w-25 mt-3 font-weight-bold">Password</span> <input style="border: 1px solid;" class=" w-50 d-inline my-2 form-control my-1 px-2 py-1 mr-1" name="password" id="inputPassword" type="password" placeholder="" value="" required /> </div>




                                            @error('password')
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror



                                            @if (Route::has('forgetPass'))
                                            <a href="{{ route('password.request') }}" class="small text">Forgot password ?</a> @endif

                                            <input type="submit" class=" d-block w-25 mx-auto my-2 btn primary_bg text-white font-weight-bold " href="" name="Log In" value="Sign In" />
                                        </form>





                                        <hr>
                                        <div class="row">
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

    <!-- INVEST/Susbcribe LOGIN MODAL --> <!-- INVEST LOGIN MODAL --> <!-- INVEST LOGIN MODAL -->




    <script type="text/javascript">
        $('#login').css({borderBottom:'1px solid #083608', color:'#014811', background:'white'});
        $('#logins').css({borderBottom:'1px solid #083608', color:'#014811'});
        $('#register').css({background:'white', border:'none', color:'grey'})
        $('#business_reg').hide();

        function login() {
            $('#register').css({border:'none', color:'black'})
            $('#registers').css({border:'none', color:'black'});
            $('#logins').css({borderBottom:'1px solid #083608', color:'#014811'});
            $('#user_logs').show();
            $('#all_logins').show();
            $('#user_regs').hide();
            $('#all_register').hide();
        }

        function register() {
            $('#logins').css({background:'none', color:'black'});
            $('#login').css({borderBottom:'1px solid white', color:'black'})
            $('#registers').css({borderBottom:'1px solid #014811', color:'#014811'});

            $('#user_logs').hide();
            $('#all_register').show();
            $('#user_regs').show();

        }


        function logins() {
            $('#register').css({border:'none', color:'grey'});
            $('#login').css({borderBottom:'1px solid #014811', color:'#014811'});

            $('#art_log').css('border-bottom', 'none');
            $('#service_log').css('border-bottom', 'none');
            $('#usr_log').css({borderBottom:'1px solid #083608', color:'#083608'});

            $('#user_log').show();
            $('#artist_log').hide();
            $('#serv_log').hide();
            $('#user_reg').hide();
            $('#all_registers').hide();
            $('#all_logins').show();
        }

        function registers() {
            $('#login').css({border:'none', color:'grey'});
            $('#register').css({borderBottom:'1px solid #083608', color:'#083608'});

            //$('#user_log').hide();
            $('#all_logins').hide();

            var type = $('#type').val();
            if (type == 1) {
                $('#all_registers').show();
                $('#user_reg').hide();
            } else {
                $('#all_registers').show();
                $('#user_reg').show();
            }

        }
    </script>


    <script type="text/javascript">
        $('#usr_log').css('border-bottom', '2px solid #083608');

        function user_log() {
            $('#art_log').css('border-bottom', 'none');
            $('#service_log').css('border-bottom', 'none');
            $('#usr_log').css('border-bottom', '2px solid #083608');
            $('#user_log').show();
            $('#artist_log').hide();
            $('#serv_log').hide();
        }

        function business_log() {
            $('#usr_log').css('border-bottom', 'none');
            $('#service_log').css('border-bottom', 'none');
            $('#art_log').css('border-bottom', '2px solid #083608');

            $('#artist_log').show();
            $('#user_log').hide();
            $('#serv_log').hide();

        }

        function service_log() {
            $('#usr_log').css('border-bottom', 'none');
            $('#art_log').css('border-bottom', 'none');
            $('#service_log').css('border-bottom', '2px solid #083608');

            $('#artist_log').hide();
            $('#user_log').hide();
            $('#serv_log').show();

        }
    </script>


    <script type="text/javascript">
        function user() {

            $('#user').css({background:'#083608', color:'white'});
            $('#business').css({
                'backgroundColor': ''
            });
            $('#service').css({
                'backgroundColor': ''
            });

            //investor_reg
            $('#investor_reg').show();
            $('#user_reg').hide();
            $('#business_reg').hide();
            $('#serv_reg').hide();

            $('#skip').hide();
        }



        function business() {
            $('#business').css({
                backgroundColor: '#083608',
                color: 'white'
            });
            $('#user').css({
                backgroundColor: ''
            });
            $('#service').css({
                backgroundColor: ''
            });

            $('#investor_reg').hide();
            $('#user_reg').hide();
            $('#business_reg').show();
            $('#serv_reg').hide();

            $('#skip').hide();

        }

        function service() {
            $('#service').css({background:'#083608', color:'white'});
            $('#business').css({
                'backgroundColor': ''
            });
            $('#user').css({
                'backgroundColor': ''
            });

            $('#investor_reg').hide();
            $('#user_reg').hide();
            $('#business_reg').hide();
            $('#serv_reg').show();

            $('#skip').hide();

        }
    </script>


    <script>
        function register_main(e) {
            e.preventDefault();
            $.ajax({
                url: "register",
                method: "POST",
                data: $('#register_main').serialize(),
                dataType: 'json',
                success: function(response) {
                    //console.log(response);
                    $('#user_reg').hide();
                    $('#types').show();
                    document.getElementById('type').value = 1;
                    $('#typeZero').hide();
                    $('#header').hide();
                    $('#choose').show();
                    $('#skip').show();

                    $('#errors').html('');


                },
                error: function(error) {
                    var err = JSON.parse(error.responseText);
                    console.log(err.errors);
                    if (err.errors.email)
                        $('#errors').html('<p class="btn btn-light text-center text-danger">' + err.errors.email + '</p>');

                    if (err.errors.password)
                        $('#errors').html('<p class="btn btn-light text-center text-danger">' + err.errors.password + '</p>');
                }


            });

        }

        function c_to_action() {
            document.getElementById('c_to_action').value = 'True';
            document.getElementById('c_to_action_login').value = 'True';
        }

        function c_to_actionS() {
            document.getElementById('c_to_action').value = 'TrueS';
            document.getElementById('c_to_action_login').value = 'TrueS';
        }

        function inv_range_check(event) {
            var checked = '';
            [...document.querySelectorAll('input[name="inv_range"]:checked')]
            .forEach((cb) => checked = checked + cb.value + ',');

            var ids = checked;
            if (ids == '') {
                //$.alert({title: 'Alert!',content: 'Please select invest range!',});
                document.getElementById('sudo').innerHTML = 'Please select invest range!';
            }

            [...document.querySelectorAll('input[name="interested_cats"]:checked')]
            .forEach((cb) => checked = checked + cb.value + ',');

            var ids2 = checked;
            if (ids2 == '') {
                //$.alert({title: 'Alert!',content: 'Please select invest range!',});
                document.getElementById('sudo2').innerHTML = 'Please select an industry!';
            }

        }

        function inv_record(c) {
            if (c == 'c1') {
                document.getElementById('c1').value = 1;
                document.getElementById('sudo').innerHTML = '';
            }
            if (c == 'c2') {
                document.getElementById('c2').value = 1;
                document.getElementById('sudo2').innerHTML = '';
            }

            c1 = $('#c1').val();
            c2 = $('#c2').val();
            if (c1 == 1 && c2 == 1) {
                $('#b2').hide();
                $('#b1').show();
            }
        }

        function popupClose() {
            $('.success_message').css('display', 'none');
        }

        function passShow(){
            $('#inputPassword').attr('type','text');
            $('#hideButton').attr("onclick","passHide()");
            document.getElementById("hide").innerHTML="Hide";
            $('#passIcon').attr('src','images/randomIcons/hide.png');
        }
        function passHide(){
            $('#inputPassword').attr('type','password');
            $('#hideButton').attr("onclick","passShow()");
            document.getElementById("hide").innerHTML="Show";
            $('#passIcon').attr('src','images/randomIcons/see.png');
        }


        function email_ck(value) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(regex.test(value) == true)
                $('#er_email').addClass('collapse');
            else
                $('#er_email').removeClass('collapse');
        }


        function pass_ck(value) {
            email = $('#inputEmailAddress').val().length;
            pass = value.length;

            if(email > 9 && pass > 7){
            $('#login_btn').prop("disabled", false);
            $('#login_btn').css('background','#014811');
            }
        }

        function next() {
            $('#step_one').addClass('collapse');
            $('#step_two').removeClass('collapse');
            $('#reg_back').removeClass('collapse');
            document.getElementById('steps').innerHTML = '2';
        }

        function step_one() {
            $('#step_two').addClass('collapse');
            $('#step_one').removeClass('collapse');
            $('#reg_back').addClass('collapse');
            document.getElementById('steps').innerHTML = '1';
        }

        //For Register
        function passShow2(){
            $('#inputPassword2').attr('type','text');
            $('#hideButton2').attr("onclick","passHide2()");
            document.getElementById("hide2").innerHTML="Hide";
            $('#passIcon2').attr('src','images/randomIcons/hide.png');
        }
        function passHide2(){
            $('#inputPassword2').attr('type','password');
            $('#hideButton2').attr("onclick","passShow2()");
            document.getElementById("hide2").innerHTML="Show";
            $('#passIcon2').attr('src','images/randomIcons/see.png');
        }

         function passShow3(){
            $('#inputPassword3').attr('type','text');
            $('#hideButton3').attr("onclick","passHide3()");
            document.getElementById("hide3").innerHTML="Hide";
            $('#passIcon3').attr('src','images/randomIcons/hide.png');
        }
        function passHide3(){
            $('#inputPassword3').attr('type','password');
            $('#hideButton3').attr("onclick","passShow3()");
            document.getElementById("hide3").innerHTML="Show";
            $('#passIcon3').attr('src','images/randomIcons/see.png');
        }

        function email_ck2(value) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(regex.test(value) == true)
                $('#er_email2').addClass('collapse');
            else
                $('#er_email2').removeClass('collapse');
        }

        $('#next_reg').prop("disabled", true);


        function fill(value) {  
            var filled = 0;
            var fname = $('#fname').val();
            var lname = $('#lname').val();
            var mname = $('#mname').val();
            var month = $('#month').val();
            var day = $('#day').val();
            var year = $('#year').val();

            if(fname != '' && lname != '' && mname != '' && month != '' && day != ''
             && year != '')
                filled = 1;  //console.log(filled)

            if(filled == 1){
            $('#next_reg').prop("disabled", false);
            $('#next_reg').css('background','#014811');
            }
            else{
            $('#next_reg').prop("disabled", true);
            $('#next_reg').css('background','#01481140');
            }
        }

        function pass_match1(value) {
            sessionStorage.setItem('pass1',value);
        }
        function pass_match2(value) {
            //var pass1 = sessionStorage.getItem('pass1');
            //if(pass1 =='')
            pass1 = $('#inputPassword3').val();
            var filled = $('#filled').val();

            if(value == pass1){
                 $('#er_pass').addClass('collapse');
            }
            else{
                $('#er_pass').removeClass('collapse');
            }
            
        }


        function fill2(value) {  
            var filled = 0;
            var p1 = $('#inputPassword3').val();
            var mname = $('#inputEmailAddress2').val();
            var p2 = $('#inputPassword2').val();
            var captcha = $('#captcha').val();

            if(p1 != '' && p2 != '' && mname != '' && captcha != '' &&  p1 == p2)
                filled = 1;  console.log(filled+'YES')


            if( filled == 1 ){
            $('#proceed_reg').prop("disabled", false);
            $('#proceed_reg').css('background','#014811');
           
            }
            else{
            $('#proceed_reg').prop("disabled", true);
            $('#proceed_reg').css('background','#01481140');
            
            }
        }

        function thecallback(){ alert('ok');
        document.getElementById('captcha').value = 'true';
        fill2('test');
        }




        

//For Register
    </script>

    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>

    <!-- <script src="/path/to/cdn/jquery.slim.min.js"></script> -->
    <script src="rating/js/jquery-rates.js"></script>
    <script type="text/javascript">

    </script>


<!-- GOOGLE MAP 
<script src="sddjs/map.js"> </script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDnKB7p3g8iG6IGE9nXX4PqlZ6EPHNUo3w&callback=myMap" async ></script>
 GOOGLE MAP -->


<script type="text/javascript">
    if (window.location.hash && window.location.hash == '#_=_') {
        if (window.history && history.pushState) {
            window.history.pushState("", document.title, window.location.pathname);
        } else {
            // Prevent scrolling by storing the page's current scroll offset
            var scroll = {
                top: document.body.scrollTop,
                left: document.body.scrollLeft
            };
            window.location.hash = '';
            // Restore the scroll offset, should be flicker free
            document.body.scrollTop = scroll.top;
            document.body.scrollLeft = scroll.left;
        }
    }

//To refresh the page if back button click after login
    window.addEventListener( "pageshow", function ( event ) {
          var historyTraversal = event.persisted || 
                                 ( typeof window.performance != "undefined" && 
                                      window.performance.navigation.type === 2 );
          if ( historyTraversal ) {
            // Handle page restore.
            window.location.reload();
          }
    });
//To refresh the page if back button click after login

window.addEventListener('load', () => {
  const $recaptcha = document.querySelector('#g-recaptcha-response');
  if ($recaptcha) {
    $recaptcha.setAttribute('required', 'required');
  }
})

</script>

</body>

</html>