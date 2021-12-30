$(document).ready(function() {
	uiBlocksApi(false, 'init');
	var formId = 'regist_form';
	var table = 'subjectEntry';

	$('#subjectlist_block').show();
	$('#font_size').change(function() {
		$('#subjectEntry td').addClass('transform_font_size');
		$('th').addClass('transform_font_size');
		$('#subjectEntry td').css('font-size', $(this).val() + 'px');
		$('th').css('font-size', $(this).val() + 'px');
	});

	// 获取客户下拉
	// 客户
	getUserCustomers('detail_customerId');

	/*$('#detail_yyyy').datepicker({
		autoclose : true,
		todayHighlight : true,
		language : 'zh-CN', // 语言设置
		format : 'yyyy', // 日期显示格式
		minViewMode : 2
	});*/
	$('#detail_startDate, #detail_endDate').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN',
		format: 'yyyy-mm',
		minViewMode: 1
	});
	$('#detail_customerId,#detail_startDate').change(function() {
		if ($('#subject_tree').hasClass('treeview')) {
			$('#subject_tree').tree('reset');
			$('#subject_tree').tree('destory');
		}
		if ($('#assitem_tree').hasClass('treeview')) {
			$('#assitem_tree').tree2('reset');
			$('#assitem_tree').tree2('destory');
		}
	});
	/** 下拉框 获取字典 */
	// 月份
	//$('#detail_startmonth,#detail_endmonth').html(ComboLocalDicOption(false, 'month'));
	$('#subject_type').html(ComboLocalDicOption(false, '对方科目'));
	$('#summary_type').html(ComboLocalDicOption(false, '摘要匹配'));
	$('#detail_viewnum,#detail_othercurr').html(ComboLocalDicOption(false, 'boolean'));
	$('#detail_sort').html(ComboLocalDicOption(false, '明细账排序'));
	
	let startyear = window.CUR_PROJECT_START_YEAR; // 2018
	let startmonth = window.CUR_PROJECT_START_MONTH; // 1
	let endmonth = window.CUR_PROJECT_END_MONTH; // 12
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
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
	$('#detail_sort').val('vchDate,voucherId,serail');
	$('#detail_startDate').val(startyear + '-' + startmonth);
	$('#detail_endDate').val(startyear + '-' + endmonth);
	
	// 选择科目
	$('#detail_assitemid').focus(function() {
		if ($('#detail_customerId').val() == '') {
			$('#detail_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#detail_startDate').val() == '') {
			$('#detail_startDate').focus();
			bdoInfoBox('提示', '请选择开始年月');
			return;
		}
		$('#modal_assitemid').modal('show');
		if ($('#assitem_tree').hasClass('treeview')) {
			return;
		}
		$('#assitem_tree').tree2({
			url : 'finCenter/FinTreeCommon.findSubjectAssitem.json',
			params : {
				lockProjectId : $('#detail_customerId').val(),
				lockYyyy : $('#detail_startDate').val().substr(0, 4),
				searchInputId : 'searchInputAssitem'
			},
			singleSelect : true,
			//lazyLoad : false,
			//onceLoad : true,
			view : {
				leafIcon : 'fa fa-building text-flat',
				nodeIcon : 'fa fa-bank text-primary-light',
				folderSelectable : false,
				multiSelect : false,
				showCheckbox : true,
				selectedColor : '',
				selectedBackColor : ''

			}
		});
	});
	$('#modal_assitemid_sure').click(function() {
		if (typeof ($('#assitem_tree').tree2('getTreeMultiValue')) == 'object') {
			$('#detail_assitemid').val('');
		} else {
			$('#detail_assitemid').val($('#assitem_tree').tree2('getTreeMultiValue'));
		}
		$('#modal_assitemid').modal('hide');
	});
	$('#modal_assitemid_reset').click(function() {
		$('#assitem_tree').tree2('reset');
		$('#searchInputAssitem').keyup();
	});
	
	$('#detail_othercurr').change(function() {
		var isShow = false;
		if($('#detail_othercurr').val() == '1'){
			isShow = true;
		}
		accdetail_view.tableParam.columnDefs.forEach((o, i) => {
			if(o.name == 'debitOccF' || o.name == 'creditOccF'){
				o.visible = isShow;
				o.bVisible = isShow;
			}
		});
		
	});

	$('#detail_viewnum').change(function() {
		var isShow = false;
		if($('#detail_viewnum').val() == '1'){
			isShow = true;
		}
		accdetail_view.tableParam.columnDefs.forEach((o, i) => {
			if(o.name == 'quantity' || o.name == 'unitPrice' || o.name == 'unitName'){
				o.visible = isShow;
				o.bVisible = isShow;
			}
		});
		
	});

	// 选择科目
	$('#detail_subjectid').focus(function() {
		if ($('#detail_customerId').val() == '') {
			$('#detail_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#detail_startDate').val() == '') {
			$('#detail_startDate').focus();
			bdoInfoBox('提示', '请选择开始年月');
			return;
		}

		$('#modal_subjectid').modal('show');
		if ($('#subject_tree').hasClass('treeview')) {
			return;
		}
		$('#subject_tree').tree({
			url : 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params : {
				lockProjectId : $('#detail_customerId').val(),
				lockYyyy : $('#detail_startDate').val().substr(0, 4),
				searchInputId : 'searchInput2'
			},
			singleSelect : true,
			lazyLoad : false,
			onceLoad : true,
			view : {
				leafIcon : 'fa fa-building text-flat',
				nodeIcon : 'fa fa-bank text-primary-light',
				folderSelectable : false,
				multiSelect : false,
				showCheckbox : true,
				selectedColor : '',
				selectedBackColor : ''

			}
		});
	});

	$('#modal_accmulsubjectid_sure').click(function() {
		var selectValue = $('#subject_tree').tree('getTreeMultiValue');
		if (typeof (selectValue) === 'object') {
			$('#detail_subjectid').val('');
		} else {
			$('#detail_subjectid').val(selectValue);
		}
		$('#modal_subjectid').modal('hide');
	});

	$('#modal_accmulsubjectid_reset').click(function() {
		$('#subject_tree').tree('reset');
	});

	/** 检索条件设置 */
	var queryFilter = function() {
		/** table */
		var queryFilterArr = {
			menuId : window.sys_menuId,
			lockProjectId : $('#detail_customerId').val(),
			lockYyyy : $('#detail_startDate').val().substr(0, 4),
			jsonData : JSON.stringify({
				'startMonth' : $('#detail_startDate').val().split('-')[1],
				'endMonth' : $('#detail_endDate').val().split('-')[1],
				'subjectId' : $('#detail_subjectid').val(),
				'subjectType' : $('#subject_type').val(),
				'summaryType' : $('#summary_type').val(),
				'summary' : $('#detail_summary').val(),
				'assItemId' : $('#detail_assitemid').val(),
				'viewnum' : $('#detail_viewnum').val(),
				'othercurr' : $('#detail_othercurr').val(),
				'sort' : $('#detail_sort').val(),
				'startDate' : $('#detail_startDate').val(),
				'endDate' : $('#detail_endDate').val()
			})
		};
		return queryFilterArr;
	};

	/** table 属性 */
	var accdetail_viewindex = 1;
	var accdetail_view = {
		localParam : {
			tabNum : true,
			url : 'finCenter/SubjectEntry.getSubjectEntryAssitem.json',
			urlparam : {
				menuId : window.sys_menuId,
				lockProjectId : '',
				lockYyyy : '',
				param1 : ''
			}
		},
		tableParam : {
			select : true,
			lengthChange : false,
			// fixedHeader: true,
			fixedThead : true,
			fixedHeight : '480px',
			ordering : true,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			serverSide : false,
			// deferRender: true,
			scroller : true,
			order : [],
			columnDefs : [ {
				targets : accdetail_viewindex++,
				orderable : false,
				className : 'text-center',
				title : '科目',
				name : 'subjectId',
				data : 'subjectShow',
				width : '180px'
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-left',
				title : '核算项目编号',
				name : 'assItemId',
				data : 'assItemId',
				width : '85px'
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-left',
				title : '核算项目名称',
				name : 'assTotalName',
				data : 'assTotalName',
				width : '180px'
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-center',
				title : '凭证日期',
				name : 'vchDate',
				data : 'vchDate',
				width : '80px'
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-left',
				title : '字',
				name : 'typeId',
				data : 'typeId',
				width : '30px'
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-left',
				title : '系统编号',
				name : 'voucherId',
				data : 'voucherId',
				width : '30px',
				visible : false
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-left',
				title : '号',
				name : 'oldVoucherId',
				data : 'oldVoucherId',
				width : '30px'
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
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
			}, {
				targets : accdetail_viewindex++,
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
				targets : accdetail_viewindex++,
				orderable : false,
				className : 'text-left',
				title : '币种',
				name : 'currency',
				data : 'currency',
				width : '30px'
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-center',
				title : '方向',
				name : 'direction',
				data : 'direction',
				width : '30px'
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-right',
				title : '借方发生额<br>外币',
				name : 'debitOccF',
				data : 'debitOccF',
				width : '150px',
				visible : false,
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-right',
				title : '借方发生额<br>本位币',
				name : 'debitOcc',
				data : 'debitOcc',
				width : '150px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-right',
				title : '贷方发生额<br>外币',
				name : 'creditOccF',
				data : 'creditOccF',
				width : '150px',
				visible : false,
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-right',
				title : '贷方发生额<br>本位币',
				name : 'creditOcc',
				data : 'creditOcc',
				width : '150px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				title : '余额',
				className : 'text-right',
				name : 'remain',
				data : 'remain',
				width : '100px',
				visible : true,
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-right',
				title : '数量',
				name : 'quantity',
				data : 'quantity',
				width : '50px',
				visible : false
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-right',
				title : '单价',
				name : 'unitPrice',
				data : 'unitPrice',
				width : '50px',
				visible : false
			}, {
				targets : accdetail_viewindex++,
				orderable : true,
				className : 'text-center',
				title : '单位',
				name : 'unitName',
				data : 'unitName',
				width : '50px',
				visible : false
			} ]
		}
	};

	var formatSubjectFullName = function(val) {
		var count = val.length;
		if (count > 20) {
			return val.substring(0, 16) + '......';
		}
		return val;
	};

	/** 搜索按钮 */
	$('#btn_search').click(function() {
		if ($('#detail_customerId').val() == '') {
			bdoInfoBox('提示', '请输入客户编号');
			return;
		}
		if ($('#detail_startDate').val() == '') {
			$('#detail_startDate').focus();
			bdoInfoBox('提示', '请选择开始年月');
			return;
		}
		if ($('#detail_endDate').val() == '') {
			$('#detail_endDate').focus();
			bdoInfoBox('提示', '请选择结束年月');
			return;
		}
		var detail_startDate = $('#detail_startDate').val();
		var detail_endDate = $('#detail_endDate').val();
		if (detail_endDate < detail_startDate) {
			$('#detail_startDate').focus();
			bdoInfoBox('提示', '结束年月不能小于开始年月');
			return;
		}
		/*if ($('#detail_subjectid').val() == '') {
			bdoInfoBox('提示', '请输入科目编号');
			return;
		}*/
		if ($('#detail_subjectid').val() == '' && $('#detail_assitemid').val() == '') {
			bdoInfoBox('提示', '请输入科目编号或者核算类型');
			return;
		}
		$(this).parents('.block').next('.block').find('span[name="cus_select"]').text('【' + $('#detail_customerId option:selected').text() + '】');
		// 账套过期时间
		getValidDate($('#detail_customerId').val(), $('#detail_startDate').val().substr(0, 4), 'validDate');
		accdetail_view.tableParam.param1 = 'jsq';
		accdetail_view.localParam.urlparam = queryFilter();
		jsq(accdetail_view.tableParam, table);
		BdoDataTable(table, accdetail_view);

		$('#subjectEntry').on('xhr.dt', function(e, settings, json, xhr) {
			if (json.recordsTotal > 0) {
				$('#detail_account_assitem_export').css('display', 'block');
				$('#account_export_dg').css('display', 'block');
			} else {
				$('#detail_account_assitem_export').css('display', 'nones');
				$('#account_export_dg').css('display', 'nones');
			}
		});

		/** 行双击 */
		$('#subjectEntry tbody').on('dblclick', 'tr', function() {
			var object = $('#subjectEntry').DataTable().row(this).data();
			voucherTab('tab_detailaccount', $('#detail_customerId').val(), object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
		});

	});

	/** 单元格点击事件 */
	$('#subjectEntry').on('click', 'td', function() {
		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_subjectEntry').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_subjectEntry').val('(' + data + ')');
			} else {
				$('#suanshi_subjectEntry').val(data);
			}
			$('#jieguo_subjectEntry').val(data);
		} else {
			value = $('#suanshi_subjectEntry').val();
			jieguo = $('#jieguo_subjectEntry').val();
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
				$('#suanshi_subjectEntry').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_subjectEntry').val(value + '+' + data);
			}
			$('#jieguo_subjectEntry').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 计算器重置
	$('#jsq_clear_subjectEntry').on('click', function() {

		$('#suanshi_subjectEntry').val('');
		$('#jieguo_subjectEntry').val('');
	});

	/** 导出 */
	$('#detail_account_assitem_export').click(function() {
		exportExcelFin(this, '核算明细账一览', accdetail_view, table);
	});

	/** 导出到底稿附件 打开Tb附件框 */
	$('#account_export_dg').click(function() {

		var customerId = $('#detail_customerId').val();
		var customername = $('#detail_customerId option:selected').text();

		ecportToDg(customerId, customername, accdetail_view);

	});

	function onExport(event) {
		let data = huoqunode();
		if (data) {
			data.title = '核算明细账一览';
			data.view = accdetail_view;
			data.table = table;
			data.customerId = $('#detail_customerId').val();
			exportExcelTo(this, data);
		} else {

		}
	}

	/* 导出到底稿附件 */
	$('#modal_tbsubjectid_sure').click(onExport);

	/** 重置按钮 */
	$('#btn_clear').click(function() {
		$('#detail_customerId').val('').trigger('change');
		//getUserLocalYear('detail_yyyy');
		$('#detail_subjectid').val('');
		//$('#detail_startmonth,#detail_endmonth').html(ComboLocalDicOption(false, 'month'));
		$('#summary_type').val('1');
		$('#summary').val('');
		$('#othercurr').val('0');
		$('#detail_sort').val('vchDate,voucherId,serail');
		let startyear = window.CUR_PROJECT_START_YEAR; // 2018
		let startmonth = window.CUR_PROJECT_START_MONTH; // 1
		let endmonth = window.CUR_PROJECT_END_MONTH; // 12
		if (!startyear || startyear == '') {
			startyear = new Date().getFullYear();
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
		$('#detail_sort').val('vchDate,voucherId,serail');
		$('#detail_startDate').val(startyear + '-' + startmonth);
		$('#detail_endDate').val(startyear + '-' + endmonth);
	});
});