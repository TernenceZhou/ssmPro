(() => {
	var cnt = 0;
	var flowName = {
		materiality: '重要性水平',
		trialBalance: '试算平衡',
		unaudited: '未审报表核对',
		identified: '科目认定',
		programPlan: '审计程序计划',
		program: '审计程序'
	};
	var page = new Page({
		random: (new Date).getTime() + parseInt(1e3 * Math.random())
		/**
		 * 根节点
		 */
		, container: '#projectCtrlPage'
		/**
		 * 事件绑定
		 */
		, events: {
			'#refreshProjectInfoBtn': 'click,refreshProjectInfo',
			'#refreshStateBtn': 'click,refreshStateTable'
		}
		/**
		 * 初始化函数
		 */
		, init(options) {
			// 项目基本信息
			this.projectInfoForm = createForm(this.projectInfoFormCfg);
			// 项目底稿基本设置
			this.projectDgSettingForm = createForm(this.projectDgSettingFormCfg);
			// 底稿完成状态
			BdoDataTable('dgFinishedTable', this.dgFinishedTableCfg);

			this.refreshProjectInfo.bind(this)();
		}
		, refreshProjectInfo() {
			this.fetchProjectInfo();
			this.fetchProjectMemberInfo();
		}
		/**
		 * 获取项目信息
		 */
		, fetchProjectInfo() {
			let me = this;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgProject.getProjectInfo.json',
				async: false,
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$.each(data.data[0], (index, val) => {
							me.projectInfoForm.jsonData[index] = val;
						});
					}
				}
			});
		}
		, fetchProjectMemberInfo() {
			var me = this;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgProject.getProjectMemberInfo.json',
				async: false,
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						let members = [];
						data.data.forEach((m, index) => {
							members.push(m.memberName);
						});
						me.projectInfoForm.jsonData.member = members.join(',');
					}
				}
			});
		}
		/**
		 * 刷新底稿完成状态表达
		 */
		, refreshStateTable() {
			$('#dgFinishedTable').DataTable().ajax.reload();
		}
		/**
		 * 选择项目
		 */
		, selectProject() {
		}
		/**
		 * 保存项目设置
		 */
		, saveSetting() {
		}
		/**
		 * 重置项目底稿编制
		 */
		, resetProjectDg() {
		}
		, projectInfoForm: null
		, projectInfoFormCfg: {
			options: {
				propsData: {
					jsonData: {
						audit1: '',
						audit1Name: '',
						customerId: '',
						customerName: '',
						managerId: '',
						managerName: '',
						projectId: '',
						projectName: '',
						signUser: '',
						singUserName: ''
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 6,
			id: 'projectInfoForm',
			data() {
				return {};
			},
			methods: {
				loadProjectMember() {
					page && page.fetchProjectMemberInfo();
				}
			},
			items: [{
				id: 'customerName',
				type: 'input',
				label: '客户',
				rowspan: 1,
				colspan: 6,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'projectName',
				type: 'textarea',
				label: '项目',
				rowspan: 1,
				colspan: 6,
				typeAttr: {
					rows: 2,
					readonly: true
				}
			}, {
				id: 'managerName',
				type: 'input',
				label: '项目负责人',
				rowspan: 1,
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'singUserName',
				type: 'input',
				label: '签字合伙人',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'audit1Name',
				type: 'input',
				label: '一审经理',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'member',
				type: 'textarea',
				label: '组员<div style="display: inline;margin-left: 100px;"><buttun class="btn btn-xs btn-primary" @click="loadProjectMember"><i class="fa fa-refresh">加载</i></buttun></div>',
				rowspan: 1,
				colspan: 6,
				typeAttr: {
					rows: 3,
					readonly: true
				}
			}]
		}
		, projectDgSettingForm: null
		, projectDgSettingFormCfg: {
			options: {
				propsData: {
					jsonData: {}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 6,
			id: 'projectDgSettingForm',
			data() {
				return {};
			},
			methods: {},
			items: [{
				id: 'tbYear',
				html: (() => {
					const res = '<div class="form-material input-group">'
						//+'<div class="row">'
						+ '	<select class="form-control" id="" style="width: 100px;">'
						+ '		<option value=""></option>'
						+ '	</select>'
						+ '	<span id="" class="input-group-addon">-</span>'
						+ '	<select class="form-control" id="" style="width: 100px;">'
						+ '		<option value=""></option>'
						+ '	</select>'
						+ '	<label for="tb_startYear">财务账套</label>'
						//+'</div>'
						+ '</div>';
					return res;
				})(),
				rowspan: 1,
				colspan: 6
			}, {
				id: 'reportFormat',
				type: 'combo',
				label: '报表格式',
				rowspan: 1,
				colspan: 6,
				validate: {
					rules: {
						//required : true
					}
				},
				typeAttr: {
					multiple: false
				},
				plugin: {
					name: 'combo',
					options: {
						noneSelectedText: '请选择',
						multipleSeparator: ',',
						width: '100%'
					},
					stores: []
				}
			}, {
				id: 'tbTemplate',
				type: 'combo',
				label: 'TB模板',
				rowspan: 1,
				colspan: 6,
				validate: {
					rules: {
						//required : true
					}
				},
				typeAttr: {
					multiple: false
				},
				plugin: {
					name: 'combo',
					options: {
						noneSelectedText: '请选择',
						multipleSeparator: ',',
						width: '100%'
					},
					stores: []
				}
			}, {
				id: 'tbReportTemplate',
				type: 'combo',
				label: '报表模板',
				rowspan: 1,
				colspan: 6,
				validate: {
					rules: {
						//required : true
					}
				},
				typeAttr: {
					multiple: false
				},
				plugin: {
					name: 'combo',
					options: {
						noneSelectedText: '请选择',
						width: '100%'
					},
					stores: []
				}
			}]
		}
		, dgFinishedTable: null
		, dgFinishedTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00040',
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID
				},
				tabNum: true
			},
			tableParam: {
				select: true,
				lengthChange: false,
				ordering: true,
				order: [],
				serverSide: true,
				dom: '<"row"<"col-sm-12"tr>>',
//				paging: false,
				columnDefs: [
					{
						targets: ++cnt,
						orderable: true,
						title: '名称',
						name: 'flowName',
						width: '150px',
						render(data, type, row, meta) {
							return flowName[row.prefix];
						}
					}, {
						targets: ++cnt,
						orderable: true,
						title: '进度',
						name: 'State',
						data: 'State',
						width: '300px'
					}, {
						targets: ++cnt,
						orderable: true,
						title: '审核人',
						name: '',
						data: 'AuditUser',
						width: '300px'
					}
				]
			}
		}
	});
})();
