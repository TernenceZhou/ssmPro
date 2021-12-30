$(function(){
	uiBlocksApi(false, 'init');
	getCustomerForImport('accountAllDiff_customerId');
	getCustomerForImport('accountAllDiff_customerId2');

	let startyear = window.CUR_PROJECT_START_YEAR;
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	$('#accountAllDiff_startDate').val(startyear);
	$('#accountAllDiff_startDate2').val(startyear);
	/** table 属性 */
	var accdetail_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {
				sqlId: 'FIN202003',
				menuId: window.sys_menuId,
				param3: $('#accountAllDiff_subjectid').val(),
				param4: '',
				lockProjectId: $('#accountAllDiff_customerId').val(),
				lockYyyy: $('#accountAllDiff_startDate').val()
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			//order: [6, 'desc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					title: 'ID',
					className: 'text-center',
					name: 'autoId',
					data: 'autoId',
					visible: false,
					width: 10

				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: 10,
					render: function(data, type, row, meta) {
						var renderStr = '<input type="hidden" name="tempIndexName" value="' + row.indexName + '">&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="accountAllDiffUpdate" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>';
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					className: 'text-left',
					title: '客户ID',
					name: 'customerId',
					data: 'customerId',
					width: 20
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: 20
				}, {
					targets: 5,
					orderable: true,
					className: 'text-center',
					title: '月份',
					name: 'subMonth',
					data: 'subMonth',
					width: 20

				}, {
					targets: 6,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectId',
					data: 'subjectId',
					width: 30

				}, {
					targets: 7,
					orderable: false,
					className: 'text-right',
					title: '余额表借方期初',
					name: 'debitRemain',
					data: 'debitRemain',
					width: 30,
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					orderable: false,
					className: 'text-right',
					title: '余额表贷方期初',
					name: 'creditRemain',
					data: 'creditRemain',
					width: 30,
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 9,
					orderable: false,
					className: 'text-right',
					title: '外币余额表本位币借方期初',
					name: 'debitRemainF',
					data: 'debitRemainF',
					width: 30,
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 10,
					orderable: false,
					className: 'text-right',
					title: '外币余额表本位币贷方期初',
					name: 'creditRemainF',
					data: 'creditRemainF',
					width: 30,
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};
	/** table 属性 */
	var accdetail_view2 = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {

				sqlId: 'FIN202004',
				menuId: window.sys_menuId,
				param3: $('#accountAllDiff_subjectid2').val(),
				param4: '',
				lockProjectId: $('#accountAllDiff_customerId2').val(),
				lockYyyy: $('#accountAllDiff_startDate2').val()
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			scrollX: true,
			//order: [6, 'desc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					title: 'ID',
					className: 'text-center',
					name: 'autoId',
					data: 'autoId',
					visible: false,
					width: 10

				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: 10,
					render: function(data, type, row, meta) {
						var renderStr = '<input type="hidden" name="tempIndexName" value="' + row.indexName + '">&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="accountAllDiffUpdate2" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>';
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					className: 'text-left',
					title: '客户ID',
					name: 'customerId',
					data: 'customerId',
					width: 20
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: 20
				}, {
					targets: 5,
					orderable: true,
					className: 'text-center',
					title: '月份',
					name: 'subMonth',
					data: 'subMonth',
					width: 20

				}, {
					targets: 6,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectId',
					data: 'subjectId',
					width: 30

				}, {
					targets: 7,
					orderable: true,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: 80

				}, {
					targets: 8,
					orderable: true,
					className: 'text-left',
					title: '方向',
					name: 'direction',
					data: 'direction',
					width: 30,
					render: function(data, type, row, meta) {
						if(data == '1'){
							return '借';
						}else if(data == '-1'){
							return '贷';
						}else{
							return data;
						}
					}

				}, {
					targets: 9,
					orderable: false,
					className: 'text-right',
					title: '币种',
					name: 'dataName',
					data: 'dataName',
					width: 30
				}, {
					targets: 10,
					orderable: false,
					className: 'text-right',
					title: '借方期初',
					name: 'debitRemain',
					data: 'debitRemain',
					width: 60,
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 11,
					orderable: false,
					className: 'text-right',
					title: '贷方期初',
					name: 'creditRemain',
					data: 'creditRemain',
					width:60,
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 12,
					orderable: false,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitOcc',
					data: 'debitOcc',
					width: 60,
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 13,
					orderable: false,
					className: 'text-right',
					title: '贷方发生额',
					name: 'creditOcc',
					data: 'creditOcc',
					width: 60,
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 14,
					orderable: false,
					className: 'text-right',
					title: '期末数',
					name: 'balance',
					data: 'balance',
					width: 60,
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};

	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		maxViewMode: 2,
		minViewMode: 2,
		language: 'zh-CN', //语言设置
		format: 'yyyy' //日期显示格式
	});

	//时间毫秒数转时间
	function getMyDate(str) {
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oHour = oDate.getHours(),
			oMin = oDate.getMinutes(),
			oSen = oDate.getSeconds(),
			oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
		return oTime;

	}

	//补0操作
	function getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + parseInt(num);
		}
		return num;
	}


	/** 搜索按钮 */
	$('#btn_accountAllDiff_search').click(function() {
		if ($('#accountAllDiff_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#accountAllDiff_startDate').val() == '') {
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		
		accdetail_view.localParam.urlparam.param3 = $('#accountAllDiff_subjectid').val();
		if($('#accountAllDiff_isTrue').val() == '1'){
			accdetail_view.localParam.urlparam.param4 = $('#accountAllDiff_isTrue').val();
		}else{
			accdetail_view.localParam.urlparam.param4 = '';
		}
		accdetail_view.localParam.urlparam.lockProjectId = $('#accountAllDiff_customerId').val();
		accdetail_view.localParam.urlparam.lockYyyy = $('#accountAllDiff_startDate').val();
		BdoDataTable('accountAllDiffListTable', accdetail_view);

		//$('#subjectlist_block').show();


	});

	/** 搜索按钮 */
	$('#btn_accountAllDiff_search2').click(function() {
		if ($('#accountAllDiff_customerId2').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#accountAllDiff_startDate2').val() == '') {
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		
		accdetail_view2.localParam.urlparam.param3 = $('#accountAllDiff_subjectid2').val();
		accdetail_view2.localParam.urlparam.lockProjectId = $('#accountAllDiff_customerId2').val();
		accdetail_view2.localParam.urlparam.lockYyyy = $('#accountAllDiff_startDate2').val();
		BdoDataTable('accountAllDiffListTable2', accdetail_view2);
		//$('#subjectlist_block').show();


	});

	// 选择科目
	$('#accountAllDiff_subjectid').focus(function() {
		if ($('#accountAllDiff_customerId').val() == '') {
			$('#accountAllDiff_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#accountAllDiff_startDate').val() == '') {
			$('#accountAllDiff_startDate').focus();
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
				lockProjectId: $('#accountAllDiff_customerId').val(),
				lockYyyy: $('#accountAllDiff_startDate').val(),
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
			/*lazyLoad : false,
			view : {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: '',
			}*/
		});
	});
	$('#modal_subjectid_sure').click(function() {
		var selectValue = $('#subject_tree').tree('getTreeMultiValue');
		if (typeof(selectValue) === 'object') {
			$('#accountAllDiff_subjectid').val('');
		} else {
			$('#accountAllDiff_subjectid').val(selectValue);

		}
		$('#modal_subjectid').modal('hide');
	});
	$('#modal_subjectid_reset').click(function() {
		$('#subject_tree').tree('reset');
	});

	// 选择科目
	$('#accountAllDiff_subjectid2').focus(function() {
		if ($('#accountAllDiff_customerId2').val() == '') {
			$('#accountAllDiff_customerId2').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#accountAllDiff_startDate2').val() == '') {
			$('#accountAllDiff_startDate2').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid2').modal('show');
		if ($('#subject_tree2').hasClass('treeview')) {
			return;
		}
		$('#subject_tree2').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#accountAllDiff_customerId2').val(),
				lockYyyy: $('#accountAllDiff_startDate2').val(),
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
			/*lazyLoad : false,
			view : {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: '',
			}*/
		});
	});
	$('#modal_subjectid_sure2').click(function() {
		var selectValue = $('#subject_tree2').tree('getTreeMultiValue');
		if (typeof(selectValue) === 'object') {
			$('#accountAllDiff_subjectid2').val('');
		} else {
			$('#accountAllDiff_subjectid2').val(selectValue);

		}
		$('#modal_subjectid2').modal('hide');
	});
	$('#modal_subjectid_reset2').click(function() {
		$('#subject_tree2').tree('reset');
	});
	//弹出修改页
	var object1 = '';
	$('#accountAllDiffListTable').on('click', 'button[name="accountAllDiffUpdate"]', function() {
		object1 = $('#accountAllDiffListTable').DataTable().data()[$(this).closest('tr').index()];
		var params = {
			menuId: window.sys_menuId,
			sqlId: '',
			param3: object1.subMonth,
			param4: object1.subjectId,
			lockProjectId: object1.customerId,
			lockYyyy: object1.yyyy
		};
		accountAllDiffTableCfg.localParam.urlparam = params;
		$('#accountAllDiff-modal').modal('show');
		return false;
	});
	
	$('#accountAllDiff-modal').on('shown.bs.modal', function (){
		BdoDataTable('accountAllDiffTable', accountAllDiffTableCfg)
		$('#accountAllDiff_amount').html("余额表借方期初:"+object1.debitRemain+" 余额表贷方期初:"+object1.creditRemain);
		$('#accountAllDiff-modal').draggable();
		$('#accountAllDiff-modal').css('overflow-y', 'scroll');
	});
	
	var accountAllDiffTableCfg = {
		localParam: {
			tabNum: true,
			url: 'finCenter/AccountAll.queryAccountAllList.json',
			urlparam: {}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',//
			ordering: false,
			serverSide: true,
			createdRow: function (row, data, dataIndex) {
				$(row).addClass('edit-able');
				$(row).find('td:eq(6)').addClass('bg-success-light');
				$(row).find('td:eq(7)').addClass('bg-success-light');
				$(row).find('td:eq(8)').addClass('bg-success-light');
				$(row).find('td:eq(9)').addClass('bg-success-light');
			},
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					className: 'text-left',
					title: '客户ID',
					name: 'customerId',
					data: 'customerId',
					width: 20
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: 20
				}, {
					targets: 3,
					orderable: true,
					className: 'text-center',
					title: '月份',
					name: 'subMonth',
					data: 'subMonth',
					width: 20

				}, {
					targets: 4,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectId',
					data: 'subjectId',
					width: 30

				}, {
					targets: 5,
					orderable: true,
					className: 'text-left',
					title: '币种',
					name: 'dataName',
					data: 'dataName',
					width: 30

				}, {
					targets: 6,
					orderable: false,
					className: 'text-right',
					title: '原币借方期初',
					name: 'debitRemain',
					data: 'debitRemain',
					width: '100px'
				}, {
					targets: 7,
					orderable: false,
					className: 'text-right',
					title: '原币贷方期初',
					name: 'creditRemain',
					data: 'creditRemain',
					width: '100px'
				}, {
					targets: 8,
					orderable: false,
					className: 'text-right',
					title: '本位币借方期初',
					name: 'debitRemainF',
					data: 'debitRemainF',
					width: '100px'
				}, {
					targets: 9,
					orderable: false,
					className: 'text-right',
					title: '本位币贷方期初',
					name: 'creditRemainF',
					data: 'creditRemainF',
					width: '100px'
				}
			]
		}
	};
	/** 单元格双击事件 */
	$('#accountAllDiff_content,#tab_accountAllDiff1,#tab_accountAllDiff2,#tab_accountAllDiff3,#tab_accountAllDiff4').on('dblclick', 'table tbody tr.edit-able td', function() {

		var colType = '';
		if ($(this).hasClass('bg-success-light')) {
			colType = 1;
		} else if ($(this).hasClass('bg-gray-light')) {
			colType = 2;
		} else if ($(this).hasClass('bg-gray-lighter')) {
			colType = 3;
		} else {
			return;
		}

		var td = $(this).closest('td');
		var key = td.parent().index();
		var $table = td.closest('table');
		//if ($table.attr('id').indexOf('qy_report') >= 0) return;
		var trL = $table.find('tr').length;
		//var index = checkTab($table);
		var th = $table.DataTable().context[0].aoColumns[$table.DataTable().cell(this).index().column];
		var data = $table.DataTable().row($(this).closest('tr')).data();
		var dif = td.next();
		var dfAm = dif.text();
		var dl = td.prev();
		var dlAm = dl.text();
		for (var i = 0; i < dlAm.length / 3; i++) {
			dlAm = dlAm.replace(',', '');
		}
		for (var i = 0; i < dfAm.length / 3; i++) {
			dfAm = dfAm.replace(',', '');
		}
		var check = false;
		/*if (thisPageConfig.TABLE_DIV == 3 || thisPageConfig.TABLE_DIV == 4) {
			if (th.name.indexOf('remain') >= 0 || th.name.indexOf('unAuditAmount') >= 0) {
				check = true;
			}
		}*/


		if (colType == 3 || colType == 1) {
			/** 双击客户报表数字列可编辑 */
			if (th.name.indexOf('Remain') >= 0 || check) {
				/*if (data['colType'] != 1) {
					return;
				}*/
				var oldVal = data[th.name];
				td.html('<span><input type=\'text\' style=\'width:100%; align=right;\'></span>');
				var input = $(this).find('input');
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
					var newVal = $(this).val().toString().replace(/,/g, '');

					function cvs(num) {
						var num = num.toFixed(2);
						var int = num.split('.')[0];
						var float = num.split('.')[1];
						var _number = int.toString().replace(/,/g, '');        // 数字转成字符串
						var result = '';            // 转换后的字符串
						var counter = '';
						for (var i = _number.length - 1; i >= 0; i--) {
							counter++;
							result = _number.charAt(i) + result;
							if (!(counter % 3) && i != 0) {
								result = ',' + result;
							}
						}
						if (int > 0) {
							return '-' + result + '.' + float;
						} else {
							var result = result.replace('-', '');
							if (result[0] == ',') {
								result = result.replace(',', '');
							}
							return result + '.' + float;
						}
					}

					if (newVal == '') {
						td.html(0);
						/*if (!check) {
							if (dfAm - oldVal < 0) {
								dif.html('<span style=\'color:green;\'>' + '-' + cvs(dfAm - oldVal) + '</span>');
							} else if (dfAm - oldVal > 0) {
								dif.html('<span style=\'color:green;\'>' + cvs(dfAm - oldVal) + '</span>');
							}
						}*/
					} else if (isNaN(newVal)) {
						td.html(oldVal);
					} else {
						var num = newVal * 1;
						td.html(num.toFixed(2));
						/*if (!check) {
							var N = (dlAm - num);
							if (N < 0) {
								var N = cvs(N);
								var txt = '<span style=\'color:green;\'>' + N + '</span>';
								dif.html(txt);
							} else if (N > 0) {
								var N = cvs(N);
								var txt = '<span style=\'color:green;\'>' + N + '</span>';
								dif.html(txt);
							} else {
								var N = cvs(N);
								var txt = '<span>' + N + '</span>';
								dif.html(txt);
							}
						}*/
					}
					if (td.html() != data[th.name]) {
						data[th.name] = td.html();
						// 修改标记
						data['isEdit'] = 1;
						/*var name = th.name.substring(0, th.name.length - 4);
						var tmpData = {};
						if (data.colCode in customerAmoutMap) {
							tmpData = customerAmoutMap[data.colCode];
						}
						tmpData[name] = data[th.name];//'colCode':data.colCode,
						customerAmoutMap[data.colCode] = tmpData;*/
					}
				});

			}
		}

	});

	//保存
	$('#accountAllDiff_save').on('click', function() {
		var object = [];
		var len = $('#accountAllDiffTable').DataTable().data().length;
		for(var i=0;i<len;i++){
			object.push($('#accountAllDiffTable').DataTable().data()[i]);
		}
		var jsonData = JSON.stringify(object);
		bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'finCenter/AccountAll.saveAccountAll.json',
				type: 'post',
				data: {
					param1: jsonData,
					lockProjectId: $('#accountAllDiff_customerId').val(),
					lockYyyy: $('#accountAllDiff_startDate').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#accountAllDiffListTable').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//弹出修改页
	$('#accountAllDiffListTable2').on('click', 'button[name="accountAllDiffUpdate2"]', function() {
		var object = $('#accountAllDiffListTable2').DataTable().data()[$(this).closest('tr').index()];
		$('#accountAllDiff_direction2').html(ComboLocalDicOption(false, '借贷方向'));
		$('#accountAllDiff_direction2').val(object.direction);
		directionParam.param3 = object.subjectId;
		directionParam.param4 = object.direction;
		directionParam.param5 = object.direction;
		directionParam.lockProjectId = object.customerId;
		directionParam.lockYyyy = object.yyyy;
		
		var params = {
			menuId: window.sys_menuId,
			sqlId: '',
			param3: object.subMonth,
			param4: object.subjectId,
			lockProjectId: object.customerId,
			lockYyyy: object.yyyy
		};
		accountAllDiffTableAccountCfg.localParam.urlparam = params;
		accountAllDiffTableAccountAllCfg.localParam.urlparam = params;
		accountAllDiffTableAssitemCfg.localParam.urlparam = params;
		accountAllDiffTableAssitemAllCfg.localParam.urlparam = params;
		
		$('#accountAllDiff-modal2').modal('show');
		return false;
	});
	
	$('#accountAllDiff-modal2').on('shown.bs.modal', function (){
		BdoDataTable('accountAllDiffTable_account', accountAllDiffTableAccountCfg);
		BdoDataTable('accountAllDiffTable_accountAll', accountAllDiffTableAccountAllCfg);
		BdoDataTable('accountAllDiffTable_assitem', accountAllDiffTableAssitemCfg);
		BdoDataTable('accountAllDiffTable_assitemAll', accountAllDiffTableAssitemAllCfg);
		$('#accountAllDiff-modal2').draggable();
		$('#accountAllDiff-modal2').css('overflow-y', 'scroll');
	});
	
	var directionParam = {
		param1: '',
		param2: '',
		param3: '',
		param4: '',
		param5: '',
		param6: '',
		param7: '',
		param8: '',
		param9: ''
	};

	//保存
	$('#accountAllDiff_save2').on('click', function() {
		directionParam.param4 = $('#accountAllDiff_direction2').val();
		var object1 = [];
		var len1 = $('#accountAllDiffTable_account').DataTable().data().length;
		for(var i=0;i<len1;i++){
			let obj = $('#accountAllDiffTable_account').DataTable().data()[i];
			if(obj.isEdit && obj.isEdit == 1){
				object1.push($('#accountAllDiffTable_account').DataTable().data()[i]);
			}
		}
		var jsonData1 = JSON.stringify(object1);
		var object2 = [];
		var len2 = $('#accountAllDiffTable_accountAll').DataTable().data().length;
		for(var i=0;i<len2;i++){
			let obj = $('#accountAllDiffTable_accountAll').DataTable().data()[i];
			if(obj.isEdit && obj.isEdit == 1){
				object2.push($('#accountAllDiffTable_accountAll').DataTable().data()[i]);
			}
		}
		var jsonData2 = JSON.stringify(object2);
		var object3 = [];
		var len3 = $('#accountAllDiffTable_assitem').DataTable().data().length;
		for(var i=0;i<len3;i++){
			let obj = $('#accountAllDiffTable_assitem').DataTable().data()[i];
			if(obj.isEdit && obj.isEdit == 1){
				object3.push($('#accountAllDiffTable_assitem').DataTable().data()[i]);
			}
		}
		var jsonData3 = JSON.stringify(object3);
		var object4 = [];
		var len4 = $('#accountAllDiffTable_assitemAll').DataTable().data().length;
		for(var i=0;i<len4;i++){
			let obj = $('#accountAllDiffTable_assitemAll').DataTable().data()[i];
			if(obj.isEdit && obj.isEdit == 1){
				object4.push($('#accountAllDiffTable_assitemAll').DataTable().data()[i]);
			}
		}
		var jsonData4 = JSON.stringify(object4);
		directionParam.param6 = jsonData1;
		directionParam.param7 = jsonData2;
		directionParam.param8 = jsonData3;
		directionParam.param9 = jsonData4;
		bdoConfirmBox('保存', '确认保存？', function() {
			bdoInProcessingBox('处理中');
			$.ajax({
				url: 'finCenter/AccountAll.saveDirection.json',
				type: 'post',
				data: directionParam,
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#accountAllDiffListTable2').DataTable().ajax.reload(null,false);
						$('#accountAllDiff-modal2').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	var accountAllDiffTableAccountCfg = {
		localParam: {
			tabNum: true,
			url: 'finCenter/AccountAll.queryAccountListDiff.json',
			urlparam: {}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			dom:
				"<'row'<'col-sm-12'tr>>" +
				"<'row'<'col-sm-6'i><'col-sm-6'p>>",
			ordering: false,
			//serverSide: true,
			pageLength: 10,
			createdRow: function (row, data, dataIndex) {
				$(row).addClass('edit-able');
				$(row).find('td:eq(5)').addClass('bg-success-light');
				$(row).find('td:eq(6)').addClass('bg-success-light');
			},
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					className: 'text-left',
					title: '客户ID',
					name: 'customerId',
					data: 'customerId',
					width: 20,
					render: function(data, type, row, meta) {
						return data + '<span style="display:none;">0</span>';
					}
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: 20
				}, {
					targets: 3,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectId',
					data: 'subjectId',
					width: 30

				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: 30

				}, {
					targets: 5,
					orderable: false,
					className: 'text-right',
					title: '借方期初',
					name: 'debitRemain',
					data: 'debitRemain',
					width: '100px'
				}, {
					targets: 6,
					orderable: false,
					className: 'text-right',
					title: '贷方期初',
					name: 'creditRemain',
					data: 'creditRemain',
					width: '100px'
				}
			]
		}
	};
	var accountAllDiffTableAccountAllCfg = {
		localParam: {
			tabNum: true,
			url: 'finCenter/AccountAll.queryAccountAllListDiff.json',
			urlparam: {}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			dom:
				"<'row'<'col-sm-12'tr>>" +
				"<'row'<'col-sm-6'i><'col-sm-6'p>>",
			ordering: false,
			//serverSide: true,
			pageLength: 10,
			createdRow: function (row, data, dataIndex) {
				$(row).addClass('edit-able');
				$(row).find('td:eq(6)').addClass('bg-success-light');
				$(row).find('td:eq(7)').addClass('bg-success-light');
				$(row).find('td:eq(8)').addClass('bg-success-light');
				$(row).find('td:eq(9)').addClass('bg-success-light');
			},
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					className: 'text-left',
					title: '客户ID',
					name: 'customerId',
					data: 'customerId',
					width: 20
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: 20
				}, {
					targets: 3,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectId',
					data: 'subjectId',
					width: 30

				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: 30

				}, {
					targets: 5,
					orderable: true,
					className: 'text-left',
					title: '币种',
					name: 'currency',
					data: 'currency',
					width: 30

				}, {
					targets: 6,
					orderable: false,
					className: 'text-right',
					title: '原币借方期初',
					name: 'debitRemain',
					data: 'debitRemain',
					width: '100px'
				}, {
					targets: 7,
					orderable: false,
					className: 'text-right',
					title: '原币贷方期初',
					name: 'creditRemain',
					data: 'creditRemain',
					width: '100px'
				}, {
					targets: 8,
					orderable: false,
					className: 'text-right',
					title: '本位币借方期初',
					name: 'debitRemainF',
					data: 'debitRemainF',
					width: '100px'
				}, {
					targets: 9,
					orderable: false,
					className: 'text-right',
					title: '本位币贷方期初',
					name: 'creditRemainF',
					data: 'creditRemainF',
					width: '100px'
				}
			]
		}
	};
	var accountAllDiffTableAssitemCfg = {
		localParam: {
			tabNum: true,
			url: 'finCenter/AccountAll.queryAssitemListDiff.json',
			urlparam: {}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			dom:
				"<'row'<'col-sm-12'tr>>" +
				"<'row'<'col-sm-6'i><'col-sm-6'p>>",
			ordering: false,
			//serverSide: true,
			pageLength: 10,
			createdRow: function (row, data, dataIndex) {
				$(row).addClass('edit-able');
				$(row).find('td:eq(6)').addClass('bg-success-light');
				$(row).find('td:eq(7)').addClass('bg-success-light');
			},
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					className: 'text-left',
					title: '客户ID',
					name: 'customerId',
					data: 'customerId',
					width: 20
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: 20
				}, {
					targets: 3,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectId',
					data: 'subjectId',
					width: 30

				}, {
					targets: 4,
					orderable: true,
					className: 'text-left',
					title: '核算科目',
					name: 'assItemId',
					data: 'assItemId',
					width: 30

				}, {
					targets: 5,
					orderable: true,
					className: 'text-center',
					title: '核算名称',
					name: 'assItemName',
					data: 'assItemName',
					width: 30

				}, {
					targets: 6,
					orderable: false,
					className: 'text-right',
					title: '借方期初',
					name: 'debitRemain',
					data: 'debitRemain',
					width: '100px'
				}, {
					targets: 7,
					orderable: false,
					className: 'text-right',
					title: '贷方期初',
					name: 'creditRemain',
					data: 'creditRemain',
					width: '100px'
				}
			]
		}
	};
	var accountAllDiffTableAssitemAllCfg = {
		localParam: {
			tabNum: true,
			url: 'finCenter/AccountAll.queryAssitemAllListDiff.json',
			urlparam: {}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			dom:
				"<'row'<'col-sm-12'tr>>" +
				"<'row'<'col-sm-6'i><'col-sm-6'p>>",
			ordering: false,
			//serverSide: true,
			pageLength: 10,
			createdRow: function (row, data, dataIndex) {
				$(row).addClass('edit-able');
				$(row).find('td:eq(7)').addClass('bg-success-light');
				$(row).find('td:eq(8)').addClass('bg-success-light');
				$(row).find('td:eq(9)').addClass('bg-success-light');
				$(row).find('td:eq(10)').addClass('bg-success-light');
			},
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					className: 'text-left',
					title: '客户ID',
					name: 'customerId',
					data: 'customerId',
					width: 20
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: 20
				}, {
					targets: 3,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectId',
					data: 'subjectId',
					width: 30

				}, {
					targets: 4,
					orderable: true,
					className: 'text-left',
					title: '核算科目',
					name: 'assItemId',
					data: 'assItemId',
					width: 30

				}, {
					targets: 5,
					orderable: true,
					className: 'text-center',
					title: '核算名称',
					name: 'assItemName',
					data: 'assItemName',
					width: 30

				}, {
					targets: 6,
					orderable: true,
					className: 'text-left',
					title: '币种',
					name: 'currency',
					data: 'currency',
					width: 30

				}, {
					targets: 7,
					orderable: false,
					className: 'text-right',
					title: '原币借方期初',
					name: 'debitRemain',
					data: 'debitRemain',
					width: '100px'
				}, {
					targets: 8,
					orderable: false,
					className: 'text-right',
					title: '原币贷方期初',
					name: 'creditRemain',
					data: 'creditRemain',
					width: '100px'
				}, {
					targets: 9,
					orderable: false,
					className: 'text-right',
					title: '本位币借方期初',
					name: 'debitRemainF',
					data: 'debitRemainF',
					width: '100px'
				}, {
					targets: 10,
					orderable: false,
					className: 'text-right',
					title: '本位币贷方期初',
					name: 'creditRemainF',
					data: 'creditRemainF',
					width: '100px'
				}
			]
		}
	};
	/*$('#accountAllDiff-modal').on('shown.bs.modal', function (){
		BdoDataTable('accountAllDiffTable', accountAllDiffTableCfg)
		$('#accountAllDiff-modal').draggable();
		$('#accountAllDiff-modal').css('overflow-y', 'scroll');
	});*/
});