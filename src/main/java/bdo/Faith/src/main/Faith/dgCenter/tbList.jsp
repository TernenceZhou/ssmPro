<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<!-- <div class="content bg-gray-lighter">
<div class="row items-push">
<div class="col-sm-7">
<h1 id="page_head" class="page-heading"></h1>
</div>
<div class="col-sm-5 text-right hidden-xs">
<ol id="page_title" class="breadcrumb push-10-t">
</ol>
</div>
</div>
</div> -->
<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_tbList">
			<li class="active"><a href="tab_tbList">试算平衡表</a></li>
		</ul>
		<div class="block-content tab-content" id="tab_tbList_content">
			<div class="tab-pane active" id="tab_tbser">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="tb_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="tb_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询条件设定</h3>
						</div>
						<div id="search-condition" class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<select class="js-select2 form-control" id="tb_customerId">
												<option></option>
											</select>
											<label for="tb_customerId">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material input-group">
											<select class="form-control" id="tb_startYear">
												<option></option>
											</select>
											<span id="search_dateAddon" class="input-group-addon">-</span>
											<select class="form-control" id="tb_endYear">
												<option></option>
											</select>
											<label for="tb_startYear">账套期间</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="form-control" id="tb_showZero">
												<option value='0'>是</option>
												<option value='1'>否</option>
											</select>
											<label for="tb_showZero">显示金额不为0</label>
										</div>
									</div>
								</div>

								<!-- <div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="form-control" id="search_showType">
												<option value='1'>资产负债</option>
												<option value='2'>损益</option>
											</select>
											<label for="search_showType">类型</label>
										</div>
									</div>
								</div>
								-->
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="tb_createReport" type="button">
										<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
									</button>
								</li>
								<li>
									<button id="tb_export" type="button">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">试算平衡表</h3>
						</div>
						<div class="block-content">
							<table id="tb_tab" class="table table-bordered table-striped table-hover">
								<tfoot></tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="${pageContext.request.contextPath}/dgCenter/tbList.js"></script>