$(document).ready(function() {
	/**
	 * 页面构造器
	 * @param $
	 * @param root
	 * @param doc
	 * @returns {*}
	 * @constructor
	 */
	function OteFactory($, root, doc) {
		/**
		 * 如果页面已有实例，只需重新挂载
		 */
		if(root.OtePage) {
			return root.OtePage;
		}

		/**
		 * ote页面类
		 * @constructor
		 */
		function Ote(){}

		/**
		 * 页面对象
		 * @type {Ote}
		 */
		let OtePage = new Ote();
		/**
		 * 页面模板
		 */
		let OtePageTpl = tplLoader('ote/html/ote.html');
		/**
		 * 页面模板渲染对象
		 * @type {*|jQuery|HTMLElement}
		 */
		let $OtePage = $(OtePageTpl);
		/**
		 * 挂载ID
		 */
		let elId = $OtePage.prop('id');
		/**
		 * 挂载选择器
		 * @type {string}
		 */
		let selector = '#' + elId;
		/**
		 * 子页面相关变量：考核详情页面
		 */
		let oteDetailTplText, oteDetailTpl, $oteDetail, oteDetailSubPage, oteDetailObject;
		/**
		 * 子页面相关变量：新增考试项目页面
		 */
		let oteNewTplText, oteNewTpl, $oteNew, oteNewSubPage, oteNewObject;

		/**
		 * 考试项目一览table 配置
		 * @type {number}
		 */
		let cnt = 0;
		/**
		 * 考试项目一览table 配置
		 * @type {{localParam: {url: string, urlparam: {menuId: *}, tabNum: boolean}, tableParam: {scrollY: boolean, scrollX: boolean, select: boolean, ordering: boolean, pageLength: number, dom: string, columnDefs: *[]}}}
		 */
		const oteTableConf = {
			localParam : {
				url: 'ot/OtExam.queryExam.json',
				urlparam: {
					menuId : window.sys_menuId
				},
				tabNum : false
			},
			tableParam : {
				select: true,
				serverSide: true,
				autoWidth: true,
				scrollY: 500,
				scrollX: true,
				// scrollCollapse: true,
				paging: true,
				fixedColumns: true,
				ordering : true,
				pageLength : 10,
				dom: `<'row'<'col-sm-12'tr>><'row'<'col-sm-6'i><'col-sm-6'p>>`,
				columnDefs :[{
					targets : (()=>{cnt=0;return ++cnt;})(),
					orderable : false,
					className : 'text-center',
					title : '处理',
					width : '80px',
					render(data, type, row, meta) {
						let renderStr = '';
						if(row.isCerGenerated == '1') {
							renderStr = '<button class="btn btn-xs btn-success table-btn-operate opt-link-to-balance" type="button" data-ote-btn-click="onViewCerClick" data-placement="top" title="查看证书" data-toggle="tooltip" data-row="'+meta.row+'">'
								+'	<i class="fa fa-file-image-o"></i>'
								+'	</button>';
						}
						if(row.isQualified == 1 && row.isCerGenerated != '1') {
							renderStr = '<button class="btn btn-xs btn-success table-btn-operate opt-link-to-balance" type="button" data-ote-btn-click="onGenerateCerClick" data-placement="top" title="生成证书" data-toggle="tooltip" data-row="'+meta.row+'">'
								+'	<i class="fa fa-print"></i>'
								+'	</button>';
						}
						if(row.isCerGenerated != '1') {
							renderStr += '<button class="btn btn-xs btn-success table-btn-operate opt-link-to-balance" type="button" data-ote-btn-click="onRefreshScoreClick" data-placement="top" title="获取最新结果" data-toggle="tooltip" data-row="'+meta.row+'">'
								+'	<i class="fa fa-refresh"></i>'
								+'	</button>';
						}
						if(row.oteLevel == 200) {
							renderStr += '<button class="btn btn-xs btn-success table-btn-operate opt-link-to-balance" type="button" data-ote-btn-click="onViewOteDetailClick" data-placement="top" title="考核详情" data-toggle="tooltip" data-row="'+meta.row+'">'
								+'	<i class="fa fa-eye"></i>'
								+'	</button>';
						}

						return renderStr;
					}
				},{
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '编号',
					name: 'customerId',
					data : 'customerId',
					width : '50px'
				}, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '级别',
					name: 'oteLevel',
					data : 'oteLevel',
					width : '50px',
					render(data, type, row, meta) {
						let val = DicVal2Nm(data, '审计平台考核级别');
						let linkStr = '';
						if(100 == data && row.isQualified == 1) {
							linkStr = '<a  style="cursor: pointer;" data-ote-btn-click="onNewOteProjectClick" data-project-id="' + row.projectId + '" data-row="' + meta.row + '">[参加高级考核]</a>'
						}
						return `<div><span>` + val + `</span>` + linkStr + `</div>`;
					}
				}/*, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '客户名称',
					name: 'customerName',
					data : 'customerName',
					width : '100px'
				}, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '项目名称',
					name : 'projectName',
					data : 'projectName',
					width : '120px'
				}, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '进度',
					name : 'rop',
					data : 'rop',
					width : '20px',
					render(data) {
						return data + '%';
					}
				}, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '题考通过',
					name : 'isWePassed',
					data : 'isWePassed',
					width : '60px',
					render(data, type, row, meta) {
						let val = DicVal2Nm(data, 'boolean');
						let linkStr = '';
						if(!val || val == '' || val == 'null' || val == 'undefined') {
							val = '否';
						}
						if(data != 1) {
							linkStr = '<a  style="cursor: pointer;" data-ote-btn-click="onLinkToTrainSysClick" data-project-id="' + row.projectId + '">(点我参加)</a>'
						}
						return `
								<div><span>` + val + `</span>` + linkStr + `</div>`;
					}
				}, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '机考通过',
					name : 'isOtePassed',
					data : 'isOtePassed',
					width : '60px',
					render(data, type, row, meta) {
						let val = DicVal2Nm(data, 'boolean');
						let linkStr = '';
						if(!val || val == '' || val == 'null' || val == 'undefined') {
							val = '否';
						}
						if(data != 1) {
							linkStr = '<a style="cursor: pointer;" data-ote-btn-click="onLinkToExamSysClick" data-project-id="' + row.projectId + '">(点我参加)</a>'
						}
						return `
								<div><span>` + val + `</span>` + linkStr + `</div>`
					}
				}*/, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '通过',
					name : 'isQualified',
					data : 'isQualified',
					width : '80px',
					render(data, type, row, meta) {
						let val = DicVal2Nm(data, 'boolean');
						let linkStr = '';
						if(!val || val == '' || val == 'null' || val == 'undefined') {
							val = '否';
						}
						if(data != 1) {
							linkStr = '<a  style="cursor: pointer;" data-ote-btn-click="onLinkToExamSysClick" data-project-id="' + row.projectId + '" data-row="' + meta.row + '">(点我参加)</a>'
						}
						return `<div><span>` + val + `</span>` + linkStr + `</div>`;
					}
				}, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '已有证书',
					name : 'isCerGenerated',
					data : 'isCerGenerated',
					width : '40px',
					render(data) {
						return DicVal2Nm(data, 'boolean');
					}
				}, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '开始时间',
					name : 'startDate' ,
					data : 'startDate',
					width : '80px',
					render(data) {
						if(!data || data == '' || data == 'null' || data == 'undefined') {
							return '';
						}
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets : ++cnt,
					className : 'text-center',
					title : '结束时间',
					name : 'endDate',
					data : 'endDate',
					width : '80px',
					render(data) {
						if(!data || data == '' || data == 'null' || data == 'undefined') {
							return '';
						}
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}]
			}
		};

		/**
		 * 初始化考试一览table
		 */
		function initOteTable() {
			BdoDataTable('oteTable', oteTableConf, $OtePage);
			this.oteTable = $('#oteTable', $OtePage);
		}

		/**
		 * 初始化考核详情
		 * @returns {{title: string, otes: Array, readonly: string, oteVersion: string}}
		 */
		function initOteDetailSider() {
			if(this.oteDetailPage) {
				this.oteDetailPage.render();
				return;
			}
			oteDetailTplText = tplLoader('ote/html/oteDetail.html');
			let id = $(oteDetailTplText).prop('id');
			let selector = '#' + id;
			$oteDetail = $(selector, $OtePage);
			oteDetailTpl = template('ote/html/oteDetail.html', oteDetailTplText);

			oteDetailSubPage = side({el: selector, autoHide: false});
			this.oteDetailPage = oteDetailObject = {
				text: oteDetailTplText,
				template: oteDetailTpl,
				page: oteDetailSubPage,
				$el: $oteDetail,
				$data: null,
				$form: null,
				data() {
					return {
						title: '',
						oteNodes: []
					};
				},
				render() {
					let oteDetailTplHtml = this.template(this.$data);
					$oteDetail.replaceWith($(oteDetailTplHtml));
					this.$el = $oteDetail = $(selector, $OtePage);
					this.page = oteDetailSubPage = side({el: selector, autoHide: false});
					this.$form = this.$el.find('#oteDetailForm');
					this.eventBind();
					$.sessionStorage('slimscrollContext', '#' + this.$el.prop('id'));
					OneUI.initHelper('slimscroll');
				},
				events: {
				},
				eventBind() {
				},
				init(option) {
					this.$data = this.data();
					this.render();
				}
			};
			this.oteDetailPage.init();
		}

		/**
		 * 初始化新建考核项目子页面
		 * @returns {{title: string, customers: Array, projects: Array, customerId: null, projectId: null, customerProjects: null}}
		 */
		function initOteNewSider() {
			if(this.oteNewPage) {
				this.oteNewPage.render();
				return;
			}
			oteNewTplText = tplLoader('ote/html/oteNew.html');
			let id = $(oteNewTplText).prop('id');
			let selector = '#' + id;
			$oteNew = $(selector, $OtePage);
			oteNewTpl = template('ote/html/oteNew.html', oteNewTplText);

			oteNewSubPage = side({el: selector, autoHide: false});
			this.oteNewPage = oteNewObject = {
				process: 'new',
				text: oteNewTplText,
				template: oteNewTpl,
				page: oteNewSubPage,
				$el: $oteNew,
				$data: null,
				$form: null,
				data() {
					return {
						title: '',
						customers: [],
						projects: [],
						customerId: null,
						projectId: null,
						customerProjects: null
					};
				},
				render() {
					let oteNewTplHtml = this.template(this.$data);
					let $oteNewHtml = $(oteNewTplHtml);
					$('#realCustomerId', $oteNewHtml).val(this.$data.customerId);
					$('#realProjectId', $oteNewHtml).val(this.$data.projectId);
					if(this.$el && this.$el.hasClass('in')) {
						$oteNewHtml.addClass('in');
					}
					$oteNew.replaceWith($oteNewHtml);
					this.$el = $oteNew = $(selector, $OtePage);
					this.page = oteNewSubPage = side({el: selector, autoHide: false});
					this.$form = this.$el.find('#oteNewForm');
					this.eventBind();
					OneUI.initHelper('slimscroll');
				},
				events: {
					onSaveOteClick(event) {
						if(this.process == 'view') {
							return;
						}
						if(!this.$form.valid()) {
							return;
						}
						let customerId = $('#realCustomerId', this.$form).val();
						let projectId = $('#realProjectId', this.$form).val();
						let params = {
							preOteId: this.$data.preOteId,
							oteLevel: 200,
							projectId,
							customerId
						};
						let url = 'ot/OtExam.generateExam.json';
						$.ajax({
							type: 'post',
							url: url,
							data: {jsonData: JSON.stringify(params)},
							dataType: 'json'
						}).done(data => {
							if(data.success === true) {
								bdoInfoBox('成功', '保存成功。');
								this.page.hide();
								OtePage.oteTable.DataTable().ajax.reload();
							}else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						});
					},
					onSelectCustomer(event) {
						let $el = $(event.currentTarget);
						if($el.val()) {
							this.$data.projects = this.$data.customerProjects[$el.val()];
							this.$data.projectId = this.$data.projects[0].value;
						}
						this.$data.customerId = $el.val();
						this.render();
						//this.page.show();
					}
				},
				eventBind() {
					this.$el.on('click', '[data-ote-btn-click]', function(event) {
						let actionNm = $(event.currentTarget).attr('data-ote-btn-click');
						if(actionNm && this.events[actionNm]) {
							this.events[actionNm].bind(this)(event);
						}
					}.bind(this));
					this.$el.on('change', '[data-ote-input-change]', function(event) {
						let actionNm = $(event.currentTarget).attr('data-ote-input-change');
						if(actionNm && this.events[actionNm]) {
							this.events[actionNm].bind(this)(event);
						}
					}.bind(this));
				},
				init(option) {
					this.$data = this.data();
					this.render();
				}
			};
			this.oteNewPage.init();
		}


		/**
		 * 子页面相关变量：新增考试项目页面
		 */
		let oteCerTplText, oteCerTpl, $oteCer, oteCerSubPage, oteCerObject;
		/**
		 * 初始化新建考核项目子页面
		 * @returns {{title: string, customers: Array, projects: Array, customerId: null, projectId: null, customerProjects: null}}
		 */
		function initOteCerSider() {
			if(this.oteCerPage) {
				return;
			}
			oteCerTplText = tplLoader('ote/html/oteCer.html');
			let id = $(oteCerTplText).prop('id');
			let selector = '#' + id;
			$oteCer = $(selector, $OtePage);
			oteCerTpl = template('ote/html/oteCer.html', oteCerTplText);

			oteCerSubPage = side({el: selector, autoHide: false});
			this.oteCerPage = oteCerObject = {
				process: 'new',
				text: oteCerTplText,
				template: oteCerTpl,
				page: oteCerSubPage,
				$el: $oteCer,
				$data: null,
				$form: null,
				data() {
					return {
						title: '',
						cerData: ''
					};
				},
				render() {
					let oteCerTplHtml = this.template(this.$data);
					let $oteCerHtml = $(oteCerTplHtml);

					$oteCer.replaceWith($oteCerHtml);
					this.$el = $oteCer = $(selector, $OtePage);
					this.page = oteCerSubPage = side({el: selector, autoHide: false});
					this.eventBind();
					$.sessionStorage('slimscrollContext', '#' + this.$el.prop('id'));
					OneUI.initHelper('slimscroll', this.$el.prop('id'));
				},
				events: {

				},
				eventBind() {

				},
				init(option) {
					this.$data = this.data();
					this.render();
				}
			};
			this.oteCerPage.init();
		}

		/**
		 * 新建考试
		 * @param event
		 */
		function onNewOteClick(event) {
			let params = {
				oteLevel: 100
			};
			let url = 'ot/OtExam.generateExam.json';
			$.ajax({
				type: 'post',
				url: url,
				data: {jsonData: JSON.stringify(params)},
				dataType: 'json'
			}).done(data => {
				if(data.success === true) {
					bdoInfoBox('成功', '保存成功。');
					OtePage.oteTable.DataTable().ajax.reload();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}

		/**** events *********/
		/**
		 * 新建考试项目
		 * @param event
		 */
		function onNewOteProjectClick(event) {
			let customers = this.oteNewPage.$data.customers;
			let customerProjects = this.oteNewPage.$data.customerProjects;
			let rowData = getRowData($(event.currentTarget));
			if(rowData.isCerGenerated == '0'){
				bdoInfoBox("提示", '请先生成初级证书。');
				return;
			}
			if(rowData.isExpired == '1'){
				bdoInfoBox("提示", '证书已过期，请重新参加初级考试。');
				return;
			}
			function showSider() {
				this.oteNewPage.$data = this.oteNewPage.data();
				this.oteNewPage.$data.title = '新增考试';
				this.oteNewPage.$data.customers = customers;
				this.oteNewPage.$data.customerProjects = customerProjects;
				this.oteNewPage.$data.preOteId = rowData.autoId;
				this.oteNewPage.render();
				this.oteNewPage.page.show();
			}
			if(customers && customers.length > 0) {
				showSider.bind(this)();
			}else {
				$.ajax({
					type: 'post',
					url: 'ot/OtExam.queryCanReadData.json',
					data: {},
					dataType: 'json'
				}).done(data => {
					if(data.success == true) {
						if(data.data && data.data.length > 0) {
							customers = data.data[0].customerList;
							customerProjects = data.data[0].customerProjectMap;
						}
						showSider.bind(this)();
					}else {
						bdoErrorBox("错误", data.resultInfo.statusText);
					}
				});
			}
		}

		/**
		 *
		 * @param event
		 */
		function onOpenVideo(event) {
			localStorage.setItem('url', $(event.currentTarget).attr('data-video-href'));
			window.open("/Faith/dgCenter/html/dg/video.html?src="+encodeURIComponent($(event.currentTarget).attr('data-video-href')));
		}
		/**
		 * 刷新考试一览table
		 * @param event
		 */
		function onRefreshOteClick(event) {
			OtePage.oteTable.DataTable().ajax.reload();
		}

		/**
		 * 生成证书
		 * @param event
		 */
		function onGenerateCerClick(event) {
			let $el = $(event.currentTarget);
			let rowNum = $el.attr('data-row');
			let table = OtePage.oteTable.dataTable();
			let rowData = table.fnGetData(rowNum);
			let param = {
				autoId: rowData.autoId,
				customerId: rowData.customerId,
				projectId: rowData.projectId
			};
			bdoInProcessingBox('处理中');
			$.ajax({
				type: 'post',
				url: 'ot/OtExam.generateCertificate.json',
				data: {jsonData: JSON.stringify(param)},
				dataType: 'json'
			}).done(data => {
				if(data.success == true) {
					bdoInfoBox('成功', '证书生成成功。');
					OtePage.oteTable.DataTable().ajax.reload();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}

		/**
		 * 刷新分数
		 * @param event
		 */
		function onRefreshScoreClick(event) {
			let $el = $(event.currentTarget);
			let rowNum = $el.attr('data-row');
			let table = OtePage.oteTable.dataTable();
			let rowData = table.fnGetData(rowNum);
			let param = {
				autoId: rowData.autoId,
				customerId: rowData.customerId,
				projectId: rowData.projectId
			};
			$.ajax({
				type: 'post',
				url: 'ot/OtExam.refreshExamScore.json',
				data: {jsonData: JSON.stringify(param)},
				dataType: 'json'
			}).done(data => {
				if(data.success == true) {
					bdoSuccessBox('成功', '分数刷新成功');
					OtePage.oteTable.DataTable().ajax.reload();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}

		/**
		 * 获取行数据
		 * @param $el
		 * @returns {Array|Object|string|*}
		 */
		function getRowData($el) {
			let rowNum = $el.attr('data-row');
			let table = OtePage.oteTable.dataTable();
			return table.fnGetData(rowNum);
		}

		/**
		 * 跳转到项目操作考试系统
		 * @param event
		 */
		function onLinkToExamSysClick(event) {
			let $el = $(event.currentTarget);
			let rowData = getRowData($el);
			event.data = rowData;
			if(rowData.oteLevel == 100) {
				this.events.onLinkToTrainSysClick(event);
			}else if(rowData.oteLevel == 200){
				$('#oteLinkModal [data-ote-btn-click]').attr('data-row', $el.attr('data-row'));
				$('#oteLinkModal').modal('show');
				//this.events.onLinkToSacpExamSysClick(event);
			}
		}

		/**
		 * 跳转sacp 考试系统
		 */
		function onLinkToSacpExamSysClick(event) {
			let rowData = event.data;
			if(!rowData) {
				rowData = getRowData($(event.currentTarget));
			}
			let param = {
				autoId: rowData.autoId,
				customerId: rowData.customerId,
				projectId: rowData.projectId
			};

			$.ajax({
				type: 'post',
				url: 'ot/OtExam.transToExamSys.json',
				data: {jsonData: JSON.stringify(param)},
				dataType: 'json'
			}).done(data => {
				if(data.success == true) {
					if(data.data[0].hasAdvancedSacp == '1'){
						bdoInfoBox('提示', '无需参加操作考试。');
						return;
					}
					let me = this;
					let form = $('<form>');
					form.attr('style', 'display:none');
					form.attr('target', '_blank');
					form.attr('method', 'post');
					form.attr('action', data.data[0].examSysLoginUrl);
					let params = {
						m: 'bdoSacpExamClientLogin',
						loginId: data.data[0].loginId,
						userInfo: data.data[0].userInfo
					};
					//form.attr('onsubmit','return false;');
					$.each(params, function(key, value) {
						var input = $('<input>');
						input.attr('type', 'hidden');
						input.attr('name', key);
						if ($.isPlainObject(value)) {
							input.attr('value', JSON.stringify(value));
						} else {
							input.attr('value', value);
						}
						form.append(input);
					});
					$(document.body).append(form);
					//me.container.append(form);
					form.submit();
					form.remove();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
			$('#oteLinkModal').modal('hide');
		}
		/**
		 * 跳转到培训考试系统
		 */
		function onLinkToTrainSysClick(event) {
			let rowData = event.data;
			if(!rowData) {
				rowData = getRowData($(event.currentTarget));
			}
			let param = {
				autoId: rowData.autoId,
				customerId: rowData.customerId,
				projectId: rowData.projectId,
				weId: rowData.weId
			};
			$.ajax({
				type: 'post',
				url: 'ot/OtExam.transToTrainSys.json',
				data: {jsonData: JSON.stringify(param)},
				dataType: 'json'
			}).done(data => {
				if(data.success == true) {
					let me = this;
					let form = $('<form>');
					form.attr('style', 'display:none');
					form.attr('target', 'body');
					form.attr('method', 'get');
					let uiQueryStr = '#/course/home?autoId='+data.data[0].qeId+'&courseStatus=1';
					form.attr('action', data.data[0].trainSysLoginUrl+uiQueryStr);
					let params = {
						m: 'sacplogin',
						ueserLoginId: data.data[0].loginId,
						token: data.data[0].transToken
					};
					//form.attr('onsubmit','return false;');
					$.each(params, function(key, value) {
						var input = $('<input>');
						input.attr('type', 'hidden');
						input.attr('name', key);
						if ($.isPlainObject(value)) {
							input.attr('value', JSON.stringify(value));
						} else {
							input.attr('value', value);
						}
						form.append(input);
					});
					$(document.body) .append(form);
					//me.container.append(form);
					form.submit();
					form.remove();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
			$('#oteLinkModal').modal('hide');
		}

		/**
		 * 考试详情
		 * @param event
		 */
		function onViewOteDetailClick(event) {
			let $el = $(event.currentTarget);
			let rowNum = $el.attr('data-row');
			let table = OtePage.oteTable.dataTable();
			let rowData = table.fnGetData(rowNum);
			if(rowData.oteLevel != 200) {
				return;
			}
			let param = {
				autoId: rowData.autoId,
				customerId: rowData.customerId,
				projectId: rowData.projectId
			};
			$.ajax({
				type: 'post',
				url: 'ot/OtExam.queryExamDetail.json',
				data: {jsonData: JSON.stringify(param)},
				dataType: 'json'
			}).done(data => {
				if(data.success == true) {
					this.oteDetailPage.$data = this.oteDetailPage.data();
					this.oteDetailPage.$data.title = '考核详情';
					this.oteDetailPage.$data.score = rowData.score;
					this.oteDetailPage.$data.weScore = rowData.weScore;
					this.oteDetailPage.$data.oteScore = rowData.oteScore;
					this.oteDetailPage.$data.wePassScore = rowData.wePassScore;
					this.oteDetailPage.$data.otePassScore = rowData.otePassScore;
					let wePassText = '未合格';
					let otePassText = '未合格';
					if(rowData.wePassScore >= rowData.weScore) {
						wePassText = '已合格';
					}
					if(rowData.wePassScore >= rowData.weScore) {
						otePassText = '已合格';
					}
					this.oteDetailPage.$data.wePassText = wePassText;
					this.oteDetailPage.$data.otePassText = otePassText;

					this.oteDetailPage.$data.oteNodes = data.data;

					this.oteDetailPage.render();
					this.oteDetailPage.page.show();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}

		/**
		 * 查看证书
		 * @param event
		 */
		function onViewCerClick(event) {
			let $el = $(event.currentTarget);
			let rowNum = $el.attr('data-row');
			let table = OtePage.oteTable.dataTable();
			let rowData = table.fnGetData(rowNum);
			let param = {
				autoId: rowData.autoId,
				customerId: rowData.customerId,
				projectId: rowData.projectId
			};
			$.ajax({
				type: 'post',
				url: 'ot/OtExam.queryExamCer.json',
				data: {jsonData: JSON.stringify(param)},
				dataType: 'json'
			}).done(data => {
				if(data.success == true) {
					this.initOteCerSider();
					this.oteCerPage.$data = this.oteCerPage.data();
					this.oteCerPage.$data.title = '证书';
					this.oteCerPage.$data.cerData = 'data:image/jpeg;base64,' + data.data[0].certificate.certificateBase64Data;
					this.oteCerPage.render();
					this.oteCerPage.page.show();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
		/**
		 * 事件组织
		 * @type {{onLinkToSacpExamSysClick: onLinkToSacpExamSysClick, onViewOteDetailClick: onViewOteDetailClick, onNewOteClick: onNewOteClick, onNewOteProjectClick: onNewOteProjectClick, onOpenVideo: onOpenVideo, onViewCerClick: onViewCerClick, onGenerateCerClick: onGenerateCerClick, onLinkToExamSysClick: onLinkToExamSysClick, onRefreshOteClick: onRefreshOteClick, onRefreshScoreClick: onRefreshScoreClick, onLinkToTrainSysClick: onLinkToTrainSysClick}}
		 */
		let events = {
			onNewOteClick,
			onRefreshOteClick,
			onGenerateCerClick,
			onRefreshScoreClick,
			onLinkToExamSysClick,
			onLinkToTrainSysClick,
			onOpenVideo,
			onLinkToSacpExamSysClick,
			onNewOteProjectClick,
			onViewOteDetailClick,
			onViewCerClick
		};

		/**
		 * 事件绑定
		 */
		function eventBind() {

			this.$el.on('click', '[data-ote-btn-click]', function(event) {
				let actionNm = $(event.currentTarget).attr('data-ote-btn-click');
				if(actionNm && OtePage.events[actionNm]) {
					OtePage.events[actionNm].bind(OtePage)(event);
				}
			});
		}
		/**** events end*********/

		/**
		 * 挂载页面
		 * @param select
		 * @returns {mount}
		 */
		function mount(select) {
			if(this.isMounted) {
				$OtePage = $(OtePageTpl);
			}
			$(select).replaceWith($OtePage);
			this.$el = $OtePage = $(selector);
			this.eventBind();
			this.initOteTable();
			this.initOteNewSider();
			this.initOteDetailSider();
			this.isMounted = true;
			return this;
		}

		/**
		 * 页面属性组织
		 */
		$.extend(Ote.prototype, {
			$el: $OtePage,
			isMounted: false,
			events,
			oteNewPage: null,
			oteCerPage: null,
			oteDetailPage: null,
			oteTable: null,
			initOteTable,
			initOteNewSider,
			initOteDetailSider,
			initOteCerSider,
			eventBind,
			mount
		});

		/**
		 * 单例
		 * @type {Ote}
		 */
		root.OtePage = OtePage;

		/**
		 * 返回单例
		 */
		return root.OtePage;
	}

	/**
	 * 创建页面
	 * @type {*|void}
	 */
	let otePage = BdoFaithUtil.factory(OteFactory);
	/**
	 * 挂载页面
	 */
	otePage.mount('#otePage');
});