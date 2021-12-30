//(function(){
var page = new Page({
	container : '#main-container',
	events : {
		'#turnBack' : 'click,onTurnBackClick',
		'#fsRefresh' : 'click,onFsRefreshClick',
		'#uploadFileBtn' : 'click,onUploadFileBtnClick',
		'#addFolderBtn' : 'click,onAddFolderBtnClick',
		'#addSaveBtn' : 'click,onAddSaveBtnClick',
		'#fileUploadFileName' : 'change,onFileUploadChange',
		'#editSaveBtn' : 'click,onEditSaveBtnClick'
	},
	taskOptions: {
		groupId: '',
		height: 0,
		folderId: '',
		folderName: '',
		$el: '#taskDetail',
		pageSize: 10
	},
	taskView: null,
	init : function(options) {
		this.taskOptions.height = this.mainHeight - this.contentBlockTopOffset - 120;
		this.taskView = task(this.taskOptions);
		
		this.cmp.folderTreeWrap.height(this.taskOptions.height+'px');
		this.customerTreeComboInit({param1: -1,param2:-1});
		this.cmp.turnBack.hide();
	},
	customerTreeComboInit: function(param) {
		var me = this;
		me.cmp.customerTreeCombo.treecombo({
			url : './cpBase/TreeCommon.customerTree.json',
			params : {
				menuId : window.sys_menuId
			},
			view : {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: true,
				multiSelect: false
			},
			nodeSelectedCallback : me.onNodeSelectedCallback.bind(this)
		});
		me.loadFolderTreeTable(param);
	},
	onNodeSelectedCallback : function(tree, data) {
		var me = this;
		var value = data.result;
		if('集团' == value || '非集团' == value || !$.isNumeric(value)) {
			me.cmp.folderTree.empty();
			me.loadFolderTreeTable({param1: -1,param2:-1});
			return;
		}
		me.createFolderTree({param10: value});
	},
	folderTreeOptions : {
		url : './cpBase/TreeCommon.findCusFileSystemTree.json',
		params : {
			param13: '1',
			param12: '01'
		},
		view : {
			leafIcon: 'fa fa-folder text-primary',
			nodeIcon: 'fa fa-folder text-primary',
			folderSelectable: true,
			multiSelect: false,
			showBorder: 0,
			borderColor: '#000',
			selectColor: '#fff'
		}
	},
	createFolderTree : function(param) {
		this.folderTreeOptions.params.param10 = param ? param.param10 : null;
		this.cmp.folderTree.tree(this.folderTreeOptions);
		this.cmp.folderTree.on('nodeSelected',this.onFolderTreeNodeSelected.bind(this));
		this.cmp.folderTree.on('nodeUnselected', this.onFolderTreeNodeUnSelected.bind(this));
		this.cmp.folderTree.treeview(true).selectNode(0);
		
		this.taskView.jsonData.groupId = this.folderTreeOptions.params.param10;
	},
	reflashFolderTree : function() {
		var me = this;
		var tv = me.cmp.folderTree.treeview(true);
		var tvc = me.cmp.customerTreeCombo.treecombo(true);
		var node = tv.getSelected()[0];
		if(node.nodeId != 0) {
			var nodes = me.searchPath(node.value);
			var parentNode = nodes[1];
			tv.toggleNodeExpanded(parentNode.nodeId);
			tv.expandNode(parentNode.nodeId);
			
			tv.toggleNodeExpanded(node.nodeId);
			tv.toggleNodeSelected(node.nodeId);
			tv.selectNode(node.nodeId);
		}else {
			me.createFolderTree({param10:tvc.getTreeComboValue()});
		}
	},
	onFolderTreeNodeSelected : function(event, node) {
		var me = this;
		this.taskView.jsonData.folderId = node.value;
		this.taskView.jsonData.folderName = node.label;
		
		if(me.selectCount == undefined || me.selectCount > 2) {
			me.selectCount = 0;
		}
		me.selectCount++;
		if(me.selectCount == 1) {
			me.currentNode = node;
		}
		if(me.selectCount == 2) {
			me.newNode = node;
		}
		if(me.unselectFlag == true) {
			me.unselectFlag = false;
			return;
		}
		
		var tv = me.cmp.folderTree.treeview(true);
		var tcv = me.cmp.customerTreeCombo.treecombo(true);
		var param2 = tcv.getTreeComboValue();
		me.loadFolderTreeTable({param1:node.value,param2:param2});
		if(!node.leaf) {
			tv.expandNode(node.nodeId);
		}
		this.setPath(node.value);
		
		if(me.selectCount == 2 && me.currentNode.nodeId != me.newNode.nodeId) {
			me.selectFlag = true;
			tv.unselectNode(me.currentNode.nodeId);
		}
	},
	onFolderTreeNodeUnSelected : function(event, node) {
		//console.log('onCustomerTreeNodeUnSelected---'+node.nodeId+'---'+this.selectCount);
		var me = this;
		me.selectCount = 0;
		if(me.selectFlag == true) {
			me.selectFlag = false;
			return;
		}
		var tv = me.cmp.folderTree.treeview(true);
		me.unselectFlag = true;
		tv.selectNode(node.nodeId);
	},
	loadFolderTreeTable : function(params) {
		var me = this;
		var folderTreeTable = me.cmp.folderTreeTable;
		if(folderTreeTable.hasInited) {
			folderTreeTable.datagrid('load', {
				menuId : window.sys_menuId,
				sqlId : 'RC10004',
				param1 : params.param1,
				param2 : params.param2
			});
			return;
		}
		easyloader.load(['datagrid'],function(){
			folderTreeTable.datagrid({
				height: me.taskOptions.height-10,
				//width: 608,
				border: 'none',
				singleSelect : true,
				animate: true,
				queryParams: {
					menuId : window.sys_menuId,
					sqlId : 'RC10004',
					param1 : params.param1,
					param2 : params.param2
				},
				idField: 'fileSystemId',
				treeField: 'label',
				rowStyler: function(row){
				},
				columns:[[
					{title:'目录序号', field: 'fileSystemId', hidden: true},
					{title:'文件名',field:'fileName',width:300,formatter: function(value, row, index) {
						var iconClass = '';
						if(row.fileType == '01') {
							iconClass = 'fa fa-folder text-primary';
						}else {
							iconClass = 'fa fa-file text-primary';
						}
						var rowhtml = '';
						rowhtml += '<a data-edit="'+row.fileSystemId+'" data-placement="top" title="修改" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-edit" data-edit="'+row.fileSystemId+'"></i></a>&nbsp;&nbsp;';
						rowhtml += '<a data-del="'+row.fileSystemId+'" data-placement="top" title="删除" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-times" data-del="'+row.fileSystemId+'"></i></a>&nbsp;&nbsp;';
						if(row.fileType == '02') {
							rowhtml += '<a data-download="'+row.fileSystemId+'" data-placement="top" title="下载" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-download" data-download="'+row.fileSystemId+'"></i></a>&nbsp;&nbsp;'
						}
						var wrapp = '<div class="row"><div class="col-xs-8">'
							+'			<i class="'+iconClass+'"></i>'+value
							+'			</div><div class="col-xs-2">'
							+'			'+rowhtml
							+'		</div></div>';
						return wrapp;
					}},
					{title:'修改时间',field:'lastUpdateDate',width:150, formatter: function(value, row, index) {
						return new Date(value).format('yyyy-MM-dd HH:mm:ss');
					}},
					{title:'最近修改人',field:'lastUpdateUser',width:100, formatter: function(value, row, index) {
						return row.__ulastUpdateUser.userName;
					}}
				]],
				loader: function(param, success, error){
					if(!param.param1) {
						success([]);
						return;
					}
					$.ajax({
						url: 'cusBase/CusGeneral.query.json',
						type: 'post',
						data: param,
						dataType: 'json',
						success: function(data){
							success(data.data);
						}
					});
				},
				onDblClickRow: function(index, data) {
					if(data.fileType == '01') {
						var treeNodes = me.cmp.folderTree.treeview(true).getAllNodes();
						$(treeNodes).each(function(index) {
							if(data.fileSystemId == this.value){
								me.cmp.folderTree.treeview(true).selectNode(this);

							}
						});
					}
				}
			});
			folderTreeTable.hasInited = true;
			folderTreeTable.datagrid('getPanel').on('click', 'a[data-del]', me.onDeleteFileClick.bind(me));
			folderTreeTable.datagrid('getPanel').on('click', 'a[data-edit]', me.onEditFileClick.bind(me));
			folderTreeTable.datagrid('getPanel').on('click', 'a[data-download]', me.onDownloadFileClick.bind(me));
		});
	},
	setPath : function(fsId) {
		var me = this;
		if(fsId == '1') {
			me.cmp.turnBack.hide();
		}else {
			me.cmp.turnBack.show();
		}
		var paths = me.searchPath(fsId);
		var html = '';
		for(var i = paths.length - 1; i >= 0; i--) {
			var name = paths[i].label;
			var id = paths[i].value;
			var nodeId = paths[i].nodeId;
			var pathClass = '';
			if(id != fsId) {
				html += '<li style="text-transform: lowercase;"><a class="link-effect" data-fsid="'+id+'" data-ftnodeid="'+nodeId+'" style="cursor: pointer;">'+name+'</a></li>';
			}else {
				html += '<li style="text-transform: lowercase;">'+name+'</li>';
			}
		}
		me.cmp.fsPath.empty();
		me.cmp.fsPath.append(html);
		me.cmp.fsPath.on('click', 'a.link-effect', me.onFsPathClick.bind(me));
	},
	searchPath : function(fsId) {
		var me = this;
		var tv = me.cmp.folderTree.treeview(true);
		var treeNodes = tv.getAllNodes();
		var result = [];
		$(treeNodes).each(function(index) {
			if(fsId == this.value){
				result.push(this);
				if(this._bdoParentId && this._bdoParentId != '0') {
					result = result.concat(me.searchPath(this._bdoParentId));
				}
			}
		});
		if(result.length == 0) {
			result.push(tv.getSelected()[0]);
		}
		return result;
	},
	onFsPathClick: function(event) {
		var $this = $(event.target);
		var nodeid = $this.data('ftnodeid');
		var me = this;
		me.cmp.folderTree.treeview(true).selectNode(nodeid);
	},
	onTurnBackClick : function(event) {
		var me = this;
		me.cmp.folderTree.treeview(true).selectNode(0);
	},
	onFsRefreshClick: function(event) {
		var param = {param1: this.taskView.jsonData.folderId, param2: this.taskView.jsonData.groupId};
		if($.isNumeric(param.param1) && $.isNumeric(param.param2) ) {
			this.loadFolderTreeTable(param);
		}
	},
	onEditFileClick : function(evt) {
		evt.preventDefault();
		var me = this;
		var $this = $(evt.target);
		var fsId = $this.attr('data-edit');
		if(fsId) {
			var rowData = me.cmp.folderTreeTable.datagrid('getSelected');
			if(rowData) {
				me.cmp.folderTreeTable.datagrid('unselectRow', rowData.fileSystemId);
			}
			me.cmp.folderTreeTable.datagrid('selectRecord', fsId);
			rowData = me.cmp.folderTreeTable.datagrid('getSelected', fsId);
			me.cmp.modalEditFolder.modal('show');
			me.cmp.e_parentId.val(rowData.parentId);
			me.cmp.e_fileName.val(rowData.fileName);
			me.cmp.e_fileSystemId.val(rowData.fileSystemId);
			var nodes = me.searchPath(fsId);
			var label = nodes.length > 1 ? nodes[1].label : nodes[0].label;
			me.cmp.e_path.treecombo(true).options.params.param11 = fsId;
			me.cmp.e_path.treecombo('setTreeComboValue',[rowData.parentId, label]);
		}
	},
	onDeleteFileClick : function(evt) {
		evt.preventDefault();
		var $this = $(evt.target);
		var me = this;
		if($this.attr('data-del')) {
			bdoConfirmBox('系统提示', '确定要删除该文件吗？', function(){
				me.deleteFile($this.attr('data-del'));
			});
		}
	},
	deleteFile : function(fsId) {
		var me = this;
		var tv = me.cmp.folderTree.treeview(true);
		$.ajax({
			url : 'cusBase/CusRc.deleteFolder.json',
			type : 'post',
			data : {
				param1 : fsId
			},
			dataType: 'json',
			async : false,
			success : function(data){
				if(data.success === true){
					me.reflashFolderTree();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	},
	onDownloadFileClick : function(evt) {
		evt.preventDefault();
		var $this = $(evt.target);
		var me = this;
		if($this.attr('data-download')) {
			me.downloadFile('cusBase/CusRc.downloadFile.json', {
				param1 : $this.attr('data-download')
			});
		}
	},
	onUploadFileBtnClick : function(evt) {
		var me = this;
		var customerId = me.cmp.customerTreeCombo.treecombo('getTreeComboValue');
		if(!$.isNumeric(customerId)) {
			bdoErrorBox('错误', '必须进入到客户具体目录下才能上传文件！');
			return;
		}
		me.cmp.fileUploadFileName.trigger('click');
	},
	onAddFolderBtnClick : function(evt){
		var me = this;
		var customerId = me.cmp.customerTreeCombo.treecombo('getTreeComboValue');
		if(!$.isNumeric(customerId)) {
			bdoErrorBox('错误', '必须进入到客户具体目录下才能创建文件夹！');
			return;
		}
		evt.preventDefault();
		this.cmp.modalNewFolder.modal('show');
	},
	onAddSaveBtnClick : function(evt){
		evt.preventDefault();
		var me = this;
		var submitUrl = 'cusBase/CusRc.addFolder.json';
		var tv = me.cmp.folderTree.treeview(true);
		var parentId = tv.getSelected();
		var node = parentId ? parentId[0] : null;
		var nodeId = node ? node.nodeId : 0;
		parentId = parentId ? parentId[0].value : 0;
		
		var customerId = me.cmp.customerTreeCombo.treecombo('getTreeComboValue');
		if(!$.isNumeric(customerId)) {
			bdoErrorBox('错误', '必须进入到客户具体目录下才能创建文件夹！');
			return;
		}
		
		var data = {
			jsonData : JSON.stringify({
				parentId : parseInt(parentId),
				groupId : parseInt(customerId),
				fileName : me.cmp.n_fileName.val()
			})
		};
		me.cmp.newFolderForm.formview(
			'setAjaxConf',
			[
				submitUrl,
				data,
				'json',true,
				function(data) {
					if(data.success === true){
						me.reflashFolderTree();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
					me.cmp.modalNewFolder.modal('hide');
				}
			]
		);
		me.cmp.newFolderForm.submit();
	},
	onEditSaveBtnClick : function(evt){
		evt.preventDefault();
		var me = this;
		var submitUrl = 'cusBase/CusRc.updateFolder.json';
		var parentId = me.cmp.e_path.treecombo(true).getTreeComboValue();
		var data = {
			jsonData : JSON.stringify({
				parentId : parseInt(parentId),
				fileSystemId : parseInt(me.cmp.e_fileSystemId.val()),
				fileName : me.cmp.e_fileName.val()
			})
		};
		me.cmp.editFolderForm.formview(
			'setAjaxConf',
			[
				submitUrl,
				data,
				'json',true,
				function(data) {
					if(data.success === true){
						me.reflashFolderTree();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
					me.cmp.modalEditFolder.modal('hide');
				}
			]
		);
		me.cmp.editFolderForm.submit();
	},
	onFileUploadChange : function(evt) {
		var $this = $(evt.target);
		var me = this;
		var tv = me.cmp.folderTree.treeview(true);
		var node = tv.getSelected();
		node = node ? node[0] : {nodeId: 0,value:0};
		var customerId = me.cmp.customerTreeCombo.treecombo('getTreeComboValue');
		if(!$.isNumeric(customerId)) {
			bdoErrorBox('错误', '必须进入到客户具体目录下才能上传文件！');
			return;
		}
		if($this.val() && $this.val() != '') {
			var formData = new FormData();
			formData.append('parentId', node.value);
			formData.append('customerId', customerId);
			formData.append('file', me.cmp.fileUploadFileName.get(0).files[0]);
			$this.val('');
			$.ajax({
				url : 'cusBase/CusRc.uploadFile.json',
				type : 'POST',
				data : formData,
				contentType : false,
				processData : false,
				success : function(data){
					if(data.success === true){
						me.reflashFolderTree();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}
	},
	subPages: [{
		id : 'modalNewFolder',
		type : 'modal',
		title : '新建文件夹',
		modalBody : [{
			id : 'newFolderForm',
			type : 'form',
			options : {
				display : 'tableform-one',
				column : 4,
				buttons : [
					{
						id : 'addSaveBtn',
						icon : 'fa-floppy-o',
						style : 'btn-primary',
						text : '确认'
					},
					{
						id :  'add_close',
						icon : 'fa-sign-out',
						style : 'btn-css1 btn-warning',
						text : '关闭'
					}
				],
				items : [
					{
						id :  'n_parentId',
						type : 'input',
						label : '',
						typeAttr:{
							type : 'hidden'
						}
					},{
						id :  'n_fileName',
						type : 'input',
						label : '新建文件夹名称',
						rowspan : 1,
						colspan : 1,
						validate : {
							rules : {
								required : true,
								maxlength : 100
							}
						}
					}
				]
			}
		}]
	},{
		id : 'modalEditFolder',
		type : 'modal',
		title : '修改文件',
		modalBody : [{
			id : 'editFolderForm',
			type : 'form',
			options : {
				display : 'tableform-one',
				column : 4,
				buttons : [
					{
						id : 'editSaveBtn',
						icon : 'fa-floppy-o',
						style : 'btn-primary',
						text : '确认'
					},
					{
						id :  'add_close',
						icon : 'fa-sign-out',
						style : 'btn-css1 btn-warning',
						text : '关闭'
					}
				],
				items : [
					{
						id :  'e_parentId',
						type : 'input',
						label : '',
						typeAttr:{
							type : 'hidden'
						}
					},{
						id :  'e_fileSystemId',
						type : 'input',
						label : '',
						typeAttr:{
							type : 'hidden'
						}
					},{
						id :  'e_path',
						type : 'input',
						label : '目录',
						rowspan : 1,
						colspan : 1,
						validate : {
							rules : {
								required : true,
								maxlength : 100
							}
						},
						plugin : {
							name : 'treecombo',
							options :{
								url : './cpBase/TreeCommon.findCusFileSystemTree.json',
								params : {
									
								},
								view : {
									leafIcon: 'fa fa-folder text-primary',
									nodeIcon: 'fa fa-folder text-primary',
									folderSelectable: true,
									multiSelect: false
								}
							}
						}
					},{
						id :  'e_fileName',
						type : 'input',
						label : '文件名称',
						rowspan : 1,
						colspan : 1,
						validate : {
							rules : {
								required : true,
								maxlength : 100
							}
						}
					}
				]
			}
		}]
	}]
});
//}());