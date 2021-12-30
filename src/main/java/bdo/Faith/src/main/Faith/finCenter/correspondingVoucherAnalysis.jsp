<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
	<style>
		#example {
			text-align: center;
		}
	</style>

	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_detailaccount">
				<li class="active"><a href="#tab_tab_detailaccountser" id="dyVoucher_tab_1">多借多贷分析</a></li>
				<li class=""><a href="#tab_tab_detailaccountser_two" id="dyVoucher_tab_2">对应凭证分析</a></li>
				<li class=""><a href="#dyVoucher_tabcontent_3" id="dyVoucher_tab_3">分析汇总</a></li>
				<li class="pull-right">
					<ul class="block-options push-10-t push-10-r">
						<li>
							<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
						</li>
					</ul>
				</li>
			</ul>

			<!-- 多借多贷分析 -->
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
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">查询条件设定</h3>
							</div>
							<div class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<select class="js-select2 form-control" id="analysis_customerId">
													<option></option>
												</select> <label for="analysis_customerId">客户名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input id="analysis_yyyy" class="form-control date-picker" type="text"
													autocomplete="off">
												<label for="analysis_yyyy">选择年份</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material input-group">
												<select class="form-control" id="analysis_startmonth">
													<option></option>
												</select>
												<span class="input-group-addon">~</span>
												<select class="form-control" id="analysis_endmonth">
													<option></option>
												</select> <label for="analysis_endmonth">月份区间</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="analysis_subjectid">
												<label for="analysis_subjectid">科目编号</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="analysis_fxDirection">
												</select>
												<label for="analysis_fxDirection">分析方向</label>
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
										<button id="dyVoucher_refresh_1" type="button">
											<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
										</button>
									</li>
									<li>
										<button id="correspondingVoucherAnalysis_export" type="button"
											style="display: none;">
											<i class="si si-cloud-download" style="color: white;" title="导出"></i>
										</button>
									</li>
									<li>
										<button id="correspondingVoucherAnalysis_export_dg" type="button"
											style="display: none;">
											<i class="si si-cloud-download" style="color: white;" title="导出到底稿附件"></i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"
											style="color: white;">
										</button>
									</li>
								</ul>
								<h3 class="block-title">多借多贷一览<span id="validDate"></span></h3>
							</div>
							<div class="block-content">
								<div></div>
								<!-- <table class="js-table-sections table table-hover" id="treeTable"></table> -->
								<table id="treeTable" class="table table-bordered table-striped table-hover"></table>
								<div id="loadImg" style="width:100%;text-align:center;"><img
										src="/Faith/img/bdo/loading.gif" width="100px" height="100px" /></div>
							</div>
						</div>
					</div>
				</div>

				<!-- 对应凭证分析 -->
				<div class="tab-pane" id="tab_tab_detailaccountser_two">
					<div class="content">
						<div class="block block-bordered">
							<div class="block-header  bg-primary">
								<ul class="block-options">
									<li>
										<button id="dyVoucher_refresh_2" type="button">
											<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
										</button>
									</li>
									<li>
										<button id="correspondingVoucherAnalysis_export_two" type="button"
											style="display: none;">
											<i class="si si-cloud-download" style="color: white;" title="导出"></i>
										</button>
									</li>
									<li>
										<button id="correspondingVoucherAnalysis_export_dg_two" type="button"
											style="display: none;">
											<i class="si si-cloud-download" style="color: white;" title="导出到底稿附件"></i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"
											style="color: white;">
										</button>
									</li>
								</ul>
								<h3 class="block-title">对应凭证一览</h3>
							</div>
							<div class="block-content">
								<div></div>
								<!-- <table class="js-table-sections table table-hover" id="treeTable_two"></table> -->
								<table id="treeTable_two" class="table table-bordered table-striped table-hover">
								</table>
								<div id="loadImg_two" style="width:100%;text-align:center;"><img
										src="/Faith/img/bdo/loading.gif" width="100px" height="100px" /></div>
							</div>
						</div>
					</div>
				</div>

				<!-- 对应凭证汇总 -->
				<div class="tab-pane" id="dyVoucher_tabcontent_3">
					<div class="content">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_xxranaly3" type="button" style="color:white;"><img
												src="img/bdo/xxr24.png"
												style="height: 22px;width: 22px;">&nbsp;推荐分析</button>
									</li>
									<li>
										<button id="btn_search3" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">查询条件设定</h3>
							</div>
							<div class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<select class="js-select2 form-control" id="analysis_customerId3"
													style="width: 100%;">
													<option></option>
												</select> <label for="analysis_customerId3">客户名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input id="analysis_yyyy3" class="form-control date-picker" type="text"
													autocomplete="off">
												<label for="analysis_yyyy3">选择年份</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material input-group">
												<select class="form-control" id="analysis_startmonth3">
													<option></option>
												</select>
												<span class="input-group-addon">~</span>
												<select class="form-control" id="analysis_endmonth3">
													<option></option>
												</select> <label for="analysis_endmonth3">月份区间</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="analysis_fxDirection3">
												</select>
												<label for="analysis_fxDirection3">分析方向</label>
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
										<button id="dyVoucher_refresh_3" type="button">
											<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
										</button>
									</li>
									<li>
										<button id="dyVoucher_btnexport_3" type="button" style="display: none;">
											<i class="si si-cloud-download" style="color: white;" title="导出"></i>
										</button>
									</li>
									<li>
										<button id="dyVoucher_btnexportdg_3" type="button" style="display: none;">
											<i class="si si-cloud-download" style="color: white;" title="导出到底稿附件"></i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"
											style="color: white;"></button>
									</li>
								</ul>
								<h3 class="block-title">分析汇总一览</h3>
							</div>
							<div class="block-content">
								<div></div>
								<!-- <table class="js-table-sections table table-hover" id="dyVoucher_table_3"></table> -->
								<table id="dyVoucher_table_3" class="table table-bordered table-striped table-hover">
								</table>
								<div id="loadImg_3" style="width:100%;text-align:center;"><img
										src="/Faith/img/bdo/loading.gif" width="100px" height="100px" /></div>
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
					<div id="accmulsubject_tree"></div>
				</div>
				<div class="modal-footer">
					<div class="col-sm-3">
						<input class="form-control" type="text" id="searchInput2" placeholder="搜索科目">
					</div>
					<div class="col-sm-9">
						<button class="btn btn-md btn-primary" type="button" id="modal_accmulsubjectid_reset">
							<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
						</button>
						<button class="btn btn-md btn-primary" type="button" id="modal_accmulsubjectid_sure">
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

	<div class="modal fade" id="modal_subjectid_two" tabindex="-1" role="dialog" aria-hidden="true"
		data-backdrop="static" data-keyboard="false">
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
					<div id="accmulsubject_tree_two"></div>
				</div>
				<div class="modal-footer">
					<div class="col-sm-3">
						<input class="form-control" type="text" id="searchInput2_two" placeholder="搜索科目">
					</div>
					<div class="col-sm-9">
						<button class="btn btn-md btn-primary" type="button" id="modal_accmulsubjectid_reset_two">
							<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
						</button>
						<button class="btn btn-md btn-primary" type="button" id="modal_accmulsubjectid_sure_two">
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
				<div class="modal-body" style="min-height:500px;max-height:500px">
					<div id="tbsubject_tree"></div>
				</div>
			</div>
		</div>
	</div>

	<!-- 对应凭证详细 -->
	<div class="modal fade" id="modal_voucherdetail" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
		data-keyboard="false">
		<div class="modal-dialog modal-md" style="width:1500px">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button class="btn btn-md btn-primary" type="button" id="modal_voucherdetail_save">
									<i class="fa fa-save" title="保存"></i>
								</button>
							</li>
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title"><label id="headlabel">对应凭证详细</label></h3>
					</div>
				</div>
				<div class="modal-body" style="min-height:850px;max-height:850px">
					<div class="block-content block-content-full" style="padding: 0px 5px 0px 5px;">
						<table id="voucherdetailTable" class="table table-bordered table-striped table-hover"></table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script src="${pageContext.request.contextPath}/finCenter/common/voucherAnalysisTable.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/manyVoucherAnalysisTable.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/insideTransactionAnalysisTable.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/correspondingVoucherAnalysis.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/sameVoucherAnalysisTable.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>
	<script>
		jQuery(function () {
			// Init page helpers (Table Tools helper)
			App.initHelpers('table-tools');
		});

	</script>