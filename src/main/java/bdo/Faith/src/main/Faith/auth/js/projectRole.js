$(document).ready(function(event) {
	let _template = tplLoader('auth/html/projectRole.html');
	$('#authProjectRolePage').html(_template);
	let page = new Page({
		random: (new Date).getTime() + parseInt(1e3 * Math.random())
		/**
		 * 根节点
		 */
		, container: '#authProjectRolePage'
		/**
		 * 绑定事件
		 */
		, events: {
			'#proj-role-add-btn': 'click,onProjRoleAddBtnClick'
		}
		, _template
		/**
		 * 初始化
		 */
		, init
		, tableEventBind
		, onProjRoleAddBtnClick
		, onProjRoleEditBtnClick
		, onProjRoleDelBtnClick
		, ProjRoleTableCnf
		, ProjRoleTable: null
		, ProjRoleFormSider: null
		, ProjRoleFormCnf
		, ProjRoleForm: null
		, apply(obj, data) {
			$.each(data, (key, value) => {
				obj[key] = value;
			});
		}
		, getNullVal(val, dufaultVal) {
			return val == null || val == undefined || val == '' ? dufaultVal : val;
		}
	});
	function init(options) {
		console.info('init');

		BdoDataTable('proj-role-table', this.ProjRoleTableCnf());
		this.ProjRoleFormSider = side({el: '#proj-role-form-sider'});
		this.ProjRoleForm = createForm(this.ProjRoleFormCnf());
		this.tableEventBind();
		OneUI.initHelper('slimscroll');
	}

	function tableEventBind() {
		console.info('tableEventBind');
		this.cmp['proj-role-table'].on('click', '.proj-role-edit-btn', this.onProjRoleEditBtnClick);
		this.cmp['proj-role-table'].on('click', '.proj-role-del-btn', this.onProjRoleDelBtnClick);
	}

	/**
	 * 新增
	 * @param event
	 */
	function onProjRoleAddBtnClick(event) {
		console.info('onProjRoleAddBtnClick');
		page.ProjRoleFormSider.act = 'add';
		page.ProjRoleForm.jsonData.autoId = '';
		page.ProjRoleForm.jsonData.roleName = '';
		page.ProjRoleForm.jsonData.dbField = '';
		page.ProjRoleForm.jsonData.classField = '';
		page.ProjRoleFormSider.show();
	}

	/**
	 * 修改
	 * @param event
	 */
	function onProjRoleEditBtnClick(event) {
		console.info('onProjRoleEditBtnClick');
		page.ProjRoleFormSider.act = 'edit';
		let activeEl = $(event.currentTarget);
		let table = $('#proj-role-table').dataTable();
		let rowData = table.fnGetData(activeEl.attr('data-state-row-id'));
		page.ProjRoleForm.jsonData.autoId = rowData.autoId;
		page.ProjRoleForm.jsonData.roleName = rowData.roleName;
		page.ProjRoleForm.jsonData.dbField = rowData.dbField;
		page.ProjRoleForm.jsonData.classField = rowData.classField;
		page.ProjRoleFormSider.show();
	}
	function $http(url, data) {
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
	/**
	 * 删除
	 * @param event
	 */
	function onProjRoleDelBtnClick(event) {
		console.info('onProjRoleDelBtnClick');
		let activeEl = $(event.currentTarget);
		let table = $('#proj-role-table').dataTable();
		let rowData = table.fnGetData(activeEl.attr('data-state-row-id'));
		bdoConfirmBox('提示', '确定删除该行数据吗？', isConfirm => {
			$http('auth/AuthKProjectrole.delete.json',{
				jsonData: JSON.stringify([rowData.autoId])
			}).then(data => {
				if (data.success) {
					OneUI.notifySuccess('删除成功！');
					$('#proj-role-table').DataTable().ajax.reload();
				} else {
					OneUI.notifyError(data.resultInfo.statusText);
				}
			}).catch(() => {
				OneUI.notifyError('删除操作异常！');
			})
		});
	}

	/**
	 * 列表
	 * @returns {string|{tableParam: {serverSide: boolean, createdRow(*, *, *), fixedColumns: boolean, select: boolean, ordering: boolean, bdoCustomizeColumns: boolean, autoWidth: boolean, scrollY: number, paging: boolean, scrollX: boolean, columnDefs: ({data: null, orderable: boolean, width: string, className: string, title: string, targets: *, render(*, *, *, *): *}|{data: null, orderable: boolean, width: string, className: string, title: string, targets: number, render(*, *, *, *): string}|{data: string, orderable: boolean, name: string, width: string, className: string, title: string, targets: number}|{data: string, orderable: boolean, name: string, width: string, className: string, title: string, targets: number}|{data: string, orderable: boolean, name: string, width: string, className: string, title: string, targets: number})[], drawCallback(*)}, localParam: {tabNum: boolean, urlparam: {sqlId: string, menuId: *}, url: string}}|number}
	 */
	function ProjRoleTableCnf() {
		let cnt = 0;
		let rowNum = 0;
		return {
			localParam: {
				url: 'auth/AuthKProjectrole.list.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'AUTH_PS0002'
				},
				tabNum: false
			},
			tableParam: {
				select: true,
				ordering: false,
				serverSide: true,
				autoWidth: true,
				scrollY: 500,
				scrollX: true,
				// scrollCollapse: true,
				paging: true,
				pageLength : 30,
				fixedColumns: true,
				bdoCustomizeColumns: true,
				drawCallback(setting) {},
				createdRow(row, data, dataIndex) {},
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					title: '序号',
					width: '80px',
					data: null,
					className: 'text-center font-16',
					render(data, type, row, meta) {
						return meta.row + 1;
					}
				}, {
					targets: ++cnt,
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '80px',
					render(data, type, row, meta) {
						let renderStr = '<div class="btn-group"><button class="btn btn-xs btn-success proj-role-edit-btn" type="button" name="ProjRoleEdit" id="ProjRoleEdit" data-placement="top" title="编辑" data-toggle="tooltip" data-original-title="编辑"' +
							'data-state-id="' + row.autoId + '"' +
							'data-state-row-id="' + meta.row + '"' +
							'><i class="fa fa-edit"></i></button>';
						renderStr += '<button class="btn btn-xs btn-danger proj-role-del-btn" type="button" name="ProjRoleDel" id="ProjRoleDel" data-placement="top" title="删除" data-toggle="tooltip" data-original-title="删除"' +
							'data-state-id="' + row.autoId + '"' +
							'data-state-row-id="' + meta.row + '"' +
							'><i class="fa fa-times"></i></button></div>';
						return renderStr;
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '编号',
					name: 'autoId',
					data: 'autoId',
					width: '50px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '角色名称',
					name: 'roleName',
					data: 'roleName',
					width: '150px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					orderable: false,
					title: 'DB字段',
					name: 'dbField',
					data: 'dbField',
					width: '150px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					orderable: false,
					title: 'DTO字段',
					name: 'classField',
					data: 'classField',
					width: '300px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					title: '创建日期',
					name: 'creationDate',
					data: 'creationDate',
					width: '100px',
					className: 'text-center',
					render(data, type, row, meta) {
						if(!data) {
							return '';
						}
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: ++cnt,
					title: '更新日期',
					name: 'lastUpdateDate',
					data: 'lastUpdateDate',
					width: '100px',
					className: 'text-center',
					render(data, type, row, meta) {
						if(!data) {
							return '';
						}
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}]
			}
		}
	}

	/**
	 * 表单
	 * @returns {{ajaxConfig: {success(*): void, dataType: string, type: string, url: string}}|{buttons: [{icon: string, style: string, id: string, text: string, typeAttr: {'v-on:click': string}}, {icon: string, style: string, id: string, text: string, typeAttr: {'v-on:click': string}}], data(): {ajaxConfig: {success(*): void, dataType: string, type: string, url: string}}, methods: {onProjRoleSaveClick(*): void, onCancelClick(): void}, display: string, options: {propsData: {jsonData: {stateName: string, autoId: string, state: string}}}, column: number, id: string, items: [{colspan: number, rowspan: number, id: string, label: string, type: string, validate: {rules: {required: boolean}}}, {colspan: number, rowspan: number, id: string, label: string, type: string, validate: {rules: {required: boolean}}}], props: {jsonData: ObjectConstructor}}}
	 */
	function ProjRoleFormCnf(){
		return {
			options: {
				propsData: {
					jsonData: {
						autoId: '',
						roleName: '',
						dbField: '',
						classField: ''
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 1,
			id: 'proj-role-form',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: 'auth/AuthKProjectrole.save.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								OneUI.notifySuccess('保存成功！');
								page.ProjRoleFormSider.hide();
								$('#proj-role-table').DataTable().ajax.reload();
							} else {
								OneUI.notifyError(data.resultInfo.statusText);
							}
						}
					}
				};
			},
			methods: {
				onProjRoleSaveClick(event) {
					if(page.ProjRoleFormSider.act ) {
						if(page.ProjRoleFormSider.act == 'add') {
							this.autoId = null;
							this.ajaxConfig.url = 'auth/AuthKProjectrole.save.json';
						}else {
							this.ajaxConfig.url = 'auth/AuthKProjectrole.update.json';
						}
					}
					this.submit(true);
				},
				onCancelClick() {
					page.ProjRoleFormSider.hide();
				}
			},
			buttons: [{
				id: 'proj-role-save-btn',
				icon: 'fa-check-square-o',
				style: 'btn-success',
				text: '保存',
				typeAttr: {
					'v-on:click': 'onProjRoleSaveClick'
				}
			}, {
				id: 'proj-role-cancel-btn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'v-on:click': 'onCancelClick'
				}
			}],
			items: [{
				id: 'roleName',
				type: 'input',
				label: '项目角色名称',
				rowspan: 1,
				colspan: 1,
				validate: {
					rules: {
						required: true
					}
				}
			},{
				id: 'dbField',
				type: 'input',
				label: 'DB字段',
				rowspan: 1,
				colspan: 1,
				validate: {
					rules: {
						required: true
					}
				}
			},{
				id: 'classField',
				type: 'input',
				label: 'DTO字段',
				rowspan: 1,
				colspan: 1,
				validate: {
					rules: {
						required: true
					}
				}
			}]
		}
	}

});