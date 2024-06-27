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

@if(count($bids)==0)
<div class="p-3"> 
             <div class="w-50 m-auto d-block">
                 <img width="120px" src="../images/randomIcons/no_data.png">
                 <p class="text-left ml-2 font-weight-bold">No Data Found!</p>
             </div>
          </div>

@else 
 <form action="{{route('bidsAccepted')}}" method="post">  @csrf  
    <div class="row m-auto px-5">   
    <h3 class="px-0 bid_header my-0 text-left pb-3 py-2 font-weight-bold">Investment Bids</h3>     
     <table class="eq table" id="">
    <thead class="table_head border">
        <tr>
            <th> </th>
            <th>Date </th>
            <th>Investor </th>
            <th>Business</th>
            <th>Type </th>  
            <th>Amount </th> 
            <th>Representaion % </th>        
        </tr>

    </thead>
    

    
    <tbody>
        @foreach($bids as $ev)
        <tr onclick="bg_change({{$ev->id}});" id="{{$ev->id}}" >
            <td><input onchange="check();" type="checkbox" name="bid_ids[]" value="{{$ev->id}}"></td>
            <td>{{$ev->date }}</td>
                <td>
                <a  data-target="#detailsModal{{$ev->id}}" data-toggle="modal" class="bid_btns bg-light rounded ">{{$ev->investor }}</a>
                </td>

                    <td class="">{{$ev->business }}</td>
                        <td>
                        @if($ev->type == 'Asset')
                         <a data-target="#assetModal{{$ev->id}}" data-toggle="modal" class="bid_btns bg-light rounded ">{{$ev->type }}</a>
                         @else
                         <a class="bg-light rounded ">{{$ev->type }}</a>
                         @endif
                        </td>

                        <td>{{$ev->amount }}</td>
                        <td>{{$ev->representation }}</td>
   
        </tr>



<!-- Table temp end -->

<!-- Details MODAL -->
  <div  class="detailsModal modal fade" id="detailsModal{{$ev->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
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
                        <p>{{$ev->investor_name}}</p>
                        </div>
                    </div>

                    </div>
                    </div> 
                </div>


                <div class="row my-1 row form-group">
                    <div class="col-sm-12 my-1"> 
                    <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h5 class=""> <b> Investment Range: </b> </h5></label>
                               </div>
                    
                    <div class="col-sm-12"> 
                        <div class="upload-btn-wrapper">
                        <p>{{$ev->inv_range}}</p>
                        </div>
                    </div>

                    </div>
                    </div> 
                </div>


                <div class="row my-1 row form-group">
                    <div class="col-sm-12 my-1"> 
                    <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h5 class=""> <b> Industries Interested In Investing: </b> </h5></label>
                               </div>
                    
                    <div class="col-sm-12"> 
                        <div class="upload-btn-wrapper">
                        <p>{{$ev->interested_cats}}</p>
                        </div>
                    </div>

                    </div>
                    </div> 
                </div>


                <div class="row my-1 row form-group">
                    <div class="col-sm-12 my-1"> 
                    <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h5 class=""> <b> Details of Past Investment And Track Record: </b> </h5></label>
                               </div>
                    
                    <div class="col-sm-12"> 
                        <div class="upload-btn-wrapper">
                        <p>{{$ev->past_investment}}</p>
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
            <form action="stripe" method="get">
       
                 <input type="text" hidden id="price" name="price" :value="form.investors_fee">
                  <input type="number" hidden id="listing_id" name="listing_id" :value="form.listing_id">


        <button type="button" class=" btn border border-dark w-25 d-inline px-3 font-weight-bold m-0 " data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">Ok</span>
        </button>

            </form>
        
         </div>

      </div>

        </div>
        </div>
        </div>


<!-- Details MODAL -->



<!-- Asset MODAL -->
  <div  class="assetModal modal fade" id="assetModal{{$ev->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
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
                                <h6 class=""> <b> Download good quality photos of the assets </b> </h6></label>
                               </div>
                    
                    <div class="col-sm-12">
                        <div class="row">
                        @if($ev->type == 'Asset')
                        @foreach($ev->photos as $photo)
                        @if($photo != null)

                        <div class="col-sm-3 text-center">
                        <img style="height: 50px;" src="../{{$photo}}" width="70%;">
                          <div class="upload-btn-wrapper mt-1">
                          <label for="file-upload2" class="btndown_listing">
                          @php $photo = str_replace('/','__',$photo); @endphp
                          <a href="{{route('assetEquip/download',['id' => $photo, 'type' => 'photos'] )}}">                  
                          <img src="../images/down.svg" width="15px"> 
                          </a>
                          </label>

                           </div>
                        </div>
                        @endif
                        @endforeach
                        @endif
                        </div>
                        


                    </div>

                        </div>
                    </div> 
                </div>


                  <div class="row my-1 row form-group">
                    <div class="col-sm-12 my-1"> 
                        <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h6 class=""> <b> Download legal documents that act as evidence of the ownership of the Assets (Original purchase receipt/titles/certificates etc) </b> </h6></label>
                               </div>
                    
                    <div class="col-sm-2"> 
                        <div class="upload-btn-wrapper">
                        <label for="file-upload2" class="btndown_listing">
                        <a href="{{route('assetEquip/download',['id' => $ev->id, 'type' => 'legal_doc'] )}}">
                        <img src="../images/down.svg" width="15px"> 
                        </a>
                      </label>
                  </div>
                    </div>

                        </div>
                    </div> 
                </div>


                  <div class="row my-1 row form-group">
                    <div class="col-sm-12 my-1"> 
                        <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h6 class=""> <b>Asset’s make, model, and serial number </b> </h6></label>
                               </div>
                    
                    <div class="col-sm-10"> 
                      <p class="">{{$ev->serial}}</p>
                        </div>
                    </div> 
                </div>
                </div>


                  <div class="row my-1 row form-group">
                    <div class="col-sm-12 my-1"> 
                        <div class="row">
                           <div class="col-sm-10"><label class="h4" for="name">
                                <h6 class=""> <b> Download other Asset records </b> </h6></label>
                               </div>
                    
                    @if($ev->optional_doc)
                    <div class="col-sm-2"> 
                        <div class="upload-btn-wrapper">
                        <label for="file-upload2" class="btndown_listing">
                        <a href="{{route('assetEquip/download',['id' => $ev->id, 'type' => 'optional_doc'] )}}">
                        <img src="../images/down.svg" width="15px"> 
                        </a>
                      </label>
                    </div>
                    </div>
                    @endif

                        </div>
                    </div> 
                </div>

                
        
         </div>

      </div>

    <div class="modal-footer">

            <div class="row my-5 w-50 mx-auto text-center"> 
                    <button type="button" class=" btn border border-dark w-50 mx-auto d-inline px-5 font-weight-bold my-0 " data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">Ok</span>
                    </button>
                </div>

      </div>

        </div>
        </div>
        </div>


<!-- Asset MODAL -->


         @endforeach
    
    </tbody> 
    
    
</table>
 
 @if(count($bids) !=0 )
 <div class="row ml-auto" style="width:35%;">              
<div class="col-sm-6">
    <a id="fakeBtn" onclick="accept();" type="submit" class="bid-accept text-center float-right border btn text-mute py-1 w-100 mx-auto">Accept Bids</a>

    <button style="background:#083608;" onclick="return confirm('Are you sure?');" id="realBtn" type="submit" class="bid-accept collapse float-right btn text-light w-100 mx-auto">Accept Bids</button>
</div>

<div class="col-sm-6">
    <a id="fakeBtnR" onclick="accept();" type="submit" class="bid-accept text-center float-right border btn text-mute py-1 w-100 mx-auto">Reject Bids</a>

    <button style="background:yellowgreen;" onclick="return confirm('Are you sure?');" name="reject" value="1" onclick="return confirm('Are you sure?');" id="realBtnR" type="submit" class="bid-accept collapse float-right btn text-light w-100 mx-auto">Reject Bids</button>
</div>
</div>
@endif

</div>
</form>

 @endif


</div>


<script type="text/javascript">
  function accept() {
            alert('Please select a bid!');
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
        $('#realBtn').removeClass("collapse");
        $('#realBtnR').removeClass("collapse"); 
        $('#realBtn').show();
        $('#realBtnR').show();   
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



