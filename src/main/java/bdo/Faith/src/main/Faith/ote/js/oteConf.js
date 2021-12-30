$(document).ready(function() {
	function OteConfFactory($, root, doc) {
		//let oteConf = new OteConf();
		if(root.OteConfPage) {
			return root.OteConfPage;
		}
		let OteConfPage = new OteConf();

		let oteConfPageTpl = tplLoader('ote/html/oteConf.html');
		let $oteConfPage = $(oteConfPageTpl);
		let elId = $oteConfPage.prop('id');
		let selector = '#' + elId;

		let oteConfDetailTplText, oteConfDetailTpl, $oteConfDetail, oteConfDetailSubPage, oteConfDetailObject;


		function OteConf(){}

		let cnt = 0;
		let activeVersion;
		const oteConfTableConf = {
			localParam : {
				url: 'ot/OtExam.queryOteConfigs.json',
				urlparam: {
					menuId : window.sys_menuId
				},
				tabNum : false
			},
			tableParam : {
				scrollY: false,
				scrollX : true,
				select : true,
				ordering : true,
				pageLength : 10,
				dom: `<'row'<'col-sm-12'tr>><'row'<'col-sm-6'i><'col-sm-6'p>>`,
				columnDefs :[{
					targets : (()=>{cnt=0;return ++cnt;})(),
					orderable : false,
					className : 'text-center',
					title : '处理',
					width : '100px',
					render(data, type, row, meta) {
						let renderStr = '';
						if(row.isActive == '1') {
							/*renderStr = '<button class="btn btn-xs btn-success table-btn-operate opt-link-to-balance" type="button" data-ote-btn-click="onEditOteRulesClick" data-placement="top" title="修改" data-toggle="tooltip" data-row="'+meta.row+'">'
								+'	<i class="fa fa-edit"></i>'
								+'	</button>';*/
							activeVersion = row.oteVersion;
						}else {
							renderStr = '<button class="btn btn-xs btn-success table-btn-operate opt-link-to-balance" type="button" data-ote-btn-click="onActiveOteRulesClick" data-placement="top" title="激活" data-toggle="tooltip" data-row="'+meta.row+'">'
								+'	<i class="fa fa-check-square-o"></i>'
								+'	</button>';
						}
						renderStr += '<button class="btn btn-xs btn-success table-btn-operate opt-link-to-balance" type="button" data-ote-btn-click="onViewOteRulesClick" data-placement="top" title="修改" data-toggle="tooltip" data-row="'+meta.row+'">'
							+'	<i class="fa fa-eye"></i>'
							+'	</button>';

						return renderStr;
					}
				},{
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '版本',
					name: 'oteVersion',
					data : 'oteVersion',
					width : '100px'
				}, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '创建日期',
					name : 'createDate',
					data : 'createDate',
					width : '120px',
					render(data) {
						if(!data || data == '' || data == 'null' || data == 'undefined') {
							return '';
						}
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets : ++cnt,
					orderable : true,
					className : 'text-left',
					title : '更新日期',
					name : 'updateDate' ,
					data : 'updateDate',
					width : '120px',
					render(data) {
						if(!data || data == '' || data == 'null' || data == 'undefined') {
							return '';
						}
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets : ++cnt,
					//orderable : true,
					className : 'text-center',
					title : '状态',
					name : 'isActive',
					data : 'isActive',
					width : '80px',
					render(data) {
						return DicVal2Nm(data, '考试配置状态');
					}
				}]
			}
		};
		function initOteConfTable() {
			BdoDataTable('oteConfTable', oteConfTableConf, $oteConfPage);
			this.oteConfTable = $('#oteConfTable');
		}

		function initOteConfDetailSider() {
			if(this.oteConfDetailPage) {
				this.oteConfDetailPage.render();
				return;
			}
			oteConfDetailTplText = tplLoader('ote/html/oteConfDetail.html');
			let id = $(oteConfDetailTplText).prop('id');
			let selector = '#' + id;
			$oteConfDetail = $(selector, $oteConfPage);
			oteConfDetailTpl = template('ote/html/oteConfDetail.html', oteConfDetailTplText);

			oteConfDetailSubPage = side({el: selector, autoHide: false});
			this.oteConfDetailPage = oteConfDetailObject = {
				process: 'new',
				text: oteConfDetailTplText,
				template: oteConfDetailTpl,
				page: oteConfDetailSubPage,
				$el: $oteConfDetail,
				$data: null,
				$form: null,
				data() {
					return {
						title: '',
						oteConfs: [],
						readonly: '',
						oteVersion: ''
					};
				},
				render() {
					if(this.process == 'view' ) {
						this.$data.readonly = 'readonly';
					}else {
						this.$data.readonly = '';
					}
					let oteConfDetailTplHtml = this.template(this.$data);
					$oteConfDetail.replaceWith($(oteConfDetailTplHtml));
					this.$el = $oteConfDetail = $(selector, $oteConfPage);
					this.page = oteConfDetailSubPage = side({el: selector, autoHide: false});
					this.$form = this.$el.find('#oteConfDetailForm');
					this.eventBind();
					OneUI.initHelper('slimscroll');
				},
				events: {
					onSaveOteRulesClick(event) {
						if(this.process == 'view') {
							return;
						}

						if(!this.$form.valid()) {
							return;
						}

						let formObject = {
							//oteVersion: $('#oteVersion', this.$form).val()
						};
						this.$form.find('[data-param-name]').each((index, item) => {
							let $el = $(item);
							let nodeName = $el.attr('data-param-name');
							let fieldName = $el.prop('name');

							fieldName = fieldName.replace(nodeName + '.', '');

							if(fieldName != nodeName) {
								if(!formObject[nodeName]) {
									formObject[nodeName] = {};
								}
								formObject[nodeName][fieldName] = $el.val();
								if(fieldName == 'proportion') {
									formObject[nodeName][fieldName] = 0;
								}
							}
						});
						let oteRules = [];
						for(let item in formObject) {
							oteRules.push(formObject[item]);
						}
						let oteVersion = $('[name="oteVersion"]', this.$form).val();
						let params = {
							oteVersion,
							oteRules
						};
						let url = 'ot/OtExam.saveNewNodes.json';
						if(this.process == 'edit') {
							url = 'ot/OtExam.updateNodes.json';
						}

						$.ajax({
							type: 'post',
							url: url,
							data: {jsonData: JSON.stringify(params)},
							dataType: 'json'
						}).done(data => {
							if(data.success === true) {
								bdoInfoBox('成功', '保存成功。');
								this.page.hide();
								OteConfPage.oteConfTable.DataTable().ajax.reload();
							}else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						});
					}
				},
				eventBind() {
					this.$el.on('click', '[data-ote-btn-click]', function(event) {
						let actionNm = $(event.currentTarget).attr('data-ote-btn-click');
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
			this.oteConfDetailPage.init();
		}

		let events = {
			onNewOteRulesClick(event) {
				$.ajax({
					type: 'post',
					url: 'ot/OtExam.queryNewNodes.json',
					data: {},
					dataType: 'json'
				}).done(data => {
					if(data.success == true) {
						if(this.oteConfDetailPage) {
							this.oteConfDetailPage.$data.title = '新增配置';
							this.oteConfDetailPage.$data.oteVersion = '';
							this.oteConfDetailPage.$data.oteConfs = data.data;
							this.oteConfDetailPage.$data.readonly = '';
							this.oteConfDetailPage.process = 'new';
							this.oteConfDetailPage.render();
							this.oteConfDetailPage.page.show();
						}
					}
				});
			},
			onEditOteRulesClick(event) {
				let table = OteConfPage.oteConfTable.dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				$.ajax({
					type: 'post',
					url: 'ot/OtExam.queryNewNodes.json',
					data: {jsonData: JSON.stringify({oteVersion: rowData.oteVersion})},
					dataType: 'json'
				}).done(data => {
					if(data.success == true) {
						if(this.oteConfDetailPage) {
							this.oteConfDetailPage.$data.title = '修改配置';
							this.oteConfDetailPage.$data.oteVersion = rowData.oteVersion;
							this.oteConfDetailPage.$data.oteConfs = data.data;
							this.oteConfDetailPage.$data.readonly = 'readonly';
							this.oteConfDetailPage.process = 'edit';
							this.oteConfDetailPage.render();
							this.oteConfDetailPage.page.show();
						}
					}
				});
			},
			onViewOteRulesClick(event) {
				let table = OteConfPage.oteConfTable.dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				$.ajax({
					type: 'post',
					url: 'ot/OtExam.queryNewNodes.json',
					data: {jsonData: JSON.stringify({oteVersion: rowData.oteVersion})},
					dataType: 'json'
				}).done(data => {
					if(data.success == true) {
						if(this.oteConfDetailPage) {
							this.oteConfDetailPage.$data.title = '配置详情';
							this.oteConfDetailPage.$data.oteVersion = rowData.oteVersion;
							this.oteConfDetailPage.$data.oteConfs = data.data;
							this.oteConfDetailPage.$data.readonly = 'readonly';
							this.oteConfDetailPage.process = 'view';
							this.oteConfDetailPage.render();
							this.oteConfDetailPage.page.show();
						}
					}
				});
			},
			onActiveOteRulesClick(event) {
				let table = OteConfPage.oteConfTable.dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				$.ajax({
					type: 'post',
					url: 'ot/OtExam.activeNodes.json',
					data: {jsonData: JSON.stringify({oteVersion: rowData.oteVersion})},
					dataType: 'json'
				}).done(data => {
					if(data.success == true) {
						OteConfPage.oteConfTable.DataTable().ajax.reload();
						bdoInfoBox('成功', '激活版本【'+ rowData.oteVersion +'】成功。');
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				});
			},
			onRefreshOteRulesClick(event) {
				OteConfPage.oteConfTable.DataTable().ajax.reload();
			}
		};
		
		function eventBind() {

			this.$el.on('click', '[data-ote-btn-click]', function(event) {
				let actionNm = $(event.currentTarget).attr('data-ote-btn-click');
				if(actionNm && OteConfPage.events[actionNm]) {
					OteConfPage.events[actionNm].bind(OteConfPage)(event);
				}
			});
		}
		
		function mount(select) {
			if(this.isMounted) {
				$oteConfPage = $(oteConfPageTpl);
			}
			$(select).replaceWith($oteConfPage);
			this.$el = $oteConfPage = $(selector);
			this.eventBind();
			this.initOteConfTable();
			this.initOteConfDetailSider();
			this.isMounted = true;
			return this;
		}

		$.extend(OteConf.prototype, {
			$el: $oteConfPage,
			isMounted: false,
			events,
			oteConfDetailPage: null,
			oteConfTable: null,
			initOteConfTable,
			initOteConfDetailSider,
			eventBind,
			mount
		});
		root.OteConfPage = OteConfPage;
		return root.OteConfPage;
	}
	let oteConfPage = BdoFaithUtil.factory(OteConfFactory);
	oteConfPage.mount('#oteConfPage');
});