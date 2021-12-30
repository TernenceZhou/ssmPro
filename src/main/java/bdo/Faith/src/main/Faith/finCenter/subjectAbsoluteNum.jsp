<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<style>
	#subject_table tr td a {
		cursor: pointer;
	}
</style>
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
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_subjectAbsolute">
			<li class="active"><a href="#tab_subjectAbsoluter">科目绝对数分析</a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul>
		<div class="block-content tab-content" id="tab_subjectAbsolute_content">
			<div class="tab-pane active" id="tab_subjectAbsoluter">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="group_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;自定义分组查询</i>
									</button>
								</li>
								<li>
									<button id="subject_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="subject_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;清空</i>
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
							<div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<select class="js-select2 form-control" id="subject_companyid"
														style="width: 100%;">
													<option></option>
												</select> <label for="subject_companyid">客户名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material input-group">
												<input id="subject_startYear" class="form-control date-picker" autocomplete="off"
												       type="text" value="">
												<span class="input-group-addon">~</span>
												<input id="subject_endYear" class="form-control date-picker" autocomplete="off"
												       type="text" value="">
												<label for="subject_startYear">账套年份</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="subject_subjectid">
												<label for="subject_subjectid">科目编号</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="subject_subjectlevel">
													<option></option>
												</select> <label for="subject_subjectlevel">科目级别</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="subject_singlelevel">
													<option></option>
												</select> <label for="subject_singlelevel">只显示本级别</label>
											</div>
										</div>
									</div>
								</div>
								<div class='row'>
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="subject_acctype">
													<option></option>
												</select> <label for="subject_acctype">金额类型</label>
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
									<button id="subject_view" type="button" style="display: none;">
										<i class="fa fa-eye" style="color: white;" title="查看"></i>
									</button>
								</li>
								<li>
									<button id="subject_export" type="button" style="display: none;">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
								<!-- <li>
									<button id="account_export_dg" type="button" style="display: none;">
										<i class="fa fa-download" style="color: white;">&nbsp;导出到底稿附件</i>
									</button>
								</li> -->
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">科目绝对数分析<span id="validDate"></span></h3>
						</div>
						<div class="block-content">
							<table id="subject_table" class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


<div class="modal fade" id="modal_subjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false" style="top:40px;z-index: 1070;">
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
					<h3 class="block-title">选择科目</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:500px;max-height:500px">
				<div id="subject_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput1" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button" id="modal_subjectid_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_subjectid_sure">
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

<div class="modal fade" id="modal_subcharts" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button type="button" id="monthlyVariation_echarts_switch"
									 style="display: none;">
								<i class="fa fa-bar-chart" style="color: white;"  title="切换双维度"></i>
							</button>
						</li>
						<li>
							<button type="button" id="monthlyVariation_echarts_export"
									 style="display: none;">
								<i class="si si-cloud-download" style="color: white;"  title="导出"></i>
							</button>
						</li>
						<li>
							<button id="account_export_dg" type="button" style="display: none;">
								<i class="si si-cloud-download" style="color: white;" title="导出到底稿附件"></i>
							</button>
						</li>
						<li>
							<button id="modelclose" type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">月度变化</h3>
				</div>
			</div>
			<div id="echart_img">
				<img src="/Faith/img/bdo/loading.gif" width="100px" height="100px" style="margin-left:380px;"/>
			</div>
			<div class="modal-body" style="min-height:500px;max-height:500px" id="subject_charts_id">
				<div id="subject_charts" style="width:800px;height:350px;margin:auto 0px;"></div>
				<div style="height:200px;">
					<table id="monthlyVariation_table" class="table table-bordered table-striped table-hover">
					</table>
				</div>
			</div>

			<div class="modal-footer">
				<!-- <button class="btn btn-md btn-primary" type="button" id="monthlyVariation_echarts_export" data-dismiss="modal">
					<i class="fa fa-send"></i><span>&nbsp;导出</span>
				</button> -->
				<!-- <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button> -->
			</div>
		</div>
	</div>
</div>
<!-- 导出到底稿附件树弹框 -->
<div class="modal fade" id="modal_tbsubjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button class="btn btn-md btn-primary" type="button" id="modal_tbsubjectid_sure">
								<i class="si si-cloud-download" title="导出"></i><%--<span>&nbsp;导出</span>--%>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">选择TB科目</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:500px;max-height:500px">
				<div id="tbsubject_tree"></div>
			</div>
			<div class="modal-footer">

				<div class="col-sm-12">

					<%--<button class="btn btn-md btn-primary" type="button" id="modal_tbsubjectid_sure">
						<i class="si si-cloud-download"></i><span>&nbsp;导出</span>
					</button>--%>

				</div>

			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_subjectAbsoluteGroup" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog modal-md" style="width:900px">
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
					<h3 class="block-title">自定义分组查询</h3>
				</div>
			</div>
			<div class="modal-body" style="max-height:550px;">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="subjectAbsoluteGroup_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">分组条件设定</h3>
						</div>
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-3">
										<div class="form-material">
											<input class="form-control" type="text" id="subjectAbsoluteGroup_subjectid">
											<label for="subjectAbsoluteGroup_subjectid">科目编号</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="form-control" id="subjectAbsoluteGroup_acctype">
												<option></option>
											</select> <label for="subjectAbsoluteGroup_acctype">金额类型</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="form-control" id="subjectAbsoluteGroup_dirction">
												<option value='plus'>+</option>
												<option value='-'>-</option>
											</select> <label for="subjectAbsoluteGroup_dirction">金额方向</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<ul class="nav nav-tabs" data-toggle="tabs" id="tabs_subjectAbsoluteGroup">
						<li class="active"><a href="#tab_subjectAbsoluteGroup1">自定义分组一</a></li>
						<li><a href="#tab_subjectAbsoluteGroup2">自定义分组二</a></li>
						<li><a href="#tab_subjectAbsoluteGroup3">自定义分组三</a></li>
					</ul>
					<div class="block-content tab-content" id="tabs_subjectAbsoluteGroup_content">
						<div class="tab-pane active" id="tab_subjectAbsoluteGroup1">
							<div class="block block-bordered">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button id="subjectAbsoluteGroup1_add" type="button">
												<i class="fa fa-plus" style="color: white;" title="添加"></i>
											</button>
										</li>
									</ul>
									<h3 class="block-title">自定义分组一</h3>
								</div>
								<div class="block-content">
									<table id="subjectAbsoluteGroup1_table" class="table table-bordered table-striped table-hover">
									</table>
								</div>
							</div>
						</div>
						<div class="tab-pane" id="tab_subjectAbsoluteGroup2">
							<div class="block block-bordered">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button id="subjectAbsoluteGroup2_add" type="button">
												<i class="fa fa-plus" style="color: white;" title="添加"></i>
											</button>
										</li>
									</ul>
									<h3 class="block-title">自定义分组二</h3>
								</div>
								<div class="block-content">
									<table id="subjectAbsoluteGroup2_table" class="table table-bordered table-striped table-hover">
									</table>
								</div>
							</div>
						</div>
						<div class="tab-pane" id="tab_subjectAbsoluteGroup3">
							<div class="block block-bordered">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button id="subjectAbsoluteGroup3_add" type="button">
												<i class="fa fa-plus" style="color: white;" title="添加"></i>
											</button>
										</li>
									</ul>
									<h3 class="block-title">自定义分组三</h3>
								</div>
								<div class="block-content">
									<table id="subjectAbsoluteGroup3_table" class="table table-bordered table-striped table-hover">
									</table>
								</div>
							</div>
						</div>
					</div>
					
				</div>
			</div>
			<!-- <div class="modal-footer">
				<div class="col-sm-12">
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div> -->
		</div>
	</div>
</div>

<div class="modal fade" id="modal_subjectid_group" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false" style="top:40px;z-index: 1070;">
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
					<h3 class="block-title">选择科目</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:500px;max-height:500px">
				<div id="subject_tree_group"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput1_group" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button" id="modal_subjectid_reset_group">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_subjectid_sure_group">
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
<script src="${pageContext.request.contextPath}/finCenter/subjectAbsoluteNum.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script> 
<script src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>