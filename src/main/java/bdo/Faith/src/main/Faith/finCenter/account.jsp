<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<div class="content bdo-page-content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_account">
			<li class="active"><a href="#tab_accountser">余额表</a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul>
		<div class="block-content tab-content" id="tab_account_content">
			<div class="tab-pane active" id="tab_accountser">
				<div class="block">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="account_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option" data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询条件设定</h3>
						</div>
						<div id="search-condition" class="block-search">
							<div>
								<div class='row'>
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<select class="js-select2 form-control" id="account_customerId" style="width: 100%;">
													<option></option>
												</select> <label for="account_customerId">客户名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input id="account_year" class="form-control date-picker" type="text" autocomplete="off"> <label for="account_year">账套年份</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material input-group">
												<select class="form-control" id="account_startmonth" placeholder="开始月份">
													<option></option>
												</select> <span class="input-group-addon">~</span> <select class="form-control" id="account_endmonth" placeholder="结束月份">
													<option></option>
												</select> <label for="account_startmonth">会计月份</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="account_monthtype">
													<option></option>
												</select> <label for="account_monthtype">分月模式</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="account_subjectid"> <label for="account_subjectid">科目编号</label>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="account_subjectlevel">
													<option></option>
												</select> <label for="account_subjectlevel">科目级别</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="account_singlelevel">
													<option></option>
												</select> <label for="account_singlelevel">只显示本级别</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="account_notzero">
													<option></option>
												</select> <label for="account_notzero">余额不为0</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="account_rejectvou">
													<option></option>
												</select> <label for="account_rejectvou">剔除结转凭证</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="account_othercurr">
													<option></option>
												</select> <label for="account_othercurr">显示外币</label>
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
									<button id="account_export" type="button" style="display: none;">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
								<li>
									<button id="account_export_dg" type="button" style="display: none;">
										<i class="si si-cloud-download" style="color: white;" title="导出到底稿附件"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option" data-action="fullscreen_toggle" style="color: white;"></button>
								</li>
							</ul>
							<h3 class="block-title">
								查询结果<span name="cus_select"></span><span id="validDate"></span>
							</h3>
						</div>
						<div class="block-content">
							<table id="account_table" class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_subjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="top: 40px; z-index: 1070;">
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
<!-- 导出到底稿附件树弹框 -->
<div class="modal fade" id="modal_tbsubjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button class="btn btn-md btn-primary" type="button" id="modal_tbsubjectid_sure">
								<i class="si si-cloud-download" title="导出"></i>
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
<!-- 科目结构分析 科目树 -->
<div class="modal fade" id="modal_subjectid_subjectAnalysis" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="top: 40px; z-index: 1050;">
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
                <div id="subject_tree_subjectAnalysis"></div>
            </div>
            <div class="modal-footer">
                <div class="col-sm-3">
                    <input class="form-control" type="text" id="searchInput_subjectAnalysis" placeholder="搜索科目">
                </div>
                <div class="col-sm-9">
                    <button class="btn btn-md btn-primary" type="button" id="modal_subjectid_subjectAnalysis_reset">
                        <i class="fa fa-repeat"></i><span>&nbsp;重置</span>
                    </button>
                    <button class="btn btn-md btn-primary" type="button" id="modal_subjectid_subjectAnalysis_sure">
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
<script src="${pageContext.request.contextPath}/finCenter/account.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/accountLedager.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/accountDetail.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/voucherDetail.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/assitemView.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/assitemLedager.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/assitemDetail.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/subjectAnalysis.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/samplingList.js"></script>