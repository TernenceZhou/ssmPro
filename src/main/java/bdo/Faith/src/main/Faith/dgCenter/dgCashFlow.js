/**
 * 现金流量表
 */
function DgCashFlowPage(context) {
	var $context = context ? $('#dgCashFlowPage') : $;
	var $tabUL = $('#navTabUl', $context);

	// 项目负责人
	var manager;
	// 树节点索引号
	var fileIndexId;
	// 树节点ID
	var subjectTreeId;
	// 报表编制人ID
	var reportEditId;
	// 报表模板ID
	var vocationId;
	// 报表模板名称
	var vocationName;
	// 项目信息
	var projectInfo;
	// 编制方式
	var method_radio_value = $('input[name="method_radioOptions"]:checked').val();
	method_radio_value = method_radio_value == undefined ? '' : method_radio_value;
	// 现金流量表在线底稿ID
	var filePaperId;
	// 导入
	var cashFlowUploadForm;
	$.ajax({
		type: 'post',
		async: false,
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
				vocationId = data.data[0].tbReportTemplate;
				vocationName = data.data[0].tbReportTemplateName;
				reportEditId = data.data[0].cashFlowEditer;
				manager = data.data[0].manager;
				projectInfo = data.data[0];
				if(data.data[0].preProjectId != null){
					$('#cashFlow_clone').parent().remove();
				}
				setSelect();
			} else {
				bdoErrorBox('提示', data.resultInfo.statusText);
			}
		}
	});
	function setSelect() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgProject.getProjectMember.json',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID,
				param2: window.CUR_CUSTOMERID
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					var reportEdit = '<option value="" label="" />';
					data.data.map(item => {
						reportEdit += '<option style="color: #000000"  value="' + item.id + '" label="' + item.name + '" />';
					});
					$('#report_editer').append(reportEdit);
					$('#report_editer').val(reportEditId);
				} else {
					$('#report_editer').val('');
					bdoErrorBox(data.resultInfo.statusText);
				}
			}
		});
	}
	// 设置现金流量表类型分类
	function setCashFlowType(generateMethod){
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgAuditFile.getCashFlowType.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: window.CUR_PROJECT_ACC_YEAR,
				param4: generateMethod,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					var $txt;
					if(data.data[0].typeStr == '女巫型'){
						$txt = $('<font>该公司属于&nbsp;<a href="#">女巫型</a>&nbsp;风险性一般<font>');
					}else if(data.data[0].typeStr == '母鸡型'){
						$txt = $('<font>该公司属于&nbsp;<a href="#">母鸡型</a>&nbsp;风险性较低<font>');
					}else if(data.data[0].typeStr == '蛮牛型'){
						$txt = $('<font>该公司属于&nbsp;<a href="#">蛮牛型</a>&nbsp;风险性较低<font>');
					}else if(data.data[0].typeStr == '奶牛型'){
						$txt = $('<font>该公司属于&nbsp;<a href="#">奶牛型</a>&nbsp;风险性较低<font>');
					}else if(data.data[0].typeStr == '咸鱼型'){
						$txt = $('<font>该公司属于&nbsp;<a href="#">咸鱼型</a>&nbsp;风险性较高<font>');
					}else if(data.data[0].typeStr == '躺平型'){
						$txt = $('<font>该公司属于&nbsp;<a href="#">躺平型</a>&nbsp;风险性较高<font>');
					}else if(data.data[0].typeStr == '赌徒型'){
						$txt = $('<font>该公司属于&nbsp;<a href="#">赌徒型</a>&nbsp;风险性较高<font>');
					}else if(data.data[0].typeStr == '蝙蝠型'){
						$txt = $('<font>该公司属于&nbsp;<a href="#">蝙蝠型</a>&nbsp;风险性较高<font>');
					}
					// 现金流量表类型
					$('#cashFlowTypeText').empty();
					$('#cashFlowTypeText').append($txt);
				}
			}
		});
	}
	var cnt = 0;
	const cashFlowTableCfg = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00394',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: vocationId
				};
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
			paging: false,
			scrollX: true,
			// scrollY: '330px',
			select: false,
			ordering: false,
			serverSide: true,
			createdRow(row, data, dataIndex) {
				if(data.calFun == null || data.calFun == ''){
					if(data.preAmount != null){
						$(row).find('td').eq(4).addClass('bg-success-light');
					}
				}
			},
			columnDefs: [
				{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					title: '报表项编号',
					name: 'colCode',
					data: 'colCode',
					width: '80px'
				}, {
					targets: ++cnt,
					title: '报表项名称',
					name: 'colDisp',
					data: 'colDisp',
					width: '180px',
					render: function(data, type, row, meta) {
						return data.replace(/ /g, '&nbsp;');
					}
				}, {
					targets: ++cnt,
					title: '本期金额',
					name: 'curAmount',
					data: 'curAmount',
					width: '150px',
					className: 'text-right',
					render: function(data, type, row, meta) {
						if(data != null){
							return formatMoney(data);
						}
					}
				}, {
					targets: ++cnt,
					title: '上期金额',
					name: 'preAmount',
					data: 'preAmount',
					width: '150px',
					className: 'text-right',
					render: function(data, type, row, meta) {
						if(data != null){
							return formatMoney(data);
						}
					}
				}, {
					targets: ++cnt,
					title: '计算公式',
					name: 'calFun',
					data: 'calFun',
					width: '150px',
					render: function(data, type, row, meta) {
						if(data != null){
							return renderStr = '<label>' + data + '</label>';
						}
					}
				}
			]
		}
	};
	const checkTableCfg = {
		localParam: {
			url: 'dgCenter/DgAuditFile.queryCashFlowCheck.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: vocationId,
					param5: method_radio_value
				};
				return param;
			})(),
			tabNum: false
		},
		tableParam: {
			paging: false,
			select: false,
			ordering: false,
			lengthChange: false,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-12"tr>>',
			columnDefs: [
				{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					className: 'text-left font-s12 width-jyx',
					title: '校验项',
					name: 'disp',
					data: 'disp',
					width: '380px'
				}, {
					targets: ++cnt,
					title: '事项1',
					name: 'amount1',
					data: 'amount1',
					width: '150px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						if (data != null) {
							return formatMoney(data);
						}
					}
				}, {
					targets: ++cnt,
					title: '事项2',
					name: 'amount2',
					data: 'amount2',
					width: '150px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						if (data != null) {
							return formatMoney(data);
						}
					}
				}, {
					targets: ++cnt,
					title: '差异',
					name: 'diff',
					data: 'diff',
					width: '150px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						if (data == 0) {
							return '<div width="100%" style="text-align: center;">平<div>';
						} else if (data != null) {
							return formatMoney(data);
						}
					}
				}
			]
		}
	};
	const checkExtraTableCfg = {
		localParam: {
			url: 'dgCenter/DgAuditFile.queryCashFlowCheck.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: vocationId,
					param5: method_radio_value
				};
				return param;
			})(),
			tabNum: false
		},
		tableParam: {
			paging: false,
			select: false,
			ordering: false,
			lengthChange: false,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-12"tr>>',
			columnDefs: [
				{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					className: 'text-left font-s12 width-jyx',
					title: '校验项',
					name: 'disp',
					data: 'disp',
					width: '380px'
				}, {
					targets: ++cnt,
					title: '事项1',
					name: 'amount1',
					data: 'amount1',
					width: '150px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					title: '事项2',
					name: 'amount2',
					data: 'amount2',
					width: '150px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					title: '差异',
					name: 'diff',
					data: 'diff',
					width: '150px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						if (data == 0) {
							return '<div width="100%" style="text-align: center;">平<div>';
						} else if (data != null) {
							return formatMoney(data);
						}
					}
				}
			]
		}
	};
	const checkItemTableCfg = {
		localParam: {
			url: 'dgCenter/DgAuditFile.queryCashFlowItemCheck.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: vocationId,
					param5: method_radio_value
				};
				return param;
			})(),
			tabNum: false
		},
		tableParam: {
			paging: false,
			select: false,
			ordering: false,
			lengthChange: false,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-12"tr>>',
			columnDefs: [
				{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					className: 'text-left font-s12 width-jyx',
					title: '校验项',
					name: 'disp',
					data: 'disp',
					width: '380px'
				}, {
					targets: ++cnt,
					title: '事项1',
					name: 'amount1',
					data: 'amount1',
					width: '150px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					title: '事项2',
					name: 'amount2',
					data: 'amount2',
					width: '150px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					title: '差异',
					name: 'diff',
					data: 'diff',
					width: '150px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						if (data == 0) {
							return '<div width="100%" style="text-align: center;">平<div>';
						} else if (data != null) {
							return formatMoney(data);
						}
					}
				}
			]
		}
	};
	const cashFlowExtraTableCfg = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00400',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: '1'
				};
				return param;
			})(),
			tabNum: false
		},
		tableParam: {
			paging: false,
			scrollX: true,
			// scrollY: '330px',
			select: false,
			ordering: false,
			serverSide: true,
			createdRow(row, data, dataIndex) {
				if((data.isTitleRow == null || data.isTitleRow == '') 
						&& (data.isFormulaRow == null || data.isFormulaRow == '')
						&& (data.isDescRow == null || data.isDescRow == '')){
					$(row).find('td').eq(2).addClass('bg-success-light');
					$(row).find('td').eq(3).addClass('bg-success-light');
					$(row).find('td').eq(4).addClass('bg-success-light');
				}
				if(data.isFormulaRow != null && data.isFormulaRow == 1){
					$(row).find('td').eq(2).addClass('bg-success');
					$(row).find('td').eq(3).addClass('bg-success');
					$(row).find('td').eq(4).addClass('bg-success');
				}
				if(data.colNum == 2){
					$(row).find('td').eq(4).hide();
				}
			},
			columnDefs: [
				{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					name: 'rowIndex',
					data: 'rowIndex',
					width: '20px',
					className: 'text-center',
					render: function (data, type, row, meta) {
						return 'R' + (data + 1);
					}
				}, {
					targets: ++cnt,
					name: 'operate',
					data: 'operate',
					width: '30px',
					className: 'text-center',
					render: function (data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-success" name="deleteFileRow" type="button" title="删除行" data-row="' + meta.row + '"><i class="fa fa-cut"></i></button>';
						return renderStr;
					}
				}, {
					targets: ++cnt,
					name: 'columnDesc1',
					data: 'columnDesc1',
					width: '350px',
					className: 'text-left',
					render: function (data, type, row, meta) {
						if(row.isDescRow != null && row.isDescRow == '1'){
							return '<div width="100%">' + data.replace(/ /g, '&nbsp;') + '<div>';
						}else if(row.isFormulaRow != null && row.isFormulaRow == 1){
							return '<div width="100%" style="font-weight: 600;">' + data.replace(/ /g, '&nbsp;') + '<div>';
						}else if(row.isTitleRow != null && row.isTitleRow == 1){
							return '<div width="100%" style="text-align: center;font-weight: 600;">' + data + '<div>';
						}else{
							return '<div width="100%" style="font-size: 12px;height: 17px;">' + data.replace(/ /g, '&nbsp;') + '<div>';
						}
					}
				}, {
					targets: ++cnt,
					name: 'column2',
					data: 'column2',
					width: '150px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						if(row.isTitleRow != null && row.isTitleRow == 1){
							return '<div width="100%" style="text-align: center;font-weight: 600;">' + row.columnDesc2 + '<div>';
						}else{
							if(data != null){
								return formatMoney(data);
							}
						}
					}
				}, {
					targets: ++cnt,
					name: 'column3',
					data: 'column3',
					width: '150px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						if(row.isTitleRow != null && row.isTitleRow == 1){
							return '<div width="100%" style="text-align: center;font-weight: 600;">' + row.columnDesc3 + '<div>';
						}else{
							if(data != null){
								return formatMoney(data);
							}
						}
					}
				}
			]
		}
	};
	const cashFlowItemTableCfg = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00400',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: '2'
				};
				return param;
			})(),
			tabNum: false
		},
		tableParam: {
			paging: false,
			scrollX: true,
			// scrollY: '330px',
			select: false,
			ordering: false,
			serverSide: true,
			createdRow(row, data, dataIndex) {
				if((data.isTitleRow == null || data.isTitleRow == '') 
						&& (data.isFormulaRow == null || data.isFormulaRow == '')
						&& (data.isDescRow == null || data.isDescRow == '')){
					$(row).find('td').eq(2).addClass('bg-success-light');
					$(row).find('td').eq(3).addClass('bg-success-light');
					$(row).find('td').eq(4).addClass('bg-success-light');
				}
				if(data.isFormulaRow != null && data.isFormulaRow == 1){
					$(row).find('td').eq(2).addClass('bg-success');
					$(row).find('td').eq(3).addClass('bg-success');
					$(row).find('td').eq(4).addClass('bg-success');
				}
				if(data.colNum == 2){
					$(row).find('td').eq(4).hide();
				}
			},
			columnDefs: [
				{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					name: 'rowIndex',
					data: 'rowIndex',
					width: '20px',
					className: 'text-center',
					render: function (data, type, row, meta) {
						return 'R' + (data + 1);
					}
				}, {
					targets: ++cnt,
					name: 'operate',
					data: 'operate',
					width: '30px',
					className: 'text-center',
					render: function (data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-success" name="deleteFileRow" type="button" title="删除行" data-row="' + meta.row + '"><i class="fa fa-cut"></i></button>';
						return renderStr;
					}
				}, {
					targets: ++cnt,
					name: 'columnDesc1',
					data: 'columnDesc1',
					width: '350px',
					className: 'text-left',
					render: function (data, type, row, meta) {
						if(row.isDescRow != null && row.isDescRow == '1'){
							return '<div width="100%">' + data.replace(/ /g, '&nbsp;') + '<div>';
						}else if(row.isFormulaRow != null && row.isFormulaRow == 1){
							return '<div width="100%" style="font-weight: 600;">' + data.replace(/ /g, '&nbsp;') + '<div>';
						}else if(row.isTitleRow != null && row.isTitleRow == 1){
							return '<div width="100%" style="text-align: center;font-weight: 600;">' + data + '<div>';
						}else{
							return '<div width="100%" style="font-size: 12px;height: 17px;">' + data.replace(/ /g, '&nbsp;') + '<div>';
						}
					}
				}, {
					targets: ++cnt,
					name: 'column2',
					data: 'column2',
					width: '150px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						if(row.isTitleRow != null && row.isTitleRow == 1){
							return '<div width="100%" style="text-align: center;font-weight: 600;">' + row.columnDesc2 + '<div>';
						}else{
							if(data != null){
								return formatMoney(data);
							}
						}
					}
				}, {
					targets: ++cnt,
					name: 'column3',
					data: 'column3',
					width: '150px',
					className: 'text-right',
					render: function (data, type, row, meta) {
						if(row.isTitleRow != null && row.isTitleRow == 1){
							return '<div width="100%" style="text-align: center;font-weight: 600;">' + row.columnDesc3 + '<div>';
						}else{
							if(data != null){
								return formatMoney(data);
							}
						}
					}
				}
			]
		}
	};
	const compareTableCfg = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00396',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR
				};
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
			paging: false,
			scrollX: true,
			// scrollY: '330px',
			select: false,
			ordering: false,
			serverSide: true,
			columnDefs: [
				{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					title: '报表项编号',
					name: 'colCode',
					data: 'colCode',
					width: '80px'
				}, {
					targets: ++cnt,
					title: '报表项名称',
					name: 'colDisp',
					data: 'colDisp',
					width: '180px',
					render: function(data, type, row, meta) {
						return data.replace(/ /g, '&nbsp;');
					}
				}, {
					targets: ++cnt,
					title: '本期金额（公式法）',
					name: 'amount1',
					data: 'amount1',
					width: '150px',
					className: 'text-right',
					render: function(data, type, row, meta) {
						if(data != null){
							return formatMoney(data);
						}
					}
				}, {
					targets: ++cnt,
					title: '本期金额（直接法）',
					name: 'amount2',
					data: 'amount2',
					width: '150px',
					className: 'text-right',
					render: function(data, type, row, meta) {
						if(data != null){
							return formatMoney(data);
						}
					}
				}, {
					targets: ++cnt,
					title: '差异（公式法-直接法）',
					name: 'diff',
					data: 'diff',
					width: '150px',
					className: 'text-right',
					render: function(data, type, row, meta) {
						if(data != null){
							return formatMoney(data);
						}
					}
				}
			]
		}
	};

	const cashFlowUploadFileComponet = {
		id: 'cashFlowUploadFileForm',
		display: 'tableform-one',
		column: 1,
		props: {
			jsonData: Object
		},
		options: {
			propsData: {
				jsonData: {
					autoId: filePaperId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					year: window.CUR_PROJECT_ACC_YEAR,
					vocationId: vocationId
				}
			}
		},
		data() {
			return {
				ajaxConfig: {
					type: 'POST',
					url: 'dgCenter/DgAuditFile.uploadCashFlowFile.json',
					dataType: 'json',
					success(data) {
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#cashFlowUploadModal').modal('hide');
							$('#checkTable').DataTable().ajax.reload();
							$('#cashFlowTable').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			};
		},
		methods: {
			onDownloadCashFlowTplClick() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.downloadCashFlowTpl.json',
					// async : false,
					data: {
						menuId: window.sys_menuId,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR,
						param4: vocationId
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							var dataString = data.data[0].fileData;
							var fileName = data.data[0].fileName;
							saveAs(dataURLtoFile(dataString, fileName), fileName);
							bdoSuccessBox('成功');
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			},
			onUploadCashFlowClick() {
				cashFlowUploadForm.jsonData.autoId = filePaperId;
				this.uploadFile(true);
			},
			onCancelClick() {
				$('#cashFlowUploadModal').modal('hide');
			}
		},
		buttons: [{
			id: 'downloadCashFlowTplClickBtn',
			icon: 'fa-floppy-o',
			style: 'btn-primary',
			text: '下载模板',
			typeAttr: {
				'v-on:click': 'onDownloadCashFlowTplClick'
			}
		},{
			id: 'uploadCashFlowClickBtn',
			icon: 'fa-floppy-o',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onUploadCashFlowClick'
			}
		}, {
			id: 'cancelCashFlowClicktBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'v-on:click': 'onCancelClick'
			}
		}],
		items: [{
			id: 'cashFlowFile',
			type: 'file',
			label: '现金流量表',
			rowspan: 1,
			colspan: 1,
			typeAttr: {
				readonly: false
			},
			validate: {
				rules: {
					required: true
				}
			},
			plugin: {
				name: 'fileinput',
				options: {
					allowedFileExtensions: ['xlsx'],
					uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
					uploadExtraData() {
						return {};
					}
				}
			}
		}]
	};

	/**
	 * 绑定事件
	 */
	function eventBind() {
		(function(){
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgAuditFile.queryCashFlowCheck.json',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: vocationId,
					param5: method_radio_value
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data && data.data.length > 0){
							for(var list of data.data){
								if(list.diff != 0){
									$('#check_table_hidden').click();
									break;
								}
							}
						}
					}
				}
			});
		})();
		$('#dgCashFlowPage [data-toggle="tabs"] a').on('show.bs.tab', function(evt) {
			let href = evt.target.href;
			let index = href.lastIndexOf('#');
			let id = href.substring(index + 1);
			switch (id) {
				case 'cashFlowTab':
					$('#checkTable').DataTable().ajax.reload();
					$('#cashFlowTable').DataTable().ajax.reload();
					break;
				case 'cashFlowExtraTab':
					$('#checkExtraTable').DataTable().ajax.reload();
					$('#cashFlowExtraTable').DataTable().ajax.reload();
					$('#cashFlowExtraTable_wrapper .dataTables_scrollHeadInner table').css('display', 'none');
					break;
				case 'cashFlowItemTab':
					$('#checkItemTable').DataTable().ajax.reload();
					$('#cashFlowItemTable').DataTable().ajax.reload();
					$('#cashFlowItemTable_wrapper .dataTables_scrollHeadInner table').css('display', 'none');
					break;
				case 'compareTab':
					$('#compareTable').DataTable().ajax.reload();
					break;
				default:
					break;
			}
		});
		// 选择现金流量表做成方式
		$('input[name="method_radioOptions"]').change(function (e) {
			var text = '';
			if($('input[name="method_radioOptions"]:checked').val() == 'option1'){
				text = '更换现金流量表编制方式将会以现金流量表公式法的数据做检验项，您确认要更换吗？';
			}else if($('input[name="method_radioOptions"]:checked').val() == 'option2'){
				text = '更换现金流量表编制方式将会以现金流量表直接法的数据做检验项，您确认要更换吗？';
			}
			bdoConfirmBox('提示', text, function() {
				// 现金流量表编制方式修改
				bdoInProcessingBox('修改中...');
				method_radio_value = $('input[name="method_radioOptions"]:checked').val();
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.updateCashFlowData.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR,
						param4: method_radio_value,
						param5: filePaperId,
						param6: vocationId
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							setCashFlowType(method_radio_value == 'option2' ? 1 : 0);
							if(method_radio_value == 'option2'){
								cashFlowTableCfg.localParam.urlparam.sqlId = 'DG00395';
								$('#cashFlowExtraTabId').css('display', 'block');
								$('#cashFlowItemTabId').css('display', 'block');
							}else{
								cashFlowTableCfg.localParam.urlparam.sqlId = 'DG00394';
								$('#cashFlowExtraTabId').css('display', 'none');
								$('#cashFlowItemTabId').css('display', 'none');
							}
							$('#cashFlowTable').DataTable().ajax.reload();
							checkTableCfg.localParam.urlparam.param5 = method_radio_value;
							$('#checkTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			}, function() {
				if(method_radio_value == ''){
					$('input[name="method_radioOptions"]').removeAttr('checked');
				}else if(method_radio_value == 'option1'){
					$('input[name="method_radioOptions"][value="option1"]').prop('checked',true);
				}
				else if(method_radio_value == 'option2'){
					$('input[name="method_radioOptions"][value="option2"]').prop('checked',true);
				}
			});
		});
		// 打开现金流量表底稿
		$('button[name="openXJQYFile"]').click(function () {
			let doIt = () => {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					// async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00224',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: filePaperId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							// 打开底稿
							var nodeData = {
								extraOptions: data.data[0],
								currentNode: {
									extraOptions: data.data[0]
								}
							};
							nodeData.autoId = nodeData.extraOptions.autoId;
							nodeData.workpaperId = nodeData.extraOptions.workpaperId;
							nodeData.extraOptions.tableDiv = 4;
							nodeData.menuId = window.sys_menuId;
							$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
							window.open('/Faith/dgcenter.do?m=openQYXJFile&customerId=' + window.CUR_CUSTOMERID + '&projectId=' + window.CUR_PROJECTID + '&fileType=' + 2);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			};
			// 有前推项目
			if(projectInfo.preProjectId != null && projectInfo.preProjectId != ''){
				bdoInProcessingBox('该项目存在前推项目，第一次打开时会克隆前推项目的公式法底稿...');
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.clonePreProjectCashFlowFile.json',
					data: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							doIt();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			}else{
				doIt();
			}
		});
		// 现金流量表直接法
		$('button[name="cashFlowDirectMethod"]').click(function () {
			let doIt = () => {
				if (window.sys_menuId != null && window.sys_menuId != '' && typeof (window.sys_menuId) != 'undefined') {
					localStorage.setItem("menuId", window.sys_menuId);
				}
				window.open("./auditReport/index.html");
			};
			// 有前推项目
			if(projectInfo.preProjectId != null && projectInfo.preProjectId != ''){
				bdoInProcessingBox('该项目存在前推项目，第一次打开时会克隆前推项目的直接法规则并初始化...');
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.clonePreProjectCashFlowRules.json',
					data: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							doIt();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			}else{
				doIt();
			}
		});
		$('#cashFlowTypeText').on('click', 'a', function() {
			$('#cashFlowTypeModal').modal('show');
		});
		// 现金流量表--单元格双击事件--修改上期值
		$('#cashFlowTable tbody').on('dblclick', 'td', function() {
			var th = $('#cashFlowTable').DataTable().context[0].aoColumns[$(this).index()];
			if (th.name === 'preAmount') {
				var data = $('#cashFlowTable').DataTable().row($(this).closest('tr')).data();
				if(data.calFun == null || data.calFun == ''){
					var td = $(this).closest('td');
					td.html('<span><input type="text" style="width:100%; align=right;"></span>');
					var input = $(this).find('input');
					var oldVal = data[th.name];
					if (oldVal != 0) {
						input.val(oldVal);
					}
					input.focus();
					input.on('keydown', function(e) {
						if (e.keyCode == 13) {
							input.blur();
						}
					});
					input.on('blur', function() {
						var value = this.value;
						value = value.toString().replace(/,/g, '').replace(/\t/g, '');
						if(value != oldVal){
							if(isNaN(value)) {
								bdoInfoBox('提示', '单元格值不全是数字。', 1000);
								return;
							}
							if (value == '') {
								value = 0;
							}
							var td = $(this).parents('td');
							var object = $('#cashFlowTable').DataTable().data()[$(this).closest('tr').index()];
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgAuditFile.updateCashFlowPreAmount.json',
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: window.CUR_PROJECT_ACC_YEAR,
									param4: object.autoId,
									param5: value,
									param6: method_radio_value
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										$('#checkTable').DataTable().ajax.reload();
										$('#cashFlowTable').DataTable().ajax.reload();
										bdoSuccessBox('成功', data.resultInfo.statusText);
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}else{
							$('#cashFlowTable').DataTable().ajax.reload();
							bdoInfoBox('提示', '单元格值未做修改。');
						}
					});
				}
			}
		});
		// 编制人修改
		$('#report_editer').change(function () {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgAuditFile.saveCashFlowEditer.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: $(this).val(),
					param4: $(this).find('option:selected').attr('label')
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox('保存现金流量表编制人成功！');
					} else {
						bdoErrorBox(data.resultInfo.statusText);
					}
				}
			});
		});
		// 刷新
		$('#cashFlow_refresh').click(function() {
			$('#checkTable').DataTable().ajax.reload();
			$('#cashFlowTable').DataTable().ajax.reload();
			setCashFlowType(method_radio_value == 'option2' ? 1 : 0);
		});
		// 重置
		$('#cashFlow_reset').click(function() {
			$('#cashFlowResetModal').modal('show');
		});
		$('input[name="reset_type"]').change(function () {
			var reset_type_radio_value = $('input[name="reset_type"]:checked').val();
			if(reset_type_radio_value == 0){
				$('#reset_div_0').css('display', 'block');
				$('#reset_div_1').css('display', 'none');
				$('#reset_div_2').css('display', 'none');
			}else if(reset_type_radio_value == 1){
				$('#reset_div_0').css('display', 'none');
				$('#reset_div_1').css('display', 'block');
				$('#reset_div_2').css('display', 'none');
			}else if(reset_type_radio_value == 2){
				$('#reset_div_0').css('display', 'none');
				$('#reset_div_1').css('display', 'none');
				$('#reset_div_2').css('display', 'block');
			}
		});
		$('#cashFlow_reset_sure').click(function() {
			bdoConfirmBox('提示', '是否确定重置现金流量表？', function() {
				bdoInProcessingBox('重置中...');
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.clearCashFlow.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR,
						param4: vocationId,
						param5: filePaperId,
						param6: $('input[name="reset_type"]:checked').val()
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#report_editer').val('');
							$('#checkTable').DataTable().ajax.reload();
							$('#cashFlowTable').DataTable().ajax.reload();
							setCashFlowType(method_radio_value == 'option2' ? 1 : 0);
							bdoSuccessBox('重置成功', data.resultInfo.statusText);
							$('#cashFlowResetModal').modal('hide');
						} else {
							bdoErrorBox('重置失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		// 确认完成
		$('#cashFlow_check').click(function() {
			bdoConfirmBox('提示', '是否确认完成现金流量表？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.updateAuditedState.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR,
						param4: vocationId,
						param5: method_radio_value
					},
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
		});
		// 导入
		$('#cashFlow_import').click(function() {
			$('#cashFlowUploadModal').modal('show');
		});
		$('#cashFlowUploadModal').on('hidden.bs.modal', function() {
			cashFlowUploadForm.resetUploadComponent();
		});
		$('#cashFlowUploadModal').on('show.bs.modal', function() {
			cashFlowUploadForm.resetUploadComponent();
		});
		// 导出
		$('#cashFlow_export').click(function() {
			let tableConfig = cashFlowTableCfg;
			let columnInfo = getColumnsInfo(tableConfig.tableParam.columnDefs);
			let myParams = applyIf({}, tableConfig.localParam.urlparam);
			delete  myParams.sort;
			myParams.page = '';
			myParams.start = '';
			myParams.limit = '';
			myParams.queryUrl = tableConfig.localParam.url;
			myParams.columnMap = columnInfo;
			myParams.filePaperId = filePaperId;
			myParams.methodValue = method_radio_value;
			myParams = JSON.stringify(myParams);
			let title = encodeURI('现金流量表');
			let param = {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: myParams,
				title: title
			};
			$.ajax({
				url: 'dgCenter/DgAuditFile.exportCashFlow.json',
				data: param,
				type: 'post',
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						var dataString = data.data[0].fileData;
						var fileName = data.data[0].fileName;
						bdoSuccessBox('成功', '现金流量表导出成功！');
						saveAs(dataURLtoFile(dataString, fileName), fileName);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		// 克隆其他项目的公式法底稿
		$('#cashFlow_clone').click(function() {
			$('#selCloneCustomerId').val('');
			$('#selCloneProjectId').val('');
			$('#set_clone_auditStartDate').val('');
			$('#set_clone_auditEndDate').val('');
			// 客户下拉框初始化
			initSelectableCustomers();
			$('#cloneProjectModal').modal('show');
		});
		// 确定克隆其他项目的公式法底稿
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
			if(cloneCustomerId == window.CUR_CUSTOMERID && cloneProjectId == window.CUR_PROJECTID){
				bdoInfoBox('提示', '当前项目不能克隆当前项目');
				return;
			}
			bdoInProcessingBox('克隆其他项目的公式法底稿中...');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgAuditFile.cloneOtherProjectCashFlowFile.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: cloneCustomerId,
					param4: cloneProjectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						$('#cloneProjectModal').modal('hide');
						bdoSuccessBox('成功', '克隆公式法底稿成功！');
					} else {
						bdoInfoBox('提示', data.resultInfo.statusText);
					}
				}
			});
		});
		// 客户选择
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
		// 项目选择
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
							showCloneProjectAuditInfo(selectedCustomerId, suggestion.data); // 显示审计期间
						}
					});
				}
			});
		}
		// 显示被克隆项目审计期间
		function showCloneProjectAuditInfo(customerId, projectId) {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00061',
					param1: projectId,
					param2: customerId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success && data.data && data.data.length) {
						let oData = data.data[0];
						$('#set_clone_auditStartDate').val(oData.auditTimeBegin);
						$('#set_clone_auditEndDate').val(oData.auditTimeEnd);
					} else {
						bdoErrorBox('提示', data.resultInfo.statusText);
					}
				}
			});
		}
		// 校验项
		$('#check_table_hidden').click(function() {
			$('#check_intwrap').toggle();
			$('.si', $(event.currentTarget)).toggleClass('si-arrow-down');
			$('.si', $(event.currentTarget)).toggleClass('si-arrow-up');
		});
		// 现金流量表补充资料--校验项
		$('#checkExtra_table_hidden').click(function() {
			$('#checkExtra_intwrap').toggle();
			$('.si', $(event.currentTarget)).toggleClass('si-arrow-down');
			$('.si', $(event.currentTarget)).toggleClass('si-arrow-up');
		});
		// 现金流量表项目--校验项
		$('#checkItem_table_hidden').click(function() {
			$('#checkItem_intwrap').toggle();
			$('.si', $(event.currentTarget)).toggleClass('si-arrow-down');
			$('.si', $(event.currentTarget)).toggleClass('si-arrow-up');
		});
		// 现金流量表补充资料--单元格双击事件
		$('#cashFlowExtraTable tbody').on('dblclick', 'td', function() {
			var index = $(this).index() + 1;
			var th = $('#cashFlowExtraTable').DataTable().context[0].aoColumns[index];
			var data = $('#cashFlowExtraTable').DataTable().row($(this).closest('tr')).data();
			var td = $(this).closest('td');
			if(td.attr('class').indexOf('bg-success-light') > -1){
				td.html('<span><input type="text" style="width:100%; align=right;"></span>');
				var input = $(this).find('input');
				if(th.name == 'columnDesc1'){
					var oldVal = data['columnDesc1'];
					if (oldVal != '') {
						input.val(oldVal);
					}
				}else if(th.name == 'column2'){
					var oldVal = data[th.name];
					if (oldVal != '') {
						input.val(oldVal);
					}
				}else if(th.name == 'column3'){
					var oldVal = data[th.name];
					if (oldVal != '') {
						input.val(oldVal);
					}
				}
				input.focus();
				input.on('keydown', function(e) {
					if (e.keyCode == 13) {
						input.blur();
					}
				});
				input.on('blur', function() {
					var value = this.value;
					if(value != oldVal){
						if (index != 3){
							value = value.toString().replace(/,/g, '').replace(/\t/g, '');
							if(isNaN(value)) {
								bdoInfoBox('提示', '单元格值不全是数字。', 1000);
								return;
							}
						}
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgAuditFile.updateCashFlowNote.json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: window.CUR_PROJECT_ACC_YEAR,
								param4: data.autoId,
								param5: value,
								param6: index
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									$('#cashFlowExtraTable').DataTable().ajax.reload();
									$('#checkExtraTable').DataTable().ajax.reload();
									bdoSuccessBox('成功', data.resultInfo.statusText);
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}else{
						$('#cashFlowExtraTable').DataTable().ajax.reload();
						$('#checkExtraTable').DataTable().ajax.reload();
						bdoInfoBox('提示', '单元格值未做修改。');
					}
				});
			}
		});
		// 现金流量表项目--单元格双击事件
		$('#cashFlowItemTable tbody').on('dblclick', 'td', function() {
			var index = $(this).index() + 1;
			var th = $('#cashFlowItemTable').DataTable().context[0].aoColumns[index];
			var data = $('#cashFlowItemTable').DataTable().row($(this).closest('tr')).data();
			var td = $(this).closest('td');
			if(td.attr('class').indexOf('bg-success-light') > -1){
				td.html('<span><input type="text" style="width:100%; align=right;"></span>');
				var input = $(this).find('input');
				if(th.name == 'columnDesc1'){
					var oldVal = data['columnDesc1'];
					if (oldVal != '') {
						input.val(oldVal);
					}
				}else if(th.name == 'column2'){
					var oldVal = data[th.name];
					if (oldVal != '') {
						input.val(oldVal);
					}
				}else if(th.name == 'column3'){
					var oldVal = data[th.name];
					if (oldVal != '') {
						input.val(oldVal);
					}
				}
				input.focus();
				input.on('keydown', function(e) {
					if (e.keyCode == 13) {
						input.blur();
					}
				});
				input.on('blur', function() {
					var value = this.value;
					if(value != oldVal){
						if (index != 3){
							value = value.toString().replace(/,/g, '').replace(/\t/g, '');
							if(isNaN(value)) {
								bdoInfoBox('提示', '单元格值不全是数字。', 1000);
								return;
							}
						}
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgAuditFile.updateCashFlowNote.json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: window.CUR_PROJECT_ACC_YEAR,
								param4: data.autoId,
								param5: value,
								param6: index
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									$('#cashFlowItemTable').DataTable().ajax.reload();
									$('#checkItemTable').DataTable().ajax.reload();
									bdoSuccessBox('成功', data.resultInfo.statusText);
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}else{
						$('#cashFlowItemTable').DataTable().ajax.reload();
						$('#checkItemTable').DataTable().ajax.reload();
						bdoInfoBox('提示', '单元格值未做修改。');
					}
				});
			}
		});
		// 现金流量表补充资料--打开附注
		$('#cashFlowExtra_openNoteFile').click(function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00414',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: 1,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data.length == 0){
							bdoInfoBox('提示', '对应附注未生成。');
							return;
						}
						var nodeData = {
							extraOptions: data.data[0],
							currentNode: {
								extraOptions: data.data[0]
							}
						};
						nodeData.autoId = nodeData.extraOptions.autoId;
						nodeData.menuId = window.sys_menuId;
						$.sessionStorage('noteInfoNode', JSON.stringify(nodeData));
						window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		// 现金流量表补充资料--刷新
		$('#cashFlowExtra_refresh').click(function() {
			$('#cashFlowExtraTable').DataTable().ajax.reload();
			$('#checkExtraTable').DataTable().ajax.reload();
		});
		// 现金流量表补充资料--初始化
		$('#cashFlowExtra_reset').click(function() {
			bdoConfirmBox('提示', '是否重新获取现金流量表补充资料附注值？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.generateCashFlowNoteData.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR,
						param4: vocationId,
						param5: "1"
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#cashFlowExtraTable').DataTable().ajax.reload();
							$('#checkExtraTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		// 现金流量表补充资料--新增行
		$('#cashFlowExtra_insert').click(function() {
			$('#note_type_input').val(1);
			$('#insertRowsModal').modal('show');
		});
		// 现金流量表项目--打开附注
		$('#cashFlowItem_openNoteFile').click(function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00414',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: 2,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data.length == 0){
							bdoInfoBox('提示', '对应附注未生成。');
							return;
						}
						var nodeData = {
							extraOptions: data.data[0],
							currentNode: {
								extraOptions: data.data[0]
							}
						};
						nodeData.autoId = nodeData.extraOptions.autoId;
						nodeData.menuId = window.sys_menuId;
						$.sessionStorage('noteInfoNode', JSON.stringify(nodeData));
						window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		// 现金流量表项目--刷新
		$('#cashFlowItem_refresh').click(function() {
			$('#cashFlowItemTable').DataTable().ajax.reload();
			$('#checkItemTable').DataTable().ajax.reload();
		});
		// 现金流量表项目--初始化
		$('#cashFlowItem_reset').click(function() {
			bdoConfirmBox('提示', '是否重新获取现金流量表项目附注值？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.generateCashFlowNoteData.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR,
						param4: vocationId,
						param5: "2"
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#cashFlowItemTable').DataTable().ajax.reload();
							$('#checkItemTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		// 现金流量表项目--新增行
		$('#cashFlowItem_insert').click(function() {
			$('#note_type_input').val(2);
			$('#insertRowsModal').modal('show');
		});
		// 现金流量表附注--新增行
		$('#insertRows_sure').click(function() {
			bdoConfirmBox('提示', '确定是否新增行？', function() {
				if($('#startRow_insert').val() == '' || $('#rowNum_insert').val() == ''){
					bdoInfoBox('提示', '未填写起始行或行数。');
					return;
				}
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.insertCashFlowNoteRow.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR,
						param4: $('#startRow_insert').val(),
						param5: $('#rowNum_insert').val(),
						param6: $('#note_type_input').val(),
						param7: vocationId
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#insertRowsModal').modal('hide');
							if($('#note_type_input').val() == 1){
								$('#cashFlowExtraTable').DataTable().ajax.reload();
								$('#checkExtraTable').DataTable().ajax.reload();
							}
							if($('#note_type_input').val() == 2){
								$('#cashFlowItemTable').DataTable().ajax.reload();
								$('#checkItemTable').DataTable().ajax.reload();
							}
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		// 现金流量表附注--现金流量表补充资料
		$('#cashFlowExtraTable').on('click', 'button[name="deleteFileRow"]', function() {
			var object = $('#cashFlowExtraTable').DataTable().data()[$(this).closest('tr').index()];
			var autoId = object.autoId;
			bdoConfirmBox('提示', '确定是否删除行？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.deleteCashFlowNoteRow.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR,
						param4: autoId,
						param5: 1,
						param6: vocationId
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#cashFlowExtraTable').DataTable().ajax.reload();
							$('#checkExtraTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		// 现金流量表附注--现金流量表项目
		$('#cashFlowItemTable').on('click', 'button[name="deleteFileRow"]', function() {
			var object = $('#cashFlowItemTable').DataTable().data()[$(this).closest('tr').index()];
			var autoId = object.autoId;
			bdoConfirmBox('提示', '确定是否删除行？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgAuditFile.deleteCashFlowNoteRow.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECT_ACC_YEAR,
						param4: autoId,
						param5: 2,
						param6: vocationId
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#cashFlowItemTable').DataTable().ajax.reload();
							$('#checkItemTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
	}

	/**
	 * 初始化页面
	 */
	function init() {
		let node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
		$('#remarkIndex').text('【' + node.extraOptions.indexId + '】');
		(function(){
			// P005-CF001
			fileIndexId = 'P005-CF001';
			// 2017130153
			subjectTreeId = node.extraOptions.autoId;
			// P005-CF001-现金流量表.xlsx
			var fileName = fileIndexId + '-现金流量表.xlsx';
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00227',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: fileIndexId,
					param4: fileName,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							filePaperId = data.data[0].autoId;
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00394',
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: window.CUR_PROJECT_ACC_YEAR,
									param4: vocationId,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										if (data.data[0] != null) {
											if(data.data[0].generateMethod == 0){
												method_radio_value = 'option1';
												$('input[name="method_radioOptions"][value="option1"]').prop('checked',true);
												cashFlowTableCfg.localParam.urlparam.sqlId = 'DG00394';
											}else if(data.data[0].generateMethod == 1){
												method_radio_value = 'option2';
												cashFlowTableCfg.localParam.urlparam.sqlId = 'DG00395';
												$('input[name="method_radioOptions"][value="option2"]').prop('checked',true);
												$('#cashFlowExtraTabId').css('display', 'block');
												$('#cashFlowItemTabId').css('display', 'block');
											}else{
												bdoInfoBox('提示', '该项目未选择现金流量表的编制方式。', 2000);
											}
											BdoDataTable('cashFlowTable', cashFlowTableCfg);
											setCashFlowType(data.data[0].generateMethod);
											// 校验项
											checkTableCfg.localParam.urlparam.param5 = method_radio_value;
											BdoDataTable('checkTable', checkTableCfg);
											// 现金流量表补充资料--校验项
											checkExtraTableCfg.localParam.urlparam.param5 = method_radio_value;
											BdoDataTable('checkExtraTable', checkExtraTableCfg);
											// 现金流量表项目--校验项
											checkItemTableCfg.localParam.urlparam.param5 = method_radio_value;
											BdoDataTable('checkItemTable', checkItemTableCfg);
											eventBind();
										}
									}
								}
							});
						}else{
							bdoInProcessingBox('加载中...');
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgAuditFile.auditReportFile.json',
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: fileIndexId,
									param4: fileName,
									param5: subjectTreeId,
									param6: 4,
									param7: method_radio_value
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										filePaperId = data.data[0].data[0].workpaperId;
										bdoInfoBox('提示', '该项目未选择现金流量表的编制方式。', 2000);
										cashFlowTableCfg.localParam.urlparam.sqlId = 'DG00394';
										BdoDataTable('cashFlowTable', cashFlowTableCfg);
										// 校验项
										checkTableCfg.localParam.urlparam.param5 = method_radio_value;
										BdoDataTable('checkTable', checkTableCfg);
										// 现金流量表补充资料--校验项
										checkExtraTableCfg.localParam.urlparam.param5 = method_radio_value;
										BdoDataTable('checkExtraTable', checkExtraTableCfg);
										// 现金流量表项目--校验项
										checkItemTableCfg.localParam.urlparam.param5 = method_radio_value;
										BdoDataTable('checkItemTable', checkItemTableCfg);
										eventBind();
										bdoSuccessBox('加载完成');
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}
					}
				}
			});
		})();
		BdoDataTable('cashFlowExtraTable', cashFlowExtraTableCfg);
		BdoDataTable('cashFlowItemTable', cashFlowItemTableCfg);
		BdoDataTable('compareTable', compareTableCfg);
		cashFlowUploadForm = createForm(cashFlowUploadFileComponet);
		OneUI.initHelper('slimscroll');
	}

	return {
		init
	};
}

$(function() {
	new DgCashFlowPage($('#dgCashFlowPage')).init();
});
