/**
 * 审计程序页面
 */
function AuditProgramPage(agrs) {
	let _data = agrs.data
		, _template = agrs.template || tplLoader('dgCenter/html/dg/auditProgram.html')
		, getConfirmStatus
	;
	let editManEditComp = {
		props: {
			programInfo: Object,
			rownum: Number,
			currentValue: String,
			datas: Array
		},
		data() {
			return {
				editMan: this.currentValue
			};
		},
		watch: {
			editMan(newVal) {
				this.programInfo.workpaperEditor = newVal;
				if (this.currentValue != newVal) {
					this.updateProgramEditor();
				}
			}
		},
		computed: {
			editManDisabled() {
				return (CUR_USERID != JSON.parse($.sessionStorage('projectManager')) && JSON.parse($.sessionStorage('projectManager')) != undefined ? true : false);
			}
		},
		methods: {
			updateProgramEditor() {
				if (CUR_USERID != JSON.parse($.sessionStorage('projectManager')) && JSON.parse($.sessionStorage('projectManager')) != undefined) {
					bdoInfoBox('', '只有当前项目负责人才能编辑底稿编制人!');
				} else {
					let editMan = this.editMan;
					let data  = this.datas;
					let name;
					data.map(function (item) {
						if (editMan == item.id) {
							name = (item.value == ""?item.text:item.value);
						}
					});
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgMain.updateProgramEditor.json',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: this.programInfo.autoId,
							param2: this.programInfo.customerId,
							param3: this.programInfo.projectId,
							param4: this.editMan,
							param5: this.programInfo.dgName,
							param6: name
						},
						dataType: 'json',
						bdolxLoader: false
					}).done(data => {
						if (data.success) {
							OneUI.notifySuccess('保存成功！');
							//bdoSuccessBox('成功', data.resultInfo.statusText);
							this.currentValue = this.editMan;
						} else {
							OneUI.notifyError(data.resultInfo.statusText);
							//bdoErrorBox('失败', data.resultInfo.statusText);
						}
					});
				}

			}
		},
		template: '<div>'
			+ '	<div class="form-material">'
			+ '		<select class="form-control" v-model="editMan" style="margin-left:5px" :disabled="editManDisabled">'
			+ '			<option v-for="(data, index) in datas" :value="data.id">{{ data.text }}</option>'
			+ '		</select>'
			+ '	</div>'
			+ '</div>'
	};
	let ecavpComp = {
		props: {
			labelName: String,
			groupReadonly: Boolean,
			ecsVal: String,
			esVal: String,
			prefixed: String
		},
		data() {
			return {
				ecavpcomp_cs: '',
				ecavpcomp_s: 0,
				esValRequired: false,
				esValMin: 0.00,
				esValCache: {}
			};
		},
		computed: {
			checkboxGroupClass() {
				if (this.groupReadonly == true) {
					return 'css-input css-input-disabled css-checkbox css-checkbox-primary control-label';
				}
				return 'css-input css-checkbox css-checkbox-primary control-label';
			},
			esValDisabled() {
				return (this.ecsVal == '1' || this.ecsVal === true ? false : true);
			},
			elName() {
				return this.prefixed + 's' + this.labelName;
			}
		},
		watch: {
			esVal(newVal) {
				if (this.esValCache[newVal] == 1) {
					this.$parent.jsonData[this.prefixed + 's' + this.labelName] = newVal;
					return;
				}
				let result = newVal;
				result = String(result).replace(/[^\d.]/g, '')
					.replace(/\.{2,}/g, '.')
					.replace('.', '$#$')
					.replace(/\./g, '')
					.replace('$#$', '.')
					.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

				if (result.indexOf('.') < 0 && result != '') {
					result = parseFloat(result);
				}
				if (parseFloat(result) > 3) {
					result = 3;
				}
				this.esVal = result;

				this.$parent.jsonData[this.prefixed + 's' + this.labelName] = this.esVal;
				if (!this.esValCache[this.esVal]) this.esValCache[this.esVal] = 1;
				//console.log(this.$parent.jsonData);
			},
			ecsVal(newVal, oldVal) {
				if (newVal === true) {
					if (!this.esVal || this.esVal == '') {
						this.esVal = 0.00;
					}
					this.esValMin = 0.01;
				} else {
					this.esVal = '';
					this.esValMin = 0.00;
				}
				this.esValRequired = newVal;
				this.$parent.jsonData[this.prefixed + 'cs' + this.labelName] = newVal;
			}
		},
		template: `
					<!--<div class="row" style="padding: 10px 0;">-->
						<div class="col-md-2">
							<label  :class="checkboxGroupClass">
								<input type="checkbox"  v-model="ecsVal" value="1">
								<span></span>
								{{labelName}}
							</label>
						</div>
						<!--<label class="col-md-2 control-label" for="ecavpcomp_cs">分数</label>
						<div class="col-md-6">
							<input :name="elName" class="form-control" type="number" v-model="esVal" :required="esValRequired" :min="esValMin" :disabled="esValDisabled">
						</div>-->
					<!--</div>-->
		`
	};
	let ecavpEditVmCfg = {
		el: '#auditProgramTable tbody',
		components: {
			'edit-man-edit': editManEditComp
		},
		data: {
			rowData: [],
			editMans: []
		},
		methods: {}
	};
	let ecavpEditVm;
	Vue.component('ecavp-comp', ecavpComp);

	function getEditManEdit(value, rownum) {
		let result = '<edit-man-edit :datas="editMans" :program-info="rowData[' + rownum + ']" :rownum="' + rownum + '" :current-value="\'' + value + '\'"></edit-man-edit>';
		return result;
	}
	getConfirmStatus = (data, score, odata, oscore, updateFlag) => {
		let checkboxClass = 'css-checkbox-primary', scoreClass = '';
		if (updateFlag == 1) {
			if (data != odata) {
				checkboxClass = 'css-checkbox-danger';
			}
			if (score != oscore) {
				scoreClass = 'score-red';
			}
		}
		let result = '<label class="css-input css-checkbox ' + checkboxClass + ' control-label" >'
			+ '			<input type="checkbox" ' + (data == '1' ? 'checked' : '') + ' disabled>'
			+ '			<span></span>'
			+ '		</label>'
			/*+ '<div class="' + scoreClass + '">' + (data == '1' ? (score || score == 0 ? score : 0) : '') + '</div>'*/;
		return result;
	};
	agrs.template = _template;
	$(agrs.region).html(_template);
	let cnt = 0;
	let auditProgramRow = 1;
	let auditProgramRowMark = [];
	let parentApMap = {};
	let page = new Page({
		random: (new Date).getTime() + parseInt(1e3 * Math.random())
		/**
		 * 根节点
		 */
		, container: agrs.region
		/**
		 * 绑定事件
		 */
		, events: (() => {
			let events = {
				'#newAuditprogramBtn': 'click,onNewAuditprogramClick'
				, '#addOtherProgramBtn': 'click,onAddOtherProgramClick'
				, '#selectOkBtn': 'click,onSelectOkClick'
				, '#selectCancelBtn': 'click,onSelectCancelClick'
				, '#editButtonAll': 'click,onEditAllClick'
				, '#refreshButtonAll': 'click,onRefreshAllClick'
				, '#auditProgramTopBtn': 'click,onAuditProgramTopClick'
				//, '#auditProgramFullscreenBtn': 'click,onAuditProgramFullscreenClick'
				, '#searchBtn': 'click,onSearchClick'
				, '#filter': 'change,onFilterChange'
				, '#filterEditor2': 'change,onFilterEditorChange'
				, '#shareToAptAll': 'click,onShareToAptAllClick'
			};
			if (_data.type == 'SUBJECT') {
				return events;
			}
			return {
				'#filter': 'change,onFilterChange'
				, '#filterEditor2': 'change,onFilterEditorChange'
				, '#editButtonAll': 'click,onEditAllClick'
				, '#refreshButtonAll': 'click,onRefreshAllClick'
				, '#auditProgramTopBtn': 'click,onAuditProgramTopClick'
				, '#shareToAptAll': 'click,onShareToAptAllClick'
				//, '#auditProgramFullscreenBtn': 'click,onAuditProgramFullscreenClick'
			};
		})()
		, _template: agrs.template || tplLoader('dgCenter/html/dg/auditProgram.html')
		, _data: agrs.data
		, bindTableOptEvents() {
			(function(){
				$.ajax({
					type: 'post',
					// async: false,
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00061',
						param1: window.CUR_PROJECTID,
						param2: window.CUR_CUSTOMERID
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							if(data.data[0].mergeType == '1'){
								$('#auditProgramEcavpTableBlock').remove();
								$('#auditProgramTopBtn').remove();
							}
						} else {
							bdoErrorBox('提示', data.resultInfo.statusText);
						}
					}
				});
			})();
			$('#auditProgramTable').on('click', 'button.table-btn-operate[name="optNewSubProgramBtn"]', event => {
				// 获取当前列数据
				let me = page;
				let table = $('#auditProgramTable').dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				me.editSubProgramForm.jsonData = {
					autoId: null,
					customerId: rowData.customerId,
					projectId: rowData.projectId,
					subjecttreeId: rowData.subjecttreeId,
					parentId: rowData.autoId,
					level: rowData.level + 1,
					required: rowData.required,
					pindexId: rowData.indexId,
					es_indexId: '',
					es_dgName: rowData.dgName,
					es_programNameAft: rowData.programNameAft,
					es_csE: me.booleanTranslate(rowData.csE),
					es_csC: me.booleanTranslate(rowData.csC),
					es_csA: me.booleanTranslate(rowData.csA),
					es_csV: me.booleanTranslate(rowData.csV),
					es_csP: me.booleanTranslate(rowData.csP),
					es_sE: '',
					es_sC: '',
					es_sA: '',
					es_sV: '',
					es_sP: ''
				};
				me.editSubProgramForm.process = 'add';
				me.editSubProgramSider.show();
			});

			$('#auditProgramTable').on('click', 'button.table-btn-operate[name="optEditBtn"]', event => {
				let me = page;
				// 获取当前列数据
				let table = $('#auditProgramTable').dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				let programNameAft = rowData.programNameAft;
				if(rowData.programNameAftCache) {
					programNameAft = rowData.programNameAftCache;
				}
				if (rowData.level != 1) {
					if (rowData.customizeFlag != '1') {
						me.editAuditprogramForm.jsonData = {
							autoId: rowData.autoId,
							customerId: rowData.customerId,
							eindexId: rowData.indexId,
							edgName: rowData.dgName,
							eprogramName: rowData.programNameAft,
							econfirmStatus: rowData.confirmStatusAft,
							programNameAft: programNameAft,
							confirmStatusAft: rowData.confirmStatusAft,
							ecsE: me.booleanTranslate(rowData.csE),
							ecsC: me.booleanTranslate(rowData.csC),
							ecsA: me.booleanTranslate(rowData.csA),
							ecsV: me.booleanTranslate(rowData.csV),
							ecsP: me.booleanTranslate(rowData.csP),
							esE: rowData.sE,
							esC: rowData.sC,
							esA: rowData.sA,
							esV: rowData.sV,
							esP: rowData.sP,
							workpaperId: rowData.workpaperId
						};
						me.editAuditprogramFormSider.show();
					} else {
						me.cusAuditprogramForm.jsonData = {
							autoId: rowData.autoId,
							dgName: rowData.dgName,
							indexId: rowData.indexId,
							required: rowData.required,
							confirmStatusAft: rowData.confirmStatusAft,
							programNameAft: programNameAft,
							delTemplates: [],
							draftTemplate: [],
							draftTemplateName: [],
							customerId: _data.extraOptions.customerId,
							projectId: _data.extraOptions.projectId,
							subjecttreeId: _data.extraOptions.autoId,
							csE: me.booleanTranslate(rowData.csE),
							csC: me.booleanTranslate(rowData.csC),
							csA: me.booleanTranslate(rowData.csA),
							csV: me.booleanTranslate(rowData.csV),
							csP: me.booleanTranslate(rowData.csP),
							sE: rowData.sE,
							sC: rowData.sC,
							sA: rowData.sA,
							sV: rowData.sV,
							sP: rowData.sP,
							workpaperId: rowData.workpaperId
						};
						me.cusAuditprogramForm.process = 'edit';
						me.cusAuditprogramFormSider.show();
					}
				} else {
					me.editSubProgramForm.jsonData = {
						autoId: rowData.autoId,
						customerId: rowData.customerId,
						projectId: rowData.projectId,
						subjecttreeId: rowData.subjecttreeId,
						parentId: rowData.parentId,
						level: rowData.level,
						required: rowData.required,
						pindexId: '',
						es_indexId: rowData.indexId,
						es_dgName: rowData.dgName,
						es_programNameAft: programNameAft,
						es_csE: me.booleanTranslate(rowData.csE),
						es_csC: me.booleanTranslate(rowData.csC),
						es_csA: me.booleanTranslate(rowData.csA),
						es_csV: me.booleanTranslate(rowData.csV),
						es_csP: me.booleanTranslate(rowData.csP),
						es_sE: rowData.sE,
						es_sC: rowData.sC,
						es_sA: rowData.sA,
						es_sV: rowData.sV,
						es_sP: rowData.sP,
						workpaperId: rowData.workpaperId
					};
					me.editSubProgramForm.process = 'edit';
					me.editSubProgramSider.show();
				}
			});

			$('#auditProgramTable').on('click', 'button.table-btn-operate[name="optOpenExcelBtn"]', event => {
				let me = page;
				let table = $('#auditProgramTable').dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				let excelnode;
				let findNode = (node) => {
					if (node.extraOptions && node.extraOptions.nodeType == 'FILE' && node.extraOptions.workpaperId == rowData.workpaperId) {
						excelnode = node;
					} else {
						if ((!excelnode) && node.nodes) {
							for (let i = 0; i < node.nodes.length; i++) {
								findNode(node.nodes[i]);
								if (excelnode) break;
							}
						}
					}
				};
				// 获取当前列数据
				findNode(_data);
				if (excelnode) {
					excelnode.currentNode = $.extend(false, {}, excelnode);
					excelnode.currentNode.currentNode = null;
					excelnode.workpagerId = excelnode.extraOptions.workpagerId;
					excelnode.menuId = window.sys_menuId;
					$.sessionStorage('subjecttreeNode', JSON.stringify(excelnode));
					window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + excelnode.extraOptions.indexId + '&projectId=' + excelnode.extraOptions.projectId);
				}
			});

			$('#unexecuteprogamTable').on('click', 'button.table-btn-operate[name="optToExcProgramBtn"]', event => {
				let table = $('#unexecuteprogamTable').dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				bdoConfirmBox('提示', '确定重新执行该程序吗？', () => {
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgMain.setExcuteProgram.json',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: rowData.autoId,
							param2: rowData.customerId
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#auditProgramTable').DataTable().ajax.reload();
								$('#unexecuteprogamTable').DataTable().ajax.reload();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			});

			$('#auditProgramTable').on('click', 'i.btn.program-level-0opt', event => {
				$(event.currentTarget).toggleClass('fa-plus-circle');
				$(event.currentTarget).toggleClass('fa-minus-circle');
				let ppid = $(event.currentTarget).attr('data-program-id');
				$('#auditProgramTable').find('tr.program-level-1[data-program-parent-id="' + ppid + '"]').toggle();
			});

			$('#auditProgramTable').unbind('initEditVm');
			$('#auditProgramTable').bind('initEditVm', ((event, options) => {
				event.preventDefault();
				ecavpEditVmCfg = $.extend(false, {}, ecavpEditVmCfg);
				ecavpEditVmCfg.data.editMans = page.selectEditors;
				ecavpEditVmCfg.data.rowData = $.extend(false, {}, options);
				/*ecavpEditVmCfg.data.updateRowMark = (()=>{
					let result = [];
					for(let i = 0, len = options.length; i < len; i++) {
						result.push(0);
					}
					return result;
				})();*/
				ecavpEditVm = new Vue(ecavpEditVmCfg);
			}).bind(this));
			$('#modal_share_to_apt').on('click', 'input[id="shareCheckAllBtn"]', event => {
				// 勾选需分享的底稿
				if ($(event.target)[0].checked) {
					$(event.target).attr('checked', 'checked');
					$('input[name=\'mulDgFile\']').each(function() {
						this.checked = true;
					});
				} else {
					$(event.target).removeAttr('checked');
					$('input[name=\'mulDgFile\']').each(function() {
						this.checked = false;
					});
				}
			})
			this.initDropMenu();
		}
		, initDropMenu() {
			let me = this;
			bdoDropMenu.bind(me)({
				el: '#auditProgramTable button.table-btn-operate[name="operate"]',
				scope: me,
				beforeShow(activeEl, menu) {
					// 获取当前列数据
					let table = $('#auditProgramTable').dataTable();
					let rowData = table.fnGetData(activeEl.attr('data-row'));
					if (rowData.level == 0) {
						menu.find('#audit').closest('li').hide();
						menu.find('#createDg').closest('li').hide();
						menu.find('#createEmptyDg').closest('li').hide();
						menu.find('#uploadDg').closest('li').hide();
						menu.find('#dgAttachBtn').closest('li').hide();
						menu.find('#downloadDg').closest('li').hide();
						menu.find('#delProgram').closest('li').hide();
						menu.find('#openPostilBtn').closest('li').hide();
						menu.find('#unExecute').closest('li').show();
						menu.find('#addProgram').closest('li').show();
						menu.find('#refreshDgCover').closest('li').hide();
						menu.find('#shareToApt').closest('li').hide();
					} else if (rowData.level == 1) {
						menu.find('#audit').closest('li').show();
						menu.find('#createDg').closest('li').show();
						menu.find('#createEmptyDg').closest('li').show();
						/*menu.find('#createTeDg').closest('li').show();*/
						menu.find('#uploadDg').closest('li').show();
						menu.find('#dgAttachBtn').closest('li').show();
						menu.find('#downloadDg').closest('li').show();
						menu.find('#delProgram').closest('li').show();
						menu.find('#openPostilBtn').closest('li').show();
						menu.find('#unExecute').closest('li').hide();
						menu.find('#addProgram').closest('li').hide();
						menu.find('#refreshDgCover').closest('li').show();
						menu.find('#shareToApt').closest('li').show();
					}
				},
				buttons: [{
					id: 'unExecute',
					text: '不执行',
					icon: 'fa fa-minus-circle',
					handler(activeEl, event) {
						page.unexecuteFormSider.show();
						// 获取当前列数据
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));

						me.unexecuteForm.jsonData.autoId = rowData.autoId;
						me.unexecuteForm.jsonData.customerId = rowData.customerId;
						me.unexecuteForm.jsonData.reason = '';
					}
				}, {
					id: 'delProgram',
					text: '删除',
					icon: 'fa fa-close',
					handler(activeEl, event) {
						// 获取当前列数据
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));
						let flag = false;
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgMain.checkProgramStatus.json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: rowData.autoId,
								param2: rowData.customerId,
								param3: rowData.subjectId
							},
							success(data) {
								if (data.success) {
									bdoConfirmBox('提示', '确定要删除该条程序吗？', isConfirm => {
										$.ajax({
											type: 'post',
											url: 'dgCenter/DgMain.delSubProgram.json',
											//async : false,
											data: {
												customerId: window.CUR_CUSTOMERID,
												projectId: window.CUR_PROJECTID,
												param1: rowData.autoId,
												param2: rowData.customerId,
												refreshFlg : 1

											},
											dataType: 'json',
											success(data) {
												if (data.success) {
													bdoSuccessBox('成功', data.resultInfo.statusText);
													getSubjecttree({
														customerId: window.CUR_CUSTOMERID,
														projectId: window.CUR_PROJECTID,
														param1: window.CUR_PROJECTID,
														param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
													}, data => {
														$('.js-tree-collapsed').trigger('rebuild', [{
															data: [data.data[0].treeData],
															levels: (_data.deep + 2),
															callback(tree) {
																tree.expandNode(_data.nodeId, {
																	levels: (_data.deep + 2),
																	silent: true
																});
																tree.selectNode(_data.nodeId, {silent: true});
																_data = agrs.data = tree.getNode(_data.nodeId);
															}
														}]);
														$('#auditProgramTable').DataTable().ajax.reload();
													});
												} else {
													bdoErrorBox('失败', data.resultInfo.statusText);
												}
											}
										});
									});
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}
				},{
					id: 'createDg',
					text: '生成底稿',
					icon: 'fa fa-newspaper-o',
					handler(activeEl, event) {
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));
						let doIt = () => {
							programParamInit({
								rowData: rowData,
								generateDg(data) {
									$('#programParamModal').modal('hide');
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgMain.createDg.json',
										//async : false,
										data: {
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											param1: rowData.autoId,
											param2: rowData.customerId,
											param3: JSON.stringify(data),
											param4: rowData.year,
											param5: rowData.projectId,
											param6: rowData.subjectId,
											param7: rowData.subjectName
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												getSubjecttree({
													customerId: window.CUR_CUSTOMERID,
													projectId: window.CUR_PROJECTID,
													param1: window.CUR_PROJECTID,
													param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
												}, data => {
													$('.js-tree-collapsed').trigger('rebuild', [{
														data: [data.data[0].treeData],
														levels: (_data.deep + 2),
														callback(tree) {
															tree.expandNode(_data.nodeId, {
																levels: (_data.deep + 2),
																silent: true
															});
															tree.selectNode(_data.nodeId, {silent: true});
															_data = agrs.data = tree.getNode(_data.nodeId);
														}
													}]);
													$('#auditProgramTable').DataTable().ajax.reload();
													bdoSuccessBox('成功', data.resultInfo.statusText);
													var storage = window.localStorage;
													storageId = 'BDO' + data.data[0].workpaperId;
													storageStatus = 'BDO' + data.data[0].workpaperId + 'Status';
													storageTime = 'BDO' + data.data[0].workpaperId + 'Time';
													storage.removeItem(storageId);
													storage.removeItem(storageStatus);
													storage.removeItem(storageTime);
												});
											} else {
												bdoErrorBox('失败', data.resultInfo.statusText);
											}
										}
									});
								}
							});
						};
						if (rowData.workpaperId != null && rowData.workpaperId != '') {
							var text = '<div style="height: 150px;overflow-y: auto">底稿已生成，是否重新生成？<br>';
							text += '<font color="red">重新生成底稿会删除<br>';
							text += '单向链接<br>';
							text += '交叉索引<br>';
							text += '抽凭链接<br>';
							text += '底稿取值</div>';
							bdoConfirmBox('提示', text, isConfirm => {
								if (rowData.paramHtmlPath != null) {
									doIt();
								} else {
									$('#programParamModal').modal('hide');
									bdoInProcessingBox('生成中');
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgMain.createDg.json',
										//async : false,
										data: {
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											param1: rowData.autoId,
											param2: rowData.customerId,
											param4: rowData.year,
											param5: rowData.projectId,
											param6: rowData.subjectId,
											param7: rowData.subjectName
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												getSubjecttree({
													customerId: window.CUR_CUSTOMERID,
													projectId: window.CUR_PROJECTID,
													param1: window.CUR_PROJECTID,
													param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
												}, data => {
													$('.js-tree-collapsed').trigger('rebuild', [{
														data: [data.data[0].treeData],
														levels: (_data.deep + 2),
														callback(tree) {
															tree.expandNode(_data.nodeId, {
																levels: (_data.deep + 2),
																silent: true
															});
															tree.selectNode(_data.nodeId, {silent: true});
															_data = agrs.data = tree.getNode(_data.nodeId);
														}
													}]);
													$('#auditProgramTable').DataTable().ajax.reload();
													bdoSuccessBox('成功', data.resultInfo.statusText);
													var storage = window.localStorage;
													storageId = 'BDO' + data.data[0].workpaperId;
													storageStatus = 'BDO' + data.data[0].workpaperId + 'Status';
													storageTime = 'BDO' + data.data[0].workpaperId + 'Time';
													storage.removeItem(storageId);
													storage.removeItem(storageStatus);
													storage.removeItem(storageTime);
												});
											} else {
												bdoErrorBox('失败', data.resultInfo.statusText);
											}
										}
									});
								}
							});
						} else {
							if (rowData.paramHtmlPath != null) {
								doIt();
							} else {
								$('#programParamModal').modal('hide');
								bdoInProcessingBox('生成中');
								$.ajax({
									type: 'post',
									url: 'dgCenter/DgMain.createDg.json',
									//async : false,
									data: {
										customerId: window.CUR_CUSTOMERID,
										projectId: window.CUR_PROJECTID,
										param1: rowData.autoId,
										param2: rowData.customerId,
										param4: rowData.year,
										param5: rowData.projectId,
										param6: rowData.subjectId,
										param7: rowData.subjectName
									},
									dataType: 'json',
									success(data) {
										if (data.success) {
											getSubjecttree({
												customerId: window.CUR_CUSTOMERID,
												projectId: window.CUR_PROJECTID,
												param1: window.CUR_PROJECTID,
												param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
											}, data => {
												$('.js-tree-collapsed').trigger('rebuild', [{
													data: [data.data[0].treeData],
													levels: (_data.deep + 2),
													callback(tree) {
														tree.expandNode(_data.nodeId, {
															levels: (_data.deep + 2),
															silent: true
														});
														tree.selectNode(_data.nodeId, {silent: true});
														_data = agrs.data = tree.getNode(_data.nodeId);
													}
												}]);
												$('#auditProgramTable').DataTable().ajax.reload();
												bdoSuccessBox('成功', data.resultInfo.statusText);
												var storage = window.localStorage;
												storageId = 'BDO' + data.data[0].workpaperId;
												storageStatus = 'BDO' + data.data[0].workpaperId + 'Status';
												storageTime = 'BDO' + data.data[0].workpaperId + 'Time';
												storage.removeItem(storageId);
												storage.removeItem(storageStatus);
												storage.removeItem(storageTime);
											});
										} else {
											bdoErrorBox('失败', data.resultInfo.statusText);
										}
									}
								});
							}
						}
					}
				}, {
					id: 'createEmptyDg',
					text: '生成无数据底稿',
					icon: 'fa fa-newspaper-o',
					handler(activeEl, event) {
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));
						let doIt = () => {
							programParamInit({
								rowData: rowData,
								generateDg(data) {
									$('#programParamModal').modal('hide');
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgMain.createDg.json',
										//async : false,
										data: {
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											param1: rowData.autoId,
											param2: rowData.customerId,
											param3: JSON.stringify(data),
											param4: rowData.year,
											param5: rowData.projectId,
											param6: rowData.subjectId,
											param7: rowData.subjectName,
											param8: 'false'
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												getSubjecttree({
													customerId: window.CUR_CUSTOMERID,
													projectId: window.CUR_PROJECTID,
													param1: window.CUR_PROJECTID,
													param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
												}, data => {
													$('.js-tree-collapsed').trigger('rebuild', [{
														data: [data.data[0].treeData],
														levels: (_data.deep + 2),
														callback(tree) {
															tree.expandNode(_data.nodeId, {
																levels: (_data.deep + 2),
																silent: true
															});
															tree.selectNode(_data.nodeId, {silent: true});
															_data = agrs.data = tree.getNode(_data.nodeId);
														}
													}]);
													$('#auditProgramTable').DataTable().ajax.reload();
													bdoSuccessBox('成功', data.resultInfo.statusText);
													var storage = window.localStorage;
													storageId = 'BDO' + data.data[0].workpaperId;
													storageStatus = 'BDO' + data.data[0].workpaperId + 'Status';
													storageTime = 'BDO' + data.data[0].workpaperId + 'Time';
													storage.removeItem(storageId);
													storage.removeItem(storageStatus);
													storage.removeItem(storageTime);
												});
											} else {
												bdoErrorBox('失败', data.resultInfo.statusText);
											}
										}
									});
								}
							});
						};
						if (rowData.workpaperId != null && rowData.workpaperId != '') {
							var text = '<div style="height: 150px;overflow-y: auto">底稿已生成，是否重新生成？<br>';
							text += '<font color="red">重新生成底稿会删除<br>';
							text += '单向链接<br>';
							text += '交叉索引<br>';
							text += '抽凭链接<br>';
							text += '底稿取值</div>';
							bdoConfirmBox('提示', text, isConfirm => {
								if (rowData.paramHtmlPath != null) {
									doIt();
								} else {
									$('#programParamModal').modal('hide');
									bdoInProcessingBox('生成中');
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgMain.createDg.json',
										//async : false,
										data: {
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											param1: rowData.autoId,
											param2: rowData.customerId,
											param4: rowData.year,
											param5: rowData.projectId,
											param6: rowData.subjectId,
											param7: rowData.subjectName,
											param8: 'false'
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												getSubjecttree({
													customerId: window.CUR_CUSTOMERID,
													projectId: window.CUR_PROJECTID,
													param1: window.CUR_PROJECTID,
													param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
												}, data => {
													$('.js-tree-collapsed').trigger('rebuild', [{
														data: [data.data[0].treeData],
														levels: (_data.deep + 2),
														callback(tree) {
															tree.expandNode(_data.nodeId, {
																levels: (_data.deep + 2),
																silent: true
															});
															tree.selectNode(_data.nodeId, {silent: true});
															_data = agrs.data = tree.getNode(_data.nodeId);
														}
													}]);
													$('#auditProgramTable').DataTable().ajax.reload();
													bdoSuccessBox('成功', data.resultInfo.statusText);
													var storage = window.localStorage;
													storageId = 'BDO' + data.data[0].workpaperId;
													storageStatus = 'BDO' + data.data[0].workpaperId + 'Status';
													storageTime = 'BDO' + data.data[0].workpaperId + 'Time';
													storage.removeItem(storageId);
													storage.removeItem(storageStatus);
													storage.removeItem(storageTime);
												});
											} else {
												bdoErrorBox('失败', data.resultInfo.statusText);
											}
										}
									});
								}
							});
						} else {
							if (rowData.paramHtmlPath != null) {
								doIt();
							} else {
								$('#programParamModal').modal('hide');
								bdoInProcessingBox('生成中');
								$.ajax({
									type: 'post',
									url: 'dgCenter/DgMain.createDg.json',
									//async : false,
									data: {
										customerId: window.CUR_CUSTOMERID,
										projectId: window.CUR_PROJECTID,
										param1: rowData.autoId,
										param2: rowData.customerId,
										param4: rowData.year,
										param5: rowData.projectId,
										param6: rowData.subjectId,
										param7: rowData.subjectName,
										param8: 'false'
									},
									dataType: 'json',
									success(data) {
										if (data.success) {
											getSubjecttree({
												customerId: window.CUR_CUSTOMERID,
												projectId: window.CUR_PROJECTID,
												param1: window.CUR_PROJECTID,
												param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
											}, data => {
												$('.js-tree-collapsed').trigger('rebuild', [{
													data: [data.data[0].treeData],
													levels: (_data.deep + 2),
													callback(tree) {
														tree.expandNode(_data.nodeId, {
															levels: (_data.deep + 2),
															silent: true
														});
														tree.selectNode(_data.nodeId, {silent: true});
														_data = agrs.data = tree.getNode(_data.nodeId);
													}
												}]);
												$('#auditProgramTable').DataTable().ajax.reload();
												bdoSuccessBox('成功', data.resultInfo.statusText);
												var storage = window.localStorage;
												storageId = 'BDO' + data.data[0].workpaperId;
												storageStatus = 'BDO' + data.data[0].workpaperId + 'Status';
												storageTime = 'BDO' + data.data[0].workpaperId + 'Time';
												storage.removeItem(storageId);
												storage.removeItem(storageStatus);
												storage.removeItem(storageTime);
											});
										} else {
											bdoErrorBox('失败', data.resultInfo.statusText);
										}
									}
								});
							}
						}
					}
				}/*
				这段代码不能删！！！
				这段代码不能删！！！
				这段代码不能删！！！
				, {
					id: 'createTeDg',
					text: '生成自定模板底稿',
					icon: 'fa fa-newspaper-o',
					handler(activeEl, event) {
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));
						let $selectModal = $('#selectTeModal');
						let $selectEl = $('#tplInfoId', $selectModal);
						let $confirmBtn = $('#tplInfoIdSelectedBtn', $selectModal);
						let param = {
							param1: rowData.autoId,
							param2: rowData.customerId,
							// param3: JSON.stringify(data),
							param4: rowData.year,
							param5: rowData.projectId,
							param6: rowData.subjectId,
							param7: rowData.subjectName,
							param8: 'false',
							param9: '1'
						}
						$confirmBtn.off('click');
						let createTePromise;
						function createTeDgAction(param) {
							return new Promise((resolve, reject) => {
								$.ajax({
									type: 'post',
									url: 'dgCenter/DgMain.createDg.json',
									data: param,
									dataType: 'json',
									success(data) {
										if (data.success && data.data && data.data.length) {
											resolve(data.data);
										}else {
											reject(data);
										}
									}
								});
							});
						}
						let promise = new Promise((resolve, reject) => {
							$.ajax({
								type: 'post',
								url: 'dgCenter/TE.queryUserTemplateTree.json',
								data: {},
								dataType: 'json',
								success(data) {
									if (data.success && data.data && data.data.length) {
										resolve(data.data);
									}else {
										reject(data);
									}
								}
							});
						});
						promise.then(data => {
							/!*data.map((item, index, list) => {
								return {
									value: item.value,
									label: item.text 
								};
							});*!/
							let optionHtml = '<option value="" selected="selected"></option>';
							$.each(data, function(index, info) {
								optionHtml += '<option value="' + info.value + '">' + info.label + '</option>';
							});
							$selectEl.html(optionHtml);
						}, data => {
							bdoInfoBox("提示", "没有模板数据！");
						}).then(data => {
							$selectModal.modal('show');
						});
						$confirmBtn.click(event => {
							param.param10 = $selectEl.val();
							$selectModal.modal('hide');
							createTePromise = createTeDgAction(param);
							if(createTePromise) {
								createTePromise.then(data => {
									getSubjecttree({
										param1: window.CUR_PROJECTID,
										param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
									}, data => {
										$('.js-tree-collapsed').trigger('rebuild', [{
											data: [data.data[0].treeData],
											levels: (_data.deep + 2),
											callback(tree) {
												tree.expandNode(_data.nodeId, {
													levels: (_data.deep + 2),
													silent: true
												});
												tree.selectNode(_data.nodeId, {silent: true});
												_data = agrs.data = tree.getNode(_data.nodeId);
											}
										}]);
									});
									$('#auditProgramTable').DataTable().ajax.reload();
								}, data => {
									bdoErrorBox("错误", data.resultInfo.statusTest);
								}).then(data => {
									bdoSuccessBox('成功', data.resultInfo.statusText);
								});
							}
						});

					}
				这段代码不能删！！！
				这段代码不能删！！！
				这段代码不能删！！！
				}*/, {
					id: 'uploadDg',
					text: '上传底稿',
					icon: 'fa fa-upload',
					handler(activeEl, event) {
						// 获取当前列数据
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));
						let doIt = () => {
							$('#uploadTplFormModal').modal('show');
							me.uploadWorkpagerPage.jsonData.subjecttreeId = rowData.subjecttreeId; //_data.extraOptions.autoId;
							me.uploadWorkpagerPage.jsonData.autoId = rowData.autoId;
							me.uploadWorkpagerPage.jsonData.customerId = _data.extraOptions.customerId;
						};
						if (rowData.workpaperId != null && rowData.workpaperId != '') {
							bdoConfirmBox('提示', '该程序已有底稿文件，上传的底稿将会覆盖原来的底稿文件！', isConfirm => {
								doIt();
							});
						} else {
							doIt();
						}
					}
				}, {
					id: 'dgAttachBtn',
					text: '底稿附件',
					icon: 'fa fa-file',
					handler(activeEl, event) {
						// 获取当前列数据
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));
						if (!rowData.workpaperId || rowData.workpaperId == '') {
							bdoErrorBox('', '该程序还未生成底稿！');
							return;
						}
						let data = _data;
						data.programInfo = rowData;
						data.parent = me;
						me.dgAttachSider.show();
						data.nodeName = rowData.indexId + '-' + rowData.dgName;
						DgAttachPage({region: '#dgAttachRegion', data: data});
					}
				}, {
					id: 'downloadDg',
					text: '下载底稿',
					icon: 'fa fa-download',
					handler(activeEl, event) {
						// 获取当前列数据
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));
						if (!rowData.workpaperId || rowData.workpaperId == '') {
							bdoErrorBox('', '该程序还未生成底稿！');
							return;
						}
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgWapper.havePermission.json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: rowData.workpaperId
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									downloadFile('dgCenter/DgDownload.downloadWorkpaper.json', {
										customerId: window.CUR_CUSTOMERID,
										projectId: window.CUR_PROJECTID,
										param1: rowData.workpaperId,
										param2: rowData.customerId
									});
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}
				}, {
					id: 'downloadDgTpl',
					text: '下载底稿模板',
					icon: 'fa fa-download',
					handler(activeEl, event) {
						// 获取当前列数据
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));
						downloadFile('dgCenter/DgDownload.downloadTemplate.json', {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: rowData.autoId,
							param2: rowData.customerId,
							param3: rowData.projectId
						});
					}
				}, {
					id: 'openPostilBtn',
					text: '批注',
					icon: 'fa fa-bookmark-o',
					handler(activeEl, event) {
						// 获取当前列数据
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));
						DgPostilPage({
							region: '#sideRegin',
							data: rowData,
							type: rowData.indexId,
							foreignId: rowData.subjecttreeId,
							isSingle: false,
							customerId: rowData.customerId,
							projectId: rowData.projectId
						});
					}
				}, {
					id: 'refreshDgCover',
					text: '刷新底稿封面',
					icon: 'fa fa-file-excel-o',
					handler(activeEl, event) {
						// 获取当前列数据
						let table = $('#auditProgramTable').dataTable();
						let rowData = table.fnGetData(activeEl.attr('data-row'));
						if (rowData.workpaperId != null && rowData.workpaperId != '') {
							$.ajax({
								url: 'dgCenter/DgWapper.refreshDgCover.json',
								type: 'post',
								data: {
									menuId: window.sys_menuId,
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: rowData.workpaperId,
								},
								dataType: 'json',
								success: function(data) {
									if (data.success) {
										bdoSuccessBox('成功', data.resultInfo.statusText);
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}
					}
				}]
			});
		}
		, onShareToAptAllClick(event) {
			var param = {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: _data.extraOptions.customerId,
				param2: _data.extraOptions.projectId,
				param3: _data.type,
				param4: _data.extraOptions.tbSubjectId
			}
			var displayText = '是否确认分享底稿目录至APT？'
				 + '<br><br><br><font color="red" size="3">'
				 + '修改默认浏览器方法：任务栏最左侧【开始】--【设置】--【应用】--【默认应用】--【Web 浏览器】，请将默认浏览器设置为【谷歌浏览器】'
				 + '</font>';
			bdoConfirmBox('提示', displayText, isConfirm => {
				bdoInProcessingBox('分享中...!');
				$.ajax({
					url: 'dgCenter/DgProject.saveDgFileToApt.json',
					type: 'post',
					data: param,
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功', '分享中，请稍后去APT查看。');
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		}
		, onRefreshAllClick(event) {
			var param=null;
			if (_data.type == 'SUBJECT') {
				param = _data.extraOptions.autoId;
			}
			if (_data.type == 'TBSUBJECT') {
				param = _data.extraOptions.autoId;
			}
			if (_data.type == 'PROJECT') {
				param = _data.extraOptions.projectId;
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgWapper.batchRefreshDgCover.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: _data.type,
					param4: param
				},
				bdolxLoader: false,		// 禁用旋转等待
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
			bdoInfoBox('请稍后，正在刷新底稿封面');
		}
		, onEditAllClick(event) {
			$('#programParamModal1').modal('show');
			$('#programParamForm1').modal('show');
			$('#programParamForm1').formview({
				display: 'tableform-one',
				column: 4,
				buttons: [
					{
						id: 'tb_batchGenerate',
						icon: 'fa-save',
						style: 'btn-primary',
						text: '&nbsp;生成'
					}, {
						id: 'tb_batchclose',
						icon: 'fa-sign-out',
						style: 'btn-warning',
						text: '&nbsp;关闭'
					}
				],
				items: [
					{
						id: 'tb_autoid',
						type: 'input',
						typeAttr: {
							type: 'hidden'
						}
					}, {
						id: 'generate_rule',
						type: '',
						label: '生成规则',
						html: '<label class="css-input css-radio css-radio-primary">'
							+ '生成底稿*：'
							+ '</label>'
							+ '<label>'
							+'<input type="radio" name="batch_mater_use" id=have checked="checked">含财务数据'
							+ '<input type="radio" name="batch_mater_use" >不含财务数据'
							+ '</label>'

					}
				]
			});
			$('#tb_batchclose').click(function(){
				$('#programParamModal1').modal('hide');
			});
			$('#tb_batchGenerate').click(function() {
				var data = {};
				data.accountSource = $('#have').prop('checked');
				var param=null;
				if (_data.type == 'SUBJECT') {
					param = _data.extraOptions.autoId;
				}
				if (_data.type == 'TBSUBJECT') {
					param = _data.extraOptions.autoId;
				}
				if (_data.type == 'PROJECT') {
					param = _data.extraOptions.projectId;
				}
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgMain.batchGenerateProgram.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: _data.type,
						param2: param,
						param3: data.accountSource
					},
					bdolxLoader: false,		// 禁用旋转等待
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#auditProgramTable').DataTable().ajax.reload();
							getSubjecttree({
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_PROJECTID,
								param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
							}, data => {
								$('.js-tree-collapsed').trigger('rebuild', [{
									data: [data.data[0].treeData],
									levels: (_data.deep + 2),
									callback(tree) {
										tree.expandNode(_data.nodeId, {
											levels: (_data.deep + 2),
											silent: true
										});
										tree.selectNode(_data.nodeId, {silent: true});
										_data = agrs.data = tree.getNode(_data.nodeId);
									}
								}]);
							});
							bdoInfoBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
				bdoInfoBox('请稍后，正在生成实施程序和底稿');
				$('#programParamModal1').modal('hide');
			});
			$('#modalHideBtn').click(function() {
				$('#programParamModal1').modal('hide');
			});
			$('#tb_close').click(function() {
				$('#programParamModal1').modal('hide');
			});
			/*bdoConfirmBox('提示', '确定执行批量生成实施程序和底稿吗？', () => {
				bdoInfoBox('请稍后，正在生成实施程序和底稿');
				var param=null;
				if (_data.type == 'SUBJECT') {
					param = _data.extraOptions.autoId;
				}
				if (_data.type == 'TBSUBJECT') {
					param = _data.extraOptions.autoId;
				}
				if (_data.type == 'PROJECT') {
					param = _data.extraOptions.projectId;
				}
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgMain.batchGenerateProgram.json',
					data: {
						param1: _data.type,
						param2: param
					},
					bdolxLoader: false,		// 禁用旋转等待
					dataType: 'json',
					success(data) {
						if (data.success) {
							bdoInfoBox('成功', data.resultInfo.statusText);
							$('#auditProgramTable').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});*/

		}
		, onAuditProgramTopClick(event) {
			let $el = $(event.currentTarget);
			let $icon = $('i', $el);
			$icon.toggleClass('si-arrow-up');
			$icon.toggleClass('si-arrow-down');
			$('#auditProgramEcavpTableBlock').toggle();
			/*if($icon.hasClass('si-arrow-up')) {
				$icon.removeClass('si-arrow-up');
				$icon.addClass('si-arrow-down');
				$('#auditProgramEcavpTableBlock').hide();
			}else {
				$icon.removeClass('si-arrow-down');
				$icon.addClass('si-arrow-up');
				$('#auditProgramEcavpTableBlock').show();
			}*/
		}
		//, onAuditProgramFullscreenClick(event) {}
		, onNewAuditprogramClick(event) {
			page.cusAuditprogramForm.jsonData = {
				programNameAft: '',
				indexId: '',
				dgName: '',
				confirmStatusAft: '',
				draftTemplateName: [],
				draftTemplate: [],
				delTemplates: [],
				required: '0',
				customerId: _data.extraOptions.customerId,
				projectId: _data.extraOptions.projectId,
				subjecttreeId: _data.extraOptions.autoId,
				autoId: null,
				csE: false,
				csC: false,
				csA: false,
				csV: false,
				csP: false,
				sE: '',
				sC: '',
				sA: '',
				sV: '',
				sP: ''
			};
			page.cusAuditprogramForm.process = 'add';
			page.cusAuditprogramFormSider.show();
		}
		, onAddOtherProgramClick(event) {
			page.searchForm.jsonData = {
				s_departmentId: '',
				s_programName: '',
				s_subjectName: '',
				s_confirmStatus: '',
				s_stage: '',
				s_industry: '',
				s_dgName: '',
				s_indexId: '',
				s_confirmStatus: ''
			};
			page.selectProgramSider.show();
			page.selectProgramTableCfg.localParam.urlparam = page.getDefaultFilter();
			BdoDataTable('selectProgramTable', page.selectProgramTableCfg);
		}
		, onSelectOkClick(event) {

			let jqEl = $('input[name="apCheckbox"]:checked');
			let selectIds = [];
			$.each(jqEl, (index, el) => {
				selectIds.push(el.value);
			});
			if (selectIds.length < 1) {
				bdoErrorBox('', '未选择数据！');
				return;
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgMain.addOtherProgram.json',
				//async : false,
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: selectIds.join(','),
					param2: _data.extraOptions.autoId,
					param3: _data.extraOptions.customerId
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						selectProgramSider.hide();
						$('#auditProgramTable').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}
		, onSelectCancelClick(event) {
			page.selectProgramSider.hide();
		}
		, onSearchClick(event) {
			let param = searchForm.jsonData;
			let queryFilterArr = [];
			$.each(param, (key, value) => {
				if (value && value != '') {
					let _key = key.replace('s_', '');
					let filter = {
						field: _key,
						sqlIndex: 'a.' + _key,
						type: 'string',
						value: value,
						operate: 'like'
					};
					switch (_key) {
						case 'departmentId':
							filter.operate = 'eq';
							filter.type = 'number';
							break;
						default:
							filter.operate = 'like';
					}
					queryFilterArr.push(filter);
				}
			});
			let queryString = JSON.stringify(queryFilterArr);
			page.selectProgramTableCfg.localParam.urlparam.filter = queryString;
			$('#selectProgramTable').DataTable().ajax.reload();
		}
		, onSearchResetClick(event) {
			page.searchForm.jsonData = {
				s_departmentId: '',
				s_programName: '',
				s_subjectName: '',
				s_confirmStatus: '',
				s_stage: '',
				s_industry: '',
				s_dgName: '',
				s_indexId: '',
				s_confirmStatus: ''
			};
			page.selectProgramTableCfg.localParam.urlparam = page.getDefaultFilter();
			$('#selectProgramTable').DataTable().ajax.reload();
		}
		, onFilterChange(event) {
			let val = $('#filter').val();
			let param5 = null;
			switch (val) {
				case 'all':
					param5 = null;
					break;
				case 'std':
					param5 = 0;
					break;
				case 'sub':
					param5 = 1;
					break;
			}
			page.auditProgramTableCfg.localParam.urlparam.param5 = param5;

			$('#auditProgramTable').DataTable().ajax.reload();
		},
		onFilterEditorChange(event){
			let filterEditor = $('#filterEditor2 option:selected').val();
			page.auditProgramTableCfg.localParam.urlparam.param8= filterEditor;
			$('#auditProgramTable').DataTable().ajax.reload();
		}
		, queryGroupMembers() {
			let me = this;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgProject.getProjectMember.json',
				//async : false,
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						var jsonArr='';
						page.selectEditors = data.data.map(item => {
							return {id: item.id, text: item.name, value: item.name};
						});
						jsonArr = '<option value="" selected="selected"></option>';
						$.each(data.data,function (index,item) {
							jsonArr += '<option value="' + item.id+ '" style="color: #000">' + item.name + '</option>';
						});
						$('#filterEditor2').html(jsonArr);
					}
				}
			});
		}
		/**
		 * 初始化
		 */
		, init(options) {
			let startTime = (new Date()).getTime();
			let me = this;
			if (_data.type == 'SUBJECT') {
				$('#newAuditprogramBtn').show();
				$('#addOtherProgramBtn').show();
			} else {
				$('#newAuditprogramBtn').hide();
				$('#addOtherProgramBtn').hide();
			}
			BdoDataTable('auditProgramTable', this.auditProgramTableCfg);
			BdoDataTable('unexecuteprogamTable', this.unexecuteprogamTableCfg);
			$('#auditProgramTable').on('xhr.dt', function(event, setting, data) {
				cnt = 0;
				auditProgramRow = 0;
				auditProgramRowMark = new Array(data.recordsTotal);
				parentApMap = {};
				Promise.resolve().then(() => {
					me.getECAVPSummery(_data, me.getECAVPCallback.bind(me));
					me.getProgramCount(_data, me.getProgramCountCallback.bind(me));
				});
				/*if(this.xhrDtTimer) {
					clearTimeout(this.xhrDtTimer);
				}
				this.xhrDtTimer = setTimeout(function() {
					me.getECAVPSummery(_data, me.getECAVPCallback.bind(me));
					me.getProgramCount(_data, me.getProgramCountCallback.bind(me));
				}, 100);*/
			});
			var _dataNode;
			function getNodeByAutoId(nodes, autoId){
				if(nodes.extraOptions.autoId == autoId){
					_dataNode = nodes;
				}
				if(nodes.nodes != null){
					for (var i = 0; i < nodes.nodes.length; i++) {
						getNodeByAutoId(nodes.nodes[i], autoId);
					}
				}
			}
			// 刷新数据
			$('#auditProgramTable_wrapper').on('click', 'a[class="tableRefresh"]', function() {
				var nodeId = _data.nodeId;
				var parentId = _data.parentId;
				var autoId = _data.extraOptions.autoId;
				$.ajax({
					url: 'dgCenter/DgMain.getSubjecttree.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_PROJECTID
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							var nodes = data.data[0].treeData.nodes[3];
							getNodeByAutoId(nodes, autoId);
							if (_dataNode) {
								_data = _dataNode;
								_data.nodeId = nodeId;
								_data.parentId = parentId;
							}
						}
					}
				});
			});
			this.bindTableOptEvents();
			// 不执行理由填写画面
			this.unexecuteFormSider = side({el: '#unexecuteFormSider'});
			// 审核画面
			this.auditFormSider = side({el: '#auditFormSider'});
			// 查看审计画面
			this.viewProgramSider = side({el: '#viewProgramSider'});
			// 新增自定义程序表单画面
			this.cusAuditprogramFormSider = side({
				el: '#cusAuditprogramFormSider', afterHide() {
					me.cusAuditprogramForm.process == '';
				}
			});
			// 选择程序画面
			this.selectProgramSider = side({el: '#selectProgramSider'});
			// 不执行理由填写画面表单
			//let UnexecuteComp = Vue.extend(this.unexecuteFormCfg);
			this.unexecuteForm = createForm(this.unexecuteFormCfg);
			// 审核画面表单
			//let AuditComp = Vue.extend(this.auditFormCfg);
			this.auditForm = createForm(this.auditFormCfg);
			// 新增自定义程序表单
			//let CusAuditprogramComp = Vue.extend(this.cusAuditprogramFormCfg);
			this.cusAuditprogramForm = createForm(this.cusAuditprogramFormCfg);
			// 上传底稿
			this.uploadWorkpagerPage = createForm(this.uploadWorkpagerPageCfg);
			// 编辑程序
			this.editAuditprogramFormSider = side({el: '#editAuditprogramFormSider'});
			this.editAuditprogramForm = createForm(this.editAuditprogramFormCfg);
			// 编辑子程序
			this.editSubProgramForm = createForm(this.editSubProgramFormCfg);
			$('#saveSubProgramClickBtn').text('保存');
			$('#cancelSubProgramClicktBtn').text('关闭');
			this.editSubProgramSider = side({
				el: '#editSubProgramSider', afterHide() {
					me.editSubProgramForm.process = '';
				}
			});
			// 底稿附件
			this.dgAttachSider = side({el: '#dgAttachSider'});

			// 选择程序画面检索条件
			this.searchForm = createForm(this.searchFormCfg);
			// 设置统计数据
			//this.getECAVPSummery(_data, this.getECAVPCallback.bind(this));
			OneUI.initHelper('slimscroll');
			this.queryGroupMembers();
		}
		, getECAVPCallback(data) {
			let ecavp = {
				pplansE: 0,
				pplansC: 0,
				pplansA: 0,
				pplansV: 0,
				pplansP: 0,
				splansE: 0,
				splansC: 0,
				splansA: 0,
				splansV: 0,
				splansP: 0,
				implE: 0,
				implC: 0,
				implA: 0,
				implV: 0,
				implP: 0
			};
			if (data.data) {
				$.each(data.data, (index, obj) => {
					if (obj.type == 'PROGRAMP') {
						ecavp.pplansE += obj.plansE;
						ecavp.pplansC += obj.plansC;
						ecavp.pplansA += obj.plansA;
						ecavp.pplansV += obj.plansV;
						ecavp.pplansP += obj.plansP;

						ecavp.implE += obj.sE;
						ecavp.implC += obj.sC;
						ecavp.implA += obj.sA;
						ecavp.implV += obj.sV;
						ecavp.implP += obj.sP;
					}
					if (obj.type == 'SUBJECTP') {
						ecavp.splansE += obj.plansE;
						ecavp.splansC += obj.plansC;
						ecavp.splansA += obj.plansA;
						ecavp.splansV += obj.plansV;
						ecavp.splansP += obj.plansP;
					}
				});
			}
			this.setSummery(ecavp);
		}
		, getECAVPSummery(currentNode, callback) {
			let param = {
				menuId: window.sys_menuId,
				sqlId: 'DG00028',
				start: -1,
				limit: -1
			};
			param.param1 = currentNode.extraOptions.autoId;
			param.param2 = currentNode.extraOptions.nodeType;
			param.param3 = currentNode.extraOptions.customerId;
			param.param4 = currentNode.extraOptions.projectId;
			param.param8 = window.CUR_PROJECT_ACC_YEAR;
			if (currentNode.extraOptions.nodeType == 'TBSUBJECT' || currentNode.extraOptions.nodeType == 'SUBJECT') {
				//param.param5 = currentNode.extraOptions.tbSubjectName;
				param.param9 = currentNode.extraOptions.tbSubjectCode;
			}
			if (currentNode.extraOptions.nodeType == 'SUBJECT') {
				param.param6 = currentNode.extraOptions.userSubjectId;
				param.param7 = currentNode.extraOptions.userSubjectName;
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				//async : false,
				data: param,
				dataType: 'json',
				success(data) {
					callback && callback(data);
				}
			});
		}
		, getProgramCountCallback(data) {
			let counts = data.data[0];
			let getValue = val => val ? val : 0;
			$.each(counts, (key, val) => $('#' + key).text(getValue(val)));
		}
		, getProgramCount(currentNode, callback) {
			let param = {
				menuId: window.sys_menuId,
				sqlId: 'DG00065',
				param1: currentNode.extraOptions.customerId,
				param2: currentNode.extraOptions.projectId,
				param3: '1',
				param8: $('#filterEditor2 option:selected').val(),
				page: 0,
				start: -1,
				limit: -1
			};
			if (currentNode.extraOptions.nodeType == 'SUBJECT') {
				param.param4 = currentNode.extraOptions.autoId;
			}
			if (currentNode.extraOptions.nodeType == 'TBSUBJECT') {
				param.param5 = currentNode.extraOptions.autoId;
			}
			if (currentNode.extraOptions.nodeType == 'PROJECT') {
				param.param6 = currentNode.extraOptions.autoId;
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				data: param,
				dataType: 'json',
				success(data) {
					callback && callback(data);
				}
			});
		}

		, dgAttachSider: null
		, auditProgramTable: null
		, bgColerMap: {}
		, auditProgramTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00005',
						param3: '1',
						param6: _data.extraOptions.customerId,
						param8:$('#filterEditor2 option:selected').val()
					};
					if (_data.type == 'SUBJECT') {
						param.param1 = _data.extraOptions.autoId;
					}
					if (_data.type == 'TBSUBJECT') {
						param.param2 = _data.extraOptions.autoId;
					}
					if (_data.type == 'PROJECT') {
						param.param4 = _data.extraOptions.projectId;
					}
					return param;
				})(),
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
				fixedColumns: true,
				bdoCustomizeColumns: true,
				drawCallback(setting) {
					let me = this;
					$.each(auditProgramRowMark, (index, value) => {
						if (value) {
							$('.ribbon-box[data-ribbon-row="' + index + '"]', this).text(value);
						} else {
							$('.ribbon-box[data-ribbon-row="' + index + '"]', this).hide();
						}
					});
					if (me.drawDtTimer) {
						clearTimeout(me.drawDtTimer);
					}

					this.drawDtTimer = setTimeout(function() {
						let data = me.fnGetData();
						$('#auditProgramTable tbody').replaceWith(setting.nTBody);
						$('#auditProgramTable').trigger('initEditVm', [data]);
						clearTimeout(me.drawDtTimer);
						me.drawDtTimer = false;
					}, 1000);
				},
				createdRow(row, data, dataIndex) {
					let barStyle = '';
					if (dataIndex == 0) {
						page.bgColerMap = {};
					}

					if (data.level < 1) {
						page.bgColerMap[data.autoId] = {
							level: data.level,
							departmentId: data.departmentId,
							customizeFlag: data.customizeFlag
						};

						if (data.customizeFlag == '1') {
							barStyle = 'bg-warning';
						} else {
							if (data.departmentId == BdoFaithConsts.DEPARTMENT_BDO) {
								barStyle = 'bg-info';
							} else {
								barStyle = 'bg-success';
							}
						}
					} else {
						barStyle = 'bg-standard';
					}

					$(row).find('td:eq(3)').addClass(barStyle);
					$(row).find('td:eq(4)').addClass(barStyle);

					if (data.level == 0) {
						$(row).addClass('program-level-0');
					} else if (data.level == 1) {
						$(row).addClass('program-level-1').show();
						$(row).attr('data-program-parent-id', data.parentId);
					}
				},
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					title: '序号',
					width: '80px',
					data: null,
					className: 'text-center font-16 ribbon ribbon-right',
					render(data, type, row, meta) {
						let rowNum = '';
						if (row.level == 0) {
							auditProgramRow++;
							rowNum = auditProgramRow;
							rowNum = rowNum + '<div class="ribbon-box bg-standard" data-ribbon-row="' + (rowNum - 1) + '" style="top: 0;padding: 0 3px;height: 16px;line-height: 16px;"></div><i class="program-level-0opt btn fa fa-minus-circle" data-program-id="' + row.autoId + '"></i>';
						} else {
							if (!auditProgramRowMark[auditProgramRow - 1]) {
								auditProgramRowMark[auditProgramRow - 1] = 1;
							} else {
								auditProgramRowMark[auditProgramRow - 1]++;
							}
							rowNum = auditProgramRow + '-' + auditProgramRowMark[auditProgramRow - 1];
						}
						return rowNum;
					}
				}, {
					targets: ++cnt,
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '150px',
					render(data, type, row, meta) {
						let renderStr = '';
						renderStr += '<div class="">';
						if (row.level == 0) {
							renderStr += '<button class="btn btn-xs btn-success table-btn-operate bdo-drop-btn" type="button" name="optNewSubProgramBtn" data-placement="top" title="添加实施程序" data-toggle="tooltip" data-row="' + meta.row + '">'
								+ '	<i class="fa fa-plus-square"></i>'
								+ '	</button>';
						} else {
							renderStr += '<button class="btn btn-xs btn-warning table-btn-operate bdo-drop-btn" type="button" name="optEditBtn" data-placement="top" title="编辑" data-toggle="tooltip" data-row="' + meta.row + '">'
								+ '	<i class="fa fa-edit"></i>'
								+ '	</button>';
							if (row.workpaperId && row.workpaperId != '') {
								renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="optOpenExcelBtn" data-placement="top" title="底稿" data-toggle="tooltip" data-row="' + meta.row + '">'
									+ '	<i class="fa fa-file-excel-o"></i>'
									+ '	</button>';
							}
						}

						renderStr += '<button class="btn btn-xs btn-info table-btn-operate bdo-drop-btn" type="button" name="operate" data-placement="top" title="更多操作" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-gear"></i>'
							+ '	</button>';
						renderStr += '</div>';
						return renderStr;
					}
				}/*, {
					targets : ++cnt,
					orderable : false,
					className : 'text-center',
					title : '状态',
					name : 'state',
					data : 'state',
					width : '100px',
					render(data, type, row, meta){
						return ('<div class="progress active" style="margin: 0px 5px;">'
							+'		<div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="'+ data +'" aria-valuemin="10" aria-valuemax="100"'
							+'		style="width: '+ data +'%;"></div>'
							+ data +'%'
							+'	</div>');
					}
				}*/, {
					targets: ++cnt,
					orderable: false,
					title: '索引号',
					name: 'indexId',
					data: 'indexId',
					width: '50px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '程序名称',
					name: 'dgName',
					data: 'dgName',
					width: '150px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: false,
					title: '程序内容',
					name: 'programNameAft',
					data: 'programNameAft',
					width: '300px',
					className: 'dg-ap',
					render(data, type, row, meta) {
						let color = '';
						if (row.updateFlag == '1' && data != row.programNamePre) {
							color = 'red';
						}
						if(row.programNameAft && row.programNameAft.length > 0) {
							row.programNameAft = row.programNameAft
								.replace(/<span class=\"ap-name-color\" style=\"color: white;background-color: #AACD97;\">/g, '')
								.replace(/<\/span>/g, '')
							;
						}
						row.programNameAftCache = row.programNameAft;
						if(row.level == 0) {
							parentApMap['' + row.autoId] = row;
						} else {
							let po = parentApMap['' + row.parentId];
							if(po && po.programNameAft && po.programNameAft.length > 0
								&& row.programNameAft && row.programNameAft.length > 0) {
								let resultArr = row.programNameAft.split('\n');
								$.each(resultArr, (ii, oo) => {
									if(po.programNameAft.indexOf(oo) == -1) {
										resultArr[ii] = '<span class="ap-name-color" style="color: white;background-color: #AACD97;">' + oo + '</span>';
									}
								});
								data = row.programNameAft = resultArr.join('\n');
							}
						}
						return '<pre class="dg" style="color: ' + color + ';height: 100%; width: 300px;">' + data + '</pre>';
					}
				}, /*{
					targets : ++cnt,
					orderable : true,
					title : '审计说明',
					name : 'auditDesc',
					data : 'auditDesc',
					width : '300px',
					className : 'dg-ap'
				},*/ {
					targets: ++cnt,
					orderable: false,
					title: '审计结论',
					name: 'auditConclusion',
					data: 'auditConclusion',
					width: '300px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					title: 'E',
					name: 'E',
					data: 'csE',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sE, row.csEOriginal, row.sEOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'C',
					name: 'C',
					data: 'csC',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sC, row.csCOriginal, row.sCOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'A',
					name: 'A',
					data: 'csA',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sA, row.csAOriginal, row.sAOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'V',
					name: 'V',
					data: 'csV',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sV, row.csVOriginal, row.sVOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'P',
					name: 'P',
					data: 'csP',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sP, row.csPOriginal, row.sPOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '部门',
					name: '__ddepartmentIdName',
					data: '__ddepartmentIdName',
					width: '100px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: false,
					className: 'text-center',
					title: '底稿编制人',
					name: '__uworkpaperEditor',
					data: '__uworkpaperEditor',
					width: '90px',
					className: 'dg-ap',
					render(data, type, row, meta) {
						let value;
						if ($.isPlainObject(row.__uworkpaperEditor)) {
							value = row.__uworkpaperEditor.userId;
						}
						return getEditManEdit(value, meta.row);
					}
				}, {
					targets: ++cnt,
					orderable: false,
					className: 'text-center',
					title: '复核人',
					name: '__urecheckUserName',
					data: '__urecheckUserName',
					width: '90px',
					className: 'dg-ap'/*,
					render(data, type, row, meta) {
						let value;
						if ($.isPlainObject(row.__urecheckUser)) {
							value = row.__uworkpaperEditor.userId;
						}
						return getEditManEdit(value, meta.row);
					}*/
				}]
			}
		}
		, unexecuteprogamTable: null
		, unexecuteprogamTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00005',
						param3: '0',
						param6: _data.extraOptions.customerId
					};
					if (_data.type == 'SUBJECT') {
						param.param1 = _data.extraOptions.autoId;
					}
					if (_data.type == 'TBSUBJECT') {
						param.param2 = _data.extraOptions.autoId;
					}
					if (_data.type == 'PROJECT') {
						param.param4 = _data.extraOptions.projectId;
					}
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				select: true,
				ordering: false,
				//order : [2, 'asc'],
				serverSide: true,
				autoWidth: true,
				scrollY: 500,
				scrollX: true,
				scrollCollapse: true,
				paging: true,
				fixedColumns: true,
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '30px',
					render(data, type, row, meta) {
						let renderStr = '';
						renderStr += '<div class="">';
						renderStr += '<button class="btn btn-xs btn-success table-btn-operate bdo-drop-btn" type="button" name="optToExcProgramBtn" data-placement="top" title="执行" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-share-square-o"></i>'
							+ '	</button>';
						renderStr += '</div>';
						return renderStr;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '索引号',
					name: 'indexId',
					data: 'indexId',
					width: '50px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '程序名称',
					name: 'dgName',
					data: 'dgName',
					width: '150px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '程序内容',
					name: 'programNameAft',
					data: 'programNameAft',
					width: '300px',
					className: 'dg-ap',
					render(data, type, row, meta) {
						return '<pre class="dg" style="height:100%">' + data + '</pre>';
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '不执行理由',
					name: 'reason',
					data: 'reason',
					width: '300px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					title: 'E',
					name: 'E',
					data: 'csE',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sE, row.csEOriginal, row.sEOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'C',
					name: 'C',
					data: 'csC',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sC, row.csCOriginal, row.sCOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'A',
					name: 'A',
					data: 'csA',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sA, row.csAOriginal, row.sAOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'V',
					name: 'V',
					data: 'csV',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sV, row.csVOriginal, row.sVOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'P',
					name: 'P',
					data: 'csP',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sP, row.csPOriginal, row.sPOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '部门',
					name: '__ddepartmentIdName',
					data: '__ddepartmentIdName',
					width: '200px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: true,
					className: 'text-center',
					title: '创建人',
					name: '__ucreateUserName',
					data: '__ucreateUserName',
					width: '90px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: true,
					className: 'text-center',
					title: '复核人',
					name: 'recheckUser',
					data: 'recheckUser',
					width: '90px',
					className: 'dg-ap'
				}/*, {
					targets : ++cnt,
					orderable : true,
					className : 'text-center',
					title : '状态',
					name : 'state',
					data : 'state',
					width : '90px',
					className : 'dg-ap'
				}*/]
			}
		}
		, shareToAptTable: null
		, shareToAptTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00447',
						param1: _data.extraOptions.customerId,
						param2: _data.extraOptions.projectId,
						start: -1,
						limit: -1
					};
					if (_data.type == 'SUBJECT') {
						param.param6 = _data.extraOptions.autoId;
					}
					if (_data.type == 'TBSUBJECT') {
						param.param5 = _data.extraOptions.autoId;
					}
					if (_data.type == 'PROJECT') {

					}
					let projectManager = $.sessionStorage('projectManager');
					if (CUR_USERID != projectManager){
						param.param5 = CUR_USERID;
					}
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				select: true,
				ordering: false,
				serverSide: true,
				autoWidth: true,
				scrollY: '380px',
				scrollX: true,
				scrollCollapse: true,
				dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
				fixedColumns: true,
				lengthChange : false,
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					className: 'text-center',
					title: '<label class="css-input css-checkbox css-checkbox-primary"><input id="shareCheckAllBtn" type="checkbox""><span></span></label>',
					data: null,
					width: '30px',
					render(data, type, row, meta) {
						var renderStr = '';
						renderStr = '<label class="css-input css-checkbox css-checkbox-primary"><input type="checkbox" name="mulDgFile" value="'+ row.autoId + '"><span></span></label>';
						return renderStr;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '索引号',
					name: 'indexId',
					data: 'indexId',
					width: '50px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '程序名称',
					name: 'dgName',
					data: 'dgName',
					width: '150px',
					className: 'dg-ap'
				}]
			}
		}
		, unexecuteFormSider: null
		, auditFormSider: null
		, viewProgramSider: null
		, unexecuteFormCfg: {
			options: {
				propsData: {
					jsonData: {
						autoId: null,
						customerId: null,
						reason: ''
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 1,
			id: 'unexecuteForm',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: 'dgCenter/DgMain.setUnexecuteProgram.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								page.unexecuteFormSider.hide();
								$('#auditProgramTable').DataTable().ajax.reload();
								$('#unexecuteprogamTable').DataTable().ajax.reload();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					}
				};
			},
			methods: {
				onSetUnexecuteProgramClick(event) {
					this.submit(true);
				},
				onCancelClick() {
					page.unexecuteFormSider.hide();
				}
			},
			buttons: [{
				id: 'setUnexecuteProgramBtn',
				icon: 'fa-floppy-o',
				style: 'btn-primary',
				text: '提交',
				typeAttr: {
					'v-on:click': 'onSetUnexecuteProgramClick'
				}
			}, {
				id: 'cancelSetUnexecuteProgramBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'v-on:click': 'onCancelClick'
				}
			}],
			items: [{
				id: 'reason',
				type: 'textarea',
				label: '不执行理由',
				rowspan: 1,
				colspan: 1,
				validate: {
					rules: {
						required: true
					}
				},
				typeAttr: {
					rows: 5
				},
				show: true
			}]
		}
		, unexecuteForm: null
		, auditFormCfg: {
			options: {
				propsData: {
					jsonData: {
						remark: ''
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 1,
			id: 'auditForm',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: 'demo/Spread.setUnexecuteProgram.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								page.auditFormSider.hide();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					}
				};
			},
			methods: {
				onAuditAcceptClick(event) {
					this.submit(true);
				},
				onAuditFailedClick(event) {
					this.submit(true);
				},
				onCancelClick() {
					page.auditFormSider.hide();
				}
			},
			buttons: [{
				id: 'auditAcceptBtn',
				icon: 'fa-check-square-o',
				style: 'btn-success',
				text: '通过',
				typeAttr: {
					'v-on:click': 'onAuditAcceptClick'
				}
			}, {
				id: 'auditFailedBtn',
				icon: 'fa-window-close-o',
				style: 'btn-danger',
				text: '不通过',
				typeAttr: {
					'v-on:click': 'onAuditFailedClick'
				}
			}, {
				id: 'cancelAuditBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'v-on:click': 'onCancelClick'
				}
			}],
			items: [{
				id: 'remark',
				type: 'textarea',
				label: '备注',
				rowspan: 1,
				colspan: 1,
				validate: {
					rules: {
						//required : true
					}
				},
				typeAttr: {
					rows: 5
				},
				show: true
			}]
		}
		, auditForm: null
		, uploadWorkpagerPageCfg: {
			options: {
				propsData: {
					jsonData: {
						workpager: [],
						subjecttreeId: '',
						autoId: null,
						subjecttreeId: null,
						customerId: null
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 1,
			id: 'uploadTplForm',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: 'dgCenter/DgWapper.queryTagOrLinkExistence.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								let doIt = () => {
									var paramMap = data.data[0].paramMap;
									var keyListMap = data.data[0].keyListMap;
									$.ajax({
										url: 'dgCenter/DgWapper.uploadWorkpaper.json',
										type: 'POST',
										data: {
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											param1: JSON.stringify(paramMap),
											param2: JSON.stringify(keyListMap)
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												bdoSuccessBox('成功', data.resultInfo.statusText);
												$('#uploadTplFormModal').modal('hide');
												getSubjecttree({
													customerId: window.CUR_CUSTOMERID,
													projectId: window.CUR_PROJECTID,
													param1: window.CUR_PROJECTID,
													param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
												}, data => {
													$('.js-tree-collapsed').trigger('rebuild', [{
														data: [data.data[0].treeData],
														levels: (_data.deep + 2),
														callback(tree) {
															tree.expandNode(_data.nodeId, {levels: (_data.deep + 2), silent: true});
															tree.selectNode(_data.nodeId, {silent: true});
															_data = agrs.data = tree.getNode(_data.nodeId);
														}
													}]);
												});
												$('#auditProgramTable').DataTable().ajax.reload();
												var storage = window.localStorage;
												storageId = 'BDO' + data.data[0].workpaperId;
												storageStatus = 'BDO' + data.data[0].workpaperId + 'Status';
												storageTime = 'BDO' + data.data[0].workpaperId + 'Time';
												storage.removeItem(storageId);
												storage.removeItem(storageStatus);
												storage.removeItem(storageTime);
												// 公式校验
												$.ajax({
													url: 'dgCenter/DgWapper.checkDgFormula.json',
													type: 'post',
													data: {
														customerId: window.CUR_CUSTOMERID,
														projectId: window.CUR_PROJECTID,
														param1: window.CUR_CUSTOMERID,
														param2: window.CUR_PROJECTID,
														param3: 'DG',
														param4: data.data[0].workpaperId
													},
													dataType: 'json',
													success(data) {
														if (!data.success) {
															bdoErrorBox(data.resultInfo.statusText);
														}
													}
												});
											} else {
												if(data.data && data.data[0] && data.data[0].extraLinkList){
													var displaytext = '上传的文件中，存在&nbsp;<font color="red">' + data.data[0].extraLinkList.length + '</font>&nbsp;处外部文件链接！';
													for(var rowData of data.data[0].extraLinkList){
														displaytext = displaytext + '<br>sheet名称：<font color="red">' + rowData.substring(0, rowData.indexOf(':')) + '</font>';
														displaytext = displaytext + '&nbsp;&nbsp;单元格位置：<font color="red">' + rowData.substring(rowData.indexOf(':') + 1) + '</font>';
													}
													bdoErrorBox('失败', displaytext);
												}else{
													bdoErrorBox('失败', data.resultInfo.statusText);
												}
											}
										}
									});
								};
								var dataListMap = data.data[0].dataListMap;
								if(dataListMap){
									var titleList = [];
									var text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
									for(var key in dataListMap){
										// "sheetName: 衍生金融资产明细表 单元格位置: C9"
										// "sheetIndex: 1 单元格位置: B7"
										var value = dataListMap[key];
										if(key.indexOf('标签:') != -1){
											text += '标签:' + value + '<br>';
											var sheetName = value.substring(11, value.indexOf('单元格位置') - 1);
											var title = '"' + sheetName + '"sheet';
											if(titleList.indexOf(title) == -1){
												titleList.push(title);
											}
										} else {
											text += '单向链接:' + value + '<br>';
											var sheetIndex = value.substring(12, value.indexOf('单元格位置') - 1);
											var title = '第' + sheetIndex + '个sheet';
											if(titleList.indexOf(title) == -1){
												titleList.push(title);
											}
										}
									}
									var title = '<div>该上传底稿文件对比原底稿文件,缺少原底稿文件中的' + titleList.join("、") + '</div><br>';
									text += '</font></div>';
									text = title + '此次上传底稿将会删除以下标签或单向链接 <br>' + text + '<br>是否确定上传？';
									bdoConfirmBox('提示', text, isConfirm => {
										doIt();
									});
								} else {
									doIt();
								}
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					}
				};
			},
			methods: {
				onUploadDraftFileClick(event) {
					let file = $('#workpager').fileinput('getFileStack');
					//console.log("file:"+file);
					if (!file || file.length < 1) {
						bdoInfoBox('提示', '请选择导入文件');
						return;
					}
					let check = true;
					$.each(file, function(i, val) {
						if (!/.xlsx/.test(val.name)) {
							check = false;
						}
					});
					if (!check) {
						bdoInfoBox('提示', '不正确的文件扩展名.只支持\'xlsx\'的文件扩展名.');
						return;
					}
					this.uploadFile(true);
				}
			},
			buttons: [{
				id: 'uploadDraftFileBtn',
				icon: 'fa-floppy-o',
				style: 'btn-primary',
				text: '上传',
				typeAttr: {
					'v-on:click': 'onUploadDraftFileClick'
				}
			}, {
				id: 'cancelUploadDraftFileBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'data-dismiss': 'modal'
				}
			}],
			items: [{
				id: 'workpager',
				type: 'file',
				label: '底稿',
				rowspan: 1,
				colspan: 2,
				validate: {
					rules: {}
				},
				show: true,
				plugin: {
					name: 'fileinput',
					options: {
						uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
						allowedFileExtensions: ['xlsx'],//允许的文件类型]
						maxFilesNum: 1,
						uploadExtraData() {
							return {};
						}
					}
				}
			}]
		}
		, uploadWorkpagerPage: null
		, tplEditComp: {
			el: '#draftTemplateName',
			template: '<ul class="list-group" style="padding: 10px 5px;">'
				+ '			<li class="list-group-item"'
				+ '				v-for="(file, index) in fileList"'
				+ '				:fileId="file.autoId"'
				+ '			>'
				+ '				<span class="icon fa fa-file-excel-o text-primary-light"></span>'
				+ '				{{file.fileName}}'
				+ '				<span class="fa fa-close text-danger pull-right" @click="onDelTplFileClick" :data-index="index" v-show="delBtnShow"></span>'
				+ '			</li>'
				+ '		</ul>',
			data() {
				return {
					fileList: [],
					delBtnShow: false
				};
			},
			methods: {
				onDelTplFileClick(event) {
					let tplcomp = this;
					let $span = $(event.currentTarget);
					let index = $span.attr('data-index');
					bdoConfirmBox('提示', '确定删除该模板文件吗？', (isConfirm) => {
						page.cusAuditprogramForm.jsonData.delTemplates.push(tplcomp.fileList[index].autoId);
						tplcomp.fileList.splice(index, 1);
					});
				}
			}
		}
		, cusAuditprogramFormSider: null
		, cusAuditprogramFormCfg: {
			options: {
				propsData: {
					jsonData: {
						programNameAft: '',
						indexId: '',
						dgName: '',
						confirmStatusAft: '',
						confirmStatusAftName: '',
						draftTemplateName: [],
						draftTemplate: [],
						delTemplates: [],
						required: '',
						customerId: _data.extraOptions.customerId,
						projectId: _data.extraOptions.projectId,
						subjecttreeId: _data.extraOptions.autoId,
						autoId: null,
						customerId: null,
						csE: false,
						csC: false,
						csA: false,
						csV: false,
						csP: false,
						sE: '',
						sC: '',
						sA: '',
						sV: '',
						sP: ''
					}
				}
			},
			computed: {
				'jsonData.programNamePre'() {
					return this.jsonData.programNameAft;
				},
				'jsonData.confirmStatusPre'() {
					return this.jsonData.confirmStatusAft;
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 2,
			id: 'cusAuditprogramForm',
			data() {
				return {
					/**
					 * 表单提交ajax 配置
					 */
					ajaxConfig: {
						type: 'POST',
						url: 'dgCenter/DgMain.addCusAuditProgram.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								page.cusAuditprogramFormSider.hide();
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#auditProgramTable').DataTable().ajax.reload();
								this.process = '';
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					},
					/**
					 * 当前处理：add=新增, edit=更新, false=查看（隐藏提交按钮）
					 */
					process: 'add'
				};
			},
			computed: {
				checkboxGroupClass() {
					if (this.formItem.confirmGrop.readonly == true) {
						return 'css-input css-input-disabled css-checkbox css-checkbox-primary control-label';
					}
					return 'css-input css-checkbox css-checkbox-primary control-label';
				},
				scoreReadonly() {
					return this.formItem.confirmGrop.readonly;
				}
			},
			watch: {
				/**
				 * 处理编辑画面状态更新
				 */
				process(newValue, oldValue) {
					let pvm = this;
					if (newValue === false) {
						this.setAllReadonly(true);
						this.formItem.draftTemplateName.show = true;
						this.formItem.draftTemplate.show = false;
						this.formItem.confirmGrop.readonly = true;
					} else {
						this.setAllReadonly(false);
						this.formItem.draftTemplateName.show = false;
						this.formItem.draftTemplate.show = true;

						this.formItem.confirmGrop.readonly = false;
					}

					if (newValue == 'edit' || newValue === false) {
						if (this.tplEditComp == null) {
							this.tplEditComp = new Vue(tplEditComp);
						}

						this.tplEditComp.delBtnShow = (newValue == 'edit' ? true : false);
						this.jsonData.delTemplates = [];
						this.$nextTick(() => {
							this.formItem.draftTemplateName.show = true;
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								//async : false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00010',
									param1: this.jsonData.autoId
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										pvm.tplEditComp.fileList = data.data;
									}
								}
							});
						});
					}
				}
			},
			tplEditComp: null,
			methods: {
				/**
				 * 提交编辑画面表单
				 */
				onSaveAudtiprogramClick(evt) {
					if (!this.$form.valid()) {
						return;
					}
					if (this.process == 'add') {
						this.ajaxConfig.url = 'dgCenter/DgMain.addCusAuditProgram.json';
					} else if (this.process == 'edit') {
						this.ajaxConfig.url = 'dgCenter/DgMain.updateCusAuditProgram.json';
					}
					//this.jsonData.confirmStatusAftName = $('#confirmStatusAft').siblings('[data-id="confirmStatusAft"]').attr('title');
					/*this.jsonData.csE = page.booleanTranslate(this.jsonData.csE, true);
					this.jsonData.csC = page.booleanTranslate(this.jsonData.csC, true);
					this.jsonData.csA = page.booleanTranslate(this.jsonData.csA, true);
					this.jsonData.csV = page.booleanTranslate(this.jsonData.csV, true);
					this.jsonData.csP = page.booleanTranslate(this.jsonData.csP, true);*/
					let param = {};
					$.each(this.jsonData, (key, value) => {
						let key_ = key;
						param[key_] = value;
						if (key_.startsWith('cs')) {
							param[key_] = page.booleanTranslate(value, true);
						}
					});
					let flag = ['E', 'C', 'A', 'V', 'P'].map(val => {
						if (param['cs' + val] == 1) {
							return (param['s' + val] && param['s' + val] != '' && param['s' + val] > 0.00);
						} else {
							return ((!param['s' + val] || param['s' + val] == '') || (param['s' + val] > 0.00 || param['s' + val] < 0.00));
						}
					}).filter(val => val === false);
					if (flag.length > 0) {
						this.$form.vail();
						return;
					}
					this.uploadFile(true, {
						jsonData: JSON.stringify(param)
					});
				},
				/**
				 * 取消按钮点击事件
				 */
				onCancelClick(event) {
					page.cusAuditprogramFormSider.hide();
				},
				/**
				 * 打开编辑画面动作
				 */
				openEditPage() {
					if (this.tplEditComp == null) {
						this.tplEditComp = new Vue(tplEditComp);
					}

					this.tplEditComp.delBtnShow = (this.process == 'edit' ? true : false);
					this.jsonData.delTemplates = [];
					this.$nextTick(() => {
						this.formItem.draftTemplateName.show = true;
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							//async : false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00010',
								param1: this.jsonData.autoId
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									pvm.tplEditComp.fileList = data.data;
								}
							}
						});
					});
				}
			},
			buttons: [{
				id: 'saveCusAudtiprogramBtn',
				icon: 'fa-floppy-o',
				style: 'btn-primary',
				text: '保存',
				typeAttr: {
					'v-on:click': 'onSaveAudtiprogramClick',
					'v-show': 'process'
				}
			}, {
				id: 'cancelCusFormBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'v-on:click': 'onCancelClick'
				}
			}],
			items: [{
				id: 'dgName',
				type: 'input',
				label: '程序名称',
				rowspan: 1,
				colspan: 2,
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'indexId',
				type: 'input',
				label: '索引号',
				rowspan: 1,
				colspan: 1,
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'required',
				type: 'combo',
				label: '是否必须',
				colspan: 1,
				value: '0',
				validate: {
					rules: {
						required: true
					}
				},
				plugin: {
					name: 'combo',
					options: {
						noneSelectedText: '请选择',
						width: '250px'
					},
					stores() {
						return ComboLabelValueDicData(false, 'boolean');
					}
				}
			}, {
				id: 'confirmGrop',
				html: `
					<div class="form-material"><label>认定</label></div>
					<div class="row">
					<ecavp-comp :prefixed="''" :label-name="'E'" :ecs-val="jsonData.csV" :es-val="jsonData.sE" :group-readonly="true"></ecavp-comp>
					<ecavp-comp :prefixed="''" :label-name="'C'" :ecs-val="jsonData.csC" :es-val="jsonData.sC" :group-readonly="true"></ecavp-comp>
					<ecavp-comp :prefixed="''" :label-name="'A'" :ecs-val="jsonData.csA" :es-val="jsonData.sA" :group-readonly="true"></ecavp-comp>
					<ecavp-comp :prefixed="''" :label-name="'V'" :ecs-val="jsonData.csV" :es-val="jsonData.sV" :group-readonly="true"></ecavp-comp>
					<ecavp-comp :prefixed="''" :label-name="'P'" :ecs-val="jsonData.csP" :es-val="jsonData.sP" :group-readonly="true"></ecavp-comp>
					</div></div>
				`,
				rowspan: 1,
				colspan: 2,
				readonly: false
			}, {
				id: 'programNameAft',
				type: 'textarea',
				label: '程序内容',
				rowspan: 1,
				colspan: 2,
				typeAttr: {
					rows: 5
				},
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'draftTemplateName',
				type: 'div',
				label: '已上传底稿模板',
				rowspan: 1,
				colspan: 2,
				validate: {
					rules: {
						//required : true
					}
				},
				show: false
			}, {
				id: 'draftTemplate',
				type: 'file',
				label: '底稿模板',
				rowspan: 1,
				colspan: 2,
				validate: {
					rules: {
						//required : true
					}
				},
				show: true,
				plugin: {
					name: 'fileinput',
					options: {
						uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
						allowedFileExtensions: ['xlsx'],//允许的文件类型]
						maxFilesNum: 1,
						uploadExtraData() {
							return {};
						}
					}
				}
			}]
		}
		, cusAuditprogramForm: null
		, selectProgramSider: null
		, selectProgramTable: null
		, selectProgramTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00009'
				},
				tabNum: true
			},
			tableParam: {
				scrollX: true,
				select: true,
				ordering: true,
				order: [2, 'asc'],
				serverSide: true,
				fixedThead: true,
				fixedHeight: '480px',
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '100px',
					render(data, type, row, meta) {
						let renderStr = '';
						renderStr += '<label class="css-input css-checkbox css-checkbox-primary">'
							+ '	<input type="checkbox" id="apCheckbox" name="apCheckbox" value="' + row.autoId + '" data-row="' + meta.row + '">'
							+ '	<span></span>'
							+ '</label>';
						return renderStr;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '机构部门',
					name: 'departmentId',
					data: 'departmentId',
					width: '200px',
					render(data, type, row, meta) {
						return row.__ddepartmentIdName;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '索引号',
					name: 'indexId',
					data: 'indexId',
					width: '150px'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '程序名称',
					name: 'dgName',
					data: 'dgName',
					width: '300px'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '程序内容',
					name: 'programName',
					data: 'programName',
					width: '300px'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '标准科目',
					name: 'subject',
					//data : 'subjectName',
					width: '90px',
					render(data, type, row, meta) {
						return row.subjectId + '-' + row.subjectName;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '阶段',
					name: 'stage',
					data: 'stage',
					width: '90px',
					render(data, type, row, meta) {
						return DicVal2Nm(data, '审计程序阶段');
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '潜在风险说明',
					name: 'potentialRisk',
					data: 'potentialRisk',
					width: '200px'
				}, {
					targets: ++cnt,
					title: 'E',
					name: 'E',
					data: 'csE',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sE, row.csEOriginal, row.sEOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'C',
					name: 'C',
					data: 'csC',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sC, row.csCOriginal, row.sCOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'A',
					name: 'A',
					data: 'csA',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sA, row.csAOriginal, row.sAOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'V',
					name: 'V',
					data: 'csV',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sV, row.csVOriginal, row.sVOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'P',
					name: 'P',
					data: 'csP',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sP, row.csPOriginal, row.sPOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '行业',
					name: 'industry',
					data: 'industry',
					width: '150px',
					render(data, type, row, meta) {
						if (row.allIndustryFlag == '1') {
							return data;
						}
						var result = [];
						var datas = data && data.split(',');
						$.each(datas, (dindex, dvlobj) => {
							$.each(industryData, (index, vlobj) => {
								if (vlobj.value == dvlobj) {
									result.push(vlobj.label);
								}
							});
						});
						return result;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '具体事项说明',
					name: 'description',
					data: 'description',
					width: '150px'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '是否必须',
					name: 'required',
					data: 'required',
					render(data, type, row, meta) {
						return DicVal2Nm(data, 'boolean');
					},
					width: '150px'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '创建人',
					name: 'createUser',
					data: 'createUser',
					render(data, type, row, meta) {
						return row.__ucreateUser.userName;
					},
					width: '150px'
				}]
			}
		}
		, editAuditprogramFormSider: null
		, editAuditprogramFormCfg: {
			component: {
				'ecavp-comp': ecavpComp
			},
			options: {
				propsData: {
					jsonData: {
						autoId: null,
						customerId: null,
						eindexId: '',
						edgName: '',
						eprogramName: '',
						econfirmStatus: '',
						programNameAft: '',
						confirmationAft: '',
						ecsE: false,
						ecsC: false,
						ecsA: false,
						ecsV: false,
						ecsP: false,
						esE: '',
						esC: '',
						esA: '',
						esV: '',
						esP: ''
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 2,
			id: 'editAuditprogramForm',
			data() {
				return {
					/**
					 * 表单提交ajax 配置
					 */
					ajaxConfig: {
						type: 'POST',
						url: 'dgCenter/DgMain.editProgram.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#auditProgramTable').DataTable().ajax.reload();
								page.editAuditprogramFormSider.hide();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					}
				};
			},
			computed: {
				checkboxGroupClass() {
					if (this.formItem.econfirmGrop.readonly == true) {
						return 'css-input css-input-disabled css-checkbox css-checkbox-primary control-label';
					}
					return 'css-input css-checkbox css-checkbox-primary control-label';
				},
				scoreReadonly() {
					return this.formItem.econfirmGrop.readonly;
				}
			},
			methods: {
				/**
				 * 提交编辑画面表单
				 */
				onSaveAudtiprogramClick(evt) {
					let param = this.jsonData;
					//$.each(this.jsonData);
					this.ajaxConfig.url = 'dgCenter/DgMain.editProgram.json';
					param.programNameAft = this.jsonData.eprogramName;
					param.confirmStatusAft = this.jsonData.econfirmStatus;
					param.confirmStatusAftName = $('#econfirmStatus').val();

					param.csE = page.booleanTranslate(this.jsonData.ecsE, true);
					param.csC = page.booleanTranslate(this.jsonData.ecsC, true);
					param.csA = page.booleanTranslate(this.jsonData.ecsA, true);
					param.csV = page.booleanTranslate(this.jsonData.ecsV, true);
					param.csP = page.booleanTranslate(this.jsonData.ecsP, true);

					param.sE = this.jsonData.esE;
					param.sC = this.jsonData.esC;
					param.sA = this.jsonData.esA;
					param.sV = this.jsonData.esV;
					param.sP = this.jsonData.esP;
					/*
					this.jsonData.eprogramName = null;
					this.jsonData.econfirmStatus = null;
					this.jsonData.eindexId = null;
					this.jsonData.edgName = null;

					this.jsonData.ecsE = null;
					this.jsonData.ecsC = null;
					this.jsonData.ecsA = null;
					this.jsonData.ecsV = null;
					this.jsonData.ecsP = null;

					this.jsonData.esE = null;
					this.jsonData.esC = null;
					this.jsonData.esA = null;
					this.jsonData.esV = null;
					this.jsonData.esP = null;*/

					let flag = ['E', 'C', 'A', 'V', 'P'].map(val => {
						if (param['cs' + val] == 1) {
							return (param['s' + val] && param['s' + val] != '' && param['s' + val] > 0.00);
						} else {
							return ((!param['s' + val] || param['s' + val] == '') || (param['s' + val] > 0.00 || param['s' + val] < 0.00));
						}
					}).filter(val => val === false);
					if (flag.length > 0) {
						this.$form.vail();
						return;
					}
					this.submit(true, {jsonData: JSON.stringify(param)});
				},
				/**
				 * 关闭取消编辑
				 */
				onCancelClick(evt) {
					page.editAuditprogramFormSider.hide();
				}
			},
			buttons: [{
				id: 'saveAudtiprogramBtn',
				icon: 'fa-floppy-o',
				style: 'btn-primary',
				text: '保存',
				typeAttr: {
					'v-on:click': 'onSaveAudtiprogramClick'
				}
			}, {
				id: 'cancelEditProgramtBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'v-on:click': 'onCancelClick'
				}
			}],
			items: [{
				id: 'edgName',
				type: 'input',
				label: '程序名称',
				rowspan: 1,
				colspan: 1,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'eindexId',
				type: 'input',
				label: '索引号',
				colspan: 1,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'eprogramName',
				type: 'textarea',
				label: '程序内容',
				rowspan: 1,
				colspan: 2,
				typeAttr: {
					rows: 5
				},
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'econfirmGrop',
				html: `
					<div class="form-material"><label>认定</label></div>
					<div class="row">
					<ecavp-comp :prefixed="'e'" :label-name="'E'" :ecs-val="jsonData.ecsE" :es-val="jsonData.esE" :group-readonly="formItem.econfirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="'e'" :label-name="'C'" :ecs-val="jsonData.ecsC" :es-val="jsonData.esC" :group-readonly="formItem.econfirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="'e'" :label-name="'A'" :ecs-val="jsonData.ecsA" :es-val="jsonData.esA" :group-readonly="formItem.econfirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="'e'" :label-name="'V'" :ecs-val="jsonData.ecsV" :es-val="jsonData.esV" :group-readonly="formItem.econfirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="'e'" :label-name="'P'" :ecs-val="jsonData.ecsP" :es-val="jsonData.esP" :group-readonly="formItem.econfirmGrop.readonly"></ecavp-comp>
					</div></div>
				`,
				rowspan: 1,
				colspan: 2,
				readonly: false
			}]
		}
		, editAuditprogramForm: null
		, editSubProgramSider: null
		, editSubProgramForm: null
		, editSubProgramFormCfg: {
			options: {
				propsData: {
					jsonData: {
						autoId: null,
						customerId: null,
						projectId: null,
						subjecttreeId: null,
						parentId: null,
						level: 1,
						pindexId: '',
						es_indexId: '',
						es_dgName: '',
						es_programNameAft: '',
						es_csE: false,
						es_csC: false,
						es_csA: false,
						es_csV: false,
						es_csP: false,
						es_sE: '',
						es_sC: '',
						es_sA: '',
						es_sV: '',
						es_sP: '',
						workpaperId: null
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 2,
			id: 'editSubProgramForm',
			data() {
				return {
					/**
					 * 表单提交ajax 配置
					 */
					ajaxConfig: {
						type: 'POST',
						dataType: 'json',
						success(data) {
						}
					},
					process: ''
				};
			},
			computed: {
				checkboxGroupClass() {
					if (this.formItem.es_confirmGrop.readonly == true) {
						return 'css-input css-input-disabled css-checkbox css-checkbox-primary control-label';
					}
					return 'css-input css-checkbox css-checkbox-primary control-label';
				},
				scoreReadonly() {
					return this.formItem.es_confirmGrop.readonly;
				},
				indexIdStyle() {
					if (this.process == 'edit') {
						return 'display: inline-block;width: 100%;float: right;';
					}
					return 'display: inline-block;width: 50%;float: right;';
				},
				pindexIdShow() {
					return this.process == 'add';
				}
			},
			methods: {
				/**
				 * 提交编辑画面表单
				 */
				onSaveSubProgramClick(evt) {
					if (!this.$form.valid()) {
						return;
					}

					if (this.process == 'add') {
						this.ajaxConfig.url = 'dgCenter/DgMain.addCusAuditProgram.json';
						this.jsonData.es_indexId = this.jsonData.pindexId + '-' + this.jsonData.es_indexId;
					} else if (this.process == 'edit') {
						this.ajaxConfig.url = 'dgCenter/DgMain.updateCusAuditProgram.json';
					}

					/*this.jsonData.es_csE = page.booleanTranslate(this.jsonData.es_csE, true);
					this.jsonData.es_csC = page.booleanTranslate(this.jsonData.es_csC, true);
					this.jsonData.es_csA = page.booleanTranslate(this.jsonData.es_csA, true);
					this.jsonData.es_csV = page.booleanTranslate(this.jsonData.es_csV, true);
					this.jsonData.es_csP = page.booleanTranslate(this.jsonData.es_csP, true);*/

					var param = {};
					$.each(this.jsonData, (key, value) => {
						let key_ = key.replace('es_', '');
						param[key_] = value;
						if (key_.startsWith('cs')) {
							param[key_] = page.booleanTranslate(value, true);
						}
					});

					let flag = ['E', 'C', 'A', 'V', 'P'].map(val => {
						if (param['cs' + val] == 1) {
							return (param['s' + val] && param['s' + val] != '' && param['s' + val] > 0.00);
						} else {
							return ((!param['s' + val] || param['s' + val] == '') || (param['s' + val] > 0.00 || param['s' + val] < 0.00));
						}
					}).filter(val => val === false);
					if (flag.length > 0) {
						this.$form.vail();
						return;
					}
					//this.$form.vail();
					$.ajax({
						type: 'post',
						url: this.ajaxConfig.url,
						//async : false,
						data: {
							jsonData: JSON.stringify(param),
							param1 : _data.extraOptions.tbSubjectId
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								page.editSubProgramSider.hide();
								$('#auditProgramTable').DataTable().ajax.reload();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});

				},
				/**
				 * 关闭取消编辑
				 */
				onCancelClick(evt) {
					page.editSubProgramSider.hide();
				}
			},
			/*buttons: [{
				id: 'saveSubProgramClickBtn',
				icon: 'fa-floppy-o',
				style: 'btn-success',
				text: '保存',
				typeAttr: {
					'v-on:click': 'onSaveSubProgramClick'
				}
			}, {
				id: 'cancelSubProgramClicktBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'v-on:click': 'onCancelClick'
				}
			}],*/
			items: [
				{
					id: 'saveSubProgramClickBtn',
					type: 'button',
					rowspan: 1,
					colspan: 2,
					typeAttr: {
						'v-on:click': 'onSaveSubProgramClick',
						'style': 'float: right; margin-top: 5px;color: #fff; background-color: #5c90d2; border-color: #3675c5;border-radius: 2px;'
					}
				}, {
					id: 'cancelSubProgramClicktBtn',
					type: 'button',
					colspan: 2,
					typeAttr: {
						'v-on:click': 'onCancelClick',
						'style': 'float: right; margin-top: 5px;color: #fff; background-color: #f3b760; border-color: #f3b760;border-radius: 2px;'
					}
				},
				{
					id: 'es_dgName',
					rowspan: 1,
					colspan: 1,
					html: '<div class="has-success"><div class="form-material">'
						+ '<input type="text"'
						+ ' v-model="jsonData.es_dgName"'
						+ ' :readonly="formItem.es_dgName.readonly"'
						+ 'data-toggle="tooltip" data-placement="top" title="" autocomplete="off" id="es_dgName" name="es_dgName"'
						+ 'class="form-control valid" aria-invalid="false">'
						+ '<label for="es_dgName">程序名称<span class="necessary">*</span></label>'
						+ '</div></div>',
					validate: {
						rules: {
							required: true
						}
					}
				}, {
					id: 'es_indexId',
					colspan: 1,
					html: '<div class="has-success"><div class="form-material">'
						+ '	<input type="text"'
						+ '		v-model="jsonData.es_indexId"'
						+ '		data-toggle="tooltip"'
						+ '		data-placement="top"'
						+ '		title="" autocomplete="off"'
						+ '		id="es_indexId" name="es_indexId"'
						+ '		:readonly="formItem.es_indexId.readonly"'
						+ '		class="form-control valid"'
						+ '		aria-invalid="false"'
						+ '		v-bind:style="indexIdStyle"'
						+ '		placeholder="自动生成"'
						+ '	>'
						+ '	<span v-show="pindexIdShow" style="display: inline-block;float: right;padding: 6px 0px;line-height: 22px;text-align: right;">'
						+ '	{{jsonData.pindexId}}-</span>'
						+ '	<label for="es_indexId">索引号<span class="necessary">*</span></label>'
						+ '</div></div>',
					typeAttr: {
						readonly: true
					},
					validate: {
						rules: {
							//required : true
						}
					},
					readonly: true
				}, {
					id: 'es_programNameAft',
					type: 'textarea',
					label: '程序内容',
					rowspan: 1,
					colspan: 2,
					typeAttr: {
						rows: 5
					},
					validate: {
						rules: {
							required: true
						}
					}
				}, {
					id: 'es_confirmGrop',
					html: `
					<div class="form-material"><label>认定</label></div>
					<ecavp-comp :prefixed="'es_'" :label-name="'E'" :ecs-val="jsonData.es_csE" :es-val="jsonData.es_sE" :group-readonly="formItem.es_confirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="'es_'" :label-name="'C'" :ecs-val="jsonData.es_csC" :es-val="jsonData.es_sC" :group-readonly="formItem.es_confirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="'es_'" :label-name="'A'" :ecs-val="jsonData.es_csA" :es-val="jsonData.es_sA" :group-readonly="formItem.es_confirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="'es_'" :label-name="'V'" :ecs-val="jsonData.es_csV" :es-val="jsonData.es_sV" :group-readonly="formItem.es_confirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="'es_'" :label-name="'P'" :ecs-val="jsonData.es_csP" :es-val="jsonData.es_sP" :group-readonly="formItem.es_confirmGrop.readonly"></ecavp-comp>
					</div>
				`,
					rowspan: 1,
					colspan: 2,
					readonly: false
				}
			],
			watch: {
				/**
				 * 处理编辑画面状态更新
				 */
				process(newValue, oldValue) {
					this.formItem.es_dgName.readonly = false;
					if(oldValue == ''){
						if(this.jsonData.workpaperId != undefined && this.jsonData.workpaperId != ''){
							this.formItem.es_dgName.readonly = true;
						}
					}
				}
			}
		}
		, searchFormCfg: {
			options: {
				propsData: {
					jsonData: {
						s_departmentId: '',
						s_programName: '',
						s_subjectName: '',
						s_confirmStatus: '',
						s_stage: '',
						s_industry: '',
						s_dgName: '',
						s_indexId: '',
						s_confirmStatus: ''
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 4,
			id: 'searchForm',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: '',
						dataType: 'json',
						success(data) {
						}
					}
				};
			},
			items: [
				{
					id: 's_departmentId',
					type: 'treecombo',
					label: '机构部门',
					rowspan: 1,
					colspan: 1,
					plugin: {
						name: 'treecombo',
						options: {
							url: './base/TreeCommon.findDepartTree.json',
							params: {},
							view: {
								leafIcon: 'fa fa-building text-flat',
								nodeIcon: 'fa fa-bank text-primary-light',
								folderSelectable: true,
								multiSelect: false
							}
						}
					}
				}, {
					id: 's_dgName',
					type: 'input',
					label: '程序名称',
					colspan: 1
				}, {
					id: 's_programName',
					type: 'input',
					label: '程序内容',
					colspan: 1
				}, {
					id: 's_indexId',
					type: 'input',
					label: '索引号',
					colspan: 1
				}, {
					id: 's_subjectName',
					type: 'input',
					label: '标准科目',
					rowspan: 1,
					colspan: 1
				}, {
					id: 's_industry',
					type: 'input',
					label: '行业',
					colspan: 1
				}, {
					id: 's_stage',
					type: 'input',
					label: '阶段',
					colspan: 1
				}, {
					id: 's_confirmStatus',
					type: 'input',
					label: '认定',
					colspan: 1
				}
			]
		}
		, searchForm: null
		, getDefaultFilter() {
			return {
				menuId: window.sys_menuId,
				sqlId: 'DG00009'
			};
		}
		, booleanTranslate(value, flag) {
			return (!flag ? value == '1' : (value == true ? '1' : '0'));
		}
		, setSummery(data) {
			$('#summeryE').empty().text(this.getNullVal(data.pplansE, 0));
			$('#summeryC').empty().text(this.getNullVal(data.pplansC, 0));
			$('#summeryA').empty().text(this.getNullVal(data.pplansA, 0));
			$('#summeryV').empty().text(this.getNullVal(data.pplansV, 0));
			$('#summeryP').empty().text(this.getNullVal(data.pplansP, 0));

			$('#subjectE').empty().text(this.getNullVal(data.splansE, 0));
			$('#subjectC').empty().text(this.getNullVal(data.splansC, 0));
			$('#subjectA').empty().text(this.getNullVal(data.splansA, 0));
			$('#subjectV').empty().text(this.getNullVal(data.splansV, 0));
			$('#subjectP').empty().text(this.getNullVal(data.splansP, 0));

			$('#implE').empty().text(this.getNullVal(data.implE, 0));
			$('#implC').empty().text(this.getNullVal(data.implC, 0));
			$('#implA').empty().text(this.getNullVal(data.implA, 0));
			$('#implV').empty().text(this.getNullVal(data.implV, 0));
			$('#implP').empty().text(this.getNullVal(data.implP, 0));


			var setClass = (a, b, ch) => {
				let $el = $('#' + ch);
				if (a != b) {
					$el.addClass('ecavp-different');
				} else {
					$el.removeClass('lightpink');
					$el.removeClass('ecavp-different');
				}
			};

			setClass(data.pplansE, data.splansE, 'summeryE');
			setClass(data.pplansC, data.splansC, 'summeryC');
			setClass(data.pplansA, data.splansA, 'summeryA');
			setClass(data.pplansV, data.splansV, 'summeryV');
			setClass(data.pplansP, data.splansP, 'summeryP');

			setClass(data.pplansE, data.implE, 'implE');
			setClass(data.pplansC, data.implC, 'implC');
			setClass(data.pplansA, data.implA, 'implA');
			setClass(data.pplansV, data.implV, 'implV');
			setClass(data.pplansP, data.implP, 'implP');
		}
		, apply(obj, data) {
			$.each(data, (key, value) => {
				obj[key] = value;
			});
		}
		, getNullVal(val, dufaultVal) {
			return val == null || val == undefined || val == '' ? dufaultVal : val;
		}
	});
	return page;
}

