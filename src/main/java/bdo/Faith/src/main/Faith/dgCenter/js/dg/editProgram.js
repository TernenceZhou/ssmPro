/**
 * 审计程序页面
 */
function EditProgramPage(agrs) {
	let _data = agrs.data
		, _template = agrs.template || tplLoader('dgCenter/html/dg/editProgram.html')
		, getConfirmStatus
		, getCsEditAble
		, ecavpEditComp
		, ecavpEditVmCfg
		, editManEditComp
	;
	editManEditComp = {
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
				let data  = this.datas;
				let editMan = this.editMan;
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
		},
		template: '<div>'
			+ '	<div class="form-material">'
			+ '		<select class="form-control" v-model="editMan" style="margin-left:5px" :disabled="editManDisabled">'
			+ '			<option v-for="(data, index) in datas" :value="data.id">{{ data.text }}</option>'
			+ '		</select>'
			+ '	</div>'
			+ '</div>'
	};
	getConfirmStatus = (data, score, odata, oscore, updateFlag) => {
		var checkboxClass = 'css-checkbox-primary', scoreClass = '';
		if (updateFlag == 1) {
			if (data != odata) {
				checkboxClass = 'css-checkbox-danger';
			}
			if (score != oscore) {
				scoreClass = 'score-red';
			}
		}
		var result = '<label class="css-input css-checkbox ' + checkboxClass + ' control-label" >'
			+ '			<input type="checkbox" ' + (data == '1' ? 'checked' : '') + ' disabled>'
			+ '			<span></span>'
			+ '		</label>'
			/*+ '<div class="' + scoreClass + '">' + (data == '1' ? (score ? score : 0) : '') + '</div>'*/;
		return result;
	};
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
				originalScore: '',
				originalVal: false,
				esValCache: {},
				checkValCache: false,
				scoreValCache: '',
				canSubmit: false
			};
		},
		watch: {
			ecavpVal(newVal) {
				this.programInfo['cs' + this.ecavp] = (newVal ? 1 : 0);
				if (newVal != true && newVal != 1) {
					this.score = '';
				} else {
					this.score = this.score ? this.score : 0;
				}
				if (this.originalVal != newVal) {
					this.$parent.updateRowMark[this.rownum] += 1;
				} else {
					this.$parent.updateRowMark[this.rownum] -= 1;
				}
				if (this.$parent.updateRowMark[this.rownum] < 0) {
					this.$parent.updateRowMark[this.rownum] = 0;
				}

				//this.saveScore();
				//this.$nextTick(()=>this.saveScore());
			},
			score(newVal) {
				if (this.esValCache[newVal] > 0) {
					//this.saveScore();
					return;
				}
				let result = newVal;
				let isDefaultVal = false;
				if (this.ecavpVal != true && this.ecavpVal != 1) {
					result = '';
				} else {
					result = result ? result : 0;
					isDefaultVal = true;
				}

				result = String(result).replace(/[^\d.]/g, '');
				result = result.replace(/\.{2,}/g, '.');
				result = result.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
				result = result.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
				if (result.indexOf('.') < 0 && result != '') {
					result = parseFloat(result);
				}
				if (parseFloat(result) > 3) {
					result = 3;
				}
				this.score = result;
				this.programInfo['s' + this.ecavp] = result;

				if (this.originalScore != result) {
					this.$parent.updateRowMark[this.rownum] += 1;
				} else {
					this.$parent.updateRowMark[this.rownum] -= 1;
				}
				if (this.$parent.updateRowMark[this.rownum] < 0) {
					this.$parent.updateRowMark[this.rownum] = 0;
				}
				if (!this.esValCache[this.score]) this.esValCache[this.score] = 1;
				//(this.scoreValCache != (result == '' ? null : result)) && this.saveScore();
			}
		},
		computed: {
			labelClass() {
				let lc = ['css-input', 'css-checkbox', 'control-label', 'css-checkbox-primary'];
				if (this.programInfo.customizeFlag != 1 && this.programInfo['cs' + this.ecavp] != this.programInfo['cs' + this.ecavp + 'Original']) {
					lc[3] = 'css-checkbox-danger';
				} else {
					lc[3] = 'css-checkbox-primary';
				}
				return lc;
			},
			scoreClass() {
				let scoreClass = ['form-control text-center'];
				if (this.programInfo.customizeFlag != 1 &&
					this.cmpScoreVal()) {
					scoreClass.push('score-red');
				} else {
					scoreClass = ['form-control text-center'];
				}
				return scoreClass;
			},
			editScore() {
				return !this.ecavpVal;
			}
		},
		mounted() {
			this.initEcavp();
		},
		methods: {
			initEcavp() {
				this.scoreValCache = this.programInfo['s' + this.ecavp];
				this.checkValCache = (this.programInfo['cs' + this.ecavp] == 1 ? true : false);
				this.ecavpVal = this.checkValCache;
				this.score = this.scoreValCache;
				this.originalScore = this.score;
				this.originalVal = this.ecavpVal;
				this.canSubmit = true;
			},
			cmpScoreVal() {
				let s1 = this.score ? (this.score == '' ? 0 : this.score) : 0;
				let s2 = this.originalScore ? (this.originalScore == '' ? 0 : this.originalScore) : 0;
				return s1 != s2;
			},
			saveScore() {
				if (!this.canSubmit) return;
				if (/*this.scoreValCache === this.score && */this.checkValCache === this.ecavpVal && ((!this.ecavpVal && this.score == this.scoreValCache) || (this.ecavpVal && parseFloat(this.score) === this.scoreValCache))) {
					return;
				}
				//if(true) return;
				if ((this.ecavpVal && this.score === '')) {
					return;
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
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				this.timer = setTimeout(function() {
					$this = this;
					$.ajax({
						url: 'dgCenter/DgMain.updateAuditAPECAVP.json',
						dataType: 'json',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: autoId,
							param2: ch,
							param3: score,
							param4: ecavpVal
						},
						bdolxLoader: false
					}).done(function(data) {
						if (data.success) {
							$this.scoreValCache = score;
							$this.checkValCache = ecavpVal;
							OneUI.notifySuccess('保存成功！');
						} else {
							OneUI.notifyError(data.resultInfo.statusText);
							$this.ecavpVal = $this.checkValCache;
							$this.score = $this.scoreValCache;
						}
					});
					clearTimeout(this.timer);
					this.timer = null;
				}.bind(this), 1000);
			}
		},
		template: '<div>'
			+ '	<label :class="labelClass" >'
			+ '		<input type="checkbox" v-model="ecavpVal" readonly="readonly" disabled="disabled">'
			+ '		<span></span>'
			+ '	</label>'
			/*+ '	<div class="has-success">'
			+ '		<div class="form-material">'
			+ '			<input :class="scoreClass" type="text" v-model="score" :disabled="editScore">'
			+ '		</div>'
			+ '	</div>'*/
			+ '</div>'
	};

	ecavpEditVmCfg = {
		//el: '#editProgramTable tbody',
		components: {
			'score-edit': ecavpEditComp,
			'edit-man-edit': editManEditComp
		},
		data() {
			return {
				rowData: [],
				updateRowMark: [],
				random: 0,
				editMans: []
			};
		},
		mounted() {
			this.random = (new Date).getTime() + parseInt(1e3 * Math.random());
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
			}
		}
	};
	var EcavpEditVmComp = Vue.extend(ecavpEditVmCfg);
	getCsEditAble = (ecavp, rownum) => {
		var result = '<score-edit v-if="rowData[' + rownum + ']" :ecavp="\'' + ecavp + '\'" :program-info="rowData[' + rownum + ']" :rownum="' + rownum + '"></score-edit>';
		return result;
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
	Vue.component('ecavp-comp', ecavpComp);

	function getEditManEdit(value, rownum) {
		var result = '<edit-man-edit :datas="editMans" :program-info="rowData[' + rownum + ']" :rownum="' + rownum + '" :current-value="\'' + value + '\'"></edit-man-edit>';
		return result;
	}

	agrs.template = _template;
	$(agrs.region).empty();
	if (!_data.extraOptions) {
		return;
	}
	$(agrs.region).html(_template);
	var cnt = 0;
	var page = new Page({
		random: (new Date).getTime() + parseInt(1e3 * Math.random())
		, ecavpEditVm: null
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
				/*,'#selectCancelBtn': 'click,onSelectCancelClick'*/
				, '#searchBtn': 'click,onSearchClick'
				, '#filterEditor3': 'change,onFilterChange'
				, '#submitTableVal': 'click,onSubmitTableValClick'
				, '#searchResetBtn': 'click,onSearchResetClick'
				, '#newAuditprogramAllBtn': 'click,onNewAuditprogramAllClick'
			};
			if (_data.type == 'SUBJECT') {
				return events;
			}
			return {};
		})()
		, _template: agrs.template || tplLoader('dgCenter/html/dg/auditProgram.html')
		, _data: agrs.data
		, selectEditors: null
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
						$('#filterEditor3').html(jsonArr);
					}
				}
			});
		}
		, getConfirmStatusOptions() {
			//下拉框得到数据方法
			var example2Select2Multiple = '';
			for (var i in DicJsonlData.responseJSON.审计程序认定) {
				example2Select2Multiple += '<option value="' + i + '">' + DicJsonlData.responseJSON.审计程序认定[i] + '</option>';
			}
			return example2Select2Multiple;
		},
		getUserablePlateOptions() {
			var suserablePlateSelect2Multi = '';
			for(let i in DicJsonlData.responseJSON.适用板块){
				suserablePlateSelect2Multi += '<option value="' + i + '">' + DicJsonlData.responseJSON.适用板块[i]+ '</option>';
			}
			return suserablePlateSelect2Multi;
		}
		/**
		 * 初始化
		 */
		, init(options) {
			var me = this;
			this.tbRowData = _data.tbRowData;
			$('#editProgranPageTbSubjectInfo').text('【' + this.tbRowData.tbSubject + '】' + '【' + this.tbRowData.userSubject + '】');
			if (_data.type == 'SUBJECT') {
				$('#newAuditprogramBtn').show();
				$('#addOtherProgramBtn').show();
			} else {
				$('#newAuditprogramBtn').hide();
				$('#addOtherProgramBtn').hide();
			}

			BdoDataTable('editProgramTable', this.editProgramTableCfg);
			BdoDataTable('unexecuteprogamTable', this.unexecuteprogamTableCfg);
			$('#editProgramTable').on('xhr.dt', () => {
				me.getECAVPSummery(_data, me.getECAVPCallback.bind(me));
				me.getProgramCount(_data, me.getProgramCountCallback.bind(me));
			});
			this.bindTableOptEvents();
			// 不执行理由填写画面
			this.unexecuteFormSider = side({el: '#unexecuteFormSider'});

			// 新增自定义程序表单画面
			this.cusAuditprogramFormSider = side({el: '#cusAuditprogramFormSider', autoHide: false});
			/*this.cusAuditprogramFormSider = side({
				el: '#cusAuditprogramFormSider', afterHide() {
					me.cusAuditprogramForm.process == '';
				}
			});*/
			// 选择程序画面
			this.selectProgramSider = side({el: '#selectProgramSider', autoHide: false});
			// 不执行理由填写画面表单
			this.unexecuteForm = createForm(this.unexecuteFormCfg);
			this.cusAuditprogramForm = createForm(this.cusAuditprogramFormCfg);
			// 编辑程序
			this.editAuditprogramFormSider = side({el: '#editAuditprogramFormSider'});
			this.editAuditprogramForm = createForm(this.editAuditprogramFormCfg);

			// 选择程序画面检索条件
			this.searchForm = createForm(this.searchFormCfg);
			// 设置统计数据
			//this.getECAVPSummery(_data, this.getECAVPCallback.bind(this));
			OneUI.initHelper('slimscroll');

			this.searchForm.jsonData.s_departmentId = window.departNmSession;
			//加载oneUI的多选框
			$('.js-select2').select2();
			//修改oneUI多选框的样式
			$('.select2').addClass('form-control');
			$('.select2-selection').addClass('form-control');
			$('.select2-selection').attr('style', 'border-bottom: 0px');
			
			$('#s_userablePlate').on("select2:select",function(e){
				if (e.params.data.text == '全部') {
					$("#s_userablePlate").val('全部').trigger("change");
				} else {
					let plateArr = $("#s_userablePlate").val();
					for (let k = 0, len = plateArr.length; k < len; k++) {
						if (plateArr[k] == '全部') {
							$("#s_userablePlate").val(e.params.data.id).trigger("change");
						}
					}
				}
			})
			
			$('#s_confirmStatus').append(this.getConfirmStatusOptions());
			$('#s_userablePlate').append(this.getUserablePlateOptions());
			//默认检索菜单机构禁止选择
			//$('#s_departmentId').attr('disabled', true);
			//$('#caret_s_departmentId').attr('disabled', true);
			this.queryGroupMembers();
			$('input[type="radio"][name="s_radio"]').off('click');
			$('input[type="radio"][name="s_radio"]').on('click', function() {
				if ($('input[name="s_radio"]:checked').val() == 0) {
					$('#s_departmentId').attr('disabled', true);
					$('#caret_s_departmentId').attr('disabled', true);
				} else if ($('input[name="s_radio"]:checked').val() == 1) {
					$('#s_departmentId').attr('disabled', true);
					$('#caret_s_departmentId').attr('disabled', true);
				} else if ($('input[name="s_radio"]:checked').val() == 2) {
					$('#s_departmentId').attr('disabled', false);
					$('#caret_s_departmentId').attr('disabled', false);
				}
			});
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
				splansP: 0
			};
			if (data.data) {
				$.each(data.data, (index, obj) => {
					if (obj.type == 'PROGRAMP') {
						ecavp.pplansE += obj.plansE;
						ecavp.pplansC += obj.plansC;
						ecavp.pplansA += obj.plansA;
						ecavp.pplansV += obj.plansV;
						ecavp.pplansP += obj.plansP;
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
		, bindTableOptEvents() {
			let me = this;
			$('#editProgramTable').unbind('initEditVm');
			$('#editProgramTable').bind('initEditVm', ((event, options) => {
				event.preventDefault();
				//ecavpEditVmCfg.data.editMans = page.selectEditors;
				me.ecavpEditVm = new EcavpEditVmComp();
				me.ecavpEditVm.editMans = page.selectEditors;
				me.ecavpEditVm.rowData = options;
				me.ecavpEditVm.updateRowMark = (() => {
					let result = [];
					for (let i = 0, len = options.length; i < len; i++) {
						result.push(0);
					}
					return result;
				})();
				me.ecavpEditVm.$mount('#editProgramTable tbody');
				me.ecavpEditVm.reset();
			}).bind(me));
			$('#unexecuteprogamTable').on('click', 'button.table-btn-operate[name="execute"]', this.onEcuteProgam);
			this.initDropMenu();
		}
		, initDropMenu() {
			var me = this;
			bdoDropMenu.bind(me)({
				el: '#editProgramTable button.table-btn-operate[name="operate"]',
				scope: me,
				beforeShow(activeEl, menu) {
					// 获取当前列数据
					var table = $('#editProgramTable').dataTable();
					var rowData = table.fnGetData(activeEl.attr('data-row'));
					if (rowData.level == 0) {
						menu.find('#audit').closest('li').hide();
						menu.find('#createDg').closest('li').hide();
						menu.find('#uploadDg').closest('li').hide();
						menu.find('#dgAttachBtn').closest('li').hide();
						menu.find('#downloadDg').closest('li').hide();
						menu.find('#delProgram').closest('li').hide();

						menu.find('#unExecute').closest('li').show();
						menu.find('#addProgram').closest('li').show();
						menu.find('#deleteProgram').closest('li').show();


					} else if (rowData.level == 1) {
						menu.find('#audit').closest('li').show();
						menu.find('#createDg').closest('li').show();
						menu.find('#uploadDg').closest('li').show();
						menu.find('#dgAttachBtn').closest('li').show();
						menu.find('#downloadDg').closest('li').show();
						menu.find('#delProgram').closest('li').show();

						menu.find('#unExecute').closest('li').hide();
						menu.find('#addProgram').closest('li').hide();
						menu.find('#deleteProgram').closest('li').hide();

					}
				},
				buttons: [{
					id: 'deleteProgram',
					text: '删除',
					icon: 'fa fa-times',
					handler(activeEl, event) {
						// 获取当前列数据
						var table = $('#editProgramTable').dataTable();
						var rowData = table.fnGetData(activeEl.attr('data-row'));
						let indexId = rowData.indexId;
						indexId = indexId.substr(5, 4);

						bdoConfirmBox('提示', '确定删除该审计程序吗？', isConfirm => {
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgMain.deleteAuditProgram.json',
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: rowData.autoId,
									param2: rowData.customerId,
									param3: rowData.projectId,
									param4: rowData.subjectId,
									param5: departIdSession,
									param6: indexId,
									param7: rowData.updateFlag,
									param8: rowData.dgName

								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										bdoSuccessBox('成功', data.resultInfo.statusText);
										$('#editProgramTable').DataTable().ajax.reload();
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						});

					}
				}, {
					id: 'unExecute',
					text: '不执行',
					icon: 'fa fa-minus-circle',
					handler(activeEl, event) {
						page.unexecuteFormSider.show();
						// 获取当前列数据
						var table = $('#editProgramTable').dataTable();
						var rowData = table.fnGetData(activeEl.attr('data-row'));

						me.unexecuteForm.jsonData.autoId = rowData.autoId;
						me.unexecuteForm.jsonData.customerId = rowData.customerId;
						me.unexecuteForm.jsonData.reason = '';
						me.unexecuteForm.rownum = activeEl.attr('data-row');
					}
				}, {
					id: 'edit',
					text: '编辑',
					icon: 'fa fa-edit',
					handler(activeEl, event) {
						// 获取当前列数据
						var table = $('#editProgramTable').dataTable();
						var rowData = table.fnGetData(activeEl.attr('data-row'));
						if (rowData.level != 1) {
							if (rowData.customizeFlag != '1') {
								me.editAuditprogramForm.jsonData = {
									autoId: rowData.autoId,
									customerId: rowData.customerId,
									eindexId: rowData.indexId,
									edgName: rowData.dgName,
									eprogramName: rowData.programNameAft,
									econfirmStatus: rowData.confirmStatusAft,
									programNameAft: rowData.programNameAft,
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
									esP: rowData.sP
								};
								me.editAuditprogramFormSider.show();
							} else {
								me.cusAuditprogramForm.jsonData = {
									autoId: rowData.autoId,
									dgName: rowData.dgName,
									indexId: rowData.indexId,
									required: rowData.required,
									confirmStatusAft: rowData.confirmStatusAft,
									programNameAft: rowData.programNameAft,
									delTemplates: [],
									draftTemplate: [],
									draftTemplateName: [],
									customerId: _data.extraOptions.customerId,
									projectId: _data.extraOptions.projectId,
									subjecttreeId: _data.extraOptions.autoId,
									level: rowData.level,
									csE: me.booleanTranslate(rowData.csE),
									csC: me.booleanTranslate(rowData.csC),
									csA: me.booleanTranslate(rowData.csA),
									csV: me.booleanTranslate(rowData.csV),
									csP: me.booleanTranslate(rowData.csP),
									sE: rowData.sE,
									sC: rowData.sC,
									sA: rowData.sA,
									sV: rowData.sV,
									sP: rowData.sP
								};
								me.cusAuditprogramForm.process = 'edit';
								me.cusAuditprogramFormSider.show();
							}
						}
					}
				}, {
					id: 'downloadDgTpl',
					text: '下载底稿模板',
					icon: 'fa fa-download',
					handler(activeEl, event) {
						// 获取当前列数据
						var table = $('#editProgramTable').dataTable();
						var rowData = table.fnGetData(activeEl.attr('data-row'));

						downloadFile('dgCenter/DgDownload.downloadTemplate.json', {
							param1: (() => {
								if (rowData.level == 0) {
									return rowData.autoId;
								}
								return rowData.parentId;
							})(),
							param2: _data.extraOptions.customerId
						});
					}
				}, {
					id: 'openPostilBtn',
					text: '批注',
					icon: 'fa fa-download',
					handler(activeEl, event) {
						// 获取当前列数据
						let table = $('#editProgramTable').dataTable();
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
				}]
			});
		}
		, onNewAuditprogramClick(event) {
			$('#cusAuditprogramFormSider .bdo-side-block h3.block-title').empty().text('新增自定义程序');
			page.cusAuditprogramForm.jsonData = {
				programNameAft: '',
				indexId: '',
				dgName: '',
				confirmStatusAft: '',
				draftTemplateName: [],
				draftTemplate: [],
				delTemplates: [],
				required: '0',
				level: 0,
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
		},
		onNewAuditprogramAllClick(event) {
			let rowData = $('#editProgramPageTabLink').data('rowData');
			var unexecuteProgramTable = {
				localParam: {
					url: 'dgCenter/DgGeneral.query.json',
					urlparam: (() => {
						let param = {
							menuId: window.sys_menuId,
							sqlId: 'DG00439',
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: window.CUR_PROJECT_ACC_YEAR,
							param4: rowData.autoId,
							start: -1,
							limit: -1
						};
						return param;
					})(),
					tabNum: true
				},
				tableParam: {
					// pageLength: 30,
					scrollX: true,
					scrollY: '355px',
					select: false,
					ordering: false,
					order: [1, 'asc'],
					serverSide: true,
					fixedThead: true,
					paging: false,
					fixedHeight: '400px',
					columnDefs: [{
						targets:1,
						orderable: false,
						className: 'text-center',
						width:'50px',
						title:'<label class="css-input css-checkbox css-checkbox-primary">'
							+	'<input type="checkbox" name="checkUnexecuteProgramAll"/>'
							+	'<span></span>'
							+'</label>',
						render(data, type, row, meta) {
							let renderStr = '<label class="css-input css-checkbox css-checkbox-primary">' 
								+	'<input type="checkbox" name="checkUnexecuteProgram" value="' + row.autoId + '"/>'
								+	'<span></span>'
								+'</label>';
							return renderStr;
						}
					} ,{
						targets: 2,
						title: '索引号',
						name: 'indexId',
						data: 'indexId',
						className: 'text-left',
						 width:'200px'
					}, {
						targets: 3,
						title: '程序名称',
						name: 'dgName',
						data: 'dgName',
						className: 'text-left',
						width:'350px'
					}]
				}
			};
			$('#selectUnexecuteProgramModal').on('show.bs.modal', function() {
				BdoDataTable('selectUnexecuteProgramTable', unexecuteProgramTable);
				$('input[name="checkUnexecuteProgramAll"]').off('click');
				$('input[name="checkUnexecuteProgramAll"]').on('click', checkUnexecuteProgramAll);
			});
			function checkUnexecuteProgramAll(){
				if ($('input[name="checkUnexecuteProgramAll"]').is(":checked")==true){
					$("input[name='checkUnexecuteProgram']").each(function () {
						this.checked = true;
					});
				}else {
					$('input[name="checkUnexecuteProgramAll"]').prop("checked", false);
					$("input[name='checkUnexecuteProgram']").each(function () {
						this.checked = false;
					});
				}
			}
			$('#auditprogramReason').val('');
			// 不执行程序--确定
			$('#checkUnexecuteProgramBtn').click(e => {
				let reason = $('#auditprogramReason').val();
				if(reason == ''){
					bdoInfoBox('提示', '请填写不执行理由!');
					return;
				}
				var ids = [];
				$.each($('input[name="checkUnexecuteProgram"]:checkbox'), function() {
					if (this.checked) {
						var data = $('#selectUnexecuteProgramTable').DataTable().data()[$(this).closest('tr').index()];
						ids.push(String(data.autoId));
					}
				});
				if (ids.length < 1) {
					bdoInfoBox('提示', '请至少选择一项不执行程序!');
					return;
				}
				bdoConfirmBox('提示', '确认是否批量不执行审计程序？', function() {
						let reason = $('#auditprogramReason').val();
						bdoInProcessingBox('请稍后!');
						$.ajax({
							type: 'POST',
							url: 'dgCenter/DgMain.setUnexecuteProgramAll.json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: JSON.stringify(ids),
								param4: reason,
								param5: rowData.autoId,
								param6: rowData.pageType
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									bdoSuccessBox('成功', data.resultInfo.statusText);
									$('#selectUnexecuteProgramModal').modal('hide');
									$('#editProgramTable').DataTable().ajax.reload();
									$('#unexecuteprogamTable').DataTable().ajax.reload();
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}
				);
			});
			$('#selectUnexecuteProgramModal').modal('show');
		}
		, onAddOtherProgramClick(event) {
			
			page.searchForm.jsonData = {
				s_radio: '2',
				s_departmentId: '',
				s_programName: '',
				s_subjectName: $.sessionStorage('baseSubjectName'),
				s_confirmStatus: '',
				s_userablePlate: '',
				s_stage: '',
				s_industry: '',
				s_dgName: '',
				s_indexId: '',
				s_csE: '',
				s_csC: '',
				s_csA: '',
				s_csV: '',
				s_csP: ''
			};
			page.selectProgramSider.show();
			page.selectProgramTableCfg.localParam.urlparam = page.getDefaultFilter();
			//var queryString = '[{"field":"departmentId","sqlIndex":"a.departmentId","type":"number","value":BdoFaithConsts.DEPARTMENT_BDO,"operate":"eq"}]';
			//page.selectProgramTableCfg.localParam.urlparam.filter = queryString;
			page.selectProgramTableCfg.localParam.urlparam.param10 = BdoFaithConsts.DEPARTMENT_BDO;
			page.selectProgramTableCfg.localParam.urlparam.param14 = '1';
			page.selectProgramTableCfg.localParam.urlparam.param15 = $.sessionStorage('userSubjectId');
			$('#s_subjectName').attr('disabled', 'disabled');
			BdoDataTable('selectProgramTable', page.selectProgramTableCfg);
		}
		, onSelectOkClick(event) {
			var jqEl = $('input[name="apCheckbox"]:checked');
			var selectIds = [];
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
					param3: _data.extraOptions.customerId,
					param4: $.sessionStorage('subjectEditors')
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						page.selectProgramSider.hide();
						$('#editProgramTable').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}
		/*,onSelectCancelClick(event){
			page.selectProgramSider.hide();
		}*/
		, onSearchClick(event) {
			let departmentCheck = true;
			let param = this.searchForm.jsonData;
			if ($('#s_confirmStatus').val() == null) {
				param.s_confirmStatus = '';
			} else {
				param.s_confirmStatus = $('#s_confirmStatus').val();
			}

			if ($('input[name="s_radio"]:checked').val() == 0) {
				param.s_departmentId = BdoFaithConsts.DEPARTMENT_BDO;
				page.selectProgramTableCfg.localParam.urlparam.param10 = '';
			} else if ($('input[name="s_radio"]:checked').val() == 1) {
				param.s_departmentId = window.departIdSession;
				page.selectProgramTableCfg.localParam.urlparam.param10 = '';
			} else if ($('input[name="s_radio"]:checked').val() == 2) {
				page.selectProgramTableCfg.localParam.urlparam.param10 = '';
				if (param.s_departmentId == '' || $('#s_departmentId').val() == '') {
					page.selectProgramTableCfg.localParam.urlparam.param10 = BdoFaithConsts.DEPARTMENT_BDO;
					departmentCheck = false;
				}
			}
			let queryFilterArr = [];
			$.each(param, (key, value) => {
				var _key = key.replace('s_', '');
				var filter = {
					field: _key,
					sqlIndex: 'a.' + _key,
					type: 'string',
					value: value,
					operate: 'like'
				};
				if (key == 's_industry') {
					filter.value = $('#s_industry').val();
				}
				switch (_key) {
					case 'departmentId':
						if (departmentCheck) {
							if (filter.value == BdoFaithConsts.DEPARTMENT_BDO) {
								filter.operate = 'eq';
							} else {
								filter.operate = 'IN';
							}
							filter.type = 'number';
						}
						break;
					case  'csE':
					case  'csC':
					case  'csA':
					case  'csV':
					case  'csP':
						filter.operate = 'eq';
						break;
					default:
						filter.operate = 'like';
				}
				queryFilterArr.push(filter);
			});
			if (queryFilterArr[4].value != '' && queryFilterArr[4].value != null) {
				for (var i = 0; i < queryFilterArr[4].value.length; i++) {
					if (queryFilterArr[4].value[i] == 'E') {
						queryFilterArr[9].value = 1;
					}
					if (queryFilterArr[4].value[i] == 'C') {
						queryFilterArr[10].value = 1;
					}
					if (queryFilterArr[4].value[i] == 'A') {
						queryFilterArr[11].value = 1;
					}
					if (queryFilterArr[4].value[i] == 'V') {
						queryFilterArr[12].value = 1;
					}
					if (queryFilterArr[4].value[i] == 'P') {
						queryFilterArr[13].value = 1;
					}
				}
				queryFilterArr[4].value = '';
			}

			if (param.s_departmentId && param.s_departmentId != '' && param.s_departmentId != BdoFaithConsts.DEPARTMENT_BDO) {
				queryFilterArr = queryFilterArr.slice(2);
				page.selectProgramTableCfg.localParam.urlparam.param11 = param.s_departmentId;
			} else {
				if (param.s_departmentId == BdoFaithConsts.DEPARTMENT_BDO) {
					queryFilterArr = queryFilterArr.slice(1);
				} else {
					queryFilterArr = queryFilterArr.slice(2);
				}
				page.selectProgramTableCfg.localParam.urlparam.param11 = null;
			}
			if (!$('#s_userablePlate').val()) {
				page.selectProgramTableCfg.localParam.urlparam.param16 = ''; 
			} else {
				let userablePlateArr = $('#s_userablePlate').val().join(',');
				page.selectProgramTableCfg.localParam.urlparam.param16 = $('#s_userablePlate').val().join(',');
				for (let i = 0,len = userablePlateArr.length; i < len;i++) {
					if (userablePlateArr[i] == '全部') {
						page.selectProgramTableCfg.localParam.urlparam.param16 = 'all';
					}
				}
			}
			page.selectProgramTableCfg.localParam.urlparam.param14 = '1';
			let queryString = JSON.stringify(queryFilterArr);
			page.selectProgramTableCfg.localParam.urlparam.filter = queryString;
			$('#selectProgramTable').DataTable().ajax.reload();
		}
		, onSearchResetClick(event) {
			page.searchForm.jsonData = {
				s_departmentId: BdoFaithConsts.DEPARTMENT_BDO,
				s_programName: '',
				s_subjectName: '',
				s_confirmStatus: '',
				s_stage: '',
				s_industry: '',
				s_dgName: '',
				s_indexId: ''
			};
			$('#choice').addClass('checked', 'checked');
			page.selectProgramTableCfg.localParam.urlparam = page.getDefaultFilter();
			var queryString = '[{"field":"departmentId","sqlIndex":"a.departmentId","type":"number","value":"' + BdoFaithConsts.DEPARTMENT_BDO + '","operate":"eq"}]';
			page.selectProgramTableCfg.localParam.urlparam.param14 = '1';
			page.selectProgramTableCfg.localParam.urlparam.filter = queryString;
			$('#selectProgramTable').DataTable().ajax.reload();
		}
		, onFilterChange(event) {
			var val = $('#filterEditor3 option:selected').val();
			page.editProgramTableCfg.localParam.urlparam.param8 = val;

			$('#editProgramTable').DataTable().ajax.reload();
		}
		, onSubmitTableValClick() {
			let data = page.ecavpEditVm.getUpateData();

			if (data.length > 0) {
				let param = data.map(item => {
					return {
						autoId: item.autoId,
						projectId: item.projectId,
						customerId: item.customerId,
						sE: item.sE,
						sC: item.sC,
						sA: item.sA,
						sV: item.sV,
						sP: item.sP,
						csE: item.csE,
						csC: item.csC,
						csA: item.csA,
						csV: item.csV,
						csP: item.csP
					};
				});
				/*$.each(data, (i, v)=>{
					v.year = undefined;
					v.paramHtmlPath = undefined;
					param.push(v);
				});*/
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgMain.saveECAVP.json',
					//async : false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: JSON.stringify(param),
						param2: window.CUR_CUSTOMERID,
						param3: window.CUR_PROJECTID,
						param4: window.CUR_PROJECT_ACC_YEAR
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#editProgramTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			} else {
				bdoErrorBox('', '未修改数据！');
			}
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
				$.sessionStorage('userSubjectName', currentNode.extraOptions.userSubjectName);
				$.sessionStorage('userSubjectId', currentNode.extraOptions.userSubjectId);
				if(currentNode.tbRowData.baseSubject != null && currentNode.tbRowData.baseSubject != ''){
					var baseIndex = currentNode.tbRowData.baseSubject.indexOf('-');
					var baseSubjectName = currentNode.tbRowData.baseSubject.substring(baseIndex + 1);
					$.sessionStorage('baseSubjectName', baseSubjectName);
				}else{
					$.sessionStorage('baseSubjectName', currentNode.extraOptions.userSubjectName);
				}
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
				param8: $('#filterEditor3 option:selected').val(),
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
				param.param6 = currentNode.extraOptions.userSubjectName;
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
		, editProgramTable: null
		, bgColerMap: {}
		, editProgramTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00005',
						param3: '1',
						param4: _data.extraOptions.projectId,
						param5: 0,
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
				scrollX: true,
				scrollY: '500px',
				fixedThead: true,
				select: true,
				ordering: false,
				pageLength: 10,
				//order : [2, 'asc'],
				serverSide: true,
				autoWidth: false,
				//lengthChange : false,
				select: false,
				preDrawCallback(setting) {
					if (page && page.ecavpEditVm) {
						page.ecavpEditVm.$destroy();
					}
				},
				drawCallback(settings) {
					let me = this;
					if (me.drawDtTimer) {
						clearTimeout(me.drawDtTimer);
					}

					this.drawDtTimer = setTimeout(function() {
						$('#editProgramTable tbody').replaceWith(settings.nTBody);
						let data = me.fnGetData();
						$('#editProgramTable').trigger('initEditVm', [data]);
						clearTimeout(me.drawDtTimer);
						me.drawDtTimer = false;
					}, 1000);

					/*$('#editProgramTable tbody').replaceWith(settings.nTBody);
					var data = this.fnGetData();
					$('#editProgramTable').trigger('initEditVm', [[].concat(data)]);*/
				},
				createdRow(row, data, dataIndex) {
					var barStyle = '';
					if (row == 1) {
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

					$(row).find('td:eq(2)').addClass(barStyle);
					$(row).find('td:eq(3)').addClass(barStyle);
					$(row).attr('v-if', 'rowData[' + dataIndex + ']');
				},
				fixedThead: true,
				fixedHeight: '500px',
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '50px',
					render(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<div class="">';

						renderStr += '<button class="btn btn-xs btn-info table-btn-operate bdo-drop-btn" type="button" name="operate" data-placement="top" title="更多操作" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-gear"></i>'
							+ '	</button>';
						renderStr += '</div>';
						return renderStr;
					}
				}, {
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
						var color = '';
						if (row.updateFlag == '1' && data != row.programNamePre) {
							color = 'red';
						}
						return '<pre class="dg" style="color: ' + color + ';height: 100%">' + data + '</pre>';
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: 'E',
					name: 'E',
					data: 'csE',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getCsEditAble('E', meta.row);
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: 'C',
					name: 'C',
					data: 'csC',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getCsEditAble('C', meta.row);
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: 'A',
					name: 'A',
					data: 'csA',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getCsEditAble('A', meta.row);
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: 'V',
					name: 'V',
					data: 'csV',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getCsEditAble('V', meta.row);
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: 'P',
					name: 'P',
					data: 'csP',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getCsEditAble('P', meta.row);
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '部门',
					name: '__ddepartmentIdName',
					data: '__ddepartmentIdName',
					width: '200px',
					className: 'dg-ap'
				}, /*{
					targets : ++cnt,
					orderable : true,
					className : 'text-center',
					title : '创建人',
					name : '__ucreateUserName',
					data : '__ucreateUserName',
					width : '90px',
					className : 'dg-ap'
				}*/
					{
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
					}]
			}
		}
		, unexecuteprogamTable: null
		, onEcuteProgam(event) {
			var table = $('#unexecuteprogamTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			bdoConfirmBox('提示', '确定重新执行该程序吗？', () => {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgMain.setExcuteProgram.json',
					//async : false,
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
							$('#editProgramTable').DataTable().ajax.reload();
							$('#unexecuteprogamTable').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});

		}
		, unexecuteprogamTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00005',
						param3: '0',
						param5: 0,
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
				scrollX: true,
				scrollY: '500px',
				fixedThead: true,
				select: true,
				ordering: false,
				//order : [2, 'asc'],
				serverSide: true,
				pageLength: 10,
				displayIcon: false,
				fixedThead: true,
				fixedHeight: '500px',
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
						var renderStr = '';
						renderStr += '<div class="">';

						renderStr += '<button class="btn btn-xs btn-info table-btn-operate bdo-drop-btn" type="button" name="execute" data-placement="top" title="执行" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-external-link"></i>'
							+ '	</button>';
						renderStr += '</div>';
						return renderStr;
					}
				}, {
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
						return '<pre class="dg" style="height:100%">' + data + '</pre>';
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '不执行理由',
					name: 'reason',
					data: 'reason',
					width: '300px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: false,
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
					orderable: false,
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
					orderable: false,
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
					orderable: false,
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
					orderable: false,
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
					width: '200px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: false,
					className: 'text-center',
					title: '创建人',
					name: '__ucreateUserName',
					data: '__ucreateUserName',
					width: '90px',
					className: 'dg-ap'
				}, {
					targets: ++cnt,
					orderable: false,
					className: 'text-center',
					title: '复核人',
					name: 'recheckUser',
					data: 'recheckUser',
					width: '90px',
					className: 'dg-ap'
				}]
			}
		}
		, unexecuteFormSider: null
		, auditFormSider: null
		//,viewProgramSider: null
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
								//$('#editProgramTable tbody tr:eq('+page.unexecuteForm.rownum+')').remove();
								$('#editProgramTable').DataTable().ajax.reload();
								$('#unexecuteprogamTable').DataTable().ajax.reload();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					},
					rownum: -1
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
		/* ,auditFormCfg: {
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
						type : 'POST',
						url : 'demo/Spread.setUnexecuteProgram.json',
						dataType : 'json',
						success(data) {
							if(data.success){
								bdoSuccessBox('成功', data.resultInfo.statusText);
								page.auditFormSider.hide();
							}else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					}
				}
			},
			methods: {
				onAuditAcceptClick(event){
					this.submit(true);
				},
				onAuditFailedClick(event){
					this.submit(true);
				},
				onCancelClick(){
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
			},{
				id: 'auditFailedBtn',
				icon: 'fa-window-close-o',
				style: 'btn-danger',
				text: '不通过',
				typeAttr: {
					'v-on:click': 'onAuditFailedClick'
				}
			},{
				id: 'cancelAuditBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'v-on:click': 'onCancelClick'
				}
			}],
			items: [{
				id :  'remark',
				type : 'textarea',
				label : '备注',
				rowspan : 1,
				colspan : 1,
				validate : {
					rules : {
						//required : true
					}
				},
				typeAttr : {
					rows: 5
				},
				show: true
			}]
		}
		,auditForm: null
		,uploadWorkpagerPageCfg: {
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
						type : 'POST',
						url : 'dgCenter/DgDownload.uploadWorkpaper.json',
						dataType : 'json',
						success(data) {
							if(data.success){
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#uploadTplFormModal').modal('hide');
								
								$('.js-tree-collapsed').trigger('rebuild', [{
									data: [data.data[0].treeData],
									levels: 3,
									callback(tree){
										tree.expandNode(_data.nodeId, { levels: 3, silent: true });
										tree.selectNode(_data.nodeId, { silent: true });
										_data = agrs.data = tree.getNode(_data.nodeId);
									}
								}]);
								
							}else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					}
				}
			},
			methods: {
				onUploadDraftFileClick(event){
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
			},{
				id: 'cancelUploadDraftFileBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'data-dismiss': 'modal'
				}
			}],
			items: [{
				id :  'workpager',
				type : 'file',
				label : '底稿',
				rowspan : 1,
				colspan : 2,
				validate : {
					rules : {}
				},
				show: true,
				plugin : {
					name : 'fileinput',
					options : {
						uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
						uploadExtraData() {
							return {}
						}
					}
				}
			}]
		}
		,uploadWorkpagerPage: null */
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
					var tplcomp = this;
					var $span = $(event.currentTarget);
					var index = $span.attr('data-index');
					bdoConfirmBox('提示', '确定删除该模板文件吗？', (isConfirm) => {
						page.cusAuditprogramForm.jsonData.delTemplates.push(tplcomp.fileList[index].autoId);
						tplcomp.fileList.splice(index, 1);
						if (tplcomp.fileList && tplcomp.fileList.length < 1) {
							page.cusAuditprogramForm.formItem.draftTemplateName.show = false;
							page.cusAuditprogramForm.formItem.draftTemplate.show = true;
						} else {
							page.cusAuditprogramForm.formItem.draftTemplateName.show = true;
							page.cusAuditprogramForm.formItem.draftTemplate.show = false;
						}
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
						subjectEditorId: null,
						autoId: null,
						//customerId: null,
						level: 0,
						csE: false,
						csC: false,
						csA: false,
						csV: false,
						csP: false,
						sE: '',
						sC: '',
						sA: '',
						sV: '',
						sP: '',
						workpaperEditor: ''
					}
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
								$('#editProgramTable').DataTable().ajax.reload();
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
				},
				'jsonData.programNamePre'() {
					return this.jsonData.programNameAft;
				},
				'jsonData.confirmStatusPre'() {
					return this.jsonData.confirmStatusAft;
				}
			},
			watch: {
				/**
				 * 处理编辑画面状态更新
				 */
				process(newValue, oldValue) {
					var pvm = this;
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
							this.tplEditComp = new Vue(page.tplEditComp);
						}

						this.tplEditComp.delBtnShow = (newValue == 'edit' ? true : false);
						this.jsonData.delTemplates = [];
						this.$nextTick(() => {
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
							if (pvm.tplEditComp.fileList && pvm.tplEditComp.fileList.length > 0) {
								this.formItem.draftTemplateName.show = true;
								this.formItem.draftTemplate.show = false;
							} else {
								this.formItem.draftTemplateName.show = false;
								this.formItem.draftTemplate.show = true;
							}
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
					//console.log(evt);
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
					let jsonData = {};
					$.each(this.jsonData, (key, val) => {
						jsonData[key] = val;
						if (key.startsWith('cs')) {
							jsonData[key] = page.booleanTranslate(val, true);
						}
					});
					jsonData.subjectEditorId = $.sessionStorage('subjectEditors');
					jsonData.workpaperEditor = $.sessionStorage('subjectEditors');
					this.uploadFile(true, {jsonData: JSON.stringify(jsonData)});
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
						this.tplEditComp = new Vue(page.tplEditComp);
					}

					this.tplEditComp.delBtnShow = (this.process == 'edit' ? true : false);
					this.jsonData.delTemplates = [];
					this.$nextTick(() => {
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
						if (pvm.tplEditComp.fileList && pvm.tplEditComp.fileList.length > 0) {
							this.formItem.draftTemplateName.show = true;
							this.formItem.draftTemplate.show = false;
						} else {
							this.formItem.draftTemplateName.show = false;
							this.formItem.draftTemplate.show = true;
						}
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
				colspan: 1,
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'indexId',
				type: 'input',
				label: '索引号',
				//rowspan : 1,
				colspan: 1,
				typeAttr: {
					disabled: 'disabled',
					value: '0000-0000'
				},
				validate: {
					rules: {
						required: true
					}
				},
				value: '0000-0000'
			}, /* {
				id : 'required',
				type : 'combo',
				label : '是否必须',
				colspan : 1,
				value: '0',
				validate : {
					rules : {
						required : true
					}
				},
				plugin : {
					name: 'combo',
					options: {
						noneSelectedText : '请选择',
						width : '250px'
					},
					stores() {
						return ComboLabelValueDicData(false, 'boolean');
					}
				}
			}, */{
				id: 'confirmGrop',
				html: `
					<div class="form-material"><label>认定</label></div>
					<div class="row">
					<ecavp-comp :prefixed="''" :label-name="'E'" :ecs-val="jsonData.csE" :es-val="jsonData.sE" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="''" :label-name="'C'" :ecs-val="jsonData.csC" :es-val="jsonData.sC" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="''" :label-name="'A'" :ecs-val="jsonData.csA" :es-val="jsonData.sA" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="''" :label-name="'V'" :ecs-val="jsonData.csV" :es-val="jsonData.sV" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
					<ecavp-comp :prefixed="''" :label-name="'P'" :ecs-val="jsonData.csP" :es-val="jsonData.sP" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
					</div></div>
				`,
				/*
				html: '<div class="form-material"><label>认定</label></div>'
					  +'<div class="row" style="padding: 10px 0;">'
					  +'	<div class="col-md-2">'
					  +'		<label :class="checkboxGroupClass" >'
					  +'			<input type="checkbox" id="csE" name="csE" v-model="jsonData.csE" value="1">'
					  +'			<span></span>'
					  +'			E'
					  +'		</label>'
					  +'	</div>'
					  +'	<label class="col-md-2 control-label" for="sE">分数</label>'
					  +'	<div class="col-md-6">'
					  +'		<input class="form-control" type="text" id="sE" name="sE" v-model="jsonData.sE" :readonly="scoreReadonly">'
					  +'	</div>'
					  +'</div>'
					  +'<div class="row" style="padding: 10px 0;">'
					  +'	<div class="col-md-2">'
					  +'		<label :class="checkboxGroupClass" >'
					  +'			<input type="checkbox" id="csC" name="csC" v-model="jsonData.csC" >'
					  +'			<span></span>'
					  +'			C'
					  +'		</label>'
					  +'	</div>'
					  +'	<label class="col-md-2 control-label" for="sC">分数</label>'
					  +'	<div class="col-md-6">'
					  +'		<input class="form-control" type="text" id="sC" name="sC" v-model="jsonData.sC" :readonly="scoreReadonly">'
					  +'	</div>'
					  +'</div>'
					  +'<div class="row" style="padding: 10px 0;">'
					  +'	<div class="col-md-2">'
					  +'		<label :class="checkboxGroupClass" >'
					  +'			<input type="checkbox" id="csA" name="csA" v-model="jsonData.csA" >'
					  +'			<span></span>'
					  +'			A'
					  +'		</label>'
					  +'	</div>'
					  +'	<label class="col-md-2 control-label" for="sA">分数</label>'
					  +'	<div class="col-md-6">'
					  +'		<input class="form-control" type="text" id="sA" name="sA" v-model="jsonData.sA" :readonly="scoreReadonly">'
					  +'	</div>'
					  +'</div>'
					  +'<div class="row" style="padding: 10px 0;">'
					  +'	<div class="col-md-2">'
					  +'		<label :class="checkboxGroupClass" >'
					  +'			<input type="checkbox" id="csV" name="csV" v-model="jsonData.csV" >'
					  +'			<span></span>'
					  +'			V'
					  +'		</label>'
					  +'	</div>'
					  +'	<label class="col-md-2 control-label" for="sV">分数</label>'
					  +'	<div class="col-md-6">'
					  +'		<input class="form-control" type="text" id="sV" name="sV" v-model="jsonData.sV" :readonly="scoreReadonly">'
					  +'	</div>'
					  +'</div>'
					  +'<div class="row" style="padding: 10px 0;">'
					  +'	<div class="col-md-2">'
					  +'		<label :class="checkboxGroupClass" >'
					  +'			<input type="checkbox" id="csP" name="csP" v-model="jsonData.csP" >'
					  +'			<span></span>'
					  +'			P'
					  +'		</label>'
					  +'	</div>'
					  +'	<label class="col-md-2 control-label" for="sP">分数</label>'
					  +'	<div class="col-md-6">'
					  +'		<input class="form-control" type="text" id="sP" name="sP" v-model="jsonData.sP" :readonly="scoreReadonly">'
					  +'	</div>'
					  +'</div>'
					  +'</div>',*/
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
					sqlId: 'DG00003'
				},
				tabNum: true
			},
			tableParam: {
				scrollX: true,
				select: true,
				ordering: true,
				order: [2, 'asc'],
				pageLength: 10,
				serverSide: true,
				fixedThead: true,
				//fixedHeight: '300px',
				scrollY: '250px',
				scrollCollapse: true,
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '50px',
					render(data, type, row, meta) {
						var renderStr = '';
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
						if (row.__ddepartmentIdName == undefined) {
							return row.name;
						} else {
							return row.__ddepartmentIdName;
						}
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
						return getConfirmStatus(data, row.sC, row.csEOriginal, row.sEOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'A',
					name: 'A',
					data: 'csA',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sA, row.csEOriginal, row.sEOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'V',
					name: 'V',
					data: 'csV',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sV, row.csEOriginal, row.sEOriginal, row.updateFlag);
					}
				}, {
					targets: ++cnt,
					title: 'P',
					name: 'P',
					data: 'csP',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return getConfirmStatus(data, row.sP, row.csEOriginal, row.sEOriginal, row.updateFlag);
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
				},  {
					targets: ++cnt,
					orderable: true,
					title: '适用板块',
					name: 'userablePlate',
					data: 'userablePlate',
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
								$('#editProgramTable').DataTable().ajax.reload();
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
					let jsonData = {};
					for (let val in this.jsonData) {
						if (val.startsWith('e')) {
							jsonData[val.substring(1)] = this.jsonData[val];
						} else {
							jsonData[val] = this.jsonData[val];
						}
					}
					this.ajaxConfig.url = 'dgCenter/DgMain.editProgram.json';
					jsonData.programNameAft = this.jsonData.eprogramName;
					jsonData.confirmStatusAft = this.jsonData.econfirmStatus;
					jsonData.confirmStatusAftName = $('#econfirmStatus').val();

					jsonData.csE = page.booleanTranslate(this.jsonData.ecsE, true);
					jsonData.csC = page.booleanTranslate(this.jsonData.ecsC, true);
					jsonData.csA = page.booleanTranslate(this.jsonData.ecsA, true);
					jsonData.csV = page.booleanTranslate(this.jsonData.ecsV, true);
					jsonData.csP = page.booleanTranslate(this.jsonData.ecsP, true);

					/** BUG #4101 [2部]科目分数规则修改*/
					/*jsonData.sE = this.jsonData.esE;
					jsonData.sC = this.jsonData.esC;
					jsonData.sA = this.jsonData.esA;
					jsonData.sV = this.jsonData.esV;
					jsonData.sP = this.jsonData.esP;*/
					/** BUG #4101 [2部]科目分数规则修改 end*/

					/*this.jsonData.eprogramName = null;
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

					this.submit(true, {jsonData: JSON.stringify(jsonData)});
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
					//readonly: true
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
						s_userablePlate:''
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
					html: '<div class="form-material"><label>模式</label>' +
						'<lable class="form-control">' +
						/*'<div style="display:inline-block">'+
						'<label class="css-input css-radio css-radio-warning push-10-r">' +
						'<input type="radio" value="0" name="s_radio" ><span></span> 集团' +
						'</label></div>' +*/
						'<div style="display:inline-block">' +
						'<label class="css-input css-radio css-radio-warning push-10-r">' +
						'<input type="radio" id="choice" value="1" name="s_radio"><span></span> 本部门' +
						'</label></div>' +
						'<div style="display:inline-block">' +
						'<label class="css-input css-radio css-radio-warning push-10-r">' +
						'<input type="radio" value="2" name="s_radio" checked><span></span> 其他部门' +
						'</label></div></lable>' +
						'</div>'
					,
					colspan: 1,
					rowspan: 1,
					validate: {
						rules: {
							required: false
						}
					}
				},
				{
					id: 's_departmentId',
					type: 'treecombo',
					label: '机构部门',
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
					id: 's_indexId',
					type: 'input',
					label: '索引号',
					colspan: 1
				}, /*{
					id : 's_stage',
					type : 'input',
					label : '阶段',
					colspan : 1
				},*/ {
					id: 's_confirmStatus',
					label: '认定',
					//type : 'input',
					html: '<div class="form-material">' +
						'<label for="example2-select2-multiple">认定</label>' +
						'<select class="js-select2" id="s_confirmStatus" name="example2-select2-multiple" style="width: 100%;" data-placeholder="请选择" multiple>' +
						'<option></option><!-- Required for data-placeholder attribute to work with Select2 plugin -->' +
						/*'<option value="1">HTML</option>' +
						'<option value="2">CSS</option>' +
						'<option value="3">JavaScript</option>' +
						'<option value="4">PHP</option>' +
						'<option value="5">MySQL</option>' +
						'<option value="6">Ruby</option>' +
						'<option value="7">AngularJS</option>' +*/
						'</select>' +
						'</div>',
					colspan: 1
					, validate: {
						rules: {
							required: false
						}
					},
					typeAttr: {
						multiple: true
					}
				}, {
					id : 's_userablePlate',
					label : '适用板块',
					//type : 'input',
					html : 	'<div class="form-material bdo-ap-select2">' +
						'<label for="suserablePlate-select2-multi">适用板块</label>' +
						'<select class="js-select2" id="s_userablePlate" name="suserablePlate-select2-multi" style="width: 100%;" data-placeholder="请选择" multiple >' +
						'<option></option> '+
						'</select>' +
						'</div>',
					rowspan: 1,
					colspan : 1
					,validate : {
						rules : {
							required : false
						}
					},
					typeAttr : {
						multiple : true
					}
				}
			]
		}
		, searchForm: null
		, getDefaultFilter() {
			return {
				menuId: window.sys_menuId,
				sqlId: 'DG00001'
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

			var setClass = (a, b, ch) => {
				if (a != b) {
					$('#summery' + ch).addClass('ecavp-different');
				} else {
					$('#summery' + ch).removeClass('ecavp-different');
				}
			};

			setClass(data.pplansE, data.splansE, 'E');
			setClass(data.pplansC, data.splansC, 'C');
			setClass(data.pplansA, data.splansA, 'A');
			setClass(data.pplansV, data.splansV, 'V');
			setClass(data.pplansP, data.splansP, 'P');
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
