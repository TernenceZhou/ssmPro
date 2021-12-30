var assitemLedagerTab = function (tabId, customerId, subYear, subjectId, assitemId) {

	if ($('#' + tabId + ' li a[href="#tab_assitemLedager"]').length != 0) {
		$('#' + tabId + ' li a[href="#tab_assitemLedager"]').remove();
		$('#tab_assitemLedager').remove();
	}

	$('#' + tabId + '').append('<li><a href="#tab_assitemLedager">核算分类账&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_assitemLedager"></div>');

	$('#' + tabId + ' a[href="#tab_assitemLedager"]').find('.fa-times-circle').click(function () {
		$(this).parents('ul').find('li').first().find('a').click();
		$(this).parents('li').remove();
		$('#tab_assitemLedager').remove();
	});

	var assitemLedager = '<div class="content"><div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options"><li>'
		+ '<button id="assitemLedager_export" type="button"><i class="si si-cloud-download" style="color: white;">&nbsp;导出</i></button>'
		+ '</li></ul><h3 class="block-title">核算分类账一览</h3></div><div class="block-content">' + '<table id="table_assitemLedager" class="table table-bordered table-striped table-hover"></table>'
		+ '</div></div>' + '</div>';

	$('#tab_assitemLedager').html(assitemLedager);
	$('#' + tabId + ' a[href="#tab_assitemLedager"]').click();

	/** table 属性 */
	var assitemLedager_view_index = 1;
	var assitemLedager_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/Account.getAssitemLedager.json',
			urlparam: {
				menuId: window.sys_menuId,
				param3: subjectId,
				param4: assitemId,
				lockProjectId: customerId,
				lockYyyy: subYear
			}
		},
		tableParam: {
			param1: 'jsq',
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			infoCallback: fnInfoCallback,
			fixedThead: true,
			fixedHeight: '500px',
			columnDefs: [{
				targets: assitemLedager_view_index++,
				className: 'text-left',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '50px'
			}, {
				targets: assitemLedager_view_index++,
				className: 'text-left',
				title: '科目名称',
				name: 'subjectFullName',
				data: 'subjectFullName',
				width: '150px'
			}, {
				targets: assitemLedager_view_index++,
				className: 'text-left',
				title: '核算编号',
				name: 'assItemId',
				data: 'assItemId',
				width: '100px'
			}, {
				targets: assitemLedager_view_index++,
				className: 'text-left',
				title: '核算名称',
				name: 'assTotalName',
				data: 'assTotalName',
				width: '250px'
			}, {
				targets: assitemLedager_view_index++,
				className: 'text-center',
				title: '科目方向',
				name: 'direction',
				data: 'direction',
				width: '30px'
			}, {
				targets: assitemLedager_view_index++,
				className: 'text-center',
				title: '会计月份',
				name: 'subMonth',
				data: 'subMonth',
				width: '30px'
			}, {
				targets: assitemLedager_view_index++,
				className: 'text-right',
				title: '借方发生金额',
				name: 'debitOcc',
				data: 'debitOcc',
				width: '150px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: assitemLedager_view_index++,
				className: 'text-right',
				title: '贷方发生金额',
				name: 'creditOcc',
				data: 'creditOcc',
				width: '150px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: assitemLedager_view_index++,
				className: 'text-right',
				title: '期末金额',
				name: 'balance',
				data: 'balance',
				width: '150px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}]
		}
	};
	jsq(assitemLedager_view.tableParam, 'table_assitemLedager');
	BdoDataTable('table_assitemLedager', assitemLedager_view);

	/** 行双击 */
	$('#table_assitemLedager tbody').on('dblclick', 'tr', function () {
		var object = $('#table_assitemLedager').DataTable().data()[$(this).closest('tr').index()];
		if (object.assTotalName != '>期初') {
			if (object.assTotalName == '>合计' && object.subMonth == '') {
				startsubMonth = 1;
				endsubMonth = 12;
			} else {
				startsubMonth = object.subMonth;
				endsubMonth = object.subMonth;
			}
			assitemdetailTab(tabId, customerId, subYear, startsubMonth, subYear, endsubMonth, subjectId, assitemId, object.assTotalName);
		}
	});
	/** 单元格点击事件 */
	$('#table_assitemLedager').on('click', 'td', function () {
		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_table_assitemLedager').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_table_assitemLedager').val('(' + data + ')');
			} else {
				$('#suanshi_table_assitemLedager').val(data);
			}
			$('#jieguo_table_assitemLedager').val(data);
		} else {
			value = $('#suanshi_table_assitemLedager').val();
			jieguo = $('#jieguo_table_assitemLedager').val();
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
				$('#suanshi_table_assitemLedager').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_table_assitemLedager').val(value + '+' + data);
			}
			$('#jieguo_table_assitemLedager').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 计算器重置
	$('#jsq_clear_table_assitemLedager').on('click', function () {

		$('#suanshi_table_assitemLedager').val('');
		$('#jieguo_table_assitemLedager').val('');
	});
	/** 导出 */
	$('#assitemLedager_export').click(function () {
		exportExcelFin(this, '核算分类账一览', assitemLedager_view, 'table_assitemLedager');
	});

};
