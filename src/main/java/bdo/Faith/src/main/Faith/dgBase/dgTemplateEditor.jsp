<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="spreadjs culture" content="zh-cn"/>
	<title></title>
	<%--<%@ include file="/WEB-INF/Views/Sys_INCLUDE/includeForUI.jsp" %>
	<%@ include file="/cpShare/partnerModal.jsp" %>--%>
	<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/side.css">
	<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/form.css">
	<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/dg.css">
	<link media="all" rel="stylesheet" type="text/css"  href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.Release.12.1.0/css/gc.spread.sheets.excel2013white.12.1.0.css">
	<%@ include file="/dgCenter/common/spreadJS.css.jsp" %>
	<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/dgBase/css/dg.base.css">
	<%@ include file="/WEB-INF/Views/Sys_INCLUDE/includeForUI.jsp" %>
	<%@ include file="/cpShare/partnerModal.jsp" %>
	<script src="${pageContext.request.contextPath}/bdolx/main/side.js"></script>
	<script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
</head>
<body id="dgTemplateEditorBody">
<div id="dgTemplateEditorToolbar" class="bdo-dgbase-tool-bar bdo-dgbase-tool-bar-wrap">
	<div class="block">
		<div class="block-header">
			<div class="block-options block-options-left">
				<button class="btn btn-xs btn-primary bdo-dgbase-tool-bar-btn add-tpl" type="button" data-toggle="tooltip"
						title="新增模板" data-original-title="新增模板"
						data-dgbase-btn-click="addDgQueryTemplateBtn"
				>
					<i class="fa fa-plus"></i>
				</button>
				<%--<button class="btn btn-xs btn-primary" type="button" data-toggle="tooltip" title="" data-original-title="Redo"><i class="fa fa-repeat"></i></button>
				<button class="btn btn-xs btn-info" type="button" data-toggle="tooltip" title="" data-original-title="Edit"><i class="fa fa-pencil"></i></button>
				<button class="btn btn-xs btn-success" type="button" data-toggle="tooltip" title="" data-original-title="Accept"><i class="fa fa-check"></i></button>
				<button class="btn btn-xs btn-danger" type="button" data-toggle="tooltip" title="" data-original-title="Delete"><i class="fa fa-times"></i></button>--%>
			</div>
		</div>
	</div>
</div>
<div id="spreadContainerRoot">
	<div class="" id="spreadContainer">
		<div class="loading-placeholder background-mask-layer"></div>
		<span class="loading-placeholder loading-pic"></span>
		<div class="header">
			<div data-include="ribbon">
			</div>
			<div data-include="formulaBar">
			</div>
		</div>
		<div class="content">
			<div class="vertical-splitter ui-draggable hidden" id="verticalSplitter"></div>
			<div class="fill-spread-content" data-include="spreadWrapper"></div>
		</div>
		<div class="footer">
			<div data-include="statusBar">
			</div>
		</div>
		<div class="file-menu hidden">
			<div data-include="fileMenu"></div>
		</div>
		<div class="slicer-contextmenu-width hidden">
			<span id="name-container"></span>
		</div>
		<div class="ui-button-text-icon-primary"
			 style="position: absolute; left: -1000px; top: -1000px; visibility: hidden">
			<span id="measureWidth" class="ui-button-text"></span>
		</div>
		<div class="hidden">
			<input type="file" id="fileSelector" name="files[]"/>
		</div>
	</div>
</div>
<div id="dgTemplateEditorSubPageSide">
	<div id="addDgQueryTemplateSubPage" class="bdo-side" tabindex="-0" style="width:600px;top: 0px;">
		<div class="bdo-side-block block block-themed">
			<div class="block-header bg-info">
				<ul class="block-options">
					<li>
						<button data-close="true" type="button">
							<i class="si si-close"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">添加查询模板</h3>
			</div>
			<div class="bdo-side-content dg-template-info">
				<ul data-toggle="tabs" class="nav nav-tabs nav-tabs-alt dg-template-info-nav">
					<li class="active"><a href="#dgTemplateBaseInfoTab"><h3 class="block-title">基本信息</h3></a></li>
					<li><a href="#dgTemplateColumnInfoTab"><h3 class="block-title">列配置</h3></a></li>
					<li><a href="#dgTemplateFilterInfoTab"><h3 class="block-title">筛选配置</h3></a></li>
				</ul>
				<div data-toggle="slimscroll" data-always-visible="false"
					 data-rail-visible="true" data-rail-color="#777"
					 data-rail-opacity=".0" data-height="100%">
					<div class="tab tab-content dg-template-info-tab-content">
						<div class="tab-pane active" id="dgTemplateBaseInfoTab">
							<div class="block-content">
								<form id="dgQueryTemplateBaseInfoForm" class="form-horizontal pull-t push-5-t bdo-dgbase-newquery-form">
									<div class="form-group">
										<div class="col-sm-1">
											<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button"
													data-dgbase-btn-click="onDgQueryTemplateBaseInfoSubmit"
											>
												提交
											</button>
										</div>
									</div>
									<div class="form-group has-success">
										<div class="col-sm-12">
											<div class="form-material">
												<input class="form-control" type="text" id="dgQueryTemplateName"
													   name="datas.dgQueryTemplateName" placeholder="">
												<label for="dgQueryTemplateName">查询名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-success">
										<div class="col-xs-12">
											<div class="form-material">
											<textarea class="form-control" id="dgQueryTemplateSql"
													  name="datas.dgQueryTemplateSql" rows="8"
													  placeholder="sql 语句"></textarea>
												<label for="dgQueryTemplateSql">查询语句</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-1">
											<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button"
													data-dgbase-btn-click="onDgQueryTemplateSQLResolveBtnClick"
											>
												解析SQL
											</button>
										</div>
									</div>
									<div id="sqlParamsWrap"></div>
									<div class="form-group">
										<div class="col-sm-1">
											<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button"
													data-dgbase-btn-click="onDgQueryTemplateBaseInfoSubmit"
											>
												提交
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div class="tab-pane" id="dgTemplateColumnInfoTab">
							<div class="block-content">
								<form class="form-horizontal pull-t push-5-t" id="dgTemplateSqlResultFieldsForm">
									<div class="form-group">
										<div class="col-sm-12">
											<button class="btn btn-sm btn-primary push-5-r" type="button">提交</button>
											<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
												辅助列
											</button>
											<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button">
												功能列
											</button>
										</div>
									</div>
									<div class="form-group has-success">
										<div class="col-sm-4">
											<div class="form-material">
												<label>SQL列名</label>
											</div>
										</div>
										<div class="col-sm-5">
											<div class="form-material">
												<label>显示列名</label>
											</div>
										</div>
									</div>
									<div id="sqlResultFieldsWrap"></div>
									<div class="form-group">
										<div class="col-sm-1">
											<button class="btn btn-sm btn-primary" type="button">提交</button>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div class="tab-pane" id="dgTemplateFilterInfoTab">
							<div class="block-content">
								<form class="form-horizontal pull-t push-5-t" id="dgTemplateFiltersForm">
									<div class="form-group">
										<div class="col-sm-12">
											<button class="btn btn-sm btn-primary push-5-r" type="button">提交</button>
											<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
												添加自定义字段
											</button>
										</div>
									</div>
									<div class="form-group has-success">
										<div class="col-sm-3">
											<div class="form-material">
												<label>字段</label>
											</div>
										</div>
										<div class="col-sm-4">
											<div class="form-material">
												<label>LABEL</label>
											</div>
										</div>
										<div class="col-sm-2">
											<div class="form-material">
												<label>类型</label>
											</div>
										</div>
										<div class="col-sm-1">
											<div class="form-material">
												<label>启用</label>
											</div>
										</div>
									</div>
									<div id="dgTemplateFiltersWrap"></div>
									<div class="form-group">
										<div class="col-sm-1">
											<button class="btn btn-sm btn-primary" type="button">提交</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="addDgQueryTemplateResultConfigSubPage" class="bdo-side" tabindex="-0" style="width:600px;top: 0px;">
		<div class="bdo-side-block block block-themed">
			<div class="block-header bg-info">
				<ul class="block-options">
					<li>
						<button data-close="true" type="button">
							<i class="si si-close"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">列配置</h3>
			</div>
			<div class="bdo-side-content dg-template-info">
				<%--<ul data-toggle="tabs" class="nav nav-tabs nav-tabs-alt dg-template-info-nav">
					<li class="active"><a href="#dgTemplateBaseInfoTab"><h3 class="block-title">基本信息</h3></a></li>
					<li><a href="#dgTemplateColumnInfoTab"><h3 class="block-title">列配置</h3></a></li>
					<li><a href="#dgTemplateFilterInfoTab"><h3 class="block-title">筛选配置</h3></a></li>
				</ul>--%>
				<div data-toggle="slimscroll" data-always-visible="false"
					 data-rail-visible="true" data-rail-color="#777"
					 data-rail-opacity=".0" data-height="100%">
					<div class="block-content">
						<form id="dgQueryTemplateResultFieldForm" class="form-horizontal pull-t push-5-t bdo-dgbase-newquery-form ">
							<div class="form-group">
								<div class="col-sm-12">
									<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-sm-4">
									<div class="form-material">
										<input class="form-control" type="text" id="sqlResultField.name"
											   name="sqlResultField.name" placeholder="">
										<label for="sqlResultField.name">SQL列名</label>
									</div>
								</div>
								<div class="col-sm-5">
									<div class="form-material">
										<input class="form-control" type="text" id="sqlResultField.label"
											   name="sqlResultField.label" placeholder="">
										<label for="sqlResultField.label">显示列名</label>
									</div>
								</div>
								<div class="col-sm-3">
									<label class="css-input css-checkbox css-checkbox-primary">
										<input type="checkbox" checked="1" unchecked="0" id="sqlResultField.hidden"
											   name="sqlResultField.hidden"><span></span> 隐藏
									</label>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" type="text" id="sqlResultField.data"
											   name="sqlResultField.name" placeholder="">
										<label for="sqlResultField.name">数据类型</label>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" type="text" id="sqlResultField.formatoer"
											   name="sqlResultField.formatoer" placeholder="">
										<label for="sqlResultField.formatoer">格式化器</label>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" type="text" id="sqlResultField.colWidth"
											   name="sqlResultField.colWidth" placeholder="">
										<label for="sqlResultField.colWidth">列宽</label>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" type="text" id="sqlResultField.colSort"
											   name="sqlResultField.colSort" placeholder="">
										<label for="sqlResultField.colSort">列序</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="addDgQueryTemplateFilterConfigSubPage" class="bdo-side" tabindex="-0" style="width:600px;top: 0px;">
		<div class="bdo-side-block block block-themed">
			<div class="block-header bg-info">
				<ul class="block-options">
					<li>
						<button data-close="true" type="button">
							<i class="si si-close"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">筛选配置</h3>
			</div>
			<div class="bdo-side-content dg-template-info">
				<%--<ul data-toggle="tabs" class="nav nav-tabs nav-tabs-alt dg-template-info-nav">
					<li class="active"><a href="#dgTemplateBaseInfoTab"><h3 class="block-title">基本信息</h3></a></li>
					<li><a href="#dgTemplateColumnInfoTab"><h3 class="block-title">列配置</h3></a></li>
					<li><a href="#dgTemplateFilterInfoTab"><h3 class="block-title">筛选配置</h3></a></li>
				</ul>--%>
				<div data-toggle="slimscroll" data-always-visible="false"
					 data-rail-visible="true" data-rail-color="#777"
					 data-rail-opacity=".0" data-height="100%">
					<div class="block-content">
						<form id="dgQueryTemplateFieldConfigForm" class="form-horizontal pull-t push-5-t bdo-dgbase-newquery-form ">
							<div class="form-group">
								<div class="col-sm-12">
									<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" type="text" id="queryFilter.fieldName"
											   name="queryFilter.fieldName" placeholder="">
										<label for="queryFilter.fieldName" >字段</label>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-material">
										<input class="form-control" type="text" id="queryFilter.fieldLabel"
											   name="queryFilter.fieldLabel" placeholder="">
										<label for="queryFilter.fieldLabel">LABEL</label>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" type="text" id="queryFilter.fieldType"
											   name="queryFilter.fieldType" placeholder="">
										<label for="queryFilter.fieldType">类型</label>
									</div>
								</div>
								<div class="col-sm-3">
									<label class="css-input css-checkbox css-checkbox-primary">
										<input type="checkbox" checked="1" unchecked="0" id="queryFilters.hidden"
											   name="queryFilters.hidden"><span></span> 启用
									</label>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-sm-3">
									<div class="form-material">
										<select class="form-control" id="queryFilter.filterElType" name="queryFilter.filterElType" size="1">
											<option>...</option>
											<option value="System">预定义控件</option>
											<option value="Text">文本框</option>
											<option value="Radio">单选框</option>
											<option value="Checkbox">复选框</option>
											<option value="Select">下拉框</option>
											<option value="Date">日期</option>
											<option value="Customize">自定义</option>
										</select>
										<label for="queryFilter.filterElType">控件类型</label>
									</div>
								</div>
								<div class="col-sm-3">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button"
											data-dgbase-btn-click="onDgQueryTemplateToEditCompSettingBtnClick">
										设置
									</button>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="addDgQueryTemplateCompSystemSubPage" class="bdo-side" data-bdo-side="comp" tabindex="-0" style="width:600px;top: 0px;">
		<div class="bdo-side-block block block-themed">
			<div class="block-header bg-info">
				<ul class="block-options">
					<li>
						<button data-close="true" type="button">
							<i class="si si-close"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">控件配置</h3>
			</div>
			<div class="bdo-side-content dg-template-info">
				<%--<ul data-toggle="tabs" class="nav nav-tabs nav-tabs-alt dg-template-info-nav">
					<li class="active"><a href="#dgTemplateBaseInfoTab"><h3 class="block-title">基本信息</h3></a></li>
					<li><a href="#dgTemplateColumnInfoTab"><h3 class="block-title">列配置</h3></a></li>
					<li><a href="#dgTemplateFilterInfoTab"><h3 class="block-title">筛选配置</h3></a></li>
				</ul>--%>
				<div data-toggle="slimscroll" data-always-visible="false"
					 data-rail-visible="true" data-rail-color="#777"
					 data-rail-opacity=".0" data-height="100%">
					<div class="block-content">
						<form id="dgQueryTemplateCompSystemForm" class="form-horizontal pull-t push-5-t bdo-dgbase-newquery-form ">
							<div class="form-group">
								<div class="col-sm-12">
									<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-sm-3">
									<div class="form-material">
										<select class="form-control" id="comp.system" name="comp.system" size="1">
											<option>...</option>
											<option value="1">可选客户</option>
											<option value="2">可选项目</option>
											<option value="3">财务科目</option>
											<option value="4">账套年份</option>
											<option value="5">BOOLEAN</option>
											<option value="8">...</option>
										</select>
										<label for="queryFilter.filterElType">预定义控件</label>
									</div>
								</div>
								<div class="col-sm-3">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button" data-dgbase-btn-click="">
										设置
									</button>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="addDgQueryTemplateCompTextSubPage" class="bdo-side"  data-bdo-side="comp"tabindex="-0" style="width:600px;top: 0px;">
		<div class="bdo-side-block block block-themed">
			<div class="block-header bg-info">
				<ul class="block-options">
					<li>
						<button data-close="true" type="button">
							<i class="si si-close"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">控件配置</h3>
			</div>
			<div class="bdo-side-content dg-template-info">
				<%--<ul data-toggle="tabs" class="nav nav-tabs nav-tabs-alt dg-template-info-nav">
					<li class="active"><a href="#dgTemplateBaseInfoTab"><h3 class="block-title">基本信息</h3></a></li>
					<li><a href="#dgTemplateColumnInfoTab"><h3 class="block-title">列配置</h3></a></li>
					<li><a href="#dgTemplateFilterInfoTab"><h3 class="block-title">筛选配置</h3></a></li>
				</ul>--%>
				<div data-toggle="slimscroll" data-always-visible="false"
					 data-rail-visible="true" data-rail-color="#777"
					 data-rail-opacity=".0" data-height="100%">
					<div class="block-content">
						<form id="dgQueryTemplateCompTextForm" class="form-horizontal pull-t push-5-t bdo-dgbase-newquery-form ">
							<div class="form-group">
								<div class="col-sm-12">
									<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" id="comp.textDefaultValue" name="comp.textDefaultValue" />
										<label for="comp.textDefaultValue">默认值</label>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" id="comp.textMin" name="comp.textMin" />
										<label for="comp.textMin">最小值</label>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" id="comp.textMax" name="comp.textMax" />
										<label for="comp.textMax">最大值</label>
									</div>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" id="comp.textLength" name="comp.textLength" />
										<label for="comp.textLength">长度</label>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" id="comp.textRegexp" name="comp.textRegexp" />
										<label for="comp.textRegexp">校验正则</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="addDgQueryTemplateCompRadioSubPage" class="bdo-side"  data-bdo-side="comp"tabindex="-0" style="width:600px;top: 0px;">
		<div class="bdo-side-block block block-themed">
			<div class="block-header bg-info">
				<ul class="block-options">
					<li>
						<button data-close="true" type="button">
							<i class="si si-close"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">控件配置</h3>
			</div>
			<div class="bdo-side-content dg-template-info">
				<%--<ul data-toggle="tabs" class="nav nav-tabs nav-tabs-alt dg-template-info-nav">
					<li class="active"><a href="#dgTemplateBaseInfoTab"><h3 class="block-title">基本信息</h3></a></li>
					<li><a href="#dgTemplateColumnInfoTab"><h3 class="block-title">列配置</h3></a></li>
					<li><a href="#dgTemplateFilterInfoTab"><h3 class="block-title">筛选配置</h3></a></li>
				</ul>--%>
				<div data-toggle="slimscroll" data-always-visible="false"
					 data-rail-visible="true" data-rail-color="#777"
					 data-rail-opacity=".0" data-height="100%">
					<div class="block-content">
						<form id="dgQueryTemplateCompRadioForm" class="form-horizontal pull-t push-5-t bdo-dgbase-newquery-form ">
							<div class="form-group">
								<div class="col-sm-12">
									<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-sm-3">
									<div class="form-material">
										<label >布局</label>
									</div>
									<label class="css-input css-radio css-radio-sm css-radio-primary push-10-r">
										<input type="radio" name="comp.radioLayout" checked=""><span></span> 横向
									</label>
									<label class="css-input css-radio css-radio-sm css-radio-primary">
										<input type="radio" name="comp.radioLayout"><span></span> 竖向
									</label>
								</div>
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" id="comp.radioDataSource" name="comp.radioDataSource" />
										<label for="comp.radioDataSource">数据源</label>
									</div>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-xs-12">
									<div class="form-material">
										<textarea class="form-control" id="comp.radioData" name="comp.radioData" rows="8" placeholder='JSON格式：[{"value":1,"label":"label"}]'></textarea>
										<label for="comp.radioData">自定义数据源</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="addDgQueryTemplateCompCheckboxSubPage" class="bdo-side"  data-bdo-side="comp"tabindex="-0" style="width:600px;top: 0px;">
		<div class="bdo-side-block block block-themed">
			<div class="block-header bg-info">
				<ul class="block-options">
					<li>
						<button data-close="true" type="button">
							<i class="si si-close"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">控件配置</h3>
			</div>
			<div class="bdo-side-content dg-template-info">
				<%--<ul data-toggle="tabs" class="nav nav-tabs nav-tabs-alt dg-template-info-nav">
					<li class="active"><a href="#dgTemplateBaseInfoTab"><h3 class="block-title">基本信息</h3></a></li>
					<li><a href="#dgTemplateColumnInfoTab"><h3 class="block-title">列配置</h3></a></li>
					<li><a href="#dgTemplateFilterInfoTab"><h3 class="block-title">筛选配置</h3></a></li>
				</ul>--%>
				<div data-toggle="slimscroll" data-always-visible="false"
					 data-rail-visible="true" data-rail-color="#777"
					 data-rail-opacity=".0" data-height="100%">
					<div class="block-content">
						<form id="dgQueryTemplateCompCheckboxForm" class="form-horizontal pull-t push-5-t bdo-dgbase-newquery-form ">
							<div class="form-group">
								<div class="col-sm-12">
									<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-sm-3">
									<div class="form-material">
										<label >布局</label>
									</div>
									<label class="css-input css-radio css-radio-sm css-radio-primary push-10-r">
										<input type="radio" name="comp.checkboxLayout" checked=""><span></span> 横向
									</label>
									<label class="css-input css-radio css-radio-sm css-radio-primary">
										<input type="radio" name="comp.checkboxLayout"><span></span> 竖向
									</label>
								</div>
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" id="comp.checkboxDataSource" name="comp.checkboxDataSource" />
										<label for="comp.checkboxDataSource">数据源</label>
									</div>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-xs-12">
									<div class="form-material">
										<textarea class="form-control" id="comp.checkboxData" name="comp.checkboxData" rows="8" placeholder='JSON格式：[{"value":1,"label":"label"}]'></textarea>
										<label for="comp.radioData">自定义数据源</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="addDgQueryTemplateCompSelectSubPage" class="bdo-side"  data-bdo-side="comp"tabindex="-0" style="width:600px;top: 0px;">
		<div class="bdo-side-block block block-themed">
			<div class="block-header bg-info">
				<ul class="block-options">
					<li>
						<button data-close="true" type="button">
							<i class="si si-close"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">控件配置</h3>
			</div>
			<div class="bdo-side-content dg-template-info">
				<%--<ul data-toggle="tabs" class="nav nav-tabs nav-tabs-alt dg-template-info-nav">
					<li class="active"><a href="#dgTemplateBaseInfoTab"><h3 class="block-title">基本信息</h3></a></li>
					<li><a href="#dgTemplateColumnInfoTab"><h3 class="block-title">列配置</h3></a></li>
					<li><a href="#dgTemplateFilterInfoTab"><h3 class="block-title">筛选配置</h3></a></li>
				</ul>--%>
				<div data-toggle="slimscroll" data-always-visible="false"
					 data-rail-visible="true" data-rail-color="#777"
					 data-rail-opacity=".0" data-height="100%">
					<div class="block-content">
						<form id="dgQueryTemplateCompSelectForm" class="form-horizontal pull-t push-5-t bdo-dgbase-newquery-form ">
							<div class="form-group">
								<div class="col-sm-12">
									<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-sm-3">
									<div class="form-material">
										<input class="form-control" id="comp.selecteDataSource" name="comp.selecteDataSource" />
										<label for="comp.selecteDataSource">数据源</label>
									</div>
								</div>
							</div>
							<div class="form-group has-success">
								<div class="col-xs-12">
									<div class="form-material">
										<textarea class="form-control" id="comp.selecteData" name="comp.selecteData" rows="8" placeholder='JSON格式：[{"value":1,"label":"label"}]'></textarea>
										<label for="comp.radioData">自定义数据源</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="addDgQueryTemplateCompDateSubPage" class="bdo-side"  data-bdo-side="comp"tabindex="-0" style="width:600px;top: 0px;">
		<div class="bdo-side-block block block-themed">
			<div class="block-header bg-info">
				<ul class="block-options">
					<li>
						<button data-close="true" type="button">
							<i class="si si-close"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">控件配置</h3>
			</div>
			<div class="bdo-side-content dg-template-info">
				<%--<ul data-toggle="tabs" class="nav nav-tabs nav-tabs-alt dg-template-info-nav">
					<li class="active"><a href="#dgTemplateBaseInfoTab"><h3 class="block-title">基本信息</h3></a></li>
					<li><a href="#dgTemplateColumnInfoTab"><h3 class="block-title">列配置</h3></a></li>
					<li><a href="#dgTemplateFilterInfoTab"><h3 class="block-title">筛选配置</h3></a></li>
				</ul>--%>
				<div data-toggle="slimscroll" data-always-visible="false"
					 data-rail-visible="true" data-rail-color="#777"
					 data-rail-opacity=".0" data-height="100%">
					<div class="block-content">
						<form id="dgQueryTemplateCompDateForm" class="form-horizontal pull-t push-5-t bdo-dgbase-newquery-form ">
							<div class="form-group">
								<div class="col-sm-12">
									<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>

							<div class="form-group">
								<div class="col-sm-1">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="addDgQueryTemplateCompCustomizeSubPage" class="bdo-side"  data-bdo-side="comp"tabindex="-0" style="width:600px;top: 0px;">
		<div class="bdo-side-block block block-themed">
			<div class="block-header bg-info">
				<ul class="block-options">
					<li>
						<button data-close="true" type="button">
							<i class="si si-close"></i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">控件配置</h3>
			</div>
			<div class="bdo-side-content dg-template-info">
				<%--<ul data-toggle="tabs" class="nav nav-tabs nav-tabs-alt dg-template-info-nav">
					<li class="active"><a href="#dgTemplateBaseInfoTab"><h3 class="block-title">基本信息</h3></a></li>
					<li><a href="#dgTemplateColumnInfoTab"><h3 class="block-title">列配置</h3></a></li>
					<li><a href="#dgTemplateFilterInfoTab"><h3 class="block-title">筛选配置</h3></a></li>
				</ul>--%>
				<div data-toggle="slimscroll" data-always-visible="false"
					 data-rail-visible="true" data-rail-color="#777"
					 data-rail-opacity=".0" data-height="100%">
					<div class="block-content">
						<form id="dgQueryTemplateCompCustomizeForm" class="form-horizontal pull-t push-5-t bdo-dgbase-newquery-form ">
							<div class="form-group">
								<div class="col-sm-12">
									<button class="btn btn-sm btn-primary push-5-r bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button">
										保存
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/dgCenter/common/spreadJS.js.jsp" %>
<script src="${pageContext.request.contextPath}/dgBase/js/dgTemplateEditorTemplate.js" language="JavaScript" charset="UTF-8" type="application/javascript"></script>
<script src="${pageContext.request.contextPath}/dgBase/js/dgTemplateEditor.js" language="JavaScript" charset="UTF-8" type="application/javascript"></script>
</body>
</html>