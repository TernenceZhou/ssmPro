/**
 *
 */
var AuditProgramDetailPage = (agrs) => {
	var _template
		, mount
		, listener
		, tabPage;
	_template = agrs.template || tplLoader('cpBase/html/auditDetailProgram.html');
	agrs.template = _template;
	$(agrs.region).empty().append(_template);
	OneUI.initHelper('slimscroll');
	let suserablePlateSelect2Multi='';
	let userablePlateSelect2Multi='';
	let getIndustryData = function() {
		let result;
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00002'
			},
			dataType: 'json',
			async: false,
			success: function(data) {
				result = data.data;
			}
		});
		return result;
	};
	let industryData = getIndustryData();
	let checkIndustryClose = false;
	//下拉框得到数据方法
	let example2Select2Multiple = '';
	for (let i in DicJsonlData.responseJSON.审计程序认定) {
		example2Select2Multiple += '<option value="' + i + '">' + DicJsonlData.responseJSON.审计程序认定[i] + '</option>';
	}
	for(let i in DicJsonlData.responseJSON['适用板块']){
		suserablePlateSelect2Multi += '<option value="' + i + '">' + DicJsonlData.responseJSON['适用板块'][i]+ '</option>';
		userablePlateSelect2Multi += '<option value="' + i + '">' + DicJsonlData.responseJSON['适用板块'][i]+ '</option>';
	}
	let targetsNo = 0;
	let ecavpComp = {
		props: {
			labelName: String,
			groupReadonly: Boolean,
			ecsVal: String,
			esVal: String,
			prefixed: String
		},
		data(){
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
			esVal(newVal){
				if(this.esValCache[newVal] == 1) {
					this.$parent.jsonData[this.prefixed+'s'+this.labelName] = newVal;
					return;
				}
				let result = newVal;
				result = String(result).replace(/[^\d.]/g, '')
					.replace(/\.{2,}/g, '.')
					.replace('.', '$#$')
					.replace(/\./g, '')
					.replace('$#$', '.')
					.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');

				if(result.indexOf('.')< 0 && result != ''){
					result = parseFloat(result);
				}
				if(parseFloat(result) > 3){
					result = 3;
				}
				this.esVal = result;

				this.$parent.jsonData[this.prefixed+'s'+this.labelName] = this.esVal;
				if(!this.esValCache[this.esVal]) this.esValCache[this.esVal] = 1;
				//console.log(this.$parent.jsonData);
			},
			ecsVal(newVal, oldVal){
				if(newVal === true) {
					if(!this.esVal || this.esVal == '') {
						this.esVal = 0.00;
					}
					this.esValMin = 0.00;
				}else {
					this.esVal = '';
					this.esValMin = 0.00;
				}
				this.esValRequired = newVal;
				this.$parent.jsonData[this.prefixed+'cs'+this.labelName] = newVal;
			}
		},
		template: `
					<div class="col-md-2">
						<!--<div class="col-md-2">-->
							<label  :class="checkboxGroupClass">
								<input type="checkbox"  v-model="ecsVal" value="1">
								<span></span>
								{{labelName}}
							</label>
						<!--</div>-->
						<!--<label class="col-md-2 control-label" for="ecavpcomp_cs">分数</label>
						<div class="col-md-6">
							<input :name="elName" class="form-control" type="number" v-model="esVal" :min="esValMin" :disabled="esValDisabled">
						</div>-->
					</div>
		`
	};
	Vue.component('ecavp-comp', ecavpComp);
	let page = new Page({
		/**
		 * 根节点
		 */
		container: '#main-container',
		/**
		 * 绑定事件
		 */
		events: {
			'#auditprogramTable .edit-audit-program': 'click,onEditAuditProgramClick',
			'#newAuditprogramBtn': 'click,onNewAuditprogramClick',
			'#searchBtn': 'click,onSearchClick',
			'#searchResetBtn': 'click,onSearchResetClick',
			'#editAuditprogramModal': 'hidden.bs.modal,onHiddenAPModal',
			'#modal_subjectid_sure_addOrUpdate': 'click,onSelectIndustry',
			'#modal_subjectid_reset': 'click,onIndustryReset',
			'#modal_subjectid_sure': 'click,onIndustryOkClick',
			'#importAuditprogramBtn' : 'click,onFileuploadClick',
			'#download_template' : 'click,downloadFileClick',
			'#auditProgramView' : 'click,onAuditProgramViewClick',
			'#otherAuditProgramView' : 'click,onOtherAuditProgramViewClick',
			'#setAuditprogramBtn' : 'click,onSetAuditprogramClick'
		},
		tplEditComp: {
			el: '#draftTemplateName',
			template: '<ul class="list-group" style="padding: 10px 5px;">'
				+ '			<li class="list-group-item"'
				+ '				v-for="(file, index) in fileList"'
				+ '				:fileId="file.autoId"'
				+ '			>'
				+ '				<span class="icon fa fa-file-excel-o text-primary-light"></span>'
				+ '				{{file.fileName}}'
				+ '				<span class="fa fa-close text-danger pull-right" @click="onDelTplFileClick" :data-index="index" v-show="delBtnShow"></span>'
				+ '				<span class="fa fa-download text-danger pull-right" @click="onDownloadTplFileClick" :data-index="index" ></span>'
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
					bdoConfirmBox('提示', '确定删除该模板文件吗？', function(isConfirm) {
						page.auditprogramForm.jsonData.delTemplates.push(tplcomp.fileList[index].autoId);
						tplcomp.fileList.splice(index, 1);
					});
				},
				onDownloadTplFileClick(event) {
					let tplcomp = this;
					let $span = $(event.currentTarget);
					let index = $span.attr('data-index');
					downloadFile('cpBase/KAuditProgram.downloadTemplate.json', {
						param1: tplcomp.fileList[index].autoId
					});
				}
			}
		},
		/**
		 * 编辑画面绑定字段
		 */
		auditprogramJsonData: {
			departmentId: '',
			programName: '',
			indexId: '',
			depIndex: '',
			userIndex: '',
			subjectId: '',
			subjectName: '',
			dgName: '',
			potentialRisk: '',
			draftTemplateName: [],
			draftTemplate: '',
			stage: '',
			stageName: '',
			allIndustryFlag: [],
			industry: '',
			industryName: '',
			description: '',
			required: '',
			userablePlate: '',
			allUserablePlateFlag: '',
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
			sP: '',
			ifOtherSubject: ''
		},
		/**
		 * 编辑画面 form 配置
		 */
		auditprogramFormCnfg: new FormComp({
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 2,
			id: 'auditprogramForm',
			data() {
				return {
					/**
					 * 表单提交ajax 配置
					 */
					ajaxConfig: {
						type: 'POST',
						url: 'cpBase/KAuditProgram.addAuditProgram.json',
						dataType: 'json',
						success: function(data) {
							if(data.success){
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#editAuditprogramModal').modal('hide');
								$('#auditprogramTable').DataTable().ajax.reload();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
								this.jsonData.indexId = window.reindexId;
							}
						}
					},
					/**
					 * 当前处理：add=新增, edit=更新, false=查看（隐藏提交按钮）
					 */
					process: 'add',
					process2: ''
				};
			},
			watch: {
				/**
				 * 处理编辑画面状态更新
				 */
				process(newValue, oldValue) {
					let pvm = this;
					if (!newValue) {
						$(this.$el).find('.form-control').attr('readonly', true);

						this.setAllReadonly(true);
						this.formItem.draftTemplateName.show = true;
						this.formItem.draftTemplate.show = false;
					} else {
						$(this.$el).find('.form-control').attr('readonly', false);

						this.setAllReadonly(false);
						this.formItem.draftTemplateName.show = false;
						this.formItem.draftTemplate.show = true;
						/*if('add2' == newVal) {
							this.formItem.allIndustryFlag.readonly = true;
						}*/
					}
					if (newValue == 'edit' || newValue) {

						if (this.tplEditComp == null) {
							this.tplEditComp = new Vue(page.tplEditComp);
						}

						this.tplEditComp.delBtnShow = (newValue == 'edit' ? true : false);
						this.jsonData.delTemplates = [];
						this.$nextTick(() => {
							this.formItem.draftTemplateName.show = true;
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00003',
									param1: this.jsonData.autoId
								},
								dataType: 'json',
								success: function(data) {
									if (data.success === true) {
										pvm.tplEditComp.fileList = data.data;
									}
								}
							});
						});
					}
				},
				'jsonData.allIndustryFlag'(newVal, oldVal) {
					if (newVal == true) {
						this.formItem.industry.readonly = true;
						this.jsonData.industry = null;
					} else {
						this.formItem.industry.readonly = false;
					}
				},
				'jsonData.industry'(newVal, oldVal) {
				},
				'jsonData.stage'(newVal, oldVal) {
				},
				'jsonData.confirmStatus'(newVal, oldVal) {
				},
				'jsonData.subjectId'(newVal, oldVal) {
					// this.jsonData.indexId = newVal;
					page.auditprogramForm.jsonData.indexId = newVal;
				}
			},
			tplEditComp: null,
			computed: {
				allIndustryFlagClass() {
					if (this.formItem.allIndustryFlag.readonly == true) {
						return 'css-input css-input-disabled css-checkbox css-checkbox-primary control-label';
					}
					return 'css-input css-checkbox css-checkbox-primary control-label';
				},
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
			methods: {
				/**
				 * 提交编辑画面表单
				 */
				onSaveAudtiprogramClick(evt) {
					console.log(this.jsonData.type,'type');
					if(!this.$form.valid()) {
						return;
					}

					if (!$('#userablePlate').val()) {
						bdoErrorBox('系统提示', "适用板块不能为空,请重新选择！");
						return;
					}
					// 判断当前多选中是否有全部这个选项， 若有， 则将flag置为1
					let plateArr = $("#userablePlate").val();
					this.jsonData.userablePlate = $('#userablePlate').val().join(',');
					this.jsonData.allUserablePlateFlag = '0';
					for (let j = 0 , len = plateArr.length; j < len; j++) {
						if (plateArr[j] == "全部") {
							this.jsonData.userablePlate = '全部';
							this.jsonData.allUserablePlateFlag = '1';
						}
					}

					let jsonData = {};
					$.each(this.jsonData, (key, val) => {
						jsonData[key] = val;
					});
					window.reindexId = jsonData.indexId;
					// 用户索引前位补零，上限4位数字
					if (jsonData.userIndex != "" && jsonData.userIndex.length < 4 ) {
						jsonData.userIndex = (Array(4).join(0)+jsonData.userIndex).slice(-4);
					}else {
						jsonData.userIndex =  jsonData.userIndex
					}
					if ((jsonData.userIndex != "" && jsonData.userIndex.length == 4) &&
						(jsonData.indexId != "" && jsonData.indexId.length==4) && (jsonData.deptIndex != "" && jsonData.deptIndex.length == 4) ) {
						jsonData.indexId = jsonData.indexId +  '-' + jsonData.deptIndex + '-' + jsonData.userIndex;
					}
					if (jsonData.allIndustryFlag) {
						jsonData.allIndustryFlag = '0';
					} else {
						jsonData.allIndustryFlag = '1';
					}
					if (this.process == 'add') {
						this.ajaxConfig.url = 'cpBase/KAuditProgram.addAuditProgram.json';

					} else if (this.process == 'edit') {
						this.ajaxConfig.url = 'cpBase/KAuditProgram.updateAuditProgram.json';
					}

					if (jsonData.industry && jsonData.industry != '') {
						jsonData.allIndustryFlag = '0';
					}
					jsonData.stageName = jsonData.stage;
					jsonData.required = (jsonData.required == '是' || jsonData.required == 1 || jsonData.required == true) ? 1 : 0;
					jsonData.csE = page.booleanTranslate(jsonData.csE, true);
					jsonData.csC = page.booleanTranslate(jsonData.csC, true);
					jsonData.csA = page.booleanTranslate(jsonData.csA, true);
					jsonData.csV = page.booleanTranslate(jsonData.csV, true);
					jsonData.csP = page.booleanTranslate(jsonData.csP, true);
					//this.submit(true);
					this.uploadFile(true, {menuId: window.sys_menuId, jsonData: JSON.stringify(jsonData)});
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
						this.formItem.draftTemplateName.show = true;
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							async: false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00003',
								param1: this.jsonData.autoId
							},
							dataType: 'json',
							success: function(data) {
								if (data.success === true) {
									pvm.tplEditComp.fileList = data.data;
								}
							}
						});
					});
				},
				/**
				 * 打开行业选择框
				 * @param event
				 */
				onIndustryFocus(event) {
					let form = this;
					$('#modal_subjectid_sure').hide();
					$('#modal_subjectid_sure_addOrUpdate').show();
					$('#modal_subjectid').modal('show');
					if ($('#subject_tree').hasClass('treeview') && checkIndustry == 2) {
						$('#subject_tree').treeIndustry('reset');
						$('#subject_tree').treeIndustry('expandByNode', form.jsonData.industry);
						return;
					}
					checkIndustry = 2;
					$('#subject_tree').treeIndustry({
						url: 'localData/data/extDef/industryAllComboInfo.jsonl',
						params: {
							searchInputId: 'searchInput1'
						},
						lazyLoad2: false,
						view: {
							leafIcon: 'fa fa-building text-flat',
							nodeIcon: 'fa fa-bank text-primary-light',
							folderSelectable: false,
							multiSelect: false,
							showCheckbox: true,
							selectedColor: '',
							selectedBackColor: ''
						},
						isExpand: true
					});
					$('#subject_tree').treeIndustry('reset');
					$('#subject_tree').treeIndustry('expandByNode', form.jsonData.industry);
				}
			},
			/*buttons: [{
				id: 'saveAudtiprogramBtn',
				icon: 'fa-floppy-o',
				style: 'btn-primary',
				text: '保存',
				typeAttr: {
					'v-on:click': 'onSaveAudtiprogramClick',
					'v-show': 'process'
				}
			}, {
				id: 'cancelAudtiprogramtBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					//'v-on:click' : 'onCancelAudtiprogramtClick',
					'data-dismiss': 'modal'
				}
			}],*/
			items: [{
				id: 'saveAudtiprogramBtn',
				type: 'button',
				rowspan : 1,
				colspan : 2,
				typeAttr: {
					'v-on:click': 'onSaveAudtiprogramClick',
					'v-show': 'process',
					'style': 'float: right;margin-top: -30px;color: #fff; background-color: #5c90d2; border-color: #3675c5;border-radius: 2px;'
				}
			}, {
				id: 'cancelAudtiprogramtBtn',
				type: 'button',
				colspan: 2,
				typeAttr: {
					'style': 'float: right; margin-top: -30px;color: #fff; background-color: #f3b760; border-color: #f3b760;border-radius: 2px;',
					'data-dismiss': 'modal'
				}
			},
				{
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
					html: `<div class="form-material has-success input-group"> 
								<input onkeyup="this.value=this.value.replace(/\\D/g,'')" onafterpaste="this.value=this.value.replace(/\\D/g,'')" maxlength="4" required="required" readonly="readonly" disabled="disabled" id="indexId" name="indexId" v-model="jsonData.indexId"  placeholder="科目索引" class="form-control" aria-required="true" style="box-shadow: rgb(70, 195, 123) 0px 1px 0px;"/>
								<span class="input-group-addon">-</span>
								<input onkeyup="this.value=this.value.replace(/\\D/g,'')" onafterpaste="this.value=this.value.replace(/\\D/g,'')" maxlength="4" required="required" readonly="readonly" disabled="disabled" id="deptIndex" name="deptIndex" v-model="jsonData.deptIndex" placeholder="部门索引" class="form-control" aria-required="true" style="box-shadow: rgb(70, 195, 123) 0px 1px 0px;"/>
								<span class="input-group-addon">-</span>
								<input onkeyup="this.value=this.value.replace(/\\D/g,'')" onafterpaste="this.value=this.value.replace(/\\D/g,'')" value="" maxlength="4" required="required" id="userIndex" name="userIndex" v-model="jsonData.userIndex" placeholder="自定义索引" class="form-control" aria-required="true" style="box-shadow: rgb(70, 195, 123) 0px 1px 0px;"/>
								<label style="color: rgb(70, 195, 123);">索引号<span class="necessary">*</span></label>
							</div>`,
					colspan: 1,
					validate: {
						rules: {
							required: true
						}
					}
				}, {
					id: 'departmentId',
					type: 'treecombo',
					label: '机构部门',
					rowspan: 1,
					colspan: 1,
					validate: {
						rules: {
							required: true
						}
					},
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
					id: 'required',
					type: 'combo',
					label: '是否必须',
					colspan: 1,
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
						stores: function() {
							return ComboLabelValueDicData(false, 'boolean');
						}
					}
				}, {
					id: 'subjectId',
					type: 'treecombo',
					label: '科目',
					rowspan: 1,
					colspan: 1,
					validate: {
						rules: {
							required: true
						}
					},
					plugin: {
						name: 'treecombo',
						options: {
							url: './cpBase/TreeCommon.findSubjectTree.json',
							params: {},
							view: {
								leafIcon: 'fa fa-building text-flat',
								nodeIcon: 'fa fa-bank text-primary-light',
								folderSelectable: true,
								multiSelect: false
							},
							nodeSelectedCallback(tree, data) {
								this.jsonData.subjectName = data.content;
							}
						}
					}
				}, {
					id: 'stage',
					type: 'combo',
					label: '阶段',
					colspan: 2,
					validate: {
						rules: {
							required: true
						}
					},
					plugin: {
						name: 'combo',
						options: {
							noneSelectedText: '请选择'
						},
						stores: function() {
							return ComboLabelValueDicData(false, '审计程序阶段');
						}
					}
				}, {
					id: 'confirmGrop',
					html: `
							<div class="form-material"><label>认定</label></div>
							<div class="row " style="margin-bottom: 1.2em;margin-top: 1.2em;">
								<ecavp-comp :prefixed="''" :label-name="'E'" :ecs-val="jsonData.csE" :es-val="jsonData.sE" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
								<ecavp-comp :prefixed="''" :label-name="'C'" :ecs-val="jsonData.csC" :es-val="jsonData.sC" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
								<ecavp-comp :prefixed="''" :label-name="'A'" :ecs-val="jsonData.csA" :es-val="jsonData.sA" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
								<ecavp-comp :prefixed="''" :label-name="'V'" :ecs-val="jsonData.csV" :es-val="jsonData.sV" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
								<ecavp-comp :prefixed="''" :label-name="'P'" :ecs-val="jsonData.csP" :es-val="jsonData.sP" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
							</div>
						`,
					rowspan: 1,
					colspan: 2,
					readonly: false
				},{
					id: 'allIndustryFlag',
					html: '<div class="form-material"><label>是否适用于所有</label></div>'
						+'<div style="padding: 10px 0;">'
						+'	<label :class="allIndustryFlagClass">'
						+'		<input type="checkbox" id="allIndustryFlag" name="allIndustryFlag" v-model="jsonData.allIndustryFlag" :disabled="formItem.allIndustryFlag.readonly">'
						+'		<span></span>'
						+'		适用于所有'
						+'	</label>'
						+'</div>',
					rowspan : 1,
					colspan : 1,
					readonly : false
				}, {
					id: 'industryName',
					type: 'input',
					label: '选择行业',
					colspan: 1,
					validate: {
						rules: {
							required: false
						}
					},
					typeAttr: {
						//multiple : true
						':data-value': 'jsonData.industry',
						'v-model': 'jsonData.industryName',
						'@focus': 'onIndustryFocus'
					},
					plugin: {
						name: 'combo',
						options: {
							noneSelectedText: '请选择',
							multipleSeparator: ',',
							width: '250px',
							size: 7
						},
						stores: industryData
					}
				}, {
					id: 'industry',
					type: 'input',
					typeAttr: {
						type: 'hidden',
						'v-show': 'false'
					},
					rowspan: 1
				}, {
					id : 'userablePlate',
					label : '适用板块',
					rowspan : 1,
					colspan : 2,
					html : 	'<div class="form-material bdo-ap-select2">' +
						'<label for="userablePlate-select2-multi">适用板块</label>' +
						'<select class="js-select2" id="userablePlate" name="userablePlate-select2-multi" style="width: 100%;" data-placeholder="请选择" multiple >' +
						'<option></option> '+
						'</select>' +
						'</div>',
					validate : {
						rules : {
							required : true
						}
					},
					typeAttr : {
						multiple : true
					}
				}, {
					id: 'programName',
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
					id: 'potentialRisk',
					type: 'textarea',
					label: '潜在风险说明',
					rowspan: 1,
					colspan: 2,
					typeAttr: {
						rows: 3
					},
					validate: {
						rules: {
							required: true
						}
					}
				}, {
					id: 'description',
					type: 'textarea',
					label: '具体事项说明',
					rowspan: 1,
					colspan: 2,
					typeAttr: {
						rows: 3
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
							uploadUrl: 'cpBase/KAuditProgram.uploadFile.json',
							allowedFileExtensions: ['xlsx'],//允许的文件类型]
							maxFilesNum: 1,
							uploadExtraData: function() {
								return {
									/*parentId: commentFormModel.folderId,
									customerId: taskDetailVm.jsonData.groupId*/
								};
							}
						}
					}
				}]
		}),
		/**
		 * 编辑/新增画面表单
		 */
		auditprogramForm: null,
		getVal(val) {
			return val == '1' ? 'checked' : '';
		},
		getConfirmStatus(data, score) {
			let result = '<label class="css-input css-checkbox css-checkbox-primary control-label" >'
				+ '			<input type="checkbox" ' + this.getVal(data) + ' disabled>'
				+ '			<span></span>'
				+ '		</label>'
				+ '<div>' + (score && data == '1' ? score : 0) + '</div>';
			return result;
		},
		/**
		 * 一览配置
		 */
		auditprogramTableCnfg: {
			tabNum: true,
			scrollX: true,
			lengthChange: true,
			order: [2, 'asc'],
			ordering: false,
			pageLength : 30,
			sourceData: {},
			sourceUrl: 'dgCenter/DgGeneral.query.json',
			filterParam: {
				menuId: window.sys_menuId,
				sqlId: 'DG00063',
				param1: window.departIdrSession,
				param2: '1'
			},
			createdRow(row, data, dataIndex) {
				if(data.customizeId != null && data.customizeId != ''){
                    $(row).css('color', '#090');
                }
			},
			tableColumns: [
				{
					targets: ++targetsNo,
					orderable: false,
					className: 'text-center',
					title: '处理',
					data: null,
					width: '150px',
					render: function(data, type, row, meta) {
						let renderStr = '';
						if(agrs.data.useType == '1'){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate edit-audit-program edit" data-row="' + meta.row + '" type="button" data-action="edit" name="" data-placement="top" title="修改" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-success table-btn-operate get-audit-program" data-row="' + meta.row + '" type="button" data-action="add" name="" data-placement="top" title="引用" data-toggle="tooltip">'
								+ '<i class="fa fa-external-link"></i></button>';
						}
						renderStr += '<button class="btn btn-xs btn-primary table-btn-operate view-audit-program" data-row="' + meta.row + '" type="button" data-action="detail" name="" data-placement="top" title="查看" data-toggle="tooltip">'
							+ '<i class="fa fa-eye"></i></button>';
						if(agrs.data.useType == '1'){
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate del-audit-program" data-row="' + meta.row + '" type="button" data-action="del" name="" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-close"></i></button>';
							if(row.ACTIVE_FLAG == '1') {
								renderStr += '<button class="btn btn-xs btn-danger table-btn-operate invalid-audit-program" data-row="'+meta.row+'" type="button" data-action="invalid" name="" data-placement="top" title="作废" data-toggle="tooltip">'
									+ '<i class="fa fa-ban"></i></button>';
							}else if(row.ACTIVE_FLAG == '0') {
								renderStr += '<button class="btn btn-xs btn-warning table-btn-operate cancel-invalid-audit-program" data-row="'+meta.row+'" type="button" data-action="cancelInvalid" name="" data-placement="top" title="取消作废" data-toggle="tooltip">'
									+ '<i class="fa fa-check-circle-o"></i></button>';
							}
						}
						return renderStr;
					}
				}, {
					targets: ++targetsNo,
					orderable: true,
					title: '机构部门',
					name: 'departmentId',
					data: 'departmentId',
					width: '150px',
					render(data, type, row, meta) {
						if (row.__ddepartmentIdName == undefined) {
							return row.name;
						} else {
							return row.__ddepartmentIdName;
						}
					}
				}, {
					targets: ++targetsNo,
					orderable: true,
					title: '程序名称',
					name: 'dgName',
					data: 'dgName',
					width: '150px'
				}, {
					targets: ++targetsNo,
					orderable: true,
					title: '程序内容',
					name: 'programName',
					data: 'programName',
					width: '300px',
					className: 'text-ellipsis'
				}, {
					targets: ++targetsNo,
					orderable: true,
					title: '索引号',
					name: 'indexId',
					data: 'indexId',
					width: '150px'
				}, {
					targets: ++targetsNo,
					orderable: false,
					title: '标准科目',
					name: 'subject',
					//data : 'subjectName',
					width: '90px',
					render(data, type, row, meta) {
						return row.subjectId + '-' + row.subjectName;
					}
				},{
					targets: ++targetsNo,
					orderable: false,
					title: 'E',
					name: 'E',
					data: 'csE',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return page.getConfirmStatus(data, row.sE);
					}
				}, {
					targets: ++targetsNo,
					orderable: false,
					title: 'C',
					name: 'C',
					data: 'csC',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return page.getConfirmStatus(data, row.sC);
					}
				}, {
					targets: ++targetsNo,
					orderable: false,
					title: 'A',
					name: 'A',
					data: 'csA',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return page.getConfirmStatus(data, row.sA);
					}
				}, {
					targets: ++targetsNo,
					orderable: false,
					title: 'V',
					name: 'V',
					data: 'csV',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return page.getConfirmStatus(data, row.sV);
					}
				}, {
					targets: ++targetsNo,
					orderable: false,
					title: 'P',
					name: 'P',
					data: 'csP',
					width: '30px',
					className: 'text-center',
					render(data, type, row, meta) {
						return page.getConfirmStatus(data, row.sP);
					}
				}, {
					targets: ++targetsNo,
					orderable: true,
					title: '行业',
					name: 'industryName',
					data: 'industryName',
					width: '150px'
				}, {
					targets: ++targetsNo,
					orderable: true,
					title: '适用板块',
					name: 'userablePlate',
					data: 'userablePlate',
					width: '150px'
				}, {
					targets : ++targetsNo,
					orderable : true,
					title : '潜在风险说明',
					name : 'potentialRisk',
					data : 'potentialRisk',
					width : '150px'
				}, {
					targets : ++targetsNo,
					orderable : true,
					title : '具体事项说明',
					name : 'description',
					data : 'description',
					width : '150px'
				},{
					targets: ++targetsNo,
					orderable: true,
					title: '是否必须',
					name: 'required',
					data: 'required',
					render(data, type, row, meta) {
						return DicVal2Nm(data, 'boolean');
					},
					width: '150px'
				}, {
					targets: ++targetsNo,
					orderable: true,
					title: '使用量',
					name: 'useCount',
					data: 'useCount',
					className: 'text-center',
					render(data, type, row, meta) {
						return '<button style="width: 100%;" class="btn btn-xs btn-link table-btn-operate link-to-department edit" data-row="' + meta.row + '" type="button" data-action="edit" name="" data-placement="top" title="修改" data-toggle="tooltip">'
							+ '<div>' + data + '</div></button>';
						// return '<div data-row="'+ meta.row + ' class="table-btn-operate link-to-department" ><a href="#">' + data + '</a></div>';
					},
					width: '150px'
				}, {
					targets: ++targetsNo,
					orderable: true,
					title: '创建人',
					name: 'createUser',
					data: 'createUser',
					render(data, type, row, meta) {
						return row.__ucreateUser.userName;
					},
					width: '150px'
				}
			]
		},
		/**
		 * 程序被使用项目
		 */
		useDepartmentTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00080',
					param1: 0,
					limit: -1,
					start: -1
				},
				tabNum: true
			},
			tableParam: {
				select: true,
				ordering: true,
				order: [0, 'asc'],
				serverSide: true,
				columnDefs: [{
					targets: (() => {
						targetsNo = 0;
						return ++targetsNo;
					})(),
					orderable: true,
					title: '机构部门',
					name: 'departmentId',
					data: 'departmentId',
					width: '200px',
					render(data, type, row, meta) {
						return row.__ddepartmentIdName;
					}
				},{
					targets: ++targetsNo,
					orderable: true,
					title: '使用次数',
					name: 'useCount',
					data: 'useCount',
					width: '150px'
				}]
			}
		},
		/**
		 * 检索表单数据绑定对象
		 */
		searchFormJsonData: {
			s_radio: '',
			s_departmentId: window.departIdrSession,
			s_programName: '',
			s_subjectName: '',
			s_confirmStatus: '',
			s_stage: '',
			s_industry: '',
			s_dgName: '',
			s_indexId: '',
			s_potentialRisk:'',
			s_description:'',
			s_confirmStatus: '',
			s_csE: '',
			s_csC: '',
			s_csA: '',
			s_csV: '',
			s_csP: '',
			s_userablePlate:''
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
						type: 'POST',
						url: '',
						dataType: 'json',
						success: function(data) {
						}
					},
					s_departmentId: window.departIdrSession
				};
			},
			watch: {},
			methods: {
				onS_IndustryFocus() {
					$('#modal_subjectid_sure').show();
					$('#modal_subjectid_sure_addOrUpdate').hide();
					$('#modal_subjectid').modal('show');
					if ($('#subject_tree').hasClass('treeview') && checkIndustry == 1) {
						$('#subject_tree').treeIndustry('reset');
						$('#subject_tree').treeIndustry('expandByNode', this.jsonData.s_industry);
						return;
					}
					checkIndustry = 1;
					$('#subject_tree').treeIndustry({
						url: 'localData/data/extDef/industryAllComboInfo.jsonl',
						params: {
							searchInputId: 'searchInput1'
						},
						lazyLoad2: false,
						view: {
							leafIcon: 'fa fa-building text-flat',
							nodeIcon: 'fa fa-bank text-primary-light',
							folderSelectable: false,
							multiSelect: false,
							showCheckbox: true,
							selectedColor: '',
							selectedBackColor: ''
						},
						isExpand: false
					});
					$('#subject_tree').treeIndustry('expandByNode', this.jsonData.s_industry);
				}
			},
			items: [
				{
					id: 's_industry',
					type: 'input',
					rowspan: 1,
					typeAttr: {
						type: 'hidden'
					}
				},
				{
					html: '<div class="form-material"><label>模式</label>' +
						'<lable class="form-control">' +
						'<div style="display:inline-block">' +
						'<label class="css-input css-radio css-radio-warning push-10-r">' +
						'<input type="radio" value="0" name="s_radio"><span></span> 集团' +
						'</label></div>' +
						'<div style="display:inline-block">' +
						'<label class="css-input css-radio css-radio-warning push-10-r">' +
						'<input type="radio" value="1" name="s_radio" checked><span></span> 本部门' +
						'</label></div>' +
						'<div style="display:inline-block">' +
						'<label class="css-input css-radio css-radio-warning push-10-r">' +
						'<input type="radio" value="2" name="s_radio"><span></span> 其他部门' +
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
					validate: {
						rules: {
							//required : true
						}
					},
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
					id: 's_industryName',
					type: 'input',
					label:'行业',
					colspan: 1,
					typeAttr: {
						':data-value': 'jsonData.s_industry',
						'v-model': 'jsonData.s_industryName',
						'@focus': 'onS_IndustryFocus'
					}
				}, {
					id: 's_indexId',
					type: 'input',
					label: '索引号',
					colspan: 1
				},{
					id: 's_confirmStatus',
					label: '认定',
					//type : 'input',
					html: '<div class="form-material">' +
						'		<label for="example2-select2-multiple">认定</label>' +
						'		<select class="js-select2" id="s_confirmStatus" name="example2-select2-multiple" style="width: 100%;" data-placeholder="请选择" multiple>' +
						'			<option></option>' +
						'		</select>' +
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
					id: 's_potentialRisk',
					type: 'input',
					label: '潜在风险说明',
					rowspan: 1
				}, {
					id: 's_description',
					type: 'input',
					label: '具体事项说明',
					colspan: 1
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
					colspan : 1
					,validate : {
						rules : {
							required : false
						}
					},
					typeAttr : {
						multiple : true
					}
				}, {
					id : 's_status',
					label : '状态',
					//type : 'input',
					html : 	'<div class="form-material">' +
						'<label for="s_status_select2">状态</label>' +
						'<select class="js-select2" id="s_status" name="s_status_select2" style="width: 100%;" data-placeholder="请选择">' +
						'<option value="0">作废</option> '+
						'<option value="1" selected>有效</option> '+
						'</select>' +
						'</div>',
					colspan : 1
					,validate : {
						rules : {
							// required : false
						}
					}/*,
					typeAttr : {
						multiple : true
					}*/
				}]
		}),
		/**
		 * 初始化方法
		 */
		init(options) {
			// 初始化一览table
			if(agrs.data.useType == '2'){
				$('#importAuditprogramBtn').css('display', 'none');
				this.auditprogramTableCnfg.filterParam.param4 = agrs.data.templateId;
				this.auditprogramTableCnfg.tableColumns.splice(0, 0, {
					targets : 1,
					orderable : false,
					className : 'text-left',
					title : '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input class="check-all-program" name="chkAllProgram" type="checkbox" value=""><span></span></label>',
					data : null,
					width : '10px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<div align="center"><label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox" class="check-current-program" name="chkAuditProgram" value="'
							+ row.autoId + '"><span></span></label></div>';
						return renderStr;
					}
				})
				this.auditprogramTableCnfg.tableColumns.forEach(function(value, index, array){
					value.targets = index + 1;
				})
			}else{
				$('#setAuditprogramBtn').css('display', 'none');
			}
			BdoDataTables('auditprogramTable', this.auditprogramTableCnfg);
			// 绑定table处理按钮事件
			$('#auditprogramTable').on('click', '.edit-audit-program', this.onEditAuditProgramClick);
			$('#auditprogramTable').on('click', '.get-audit-program', this.onGetAnotherAuditProgramClick);
			$('#auditprogramTable').on('click', '.view-audit-program', this.onViewAuditProgramClick);
			$('#auditprogramTable').on('click', '.del-audit-program', this.onDelAuditProgramClick);
			$('#auditprogramTable').on('click', '.invalid-audit-program', this.onInvalidAuditProgramClick);
			$('#auditprogramTable').on('click', '.cancel-invalid-audit-program', this.onCancelInvalidAuditProgramClick);
			$('#auditprogramTable').on('click', '.table-btn-operate.link-to-department', this.onLinkToDepartmentClick);
			$('input[name="chkAllProgram"]').on('click', this.onCheckAllProgram);
			// 初始化编辑画面表单
			let APFormComp = Vue.extend(this.auditprogramFormCnfg);
			this.auditprogramForm = new APFormComp({
				propsData: {
					jsonData: this.auditprogramJsonData
				}
			});
			this.auditprogramForm.$mount('#auditprogramForm');
			// 初始化搜索表单
			let SearchFormComp = Vue.extend(this.searchFormCnfg);
			this.searchForm = new SearchFormComp({
				propsData: {
					jsonData: this.searchFormJsonData
				}
			});
			$('#saveAudtiprogramBtn').text('保存');
			$('#cancelAudtiprogramtBtn').text('关闭');

			this.searchForm.$mount('#searchForm');
			this.searchForm.jsonData.s_departmentId = window.departNmSession;
			//加载oneUI的多选框
			$('.js-select2').select2();
			//修改oneUI多选框的样式
			$('.select2').addClass('form-control');
			$('.select2-selection').attr('style', 'border-bottom: 0px');
			$('#s_confirmStatus').append(example2Select2Multiple);
			//默认检索菜单机构禁止选择
			$('#s_departmentId').attr('disabled', true);
			$('#caret_s_departmentId').attr('disabled', true);

			$('#s_userablePlate').append(suserablePlateSelect2Multi);
			$('#userablePlate').append(userablePlateSelect2Multi);
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


			// 表单中下拉事件
			$('#userablePlate').on("select2:select",function(e){
				if (e.params.data.text == '全部') {
					$("#userablePlate").val('全部').trigger("change");
				} else {
					let plateArr = $("#userablePlate").val();
					for (let k = 0, len = plateArr.length; k < len; k++) {
						if (plateArr[k] == '全部') {
							$("#userablePlate").val(e.params.data.id).trigger("change");
						}
					}
				}
			})
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
		},
		updateCompetitive(param) {
			$.ajax(
				{
					type: 'post',
					url: 'cpBase/KAuditProgram.updateAuditProgram.json',
					async: false,
					data: param,
					dataType: 'json',
					success: function(data) {
						if (data.success === true) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
							//$('#auditprogramTable').DataTable().ajax.reload();
							$('#auditprogramTable').DataTable().draw(false);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			);
		},

		/**
		 * 关闭编辑画面
		 */
		onHiddenAPModal(event) {
			page.auditprogramForm.process = '';
		},
		/**
		 *
		 */
		booleanTranslate(value, flag) {
			return (!flag ? value == '1' : (value == true ? '1' : '0'));
		},

		/**
		 * 引用按钮点击事件
		 */
		onGetAnotherAuditProgramClick(event) {
			checkIndustryClose = false;
			//modal可以拖动
			$('#editAuditprogramModal').on('show.bs.modal', function() {
				$(this).draggable({
					handle: '.block-header',
					cursor: 'move'
				});
				$(this).css('overflow', 'hidden');
			});
			// 显示 modal
			$('#editAuditprogramModal').find('h3.block-title').text('引用审计程序');
			$('#editAuditprogramModal').modal('show');
			// 获取当前列数据
			let table = $('#auditprogramTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			let arrayIndex = rowData.indexId.split('-');

			if (rowData.userablePlate) {
				let userablePlateArr = rowData.userablePlate.split(',');
				$('#userablePlate').val(userablePlateArr).trigger('change');
			} else {
				$('#userablePlate').val([]).trigger('change');
			}

			if (rowData.ifOtherSubject == '1') {
				$.each(page.auditprogramFormCnfg.items,(function(index,element){
					if (element.id == 'subjectId') {
						$('#subjectId').treecombo(true).options.params.param10 = '1';
					}
				}))
			} else {
				$.each(page.auditprogramFormCnfg.items,(function(index,element){
					if (element.id == 'subjectId') {
						$('#subjectId').treecombo(true).options.params.param10 = '0';
					}
				}))
			}
			// 设置 modal 画面数据
			page.auditprogramForm.jsonData = {
				dgName: rowData.dgName,
				departmentId: window.departIdrSession,
				programName: rowData.programName,
				deptIndex:window.departIdrSession ,
				userIndex:arrayIndex[2],
				indexId: arrayIndex[0] ? arrayIndex[0] : '',
				subjectId: rowData.subjectId,
				subjectName: rowData.subjectName,
				potentialRisk: rowData.potentialRisk,
				draftTemplate: [],
				stage: rowData.stage,
				stageName: rowData.stageName,
				allIndustryFlag: (rowData.allIndustryFlag == 1 ? true : false),
				industry: (rowData.allIndustryFlag == 1 ? null : rowData.industry),
				industryName: rowData.industryName,
				description: rowData.description,
				required: rowData.required,
				csE: page.booleanTranslate(rowData.csE),
				csC: page.booleanTranslate(rowData.csC),
				csA: page.booleanTranslate(rowData.csA),
				csV: page.booleanTranslate(rowData.csV),
				csP: page.booleanTranslate(rowData.csP),
				sE: rowData.sE,
				sC: rowData.sC,
				sA: rowData.sA,
				sV: rowData.sV,
				sP: rowData.sP,
				ifOtherSubject: rowData.ifOtherSubject
			};
			page.auditprogramForm.process = 'add';
		},
		/**
		 * 编辑按钮点击事件
		 */
		onEditAuditProgramClick(event) {
			checkIndustryClose = false;
			//modal可以拖动
			$('#editAuditprogramModal').on('show.bs.modal', function() {
				$(this).draggable({
					handle: '.block-header',
					cursor: 'move'
				});
				$(this).css('overflow', 'hidden');
			});
			// 获取当前列数据
			let table = $('#auditprogramTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			let departmentId = (rowData.__ddepartmentId.departId == null ? BdoFaithConsts.DEPARTMENT_BDO : rowData.__ddepartmentId.departId);
			let departmentIdRow = departmentId;
			if(departmentId == window.departIdrSession) {
				departmentId = window.departIdSession;
			}
			let check = null;

			$('#departmentId').attr('disabled', false);
			// 显示 modal
			$('#editAuditprogramModal').find('h3.block-title').text('更新审计程序');
			$('#departmentId').attr("disabled","disabled");
			$('#editAuditprogramModal').modal('show');
			// 获取当前列数据
			table = $('#auditprogramTable').dataTable();
			rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			let arrayIndex = rowData.indexId.split('-');

			if (rowData.userablePlate) {
				let userablePlateArr = rowData.userablePlate.split(',');
				$('#userablePlate').val(userablePlateArr).trigger('change');
			} else {
				$('#userablePlate').val([]).trigger('change');
			}
			if (rowData.ifOtherSubject == '1') {
				$.each(page.auditprogramFormCnfg.items,(function(index,element){
					if (element.id == 'subjectId') {
						$('#subjectId').treecombo(true).options.params.param10 = '1';
					}
				}))
			} else {
				$.each(page.auditprogramFormCnfg.items,(function(index,element){
					if (element.id == 'subjectId') {
						$('#subjectId').treecombo(true).options.params.param10 = '0';
					}
				}))
			}
			// 设置 modal 画面数据
			page.auditprogramForm.jsonData = {
				autoId: rowData.autoId,
				departmentId: departmentIdRow,
				programName: rowData.programName,
				indexId: arrayIndex[0] ? arrayIndex[0] : '',
				deptIndex: arrayIndex[1] ? arrayIndex[1] : '' ,
				userIndex: arrayIndex[2] ? arrayIndex[2] : '',
				dgName: rowData.dgName,
				subjectId: rowData.subjectId,
				subjectName: rowData.subjectName,
				potentialRisk: rowData.potentialRisk,
				draftTemplate: [],
				stage: rowData.stage,
				stageName: rowData.stageName,
				allIndustryFlag: (rowData.allIndustryFlag == 1 ? true : false),
				industry: (rowData.allIndustryFlag == 1 ? null : rowData.industry),
				industryName: rowData.industryName,
				description: rowData.description,
				required: rowData.required,
				csE: page.booleanTranslate(rowData.csE),
				csC: page.booleanTranslate(rowData.csC),
				csA: page.booleanTranslate(rowData.csA),
				csV: page.booleanTranslate(rowData.csV),
				csP: page.booleanTranslate(rowData.csP),
				sE: rowData.sE,
				sC: rowData.sC,
				sA: rowData.sA,
				sV: rowData.sV,
				sP: rowData.sP,
				ifOtherSubject: rowData.ifOtherSubject
			};
			page.auditprogramForm.process = 'edit';
			page.auditprogramForm.formItem.draftTemplateName.show = true;
		},
		/**
		 * 查看数据详细信息
		 */
		onViewAuditProgramClick(event) {
			checkIndustryClose = true;
			// 显示 modal
			$('#editAuditprogramModal').find('h3.block-title').text('审计程序');
			$('#editAuditprogramModal').modal('show');
			// 获取当前列数据
			let table = $('#auditprogramTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			let arrayIndex = rowData.indexId.split('-');

			if (rowData.userablePlate) {
				let userablePlateArr = rowData.userablePlate.split(',');
				$('#userablePlate').val(userablePlateArr).trigger('change');
			} else {
				$('#userablePlate').val([]).trigger('change');
			}

			if (rowData.ifOtherSubject == '1') {
				$.each(page.auditprogramFormCnfg.items,(function(index,element){
					if (element.id == 'subjectId') {
						$('#subjectId').treecombo(true).options.params.param10 = '1';
					}
				}))
			} else {
				$.each(page.auditprogramFormCnfg.items,(function(index,element){
					if (element.id == 'subjectId') {
						$('#subjectId').treecombo(true).options.params.param10 = '0';
					}
				}))
			}
			// 设置 modal 画面数据
			page.auditprogramForm.jsonData = {
				autoId: rowData.autoId,
				departmentId: (rowData.__ddepartmentId.departId == null ? BdoFaithConsts.DEPARTMENT_BDO : rowData.__ddepartmentId.departId),
				programName: rowData.programName,
				indexId: arrayIndex[0],
				deptIndex: arrayIndex[1],
				userIndex: arrayIndex[2],
				dgName: rowData.dgName,
				subjectId: rowData.subjectId,
				subjectName: rowData.subjectName,
				potentialRisk: rowData.potentialRisk,
				stage: rowData.stage,
				stageName: rowData.stageName,
				allIndustryFlag: (rowData.allIndustryFlag == 1 ? true : false),
				industry: (rowData.allIndustryFlag == 1 ? null : rowData.industry),
				industryName: rowData.industryName,
				description: rowData.description,
				required: rowData.required,
				csE: page.booleanTranslate(rowData.csE),
				csC: page.booleanTranslate(rowData.csC),
				csA: page.booleanTranslate(rowData.csA),
				csV: page.booleanTranslate(rowData.csV),
				csP: page.booleanTranslate(rowData.csP),
				sE: rowData.sE,
				sC: rowData.sC,
				sA: rowData.sA,
				sV: rowData.sV,
				sP: rowData.sP,
				ifOtherSubject: rowData.ifOtherSubject
			};
			page.auditprogramForm.process = false;
		},
		/**
		 * 删除按钮点击事件
		 */
		onDelAuditProgramClick(event) {
			let table = $('#auditprogramTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			let departmentId_ = (rowData.__ddepartmentId.departId == null ? BdoFaithConsts.DEPARTMENT_BDO : window.departIdrSession);
			let departmentIdRow = departmentId_;
			/*if(departmentId_ == window.departIdrSession) {
				departmentId_ = window.departIdSession;
			}*/
			let check = null;
			$.ajax({
				type: 'post',
				url: 'cpBase/KAuditProgram.checkAuthority.json',
				async: false,
				bdolxLoader: false,
				data: {
					menuId: window.sys_menuId,
					param1: departmentId_
				},
				dataType: 'json',
				success: function(data) {
					if (data.resultInfo.statusText == '1') {
						check = true;
					} else {
						check = false;
					}
				}
			});
			if (!check) {
				bdoInfoBox('提示','用户无部门权限!');
				return null;
			}
			bdoConfirmBox('提示', '确定删除该数据吗？', function(isConfirm) {
				if (CUR_USERID != rowData.__ucreateUser.userId){
					bdoInfoBox('提示','只有创建者才能删除审计程序!');
					return false;
				}
				$.ajax({
					type: 'post',
					url: 'cpBase/KAuditProgram.delAuditProgram.json',
					async: false,
					data: {
						param1: rowData.autoId,
						menuId: window.sys_menuId,
						param2: departmentIdRow,
						param10: rowData.fullPath
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#auditprogramTable').DataTable().draw(false);
							//$('#auditprogramTable').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		},
		/**
		 * 作废按钮点击事件
		 */
		onInvalidAuditProgramClick(event) {
			let table = $('#auditprogramTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			let departmentId_ = (rowData.__ddepartmentId.departId == null ? BdoFaithConsts.DEPARTMENT_BDO : window.departIdrSession);
			let departmentIdRow = departmentId_;
			/*if(departmentId_ == window.departIdrSession) {
				departmentId_ = window.departIdSession;
			}*/
			let check = null;
			$.ajax({
				type: 'post',
				url: 'cpBase/KAuditProgram.checkAuthority.json',
				async: false,
				bdolxLoader: false,
				data: {
					menuId: window.sys_menuId,
					param1: departmentId_
				},
				dataType: 'json',
				success: function(data) {
					if (data.resultInfo.statusText == '1') {
						check = true;
					} else {
						check = false;
					}
				}
			});
			if (!check) {
				bdoInfoBox('提示','用户无部门权限!');
				return null;
			}
			bdoConfirmBox('提示', '确定作废该数据吗？', function(isConfirm) {
				if (CUR_USERID != rowData.__ucreateUser.userId){
					bdoInfoBox('提示','只有创建者才能作废审计程序!');
					return false;
				}
				$.ajax({
					type: 'post',
					url: 'cpBase/KAuditProgram.invalidAuditProgram.json',
					// async: false,
					data: {
						menuId: window.sys_menuId,
						param1: rowData.autoId
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#auditprogramTable').DataTable().draw(false);
							//$('#auditprogramTable').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		},
		/**
		 * 取消作废按钮点击事件
		 */
		onCancelInvalidAuditProgramClick(event) {
			let table = $('#auditprogramTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			let departmentId_ = (rowData.__ddepartmentId.departId == null ? BdoFaithConsts.DEPARTMENT_BDO : window.departIdrSession);
			let departmentIdRow = departmentId_;
			/*if(departmentId_ == window.departIdrSession) {
				departmentId_ = window.departIdSession;
			}*/
			let check = null;
			$.ajax({
				type: 'post',
				url: 'cpBase/KAuditProgram.checkAuthority.json',
				async: false,
				bdolxLoader: false,
				data: {
					menuId: window.sys_menuId,
					param1: departmentId_
				},
				dataType: 'json',
				success: function(data) {
					if (data.resultInfo.statusText == '1') {
						check = true;
					} else {
						check = false;
					}
				}
			});
			if (!check) {
				bdoInfoBox('提示','用户无部门权限!');
				return null;
			}
			bdoConfirmBox('提示', '确定取消作废该数据吗？', function(isConfirm) {
				if (CUR_USERID != rowData.__ucreateUser.userId){
					bdoInfoBox('提示','只有创建者才能取消作废审计程序!');
					return false;
				}
				$.ajax({
					type: 'post',
					url: 'cpBase/KAuditProgram.cancelInvalidAuditProgram.json',
					// async: false,
					data: {
						menuId: window.sys_menuId,
						param1: rowData.autoId
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#auditprogramTable').DataTable().draw(false);
							//$('#auditprogramTable').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		},
		/**
		 * 查看使用部门
		 * @param event
		 */
		onLinkToDepartmentClick(event) {
			let table = $('#auditprogramTable').dataTable();
			let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			$('#useDepartmentModal #useDepartmentTableWrap').empty().html('<table id="useDepartmentTable" class="table table-bordered table-striped table-hover"></table>');
			page.useDepartmentTableCfg.localParam.urlparam.param1 = rowData.autoId;
			BdoDataTable('useDepartmentTable', page.useDepartmentTableCfg);
			$('#useDepartmentModal').modal('show');
		},

		/**
		 * 全选程序
		 * @param event
		 */
		onCheckAllProgram(event) {
			let table = $('#auditprogramTable').dataTable();
			if ($('input[name="chkAllProgram"]').is(":checked")==true){
				$("input[name='chkAuditProgram']").each(function () {
					this.checked = true;
				});
			}else {
				$("input[name='chkAuditProgram']").each(function () {
					this.checked = false;
				});
			}
		},

		/**
		 * 新增按钮点击事件
		 */
		onNewAuditprogramClick(event) {
			//modal可以拖动
			$('#chooseDifferentAuditModal').on('show.bs.modal', function() {
				$(this).draggable({
					handle: '.block-header',
					cursor: 'move'
				});
				$(this).css('overflow', 'hidden');
			});

			$('#chooseDifferentAuditModal').find('h3.block-title').text('选择审计程序');
			$('#chooseDifferentAuditModal').modal('show');
		},

		/**
		 * 添加审计程序到模板
		 */
		onSetAuditprogramClick(event) {
			var serails = '';
			$('input[name="chkAuditProgram"]:checked').each(function() {
				if (serails == '') {
					serails = $(this).val();
				} else {
					serails = serails + ',' + $(this).val();
				}
			});

			if (serails == '') {
				bdoInfoBox('提示', '请选择审计程序');
				return;
			}
			if(agrs.data.templateId == '' || agrs.data.templateId == null){
				bdoInfoBox('提示', '请选择程序模板');
				return;
			}
			bdoConfirmBox('添加', '是否确认添加？', function() {
				$.ajax({
					url: 'cpBase/AuditProgramTemplate.saveAuditProgramCustomize.json',
					type: 'post',
					data: {
						param1: agrs.data.templateId,
						//param2: subjectId,
						param3: serails
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#auditprogramTable').DataTable().draw(false);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		},

		/**
		 * 标准科目
		 */
		onAuditProgramViewClick(event) {
			$('#editAuditprogramModal').find('h3.block-title').text('新建审计程序-标准科目');

			$.each(page.auditprogramFormCnfg.items,(function(index,element){
				if (element.id == 'subjectId') {
					$('#subjectId').treecombo(true).options.params.param10 = '0';
				}
			}))
			this.onAddAuditprogramClick(event,"0");
			$('#chooseDifferentAuditModal').modal('hide');
		},
		/**
		 * 其他科目
		 */
		onOtherAuditProgramViewClick(event) {
			$('#editAuditprogramModal').find('h3.block-title').text('新建审计程序-其他科目');

			$.each(page.auditprogramFormCnfg.items,(function(index,element){
				if (element.id == 'subjectId') {
					$('#subjectId').treecombo(true).options.params.param10 = '1';
				}
			}))
			this.onAddAuditprogramClick(event,"1");
			$('#chooseDifferentAuditModal').modal('hide');
		},
		/**
		 * 选择不同类型审计程序的用来新增时间
		 */
		onAddAuditprogramClick(event,type) {
			//modal可以拖动
			$('#editAuditprogramModal').on('show.bs.modal', function() {
				$(this).draggable({
					handle: '.block-header',
					cursor: 'move'
				});
				$(this).css('overflow', 'hidden');
			});
			//$('#departmentId').attr('disabled', true);
			$('#departmentId').attr("disabled","disabled");
			$('#editAuditprogramModal').modal('show');


			$("#userablePlate").val('全部').trigger('change');
			page.auditprogramForm.jsonData = {
				departmentId: window.departIdrSession,
				programName: '',
				indexId: '',
				deptIndex: window.departIdrSession,
				userIndex: '',
				dgName: '',
				subjectId: '',
				subjectName: '',
				potentialRisk: '',
				stage: '',
				stageName: '',
				allIndustryFlag: false,
				industry: '',
				industryName: '',
				description: '',
				required: '',
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
			page.auditprogramForm.jsonData.ifOtherSubject = type;
			page.auditprogramForm.process = 'add';
		},
		/**
		 * 搜索按钮点击事件
		 */
		onSearchClick(event) {
			let departmentCheck = true;
			let param = this.searchForm.jsonData;
			if ($('#s_confirmStatus').val() == null) {
				param.s_confirmStatus = '';
			} else {
				param.s_confirmStatus = $('#s_confirmStatus').val().join(',');
			}

			if ($('input[name="s_radio"]:checked').val() == 0) {
				param.s_departmentId = BdoFaithConsts.DEPARTMENT_BDO;
				this.auditprogramTableCnfg.filterParam.param10 = '';
			} else if ($('input[name="s_radio"]:checked').val() == 1) {
				param.s_departmentId = window.departIdrSession;
				this.auditprogramTableCnfg.filterParam.param10 = '';
			} else if ($('input[name="s_radio"]:checked').val() == 2) {
				this.auditprogramTableCnfg.filterParam.param10 = '';
				if (param.s_departmentId == '' || $('#s_departmentId').val() == '') {
					this.auditprogramTableCnfg.filterParam.param10 = BdoFaithConsts.DEPARTMENT_BDO;
					departmentCheck = false;
				}
			}

			let queryFilterArr = [];
			$.each(param, (key, value) => {
				if (key == 's_industry') {
					key = 's_industryName';
				}
				let _key = key.replace('s_', '');
				let filter = {
					field: _key,
					sqlIndex: 'a.' + _key,
					type: typeof value,
					value: value,
					operate: 'like'
				};
				if (key == 's_industry') {
					filter.value = '';
				}
				if (key == 's_industryName') {
					filter.value = '';
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
						filter.operate = 'eq';
						break;
					case  'csC':
						filter.operate = 'eq';
						break;
					case  'csA':
						filter.operate = 'eq';
						break;
					case  'csV':
						filter.operate = 'eq';
						break;
					case  'csP':
						filter.operate = 'eq';
						break;
					case 'industry':
						filter.operate = 'like';
						break;
					case 'potentialRisk':
						filter.operate = 'like';
						break;
					case 'description':
						filter.operate = 'like';
						break;
					default:
						filter.operate = 'like';
				}
				queryFilterArr.push(filter);
			});
			if (queryFilterArr[4].value != '' && queryFilterArr[4].value != null) {
				let conValue = [];
				conValue = queryFilterArr[4].value.split(',');
				for (let i = 0; i < conValue.length; i++) {
					if (conValue[i] == 'E') {
						queryFilterArr[11].value = 1;
					}
					if (conValue[i] == 'C') {
						queryFilterArr[12].value = 1;
					}
					if (conValue[i] == 'A') {
						queryFilterArr[13].value = 1;
					}
					if (conValue[i] == 'V') {
						queryFilterArr[14].value = 1;
					}
					if (conValue[i] == 'P') {
						queryFilterArr[15].value = 1;
					}
				}
				queryFilterArr[4].value = '';
			}
			if(param.s_departmentId && param.s_departmentId != '' && param.s_departmentId != BdoFaithConsts.DEPARTMENT_BDO) {
				queryFilterArr = queryFilterArr.slice(2);
				this.auditprogramTableCnfg.filterParam.param11 = page.searchForm.jsonData.s_departmentId;
			}else {
				if(param.s_departmentId == BdoFaithConsts.DEPARTMENT_BDO) {
					queryFilterArr = queryFilterArr.slice(1);
				}else {
					queryFilterArr = queryFilterArr.slice(2);
				}
				this.auditprogramTableCnfg.filterParam.param11 = null;
			}
			let queryString = JSON.stringify(queryFilterArr);
			this.auditprogramTableCnfg.filterParam.filter = queryString;
			if ($('#s_industry').val() != '') {
				this.auditprogramTableCnfg.filterParam.param2 = $('#s_industry').val();
			} else {
				this.auditprogramTableCnfg.filterParam.param2 = '';
			}
			if ($('#s_potentialRisk').val() != '') {
				this.auditprogramTableCnfg.filterParam.param12 = $('#s_potentialRisk').val();
			} else {
				this.auditprogramTableCnfg.filterParam.param12 = '';
			}
			if ($('#s_description').val() != '') {
				this.auditprogramTableCnfg.filterParam.param13 = $('#s_description').val();
			} else {
				this.auditprogramTableCnfg.filterParam.param13 = '';
			}
			if ($('#s_status').val() != '') {
				this.auditprogramTableCnfg.filterParam.param14 = $('#s_status').val();
			} else {
				this.auditprogramTableCnfg.filterParam.param14 = '1';
			}
			this.auditprogramTableCnfg.filterParam.sqlId = 'DG00001';
			if (!$('#s_userablePlate').val()) {
				this.auditprogramTableCnfg.filterParam.param16 = '';
			} else {
				let userablePlateArr = $('#s_userablePlate').val().join(',');
				this.auditprogramTableCnfg.filterParam.param16 = $('#s_userablePlate').val().join(',');
				for (let i = 0,len = userablePlateArr.length; i < len;i++) {
					if (userablePlateArr[i] == '全部') {
						this.auditprogramTableCnfg.filterParam.param16 = 'all';
					}
				}
			}
			$('#auditprogramTable').DataTable().ajax.reload();
		},
		onSearchResetClick(event) {
			this.searchForm.jsonData = {
				s_radio: '',
				s_departmentId: window.departIdrSession,
				s_programName: '',
				s_subjectName: '',
				s_confirmStatus: '',
				s_stage: '',
				s_industry: '',
				s_dgName: '',
				s_indexId: '',
				s_potentialRisk:'',
				s_description:'',
				s_csE: '',
				s_csC: '',
				s_csA: '',
				s_csV: '',
				s_csP: '',
				s_userablePlate: ''
			};
			this.auditprogramTableCnfg.filterParam = this.getDefaultFilter();
			$('#searchForm')[0].reset();
			//$("#s_confirmStatus").empty();
			//加载oneUI的多选框
			$('.js-select2').select2();
			//修改oneUI多选框的样式
			$('.select2').addClass('form-control');
			$('.select2-selection').attr('style', 'border-bottom: 0px');
			$('#s_confirmStatus').append(example2Select2Multiple);
			$('#auditprogramTable').DataTable().ajax.reload();
		},
		getDefaultFilter() {
			return {
				menuId: window.sys_menuId,
				sqlId: 'DG00063',
				param1: window.departIdrSession,
				param2: '1'
			};
		},
		onSelectIndustry(event) {
			let selectValue = $('#subject_tree').treeIndustry('getTreeMultiValue');
			let selectLabel = $('#subject_tree').treeIndustry('getTreeMultiLabel');
			if (typeof(selectValue) === 'object') {
				page.auditprogramForm.jsonData.industry = '';
				page.auditprogramForm.jsonData.industryName = '';
			} else {
				page.auditprogramForm.jsonData.industry = selectValue;
				page.auditprogramForm.jsonData.industryName = selectLabel;
			}
			$('#modal_subjectid').modal('hide');
		},
		onIndustryReset() {
			$('#subject_tree').treeIndustry('reset');
		},
		onIndustryOkClick() {
			let selectValue = $('#subject_tree').treeIndustry('getTreeMultiValue');
			let selectLabel = $('#subject_tree').treeIndustry('getTreeMultiLabel');
			if (typeof(selectValue) === 'object') {
				page.searchForm.jsonData.s_industry = '';
				page.searchForm.jsonData.s_industryName = '';
			} else {
				page.searchForm.jsonData.s_industry = selectValue;
				page.searchForm.jsonData.s_industryName = selectLabel;
			}
			$('#modal_subjectid').modal('hide');
		},
		/**
		 *  批量导入审计程序点击事件
		 * */
		onFileuploadClick(){
			$('#import_submit').off('click');
			$('#modal_import_auditTemplate').modal('show');
			var pluginOpt = {
				dropZoneEnabled: false,
				dropZoneTitle: '',
				dropZoneClickTitle: '',
				browseLabel: '选择文件',
				showCaption: true,
				showRemove: false,
				showUpload: false,
				showBrowse: true,
				showPreview: false,
				required : true,
				initialPreviewShowDelete: true,
				language: 'zh',
				browseOnZoneClick: true,
				showClose : false,
				uploadAsync: false,
				showCancel: false,
				hideThumbnailContent: true,
				layoutTemplates: {
					actionUpload: '',
					actionZoom: ''
				},
				fileActionSettings: {
					removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
				},
				uploadAsync: true,
				uploadUrl: 'cpBase/KAuditProgram.importAuditProgram.json',
				uploadExtraData: function() {
					return {
						param1: ''
					}
				}
			};
			var $el = $('#auditprogram_template_fileinput').fileinput(pluginOpt);
			$el.on('fileuploaded', function(event, data) {
				bdoSuccessBox('导入成功');
				$('#modal_import_auditTemplate').modal('hide');
				$('#auditprogram_template_fileinput').fileinput('clear');
				$('#auditprogram_template_fileinput').fileinput('enable');
				$('#auditprogramTable').DataTable().ajax.reload();
			});
			//uploadAsync = true 时，后台返回数据data.error 非空是调用
			$el.on('fileuploaderror', function(event, data, msg) {
				bdoErrorBox('系统提示', data.response.resultInfo.statusText ? data.response.resultInfo.statusText : msg);

				uploadFileSuccess(data);
			});

			//文件上传成功/失败后，处理后台响应函数
			function uploadFileSuccess(data) {
				$('#auditprogram_template_fileinput').fileinput('clear');
				$('#auditprogram_template_fileinput').fileinput('enable');
				$('#auditprogram_template_fileinput').val('');
				$(".fileinput-remove-button").click();
			}

			//建议文件上传成功之后再提交其他表单数据

			/* 导入按钮 */
			$('#import_submit').on("click", function() {
				$el.fileinput('upload');
			});


		},
		downloadFileClick(event){
			var params = {
				param1: ''
			};
			exportExcelWithTemplate('cpBase/KAuditProgram.downloadAuditFile.json', params);
		}
	});
};