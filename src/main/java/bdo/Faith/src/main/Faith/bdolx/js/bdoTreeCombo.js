;(function($, window, document, undefined) {

	'use strict';

	var pluginName = 'treecombo';

	$('[data-toggle=\'popover\']').popover();

//	// 添加下拉按钮
//  var offset = $("#"+id).position();
//	var btn = $('<button ><span class="caret"></span></button>');
//	btn.attr({
//		'class': 'btn btn-default',
//		'type': 'button',
//		'id': 'treecombo-btn-'+id
//	});
//	btn.css({
//		'position': 'absolute',
//		'top': offset.top,
//		'right': offset.left,
//		'padding': '14px 10px'
//	});		
//	$("#"+id).parent().append(btn);


	// setTreeComboValue  要解决 返回值问题

	var TreeCombo = function(element, options) {
		this.$element = $(element);
		this.elementId = element.id;
		this.init(options);
		this.$element.attr('autocomplete', 'off');
		return {
			options: this.options,
			expandedFun: $.proxy(this.expandedFun, this),
			setValue: $.proxy(this.setValue, this),
			getTreeComboLabel: $.proxy(this.getTreeComboLabel, this),
			getTreeComboValue: $.proxy(this.getTreeComboValue, this),
			getTreeComboMultiValue: $.proxy(this.getTreeComboMultiValue, this),
			setTreeComboValue: $.proxy(this.setTreeComboValue, this),
			getTree: $.proxy(this.getTree, this),
			setQueryInfo: $.proxy(this.setQueryInfo, this),
			getQueryInfo: $.proxy(this.getQueryInfo, this),
			init: $.proxy(this.init, this)
		};
	};

	TreeCombo.prototype.init = function(options) {
		this.mes = this;
		this.tree = null;
		this.oldValue = null;
		this.newValue = null;
		this.lastKeyUpCode = null;
		this.lastKeyUpTsmp = null;
		this.queryFlag = true;
		this.options = options;
		this.buildTreeCombo();
	};

	function Inputfocus(event) {
		let $mes = event.data.mes;
		if ($(this).attr('istree') != null) {
			var valueT = $(this).val() ? $(this).val() : null;
			var dataContentData = $(this).attr('data-contentdata');
			var dataContent = $(this).attr('data-content');
			var dataResult = $(this).attr('data-result');
			if (dataResult == null || dataContent == null || valueT != dataResult) {
				if (dataResult != null && dataContent != null) {
					$(this).val(dataContentData);
				} else {
					if (valueT) {
						$(this).val(dataContentData);
					} else {
						$(this).val(null);
					}
				}
			}
			valueT = $(this).val() ? $(this).val() : null;
			if (valueT == null || ($.trim(valueT) == '')) {
				//$mes.options.params = {};
				$mes.options._params = (typeof $mes.options.params === 'function' ? $mes.options.params() : $mes.options.params);
				$mes.options._params.param1 = null;
				$mes.options._params.param2 = null;
				$mes.options._params.param3 = null;
				$mes.options._params.param4 = null;
				$mes.options._params.param5 = null;
				$mes.options._params.param6 = null;
				$mes.options._params.param7 = null;
				$mes.options._params.param8 = null;
				$mes.options._params.param18 = null;
				$mes.options._params.param19 = null;

				/*$mes.options.params.param1 = null;
				$mes.options.params.param2 = null;
				$mes.options.params.param3 = null;
				$mes.options.params.param4 = null;
				$mes.options.params.param5 = null;
				$mes.options.params.param6 = null;
				$mes.options.params.param7 = null;
				$mes.options.params.param8 = null;
				$mes.options.params.param18 = null;
				$mes.options.params.param19 = null;*/
				$('[id^="treecombocon"]:not(#treecombocon-' + $(this).attr('id') + ')').remove();
			}
		} else {
			$('[id^="treecombocon"]').remove();
		}

	}

	function hideOthorTree(event) {
		let $mes = event.data.mes;
		//event.preventDefault();
		var eleParClass = $(event.target).parent().attr('class');
		var eleParId = $(event.target).parent().attr('id');
		if (eleParClass && eleParClass.indexOf('node-treecombo-') != -1) {
			var id = eleParClass.split('node-treecombo-')[1];
			$('[id^="treecombocon"]:not(#treecombocon-' + id + ')').remove();
		} else {
			var eleClass = $(event.target).attr('class');
			var eleId = $(event.target).attr('id');
			if (eleClass && eleClass.indexOf('node-treecombo-') != -1) {
				var id = eleClass.split('node-treecombo-')[1].split(' ')[0];
				if ($mes.elementId == id) {
					if ($mes.options.view.multiSelect) {

					} else {
						$('[id^="treecombocon"]:not(#treecombocon-' + id + ')').remove();
					}
				}
				return;
			}
			if (eleId) {
				if ($('#' + eleId).attr('isTree')) {
					if (eleId.indexOf('caret') != -1) {
						$('[id^="treecombocon"]:not(#treecombocon-' + eleId.split('caret_')[1] + ')').remove();
					} else {
						$('[id^="treecombocon"]:not(#treecombocon-' + eleId + ')').remove();
					}
				} else {
					$('[id^="treecombocon"]').remove();
				}
			} else {
				$('[id^="treecombocon"]').remove();
			}
		}
	}

	TreeCombo.prototype.buildTreeCombo = function() {
		let $this = this;
		let $mes = $this.mes;
		let offset = $this.$element.position();
		let caret = $('<span class="caret"></span>');
		caret.attr('id', 'caret_' + this.elementId)
			.attr('isTree', '1');
		caret.css({
			'position': 'absolute',
			'top': '38%',
			'right': '2%',
			'padding': '0px'
		});
		$this.$element.parent().append(caret);
		$this.$element.attr('isTree', '1'); // 判断这个控件关联的是不是Tree，和body的click事件相关联
		if ($this.$element.attr('readonly') == 'readonly') {
			caret.hide();
		}
		$this.caret = caret;
		$this.caretId = caret.attr('id');
		//		this.$element.on('blur',function(){
		//			var id = $mes.elementId;
		//			$('#treecombocon-'+id).remove();
		//		})

		$('#' + $this.elementId + ',' + '#' + $this.caretId).off('click');
		$('#' + $this.elementId + ',' + '#' + $this.caretId).on('click', function(event) {
			let $thisEl = $(this);
			if ($thisEl.attr('readonly') == 'readonly' || $thisEl.attr('disabled') == 'disabled') {
				caret.hide();
				return;
			} else {
				caret.show();
			}
//			var ids = $(me[0]).attr('id');
			let id = $mes.elementId;
			let me = $('#' + id);
			let hasCreated = $('#treecombocon-' + id).attr('id');
			if (hasCreated) {
				$('#treecombocon-' + id).remove();
			} else {
				// 创建tree树	容器
				let treecomboCon = $('<div></div>');
				treecomboCon.attr('id', 'treecombocon-' + id);
				let positionValue = 'absolute';
				if ($mes.options.view.positionValue) {
					positionValue = $mes.options.view.positionValue;
					caret.hide();
				}
				treecomboCon.css({
					'position': positionValue,
					'overflow': 'auto',
					'height': '260px',
					'z-index': '99999',
//					'width': me.outerWidth()+'px'
					'width': '350px'
				});
				if ('fixed' == positionValue) {
					let ev = event.pageY - me.offset().top;
					treecomboCon.offset({top: event.screenY - 70 - ev});
				}
				// 创建tree树
				let treeCon = $('<div></div>');
				treeCon.attr('id', 'treecombo-' + id);
				treecomboCon.append(treeCon);
				treecomboCon.insertAfter('#' + id);
				if ($thisEl.val() && $thisEl.val() != '') {
					$mes.options.params.param19 = encodeURI($(this).val());
					$mes.options.view.onNodeExpanded = null;
					$mes.options.view.expandIcon = null;
					$mes.options.view.collapseIcon = null;
				} else {
					if ($thisEl.val() == '') {
						delete  $mes.options.view.onNodeExpanded;
						delete  $mes.options.view.expandIcon;
						delete  $mes.options.view.collapseIcon;
					} else {
						$mes.options.view.onNodeExpanded = null;
						$mes.options.view.expandIcon = null;
						$mes.options.view.collapseIcon = null;
					}
				}
				$mes.options._params = (typeof $mes.options.params === 'function' ? $mes.options.params() : $mes.options.params);
				// 根据参数初始化tree树
				$('#' + treeCon.attr('id')).tree({
					url: $mes.options.url,
					params: $mes.options._params,
					view: $mes.options.view
				});
				let treeVar = $('#' + treeCon.attr('id')).treeview(true);
				$this.tree = treeVar;
				// 添加tree节点事件
				$('#' + treeCon.attr('id')).on('nodeSelected nodeUnselected', function(event, node) {
					let selectNodes = treeVar.getSelected();
					me.val(null);
					me.attr('data-result', '');
					$(selectNodes).each(function(index) {
						me.val(me.val() + ',' + this.text);
						me.attr('data-result', me.attr('data-result') + ',' + this.value);
					});
					me.val(me.val().substring(1));
					me.attr('data-result', me.attr('data-result').substring(1));
					me.attr('data-content', me.val());
					me.attr('data-contentdata', me.val());
					$this.options.nodeSelectedCallback && $this.options.nodeSelectedCallback(treeVar, {
						result: me.attr('data-result'),
						content: me.attr('data-content'),
						contentdata: me.attr('data-contentdata')
					});
					$('#treecombocon-' + id).remove();
				});

				// 多选显示弹框
				let opts = treeVar.options;
				if (opts && opts.multiSelect) {
					me.attr({
//						'readonly': 'readonly',
						'title': '',
						'data-toggle': 'popover',
						'data-trigger': 'hover',
						'data-content': '',
						'data-placement': 'top'
					});

					me.css({
						'text-overflow': 'ellipsis'
					});

					me.hover(function() {
						if (me.val() == null || me.val() == '') {
							me.popover('hide');
						} else {
							me.attr('data-content', me.val());
							me.attr('data-contentdata', me.val());
							me.popover('show');
						}
					}, function() {
						me.popover('hide');
					});

					me.keyup(function() {
						if (me.val() == null || me.val() == '') {
							me.popover('hide');
						} else {
							me.attr('data-content', me.val());
							me.attr('data-contentdata', me.val());
							me.popover('show');
						}
					});
				}
			}
		});


		let flags = {};
		$this.searchTimer = null;
		let _this = $this;
		//记录是否在搜索
		$('#' + $this.elementId).on('keyup', function(event) {
			if (!event) {
				event = {};
				return false;
			}
			if (_this.searchTimer) {
				clearTimeout(_this.searchTimer);
				_this.searchTimer = null;
			}
			let target = this;
			let keyCode = event.keyCode;
			_this.searchTimer = setTimeout(function() {
				clearTimeout(_this.searchTimer);
				_this.searchTimer = null;
				if ($(target).attr('readonly') == 'readonly' || $(target).attr('disabled') == 'disabled') {
					return;
				}
				var valueT = $(target).val() ? $(target).val().replace(/\s/g, '') : null; // 8:backspace 9:tab 16:shift 32:空格键

				if (valueT == null || $.trim(valueT) == '') {
					$(target).val(null);

					$(target).removeAttr('data-content');
					$(target).removeAttr('data-contentdata');
					$(target).removeAttr('data-result');

					//$mes.options.params = {};
					$mes.options.params.param1 = null;
					$mes.options.params.param2 = null;
					$mes.options.params.param3 = null;
					$mes.options.params.param4 = null;
					$mes.options.params.param5 = null;
					$mes.options.params.param6 = null;
					$mes.options.params.param7 = null;
					$mes.options.params.param8 = null;
					$mes.options.params.param18 = null;
					$mes.options.params.param19 = null;

					if (keyCode != 8 && keyCode != 32) {// && event.keyCode != 9
						if (keyCode == 9) {
							$('[id^="treecombocon"]:not(#treecombocon-' + $(target).attr('id') + ')').remove();
						} else {
							return;
						}
					}
				}

				var id = $mes.elementId;
				var me = $('#' + id);
				$('#treecombocon-' + id).remove();
				var treecomboCon = $('<div></div>');
				treecomboCon.attr('id', 'treecombocon-' + id);
				var positionValue = 'absolute';
				if ($mes.options.view.positionValue) {
					positionValue = $mes.options.view.positionValue;
					caret.hide();
				}
				treecomboCon.css({
					'position': positionValue,
					'overflow': 'auto',
					'height': '260px',
					'z-index': '99999',
					'width': '350px'
				});

				if ('fixed' == positionValue) {
					let ev = event.pageY - me.offset().top;
					treecomboCon.offset({top: event.screenY - 70 - ev});
				}
				var treeCon = $('<div></div>');
				treeCon.attr('id', 'treecombo-' + id);
				treecomboCon.append(treeCon);
				treecomboCon.insertAfter('#' + id);
				$mes.options._params = $mes.options._params ? $mes.options._params : (typeof $mes.options.params === 'function' ? $mes.options.params() : $mes.options.params);
				var params = $mes.options._params;// $mes.options.params;
				params.param19 = encodeURI($(target).val());
				if (params.param19 == null || params.param19 == '') {
					delete  $mes.options.view.onNodeExpanded;
					delete  $mes.options.view.expandIcon;
					delete  $mes.options.view.collapseIcon;
					params.param1 = null;
					params.param2 = null;
					params.param3 = null;
					params.param4 = null;
					params.param5 = null;
					params.param6 = null;
					params.param7 = null;
					params.param8 = null;

				} else {
					$mes.options.view.onNodeExpanded = null;
					$mes.options.view.expandIcon = null;
					$mes.options.view.collapseIcon = null;
				}

				$('#' + treeCon.attr('id')).tree({
					url: $mes.options.url,
					params: params,//$mes.options.params,
					view: $mes.options.view
				});
				var treeVar = $('#' + treeCon.attr('id')).treeview(true);
				$this.tree = treeVar;
				$('#' + treeCon.attr('id')).on('nodeSelected nodeUnselected', function(event, node) {
					var selectNodes = treeVar.getSelected();
					me.val(null);
					me.attr('data-result', '');
					$(selectNodes).each(function(index) {
						me.val(me.val() + ',' + this.text);
						me.attr('data-result', me.attr('data-result') + ',' + this.value);
					});
					me.val(me.val().substring(1));
					me.attr('data-result', me.attr('data-result').substring(1));
					me.attr('data-content', me.val());
					me.attr('data-contentdata', me.val());
					$('#treecombocon-' + id).remove();
					$this.options.nodeSelectedCallback && $this.options.nodeSelectedCallback(treeVar, {
						result: me.attr('data-result'),
						content: me.attr('data-content'),
						contentdata: me.attr('data-contentdata')
					});
				});
			}, 1000);
		});


		$('#' + $this.elementId).on('blur', function(event) {
			if (!event) {
				return false;
			}
			var valueT = $(this).val() ? $(this).val() : null;
			var dataContentData = $(this).attr('data-contentdata');
			var dataContent = $(this).attr('data-content');
			var dataResult = $(this).attr('data-result');
			if (dataResult == null || dataContent == null || valueT != dataResult) {
				if (dataResult != null && dataContent != null) {
					$(this).val(valueT);
					$(this).attr('data-content', valueT);
					$(this).attr('data-contentdata', valueT);
				} else {
					if (valueT) {
						$(this).val(dataContentData);
					} else {
						$(this).val(null);
					}
				}
			}
			valueT = $(this).val() ? $(this).val() : null;
			if (valueT == null || ($.trim(valueT) == '') && event.keyCode == 8) {
				//$mes.options.params = {};
				$mes.options._params = (typeof $mes.options.params === 'function' ? $mes.options.params() : $mes.options.params);
				$mes.options._params.param1 = null;
				$mes.options._params.param2 = null;
				$mes.options._params.param3 = null;
				$mes.options._params.param4 = null;
				$mes.options._params.param5 = null;
				$mes.options._params.param6 = null;
				$mes.options._params.param7 = null;
				$mes.options._params.param8 = null;
				$mes.options._params.param18 = null;
				$mes.options._params.param19 = null;
				/*$mes.options.params.param1 = null;
				$mes.options.params.param2 = null;
				$mes.options.params.param3 = null;
				$mes.options.params.param4 = null;
				$mes.options.params.param5 = null;
				$mes.options.params.param6 = null;
				$mes.options.params.param7 = null;
				$mes.options.params.param8 = null;
				$mes.options.params.param18 = null;
				$mes.options.params.param19 = null;*/
//				$('#treecombocon-'+$(this).attr('id')).remove();
			}

		});

		$('[istree]').off('focus', Inputfocus);
		$('[istree]').on('focus', {mes: $mes}, Inputfocus);

		//console.log('$(\'body\').off(\'click\', {mes: $mes}, hideOthorTree);');
		// 隐藏当前树控件以外的树控件
		$('body').off('click', hideOthorTree);
		$('body').on('click', {mes: $mes}, hideOthorTree);
		/*function (event) {
			var eleParClass =  $(event.target).parent().attr('class');
			var eleParId =  $(event.target).parent().attr('id');
			if(eleParClass && eleParClass.indexOf('node-treecombo-') != -1){
	  			var id = eleParClass.split('node-treecombo-')[1];
		  		$('[id^="treecombocon"]:not(#treecombocon-'+id+')').remove();
		  	}else{
				var eleClass =  $(event.target).attr('class');
				var eleId =  $(event.target).attr('id');
				if(eleClass && eleClass.indexOf('node-treecombo-') != -1){
					var id = eleClass.split('node-treecombo-')[1].split(' ')[0]; 
					if($mes.elementId == id){ 
						if($mes.options.view.multiSelect){
							
						}else{
			  				$('[id^="treecombocon"]:not(#treecombocon-'+id+')').remove();
						}
					}
		  			return;
		  		}
				if(eleId){
		  			if($('#'+eleId).attr('isTree')){
		  				if(eleId.indexOf('caret') != -1){
					  		$('[id^="treecombocon"]:not(#treecombocon-'+eleId.split('caret_')[1]+')').remove();
		  				}else{
					  		$('[id^="treecombocon"]:not(#treecombocon-'+eleId+')').remove();
				  		}
		  			}else{
				  		$('[id^="treecombocon"]').remove();
		  			}
			  	}else{
			  		$('[id^="treecombocon"]').remove();
				}
			}
		});*/
	};


	TreeCombo.prototype.getTree = function(t) {
		return this.tree;
	};

	TreeCombo.prototype.setValue = function(value) {
		var me = this, newValue = value;
		var tree = this.getTree();
		var $el = $('#' + me.elementId);
		if (value == null || value == '') {
			$el.attr('data-result', '');
			$el.attr('data-content', '');
			$el.attr('data-contentdata', '');
			$el.val('');
			return;
		}
		var option = {
			url: me.options.url,
			params: (typeof me.options.params === 'function' ? me.options.params() : me.options.params)
		};
		option.params.param18 = value;
		option.params.param1 = null;
		option.params.param2 = null;
		option.params.param3 = null;
		option.params.param4 = null;
		option.params.param5 = null;
		option.params.param6 = null;
		option.params.param7 = null;
		option.params.param8 = null;
		option.params.param19 = null;
		var data = {
			value: '',
			text: ''
		};
		$.ajax({
			type: 'post',
			url: option.url,
			async: false,
			data: option.params,
			dataType: 'json',
			bdolxLoader: false,
			success: function(result) {
				if (result.success == true) {
					if (result.data && result.data.length > 0) {
						$.each(result.data, (index, value) => {
							if (value.value == newValue || value.text == newValue) {
								data = value;
							}
						});
					}
				}
			}
		});

		option.params.param18 = null;

		$el.attr('data-result', data.value);
		$el.attr('data-content', data.text);
		$el.attr('data-contentdata', data.text);
		$el.attr('data-typeName', data.typeName);
		$el.val(data.text);

		me.options.nodeSelectedCallback && me.options.nodeSelectedCallback(tree, {
			result: data.value,
			content: data.text,
			contentdata: data.text
		});
	};

	TreeCombo.prototype.setTreeComboValue = function(value, text) {
		if (value == null || value == null) {
			$('#' + this.elementId).removeAttr('data-result');
			$('#' + this.elementId).removeAttr('data-content');
			$('#' + this.elementId).removeAttr('data-contentdata');
			$('#' + this.elementId).val(null);
		} else {
			$('#' + this.elementId).attr('data-result', value);
			$('#' + this.elementId).attr('data-content', text);
			$('#' + this.elementId).attr('data-contentdata', text);
			$('#' + this.elementId).val(text);
		}
	};

	TreeCombo.prototype.getTreeComboValue = function() {
		return $('#' + this.elementId).attr('data-result');
	};

	TreeCombo.prototype.getTreeComboLabel = function() {
		return $('#' + this.elementId).attr('data-contentdata');
	};

	TreeCombo.prototype.getTreeMultiValue = function() {
		var checkedNode = '';
		$.each($('#' + this.elementId).treeview('getChecked'), function(index, info) {
			console.log(info);
			checkedNode += info.value + '-' + info.label + ',';
		});
		return checkedNode.substr(0, checkedNode.length - 1);
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
				$.data(this, pluginName, new TreeCombo(this, $.extend(true, {}, options)));
			}
		});
		if (typeof options === 'string') {
			return result;
		}
		//console.info('options', options, 'result', result || this);
		return result || this;
	};

})(jQuery, window, document);
