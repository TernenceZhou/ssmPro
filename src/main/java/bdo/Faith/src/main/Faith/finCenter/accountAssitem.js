//pageRightTitle(pageTitleArr);
$(document).ready(function () {
	var table = 'accountass_table';
	uiBlocksApi(false, 'init');
	/*$('[data-toggle="tabs"]').on('click', 'a', function(e){
		e.preventDefault();
		$(this).tab('show');
		//$(document).resize();
	});*/
	/** 模态框设置 */
	/*$('.modal').on('show.bs.modal', function(){
		$(this).draggable({
			handle: '.block-header',
			cursor: 'move'
		});
		$(this).css('overflow', 'hidden');
	});*/

	/** 加载 树 下拉框 */
	// 客户 日期
	getUserCustomers('accountass_customerId');
	//getUserYear('accountass_year');
	//getUserLocalYear('accountass_year');

	$('#accountass_year').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy', //日期显示格式
		minViewMode: 2
	});


	//$('#accountass_monthtype').html(ComboDicOption(true, '分月模式'));
	$('#accountass_monthtype').html(ComboLocalDicOption(true, '分月模式'));

	//$('#accountass_startmonth, #accountass_endmonth').html(ComboDicOption(false, 'month'));
	$('#accountass_startmonth, #accountass_endmonth').html(ComboLocalDicOption(false, 'month'));

	//$('#accountass_othercurr').html(ComboDicOption(false, 'boolean'));
	$('#accountass_othercurr').html(ComboLocalDicOption(false, 'boolean'));


	//年度改变科目树更新
	$('#accountass_year').change(function () {
		if ($('#subject_tree').hasClass('treeview')) {
			$('#subject_tree').tree('reset');
			$('#subject_tree').tree('destory');
		}
		if ($('#assitem_tree').hasClass('treeview')) {
			$('#assitem_tree').tree2('reset');
			$('#assitem_tree').tree2('destory');
		}
	});
	$('#accountass_customerId').change(function () {
		if ($('#subject_tree').hasClass('treeview')) {
			$('#subject_tree').tree('reset');
			$('#subject_tree').tree('destory');
		}
		if ($('#assitem_tree').hasClass('treeview')) {
			$('#assitem_tree').tree2('reset');
			$('#assitem_tree').tree2('destory');
		}
	});
	/*$('#accountass_assitemid').focus(function() {

		if ($('#accountass_customerId').val() == '') {
			$('#accountass_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#accountass_year').val() == '') {
			$('#accountass_year').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}

		//判断是否是第一次加载，非第一次进这个方法
		if ($(this).attr('isTree') == '1') {
			$('#accountass_assitemid').removeAttr('istree');
			$('#accountass_assitemid').removeAttr('autocomplete');
			$('#accountass_assitemid').removeAttr('data-result');
			$('#accountass_assitemid').removeAttr('data-content');
			$('#accountass_assitemid').removeAttr('data-contentdata');
			$('span').remove('.caret');
		}

//	$('#accountass_assitemid').unbind();
		$('#accountass_assitemid').treecombo({
			url: 'finCenter/FinTreeCommon.findAssitemType.json',
			params: {
				lockProjectId: $('#accountass_customerId').val(),
				lockYyyy: $('#accountass_year').val(),
				param11: $('#accountass_subjectid').val()

			},
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: true,
				multiSelect: false
			}
		});
	});*/

	// 选择科目
	$('#accountass_assitemid').focus(function () {
		if ($('#accountass_customerId').val() == '') {
			$('#accountass_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#accountass_year').val() == '') {
			$('#accountass_year').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_assitemid').modal('show');
		if ($('#assitem_tree').hasClass('treeview')) {
			return;
		}
		$('#assitem_tree').tree2({
			url: 'finCenter/FinTreeCommon.findSubjectAssitem.json',
			params: {
				lockProjectId: $('#accountass_customerId').val(),
				lockYyyy: $('#accountass_year').val(),
				searchInputId: 'searchInputAssitem'
			},
			singleSelect: true,
			//lazyLoad: false,
			//onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}/*
		lazyLoad : false,
        view : {
            leafIcon: 'fa fa-building text-flat',
            nodeIcon: 'fa fa-bank text-primary-light',
            folderSelectable: false,
            multiSelect: false,
            showCheckbox: true,
            selectedColor: '',
            selectedBackColor: ''
        }*/
		});
	});
	$('#modal_assitemid_sure').click(function () {
		if (typeof ($('#assitem_tree').tree2('getTreeMultiValue')) == 'object') {
			$('#accountass_assitemid').val('');
		} else {
			$('#accountass_assitemid').val($('#assitem_tree').tree2('getTreeMultiValue'));
		}
		$('#modal_assitemid').modal('hide');
	});
	$('#modal_assitemid_reset').click(function () {
		$('#assitem_tree').tree2('reset');
		$('#searchInputAssitem').keyup();
	});

	/** 默认搜索条件 */
	$('#accountass_monthtype').val('');
	$('#accountass_startmonth').val('01');
	$('#accountass_endmonth').val('12');
	$('#accountass_othercurr').val('0');
	let startyear = window.CUR_PROJECT_START_YEAR;    //2018
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	$('#accountass_year').val(startyear);

	// 不分月
	var accountass_view1 = {
		localParam: {
			tabNum: true,
			url: 'finCenter/Account.getAccountAssitem.json',
			urlparam: {
				menuId: window.sys_menuId,
				jsonData: '',
				lockProjectId: '',
				lockYyyy: ''
			}
		},
		tableParam: {}
	};
	// 分月
	var accountass_view2 = {
		localParam: {
			tabNum: true,
			url: 'finCenter/Account.getAccountAssitem.json',
			urlparam: {
				menuId: window.sys_menuId,
				jsonData: '',
				lockProjectId: '',
				lockYyyy: ''
			}
		},
		tableParam: {}
	};

	/** 导出 */
	$('#assitemledage_export').click(function () {
		if ($('#accountass_monthtype').val() == '') {
			exportExcelFin(this, '科目分类账一览', accountass_view1, 'accountass_table');
		} else {
			exportExcelFin(this, '科目分类账一览', accountass_view2, 'accountass_table');
		}
	});


	/** 搜索按钮 */
	$('#accountass_search').click(function () {
		$(this).parents('.block').next('.block').find('span[name="cus_select"]').text('【' + $('#accountass_customerId option:selected').text() + '】');
		if ($('#accountass_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#accountass_year').val() == '') {
			$('#accountass_year').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		if ($('#accountass_startmonth').val() > $('#accountass_endmonth').val()) {
			$('#accountass_startmonth').focus();
			bdoInfoBox('提示', '结束月份不能小于开始月份');
			return;
		}
		if ($('#accountass_subjectid').val() == '' && $('#accountass_assitemid').val() == '') {
			bdoInfoBox('提示', '请选择科目或者核算类型');
			return;
		}
		// 账套过期时间
		getValidDate($('#accountass_customerId').val(), $('#accountass_year').val(), 'validDate');
		if ($('#accountass_monthtype').val() == '') {
			accountass_view1.tableParam = assCol();
			accountass_view1.localParam.urlparam.jsonData = getAccassparam();
			accountass_view1.localParam.urlparam.lockProjectId = $('#accountass_customerId').val();
			accountass_view1.localParam.urlparam.lockYyyy = $('#accountass_year').val();
			jsq(accountass_view1.tableParam, 'accountass_table');
			BdoDataTable('accountass_table', accountass_view1);
		} else {
			accountass_view2.tableParam = assmonthCol();
			accountass_view2.localParam.urlparam.jsonData = getAccassparam();
			accountass_view2.localParam.urlparam.lockProjectId = $('#accountass_customerId').val();
			accountass_view2.localParam.urlparam.lockYyyy = $('#accountass_year').val();
			jsq(accountass_view2.tableParam, 'accountass_table');
			BdoDataTable('accountass_table', accountass_view2);
		}
		$('#accountass_table').on('xhr.dt', function (e, settings, json, xhr) {

			if (json.recordsTotal > 0) {
				$('#accountass_export').css('display', 'block');
				$('#account_export_dg').css('display', 'block');
			} else {
				$('#accountass_export').css('display', 'nones');
				$('#account_export_dg').css('display', 'nones');
			}

		});
		/** 行双击 */
		$('#accountass_table tbody').on('dblclick', 'tr', function () {
			var object = $('#accountass_table').DataTable().data()[$(this).closest('tr').index()];
			assitemLedagerTab('tab_accountass', $('#accountass_customerId').val(), object.yyyy, object.subjectId, object.assItemId);
		});


	});

	/** 单元格点击事件 */
	$('#accountass_table').on('click', 'td', function () {

		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_accountass_table').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_accountass_table').val('(' + data + ')');
			} else {
				$('#suanshi_accountass_table').val(data);
			}
			$('#jieguo_accountass_table').val(data);
		} else {
			value = $('#suanshi_accountass_table').val();
			jieguo = $('#jieguo_accountass_table').val();
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
				$('#suanshi_accountass_table').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_accountass_table').val(value + '+' + data);
			}
			$('#jieguo_accountass_table').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	//计算器重置
	$('#jsq_clear_accountass_table').on('click', function () {

		$('#suanshi_accountass_table').val('');
		$('#jieguo_accountass_table').val('');
	});

	/** 导出 */
	$('#accountass_export').click(function () {
		if ($('#accountass_monthtype').val() == '') {
			exportExcelFin(this, '核算余额表一览', accountass_view1, 'accountass_table');
		} else {
			exportExcelFin(this, '核算余额表一览', accountass_view2, 'accountass_table');
		}
	});
	/** 导出到底稿附件  打开Tb附件框 */
	$('#account_export_dg').click(function () {

		var customerId = $('#accountass_customerId').val();
		var customername = $('#accountass_customerId option:selected').text();
		if ($('#accountass_monthtype').val() == '') {

			ecportToDg(customerId, customername, accountass_view1);
		} else {

			ecportToDg(customerId, customername, accountass_view2);
		}


	});

	function onExport(event) {
		let data = huoqunode();
		if (data) {
			data.title = '核算余额表一览';
			if ($('#accountass_monthtype').val() == '') {
				data.view = accountass_view1;
			} else {
				data.view = accountass_view2;
			}
			data.table = 'accountass_table';
			data.customerId = $('#accountass_customerId').val();
			exportExcelTo(this, data);
		} else {

		}
	}

	/*导出到底稿附件*/
	$('#modal_tbsubjectid_sure').click(onExport);

	/** 检索条件设置 */
	function getAccassparam() {
		return JSON.stringify({
			monthType: $('#accountass_monthtype').val(),
			startMonth: $('#accountass_startmonth').val(),
			endMonth: $('#accountass_endmonth').val(),
			subjectId: $('#accountass_subjectid').val(),
			otherCurr: $('#accountass_othercurr').val() == '1' ? '1' : '',
			assItemId: $('#accountass_assitemid').val()//attr('data-result') ? $('#accountass_assitemid').attr('data-result') : ''
		});
	}

	// 选择科目
	$('#accountass_subjectid').focus(function () {
		if ($('#accountass_customerId').val() == '') {
			$('#accountass_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#accountass_year').val() == '') {
			$('#accountass_year').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid').modal('show');
		if ($('#subject_tree').hasClass('treeview')) {
			return;
		}
		$('#subject_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#accountass_customerId').val(),
				lockYyyy: $('#accountass_year').val(),
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

			}/*
		lazyLoad : false,
        view : {
            leafIcon: 'fa fa-building text-flat',
            nodeIcon: 'fa fa-bank text-primary-light',
            folderSelectable: false,
            multiSelect: false,
            showCheckbox: true,
            selectedColor: '',
            selectedBackColor: ''
        }*/
		});
	});
	$('#modal_subjectid_sure').click(function () {
		if (typeof ($('#subject_tree').tree('getTreeMultiValue')) == 'object') {
			$('#accountass_subjectid').val('');
		} else {
			$('#accountass_subjectid').val($('#subject_tree').tree('getTreeMultiValue'));
		}
		$('#modal_subjectid').modal('hide');
	});
	$('#modal_subjectid_reset').click(function () {
		$('#subject_tree').tree('reset');
	});


	// 核算余额表 列
	function assCol() {
		var tableCol_index = 1;
		var tableCol = {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			fixedThead: true,
			fixedHeight: '500px',
			serverSide: true,
			columnDefs: [{
				targets: tableCol_index++,
				className: 'text-left',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '50px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '科目名称',
				name: 'subjectFullName',
				data: 'subjectFullName',
				width: '150px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '核算项目编号',
				name: 'assItemId',
				data: 'assItemId',
				width: '200px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '核算项目名称',
				name: 'fullName',
				data: 'fullName',
				width: '250px'
			}, {
				targets: tableCol_index++,
				className: 'text-center',
				title: '币种',
				name: 'currency',
				data: 'currency',
				width: '30px'
			}, {
				targets: tableCol_index++,
				className: 'text-center',
				title: '方向',
				name: 'direction',
				data: 'direction',
				width: '30px'
			}]
		};
		if ($('#accountass_othercurr').val() == '1') {
			tableCol.columnDefs.push({
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算期初余额<br>外币',
				name: 'remain',
				data: 'remain',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算期初余额<br>本位币',
				name: 'remainF',
				data: 'remainF',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算借方发生额<br>外币',
				name: 'debitOcc',
				data: 'debitOcc',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算借方发生额<br>本位币',
				name: 'debitOccF',
				data: 'debitOccF',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算贷方发生额<br>外币',
				name: 'creditOcc',
				data: 'creditOcc',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算贷方发生额<br>本位币',
				name: 'creditOccF',
				data: 'creditOccF',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算期末余额<br>外币',
				name: 'balance',
				data: 'balance',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算期末余额<br>本位币',
				name: 'balanceF',
				data: 'balanceF',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			});
		} else {
			tableCol.columnDefs.push({
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算期初余额',
				name: 'remainF',
				data: 'remainF',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算借方发生额',
				name: 'debitOccF',
				data: 'debitOccF',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算贷方发生额',
				name: 'creditOccF',
				data: 'creditOccF',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: tableCol_index++,
				className: 'text-right',
				title: '核算期末余额',
				name: 'balanceF',
				data: 'balanceF',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			});
		}
		tableCol.param1 = 'jsq';
		return tableCol;
	}

	// 核算余额表 列 分月模式
	function assmonthCol() {
		var tableCol_index = 1;
		var tableCol = {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			fixedThead: true,
			fixedHeight: '500px',
			serverSide: true,
			columnDefs: [{
				targets: tableCol_index++,
				className: 'text-left',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '50px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '科目名称',
				name: 'subjectFullName',
				data: 'subjectFullName',
				width: '150px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '核算项目编号',
				name: 'assItemId',
				data: 'assItemId',
				width: '200px'
			}, {
				targets: tableCol_index++,
				className: 'text-left',
				title: '核算项目名称',
				name: 'fullName',
				data: 'fullName',
				width: '250px'
			}, {
				targets: tableCol_index++,
				className: 'text-center',
				title: '币种',
				name: 'currency',
				data: 'currency',
				width: '30px'
			}, {
				targets: tableCol_index++,
				className: 'text-center',
				title: '方向',
				name: 'direction',
				data: 'direction',
				width: '30px'
			}]
		};
		if ($('#accountass_othercurr').val() == '1') {
			for (var i = parseInt($('#accountass_startmonth').val()); i <= parseInt($('#accountass_endmonth').val()); i++) {
				tableCol.columnDefs.push({
					targets: tableCol_index++,
					className: 'text-right',
					title: i + '月<br>外币',
					name: 'month' + i,
					data: 'month' + i,
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				});
				tableCol.columnDefs.push({
					targets: tableCol_index++,
					className: 'text-right',
					title: i + '月<br>本位币',
					name: 'monthF' + i,
					data: 'monthF' + i,
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				});
			}
		} else {
			for (var i = parseInt($('#accountass_startmonth').val()); i <= parseInt($('#accountass_endmonth').val()); i++) {
				tableCol.columnDefs.push({
					targets: tableCol_index++,
					className: 'text-right',
					title: i + '月',
					name: 'monthF' + i,
					data: 'monthF' + i,
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				});
			}
		}
		tableCol.param1 = 'jsq';
		return tableCol;
	}

});