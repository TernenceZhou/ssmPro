var page;
(function(){
	jQuery.validator.addMethod(
		"subjectIdCheck",
		function(value, element, param) {
			let rex = /[0-9|a-z|A-Z]{0,30}/;
			return this.optional(element) || (rex.test(value));
		},
		$.validator.format("科目编号只能输入数字！")
	);
	/*var */page = new Page({
		/**
		 * 根节点
		 */
		container: '#main-container',
		/**
		 * 绑定事件
		 */
		events: {
			'#subjectTable .edit-subject' : 'click,onEditSubjectClick',
			'#newSubjectBtn' : 'click,onNewSubjectClick',
			'#refreshSubjectBtn' : 'click,onRefreshSubjectBtnClick',
			'#editSubjectModal': 'hidden.bs.modal,onHiddenSubjectModal',
			/*'#searchBtn': 'click,onSearchClick',
			'#searchResetBtn': 'click,onSearchResetClick',*/
		},
		/**
		 * 编辑画面绑定字段
		 */
		subjectJsonData: {
			autoId: '',
			subjectId: '',
			subjectName: '',
			subjectFullName: '',
			fsaCode: '',
			fsaName: '',
			lsReportCode: '',
			lsReportName: '',
			parentId: '',
			level: 1
		},
		/**
		 * 编辑画面 form 配置
		 */
		subjectFormCnfg: new FormComp({
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 2,
			id: 'subjectForm',
			data() {
				return {
					/**
					 * 表单提交ajax 配置
					 */
					ajaxConfig: {
						type : 'POST',
						url : 'cpBase/KSubject.addSubject.json',
						dataType : 'json',
						success : function(data) {
							if(data.success){
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#editSubjectModal').modal('hide');
								page.cmp.subjectTable.treegrid('options').queryParams.param1 = '';
								page.cmp.subjectTable.treegrid('options').queryParams.param11 = 1;
								page.cmp.subjectTable.treegrid('reload');
								//$('#subjectTable').DataTable().ajax.reload();
							}else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					},
					/**
					 * 当前处理：add=新增, edit=更新, false=查看（隐藏提交按钮）
					 */
					process: 'add'
				}
			},
			watch: {
				/**
				 * 处理编辑画面状态更新
				 */
				process(newValue, oldValue){
					var pvm = this;
					if(!newValue) {
						$(this.$el).find('.form-control').attr('readonly', true);
						this.setAllReadonly(true);
					}else {
						$(this.$el).find('.form-control').attr('readonly', false);
						this.setAllReadonly(false);
					}
				}
			},
			methods: {
				/**
				 * 提交编辑画面表单
				 */
				onSaveSubjectClick(evt){
					if(this.process == 'add') {
						this.ajaxConfig.url = 'cpBase/KSubject.addSubject.json';
					}else if(this.process == 'edit') {
						this.ajaxConfig.url = 'cpBase/KSubject.updateSubject.json';
					}
					this.submit(true);
				}
			},
			buttons: [{
				id: 'saveSubjectBtn',
				icon: 'fa-floppy-o',
				style: 'btn-primary',
				text: '保存',
				typeAttr: {
					'v-on:click': 'onSaveSubjectClick',
					'v-show': 'process'
				}
			},{
				id: 'cancelSubjectBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'data-dismiss': 'modal'
				}
			}],
			items: [
				{
					id : 'parentId',
					type : 'treecombo',
					label : '上一级科目',
					rowspan : 1,
					colspan : 1,
					validate : {
						rules : {
							//required : true
						}
					},
					plugin : {
						name : 'treecombo',
						options : {
							url : './cpBase/TreeCommon.findSubjectTree.json',
							params : {
								param21: '1'
							},
							view : {
								leafIcon: 'fa fa-building text-flat',
								nodeIcon: 'fa fa-bank text-primary-light',
								folderSelectable: true,
								multiSelect: false
							}
						}
					}
				},{
					id : 'subjectId',
					type : 'input',
					label : '科目编号',
					colspan : 1,
					validate : {
						rules : {
							required : true,
							maxlength : 30,
							subjectIdCheck : true
						}
					}
				},{
					id : 'subjectName',
					type : 'input',
					label : '科目名称',
					rowspan : 1,
					colspan : 2,
					validate : {
						rules : {
							required : true,
							maxlength : 80
						}
					}
				},{
					id : 'subjectFullName',
					type : 'input',
					label : '科目全名称',
					rowspan : 1,
					colspan : 2,
					validate : {
						rules : {
							required : true,
							maxlength : 200
						}
					}
				},{
					id : 'fsaCode',
					type : 'input',
					label : 'FSA编码',
					rowspan : 1,
					colspan : 2,
					validate : {
						rules : {
							maxlength : 30
						}
					}
				},{
					id : 'fsaName',
					type : 'input',
					label : 'FSA名称',
					rowspan : 1,
					colspan : 2,
					validate : {
						rules : {
							maxlength : 80
						}
					}
				},{
					id : 'lsReportCode',
					type : 'input',
					label : 'LS报表项目编号',
					rowspan : 1,
					colspan : 2,
					validate : {
						rules : {
							maxlength : 30
						}
					}
				},{
					id : 'lsReportName',
					type : 'input',
					label : 'LS报表项目名称',
					rowspan : 1,
					colspan : 2,
					validate : {
						rules : {
							maxlength : 80
						}
					}
				}
			]
		}),
		/**
		 * 编辑/新增画面表单
		 */
		subjectForm: null,
		/**
		 * 一览配置
		 */
		subjectTableCnfg: {
			tabNum : true,
			scrollX : true,
			lengthChange : true,
			order : [2, 'asc'],
			ordering : true,
			sourceData : {},
			sourceUrl : 'dgCenter/DgGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'DG00004',
			},
			tableColumns :[
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '100px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-info table-btn-operate edit-subject" data-row="'+meta.row+'" type="button" data-action="edit" name="" data-placement="top" title="修改" data-toggle="tooltip">'
							+ '<i class="fa fa-edit"></i></button>';
						renderStr += '<button class="btn btn-xs btn-primary table-btn-operate view-subject" data-row="'+meta.row+'" type="button" data-action="detail" name="" data-placement="top" title="查看" data-toggle="tooltip">'
							+ '<i class="fa fa-eye"></i></button>';
						renderStr += '<button class="btn btn-xs btn-danger table-btn-operate del-subject" data-row="'+meta.row+'" type="button" data-action="detail" name="" data-placement="top" title="删除" data-toggle="tooltip">'
							+ '<i class="fa fa-close"></i></button>';
						return renderStr;
					}
				}, {
					targets : 2,
					orderable : true,
					title : '机构部门',
					name : 'departmentId',
					data : 'departmentId',
					width : '200px',
					render(data, type, row, meta) {
						return row.__ddepartmentIdName;
					}
				}, {
					targets : 3,
					orderable : true,
					title : '程序名称',
					name : 'programName',
					data : 'programName',
					width : '150px'
				}, {
					targets : 4,
					orderable : true,
					title : '科目',
					name : 'subjectName',
					data : 'subjectName',
					width : '90px'
				}, {
					targets : 5,
					orderable : true,
					title : '认定',
					name : 'confirmStatus',
					data : 'confirmStatus',
					width : '90px',
					render(data, type, row, meta) {
						var result = [];
						var datas = data && data.split(',');
						$.each(datas, (dindex, dvlobj)=>{
							$.each(confirmStatusData, (index, vlobj)=>{
								if(vlobj.value == dvlobj) {
									result.push(vlobj.label);
								}
							});
						});
						return result;
					}
				},{
					targets : 6,
					orderable : true,
					title : '潜在风险说明',
					name : 'potentialRisk',
					data : 'potentialRisk',
					width : '200px',
				},{
					targets : 7,
					orderable : true,
					title : '阶段',
					name : 'stage',
					data : 'stage',
					width : '150px',
					render(data, type, row, meta) {
						return DicVal2Nm(data, '审计程序阶段');
					}
				},{
					targets : 8,
					orderable : true,
					title : '行业',
					name : 'industry',
					data : 'industry',
					width : '150px',
					render(data, type, row, meta) {
						if(row.allIndustryFlag == '1') {
							return data;
						}
						var result = [];
						var datas = data && data.split(',');
						$.each(datas, (dindex, dvlobj)=>{
							$.each(industryData, (index, vlobj)=>{
								if(vlobj.value == dvlobj) {
									result.push(vlobj.label);
								}
							});
						});
						return result;
					}
				},{
					targets : 9,
					orderable : true,
					title : '具体事项说明',
					name : 'description',
					data : 'description',
					width : '150px'
				},{
					targets : 10,
					orderable : true,
					title : '是否必须',
					name : 'required',
					data : 'required',
					render(data, type, row, meta) {
						return DicVal2Nm(data, 'boolean');
					},
					width : '150px'
				},{
					targets : 11,
					orderable : true,
					title : '创建人',
					name : 'createUser',
					data : 'createUser',
					render(data, type, row, meta) {
						return row.__ucreateUser.userName;
					},
					width : '150px'
				}
			]
		},
		loadSubjectTreeTable(params) {
			var me = this;
			var subjectTreeTable = me.cmp.subjectTable;
			if(subjectTreeTable.hasInited) {
				subjectTreeTable.treegrid('load', {
					menuId : window.sys_menuId,
					sqlId : 'DG00004',
					start : -1,
					limit : -1,
					param1 : null
				});
				return;
			}
			easyloader.load(['treegrid'],function(){
				subjectTreeTable.treegrid({
					height: 600,
					idField: 'autoId',
					treeField: 'subjectName',
					border: 'none',
					singleSelect : true,
					animate: true,
					queryParams: {
						menuId : window.sys_menuId,
						sqlId : 'DG00004',
						start : -1,
						limit : -1,
						param1 : null,
						param11 : 1
					},
					columns:[[
						{title:'ID', field: 'autoId', hidden: true},
						{title:'处理', field: 'operate', width: 150, align:'center', formatter(value, row, index) {
							var renderStr = '';
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate edit-subject" data-row="'+index+'" type="button" data-action="edit" name="" data-placement="top" title="修改" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-primary table-btn-operate view-subject" data-row="'+index+'" type="button" data-action="detail" name="" data-placement="top" title="查看" data-toggle="tooltip">'
								+ '<i class="fa fa-eye"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate del-subject" data-row="'+index+'" type="button" data-action="delete" name="" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-close"></i></button>';
							
							return renderStr;
						}},
						{title:'科目名称',field:'subjectName',width:150},
						{title:'科目编号',field:'subjectId',width:150},
						{title:'科目全名称',field:'subjectFullName',width:150},
						{title:'FSA编码',field:'fsaCode',width:150},
						{title:'FSA名称',field:'fsaName',width:150},
						{title:'LS报表项目编号',field:'lsReportCode',width:150},
						{title:'LS报表项目名称',field:'lsReportName',width:150},
						{title:'创建人',field:'__uuserIdName',width:150/*, formatter(value, row, index){
							return row.__userIdName
						}*/}
					]],
					loader: function(param, success, error){
						$.ajax({
							url: 'dgCenter/DgGeneral.query.json',
							type: 'post',
							data: param,
							dataType: 'json',
							success: function(data){
								success({rows: data.data, total: data.data.length});
							}
						});
					},
					onBeforeExpand: function(row){
						subjectTreeTable.treegrid('options').queryParams.param1 = row.autoId;
						subjectTreeTable.treegrid('options').queryParams.param11 = parseInt(row.level) + 1;
					},
					onLoadSuccess: function(row, data){
						subjectTreeTable.treegrid('options').queryParams.param1 = null;
						subjectTreeTable.treegrid('options').queryParams.param11 = 1;
					},
					onDblClickRow: function(row){
						subjectTreeTable.treegrid('toggle', row.autoId);
					}
				});
				subjectTreeTable.hasInited = true;
				subjectTreeTable.datagrid('getPanel').on('click', 'button.table-btn-operate.edit-subject', me.onEditSubjectClick.bind(me));
				subjectTreeTable.datagrid('getPanel').on('click', 'button.table-btn-operate.view-subject', me.onViewSubjectClick.bind(me));
				subjectTreeTable.datagrid('getPanel').on('click', 'button.table-btn-operate.del-subject', me.onDelSubjectClick.bind(me));
			});
		},
		/**
		 * 检索表单数据绑定对象
		 */
		searchFormJsonData: {
			s_subjectId: '',
			s_subjectName: '',
			s_subjectFullName: ''
		},
		/**
		 * 检索表单
		 */
		searchForm: null,
		/**
		 * 检索表单配置
		 */
		searchFormCnfg: new FormComp({
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 4,
			id: 'searchForm',
			data: function() {
				return {
					ajaxConfig: {
						type : 'POST',
						url : '',
						dataType : 'json',
						success : function(data) {}
					}
				}
			},
			items: [{
					id : 's_subjectId',
					type : 'input',
					label : '科目编号',
					colspan : 1
				},{
					id : 's_subjectName',
					type : 'input',
					label : '科目名称',
					colspan : 1
				},{
					id : 's_subjectFullName',
					type : 'input',
					label : '科目全名称',
					colspan : 1
				}
			]
		}),
		/**
		 * 初始化方法
		 */
		init(options) {
			// 初始化一览table
			this.loadSubjectTreeTable({});
			// 初始化编辑画面表单 
			var APFormComp = Vue.extend(this.subjectFormCnfg);
			this.subjectForm = new APFormComp({
				propsData: {
					jsonData: this.subjectJsonData
				}
			});
			this.subjectForm.$mount('#subjectForm');
			// 初始化搜索表单
			/*var SearchFormComp = Vue.extend(this.searchFormCnfg);
			this.searchForm = new SearchFormComp({
				propsData: {
					jsonData: this.searchFormJsonData
				}
			});
			this.searchForm.$mount('#searchForm');*/
			
		},
		/**
		 * 关闭编辑画面 
		 */
		onHiddenSubjectModal(event){
			page.subjectForm.process = '';
		},
		setEditSubjectModalValue(event, title){
			// 显示 modal
			$('#editSubjectModal').find('h3.block-title').text(title);
			$('#editSubjectModal').modal('show');
			// 获取当前列数据
			var table = page.cmp.subjectTable;
			table.treegrid('select', $(event.currentTarget).attr('data-row'));
			var rowData = table.treegrid('getSelected');
			// 设置 modal 画面数据
			page.subjectForm.jsonData = {
				autoId: rowData.autoId,
				subjectId: rowData.subjectId,
				subjectName: rowData.subjectName,
				subjectFullName: rowData.subjectFullName,
				fsaCode: rowData.fsaCode,
				fsaName: rowData.fsaName,
				lsReportCode: rowData.lsReportCode,
				lsReportName: rowData.lsReportName,
				parentId: rowData.parentId,
				level: 1
			};
		},
		/**
		 * 编辑按钮点击事件
		 */
		onEditSubjectClick(event){
			this.setEditSubjectModalValue(event, '更新科目');
			page.subjectForm.process = 'edit';
		},
		/**
		 * 查看数据详细信息
		 */
		onViewSubjectClick(event){
			this.setEditSubjectModalValue(event, '查看科目');
			page.subjectForm.process = false;
		},
		/**
		 * 删除按钮点击事件
		 */
		onDelSubjectClick(event){
			var table = page.cmp.subjectTable;
			table.treegrid('select', $(event.currentTarget).attr('data-row'));
			var rowData = table.treegrid('getSelected');
			bdoConfirmBox('提示', '确定删除该数据吗？', function(isConfirm) {
				$.ajax({
					type : "post",
					url : 'cpBase/KSubject.delSubject.json',
					async : false,
					data : {
						param1: rowData.autoId,
						param2: rowData.subjectName
					},
					dataType : "json",
					success : function(data) {
						if(data.success){
							bdoSuccessBox('成功', data.resultInfo.statusText);
							page.cmp.subjectTable.treegrid('options').queryParams.param1 = '';
							page.cmp.subjectTable.treegrid('options').queryParams.param11 = 1;
							page.cmp.subjectTable.treegrid('reload');
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		},
		/**
		 * 新增按钮点击事件 
		 */
		onNewSubjectClick(event){
			$('#editSubjectModal').find('h3.block-title').text('新建科目');
			$('#editSubjectModal').modal('show');
			page.subjectForm.jsonData = {
				autoId: '',
				subjectId: '',
				subjectName: '',
				subjectFullName: '',
				parentId: '',
				level: 1
			};
			page.subjectForm.process = 'add';
		},
		/**
		 * 刷新
		 * @param event
		 */
		onRefreshSubjectBtnClick(event){
			page.cmp.subjectTable.treegrid('options').queryParams.param1 = '';
			page.cmp.subjectTable.treegrid('options').queryParams.param11 = 1;
			page.cmp.subjectTable.treegrid('reload');
		},
		/**
		 * 搜索按钮点击事件
		 */
		onSearchClick(event){
			var param = this.searchForm.jsonData;
			var queryFilterArr = [];
			$.each(param, (key, value)=>{
				var _key = key.replace('s_', '');
				var filter = {
					field : _key,
					sqlIndex : 'a.'+_key,
					type : typeof value,
					value : value,
					operate : 'eq'
				};
				switch(_key) {
				case 'subjectName': 
				case 'subjectFullName': 
					filter.operate = 'like';
				default:
					filter.operate = 'eq';
				}
				queryFilterArr.push(filter);
				
			});
			var queryString = JSON.stringify(queryFilterArr);
			this.subjectTableCnfg.filterParam.filter = queryString;
			$('#subjectTable').DataTable().ajax.reload();
		},
		onSearchResetClick(event){
			this.searchForm.jsonData = {
				autoId: '',
				subjectName: '',
				subjectFullName: '',
				parentId: ''
			};
			this.subjectTableCnfg.filterParam = this.getDefaultFilter();
			$('#subjectTable').DataTable().ajax.reload();
		},
		getDefaultFilter() {
			return {
				menuId : window.sys_menuId,
				sqlId : 'DG00004'
			};
		}
	});
}());
