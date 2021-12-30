/**
 * 从服务器上获取模板
 */
window.tplMap = window.tplMap ? window.tplMap : {};
var tplLoader = function(url) {
	if(window.tplMap[url]) {
		return window.tplMap[url];
	}
	var html = '<div style="width: 100%;height: 100%;"></div>';
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'text',
		async : false,
		success: function(result) {
			html = result;
		}
	});
	tplMap[url] = html;
	return html;
};
/**
 * 创建表单
 */
var FormComp = function(options){
	var me = this;
	var _default = {};
	_default.settings = {
		// 字段默认值
		item : {
			// 元素展示形式
			colspan : 1,
			rowspan : null,
			createNewRow : false, // 是否追加新的一行
			cellType : 'td', // th
			html : null,
			label : null,
			labelClass : null,
			// 基本表单元素
			type : null, // input textarea select div 暂时只支持这四类元素
			typeAttr : { // html 属性 
			},
			// 插件信息
			plugin : {
			},
			// 表单验证
			validate : {
				rules : {
					required : false
				},
				messages : {
					required : '请输入！'
				}
			},
			show: true
		},
		// 按钮默认配置
		button : {
			id : 'btn',
			text : '按钮',
			style : null,
			icon : 'fa-star'
		},
		ajaxConf : {
			url : null,
			data : {},
			success : function(result){},
			dataType : 'json',
			type: 'post',
			async : false
		},
		showtip : true,
		tip : null,
		style : {},
		buttons : [],
		buttonsAlign : 'right',
		columns : 6,
		display : 'form', // tableform-one tableform-two
		nothing : null
	};
	me.options = $.extend({}, _default.settings, options);
	//$form.attr('id', options.id);
	var formTpl = {
		table: '<table class="table table-bordered"></table>',
		tr: '<tr></tr>',
		th: '<th></th>',
		td: '<td></td>',
		div: '<div class="form-material "></div>',
		label: '<label></label>',
		span: '<span class="necessary">*</span>',
		input: '<input class="form-control" type="text" data-toggle="tooltip" data-placement="top" title="" />',
		file: '<input class="form-control" type="file" data-toggle="tooltip" data-placement="top" title="" class="file"/>',
		button: '<button class="btn" type="button" style="margin-left:10px;" ></button>',
		buttonIcon: '<i class="fa" style="margin-right:8px;"></i></button>',
		buttonTextSpan: '<span></span>',
		checkbox: '<label class="css-input switch switch-success"><input type="checkbox"><span></span></label>',
		select: '<select class="form-control"></select>',
		tip: '<p class="text-muted" style="float: left;letter-spacing: 2px;font-size: 15px;">注:<span class="text-danger" style="margin: 0 5px;">*</span>为必填项。</p>',
		textarea: '<textarea class="form-control" style="resize: none;"></textarea>'
	};
	var createFormHtml = function(options) {
		var $container = $('<div></div>');
		var $form = $('<form class="form-horizontal" :jsonData="jsonData"></form>');
		var $wrapper = $(formTpl.table);
		$form.attr('id', options.id);
		$wrapper.css(options.style);
		if(options.display == 'tableform-one'){
			me.options.formItem = {};
			$.each(options.items, function addItems(index, item) {
				item = $.extend(true, {}, _default.settings.item, item);
				me.options.formItem[item.id] = item;
				var tr = null;
				var td = null;
				if(item.cellType == 'td'){
					td = $(formTpl.td);
				}else{
					td = $(formTple.th);
				}
				if(item.rowspan){
					td.attr('rowspan', item.rowspan);
					tr = $(formTpl.tr);
					$wrapper.append(tr);
				}else{
					tr = $wrapper.find('tr:last');
					var tdT = tr.find('td[rowspan]');
					if(tr.length == 0 || (tdT.length > 0 && item.createNewRow)){
						tr = $(formTpl.tr);
						$wrapper.append(tr);
					}
				}
				if(item.colspan){
					td.attr('colspan', item.colspan);
					td.attr('v-if', 'formItem.'+item.id+'.show');
				}
				tr.append(td);
				if(item.type){
					var component = null;
					var div = $(formTpl.div);
					td.append(div);
					if(item.type == 'input' || item.type == 'treecombo'){
						component = $(formTpl.input);
					}else if(item.type == 'file'){
						component = $(formTpl.file);
					}else if(item.type == 'textarea'){
						component = $(formTpl.textarea).attr('rows', item.rows ? item.rows : 1);
					}else if(item.type == 'select'){
						component = $(formTpl.select);
					}else if(item.type == 'div'){
						component = $('<div></div>');
					}else if(item.type == 'checkbox'){
						component = $(formTpl.checkbox);
					}else if(item.type == 'button') {
						var button = $.extend({}, _default.settings.button, button);
						component = $(formTpl.button);
						if(button.icon != null && button.icon != ''){
							var icon = $(formTpl.buttonIcon).addClass(button.icon);
							component.append(icon);
						}
						if(button.style){
							component.addClass(button.style);
						}
						if(button.text){
							var span = $(formTpl.buttonTextSpan);
							component.html(button.text);
							component.append(span);
						}
					}
					component.attr('id', item.id)
							 .attr('name', item.id);
					for(var key in item.typeAttr){
						var key_ = key;
						if(typeof key_ === 'string') {
							if(key_.startsWith(':')) {
								key_ = 'v-bind'+key_;
							}else if(key_.startsWith('@')) {
								key_ = key_.replace('@', 'v-on:');
							}
						}
						component.attr(key_, item.typeAttr[key]);
					}
					if(item.type == 'input' || item.type == 'textarea') {
						if(item.typeAttr && item.typeAttr.html == true) {
							component.attr('v-html', 'jsonData.'+item.id);
						}else {
							component.attr('v-model', 'jsonData.'+item.id);
						}
					}
					
					if(item.typeAttr.type == 'hidden'){
						tr.remove();
						$form.append(component);
						return true;
					}
					var label = $(formTpl.label)
						.attr('for', item.id)
						.html(item.label);
					if(item.validate.rules.required){
						var span = $(formTpl.span);
						label.append(span);
						td.addClass('has-success');
					}
					if(item.typeAttr.normal){
						td.addClass('has-info');
					}
					/*if(item.plugin && item.plugin.name) {
						component.attr('v-bind:'+item.id+item.plugin.name+'Options', item.id+item.plugin.name+'Options');
					}*/
					div.append(component).append(label);
				}
				
				if(item.html){
					if(item.type){
						component.html(item.html);
					}else{
						td.html(item.html);
					}
				}
			});
			var buttons = options.buttons;
			if(buttons.length > 0){
				var tr = $(formTpl.tr);
				var tip = options.tip == null ? $(formTpl.tip) : $(options.tip);
				var td = $(formTpl.td).attr('colspan',options.columns).css({'text-align' : options.buttonsAlign});
				if(options.showtip){
					$(td).append(tip);
				}
				$(tr).append(td);
				$wrapper.append(tr);
				$.each(buttons, function addItems(index, button) {
					button = $.extend({}, _default.settings.button, button);
					var btn = $(formTpl.button);
						btn.attr('id', button.id);
					if(button.icon != null && button.icon != ''){
						var icon = $(formTpl.buttonIcon).addClass(button.icon);
						btn.append(icon);
					}
					if(button.style){
						btn.addClass(button.style);
					}
					if(button.text){
						var span = $(formTpl.buttonTextSpan);
						span.html(button.text);
						btn.append(span);
					}
					for(var key in button.typeAttr){
						btn.attr(key, button.typeAttr[key]);
					}
					$(td).append(btn);
				});
			}
		}
		$form.append($wrapper);
		$container.append($form);
		var result = $container.html();
		$container.remove();
		return result;
	};
	var setValidate = function (options) {
		me.$form.validate({
			onblur : true,
			ignore : [],
			errorClass : 'help-block text-right animated fadeInUp',
			errorElement : 'div',
			errorPlacement : function(error, e) {
				$(e).closest('td').append(error);
			},
			highlight : function(e) {
				var elem = $(e);
				elem.closest('td').removeClass('has-error')
						.addClass('has-error');
				elem.closest('.help-block').remove();
			},
			success : function(e) {
				var elem = $(e);
				elem.closest('td').removeClass('has-error');
				elem.closest('.help-block').remove();
			},
			submitHandler : function() {
				$mes.formSubmit();
			},
			rules : {
				'test-one1' : {
					digits : true
				}
			},
			messages : {
				'test-one1' : {
					digits : '请输入!'
				}
			}
		});
		$.each(options.items, function addItems(index, item) {
			if(item.validate) {
				var rules = item.validate.rules;
				var messages = item.validate.messages;
				for (var key in rules){
					me.$form.validate().settings.rules[item.id] = rules;
					me.$form.validate().settings.messages[item.id] = messages;
				}
			}
		});
	};
	var setPlugin = function(options) {
		var $this = this;
		$.each(options.items, function addItems(index, item) {
			if(item.plugin && item.plugin.name) {
				var pluginNm = item.plugin.name;
				var pluginOpt = item.plugin.options;
				var $el = $('#'+item.id);
				/*** **/
				if(pluginNm == 'summernote') {
					pluginOpt.callbacks = $.extend({}, pluginOpt.callbacks, {
						onChange: $.proxy(function(contents, $editable){
							//console.log('onChange:\n'+$el.summernote('code'));
							this.jsonData[item.id] = contents;
						}, $this),
						onFocusin: $.proxy(function(evt){
							evt.preventDefault();
							evt.stopPropagation();
							//console.log('onFocusin:\n'+$el.summernote('code'));
							//this.jsonData[item.id] = $el.summernote('code');
							$el.trigger('focusin');
						}, $this),
						onFocusout: $.proxy(function(evt){
							evt.preventDefault();
							evt.stopPropagation();
							//console.log('onFocusout:\n'+$el.summernote('code'));
							//this.jsonData[item.id] = $el.summernote('code');
							$el.trigger('focusout');
						}, $this),
						onKeyup: $.proxy(function(evt){
							//console.log('onKeyup:\n'+$el.summernote('code'));
							this.jsonData[item.id] = $el.summernote('code');
						}, $this),
						onKeydown: $.proxy(function(we, evt){
							//console.log('onKeydown:\n'+$el.summernote('code'));
							this.jsonData[item.id] = $el.summernote('code');
						}, $this),
						onInit: $.proxy(function(we, evt){
							$el.summernote('lineHeight', 1.2);
						}, $this)
					});
					pluginOpt.toolbar = $.extend([], pluginOpt.toolbar, [
						['style', ['bold', 'italic', 'underline', 'clear']],
						['fontsize', ['fontsize']],
						['color', ['color']],
						['para', ['ul', 'ol'/*, 'paragraph'*/]]
					]);
				}
				if(pluginNm == 'fileinput') {
					pluginOpt = $.extend({}, pluginOpt, {
						dropZoneEnabled: true,
						dropZoneTitle: '点击选择文件或拖拽文件到这里 &hellip;<br>',
						dropZoneClickTitle: '',
						browseLabel: '上传附件',
						showCaption: false,
						showRemove: false,
						showUpload: false,
						showBrowse: false,
						initialPreviewShowDelete: true,
						language: 'zh',
						browseOnZoneClick: true,
						showClose : false, 
						uploadAsync: false,
						showCancel: false,
						hideThumbnailContent: true,
						layoutTemplates: {
							actionUpload: '',
							actionZoom: ''
						},
						fileActionSettings: {
							removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>',
						},
						uploadAsync: false
					});
				}
				if(pluginNm == 'treecombo') {
					var callback = pluginOpt.nodeSelectedCallback || function(tree, data){};
					pluginOpt.nodeSelectedCallback = $.proxy(function(tree, data) {
						this.jsonData[item.id] = data.result;
						callback(tree, data);
					}, $this);
				}
				/*** **/
				$el[pluginNm](pluginOpt);
				if(pluginNm == 'treecombo' || pluginNm == 'tree') {
					me[item.id+item.plugin.name+'Options'] = $el[pluginNm](true).options;
				}
				
				/*** **/
				if(pluginNm == 'fileinput') {
					$el.on('filebatchuploadsuccess', $.proxy(function(event, data) {
						/*console.log('filebatchuploadsuccess:');
						console.log(data);*/
						this.uploadFileSuccess(item.id, data.response);
					}, $this));
					$el.on('fileuploaded', $.proxy(function(event, data) {
						/*console.log('fileuploaded:');
						console.log(data);*/
						this.uploadFileSuccess(item.id, data.response);
					}, $this));
					$el.on('fileuploaderror', $.proxy(function(event, data, msg) {
						console.log('fileuploaderror:');
						console.log(msg);
						this.uploadFileSuccess(item.id, data.response);
					}, $this));
					$el.on('filebatchuploaderror', $.proxy(function(event, data, msg) {
						console.log('filebatchuploaderror:');
						console.log(msg);
						this.uploadFileSuccess(item.id, data.response);
					}, $this));
				}
			}
		});
	};
	var setPluginWatcher = function(options) {
		me.options.watch = me.options.watch ? me.options.watch : {};
		$.each(options.items, function addItems(index, item) {
			var $el = $('#'+item.id);
			if(item.plugin && item.plugin.name == 'summernote') {
				var cusWatchFn = options.watch['jsonData.'+item.id] ? options.watch['jsonData.'+item.id] : function(newVal, oldVal){};
				me.options.watch['jsonData.'+item.id] = function(newVal, oldVal) {
					var $inputEl = $('#'+item.id);
					if($inputEl.summernote('code') != newVal) {
						$inputEl.summernote('code', newVal);
					}
					if(newVal == '') {
						$inputEl.summernote('code', newVal);
						$inputEl.summernote('reset');
					}
					cusWatchFn(newVal, oldVal);
				}
			}
			if(item.plugin && item.plugin.name == 'treecombo') {
				var cusWatchFn = options.watch['jsonData.'+item.id] ? options.watch['jsonData.'+item.id] : function(newVal, oldVal){};
				me.options.watch['jsonData.'+item.id] = function(newVal, oldVal) {
					var $inputEl = $('#'+item.id);
					if(newVal && newVal != '' && $inputEl.data().result != newVal) {
						$inputEl.treecombo(true).setValue(newVal);
					}
					cusWatchFn(newVal, oldVal);
				}
			}
		});
	};
	var template = createFormHtml(this.options);
	setPluginWatcher(me.options);
	
	var data = me.options.data();
	data.formItem = me.options.formItem;
	me.options.data = function() {
		return data;
	};
	var ayncFlg = false;
	var formCompObject = {
		props : {
			jsonData: Object
		},
		data : me.options.data,
		template : template,
		mounted : function() {
			this.$form = me.$form = $('#'+me.options.id);
			this.setValidate(me.options);
			this.setPlugin(me.options);
		},
		methods : {
			createFormHtml(options) {
				return createFormHtml.apply(this, [options]);
			},
			setValidate(options) {
				setValidate.apply(this,[options]);
			},
			setPlugin(options){
				setPlugin.apply(this, [options]);
			},
			_submit(data) {
				var me = this;
				$.ajax({
					type : me.ajaxConfig.type,
					url : me.ajaxConfig.url,
					data : data,
					dataType : me.ajaxConfig.dataType,
					success : function(data) {
						this.ajaxConfig.success ? this.ajaxConfig.success.bind(this)(data) : null;
						if(data && data.status == 0) {
							this.resetPluginComponet();
						}
					}.bind(me)
				});
			},
			submit(isValid, data) {
				if(isValid) {
					if(!this.$form.valid()) {
						return;
					}
				}
				data = data ? data : {};
				data.jsonData = JSON.stringify(this.jsonData);
				this._submit(data);
				//重置带扩展插件的控件 
			},
			uploadFile(isValid, data) {
				if(isValid) {
					if(!this.$form.valid()) {
						return;
					}
				}
				this.resetUploadComponent();
				this.extraData = data;
				$.each(this.formItem, (key,item)=>{
					if(item.plugin && item.plugin.name == 'fileinput') {
						var $inputEl = $('#'+item.id);
						if($inputEl.fileinput('getFilesCount') > 0) {
							this.uploadCmpStack[this.uploadCmpCount++] = $inputEl;
						}
					}
				});
				if(this.uploadCmpIndex < this.uploadCmpCount) {
					this.uploadCmpStack[this.uploadCmpIndex++].fileinput('upload');
				}else {
					this.submit(false, this.extraData);
					this.resetUploadComponent();
				}
			},
			uploadFileSuccess(field, data) {
				if(data.success === true){
					this.jsonData[field] = data.data;
					if(this.uploadCmpIndex < this.uploadCmpCount) {
						this.uploadCmpStack[this.uploadCmpIndex++].fileinput('upload');
					}else {
						this.submit(false, this.extraData);
						this.resetUploadComponent();
					}
				}else {
					//this.uploadCmpStack[this.uploadCmpIndex-1].fileinput('cancel');
					//this.resetUploadComponent();
					bdoErrorBox('失败', data.resultInfo.statusText);
					//throw data.resultInfo.statusText;
				}
			},
			resetUploadComponent() {
				this.extraData = null;
				this.uploadCmpCount = 0;
				this.uploadCmpIndex = 0;
				this.uploadCmpStack = [];
			},
			resetPluginComponet() {
				$.each(this.formItem, (key,item)=>{
					if(item.plugin) {
						var $inputEl = $('#'+item.id);
						switch(item.plugin.name) {
						case 'fileinput':
							$inputEl[item.plugin.name]('clear');
							$inputEl[item.plugin.name]('enable');
							break;
						case 'summernote':
							$inputEl[item.plugin.name]('reset');
							break;
						}
					}
				});
			}
		}
	};
	$.extend(true, formCompObject, me);
	$.extend(true, formCompObject, me.options);
	return formCompObject;
};

var VueEditModel = function(options) {
	var form = FormComp(options);
	modalTpl = '<div id="{{modalContainers}}"><div class="modal fade" id="{{id}}" tabindex="-1" role="dialog"'
		+'				aria-hidden="true" data-backdrop="static" data-keyboard="false">'
		+'				<div class="modal-dialog modal-{{size}}">'
		+'					<div class="modal-content">'
		+'						<div class="block block-themed block-transparent remove-margin-b">'
		+'							<div class="block-header bg-info">'
		+'								<ul class="block-options">'
		+'									<li>'
		+'										<button type="button" data-dismiss="modal">'
		+'											<i class="si si-close"></i>'
		+'										</button>'
		+'									</li>'
		+'								</ul>'
		+'								<h3 class="block-title" bdo-model="title">{{title}}</h3>'
		+'							</div>'
		+'						</div>'
		+'						<div class="modal-body" id="{{modalBodyId}}">'
		+'							{{modalBody}}'
		+'						</div>'
		+'					</div>'
		+'				</div>'
		+'			</div></div>';
	var model = {
			
	};
	return new Vue(model);
};
Date.prototype.format = function (fmt) { // author: meizz
	var o = {  
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"H+": this.getHours(), // 小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), // 秒
		"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
		"S": this.getMilliseconds() // 毫秒
	};  
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
	for (var k in o)  
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
	return fmt;  
};
var modalTpl = '<div id="{{modalContainers}}"><div class="modal fade" id="{{id}}" tabindex="-1" role="dialog"'
	+'				aria-hidden="true" data-backdrop="static" data-keyboard="false">'
	+'				<div class="modal-dialog modal-{{size}}">'
	+'					<div class="modal-content">'
	+'						<div class="block block-themed block-transparent remove-margin-b">'
	+'							<div class="block-header bg-info">'
	+'								<ul class="block-options">'
	+'									<li>'
	+'										<button type="button" data-dismiss="modal">'
	+'											<i class="si si-close"></i>'
	+'										</button>'
	+'									</li>'
	+'								</ul>'
	+'								<h3 class="block-title" bdo-model="title">{{title}}</h3>'
	+'							</div>'
	+'						</div>'
	+'						<div class="modal-body" id="{{modalBodyId}}">'
	+'							{{modalBody}}'
	+'						</div>'
	+'					</div>'
	+'				</div>'
	+'			</div></div>';
var formTpl = '<form class="form-horizontal" id="{{formId}}"></form>';
var Dep = function() {
	this.subs = [];
};
Dep.prototype = {
	notify:	function() {
		$.each(this.subs, function(index, sub) {
			sub.update();
		});
	},
	addSub: function(sub) {
		this.subs.push(sub);
	}
};

var Watcher = function(view, node, name, nodeType) {
	Dep.target  = this;
	this.name = name;
	this.node = node;
	this.view = view;
	this.nodeType = nodeType;
	this.update();
	Dep.target = null;
};
Watcher.prototype = {
	update: function() {
		this.get();
		if(this.nodeType == 'text') {
			this.node.nodeValue = this.value;
		}
		if(this.nodeType == 'input') {
			this.node.value = this.value;
		}
	},
	get: function() {
		this.value = this.view[this.name];
	}
};
var compile = function(node, view) {
	var reg = /\{\{(.*)\}\}/;
	if(node.nodeType === 1) {
		var attr = node.attributes;
		for(var i = 0; i < attr.length; i++) {
			if(attr[i].nodeName == 'bdo-model'){
				var name = attr[i].nodeValue;
				node.addEventListener('input', function(e) {
					view[name] = e.target.value;
				});
				node.value = view[name];
				node.removeAttribute('bdo-model');
			}
		}
		new Watcher(view, node, name, 'input');
	}
	if(node.nodeType === 3) {
		if(reg.test(node.nodeValue)){
			var name = RegExp.$1;
			name = name.trim();
			new Watcher(view, node, name, 'text');
		}
	}
};
var nodeToFragment =  function(node, view) {
	//var fragent = document.createDocumentFragment();
	var child;
	var index;
	var nodes = $(node).contents();
	for(var i = 0, len = nodes.length; i < len; i++) {
		if(nodes[i].hasChildNodes()) {
			nodeToFragment(nodes[i], view);
		}
		compile(nodes[i], view);
	}
	return node;
};
var defineReactive = function(obj, key, val) {
	var dep = new Dep();
	Object.defineProperty(obj, key, {
		get : function() {
			if(Dep.target) {
				dep.addSub(Dep.target);
			}
			return val;
		},
		set: function(newVal) {
			if(newVal == val) {return;}
			val = newVal;
			dep.notify();
		} 
	});
};
var observe = function(obj, view) {
	$.each(obj, function(key, val) {
		defineReactive(view, key, val);
	});
};
var View = function(options) {
	this.data = options.data;
	var data = this.data;
	observe(data, this);
	var id = options.el;
	var dom = nodeToFragment($(id+'-containers').find(id)[0], this);
	var fragent = document.createDocumentFragment();
	$(id+'-containers').append(fragent.appendChild(dom));
};
function EditModal(options) {
	window.modalNum = window.modalNum ? window.modalNum++ : 0;
	var modal = {
			id: 'modal'+window.modalNum,
			size: 'md',
			title: '',
			options: {},
			parent: $('body'),
			header: {},
			modalBody: [],// form:{id:,type:,config:}
			template: modalTpl,
			html: '',
			events: {},
			cmp: {},
			mode: {},
			data: {},
			view: null,
			render: function(data) {
				var me = this;
				me.html = me.template;
				me.html = me.html.replace('{{id}}', me.id);
				/*me.html = me.html.replace('{{title}}', me.title);*/
				me.html = me.html.replace('{{size}}', me.size);
				me.html = me.html.replace('{{modalBodyId}}', me.id+'-modalBody');
				me.html = me.html.replace('{{modalContainers}}', me.id+'-containers');
				var bodyHtml = '';
				$.each(me.modalBody,function(index, item){
					if(item.type == 'form'){
						bodyHtml += me.renderForm(item);
					}
				});
				me.html = me.html.replace('{{modalBody}}', bodyHtml);
				me.$parentel.append(me.html);
				$.each(me.modalBody,function(index, item){
					if(item.type == 'form'){
						$('#'+item.id).formview(item.options);
					}
				});
			},
			renderForm: function(form) {
				return formTpl.replace('{{formId}}', form.id);
			},
			eventsBind : function() {
				var me = this;
				me.events = $.extend(true, {}, me.events, me.options.events);
				$.each(me.events, function(key, val) {
					var events = key;
					var eventName = val.split(',')[0];
					var eventFunc = val.split(',')[1];
					me[eventFunc] = me[eventFunc] ? me[eventFunc] : me.options[eventFunc];
					me.$el.on(eventName, key,me[eventFunc].bind(me));
				});
				me.$el.on('show.bs.modal', me.onShowBsModal.bind(me));
				me.$el.on('hidden.bs.modal', me.onHiddenBsModal.bind(me));
			},
			cmpInit : function() {
				var me = this;
				me.$el = $('#'+me.id);
				$.each(me.$el.find('[id]'), function(index, item) {
					var $el = $(item);
					me.cmp[$el.attr('id')] = $el;
					if(item.tagName == 'INPUT' || item.tagName == 'input') {
						me.mode[$el.attr('id')] = $el;
						me.data[$el.attr('id')] = '';
						$el.attr('bdo-model', $el.attr('id'));
					}
				});
				me.view = new View({
					el : '#'+me.id,
					data : $.extend(true, {},{
						id : '#'+me.id,
						title : me.title,
						size : me.size,
					}, me.data)
				});
			},
			onShowBsModal : function(evt){
				var me = this;
				me.$el.draggable({
					handle: '.block-header',
					cursor: 'move'
				});
				me.$el.css('overflow', 'hidden');
			},
			onHiddenBsModal : function(evt) {
				var me = this;
				me.$el.find('input, select, textarea').removeAttr('disabled','disabled');
				me.$el.find('form')[0].reset();
				me.$el.find('form td').removeClass('has-error');
				me.$el.find('form .help-block').remove();
			},
			show : function(data) {
				$.extend(true, this.view, data);
				this.$el.modal('show');
			}
	};
	modal = $.extend(true, {}, modal, options);
	modal.render();
	modal.cmpInit();
	modal.eventsBind();
	return modal;
}
function Page(options) {
	var obj = {
		container : $('body'),
		events : {
		},
		options : options,
		cmp : {},
		mode : {},
		eventsBind : function() {
			var me = this;
			me.events = $.extend(true, {}, me.events, me.options.events);
			$.each(me.events, function(key, val) {
				var events = key;
				var eventName = val.split(',')[0];
				var eventFunc = val.split(',')[1];
				me[eventFunc] = me[eventFunc] ? me[eventFunc] : me.options[eventFunc];
				$(key).on(eventName, me[eventFunc].bind(me));
			});
		},
		cmpInit : function() {
			var me = this;
			$.each(me.container.find('[id]'), function(index, item) {
				var $el = $(item);
				me.cmp[$el.attr('id')] = $el;
				if(item.tagName == 'INPUT' || item.tagName == 'input') {
					me.mode[$el.attr('id')] = $el;
				}
			});
		},
		init : function(options) {
			var me = this;
			obj = $.extend({}, obj, options);
			pageRightTitle(pageTitleArr);
			uiBlocksApi(false, 'init');
		},
		downloadFile: function(url, params) {
			var me = this;
			var form=$('<form>');
			form.attr('style','display:none');
			form.attr('target','body');
			form.attr('method','post');
			form.attr('action',url);
			//form.attr('onsubmit','return false;');
			$.each(params, function(key, value){
				var input=$('<input>');
				input.attr('type','hidden');
				input.attr('name', key);
				if($.isPlainObject(value)) {
					input.attr('value', JSON.stringify(value));
				}else {
					input.attr('value', value);
				}
				form.append(input);
			});
			me.container.append(form);
			form.submit();
			form.remove();
		},
		modals: {},
		subPages: [],
		subPagesInit : function(){
			var me = this;
			$.each(me.subPages, function(index, item) {
				if(item.type = 'modal') {
					item.$parentel = me.$el;
					me.modals[item.id] = new EditModal(item);
				}
			});
		}
	};
	var mainHeight = $('main').height();
	var contentBlockOffsetTop = $('#contentBlock').offset().top;
	
	obj.mainHeight = mainHeight;
	obj.contentBlockTopOffset = contentBlockOffsetTop;
	obj.init(options);
	obj = $.extend(true, {}, obj, options);
	obj.container = obj.options.container ? $(obj.options.container) : obj.container;
	obj.$el = obj.container;
	obj.subPagesInit();
	obj.eventsBind();
	obj.cmpInit();
	obj.init(options);
	return obj;
}
