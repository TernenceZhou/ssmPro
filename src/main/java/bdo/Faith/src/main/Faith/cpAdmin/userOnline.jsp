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
								<label for="search_userNmae">用户名</label>
							</div>
						</div>
					</div>
					<div class="form-group has-info">
						<div class="col-sm-2">
							<div class="form-material">
								<input class="form-control" type="text" id="search_userDepartId">
								<label for="search_userDepartId">所属部门</label>
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
						<button id="btn_news" type="button">
							<i class="fa fa-volume-up" style="color: white;" title="系统广播"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">在线用户</h3>
			</div>
			<div class="block-content">
				<table id="userOnlineTable" class="table table-bordered table-striped table-hover">
				</table>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_news" tabindex="-1" role="dialog" 
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
						<h3 class="block-title">发送详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="sub_news"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_sysNews" tabindex="-1" role="dialog" 
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
						<h3 class="block-title">系统广播详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="sub_sysNews"></form>
				</div>
			</div>
		</div>
	</div>
	
	<script src="${pageContext.request.contextPath}/cpAdmin/userOnline.js"></script>