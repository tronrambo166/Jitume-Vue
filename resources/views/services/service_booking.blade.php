@extends('business.layout')

@section('page')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="container px-0" id="">
        
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

@if(count($results)==0)
<div class="p-3"> 
             <div class="w-50 m-auto d-block">
                 <img width="120px" src="../images/randomIcons/no_data.png">
                 <p class="text-left ml-2 font-weight-bold">No Data Found!</p>
             </div>
</div>

 @else
    
 <form action="{{route('bookingAccepted')}}" method="post">  @csrf  
    <div class="row m-auto px-5">   
    <h3 class="bid_header px-0 my-0 text-left pb-3 py-2 font-weight-bold">Service Bookings</h3>     
     <table class="eq table" id="">
     <thead class="table_head border">
        <tr>
            <th> </th>
            <th>Date </th>
            <th>Service Name </th>
            <th>Customer</th>
            <th>Notes </th>  
            <th>Start Date  </th> 
            <th>Location </th>        
        </tr>

    </thead>
    

    
    <tbody>
        @foreach($results as $ev)
        <tr onclick="bg_change({{$ev->id}});" id="{{$ev->id}}" > 
            <td><input onchange="check();" type="checkbox" name="bid_ids[]" value="{{$ev->id}}"></td>
            <td>{{$ev->created_at }}</td>
                <td>
                {{$ev->service }}
                </td>

                    <td>
                    <a data-target="#detailsModal{{$ev->id}}" data-toggle="modal" class="py-1 bid_btns bg-light rounded ">Details</a>
                    </td>
                    <td>{{$ev->note }}</td>

                        <td>{{$ev->date }}</td>
                        <td>{{$ev->location }}</td>
   
        </tr>

<input hidden type="number" name="isAsset" value="{{$ev->category}}">

<!-- Table temp end -->

<!-- Details MODAL -->
  <div  class="detailsModal modal fade" id="detailsModal{{$ev->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content detailModal">
      <div class="modal-header">

         <div class="card-header w-100">
           
        </div>

        </div>
    
    
      <div class="modal-body">
                <div class="px-3 card-header w-100">             
            <!-- <input hidden type="number" class="form-control"  name="amount" value=""> -->                     

                <div class="row my-1 row form-group">
                    <div class="col-sm-12 my-1"> 
                    <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h5 class=""> <b> Full Name: </b> </h5></label>
                               </div>
                    
                    <div class="col-sm-12"> 
                        <div class="upload-btn-wrapper">
                        <p>{{$ev->customer_name}}</p>
                        </div>
                    </div>

                    </div>
                    </div> 
                </div>



                <div class="row my-1 row form-group">
                    <div class="col-sm-12 my-1"> 
                    <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h5 class=""> <b> Current Website or Web Presence: </b> </h5></label>
                               </div>
                    
                    <div class="col-sm-12"> 
                        <div class="upload-btn-wrapper">
                        <p>{{$ev->website}}</p>
                        </div>
                    </div>

                    </div>
                    </div> 
                </div>


                <div class="row my-1 row form-group">
                    <div class="col-sm-12 my-1"> 
                    <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h5 class=""> <b> Email: </b> </h5></label>
                               </div>
                    
                    <div class="col-sm-12"> 
                        <div class="upload-btn-wrapper">
                        <p>{{$ev->email}}</p>
                        </div>
                    </div>

                    </div>
                    </div> 
                </div>


         </div>

        </div>

        <div class="modal-footer">

        <div class="card-header w-100 text-center">


        <button type="button" class=" btn border border-dark w-25 d-inline px-3 font-weight-bold m-0 " data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">Ok</span>
        </button>

        
         </div>

      </div>

        </div>
        </div>
        </div>


<!-- Details MODAL -->

         @endforeach
    
    </tbody> 
    
    
</table>
 
 <div class="row ml-auto" style="width:35%;"> 
 <div class="col-sm-6 float-right"> </div>             
<div class="col-sm-6 float-right">
    <a id="fakeBtn" onclick="accept();" type="submit" class="bid-accept text-center float-right border btn text-mute py-1 w-100 mx-auto">Confirm</a>

    <button onclick="return confirm('Are you sure?');" style="background:#083608;" id="realBtn" type="submit" class="bid-accept collapse float-right btn text-light w-100 mx-auto">Confirm</button>
</div>

<!-- <div class="col-sm-6">
    <a id="fakeBtnR" onclick="accept();" type="submit" class="bid-accept text-center float-right border border-dark font-weight-bold btn text-mute py-1 w-100 mx-auto">Reject Bids</a>

    <button style="background:red;" name="reject" value="1" onclick="return confirm('Are you sure?');" id="realBtnR" type="submit" class="bid-accept collapse float-right font-weight-bold btn text-light w-100 mx-auto">Reject Bids</button>
</div> -->
</div>

</div>
</form>

@endif

</div>


<script type="text/javascript">
  function accept() {
            alert('Please select a booking!');
    }

    function check() {
    var checked  = '';
    [...document.querySelectorAll('input[name="bid_ids[]"]:checked')]
   .forEach((cb) => checked = checked+cb.value+',');

        var ids = checked;
        if(ids != '')
        {
        $('#fakeBtn').hide();
        $('#fakeBtnR').hide();
        $('#realBtn').removeClass('collapse');
        $('#realBtnR').removeClass('collapse');   
        }
        else{
        $('#fakeBtn').show();
        $('#fakeBtnR').show();
        $('#realBtn').hide();
        $('#realBtnR').hide();
        }
    }
</script>
                


@endsection



