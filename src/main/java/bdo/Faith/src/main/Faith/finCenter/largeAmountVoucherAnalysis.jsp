<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<style>
	#example {
		text-align: center;
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
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_detailaccount">
			<li class="active"><a href="#tab_tab_detailaccountser">大金额凭证分析</a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
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
							<div class="row">
								<div class="form-group"></div>

								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<select class="js-select2 form-control" id="largeanalysis_customerId">
												<option></option>
											</select> <label for="analysis_customerId">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<!-- <select class="form-control" id="analysis_yyyy">
												<option></option>
											</select> -->
											<input id="analysis_yyyy" class="form-control date-picker" type="text"
												   autocomplete="off">
											<label for="analysis_yyyy">选择年份</label>
										</div>
									</div>
								</div>


								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="analysis_subjectid">
											<label for="detail_subjectid">科目编号</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="form-control" id="analysis_moneyType">
												<option value='1'>借方发生额</option>
												<option value='-1'>贷方发生额</option>

											</select>
											<label for="detail_subjectid">金额类型</label>
										</div>
									</div>
								</div>

								<div class="form-group has-info">

									<div class="col-sm-2">
										<div class="form-material input-group">
											<input class="form-control" type="number" id="start_money">
											<span class="input-group-addon">~</span>

											<input class="form-control" type="number" id="end_money">

											<label for="search_summery">计量金额</label>
										</div>
									</div>

								</div>

							</div>
						</div>
					</div>

					<div class="block block-themed" id="subjectlist1_block">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">图表<span id="validDate"></span></h3>

						</div>
						<div class="block-content">
							<div id="analysis_echarts" style="width:90%; height:400%;"></div>
							<div id="analysis_count">
								<div class="form-group has-info">
									<div class="col-sm-3">
										<div class="form-material input-group">
											<input class="form-control" type="number" id="start_moneycount">
											<span class="input-group-addon">~</span>

											<input class="form-control" type="number" id="end_moneycount">

											<label for="search_summery">金额</label>
										</div>
									</div>

								</div>
								<div class="form-group has-info" style="height:100px;">
									<div class="col-sm-2">
										<div class="form-material input-group" style="width:100%;">
											<div class="form-control" style="width:100px;" id="voucher_count"></div>
											<label for="search_summery">凭证数量</label>
										</div>
									</div>
									<button type="button" class="btn btn-primary" id="count_detail">显示明细</button>
								</div>


							</div>
						</div>
					</div>


					<div class="block block-bordered" id="subjectlist_block">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<li>
									<button id="largeAmountVoucher_export" type="button" style="display: none;">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
								<li>
									<button id="largeAmountVoucher_export_dg" type="button" style="display: none;">
										<i class="si si-cloud-download" style="color: white;" title="导出到底稿附件"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果</h3>
						</div>

						<div class="block-content">
							<table id="subjectEntry"
								   class="table table-bordered table-striped table-hover"></table>
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

					<%--  <button class="btn btn-md btn-primary" type="button" id="modal_tbsubjectid_sure">
						  <i class="si si-cloud-download"></i><span>&nbsp;导出</span>
					  </button>--%>

				</div>

			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/finCenter/largeAmountVoucherAnalysis.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/voucherDetail.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script> 
<script src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/samplingList.js"></script>
