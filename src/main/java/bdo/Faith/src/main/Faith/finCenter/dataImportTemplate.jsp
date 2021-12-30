<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_detailaccount">
			<li class="active"><a id="li_detailaccountser" href="#tab_tab_detailaccountser">数据导入(模板)</a></li>
			<!-- <li class=""><a id="li_accdata_delete" href="#tab_tab_accdata_delete">数据清除</a></li> -->
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
									<button id="viewFinManual" type="button">
										<i class="fa fa-file-pdf-o" style="color: red;">&nbsp;数据导入常见问题</i>
									</button>
								</li>
								<li>
									<button id="btn_import" type="button">
										<i class="si si-cloud-upload" style="color: white;">&nbsp;模板导入</i>
									</button>
								</li>
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
											<input id="search_startDate" class="form-control date-picker" type="text"
												value="">
											<label for="detail_startyyyy">会计年份</label>
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
									<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"
										style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>

						</div>
						<div class="block-content">
							<table id="subjectEntry" class="table table-bordered table-striped table-hover"></table>
							<div id="hot"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_tab_accdata_delete">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_delete_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="btn_delete_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
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
											<select class="js-select2 form-control" id="detail_delete__customerId"
												style="width: 100%;">
												<option></option>
											</select> <label for="detail_customerId">客户名称</label>
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
									<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"
										style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>
						</div>
						<div class="block-content">
							<table id="table_delete" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


<div class="modal fade" id="modal-importCustomerReport" tabindex="-1" role="dialog" aria-hidden="true"
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
					<h3 class="block-title">导入客户数据</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
				<div class="row">
					<div class="form-group">
						<label class="col-xs-12" for="account_customerId_model">客户名称</label>
						<div class="col-xs-12">
							<select class="js-select2 form-control" id="account_customerId_model" style="width: 100%;">
								<option></option>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label class="col-xs-12" for="account_yyyy_model">会计年份</label>
						<div class="col-xs-12">
							<input id="account_yyyy_model" class="form-control date-picker" type="text" value="">
						</div>
					</div>
					<div class="form-group">
						<label class="col-xs-12" for="account_customerId_model">上传文件类型</label>
						<div class="col-xs-12">
							<select class="js-select2 form-control" id="fileType" style="width: 100%;">
							</select>
						</div>
					</div>
					<div class="form-group">
						<label class="col-xs-12" for="fileinput">客户数据</label>
						<div class="col-xs-12">
							<input id="fileinput" class="file" type="file" data-preview-file-type="any" multiple
								accept=".xlsx">
							<div id="errorBlock" class="help-block"></div>
						</div>
					</div>

				</div>
			</div>
			<div class="modal-footer">
				<span style="float:left;color:red;" class="text-left">导入0金额数据根据<br>下年科目生成</span>
				<button class="btn btn-md btn-primary dropdown-toggle" data-toggle="dropdown" type="button">
					<i class="fa fa-download"></i><span>下载模板</span><span class="caret"></span>
				</button>
				<ul id="btn_downtemp" class="dropdown-menu" style="margin-left: 40%;margin-top: -10px">
					<li><a href="#" data-value="1">仅余额表模板</a></li>
					<li><a href="#" data-value="2">余额+明细模板</a></li>
					<li><a href="#" data-value="6">余额+明细(分月)模板</a></li>
					<li><a href="#" data-value="7">仅核算余额+核算明细模板</a></li>
				</ul>
				<button class="btn btn-md btn-primary" type="button" id="import_submit">
					<i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
				</button>
				<button class="btn btn-md btn-primary" type="button" id="import_blankdata">
					<i class="fa fa-send"></i><span>&nbsp;导入0金额</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/finCenter/dataImportTemplate.js"></script>