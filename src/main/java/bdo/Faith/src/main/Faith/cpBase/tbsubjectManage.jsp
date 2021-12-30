<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_tbSubjectManage">
				<li class="active"><a href="#tab_tbtemplate">模板一览</a></li>
				<li><a href="#tab_template">TB模板维护</a></li>
				<li><a href="#tab_tbReprot">模板对照一览</a></li>
				<li><a href="#tab_tbSubjectManager">TB科目对照</a></li>
				<li class="pull-right">
                    <ul class="block-options push-10-t push-10-r">
                        <li>
                            <button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
                        </li>
                    </ul>
                </li>
			</ul>
			<div class="block-content tab-content" id="tab_tbSubjectManage_content">
				<div class="tab-pane active" id="tab_tbtemplate">
					<div class="">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="tbcomtemplate_search" type="button">
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
										<div class="col-sm-2">
											<div class="form-material">
												<%--<select class="js-select2 form-control" id="tbsubject_name"  style="width: 100%;">
													<option></option>
												</select>--%>
                                                <input class="form-control" type="text" id="tbsubject_name">
												<label for="tbsubject_name">模板名称</label>
											</div>
										</div>
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="tbsubject_remark">
												<label for="tbsubject_remark">描述</label>
											</div>
										</div>
										<div class="col-sm-2">
											<div class="form-material">
												<select class="js-select2 form-control" id="tbsubject_create"  style="width: 100%;">
													<option></option>
												</select>
												<label for="tbsubject_create">创建者</label>
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
                                        <button id="comtemplate_add" type="button">
                                            <i class="fa fa-plus" style="color: white;" title="新增模板"></i>
                                        </button>
                                    </li>
                                </ul>
								<h3 class="block-title">模板一览</h3>
							</div>
							<div class="block-content">
								<table id="tbsubjectAll_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_template">
					<div class="">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="comtemplate_search" type="button">
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
										<div class="col-sm-2">
											<div class="form-material">
												<label for="template_vocationId">TB模板</label>
												<select class="js-select2 form-control" id="template_vocationId"  style="width: 100%;">
													<option></option>
												</select> <label for="template_vocationId">TB模板</label>
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
										<button id="export_template1" type="button">
											<i class="si si-cloud-download" style="color: white;" title="导出"></i>
										</button> 
									</li> 
									<li>
										<button id="comtemplate_browse" type="button">
											<i class="fa fa-indent" style="color: white;" title="报表对照"></i>
										</button> 
									</li> 
 									<li>
										<button id="comtemplatecol_add" type="button">
											<i class="fa fa-plus" style="color: white;" title="添加科目"></i>
										</button> 
									</li>
									<li>
										<button id="comtemplate_edit" type="button">
											<i class="fa fa-edit" style="color: white;" title="修改模板"></i>
										</button>
									</li>
									<li>
										<button id="comtemplatecol_sort" type="button">
											<i class="fa fa-list-ol" style="color: white;" title="保存排序"></i>
										</button> 
									</li> 
									<li>
										<button id="import_tbTemplate" type="button">
											<i class="si si-cloud-upload" style="color: white;" title="导入数据"></i>
										</button> 
									</li> 
								</ul>
								<h3 class="block-title">TB模板<span id="template_select"></span></h3>
							</div>
							<div class="block-content">
								<table id="comtemplate_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_tbReprot">
					<div class="">
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="refreshTbReportBtn" type="button">
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
										<div class="col-sm-2">
											<div class="form-material">
												<label for="tab2_tbTemplate">TB模板</label>
												<select class="js-select2 form-control" id="tab2_tbTemplate"  style="width: 100%;">
													<option></option>
												</select> <label for="tab2_tbTemplate">TB模板</label>
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
										<button id="contract_add" type="button">
											<i class="fa fa-plus" style="color: white;" title="添加对照"> </i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">模板对照</h3>
							</div>
							<div class="block-content">
								<table id="tbReportCompare" class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
					</div>
				</div>
				
				<div class="tab-pane" id="tab_tbSubjectManager">
					<div class="">
					<div class="block block-themed  block-opt-hidden">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="tbsubject_search" type="button">
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
									<div class="col-sm-3">
										<div class="form-material">
											<select class="js-select2 form-control" id="tab3_tbTemplate"  style="width: 100%;">
													<option></option>
											</select> <label for="tab3_tbTemplate">TB模板</label>
										</div>
									</div>
									<div class="col-sm-2">
										<div class="form-material">
											<label for="tbsubject_rule">报表模板</label>
											<input class="form-control" type="text" data-result="" data-content="" id="tbsubject_rule" value="">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<!-- <li>
									<button id="rpt_importCustomerReport" type="button">
											<i class="fa fa-upload" style="color: white;">&nbsp;导入部门TB科目</i>
									</button>
								</li>
								<li>
									<button id="tbsubject_init" type="button">
										<i class="fa fa-info-circle" style="color: white;">&nbsp;导入标准报表科目</i>
									</button>
								</li>
								<li>
									<button id="tbsubject_sort" type="button">
										<i class="fa fa-list-ol" style="color: white;">&nbsp;保存排序</i>
									</button>
								</li>-->
								<li>
									<button id="report_switch" type="button">
										<i class="fa fa-exchange" style="color: white;" title="切换"></i>
									</button>
								</li>
                               <%-- <li>
                                    <button id="add_report_func" type="button">
                                        <i class="fa fa-plus" style="color: white;">&nbsp;保存计算公式</i>
                                    </button>
                                </li>--%>
                                <!-- <li>
                                    <button id="tb_suspend" type="button">
                                        <i class="fa fa-plus" style="color: white;">&nbsp;弹出</i>
                                    </button>
                                </li> -->
								<li>
									<button id="tb_report_contract" type="button">
										<i class="fa fa-repeat" style="color: white;" title="重置对照"></i>
									</button>
								</li>
								<li>
									<button id="tbsubject_export" type="button">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">TB科目一览</h3>
						</div>
						<div class="block-content">
							<table id="tbsubject_table" class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
				</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_tbsubform" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
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
						<h3 class="block-title">详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="tbsub_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal-importCustomerReport" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
                        	<label class="col-xs-12" for="fileinput">报表模板</label>
                            <div class="col-xs-12">                            	
                            	<select class="js-select2 form-control" id="tbsubject_rule_model"  style="width: 100%;">
										<option></option>
								</select>
                            </div>
                        </div>
						<div class="form-group">
                        	<label class="col-xs-12" for="fileinput">客户数据</label>
                            <div class="col-xs-12">                            	
                            	<input id="fileinput" class="file" type="file" multiple data-preview-file-type="any" >
            					<div id="errorBlock" class="help-block"></div>
                            </div>
                        </div>
				
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="import_dlTemplate">
						<i class="fa fa-download"></i><span>&nbsp;下载模板</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="import_submit">
						<i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>	
	<div class="modal fade" id="modal_comtemplateform" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
						<h3 class="block-title">新增模板</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="comtemplate_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_comtemplatecolEditform" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
						<h3 class="block-title">修改模板科目</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="comtemplatecolEdit_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_comtemplatecoladdform" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
						<h3 class="block-title">添加TB科目</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="comtemplatecoladd_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_import_tbTemplate" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
						<h3 class="block-title" style="width: 80px;">导入TB科目</h3>
						<h3 class="block-title" id="tbsubjectmanage_ruleName" style="margin-left: 90px; margin-top: -18px;"></h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto;/* overflow: visible;*/">
					<div class="row">
						<div class="form-group">
                        	<label class="col-xs-12" for="tb_template_fileinput">科目数据</label>
                            <div class="col-xs-12">                            	
                            	<input id="tb_template_fileinput" class="file" type="file" multiple data-preview-file-type="any" >
            					<div id="errorBlock" class="help-block"></div>
                            </div>
                        </div>
					</div>
					<div style="color:red">
						<table border="0">
							<tr>
								<td colspan="2"><b>必须包含以下项目：</b></td>
							</tr>
							<tr>
								<td>S001：资产总计</td><td>S002：负债合计</td>
							</tr>
							<tr>
								<td>S003：所有者权益合计</td><td>S004：损益合计</td>
							</tr>
							<tr>
								<td>S005：利润分配合计</td><td>S006：未分配利润合计</td>
							</tr>
							<tr>
								<td>TA01：年初未分配利润</td><td>TA02：以前年度损益</td>
							</tr>
							<tr>
								<td>TA03：未分配利润</td><td>TB01: 实收资本(股本)</td>
							</tr>
							<tr>
								<td>TB02: 其他权益工具</td><td>TB03: 优先股</td>
							</tr>
							<tr>
								<td>TB04: 永续债</td><td>TB05: (其中)其他</td>
							</tr>
							<tr>
								<td>TB06: 资本公积</td><td>TB07: 其他综合收益</td>
							</tr>
							<tr>
								<td>TB08: 专项储备</td><td>TB09: 盈余公积</td>
							</tr>
							<tr>
								<td>TB10: 一般风险准备</td><td>TB11: 库存股</td>
							</tr>
							<tr>
								<td>TB12: 其他</td><td>TB13: 小计</td>
							</tr>
							<tr>
								<td>TC01: 利润分配/提取法定盈余公积</td><td>TC02: 利润分配/提取任意盈余公积</td>
							</tr>
							<tr>
								<td>TC03: 利润分配/提取储备基金</td><td>TC04: 利润分配/提取企业发展基金</td>
							</tr>
							<tr>
								<td>TC05: 利润分配/转作股本的普通股股利</td><td>TC06: 利润分配/其他利润分配</td>
							</tr>
							<tr>
								<td>TC07: 利润分配/应付普通股利</td><td>TC08: 利润分配/提取一般风险准备</td>
							</tr>
							<tr>
								<td>TC09: 归属于母公司股东的净利润</td>
								<td>TA04: 少数股东损益</td>
							</tr>
							<tr>
								<td colspan="2"><b>试算平衡表校验公式：</b></td>
							</tr>
							<tr>
								<td colspan="2">资产S001=负债S002+所有者权益S003</td>
							</tr>
							<tr>
								<td colspan="2">年初未分配利润TA01+损益合计S004-利润分配S005+以前年度损益TA02-少数股东损益TA04=期末未分配利润TA03</td>
							</tr>
						</table>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="down_tb_Template">
						<i class="fa fa-download"></i><span>&nbsp;下载模板</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="import_tb_submit">
						<i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>	
	<div class="modal fade" id="init_tamplate_detail" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal" id="export_detail">
									<i class="si si-cloud-download" title="导出"></i>
								</button>
							</li>
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">详情</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: auto;">
					<div class="row">
						<table id="init_tamplate_table" class="table table-bordered table-striped table-hover"></table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- <div class="modal fade" id="modal_report" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false"
			style="width:300px; height:650px; background-color:rgba(55,55,55,0.5); left: 1150px; top:200px">
		<div class="modal-md">
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
						<h3 class="block-title">报表科目</h3>
					</div>
				</div>
				<div class="modal-body" style="height: 610px; overflow: auto; overflow:hidden">
					<div class="row">
						<table id="report_table" style="height:500px" class="table table-bordered table-striped table-hover"></table>
					</div>
				</div>
			</div>
		</div>
	</div>
 -->

<script src="${pageContext.request.contextPath}/cpBase/tbTemplate.js"></script>
<script src="${pageContext.request.contextPath}/cpBase/tbsubjectManage.js"></script>