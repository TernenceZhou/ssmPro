//var page;
(function(){
	let checkIndustry = "";
	let industryData;
	let example2Select2Multiple='';
	let suserablePlateSelect2Multi='';
	let userablePlateSelect2Multi='';
	$.validator.addMethod(
		"indexIdCheck",
		function(value, element, param) {
			let rex = /[0-9]{4}/;
			return this.optional(element) || (rex.test(value));
		},
		$.validator.format("科目编号只能输入数字！")
	);
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
						<!--</div>
						<label class="col-md-2 control-label" for="ecavpcomp_cs">分数</label>
						<div class="col-md-6">
							<input :name="elName" class="form-control" type="number" v-model="esVal" :min="esValMin" :disabled="esValDisabled">
						</div>-->
					</div>
		`
	};
	Vue.component('ecavp-comp', ecavpComp);
	function init() {
		//下拉框得到数据方法
		for(let i in DicJsonlData.responseJSON['审计程序认定']){
			example2Select2Multiple += '<option value="' + i + '">' + DicJsonlData.responseJSON['审计程序认定'][i]+ '</option>';
		}
		for(let i in DicJsonlData.responseJSON['适用板块']){
			suserablePlateSelect2Multi += '<option value="' + i + '">' + DicJsonlData.responseJSON['适用板块'][i]+ '</option>';
			userablePlateSelect2Multi += '<option value="' + i + '">' + DicJsonlData.responseJSON['适用板块'][i]+ '</option>';
		}
		let targetsNo = 0;
		let page = new Page({
			/**
			 * 根节点
			 */
			container: '#main-container',
			/**
			 * 绑定事件
			 */
			events: {
				'#auditprogramTable .edit-audit-program' : 'click,onEditAuditProgramClick',
				'#newAuditprogramBtn' : 'click,onNewAuditprogramClick',
				'#searchBtn': 'click,onSearchClick',
				'#searchResetBtn': 'click,onSearchResetClick',
				// '#editAuditprogramModal': 'hidden.bs.modal,onHiddenAPModal',
				'#editAuditprogramModal': 'show.bs.modal,onShowAPModal',
				'#editAuditprogramModal': 'shown.bs.modal,onShownAPModal',
				'#modal_subjectid_sure_addOrUpdate': 'click,onSelectIndustry',
				'#modal_subjectid_reset': 'click,onIndustryReset',
				'#modal_subjectid_sure': 'click,onIndustryOkClick',
				'#importProgramBtn':'click,onFileuploadAuditClick',
				'#exportProgramBtn': 'click,onExportProgramClick',
				'#download_audit_template' : 'click,onDownloadAuditFileClick',
				'#auditProgramView' : 'click,onAuditProgramViewClick',
				'#otherAuditProgramView' : 'click,onOtherAuditProgramViewClick'
			},
			tplEditComp: {
				el: '#draftTemplateName',
				template: '<ul class="list-group" style="padding: 10px 5px;">'
					+'			<li class="list-group-item"'
					+'				v-for="(file, index) in fileList"'
					+'				:fileId="file.autoId"'
					+'			>'
					+'				<span class="icon fa fa-file-excel-o text-primary-light"></span>'
					+'				{{file.fileName}}'
					+'				<span class="fa fa-close text-danger pull-right" @click="onDelTplFileClick" :data-index="index" v-show="delBtnShow"></span>'
					+'				<span class="fa fa-download text-danger pull-right" @click="onDownloadTplFileClick" :data-index="index" ></span>'
					+'			</li>'
					+'		</ul>',
				data(){
					return {
						fileList: [],
						delBtnShow: false
					};
				},
				methods: {
					onDelTplFileClick(event){
						var tplcomp = this;
						var $span = $(event.currentTarget);
						var index = $span.attr('data-index');
						bdoConfirmBox('提示', '确定删除该模板文件吗？', function(isConfirm) {
							page.auditprogramForm.jsonData.delTemplates.push(tplcomp.fileList[index].autoId);
							tplcomp.fileList.splice(index, 1);
						});
					},
					onDownloadTplFileClick(event){
						var tplcomp = this;
						var $span = $(event.currentTarget);
						var index = $span.attr('data-index');
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
				subjectId: '',
				subjectName: '',
				dgName: '',
				/*confirmStatus: '',
				confirmStatusName: '',*/
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
			auditprogramFormCnfg: {
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
							type : 'POST',
							url : 'cpBase/KAuditProgram.addAuditProgram.json',
							dataType : 'json',
							success : function(data) {
								if(data.success == false){
									swal({
										title : '系统提示',
										text : data.resultInfo.statusText,
										type: 'error',
										confirmButtonText : '确定',
										allowEscapeKey: true,
										allowOutsideClick: true
									});
									return;
								}
								if(data.success === true){
									bdoSuccessBox('成功', data.resultInfo.statusText);
									$('#editAuditprogramModal').modal('hide');
									$('#auditprogramTable').DataTable().draw(false);
								}else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						},
						/**
						 * 当前处理：add=新增, edit=更新, false=查看（隐藏提交按钮）
						 */
						process: 'add'
					}
				},
				watch: {
					/**
					 * 处理编辑画面状态更新
					 */
					process(newValue, oldValue){
						var pvm = this;
						if(!newValue) {
							$(this.$el).find('.form-control').attr('readonly', true);

							this.setAllReadonly(true);
							this.formItem.draftTemplateName.show = true;
							this.formItem.draftTemplate.show = false;
						}else {
							$(this.$el).find('.form-control').attr('readonly', false);

							this.setAllReadonly(false);
							this.formItem.draftTemplateName.show = false;
							this.formItem.draftTemplate.show = true;
						}
						if(newValue == 'edit' || newValue == false ) {
							if(this.tplEditComp == null) {
								this.tplEditComp = new Vue(page.tplEditComp);
							}
							this.tplEditComp.delBtnShow = (newValue == 'edit' ? true : false);
							this.jsonData.delTemplates = [];
							this.$nextTick(()=>{
								this.formItem.draftTemplateName.show = true;
								$.ajax({
									type : "post",
									url : 'dgCenter/DgGeneral.query.json',
									async : false,
									data : {
										menuId : window.sys_menuId,
										sqlId : 'DG00003',
										param1 : this.jsonData.autoId
									},
									dataType : "json",
									success : function(data) {
										if(data.success === true){
											pvm.tplEditComp.fileList = data.data;
										}
									}
								});
							});
						}
						if(newValue !== false) {
							this.$nextTick(()=>{
								$(this.$el).find('#departmentId').attr('readonly', true);
								this.formItem.departmentId.readonly = true;
								this.jsonData.departmentId = BdoFaithConsts.DEPARTMENT_BDO;
								console.log($(this.$el).find('#departmentId').attr('readonly'));
							});
						}
					},
					'jsonData.allIndustryFlag'(newVal, oldVal) {
						if(newVal == true) {
							this.formItem.industry.readonly = true;
							this.jsonData.industry = null;
						}else {
							this.formItem.industry.readonly = false;
						}
					},
					'jsonData.industry'(newVal, oldVal) {},
					'jsonData.stage'(newVal, oldVal) {},
					'jsonData.confirmStatus'(newVal, oldVal) {},
					'jsonData.subjectId'(newVal,oldVal){
						$('#index').val(newVal);
					}

				},
				tplEditComp: null,
				computed: {
					allIndustryFlagClass() {
						if(this.formItem.allIndustryFlag.readonly == true) {
							return 'css-input css-input-disabled css-checkbox css-checkbox-primary control-label';
						}
						return 'css-input css-checkbox css-checkbox-primary control-label';
					},
					checkboxGroupClass() {
						if(this.formItem.confirmGrop.readonly == true) {
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
					onSaveAudtiprogramClick(evt){
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
						this.jsonData.indexId = $('#index').val() + "-" + $('#userIndex').val();
						if(this.jsonData.allIndustryFlag == false) {
							this.jsonData.allIndustryFlag = '0';
						}else {
							this.jsonData.allIndustryFlag = '1';
						}
						if(this.process == 'add') {
							this.ajaxConfig.url = 'cpBase/KAuditProgram.addAuditProgram.json';
						}else if(this.process == 'edit') {
							this.ajaxConfig.url = 'cpBase/KAuditProgram.updateAuditProgram.json';
						}
						this.jsonData.stageName = this.jsonData.stage;
						this.jsonData.required = (this.jsonData.required == '是' || this.jsonData.required == 1 || this.jsonData.required == true) ? 1 : 0;
						/*this.jsonData.csE = page.booleanTranslate(this.jsonData.csE, true);
						this.jsonData.csC = page.booleanTranslate(this.jsonData.csC, true);
						this.jsonData.csA = page.booleanTranslate(this.jsonData.csA, true);
						this.jsonData.csV = page.booleanTranslate(this.jsonData.csV, true);
						this.jsonData.csP = page.booleanTranslate(this.jsonData.csP, true);*/
						//this.submit(true);
						let jsonData = {};
						$.each(this.jsonData, (key, val) => {
							jsonData[key] = val;
							if(key.startsWith('cs')) {
								jsonData[key] = page.booleanTranslate(val, true);
							}
						});
						this.uploadFile(true,{param20 : '1',param1 : '0' /*判断是否为标准审计*/, jsonData: JSON.stringify(jsonData)});

						/*if(this.jsonData.csE == 0){
							this.jsonData.csE = false;
						}
						if(this.jsonData.csC == 0){
							this.jsonData.csC = false;
						}
						if(this.jsonData.csA == 0){
							this.jsonData.csA = false;
						}
						if(this.jsonData.csV == 0){
							this.jsonData.csV = false;
						}
						if(this.jsonData.csP == 0){
							this.jsonData.csP = false;
						}
						if(this.jsonData.allIndustryFlag == 0){
							this.jsonData.allIndustryFlag = false;
						}*/
					},
					/**
					 * 关闭编辑画面表单
					 */
					onCancelAudtiprogramtClick(evt){
						page.auditprogramForm.process = '';
					},
					/**
					 * 打开编辑画面动作
					 */
					openEditPage(){
						if(this.tplEditComp == null) {
							this.tplEditComp = new Vue(page.tplEditComp);
						}

						this.tplEditComp.delBtnShow = (this.process == 'edit' ? true : false);
						this.jsonData.delTemplates = [];
						this.$nextTick(()=>{
							this.formItem.draftTemplateName.show = true;
							$.ajax({
								type : "post",
								url : 'dgCenter/DgGeneral.query.json',
								async : false,
								data : {
									menuId : window.sys_menuId,
									sqlId : 'DG00003',
									param1 : this.jsonData.autoId
								},
								dataType : "json",
								success : function(data) {

									if(data.success === true){
										pvm.tplEditComp.fileList = data.data;
									}
								}
							});
						});
					},
					/**
					 *
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
				},{
					id: 'cancelAudtiprogramtBtn',
					icon: 'fa-arrow-left',
					style: 'btn-warning',
					text: '取消',
					typeAttr: {
						//'v-on:click' : 'onCancelAudtiprogramtClick',
						'data-dismiss': 'modal'
					}
				}],*/
				items: [
					{
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
							'v-on:click': 'onCancelAudtiprogramtClick',
							'style': 'float: right; margin-top: -30px;color: #fff; background-color: #f3b760; border-color: #f3b760;border-radius: 2px;',
							'data-dismiss': 'modal'
						}
					},
					{
						id : 'dgName',
						type : 'input',
						label : '程序名称',
						rowspan : 1,
						colspan : 1,
						validate : {
							rules : {
								required : true
							}
						}
					},{
						id : 'indexId',
						/*type : 'input',
						label : '索引号',*/
						html: 	'<div class="form-material has-success input-group">'+
							'<input maxlength="4" style="box-shadow: rgb(70, 195, 123) 0px 1px 0px;" required="required" onblur="if(this.value.length==0){return;}else{var v=this.value;while(v.length<4){v=0+v;}this.value=v;}" class="form-control" id="index" placeholder="科目索引"' +
							'oninput="this.value=this.value.replace(/[^0-9]/ig,\'\')"/>'+
							'<span class="input-group-addon">-</span>'+
							'<input maxlength="4" style="box-shadow: rgb(70, 195, 123) 0px 1px 0px;" required="required" onblur="if(this.value.length==0){return;}else{var v=this.value;while(v.length<4){v=0+v;}this.value=v;}" class="form-control" id="userIndex" placeholder="自定义索引"' +
							'oninput="this.value=this.value.replace(/[^0-9]/ig,\'\')"/>' +
							'<label style="color:rgb(70, 195, 123)">索引号</label>'+
							'</div>',
						colspan : 1,
						validate : {
							rules : {
								required : true
							}
						}
					},{
						id : 'departmentId',
						type : 'treecombo',
						label : '机构部门',
						rowspan : 1,
						colspan : 1,
						validate : {
							rules : {
								required : true
							}
						},
						readOnly: true,
						typeAttr: {
							readonly: true,
							readOnly: true
						},
						plugin : {
							name : 'treecombo',
							options : {
								url : './base/TreeCommon.findDepartTree.json',
								params : {},
								view : {
									leafIcon: 'fa fa-building text-flat',
									nodeIcon: 'fa fa-bank text-primary-light',
									folderSelectable: true,
									multiSelect: false
								}
							}
						}
					},{
						id : 'required',
						type : 'combo',
						label : '是否必须',
						colspan : 1,
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
							stores: function() {
								return ComboLabelValueDicData(false, 'boolean');
							}
						}
					},{
						id : 'subjectId',
						type : 'treecombo',
						label : '标准科目',
						rowspan : 1,
						colspan : 1,
						validate : {
							rules : {
								required : true
							}
						},
						plugin : {
							name : 'treecombo',
							options : {
								url : './cpBase/TreeCommon.findSubjectTree.json',
								params : {

								},
								view : {
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
					},{
						id : 'stage',
						type : 'combo',
						label : '阶段',
						colspan : 2,
						validate : {
							rules : {
								required : true
							}
						},
						plugin : {
							name: 'combo',
							options: {
								noneSelectedText : '请选择'
							},
							stores: function() {
								return ComboLabelValueDicData(false, '审计程序阶段');
							}
						}
					},{
						id: 'confirmGrop',
						rowspan : 1,
						colspan : 2,
						readonly : false,
						html: `
								<div class="form-material"><label>认定</label></div>
								<div class="row" style="margin-bottom: 1.2em;margin-top: 1.2em;">
									<ecavp-comp :prefixed="''" :label-name="'E'" :ecs-val="jsonData.csE" :es-val="jsonData.sE" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
									<ecavp-comp :prefixed="''" :label-name="'C'" :ecs-val="jsonData.csC" :es-val="jsonData.sC" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
									<ecavp-comp :prefixed="''" :label-name="'A'" :ecs-val="jsonData.csA" :es-val="jsonData.sA" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
									<ecavp-comp :prefixed="''" :label-name="'V'" :ecs-val="jsonData.csV" :es-val="jsonData.sV" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
									<ecavp-comp :prefixed="''" :label-name="'P'" :ecs-val="jsonData.csP" :es-val="jsonData.sP" :group-readonly="formItem.confirmGrop.readonly"></ecavp-comp>
								</div>
							`,
						/*html: '<div class="form-material"><label>认定</label></div>'
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
							+'		<input class="form-control" type="text" :max="99.99" :min="0" maxlength="5" id="sE" name="sE" v-model="jsonData.sE" :readonly="scoreReadonly">'
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
							+'		<input class="form-control" type="text" :max="99.99" :min="0" maxlength="5" id="sC" name="sC" v-model="jsonData.sC" :readonly="scoreReadonly">'
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
							+'		<input class="form-control" type="text" :max="99.99" :min="0" maxlength="5" id="sA" name="sA" v-model="jsonData.sA" :readonly="scoreReadonly">'
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
							+'		<input class="form-control" type="text" :max="99.99" :min="0" maxlength="5" id="sV" name="sV" v-model="jsonData.sV" :readonly="scoreReadonly" >'
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
							+'		<input class="form-control" type="text" :max="99.99" :min="0" maxlength="5" id="sP" name="sP" v-model="jsonData.sP" :readonly="scoreReadonly">'
							+'	</div>'
							+'</div>'
							+'</div>',*/
					}, {
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
						id : 'industryName',
						/*html : '<div class="form-material">' +
							 '<label>选择行业</label></div>' +
							 '<div style="padding: 10px 0;">'+
							 '<input class="form-control" id="industry" :data-value="jsonData.industry" v-model="jsonData.industryName" @focus="onIndustryFocus"/>' +
							 '</div>',*/
						type : 'input',
						label : '选择行业',
						colspan : 1,
						validate : {
							rules : {
								required : false
							}
						},
						typeAttr : {
							//multiple : true
							':data-value': 'jsonData.industry',
							'v-model': 'jsonData.industryName',
							'@focus': 'onIndustryFocus'
						},
						plugin : {
							name: 'combo',
							options: {
								noneSelectedText : '请选择',
								multipleSeparator : ',',
								width : '250px',
								size : 7
							},
							stores: industryData
						}
					}, {
						id : 'industry',
						type: 'input',
						typeAttr : {
							type: 'hidden',
							'v-show': 'false'
						},
						rowspan : 1
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
						id : 'programName',
						type : 'textarea',
						label : '程序内容',
						rowspan : 1,
						colspan : 2,
						typeAttr: {
							rows : 5
						},
						validate : {
							rules : {
								required : true
							}
						}
					}, {
						id : 'potentialRisk',
						type : 'textarea',
						label : '潜在风险说明',
						rowspan : 1,
						colspan : 2,
						typeAttr: {
							rows : 3
						},
						validate : {
							rules : {
								required : true
							}
						}
					}, {
						id : 'description',
						type : 'textarea',
						label : '具体事项说明',
						rowspan : 1,
						colspan : 2,
						typeAttr: {
							rows : 3
						},
						validate : {
							rules : {
								required : true
							}
						}
					},{
						id : 'draftTemplateName',
						type : 'div',
						label : '已上传底稿模板',
						rowspan : 1,
						colspan : 2,
						validate : {
							rules : {
								//required : true
							}
						},
						show: false
					},{
						id :  'draftTemplate',
						type : 'file',
						label : '底稿模板',
						rowspan : 1,
						colspan : 2,
						validate : {
							rules : {
								//required : true
							}
						},
						show: true,
						plugin : {
							name : 'fileinput',
							options : {
								uploadUrl: 'cpBase/KAuditProgram.uploadFile.json',
								allowedFileExtensions: ['xlsx'],//允许的文件类型]
								maxFilesNum: 1,
								uploadExtraData: function() {
									return {
										/*parentId: commentFormModel.folderId,
										customerId: taskDetailVm.jsonData.groupId*/
									}
								}
							}
						}
					}]
			},
			/**
			 * 编辑/新增画面表单
			 */
			auditprogramForm: null,
			getVal(val){
				return val == '1' ? 'checked' : '';
			},
			getConfirmStatus(data, score){
				var result = '<label class="css-input css-checkbox css-checkbox-primary control-label" >'
					+'			<input type="checkbox" '+ this.getVal(data) +' disabled>'
					+'			<span></span>'
					+'		</label>'
					+'<div>' + (score && data == '1' ? score : 0) + '</div>';
				return result;
			},
			/**
			 * 一览配置
			 */
			auditprogramTableCnfg: {
				tabNum : true,
				scrollX : true,
				lengthChange : true,
				order : [2, 'asc'],
				pageLength : 30,
				ordering : false,
				info : true,
				sourceData : {},
				sourceUrl : 'dgCenter/DgGeneral.query.json',
				filterParam : {
					menuId : window.sys_menuId,
					sqlId : 'DG00001',
					param14 : '1'
				},
				tableColumns :[
					{
						targets : ++targetsNo,
						orderable : false,
						className : 'text-center',
						title : '处理',
						data : null,
						width : '150px',
						render : function(data, type, row, meta) {
							var renderStr = '';
							if(row.depCustomizeFlag == '0') {
								renderStr += '<button class="btn btn-xs btn-info table-btn-operate edit-audit-program" data-row="'+meta.row+'" type="button" data-action="edit" name="" data-placement="top" title="修改" data-toggle="tooltip">'
									+ '<i class="fa fa-edit"></i></button>';
							}
							if(row.depCustomizeFlag == '1') {
								renderStr += '<button class="btn btn-xs btn-success table-btn-operate get-audit-program" data-row="'+meta.row+'" type="button" data-action="add" name="" data-placement="top" title="引用" data-toggle="tooltip">'
									+ '<i class="fa fa-external-link"></i></button>';
							}
							renderStr += '<button class="btn btn-xs btn-primary table-btn-operate view-audit-program" data-row="'+meta.row+'" type="button" data-action="detail" name="" data-placement="top" title="查看" data-toggle="tooltip">'
								+ '<i class="fa fa-eye"></i></button>';
							if(row.depCustomizeFlag == '0') {
								renderStr += '<button class="btn btn-xs btn-danger table-btn-operate del-audit-program" data-row="'+meta.row+'" type="button" data-action="del" name="" data-placement="top" title="删除" data-toggle="tooltip">'
									+ '<i class="fa fa-close"></i></button>';
								if(row.ACTIVE_FLAG == '1') {
									renderStr += '<button class="btn btn-xs btn-danger table-btn-operate invalid-audit-program" data-row="'+meta.row+'" type="button" data-action="invalid" name="" data-placement="top" title="作废" data-toggle="tooltip">'
									+ '<i class="fa fa-ban"></i></button>';
								}else if(row.ACTIVE_FLAG == '0') {
									renderStr += '<button class="btn btn-xs btn-warning table-btn-operate cancel-invalid-audit-program" data-row="'+meta.row+'" type="button" data-action="cancelInvalid" name="" data-placement="top" title="取消作废" data-toggle="tooltip">'
									+ '<i class="fa fa-check-circle-o"></i></button>';
								}
								if(row.competitiveFlag == '1') {
									renderStr += '<button class="btn btn-xs table-btn-operate unset-competitive-program" data-row="'+meta.row+'" type="button" data-action="detail" name="" data-placement="top" title="取消精品" data-toggle="tooltip">'
										+ '<i class="fa fa-star-o"></i></button>';
								}else {
									renderStr += '<button class="btn btn-xs table-btn-operate set-competitive-program bg-warning text-white" data-row="'+meta.row+'" type="button" data-action="detail" name="" data-placement="top" title="设置精品" data-toggle="tooltip">'
										+ '<i class="fa fa-star"></i></button>';
								}
							}
							return renderStr;
						}
					}, {
						targets : ++targetsNo,
						orderable : true,
						title : '机构部门',
						name : 'departmentId',
						data : 'departmentId',
						width : '150px',
						render(data, type, row, meta) {
							if(row.__ddepartmentIdName == undefined ){
								return row.name;
							}else{
								return row.__ddepartmentIdName;
							}
						}
					}, {
						targets : ++targetsNo,
						orderable : true,
						title : '程序名称',
						name : 'dgName' ,
						data : 'dgName',
						width : '150px',
						className : 'ribbon ribbon-right',
						render(data, type, row, meta) {
							if(row.depCustomizeFlag != 1 && row.competitiveFlag == 1) {
								return data + '<div class="ribbon-box bg-warning" style="top: 0;padding: 0 3px;height: 16px;line-height: 16px;"><span class="dg-ap-competitive"><i class="fa fa-star"></i></span></div>';
							}
							return data;
						}
					}, {
						targets : ++targetsNo,
						orderable : true,
						title : '程序内容',
						name : 'programName',
						data : 'programName',
						width : '300px',
						className : 'text-ellipsis'
					}, {
						targets : ++targetsNo,
						orderable : true,
						title : '索引号',
						name : 'indexId' ,
						data : 'indexId',
						width : '150px'
					}, {
						targets : ++targetsNo,
						orderable : true,
						title : '标准科目',
						name : 'subject',
						//data : 'subjectName',
						width : '90px',
						render(data, type, row, meta) {
							return row.subjectId + '-' + row.subjectName;
						}
					},{
						targets : ++targetsNo,
						orderable : true,
						title : 'E',
						name : 'E',
						data : 'csE',
						width : '30px',
						className : 'text-center',
						render(data, type, row, meta) {
							return page.getConfirmStatus(data, row.sE);
						}
					}, {
						targets : ++targetsNo,
						orderable : true,
						title : 'C',
						name : 'C',
						data : 'csC',
						width : '30px',
						className : 'text-center',
						render(data, type, row, meta) {
							return page.getConfirmStatus(data, row.sC);
						}
					}, {
						targets : ++targetsNo,
						orderable : true,
						title : 'A',
						name : 'A',
						data : 'csA',
						width : '30px',
						className : 'text-center',
						render(data, type, row, meta) {
							return page.getConfirmStatus(data, row.sA);
						}
					},{
						targets : ++targetsNo,
						orderable : true,
						title : 'V',
						name : 'V',
						data : 'csV',
						width : '30px',
						className : 'text-center',
						render(data, type, row, meta) {
							return page.getConfirmStatus(data, row.sV);
						}
					},{
						targets : ++targetsNo,
						orderable : true,
						title : 'P',
						name : 'P',
						data : 'csP',
						width : '30px',
						className : 'text-center',
						render(data, type, row, meta) {
							return page.getConfirmStatus(data, row.sP);
						}
					},{
						targets : ++targetsNo,
						orderable : true,
						title : '行业',
						name : 'industryName',
						data : 'industryName',
						width : '150px'/*,
					render(data, type, row, meta) {
						if(row.allIndustryFlag == '1') {
							return data;
						}
						var result = [];
						var datas = data && data.split(',');
						$.each(datas, (dindex, dvlobj)=>{
							$.each(industryData, (index, vlobj)=>{
								if(vlobj.value == dvlobj) {
									result.push(vlobj.label);
								}
							});
						});
						return result;
					}*/
					},{
						targets: ++targetsNo,
						orderable: true,
						title: '适用板块',
						name: 'userablePlate',
						data: 'userablePlate',
						width: '150px'
					},{
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
						targets : ++targetsNo,
						orderable : true,
						title : '是否必须',
						name : 'required',
						data : 'required',
						render(data, type, row, meta) {
							return DicVal2Nm(data, 'boolean');
						},
						width : '150px'
					},{
						targets : ++targetsNo,
						orderable : true,
						title : '创建人',
						name : 'createUser',
						data : 'createUser',
						render(data, type, row, meta) {
							return row.__ucreateUser.userName;
						},
						width : '150px'
					}
				]
			},
			/**
			 * 检索表单数据绑定对象
			 */
			searchFormJsonData: {
				s_departmentId: '',
				s_programName: '',
				s_subjectName: '',
				s_confirmStatus: '',
				s_stage: '',
				s_industry: '',
				s_industryName: '',
				s_dgName: '',
				s_indexId: '',
				s_confirmStatus: '',
				s_csE:'',
				s_csC:'',
				s_csA:'',
				s_csV:'',
				s_csP:'',
				s_potentialRisk:'',
				s_description:'',
				s_userablePlate:''
			},
			/**
			 * 检索表单
			 */
			searchForm: null,
			/**
			 * 检索表单配置
			 */
			searchFormCnfg: {
				props: {
					jsonData: Object
				},
				display: 'tableform-one',
				column: 4,
				id: 'searchForm',
				data: function() {
					return {
						ajaxConfig: {
							type : 'POST',
							url : '',
							dataType : 'json',
							success : function(data) {}
						},
					}
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
						id : 's_industry',
						type : 'input',
						rowspan : 1,
						typeAttr : {
							type: 'hidden'
						}
					},
					{
						id : 's_departmentId',
						type : 'treecombo',
						label : '机构部门',
						rowspan : 1,
						colspan : 1,
						validate : {
							rules : {
								//required : true
							}
						},
						plugin : {
							name : 'treecombo',
							options : {
								url : './base/TreeCommon.findDepartTree.json',
								params : {},
								view : {
									leafIcon: 'fa fa-building text-flat',
									nodeIcon: 'fa fa-bank text-primary-light',
									folderSelectable: true,
									multiSelect: true
								}
							}
						}
					}, {
						id : 's_dgName',
						type : 'input',
						label : '程序名称',
						colspan : 1
					},{
						id : 's_programName',
						type : 'input',
						label : '程序内容',
						colspan : 1
					},{
						id : 's_indexId',
						type : 'input',
						label : '索引号',
						colspan : 1
					},{
						id : 's_subjectName',
						type : 'input',
						label : '标准科目',
						rowspan : 1,
						colspan : 1
					},{
						id : 's_industryName',
						//type : 'input',
						html : '<div class="form-material">' +
							'<label>行业</label>' +
							'<input class="form-control" id="s_industry" :data-value="jsonData.s_industry" v-model="jsonData.s_industryName" @focus="onS_IndustryFocus"/>' +
							'</div>' ,
						colspan : 1
					},{
						id : 's_stage',
						type : 'select',
						label : '阶段',
						plugin : {
							name: 'combo',
							options: {
								noneSelectedText : '请选择'
							},
							stores: function() {
								return ComboLabelValueDicData(true, '审计程序阶段');
							}
						},
						colspan : 1
					}, {
						id : 's_confirmStatus',
						label : '认定',
						//type : 'input',
						html : 	'<div class="form-material">' +
							'<label for="example2-select2-multiple">认定</label>' +
							'<select class="js-select2" id="s_confirmStatus" name="example2-select2-multiple" style="width: 100%;" data-placeholder="请选择" multiple>' +
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
			},
			/**
			 * 编辑程序框显示
			 */
			onShowAPModal() {
				this.cmp.editAuditprogramModal.draggable({
					handle: '.block-header',
					cursor: 'move'
				});
				this.cmp.editAuditprogramModal.css('overflow','hidden');
				let form = page.auditprogramForm;
				if(form.process !== false) {
					form.jsonData.departmentId = BdoFaithConsts.DEPARTMENT_BDO;
				}
			},
			onShownAPModal() {
				let form = page.auditprogramForm;
				if(form.process !== false) {
					$(form.$el).find('.form-control #departmentId').attr('readonly', true);
					form.formItem.departmentId.readonly = true;
					form.jsonData.departmentId = BdoFaithConsts.DEPARTMENT_BDO;
				}
			},
			/**
			 * 初始化方法
			 */
			init(options) {
				// 初始化一览table
				BdoDataTables('auditprogramTable', this.auditprogramTableCnfg);
				// 绑定table处理按钮事件
				$('#auditprogramTable').on('click', '.edit-audit-program', this.onEditAuditProgramClick);
				$('#auditprogramTable').on('click', '.get-audit-program', this.onGetAnotherAuditProgramClick);
				$('#auditprogramTable').on('click', '.view-audit-program', this.onViewAuditProgramClick);
				$('#auditprogramTable').on('click', '.del-audit-program', this.onDelAuditProgramClick);
				$('#auditprogramTable').on('click', '.invalid-audit-program', this.onInvalidAuditProgramClick);
				$('#auditprogramTable').on('click', '.cancel-invalid-audit-program', this.onCancelInvalidAuditProgramClick);
				$('#auditprogramTable').on('click', '.set-competitive-program', this.onSetCompetitiveProgramClick);
				$('#auditprogramTable').on('click', '.unset-competitive-program', this.onUnSetCompetitiveProgramClick);

				// 初始化编辑画面表单
				/*var APFormComp = Vue.extend(this.auditprogramFormCnfg);
				this.auditprogramForm = new APFormComp({
					propsData: {
						jsonData: this.auditprogramJsonData
					}
				});*/
				this.auditprogramFormCnfg.options = {
					propsData: {
						jsonData: this.auditprogramJsonData
					}
				};
				this.auditprogramForm = createForm(this.auditprogramFormCnfg);

				$('#saveAudtiprogramBtn').text('保存');
				$('#cancelAudtiprogramtBtn').text('关闭');

				//this.auditprogramForm.$mount('#auditprogramForm');
				// 初始化搜索表单
				/*let SearchFormComp = Vue.extend(this.searchFormCnfg);
				this.searchForm = new SearchFormComp({
					propsData: {
						jsonData: this.searchFormJsonData
					}
				});
				this.searchForm.$mount('#searchForm');*/
				this.searchFormCnfg.options = {
					propsData: {
						jsonData: this.searchFormJsonData
					}
				};
				this.searchForm = createForm(this.searchFormCnfg);
				//加载oneUI的多选框
				$('.js-select2').select2();
				//修改oneUI多选框的样式
				$('.select2').addClass("form-control");
				$('.select2-selection').attr("style", "border-bottom: 0px");
				$('#s_confirmStatus').append(example2Select2Multiple);
				$('#s_userablePlate').append(suserablePlateSelect2Multi);
				$('#userablePlate').append(userablePlateSelect2Multi);
				
				// 动态控制多选下拉
				// 若选项为全部，清空下拉框已选择的值，将选项赋值为全部
				// 若是全部之外的选项， 将全部清除，并将所选值赋值上
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
			},
			updateCompetitive(param) {
				$.ajax(
					{
						type : "post",
						url : 'cpBase/KAuditProgram.updateAuditProgram.json',
						async : false,
						data : param,
						dataType : "json",
						success : function(data) {
							if(data.success === true){
								bdoSuccessBox('成功', data.resultInfo.statusText);
								//$('#auditprogramTable').DataTable().ajax.reload();
								$('#auditprogramTable').DataTable().draw(false);
							}else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					}
				);
			},
			/**
			 * 关闭编辑画面
			 */
			/*onHiddenAPModal(event){
				page.auditprogramForm.process = '';
			},*/
			/**
			 *
			 */
			booleanTranslate(value, flag){
				return (!flag ? value == '1' : ( value == true ? '1' : '0'));
			},
			/**
			 * 引用按钮点击事件
			 */
			onGetAnotherAuditProgramClick(event){

				// 显示 modal
				$('#editAuditprogramModal').find('h3.block-title').text('引用审计程序');
				$('#editAuditprogramModal').modal('show');
				// 获取当前列数据
				var table = $('#auditprogramTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));

				$('#index').attr("disabled",true);
				var arrayIndex= rowData.indexId.split("-");
				$("#index").val(arrayIndex[0]);
				$("#userIndex").val("");
				
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
					departmentId: BdoFaithConsts.DEPARTMENT_BDO, //window.departIdSession,
					programName: rowData.programName,
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
			onEditAuditProgramClick(event){
				event.preventDefault();
				// 获取当前列数据
				var table = $('#auditprogramTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				var check = null;
				let departmentId = (rowData.__ddepartmentId.departId == null ?  BdoFaithConsts.DEPARTMENT_BDO : rowData.__ddepartmentId.departId);
				//modal可以拖动
				$('#editAuditprogramModal').on('show.bs.modal',function(){
					$(this).draggable({
						handle: '.block-header',
						cursor: 'move'
					});
					$(this).css('overflow','hidden');
				});

				// 显示 modal
				$('#editAuditprogramModal').find('h3.block-title').text('更新审计程序');
				$('#editAuditprogramModal').modal('show');
				departmentId = (rowData.__ddepartmentId.departId == null ?  BdoFaithConsts.DEPARTMENT_BDO : rowData.__ddepartmentId.departId);
				$('#index').attr("disabled",true);
				var arrayIndex= rowData.indexId.split("-");
				if(arrayIndex.length > 2){
					$("#index").val(arrayIndex[0]);
					$("#userIndex").val("");
				}else{
					$("#index").val(arrayIndex[0]);
					$("#userIndex").val(arrayIndex[1]);
				}
				
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
					departmentId: (rowData.__ddepartmentId.departId == null ?  BdoFaithConsts.DEPARTMENT_BDO : rowData.__ddepartmentId.departId),
					programName: rowData.programName,
					indexId: rowData.indexId,
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
			onViewAuditProgramClick(event){
				// 显示 modal
				$('#editAuditprogramModal').find('h3.block-title').text('审计程序');
				$('#editAuditprogramModal').modal('show');
				// 获取当前列数据
				var table = $('#auditprogramTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				var arrayIndex= rowData.indexId.split("-");
				if(arrayIndex.length > 2){
					$("#index").val(arrayIndex[0]);
					$("#userIndex").val("");
				}else{
					$("#index").val(arrayIndex[0]);
					$("#userIndex").val(arrayIndex[1]);
				}
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
					departmentId: (rowData.__ddepartmentId.departId == null ?  BdoFaithConsts.DEPARTMENT_BDO : rowData.__ddepartmentId.departId),
					programName: rowData.programName,
					indexId: rowData.indexId,
					dgName: rowData.dgName,
					subjectId: rowData.subjectId,
					subjectName: rowData.subjectName,
					/*confirmStatus: rowData.confirmStatus,
					confirmStatusName: rowData.confirmStatusName,*/
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
			onDelAuditProgramClick(event){
				var table = $('#auditprogramTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				let departmentId = (rowData.__ddepartmentId.departId == null ?  BdoFaithConsts.DEPARTMENT_BDO : window.departIdrSession);
				bdoConfirmBox('提示', '确定删除该数据吗？', function(isConfirm) {
					$.ajax({
						type : "post",
						url : 'cpBase/KAuditProgram.delAuditProgram.json',
						async : false,
						data : {
							menuId: window.sys_menuId,
							param1: rowData.autoId,
							param2: departmentId
						},
						dataType : "json",
						success : function(data) {
							if(data.success){
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#auditprogramTable').DataTable().draw(false);
								// $('#auditprogramTable').DataTable().ajax.reload();
							}else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			},
			/**
			 * 作废按钮点击事件
			 */
			onInvalidAuditProgramClick(event){
				var table = $('#auditprogramTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				bdoConfirmBox('提示', '确定作废该数据吗？', function(isConfirm) {
					$.ajax({
						type : "post",
						url : 'cpBase/KAuditProgram.invalidAuditProgram.json',
						// async : false,
						data : {
							menuId: window.sys_menuId,
							param1: rowData.autoId
						},
						dataType : "json",
						success : function(data) {
							if(data.success){
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#auditprogramTable').DataTable().draw(false);
								// $('#auditprogramTable').DataTable().ajax.reload();
							}else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			},
			/**
			 * 取消作废按钮点击事件
			 */
			onCancelInvalidAuditProgramClick(event){
				var table = $('#auditprogramTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				bdoConfirmBox('提示', '确定取消作废该数据吗？', function(isConfirm) {
					$.ajax({
						type : "post",
						url : 'cpBase/KAuditProgram.cancelInvalidAuditProgram.json',
						// async : false,
						data : {
							menuId: window.sys_menuId,
							param1: rowData.autoId
						},
						dataType : "json",
						success : function(data) {
							if(data.success){
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#auditprogramTable').DataTable().draw(false);
								// $('#auditprogramTable').DataTable().ajax.reload();
							}else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			},
			/**
			 * 设置精品程序
			 * @param event
			 */
			onSetCompetitiveProgramClick(event){
				let table = $('#auditprogramTable').dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				let param = $.extend(false, {}, rowData);
				param.competitiveFlag = '1';
				param.departmentId = parseInt(rowData.__ddepartmentId.departId);
				let jsonParam = {
					menuId: window.sys_menuId,
					jsonData: JSON.stringify(param),
					param20: '0'
				};
				page.updateCompetitive(jsonParam);
			},
			/**
			 * 取消精品程序
			 * @param event
			 */
			onUnSetCompetitiveProgramClick(event){
				let table = $('#auditprogramTable').dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				let param = $.extend(false, {}, rowData);
				param.competitiveFlag = '0';
				param.departmentId = parseInt(rowData.__ddepartmentId.departId);
				let jsonParam = {
					menuId: window.sys_menuId,
					jsonData: JSON.stringify(param),
					param20: '0'
				};
				page.updateCompetitive(jsonParam);
			},
			/**
			 * 新增按钮点击事件
			 */
			onNewAuditprogramClick(event){
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
				$('#departmentId').attr("disabled","disabled");
				$('#index').attr("disabled",true);
				$("#index").val("");
				$("#userIndex").val("");
				$('#editAuditprogramModal').modal('show');
				
				// 默认适用板块为全部
				$("#userablePlate").val('全部').trigger('change');
				page.auditprogramForm.jsonData = {
					departmentId: BdoFaithConsts.DEPARTMENT_BDO,
					programName: '',
					indexId: '',
					dgName: '',
					subjectId: '',
					subjectName: '',
					/*confirmStatus: '',
					confirmStatusName: '',*/
					potentialRisk: '',
					stage: page.auditprogramForm.jsonData.stage,
					stageName: page.auditprogramForm.jsonData.stage,
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
				// 是否是其他科目
				page.auditprogramForm.jsonData.ifOtherSubject = type;
				page.auditprogramForm.process = 'add';
			},
			
			/**
			 *  批量导入审计程序点击事件
			 * */
            onFileuploadAuditClick(event){
				$('#import_audit_submit').off('click');
                $('#modal_import_auditprogram').modal('show');
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

                pluginOpt.uploadExtraData = function() {
                    return {
                        param1 : BdoFaithConsts.DEPARTMENT_BDO
                    }
                };

                var $el = $('#auditprogram_fileinput').fileinput(pluginOpt);
                $el.on('fileuploaded', function(event, data) {
                    bdoSuccessBox('导入成功');
                    $('#modal_import_auditprogram').modal('hide');
                    $('#auditprogram_fileinput').fileinput('clear');
                    $('#auditprogram_fileinput').fileinput('enable');
                    $('#auditprogramTable').DataTable().ajax.reload();
                });
                //uploadAsync = true 时，后台返回数据data.error 非空是调用
                $el.on('fileuploaderror', function(event, data, msg) {
                    bdoErrorBox('系统提示', data.response.resultInfo.statusText ? data.response.resultInfo.statusText : msg);

                    uploadFileSuccess(data);
                });

                //文件上传成功/失败后，处理后台响应函数
                function uploadFileSuccess(data) {
                    $('#auditprogram_fileinput').fileinput('clear');
                    $('#auditprogram_fileinput').fileinput('enable');
                    $('#auditprogram_fileinput').val('');
                    $(".fileinput-remove-button").click();
                }

                //建议文件上传成功之后再提交其他表单数据

                /* 导入按钮 */
                $('#import_audit_submit').on("click", function() {
                    $el.fileinput('upload');
                });
			},
						
			/**
			 *  批量导出审计程序点击事件
			 * */
			onExportProgramClick(event) {
				page.exportAuditProgram();
			},
			exportAuditProgram() {
				let myParams = this.searchForm.jsonData;
				if ($('#s_confirmStatus').val() == null) {
					myParams.s_confirmStatus = '';
				} else {
					myParams.s_confirmStatus = $('#s_confirmStatus').val().join(',');
				}
				let queryFilterArr = [];
				if (myParams.s_confirmStatus == null) {
					myParams.s_confirmStatus = '';
				}
				$.each(myParams, (key, value) => {
					var _key = key.replace('s_', '');
					var filter = {
						field: _key,
						sqlIndex: 'a.' + _key,
						type: typeof value,
						value: value,
						operate: 'like'
					};
					if (key == 's_industry') {
						filter.value = ''; //$('#s_industry').val();
					}
					if(key == 's_industryName') {
						filter.value = ''; //$('#s_industry').val();
					}
					if(key == 's_stage') {
						filter.value = $("#s_stage option:selected").val(); //$('#s_industry').val();
					}
					switch (_key) {
						/*case 'departmentId':
							filter.operate = 'eq';
							break;*/
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
				if (queryFilterArr[3].value != '' && queryFilterArr[4].value != null) {
					var conValue = [];
					conValue = queryFilterArr[3].value.split(',');
					for (var i = 0; i < conValue.length; i++) {
						if (conValue[i] == 'E') {
							queryFilterArr[9].value = 1;
						}
						if (conValue[i] == 'C') {
							queryFilterArr[10].value = 1;
						}
						if (conValue[i] == 'A') {
							queryFilterArr[11].value = 1;
						}
						if (conValue[i] == 'V') {
							queryFilterArr[12].value = 1;
						}
						if (conValue[i] == 'P') {
							queryFilterArr[13].value = 1;
						}
					}
				}
				
				let title = encodeURI('标准审计程序表');
				let param = {
					menuId: window.sys_menuId,
					param2: '',
					param11: '',
					param12: '',
					param13: '',
					param14: '',
					param16: '',
					filter: '',
					sort: 'departmentId',
					dir: 'asc',
					title: title
				};
				
				if(myParams.s_departmentId != BdoFaithConsts.DEPARTMENT_BDO) {
					if (myParams.s_departmentId && myParams.s_departmentId != '') {
						param.param11 = myParams.s_departmentId;
					} else {
						param.param11 = null;
					}
					queryFilterArr = queryFilterArr.slice(1);
				}
				if ($('#s_potentialRisk').val() != '') {
					param.param12 = $('#s_potentialRisk').val();
				} else {
					param.param12 = '';
				}
				if ($('#s_description').val() != '') {
					param.param13 = $('#s_description').val();
				} else {
					param.param13 = '';
				}
				if ($('#s_status').val() != '') {
					param.param14 = $('#s_status').val();
				} else {
					param.param14 = '1';
				}
				if (!$('#s_userablePlate').val()) {
					param.param16 = ''; 
				} else {
					let userablePlateArr = $('#s_userablePlate').val().join(',');
					param.param16 = $('#s_userablePlate').val().join(',');
					for (let i = 0,len = userablePlateArr.length; i < len;i++) {
						if (userablePlateArr[i] == '全部') {
							param.param16 = 'all';
						}
					}
				}
				var queryString = JSON.stringify(queryFilterArr);
				param.filter = queryString;
				param.param2 = page.searchForm.jsonData.s_industry;
				
				$.ajax({
					url: 'cpBase/ExportExcel.exportAuditProgram.json',
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
			},
			/**
			 *  下载审计程序模板
			 * */
            onDownloadAuditFileClick(event){
                var params = {
                    param1: ''
                };
                exportExcelWithTemplate('cpBase/KAuditProgram.downloadAuditFile.json', params);
			},
			/**
			 * 搜索按钮点击事件
			 */
			onSearchClick(event){
				let param = this.searchForm.jsonData;
				if ($('#s_confirmStatus').val() == null) {
					param.s_confirmStatus = '';
				} else {
					param.s_confirmStatus = $('#s_confirmStatus').val().join(',');
				}
				let queryFilterArr = [];
				if (param.s_confirmStatus == null) {
					param.s_confirmStatus = '';
				}
				$.each(param, (key, value) => {
					var _key = key.replace('s_', '');
					var filter = {
						field: _key,
						sqlIndex: 'a.' + _key,
						type: typeof value,
						value: value,
						operate: 'like'
					};
					if (key == 's_industry') {
						filter.value = ''; //$('#s_industry').val();
					}
					if(key == 's_industryName') {
						filter.value = ''; //$('#s_industry').val();
					}
					if(key == 's_stage') {
						filter.value = $("#s_stage option:selected").val(); //$('#s_industry').val();
					}
					switch (_key) {
						/*case 'departmentId':
							filter.operate = 'eq';
							break;*/
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
				if (queryFilterArr[3].value != '' && queryFilterArr[4].value != null) {
					var conValue = [];
					conValue = queryFilterArr[3].value.split(',');
					for (var i = 0; i < conValue.length; i++) {
						if (conValue[i] == 'E') {
							queryFilterArr[9].value = 1;
						}
						if (conValue[i] == 'C') {
							queryFilterArr[10].value = 1;
						}
						if (conValue[i] == 'A') {
							queryFilterArr[11].value = 1;
						}
						if (conValue[i] == 'V') {
							queryFilterArr[12].value = 1;
						}
						if (conValue[i] == 'P') {
							queryFilterArr[13].value = 1;
						}
					}
				}
				if(page.searchForm.jsonData.s_departmentId != BdoFaithConsts.DEPARTMENT_BDO) {
					if (page.searchForm.jsonData.s_departmentId && page.searchForm.jsonData.s_departmentId != '') {
						this.auditprogramTableCnfg.filterParam.param11 = page.searchForm.jsonData.s_departmentId;
					} else {
						this.auditprogramTableCnfg.filterParam.param11 = null;
					}
					queryFilterArr = queryFilterArr.slice(1);
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
				var queryString = JSON.stringify(queryFilterArr);
				this.auditprogramTableCnfg.filterParam.sqlId = 'DG00001';
				this.auditprogramTableCnfg.filterParam.filter = queryString;
				this.auditprogramTableCnfg.filterParam.param2 = page.searchForm.jsonData.s_industry;
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
			onSearchResetClick(event){
				this.searchForm.jsonData = {
					s_departmentId: '',
					s_programName: '',
					s_subjectName: '',
					//s_confirmStatus: '',
					s_stage: '',
					s_industry: '',
					s_dgName: '',
					s_indexId: '',
					s_potentialRisk:'',
					s_description:'',
					s_confirmStatus: '',
					s_userablePlate: ''
				};
				this.auditprogramTableCnfg.filterParam = this.getDefaultFilter();
				$('#s_stage').val(null).trigger("change");
				$("#searchForm")[0].reset();
				//加载oneUI的多选框
				$('.js-select2').select2();
				//修改oneUI多选框的样式
				$('.select2').addClass("form-control");
				$('.select2-selection').attr("style", "border-bottom: 0px");
				$('#s_confirmStatus').append(example2Select2Multiple);
				$('#auditprogramTable').DataTable().ajax.reload();
			},
			getDefaultFilter() {
				return {
					menuId : window.sys_menuId,
					sqlId : 'DG00001',
					param14 : '1'
				};
			},
			onSelectIndustry(event) {
				let selectValue = $('#subject_tree').treeIndustry('getTreeMultiValue');
				let selectLabel =  $('#subject_tree').treeIndustry('getTreeMultiLabel');
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
				let selectLabel =  $('#subject_tree').treeIndustry('getTreeMultiLabel');
				if (typeof(selectValue) === 'object') {
					page.searchForm.jsonData.s_industry = '';
					page.searchForm.jsonData.s_industryName = '';
				} else {
					page.searchForm.jsonData.s_industry = selectValue;
					page.searchForm.jsonData.s_industryName = selectLabel;
				}
				$('#modal_subjectid').modal('hide');
			}
		});
	}
	init();
}());