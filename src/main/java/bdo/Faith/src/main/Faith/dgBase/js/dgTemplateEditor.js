/*$(document).ready(function() {
	let designer = GC.Spread.Sheets.Designer;
	let spread = designer.wrapper.spread;
	let needSuspend = true;
	let _windowResizeTimer = null;
	let $dgTemplateEditorBody = $('#dgTemplateEditorBody');
	let $spreadContainerRoot = $('#spreadContainerRoot', $dgTemplateEditorBody);
	let $spreadContainer = $('#spreadContainer', $spreadContainerRoot);
	let $spreadContent = $('.content', $spreadContainer);
	let $spreadHeader = $('.header', $spreadContainer);
	let $spreadSS = $('#ss.ss.fill.gc-no-user-select', $spreadContent);
	let $ribbonBar = $('.ribbon-bar', $spreadContent);
	let height = $dgTemplateEditorBody.height() - 20;
	let $dgTemplateEditorSubPageSide = $('#dgTemplateEditorSubPageSide', $dgTemplateEditorBody);
	let $addDgQueryTemplateSubPage = $('#addDgQueryTemplateSubPage', $dgTemplateEditorSubPageSide);
	let addDgQueryTemplateSubPage = side({el: '#addDgQueryTemplateSubPage', autoHide: false});

	let $addDgQueryTemplateResultConfigSubPage = $('#addDgQueryTemplateResultConfigSubPage', $dgTemplateEditorSubPageSide);
	let addDgQueryTemplateResultConfigSubPage = side({el: '#addDgQueryTemplateResultConfigSubPage', autoHide: false});

	let $addDgQueryTemplateFilterConfigSubPage = $('#addDgQueryTemplateFilterConfigSubPage', $dgTemplateEditorSubPageSide);
	let addDgQueryTemplateFilterConfigSubPage = side({el: '#addDgQueryTemplateFilterConfigSubPage', autoHide: false});
	let compSiders = {};
	$('[data-bdo-side="comp"]', $dgTemplateEditorSubPageSide).each((index,item) => {
		let id = $(item).prop('id');
		compSiders[id] = side({el: '#'+id, autoHide: false});
	});
	/!*let $addDgQueryTemplateCompSystemSubPage = $('#addDgQueryTemplateCompSystemSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompSystemSubPage = side({el: '#addDgQueryTemplateCompSystemSubPage', autoHide: false});

		let $addDgQueryTemplateCompTextSubPage = $('#addDgQueryTemplateCompTextSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompTextSubPage = side({el: '#addDgQueryTemplateCompTextSubPage', autoHide: false});

		let $addDgQueryTemplateCompRadioSubPage = $('#addDgQueryTemplateCompRadioSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompRadioSubPage = side({el: '#addDgQueryTemplateCompRadioSubPage', autoHide: false});

		let $addDgQueryTemplateCompSelectSubPage = $('#addDgQueryTemplateCompSelectSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompSelectSubPage = side({el: '#addDgQueryTemplateCompSelectSubPage', autoHide: false});

		let $addDgQueryTemplateCompDateSubPage = $('#addDgQueryTemplateCompDateSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompDateSubPage = side({el: '#addDgQueryTemplateCompDateSubPage', autoHide: false});

		let $addDgQueryTemplateCompCustomizeSubPage = $('#addDgQueryTemplateCompCustomizeSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompCustomizeSubPage = side({el: '#addDgQueryTemplateCompCustomizeSubPage', autoHide: false});
	*!/

	let $dgTemplateEditorToolbar = $('#dgTemplateEditorToolbar', $dgTemplateEditorBody);
	// new query template form
	let $dgQueryTemplateBaseInfoForm = $('#dgQueryTemplateBaseInfoForm', $addDgQueryTemplateSubPage);
	let $dgTemplateSqlResultFieldsForm = $('#dgTemplateSqlResultFieldsForm', $addDgQueryTemplateSubPage);
	let $dgTemplateFiltersForm = $('#dgTemplateFiltersForm', $addDgQueryTemplateSubPage);

	// new query template form [end]


	let newDgQueryInfoMode = {
		baseInfo: {
			dgQueryTemplateName: '',
			dgQueryTemplateSql: ''
		}
	};

	function getHeight(){
		let icon = $('#fullscreenBtn').find('i');
		let fullscreenFlg = icon.hasClass('si-size-actual');
		if (fullscreenFlg) {
			return height + 85;
		} else {
			return height + 25;
		}
	}

	function updateLayout() {
		$spreadContainer.css('position', 'relative');
		$spreadContent.css('height', (getHeight() - 221) + 'px');
		$spreadContent.css('position', 'relative');
		$spreadSS.css('position', 'relative');
		$spreadHeader.css('width', '100%');
		if ($ribbonBar.data('gcui-gcuiribbon')) {
			$ribbonBar.data('gcui-gcuiribbon').updateRibbonSize();
		}

		let refreshFlg = true;
		if (spread && spread.isPaintSuspended()) {
			spread.resumePaint();
			spread.refresh();
			needSuspend = true;
			refreshFlg = false;
		}
		if (refreshFlg && spread) {
			spread.refresh();
		}
	}

	function _doWindowResize() {
		spread = designer.wrapper.spread;
		if (_windowResizeTimer) {
			window.clearTimeout(_windowResizeTimer);
		}
		_windowResizeTimer = window.setTimeout(function() {
			updateLayout();
			_windowResizeTimer = null;
			if (needSuspend) {
				needSuspend = false;
				window.setTimeout(function() {
					if(spread) {
						spread.suspendPaint();
						spread.suspendCalcService();
					}
				}, 300);
				window.setTimeout(function() {
					if(spread) {
						spread.resumeCalcService();
						spread.resumePaint();
					}
				}, 300);
			}
		}, 100); //now delay 100ms to resize designer
	}

	let toobarBtnEvent = {
		addDgQueryTemplateBtn(event) {
			addDgQueryTemplateSubPage.show();
		}
	};
	let newDgTemplateEvent = {
		onDgQueryTemplateSQLResolveBtnClick(event) {
			let datas = {
				dgQueryTemplateSql: '',
				dgQueryTemplateName: '',
				sqlParams: [],
				sqlResultFields: []
			};
			datas.dgQueryTemplateName = $('[name="datas.dgQueryTemplateName"]', $dgQueryTemplateBaseInfoForm).val();
			datas.dgQueryTemplateSql = $('[name="datas.dgQueryTemplateSql"]', $dgQueryTemplateBaseInfoForm).val();

			let sqlParamsMap = {};
			let $paramNames = $('[name="sqlParams.paramName"]', $dgQueryTemplateBaseInfoForm);
			let $paramLabels = $('[name="sqlParams.paramLabel"]', $dgQueryTemplateBaseInfoForm);
			let $paramPvValues = $('[name="sqlParams.paramPvValue"]', $dgQueryTemplateBaseInfoForm);
			if($paramNames && $paramNames.length > 0) {
				$paramNames.each(function(index, inputEl) {
					let $el = $(inputEl);
					sqlParamsMap[$el.val()] = {
						paramName: $el.val()
					};
				});
				$paramLabels.each(function(index, inputEl) {
					let $el = $(inputEl);
					sqlParamsMap[$el.attr('data-param-name')]['paramLabel'] = $el.val();
				});
				$paramPvValues.each(function(index, inputEl) {
					let $el = $(inputEl);
					sqlParamsMap[$el.attr('data-param-name')]['paramPvValue'] = $el.val();
				});
				for(let k in sqlParamsMap) {
					datas.sqlParams.push(sqlParamsMap[k]);
				}
			}
			$.ajax({
				url: 'dgBase/DgBase.dgTemplateQueryBaseInfo.json',
				type: 'POST',
				dataType: 'json',
				data: {
					jsonData: JSON.stringify(datas)
				}
			}).done(function(data) {
				if(data.success === true) {
					let SqlParamsHtml = template('./dgBaseSqlParamsTemplate', {sqlParams: data.data[0].sqlParams});
					$('#sqlParamsWrap', $dgQueryTemplateBaseInfoForm).replaceWith(SqlParamsHtml);

					let sqlResultFieldsWrapHtml = template('./dgBaseSqlResultFieldsTemplate', {sqlResultFields: data.data[0].sqlResultFields});
					$('#sqlResultFieldsWrap', $dgTemplateSqlResultFieldsForm).replaceWith(sqlResultFieldsWrapHtml);

					let dgTemplateFiltersWrapHtml = template('./dgTemplateFiltersTemplate', {queryFilters: getQueryFilters(data)});
					$('#dgTemplateFiltersWrap', $dgTemplateFiltersForm).replaceWith(dgTemplateFiltersWrapHtml);
				}else {
					bdoErrorBox('错误', data.resultInfo.statusText);
				}
			});
			/!*$.ajax({

			});*!/
		},
		onDgQueryTemplateToEditFieldBtnClick(event) {
			addDgQueryTemplateResultConfigSubPage.show();
		},
		onDgQueryTemplateToEditQueryFilterBtnClick(event) {
			addDgQueryTemplateFilterConfigSubPage.show();
		},
		onDgQueryTemplateToEditCompSettingBtnClick(event) {
			let $form = $(event.currentTarget).closest('form');
			let $selectEl = $('[name="queryFilter.filterElType"]', $form);
			let compName = $selectEl.val();
			let sider = compSiders['addDgQueryTemplateComp' + compName + 'SubPage'];
			if(sider) {
				sider.show();
			}
		}
	};

	function getQueryFilters(datas) {
		let sqlParams = datas.data[0].sqlParams;
		let sqlResultFields = datas.data[0].sqlResultFields;
		let result = [];
		if(sqlParams) {
			result = result.concat(sqlParams.map(param => {
				return {
					hidden: '0',
					fieldType: 'SQL入参',
					fieldLabel: param.paramLabel,
					fieldName: param.paramName
				};
			}));
		}
		if(sqlResultFields) {
			result = result.concat(sqlResultFields.map(field => {
				return {
					hidden: '1',
					fieldType: '查询列',
					fieldLabel: field.fieldLabel,
					fieldName: field.name
				};
			}));
		}
		return result;
	}

	function toolbarBtnEventBind() {
		$($dgTemplateEditorToolbar).on('click', '[data-dgbase-btn-click]', function(event) {
			let targetEl = event.currentTarget;
			let $this = $(targetEl);
			let action = $this.attr('data-dgbase-btn-click');
			if(action) {
				toobarBtnEvent[action].bind(targetEl)(event);
			}
		});
	}

	function newQueryFormEventBind() {
		$($dgTemplateEditorSubPageSide).on('click', '[data-dgbase-btn-click]', function(event) {
			let targetEl = event.currentTarget;
			let $this = $(targetEl);
			let action = $this.attr('data-dgbase-btn-click');
			if(action) {
				newDgTemplateEvent[action].bind(targetEl)(event);
			}
		});
	}
	function spreadInit() {
		designer.loader.rootFolder = spreadDesignerPath;
		designer.loader.ready(function() {
			//To Fix the designer resize performance issues.
			$(window).unbind('resize.gcuiribbon');
			spread = designer.wrapper.spread;
		});
		designer.loader.loadContent($('#spreadContainerRoot'));
		$(window).resize(_doWindowResize);
		$(window).resize();
	}

	function uiLayoutInit() {
		$addDgQueryTemplateSubPage.css('top', '0px');
		OneUI.initHelper('slimscroll');
	}

	function init() {
		spreadInit();
		toolbarBtnEventBind();
		newQueryFormEventBind();


		uiLayoutInit();
	}

	init();
});*/
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
	root.Faith = root.Faith ? root.Faith : {};
	if(Faith['./dgTemplateEditor']) return Faith['./dgTemplateEditor'];
	let DgTemplateEditor = function() {};
	let dgTemplateEditor = typeof window === 'object' && window.window === window
		? new DgTemplateEditor() : typeof self === 'object' && self.self === self
			? new DgTemplateEditor() : typeof dgTemplateEditor === 'object' && dgTemplateEditor.dgTemplateEditor === dgTemplateEditor
				? dgTemplateEditor
				: this;
	Faith['./dgTemplateEditor'] = dgTemplateEditor;

	let designer = GC.Spread.Sheets.Designer;
	let spread = designer.wrapper.spread;
	let needSuspend = true;
	let _windowResizeTimer = null;
	let $dgTemplateEditorBody = $('#dgTemplateEditorBody');
	let $spreadContainerRoot = $('#spreadContainerRoot', $dgTemplateEditorBody);
	let $spreadContainer = $('#spreadContainer', $spreadContainerRoot);
	let $spreadContent = $('.content', $spreadContainer);
	let $spreadHeader = $('.header', $spreadContainer);
	let $spreadSS = $('#ss.ss.fill.gc-no-user-select', $spreadContent);
	let $ribbonBar = $('.ribbon-bar', $spreadContent);
	let height = $dgTemplateEditorBody.height() - 20;
	let $dgTemplateEditorSubPageSide = $('#dgTemplateEditorSubPageSide', $dgTemplateEditorBody);
	let $addDgQueryTemplateSubPage = $('#addDgQueryTemplateSubPage', $dgTemplateEditorSubPageSide);
	let addDgQueryTemplateSubPage = side({el: '#addDgQueryTemplateSubPage', autoHide: false});

	let $addDgQueryTemplateResultConfigSubPage = $('#addDgQueryTemplateResultConfigSubPage', $dgTemplateEditorSubPageSide);
	let addDgQueryTemplateResultConfigSubPage = side({el: '#addDgQueryTemplateResultConfigSubPage', autoHide: false});

	let $addDgQueryTemplateFilterConfigSubPage = $('#addDgQueryTemplateFilterConfigSubPage', $dgTemplateEditorSubPageSide);
	let addDgQueryTemplateFilterConfigSubPage = side({el: '#addDgQueryTemplateFilterConfigSubPage', autoHide: false});
	let compSiders = {};
	$('[data-bdo-side="comp"]', $dgTemplateEditorSubPageSide).each((index,item) => {
		let id = $(item).prop('id');
		compSiders[id] = side({el: '#'+id, autoHide: false});
	});
	/*let $addDgQueryTemplateCompSystemSubPage = $('#addDgQueryTemplateCompSystemSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompSystemSubPage = side({el: '#addDgQueryTemplateCompSystemSubPage', autoHide: false});

		let $addDgQueryTemplateCompTextSubPage = $('#addDgQueryTemplateCompTextSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompTextSubPage = side({el: '#addDgQueryTemplateCompTextSubPage', autoHide: false});

		let $addDgQueryTemplateCompRadioSubPage = $('#addDgQueryTemplateCompRadioSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompRadioSubPage = side({el: '#addDgQueryTemplateCompRadioSubPage', autoHide: false});

		let $addDgQueryTemplateCompSelectSubPage = $('#addDgQueryTemplateCompSelectSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompSelectSubPage = side({el: '#addDgQueryTemplateCompSelectSubPage', autoHide: false});

		let $addDgQueryTemplateCompDateSubPage = $('#addDgQueryTemplateCompDateSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompDateSubPage = side({el: '#addDgQueryTemplateCompDateSubPage', autoHide: false});

		let $addDgQueryTemplateCompCustomizeSubPage = $('#addDgQueryTemplateCompCustomizeSubPage', $dgTemplateEditorSubPageSide);
		let addDgQueryTemplateCompCustomizeSubPage = side({el: '#addDgQueryTemplateCompCustomizeSubPage', autoHide: false});
	*/

	let $dgTemplateEditorToolbar = $('#dgTemplateEditorToolbar', $dgTemplateEditorBody);
	// new query template form
	let $dgQueryTemplateBaseInfoForm = $('#dgQueryTemplateBaseInfoForm', $addDgQueryTemplateSubPage);
	let $dgTemplateSqlResultFieldsForm = $('#dgTemplateSqlResultFieldsForm', $addDgQueryTemplateSubPage);
	let $dgTemplateFiltersForm = $('#dgTemplateFiltersForm', $addDgQueryTemplateSubPage);

	// new query template form [end]


	let newDgQueryInfoMode = {
		baseInfo: {
			dgQueryTemplateName: '',
			dgQueryTemplateSql: ''
		}
	};

	function getHeight(){
		let icon = $('#fullscreenBtn').find('i');
		let fullscreenFlg = icon.hasClass('si-size-actual');
		if (fullscreenFlg) {
			return height + 85;
		} else {
			return height + 25;
		}
	}

	function updateLayout() {
		$spreadContainer.css('position', 'relative');
		$spreadContent.css('height', (getHeight() - 221) + 'px');
		$spreadContent.css('position', 'relative');
		$spreadSS.css('position', 'relative');
		$spreadHeader.css('width', '100%');
		if ($ribbonBar.data('gcui-gcuiribbon')) {
			$ribbonBar.data('gcui-gcuiribbon').updateRibbonSize();
		}

		let refreshFlg = true;
		if (spread && spread.isPaintSuspended()) {
			spread.resumePaint();
			spread.refresh();
			needSuspend = true;
			refreshFlg = false;
		}
		if (refreshFlg && spread) {
			spread.refresh();
		}
	}

	function _doWindowResize() {
		spread = designer.wrapper.spread;
		if (_windowResizeTimer) {
			window.clearTimeout(_windowResizeTimer);
		}
		_windowResizeTimer = window.setTimeout(function() {
			updateLayout();
			_windowResizeTimer = null;
			if (needSuspend) {
				needSuspend = false;
				window.setTimeout(function() {
					if(spread) {
						spread.suspendPaint();
						spread.suspendCalcService();
					}
				}, 300);
				window.setTimeout(function() {
					if(spread) {
						spread.resumeCalcService();
						spread.resumePaint();
					}
				}, 300);
			}
		}, 100); //now delay 100ms to resize designer
	}

	let toobarBtnEvent = {
		addDgQueryTemplateBtn(event) {
			addDgQueryTemplateSubPage.show();
		}
	};
	let newDgTemplateEvent = {
		onDgQueryTemplateSQLResolveBtnClick(event) {
			let datas = {
				dgQueryTemplateSql: '',
				dgQueryTemplateName: '',
				sqlParams: [],
				sqlResultFields: []
			};
			datas.dgQueryTemplateName = $('[name="datas.dgQueryTemplateName"]', $dgQueryTemplateBaseInfoForm).val();
			datas.dgQueryTemplateSql = $('[name="datas.dgQueryTemplateSql"]', $dgQueryTemplateBaseInfoForm).val();

			let sqlParamsMap = {};
			let $paramNames = $('[name="sqlParams.paramName"]', $dgQueryTemplateBaseInfoForm);
			let $paramLabels = $('[name="sqlParams.paramLabel"]', $dgQueryTemplateBaseInfoForm);
			let $paramPvValues = $('[name="sqlParams.paramPvValue"]', $dgQueryTemplateBaseInfoForm);
			if($paramNames && $paramNames.length > 0) {
				$paramNames.each(function(index, inputEl) {
					let $el = $(inputEl);
					sqlParamsMap[$el.val()] = {
						paramName: $el.val()
					};
				});
				$paramLabels.each(function(index, inputEl) {
					let $el = $(inputEl);
					sqlParamsMap[$el.attr('data-param-name')]['paramLabel'] = $el.val();
				});
				$paramPvValues.each(function(index, inputEl) {
					let $el = $(inputEl);
					sqlParamsMap[$el.attr('data-param-name')]['paramPvValue'] = $el.val();
				});
				for(let k in sqlParamsMap) {
					datas.sqlParams.push(sqlParamsMap[k]);
				}
			}
			$.ajax({
				url: 'dgBase/DgBase.dgTemplateQueryBaseInfo.json',
				type: 'POST',
				dataType: 'json',
				data: {
					jsonData: JSON.stringify(datas)
				}
			}).done(function(data) {
				if(data.success === true) {
					let SqlParamsHtml = template('./dgBaseSqlParamsTemplate', {sqlParams: data.data[0].sqlParams});
					$('#sqlParamsWrap', $dgQueryTemplateBaseInfoForm).replaceWith(SqlParamsHtml);

					let sqlResultFieldsWrapHtml = template('./dgBaseSqlResultFieldsTemplate', {sqlResultFields: data.data[0].sqlResultFields});
					$('#sqlResultFieldsWrap', $dgTemplateSqlResultFieldsForm).replaceWith(sqlResultFieldsWrapHtml);

					let dgTemplateFiltersWrapHtml = template('./dgTemplateFiltersTemplate', {queryFilters: getQueryFilters(data)});
					$('#dgTemplateFiltersWrap', $dgTemplateFiltersForm).replaceWith(dgTemplateFiltersWrapHtml);
				}else {
					bdoErrorBox('错误', data.resultInfo.statusText);
				}
			});
			/*$.ajax({

			});*/
		},
		onDgQueryTemplateToEditFieldBtnClick(event) {
			addDgQueryTemplateResultConfigSubPage.show();
		},
		onDgQueryTemplateToEditQueryFilterBtnClick(event) {
			addDgQueryTemplateFilterConfigSubPage.show();
		},
		onDgQueryTemplateToEditCompSettingBtnClick(event) {
			let $form = $(event.currentTarget).closest('form');
			let $selectEl = $('[name="queryFilter.filterElType"]', $form);
			let compName = $selectEl.val();
			let sider = compSiders['addDgQueryTemplateComp' + compName + 'SubPage'];
			if(sider) {
				sider.show();
			}
		},
		onDgQueryTemplateBaseInfoSubmit(event){
			let $form = $(event.currentTarget).closest('form');
			$form.
			newDgQueryInfoMode['dgQueryTemplateBaseInfoForm'] = {};
		}
	};

	function getQueryFilters(datas) {
		let sqlParams = datas.data[0].sqlParams;
		let sqlResultFields = datas.data[0].sqlResultFields;
		let result = [];
		if(sqlParams) {
			result = result.concat(sqlParams.map(param => {
				return {
					hidden: '0',
					fieldType: 'SQL入参',
					fieldLabel: param.paramLabel,
					fieldName: param.paramName
				};
			}));
		}
		if(sqlResultFields) {
			result = result.concat(sqlResultFields.map(field => {
				return {
					hidden: '1',
					fieldType: '查询列',
					fieldLabel: field.fieldLabel,
					fieldName: field.name
				};
			}));
		}
		return result;
	}

	function toolbarBtnEventBind() {
		$('[data-dgbase-btn-click]', $dgTemplateEditorToolbar).each((index, el) => {
			let targetEl = el;
			let $this = $(targetEl);
			let action = $this.attr('data-dgbase-btn-click');
			if(action && action > '' && !newDgTemplateEvent[action]) {
				newDgTemplateEvent[action] = event => {
					console.error(action + 'not define.');
				};
			}
		});
		$($dgTemplateEditorToolbar).on('click', '[data-dgbase-btn-click]', function(event) {
			let targetEl = event.currentTarget;
			let $this = $(targetEl);
			let action = $this.attr('data-dgbase-btn-click');
			if(action && toobarBtnEvent[action]) {
				toobarBtnEvent[action].bind(targetEl)(event);
			}
		});
	}

	function newQueryFormEventBind() {
		$('[data-dgbase-btn-click]', $dgTemplateEditorSubPageSide).each((index, el) => {
			let targetEl = el;
			let $this = $(targetEl);
			let action = $this.attr('data-dgbase-btn-click');
			if(action && action > '' && !newDgTemplateEvent[action]) {
				newDgTemplateEvent[action] = event => {
					console.error(action + 'not define.');
				};
			}
		});
		$($dgTemplateEditorSubPageSide).on('click', '[data-dgbase-btn-click]', function(event) {
			let targetEl = event.currentTarget;
			let $this = $(targetEl);
			let action = $this.attr('data-dgbase-btn-click');
			if(action && newDgTemplateEvent[action]) {
				newDgTemplateEvent[action].bind(targetEl)(event);
			}
		});
	}

	function spreadInit() {
		designer.loader.rootFolder = spreadDesignerPath;
		designer.loader.ready(function() {
			//To Fix the designer resize performance issues.
			$(window).unbind('resize.gcuiribbon');
			spread = designer.wrapper.spread;
		});
		designer.loader.loadContent($('#spreadContainerRoot'));
		$(window).resize(_doWindowResize);
		$(window).resize();
	}

	function uiLayoutInit() {
		$addDgQueryTemplateSubPage.css('top', '0px');
		OneUI.initHelper('slimscroll');
	}

	function init() {
		spreadInit();
		toolbarBtnEventBind();
		newQueryFormEventBind();


		uiLayoutInit();
	}

	init();

	try{
		null.split()
	}catch(e){
		console.log(e.stack)  // 在错误信息的栈信息里获取
	}

	Faith['./dgTemplateEditor'] = dgTemplateEditor;
	return dgTemplateEditor;
}));