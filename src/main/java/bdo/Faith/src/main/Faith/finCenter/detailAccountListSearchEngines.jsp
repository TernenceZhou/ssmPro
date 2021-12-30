<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<style>
	#example {
		text-align: center;
	}

	.transform_font_size {
		transform: scale(0.5);
	}
</style>

<!--<div class="content bg-gray-lighter">
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
			<li class="active"><a href="#tab_tab_detailaccountser">明细账(搜索引擎)</a></li>
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
									<button id="btn_import" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;数据加载</i>
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
												<select class="js-select2 form-control" id="detail_customerId"
														style="width: 100%;">
													<option></option>
												</select> <label for="detail_customerId">客户名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<!-- <select class="form-control" id="detail_startyyyy">
													<option></option>
												</select>  -->
												<input id="detail_startyyyy" class="form-control date-picker"
													   type="text" autocomplete="off">
												<label for="detail_startyyyy">开始年份</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material input-group" style="width : 100%;">
												<select class="form-control" id="detail_startmonth">
													<option></option>
												</select> <label for="detail_startmonth">开始月份</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<!-- <select class="form-control" id="detail_endyyyy">
													<option></option>
												</select>  -->
												<input id="detail_endyyyy" class="form-control date-picker" type="text"
													   autocomplete="off">
												<label for="detail_endyyyy">结束年份</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material input-group" style="width : 100%;">
												<select class="form-control" id="detail_endmonth">
													<option></option>
												</select> <label for="detail_endmonth">结束月份</label>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="detail_subjectid">
												<label for="detail_subjectid">科目编号</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="detail_voucherFillUser">
												<label for="detail_voucherFillUser">制单人</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="detail_voucherAuditUser">
												<label for="detail_voucherAuditUser">审核人</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="detail_vouchartype">
													<option value='-1'>全部</option>
													<option value='0'>一借一贷</option>
													<option value='1'>一借多贷</option>
													<option value='2'>一贷多借</option>
													<option value='3'>多借多贷</option>
												</select>
												<label for="detail_vouchartype">分录类型</label>
											</div>
										</div>
									</div>
									<!-- <div class="form-group has-info" >
										<div class="col-sm-2" >
											<div class="form-material">
											</div>
										</div>
									</div> -->
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="subject_type">
													<option value="1" select>一级</option>
													<option value="0">末级</option>
												</select>

												<label for="search_money">对方科目显示方式</label>
											</div>
										</div>
									</div>


									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="summary_type">
													<option value="&&">且</option>
													<option value="||">或</option>
													<option value="not">不含</option>
												</select>

												<label for="search_money">摘要关键字</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material input-group">
												<input class="form-control" type="text" id="summary1">
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material input-group">
												<input class="form-control" type="text" id="summary2">
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material input-group">
												<input class="form-control" type="text" id="summary3">
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
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>
							<!-- <div class="block-options" style="margin-right:50px;">字体大小<select class="js-select2 form-control block-options" id="font_size"  style="width: 100px;">
													<option value="40">40</option>
													<option value="30">30</option>
													<option value="25">25</option>
													<option value="20" selected>20</option>
													<option value="15">15</option>
													<option value="10">10</option>
												</select>
							</div>   -->
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
<script src="${pageContext.request.contextPath}/finCenter/detailAccountListSearchEngines.js"></script>
<script
		src="${pageContext.request.contextPath}/finCenter/common/accountLedager.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/accountDetail.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/voucherDetail.js"></script>

<script src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script> 

