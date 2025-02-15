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

											@if($sortedReports)

												@foreach($sortedReports as $l)
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
						        <h5 class="modal-title  text-secondary mx-auto" id="exampleModalLabel">Report List ({{gettype($l->data)}})</h5>

						        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
						          <span aria-hidden="true">&times;</span>
						        </button>
						      </div>

				      <div class="modal-body w-75 mx-auto">

				      	<div class="my-3 row w-75 mx-auto border">


				        	<div class="col-sm-6">

			        		@if(isset($l->data))
			        		@foreach(json_decode($l->data, true) as $subReport)
			        		<p class="font-weight-bold border shadow text-center mt-2
			        		">Test Report Listing - {{$subReport}}</p>
			        		@endforeach
			        		@endif

				        	</div>
				        </div>


				        <!-- GENERAL DETAILS -->
				        <div class="row">

				        	<div class="col-sm-6">
				        		<h6 class="w-75 text-left border pl-3 ">DOB</h6>
				        	</div>
				        	<div class="col-sm-6">
				        		<p class="text-center">@if($l->dob == '')
							N/A
							@else
							{{$l->dob}}
							@endif</p>
				        	</div>

				        	<div class="col-sm-6">
				        		<h6 class="w-75 text-left border pl-3 ">Gender</h6>
				        	</div>
				        	<div class="col-sm-6">
				        		<p class="text-center">@if($l->gender == '')
							N/A
							@else
							{{$l->gender}}
							@endif</p>
				        	</div>

				        	<div class="col-sm-6">
				        		<h6 class="w-75 text-left border pl-3 ">Email</h6>
				        	</div>
				        	<div class="col-sm-6">
				        		<p class="text-center">{{$l->email}}</p>
				        	</div>

				        	<div class="col-sm-6">
				        		<h6 class="w-75 text-left border pl-3 ">Id No</h6>
				        	</div>
				        	<div class="col-sm-6">
				        		<p class="text-center">@if($l->id_no == '')
							N/A
							@else
							{{$l->id_no}}
							@endif</p>
				        	</div>

				        	<div class="col-sm-6">
				        		<h6 class="w-75 text-left border pl-3">Tax Pin</h6>
				        	</div>
				        	<div class="col-sm-6">
				        		<p class="text-center">@if($l->tax_pin == '')
							N/A
							@else
							{{$l->tax_pin}}
							@endif</p>
				        	</div>

				        	<div class="col-sm-6">
				        		<h6 class="w-75 text-left border pl-3">Investment Range</h6>
				        	</div>
				        	<div class="col-sm-6">
				        		<p class="text-center">@if($l->inv_range == '')
							N/A
							@else
							{{$l->inv_range}}
							@endif</p>
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


			
	<script type="text/javascript">
		//new DataTable('#example');

		$('#rTable').DataTable({
		    "ordering": false
		});
	</script>	

			
			








@endsection