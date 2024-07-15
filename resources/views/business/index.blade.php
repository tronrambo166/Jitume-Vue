@extends('business.layout')
@php //echo 'Dashboard is under maintanance!'; exit; @endphp

@section('page')
 <div class="container px-0 h-100">
    <div class="bid_header"></div>
  
  @if(Session::has('file_error'))
  <p class="d-block mx-auto btn btn btn-light text-danger font-weight-bold text-center">
      {{Session::get('file_error')}} @php Session::forget('file_error'); @endphp</p>@endif

   @if(isset($investor) && $investor == true ) 
   <div class="row m-auto">  
   <h3 class="bid_header my-0 text-left pb-3 py-2 font-weight-bold"> My Investments</h3>       
     <table class="eq table" id="">
    <thead class="table_head border">
        <tr>
            <th>Name </th>
            <th>Category </th>
            <th style="width: 10%;">Value Needed</th>
            <th>Details </th>  
            <th>Contact </th> 
            <th style="width: 11%;">Business Share </th> 
            <th style="width: 11%;">My Share </th>
            <th>Image </th> 
            <th width="20%" class="text-center">Action</th>        
        </tr>

    </thead>
    

    
    <tbody>
        @foreach($results as $ev) @php $coded_id = base64_encode($ev->id); $coded_id = base64_encode($coded_id); @endphp
        <tr class="invest_heading" onclick="bg_change({{$ev->id}});" id="{{$ev->id}}">
            <td>{{$ev->name }}</td>
                <td>{{$ev->category }}</td>
                    <td>{{$ev->investment_needed }}</td>
                        <td>{{$ev->details }}</td>
                        <td>{{$ev->contact }}</td>
                        <td>{{$ev->share }}%</td>
                        <td>{{$ev->myShare }}%</td>
                        <td><img width="100px" height="60px" src="../{{$ev->image}}"></td>
   
            <td class="text-center">
                
            <a style="border-radius: 4px;" href="./../#/business-milestone/{{$coded_id}}" class="btn btn-outline-success border border-dark small px-3 py-1  my-1 d-inline-block py-0">View Milestone</a >
            

            </td>
        </tr>
        @endforeach
    </tbody>
</table>
</div>


@else
 
 @if($services->count())       
<div class="flex flex-col pt-9 pb-5 bg-white rounded-2xl shadow-sm my-3">
  <div class="flex flex-col px-5 w-full max-md:px-5 max-md:max-w-full">
    <div class="flex gap-5 justify-between w-full font-bold max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
      <!-- <div class="flex flex-col">
        <div class="text-lg leading-6 text-gray-700">My Services</div>
        <div class="mt-7 text-xs leading-4 text-slate-400">NAME</div>
      </div> -->
      
</div>
<div class="text-lg leading-6 text-gray-700">My Services</div>

    <div class="flex justify-between py-3  ">
  <h1 class=" w-50">Name</h1>

  <!-- Content aligned to the left -->
  <div class="flex w-50 mr-[110px] gap-5 items-center max-w-full">
    <div>CATEGORY</div>
    <div>DETAILS</div>
    <div>REQUIRED</div>
  </div>
    </div>

    <!-- Loop through each service -->
    @foreach($services as $ev)
    @php
      $coded_id = base64_encode($ev->id);
      $coded_id = base64_encode($coded_id);
    @endphp
   <div class="flex gap-5 justify-between pr-10 pb-3 mt-7 w-full text-sm leading-5 max-md:flex-wrap max-md:pr-5 max-md:max-w-full">



      <div class="flex w-40 gap-4 whitespace-nowrap">
        <img
          loading="lazy"
          src="../{{$ev->image}}"
          class="shrink-0 w-10 aspect-square"
        />
        <div class="flex flex-col my-auto">
          <div class="font-bold text-gray-700">{{$ev->name}}</div>
          <div class="mt-2 text-slate-500">{{$ev->contact}}</div>
        </div>
      </div>
      <div class="flex w-50 gap-5 justify-between items-center max-md:flex-wrap max-md:max-w-full">
        <div class="flex flex-col ">
          <div class="font-bold text-gray-700">{{$ev->category}}</div>
        </div>
        <div class="flex flex-col self-stretch">
          <div class="self-stretch my-auto text-slate-500">{{$ev->details}}</div>
        </div>
        <div class="flex flex-col self-stretch">
         
          <div class="self-stretch my-auto font-bold text-center text-gray-700"> {{$ev->price}}</div>
        </div>
        
        <div class="self-stretch my-auto text-xs font-bold leading-5 text-slate-500">
          <a href="./../#/business-milestone/{{$coded_id}}" class="text-success btn small px-3 py-1 my-1 d-inline-block py-0 border">View Milestone</a>
        </div>
      </div>

    </div>
    @endforeach
  </div>

  <div class="flex gap-3 self-end mt-8 mr-6 text-xs font-medium tracking-normal leading-3 text-gray-700 whitespace-nowrap max-md:mr-2.5">
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      &lt;
    </div>
    <div class="flex justify-center items-center w-8 h-8 text-white bg-green-700 rounded border border-green-700 border-solid">
      1
    </div>
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      2
    </div>
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      3
    </div>
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      4
    </div>
    <div class="self-start mt-4 text-black">...</div>
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      40
    </div>
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      &gt;
    </div>
  </div>
</div>

@else

    <div class="p-3">
       <h3 class="text-left my-0 pb-3 py-2 font-weight-bold"> My Services</h3> 

       <div class="w-50 m-auto d-block">
           <img width="120px" src="../images/randomIcons/no-service.png">
           <p class="text-left ml-4 font-weight-bold">No Services</p>
       </div>

       <div class="mb-5 pb-3">
        <li style="list-style-type: none;" class="w-50 nav-item py-1 mx-auto text-secondary ">
                        <a href="{{route('add-services')}}" style="border-radius: 5px;border: 1px solid green;text-decoration: none;" class="px-3 ml-1 btn searchListing py-1" href="">Add Service</a>
                    </li> 
        </div>
    </div>


@endif


@if($business->count())       
<div class="flex flex-col pt-9 pb-5 bg-white rounded-2xl shadow-sm">
  <div class="flex flex-col px-5 w-full max-md:px-5 max-md:max-w-full">
    <div class="flex gap-5 justify-between w-full font-bold max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
    
      
    </div>
        <div class="text-lg leading-6 text-gray-700">My Businesses</div>

    <div class="flex justify-between py-3 justify-start items-center ">
  <h1 class="mr-8 w-50">Name</h1>

  <!-- Content aligned to the left -->
  <div class="flex w-50 mr-[180px] gap-5 items-center max-w-full">
    <div>CATEGORY</div>
    <div>DETAILS</div>
    <div>REQUIRED</div>
  </div>
</div>
    <!-- Loop through each business -->
    @foreach($business as $ev)
    @php
      $coded_id = base64_encode($ev->id);
      $coded_id = base64_encode($coded_id);
    @endphp

    <div class="flex gap-5 justify-between pr-10 pb-3 mt-7 w-full text-sm leading-5 max-md:flex-wrap max-md:pr-5 max-md:max-w-full">



      <div class="flex gap-4 whitespace-nowrap">
        <img
          loading="lazy"
          src="../{{$ev->image}}"
          class="shrink-0 w-10 aspect-square"
        />
        <div class="flex flex-col my-auto">
          <div class="font-bold text-gray-700">{{$ev->name}}</div>
          <div class="mt-2 text-slate-500">{{$ev->contact}}</div>
        </div>
      </div>
      <div class="flex gap-5 justify-between items-center max-md:flex-wrap max-md:max-w-full">
        <div class="flex flex-col ">
          <div class="font-bold text-gray-700 pr-4">{{$ev->category}}</div>
        </div>
        <div class="flex flex-col self-stretch">
          <div class="self-stretch my-auto text-slate-500">{{$ev->details}}</div>
        </div>
        <div class="flex flex-col self-stretch">
         
          <div class="self-stretch my-auto font-bold text-center text-gray-700">{{$ev->investment_needed}}</div>
        </div>
        <div class="self-stretch my-auto text-xs font-bold leading-5 text-slate-500">
          <a href="./../#/business-milestone/{{$coded_id}}" class="text-success btn small px-3 py-1 my-1 d-inline-block py-0 border">View Milestone</a>
        </div>
      </div>
    </div>
    @endforeach
  </div>

  <div class="flex gap-3 self-end mt-8 mr-6 text-xs font-medium tracking-normal leading-3 text-gray-700 whitespace-nowrap max-md:mr-2.5">
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      &lt;
    </div>
    <div class="flex justify-center items-center w-8 h-8 text-white bg-green-700 rounded border border-green-700 border-solid">
      1
    </div>
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      2
    </div>
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      3
    </div>
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      4
    </div>
    <div class="self-start mt-4 text-black">...</div>
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      40
    </div>
    <div class="flex justify-center items-center w-8 h-8 rounded border border-solid bg-neutral-100 border-zinc-100">
      &gt;
    </div>
  </div>
</div>




@else
    <div class="pt-3">
       <h3 class="text-left my-0 pb-3 py-2 font-weight-bold"> My Businesses</h3> 

       <div class="w-50 m-auto d-block">
           <img width="120px" src="../images/randomIcons/no-listing.png">
           <p class="text-left ml-4 font-weight-bold">No Business</p>
       </div>

       <div class="mb-5 pb-3">
        <li style="list-style-type: none;" class="w-50 nav-item py-1 mx-auto text-secondary ">
                        <a href="{{route('add-listing')}}" style="border-radius: 5px;border: 1px solid green;text-decoration: none;" class="px-3 ml-1 btn searchListing py-1" href="">Add Business</a>
                    </li> 
        </div>

    </div>
@endif



<!--   <div class="h-75 w-75 m-auto d-flex align-items-center justify-content-center">
        <div class="mb-5 pb-3 w-50 text-center mx-auto"><li style="list-style-type: none;" class="nav-item py-1 px-3 text-secondary ">
                        <a href="{{route('add-listing')}}" style="border-radius: 5px;border: 1px solid green;text-decoration: none;" class="px-5 btn btn-outline-success font-weight-bold" href="">Add Business</a>
                    </li> </div>

                    <div class="mb-5 pb-3 w-50 text-center mx-auto"><li style="list-style-type: none;" class="nav-item py-1 px-3 text-secondary ">
                        <a href="{{route('add-services')}}" style="border-radius: 5px;border: 1px solid green;text-decoration: none;" class="px-5 btn btn-outline-success font-weight-bold" href="">Add Service</a>
                    </li> </div>
    </div> -->

    @endif
<div class="clearfix my-4"></div>





    <!-- ADD DOC MODAL -->
  <div  class="modal fade" id="multiple_doc" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
         <div class="card-header w-100">
           <h3>Add Documents</h3>
        </div>       

        <button type="button" class="m-0 close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    
    
      <div class="modal-body">
        <form action=""  method="post" enctype="multipart/form-data">
                                @csrf
                                        
                             <!--   <div class="row ">
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label>Document Name</label>
                                            <input required="" name="eq_name" type="text"  class="form-control">
                                        </div>
                                    </div> -->


                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
            <select required=""  name="listing" class="border-none form-control">
            <option hidden class="form-control" >Select Business</option>

            @foreach($business as $b)
            <option value="{{$b->id}}" class="form-control" >{{$b->name}}</option> @endforeach

           </select>
                                        </div>
                                    </div>



                                    <div class="col-12 col-sm-6 my-3">
                                        <div class="form-group">
                                            <label>Files</label>
                                            <input required=""  type="file" multiple name="files[]" class="form-control" >
                                        </div>
                                    </div>

                                   
                           
                                </div>
                                <input type="submit" class="w-50 m-auto my-4 btn btn-primary btn-block" value="Save" />
                            </form>

    </div>
    </div>
    </div>
    </div>
      <!--  ADD MODAL -->



         <!--SUPPORTIVE  ADD MODAL -->
  <div  class="modal fade" id="support_doc" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
         <div class="card-header w-100">
           <h3>Add Documents</h3>
        </div>       

        <button type="button" class="m-0 close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    
    
      <div class="modal-body">
        <form action="{{route('add_docs')}}"  method="post" enctype="multipart/form-data">
                                @csrf
                                
                                <input type="text" value="yes" name="supportive">
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
            <select required=""  name="listing" class="border-none form-control">
            <option hidden class="form-control" >Select Business</option>

            @foreach($business as $b)
            <option value="{{$b->id}}" class="form-control" >{{$b->name}}</option> @endforeach

           </select>
                                        </div>
                                    </div>

                                    <div class="col-12 col-sm-6 my-3">
                                        <div class="form-group">
                                            <label>Files</label>
                                            <input required=""  type="file" multiple name="files[]" class="form-control" >
                                        </div>
                                    </div>

                                   
                           
                                </div>
                                <input type="submit" class="w-50 m-auto my-4 btn btn-primary btn-block" value="Save" />
                            </form>

    </div>
    </div>
    </div>
    </div>
      <!-- ADD MODAL -->




      <!-- ADD VIDEO -->
  <div  class="modal fade" id="add_video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
         <div class="card-header w-100">
           <h3>Upload Media/Video</h3>
        </div>       

        <button type="button" class="m-0 close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    
    
      <div class="modal-body">
        <form action=""  method="post" enctype="multipart/form-data">
                                @csrf
                                        
                             <!--   <div class="row ">
                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
                                            <label>Document Name</label>
                                            <input required="" name="eq_name" type="text"  class="form-control">
                                        </div>
                                    </div> -->


                                    <div class="col-12 col-sm-6">
                                        <div class="form-group">
            <select required=""  name="listing" class="border-none form-control">
            <option hidden class="form-control" >Select Business</option>

            @foreach($business as $b)
            <option value="{{$b->id}}" class="form-control" >{{$b->name}}</option> @endforeach

           </select>
                                        </div>
                                    </div>



                                    <div class="col-12 col-sm-6 my-3">
                                        <div class="form-group">
                                            <label>Files</label>
                                            <input required=""  type="file" multiple name="files" class="form-control" >
                                        </div>
                                    </div>

                                   
                           
                                </div>
                                <input type="submit" class="w-50 m-auto my-4 btn btn-primary btn-block" value="Save" />
                            </form>

    </div>
    </div>
    </div>
    </div>
      <!--  ADD VIDEO -->


    </div>

<script type="text/javascript">
    function bg_change(id) {
        //$('#'+id).addClass('bg_light');
        $('#'+id).addClass('background','#e5eef5b8');
     }
     function bg_changeB(id) {
        //$('#b'+id).addClass('bg_light');
        $('#'+id).css('background','#e5eef5b8');
     }

    window.onload(){
      $('#d_table').removeClass('dataTable ')
    }
</script>

@endsection
