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

	let pluginName = 'tree';

	let _default = {};

	_default.settings = {
		url: null,
		params: null,
		opts: null,
		preFieldName: 'parentId',
		idFieldName: 'id',
		onceLoad: false,
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
		}
	};

	let Tree = function(element, options) {
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
			destory: $.proxy(this.destory, this),
			getCheckedData: $.proxy(this.getCheckedData, this),
			checkAll: $.proxy(this.checkAll, this)
		};
	};

	function loadAllDataForOnNode(node, doc) {
		if (!node.state.expanded) {
			doc.treeview('expandNode', node.nodeId);
			doc.treeview('collapseNode', node.nodeId);
		}
	}

	function getChildNodeIdArr(node) {
		let ts = [];

		function getNodes(node) {
			ts.push(node.nodeId);
			if (node.nodes && node.nodes.length > 0) {
				for (let i = 0, len = node.nodes; i < len; i++) {
					getNodes(node.nodes[i]);
				}
			}
		}

		getNodes(node);
		return ts;
	}

	function setParentNodeCheck(node, doc, flag) {
		//var parentNode = doc.treeview("getNode", node.parentId);
		let nodes = doc.treeview(true).getAllNodes();
		let parentId = node.parentId;
		let parentNode = getNodeById(nodes, parentId);
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

	function getNodeById(nodes, id) {
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			if (node && node.id === id) {
				return node;
			}
			if (node && node.value === id) {
				return node;
			}
		}
	}

	function logError(message) {
		if (window.console) {
			window.console.error(message);
		}
	}

	function getParentNodeIds(treeInstance, nodes, node, ids){
		var parentNode = nodes.find(m => m.nodeId == node.parentId);
		if (parentNode) {
			if(ids.indexOf(parentNode.nodeId) == -1){
				ids.splice(0, 0, parentNode.nodeId);
				if(parentNode.parentId != undefined){
					getParentNodeIds(treeInstance, nodes, parentNode, ids);
				}
			}
		}
	}

	Tree.prototype = $.extend(true, Tree.prototype, {
		init(options) {
			this.queryObj = null;
			options = this.applyIf(options, _default.settings);
			options.view = this.applyIf(options.view, _default.settings.view);
			this.options = options;
			if (options.view.canExpand) {
				this.options.view.onNodeExpanded = this.expandedFun;
			}
			this.buildTree();
		},
		applyIf(object, config) {
			let property;
			if (object) {
				for (property in config) {
					if (object[property] === undefined) {
						object[property] = config[property];
					}
				}
			}
			return object;
		},
		buildTree() {
			let _this = this; // 因为each的this和全局this重名覆盖，另需定义一个标识
			_this._dataMap = {};
			_this._bdoTreeDatas = [];
			_this._bdoTreeDataMap = {};
			let treeDataJson = _this.getTreeData(_this.options); // 获取原始Json数据
			if (treeDataJson && treeDataJson.length > 0) {
				let viewConf = _this.options.view;
				_this.setInitTreeData(treeDataJson);
				_this.setInitTreeDataMap();
				_this.setInitTree();
				viewConf.data = _this.__nodes;
				let doc = _this.$element;
				if (_this.options.singleSelect) {
					viewConf.onNodeChecked = _this.singleSelectNodeChecked;
				} else {
					viewConf.onNodeChecked = _this.selectNodeChecked;
				}
				viewConf.onNodeUnchecked = _this.nodeUnchecked;
				_this.treeInstance = doc.treeview(viewConf).treeview(true);
				//绑定搜索功能
				if (_this.options.params.searchInputId == null) {
					return;
				}
				_this.$searchInputEl = $('#' + _this.options.params.searchInputId);
				_this.$searchInputEl.unbind();
				/*_this.searchInputElkeyupTimeOut = null;
				_this.searchInputElKeyupTimeoutFn = function() {
					if (_this.searchInputElkeyupTimeOut != null) {
						clearTimeout(_this.searchInputElkeyupTimeOut);
						_this.searchInputElkeyupTimeOut = null;
					}
					let searchVal = _this.$searchInputEl.val();
					let chiPattern = /^[\u4e00-\u9fa5]+$/;  //不是汉字过滤掉，不搜索
					if (searchVal && searchVal != '') {
						//重新展开所有目录
						//$("#" + _this.elementId).tree("reInit");
						_this.reInit();
					}
				};*/
				_this.$searchInputEl.keyup(function() {
					/*// 使用timeout进行防抖
					if (_this.searchInputElkeyupTimeOut != null) {
						clearTimeout(_this.searchInputElkeyupTimeOut);
						_this.searchInputElkeyupTimeOut = null;
					}
					_this.searchInputElkeyupTimeOut = setTimeout(_this.searchInputElKeyupTimeoutFn, 1000);*/
					//回车执行查询
					if (event.keyCode == "13") {
						//重新展开所有目录
						_this.reInit();
					}
				});
			}
		},
		destory() {
			this.$element.html('');
			this.$element.removeClass('treeview');
		},
		reInit() {
			this.$element.treeview('collapseAll', {
				silent: true
			});
			//如果输入框的值不为空才将所有有子目录的目录打开
			if (this.options.params.searchInputId == null) {
				return;
			}
			let searchInputVal = this.$searchInputEl.val();
			if (searchInputVal != null && searchInputVal != '') {
				/*//this.treeInstance.expandAll();
				this.treeInstance.search(searchInputVal);*/
				var treeInstance = this.treeInstance;
				var nodes = treeInstance.getAllNodes();
				var parentIds = [];
				var searchedIds = [];
				var isSelected = false;
				for(var node of nodes){
					if(node.text.indexOf(searchInputVal) > -1){
						searchedIds.push(node.nodeId);
						if(node.parentId != undefined){
							getParentNodeIds(treeInstance, nodes, node, parentIds);
							parentIds.sort();
						}
						if(!isSelected && node.leaf){
							isSelected = true;
							treeInstance.selectNode(node.nodeId, {silent: true});
						}
					}
				}
				// this.buildTree();
				for(var i = 0;i < parentIds.length; i++) {
					treeInstance.expandNode(parentIds[i], { levels: 1, silent: true });
				}
				var id = this.$element.attr('id');
				if(searchedIds.length > 0){
					var position = $("#" + id).find('ul[class="list-group"]').find('li[data-nodeid="' + searchedIds[0] + '"]').offset();
					position.top = position.top - 150;
					$("#" + id).find('ul[class="list-group"]').find('li[data-nodeid="' + searchedIds[0] + '"]').parent().parent().parent().animate({scrollTop : position.top}, 100);
				}
				for(var i = 0;i < searchedIds.length; i++){
					// 选中字体变红
					$("#" + id).find('ul[class="list-group"]').find('li[data-nodeid="' + searchedIds[i] + '"]').addClass("search-result");
					$("#" + id).find('ul[class="list-group"]').find('li[data-nodeid="' + searchedIds[i] + '"]').css('color', '#D9534F');
				}
			}
		},
		reset() {
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
			this.$element.treeview('clearSearch');
		},
		getTreeData(options) {
			let data = null;
			if (this.options.params.searchInputId != null) {
				options.params.param19 = $('#' + options.params.searchInputId).val().trim();
			}
			let _this = this;
			$.ajax({
				type: 'post',
				url: options.url,
				async: false,
				data: (typeof options.params === 'function' ? options.params() : options.params),
				dataType: 'json',
				bdolxLoader: false,
				success: function(result) {
					if (result.data && result.data.length > 0) {
						data = result.data;
					} else {
						data = [];
					}
					_this._treeData = data;
				}
			});
			return _this._treeData;
		},
		setInitTreeData(jsonData) {
			let _this = this;
			$.each(jsonData, function(index, data) {
				if (!data.hasOwnProperty('_bdoNodeId')) {
					let value = data.id;
					if (data.typeName) {
						value = data.id.replace(data.typeName + '_', '');
					}
					data._bdoNodeId = value;
				}
				if (!data.hasOwnProperty('_bdoParentId')) {
					data._bdoParentId = data.parentId;
				}
				if (!_this._bdoTreeDataMap[data.id]) {
					data.__bdoNodeId = _this._bdoTreeDatas.length;
					_this._bdoTreeDatas.push(data);
					_this._bdoTreeDataMap[data.id] = data;
				}
				if (data.nodes) {
					_this.setInitTreeData(data.nodes);
				}
				if (data._bdoParentId) {
					let parentNode = _this._bdoTreeDataMap[data._bdoParentId];
					if (parentNode && parentNode._bdoNodeId != data._bdoNodeId) {
						data.parentId = data.__bdoParentId = parentNode.__bdoNodeId;
					}
				}
			});
		},
		setInitTreeDataMap() {
			let _this = this;
			$.each(_this._bdoTreeDatas, function(index, node) {
				if (node._bdoParentId) {
					let parentNode = _this._bdoTreeDataMap[node._bdoParentId];
					if (parentNode && parentNode._bdoNodeId != node._bdoNodeId) {
						node.parentId = node.__bdoParentId = parentNode.__bdoNodeId;
					}
				}
				node.nodeId = node.__bdoNodeId;
			});
		},
		setInitTree() {
			let viewConf = this.options.view;
			let nodes = [].concat(this._bdoTreeDatas);
			let rem = new Array(nodes.length);
			$.each(nodes, function(index, node) {
				if (node.leaf) {
					node.selectable = true;
					node.icon = viewConf.leafIcon;
				} else {
					if (!node.nodes) {
						node.nodes = [];
					}
					node.selectable = false;
					node.icon = viewConf.nodeIcon;
				}
				// 根据自定义配置设置节点可否被选择
				if (viewConf.folderSelectable) {
					node.selectable = true;
				}

				if (node.state == null) {
					node.state = {
						checked: false,
						disabled: false,
						expanded: false,
						selected: false
					};
				}
				let preNode = nodes[node.__bdoParentId];
				if (preNode) {
					if (!preNode.nodes) {
						preNode.nodes = [];
					}
					let subNode = preNode.nodes.find(subNode => subNode._bdoNodeId == node._bdoNodeId);
					if (!subNode) {
						preNode.nodes.push(node);
					}
					rem[node.__bdoNodeId] = 1;
				}
			});
			this.__nodes = nodes.filter(node => rem[node.__bdoNodeId] != 1);
			return this.__nodes;
		},
		setQueryInfo(url, params, opts) {
			this.queryObj = {
				url: url,
				params: params,
				opts: opts
			};
		},
		getQueryInfo() {
			return this.queryObj;
		},
		expandedFun(event, node) {
			//lazyLoad懒加载如果为true则只更新一级节点
			let me = $(this).data('$tree');
			let lazyLoad = me.options.lazyLoad;
			let parentId = node.parentId;
			if (lazyLoad != null && lazyLoad === false && parentId != null) {
				return;
			}
			if (me.options.onceLoad) {
				return;
			}
			let queryObj = me.getQueryInfo();
			if (queryObj == null) {
				queryObj = {};
				queryObj.url = me.options.url;
				queryObj.params = (typeof me.options.params === 'function' ? me.options.params() : me.options.params); //me.options.params;
				queryObj.params.param1 = encodeURIComponent(node.value);
				queryObj.params.param2 = encodeURIComponent(node.id);
				queryObj.params.param3 = encodeURIComponent(node.label);
				queryObj.params.param4 = encodeURIComponent(node.switchNode);
				queryObj.params.param5 = encodeURIComponent(node.parentId) == 'undefined' ? 'root' : encodeURI(node.parentId);
				queryObj.params.param6 = encodeURIComponent(node.typeName);
				queryObj.params.param7 = encodeURIComponent(node.checked) == 'undefined' ? null : encodeURI(node.checked);
				queryObj.params.param8 = encodeURIComponent(node.ischeckbox) == 'undefined' ? null : encodeURI(node.ischeckbox);
			}
			let subTreeDataJson = me.getTreeData(queryObj);
			queryObj = null; // 重新置为null
			if (subTreeDataJson && subTreeDataJson.length > 0) {
				let startIndex = me._bdoTreeDatas.length;
				me.setInitTreeData(subTreeDataJson);
				me.setInitTreeDataMap();
				me.setInitTree();
				let treeNodes = me.treeInstance.getAllNodes();
				for (let i = startIndex, len = me._bdoTreeDatas.length; i < len; i++) {
					treeNodes.push(me._bdoTreeDatas[i]);
					let parentNode = treeNodes.find(function(mNode) {
						return mNode._bdoNodeId == me._bdoTreeDatas[i]._bdoParentId;
					});
					if (parentNode) {
						if (!parentNode.nodes) {
							parentNode.nodes = [];
						}
						if (!parentNode.nodes.find(node_ => node_.id == me._bdoTreeDatas[i].id)) {
							parentNode.nodes.push(me._bdoTreeDatas[i]);
						}
					} else {
						if (me.options && me.options.opts && me.options.opts.updateNode === true) {
							$.each(currentNode, (key, val) => {
								if (val) {
									treeNodes[me._bdoTreeDatas[i].nodeId][key] = val;
								}
							});
						}
					}
				}
				$.each(node.nodes, (key, sNodes) => {
					sNodes.state.checked = node.state.checked;
				});
			} else {
				//let node = $(event.target).treeview(true).getAllNodes()[node.nodeId];
				if (node.leaf === true) {
					node.nodes = null;
				} else {
					node.nodes = [];
				}
			}
		},
		getTreeMultiValue() {
			let checkedNode = '';
			$.each($('#' + this.elementId).treeview('getChecked'), function(index, info) {
				checkedNode += info.value + ',';
			});
			return checkedNode.substr(0, checkedNode.length - 1);
		},
		getAbstractLabel() {
			let checkNodes = $('#' + this.elementId).treeview('getChecked');
			if (checkNodes.length > 1) {
				return checkNodes[0].text + '...   +' + (checkNodes.length - 1);
			} else {
				return checkNodes[0].text;
			}
		},
		getTreeMultiLabel() {
			let checkedNode = '';
			$.each($('#' + this.elementId).treeview('getChecked'), function(index, info) {
				checkedNode += info.label + ',';
			});
			return checkedNode.substr(0, checkedNode.length - 1);
		},
		singleSelectNodeChecked(event, node) {
			//清除其他的选中节点
			$(this).treeview('uncheckAll', {
				silent: true
			});
			//递归打开某节点的所有关闭的子节点后再关闭
			loadAllDataForOnNode(node, $(this));
			let ss = [];
			ss[0] = node.nodeId;
			if (ss) { //子节点不为空，则选中所有子节点
				$(this).treeview('checkNode', [ss, {
					silent: true
				}]);
			}
		},
		selectNodeChecked(event, node) {
			//递归打开某节点的所有关闭的子节点后再关闭
			loadAllDataForOnNode(node, $(this));
			let selectNodes = getChildNodeIdArr(node); //获取所有子节点
			if (selectNodes) { //子节点不为空，则选中所有子节点
				$(this).treeview('checkNode', [selectNodes, {
					silent: true
				}]);
			}
			//子节点全选后父节点选中
			setParentNodeCheck(node, $(this), true);
		},
		nodeUnchecked(event, node) {
			let selectNodes = getChildNodeIdArr(node); //获取所有子节点
			if (selectNodes) { //子节点不为空，则取消选中所有子节点
				$(this).treeview('uncheckNode', [selectNodes, {
					silent: true
				}]);
			}
		},
		getCheckedData() {
			let checkedNode = [];
			$.each($('#' + this.elementId).treeview('getChecked'), function(index, info) {
				checkedNode.push(info);
			});
			return checkedNode;
		},
		checkAll() {
			//全选
			this.$element.treeview('checkAll', {
				silent: true
			});
		}
	});

	$.fn[pluginName] = function(options, args) {
		let result = null;
		this.each(function() {
			let _this = $.data(this, pluginName);
			if (typeof options === 'string') {
				if (!_this) {
					logError('Not initialized, can not call method : ' + options);
				} else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
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
				$.data(this, pluginName, new Tree(this, $.extend(true, {}, options)));
			}
		});
		return result || this;
	};

})(jQuery, window, document);



