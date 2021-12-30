var accountdetailTab = function(tabId, customerId, startYyyy, startMonth, endYyyy, endMonth, subjectId) {
	if ($('#' + tabId + ' li a[href="#tab_accountdetail"]').length != 0) {
		$('#' + tabId + ' li a[href="#tab_accountdetail"]').remove();
		$('#tab_accountdetail').remove();
	}

	$('#' + tabId + '').append('<li><a href="#tab_accountdetail">科目明细账&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_accountdetail"></div>');

	$('#' + tabId + ' a[href="#tab_accountdetail"]').find('.fa-times-circle').click(function() {
		$(this).parents('ul').find('li').first().find('a').click();
		$(this).parents('li').remove();
		$('#tab_accountdetail').remove();
	});

	var accountledager = '<div class="content"><div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options"><li>'
			+ '<button id="accountdetail_export" type="button"><i class="si si-cloud-download" style="color: white;">&nbsp;导出</i></button>'
			+ '</li></ul><h3 class="block-title">科目明细账一览</h3></div><div class="block-content">' + '<table id="table_accountdetail" class="table table-bordered table-striped table-hover"></table>'
			+ '</div></div>' + '</div>';

	$('#tab_accountdetail').empty().html(accountledager);
	$('#' + tabId + ' a[href="#tab_accountdetail"]').click();
	var accountdetail_view_index = 1;
	/** table 属性 */
	var accountdetail_view = {
		localParam : {
			tabNum : true,
			url : 'finCenter/SubjectEntry.getSubjectEntryView.json',
			urlparam : {
				menuId : window.sys_menuId,
				jsonData : JSON.stringify({
					'startMonth' : startMonth,
					'endYyyy' : endYyyy,
					'endMonth' : endMonth,
					'subjectId' : subjectId
				}),
				lockProjectId : customerId,
				lockYyyy : startYyyy
			}
		},
		tableParam : {
			select : true,
			param1 : 'jsq',
			lengthChange : false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering : false,
			serverSide : true,
			infoCallback : fnInfoCallback,
			fixedThead : true,
			fixedHeight : '500px',
			columnDefs : [
					{
						targets : accountdetail_view_index++,
						className : 'text-center',
						title : '凭证日期',
						name : 'vchDate',
						data : 'vchDate',
						width : '70px'
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-left',
						title : '字',
						name : 'typeId',
						data : 'typeId',
						width : '20px'
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-left',
						title : '系统编号',
						name : 'voucherId',
						data : 'voucherId',
						width : '20px',
						visible : false
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-left',
						title : '号',
						name : 'oldVoucherId',
						data : 'oldVoucherId',
						width : '20px'
					},
					{
						targets : accountdetail_view_index++,
						orderable : true,
						className : 'text-left',
						title : '科目编号',
						name : 'subjectId',
						data : 'subjectId',
						width : '80px'
					}, {
						targets : accountdetail_view_index++,
						orderable : true,
						className : 'text-left',
						title : '科目名称',
						name : 'subjectFullName',
						data : 'subjectFullName',
						width : '100px'
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-left',
						title : '摘要',
						name : 'summary',
						data : 'summary',
						width : '200px',
						render: function (data, type, row, meta) {
							if (data && data.length > 15) {
								return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
							}
							return data;
						}
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-left',
						title : '对方科目',
						name : 'dfkm',
						data : 'dfkm',
						width : '200px',
						render: function (data, type, row, meta) {
							if (data && data.length > 15) {
								return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
							}
							return data;
						}
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-center',
						title : '币种',
						name : 'currency',
						data : 'currency',
						width : '25px'
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-center',
						title : '汇率',
						name : 'currRate',
						data : 'currRate',
						width : '25px',
						render: function (data, type, row, meta) {
							if (data) {
								if (data == '' || data == 0) {
									return '1'
								}
								return data;
							}
							return '';
						}
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-right',
						title : '借方发生额',
						name : 'debitOcc',
						data : 'debitOcc',
						width : '100px',
						render : function(data, type, row, meta) {
							return formatMoney(data);
						}
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-right',
						title : '贷方发生额',
						name : 'creditOcc',
						data : 'creditOcc',
						width : '100px',
						render : function(data, type, row, meta) {
							return formatMoney(data);
						}
					},
					{
						targets : accountdetail_view_index++,
						title : '余额',
						className : 'text-right',
						name : 'remain',
						data : 'remain',
						width : '100px',
						render : function(data, type, row, meta) {
							return formatMoney(data);
						}
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-right',
						title : '借方结转额',
						name : 'tranDebitOcc',
						data : 'tranDebitOcc',
						width : '100px',
						render : function(data, type, row, meta) {
							var html = formatMoney(data);
							if (html != 0) {
								html = '<label style="font-size: 10px;position: relative;top:5px;">'
										+ '<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' + '</label>';
							}
							return html;
						}
					},
					{
						targets : accountdetail_view_index++,
						className : 'text-right',
						title : '贷方结转额',
						name : 'tranCreditOcc',
						data : 'tranCreditOcc',
						width : '100px',
						render : function(data, type, row, meta) {
							// return formatMoney(data);
							var html = formatMoney(data);
							if (html != 0) {
								html = '<label style="font-size: 10px;position: relative;top:5px;">'
										+ '<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' + '</label>';
							}
							return html;
						}
					} ]
		}
	};
	jsq(accountdetail_view.tableParam, 'table_accountdetail');
	BdoDataTable('table_accountdetail', accountdetail_view);

	/** 行双击 */
	$('#table_accountdetail tbody').on('dblclick', 'tr', function() {
		var object = $('#table_accountdetail').DataTable().data()[$(this).closest('tr').index()];
		if (object.voucherId && object.voucherId > '') {
			voucherTab(tabId, customerId, object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
		}
	});

	/** 导出 */
	$('#accountdetail_export').click(function() {
		exportExcelFin(this, '科目明细账一览', accountdetail_view, 'table_accountdetail');
	});

	/** 单元格点击事件 */
	$('#table_accountdetail').on('click', 'td', function() {

		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_table_accountdetail').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_table_accountdetail').val('(' + data + ')');
			} else {
				$('#suanshi_table_accountdetail').val(data);
			}
			$('#jieguo_table_accountdetail').val(data);
		} else {
			value = $('#suanshi_table_accountdetail').val();
			jieguo = $('#jieguo_table_accountdetail').val();
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
				$('#suanshi_table_accountdetail').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_table_accountdetail').val(value + '+' + data);
			}
			$('#jieguo_table_accountdetail').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 计算器重置
	$('#jsq_clear_table_accountdetail').on('click', function() {

		$('#suanshi_table_accountdetail').val('');
		$('#jieguo_table_accountdetail').val('');
	});
};

// 全屏滚动事件
$('.block').on('mousewheel', function(e) {
	// 向上滚动
	var sctop = $('.active .dataTables_scrollBody').scrollTop();
	if (e.deltaY == 1) {
		if (sctop <= 0) {
			return;
		}
		sctop -= 80;
		$('.active .dataTables_scrollBody').scrollTop(sctop);
		// 向下滚动
	} else if (e.deltaY == -1) {
		if ($('.active .dataTables_scrollBody')[1]) {
			if ($('.active .dataTables_scrollBody')[1].scrollHeight - 500 <= sctop) {
				return;
			}
		} else if ($('.active .dataTables_scrollBody').scrollHeight - 500 <= sctop) {
			return;
		}
		sctop += 80;
		$('.active .dataTables_scrollBody').scrollTop(sctop);
	}
});