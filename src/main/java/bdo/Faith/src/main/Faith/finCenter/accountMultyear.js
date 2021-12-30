$(document).ready(function () {
	uiBlocksApi(false, 'init');
	/** 模态框设置 */
	$($('main .content')[1]).css('min-height', 480 + 'px');

	/** 加载 树 下拉框 */
	getUserCustomers('accountmul_customerId');
	getUserCustomers('accountmul_customerId_model');

	$('#accountmul_start, #accountmul_end').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN',
		format: 'yyyy-mm',
		minViewMode: 1
	});

	$('#accountmul_subjectlevel').html(ComboLocalDicOption(false, '科目级别'));

	$('#accountmul_singlelevel').html(ComboLocalDicOption(false, 'boolean'));

	$('#accountmul_monthType').html(ComboLocalDicOption(true, '分月模式'));

	$('#accountmul_amountType').html(ComboLocalDicOption(true, '金额类型'));

	let startyear = window.CUR_PROJECT_START_YEAR;
	let startmonth = window.CUR_PROJECT_START_MONTH; // 1
	let endyear = window.CUR_PROJECT_END_YEAR; // 2018
	let endmonth = window.CUR_PROJECT_END_MONTH; // 12
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	if (!endyear || endyear == '') {
		endyear = new Date().getFullYear();
	}
	if (!startmonth || startmonth == '') {
		startmonth = '01';
	}
	if (!endmonth || endmonth == '') {
		endmonth = '12';
	}
	if (startmonth < 10) {
		startmonth = '0' + parseInt(startmonth);
	}
	if (endmonth < 10) {
		endmonth = '0' + parseInt(endmonth);
	}
	$('#accountmul_start').val(startyear + '-' + startmonth);
	$('#accountmul_end').val(endyear + '-' + endmonth);

	// 多年余额表table
	var accountmul_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/Account.queryFinAccountMultiple.json',
			urlparam: {
				menuId: window.sys_menuId,
				lockProjectId: '',
				lockYyyy: ''
			}
		},
		tableParam: {}
	};

	/** 搜索按钮 */
	$('#accountmul_search').click(function () {
		$(this).parents('.block').next('.block').find('span[name="cus_select"]').text('【' + $('#accountmul_customerId option:selected').text() + '】');
		if ($('#accountmul_customerId').val() == '') {
			$('#accountmul_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#accountmul_start').val() == '') {
			$('#accountmul_start').focus();
			bdoInfoBox('提示', '请选择开始年月');
			return;
		}
		if ($('#accountmul_end').val() == '') {
			$('#accountmul_end').focus();
			bdoInfoBox('提示', '请选择结束年月');
			return;
		}
		if ($('#accountmul_start').val() > $('#accountmul_end').val()) {
			$('#accountmul_start').focus();
			bdoInfoBox('提示', '结束账套年月不能小于开始账套年月');
			return;
		}
		// 账套过期时间
		getValidDate($('#accountmul_customerId').val(), $('#accountmul_start').val(), 'validDate');
		accountmul_view.tableParam = accmulCol();
		accountmul_view.localParam.urlparam.jsonData = getAccmulparam();
		accountmul_view.localParam.urlparam.lockProjectId = $('#accountmul_customerId').val();
		accountmul_view.localParam.urlparam.lockYyyy = $('#accountmul_start').val().split('-')[0];
		jsq(accountmul_view.tableParam, 'accountmul_table');
		BdoDataTable('accountmul_table', accountmul_view);

		$('#accountmul_table').on('xhr.dt', function (e, settings, json, xhr) {
			tableId = 'accountmul_table';
			if (json.recordsTotal > 0) {
				$('#accountmul_export').css('display', 'block');
				$('#account_export_dg').css('display', 'block');
			} else {
				$('#accountmul_export').css('display', 'none');
				$('#account_export_dg').css('display', 'none');
			}

		});
	});

	/** 单元格点击事件 */
	$('#accountmul_table').on('click', 'td', function () {

		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_accountmul_table').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_accountmul_table').val('(' + data + ')');
			} else {
				$('#suanshi_accountmul_table').val(data);
			}
			$('#jieguo_accountmul_table').val(data);
		} else {
			value = $('#suanshi_accountmul_table').val();
			jieguo = $('#jieguo_accountmul_table').val();
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
				$('#suanshi_accountmul_table').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_accountmul_table').val(value + '+' + data);
			}
			$('#jieguo_accountmul_table').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 计算器重置
	$('#jsq_clear_accountmul_table').on('click', function () {

		$('#suanshi_accountmul_table').val('');
		$('#jieguo_accountmul_table').val('');
	});

	/** 导出 */
	$('#accountmul_export').click(function () {
		exportExcelFin(this, '多年余额表一览', accountmul_view, 'accountmul_table');
	});
	/** 导出到底稿附件 打开Tb附件框 */
	$('#account_export_dg').click(function () {

		var customerId = $('#accountmul_customerId').val();
		var customername = $('#accountmul_customerId option:selected').text();
		ecportToDg(customerId, customername, accountmul_view);

	});

	function onExport(event) {
		let data = huoqunode();
		if (data) {
			data.title = '多年余额表一览';
			data.view = accountmul_view;
			data.table = 'accountmul_table';
			data.customerId = $('#accountmul_customerId').val();
			exportExcelTo(this, data);
		} else {

		}
	}

	/* 导出到底稿附件 */
	$('#modal_tbsubjectid_sure').click(onExport);
	// 年度改变科目树更新
	$('#accountmul_start').change(function () {
		if ($('#subject_tree').hasClass('treeview')) {
			$('#subject_tree').tree('reset');
			$('#subject_tree').tree('destory');
		}
	});
	$('#accountmul_end').change(function () {
		if ($('#subject_tree').hasClass('treeview')) {
			$('#subject_tree').tree('reset');
			$('#subject_tree').tree('destory');
		}
	});

	function getAccmulparam() {

		return JSON.stringify({
			endYear: $('#accountmul_end').val().split('-')[0],
			startMonth: $('#accountmul_start').val().split('-')[1],
			endMonth: $('#accountmul_end').val().split('-')[1],
			subjectId: $('#accountmul_subjectid').val(),
			subjectLevel: $('#accountmul_subjectlevel').val(),
			singleLevel: $('#accountmul_singlelevel').val(),
			monthType: $('#accountmul_monthType').val(),
			amountType: $('#accountmul_amountType').val()
		});
	}

	// 选择科目
	$('#accountmul_subjectid').focus(function () {
		if ($('#accountmul_customerId').val() == '') {
			$('#accountmul_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#accountmul_start').val() == '') {
			$('#accountmul_start').focus();
			bdoInfoBox('提示', '请选择开始年月');
			return;
		}
		if ($('#accountmul_end').val() == '') {
			$('#accountmul_end').focus();
			bdoInfoBox('提示', '请选择结束年月');
			return;
		}
		$('#modal_subjectid').modal('show');
		if ($('#subject_tree').hasClass('treeview')) {
			return;
		}
		$('#subject_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#accountmul_customerId').val(),
				lockYyyy: $('#accountmul_start').val().substr(0, 4),
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
			/*
			 * lazyLoad : false, view : { leafIcon: 'fa fa-building text-flat',
			 * nodeIcon: 'fa fa-bank text-primary-light', folderSelectable: false,
			 * multiSelect: false, showCheckbox: true, selectedColor: '',
			 * selectedBackColor: '' }
			 */
		});
	});
	$('#modal_subjectid_sure').click(function () {
		if (typeof ($('#subject_tree').tree('getTreeMultiValue')) == 'object') {
			$('#accountmul_subjectid').val('');
		} else {
			$('#accountmul_subjectid').val($('#subject_tree').tree('getTreeMultiValue'));
		}
		$('#modal_subjectid').modal('hide');
	});
	$('#modal_subjectid_reset').click(function () {
		$('#subject_tree').tree('reset');
	});

	function accmulCol() {
		var monthType = $('#accountmul_monthType').val();
		var amountType = $('#accountmul_amountType').val();
		var startYear = parseInt($('#accountmul_start').val().split('-')[0]);
		var endYear = parseInt($('#accountmul_end').val().split('-')[0]);
		var startMonth = parseInt($('#accountmul_start').val().split('-')[1]);
		var endMonth = parseInt($('#accountmul_end').val().split('-')[1]);
		var tabCol_index = 1;
		var tabCol = {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: true,
			order: ['1', 'asc'],
			serverSide: true,
			fixedThead: true,
			fixedHeight: '500px',
			columnDefs: [{
				targets: tabCol_index++,
				className: 'text-left',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '100px'
			}, {
				targets: tabCol_index++,
				className: 'text-left',
				title: '科目名称',
				name: 'fullName',
				data: 'fullName',
				width: '250px'
			}, {
				targets: tabCol_index++,
				className: 'text-center',
				title: '科目方向',
				name: 'direction',
				data: 'direction',
				width: '30px'
			}]
		};
		tabCol.param1 = 'jsq';
		if (startYear == endYear) {
			if (monthType == '') {
				tabCol.columnDefs.push({
					targets: tabCol_index++,
					className: 'text-right',
					title: '期初余额',
					name: 'remain',
					data: 'remain',
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: tabCol_index++,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitOcc',
					data: 'debitOcc',
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: tabCol_index++,
					className: 'text-right',
					title: '贷方发生额',
					name: 'creditOcc',
					data: 'creditOcc',
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: tabCol_index++,
					className: 'text-right',
					title: '期末余额',
					name: 'balance',
					data: 'balance',
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				});
			} else {
				for (var i = startMonth; i <= endMonth; i++) {
					tabCol.columnDefs.push({
						targets: tabCol_index++,
						className: 'text-right',
						title: startYear + '年' + i + '月',
						name: 'month_' + startYear + '_' + +i,
						data: 'month_' + startYear + '_' + +i,
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					});
				}
			}
		} else if (startYear < endYear) {
			if (monthType == '') {
				if (amountType == '') {
					for (var i = startYear; i <= endYear; i++) {
						if (i == startYear) {
							tabCol.columnDefs.push({
								targets: tabCol_index++,
								className: 'text-right',
								title: i + '年<br>期初余额',
								name: 'remain_' + i,
								data: 'remain_' + i,
								width: '100px',
								render: function (data, type, row, meta) {
									return formatMoney(data);
								}
							});
						}
						tabCol.columnDefs.push({
							targets: tabCol_index++,
							className: 'text-right',
							title: i + '年<br>借方发生额',
							name: 'debitOcc_' + i,
							data: 'debitOcc_' + i,
							width: '100px',
							render: function (data, type, row, meta) {
								return formatMoney(data);
							}
						}, {
							targets: tabCol_index++,
							className: 'text-right',
							title: i + '年<br>贷方发生额',
							name: 'creditOcc_' + i,
							data: 'creditOcc_' + i,
							width: '100px',
							render: function (data, type, row, meta) {
								return formatMoney(data);
							}
						}, {
							targets: tabCol_index++,
							className: 'text-right',
							title: i + '年<br>期末余额',
							name: 'balance_' + i,
							data: 'balance_' + i,
							width: '100px',
							render: function (data, type, row, meta) {
								return formatMoney(data);
							}
						});
					}
				} else {
					for (var i = startYear; i <= endYear; i++) {
						if (i == startYear) {
							tabCol.columnDefs.push({
								targets: tabCol_index++,
								className: 'text-right',
								title: i + '年',
								name: 'month_' + i,
								data: 'month_' + i,
								width: '100px',
								render: function (data, type, row, meta) {
									return formatMoney(data);
								}
							});
						} else {
							tabCol.columnDefs.push({
								targets: tabCol_index++,
								className: 'text-right',
								title: i + '年',
								name: 'month_' + i,
								data: 'month_' + i,
								width: '100px',
								render: function (data, type, row, meta) {
									return formatMoney(data);
								}
							}, {
								targets: tabCol_index++,
								className: 'text-right',
								title: (i - 1) + '-' + i + '<br>差值',
								name: 'diff_' + i,
								data: 'diff_' + i,
								width: '100px',
								render: function (data, type, row, meta) {
									return formatMoney(data);
								}
							}, {
								targets: tabCol_index++,
								className: 'text-right',
								title: (i - 1) + '-' + i + '<br>差值(﹪)',
								name: 'rate_' + i,
								data: 'rate_' + i,
								width: '100px',
								render: function (data, type, row, meta) {
									if (data < 0) {
										return '<font color="red">' + (data * 100).toFixed(2) + '%</font>';
									} else if (data > 0) {
										return '<font color="green">' + (data * 100).toFixed(2) + '%</font>';
									} else if (data == 0) {
										return '0';
									} else {
										return '';
									}
								}
							});
						}
					}
				}
			} else {
				for (var i = startYear; i <= endYear; i++) {
					if (i == startYear) {
						for (var j = startMonth; j <= 12; j++) {
							tabCol.columnDefs.push({
								targets: tabCol_index++,
								className: 'text-right',
								title: i + '年' + j + '月',
								name: 'month_' + i + '_' + j,
								data: 'month_' + i + '_' + j,
								width: '100px',
								render: function (data, type, row, meta) {
									return formatMoney(data);
								}
							});
						}
					} else if (i == endYear) {
						for (var j = 1; j <= endMonth; j++) {
							tabCol.columnDefs.push({
								targets: tabCol_index++,
								className: 'text-right',
								title: i + '年' + j + '月',
								name: 'month_' + i + '_' + j,
								data: 'month_' + i + '_' + j,
								width: '100px',
								render: function (data, type, row, meta) {
									return formatMoney(data);
								}
							});
						}
					} else {
						for (var j = 1; j <= 12; j++) {
							tabCol.columnDefs.push({
								targets: tabCol_index++,
								className: 'text-right',
								title: i + '年' + j + '月',
								name: 'month_' + i + '_' + j,
								data: 'month_' + i + '_' + j,
								width: '100px',
								render: function (data, type, row, meta) {
									return formatMoney(data);
								}
							});
						}
					}
				}
			}
		} else {
			alert('error');
		}
		return tabCol;
	}
});