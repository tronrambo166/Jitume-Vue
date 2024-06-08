@extends('business.layout')

@section('page')
    <div class="container px-0" id="">
        
    
        @if(Session::has('success'))
        <div class="w-50 m-auto alert font-weight-bold alert-info alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{Session::get('success')}}   @php Session::forget('success'); @endphp </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>  @endif

        @if(Session::has('error'))
        <div class="w-50 m-auto alert font-weight-bold text-danger alert-warning alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{Session::get('error')}}   @php Session::forget('error'); @endphp </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>  @endif



        <h3 class="bid_header px-5 w-100 text-left my-0 pb-3 py-2 font-weight-bold">Add Business</h3>  

        @if($connected == 0)
        <div class="row w-75 px-5 my-3">
         <div class="col-sm-12 px-0"> 
            <p class="text-center bg-light p-2 ">Before adding a business, you must onboard to Jitume Stripe platform to receive business milestone payments.</p>
               <a href="{{route('connect.stripe',['id'=>$user_id])}}" class="btn-light border border-dark w-25 m-auto rounded text-center py-1" >Connect to stripe</a>

         </div>
        </div>

        @else

        <div class="row px-5 w-75 my-3 add_form">
         <div class="col-sm-12">                

            <form id="add_listing" action="{{route('create-listing')}}"  method="post" enctype="multipart/form-data">
            @csrf   

          <div class="row" style="display: flex; flex-wrap: nowrap; gap: 30px;">
    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Business Title* </p>
        </label>
        <input onblur="fill(this.value);" class="border w-100 mr-1 input-with-placeholder" style="padding: 10px 15px; height: 45px;" type="text" name="title" id="title" required placeholder="Business Title*" />
    </div>

    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Contact* </p>
        </label>
        <input onblur="fill(this.value);" class="border w-100 mr-1 input-with-placeholder" style="padding: 10px 15px; height: 45px;" type="text" name="contact" id="contact" required placeholder="Contact*" />
    </div>

    <div class="col-md-5">
    <label class="mb-0 w-100">
        <p class="mb-0 d-block w-100 float-left text-left small small_label">Select Category* </p>
    </label>
    <div class="relative">
        <select name="category" class="py-2 pl-10 pr-4 border w-full input-with-placeholder text-slate-300" style="padding: 10px 15px; height: 45px;" required>
            <option hidden>Select Category*</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Arts/Culture">Arts/Culture</option>
            <option value="Auto">Auto</option>
            <option value="Sports/Gaming">Sports/Gaming</option>
            <option value="Real State">Real State</option>
            <option value="Food">Food</option>
            <option value="Legal">Legal</option>
            <option value="Security">Security</option>
            <option value="Media/Internet">Media/Internet</option>
            <option value="Fashion">Fashion</option>
            <option value="Technology/Communications">Technology/Communications</option>
            <option value="Renewable/Energy">Renewable Energy</option>
            <option value="Retail">Retail</option>
            <option value="Finance/Accounting">Finance/Accounting</option>
            <option value="Pets">Pets</option>
            <option value="Domestic (Home Help etc)">Domestic (Home Help etc)</option>
            <option value="Other">Other</option>
        </select>
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        </div>
    </div>
</div>

</div>


              <div class="row my-3 pt-6" style="display: flex; flex-wrap: nowrap; gap: 30px;">
    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Details* </p>
        </label>
        <textarea rows="2" cols="30" class="border w-100 mr-1 input-with-placeholder" style="padding: 10px 15px;" name="details" id="details" required placeholder="Details*"></textarea>
    </div>

    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Yearly Turnover* </p>
        </label>
        <div class="relative">
            <select name="y_turnover" class="py-2 pl-10 pr-4 border w-full input-with-placeholder text-slate-300 appearance-none" style="padding: 10px 15px; height: 45px;" required>
                <option hidden>Yearly Turnover*</option>
                <option value="0-10000">$0-$10000</option>
                <option value="10000-100000">$10000-$100000</option>
                <option value="100000-250000">$100000-$250000</option>
                <option value="250000-500000">$250000-$500000</option>
                <option value="500000-">$500000+</option>
            </select>
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            </div>
        </div>
    </div>

    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Email </p>
        </label>
        <input class="border w-100 mr-1 input-with-placeholder" style="padding: 10px 15px; height: 45px;" type="text" name="contact_mail" id="contact_mail" required placeholder="Email" />
    </div>
</div>

              
<div class="row my-3 pt-6" style="display: flex; flex-wrap: nowrap; gap: 30px;">
    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Cover* </p>
        </label>
        <div class="relative">
            <input id="file-upload" name="image" type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required>
            <label for="file-upload" class="border rounded-lg w-100 flex items-center justify-center input-with-placeholder" style="padding: 10px 15px; height: 45px;">
                Upload <img src="../images/up.png" width="17px" class="ml-2">
            </label>
        </div>
    </div>

    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Location* </p>
        </label>
        <input id="searchbox" onkeyup="suggest(this.value);" class="border w-100 mr-1 input-with-placeholder" style="padding: 10px 15px; height: 45px;" type="text" name="location" required placeholder="Location*" />
        <input type="text" name="lat" id="lat" hidden value="">
        <input type="text" name="lng" id="lng" hidden value="">
    </div>

    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Directors passport/Id No.* </p>
        </label>
        <input class="border w-100 mr-1 input-with-placeholder" style="padding: 10px 15px; height: 45px;" type="text" name="id_no" id="id_no" required placeholder="Directors passport/Id No.*" />
    </div>
</div>


               <div class="row" style="">
                          <div id="result_list" class="" style="display: none;left: 222px;width:35%; top: 230px; z-index: 1000;height: 600px;position: absolute;">
                              
                          </div>
                      </div>



              <div class="row pt-6 " style="display: flex; flex-wrap: nowrap; gap: 30px;">
    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Investment Needed </p>
        </label>
        <input class="border w-100 mr-1 input-with-placeholder" style="padding: 10px 15px; height: 45px;" type="number" max="1000000" name="investment_needed" required placeholder="Investment Needed" />
    </div>

    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Share </p>
        </label>
        <input class="border w-100 mr-1 input-with-placeholder" style="padding: 10px 15px; height: 45px;" type="number" max="100" name="share" id="share" required placeholder="Share" />
    </div>
</div>





              <div class="row my-3 pt-6" style="display: flex; flex-wrap: nowrap; gap: 30px;">
    <div class="col-md-5">
        <label class="mb-0 w-100">
            <p class="mb-0 d-block w-100 float-left text-left small small_label">Individual/Company Tax Pin* </p>
        </label>
        <input class="border w-100 mr-1 input-with-placeholder" style="padding: 10px 15px; height: 45px;" type="text" name="tax_pin" id="tax_pin" required placeholder="Individual/Company Tax Pin*" />
    </div>

    <div class="col-md-8">
        <div class="row mt-3 pt-4 mb-3">
            <div class="col-sm-5">
                <label for="name">
                    <p class="small_label">Set fee for investor to view your full business data?</p>
                </label>
            </div>

            <div class="col-sm-1"></div>

            <div class="col-sm-1 form-check form-switch">
                <input onchange="showAmount();" class="toggole_bar form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked">
            </div>

            <div id="amount_box" class="col-sm-4"></div>
        </div>
    </div>
</div>




              <div class="row my-3 ">
                

                <div class="col-sm-12"> 
                        <div class="row">
                           <div class="col-sm-12"><label class="h5" for="name">
                                <p>Upload mandatory documents below to feature on the platform</p></label>
                               </div></div>
                </div>

                <div id="" class="col-md-4">
                <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">Company/Individual Pin * </p></label>
               
                <div class="upload-btn-wrapper">
                      <label for="file-upload2" class="btnUp_listing">  
                      <img src="../images/up.png" width="17px">Upload </label>
                      <input style="" id="file-upload2" required type="file" name="pin" />
                        <span class="docs_pdf ml-1 font-weight-bold d-block text-success" >Only docs & pdfs</span>
                    </div>
                </div>


                <div id="" class="col-md-5">
                <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">Directors Id/Passport* </p></label>
               
                <div class="upload-btn-wrapper">
                      <label for="file-upload3" class="btnUp_listing"> Upload
                      <img src="../images/up.png" width="17px"> </label>
                      <input style="" id="file-upload3" required="" type="file" name="identification" />
                      <span class="docs_pdf ml-1 font-weight-bold d-block text-success" >Only docs & pdfs</span>
                    </div>
                </div>


                <div id="" class="col-md-5">
                <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">12 Months Financial Statements* </p></label>
               
               <div class="upload-btn-wrapper w-75  d-block">
                      <label for="file-upload4" class="text-center w-100 btnUp_listing">  Upload 
                      <img src="../images/up.png" width="17px"> </label>
                      <input style="" id="file-upload4" required="" type="file" name="yeary_fin_statement" />
                      <span class="docs_pdf ml-1 font-weight-bold d-block text-success" >Only docs & pdfs</span>
                    </div>
                </div>

                </div>


                <div class="row my-3">
                <div id="" class="col-md-5">
                <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">Supporting Business Documents *</p></label>
               
                <div class="upload-btn-wrapper w-75  d-block">
                      <label for="file-upload1" class="text-center w-100 btnUp_listing">  Upload 
                      <img src="../images/up.png" width="17px"> </label>
                      <input style="" id="file-upload1" required="" type="file" name="document" />
                      <span class="docs_pdf ml-1 font-weight-bold d-block text-success" >Only docs & pdfs</span>
                    </div>
                </div>

                <div id="" class="col-md-5">
                <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">Reason for funding </p></label>
               
               <textarea rows="2" cols="30"  class="border w-100  mr-1" type="text" name="reason" id="reason" required ></textarea>
                </div>

                </div>



                <div class="row my-3">
                <div id="" class="col-md-4">
                <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">Supporting Video *</p></label>
               
                <div class="upload-btn-wrapper">
                      <label for="file-upload2" class="btnUp_listing">   Upload
                      <img src="../images/up.png" width="17px"> </label>
                      <input style="" id="file-upload5" type="file" name="video" />
                    </div>
                </div>

                <div id="" class="mt-3 col-md-1 text-center">
                  OR
                </div>

                <div id="" class="col-md-4">
                <label class="mb-0 w-100"><p class="mb-0 d-block w-100 float-left text-left small small_label">Video Link </p></label>
               <input class="border w-100  mr-1" type="text" name="link" id="link" required />

                </div>
               
                </div>

                </div>



                 <div class="row my-5 w-75"> 
                    <a onclick="msg();" id="save" style="width: 99%;" class="proceed_btn primary_bg  pt-3 m-auto btn text-white font-weight-bold">SAVE</a>

                 <button id="save1" style="width:99%;background: #246424;" class="proceed_btn m-auto pt-3 btn text-white font-weight-bold collapse">SAVE</button>
                
                 </div>


            </form>


                    </div>
                  
                    
                </div>
            @endif
                

            </div>


            <div class="clear"></div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>

        <script type="text/javascript">
            function msg() {
                alert('Please select a cover image!');
            }
            


           $('#file-upload').change(function() {
              var i = $(this).prev('label').clone();
              var file = $('#file-upload')[0].files[0].name;
              $(this).prev('label').text(file);

              if(file != null){
                $('#save1').show();
                $('#save').hide();
            }
            else{
                 $('#save').show();
                 $('#save1').hide();
            }
            
            });

           $('#file-upload1').change(function() {
              var i = $(this).prev('label').clone();
              var file = $('#file-upload1')[0].files[0].name;
              $(this).prev('label').text(file);
            });

            $('#file-upload2').change(function() {
              var i = $(this).prev('label').clone();
              var file = $('#file-upload2')[0].files[0].name;
              $(this).prev('label').text(file);
            });

            $('#file-upload3').change(function() {
              var i = $(this).prev('label').clone();
              var file = $('#file-upload3')[0].files[0].name;
              $(this).prev('label').text(file);
            });

            $('#file-upload4').change(function() {
              var i = $(this).prev('label').clone();
              var file = $('#file-upload4')[0].files[0].name;
              $(this).prev('label').text(file);
            });

            $('#file-upload5').change(function() {
              var i = $(this).prev('label').clone();
              var file = $('#file-upload5')[0].files[0].name;
              $(this).prev('label').text(file);
            });
        </script>


  <script type="text/javascript">
  
    function bookForm(shift) {
      $('#choose').hide();
      $('#booking').show();
    }

    function paid_price() {
      $('#paid_price').show();  
    }
     function free_price() {
      $('#paid_price').hide(); 
    }

    function showAmount(){
        if($.trim($("#amount_box").html())=='')
            $('#amount_box').html('<input class="border w-100  mr-1" type="number"  id="investors_fee" required placeholder="amount" name="investors_fee" style="height:32px;" >');
        else $('#amount_box').html('');

    }

  </script>

@endsection



