<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/form.css">
	<style>
		#all_template_table tbody tr td:nth-child(2){
			min-width : 94px ;
		}
		.tab_temp > .block > .nav-tabs > li.active > a, 
		.tab_temp > .block > .nav-tabs > li.active > a:hover, 
		.tab_temp > .block > .nav-tabs > li.active > a:focus {
			color: black;
			background-color: white;
		}
		
	</style>
	<div class="content">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="comsubjectManageTopTab">
				<li class="active"><a  data-toggle="tabs" href="#tab_template_browse">报表模板一览</a></li>
				<li ><a data-toggle="tabs"  href="#tab_template" style="display:none">报表模板维护&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>
				<li><a data-toggle="tabs"  href="#tab_subjectcomser">报表科目维护</a></li>
				<li><a data-toggle="tabs"  href="#tab_subjecttypeser">报表分类维护</a></li>
			</ul>
			<div class="block-content tab-content" id="comsubjectManageTopTabContent">
				<div class="tab-pane active" id="tab_template_browse">
					<div>
						<div class="block block-themed block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="com_template_search" type="button">
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
							<div id="template_search_condition" class="block-search">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<label for="template_type">报表类型</label>
												<select class="js-select2 form-control" id="template_type"  style="width: 100%;">
													<option></option>
												</select>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<label for="template_active_flag">状态</label>
												<select class="js-select2 form-control" id="template_active_flag"  style="width: 100%;">
													<option value="1" selected>未作废</option>
													<option value="0">已作废</option>
												</select>
											</div>
										</div>
									</div>
									<!--
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<label for="tempid">模板</label>
												<input class="form-control" type="text" data-result="" data-content="" id="tempid" name="jnsubject" value="">

											</div>
										</div>
									</div> -->
								</div>
							</div>
						</div>
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="com_template_add" type="button">
											<i class="fa fa-plus" style="color: white;" title="新增模板"></i>
										</button>
									</li>
									<!-- <li>
										<button id="com_template_edit" type="button">
											<i class="fa fa-edit" style="color: white;">&nbsp;修改模板</i>
										</button>
									</li> -->
								</ul>
								<h3 class="block-title">模板一览</h3>
							</div>
							<div class="block-content">
								<table id="all_template_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_template">
					<div>
						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="comtemplate_refresh" type="button">
											<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
										</button>
									</li>
									<li>
										<button id="comtemplate_savesort" type="button">
											<i class="fa fa-list-ol" style="color: white;" title="保存排序"></i>
										</button>
									</li>
									<li>
										<button id="comComplete_export" type="button">
											<i class="si si-cloud-download" style="color: white;" title="导出"></i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">报表模板<span id="template_select"></span></h3>
							</div>
							<div class="tab_temp">
								<div class="block" style="margin: 10px 0px 0px 20px">
									<ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" id="report_type">
										<li class="active"><a href="#zc_report" data-toggle="tabs"  data-result="zc_report_table"><i class="fa fa-file-text-o"> 资产负债表</i></a></li>
										<li><a href="#lr_report" data-toggle="tabs"  data-result="lr_report_table"><i class="fa fa-file-text-o"> 利润表</i></a></li>
										<li><a href="#xj_report" data-toggle="tabs"  data-result="xj_report_table"><i class="fa fa-file-text-o"> 现金流量表</i></a></li>
										<li><a href="#qy_report" data-toggle="tabs"  data-result="qy_report_table"><i class="fa fa-file-text-o"> 所有者权益变动表(本期)</i></a></li>
										<li><a href="#qy1_report" data-toggle="tabs"  data-result="qy1_report_table"><i class="fa fa-file-text-o"> 所有者权益变动表(上期)</i></a></li>
									</ul>
									<div class="block-content tab-content" id="four_report">
										<div class="tab-pane fade in active" id="zc_report" data-result="1">
											<table id="zc_report_table" class="table table-bordered table-striped table-hover"></table>
										</div>
										<div class="tab-pane fade" id="lr_report" data-result="3">
											<table id="lr_report_table" class="table table-bordered table-striped table-hover"></table>	
										</div>
										<div class="tab-pane fade" id="xj_report" data-result="4">
											<table id="xj_report_table" class="table table-bordered table-striped table-hover"></table>
										</div>
										<div class="tab-pane fade"  data-toggle="tabs" id="qy_report" data-result="5">
											<table id="qy_report_table" class="table table-bordered table-striped table-hover"></table>
										</div>
										<div class="tab-pane fade"  data-toggle="tabs" id="qy1_report" data-result="6">
											<table id="qy1_report_table" class="table table-bordered table-striped table-hover"></table>
										</div>
									</div>	
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_subjectcomser">
					<div >
						<div class="block block-themed  block-opt-hidden">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="comsubject_search" type="button">
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
												<input class="form-control" type="text" id="comsubject_id">
												<label for="comsubject_id">报表科目编号</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="comsubject_namme">
												<label for="comsubject_namme">报表科目名称</label>
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
										<button id="comsubject_plus" type="button">
											<i class="fa fa-plus" style="color: white;" title="新增"></i>
										</button>
									</li>
									<li>
										<button id="comsubject_addtotemplate" type="button">
											<i class="fa fa-paper-plane" style="color: white;" title="添加到模板"></i>
										</button>
									</li>
									<li>
										<button id="comsubject_export" type="button">
											<i class="si si-cloud-download" style="color: white;" title="导出"></i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">报表科目</h3>
							</div>
							<div class="block-content">
								<table id="comsubject_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="tab_subjecttypeser">
					<div class="content">
						<div class="block block-bordered">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="subjecttype_refresh" type="button">
											<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
										</button>
									</li>
								</ul>
								<h3 class="block-title">报表科目分类一览</h3>
							</div>
							<div class="block-content">
								<table id="subjecttype_table" class="table table-bordered table-striped table-hover">
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_comsubform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="comsub_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_comsubtypeform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">详细信息</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="comsubtype_form"></form>
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
								<button class="btn btn-md btn-primary" type="button" id="comtemplate_save">
									<i class="fa fa-save"></i><span>&nbsp;保存</span>
								</button>
							</li>
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
					<form class="form-horizontal" id="comtemplate_form" style="border: 0px solid #f0f0f0"></form>
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
								<button class="btn btn-md btn-primary" type="button" id="comtemplatecoledit_save">
									<i class="fa fa-save"></i><span>&nbsp;保存</span>
								</button>
							</li>
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">修改模板报表项</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="comtemplatecolEdit_form"></form>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_comtemplatecoladdform" tabindex="-1" role="dialog"
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
						<h3 class="block-title">添加报表项</h3>
					</div>
				</div>
				<!--<div class="modal-body">
					<form class="form-horizontal" id="comtemplatecoladd_form"></form>
				</div>-->
				<div class="block-content">
					<table id="comsubjectadd_table" class="table table-bordered table-striped table-hover">
					</table>
				</div>
			</div>
		</div>
	</div>

    <div class="modal fade" id="modal-importCustomerReport" tabindex="-1"
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
                    <h3 class="block-title">添加导出模板</h3>
                </div>
            </div>
            <div class="modal-body" style="height: auto; overflow: visible;">
                <div class="row">
                    <div class="form-group">
                        <label class="col-xs-12" for="fileinput">选择导出模板</label>
                        <div class="col-xs-12">
                            <input id="fileinput" class="file" type="file" accept=".xls" multiple
                                   data-preview-file-type="any">
                            <div id="errorBlock" class="help-block"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-md btn-primary" type="button" id="import_submit">
                    <i class="fa fa-plus"></i><span>&nbsp;添加</span>
                </button>
                <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
                    <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
                </button>
            </div>
        </div>
    </div>
</div>
	
	<div class="modal fade" id="modal_seltemplate" tabindex="-1" role="dialog"
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
						<h3 class="block-title">模板选择</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<form class="form-horizontal" id="temp"></form>
					<div class="row">
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<select class="form-control" id="addToTemplate_ReportTypeSelect">
										<option></option>
									</select><label for="addToTemplate_ReportTypeSelect">所属报表</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="addtotemplate_ok">
						<i class="fa fa-check"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;取消</span>
					</button>
				</div>
			</div>
		</div>
	</div>	
	<div class="modal fade" id="modal_sortSubject" tabindex="-1" role="dialog"
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
						<h3 class="block-title">修改排序</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<div class="row">
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<input class="form-control" id="sort_sub_name" disabled/>
									<label for="sort_sub_name">科目</label>
								</div>
							</div>
							<div class="col-sm-12">
								<div class="form-material">
									<input class="form-control" id="sort_sub_no"/>
									<label for="sort_sub_no">序号</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="save_sortSub">
						<i class="fa fa-check"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;取消</span>
					</button>
				</div>
			</div>
		</div>
	</div>
<div class="modal fade" id="report_modal_setRelation" tabindex="-1" role="dialog"
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
					<h3 class="block-title">科目对照</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto; overflow: visible;">
                <form class="form-horizontal" id="report_wind_form"></form>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="report_setQYColumn_modal" tabindex="-1" role="dialog"
	 aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-md">
		<div class="modal-content" style="width: 128%">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button class="btn btn-md btn-primary" type="button" id="qyColumn_save">
								<i class="fa fa-save"></i><span>&nbsp;保存</span>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal" id="qyColumn_close">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">添加所有者权益显示列</h3>
				</div>
			</div>
			<div class="modal-body" style="height: 300px;">
				<form class="form-horizontal" id="report_qyColumn_form"></form>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="materialityModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button class="btn btn-md btn-primary" type="button" id="constitute_save">
								<i class="fa fa-save"></i><span>&nbsp;保存</span>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal" id="constitute_close">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h4 class="block-title">重要性水平设置</h4>
				</div>
			</div>
			<div class="modal-body" >
				<div class="form-material ">
					<input class="form-control" type="text" data-toggle="tooltip" data-placement="top" title="" id="constitute1" name="constitute1" placeholder="以收入为主要考量标准" required=true>
					<label for="constitute1">主营业务收入<span class="necessary">*</span></label>
				</div>
			</div>
			<div class="modal-body" >
				<div class="form-material ">
					<input class="form-control" type="text" data-toggle="tooltip" data-placement="top" title="" id="constitute2" name="constitute2" placeholder="以利润为主要考量标准" required="required">
					<label for="constitute2">税前利润<span class="necessary">*</span></label>
				</div>
			</div>
			<div class="modal-body" >
				<div class="form-material ">
					<input class="form-control" type="text" data-toggle="tooltip" data-placement="top" title="" id="constitute3" name="constitute3" placeholder="以资产为主要考量标准/投资公司" required="required">
					<label for="constitute3">总资产<span class="necessary">*</span></label>
				</div>
			</div>
			<div class="modal-body" >
				<div class="form-material ">
					<input class="form-control" type="text" data-toggle="tooltip" data-placement="top" title="" id="constitute4" name="constitute4" placeholder="以资产为主要考量标准/投资公司">
					<label for="constitute4">收入<span class="necessary">*</span></label>
				</div>
			</div>
			<div class="modal-body" >
				<div class="form-material ">
					<input class="form-control" type="text" data-toggle="tooltip" data-placement="top" title="" id="constitute5" name="constitute5" placeholder="非盈利组织" required="required">
					<label for="constitute5">净资产<span class="necessary">*</span></label>
				</div>
			</div>
			<div class="modal-body" >
				<div class="form-material ">
					<input class="form-control" type="text" data-toggle="tooltip" data-placement="top" title="" id="constitute6" name="constitute6" placeholder="非盈利组织" required="required">
					<label for="constitute6">成本<span class="necessary">*</span></label>
				</div>
			</div>
		</div>
	</div>
</div>


<script src="${pageContext.request.contextPath}/cpBase/comsubjectManage.js"></script>
