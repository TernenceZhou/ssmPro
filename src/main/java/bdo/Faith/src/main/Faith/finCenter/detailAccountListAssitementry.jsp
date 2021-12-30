<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<style>
#example {
	text-align: center;
}

.transform_font_size {
	transform: scale(0.5);
}
</style>
<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_detailaccount">
			<li class="active"><a href="#tab_tab_detailaccountser">核算明细账</a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option"
							data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul>
		<div class="block-content tab-content" id="tab_detailaccount_content">
			<div class="tab-pane active" id="tab_tab_detailaccountser">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="btn_clear" type="button">
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
												<select class="js-select2 form-control"
													id="detail_customerId" style="width: 100%;">
													<option></option>
												</select><label for="detail_customerId">客户名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material input-group">
												<input id="detail_startDate"
													class="form-control date-picker" type="text"
													autocomplete="off"> <span class="input-group-addon">-</span>
												<input id="detail_endDate" class="form-control date-picker"
													type="text" autocomplete="off"> <label
													for="detail_startDate">账套年月</label>
											</div>
										</div>
									</div>
									<!-- <div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input id="detail_yyyy" class="form-control date-picker" type="text" autocomplete="off"> <label for="detail_yyyy">账套年份</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material input-group">
												<select class="form-control" id="detail_startmonth" placeholder="开始月份">
													<option></option>
												</select> <span class="input-group-addon">~</span> <select class="form-control" id="detail_endmonth" placeholder="结束月份">
													<option></option>
												</select> <label for="detail_startmonth">会计月份</label>
											</div>
										</div>
									</div> -->
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text"
													id="detail_subjectid"> <label
													for="detail_subjectid">科目编号</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="subject_type">
												</select> <label for="subject_type">对方科目显示方式</label>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="summary_type">
												</select> <label for="summary_type">摘要匹配</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="detail_summary"
													placeholder="以逗号分隔,如 员工,路费"> <label
													for="detail_summary">摘要关键字</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text"
													id="detail_assitemid"> <label for=detail_assitemid>核算类型</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="detail_viewnum">
													<option></option>
												</select> <label for="detail_viewnum">显示数量</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="detail_othercurr">
													<option></option>
												</select> <label for="detail_othercurr">显示外币</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="detail_sort">
													<option></option>
												</select> <label for="detail_sort">排序</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered" id="subjectlist_block">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<li>
									<button id="detail_account_assitem_export" type="button"
										style="display: none;">
										<i class="si si-cloud-download" style="color: white;"
											title="导出"></i>
									</button>
								</li>
								<li>
									<button id="account_export_dg" type="button"
										style="display: none;">
										<i class="si si-cloud-download" style="color: white;"
											title="导出到底稿附件"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;"></button>
								</li>
							</ul>
							<h3 class="block-title">
								查询结果<span name="cus_select"></span><span id="validDate"></span>
							</h3>
						</div>
						<div class="block-content">
							<table id="subjectEntry"
								class="table table-bordered table-striped table-hover"></table>
							<div id="hot"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modal_subjectid" tabindex="-1" role="dialog"
	aria-hidden="true" data-backdrop="static" data-keyboard="false"
	style="top: 40px; z-index: 1070;">
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
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="subject_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput2"
						placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button"
						id="modal_accmulsubjectid_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button"
						id="modal_accmulsubjectid_sure">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_assitemid" tabindex="-1" role="dialog"
	aria-hidden="true" data-backdrop="static" data-keyboard="false"
	style="top: 40px; z-index: 1070;">
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
					<h3 class="block-title">选择科目 (默认展示20个 超出部分可以使用搜索科目选择)</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="assitem_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInputAssitem"
						placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button"
						id="modal_assitemid_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button"
						id="modal_assitemid_sure">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- 导出到底稿附件树弹框 -->
<div class="modal fade" id="modal_tbsubjectid" tabindex="-1"
	role="dialog" aria-hidden="true" data-backdrop="static"
	data-keyboard="false">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button class="btn btn-md btn-primary" type="button"
								id="modal_tbsubjectid_sure">
								<i class="si si-cloud-download" title="导出"></i>
								<%--<span>&nbsp;导出</span>--%>
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
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="tbsubject_tree"></div>
			</div>
		</div>
	</div>
</div>
<script
	src="${pageContext.request.contextPath}/finCenter/detailAccountListAssitementry.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/accountLedager.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/accountDetail.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/voucherDetail.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>
<script
	src="${pageContext.request.contextPath}/dgCenter/js/dg/samplingList.js"></script>