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
							<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
						</button>
					</li>
					<li>
						<button id="btn_clear" type="button">
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
			<div id="search-condition" class="block-search">
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-2">
							<div class="form-material">
								<input class="form-control" type="text" id="search_userName">
								<label for="search_userName">姓名</label>
							</div>
						</div>
					</div>
					<div class="form-group has-info">
						<div class="col-sm-3">
							<div class="form-material">
								<input class="form-control" type="text" id="search_userDepartId">
								<label for="search_userDepartId">所属部门</label>
							</div>
						</div>
					</div>
					<!-- <div class="form-group has-info">
						<div class="col-sm-2">
							<div class="form-material">
								<input class="form-control" type="text" id="search_userPayBand">
								<label for="search_userPayBand">薪酬级别</label>
							</div>
						</div>
					</div> -->
					<div class="form-group has-info">
						<div class="col-sm-2">
							<div class="form-material">
								<select class="form-control" id="search_accountStatus">
									<option></option>
								</select> <label for="search_accountStatus">账户状态</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="block block-bordered">
			<div class="block-header bg-primary">
				<ul class="block-options">
					<li>
						<button id="btn_add" type="button">
							<i class="fa fa-plus" style="color: white;" title="新增"></i>
						</button>
					</li>
					<li>
						<button id="btn_export" type="button">
							<i class="si si-cloud-download" style="color: white;" title="导出"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">用户信息一览</h3>
			</div>
			<div class="block-content">
				<table id="userManageTable" class="table table-bordered table-striped table-hover">
				</table>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_new" tabindex="-1" role="dialog" 
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
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
						<h3 class="block-title">新建</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="sub_add"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_edit" tabindex="-1" role="dialog" 
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
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
						<h3 class="block-title"><span id = "modalName"></span></h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="sub_edit"></form>
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
						<h3 class="block-title">用户权限调整</h3>
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
												<input class="form-control" type="text" id="search_menuPath" />
												<label for="search_menuPath">菜单路径</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_menuName" />
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
					<button class="btn btn-css1 btn-warning" type="button" id="authorizeClose">
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
												<input class="form-control" type="text" id="search_mechanismName" />
												<label for="search_mechanismName">机构名</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_deptName" />
												<label for="search_deptName">部门名</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_deptPath" />
												<label for="search_deptPath">部门全路径</label>
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
					<button class="btn btn-css1 btn-warning" type="button" id="deptAuthorizeClose">
							<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_roleAuthorize" tabindex="-1" role="dialog"
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
						<h3 class="block-title">用户角色维护详细信息</h3>
					</div>
				</div>
				<div class="modal-header">
					<h3 class="block-title" style="color: black;">用户名：<span id = "roleTargetName"></span></h3>
				</div>
				<div class="modal-body">
					<div class="block block-bordered">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_roleAuthorizeSearch" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
										</button>
									</li>
									<li>
										<button id="btn_roleAuthorizeClear" type="button">
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
												<input class="form-control" type="text" id="search_roleName" />
												<label for="search_roleName">角色名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<input class="form-control" type="text" id="search_belongDept" />
												<label for="search_belongDept">所属机构</label>
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
									<button id="btn_roleAuthorizeAdd" type="button">
										<i class="fa fa-plus" style="color: white;">&nbsp;添加角色授权</i>
									</button>
								</li>
								<li>
									<button id="btn_roleAuthorizeMove" type="button">
										<i class="fa fa-minus-square" style="color: white;">&nbsp;删除角色授权</i>
									</button>
								</li>
							</ul>
						</div>
						<div class="block-content">
							<table id="roleAuthorizeTableParam" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-warning" type="button" id="roleAuthorizeClose">
							<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_customer" tabindex="-1" role="dialog"
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
						<h3 class="block-title">客户</h3>
					</div>
				</div>
				<div class="modal-body">
					<div class="block block-bordered">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_customerSearch" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
										</button>
									</li>
									<li>
										<button id="btn_customerClear" type="button">
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
												<input class="form-control" type="text" id="customer_id">
												<label for="customer_id">客户ID</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="customer_name">
												<label for="customer_name">客户名称</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<h3 class="block-title">客户一览</h3>
						</div>
						<div class="block-content">
							<table id="customerTable" class="table table-bordered table-striped table-hover"></table>
						</div>
						<br>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-success" type="button" id="btn-customerSelect">
							<i class="fa fa-save" style="margin-right:8px;"></i><span>选择</span></button>
					<button class="btn btn-css1 btn-warning" type="button" data-dismiss="modal">
							<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	<script src="${pageContext.request.contextPath}/admin/outuser/userManage.js"></script>
	<script type="text/javascript">
	var userLevel = '<%=((cn.com.bdo.base.listener.UserSession)request.getSession().getAttribute("userSession")).getUserLevel()%>';
	if(!jQuery.isNumeric(userLevel)){
		userLevel = '0';
	}
	</script>