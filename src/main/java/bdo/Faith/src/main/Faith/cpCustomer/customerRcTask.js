var task = function(options) {
	
	var taskEditDataCache = function(){
		this.taskId = '';
		this.taskName = '';
		this.intro = '';
		this.files = [];
		this.newFiles = [];
		this.parentDirId = '';
		this.groupId = this.groupId || '';
		this.folderId = this.folderId || '';
		this.folderName = this.folderName || '';
		return this;
	};
	var _options = {
		height: 0,
		groupId: options ? options.groupId : '',
		taskForm: taskEditDataCache.apply({})
	};
	_options = options = $.extend(true, _options, options);
	
	var downloadFile = function(url, params) {
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
		$(options.$el).append(form);
		form.submit();
		form.remove();
	};
	
	var commentFormModelCache = function() {
		this.taskId = '',
		this.groupId = '',
		this.folderId = '',
		this.commentId = null,
		this.comment = '',
		this.commentFiles = []
		return this;
	};
	var commentFormModel = commentFormModelCache.apply({});
	var commentForm = new FormComp({
		props: {
			jsonData: Object,
			task: Object
		},
		display : 'tableform-one',
		column : 4,
		id: 'commentForm',
		data :  function() {
			return {
				ajaxConfig : {
					type : 'POST',
					url : 'cusBase/CusRc.addComment.json',
					dataType : 'json',
					success : function(data) {
						if(data.success === true){
							bdoSuccessBox('成功', data.resultInfo.statusText);
							this.onCancelCommentBtnClick(null);
							taskDetailVm.fetchTaskList();
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			}
		},
		activated(){
			this.resetPluginComponet();
			this.jsonData.taskId = this.task.taskId;
			this.jsonData.groupId = this.task.groupId;
			this.jsonData.folderId = taskDetailVm.jsonData.folderId;
			if(this.task.comment) {
				this.jsonData.commentId = this.task.comment.commentId;
			}else {
				this.jsonData.commentId = null;
			}
		},
		deactivated(){
			commentFormModel = commentFormModelCache.apply(this.jsonData);
			this.resetPluginComponet();
		},
		methods : {
			onSaveCommentBtnClick(evt){
				this.uploadFile(true);
			},
			onCancelCommentBtnClick(evt){
				this.task.commentForm = '';
				this.task.commentFormShow = false;
			}
		},
		buttons : [{
			id : 'saveCommentBtn',
			icon : 'fa-floppy-o',
			style : 'btn-primary',
			text : '保存',
			typeAttr : {
				'v-on:click' : 'onSaveCommentBtnClick'
			}
		},{
			id : 'cancelCommentBtn',
			icon : 'fa-arrow-left',
			style : 'btn-warning',
			text : '取消',
			typeAttr : {
				'v-on:click' : 'onCancelCommentBtnClick'
			}
		}],
		items : [
			{
				id : 'comment',
				type : 'textarea',
				label : '内容',
				rowspan : 1,
				colspan : 1,
				validate : {
					rules : {
						required : true,
						maxlength : 2500
					}
				},
				typeAttr : {
					rows : 3
				},
				plugin : {
					name : 'summernote',
					options : {
						//airMode: true
					}
				}
			},{
				id :  'commentFiles',
				type : 'file',
				label : '选择附件',
				rowspan : 1,
				colspan : 4,
				typeAttr : {
				},
				plugin : {
					name : 'fileinput',
					options : {
						uploadUrl: 'cusBase/CusRc.uploadFile.json',
						uploadExtraData: function() {
							return {
								parentId: commentFormModel.folderId,
								customerId: taskDetailVm.jsonData.groupId
							}
						}
					}
				}
			},{
				id :  'folderId',
				type : 'treecombo',
				label : '附件保存目录',
				rowspan : 1,
				colspan : 4,
				typeAttr : {
				},
				validate : {
					rules : {
						required : true
					}
				},
				plugin : {
					name : 'treecombo',
					options : {
						url : './cpBase/TreeCommon.findCusFileSystemTree.json',
						params : function(){
							return {
								param13: '1',
								param12: '01',
								param10: taskDetailVm.jsonData.groupId
							}
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
					}
				}
			}]
	});
	var blockContentTpl = '<div class="block-content bg-gray-lighter" :style="styleObject" >'
		+'<task-list :taskList="tasks"'
		+' :page-model="pageModel"'
		+' @edit-task="$emit(\'edit-task\', $event)"'
		+' @del-task="$emit(\'del-task\', $event)"'
		+' @comment-task="$emit(\'comment-task\', $event)"'
		//+' @comment-task=""'
		+' @download-file="$emit(\'download-file\', $event)"'
		+' @del-file="$emit(\'del-file\', $event)"'
		/*+' @comment-task="$emit(\'comment-task\', $event)"'*/
		+' @reply-comment="$emit(\'reply-comment\', $event)"'
		+' @del-comment="$emit(\'del-comment\', $event)"'
		+' @task-list-loadmore="$emit(\'task-list-loadmore\', $event)"'
		+'></task-list>'
		+'</div>';
	var taskListTpl = tplLoader('cpCustomer/tpl/taskList.html');
	var taskListComp = {
		props: {
			taskList: Array,
			pageModel: Object
		},
		data: function(){
			return {
				commentFormModel: commentFormModel
			}
		},
		template: taskListTpl,
		components : {
			'comment-form': commentForm
		},
		methods: {
			formatDate(date){
				return new Date(date).format('yyyy-MM-dd HH:mm:ss');
			}
		}
	};
	var taskListBlock = {
		props: {
			tasks: Array,
			pageModel: Object
		},
		data: function() {
			return {
				styleObject: {
					height : _options.height +'px',
					'overflow-y' : 'auto'
				}
			}
		},
		components: {
			'task-list': taskListComp
		},
		template: blockContentTpl
	};
	var treecomboParams = {
			param13: '1',
			param10: _options.groupId
		};
	var treecomboOptions = {
			name : 'treecombo',
			options :{
				url : './cpBase/TreeCommon.findCusFileSystemTree.json',
				params : treecomboParams,
				view : {
					leafIcon: 'fa fa-folder text-primary',
					nodeIcon: 'fa fa-folder text-primary',
					folderSelectable: false,
					multiSelect: false
				}
			}
		};
	var selectFileForm = new FormComp({
		display : 'tableform-one',
		column : 4,
		id: 'selectFileForm',
		props : {
			jsonData: Object
		},
		data : function() {
			return {
				selectFileResult: '',
				selectFiletreecomboOptions: {}
			};
		},
		computed : {
			result(){
				return {
					value : $('#selectFile').attr('data-result'),
					label : $('#selectFile').attr('data-content')
				}
			}
		},
		watch : {
			'jsonData.selectFile': function(newValue, oldValue) {
			}
		},
		activated(){
			this.jsonData.selectFile = '';
			$('#selectFile').treecombo(true).options.params.param10 = _options.groupId;
		},
		buttons : [
			{
				id : 'comfirmSelectFileBtn',
				icon : 'fa-floppy-o',
				style : 'btn-primary',
				text : '确认',
				typeAttr : {
					'v-on:click' : '$emit('+'\'select-file-comfirm\''+',result'+')'
				}
			},
			{
				id :  'closeSelectFileBtn',
				icon : 'fa-sign-out',
				style : 'btn-css1 btn-warning',
				text : '关闭',
				typeAttr : {
					'v-on:click' : '$emit('+'\'select-file-close\''+')'
				}
			}
		],
		items : [{
			id :  'selectFile',
			type : 'input',
			label : '文件',
			rowspan : 1,
			colspan : 4,
			validate : {
				rules : {
					required : true
				}
			},
			typeAttr : {
				'v-bind:data-result' : 'selectFileResult'
			},
			plugin : treecomboOptions
		}]
	});
	var selectFileBlock = {
			props: {
				selectFileData: Object
			},
			data : function() {
				return {
					styleObject: {
						height: _options.height+'px'
					}
				}
			},
			components : {
				'select-file-form': selectFileForm
			},
			template: '<div class="block-content" :style="styleObject">'
				+'<select-file-form :json-data="selectFileData" @select-file-comfirm="$emit(\'select-file-comfirm\', $event)" @select-file-close="$emit(\'select-file-close\')""></select-file-form></div>'
		};
	var taskEditForm = new FormComp({
		display : 'tableform-one',
		column : 4,
		id: 'taskForm',
		data :  function() {
			return {
				ajaxConfig : {
					type : 'POST',
					url : 'cusBase/CusRc.addTask.json',
					dataType : 'json',
					success : function(data) {
						if(data.success === true){
							bdoSuccessBox('成功', data.resultInfo.statusText);
							this.$parent.$parent.changeSubPage('tasklist');
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			}
		},
		activated(){
			if(taskDetailVm.editProccess == 'edit') {
				this.formItem.files.show = true;
			}else {
				this.formItem.files.show = false;
				this.resetPluginComponet();
			}
			this.jsonData.parentDirId = this.jsonData.folderId;
		},
		methods : {
			onSaveTaskBtnClick : function(evt) {
				if(!$.isNumeric(_options.groupId)) {
					bdoErrorBox('', '请选择一个具体的客户。');
					return;
				}
				if(taskDetailVm.editProccess == 'add') {
					this.ajaxConfig.url = 'cusBase/CusRc.addTask.json';
				}else if(taskDetailVm.editProccess == 'edit') {
					this.ajaxConfig.url = 'cusBase/CusRc.updateTask.json';
				}
				this.uploadFile(true);
			},
			onAddFileBtnClick : function(evt) {
				this.$emit('add-file');
			}
		},
		buttons : [
			{
				id : 'saveTaskBtn',
				icon : 'fa-floppy-o',
				style : 'btn-primary',
				text : '保存',
				typeAttr : {
					'v-on:click' : 'onSaveTaskBtnClick'
				}
			}
		],
		items : [
			{
				id :  'taskName',
				type : 'input',
				label : '主题',
				rowspan : 1,
				colspan : 4,
				validate : {
					rules : {
						required : true,
						maxlength : 100
					}
				}
			},{
				id : 'intro',
				type : 'textarea',
				label : '内容',
				rowspan : 1,
				colspan : 4,
				validate : {
					rules : {
						required : true,
						maxlength : 2500
					}
				},
				typeAttr : {
					rows : 3
				},
				plugin : {
					name : 'summernote',
					options : {
					}
				}
			},{
				id :  'newFiles',
				label : '上传附件',
				type: 'file',
				rowspan : 1,
				colspan : 4,
				typeAttr : {
					multiple: true
				},
				plugin : {
					name : 'fileinput',
					options : {
						uploadUrl: 'cusBase/CusRc.uploadFile.json',
						uploadExtraData: function() {
							return {
								parentId: _options.taskForm.parentDirId,// taskDetailVm.jsonData.folderId,
								customerId: taskDetailVm.jsonData.groupId
							}
						}
					}
				}
			},{
				id :  'parentDirId',
				type : 'treecombo',
				label : '附件保存目录',
				rowspan : 1,
				colspan : 4,
				typeAttr : {
				},
				validate : {
					rules : {
						required : true
					}
				},
				plugin : {
					name : 'treecombo',
					options : {
						url : './cpBase/TreeCommon.findCusFileSystemTree.json',
						params : function(){
							return {
								param13: '1',
								param12: '01',
								param10: taskDetailVm.jsonData.groupId
							}
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
					}
				}
			},{
				id :  'files',
				label : '已关联附件',
				rowspan : 1,
				colspan : 4,
				show: false,
				html: tplLoader('cpCustomer/tpl/taskEditFileTpl.html')
			}]
	});
	var taskEditBlock = {
		props: {
			jsonData: Object
		},
		data : function() {
			return {
				styleObject: {
					height: _options.height+'px',
					overflow: 'auto'
				}
			}
		},
		components : {
			'task-edit-form': taskEditForm
		},
		template: '<div class="block-content" :style="styleObject"><task-edit-form :json-data="jsonData"'
			+' @add-file="$emit(\'add-file\')"'
			+' @del-edit-file="$emit(\'del-edit-file\', $event)"'
			+'"></task-edit-form></div>'
	};
	var taskDetailVm = new Vue({
		el: _options.$el,
		components: {
			'tasklist': taskListBlock,
			'taskedit': taskEditBlock,
			'selectfile': selectFileBlock
		},
		data: {
			title: '讨论区',
			newTaskBtnLable: '新建话题',
			turnBackTasksBtnLable: '返回',
			refreshBtnLabel: '刷新',
			subComponent: '',
			editComponent: 'selectfile',
			editShow: false,
			selectFileData: {
				selectFile: ''
			},
			show: false,
			tasks: [],
			pageModel: {
				total: 0,
				state: '',
				limit: 0,
				currentPage: 0,
				previou: -1,
				next: -1
			},
			queryTaskListParam: {
				menuId: window.sys_menuId,
				sqlId: 'RC10005',
				param1: _options.groupId,
				page: 0,
				start: 0,
				limit: _options.pageSize,
				sort: JSON.stringify([{
					property: 'taskId',
					direction: 'desc'
				}])
			},
			jsonData : _options.taskForm,
			classObject : {
				'block-opt-refresh': true
			},
			editProccess: '',
			currentCommentForm: {},
			history: [],
			historyLength: 20,
			historyCurrentIndex: 0
		},
		watch : {
			subComponent: function(val, oldVal) {
				if(val != '') {
					this.history.push(val);
					if(parseInt(this.history.length / this.historyLength) > 0) {
						this.history.splice(0, this.history.length % this.historyLength);
					}
				}
				this.onChangeSubPage(val, oldVal);
			},
			'jsonData.groupId': function(val, oldVal) {
				if(val == null) {
					return;
				}
				_options.groupId = val;
				this.fetchTaskList();
			},
			'queryTaskListParam.page': function(val, oldVal) {
			},
			'pageModel.total': function(val, oldVal) {
				this.pageModel.limit = this.queryTaskListParam.limit;
				this.pageModel.currentPage = this.queryTaskListParam.page;
				var length = this.tasks.length;
				
				var tnext = parseInt(this.pageModel.total/this.pageModel.limit) + 
					(this.pageModel.total%this.pageModel.limit == 0 ? 0 : 1);
				
				var tp = parseInt(length/this.pageModel.limit) + 
					(length%this.pageModel.limit == 0 ? 0 : 1);
				
				if(this.pageModel.state == 'pre') {
					if(this.pageModel.currentPage > 0) {
						this.pageModel.previou = this.pageModel.currentPage - 1;
					}else {
						this.pageModel.previou = -1;
					}
					
					if(this.pageModel.currentPage + tp <= tnext-1) {
						this.pageModel.next = this.pageModel.currentPage + tp;
					}else {
						this.pageModel.next = -1;
					}
				}else {
					if(this.pageModel.currentPage < tnext-1) {
						this.pageModel.next = this.pageModel.currentPage + 1;
					}else {
						this.pageModel.next = -1;
					}
					
					if(this.pageModel.currentPage - tp >= 0) {
						this.pageModel.previou = this.pageModel.currentPage - tp;
					}else {
						this.pageModel.previou = -1;
					}
				}
			}
		},
		mounted(){
			this.subComponent = 'tasklist';
		},
		methods: {
			beforChangeSubPage(currentPage, pageName){
				switch(currentPage) {
					case 'tasklist': 
						break;
					case 'taskedit': 
						_options.taskForm = taskEditDataCache.apply(this.jsonData)
						this.jsonData = _options.taskForm;
						console.log(this.jsonData);
						break;
					case 'selectfile':
						break;
				}
			},
			changeSubPage(pageName){
				this.transition();
				this.beforChangeSubPage(this.subComponent, pageName);
				this.subComponent = pageName;
			},
			onAddTaskClick : function(evt) {
				if(!$.isNumeric(_options.groupId)) {
					bdoErrorBox('', '请选择一个具体的客户。');
					return;
				}
				this.editProccess = 'add';
				this.changeSubPage('taskedit');
			},
			onTurnBackTasksClick : function(evt) {
				this.changeSubPage('tasklist');
			},
			onRefreshClick : function(evt) {
				var newPage = this.subComponent;
				var me = this;
				me.classObject['block-opt-refresh'] = true;
				this.subComponent = '';
				setTimeout(function() {
					me.classObject['block-opt-refresh'] = false;
					me.changeSubPage(newPage);
				}, 500);
			},
			fetch(api, data, success, faile) {
				data = data ? data : {};
				data.menuId = window.sys_menuId;
				$.ajax({
					url: api,
					type: 'post',
					data: data,
					dataType: 'json',
					success: function(data){
						success(data);
					}
				});
			},
			update(api, data, success, faile) {
				data = data ? data : {};
				$.ajax({
					url: api,
					type: 'post',
					data: data,
					dataType: 'json',
					success: function(data){
						success(data);
					}
				});
			},
			fetchTaskSuccess(data) {
				if(data.success === true){
					$.each(data.data, (index, value)=>{
						value.commentFormShow = false;
						value.commentForm = '';
					});
					if(taskDetailVm.pageModel.state == 'pre') {
						taskDetailVm.tasks = data.data.concat(taskDetailVm.tasks);
						if(taskDetailVm.tasks.length > 3*taskDetailVm.pageModel.limit) {
							taskDetailVm.tasks.splice(3*taskDetailVm.pageModel.limit, taskDetailVm.tasks.length-(3*taskDetailVm.pageModel.limit-1));
						}
					}else if(taskDetailVm.pageModel.state = 'next') {
						taskDetailVm.tasks = taskDetailVm.tasks.concat(data.data);
						if(taskDetailVm.tasks.length > 3*taskDetailVm.pageModel.limit) {
							taskDetailVm.tasks.splice(0, taskDetailVm.pageModel.limit);
						}
					}else {
						taskDetailVm.tasks = data.data;
					}
					
					taskDetailVm.pageModel.total = data.totalCount;
				}else {
					bdoErrorBox('', data.resultInfo.statusText);
				}
			},
			fetchTaskList(clean) {
				if(!clean) {
					this.tasks = [];
					this.pageModel.state = '';
					this.pageModel.total = 0;
					this.queryTaskListParam.page = 0;
				}else {
					if(this.pageModel.state == 'pre') {
						this.queryTaskListParam.page = this.pageModel.previou;
					}
					if(this.pageModel.state == 'next') {
						this.queryTaskListParam.page = this.pageModel.next;
					}
				}
				this.queryTaskListParam.param1 = _options.groupId;
				this.queryTaskListParam.start = this.queryTaskListParam.limit*this.queryTaskListParam.page;
				
				var url = 'cpBase/General.queryCusTaskList.json';
				this.fetch(url, this.queryTaskListParam, this.fetchTaskSuccess.bind(this));
				if(this.subComponent != 'tasklist') {
					this.changeSubPage('tasklist');
				}
			},
			transition() {
				var me = this;
				me.classObject['block-opt-refresh'] = true;
				setTimeout(function() {
					me.classObject['block-opt-refresh'] = false;
				}, 500);
			},
			onChangeSubPage(val, oldVal) {
				var me = this;
				this.transition();
				switch(val) {
					case 'tasklist': 
						if($.isNumeric(_options.groupId)) {
							this.fetchTaskList();
						}
						break;
					case 'taskedit': 
						if(this.editProccess = 'add') {
							_options.taskForm = taskEditDataCache.apply(this.jsonData)
							this.jsonData = _options.taskForm;
							console.log(this.jsonData);
						}
						break;
					case 'selectfile':
						break;
				}
			},
			doAddFileBtnClick(evt) {
				this.changeSubPage('selectfile');
			},
			onSelectFileComfirm(evt){
				var hasFileFlg = false;
				$.each(this.jsonData.files, function(index, file){
					if(evt.value == file.value) {
						hasFileFlg = true;

					}
				});
				if(hasFileFlg) {
					bdoErrorBox('', '该文件已在附件列表中，请勿重复关联！');
					return;
				}
				this.jsonData.files.push(evt);
				this.changeSubPage('taskedit');
			},
			doDelEditFileBtnClick(evt) {
				$.each(this.jsonData.files, function(index, file){
					if(evt.value == file.value) {
						this.jsonData.files.splice(index, 1);

					}
				}.bind(this));
			},
			onSelectFileClose(evt){
				this.changeSubPage('taskedit');
			},
			doReplyComment(evt){
				this.doComment(evt[0], evt[1]);
			},
			doComment(evt, comment){
				evt.comment = comment;
				
				if(this.currentCommentForm.taskId) {
					if(this.currentCommentForm.taskId == evt.taskId) {
						if(this.currentCommentForm.commentForm == '') {
							this.currentCommentForm.commentForm = 'comment-form';
						}else {
							this.currentCommentForm.commentForm = '';
						}
						this.currentCommentForm.commentFormShow = !this.currentCommentForm.commentFormShow;
						evt.commentForm = this.currentCommentForm.commentForm;
						evt.commentFormShow = this.currentCommentForm.commentFormShow;
						this.currentCommentForm = evt;
						return;
					}
					this.currentCommentForm.commentForm = '';
					this.currentCommentForm.commentFormShow = false;
				}
				evt.commentForm = 'comment-form';
				evt.commentFormShow = true;
				this.currentCommentForm = evt;
			},
			downloadFile(evt){
				downloadFile('cusBase/CusRc.downloadFile.json', {
					param1 : evt.fileSystemId
				});
			},
			deleteFile(evt){
				var me = this;
				bdoConfirmBox('系统提示', '确定要从当前内容中取消该附件链接吗？', ()=>{
					me.update('cusBase/CusRc.deleteLinkFile.json', {param1:evt.resId}, (data)=>{
						if(data.success === true){
							me.fetchTaskList();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('', data.resultInfo.statusText);
						}
					});
				});
			},
			doDeleteComment(evt) {
				var me = this;
				bdoConfirmBox('系统提示', '确定删除这条评论吗？', ()=>{
					me.update('cusBase/CusRc.deleteComment.json', {param1:evt.commentId}, (data)=>{
						if(data.success === true){
							me.fetchTaskList();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('', data.resultInfo.statusText);
						}
					});
				});
			},
			doDeleteTask(evt) {
				var me = this;
				bdoConfirmBox('系统提示', '确定删除该主题吗？', (data)=>{
					me.update('cusBase/CusRc.deleteTask.json', {param1: evt.taskId}, (data)=>{
						if(data.success === true){
							me.fetchTaskList();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('', data.resultInfo.statusText);
						}
					});
				});
			},
			doEditTask(evt) {
				var me = this;
				this.jsonData.taskId = evt.taskId;
				this.jsonData.taskName = evt.taskName;
				this.jsonData.intro = evt.intro;
				var filesArr = [];
				$.each(evt.files, (index, file)=>{
					filesArr.push({
						value: file.fileSystemId,
						label: file.fileName
					});
				});
				me.jsonData.files = filesArr;
				this.editProccess = 'edit';
				this.changeSubPage('taskedit');
			},
			formatDate(date) {
				return new Date(value).format('yyyy-MM-dd HH:mm:ss');
			},
			loadmore(act) {
				this.transition();
				this.pageModel.state = act;
				this.pageModel.total = 0;
				this.fetchTaskList(true);
			}
		}
	});
	return taskDetailVm;
}
