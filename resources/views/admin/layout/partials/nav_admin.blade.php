<!-- Sidebar -->
<div class="sidebar" id="sidebar">
                <div class="sidebar-inner slimscroll">
					<div id="sidebar-menu" class="sidebar-menu">
						<ul>
							<li class="menu-title"> 
								<span>Main</span>
							</li>
							<li class="{{ Request::is('admin/index_admin') ? 'active' : '' }}"> 
								<a href="index_admin"><i class="fe fe-home"></i> <span>Dashboard</span></a>
							</li>
							<!-- <li class="{{ Request::is('admin/artists') ? 'active' : '' }}"> 
								<a href="artists"><i class="fe fe-layout"></i> <span>Artists</span></a>
							</li> -->
							
							<li  class="{{ Request::is('admin/users') ? 'active' : '' }}"> 
								<a href="users"><i class="fe fe-user-plus"></i> <span>Users</span></a>
							</li>

							<li  class="{{ Request::is('admin/listings-active') ? 'active' : '' }}"> 
								<a href="listings-active"><i style="font-size: 18px;" class="fa fa-list fa-1x"></i> <span>Active Businesses</span></a>
							</li>

							<li  class="{{ Request::is('admin/services-active') ? 'active' : '' }}"> 
								<a href="services-active"><img style="width: 18px;" src="../images/admin/active.png" /> <span>Active Services</span></a>
							</li>

							<li  class="{{ Request::is('admin/prospects') ? 'active' : '' }}"> 
								<a href="prospects"><img style="width: 18px;" src="../images/admin/prospects.png" /> <span>Prospects</span></a>
							</li>

							<li  class="{{ Request::is('admin/disputes') ? 'active' : '' }}"> 
								<a href="disputes"><img style="width: 18px;" src="../images/admin/disputes.png" /> <span>Disputes</span></a>
							</li>

							<li  class="{{ Request::is('admin/reports') ? 'active' : '' }}"> 
								<a href="reports"><img style="width: 18px;" src="../images/admin/reports.png" /> <span>Reports</span></a>
							</li>
							
							
							<!-- <li  class="{{ Request::is('admin/songs') ? 'active' : '' }}"> 
								<a href="songs"><i class="fe fe-users"></i> <span>Songs</span></a>
							</li> -->
							
						

							
						</ul>
					</div>
                </div>
            </div>
			<!-- /Sidebar -->