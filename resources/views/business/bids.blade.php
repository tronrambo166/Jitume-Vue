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
    
 <form action="{{route('bidsAccepted')}}" method="post">  @csrf  
    <div class="row pt-4  m-auto">        
     <table class="eq table table-bordered " id="">
    <thead>
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
        <tr >
            <td><input onchange="check();" type="checkbox" name="bid_ids[]" value="{{$ev->id}}"></td>
            <td>{{$ev->date }}</td>
                <td>{{$ev->investor }}</td>
                    <td>{{$ev->business }}</td>
                        <td>{{$ev->type }}</td>
                        <td>{{$ev->amount }}</td>
                        <td>{{$ev->representation }}</td>
   
        </tr>


         @endforeach
         @if(count($bids)==0)
         <td  > No data found! </td>
         @endif
    
    </tbody> 
    
    
</table>
               
<div class=" ml-auto">
    <a id="fakeBtn" onclick="accept();" type="submit" class="text-center float-right font-weight-bold btn-secondary text-mute py-1 w-25 mx-auto">Accept</a>

    <button id="realBtn" type="submit" class="collapse float-right font-weight-bold btn-success w-25 mx-auto">Accept</button>
</div>

</div>
</form>


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
        $('#realBtn').show();
        }
        else{
        $('#fakeBtn').show();
        $('#realBtn').hide();
        }
    }
</script>
                


@endsection



