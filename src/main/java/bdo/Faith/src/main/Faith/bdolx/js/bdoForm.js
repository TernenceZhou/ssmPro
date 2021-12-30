;(function($, window, document, undefined) {

	'use strict';

	var pluginName = 'formview';

	var _default = {};

	_default.settings = {

		// 字段默认值
		item: {

			// 元素展示形式
			colspan: 1,
			rowspan: null,
			createNewRow: false, // 是否追加新的一行
			cellType: 'td', // th
			html: null,
			label: null,
			labelClass: null,

			// 基本表单元素
			type: null, // input textarea select div 暂时只支持这四类元素
			typeAttr: {
//				这里的属性，是html元素原生属性
//				placeholder : null,
//				readonly : null,
//				disabled : null
			},

			// 插件信息
			plugin: {
//				name : 'datepicker',
//				options : {
//					插件自己的属性,该属性会覆盖typeAttr的属性
//					weekStart: 1,
//					clearBtn: true,
//					autoclose: true,
//					language: 'zh-CN',
//					format: 'yyyy-mm-dd',
//					todayHighlight: true
//				}
			},

			// 表单验证
			validate: {
				rules: {
					required: false
				},
				messages: {
					required: '请输入！'
				}
			}
		},

		// 按钮默认配置
		button: {
			id: 'btn',
			text: '按钮',
			style: null,
			icon: 'fa-star'
		},

		ajaxConf: {
			url: null,
			data: {},
			success: function(result) {
			},
			dataType: 'json',
			type: 'post',
			async: false
		},
		showtip: true,
		tip: null,
		style: {},
		buttons: [],
		buttonsAlign: 'right',
		columns: 6,
		display: 'form', // tableform-one tableform-two
		nothing: null

	};

	var Form = function(element, options) {
		var $elFormWrap = $(`<div class="bdo-form-view-wrap"></div>`);
		var $elFormToolsBarWrap = $(`<table class="table bdo-form-view-tools-bar-wrap"></table>`);
		this.$elFormWrap = $elFormWrap;
		this.$elFormToolsBarWrap = $elFormToolsBarWrap;
		this.$element = $(element);
		this.$element.addClass('bdo-form-view');
		this.elementId = element.id;
		this.styleId = this.elementId + '-style';
		this.init(options);
		return {
			options: this.options,
			setAjaxConf: $.proxy(this.setAjaxConf, this),
			init: $.proxy(this.init, this),
			remove: $.proxy(this.remove, this)
		};
	};

	Form.prototype.init = function(options) {
		this.options = $.extend({}, _default.settings, options);
		this.destroy();
		this.render();
		$('#' + this.elementId).closest('.modal-body').css('overflow', 'visible');
	};

	Form.prototype.remove = function() {
		this.destroy();
		$.removeData(this, pluginName);
		$('#' + this.styleId).remove();
	};

	Form.prototype.destroy = function() {
		if (!this.initialized) return;
		this.$wrapper.remove();
		this.$wrapper = null;
		this.$elFormToolsBarWrap.remove();
		this.$elFormWrap.remove();
		this.$elFormToolsBarWrap = null;
		this.$elFormWrap = null;
		this.initialized = false;
	};

	Form.prototype.render = function() {
		if (!this.initialized) {
			this.$element.addClass(pluginName);
			this.$wrapper = $(this.template.table);
			this.initialized = true;
		}
		this.$element.empty();//.append(this.$wrapper.empty());
		this.$elFormToolsBarWrap.appendTo(this.$element);
		this.$elFormWrap.appendTo(this.$element);
		this.$wrapper.appendTo(this.$elFormWrap);
		this.validate();
		this.buildForm();
	};

	Form.prototype.buildForm = function() {
		var _this = this; // 因为each的this和全局this重名覆盖，另需定义一个标识
		_this.$wrapper.css(_this.options.style);
		if (_this.options.display == 'tableform-one') {
			$.each(_this.options.items, function addItems(index, item) {
				item = $.extend({}, _default.settings.item, item);
				var tr = null;
				var td = null;
				if (item.cellType == 'td') {
					td = $(_this.template.td);
				} else {
					td = $(_this.template.th);
				}
				if (item.rowspan) {
					td.attr('rowspan', item.rowspan);
					tr = $(_this.template.tr);
					_this.$wrapper.append(tr);
				} else {
					tr = _this.$wrapper.find('tr:last');
					var tdT = tr.find('td[rowspan]');
					if (tr.length == 0 || (tdT.length > 0 && item.createNewRow)) {
						tr = $(_this.template.tr);
						_this.$wrapper.append(tr);
					}
				}
				if (item.colspan) {
					td.attr('colspan', item.colspan);
				}

				tr.append(td);
				// item type属性值不为空则代表是表单字段
				if (item.type) {
					var component = null;
					var div = $(_this.template.div);
					td.append(div);

					if (item.type == 'input') {
						component = $(_this.template.input);
//						component.css({
//							'overflow': 'hidden',
//							'text-overflow': 'ellipsis',
//							'white-space': 'nowrap'
//						});	
//						component.attr({
//							'data-toggle': 'tooltip',
//							'data-placement': 'top',
//							'data-original-title': null
//						});	
					} else if (item.type == 'textarea') {
						component = $(_this.template.textarea).attr('rows', item.rows ? item.rows : 1);
					} else if (item.type == 'select') {
						component = $(_this.template.select);
					} else if (item.type == 'div') {
						component = $('<div></div>');
					} else if (item.type == 'checkbox') {
						component = $(_this.template.checkbox);
					}
					component.attr('id', item.id)
						.attr('name', item.id);

					for (var key in item.typeAttr) {
						component.attr(key, item.typeAttr[key]);
					}
					if (item.typeAttr.type == 'hidden') {
						tr.remove();
						_this.$element.append(component);
						return true;
					}
					var label = $(_this.template.label)
						.attr('for', item.id)
						.html(item.label);
					var rules = item.validate.rules;
					var messages = item.validate.messages;
					for (var key in rules) {
						_this.$element.validate().settings.rules[component.attr('id')] = rules;
						_this.$element.validate().settings.messages[component.attr('id')] = messages;
					}

					if (item.validate.rules.required) {
						var span = $(_this.template.span);
						label.append(span);
//						td.addClass('require');
						td.addClass('has-success');
					}
					if (item.typeAttr.normal) {
						td.addClass('has-info');
					}

					div.append(component).append(label);
					// item type属性值为空则代表是表格的单元格
				}

//				else{
//					 if(item.html){
//						td.html(item.html);
//					 }
//				}

				if (item.html) {
					if (item.type) {
						component.html(item.html);
					} else {
						td.html(item.html);
					}
				}

				if (item.plugin.name) {
					var pluginNm = item.plugin.name;
					var pluginOpt = item.plugin.options;
					component[pluginNm](pluginOpt);
				}
			});
			if (_this.options.showtip) {
				var tr = $(_this.template.tr);
				var tip = _this.options.tip == null ? $(_this.template.tip) : $(_this.options.tip);
				var td = $(_this.template.td).attr('colspan', _this.options.columns).css({'text-align': _this.options.buttonsAlign});
				$(td).append(tip);
				$(tr).append(td);
				_this.$wrapper.append(tr);
			}
			var buttons = _this.options.buttons;
			if (buttons.length > 0) {
				var $toolsBarTable = $(this.template.table);
				$toolsBarTable.removeClass('table-bordered');
				var tr = $(_this.template.tr);
				var td = $(_this.template.td).attr('colspan', _this.options.columns).css({'text-align': _this.options.buttonsAlign});
				/*if (_this.options.showtip) {
					$(td).append(tip);
				}*/
				$(tr).append(td);
				$toolsBarTable.append(tr);
				_this.$elFormToolsBarWrap.append($toolsBarTable);
				$.each(buttons, function addItems(index, button) {
					button = $.extend({}, _default.settings.button, button);
					var btn = $(_this.template.button);
					btn.attr('id', button.id);
					if (button.icon != null && button.icon != '') {
						var icon = $(_this.template.buttonIcon).addClass(button.icon);
						btn.append(icon);
					}
					if (button.style) {
						btn.addClass(button.style);
					}
					if (button.text) {
						var span = $(_this.template.buttonTextSpan);
						span.html(button.text);
						btn.append(span);
					}
					for (var key in button.typeAttr) {
						btn.attr(key, button.typeAttr[key]);
					}
					$(td).append(btn);
				});
				_this.$elFormWrap.addClass('bdo-form-view-wrap-tools-bar');
			}else {
				_this.$elFormWrap.removeClass('bdo-form-view-wrap-tools-bar');
			}
		} else {
			//TODO 其他表单样式
		}

//		$("#"+ _this.elementId + " td").on('click',function(event){
//			$(this).find('input, textarea').focus();
//		});

	};

	Form.prototype.validate = function() {
		var $mes = this;
		this.$element.validate({
			onblur: true,
			ignore: [],
			errorClass: 'help-block text-right animated fadeInUp',
			errorElement: 'div',
			errorPlacement: function(error, e) {
				$(e).closest('td').append(error);
			},
			highlight: function(e) {
				var elem = $(e);
				elem.closest('td').removeClass('has-error')
					.addClass('has-error');
				elem.closest('.help-block').remove();
			},
			success: function(e) {
				var elem = $(e);
				elem.closest('td').removeClass('has-error');
				elem.closest('.help-block').remove();
			},
			submitHandler: function() {
				$mes.formSubmit();
			},
			rules: {
				'test-one1': {
					digits: true
				}
			},
			messages: {
				'test-one1': {
					digits: '请输入!'
				}
			}
		});
	};

	Form.prototype.formSubmit = function() {
		var _ajaxConf = this.options.ajaxConf;
		if (_ajaxConf.url == null || _ajaxConf.url == '') {
			swal({
				title: '失败',
				text: '提交地址无效！',
				type: 'error',
				timer: 1500
			});
			return;
		}
		$.ajax({
			type: 'post',
			url: _ajaxConf.url,
			data: _ajaxConf.data,
			dataType: _ajaxConf.dataType,
			success: _ajaxConf.success
		});
	};


	Form.prototype.setAjaxConf = function(url, data, dataType, async, success) {
		this.options.ajaxConf.url = url;
		this.options.ajaxConf.data = data;
		this.options.ajaxConf.dataType = dataType;
		this.options.ajaxConf.async = async;
		this.options.ajaxConf.success = success;

	};

	Form.prototype.template = {
		table: '<table class="table "></table>',
		tr: '<tr></tr>',
		th: '<th></th>',
		td: '<td></td>',
		div: '<div class="form-material "></div>',
		label: '<label></label>',
		span: '<span class="necessary">*</span>',
		input: '<input class="form-control" type="text" data-toggle="tooltip" data-placement="top" title="" />',
		button: '<button class="btn" type="button" style="margin-left:10px;" ></button>',
		buttonIcon: '<i class="fa" style="margin-right:8px;"></i></button>',
		buttonTextSpan: '<span></span>',
		checkbox: '<label class="css-input switch switch-success"><input type="checkbox"><span></span></label>',
		select: '<select class="form-control"></select>',
		tip: '<p class="text-muted" style="float: left;letter-spacing: 2px;font-size: 15px;">注:<span class="text-danger" style="margin: 0 5px;">*</span>为必填项。</p>',
		textarea: '<textarea class="form-control" style="resize: none;"></textarea>'
	};


	var logError = function(message) {
		if (window.console) {
			window.console.error(message);
		}
	};

	$.fn[pluginName] = function(options, args) {

		var result;

		this.each(function() {
			var _this = $.data(this, pluginName);
			if (typeof options === 'string') {
				if (!_this) {
					logError('Not initialized, can not call method : ' + options);
				}
				else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
					logError('No such method : ' + options);
				}
				else {
					if (!(args instanceof Array)) {
						args = [args];
					}
					result = _this[options].apply(_this, args);
				}
			}
			else if (typeof options === 'boolean') {
				result = _this;
			}
			else {
				$.data(this, pluginName, new Form(this, $.extend(true, {}, options)));
			}
		});

		return result || this;
	};

})(jQuery, window, document);
