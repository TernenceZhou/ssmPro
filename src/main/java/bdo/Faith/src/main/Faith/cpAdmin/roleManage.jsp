<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<div class="content bg-gray-lighter">
		<div class="row items-push">
			<div class="col-sm-7">
				<h1 id="page_head" class="page-heading"></h1>
			</div>
			<div class="col-sm-5 text-right hidden-xs">
				<ol id="page_title" class="breadcrumb push-10-t">
				</ol>
			</div>
		</div>
	</div>
	<div class="content">
		<div class="block block-themed">
			<div class="block-header bg-primary">
				<ul class="block-options">
					<li>
						<button id="btn_search" type="button">
							<i class="fa fa-search">&nbsp;搜索</i>
						</button>
					</li>
					<li>
						<button id="btn_clear" type="button">
							<i class="fa fa-repeat">&nbsp;重置</i>
						</button>
					</li>
					<li>
						<button type="button" data-toggle="block-option"
							data-action="content_toggle"></button>
					</li>
				</ul>
				<h3 class="block-title">搜索条件设定</h3>
			</div>
			<div class="block-content">
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group">
						<div class="col-sm-3">
							<div class="form-material">
								<input class="form-control" type="text" id="searchrole_name">
								<label for="searchrole_name">角色名称</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-3">
							<div class="form-material">
								<input class="form-control" type="text" id="searchrole_user">
								<label for="searchrole_user">角色人员</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<br>
		</div>
		<div class="block block-themed">
			<div class="block-header bg-primary">
				<ul class="block-options">
					<li>
						<button id="btn_roleadd" type="button">
							<i class="fa fa-plus" title="新增"></i>
						</button>
					</li>
					<li>
						<button type="button" data-toggle="block-option"
							data-action="content_toggle"></button>
					</li>
				</ul>
				<h3 class="block-title">角色一览</h3>
			</div>
			<div class="block-content">
				<table id="roletable" class="table table-bordered table-striped table-hover">
				</table>
			</div>
			<br>
		</div>
	</div>
	
	<div class="modal fade" id="modal_role" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">角色信息</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<form class="form-horizontal" id="form_role"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_authorize" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">角色权限调整</h3>
					</div>
				</div>
				<div class="modal-body">
					<div class="block block-bordered">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_authorizeSearch" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
										</button>
									</li>
									<li>
										<button id="btn_authorizeClear" type="button">
											<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">搜索条件设定</h3>
							</div>
							<div id="search-teamCondition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_menuPath">
												<label for="search_menuPath">菜单路径</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_menuName">
												<label for="search_menuName">菜单名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="search_lowerLevel">
													<option></option>
												</select><label for="search_lowerLevel">下级情况</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="search_type">
													<option></option>
												</select><label for="search_type">类型</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header  bg-primary">
							<h3 class="block-title">授权调整目标：<span id = "targetRole"></span></h3>
						</div>
						<div class="block-content">
							<table id="authorizeTable" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_deptAuthorize" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">菜单部门权限设置</h3>
					</div>
				</div>
				<div class="modal-header">
					<h3 class="block-title" style="color: black;">部门授权目标：<span id = "targetName"></span>&nbsp;&nbsp;&nbsp;&nbsp;
					&nbsp;&nbsp;&nbsp;&nbsp;部门授权菜单：<span id = "targetDeptName"></span></h3>
				</div>
				<div class="modal-body">
					<div class="block block-bordered">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_deptAuthorizeSearch" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
										</button>
									</li>
									<li>
										<button id="btn_deptAuthorizeClear" type="button">
											<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">搜索条件设定</h3>
							</div>
							<div id="search-teamCondition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_mechanismName">
												<label for="search_menuPath">机构名</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_deptName">
												<label for="search_menuName">部门名</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_deptPath">
												<label for="search_menuName">部门全路径</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_authorizeAdd" type="button">
										<i class="fa fa-plus-square" style="color: white;">&nbsp;增加授权</i>
									</button>
								</li>
								<li>
									<button id="btn_deptAuthorize" type="button">
										<i class="fa fa-plus-square" style="color: white;">&nbsp;机构内授权</i>
									</button>
								</li>
								<li>
									<button id="btn_allAuthorize" type="button">
										<i class="fa fa-plus-square" style="color: white;">&nbsp;非机构全部授权</i>
									</button>
								</li>
								<li>
									<button id="btn_authorizeMove" type="button">
										<i class="fa fa-minus-square" style="color: white;">&nbsp;取消授权</i>
									</button>
								</li>
								<li>
									<button id="btn_deptAuthorizeMove" type="button">
										<i class="fa fa-minus-square" style="color: white;">&nbsp;取消机构内授权</i>
									</button>
								</li>
								<li>
									<button id="btn_allAuthorizeMove" type="button">
										<i class="fa fa-minus-square" style="color: white;">&nbsp;取消全部授权</i>
									</button>
								</li>
							</ul>
						</div>
						<div class="block-content">
							<table id="deptAuthorizeTableParam" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-warning" type="button" data-dismiss="modal">
							<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_roleuser" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">人员角色关系</h3>
					</div>
				</div>
				<div class="modal-body">
					<div class="block block-bordered">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_roleuserSearch" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
										</button>
									</li>
									<li>
										<button id="btn_roleuserClear" type="button">
											<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">搜索条件设定</h3>
							</div>
							<div id="search-teamCondition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="roleuser_name">
												<label for="roleuser_name">用户名</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="roleuser_depart">
												<label for="roleuser_depart">所属部门</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="roleuser_rank">
												<label for="roleuser_rank">RANK</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_userexport" type="button">
										<i class="si si-cloud-download">&nbsp;导出</i>
									</button>
								</li>
								<li>
									<button id="btn_useradd" type="button">
										<i class="fa fa-plus">&nbsp;添加人员</i>
									</button>
								</li>
								<li>
									<button id="btn_userdelete" type="button">
										<i class="fa fa-ban">&nbsp;删除人员</i>
									</button>
								</li>
								<li>
									<button id="btn_useraddall" type="button">
										<i class="fa fa-plus">&nbsp;添加所有人员</i>
									</button>
								</li>
		                        <li>
									<button id="btn_useradddept" type="button">
										<i class="fa fa-plus">&nbsp;添加指定部门</i>
									</button>
								</li>
								<li>
									<button id="btn_userdeletedept" type="button">
										<i class="fa fa-ban">&nbsp;删除指定部门</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">角色一览</h3>
						</div>
						<div class="block-content">
							<table id="roleuserTable" class="table table-bordered table-striped table-hover"></table>
						</div>
						<br>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-warning" type="button" data-dismiss="modal">
							<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_user" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">人员</h3>
					</div>
				</div>
				<div class="modal-body">
					<div class="block block-bordered">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_userSearch" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
										</button>
									</li>
									<li>
										<button id="btn_userClear" type="button">
											<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">搜索条件设定</h3>
							</div>
							<div id="search-teamCondition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="user_name">
												<label for="user_name">姓名</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="user_depart">
												<label for="user_depart">部门</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="user_rank">
												<label for="user_rank">薪酬级别</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<h3 class="block-title">人员一览</h3>
						</div>
						<div class="block-content">
							<table id="userTable" class="table table-bordered table-striped table-hover"></table>
						</div>
						<br>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-success" type="button" id="btn-userSelect">
							<i class="fa fa-save" style="margin-right:8px;"></i><span>选择</span></button>
					<button class="btn btn-css1 btn-warning" type="button" data-dismiss="modal">
							<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_depart" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-warning">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">选择部门</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<div class="row">
						<div class="form-group"></div>
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<input class="form-control" type="text" id="role_deptuser">
									<label for="role_deptuser">部门</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer" style="height: auto; overflow: visible;">
					<div class="row">
						<button class="btn btn-md btn-primary" id="btn_roleuser"><i class="fa fa-save"></i>&nbsp;确定</button>
						<button class="btn btn-md btn-warning" data-dismiss="modal"><i class="fa fa-sign-out"></i>&nbsp;关闭</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_roledepart" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">部门角色关系</h3>
					</div>
				</div>
				<div class="modal-body">
					<div class="block block-bordered">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_roledepartSearch" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
										</button>
									</li>
									<li>
										<button id="btn_roledepartClear" type="button">
											<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">搜索条件设定</h3>
							</div>
							<div id="search-teamCondition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="roledepart_name">
												<label for="roledepart_name">部门名称</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_roledepartadd" type="button">
										<i class="fa fa-plus">&nbsp;添加部门</i>
									</button>
								</li>
								<li>
									<button id="btn_roledepartdelete" type="button">
										<i class="fa fa-ban">&nbsp;删除部门</i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">部门一览</h3>
						</div>
						<div class="block-content">
							<table id="roledepartTable" class="table table-bordered table-striped table-hover"></table>
						</div>
						<br>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-warning" type="button" data-dismiss="modal">
							<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_departrole" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-warning">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">选择部门</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<div class="row">
						<div class="form-group"></div>
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<input class="form-control" type="text" id="role_dept">
									<label for="role_dept">部门</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer" style="height: auto; overflow: visible;">
					<div class="row">
						<button class="btn btn-md btn-primary" id="btn_roledepart"><i class="fa fa-save"></i>&nbsp;确定</button>
						<button class="btn btn-md btn-warning" data-dismiss="modal"><i class="fa fa-sign-out"></i>&nbsp;关闭</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<script src="${pageContext.request.contextPath}/cpAdmin/roleManage.js"></script>