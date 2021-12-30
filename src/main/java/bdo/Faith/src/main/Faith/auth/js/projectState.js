$(document).ready(function(event) {
	let _template = tplLoader('auth/html/projectState.html');
	$('#authProjectStatePage').html(_template);
	let page = new Page({
		random: (new Date).getTime() + parseInt(1e3 * Math.random())
		/**
		 * 根节点
		 */
		, container: '#authProjectStatePage'
		/**
		 * 绑定事件
		 */
		, events: {
			'#proj-state-add-btn': 'click,onProjStateAddBtnClick',
			'#proj-state-table .proj-state-table-edit-btn': 'click,onProjStateEditBtnClick',
			'#proj-state-table .proj-state-table-del-btn': 'click,onProjStateDelBtnClick'
		}
		, _template
		/**
		 * 初始化
		 */
		, init
		, tableEventBind
		, onProjStateAddBtnClick
		, onProjStateEditBtnClick
		, onProjStateDelBtnClick
		, projStateTableCnf
		, projStateTable: null
		, projStateFormSider: null
		, projStateFormCnf
		, projStateForm: null
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
		
		BdoDataTable('proj-state-table', this.projStateTableCnf());
		this.projStateFormSider = side({el: '#proj-state-form-sider'});
		this.projStateForm = createForm(this.projStateFormCnf());
		this.tableEventBind();
		OneUI.initHelper('slimscroll');
	}
	
	function tableEventBind() {
		console.info('tableEventBind');
		this.cmp['proj-state-table'].on('click', '.proj-state-edit-btn', this.onProjStateEditBtnClick);
		this.cmp['proj-state-table'].on('click', '.proj-state-del-btn', this.onProjStateDelBtnClick);
	}

	/**
	 * 新增
	 * @param event
	 */
	function onProjStateAddBtnClick(event) {
		console.info('onProjStateAddBtnClick');
		page.projStateFormSider.act = 'add';
		page.projStateForm.jsonData.autoId = '';
		page.projStateForm.jsonData.state = '';
		page.projStateForm.jsonData.stateName = '';
		page.projStateFormSider.show();
	}

	/**
	 * 修改
	 * @param event
	 */
	function onProjStateEditBtnClick(event) {
		console.info('onProjStateEditBtnClick');
		page.projStateFormSider.act = 'edit';
		let activeEl = $(event.currentTarget);
		let table = $('#proj-state-table').dataTable();
		let rowData = table.fnGetData(activeEl.attr('data-state-row-id'));
		page.projStateForm.jsonData.autoId = rowData.autoId;
		page.projStateForm.jsonData.state = rowData.state;
		page.projStateForm.jsonData.stateName = rowData.stateName;
		page.projStateFormSider.show();
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
	function onProjStateDelBtnClick(event) {
		console.info('onProjStateDelBtnClick');
		let activeEl = $(event.currentTarget);
		let table = $('#proj-state-table').dataTable();
		let rowData = table.fnGetData(activeEl.attr('data-state-row-id'));
		bdoConfirmBox('提示', '确定删除该行数据吗？', isConfirm => {
			$http('auth/AuthKProjectstate.delete.json',{
				jsonData: JSON.stringify([rowData.autoId])
			}).then(data => {
				if (data.success) {
					OneUI.notifySuccess('删除成功！');
					$('#proj-state-table').DataTable().ajax.reload();
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
	function projStateTableCnf() {
		let cnt = 0;
		let rowNum = 0;
		return {
			localParam: {
				url: 'auth/AuthKProjectstate.list.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'AUTH_PS0001'
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
						let renderStr = '<div class="btn-group"><button class="btn btn-xs btn-success proj-state-edit-btn" type="button" name="projStateEdit" id="projStateEdit" data-placement="top" title="编辑" data-toggle="tooltip" data-original-title="编辑"' +
							'data-state-id="' + row.autoId + '"' +
							'data-state-row-id="' + meta.row + '"' +
							'><i class="fa fa-edit"></i></button>';
						renderStr += '<button class="btn btn-xs btn-danger proj-state-del-btn" type="button" name="projStateDel" id="projStateDel" data-placement="top" title="删除" data-toggle="tooltip" data-original-title="删除"' +
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
					title: '状态名称',
					name: 'stateName',
					data: 'stateName',
					width: '150px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '状态值',
					name: 'state',
					data: 'state',
					width: '150px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '创建日期',
					name: 'creationDate',
					data: 'creationDate',
					width: '300px',
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
					width: '300px',
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
	 * @returns {{ajaxConfig: {success(*): void, dataType: string, type: string, url: string}}|{buttons: [{icon: string, style: string, id: string, text: string, typeAttr: {'v-on:click': string}}, {icon: string, style: string, id: string, text: string, typeAttr: {'v-on:click': string}}], data(): {ajaxConfig: {success(*): void, dataType: string, type: string, url: string}}, methods: {onProjStateSaveClick(*): void, onCancelClick(): void}, display: string, options: {propsData: {jsonData: {stateName: string, autoId: string, state: string}}}, column: number, id: string, items: [{colspan: number, rowspan: number, id: string, label: string, type: string, validate: {rules: {required: boolean}}}, {colspan: number, rowspan: number, id: string, label: string, type: string, validate: {rules: {required: boolean}}}], props: {jsonData: ObjectConstructor}}}
	 */
	function projStateFormCnf(){
		return {
			options: {
				propsData: {
					jsonData: {
						autoId: '',
						stateName: '',
						state: ''
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 1,
			id: 'proj-state-form',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: 'auth/AuthKProjectstate.save.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								OneUI.notifySuccess('保存成功！');
								page.projStateFormSider.hide();
								$('#proj-state-table').DataTable().ajax.reload();
							} else {
								OneUI.notifyError(data.resultInfo.statusText);
							}
						}
					}
				};
			},
			methods: {
				onProjStateSaveClick(event) {
					if(page.projStateFormSider.act ) {
						if(page.projStateFormSider.act == 'add') {
							this.autoId = null;
						}
					} 
					this.submit(true);
				},
				onCancelClick() {
					page.projStateFormSider.hide();
				}
			},
			buttons: [{
				id: 'proj-state-save-btn',
				icon: 'fa-check-square-o',
				style: 'btn-success',
				text: '保存',
				typeAttr: {
					'v-on:click': 'onProjStateSaveClick'
				}
			}, {
				id: 'proj-state-cancel-btn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'v-on:click': 'onCancelClick'
				}
			}],
			items: [{
				id: 'stateName',
				type: 'input',
				label: '状态名称',
				rowspan: 1,
				colspan: 1,
				validate: {
					rules: {
						required: true
					}
				}
			},{
				id: 'state',
				type: 'input',
				label: '状态值',
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