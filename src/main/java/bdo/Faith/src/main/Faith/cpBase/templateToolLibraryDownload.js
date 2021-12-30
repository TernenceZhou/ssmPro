
function RcsPage2(agrs){
let _template = agrs.template || tplLoader('cpBase/templateToolLibraryDownload.html')
//	,customerId = agrs.data.customerId
//	,projectId = agrs.data.projectId
,customerId = null
	,projectId = null;
$(agrs.region).html(_template);
$('#utilModal').on('hidden.bs.modal', function(){
$(agrs.region).empty();
});
var page = new Page({
	container : '#main-containerModal',
	events : {
		'#turnBack' : 'click,onTurnBackClick',
		'#fsRefresh' : 'click,onFsRefreshClick',
		'#uploadFileBtn' : 'click,onUploadFileBtnClick',   
		'#addFolderBtn' : 'click,onAddFolderBtnClick',
		'#addSaveBtn' : 'click,onAddSaveBtnClick',
		'#fileUploadFileName' : 'change,onFileUploadChange',
		'#editSaveBtn' : 'click,onEditSaveBtnClick'
	},
	height: 0,
	data : {
		folderId: 0,
//		customerId: customerId
	},
	init : function(options) {
		this.height = this.mainHeight - this.contentBlockTopOffset - 120;
		console.log(this.height);
//		this.cmp.folderTreeWrap.height(this.height+'px');
		
		//this.customerTreeComboInit({param1: -1,param2:-1});
		this.createFolderTree();
		//this.loadFolderTreeTable({param1: -1, param2: -1});
		this.cmp.turnBack.hide();
		this.uploadWorkpagerPage = createForm(this.uploadWorkpagerPageCfg);
	},
	uploadWorkpagerPageCfg: {
		options: {
			propsData: {
				jsonData: {
					workpager: [],
//					customerId : window.CUR_CUSTOMERID,
//					projectId : window.CUR_PROJECTID,
					parentId : null,
					file : null
				}
			}
		},
		props: {
			jsonData: Object
		},
		display: 'tableform-one',
		column: 1,
		id: 'rcsuploadFileForm',
		data() {
			return {
				ajaxConfig: {
					type : 'POST',
					url : './cpBase/KTemplateLibrary.uploadTemplateLibraryFile.json',
					dataType : 'json',
					success(data) {
						if(data.success === true){
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#rcsuploadTplFormModal').modal('hide');
							page.reflashFolderTree();
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			}
		},
		methods: {
			onUploadDraftFileClick(event){
				var fileCount = $("#workpager").fileinput('getFilesCount');
				if(fileCount<=0){
					bdoErrorBox('失败', "当前无任何文件！");
					return;
				}
				var tv = page.cmp.folderTree.treeview(true);
				var node = tv.getSelected();
				this.jsonData.parentId = node[0].id;
				this.uploadFile(true);
			},
			resetFileClick(event){
				$("#workpager").fileinput('refresh');
				$("#workpager").fileinput('clear');
				$("#workpager").fileinput('reset');
			}
		},
		buttons: [{
			id: 'resetFileBtn',
			icon: 'fa fa-refresh',
			style: 'btn-primary',
			text: '重置',
			typeAttr: {
				'v-on:click': 'resetFileClick'
			}
		},{
			id: 'uploadDraftFileBtn',
			icon: 'fa fa-upload',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onUploadDraftFileClick'
			}
		},{
			id: 'cancelUploadDraftFileBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'data-dismiss': 'modal'
			}
		}],
		items: [{
			id :  'workpager',
			type : 'file',
			label : '文件',
			rowspan : 1,
			colspan : 2,
			validate : {
				rules : {
					required: true
				}
			},
			typeAttr:{
				multiple:true
			},
			show: true,
			plugin : {
				name : 'fileinput',
				options : {
					allowedFileExtensions: ['zip', 'rar'],
					uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
					uploadExtraData() {
						return {}
					}
				}
			}
		}]
	},
	folderTreeOptions : {
		url : './cpBase/TreeCommon.findDgTemplateLibiaryTree.json',
		params : {
			param13: '1',
			param12: '01',
//			param22: customerId,
//			param23: projectId
		},
		view : {
			leafIcon: 'fa fa-folder text-primary',
			nodeIcon: 'fa fa-folder text-primary',
			folderSelectable: true,
			multiSelect: false,
			showBorder: 0,
			borderColor: '#000',
			selectColor: '#fff'
		},
		opts: {
			updateNode: true
		}
	},
	createFolderTree : function(param) {
		this.cmp.folderTree.tree(this.folderTreeOptions);
		this.cmp.folderTree.on('nodeSelected',this.onFolderTreeNodeSelected.bind(this));
		this.cmp.folderTree.on('nodeUnselected', this.onFolderTreeNodeUnSelected.bind(this));
		if(typeof this.cmp.folderTree.treeview(true).selectNode === 'function') {
			this.cmp.folderTree.treeview(true).selectNode(0);
		}
	},
	reflashFolderTree : function() {
		var me = this;
		var tv = me.cmp.folderTree.treeview(true);
		if(tv instanceof jQuery) {
			me.createFolderTree();
			tv = me.cmp.folderTree.treeview(true);
		}
		var node = tv.getSelected()[0];
		if(node.nodeId != 0) {
			var nodes = me.searchPath(node.value);
			var parentNode = nodes[1];
			tv.toggleNodeExpanded(parentNode.nodeId);
			tv.expandNode(parentNode.nodeId);
			tv.toggleNodeExpanded(node.nodeId);
			tv.toggleNodeSelected(node.nodeId);
			tv.expandNode(node.nodeId);
			tv.selectNode(node.nodeId);
		}else {
			me.createFolderTree();
		}
	},
	onFolderTreeNodeSelected : function(event, node) {
		var me = this;
		me.data.folderId = node.value;
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
		
		me.loadFolderTreeTable({param1: node.value});
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
		$('#folderTree').height(me.height-10);
		$('#folderTree').find('ul').css('height','90%');
		var folderTreeTableModal = me.cmp.folderTreeTableModal;
		if(folderTreeTableModal.hasInited) {
			folderTreeTableModal.datagrid('load', {
				menuId : window.sys_menuId,
				sqlId : 'DG00056',
				param1 : params.param1,
//				param2 : customerId,
//				param3 : projectId,
				start: -1,
				limit: -1
			});
			return;
		}
		easyloader.load(['datagrid'],function(){
			folderTreeTableModal.datagrid({
				height: me.height-10,
				//width: 608,
				border: 'none',
				singleSelect : true,
				animate: true,
				queryParams: {
					menuId : window.sys_menuId,
					sqlId : 'DG00056',
					param1 : params.param1,
//					param2 : customerId,
//					param3 : projectId,
					start: -1,
					limit: -1
				},
				idField: 'autoId',
				treeField: 'label',
				rowStyler: function(row){
				},
				columns:[[
					{title:'目录序号', field: 'autoId', hidden: true},
//					{title: '索引号', field: 'fileIndexId', width: 100},
					{title:'文件名',field:'fileName',width:300,formatter: function(value, row, index) {
						var iconClass = '';
						if(row.fileType == '01') {
							iconClass = 'fa fa-folder text-primary';
						}else {
							iconClass = 'fa fa-file text-primary';
						}
						var wrapp = '<div class="row"><div class="col-xs-8">'
							+'			<i class="'+iconClass+'"></i>'+value
							+'			</div><div class="col-xs-2">'
							+'		</div></div>';
						return wrapp;
					}},
					{title: '处理', field:'operate',width:150,align:'center', formatter:function(value, row, index) {
						var rowhtml = '';
//						rowhtml += '<a data-edit="'+row.autoId+'" data-placement="top" title="修改" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-edit" data-edit="'+row.autoId+'"></i></a>&nbsp;&nbsp;'
//						rowhtml += '<a data-del="'+row.autoId+'" data-placement="top" title="删除" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-times" data-del="'+row.autoId+'"></i></a>&nbsp;&nbsp;'
						if(row.fileType == '02') {
							rowhtml += '<a data-download="'+row.autoId+'" data-placement="top" title="下载" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-download" data-download="'+row.autoId+'"></i></a>&nbsp;&nbsp;';
							var suffix = row.suffix.toLowerCase();
							if(suffix == "pdf" || suffix == "jpg" || suffix == "png" || suffix == "jpeg"){
								rowhtml += '<a data-watch="'+row.autoId+'" data-placement="top" title="预览" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-file-text-o" data-watch="'+row.autoId+'"></i></a>&nbsp;&nbsp;'
							}
						}
						var wrapp = '<div class="row">'
							+'			'+rowhtml
							+'		</div>';
						return wrapp;
					}},
					{title:'修改时间',field:'lastUpdateDate',width:150, formatter: function(value, row, index) {
						return new Date(value).format('yyyy-MM-dd HH:mm:ss');
					}},
					{title:'最近修改人',field:'lastUpdateUser',width:100, formatter: function(value, row, index) {
						return row.__ulastUpdateUser.userName;
					}}
				]],
				loading(){
				},
				loadMsg: '',//'<img src="/Faith/img/bdo/loading.gif" width="50px" height="50px">',
				loader: function(param, success, error){
					if(!param.param1) {
						success([]);
						return;
					}
					$.ajax({
						url: 'dgCenter/DgGeneral.query.json',
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
							if(data.autoId == this.value){
								me.cmp.folderTree.treeview(true).selectNode(this);

							}
						});
					}
				}
			});
			folderTreeTableModal.hasInited = true;
			folderTreeTableModal.datagrid('getPanel').on('click', 'a[data-del]', me.onDeleteFileClick.bind(me));
			folderTreeTableModal.datagrid('getPanel').on('click', 'a[data-edit]', me.onEditFileClick.bind(me));
			folderTreeTableModal.datagrid('getPanel').on('click', 'a[data-download]', me.onDownloadFileClick.bind(me));
			folderTreeTableModal.datagrid('getPanel').on('click', 'a[data-watch]', me.onWatchFileClick.bind(me));
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
		this.loadFolderTreeTable({param1: this.data.folderId});
	},
	onEditFileClick : function(evt) {
		evt.preventDefault();
		var me = this;
		var $this = $(evt.target);
		var fsId = $this.attr('data-edit');
		if(fsId) {
			var rowData = me.cmp.folderTreeTableModal.datagrid('getSelected');
			if(rowData) {
				me.cmp.folderTreeTableModal.datagrid('unselectRow', rowData.autoId);
			}
			me.cmp.folderTreeTableModal.datagrid('selectRecord', fsId);
			rowData = me.cmp.folderTreeTableModal.datagrid('getSelected', fsId);
			me.cmp.modalEditFolder.modal('show');
			me.cmp.e_parentId.val(rowData.parentId);
			me.cmp.e_fileName.val(rowData.fileName);
			me.cmp.e_fileSystemId.val(rowData.autoId);
			var nodes = me.searchPath(fsId);
			var label = nodes.length > 1 ? nodes[1].label : nodes[0].label;
			me.cmp.e_path.treecombo(true).options.params.param11 = fsId;
			me.cmp.e_path.treecombo('setTreeComboValue',[rowData.parentId, label]);
		}
	},
	onWatchFileClick : function(evt) {
		evt.preventDefault();
		var $this = $(evt.target);
		var me = this;
		if($this.attr('data-watch')) {
			$.ajax({
				url : 'cpBase/KTemplateLibrary.queryTemplateLibraryFileExistence.json',
				type : 'post',
				data : {
					param1: $this.attr('data-watch'),
//					param2: customerId
				},
				dataType : 'json',
				success : function(data){
					if(data.resultInfo.status=='3'){
						bdoErrorBox('失败', data.resultInfo.statusText);
					}else{
						window.open("cpBase/KTemplateLibrary.previewTemplateLibraryFile.json?param1="+$this.attr('data-watch'),"预览","location=no");
					}
				}
			});
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
			url : 'cpBase/KTemplateLibrary.deleteTemplateLibraryFolder.json',
			type : 'post',
			data : {
				param1 : fsId,
//				param2 : customerId
			},
			dataType: 'json',
			//async : false,
			success : function(data){
				if(data.success == true){
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
			me.downloadFile('cpBase/KTemplateLibrary.downloadTemplateLibraryFile.json', {
				param1 : $this.attr('data-download'),
//				param2 : customerId
			});
		}
	},
	onUploadFileBtnClick : function(evt) {
		$('#rcsuploadTplFormModal').modal('show');
	},
	onAddFolderBtnClick : function(evt){
		
		evt.preventDefault();
		this.cmp.modalNewFolder.modal('show');
//		$('body').attr('style', '');
	},
	onAddSaveBtnClick : function(evt){
		evt.preventDefault();
		var me = this;
		var submitUrl = 'cpBase/KTemplateLibrary.addTempllateFolder.json';
		var tv = me.cmp.folderTree.treeview(true);
		var parentId = 0;
		if(typeof tv.getSelected === 'function') {
			parentId = tv.getSelected();
		}
		var node = parentId ? parentId[0] : null;
		var nodeId = node ? node.nodeId : 0;
		parentId = parentId ? parentId[0].value : 0;
		
		var data = {
			jsonData : JSON.stringify({
//				projectId : projectId,
				parentId : parentId,
//				customerId : customerId,
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
					if(data.success == true){
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
		var submitUrl = 'cpBase/KTemplateLibrary.updateTemplateLibraryFolder.json';
		var parentId = me.cmp.e_path.treecombo(true).getTreeComboValue();
		var data = {
			jsonData : JSON.stringify({
				parentId : parseInt(parentId),
				autoId : parseInt(me.cmp.e_fileSystemId.val()),
//				customerId : customerId,
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
					if(data.success == true){
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
		if($this.val() && $this.val() != '') {
			var formData = new FormData();
			formData.append('parentId', node.value);
			formData.append('customerId', customerId);
			formData.append('projectId', projectId);
			formData.append('file', me.cmp.fileUploadFileName.get(0).files[0]);
			$this.val('');
			$.ajax({
				url : 'cpBase/KTemplateLibrary.uploadTemplateLibraryFile.json',
				type : 'POST',
				data : formData,
				contentType : false,
				processData : false,
				success : function(data){
					if(data.success == true){
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
						typeAttr : {
							'data-dismiss': "modal"
						},
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
								url : './cpBase/TreeCommon.findDgTemplateLibiaryTree.json',
								params : {
//									param22: customerId,
//									param23: projectId
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

}
