(function(){
let page = new Page({
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
		this.taskView.jsonData.groupId = groupId;
		this.createFolderTree();
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
	createFolderTree : function() {
		this.cmp.folderTreeWrap.height(this.taskOptions.height+'px');
		this.cmp.folderTree.tree(this.folderTreeOptions);
		this.cmp.folderTree.on('nodeSelected',this.onFolderTreeNodeSelected.bind(this));
		this.cmp.folderTree.on('nodeUnselected', this.onFolderTreeNodeUnSelected.bind(this));
		this.cmp.folderTree.treeview(true).selectNode(0);
	},
	reflashFolderTree : function() {
		let me = this;
		let tv = me.cmp.folderTree.treeview(true);
		let node = tv.getSelected()[0];
		if(node.nodeId != 0) {
			let nodes = me.searchPath(node.value);
			let parentNode = nodes[1];
			tv.toggleNodeExpanded(parentNode.nodeId);
			tv.expandNode(parentNode.nodeId);
			
			tv.toggleNodeExpanded(node.nodeId);
			tv.toggleNodeSelected(node.nodeId);
			tv.selectNode(node.nodeId);
		}else {
			me.createFolderTree();
		}
	},
	onFolderTreeNodeSelected : function(event, node) {
		let me = this;
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
		this.taskView.jsonData.folderId = node.value;
		let tv = me.cmp.folderTree.treeview(true);
		me.loadFolderTreeTable(node.value);
		if(!node.leaf) {
			tv.expandNode(node.nodeId);
		}
		me.setPath(node.value);
		
		if(me.selectCount == 2 && me.currentNode.nodeId != me.newNode.nodeId) {
			me.selectFlag = true;
			tv.unselectNode(me.currentNode.nodeId);
		}
	},
	onFolderTreeNodeUnSelected : function(event, node) {
		//console.log('onCustomerTreeNodeUnSelected---'+node.nodeId+'---'+this.selectCount);
		let me = this;
		me.selectCount = 0;
		if(me.selectFlag == true) {
			me.selectFlag = false;
			return;
		}
		let tv = me.cmp.folderTree.treeview(true);
		me.unselectFlag = true;
		tv.selectNode(node.nodeId);
	},
	loadFolderTreeTable : function(parentId) {
		let me = this;
		let folderTreeTable = me.cmp.folderTreeTable;
		if(folderTreeTable.hasInited) {
			folderTreeTable.datagrid('load', {
				menuId : window.sys_menuId,
				sqlId : 'RC10003',
				param1 : parentId,
				param2 : groupId
			});
			return;
		}
		easyloader.load(['datagrid'],function(){
			folderTreeTable.datagrid({
				height: me.taskOptions.height-10,
				singleSelect : true,
				animate: true,
				queryParams: {
					menuId : window.sys_menuId,
					sqlId : 'RC10003',
					param1 : parentId,
					param2 : groupId
				},
				idField: 'fileSystemId',
				treeField: 'label',
				rowStyler: function(row){
				},
				columns:[[
					{title:'目录序号', field: 'fileSystemId', hidden: true},
					{title:'文件名',field:'fileName',width:300,formatter: function(value, row, index) {
						let iconClass = '';
						if(row.fileType == '01') {
							iconClass = 'fa fa-folder text-primary';
						}else {
							iconClass = 'fa fa-file text-primary';
						}
						let rowhtml = '';
						rowhtml += '<a data-edit="'+row.fileSystemId+'" data-placement="top" title="修改" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-edit" data-edit="'+row.fileSystemId+'"></i></a>&nbsp;&nbsp;';
						rowhtml += '<a data-del="'+row.fileSystemId+'" data-placement="top" title="删除" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-times" data-del="'+row.fileSystemId+'"></i></a>&nbsp;&nbsp;';
						if(row.fileType == '02') {
							rowhtml += '<a data-download="'+row.fileSystemId+'" data-placement="top" title="下载" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-download" data-download="'+row.fileSystemId+'"></i></a>&nbsp;&nbsp;'
						}
						let wrapp = '<div class="row"><div class="col-xs-8">'
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
						let treeNodes = me.cmp.folderTree.treeview(true).getAllNodes();
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
		let me = this;
		if(fsId == '1') {
			me.cmp.turnBack.hide();
		}else {
			me.cmp.turnBack.show();
		}
		let paths = me.searchPath(fsId);
		let html = '';
		for(let i = paths.length - 1; i >= 0; i--) {
			let name = paths[i].label;
			let id = paths[i].value;
			let nodeId = paths[i].nodeId;
			let pathClass = '';
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
		let me = this;
		let tv = me.cmp.folderTree.treeview(true);
		let treeNodes = tv.getAllNodes();
		let result = [];
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
		let $this = $(event.target);
		let nodeid = $this.data('ftnodeid');
		let me = this;
		me.cmp.folderTree.treeview(true).selectNode(nodeid);
	},
	onTurnBackClick : function(event) {
		let me = this;
		me.cmp.folderTree.treeview(true).selectNode(0);
	},
	onFsRefreshClick : function(event) {
		this.loadFolderTreeTable(this.taskView.jsonData.folderId);
	},
	onEditFileClick : function(evt) {
		evt.preventDefault();
		let me = this;
		let $this = $(evt.target);
		let fsId = $this.attr('data-edit');
		if(fsId) {
			let rowData = me.cmp.folderTreeTable.datagrid('getSelected');
			if(rowData) {
				me.cmp.folderTreeTable.datagrid('unselectRow', rowData.fileSystemId);
			}
			me.cmp.folderTreeTable.datagrid('selectRecord', fsId);
			rowData = me.cmp.folderTreeTable.datagrid('getSelected', fsId);
			me.cmp.modalEditFolder.modal('show');
			me.cmp.e_parentId.val(rowData.parentId);
			me.cmp.e_fileName.val(rowData.fileName);
			me.cmp.e_fileSystemId.val(rowData.fileSystemId);
			let nodes = me.searchPath(fsId);
			let label = nodes.length > 1 ? nodes[1].label : nodes[0].label;
			me.cmp.e_path.treecombo(true).options.params.param11 = fsId;
			me.cmp.e_path.treecombo('setTreeComboValue',[rowData.parentId, label]);
		}
	},
	onDeleteFileClick : function(evt) {
		evt.preventDefault();
		let $this = $(evt.target);
		let me = this;
		if($this.attr('data-del')) {
			bdoConfirmBox('系统提示', '确定要删除该文件吗？', function(){
				me.deleteFile($this.attr('data-del'));
			});
		}
	},
	deleteFile : function(fsId) {
		let me = this;
		let tv = me.cmp.folderTree.treeview(true);
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
		let $this = $(evt.target);
		let me = this;
		if($this.attr('data-download')) {
			me.downloadFile('cusBase/CusRc.downloadFile.json', {
				param1 : $this.attr('data-download')
			});
		}
	},
	onUploadFileBtnClick : function(evt) {
		let me = this;
		me.cmp.fileUploadFileName.trigger('click');
	},
	onAddFolderBtnClick : function(evt){
		evt.preventDefault();
		this.cmp.modalNewFolder.modal('show');
	},
	onAddSaveBtnClick : function(evt){
		evt.preventDefault();
		let me = this;
		let submitUrl = 'cusBase/CusRc.addFolder.json';
		let tv = me.cmp.folderTree.treeview(true);
		let parentId = tv.getSelected();
		let node = parentId ? parentId[0] : null;
		let nodeId = node ? node.nodeId : 0;
		parentId = parentId ? parentId[0].value : 0;
		let data = {
			jsonData : JSON.stringify({
				parentId : parseInt(parentId),
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
		let me = this;
		let submitUrl = 'cusBase/CusRc.updateFolder.json';
		let parentId = me.cmp.e_path.treecombo(true).getTreeComboValue();
		let data = {
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
		let $this = $(evt.target);
		let me = this;
		let tv = me.cmp.folderTree.treeview(true);
		let node = tv.getSelected();
		node = node ? node[0] : {nodeId: 0,value:0};
		if($this.val() && $this.val() != '') {
			let formData = new FormData();
			formData.append('parentId', node.value);
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
}());