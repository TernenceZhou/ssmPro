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
						<button id="schema_add" type="button">
							<i class="fa fa-plus" title="新增"></i>
						</button>
					</li>
					<li>
						<button id="schema_load" type="button">
							<i class="fa fa-level-down" title="加载"></i>
						</button>
					</li>
					<li>
						<button type="button" data-toggle="block-option"
							data-action="content_toggle"></button>
					</li>
				</ul>
				<h3 class="block-title">详细信息</h3>
			</div>
			<div class="block-content">
				<table id="schema_table" class="table table-bordered table-striped table-hover"></table>
			</div>
			<br>
		</div>
	</div>
	
	<div class="modal fade" id="modal_schema" tabindex="-1" role="dialog"
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
						<h3 class="block-title">详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="form_schema"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_table" tabindex="-1" role="dialog"
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
						<h3 class="block-title">详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="table_search" type="button">
										<i class="fa fa-search">&nbsp;搜索</i>
									</button>
								</li>
								<li>
									<button id="table_sclear" type="button">
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
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-3">
										<div class="form-material">
											<input class="form-control" type="text" id="table_search_tablename">
											<label for="table_search_tablename">表名</label>
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
									<button id="table_add" type="button">
										<i class="fa fa-plus">&nbsp;新增</i>
									</button>
								</li>
								<li>
									<button id="table_load" type="button">
										<i class="fa fa-level-down">&nbsp;加载</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">数据表一览</h3>
						</div>
						<div class="block-content">
							<table id="table_table" class="table table-bordered table-striped table-hover"></table>
						</div>
						<br>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_tableTodb" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-danger">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">应用到DB</h3>
					</div>
				</div>
				<div class="modal-body">
					<p id="tableTodb_detail"></p>
				</div>
				<div class="modal-footer">
					<button class="btn btn-css1 btn-danger" type="button" id="btn_todb">
						<i class="fa fa-send"></i><span>应用到DB</span>
					</button>
					<button class="btn btn-css1 btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>关闭</span>
					</button>
				</div>	
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal_tableform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="form_table"></form>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="modal_tablecol" tabindex="-1" role="dialog"
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
						<h3 class="block-title">表定义</h3>
					</div>
				</div>
				<div class="modal-body">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="tablecol_search" type="button">
										<i class="fa fa-search">&nbsp;搜索</i>
									</button>
								</li>
								<li>
									<button id="tablecol_sclear" type="button">
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
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-3">
										<div class="form-material">
											<input class="form-control" type="text" id="tablecol_search_colnm">
											<label for="tablecol_search_colnm">列名</label>
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
									<button id="tablecol_add" type="button">
										<i class="fa fa-plus">&nbsp;新增</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">字段一览</h3>
						</div>
						<div class="block-content">
							<table id="table_tablecol" class="table table-bordered table-striped table-hover"></table>
						</div>
						<br>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="modal_tablecolform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="form_tablecol"></form>
				</div>
			</div>
		</div>
	</div>

	<script src="${pageContext.request.contextPath}/cpAdmin/singletable.js"></script>
	<script src="${pageContext.request.contextPath}/cpAdmin/schemaManage.js"></script>