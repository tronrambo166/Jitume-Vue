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
												@foreach($users as $l)
												<tr>

												



													<!-- <td>
													<h2 class="table-avatar">
															<a  class="avatar avatar-lg mr-2"><img class="avatar-img rounded-circle" src="../assets_admin/img/doctors/{{$l->image}}" alt="User Image"></a>
															<a href="profile">{{$l->name}} </a>
														</h2>  -->

													

														
												
													<td>N/A</td>
													<td>{{$l->fname.' '.$l->lname}}</td>

													@if($l->investor == '')
													<td style="color:green;" class=" font-weight-bold">Business/Service</td>
													@else
													<td style="color:green;" class=" font-weight-bold">Investor</td>
													@endif

													@if($l->website == '')
													<td>N/A</td>
													@else
													<td>{{$l->website}}</td>
													@endif
													
													<td>{{$l->email}}</td>
													

													
													<td class="text-right">
														<div class="actions">
															<!-- <a class="btn btn-sm bg-success-light" data-toggle="modal" href="#edit_specialities_details{{$l->id}}">
																<i class="fe fe-pencil"></i> Edit
															</a> -->

							<button type="button" class="border text-dark btn btn-light py-1" data-toggle="modal" data-target="#exampleModal{{$l->id}}">
							More Info
							</button>


							<a onclick="return confirm('Are you sure...?') "  href="{{route('del_users',$l->id)}}" class="btn btn-sm bg-danger-light">
																<i class="fe fe-trash"></i> Delete
															</a>
														</div>
													</td>
												</tr>

												<!-- Modal -->
												<div class="modal fade" id="exampleModal{{$l->id}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
												  <div class="modal-dialog" role="document">
												    <div class="modal-content">
												      <div class="text-center modal-header">
												        <h5 class="modal-title  text-secondary mx-auto" id="exampleModalLabel">User Info ({{$l->fname.' '.$l->lname}})</h5>
												        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
												          <span aria-hidden="true">&times;</span>
												        </button>
												      </div>
										      <div class="modal-body">

										      	<div class="my-3 row w-75 mx-auto border">

										        	<div class="col-sm-6">
										        		<h5 class="w-75 text-center mt-1   ">User Type</h6>
										        	</div>
										        	<div class="col-sm-6">
										        		<p class="text-center mt-1">@if($l->investor == '')
														Business/Service
														@else
														Investor
														@endif</p>
										        	</div>
										        </div>
										        
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