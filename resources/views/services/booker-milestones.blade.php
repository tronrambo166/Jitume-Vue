@extends('business.layout')

@section('page')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="container px-0" id="" >
        
        
    <h4 class="bid_header px-3 w-100 text-left my-0 pb-3 py-2 font-weight-bold"> Milestones</h4>  
    <div class="row mx-auto mb-0">
            
     <table class="eq table" id="">
    <thead class="table_head">
        <tr>
            <th>Date Added </th>
            <th>Service Name </th>
            <th>Milestone Name </th>
            <th>Duration </th>  
            <th>Document </th> 
            <th>Amount </th> 
            <th>Status </th>        
        </tr>

    </thead>
    

    
    <tbody>
        @foreach($results as $ev)
        <tr onclick="bg_change({{$ev->id}});" id="{{$ev->id}}">
            <td>{{$ev->created_at }}</td>
            <td>{{$ev->service }}</td>
                <td>{{$ev->title }}</td>
                    <td>{{$ev->n_o_days }} days</td>
                        <td width="20%" class="">
                         
                        <div class="upload-btn-wrapper">
                        <label for="file-upload2" class="btndown_listing">Download documentation
                        <a href="{{route('assetEquip/download',['id' => $ev->id, 'type' => 'legal_doc'] )}}">
                        <img src="../images/down.svg" width="15px"> 
                        </a>
                        </label>
                        </div>
                       
                        <td>{{$ev->amount }}</td>
                        <td>{{$ev->status }}</td>
        </tr>


         @endforeach
         @if(count($results)==0)
         <td  > No data found! </td>
         @endif
    
    </tbody> 
    
    
</table>
               

                </div>

                </div>


            </div>


            <div class="clear"></div>
          

        </div>


@endsection


