/**
 * 创建vue 类型的Form
 */
var vueCompMap = {};

function createForm(formsetting) {
	vueCompMap[formsetting.id + 'Comp'] = Vue.extend(new FormComp(formsetting));
	if (vueCompMap[formsetting.id + 'Form']) {
		vueCompMap[formsetting.id + 'Form'].$destroy();
		//vueCompMap[formsetting.id+'Comp'] = Vue.extend(new FormComp(formsetting));
	} else {
		//vueCompMap[formsetting.id+'Form'].$destroy();
	}
	var Comp;
	var	form;
	var	options;
	options = $.extend(true, {}, formsetting.options);
	Comp = vueCompMap[formsetting.id + 'Comp'];
	form = new Comp(options);
	form.$mount('#' + formsetting.id);
	vueCompMap[formsetting.id + 'Form'] = form;
	return form;
}

/**
 * 下载文件
 */
function downloadFile(url, params) {
	let form = $('<form>');
	form.attr('style', 'display:none');
	form.attr('target', 'body');
	form.attr('method', 'post');
	form.attr('action', url);
	$.each(params, function(key, value) {
		let input = $('<input>');
		input.attr('type', 'hidden');
		input.attr('name', key);
		if ($.isPlainObject(value)) {
			input.attr('value', JSON.stringify(value));
		} else {
			input.attr('value', value);
		}
		form.append(input);
	});
	$('body').append(form);
	form.submit();
	form.remove();
}

/**
 * 从服务器上获取模板
 */
/*function tplLoader(url, callback) {
	let html = '<div></div>';
	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'text',
		async : false,
		success: function(result) {
			html = result;
			callback && callback(html);
		}
	});
	return html;
}*/

window.tplMap = window.tplMap ? window.tplMap : {};

function tplLoader(url, callback) {
	if (window.tplMap[url]) {
		callback && callback(window.tplMap[url]);
		return window.tplMap[url];
	}
	var html = '<div style="height: 100%;width: 100%;"></div>';
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'text',
		async: false,
		success: function(result) {
			html = result;
			callback && callback(html);
		}
	});
	window.tplMap[url] = html;
	return html;
}

function getIndustryData() {
	let result;
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00002'
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			result = data.data;
		}
	});
	return result;
}

var timeo;
var ev = function(event) {
	let $doc = $(document);
	//console.info('let ev = function (event)');
	let eventEl = event.data.eventEl;
	//event && event.preventDefault();
	if (eventEl.$dropWrap.attr('data-bdo-drop-state') === 'false' && !timeo) {
		timeo = setTimeout(() => {
			clearTimeout(timeo);
			eventEl.$dropWrap.hide();
			$doc.undelegate('.bdo-drop-menu-model', 'click', ev);
			$doc.undelegate('.bdo-drop-menu-model', 'mousewheel', ev);
			$doc.undelegate('.bdo-drop-menu-model', 'mousemove', ev);
			$('.bdo-drop-menu-model').removeClass('bdo-drop-menu-model');
			timeo = undefined;
		}, 1500);
	} else {
		if (timeo) {
			clearTimeout(timeo);
			timeo = undefined;
		}
	}
};

function bdoDropdoIt(event) {
	let $doc = $(document);
	//console.log("function bdoDropdoIt(event)");
	let eventEl = event.data.eventData;
	eventEl.$dropWrap.empty().append(eventEl.$dropMenu);
	let jqEl = $(event.currentTarget);
	let $ul = eventEl.$dropMenu.find('.bdo-drop-ul');
	let methods = {};
	$ul.empty();
	$.each(eventEl.options.buttons, (index, obj) => {
		let liHtml = '<li class="list-group-item"><a href="#"  id="' + obj.id + '" data-bdo-dropmenu="' + obj.id + '"><i class="' + obj.icon + '"></i> ' + obj.text + '</a></li>';
		$ul.append(liHtml);
		methods[obj.id] = obj.handler;
	});
	$ul.on('click', 'li a[data-bdo-dropmenu]', {eventEl}, event1 => {
		let $el = $(event1.currentTarget);
		methods[$el.attr('id')] && methods[$el.attr('id')].apply(eventEl.options.scope, [jqEl, event1]);
		eventEl.$dropWrap.hide();
		eventEl.$dropWrap.empty();
		eventEl.$dropWrap.attr('data-bdo-drop-state') === 'false';
		ev(event1);
	});
	let flag = true;
	eventEl.$dropWrap.attr('data-bdo-drop-state', false);
	eventEl.$dropWrap.on('focusout', event2 => {
		if (!flag) {
			eventEl.$dropWrap.hide();
		}
	});
	eventEl.$dropWrap.on('blur', event3 => {
		if (!flag) {
			eventEl.$dropWrap.hide();
		}
	});
	eventEl.$dropWrap.on('mouseleave', event4 => {
		flag = false;
		eventEl.$dropWrap.attr('data-bdo-drop-state', false);
	});
	eventEl.$dropWrap.on('mouseenter', event5 => {
		flag = true;
		eventEl.$dropWrap.attr('data-bdo-drop-state', true);
	});
	let offset = jqEl.offset();
	let top = offset.top, left = offset.left;
	let height = jqEl.height(), width = jqEl.width();
	let menuWidth = eventEl.$dropMenu.width();

	eventEl.$dropWrap.css({
		top: (top + height + 2) + 'px',
		left: (left - menuWidth / 2 + width / 2) + 'px',
		'z-index': 10000
	});
	eventEl.options.beforeShow && eventEl.options.beforeShow(jqEl, eventEl.$dropMenu);
	eventEl.$dropWrap.show();
	eventEl.$dropWrap.focus();
	eventEl.options.afterShow && eventEl.options.afterShow(jqEl, eventEl.$dropMenu);
	$('body').addClass('bdo-drop-menu-model');

	$doc.undelegate('.bdo-drop-menu-model', 'click', ev);
	$doc.undelegate('.bdo-drop-menu-model', 'mousewheel', ev);
	$doc.undelegate('.bdo-drop-menu-model', 'mousemove', ev);

	$doc.delegate('.bdo-drop-menu-model', 'click', {eventEl}, ev);
	$doc.delegate('.bdo-drop-menu-model', 'mousewheel', {eventEl}, ev);
	$doc.delegate('.bdo-drop-menu-model', 'mousemove', {eventEl}, ev);
}

/**
 * dataTable 上的按钮的下拉菜单
 */
function bdoDropMenu(options) {
	let _opt = options;
	let dropMenuTpl = '<div class="bdo-drop" tabindex="-200"></div>';
	let template = '<div class="bdo-drop-menu text-left">'
		+ '	<ul class="bdo-drop-ul list-group">'
		+ '	</ul>'
		+ '</div>';
	let $dropWrap = $(dropMenuTpl);
	let $dropMenu = $(template);
	let $body = $('body');
	if ($('body .bdo-drop').length > 0) {
		$('body .bdo-drop').remove();
	}
	$('body').append($dropWrap);
	let eventData = {
		$dropWrap, $dropMenu, $body, dropMenuTpl, template, options: _opt
	};
	/*let doIt = (event)=>{
		$dropWrap.empty().append($dropMenu);
		let jqEl = $(event.currentTarget);
		let $ul = $dropMenu.find('.bdo-drop-ul');
		let methods = {};
		$ul.empty();
		$.each(options.buttons, (index, obj) => {
			let liHtml = '<li class="list-group-item"><a href="#"  id="'+obj.id+'" data-bdo-dropmenu="'+obj.id+'"><i class="'+obj.icon+'"></i> '+obj.text+'</a></li>';
			$ul.append(liHtml);
			methods[obj.id] = obj.handler;
		});
		$ul.on('click', 'li a[data-bdo-dropmenu]', event => {
			let $el = $(event.currentTarget);
			methods[$el.attr('id')] && methods[$el.attr('id')].apply(options.scope, [jqEl, event]);
			$dropWrap.hide();
			$dropWrap.empty();
			$dropWrap.attr('data-bdo-drop-state') === 'false';
			ev();
		});
		let flag = true;
		$dropWrap.attr('data-bdo-drop-state', false);
		$dropWrap.on('focusout', event => {
			if(!flag) {
				$dropWrap.hide();
			}
		});
		$dropWrap.on('blur', event => {
			if(!flag) {
				$dropWrap.hide();
			}
		});
		$dropWrap.on('mouseleave', event => {
			flag = false;
			$dropWrap.attr('data-bdo-drop-state', false);
		});
		$dropWrap.on('mouseenter', event => {
			flag = true;
			$dropWrap.attr('data-bdo-drop-state', true);
		});
		let offset = jqEl.offset();
		let top = offset.top, left = offset.left;
		let height = jqEl.height(), width = jqEl.width();
		let menuWidth = $dropMenu.width();

		$dropWrap.css({top: (top + height+2)+'px', left: (left - menuWidth/2 + width/2)+'px', 'z-index': 10000});
		options.beforeShow && options.beforeShow(jqEl, $dropMenu);
		$dropWrap.show();
		$dropWrap.focus();
		options.afterShow && options.afterShow(jqEl, $dropMenu);
		$('body').addClass('bdo-drop-menu-model');
		let timeo;
		let ev = function (event) {
			//event && event.preventDefault();
			if($dropWrap.attr('data-bdo-drop-state') === 'false' && !timeo) {
				timeo = setTimeout(()=>{
					clearTimeout(timeo);
					$dropWrap.hide();
					$doc.undelegate('.bdo-drop-menu-model', 'click', ev);
					$doc.undelegate('.bdo-drop-menu-model', 'mousewheel', ev);
					$doc.undelegate('.bdo-drop-menu-model', 'mousemove', ev);
					$('.bdo-drop-menu-model').removeClass('bdo-drop-menu-model');
					timeo = undefined;
				}, 1500);
			}else {
				if(timeo) {
					clearTimeout(timeo);
					timeo = undefined;
				}
			}
		};
		$doc.delegate('.bdo-drop-menu-model', 'click', ev);
		$doc.delegate('.bdo-drop-menu-model', 'mousewheel', ev);
		$doc.delegate('.bdo-drop-menu-model', 'mousemove', ev);
	};
	let doItFn = doIt.bind(options.scope);*/
	$body.off('click', options.el);
	$body.on('click', options.el, {eventData}, bdoDropdoIt/*.bind(options.scope)*/);
}

/**
 * 获取审计科目目录接口
 */
function getSubjecttree(param, callback) {
	$.ajax({
		url: 'dgCenter/DgMain.getSubjecttree.json',
		type: 'post',
		data: param,
		dataType: 'json',
		bdolxLoader: false,
		success(data) {
			if (data.success) {
				$.sessionStorage('subjecttree', JSON.stringify(data.data[0].treeData));
				//console.info(JSON.stringify(data.data[0].treeData));
			}else{
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
			if (!data.data) {
				return;
			}
			callback && callback(data);
		}
	});
}

/**
 * 搜索Subjecttree
 */
function searchSubjecttreeNode(node, checker) {
	let resultNode;
	return (function(node, checker) {
		if (resultNode) {
			return resultNode;
		}
		if (checker(node)) {
			return resultNode = node;
		} else {
			if (node.nodes) {
				for (let i = 0; i < node.nodes.length; i++) {
					arguments.callee(node.nodes[i], checker);
				}
			}
		}
		return resultNode;
	}(node, checker));
}

//未审报表比对当前用户和项目负责人
function unAuditProjectInfo() {
	if(!window.CUR_PROJECTID || !window.CUR_CUSTOMERID || !(window.CUR_CUSTOMERID > '') || !(window.CUR_PROJECTID > '')) {
		$.sessionStorage('projectManager', 0);
		$.sessionStorage('mergeType', 0);
		return;
	}
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00061',
			param1: window.CUR_PROJECTID,
			param2: window.CUR_CUSTOMERID
		},
		dataType: 'json',
		success(data) {
			if (data.success) {
				if (data != null && data != undefined && data.data[0] != null && data.data[0] != undefined) {
					$.sessionStorage('projectManager', (data.data[0].manager == null || data.data[0].manager == undefined) ? '0' : data.data[0].manager);
					$.sessionStorage('mergeType', data.data[0].mergeType);
					// $.sessionStorage('mergeType', 0);
				} else {
					$.sessionStorage('projectManager', 0);
					$.sessionStorage('mergeType', 0);
				}
			}
		}
	});
}
unAuditProjectInfo();

function initPostilContentsEditor(vm, agrs) {
	let $this = vm;
	let $el = $('#postilContent', $(agrs.region));
	let summerotePluginOpt = {
		toolbar:
			[
				// [groupName, [list of button]]
				['style', ['bold', 'italic', 'underline', 'clear']],
				['font', ['strikethrough', 'superscript', 'subscript']],
				['fontsize', ['fontsize']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['height', ['height']],
				['view', ['fullscreen']],
			],
		codeviewFilter: false,
		codeviewIframeFilter: true,
		codeviewIframeWhitelistSrc: ['localhost', '127.0.0.1', 'sacpdemo.bdo.com.cn', 'sacp.bdo.com.cn', 'sacpuat.bdo.com.cn'],
		callbacks: {
			onPaste: function(ne) {
				//debugger;
			},
			onChange: $.proxy(function(contents, $editable) {
				this.postilContent = contents;
			}, $this),
			onFocusin: $.proxy(function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				$el.trigger('focusin');
			}, $this),
			onFocusout: $.proxy(function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				$el.trigger('focusout');
			}, $this),
			onKeyup: $.proxy(function(evt) {
				this.postilContent = $el.summernote('code');
			}, $this),
			onKeydown: $.proxy(function(we, evt) {
				this.postilContent = $el.summernote('code');
			}, $this),
			onInit: $.proxy(function(we, evt) {
				$el.summernote('lineHeight', 1.2);
			}, $this)
		}
	};
	$('#postilContent', $(agrs.region)).off('summernote');
	$this.$postilContentEl = $('#postilContent', $(agrs.region)).summernote(summerotePluginOpt);
	$(agrs.region).on('click', '.postil-content-html img', function(event) {
		let src = $(event.currentTarget).attr('src');
		let img = getQueryString(src, 'img');
		window.open(src, '_blank,name='+img);
	});
	$(agrs.region).on('mouseenter ', '.postil-content-html img', function(event) {
		let src = $(event.currentTarget).attr('src');
		if($('[data-img-id="' + src + '"]').length > 0) {
			return;
		}
		let $tip = $('<span class="postil-content-img-hover-tip" data-img-id="' + src + '">点击打开图片</span>');
		$tip.css({
			'top': event.pageY + 'px',
			'left': event.pageX + 'px'
		});
		$tip.appendTo($(document.body));
	});
	$(agrs.region).on('mouseleave  ', '.postil-content-html img', function(event) {
		let src = $(event.currentTarget).attr('src');
		if($('[data-img-id="' + src + '"]').length > 0) {
			$('[data-img-id="' + src + '"]').remove();
		}
	});
}

function getQueryString(url, name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");// 匹配目标参数
	var result = url.substr(1).match(reg);// 对querystring匹配目标参数
	if (result != null) {
		return decodeURIComponent(result[2]);
	} else {
		return null;
	}
}

function updateUsedRange(json){
	try{
		for(var prop in json.sheets){
			var sheet = json.sheets[prop];
			var dataTable = sheet && sheet.data && sheet.data.dataTable;
			var maxRowCount = 0, maxColCount = 0;
			if(dataTable){
				var rowPropLength = Object.keys(dataTable).length;
				if(rowPropLength > 0){
					maxRowCount = parseInt(Object.keys(dataTable)[rowPropLength - 1]);
				}
				for(var rowProp in dataTable){
					var row = dataTable[rowProp];
					var colPropLength = Object.keys(row).length;
					if(colPropLength > 0){
						var colCount = parseInt(Object.keys(row)[colPropLength - 1]);
						if(maxColCount < colCount){
							maxColCount = colCount;
						}
					}
				}
			}

			if(maxRowCount > 0 && sheet && sheet.rowCount){
				sheet.rowCount = maxRowCount + 5;
			}

			if(maxColCount > 0 && sheet && sheet.columnCount){
				sheet.columnCount = maxColCount + 5;
			}

			// if(maxRowCount > 0 && sheet && sheet.data && sheet.data.rowDataArray && sheet.data.rowDataArray.length > maxRowCount){
			//     sheet.data.rowDataArray = sheet.data.rowDataArray.slice(0, maxRowCount);
			// }
			// if(maxRowCount > 0 && sheet && sheet.rows && sheet.rows.length > maxRowCount){
			//     sheet.rows = sheet.rows.slice(0, maxRowCount);
			// }

			// if(maxColCount > 0 && sheet && sheet.data && sheet.data.columnDataArray && sheet.data.columnDataArray.length > maxColCount){
			//     sheet.data.columnDataArray = sheet.data.columnDataArray.slice(0, maxColCount);
			// }
			// if(maxColCount > 0 && sheet && sheet.columns && sheet.columns.length > maxColCount){
			//     sheet.columns = sheet.columns.slice(0, maxColCount);
			// }
		}
	}
	catch(e){}
	return json;
}