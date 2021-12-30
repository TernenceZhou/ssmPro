<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/form.css">
	<style>
		#review_template_table tbody tr td:nth-child(2){
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
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_projectReviewManage">
				<li class="active"><a  data-toggle="tabs" href="#tab_review_template_browse">审核模板一览</a></li>
				<!-- <li><a data-toggle="tabs"  href="#tab_review_template_protect">审核模板维护</a></li> -->
			</ul>
			<div class="block-content tab-content" id="tab_projectReviewManage_content">
				<div class="block block-themed block-opt-hidden">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button id="review_template_search" type="button">
									<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
								</button>
							</li>
							<li>
								<button type="button" data-toggle="block-option" data-action="content_toggle">
									<i class="si si-arrow-down"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">查询条件设定</h3>
					</div>
					<div id="review_template_search_condition" class="block-search">
						<div class="row">
							<div class="form-group"></div>
							<div class="form-group has-info">
								<div class="col-sm-4">
									<div class="form-material">
										<label for="search_condition_name">模板名称</label>
										<input class="form-control" type="text" id="search_condition_name" maxlength="50" autocomplete="off">
									</div>
								</div>
							</div>
							<div class="form-group has-info">
								<div class="col-sm-2">
									<div class="form-material">
										<label for="search_condition_yyyy">年份</label>
										<select class="js-select2 form-control" id="search_condition_yyyy"></select>
									</div>
								</div>
							</div>
							<div class="form-group has-info">
                                <div class="col-sm-3">
                                    <div class="form-material">
                                        <select class="js-select2 form-control" id="search_condition_templateType"
                                                style="width: 100%;">
                                            <option></option>
                                        </select> <label for="search_condition_templateType">模板类型</label>
                                    </div>
                                </div>
                            </div>
							<div class="form-group has-info">
								<div class="col-sm-2">
									<div class="form-material">
										<label for="search_condition_activeflg">状态</label>
										<select class="js-select2 form-control" id="search_condition_activeflg">
											<option value=""></option>
											<option value="1" selected>未作废</option>
											<option value="0">已作废</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button id="review_template_add" type="button">
									<i class="fa fa-plus" style="color: white;" title="新增模板">&nbsp;新增</i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">模板一览</h3>
					</div>
					<div class="block-content">
						<table id="review_template_table" class="table table-bordered table-striped table-hover"></table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_tempform_edit" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content" style="width: 600px;border:1px solid #D3D3D3;">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" class="btn btn-primary" id="btn_edit_save" title="保存"><i class="fa fa-floppy-o"></i></button>
							</li>
							<li>
								<button type="button" data-dismiss="modal"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">模板信息</h3>
						<input type="hidden" id="input_edit_temp_tr_num"/>
					</div>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group has-success">
							<div class="col-sm-9">
								<div class="form-material input-group">
									<input class="form-control" type="text" id="edit_temp_name" maxlength="50" autocomplete="off">
									<label for="edit_temp_name">模板名称</label>
									<span class="input-group-addon"><i class="fa fa-asterisk"></i></span>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="form-group has-success">
							<div class="col-sm-9">
								<div class="form-material input-group">
									<select class="form-control" id="edit_temp_yyyy"></select>
									<label for="edit_temp_yyyy">年份</label>
									<span class="input-group-addon"><i class="fa fa-asterisk"></i></span>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
                        <div class="form-group has-success">
                            <div class="col-sm-9">
                                <div class="form-material input-group">
                                    <select class="form-control" id="edit_temp_templateType" disabled></select>
                                    <label for="edit_temp_templateType">模板类型</label>
                                    <span class="input-group-addon"><i class="fa fa-asterisk"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_tempform_add" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content" style="width: 600px;border:1px solid #D3D3D3;">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" class="btn btn-primary" id="btn_add_save" title="保存"><i class="fa fa-floppy-o"></i></button>
							</li>
							<li>
								<button type="button" data-dismiss="modal"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">模板信息</h3>
					</div>
				</div>
				<div class="modal-body" style="height: 250px;">
					<div class="row">
						<div class="form-group has-success">
							<div class="col-sm-9">
								<div class="form-material input-group">
									<input class="form-control" type="text" id="add_temp_name" maxlength="50" autocomplete="off">
									<label for="add_temp_name">模板名称</label>
									<span class="input-group-addon"><i class="fa fa-asterisk"></i></span>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="form-group has-success">
							<div class="col-sm-9">
								<div class="form-material input-group">
									<select class="form-control" id="add_temp_yyyy"></select>
									<label for="add_temp_yyyy">年份</label>
									<span class="input-group-addon"><i class="fa fa-asterisk"></i></span>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
                        <div class="form-group has-success">
                            <div class="col-sm-9">
                                <div class="form-material input-group">
                                    <select class="form-control" id="add_templateType"></select>
                                    <label for="add_templateType">模板类型</label>
                                    <span class="input-group-addon"><i class="fa fa-asterisk"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
					<div class="row">
						<div class="form-group">
							<div class="col-sm-9">
								<div class="form-material">
									<input class="form-control" type="text" id="input_add_temp_init" autocomplete="off">
									<select class="form-control" id="select_add_temp_init" style="display: none;position: absolute;" size="3" height="60px"></select>
									<label for="add_temp_init">
										<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm">
											<input type="checkbox" id="initTemplateCheck" value="1"><span></span>初始化模板
										</label>
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_dg_review_check_item" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content" style="width: 600px;border:1px solid #D3D3D3;">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" class="btn btn-primary" id="btn_dg_review_check_item_add" title="新增"><i class="fa fa-plus"></i></button>
							</li>
							<li>
								<button type="button" class="btn btn-primary" id="btn_dg_review_check_item_del" title="删除"><i class="fa fa-minus"></i></button>
							</li>
							<li>
								<button type="button" class="btn btn-primary" id="btn_dg_review_check_item_forward" title="返回至设置审批项内容"><i class="fa fa-share"></i></button>
							</li>
							<!-- <li>
								<button type="button" class="btn btn-primary" id="btn_dg_review_check_item_check" title="设置审批项内容"><i class="fa fa-check"></i></button>
							</li> -->
							<li>
								<button type="button" data-dismiss="modal"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">模板审批项</h3>
						<input type="hidden" id="dg_review_check_item_tr"/>
						<input type="hidden" id="dg_review_check_item_reviewId"/>
						<input type="hidden" id="dg_review_check_item_reviewName"/>
					</div>
				</div>
				<div class="modal-body" style="min-height: 300px;max-height: 580px;padding-bottom: 5px;" id="div_body_dg_item">
					
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_dg_review_check" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content" style="width: 600px;border:1px solid #D3D3D3;">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" class="btn btn-primary" id="btn_dg_review_check_add" title="新增标题项"><i class="fa fa-plus"></i></button>
							</li>
							<li>
								<button type="button" class="btn btn-primary" id="btn_dg_review_check_del" title="删除标题项"><i class="fa fa-minus"></i></button>
							</li>
							<li>
								<button type="button" class="btn btn-primary" id="btn_dg_review_check_back" title="返回至设置审批项"><i class="fa fa-reply"></i></button>
							</li>
							<li>
								<button type="button" class="btn btn-primary" id="btn_dg_review_check_save" title="保存"><i class="fa fa-floppy-o"></i></button>
							</li>
							<li>
								<button type="button" class="btn btn-primary" id="btn_dg_review_check_close" title="关闭"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">模板配置（<span id="temp_name_dg" style="color: rgb(100, 100, 100)"></span>）</h3>
						<input type="hidden" id="dg_review_check_tr"/>
						<input type="hidden" id="dg_review_check_reviewId"/>
					</div>
				</div>
				<div class="modal-body" style="min-height: 300px;max-height: 580px;padding-top: 5px;padding-bottom: 5px;" id="div_body_dg">
					
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_external_report_approval" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content" style="width: 600px;border:1px solid #D3D3D3;">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" class="btn btn-primary" id="btn_external_report_approval_add" title="新增审批项"><i class="fa fa-plus"></i></button>
							</li>
							<li>
								<button type="button" class="btn btn-primary" id="btn_external_report_approval_save" title="保存"><i class="fa fa-floppy-o"></i></button>
							</li>
							<li>
								<button type="button" data-dismiss="modal"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">对外报告审批单（<span id="temp_name_report" style="color: rgb(100, 100, 100)"></span>）</h3>
						<input type="hidden" id="input_external_report_approval_tr"/>
					</div>
				</div>
				<div class="modal-body">
					
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_archives_filed_approval" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content" style="width: 600px;border:1px solid #D3D3D3;">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button type="button" class="btn btn-primary" id="btn_archives_filed_approval_add" title="新增审批项"><i class="fa fa-plus"></i></button>
							</li>
							<li>
								<button type="button" class="btn btn-primary" id="btn_archives_filed_approval_save" title="保存"><i class="fa fa-floppy-o"></i></button>
							</li>
							<li>
								<button type="button" data-dismiss="modal"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">档案归档审批单（<span id="temp_name_archives" style="color: rgb(100, 100, 100)"></span>）</h3>
						<input type="hidden" id="input_archives_filed_approval_tr"/>
					</div>
				</div>
				<div class="modal-body">
					
				</div>
			</div>
		</div>
	</div>
<script src="${pageContext.request.contextPath}/cpBase/projectReviewManage.js"></script>