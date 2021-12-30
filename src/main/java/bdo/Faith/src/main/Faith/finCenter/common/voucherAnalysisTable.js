var voucherAnalysisTab = function (tabId, param) {

	if ($('#' + tabId + ' li a[href="#tab_accountledger"]').length != 0) {
		$('#' + tabId + ' li a[href="#tab_accountledger"]').remove();
	}

	$('#' + tabId + '').append('<li><a href="#tab_accountledger">对应凭证分析列表&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_accountledger"></div>');

	$('#' + tabId + ' a[href="#tab_accountledger"]').find('.fa-times-circle').click(function () {
		$(this).parents('ul').find('li').first().find('a').click();
		$(this).parents('li').remove();
		$('#tab_accountledger').remove();
	});

	if ($('#removeId').length != 0) {

		$('#removeId').remove();
	}


	var accountledager = '<div class="content" id="removeId"><div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options"><li>'
		+ '<button id="accountledger_export" type="button"><i class="si si-cloud-download" style="color: white;">&nbsp;导出</i></button>'
		+ '</li></ul><h3 class="block-title">对应凭证分析列表一览<span>&nbsp;(' + (param.param4 == '1' ? '借' : '贷') + ' ' + param.param7
		+ ')</span></h3></div><div class="block-content"><div style="clear:both;"></div>'
		+ '<table id="table_accountledger" class="table table-bordered table-striped table-hover"></table>'
		+ '</div></div></div>';

	$('#tab_accountledger').append(accountledager);
	$('#' + tabId + ' a[href="#tab_accountledger"]').click();

	/** table 属性 */
	var accountledger_view_index = 1;
	var accountledger_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/CorrespondingVoucherAnalysis.getCorrVoucherList.json',
			urlparam: param
		},
		tableParam: {
			select: true,
			param1: 'jsq',
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			infoCallback: fnInfoCallback,
			pageLength: 30,
			columnDefs: [
				{
					targets: accountledger_view_index++,
					className: 'text-center',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '30px'
				}, {
					targets: accountledger_view_index++,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '70px'
				}, {
					targets: accountledger_view_index++,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px',
					render: function (data, type, row, meta) {
						if (data && data.length > 15) {
							return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
						}
						return data;
					}
				}, {
					targets: accountledger_view_index++,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '80'
				}, {
					targets: accountledger_view_index++,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '100px'
				}, {
					targets: accountledger_view_index++,
					className: 'text-right',
					title: '借发生额',
					name: 'drValue',
					data: 'drValue',
					width: '80px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: accountledger_view_index++,
					className: 'text-right',
					title: '贷发生额',
					name: 'crValue',
					data: 'crValue',
					width: '80px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};
	jsq(accountledger_view.tableParam, 'table_accountledger');
	BdoDataTable('table_accountledger', accountledger_view);

	/** 导出 */
	$('#accountledger_export').click(function () {
		exportExcelFin(this, '对应凭证分析列表', accountledger_view, 'table_accountledger');
	});
	/** 单元格点击事件 */
	$('#table_accountledger').on('click', 'td', function () {

		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_table_accountledger').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_table_accountledger').val('(' + data + ')');
			} else {
				$('#suanshi_table_accountledger').val(data);
			}
			$('#jieguo_table_accountledger').val(data);
		} else {
			value = $('#suanshi_table_accountledger').val();
			jieguo = $('#jieguo_table_accountledger').val();
			if (jieguo.indexOf(',') >= 0) {
				numjieguo = parseFloat(jieguo.split(',').join(''));
			} else {
				numjieguo = parseFloat(jieguo);
			}
			if (data.indexOf(',') >= 0) {
				numdata = parseFloat(data.split(',').join(''));
			} else {
				numdata = parseFloat(data);
			}
			if (data.indexOf('-') >= 0) {
				$('#suanshi_table_accountledger').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_table_accountledger').val(value + '+' + data);
			}
			$('#jieguo_table_accountledger').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	//计算器重置
	$('#jsq_clear_subjectEntry').on('click', function () {

		$('#suanshi_table_accountledger').val('');
		$('#jieguo_table_accountledger').val('');
	});

};