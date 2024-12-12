@extends('admin.layout.mainlayout_admin')
@section('content')	
<!-- Page Wrapper -->
<div class="page-wrapper">
                <div class="content container-fluid">
				
					<!-- Page Header -->
					<div class="page-header">
						<div class="row">
							<div class="col-sm-7 col-auto">
								<h3 class="page-title">Users</h3>
								<ul class="breadcrumb">
									<li class="breadcrumb-item"><a href="index">Dashboard</a></li>
									<li class="breadcrumb-item active">Users</li>
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
										

										<table class="datatable table table-hover table-center mb-0">
											<thead>
												<tr>	
																								
													<th>Image</th>
													<th>User</th>
													<th class="">Type</th>
													<th>Website</th>
													<th>Email</th>
													
													<th class="text-right">Action</th>
												</tr>
										
											</thead>
										
											<tbody>				
												@foreach($businesses as $l)
												<tr>
													{{$l}}

												



													

													

														
												
													<td>N/A</td>
													<td>{{$l['fname'].' '.$l['lname']}}</td>

													

													
													
													<td>{{$l['email']}}</td>
													

													
													<td class="text-right">
														<div class="actions">
															

							<button type="button" class="border text-dark btn btn-light py-1" data-toggle="modal" data-target="#exampleModal{{$l['id']}}">
							More Info
							</button>


							<a onclick="return confirm('Are you sure...?') "  href="{{route('del_users',$l['id'])}}" class="btn btn-sm bg-danger-light">
																<i class="fe fe-trash"></i> Delete
															</a>
														</div>
													</td>
												</tr>

						
												@endforeach
											
											


									</div>
								</div>
							</div>
						</div>			
					</div>
				</div>			
			</div>
			<!-- /Page Wrapper -->


			
	<script type="text/javascript">
		$('#myModal').on('shown.bs.modal', function () {
		  $('#myInput').trigger('focus')
		});
	</script>		
			
			








@endsection