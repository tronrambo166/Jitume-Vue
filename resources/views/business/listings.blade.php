@extends('business.layout')

@section('page')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="container px-0" id="" >
        
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
        <h2>top</h2>

    <h3 class="bid_header px-5 w-100 text-left my-0 pb-3 py-2 font-weight-bold"> My Businesses</h3>  
    <div class="row mx-auto mb-0 px-5">
            
     <table class="eq table" id="">
    <thead class="table_head border">
        <tr>
            <th width="15%">Name </th>
            <th>Category </th>
            <th>Required</th>
            <th>Details </th>  
            <th>Contact </th> 
            <th>Share </th> 
            <th>Image </th> 
            <th width="20%" class="text-center">Action</th>        
        </tr>

    </thead>
    

    
    <tbody>
        @foreach($listings as $ev)
        <tr onclick="bg_change({{$ev->id}});" id="{{$ev->id}}">
            <td>{{$ev->name }}</td>
                <td>{{$ev->category }}</td>
                    <td>{{$ev->investment_needed }}</td>
                        <td>{{$ev->details }}</td>
                        <td>{{$ev->contact }}</td>
                        <td>{{$ev->share }}</td>
                        <td><img class="rounded" width="72px" height="40px" src="../{{$ev->image}}"></td>
   
            <td class="text-center">
            @if(!$ev->active)
            <a onclick="return confirm('Are you sure?');" href="{{route('activate_milestone',$ev->id)}}" class="rounded bg-light text-success header_buttons my-1 font-weight-bold border border-dark d-inline-block px-2 py-1 ">Activate</a>
            @endif

            <button data-target="#edit{{$ev->id}}" data-toggle="modal" style="cursor:pointer;" id="invest" class="px-2 py-1 rounded text-dark buttonEq2 my-1 mr-2">Edit</button>
                
            <a onclick="return confirm('Are you sure?');" href="{{route('delete_listing',$ev->id)}}" class="rounded text-danger buttonEq2 my-1  d-inline-block px-2 py-1 ">Delete</a>
            

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
                                        <input  name="id" id="id" type="number" hidden value="{{$ev->id}}" class="form-control">

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

                    <p class="bg-light py-2">{{$ev->investment_needed}}</p>    
                    <input hidden  class=" form-control border border-none rounded form-group" type="number" max="1000000" name="investment_needed" id="title" value="{{$ev->investment_needed}}" /> 
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
                    <input id="{{$ev->id}}" data-id="{{$ev->id}}" required="" onkeyup="suggest2(this.value,this.id);" style="height: 32px;" class=" form-control d-inline" type="text" name="location" value="{{$ev->location}}">
                    </div>

                         <div class="row" style="">
                                <div id="result_list{{$ev->id}}" class="" style="display: none;left: 312px;width:49%; z-index: 1000;height: 600px;position: absolute;">
                                    
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
           <input type="text" class="w-100 d-blocks d-inline form-control" value="{{$ev->video}}" name="link" /> 

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


<script type="text/javascript">

  function address2(place,lat2,lng2,list_id) {
            document.getElementById(list_id).value = place;
            //$("#result_list").html('');
            document.getElementById("result_list"+list_id).style.display = 'none';

              const lat = document.getElementById('lat');
              const lng = document.getElementById('lng');

              lat.value = lat2;
              lng.value = lng2;

        }

          function suggest2(search,list_id) {
            $("#result_list"+list_id).html('');
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

                        $("#result_list"+list_id).show();
                            if(i<10)

                            if(city == '')
                            $("#result_list"+list_id).append(' <div onclick="address2(\'' + name + ','  + country + '\', \'' + lat + '\', \'' + lng + '\',\'' + list_id + '\');" style="" data-id="' + name + '" class="address  py-1 px-1 my-0 border-top bg-white single_comms">  <p class="h6 text-dark d-inline" ><i class="fa fa-map-marker mr-1 text-dark" aria-hidden="true"></i> ' + name + '</p> <p  class="d-inline text-dark"><small>, ' + country + '</small> </p> </div>');
                            else
                            $("#result_list"+list_id).append(' <div onclick="address2(\'' + name + ','+ city + ','  + country + '\', \'' + lat + '\', \'' + lng + '\', \'' + list_id + '\');" style="" data-id="' + name + '" class="address  py-1 px-1 my-0 border-top bg-white single_comms">  <p class="h6 text-dark d-inline" ><i class="fa fa-map-marker mr-1 text-dark" aria-hidden="true"></i> ' + name + '</p> <p  class="d-inline text-dark"><small>, ' + city + ',' + country + '</small> </p> </div>');


                        }
                        //document.getElementById('result_list').style.overflowY="scroll";                      
                },
                error: function(error) {
                    console.log(error);
                }

            });

        }
</script>

                


@endsection



