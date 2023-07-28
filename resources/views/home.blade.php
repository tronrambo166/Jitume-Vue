@extends('layout')

@section('page')
<div class="container px-0">
  <div class="home_bg" style="min-height:700px;">

    <!-- Layout -->
    <div class="row border_dark p-0" style="">
      <div class="col-sm-8">

        <div class="navbar navbar-expand-sm p-0 navy  ">
          <ul class="navbar-nav py-2 ">

            <li class="nav-item py-1 px-3">
              <a href="home"><img class="" src="{{asset('images/logo.png')}}" width="200px" height="65px" style="margin-left: 58px;"></a>
            </li>


            <li class="nav-item py-1 px-3 text-light  "><router-link to="/home" class="font-weight-bold text-light ">Home</router-link></li>

            <li class="nav-item py-1 px-3 text-light  "><router-link to="/services" class="font-weight-bold text-light ">Jitume service</router-link></li>

            <li class="font-weight-bold nav-item py-1 px-3 text-light"><router-link to="/applyShow" class="text-light">Apply for show
              </router-link></li>
          </ul>
        </div>
      </div>



      <div class="col-sm-3">

        @if(Session::has('success'))
        <div class="font-weight-bold card bg-success text-light px-3">
          {{Session::get('success') }} @php Session::forget('success'); @endphp
        </div> @endif




        <ul>
          <li style="list-style-type: none;" class="float-right mt-3 nav-item py-1 px-3 text-light ">
            @guest
            @if (Route::has('login'))

            <a style="background: #ffffff8c;" class=" text-dark d-inline px-3 py-2 d-inline-block text-center" href="{{ route('login') }}"><b>Sign In</b></a> @endif

            @else
            {{-- <a class="w-100 my-0 h5 text-info  d-inline-block text-center" href="{{url('profile/'.$user_id)}}">
            <b>Profile</b></a> --}}

            <div class="text-center w-50 d-inline">
              <a class="text-center w-50 d-inline" href="route('logout')" onclick="event.preventDefault();
                                                this.closest('form').submit();">
                {{ __('Log Out') }}
              </a>
            </div>
            <form class="d-inline" method="POST" action="{{ route('logout') }}">
              @csrf</form>

            @endguest
          </li>

        </ul>



      </div>
      <div class="col-sm-1"> </div>

    </div>

    <!-- Layout -->

    <div class="heading">

      <div class="row " style="">

        <div class=" col-sm-12 text-center image" style="">

          <div class="py-5"></div>
          <div class="mt-5 mb-4 w-50 mx-auto text-center">
            <h2 style="font-size:42px; font-weight: 500px;" class="text-light ">Invest in
              <marquee>Agriculture | Sports/Gaming | Real State | Entertainment | Auto | Finance/Accounting Security | Pets | Domestic Help | Other</marquee>
            </h2>
            <p class="text text-center">Your platform to invest in local Businesses</p>


          </div>

          <form action="search" method="get" class=" w-100">
            <div style="width:85%;" class=" mx-auto text-center row py-4 rounded text-center">

              <div style="border-radius: 35px 0 0 35px;" class="py-2 col-sm-3 bg-white">
                <input id="searchbox" required="" onkeyup="suggest(this.value);" style="border: none;height: 42px;" class="bar bg-white form-control d-inline" type="text" name="search" value="" placeholder="What are you looking for?">
              </div>

              <div style="" class="py-2 col-sm-3 bg-white">
                <input id="searchbox" required="" onkeyup="suggest(this.value);" style="border: none;height: 42px;" class="bar bg-white form-control d-inline" type="text" name="search" value="" placeholder="Location">
              </div>

              <div class="py-2 col-sm-3 bg-white">
                <div class="dropdown">
                  <button class="bar w-100 py-2 btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Category
                  </button>

                  <div style="height: 300px;margin-top: 305px;overflow-y: scroll;" class="dropdown-menu" aria-labelledby="">




                    <p class="font-italic dropdown-item"> <input type="checkbox" name="services[]" value="bouncing castles">
                      <span class="rz-transition"></span>
                      <em> Bouncing Castles</em>
                    </p>
                    <p class="dropdown-item"> <input type="checkbox" name="services[]" value="catering">
                      <span class="rz-transition"></span>
                      <em>Catering</em>
                    </p>
                    <p class="dropdown-item"> <input type="checkbox" name="services[]" value="clowns">
                    </p>



                  </div>
                </div>
              </div>


              <div style="border-radius: 0 35px 35px 0;" class="bg-white col-sm-3 py-2 ">
                <button class="searchListing  float-right" type="submit">Search</button>
              </div>

            </div>





            <div class="row" style="">
              <div id="result_list" class="text-left" style="display: none;width:41%; z-index: 1000;height: 600px;position: absolute; margin-left: -7px;">

              </div>
            </div>

          </form>
        </div>



      </div>





    </div>
  </div>

</div>


<!-- HOW IT WORKS -->
<div class="container-fluid p-0 bg-white">
  <div class="row mt-2 border border-bottom-dark"></div>

  <div class="row w-75 mx-auto my-5 bg-white">
    <div class="col-sm-5 elementor-top-column elementor-element elementor-element-ce6f4c7" data-id="ce6f4c7" data-element_type="column">
      <div class="elementor-column-wrap elementor-element-populated">
        <div class="elementor-widget-wrap">
          <div class="elementor-element elementor-element-ccc6233 elementor-widget elementor-widget-listeo-headline" data-id="ccc6233" data-element_type="widget" data-widget_type="listeo-headline.default">

            <div class="text-dark">
              <h3 style="font-family: system-ui; text-align:left;" class="text-dark headline  headline-aligned-to-left  headline-box "> How It Works? </h3>
            </div>

          </div>

          <div class="elementor-element elementor-element-5df092b elementor-widget elementor-widget-listeo-iconbox" data-id="5df092b" data-element_type="widget" data-widget_type="listeo-iconbox.default">
            <div class="elementor-widget-container">

              <div class="icon-box-v3 row">
                <div class="ibv3-icon col-sm-3">
                  <i class="text-success listeo-svg-icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="42.9" height="40.755" viewBox="0 0 42.9 40.755">
                      <g id="icon" transform="translate(0 -1.5)">
                        <path id="Path_455" data-name="Path 455" d="M48.993,39.806l-4,5.749-2.824-2.317a.715.715,0,1,0-.907,1.1l3.422,2.809a.714.714,0,0,0,.453.163.652.652,0,0,0,.1-.007.716.716,0,0,0,.489-.3l4.443-6.384a.715.715,0,0,0-1.174-.817Z" transform="translate(-11.685 -10.83)" fill="#f82246"></path>
                        <path id="Path_456" data-name="Path 456" d="M33.6,23.665a9.241,9.241,0,0,0-1.525.137,16.368,16.368,0,0,0,2.006-3.985A2.839,2.839,0,0,0,35.75,17.23V14.37a2.851,2.851,0,0,0-.715-1.877V8.69a6.41,6.41,0,0,0-1.5-4.665C32.071,2.349,29.688,1.5,26.455,1.5s-5.616.849-7.084,2.524A6.21,6.21,0,0,0,17.9,7.46a9.287,9.287,0,0,0-4.31-.955c-7.428,0-7.861,6.331-7.865,6.435v3.274A2.489,2.489,0,0,0,5,17.88v2.47a2.551,2.551,0,0,0,.937,1.977A10.958,10.958,0,0,0,8.548,26.82v1.961a1.553,1.553,0,0,1-.837,1.369L2.954,33.134A5.665,5.665,0,0,0,0,38.11v2.715H28.674A9.29,9.29,0,1,0,33.6,23.665ZM10.01,37.795v1.6H1.43V38.11a4.256,4.256,0,0,1,2.246-3.742l4.756-2.984a2.963,2.963,0,0,0,1.545-2.6V26.214L9.75,26a9.524,9.524,0,0,1-2.48-4.258l-.065-.283L6.961,21.3a1.136,1.136,0,0,1-.526-.954V17.88a1.25,1.25,0,0,1,.48-.839l.235-.212V12.981c.013-.205.385-5.046,6.436-5.046a7.444,7.444,0,0,1,4.29,1.175v3.383a2.851,2.851,0,0,0-.715,1.877v2.86a2.875,2.875,0,0,0,.072.638c.019.083.058.159.084.239a2.824,2.824,0,0,0,.126.358l0,0a2.864,2.864,0,0,0,.786.985c0,.014.008.026.011.039.043.164.088.327.137.486l.058.187c.01.033.022.066.033.1.025.077.049.154.075.23.043.125.088.254.14.4.022.059.046.112.069.169.059.149.117.294.179.437.015.034.028.071.043.105l.04.09c.019.041.038.079.056.119.07.153.139.3.21.445.011.023.022.048.034.071.045.089.09.174.135.26.077.147.153.286.229.42.037.066.074.13.11.192.1.176.2.337.3.488.021.032.041.066.061.1.173.268.323.485.448.655l.089.122.051.069v2.366a1.889,1.889,0,0,1-.985,1.659l-1.892,1.032-.464.253-4.023,2.194A6.446,6.446,0,0,0,10.01,37.795Zm1.43,1.6v-1.6a5.017,5.017,0,0,1,2.616-4.407l6.379-3.479a3.32,3.32,0,0,0,1.73-2.915V24.12h0l-.139-.166L22,23.922s-.046-.056-.118-.15l-.014-.017c-.038-.049-.082-.109-.133-.179l0,0c-.107-.148-.24-.34-.389-.572l-.01-.016c-.07-.11-.144-.229-.22-.355L21.1,22.6c-.162-.271-.333-.578-.5-.917h0c-.091-.182-.182-.374-.27-.573h0l-.037-.083h0c-.039-.089-.079-.183-.119-.28l-.043-.107c-.037-.094-.075-.188-.115-.3-.073-.194-.142-.4-.207-.607l-.039-.127c0-.014-.009-.029-.014-.044-.067-.226-.132-.457-.186-.694l-.065-.283-.244-.157a1.426,1.426,0,0,1-.662-1.2V14.37a1.411,1.411,0,0,1,.479-1.055L19.3,13.1V8.4l-.019-.015a4.949,4.949,0,0,1,1.16-3.415c1.185-1.352,3.207-2.037,6.009-2.037s4.81.68,6,2.022a5.033,5.033,0,0,1,1.16,3.6L33.6,13.1l.236.213a1.409,1.409,0,0,1,.479,1.054v2.86A1.422,1.422,0,0,1,33.3,18.588l-.356.109-.114.354a14.968,14.968,0,0,1-2.026,4.085,9.407,9.407,0,0,1-.6.771l-.178.2v.272c-.18.075-.353.164-.527.25-.044.022-.089.042-.133.064-.157.081-.309.167-.46.255-.079.046-.157.094-.235.142-.137.087-.274.174-.406.267-.086.06-.168.125-.252.189q-.31.234-.6.493c-.092.083-.186.164-.275.25s-.2.2-.3.307c-.082.087-.163.175-.242.266-.094.109-.188.218-.277.33-.074.093-.142.189-.212.284q-.223.3-.422.627c-.062.1-.127.2-.184.3-.072.127-.137.258-.2.389-.054.106-.105.212-.155.321-.059.13-.117.26-.17.393s-.1.265-.146.4c-.054.155-.107.311-.152.47-.057.2-.109.4-.154.6-.022.1-.04.206-.059.31q-.05.273-.084.551c-.011.092-.023.184-.031.278-.027.279-.044.559-.044.842a9.234,9.234,0,0,0,.047.925c.011.116.034.228.05.342.026.188.049.376.086.561.025.125.061.247.091.37.041.171.08.342.132.511.035.114.079.224.118.336.06.174.119.348.19.518.039.1.086.186.129.279.082.182.166.363.26.538.041.077.088.15.132.226.106.185.213.368.332.546.044.065.092.127.137.191.126.179.255.356.394.526.051.063.107.122.16.183.111.129.217.26.335.383H11.44ZM33.6,40.825A7.817,7.817,0,0,1,29.238,39.5a7.91,7.91,0,0,1-.695-.526c-.077-.066-.15-.136-.225-.2-.141-.128-.277-.26-.408-.4-.084-.088-.164-.177-.244-.268-.117-.135-.227-.275-.335-.417-.069-.091-.139-.179-.2-.272a7.972,7.972,0,0,1-.44-.71c-.031-.057-.055-.117-.084-.175-.1-.2-.2-.412-.288-.625-.037-.093-.069-.188-.1-.282-.067-.187-.129-.378-.182-.57-.027-.1-.054-.2-.077-.3-.048-.2-.085-.41-.117-.618-.014-.089-.031-.177-.041-.267a8.118,8.118,0,0,1-.056-.906c0-.242.015-.482.036-.719.008-.084.019-.168.03-.252.019-.15.041-.3.068-.446.019-.1.037-.2.059-.3.029-.129.063-.255.1-.38.029-.1.055-.21.089-.314.061-.191.131-.379.207-.563.051-.125.11-.247.168-.368.038-.081.075-.161.116-.24.062-.122.129-.241.2-.359.043-.074.087-.146.132-.217.074-.118.148-.236.228-.35.041-.058.085-.113.127-.17a7.871,7.871,0,0,1,.536-.647c.044-.047.085-.1.13-.143.1-.1.2-.2.3-.293.059-.055.119-.111.181-.164q.161-.14.33-.272c.057-.044.116-.087.174-.13.124-.092.25-.183.38-.267l.028-.017a7.856,7.856,0,0,1,1.583-.781c.047-.017.094-.036.142-.052l.211-.074A7.865,7.865,0,1,1,33.6,40.825Z" fill="#f82246"></path>
                      </g>
                    </svg></i>
                </div>
                <div class="ibv3-content col-sm-9">
                  <h4>Create an Account</h4>
                  <p>Create an Account as as Investor or Business Owner</p>
                </div>
              </div>

            </div>
          </div>
          <div class="elementor-element elementor-element-9169400 elementor-widget elementor-widget-listeo-iconbox" data-id="9169400" data-element_type="widget" data-widget_type="listeo-iconbox.default">
            <div class="elementor-widget-container">

              <div class="icon-box-v3 row">
                <div class="ibv3-icon col-sm-3">
                  <i class="listeo-svg-icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="42.019" height="39.841" viewBox="0 0 42.019 39.841">
                      <g id="calendar" transform="translate(0 -12)">
                        <path id="Path_447" data-name="Path 447" d="M38.434,14.9h-1.5v-.771a2.133,2.133,0,1,0-4.265,0V14.9H9.348v-.771a2.133,2.133,0,1,0-4.265,0V14.9h-1.5A3.589,3.589,0,0,0,0,18.489V48.256a3.589,3.589,0,0,0,3.585,3.585h34.85a3.589,3.589,0,0,0,3.585-3.585V18.489A3.589,3.589,0,0,0,38.434,14.9Zm-4.4-.771a.771.771,0,0,1,1.543,0V15.58s0,0,0,.005,0,0,0,.005v1.447a.771.771,0,1,1-1.543,0ZM7.215,13.361a.772.772,0,0,1,.771.771v2.9a.771.771,0,1,1-1.543,0V15.59s0,0,0-.005,0,0,0-.005V14.133A.772.772,0,0,1,7.215,13.361ZM38.434,50.48H3.585a2.226,2.226,0,0,1-2.223-2.223V22.074H6.489a.681.681,0,0,0,0-1.361H1.361V18.489a2.226,2.226,0,0,1,2.223-2.223h1.5v.771a2.133,2.133,0,0,0,4.265,0v-.771H32.671v.771a2.133,2.133,0,0,0,4.265,0v-.771h1.5a2.226,2.226,0,0,1,2.223,2.223v2.223H36.983a.681.681,0,1,0,0,1.361h3.675V48.256A2.226,2.226,0,0,1,38.434,50.48Z" transform="translate(0 0)" fill="#f82246"></path>
                        <path id="Path_448" data-name="Path 448" d="M354.133,108h-1.452a.681.681,0,0,0,0,1.361h1.452a.681.681,0,1,0,0-1.361Z" transform="translate(-320.056 -87.288)" fill="#f82246"></path>
                        <path id="Path_449" data-name="Path 449" d="M117.688,108.681a.681.681,0,0,0-.681-.681H96.678a.681.681,0,0,0,0,1.361h20.329A.681.681,0,0,0,117.688,108.681Z" transform="translate(-87.285 -87.288)" fill="#f82246"></path>
                        <path id="Path_450" data-name="Path 450" d="M131.793,170.513h-5.107a.516.516,0,0,1-.492-.358l-1.578-4.857h0a1.879,1.879,0,0,0-3.574,0l-1.578,4.857a.516.516,0,0,1-.492.358h-5.107a1.879,1.879,0,0,0-1.1,3.4l4.131,3a.516.516,0,0,1,.188.579l-1.578,4.857a1.879,1.879,0,0,0,2.891,2.1l4.131-3a.516.516,0,0,1,.609,0l4.131,3a1.851,1.851,0,0,0,2.209,0,1.851,1.851,0,0,0,.683-2.1l-1.578-4.857a.516.516,0,0,1,.188-.579l4.131-3a1.879,1.879,0,0,0-1.1-3.4Zm.3,2.3-4.131,3a1.874,1.874,0,0,0-.683,2.1l1.578,4.857a.518.518,0,0,1-.8.579l-4.131-3a1.874,1.874,0,0,0-2.209,0l-4.131,3a.518.518,0,0,1-.8-.579l1.578-4.857a1.874,1.874,0,0,0-.683-2.1l-4.131-3a.518.518,0,0,1,.3-.936h5.107a1.874,1.874,0,0,0,1.787-1.3l1.578-4.857a.518.518,0,0,1,.985,0l1.578,4.857a1.874,1.874,0,0,0,1.787,1.3h5.107a.517.517,0,0,1,.3.936Z" transform="translate(-101.82 -138.205)" fill="#f82246"></path>
                        <path id="Path_451" data-name="Path 451" d="M249.4,267.88a4.772,4.772,0,0,0-1.657,5.1.681.681,0,1,0,1.308-.378,3.411,3.411,0,0,1,1.185-3.647.681.681,0,0,0-.836-1.075Z" transform="translate(-225.083 -232.527)" fill="#f82246"></path>
                        <path id="Path_452" data-name="Path 452" d="M225.319,238.4a.681.681,0,1,0-1.28.463,4.772,4.772,0,0,0,.868,1.49.681.681,0,0,0,1.033-.886A3.413,3.413,0,0,1,225.319,238.4Z" transform="translate(-203.669 -205.443)" fill="#f82246"></path>
                      </g>
                    </svg></i>
                </div>
                <div class="ibv3-content col-sm-9">
                  <h4>Add/Invest in a Listing</h4>
                  <p>Add a Listing( Your Business) or Invest in a listing</p>
                </div>
              </div>
            </div>
          </div>
          <div class="elementor-element elementor-element-b9196ce elementor-widget elementor-widget-listeo-iconbox" data-id="b9196ce" data-element_type="widget" data-widget_type="listeo-iconbox.default">
            <div class="elementor-widget-container">
              <div class="icon-box-v3 row">
                <div class="ibv3-icon col-sm-3">
                  <i class="listeo-svg-icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="42.019" height="39.841" viewBox="0 0 42.019 39.841">
                      <g id="calendar" transform="translate(0 -12)">
                        <path id="Path_447" data-name="Path 447" d="M38.434,14.9h-1.5v-.771a2.133,2.133,0,1,0-4.265,0V14.9H9.348v-.771a2.133,2.133,0,1,0-4.265,0V14.9h-1.5A3.589,3.589,0,0,0,0,18.489V48.256a3.589,3.589,0,0,0,3.585,3.585h34.85a3.589,3.589,0,0,0,3.585-3.585V18.489A3.589,3.589,0,0,0,38.434,14.9Zm-4.4-.771a.771.771,0,0,1,1.543,0V15.58s0,0,0,.005,0,0,0,.005v1.447a.771.771,0,1,1-1.543,0ZM7.215,13.361a.772.772,0,0,1,.771.771v2.9a.771.771,0,1,1-1.543,0V15.59s0,0,0-.005,0,0,0-.005V14.133A.772.772,0,0,1,7.215,13.361ZM38.434,50.48H3.585a2.226,2.226,0,0,1-2.223-2.223V22.074H6.489a.681.681,0,0,0,0-1.361H1.361V18.489a2.226,2.226,0,0,1,2.223-2.223h1.5v.771a2.133,2.133,0,0,0,4.265,0v-.771H32.671v.771a2.133,2.133,0,0,0,4.265,0v-.771h1.5a2.226,2.226,0,0,1,2.223,2.223v2.223H36.983a.681.681,0,1,0,0,1.361h3.675V48.256A2.226,2.226,0,0,1,38.434,50.48Z" transform="translate(0 0)" fill="#f82246"></path>
                        <path id="Path_448" data-name="Path 448" d="M354.133,108h-1.452a.681.681,0,0,0,0,1.361h1.452a.681.681,0,1,0,0-1.361Z" transform="translate(-320.056 -87.288)" fill="#f82246"></path>
                        <path id="Path_449" data-name="Path 449" d="M117.688,108.681a.681.681,0,0,0-.681-.681H96.678a.681.681,0,0,0,0,1.361h20.329A.681.681,0,0,0,117.688,108.681Z" transform="translate(-87.285 -87.288)" fill="#f82246"></path>
                        <path id="Path_450" data-name="Path 450" d="M131.793,170.513h-5.107a.516.516,0,0,1-.492-.358l-1.578-4.857h0a1.879,1.879,0,0,0-3.574,0l-1.578,4.857a.516.516,0,0,1-.492.358h-5.107a1.879,1.879,0,0,0-1.1,3.4l4.131,3a.516.516,0,0,1,.188.579l-1.578,4.857a1.879,1.879,0,0,0,2.891,2.1l4.131-3a.516.516,0,0,1,.609,0l4.131,3a1.851,1.851,0,0,0,2.209,0,1.851,1.851,0,0,0,.683-2.1l-1.578-4.857a.516.516,0,0,1,.188-.579l4.131-3a1.879,1.879,0,0,0-1.1-3.4Zm.3,2.3-4.131,3a1.874,1.874,0,0,0-.683,2.1l1.578,4.857a.518.518,0,0,1-.8.579l-4.131-3a1.874,1.874,0,0,0-2.209,0l-4.131,3a.518.518,0,0,1-.8-.579l1.578-4.857a1.874,1.874,0,0,0-.683-2.1l-4.131-3a.518.518,0,0,1,.3-.936h5.107a1.874,1.874,0,0,0,1.787-1.3l1.578-4.857a.518.518,0,0,1,.985,0l1.578,4.857a1.874,1.874,0,0,0,1.787,1.3h5.107a.517.517,0,0,1,.3.936Z" transform="translate(-101.82 -138.205)" fill="#f82246"></path>
                        <path id="Path_451" data-name="Path 451" d="M249.4,267.88a4.772,4.772,0,0,0-1.657,5.1.681.681,0,1,0,1.308-.378,3.411,3.411,0,0,1,1.185-3.647.681.681,0,0,0-.836-1.075Z" transform="translate(-225.083 -232.527)" fill="#f82246"></path>
                        <path id="Path_452" data-name="Path 452" d="M225.319,238.4a.681.681,0,1,0-1.28.463,4.772,4.772,0,0,0,.868,1.49.681.681,0,0,0,1.033-.886A3.413,3.413,0,0,1,225.319,238.4Z" transform="translate(-203.669 -205.443)" fill="#f82246"></path>
                      </g>
                    </svg></i>
                </div>
                <div class="ibv3-content col-sm-9">
                  <h4>Apply For Jitume Show</h4>
                  <p>You can a apply for a chance to get covered in the JITUME SHOW</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-1"></div>


    <div class="col-sm-6 elementor-top-column elementor-element elementor-element-bcc00b2" data-id="bcc00b2" data-element_type="column">
      <div class="elementor-column-wrap elementor-element-populated">
        <div class="elementor-widget-wrap">
          <div class="elementor-element elementor-element-052ff25 elementor-widget elementor-widget-image" data-id="052ff25" data-element_type="widget" data-widget_type="image.default">
            <div class="elementor-widget-container">
              <div class="elementor-image">
                <img style="width:486px;height: 462px;" decoding="async" width="579" height="551" src="images/howitworks.jpg" class="attachment-large size-large" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row mt-2 border border-bottom-dark"></div>

  <div class="row my-5 w-75 mx-auto">
    <div class="col-sm-6">
      <h1 class="py-4 text-center" style="color: black;font-size:100px; font-weight:bold;">
        THE SHOW
      </h1>
    </div>

    <div class="col-sm-6">
      <video style="width:500px; height:300px;" class="elementor-video" src="https://jitume.com/file/2022/03/Pendeza%20Cut.mp4" controls="" controlslist="nodownload"></video>
    </div>

  </div>



</div>


<script type="text/javascript">
  function guest_div() {
    $('#guest_div').show();
    // body...
  }

  function date_div() {
    $('#date_div').show();
    // body...
  }

  function close_guest() {
    // body...
    $('#guest_div').hide();
  }

  function close_date() {
    // body...
    $('#date_div').hide();
  }
</script>


@endsection