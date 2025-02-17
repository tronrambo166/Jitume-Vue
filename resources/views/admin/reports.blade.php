@extends('admin.layout.mainlayout_admin')
@section('content')	
<!-- Page Wrapper -->
<div class="page-wrapper">
                <div class="content container-fluid">
				
					<!-- Page Header -->
					<div class="page-header">
						<div class="row">
							<div class="col-sm-7 col-auto">
								<h3 class="page-title">Reports</h3>
								<ul class="breadcrumb">
									<li class="breadcrumb-item"><a href="index">Dashboard</a></li>
									<li class="breadcrumb-item active">Reports</li>
								</ul>
							</div>
							
						</div>
					</div>
					<!-- /Page Header -->
					<div class="row">
						<div class="col-sm-12">
							<div class="card">
								<div class="card-body">
									<div class="table-responsive">
										

										<table id="rTable" class="datatable table table-hover table-center mb-0">
											<thead>
												<tr>											
													<!-- <th>Image</th> -->
													<th>Id</th>
													<th>Listing Name</th>
													<th>Category</th>
													<th>Details</th>
													<th>Document</th>
													<th>Status</th>
													<th>Action</th>
													
												</tr>
										
											</thead>
										
											<tbody>	

											@if($reports->count() > 0)

												@foreach($reports as $l)
												<tr>

													<td>
														#{{$l->id}}
													</td>

													<td>
													
													<button  type="button" class="border text-dark btn btn-light py-1 font-weight-bold small" data-toggle="modal" data-target="#exampleModal{{$l->id}}">
														{{$l->listing_name}} 
														<span title="No of reports" class="border rounded-circle px-2 text-danger"> {{$l->total}} </span>
														</button>
													</td>

													<td>
														{{$l->category}}
													</td>
													<td>
														{{$l->details}}
													</td>
													<td>
														{{$l->details}}
													</td>
													<td>
														<p class="text-success font-weight-bold"> {{$l->status}} </p>
													</td>

													<td>
													<a style="font-size:10px;" type="button" class="d-block text-dark btn btn-outline-warning py-1 font-weight-bold small">
														Disable Listing
													</a>

													<a style="font-size:10px;" type="button" class="d-block mt-1 text-dark btn btn-outline-success py-1 font-weight-bold small">
														Mark as Safe
													</a>
													</td>		
												</tr>

						<!-- Modal -->
						<div class="modal fade" id="exampleModal{{$l->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
						  <div class="modal-dialog" role="document">
						    <div class="modal-content mx-auto text-center">
						      <div class="text-center modal-header">
						        <h5 class="modal-title  text-secondary mx-auto" id="exampleModalLabel">User Info </h5>
						        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
						          <span aria-hidden="true">&times;</span>
						        </button>
						      </div>
				      <div class="modal-body w-75 mx-auto">

				      	<div class="my-3 row w-75 mx-auto border">

				        	<div class="col-sm-12">
				        		<h5 class="w-75 text-center mt-2">Details</h5>
				        	</div>
				        	
				        </div>


				        <!-- GENERAL DETAILS -->
				        <div class="row">

				        	<div class="col-sm-6">
				        		<h6 class="w-75 text-left border pl-3 ">Business -</h6>
				        	</div>
				        	<div class="col-sm-6">
				        		<p class="text-center">{{$l->listing_name}}</p>
				        	</div>

				        	<div class="col-sm-6">
				        		<h6 class="w-75 text-left border pl-3 ">Details -</h6>
				        	</div>
				        	<div class="col-sm-6">
				        		<p class="text-center">{{$l->details}}</p>
				        	</div>

				        	<div class="col-sm-6">
				        		<h6 class="w-75 text-left border pl-3 ">Category -</h6>
				        	</div>
				        	<div class="col-sm-6">
				        		<p class="text-center">{{$l->category}}</p>
				        	</div>

				        	<div class="col-sm-6">
				        		<button onclick="otherReports({{$l->id}});" class="w-75 text-left border pl-3 ">View Reports</button>
				        	</div>
				        	<div class="col-sm-6">
				        		<p class="text-center">
							</p>
				        	</div>


				        	<div class="tempDiv">
				        		Loading...

				        	</div>

				        	<div class="row">
				        		<div class="col-sm-3"><p>Id</p></div>
				        		<div class="col-sm-3"><p>Category</p></div>
				        		<div class="col-sm-3"><p>Details</p></div>
				        		<div class="col-sm-3"><p>Document</p></div>

				        	</div>

				        </div>

				      </div>
						      <div class="modal-footer">
						        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						        
						      </div>
						    </div>
						  </div>
						</div>
						<!-- Modal -->
						
												@endforeach
												@endif
											</tbody>
										</table>
											
											


									</div>
								</div>
							</div>
						</div>			
					</div>
				</div>			
			</div>
			<!-- /Page Wrapper -->


	<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>

	<script type="text/javascript">
		//new DataTable('#example');

		// $('#rTable').DataTable({
		//     "ordering": false
		// });

	function otherReports(id){ alert(id);

     $.ajax({
            url:"admin/otherReports/"+id, 
            method:"GET",
            dataType: 'json',
          	success: function(data) {  
            const reports=data.reports;
            console.log(data);

// Top 20 chart
           try{
            Object.entries(reports).forEach(entry => {
            const [key, value] = entry; console.log(key+'=>'+value);
            
                $('#songs').append('<tr><th scope="row" class="text-center">'+i+'</th>     <td> <img width="80px" src="'+art+'" /> </td> <td>'+value.artist+'</td>  <td>'+value.title+'</td> <td> '+move+'</td>  </tr>'); i++;

                
              })
              .catch(error => {
                console.error('Error:', error);
              });
            //LastFM
           
               $('#loading').remove();
               $('#tempDiv').remove();

          }
          catch(e) { if (e !== BreakException) throw e;} 
            

		},
		error:function(data) { console.log(data); }
		 });
 }
	</script>	

			
			








@endsection