
SamplingResult = (agrs) => {
	var _template
		, mount
		, listener
		, tabPage;
	_template = agrs.template || tplLoader('dgCenter/html/dg/samplingResult.html');
	agrs.template = _template;
	let samplingId = agrs.samplingId;
	var tempOldVoucherId;
	var color1 = '#53f9f9';
	var color2 = '#FF8800';
	var color = '#53f9f9';
	var dataSource = '1';
	var calculationParam;
	var samplingCount = 0;
	var initData;
	var cullData;//剔除数据
	var subjectentryId;//结果id
	var relateFile;//关联的附件
	var permissions;//权限
	var sampleMethod;
	
	var myDate = new Date();
	var accyear = myDate.getFullYear();//年

	
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
	
	/** table 属性 */
	var columnCount = 1;
	var dgSamplingResult_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {

				sqlId: 'DG10002',
				menuId: window.sys_menuId,
				param1: window.CUR_PROJECTID,
				param17: '1',
				param18: samplingId,
				lockCustomerId: window.CUR_CUSTOMERID
			}
		},
		tableParam: {
			select: true,
			scrollX: true,
			scrollY: false,
			//scrollCollapse: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			//autoWidth: false,
			//order: [2, 'asc'],
			pageLength: 30,
			/*createdRow(row, data, dataIndex) {
				if(data.auditResultName != '' && data.auditResultName != null){
					$(row).css({"color":'red'});
				}
			},*/
			columnDefs: [
				/*{
					targets: columnCount++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						//renderStr += '<button class="btn btn-xs btn-success" type="button" name="samplingInfoEditBtn" data-placement="top" title="编辑" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="samplingInfoFileBtn" data-placement="top" title="查看" data-toggle="tooltip"><i class="fa fa-eye"></i></button>&nbsp;';
						return renderStr;
					}
				},*/ {
					targets: columnCount++,
					className: 'text-left',
					title: '凭证编号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '60px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '100px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '抽凭方式',
					name: 'sampleMethod',
					data: 'sampleMethod',
					width: '150px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '抽凭人',
					name: 'sampleUserName',
					data: 'sampleUserName',
					width: '60px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '150px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '核算类型',
					name: 'assTotalName',
					data: 'assTotalName',
					width: '200px'
				}, {
					targets: columnCount++,
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
					targets: columnCount++,
					className: 'text-right',
					title: '借方发生金额',
					name: 'debitValue',
					data: 'debitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: columnCount++,
					className: 'text-right',
					title: '贷方发生金额',
					name: 'crebitValue',
					data: 'crebitValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: columnCount++,
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
					targets: columnCount++,
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
					targets: columnCount++,
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
					targets: columnCount++,
					className: 'text-left',
					title: '原始凭证内容完整',
					name: 'contentComplete',
					data: 'contentComplete',
					width: '110px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '有授权批准',
					name: 'authorize',
					data: 'authorize',
					width: '100px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '账务处理正确',
					name: 'handleCorrect',
					data: 'handleCorrect',
					width: '100px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '账证的内容相符',
					name: 'contentMatch',
					data: 'contentMatch',
					width: '100px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '账证的金额相符',
					name: 'amountMatch',
					data: 'amountMatch',
					width: '100px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '截止测试正确',
					name: 'cutoffCorrect',
					data: 'cutoffCorrect',
					width: '100px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '核对内容6',
					name: 'customizeResult1',
					data: 'customizeResult1',
					width: '100px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '核对内容7',
					name: 'customizeResult2',
					data: 'customizeResult2',
					width: '100px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '核对内容8',
					name: 'customizeResult3',
					data: 'customizeResult3',
					width: '100px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '核对内容9',
					name: 'customizeResult4',
					data: 'customizeResult4',
					width: '100px'
				}, {
					targets: columnCount++,
					className: 'text-left',
					title: '抽凭名称',
					name: 'sampleName',
					data: 'sampleName',
					width: '100px',
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}
				}, {
					targets: columnCount++,
					orderable: true,
					className: 'text-left',
					title: '关联抽凭名称',
					name: 'relateSampleName',
					data: 'relateSampleName',
					width: '100px',
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}
				}
			]
		}
	};
	var dgSamplingCount_view = {
		localParam: {
			tabNum: false,
			url: 'finCenter/sampling.querySamplingCount.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG10012',
				param1: '',
				param2: samplingId,
				param3: '1',
				lockProjectId: window.CUR_PROJECTID,
				lockCustomerId: window.CUR_CUSTOMERID,
				lockYyyy: window.CUR_PROJECT_ACC_YEAR
			}
		},
		tableParam: {
			select: true,
			pageLength: 30,
			scrollX: true,
			scrollCollapse: true,
			lengthChange: false,
			//dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			//fixedThead: true,
			//fixedHeight: '500px',
			columnDefs: [{
					targets: 1,
					className: 'text-left',
					title: '抽凭方式',
					name: 'sampleMethodName',
					data: 'sampleMethodName',
					width: '100px'
				}, {
					targets: 2,
					className: 'text-center',
					title: '样本数量',
					name: 'voucherNum',
					data: 'voucherNum',
					width: '50px'
				}, {
					targets: 3,
					className: 'text-center',
					title: '样本数量占发生额总数量的比例',
					name: 'rate1',
					data: 'rate1',
					width: '50px'
				}, {
					targets: 4,
					className: 'text-right',
					title: '借方抽样金额',
					name: 'debitOcc',
					data: 'debitOcc',
					width: '50px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 5,
					className: 'text-center',
					title: '借方抽样金额占借方总发生额比例',
					name: 'rate2',
					data: 'rate2',
					width: '50px'
				}, {
					targets: 6,
					className: 'text-right',
					title: '贷方抽样金额',
					name: 'creditOcc',
					data: 'creditOcc',
					width: '50px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 7,
					className: 'text-center',
					title: '贷方抽样金额占贷方总发生额比例',
					name: 'rate3',
					data: 'rate3',
					width: '50px'
				}, {
					targets: 8,
					className: 'text-left',
					title: '抽凭名称',
					name: 'sampleName',
					data: 'sampleName',
					width: '50px'
				}
			]
		}
	};
	
	/** 弹出抽样抽凭结果 */
	var showSamplingResult = function(autoId) {
		$('#modal_samplingCountResult').modal('show');
		$.ajax({
			url: 'finCenter/sampling.querySamplingCondition.json',
			type: 'post',
			data: {
				lockCustomerId: window.CUR_CUSTOMERID,
				lockYyyy: window.CUR_PROJECT_ACC_YEAR,
				lockProjectId : window.CUR_PROJECTID,
				param1: autoId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success && data.data.length > 0) {

					BdoDataTable('dgSamplingResultTable', dgSamplingResult_view);
					var sampleModeDicData = DicJsonlData.responseJSON['抽凭模式'];
					var sampleMethodDicData = DicJsonlData.responseJSON['抽样方式'];
					var typeIdDicData = DicJsonlData.responseJSON['凭证字'];
					var riskDicData = DicJsonlData.responseJSON['错报风险等级'];
					var controlDicData = DicJsonlData.responseJSON['控制测试获取的保证程度'];
					var analysisDicData = DicJsonlData.responseJSON['实质性分析程序获取的保证程度'];
					var pledgeDicData = DicJsonlData.responseJSON['从其他OSP获取的保证程度'];
					var variableDicData = DicJsonlData.responseJSON['是否能够应对样本总体的变量因素'];
					var condition = '';
					sampleMethod = data.data[0].samplist.sampleMethod;
					if(data.data[0].samplist.sampleMethod !== '7'){
						$('#sampleResult_count_show').removeAttr("display");
						dgSamplingCount_view.localParam.urlparam.param1 = data.data[0].firstSubjectId;
						BdoDataTable('dgSamplingCountTable', dgSamplingCount_view);
						condition = condition + '<table border= "1" width="1000"><tr><td rowspan="14" algin="center" width="25%">抽凭条件</td><td width="25%">科目</td>';
						if(data.data[0].samplist.detailSubjectName != '' && data.data[0].samplist.detailSubjectName != null){
							condition = condition + '<td colspan="2">' + data.data[0].samplist.detailSubjectName + '</td></tr>';
						}else{
							condition = condition + '<td colspan="2"></td></tr>';
						}
						if(data.data[0].samplist.sampleModeActual != '' && data.data[0].samplist.sampleModeActual != null){
							condition = condition + '<tr><td>抽凭方式</td><td colspan="2">' + sampleModeDicData[data.data[0].samplist.sampleModeActual] + '</td></tr>';
						}else{
							condition = condition + '<tr><td>抽凭方式</td><td colspan="2"></td></tr>';
						}
						condition = condition + '<tr><td>选取样本方法</td><td colspan="2">' + sampleMethodDicData[data.data[0].samplist.sampleMethod] + '</td></tr>';
						if(data.data[0].samplist.vchDateStart == data.data[0].samplist.vchDateEnd){
							condition = condition + '<tr><td>抽凭期间</td><td colspan="2">' + data.data[0].samplist.vchDateStart + '</td></tr>';
						}else{
							condition = condition + '<tr><td>抽凭期间</td><td colspan="2">' + data.data[0].samplist.vchDateStart + '-' + data.data[0].samplist.vchDateEnd + '</td></tr>';
						}
						if(data.data[0].samplist.assItemName != '' && data.data[0].samplist.assItemName != null){
							condition = condition + '<tr><td>核算类型</td><td colspan="2">' + data.data[0].samplist.assItemName + '</td></tr>';
						}else{
							condition = condition + '<tr><td>核算类型</td><td colspan="2"></td></tr>';
						}
						var amountStart = '';
						var amountEnd = '';
						var amount = '';
						if(data.data[0].samplist.amountStart != null){
							amountStart = formatMoney2(data.data[0].samplist.amountStart,1);
						}
						if(data.data[0].samplist.amountEnd != null){
							amountEnd = formatMoney2(data.data[0].samplist.amountEnd,1);
						}
						if(amountStart != '' && amountStart != null && (amountEnd == '' || amountEnd == null)){
							amount = '大于等于' + amountStart;
						}else if((amountStart == '' || amountStart == null) && amountEnd != '' && amountEnd != null){
							amount = '小于等于' + amountEnd;
						}else{
							amount = amountStart + '-' + amountEnd;
						}
						var amountType = '';
						if(data.data[0].samplist.amountType == '1'){
							amountType = '借方发生额';
						}else if(data.data[0].samplist.amountType == '-1'){
							amountType = '贷方发生额';
						}else{
							amountType = '借方或贷方发生额';
						}
						condition = condition + '<tr><td>抽凭范围</td><td width="25%">' + amountType + '</td><td width="25%">' + amount + '</td></tr>';
						if(data.data[0].samplist.cullSubjectname != '' && data.data[0].samplist.cullSubjectname != null){
							condition = condition + '<tr><td rowspan="4">剔除条件</td><td>对方科目</td><td>' + data.data[0].samplist.cullSubjectname + '</td></tr>';
						}else{
							condition = condition + '<tr><td rowspan="4">剔除条件</td><td>对方科目</td><td></td></tr>';
						}
						if(data.data[0].samplist.detailAssItemName != '' && data.data[0].samplist.detailAssItemName != null){
							condition = condition + '<tr><td>核算科目</td><td>' + data.data[0].samplist.detailAssItemName + '</td></tr>';
						}else{
							condition = condition + '<tr><td>核算科目</td><td></td></tr>';
						}
						var cullAmountStart = '';
						var cullAmountEnd = '';
						var cullAmount = '';
						if(data.data[0].samplist.cullAmountStart != null){
							cullAmountStart = formatMoney2(data.data[0].samplist.cullAmountStart,1);
						}
						if(data.data[0].samplist.cullAmountEnd != null){
							cullAmountEnd = formatMoney2(data.data[0].samplist.cullAmountEnd,1);
						}
						if(cullAmountStart != '' && cullAmountStart != null && (cullAmountEnd == '' || cullAmountEnd == null)){
							cullAmount = '大于等于' + cullAmountStart;
						}else if((cullAmountStart == '' || cullAmountStart == null) && cullAmountEnd != '' && cullAmountEnd != null){
							cullAmount = '小于等于' + cullAmountEnd;
						}else{
							cullAmount = cullAmountStart + '-' + cullAmountEnd;
						}
						var cullAmountType = '';
						if(data.data[0].samplist.cullAmountType == '1'){
							cullAmountType = '借方发生额';
						}else if(data.data[0].samplist.cullAmountType == '-1'){
							cullAmountType = '贷方发生额';
						}else{
							cullAmountType = '借方或贷方发生额';
						}
						condition = condition + '<tr><td>' + cullAmountType + '</td><td>' + cullAmount + '</td></tr>';
						condition = condition + '<tr><td>剔除原因</td><td>' + data.data[0].samplist.cullReason + '</td></tr>';
						if(data.data[0].samplist.balanceRank != '' && data.data[0].samplist.balanceRank != null){
							condition = condition + '<tr><td rowspan="4">核算维度</td><td>期末余额前几名</td><td>' + data.data[0].samplist.balanceRank + '</td></tr>';
						}else{
							condition = condition + '<tr><td rowspan="4">核算维度</td><td>期末余额前几名</td><td></td></tr>';
						}
						if(data.data[0].samplist.creditRank != '' && data.data[0].samplist.creditRank != null){
							condition = condition + '<tr><td>贷方发生额前几名</td><td>' + data.data[0].samplist.creditRank + '</td></tr>';
						}else{
							condition = condition + '<tr><td>贷方发生额前几名</td><td></td></tr>';
						}
						if(data.data[0].samplist.debitRank != '' && data.data[0].samplist.debitRank != null){
							condition = condition + '<tr><td>借方发生额前几名</td><td>' + data.data[0].samplist.debitRank + '</td></tr>';
						}else{
							condition = condition + '<tr><td>借方发生额前几名</td><td></td></tr>';
						}
						condition = condition + '<tr><td>自定义辅助核算</td><td>' + data.data[0].samplist.customizeAssItemName + '</td></tr>';
						condition = condition + '</table>';
					}else{
						$('#sampleResult_count_show').css('display', 'none');
						condition = condition + '<table border= "1" width="1000"><tr><td rowspan="4" algin="center">抽凭条件</td><td>科目</td>';
						if(data.data[0].samplist.detailSubjectName != '' && data.data[0].samplist.detailSubjectName != null){
							condition = condition + '<td colspan="2">' + data.data[0].samplist.detailSubjectName + '</td></tr>';
						}else{
							condition = condition + '<td colspan="2"></td></tr>';
						}
						condition = condition + '<tr><td>抽凭方式</td><td colspan="2">' + sampleMethodDicData[data.data[0].samplist.sampleMethod] + '</td></tr>';
					}
					if(data.data[0].samplist.sampleMethod == '7'){
						condition = condition + '<tr><td>抽取资产负债表日前后张数</td><td colspan="2">' + data.data[0].samplist.cutoffNum + '</td></tr>';
						if(data.data[0].samplist.cutoffAmount != null){
							condition = condition + '<tr><td>截止抽样金额</td><td colspan="2">' + '大于等于' + formatMoney2(data.data[0].samplist.cutoffAmount,1) + '</td></tr>';
						}else{
							condition = condition + '<tr><td>截止抽样金额</td><td colspan="2"></td></tr>';
						}
						condition = condition + '</table>';
					}/*else if(data.data[0].samplist.sampleMethod == '3'){
						condition = condition + '\n';
						condition = condition + '<table border= "1" width="1000"><tr><td rowspan="' + (data.data[0].range.length + 1) + '" algin="center" width="20%">自定义金额范围</td><td width="20%">大于等于</td><td width="20%">小于</td><td width="20%">总数</td><td width="20%">抽凭数</td></tr>';
						for(var i = 0;i < data.data[0].range.length;i++){
							var startRange = '';
							var endRange = '';
							if(data.data[0].range[i].startAmount != null){
								startRange = formatMoney2(data.data[0].range[i].startAmount,1);
							}
							if(data.data[0].range[i].endAmount != null){
								endRange = formatMoney2(data.data[0].range[i].endAmount,1);
							}
							condition = condition + '<tr><td>' + startRange + '</td><td>' + endRange + '</td><td>' + data.data[0].range[i].totalCount + '</td><td>' + data.data[0].range[i].samplingCount + '</td></tr>';
						}
						condition = condition + '</table>';
					}*/else if(data.data[0].samplist.sampleMethod == '8'){
						condition = condition + '\n';
						condition = condition + '<table border= "1" width="1000"><tr><td text-algin="center" width="25%">具体参数</td><td width="25%">自定义方法与理由</td><td colspan="2">' + data.data[0].samplist.customizeReason + '</td></tr>';
						condition = condition + '</table>';
					}else{ //if(data.data[0].samplist.sampleMethod == '1' || data.data[0].samplist.sampleMethod == '2'){

						var risk = data.data[0].risk != null ? riskDicData[data.data[0].risk] : '&nbsp;';
						var control = data.data[0].control != null ? controlDicData[data.data[0].control] : '';
						var analysis = data.data[0].analysis != null ? analysisDicData[data.data[0].analysis] : '';
						var pledge = data.data[0].pledge != null ? pledgeDicData[data.data[0].pledge] : '&nbsp;';
						var rFactor = data.data[0].rFactor != null ? data.data[0].rFactor : '';
						var actualImportant = data.data[0].actualImportant != null ? formatMoney2(data.data[0].actualImportant,1) : '';
						var initialAmount = data.data[0].initialAmount != null ? data.data[0].initialAmount : '&nbsp;';
						var intAmount = data.data[0].intAmount != null ? data.data[0].intAmount : '';
						var variable = data.data[0].variable != null ? variableDicData[data.data[0].variable] : '';
						var samplingCount = data.data[0].samplingCount != null ? data.data[0].samplingCount : '&nbsp;';
						var adjustAmount = data.data[0].adjustAmount != null ? data.data[0].adjustAmount : '';
						var calAmount = data.data[0].calAmount != null ? data.data[0].calAmount : '';
						var calRemark = data.data[0].calRemark != null && data.data[0].calRemark != '' ? data.data[0].calRemark : '&nbsp;';
						
						condition = condition + '\n';
						condition = condition + '<table border= "1" width="1000"><tr><td rowspan="12" algin="center" width="25%">具体参数</td><td width="25%">样本总体金额</td><td width="25%">剔除条件的金额</td><td width="25%">剔除后样本总体金额</td></tr>';
						condition = condition + '<tr><td>' + formatMoney2(data.data[0].totalAmount,1) + '</td><td>' + formatMoney2(data.data[0].cullAmount,1) + '</td><td>' + formatMoney2(data.data[0].samplingAmount,1) + '</td></tr>';
						condition = condition + '<tr><td>错报风险等级</td><td>控制测试获取的保证程度</td><td>实质性分析程序获取的保证程度</td></tr>';
						condition = condition + '<tr><td>' + risk + '</td><td>' + control + '</td><td>' + analysis + '</td></tr>';
						condition = condition + '<tr><td>从其他OSP获取的保证程度</td><td>其他实质性程序抽样R因子</td><td>实际执行的重要性</td></tr>';
						condition = condition + '<tr><td>' + pledge + '</td><td>' + rFactor + '</td><td>' + actualImportant + '</td></tr>';
						condition = condition + '<tr><td>初始样本量</td><td>初始样本量总计(不包括小数点)</td><td>是否能够应对样本总体的变量因素</td></tr>';
						condition = condition + '<tr><td>' + initialAmount + '</td><td>' + intAmount + '</td><td>' + variable + '</td></tr>';
						condition = condition + '<tr><td>剔除后样本总体数量</td><td>审计确认样本量</td><td>公式计算出的样本量</td></tr>';
						condition = condition + '<td>' + samplingCount + '</td><td>' + adjustAmount + '</td><td>' + calAmount + '</td></tr>';
						condition = condition + '<tr><td>备注</td><td></td><td></td></tr>';
						condition = condition + '<td>' + calRemark + '</td><td></td><td></td></tr>';
						condition = condition + '</table>';
					}/*else{
						condition = condition + '\n';
						condition = condition + '<table border= "1" width="1000"><tr><td rowspan="4" algin="center" width="25%">具体参数</td><td width="25%">样本总体金额</td><td width="25%">剔除条件的金额</td><td width="25%">剔除后样本总体金额</td></tr>';
						condition = condition + '<tr><td>' + formatMoney2(data.data[0].totalAmount,1) + '</td><td>' + formatMoney2(data.data[0].cullAmount,1) + '</td><td>' + formatMoney2(data.data[0].samplingAmount,1) + '</td></tr>';
						condition = condition + '<tr><td>剔除后样本总体数量</td><td>审计确认样本量</td><td></td></tr>';
						condition = condition + '<td>' + data.data[0].samplingCount + '</td><td>' + data.data[0].adjustAmount + '</td><td></td></tr>';
						condition = condition + '</table>';
					}*/
					if(data.data[0].samplist.sampleMethod == '3'){
						condition = condition + '\n';
						condition = condition + '<table border= "1" width="1000"><tr><td rowspan="' + (data.data[0].range.length + 1) + '" algin="center" width="20%">自定义金额范围</td><td width="20%">大于等于</td><td width="20%">小于</td><td width="20%">总数</td><td width="20%">抽凭数</td></tr>';
						for(var i = 0;i < data.data[0].range.length;i++){
							var startRange = '';
							var endRange = '';
							if(data.data[0].range[i].startAmount != null){
								startRange = formatMoney2(data.data[0].range[i].startAmount,1);
							}
							if(data.data[0].range[i].endAmount != null){
								endRange = formatMoney2(data.data[0].range[i].endAmount,1);
							}
							condition = condition + '<tr><td>' + startRange + '</td><td>' + endRange + '</td><td>' + data.data[0].range[i].totalCount + '</td><td>' + data.data[0].range[i].samplingCount + '</td></tr>';
						}
						condition = condition + '</table>';
					}
					$('#samplistResult_Condition').html(condition);
					$('#sampleUser').html("抽凭人：" + data.data[0].samplist.sampleUserName + "&nbsp;抽凭时间：" + getMyDate(data.data[0].samplist.sampleTime));
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});

	};
	
	mount = () => {
		$(agrs.region).empty().append(_template);
		$('#samplingInfoEditResult_auditResult').html(ComboLocalDicOption(true, '抽凭结论'));
		showSamplingResult(samplingId);
		OneUI.initHelper('slimscroll');
	};

	mount();

	/** 处理抽凭 */
	$('#dgSamplingResultTable').on('click', 'button[name="samplingInfoFileBtn"]', function() {
		var object = $('#dgSamplingResultTable').DataTable().data()[$(this).closest('tr').index()];
		permissions = false;
		$('#modal_samplingFileUpload').modal('show');
		subjectentryId = object.autoId;
		samplingResultFilePage.attachTableCfg.localParam.urlparam.param5 = '';
		samplingResultFilePage.attachTableCfg.localParam.urlparam.param6 = '2';
		samplingResultFilePage.attachTableCfg.tableParam.columnDefs[2].title = '索引号';
		samplingResultFilePage.attachTableCfg.tableParam.columnDefs[2].sTitle = '索引号';
		samplingResultFilePage.attachTableCfg.localParam.urlparam.param8 = object.oldVoucherId;
		samplingResultFilePage.attachTableCfg.localParam.urlparam.param9 = object.vchDate;
		BdoDataTable('samplingFileUploadResultTable', samplingResultFilePage.attachTableCfg);
		$('#upload_samplingFileBtn').css('display', 'none');
		$('#samplingInfoEditResult_auditResult').val(object.auditResult);
		$('#samplingInfoEditResult_remark').val(object.remark);
		$('#samplingInfoEditResult_customizeResultName1').val(object.customizeResultName1);
		$('#samplingInfoEditResult_customizeResultName2').val(object.customizeResultName2);
		$('#samplingInfoEditResult_customizeResultName3').val(object.customizeResultName3);
		$('#samplingInfoEditResult_customizeResultName4').val(object.customizeResultName4);
		if(object.contentComplete == '否'){
			$('[name=\'samplingInfoEditResult_contentComplete\'][data-result=0]').click();
		}else{
			$('[name=\'samplingInfoEditResult_contentComplete\'][data-result=1]').click();
		}
		if(object.authorize == '否'){
			$('[name=\'samplingInfoEditResult_authorize\'][data-result=0]').click();
		}else{
			$('[name=\'samplingInfoEditResult_authorize\'][data-result=1]').click();
		}
		if(object.handleCorrect == '否'){
			$('[name=\'samplingInfoEditResult_handleCorrect\'][data-result=0]').click();
		}else{
			$('[name=\'samplingInfoEditResult_handleCorrect\'][data-result=1]').click();
		}
		if(object.contentMatch == '否'){
			$('[name=\'samplingInfoEditResult_contentMatch\'][data-result=0]').click();
		}else{
			$('[name=\'samplingInfoEditResult_contentMatch\'][data-result=1]').click();
		}
		if(object.amountMatch == '否'){
			$('[name=\'samplingInfoEditResult_amountMatch\'][data-result=0]').click();
		}else{
			$('[name=\'samplingInfoEditResult_amountMatch\'][data-result=1]').click();
		}
		if(object.cutoffCorrect == '否'){
			$('[name=\'samplingInfoEditResult_cutoffCorrect\'][data-result=0]').click();
		}else{
			$('[name=\'samplingInfoEditResult_cutoffCorrect\'][data-result=1]').click();
		}
		if(object.customizeResult1 == '否'){
			$('[name=\'samplingInfoEditResult_customizeResult1\'][data-result=0]').click();
		}else if(object.customizeResult1 == '是'){
			$('[name=\'samplingInfoEditResult_customizeResult1\'][data-result=1]').click();
		}else{
			$('[name=\'samplingInfoEditResult_customizeResult1\'][data-result=0]').removeAttr("checked");  
			$('[name=\'samplingInfoEditResult_customizeResult1\'][data-result=1]').removeAttr("checked");  
		}
		if(object.customizeResult2 == '否'){
			$('[name=\'samplingInfoEditResult_customizeResult2\'][data-result=0]').click();
		}else if(object.customizeResult2 == '是'){
			$('[name=\'samplingInfoEditResult_customizeResult2\'][data-result=1]').click();
		}else{
			$('[name=\'samplingInfoEditResult_customizeResult2\'][data-result=0]').removeAttr("checked");  
			$('[name=\'samplingInfoEditResult_customizeResult2\'][data-result=1]').removeAttr("checked");  
		}
		if(object.customizeResult3 == '否'){
			$('[name=\'samplingInfoEditResult_customizeResult3\'][data-result=0]').click();
		}else if(object.customizeResult3 == '是'){
			$('[name=\'samplingInfoEditResult_customizeResult3\'][data-result=1]').click();
		}else{
			$('[name=\'samplingInfoEditResult_customizeResult3\'][data-result=0]').removeAttr("checked");  
			$('[name=\'samplingInfoEditResult_customizeResult3\'][data-result=1]').removeAttr("checked");  
		}
		if(object.customizeResult4 == '否'){
			$('[name=\'samplingInfoEditResult_customizeResult4\'][data-result=0]').click();
		}else if(object.customizeResult4 == '是'){
			$('[name=\'samplingInfoEditResult_customizeResult4\'][data-result=1]').click();
		}else{
			$('[name=\'samplingInfoEditResult_customizeResult4\'][data-result=0]').removeAttr("checked");  
			$('[name=\'samplingInfoEditResult_customizeResult4\'][data-result=1]').removeAttr("checked");  
		}
		//凭证详细
		samplingVoucher_view.localParam.urlparam.param1 = object.projectId;
		//samplingVoucher_view.localParam.urlparam.param2 = object.voucherId;
		samplingVoucher_view.localParam.urlparam.param3 = object.oldVoucherId;
		samplingVoucher_view.localParam.urlparam.param4 = object.vchDate;
		samplingVoucher_view.localParam.urlparam.lockCustomerId = object.customerId;
		samplingVoucher_view.localParam.urlparam.lockYyyy = object.vchDate.substr(0, 4);
		BdoDataTable('samplingVoucherDetailResult_table', samplingVoucher_view);
	});
	
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
				//$(row).find('td:eq(10)').addClass('bg-success-light');
				if(data.selectId != '' && data.selectId != null){
					$(row).css({"color":'red'});
				}
			},
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '凭证号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '60px'
				},
				{
					targets: 2,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '80px'
				},
				{
					targets: 3,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '100px'
				},
				{
					targets: 4,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'
				}, {
					targets: 5,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '100px'
				}, {
					targets: 6,
					className: 'text-right',
					title: '借方金额',
					name: 'debitValue',
					data: 'debitValue',
					width: '80px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 7,
					className: 'text-right',
					title: '贷方金额',
					name: 'crebitValue',
					data: 'crebitValue',
					width: '80px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-left',
					title: '附件索引号',
					name: 'fileIndexId',
					data: 'fileIndexId',
					width: '100px'
				}, {
					targets: 9,
					className: 'text-left',
					title: '附件内容填写',
					name: 'content',
					data: 'content',
					width: '100px'
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
		}
		return str;
	}
	$('#sampling_pdf_close').click(function() {
		$('#modal_samplingFileUpload').modal('hide');
	});
	//下载pdf
	$('#sampling_export_pdf').click(function() {
		var pdfPage = $('#samplistResult_Condition').html();
		var dgSamplingCount = [];
		if(sampleMethod !== '7'){
			var dgSamplingCountData = $('#dgSamplingCountTable').DataTable().data();
			for(var i = 0;i < dgSamplingCountData.length;i++){
				dgSamplingCount.push(dgSamplingCountData[i]);
			}

		}
		var dgSamplingResult = [];
		var dgSamplingResultData = $('#dgSamplingResultTable').DataTable().data();
		for(var i = 0;i < dgSamplingResultData.length;i++){
			dgSamplingResult.push(dgSamplingResultData[i]);
		}
		var temp = {
				dgSamplingParam: pdfPage,
				dgSamplingCountTitle: dgSamplingCount_view.tableParam.columnDefs,
				dgSamplingCountData: dgSamplingCount,
				dgSamplingResultTitle: dgSamplingResult_view.tableParam.columnDefs,
				dgSamplingResultData: dgSamplingResult
			};
		
		var jsonStr = JSON.stringify(temp);
		downloadFile('finCenter/sampling.exportPdf.json', {
			jsonData: jsonStr,
			param1: window.CUR_PROJECTID,
			param2: sampleMethod,
			param17: '1',
			param18: samplingId,
			lockProjectId: window.CUR_PROJECTID,
			lockCustomerId: window.CUR_CUSTOMERID,
			lockYyyy: window.CUR_PROJECT_ACC_YEAR
		});
	});
	
};

