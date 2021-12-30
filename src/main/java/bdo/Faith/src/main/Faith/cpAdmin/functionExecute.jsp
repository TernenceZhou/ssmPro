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
			<div class="block-content">
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group">
						<div class="col-sm-3">
							<div class="form-material">
								<input class="form-control" type="text" id="search_name">
								<label for="search_name">名称</label>
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
						<button id="btn_add" type="button">
							<i class="fa fa-plus" title="新增"></i>
						</button>
					</li>
					<li>
						<button type="button" data-toggle="block-option"
							data-action="content_toggle"></button>
					</li>
				</ul>
				<h3 class="block-title">方法</h3>
			</div>
			<div class="block-content">
				<table id="functiontable" class="table table-bordered table-striped table-hover"></table>
			</div>
			<br>
		</div>
	</div>
	
	<div class="modal fade" id="modal_function" tabindex="-1" role="dialog"
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
						<h3 class="block-title">方法信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="form_function"></form>
				</div>
			</div>
		</div>
	</div>
	
	<script src="${pageContext.request.contextPath}/cpAdmin/functionExecute.js"></script>