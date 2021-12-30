$(document).ready(function() {
	$($('main .content')[1]).css('min-height', 480 + 'px');
	uiBlocksApi(false, 'init');

	var formId = 'regist_form';
	var table = 'subjectEntry';

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
	});

	/** 下拉框 获取字典 */
	// 月份
	//$('#detail_startmonth,#detail_endmonth').html(ComboLocalDicOption(false, 'month'));
	$('#detail_vouchartype').html(ComboLocalDicOption(true, '凭证类型'));
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
	
	$('#detail_sort').change(function() {
		var isShow = false;
		if($('#detail_sort').val() == 'vchDate,voucherId,serail'){
			isShow = true;
		}
		accdetail_view.tableParam.columnDefs.forEach((o, i) => {
			if(o.name == 'remain'){
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

	/** 检索条件设置 */
	var queryFilter = function() {
		/** table */
		var queryFilterArr = {
			'startMonth' : $('#detail_startDate').val().split('-')[1],
			'endMonth' : $('#detail_endDate').val().split('-')[1],
			'subjectId' : $('#detail_subjectid').val(),
			'voucharType' : $('#detail_vouchartype').val(),
			'subjectType' : $('#subject_type').val(),
			'summaryType' : $('#summary_type').val(),
			'summary' : $('#detail_summary').val(),
			'viewnum' : $('#detail_viewnum').val(),
			'othercurr' : $('#detail_othercurr').val(),
			'sort' : $('#detail_sort').val(),
			'startDate' : $('#detail_startDate').val(),
			'endDate' : $('#detail_endDate').val()
		};
		return JSON.stringify(queryFilterArr);
	};

	/** table 属性 */
	var accdetail_view_index = 1;
	var accdetail_view = {
		localParam : {
			tabNum : true,
			url : 'finCenter/SubjectEntry.getSubjectEntryView.json',
			urlparam : {
				menuId : window.sys_menuId,
				lockProjectId : '',
				lockYyyy : '',
				param1 : '',
				param2 : ''
			}
		},
		tableParam : {
			select : true,
			lengthChange : false,
			// fixedHeader: true,
			fixedThead : true,
			fixedHeight : '500px',
			ordering : false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			serverSide : false,
			scroller : true,
			columnDefs : [ {
				targets : accdetail_view_index++,
				orderable : false,
				className : 'text-center',
				title : '凭证日期',
				name : 'vchDate',
				data : 'vchDate',
				width : '85px'
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-left',
				title : '字',
				name : 'typeId',
				data : 'typeId',
				width : '30px'
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-left',
				title : '系统编号',
				name : 'voucherId',
				data : 'voucherId',
				width : '30px',
				visible : false
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-left',
				title : '号',
				name : 'oldVoucherId',
				data : 'oldVoucherId',
				width : '30px'
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-left',
				title : '科目编号',
				name : 'subjectId',
				data : 'subjectId',
				width : '80px'
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-left',
				title : '科目名称',
				name : 'subjectFullName',
				data : 'subjectFullName',
				width : '100px'
			}, {
				targets : accdetail_view_index++,
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
				targets : accdetail_view_index++,
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
				targets : accdetail_view_index++,
				className : 'text-center',
				title : '币种',
				name : 'currency',
				data : 'currency',
				width : '25px'
			}, {
				targets : accdetail_view_index++,
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
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-right',
				title : '借方发生额<br>外币',
				name : 'debitOccF',
				data : 'debitOccF',
				width : '100px',
				visible : false,
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-right',
				title : '借方发生额<br>本位币',
				name : 'debitOcc',
				data : 'debitOcc',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-right',
				title : '贷方发生额<br>外币',
				name : 'creditOccF',
				data : 'creditOccF',
				width : '100px',
				visible : false,
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-right',
				title : '贷方发生额<br>本位币',
				name : 'creditOcc',
				data : 'creditOcc',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : accdetail_view_index++,
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
				targets : accdetail_view_index++,
				orderable : true,
				title : '借贷方向',
				className : 'text-center',
				name : 'direction',
				data : 'direction',
				width : '100px',
				visible : false
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				title : '发生额',
				className : 'text-right',
				name : 'occurValue',
				data : 'occurValue',
				width : '100px',
				visible : false,
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-right',
				title : '数量',
				name : 'quantity',
				data : 'quantity',
				width : '50px',
				visible : false
			}, {
				targets : accdetail_view_index++,
				orderable : true,
				className : 'text-right',
				title : '单价',
				name : 'unitPrice',
				data : 'unitPrice',
				width : '50px',
				visible : false
			}, {
				targets : accdetail_view_index++,
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
			return val.substring(0, 16) + '...';
		}
		return val;
	};

	/** 搜索按钮 */
	$('#btn_search').click(function() {
		$('#subjectEntry').html('');
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
		if ($('#detail_subjectid').val() == '') {
			bdoInfoBox('提示', '请输入科目编号');
			return;
		}

		if ($('#detail_subjectid').val().length == 1) {
			bdoInfoBox('提示', '请选择子级科目');
			return;
		}
		$(this).parents('.block').next('.block').find('span[name="cus_select"]').text('【' + $('#detail_customerId option:selected').text() + '】');
		var array = $('#detail_subjectid').val().split(',');

		var subjectid = '';
		for (var i = 0; i < array.length; i++) {

			subjectid += '\'' + array[i] + '\'';
			if (i != array.length - 1) {
				subjectid += ',';
			}
		}
		// 账套过期时间
		getValidDate($('#detail_customerId').val(), $('#detail_startDate').val().substr(0, 4), 'validDate');
		accdetail_view.tableParam.param1 = 'jsq';
		accdetail_view.localParam.urlparam.jsonData = queryFilter();
		accdetail_view.localParam.urlparam.lockProjectId = $('#detail_customerId').val();
		accdetail_view.localParam.urlparam.lockYyyy = $('#detail_startDate').val().substr(0, 4);
		jsq(accdetail_view.tableParam, table);
		BdoDataTable(table, accdetail_view);

		$('#subjectEntry').on('xhr.dt', function(e, settings, json, xhr) {
			if (json.recordsTotal > 0) {
				$('#detailaccount_export').css('display', 'block');
				$('#detailaccount_export_dg').css('display', 'block');
			} else {
				$('#detailaccount_export').css('display', 'none');
				$('#detailaccount_export_dg').css('display', 'none');
			}

		});

		/** 行双击 */
		$('#subjectEntry tbody').on('dblclick', 'tr', function() {
			// var object =
			// $('#subjectEntry').DataTable().data()[$(this).closest('tr').index()];
			var object = $('#subjectEntry').DataTable().row(this).data();
			if (object.voucherId == '') {
				return;
			}
			voucherTab('tab_detailaccount', $('#detail_customerId').val(), object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
		});
	});

	/** 导出 */
	$('#detailaccount_export').click(function() {
		exportExcelFin(this, '明细账一览', accdetail_view, table);
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

	/** 导出到底稿附件 打开Tb附件框 */
	$('#detailaccount_export_dg').click(function() {

		var customerId = $('#detail_customerId').val();
		var customername = $('#detail_customerId option:selected').text();

		ecportToDg(customerId, customername, accdetail_view);

	});

	function onExport(event) {
		let data = huoqunode();
		if (data) {
			data.title = '明细账一览';
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
		$('#detail_vouchartype').val('-1');
		$('#summary_type').val('&&');
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

	/**
	 * 初步分析性复核 双击穿透 初始化方法(李开)
	 */
	function initByNewTab() {
		let url = window.location.href;
		// 特殊标识
		if (url.indexOf('gotoDesktop') > 0) {
			let params = url.split('?')[1];
			let kv = params.split('&');
			$(kv).each(function() {
				let entry = this.split('=');
				let key = entry[0];
				let value = entry[1];
				switch (key) {
				case 'startYear':
					//$('#detail_yyyy').val(value);
					$('#detail_startDate').val(value + '-01');
					$('#detail_endDate').val(value + '-12');
					break;
				case 'endYear':
					//$('#detail_yyyy').val(value);
					$('#detail_startDate').val(value + '-01');
					$('#detail_endDate').val(value + '-12');
					break;
				case 'userSubjectCode':
					$('#detail_subjectid').val(value);
					break;
				}
			});
			setTimeout(function(){$('#btn_search').click()}, 1000);
		}
	}

	initByNewTab();

});
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
