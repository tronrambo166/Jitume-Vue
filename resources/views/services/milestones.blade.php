@extends('business.layout')

@section('page')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="container px-0" id="" >
        
        

<div class="card-header w-100">
<h3 class="bid_header px-5 w-100 text-left my-0 pb-3 py-2 font-weight-bold">Milestones </h3> 

 <div class="mx-5 my-4 my-2 ml-auto d-block">

                <form action="{{route('findMilestones')}}" method="post">@csrf
                <select name="service_id" required onchange="getBookers(this.value);" class="border px-2 py-1 mx-1">
                    <option hidden value="">Select Service</option>
                    @foreach($business as $b)
                    <option class="form-control" value="{{$b->id}}">{{$b->name}}</option>
                    @endforeach
                </select>

                <select name="booker_id" id="bookers" required class="border px-2 py-1 mx-1">
                    <option value="">Select Customer</option>
                </select>

                <button style="font-weight:400;" type="submit" class="mileFindBtn btn border px-4">Find</button>
            </form> 


</div>

<div class="mx-5 my-4 my-2 ml-auto d-block">
    @if(isset($booker_name))
    <div class="row">
        <div class="col-sm-3"><p class="ml-1 font-weight-bold">Service: {{$s_name}}</p> </div>
        <div class="col-sm-3"><p class="font-weight-bold">Booker: {{$booker_name}}</p> </div>
    </div>
    @endif
</div>

      
         <!-- <div class="w-50 d-inline-block float-right">
          <select onchange="BusinessMilestones(this.value);" class="w-50" required  name="business_id" class="w-100 rounded border border-dark p-2 ">

            @foreach($business as $b)
            <option value="{{$b->id}}" class="form-control" >{{$b->name}}</option> @endforeach

           </select> 
            </div> -->

  

            </div>


 <div class="row px-5 m-auto">

            
    <table class="eq table" id="">
    <thead class="table_head border">
        <tr>
            <th>Milestone Name </th>
            <th>Service </th>
            <th>Amount</th>
            <th width="30%">Status</th>
            <th class="text-center">Action</th>        
        </tr>

    </thead>
    

    
    <tbody> @php $c=1; @endphp
        @if($milestones)
        @foreach($milestones as $ev)
        <tr >
            <td>{{$ev->title }}</td>
                <td> @foreach($business as $b)
                     @if($ev->service_id == $b->id)
                       {{$b->name}}
                       @endif @endforeach
               </td>
                    <td>{{$ev->amount }}</td>

                     <td>

           

        <form action="{{route('mile_s_status')}}" method="post" class="form-inline">@csrf
            <select  name="status" style="width:50%;" class="py-1 border border-none text-center d-inline rounded p-1 ">
                 
                
            @if($ev->status == 'Created' || $ev->status == 'In Progress')
             <option selected hidden value="In Progress" class="form-control" >In Progress </option> 
             <option value="To Do"class="form-control" >To Do</option>
             <option value="Done" class="form-control" >Done</option>
             <option value="Cancelled" class="form-control" >Cancelled</option>

            @elseif($ev->status == 'To Do')
             <option value="In Progress" class="form-control" >In Progress</option>
             <option selected hidden value="To Do"class="form-control" >To Do</option>
             <option value="Done" class="form-control" >Done</option>
             <option value="Cancelled" class="form-control" >Cancelled</option>

              @else
               <option disabled selected hidden value="{{$ev->status}}"class="form-control" >{{$ev->status}}</option>
               <option value="Done" class="form-control" >Done</option>

            @endif

            
           </select>
          

           <input type="submit" value="Set" class="ml-2 py-0 mb-1 d-inline buttonEq2 w-25">

            <input hidden type="number" name="id" value="{{$ev->id}}">
           </form> 

                     </td>

            <td class="text-center">
            
            <div class="dropdown show d-inline-block">
                  <a class="py-0 btn border dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Action 
                  </a>
                 <div class="dropdown-menu py-0" aria-labelledby="dropdownMenuLink">

            <a onclick="return confirm('Are you sure?');" href="{{route('delete_s_milestone',$ev->id)}}" class="btn dropdown-item rounded btn-light py-0 my-1">Delete</a>
            </div>  
            

            </td>
        </tr>

    @endforeach
    @endif
    </tbody> 
    
    
</table>
               

                </div>

                </div>

               

            </div>


            <div class="clear"></div>
            <div class="clearfix py-5"></div>

        </div>

<script type="text/javascript">
    function getBookers(s_id) {
          $("#bookers").html('');
          $.ajax({
                url: 'getBookers/' + s_id,
                method: 'get',
                dataType: 'json',
                success: function(response) { console.log(response);
                    for (i = 0; i < response.data.length; i++) {
                        if(response.data[i] != null){
                            var name = response.data[i].fname+' '+
                            response.data[i].lname;
                            var id = response.data[i].id;
                            $("#bookers").append('<option class="form-control" value="'+id+'">'+name+'</option>');
                        }
                    } 

                },
                error: function(error) {
                    console.log(error);
                }

            });
        }
</script>

@endsection



