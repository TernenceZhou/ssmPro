var internSystemDicData = internSystemDicData || ComboLabelValueDicData(false, 'internSystemType');
var reportFormatDicData = reportFormatDicData || ComboLabelValueDicData(false, '底稿报表格式');

var getComboDBOption = function(url, existBlank, customerId) {
	var jsonArr = [];
	$.ajax({
		type: 'post',
		url: url,
		data: {
			blank: existBlank,
			menuId: window.sys_menuId,
			param1: customerId,
			page: 1,
			start: -1,
			limit: -1
			/*
			 * start : 0, limit : 1000
			 */
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			jsonArr = data.data;
		}
	});
	return jsonArr;
};

function getInternSystem(obj) {
	var retVal = '';
	$.each(internSystemDicData, function(i, item){
		if (obj.indexOf(',' + item.value + ',') != -1) {
			if (retVal != '') {
				retVal += '|';
			}
			retVal += item.label;
		}
	});
	return retVal;
}

function getPopedomUpdateTbFormItem() {
	var dataArray = [];
	dataArray.push({
		id: 'popedomUpdate_autoId',
		type: 'input',
		typeAttr: {
			type: 'hidden'
		}
	});
	dataArray.push({
		id: 'popedomUpdate_bindingMembersId',
		type: 'input',
		typeAttr: {
			type: 'hidden'
		}
	});
	dataArray.push({
		id: 'popedomUpdate_name',
		type: 'input',
		label: '姓名',
		rowspan: 1,
		colspan: internSystemDicData.length,
		typeAttr: {
			readonly: true
		}
	});
	dataArray.push({
		id: 'popedomUpdate_mobile',
		type: 'input',
		label: '手机',
		rowspan: 1,
		colspan: internSystemDicData.length,
		typeAttr: {
			readonly: true
		}
	});
	$.each(internSystemDicData, function(i, item){
		if (i == 0) {
			dataArray.push({
				id: 'popedomUpdate_lable' + i,
				type: 'div',
				label: item.label,
				rowspan: 1,
				colspan: 1
			});
		} else {
			dataArray.push({
				id: 'popedomUpdate_lable' + i,
				type: 'div',
				label: item.label,
				colspan: 1
			});
		}
	});	
	$.each(internSystemDicData, function(i, item){
		if (i == 0) {
			dataArray.push({
				id: 'popedomUpdate_check' + i,
				type: 'checkbox',
				rowspan: 1,
				colspan: 1
			});
		} else {
			dataArray.push({
				id: 'popedomUpdate_check' + i,
				type: 'checkbox',
				colspan: 1
			});
		}
	});	
	dataArray.push({
		type: 'input',
		rowspan: 1,
		colspan: internSystemDicData.length,
		typeAttr: {
			readonly: true
		}
	});
	dataArray.push({
		id: 'popedomUpdate_bindingMembers',
		type: 'textarea',
		label: '授权绑定人员',
		rowspan: 1,
		colspan: internSystemDicData.length,
		typeAttr: {
			rows: 3,
			readonly: true
		}
	});
	
	return dataArray;
}

function getVideoUrl(obj){
	let urlMap = {
		// 重要性水平
		"materiality": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300989.m3u8",
		// TB科目维护
		"trialBalance1": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300992.m3u8",
		// TB科目对照
		"trialBalance2": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300990.m3u8",
		// 试算平衡表
		"trialBalance3": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300991.m3u8",
		// 未审报表
		"unaudited": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300993.m3u8",
		// 6-初步分析性复核
		"analysisReview": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300994.m3u8",
		// 科目认定表
		"identified": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300995.m3u8",
		// 计划程序
		"programPlan1": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300996.m3u8",
		// 审计程序
		"programPlan2": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300997.m3u8",
		// 实施程序
		"program1": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300998.m3u8",
		// 底稿
		"program2": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300999.m3u8",
		// 抽凭
		"sampling": "https://training.bdo.com.cn/TrainingFile/2021/courseChapter/136/202012301012110397101.m3u8",
		// 批注
		"clearQuestion": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184301000.m3u8",
		// 附注
		"noteinfo": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184301003.m3u8",
		// 14-最终分析性复核
		"finalAnalysisReview": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184301002.m3u8",
		// 审定报表
		"audited": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184301001.m3u8",
		// 报告
		"report": "https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184301004.m3u8",
		// 报备
		"bbReport": ""
	};
	/*
	 * //首页-查询分析
	 * https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300988.m3u8
	 * //6-初步分析性复核
	 * https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184300994.m3u8
	 * //14-最终分析性复核
	 * https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184301002.m3u8
	 * //项目中心-基础数据配置
	 * https://training.bdo.com.cn/TrainingFile/2020/courseChapter/29/202005141452184301005.m3u8
	 */
	localStorage.setItem('url', urlMap[obj.id]);
	window.open("/Faith/dgCenter/html/dg/video.html?src="+encodeURIComponent(urlMap[obj.id]));
}

function ProjectctrPage() {
	let TBTplDicData = getComboDBOption('cpBase/Combo.getTbRuleacc.json', true, window.CUR_CUSTOMERID);
	let preProjectData = getComboDBOption('cpBase/Combo.getPreProjectList.json', true); // 前推项目
	let projectTbTemplates = {}; // 项目名：TB模板
	let auditPolicyFileData = getComboDBOption('cpBase/Combo.getAuditPolicyFiles.json', true); // 审计策略文件列表
	let isManager = false; // 是否项目负责人
	let projectAuditPolicyFileType = 'pdf';
	let projectYear;
	let projectEndMonth;
	let trialBalanceState;
	let projectReportTemplate;
	let tbTemplateName;
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		async: false,
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
			if (data.success && data.data && data.data.length > 0) {
				if (sys_userId == data.data[0].manager) {
					isManager = true;
				}
			}
		}
	});

	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00209',
			param1: window.CUR_CUSTOMERID,
			start: -1,
			limit: -1
		},
		dataType: 'json',
		async: false,
		success(data) {
			if (data.success) {
				data.data.forEach(v => (projectTbTemplates[v.projectName] = v.tbTemplate));
			}
		}
	});

	let customers = JSON.parse(userCustomers);
	let customersData = customers.map(m => {
		return {value: m.value, label: m.value + '-' + m.label};
	});
	customersData.unshift({value: '', label: ''});
	let cnt = 0;
	const flowName = {
		materiality: '重要性水平设置',
		trialBalance: '试算平衡表',
		unaudited: '未审报表',
		identified: '计划控制表-科目认定表',
		programPlan: '计划控制表-计划程序',
		program: '获取审计证据-实施程序',
		sampling: '抽凭',
		clearQuestion: '批注',
		audited: '审定报表',
		noteinfo: '附注',
		report: '报告',
		analysisReview: '初步分析性复核',
		finalAnalysisReview: '最终分析性复核',
		bbReport: '报备'
	};
	template('./dgProcessHtml', '<div class="row" style="padding: 5px 0;" :updateFlg="updateFlg">'
		+ '	<div class="col-md-12">'
		+ '		<label :class="labelClass.{{id}}" style="width: 180px;text-align: left;">'
		+ '			<input type="checkbox" id="{{id}}" name="{{id}}" v-model="jsonData.{{id}}" :disabled="labelClass.{{id}} != null && labelClass.{{id}}[1] != \'\'">'
		+ '			<span></span>'
		+ '			{{label}}'
		+ '		</label>'
		+ '		<label :class="labelClass.{{id}}" style="width: 365px;text-align: left;">'
		+ '			{{label1}}'
		+ '		</label>'
		+ '	</div>'
		+ '</div>');
	var template_ = tplLoader('dgCenter/html/dg/projectctrl.html');
	const class_ = ['css-input css-checkbox css-checkbox-primary control-label', ''];
	const resetJsonData = {
		autoId: null,
		projectId: null,
		customerId: null,
		r_materiality: true,
		r_trialBalance: true,
		r_unaudited: true,
		r_analysisReview: true,
		r_identified: true,
		r_programPlan: true,
		r_program: true,
		r_sampling: true,
		r_audited: true,
		r_finalAnalysisReview: true,
		r_noteinfo: true,
		r_report: true,
		r_bbReport: true
	};
	const resetLabelClass = {
		r_materiality: [].concat(class_),
		r_trialBalance: [].concat(class_),
		r_unaudited: [].concat(class_),
		r_analysisReview: [].concat(class_),
		r_identified: [].concat(class_),
		r_programPlan: [].concat(class_),
		r_program: [].concat(class_),
		r_sampling: [].concat(class_),
		r_audited: [].concat(class_),
		r_finalAnalysisReview: [].concat(class_),
		r_noteinfo: [].concat(class_),
		r_report: [].concat(class_),
		r_bbReport: [].concat(class_)
	};
	$('#customerProjectSetPage').html(template_);
	let projectInfo;
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
			'#clearNotAssociatedFile': 'click,onClickClearNotAssociatedFile',
			'#refreshStateBtn': 'click,refreshStateTable',
			'#selectProjectBtn': 'click,selectProject',
			'#cloneProjectBtn': 'click,cloneProject',
			'#projectArchive': 'click,projectArchive',
			// '#cancelProjectArchive': 'click,cancelProjectArchive',
			'#resetProjectDgBtn': 'click,resetProjectDg',
			'#downloadDgBtn': 'click,showDgworkpagerBackup',
			'#tb_export_zip': 'click,exportZip',
			'#saveSettingInfoBtn': 'click,saveSettingInfo',
			'#refreshSettingInfoBtn': 'click,refreshSettingInfo',
			'#saveAuditUserBtn': 'click,saveAuditUserInfo',
			'#downloadCurrentDgBtn': 'click,onDownloadCurrentDg',
			'#syncProjectFile2EdocBtn': 'click,onSyncProjectFile2EdocBtn',
			'#refreshDgNumBtn': 'click,refreshDgNum',
			'#mergeType': 'click,changeMergeType'
			/*
													 * , '#dgFinishedTable
													 * .bdo-project-ctl-progress-bar':
													 * 'click,onClickProgressDetailed'
													 */
		},
		refreshSettingInfo(){
			this.fetchProjectInfo().done(() => {
				!projectInfo.projectStartDate && $('#projectStartDate').datepicker("setDate", null);
				!projectInfo.projectEndDate && $('#projectEndDate').datepicker("setDate", null);
			});
		}
		, initProgressDetailedSider() {
			this.projectctlPDProgramSider = side({el: '#projectctlPDProgramSider'});
			this.projectctlPDProgramPlanSider = side({el: '#projectctlPDProgramPlanSider'});
			this.projectctlPDIdentifiedSider = side({el: '#projectctlPDIdentifiedSider'});
			$('#projectctlPDProgramHaveDoneFilter').empty().append(ComboDicOption(false, '项目进度完成状态'));
			$('#projectctlPDProgramHaveDoneFilter').val(0);
			this.projectctlPDNoteinfoSider = side({el: '#projectctlPDNoteinfoSider'});
			$('#projectctlPDNoteinfoHaveDoneFilter').empty().append(ComboDicOption(false, '项目进度完成状态'));
			$('#projectctlPDNoteinfoHaveDoneFilter').val(0);

			// $('#projectctlPDIdentifiedIsMapBaseSubjectFilter').empty().append(ComboDicOption(false,
			// '科目认定完成状态-TB是否对照'));
			//
			$('#projectctlPDIdentifiedIsFinishFilter').empty().append(ComboDicOption(false, '科目认定完成状态-完成状态'));
			/*
			 * $('#projectctlPDIdentifiedIsSetEcvapFilter').empty().append(ComboDicOption(false,
			 * '科目认定完成状态-是否设置认定'));
			 * $('#projectctlPDIdentifiedIsSetSubjectEditorFilter').empty().append(ComboDicOption(false,
			 * '科目认定完成状态-是否设置科目编制人'));
			 * $('#projectctlPDIdentifiedIsCreatedProgramFilter').empty().append(ComboDicOption(false,
			 * '科目认定完成状态-是否生成审计程序'));
			 */
		}
		/**
		 * 初始化函数
		 */
		, init: function (options) {
			let me = this;

			$('input').attr('autocomplete', 'true');

			this.resetDgSider = side({el: '#resetDgSider'});
			this.resetDgForm = createForm(this.resetDgFormCfg);
			// 项目基本信息
			this.projectInfoForm = createForm(this.projectInfoFormCfg);
			// 项目底稿基本设置
			this.projectDgSettingForm = createForm(this.projectDgSettingFormCfg);
			// 追加账套结束月份
			$('#year').closest('tr').append('<td rowspan="1" colspan="1" style="width: 30%;" class="has-success">' +
				'<div class="form-material ">' +
				'<input id="endMonth" type="number" max="12" min="1" class="form-control required digits" ' +
				'data-toggle="tooltip" data-placement="top" ' +
				'       name="endMonth"   aria-required="true" aria-describedby="endMonth-error" ' +
				'       aria-invalid="false" />' +
				'<label for="endMonth">账套结束月份<span class="necessary">*</span></label>' +
				'</div>' +
				'</td>');
			$('#year').closest('tr').append('<td rowspan="1" colspan="1" style="width: 30%;" class="has-success"><div class="form-material form-group">' +
			'	<label class="col-xs-12 css-radio css-radio-primary">程序类型&nbsp<i style="color:black" class="fa fa-question-circle-o" title="程序类型选择简易时默认生成的审计程序只包含明细表、函证、监盘相关。"></i></label>' +
			'	<div class="col-xs-12 css-input css-radio css-radio-primary">' +
			'	<label class="css-input css-radio css-radio-primary">' +
			'	<input type="radio" name="projectType" data-result="1"><span></span></label>通用 <label' +
			'		class="css-input css-radio css-radio-primary"' +
			'		style="margin-left: 10px;"> <input type="radio"' +
			'		name="projectType" data-result="2"><span></span>' +
			'	</label>简易 <label' +
			'		class="css-input css-radio css-radio-primary"' +
			'		style="margin-left: 10px;"> <input type="radio"' +
			'		name="projectType" data-result="3"><span></span>' +
			'	</label>自定义 </div>' +
			'</div></td>');
			// if ("1054" == departIdrSession) {
			// 	$('#year').closest('tr')
			// 		// 是否合并项目
			// 		.append('<td rowspan="1" colspan="2" style="width: 50%;" class="has-success"><div class="form-group">' +
			// 			'<div class="col-xs-12">' +
			// 			'<label class="css-input switch switch-sm switch-info" style="white-space:nowrap;">' +
			// 			'<input type="checkbox" id="mergeType" name="mergeType">' +
			// 			'<span></span> 是否合并项目' +
			// 			'</label>' +
			// 			'</div>' +
			// 			'</div></td>');
			// }


			!isManager && $('#preProjectName').attr("disabled", true); // 非项目负责人不能修改前推项目

			// 追加项目开始日结束日（vue会莫名清空值，采用jquery方式插入）
			$('#projectDateFromTo').closest('td').before('<td rowspan="1" colspan="3" style="width: 50%;min-width:100px" class="has-success">' +
				'<div class="form-material ">' +
				'<input id="projectStartDate" class="form-control" ' +
				'data-toggle="tooltip" data-placement="top" ' +
				'       name="projectStartDate" ' +
				'       aria-invalid="false" />' +
				'<label for="projectStartDate" style="color:#646464">项目开始日</label>' +
				'</div>' +
				'</td>').after('<td rowspan="1" colspan="3" style="width: 50%;min-width:100px" class="has-success">' +
				'<div class="form-material ">' +
				'<input id="projectEndDate" class="form-control" ' +
				'data-toggle="tooltip" data-placement="top" ' +
				'       name="projectEndDate" ' +
				'       aria-invalid="false" />' +
				'<label for="projectEndDate" style="color:#646464">项目结束日</label>' +
				'</div>' +
				'</td>').remove(); // 删除占位td

			$('#projectStartDate').attr("readonly", true);
			$('#projectEndDate').attr("readonly", true);
			!isManager && $('#auditPolicyFileId').attr("disabled", true); // 非项目负责人不能修改审计策略文件
			if (isManager) {
				// 项目负责人可以修改开始结束日
				$('#projectStartDate').datepicker({
					autoclose: true,
					todayHighlight: true,
					language: 'zh-CN', // 语言设置
					format: 'yyyy-mm-dd', // 日期显示格式
					minViewMode: 0
				});
				$('#projectEndDate').datepicker({
					autoclose: true,
					todayHighlight: true,
					language: 'zh-CN', // 语言设置
					format: 'yyyy-mm-dd', // 日期显示格式
					minViewMode: 0
				});
			}
			// 追加审计策略文件查看图标
			$('#auditPolicyFileId').closest('tr').append('<td rowspan="1" colspan="1" style="width: 16.6%;min-width:100px" class="has-success">' +
				'<button id="btnOnlinepreviewAuditPolicyFile" class="btn btn-xs table-btn-operate btn-success" type="button" data-placement="top" title="在线预览" data-toggle="tooltip" data-row="0"><i class="fa fa-eye"></i></button>' +
				'</td>');
			$('#btnOnlinepreviewAuditPolicyFile').click(function () {
				if ($('#auditPolicyFileId').val() == '') {
					bdoInfoBox('提示', '尚未关联总体审计策略！', 1500);
					return;
				}

				window.open('dgCenter/DgMain.previewAuditPolicyFile.json?param1=' + $('#auditPolicyFileId').val() + '&param2=' + projectInfo.customerId, '总体审计策略', 'location=no');
			});
			// 追加模板下载图标
			$('#tbTemplate').closest('tr').append('<td rowspan="1" colspan="1" style="width: 16.6%;min-width:100px" class="has-success">' +
				'<button id="btnTbTemplateDownload" class="btn btn-xs table-btn-operate btn-success" type="button" data-placement="top" title="下载模板" data-toggle="tooltip" data-row="0"><i class="fa fa-download"></i></button>' +
				'</td>');
			$('#btnTbTemplateDownload').click(function () {
				var autoId = $('#tbTemplate').attr('datavalue');
				if (!autoId) {
					bdoErrorBox('提示', '请先选择TB模板');
					return;
				}
				var init_table_view = {
					localParam: {
						tabNum: true,
						url: 'cpBase/General.query.json',
						urlparam: {
							sqlId: 'FA40031',
							menuId: window.sys_menuId,
							start: -1,
							limit: -1,
							param1: autoId
						}
					},
					tableParam: {
						select: true,
						lengthChange: false,
						dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
						order: [1, 'ASC'],
						ordering: true,
						serverSide: true,
						// rowReorder: {
						// update: false
						// },
						columnDefs: [{
							targets: 2,
							className: 'text-left',
							title: 'TB科目编号',
							name: 'tbSubjectId',
							data: 'tbSubjectId',
							width: '80px'
						}, {
							targets: 3,
							className: 'text-left',
							title: 'TB科目名称',
							name: 'tbSubjectName',
							data: 'tbSubjectName',
							width: '100px'
						}, {
							targets: 6,
							className: 'text-left',
							title: '计算公式',
							name: 'calFun',
							data: 'calFun',
							width: '200px',
							render: function(data, type, row, meta) {
								if (data != null) {
									if (data.length > 35) {
										var str = '<span title="' + data + '">';
										for (var i = 0; i < data.length / 35; i++) {
											str += data.substring(i * 33, (i + 1) * 33) + '<br/>';
										}
										str += '</span>';
										return str;
									} else {
										return '<span>' + data + '</span>';
									}
								} else {
									return '<span></span>';
								}
							}
						}]
					}
				};
				BdoDataTable('tbTemplateDownload_table', init_table_view);
				exportExcel6(this, $('#tbTemplate').val(), init_table_view, 'tbTemplateDownload_table');
			});
			$('#tbReportTemplate').closest('tr').append('<td rowspan="1" colspan="1" style="width: 16.6%;min-width:100px" class="has-success">' +
				'<button id="btnTbReportTemplateDownload" class="btn btn-xs table-btn-operate btn-success" type="button" data-placement="top" title="下载模板" data-toggle="tooltip" data-row="0"><i class="fa fa-download"></i></button>' +
				'</td>');
			$('#btnTbReportTemplateDownload').click(function () {
				var autoId = $('#tbReportTemplate').attr('datavalue');
				if (!autoId) {
					bdoErrorBox('提示', '请先选择报表模板');
					return;
				}
				$.ajax({
					url: 'dgCenter/DgProject.queryReportWordFile.json',
					type: 'post',
					data: {param1: autoId},
					dataType: 'json',
					success(data) {
						if (data.success) {
							downloadFile('dgCenter/DgProject.downloadReportWordFile.json', {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: autoId
							});
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
				BdoDataTable('tbTemplateDownload_table', init_table_view);
				exportExcel6(this, $('#tbTemplate').val(), init_table_view, 'tbTemplateDownload_table');
			});
			$('input[type=radio][name=projectType]').change(function() {
				if ($('[name=\'projectType\']:checked').attr('data-result') == '2') {
					bdoInfoBox('提示', '是否确认只生成明细表、函证、监盘相关的审计程序？');
				}
			});
			$('input[type=radio][name=projectType]').click(function() {
				if ($('[name=\'projectType\']:checked').attr('data-result') == '3') {
					let ruleOption = ComboDBOptionWithParam('cpBase/Combo.getAuditProgramRuleacc.json', true, {param1: window.departIdrSession});
					$('#auditProgram_ruleacc').html(ruleOption);
					if(me.dgProjectInfo.auditProgramRuleAccId != null && me.dgProjectInfo.auditProgramRuleAccId != ''){
						$('#auditProgram_ruleacc').val(me.dgProjectInfo.auditProgramRuleAccId);
					}else{
						$('#auditProgram_ruleacc').val('');
					}
					$('#modal_auditProgramRuleAcc').modal('show');
				}
			});
			// 审计程序模板选择
			$('#modal_ruleAcc_sure').click(function() {
				var ruleAccId = $('#auditProgram_ruleacc').val();
				if (ruleAccId == null || ruleAccId == '') {
					bdoInfoBox('提示', '请选择程序模板！');
					return;
				}
				bdoConfirmBox('添加', '是否确认保存？', function() {
					$.ajax({
						url: 'dgCenter/DgProject.saveProjectAuditProgramRuleAcc.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: '3',
							param4: $('#auditProgram_ruleacc').val()
						},
						dataType: 'json',
						success: function(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#modal_auditProgramRuleAcc').modal('hide');
								me.dgProjectInfo.auditProgramRuleAccId = $('#auditProgram_ruleacc').val();
								me.dgProjectInfo.projectType = '3';
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			});
			// 前推项目选择
			this.preProjectDgSettingForm = createForm(this.preProjectDgSettingFormCfg);

			this.fetchProjectInfo().done(function () {
				me.dgHistoryVm = new Vue(me.dgHistoryVmComp);
				// 底稿完成状态
				BdoDataTable('dgFinishedTable', me.dgFinishedTableCfg);
				me.cureventsBind();
				me.memberBlackList();
				
				me.assertProject();
				me.projectIndustry();
				me.internManage();
				me.selectDownloadWorkPaper();
				me.initProgressDetailedSider();
				// TODO
				/*
				 * me.cmp.projectArchive.hide();
				 * me.cmp.cancelProjectArchive.hide();
				 */
				if (projectInfo.manager != sys_userId) {
					me.cmp.cloneProjectBtn.hide();
					me.cmp.saveSettingInfoBtn.hide();
					me.cmp.saveAuditUserBtn.hide();
					$('#memberDisabled').parent().remove();
					$('#assertProjectBtn').parent().remove();
				}
				/*
				 * if(projectInfo.manager == sys_userId){
				 * if(projectInfo.projectArchive==0
				 * ||projectInfo.projectArchive==null ||projectInfo.project
				 * =="undefined"){ me.cmp.projectArchive.show(); }else{
				 * /!*me.cmp.cancelProjectArchive.show();*!/ }
				 *  }
				 */
			});
			this.refreshDgNum();
			// $('#refreshDgNumBtn').click();

			// 选择前推项目时，自动设定TB模板
/*
 * $('#preProjectName').change(function () { let prePjtNm =
 * $('#preProjectName').val(); projectTbTemplates[prePjtNm] &&
 * $('#tbTemplate').selectpicker('val', projectTbTemplates[prePjtNm]); if
 * ($('#tbTemplate').selectpicker('val') || $('#tbTemplate').selectpicker('val') ==
 * '') { bdoErrorBox("错误", "前推项目TB模板未设置"); } });
 */
		}
		/**
		 * 绑定事件
		 */
		, cureventsBind() {
			this.dgBackupFileTableInitFlg = false;
			this.dgBackupFileSider = side({
				el: '#dgBackupFileSider', afterShow() {
					if (page.dgBackupFileTableInitFlg) {
						$('#dgBackupFileTable').DataTable().ajax.reload();
					} else {
						BdoDataTable('dgBackupFileTable', page.dgBackupFileTableCfg);
					}
					page.dgBackupFileTableInitFlg = true;
				}
			});
			$('#dgBackupFileTable').on('click', 'button.table-btn-operate[name="downloadBackupFileBtn"]', event => {
				if (projectInfo.manager != sys_userId) {
					bdoInfoBox('提示', '非项目负责人无权限下载历史底稿！');
					return;
				}
				var table = $('#dgBackupFileTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				downloadFile('dgCenter/DgProject.downloadBackupFile.json', {
					param1: rowData.autoId,
					param2: rowData.customerId
				});
			});
			function getParam(auditUser, rowNum, prefix){
				let param = {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: page.dgProjectInfo.autoId,
					param2: page.dgProjectInfo.projectId,
					param3: page.dgProjectInfo.customerId,
					param4: auditUser,
					param5: rowNum,
					param6: prefix
				};
				if(prefix == 'trialBalance'){
					// 试算平衡表
					var columnInfo = [{
								className: 'text-left width-subject-id',
								cnName: 'TB科目编号',
								enName: 'colCode',
								size: '102'
							},{
								className: 'text-left width-subject-name',
								cnName: '科目名称',
								enName: 'colDisp',
								size: '205'
							},{
								className: 'text-right width-je',
								cnName: window.CUR_PROJECT_ACC_YEAR + '年<br>未审数',
								enName: 'unAuditAmount' + window.CUR_PROJECT_ACC_YEAR,
								size: '124'
							},{
								className: 'text-right width-je',
								cnName: window.CUR_PROJECT_ACC_YEAR + '年<br>审计调整数',
								enName: 'adjustAmount' + window.CUR_PROJECT_ACC_YEAR,
								size: '124'
							},{
								className: 'text-right width-je',
								cnName: window.CUR_PROJECT_ACC_YEAR + '年<br>审定数',
								enName: 'auditAmount' + window.CUR_PROJECT_ACC_YEAR,
								size: '124'
							},{
								className: 'text-right width-je',
								cnName: (parseInt(CUR_PROJECT_ACC_YEAR) - 1) + '年<br>未审数',
								enName: 'unAuditAmount' + (parseInt(CUR_PROJECT_ACC_YEAR) -1),
								size: '124'
							},{
								className: 'text-right width-je',
								cnName: (parseInt(CUR_PROJECT_ACC_YEAR) - 1) + '年<br>审计调整数',
								enName: 'adjustAmount' + (parseInt(CUR_PROJECT_ACC_YEAR) -1),
								size: '124'
							},{
								className: 'text-right width-je',
								cnName: (parseInt(CUR_PROJECT_ACC_YEAR) - 1) + '年<br>审定数',
								enName: 'auditAmount' + (parseInt(CUR_PROJECT_ACC_YEAR) -1),
								size: '124'
							}];
					let myParams = {};
					myParams.columnMap = columnInfo;
					myParams.queryUrl = 'dgCenter/FTBSubjectContract.tbListAndCheck.json';
					myParams.param1 = window.CUR_CUSTOMERID;
					myParams.param2 = window.CUR_PROJECT_ACC_YEAR;
					myParams.param3 = window.CUR_PROJECT_ACC_YEAR;
					myParams.param4 = '2';
					myParams.refreshFlg = '1';
						param.param7 = JSON.stringify(myParams);
				}else if(prefix == 'unaudited'){
					// 未审报表-期末（本期）
					let myParams1 = [{
						queryUrl: 'dgCenter/FUnAuditReport.unAuditReport.json',
						param4: '2',
						refreshFlg: '1',
						param5: '1'
					}, {
						queryUrl: 'dgCenter/FUnAuditReport.tbListCheck.json',
						param3: '',
						refreshFlg: '1'
					}];
					// 未审报表-期初（上期）
					let myParams2 = [{
						queryUrl: 'dgCenter/FUnAuditReport.unAuditReport.json',
						param4: '2',
						param5: '2',
						refreshFlg: '1',
					}, {
						queryUrl: 'dgCenter/FUnAuditReport.tbListCheck.json',
						param3: parseInt(CUR_PROJECT_ACC_YEAR) - 1,
						refreshFlg: '1'
					}];
					param.param7 = JSON.stringify(myParams1);
					param.param8 = JSON.stringify(myParams2);
				}else if(prefix == 'audited'){
					// 审定报表
					let myParams = [{
						queryUrl: 'dgCenter/FUnAuditReport.auditReport.json',
						param4: '2',
						param5: '1'
					}, {
						queryUrl: 'dgCenter/FUnAuditReport.tbListCheck.json',
						param3: ''
					}];
					param.param7 = JSON.stringify(myParams);
				}
				return param;
			}
			$('#dgFinishedTable').on('click', 'button.table-btn-operate[name="optAudit"]', function(event) {
				let table = $('#dgFinishedTable').dataTable();
				let rowNum = $(event.currentTarget).attr('data-row');
				let rowData = table.fnGetData(rowNum);
				let auditUser = $('[name="' + rowData.prefix + 'AuditUser"]').val();
				if (rowData.State >= 100 && auditUser && auditUser != '') {
					bdoConfirmBox('提示', '确定审核通过吗？', function() {
						bdoInProcessingBox('审核中...');
						var param = getParam(auditUser, rowNum, rowData.prefix);
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgProject.auditDgProgress.json',
							data: param,
							/*
							 * menuId: window.sys_menuId, param1:
							 * page.dgProjectInfo.autoId, param2:
							 * page.dgProjectInfo.projectId, param3:
							 * page.dgProjectInfo.customerId, param4: auditUser,
							 * param5: rowNum, param6: rowData.prefix
							 */
							dataType: 'json',
							success(data) {
								if (data.success) {
									page.fetchProjectInfo().done(() => {
										$('#dgFinishedTable').DataTable().ajax.reload();
										bdoSuccessBox('成功', '审核成功！');
									});
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					});
				} else {
					if (rowData.State >= 10) {
						bdoErrorBox('错误', flowName[rowData.prefix] + '进度未完成！');
					} else {
						bdoErrorBox('错误', flowName[rowData.prefix] + '审核人未设置！');
					}
				}
			});

			$('#dgFinishedTable').on('click', 'button.table-btn-operate[name="optCancelAudit"]', function(event) {
				let table = $('#dgFinishedTable').dataTable();
				let rowNum = $(event.currentTarget).attr('data-row');
				let rowData = table.fnGetData(rowNum);
				let auditUser = $('[name="' + rowData.prefix + 'AuditUser"]').val();
				if (rowData.State >= 100 && auditUser && auditUser != '') {
					bdoConfirmBox('提示', '确定撤销审核吗？', function() {
						bdoInProcessingBox('撤销审核中...');
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgProject.unauditDgProgress.json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: page.dgProjectInfo.autoId,
								param2: page.dgProjectInfo.projectId,
								param3: page.dgProjectInfo.customerId,
								param4: auditUser,
								param5: rowNum,
								param6: rowData.prefix
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									page.fetchProjectInfo().done(() => {
										$('#dgFinishedTable').DataTable().ajax.reload();
										bdoSuccessBox('成功', '撤销成功！');
									});
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					});
				} else {
					if (rowData.State >= 100) {
						bdoErrorBox('错误', flowName[rowData.prefix] + '审核人未设置！');
					} else {
						bdoErrorBox('错误', flowName[rowData.prefix] + '进度未完成！');
					}
				}
			});

			$('#dgFinishedTable').on('click', 'div.bdo-project-ctl-progress-bar', page.onClickProgressDetailed);


			$('.projectctl-pd').change(page.onClickProgressDetailedFilter);
			App.initHelpers('easy-pie-chart');
			// 项目
			if ((CUR_CUSTOMERID != null && window.CUR_CUSTOMERID != '' && window.CUR_CUSTOMERID != 'null')) {
				$('#set_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false, {param1: window.CUR_CUSTOMERID}));
				$('#set_projectId').val(window.CUR_PROJECTID);
			}

			// 客户选择
			$('#set_customerId').change(function() {
				$('#set_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false, {param1: $('#set_customerId').val()}));
			});

			// 选择按钮
			$('#preProjectSelect').on('click', function() {
				$('#preProjectDg-modal').modal('show');
				$('#preProjectDg-modal').draggable();
				$('#preProjectDg-modal').css('overflow-y', 'scroll');
				return false;
			});
			// 确定
			$('#preProject-save').on('click', function() {
				// $('#preProjectName').val($('#preProjectId').find('option:selected').text());
				// page.projectDgSettingForm.jsonData.preProjectName =
				// $('#preProjectId').val();
				$('#preProjectDg-modal').modal('hide');
				if ($('#quoteTb').is(':checked')) {
					$('#tbTemplate').selectpicker('val', $('#quoteTb').attr('data-value'));
				}
				let reportId = $('#quoteReport').attr('data-value');
				if ($('#quoteReport').is(':checked') && $('#tbReportTemplate').attr('data-result') != reportId) {
					$('#tbReportTemplate').treecombo('setValue', reportId);
				}
				return false;
			});
			// 选择按钮
			$('#projectMergeScopeSelect').on('click', function() {
				$('#projectMerge-modal').modal('show');
				$('#projectMerge-modal').draggable();
				$('#projectMerge-modal').css('overflow-y', 'scroll');
				return false;
			});
			$('#projectMerge-modal').on('show.bs.modal', function() {
				getUserLocalYear('search_yyyy');
				// $('#search_yyyy').val()
				$('#search_customer').val(window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);
				$('#search_customer').attr('title', window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);
				searchUnselectedProject();
				searchSelectedProject();
			});

			// 已选项目
			function searchSelectedProject() {
				$('#project_selected').empty();
				var projectIdMerge = $('#projectIdMergeText').attr('data-value');
				if (projectIdMerge != null && projectIdMerge != '') {
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						// async : false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00124',
							param1: window.CUR_CUSTOMERID,
							param2: projectIdMerge,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if (data.data.length > 0) {
									for (let list of data.data) {
										if (list.projectName.indexOf(list.projectId) != -1) {
											$('#project_selected').append('<option value="' + list.projectId + '" title="' + list.projectName + '">' + list.projectName + '</option>');
										} else {
											$('#project_selected').append('<option value="' + list.projectId + '" title="' + list.projectId + '-' + list.projectName + '">' + list.projectId + '-' + list.projectName + '</option>');
										}
									}
									$('#project_selected').get(0).selectedIndex = 0;
								}
							}
						}
					});
				}
			}

			// 未选项目
			function searchUnselectedProject() {
				var param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00123',
					param1: window.CUR_CUSTOMERID,
					param2: $('#search_yyyy').val(),
					start: -1,
					limit: -1
				};
				var param3 = $('#projectIdMergeText').attr('data-value');
				if (param3 != null && param3 != '') {
					param.param3 = param3;
				}
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					// async : false,
					data: param,
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#project_unselected').empty();
							if (data.data.length > 0) {
								for (let list of data.data) {
									if (list.projectName.indexOf(list.projectId) != -1) {
										$('#project_unselected').append('<option value="' + list.projectId + '" title="' + list.projectName + '">' + list.projectName + '</option>');
									} else {
										$('#project_unselected').append('<option value="' + list.projectId + '" title="' + list.projectId + '-' + list.projectName + '">' + list.projectId + '-' + list.projectName + '</option>');
									}
								}
								$('#project_unselected').get(0).selectedIndex = 0;
							}
						}
					}
				});
			}

			//
			$('#search_yyyy').change(function() {
				searchUnselectedProject();
			});
			// 未选项目-->已选项目
			$('#unselected2selected').on('click', function() {
				// 未选项目
				if ($('#project_unselected').find('option:selected').length == 0) {
					bdoInfoBox('提示', '请选择未选项目');
					return;
				}
				var text = $('#project_unselected').find('option:selected').text();
				var value = $('#project_unselected').find('option:selected').val();
				var index = $('#project_unselected').find('option:selected').index();
				var length = $('#project_unselected')[0].length;
				$('#project_unselected').find('option:selected').remove();
				if (index == 0 && length > 1) {
					$('#project_unselected').get(0).selectedIndex = 0;
				} else if (index > 0 && length > 1) {
					$('#project_unselected').get(0).selectedIndex = parseInt(index - 1);
				}
				if ($('#project_selected option[value="' + value + '"]').length == 0) {
					// 已选项目
					$('#project_selected').prepend('<option value="' + value + '" title="' + text + '">' + text + '</option>');
				}
				$('#project_selected').val(value);
				$('#project_selected').focus();
			});
			// 已选项目-->未选项目
			$('#selected2unselected').on('click', function() {
				// 已选项目
				if ($('#project_selected').find('option:selected').length == 0) {
					bdoInfoBox('提示', '请选择已选项目');
					return;
				}
				var text = $('#project_selected').find('option:selected').text();
				var value = $('#project_selected').find('option:selected').val();
				var index = $('#project_selected').find('option:selected').index();
				var length = $('#project_selected')[0].length;
				$('#project_selected').find('option:selected').remove();
				if (index == 0 && length > 1) {
					$('#project_selected').get(0).selectedIndex = 0;
				} else if (index > 0 && length > 1) {
					$('#project_selected').get(0).selectedIndex = parseInt(index - 1);
				}
				// 未选项目
				$('#project_unselected').append('<option value="' + value + '" title="' + text + '">' + text + '</option>');
				$('#project_unselected').val(value);
				$('#project_unselected').focus();
			});
			// 确定
			$('#projectMerge-save').on('click', function() {
				var length = $('#project_selected').find('option').length;
				if (length > 0) {
					var projectIdMerge = $('#project_selected').find('option')[0].value;
					var projectMergeText = $('#project_selected').find('option')[0].text + '(+' + length + ')';
					for (var i = 1; i < length; i++) {
						var option = $('#project_selected').find('option')[i];
						projectIdMerge = projectIdMerge + ',' + option.value;
					}
					$('#projectIdMergeText').val(projectMergeText);
					$('#projectIdMergeText').attr('title', projectMergeText);
					$('#projectIdMergeText').attr('data-value', projectIdMerge);
				} else {
					bdoInfoBox('提示', '未选择已选项目');
				}
				$('#projectMerge-modal').modal('hide');
				return false;
			});

			// 项目合并范围【父项目...】按钮
			$('#btnOpenParentProjectModal').on('click', function(e) {
				e.preventDefault();
				let region = '#mergeProjectModal';
				let data = {
					customerId: projectInfo.customerId,
					projectId: projectInfo.projectId,
					mode: 'parent',
				};
				DgMergeProjectPage({region, data});
				return false;
			});
			// 项目合并范围【父项目...】按钮
/*
 * $('#openParentProjectModal').on('click', function(e) { e.preventDefault();
 * let region = '#mergeProjectModal'; let data = { customerId:
 * projectInfo.customerId, projectId: projectInfo.projectId, mode: 'parent', };
 * DgMergeProjectPage({region, data}); return false; });
 */

			// 项目合并范围【子项目...】按钮
			$('#btnOpenChildProjectModal').on('click', function(e) {
				e.preventDefault();
				let region = '#mergeProjectModal';
				let data = {
					customerId: projectInfo.customerId,
					projectId: projectInfo.projectId,
					mode: 'child',
				};
				DgMergeProjectPage({region, data});
				return false;
			});
			// 总体审计策略选择即保存
			$('#auditPolicyFileId').change(function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgProject.saveAuditPolicy.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: $('#auditPolicyFileId').val()
					},
					async : false,
					dataType: 'json',
					success(data) {
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		}
		/**
		 * 刷新底稿统计
		 */
		, refreshDgNum(event) {
			/*
			 * 范围界定：附件数量 识别风险和评估：审计程序数量（计划） 附件数量 设计审计应对措施：附件数量 获取审计证据：底稿数量
			 * 底稿附件数量 审计程序数量（实施） 形成意见：批注数量
			 */
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgProject.dgCount.json',
				// async : false,
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						// 范围界定：附件数量
						$('#count_num_1').html(data.data[0].attachNum_1);
						// 识别风险和评估：审计程序数量（计划）
						$('#count_num_2').html(data.data[0].auditProcessNum_plan);
						// 识别风险和评估：附件数量
						$('#count_num_3').html(data.data[0].attachNum_2);
						// 设计审计应对措施：附件数量
						$('#count_num_4').html(data.data[0].attachNum_3);
						// 获取审计证据：底稿数量
						$('#count_num_5').html(data.data[0].dgNum);
						// 获取审计证据：底稿附件数量
						$('#count_num_6').html(data.data[0].dgAttachNum);
						$('#count_num_6').attr("title",data.data[0].isReferred);
						// 获取审计证据：审计程序数量（实施）
						$('#count_num_7').html(data.data[0].auditProcessNum_implement);
						// 形成意见：批注数量
						$('#count_num_8').html(data.data[0].postilNum);
					}
				}
			});
		}
		/**
		 * 显示进度详细信息
		 */
		, showProgressDetailed: {
			program(event) {
				$.ajax({
					url: 'dgCenter/DgGeneral.query.json',
					type: 'post',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00429',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							page.projectctlPDProgramSider.show();
							if(!page.projectctlPDProgramTable) {
								// TB科目
								$('#projectctlPDProgramSubjectFilter').empty().append("<option value=''></option>");
								// "1001-库存现金,1002-银行存款,1012-其他货币资金"
								for(var subject of data.data[0].subjects.split(',')){
									$('#projectctlPDProgramSubjectFilter').append("<option value='" + subject + "' title='" + subject + "'>" + subject + "</option>");
								}
								// 底稿编制人
								$('#projectctlPDProgramWorkpaperEditorFilter').empty().append("<option value=''></option>");
								// 6615-朱君芳,18859-周绮婷
								for(var workpaperEditor of data.data[0].workpaperEditors.split(',')){
									var workpaperEditorId = workpaperEditor.split('-')[0];
									var workpaperEditorName = workpaperEditor.split('-')[1];
									$('#projectctlPDProgramWorkpaperEditorFilter').append("<option value='" + workpaperEditorId + "' title='" + workpaperEditorName + "'>" + workpaperEditorName + "</option>");
								}
								let val = 0;
								let filter = {
										field: 'haveDone',
										sqlIndex: 'ap.' + 'haveDone',
										type: typeof Number,
										value: val,
										operate: 'eq'
								};
								let filterParam = [];
								if(val == '-1') { // all
									page.projectctlPDProgramTableCfg.localParam.urlparam.filter = null;
								}else {
									filterParam.push(filter);
									page.projectctlPDProgramTableCfg.localParam.urlparam.filter = JSON.stringify(filterParam);
								}
								BdoDataTable('projectctlPDProgramTable', page.projectctlPDProgramTableCfg);
								page.projectctlPDProgramTable = $('#projectctlPDProgramTable');
							}else {
								page.projectctlPDProgramTable.DataTable().ajax.reload();
							}
						}
					}
				});
			},
			programPlan(event) {
				page.projectctlPDProgramPlanSider.show();
				if(!page.projectctlPDProgramPlanTable) {
					BdoDataTable('projectctlPDProgramPlanTable', page.projectctlPDProgramPlanTableCfg);
					page.projectctlPDProgramPlanTable = $('#projectctlPDProgramPlanTable');
				}else {
					page.projectctlPDProgramPlanTable.DataTable().ajax.reload();
				}
			},
			identified(event) {
				page.projectctlPDIdentifiedSider.show();
				if(!page.projectctlPDIdentifiedTable) {
					BdoDataTable('projectctlPDIdentifiedTable', page.projectctlPDIdentifiedTableCfg);
					page.projectctlPDIdentifiedTable = $('#projectctlPDIdentifiedTable');
				}else {
					page.projectctlPDIdentifiedTable.DataTable().ajax.reload();
				}
			},
			noteinfo(event) {
				page.projectctlPDNoteinfoSider.show();
				if ($.sessionStorage("mergeType") === "1") {
					page.projectctlPDNoteinfoTableCfg.localParam.urlparam.sqlId = "HB00033";
				}
				if(!page.projectctlPDNoteinfoTable) {
					let val = 0;
					let filter = {
						field: 'haveDone',
						sqlIndex: 'a.' + 'haveDone',
						type: typeof Number,
						value: val,
						operate: 'eq'
					};
					let filterParam = [];
					if(val == '-1') { // all
						page.projectctlPDNoteinfoTableCfg.localParam.urlparam.filter = null;
					}else {
						filterParam.push(filter);
						page.projectctlPDNoteinfoTableCfg.localParam.urlparam.filter = JSON.stringify(filterParam);
					}
					BdoDataTable('projectctlPDNoteinfoTable', page.projectctlPDNoteinfoTableCfg);
					page.projectctlPDNoteinfoTable = $('#projectctlPDNoteinfoTable');
				}else {
					page.projectctlPDNoteinfoTable.DataTable().ajax.reload();
				}
			},
			clearQuestion(event) {
				// 跳转到批注汇总
				$('body').trigger('transferMenu', [{
					menuId: '40000072'
				}, function() {
				}]);
			}
		}
		/**
		 * 显示进度详细信息
		 * 
		 * @param event
		 */
		, onClickProgressDetailed(event) {
			let $el = $(event.currentTarget);
			page.showProgressDetailed[$el.attr('data-row-prefix')] && page.showProgressDetailed[$el.attr('data-row-prefix')](event);
		}
		, progressDetailedFilter: {
			projectctlPDProgramFilter(event) {
				let $el = $(event.currentTarget);
				let val = $el.val();
				var id = $el.attr('id');
				let newFilterParam = [];
				if(page.projectctlPDProgramTableCfg.localParam.urlparam.filter != null){
					let filterParam = JSON.parse(page.projectctlPDProgramTableCfg.localParam.urlparam.filter);
					var field = '';
					if(id == 'projectctlPDProgramHaveDoneFilter'){
						field = 'haveDone';
					} else if(id == 'projectctlPDProgramSubjectFilter'){
						field = 'apUserSubjectName';
					} else if(id == 'projectctlPDProgramWorkpaperEditorFilter'){
						field = 'workpaperEditor';
					}
					var isMatch = false;
					for(var filter of filterParam){
						if(filter.field == field){
							filter.value = val;
							isMatch = true;
						}
						if(val != '' && val != '-1'){
							newFilterParam.push(filter);
						}
					}
					if(!isMatch){
						var filter = {};
						switch (id) {
							case 'projectctlPDProgramHaveDoneFilter':
								filter.value = val,
								filter.field = 'haveDone',
								filter.sqlIndex = 'ap.haveDone',
								filter.operate = 'eq';
								filter.type = 'number';
								break;
							case 'projectctlPDProgramSubjectFilter':
								filter.value = val,
								filter.field = 'apUserSubjectName',
								filter.sqlIndex = 'ap.apUserSubjectName';
								filter.operate = 'eq';
								filter.type = 'string';
								break;
							case 'projectctlPDProgramWorkpaperEditorFilter':
								filter.value = val,
								filter.field = 'workpaperEditor',
								filter.sqlIndex = 'ap.workpaperEditor';
								filter.operate = 'eq';
								filter.type = 'number';
								break;
							default:
								filter.operate = 'like';
						}
						if(val != '' && val != '-1'){
							newFilterParam.push(filter);
						}
					}
				}else{
					var filter = {};
					switch (id) {
						case 'projectctlPDProgramHaveDoneFilter':
							filter.value = val,
							filter.field = 'haveDone',
							filter.sqlIndex = 'ap.haveDone',
							filter.operate = 'eq';
							filter.type = 'number';
							break;
						case 'projectctlPDProgramSubjectFilter':
							filter.value = val,
							filter.field = 'apUserSubjectName',
							filter.sqlIndex = 'ap.apUserSubjectName';
							filter.operate = 'eq';
							filter.type = 'string';
							break;
						case 'projectctlPDProgramWorkpaperEditorFilter':
							filter.value = val,
							filter.field = 'workpaperEditor',
							filter.sqlIndex = 'ap.workpaperEditor';
							filter.operate = 'eq';
							filter.type = 'number';
							break;
						default:
							filter.operate = 'like';
					}
					if(val != '' && val != '-1'){
						newFilterParam.push(filter);
					}
				}
				page.projectctlPDProgramTableCfg.localParam.urlparam.filter = JSON.stringify(newFilterParam);
				page.projectctlPDProgramTable && page.projectctlPDProgramTable.DataTable().ajax.reload();
			},
			projectctlPDProgramPlanFilter(event) {
				let $el = $(event.currentTarget);
				let val = $el.val();
				let filter = {
					field: 'haveDone',
					sqlIndex: 'ap.' + 'haveDone',
					type: typeof Number,
					value: val,
					operate: 'eq'
				};
				let filterParam = [];
				if(val == '-1') { // all
					page.projectctlPDProgramPlanTableCfg.localParam.urlparam.filter = null;
				}else {
					filterParam.push(filter);
					page.projectctlPDProgramPlanTableCfg.localParam.urlparam.filter = JSON.stringify(filterParam);
				}
				page.projectctlPDProgramPlanTable && page.projectctlPDProgramPlanTable.DataTable().ajax.reload();
			},
			projectctlPDIdentifiedFilter(event) {
				// let isMapBaseSubjectFilterVal =
				// $('#projectctlPDIdentifiedIsMapBaseSubjectFilter').val();
				let isFinish = $('#projectctlPDIdentifiedIsFinishFilter').val();
				/*
				 * let isSetEcvapFilterVal =
				 * $('#projectctlPDIdentifiedIsSetEcvapFilter').val(); let
				 * isSetSubjectEditorFilterVal =
				 * $('#projectctlPDIdentifiedIsSetSubjectEditorFilter').val();
				 * let isCreatedProgramFilterVal =
				 * $('#projectctlPDIdentifiedIsCreatedProgramFilter').val();
				 */

				let param = {
					param5: isFinish,
					param6: null
				};
				/* 1. 全部 且 没有字段过滤: 不处理 */
				if (isFinish == -1) {
					param.param5 = null;
					param.param6 = null;
				}
				/* 2. 未完成 且 没有字段过滤 */
				if (isFinish == 0) {
					param.param5 = 1;
					param.param6 = null;
				}

				/* 4. 已完成 */
				if (isFinish == 1) {
					param.param5 = null;
					param.param6 = 1;
				}
				$.extend(page.projectctlPDIdentifiedTableCfg.localParam.urlparam, param);
				page.projectctlPDIdentifiedTable && page.projectctlPDIdentifiedTable.DataTable().ajax.reload();
			},
			projectctlPDNoteinfoFilter(event) {
				let $el = $(event.currentTarget);
				let val = $el.val();
				let filter = {
					field: 'haveDone',
					sqlIndex: 'a.' + 'haveDone',
					type: typeof Number,
					value: val,
					operate: 'eq'
				};
				let filterParam = [];
				if(val == '-1') { // all
					page.projectctlPDNoteinfoTableCfg.localParam.urlparam.filter = null;
				}else {
					filterParam.push(filter);
					page.projectctlPDNoteinfoTableCfg.localParam.urlparam.filter = JSON.stringify(filterParam);
				}
				page.projectctlPDNoteinfoTable && page.projectctlPDNoteinfoTable.DataTable().ajax.reload();
			}
		}
		/**
		 * 进度详细信息过滤
		 * 
		 * @param event
		 */
		, onClickProgressDetailedFilter(event) {
			let $el = $(event.currentTarget);
			let id = $el.attr('data-pdfilter-action');
			page.progressDetailedFilter[id] && page.progressDetailedFilter[id](event);
		}
		/**
		 * 清里未关联文件
		 * 
		 * @param event
		 */
		, onClickClearNotAssociatedFile(event) {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgFile.deleteNotAssociatedFile.json',
				// async : false,
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: page.dgProjectInfo.customerId,
					param2: page.dgProjectInfo.projectId
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data && data.data.length > 0) {
							let moveFiles = data.data[0].moveFiles;
							swal({
								title: '完成',
								html: '移除文件：\r\n' + moveFiles.join('\r\n'),
								type: 'success',
								allowOutsideClick: false,
								allowEscapeKey: false,
								timer: 5 * 1000
							}).catch(swal.noop);
						} else {
							bdoSuccessBox('完成', '清理成功');
						}
					}
				}
			});
		}
		/**
		 * 
		 */
		, refreshProjectInfo(event) {
			let me = this;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgProject.resetProjectInfo.json',
				// async : false,
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: page.dgProjectInfo.autoId,
					param2: page.dgProjectInfo.projectId,
					param3: page.dgProjectInfo.customerId
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						me.fetchProjectInfo();
						me.refreshStateTable();
						/*
						 * page.dgProjectInfo = data.data[0].projectInfo;
						 * page.projectInfoForm.jsonData = page.dgProjectInfo;
						 * page.projectDgSettingForm.jsonData =
						 * page.dgProjectInfo;
						 */
					}
				}
			});
		}
		/*
		 * ,cancelProjectArchive(){ let me = this; $.ajax({ type: 'post', url:
		 * 'dgCenter/ProjectArchive.saveProjectArchive.json', data: { param1:
		 * window.CUR_CUSTOMERID, param2: window.CUR_PROJECTID, param3: 0 }, dataType: 'json',
		 * success(data) { if (data.success) { bdoSuccessBox('成功', '取消归档成功！');
		 * me.cmp.projectArchive.show(); me.cmp.cancelProjectArchive.hide(); }
		 * else { bdoErrorBox('失败', data.resultInfo.statusText); } } }); }
		 */
		, projectArchive(){
			let me = this;
			$.ajax({
				type: 'post',
				url: 'dgCenter/ProjectArchive.saveProjectArchive.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 3
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$.ajax({
							type: 'post',
							url: 'dgCenter/ProjectArchive.archive.json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									bdoInfoBox('正在归档中。。请稍候。。');
									me.cmp.projectArchive.hide();
									// me.cmp.cancelProjectArchive.show();
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}
		, fetchPreProjectInfo() {
			$('#preProjectName').attr('data-check1', '');
			$('#preProjectName').attr('data-check2', '');
			$('#preProjectName').attr('title', '');
		}
		/**
		 * 获取项目信息
		 */
		, fetchProjectInfo() {
			let me = this;
			let dfd = $.Deferred();
			if(!window.CUR_PROJECTID || !window.CUR_CUSTOMERID || !(window.CUR_CUSTOMERID > '') || !(window.CUR_PROJECTID > '')) {
				dfd.resolve({});
				return dfd;
			}
			$.ajax({
				type: 'post',
				url : 'dgCenter/DgProject.getProjectInfo.json',
				// url: 'dgCenter/DgGeneral.query.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					sqlId: 'DG00061',
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						page.fetchPreProjectInfo();
						if (data != null && data != undefined && data.data[0] != null && data.data[0] != undefined) {
							me.dgProjectInfo = data.data[0];
							me.dgProjectInfo.finalResultsLabel = '';
							me.projectInfoForm.jsonData = me.dgProjectInfo;
							me.projectDgSettingForm.jsonData = me.dgProjectInfo;
							me.preProjectDgSettingForm.jsonData = me.dgProjectInfo;
							if (me.dgProjectInfo.endMonth) {
								$('#endMonth').val(me.dgProjectInfo.endMonth);
							} else {
								if (me.dgProjectInfo.auditTimeEnd) {
									$('#endMonth').val(me.dgProjectInfo.auditTimeEnd.split('-')[1]);
								}
							}
							projectInfo = me.dgProjectInfo;
							projectYear = new Date(projectInfo.auditTimeBegin).getFullYear(); // 已保存的套账年
							trialBalanceState = projectInfo.trialBalanceState;
							projectReportTemplate = projectInfo.tbReportTemplate; // 已保存的报表模板
							projectEndMonth = projectInfo.endMonth; // 已保存的结束月份

							/*
							 * window.CUR_PROJECT_ACC_YEAR = projectInfo.year; //
							 * 刷新全局变量：套账年度 CUR_PROJECTNAME =
							 * projectInfo.projectName; BDO_PROJECTNAME_SELECT =
							 * projectInfo.projectName;
							 */

							reLoadLoginData();
							window.CUR_DGPROJECT_AUTOID = projectInfo.autoId;
							window.CUR_CUSTOMERID = projectInfo.customerId;
							window.BDO_CUSTOMER_SELECT = window.CUR_CUSTOMERID;
							// window.CUR_CUSTOMERNAME =
							// projectInfo.customerName;
							window.BDO_CUSTOMERNAME_SELECT = projectInfo.customerName;
							window.CUR_PROJECTID = projectInfo.projectId ;
							window.CUR_PROJECTNAME = projectInfo.projectName;

							window.CUR_PROJECT_START_YEAR = new Date(projectInfo.auditTimeBegin).format('yyyy');
							window.CUR_PROJECT_END_YEAR = new Date(projectInfo.auditTimeEnd).format('yyyy');
							window.CUR_PROJECT_START_MONTH = new Date(projectInfo.auditTimeBegin).format('MM');

							window.CUR_PROJECT_END_MONTH = projectInfo.endMonth;
							window.BDO_PROJECTNAME_SELECT = projectInfo.projectName;
							window.CUR_PROJECT_ACC_YEAR = projectInfo.year;
							// me.projectInfoForm.jsonData.auditTimeBegin =

							$('#navProjectName').text('项目：' + (window.BDO_CUSTOMER_SELECT && window.BDO_PROJECTNAME_SELECT != 'null' ? window.BDO_PROJECTNAME_SELECT : ''));
							if ('1' === me.dgProjectInfo.mergeType){
								$('#mergeType').prop('checked',true);
								$('#mergeProjectRow').removeClass('hidden');
								$('#btnOpenParentProjectModal').removeClass('hidden');
								$('#btnOpenChildProjectModal').removeClass('hidden'); // 合并项目时显示“子项目...”按钮
								$('#projectIdMergeText').attr('title', data.data[0].projectIdMergeText);
								$('#projectIdMergeText').attr('data-value', data.data[0].projectIdMerge);
							}else {
								$('#projectIdMergeText').parents('tr').hide();
/*
 * $('#openParentProjectModal').removeClass('hidden');
 */
							}
							if (isManager){
								projectInfo.projectStartDate && $('#projectStartDate').datepicker("setDate", new Date(projectInfo.projectStartDate));
								projectInfo.projectEndDate && $('#projectEndDate').datepicker("setDate", new Date(projectInfo.projectEndDate));
							}else{
								projectInfo.projectStartDate && $('#projectStartDate').val(projectInfo.projectStartDate);
								projectInfo.projectEndDate && $('#projectEndDate').val(projectInfo.projectEndDate);
							}
							if (me.dgProjectInfo.projectType == '3') {
								// $('[name=\'projectType\'][data-result=2]').click();
								$("[name='projectType'][data-result='3']").attr("checked","checked");
								$("[name='projectType'][data-result='2']").removeAttr("checked");
								$("[name='projectType'][data-result='1']").removeAttr("checked");
							}else if (me.dgProjectInfo.projectType == '2') {
								// $('[name=\'projectType\'][data-result=2]').click();
								$("[name='projectType'][data-result='3']").removeAttr("checked");
								$("[name='projectType'][data-result='2']").attr("checked","checked");
								$("[name='projectType'][data-result='1']").removeAttr("checked");
							}else{
								// $('[name=\'projectType\'][data-result=1]').click();
								$("[name='projectType'][data-result='1']").attr("checked","checked");
								$("[name='projectType'][data-result='2']").removeAttr("checked");
								$("[name='projectType'][data-result='3']").removeAttr("checked");
							}
							
							// 切换项目更新是否合并项目标识
							$.sessionStorage('mergeType', projectInfo.mergeType);
							dfd.resolve();
						}
					}
				}
			});
			return dfd;
		}
		/**
		 * 刷新底稿完成状态表达
		 */
		, refreshStateTable() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				data: {
					sqlId: 'DG00243',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						// 重置完成后才刷新
						if (data.data[0] && data.data[0].isResetNow != '1' && data.data[0].isResetNow != '2'){
							$('#dgFinishedTable').DataTable().ajax.reload();
						}
					}
				}
			});
		}
		/**
		 * 选择项目
		 */
		, selectProject() {
			CustomerProjectSetPage({
				projectSelected() {
					ProjectctrPage();
				},
				selectting: true
			});
		}
		/**
		 * 项目克隆
		 */
		, cloneProject() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				data: {
					sqlId: 'DG00243',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0]){
							if (data.data[0].isResetNow == '1'){
								bdoInfoBox('正在重置中...请稍后！');
							} else if(data.data[0].isResetNow == '2') {
								bdoInfoBox('正在克隆中...请稍后！');
							} else {
								// 客户下拉框初始化
								initSelectableCustomers();
								$('#cloneProjectModal').modal('show');
								$("input[name='c_checked']").each(function () {
									this.checked = true;
								});
							}
						}
					}
				}
			});


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
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				data: {
					sqlId: 'DG00243',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0]){
							if (data.data[0].isResetNow == '1'){
								bdoInfoBox('提示', '正在重置中...请稍后！');
							} else if(data.data[0].isResetNow == '2') {
								bdoInfoBox('提示', '正在克隆中...请稍后！');
							} else {
								page.resetDgSider.show();
								var table = $('#dgFinishedTable').dataTable();
								var rowDatas = table.fnGetData();
								page.resetDgForm.jsonData.autoId = rowDatas[0].autoId;
								page.resetDgForm.jsonData.projectId = window.CUR_PROJECTID;
								page.resetDgForm.jsonData.customerId = window.CUR_CUSTOMERID;
								page.resetDgForm.updateFlg++;
								rowDatas.forEach((o, i) => {
									if (!(o.State != null && o.State > 0)) {
										if (page.resetDgForm.labelClass['r_' + o.prefix]) {
											page.resetDgForm.labelClass['r_' + o.prefix][1] = 'css-input-disabled';
											page.resetDgForm.jsonData['r_' + o.prefix] = false;
										}
									}
								});
							}
						}
					}
				}
			});
		}
		, showDgworkpagerBackup(event) {
			this.dgBackupFileSider.show();
		}
		,exportZip(event) {
			if (projectInfo.manager != sys_userId) {
				bdoInfoBox('提示', '非项目负责人无权限压缩底稿生成zip文件！');
				return;
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgProject.checkData.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgProject.backupDgFile.json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
								}
							}
						})
					}else{
						bdoConfirmBox('提示', '底稿超过500M，将仅压缩底稿，不压缩附件及其他文件', function() {
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgProject.backupDgFile.json',
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param5: 1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
									}
								}
							})
						})
					}
				}
			})
		}
		, saveSettingInfo(event) {
			if (projectInfo.manager != sys_userId) {
				return;
			}
			if (!page.projectDgSettingForm.$form.valid()) {
				return;
			}
			var isAllDeleteNote = 0;
			let doIt = (isResetDg) => {
				bdoInProcessingBox('保存中');
				let param = {};
				let jsonData = page.projectDgSettingForm.jsonData;
				$.each(jsonData, (key, o) => {
					param[key] = o;
				});
				param['projectIdMerge'] = $('#projectIdMergeText').attr('data-value');
				param['projectIdMergeText'] = $('#projectIdMergeText').val();
				param['endMonth'] = $('#endMonth').val();
				param['projectType'] = $('[name=\'projectType\']:checked').attr('data-result');
				// 保存tb模板名称
				param['tbTemplateName'] = $('#tbTemplate').val();
				param['tbTemplate'] = $('#tbTemplate').attr('datavalue');
				param['projectStartDate'] = $('#projectStartDate').val();
				param['projectEndDate'] = $('#projectEndDate').val();
				// param['auditPolicyFileId'] = $('#auditPolicyFileId').val();
				if ("1054" == departIdrSession) {
					param['mergeType'] = $('#mergeType').prop('checked');
				}else {
					param['mergeType'] = projectInfo.mergeType === "1";
				}

				if (true === param['mergeType']){
					$('#mergeProjectRow').removeClass('hidden');
					$('#btnOpenParentProjectModal').removeClass('hidden');
					$('#btnOpenChildProjectModal').removeClass('hidden'); // 合并项目时显示“子项目...”按钮
				}else {
					$('#projectIdMergeText').parents('tr').hide();
				}
				if (param['projectStartDate'] && param['projectEndDate'] && param['projectStartDate'] > param['projectEndDate']){
					bdoInfoBox('提示', '项目开始日不能大于项目结束日！', 1500);
					return;
				}
				if(!param['tbTemplate'] || param['tbTemplate'] == '') {
					bdoErrorBox('错误', 'TB模板未设置！');
				}
				param['isResetNow'] = 0;
				param['isAllDeleteNote'] = isAllDeleteNote;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgProject.saveProjectInfo.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						jsonData: JSON.stringify(param)
					},
					async : false,
					dataType: 'json',
					success(data) {
						$('#page-loader').hide();
						if (data.success) {
							!isResetDg && bdoSuccessBox('成功');
							$('#m40000049').click();
							if(data.data && data.data[0] && data.data[0].hasOwnProperty('changeYear')){
								// 注释代码
								resetTb(data.data[0].changeYear,param['autoId'])
							}
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			};
			let curMergeType = $('#mergeType').prop('checked');
			// 合并项目不能选择单体报表模板、单体项目不能选择合并报表模板
			// 单体、合并
			var reportTplStr = $('#tbReportTemplate').attr('data-typename');
			// 单体项目
			if(curMergeType == false && reportTplStr == '合并'){
				bdoInfoBox('提示', '单体项目不能选择合并报表模板！', 2500);
				return;
			}
			// 合并项目
			if(curMergeType == true && reportTplStr == '单体'){
				bdoInfoBox('提示', '合并项目不能选择单体报表模板！', 2500);
				return;
			}
			let dbMergeType = $.sessionStorage('mergeType')==="0";
			if (curMergeType === dbMergeType) {
				let text = `
				<div style="height: 200px;overflow-y: auto">
				<p>
				单体项目底稿节点与合并项目节点存在差异，确定要切换么？
				</p>
				<table class="table table-bordered table-striped table-hover dataTable no-footer">
				<thead>
				<th>底稿树</th>
				<th>合并</th>
				<th>单体</th>
				</thead>
				<tbody>
				<tr>
				<td style="font-size: 18px">范围界定\\重要性水平设置</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">范围界定\\试算平衡表</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">范围界定\\合并试算平衡表</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size:18px ;background-color: red">×</td>
				</tr>
				<tr>
				<td style="font-size: 18px">范围界定\\合并现金流量表</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size:18px ;background-color: red">×</td>
				</tr>
				<tr>
				<td style="font-size: 18px">范围界定\\未审报表</td>
				<td style="font-size: 18px; background-color: red">×</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">识别风险合评估\\初步分析行复核</td>
				<td style="font-size: 18px; background-color: red">×</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">识别风险合评估\\计划控制表</td>
				<td style="font-size: 18px; background-color: red">×</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">识别风险合评估\\合并计划控制表</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size: 18px; background-color: red">×</td>
				</tr>
				<tr>
				<td style="font-size: 18px">设计审计应对措施</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">获取审计依据\\银行</td>
				<td style="font-size: 18px; background-color: red">×</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">获取审计依据\\往来客户</td>
				<td style="font-size: 18px; background-color: red">×</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">获取审计依据\\抽凭</td>
				<td style="font-size: 18px; background-color: red">×</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">形成意见\\附注</td>
				<td style="font-size:18px ;background-color: red">×</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">形成意见\\最终分析性复核</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">形成意见\\错报汇总表</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">形成意见\\现金流量表</td>
				<td style="font-size:18px ;background-color: red">×</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">形成意见\\审定报表</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size: 18px">√</td>
				</tr>
				<tr>
				<td style="font-size: 18px">形成意见\\合并审定报表</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size:18px ;background-color: red">×</td>
				</tr>
				<tr>
				<td style="font-size: 18px">形成意见\\合并附注</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size:18px ;background-color: red">×</td>
				</tr>
				<tr>
				<td style="font-size: 18px">报备</td>
				<td style="font-size: 18px">√</td>
				<td style="font-size: 18px">√</td>
				</tr>
	
				</tbody>
				</table>
				</div>
				`;
				bdoConfirmBox('提示', text, function() {
					setTimeout(()=>{
						$('#page-loader').show();
						setTimeout(()=>{
							setTimeout(()=>doIt());
						}, 10); // 防止旋转图标卡主出不来
					}, 10); // 防止消息框卡主
				});
				return;
			}
			if (!$('#mergeType').prop('checked') && projectYear != $('#year').val() && trialBalanceState > 0) {
				bdoConfirmBox('提示', '试算平衡表中科目对照已完成，修改财务套账必须重新设置科目对照，您确定继续保存吗？', function() {
					setTimeout(()=>{
						$('#page-loader').show();
						setTimeout(()=>{
							setTimeout(()=>doIt(true));
						}, 10); // 防止旋转图标卡主出不来
					}, 10); // 防止消息框卡主
				});
			} else {
				if (!$('#mergeType').prop('checked')){
					var displaytext = '';
					if(projectReportTemplate && projectReportTemplate != $('#tbReportTemplate').attr('datavalue')){
						if(projectEndMonth != $('#endMonth').val()){
							displaytext = '此次保存更改了报表模板、账套结束月份，将<br><font style="font-weight: bold; color: red;font-size: 20px;">重新对照科目<br>重新生成试算平衡表<br>重新生成未审报表<br>更新附注<br>重置审定报表--现金流量表、所有者权益变动表</font><br>您确定继续保存吗？';
						}else{
							displaytext = '此次保存更改了报表模板，将<br><font style="font-weight: bold; color: red;font-size: 20px;">重新对照科目<br>重新生成试算平衡表<br>重新生成未审报表<br>更新附注<br>重置审定报表--现金流量表、所有者权益变动表</font><br>您确定继续保存吗？';
						}
					}else{
						if(projectEndMonth != $('#endMonth').val()){
							displaytext = '此次保存更改了账套结束月份，将<br><font style="font-weight: bold; color: red;font-size: 20px;">重新对照科目<br>重新生成试算平衡表<br>重新生成未审报表</font><br>您确定继续保存吗？';
						}
					}
					if(displaytext != ''){
						if(projectReportTemplate && projectReportTemplate != $('#tbReportTemplate').attr('datavalue')){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgProject.checkReportTpl.json',
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: projectReportTemplate,
									param4: $('#tbReportTemplate').attr('datavalue')
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										isAllDeleteNote = data.data[0].isAllDeleteNote;
										if(data.resultInfo.statusText != null && data.resultInfo.statusText != ''){
											bdoConfirmBox('提示', data.resultInfo.statusText, function() {
												bdoConfirmBox('提示', displaytext, function() {
													setTimeout(()=>{
														$('#page-loader').show();
														setTimeout(()=>{
															setTimeout(()=>doIt());
														}, 10); // 防止旋转图标卡主出不来
													}, 10); // 防止消息框卡主
												});
											});
										}else{
											bdoConfirmBox('提示', displaytext, function() {
												setTimeout(()=>{
													$('#page-loader').show();
													setTimeout(()=>{
														setTimeout(()=>doIt());
													}, 10); // 防止旋转图标卡主出不来
												}, 10); // 防止消息框卡主
											});
										}
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}else{
							bdoConfirmBox('提示', displaytext, function() {
								setTimeout(()=>{
									$('#page-loader').show();
									setTimeout(()=>{
										setTimeout(()=>doIt());
									}, 10); // 防止旋转图标卡主出不来
								}, 10); // 防止消息框卡主
							});
						}
					}else {
						setTimeout(() => {
							$('#page-loader').show();
							setTimeout(() => {
								setTimeout(() => doIt());
							}, 10); // 防止旋转图标卡主出不来
						}, 10); // 防止消息框卡主
					}
				} else {
					setTimeout(() => {
						$('#page-loader').show();
						setTimeout(() => {
							setTimeout(() => doIt());
						}, 10); // 防止旋转图标卡主出不来
					}, 10); // 防止消息框卡主
				}
			}
		}
		, saveAuditUserInfo(event) {
			var isResetNow;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					sqlId: 'DG00243',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0]){
							isResetNow = data.data[0].isResetNow;
						}
					}
				}
			});
			if (isResetNow == '1'){
				bdoInfoBox('提示', '正在重置中...请稍后！');
				return;
			} else if(isResetNow == '2') {
				bdoInfoBox('提示', '正在克隆中...请稍后！');
				return;
			}
			if (projectInfo.manager != sys_userId) {
				return;
			}
			let table = $('#dgFinishedTable').dataTable();
			let rowNum = $(event.currentTarget).attr('data-row');
			let rowData = table.fnGetData(rowNum);
			let param = {
				autoId: page.dgProjectInfo.autoId,
				customerId: page.dgProjectInfo.customerId,
				projectId: page.dgProjectInfo.projectId
			};
			let inputs = $('[name$="AuditUser"]');
			let array = {};
			let arraySortBy = {};
			let str = '';
			$.each(inputs, (i, o) => {
				let key = o.id;
				let $el = $(o);
				param[key] =  $el .val();
				let prefix = rowData[i].prefix;

				if ( $el.val() && $el.val() != '' && $el.attr('data-result') != $el.val()){
					array[prefix] = $el.find('option:selected').text();
					// array[prefix] = $el .text();
				} else if($el.attr('data-result') != $el.val()) {
					array[prefix] = '-';
				} else {
					array[prefix] = null;
				}
			});

			$.each(rowData, (i, o) => {
				if(array[o.prefix]) {
					arraySortBy[o.prefix] = array[o.prefix];
					str += '设置【' + flowName[o.prefix] + '】审核人为:【' + array[o.prefix]+ '】<br/>';
				}/*
					 * else { arraySortBy[o.prefix] = ''; }
					 */
			});
			param['endMonth'] = $('#endMonth').val();
			if(str == '') {
				bdoErrorBox('错误', '没有变更内容');
				return;
			}
			// saveAuditUser
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgProject.saveAuditUser.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					jsonData: JSON.stringify(param),
					param2: str// JSON.stringify(arraySortBy)
				},
				// async : true,
				dataType: 'json'
			}).done((data) => {
				if (data.success) {
					$('#dgFinishedTable').DataTable().ajax.reload();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
		, saveDgProject(data, callback, showOkMsg=true) {
			var me = this;
			data['isResetNow'] = 0;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgProject.saveProjectInfo.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					jsonData: JSON.stringify(data)
				},
				// async : false,
				dataType: 'json',
				success(data) {
					if (data.success) {
						callback(data);
						showOkMsg && bdoSuccessBox('成功');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}
		, onDownloadCurrentDg(event) {
			$('#modal_dgDownloadTree').modal('show');
			if ($('#subject_dgDownloadTree').hasClass('treeview')) {
				return;
			}
			$('#subject_dgDownloadTree').tree({
				url : 'cpBase/TreeCommon.getDgDownloadTree.json',
				params : {
					searchInputId : 'searchInput_dgDownloadTree'
				},
				singleSelect : false,
				lazyLoad : false,
				onceLoad : true,
				view : {
					leafIcon : 'fa fa-building text-flat',
					nodeIcon : 'fa fa-bank text-primary-light',
					folderSelectable : false,
					multiSelect : true,
					showCheckbox : true,
					selectedColor : '',
					selectedBackColor : ''

				}
			});
		}
		, onSyncProjectFile2EdocBtn(event) {
			page.$http('dgCenter/DgEdoc.syncProjectFile.json', {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID
			}).then(data => {
				OneUI.notifySuccess('正在同步文件，请稍后查看。');
			}, data => {
				OneUI.notifyError(data.resultInfo.statusText);
			}).catch(() => {
				OneUI.notifyError(data.resultInfo.statusText);
			});
		}
		, projectInfoForm: null
		, projectInfoFormCfg: {
			options: {
				propsData: {
					jsonData: {
						autoId: null,
						customerId: '',
						customerName: '',
						projectId: '',
						projectName: '',
						managerId: '',
						manager: '',
						signUser: '',
						audit1: '',
						auditTimeBegin: '',
						auditTimeEnd: '',
						finalResults: '',
						projectUserablePlate: '',
						finalResultsLabel: '',
						financeReportTypeStr: '',
						__umanagerName: '',
						__usignAccountant2: '',
						__usignAccountant3: '',
						__uaudit1Name: '',
						__uaudit2Name: '',
						__ureaReviewer: '',
						__usignUserName: '',
						__ureviewPartner: '',
						__uissuedPeople: '',
						members: '',
						internMembers: ''
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 8,
			id: 'projectInfoForm',
			data() {
				return {};
			},
			methods: {},
			mounted() {
			},
			watch: {
				'jsonData.finalResults': function(newVal) {
					this.jsonData.finalResultsLabel = DicVal2Nm(newVal, '项目性质');
				},
				'jsonData.finalResultsLabel': function(newVal) {
					if (newVal == '' || !newVal) {
						this.$nextTick(() => (this.jsonData.finalResultsLabel = DicVal2Nm(this.jsonData.finalResults, '项目性质')));
					}
				}
			},
			items: [{
				id: 'customerName',
				type: 'input',
				label: '客户',
				rowspan: 1,
				colspan: 8,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'projectName',
				type: 'textarea',
				label: '项目',
				rowspan: 1,
				colspan: 8,
				typeAttr: {
					rows: 1,
					readonly: true
				}
			}, {
				id: 'auditTime',
				html: (() => {
					return '<div class="form-material input-group">'
						+ '	<input class="form-control" type="text" id="auditTimeBegin" size="10" disabled="" v-model="jsonData.auditTimeBegin">'
						+ '	<span class="input-group-addon">-</span>'
						+ '	<input class="form-control" type="text" id="auditTimeEnd" size="10" disabled="" v-model="jsonData.auditTimeEnd">'
						+ '	<label for="auditTimeBegin">审计期间</label>'
						+ '</div>';
				})(),
				rowspan: 1,
				colspan: 4
			}, {
				id: 'projectUserablePlate',
				type: 'input',
				label: '适用板块',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			},{
				id: 'financeReportTypeStr',
				type: 'input',
				label: '财务报表类型',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'finalResultsLabel',
				type: 'input',
				label: '项目类型',
				rowspan: 1,
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: '__umanagerName',
				type: 'input',
				label: '项目负责人',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: '__usignAccountant2Name',
				type: 'input',
				label: '签字注册会计师2',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: '__usignAccountant3Name',
				type: 'input',
				label: '签字注册会计师3',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'projectIndustry',
				type: 'input',
				label: '行业分类',
				rowspan: 1,
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: '__uaudit1Name',
				type: 'input',
				label: '一审经理',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: '__uaudit2Name',
				type: 'input',
				label: '二审负责人',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: '__ureaReviewerName',
				type: 'input',
				label: '外派复核人',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: '__usignUserName',
				type: 'input',
				rowspan: 1,
				label: '签字合伙人',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: '__ureviewPartnerName',
				type: 'input',
				label: '复核合伙人',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: '__uissuedPeopleName',
				type: 'input',
				label: '签发人',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'isNeedReport',
				type: 'input',
				label: '报告性质',
				colspan: 2,
				typeAttr: {
					readonly: true
				}
			}, {
				id: 'members',
				type: 'textarea',
				label: '组员',
				rowspan: 1,
				colspan: 8,
				typeAttr: {
					rows: 3,
					readonly: true
				}
			}, {
				id: 'internMembers',
				type: 'textarea',
				label: '实习生',
				rowspan: 1,
				colspan: 8,
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
			watch: {
				'jsonData.tbTemplate': function(newVal, oldVal) {
					if (!$('#preProjectName').attr('data-check1')) {
						$('#preProjectName').attr('data-check1', '1');
						$('#preProjectDgSettingForm').find(':checkbox').closest('tr').css('height', '30px');
						return;
					}
					$('#quoteTb').prop('checked', false);
					page.projectDgSettingForm.jsonData.quoteTb = 0;
				},
				'jsonData.tbReportTemplate': function(newVal, oldVal) {
					let dataCheck = $('#preProjectName').attr('data-check2');
					if (dataCheck != '2') {
						$('#preProjectName').attr('data-check2', dataCheck ? '2' : '1');
						return;
					}
					$('#quoteReport').prop('checked', false);
					page.projectDgSettingForm.jsonData.quoteReport = 0;
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
				id: 'year',
				type: 'input',
				label: '财务账套',
				rowspan: 1,
				colspan: 2,
				typeAttr: {
					readonly: true,
					disabled: true
				},
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'tbTemplate',
				type: 'treecombo',
				label: 'TB模板',
				rowspan: 1,
				colspan: 5,
				validate: {
					rules: {
						required: true
					}
				},
				plugin: {
					name: 'treecombo',
					options: {
						url: './cpBase/TreeCommon.findgTbRuleaccTree.json',
						params: {},
						view: {
							leafIcon: 'fa fa-file text-primary',
							nodeIcon: 'fa fa-folder text-primary',
							folderSelectable: false,
							multiSelect: false,
							positionValue: 'absolute'
						}
					}
				}
			}, {
				id: 'tbReportTemplate',
				type: 'treecombo',
				label: '报表模板',
				rowspan: 1,
				colspan: 5,
				validate: {
					rules: {
						required: true
					}
				},
				plugin: {
					name: 'treecombo',
					options: {
						url: './cpBase/TreeCommon.findRuleaccTypeTree.json',
						params: {},
						view: {
							leafIcon: 'fa fa-file text-primary',
							nodeIcon: 'fa fa-folder text-primary',
							folderSelectable: false,
							multiSelect: false,
							positionValue: 'absolute'
						}
					}
				}
			}, {
				id: 'preProjectName',
				type: 'combo',
				label: '前推项目',
				rowspan: 1,
				colspan: 6,
				validate: {
					rules: {
						required: false
					}
				},
				typeAttr: {
					multiple: false
				},
				plugin: {
					name: 'combo',
					options: {
						noneSelectedText: '请选择',
						width: '100%',
						size: 3
					},
					stores: preProjectData
				}
			},{
				colspan: 2,
			}, {
				id: 'projectDateFromTo', // 占位用
				type: 'input',
				label: '',
				rowspan: 1,
				colspan: 3
			}, {
				id: 'auditPolicyFileId',
				type: 'combo',
				label: '总体审计策略',
				rowspan: 1,
				colspan: 5,
				plugin: {
					name: 'combo',
					options: {
						noneSelectedText: '请选择',
						size: 5
					},
					stores: auditPolicyFileData
				}
			}, {
				id: 'placeholder1',
				html: (() => {
					return '<div class="form-material" style="height: 72px;">'
						+ '</div>';
				})(),
				rowspan: 1
			}]
		}
		, preProjectDgSettingForm: null
		, preProjectDgSettingFormCfg: {
			options: {
				propsData: {
					jsonData: {}
				}
			},
			watch: {
				'jsonData.preCustomerId': function(newVal, oldVal) {
					if (!newVal || newVal == '') {
						this.formItem.preProjectId.plugin.stores = [];
						// this.jsonData.preProjectId = '';
						return;
					}
					// 客户选择
					let projects = getComboDBOption('cpBase/Combo.findCustomerProject.json', true, newVal);
					this.formItem.preProjectId.plugin.stores = projects;
					if ($('#preProjectName').attr('title')) this.jsonData.preProjectId = '';
				},
				'jsonData.preProjectId': function(newVal, oldVal) {
					let me = this;
					let setValue = function(newVal1) {
						me.jsonData.quoteTb = newVal1;
						me.jsonData.quoteReport = newVal1;
						me.jsonData.quoteProgram = newVal1;
						me.jsonData.quoteIdentified = newVal1;
					};
					// 项目选择
					setTimeout(function() {
						$('#preProjectId').selectpicker('val', newVal);
					}, 100);
					if (!newVal || newVal == ' ') {
						setTimeout(function() {
							$('#preProjectName').val('');
							me.jsonData.preProjectName = '';
							$('#preProjectName').attr('title', '请选择');
							$('#preProjectDgSettingForm').find(':checkbox').prop('checked', false);
							$('#preProjectDgSettingForm').find(':checkbox').prop('disabled', true);
							setValue(0);
						}, 100);
					} else {
						if (!$('#preProjectName').attr('title') && $('#preProjectName').attr('datavalue')) {
							$('#preProjectName').attr('title', '前推项目');
							// return;
						}
						let projectId = String(newVal).split('-')[0].substring(0, 10);
						// 查询名称
						$.ajax({
							type: 'post',
							url: 'dgCenter/CustomerProjectSet.getProjectName.json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: projectId
							},
							dataType: 'json',
							success: function(data) {
								if (data.success) {
									var data = data.data[0];
									var preProjectName = data['projectName'];
									if (!/[0-9]{10}-/g.test(preProjectName)) {
										preProjectName = data['projectId'] + '-' + preProjectName;
									}
									$('#preProjectName').val(preProjectName);
									me.jsonData.preProjectName = preProjectName;
									if (data['autoId']) {
										// TODO 将模板放入页面中，确定之后取值
										$('#quoteTb').attr('data-value', data.tbTemplate);
										$('#quoteReport').attr('data-value', data.tbReportTemplate);
										if ($('#preProjectName').attr('title') != '前推项目') {
											$('#preProjectDgSettingForm').find(':checkbox').prop('checked', true);
											$('#preProjectDgSettingForm').find(':checkbox').prop('disabled', false);
											setValue(1);
										}
										$('#preProjectName').attr('title', '该项目已创建');
									} else {
										if ($('#preProjectName').attr('title') != '前推项目') {
											$('#preProjectDgSettingForm').find(':checkbox').prop('checked', false);
											$('#preProjectDgSettingForm').find(':checkbox').prop('disabled', true);
											setValue(0);
										}
										$('#preProjectName').attr('title', '该项目未在底稿中心创建');
									}
								}
							}
						});
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 6,
			id: 'preProjectDgSettingForm',
			data() {
				return {};
			},
			methods: {},
			items: [{
				id: 'preCustomerId',
				type: 'combo',
				label: '前推项目客户名称',
				rowspan: 1,
				colspan: 6,
				validate: {
					rules: {
						required: false
					}
				},
				typeAttr: {
					multiple: false
				},
				plugin: {
					name: 'combo',
					options: {
						noneSelectedText: '请选择',
						width: '100%',
						liveSearch: true,
						size: 7
					},
					stores: customersData
				}
			}, {
				id: 'preProjectId',
				type: 'combo',
				label: '前推项目',
				rowspan: 1,
				colspan: 6,
				validate: {
					rules: {
						required: false
					}
				},
				typeAttr: {
					multiple: false
				},
				plugin: {
					name: 'combo',
					options: {
						noneSelectedText: '请选择',
						width: '100%',
						liveSearch: true,
						size: 7
					},
					stores: []
				}
			}, {
				id: 'quoteReport',
				type: 'checkbox',
				label: '报表模板',
				rowspan: 1,
				colspan: 6,
				validate: {
					rules: {
						required: false
					}
				},
				typeAttr: {
					multiple: false
				},
				plugin: {
					options: {
						width: '100%',
						height: '62px'
					}
				}
			}, {
				id: 'quoteTb',
				type: 'checkbox',
				label: 'TB模板',
				rowspan: 1,
				colspan: 6
			}, {
				id: 'quoteIdentified',
				type: 'checkbox',
				label: '科目认定分值',
				rowspan: 1,
				colspan: 6
			}, {
				id: 'quoteProgram',
				type: 'checkbox',
				label: '审计程序',
				rowspan: 1,
				colspan: 6
			}]
		}
		, dgFinishedTable: null
		, dgFinishedTableCfg: {
			localParam: {
				url: 'cpBase/General.queryProjectCtrlProgress.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00040',
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID
				},
				tabNum: true
			},
			tableParam: {
				select: false,
				lengthChange: false,
				ordering: false,
				// order : [],
				serverSide: true,
				dom: '<"row"<"col-sm-12"tr>>',
				scrollY: false,
				bdoCustomizeColumns: true,
				createdRow(row, data, dataIndex) {
					if((data.isNeedReport == '不出报告') && (data.prefix != 'materiality' && data.prefix != 'trialBalance' && data.prefix != 'unaudited' && data.prefix != 'clearQuestion' && data.prefix != 'audited')){
						$(row).css({"background-color":'#D8D8D8'});
					}
				},
				drawCallback(settings) {
					let datas = this.fnGetData();
					let val = 0;
					let wsum = 0;
					datas.forEach((o, i) => {
						// 不出报告或者为空时 进度只计算这几个节点 重要性水平 试算平衡表 未审报表 批注 审定报表
						if((o.isNeedReport == '不出报告') && (o.prefix != 'materiality' && o.prefix != 'trialBalance' && o.prefix != 'unaudited' && o.prefix != 'clearQuestion' && o.prefix != 'audited')){
							return true;
						}
						let w = 0;
						let v = 0;
						/*
						 * if ($.isNumeric(o.Weight) && $.isNumeric(o.State)) {
						 * v = o.Weight * o.State; wsum += o.Weight; } else { v =
						 * 0; wsum += 1; } val += parseFloat(v);
						 */
						if ($.isNumeric(o.State)) {
							v = 10 * (parseFloat(o.State));
							wsum += 10;
						} else {
							v = 0;
							wsum += 10;
						}
						val += parseFloat(v);
					});
					val = (val / (wsum == 0 ? 1 : wsum)).toFixed(2);

					$('#dgPieChart').data('easyPieChart').update(val);
					$('span', $('#dgPieChart')).text(val + '%');

					let map = {};
					function ppRoleMap(user) {
						if (typeof user == 'object' && user.userId && user.userId != '') {
							map[user.userId] = user;
						}
					}
					ppRoleMap(projectInfo.__umanager);
					ppRoleMap(projectInfo.__uaudit1);
					ppRoleMap(projectInfo.__usignUser);
					/*
					 * if (typeof projectInfo.__umanager == 'object' &&
					 * projectInfo.__umanager.userId &&
					 * projectInfo.__umanager.userId != '') {
					 * map[projectInfo.__umanager.userId] =
					 * projectInfo.__umanager; } if (typeof
					 * projectInfo.__uaudit1 == 'object' &&
					 * projectInfo.__uaudit1.userId &&
					 * projectInfo.__uaudit1.userId != '') {
					 * map[projectInfo.__uaudit1.userId] =
					 * projectInfo.__uaudit1; } if (typeof
					 * projectInfo.__usignUser == 'object' &&
					 * projectInfo.__usignUser.userId &&
					 * projectInfo.__usignUser.userId != '') {
					 * map[projectInfo.__usignUser.userId] =
					 * projectInfo.__usignUser; }
					 */
					let stores = [];
					for (let m in map) {
						stores.push({
							label: map[m].userName,
							value: map[m].userId
						});
					}
					const pluginObject = {
						name: 'combo',
						options: {
							noneSelectedText: '请选择',
							multipleSeparator: ',',
							width: '100%',
							existBlank: true
						},
						stores: stores
					};
					$('[name$=AuditUser]').each((i, o) => {
						let $el = $(o);
						let val = $el.attr('data-result');
						var stores = (typeof pluginObject.stores == 'function' ? pluginObject.stores() : pluginObject.stores);
						$el.empty();
						if (pluginObject.options.existBlank) {
							$el.append('<option></option>');
						}
						let hasVal = false;
						$.each(stores, (index, object) => {
							$el.append('<option value="' + object.value + '">' + object.label + '</option>');
							if(!hasVal && object.value == val){
								hasVal = true;
							}
						});
						if(!hasVal && val && val != '') {
							$el.append('<option value="' + val + '">' + $el.attr('data-label') + '</option>');
						}
						$el.addClass('selectpicker');
						$el.selectpicker(pluginObject.options);
						$el.selectpicker('val', val);
						$el.selectpicker('refresh');
					});
				},
				columnDefs: [
					{
						targets: ++cnt,
						// orderable : true,
						title: '状态',
						name: 'AuditState',
						data: 'AuditState',
						width: '50px',
						className: 'text-center',
						render(data, type, row, meta) {

							if (row.State == 100) {
								return '<span class="label label-success"><i class="fa fa-check"></i> Completed</span>';
							} else if (row.State > 0) {
								return '<span class="label label-warning"><i class="fa fa-refresh fa-spin"></i> In Progress</span>';
							}
							return '<span class="label label-danger"><i class="fa fa-times"></i> TODO</span>';
						}
					}, {
						targets: ++cnt,
						// orderable : true,
						title: '名称',
						name: 'flowName',
						width: '150px',
						render(data, type, row, meta) {
							let videoUrl = {};
							switch (row.prefix) {
								case "materiality" :
									videoUrl = '<a id="materiality" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
									'<i class="fa fa-video-camera" title="重要性水平设置"></i>' +
									'</a>';
								break;
								case "trialBalance" :
									// TB科目维护
									videoUrl = '<a id="trialBalance1"  style="float: right;color: #5c90d2;cursor: pointer" onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="TB科目维护"></i>' +
										'</a>';
									// 试算平衡表
									videoUrl += '<a id="trialBalance3" style="float: right;position: relative; left: -7px;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="试算平衡表"></i>' +
										'</a>';
									// TB科目对照
									videoUrl += '<a id="trialBalance2" style="float: right;position: relative; left: -16px;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="TB科目对照"></i>' +
										'</a>';
									break;
								case "unaudited" :
									videoUrl = '<a id="unaudited" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="未审报表"></i>' +
										'</a>';
									break;
								case "identified" :
									videoUrl = '<a id="identified" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="科目认定表"></i>' +
										'</a>';
									break;
								case "programPlan" :
									videoUrl = '<a id="programPlan2" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="审计程序"></i>' +
										'</a>';
									videoUrl += '<a id="programPlan1" style="float: right;position: relative; left: -7px;" onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" color: #5c90d2" title="计划程序"></i>' +
										'</a>';
									break;
								case "program" :
									videoUrl = '<a id="program2" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="实施程序"></i>' +
										'</a>';
									videoUrl += '<a id="program1" style="float: right;position: relative; left: -7px;color: #5c90d2"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="底稿"></i>' +
										'</a>';
									break;
								case "sampling" :
									videoUrl = '<a id="sampling" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="抽凭"></i>' +
										'</a>';
									break;
								case "clearQuestion" :
									videoUrl = '<a id="clearQuestion" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="批注"></i>' +
										'</a>';
									break;
								case "noteinfo" :
									videoUrl = '<a id="noteinfo" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="附注"></i>' +
										'</a>';
									break;
								case "audited" :
									videoUrl = '<a id="audited" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="审定报表"></i>' +
										'</a>';
									break;
								case "report" :
									videoUrl = '<a id="report" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="报告"></i>' +
										'</a>';
									break;
								case "analysisReview" :
									videoUrl = '<a id="analysisReview" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="初步分析性复核"></i>' +
										'</a>';
									break;
								case "finalAnalysisReview" :
									videoUrl = '<a id="finalAnalysisReview" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="最终分析性复核"></i>' +
										'</a>';
									break;
								case "bbReport" :
									videoUrl = '<a id="bbReport" style="float: right;color: #5c90d2;cursor: pointer"  onclick="getVideoUrl(this)">' +
										'<i class="fa fa-video-camera" title="报备"></i>' +
										'</a>';
									break;
							}
							videoUrl = flowName[row.prefix]+videoUrl;
							return videoUrl;
						}
					}, {
						targets: ++cnt,
						// orderable : true,
						title: '进度',
						name: 'State',
						data: 'State',
						width: '200px',
						className: 'text-center',
						render(data, type, row, meta) {
							if (!data) {
								// return '<div style="color: red;"><i class="fa
								// fa-close"></i></div>';
								data = 0;
							}
							data = parseFloat(data).toFixed(2);
							if (!row) {
								row = '';
							}
							let prompt = '';
							let progressclass = 'progress-bar-success';
							switch (row.prefix) {
								case 'materiality':
									prompt = '未设置=0%，设置完成=100%，';
									break;
								case 'trialBalance':
									prompt = '生成科目对照=50%，生成试算平衡表=100%';
									break;
								case 'unaudited':
									prompt = '生成未审报表=50% ，核对完成=100%';
									break;
								case 'identified':
									prompt = '科目认定表已设置认定值的记录数/科目认定表总记录数';
									break;
								case 'programPlan':
									prompt = 'SUM(计划程序认定分值)/SUM(科目认定分值)';
									break;
								case 'program':
									prompt = 'SUM((每个计划程序中已完成的实施程序数/每个计划程序中实施程序总数)/计划程序总数)';
									break;
								case 'sampling':
									prompt = '审计结论填写数/抽凭总数';
									break;
								case 'clearQuestion':
									prompt = '已关闭批注/批注总数';
									break;
								case 'noteinfo':
									prompt = '已完成附注/附注总数';
									break;
								case 'audited':
									prompt = '生成审定报表=50% ，现金流量表确认完成=75%，核对完成=100%';
									break;
								case 'report':
									prompt = '未生成=0%, 已生成=100%';
									break;
								case 'bbReport':
									prompt = '未完成=0%, 已完成=100%';
									break;
							}
							if (data < 20) {
								progressclass = 'progress-bar-danger';
							} else if (20 <= data && data < 50) {
								progressclass = 'progress-bar-warning';
							} else if (50 <= data && data < 100) {
								progressclass = 'progress-bar-info';
							}
							return ('<div class="progress active bdo-project-ctl-progress-bar" ' +
								'title="' + prompt + '" style="margin: 0px 5px;" ' +
								'data-table-row-num="'+meta+'" data-row-prefix="'+row.prefix+'">'
								+ '		<div class="progress-bar ' + progressclass + ' progress-bar-striped" role="progressbar" aria-valuenow="' + data + '" aria-valuemin="10" data-toggle="tooltip" aria-valuemax="100"'
								+ '		style="width: ' + data + '%;">'
								+ (() => {
									if (data != 0) return data + '%';
									return '<span style="color: #0b0b0b;">' + (data + '%') + '</span>';
								})()
								+ '	</div>');
						}
					}, {
						targets: ++cnt,
						// orderable : true,
						title: '审核人',
						name: 'AuditUser',
						data: 'AuditUser',
						width: '100px',
						render(data, type, row, meta) {
							return '<select type="text" '
								+ ' data-result="' + row.__uAuditUser.userId + '"'
								+ ' data-content="' + row.__uAuditUser.userName + '(' + row.__uAuditUser.hrLoginId + ')' + '"'
								+ ' data-rowNum="' + meta + '"'
								+ ' data-label="' + row.__uAuditUser.userName + '"'
								+ ' value="' + row.__uAuditUser.userName + '(' + row.__uAuditUser.hrLoginId + ')' + '"'
								+ 'id="' + row.prefix + 'AuditUser" name="' + row.prefix + 'AuditUser" class="form-control" aria-invalid="false" style="text-align: center;height: 100%; margin: -5px -2px;"></select>';
						}
					}, {
						targets: ++cnt,
						title: '审核状态',
						width: '80px',
						className: 'text-center',
						render(data, type, row, meta) {
							let statu = row.auditStatu;
							let auditFlag = (statu & (0x1 << meta.row)) >> meta.row;
							let result;
							let disabled = false;
							if (row.AuditUser && row.AuditUser != '' && row.State >= 100) {
								disabled = true;
							}
							if (auditFlag == 1) {
								result = '<div class="btn-group">' +
									'	<span class="btn btn-xs bg-success" style="color:#fff;cursor:default"><i class="si si-check"></i>已审核</span>' +
									'	<button class="btn btn-xs btn-danger table-btn-operate" type="button" data-toggle="tooltip" title="" data-original-title="撤销审核" false="" data-row="' + meta.row + '" name="optCancelAudit">' +
									'		<i class="fa fa-close"></i>' +
									'	</button>' +
									'</div>';
							} else {
								result = '<div class="btn-group">';
								if (disabled) {
									result += '	<span class="btn btn-xs bg-danger" style="color:#fff;cursor:default"><i class="si si-close" style="color:#fff"></i>待审核</span>&nbsp;&nbsp;' +
										'<button class="btn btn-xs btn-success table-btn-operate" type="button" data-toggle="tooltip" title="审核" data-original-title="审核" data-row="' + meta.row + '" name="optAudit">' +
										'		<i class="fa fa-check text-white"></i>' +
										'	</button>';
								} else {
									result += '	<span class="btn btn-xs bg-warning" style="color:#fff;cursor:default"><i class="si si-close"></i>未完成</span>&nbsp;&nbsp;' +
										('<button class="btn btn-xs "  disabled="' + disabled + '"><i class="fa fa-check text-white"></i></button>');
								}
								result += '</div>';
							}
							return result;
						}
					}
				]
			}
		}
		, projectctlPDProgramTable: null
		, projectctlPDProgramTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00283',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				tabNum: true
			},
			tableParam: {
				/*
				 * select: false, lengthChange: false, ordering: false,
				 * serverSide: true, dom: '<"row"<"col-sm-12"tr>>', scrollY:
				 * false, bdoCustomizeColumns: true,
				 */
				select: true,
				ordering: false,
				serverSide: true,
				autoWidth: true,
				scrollY: 500,
				scrollX: true,
				paging: true,
				fixedColumns: true,
				bdoCustomizeColumns: true,
				columnDefs: [
					{
						targets: (()=>{cnt = 1; return cnt})(),
						title: 'TB科目',
						name: 'tbSubjectName',
						data: 'tbSubjectName',
						width: '80px',
						className: 'text-center'
					}, {
						targets: ++cnt,
						title: '财务科目',
						name: 'apUserSubjectName',
						data: 'apUserSubjectName',
						width: '150px'
					}, {
						targets: ++cnt,
						title: '索引',
						name: 'indexId',
						data: 'indexId',
						width: '50px',
						className: 'text-right'/*
												 * , render(data, type, row,
												 * meta) { return row.indexId +
												 * '-' + apName; }
												 */
					}, {
						targets: ++cnt,
						title: '名称',
						name: 'apName',
						data: 'apName',
						width: '150px',
						className: 'text-left'
					}, {
						targets: ++cnt,
						title: '实施程序索引',
						name: 'subIndexId',
						data: 'subIndexId',
						width: '150px',
						render(data) {
							if(data > '') {
								return data;
							}
							return '<span style="color: red;">未生成</span>';
						}
					},{
						targets: ++cnt,
						title: '审计结论',
						name: 'auditConclusion',
						data: 'auditConclusion',
						width: '150px'
					},{
						targets: ++cnt,
						title: '底稿编制人',
						name: '__uWorkpaperEditorName',
						data: '__uWorkpaperEditorName',
						width: '150px'
					}, {
						targets: ++cnt,
						title: '已完成',
						name: 'haveDone',
						data: 'haveDone',
						width: '80px',
						className: 'text-center',
						renderer: 'getDicLabelByVal|boolean',
						render(data) {
							let valStr =  DicVal2Nm(data, 'boolean');
							if(data == 1) {
								return valStr;
							}
							return '<span style="color: red;">' + valStr + '</span>';
						}
					}
				]
			}
		}
		, projectctlPDProgramPlanTable: null
		, projectctlPDProgramPlanTableCfg: {
			localParam: {
				// url: 'dgCenter/DgGeneral.query.json',
				url: 'dgCenter/DgProject.getPDProgramPlan.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00284',
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					start: -1,
					limit: -1
				},
				tabNum: true
			},
			tableParam: {
				/*
				 * select: false, lengthChange: false, ordering: false,
				 * serverSide: true, dom: '<"row"<"col-sm-12"tr>>', scrollY:
				 * false, bdoCustomizeColumns: true,
				 */
				select: true,
				ordering: false,
				serverSide: true,
				autoWidth: true,
				scrollY: 500,
				scrollX: true,
				paging: false,
				fixedColumns: true,
				bdoCustomizeColumns: true,
				columnDefs: [
					{
						targets: (()=>{cnt = 1; return cnt})(),
						title: 'TB科目',
						name: 'tbSubjectName',
						data: 'tbSubjectName',
						width: '80px',
						className: 'text-center'
					}, {
						targets: ++cnt,
						title: '财务科目',
						name: 'apUserSubjectName',
						data: 'apUserSubjectName',
						width: '150px'
					}, /*
						 * { targets: ++cnt, title: '索引', name: 'indexId', data:
						 * 'indexId', width: '50px', className: 'text-right',
						 * render(data, type, row, meta) { return row.indexId +
						 * '-' + apName; } }, { targets: ++cnt, title: '名称',
						 * name: 'apName', data: 'apName', width: '150px',
						 * className: 'text-left' },
						 */ /*
							 * { targets: ++cnt, title: '已生成实施程序', name:
							 * 'haveDone', data: 'haveDone', width: '80px',
							 * className: 'text-center', renderer:
							 * 'getDicLabelByVal|boolean', render(data) { return
							 * DicVal2Nm(data, 'boolean'); } },
							 */ {
						targets: ++cnt,
						title: 'ECAVP',
						name: 'ipSe',
						data: 'ipSe',
						width: '80px',
						className: 'text-center',
						render(data, type, row, meta) {
							let ecavp = ['e','c','a','v','p'];
							let htmlStr1 = '';
							let htmlStr2 = '';
							let htmlStr3 = '';
							$.each(ecavp, function(index,vIndex) {
								let val1 = '';
								let val2 = '';
								// let val3 = '';
								if (Number(row.subjectId) >= 9900 && Number(row.subjectId) < 10000) {
									// 判断科目, 科目id在 9900-10000之间，为其他标准科目
									val1 = row['oipS'+vIndex]/row.num;
									val2 = row['ppS'+vIndex]/row.num;
									// val3 = row['tdS'+vIndex];
								} else {
									// 为tb标准科目
									val1 = row['ipS'+vIndex]/row.num;
									val2 = row['ppS'+vIndex]/row.num;
									// val3 = row['tdS'+vIndex];
								}
								htmlStr1 += '<span style="padding-left: 3px;">' + val1 + '</span>';
								if(val1 == val2) {
									htmlStr2 += '<span style="padding-left: 3px;">' + val2 + '</span>';
								}else {
									htmlStr2 += '<span style="padding-left: 3px;color: red;">' + val2 + '</span>';
								}
							});
							let result = `
							<div >
								<div>科目认定：`+htmlStr1+`</div>
								<div>计划程序：`+htmlStr2+`</div>
							</div>
							`;
							return result;
						}
					}
				]
			}
		}
		, projectctlPDIdentifiedTable: null
		, projectctlPDIdentifiedTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00285',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					start: -1,
					limit: -1
				},
				tabNum: true
			},
			tableParam: {
				/*
				 * select: false, lengthChange: false, ordering: false,
				 * serverSide: true, dom: '<"row"<"col-sm-12"tr>>', scrollY:
				 * false, bdoCustomizeColumns: true,
				 */
				select: true,
				ordering: false,
				serverSide: true,
				autoWidth: true,
				scrollY: 500,
				scrollX: true,
				paging: true,
				fixedColumns: true,
				bdoCustomizeColumns: true,
				columnDefs: [
					{
						targets: (()=>{cnt = 1; return cnt})(),
						title: 'TB科目',
						name: 'tbSubject',
						data: 'tbSubject',
						width: '80px',
						className: 'text-center'
					}, {
						targets: ++cnt,
						title: '客户科目',
						name: 'userSubject',
						data: 'userSubject',
						width: '150px'
					}, {
						targets: ++cnt,
						title: '是否完成',
						name: 'isFinish',
						// data: 'isMapBaseSubject',
						width: '80px',
						className: 'text-center',
						renderer: 'getDicLabelByVal|boolean',
						render(data, type, row, meta) {
							let nd = '0';
							if (row.isSetEcvap == 1 && row.isSetSubjectEditor == 1) {
								nd = '1';
							}
							return DicVal2Nm(nd, 'boolean');
						}
					}/*
						 * , { targets: ++cnt, title: '已设置认定值', name:
						 * 'isSetEcvap', data: 'isSetEcvap', width: '80px',
						 * className: 'text-center', renderer:
						 * 'getDicLabelByVal|boolean', render(data) { return
						 * DicVal2Nm(data, 'boolean'); } }, { targets: ++cnt,
						 * title: '已设置科目认定人', name: 'isSetSubjectEditor', data:
						 * 'isSetSubjectEditor', width: '80px', className:
						 * 'text-center', renderer: 'getDicLabelByVal|boolean',
						 * render(data) { return DicVal2Nm(data, 'boolean'); } }, {
						 * targets: ++cnt, title: '已生成审计程序', name:
						 * 'isCreatedProgram', data: 'isCreatedProgram', width:
						 * '80px', className: 'text-center', renderer:
						 * 'getDicLabelByVal|boolean', render(data) { return
						 * DicVal2Nm(data, 'boolean'); } }
						 */
				]
			}
		}
		, projectctlPDNoteinfoTable: null
		, projectctlPDNoteinfoTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00391',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				tabNum: true
			},
			tableParam: {
				select: false,
				ordering: false,
				serverSide: true,
				autoWidth: true,
				scrollY: 550,
				scrollX: true,
				paging: false,
				fixedColumns: true,
				bdoCustomizeColumns: true,
				columnDefs: [
					{
						targets: (()=>{cnt = 1; return cnt})(),
						title: '附注编号',
						name: 'noteNo',
						data: 'noteNo',
						width: '80px',
						className: 'text-left'
					}, {
						targets: ++cnt,
						title: '附注名称',
						name: 'noteName',
						data: 'noteName',
						width: '150px',
						className: 'text-left'
					}, {
						targets: ++cnt,
						title: '更新人',
						name: '__urevisorName',
						data: '__urevisorName',
						width: '50px',
						className: 'text-center'
					}, {
						targets: ++cnt,
						title: '更新时间',
						name: 'updateTime',
						data: 'updateTime',
						width: '100px',
						className: 'text-right'
					}, {
						targets: ++cnt,
						title: '已完成',
						name: 'haveDone',
						data: 'haveDone',
						width: '80px',
						className: 'text-center',
						renderer: 'getDicLabelByVal|boolean',
						render(data) {
							let valStr =  DicVal2Nm(data, 'boolean');
							if(data == 1) {
								return valStr;
							}
							return '<span style="color: red;">' + valStr + '</span>';
						}
					}
				]
			}
		}
		, dgBackupFileSider: null
		, dgBackupFileTable: null
		, dgBackupFileTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG00046',
					param2: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID
				},
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '500px',
				fixedThead: true,
				select: true,
				ordering: true,
				serverSide: true,
				autoWidth: false,
				select: false,
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
						var renderStr = '';
						renderStr += '<div class="">';
						renderStr += '<button class="btn btn-xs btn-success table-btn-operate bdo-drop-btn" type="button" name="downloadBackupFileBtn" data-placement="top" title="下载历史底稿" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-download"></i>'
							+ '	</button>';
						renderStr += '</div>';
						return renderStr;
						return renderStr;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '文件名称',
					name: 'fileName',
					data: 'fileName',
					width: '200px'/*
									 * , className : 'dg-ap'
									 */
				}, {
					targets: ++cnt,
					orderable: true,
					title: '文件大小',
					name: 'size',
					data: 'size',
					width: '150px',
					render(data, type, row, meta) {
						let unit = ' KB';
						let val = data;
						if (data / 1024 > 1) {
							val = parseFloat(data / 1024).toFixed(2);
							unit = ' MB';
						}
						if (data / (1024 * 1024) > 1) {
							val = parseFloat(data / (1024 * 1024)).toFixed(2);
							unit = ' GB';
						}
						return val + unit;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '创建日期',
					name: 'createDate',
					data: 'createDate',
					width: '150px',
					className: 'dg-ap',
					render(data, type, row, meta) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '创建人',
					name: 'createUser',
					width: '150px',
					render(data, type, row, meta) {
						return row.__ucreateUserName;
					}
				}]
			}
		},
		assertProject() {
			var assertProjectTableCfg = {
				localParam: {
					url: 'dgCenter/DgGeneral.query.json',
					urlparam: {
						menuId: window.sys_menuId,
						sqlId: 'DG00392'
					},
					tabNum: true
				},
				tableParam: {
					scrollX: true,
					scrollY : '320px',
					pageLength: 30,
					select: false,
					ordering : false,
					serverSide: true,
					fixedThead: true,
					fixedHeight: '480px',
					columnDefs: [{
						targets: 1,
						title: '功能介绍',
						name: 'information',
						data: 'information',
						width: '250px'
					}, {
						targets: 2,
						title: '详细',
						name: 'detail',
						data: 'detail',
						width: '150px',
						render: function(data, type, row, meta) {
							var renderStr = '';
							if(row.detailType != 5){
								renderStr = '<a href=\"#\" data-row="' + meta.row + '">' + data + '</a>';
							} else {
								renderStr = '<label>' + data + '</label>';
							}
							return renderStr;
						}
					}, {
						targets: 3,
						title: '操作',
						name: 'operate',
						data: 'operate',
						width: '80px',
						className: 'text-center',
						render: function(data, type, row, meta) {
							var renderStr = '';
							if(row.funcType == 0){
								renderStr = '<button class="btn btn-xs btn-success" name="operateBtn" type="button" title="修复" data-row="' + meta.row + '"><i class="fa fa-wrench"></i></button>';
							}
							return renderStr;
						}
					}]
				}
			};
			// 项目维护
			$('#assertProjectBtn').on('click', function() {
				$('#assertProjectModal').modal('show');
			});
			// 打开弹出框
			$('#assertProjectModal').on('show.bs.modal', function() {
				BdoDataTable('assertProjectTable', assertProjectTableCfg);
			});
			// 点击详情标签
			$('#assertProjectTable').on('click', 'a', function() {
				var table = $('#assertProjectTable').dataTable();
				var rowData = table.fnGetData($(this).attr('data-row'));
				var suffix = rowData.detail.substring(rowData.detail.lastIndexOf(".") + 1).toLowerCase();
				if (suffix == 'pdf' || suffix == 'jpg' || suffix == 'png' || suffix == 'jpeg') {
					window.open('dgCenter/DgProjectAssert.previewFile.json?param1=' + rowData.autoId + '&param2=type1' + '&param3=' + rowData.detail, rowData.detail, 'location=no');
				} else if (suffix == 'xlsx'){
					rowData.pageType = 1;
					var nodeData = {
						extraOptions: rowData,
						currentNode: {
							extraOptions: rowData
						}
					};
					$.sessionStorage('fileNode', JSON.stringify(nodeData));
					window.open('/Faith/dgcenter.do?m=previewFile');
				} else {
					// 下载文件
					downloadFile('dgCenter/DgProjectAssert.downloadFile.json', {
						param1: rowData.autoId
					});
				}
			});
			// 点击操作按钮
			$('#assertProjectTable').on('click', 'button[name="operateBtn"]', function() {
				var table = $('#assertProjectTable').dataTable();
				var rowData = table.fnGetData($(this).attr('data-row'));
				var displayText = '';
				if(rowData.funcType == 0){
					displayText = '确认是否修复？';
				}
				bdoConfirmBox('提示', displayText, isConfirm => {
					if(rowData.funcType == 0){
						bdoInProcessingBox('修复中');
					}
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgProjectAssert.assertProject.json',
						// async : false,
						data: {
							menuId: window.sys_menuId,
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: rowData.autoId,
							param2: window.CUR_CUSTOMERID,
							param3: window.CUR_PROJECTID,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if(rowData.funcType == 0){
									bdoSuccessBox('成功', '修复成功！');
								}
							} else {
								if(rowData.funcType == 0){
									bdoErrorBox('失败', '修复失败！');
								}
							}
						}
					});
				});
			});
		},
		memberBlackList() {
			// 用户禁用按钮
			$('#memberDisabled').on('click', function() {
				$('#memberDisadled-modal').modal('show');
				$('#memberDisadled-modal').draggable();
				$('#memberDisadled-modal').css('overflow-y', 'scroll');
				var params = {
					menuId: window.sys_menuId,
					sqlId: 'DG00142',
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID,
					param3: ''
				};
				dgMemberDisabledTableCfg.localParam.urlparam = params;
				BdoDataTable('dgMemberDisabledtable', dgMemberDisabledTableCfg);
				queryGroupMembers();
				return false;
			});
			// dgMemberDisabledtable: null,
			var dgMemberDisabledTableCfg = {
				localParam: {
					tabNum: true,
					url: 'cpBase/General.query.json',
					urlparam: {}
				},
				tableParam: {
					select: false,
					lengthChange: false,
					dom: '<"row"<"col-sm-12"tr>>',//
					// order : [6, 'ASC'],
					ordering: false,
					serverSide: true,
					/*
					 * rowReorder : { update : false },
					 */
					columnDefs: [
						{
							targets: 1,
							orderable: false,
							className: 'text-center',
							title: '处理',
							width: '60px',
							render: function(data, type, row, meta) {
								var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
								renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
								return renderStr;
							}
						}, {
							targets: 2,
							className: 'text-left',
							title: '黑名单成员',
							name: 'memberName',
							data: 'memberName',
							width: '80px'
						}]
				}
			};
			// 查询
			$('#comtemplate_search').on('click', function() {
				var memberId = $('#template_vocationId').val();
				var params = {
					menuId: window.sys_menuId,
					sqlId: 'DG00142',
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID,
					param3: memberId
				};
				dgMemberDisabledTableCfg.localParam.urlparam = params;
				BdoDataTable('dgMemberDisabledtable', dgMemberDisabledTableCfg);
			});
			// 移除黑名单
			$('#dgMemberDisabledtable').on('click', 'button[name="subDelete"]', function() {
				var object = $('#dgMemberDisabledtable').DataTable().data()[$(this).closest('tr').index()];
				bdoConfirmBox('删除', '是否从黑名单中移除？', function() {
					$.ajax({
						url: 'dgCenter/CustomerProjectSet.saveProjectBlackList.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_PROJECTID,
							param2: window.CUR_CUSTOMERID,
							param3: object.membersId,
							param4: object.autoId,
							param5: '2',
							param6: object.memberName.substr(0,object.memberName.indexOf('('))
						},
						dataType: 'json',
						success: function(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#dgMemberDisabledtable').DataTable().ajax.reload();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			});
			// 添加黑名单
			$('#comtemplatecol_add').on('click', function() {
				var membersId = $('#template_vocationId').val();
				if (membersId == null || membersId == '') {
					bdoInfoBox('提示', '请选择项目成员！');
					return;
				}
				bdoConfirmBox('添加', '是否加入黑名单？', function() {
					$.ajax({
						url: 'dgCenter/CustomerProjectSet.saveProjectBlackList.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_PROJECTID,
							param2: window.CUR_CUSTOMERID,
							param3: membersId,
							param4: '',
							param5: '1',
							param6: $('#template_vocationId option:selected').text()
						},
						dataType: 'json',
						success: function(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#dgMemberDisabledtable').DataTable().ajax.reload();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			});
			var queryGroupMembers = function() {
				let me = this;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgProject.getProjectMember.json',
					// async : false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_PROJECTID,
						param2: window.CUR_CUSTOMERID,
						param3: '1'
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							var jsonArr = '';
							$.each(data.data, function(index, info) {
								jsonArr += '<option value="' + info.id + '">' + info.name + '</option>';
							});
							/*
							 * var ruleoption = data.data.map(item=>{ return
							 * {id:item.id,text:item.name,value:item.name}; });
							 */
							// console.log("123"+ruleoption);
							// var ruleoption =
							// ComboDBOption('cpBase/Combo.getTbRuleacc.json',
							// false);
							$('#template_vocationId').html(jsonArr/*
																	 * +'<option
																	 * value=0>默认模板</option>'
																	 */);
						}
					}
				});
			};

		},
		projectIndustry() {
			// 行业按钮
			$('#projectIndustryBtn').on('click', function() {
				$('#projectIndustry-modal').modal('show');
				$('#projectIndustry-modal').draggable();
				$('#projectIndustry-modal').css('overflow-y', 'scroll');
				$('#projectIndustry_old').val(page.dgProjectInfo.projectIndustry);
				return false;
			});
			$('#projectIndustry_new').treecombo({
				url : 'cpBase/TreeCommon.findIndustry4Tree.json',
				params : {},
				view : {
					leafIcon : 'fa fa-building text-flat',
					nodeIcon : 'fa fa-bank text-primary-light',
					folderSelectable : true,
					multiSelect : false,
					positionValue : 'inherit'
				}
			});
			$('#projectIndustry-save').on('click', function() {
				var projectIndustry_new = $('#projectIndustry_new').attr('data-result');
				var projectIndustry = $('#projectIndustry_new').val();
				if (projectIndustry_new == null || projectIndustry_new == '') {
					bdoErrorBox('错误', '请选择行业');
					return;
				}
				if (projectIndustry_new === '1') {
					bdoErrorBox('错误', '请选择具体行业');
					return;
				}
				bdoConfirmBox('保存', '是否确认修改？', function() {
					$.ajax({
						url: 'dgCenter/DgProject.updateIndustry.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: projectIndustry_new,
							param4: projectIndustry
						},
						dataType: 'json',
						success: function(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								page.dgProjectInfo.industry = projectIndustry_new;
								page.dgProjectInfo.projectIndustry = projectIndustry;
								$('#projectIndustry-modal').modal('hide');
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			});
		},
		internManage() {
			var internManageTableCfg = {
				localParam: {
					url: 'dgCenter/DgGeneral.query.json',
					urlparam: {
						menuId: window.sys_menuId,
						sqlId: 'DG00452',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID
					},
					tabNum: true
				},
				tableParam: {
					scrollX: true,
					scrollY : '410px',
					lengthChange: false,
					select: false,
					ordering : false,
					serverSide: true,
					fixedThead: true,
					fixedHeight: '480px',
					dom: '<"row"<"col-sm-12"tr>>',
					bdoCustomizeColumns: true,
					columnDefs: [{
						targets: 1,
						title: '操作',
      					orderable: false,
		     			data: null,
						width: '50px',
						className: 'text-center',
						render: function(data, type, row, meta) {
							var renderStr = '';
						    renderStr += '<button class="btn btn-xs btn-success table-btn-operate" name="updateBtn" type="button" title="授权变更" data-row="' + meta.row + '"><i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger" name="deleteBtn" type="button" title="删除" data-row="' + meta.row + '"><i class="fa fa-times"></i></button>';
							return renderStr;
						}
					}, {
						targets: 2,
						title: '姓名',
						name: 'internName',
						data: 'internName',
						width: '100px'
					}, {
						targets: 3,
						title: '部门',
						name: 'departname',
						data: 'departname',
						width: '100px'
					}, {
						targets: 4,
						title: '权限',
						name: 'popedom',
						data: 'popedom',
						width: '150px',
						render: function(data, type, row, meta) {
							var renderStr = '';
							if (data != null) {
								renderStr = getInternSystem(data);
							}
							
							return renderStr;
						}
					}, {
						targets: 5,
						title: '手机',
						name: 'mobilePhone',
						data: 'mobilePhone',
						width: '100px'
					}, {
						targets: 6,
						title: '授权绑定人员',
						name: 'bindingMembers',
						data: 'bindingMembers',
						width: '200px'
					}]
				}
			};
			var bindingMembersTableCfg = {
				localParam: {
					url: 'dgCenter/DgProjectIntern.getBindingMembersSelector.json',
					urlparam: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID
					},
					tabNum: true
				},
				tableParam: {
					scrollX: true,
					scrollY : '410px',
					lengthChange: false,
					select: false,
					ordering : false,
					serverSide: true,
					fixedThead: true,
					fixedHeight: '480px',
					dom: '<"row"<"col-sm-12"tr>>',
					bdoCustomizeColumns: true,
					columnDefs: [{
						targets: 1,
						title: '选择',
      					orderable: false,
		     			data: null,
						width: '50px',
						className: 'text-center',
						render: function(data, type, row, meta) {
							var renderStr = '';
							if ($('#popedomUpdate_bindingMembersId').val().indexOf(data.memberId) != -1) {
							    renderStr += '<input type="checkbox" checked="checked" name="memberCheck" value="1" data-row="' + meta.row + '" />';
							} else {
								renderStr += '<input type="checkbox" name="memberCheck" value="1" data-row="' + meta.row + '" />';
							}
							return renderStr;
						}
					}, {
						targets: 2,
						title: '姓名',
						name: 'memberName',
						data: 'memberName',
						width: '100px'
					}]
				}
			};
			var bdoSelectInternUrl = '';
			// 实习生管理
			$('#internManageBtn').on('click', function() {
				$('#internManage-modal').modal('show');
				return false;
			});
			// 打开弹出框
			$('#internManage-modal').on('show.bs.modal', function() {
				BdoDataTable('internManageTable', internManageTableCfg);
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgProjectIntern.getSelectInternUrl.json',
					// async : false,
					
					data: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							bdoSelectInternUrl = data.data[0].bdoSelectInternUrl;
						}
					}
				});
			});
			$('#addInternBtn').on('click', function() {
			    var btn = $(this);
			    btn.prop('disabled',true);
			    setTimeout(function(){
			        btn.prop('disabled',false);
			    },3000);
				var jsonArray = [];
				var table = $('#internManageTable').dataTable();
				var nTrs = table.fnGetNodes();
				for(var i = 0; i < nTrs.length; i++) {
					var rowData = table.fnGetData(nTrs[i]);
					var jsonData = {
						'depName' : rowData.departname,
						'key' : rowData.loginId,
						'mobile' : rowData.mobilePhone,
						'value' : rowData.internName
					};
					
					jsonArray.push(jsonData);
				}
				BdoSharedMessage.MsgShuck_ECMA.init({
			        selector: '#memberSelector', // 显示组件元素的id，自定义。
			        value: jsonArray, // 双向绑定的值
					//providerUrl: 'http://172.17.10.18:6698/#/auth?systemid=sacp&loginId=zhang.siyu&token=1', // 实习生组件发布的地址
			        providerUrl: bdoSelectInternUrl, // 实习生组件发布的地址
			        initData: {
			            // initData可以在组件进行回显已选择用户，字段与格式：rowData: [{depName: 'XXX', key: 2222, mobile: '133444444', value: '张三'}]。
			            rowData: jsonArray
			        },
			        listeners: {
			            input: (value) => {
			            },
			            change: (value) => {
			            },
			            trigger: (visible) => {
							if (visible) {
								$('#memberSelector-modal').modal('show');
							} else {
								$('#memberSelector-modal').modal('hide');
							}
			            },
			            cancel: () => {
							$('#memberSelector-modal').modal('hide');
							$('#memberSelector').empty();
			            },
			            submit: (value, extraData) => {
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgProjectIntern.insertInternUser.json',
								// async : false,
								
								data: {
									menuId: window.sys_menuId,
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									jsonData: JSON.stringify(extraData),
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										bdoSuccessBox('成功', '选择成功！');
										BdoDataTable('internManageTable', internManageTableCfg);
									} else {
										bdoErrorBox('失败', '选择失败！');
									}
								}
							});
							$('#memberSelector').empty();
			            }
			        }
			    });
		        // 打开实习生选择组件
		        BdoSharedMessage.MsgShuck_ECMA.open();
		    });
			// 点击关闭实习生(Toolbar)
			$('#closeInternBtn').on('click', function() {
				$('#internManage-modal').modal('hide');
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgProjectIntern.searchInternMembers.json',
					// async : false,
					data: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#internMembers').val(data.data[0].internMembers);
						}
					}
				});
			});
			// 点击操作按钮(更新)
			$('#internManageTable').on('click', 'button[name="updateBtn"]', function() {
				var table = $('#internManageTable').dataTable();
				var rowData = table.fnGetData($(this).attr('data-row'));
				$('#popedomUpdate_autoId').val(rowData.autoId);
				$('#popedomUpdate_name').val(rowData.internName);
				$('#popedomUpdate_mobile').val(rowData.mobilePhone);
				$.each(internSystemDicData, function(i, item){
					$('#popedomUpdate_check' + i).find('input:checkbox').prop('checked', false);
				});
				if (rowData.popedom != null) {
					$.each(internSystemDicData, function(i, item){
						if (rowData.popedom.indexOf(',' + item.value + ',') != -1) {
							$('#popedomUpdate_check' + i).find('input:checkbox').prop('checked', true);
						}
					});
				}
				$('#popedomUpdate_bindingMembers').val(rowData.bindingMembers);
				$('#popedomUpdate_bindingMembersId').val(rowData.bindingMembersId);
				$('#popedomUpdate-modal').modal('show');
			});
			// 点击操作按钮(删除)
			$('#internManageTable').on('click', 'button[name="deleteBtn"]', function() {
				var table = $('#internManageTable').dataTable();
				var rowData = table.fnGetData($(this).attr('data-row'));
				var displayText = '确认是否删除？';
				bdoConfirmBox('提示', displayText, isConfirm => {
					bdoInProcessingBox('删除中');
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgProjectIntern.deleteInternUser.json',
						// async : false,
						data: {
							menuId: window.sys_menuId,
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: rowData.autoId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox('成功', '删除成功！');
								BdoDataTable('internManageTable', internManageTableCfg);
							} else {
								bdoErrorBox('失败', '删除失败！');
							}
						}
					});
				});
			});
			//权限设定form参数
			$('#popedomUpdate_tb_form').formview({
				display: 'tableform-one',
				column: internSystemDicData.length,
				items: getPopedomUpdateTbFormItem(),
				buttons: []
			});
			// 保存
			$('#popedomUpdate_save').on('click', function() {
				var val_autoId = $('#popedomUpdate_autoId').val();
				var val_popedom = '';
				
				$.each(internSystemDicData, function(i, item){
					if ($('#popedomUpdate_check' + i).find('input:checkbox').prop('checked')) {
						val_popedom += ',' + item.value;
					}
				});	
				
				if (val_popedom != '') {
					val_popedom += ',';
				} else {
					val_popedom += ', ,';
				}
				var val_bindingMembers = $('#popedomUpdate_bindingMembers').val();
				var val_bindingMembersId = $('#popedomUpdate_bindingMembersId').val();
				
				var displayText = '确认是否保存？';
				bdoConfirmBox('提示', displayText, isConfirm => {
					bdoInProcessingBox('保存中');
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgProjectIntern.savePopedom.json',
						// async : false,
						data: {
							menuId: window.sys_menuId,
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: val_autoId,
							param2: val_popedom,
							param3: val_bindingMembers,
							param4: val_bindingMembersId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox('成功', '保存成功！');
								$('#popedomUpdate-modal').modal('hide');
								BdoDataTable('internManageTable', internManageTableCfg);
							} else {
								bdoErrorBox('失败', '保存失败！');
							}
						}
					});
				});
			});
			// 选择授权绑定人员
			$('#selectBindingMembersBtn').on('click', function() {
				$('#bindingMembers-modal').modal('show');
			});
			// 打开弹出框
			$('#bindingMembers-modal').on('show.bs.modal', function() {
				BdoDataTable('bindingMembersTable', bindingMembersTableCfg);
			});
			// 选择授权绑定人员
			$('#bindingMembers-confirm').on('click', function() {
				var bindingMembers = '';
				var bindingMembersId = '';
				$('#bindingMembersTable tr').each(function(i){
					if (i != 0) {
						var memberCheckVal = $(this).children('td').eq(1).find('input[name="memberCheck"]:checked').val();
						if (memberCheckVal == 1) {
							var table = $('#bindingMembersTable').dataTable();
							var rowData = table.fnGetData(i - 1);
							if (bindingMembers != '' || bindingMembersId != '') {
								bindingMembers += ',';
								bindingMembersId += ',';
							}
							bindingMembers += rowData.memberName;
							bindingMembersId += rowData.memberId;
						}
					}
				});
				$('#popedomUpdate_bindingMembers').val(bindingMembers);
				$('#popedomUpdate_bindingMembersId').val(bindingMembersId);
				
				$('#bindingMembers-modal').modal('hide');
			});
		},
		selectDownloadWorkPaper() {
			// 下载
			$('#modal_dgDownloadTree_sure').click(function() {
				var selectValue = $('#subject_dgDownloadTree').tree('getTreeMultiValue');
				if (typeof (selectValue) === 'object' || typeof (selectValue) === 'undefined' || selectValue === 'undefined') {
					// $('#account_subjectid').val('');
					bdoInfoBox('提示', '请至少勾选1个科目或底稿！');
					return;
				} else {
					// $('#account_subjectid').val(selectValue);
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						data: {
							sqlId: 'DG00243',
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if (data.data[0]){
									if (data.data[0].isResetNow == '1'){
										bdoInfoBox('提示', '正在重置中...请稍后！');
									} else if(data.data[0].isResetNow == '2') {
										bdoInfoBox('提示', '正在克隆中...请稍后！');
									} else {
										var userId = sys_userId;
										/*
										 * if (projectInfo.manager ==
										 * sys_userId) { userId = ''; }
										 */
										$.ajax({
											type: 'post',
											url: 'dgCenter/DgProject.checkData.json',
											data: {
												customerId: window.CUR_CUSTOMERID,
												projectId: window.CUR_PROJECTID,
												param1: window.CUR_CUSTOMERID,
												param2: window.CUR_PROJECTID
											},
											dataType: 'json',
											success(data) {
												bdoConfirmBox('提示', '如果下载底稿超过500M，将仅下载底稿，不下载附件及其他文件，是否下载？', function() {
													if (data.success) {
														downloadFile('dgCenter/DgProject.downloadAllWorkpaper.json', {
															customerId: window.CUR_CUSTOMERID,
															projectId: window.CUR_PROJECTID,
															param1: projectInfo.customerId,
															param2: projectInfo.projectId,
															param3: projectInfo.autoId,
															param4: userId,
															param6: selectValue
														});
													}else{
														downloadFile('dgCenter/DgProject.downloadAllWorkpaper.json', {
															customerId: window.CUR_CUSTOMERID,
															projectId: window.CUR_PROJECTID,
															param1: projectInfo.customerId,
															param2: projectInfo.projectId,
															param3: projectInfo.autoId,
															param4: userId,
															param5: 1,
															param6: selectValue
														});
													}
												})
											}
										});
	
									}
								}
							}
						}
					});
				}
				$('#modal_dgDownloadTree').modal('hide');
			});
			// 下载全部
			$('#modal_dgDownloadAllTree_sure').click(function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						sqlId: 'DG00243',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if (data.data[0]){
								if (data.data[0].isResetNow == '1'){
									bdoInfoBox('提示', '正在重置中...请稍后！');
								} else if(data.data[0].isResetNow == '2') {
									bdoInfoBox('提示', '正在克隆中...请稍后！');
								} else {
									var userId = sys_userId;
									if (projectInfo.manager == sys_userId) {
										userId = '';
									}else{
										bdoInfoBox('提示', '非项目负责人不能下载全部！');
										return;
									}
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgProject.checkData.json',
										data: {
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											param1: window.CUR_CUSTOMERID,
											param2: window.CUR_PROJECTID
										},
										dataType: 'json',
										success(data) {
											bdoConfirmBox('提示', '如果下载底稿超过500M，将仅下载底稿，不下载附件及其他文件，是否下载？', function() {
												if (data.success) {
													downloadFile('dgCenter/DgProject.downloadAllWorkpaper.json', {
														customerId: window.CUR_CUSTOMERID,
														projectId: window.CUR_PROJECTID,
														param1: projectInfo.customerId,
														param2: projectInfo.projectId,
														param3: projectInfo.autoId,
														param4: userId,
														param6: ''
													});
												}else{
													downloadFile('dgCenter/DgProject.downloadAllWorkpaper.json', {
														customerId: window.CUR_CUSTOMERID,
														projectId: window.CUR_PROJECTID,
														param1: projectInfo.customerId,
														param2: projectInfo.projectId,
														param3: projectInfo.autoId,
														param4: userId,
														param5: 1,
														param6: ''
													});
												}
											})
										}
									});

								}
							}
						}
					}
				});

				$('#modal_dgDownloadTree').modal('hide');
			});
			$('#modal_dgDownloadTree_reset').click(function() {
				$('#subject_dgDownloadTree').tree('reset');
			});
			$('#modal_dgDownloadTree_selectAll').click(function() {
				$('#subject_dgDownloadTree').tree('checkAll');
			});
		},
		resetDgSider: null,
		resetDgForm: null,
		resetDgFormCfg: {
			options: {
				propsData: {
					jsonData: resetJsonData
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 2,
			showtip: false,
			id: 'resetDgForm',
			data() {
				return {
					labelClass: resetLabelClass,
					updateFlg: 0
				};
			},
			methods: {
				/**
				 * 
				 */
				onDoResetDgClick(evt) {
					if (projectInfo.manager != sys_userId) {
						bdoInfoBox('提示', '非项目负责人无权限重置底稿！');
						return;
					}
					var text = '';
					var resetSampling = false;
					if (this.jsonData.r_bbReport) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备</font></div>';
						// text = '报备'
					}
					if (this.jsonData.r_report) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告</font></div>';
						// text = '报告'
					}
					if (this.jsonData.r_noteinfo) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注</font></div>';
						// text = '附注、报告'
					}
					if (this.jsonData.r_finalAnalysisReview) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注<br>';
						text += '4.删除最终分析性复核</font></div>';
						// text = '审定报表、附注、报告'
					}
					if (this.jsonData.r_audited) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注<br>';
						text += '4.删除最终分析性复核<br>';
						text += '5.删除现金流量表（直接法、公式法）、删除利润表及所有者权益变动表（手动录入的金额）</font></div>';
						// text = '审定报表、附注、报告'
					}
					if (this.jsonData.r_sampling) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注<br>';
						text += '4.删除最终分析性复核<br>';
						text += '5.删除现金流量表（直接法、公式法）、删除利润表及所有者权益变动表（手动录入的金额）<br>';
						text += '6.删除所有抽凭</font></div>';
						// text = '审定报表、附注、报告'
						resetSampling = true;
					}
					if (this.jsonData.r_program) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注<br>';
						text += '4.删除最终分析性复核<br>';
						text += '5.删除现金流量表（直接法、公式法）、删除利润表及所有者权益变动表（手动录入的金额）<br>';
						text += '6.删除所有抽凭<br>';
						text += '7.删除所有实施程序<br>';
						text += '8.删除所有底稿<br>';
						text += '9.删除所有标签、公式、底稿附件</font></div>';
						// text = '实施程序、审定报表、附注、报告'
						resetSampling = true;
					}
					if (this.jsonData.r_programPlan) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注<br>';
						text += '4.删除最终分析性复核<br>';
						text += '5.删除现金流量表（直接法、公式法）、删除利润表及所有者权益变动表（手动录入的金额）<br>';
						text += '6.删除所有抽凭<br>';
						text += '7.删除所有实施程序<br>';
						text += '8.删除所有底稿<br>';
						text += '9.删除所有标签、公式、底稿附件<br>';
						text += '10.删除所有计划程序</font></div>';
						// text = '计划程序、实施程序、审定报表、附注、报告'
						resetSampling = true;
					}
					if (this.jsonData.r_identified) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注<br>';
						text += '4.删除最终分析性复核<br>';
						text += '5.删除现金流量表（直接法、公式法）、删除利润表及所有者权益变动表（手动录入的金额）<br>';
						text += '6.删除所有抽凭<br>';
						text += '7.删除所有实施程序<br>';
						text += '8.删除所有底稿<br>';
						text += '9.删除所有标签、公式、底稿附件<br>';
						text += '10.删除所有计划程序<br>';
						text += '11.重设科目认定值、科目编制人</font></div>';
						// text = '科目认定表、计划程序、实施程序、审定报表、附注、报告'
						resetSampling = true;
					}
					if (this.jsonData.r_analysisReview) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注<br>';
						text += '4.删除最终分析性复核<br>';
						text += '5.删除现金流量表（直接法、公式法）、删除利润表及所有者权益变动表（手动录入的金额）<br>';
						text += '6.删除所有抽凭<br>';
						text += '7.删除所有实施程序<br>';
						text += '8.删除所有底稿<br>';
						text += '9.删除所有标签、公式、底稿附件<br>';
						text += '10.删除所有计划程序<br>';
						text += '11.重设科目认定值、科目编制人<br>';
						text += '12.删除初步分析性复核</font></div>';
						// text = '未审报表、科目认定表、计划程序、实施程序、审定报表、附注、报告'
						resetSampling = true;
					}
					if (this.jsonData.r_unaudited) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注<br>';
						text += '4.删除最终分析性复核<br>';
						text += '5.删除现金流量表（直接法、公式法）、删除利润表及所有者权益变动表（手动录入的金额）<br>';
						text += '6.删除所有抽凭<br>';
						text += '7.删除所有实施程序<br>';
						text += '8.删除所有底稿<br>';
						text += '9.删除所有标签、公式、底稿附件<br>';
						text += '10.删除所有计划程序<br>';
						text += '11.重设科目认定值、科目编制人<br>';
						text += '12.删除初步分析性复核<br>';
						text += '13.删除未审报表<br>';
						text += '14.删除所有客户调整</font></div>';
						// text = '未审报表、科目认定表、计划程序、实施程序、审定报表、附注、报告'
						resetSampling = true;
					}
					if (this.jsonData.r_trialBalance) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注<br>';
						text += '4.删除最终分析性复核<br>';
						text += '5.删除现金流量表（直接法、公式法）、删除利润表及所有者权益变动表（手动录入的金额）<br>';
						text += '6.删除所有抽凭<br>';
						text += '7.删除所有实施程序<br>';
						text += '8.删除所有底稿<br>';
						text += '9.删除所有标签、公式、底稿附件<br>';
						text += '10.删除所有计划程序<br>';
						text += '11.重设科目认定值、科目编制人<br>';
						text += '12.删除初步分析性复核<br>';
						text += '13.删除未审报表<br>';
						text += '14.重设科目认定值、科目编制人<br>';
						text += '15.删除所有客户调整<br>';
						text += '16.删除TB科目、财务科目<br>';
						text += '17.删除试算平衡表<br>';
						text += '18.删除TB科目对照</font></div>';
						// text = '试算平衡表、未审报表、科目认定表、计划程序、实施程序、审定报表、附注、报告'
						resetSampling = true;
					}
					if (this.jsonData.r_materiality) {
						text = '<div style="height: 250px;overflow-y: auto"><font color="red">';
						text += '1.删除所有报备<br>';
						text += '2.删除所有报告<br>';
						text += '3.删除所有附注<br>';
						text += '4.删除最终分析性复核<br>';
						text += '5.删除现金流量表（直接法、公式法）、删除利润表及所有者权益变动表（手动录入的金额）<br>';
						text += '6.删除所有抽凭<br>';
						text += '7.删除所有实施程序<br>';
						text += '8.删除所有底稿<br>';
						text += '9.删除所有标签、公式、底稿附件<br>';
						text += '10.删除所有计划程序<br>';
						text += '11.重设科目认定值、科目编制人<br>';
						text += '12.删除初步分析性复核<br>';
						text += '13.删除未审报表<br>';
						text += '14.重设科目认定值、科目编制人<br>';
						text += '15.删除所有客户调整<br>';
						text += '16.删除TB科目、财务科目<br>';
						text += '17.删除试算平衡表<br>';
						text += '18.删除TB科目对照<br>';
						text += '19.删除重要性水平</font></div>';
						// text = '重要性水平、试算平衡表、未审报表、科目认定表、计划程序、实施程序、审定报表、附注、报告'
						resetSampling = true;
					}
					text = '此次重置底稿将会执行以下操作 <br>' + text + '<br>是否确定重置？';
					var _self = this;
					bdoConfirmBox('提示', text, function() {
						var param = {};
						var updateFlg = false;
						$.each(_self.jsonData, (key, value) => {
							if (key.startsWith('r_') && value !== false) {
								let key_ = key.replace('r_', '');
								param[key_] = value !== false ? (key => {
									updateFlg = true;
									return key.toUpperCase();
								})(key_) : value;
							} else if (!key.startsWith('r_')) {
								param[key] = value;
							}
						});
						param = {
							param1: _self.jsonData.autoId,
							param2: _self.jsonData.customerId,
							param3: _self.jsonData.projectId,
							param4: false,
							jsonData: JSON.stringify(param)
						};
						if(resetSampling){
							var textSampling = '<div style="height: 250px;overflow-y: auto"><font color="red">';
							textSampling += '再次确认此次重置是否需要删除抽凭<br>';
							textSampling += '点击确定将会重置选中的节点（包含抽凭）<br>';
							textSampling += '点击取消将会重置选中的节点（不含抽凭）</font></div>';
							bdoConfirmBox('提示', textSampling, function() {
								param.param4 = true;
								updateFlg && (data => {
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgProject.resetDg.json',
										// async : false,
										data: data,
										dataType: 'json',
										success(data) {
											if (data.success) {
												bdoInfoBox('提示', '正在重置中...请稍后查看！');
											} else {
												bdoErrorBox('失败', data.resultInfo.statusText);
											}
										}
									});
								})(param);
							}, function() {
								updateFlg && (data => {
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgProject.resetDg.json',
										// async : false,
										data: data,
										dataType: 'json',
										success(data) {
											if (data.success) {
												bdoInfoBox('提示', '正在重置中...请稍后查看！');
											} else {
												bdoErrorBox('失败', data.resultInfo.statusText);
											}
										}
									});
								})(param);
							});
						}else{
							updateFlg && (data => {
								$.ajax({
									type: 'post',
									url: 'dgCenter/DgProject.resetDg.json',
									// async : false,
									data: data,
									dataType: 'json',
									success(data) {
										if (data.success) {
											bdoInfoBox('提示', '正在重置中...请稍后查看！');
										} else {
											bdoErrorBox('失败', data.resultInfo.statusText);
										}
									}
								});
							})(param);
						}
					});
				},
				/**
				 * 取消按钮点击事件
				 */
				onCancelClick(event) {
					page.resetDgSider.hide();
				}

			},
			buttons: [{
				id: 'doResetDgBtn',
				icon: 'fa fa-power-off',
				style: 'btn-danger',
				text: '重置',
				typeAttr: {
					'v-on:click': 'onDoResetDgClick'
				}
			}, {
				id: 'cancelResetDgBtn',
				icon: 'fa-arrow-left',
				style: 'btn-warning',
				text: '取消',
				typeAttr: {
					'v-on:click': 'onCancelClick'
				}
			}],
			items: [{
				id: 'dgProcessGrop',
				html: (() => {
					let str = '<div class="form-material" style="">'
						+ template('./dgProcessHtml', {
							id: 'r_materiality',
							label: '重要性水平',
							label1: '重置内容：删除重要性水平'
						})
						+ template('./dgProcessHtml', {
							id: 'r_trialBalance',
							label: '试算平衡表',
							label1: '重置内容：删除试算平衡表、TB科目对照、TB科目'
						})
						+ template('./dgProcessHtml', {
							id: 'r_unaudited',
							label: '未审报表',
							label1: '重置内容：删除未审报表、所有客户调整'
						})
						+ template('./dgProcessHtml', {
							id: 'r_analysisReview',
							label: '初步分析性复核',
							label1: '重置内容：删除初步分析性复核'
						})
						+ template('./dgProcessHtml', {
							id: 'r_identified',
							label: '计划控制表-科目认定表',
							label1: '重置内容：重设科目认定值、科目编制人'
						})
						+ template('./dgProcessHtml', {
							id: 'r_programPlan',
							label: '计划控制表-计划程序',
							label1: '重置内容：删除所有计划程序'
						})
						+ template('./dgProcessHtml', {
							id: 'r_program',
							label: '获取审计证据-实施程序',
							label1: '重置内容：删除所有实施程序、底稿、标签、公式、底稿附件'
						})
						+ template('./dgProcessHtml', {
							id: 'r_sampling',
							label: '抽凭',
							label1: '重置内容：删除所有抽凭'
						})
						+ template('./dgProcessHtml', {
							id: 'r_audited',
							label: '审定报表',
							label1: '重置内容：删除现金流量表（直接法、公式法）、删除利润表及所有者权益变动表（手动录入的金额）'
						})
						+ template('./dgProcessHtml', {
							id: 'r_finalAnalysisReview',
							label: '最终分析性复核',
							label1: '重置内容：删除最终分析性复核'
						})
						+ template('./dgProcessHtml', {
							id: 'r_noteinfo',
							label: '附注',
							label1: '重置内容：删除所有附注'
						})
						+ template('./dgProcessHtml', {
							id: 'r_report',
							label: '报告',
							label1: '重置内容：删除所有报告'
						})
						+ template('./dgProcessHtml', {
							id: 'r_bbReport',
							label: '报备',
							label1: '重置内容：删除所有报备'
						})
						+ '</div>';
					return str;
				})(),
				rowspan: 1,
				colspan: 2,
				readonly: false
			}]
		}
		, dgHistoryVm: null
		, dgHistoryVmComp: {
			data: {
				dgHistoryData: [],
				currentPage: 0,
				refreshFlg: 0,
				param: {
					meneuId: window.sys_menuId,
					sqlId: 'DG00047',
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID,
					limit: 10,
					start: 0,
					page: 0
				},
				totalCount: 0
			},
			el: '#dgHistoryVm',
			mounted() {
				this.currentPage = 1;
			},
			computed: {
				lastPage() {
					return parseInt(this.totalCount / this.param.limit) + ((count, limit) => {
						if (count < limit || count % limit != 0) {
							return 1;
						}
						return 0;
					})(this.totalCount, this.param.limit);
				}
			},
			watch: {
				currentPage(newVal, oldVal) {
					this.param.page = newVal;
					this.param.start = (this.param.page - 1) * this.param.limit;
					this.fetch();
				}
			},
			methods: {
				fetch() {
					this.refreshFlg++;
					$('#dgHistoryVmBlock').addClass('block-opt-refresh');
					this.$nextTick(() => {
						let vm = this;
						this.refreshFlg++;
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							data: vm.param,
							// async : true,
							dataType: 'json',
							success(data) {
								if (data.success) {
									vm.dgHistoryData = data.data;
									vm.totalCount = data.totalCount;
									for (var i = 0; i < vm.dgHistoryData.length; i++) {
										switch (vm.dgHistoryData[i].actionName) {
											case '项目设置':
												vm.dgHistoryData[i].clsn = 'fa fa-cog list-timeline-icon bg-success';
												break;
											case '重置底稿':
												vm.dgHistoryData[i].clsn = 'fa fa-refresh list-timeline-icon bg-flat';
												break;
											case '重要性水平':
												vm.dgHistoryData[i].clsn = 'fa fa-database list-timeline-icon bg-smooth';
												break;
											case '试算平衡表':
												vm.dgHistoryData[i].clsn = 'fa fa-balance-scale list-timeline-icon bg-info';
												break;
											case '未审报表':
												vm.dgHistoryData[i].clsn = 'fa fa-calendar-minus-o list-timeline-icon bg-default';
												break;
											case '计划控制表':
												vm.dgHistoryData[i].clsn = 'fa fa-paperclip list-timeline-icon bg-amethyst';
												break;
											case '科目认定表':
												vm.dgHistoryData[i].clsn = 'si si-magic-wand list-timeline-icon bg-smooth';
												break;
											case '底稿编制':
												vm.dgHistoryData[i].clsn = 'fa fa-paint-brush list-timeline-icon bg-primary-light';
												break;
											case '初步分析性复核':
												vm.dgHistoryData[i].clsn = 'fa fa-cog list-timeline-icon bg-success';
												break;
											case '最终分析性复核':
												vm.dgHistoryData[i].clsn = 'fa fa-cog list-timeline-icon bg-success';
												break;
											case '审计程序':
												vm.dgHistoryData[i].clsn = 'fa fa-paperclip list-timeline-icon bg-amethyst';
												break;
											case '附注科目':
												vm.dgHistoryData[i].clsn = 'si si-note list-timeline-icon bg-default';
												break;
											case '附注':
												vm.dgHistoryData[i].clsn = 'si si-notebook list-timeline-icon bg-primary-light';
												break;
											case '凭证详细':
												vm.dgHistoryData[i].clsn = 'fa fa-chain-broken list-timeline-icon bg-primary-light';
												break;
											case '批注':
												vm.dgHistoryData[i].clsn = 'fa fa-pencil-square-o list-timeline-icon bg-success';
												break;
											case '实施程序':
												vm.dgHistoryData[i].clsn = 'fa fa-retweet list-timeline-icon bg-flat';
												break;
											case '底稿':
												vm.dgHistoryData[i].clsn = 'fa fa-file-excel-o list-timeline-icon bg-smooth';
												break;
											case '标签':
												vm.dgHistoryData[i].clsn = 'fa fa-tags list-timeline-icon bg-amethyst';
												break;
											case '错报汇总表':
												vm.dgHistoryData[i].clsn = 'fa fa-file-excel-o list-timeline-icon bg-smooth';
												break;
											case '附注与报表校验':
												vm.dgHistoryData[i].clsn = 'fa fa-file-excel-o list-timeline-icon bg-smooth';
												break;
											case '对外报告审批单':
												vm.dgHistoryData[i].clsn = 'fa fa-file-excel-o list-timeline-icon bg-smooth';
												break;
											case '文件':
												vm.dgHistoryData[i].clsn = 'fa fa-files-o list-timeline-icon bg-smooth';
												break;
											case '报告':
												vm.dgHistoryData[i].clsn = 'fa fa-file-word-o list-timeline-icon bg-smooth';
												break;
											case '审定报表':
												vm.dgHistoryData[i].clsn = 'fa fa-calendar-check-o list-timeline-icon bg-default';
												break;
											case '关联方导入':
												vm.dgHistoryData[i].clsn = 'fa fa-asterisk list-timeline-icon bg-city';
												break;
											case '合并范围':
												vm.dgHistoryData[i].clsn = 'fa fa-connectdevelop list-timeline-icon bg-flat';
												break;
											case '合并试算平衡表':
												vm.dgHistoryData[i].clsn = 'fa fa-delicious list-timeline-icon bg-default';
												break;
											case '抵消分录':
												vm.dgHistoryData[i].clsn = 'fa fa-i-cursor list-timeline-icon bg-city';
												break;
											case '合并报表':
												vm.dgHistoryData[i].clsn = 'fa fa-file-excel-o list-timeline-icon bg-default';
												break;
											case '合并附注':
												vm.dgHistoryData[i].clsn = 'fa fa-info-circle list-timeline-icon bg-default';
												break;
											case '项目克隆':
												vm.dgHistoryData[i].clsn = 'fa fa-clone list-timeline-icon bg-smooth';
												break;
											case '批量生成实施程序和底稿':
												vm.dgHistoryData[i].clsn = 'fa fa-send list-timeline-icon bg-smooth';
												break;
											case '抽凭':
												vm.dgHistoryData[i].clsn = 'fa fa-hand-lizard-o list-timeline-icon bg-default';
												break;
											case '报备':
												vm.dgHistoryData[i].clsn = 'fa fa-file-text list-timeline-icon bg-default';
												break;
											case '往来客户':
												vm.dgHistoryData[i].clsn = 'fa fa-users list-timeline-icon bg-default';
												break;
											case '银行':
												vm.dgHistoryData[i].clsn = 'fa fa-money list-timeline-icon bg-default';
												break;
										}
									}
								}
							},
							complete() {
								vm.$nextTick(() => {
									$('#dgHistoryVmBlock').removeClass('block-opt-refresh');
								});
								$.bdoUnLock(arguments[0], arguments[1]);
							}
						});
					});
				},
				first() {
					this.currentPage = 1;
				},
				next() {
					this.currentPage += 1;
					if (this.currentPage > this.lastPage) {
						this.currentPage = this.lastPage;
					}
				},
				previous() {
					this.currentPage -= 1;
					if (this.currentPage < 1) {
						this.currentPage = 1;
					}
				}
			}
		},changeMergeType(){
			let curMergeType = $('#mergeType').prop('checked');
			// 合并项目不能选择单体报表模板、单体项目不能选择合并报表模板
			// 单体、合并
			let reportTplStr = $('#tbReportTemplate').attr('data-typename');
			// 单体项目
			if(curMergeType == false && reportTplStr == '合并'){
				bdoInfoBox('提示', '单体项目不能选择合并报表模板！', 2500);
				$('#mergeType').prop('checked',!curMergeType);
				return;
			}
			// 合并项目
			if(curMergeType == true && reportTplStr == '单体'){
				bdoInfoBox('提示', '合并项目不能选择单体报表模板！', 2500);
				$('#mergeType').prop('checked',!curMergeType);
				return;
			}
			$('#saveSettingInfoBtn').click();
		}
	});

	function initSelectableCustomers(){
		// 自动完成（客户选择）
		let customerList = [];
		let customers = JSON.parse(userCustomers);
		for (let i = 0, data, value; i < customers.length; i++) {
			value = customers[i].value + '-' + customers[i].label;
			data  = customers[i].value;
			customerList.push({data, value});
		}
		$('#selCloneCustomerId').devbridgeAutocomplete({
			noCache: true,
			minChars: 0,
			autoSelectFirst: true,
			orientation: 'auto',
			maxHeight: 270,
			lookup: customerList, 		// 客户数据
			onSelect: function(suggestion) {
				let $this = $(this);
				if ( $this.attr('selected-value') === $('#selCloneCustomerId').val() ){
					return;
				}

				$this.attr('selected-value', suggestion.value);
				$this.attr('selected-data', suggestion.data);

				$('#selCloneProjectId').val('');
				$('#set_clone_auditStartDate').val('');
				$('#set_clone_auditEndDate').val('');
				initSelectableProjects(suggestion.data);
			}
		});
	}

	function initSelectableProjects(selectedCustomerId){
		// 自动完成（项目选择）
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00270',
				param1: selectedCustomerId,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				let projectList = data.success ? data.data : [];
				$('#selCloneProjectId').devbridgeAutocomplete({
					noCache: true,
					minChars: 0,
					autoSelectFirst: true,
					orientation: 'auto',
					maxHeight: 270,
					lookup: projectList, 		// 项目数据
					onSelect: function(suggestion) {
						let $this = $(this);
						$this.attr('selected-value', suggestion.value);
						$this.attr('selected-data', suggestion.data);
						showCloneProjectAuditInfo(suggestion.data); // 显示审计期间
					}
				});

			}
		});

	}
	// 显示被克隆项目审计期间
	function showCloneProjectAuditInfo(projectId) {
		$.ajax({
			type: 'post',
			url: 'dgCenter/CustomerProjectSet.getProjectInfo.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: projectId,
				param25: 'CHANGE_PROJECT',     // 不要提示重置中
			},
			dataType: 'json',
			success: function(data) {
				if (data.success && data.data && data.data.length) {
					let oData = data.data[0];
					$('#set_clone_auditStartDate').val(oData.auditStartDate);
					$('#set_clone_auditEndDate').val(oData.auditEndDate);
					$('#tbReportTemplate').attr('data-content');
					$('#set_clone_tbReportTpl').val(oData.ruleName);
					if(oData.isSame != null && !oData.isSame){
						var displaytext = '现金流量表克隆需<font color="red">相同的报表类型</font><br>如同为上市公司模板、一般企业模板';
						bdoInfoBox('提示', displaytext, 15000);
					}
				} else {
					bdoInfoBox('提示', data.resultInfo.statusText);
				}
			}
		});
	}
	$('input[name="c_checked"]').on('click', function(event){
		var id = $(event.target).attr('id');
		if(id == 'c_programPlan'){
			if (!$(event.target).is(":checked")){
				$('#c_program').prop('checked', false);
				$('#c_dg_formula_0').prop('checked', false);
				$('#c_dg_formula_1').prop('checked', false);
				$('#c_dg_value').prop('checked', false);
				$('#c_dg_attach').prop('checked', false);
				
				$('#c_program').attr('disabled', true);
				$('#c_dg_formula_0').attr('disabled', true);
				$('#c_dg_formula_1').attr('disabled', true);
				$('#c_dg_value').attr('disabled', true);
				$('#c_dg_attach').attr('disabled', true);
				
				$('#c_program').parent().css('cursor', 'not-allowed');
				$('#c_dg_formula_0').parent().css('cursor', 'not-allowed');
				$('#c_dg_formula_1').parent().css('cursor', 'not-allowed');
				$('#c_dg_value').parent().css('cursor', 'not-allowed');
				$('#c_dg_attach').parent().css('cursor', 'not-allowed');
			}else{
				$('#c_program').prop('checked', true);
				$('#c_dg_formula_0').prop('checked', true);
				$('#c_dg_formula_1').prop('checked', true);
				$('#c_dg_value').prop('checked', true);
				$('#c_dg_attach').prop('checked', true);
				
				$('#c_program').attr('disabled', false);
				$('#c_dg_formula_0').attr('disabled', false);
				$('#c_dg_formula_1').attr('disabled', false);
				$('#c_dg_value').attr('disabled', false);
				$('#c_dg_attach').attr('disabled', false);
				
				$('#c_program').parent().css('cursor', 'pointer');
				$('#c_dg_formula_0').parent().css('cursor', 'pointer');
				$('#c_dg_formula_1').parent().css('cursor', 'pointer');
				$('#c_dg_value').parent().css('cursor', 'pointer');
				$('#c_dg_attach').parent().css('cursor', 'pointer');
			}
		} else if(id == 'c_program'){
			if (!$(event.target).is(":checked")){
				$('#c_dg_formula_0').prop('checked', false);
				$('#c_dg_formula_1').prop('checked', false);
				$('#c_dg_value').prop('checked', false);
				$('#c_dg_attach').prop('checked', false);
				
				$('#c_dg_formula_0').attr('disabled', true);
				$('#c_dg_formula_1').attr('disabled', true);
				$('#c_dg_value').attr('disabled', true);
				$('#c_dg_attach').attr('disabled', true);
				
				$('#c_dg_formula_0').parent().css('cursor', 'not-allowed');
				$('#c_dg_formula_1').parent().css('cursor', 'not-allowed');
				$('#c_dg_value').parent().css('cursor', 'not-allowed');
				$('#c_dg_attach').parent().css('cursor', 'not-allowed');
			}else{
				$('#c_dg_formula_0').prop('checked', true);
				$('#c_dg_formula_1').prop('checked', true);
				$('#c_dg_value').prop('checked', true);
				$('#c_dg_attach').prop('checked', true);
				
				$('#c_dg_formula_0').attr('disabled', false);
				$('#c_dg_formula_1').attr('disabled', false);
				$('#c_dg_value').attr('disabled', false);
				$('#c_dg_attach').attr('disabled', false);
				
				$('#c_dg_formula_0').parent().css('cursor', 'pointer');
				$('#c_dg_formula_1').parent().css('cursor', 'pointer');
				$('#c_dg_value').parent().css('cursor', 'pointer');
				$('#c_dg_attach').parent().css('cursor', 'pointer');
			}
		} else if(id == 'c_cashFlow_option1'){
			if (!$(event.target).is(":checked")){
				$('#c_cashFlow_option2').prop('checked', false);
				
				$('#c_cashFlow_option2').attr('disabled', true);
				
				$('#c_cashFlow_option2').parent().css('cursor', 'not-allowed');
			}else{
				$('#c_cashFlow_option2').prop('checked', true);
				
				$('#c_cashFlow_option2').attr('disabled', false);
				
				$('#c_cashFlow_option2').parent().css('cursor', 'pointer');
			}
		}
	});
	// ---------------------
	// 事件绑定
	// ---------------------
	// 克隆
	$('#set_clone').click(function() {
		let cloneCustomerId = $('#selCloneCustomerId').attr('selected-data'); // 选择的客户编号
		if ( !cloneCustomerId ){
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ( $('#selCloneCustomerId').val() != $('#selCloneCustomerId').attr('selected-value') ){
			bdoInfoBox('提示', '填写的客户不存在');
			return;
		}
		let cloneProjectId = $('#selCloneProjectId').attr('selected-data'); // 选择的项目编号
		if ( !cloneProjectId  ){
			bdoInfoBox('提示', '请选择项目');
			return;
		}
		if ( $('#selCloneProjectId').val() != $('#selCloneProjectId').attr('selected-value') ){
			bdoInfoBox('提示', '填写的项目不存在');
			return;
		}
		if(cloneCustomerId == projectInfo.customerId && cloneProjectId == projectInfo.projectId){
			bdoInfoBox('提示', '当前项目不能克隆当前项目');
			return;
		}
		var infoParam = {};
		$.each($('input[name="c_checked"]:checkbox'), function() {
			if (this.checked) {
				infoParam[this.id] = 1;
			}else{
				infoParam[this.id] = 0;
			}
		});
		bdoInProcessingBox('克隆中'); // 克隆时间可能较长，等待至结束
		$.ajax({
			type: 'post',
			url: 'dgCenter/CustomerProjectSet.cloneProject.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: cloneCustomerId,
				param2: cloneProjectId,
				param3: JSON.stringify(infoParam)
			},
			bdolxLoader: false,		// 禁用旋转等待
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					$('#cloneProjectModal').modal('hide');
					bdoInfoBox('正在克隆。。请稍候。。');
					// $('#m40000049').click();
				} else {
					bdoInfoBox('提示', data.resultInfo.statusText);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error('克隆失败', jqXHR, textStatus, errorThrown);
				bdoErrorBox('失败', '克隆失败');
			}
		});
	});

	// 变更年份 重置试算平衡表
	function resetTb(changeYear, autoId) {

		if (changeYear) {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgProject.changeYearReset.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: autoId,
					refreshFlg: '1'
				},
				success: function (data) {

				}
			});
		}
	}

	// $('#projectIdMergeText').parents('tr').hide(); // 总是不显示（旧的项目合并范围做法）
	// $('#mergeProjectRow').parents('tr').hide(); // 暂时不显示
	// 是否合并项目
	// $('#mergeType').parent().hide();
	// 增加父项目 按钮
	// $('#openParentProjectModal').parent().hide();

	return page;
}