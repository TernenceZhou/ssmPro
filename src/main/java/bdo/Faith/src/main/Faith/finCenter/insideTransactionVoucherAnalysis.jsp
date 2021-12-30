<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
	<style>
		#example {
			text-align: center;
		}
	</style>

	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_detailaccount">
				<!-- <li class="active"><a href="#tab_accountledger" id="dyVoucher_tab_1">关联方交易分析</a></li> -->
				<li class="pull-right">
					<ul class="block-options push-10-t push-10-r">
						<li>
							<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
						</li>
					</ul>
				</li>
			</ul>

			<!-- 关联方交易分析 -->
			<div class="block-content tab-content" id="tab_detailaccount_content">
				<!-- <div class="tab-pane" id="tab_accountledger">
				    <div class="content" id="removeId"><div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options"><li>
                    <button id="many_edit" type="button" style="float:left;color:white;" title="选择要分析的凭证,小杏仁帮您分析哟"><img src="img/bdo/xxr24.png" style="height: 22px;width: 22px;">&nbsp;推荐分析</button>
	                <button id="many_clear" type="button" style="float:left;"><i class="fa fa-eraser" style="color: white;">&nbsp;清空</i></button>
	                <button id="many_preservation" type="button" style="float:left;"><i class="fa fa-download" style="color: white;">&nbsp;保存</i></button>
	                <button id="many_export" style="float:left;" type="button"><i class="si si-cloud-download" style="color: white;">&nbsp;导出</i></button>
	                </li></ul><h3 class="block-title">关联方交易分析列表一览<span></span></h3></div><div class="block-content"><div style="clear:both;"></div>
	                <table id="table_accountledger" class="table table-bordered table-striped table-hover"></table></div></div></div>
				</div> -->
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

    <script src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/insideTransactionAnalysisTable.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/insideTransactionVoucherAnalysis.js"></script>
	<script src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>
	<script>
		jQuery(function () {
			// Init page helpers (Table Tools helper)
			App.initHelpers('table-tools');
		});

	</script>