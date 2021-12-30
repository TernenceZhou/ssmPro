<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<div class="content bdo-page-content">
	<div class="block">
		<div class="block block-themed">
			<div class="block-header bg-primary">
				<ul class="block-options">
					<li>
						<button id="usercus_btn_search" type="button">
							<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
						</button>
					</li>
					<li>
						<button type="button" data-toggle="block-option" data-action="content_toggle"></button>
					</li>
				</ul>
				<h3 class="block-title">查询条件设定</h3>
			</div>
			<div id="search-condition" class="block-search">
				<div>
					<div class="row">
						<div class="form-group"></div>
						<div class="form-group has-info">
							<div class="col-sm-4">
								<div class="form-material">
									<input class="form-control" type="text" id="usercus_search_userCustomerName"> <label for="usercus_search_userCustomerName">客户名称</label>
								</div>
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
						<button id="usercus_btn_addcus" type="button">
							<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
						</button>
					</li>
					<li>
						<button type="button" data-toggle="block-option" data-action="fullscreen_toggle" style="color: white;"></button>
					</li>
				</ul>
				<h3 class="block-title">查询结果</h3>
			</div>
			<div class="block-content">
				<table id="usercus_table" class="table table-bordered table-striped table-hover">
				</table>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="usercus_modal_savecus" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
					<h3 class="block-title">临时客户</h3>
				</div>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info" style="display: none;">
						<div class="col-sm-12">
							<div class="form-material">
								<input class="form-control" type="text" id="usercus_modal_savecus_userCustomerId"> <label for="usercus_modal_savecus_userCustomerId">客户ID</label>
							</div>
						</div>
					</div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<input class="form-control" type="text" id="usercus_modal_savecus_userCustomerName"> <label for="usercus_modal_savecus_userCustomerName">客户名称</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-12">
					<button class="btn btn-md btn-primary" type="button" id="usercus_modal_savecus_btn_save">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="usercus_modal_user" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
					<h3 class="block-title">用户</h3>
				</div>
			</div>
			<div class="modal-body">
				<div class="block block-bordered">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="usercus_modal_user_btn_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option" data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询</h3>
						</div>
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<input class="form-control" type="text" id="usercus_modal_user_userName"> <label for="roleuser_name">用户名</label>
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
								<button id="usercus_modal_user_btn_addUser" type="button">
									<i class="fa fa-plus">&nbsp;添加人员</i>
								</button>
							</li>
							<li>
								<button id="usercus_modal_user_btn_deleteUser" type="button">
									<i class="fa fa-minus">&nbsp;删除人员</i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option" data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">一览</h3>
					</div>
					<div class="block-content">
						<table id="usercus_modal_user_table" class="table table-bordered table-striped table-hover"></table>
					</div>
					<br>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="usercus_modal_addUser" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
					<h3 class="block-title">新增人员</h3>
				</div>
			</div>
			<div class="modal-body">
				<div class="block block-bordered">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="usercus_modal_addUser_btn_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option" data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询</h3>
						</div>
						<div id="search-teamCondition" class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<input class="form-control" type="text" id="usercus_modal_addUser_userName"> <label for="usercus_modal_addUser_userName">姓名</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<input class="form-control" type="text" id="usercus_modal_addUser_depart"> <label for="usercus_modal_addUser_depart">部门</label>
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
								<button id="usercus_modal_addUser_add" type="button">
									<i class="fa fa-plus">&nbsp;添加</i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option" data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">一览</h3>
					</div>
					<div class="block-content">
						<table id="usercus_modal_addUser_table" class="table table-bordered table-striped table-hover"></table>
					</div>
					<br>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="${pageContext.request.contextPath}/cpCustomer/userCustomer.js"></script>