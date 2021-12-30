
SamplingList = (agrs) => {
	var _template
		, mount
		, listener
		, tabPage;
	_template = agrs.template || tplLoader('dgCenter/html/dg/samplingList.html');
	agrs.template = _template;
	var tempOldVoucherId;
	var color1 = '#53f9f9';
	var color2 = '#FF8800';
	var color = '#53f9f9';
	var dataSource = '1';
	var samplingId = '';
	var calculationParam;
	var samplingCount = 0;
	var initData;
	var cullData;//剔除数据
	var subjectentryId;//结果id
	var uploadSubjectentryId;//上传附件id
	var uploadOldVoucherId;//上传附件凭证号
	var relateFile;//关联的附件
	var permissions;//权限
	var relateSamplingId = '';
	var relateType = '';
	var samplingCaculation_calAmount = 0;
	var tempTotalSamplingCount;
	var curSamplingParam = {};
	var samplingType = '1';
	var sampleModeActual = '1';
	//客户 日期设置
	//getCustomerForImport('account_customerId_model');
	//获取客户下拉
	// 客户
	getUserCustomers('samplingList_customerId');
	//getUserCustomers('samplingAdd_customerId_model');
	getUserCustomers('assItemSame_customerId');
	getUserCustomers('samplistResult_customerId');
	var myDate = new Date();
	var accyear = myDate.getFullYear();//年
	//$('#samplingList_startDate').val(accyear - 1);
	//$('#samplingSet_startDate').val(accyear - 1);
	
	/** table 属性 */
	var accdetail_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {

				sqlId: 'DG10001',
				menuId: window.sys_menuId,
//				param1: $('#samplingList_customerId').val(),
				param2: $('#samplingList_name').val(),
				param3: curSamplingParam.projectId,
				//param4: CUR_USERID,
				lockCustomerId: curSamplingParam.customerId
			}
		},
		tableParam: {
			select: true,
			scrollX: false,
			scrollY: false,
			//scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			bdolxLoader: true,
			//order: [1, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						if(CUR_USERID == row.__uuploadUser.userId){
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="samplingSetBtn" data-placement="top" title="抽凭" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>&nbsp;';
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="samplingResultBtn" data-placement="top" title="抽凭结果" data-toggle="tooltip"><i class="fa fa-eye"></i></button>&nbsp;';
							renderStr += '<button class="btn btn-xs btn-danger" type="button" name="samplingDeleteBtn" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						}else{
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="samplingResultBtn" data-placement="top" title="抽凭结果" data-toggle="tooltip"><i class="fa fa-eye"></i></button>&nbsp;';
						}
						return renderStr;
					}
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '抽凭方式',
					name: 'sampleMethodName',
					data: 'sampleMethodName',
					width: '100px'
				}, {
					targets: 3,
					orderable: false,
					className: 'text-center',
					title: '抽凭名称',
					name: 'sampleName',
					data: 'sampleName',
					width: '60px'
				}, {
					targets: 4,
					orderable: false,
					className: 'text-center',
					title: '抽凭人',
					name: '__uuploadUserName',
					data: '__uuploadUserName',
					width: '60px'
				}, {
					targets: 5,
					orderable: false,
					className: 'text-center',
					title: '抽凭时间',
					name: 'sampleTime',
					data: 'sampleTime',
					width: '60px',
					render: function(data, type, row, meta) {
						return getMyDate(data);
					}

				}, {
					targets: 6,
					orderable: false,
					className: 'text-center',
					title: '抽凭数量',
					name: 'sampleCount',
					data: 'sampleCount',
					width: '50px'
				}, {
					targets: 7,
					orderable: false,
					className: 'hidden',
					title: '抽凭状态',
					name: 'sampleStatus',
					data: 'sampleStatus',
					width: '100px',
					render: function(data, type, row, meta) {
						switch (data) {
							case '0' :
								return '等待抽样';
							case '1' :
								return '查询范围完成';
							case '2' :
								return '样本量计算完成';
							case '3' :
								return '抽样完成';
							default :
								return '未知';
						}
					}
				}
			]
		}
	};
	

	/** table 属性 */
	var sampleDetail_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.findSamplingSetData.json',
			urlparam: {

				sqlId: 'FINCP100001',
				menuId: window.sys_menuId,
				param1: $('#samplingSet_startDate').val(),
				param2: $('#samplingSet_endDate').val(),
				param3: '',
				param4: '',
				param5: $('#samplingSet_typeId').val(),
				param6: $('#samplingSet_voucherId').val(),
				param7: $('#samplingSet_summery').val(),
				param8: $('#samplingSet_amountStart').val(),
				param9: $('#samplingSet_amountEnd').val(),
				param10: '',
				param11: $('#samplingSet_subjectid').val(),
				param12: '',
				param13: '',
				param14: samplingId,
				param15: $('#samplingSet_dataResource').val(),
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			scrollX: true,
			scrollY: false,
			autoWidth: false,
			//order: [2, 'asc'],
			pageLength: 30,
			createdRow(row, data, dataIndex) {
				if(tempOldVoucherId != data.oldVoucherId){
					if(color == color1){
						color = color2;
					}else{
						color = color1;
					}
					tempOldVoucherId = data.oldVoucherId;
				}
				$(row).children("td").eq(1).css({"background-color":color});
				$(row).children("td").eq(2).css({"background-color":color});
				$(row).children("td").eq(3).css({"background-color":color});
				if(cullData != ''){
					var voucherId = cullData.voucherId + '';
					var voucherIdArray = voucherId.split(',');
					if(voucherIdArray.indexOf(data.voucherId + '') != -1){
						$(row).css({"color":'red'});
					}
				}
			},
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '80px',
					filter: {
						type: 'date'
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: '30px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '10px'
				}, {
					targets: 4,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px'
				}, {
					targets: 5,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'

				}, {
					targets: 6,
					className: 'text-left',
					title: '科目全路径',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '200px'
				}, {
					targets: 7,
					className: 'text-right',
					title: '借方发生金额',
					name: 'debitValue',
					data: 'debitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-right',
					title: '贷方发生金额',
					name: 'crebitValue',
					data: 'crebitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};
	/** table 属性 */
	var sampleCompany_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/Sampling.querySamplingCompany.json',
			urlparam: {

				sqlId: 'FINCP100001',
				menuId: window.sys_menuId,
				param1: $('#samplingSet_startDate').val(),
				param2: $('#samplingSet_endDate').val(),
				param3: '',
				param4: '',
				param5: '',
				param6: '',
				param7: '',
				param8: '',
				param9: '',
				param10: '',
				param11: $('#samplingSet_subjectid').val(),
				param12: '',
				param13: '',
				param14: samplingId,
				param15: $('#samplingSet_dataResource').val(),
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			scrollX: true,
			scrollY: false,
			autoWidth: false,
			//order: [2, 'asc'],
			pageLength: 30,
			createdRow(row, data, dataIndex) {
				if(tempOldVoucherId != data.oldVoucherId){
					if(color == color1){
						color = color2;
					}else{
						color = color1;
					}
					tempOldVoucherId = data.oldVoucherId;
				}
				$(row).children("td").eq(1).css({"background-color":color});
				$(row).children("td").eq(2).css({"background-color":color});
				$(row).children("td").eq(3).css({"background-color":color});
				/*if(cullData != ''){
					var voucherId = cullData.voucherId + '';
					var voucherIdArray = voucherId.split(',');
					if(voucherIdArray.indexOf(data.voucherId + '') != -1){
						$(row).css({"color":'red'});
					}
				}*/
			},
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '80px',
					filter: {
						type: 'date'
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: '30px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '10px'
				}, {
					targets: 4,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px'
				}, {
					targets: 5,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'

				}, {
					targets: 6,
					className: 'text-left',
					title: '科目全路径',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '200px'
				}, {
					targets: 7,
					className: 'text-right',
					title: '借方发生金额',
					name: 'debitValue',
					data: 'debitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-right',
					title: '贷方发生金额',
					name: 'crebitValue',
					data: 'crebitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};
	/** table 属性 */
	var assItemDetail_view = {
		localParam: {
			tabNum: true,
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {

				sqlId: 'FA30069',
				menuId: window.sys_menuId,
				param1: '',
				param2: '',
				param3: '',
				param4: '',
				param5: '',
				param6: '',
				param7: '',
				param8: $('#samplingSet_amountStart').val(),
				param9: $('#samplingSet_amountEnd').val(),
				param10: '',
				param11: $('#samplingSet_subjectid').val(),
				param14: samplingId,
				param15: $('#samplingSet_dataResource').val(),
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			//order: [2, 'asc'],
			pageLength: 30,
			createdRow(row, data, dataIndex) {
				if(cullData != ''){
					var assItemId = cullData.assItemId + '';
					var assItemIdArray = assItemId.split(',');
					if(assItemIdArray.indexOf(data.subjectId + '-' + data.assItemId) != -1){
						$(row).css({"color":'red'});
					}
				}
			},
			columnDefs: [
				{
					targets: 1,
					className: 'text-center',
					title: '勾选',
					name: 'id',
					data: 'id',
					width: '15px',
					render: function(data, type, row, meta) {
						var renderStr = '<input type="checkbox" name="assItemSelect" value="' + row.subjectId + ',' + row.assItemId + '"></input>';
						return renderStr;
					}

				}, {
					targets: 2,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '150px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '核算项目编号',
					name: 'assItemId',
					data: 'assItemId',
					width: '200px'
				}, {
					targets: 4,
					className: 'text-left',
					title: '核算项目名称',
					name: 'fullName',
					data: 'fullName',
					width: '250px'
				}, {
					targets: 5,
					className: 'text-center',
					title: '币种',
					name: 'currency',
					data: 'currency',
					width: '30px'
				}, {
					targets: 6,
					className: 'text-center',
					title: '方向',
					name: 'qcWay',
					data: 'qcWay',
					width: '30px'

				}, {
					targets: 7,
					className: 'text-right',
					title: '期初余额',
					name: 'remainF',
					data: 'remainF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitOccF',
					data: 'debitOccF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 9,
					className: 'text-right',
					title: '贷方发生额',
					name: 'creditOccF',
					data: 'creditOccF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 10,
					className: 'text-right',
					title: '期末余额',
					name: 'balanceF',
					data: 'balanceF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};

	/** table 属性 */
	var accountDetail_view = {
		localParam: {
			tabNum: true,
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {

				sqlId: 'FA30070',
				menuId: window.sys_menuId,
				param1: '',
				param2: '',
				param3: '',
				param4: '',
				param5: '',
				param6: '',
				param7: '',
				param8: $('#samplingSet_amountStart').val(),
				param9: $('#samplingSet_amountEnd').val(),
				param10: '',
				param11: $('#samplingSet_subjectid').val(),
				param14: samplingId,
				param15: $('#samplingSet_dataResource').val(),
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			//order: [2, 'asc'],
			pageLength: 30,
			createdRow(row, data, dataIndex) {
				if(cullData != ''){
					var subjectId = cullData.subjectId + '';
					var subjectIdArray = subjectId.split(',');
					if(subjectIdArray.indexOf(data.subjectId+'') != -1){
						$(row).css({"color":'red'});
					}
				}
			},
			columnDefs: [
				{
					targets: 1,
					className: 'text-center',
					title: '勾选',
					name: 'id',
					data: 'id',
					width: '15px',
					render: function(data, type, row, meta) {
						var renderStr = '<input type="checkbox" name="accountSelect" value="' + row.subjectId + '"></input>';
						return renderStr;
					}

				}, {
					targets: 2,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '150px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '科目名称',
					name: 'fullName',
					data: 'fullName',
					width: '250px'
				}, {
					targets: 4,
					className: 'text-center',
					title: '币种',
					name: 'currency',
					data: 'currency',
					width: '30px'
				}, {
					targets: 5,
					className: 'text-center',
					title: '方向',
					name: 'qcWay',
					data: 'qcWay',
					width: '30px'

				}, {
					targets: 6,
					className: 'text-right',
					title: '期初余额',
					name: 'remainF',
					data: 'remainF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 7,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitOccF',
					data: 'debitOccF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-right',
					title: '贷方发生额',
					name: 'creditOccF',
					data: 'creditOccF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 9,
					className: 'text-right',
					title: '期末余额',
					name: 'balanceF',
					data: 'balanceF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};
	
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy-mm-dd', //日期显示格式
		minViewMode: 0
	});

	//时间毫秒数转时间
	function getMyDate(str) {
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oHour = oDate.getHours(),
			oMin = oDate.getMinutes(),
			oSen = oDate.getSeconds(),
			oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
		return oTime;

	}

	//补0操作
	function getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + num;
		}
		return num;
	}
	
	mount = () => {
		$(agrs.region).empty().append(_template);
		$('#assItemSame_yyyy').val(accyear - 1);
		$('#samplingSet_dataResource').html(ComboLocalDicOption(false, '抽样数据来源'));
		//$('#samplingSet_typeId').html(ComboLocalDicOption(true, '凭证字'));
		$('#samplingList_method').html(ComboLocalDicOption(false, '抽凭方式'));
		$('#samplingSet_dataResource').val("1");
		$('#samplingCaculation_risk').html(ComboLocalDicOption(false, '错报风险等级'));
		$('#samplingCaculation_control').html(ComboLocalDicOption(false, '控制测试获取的保证程度'));
		$('#samplingCaculation_analysis').html(ComboLocalDicOption(false, '实质性分析程序获取的保证程度'));
		$('#samplingCaculation_pledge').html(ComboLocalDicOption(false, '从其他OSP获取的保证程度'));
		$('#samplingCaculation_variable').html(ComboLocalDicOption(false, '是否能够应对样本总体的变量因素'));
		$('#dgSamplingInfo_sampleMethod').html(ComboLocalDicOption(true, '抽样方式'));
		$('#samplingInfoEdit_auditResult').html(ComboLocalDicOption(true, '抽凭结论'));
		$('#dgSamplingInfo_isRelated').html(ComboLocalDicOption(true, '是否'));
		$('#samplingSet_samplingType').html(ComboLocalDicOption(false, '抽凭维度'));
		$('#samplingList_mode_default').html(ComboLocalDicOption(false, '抽凭模式'));
		$('#samplingList_mode_actual').html(ComboLocalDicOption(false, '抽凭模式'));
		$('#samplingCaculation_dataTest').html(ComboLocalDicOption(false, '从其他OSP获取的保证程度'));
		$('#samplingCaculation_smallScaleRate').html(ComboLocalDicOption(false, '小规模总体调整'));
		$('#samplingCaculation_lowestLevel').html(ComboLocalDicOption(true, '最低样本量'));
		$('#samplingCaculation_tocPlan').html(ComboLocalDicOption(false, '是否'));
		$('#dgSamplingInfo_dateType').val('2');
		$('#dgSamplingInfo_startDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: 'yyyy', //日期显示格式
			minViewMode: 2
		});
		$('#dgSamplingInfo_endDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: 'yyyy', //日期显示格式
			minViewMode: 2
		});
		$('#dgSamplingInfo_startDate').val(window.CUR_PROJECT_ACC_YEAR);
		$('#dgSamplingInfo_endDate').val(window.CUR_PROJECT_ACC_YEAR);
		$('#samplingSet_dateType').val('2');
		$('#samplingSet_startDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: 'yyyy', //日期显示格式
			minViewMode: 2
		});
		$('#samplingSet_endDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: 'yyyy', //日期显示格式
			minViewMode: 2
		});
		$('#samplingSet_startDate').val(window.CUR_PROJECT_ACC_YEAR);
		$('#samplingSet_endDate').val(window.CUR_PROJECT_ACC_YEAR);
		$('#samplistRelate_dateType').val('2');
		$('#samplistRelate_startDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: 'yyyy', //日期显示格式
			minViewMode: 2
		});
		$('#samplistRelate_endDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: 'yyyy', //日期显示格式
			minViewMode: 2
		});
		$('#samplistRelate_startDate').val(window.CUR_PROJECT_ACC_YEAR);
		$('#samplistRelate_endDate').val(window.CUR_PROJECT_ACC_YEAR);
		
		$('#samplistResult_dataResource').html(ComboLocalDicOption(false, '抽样数据来源'));
		$('#samplistResult_typeId').html(ComboLocalDicOption(true, '凭证字'));
		if(typeof $('.js-tree-collapsed').treeview(true).getSelected == "function"){
			let node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
			$('#samplingIndex').text('【' + node.extraOptions.indexId + '】');
		}
		if(agrs.data.samplingSource == '1'){
			$('#samplingIsShow').css('display', 'none');
			curSamplingParam.customerId = agrs.data.customerId;
			curSamplingParam.projectId = agrs.data.projectId;
			curSamplingParam.yyyy = agrs.data.voucherDate.substr(0, 4);
			curSamplingParam.serail = agrs.data.serail;
			$('#samplingList_method').attr('disabled', true);
			$("#samplingList_customerId option[value="+agrs.data.customerId+"]").prop("selected", true);
			$("#assItemSame_customerId option[value="+agrs.data.customerId+"]").prop("selected", true);
			$("#samplistResult_customerId option[value="+agrs.data.customerId+"]").prop("selected", true);
			$('#samplingSet_dateType').val('0');
			$('#samplingSet_startDate').val(agrs.data.voucherDate);
			$('#samplingSet_endDate').val(agrs.data.voucherDate);
			$('#samplingSet_dateType').attr('disabled', true);
			$('#samplingSet_startDate').attr('disabled', true);
			$('#samplingSet_endDate').attr('disabled', true);
			$('#samplingSet_subjectid').val(agrs.data.subjectId);
			$('#samplingSet_common_subjectid').val(agrs.data.subjectId);
			$('#samplingSet_typeId').val(agrs.data.typeId);
			$('#samplingSet_voucherId').val(agrs.data.oldVoucherId);
			$('#samplingSet_subjectid').attr('disabled', true);
			$('#samplingSet_common_subjectid').attr('disabled', true);
			$('#samplingSet_typeId').attr('disabled', true);
			$('#samplingSet_voucherId').attr('disabled', true);
		}else{
			curSamplingParam.customerId = window.CUR_CUSTOMERID;
			curSamplingParam.projectId = window.CUR_PROJECTID;
			curSamplingParam.yyyy = window.CUR_PROJECT_ACC_YEAR;
		}
		accdetail_view.localParam.urlparam.param3 = curSamplingParam.projectId;
		accdetail_view.localParam.urlparam.lockCustomerId = curSamplingParam.customerId;
		sampleDetail_view.localParam.urlparam.lockCustomerId = curSamplingParam.customerId;
		sampleDetail_view.localParam.urlparam.lockYyyy = curSamplingParam.yyyy;
		sampleDetail_view.localParam.urlparam.lockProjectId = curSamplingParam.projectId;
		sampleCompany_view.localParam.urlparam.lockCustomerId = curSamplingParam.customerId;
		sampleCompany_view.localParam.urlparam.lockYyyy = curSamplingParam.yyyy;
		sampleCompany_view.localParam.urlparam.lockProjectId = curSamplingParam.projectId;
		BdoDataTable('samplingListTable', accdetail_view);
		//$('#reviewIndex').text('【' + agrs.type + '】');//初步分析性复核添加索引号
		OneUI.initHelper('slimscroll');
	};

	mount();

	/** 搜索按钮 */
	$('#btn_samplingList_search').click(function() {
		
		accdetail_view.localParam.urlparam.param2 =  $('#samplingList_name').val();
		BdoDataTable('samplingListTable', accdetail_view);

		$('#samplingListTable').on('xhr.dt', function(e, settings, json, xhr) {

			/*let tableId = 'account_table';*/
			if (json.recordsTotal > 0) {
				$('#samplingList_export').css('display', 'block');
			} else {
				$('#samplingList_export').css('display', 'none');
			}

		});
	});
	/** 搜索按钮 */
	$('#btn_samplingSet_company_search').click(function() {
		searchSamplingSetCompany();
	});
	/** 搜索按钮 */
	$('#btn_samplingSet_search').click(function() {
		searchSamplingCull(searchSamplingSet);
	});
	//查询剔除
	function searchSamplingCull(callback){
		if ($('#samplingSet_dataResource').val() == '') {
			$('#samplingSet_dataResource').focus();
			bdoInfoBox('提示', '请选择数据来源');
			return;
		}
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
			type: 'post',
			data: {
				sqlId: 'DG10003',
				menuId: window.sys_menuId,
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId : curSamplingParam.projectId,
				param1: samplingId,
				param2: $('#samplingSet_dataResource').val(),
				param3: curSamplingParam.projectId,
				param4: '<lx2>'
			},
			dataType: 'json',
			success: function(data) {
				if (data && data.success && data.data ) {
					if(data.data.length > 0){
						cullData = data.data[0];
					}else{
						cullData = '';
					}
					callback();
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}
	//查询范围
	function searchSamplingSet(){

		if ($('#samplingSet_endDate').val() == '' && $('#samplingSet_startDate').val() != '') {
			$('#samplingSet_endDate').val($('#samplingSet_startDate').val());
		}

		if ($('#samplingSet_startDate').val() == '' && $('#samplingSet_endDate').val() != '') {
			$('#samplingSet_startDate').val($('#samplingSet_endDate').val());
		}

		if ($('#samplingSet_startDate').val() == '') {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '请选择凭证开始日期');
			return;
		}

		if ($('#samplingSet_endDate').val() == '') {
			$('#samplingSet_endDate').focus();
			bdoInfoBox('提示', '请选择凭证结束日期');
			return;
		}
		if ($('#samplingSet_startDate').val() > $('#samplingSet_endDate').val()) {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '凭证结束日期不能小于凭证开始日期');
			return;
		}
		if($('#samplingSet_startDate').val().substr(0, 4) != $('#samplingSet_endDate').val().substr(0, 4)){
			bdoInfoBox('提示', '凭证日期必须是同一年');
			return;
		}
		/*if($('#samplingSet_startDate').val().substr(0, 4) != curSamplingParam.yyyy){
			bdoInfoBox('提示', '凭证日期必须选择账套年'+curSamplingParam.yyyy);
			return;
		}*/
		if ($('#samplingSet_subjectid').val() == '') {
			bdoInfoBox('提示', '请选择科目');
			return;
		}
		if ($('#samplingSet_common_subjectid').val() == '') {
			bdoInfoBox('提示', '请选择科目');
			return;
		}
		var samplingSet_amountStart = 0;
		var samplingSet_amountEnd = 0;
		if($('#samplingSet_amountStart').val() != ''){
			samplingSet_amountStart = parseFloat($('#samplingSet_amountStart').val())
		}
		if($('#samplingSet_amountEnd').val() != ''){
			samplingSet_amountEnd = parseFloat($('#samplingSet_amountEnd').val())
		}
		if (samplingSet_amountStart > samplingSet_amountEnd && $('#samplingSet_amountEnd').val() != '') {
			$('#samplingSet_amountStart').focus();
			bdoInfoBox('提示', '开始金额不能大于结束金额');
			return;
		}
		var samplingSet_cullAmountStart = 0;
		var samplingSet_cullAmountEnd = 0;
		if($('#samplingSet_cullAmountStart').val() != ''){
			samplingSet_cullAmountStart = parseFloat($('#samplingSet_cullAmountStart').val())
		}
		if($('#samplingSet_cullAmountEnd').val() != ''){
			samplingSet_cullAmountEnd = parseFloat($('#samplingSet_cullAmountEnd').val())
		}
		if (samplingSet_cullAmountStart > samplingSet_cullAmountEnd && $('#samplingSet_cullAmountEnd').val() != '') {
			$('#samplingSet_cullAmountStart').focus();
			bdoInfoBox('提示', '开始金额不能大于结束金额');
			return;
		}
		if($('#samplingSet_cullReason').val() == '' && ($('#samplingSet_cullAmountType').val() != '' || $('#samplingSet_cullAmountStart').val() != '' || $('#samplingSet_cullAmountEnd').val() != '' || $('#samplingSet_subjectid_cull').val() != '' || $('#samplingSet_assitemid_cull').val() != '')){
			$('#samplingSet_cullReason').focus();
			bdoInfoBox('提示', '请填写剔除原因');
			return;
		}
		if($('#samplingSet_dataResource').val() == '1'){
			sampleDetail_view.localParam.urlparam.lockCustomerId = curSamplingParam.customerId;
			sampleDetail_view.localParam.urlparam.param1 = $('#samplingSet_startDate').val().substr(0, 4);
			sampleDetail_view.localParam.urlparam.param2 = $('#samplingSet_endDate').val().substr(0, 4);
			if($('#samplingSet_dateType').val() == '0'){
				sampleDetail_view.localParam.urlparam.param3 = $('#samplingSet_startDate').val();
				sampleDetail_view.localParam.urlparam.param4 = $('#samplingSet_endDate').val();
				sampleDetail_view.localParam.urlparam.param12 = '';
				sampleDetail_view.localParam.urlparam.param13 = '';
			}else if($('#samplingSet_dateType').val() == '1'){
				sampleDetail_view.localParam.urlparam.param3 = '';
				sampleDetail_view.localParam.urlparam.param4 = '';
				sampleDetail_view.localParam.urlparam.param12 = $('#samplingSet_startDate').val().substr(5, 6);
				sampleDetail_view.localParam.urlparam.param13 = $('#samplingSet_endDate').val().substr(5, 6);
			}else{
				sampleDetail_view.localParam.urlparam.param3 = '';
				sampleDetail_view.localParam.urlparam.param4 = '';
				sampleDetail_view.localParam.urlparam.param12 = '';
				sampleDetail_view.localParam.urlparam.param13 = '';
			}

			sampleDetail_view.localParam.urlparam.param5 = $('#samplingSet_typeId').val();
			sampleDetail_view.localParam.urlparam.param6 = $('#samplingSet_voucherId').val();
			sampleDetail_view.localParam.urlparam.param7 = $('#samplingSet_summery').val();
			sampleDetail_view.localParam.urlparam.param8 = $('#samplingSet_amountStart').val();
			sampleDetail_view.localParam.urlparam.param9 = $('#samplingSet_amountEnd').val();
			//if($('#samplingSet_amountStart').val() == '' && $('#samplingSet_amountEnd').val() == ''){
			//	sampleDetail_view.localParam.urlparam.param10 = '';
			//}else{
				sampleDetail_view.localParam.urlparam.param10 = $('#samplingSet_amountType').val();
			//}
			sampleDetail_view.localParam.urlparam.param11 = $('#samplingSet_subjectid').val();
			if($('#samplingSet_subjectid_cull').val() != ''){
				var cullSubjectId = "'" + $('#samplingSet_subjectid_cull').val().replace(/,/g,"','") + "'";
				sampleDetail_view.localParam.urlparam.param14 = cullSubjectId;
			}else{
				sampleDetail_view.localParam.urlparam.param14 = '';
			}
			sampleDetail_view.localParam.urlparam.param15 = $('#samplingSet_dataResource').val();
			sampleDetail_view.localParam.urlparam.param16 = $('#samplingSet_cullAmountStart').val();
			sampleDetail_view.localParam.urlparam.param17 = $('#samplingSet_cullAmountEnd').val();
			sampleDetail_view.localParam.urlparam.param21 = $('#samplingSet_assitemid').val();
			sampleDetail_view.localParam.urlparam.param22 = $('#samplingSet_cullAmountType').val();
			sampleDetail_view.localParam.urlparam.param23 = $('#samplingSet_cullReason').val();
			sampleDetail_view.localParam.urlparam.param24 = curSamplingParam.serail;
			var jsonParam = {
				detailSubjectId: $('#samplingSet_common_subjectid').val(),
				detailAssItemId: $('#samplingSet_assitemid_cull').val()
			};
			sampleDetail_view.localParam.urlparam.jsonData = JSON.stringify(jsonParam);
			sampleDetail_view.localParam.urlparam.lockYyyy = $('#samplingSet_startDate').val().substr(0, 4);
			sampleDetail_view.localParam.urlparam.sqlId = 'FINCP100001';
			BdoDataTable('samplingSetTable', sampleDetail_view);
			calculationParam = cloneObjectFn(sampleDetail_view.localParam.urlparam);
		}else if($('#samplingSet_dataResource').val() == '2'){
			assItemDetail_view.localParam.urlparam.lockCustomerId = curSamplingParam.customerId;
			//assItemDetail_view.localParam.urlparam.param1 = $('#samplingSet_startDate').val().substr(0, 4);
			assItemDetail_view.localParam.urlparam.param2 = $('#samplingSet_endDate').val().substr(0, 4);
			assItemDetail_view.localParam.urlparam.param3 = $('#samplingSet_startDate').val().substr(5, 6);
			assItemDetail_view.localParam.urlparam.param4 = $('#samplingSet_endDate').val().substr(5, 6);
			assItemDetail_view.localParam.urlparam.param8 = $('#samplingSet_amountStart').val();
			assItemDetail_view.localParam.urlparam.param9 = $('#samplingSet_amountEnd').val();
			assItemDetail_view.localParam.urlparam.param10 = $('#samplingSet_assitemid').val();//.attr('data-result') ? $('#samplingSet_assitemid').attr('data-result') : '';
			assItemDetail_view.localParam.urlparam.param11 = $('#samplingSet_subjectid').val();
			assItemDetail_view.localParam.urlparam.param14 = samplingId;
			assItemDetail_view.localParam.urlparam.param15 = $('#samplingSet_dataResource').val();
			assItemDetail_view.localParam.urlparam.sqlId = 'FA30069';
			BdoDataTable('samplingSetTable', assItemDetail_view);
			calculationParam = cloneObjectFn(assItemDetail_view.localParam.urlparam);
		}else if($('#samplingSet_dataResource').val() == '3'){
			accountDetail_view.localParam.urlparam.lockCustomerId = curSamplingParam.customerId;
			//assItemDetail_view.localParam.urlparam.param1 = $('#samplingSet_startDate').val().substr(0, 4);
			accountDetail_view.localParam.urlparam.param2 = $('#samplingSet_endDate').val().substr(0, 4);
			accountDetail_view.localParam.urlparam.param3 = $('#samplingSet_startDate').val().substr(5, 6);
			accountDetail_view.localParam.urlparam.param4 = $('#samplingSet_endDate').val().substr(5, 6);
			accountDetail_view.localParam.urlparam.param8 = $('#samplingSet_amountStart').val();
			accountDetail_view.localParam.urlparam.param9 = $('#samplingSet_amountEnd').val();
			accountDetail_view.localParam.urlparam.param11 = $('#samplingSet_subjectid').val();
			accountDetail_view.localParam.urlparam.param14 = samplingId;
			accountDetail_view.localParam.urlparam.param15 = $('#samplingSet_dataResource').val();
			accountDetail_view.localParam.urlparam.sqlId = 'FA30070';
			BdoDataTable('samplingSetTable', accountDetail_view);
			calculationParam = cloneObjectFn(accountDetail_view.localParam.urlparam);
		}
		dataSource = $('#samplingSet_dataResource').val();

	}
	
	/** 日期选择 */
	$('#samplingSet_dateType').change(function() {
		var dateFormat = 'yyyy-mm-dd';
		var minViewMode = 0;
		var startDateInput = '<input id="samplingSet_startDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off">';
		var endDateInput = '<input id="samplingSet_endDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off">';
		var addon = '<span id="samplingSet_dateAddon" class="input-group-addon">-</span>';
		if ($('#samplingSet_dateType').val() == '1') {
			dateFormat = 'yyyy-mm';
			minViewMode = 1;
		} else if ($('#samplingSet_dateType').val() == '2') {
			dateFormat = 'yyyy';
			minViewMode = 2;
		}

		$('#samplingSet_startDate').remove();
		$('#samplingSet_endDate').remove();
		$('#samplingSet_dateAddon').remove();
		$('#samplingSet_dateGroup').append(startDateInput);
		$('#samplingSet_dateGroup').append(addon);
		$('#samplingSet_dateGroup').append(endDateInput);

		$('#samplingSet_startDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: dateFormat, //日期显示格式
			minViewMode: minViewMode
		});
		$('#samplingSet_endDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: dateFormat, //日期显示格式
			minViewMode: minViewMode
		});
		/*//设置结束时间必须晚于开始时间
		$("#search_endDate").datepicker().on('changeDate', function(e) {
			//获取选取的开始时间))
		     var endTimeStart =$("#search_startDate").val();          
			//设置结束时间
		     $('#search_endDate').datepicker('setStartDate', endTimeStart);  
		 });*/
		//年度改变科目树更新
		$('#samplingSet_endDate').change(function() {
			if ($('#subject_tree').hasClass('treeview')) {
				$('#subject_tree').tree('reset');
				$('#subject_tree').tree('destory');
			}
			if ($('#samplingSet_assitem_tree').hasClass('treeview')) {
				$('#samplingSet_assitem_tree').tree2('reset');
				$('#samplingSet_assitem_tree').tree2('destory');
			}
		});
		$('#samplingSet_startDate').change(function() {
			if ($('#subject_tree').hasClass('treeview')) {
				$('#subject_tree').tree('reset');
				$('#subject_tree').tree('destory');
			}
			if ($('#samplingSet_assitem_tree').hasClass('treeview')) {
				$('#samplingSet_assitem_tree').tree2('reset');
				$('#samplingSet_assitem_tree').tree2('destory');
			}
		});
	});

	$('#samplingSet_subjectid').change(function() {
		if ($('#samplingSet_assitem_tree').hasClass('treeview')) {
			$('#samplingSet_assitem_tree').tree2('reset');
			$('#samplingSet_assitem_tree').tree2('destory');
		}
	});
	/** 日期选择 */
	$('#dgSamplingInfo_dateType').change(function() {
		var dateFormat = 'yyyy-mm-dd';
		var minViewMode = 0;
		var startDateInput = '<input id="dgSamplingInfo_startDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off">';
		var endDateInput = '<input id="dgSamplingInfo_endDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off">';
		var addon = '<span id="dgSamplingInfo_dateAddon" class="input-group-addon">-</span>';
		if ($('#dgSamplingInfo_dateType').val() == '1') {
			dateFormat = 'yyyy-mm';
			minViewMode = 1;
		} else if ($('#dgSamplingInfo_dateType').val() == '2') {
			dateFormat = 'yyyy';
			minViewMode = 2;
		}
		$('#dgSamplingInfo_startDate').remove();
		$('#dgSamplingInfo_endDate').remove();
		$('#dgSamplingInfo_dateAddon').remove();
		$('#dgSamplingInfo_dateGroup').append(startDateInput);
		$('#dgSamplingInfo_dateGroup').append(addon);
		$('#dgSamplingInfo_dateGroup').append(endDateInput);

		$('#dgSamplingInfo_startDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: dateFormat, //日期显示格式
			minViewMode: minViewMode
		});
		$('#dgSamplingInfo_endDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: dateFormat, //日期显示格式
			minViewMode: minViewMode
		});
		/*//设置结束时间必须晚于开始时间
		$("#search_endDate").datepicker().on('changeDate', function(e) {
			//获取选取的开始时间))
		     var endTimeStart =$("#search_startDate").val();          
			//设置结束时间
		     $('#search_endDate').datepicker('setStartDate', endTimeStart);  
		 });*/

		//年度改变科目树更新
		$('#dgSamplingInfo_endDate').change(function() {
			if ($('#subject_tree_samplingInfo').hasClass('treeview')) {
				$('#subject_tree_samplingInfo').tree('reset');
				$('#subject_tree_samplingInfo').tree('destory');
			}
		});
		$('#dgSamplingInfo_startDate').change(function() {
			if ($('#subject_tree_samplingInfo').hasClass('treeview')) {
				$('#subject_tree_samplingInfo').tree('reset');
				$('#subject_tree_samplingInfo').tree('destory');
			}
		});

	});

	/** 日期选择 */
	$('#samplistRelate_dateType').change(function() {
		var dateFormat = 'yyyy-mm-dd';
		var minViewMode = 0;
		var startDateInput = '<input id="samplistRelate_startDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off">';
		var endDateInput = '<input id="samplistRelate_endDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off">';
		var addon = '<span id="samplistRelate_dateAddon" class="input-group-addon">-</span>';
		if ($('#samplistRelate_dateType').val() == '1') {
			dateFormat = 'yyyy-mm';
			minViewMode = 1;
		} else if ($('#samplistRelate_dateType').val() == '2') {
			dateFormat = 'yyyy';
			minViewMode = 2;
		}

		$('#samplistRelate_startDate').remove();
		$('#samplistRelate_endDate').remove();
		$('#samplistRelate_dateAddon').remove();
		$('#samplistRelate_dateGroup').append(startDateInput);
		$('#samplistRelate_dateGroup').append(addon);
		$('#samplistRelate_dateGroup').append(endDateInput);

		$('#samplistRelate_startDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: dateFormat, //日期显示格式
			minViewMode: minViewMode
		});
		$('#samplistRelate_endDate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: dateFormat, //日期显示格式
			minViewMode: minViewMode
		});
		/*//设置结束时间必须晚于开始时间
		$("#search_endDate").datepicker().on('changeDate', function(e) {
			//获取选取的开始时间))
		     var endTimeStart =$("#search_startDate").val();          
			//设置结束时间
		     $('#search_endDate').datepicker('setStartDate', endTimeStart);  
		 });*/

		//年度改变科目树更新
		$('#samplistRelate_endDate').change(function() {
			if ($('#subject_tree_samplistRelate').hasClass('treeview')) {
				$('#subject_tree_samplistRelate').tree('reset');
				$('#subject_tree_samplistRelate').tree('destory');
			}
		});
		$('#samplistRelate_startDate').change(function() {
			if ($('#subject_tree_samplistRelate').hasClass('treeview')) {
				$('#subject_tree_samplistRelate').tree('reset');
				$('#subject_tree_samplistRelate').tree('destory');
			}
		});

	});
	//选择科目
	$('#samplingSet_subjectid').focus(function() {
		if ($('#samplingSet_startDate').val() == '') {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid').modal('show');
		if ($('#subject_tree').hasClass('treeview')) {
			return;
		}
		var year = '';
		if ($('#samplingSet_endDate').val() != '') {
			year = $('#samplingSet_endDate').val().substr(0, 4);
		} else {
			year = $('#samplingSet_startDate').val().substr(0, 4);
		}
		$('#subject_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				searchInputId: 'searchInput1'
			},
			singleSelect: true,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
		});
	});
	$('#modal_subjectid_sure').click(function() {
		var selectValue = $('#subject_tree').tree('getTreeMultiValue');
		if (typeof(selectValue) === 'object') {
			$('#samplingSet_subjectid').val('');
		} else {
			$('#samplingSet_subjectid').val(selectValue).change();

		}
		$('#modal_subjectid').modal('hide');
	});
	$('#modal_subjectid_reset').click(function() {
		$('#subject_tree').tree('reset');
	});
	//多选择明细科目
	$('#samplingSet_common_subjectid').focus(function() {
		if ($('#samplingSet_startDate').val() == '') {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid_detail').modal('show');
		if ($('#subject_detail_tree').hasClass('treeview')) {
			return;
		}
		var year = '';
		if ($('#samplingSet_endDate').val() != '') {
			year = $('#samplingSet_endDate').val().substr(0, 4);
		} else {
			year = $('#samplingSet_startDate').val().substr(0, 4);
		}
		$('#subject_detail_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				searchInputId: 'searchInput_detail'
			},
			singleSelect: false,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: true,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
		});
	});
	$('#modal_subjectid_detail_sure').click(function() {
		var selectValue = $('#subject_detail_tree').tree('getTreeMultiValue');
		if (typeof(selectValue) === 'object') {
			$('#samplingSet_common_subjectid').val('');
		} else {
			//$('#samplingSet_common_subjectid').val(selectValue).change();
			checkChildSubject(selectValue, setSubject, 'samplingSet_common_subjectid');
		}
		$('#modal_subjectid_detail').modal('hide');
	});
	$('#modal_subjectid_detail_reset').click(function() {
		$('#subject_detail_tree').tree('reset');
	});
	//选择科目
	$('#dgSamplingInfo_subjectid').focus(function() {
		/*if ($('#dgSamplingInfo_customerId').val() == '') {
			$('#dgSamplingInfo_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}*/
		if ($('#dgSamplingInfo_startDate').val() == '') {
			$('#dgSamplingInfo_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid_samplingInfo').modal('show');
		if ($('#subject_tree_samplingInfo').hasClass('treeview')) {
			return;
		}
		var year = '';
		if ($('#dgSamplingInfo_endDate').val() != '') {
			year = $('#dgSamplingInfo_endDate').val().substr(0, 4);
		} else {
			year = $('#dgSamplingInfo_startDate').val().substr(0, 4);
		}
		$('#subject_tree_samplingInfo').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				searchInputId: 'searchInput1_samplingInfo'
			},
			singleSelect: true,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
		});
	});
	$('#modal_subjectid_sure_samplingInfo').click(function() {
		var selectValue = $('#subject_tree_samplingInfo').tree('getTreeMultiValue');
		if (typeof(selectValue) === 'object') {
			$('#dgSamplingInfo_subjectid').val('');
		} else {
			$('#dgSamplingInfo_subjectid').val(selectValue);

		}
		$('#modal_subjectid_samplingInfo').modal('hide');
	});
	$('#modal_subjectid_reset_samplingInfo').click(function() {
		$('#subject_tree_samplingInfo').tree('reset');
	});

	//选择科目
	$('#samplistRelate_subjectid').focus(function() {
		/*if ($('#dgSamplingInfo_customerId').val() == '') {
			$('#dgSamplingInfo_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}*/
		if ($('#samplistRelate_startDate').val() == '') {
			$('#samplistRelate_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid_samplistRelate').modal('show');
		if ($('#subject_tree_samplistRelate').hasClass('treeview')) {
			return;
		}
		var year = '';
		if ($('#samplistRelate_endDate').val() != '') {
			year = $('#samplistRelate_endDate').val().substr(0, 4);
		} else {
			year = $('#samplistRelate_startDate').val().substr(0, 4);
		}
		$('#subject_tree_samplistRelate').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				searchInputId: 'searchInput1_samplistRelate'
			},
			singleSelect: true,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
		});
	});
	$('#modal_subjectid_sure_samplistRelate').click(function() {
		var selectValue = $('#subject_tree_samplistRelate').tree('getTreeMultiValue');
		if (typeof(selectValue) === 'object') {
			$('#samplistRelate_subjectid').val('');
		} else {
			$('#samplistRelate_subjectid').val(selectValue);

		}
		$('#modal_subjectid_samplistRelate').modal('hide');
	});
	$('#modal_subjectid_reset_samplistRelate').click(function() {
		$('#subject_tree_samplistRelate').tree('reset');
	});
	//选择科目
	$('#samplingSet_subjectid_cull').focus(function() {
		if ($('#samplingSet_startDate').val() == '') {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid_cull').modal('show');
		if ($('#subject_tree_cull').hasClass('treeview')) {
			return;
		}
		var year = '';
		if ($('#samplingSet_endDate').val() != '') {
			year = $('#samplingSet_endDate').val().substr(0, 4);
		} else {
			year = $('#samplingSet_startDate').val().substr(0, 4);
		}
		$('#subject_tree_cull').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				searchInputId: 'searchInput_cull'
			},
			singleSelect: false,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: true,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
		});
	});
	$('#modal_subjectid_sure_cull').click(function() {
		var selectValue = $('#subject_tree_cull').tree('getTreeMultiValue');
		if (typeof(selectValue) === 'object') {
			$('#samplingSet_subjectid_cull').val('');
		} else {
			$('#samplingSet_subjectid_cull').val(selectValue).change();

		}
		$('#modal_subjectid_cull').modal('hide');
	});
	$('#modal_subjectid_reset_cull').click(function() {
		$('#subject_tree_cull').tree('reset');
	});
	//选择科目
	$('#cutoff_subjectid').focus(function() {
		$('#modal_subjectid_cutoff').modal('show');
		if ($('#subject_tree_cutoff').hasClass('treeview')) {
			return;
		}
		$('#subject_tree_cutoff').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				searchInputId: 'searchInput_cutoff'
			},
			singleSelect: false,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: true,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
		});
	});
	$('#modal_subjectid_sure_cutoff').click(function() {
		var selectValue = $('#subject_tree_cutoff').tree('getTreeMultiValue');
		if (typeof(selectValue) === 'object') {
			$('#cutoff_subjectid').val('');
		} else {
			//$('#cutoff_subjectid').val(selectValue).change();
			checkChildSubject(selectValue, setSubject, 'cutoff_subjectid');
		}
		$('#modal_subjectid_cutoff').modal('hide');
	});
	$('#modal_subjectid_reset_cutoff').click(function() {
		$('#subject_tree_cutoff').tree('reset');
	});
	//选择数据来源
	$('#samplingSet_dataResource').change(function() {
		if($('#samplingSet_dataResource').val() == '1'){
			document.getElementById("samplingSet_typeId_div").style.display='block';
			document.getElementById("samplingSet_voucherId_div").style.display='block';
			document.getElementById("samplingSet_summery_div").style.display='block';
			//document.getElementById("samplingSet_assitemid_div").style.display='none';
			document.getElementById('samplingSet_dateType').disabled=false;
			document.getElementById('samplingSet_amountType').disabled=false;
		}else if($('#samplingSet_dataResource').val() == '2'){
			document.getElementById("samplingSet_typeId_div").style.display='none';
			document.getElementById("samplingSet_voucherId_div").style.display='none';
			document.getElementById("samplingSet_summery_div").style.display='none';
			document.getElementById("samplingSet_assitemid_div").style.display='block';
			$('#samplingSet_dateType').val('1');
			$('#samplingSet_dateType').change();
			$('#samplingSet_amountType').val('3');
			document.getElementById('samplingSet_dateType').disabled=true;
			document.getElementById('samplingSet_amountType').disabled=true;
		}else if($('#samplingSet_dataResource').val() == '3'){
			document.getElementById("samplingSet_typeId_div").style.display='none';
			document.getElementById("samplingSet_voucherId_div").style.display='none';
			document.getElementById("samplingSet_summery_div").style.display='none';
			//document.getElementById("samplingSet_assitemid_div").style.display='none';
			$('#samplingSet_dateType').val('1');
			$('#samplingSet_dateType').change();
			$('#samplingSet_amountType').val('3');
			document.getElementById('samplingSet_dateType').disabled=true;
			document.getElementById('samplingSet_amountType').disabled=true;
		}
	});
	//核算科目
	$('#assItemSelect_add').click(function() {
		if ($('#samplingSet_startDate').val() == '') {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		if ($('#samplingSet_subjectid').val() == '') {
			bdoInfoBox('提示', '请选择科目');
			return;
		}
		var year = '';
		if ($('#samplingSet_endDate').val() != '') {
			year = $('#samplingSet_endDate').val().substr(0, 4);
		} else {
			year = $('#samplingSet_startDate').val().substr(0, 4);
		}
		$('#modal_assitemid').modal('show');
		if ($('#samplingSet_assitem_tree').hasClass('treeview')) {
			return;
		}
		$('#samplingSet_assitem_tree').tree2({
			url: 'finCenter/FinTreeCommon.findSubjectAssitem.json',
			params: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param11: $('#samplingSet_subjectid').val(),
				searchInputId: 'searchInputSamplingSet'
			},
			singleSelect: true,
			//lazyLoad: false,
			//onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}/*
		lazyLoad : false,
        view : {
            leafIcon: 'fa fa-building text-flat',
            nodeIcon: 'fa fa-bank text-primary-light',
            folderSelectable: false,
            multiSelect: false,
            showCheckbox: true,
            selectedColor: '',
            selectedBackColor: ''
        }*/
		});
	});
	$('#modal_assitemid_sure').click(function() {
		if (typeof($('#samplingSet_assitem_tree').tree2('getTreeMultiValue')) == 'object') {
			$('#samplingSet_assitemid').val('');
		} else {
			//$('#samplingSet_assitemid').val($('#samplingSet_assitem_tree').tree2('getTreeMultiValue'));
			addAssItemSelect($('#samplingSet_assitem_tree').tree2('getTreeMultiValue'));
		}
		$('#modal_assitemid').modal('hide');
	});
	$('#modal_assitemid_reset').click(function() {
		$('#samplingSet_assitem_tree').tree2('reset');
		$('#searchInputSamplingSet').keyup();
	});
	//剔除核算科目
	$('#assItemCullSelect_add').click(function() {
		if ($('#samplingSet_startDate').val() == '') {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		if ($('#samplingSet_subjectid').val() == '') {
			bdoInfoBox('提示', '请选择科目');
			return;
		}
		var year = '';
		if ($('#samplingSet_endDate').val() != '') {
			year = $('#samplingSet_endDate').val().substr(0, 4);
		} else {
			year = $('#samplingSet_startDate').val().substr(0, 4);
		}
		$('#modal_assitemid_cull').modal('show');
		if ($('#samplingSet_assitem_cull_tree').hasClass('treeview')) {
			return;
		}
		$('#samplingSet_assitem_cull_tree').tree2({
			url: 'finCenter/FinTreeCommon.findSubjectAssitem.json',
			params: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param11: $('#samplingSet_subjectid').val(),
				searchInputId: 'searchInputSamplingSetCull'
			},
			singleSelect: true,
			//lazyLoad: false,
			//onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}/*
		lazyLoad : false,
        view : {
            leafIcon: 'fa fa-building text-flat',
            nodeIcon: 'fa fa-bank text-primary-light',
            folderSelectable: false,
            multiSelect: false,
            showCheckbox: true,
            selectedColor: '',
            selectedBackColor: ''
        }*/
		});
	});
	$('#modal_assitemid_cull_sure').click(function() {
		if (typeof($('#samplingSet_assitem_cull_tree').tree2('getTreeMultiValue')) == 'object') {
			$('#samplingSet_assitemid_cull').val('');
		} else {
			//$('#samplingSet_assitemid').val($('#samplingSet_assitem_tree').tree2('getTreeMultiValue'));
			addAssItemCullSelect($('#samplingSet_assitem_cull_tree').tree2('getTreeMultiValue'));
		}
		$('#modal_assitemid_cull').modal('hide');
	});
	$('#modal_assitemid_cull_reset').click(function() {
		$('#samplingSet_assitem_cull_tree').tree2('reset');
		$('#searchInputSamplingSetCull').keyup();
	});
	//自定义核算科目
	$('#samplingSet_customize_assitem').focus(function() {
		if ($('#samplingSet_startDate').val() == '') {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		if ($('#samplingSet_subjectid').val() == '') {
			$('#samplingSet_customize_assitem').blur();
			bdoInfoBox('提示', '请选择科目');
			return;
		}
		var year = '';
		if ($('#samplingSet_endDate').val() != '') {
			year = $('#samplingSet_endDate').val().substr(0, 4);
		} else {
			year = $('#samplingSet_startDate').val().substr(0, 4);
		}
		$('#modal_assitemid_customize').modal('show');
		if ($('#customize_assitem_tree').hasClass('treeview')) {
			return;
		}
		$('#customize_assitem_tree').tree2({
			url: 'finCenter/FinTreeCommon.findSubjectAssitem.json',
			params: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param11: $('#samplingSet_subjectid').val(),
				searchInputId: 'searchInputCustomize'
			},
			singleSelect: false,
			//lazyLoad: false,
			//onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: true,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
		});
	});
	$('#modal_assitemid_customize_sure').click(function() {
		if (typeof($('#customize_assitem_tree').tree2('getTreeMultiValue')) == 'object' || $('#customize_assitem_tree').tree2('getTreeMultiValue') == "undefined") {
			$('#samplingSet_customize_assitem').val('');
		} else {
			$('#samplingSet_customize_assitem').val($('#customize_assitem_tree').tree2('getTreeMultiValue'));
		}
		$('#modal_assitemid_customize').modal('hide');
	});
	$('#modal_assitemid_customize_reset').click(function() {
		$('#customize_assitem_tree').tree2('reset');
		$('#searchInputCustomize').keyup();
	});
	$('#samplingList_method').change(function() {
		if($('#samplingList_method').val() == 8){
			document.getElementById("samplingAdd_customizeReason").style.display='block';
		}else{
			document.getElementById("samplingAdd_customizeReason").style.display='none';
		}
	});
	/** 弹出创建抽样抽凭按钮 */
	$('#samplingSet_add').click(function() {
		relateType = '0';
		samplingId = '';
		//var timestamp = (new Date()).getTime();//返回数值单位是毫秒；
		$('#samplingList_method').html(ComboLocalDicOption(true, '抽凭方式'));
		var timestamp = new Date();
		var time = '抽凭' + dateFtt('yyyyMMddhhmmss',timestamp);
		$('#samplingAdd_name_model').val(time);
		$('#samplingList_method').val('1');
		$('#samplingSet_samplingType').removeAttr('disabled');
		$('#modal-samplingAdd').modal('show');
		
	});
	/** 上一步 弹出创建抽样抽凭按钮 */
	$('#samplingSet_prev,#modal_cutoff_prev').click(function() {
		$.ajax({
			url: 'finCenter/sampling.querySamplingList.json',
			type: 'post',
			data: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param1: samplingId,
				param2: curSamplingParam.projectId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if(data.data[0].sampleStatus == '3'){
						bdoInfoBox('提示', "抽凭已完成！");
						return;
					}
					$('#samplingAdd_name_model').val(data.data[0].sampleName);
					$('#samplingList_method').val(data.data[0].sampleMethod);
					if(data.data[0].sampleMethod == 8){
						document.getElementById("samplingAdd_customizeReason").style.display='block';
						$('#samplingList_customizeReason').val(data.data[0].customizeReason);
						$('#samplingSet_samplingType').attr('disabled', true);
					}else{
						document.getElementById("samplingAdd_customizeReason").style.display='none';
						$('#samplingSet_samplingType').removeAttr('disabled');
					}
					if(data.data[0].dataResource != null && data.data[0].dataResource != ''){
						$('#samplingSet_dataResource').val(data.data[0].dataResource);
						$('#samplingSet_dataResource').change();
					}
					if(data.data[0].vchDateType != null && data.data[0].vchDateType != ''){
						$('#samplingSet_dateType').val(data.data[0].vchDateType);
						$('#samplingSet_dateType').change();
					}
					if(data.data[0].vchDateStart != null && data.data[0].vchDateStart != ''){
						$('#samplingSet_startDate').val(data.data[0].vchDateStart);
					}
					if(data.data[0].vchDateEnd != null && data.data[0].vchDateEnd != ''){
						$('#samplingSet_endDate').val(data.data[0].vchDateEnd);
					}
					if(data.data[0].subjectId != null && data.data[0].subjectId != ''){
						$('#samplingSet_subjectid').val(data.data[0].subjectId);
					}
					if(data.data[0].samplingType != null && data.data[0].samplingType != ''){
						$('#samplingSet_samplingType').val(data.data[0].samplingType);
					}
					$('#modal-samplingAdd').modal('show');
					$('#modal-samplingSet').modal('hide');
					$('#modal_cutoff').modal('hide');
					//bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		
	});
	/** 创建抽样抽凭按钮 */
	$('#samplingAdd_submit').click(function() {
		var samplingList_method = $('#samplingList_method').val();
		var name_model = $('#samplingAdd_name_model').val();
		if (name_model == null || name_model == '') {
			bdoInfoBox('提示', '请填写抽样名称');
			return;
		}
		if ($('#samplingSet_endDate').val() == '' && $('#samplingSet_startDate').val() != '') {
			$('#samplingSet_endDate').val($('#samplingSet_startDate').val());
		}

		if ($('#samplingSet_startDate').val() == '' && $('#samplingSet_endDate').val() != '') {
			$('#samplingSet_startDate').val($('#samplingSet_endDate').val());
		}
		if ($('#samplingSet_startDate').val() == '') {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '请选择凭证开始日期');
			return;
		}

		if ($('#samplingSet_endDate').val() == '') {
			$('#samplingSet_endDate').focus();
			bdoInfoBox('提示', '请选择凭证结束日期');
			return;
		}
		if ($('#samplingSet_startDate').val() > $('#samplingSet_endDate').val()) {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '凭证结束日期不能小于凭证开始日期');
			return;
		}
		if($('#samplingSet_startDate').val().substr(0, 4) != $('#samplingSet_endDate').val().substr(0, 4)){
			bdoInfoBox('提示', '凭证日期必须是同一年');
			return;
		}
		/*if($('#samplingSet_startDate').val().substr(0, 4) != curSamplingParam.yyyy){
			bdoInfoBox('提示', '凭证日期必须选择账套年'+curSamplingParam.yyyy);
			return;
		}*/
		if ($('#samplingSet_subjectid').val() == '') {
			bdoInfoBox('提示', '请选择科目');
			return;
		}
		if ($('#samplingSet_samplingType').val() == '') {
			bdoInfoBox('提示', '请选择抽凭维度');
			return;
		}
		sampleDetail_view.localParam.urlparam.param1 = $('#samplingSet_startDate').val().substr(0, 4);
		sampleDetail_view.localParam.urlparam.param2 = $('#samplingSet_endDate').val().substr(0, 4);
		if($('#samplingSet_dateType').val() == '0'){
			sampleDetail_view.localParam.urlparam.param3 = $('#samplingSet_startDate').val();
			sampleDetail_view.localParam.urlparam.param4 = $('#samplingSet_endDate').val();
			sampleDetail_view.localParam.urlparam.param12 = '';
			sampleDetail_view.localParam.urlparam.param13 = '';
		}else if($('#samplingSet_dateType').val() == '1'){
			sampleDetail_view.localParam.urlparam.param3 = '';
			sampleDetail_view.localParam.urlparam.param4 = '';
			sampleDetail_view.localParam.urlparam.param12 = $('#samplingSet_startDate').val().substr(5, 6);
			sampleDetail_view.localParam.urlparam.param13 = $('#samplingSet_endDate').val().substr(5, 6);
		}else{
			sampleDetail_view.localParam.urlparam.param3 = '';
			sampleDetail_view.localParam.urlparam.param4 = '';
			sampleDetail_view.localParam.urlparam.param12 = '';
			sampleDetail_view.localParam.urlparam.param13 = '';
		}
		var relateId = '';
		if(relateType == '1'){
			relateId = subjectentryId;
		}
		var tip = '确认创建抽样抽凭？';
		//bdoConfirmBox('确认', tip, function() {
			$.ajax({
				url: 'finCenter/sampling.saveSamplingList.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId: curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: curSamplingParam.projectId,
					param2: $('#samplingAdd_name_model').val(),
					param3: samplingList_method,
					param4: samplingId,
					param5: $('#samplingList_customizeReason').val(),
					param6: relateId,
					param7: $('#samplingSet_dataResource').val(),
					param8: $('#samplingSet_dateType').val(),
					param9: $('#samplingSet_startDate').val(),
					param10: $('#samplingSet_endDate').val(),
					param11: $('#samplingSet_subjectid').val(),
					param12: $('#samplingSet_samplingType').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						//bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#samplingListTable').DataTable().ajax.reload(null,false);
						$('#dgSamplingInfoTable').DataTable().ajax.reload(null,false);
						$('#modal-samplingAdd').modal('hide');
						samplingId = data.data[0].autoId;
						if(relateType == '1'){
							relateSamplingId = data.data[0].autoId;
							$('#samplingInfoEdit_relateSampling').val(data.data[0].sampleName);
						}
						if(samplingList_method == 7){
							//截止抽样
							$('#modal_cutoff').modal('show');
							if(data.data[0].cutoffNum != null && data.data[0].cutoffNum != ''){
								$('#cutoff_num').val(data.data[0].cutoffNum);
							}
							if(data.data[0].cutoffAmount != null && data.data[0].cutoffAmount != ''){
								$('#cutoff_amount').val(data.data[0].cutoffAmount);
							}
							if(data.data[0].detailSubjectId != null && data.data[0].detailSubjectId != ''){
								$('#cutoff_subjectid').val(data.data[0].detailSubjectId);
							}else{
								$('#cutoff_subjectid').val(data.data[0].subjectId);
							}
						}else{
							$('#modal-samplingSet').modal('show');
							if(agrs.data.samplingSource == '1'){
								if(data.data[0].typeId != null && data.data[0].typeId != ''){
									$('#samplingSet_typeId').val(data.data[0].typeId);
								}
								if(data.data[0].oldVoucherId != null && data.data[0].oldVoucherId != ''){
									$('#samplingSet_voucherId').val(data.data[0].oldVoucherId);
								}
							}else{
								$('#samplingSet_typeId').val(data.data[0].typeId);
								$('#samplingSet_voucherId').val(data.data[0].oldVoucherId);
							}
							if(data.data[0].samplingType == '1'){
								$('#liSamplingCommon a[href="#dgSamplingCommonTab"]').click();
								$('#liSamplingCommon').css('display', 'block');
								$('#liSamplingCompany').css('display', 'none');
							}else{
								$('#liSamplingCompany a[href="#dgSamplingCompanyTab"]').click();
								$('#liSamplingCompany').css('display', 'block');
								$('#liSamplingCommon').css('display', 'none');
							}
							$('#samplingSet_summery').val(data.data[0].summary);
							$('#samplingSet_assitemid').val(data.data[0].assItemId);
							if(data.data[0].amountType != null && data.data[0].amountType != ''){
								$('#samplingSet_amountType').val(data.data[0].amountType);
							}
							$('#samplingSet_amountStart').val(data.data[0].amountStart);
							$('#samplingSet_amountEnd').val(data.data[0].amountEnd);
							if(data.data[0].cullAmountType != null && data.data[0].cullAmountType != ''){
								$('#samplingSet_cullAmountType').val(data.data[0].cullAmountType);
							}
							$('#samplingSet_cullAmountStart').val(data.data[0].cullAmountStart);
							$('#samplingSet_cullAmountEnd').val(data.data[0].cullAmountEnd);
							$('#samplingSet_cullReason').val(data.data[0].cullReason);
							$('#samplingSet_subjectid_cull').val(data.data[0].cullSubjectId);
							$('#samplingSet_balance_rank').val(data.data[0].balanceRank);
							$('#samplingSet_credit_rank').val(data.data[0].creditRank);
							$('#samplingSet_debit_rank').val(data.data[0].debitRank);
							$('#samplingSet_customize_assitem').val(data.data[0].customizeAssitem);
							$('#samplingSet_common_subjectid').val(data.data[0].detailSubjectId);
							$('#samplingSet_assitemid_cull').val(data.data[0].detailAssItemId);
							if(data.data[0].detailSubjectId != null && data.data[0].detailSubjectId != ''){
								$('#samplingSet_common_subjectid').val(data.data[0].detailSubjectId);
							}else{
								$('#samplingSet_common_subjectid').val(data.data[0].subjectId);
							}
							// 销毁表
							if ($('#samplingSetTable').hasClass('dataTable')) {
								$('#samplingSetTable').DataTable().clear();
								$('#samplingSetTable').DataTable().destroy();
								$('#samplingSetTable').empty();
							}
							if(agrs.data.samplingSource == '1'){
								$('#btn_samplingSet_search').click();
							}
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		//});
	});
	
	//弹出抽样抽凭
	$('#samplingListTable').on('click', 'button[name="samplingSetBtn"]', function() {
		
		var object = $('#samplingListTable').DataTable().data()[$(this).closest('tr').index()];
		if(object.sampleStatus == '3'){
			bdoInfoBox('提示', "抽凭已完成！");
			return;
		}
		samplingId = object.autoId;
		$('#samplingSet_prev').click();
		return false;
	});
	
	$('#tabs_sample a[href="#tab_samplingSet"]').find('.fa-times-circle').click(function() {
		document.getElementById("samplingSetOpen").style.display='none';
		$(this).parents('ul').find('li').first().find('a').click();
		//$(this).parents('li').remove();
		return false;
	});
	/** 范围确认 下一步 */
	$('#samplingSet_next').click(function() {
		var samplingSet_amountStart = 0;
		var samplingSet_amountEnd = 0;
		if($('#samplingSet_amountStart').val() != ''){
			samplingSet_amountStart = parseFloat($('#samplingSet_amountStart').val())
		}
		if($('#samplingSet_amountEnd').val() != ''){
			samplingSet_amountEnd = parseFloat($('#samplingSet_amountEnd').val())
		}
		if (samplingSet_amountStart > samplingSet_amountEnd && $('#samplingSet_amountEnd').val() != '') {
			$('#samplingSet_amountStart').focus();
			bdoInfoBox('提示', '开始金额不能大于结束金额');
			return;
		}
		var samplingSet_cullAmountStart = 0;
		var samplingSet_cullAmountEnd = 0;
		if($('#samplingSet_cullAmountStart').val() != ''){
			samplingSet_cullAmountStart = parseFloat($('#samplingSet_cullAmountStart').val())
		}
		if($('#samplingSet_cullAmountEnd').val() != ''){
			samplingSet_cullAmountEnd = parseFloat($('#samplingSet_cullAmountEnd').val())
		}
		if (samplingSet_cullAmountStart > samplingSet_cullAmountEnd && $('#samplingSet_cullAmountEnd').val() != '') {
			$('#samplingSet_cullAmountStart').focus();
			bdoInfoBox('提示', '开始金额不能大于结束金额');
			return;
		}
		if($('#samplingSet_cullReason').val() == '' && ($('#samplingSet_cullAmountType').val() != '' || $('#samplingSet_cullAmountStart').val() != '' || $('#samplingSet_cullAmountEnd').val() != '' || $('#samplingSet_subjectid_cull').val() != '' || $('#samplingSet_assitemid_cull').val() != '')){
			$('#samplingSet_cullReason').focus();
			bdoInfoBox('提示', '请填写剔除原因');
			return;
		}
		if(samplingType == '2'){
			if($('#samplingSet_balance_rank').val() == '' && $('#samplingSet_credit_rank').val() == '' &&
					$('#samplingSet_debit_rank').val() == '' && $('#samplingSet_customize_assitem').val() == '' ){
				bdoInfoBox('提示', '请至少设置一个供应商抽取条件');
				return;
			}
		}
		var rankParam = [{
			balanceRank:$('#samplingSet_balance_rank').val(),
			creditRank:$('#samplingSet_credit_rank').val(),
			debitRank:$('#samplingSet_debit_rank').val(),
			customizeAssitem:$('#samplingSet_customize_assitem').val(),
			samplingType:samplingType
		}];
		if($('#samplingSet_dataResource').val() == '1'){
			sampleDetail_view.localParam.urlparam.lockCustomerId = curSamplingParam.customerId;
			sampleDetail_view.localParam.urlparam.param1 = $('#samplingSet_startDate').val().substr(0, 4);
			sampleDetail_view.localParam.urlparam.param2 = $('#samplingSet_endDate').val().substr(0, 4);
			if($('#samplingSet_dateType').val() == '0'){
				sampleDetail_view.localParam.urlparam.param3 = $('#samplingSet_startDate').val();
				sampleDetail_view.localParam.urlparam.param4 = $('#samplingSet_endDate').val();
				sampleDetail_view.localParam.urlparam.param12 = '';
				sampleDetail_view.localParam.urlparam.param13 = '';
			}else if($('#samplingSet_dateType').val() == '1'){
				sampleDetail_view.localParam.urlparam.param3 = '';
				sampleDetail_view.localParam.urlparam.param4 = '';
				sampleDetail_view.localParam.urlparam.param12 = $('#samplingSet_startDate').val().substr(5, 6);
				sampleDetail_view.localParam.urlparam.param13 = $('#samplingSet_endDate').val().substr(5, 6);
			}else{
				sampleDetail_view.localParam.urlparam.param3 = '';
				sampleDetail_view.localParam.urlparam.param4 = '';
				sampleDetail_view.localParam.urlparam.param12 = '';
				sampleDetail_view.localParam.urlparam.param13 = '';
			}

			sampleDetail_view.localParam.urlparam.param5 = $('#samplingSet_typeId').val();
			sampleDetail_view.localParam.urlparam.param6 = $('#samplingSet_voucherId').val();
			sampleDetail_view.localParam.urlparam.param7 = $('#samplingSet_summery').val();
			sampleDetail_view.localParam.urlparam.param8 = $('#samplingSet_amountStart').val();
			sampleDetail_view.localParam.urlparam.param9 = $('#samplingSet_amountEnd').val();
			//if($('#samplingSet_amountStart').val() == '' && $('#samplingSet_amountEnd').val() == ''){
			//	sampleDetail_view.localParam.urlparam.param10 = '';
			//}else{
				sampleDetail_view.localParam.urlparam.param10 = $('#samplingSet_amountType').val();
			//}
			sampleDetail_view.localParam.urlparam.param11 = $('#samplingSet_subjectid').val();
			if($('#samplingSet_subjectid_cull').val() != ''){
				var cullSubjectId = "'" + $('#samplingSet_subjectid_cull').val().replace(/,/g,"','") + "'";
				sampleDetail_view.localParam.urlparam.param14 = cullSubjectId;
			}else{
				sampleDetail_view.localParam.urlparam.param14 = '';
			}
			sampleDetail_view.localParam.urlparam.param15 = $('#samplingSet_dataResource').val();
			sampleDetail_view.localParam.urlparam.param16 = $('#samplingSet_cullAmountStart').val();
			sampleDetail_view.localParam.urlparam.param17 = $('#samplingSet_cullAmountEnd').val();
			sampleDetail_view.localParam.urlparam.param21 = $('#samplingSet_assitemid').val();
			sampleDetail_view.localParam.urlparam.param22 = $('#samplingSet_cullAmountType').val();
			sampleDetail_view.localParam.urlparam.param23 = $('#samplingSet_cullReason').val();
			sampleDetail_view.localParam.urlparam.param24 = curSamplingParam.serail;
			sampleDetail_view.localParam.urlparam.lockYyyy = $('#samplingSet_startDate').val().substr(0, 4);
			sampleDetail_view.localParam.urlparam.sqlId = 'FINCP100001';
			var jsonParam = {
				detailSubjectId: $('#samplingSet_common_subjectid').val(),
				detailAssItemId: $('#samplingSet_assitemid_cull').val()
			};
			//BdoDataTable('samplingSetTable', sampleDetail_view);
			calculationParam = cloneObjectFn(sampleDetail_view.localParam.urlparam);
		}else if($('#samplingSet_dataResource').val() == '2'){
			assItemDetail_view.localParam.urlparam.lockCustomerId = curSamplingParam.customerId;
			//assItemDetail_view.localParam.urlparam.param1 = $('#samplingSet_startDate').val().substr(0, 4);
			assItemDetail_view.localParam.urlparam.param2 = $('#samplingSet_endDate').val().substr(0, 4);
			assItemDetail_view.localParam.urlparam.param3 = $('#samplingSet_startDate').val().substr(5, 6);
			assItemDetail_view.localParam.urlparam.param4 = $('#samplingSet_endDate').val().substr(5, 6);
			assItemDetail_view.localParam.urlparam.param8 = $('#samplingSet_amountStart').val();
			assItemDetail_view.localParam.urlparam.param9 = $('#samplingSet_amountEnd').val();
			assItemDetail_view.localParam.urlparam.param10 = $('#samplingSet_assitemid').val();//.attr('data-result') ? $('#samplingSet_assitemid').attr('data-result') : '';
			assItemDetail_view.localParam.urlparam.param11 = $('#samplingSet_subjectid').val();
			assItemDetail_view.localParam.urlparam.param14 = samplingId;
			assItemDetail_view.localParam.urlparam.param15 = $('#samplingSet_dataResource').val();
			assItemDetail_view.localParam.urlparam.sqlId = 'FA30069';
			//BdoDataTable('samplingSetTable', assItemDetail_view);
			calculationParam = cloneObjectFn(assItemDetail_view.localParam.urlparam);
		}else if($('#samplingSet_dataResource').val() == '3'){
			accountDetail_view.localParam.urlparam.lockCustomerId = curSamplingParam.customerId;
			//assItemDetail_view.localParam.urlparam.param1 = $('#samplingSet_startDate').val().substr(0, 4);
			accountDetail_view.localParam.urlparam.param2 = $('#samplingSet_endDate').val().substr(0, 4);
			accountDetail_view.localParam.urlparam.param3 = $('#samplingSet_startDate').val().substr(5, 6);
			accountDetail_view.localParam.urlparam.param4 = $('#samplingSet_endDate').val().substr(5, 6);
			accountDetail_view.localParam.urlparam.param8 = $('#samplingSet_amountStart').val();
			accountDetail_view.localParam.urlparam.param9 = $('#samplingSet_amountEnd').val();
			accountDetail_view.localParam.urlparam.param11 = $('#samplingSet_subjectid').val();
			accountDetail_view.localParam.urlparam.param14 = samplingId;
			accountDetail_view.localParam.urlparam.param15 = $('#samplingSet_dataResource').val();
			accountDetail_view.localParam.urlparam.sqlId = 'FA30070';
			//BdoDataTable('samplingSetTable', accountDetail_view);
			calculationParam = cloneObjectFn(accountDetail_view.localParam.urlparam);
		}
		dataSource = $('#samplingSet_dataResource').val();
		var tip = '确认锁定抽样范围？';
		//bdoConfirmBox('确认', tip, function() {
		bdoInProcessingBox('处理中');
			$.ajax({
				url: 'finCenter/sampling.updateSamplingList.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId: curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: $('#samplingSet_dataResource').val(),
					param3: $('#samplingSet_dateType').val(),
					param4: $('#samplingSet_startDate').val(),
					param5: $('#samplingSet_endDate').val(),
					param6: $('#samplingSet_subjectid').val(),
					param7: $('#samplingSet_typeId').val(),
					param8: $('#samplingSet_voucherId').val(),
					param9: $('#samplingSet_summery').val(),
					param10: $('#samplingSet_amountType').val(),
					param11: $('#samplingSet_amountStart').val(),
					param12: $('#samplingSet_amountEnd').val(),
					param13: $('#samplingSet_assitemid').val(),
					param14: $('#samplingSet_cullAmountType').val(),
					param15: $('#samplingSet_cullAmountStart').val(),
					param16: $('#samplingSet_cullAmountEnd').val(),
					param17: $('#samplingSet_cullReason').val(),
					param18: $('#samplingSet_subjectid_cull').val(),
					param19: curSamplingParam.serail,
					param20: JSON.stringify(jsonParam),
					jsonData: JSON.stringify(rankParam)
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						//bdoSuccessBox('成功', data.resultInfo.statusText);
						if($('#samplingList_method').val() == 8){
							samplingSetTest();
							$('#modal-samplingSet').modal('hide');
						}else{
							//抽样方式
							openSamplingMode();
						}
						bdoSuccessBox('成功');
						//$('#samplingListTable').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		//});
	});
	/** 抽样方式确认 上一步 */
	$('#samplingList_prev').click(function() {
		openSamplingSet();
		$('#modal_samplingMode').modal('hide');
	});
	/** 抽样方式确认 下一步 */
	$('#samplingList_next').click(function() {
		if ($('#samplingList_mode_default').val() != $('#samplingList_mode_actual').val() && $('#samplingList_mode_reason').val() == '') {
			bdoInfoBox('提示', '请填写理由');
			return;
		}
		$.ajax({
			url: 'finCenter/sampling.updateSamplingMode.json',
			type: 'post',
			data: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param1: samplingId,
				param2: $('#samplingList_mode_default').val(),
				param3: $('#samplingList_mode_actual').val(),
				param4: $('#samplingList_mode_reason').val()
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					//bdoSuccessBox('成功', data.resultInfo.statusText);
					/*if($('#samplingList_method').val() == 8){
						samplingSetTest();
						$('#modal-samplingSet').modal('hide');
					}else{*/
						//样本量计算
						btn_samplingSet_cal();
					//}
					bdoSuccessBox('成功');
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});

	//弹出抽样方式
	function openSamplingMode() {
		$.ajax({
			url: 'finCenter/sampling.querySamplingCalculation.json',
			type: 'post',
			data: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param14: samplingId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if(data.data[0].sampleModeDefault != null && data.data[0].sampleModeDefault != ''){
						$('#samplingList_mode_default').val(data.data[0].sampleModeDefault);
					}
					if(data.data[0].sampleModeActual != null && data.data[0].sampleModeActual != ''){
						$('#samplingList_mode_actual').val(data.data[0].sampleModeActual);
					}else{
						$('#samplingList_mode_actual').val(data.data[0].sampleModeDefault);
					}
					if(data.data[0].sampleModeReason != null && data.data[0].sampleModeReason != ''){
						$('#samplingList_mode_reason').val(data.data[0].sampleModeReason);
					}
					if($('#samplingList_mode_actual').val() == '2'){
						var tips= '提示：<br>小规模总体抽样方法仅适用于抽样总体中的项目可能为250个或更少，并且项目组已计划了风险评估程序以实现下列目的：<br>';
						tips = tips + '(1) 充分了解总体的特征，包括预期错报的规模和频率<br>';
						tips = tips + '(2) 如果总体中的项目超过250个（即略高于250个），但项目组仍然认为总体规模较小，可以咨询审计技术部门或使用传统抽样方法。如果项目组没有实施风险评估程序以充分了解抽样总体，或项目数量明显超过250个，则应使用传统抽样方法。如果总体中的项目数少于40个，则可使用本工作表底部的最低样本量表。';
						$('#sampling_mode_tips').html(tips);
					}else if($('#samplingList_mode_actual').val() == '3'){
						var tips= '提示：<br>大规模总体抽样方法仅适用于账户余额可能是实际执行的重要性的100倍（或更多）并且项目组已实施了下列程序：<br>';
						tips = tips + '(1) 已实施风险评估程序，为风险识别和与总体特征相关的认定提供支持性证据<br>';
						tips = tips + '(2) 已将异常项目从审计抽样的总体中剔除，并根据数据分析或其他测试中的识别结果进行专门测试<br>';
						tips = tips + '(3) 了解抽样总体，以便项目组确定抽样总体中的项目是一组同质的常规交易或余额<br>';
						tips = tips + '(4) 对总体进行适当分层（如必要）<br>';
						tips = tips + '(5) 注册会计师前期和本期实施风险评估的经验表明，预期抽样总体错报为零或可以忽略不计（即，根据上一年的经验，预计总体不会出现系统性问题，对样本中识别出的任何错报进行推断后的金额远低于实际执行重要性/可容忍错报的金额。）<br>';
						tips = tips + '(6) 对与该认定相关的内部控制设计的评价，该项控制单独或与其他控制相结合，表明控制能够有效地防止、发现和纠正重大错报，并且很可能是零错报或可以忽略不计的错报。<br>';
						tips = tips + '如果项目组没有实施风险评估程序以充分了解抽样总体，或总体不符合上述条件，则应使用传统抽样方法。<br>';
						$('#sampling_mode_tips').html(tips);
					}else{
						$('#sampling_mode_tips').html('');
					}
					$('#modal_samplingMode').modal('show');
					$('#modal-samplingSet').modal('hide');
					$('#modal_samplingCaculation').modal('hide');
					bdoSuccessBox('成功');
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		return false;
	}

	/** 选取样本方法 上一步 */
	$('#samplingMethod_prev').click(function() {
		//样本量计算
		btn_samplingSet_cal();
	});
	/** 选取样本方法 下一步 */
	$('#samplingMethod_next').click(function() {
		if ($('#samplingList_method').val() == '') {
			bdoInfoBox('提示', '请选取样本方法');
			return;
		}
		$.ajax({
			url: 'finCenter/sampling.updateSamplingMethod.json',
			type: 'post',
			data: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param1: samplingId,
				param2: $('#samplingList_method').val()
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if($('#samplingList_method').val() == '3'){
						$('#modal_samplingRange').modal('show');
						samplingRange_view.localParam.urlparam.param1 = samplingId;
						BdoDataTable('samplingRangeTable', samplingRange_view);
					}else{
						samplingSetTest();
					}
					$('#modal_samplingMethod').modal('hide');
					bdoSuccessBox('成功');
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});

	//reload表
	function reloadSamplingSetTable(){
		$('#samplingSetTable').DataTable().ajax.reload(null,false);
	}
	//剔除
	$('#btn_samplingSet_cull').click(function() {
		var jqEl;
		var selectIds = [];
		var selectAssitems = [];
		var assitems = '';
		if(dataSource == '1'){
			var jqEl = $('input[name="sampleSelect"]:checked');
			$.each(jqEl, (index, el) => {
				selectIds.push(el.value);
			});
		}else if(dataSource == '2'){
			var jqEl = $('input[name="assItemSelect"]:checked');
			$.each(jqEl, (index, el) => {
				var subjectAssItem = el.value.split(",");
				selectIds.push(subjectAssItem[0]);
				selectAssitems.push(subjectAssItem[1]);
			});
			assitems = selectAssitems.join(',');
		}else if(dataSource == '3'){
			var jqEl = $('input[name="accountSelect"]:checked');
			$.each(jqEl, (index, el) => {
				selectIds.push(el.value);
			});
		}

		if (selectIds.length < 1) {
			bdoErrorBox('', '未选择数据！');
			return;
		}
		bdoConfirmBox('保存', '<font color="red">确认剔除？<br>剔除后的数据标识为红色</font>', function() {
			$.ajax({
				url: 'finCenter/sampling.saveSamplingCull.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId: curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: dataSource,
					param3: $('#samplingSet_startDate').val().substr(0, 4),
					param4: selectIds.join(','),
					param5: assitems,
					param6: curSamplingParam.projectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						searchSamplingCull(reloadSamplingSetTable);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//取消剔除
	$('#btn_samplingSet_cancelCull').click(function() {
		var jqEl;
		var selectIds = [];
		var selectAssitems = [];
		var assitems = '';
		if(dataSource == '1'){
			var jqEl = $('input[name="sampleSelect"]:checked');
			$.each(jqEl, (index, el) => {
				selectIds.push(el.value);
			});
		}else if(dataSource == '2'){
			var jqEl = $('input[name="assItemSelect"]:checked');
			$.each(jqEl, (index, el) => {
				selectIds.push(el.subjectId);
				selectAssitems.push(el.assItemId);
			});
			assitems = selectAssitems.join(',');
		}else if(dataSource == '3'){
			var jqEl = $('input[name="accountSelect"]:checked');
			$.each(jqEl, (index, el) => {
				selectIds.push(el.value);
			});
		}
		if (selectIds.length < 1) {
			bdoErrorBox('', '未选择数据！');
			return;
		}
		bdoConfirmBox('保存', '确认取消剔除？', function() {
			$.ajax({
				url: 'finCenter/sampling.saveSamplingCancelCull.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId: curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: dataSource,
					param3: $('#samplingSet_startDate').val().substr(0, 4),
					param4: selectIds.join(','),
					param5: assitems,
					param6: curSamplingParam.projectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						searchSamplingCull(reloadSamplingSetTable);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//取消全部剔除
	$('#btn_samplingSet_cancelCullAll').click(function() {
		bdoConfirmBox('保存', '确认取消全部剔除？', function() {
			$.ajax({
				url: 'finCenter/sampling.saveSamplingCancelCullAll.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId: curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: dataSource,
					param3: $('#samplingSet_startDate').val().substr(0, 4),
					param4: curSamplingParam.projectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						searchSamplingCull(reloadSamplingSetTable);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	
	//弹出样本量计算
	function btn_samplingSet_cal() {
		$('#modal_samplingCaculation').modal('show');
		$('#modal_samplingMode').modal('hide');
		$('#modal_samplingMethod').modal('hide');
		document.getElementById('samplingCaculation_totalAmount').disabled=true;
		document.getElementById('samplingCaculation_cullAmount').disabled=true;
		document.getElementById('samplingCaculation_amount').disabled=true;
		document.getElementById('samplingCaculation_num').disabled=true;
		document.getElementById('samplingCaculation_r').disabled=true;
		document.getElementById('samplingCaculation_initialAmount').disabled=true;
		document.getElementById('samplingCaculation_total').disabled=true;
		document.getElementById('samplingCaculation_calAmount').disabled=true;
		document.getElementById('samplingCaculation_actualImportant').disabled=true;
		if(calculationParam.param15 == '1'){
			calculationParam.sqlId = 'FINCP100002';
		}else if(calculationParam.param15 == '2'){
			calculationParam.sqlId = 'FA30074';
		}else if(calculationParam.param15 == '3'){
			calculationParam.sqlId = 'FA30076';
		}
		calculationParam.param14 =  samplingId;
		$.ajax({
			url: 'finCenter/Sampling.querySamplingCalculation.json',
			type: 'post',
			data: calculationParam,
			dataType: 'json',
			success: function(data) {
				if (data && data.success && data.data ) {
					if(data.data.length > 0){
						sampleModeActual = data.data[0].sampleModeActual;
						if(data.data[0].sampleModeActual == '2'){
							$('#samplingCaculation_tocPlan_show').css('display', 'none');
							$('#samplingCaculation_control_show').removeAttr('style');
							$('#samplingCaculation_variable_show').css('display', 'none');
							$('#samplingCaculation_smallScaleRate_show').removeAttr('style');
							$('#samplingCaculation_lowestLevel_show').removeAttr('style');
							$('#samplingCaculation_risk').val('3');
							$('#samplingCaculation_control').val('2');
							$('#samplingFormula1').html('错报风险等级-控制测试获取的保证程度-实质性分析程序获取的保证程度-从其他OSP获取的保证程度-数据分析测试获取的保证程度=其他实质性程序抽样R因子');
							$('#samplingFormula3').html('初始样本量总计(不包括小数点)*(1 - 小规模总体调整%))=考虑抽样方法后调整的样本量');
							$('#samplingCaculation_calAmount_label').html('小规模总体样本量');
						}else if(data.data[0].sampleModeActual == '3'){
							$('#samplingCaculation_tocPlan_show').removeAttr('style');
							$('#samplingCaculation_control_show').css('display', 'none');
							$('#samplingCaculation_variable_show').css('display', 'none');
							$('#samplingCaculation_smallScaleRate_show').css('display', 'none');
							$('#samplingCaculation_lowestLevel_show').css('display', 'none');
							$('#samplingCaculation_risk').val('3');
							$('#samplingCaculation_analysis').val('1.5');
							$('#samplingCaculation_pledge').val('1.5');
							$('#samplingFormula1').html('错报风险等级-实质性分析程序获取的保证程度-从其他OSP获取的保证程度-数据分析测试获取的保证程度=其他实质性程序抽样R因子');
							$('#samplingFormula3').html('');
							$('#samplingCaculation_calAmount_label').html('大规模总体样本量');
						}else{
							$('#samplingCaculation_tocPlan_show').css('display', 'none');
							$('#samplingCaculation_control_show').removeAttr('style');
							$('#samplingCaculation_variable_show').removeAttr('style');
							$('#samplingCaculation_smallScaleRate_show').css('display', 'none');
							$('#samplingCaculation_lowestLevel_show').css('display', 'none');
							$('#samplingCaculation_risk').val('3');
							$('#samplingCaculation_analysis').val('0.5');
							$('#samplingCaculation_pledge').val('1.5');
							$('#samplingFormula1').html('错报风险等级-控制测试获取的保证程度-实质性分析程序获取的保证程度-从其他OSP获取的保证程度-数据分析测试获取的保证程度=其他实质性程序抽样R因子');
							$('#samplingFormula3').html('初始样本量总计(不包括小数点)*是否能够应对样本总体的变量因素?=考虑抽样方法后调整的样本量');
							$('#samplingCaculation_calAmount_label').html('考虑抽样方法后调整的样本量');
						}
						$('#samplingCaculation_totalAmount').val(getMn(data.data[0].totalAmount));
						$('#samplingCaculation_cullAmount').val(getMn(data.data[0].cullAmount));
						$('#samplingCaculation_amount').val(getMn(data.data[0].amount));
						$('#samplingCaculation_num').val(data.data[0].samplingCount);
						if(data.data[0].important != null){
							$('#samplingCaculation_important').val(data.data[0].important);
						}
						if(data.data[0].actualImportant != null){
							$('#samplingCaculation_actualImportant').val(getMn(data.data[0].actualImportant));
						}
						if(data.data[0].risk != null){
							$('#samplingCaculation_risk').val(data.data[0].risk);
						}
						if(data.data[0].control != null){
							$('#samplingCaculation_control').val(data.data[0].control);
						}
						if(data.data[0].analysis != null){
							$('#samplingCaculation_analysis').val(data.data[0].analysis);
						}
						if(data.data[0].pledge != null){
							$('#samplingCaculation_pledge').val(data.data[0].pledge);
						}
						if(data.data[0].variable != null){
							$('#samplingCaculation_variable').val(data.data[0].variable);
						}
						if(data.data[0].calRemark != null){
							$('#samplingCaculation_calRemark').val(data.data[0].calRemark);
						}else{
							$('#samplingCaculation_calRemark').val('');
						}
						if(data.data[0].dataTest != null){
							$('#samplingCaculation_dataTest').val(data.data[0].dataTest);
						}
						if(data.data[0].smallScaleRate != null){
							$('#samplingCaculation_smallScaleRate').val(data.data[0].smallScaleRate);
						}
						if(data.data[0].lowestLevel != null){
							$('#samplingCaculation_lowestLevel').val(data.data[0].lowestLevel);
						}
						if(data.data[0].tocPlan != null){
							$('#samplingCaculation_tocPlan').val(data.data[0].tocPlan);
						}
						samplingCount = data.data[0].samplingCount;
						samplingCalculation(data.data[0].adjustAmount);
					}
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
					$('#modal_samplingCaculation').modal('hide');
				}
			}
		});
		return false;
	}

	//上一步 弹出抽样抽凭范围设置
	function openSamplingSet() {
		$.ajax({
			url: 'finCenter/sampling.querySamplingList.json',
			type: 'post',
			data: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param1: samplingId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if($('#samplingList_method').val() == '7'){
						//截止抽样
						$('#modal_cutoff').modal('show');
						if(data.data[0].cutoffNum != null && data.data[0].cutoffNum != ''){
							$('#cutoff_num').val(data.data[0].cutoffNum);
						}
						if(data.data[0].cutoffAmount != null && data.data[0].cutoffAmount != ''){
							$('#cutoff_amount').val(data.data[0].cutoffAmount);
						}
						if(data.data[0].detailSubjectId != null && data.data[0].detailSubjectId != ''){
							$('#cutoff_subjectid').val(data.data[0].detailSubjectId);
						}else{
							$('#cutoff_subjectid').val(data.data[0].subjectId);
						}
					}else{
						document.getElementById('samplingSet_dataResource').disabled=true;
						if(data.data[0].dataResource != null && data.data[0].dataResource != ''){
							$('#samplingSet_dataResource').val(data.data[0].dataResource);
							$('#samplingSet_dataResource').change();
						}
						if(data.data[0].vchDateType != null && data.data[0].vchDateType != ''){
							$('#samplingSet_dateType').val(data.data[0].vchDateType);
							$('#samplingSet_dateType').change();
						}
						$('#samplingSet_startDate').val(data.data[0].vchDateStart);
						$('#samplingSet_endDate').val(data.data[0].vchDateEnd);
						$('#samplingSet_typeId').val(data.data[0].typeId);
						$('#samplingSet_voucherId').val(data.data[0].oldVoucherId);
						$('#samplingSet_summery').val(data.data[0].summary);
						$('#samplingSet_assitemid').val(data.data[0].assItemId);
						if(data.data[0].detailSubjectId != '' && data.data[0].detailSubjectId != null){
							$('#samplingSet_common_subjectid').val(data.data[0].detailSubjectId);
						}else{
							$('#samplingSet_common_subjectid').val(data.data[0].subjectId);
						}
						if(data.data[0].amountType != null && data.data[0].amountType != ''){
							$('#samplingSet_amountType').val(data.data[0].amountType);
						}
						$('#samplingSet_amountStart').val(data.data[0].amountStart);
						$('#samplingSet_amountEnd').val(data.data[0].amountEnd);
						if(data.data[0].cullAmountType != null && data.data[0].cullAmountType != ''){
							$('#samplingSet_cullAmountType').val(data.data[0].cullAmountType);
						}
						$('#samplingSet_cullAmountStart').val(data.data[0].cullAmountStart);
						$('#samplingSet_cullAmountEnd').val(data.data[0].cullAmountEnd);
						$('#samplingSet_cullReason').val(data.data[0].cullReason);
						$('#samplingSet_subjectid_cull').val(data.data[0].cullSubjectId);
						$('#samplingSet_assitemid_cull').val(data.data[0].detailAssItemId);
						$('#samplingSet_balance_rank').val(data.data[0].balanceRank);
						$('#samplingSet_credit_rank').val(data.data[0].creditRank);
						$('#samplingSet_debit_rank').val(data.data[0].debitRank);
						$('#samplingSet_customize_assitem').val(data.data[0].customizeAssitem);
						// 销毁表
						if ($('#samplingSetTable').hasClass('dataTable')) {
							$('#samplingSetTable').DataTable().clear();
							$('#samplingSetTable').DataTable().destroy();
							$('#samplingSetTable').empty();
						}
						$('#modal-samplingSet').modal('show');
					}
					
					//bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		return false;
	}
	//上一步 打开抽样方式
	$('#modal_samplingCaculation_prev').click(function() {
		openSamplingMode();
		$('#modal_samplingCaculation').modal('hide');
	});
	//上一步 弹出选取样本方法
	$('#modal_samplingInterval_prev').click(function() {
		openSamplingMethod();
		$('#modal_samplingInterval').modal('hide');
	});
	//上一步 弹出选取样本方法
	$('#modal_samplingRange_prev').click(function() {
		openSamplingMethod();
		$('#modal_samplingRange').modal('hide');
	});
	//样本量计算
	$('#samplingCaculation_actualImportant,#samplingCaculation_risk,#samplingCaculation_control,#samplingCaculation_analysis,#samplingCaculation_pledge,#samplingCaculation_variable,#samplingCaculation_dataTest,#samplingCaculation_smallScaleRate,#samplingCaculation_lowestLevel,#samplingCaculation_tocPlan').change(function() {
		samplingCalculation(null);
	});
	//样本量计算
	function samplingCalculation(adjustAmount) {
		var samplingCaculation_r = $('#samplingCaculation_risk').val() - $('#samplingCaculation_control').val() - $('#samplingCaculation_analysis').val() - $('#samplingCaculation_pledge').val() - $('#samplingCaculation_dataTest').val();
		if(sampleModeActual == 3){
			samplingCaculation_r = $('#samplingCaculation_risk').val() - $('#samplingCaculation_analysis').val() - $('#samplingCaculation_pledge').val() - $('#samplingCaculation_dataTest').val();
		}
		if(samplingCaculation_r < 0){
			$('#samplingCaculation_r').val(0);
		}else{
			$('#samplingCaculation_r').val(samplingCaculation_r);
		}
		if($('#samplingCaculation_actualImportant').val() != '' && $('#samplingCaculation_actualImportant').val() != '0.00'){
			var samplingCaculation_initialAmount = getNum($('#samplingCaculation_amount').val()) * $('#samplingCaculation_r').val() / getNum($('#samplingCaculation_actualImportant').val());
			/*if(sampleModeActual == 3){
				samplingCaculation_initialAmount = getNum($('#samplingCaculation_amount').val()) / getNum($('#samplingCaculation_actualImportant').val());
			}*/
			$('#samplingCaculation_initialAmount').val(samplingCaculation_initialAmount.toFixed(2));
			$('#samplingCaculation_total').val(parseInt(samplingCaculation_initialAmount));
			var samplingCaculation_adjustAmount = $('#samplingCaculation_total').val() * $('#samplingCaculation_variable').val();
			if(sampleModeActual == 2){
				samplingCaculation_adjustAmount = $('#samplingCaculation_total').val() * (1 - $('#samplingCaculation_smallScaleRate').val());
				if($('#samplingCaculation_lowestLevel').val() != '' && $('#samplingCaculation_lowestLevel').val() != null){
					samplingCaculation_adjustAmount = parseInt($('#samplingCaculation_lowestLevel').val());
				}
				if($('#samplingCaculation_num').val() > 215){
					$('#samplingCaculation_smallScaleRate').val(0.1);
				}else if($('#samplingCaculation_num').val() > 175){
					$('#samplingCaculation_smallScaleRate').val(0.15);
				}else if($('#samplingCaculation_num').val() > 150){
					$('#samplingCaculation_smallScaleRate').val(0.2);
				}else if($('#samplingCaculation_num').val() > 100){
					$('#samplingCaculation_smallScaleRate').val(0.25);
				}else if($('#samplingCaculation_num').val() > 75){
					$('#samplingCaculation_smallScaleRate').val(0.3);
				}else if($('#samplingCaculation_num').val() > 50){
					$('#samplingCaculation_smallScaleRate').val(0.35);
				}else{
					$('#samplingCaculation_smallScaleRate').val(0.4);
				}
				if($('#samplingCaculation_num').val() <= 40){
					$('#samplingCaculation_lowestLevel_show').removeAttr('style');
				}else{
					$('#samplingCaculation_lowestLevel_show').css('display', 'none');
					$('#samplingCaculation_lowestLevel').val('');
				}
			}if(sampleModeActual == 3 && samplingCaculation_initialAmount != 0){
				if($('#samplingCaculation_tocPlan').val() == '是'){
					if(samplingCaculation_r <= 1){
						if(samplingCaculation_initialAmount < 200){
							samplingCaculation_adjustAmount = 30;
						}else if(samplingCaculation_initialAmount < 300){
							samplingCaculation_adjustAmount = 35;
						}else if(samplingCaculation_initialAmount < 400){
							samplingCaculation_adjustAmount = 45;
						}else if(samplingCaculation_initialAmount < 500){
							samplingCaculation_adjustAmount = 55;
						}else{
							samplingCaculation_adjustAmount = 55 + (parseInt(samplingCaculation_initialAmount/100) - 4) * 5;
						}
					}else if(samplingCaculation_r > 1 && samplingCaculation_r <= 2){
						if(samplingCaculation_initialAmount < 200){
							samplingCaculation_adjustAmount = 40;
						}else if(samplingCaculation_initialAmount < 300){
							samplingCaculation_adjustAmount = 50;
						}else if(samplingCaculation_initialAmount < 400){
							samplingCaculation_adjustAmount = 75;
						}else if(samplingCaculation_initialAmount < 500){
							samplingCaculation_adjustAmount = 90;
						}else{
							samplingCaculation_adjustAmount = 90 + (parseInt(samplingCaculation_initialAmount/100) - 4) * 8;
						}
					}else if(samplingCaculation_r > 2 && samplingCaculation_r <= 2.5){
						if(samplingCaculation_initialAmount < 200){
							samplingCaculation_adjustAmount = 60;
						}else if(samplingCaculation_initialAmount < 300){
							samplingCaculation_adjustAmount = 80;
						}else if(samplingCaculation_initialAmount < 400){
							samplingCaculation_adjustAmount = 105;
						}else if(samplingCaculation_initialAmount < 500){
							samplingCaculation_adjustAmount = 125;
						}else{
							samplingCaculation_adjustAmount = 125 + (parseInt(samplingCaculation_initialAmount/100) - 4) * 10;
						}
					}else if(samplingCaculation_r > 2.5){
						if(samplingCaculation_initialAmount < 200){
							samplingCaculation_adjustAmount = 80;
						}else if(samplingCaculation_initialAmount < 300){
							samplingCaculation_adjustAmount = 95;
						}else if(samplingCaculation_initialAmount < 400){
							samplingCaculation_adjustAmount = 140;
						}else if(samplingCaculation_initialAmount < 500){
							samplingCaculation_adjustAmount = 160;
						}else{
							samplingCaculation_adjustAmount = 160 + (parseInt(samplingCaculation_initialAmount/100) - 4) * 12;
						}
					}
				}else{
					if(samplingCaculation_r <= 1){
						if(samplingCaculation_initialAmount < 200){
							samplingCaculation_adjustAmount = 75;
						}else if(samplingCaculation_initialAmount < 300){
							samplingCaculation_adjustAmount = 90;
						}else if(samplingCaculation_initialAmount < 400){
							samplingCaculation_adjustAmount = 130;
						}else if(samplingCaculation_initialAmount < 500){
							samplingCaculation_adjustAmount = 155;
						}else{
							samplingCaculation_adjustAmount = 155 + (parseInt(samplingCaculation_initialAmount/100) - 4) * 8;
						}
					}else if(samplingCaculation_r > 1 && samplingCaculation_r <= 2){
						if(samplingCaculation_initialAmount < 200){
							samplingCaculation_adjustAmount = 120;
						}else if(samplingCaculation_initialAmount < 300){
							samplingCaculation_adjustAmount = 135;
						}else if(samplingCaculation_initialAmount < 400){
							samplingCaculation_adjustAmount = 180;
						}else if(samplingCaculation_initialAmount < 500){
							samplingCaculation_adjustAmount = 215;
						}else{
							samplingCaculation_adjustAmount = 215 + (parseInt(samplingCaculation_initialAmount/100) - 4) * 10;
						}
					}else if(samplingCaculation_r > 2 && samplingCaculation_r <= 2.5){
						if(samplingCaculation_initialAmount < 200){
							samplingCaculation_adjustAmount = 160;
						}else if(samplingCaculation_initialAmount < 300){
							samplingCaculation_adjustAmount = 180;
						}else if(samplingCaculation_initialAmount < 400){
							samplingCaculation_adjustAmount = 210;
						}else if(samplingCaculation_initialAmount < 500){
							samplingCaculation_adjustAmount = 250;
						}else{
							samplingCaculation_adjustAmount = 250 + (parseInt(samplingCaculation_initialAmount/100) - 4) * 12;
						}
					}else if(samplingCaculation_r > 2.5){
						if(samplingCaculation_initialAmount < 200){
							samplingCaculation_adjustAmount = 210;
						}else if(samplingCaculation_initialAmount < 300){
							samplingCaculation_adjustAmount = 270;
						}else if(samplingCaculation_initialAmount < 400){
							samplingCaculation_adjustAmount = 315;
						}else if(samplingCaculation_initialAmount < 500){
							samplingCaculation_adjustAmount = 375;
						}else{
							samplingCaculation_adjustAmount = 375 + (parseInt(samplingCaculation_initialAmount/100) - 4) * 15;
						}
					}
				}
			}
			$('#samplingCaculation_adjustAmount').val(samplingCaculation_adjustAmount.toFixed(0));
			var samplingCaculation_num = parseInt($('#samplingCaculation_num').val());
			if(samplingCaculation_num < parseInt(samplingCaculation_adjustAmount.toFixed(0))){
				$('#samplingCaculation_adjustAmount').val(samplingCaculation_num.toFixed(0));
			}
		}else{
			$('#samplingCaculation_initialAmount').val(0);
			$('#samplingCaculation_total').val(0);
			$('#samplingCaculation_adjustAmount').val(0);
		}
		samplingCaculation_calAmount = $('#samplingCaculation_adjustAmount').val();
		$('#samplingCaculation_calAmount').val($('#samplingCaculation_adjustAmount').val());
		if(adjustAmount != null){
			$('#samplingCaculation_adjustAmount').val(adjustAmount);
		}
	}
	//样本量保存
	$('#modal_samplingCaculation_next').click(function() {
		var samplingCaculation_adjustAmount = parseInt($('#samplingCaculation_adjustAmount').val());
		var samplingCaculation_num = parseInt($('#samplingCaculation_num').val());
		var samplingCaculation_calAmount = parseInt($('#samplingCaculation_calAmount').val());
		var samplingCaculation_calRemark = $('#samplingCaculation_calRemark').val();
		if(samplingCaculation_adjustAmount <= 0){
			bdoInfoBox('提示', '样本量必须大于0');
			return;
		}
		if(samplingCaculation_adjustAmount > samplingCaculation_num){
			bdoInfoBox('提示', '样本量不能大于剔除后样本总体数量,请修改参数。');
			return;
		}
		if(samplingCaculation_adjustAmount != samplingCaculation_calAmount){
			if(samplingCaculation_calRemark == null || samplingCaculation_calRemark == ''){
				bdoInfoBox('提示', '审计确认样本量与考虑抽样方法后调整的样本量不一致,请填写备注。');
				return;
			}
		}
		$('#samplingCaculation_calRemark').val()
		//bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'finCenter/sampling.saveSamplingCalculation.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId: curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: getNum($('#samplingCaculation_totalAmount').val()),
					param3: getNum($('#samplingCaculation_cullAmount').val()),
					param4: getNum($('#samplingCaculation_amount').val()),
					param5: '',//$('#samplingCaculation_important').val(),
					param6: getNum($('#samplingCaculation_actualImportant').val()),
					param7: $('#samplingCaculation_risk').val(),
					param8: $('#samplingCaculation_control').val(),
					param9: $('#samplingCaculation_analysis').val(),
					param10: $('#samplingCaculation_pledge').val(),
					param11: $('#samplingCaculation_r').val(),
					param12: $('#samplingCaculation_initialAmount').val(),
					param13: $('#samplingCaculation_total').val(),
					param14: $('#samplingCaculation_variable').val(),
					param15: getNum($('#samplingCaculation_adjustAmount').val()),
					param16: samplingCount,
					param17: curSamplingParam.projectId,
					param18: getNum($('#samplingCaculation_calAmount').val()),
					param19: $('#samplingCaculation_calRemark').val(),
					param20: $('#samplingCaculation_dataTest').val(),
					param21: $('#samplingCaculation_smallScaleRate').val(),
					param22: $('#samplingCaculation_lowestLevel').val(),
					param23: $('#samplingCaculation_tocPlan').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						//bdoSuccessBox('成功', data.resultInfo.statusText);
						openSamplingMethod();
						$('#modal_samplingCaculation').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		//});
	});

	//弹出选取样本方法
	function openSamplingMethod() {
		$.ajax({
			url: 'finCenter/sampling.querySamplingList.json',
			type: 'post',
			data: {
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param1: samplingId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if(data.data[0].sampleMethod != '' && data.data[0].sampleMethod != null){
						$('#samplingList_method').val(data.data[0].sampleMethod);
					}
					$('#modal_samplingMethod').modal('show');
					$('#modal_samplingInterval').modal('hide');
					$('#modal_samplistTest').modal('hide');
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		return false;
	}

	//样本量保存
	$('#modal_samplingInterval_next').click(function() {
		if($('#samplingInterval_adjustAmount').val() == ''){
			bdoInfoBox('提示', '样本量不能为空');
			return;
		}
		var samplingInterval_adjustAmount = parseInt($('#samplingInterval_adjustAmount').val());
		var samplingInterval_num = parseInt($('#samplingInterval_num').val());
		if(samplingInterval_adjustAmount <= 0){
			bdoInfoBox('提示', '样本量必须大于0');
			return;
		}
		if(samplingInterval_adjustAmount > samplingInterval_num){
			bdoInfoBox('提示', '样本量不能大于剔除后样本总体数量');
			return;
		}
		//bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'finCenter/sampling.saveSamplingCalculation.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId: curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: getNum($('#samplingInterval_totalAmount').val()),
					param3: getNum($('#samplingInterval_cullAmount').val()),
					param4: getNum($('#samplingInterval_amount').val()),
					param5: '',
					param6: '',
					param7: '',
					param8: '',
					param9: '',
					param10: '',
					param11: '',
					param12: '',
					param13: '',
					param14: '',
					param15: $('#samplingInterval_adjustAmount').val(),
					param16: samplingCount,
					param17: curSamplingParam.projectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						//bdoSuccessBox('成功', data.resultInfo.statusText);
						samplingSetTest();
						$('#modal_samplingInterval').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		//});
	});
	
	//弹出试抽样
	function samplingSetTest() {
		$('#modal_samplistTest').modal('show');
		//清空tab
		clearSamplingStatistics();
		// 销毁表
		if ($('#samplistTestTable').hasClass('dataTable')) {
			$('#samplistTestTable').DataTable().clear();
			$('#samplistTestTable').DataTable().destroy();
			$('#samplistTestTable').empty();
		}
		// 销毁表
		if ($('#samplistTestRepeatTable').hasClass('dataTable')) {
			$('#samplistTestRepeatTable').DataTable().clear();
			$('#samplistTestRepeatTable').DataTable().destroy();
			$('#samplistTestRepeatTable').empty();
		}
		samplingTestProcess();
		return false;
	}
	
	//返回样本量计算
	$('#modal_samplistTest_prev').click(function() {
		$('#modal_samplistTest').modal('hide');
		//截止抽样
		if($('#samplingList_method').val() == '7'){
			openSamplingSet();
		}else if($('#samplingList_method').val() == '8'){
			//自定义抽凭
			openSamplingSet();
		}else{
			openSamplingMethod();
		}
	});
	//试抽样
	$('#modal_samplistTest_test').click(function() {
		bdoConfirmBox('抽凭', '确认抽凭？', function() {
			samplingTestProcess();
		});
	});
	function samplingTestProcess() {
		calculationParam.param25 = samplingId;
		calculationParam.param24 = $('#samplingList_method').val();
		bdoInProcessingBox('抽凭中');
		$.ajax({
			url: 'finCenter/sampling.saveSamplingTest.json',
			type: 'post',
			data: calculationParam,
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
					if(data.data != null){
						//$('#voucherIdNum').html(' 凭证数量：' + data.data[0].voucherIdNum);
					}else{
						$('#voucherIdNum').html('');
					}
					if(calculationParam.param15 == '1' || calculationParam.param24 == '7'){
						sampleTest_view.localParam.urlparam = cloneObjectFn(sampleDetail_view.localParam.urlparam);
						sampleTest_view.localParam.urlparam.sqlId = 'FINCP100007';
						sampleTest_view.localParam.urlparam.param16 =  $('#dgSamplingInfo_sampleMethod').val();
						sampleTest_view.localParam.urlparam.param14 =  samplingId;
						sampleTest_view.localParam.urlparam.param21 = '';
						sampleTest_view.localParam.urlparam.param22 = '';
						sampleTest_view.localParam.urlparam.param23 = '1';
						BdoDataTable('samplistTestTable', sampleTest_view);
						sampleRepeat_view.localParam.urlparam = cloneObjectFn(sampleDetail_view.localParam.urlparam);
						sampleRepeat_view.localParam.urlparam.sqlId = 'FINCP100007';
						sampleRepeat_view.localParam.urlparam.param16 =  $('#dgSamplingInfo_sampleMethod').val();
						sampleRepeat_view.localParam.urlparam.param14 =  samplingId;
						sampleRepeat_view.localParam.urlparam.param21 = '';
						sampleRepeat_view.localParam.urlparam.param22 = '1';
						sampleRepeat_view.localParam.urlparam.param23 = '';
						BdoDataTable('samplistTestRepeatTable', sampleRepeat_view);
						/** 行双击 */
						$('#samplistTestTable tbody').on('dblclick', 'tr', function() {
							var object = $('#samplistTestTable').DataTable().row(this).data();
							//voucherTab('tabs_sample', object.customerId, object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
						});
					}else if(calculationParam.param15 == '2'){
						assItemTest_view.localParam.urlparam = assItemDetail_view.localParam.urlparam;
						assItemTest_view.localParam.urlparam.sqlId = 'FA30069';
						BdoDataTable('samplistTestTable', assItemTest_view);
					}else if(calculationParam.param15 == '3'){
						accountTest_view.localParam.urlparam = accountDetail_view.localParam.urlparam;
						accountTest_view.localParam.urlparam.sqlId = 'FA30070';
						BdoDataTable('samplistTestTable', accountTest_view);
					}

				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}
	/** table 属性 */
	var sampleTest_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.findSamplingTestData.json',
			urlparam: {

				sqlId: 'FINCP100007',
				menuId: window.sys_menuId,
				param1: $('#samplingSet_startDate').val(),
				param2: $('#samplingSet_endDate').val(),
				param3: '',
				param4: '',
				param5: $('#samplingSet_typeId').val(),
				param6: $('#samplingSet_voucherId').val(),
				param7: $('#samplingSet_summery').val(),
				param8: $('#samplingSet_amountStart').val(),
				param9: $('#samplingSet_amountEnd').val(),
				param10: '',
				param11: $('#samplingSet_subjectid').val(),
				param12: '',
				param13: '',
				param14: samplingId,
				param15: $('#samplingSet_dataResource').val(),
				param16: $('#dgSamplingInfo_sampleMethod').val(),
				param21: $('#samplingSet_assitemid').val(),
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			scrollX: true,
			scrollY: false,
			autoWidth: false,
			//order: [2, 'asc'],
			pageLength: 30,
			createdRow(row, data, dataIndex) {
				if(tempOldVoucherId != data.oldVoucherId){
					if(color == color1){
						color = color2;
					}else{
						color = color1;
					}
					tempOldVoucherId = data.oldVoucherId;
				}
				$(row).children("td").eq(2).css({"background-color":color});
				$(row).children("td").eq(3).css({"background-color":color});
				$(row).children("td").eq(4).css({"background-color":color});
			},
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '80px',
					filter: {
						type: 'date'
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: '20px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '10px'
				}, {
					targets: 4,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px'
				}, {
					targets: 5,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'

				}, {
					targets: 6,
					className: 'text-left',
					title: '科目全路径',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '200px'
				}, {
					targets: 7,
					className: 'text-left',
					title: '核算类型',
					name: 'assTotalName',
					data: 'assTotalName',
					width: '200px'
				}, {
					targets: 8,
					className: 'text-left',
					title: '对方科目',
					name: 'oppositeAccountLast',
					data: 'oppositeAccountLast',
					width: '200px',
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}
				}, {
					targets: 9,
					className: 'text-right',
					title: '借方发生金额',
					name: 'debitValue',
					data: 'debitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 10,
					className: 'text-right',
					title: '贷方发生金额',
					name: 'crebitValue',
					data: 'crebitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};
	/** table 属性 */
	var sampleRepeat_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.findSamplingTestData.json',
			urlparam: {

				sqlId: 'FINCP100007',
				menuId: window.sys_menuId,
				param1: $('#samplingSet_startDate').val(),
				param2: $('#samplingSet_endDate').val(),
				param3: '',
				param4: '',
				param5: $('#samplingSet_typeId').val(),
				param6: $('#samplingSet_voucherId').val(),
				param7: $('#samplingSet_summery').val(),
				param8: $('#samplingSet_amountStart').val(),
				param9: $('#samplingSet_amountEnd').val(),
				param10: '',
				param11: $('#samplingSet_subjectid').val(),
				param12: '',
				param13: '',
				param14: samplingId,
				param15: $('#samplingSet_dataResource').val(),
				param16: $('#dgSamplingInfo_sampleMethod').val(),
				param21: $('#samplingSet_assitemid').val(),
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			scrollX: true,
			scrollY: false,
			autoWidth: false,
			//order: [2, 'asc'],
			pageLength: 30,
			createdRow(row, data, dataIndex) {
				if(tempOldVoucherId != data.oldVoucherId){
					if(color == color1){
						color = color2;
					}else{
						color = color1;
					}
					tempOldVoucherId = data.oldVoucherId;
				}
				$(row).children("td").eq(2).css({"background-color":color});
				$(row).children("td").eq(3).css({"background-color":color});
				$(row).children("td").eq(4).css({"background-color":color});
			},
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '80px',
					filter: {
						type: 'date'
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: '20px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '10px'
				}, {
					targets: 4,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px'
				}, {
					targets: 5,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'

				}, {
					targets: 6,
					className: 'text-left',
					title: '科目全路径',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '200px'
				}, {
					targets: 7,
					className: 'text-right',
					title: '借方发生金额',
					name: 'debitValue',
					data: 'debitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-right',
					title: '贷方发生金额',
					name: 'crebitValue',
					data: 'crebitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};
	/** table 属性 */
	var sampleCull_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.findSamplingTestData.json',
			urlparam: {

				sqlId: 'FINCP100007',
				menuId: window.sys_menuId,
				param1: $('#samplingSet_startDate').val(),
				param2: $('#samplingSet_endDate').val(),
				param3: '',
				param4: '',
				param5: $('#samplingSet_typeId').val(),
				param6: $('#samplingSet_voucherId').val(),
				param7: $('#samplingSet_summery').val(),
				param8: $('#samplingSet_amountStart').val(),
				param9: $('#samplingSet_amountEnd').val(),
				param10: '',
				param11: $('#samplingSet_subjectid').val(),
				param12: '',
				param13: '',
				param14: samplingId,
				param15: $('#samplingSet_dataResource').val(),
				param16: $('#dgSamplingInfo_sampleMethod').val(),
				param21: $('#samplingSet_assitemid').val(),
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			scrollX: true,
			scrollY: false,
			autoWidth: false,
			//order: [2, 'asc'],
			pageLength: 30,
			createdRow(row, data, dataIndex) {
				if(tempOldVoucherId != data.oldVoucherId){
					if(color == color1){
						color = color2;
					}else{
						color = color1;
					}
					tempOldVoucherId = data.oldVoucherId;
				}
				$(row).children("td").eq(2).css({"background-color":color});
				$(row).children("td").eq(3).css({"background-color":color});
				$(row).children("td").eq(4).css({"background-color":color});
			},
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '80px',
					filter: {
						type: 'date'
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: '20px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '10px'
				}, {
					targets: 4,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px'
				}, {
					targets: 5,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'

				}, {
					targets: 6,
					className: 'text-left',
					title: '科目全路径',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '200px'
				}, {
					targets: 7,
					className: 'text-right',
					title: '借方发生金额',
					name: 'debitValue',
					data: 'debitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-right',
					title: '贷方发生金额',
					name: 'crebitValue',
					data: 'crebitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};

	/** table 属性 */
	var assItemTest_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.findSamplingTestData.json',
			urlparam: {

				sqlId: 'FA30069',
				menuId: window.sys_menuId,
				param1: '',
				param2: '',
				param3: '',
				param4: '',
				param5: '',
				param6: '',
				param7: '',
				param8: $('#samplingSet_amountStart').val(),
				param9: $('#samplingSet_amountEnd').val(),
				param10: '',
				param11: $('#samplingSet_subjectid').val(),
				param14: samplingId,
				param15: $('#samplingSet_dataResource').val(),
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId: curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			//order: [2, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: 2,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '150px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '核算项目编号',
					name: 'assItemId',
					data: 'assItemId',
					width: '200px'
				}, {
					targets: 4,
					className: 'text-left',
					title: '核算项目名称',
					name: 'fullName',
					data: 'fullName',
					width: '250px'
				}, {
					targets: 5,
					className: 'text-center',
					title: '币种',
					name: 'currency',
					data: 'currency',
					width: '30px'
				}, {
					targets: 6,
					className: 'text-center',
					title: '方向',
					name: 'qcWay',
					data: 'qcWay',
					width: '30px'

				}, {
					targets: 7,
					className: 'text-right',
					title: '期初余额',
					name: 'remainF',
					data: 'remainF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitOccF',
					data: 'debitOccF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 9,
					className: 'text-right',
					title: '贷方发生额',
					name: 'creditOccF',
					data: 'creditOccF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 10,
					className: 'text-right',
					title: '期末余额',
					name: 'balanceF',
					data: 'balanceF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};

	/** table 属性 */
	var accountTest_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.findSamplingTestData.json',
			urlparam: {

				sqlId: 'FA30070',
				menuId: window.sys_menuId,
				param1: '',
				param2: '',
				param3: '',
				param4: '',
				param5: '',
				param6: '',
				param7: '',
				param8: $('#samplingSet_amountStart').val(),
				param9: $('#samplingSet_amountEnd').val(),
				param10: '',
				param11: $('#samplingSet_subjectid').val(),
				param14: samplingId,
				param15: $('#samplingSet_dataResource').val(),
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId: curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			//order: [2, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: 2,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '150px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '科目名称',
					name: 'fullName',
					data: 'fullName',
					width: '250px'
				}, {
					targets: 4,
					className: 'text-center',
					title: '币种',
					name: 'currency',
					data: 'currency',
					width: '30px'
				}, {
					targets: 5,
					className: 'text-center',
					title: '方向',
					name: 'qcWay',
					data: 'qcWay',
					width: '30px'

				}, {
					targets: 6,
					className: 'text-right',
					title: '期初余额',
					name: 'remainF',
					data: 'remainF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 7,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitOccF',
					data: 'debitOccF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-right',
					title: '贷方发生额',
					name: 'creditOccF',
					data: 'creditOccF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 9,
					className: 'text-right',
					title: '期末余额',
					name: 'balanceF',
					data: 'balanceF',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};
	/** 对话框table初始化参数*/
	var samplingRange_view = {
		localParam: {
			tabNum: false,
			url: 'finCenter/Sampling.querySamplingRange.json',
			urlparam: {
				sqlId: 'FA30077',
				menuId: window.sys_menuId,
				param1: samplingId,
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param2: curSamplingParam.projectId
			}
		},
		tableParam: {
			pageLength: 1000,
			//data: initData,
			dom: '<"row"<"col-sm-12"tr>>',
			ordering: false,
			lengthChange: false,
			select: false,
			scrollY: false,
			//stateSave : false,
			//rowGroup : {dataSrc : 2},
			createdRow: function(row, data, index) {
				if(index == 0){
					tempTotalSamplingCount = 0;
				}
				if(data.samplingCount != '' && data.samplingCount != null){
					tempTotalSamplingCount = tempTotalSamplingCount + parseInt(data.samplingCount);
				}
				var adjustAmount = $('#samplingCaculation_adjustAmount').val();
				$('#samplingRangeMessage').html('第三步:样本量计算' + ' （审计样本确认量：' + adjustAmount + ' 抽凭数：' + tempTotalSamplingCount + ' 差异：' + (adjustAmount - tempTotalSamplingCount) + '）');
			},
			drawCallback() {

			},
			columns: [
				{
					title: '金额区间起',
					className: 'text-right',
					width: '150px',
					data: 'startAmount',
					render: function(data, type, row, meta) {
						type = 'disabled';
						if(data != null){
							return '<input class="form-control" type="text" name="startAmount" value="' + data + '" style="text-align:right" ' + type + '>';
						}else{
							return '<input class="form-control" type="text" name="startAmount" value="" style="text-align:right" ' + type + '>';
						}
					}
				}, {
					title: '金额区间止',
					className: 'text-right',
					width: '150px',
					data: 'endAmount',
					render: function(data, type, row, meta) {
						type = 'disabled';
						if(data != null){
							return '<input class="form-control" type="text" name="endAmount" value="' + data + '" style="text-align:right" ' + type + '>';
						}else{
							return '<input class="form-control" type="text" name="endAmount" value="" style="text-align:right" ' + type + '>';
						}
						
					}
				}, {
					title: '总数',
					className: 'text-right',
					width: '150px',
					data: 'totalCount',
					render: function(data, type, row, meta) {
						type = 'disabled';
						if(data != null){
							return '<input class="form-control" type="text" name="totalCount" value="' + data + '" style="text-align:right" ' + type + '>';
						}else{
							return '<input class="form-control" type="text" name="totalCount" value="" style="text-align:right" ' + type + '>';
						}
					}
				}, {
					title: '抽样数',
					className: 'text-right',
					width: '150px',
					data: 'samplingCount',
					render: function(data, type, row, meta) {
						if(data != null){
							return '<input class="form-control" type="text" name="samplingCount" value="' + data + '" style="text-align:right" ' + type + '>';
						}else{
							return '<input class="form-control" type="text" name="samplingCount" value="" style="text-align:right" ' + type + '>';
						}
					}
				}, {
					title: 'id',
					className: 'hidden',
					width: '50px',
					data: 'autoId',
					render: function(data, type, row, meta) {
						type = 'disabled';
						if(data != null){
							return '<input class="form-control" type="text" name="autoId" value="' + data + '" style="text-align:right" ' + type + '>';
						}else{
							return '<input class="form-control" type="text" name="autoId" value="" style="text-align:right" ' + type + '>';
						}
					}
				}
			]
		}
	};
	//弹出样本量计算
	$('#btn_samplingRange_set').click(function() {
		samplingRangeSet_view.localParam.urlparam.param1 = samplingId;
		BdoDataTable('samplingRangeSetTable', samplingRangeSet_view);
		$('#modal_samplingRangeSet').modal('show');
	});
	/** 对话框table初始化参数*/
	var samplingRangeSet_view = {
		localParam: {
			tabNum: false,
			url: 'finCenter/Sampling.querySamplingRangeSet.json',
			urlparam: {
				sqlId: 'FA30077',
				menuId: window.sys_menuId,
				param1: samplingId,
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId: curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param2: curSamplingParam.projectId
			}
		},
		tableParam: {
			pageLength: 100,
			//data: initData,
			dom: '<"row"<"col-sm-12"tr>>',
			ordering: false,
			lengthChange: false,
			select: false,
			scrollY: false,
			bdolxLoader: true,
			//stateSave : false,
			//rowGroup : {dataSrc : 2},
			columns: [
				{
					targets: 1,
					title: '处理',
					width: '50px',
					className: 'text-center',
					render: function(data, type, row, meta) {
						//设置操作按钮，第一行可以添加行，至少有两行，第一行第二行
						var styleName = '';
						var deleteStyle = '';
						var renderStr = '<input class="form-control" type="hidden" name="jnautoId" value="' + row.autoId + '">';
						//renderStr += '<input class="form-control" type="hidden" name="jnautoReason" value="' + row.reason + '">';
						//if (row.showAdd) {
							//styleName = 'style="visibility:hidden" disabled';
						//}
						if (row.showDelete) {
							deleteStyle = 'style="visibility:hidden" disabled';
						}
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="jnadjust_plus_row" data-placement="top" title="添加一行" ' + styleName + '><i class="fa fa-plus""></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="jnDelete" data-placement="top" title="删除" data-toggle="tooltip " ' + deleteStyle + '><i class="fa fa-times"></i></button>';
						return renderStr;
					}
				}, {
					targets: 2,
					title: '金额区间起',
					className: 'text-right',
					width: '150px',
					data: 'startAmount',
					render: function(data, type, row, meta) {
						//type = 'disabled';
						if(data != null){
							return '<input class="form-control" type="text" name="startAmount" value="' + data + '" style="text-align:right" ' + type + '>';
						}else{
							return '<input class="form-control" type="text" name="startAmount" value="" style="text-align:right" ' + type + '>';
						}
					}
				}, {
					targets: 3,
					title: '金额区间止',
					className: 'text-right',
					width: '150px',
					data: 'endAmount',
					render: function(data, type, row, meta) {
						/*if(row.endName == '∞'){
							type = 'disabled';
							return '<input class="form-control" type="text" name="endAmount" value="∞" style="text-align:right" ' + type + '>';
						}else{*/
							if(data != null){
								return '<input class="form-control" type="text" name="endAmount" value="' + data + '" style="text-align:right" ' + type + '>';
							}else{
								return '<input class="form-control" type="text" name="endAmount" value="" style="text-align:right" ' + type + '>';
							}
						//}
						
					}
				}
			]
		}
	};
	// 修改金额区间
	$('#samplingRangeSetContent').on('blur', '[name="endAmount"]', function(event) {
		var nextRow = $(this).closest('tr').next();
		nextRow.find('[name="startAmount"]').val($(this).val());
	});
	//添加行
	$('#samplingRangeSetContent').on('click', 'button[name="jnadjust_plus_row"]', function(event) {
		window.editId = 0;
		var endAmount = $(this).closest('tr').find('[name=endAmount]').val();
		$(this).closest('table').DataTable().row.add({
			startAmount: endAmount,
			endAmount: '',
			totalCount: '',
			samplingCount: '',
			startName: '',
			endName: ''
		}).draw();
	});
	//删除
	$('#samplingRangeSetContent').on('click', 'button[name="jnDelete"]', function(event) {
		var nodeId = $(this).closest('table').attr('id');//此table的Id
		var $table = $('#' + nodeId);//此table
		var _this = $(this);//此按钮
		var row = $table.DataTable().row([_this.closest('tr').index()]);//行
		var object = $table.DataTable().data()[_this.closest('tr').index()];//行数据

		row.remove().draw();
		$table.find('[name=jnadjust_plus_row]').eq(0).css('visibility', 'visible').prop('disabled', false);


	});
	//保存自定义区间
	$('#modal_samplingRangeSet_sure').click(function() {
		var tb = [];
		var len = $('#samplingRangeSetTable').DataTable().data().length;
		var i = 1;
		var message = '';

		$('#samplingRangeSetTable').find('tbody tr').each(function() {
			var startAmount = $(this).find('[name="startAmount"]').val();
			var endAmount = $(this).find('[name="endAmount"]').val();
			if(startAmount == '' && i != 1){
				message = '金额不能为空';
				return false;
			}
			if(endAmount == '' && i != len){
				message = '金额不能为空';
				return false;
			}
			if(parseFloat(startAmount) >= parseFloat(endAmount)){
				message = '开始金额不能大于等于结束金额';
				return false;
			}
			tb.push({
				startAmount: startAmount,
				endAmount: endAmount
			});
			i = i + 1;
		});

		if(message != ''){
			bdoInfoBox('提示', message);
			return false;
		}
		bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'finCenter/sampling.saveSamplingRangeSet.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId: curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: JSON.stringify(tb),
					param3: curSamplingParam.projectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						samplingRange_view.localParam.urlparam.param1 = samplingId;
						BdoDataTable('samplingRangeTable', samplingRange_view);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
					$('#modal_samplingRangeSet').modal('hide');
				}
			});
		});
	});
	// 自定义区间样本量提示
	$('#samplingRangeTable').on('blur', '[name="samplingCount"]', function(event) {
		rangeMessage();
	});
	function rangeMessage() {
		var totalSamplingCount = 0;
		$('#samplingRangeTable').find('tbody tr').each(function() {
			var samplingCount = $(this).find('[name="samplingCount"]').val();
			if(samplingCount != ''){
				totalSamplingCount = totalSamplingCount + parseInt(samplingCount);
			}
		})
		var adjustAmount = $('#samplingCaculation_adjustAmount').val();
		$('#samplingRangeMessage').html('第三步:样本量计算' + ' （审计样本确认量：' + adjustAmount + ' 抽凭数：' + totalSamplingCount + ' 差异：' + (adjustAmount - totalSamplingCount) + '）');
	}
	//保存自定义区间
	$('#modal_samplingRange_next').click(function() {
		var tb = [];
		var len = $('#samplingRangeTable').DataTable().data().length;
		var i = 1;
		var message = '';
		var totalSamplingCount = 0;
		$('#samplingRangeTable').find('tbody tr').each(function() {
			var startAmount = $(this).find('[name="startAmount"]').val();
			var endAmount = $(this).find('[name="endAmount"]').val();
			var totalCount = $(this).find('[name="totalCount"]').val();
			var samplingCount = $(this).find('[name="samplingCount"]').val();
			var autoId = $(this).find('[name="autoId"]').val();
			if(samplingCount != ''){
				if(parseInt(samplingCount) > parseInt(totalCount)){
					message = '抽凭数不能大于总数';
					return false;
				}
				totalSamplingCount = totalSamplingCount + parseInt(samplingCount);
			}

			tb.push({
				startAmount: startAmount,
				endAmount: endAmount,
				totalCount: totalCount,
				samplingCount: samplingCount,
				autoId: autoId
			});
			i = i + 1;
		});
		if(message != ''){
			bdoInfoBox('提示', message);
			return false;
		}
		if(totalSamplingCount == 0){
			bdoInfoBox('提示', '抽凭数不能为0');
			return false;
		}
		if(totalSamplingCount != $('#samplingCaculation_adjustAmount').val()){
			bdoInfoBox('提示', '抽凭数必须等于审计确认样本量');
			return false;
		}
		//bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'finCenter/sampling.saveSamplingRange.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId: curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: JSON.stringify(tb),
					param3: curSamplingParam.projectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						//bdoSuccessBox('成功', data.resultInfo.statusText);
						samplingSetTest();
						$('#modal_samplingRange').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		//});
	});
	
	/** 统计 */
	$('#modal_samplistTest_statistics').click(function() {
		samplingStatisticsTab('tabs_sample', curSamplingParam.customerId, samplingId, '1', agrs);
	});
	/** 统计 */
	$('#modal_samplistResult_statistics').click(function() {
		samplingStatisticsTab('tabs_sampleResult', curSamplingParam.customerId, samplingId, '1', agrs);
	});
	/** 弹出抽样抽凭结果 */
	$('#samplingListTable').on('click', 'button[name="samplingResultBtn"]', function() {
		//清空tab
		clearSamplingStatistics();
		var object = $('#samplingListTable').DataTable().data()[$(this).closest('tr').index()];
		if(object.sampleStatus != '3'){
			bdoInfoBox('提示', "抽凭未完成！");
			return;
		}
		SamplingResult({region: '#samplistResultPage', data: agrs.data, samplingId: object.autoId});
		$('#modal_samplistResult1').modal('show');
		return;
		/*if(object.sampleMethod == '7'){
			//截止抽样
			document.getElementById('samplistResult_search1').style.display='none';
			document.getElementById('samplistResult_search2').style.display='none';
			document.getElementById('samplistResult_cutoff').style.display='block';
			document.getElementById('samplistResult_cutoff_num').disabled=true;
			document.getElementById('samplistResult_cutoff_amount').disabled=true;
			if(object.cutoffNum != null && object.cutoffNum != ''){
				$('#samplistResult_cutoff_num').val(object.cutoffNum);
			}
			if(object.cutoffAmount != null && object.cutoffAmount != ''){
				$('#samplistResult_cutoff_amount').val(object.cutoffAmount);
			}
		}else{
			document.getElementById('samplistResult_search1').style.display='block';
			document.getElementById('samplistResult_search2').style.display='block';
			document.getElementById('samplistResult_cutoff').style.display='none';
			document.getElementById('samplistResult_dataResource').disabled=true;
			if(object.dataResource != null && object.dataResource != ''){
				$('#samplistResult_dataResource').val(object.dataResource);
				$('#samplistResult_dataResource').change();
			}
			document.getElementById('samplistResult_customerId').disabled=true;
			$('#samplistResult_customerId').val(object.customerId);
			document.getElementById('samplistResult_dateType').disabled=true;
			if(object.vchDateType != null && object.vchDateType != ''){
				$('#samplistResult_dateType').val(object.vchDateType);
				$('#samplistResult_dateType').change();
			}
			document.getElementById('samplistResult_startDate').disabled=true;
			$('#samplistResult_startDate').val(object.vchDateStart);
			document.getElementById('samplistResult_endDate').disabled=true;
			$('#samplistResult_endDate').val(object.vchDateEnd);
			document.getElementById('samplistResult_subjectid').disabled=true;
			$('#samplistResult_subjectid').val(object.subjectId);
			document.getElementById('samplistResult_typeId').disabled=true;
			$('#samplistResult_typeId').val(object.typeId);
			document.getElementById('samplistResult_voucherId').disabled=true;
			$('#samplistResult_voucherId').val(object.oldVoucherId);
			document.getElementById('samplistResult_summery').disabled=true;
			$('#samplistResult_summery').val(object.summary);
			document.getElementById('samplistResult_assitemid').disabled=true;
			$('#samplistResult_assitemid').val(object.assItemId);
			document.getElementById('samplistResult_amountType').disabled=true;
			if(object.amountType != null && object.amountType != ''){
				$('#samplistResult_amountType').val(object.amountType);
			}
			document.getElementById('samplistResult_amountStart').disabled=true;
			$('#samplistResult_amountStart').val(object.amountStart);
			document.getElementById('samplistResult_amountEnd').disabled=true;
			$('#samplistResult_amountEnd').val(object.amountEnd);
		}*/
		var sampleMethodDicData = DicJsonlData.responseJSON['抽样方式'];
		var typeIdDicData = DicJsonlData.responseJSON['凭证字'];
		var riskDicData = DicJsonlData.responseJSON['错报风险等级'];
		var controlDicData = DicJsonlData.responseJSON['控制测试获取的保证程度'];
		var analysisDicData = DicJsonlData.responseJSON['实质性分析程序获取的保证程度'];
		var pledgeDicData = DicJsonlData.responseJSON['从其他OSP获取的保证程度'];
		var variableDicData = DicJsonlData.responseJSON['是否能够应对样本总体的变量因素'];
		var condition = '';
		if(object.sampleMethod !== '7'){
			condition = condition + '<table border= "1" width="1000"><tr><td rowspan="8" algin="center" width="25%">抽样条件</td><td width="25%">科目</td>';
			if(object.subjectName != '' && object.subjectName != null){
				condition = condition + '<td colspan="2">' + object.subjectName + '</td></tr>';
			}else{
				condition = condition + '<td colspan="2"></td></tr>';
			}
			condition = condition + '<tr><td>抽凭方式</td><td colspan="2">' + sampleMethodDicData[object.sampleMethod] + '</td></tr>';
			if(object.vchDateStart == object.vchDateEnd){
				condition = condition + '<tr><td>抽凭期间</td><td colspan="2">' + object.vchDateStart + '</td></tr>';
			}else{
				condition = condition + '<tr><td>抽凭期间</td><td colspan="2">' + object.vchDateStart + '-' + object.vchDateEnd + '</td></tr>';
			}
			if(object.assItemName != '' && object.assItemName != null){
				condition = condition + '<tr><td>核算类型</td><td colspan="2">' + object.assItemName + '</td></tr>';
			}else{
				condition = condition + '<tr><td>核算类型</td><td colspan="2"></td></tr>';
			}
			var amountStart = '';
			var amountEnd = '';
			var amount = '';
			if(object.amountStart != null){
				amountStart = object.amountStart;
			}
			if(object.amountEnd != null){
				amountEnd = object.amountEnd;
			}
			if(amountStart != '' && amountEnd == ''){
				amount = '大于等于' + amountStart;
			}else if(amountStart == '' && amountEnd != ''){
				amount = '小于等于' + amountEnd;
			}else{
				amount = amountStart + '-' + amountEnd;
			}
			var amountType = '';
			if(object.amountType == '1'){
				amountType = '借方发生额';
			}else if(object.amountType == '-1'){
				amountType = '贷方发生额';
			}else{
				amountType = '借方或贷方发生额';
			}
			condition = condition + '<tr><td>抽凭范围</td><td width="25%">' + amountType + '</td><td width="25%">' + amount + '</td></tr>';
			if(object.cullSubjectName != '' && object.cullSubjectName != null){
				condition = condition + '<tr><td rowspan="3">剔除条件</td><td>对方科目</td><td>' + object.cullSubjectName + '</td></tr>';
			}else{
				condition = condition + '<tr><td rowspan="3">剔除条件</td><td>对方科目</td><td></td></tr>';
			}
			var cullAmountStart = '';
			var cullAmountEnd = '';
			var cullAmount = '';
			if(object.cullAmountStart != null){
				cullAmountStart = object.cullAmountStart;
			}
			if(object.cullAmountEnd != null){
				cullAmountEnd = object.cullAmountEnd;
			}
			if(amountStart != '' && amountEnd == ''){
				cullAmount = '大于等于' + cullAmountStart;
			}else if(amountStart == '' && amountEnd != ''){
				cullAmount = '小于等于' + cullAmountEnd;
			}else{
				cullAmount = cullAmountStart + '-' + cullAmountEnd;
			}
			var cullAmountType = '';
			if(object.cullAmountType == '1'){
				cullAmountType = '借方发生额';
			}else if(object.cullAmountType == '-1'){
				cullAmountType = '贷方发生额';
			}else{
				cullAmountType = '借方或贷方发生额';
			}
			condition = condition + '<tr><td>' + cullAmountType + '</td><td>' + cullAmount + '</td></tr>';
			condition = condition + '<tr><td>剔除原因</td><td>' + object.cullReason + '</td></tr>';
			condition = condition + '</table>';
		}else{
			condition = condition + '<table border= "1" width="1000"><tr><td rowspan="4" algin="center">抽样条件</td><td>科目</td>';
			if(object.subjectName != '' && object.subjectName != null){
				condition = condition + '<td colspan="2">' + object.subjectName + '</td></tr>';
			}else{
				condition = condition + '<td colspan="2"></td></tr>';
			}
			condition = condition + '<tr><td>抽凭方式</td><td colspan="2">' + sampleMethodDicData[object.sampleMethod] + '</td></tr>';
		}
		
		
		/*var condition = '<div class="form-group">抽凭方式：' + sampleMethodDicData[object.sampleMethod] + '</div>';
		condition = condition + '<div class="form-group">客户：' + BDO_CUSTOMER_SELECT + '-' + BDO_CUSTOMERNAME_SELECT + '</div>';
		if(object.vchDateStart == object.vchDateEnd){
			condition = condition + '<div class="form-group">凭证日期：' + object.vchDateStart + '</div>';
		}else{
			condition = condition + '<div class="form-group">凭证日期：' + object.vchDateStart + '-' + object.vchDateEnd + '</div>';
		}
		if(object.subjectName != '' && object.subjectName != null){
			condition = condition + '<div class="form-group">科目：' + object.subjectName + '</div>';
		}else{
			condition = condition + '<div class="form-group">科目：</div>';
		}
		if(object.sampleMethod !== '7'){
			if(object.typeId != '' && object.typeId != null){
				condition = condition + '<div class="form-group">字：' + typeIdDicData[object.typeId] + '</div>';
			}else{
				condition = condition + '<div class="form-group">字：</div>';
			}
			if(object.oldVoucherId != '' && object.oldVoucherId != null){
				condition = condition + '<div class="form-group">号：' + object.oldVoucherId + '</div>';
			}else{
				condition = condition + '<div class="form-group">号：</div>';
			}
			condition = condition + '<div class="form-group">摘要：' + object.summary + '</div>';
			if(object.assItemName != '' && object.assItemName != null){
				condition = condition + '<div class="form-group">核算类型：' + object.assItemName + '</div>';
			}else{
				condition = condition + '<div class="form-group">核算类型：</div>';
			}
			var amountStart = '';
			var amountEnd = '';
			if(object.amountStart != null){
				amountStart = object.amountStart;
			}
			if(object.amountEnd != null){
				amountEnd = object.amountEnd;
			}
			if(object.amountType == '1'){
				condition = condition + '<div class="form-group">借方发生额：' + amountStart + '-' + amountEnd + '</div>';
			}else if(object.amountType == '-1'){
				condition = condition + '<div class="form-group">贷方发生额：' + amountStart + '-' + amountEnd + '</div>';
			}else{
				condition = condition + '<div class="form-group">借方或贷方发生额：' + amountStart + '-' + amountEnd + '</div>';
			}
			var cullAmountStart = '';
			var cullAmountEnd = '';
			if(object.cullAmountStart != null){
				cullAmountStart = object.cullAmountStart;
			}
			if(object.cullAmountEnd != null){
				cullAmountEnd = object.cullAmountEnd;
			}
			if(object.cullAmountStart == '1'){
				condition = condition + '<div class="form-group">剔除借方发生额：' + cullAmountStart + '-' + cullAmountEnd + '</div>';
			}else if(object.cullAmountStart == '-1'){
				condition = condition + '<div class="form-group">剔除贷方发生额：' + cullAmountStart + '-' + cullAmountEnd + '</div>';
			}else{
				condition = condition + '<div class="form-group">剔除借方或贷方发生额：' + cullAmountStart + '-' + cullAmountEnd + '</div>';
			}
			if(object.cullSubjectName != '' && object.cullSubjectName != null){
				condition = condition + '<div class="form-group">剔除科目：' + object.cullSubjectName + '</div>';
			}else{
				condition = condition + '<div class="form-group">剔除科目：</div>';
			}
			condition = condition + '<div class="form-group">剔除原因：' + object.cullReason + '</div>';
		}*/
		$.ajax({
			url: 'finCenter/sampling.querySamplingCondition.json',
			type: 'post',
			data: {
				lockCustomerId: object.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId,
				param1: object.autoId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					//bdoSuccessBox('成功', data.resultInfo.statusText);
					if(object.sampleMethod == '7'){
						condition = condition + '<tr><td>截止抽样张数</td><td colspan="2">' + object.cutoffNum + '</td></tr>';
						if(object.cutoffAmount != null && object.cutoffAmount != ''){
							condition = condition + '<tr><td>截止抽样金额</td><td colspan="2">' + '大于等于' + object.cutoffAmount + '</td></tr>';
						}else{
							condition = condition + '<tr><td>截止抽样金额</td><td colspan="2"></td></tr>';
						}
						condition = condition + '</table>';
					}else if(object.sampleMethod == '3'){
						condition = condition + '<br>';
						condition = condition + '<table border= "1" width="1000"><tr><td rowspan="' + (data.data[0].range.length + 1) + '" algin="center" width="20%">自定义金额范围</td><td width="20%">大于等于</td><td width="20%">小于</td><td width="20%">总数</td><td width="20%">抽样数</td></tr>';
						for(var i = 0;i < data.data[0].range.length;i++){
							var startRange = '';
							var endRange = '';
							if(data.data[0].range[i].startAmount != null){
								startRange = data.data[0].range[i].startAmount;
							}
							if(data.data[0].range[i].endAmount != null){
								endRange = data.data[0].range[i].endAmount;
							}
							condition = condition + '<tr><td>' + startRange + '</td><td>' + endRange + '</td><td>' + data.data[0].range[i].totalCount + '</td><td>' + data.data[0].range[i].samplingCount + '</td></tr>';
						}
						condition = condition + '</table>';
					}else if(object.sampleMethod == '8'){
						condition = condition + '<br>';
						condition = condition + '<table border= "1" width="1000"><tr><td text-algin="center" width="25%">具体参数</td><td width="25%">自定义方法与理由</td><td colspan="2">' + object.customizeReason + '</td></tr>';
						condition = condition + '</table>';
					}else{
						condition = condition + '<br>';
						condition = condition + '<table border= "1" width="1000"><tr><td rowspan="4" algin="center" width="25%">具体参数</td><td width="25%">样本总体金额</td><td width="25%">剔除条件的金额</td><td width="25%">剔除后样本总体金额</td></tr>';
						condition = condition + '<tr><td>' + data.data[0].totalAmount + '</td><td>' + data.data[0].cullAmount + '</td><td>' + data.data[0].samplingAmount + '</td></tr>';
						condition = condition + '<tr><td>剔除后样本总体数量</td><td>审计确认样本量</td><td></td></tr>';
						condition = condition + '<td>' + data.data[0].samplingCount + '</td><td>' + data.data[0].adjustAmount + '</td><td></td></tr>';
						condition = condition + '</table>';
					}

					/*if(object.sampleMethod == '7'){
						condition = condition + '<div class="form-group">截止抽样张数：' + object.cutoffNum + '</div>';
						condition = condition + '<div class="form-group">截止抽样金额大于：' + object.cutoffAmount + '</div>';
					}else if(object.sampleMethod == '1' || object.sampleMethod == '2'){
						if(data.data != null && data.data.length > 0){
							condition = condition + '<div class="form-group">样本总体余额：' + data.data[0].totalAmount + '</div>'; 
							condition = condition + '<div class="form-group">剔除的金额：' + data.data[0].cullAmount + '</div>';
							condition = condition + '<div class="form-group">剔除后样本总体余额：' + data.data[0].samplingAmount + '</div>';
							condition = condition + '<div class="form-group">错报风险等级：' + riskDicData[data.data[0].risk] + '</div>';
							condition = condition + '<div class="form-group">控制测试获取的保证程度：' + controlDicData[data.data[0].control] + '</div>';
							condition = condition + '<div class="form-group">实质性分析程序获取的保证程度：' + analysisDicData[data.data[0].analysis] + '</div>';
							condition = condition + '<div class="form-group">能否从其他实质性程序中获取该财务报表领域的相关认定的审计保证：' + pledgeDicData[data.data[0].pledge] + '</div>';
							condition = condition + '<div class="form-group">其他实质性程序抽样R因子：' + data.data[0].rFactor + '</div>';
							condition = condition + '<div class="form-group">实际执行的重要性：' + data.data[0].actualImportant + '</div>';
							condition = condition + '<div class="form-group">初始样本量：' + data.data[0].initialAmount + '</div>';
							condition = condition + '<div class="form-group">初始样本量总计(不包括小数点)：' + data.data[0].intAmount + '</div>';
							condition = condition + '<div class="form-group">是否能够应对样本总体的变量因素：' + variableDicData[data.data[0].variable] + '</div>';
							condition = condition + '<div class="form-group">剔除后样本总体数量：' + data.data[0].samplingCount + '</div>';
							condition = condition + '<div class="form-group">考虑抽样方法后调整的样本量：' + data.data[0].adjustAmount + '</div>';
						}
					}else if(object.sampleMethod == '3'){
						for(var i = 0;i < data.data[0].range.length;i++){
							condition = condition + '<div class="form-group">自定义金额范围：' + data.data[0].range[i].startAmount + '-' + data.data[0].range[i].endAmount + " 总数：" + data.data[0].range[i].totalCount + " 抽样数：" + data.data[0].range[i].samplingCount + '</div>'; 
						}
					}else if(object.sampleMethod == '8'){
						condition = condition + '<div class="form-group">自定义方法与理由：' + object.customizeReason + '</div>'; 
					}else{
						condition = condition + '<div class="form-group">样本总体余额：' + data.data[0].totalAmount + '</div>'; 
						condition = condition + '<div class="form-group">剔除的金额：' + data.data[0].cullAmount + '</div>';
						condition = condition + '<div class="form-group">剔除后样本总体余额：' + data.data[0].samplingAmount + '</div>';
						condition = condition + '<div class="form-group">剔除后样本总体数量：' + data.data[0].samplingCount + '</div>';
						condition = condition + '<div class="form-group">样本量：' + data.data[0].adjustAmount + '</div>';
					}*/
					$('#samplistResult_Condition').html(condition);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		
		$('#modal_samplistResult').modal('show');
		samplingId = object.autoId;
		if(object.dataResource == '1'){
			sampleTest_view.localParam.urlparam.sqlId = 'FINCP100007';
			sampleTest_view.localParam.urlparam.param14 = object.autoId;
			sampleTest_view.localParam.urlparam.param16 =  $('#dgSamplingInfo_sampleMethod').val();
			sampleTest_view.localParam.urlparam.param21 = '';
			sampleTest_view.localParam.urlparam.param22 = '';
			sampleTest_view.localParam.urlparam.param23 = '1';
			BdoDataTable('samplistResultTable', sampleTest_view);
			sampleCull_view.localParam.urlparam = cloneObjectFn(sampleTest_view.localParam.urlparam);
			sampleCull_view.localParam.urlparam.param21 = '1';
			sampleCull_view.localParam.urlparam.param22 = '';
			sampleCull_view.localParam.urlparam.param23 = '';
			BdoDataTable('samplistCullTable', sampleCull_view);
			/** 行双击 */
			$('#samplistResultTable tbody').on('dblclick', 'tr', function() {
				var object = $('#samplistResultTable').DataTable().row(this).data();
				//voucherTab('tabs_sampleResult', object.customerId, object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
			});
		}else if(object.dataResource == '2'){
			assItemTest_view.localParam.urlparam.sqlId = 'FA30069';
			assItemTest_view.localParam.urlparam.param14 = object.autoId;
			BdoDataTable('samplistResultTable', assItemTest_view);
		}else if(object.dataResource == '3'){
			accountTest_view.localParam.urlparam.sqlId = 'FA30070';
			accountTest_view.localParam.urlparam.param14 = object.autoId;
			BdoDataTable('samplistResultTable', accountTest_view);
		}

	});
	/** 删除抽凭 */
	$('#samplingListTable').on('click', 'button[name="samplingDeleteBtn"]', function() {
		var object = $('#samplingListTable').DataTable().data()[$(this).closest('tr').index()];
		var text = '<div style="height: 50px;overflow-y: auto"><font color="red">';
		text += '1.删除该条抽凭相关的所有数据<br>';
		text += '2.从抽凭结果中删除此次抽凭抽中的所有凭证</font></div>';
		text = '此次删除将会执行以下操作 <br>' + text + '<br>是否确定删除？';
		bdoConfirmBox('删除', text, function() {
			bdoInProcessingBox('处理中');
			$.ajax({
				url: 'finCenter/sampling.deleteSamplingList.json',
				type: 'post',
				data: {
					lockCustomerId: object.customerId,
					param1: object.autoId,
					param2: object.projectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#samplingListTable').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//保存抽样结果
	$('#modal_samplistTest_sure').click(function() {
		bdoConfirmBox('保存', '确认保存结果？', function() {
			bdoInProcessingBox('处理中');
			$.ajax({
				url: 'finCenter/sampling.saveSamplingResult.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId : curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#samplingListTable').DataTable().ajax.reload(null,false);
						$('#dgSamplingInfoTable').DataTable().ajax.reload(null,false);
						$('#modal_samplistTest').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	/** table 属性 */
	var dgSamplingInfo_view_count = 1;
	var dgSamplingInfo_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {

				sqlId: 'DG10002',
				menuId: window.sys_menuId,
				param1: curSamplingParam.projectId,
				param2: '',
				param3: $('#dgSamplingInfo_startDate').val(),
				param4: $('#dgSamplingInfo_endDate').val(),
				param5: $('#dgSamplingInfo_sampleMethod').val(),
				param6: $('#dgSamplingInfo_voucherId').val(),
				param7: $('#dgSamplingInfo_sampleUser').val(),
				param11: $('#dgSamplingInfo_subjectid').val(),
				lockCustomerId: curSamplingParam.customerId
			}
		},
		tableParam: {
			select: true,
			scrollX: true,
			scrollY: false,
			//scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			autoWidth: false,
			//order: [1, 'asc'],
			pageLength: 30,
			createdRow(row, data, dataIndex) {
				if(data.auditResultName != '' && data.auditResultName != null){
					$(row).css({"color":'red'});
				}
			},
			columnDefs: [
				{
					targets: dgSamplingInfo_view_count++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						//renderStr += '<button class="btn btn-xs btn-success" type="button" name="samplingInfoEditBtn" data-placement="top" title="编辑" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="samplingInfoFileBtn" data-placement="top" title="编辑" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>&nbsp;';
						return renderStr;
					}
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: false,
					className: 'text-left',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: '60px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: false,
					className: 'text-left',
					title: '凭证编号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '60px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: false,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '100px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '抽凭方式',
					name: 'sampleMethod',
					data: 'sampleMethod',
					width: '150px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: false,
					className: 'text-left',
					title: '抽凭人',
					name: 'sampleUserName',
					data: 'sampleUserName',
					width: '60px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: false,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: false,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '150px'
				}, {
					targets: dgSamplingInfo_view_count++,
					className: 'text-left',
					title: '核算类型',
					name: 'assTotalName',
					data: 'assTotalName',
					width: '200px'
				}, {
					targets: dgSamplingInfo_view_count++,
					className: 'text-left',
					title: '对方科目',
					name: 'oppositeAccountLast',
					data: 'oppositeAccountLast',
					width: '200px',
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}
				}, {
					targets: dgSamplingInfo_view_count++,
					className: 'text-right',
					title: '借方发生金额',
					name: 'debitValue',
					data: 'debitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: dgSamplingInfo_view_count++,
					className: 'text-right',
					title: '贷方发生金额',
					name: 'crebitValue',
					data: 'crebitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: false,
					className: 'text-left',
					title: '审计结论',
					name: 'auditResultName',
					data: 'auditResultName',
					width: '200px',
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: false,
					className: 'text-left',
					title: '附件索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '200px',
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: false,
					className: 'text-left',
					title: '备注',
					name: 'remark',
					data: 'remark',
					width: '200px',
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}
						
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '原始凭证内容完整',
					name: 'contentComplete',
					data: 'contentComplete',
					width: '110px'/*,
					render: function(data, type, row, meta) {
						switch (data) {
							case '1' :
								return '是';
							case '0' :
								return '否';
							default :
								return '';
						}
					}*/
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '有授权批准',
					name: 'authorize',
					data: 'authorize',
					width: '100px'/*,
					render: function(data, type, row, meta) {
						switch (data) {
							case '1' :
								return '是';
							case '0' :
								return '否';
							default :
								return '';
						}
					}*/
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '账务处理正确',
					name: 'handleCorrect',
					data: 'handleCorrect',
					width: '100px'/*,
					render: function(data, type, row, meta) {
						switch (data) {
							case '1' :
								return '是';
							case '0' :
								return '否';
							default :
								return '';
						}
					}*/
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '账证的内容相符',
					name: 'contentMatch',
					data: 'contentMatch',
					width: '100px'/*,
					render: function(data, type, row, meta) {
						switch (data) {
							case '1' :
								return '是';
							case '0' :
								return '否';
							default :
								return '';
						}
					}*/
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '账证的金额相符',
					name: 'amountMatch',
					data: 'amountMatch',
					width: '100px'/*,
					render: function(data, type, row, meta) {
						switch (data) {
							case '1' :
								return '是';
							case '0' :
								return '否';
							default :
								return '';
						}
					}*/
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '截止测试正确',
					name: 'cutoffCorrect',
					data: 'cutoffCorrect',
					width: '100px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '核对内容6',
					name: 'customizeResult1',
					data: 'customizeResult1',
					width: '100px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '核对内容7',
					name: 'customizeResult2',
					data: 'customizeResult2',
					width: '100px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '核对内容8',
					name: 'customizeResult3',
					data: 'customizeResult3',
					width: '100px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '核对内容9',
					name: 'customizeResult4',
					data: 'customizeResult4',
					width: '100px'
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '抽凭名称',
					name: 'sampleName',
					data: 'sampleName',
					width: '100px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<a href="#" name="showSamplingResult">' + data + '</a>';
						return renderStr;
					}/*,
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}*/
				}, {
					targets: dgSamplingInfo_view_count++,
					orderable: true,
					className: 'text-left',
					title: '关联抽凭名称',
					name: 'relateSampleName',
					data: 'relateSampleName',
					width: '100px'/*,
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}*/
				}
			]
		}
	};

	/** 抽凭结果搜索按钮 */
	$('#btn_dgSamplingInfo_search').click(function() {

		if ($('#dgSamplingInfo_endDate').val() == '' && $('#dgSamplingInfo_startDate').val() != '') {
			$('#dgSamplingInfo_endDate').val($('#dgSamplingInfo_startDate').val());
		}

		if ($('#dgSamplingInfo_startDate').val() == '' && $('#dgSamplingInfo_endDate').val() != '') {
			$('#dgSamplingInfo_startDate').val($('#dgSamplingInfo_endDate').val());
		}

		if ($('#dgSamplingInfo_startDate').val() == '') {
			//$('#dgSamplingInfo_startDate').focus();
			bdoInfoBox('提示', '请选择凭证开始日期');
			return;
		}

		if ($('#dgSamplingInfo_endDate').val() == '') {
			//$('#dgSamplingInfo_endDate').focus();
			bdoInfoBox('提示', '请选择凭证结束日期');
			return;
		}
		if ($('#dgSamplingInfo_startDate').val() > $('#dgSamplingInfo_endDate').val()) {
			//$('#dgSamplingInfo_startDate').focus();
			bdoInfoBox('提示', '凭证结束日期不能小于凭证开始日期');
			return;
		}
		/*if($('#dgSamplingInfo_startDate').val().substr(0, 4) != $('#dgSamplingInfo_endDate').val().substr(0, 4)){
			bdoInfoBox('提示', '凭证日期必须是同一年');
			return;
		}
		if($('#dgSamplingInfo_startDate').val().substr(0, 4) != curSamplingParam.yyyy){
			bdoInfoBox('提示', '凭证日期必须选择账套年'+curSamplingParam.yyyy);
			return;
		}*/
		/*if ($('#dgSamplingInfo_subjectid').val() == '') {
			bdoInfoBox('提示', '请选择科目');
			return;
		}*/
		
		dgSamplingInfo_view.localParam.urlparam.param2 = $('#dgSamplingInfo_startDate').val().substr(0, 4);
		dgSamplingInfo_view.localParam.urlparam.param14 = $('#dgSamplingInfo_endDate').val().substr(0, 4);
		if($('#dgSamplingInfo_dateType').val() == '0'){
			dgSamplingInfo_view.localParam.urlparam.param3 = $('#dgSamplingInfo_startDate').val();
			dgSamplingInfo_view.localParam.urlparam.param4 = $('#dgSamplingInfo_endDate').val();
			dgSamplingInfo_view.localParam.urlparam.param12 = '';
			dgSamplingInfo_view.localParam.urlparam.param13 = '';
		}else if($('#dgSamplingInfo_dateType').val() == '1'){
			dgSamplingInfo_view.localParam.urlparam.param3 = '';
			dgSamplingInfo_view.localParam.urlparam.param4 = '';
			dgSamplingInfo_view.localParam.urlparam.param12 = $('#dgSamplingInfo_startDate').val().substr(5, 6);
			dgSamplingInfo_view.localParam.urlparam.param13 = $('#dgSamplingInfo_endDate').val().substr(5, 6);
		}else{
			dgSamplingInfo_view.localParam.urlparam.param3 = '';
			dgSamplingInfo_view.localParam.urlparam.param4 = '';
			dgSamplingInfo_view.localParam.urlparam.param12 = '';
			dgSamplingInfo_view.localParam.urlparam.param13 = '';
		}

		dgSamplingInfo_view.localParam.urlparam.param5 = $('#dgSamplingInfo_sampleMethod').val();
		dgSamplingInfo_view.localParam.urlparam.param6 = $('#dgSamplingInfo_voucherId').val();
		dgSamplingInfo_view.localParam.urlparam.param7 = $('#dgSamplingInfo_sampleUser').val();

		dgSamplingInfo_view.localParam.urlparam.param11 = $('#dgSamplingInfo_subjectid').val();
		dgSamplingInfo_view.localParam.urlparam.param16 = $('#dgSamplingInfo_sampleName').val();
		dgSamplingInfo_view.localParam.urlparam.param17 = '1';
		if($('#dgSamplingInfo_isRelated').val() == '是'){
			dgSamplingInfo_view.localParam.urlparam.param19 = '1';
		}else{
			dgSamplingInfo_view.localParam.urlparam.param19 = '';
		}
		BdoDataTable('dgSamplingInfoTable', dgSamplingInfo_view);
		/** 行双击 */
		$('#dgSamplingInfoTable tbody').on('dblclick', 'tr', function() {
			var object = $('#dgSamplingInfoTable').DataTable().row(this).data();
			clearSamplingStatistics();
			//voucherTab('navTabSampling', object.customerId, object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
		});
	});
	$('#btn_dgSamplingInfo_search').click();
	/** 弹出抽样抽凭结果 */
	$('#dgSamplingInfoTable').on('click', 'a[name="showSamplingResult"]', function() {
		//清空tab
		clearSamplingStatistics();
		var object = $('#dgSamplingInfoTable').DataTable().data()[$(this).closest('tr').index()];
		SamplingResult({region: '#samplistResultPage', data: agrs.data, samplingId: object.samplingId});
		$('#modal_samplistResult1').modal('show');
		
	});
	/** 弹出编辑审计结论和备注 */
	$('#dgSamplingInfoTable').on('click', 'button[name="samplingInfoEditBtn"]', function() {
		var object = $('#dgSamplingInfoTable').DataTable().data()[$(this).closest('tr').index()];
		$('#samplingInfoEdit_auditResult').val(object.auditResult);
		$('#samplingInfoEdit_remark').val(object.remark);
		if(object.contentComplete == '否'){
			$('[name=\'contentComplete\'][data-result=0]').click();
		}else{
			$('[name=\'contentComplete\'][data-result=1]').click();
		}
		if(object.authorize == '否'){
			$('[name=\'authorize\'][data-result=0]').click();
		}else{
			$('[name=\'authorize\'][data-result=1]').click();
		}
		if(object.handleCorrect == '否'){
			$('[name=\'handleCorrect\'][data-result=0]').click();
		}else{
			$('[name=\'handleCorrect\'][data-result=1]').click();
		}
		if(object.contentMatch == '否'){
			$('[name=\'contentMatch\'][data-result=0]').click();
		}else{
			$('[name=\'contentMatch\'][data-result=1]').click();
		}
		if(object.amountMatch == '否'){
			$('[name=\'amountMatch\'][data-result=0]').click();
		}else{
			$('[name=\'amountMatch\'][data-result=1]').click();
		}
		if(object.cutoffCorrect == '否'){
			$('[name=\'cutoffCorrect\'][data-result=0]').click();
		}else{
			$('[name=\'cutoffCorrect\'][data-result=1]').click();
		}
		$('#modal-samplingInfoEdit').modal('show');
		subjectentryId = object.autoId;
		
	});
	//保存审计结论和备注
	$('#samplingInfoEdit_submit').click(function() {
		var editVoucherId = samplingVoucher_view.localParam.urlparam.param2;
		var editYyyy = samplingVoucher_view.localParam.urlparam.lockYyyy;
		var samplingInfoEdit_auditResult = $('#samplingInfoEdit_auditResult').val();
		var samplingInfoEdit_remark = $('#samplingInfoEdit_remark').val();
		var samplingInfoEdit_relateSampling = $('#samplingInfoEdit_relateSampling').val();
		if(samplingInfoEdit_auditResult == '3' && (samplingInfoEdit_remark == null || samplingInfoEdit_remark == '')){
			bdoInfoBox('提示', '请填写备注');
			return;
		}
		if(samplingInfoEdit_auditResult == '2' && (samplingInfoEdit_relateSampling == null || samplingInfoEdit_relateSampling == '')){
			//bdoInfoBox('提示', '请添加关联抽凭');
			bdoConfirmBox('提示', '请添加关联抽凭', function() {
				$('#samplingInfoEdit_relateSampling').click();
			});
			return;
		}
		bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'dgCenter/DgBBReport.saveSamplingInfoRemark.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					lockCustomerId: curSamplingParam.customerId,
					param1: curSamplingParam.projectId,
					param2: subjectentryId,
					param3: $('#samplingInfoEdit_auditResult').val(),
					param4: $('#samplingInfoEdit_remark').val(),
					param5: $('[name=\'contentComplete\']:checked').attr('data-result'),
					param6: $('[name=\'authorize\']:checked').attr('data-result'),
					param7: $('[name=\'handleCorrect\']:checked').attr('data-result'),
					param8: $('[name=\'contentMatch\']:checked').attr('data-result'),
					param9: $('[name=\'amountMatch\']:checked').attr('data-result'),
					param10: $('[name=\'cutoffCorrect\']:checked').attr('data-result'),
					param11: editVoucherId,
					param12: editYyyy,
					param13: $('#samplingInfoEdit_customizeResultName1').val(),
					param14: $('#samplingInfoEdit_customizeResultName2').val(),
					param15: $('#samplingInfoEdit_customizeResultName3').val(),
					param16: $('#samplingInfoEdit_customizeResultName4').val(),
					param17: $('[name=\'customizeResult1\']:checked').attr('data-result'),
					param18: $('[name=\'customizeResult2\']:checked').attr('data-result'),
					param19: $('[name=\'customizeResult3\']:checked').attr('data-result'),
					param20: $('[name=\'customizeResult4\']:checked').attr('data-result'),
					param21: '' //附件内容填写
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#dgSamplingInfoTable').DataTable().ajax.reload(null,false);
						$('#modal-samplingFileUpload').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	/** 统计 */
	$('#btn_dgSamplingInfo_statistics').click(function() {
		samplingStatisticsTab('navTabSampling', curSamplingParam.customerId, '', '2', agrs);
	});
	/** 导出 */
	$('#btn_dgSamplingInfo_export').on('click', function(){
		exportExcelFin(this, '抽凭结果', dgSamplingInfo_view, 'dgSamplingInfoTable');
	});
	/** 附件上传 */
	$('#dgSamplingInfoTable').on('click', 'button[name="samplingInfoFileBtn"]', function() {
		var object = $('#dgSamplingInfoTable').DataTable().data()[$(this).closest('tr').index()];
		$.ajax({
			type: 'post',
			url: 'finCenter/sampling.querySamplingPermissions.json',
			data: {
				param1: ''
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					permissions = true;
					$('#samplingInfoEdit_submit').removeAttr("display");
				} else {
					permissions = false;
					$('#samplingInfoEdit_submit').css('display', 'none');
				}
			}
		});
		$('#modal-samplingFileUpload').modal('show');
		subjectentryId = object.autoId;
		samplingFilePage.attachTableCfg.localParam.urlparam.param5 = '';
		samplingFilePage.attachTableCfg.localParam.urlparam.param6 = '2';
		samplingFilePage.attachTableCfg.tableParam.columnDefs[2].title = '索引号';
		samplingFilePage.attachTableCfg.tableParam.columnDefs[2].sTitle = '索引号';
		samplingFilePage.attachTableCfg.localParam.urlparam.param7 = '';
		samplingFilePage.attachTableCfg.localParam.urlparam.param8 = object.oldVoucherId;
		samplingFilePage.attachTableCfg.localParam.urlparam.param9 = object.vchDate;
		BdoDataTable('samplingFileUploadTable', samplingFilePage.attachTableCfg);
		$('#upload_samplingFileBtn').css('display', 'none');
		$('#samplingInfoEdit_auditResult').val(object.auditResult);
		$('#samplingInfoEdit_remark').val(object.remark);
		$('#samplingInfoEdit_customizeResultName1').val(object.customizeResultName1);
		$('#samplingInfoEdit_customizeResultName2').val(object.customizeResultName2);
		$('#samplingInfoEdit_customizeResultName3').val(object.customizeResultName3);
		$('#samplingInfoEdit_customizeResultName4').val(object.customizeResultName4);
		if(object.contentComplete == '否'){
			$('[name=\'contentComplete\'][data-result=0]').click();
		}else{
			$('[name=\'contentComplete\'][data-result=1]').click();
		}
		if(object.authorize == '否'){
			$('[name=\'authorize\'][data-result=0]').click();
		}else{
			$('[name=\'authorize\'][data-result=1]').click();
		}
		if(object.handleCorrect == '否'){
			$('[name=\'handleCorrect\'][data-result=0]').click();
		}else{
			$('[name=\'handleCorrect\'][data-result=1]').click();
		}
		if(object.contentMatch == '否'){
			$('[name=\'contentMatch\'][data-result=0]').click();
		}else{
			$('[name=\'contentMatch\'][data-result=1]').click();
		}
		if(object.amountMatch == '否'){
			$('[name=\'amountMatch\'][data-result=0]').click();
		}else{
			$('[name=\'amountMatch\'][data-result=1]').click();
		}
		if(object.cutoffCorrect == '否'){
			$('[name=\'cutoffCorrect\'][data-result=0]').click();
		}else{
			$('[name=\'cutoffCorrect\'][data-result=1]').click();
		}
		if(object.customizeResult1 == '否'){
			$('[name=\'customizeResult1\'][data-result=0]').click();
		}else if(object.customizeResult1 == '是'){
			$('[name=\'customizeResult1\'][data-result=1]').click();
		}else{
			$('[name=\'customizeResult1\'][data-result=0]').removeAttr("checked");  
			$('[name=\'customizeResult1\'][data-result=1]').removeAttr("checked");  
		}
		if(object.customizeResult2 == '否'){
			$('[name=\'customizeResult2\'][data-result=0]').click();
		}else if(object.customizeResult2 == '是'){
			$('[name=\'customizeResult2\'][data-result=1]').click();
		}else{
			$('[name=\'customizeResult2\'][data-result=0]').removeAttr("checked");  
			$('[name=\'customizeResult2\'][data-result=1]').removeAttr("checked");  
		}
		if(object.customizeResult3 == '否'){
			$('[name=\'customizeResult3\'][data-result=0]').click();
		}else if(object.customizeResult3 == '是'){
			$('[name=\'customizeResult3\'][data-result=1]').click();
		}else{
			$('[name=\'customizeResult3\'][data-result=0]').removeAttr("checked");  
			$('[name=\'customizeResult3\'][data-result=1]').removeAttr("checked");  
		}
		if(object.customizeResult4 == '否'){
			$('[name=\'customizeResult4\'][data-result=0]').click();
		}else if(object.customizeResult4 == '是'){
			$('[name=\'customizeResult4\'][data-result=1]').click();
		}else{
			$('[name=\'customizeResult4\'][data-result=0]').removeAttr("checked");  
			$('[name=\'customizeResult4\'][data-result=1]').removeAttr("checked");  
		}
		//凭证详细
		samplingVoucher_view.localParam.urlparam.param1 = object.projectId;
		//samplingVoucher_view.localParam.urlparam.param2 = object.voucherId;
		samplingVoucher_view.localParam.urlparam.param3 = object.oldVoucherId;
		samplingVoucher_view.localParam.urlparam.param4 = object.vchDate;
		samplingVoucher_view.localParam.urlparam.param5 = subjectentryId;
		samplingVoucher_view.localParam.urlparam.param6 = object.samplingId;
		samplingVoucher_view.localParam.urlparam.lockCustomerId = object.customerId;
		samplingVoucher_view.localParam.urlparam.lockYyyy = object.vchDate.substr(0, 4);
		$('#samplingFileShow').css('display', 'block');
		$('#samplingInfoEditShow').css('display', 'block');
		$('#show_currentVoucher').prop("checked","checked");
		BdoDataTable('samplingVoucherDetail_table', samplingVoucher_view);
		if(object.relateSamplingId != null && object.relateSamplingId != ''){
			relateSamplingId = object.relateSamplingId;
			$('#samplingInfoEdit_relateSampling').val(object.relateSampleName);
		}else{
			relateSamplingId = '';
			$('#samplingInfoEdit_relateSampling').val('');
		}
	});
	//附件管理
	$('#btn_dgSamplingInfo_file').click(function() {
		$('#modal-samplingFileUpload').modal('show');
		samplingFilePage.attachTableCfg.localParam.urlparam.param5 = '';
		samplingFilePage.attachTableCfg.localParam.urlparam.param6 = '2';
		samplingFilePage.attachTableCfg.localParam.urlparam.param7 = CUR_USERID;
		//samplingFilePage.attachTableCfg.tableParam.columnDefs[2].title = '临时索引号';
		//samplingFilePage.attachTableCfg.tableParam.columnDefs[2].sTitle = '临时索引号';
		samplingFilePage.attachTableCfg.localParam.urlparam.param8 = '';
		samplingFilePage.attachTableCfg.localParam.urlparam.param9 = '';
		$('#upload_samplingFileBtn').css('display', 'none');
		$('#samplingFileShow').css('display', 'none');
		$('#samplingInfoEditShow').css('display', 'none');
		BdoDataTable('samplingFileUploadTable', samplingFilePage.attachTableCfg);
	});
	//附件页面
	let samplingFilePage = new Page({
		container: '#modal-samplingFileUpload',
		events: {
			'#refreshAttachTableBtn_samplingFileUpload': 'click,onRrefreshAttachTable',
			'#upload_samplingFileUpload': 'click,onUpload'
			//'#attachTable tbody td.edit-indexid': 'dbclick,onIndexColDbclick'
		},
		/**
		 * 初始化
		 */
		init(options) {
			// 上传文件
			this.uploadWorkpagerPage = createForm(this.uploadWorkpagerPageCfg);
			//BdoDataTable('samplingFileUploadTable', this.attachTableCfg);
			this.listener();
		}
		, uploadWorkpagerPageCfg: {
			options: {
				propsData: {
					jsonData: {
						workpager: [],
						customerId: curSamplingParam.customerId,
						projectId: curSamplingParam.projectId,
						subjectTreeId: '',//agrs.data.extraOptions.autoId,
						autoId: null
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 1,
			id: 'uploadSamplingFileForm',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: 'dgCenter/DgMain.updateSamplingDgFile.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#uploadSamplingFormModal').modal('hide');
								$('#samplingFileUploadTable').DataTable().ajax.reload();
								if (samplingFilePage.attachTableCfg.localParam.urlparam.param6 == '2') {
									$('#samplingVoucherDetail_table').DataTable().ajax.reload();
								}
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					},
					uploadMode: 'STD'
				};
			},
			methods: {
				onUploadDraftFileClick(event) {
					var fileCount = $('#workpager').fileinput('getFilesCount');
					if (fileCount <= 0) {
						bdoErrorBox('失败', '当前无任何文件！');
						return;
					}
					this.uploadFile(true, {param1: 'SAMPLING',param2: uploadSubjectentryId,param3: samplingFilePage.attachTableCfg.localParam.urlparam.param6,param4: uploadOldVoucherId});
				},
				resetFileClick(event) {
					$('#workpager').fileinput('refresh');
					$('#workpager').fileinput('clear');
					$('#workpager').fileinput('reset');
					/*this.uploadMode = 'STD';
					this.jsonData.autoId = */
				}
			},
			buttons: [{
				id: 'resetFileBtn',
				icon: 'fa fa-refresh',
				style: 'btn-primary',
				text: '重置',
				typeAttr: {
					'v-on:click': 'resetFileClick'
				}
			}, {
				id: 'uploadDraftFileBtn',
				icon: 'fa fa-upload',
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
				label: '文件',
				rowspan: 1,
				colspan: 2,
				validate: {
					rules: {}
				},
				typeAttr: {
					multiple: true
				},
				show: true,
				plugin: {
					name: 'fileinput',
					options: {
						allowedFileExtensions: ['xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlsb', 'xlam', 'jpg', 'png', 'doc', 'docx', 'zip', 'rar', 'pdf'],
						uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
						uploadExtraData() {
							return {};
						}
					}
				}
			}]
		}
		, uploadWorkpagerPage: null
		, attachTableCfg: {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: {
					menuId: window.sys_menuId,
					sqlId: 'DG10006',
					param1: curSamplingParam.customerId,
					param2: '',//agrs.data.extraOptions.autoId
					param4: curSamplingParam.projectId,
					param5: '',
					param6: '',
					param7: ''
				},
				tabNum: true
			},
			tableParam: {
				scrollX: true,
				scrollCollapse: true,
				select: true,
				serverSide: true,
				lengthChange: true,
				order : [ 3, 'asc' ],
				ordering : true,
				/*drawCallback(settings) {
					let $table = this;
					if (!$table.isInitSortable) {
						$('tbody', this).sortable({
							helper(e, tr) {
								let $originals = tr.children();
								let $helper = tr.clone();
								$helper.children().each(function(index) {
									$(this).width($originals.eq(index).width());
								});
								return $helper;
							},
							stop() {
								let trs = $('tbody tr', $table);
								let datas = $table.fnGetData();
								let param = [];
								trs.each((index, tr) => {
									let $tr = $(tr);
									$tr.find('td:eq(0)').text(index + 1);
									let data = datas[index];
									if (data.sortNum != $tr.data('sortNum')) {
										data.sortNum = $tr.data('sortNum');
										$(tr).data('autoId', data.autoId);
										$(tr).data('sortNum', data.sortNum);
										param.push({
											autoId: data.autoId,
											customerId: data.customerId,
											sortNum: data.sortNum
										});
									}
								});
								if (param.length > 0) {
									$.ajax({
										url: 'dgCenter/DgMain.updateDgFileSort.json',
										type: 'post',
										data: {jsonData: JSON.stringify(param)},
										dataType: 'json',
										success(data) {
											if (data.success) {

											} else {
												bdoErrorBox('排序失败', data.resultInfo.statusText);
											}
										}
									});
								}
							}
						});
					}
					$table.isInitSortable = true;
				},*/
				createdRow(row, data, dataIndex) {
					$(row).data('sortNum', data.sortNum);
					$(row).data('dataIndex', dataIndex);
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
					width: '120px',
					render: function(data, type, row, meta) {
						//var fileType = data.suffix;
						var renderStr = '';
						if (data.relateType == '1') {
							renderStr += '<button class="btn btn-xs table-btn-operate btn-success" type="button" name="relateEntry" data-placement="top" title="关联" data-toggle="tooltip" data-row="' + meta.row + '">'
								+ '	<i class="fa fa-eye"></i>'
								+ '</button>';
						}
						/*renderStr += '<button class="btn btn-xs table-btn-operate btn-danger" type="button" name="reUploadFile" data-placement="top" title="重新上传" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-upload"></i>'
							+ '</button>';*/
						renderStr += '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="downloadFile" data-placement="top" title="下载" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-download"></i>'
							+ '</button>';
						if (/^.*?\.(jpg|jpeg|bmp|gif|png|pdf)$/.test(data.fileName.toLowerCase())) {
							renderStr += '<button class="btn btn-xs table-btn-operate btn-success" type="button" name="onlinepreview" data-placement="top" title="在线预览" data-toggle="tooltip" data-row="' + meta.row + '">'
								+ '	<i class="fa fa-eye"></i>'
								+ '</button>';
						}
						renderStr += '<button class="btn btn-xs table-btn-operate btn-danger" type="button" name="delFile" data-placement="top" title="删除" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-times-circle-o"></i>'
							+ '</button>';
						return renderStr;
					}
				}, {
					targets: ++cnt,
					name: 'sortNum',
					data: 'sortNum',
					visible: false
				}, {
					targets: ++cnt,
					orderable: true,
					className: 'edit-indexid',
					title: '索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '150px',
					render: function(data, type, row, meta) {
						if(row.relateType == '1'){
							return row.tempFileIndexId;
						}else{
							return data
						}
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '文件名称',
					name: 'fileName',
					data: 'fileName',
					width: '150px'
				}, {
					targets: ++cnt,
					orderable: true,
					title: '上传时间',
					name: 'uploadDate',
					data: 'uploadDate',
					width: '150px',
					render: function(data, type, row, meta) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: ++cnt,
					orderable: false,
					title: '上传人',
					name: '__uuploadUserName',
					data: '__uuploadUserName',
					width: '150px'
				}]
			}
		}
		, onRrefreshAttachTable(event) {
			event.preventDefault();
			$('#samplingFileUploadTable').DataTable().ajax.reload();
		}
		, onUpload(event) {
			event.preventDefault();
			samplingFilePage.uploadWorkpagerPage.jsonData.autoId = null;
			samplingFilePage.uploadMode = 'STD';
			$('#uploadSamplingFormModal').modal('show');
		}
		, updateFileIndexId(event, $this, $table, val) {
			let index = $table.dataTable().api(true).cell($this).data();
			if (index != val && val) {
				let rowData = $table.dataTable().api(true).cell($this).row().data();
				$.ajax({
					url: 'dgCenter/DgMain.updateDgIndexId.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						jsonData: JSON.stringify([{
							autoId: rowData.autoId,
							customerId: rowData.customerId,
							fileIndexId: val
						}])
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$this.css('padding', '6px 8px');
							$this.html(val);
							$table.dataTable().api(true).cell($this).data(val);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			} else if (index == val) {
				$this.css('padding', '6px 8px');
				$this.html(val);
				$table.dataTable().api(true).cell($this).data(val);
			} else {
				//$('input', $this).css();
			}
		}
		, onIndexColDbclick(event) {
			console.log('onIndexColDbclick');
			let $table = $('#samplingFileUploadTable').dataTable();
			let $this = $(this);
			let data = $table.api(true).cell(this).data();
			let $input = $('<input style="width: 60%; height: 80%;    max-height: 2em; margin-top: 1px;"/>');
			let $submitBtn = $('<button class="btn btn-success" style="font-size: 12px;width: 15%;height: 80%;max-height: 2em;margin-left: 5px;padding: 1px;margin-top: -4px;"><i class="fa fa-check"></i></button>');

			$this.css('padding', 0);
			$input.val(data);
			$this.html($input);
			$this.append($submitBtn);

			/*$input.blur(function(event) {
				page.updateFileIndexId(event, $this, $table, $input.val());
			});*/

			$submitBtn.click(function(event) {
				samplingFilePage.updateFileIndexId(event, $this, $table, $input.val());
			});

			$input.focus();
		}
		, listener() {
			let action = (param, callback) => {
				$.ajax({
					url: 'dgCenter/DgMain.querySamplingDgFileExist.json',
					type: 'post',
					data: param,
					dataType: 'json',
					success(data) {
						if (data.success) {
							callback(data);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			};
			// 重新上传附件
			$('#samplingFileUploadTable').on('click', 'button.table-btn-operate[name="reUploadFile"]', event => {
				let table = $('#samplingFileUploadTable').dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				samplingFilePage.uploadWorkpagerPage.jsonData.autoId = rowData.autoId;
				samplingFilePage.uploadWorkpagerPage.uploadMode = 'RE';
				$('#uploadSamplingFormModal').modal('show');
			});

			// 下载附件
			$('#samplingFileUploadTable').on('click', 'button.table-btn-operate[name="downloadFile"]', event => {
				let table = $('#samplingFileUploadTable').dataTable();
				let rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				/*var isManager = true;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00197',
						param1: curSamplingParam.customerId,
						param2: curSamplingParam.projectId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if (sys_userId != data.data[0].manager) {
								isManager = false;
							}
						}
					}
				});
				if (!isManager) {
					bdoInfoBox('提示', '只有项目负责人才能下载该文件附件！');
					return;
				}*/
				action({
					param1: rowData.autoId,
					param2: rowData.customerId,
					param3: rowData.relateType
				}, (data) => {
					downloadFile('dgCenter/DgDownload.downloadDgAttachFile.json', {
						param1: rowData.autoId,
						param2: rowData.customerId,
						param3: 'type2'
					});
				});
			});
			// 在线预览
			$('#samplingFileUploadTable').on('click', 'button.table-btn-operate[name="onlinepreview"]', event => {
				/*var table = $('#samplingFileUploadTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				action({
					param1: rowData.autoId,
					param2: rowData.customerId,
					param3: rowData.relateType
				}, (data) => {
					window.open('dgCenter/DgMain.previewProjDgFile.json?param1=' + rowData.autoId + '&param2=' + rowData.customerId, rowData.fileName, 'location=no');
				});*/
				var table = $('#samplingFileUploadTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				action({
					param1: rowData.autoId,
					param2: rowData.customerId,
					param3: rowData.relateType
				}, (data) => {
					var fileSuffix = rowData.fileName.substring(rowData.fileName.lastIndexOf(".") + 1).toLowerCase();
					if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" ) {
						if (data.data == null) {
							window.open('dgCenter/DgPaper.previewFile.json?param1=' + rowData.autoId + '&param2=type2' + '&param3=' + rowData.fileName ,rowData.fileName , 'location=no');
						} else {
							window.open('/Faith/dgcenter.do?m=previewAuditPolicyFileNoRight', rowData.fileName, 'location=no');
						}
					} else if(fileSuffix === "xlsx") {
						rowData.pageType = 2;
						var nodeData = {
							extraOptions: rowData,
							currentNode: {
								extraOptions: rowData
							}
						};
						$.sessionStorage('fileNode', JSON.stringify(nodeData));
						window.open('/Faith/dgcenter.do?m=previewFile');
					}
				});
			});
			// 关联凭证分录
			$('#samplingFileUploadTable').on('click', 'button.table-btn-operate[name="relateEntry"]', event => {
				var table = $('#samplingFileUploadTable').dataTable();
				relateFile = table.fnGetData($(event.currentTarget).attr('data-row'));
				$('#modal_samplistRelate').modal('show');
			});
			// 删除附件
			$('#samplingFileUploadTable').on('click', 'button.table-btn-operate[name="delFile"]', event => {
				var table = $('#samplingFileUploadTable').dataTable();
				var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
				bdoConfirmBox('提示', '确认删除文件【' + rowData.fileName + '】?', function() {
					$.ajax({
						url: 'dgCenter/DgMain.deleteSamplingDgFile.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: rowData.autoId,
							param2: rowData.customerId,
							param3: rowData.relateType
						},
						dataType: 'json',
						success: function(data) {
							if (data.success) {
								$('#samplingFileUploadTable').DataTable().ajax.reload();
								if (samplingFilePage.attachTableCfg.localParam.urlparam.param6 == '2') {
									$('#samplingVoucherDetail_table').DataTable().ajax.reload();
								}
								bdoSuccessBox('成功', data.resultInfo.statusText);
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			});
			$('#samplingFileUploadTable').on('dblclick', 'tbody td.edit-indexid', this.onIndexColDbclick);
		}
	});
	/** table 属性 */
	var samplistRelate_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {

				sqlId: 'DG10002',
				menuId: window.sys_menuId,
				param1: curSamplingParam.projectId,
				param2: '',
				param3: $('#samplistRelate_startDate').val(),
				param4: $('#samplistRelate_endDate').val(),
				param5: $('#samplistRelate_sampleMethod').val(),
				param6: $('#samplistRelate_voucherId').val(),
				param7: $('#samplistRelate_sampleUser').val(),
				param11: $('#samplistRelate_subjectid').val(),
				lockCustomerId: curSamplingParam.customerId
			}
		},
		tableParam: {
			select: true,
			scrollX: true,
			//scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			//order: [1, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: 1,
					className: 'text-center',
					title: '勾选',
					name: 'autoId',
					data: 'autoId',
					width: '15px',
					render: function(data, type, row, meta) {
						var renderStr = '<input type="checkbox" name="samplistRelateSelect" value="' + row.autoId + '"></input>';
						return renderStr;
					}
				}, {
					targets: 2,
					orderable: false,
					className: 'text-left',
					title: '凭证编号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '60px'
				}, {
					targets: 3,
					orderable: false,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '100px'
				}, {
					targets: 4,
					orderable: true,
					className: 'text-left',
					title: '抽凭方式',
					name: 'sampleMethod',
					data: 'sampleMethod',
					width: '150px'
				}, {
					targets: 5,
					orderable: false,
					className: 'text-left',
					title: '抽凭人',
					name: 'sampleUserName',
					data: 'sampleUserName',
					width: '60px'
				}, {
					targets: 6,
					orderable: false,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'
				}, {
					targets: 7,
					orderable: false,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectname1',
					data: 'subjectname1',
					width: '150px'
				}, {
					targets: 8,
					className: 'text-right',
					title: '借方发生金额',
					name: 'debitValue',
					data: 'debitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 9,
					className: 'text-right',
					title: '贷方发生金额',
					name: 'crebitValue',
					data: 'crebitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 10,
					orderable: false,
					className: 'text-left',
					title: '审计结论',
					name: 'auditResultName',
					data: 'auditResultName',
					width: '200px'
				}, {
					targets: 11,
					orderable: false,
					className: 'text-left',
					title: '附件索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '200px'
				}, {
					targets: 12,
					orderable: false,
					className: 'text-left',
					title: '备注',
					name: 'remark',
					data: 'remark',
					width: '200px'
				}
			]
		}
	};

	/** 搜索按钮 */
	$('#btn_samplistRelate_search').click(function() {

		if ($('#samplistRelate_endDate').val() == '' && $('#samplistRelate_startDate').val() != '') {
			$('#samplistRelate_endDate').val($('#samplistRelate_startDate').val());
		}

		if ($('#samplistRelate_startDate').val() == '' && $('#samplistRelate_endDate').val() != '') {
			$('#samplistRelate_startDate').val($('#samplistRelate_endDate').val());
		}

		if ($('#samplistRelate_startDate').val() == '') {
			//$('#dgSamplingInfo_startDate').focus();
			bdoInfoBox('提示', '请选择凭证开始日期');
			return;
		}

		if ($('#samplistRelate_endDate').val() == '') {
			//$('#dgSamplingInfo_endDate').focus();
			bdoInfoBox('提示', '请选择凭证结束日期');
			return;
		}
		if ($('#samplistRelate_startDate').val() > $('#samplistRelate_endDate').val()) {
			//$('#dgSamplingInfo_startDate').focus();
			bdoInfoBox('提示', '凭证结束日期不能小于凭证开始日期');
			return;
		}
		/*if($('#samplistRelate_startDate').val().substr(0, 4) != $('#samplistRelate_endDate').val().substr(0, 4)){
			bdoInfoBox('提示', '凭证日期必须是同一年');
			return;
		}
		if($('#samplistRelate_startDate').val().substr(0, 4) != curSamplingParam.yyyy){
			bdoInfoBox('提示', '凭证日期必须选择账套年'+curSamplingParam.yyyy);
			return;
		}*/
		/*if ($('#dgSamplingInfo_subjectid').val() == '') {
			bdoInfoBox('提示', '请选择科目');
			return;
		}*/
		
		samplistRelate_view.localParam.urlparam.param2 = $('#samplistRelate_startDate').val().substr(0, 4);
		samplistRelate_view.localParam.urlparam.param14 = $('#samplistRelate_endDate').val().substr(0, 4);
		if($('#samplistRelate_dateType').val() == '0'){
			samplistRelate_view.localParam.urlparam.param3 = $('#samplistRelate_startDate').val();
			samplistRelate_view.localParam.urlparam.param4 = $('#samplistRelate_endDate').val();
			samplistRelate_view.localParam.urlparam.param12 = '';
			samplistRelate_view.localParam.urlparam.param13 = '';
		}else if($('#samplistRelate_dateType').val() == '1'){
			samplistRelate_view.localParam.urlparam.param3 = '';
			samplistRelate_view.localParam.urlparam.param4 = '';
			samplistRelate_view.localParam.urlparam.param12 = $('#samplistRelate_startDate').val().substr(5, 6);
			samplistRelate_view.localParam.urlparam.param13 = $('#samplistRelate_endDate').val().substr(5, 6);
		}else{
			samplistRelate_view.localParam.urlparam.param3 = '';
			samplistRelate_view.localParam.urlparam.param4 = '';
			samplistRelate_view.localParam.urlparam.param12 = '';
			samplistRelate_view.localParam.urlparam.param13 = '';
		}

		samplistRelate_view.localParam.urlparam.param5 = $('#samplistRelate_sampleMethod').val();
		samplistRelate_view.localParam.urlparam.param6 = $('#samplistRelate_voucherId').val();
		samplistRelate_view.localParam.urlparam.param7 = $('#samplistRelate_sampleUser').val();

		samplistRelate_view.localParam.urlparam.param11 = $('#samplistRelate_subjectid').val();

		BdoDataTable('samplistRelateTable', samplistRelate_view);
	});
	//关联
	$('#btn_samplistRelate_select').click(function() {
		var jqEl;
		var selectIds = [];

		var jqEl = $('input[name="samplistRelateSelect"]:checked');
		$.each(jqEl, (index, el) => {
			selectIds.push(el.value);
		});

		if (selectIds.length < 1) {
			bdoErrorBox('', '未选择数据！');
			return;
		}
		if (selectIds.length > 1) {
			bdoErrorBox('', '只能选择一条数据！');
			return;
		}
		bdoConfirmBox('提示', '确认关联文件【' + relateFile.fileName + '】?', function() {
			$.ajax({
				url: 'dgCenter/DgMain.relateSamplingDgFile.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: 'SAMPLING',
					param2: selectIds[0],
					param3: relateFile.autoId,
					param4: relateFile.customerId,
					param5: curSamplingParam.projectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						$('#modal_samplistRelate').modal('hide');
						$('#samplingFileUploadTable').DataTable().ajax.reload();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	function clearSamplingStatistics(){
		//清空tab
		if ($('#tabs_sampleResult li a[href="#tab_samplingStatistics1"]').length != 0) {
			$('#tabs_sampleResult a[href="#tab_samplingStatistics1"]').remove();
			$('#tab_samplingStatistics1').remove();
			$('#tabs_sampleResult a[href="#tab_samplingResult"]').click();
		}
		if ($('#tabs_sampleResult li a[href="#tab_voucherdetail"]').length != 0) {
			$('#tabs_sampleResult a[href="#tab_voucherdetail"]').remove();
			$('#tab_voucherdetail').remove();
			$('#tabs_sampleResult a[href="#tab_samplingResult"]').click();
		}
		//清空tab
		if ($('#tabs_sample li a[href="#tab_samplingStatistics1"]').length != 0) {
			$('#tabs_sample a[href="#tab_samplingStatistics1"]').remove();
			$('#tab_samplingStatistics1').remove();
			$('#tabs_sample a[href="#tab_samplingTest"]').click();
		}
		if ($('#tabs_sample li a[href="#tab_voucherdetail"]').length != 0) {
			$('#tabs_sample a[href="#tab_voucherdetail"]').remove();
			$('#tab_voucherdetail').remove();
			$('#tabs_sample a[href="#tab_samplingTest"]').click();
		}
	}
	/** 导出 */
	/*$('#samplingList_export').click(function() {
		exportExcelFin(this, '多科目一览', accdetail_view, 'samplingListTable');
	});*/
	
	//对输入金额进行校验
	$('#samplingSet_amountStart,#samplingSet_amountEnd,#samplingCaculation_actualImportant,#samplingInterval_adjustAmount,#samplingSet_cullAmountStart,#samplingSet_cullAmountEnd').keyup(function() {
		clearNoNum($(this));
	});
	$('#samplingCaculation_adjustAmount').keyup(function() {
		clearNoNumInt($(this));
	});
	// 修改金额区间
	$('#samplingRangeSetContent').on('keyup', '[name="startAmount"]', function(event) {
		clearNoNum($(this));
	});
	// 修改金额区间
	$('#samplingRangeSetContent').on('keyup', '[name="endAmount"]', function(event) {
		clearNoNum($(this));
	});
	// 修改金额区间
	$('#samplingRangeContent').on('keyup', '[name="samplingCount"]', function(event) {
		clearNoNumInt($(this));
	});
	//对输入张数进行校验
	$('#cutoff_num').keyup(function() {
		clearNoNumInt($(this));
	});
	//对输入金额进行校验
	$('#cutoff_amount').keyup(function() {
		clearNoNum($(this));
	});
	//对输入金额进行校验
	function clearNoNum(obj){
		obj.val(obj.val().replace(/[^\d.]/g,""));//清除"数字"和"."以外的字符
		obj.val(obj.val().replace(/^\./g,""));//验证第一个字符是数字而不是字符
		obj.val(obj.val().replace(/\.{2,}/g,"."));//只保留第一个.清除多余的
		obj.val(obj.val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));
		obj.val(obj.val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'));//只能输入两个小数
	}
	//对输入金额进行校验
	function clearNoNumInt(obj){
		obj.val(obj.val().replace(/[^\d]/g,""));//清除"数字"和"."以外的字符
	}
	//时间转换
	function dateFtt(fmt,date){ //author: meizz   
		var o = {   
				"M+" : date.getMonth()+1,                 //月份   
				"d+" : date.getDate(),                    //日   
				"h+" : date.getHours(),                   //小时   
				"m+" : date.getMinutes(),                 //分   
				"s+" : date.getSeconds(),                 //秒   
				"q+" : Math.floor((date.getMonth()+3)/3), //季度   
				"S"  : date.getMilliseconds()             //毫秒   
		};   
		if(/(y+)/.test(fmt))   
			fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
		for(var k in o)   
			if(new RegExp("("+ k +")").test(fmt))   
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
		return fmt;   
	} 
	//截止抽样保存
	$('#modal_cutoff_next').click(function() {
		var cutoff_num = $('#cutoff_num').val();
		var cutoff_amount = $('#cutoff_amount').val();
		if(cutoff_num == ''){
			bdoInfoBox('提示', '张数不能为空');
			return;
		}
		if(cutoff_num <= 0){
			bdoInfoBox('提示', '张数不能小于等于0');
			return;
		}
		/*if(cutoff_amount == ''){
			bdoInfoBox('提示', '金额不能为空');
			return;
		}*/
		if($('#cutoff_subjectid').val() == ''){
			bdoInfoBox('提示', '科目不能为空');
			return;
		}
		calculationParam = {
				lockCustomerId : curSamplingParam.customerId,
				lockYyyy : curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId,
				param11 : $('#samplingSet_subjectid').val(),
				param15 : '1',
				param16 : cutoff_num,
				param17 : cutoff_amount
		};

		//bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'finCenter/sampling.updateSamplingCutoff.json',
				type: 'post',
				data: {
					lockCustomerId: curSamplingParam.customerId,
					lockProjectId : curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: cutoff_num,
					param3: cutoff_amount,
					param4: curSamplingParam.projectId,
					param5 : '1',
					param6 : $('#cutoff_subjectid').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						//bdoSuccessBox('成功', data.resultInfo.statusText);
						samplingSetTest();
						$('#modal_cutoff').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		//});
	});
	var samplingVoucher_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG10009',
				param2: '',
				param3: '',
				param4: '',
				param5: '',
				param6: '',
				lockCustomerId: '',
				lockYyyy: ''
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			scrollX: true,
			scrollCollapse: true,
			createdRow(row, data, dataIndex) {
				$(row).addClass('edit-able');
				$(row).find('td:eq(11)').addClass('bg-success-light');
				/*if(data.selectId != '' && data.selectId != null){
					$(row).css({"color":'red'});
				}*/
				if(data.autoId == subjectentryId){
					$(row).css({"color":'red'});
				}
			},
			columnDefs: [{
					targets: 1,
					className: 'text-center',
					title: '勾选',
					name: 'autoId',
					data: 'autoId',
					width: '15px',
					render: function(data, type, row, meta) {
						var renderStr = '<input type="checkbox" name="samplingVoucherSelect" value="' + row.autoId + '|' + row.oldVoucherId + '"></input>';
						return renderStr;
					}
				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '40px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="samplingVoucherFileBtn" data-placement="top" title="上传附件" data-toggle="tooltip"><i class="fa fa-upload"></i></button>&nbsp;';
						return renderStr;
					}
				},
				{
					targets: 3,
					className: 'text-left',
					title: '凭证号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '60px'
				},
				{
					targets: 4,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '80px'
				},
				{
					targets: 5,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '100px'
				},
				{
					targets: 6,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'
				}, {
					targets: 7,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '100px'
				}, {
					targets: 8,
					className: 'text-right',
					title: '借方金额',
					name: 'debitValue',
					data: 'debitValue',
					width: '80px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 9,
					className: 'text-right',
					title: '贷方金额',
					name: 'crebitValue',
					data: 'crebitValue',
					width: '80px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}/*, {
					targets: 9,
					className: 'text-left',
					title: '汇率',
					name: 'currrate',
					data: 'currrate',
					width: '30px'
				}, {
					targets: 10,
					className: 'text-right',
					title: '外币金额',
					name: 'currValue',
					data: 'currValue',
					width: '80px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 11,
					className: 'text-left',
					title: '外币名称',
					name: 'currency',
					data: 'currency',
					width: '30px'
				}*/, {
					targets: 10,
					className: 'text-left',
					title: '附件索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '100px'
				}, {
					targets: 11,
					className: 'text-left',
					title: '附件内容填写',
					name: 'content',
					data: 'content',
					width: '100px'/*,
					render: function(data, type, row, meta) {
						if(data != null){
							return '<span><textarea class="form-control" type="text" name="content" value="' + data + '" style="text-align:left" ' + type + '>' + data + '</textarea></span>';
						}else{
							return '<span><textarea class="form-control" type="text" name="content" value="" style="text-align:left" ' + type + '></textarea></span>';
						}
					}*/
				}]
		}
	};
	function cloneObjectFn (obj){ // 对象复制
		return JSON.parse(JSON.stringify(obj))
	}
	//转金额格式
	function getMn(num) {
		var num = num.toFixed(2);
		var int = num.split('.')[0];
		var float = num.split('.')[1];
		var _number = int.toString();        // 数字转成字符串
		var result = '';            // 转换后的字符串
		var counter = '';
		for (var i = _number.length - 1; i >= 0; i--) {
			counter++;
			result = _number.charAt(i) + result;
			if (!(counter % 3) && i != 0) {
				result = ',' + result;
			}
		}
		if (result[0] == ',') {
			result = result.replace(',', '');
		}
		if (int < 0) {
			if (result[1] == ',') {
				result = result.replace(',', '');
			}
		}
		return result + '.' + float;
	}
	//转数字
	function getNum(str) {
		if(str){
			var reg = new RegExp(',', 'g');//g,表示全部替换
			str = str.replace(reg, '');
			if(str == '' || str == null){
				return 0;
			}
		}
		return str;
	}
	/** 附件内容 */
	$('#samplingVoucherDetail_table').on('dblclick', 'td', function() {
		if ($(this).closest('td').index() != 11 || !permissions) {
			return;
		}
		let $table = $(this).closest('table');
		let th = $table.DataTable().context[0].aoColumns[$table.DataTable().cell(this).index().column];
		let data = $table.DataTable().row($(this).closest('tr')).data();
		//初始相同高度
		let height = this.offsetHeight;
		$(this).html('<span><textarea type=\'text\' style=\'width:100%; height: ' + height + 'px;align=right;\'></textarea></span>');
		let input = $(this).find('textarea');
		let oldVal = data[th.name];
		if (oldVal) {
			input.val(oldVal);
		}
		input.focus();
		input.on('keydown', function(e) {
			if (e.keyCode == 13) {
				input.blur();
			}
		});
		input.on('blur', function() {
			let $table = $(this).closest('table');
			let data = $table.DataTable().row($(this).closest('tr')).data();
			let value = $(this).val();
			// reprot.param1 = customerId;
			// reprot.param2 = projectId;
			data['content'] = value;
			//reprot.param3[data.colCode] = value;
			//失去焦点直接保存
			// $(this).parent().html("<span style='color:green;'>" + value + "</span>")
			$.ajax({
				url: 'finCenter/sampling.saveSamplingInfoContent.json',
				type: 'post',
				data: {
					lockCustomerId : curSamplingParam.customerId,
					lockProjectId : curSamplingParam.projectId,
					lockProjectId: curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param2: data['autoId'],
					param3: value
				},
				dataType: 'json',
				success: function(data) {
					//initFunc();
					$('#samplingVoucherDetail_table').DataTable().ajax.reload();
					// isSort = false;
					if (data.success) {
						//提交成功后清空
						//reprot.param3 = {};
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						//reprot.param3 = {};
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});

		});

	});
	/** 上传抽凭附件 */
	$('#samplingVoucherDetail_table').on('click', 'button[name="samplingVoucherFileBtn"]', function() {
		if(permissions){
			var object = $('#samplingVoucherDetail_table').DataTable().data()[$(this).closest('tr').index()];
			uploadSubjectentryId = object.autoId;
			uploadOldVoucherId = object.oldVoucherId;
			$('#upload_samplingFileUpload').click();
		}else{
			bdoInfoBox('提示', '没有权限');
		}

	});

	//关联抽凭
	$('#samplingInfoEdit_relateSampling').click(function() {
		if($('#samplingInfoEdit_relateSampling').val() != ''){
			samplingId = relateSamplingId;
			$('#samplingSet_prev').click();
		}else{
			relateType = '1';
			samplingId = '';
			$('#modal_samplingRelated_add').modal('show');
			/*var timestamp = new Date();
			$('#samplingList_method').html(ComboLocalDicOption(true, '抽凭方式'));
			var time = '抽凭' + dateFtt('yyyyMMddhhmmss',timestamp);
			$('#samplingAdd_name_model').val(time);
			$('#samplingList_method').val('1');
			$('#samplingSet_samplingType').removeAttr('disabled');
			$('#modal-samplingAdd').modal('show');*/
		}
		
	});
	$('#sampling_related_common').click(function(e) {
		relateType = '1';
		samplingId = '';
		$('#modal_samplingRelated_add').modal('show');
		var timestamp = new Date();
        $('#samplingList_method').html(ComboLocalDicOption(true, '抽凭方式'));
        var time = '抽凭' + dateFtt('yyyyMMddhhmmss',timestamp);
        $('#samplingAdd_name_model').val(time);
        $('#samplingList_method').val('1');
		$('#samplingSet_samplingType').val('1');
        $('#samplingSet_samplingType').removeAttr('disabled');
        $('#modal-samplingAdd').modal('show');
		$('#modal_samplingRelated_add').modal('hide');
	});
	$('#sampling_related_customize').click(function(e) {
		relateType = '1';
		samplingId = '';
		$('#modal_samplingRelated_add').modal('show');
		var timestamp = new Date();
        $('#samplingList_method').html(ComboLocalDicOption(true, '抽样方式'));
        var time = '抽凭' + dateFtt('yyyyMMddhhmmss',timestamp);
        $('#samplingAdd_name_model').val(time);
		$('#samplingList_method').val('8');
		$('#samplingSet_samplingType').val('1');
		$('#samplingSet_samplingType').attr('disabled', true);
		$('#modal-samplingAdd').modal('show');
		$('#modal_samplingRelated_add').modal('hide');
	});
	/** 仅显示当前分录 */
	$('#show_currentVoucher').click(function() {
		if ($('#show_currentVoucher').is(':checked')) {
			samplingVoucher_view.localParam.urlparam.param5 = subjectentryId;
		} else {
			samplingVoucher_view.localParam.urlparam.param5 = '';
		}
		BdoDataTable('samplingVoucherDetail_table', samplingVoucher_view);
	});
	/** 查看抽凭 */
	$('#btn_samplingDetail_show_result').click(function() {
		//清空tab
		clearSamplingStatistics();
		SamplingResult({region: '#samplistResultPage', data: agrs.data, samplingId: samplingVoucher_view.localParam.urlparam.param6});
		$('#modal_samplistResult1').modal('show');
	});
	//对输入金额进行校验
	$('#samplingSet_balance_rank,#samplingSet_credit_rank,#samplingSet_debit_rank').blur(function() {
		clearNoNumInt($(this));
	});
	//查询供应商范围
	function searchSamplingSetCompany(){

		if ($('#samplingSet_endDate').val() == '' && $('#samplingSet_startDate').val() != '') {
			$('#samplingSet_endDate').val($('#samplingSet_startDate').val());
		}

		if ($('#samplingSet_startDate').val() == '' && $('#samplingSet_endDate').val() != '') {
			$('#samplingSet_startDate').val($('#samplingSet_endDate').val());
		}

		if ($('#samplingSet_startDate').val() == '') {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '请选择凭证开始日期');
			return;
		}

		if ($('#samplingSet_endDate').val() == '') {
			$('#samplingSet_endDate').focus();
			bdoInfoBox('提示', '请选择凭证结束日期');
			return;
		}
		if ($('#samplingSet_startDate').val() > $('#samplingSet_endDate').val()) {
			$('#samplingSet_startDate').focus();
			bdoInfoBox('提示', '凭证结束日期不能小于凭证开始日期');
			return;
		}
		if($('#samplingSet_startDate').val().substr(0, 4) != $('#samplingSet_endDate').val().substr(0, 4)){
			bdoInfoBox('提示', '凭证日期必须是同一年');
			return;
		}
		/*if($('#samplingSet_startDate').val().substr(0, 4) != curSamplingParam.yyyy){
			bdoInfoBox('提示', '凭证日期必须选择账套年'+curSamplingParam.yyyy);
			return;
		}*/
		if ($('#samplingSet_subjectid').val() == '') {
			bdoInfoBox('提示', '请选择科目');
			return;
		}
		
		if($('#samplingSet_dataResource').val() == '1'){
			sampleCompany_view.localParam.urlparam.lockCustomerId = curSamplingParam.customerId;
			sampleCompany_view.localParam.urlparam.param1 = $('#samplingSet_startDate').val().substr(0, 4);
			sampleCompany_view.localParam.urlparam.param2 = $('#samplingSet_endDate').val().substr(0, 4);
			if($('#samplingSet_dateType').val() == '0'){
				sampleCompany_view.localParam.urlparam.param3 = $('#samplingSet_startDate').val();
				sampleCompany_view.localParam.urlparam.param4 = $('#samplingSet_endDate').val();
				sampleCompany_view.localParam.urlparam.param12 = '';
				sampleCompany_view.localParam.urlparam.param13 = '';
			}else if($('#samplingSet_dateType').val() == '1'){
				sampleCompany_view.localParam.urlparam.param3 = '';
				sampleCompany_view.localParam.urlparam.param4 = '';
				sampleCompany_view.localParam.urlparam.param12 = $('#samplingSet_startDate').val().substr(5, 6);
				sampleCompany_view.localParam.urlparam.param13 = $('#samplingSet_endDate').val().substr(5, 6);
			}else{
				sampleCompany_view.localParam.urlparam.param3 = '';
				sampleCompany_view.localParam.urlparam.param4 = '';
				sampleCompany_view.localParam.urlparam.param12 = '';
				sampleCompany_view.localParam.urlparam.param13 = '';
			}

			sampleCompany_view.localParam.urlparam.param11 = $('#samplingSet_subjectid').val();

			sampleCompany_view.localParam.urlparam.param15 = $('#samplingSet_dataResource').val();

			sampleCompany_view.localParam.urlparam.param24 = curSamplingParam.serail;
			sampleCompany_view.localParam.urlparam.lockYyyy = $('#samplingSet_startDate').val().substr(0, 4);
			sampleCompany_view.localParam.urlparam.sqlId = 'FINCP100001';
			var rankParam = [{
				balanceRank:$('#samplingSet_balance_rank').val(),
				creditRank:$('#samplingSet_credit_rank').val(),
				debitRank:$('#samplingSet_debit_rank').val(),
				customizeAssitem:$('#samplingSet_customize_assitem').val()
			}];
			sampleCompany_view.localParam.urlparam.jsonData = JSON.stringify(rankParam);
			BdoDataTable('samplingSetCompanyTable', sampleCompany_view);
			calculationParam = cloneObjectFn(sampleCompany_view.localParam.urlparam);
		}
		dataSource = $('#samplingSet_dataResource').val();

	}
	$('#navTabSamplingSet a').on('show.bs.tab', function(evt) {
		window.xxrPageKey = $(evt.currentTarget).text();
		var href = evt.target.href;
		var index = href.lastIndexOf('#');
		var id = href.substring(index + 1);
		switch (id) {
			case 'dgSamplingSearchTab':
				$('#samplingSet_prev').attr('style', 'display:none');
				$('#samplingSet_next').attr('style', 'display:none');
				break;
			case 'dgSamplingCommonTab':
				samplingType = '1';
				$('#samplingSet_prev').removeAttr("style");
				$('#samplingSet_next').removeAttr("style");
				break;
			case 'dgSamplingCompanyTab':
				samplingType = '2';
				$('#samplingSet_prev').removeAttr("style");
				$('#samplingSet_next').removeAttr("style");
				break;
			
			default:
				break;
		}
	});
	/** table 属性 */
	var sampleAssItemSelect_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/Sampling.querySamplingAssItemSelect.json',
			urlparam: {
				sqlId: '',
				menuId: window.sys_menuId,
				param1: samplingId,
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			scrollX: true,
			scrollY: false,
			autoWidth: false,
			//order: [2, 'asc'],
			//pageLength: 30,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="samplingAssItemDeleteBtn" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						return renderStr;
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '核算编号',
					name: 'assItemId',
					data: 'assItemId',
					width: '100px',
					filter: {
						type: 'date'
					}
				}, {
					targets: 3,
					className: 'text-left',
					title: '核算名称',
					name: 'assItemName',
					data: 'assItemName',
					width: '200px'
				}
			]
		}
	};
	//核算多选窗口
	$('#samplingSet_assitemid').focus(function() {
		sampleAssItemSelect_view.localParam.urlparam.param1 = samplingId;
		BdoDataTable('assItemSelectTable', sampleAssItemSelect_view);
		$('#modal_assItemSelect').modal('show');
	});
	//添加核算
	function addAssItemSelect(assItemId){
		$.ajax({
			url: 'finCenter/Sampling.saveSamplingAssItemSelect.json',
			type: 'post',
			data: {
				sqlId: 'DG10003',
				menuId: window.sys_menuId,
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId : curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param1: samplingId,
				param2: assItemId
			},
			dataType: 'json',
			success: function(data) {
				if (data && data.success && data.data) {
					$('#samplingSet_assitemid').val(data.data[0].assItemId);
					$('#assItemSelectTable').DataTable().ajax.reload(null,false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}
	/** 删除核算 */
	$('#assItemSelectTable').on('click', 'button[name="samplingAssItemDeleteBtn"]', function() {
		var object = $('#assItemSelectTable').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('删除', '是否确定删除？', function() {
			$.ajax({
				url: 'finCenter/Sampling.deleteSamplingAssItemSelect.json',
				type: 'post',
				data: {
					lockCustomerId: object.customerId,
					lockProjectId : curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: object.assItemId
				},
				dataType: 'json',
				success: function(data) {
					if (data && data.success && data.data) {
						$('#samplingSet_assitemid').val(data.data[0].assItemId);
						$('#assItemSelectTable').DataTable().ajax.reload(null,false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	/** table 属性 */
	var sampleAssItemCullSelect_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/Sampling.querySamplingAssItemCullSelect.json',
			urlparam: {
				sqlId: '',
				menuId: window.sys_menuId,
				param1: samplingId,
				lockCustomerId: curSamplingParam.customerId,
				lockYyyy: curSamplingParam.yyyy,
				lockProjectId : curSamplingParam.projectId
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			scrollX: true,
			scrollY: false,
			autoWidth: false,
			//order: [2, 'asc'],
			//pageLength: 30,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="samplingAssItemCullDeleteBtn" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						return renderStr;
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '核算编号',
					name: 'assItemId',
					data: 'assItemId',
					width: '100px',
					filter: {
						type: 'date'
					}
				}, {
					targets: 3,
					className: 'text-left',
					title: '核算名称',
					name: 'assItemName',
					data: 'assItemName',
					width: '200px'
				}
			]
		}
	};
	//核算多选窗口
	$('#samplingSet_assitemid_cull').focus(function() {
		sampleAssItemCullSelect_view.localParam.urlparam.param1 = samplingId;
		BdoDataTable('assItemCullSelectTable', sampleAssItemCullSelect_view);
		$('#modal_assItemCullSelect').modal('show');
	});
	//添加核算
	function addAssItemCullSelect(assItemId){
		$.ajax({
			url: 'finCenter/Sampling.saveSamplingAssItemCullSelect.json',
			type: 'post',
			data: {
				sqlId: 'DG10003',
				menuId: window.sys_menuId,
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId : curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param1: samplingId,
				param2: assItemId
			},
			dataType: 'json',
			success: function(data) {
				if (data && data.success && data.data) {
					$('#samplingSet_assitemid_cull').val(data.data[0].assItemId);
					$('#assItemCullSelectTable').DataTable().ajax.reload(null,false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}
	/** 删除核算 */
	$('#assItemCullSelectTable').on('click', 'button[name="samplingAssItemCullDeleteBtn"]', function() {
		var object = $('#assItemCullSelectTable').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('删除', '是否确定删除？', function() {
			$.ajax({
				url: 'finCenter/Sampling.deleteSamplingAssItemCullSelect.json',
				type: 'post',
				data: {
					lockCustomerId: object.customerId,
					lockProjectId : curSamplingParam.projectId,
					lockYyyy: curSamplingParam.yyyy,
					param1: samplingId,
					param2: object.assItemId
				},
				dataType: 'json',
				success: function(data) {
					if (data && data.success && data.data) {
						$('#samplingSet_assitemid_cull').val(data.data[0].assItemId);
						$('#assItemCullSelectTable').DataTable().ajax.reload(null,false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	/** 弹出创建截止测试 */
	$('#samplingSet_add_cutoff').click(function() {
		relateType = '0';
		samplingId = '';
		//var timestamp = (new Date()).getTime();//返回数值单位是毫秒；
		$('#samplingList_method').html(ComboLocalDicOption(true, '抽样方式'));
		var timestamp = new Date();
		var time = '抽凭' + dateFtt('yyyyMMddhhmmss',timestamp);
		$('#samplingAdd_name_model').val(time);
		$('#samplingList_method').val('7');
		$('#samplingSet_samplingType').val('1');
		$('#samplingSet_samplingType').removeAttr('disabled');
		$('#modal-samplingAdd').modal('show');
	});
	/** 弹出创建自定义抽凭 */
	$('#samplingSet_add_customize').click(function() {
		relateType = '0';
		samplingId = '';
		//var timestamp = (new Date()).getTime();//返回数值单位是毫秒；
		$('#samplingList_method').html(ComboLocalDicOption(true, '抽样方式'));
		var timestamp = new Date();
		var time = '抽凭' + dateFtt('yyyyMMddhhmmss',timestamp);
		$('#samplingAdd_name_model').val(time);
		$('#samplingList_method').val('8');
		$('#samplingSet_samplingType').val('1');
		$('#samplingSet_samplingType').attr('disabled', true);
		$('#modal-samplingAdd').modal('show');
	});
	/** 上传抽凭附件 */
	$('#btn_sampling_file_upload').click(function() {
		if(permissions){
			var jqEl;
			uploadSubjectentryId = '';//上传附件id
			uploadOldVoucherId = '';//上传附件凭证号
			var jqEl = $('input[name="samplingVoucherSelect"]:checked');
			$.each(jqEl, (index, el) => {
				var arr = el.value.split('|');
				uploadSubjectentryId = uploadSubjectentryId + arr[0] + ',';
				uploadOldVoucherId = uploadOldVoucherId + arr[1] + ',';
			});

			if (uploadSubjectentryId == '') {
				bdoErrorBox('', '请至少选择1条数据！');
				return;
			}
			uploadSubjectentryId = uploadSubjectentryId.substring(0, uploadSubjectentryId.length - 1);
			uploadOldVoucherId = uploadOldVoucherId.substring(0, uploadOldVoucherId.length - 1);
			$('#upload_samplingFileUpload').click();
		}else{
			bdoInfoBox('提示', '没有权限');
		}
	});
	// 选择子科目检验
	function checkChildSubject(subjectIds, callBack, element){
		$.ajax({
			url: 'finCenter/Sampling.querySamplingChildSubject.json',
			type: 'post',
			data: {
				menuId: window.sys_menuId,
				lockCustomerId: curSamplingParam.customerId,
				lockProjectId : curSamplingParam.projectId,
				lockYyyy: curSamplingParam.yyyy,
				param1: samplingId,
				param2: subjectIds
			},
			dataType: 'json',
			success: function(data) {
				if (data && data.success) {
					callBack(element, subjectIds);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}
	// 选择子科目检验
	function setSubject(element, subjectIds){
		$('#' + element).val(subjectIds).change();
	}
	/** 抽样方法提示 */
	$('#samplingList_mode_actual').change(function() {
		if($('#samplingList_mode_actual').val() == '2'){
			var tips= '提示：<br>小规模总体抽样方法仅适用于抽样总体中的项目可能为250个或更少，并且项目组已计划了风险评估程序以实现下列目的：<br>';
			tips = tips + '(1) 充分了解总体的特征，包括预期错报的规模和频率<br>';
			tips = tips + '(2) 如果总体中的项目超过250个（即略高于250个），但项目组仍然认为总体规模较小，可以咨询审计技术部门或使用传统抽样方法。如果项目组没有实施风险评估程序以充分了解抽样总体，或项目数量明显超过250个，则应使用传统抽样方法。如果总体中的项目数少于40个，则可使用本工作表底部的最低样本量表。';
			$('#sampling_mode_tips').html(tips);
		}else if($('#samplingList_mode_actual').val() == '3'){
			var tips= '提示：<br>大规模总体抽样方法仅适用于账户余额可能是实际执行的重要性的100倍（或更多）并且项目组已实施了下列程序：<br>';
			tips = tips + '(1) 已实施风险评估程序，为风险识别和与总体特征相关的认定提供支持性证据<br>';
			tips = tips + '(2) 已将异常项目从审计抽样的总体中剔除，并根据数据分析或其他测试中的识别结果进行专门测试<br>';
			tips = tips + '(3) 了解抽样总体，以便项目组确定抽样总体中的项目是一组同质的常规交易或余额<br>';
			tips = tips + '(4) 对总体进行适当分层（如必要）<br>';
			tips = tips + '(5) 注册会计师前期和本期实施风险评估的经验表明，预期抽样总体错报为零或可以忽略不计（即，根据上一年的经验，预计总体不会出现系统性问题，对样本中识别出的任何错报进行推断后的金额远低于实际执行重要性/可容忍错报的金额。）<br>';
			tips = tips + '(6) 对与该认定相关的内部控制设计的评价，该项控制单独或与其他控制相结合，表明控制能够有效地防止、发现和纠正重大错报，并且很可能是零错报或可以忽略不计的错报。<br>';
			tips = tips + '如果项目组没有实施风险评估程序以充分了解抽样总体，或总体不符合上述条件，则应使用传统抽样方法。<br>';
			$('#sampling_mode_tips').html(tips);
		}else{
			$('#sampling_mode_tips').html('');
		}
	});
};

