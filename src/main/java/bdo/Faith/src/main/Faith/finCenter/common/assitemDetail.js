var assitemdetailTab = function(tabId, customerId, startYyyy, startMonth, endYyyy, endMonth, subjectId, assitemId, fullName) {

	if ($('#' + tabId + ' li a[href="#tab_assitemdetail"]').length != 0) {
		$('#' + tabId + ' li a[href="#tab_assitemdetail"]').remove();
		$('#tab_assitemdetail').remove();
	}

	$('#' + tabId + '').append('<li><a href="#tab_assitemdetail">核算明细账&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_assitemdetail"></div>');

	$('#' + tabId + ' a[href="#tab_assitemdetail"]').find('.fa-times-circle').click(function() {
		$(this).parents('ul').find('li').first().find('a').click();
		$(this).parents('li').remove();
		$('#tab_assitemdetail').remove();
	});

	var assitemledager = '<div class="content"><div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options"><li>'
			+ '<button id="assitemdetail_export" type="button"><i class="si si-cloud-download" style="color: white;">&nbsp;导出</i></button>' + '</li></ul><h3 class="block-title">核算明细账一览	' + startYyyy
			+ '	' + fullName + '</h3></div><div class="block-content">' + '<table id="table_assitemdetail" class="table table-bordered table-striped table-hover"></table>' + '</div></div>' + '</div>';

	$('#tab_assitemdetail').empty().html(assitemledager);
	$('#' + tabId + ' a[href="#tab_assitemdetail"]').click();

	/** table 属性 */
	var assitemdetail_view_index = 1;
	var assitemdetail_view = {
		localParam : {
			tabNum : true,
			url : 'finCenter/SubjectEntry.getSubjectEntryAssitemView.json',
			urlparam : {
				menuId : window.sys_menuId,
				jsonData : JSON.stringify({
					'startMonth' : startMonth,
					'endYyyy' : endYyyy,
					'endMonth' : endMonth,
					'subjectId' : subjectId,
					'assItemId' : assitemId
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
			columnDefs : [ {
				targets : assitemdetail_view_index++,
				orderable : false,
				className : 'text-center',
				title : '凭证日期',
				name : 'vchDate',
				data : 'vchDate',
				width : '70px'

			}, {
				targets : assitemdetail_view_index++,
				orderable : true,
				className : 'text-left',
				title : '字',
				name : 'typeId',
				data : 'typeId',
				width : '20px'

			}, {
				targets : assitemdetail_view_index++,
				orderable : true,
				className : 'text-left',
				title : '系统编号',
				name : 'voucherId',
				data : 'voucherId',
				width : '20px',
				visible : false
			}, {
				targets : assitemdetail_view_index++,
				orderable : true,
				className : 'text-left',
				title : '号',
				name : 'oldVoucherId',
				data : 'oldVoucherId',
				width : '20px'
			}, {
				targets : assitemdetail_view_index++,
				orderable : true,
				className : 'text-left',
				title : '摘要',
				name : 'summary',
				data : 'summary',
				width: '200px',
				render: function (data, type, row, meta) {
					if (data && data.length > 15) {
						return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
					}
					return data;
				}
			}, {
				targets : assitemdetail_view_index++,
				orderable : true,
				className : 'text-left',
				title : '对方科目',
				name : 'oppositeSubjectValue',
				data : 'oppositeSubjectValue',
				width : '200px',
				render: function (data, type, row, meta) {
					if (data && data.length > 15) {
						return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
					}
					return data;
				}
			}, {
				targets : assitemdetail_view_index++,
				orderable : true,
				className : 'text-right',
				title : '借方发生额',
				name : 'debitOcc',
				data : 'debitOcc',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : assitemdetail_view_index++,
				orderable : true,
				className : 'text-right',
				title : '贷方发生额',
				name : 'creditOcc',
				data : 'creditOcc',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : assitemdetail_view_index++,
				orderable : true,
				className : 'text-right',
				title : '余额',
				name : 'remain',
				data : 'remain',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			} ]
		}
	};
	jsq(assitemdetail_view.tableParam, 'table_assitemdetail');
	BdoDataTable('table_assitemdetail', assitemdetail_view);

	/** 行双击 */
	$('#table_assitemdetail tbody').on('dblclick', 'tr', function() {
		var object = $('#table_assitemdetail').DataTable().data()[$(this).closest('tr').index()];
		if (object.voucherId && object.voucherId > '') {
			voucherTab(tabId, customerId, object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
		}
	});
	/** 单元格点击事件 */
	$('#table_assitemdetail').on('click', 'td', function() {

		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_table_assitemdetail').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_table_assitemdetail').val('(' + data + ')');
			} else {
				$('#suanshi_table_assitemdetail').val(data);
			}
			$('#jieguo_table_assitemdetail').val(data);
		} else {
			value = $('#suanshi_table_assitemdetail').val();
			jieguo = $('#jieguo_table_assitemdetail').val();
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
				$('#suanshi_table_assitemdetail').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_table_assitemdetail').val(value + '+' + data);
			}
			$('#jieguo_table_assitemdetail').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 计算器重置
	$('#jsq_clear_table_assitemdetail').on('click', function() {

		$('#suanshi_table_assitemdetail').val('');
		$('#jieguo_table_assitemdetail').val('');
	});

	/** 导出 */
	$('#assitemdetail_export').click(function() {
		exportExcelFin(this, '核算明细账一览', assitemdetail_view, 'table_assitemdetail');
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
