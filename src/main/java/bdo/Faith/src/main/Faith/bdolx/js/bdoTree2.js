/*
 * wang.yang5 2018.6.4更新:
 * 1.新增重置方法:收起所有节点并放弃选择
 * 2.不再每次点击都重建tree 请在事件触发后加入以下代码以判断tree是否已经被建立 而重置选择请新增重置按钮并绑定重置事件
				f($('#subject_tree').hasClass("treeview")){
					return;
				}
 *3.新增搜索功能:请事先准备用于搜索的input 并在建立tree时在params中加入{searchInputId:"xxxx"}
 *Demo请参考Faith/faQuery/account.js   搜索关键词"if($('#subject_tree').hasClass("treeview"))"  页面在查询与分析-余额表-科目编号
 *wang.yang5 2018.8.2更新
 * 1.新增懒加载开关 在options中传入lazyLoad参数 传false为不开 不传或者传true为开
 * 关闭懒加载的sql查询传入的父id下的所有子节点 开启懒加载的sql查询传入父id下的一级子节点
 * wang.yang5 2018.9.11更新
 * 新增getAbstratLabel 方法用于展示类似 '资产...   +44',即选中节点的缩略信息
 * 新增destory方法 请在param发生变化时 触发该事件 示意:
 * $("#account_customerId").change(function () {
	if($('#subject_tree').hasClass("treeview")){
		$('#subject_tree').tree('reset');
		$('#subject_tree').tree('destory');
	}
});
 * */
;
(function($, window, document, undefined) {

	'use strict';

	var pluginName = 'tree';

	var _default = {};
	var me = null;
	var treeMap = {};
	_default.settings = {
		url: null,
		params: null,
		opts: null,
		view: {
			color: '#555',
			expandIcon: 'fa fa-plus',
			collapseIcon: 'fa fa-minus',
			onhoverColor: '#f9f9f9',
			selectedColor: '#fff',
			selectedBackColor: 'rgba(0, 117, 234, 1)',
			showTags: true,
			leafIcon: 'fa fa-file-code-o text-flat', // 叶子节点图标
			nodeIcon: 'fa fa-folder text-primary-light', // 非叶子节点图标
			canExpand: true, // 节点是否可展开
			onNodeExpanded: null
			// 该函数不可重写
		}
	};

	var applyIf = function(object, config) {
		var property;
		if (object) {
			for (property in config) {
				if (object[property] === undefined) {
					object[property] = config[property];
				}
			}
		}
		return object;
	};

	var Tree = function(element, options) {
		this.$element = $(element);
		this.elementId = element.id;
		this.init(options);
		this.$element.data('$tree', this);
		return {
			options: this.options,
			expandedFun: $.proxy(this.expandedFun, this),
			getTreeData: $.proxy(this.getTreeData, this),
			getTreeMultiValue: $.proxy(this.getTreeMultiValue, this),
			getAbstractLabel: $.proxy(this.getAbstractLabel, this),
			getTreeMultiLabel: $.proxy(this.getTreeMultiLabel, this),
			setQueryInfo: $.proxy(this.setQueryInfo, this),
			getQueryInfo: $.proxy(this.getQueryInfo, this),
			reset: $.proxy(this.reset, this),
			init: $.proxy(this.init, this),
			reInit: $.proxy(this.reInit, this),
			destory: $.proxy(this.destory, this)
		};
	};

	Tree.prototype.destory = function() {
		this.$element.html('');
		this.$element.removeClass('treeview');
	};

	Tree.prototype.reInit = function() {
		this.$element.treeview('collapseAll', {
			silent: true
		});
		//如果输入框的值不为空才将所有有子目录的目录打开
		if (this.options.params.searchInputId == null) {
			return;
		}
		var searchInputVal = $('#' + this.options.params.searchInputId).val();
		if (searchInputVal != null && searchInputVal != '') {
			while ($('.icon.expand-icon.fa.fa-plus').length > 0) {
				$('.icon.expand-icon.fa.fa-plus').trigger('click');
			}
		}
	};

	Tree.prototype.reset = function() {
		this.$element.treeview('collapseAll', {
			silent: true
		});
		this.$element.treeview('uncheckAll', {
			silent: true
		});
		if (this.options.params.searchInputId == null) {
			return;
		}
		$('#' + this.options.params.searchInputId).val('');
	};

	Tree.prototype.init = function(options) {

		me = this;
		this.queryObj = null;
		options = applyIf(options, _default.settings);
		options.view = applyIf(options.view, _default.settings.view);
		this.options = options;
		if (options.view.canExpand) {
			this.options.view.onNodeExpanded = this.expandedFun;
		}
		this.buildTree();
	};

	Tree.prototype.buildTree = function() {
		var _this = this; // 因为each的this和全局this重名覆盖，另需定义一个标识
		var treeDataJson = this.getTreeData(this.options); // 获取原始Json数据
		if (treeDataJson && treeDataJson.length && treeDataJson.length > 0) {
			var viewConf = this.options.view;
			// 将Json数据格式化为符合TreeView控件的格式
			var $treeDataFormat = [];
			$(treeDataJson).each(function(index) {
				// 根据节点类型预设置可否被选择
				if (this.leaf) {
					this.selectable = true;
					this.icon = viewConf.leafIcon;
				} else {
					this.nodes = [];
					this.selectable = false;
					this.icon = viewConf.nodeIcon;
				}
				// 根据自定义配置设置节点可否被选择
				if (viewConf.folderSelectable) {
					this.selectable = true;
				}
				$treeDataFormat.push(this);
			});

			viewConf.data = $treeDataFormat;
			var doc = $('#' + this.elementId);
			//console.log(this.options.singleSelect);
			if (this.options.singleSelect) {
				viewConf.onNodeChecked = function(event, node) { //选中节点
					//清除其他的选中节点
					$(this).treeview('uncheckAll', {
						silent: true
					});
					//递归打开某节点的所有关闭的子节点后再关闭
					loadAllDataForOnNode(node, $(this));
					var ss = [];
					ss[0] = node.nodeId;
					if (ss) { //子节点不为空，则选中所有子节点
						$(this).treeview('checkNode', [ss, {
							silent: true
						}]);
					}
				};
			} else {
				viewConf.onNodeChecked = function(event, node) { //选中节点
					console.info(node);
					//递归打开某节点的所有关闭的子节点后再关闭
					loadAllDataForOnNode(node, $(this));
					var selectNodes = getChildNodeIdArr(node); //获取所有子节点
					if (selectNodes) { //子节点不为空，则选中所有子节点
						$(this).treeview('checkNode', [selectNodes, {
							silent: true
						}]);
					}
					//子节点全选后父节点选中
					setParentNodeCheck(node, $(this), true);
				};
			}

			viewConf.onNodeUnchecked = function(event, node) { //取消选中节点

				var selectNodes = getChildNodeIdArr(node); //获取所有子节点
				if (selectNodes) { //子节点不为空，则取消选中所有子节点
					$(this).treeview('uncheckNode', [selectNodes, {
						silent: true
					}]);
				}

			};
			doc.treeview(viewConf);
			//绑定搜索功能
			if (this.options.params.searchInputId == null) {
				return;
			}
			$('#' + this.options.params.searchInputId).unbind();
			$('#' + this.options.params.searchInputId)
				.keyup(
					function() {
						var searchVal = $(
							'#'
							+ _this.options.params.searchInputId)
							.val();
						var chiPattern = /^[\u4e00-\u9fa5]+$/;
						if (chiPattern.test(searchVal.trim())
							|| searchVal == null || searchVal == '') {
							//重新展开所有目录
							$('#' + _this.elementId).tree('reInit');
						}
					});
		}
	};

	Tree.prototype.getTreeData = function(options) {

		var data = null;
		//if(options.params.searchInputId && $("#" + options.params.searchInputId).val()){
		if (this.options.params.searchInputId != null) {
			options.params.param19 = $('#' + options.params.searchInputId)
				.val().trim();
		}
		//}
		$.ajax({
			type: 'post',
			url: options.url,
			async: false,
			data: (typeof options.params === 'function' ? options.params()
				: options.params),
			dataType: 'json',
			bdolxLoader: false,
			success: function(result) {
				if (/*result.data && */result.data.length
					&& result.data.length > 0) {
					data = result.data;
				}
			}
		});
		return data;
	};

	Tree.prototype.setQueryInfo = function(url, params, opts) {
		this.queryObj = {
			url: url,
			params: params,
			opts: opts
		};
	};

	Tree.prototype.getQueryInfo = function() {
		return this.queryObj;
	};

	Tree.prototype.expandedFun = function(event, node) {
		//lazyLoad懒加载如果为true则只更新一级节点
		var lazyLoad = me.options.lazyLoad;
		var parentId = node.parentId;
		if (lazyLoad != null && lazyLoad === false && parentId != null) {
			return;
		}
		me = $(this).data('$tree');
		var queryObj = me.getQueryInfo();
		if (queryObj == null) {
			queryObj = {};
			queryObj.url = me.options.url;
			queryObj.params = (typeof me.options.params === 'function' ? me.options
					.params()
				: me.options.params); //me.options.params;
			queryObj.params.param1 = encodeURI(node.value);
			queryObj.params.param2 = encodeURI(node.id);
			queryObj.params.param3 = encodeURI(node.label);
			queryObj.params.param4 = encodeURI(node.switchNode);
			queryObj.params.param5 = encodeURI(node.parentId) == 'undefined' ? 'root'
				: encodeURI(node.parentId);
			queryObj.params.param6 = encodeURI(node.typeName);
			queryObj.params.param7 = encodeURI(node.checked) == 'undefined' ? null
				: encodeURI(node.checked);
			queryObj.params.param8 = encodeURI(node.ischeckbox) == 'undefined' ? null
				: encodeURI(node.ischeckbox);
		}

		var subTreeDataJson = me.getTreeData(queryObj);
		queryObj = null;// 重新置为null
		var m_tree = $(event.target).treeview(true);
		if (subTreeDataJson && subTreeDataJson.length > 0) {
			var viewConf = me.options.view;
			$(subTreeDataJson).each(function(index) {
				var currentNode = this;
				// 根据节点类型预设置可否被选择
				if (this.leaf) {
					this.nodes = null;
					this.selectable = true;
					this.icon = viewConf.leafIcon;
				} else {
					this.nodes = [];
					this.selectable = false;
					this.icon = viewConf.nodeIcon;
				}

				// 根据自定义配置设置节点可否被选择
				if (viewConf.folderSelectable) {
					this.selectable = true;
				}

				if (this.state == null) {
					this.state = {
						checked: false,
						disabled: false,
						expanded: false,
						selected: false
					};
				}

				this.state.checked = node.state.checked;

				var treeNodes = m_tree.getAllNodes();
				var isExist = false, nodeIndex = 0;
				//判断该节点是否已经存在 如果不存在则加入新的节点
				for (var k = 0; k < treeNodes.length; k++) {
					var thisNode = treeNodes[k];
					if (currentNode.id == thisNode.id) {
						isExist = true;
						nodeIndex = k;
						break;
					}
				}
				var pushNode;
				if (!isExist) {
					this.nodeId = treeNodes.length;
					treeNodes.push(this);
					pushNode = this;
					//$nodes.push(this);
					var parentId = this.parentId;
					var parentNode = getNodeById(treeNodes, parentId);
					parentNode && parentNode.nodes.push(pushNode);
				} else {
					if (me.options && me.options.opts && me.options.opts.updateNode === true) {
						$.each(currentNode, (key, val) => {
							if (val) {
								treeNodes[nodeIndex][key] = val;
							}
						});
					}
				}
			});
			//$(event.target).treeview(true).getAllNodes()[node.nodeId].nodes=$nodes;
		} else {
			var node = $(event.target).treeview(true).getAllNodes()[node.nodeId];
			if (node.leaf === true) {
				node.nodes = null;
			} else {
				$(event.target).treeview(true).getAllNodes()[node.nodeId].nodes = [];
			}
		}
	};

	Tree.prototype.getTreeMultiValue = function() {
		var checkedNode = '';
		$.each($('#' + this.elementId).treeview('getChecked'), function(index,
																		info) {
			checkedNode += info.value + ',';
		});
		return checkedNode.substr(0, checkedNode.length - 1);
	};

	Tree.prototype.getAbstractLabel = function() {
		var checkNodes = $('#' + this.elementId).treeview('getChecked');
		if (checkNodes.length > 1) {
			return checkNodes[0].text + '...   +' + (checkNodes.length - 1);
		} else {
			return checkNodes[0].text;
		}

	};

	Tree.prototype.getTreeMultiLabel = function() {
		var checkedNode = '';
		$.each($('#' + this.elementId).treeview('getChecked'), function(index,
																		info) {
			checkedNode += info.label + ',';
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
					logError('Not initialized, can not call method : '
						+ options);
				} else if (!$.isFunction(_this[options])
					|| options.charAt(0) === '_') {
					logError('No such method : ' + options);
				} else {
					if (!(args instanceof Array)) {
						args = [args];
					}
					result = _this[options].apply(_this, args);
				}
			} else if (typeof options === 'boolean') {
				result = _this;
			} else {
				$.data(this, pluginName, new Tree(this, $.extend(true, {},
					options)));
			}
		});

		return result || this;
	};
})(jQuery, window, document);

function getChildNodeIdArr(node) {
	var ts = [];
	if (node.nodes && node.nodes.length > 0) {
		for (x in node.nodes) {
			if (x < node.nodes.length) {
				ts.push(node.nodes[x].nodeId);
				if (node.nodes[x].nodes && node.nodes[x].nodes.length > 0) {
					var getNodeDieDai = getChildNodeIdArr(node.nodes[x]);
					for (j in getNodeDieDai) {
						if (j < getNodeDieDai.length) {
							ts.push(getNodeDieDai[j]);
						}
					}
				}
			}
		}
	} else {
		ts.push(node.nodeId);
	}
	return ts;
}

function setParentNodeCheck(node, doc, flag) {
	//var parentNode = doc.treeview("getNode", node.parentId);
	var nodes = doc.treeview(true).getAllNodes();
	var parentId = node.parentId;
	var parentNode = getNodeById(nodes, parentId);
	if (parentNode && parentNode.nodes.length > 0) {
		var count = 0;
		for (var i = 0; i < parentNode.nodes.length; i++) {
			var tmpNode = parentNode.nodes[i];
			if (tmpNode.state.checked === flag) {
				count++;
			} else {
				break;
			}
		}
		if (count === parentNode.nodes.length) {
			if (flag) {
				doc.treeview('checkNode', parentNode.nodeId);
			} else {
				doc.treeview('uncheckNode', parentNode.nodeId);
			}
			setParentNodeCheck(parentNode, doc, flag);
		}
	}
}

//根据id获得node bootstrap -- treeview doc.treeView("getNode",nodeId)返回的不是node对象而是函数
var getNodeById = function(nodes, id) {
	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		if (node && node.id === id) {
			return node;
		}
		if (node && node.value === id) {
			return node;
		}
	}
};

var loadAllDataForOnNode = function(node, doc) {
	if (!node.state.expanded) {
		doc.treeview('expandNode', node.nodeId);
		doc.treeview('collapseNode', node.nodeId);
	}
	// var nodes = doc.treeview(true).getAllNodes();
	// var tmpNodes = getNodeById(nodes,node.id).nodes;
	// if(tmpNodes){
	// 	for(var i = 0;i < tmpNodes.length;i++){
	// 		loadAllDataForOnNode(tmpNodes[i],doc);
	// 	}
	// }
};
