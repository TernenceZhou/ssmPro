<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_detailaccount">
				<li class="active"><a href="#tab_tab_detailaccountser">非常用科目分析</a></li>
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

					<div class="content" id="tab_infrequentSubjects">
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>以凭证显示 <label class="css-input switch switch-sm switch-success"><input
												type="checkbox" id="isaType"><span></span></label></li>
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
												<select class="js-select2 form-control" id="analysis_customerId">
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
												<input class="form-control" type="number" id="analysis_count" value="3">
												<label for="analysis_count">凭证数量</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material input-group">
												<input class="form-control" type="number" id="analysis_start_money">
												<span class="input-group-addon">~</span>

												<input class="form-control" type="number" id="analysis_end_money">

												<label for="analysis_search_summery">计量金额</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="block block-themed" id="subjectlist_block_echarts">
							<div class="block-header  bg-primary">
								<ul class="block-options" id="">
									<li>
										<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">图表<span id="validDate"></span></h3>
							</div>
							<div class="block-content">
								<div id="analysis_echarts" style="width: 100%; height: 400%;"></div>
							</div>
						</div>


						<div class="block block-bordered" id="subjectlist_block">
							<div class="block-header  bg-primary">
								<ul class="block-options" id="">
									<li>
										<button id="infrequentSubjectsAnalysis_export" type="button"
											style="display: none;">
											<i class="si si-cloud-download" style="color: white;" title="导出"></i>
										</button>
									</li>
									<li>
										<button id="infrequentSubjectsAnalysis_export_dg" type="button"
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
								<h3 class="block-title">查询结果</h3>

							</div>
							<div class="block-content">
								<table id="subjectEntry" class="table table-bordered table-striped table-hover"></table>
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
				<div class="modal-body" style="min-height: 500px; max-height: 500px">
					<div id="subject_tree"></div>
				</div>
				<div class="modal-footer">
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
	<div class="modal fade" id="modal_voucher_detail" role="dialog" aria-hidden="true" data-backdrop="static"
        data-keyboard="false">
	    <div class="modal-dialog modal-lg" style="width:1200px">
	        <div class="modal-content">
	            <div class="block block-themed block-transparent remove-margin-b">
	                <div class="block-header bg-info">
	                    <ul class="block-options">
	                        <li>
	                            <button id="modal_voucher_detail_export" type="button">
	                                <i class="si si-cloud-download" style="color: white;" title="导出"></i>
	                            </button>
	                        </li>
	                        <li>
	                            <button type="button" data-dismiss="modal">
	                                <i class="si si-close"></i>
	                            </button>
	                        </li>
	                    </ul>
	                    <h3 class="block-title">凭证详细<span id="modal_detail_info"></h3>
	                </div>
	                <div class="modal-body" style="min-height: 300px; max-height: 500px">
                        <table id="modal_voucher_detail_table" class="table table-bordered table-striped table-hover"></table>
	                </div>
	                <div class="modal-footer">
	                    <button class="btn btn-md btn-warning" type="button"
	                        data-dismiss="modal">
	                        <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
	                    </button>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
	<script src="${pageContext.request.contextPath}/finCenter/infrequentSubjectsAnalysis.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/accountLedager.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/accountDetail.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/voucherDetail.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>
	<script src="${pageContext.request.contextPath}/dgCenter/js/dg/samplingList.js"></script>