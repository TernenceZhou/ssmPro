var assitemViewTab = function(tabId, customerId, subYear, monthType, startMonth, endMonth, subjectId, currency) {
	if ($('#' + tabId + ' li a[href="#tab_assitemView"]').length != 0) {
		$('#' + tabId + ' li a[href="#tab_assitemView"]').remove();
	}
	$('#' + tabId + '').append('<li><a href="#tab_assitemView">核算&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_assitemView"></div>');
	$('#' + tabId + ' a[href="#tab_assitemView"]').find('.fa-times-circle').click(function() {
		$(this).parents('ul').find('li').first().find('a').click();
		$(this).parents('li').remove();
		$('#tab_assitemView').remove();
	});
	var assitemView = '<div class="content"><div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options"><li>'
			+ '<button id="assitemView_export" type="button"><i class="si si-cloud-download" style="color: white;">&nbsp;导出</i></button>'
			+ '</li></ul><h3 class="block-title">核算项</h3></div><div class="block-content">' + '<table id="table_assitemView" class="table table-bordered table-striped table-hover"></table>'
			+ '</div></div></div>';
	$('#tab_assitemView').html(assitemView);
	$('#' + tabId + ' a[href="#tab_assitemView"]').click();

	currency = (currency == '') ? '0' : '1';

	/** table 属性 */
	// 不分月
	var assitemView_view1 = {
		localParam : {
			tabNum : true,
			url : 'finCenter/Account.getAccountAssitem.json',
			urlparam : {
				menuId : window.sys_menuId,
				jsonData : JSON.stringify({
					monthType : monthType,
					startMonth : startMonth,
					endMonth : endMonth,
					subjectId : subjectId,
					otherCurr : currency,
					assItemId : ''
				}),
				lockProjectId : customerId,
				lockYyyy : subYear
			}
		},
		tableParam : {}
	};
	// 分月
	var assitemView_view2 = {
		localParam : {
			tabNum : true,
			url : 'finCenter/Account.getAccountAssitem.json',
			urlparam : {
				menuId : window.sys_menuId,
				jsonData : JSON.stringify({
					monthType : monthType,
					startMonth : startMonth,
					endMonth : endMonth,
					subjectId : subjectId,
					otherCurr : currency,
					assItemId : ''
				}),
				lockProjectId : customerId,
				lockYyyy : subYear
			}
		},
		tableParam : {}
	};
	if (monthType == '') {
		assitemView_view1.tableParam = assCol();
		jsq(assitemView_view1.tableParam, 'table_assitemView');
		BdoDataTable('table_assitemView', assitemView_view1);
	} else {
		assitemView_view2.tableParam = assmonthCol();
		jsq(assitemView_view2.tableParam, 'table_assitemView');
		BdoDataTable('table_assitemView', assitemView_view2);
	}
	/** 行双击 */
	$('#table_assitemView tbody').on('dblclick', 'tr', function() {
		var object = $('#table_assitemView').DataTable().data()[$(this).closest('tr').index()];
		assitemLedagerTab(tabId, customerId, object.yyyy, object.subjectId, object.assItemId);
	});

	/** 导出 */
	$('#assitemView_export').click(function() {
		if (monthType == '') {
			exportExcelFin(this, '科目核算一览', assitemView_view1, 'table_assitemView');
		} else {
			exportExcelFin(this, '科目核算账一览', assitemView_view2, 'table_assitemView');
		}
	});
	/** 单元格点击事件 */
	$('#table_assitemView').on('click', 'td', function() {
		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_table_assitemView').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_table_assitemView').val('(' + data + ')');
			} else {
				$('#suanshi_table_assitemView').val(data);
			}
			$('#jieguo_table_assitemView').val(data);
		} else {
			value = $('#suanshi_table_assitemView').val();
			jieguo = $('#jieguo_table_assitemView').val();
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
				$('#suanshi_table_assitemView').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_table_assitemView').val(value + '+' + data);
			}
			$('#jieguo_table_assitemView').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 计算器重置
	$('#jsq_clear_table_assitemView').on('click', function() {

		$('#suanshi_table_assitemView').val('');
		$('#jieguo_table_assitemView').val('');
	});

	// 核算余额表 列
	function assCol() {
		var tableCol_index = 1;
		var tableCol = {
			select : true,
			lengthChange : false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering : false,
			serverSide : true,
			infoCallback : fnInfoCallback,
			fixedThead : true,
			fixedHeight : '500px',
			columnDefs : [ {
				targets : tableCol_index ++,
				className : 'text-left',
				title : '科目编号',
				name : 'subjectId',
				data : 'subjectId',
				width : '150px'
			}, {
				targets : tableCol_index ++,
				className : 'text-left',
				title : '核算项目编号',
				name : 'assItemId',
				data : 'assItemId',
				width : '200px'
			}, {
				targets : tableCol_index ++,
				className : 'text-left',
				title : '核算项目名称',
				name : 'assItemName',
				data : 'assItemName',
				width : '250px'
			}, {
				targets : tableCol_index ++,
				className : 'text-center',
				title : '币种',
				name : 'currency',
				data : 'currency',
				width : '30px'
			}, {
				targets : tableCol_index ++,
				className : 'text-center',
				title : '方向',
				name : 'direction',
				data : 'direction',
				width : '30px'
			} ]
		};
		if (currency == '1') {
			tableCol.columnDefs.push({
				targets : tableCol_index ++,
				className : 'text-right',
				title : '期初余额<br>外币',
				name : 'remain',
				data : 'remain',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableCol_index ++,
				className : 'text-right',
				title : '期初余额<br>本位币',
				name : 'remainF',
				data : 'remainF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableCol_index ++,
				className : 'text-right',
				title : '借方发生额<br>外币',
				name : 'debitOcc',
				data : 'debitOcc',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableCol_index ++,
				className : 'text-right',
				title : '借方发生额<br>本位币',
				name : 'debitOccF',
				data : 'debitOccF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableCol_index ++,
				className : 'text-right',
				title : '贷方发生额<br>外币',
				name : 'creditOcc',
				data : 'creditOcc',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableCol_index ++,
				className : 'text-right',
				title : '贷方发生额<br>本位币',
				name : 'creditOccF',
				data : 'creditOccF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableCol_index ++,
				className : 'text-right',
				title : '期末余额<br>外币',
				name : 'balance',
				data : 'balance',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableCol_index ++,
				className : 'text-right',
				title : '期末余额<br>本位币',
				name : 'balanceF',
				data : 'balanceF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			});
		} else {
			tableCol.columnDefs.push({
				targets : tableCol_index ++,
				className : 'text-right',
				title : '期初余额',
				name : 'remainF',
				data : 'remainF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableCol_index ++,
				className : 'text-right',
				title : '借方发生额',
				name : 'debitOccF',
				data : 'debitOccF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableCol_index ++,
				className : 'text-right',
				title : '贷方发生额',
				name : 'creditOccF',
				data : 'creditOccF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableCol_index ++,
				className : 'text-right',
				title : '期末余额',
				name : 'balanceF',
				data : 'balanceF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			});
		}
		tableCol.param1 = 'jsq';
		return tableCol;
	}

	// 余额表 列 分月模式
	function assmonthCol() {
		var tableCol_index = 1;
		var tableCol = {
			select : true,
			lengthChange : false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering : false,
			serverSide : true,
			infoCallback : fnInfoCallback,
			columnDefs : [ {
				targets : tableCol_index ++,
				className : 'text-left',
				title : '科目编号',
				name : 'subjectId',
				data : 'subjectId',
				width : '150px'
			}, {
				targets : tableCol_index ++,
				className : 'text-left',
				title : '核算项目编号',
				name : 'assItemId',
				data : 'assItemId',
				width : '200px'
			}, {
				targets : tableCol_index ++,
				className : 'text-left',
				title : '核算项目名称',
				name : 'assItemName',
				data : 'assItemName',
				width : '250px'
			}, {
				targets : tableCol_index ++,
				className : 'text-center',
				title : '币种',
				name : 'currency',
				data : 'currency',
				width : '150px'
			}, {
				targets : tableCol_index ++,
				className : 'text-center',
				title : '方向',
				name : 'direction',
				data : 'direction',
				width : '100px'
			} ]
		};
		if (currency == '1') {
			for (var i = parseInt(startMonth); i <= parseInt(endMonth); i++) {
				tableCol.columnDefs.push({
					targets : tableCol_index ++,
					className : 'text-right',
					title : i + '月<br>外币',
					name : 'month' + i,
					data : 'month' + i,
					width : '100px',
					render : function(data, type, row, meta) {
						return formatMoney(data);
					}
				});
				tableCol.columnDefs.push({
					targets : tableCol_index ++,
					className : 'text-right',
					title : i + '月<br>本位币',
					name : 'monthF' + i,
					data : 'monthF' + i,
					width : '100px',
					render : function(data, type, row, meta) {
						return formatMoney(data);
					}
				});
			}
		} else {
			for (var i = parseInt(startMonth); i <= parseInt(endMonth); i++) {
				tableCol.columnDefs.push({
					targets : tableCol_index ++,
					className : 'text-right',
					title : i + '月',
					name : 'monthF' + i,
					data : 'monthF' + i,
					width : '100px',
					render : function(data, type, row, meta) {
						return formatMoney(data);
					}
				});
			}
		}
		tableCol.param1 = 'jsq';
		return tableCol;
	}
};