@extends('admin.layout.mainlayout_admin')
@section('content')	
<!-- Page Wrapper -->
<div class="page-wrapper">
                <div class="content container-fluid">
				
					<!-- Page Header -->
					<div class="page-header">
						<div class="row">
							<div class="col-sm-7 col-auto">
								<h3 class="page-title">Active Services</h3>
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
													<!-- <th>Image</th> -->
													<th>User(Owner)</th>
													<th class="">Service</th>
													<th>Amount</th>
													<th>Email</th>
													
												</tr>
										
											</thead>
										
											<tbody>				
												@foreach($businesses as $key=>$l)
												<tr>
													<!-- <td>N/A</td> -->
													<td>{{$l[0]->fname.' '.$l[0]->lname}}</td>
													<td style="color:#267c6f;font-weight: bold;">{{$l[0]->name}}</td>

													<td style="color:#267c6f;font-weight: bold;">${{$l[0]->price}}</td>

	
													<td>{{$l[0]->email}}</td>
													
													
													
												</tr>

						
												@endforeach
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
		new DataTable('#example');
	</script>	

			
			








@endsection