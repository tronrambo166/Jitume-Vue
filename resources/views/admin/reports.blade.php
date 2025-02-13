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
													<p  type="button" class="border text-dark btn btn-light py-1 font-weight-bold small">
														{{$l->listing_name}} 
														<span title="No of reports" class="border rounded-circle px-2 text-danger"> {{$l->total}} </span>
													</p>
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