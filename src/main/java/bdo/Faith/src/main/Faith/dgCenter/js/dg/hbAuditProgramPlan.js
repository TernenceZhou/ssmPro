/**
 * 审计程序页面
 */
function HbAuditProgramPagePlan(agrs) {
	let _data = agrs.data
		, _template = agrs.template || tplLoader('dgCenter/html/dg/auditProgramPlan.html')
		, getCsEditAble
		, ecavpEditComp
		, ecavpEditVm
		, ecavpEditVmCfg
		, editManEditComp
		, editNeedAuditComp
		, getConfirmStatus
		,isMergeProject
	;


	function getMn(num) {
		num = num.toFixed(2);
		num = num + '';
		if (!num.includes('.')) {
			num += '.';
		}
		return num.replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
			return $1 + ',';
		})/*.replace(/\.$/, '')*/;
	}

	agrs.template = _template;
	$(agrs.region).html(_template);

	/*$('#editButtonAll').remove();
	$('#setIdentifiedEcavpRecommendValue').remove();
	$('#subjectPlanPageTab > div.block.block-themed > div.block-header.bg-primary > div > div:nth-child(5)').remove();
	$('#exportAuditProgramPlan').remove();
	$('#editProgramPageTabLink').parent().remove();*/

	ecavpEditComp = {
		props: {
			programInfo: Object,
			ecavp: String,
			rownum: Number
		},
		data() {
			return {
				ecavpVal: false,
				score: '',
				originalScore: 0,
				originalVal: false,
				scoreCache: {},
				timer: null
			};
		},
		watch: {
			ecavpVal(newVal) {
				this.programInfo['plancs' + this.ecavp] = (newVal ? '1' : '0');
				if (this.originalVal != newVal) {
					this.$parent.updateRowMark[this.rownum] += 1;
				} else {
					this.$parent.updateRowMark[this.rownum] -= 1;
				}
				if (this.$parent.updateRowMark[this.rownum] < 0) {
					this.$parent.updateRowMark[this.rownum] = 0;
				}
				if (newVal == 0) {
					this.score = null;
					if (this.originalVal != newVal) {
						this.saveChange();
					}
				}
			},
			score(newVal) {
				if (!this.ecavpVal) {
					this.score = null;
					return;
				}
				if (this.scoreCache[this.score] > 0) {
					this.saveChange();
					return;
				}
				let mscore = newVal;
				mscore = (mscore + '').replace(/[^\d.]/g, '');
				mscore = (mscore + '').replace(/\.{2,}/g, '.');
				mscore = (mscore + '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
				mscore = (mscore + '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

				if ((mscore + '').indexOf('.') < 0 && (mscore + '') != '') {
					mscore = parseFloat(mscore);
				}
				if (parseFloat(mscore) > 3) {
					mscore = 3;
				}
				this.programInfo['plans' + this.ecavp] = mscore;
				if (this.originalScore != (mscore == '' ? null : mscore)) {
					this.$parent.updateRowMark[this.rownum] += 1;
				} else {
					this.$parent.updateRowMark[this.rownum] -= 1;
				}
				if (this.$parent.updateRowMark[this.rownum] < 0) {
					this.$parent.updateRowMark[this.rownum] = 0;
				}
				this.score = mscore;
				if (!this.scoreCache[this.score]) this.scoreCache[this.score] = 1;
				(this.originalScore != (mscore == '' ? null : mscore)) && this.saveChange();
			}
		},
		computed: {
			scoreCheckClass() {
				if(this.score != this.programInfo['subjectScore' + this.ecavp]) {
					return 'subject-score-diff'
				}
				return '';
			},
			labelClass() {
				let colorClass = 'css-checkbox-primary';
				if(this.scoreCheckClass != '') {
					colorClass = 'css-checkbox-danger';
				}
				let result = ['css-input', 'css-checkbox', 'control-label', colorClass];
				if (this.editEcavpVal) {
					result.push('css-input-disabled');
				}

				return result;
			},
			scoreClass() {
				return ['form-control text-center'];
			},
			editScore() {
				return !this.ecavpVal;
			},
			editEcavpVal() {
				return this.programInfo.isNeedToAudit == '1' && this.programInfo.tbSubject > '' ? false : true;
			}
		},
		mounted() {
			this.initEcavp();
		},
		methods: {
			initEcavp() {
				this.originalScore = this.programInfo['plans' + this.ecavp];
				this.originalVal = (this.programInfo['plancs' + this.ecavp] == 1 ? true : false);
				this.ecavpVal = this.originalVal;
				this.score = this.originalScore;
			},
			saveChange() {
				if (this.originalScore == this.score && this.originalVal == this.ecavpVal) {
					return;
				}
				if ((this.ecavpVal && this.score === '')) {
					return;
				}
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}

				let autoId = this.programInfo.autoId;
				let score = this.score;
				let ecavpVal = '1';
				let ch = this.ecavp;
				let $this = this;
				if (!this.ecavpVal) {
					ecavpVal = '0';
					score = '';
				}
				this.timer = setTimeout(function() {
					$this = this;
					$.ajax({
						url: 'dgCenter/DgMain.updateIdentifiedScore.json',
						dataType: 'json',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: autoId,
							param2: score,
							param3: ch,
							param4: ecavpVal
						},
						bdolxLoader: false
					}).done(function(data) {
						if (data.success) {
							$this.originalScore = score;
							$this.originalVal = ecavpVal;
							OneUI.notifySuccess('保存成功！');
						} else {
							OneUI.notifyError(data.resultInfo.statusText);
							$this.ecavpVal = $this.originalVal;
							$this.score = $this.originalScore;
						}
					});
					clearTimeout(this.timer);
					this.timer = null;
				}.bind(this), 1000);
			}
		},
		template: '<div :class="scoreCheckClass">'
			+ '	<label :class="labelClass" >'
			+ '		<input type="checkbox" v-model="ecavpVal" :disabled="editEcavpVal">'
			+ '		<span></span>'
			+ '	</label>'
			+ '	<div class="has-success">'
			+ '		<div class="form-material">'
			+ '			<input :class="scoreClass" type="text" v-model="score" :disabled="editScore">'
			+ '		</div>'
			+ '	</div>'
			+ '</div>'
	};
	editManEditComp = {
		props: {
			programInfo: Object,
			rownum: Number,
			currentValue: String,
			datas: Array
		},
		data() {
			return {
				editMan: this.currentValue,
				editManCach: this.currentValue,
				timer: null
			};
		},
		watch: {
			editMan(newVal) {
				this.programInfo.subjectEditors = newVal;
				if (this.currentValue != newVal) {
					this.$parent.updateRowMark[this.rownum] += 1;
				} else {
					this.$parent.updateRowMark[this.rownum] -= 1;
				}
				if (this.$parent.updateRowMark[this.rownum] < 0) {
					this.$parent.updateRowMark[this.rownum] = 0;
				}
				let data  = this.datas;
				let name;
				data.map(function (item) {
					if (newVal == item.id) {
						name = (item.value == ""?item.text:item.value);
					}
				});
				this.saveEditMan(this.programInfo.userSubject,name);
			}
		},
		computed: {
			editManDisabled() {
				return (this.programInfo.tbSubject && this.programInfo.isNeedToAudit == '1' ? (CUR_USERID != JSON.parse($.sessionStorage('projectManager')) && JSON.parse($.sessionStorage('projectManager')) != undefined ? true : false) : true);
			}
		},
		mounted() {
		},
		methods: {
			saveEditMan(obj,name) {
				if (this.editManCach === this.editMan) {
					return;
				}
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				this.timer = setTimeout(function() {
					let $this = this;
					$.ajax({
						url: 'dgCenter/DgMain.updateIdentifiedEditor.json',
						dataType: 'json',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: $this.programInfo.autoId,
							param2: $this.editMan,
							param3: obj,
							param4: name
						},
						bdolxLoader: false
					}).done(function(data) {
						if (data.success) {
							$this.editManCach = $this.editMan;
							OneUI.notifySuccess('保存成功！');
						} else {
							$this.editMan = $this.editManCach;
							OneUI.notifyError(data.resultInfo.statusText);
						}
					});
					clearTimeout(this.timer);
					this.timer = null;
				}.bind(this), 1000);
			}
		},
		template: '<div class="form-material">'
			+ '	<select class="form-control" v-model="editMan" style="margin-left:5px" :disabled="editManDisabled">'
			+ '		<option v-for="(data, index) in datas" :value="data.id">{{ data.text }}</option>'
			+ '	</select>'
			+ '</div>'
	};
	editNeedAuditComp = {
		props: {
			programInfo: Object,
			isNeedToAudit: String,
			rownum: Number
		},
		data() {
			return {
				isNeedToAuditVal: false,
				originalVal: false,
				valCache: {},
				timer: null
			};
		},
		watch: {
			isNeedToAuditVal(newVal) {
				this.programInfo.isNeedToAudit = (newVal ? '1' : '0');
				if (this.originalVal != newVal) {
					this.$parent.updateRowMark[this.rownum] += 1;
				} else {
					this.$parent.updateRowMark[this.rownum] -= 1;
				}
				if (this.$parent.updateRowMark[this.rownum] < 0) {
					this.$parent.updateRowMark[this.rownum] = 0;
				}
				if (this.originalVal != this.programInfo.isNeedToAudit) {
					this.saveChange();
				}
			}
		},
		computed: {
			checkClass() {
				return '';
			},
			labelClass() {
				let colorClass = 'css-checkbox-primary';
				if (this.checkClass != '') {
					colorClass = 'css-checkbox-danger';
				}
				let result = ['css-input', 'css-checkbox', 'control-label', colorClass];
				if (this.editIsNeedToAuditVal) {
					result.push('css-input-disabled');
				}

				return result;
			},
			editIsNeedToAuditVal() {
				return this.programInfo.isEditable == 1 ? false : true;
				//return (this.programInfo.tbSubject ? false : true);
			}
		},
		mounted() {
			this.initVal();
		},
		methods: {
			initVal() {
				this.originalVal = this.programInfo['isNeedToAudit'] == 1 ? true : false;
				this.isNeedToAuditVal = this.originalVal;
			},
			saveChange() {
				if (this.isNeedToAuditVal == this.originalVal) {
					return;
				}
				let resetProgram = '0';

				let promise = new Promise((resolve, reject) => {
					if (this.isNeedToAuditVal) {
						resetProgram = '0';
						resolve({});
					} else {
						bdoConfirmBox('提示', '确认不编制该科目?', isConfirm => {
							if (isConfirm) {
								let $this = this;
								let rowData = $('#subjectPlanTable').dataTable().fnGetData($this.rownum);
								if(rowData.remain != 0 || rowData.debitTotalOcc != 0
										|| rowData.creditTotalOcc != 0 || rowData.balance != 0){
									$('#notAuditReasonsModal_autoId').val(rowData.autoId);
									$('#notAuditReasonsModal_isNeedToAudit').val('0');
									$('#notAuditReasonsText').val(rowData.notAuditReasons);
									$('#notAuditReasonsModal').find('button[data-dismiss="modal"]').parent().hide();
									$('#notAuditReasonsModal').modal('show');
								}else{
									resetProgram = '1';
									resolve({});
								}
							} else {
								resetProgram = '0';
								resolve({});
							}
						}, () => {
							resetProgram = '0';
							resolve({});
						});
					}
				});
				promise.then((data) => {
					if (this.timer) {
						clearTimeout(this.timer);
						this.timer = null;
					}

					let autoId = this.programInfo.autoId;
					let isNeedToAudit = '1';

					if (!this.isNeedToAuditVal) {
						isNeedToAudit = '0';
					}
					let $this = this;
					this.timer = setTimeout(function() {
						//$this = this;
						$.ajax({
							url: 'dgCenter/DgSubjectIdentify.updateHbIdentifiedNeedAudit.json',
							dataType: 'json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: autoId,
								param2: isNeedToAudit
							},
							bdolxLoader: false
						}).done(function(data) {
							if (data.success) {
								$this.originalVal = $this.isNeedToAuditVal;
								$this.programInfo.isNeedToAudit = $this.isNeedToAuditVal;
								OneUI.notifySuccess('保存成功！');
								$this.$parent.updateEditAble($this.rownum, isNeedToAudit === '1');
							} else {
								OneUI.notifyError(data.resultInfo.statusText);
								$this.isNeedToAuditVal = $this.originalVal;
							}
						});
						clearTimeout(this.timer);
						this.timer = null;
					}.bind(this), 1000);
				});
			}
		},
		template: '<div >'
			+ '	<label :class="labelClass" >'
			+ '		<input type="checkbox" v-model="isNeedToAuditVal" :disabled="editIsNeedToAuditVal">'
			+ '		<span></span>'
			+ '	</label>'
			+ '</div>'
	};
	ecavpEditVmCfg = {
		el: '#subjectPlanTable tbody',
		components: {
			'score-edit': ecavpEditComp,
			'edit-man-edit': editManEditComp,
			'edit-need-audit': editNeedAuditComp
		},
		data: {
			rowData: [],
			updateRowMark: [],
			editMans: []
		},
		methods: {
			getUpateData() {
				let me = this;
				let result = [];
				$.each(this.updateRowMark, (index, val) => {
					if (val > 0) {
						result.push(me.rowData[index]);
					}
				});
				return result;
			},
			reset() {
				let me = this;
				$.each(this.$children, (index, o) => {
					o.originalVal = (o.programInfo['cs' + o.ecavp] == 1);
					o.originalScore = o.programInfo['s' + o.ecavp];
				});
				$.each(this.updateRowMark, (index, o) => {
					me.updateRowMark[index] = 0;
				});
			},
			updateEditAble(row, isEdit) {
				if (!isEdit) {
					$.each(this.$children, (index, o) => {
						let opt = o.$options;
						if (opt._componentTag == 'score-edit' && opt.propsData.rownum == row) {
							o.originalScore = 0;
							o.score = 0;
							o.originalVal = false;
							o.ecavpVal = false;
						}
						if (opt._componentTag == 'edit-man-edit' && opt.propsData.rownum == row) {
							o.editManCach = '';
							o.editMan = '';
						}
					});
				}
			}
		}
	};

	getCsEditAble = (ecavp, rownum) => {
		var result = '<score-edit :ecavp="\'' + ecavp + '\'" :program-info="rowData[' + rownum + ']" :rownum="' + rownum + '"></score-edit>';
		return result;
	};
	getEditManEdit = (value, rownum) => {
		var result = '<edit-man-edit :datas="editMans" :program-info="rowData[' + rownum + ']" :rownum="' + rownum + '" :current-value="\'' + value + '\'"></edit-man-edit>';
		return result;
	};
	getEditNeedAudit = (isNeedToAudit, rownum) => {
		var result = '<edit-need-audit :is-need-to-audit="\'' + isNeedToAudit + '\'" :program-info="rowData[' + rownum + ']" :rownum="' + rownum + '"></edit-need-audit>';
		return result;
	};
	/**
	 *  统计审计程序
	 * */
	function countProjectProgram() {
		let customerId = window.CUR_CUSTOMERID;
		let projectId = window.CUR_PROJECTID;
		if (null != $('#s_customerId option:checked').val() && $('#s_customerId option:checked').val() != '') {
			customerId = $('#s_customerId option:checked').val();
		}
		if (null != $('#s_projectId option:checked').val() && $('#s_projectId option:checked').val() != '') {
			projectId = $('#s_projectId option:checked').val();
		}
		$('#selectProjectProgramTable_length').find('label:first').nextAll().remove();
		$.ajax({
			type: 'post',
			url: 'cpBase/General.query.json',
			//url: 'dgCenter/DgMain.countProjectProgram.json',
			data: {
				sqlId: 'DG00065',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param1: customerId,
				param2: projectId,
				param10: $('#s_customerSubjectId').val()
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					let companyCount = data.data[0].companyCount == null?0:data.data[0].companyCount;
					let depCount = data.data[0].depCount == null?0:data.data[0].depCount;
					let customizeCount = data.data[0].customizeCount == null?0:data.data[0].customizeCount;
					var html = '<label style="position: relative;left: 20px;">标准审计程序:<b style="color: red;">'+companyCount+'</b></label><label style="position: relative;left: 20px;">&nbsp;&nbsp;部门审计程序:<b style="color: red;">' +depCount+'</b></label><label style="position: relative;left: 20px;">&nbsp;&nbsp;自定义审计程序：<b style="color: red;">'+customizeCount+'</b></label>';
					$('#selectProjectProgramTable_length').find('label').after(html)

				}
			}
		});
	}

	/**
	 *  可选项目生成审计程序
	 * */
	function insertProjectProgram(_data) {
		bdoInProcessingBox('请稍后，正在生成可选项目审计程序!');
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgMain.saveProjectProgram.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: $('#s_customerId option:selected').val(),
				param2: $('#s_projectId option:selected').val(),
				param3: $('#s_customerSubjectId').val()
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					bdoSuccessBox('操作成功', data.resultInfo.statusText);
					$('#spreadContentDir').trigger('rebuildTree', [{
						param1: window.CUR_PROJECTID,
						param2: window.CUR_CUSTOMERID
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
					}]);
					$('#s_customerId').val('').select2({allowClear: true, language: 'zh-CN', width: '100%', placeholder: '请选择'});
					$('#s_projectId').val('').select2({allowClear: true, language: 'zh-CN', width: '100%', placeholder: '请选择'});

					$('#s_customerId').val('').trigger('change');
					$('#s_projectId').val('').trigger('change');
					$('#s_customerSubjectId').val('');
					$('#subjectPlanTable').DataTable().ajax.reload();
				} else {
					bdoErrorBox('操作失败', data.resultInfo.statusText);
				}
			}
		});

	}

	/**
	 * 获取合并表格列
	 * type 1 subjectPlanTable 对应合并表格列
	 * type 2  selectSubjectPlanTable 对应合并表格列
	 */
	function getMergeColumnDefs(type) {
		switch (type) {
			case 1:
				return ;
			case 2:
				return;
			case 3:
				return
			default:
				return []
		}
	}

	function refTree() {
		$('#spreadContentDir').trigger('rebuildTree', [{
			param1: window.CUR_PROJECTID,
			param2: window.CUR_CUSTOMERID
		}, data => {
			$('.js-tree-collapsed').trigger('rebuild', [{
				data: [data.data[0].treeData],
				levels: (_data.deep + 1),
				callback(tree) {
					tree.expandNode(_data.nodeId, {levels: (_data.deep + 1), silent: true});
					tree.selectNode(_data.nodeId, {silent: true});
					_data = agrs.data = tree.getNode(_data.nodeId);
				}
			}]);
		}]);
		swal.close();
	}

	var page = new Page({
		random: (new Date).getTime() + parseInt(1e3 * Math.random())
		/**
		 * 根节点
		 */
		, container: agrs.region
		/**
		 * 绑定事件
		 */
		, events: {
			/*'#saveECAVPBtn': 'click,onSaveECAVPClick',*/
			'#filter': 'change,onFilterChange',
			'#filterEditor': 'change,onFilterEditorChange',
			'#exchangeSetSubjectors':'click,onExchangeSubjectEditorsClick',
			'#checkSubjectPlan':'click,onCheckSubjectPlanClick',
			'#editButtonAll': 'click,onEditAllClick',
			'#resetButtonAll': 'click,onResetAllClick',
			'#createDgAllButton': 'click,createDgAllClick',
			'#projectProgram': 'click,createProjectProgramClick',
			'#searchProjectBtn': 'click,selectProjectProgramClick',
			'#deleteDgAllButton': 'click,deleteDgAllButtonClick',
			'#exportAuditProgramPlan': 'click,onExportAuditProgramPlanClick',
			'#setIdentifiedEcavpRecommendValue': 'click,onSetIdentifiedEcavpRecommendValueBtnClick',
			'#editProgramPageTabLink': 'shown.bs.tab,OnEditProgramPageTabLinkShownBsTab',
			'#insertProjectProgram': 'click,onInsertProjectProgramClick',
			'#searchResetProjectBtn': 'click,onResetProjectProgramClick',
			'#initScheduleControl':'click,onInitScheduleControl',
			'#closeMergeAuditProgramPlanButton': 'click,closeMergeAuditProgramPlanButtonClick',
			'#submitSelect':'click,onSubmitSelect',
			'#notAuditReasonsBtn': 'click,onNotAuditReasonsBtnClick'
		}
		, _template: agrs.template || tplLoader('dgCenter/html/dg/auditProgramPlan.html')
		, _data: agrs.data
		, selectEditors: null
		, bindEvents() {
			$('#setIdentifiedEcavpRecommendValue').remove();
			
			let me = this;
			$('#subjectPlanTable').unbind('initEditVm');
			$('#subjectPlanTable').bind('initEditVm', ((event, options) => {
				event.preventDefault();
				ecavpEditVmCfg = $.extend(false, {}, ecavpEditVmCfg);
				ecavpEditVmCfg.data.editMans = page.selectEditors;
				ecavpEditVmCfg.data.rowData = $.extend(false, {}, options);
				ecavpEditVmCfg.data.updateRowMark = (() => {
					let result = [];
					for (let i = 0, len = options.length; i < len; i++) {
						result.push(0);
					}
					return result;
				})();
				ecavpEditVm = new Vue(ecavpEditVmCfg);
			}).bind(me));
			$('#subjectPlanTable').on('click', 'button.table-btn-operate[name="createDgSub"]', this.onCreateDgSub);
			$('#subjectPlanTable').on('click', 'button.table-btn-operate[name="editProgramPlan"]', this.onEditProgramPlan);
			$('#subjectPlanTable').on('click', 'button.table-btn-operate[name="repeatDgSub"]', this.onRepeatDgSub);
			$('#subjectPlanTable').on('click', 'button.table-btn-operate[name="createMergeDgSub"]', this.onCreateMergeDgSub);

			$('input[name="checkSubjectAll"]').off('click');
			$('input[name="checkSubjectAll"]').on('click',this.onCheckSubjectAll);
			$('input[name="checkBaseSubjectAll"]').off('click');
			$('input[name="checkBaseSubjectAll"]').on('click',this.onCheckBaseSubjectAll);

			$('#subjectPlanTable').on('dblclick', 'tbody td', this.onEditReasons);
		}
		, querySetting() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/MaterialitySetting.queryMater.json',
				dataType: 'json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_PROJECTID
				},
				success: function(data) {
					if (data.data != null && data.data[0].data != null) {
						var object = data.data[0].data;
						if (object.settingType == '1') {
							$('#rateA').val(getMn(object.settingImportValue1));
							/*$('#rateB').val(getMn(object.settingTypeValue1));
							$('#rateC').val(getMn(object.settingTypeValue2));*/
							//$('#rateA').val(getMn(object.settingValue1 * object.settingRate1 / 100));
							//$('#rateB').val(getMn(object.settingValue1 * object.settingRate1 * object.settingRateOne1 / 10000));
							//$('#rateC').val(getMn(object.settingValue1 * object.settingRate1 * object.settingRateOne1 * object.settingRateTwo1 / 1000000));
						} else if (object.settingType == '2') {
							$('#rateA').val(getMn(object.settingImportValue2));
							/*$('#rateB').val(getMn(object.settingTypeValue1));
							$('#rateC').val(getMn(object.settingTypeValue2));*/
							//$('#rateA').val(getMn(object.settingValue2 * object.settingRate2 / 100));
							//$('#rateB').val(getMn(object.settingValue2 * object.settingRate2 * object.settingRateOne2 / 10000));
							//$('#rateC').val(getMn(object.settingValue2 * object.settingRate2 * object.settingRateOne2 * object.settingRateTwo2 / 1000000));
						} else if (object.settingType == '3') {
							$('#rateA').val(getMn(object.settingImportValue3));
							/*$('#rateB').val(getMn(object.settingTypeValue1));
							$('#rateC').val(getMn(object.settingTypeValue2));*/
							//$('#rateA').val(getMn(object.settingValue3 * object.settingRate3 / 100));
							//$('#rateB').val(getMn(object.settingValue3 * object.settingRate3 * object.settingRateOne3 / 10000));
							//$('#rateC').val(getMn(object.settingValue3 * object.settingRate3 * object.settingRateOne3 * object.settingRateTwo3 / 1000000));
						} else if (object.settingType == '4'){
							$('#rateA').val(getMn(object.settingImportValue4));
							/*$('#rateB').val(getMn(object.settingTypeValue1));
							$('#rateC').val(getMn(object.settingTypeValue2));*/
							//$('#rateA').val(getMn(object.settingValue4 * object.settingRate4 / 100));
							//$('#rateB').val(getMn(object.settingValue4 * object.settingRate4 * object.settingRateOne4 / 10000));
							//$('#rateC').val(getMn(object.settingValue4 * object.settingRate4 * object.settingRateOne4 * object.settingRateTwo4 / 1000000));
						}else if (object.settingType == '5'){
							$('#rateA').val(getMn(object.settingImportValue5));
							/*$('#rateB').val(getMn(object.settingTypeValue1));
							$('#rateC').val(getMn(object.settingTypeValue2));*/
							//$('#rateA').val(getMn(object.settingValue4 * object.settingRate4 / 100));
							//$('#rateB').val(getMn(object.settingValue4 * object.settingRate4 * object.settingRateOne4 / 10000));
							//$('#rateC').val(getMn(object.settingValue4 * object.settingRate4 * object.settingRateOne4 * object.settingRateTwo4 / 1000000));
						}else if (object.settingType == '6'){
							$('#rateA').val(getMn(object.settingImportValue6));
							/*$('#rateB').val(getMn(object.settingTypeValue1));
							$('#rateC').val(getMn(object.settingTypeValue2));*/
							//$('#rateA').val(getMn(object.settingValue4 * object.settingRate4 / 100));
							//$('#rateB').val(getMn(object.settingValue4 * object.settingRate4 * object.settingRateOne4 / 10000));
							//$('#rateC').val(getMn(object.settingValue4 * object.settingRate4 * object.settingRateOne4 * object.settingRateTwo4 / 1000000));
						}
						$('#rateB').val(getMn(object.finalSettingTypeValue1));
						$('#rateC').val(getMn(object.finalSettingTypeValue2));
					} else {
						$('#rateA').val(0);
						$('#rateB').val(0);
						$('#rateC').val(0);
					}
				}
			});
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
							if (item.name != null && item.id != ""){
								jsonArr += '<option value="' + item.id+ '" style="color: #000">' + item.name + '</option>';
							}

						});
						$('#filterEditor').html(jsonArr);
						$('#filterSubjectEditor').html(jsonArr);
					}
				}
			});
		}
		, ECAVP_CONSTS: ['E', 'C', 'A', 'V', 'P']
		, onSaveECAVPClick(event) {
			if (CUR_USERID != JSON.parse($.sessionStorage('projectManager')) && JSON.parse($.sessionStorage('projectManager')) != undefined) {
				bdoInfoBox('', '只有当前项目负责人才能编辑科目编制人!');
			} else {
				let data = ecavpEditVm.getUpateData();
				if (data.length < 1) {
					bdoInfoBox('', '没有修改数据！');
					return;
				}
				let checkFlag = true;
				let errorItem = {};
				let errorCh = '';
				let param = data.map(item => {
					$.each(page.ECAVP_CONSTS, (index, ch) => {
						let s = item['plans' + ch];
						let cs = item['plancs' + ch];
						if (checkFlag && cs == 1 && (s == '' || !s || parseFloat(s).toFixed(2) == 0.00.toFixed(2))) {
							checkFlag = false;
							errorItem = item;
							errorCh = ch;
						}
					});
					return {
						autoId: item.autoId,
						projectId: item.projectId,
						customerId: item.customerId,
						plansE: item.plansE,
						plansC: item.plansC,
						plansA: item.plansA,
						plansV: item.plansV,
						plansP: item.plansP,
						plancsE: item.plancsE,
						plancsC: item.plancsC,
						plancsA: item.plancsA,
						plancsV: item.plancsV,
						plancsP: item.plancsP,
						subjectEditors: item.subjectEditors
					};
				});
				if (!checkFlag) {
					bdoErrorBox('保存失败', 'TB科目【' + errorItem.tbSubject + '】' + '客户科目【' + errorItem.userSubject + '】的' + '认定（' + errorCh + '）没有设置分值！');
					return;
				}
				$.ajax({
					type: 'post',
					url: 'dgCenter/dgMain.updatePlanScore.json',
					async: true,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: JSON.stringify(param)
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#subjectPlanTable').DataTable().ajax.reload();
							ecavpEditVm.reset();
							bdoSuccessBox('保存成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('保存失败', data.resultInfo.statusText);
						}
					}
				});
			}
		},
		onEditAllClick(event) {
			$("#editButtonAll").blur();
			var table = $('#subjectPlanTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			let reArray = [];//未对照过的科目

			$.each(rowData, function(i, item) {
				if (rowData[i].tbSubject == null || rowData[i].tbSubject == '') {
					reArray.push(rowData[i].userSubject);
					//$('#createDgAllButton').attr('disabled',true)
				}
			});

			$('#auditProgramList').empty();
			//页面modal显示未对照过的所有科目
			$.each(reArray, function(j, item) {
				let div = '<label>客户科目：</label><label>' + reArray[j] + '</label><br/>';
				$('#auditProgramList').append(div);
			});
			$('#auditProgramPlanModal').modal('show');
		},
		deleteDgAllButtonClick(event) {
			$('#auditProgramList').empty();
		},
		createDgAllClick(event) {
			var table = $('#subjectPlanTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			let createDgArray = [];
			let array = [];//已对照过的科目

			$.each(rowData, function(i, item) {
				if (rowData[i].userSubject != null && rowData[i].userSubject != '' && rowData[i].tbSubject != null && rowData[i].tbSubject != '') {
					array.push(rowData[i]);
				}
			});

			$.each(array, function(k, item) {
				createDgArray.push({
					param1: '002',
					param2: window.CUR_PROJECTID,
					param3: window.CUR_CUSTOMERID,
					param4: array[k].tbSubjectName,
					param5: array[k].tbSubjectCode,
					param6: array[k].tbSubjectCode,
					param9: array[k].autoId,
					param10: window.CUR_PROJECT_ACC_YEAR
				});
			});
			bdoInProcessingBox('请稍后，正在批量生成审计程序!');
			function success() {
				$('#spreadContentDir').trigger('rebuildTree', [{
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID
				}, data => {
					$('.js-tree-collapsed').trigger('rebuild', [{
						data: [data.data[0].treeData],
						levels: (_data.deep + 1),
						callback(tree) {
							tree.expandNode(_data.nodeId, {levels: (_data.deep + 1), silent: true});
							tree.selectNode(_data.nodeId, {silent: true});
							_data = agrs.data = tree.getNode(_data.nodeId);
						}
					}]);
				}]);
				$('#subjectPlanTable').DataTable().ajax.reload();
				$('#auditProgramPlanModal').modal('hide');
				swal.close();
			}
			let isRefresh = false;
			setTimeout(()=>{
				isRefresh || success();
			}, 60*1000);
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgMain.createDgTreeAll.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param13: JSON.stringify(createDgArray)
				},
				dataType: 'json',
				bdolxLoader: false,
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('操作成功', data.resultInfo.statusText);
						isRefresh = true;
						success();
					} else {
						bdoErrorBox('操作失败', data.resultInfo.statusText);
					}
				}
			});
		},
		createProjectProgramClick(event) {

			let flag = true;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async : false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00197',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(CUR_USERID != data.data[0].manager){
							bdoErrorBox('',"无权限！");
							flag = false;
						}
					}
				}
			});

			$('#auditProgramPlanModal').modal('hide');
			page.searchProjectForm.jsonData = {
				s_customerId: '',
				s_projectId: '',
				s_customerSubjectId: ''
			};

			page.selectProjectProgramSider.show();
			page.selectProjectProgramTableCfg.localParam.urlparam = page.getDefaultFilter();
			page.selectProjectProgramTableCfg.localParam.urlparam.param11 = window.CUR_CUSTOMERID;
			page.selectProjectProgramTableCfg.localParam.urlparam.param12 = window.CUR_PROJECTID;
			page.selectProjectProgramTableCfg.localParam.urlparam.param13 = window.CUR_CUSTOMERID;
			page.selectProjectProgramTableCfg.localParam.urlparam.param14 = window.CUR_PROJECTID;

			$('#s_customerId').val('').select2({allowClear: true,language: 'zh-CN',width: '100%',placeholder: '请选择'});
			$('#s_projectId').val('').select2({allowClear: true,language: 'zh-CN',width: '100%',placeholder: '请选择'});

			$('#s_customerId').val('').trigger('change');
			$('#s_projectId').val('').trigger('change');
			$('#s_customerSubjectId').val('');

			$.ajax({
				type: 'post',
				url: 'cpBase/Combo.getCustomerList.json',
				data: {
					page: -1,
					start: -1
				},
				dataType: 'json',
				async: true,
				success: function(data) {
					let customerData = data.data;
					$('#s_customerId').empty();
					$('#s_customerId').append($('<option>', {value: '', text: ''}));
					$.each(customerData, function(i, item) {
						$('#s_customerId').append($('<option>', {value: item.value, text: item.label}));
					});
				}
			});

			$('#s_customerId').change(function() {
				$.ajax({
					type: 'post',
					url: 'cpBase/Combo.getCustomerProjectList.json',
					data: {
						param1: $('#s_customerId option:selected').val(),
						page: -1,
						start: -1
					},
					dataType: 'json',
					async: true,
					success: function(data) {
						$('#s_projectId').empty();
						$.each(data.data, function(i, item) {
							$('#s_projectId').append($('<option>', {value: item.value, text: item.label}));
						});
					}
				});
			});

			if (flag){
				BdoDataTable('selectProjectProgramTable', page.selectProjectProgramTableCfg);
				countProjectProgram();
				uiBlocksApi($('.block .block-themed .block-opt-hidden'), "content_toggle");
			}

		},
		selectProjectProgramClick(event) {
			page.selectProjectProgramTableCfg.localParam.urlparam = page.getDefaultFilter();
			if (null == $('#s_customerId option:checked').val() || $('#s_customerId option:checked').val() == '') {
				page.selectProjectProgramTableCfg.localParam.urlparam.param11 = window.CUR_CUSTOMERID;
			} else {
				page.selectProjectProgramTableCfg.localParam.urlparam.param11 = $('#s_customerId option:checked').val();
			}
			if (null == $('#s_projectId option:checked').val() || $('#s_projectId option:checked').val() == '') {
				page.selectProjectProgramTableCfg.localParam.urlparam.param12 = window.CUR_PROJECTID;
			} else {
				page.selectProjectProgramTableCfg.localParam.urlparam.param12 = $('#s_projectId option:checked').val();
			}

			page.selectProjectProgramTableCfg.localParam.urlparam.param13 = window.CUR_CUSTOMERID;
			page.selectProjectProgramTableCfg.localParam.urlparam.param14 = window.CUR_PROJECTID;
			page.selectProjectProgramTableCfg.localParam.urlparam.param15 = $('#s_customerSubjectId').val();
			$('#selectProjectProgramTable').DataTable().ajax.reload();
			countProjectProgram();
		},
		onResetProjectProgramClick(event) {

			$('#s_customerId').val('').select2({
				allowClear: true,
				language: 'zh-CN',
				width: '100%',
				placeholder: '请选择'
			});
			$('#s_projectId').val('').select2({
				allowClear: true,
				language: 'zh-CN',
				width: '100%',
				placeholder: '请选择'
			});

			$('#s_customerId').val('').trigger('change');
			$('#s_projectId').val('').trigger('change');
			$('#s_customerSubjectId').val('');
			page.selectProjectProgramTableCfg.localParam.urlparam = page.getDefaultFilter();
			page.selectProjectProgramTableCfg.localParam.urlparam.param11 = window.CUR_CUSTOMERID;
			page.selectProjectProgramTableCfg.localParam.urlparam.param12 = window.CUR_PROJECTID;
			page.selectProjectProgramTableCfg.localParam.urlparam.param13 = window.CUR_CUSTOMERID;
			page.selectProjectProgramTableCfg.localParam.urlparam.param14 = window.CUR_PROJECTID;
			page.selectProjectProgramTableCfg.localParam.urlparam.param15 = $('#s_customerSubjectId').val();
			$('#selectProjectProgramTable').DataTable().ajax.reload();
			countProjectProgram();
		},
		onInsertProjectProgramClick(event) {
			let table = $('#selectProjectProgramTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			let copyArray = [];
			let array = [];

			//判断是否有审计程序
			if (rowData.length == 0) {
				bdoInfoBox('提示', '请先选择一个有审计程序的项目!');
				return false;
			}
			$.each(rowData, function(i, item) {
				if (null != rowData[i].userSubjectId && rowData[i].userSubjectId != '' && rowData[i].subjectId === rowData[i].userSubjectId) {
					copyArray.push(rowData[i]);
				} else {
					array.push(rowData[i]);
				}
			});

			//判断可选项目的客户科目编号与当前项目客户科目编号是否一致
			if (array.length != 0) {
				bdoConfirmBox('提示', '当前客户科目编号为空不会生成审计程序，科目编号不一致的需要手动生成审计程序，是否继续进行操作?', isConfirm => {
					page.selectProjectProgramSider.hide();
					insertProjectProgram(_data);
				});
			} else {
				page.selectProjectProgramSider.hide();
				insertProjectProgram(_data);
			}

		},
		onResetAllClick(event) {
			$("#resetButtonAll").blur();
			bdoConfirmBox('提示', '重置后会删除所有已生成的审计程序，是否继续重置？', isConfirm => {
				var table = $('#subjectPlanTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				let deleteDgArray = [];
				//将所有数据放到数组中
				$.each(rowData, function(i, item) {
					let userSubjectId = rowData[i].userSubject;
					if (userSubjectId != null){
						userSubjectId = userSubjectId.substr(0, userSubjectId.indexOf('-'));
					}

					deleteDgArray.push({
						param1: '002',
						param2: window.CUR_PROJECTID,
						param3: window.CUR_CUSTOMERID,
						param4: window.CUR_PROJECT_ACC_YEAR,
						param5: rowData[i].tbSubjectName,
						param6: rowData[i].tbSubjectCode,
						param9: userSubjectId
					});
				});

				bdoInProcessingBox('请稍后，正在批量重置审计程序!');
				let isRefresh = false;
				setTimeout(()=>{
					isRefresh === true || refTree();
				}, 60*1000);
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgMain.resetAuditProduresAll.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param13: JSON.stringify(deleteDgArray)
					},
					dataType: 'json',
					bdolxLoader: false,
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('操作成功', data.resultInfo.statusText);
							isRefresh = true;
							refTree();
						} else {
							bdoErrorBox('操作失败', data.resultInfo.statusText);
						}
					}
				});

			});
		}
		, onFilterChange(event) {
			var val = $('#filter').val();
			switch (val) {
				case 'all':
					page.auditProgramTableCfg.localParam.urlparam.param5 = 1;
					page.auditProgramTableCfg.localParam.urlparam.param6 = null;
					page.auditProgramTableCfg.localParam.urlparam.param7 = null;
					break;
				case 'std':
					page.auditProgramTableCfg.localParam.urlparam.param6 = 1;
					page.auditProgramTableCfg.localParam.urlparam.param5 = null;
					page.auditProgramTableCfg.localParam.urlparam.param7 = null;
					break;
				case 'sub':
					page.auditProgramTableCfg.localParam.urlparam.param7 = 1;
					page.auditProgramTableCfg.localParam.urlparam.param5 = null;
					page.auditProgramTableCfg.localParam.urlparam.param6 = null;
					break;
			}
			$('#subjectPlanTable').DataTable().ajax.reload();
		},
		onFilterEditorChange(event){
			var filterEditor = $('#filterEditor option:selected').val();
			page.auditProgramTableCfg.localParam.urlparam.param10 = filterEditor;
			$('#subjectPlanTable').DataTable().ajax.reload();
		}
		,onExchangeSubjectEditorsClick(event){
			if (CUR_USERID != JSON.parse($.sessionStorage('projectManager')) && JSON.parse($.sessionStorage('projectManager')) != undefined) {
				bdoInfoBox('提示', '只有当前项目负责人才能挑选科目!');
				return;
			}

			$('input[name="checkSubjectAll"]').prop("checked", false);
			this.queryGroupMembers();
			$('#selectSubjectUpdateEditor').modal('show');
			$('#selectSubjectPlanTable').DataTable().ajax.reload();
		}
		,onCheckSubjectPlanClick(event){
			let subjectEditor = $('#filterSubjectEditor option:selected').val();
			let subjectEditorName = $('#filterSubjectEditor option:selected').text();
			let ids = [];
			$.each($('input[name="checkSubject"]:checkbox'),function(){
				if(this.checked){
					ids.push($(this).val());
				}
			});
			if (subjectEditor == "" || subjectEditor == null){
				bdoInfoBox('提示','请选择科目编制人!');
				return;
			}else if(ids.length<1){
				bdoInfoBox('提示','请至少选择一项科目!');
				return;
			}
			//$('#selectSubjectUpdateEditor').modal('hide');
			$.ajax({
				type:'post',
				url:'dgCenter/DgMain.updateSubjectEditors.json',
				dataType:'json',
				data:{
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1:subjectEditor,
					param2 : JSON.stringify(ids),
					param3: subjectEditorName
				},
				success:function (data) {
					if (data.success){
						bdoSuccessBox('提示','修改科目编制人成功');
						$('#selectSubjectPlanTable').DataTable().ajax.reload();
						$('#subjectPlanTable').DataTable().ajax.reload();
					}else {
						bdoErrorBox('提示',data.resultInfo.statusText)
					}
					$('input[name="checkSubjectAll"]').prop("checked", false);

				}
			})
			
		}
		, exportAPPlanToDg() {
			let tableConfig = this.auditProgramTableCfg;
			let columnInfo = getColumnsInfo(tableConfig.tableParam.columnDefs);
			let myParams = applyIf({}, tableConfig.localParam.urlparam);
			delete  myParams.sort;
			myParams.page = '';
			myParams.start = '';
			myParams.limit = '';
			myParams.queryUrl = tableConfig.localParam.url;
			myParams.columnMap = columnInfo;
			myParams = JSON.stringify(myParams);
			let title = encodeURI('计划控制表');
			let param = {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: myParams,
				title: title
			};
			$.ajax({
				url: 'dgCenter/ExportOtherDg.exportAPPlanTbl.json',
				data: param,
				type: 'post',
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						if (data.data && data.data.length > 0) {
							let dataString = data.data[0].fileData;
							let fileName = data.data[0].fileName;
							let isNew = data.data[0].isNew;
							bdoInfoBox('成功', fileName + '导出成功！');
							saveAs(dataURLtoFile(dataString, fileName), fileName);
							getSubjecttree({
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_PROJECTID,
								param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
							}, data => {
								$('.js-tree-collapsed').trigger('rebuild', [{
									data: [data.data[0].treeData],
									levels: (agrs.data.deep + 2),
									callback(tree) {
										tree.expandNode(agrs.data.nodeId, {
											levels: (agrs.data.deep + 2),
											silent: true
										});
										tree.selectNode(agrs.data.nodeId, {silent: true});
										agrs.data = tree.getNode(agrs.data.nodeId);
									}
								}]);
							});
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}
		, onExportAuditProgramPlanClick(event) {
			page.exportAPPlanToDg();
		}
		/**
		 * 设定系统推荐的科目认定分值
		 * @param event
		 */
		, onSetIdentifiedEcavpRecommendValueBtnClick(event) {
			$("#setIdentifiedEcavpRecommendValue").blur();
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgEcavp.setSubjectIdentifiedEcavpRecommendValue.json',
				dataType: 'json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID
				},
				success: function(data){
					if(data.success) {
						$('#subjectPlanTable').DataTable().ajax.reload();
						bdoSuccessBox("成功", "科目认定分值设置成功！");
					}else {
						bdoErrorBox("失败", data.resultInfo.statusText);
					}
				}
			});
		}
		,onInitScheduleControl(event){
			$.ajax({
				type: 'post',
				url: 'dgCenter/HbMergeTb.createScheduleControl.json',
				dataType: 'json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID
				},
				success: function(data){
					if(data.success) {
						$('#subjectPlanTable').DataTable().ajax.reload();
						bdoSuccessBox("成功", "初始化合并计划控制表成功！");
					}else {
						bdoErrorBox("失败", data.resultInfo.statusText);
					}
				}
			});
		}
		//选择标准科目框关闭
		,closeMergeAuditProgramPlanButtonClick(event){
			$('#mergeAuditProgramList').empty();
		}
		,onCreateMergeDgSub(event){
			var table = $('#subjectPlanTable').dataTable();
			var index = $(event.currentTarget).attr('data-row');
			var rowData = table.fnGetData(index);
			if(rowData.isNeedToAudit != '1'){
				bdoErrorBox('操作失败', 'TB科目：【' + rowData.tbSubject + '】请先勾选是否编制！');
				return;
			}
			// $("#editButtonAll").blur();
			$('#selectAllBaseSubjectTable').prop('tb-index',index)
			$('#selectAllBaseSubjectTable').DataTable().ajax.reload();
			$('#selectAllBaseSubjectModal').modal('show');
		}
		, selectAllBaseSubjectConfig: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00032',
						// param1: _data.extraOptions.customerId,
						// param2: _data.extraOptions.projectId,
						// param3: window.CUR_PROJECT_ACC_YEAR
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				scrollX: true,
				select: false,
				ordering: false,
				serverSide: true,
				autoWidth: false,
				fixedThead: true,
				lengthChange: false,
				paging: false,
				fixedHeight: '480px',
				columnDefs: [{
					targets: 1,
					orderable: false,
					className: 'text-center',
					width: '20px',
					title: '<label class="css-input css-checkbox css-checkbox-primary">' +
						'<input type="checkbox" name="checkBaseSubjectAll"/>' +
						'<span></span>' +
						'</label>',
					render(data, type, row, meta) {
						return '<label class="css-input css-checkbox css-checkbox-primary">' +
							'<input type="checkbox" name="checkBaseSubject" value="' + row.label + '"/>' +
							'<span></span>' +
							'</label>';
					}
				}, {
					targets: 2,
					title: '标准科目',
					name: 'subjectName',
					data: 'subjectName',
					// className: 'text-left',
					className: 'text-center',
					width: '50px',
					render(data, type, row, meta) {
						return row.subjectId + '-' + data;
					}

				}]
			}

		}
		, onNotAuditReasonsBtnClick(event) {
			var notAuditReasonsText = $('#notAuditReasonsText').val();
			var isNeedToAudit = $('#notAuditReasonsModal_isNeedToAudit').val();
			if(isNeedToAudit == 'true'){
				isNeedToAudit = '1';
			}
			if(isNeedToAudit != '1'){
				if(notAuditReasonsText == ''){
					bdoInfoBox('提示', '请填写不编制理由！');
					return;
				}
			}
			$.ajax({
				url: 'dgCenter/DgSubjectIdentify.updateHbIdentifiedReasons.json',
				dataType: 'json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: $('#notAuditReasonsModal_autoId').val(),
					param2: notAuditReasonsText,
					param3: isNeedToAudit
				},
				bdolxLoader: false,
				success(data) {
					if (data.success) {
						$('#subjectPlanTable').DataTable().draw(false);
						// $('#subjectPlanTable').DataTable().ajax.reload();
						$('#notAuditReasonsModal').modal('hide');
						OneUI.notifySuccess('保存成功！');
						// bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						$('#subjectPlanTable').DataTable().draw(false);
						// $('#subjectPlanTable').DataTable().ajax.reload();
						$('#notAuditReasonsModal').modal('hide');
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}
		,onSubmitSelect(event){
			let ids = [];
			$.each($('input[name="checkBaseSubject"]:checkbox'),function(){
				if(this.checked){
					ids.push($(this).val());
				}
			});
			if(ids.length<1){
				bdoInfoBox('提示','请至少选择一项科目!');
				return;
			}
			let table = $('#subjectPlanTable').dataTable();
			let index = $('#selectAllBaseSubjectTable').prop('tb-index');
			let rowData = table.fnGetData(parseInt(index));
			$('#selectAllBaseSubjectModal').modal('hide');
			$.ajax({
				type:'post',
				url: 'dgCenter/HbMergeTb.createAuditProcess.json',
				dataType:'json',
				data:{
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: '002',
					param2: window.CUR_PROJECTID,
					param3: window.CUR_CUSTOMERID,
					param4: rowData.tbSubjectName,
					param5: rowData.tbSubjectCode,
					param6: rowData.tbSubjectCode,
					jsonData : JSON.stringify(ids),
					param9: rowData.autoId
				},
				success:function (data) {
					if (data.success){
						$('#selectSubjectPlanTable').DataTable().ajax.reload();
						$('#subjectPlanTable').DataTable().ajax.reload();
						refTree();
						bdoInfoBox('提示',data.resultInfo.statusText,1000);
					}else {
						bdoErrorBox('提示',data.resultInfo.statusText)
					}
					$('input[name="checkBaseSubjectAll"]').prop("checked", false);

				}
			})

		}
		/**
		 * 初始化
		 */
		, init(options) {
			var me = this;
			$('#subjectIndex').text('【' + agrs.data.extraOptions.indexId + '】');
			this.queryGroupMembers();
			BdoDataTable('selectAllBaseSubjectTable', this.selectAllBaseSubjectConfig);
			BdoDataTable('subjectPlanTable', this.auditProgramTableCfg);
			BdoDataTable('selectSubjectPlanTable', this.selectSubjectPlanTableCfg);
			this.bindEvents();

			OneUI.initHelper('slimscroll');
			this.querySetting();

			this.selectProjectProgramSider = side({el: '#selectProjectProgramSider', autoHide: false});
			//$('.block-search').show();
			// 选择程序画面检索条件
			this.searchProjectForm = createForm(this.searchProjectFormCfg);
		}
		, searchProjectFormCfg: {
			options: {
				propsData: {
					jsonData: {
						s_customerId: '',
						s_projectId: '',
						s_customerSubjectName: ''
						//s_departmentId: ''
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 4,
			id: 'searchProjectForm',
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
					id: 's_customerId',
					label: '客户名称',
					colspan: 1,
					rowspan: 1,
					type: 'select',
					html: ''
				},
				{
					id: 's_projectId',
					label: '项目名称',
					colspan: 1,
					type: 'select',
					html: ''
				}, {
					id: 's_customerSubjectId',
					type: 'input',
					label: '科目编号',
					colspan: 1
				}

			]
		}
		, searchProjectForm: null
		, selectProjectProgramSider: null
		, selectProjectProgramTable: null
		, selectProjectProgramTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: '',
					start: -1,
					limit: -1
				},
				tabNum: true
			},
			tableParam: {
				scrollX: true,
				select: true,
				//ordering: true,
				order: [2, 'asc'],
				pageLength: 30,
				createdRow(row, data, dataIndex) {
					$(row).attr('dataIndex', dataIndex);
				},
				serverSide: true,
				//fixedThead: true,
				columnDefs: [
					{
						targets: 1,
						orderable: true,
						title: '项目名称',
						name: 'projectName',
						data: 'projectName',
						width: '200px'
					}, {
						targets: 2,
						orderable: true,
						title: '所选项目科目编号',
						name: 'subjectId',
						data: 'subjectId',
						className: 'text-center',
						width: '80px'
					}, {
						targets: 3,
						orderable: true,
						title: '所选项目科目名称',
						name: 'subjectName',
						data: 'subjectName',
						className: 'text-center',
						width: '100px'
					}, {
						targets: 4,
						orderable: true,
						title: '客户科目编号',
						name: 'userSubjectId',
						data: 'userSubjectId',
						className: 'text-center',
						width: '80px',
						render(data, type, row, meta) {
							var subjectId = row.subjectId;
							var userSubjectId = row.userSubjectId;
							var str;
							if (null != userSubjectId && userSubjectId != '' && subjectId != userSubjectId) {
								str = '<label style="background-color: red;color: white">' + row.userSubjectId + '</label>';
							} else {
								str = row.userSubjectId;
							}
							return str;
						}
					}, {
						targets: 5,
						orderable: true,
						title: '客户科目名称',
						name: 'userSubjectName',
						data: 'userSubjectName',
						className: 'text-center',
						width: '100px'
					}, {
						targets: 6,
						orderable: true,
						title: '索引号',
						name: 'indexId',
						data: 'indexId',
						className: 'text-center',
						width: '100px'
					}, {
						targets: 7,
						orderable: true,
						title: '程序名称',
						className: 'text-center',
						name: 'dgName',
						data: 'dgName',
						width: '150px'
					}, {
						targets: 8,
						orderable: true,
						title: '创建人',
						className: 'text-center',
						name: 'CREATED_BY',
						data: 'CREATED_BY',
						width: '40px',
						render(data, type, row, meta) {
							return row.__ucreateUser.userName;
						}

					}
				]
			}
		}
		, getDefaultFilter() {
			return {
				menuId: window.sys_menuId,
				sqlId: 'DG01005',
				start: -1,
				limit: -1
			};
		}
		, auditProgramTable: null
		, bgColerMap: {}
		, onEditProgramPlan(event) {
			var table = $('#subjectPlanTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			$.sessionStorage('subjectEditors', rowData.subjectEditors);
			/*if (rowData.userSubject == null || rowData.userSubject == '' || rowData.tbSubject == null || rowData.tbSubject == '') {
				bdoErrorBox('操作失败', '请先添加关系对照！');
				return;
			}*/
			let nodeData;
			searchSubjecttreeNode(JSON.parse($.sessionStorage('subjecttree')), function(node) {
				if (node.extraOptions.nodeType == 'SUBJECT' && node.extraOptions.userSubjectId == rowData.userSubjectId) {
					nodeData = node;
					nodeData.workpaperId = nodeData.extraOptions.workpaperId;
					nodeData.currentNode = $.extend(false, {}, node);
					nodeData.currentNode.currentNode = null;
				}
			});

			if (nodeData == undefined || null == nodeData) {
				bdoInfoBox('提示', '请先生成审计程序');
			} else {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00184',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: rowData.autoId
					},
					dataType: 'json',
					success: function(data) {
						let canOpen = false;
						if (data.success) {
							if (data.data && data.data.length > 0 && data.data[0].programCount > 0) {
								canOpen = true;
								page.editProgramPageNodeData = nodeData;
								page.editProgramPageNodeData.tbRowData = rowData;
								$('#editProgramPageTabLink').tab('show');
							}
						}
						if (!canOpen) {
							bdoInfoBox('', '没有审计程序，请先生成审计程序！', 1000);
						}
					}
				});
			}
		}
		, editProgramPageNodeData: {}
		, OnEditProgramPageTabLinkShownBsTab(evt) {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async : false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00197',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(CUR_USERID == data.data[0].manager){
							EditProgramPage({region: '#editProgramPageTab', data: page.editProgramPageNodeData});
						}else {
							bdoErrorBox('',"无权限！");
						}
					}
				}
			});
		}
		, onCreateDgSub(event) {
			var table = $('#subjectPlanTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			if (rowData.userSubject == null || rowData.userSubject == '' || rowData.tbSubject == null || rowData.tbSubject == '') {
				bdoErrorBox('操作失败', '客户科目：【' + rowData.userSubject + '】请先添加关系对照！');
				return;
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/dgMain.createDgTree.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: '002',
					param2: window.CUR_PROJECTID,
					param3: window.CUR_CUSTOMERID,
					param4: rowData.tbSubjectName,
					param5: rowData.tbSubjectCode,
					param6: rowData.tbSubjectCode,
					param9: rowData.autoId,
					refreshFlg:1
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('操作成功', data.resultInfo.statusText);
						$('#spreadContentDir').trigger('rebuildTree', [{
							param1: window.CUR_PROJECTID,
							param2: window.CUR_CUSTOMERID
						}, data => {
							$('.js-tree-collapsed').trigger('rebuild', [{
								data: [data.data[0].treeData],
								levels: (_data.deep + 1),
								callback(tree) {
									tree.expandNode(_data.nodeId, {levels: (_data.deep + 1), silent: true});
									tree.selectNode(_data.nodeId, {silent: true});
									_data = agrs.data = tree.getNode(_data.nodeId);
								}
							}]);
						}]);
					} else {
						bdoErrorBox('操作失败', data.resultInfo.statusText);
					}
				}
			});
		}
		, onRepeatDgSub(event) {
			let table = $('#subjectPlanTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			bdoConfirmBox('提示', '重置会删除原来的审计程序，确定重置吗？', isConfirm => {
				let userSubjectId = rowData.userSubject;
				$.ajax({
					type: 'post',
					url: 'dgCenter/dgMain.resetAuditProdures.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: '002',
						param2: window.CUR_PROJECTID,
						param3: window.CUR_CUSTOMERID,
						param4: window.CUR_PROJECT_ACC_YEAR,
						param5: rowData.tbSubjectName,
						param6: rowData.tbSubjectCode,
						param9: userSubjectId
					},
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						if (data.success) {
							bdoSuccessBox('操作成功', data.resultInfo.statusText);
							$('#spreadContentDir').trigger('rebuildTree', [{
								param1: window.CUR_PROJECTID,
								param2: window.CUR_CUSTOMERID
							}, data => {
								$('.js-tree-collapsed').trigger('rebuild', [{
									data: [data.data[0].treeData],
									levels: (_data.deep + 1),
									callback(tree) {
										tree.expandNode(_data.nodeId, {levels: (_data.deep + 1), silent: true});
										tree.selectNode(_data.nodeId, {silent: true});
										_data = agrs.data = tree.getNode(_data.nodeId);
									}
								}]);
							}]);
						} else {
							bdoErrorBox('操作失败', data.resultInfo.statusText);
						}
					}
				});
			});


		}
		,onCheckSubjectAll(event){
			if ($('input[name="checkSubjectAll"]').is(":checked")==true){
				$("input[name='checkSubject']").each(function () {
					this.checked = true;
				});
			}else {
				$('input[name="checkSubjectAll"]').prop("checked", false);
				$("input[name='checkSubject']").each(function () {
					this.checked = false;
				});
			}

		}
		,onCheckBaseSubjectAll(event){
			if ($('input[name="checkBaseSubjectAll"]').is(":checked")==true){
				$("input[name='checkBaseSubject']").each(function () {
					this.checked = true;
				});
			}else {
				$('input[name="checkBaseSubjectAll"]').prop("checked", false);
				$("input[name='checkBaseSubject']").each(function () {
					this.checked = false;
				});
			}

		}
		,onEditReasons(event){
			var th = $('#subjectPlanTable').DataTable().context[0].aoColumns[$(this).index()];
			if (th.name === 'notAuditReasons') {
				var data = $('#subjectPlanTable').DataTable().data()[$(this).closest('tr').index()];
				if(data.isNeedToAudit == '1'){
					if(data.notAuditReasons == null || data.notAuditReasons == ''){
						return;
					}
					$('#notAuditReasonsModal_isNeedToAudit').val(data.isNeedToAudit);
					
				}
				$('#notAuditReasonsText').val(data.notAuditReasons);
				$('#notAuditReasonsModal_autoId').val(data.autoId);
				$('#notAuditReasonsModal').find('button[data-dismiss="modal"]').parent().show();
				$('#notAuditReasonsModal').modal('show');
			}
		}
		,selectSubjectPlanTableCfg:{
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'HB00019',
						param1: _data.extraOptions.customerId,
						param2: _data.extraOptions.projectId,
						param3: window.CUR_PROJECT_ACC_YEAR
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				scrollX: true,
				select: false,
				ordering: false,
				//order : [2, 'asc'],
				serverSide: true,
				autoWidth: false,
				fixedThead: true,
				//pageLength:30,
				lengthChange:false,
				paging:false,
				fixedHeight: '480px',
				columnDefs:  [{
					targets: 1,
					orderable: false,
					className: 'text-center',
					width: '50px',
					title: '<label class="css-input css-checkbox css-checkbox-primary">' +
						'<input type="checkbox" name="checkSubjectAll"/>' +
						'<span></span>' +
						'</label>',
					render(data, type, row, meta) {
						//$("#checkSubjectAll").prop("checked", false);
						let renderStr = '';
						if (row.tbSubject != null && row.tbSubject != "") {
							renderStr = '<label class="css-input css-checkbox css-checkbox-primary">' +
								'<input type="checkbox" name="checkSubject" value="' + row.autoId + '"/>' +
								'<span></span>' +
								'</label>'

						}
						return renderStr;
					}
				}, {
					targets: 2,
					title: 'TB科目',
					name: 'tbSubject',
					data: 'tbSubject',
					className: 'text-left',
					width: '100px'
				}, {
					targets: 3,
					title: '科目编制人',
					name: '__usubjectEditorUser',
					data: '__usubjectEditorUser',
					className: 'text-center',
					width: '80px',
					render(data, type, row, meta) {
						if (!data) {
							return '';
						}
						return data.userName;
					}
				}]
			}
		}
		, auditProgramTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'HB00019',
						param1: _data.extraOptions.customerId,
						param2: _data.extraOptions.projectId,
						param3: window.CUR_PROJECT_ACC_YEAR,
						param10:$('#filterEditor option:selected').val()
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				scrollX: true,
				select: false,
				ordering: false,
				//order : [2, 'asc'],
				serverSide: true,
				autoWidth: false,
				fixedThead: true,
				fixedHeight: '480px',
				drawCallback(settings) {
					$('#subjectPlanTable tbody').replaceWith(settings.nTBody);
					var data = this.fnGetData();
					$('#subjectPlanTable').trigger('initEditVm', [data]);
				},
				preDrawCallback(setting) {
					if (ecavpEditVm) {
						ecavpEditVm.$destroy();
					}
				},
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
						return `<div class="">
					<button class="btn btn-xs btn-info table-btn-operate bdo-drop-btn" type="button" name="createMergeDgSub" data-placement="top" title="生成审计程序" data-toggle="tooltip" data-row="${meta.row}">
						<i class="fa fa-send"></i> 
					</button>
					 <button class="btn btn-xs btn-info table-btn-operate bdo-drop-btn" type="button" name="repeatDgSub" data-placement="top" title="重置审计程序" data-toggle="tooltip" data-row="${meta.row}">
						<i class="fa fa-repeat"></i>
					 </button>
					</div>`;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: 'TB科目名称',
					name: 'tbSubjectName',
					data: 'tbSubjectName',
					width: '90px',
					className: 'hidden'
				}, {
					targets: ++cnt,
					orderable: true,
					title: 'TB科目',
					name: 'tbSubject',
					data: 'tbSubject',
					width: '90px',
					className: 'text-left'
				}, {
					targets: ++cnt,
					className: 'text-right',
					orderable: true,
					title: '期初数',
					name: 'remain',
					data: 'remain',
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					className: 'text-right',
					orderable: true,
					title: '期末数',
					name: 'balance',
					data: 'balance',
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					title: '科目编制人',
					name: '科目编制人',
					data: 'subjectEditors',
					width: '120px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getEditManEdit(data, meta.row);
					}
				}, {
					targets: ++cnt,
					title: '是否编制',
					name: 'isNeedToAudit',
					data: 'isNeedToAudit',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getEditNeedAudit(data, meta.row);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '不编制理由',
					name: 'notAuditReasons',
					data: 'notAuditReasons',
					width: '120px',
					className: 'text-left'
				}]
			}
		}
	});
	//放在上面会太晚执行导致按钮还是隐藏的
	$('#initScheduleControl').show();
	return page;
}