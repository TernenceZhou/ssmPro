<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<!-- <ul class="nav nav-tabs" data-toggle="tabs" id="tab_detailaccount">
			<li class="active"><a href="#tab_tab_detailaccountser">etl任务</a></li>
			<li class="pull-right">
                <ul class="block-options push-10-t push-10-r">
                    <li>
                        <button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
                    </li>
                </ul>
            </li>
		</ul> -->
		<div class="block-content tab-content">
			<div class="tab-pane active">

				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_benford_search" type="button">
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
											<select class="js-select2 form-control" id="benford_customerId"
													style="width: 100%;">
												<option></option>
											</select> <label for="benford_customerId">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material input-group">
											<input id="benford_startDate" class="form-control date-picker" autocomplete="off"
													   type="text" value="">
											<span class="input-group-addon">~</span>
											<input id="benford_endDate" class="form-control date-picker" autocomplete="off"
												   type="text" value="">
											<label for="benford_startDate">账套年份</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="benford_subjectid"
													   autocomplete="off">
												<label for="benford_subjectid">科目编号</label>
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
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span><span id="validDate"></span></h3>

						</div>
						<div class="block-content" id="chartsBenford">
							<!-- <div id="chartsBenford" data-height="250" style="height: 300px">
	
							</div> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_benforddetail" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog modal-lg" style="width:1350px">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button id="modal_benforddetail_export" type="button">
								<i class="si si-cloud-download" style="color: white;" title="导出"></i>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">详细信息（金额按绝对值分析）</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:300px;max-height:580px">
				<div class="row">
					<div class="col-sm-5">
						<div class="block-content" id="chartsBarSplitBenford">

						</div>
						<div class="block-content" id="chartsBarBenford">

                        </div>
					</div>
					<div class="col-sm-7">
                        <table id="benforddetail_table" class="table table-bordered table-striped table-hover"></table>
                    </div>
				</div>
			</div>
			<!-- <div class="modal-footer">
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
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
<script src="${pageContext.request.contextPath}/finCenter/benford.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>