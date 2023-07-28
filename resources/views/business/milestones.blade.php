@extends('business.layout')

@section('page')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="container" id="" style="background:white;">
        
        

<div class="card-header w-100 mt-5">
           <h4 class="w-50 d-inline">Your Milestones</h4>

 <div class="w-75 d-inline-block">
  <div class="dropdown show d-block ml-5 mt-3">
                  <a class="mile btn py-1 dropdown-toggle float-right" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    @if(isset($business_name)) {{$business_name}} @else Select Business @endif
                  </a>
                 <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li style="list-style-type: none;" class="text-center mt-3 nav-item py-1 px-0 text-secondary">
                          @foreach($business as $b)
                <a style="font-size:13px;" class="dropdown-item" href="{{route('milestones', $b->id) }}">{{$b->name}}</a>
                 @endforeach

                    </li>
                    
                  </div>
                </div> 


</div>

      
         <!-- <div class="w-50 d-inline-block float-right">
          <select onchange="BusinessMilestones(this.value);" class="w-50" required  name="business_id" class="w-100 rounded border border-dark p-2 ">

            @foreach($business as $b)
            <option value="{{$b->id}}" class="form-control" >{{$b->name}}</option> @endforeach

           </select> 
            </div> -->

  

            </div>


 <div class="row pt-4  m-auto">

            
    <table class="eq table table-bordered " id="">
    <thead>
        <tr>
            <th>Milestone Name </th>
            <th>Business </th>
            <th>Amount</th>
            <th>Status</th>
            <th width="20%" class="py-1 text-center">Action</th>        
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
            <select  name="status" style="width:65%;" class=" d-inline rounded border border-dark p-1 ">
                 
                
            @if($ev->status == 'In Progress')
            <option selected hidden value="In Progress" class="form-control" >In Progress</option> 
             <option value="To Do" class="form-control" >To Do</option>
             <option value="Done" class="form-control" >Done</option>

              @else
               <option disabled selected hidden value="{{$ev->status}}"class="border-none form-control" >{{$ev->status}}</option>

            @endif

            
           </select>
          

           <input type="submit" value="Set" class="ml-2 py-0 mb-1 d-inline btn btn-success w-25">

            <input hidden type="number" name="id" value="{{$ev->id}}">
           </form> 

                     </td>

            <td class="text-center">
            
            <div class="dropdown show d-inline-block">
                  <a class="py-0 btn btn-light dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Action 
                  </a>
                 <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">

            <a href="{{route('delete_milestone',$ev->id)}}" class="btn dropdown-item rounded btn-light border border-dark my-1">Delete</a>
            </div>  
            

            </td>
        </tr>

    @endforeach
    </tbody> 
    
    
</table>
               

                </div>

                </div>

               

            </div>


            <div class="clear"></div>
            <div class="clearfix py-5"></div>

        </div>


@endsection



