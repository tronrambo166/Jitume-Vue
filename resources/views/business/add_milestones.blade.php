@extends('business.layout')

@section('page')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div class="container px-0" id="" >
        
  <h3 class="bid_header px-5 w-100 text-left my-0 pb-3 py-2 font-weight-bold"> Add Business Milestones </h3>         
<div class="row mx-auto px-5">

<style>
.btnUp3 {
  border: 1px solid black;
  color: ghostwhite;
  background-color: #083608;
  padding: 5px ;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  width: 100%;
  text-align: center;
}

.col-sm-3,.col-sm-1,.col-sm-2{height: 40px;}

::placeholder {
  color: darkgrey; font-weight: 500;
  font-size: 12px;
  padding-left: 8px;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
 color: darkgrey;
}

::-ms-input-placeholder { /* Microsoft Edge */
 color: darkgrey;
}
</style> 
    
<!-- ADD MODAL -->
 
        @if(Session::has('error'))
        <div class="w-50 m-auto alert font-weight-bold text-danger alert-warning alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{Session::get('error')}}   @php Session::forget('error'); @endphp </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>  @endif  

    
    
      <div class="modal-body">
        <form action="{{route('save_milestone')}}"  method="post" enctype="multipart/form-data" class="form-group form">
                                @csrf
                                

                                <div class="row pt-2 mx-0 inputs" width="85%">
                                    <div class="col-sm-2 px-1">
                                        <div class=" ">
                                            <input maxlength="255" required="" name="title" type="text" placeholder="Milestone Name"  class="w-100 border">
                                        </div>
                                    </div>


                                    <div class="col-sm-2 px-1 ">
                                        <div class="">
                                         
                                            <input required=""  type="number"placeholder="Amount"  name="amount" class="w-100 border" >
                                        </div>
                                    </div>


                                     <div class="col-sm-2 px-1 ">
                                        <div class="">

                                            <select style="width:65%;" class="border d-inline py-1" name="time_type" required="">
                                            <option value="Days" class="form-control" >Days</option>
                                            <option value="Weeks" class="form-control" >Weeks</option>
                                            <option value="Months" class="form-control" >Months</option>
                                            </select>
                                         
                                            <select class="border py-1" required=""  type="number" name="n_o_days" value="1" min="1" class="" >
                                            

                                            <option class="border d-inline form-control"  value="01">01</option>
                                            <option class="form-control"  value="02">02</option>
                                            <option class="form-control"  value="03">03</option>
                                            <option class="form-control"  value="04">04</option>
                                            <option class="form-control"  value="05">05</option>
                                            <option class="form-control"  value="06">06</option>
                                            <option class="form-control"  value="07">07</option>
                                            <option class="form-control"  value="08">08</option>
                                            <option class="form-control"  value="09">09</option>
                                            <option class="form-control" value="10">10</option>
                                            <option class="form-control" value="11">11</option>
                                            <option class="form-control"  value="12">12</option>
                                            <option class="form-control"  value="13">13</option>
                                            <option class="form-control"  value="14">14</option>
                                            <option class="form-control"  value="15">15</option>
                                            <option class="form-control"  value="16">16</option>
                                            <option class="form-control" value="17">17</option>
                                            <option class="form-control" value="18">18</option>
                                            <option class="form-control" value="19">19</option>
                                            <option class="form-control" value="20">20</option>
                                            <option class="form-control" value="21">21</option>
                                            <option  class="form-control"value="22">22</option>
                                            <option class="form-control" value="23">23</option>
                                            <option class="form-control" value="24">24</option>
                                            <option class="form-control" value="25">25</option>
                                            <option  class="form-control"value="26">26</option>
                                            <option class="form-control" value="27">27</option>
                                            <option class="form-control" value="28">28</option>
                                            <option  class="form-control"value="29">29</option>
                                            <option  class="form-control"value="30">30</option>


                                            </select>


                                        </div>
                                    </div>

                        <div class="col-sm-3 px-1">
                            <div class="pload-btn-wrapper w-100">
                                <label for="file-upload" class="border text-white btnUp3 custom-file-upload">
                                Upload Milestone Documentaion <i class="ml-2 fa fa-arrow-up"></i>
                              </label>
                              <input required="" id="file-upload" name='file' type="file" style="display:none;">

                              <p id="file_alert" class="text-danger text-center font-weight-bold bg-light"></p>
                                </div>
                          </div>



        <div class="col-sm-2 px-1">
          <div class="form-group ">
          <select onchange="active();" required  name="business_id" class="w-100 border p-1 ">
            <option hidden value="" class="form-control" >Select Business</option>
            @foreach($business as $b)
            <option value="{{$b->id}}" class="form-control" >{{$b->name}}</option> @endforeach
          </select> 
          </div>
        </div>


        <div class="col-1 px-1">
            <div class="form-group">
                <input id="addBtn" onclick="file_check();" type="submit" class="disabled text-center p-0 border rounded py-1 mile_add_btn btn-block" value="Add" />
            </div>
        </div>
                           
        </div>
        
    </form>

    </div>

      <!-- ADD MODAL -->


<div class="card-header w-100 mt-4">
           <h5>Recently Added</h5>
        </div>

 <div class="row pt-4 px-0 m-auto">

            
    <table class="eq table" id="">
    <thead>
        <tr class="border">
            <th>Milestone Name </th>
            <th>Business </th>
            <th>Amount</th>
            <th>Status</th>
            <th width="20%" class="text-center">Action</th>        
        </tr>

    </thead>
    

    
    <tbody> @php $c=1; @endphp
        @foreach($milestones as $ev)
        <tr >
            <td>{{$ev->title }}</td>
                <td> @foreach($business as $b)
                     @if($ev->listing_id == $b->id)
                       {{$b->name}}
                       @endif @endforeach
               </td>
                    <td>{{$ev->amount }}</td>

                     <td>

           

        <form action="{{route('mile_status')}}" method="post" class="form-inline">@csrf
            <select disabled  name="status" style="width:65%;" class=" d-inline rounded p-1 ">
                 
                
            @if($ev->status == 'Created')
            <option hidden value="In Progress" class="form-control" >In Progress</option> 
            @else
            <option hidden value="{{$ev->status}}" class="form-control" >{{$ev->status}}</option>
            @endif

            @if($ev->status != 'Done' || $ev->status == 'Done')
            <option value="Done" class="form-control" >
                
            Done</option>
            @endif
            
           </select>
          

           <!-- <input type="submit" value="Set" class="ml-2 py-0 mb-1 d-inline btn btn-success w-25"> -->

            <input hidden type="number" name="id" value="{{$ev->id}}">
           </form> 

                     </td>

            <td class="text-center">
            
            <div class="dropdown show d-inline-block">
                  <a class="btn border py-0 dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Action 
                  </a>
                 <div class="dropdown-menu p-0" aria-labelledby="dropdownMenuLink">

            <a onclick="return confirm('Are you sure?');" href="{{route('delete_milestone',$ev->id)}}" class="py-0 btn dropdown-item rounded btn-light my-1">Delete</a>
            </div>  
            

            </td>
        </tr>

    @endforeach
    </tbody> 
    
    
</table>
               

                </div>



            <div class="clear"></div>
            <div class="clearfix py-5"></div>

            </div>
            </div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>

        <script type="text/javascript">
            function active(){
                $('#addBtn').removeClass('disabled');
                $('#addBtn').css('background', '#083608');
            }

           $('#file-upload').change(function() {
              var i = $(this).prev('label').clone();
              var file = $('#file-upload')[0].files[0].name;
              $(this).prev('label').text(file);
            });

           //File Check
           function file_check() {
           if( document.getElementById("file-upload").files.length == 0 ){
                $('#file_alert').html("No files selected!");
            }
          }
        </script>




      <!-- ADD MODAL -->

@endsection



