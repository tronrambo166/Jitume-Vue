@extends('business.layout')

@section('page')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="container" id="" style="background:white;">
        
        @if(Session::has('success_update'))
        <div class="w-50 m-auto alert font-weight-bold alert-success alert-dismissible fade show" role="alert">
          <p class="font-weight-bold">{{Session::get('success_update')}}   @php Session::forget('success_update'); @endphp </p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>  @endif

<style type="text/css">
    .showFormB input, .showFormB select {
    border-top: 1px solid #7c7c7c;
    border-left: 1px solid #c3c3c3;
    border-right: 1px solid #c3c3c3;
    border-bottom: 1px solid #ddd;
    background: #fff;
    height: 28px;
}

</style>
        
    <div class="row pt-4  m-auto">

            
     <table class="eq table table-bordered " id="">
    <thead>
        <tr>
            <th>Name </th>
            <th>Category </th>
            <th>Value Needed</th>
            <th>Details </th>  
            <th>Contact </th> 
            <th>Share Remaining </th> 
            <th>Image </th> 
            <th width="20%" class="text-center">Action</th>        
        </tr>

    </thead>
    

    
    <tbody>
        @foreach($listings as $ev)
        <tr >
            <td>{{$ev->name }}</td>
                <td>{{$ev->category }}</td>
                    <td>{{$ev->investment_needed }}</td>
                        <td>{{$ev->details }}</td>
                        <td>{{$ev->contact }}</td>
                        <td>{{$ev->share }}</td>
                        <td><img width="100px" height="60px" src="../{{$ev->image}}"></td>
   
            <td class="text-center">
            <button data-target="#add{{$ev->id}}" data-toggle="modal" style="cursor:pointer;" id="invest" class="rounded text-light buttonEq2 my-1"><i class="fa fa-plus"></i>Resource</button>

            <button data-target="#edit{{$ev->id}}" data-toggle="modal" style="cursor:pointer;" id="invest" class="rounded text-light buttonEq2 my-1">Edit</button>
                
            <a onclick="return confirm('Are you sure?');" href="{{route('delete_listing',$ev->id)}}" class="rounded text-danger buttonEq2 my-1  d-inline-block py-0">Delete</a >
            

            </td>
        </tr>



<!-- ADD MODAL -->
  <div  class="modal fade" id="add{{$ev->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content" >
      <div class="modal-header">
         <div class="card-header w-100">
           <h3>Add Equipment</h3>
        </div>       

        <button type="button" class="m-0 close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    
    
      <div class="modal-body">
        <form action="{{route('add_eqp')}}"  method="post" enctype="multipart/form-data">
                                @csrf
                                        <input  name="id" type="number" hidden value="{{$ev->id}}" class="form-control">

                                <div class="row ">
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label>Name</label>
                                            <input required="" name="eq_name" type="text"  class="form-control">
                                        </div>
                                    </div>


                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label>Value</label>
                                            <input required=""  type="text" name="value"  class="form-control" >
                                        </div>
                                    </div>



                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label>Amount</label>
                                            <input required=""  type="number" name="amount" class="form-control" >
                                        </div>
                                    </div>

                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label>Details</label>
                                            <input required=""  type="text" name="details"class="form-control" >
                                        </div>
                                    </div>
                           
                                </div>
                                <input type="submit" class="my-4 btn btn-primary btn-block" value="Save" />
                            </form>

    </div>
    </div>
    </div>
    </div>
      <!-- ADD MODAL -->


      <!-- Edit MODAL -->
  <div  class="modal fade" id="edit{{$ev->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content" style="width:125%;">
      <div class="modal-header">
         <div class="card-header w-100">
           <h3>Edit</h3>
        </div>       

        <button type="button" class="m-0 close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    
    
      <div class="modal-body">
      <form class="showFormB" action="{{route('up_listing')}}"  method="post" enctype="multipart/form-data">
            @csrf   
               <input  name="id" type="number" hidden value="{{$ev->id}}" class="form-control">

               <div class="row form-group">
                    
                    <div class="col-sm-4"> 
                        <div class="row">
                        
                    <div class="col-sm-12"> 
                    <label class="labels font-weight-bold">Title</label>
                    <input required=""  class="showForm2 form-control border border-none rounded form-group" type="text" name="name" id="title" value="{{$ev->name}}"  /> 
                    </div>
                        </div>
                    </div>

                    <div class="col-sm-4"> 
                    <div class="row">
                    <div class="col-sm-12"> 
                        <label class="labels font-weight-bold">Contact</label>
                    <input required="" type="text" class="form-control" value="{{$ev->contact}}" name="contact">                     
                    </div>
                        </div>
                    </div>

                     <div class="col-sm-4"> 
                    <div class="row">
                    <div class="col-sm-12"> 
                        <label class="labels font-weight-bold">Fee</label>
                    <input required="" type="number" class="form-control" value="{{$ev->investors_fee}}" name="investors_fee" >                     
                    </div>
                        </div>
                    </div>

                    
                </div>


        <div class="row form-group"> 
                                        
            <div class="col-sm-4">
                Category
            <select  name="category" class="border-none form-control">
             <option class="form-control" value="{{$ev->category}}" selected>{{$ev->category}}</option>

            <option class="form-control" value="Agriculture" >Agriculture</option>
           <option value="Sports/Gaming" >Sports/Gaming</option>
           <option value="Real State" >Real State</option>
           <option value="Entertainment" >Entertainment </option>
           <option value="Auto" >Auto</option>
           <option value="Finance/Accounting Security" >Finance/Accounting Security</option>
           <option value="Domestic Help">Pets</option>
           <option value="Domestic Help">Domestic Help</option>
           <option value="Other" >Other</option> 

           </select>
  </div>

                 <div class="col-sm-4"> 
                    <label class="labels font-weight-bold">Details</label>
                    <textarea class="form-control" required="" name="details" rows="1" cols="30">{{$ev->details}}</textarea>
                    </div>

                     <div class="col-sm-4"> 
                        <label class="labels font-weight-bold">Turnover</label>
                    <select required name="y_turnover" class="form-control">
                        <option value="{{$ev->y_turnover}}" selected>{{$ev->y_turnover}}</option>

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
                    <label class="labels font-weight-bold">Investment Needed</label>    
                    <input required=""  class=" form-control border border-none rounded form-group" type="number" max="1000000" name="investment_needed" id="title" value="{{$ev->investment_needed}}" /> 
                    </div>
                        </div>
                    </div>

                    <div class="col-sm-4"> 
                        <div class="row">
                           
                    
                    <div class="col-sm-12">
                    <label class="labels font-weight-bold">Share</label> 
                    <input required="" max="100" type="number" class="form-control" value="{{$ev->share}}" name="share" value="">                     
                    </div>
                        </div>
                    </div>

                    <div class="col-sm-4 "> 
                        <div class="row">
                           
                    
                    <div class="col-sm-12 "> 
                        <label class="labels font-weight-bold">Contact mail</label>
                    <input type="email" class="form-control" value="{{$ev->contact_mail}}" name="contact_mail" value="">                     
                    </div>
                        </div>
                    </div>
                    
                </div>



                   <div class="row my-3 row form-group">

                    <div class="col-sm-12"> 
                        <div class="row">
                           <div class="col-sm-2 mt-3"><label class="h5" for="name">
                                <strong>Cover</strong></label>
                               </div>
                    
                    <div class="col-sm-4 mt-3"> 
                    <div class="upload-btn-wrapper">
                      <button class="btnUp2">Change <i class="ml-2 fa fa-arrow-up"></i></button>
                      <input type="file" name="image" />
                    </div>
                    </div>

                    <div class="col-sm-6"> 
                        <label class="labels font-weight-bold">Location</label>
                    <input id="searchbox" required="" onkeyup="suggest(this.value);" style="height: 32px;" class=" form-control d-inline" type="text" name="location" value="{{$ev->location}}">
                    </div>

                         <div class="row" style="">
                                <div id="result_list" class="" style="display: none;left: 312px;width:49%; z-index: 1000;height: 600px;position: absolute;">
                                    
                                </div>
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
                      <button class="btnUp_listing"> Change Company/Individual Pin *
                      <img src="../images/up.svg" width="30px"> </button>
                      <input type="file" name="pin" />
                    </div>

                    </div>


                    <div class="col-sm-7"> 

                    <div class="upload-btn-wrapper">
                      <button class="btnUp_listing"> Change Directors Identification(Id/Passport)*
                      <img src="../images/up.svg" width="30px"> </button>
                      <input type="file" name="identification" />
                    </div>

                    </div>


                </div>



        <div class="row my-4 form-group">

                    <div class="col-sm-12 mx-auto"> 

                    <div class="upload-btn-wrapper w-75  d-block">
                      <button class="btnUp_listing w-100">  Upload 12 Months Financial Statements (Bnak/Mpesa etc)*
                      <img src="../images/up.svg" width="30px"> </button>
                      <input type="file" name="yeary_fin_statement" />
                    </div>

                    </div>


                    <div class="col-sm-12 mx-auto mt-3"> 

                    <div class="upload-btn-wrapper w-75  d-block">
                      <button class="btnUp_listing w-100"> Change Supporting Business Documentation*
                      <img src="../images/up.svg" width="30px"> </button>
                      <input  type="file" name="document" />
                    </div>

                    </div>


                    <div class="col-sm-12 mt-3"> 

                    <div class="upload-btn-wrapper w-75  d-block">
                      <button class="btnUp_listing bg-info w-100"> Change supportive video
                      <img src="../images/up.svg" width="30px"> </button>
                      <input  type="file" name="video" />
                    </div>

                    </div>

            <div class="col-sm-12 w-75  d-block"> <span class="my-3 d-block font-weight-bold text-center m-auto"> OR </span>

          <label class="labels font-weight-bold">Video Link</label>
           <input class="w-100 d-blocks d-inline form-control" value="{{$ev->link}}" name="link" /> 

        </div>


            <div class="col-sm-12 mt-5"><label class="h5 mb-0" for="name">
                                <p>Business reason for funding</p></label>
                               </div>

                 <div class="col-sm-12 w-75  d-block"> 
                    <textarea class="form-control" required="" name="reason" rows="2" cols="30" >{{$ev->reason}}</textarea>
                    </div>


          </div>





                 <div class="row my-5"> 
                    <button style="width: 40%;background:green;border-radius: 2px;" class=" m-auto btn text-white font-weight-bold">SAVE</button></div>


            </form>

    </div>
    </div>
    </div>
    </div>
      <!-- Edit MODAL -->


         @endforeach
         @if(count($listings)==0)
         <td  > No data found! </td>
         @endif
    
    </tbody> 
    
    
</table>
               

                </div>

                </div>

                


@endsection



