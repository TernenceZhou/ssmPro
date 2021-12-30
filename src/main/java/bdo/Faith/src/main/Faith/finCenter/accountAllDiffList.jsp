<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_detailaccount">
			<li class="active"><a href="#tab_accountAllDiff_one" id="accountAllDiff_through1">外币余额表修正</a></li>
			<li class=""><a href="#tab_accountAllDiff_two" id="accountAllDiff_through2">科目方向修正</a></li>
			<li class="pull-right">
                <ul class="block-options push-10-t push-10-r">
                    <li>
                        <button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
                    </li>
                </ul>
            </li>
		</ul>
		<div class="block-content tab-content">
			<div class="tab-pane active" id="tab_accountAllDiff_one">

				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_accountAllDiff_search" type="button">
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
											<select class="js-select2 form-control" id="accountAllDiff_customerId"
													style="width: 100%;">
												<option></option>
											</select> <label for="accountAllDiff_customerId">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input id="accountAllDiff_startDate" class="form-control date-picker"
												   type="text" value="">
											<label for="accountAllDiff_startDate">账套年份</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="accountAllDiff_subjectid">
											<label for="accountAllDiff_subjectid">科目编号</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="js-select2 form-control" id="accountAllDiff_isTrue"
													style="width: 100%;">
												<option value="1">是</option>
												<option value="0">否</option>
											</select> <label for="accountAllDiff_isTrue">只显示不一致数据</label>
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
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>

						</div>
						<div class="block-content">
							<table id="accountAllDiffListTable"
								   class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
			
			<!-- ------------------------------------------------------------------------------- -->
			<div class="tab-pane" id="tab_accountAllDiff_two">

				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_accountAllDiff_search2" type="button">
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
											<select class="js-select2 form-control" id="accountAllDiff_customerId2"
													style="width: 100%;">
												<option></option>
											</select> <label for="accountAllDiff_customerId2">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input id="accountAllDiff_startDate2" class="form-control date-picker"
												   type="text" value="">
											<label for="accountAllDiff_startDate2">账套年份</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="accountAllDiff_subjectid2">
											<label for="accountAllDiff_subjectid2">科目编号</label>
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
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>

						</div>
						<div class="block-content">
							<table id="accountAllDiffListTable2"
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
<div class="modal fade" id="modal_subjectid2" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
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
				<div id="subject_tree2"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput2" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button" id="modal_subjectid_reset2">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_subjectid_sure2">
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
<div class="modal fade" id="accountAllDiff-modal" tabindex="-1" role="dialog" aria-hidden="true"
	 data-backdrop="static" data-keyboard="false" style="top:40px;">
	<div class="modal-dialog modal-md" style="width:1200px">
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
					<h3 class="block-title">外币余额</h3>
				</div>
			</div>
			<div class="modal-body block block-bordered" id="accountAllDiff_content"  style="min-height:100px;max-height:500px">
				<div class="content">
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="accountAllDiff_save" type="button">
										<i class="fa fa-save" style="color: white;" title="保存"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title"><span id="accountAllDiff_amount"></span></h3>
						</div>
						<div class="block-content">
							<table id="accountAllDiffTable"
								   class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="accountAllDiff-modal2" tabindex="-1" role="dialog" aria-hidden="true"
	 data-backdrop="static" data-keyboard="false" style="top:40px;">
	<div class="modal-dialog modal-md" style="width:1200px">
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
					<h3 class="block-title">方向</h3>
				</div>
			</div>
			<div class="modal-body block block-bordered" id="accountAllDiff_content2"  style="min-height:100px;max-height:500px">
				<div class="content">
					<div class="block-search">
						<div class="row">
							<div class="form-group"></div>
							<div class="form-group has-info">
								<div class="col-sm-4">
									<div class="form-material">
										<select class="js-select2 form-control" id="accountAllDiff_direction2"
												style="width: 100%;">
											<option></option>
										</select> <label for="accountAllDiff_direction2">方向</label>
									</div>
								</div>
							</div>
							<div class="form-group has-info">
								<div class="col-sm-4">
									<div class="form-material">
										<button id="accountAllDiff_save2" type="button" class="btn btn-danger">保存</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- <div class="block block-bordered">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="accountAllDiff_save2" type="button">
										<i class="fa fa-save" style="color: white;" title="保存"></i>
									</button>
								</li>
							</ul>
						</div>
						<div class="block-content">
							<table id="accountAllDiffTable_account"
								   class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div> -->
					<ul class="nav nav-tabs" data-toggle="tabs" id="tabs_accountAllDiff">
						<li class="active"><a href="#tab_accountAllDiff1">余额表</a></li>
						<li><a href="#tab_accountAllDiff2">外币余额表</a></li>
						<li><a href="#tab_accountAllDiff3">核算余额表</a></li>
						<li><a href="#tab_accountAllDiff4">外币核算余额表</a></li>
					</ul>
					<div class="block-content tab-content" id="tabs_subjectAbsoluteGroup_content">
						<div class="tab-pane active" id="tab_accountAllDiff1">
							<div class="block block-bordered">
								<div class="block-header bg-primary">
									<h3 class="block-title">余额表</h3>
								</div>
								<div class="block-content">
									<table id="accountAllDiffTable_account" class="table table-bordered table-striped table-hover">
									</table>
								</div>
							</div>
						</div>
						<div class="tab-pane" id="tab_accountAllDiff2">
							<div class="block block-bordered">
								<div class="block-header bg-primary">
									<h3 class="block-title">外币余额表</h3>
								</div>
								<div class="block-content">
									<table id="accountAllDiffTable_accountAll" class="table table-bordered table-striped table-hover">
									</table>
								</div>
							</div>
						</div>
						<div class="tab-pane" id="tab_accountAllDiff3">
							<div class="block block-bordered">
								<div class="block-header bg-primary">
									<h3 class="block-title">核算余额表</h3>
								</div>
								<div class="block-content">
									<table id="accountAllDiffTable_assitem" class="table table-bordered table-striped table-hover">
									</table>
								</div>
							</div>
						</div>
						<div class="tab-pane" id="tab_accountAllDiff4">
							<div class="block block-bordered">
								<div class="block-header bg-primary">
									<h3 class="block-title">外币核算余额表</h3>
								</div>
								<div class="block-content">
									<table id="accountAllDiffTable_assitemAll" class="table table-bordered table-striped table-hover">
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/finCenter/accountAllDiffList.js"></script>