<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_financeDataMerge">
			<li class="active"><a id="li_dataMerge_list" href="#tab_dataMerge_list">财务数据合并</a></li>
			<li><a id="li_dataMerge_subject" href="#tab_dataMerge_subject">科目合并</a></li>
			<li><a id="li_dataMerge_assitem" href="#tab_dataMerge_assitem">核算合并</a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button id="downloadDataMergeFile" type="button"><i class="fa fa-download" style="color: blue;">&nbsp;操作手册</i></button>
					</li>
					<li>
						<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul>
		<div class="block-content tab-content" id="tab_financeDataMerge_content">
			<div class="tab-pane active" id="tab_dataMerge_list">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_list_search" type="button">
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
						<div id="search-condition" class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<select class="js-select2 form-control" id="dataMerge_list_customerId"
													style="width: 100%;">
												<option></option>
											</select> <label for="dataMerge_list_customerId">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input id="dataMerge_list_yyyy" class="form-control date-picker" type="text"
												   value="">
											<label for="dataMerge_list_yyyy">会计年份</label>
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
									<button id="dataMerge_list_add" type="button">
										<i class="fa fa-plus" style="color: white;" title="添加合并任务"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"
											style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>

						</div>
						<div class="block-content">
							<table id="dataMerge_list_table" class="table table-bordered table-striped table-hover"></table>
							<div id="hot"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_dataMerge_subject">
				<div class="content">
					<%--<div class="block block-themed">
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
						<div id="search-condition" class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<select class="js-select2 form-control" id="dataMerge_customerId"
												style="width: 100%;">
												<option></option>
											</select> <label for="dataMerge_customerId">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input id="dataMerge_yyyy" class="form-control date-picker" type="text"
												value="">
											<label for="dataMerge_yyyy">会计年份</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>--%>
					<div class="block block-bordered">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<%--<li>
									<button id="dataMerge_init" type="button">
										<i class="fa fa-refresh" style="color: white;" title="初始化"></i>
									</button>
								</li>--%>
								<li>
									<button id="dataMerge_upload" type="button">
										<i class="si si-cloud-upload" style="color: white;" title="导入"></i>
									</button>
								</li>
                                <%--<li>
                                    <button id="dataMerge_add_subject" type="button">
                                        <i class="fa fa-plus" style="color: white;" title="添加科目"></i>
                                    </button>
                                </li>--%>
								<li>
									<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"
										style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>

						</div>
						<div class="block-content">
							<table id="dataMerge_table" class="table table-bordered table-striped table-hover"></table>
							<div id="hot"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_dataMerge_assitem">
				<div class="content">
					<div class="block block-bordered">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<%--<li>
									<button id="dataMerge_assitem_init" type="button">
										<i class="fa fa-refresh" style="color: white;" title="初始化"></i>
									</button>
								</li>--%>
								<li>
									<button id="dataMerge_assitem_upload" type="button">
										<i class="si si-cloud-upload" style="color: white;" title="导入"></i>
									</button>
								</li>
								<%--<li>
                                    <button id="dataMerge_add_subject" type="button">
                                        <i class="fa fa-plus" style="color: white;" title="添加科目"></i>
                                    </button>
                                </li>--%>
								<li>
									<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"
											style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>

						</div>
						<div class="block-content">
							<table id="dataMerge_assitem_table" class="table table-bordered table-striped table-hover"></table>
							<div id="hot"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_dataMerge_match" tabindex="-1" role="dialog"
	 aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-md" style="width:1200px">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button id="dataMerge_match_add" type="button">
								<i class="fa fa-plus" style="color: white;" title="添加对照"></i>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title" id="matchTitle">科目匹配</h3>
				</div>
			</div>
			<div class="modal-body" style="max-height:500px;">
				<table id="dataMerge_match_table"
					   class="table table-bordered table-striped table-hover">
				</table>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_dataMerge_subjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="top: 40px; z-index: 1060;">
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
				<div id="dataMerge_subject_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput_dataMerge" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button" id="modal_dataMerge_subjectid_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_dataMerge_subjectid_sure">
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
<div class="modal fade" id="modal_dataMerge_add" tabindex="-1" role="dialog"
     aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-md" style="width:1000px">
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
                    <h3 class="block-title">科目添加</h3>
                </div>
            </div>
            <div class="modal-body" style="max-height:800px;">
                <div class="block block-themed">
                    <div class="block-header bg-primary">
                        <ul class="block-options">
                            <li>
                                <button id="btn_add_search" type="button">
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
                    <div id="search-condition" class="block-search">
                        <div class="row">
                            <div class="form-group"></div>
                            <div class="form-group has-info">
                                <div class="col-sm-4">
                                    <div class="form-material">
                                        <select class="js-select2 form-control" id="dataMerge_add_customerId"
                                                style="width: 100%;">
                                            <option></option>
                                        </select> <label for="dataMerge_add_customerId">客户名称</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group has-info">
                                <div class="col-sm-2">
                                    <div class="form-material">
                                        <select class="js-select2 form-control" id="dataMerge_add_contrast"
                                                style="width: 100%;">
                                            <option></option>
                                        </select> <label for="dataMerge_add_contrast">是否已对照</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table id="dataMerge_add_subject_table"
                       class="table table-bordered table-striped table-hover">
                </table>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modal_data_merge_import" tabindex="-1"
	 role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
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
					<h3 class="block-title">导入合并科目</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<div class="form-group">
						<label class="col-xs-12" for="fileinput">模板</label>
						<div class="col-xs-12">
							<input id="data_merge_fileinput" class="file" type="file"
								   data-preview-file-type="any" multiple accept=".xlsx">
							<div id="data_merge_errorBlock" class="help-block"></div>
						</div>
					</div>

				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button"
						id="data_merge_downtemp">
					<i class="fa fa-download"></i><span>&nbsp;下载模板</span>
				</button>
				<button class="btn btn-md btn-primary" type="button"
						id="data_merge_submit">
					<i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
				</button>
				<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_data_merge_assitem_import" tabindex="-1"
	 role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
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
					<h3 class="block-title">导入合并核算</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<div class="form-group">
						<label class="col-xs-12" for="fileinput">模板</label>
						<div class="col-xs-12">
							<input id="data_merge_assitem_fileinput" class="file" type="file"
								   data-preview-file-type="any" multiple accept=".xlsx">
							<div id="data_merge_assitem_errorBlock" class="help-block"></div>
						</div>
					</div>

				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button"
						id="data_merge_assitem_downtemp">
					<i class="fa fa-download"></i><span>&nbsp;下载模板</span>
				</button>
				<button class="btn btn-md btn-primary" type="button"
						id="data_merge_assitem_submit">
					<i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
				</button>
				<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_add_merge_list" tabindex="-1"
	 role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
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
					<h3 class="block-title">添加合并任务</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<select class="js-select2 form-control" id="add_merge_list_main_customerId"
										style="width: 100%;">
									<option></option>
								</select> <label for="add_merge_list_main_customerId">合并主客户（临时）</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<input id="add_merge_list_other_customerId" class="form-control" type="text"
									   value="">
								<label for="add_merge_list_other_customerId">其他合并客户（临时）</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<select class="js-select2 form-control" id="add_merge_list_customerId"
										style="width: 100%;">
									<option></option>
								</select> <label for="add_merge_list_customerId">合并后客户（正式）</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<input id="add_merge_list_yyyy" class="form-control date-picker" type="text"
									   value="">
								<label for="add_merge_list_yyyy">会计年份</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<select class="js-select2 form-control" id="add_merge_list_remain"
										style="width: 100%;">
									<option></option>
								</select> <label for="add_merge_list_remain">是否合并期初数</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button"
						id="add_merge_list_submit">
					<i class="fa fa-save"></i><span>&nbsp;保存</span>
				</button>
				<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_dataMerge_customer" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="top: 40px; z-index: 1060;">
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
					<h3 class="block-title">选择客户</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="dataMerge_customer_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput_customer" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button" id="modal_dataMerge_customer_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_dataMerge_customer_sure">
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
<div class="modal fade" id="modal_update_merge_list" tabindex="-1"
	 role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
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
					<h3 class="block-title">修改合并任务</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<select class="js-select2 form-control" id="update_merge_list_main_customerId"
										style="width: 100%;">
									<option></option>
								</select> <label for="update_merge_list_main_customerId">合并主客户（临时）</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<input id="update_merge_list_other_customerId" class="form-control" type="text"
									   value="">
								<label for="update_merge_list_other_customerId">其他合并客户（临时）</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<select class="js-select2 form-control" id="update_merge_list_customerId"
										style="width: 100%;">
									<option></option>
								</select> <label for="update_merge_list_customerId">合并后客户（正式）</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<input id="update_merge_list_yyyy" class="form-control date-picker" type="text"
									   value="">
								<label for="update_merge_list_yyyy">会计年份</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-12">
							<div class="form-material">
								<select class="js-select2 form-control" id="update_merge_list_remain"
										style="width: 100%;">
									<option></option>
								</select> <label for="update_merge_list_remain">是否合并期初数</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button"
						id="update_merge_list_submit">
					<i class="fa fa-save"></i><span>&nbsp;保存</span>
				</button>
				<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_dataMerge_add_otherCustomer" tabindex="-1" role="dialog"
	 aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-md" style="width:800px">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button id="dataMerge_add_otherCustomer" type="button">
								<i class="fa fa-plus" style="color: white;" title="添加合并客户"></i>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">合并客户维护</h3>
				</div>
			</div>
			<div class="modal-body" style="max-height:500px;">
				<div id="addOtherCustomerTitle"></div>
				<table id="dataMerge_add_otherCustomer_table"
					   class="table table-bordered table-striped table-hover">
				</table>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/finCenter/dataMerge.js"></script>