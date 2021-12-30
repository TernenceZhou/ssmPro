AnalysisReview = (agrs) => {
	var _template
		, mount
		, listener
		, tabPage;
	_template = agrs.template || tplLoader('dgCenter/html/dg/analysisReview.html');
	agrs.template = _template;
	let projectYear = agrs.data.projectYear;
	let unusual_year;
	let chartParam;
	var analysisType = '1';
	var dateArr;
	var chartTableId;
	let unusualData = [];
	let rpt_view = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/FUnAuditReport.analysisReview.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				menuId: window.sys_menuId,
				start: -1
			}
		},
		tableParam: {
			scrollY: false,
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			rowReorder: {
				update: false
			},
			columnDefs: []
		}
	};
	//创建资产负债表列
	let createColumnZC = (i) => {
		let tbColumns = {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			createdRow(row, data, dataIndex) {
				if (data.colDisp.indexOf('合计') < 0 || data.colDisp.indexOf('总计') < 0) {
					$(row).addClass('edit-able');
					$(row).find('td:eq(6)').addClass('bg-gray-lighter');
					$(row).find('td:eq(9)').addClass('bg-success-light');
				}
			},
			columnDefs: [
				{
					targets: 0,
					orderable: false,
					className: 'text-center',
					title: '序号',
					width: '30px',
					visible: true,
					render: function (data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				},
				{
					targets: 1,
					orderable: false,
					className: 'text-left',
					title: '科目编号',
					name: 'colCode',
					data: 'colCode',
					width: '30px',
					render: function (data, type, row, meta) {
						return data.replace(' ', '&nbsp;&nbsp;');
					}
				},
				{
					targets: 2,
					orderable: false,
					className: 'text-left',
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					width: '150px',
					render: function (data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g, '&nbsp;');
						}
					}
				}
			]
		};
		tbColumns.columnDefs.push({
			targets: 3,
			orderable: false,
			className: 'text-right',
			title: '期末数',
			name: 'adjustedAmount' + i,
			data: 'adjustedAmount' + i,
			width: '60px',
			render: function (data, type, row, meta) {
				return formatMoney(data);
			}
		});
		tbColumns.columnDefs.push({
			targets: 4,
			orderable: false,
			className: 'text-right',
			title: '期初数',
			name: 'adjustedRemain' + i,
			data: 'adjustedRemain' + i,
			width: '60px',
			render: function (data, type, row, meta) {
				return formatMoney(data);
			}
		});
		tbColumns.columnDefs.push({
			targets: 5,
			orderable: false,
			className: 'text-right',
			title: '变动比例',
			name: 'proportion',
			data: 'proportion',
			width: '60px',
			render: function (data, type, row, meta) {
				if (row.changeThreshold < Math.abs(row.proportion)) {
					return '<span style="color: red">' + data + '%</span>';
				} else {
					return data + '%';
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: 6,
			orderable: false,
			className: 'text-right',
			title: '变动金额',
			name: 'subtract',
			data: 'subtract',
			width: '60px',
			render: function (data, type, row, meta) {
				return formatMoney(data);
			}
		});

		tbColumns.columnDefs.push({
			targets: 7,
			orderable: false,
			className: 'text-right',
			title: '占资产总额比重',
			name: 'assVal',
			data: 'assVal',
			width: '60px',
			render: function (data, type, row, meta) {
				if (row.assetsValue < Math.abs(row.assVal)) {
					//丢失精度问题
					return '<span style="color:red;">' + data + '%</span>';
				} else {
					return data + '%';
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: 8,
			orderable: false,
			className: 'text-center',
			title: '是否需要分析变动原因',
			name: 'subtract',
			data: 'subtract',
			width: '60px',
			render: function (data, type, row, meta) {
				//大于配置的资产阀值和配置的变动幅度阀值
				if (row.assetsValue < Math.abs(row.assVal) && row.changeThreshold < Math.abs(row.proportion)) {
					return '<span style="color: red">是</span>';
				} else {
					return '否';
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: 9,
			orderable: false,
			className: 'text-left',
			title: '变动原因',
			name: 'changeReason',
			data: 'changeReason',
			width: '300px'
			/*            render: function (data, type, row, meta) {
							return '';
						}*/
		});
		return tbColumns;
	};
	//创建利润表列
	let createColumnLR = (i) => {
		let tbColumns = {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			createdRow(row, data, dataIndex) {
				if (data.colDisp.indexOf('合计') < 0 || data.colDisp.indexOf('总计') < 0) {
					$(row).addClass('edit-able');
					$(row).find('td:eq(6)').addClass('bg-gray-lighter');
					$(row).find('td:eq(9)').addClass('bg-success-light');
				}
			},
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '序号',
					width: '30px',
					visible: true,
					render: function (data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				},
				{
					targets: 2,
					orderable: false,
					className: 'text-left',
					title: '科目编号',
					name: 'colCode',
					data: 'colCode',
					width: '30px',
					render: function (data, type, row, meta) {
						return data.replace(' ', '&nbsp;&nbsp;');
					}
				},
				{
					targets: 3,
					orderable: false,
					className: 'text-left',
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					width: '150px',
					render: function (data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g, '&nbsp;');
						}
					}
				}
			]
		};
		tbColumns.columnDefs.push({
			targets: 4,
			orderable: false,
			className: 'text-right',
			title: '本年数',
			name: 'adjustedAmount' + i,
			data: 'adjustedAmount' + i,
			width: '60px',
			render: function (data, type, row, meta) {
				return formatMoney(data);
			}
		});
		tbColumns.columnDefs.push({
			targets: 5,
			orderable: false,
			className: 'text-right',
			title: '上年数',
			name: 'adjustedRemain' + i,
			data: 'adjustedRemain' + i,
			width: '60px',
			render: function (data, type, row, meta) {
				return formatMoney(data);
			}
		});
		tbColumns.columnDefs.push({
			targets: 6,
			orderable: false,
			className: 'text-right',
			title: '变动比例',
			name: 'proportion',
			data: 'proportion',
			width: '60px',
			render: function (data, type, row, meta) {
				if (row.changeThreshold < Math.abs(row.proportion)) {
					return '<span style="color: red">' + data + '%</span>';
				} else {
					return data + '%';
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: 7,
			orderable: false,
			className: 'text-right',
			title: '变动金额',
			name: 'subtract',
			data: 'subtract',
			width: '60px',
			render: function (data, type, row, meta) {
				return formatMoney(data);
			}
		});

		tbColumns.columnDefs.push({
			targets: 8,
			orderable: false,
			className: 'text-right',
			title: '占利润总额比重',
			name: 'profVal',
			data: 'profVal',
			width: '60px',
			render: function (data, type, row, meta) {
				if (row.profitsValue < Math.abs(row.profVal)) {
					//丢失精度问题
					return '<span style="color:red;"> ' + data + '%</span>';
				} else {
					return data + '%';
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: 9,
			orderable: false,
			className: 'text-center',
			title: '是否需要分析变动原因',
			name: 'subtract',
			data: 'subtract',
			width: '60px',
			render: function (data, type, row, meta) {
				if (row.profitsValue < Math.abs(row.profVal) && row.changeThreshold < Math.abs(row.proportion)) {
					return '<span style="color: red">是</span>';
				} else {
					return '否';
				}

			}
		});
		tbColumns.columnDefs.push({
			targets: 10,
			orderable: false,
			className: 'text-left',
			title: '变动原因',
			name: 'changeReason',
			data: 'changeReason',
			width: '300px'
			/*         render: function (data, type, row, meta) {
						 return '';
					 }*/
		});
		return tbColumns;
	};
	let initFunc = () => $.ajax({
		url: 'dgCenter/FUnAuditReport.analysisReview.json',
		type: 'post',
		data: {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			start: -1,
			'menuId': window.sys_menuId
		},
		dataType: 'json',
		success: function (data) {
			if (data.success) {
				let result = data.data[0];
				// 资产负债表 为 年初年末
				let zc = $.extend(true, {}, rpt_view);
				zc.tableParam = createColumnZC(projectYear);
				//其他表 为 上年数 本年数
				let lr = $.extend(true, {}, rpt_view);
				lr.tableParam = createColumnLR(projectYear);
				zc.localParam.data = result.zc;
				lr.localParam.data = result.lr;
				BdoDataTable('zc_report_table', zc);
				BdoDataTable('lr_report_table', lr);
				return;
			}
			bdoInfoBox('提示', data.resultInfo.statusText);
		}
	});

	/** --------------异常指标统计---------------- */
	let unusualFirst = () => {
		ComboDicOptionNew($('#unusual_industry_period'), ComboLocalDicOption(false, 'WindPeriod'));
		var myDate = new Date();
		var year = myDate.getFullYear();//年
		//$('#unusual_year').val(year - 1);
		unusual_year = window.CUR_PROJECT_ACC_YEAR;
		$('#unusual_industry').treecombo({
			url: 'cpBase/TreeCommon.findIndustry2Tree.json',
			params: {},
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: true,
				multiSelect: false
			}
		});
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.findIndustry.json',
			bdolxLoader: false,
			data: {
				lockCustomerId: window.CUR_CUSTOMERID,
				lockProjectId: window.CUR_PROJECTID,
				lockYyyy: window.CUR_PROJECT_ACC_YEAR,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			},
			dataType: 'json',
			success: function (result) {

				if (result.success) {
					var aa = result.data[0].aa;
					var aacode = result.data[0].aacode;
					$('#unusual_industry').treecombo('setTreeComboValue', [aacode, aa]);
					$('#project_industry').html('未审报表中的行业指标为上年行业数据，审定报表中的行业指标为本年行业数据。&nbsp;&nbsp;行业：' + aa);
				}
			}
		});
	};

	mount = () => {
		$(agrs.region).empty().append(_template);
		initFunc();
		$('#reviewIndex').text('【' + agrs.type + '】');//初步分析性复核添加索引号
		// AuditProgramPagePlan({region: '#subjectPlanPageTab', data: agrs.data});
		//EditProgramPage({region: '#editProgramPageTab', data: agrs.data});
		OneUI.initHelper('slimscroll');
		unusualFirst();
	};

	mount();

	$('#rpt_search').click(function () {
		initFunc();
	});

	$('#ar_config').click(function () {
		$('#ar_config_modal').modal('show');
		$.ajax({
			url: 'dgCenter/DgProject.queryAnalysisReviewConfig.json',
			type: 'post',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: agrs.data.customerId
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					let result = data.data[0];
					$('#assetsValue').val(result.assetsValue);
					$('#profitsValue').val(result.profitsValue);
					$('#changeThreshold').val(result.changeThreshold);
					$('#assets').val(result.assets);
					$('#profits').val(result.profits);
					// reprot.param3 = {};
					// bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					console.log('获取初步分析性复核配置信息失败');
					// reprot.param3 = {};
					// bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		$('#customerId').val(agrs.data.customerId);
		$('#projectId').val(agrs.data.projectId);
	});


	//初步分析性复核 表单配置
	$('#ar_config_form').formview({
		display: 'tableform-one',
		column: 4,
		buttons: [
			{
				id: 'comtemplate_save',
				icon: 'fa-save',
				style: 'btn-primary',
				text: '&nbsp;保存'
			}, {
				id: 'comtemplate_close',
				icon: 'fa-sign-out',
				style: 'btn-warning',
				text: '&nbsp;关闭'
			}
		],
		items: [
			{
				id: 'customerId',
				type: 'input',
				typeAttr: {
					type: 'hidden'
				}
			},
			{
				id: 'projectId',
				type: 'input',
				typeAttr: {
					type: 'hidden'
				}
			},
			{
				id: 'assetsValue',
				// type: 'input',
				label: '占资产总额阈值（默认5%）',
				html: '<div class="form-material ">' +
					'<input class="form-control" type="number" id="assetsValue" data-toggle="tooltip" data-placement="top" title="" />' +
					'<label for="assetsValue">占资产总额阈值（默认5%）</label>' +
					'</div>',
				// html : template_type,
				rowspan: 1
			},
			{
				id: 'changeThreshold',
				// type: 'input',
				label: '变动幅度阈值（默认30%）',
				html: '<div class="form-material ">' +
					'<input class="form-control" type="number" id="changeThreshold" data-toggle="tooltip" data-placement="top" title="" />' +
					'<label for="changeThreshold">变动幅度阈值（默认30%）</label>' +
					'</div>',
				rowspan: 1
			},
			{
				id: 'profitsValue',
				// type: 'input',
				label: '占利润总额阈值（默认10%）',
				html: '<div class="form-material ">' +
					'<input class="form-control" type="number" id="profitsValue" data-toggle="tooltip" data-placement="top" title="" />' +
					'<label for="profitsValue">占利润总额阈值（默认10%）</label>' +
					'</div>',
				rowspan: 1
			},
			{
				id: 'assets',
				type: 'input',
				label: '资产总计科目编号（默认A）',
				rowspan: 1
			},
			{
				id: 'profits',
				type: 'input',
				label: '利润总额科目编号（默认S06）',
				// html: '',
				rowspan: 1
			},
			{
				id: 'methodTips',
				//type: 'input',
				label: '判断方式',
				html: '<div class="form-material"><label style="color: red">占资产总额比重、占利润总额比重、变动比例>相应阈值时，需填写变动原因</label></div>',
				rowspan: 1
			}
		]
	});
	//变动原因配置
	var reprot = {
		'param2': '',
		'param1': '',
		'param3': {}
	};
	$('#zc_report_table,#lr_report_table').on('dblclick', 'td', function () {
		if ($(this).closest('td').index() != 9) {
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
		input.on('keydown', function (e) {
			if (e.keyCode == 13) {
				input.blur();
			}
		});
		input.on('blur', function () {
			let $table = $(this).closest('table');
			let data = $table.DataTable().row($(this).closest('tr')).data();
			let value = $(this).val();
			var td = $(this).closest('td');
			// reprot.param1 = customerId;
			// reprot.param2 = projectId;
			data['changeReason'] = value;
			reprot.param3[data.colCode] = value;
			//失去焦点直接保存
			// $(this).parent().html("<span style='color:green;'>" + value + "</span>")
			$.ajax({
				url: 'dgCenter/FUnAuditReport.saveChangeReason.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: agrs.data.customerId,
					param2: 1,
					param3: encodeURIComponent(JSON.stringify(reprot.param3))
				},
				dataType: 'json',
				success: function (data) {
					//initFunc();
					// $('#tbsubject_table').DataTable().ajax.reload();
					// isSort = false;
					if (data.success) {
						calculateAnalysisReview();
						//提交成功后清空
						reprot.param3 = {};
						td.html(value);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						reprot.param3 = {};
						td.html(oldVal);
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});

		});

	});

	//关闭配置框
	$('#comtemplate_close').click(function () {
		$('#ar_config_modal').modal('hide');
		//清空表单
		document.getElementById('ar_config_form').reset();
	});

	//保存配置项参数
	$('#comtemplate_save').click(function () {
		if ($('#assetsValue').val() > 1 || $('#assetsValue').val() < 0) {
			bdoInfoBox('提示', "阈值范围请设置0-1之间");
			return;
		}
		if ($('#profitsValue').val() > 1 || $('#profitsValue').val() < 0) {
			bdoInfoBox('提示', "阈值范围请设置0-1之间");
			return;
		}
		if ($('#changeThreshold').val() > 1 || $('#changeThreshold').val() < 0) {
			bdoInfoBox('提示', "阈值范围请设置0-1之间");
			return;
		}
		$.ajax({
			url: 'dgCenter/FUnAuditReport.checkUnAuditReportCode.json',
			type: 'post',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: $('#assets').val(),
				param2: $('#profits').val(),
				param3: window.CUR_CUSTOMERID
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					$('#ar_config_form').formview('setAjaxConf',
						[
							'dgCenter/DgProject.savaAnalysisReviewConfig.json',
							{
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: JSON.stringify({
									assetsValue: $('#assetsValue').val(),
									profitsValue: $('#profitsValue').val(),
									changeThreshold: $('#changeThreshold').val(),
									assets: $('#assets').val(),
									profits: $('#profits').val()
								}),
								param2: agrs.data.customerId,
								param3: 1
							},
							'json', true,
							function (data) {
								if (data.success) {
									initFunc();
									bdoSuccessBox('成功', data.resultInfo.statusText);
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
								$('#ar_config_modal').modal('hide');
							}
						]);
					$('#ar_config_form').submit();
				} else {
					reprot.param3 = {};
					bdoInfoBox('提示', data.resultInfo.statusText);
				}
			}
		});
	});

	/**
	 * 双击科目跳转到明细账
	 */
	$('#zc_report_table,#lr_report_table').on('dblclick', 'td', function () {
		if ($(this).closest('td').index() != 1) {
			return;
		}
		$.ajax({
			url: 'dgCenter/FUnAuditReport.findUserSubjectIdByColCode.json',
			type: 'post',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: agrs.data.customerId,
				param2: $(this).text()
			},
			dataType: 'json',
			success: function (data) {
				//console.log(data);
				let userSubjectCode = '';
				if (data.success && data.data) {
					userSubjectCode = '&userSubjectCode=' + data.data[0].userSubjectId;
				}
				let url = '/Faith/bdologin.do?m=gotoDesktop&menuId=40000006'
					+ '&customerId=' + agrs.data.customerId
					+ '&endYear=' + agrs.data.projectYear
					+ '&startYear=' + (agrs.data.projectYear - 1) + userSubjectCode;
				window.open(url);
			}
		});

	});

	//核对完成
	$('#rpt_check_analysisReview').on('click', function () {
		$('#rpt_check_analysisReview').blur();
		var myDate = new Date();
		var year = window.CUR_PROJECT_ACC_YEAR;//年
		var periodStandard = '2';
		var lastyear = (year - 1) + '-12-31';
		var currentyear = '';
		var industryyear = year + '-12-31';
		//如果包含period 发送param3为1
		if ($('#unusual_industry_period').val() == '1') {
			periodStandard = '2';
			currentyear = year + '-12-31';
		} else if ($('#unusual_industry_period').val() == '2') {
			periodStandard = '1';
			currentyear = year + '-03-31';
		} else if ($('#unusual_industry_period').val() == '3') {
			periodStandard = '1';
			currentyear = year + '-06-31';
		} else if ($('#unusual_industry_period').val() == '4') {
			periodStandard = '1';
			currentyear = year + '-09-31';
		}
		bdoAjaxBox('系统提示', '确定完成核对吗？', function () {
			$.ajax({
				url: 'dgCenter/FUnAuditReport.calculateAnalysisReview.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param20: '1',
					param21: periodStandard,
					param22: $('#unusual_industry').attr('data-result'),
					param23: lastyear,
					param24: currentyear,
					param25: lastyear
				},
				dataType: 'json',
				success: function (data) {
					if (data.success) {
						bdoSuccessBox('操作成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('操作失败', data.resultInfo.statusText);
						checkRequired();
					}
				}
			});
		});

	});
	var checkRequired = function(){
		var zc_len = $('#zc_report_table').DataTable().data().length;
		for(var i=0;i<zc_len;i++){
			var row = $('#zc_report_table').DataTable().data()[i];
			if (row.assetsValue < Math.abs(row.assVal) && row.changeThreshold < Math.abs(row.proportion)) {
				if(row.changeReason == null || row.changeReason == ''){
					$('#report_type').find('li').first().find('a').click();
					return false;
				}
			}
		}
		var lr_len = $('#lr_report_table').DataTable().data().length;
		for(var i=0;i<lr_len;i++){
			var row = $('#lr_report_table').DataTable().data()[i];
			if (row.profitsValue < Math.abs(row.profVal) && row.changeThreshold < Math.abs(row.proportion)) {
				if(row.changeReason == null || row.changeReason == ''){
					$('#report_type').find('li').first().next().find('a').click();
					return false;
				}
			}
		}
		for (var i = 0; i < unusualData.length; i++) {
			var tmpChartData = unusualData[i];
			var analysisReason = $('#analysisReason' + tmpChartData.autoId).val();
			if(tmpChartData.isError == '1' && (analysisReason == null || analysisReason == '')){
				$('#report_type').find('li').last().find('a').click();
				$('#unusual' + tmpChartData.autoId)[0].scrollIntoView({ behavior: "smooth" });
				$('#analysisReason' + tmpChartData.autoId).focus();
				return false;
			}
		}
	}

	/** --------------异常指标统计---------------- */

	let page = new Page({
		container: '#analysisReview',
		events: {
			//'#refreshAttachTableBtn': 'click,onRrefreshAttachTable',
			'#upload': 'click,onUpload',
			//'#attachTable tbody td.edit-indexid': 'dbclick,onIndexColDbclick'
			'#unusual_search': 'click,unusual_search'
		},
		/**
		 * 初始化
		 */
		init(options) {
			// 上传文件
			this.uploadWorkpagerPage = createForm(this.uploadWorkpagerPageCfg);
			//BdoDataTable('attachTable', this.attachTableCfg);
			//this.listener();
			//this.unusual_search();
		}
		, uploadWorkpagerPageCfg: {
			options: {
				propsData: {
					jsonData: {
						workpager: [],
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						subjectTreeId: agrs.data.autoId,
						autoId: null
					}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 1,
			id: 'uploadFileForm',
			data() {
				return {
					ajaxConfig: {
						type: 'POST',
						url: 'dgCenter/DgMain.updateProjDgFile.json',
						dataType: 'json',
						success(data) {
							if (data.success) {
								calculateAnalysisReview();
								bdoSuccessBox('成功', data.resultInfo.statusText);
								$('#uploadTplFormModal').modal('hide');
								queryAnalysisReason();
								//$('#attachTable').DataTable().ajax.reload();
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
					this.uploadFile(true, { param1: agrs.data.type, param11: analysisType, param12: uploadChartId });
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
		, onUpload(event) {
			event.preventDefault();
			page.uploadWorkpagerPage.jsonData.autoId = null;
			page.uploadMode = 'STD';
			$('#uploadTplFormModal').modal('show');
		}
		,
		//搜索行业均值/** 搜索按钮 */
		unusual_search() {

			var result = $('#unusual_industry').attr('data-result');
			if (result == null || result == '') {
				bdoErrorBox('错误', '请选择行业');
				return;
			}
			if (result === 'classStandard') {
				bdoErrorBox('错误', '请选择具体行业');
				return;
			}
			var palte = $('#stockPalteSelect').val();
			if (result.indexOf('GB') > 0 && palte <= 2) {
				bdoErrorBox('错误', '抱歉,立信行业分类不支持万得板块数据!');
				return;
			}
			if (result.indexOf('GB') < 0 && palte > 2) {
				bdoErrorBox('错误', '抱歉,非立信行业不支持立信板块数据!');
				return;
			}
			if (result.length > 10 && palte != 1) {
				bdoErrorBox('错误', '抱歉,万得行业分类暂时仅支持万得A股板块数据!');
				return;
			}
			var year = unusual_year;
			if (year === null || year === '') {
				bdoErrorBox('错误', '年份不能为空!');
				return;
			}
			$('#projectId').val(window.CUR_PROJECTID);
			$('#unusual_slpk').val(window.CUR_CUSTOMERID);
			this.createTabUnusual("unusual_chartsProfitForPeriod");

		}
		, findCompnays(selectDoc, inputDoc) {
			//选中的option
			var selectOptions = selectDoc.children('option:selected');
			var companys = selectDoc.val();
			selectDoc.html('');
			var regex = inputDoc;
			ComboSearch(selectOptions, companys, 'cpBase/combo.findCompanys.json', selectDoc, false, { 'param1': regex }, false);
		}
		, createTabUnusual(tableId) {
			chartTableId = tableId;
			//立信数据不支持按季度
			/*if (tableId.indexOf('Period') > 0 && parseInt($('#unusual_slpk').val()) > 10000000) {
				return;
			}*/
			//var startdate = $('#unusual_startdate').val();
			//var enddate = $('#unusual_enddate').val();
			//var year = $('#unusual_year').val();
			var year = unusual_year;
			if ($('#unusual_slpk').val() === null || $('#unusual_slpk').val() === '') {
				bdoErrorBox('错误', '请选择公司');
				return;
			}
			/*if (startdate === null || startdate === '') {
				bdoErrorBox('错误', '开始时间不能为空!');
				return;
			}
			if (enddate === null || enddate === '') {
				bdoErrorBox('错误', '结束时间不能为空!');
				return;
			}
			if (startdate !== '' && enddate !== '' && startdate > enddate) {
				bdoErrorBox('错误', '开始年份不能大于结束年份!');
				return;
			}*/
			if (year === null || year === '') {
				bdoErrorBox('错误', '年份不能为空!');
				return;
			}
			var periodStandard = '2';
			var lastyear = (year - 1) + '-12-31';
			var currentyear = '';
			var industryyear = year + '-12-31';
			//如果包含period 发送param3为1
			if ($('#unusual_industry_period').val() == '1') {
				periodStandard = '2';
				dateArr = [(year - 3) + '-12-31', (year - 2) + '-12-31', (year - 1) + '-12-31'];
				currentyear = year + '-12-31';
			} else if ($('#unusual_industry_period').val() == '2') {
				periodStandard = '1';
				dateArr = [(year - 3) + '-12-31', (year - 2) + '-12-31', (year - 1) + '-03-31'];
				currentyear = year + '-03-31';
			} else if ($('#unusual_industry_period').val() == '3') {
				periodStandard = '1';
				dateArr = [(year - 3) + '-12-31', (year - 2) + '-12-31', (year - 1) + '-06-31'];
				currentyear = year + '-06-31';
			} else if ($('#unusual_industry_period').val() == '4') {
				periodStandard = '1';
				dateArr = [(year - 3) + '-12-31', (year - 2) + '-12-31', (year - 1) + '-09-31'];
				currentyear = year + '-09-31';
			}
			//生成table cloumn 以及param
			//var dateArr = ['2017-12-31','2018-12-31'];
			var proejectId = $('#projectId').val();
			//指标分析
			/*for (var i = 0; i < data.data.length; i++) {
				var map = data.data[i];
				$.each(map, function(key, value) {
					dateArr[i] = key;
				});
			}*/
			var paramStr = dateArr.join(',').toString();
			//dateArr.push('行业');
			if (proejectId != null && proejectId !== '') {
				dateArr.push('未审报表');
			}
			chartParam = {
				lockCustomerId: $('#unusual_slpk').val(),
				lockProjectId: proejectId,
				param2: paramStr,
				param4: periodStandard,
				param6: $('#unusual_industry').attr('data-result'),
				param7: lastyear,
				param8: currentyear,
				param9: lastyear,
				param10: '0',
				param12: analysisType
			};
			creatChart(chartParam, true);
		},

		//重置按钮
		unusual_clear() {

			//$('#unusual_startdate').datepicker('setDate', '2016-01-01');
			var date = new Date();
			var year = date.getFullYear();//年
			var month = date.getMonth() + 1;//月份
			var day = date.getDate();//日期
			var str = year + '-' + month + '-' + day;
			//$('#unusual_enddate').datepicker('setDate', str);
			$('#unusual_industry_period').selectpicker('val', '1');
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
	});

	var uploadChartId;
	let actionUnusual = (param, callback) => {
		$.ajax({
			url: 'dgCenter/DgMain.queryProjDgFileExist.json',
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
	let queryAnalysisReason = () => {
		$.ajax({
			url: 'finCenter/Analysis.queryAnalysisReason.json',
			type: 'post',
			data: {
				lockCustomerId: window.CUR_CUSTOMERID,
				lockProjectId: window.CUR_PROJECTID,
				lockYyyy: window.CUR_PROJECT_ACC_YEAR,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: analysisType,
				param4: uploadChartId
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					if (data.data.length > 0) {
						var tmpChartData = data.data[0];
						var chartId = 'unusual' + tmpChartData.autoId;
						$('#analysisReason').val(tmpChartData.analysisReason);
						let fileUl = '';
						for (var j = 0; j < tmpChartData.fileList.length; j++) {
							var tmpFileData = tmpChartData.fileList[j];
							fileUl = fileUl
								+ '         <li class="list-group-item">'
								+ '             <span class="icon fa fa-file-excel-o text-primary-light"></span>'
								+ '             ' + tmpFileData.fileName + ''
								+ '             <span class="fa fa-close text-danger pull-right" id="file' + tmpFileData.autoId + '" autoId="' + tmpFileData.autoId + '" fileName="' + tmpFileData.fileName + '" chartId="' + tmpChartData.autoId + '" :data-index="index" v-show="delBtnShow"></span>'
								+ '             <span class="fa fa-download text-danger pull-right" autoId="' + tmpFileData.autoId + '" :data-index="index" ></span>'
								+ '         </li>';
						}
						$('#analysisFile' + uploadChartId).html(fileUl);
					}
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	};

	let calculateAnalysisReview = () => {
		var myDate = new Date();
		var year = window.CUR_PROJECT_ACC_YEAR;//年
		var periodStandard = '2';
		var lastyear = (year - 1) + '-12-31';
		var currentyear = '';
		var industryyear = year + '-12-31';
		//如果包含period 发送param3为1
		if ($('#unusual_industry_period').val() == '1') {
			periodStandard = '2';
			currentyear = year + '-12-31';
		} else if ($('#unusual_industry_period').val() == '2') {
			periodStandard = '1';
			currentyear = year + '-03-31';
		} else if ($('#unusual_industry_period').val() == '3') {
			periodStandard = '1';
			currentyear = year + '-06-31';
		} else if ($('#unusual_industry_period').val() == '4') {
			periodStandard = '1';
			currentyear = year + '-09-31';
		}
		//bdoConfirmBox('保存', '确认保存？', function() {
		$.ajax({
			url: 'dgCenter/FUnAuditReport.calculateAnalysisReview.json',
			type: 'post',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param21: periodStandard,
				param22: $('#unusual_industry').attr('data-result'),
				param23: lastyear,
				param24: currentyear,
				param25: lastyear,
				param26: analysisType
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					//bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					//bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		//});
	};
	$('#unusual_chartsProfitForPeriod').on('click', '.fa-close', function (event) {
		var autoId = $(event.currentTarget).attr("autoId");
		var fileName = $(event.currentTarget).attr("fileName");
		var chartId = $(event.currentTarget).attr("chartId");
		bdoConfirmBox('提示', '确认删除文件【' + fileName + '】?', function () {
			$.ajax({
				url: 'dgCenter/DgMain.deleteProjDgFile.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: autoId,
					param2: window.CUR_CUSTOMERID,
					param11: analysisType,
					param12: chartId,
					param13: window.CUR_PROJECTID
				},
				dataType: 'json',
				success: function (data) {
					if (data.success) {
						calculateAnalysisReview();
						$('#file' + autoId).closest('li').remove();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	$('#unusual_chartsProfitForPeriod').on('click', '.onUploadFileUnusual', function (event) {
		//event.preventDefault();
		//page.uploadWorkpagerPage.jsonData.autoId = null;
		//page.uploadMode = 'STD';
		var chartId = $(event.currentTarget).attr("autoId");
		$('#uploadTplFormModal').modal('show');
		uploadChartId = chartId;
	});

	$('#unusual_isShowAll').on('change', function (event) {
		if ($(this).prop("checked")) {
			chartParam.param10 = '1';
		} else {
			chartParam.param10 = '0';
		}
		chartParam.param13 = '';
		creatChart(chartParam, true);
	});

	$('#unusual_chartsProfitForPeriod').on('click', '.onSaveParam', function (event) {
		var autoId = $(event.currentTarget).attr("autoId");
		bdoConfirmBox('保存', '确认保存？', function () {
			$.ajax({
				url: 'finCenter/Analysis.saveAnalysisParams.json',
				type: 'post',
				data: {
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: analysisType,
					param4: autoId,
					param5: $('#analysisParams' + autoId).val()
				},
				dataType: 'json',
				success: function (data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						chartParam.param13 = autoId;
						creatChart(chartParam, false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	$('#unusual_chartsProfitForPeriod').on('click', '.onSaveUnusual', function (event) {
		var autoId = $(event.currentTarget).attr("autoId");
		bdoConfirmBox('保存', '确认保存？', function () {
			$.ajax({
				url: 'finCenter/Analysis.saveAnalysisReason.json',
				type: 'post',
				data: {
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: analysisType,
					param4: autoId,
					param5: $('#analysisReason' + autoId).val()
				},
				dataType: 'json',
				success: function (data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						calculateAnalysisReview();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	$('#unusual_chartsProfitForPeriod').on('click', '.fa-download', function (event) {
		var autoId = $(event.currentTarget).attr("autoId");
		actionUnusual({
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: autoId,
			param2: window.CUR_CUSTOMERID
		}, (data) => {
			downloadFile('dgCenter/DgDownload.downloadProjDgFile.json', {
				param1: autoId,
				param2: window.CUR_CUSTOMERID
			});
		});
	});
	$('#unusual_tab').one('click', function () {
		page.unusual_search();
	});
	/** 导出 */
	$('#rpt_export').click(function () {
		$('#unusual_tab').click();
		exportUSToDgDo();
	});
	function exportUSToDgDo(param) {
		$.ajax({
			url: 'dgCenter/ExportOtherDg.exportAnalysis.json',
			data: chartParam,
			type: 'post',
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					if (data.data && data.data.length > 0) {
						let dataString = data.data[0].fileData;
						let fileName = data.data[0].fileName;
						let isNew = data.data[0].isNew;
						bdoInfoBox('成功', fileName + '导出成功！');
						saveAs(dataURLtoFile(dataString, fileName), fileName);
					}
					getSubjecttree({
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_PROJECTID,
						param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
					}, data => {
						$('.js-tree-collapsed').trigger('rebuild', [{
							data: [data.data[0].treeData],
							levels: 3,
							callback(tree) {
								$.each(tree.findNodes(), (index, tnode) => {
									if (tnode.extraOptions.nodeType == 'FAR') {
										tree.expandNode(tnode.nodeId, { levels: (tnode.deep + 2), silent: true });
										tree.selectNode(tnode.nodeId, { silent: true });
									}
								});
							}
						}]);
					});
				} else {
					bdoErrorBox('失败', data.resultInfo && data.resultInfo.statusText);
				}
			}
		});
	}
	function creatChart(chartParam, isRefresh) {
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.getErrorChartData.json',
			dataType: 'json',
			data: chartParam,
			success: function (data) {
				if (data.success) {
					//清除tableId
					var doc = $('#' + chartTableId);
					//doc.html('');
					if (isRefresh) {
						$('#unusual_chartsTabContent').find('.block-content.row').empty();
					}
					unusualData = data.data;
					//封装数据
					for (var i = 0; i < data.data.length; i++) {
						var legendData = [];
						var xAxisData = dateArr;
						var seriesData = [];
						var yAxisData = [];
						var selectedField = {};
						var tmpChartData = data.data[i];
						var tmpId = chartTableId + tmpChartData.autoId;
						var chartId = 'unusual' + tmpChartData.autoId;
						var filedownload = '';
						let fileUl = '<ul class="list-group" style="padding: 10px 5px;" id="analysisFile' + tmpChartData.autoId + '">';
						for (var j = 0; j < tmpChartData.fileList.length; j++) {
							var tmpFileData = tmpChartData.fileList[j];
							fileUl = fileUl
								+ '         <li class="list-group-item">'
								+ '             <span class="icon fa fa-file-excel-o text-primary-light"></span>'
								+ '             ' + tmpFileData.fileName + ''
								+ '             <span class="fa fa-close text-danger pull-right" id="file' + tmpFileData.autoId + '" autoId="' + tmpFileData.autoId + '" fileName="' + tmpFileData.fileName + '" chartId="' + tmpChartData.autoId + '" :data-index="index" v-show="delBtnShow"></span>'
								+ '             <span class="fa fa-download text-danger pull-right" autoId="' + tmpFileData.autoId + '" :data-index="index" ></span>'
								+ '         </li>';
						}
						fileUl += '</ul>';
						filedownload = '<ul class="list-group" style="padding: 10px 5px;">'
							/*+ '         <li class="list-group-item" id="analysisParamsLi' + tmpChartData.autoId + '">'
							+ '             <span class="icon fa text-primary-light">'
							+ '             <button class="onSaveParam" autoId="' + tmpChartData.autoId + '" type="button" style="border: 0px;background-color: #f9f9f9;color: #337ab7;">'
							+ '                 <i class="fa"> 保存</i>'
							+ '             </button>'
							+ '             自定义参数,多个请用逗号隔开</span>'
							+ '             <input class="form-control" autoId="' + tmpChartData.autoId + '" id="analysisParams' + tmpChartData.autoId + '" value="' + tmpChartData.analysisParams + '">'
							+ '         </li>'*/
							+ '         <li class="list-group-item" id="analysisReasonLi' + tmpChartData.autoId + '">'
							+ '             <span class="icon fa text-primary-light">'
							+ '             <button class="onSaveUnusual" autoId="' + tmpChartData.autoId + '" type="button" style="border: 0px;background-color: #f9f9f9;color: #337ab7;">'
							+ '                 <i class="fa"> 保存</i>'
							+ '             </button>'
							+ '             分析原因</span>'
							+ '             <textarea class="form-control" id="analysisReason' + tmpChartData.autoId + '">' + tmpChartData.analysisReason + '</textarea>'
							+ '         </li>'
							+ '         <li class="list-group-item">'
							+ '             <button class="onUploadFileUnusual" autoId="' + tmpChartData.autoId + '" type="button" style="border: 0px;background-color: #f9f9f9;color: #337ab7;">'
							+ '                 <i class="fa fa-upload"> 上传文件</i>'
							+ '             </button>'
							+ fileUl
							+ '         </li>';
						filedownload = filedownload + '</ul>';
						if ($('#div_' + tmpId).length > 0) {
							$('#div_' + tmpId).html('<div id="' + tmpId + '" style="width: ' + 500 + 'px;height: ' + 400 + 'px" class="col-sm-3 col-xs-3"></div><div id="' + chartId + '" style="display:inline-block width: ' + 300 + 'px;height: ' + 400 + 'px" class="col-sm-4 col-xs-4"><div title="' + tmpChartData.quotaRemark + '" class="si si-question ' + (tmpChartData.analysisParams > '' ? 'red-light' : '') + '">' + tmpChartData.unusualMessage + '</div> ' + filedownload + '</div>');
						} else {
							doc.append('<div id="div_' + tmpId + '"><div id="' + tmpId + '" style="width: ' + 500 + 'px;height: ' + 400 + 'px" class="col-sm-3 col-xs-3"></div><div id="' + chartId + '" style="display:inline-block width: ' + 300 + 'px;height: ' + 400 + 'px" class="col-sm-4 col-xs-4"><div title="' + tmpChartData.quotaRemark + '" class="si si-question ' + (tmpChartData.analysisParams > '' ? 'red-light' : '') + '">' + tmpChartData.unusualMessage + '</div> ' + filedownload + '</div></div>');
						}

						for (var j = 0; j < tmpChartData.dataList.length; j++) {
							var tmpInnerData = tmpChartData.dataList[j];

							var tmpData = [];
							let unit = 1;
							let unitName = '';
							if(tmpChartData.autoId=109){
								let lastnum = tmpInnerData.data[tmpInnerData.data.length - 1];
								if (lastnum >= 100000000) {
									unit = 100000000;
									unitName = '(亿)';
								} else if (lastnum >= 10000) {
									unit = 10000;
									unitName = '(万)';
								}
							}

							legendData.push(tmpInnerData.field + unitName);
							if (j <= 2) {
								selectedField[tmpInnerData.field] = true;
							} else {
								selectedField[tmpInnerData.field] = false;
							}
							yAxisData.push({
								type: 'value',
								show: false
							});

							for (var k = 0; k < tmpInnerData.data.length; k++) {
								let num = tmpInnerData.data[k]
								if (isNaN(num)) {
									tmpData.push(num);
								} else {
									tmpData.push((parseFloat(num)/unit).toFixed(2));
								}
							}
							var magicType = tmpInnerData.magicType;
							var tmpSeries = {
								name: tmpInnerData.field + unitName,
								type: magicType,
								stack: tmpInnerData.stock,
								data: tmpData,
								//yAxisIndex: j,
								label: {
									normal: {
										show: true,
										position: 'top'
									}
								},
								barMaxWidth: '80',
								barGap: '30%'
							};
							if ('line' === magicType || tmpInnerData.stock !== '') {
								//折线图不显示数据
								tmpSeries.label.normal.show = false;
							}
							if ('bar' === magicType) {
								//柱状图公用同Y轴
								//tmpSeries.yAxisIndex = 0;
							}
							seriesData.push(tmpSeries);
						}
						//第一个y轴显示
						yAxisData[0].show = true;
						var option = {
							title: {
								text: tmpChartData.chartName,
								textStyle: {
									color: tmpChartData.isError == '1' ? 'red' : 'green'
								}
							},
							grid: {
								top: '20%'
							},
							tooltip: {
								show: true,
								trigger: 'axis'
							},
							legend: {
								x: '50',
								data: legendData,
								selected: selectedField,
								y: '10%'
							},
							toolbox: {
								show: true,
								feature: {
									restore: { show: true }
								}
							},
							calculable: true,
							xAxis:
							{
								type: 'category',
								data: xAxisData,
								axisLabel: {
									interval: 0,//横轴信息全部显示
									rotate: -30//-30度角倾斜显示
								}
							},
							//yAxis: yAxisData,
							yAxis: {
								type: 'value'
							},
							series: seriesData
						};
						var tmpChart = echarts.init(document.getElementById(tmpId));
						// 使用刚指定的配置项和数据显示图表。
						tmpChart.setOption(option);
					}
				}
			}
		});
	}
};