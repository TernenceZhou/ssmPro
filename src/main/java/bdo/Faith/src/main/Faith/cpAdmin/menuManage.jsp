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
						<button id="btn_menuAdd" type="button">
							<i class="fa fa-plus" title="新增"></i>
						</button>
					</li>
					<li>
						<button id="btn_refresh" type="button">
							<i class="fa fa-refresh" title="刷新"></i>
						</button>
					</li>
					<li>
						<button type="button" data-toggle="block-option"
							data-action="content_toggle"></button>
					</li>
				</ul>
				<h3 class="block-title">系统菜单</h3>
			</div>
			<div class="block-content">
				<table id="menu_tree">
				</table>
			</div>
			<br>
		</div>
	</div>
	
	<div class="modal fade" id="modal_menu" tabindex="-1" role="dialog" 
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
						<h3 class="block-title">菜单管理：<span id = "menutName"></span></h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="sub_menu"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_action" tabindex="-1" role="dialog" 
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
						<h3 class="block-title">设置Action</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="sub_action"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_icons" tabindex="-1" role="dialog" 
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
						<h3 class="block-title">图标</h3>
					</div>
				</div>
				<div class="modal-body" id = "add_icons">
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-warning" type="button" id="iconsClose">
							<i class="fa fa-sign-out" style="margin-right:8px;"></i><span>关闭</span></button>
				</div>	
			</div>
		</div>
	</div>
	<script type="text/javascript">
		var userLevel = '<%=((cn.com.bdo.base.listener.UserSession)request.getSession().getAttribute("userSession")).getUserLevel()%>';
		if(!jQuery.isNumeric(userLevel)){
			userLevel = '0';
		}
	</script>
	
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/themes/icon.css">
	<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
	<script src="${pageContext.request.contextPath}/cpAdmin/menuManage.js"></script>