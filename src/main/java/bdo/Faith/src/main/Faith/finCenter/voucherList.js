$(document).ready(function () {
	uiBlocksApi(false, 'init');
	var tempVoucherId;
	var color1 = '#53f9f9';
	var color2 = '#FF8800';
	var color = '#53f9f9';
	/** 加载 树 下拉框 */
	// 客户
	getUserCustomers('search_customerId');
	getUserCustomers('sameVoucher_customerId');
	getUserCustomers('sameAmountVoucher_customerId');
	getUserCustomers('hedgeVoucher_customerId');
	
	$('#search_customerId').change(function () {
		if ($('#accmulsubject_tree').hasClass('treeview')) {
			$('#accmulsubject_tree').tree('reset');
			$('#accmulsubject_tree').tree('destory');
		}
	});
	$('#sameVoucher_customerId').change(function () {
		if ($('#subject_tree_sameVoucher').hasClass('treeview')) {
			$('#subject_tree_sameVoucher').tree('reset');
			$('#subject_tree_sameVoucher').tree('destory');
		}
	});
	$('#sameAmountVoucher_customerId').change(function () {
		if ($('#subject_tree_sameAmountVoucher').hasClass('treeview')) {
			$('#subject_tree_sameAmountVoucher').tree('reset');
			$('#subject_tree_sameAmountVoucher').tree('destory');
		}
	});
	$('#hedgeVoucher_customerId').change(function () {
		if ($('#subject_tree_hedgeVoucher').hasClass('treeview')) {
			$('#subject_tree_hedgeVoucher').tree('reset');
			$('#subject_tree_hedgeVoucher').tree('destory');
		}
	});
	$('#search_yyyy,#sameVoucher_yyyy,#sameAmountVoucher_yyyy,#hedgeVoucher_yyyy').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', // 语言设置
		format: 'yyyy', // 日期显示格式
		minViewMode: 2

	});
	$('#search_startDate,#search_endDate,#sameVoucher_startDate,#sameVoucher_endDate,#sameAmountVoucher_startDate,#sameAmountVoucher_endDate,#hedgeVoucher_startDate,#hedgeVoucher_endDate').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', // 语言设置
		format: 'mm-dd', // 日期显示格式
		minViewMode: 0
	});
	let startyear = window.CUR_PROJECT_START_YEAR;
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	$('#search_yyyy,#sameVoucher_yyyy,#sameAmountVoucher_yyyy,#hedgeVoucher_yyyy').val(startyear);
	$('#search_startDate,#search_endDate,#sameVoucher_startDate,#sameVoucher_endDate,#sameAmountVoucher_startDate,#sameAmountVoucher_endDate,#hedgeVoucher_startDate,#hedgeVoucher_endDate').datepicker('setStartDate', new Date(startyear + '-01-01'));
	$('#search_startDate,#search_endDate,#sameVoucher_startDate,#sameVoucher_endDate,#sameAmountVoucher_startDate,#sameAmountVoucher_endDate,#hedgeVoucher_startDate,#hedgeVoucher_endDate').datepicker('setEndDate', new Date(startyear + '-12-31'));
	$('#search_startDate,#sameVoucher_startDate,#sameAmountVoucher_startDate,#hedgeVoucher_startDate').val('01-01');
	$('#search_endDate,#sameVoucher_endDate,#sameAmountVoucher_endDate,#hedgeVoucher_endDate').val('12-31');

	$('#search_yyyy').change(function () {
		if ($('#accmulsubject_tree').hasClass('treeview')) {
			$('#accmulsubject_tree').tree('reset');
			$('#accmulsubject_tree').tree('destory');
		}
		$('#search_startDate,#search_endDate').datepicker('setStartDate', new Date($('#search_yyyy').val() + '-01-01'));
		$('#search_startDate,#search_endDate').datepicker('setEndDate', new Date($('#search_yyyy').val() + '-12-31'));
	});
	$('#sameVoucher_yyyy').change(function () {
		if ($('#subject_tree_sameVoucher').hasClass('treeview')) {
			$('#subject_tree_sameVoucher').tree('reset');
			$('#subject_tree_sameVoucher').tree('destory');
		}
		$('#sameVoucher_startDate,#sameVoucher_endDate').datepicker('setStartDate', new Date($('#sameVoucher_yyyy').val() + '-01-01'));
		$('#sameVoucher_startDate,#sameVoucher_endDate').datepicker('setEndDate', new Date($('#sameVoucher_yyyy').val() + '-12-31'));
	});
	$('#sameAmountVoucher_yyyy').change(function () {
		if ($('#subject_tree_sameAmountVoucher').hasClass('treeview')) {
			$('#subject_tree_sameAmountVoucher').tree('reset');
			$('#subject_tree_sameAmountVoucher').tree('destory');
		}
		$('#sameAmountVoucher_startDate,#sameAmountVoucher_endDate').datepicker('setStartDate', new Date($('#sameAmountVoucher_yyyy').val() + '-01-01'));
		$('#sameAmountVoucher_startDate,#sameAmountVoucher_endDate').datepicker('setEndDate', new Date($('#sameAmountVoucher_yyyy').val() + '-12-31'));
	});
	$('#hedgeVoucher_yyyy').change(function () {
		if ($('#subject_tree_hedgeVoucher').hasClass('treeview')) {
			$('#subject_tree_hedgeVoucher').tree('reset');
			$('#subject_tree_hedgeVoucher').tree('destory');
		}
		$('#hedgeVoucher_startDate,#hedgeVoucher_endDate').datepicker('setStartDate', new Date($('#hedgeVoucher_yyyy').val() + '-01-01'));
		$('#hedgeVoucher_startDate,#hedgeVoucher_endDate').datepicker('setEndDate', new Date($('#hedgeVoucher_yyyy').val() + '-12-31'));
	});
	$('#summary_type,#sameVoucher_summary_type,#sameAmountVoucher_summary_type,#hedgeVoucher_summary_type').html(ComboLocalDicOption(false, '摘要匹配'));
	$('#search_moneyType,#sameVoucher_moneyType,#sameAmountVoucher_moneyType,#hedgeVoucher_moneyType').html(ComboLocalDicOption(false, '分录金额'));
	$('#search_moneyOpt,#sameVoucher_moneyOpt,#sameAmountVoucher_moneyOpt,#hedgeVoucher_moneyOpt').html(ComboLocalDicOption(false, '金额比较'));
	$('#search_vouchartype,#sameVoucher_vouchartype,#sameAmountVoucher_vouchartype,#hedgeVoucher_vouchartype').html(ComboLocalDicOption(true, '凭证类型'));
	$('#search_viewnum,#search_othercurr').html(ComboLocalDicOption(false, 'boolean'));
	$('#search_othercurr').val('0');
	
	$('#search_subjectId').focus(function () {
		if ($('#search_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#search_yyyy').val() == '') {
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid').modal('show');
		if ($('#accmulsubject_tree').hasClass('treeview')) {
			return;
		}
		$('#accmulsubject_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#search_customerId').val(),
				lockYyyy: $('#search_yyyy').val(),
				searchInputId: 'searchInput2'
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
	$('#modal_accmulsubjectid_sure').click(function () {
		if (typeof ($('#accmulsubject_tree').tree('getTreeMultiValue')) == 'object') {
			$('#search_subjectId').val('');
		} else {
			if ($('#accmulsubject_tree').tree('getTreeMultiValue') == 'undefined') {
				$('#search_subjectId').val('');
			} else {
				$('#search_subjectId').val($('#accmulsubject_tree').tree('getTreeMultiValue'));
			}
		}
		$('#modal_subjectid').modal('hide');
	});
	$('#modal_accmulsubjectid_reset').click(function () {
		$('#accmulsubject_tree').tree('reset');
	});
	
	$('#sameVoucher_subjectId').focus(function () {
		if ($('#sameVoucher_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#sameVoucher_yyyy').val() == '') {
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid_sameVoucher').modal('show');
		if ($('#subject_tree_sameVoucher').hasClass('treeview')) {
			return;
		}
		$('#subject_tree_sameVoucher').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#sameVoucher_customerId').val(),
				lockYyyy: $('#sameVoucher_yyyy').val(),
				searchInputId: 'searchInput_sameVoucher'
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
	$('#modal_subjectid_sure_sameVoucher').click(function () {
		if (typeof ($('#subject_tree_sameVoucher').tree('getTreeMultiValue')) == 'object') {
			$('#sameVoucher_subjectId').val('');
		} else {
			if ($('#subject_tree_sameVoucher').tree('getTreeMultiValue') == 'undefined') {
				$('#sameVoucher_subjectId').val('');
			} else {
				$('#sameVoucher_subjectId').val($('#subject_tree_sameVoucher').tree('getTreeMultiValue'));
			}
		}
		$('#modal_subjectid_sameVoucher').modal('hide');
	});
	$('#modal_subjectid_reset_sameVoucher').click(function () {
		$('#subject_tree_sameVoucher').tree('reset');
	});
	$('#sameAmountVoucher_subjectId').focus(function () {
		if ($('#sameAmountVoucher_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#sameAmountVoucher_yyyy').val() == '') {
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid_sameAmountVoucher').modal('show');
		if ($('#subject_tree_sameAmountVoucher').hasClass('treeview')) {
			return;
		}
		$('#subject_tree_sameAmountVoucher').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#sameAmountVoucher_customerId').val(),
				lockYyyy: $('#sameAmountVoucher_yyyy').val(),
				searchInputId: 'searchInput_sameAmountVoucher'
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
	$('#modal_subjectid_sure_sameAmountVoucher').click(function () {
		if (typeof ($('#subject_tree_sameAmountVoucher').tree('getTreeMultiValue')) == 'object') {
			$('#sameAmountVoucher_subjectId').val('');
		} else {
			if ($('#subject_tree_sameAmountVoucher').tree('getTreeMultiValue') == 'undefined') {
				$('#sameAmountVoucher_subjectId').val('');
			} else {
				$('#sameAmountVoucher_subjectId').val($('#subject_tree_sameAmountVoucher').tree('getTreeMultiValue'));
			}
		}
		$('#modal_subjectid_sameAmountVoucher').modal('hide');
	});
	$('#modal_subjectid_reset_sameAmountVoucher').click(function () {
		$('#subject_tree_sameAmountVoucher').tree('reset');
	});
	$('#hedgeVoucher_subjectId').focus(function () {
		if ($('#hedgeVoucher_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#hedgeVoucher_yyyy').val() == '') {
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid_hedgeVoucher').modal('show');
		if ($('#subject_tree_hedgeVoucher').hasClass('treeview')) {
			return;
		}
		$('#subject_tree_hedgeVoucher').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#hedgeVoucher_customerId').val(),
				lockYyyy: $('#hedgeVoucher_yyyy').val(),
				searchInputId: 'searchInput_hedgeVoucher'
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
	$('#modal_subjectid_sure_hedgeVoucher').click(function () {
		if (typeof ($('#subject_tree_hedgeVoucher').tree('getTreeMultiValue')) == 'object') {
			$('#hedgeVoucher_subjectId').val('');
		} else {
			if ($('#subject_tree_hedgeVoucher').tree('getTreeMultiValue') == 'undefined') {
				$('#hedgeVoucher_subjectId').val('');
			} else {
				$('#hedgeVoucher_subjectId').val($('#subject_tree_hedgeVoucher').tree('getTreeMultiValue'));
			}
		}
		$('#modal_subjectid_hedgeVoucher').modal('hide');
	});
	$('#modal_subjectid_reset_hedgeVoucher').click(function () {
		$('#subject_tree_hedgeVoucher').tree('reset');
	});
	/** table 属性 */
	var voucher_view1 = {
		localParam: {
			tabNum: true,
			url: 'finCenter/SubjectEntry.getVoucherList.json',
			urlparam: {
				menuId: window.sys_menuId
			}
		},
		tableParam: {}
	};
	var voucherDetail_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/SubjectEntry.getGroupVoucherDetail.json',
			urlparam: {
				menuId: window.sys_menuId,
				start: -1,
				limit: -1
			}
		},
		tableParam: {}
	};
	var voucherExport_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/SubjectEntry.getGroupVoucherListExport.json',
			urlparam: {
				menuId: window.sys_menuId,
				start: -1,
				limit: -1
			}
		},
		tableParam: {}
	};
	var voucherDateNum_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/SubjectEntry.getGroupVoucherDate.json',
			urlparam: {
				menuId: window.sys_menuId,
				start: -1,
				limit: -1
			}
		},
		tableParam: {}
	};
	/** 搜索按钮 */
	$('#voucher_search').click(function () {
		if ($('#search_endDate').val() == '' && $('#search_startDate').val() != '') {
			$('#search_endDate').val($('#search_startDate').val());
		}
		if ($('#search_startDate').val() == '' && $('#search_endDate').val() != '') {
			$('#search_startDate').val($('#search_endDate').val());
		}
		if ($('#search_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#search_startDate').val() == '') {
			bdoInfoBox('提示', '请选择凭证开始日期');
			return;
		}
		if ($('#search_endDate').val() == '') {
			bdoInfoBox('提示', '请选择凭证结束日期');
			return;
		}
		if ($('#search_startDate').val() > $('#search_endDate').val()) {
			bdoInfoBox('提示', '凭证结束日期不能小于凭证开始日期');
			return;
		}
		// 账套过期时间
		getValidDate($('#search_customerId').val(), $('#search_yyyy').val(), 'validDate');
		var params = {
			'menuId': window.sys_menuId,
			'lockProjectId': $('#search_customerId').val(),
			'lockYyyy': $('#search_yyyy').val(),
			jsonData: JSON.stringify({
				startDate: $('#search_startDate').val(),
				endDate: $('#search_endDate').val(),
				isInclude: $('#search_isInclude').val(),
				subjectId: $('#search_subjectId').val(),
				typeId: $('#search_typeId').val(),
				voucherId: $('#search_voucherId').val(),
				summaryType: $('#summary_type').val(),
				summary: $('#search_summary').val(),
				moneyType: $('#search_moneyType').val(),
				moneyOpt: $('#search_moneyOpt').val(),
				money: $('#search_money').val(),
				voucherType: $('#search_vouchartype').val()
			})
		};
		voucher_view1.tableParam = voucherCol($('#search_othercurr').val());
		voucher_view1.localParam.urlparam = params;
		jsq(voucher_view1.tableParam, 'voucher_tab');
		BdoDataTable('voucher_tab', voucher_view1);
		$('#voucher_tab').on('xhr.dt', function (e, settings, json, xhr) {
			if (json.recordsTotal > 0) {
				$('#voucher_export').css('display', 'block');
				$('#account_export_dg').css('display', 'block');
			} else {
				$('#voucher_export').css('display', 'none');
				$('#account_export_dg').css('display', 'none');
			}
		});
		$(this).parents('.block').next('.block').find('span[name="cus_select"]').text('【' + $('#search_customerId option:selected').text() + '】');
		/** 行双击 */
		$('#voucher_tab tbody').on('dblclick', 'tr', function () {
			var object = $('#voucher_tab').DataTable().data()[$(this).closest('tr').index()];
			voucherTab('tab_voucher', params.lockProjectId, object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
		});
	});
	/** 单元格点击事件 */
	$('#voucher_tab').on('click', 'td', function () {
		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_voucher_tab').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_voucher_tab').val('(' + data + ')');
			} else {
				$('#suanshi_voucher_tab').val(data);
			}
			$('#jieguo_voucher_tab').val(data);
		} else {
			value = $('#suanshi_voucher_tab').val();
			jieguo = $('#jieguo_voucher_tab').val();
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
				$('#suanshi_voucher_tab').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_voucher_tab').val(value + '+' + data);
			}
			$('#jieguo_voucher_tab').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 计算器重置
	$('#jsq_clear_voucher_tab').on('click', function () {
		$('#suanshi_voucher_tab').val('');
		$('#jieguo_voucher_tab').val('');
	});

	/** 重置按钮 */
	$('#voucher_clear').click(function () {
		$('#search_isInclude').val('1');
		$('#search_subjectId').val('');
		$('#search_typeId').val('');
		$('#search_voucherId').val('');
		$('#search_summery').val('');
		$('#search_moneyType').val('1');
		$('#search_money').val('');
	});
	$('#sameVoucher_clear').click(function () {
		$('#sameVoucher_isInclude').val('1');
		$('#sameVoucher_subjectId').val('');
		$('#sameVoucher_typeId').val('');
		$('#sameVoucher_voucherId').val('');
		$('#sameVoucher_summery').val('');
		$('#sameVoucher_moneyType').val('1');
		$('#sameVoucher_money').val('');
	});
	$('#sameAmountVoucher_clear').click(function () {
		$('#sameAmountVoucher_isInclude').val('1');
		$('#sameAmountVoucher_subjectId').val('');
		$('#sameAmountVoucher_typeId').val('');
		$('#sameAmountVoucher_voucherId').val('');
		$('#sameAmountVoucher_summery').val('');
		$('#sameAmountVoucher_moneyType').val('1');
		$('#sameAmountVoucher_money').val('');
	});
	$('#hedgeVoucher_clear').click(function () {
		$('#hedgeVoucher_isInclude').val('1');
		$('#hedgeVoucher_subjectId').val('');
		$('#hedgeVoucher_typeId').val('');
		$('#hedgeVoucher_voucherId').val('');
		$('#hedgeVoucher_summery').val('');
		$('#hedgeVoucher_moneyType').val('1');
		$('#hedgeVoucher_money').val('');
	});
	/** 导出 */
	$('#voucher_export').click(function () {
		exportExcelFin(this, '凭证一览', voucher_view1, 'voucher_tab');
	});
	/** 导出到底稿附件 打开Tb附件框 */
	$('#account_export_dg').click(function () {
		var customerId = $('#search_customerId').val();
		var customername = $('#search_customerId option:selected').text();
		ecportToDg(customerId, customername, voucher_view1);
	});
	function onExport(event) {
		let data = huoqunode();
		if (data) {
			data.title = '凭证一览';
			data.view = voucher_view1;
			data.table = 'voucher_tab';
			data.customerId = $('#search_customerId').val();
			exportExcelTo(this, data);
		}
	}
	/* 导出到底稿附件 */
	$('#modal_tbsubjectid_sure').click(onExport);

	function voucherCol(currType) {
		var tableCol_index = 1;
		var tableCol = {
			select: true,
			lengthChange: true,
			serverSide: true,
			pageLength: 30,
			// fixedHeader : true,
			fixedThead: true,
			fixedHeight: '500px',
			order : [ 1, 'asc' ],
			param1: 'jsq',
			columnDefs: [{
				targets: tableCol_index++,
				className: 'text-left',
				title: '凭证日期',
				name: 'vchDate',
				data: 'vchDate',
				width: '80px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '字',
				name: 'typeId',
				data: 'typeId',
				width: '10px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '系统编号',
				name: 'voucherId',
				data: 'voucherId',
				width: '40px',
				visible: false
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '号',
				name: 'oldVoucherId',
				data: 'oldVoucherId',
				width: '10px'
			}, {
				targets: tableCol_index++,
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
				targets: tableCol_index++,
				className: 'text-left',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '60px',
				visible: false
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '科目名称',
				name: 'subjectFullName',
				data: 'subjectFullName',
				width: '250px'
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '借方发生金额<br>本位币',
				name: 'debitOcc',
				data: 'debitOcc',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}]
		};
		if (currType == '1') {
			tableCol.columnDefs.push(
			{
				targets: tableCol_index++,
				className: 'text-right',
				title: '借方发生金额<br>外币',
				name: 'debitOccF',
				data: 'debitOccF',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '贷方发生金额<br>本位币',
				name: 'crebitOcc',
				data: 'crebitOcc',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '贷方发生金额<br>外币',
				name: 'crebitOccF',
				data: 'crebitOccF',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '汇率',
				name: 'currrate',
				data: 'currrate',
				width: '30px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '币种',
				name: 'currency',
				data: 'currency',
				width: '50px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '对方科目',
				name: 'dfkm',
				data: 'dfkm',
				width: '200px',
				render: function (data, type, row, meta) {
					if (data && data.length > 15) {
						return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
					}
					return data;
				}
			});
		}else{
			tableCol.columnDefs.push(
			{
				targets: tableCol_index++,
				className: 'text-right',
				title: '贷方发生金额<br>本位币',
				name: 'crebitOcc',
				data: 'crebitOcc',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '汇率',
				name: 'currrate',
				data: 'currrate',
				width: '30px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '币种',
				name: 'currency',
				data: 'currency',
				width: '50px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '对方科目',
				name: 'dfkm',
				data: 'dfkm',
				width: '200px',
				render: function (data, type, row, meta) {
					if (data && data.length > 15) {
						return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
					}
					return data;
				}
			});
		}
		if ($('#search_viewnum').val() == '1') {
			tableCol.columnDefs.push({
				targets : tableCol_index++,
				orderable : true,
				className : 'text-right',
				title : '数量',
				name : 'quantity',
				data : 'quantity',
				width : '50px'
			}, {
				targets : tableCol_index++,
				orderable : true,
				className : 'text-right',
				title : '单价',
				name : 'unitPrice',
				data : 'unitPrice',
				width : '50px'
			}, {
				targets : tableCol_index++,
				orderable : true,
				className : 'text-center',
				title : '单位',
				name : 'unitName',
				data : 'unitName',
				width : '50px'
			});
		}
		return tableCol;
	}
	
	function voucherDetailCol() {
		var tableCol_index = 1;
		var tableCol = {
			select: true,
			lengthChange: false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			serverSide: true,
			// pageLength: 30,
			// fixedHeader : true,
			fixedThead: true,
			fixedHeight: '500px',
			scrollY: '500',
			order : [ 1, 'asc' ],
			createdRow(row, data, dataIndex) {
				if(tempVoucherId != data.voucherId){
					if(color == color1){
						color = color2;
					}else{
						color = color1;
					}
					tempVoucherId = data.voucherId;
				}
				$(row).children("td").eq(1).css({"background-color":color});
				$(row).children("td").eq(2).css({"background-color":color});
				$(row).children("td").eq(3).css({"background-color":color});
			},
			//param1: 'jsq',
			columnDefs: [{
				targets: tableCol_index++,
				className: 'text-left',
				title: '凭证日期',
				name: 'vchDate',
				data: 'vchDate',
				width: '80px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '字',
				name: 'typeId',
				data: 'typeId',
				width: '10px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '系统编号',
				name: 'voucherId',
				data: 'voucherId',
				width: '40px',
				visible: false
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '号',
				name: 'oldVoucherId',
				data: 'oldVoucherId',
				width: '10px'
			}, {
				targets: tableCol_index++,
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
				targets: tableCol_index++,
				className: 'text-left',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '60px',
				visible: false
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '科目名称',
				name: 'subjectFullName',
				data: 'subjectFullName',
				width: '250px'
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '借方发生金额<br>本位币',
				name: 'debitOcc',
				data: 'debitOcc',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}]
		};
		tableCol.columnDefs.push(
		{
			targets: tableCol_index++,
			className: 'text-right',
			title: '贷方发生金额<br>本位币',
			name: 'crebitOcc',
			data: 'crebitOcc',
			width: '100px',
			render: function (data, type, row, meta) {
				return formatMoney(data);
			}
		}, {
			targets: tableCol_index++,
			className: 'text-left',
			title: '汇率',
			name: 'currrate',
			data: 'currrate',
			width: '30px'
		}, {
			targets: tableCol_index++,
			className: 'text-left',
			title: '币种',
			name: 'currency',
			data: 'currency',
			width: '50px'
		}, {
			targets: tableCol_index++,
			className: 'text-left',
			title: '对方科目',
			name: 'dfkm',
			data: 'dfkm',
			width: '200px',
			render: function (data, type, row, meta) {
				if (data && data.length > 15) {
					return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
				}
				return data;
			}
		});
		return tableCol;
	}

	function voucherExportCol() {
		var tableCol_index = 1;
		var tableCol = {
			select: true,
			lengthChange: true,
			serverSide: true,
			// pageLength: 30,
			// fixedHeader : true,
			fixedThead: true,
			fixedHeight: '240px',
			scrollY: '240',
			columnDefs: [{
				targets: tableCol_index++,
				className: 'text-left',
				title: '分组号',
				name: 'groupNo',
				data: 'groupNo',
				width: '80px'
			},{
				targets: tableCol_index++,
				className: 'text-left',
				title: '凭证日期',
				name: 'vchDate',
				data: 'vchDate',
				width: '80px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '字',
				name: 'typeId',
				data: 'typeId',
				width: '10px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '号',
				name: 'oldVoucherId',
				data: 'oldVoucherId',
				width: '10px'
			}, {
				targets: tableCol_index++,
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
				targets: tableCol_index++,
				className: 'text-left',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '60px',
				visible: false
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '科目名称',
				name: 'subjectFullName',
				data: 'subjectFullName',
				width: '250px'
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '借方发生金额<br>本位币',
				name: 'debitOcc',
				data: 'debitOcc',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}]
		};
		tableCol.columnDefs.push(
		{
			targets: tableCol_index++,
			className: 'text-right',
			title: '贷方发生金额<br>本位币',
			name: 'crebitOcc',
			data: 'crebitOcc',
			width: '100px',
			render: function (data, type, row, meta) {
				return formatMoney(data);
			}
		}, {
			targets: tableCol_index++,
			className: 'text-left',
			title: '汇率',
			name: 'currrate',
			data: 'currrate',
			width: '30px'
		}, {
			targets: tableCol_index++,
			className: 'text-left',
			title: '币种',
			name: 'currency',
			data: 'currency',
			width: '50px'
		}, {
			targets: tableCol_index++,
			className: 'text-left',
			title: '对方科目',
			name: 'dfkm',
			data: 'dfkm',
			width: '200px',
			render: function (data, type, row, meta) {
				if (data && data.length > 15) {
					return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
				}
				return data;
			}
		});
		return tableCol;
	}
	function voucherDateNumCol() {
		var tableCol_index = 1;
		var tableCol = {
			select: true,
			lengthChange: false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			serverSide: true,
			//pageLength: 30,
			// fixedHeader : true,
			fixedThead: true,
			fixedHeight: '240px',
			scrollY: '240',
			order : [ 1, 'asc' ],
			columnDefs: [{
				targets: tableCol_index++,
				className: 'text-left',
				title: '凭证日期',
				name: 'vchDate',
				data: 'vchDate',
				width: '80px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '号',
				name: 'oldVoucherId',
				data: 'oldVoucherId',
				width: '10px'
			}]
		};
		
		return tableCol;
	}
	
	var formatSubjectFullName = function (val) {
		var count = val.length;
		if (count > 20) {
			return val.substring(0, 16) + '...';
		}
		return val;
	};
	/** 推荐分析按钮 */
	$('#sameVoucher_xxranaly').click(function () {
		if ($('#sameVoucher_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#sameVoucher_yyyy').val() == '') {
			bdoInfoBox('提示', '请选择年份');
			return;
		}
		bdoConfirmBox('提交', '确认提交小杏人推荐分析？', function() {
			$.ajax({
				type: 'post',
				url: 'finCenter/SubjectEntry.saveXxrAnaly.json',
				data: {
					'menuId': window.sys_menuId,
					'lockProjectId': $('#sameVoucher_customerId').val(),
					'lockYyyy': $('#sameVoucher_yyyy').val()
				},
				dataType: 'json',
				success: function (data) {
					if (data && data.success) {
						bdoSuccessBox('成功', '请稍后几分钟查询结果');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	/** 搜索按钮 */
	$('#sameVoucher_search').click(function () {
		if ($('#sameVoucher_endDate').val() == '' && $('#sameVoucher_startDate').val() != '') {
			$('#sameVoucher_endDate').val($('#sameVoucher_startDate').val());
		}
		if ($('#sameVoucher_startDate').val() == '' && $('#sameVoucher_endDate').val() != '') {
			$('#sameVoucher_startDate').val($('#sameVoucher_endDate').val());
		}
		if ($('#sameVoucher_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#sameVoucher_startDate').val() == '') {
			bdoInfoBox('提示', '请选择凭证开始日期');
			return;
		}
		if ($('#sameVoucher_endDate').val() == '') {
			bdoInfoBox('提示', '请选择凭证结束日期');
			return;
		}
		if ($('#sameVoucher_startDate').val() > $('#sameVoucher_endDate').val()) {
			bdoInfoBox('提示', '凭证结束日期不能小于凭证开始日期');
			return;
		}
		// 账套过期时间
		getValidDate($('#sameVoucher_customerId').val(), $('#sameVoucher_yyyy').val(), 'validDate');
		var params = {
			'menuId': window.sys_menuId,
			'lockProjectId': $('#sameVoucher_customerId').val(),
			'lockYyyy': $('#sameVoucher_yyyy').val(),
			param1: '1',
			start: -1,
			limit: -1,
			jsonData: JSON.stringify({
				startDate: $('#sameVoucher_startDate').val(),
				endDate: $('#sameVoucher_endDate').val(),
				isInclude: $('#sameVoucher_isInclude').val(),
				subjectId: $('#sameVoucher_subjectId').val(),
				typeId: $('#sameVoucher_typeId').val(),
				voucherId: $('#sameVoucher_voucherId').val(),
				summaryType: $('#sameVoucher_summary_type').val(),
				summary: $('#sameVoucher_summary').val(),
				moneyType: $('#sameVoucher_moneyType').val(),
				moneyOpt: $('#sameVoucher_moneyOpt').val(),
				money: $('#sameVoucher_money').val(),
				voucherType: $('#sameVoucher_vouchartype').val()
			})
		};
		querySameVoucher(params, 'sameVoucher');
		/*$('#voucher_tab').on('xhr.dt', function (e, settings, json, xhr) {
			if (json.recordsTotal > 0) {
				$('#voucher_export').css('display', 'block');
				$('#account_export_dg').css('display', 'block');
			} else {
				$('#voucher_export').css('display', 'none');
				$('#account_export_dg').css('display', 'none');
			}
		});*/
	});
	/** 搜索按钮 */
	$('#sameAmountVoucher_search').click(function () {
		if ($('#sameAmountVoucher_endDate').val() == '' && $('#sameAmountVoucher_startDate').val() != '') {
			$('#sameAmountVoucher_endDate').val($('#sameAmountVoucher_startDate').val());
		}
		if ($('#sameAmountVoucher_startDate').val() == '' && $('#sameAmountVoucher_endDate').val() != '') {
			$('#sameAmountVoucher_startDate').val($('#sameAmountVoucher_endDate').val());
		}
		if ($('#sameAmountVoucher_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#sameAmountVoucher_startDate').val() == '') {
			bdoInfoBox('提示', '请选择凭证开始日期');
			return;
		}
		if ($('#sameAmountVoucher_endDate').val() == '') {
			bdoInfoBox('提示', '请选择凭证结束日期');
			return;
		}
		if ($('#sameAmountVoucher_startDate').val() > $('#sameAmountVoucher_endDate').val()) {
			bdoInfoBox('提示', '凭证结束日期不能小于凭证开始日期');
			return;
		}
		// 账套过期时间
		getValidDate($('#sameAmountVoucher_customerId').val(), $('#sameAmountVoucher_yyyy').val(), 'validDate');
		var params = {
			'menuId': window.sys_menuId,
			'lockProjectId': $('#sameAmountVoucher_customerId').val(),
			'lockYyyy': $('#sameAmountVoucher_yyyy').val(),
			param1: '3',
			start: -1,
			limit: -1,
			jsonData: JSON.stringify({
				startDate: $('#sameAmountVoucher_startDate').val(),
				endDate: $('#sameAmountVoucher_endDate').val(),
				isInclude: $('#sameAmountVoucher_isInclude').val(),
				subjectId: $('#sameAmountVoucher_subjectId').val(),
				typeId: $('#sameAmountVoucher_typeId').val(),
				voucherId: $('#sameAmountVoucher_voucherId').val(),
				summaryType: $('#sameAmountVoucher_summary_type').val(),
				summary: $('#sameAmountVoucher_summary').val(),
				moneyType: $('#sameAmountVoucher_moneyType').val(),
				moneyOpt: $('#sameAmountVoucher_moneyOpt').val(),
				money: $('#sameAmountVoucher_money').val(),
				voucherType: $('#sameAmountVoucher_vouchartype').val()
			})
		};
		querySameVoucher(params, 'sameAmountVoucher');
		/*$('#voucher_tab').on('xhr.dt', function (e, settings, json, xhr) {
			if (json.recordsTotal > 0) {
				$('#voucher_export').css('display', 'block');
				$('#account_export_dg').css('display', 'block');
			} else {
				$('#voucher_export').css('display', 'none');
				$('#account_export_dg').css('display', 'none');
			}
		});*/
	});

	/** 搜索按钮 */
	$('#hedgeVoucher_search').click(function () {
		if ($('#hedgeVoucher_endDate').val() == '' && $('#hedgeVoucher_startDate').val() != '') {
			$('#hedgeVoucher_endDate').val($('#hedgeVoucher_startDate').val());
		}
		if ($('#hedgeVoucher_startDate').val() == '' && $('#hedgeVoucher_endDate').val() != '') {
			$('#hedgeVoucher_startDate').val($('#hedgeVoucher_endDate').val());
		}
		if ($('#hedgeVoucher_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#hedgeVoucher_startDate').val() == '') {
			bdoInfoBox('提示', '请选择凭证开始日期');
			return;
		}
		if ($('#hedgeVoucher_endDate').val() == '') {
			bdoInfoBox('提示', '请选择凭证结束日期');
			return;
		}
		if ($('#hedgeVoucher_startDate').val() > $('#hedgeVoucher_endDate').val()) {
			bdoInfoBox('提示', '凭证结束日期不能小于凭证开始日期');
			return;
		}
		// 账套过期时间
		getValidDate($('#hedgeVoucher_customerId').val(), $('#hedgeVoucher_yyyy').val(), 'validDate');
		var params = {
			'menuId': window.sys_menuId,
			'lockProjectId': $('#hedgeVoucher_customerId').val(),
			'lockYyyy': $('#hedgeVoucher_yyyy').val(),
			param1: '2',
			start: -1,
			limit: -1,
			jsonData: JSON.stringify({
				startDate: $('#hedgeVoucher_startDate').val(),
				endDate: $('#hedgeVoucher_endDate').val(),
				isInclude: $('#hedgeVoucher_isInclude').val(),
				subjectId: $('#hedgeVoucher_subjectId').val(),
				typeId: $('#hedgeVoucher_typeId').val(),
				voucherId: $('#hedgeVoucher_voucherId').val(),
				summaryType: $('#hedgeVoucher_summary_type').val(),
				summary: $('#hedgeVoucher_summary').val(),
				moneyType: $('#hedgeVoucher_moneyType').val(),
				moneyOpt: $('#hedgeVoucher_moneyOpt').val(),
				money: $('#hedgeVoucher_money').val(),
				voucherType: $('#hedgeVoucher_vouchartype').val()
			})
		};
		querySameVoucher(params, 'hedgeVoucher');
		/*$('#voucher_tab').on('xhr.dt', function (e, settings, json, xhr) {
			if (json.recordsTotal > 0) {
				$('#voucher_export').css('display', 'block');
				$('#account_export_dg').css('display', 'block');
			} else {
				$('#voucher_export').css('display', 'none');
				$('#account_export_dg').css('display', 'none');
			}
		});*/
	});
	/** 单元格点击事件 */
	$('#sameVoucher_table,#sameAmountVoucher_table,#hedgeVoucher_table').on('click', 'td', function () {
		var _id = $(this).closest('table').attr('id');
		var data = $(this).text();
		if (!$(this).hasClass('can-calculate') || data == '') {
			return;
		}
		if ($('#suanshi_' + _id).val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_' + _id).val('(' + data + ')');
			} else {
				$('#suanshi_' + _id).val(data);
			}
			$('#jieguo_' + _id).val(data);
		} else {
			value = $('#suanshi_' + _id).val();
			jieguo = $('#jieguo_' + _id).val();
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
				$('#suanshi_' + _id).val(value + '+(' + data + ')');
			} else {
				$('#suanshi_' + _id).val(value + '+' + data);
			}
			$('#jieguo_' + _id).val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 相同凭证查询
	$('#sameVoucher_loadImg').hide();
	$('#sameAmountVoucher_loadImg').hide();
	$('#hedgeVoucher_loadImg').hide();
	var querySameVoucher = function (params, tableId) {
		$('#' + tableId + '_table').html('');
		$('#' + tableId + '_table_title').html('');
		$('#' + tableId + '_loadImg').show();
		// 表头
		var th = '<thead><tr>' +
			'<th style="width: 2%;"></th>' +
			'<th style="width: 15%;">科目</th>' +
			'<th class="text-right" style="width: 13%;">借方金额</th>' +
			'<th class="text-right" style="width: 13%;">贷方金额</th>' +
			'<th style="width: 6%;">凭证数量</th>' +
			'<th style="width: 6%;">凭证日期</th>' +
			'<th style="width: 45%;"></th>' +
			'</tr></thead> ';
		var th2 = '<thead><tr style="height: 0px;">' +
		'<th style="width: 2%;padding-top: 0px;padding-bottom: 0px;border-top-width: 0px;border-bottom-width: 0px;height: 0px;"></th>' +
		'<th style="width: 15%;padding-top: 0px;padding-bottom: 0px;border-top-width: 0px;border-bottom-width: 0px;height: 0px;"></th>' +
		'<th class="text-right" style="width: 13%;padding-top: 0px;padding-bottom: 0px;border-top-width: 0px;border-bottom-width: 0px;height: 0px;"></th>' +
		'<th class="text-right" style="width: 13%;padding-top: 0px;padding-bottom: 0px;border-top-width: 0px;border-bottom-width: 0px;height: 0px;"></th>' +
		'<th style="width: 6%;padding-top: 0px;padding-bottom: 0px;border-top-width: 0px;border-bottom-width: 0px;height: 0px;"></th>' +
		'<th style="width: 6%;padding-top: 0px;padding-bottom: 0px;border-top-width: 0px;border-bottom-width: 0px;height: 0px;"></th>' +
		'<th style="width: 43.8%;padding-top: 0px;padding-bottom: 0px;border-top-width: 0px;border-bottom-width: 0px;height: 0px;"></th>' +
		'</tr></thead> ';
		$('#' + tableId + '_table').append(th2);
		$('#' + tableId + '_table_title').append(th);
		// 一级科目+多借多贷+同借同贷
		$.ajax({
			type: 'post',
			url: 'finCenter/SubjectEntry.getGroupVoucherList.json',
			data: params,
			dataType: 'json',
			bdolxLoader: false,
			success: function (data) {
				if (data.resultInfo.status == 3) {
					bdoErrorBox('系统错误', data.resultInfo.statusText);
					$('#' + tableId + '_loadImg').hide();
					$('#' + tableId + '_table').append('<tr class="odd"><td valign="top" colspan="10" class="dataTables_empty">抱歉， 没有找到你想要的数据</td></tr>');
					return;
				}
				if (data.data == null) {
					$('#' + tableId + '_loadImg').hide();
					$('#' + tableId + '_table').append('<tr class="odd"><td valign="top" colspan="10" class="dataTables_empty">抱歉， 没有找到你想要的数据</td></tr>');
					return;
				}
				if (data.data && data.data.length == 0) {
					$('#' + tableId + '_loadImg').hide();
					$('#' + tableId + '_table').append('<tr class="odd"><td valign="top" colspan="10" class="dataTables_empty">抱歉， 没有找到你想要的数据</td></tr>');
					return;
				}
				jsqsamevoucher(tableId + '_table');
				// 计算器重置
				$('#jsq_clear_' + tableId + '_table').unbind();
				$('#jsq_clear_' + tableId + '_table').on('click', function () {
					$('#suanshi_' + tableId + '_table').val('');
					$('#jieguo_' + tableId + '_table').val('');
				});
				$('#' + tableId + '_table_count').html('').append('共 <b>' + data.data.length + '</b>条');
				$.each(data.data, function (idx, obj) {
					var rows = '';
					rows = '<tbody><tr>'
						+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowDetail" data-placement="top" title="明细" data-toggle="tooltip"></li></td>'
						+ '<td><span name="groupNo">分组号：' + prefixInteger(idx + 1, 4) + '</span></td>'
						// + '<td><span name="oneSubjectId"><div title="' + '借:' + obj.debitSubjects + ',贷:' + obj.creditSubjects + '" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 300px;">' + '借:' + obj.debitSubjects + '贷:' + obj.debitSubjects + '</div></span></td>'
						+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.debitOcc) + '</span></td>'
						+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.creditOcc) + '</span></td>'
						//+ '<td><span>' + obj.voucherNum + '</span></td>'
						//+ '<td><span>' + obj.vchDateNum + '</span></td>'
						+ '<td><a href="#" name="showVoucherDetail">' + obj.voucherNum + '</a></td>'
						+ '<td><a href="#" name="showVoucherDateNum">' + obj.vchDateNum + '</a></td>'
						+ '<td><span>' + '' + '</span></td>'
						+ '<td style="display: none;"><span name="vchMonthNum">' + obj.vchMonthNum + '</span></td>'
						+ '<td style="display: none;"><span name="groupId">' + obj.groupId + '</span></td>'
						+ '<td style="display: none;"><span name="voucherId">' + obj.voucherId + '</span></td>'
						+ '</tr></tbody>';

					$('#' + tableId + '_table').append(rows);
					if(idx == 0){
						/*$('#' + tableId + '_table_title').append(rows);
						$('#' + tableId + '_table_title').find('tbody tr').css('height','0px');*/
					}
					$('#' + tableId + '_loadImg').hide();
				});
				$('#' + tableId + '_table').append('</div>');
				// 展开
				$('#' + tableId + '_table').off('click', '[name=rowShowDetail]');
				$('#' + tableId + '_table').on('click', '[name=rowShowDetail]', function () {
					var voucherId = $(this).parents('tbody').find('[name=voucherId]').html();
					var vchMonthNum = $(this).parents('tbody').find('[name=vchMonthNum]').html();
					var groupId = $(this).parents('tbody').find('[name=groupId]').html();
					var tThis = $(this);
					if ($('#' + tableId + '_table').find('[name^="' + groupId + '"][name$="yb"]').length != 0) {
						$('#' + tableId + '_table').find('[name^="' + groupId + '"][name$="yb"]').remove();
						tThis.removeClass('fa-minus-square-o');
						tThis.addClass('fa-plus-square-o');
						tThis.parents('tbody').removeClass('js-table-sections-header');
						tThis.parents('tbody').removeClass('open');
						return;
					} else {
						tThis.parents('tbody').append('<tr id="' + tableId + '_loadImg" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
					}
					$.ajax({
						type: 'post',
						url: 'finCenter/SubjectEntry.getGroupVoucherDetail.json',
						data: {
							'menuId': window.sys_menuId,
							'lockProjectId': params.lockProjectId,
							'lockYyyy': params.lockYyyy,
							'param1': voucherId,
							'param2': '1'
						},
						dataType: 'json',
						success: function (data) {
							var rows = '<tbody name="' + groupId + 'yb" style="color:#426ab3;">';
							$.each(data.data, function (idx, obj) {
								rows += '<tr>'
									+ '<td></td>'
									+ '<td><span name="oneSubjectId" style="padding-left:' + 5 + 'px;">' + obj.subjectId + '-' + obj.subjectName + '</span></td>'
									+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.debitOcc) + '</span></td>'
									+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.crebitOcc) + '</span></td>'
									+ '<td><span></span></td>'
									+ '<td><span></span></td>';
									if(idx == 0){
										rows += '<td rowspan="' + data.data.length + '"><div id="' + tableId + 'Charts' + groupId + '"></div></td>';
									}
									rows += '</tr>';
							});
							rows += '</tbody>';
							tThis.removeClass('fa-plus-square-o');
							tThis.addClass('fa-minus-square-o');
							tThis.parents('tbody').after(rows);
							tThis.parents('tbody').addClass('js-table-sections-header');
							tThis.parents('tbody').addClass('open');
							tThis.parents('tbody').find('#' + tableId + '_loadImg').remove();
							chartsSameVoucher(vchMonthNum, '#' + tableId + 'Charts' + groupId, "chartsBar" + tableId + groupId);
						}
					});
				});
				// 明细
				$('#' + tableId + '_table').off('click', '[name=showVoucherDetail]');
				$('#' + tableId + '_table').on('click', '[name=showVoucherDetail]', function () {
					var voucherId = $(this).parents('tbody').find('[name=voucherId]').html();
					var groupNo = $(this).parents('tbody').find('[name=groupNo]').html();
					voucherDetail_view.tableParam = voucherDetailCol();
					voucherDetail_view.localParam.urlparam.lockProjectId = params.lockProjectId;
					voucherDetail_view.localParam.urlparam.lockYyyy = params.lockYyyy;
					voucherDetail_view.localParam.urlparam.param1 = voucherId;
					voucherDetail_view.localParam.urlparam.param2 = '0';
					BdoDataTable('modal_voucher_detail_table', voucherDetail_view);
					//$('#modal_voucher_detail').modal('show');
					$('#modal_voucher_detail_export').off();
					$('#modal_voucher_detail_export').on('click', function () {
						exportExcelFin(this, '分录详细', voucherDetail_view, 'modal_voucher_detail_export');
					});
					// 如果tab存在先清除
					//clearVoucherTab('tab_modal_same_voucher');
					//clearVoucherTab('tab_modal_same_voucher_date');
					//$('#tab_modal_same_voucher a[href="#tab_same_voucher_entry"]').click();
					$('#tab_voucher a[href="#tab_groupDetail"]').click();
					$('#tab_voucher a[href="#tab_groupDetail"]').css('display', 'block');
					var tabName = '';
					if(tableId == 'sameVoucher'){
						tabName = '相同凭证';
					}else if(tableId == 'sameAmountVoucher'){
						tabName = '同金额凭证';
					}else if(tableId == 'hedgeVoucher'){
						tabName = '对冲凭证';
					}
					$('#groupDetailTitle').html('&emsp;' + tabName + '&emsp;' + groupNo);
					/** 行双击 */
					$('#modal_voucher_detail_table').off();
					$('#modal_voucher_detail_table tbody').on('dblclick', 'tr', function() {
						var object = $('#modal_voucher_detail_table').DataTable().row(this).data();
						voucherTab('tab_voucher', params.lockProjectId, object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
					});
				});
				// 日期
				$('#' + tableId + '_table').off('click', '[name=showVoucherDateNum]');
				$('#' + tableId + '_table').on('click', '[name=showVoucherDateNum]', function () {
					var voucherId = $(this).parents('tbody').find('[name=voucherId]').html();
					voucherDateNum_view.tableParam = voucherDateNumCol();
					voucherDateNum_view.localParam.urlparam.lockProjectId = params.lockProjectId;
					voucherDateNum_view.localParam.urlparam.lockYyyy = params.lockYyyy;
					voucherDateNum_view.localParam.urlparam.param1 = voucherId;
					BdoDataTable('modal_voucher_date_table', voucherDateNum_view);
					$('#modal_voucher_date').modal('show');
					// 如果tab存在先清除
					//clearVoucherTab('tab_modal_same_voucher');
					//clearVoucherTab('tab_modal_same_voucher_date');
					//$('#tab_modal_same_voucher_date a[href="#tab_same_voucher_date_entry"]').click();
					$('#tab_voucher a[href="#tab_groupDate"]').click();
					$('#tab_voucher a[href="#tab_groupDate"]').css('display', 'block');
					/** 行双击 */
					$('#modal_voucher_date_table').off();
					$('#modal_voucher_date_table tbody').on('dblclick', 'tr', function() {
						var object = $('#modal_voucher_date_table').DataTable().row(this).data();
						voucherTab('tab_voucher', params.lockProjectId, object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
					});
				});
			}
		});
	};
	// 柱状图
	var chartsSameVoucher = function (vchMonthNum, chartsId, childChartId) {
		var doc = $(chartsId);
		doc.empty();
		var seriesData = [];
		var legendData = [];
		let option = {
			title: {
				text: '分月数量'
			},
			tooltip : {
				trigger: 'axis'
			},
			grid: {
				left: '3%',
				right: '3%',
				bottom: '3%',
				containLabel: true
			},
			legend: {
				x: '50',
				data: [],
				y: '10%'
			},
			toolbox: {
				show: true,
				feature: {
					restore: {show: true}
				}
			},
			xAxis : [
				{
					type : 'category',
					data : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
				}
			],
			yAxis : {
				minInterval: 1,
				type : 'value',
				axisLabel: {
                    show: true,  
                    interval: 'auto'
                }
			},
			series : [
				{
					name:'',
					type:'bar',
					barWidth: '60%',
					data:[]
				}
			]
		};
		var monthData = JSON.parse(vchMonthNum);
		let tempData = [];
		for(var j=1;j<13;j++){
			tempData.push(monthData[j]);
		}
		var tmpSeries = {
			name: '凭证数量',
			type: 'bar',
			data: tempData,
		};
		seriesData.push(tmpSeries);
		//legendData.push('aaa');
		option.series = seriesData;
		//option.legend.data = legendData;
		doc.append('<div id="' + childChartId + '" data-height="250" style="height: 200px"></div>')
		let dom = document.getElementById(childChartId);
		let myChart = echarts.init(dom);

		if (option && typeof option === "object") {
			myChart.setOption(option, true);
		}

	}
	// 补0
	function prefixInteger(num, n) { 
		if ((num + "").length >= n) return num; 
		return prefixInteger("0" + num, n); 
	}
	/** 导出 */
	$('#sameVoucher_export').click(function () {
		voucherExport_view.tableParam = voucherExportCol();
		voucherExport_view.localParam.urlparam.lockProjectId = $('#sameVoucher_customerId').val();
		voucherExport_view.localParam.urlparam.lockYyyy = $('#sameVoucher_yyyy').val();
		voucherExport_view.localParam.urlparam.param1 = '1';
		exportExcelFin(this, '相同凭证一览', voucherExport_view, 'sameVoucher_table');
	});
	/** 导出 */
	$('#sameAmountVoucher_export').click(function () {
		voucherExport_view.tableParam = voucherExportCol();
		voucherExport_view.localParam.urlparam.lockProjectId = $('#sameAmountVoucher_customerId').val();
		voucherExport_view.localParam.urlparam.lockYyyy = $('#sameAmountVoucher_yyyy').val();
		voucherExport_view.localParam.urlparam.param1 = '3';
		exportExcelFin(this, '同金额凭证一览', voucherExport_view, 'sameAmountVoucher_table');
	});
	/** 导出 */
	$('#hedgeVoucher_export').click(function () {
		voucherExport_view.tableParam = voucherExportCol();
		voucherExport_view.localParam.urlparam.lockProjectId = $('#hedgeVoucher_customerId').val();
		voucherExport_view.localParam.urlparam.lockYyyy = $('#hedgeVoucher_yyyy').val();
		voucherExport_view.localParam.urlparam.param1 = '2';
		exportExcelFin(this, '对冲凭证一览', voucherExport_view, 'hedgeVoucher_table');
	});
	/** 分录详细 */
	$('#tab_voucher a[href="#tab_groupDetail"]').find('.fa-times-circle').click(function() {
		$('#tab_voucher a[href="#tab_groupDetail"]').css('display', 'none');
		setTimeout(function() {
			$('#tab_voucher a[href="#tab_voucherser"]').click();
		}, 300);
	});
	/** 日期详细 */
	$('#tab_voucher a[href="#tab_groupDate"]').find('.fa-times-circle').click(function() {
		$('#tab_voucher a[href="#tab_groupDate"]').css('display', 'none');
		setTimeout(function() {
			$('#tab_voucher a[href="#tab_voucherser"]').click();
		}, 300);
	});
});