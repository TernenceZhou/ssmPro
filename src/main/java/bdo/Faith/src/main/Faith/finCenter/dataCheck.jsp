<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_datacheck">
			<li class="active"><a href="#tab_datacheckser">数据校验</a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul>
		<div class="block-content tab-content" id="tab_datacheck_content">
			<div class="tab-pane active" id="tab_datacheckser">
				<div class="block">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="check_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option" data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">搜索条件设定</h3>
						</div>
						<div id="search-condition" class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<select class="js-select2 form-control" id="check_companyid" style="width: 100%;">
												<option></option>
											</select> <label for="check_companyid">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material input-group">
											<input id="check_year" class="form-control date-picker" type="text"
												   autocomplete="off">
											<label for="check_year">账套年份</label>
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
									<button type="button" data-toggle="block-option" data-action="fullscreen_toggle" style="color: white;" title="放大"> </button>
								</li>
							</ul>
							<h3 class="block-title">数据校验<span id="validDate"></span></h3>
						</div>
						<div class="block-content">
							<div class="row">
								<div class="col-sm-3">
									<div class="alert alert-success alert-dismissable">
										<div>
											总凭证数 : <span id="pznum"></span>件
										</div>
										<div>
											总分录数 : <span id="flnum"></span>件
										</div>
										<div>
											总核算分录数 : <span id="hsflnum"></span>件
										</div>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="alert alert-info alert-dismissable">
										<div>
											分录总金额 : <span id="totalnum"></span>
										</div>
										<div>
											借分录总金额 : <span id="debitnum"></span>
										</div>
										<div>
											贷分录总金额 : <span id="creditnum"></span>
										</div>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="alert alert-warning alert-dismissable">
										<div>
											校验结果 : <br><span id="checkoutResult"></span>
										</div>
									</div>
								</div>
								<div class="col-sm-3" id="dataisedit" style="display: none;">
									<div class="alert alert-danger alert-dismissable" id="dataisedittxt">
									</div>
								</div>
							</div>
							<div class="row" id="data_check_charts"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_datacheckdetail" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button id="modal_datacheckdetail_btn_viewuser" type="button">
								<i class="fa fa-user" style="color: white;" title="查看分录录入人员"></i>
							</button>
						</li>
						<li>
							<button id="modal_datacheckdetail_export" type="button">
								<i class="si si-cloud-download" style="color: white;" title="导出"></i>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title" id="datacheck_detail_title">详细信息</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:300px;max-height:500px">
				<table id="datacheck_table" class="table table-bordered table-striped table-hover"></table>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_datacheckdetail_voucher" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button id="modal_datacheckdetail_voucher_export" type="button">
								<i class="si si-cloud-download" style="color: white;" title="导出"></i>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">凭证详细</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:300px;max-height:500px">
				<table id="datacheck_table_voucher" class="table table-bordered table-striped table-hover"></table>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_datacheckdetail_entry" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button id="modal_datacheckdetail_entry_export" type="button">
								<i class="si si-cloud-download" style="color: white;" title="导出"></i>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">分录详细</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:300px;max-height:500px">
				<table id="datacheck_table_entry" class="table table-bordered table-striped table-hover"></table>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_editinfo" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal"><i class="si si-close"></i></button>
						</li>
					</ul>
					<h3 class="block-title">数据修正记录</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:300px;max-height:500px">
				<table id="tab_edit_info" class="table table-bordered table-striped table-hover"></table>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_datacheckdetail_viewuser" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-warning">
					<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">分录人员</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height: 300px; max-height: 500px">
				<table id="modal_datacheckdetail_usertable" class="table table-bordered table-striped table-hover"></table>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_datacheck_voucher_auth" role="dialog" aria-hidden="true" data-backdrop="static"
     data-keyboard="false">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="block block-themed block-transparent remove-margin-b">
                <div class="block-header bg-info">
                    <ul class="block-options">
                        <li>
                            <button id="modal_datacheck_voucher_auth_export" type="button">
                                <i class="si si-cloud-download" style="color: white;" title="导出"></i>
                            </button>
                        </li>
                        <li>
                            <button type="button" data-dismiss="modal">
                                <i class="si si-close"></i>
                            </button>
                        </li>
                    </ul>
                    <h3 class="block-title">编制人员权限<span id=importAuthCustomer></span></h3>
                </div>
            </div>
            <div class="modal-body" style="min-height:300px;max-height:500px">
                <!-- <div class="block block-themed">
                    <div class="block-header bg-primary">
                        <ul class="block-options">
                            <li>
                                <button id="datacheck_voucher_auth_search" type="button">
                                    <i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
                                </button>
                            </li>
                            <li>
                                <button type="button" data-toggle="block-option" data-action="content_toggle"></button>
                            </li>
                        </ul>
                        <h3 class="block-title">搜索条件设定</h3>
                    </div>
                    <div id="search-condition" class="block-search">
                        <div class="row">
                            <div class="form-group"></div>
                            <div class="form-group has-info">
                                <div class="col-sm-4">
                                    <div class="form-material">
                                        <select class="js-select2 form-control" id="datacheck_voucher_auth_customerId" style="width: 100%;">
                                            <option></option>
                                        </select> <label for="datacheck_voucher_auth_customerId">客户名称</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
                <table id="datacheck_voucher_auth_table" class="table table-bordered table-striped table-hover"></table>
            </div>
            <div class="modal-footer">
                <button class="btn btn-md btn-primary" type="button" id="datacheck_voucher_auth_import">
                    <i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
                </button>
                <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
                    <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
                </button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modal_voucher_auth_import" tabindex="-1" role="dialog" aria-hidden="true"
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
                    <h3 class="block-title">导入编制人员权限</h3>
                </div>
            </div>
            <div class="modal-body" style="height: auto; overflow: visible;">
                <div class="row">
                    <div class="form-group">
                        <label class="col-xs-12" for="voucher_auth_customerId">客户名称</label>
                        <div class="col-xs-12">
                            <select class="js-select2 form-control" id="voucher_auth_customerId" style="width: 100%;" disabled="true">
                                <option></option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-12" for="fileinput">模板</label>
                        <div class="col-xs-12">
                            <input id="voucher_auth_fileinput" class="file" type="file" data-preview-file-type="any" multiple
                                accept=".xlsx">
                            <div id="voucher_auth_errorBlock" class="help-block"></div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-md btn-primary" type="button" id="voucher_auth_downtemp">
                    <i class="fa fa-download"></i><span>&nbsp;下载模板</span>
                </button>
                <button class="btn btn-md btn-primary" type="button" id="voucher_auth_submit">
                    <i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
                </button>
                <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
                    <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
                </button>
            </div>
        </div>
    </div>
</div>
<script src="${pageContext.request.contextPath}/finCenter/dataCheck.js"></script>