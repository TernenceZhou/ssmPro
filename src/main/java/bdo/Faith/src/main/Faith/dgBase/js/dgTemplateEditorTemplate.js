(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], function($) {
			return factory($, window, document);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function(root, $) {
			if (!root) {
				root = window;
			}
			if (!$) {
				throw Error('jQuery undefined');
			}
			return factory($, root, root.document);
		};
	}
	else {
		factory(jQuery, window, document);
	}
}(function($, root, doc) {

	let dgTemplateEditorTemplates = function() {};

	let DgTemplateEditorTemplates = typeof window === 'object' && window.window === window
		? new dgTemplateEditorTemplates() : typeof self === 'object' && self.self === self
			? new dgTemplateEditorTemplates() : typeof DgTemplateEditorTemplates === 'object' && DgTemplateEditorTemplates.DgTemplateEditorTemplates === DgTemplateEditorTemplates
				? DgTemplateEditorTemplates
				: this;

	let sqlParamsTemplate = `
		<div id="sqlParamsWrap" class='bdo-dgbase-form-nolabel'>
			<div class="form-group has-success push-20">
				<div class="col-xs-12">
					<div class="form-material">
						<label >查询语句参数：</label>
					</div>
				</div>
			</div>
			<div class="form-group has-success">
				<div class="col-xs-2">
					<div class="form-material">
						<label >参数名</label>
					</div>
				</div>
				<div class="col-xs-5">
					<div class="form-material">
						<label >LABEL</label>
					</div>
				</div>
				<div class="col-xs-5">
					<div class="form-material">
						<label >预览值</label>
					</div>
				</div>
			</div>
			<div id="sqlParams">
			{{each sqlParams sqlParamInfo i}}
				<div class="form-group">
					<div class="col-xs-2">
						<div class="form-material">
							<input class="form-control" type="text"
								readonly
								placeholder=""
								data-param-name="{{sqlParamInfo.paramName}}"
								value="{{sqlParamInfo.paramName}}"
								name="sqlParams.paramName" >
						</div>
					</div>
					<div class="col-xs-5">
						<div class="form-material">
							<input class="form-control" type="text"
								data-param-name="{{sqlParamInfo.paramName}}"
								value="{{sqlParamInfo.paramLabel}}"
								name="sqlParams.paramLabel" placeholder="" >
						</div>
					</div>
					<div class="col-xs-5">
						<div class="form-material">
							<input class="form-control" type="text"
								value="{{sqlParamInfo.paramPvValue}}"
								data-param-name="{{sqlParamInfo.paramName}}"
								name="sqlParams.paramPvValue" placeholder="">
						</div>
					</div>
				</div>
				{{/each}}
			</div>
		</div>
	`;
	let sqlParamsTemplateObject = template('./dgBaseSqlParamsTemplate', sqlParamsTemplate);

	let sqlResultFieldsTemplate = `
	<div id="sqlResultFieldsWrap" class='bdo-dgbase-form-nolabel'>
	{{each sqlResultFields sqlResultFieldInfo i}}
		<div class="form-group has-success">
			<div class="col-sm-4">
				<div class="form-material">
					<input class="form-control" type="text" readonly
							value="{{sqlResultFieldInfo.name}}"
						   name="sqlResultFields.name" placeholder="">
				</div>
			</div>
			<div class="col-sm-5">
				<div class="form-material">
					<input class="form-control" type="text" readonly
						   name="sqlResultFields.label" placeholder="">
				</div>
			</div>
			<div class="col-sm-3">
				<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button"
				data-dgbase-btn-click="onDgQueryTemplateToEditFieldBtnClick"
				>设置</button>
			</div>
		</div>
	{{/each}}
	</div>
	`;
	let sqlResultFieldsTemplateObject = template('./dgBaseSqlResultFieldsTemplate', sqlResultFieldsTemplate);

	let dgTemplateFiltersTemplate = `
	<div id="dgTemplateFiltersWrap" class='bdo-dgbase-form-nolabel'>
	{{each queryFilters queryFilterInfo i}}
		<div class="form-group has-success">
			<div class="col-sm-3">
				<div class="form-material">
					<input class="form-control" type="text" readonly
							value="{{queryFilterInfo.fieldName}}"
						   name="queryFilters.fieldName" placeholder="">
				</div>
			</div>
			<div class="col-sm-4">
				<div class="form-material">
					<input class="form-control" type="text" readonly
						value="{{queryFilterInfo.fieldLabel}}"
						   name="queryFilters.fieldLabel" placeholder="">
				</div>
			</div>
			<div class="col-sm-2">
				<div class="form-material">
					<input class="form-control" type="text" readonly
						value="{{queryFilterInfo.fieldType}}"
						   name="queryFilters.fieldType" placeholder="">
				</div>
			</div>
			<div class="col-sm-1">
				<label class="css-input switch switch-sm switch-primary">
						<input type="checkbox" name="queryFilters.hidden" readonly
						{{if queryFilterInfo.hidden == '0'}}
							checked
						{{/if}}
						><span></span>
					</label>
			</div>
			<div class="col-sm-2">
				<button class="btn btn-sm btn-primary bdo-dgbase-newquery-action" type="button"
				data-dgbase-btn-click="onDgQueryTemplateToEditQueryFilterBtnClick"
				>设置</button>
			</div>
		</div>
	{{/each}}
	</div>
	`;
	let dgTemplateFiltersTemplateObject = template('./dgTemplateFiltersTemplate', dgTemplateFiltersTemplate);
	let paths = ['./dgBaseSqlParamsTemplate', './dgBaseSqlResultFieldsTemplate', './dgTemplateFiltersTemplate'];
	$.extend(dgTemplateEditorTemplates.prototype, {
		sqlParamsTemplate,
		sqlParamsTemplateObject,
		sqlResultFieldsTemplate,
		dgTemplateFiltersTemplate,
		sqlResultFieldsTemplateObject,
		dgTemplateFiltersTemplateObject,
		paths
	});
	//root.DgTemplateEditorTemplates = DgTemplateEditorTemplates;
	return DgTemplateEditorTemplates;
}));