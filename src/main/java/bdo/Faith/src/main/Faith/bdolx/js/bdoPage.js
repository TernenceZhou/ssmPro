/**
 * 从服务器上获取模板
 */
window.tplMap = window.tplMap ? window.tplMap : {};
var tplLoader = function(url) {
	if (window.tplMap[url]) {
		return window.tplMap[url];
	}
	var html = '<div style="width: 100%;height: 100%;"></div>';
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'text',
		async: false,
		success: function(result) {
			html = result;
		}
	});
	window.tplMap[url] = html;
	return html;
};

var utils = {
	isArray: function(agrs) {
		return $.isArray(agrs);
	}
};
template.defaults.imports._utils = utils;
template.defaults.imports.setAttr = function(options) {
	var option = options[0];
	var prefix = options[1];
	var nl = '\n';
	var colon = ':';
	var es = '=';
	var dqm = '\"';
	var point = '.';
	var at = '@';
	var resultString = 'ref=' + dqm + option.id + dqm + nl;
	resultString += 'v-model=' + dqm + 'mode' + point + option.id + point + 'value' + dqm + nl;
	resultString += (/*option.id + */'options' + es + dqm + prefix + dqm + nl);
	$.each(option, function(key, value) {
		resultString += (colon + key + es + dqm + prefix + point + key + dqm + nl);
	});
	return resultString;
};
template.defaults.imports.setEvents = function(options) {
	var option = options[0];
	var prefix = options[1];
	var nl = '\n';
	var colon = ':';
	var es = '=';
	var dqm = '\"';
	var point = '.';
	var at = '@';
	var resultString = '';
	$.each(option, function(key, value) {
		resultString += (at + key + es + dqm + value + dqm + nl);
	});
	return resultString;
};
template.defaults.imports.getInputItemHtml = function(agrs) {
	var resultHtml = '';
	if ($.isArray(agrs[0])) {
		$.each(agrs[0], function(index, value) {
			switch (value.type) {
				case 'text':
					resultHtml += template('./inputTpl', {
						inputOptions: value,
						prefix: 'form.items[' + agrs[1] + '][' + index + ']',
						itemIndex: agrs[1],
						groupItemIndex: index
					});
					break;
				case 'combo':
					resultHtml += template('./comboTpl', {
						inputOptions: value,
						prefix: 'form.items[' + agrs[1] + '][' + index + ']',
						itemIndex: agrs[1],
						groupItemIndex: index
					});
					break;
				case 'treecombo':
					resultHtml += template('./treecomboTpl', {
						inputOptions: value,
						prefix: 'form.items[' + agrs[1] + '][' + index + ']',
						itemIndex: agrs[1],
						groupItemIndex: index
					});
					break;
			}

		});
	} else {
		switch (agrs[0].type) {
			case 'text':
				resultHtml += template('./inputTpl', {
					inputOptions: agrs[0],
					prefix: 'form.items[' + agrs[1] + ']',
					itemIndex: agrs[1],
					groupItemIndex: -1
				});
				break;
			case 'combo':
				resultHtml += template('./comboTpl', {
					inputOptions: agrs[0],
					prefix: 'form.items[' + agrs[1] + ']',
					itemIndex: agrs[1],
					groupItemIndex: -1
				});
				break;
			case 'treecombo':
				resultHtml += template('./treecomboTpl', {
					inputOptions: agrs[0],
					prefix: 'form.items[' + agrs[1] + ']',
					itemIndex: agrs[1],
					groupItemIndex: -1
				});
				break;
		}

	}
	return resultHtml;
};
var componmentTpl = {
	input: tplLoader('bdolx/tpl/form/input.html'),
	combo: tplLoader('bdolx/tpl/form/combo.html'),
	treecombo: tplLoader('bdolx/tpl/form/treecombo.html'),
	form: tplLoader('bdolx/tpl/form/form.html')
};
template('./inputTpl', componmentTpl.input);
template('./comboTpl', componmentTpl.combo);
template('./treecomboTpl', componmentTpl.treecombo);
template('./formTpl', componmentTpl.form);

var FormCreater = function(options) {
	var formDefault_ = {
		setting: {
			form: {
				formId: '',
				items: [],
				immediateUpdate: false,
				immediateUpdateAction(el, item) {
				},
				formClass: ['form-horizontal'],
				addonIconClass: ['fa', 'fa-edit'],
				rowClass: ['form-group', 'has-success']
			},
			input: {
				id: '',
				name: '',
				label: '',
				type: '',
				placeholder: '',
				required: false,
				readonly: false,
				editAble: true,
				disable: false,
				hidden: false,
				value: '',
				events: {},
				parentEvents: {},
				validate: undefined,
				addon: false,
				colClass: ['col-xs-12'],
				typeClass: ['form-material'],
				class: ['form-control']
			},
			combo: {
				id: '',
				name: '',
				label: '',
				type: '',
				placeholder: '',
				required: false,
				readonly: false,
				editAble: true,
				disable: false,
				hidden: false,
				value: '',
				events: {},
				parentEvents: {},
				validate: undefined,
				addon: false,
				colClass: ['col-xs-12'],
				typeClass: ['form-material'],
				class: ['form-control'],
				searchAble: false,
				multiple: false,
				stores: [],
				comboOptionsShow: false,
				url: '',
				params: {},
				selectValue: '',
				selectValues: [],
				mouseoverState: false
			},
			treecombo: {
				id: '',
				name: '',
				label: '',
				type: '',
				placeholder: '',
				required: false,
				readonly: false,
				editAble: true,
				disable: false,
				hidden: false,
				value: '',
				events: {},
				parentEvents: {},
				validate: undefined,
				addon: false,
				colClass: ['col-xs-12'],
				typeClass: ['form-material'],
				class: ['form-control'],
				searchAble: false,
				multiple: false,
				stores: [],
				comboOptionsShow: false,
				url: '',
				params: {},
				selectValue: '',
				selectValues: [],
				mouseoverState: false,
				focusState: false,
				cancelBtnLabel: '取消',
				comfirmBtnLabel: '确定',
				treeview: null,
				treeviewOptions: {
					data: [],
					color: '#555',
					expandIcon: 'fa fa-plus',
					collapseIcon: 'fa fa-minus',
					onhoverColor: '#f9f9f9',
					selectedColor: '#000',
					selectedBackColor: '#f1f1f1',
					showTags: true,
					levels: 1
				},
				treeData: []
			}
		}
	};

	var formComp = {};
	var jsonData = {}
		, form = options
		, mode = {}
		, data = {form: form, mode: mode}
		, computed = {}
		, watch = {}
		, methods = {
		getMode(name) {
			return this.mode[name];
		},
		getItem(el) {
			return this.mode[el.id];
		},
		showAddon(el) {
			var item = this.getItem(el);
			if (this.form.immediateUpdate && item.readonly == true && item.addon == true) {
				item.addonShow = true;
			}
		},
		hideAddon(el) {
			var item = this.getItem(el);
			if (this.form.immediateUpdate && item.addon == true) {
				item.addonShow = false;
			}
		},
		getInputElByAddon(el) {
			var $el = $(el);
			while ($el.data('vrole') != 'type') {
				$el = $el.parent();
			}
			$el = $el.find('[data-vrole="fc"]');
			return $el[0];
		},
		immediateUpdateMouseover(evt) {
			this.showAddon(evt.target);
		},
		immediateUpdateMouseout(evt) {
			this.hideAddon(evt.target);
		},
		immediateUpdateAction(el, item) {
		},
		immediateUpdateBlur(evt) {
			var item = this.getItem(evt.target);

			if (item.readonly == true) {
				return;
			}
			switch (item.type) {
				case 'text':
					this.immediateUpdateAction(evt.target, item);
					item.readonly = true;
					break;
				case 'combo':
					this.comboSelected(null, item);
					break;
				case 'treecombo':
					item.focusState = false;
					this.nodeSelected(null, item);
					break;
			}
		},
		immediateUpdateAddonmouseover(evt) {
			console.log('addonmouseover');
			var $inputEl = this.getInputElByAddon(evt.target);
			this.showAddon($inputEl);
		},
		immediateUpdateAddonmouseout(evt) {
			var $inputEl = this.getInputElByAddon(evt.target);
			this.hideAddon($inputEl);
			switch (this.mode[$inputEl.id].type) {
				case 'text':
					break;
				case 'combo':
					break;
			}
		},
		immediateUpdateAddonclick(evt) {
			var vthis = this;
			var $inputEl = this.getInputElByAddon(evt.target);
			var item = this.getItem($inputEl);
			this.hideAddon($inputEl);
			switch (item.type) {
				case 'text':
					item.readonly = false;
					$inputEl.focus();
					break;
				case 'combo':
					if (item.searchAble == true) {
						item.readonly = false;
					}
					$inputEl.focus();
					item.comboOptionsShow = true;
					break;
				case 'treecombo':
					if (item.searchAble == true) {
						item.readonly = false;
					}
					$inputEl.focus();
					item.focusState = true;
					item.comboOptionsShow = true;
					if (!item.treeview) {
						item.treeviewOptions.data = item.treeData;
						item.treeviewOptions.onNodeSelected = function(evt, node) {
							vthis.nodeSelected(evt, node);
						};
						item.treeview = $(this.$el).find('div[data-vrole-treecombo="tree"]').treeview(item.treeviewOptions);
					}
					this.$nextTick(() => {
						var jqInputEl = $($inputEl);
						var bottomOffset = 262 + jqInputEl.offset().top + jqInputEl.height();
						var jqTreecomboEl = $('.treecombo[data-fc-id=' + item.id + ']');
						if (bottomOffset > $(window).height()) {
							jqTreecomboEl.addClass('top');
							jqTreecomboEl.css('margin-top', -1 * (jqInputEl.height() + 12) + 'px');
						} else {
							jqTreecomboEl.removeClass('top');
							jqTreecomboEl.css('margin-top', '2px');
						}
					});
					break;
			}
		},
		comboSelected(evt, item) {
			if (evt != null) {
				var $option = $(evt.target);
				var comp = $option.data('fcId');

				this.mode[comp].value = $option.attr('label');
				this.mode[comp].selectValue = $option.attr('value');
				this.mode[comp].comboOptionsShow = false;
				this.immediateUpdateAction(evt.target, this.mode[comp]);
			} else {
				if (item.mouseoverState !== true) {
					var store = item.stores.filter((store) => {
						return store.value = item.selectValue;
					});
					item.value = store.label;
					item.selectValue = store.value;
					item.comboOptionsShow = false;
				}
				item.readonly = true;
			}
		},
		hideCombo(comp) {
			this.mode[comp].comboOptionsShow = false;
		},
		comboBlur(evt) {
			hideCombo($(evt.target).data('fcId'));
		},
		comboOptionsMounseover(evt) {
			var compname = $(evt.target).data('fcId');
			if (!compname) {
				compname = $($(evt.target).parents('[data-fc-id]')[0]).data('fcId');
			}
			this.mode[compname].mouseoverState = true;
			console.log($(evt.target).parents('[data-fc-id]')[0]);
			console.log('comboOptionsMounseover:' + this.mode[compname].mouseoverState);
		},
		comboOptionsMounseout(evt) {
			var compname = $(evt.target).data('fcId');
			if (!compname) {
				compname = $($(evt.target).parents('[data-fc-id]')[0]).data('fcId');
			}
			this.mode[compname].mouseoverState = false;
			console.log($(evt.target).parents('[data-fc-id]')[0]);
			console.log('comboOptionsMounseout:' + this.mode[compname].mouseoverState);
		},
		treeBlockBlur(evt) {
			console.log('treeBlockBlur:');
			console.log(evt.target);
			var compname = $(evt.target).data('fcId');
			if (!compname) {
				compname = $($(evt.target).parents('[data-fc-id]')[0]).data('fcId');
			}
			var item = this.mode[compname];
			if (item.focusState === false && item.mouseoverState == false) {
				item.readonly = true;
				item.comboOptionsShow = false;
			}
		},
		treecomboCancel(evt) {
			var comp = $(evt.currentTarget).data('fcId');
			var item = this.mode[comp];
			item.comboOptionsShow = false;
			item.readonly = true;
		},
		treecomboOk(evt) {
			var comp = $(evt.currentTarget).data('fcId');
			var item = this.mode[comp];
			item.comboOptionsShow = false;
			item.readonly = true;
		},
		nodeSelected(evt, node) {
			if (evt != null) {
				var comp = $(evt.currentTarget).data('fcId');
				var item = this.mode[comp];
				item.selectValue = node.value;
				item.value = node.text;

				item.comboOptionsShow = false;
				item.readonly = true;
				this.immediateUpdateAction(evt.target, item);
			} else {
				console.log('nodeSelected:' + node.mouseoverState);
				if (node.mouseoverState !== true) {
					node.comboOptionsShow = false;
					node.readonly = true;
				}
			}
		},
		treeBlockClick(evt) {
			console.log('treeBlockClick:');
			console.log(evt.target);
		}
	};

	var mergeAttribute = function() {
		var setting = formDefault_.setting;
		$.each(setting.form, function(formKey, object) {
			options[formKey] = options[formKey] || object;
		});
	};
	var initMethods = function() {
		$.each(options, function(optionsKey, optionsObject) {
			if ($.isFunction(optionsObject)) {
				methods[optionsKey] = optionsObject;
			}
		});
	};
	var setItemExtrat = function() {
		var this_ = this
			, setting = formDefault_.setting;
		if (this_.type == 'text' ||
			this_.type == 'email' ||
			this_.type == 'hidden' ||
			this_.type == 'password') {

			$.each(setting.input, function(inputKey, inputAttr) {
				this_[inputKey] = this_[inputKey] || inputAttr;
			});
		} else if (this_.type == 'combo') {
			$.each(setting.combo, function(inputKey, inputAttr) {
				this_[inputKey] = this_[inputKey] || inputAttr;
			});
			if (this_.url.length > 0) {
				$.ajax({
					url: this_.url,
					data: this_.params,
					type: 'POST',
					dataType: 'json',
					async: true,
					success: function(result) {
						this_.stores = result.data;
					},
					error: (xhr, textStatus, errorThrown) => {
					}
				});
			}
			this_.initStores = $.merge([], this_.stores);
			if (this_.selectValue && this_.selectValue.length != '') {
				var selectStore = this_.initStores.filter((store) => {
					return store.value == this_.selectValue;
				});
				if (selectStore && selectStore.length == 1) {
					this_.value = selectStore.label;
				}
			}
		} else if (this_.type == 'treecombo') {
			$.each(setting.treecombo, function(inputKey, inputAttr) {
				this_[inputKey] = this_[inputKey] || inputAttr;
			});

			watch['mode.' + this_.id + '.treeData'] = function() {
				this.mode[this_.id].treeviewOptions.data = this.mode[this_.id].treeData;
				this.mode[this_.id].treeview = $(this.$el).find('div[data-vrole-treecombo="tree"]').treeview(this.mode[this_.id].treeviewOptions);
			};

			if (this_.url.length > 0) {
				$.ajax({
					url: this_.url,
					data: this_.params,
					type: 'POST',
					dataType: 'json',
					async: true,
					success: function(result) {
						this_.treeData = result.data;
					},
					error: (xhr, textStatus, errorThrown) => {
					}
				});
			}
			var searchTreeNode = function(nodes, filter) {
				$.each(nodes, (index, node) => {
					if (filter(node)) {
						return node;
					}
					if ($.isArray(node.nodes)) {
						return searchTreeNode(node.nodes, filter);
					}
				});
				return null;
			};
			if (this_.selectValue && this_.selectValue.length != '') {
				var selectStore = searchTreeNode(this_.treeData, (node) => {
					return node.id == this_.selectValue;
				});

				if (selectStore && selectStore.length == 1) {
					this_.value = selectStore.text;
				}
			}
		}

		jsonData[this_.id] = this.value;
		if (this_.type == 'combo') {
			jsonData[this_.id] = this.selectValue;
		}

		mode[this_.id] = this_;

		watch['mode.' + this_.id + '.value'] = function(newValue, oldValue) {
			var vthis = this;
			this_.watch && this_.watch.apply(this, newValue, oldValue);
			// combo搜索
			if (this_.type == 'combo' && this_.searchAble === true) {
				// 从本地获取数据
				var newStores = this_.initStores.filter((store) => {
					return store.label.indexOf(newValue) >= 0;
				});
				// 从服务器端获取数据
				if (newStores.length == 0) {
					if (this_.url.length > 0) {
						this_.params.param8 = newValue;
						$.ajax({
							url: this_.url,
							data: this_.params,
							type: 'POST',
							dataType: 'json',
							async: true,
							success: function(result) {
								newStores.stores = result.data;
							},
							error: (xhr, textStatus, errorThrown) => {
							}
						});
					}
				}
				if (newValue == '' || !newValue) {
					newStores = $.merge(this_.initStores, []);
				}
				this_.stores = newStores;
			}
		};

		if (options.immediateUpdate && this_.addon) {
			if (this_.events['blur']) {
				var fn = function(evt) {
					this_.events['blur'].apply(this, evt);
					this.immediateUpdateBlur(evt);
				};
				methods['immediateUpdateBlur'] = fn;
			}
			if (this_.events['immediateUpdateMouseover']) {
				var fn = function(evt) {
					this_.events['mouseover'].apply(this, evt);
					this.immediateUpdateMouseover(evt);
				};
				methods['immediateUpdateMouseover'] = fn;
			}
			if (this_.events['immediateUpdateMouseout']) {
				var fn = function(evt) {
					this_.events['mouseout'].apply(this, evt);
					this.immediateUpdateMouseout(evt);
				};
				methods['immediateUpdateMouseout'] = fn;
			}
			this_.events['blur'] = 'immediateUpdateBlur';
			this_.events['mouseover'] = 'immediateUpdateMouseover';
			this_.events['mouseout'] = 'immediateUpdateMouseout';
			this_.addonShow = false;
			this_.readonly = true;
		}
	};
	var initItems = function() {
		var imUpdate = options.immediateUpdate;

		$.each(options.items, function(index, value) {
			if ($.isArray(value)) {
				$.each(value, function(iindex, ivalue) {
					setItemExtrat.call(ivalue);
				});
			} else {
				setItemExtrat.call(value);
			}
		});
	};

	var init = function() {
		mergeAttribute();
		initItems();
		initMethods();

		computed['jsonData'] = function() {
			var result = {};
			$.each(this.mode, (key, item) => {
				if (item.type == 'text') {
					result[key] = item.value;
				} else if (item.type == 'combo') {
					if (item.multiple === true) {
						result[key] = item.selectValues;
					} else {
						result[key] = item.selectValue || item.value;
					}
				} else if (item.type == 'treecombo') {
					if (item.multiple === true) {
						result[key] = item.selectValues;
					} else {
						result[key] = item.selectValue || item.value;
					}
				}
			});
			return result;
		};
		formComp.data = function() {
			return data;
		};
		formComp.template = template('./formTpl', {formOption: options, prefix: options.prefix});
		formComp.watch = watch;
		formComp.methods = methods;
		formComp.computed = computed;

		/*console.log(data);
		console.log(formComp.template);
		console.log(formComp);*/
	};

	init();
	return formComp;
};
var BdoForm = function(options) {
	var _form = Vue.extend(FormCreater(options));
	var form = new _form(options.vueOptions);
	form.$mount(options.el);
	return form;
};
/*
var myForm = {
		el: '#formTest',
		formId: 'myForm',
		formClass: ['form-horizontal', 'push-10-t', 'push-10'],
		immediateUpdate: true,
		items: [{
			id: 'id',
			name: 'id',
			label: 'ID',
			type: 'text',
			placeholder: 'Enter ID ...',
			rowClass: ['form-group'],
			colClass: ['col-xs-12'],
			typeClass: ['form-material', 'input-group'],
			class: ['form-control'],
			readonly: true,
			value: '',
			events: {},
			parentEvents: {
			},
			addon: true
		},{
			id: 'name',
			name: 'name',
			type: 'text',
			label: 'Name',
			placeholder: 'Enter name ..',
			rowClass: ['form-group'],
			colClass: ['col-xs-12'],
			typeClass: ['form-material'],
			class: ['form-control'],
			readonly: false,
			value: '',
			events: {},
			parentEvents: {},
			addon: true
		},[
			{
				id: 'gid',
				name: 'gid',
				label: 'gID',
				type: 'text',
				placeholder: 'Enter ID ...',
				rowClass: ['form-group'],
				colClass: ['col-xs-6'],
				typeClass: ['form-material'],
				class: ['form-control'],
				readonly: true,
				value: '',
				events: {},
				parentEvents: {
				},
				addon: true
			},
			{
				id: 'gname',
				name: 'gname',
				label: 'gname',
				type: 'text',
				placeholder: 'Enter  ...',
				rowClass: ['form-group'],
				colClass: ['col-xs-6'],
				typeClass: ['form-material'],
				class: ['form-control'],
				readonly: true,
				value: '',
				events: {},
				parentEvents: {
				},
				addon: true
			}
		],{
			id: 'combotest',
			name: 'combotest',
			type: 'combo',
			label: 'Combotestame',
			placeholder: '',
			rowClass: ['form-group'],
			colClass: ['col-xs-12'],
			typeClass: ['form-material'],
			class: ['form-control'],
			readonly: false,
			value: '',
			events: {},
			parentEvents: {},
			addon: true,
			searchAble: true,
			stores: [{
				value: '1',
				label: 'option1'
			},{
				value: '2',
				label: 'option2'
			}]
		},{
			id: 'treecombotest',
			name: 'treecombotest',
			type: 'treecombo',
			label: 'treecombotest',
			placeholder: '',
			rowClass: ['form-group'],
			colClass: ['col-xs-12'],
			typeClass: ['form-material'],
			class: ['form-control'],
			readonly: false,
			value: '',
			events: {},
			parentEvents: {},
			addon: true,
			searchAble: true,
			treeData: $treeData
		}],
		immediateUpdateAction(el, item){
			var param = {};
			param[item.id] = this.jsonData[item.id];
			param['id'] = this.jsonData.id;
			console.log(param);
		}
};
var form = new BdoForm(myForm);
console.log(form.jsonData);*/
/**
 * 创建表单
 */
var FormComp = function(options) {
	var me = this;
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
			typeAttr: { // html 属性
			},
			// 插件信息
			plugin: {},
			// 表单验证
			validate: {
				rules: {
					required: false
				},
				messages: {
					required: '请输入！'
				}
			},
			show: true
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
	me.options = $.extend({}, _default.settings, options);
	//$form.attr('id', options.id);
	var formTpl = {
		table: '<table class="table"></table>',
		tr: '<tr></tr>',
		th: '<th></th>',
		td: '<td></td>',
		div: '<div class="form-material "></div>',
		label: '<label></label>',
		span: '<span class="necessary">*</span>',
		input: '<input class="form-control" type="text" data-toggle="tooltip" data-placement="top" title="" autocomplete="off" />',
		file: '<input class="form-control" type="file" data-toggle="tooltip" data-placement="top" title="" class="file"/>',
		button: '<button class="btn" type="button" style="margin-left:10px;" ></button>',
		buttonIcon: '<i class="fa" style="margin-right:8px;"></i></button>',
		buttonTextSpan: '<span></span>',
		checkbox: '<label class="css-input css-checkbox css-checkbox-primary"><input type="checkbox"><span></span></label>',
		select: '<select class="form-control"></select>',
		// tip: '<p class="text-muted" style="float: left;letter-spacing: 2px;font-size: 15px;">注:<span class="text-danger" style="margin: 0 5px;">*</span>为必填项。</p>',
		textarea: '<textarea class="form-control" style="resize: none;"></textarea>'
	};
	var createFormHtml = function(options) {
		//debugger;
		var $container = $('<div></div>');
		var $form = $(`<form class="form-horizontal vm-form" :json-data="jsonData">
						<!--<div class="vm-form-tools-bar"></div>-->
						<table class="table vm-form-tools-bar"></table>
						<div class="vm-form-table-wrapper vm-form-table-wrapper-tools-bar">
							<table class="table"></table>
						</div>
					</form>`);
		var $formToolsBarDiv = $('.vm-form-tools-bar', $form);
		var $formTableDiv = $('.vm-form-table-wrapper', $form);
		var $wrapper = $('.table', $formTableDiv);

		if (options.bordered) {
			$wrapper.addClass('table-bordered');
		} else {
			$wrapper.addClass('form-table');
		}
		$form.attr('id', options.id);
		$wrapper.css(options.style);
		if (options.display == 'tableform-one') {
			me.options.formItem = {};
			$.each(options.items, (index, item) => {
				item = $.extend(true, {}, _default.settings.item, item);
				item.readonly = item.readonly || false;
				me.options.formItem[item.id] = item;
				var tr = null;
				var td = null;
				if (item.cellType == 'td') {
					td = $(formTpl.td);
				} else {
					td = $(formTple.th);
				}
				if (item.rowspan) {
					td.attr('rowspan', item.rowspan);
					tr = $(formTpl.tr);
					$wrapper.append(tr);
				} else {
					tr = $wrapper.find('tr:last');
					var tdT = tr.find('td[rowspan]');
					if (tr.length == 0 || (tdT.length > 0 && item.createNewRow)) {
						tr = $(formTpl.tr);
						$wrapper.append(tr);
					}
				}
				var tdwidth = 100;
				if (item.colspan) {
					td.attr('colspan', item.colspan);
					//td.attr('v-if', 'formItem.'+item.id+'.show');
					td.attr('v-show', 'formItem.' + item.id + '.show');
					tdwidth = 100 * (item.colspan / options.column);
				}
				td.attr('v-show', 'formItem.' + item.id + '.show');
				td.css('width', tdwidth + '%');
				tr.append(td);
				tr.attr('ref', item.id + 'Row');

				td.attr('ref', item.id + 'Col');
				if (item.type) {
					var component = null;
					var div = $(formTpl.div);
					div.attr('ref', item.id + 'Cell');
					td.append(div);
					if (item.type == 'input' || item.type == 'treecombo' || item.type == 'hidden') {
						component = $(formTpl.input);
					} else if (item.type == 'file') {
						component = $(formTpl.file);
					} else if (item.type == 'textarea') {
						component = $(formTpl.textarea).attr('rows', item.rows ? item.rows : 1);
					} else if (item.type == 'select' || item.type == 'combo') {
						component = $(formTpl.select);
					} else if (item.type == 'div') {
						component = $('<div></div>');
					} else if (item.type == 'checkbox') {
						component = $(formTpl.checkbox);
					} else if (item.type == 'button') {
						var button = $.extend({}, _default.settings.button, button);
						component = $(formTpl.button);
						if (button.icon != null && button.icon != '') {
							var icon = $(formTpl.buttonIcon).addClass(button.icon);
							component.append(icon);
						}
						if (button.style) {
							component.addClass(button.style);
						}
						if (button.text) {
							var span = $(formTpl.buttonTextSpan);
							component.html(button.text);
							component.append(span);
						}
					}
					if (item.type == 'checkbox') {
						component.find('input').attr('id', item.id)
							.attr('name', item.id)
							.attr('ref', item.id);
					} else {
						component.attr('id', item.id)
							.attr('name', item.id)
							.attr('ref', item.id);
					}
					for (var key in item.typeAttr) {
						var key_ = key;
						if (typeof key_ === 'string') {
							if (key_.startsWith(':')) {
								key_ = 'v-bind' + key_;
							} else if (key_.startsWith('@')) {
								key_ = key_.replace('@', 'v-on:');
							}
						}
						component.attr(key_, item.typeAttr[key]);
					}
					if (item.type == 'input' || item.type == 'textarea' || item.type == 'checkbox') {
						if (item.typeAttr && item.typeAttr.html == true) {
							component.attr('v-html', 'jsonData.' + item.id);
						} else {
							if (item.type == 'checkbox') {
								component.find('input').attr('v-model', 'jsonData.' + item.id);
							} else {
								component.attr('v-model', 'jsonData.' + item.id);
							}
						}
					}

					if (item.type == 'combo') {
						component.attr('v-on:change', 'onComboChange');
					}
					if (item.type == 'treecombo') {
						component.attr('v-on:change', 'onTreecomboChange');
					}
					component.attr('v-bind:dataValue', 'jsonData.' + item.id);
					if (item.typeAttr.type == 'hidden') {
						tr.remove();
						$form.append(component);
						return true;
					}
					var label = $(formTpl.label)
						.attr('for', item.id)
						.html(item.label);
					if (item.validate.rules.required) {
						var span = $(formTpl.span);
						label.append(span);
						td.addClass('has-success');
					}
					if (item.typeAttr.normal) {
						td.addClass('has-info');
					}
					/*if(item.plugin && item.plugin.name) {
						component.attr('v-bind:'+item.id+item.plugin.name+'Options', item.id+item.plugin.name+'Options');
					}*/

					div.append(component);
					if (item.type != 'checkbox') {
						div.append(label);
					} else {
						component.append(item.label);
					}
				}

				if (item.html) {
					if (item.type) {
						component.html(item.html);
					} else {
						td.html(item.html);
					}
				}
			});
			if (options.showtip) {
				var tip = options.tip == null ? $(formTpl.tip) : $(options.tip);
				var tr = $(formTpl.tr);
				var td2 = $(formTpl.td).attr('colspan', options.columns).css({'text-align': options.buttonsAlign, 'border-top': 'none'});
				$(td2).append(tip);
				$(tr).append(td2);
				$wrapper.append(tr);
			}
			var buttons = options.buttons;
			if (buttons.length > 0) {
				var tr = $(formTpl.tr);
				var tip = options.tip == null ? $(formTpl.tip) : $(options.tip);
				var td = $(formTpl.td).attr('colspan', options.columns).css({'text-align': options.buttonsAlign, 'border-top': 'none'});
				$(tr).append(td);
				//$wrapper.append(tr);
				$formToolsBarDiv.append(tr);
				$.each(buttons, (index, button) => {
					button = $.extend({}, _default.settings.button, button);
					var btn = $(formTpl.button);
					btn.attr('id', button.id);
					if (button.icon != null && button.icon != '') {
						var icon = $(formTpl.buttonIcon).addClass(button.icon);
						btn.append(icon);
					}
					if (button.style) {
						btn.addClass(button.style);
					}
					if (button.text) {
						var span = $(formTpl.buttonTextSpan);
						span.html(button.text);
						btn.append(span);
					}
					for (var key in button.typeAttr) {
						btn.attr(key, button.typeAttr[key]);
					}
					$(td).append(btn);
				});
			}else {
				$formToolsBarDiv.hide();
				$formTableDiv.removeClass('vm-form-table-wrapper-tools-bar');
			}
		}
		//$form.append($wrapper);
		$container.append($form);
		var result = $container.html();
		$container.remove();
		return result;
	};
	var setValidate = function(options) {
		me.$form.validate({
			onblur: true,
			ignore: [],
			errorClass: 'help-block text-right animated fadeInUp',
			errorElement: 'div',
			errorPlacement: function(error, e) {
				$(e).closest('td').append(error);
			},
			highlight: function(e) {
				/*if(e.id == 'userIndex') {
					debugger;
				}*/
				let elem = $(e);
				let $td = elem.closest('td');
				let errorStack = $td.data('errorStack');
				if ($td.hasClass('has-error')) {
					errorStack++;
				} else {
					if (errorStack == undefined || errorStack == null || errorStack < 0) {
						errorStack = 1;
					}
					$td.addClass('has-error');
				}
				$td.data('errorStack', errorStack);
			},
			success: function(e) {
				/*if(e.id == 'userIndex') {
					debugger;
				}*/
				let elem = $(e);
				let $td = elem.closest('td');
				let errorStack = $td.data('errorStack');
				if (errorStack == undefined || errorStack == null || errorStack < 0) {
					errorStack = 0;
				}
				if (errorStack == 0) {
					elem.closest('td').removeClass('has-error');
					elem.closest('.help-block').remove();
				}
				errorStack--;
				elem.closest('td').data('errorStack', errorStack);
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
		$.each(options.items, (index, item) => {
			if (item.validate) {
				var rules = item.validate.rules;
				var messages = item.validate.messages;
				for (var key in rules) {
					me.$form.validate().settings.rules[item.id] = rules;
					me.$form.validate().settings.messages[item.id] = messages;
				}
			}
			if (item.html) {
				let div = $('<div>' + item.html + '</div>');
				$.each($('<div>' + item.html + '</div>').find('[valid]'), (insindex, el) => {
					if (item.validate) {
						var rules = item.validate[$(el).attr('valid')].rules;
						var messages = item.validate[$(el).attr('valid')].messages;
						for (var key in rules) {
							if (el.id != item.id) {
								console.log(el.id);
								me.$form.validate().settings.rules[el.id] = rules;
								me.$form.validate().settings.messages[el.id] = messages;
							}
						}
					}
				});
				div.remove();
			}
		});
	};
	var setPlugin = function(options) {
		var $this = this;
		$.each(options.items, (index, item) => {
			if (item.plugin && item.plugin.name) {
				var pluginObject = item.plugin;
				var pluginNm = item.plugin.name;
				var pluginOpt = item.plugin.options;
				var $el = $this.$form.find('#' + item.id);
				/*** **/
				if (pluginNm == 'summernote') {
					pluginOpt.callbacks = $.extend({}, pluginOpt.callbacks, {
						onChange: $.proxy(function(contents, $editable) {
							//console.log('onChange:\n'+$el.summernote('code'));
							this.jsonData[item.id] = contents;
						}, $this),
						onFocusin: $.proxy(function(evt) {
							evt.preventDefault();
							evt.stopPropagation();
							//console.log('onFocusin:\n'+$el.summernote('code'));
							//this.jsonData[item.id] = $el.summernote('code');
							$el.trigger('focusin');
						}, $this),
						onFocusout: $.proxy(function(evt) {
							evt.preventDefault();
							evt.stopPropagation();
							//console.log('onFocusout:\n'+$el.summernote('code'));
							//this.jsonData[item.id] = $el.summernote('code');
							$el.trigger('focusout');
						}, $this),
						onKeyup: $.proxy(function(evt) {
							//console.log('onKeyup:\n'+$el.summernote('code'));
							this.jsonData[item.id] = $el.summernote('code');
						}, $this),
						onKeydown: $.proxy(function(we, evt) {
							//console.log('onKeydown:\n'+$el.summernote('code'));
							this.jsonData[item.id] = $el.summernote('code');
						}, $this),
						onInit: $.proxy(function(we, evt) {
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
				if (pluginNm == 'fileinput') {
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
						showClose: false,
						uploadAsync: false,
						showCancel: false,
						hideThumbnailContent: true,
						layoutTemplates: {
							actionUpload: '',
							actionZoom: ''
						},
						fileActionSettings: {
							removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
						},
						uploadAsync: false
					});
				}
				if (pluginNm == 'treecombo') {
					var callback = pluginOpt.nodeSelectedCallback || function(tree, data) {
					};
					pluginOpt.nodeSelectedCallback = $.proxy(function(tree, data) {
						this.jsonData[item.id] = data.result;
						callback.apply(this, [tree, data]);
					}, $this);
				}
				if (pluginNm == 'combo') {
					/*$el.addClass('selectpicker');
					$el.selectpicker(pluginOpt);*/
					var stores = (typeof pluginObject.stores == 'function' ? pluginObject.stores() : pluginObject.stores);
					$el.empty();
					if (pluginOpt.existBlank) {
						$el.append('<option></option>');
					}
					$.each(stores, (index, object) => {
						$el.append('<option value="' + object.value + '">' + object.label + '</option>');
					});
					$el.addClass('selectpicker');
					$el.selectpicker(pluginOpt);
					if (item.value && item.value != '') {
						if (item.typeAttr && item.typeAttr.multiple == true) {
							if ($.isArray(item.value)) {
								$el.selectpicker('val', item.value);
							} else {
								$el.selectpicker('val', item.value.split(','));
							}
						} else {
							$el.selectpicker('val', item.value);
						}
					}
					$el.selectpicker('refresh');
				}
				/*** **/
				if (pluginNm != 'combo') {
					$el[pluginNm](pluginOpt);
				}

				if (pluginNm == 'treecombo' || pluginNm == 'tree') {
					me[item.id + item.plugin.name + 'Options'] = $el[pluginNm](true).options;
				}

				/*** **/
				if (pluginNm == 'fileinput') {
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
						/*console.log('fileuploaderror:');
						console.log(msg);*/
						this.uploadFileSuccess(item.id, data.response);
					}, $this));
					$el.on('filebatchuploaderror', $.proxy(function(event, data, msg) {
						/*console.log('filebatchuploaderror:');
						console.log(msg);*/
						this.uploadFileSuccess(item.id, data.response);
					}, $this));
				}
			}
		});
	};

	var setPluginWatcher = function(options) {
		me.options.watch = me.options.watch ? me.options.watch : {};
		$.each(options.items, (index, item) => {
			var $el = $('#' + item.id);
			if (item.plugin) {
				if (item.plugin && item.plugin.name == 'summernote') {
					var cusWatchFn = options.watch['jsonData.' + item.id] ? options.watch['jsonData.' + item.id] : function(newVal, oldVal) {
					};
					me.options.watch['jsonData.' + item.id] = function(newVal, oldVal) {
						var $inputEl = $('#' + item.id);
						if ($inputEl.summernote('code') != newVal) {
							$inputEl.summernote('code', newVal);
						}
						if (newVal == '') {
							$inputEl.summernote('code', newVal);
							$inputEl.summernote('reset');
						}
						cusWatchFn(newVal, oldVal);
					};
				}
				if (item.plugin && item.plugin.name == 'treecombo') {
					var cusWatchFn = options.watch['jsonData.' + item.id] ? options.watch['jsonData.' + item.id] : function(newVal, oldVal) {
					};
					me.options.watch['jsonData.' + item.id] = function(newVal, oldVal) {
						var $inputEl = $('#' + item.id);
						if (newVal && newVal != '' && $inputEl.data().result != newVal) {
							$inputEl.treecombo(true).setValue(newVal);
						} else {
							if (!(newVal && newVal != '')) {
								$inputEl.treecombo(true).setValue(null);
							}
						}
						cusWatchFn(newVal, oldVal);
					};
				}
				// readonly

				if (item.plugin && item.plugin.name == 'combo') {
					me.options.watch['formItem.' + item.id + '.readonly'] = function(newVal, oldVal) {
						var $inputEl = $('#' + item.id);
						$inputEl.prop('disabled', newVal);
						$inputEl.selectpicker('refresh');
					};
					var cusWatchFn = options.watch['jsonData.' + item.id] ? options.watch['jsonData.' + item.id] : function(newVal, oldVal) {
					};

					me.options.watch['jsonData.' + item.id] = function(newVal, oldVal) {
						var $inputEl = $('#' + item.id);
						var selectval;
						if (newVal && newVal != '') {
							if (item.typeAttr && item.typeAttr.multiple == true) {
								if ($.isArray(newVal)) {
									selectval = newVal;
								} else {
									selectval = newVal.split(',');
								}
							} else {
								selectval = newVal;
							}
							if (item.typeAttr && item.typeAttr.multiple == true) {
								if (!$inputEl.val() || newVal != $inputEl.val().join(',')) {
									$inputEl.selectpicker('val', selectval);
								}
							} else {
								if (newVal != $inputEl.val()) {
									$inputEl.selectpicker('val', selectval);
								}
							}
						} else {
							$inputEl.selectpicker('val', newVal);
						}
						$inputEl.selectpicker('refresh');
						cusWatchFn.call(this, newVal, oldVal);
					};
					me.options.watch['formItem.' + item.id + '.plugin.stores'] = function(newVal) {
						let stores = (typeof newVal == 'function' ? newVal() : newVal);
						let pluginOpt = this.formItem[item.id].plugin.options;
						let $el_ = $('#' + item.id);
						$el_.empty();
						if (pluginOpt.existBlank) {
							$el_.append('<option></option>');
						}
						$.each(stores, (index, object) => {
							$el_.append('<option value="' + object.value + '">' + object.label + '</option>');
						});
						$el_.selectpicker('refresh');
					};
				}

				if (item.plugin && item.plugin.name == 'fileinput') {
					me.options.watch['formItem.' + item.id + '.readonly'] = function(newVal, oldVal) {
						var $inputEl = $('#' + item.id);
						if (newVal) {
							$inputEl.fileinput('disable');
						} else {
							$inputEl.fileinput('clear');
							$inputEl.fileinput('enable');
						}
					};
				}
			}
		});
	};
	var inputListener = function() {
		var me = this;
		$.each(me.jsonData, (key, value) => {
			if (me.formItem[key] && !me.formItem[key].plugin) {
				$el.on('input', (event) => {

				});
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
		props: {
			jsonData: Object
		},
		data: me.options.data,
		template: template,
		mounted: function() {
			this.$form = me.$form = $('#' + me.options.id);
			this.setValidate(me.options);
			this.setPlugin(me.options);
			this.setDefaultValue(me.options);
		},
		methods: {
			createFormHtml(options) {
				return createFormHtml.apply(this, [options]);
			},
			setValidate(options) {
				setValidate.apply(this, [options]);
			},
			setPlugin(options) {
				setPlugin.apply(this, [options]);
			},
			setDefaultValue(options) {
				var vmthis = this;
				$.each(this.formItem, (key, value) => {
					if (value.type == 'combo') {
						if (vmthis.jsonData[key] && vmthis.jsonData[key] != '') {
							$(vmthis.$el).find('#' + key).selectpicker('val', vmthis.jsonData[key]);
						} else {
							vmthis.jsonData[key] = $(vmthis.$el).find('#' + key).val();
						}
					}
				});
				//setDefaultValue.apply(this, [options]);
			},
			_submit(data) {
				var me = this;
				$.ajax({
					type: me.ajaxConfig.type,
					url: me.ajaxConfig.url,
					data: data,
					async: false,
					dataType: me.ajaxConfig.dataType,
					success: function(data) {
						this.ajaxConfig.success ? this.ajaxConfig.success.bind(this)(data) : null;
						/*if(data && data.success == true) {
							this.resetPluginComponet();
						}*/
						this.resetPluginComponet();
					}.bind(me)
				});
			},
			submit(isValid, data) {
				if (isValid) {
					if (!this.$form.valid()) {
						return;
					}
				}
				data = data ? data : {};
				data.jsonData && typeof data.jsonData != 'string' && (data.jsonData = JSON.stringify(data.jsonData));
				data.jsonData || (data.jsonData = JSON.stringify(this.jsonData));
				this._submit(data);
				//重置带扩展插件的控件 
				//this.resetPluginComponet();
			},
			uploadFile(isValid, data) {
				if (isValid) {
					if (!this.$form.valid()) {
						return;
					}
				}
				this.resetUploadComponent();
				this.extraData = data;
				if (this.extraData && this.extraData.jsonData && typeof this.extraData.jsonData === 'string') {
					this.extraData.jsonData = JSON.parse(this.extraData.jsonData);
				}
				$.each(this.formItem, (key, item) => {
					if (item.plugin && item.plugin.name == 'fileinput') {
						var $inputEl = $('#' + item.id);
						if ($inputEl.fileinput('getFilesCount') > 0) {
							this.uploadCmpStack[this.uploadCmpCount++] = $inputEl;
						}
					}
				});
				if (this.uploadCmpIndex < this.uploadCmpCount) {
					this.uploadCmpStack[this.uploadCmpIndex++].fileinput('upload');
				} else {
					this.submit(false, this.extraData);
					this.resetUploadComponent();
				}
			},
			uploadFileSuccess(field, data) {
				if (data.success === true) {
					this.jsonData[field] = data.data;
					if (this.extraData && this.extraData.jsonData) {
						this.extraData.jsonData[field] = data.data;
					}
					if (this.uploadCmpIndex < this.uploadCmpCount) {
						this.uploadCmpStack[this.uploadCmpIndex++].fileinput('upload');
					} else {
						this.submit(false, this.extraData);
						this.resetUploadComponent();
					}
				} else {
					//this.uploadCmpStack[this.uploadCmpIndex-1].fileinput('cancel');
					//this.resetUploadComponent();
					if (data.resultInfo) {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
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
				$.each(this.formItem, (key, item) => {
					if (item.plugin) {
						var $inputEl = $('#' + item.id);
						switch (item.plugin.name) {
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
			},
			setAllReadonly(isReadonly) {
				$.each(this.formItem, (key, value) => {
					value.readonly = isReadonly;
				});
			},
			onComboChange(event) {
				var $inputEl = $(event.currentTarget);
				var selectval = $inputEl.val();
				if ($.isArray(selectval)) {
					this.jsonData[event.currentTarget.id] = selectval.join(',');
				} else {
					this.jsonData[event.currentTarget.id] = selectval;
				}
			},
			onTreecomboChange(event) {
				var $inputEl = $(event.currentTarget);
				var selectval = $inputEl.val();
				if (!selectval || selectval == '') {
					this.jsonData[event.currentTarget.id] = selectval;
				}
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
		+ '				aria-hidden="true" data-backdrop="static" data-keyboard="false">'
		+ '				<div class="modal-dialog modal-{{size}}">'
		+ '					<div class="modal-content">'
		+ '						<div class="block block-themed block-transparent remove-margin-b">'
		+ '							<div class="block-header bg-info">'
		+ '								<ul class="block-options">'
		+ '									<li>'
		+ '										<button type="button" data-dismiss="modal">'
		+ '											<i class="si si-close"></i>'
		+ '										</button>'
		+ '									</li>'
		+ '								</ul>'
		+ '								<h3 class="block-title" bdo-model="title">{{title}}</h3>'
		+ '							</div>'
		+ '						</div>'
		+ '						<div class="modal-body" id="{{modalBodyId}}">'
		+ '							{{modalBody}}'
		+ '						</div>'
		+ '					</div>'
		+ '				</div>'
		+ '			</div></div>';
	var model = {};
	return new Vue(model);
};
Date.prototype.format = function(fmt) { // author: meizz
	var o = {
		'M+': this.getMonth() + 1, // 月份
		'd+': this.getDate(), // 日
		'H+': this.getHours(), // 小时
		'm+': this.getMinutes(), // 分
		's+': this.getSeconds(), // 秒
		'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
		'S': this.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
	return fmt;
};
var modalTpl = '<div id="{{modalContainers}}"><div class="modal fade" id="{{id}}" tabindex="-1" role="dialog"'
	+ '				aria-hidden="true" data-backdrop="static" data-keyboard="false">'
	+ '				<div class="modal-dialog modal-{{size}}">'
	+ '					<div class="modal-content">'
	+ '						<div class="block block-themed block-transparent remove-margin-b">'
	+ '							<div class="block-header bg-info">'
	+ '								<ul class="block-options">'
	+ '									<li>'
	+ '										<button type="button" data-dismiss="modal">'
	+ '											<i class="si si-close"></i>'
	+ '										</button>'
	+ '									</li>'
	+ '								</ul>'
	+ '								<h3 class="block-title" bdo-model="title">{{title}}</h3>'
	+ '							</div>'
	+ '						</div>'
	+ '						<div class="modal-body" id="{{modalBodyId}}">'
	+ '							{{modalBody}}'
	+ '						</div>'
	+ '					</div>'
	+ '				</div>'
	+ '			</div></div>';
var formTpl = '<form class="form-horizontal" id="{{formId}}"></form>';
var Dep = function() {
	this.subs = [];
};
Dep.prototype = {
	notify: function() {
		$.each(this.subs, function(index, sub) {
			sub.update();
		});
	},
	addSub: function(sub) {
		this.subs.push(sub);
	}
};

var Watcher = function(view, node, name, nodeType) {
	Dep.target = this;
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
		if (this.nodeType == 'text') {
			this.node.nodeValue = this.value;
		}
		if (this.nodeType == 'input') {
			this.node.value = this.value;
		}
	},
	get: function() {
		this.value = this.view[this.name];
	}
};
var compile = function(node, view) {
	var reg = /\{\{(.*)\}\}/;
	if (node.nodeType === 1) {
		var attr = node.attributes;
		for (var i = 0; i < attr.length; i++) {
			if (attr[i].nodeName == 'bdo-model') {
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
	if (node.nodeType === 3) {
		if (reg.test(node.nodeValue)) {
			var name = RegExp.$1;
			name = name.trim();
			new Watcher(view, node, name, 'text');
		}
	}
};
var nodeToFragment = function(node, view) {
	//var fragent = document.createDocumentFragment();
	var child;
	var index;
	var nodes = $(node).contents();
	for (var i = 0, len = nodes.length; i < len; i++) {
		if (nodes[i].hasChildNodes()) {
			nodeToFragment(nodes[i], view);
		}
		compile(nodes[i], view);
	}
	return node;
};
var defineReactive = function(obj, key, val) {
	var dep = new Dep();
	Object.defineProperty(obj, key, {
		get: function() {
			if (Dep.target) {
				dep.addSub(Dep.target);
			}
			return val;
		},
		set: function(newVal) {
			if (newVal == val) {
				return;
			}
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
	var dom = nodeToFragment($(id + '-containers').find(id)[0], this);
	var fragent = document.createDocumentFragment();
	$(id + '-containers').append(fragent.appendChild(dom));
};

function EditModal(options) {
	window.modalNum = window.modalNum ? window.modalNum++ : 0;
	var modal = {
		id: 'modal' + window.modalNum,
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
			me.html = me.html.replace('{{modalBodyId}}', me.id + '-modalBody');
			me.html = me.html.replace('{{modalContainers}}', me.id + '-containers');
			var bodyHtml = '';
			$.each(me.modalBody, function(index, item) {
				if (item.type == 'form') {
					bodyHtml += me.renderForm(item);
				}
			});
			me.html = me.html.replace('{{modalBody}}', bodyHtml);
			me.$parentel.append(me.html);
			$.each(me.modalBody, function(index, item) {
				if (item.type == 'form') {
					$('#' + item.id).formview(item.options);
				}
			});
		},
		renderForm: function(form) {
			return formTpl.replace('{{formId}}', form.id);
		},
		eventsBind: function() {
			var me = this;
			me.events = $.extend(true, {}, me.events, me.options.events);
			$.each(me.events, function(key, val) {
				var events = key;
				var eventName = val.split(',')[0];
				var eventFunc = val.split(',')[1];
				me[eventFunc] = me[eventFunc] ? me[eventFunc] : me.options[eventFunc];
				me.$el.on(eventName, key, me[eventFunc].bind(me));
			});
			me.$el.on('show.bs.modal', me.onShowBsModal.bind(me));
			me.$el.on('hidden.bs.modal', me.onHiddenBsModal.bind(me));
		},
		cmpInit: function() {
			var me = this;
			me.$el = $('#' + me.id);
			$.each(me.$el.find('[id]'), function(index, item) {
				var $el = $(item);
				me.cmp[$el.attr('id')] = $el;
				if (item.tagName == 'INPUT' || item.tagName == 'input') {
					me.mode[$el.attr('id')] = $el;
					me.data[$el.attr('id')] = '';
					$el.attr('bdo-model', $el.attr('id'));
				}
			});

			me.view = new View({
				el: '#' + me.id,
				data: $.extend(true, {}, {
					id: '#' + me.id,
					title: me.title,
					size: me.size
				}, me.data)
			});


		},
		onShowBsModal: function(evt) {
			var me = this;
			me.$el.draggable({
				handle: '.block-header',
				cursor: 'move'
			});
			me.$el.css('overflow', 'hidden');
		},
		onHiddenBsModal: function(evt) {
			var me = this;
			me.$el.find('input, select, textarea').removeAttr('disabled', 'disabled');
			me.$el.find('form')[0].reset();
			me.$el.find('form td').removeClass('has-error');
			me.$el.find('form .help-block').remove();
		},
		show: function(data) {
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
		container: $('body'),
		events: {},
		options: options,
		cmp: {},
		mode: {},
		_init(options) {
			var mainHeight = $('main').height();
			var offset = $('#contentBlock').offset();
			var contentBlockOffsetTop = offset ? offset.top : 0;
			this.mainHeight = mainHeight;
			this.contentBlockTopOffset = contentBlockOffsetTop;
			$.extend(this, options);
			let obj = $.extend(true, {}, this, options);
			obj.container = obj.options.container ? $(obj.options.container) : obj.container;
			obj.$el = obj.container;
			if(obj._template) {
				obj.container.html(obj._template)
			}
			obj.subPagesInit();
			obj.eventsBind();
			obj.cmpInit();
			pageRightTitle(pageTitleArr);
			uiBlocksApi(false, 'init');
			return obj;
		},
		eventsBind() {
			var me = this;
			me.events = $.extend(true, {}, me.events, me.options.events);
			$.each(me.events, (key, val) => {
				var eventName = val.split(',')[0];
				var eventFunc = val.split(',')[1];
				me[eventFunc] = me[eventFunc] ? me[eventFunc] : me.options[eventFunc];
				me[eventFunc].$page = me;
				$(key).on(eventName, me[eventFunc].bind(me));
			});
		},
		cmpInit() {
			var me = this;
			$.each(me.container.find('[id]'), (index, item) => {
				var $el = $(item);
				me.cmp[$el.attr('id')] = $el;
				if (item.tagName == 'INPUT' || item.tagName == 'input') {
					me.mode[$el.attr('id')] = $el;
				}
			});
		},
		downloadFile(url, params) {
			var me = this;
			var form = $('<form>');
			form.attr('style', 'display:none');
			form.attr('target', 'body');
			form.attr('method', 'post');
			form.attr('action', url);
			//form.attr('onsubmit','return false;');
			$.each(params, function(key, value) {
				var input = $('<input>');
				input.attr('type', 'hidden');
				input.attr('name', key);
				if ($.isPlainObject(value)) {
					input.attr('value', JSON.stringify(value));
				} else {
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
		subPagesInit() {
			var me = this;
			$.each(me.subPages, (index, item) => {
				if (item.type = 'modal') {
					item.$parentel = me.$el;
					me.modals[item.id] = new EditModal(item);
				}
			});
		},
		$http(url, data) {
			return new Promise((resolve, reject) => {
				$.ajax({
					type: 'post',
					url: url,
					data: data,
					dataType: 'json',
					success(data) {
						if (data.success) {
							resolve(data);
						}else {
							reject(data);
						}
					}
				});
			});
		}
	};
	let page = obj._init(options);
	Promise.resolve().then(() => page.init(page));
	return page;
}

/*function Page(options) {
	return _Page(options);
}*/
