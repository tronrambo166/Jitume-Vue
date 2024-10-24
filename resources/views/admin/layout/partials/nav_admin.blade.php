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
							<li class="{{ Request::is('admin/artists') ? 'active' : '' }}"> 
								<a href="artists"><i class="fe fe-layout"></i> <span>Artists</span></a>
							</li>
							
							<li  class="{{ Request::is('admin/users') ? 'active' : '' }}"> 
								<a href="users"><i class="fe fe-user-plus"></i> <span>Users</span></a>
							</li>
							
							<li  class="{{ Request::is('admin/songs') ? 'active' : '' }}"> 
								<a href="songs"><i class="fe fe-users"></i> <span>Songs</span></a>
							</li>
							
						<!--	<li  class="{{ Request::is('admin/reviews') ? 'active' : '' }}"> 
								<a href="reviews"><i class="fe fe-star-o"></i> <span>Reviews</span></a>
							</li> -->

							
						</ul>
					</div>
                </div>
            </div>
			<!-- /Sidebar -->