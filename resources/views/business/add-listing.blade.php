@extends('business.layout')

@section('page')
    <div class="container" id="">
        
    
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




        <div class="row pt-4 w-75 m-auto">        
                <div class="col-sm-12">
                  

            <form id="add_listing" action="{{route('create-listing')}}"  method="post" enctype="multipart/form-data">
            @csrf   
               
                <div class="row form-group">
                    
                    <div class="col-sm-6"> 
                        <div class="row">
                        
                    <div class="col-sm-12"> 
                    <input required=""  class=" form-control border border-none rounded form-group" type="text" name="title" id="title" placeholder="Business Title"  /> 
                    </div>
                        </div>
                    </div>

                    <div class="col-sm-6"> 
                        <div class="row">
                            
                    
                    <div class="col-sm-12"> 
                    <input required="" type="text" class="form-control" placeholder="Contact/Phone" name="contact" value="">                     
                    </div>
                        </div>
                    </div>
                    
                </div>


        <div class="row form-group"> 
                                        
            <div class="col-sm-4">
            <select  name="category" class="border-none form-control">
            <option hidden class="form-control" >Select Category</option>
            <option class="form-control" value="Agriculture" >Agriculture</option>
            <option value="Arts/Culture" >Arts/Culture </option>
            <option value="Auto" >Auto</option>
           <option value="Sports/Gaming" >Sports/Gaming</option>
           <option value="Real State" >Real State</option>
           <option value="Food" >Food </option>
           <option value="Legal" >Legal </option>
            <option value="Security" >Security </option>
             <option value="Media/Internet" >Media/Internet </option>
              
               <option value="Fashion" >Fashion </option>
                <option value="Technology/Communications" >Technology/Communications </option>
                <option value="Renewable/Energy" >Renewable Energy </option>
                 <option value="Retail" >Retail </option>
           
           <option value="Finance/Accounting" >Finance/Accounting</option>
           <option value="Pets">Pets</option>
           <option value="Domestic (Home Help etc)">Domestic (Home Help etc)</option>
           <option value="Other" >Other</option>  

           </select>
  </div>

                 <div class="col-sm-4"> 
                    <textarea class="form-control" required="" name="details" rows="1" cols="30" placeholder="Details"></textarea>
                    </div>

                     <div class="col-sm-4"> 
                    <select required name="y_turnover" class="form-control">
                        <option hidden >Choose Yearly Turnover</option>
                        <option value="0-10000">$0-$10000</option>
                        <option value="10000-100000">$10000-$100000</option>
                        <option value="100000-250000">$100000-$250000</option>
                        <option value="250000-500000">$250000-$500000</option>
                        <option value="500000-">$500000+</option>
                    </select>
                    </div>

                       
                    </div>


                <div class="row form-group">
                    
                    <div class="col-sm-4"> 
                        <div class="row">
                    
                    <div class="col-sm-12"> 
                    <input required=""  class=" form-control border border-none rounded form-group" type="number" max="1000000" name="investment_needed" id="title" placeholder="Investment Needed"  /> 
                    </div>
                        </div>
                    </div>

                    <div class="col-sm-4"> 
                        <div class="row">
                           
                    
                    <div class="col-sm-12"> 
                    <input required="" max="100" type="number" class="form-control" placeholder="Share (ex:0-100)" name="share" value="">                     
                    </div>
                        </div>
                    </div>

                    <div class="col-sm-4 "> 
                        <div class="row">
                           
                    
                    <div class="col-sm-12 "> 
                    <input type="email" class="form-control" placeholder="Contact mail (optional)" name="contact_mail" value="">                     
                    </div>
                        </div>
                    </div>
                    
                </div>



                   <div class="row my-3 row form-group">

                    <div class="col-sm-12"> 
                        <div class="row">
                           <div class="col-sm-2"><label class="h5" for="name">
                                <strong>Cover</strong></label>
                               </div>
                    
                    <div class="col-sm-4"> 
                    <div class="upload-btn-wrapper">
                      <label for="file-upload" class="btnUp2 custom-file-upload">
                                Upload <i class="ml-2 fa fa-arrow-up"></i>
                              </label>
                              <input id="file-upload" name='image' type="file" style="" required>
                    </div>
                    </div>

                    <div class="col-sm-6"> 
                    <input id="searchbox" required="" onkeyup="suggest(this.value);" style="height: 32px;" class=" form-control d-inline" type="text" name="location" value="" placeholder="Enter a location...">
                    </div>

                         <div class="row" style="">
                                <div id="result_list" class="" style="display: none;left: 340px;width:41%; z-index: 1000;height: 600px;position: absolute;">
                                    
                                </div>
                            </div>

                        </div>
                    </div> 
                </div>


                <div class=" row form-group">
                    <div class="col-sm-6"> 
                        <div class="row">
                           <div class="col-sm-8"><label for="name">
                                <p class="small text-left">Please enter a directors passport/Id no*</p></label>
                               </div>
                               <div class="col-sm-4">
                                   <input class="text-left form-control" type="text" name="id_no">
                               </div>
                               </div> 
                               </div>

                        <div class="col-sm-6"> 
                        <div class="row">
                           <div class="col-sm-8"><label for="name">
                                <p class="small text-left">Please enter your individual/company tax pin*</p></label>
                               </div>
                               <div class="col-sm-4">
                                   <input class="form-control" type="text" name="tax_pin">
                               </div>
                               </div> 
                               </div>

                </div>

                

                <div class=" row form-group">

                    <div class="col-sm-12"> 
                        <div class="row">
                           <div class="col-sm-6"><label for="name">
                                <p class="">Set fee for investor to view your full business data?</p></label>
                               </div>

                               <div class="col-sm-1"> </div>

                               <div class="col-sm-1 form-check form-switch">
                                  <input onchange="showAmount();" class="toggole_bar form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" >
                                </div>

                                <div id="amount_box" class="col-sm-2">
                                  
                                </div>

                               </div> 
                               </div>
 

                </div>



                <div class="row my-5 row form-group">

                    <div class="col-sm-12"> 
                        <div class="row">
                           <div class="col-sm-12"><label class="h5" for="name">
                                <p>Upload mandatory documents below to feature on the platform</p></label>
                               </div>
                               </div> 
                               </div>
                    
                    <div class="col-sm-5"> 

                    <div class="upload-btn-wrapper">
                      
                      <label for="file-upload2" class="btnUp_listing">
                        Upload Company/Individual Pin *
                      <img src="../images/up.svg" width="30px"> </label>
                      <input style="" id="file-upload2" required type="file" name="pin" />
                    </div>

                    </div>


                    <div class="col-sm-7"> 

                    <div class="upload-btn-wrapper">
                      <label for="file-upload3" class="btnUp_listing"> Upload Directors Identification(Id/Passport)*
                      <img src="../images/up.svg" width="30px"> </label>
                      <input style="" id="file-upload3" required="" type="file" name="identification" />
                    </div>

                    </div>


                </div>



        <div class="row my-4 form-group">

              <div class="col-sm-12 mx-auto"> 

                    <div class="upload-btn-wrapper w-75  d-block">
                      <label for="file-upload4" class="text-center w-100 btnUp_listing">  Upload 12 Months Financial Statements (Bnak/Mpesa etc)*
                      <img src="../images/up.svg" width="30px"> </label>
                      <input style="" id="file-upload4" required="" type="file" name="yeary_fin_statement" />
                    </div>

                    </div>


            <div class="col-sm-12 mx-auto mt-3"> 

                    <div class="upload-btn-wrapper w-75  d-block">
                      <label for="file-upload4" class="text-center w-100 btnUp_listing">  Upload Supporting Business Documentation*
                      <img src="../images/up.svg" width="30px"> </label>
                      <input style="" id="file-upload4" required="" type="file" name="document" />
                    </div>

                    </div>


                    <div class="col-sm-12 mt-3"> 

                    <div class="upload-btn-wrapper w-75  d-block">
                     <label for="file-upload5" class="text-center w-100 bg-info btnUp_listing"> Upload supportive video*
                      <img src="../images/up.svg" width="30px"> </label>
                      <input style="" id="file-upload5" type="file" name="video" />
                    </div>

                    </div>

            <div class="col-sm-12 w-75  d-block"> <span class="my-3 d-block font-weight-bold text-center m-auto"> OR </span>

          
           <input class="w-100 d-blocks d-inline form-control" placeholder="Enter Video Link" name="link" /> 

        </div>


            <div class="col-sm-12 mt-5"><label class="h5 mb-0" for="name">
                                <p>Business reason for funding</p></label>
                               </div>

                 <div class="col-sm-12 w-75  d-block"> 
                    <textarea class="form-control" required="" name="reason" rows="2" cols="30" placeholder="Reason for funding..."></textarea>
                    </div>


          </div>





                 <div class="row my-5 w-75"> 
                    <button style="width:40%;background:green;border-radius: 30px;" class=" m-auto btn text-white font-weight-bold">SAVE</button></div>


            </form>


                    </div>
                  
                    
                </div>
                

            </div>


            <div class="clear"></div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>

        <script type="text/javascript">
           $('#file-upload').change(function() {
              var i = $(this).prev('label').clone();
              var file = $('#file-upload')[0].files[0].name;
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
            $('#amount_box').html('<input class="form-control" type="number"  id="investors_fee" required placeholder="amount" name="investors_fee" style="height:33px;" >');
        else $('#amount_box').html('');

    }

  </script>

@endsection



