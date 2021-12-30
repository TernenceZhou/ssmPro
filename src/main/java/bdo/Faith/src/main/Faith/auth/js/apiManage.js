$(document).ready(function(event) {
	let _template = tplLoader('auth/html/apiManage.html');
	$('#authApiManagePage').html(_template);
	let page = new Page({
		random: (new Date).getTime() + parseInt(1e3 * Math.random())
		/**
		 * 根节点
		 */
		, container: '#authApiManagePage'
		/**
		 * 绑定事件
		 */
		, events: {
			'#api-manage-toggle-tree-btn': 'click,onToggleTreeClick',
			'#api-manage-fullscreen-btn': 'click,onFullscreenClick'
		}
		, _template
		/**
		 * 初始化
		 */
		, init
		, render
		, eventBind
		, createApiTree
		, onApiTreeRebuild
		, onNodeSelected
		, onMultipleAction
		, createRightPage
		, onTreeMouseover
		, $apiTree: null
		, $currentNode: null
		, $rightPage: null
		//, tableEventBind
		, onToggleTreeClick
		, onFullscreenClick
	});

	function init(options) {
		this.render();
		this.$rightPage = this.createRightPage();
		this.createApiTree();
		this.eventBind();
	}
	
	function render() {
		let $mainContainer = $('#main-container');
		let minHeight = $mainContainer.css('min-height');
		$mainContainer.css('height', minHeight + 'px');
		let height = $mainContainer.height() - 55;
		$('.api-manage-tree-block').css({
			"height": height + 'px',
			"max-height": height + 'px'
		});
		OneUI.initHelper('slimscroll');
	}
	
	function createRightPage() {
		let rightPage = new Page({
			random: (new Date).getTime() + parseInt(1e3 * Math.random())
			/**
			 * 根节点
			 */
			, container: '#api-manage-right-panal'
			/**
			 * 绑定事件
			 */
			, events: {
				/*'#api-manage-toggle-tree-btn': 'click,onToggleTreeClick',
				'#api-manage-fullscreen-btn': 'click,onFullscreenClick'*/
			}
			, _template: tplLoader('auth/html/apiManageRightPage.html')
			/**
			 * 初始化
			 */
			, init: rightPageInit
			, filterTableCnf
			, 
		});
		return rightPage;
	}
	
	function rightPageInit(options) {
		// api-manage-filter-table
		page.$rightPage.filterTableOptions = this.filterTableCnf();
		BdoDataTable('api-manage-filter-table', page.$rightPage.filterTableOptions);
	}
	
	function onTreeMouseover(event) {
		$(event.currentTarget).prop('title', $(event.currentTarget).text());
	}
	
	function eventBind() {
		$('#apiManagePage').on('mouseover', ' .js-tree-collapsed .list-group .list-group-item', page.onTreeMouseover);
	}
	
	function onApiTreeRebuild(event, options) {
		page.$apiTree.treeview({
			data: options.data,
			color: '#555',
			expandIcon: 'fa fa-plus',
			collapseIcon: 'fa fa-minus',
			onhoverColor: '#f9f9f9',
			selectedColor: '#000',
			selectedBackColor: '#f1f1f1',
			showTags: true,
			levels: options.levels
		});
		page.$apiTree.on('nodeSelected', page.onNodeSelected);
		page.$apiTree.on('nodeUnselected nodeCollapsed nodeExpanded', page.onMultipleAction);
		options.callback && options.callback(page.$apiTree.treeview(true));
	}
	
	function onNodeSelected(event, node) {
		console.log('onNodeSelected');
		let urlparam = page.$rightPage.filterTableOptions.localParam.urlparam;
		page.$currentNode = node;
		if(node.extraOptions) {
			page.cmp['api-manage-head-title'].text(node.extraOptions.apiPath);
			urlparam.param1 = node.extraOptions.autoId;
		}else {
			urlparam.param1 = '';
		}
		$('#api-manage-filter-table').DataTable().ajax.reload();
	}

	function onMultipleAction(event, node) {
		console.log('onMultipleAction');
		/*let dgTreeScrollTop = $dgTreeSlimscroll[0].scrollTop; // 当前科目树的滚动位置
		$('#dgPostilPage').hide();
		window.xxrPageKey = node.text;
		nodeSelectedActions.proxis.bind(this)(event, node);
		currentNode = node;
		delSubjectTreeBtnShow();
		setTimeout(()=>{
			$dgTreeSlimscroll[0].scrollTop = dgTreeScrollTop; // 哪来滚哪去
		});*/
	}

	function createApiTree() {
		let $apiTree = page.$apiTree = $('#api-manage-tree', this.container);
		$apiTree.bind('rebuild', this.onApiTreeRebuild);
		this.$http('auth/AuthKApi.queryApiTree.json', {})
			.then(data => {
				page.$apiTree.trigger('rebuild', [{
					data: data.data,
					levels: 1,
					callback(tree) {}
				}]);
			}).catch(() => {});
		return page.$apiTree;
	}
	
	function onToggleTreeClick(event) {

	}
	
	function onFullscreenClick(event) {

	}

	function filterTableCnf() {
		let cnt = 0;
		let rowNum = 0;
		return {
			localParam: {
				url: 'auth/AuthKApi.queryApiFiler.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'AUTH_PS0003',
					param1: '' // apiId
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
						let renderStr = '<div class="btn-group"><button class="btn btn-xs btn-success api-manage-edit-btn" type="button" name="ProjRoleEdit" id="ProjRoleEdit" data-placement="top" title="编辑" data-toggle="tooltip" data-original-title="编辑"' +
							'data-state-id="' + row.autoId + '"' +
							'data-state-row-id="' + meta.row + '"' +
							'><i class="fa fa-edit"></i></button>';
						renderStr += '<button class="btn btn-xs btn-danger api-manage-del-btn" type="button" name="ProjRoleDel" id="ProjRoleDel" data-placement="top" title="删除" data-toggle="tooltip" data-original-title="删除"' +
							'data-state-id="' + row.autoId + '"' +
							'data-state-row-id="' + meta.row + '"' +
							'><i class="fa fa-times"></i></button></div>';
						return renderStr;
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: 'API编号',
					name: 'apiId',
					data: 'apiId',
					width: '50px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '过滤器编号',
					name: 'filterId',
					data: 'filterId',
					width: '50px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '过滤器beanName',
					name: 'beanName',
					data: 'beanName',
					width: '150px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '过滤器类',
					name: 'className',
					data: 'className',
					width: '300px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					title: '过滤器级别',
					name: 'filterLevel',
					data: 'filterLevel',
					width: '30px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					title: '排序',
					name: 'sortNum',
					data: 'sortNum',
					width: '30px',
					className: 'text-center'
				}, {
					targets: ++cnt,
					title: '过滤规则',
					name: 'rules',
					data: 'rules',
					width: '300px',
					className: 'text-center',
					render(data, type, row, meta) {
						return '...';
					}
				}]
			}
		}
	}

	function ApiManageFormCnf(){
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
			id: 'api-manage-form',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: 'auth/AuthKApi.save.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								OneUI.notifySuccess('保存成功！');
								page.ProjRoleFormSider.hide();
								$('#api-manage-table').DataTable().ajax.reload();
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
							this.ajaxConfig.url = 'auth/AuthKApi.save.json';
						}else {
							this.ajaxConfig.url = 'auth/AuthKApi.update.json';
						}
					}
					this.submit(true);
				},
				onCancelClick() {
					page.ProjRoleFormSider.hide();
				}
			},
			buttons: [{
				id: 'api-manage-save-btn',
				icon: 'fa-check-square-o',
				style: 'btn-success',
				text: '保存',
				typeAttr: {
					'v-on:click': 'onProjRoleSaveClick'
				}
			}, {
				id: 'api-manage-cancel-btn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'v-on:click': 'onCancelClick'
				}
			}],
			items: [{
				id: 'apiPath',
				type: 'input',
				label: '接口',
				rowspan: 1,
				colspan: 1,
				validate: {
					rules: {
						required: true
					}
				}
			},{
				id: 'apiName',
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
				id: 'apiLevel',
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
				id: 'apiDesc',
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