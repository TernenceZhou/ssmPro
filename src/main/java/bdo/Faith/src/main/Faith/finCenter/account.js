$(document).ready(function() {
	uiBlocksApi(false, 'init');
	
	var account_table = 'account_table';
	var $account_table = $('#account_table');
	
	// 查询条件
	// 客户
	getUserCustomers('account_customerId');
	//  日期设置
	$('#account_year').datepicker({
		autoclose : true,
		todayHighlight : true,
		language : 'zh-CN', // 语言设置
		format : 'yyyy', // 日期显示格式
		minViewMode : 2
	});
	let startyear = window.CUR_PROJECT_START_YEAR;
	if (window.transferedMenu) {
		startyear = window.BDO_YEAR_SELECT + '';
		window.BDO_CUSTOMER_SELECT = window.BDO_CUSTOMER_SELECT_temp;
		window.BDO_YEAR_SELECT = window.BDO_YEAR_SELECT_temp;
		window.transferedMenu = false;
	}
	$('#account_monthtype').html(ComboLocalDicOption(true, '分月模式'));
	$('#account_startmonth, #account_endmonth').html(ComboLocalDicOption(false, 'month'));
	$('#account_subjectlevel').html(ComboLocalDicOption(false, '科目级别'));
	$('#account_singlelevel, #account_notzero, #account_rejectvou, #account_othercurr').html(ComboLocalDicOption(false, 'boolean'));
	$('#account_amounttype').html(ComboLocalDicOption(true, '金额类型'));

	// 默认搜索条件
	$('#account_monthtype, #account_amounttype, #account_amountmin, #account_amountmax').val('');
	$('#account_singlelevel, #account_notzero, #account_rejectvou, #account_othercurr').val('0');
	$('#account_startmonth').val('01');
	$('#account_endmonth').val('12');
	$('#account_subjectlevel').val('00');
		if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	$('#account_year').val(startyear);
	
	// 客户,年度 改变 科目树更新
	$('#account_customerId,#account_year').change(function() {
		var tree = $('#subject_tree');
		if (tree.hasClass('treeview')) {
			tree.tree('reset');
			tree.tree('destory');
		}
	});
	
	// 余额表 不分月 表参数
	var account_view1 = {
		localParam : {
			tabNum : true,
			url : 'finCenter/Account.getAccount.json',
			urlparam : {
				menuId : window.sys_menuId
			}
		},
		tableParam : {}

	};
	// 余额表 分月 表参数
	var account_view2 = {
		localParam : {
			tabNum : true,
			url : 'finCenter/Account.getAccount.json',
			urlparam : {
				menuId : window.sys_menuId
			}
		},
		tableParam : {}
	};
	
	// 搜索按钮
	$('#account_search').click(function() {
		$(this).parents('.block').next('.block').find('span[name="cus_select"]').text('【' + $('#account_customerId option:selected').text() + '】');
		// 校验参数
		if ($('#account_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#account_year').val() == '') {
			$('#account_year').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		if ($('#account_startmonth').val() > $('#account_endmonth').val()) {
			$('#account_startmonth').focus();
			bdoInfoBox('提示', '结束月份不能小于开始月份');
			return;
		}
		// 账套过期时间
		getValidDate($('#account_customerId').val(), $('#account_year').val(), 'validDate');
		if ($('#account_monthtype').val() == '') {
			account_view1.tableParam = accCol($('#account_othercurr').val());
			account_view1.localParam.urlparam.jsonData = getAccparam();
			account_view1.localParam.urlparam.lockProjectId = $('#account_customerId').val();
			account_view1.localParam.urlparam.lockYyyy = $('#account_year').val();
			jsq(account_view1.tableParam, account_table);
			BdoDataTable(account_table, account_view1);
		} else {
			account_view2.tableParam = accmonthCol($('#account_othercurr').val());
			account_view2.localParam.urlparam.jsonData = getAccparam();
			account_view2.localParam.urlparam.lockProjectId = $('#account_customerId').val();
			account_view2.localParam.urlparam.lockYyyy = $('#account_year').val();
			jsq(account_view2.tableParam, account_table);
			BdoDataTable(account_table, account_view2);
		}
		$account_table.on('xhr.dt', function(e, settings, json, xhr) {
			if (json.recordsTotal > 0) {
				$('#account_export').css('display', 'block');
				$('#account_export_dg').css('display', 'block');
			} else {
				$('#account_export').css('display', 'none');
				$('#account_export_dg').css('display', 'none');
			}
		});
		
		// 双击显示科目分类账
		$account_table.find('tbody').on('dblclick', 'tr', function() {
			var object = $account_table.DataTable().data()[$(this).closest('tr').index()];
			accountledagerTab('tab_account', $('#account_customerId').val(), object.yyyy, object.subjectId);
		});
	});
	
	// 计算器功能
	$account_table.on('click', 'td', function() {
		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_account_table').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_account_table').val('(' + data + ')');
			} else {
				$('#suanshi_account_table').val(data);
			}
			$('#jieguo_account_table').val(data);
		} else {
			value = $('#suanshi_account_table').val();
			jieguo = $('#jieguo_account_table').val();
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
				$('#suanshi_account_table').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_account_table').val(value + '+' + data);
			}
			$('#jieguo_account_table').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 计算器重置
	$('#jsq_clear_account_table').on('click', function() {

		$('#suanshi_account_table').val('');
		$('#jieguo_account_table').val('');
	});
	
	// 一览列表导出
	$('#account_export').click(function() {
		if ($('#account_monthtype').val() == '') {
			exportExcelFin(this, '余额表一览', account_view1, account_table);
		} else {
			exportExcelFin(this, '余额表一览', account_view2, account_table);
		}
	});
	
	// 导出到底稿附件 打开Tb附件框
	$('#account_export_dg').click(function() {
		var customerId = $('#account_customerId').val();
		var customername = $('#account_customerId option:selected').text();
		if ($('#account_monthtype').val() == '') {
			ecportToDg(customerId, customername, account_view1);
		} else {
			ecportToDg(customerId, customername, account_view2);
		}
	});
	function onExport(event) {
		let data = huoqunode();
		if (data) {
			data.title = '余额表一览';
			if ($('#account_monthtype').val() == '') {
				data.view = account_view1;
			} else {
				data.view = account_view2;
			}
			data.table = account_table;
			data.customerId = $('#account_customerId').val();
			exportExcelTo(this, data);
		}
	}
	$('#modal_tbsubjectid_sure').click(onExport);
	
	// 行按钮 显示核算
	$account_table.on('click', 'button[name="accassitem"]', function() {
		var object = $account_table.DataTable().data()[$(this).closest('tr').index()];
		assitemViewTab('tab_account', $('#account_customerId').val(), object.yyyy, $('#account_monthtype').val(), $('#account_startmonth').val(), $('#account_endmonth').val(), object.subjectId, object.currency);
	});
	// 行按钮 科目结构分析
	$account_table.on('click', 'button[name="subAnalysis"]', function() {
		var object = $account_table.DataTable().data()[$(this).closest('tr').index()];
		subjectAnalysisTab('tab_account', $('#account_customerId').val(), object.yyyy, $('#account_startmonth').val(), $('#account_endmonth').val(), object.subjectId);
	});
	
	/** 检索条件设置 */
	function getAccparam() {
		return JSON.stringify({
			monthType : $('#account_monthtype').val(),
			startMonth : $('#account_startmonth').val(),
			endMonth : $('#account_endmonth').val(),
			subjectId : $('#account_subjectid').val(),
			subjectLevel : $('#account_subjectlevel').val(),
			singleLevel : $('#account_singlelevel').val(),
			notZero : $('#account_notzero').val(),
			vouReject : $('#account_rejectvou').val(),
			otherCurr : $('#account_othercurr').val()
		});
	}
	
	// 选择科目
	$('#account_subjectid').focus(function() {
		if ($('#account_customerId').val() == '') {
			$('#account_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#account_year').val() == '') {
			$('#account_year').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid').modal('show');
		if ($('#subject_tree').hasClass('treeview')) {
			return;
		}
		$('#subject_tree').tree({
			url : 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params : {
				lockProjectId : $('#account_customerId').val(),
				lockYyyy : $('#account_year').val(),
				searchInputId : 'searchInput1'
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
	$('#modal_subjectid_sure').click(function() {
		var selectValue = $('#subject_tree').tree('getTreeMultiValue');
		if (typeof (selectValue) === 'object') {
			$('#account_subjectid').val('');
		} else {
			$('#account_subjectid').val(selectValue);

		}
		$('#modal_subjectid').modal('hide');
	});
	$('#modal_subjectid_reset').click(function() {
		$('#subject_tree').tree('reset');
	});
	
	// 余额表 列
	function accCol(currType) {
		let tableColIndex = 1;
		let tableCol = {
			select : true,
			lengthChange : false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering : true,
			fixedThead : true,
			fixedHeight : '500px',
			order : [ 2, 'asc' ],
			ordering : true,
			serverSide : true,
			columnDefs : [
			{
				targets : tableColIndex ++,
				orderable : false,
				className : 'text-center',
				title : '处理',
				width : '40px',
				render : function(data, type, row, meta) {
					var renderStr = '';
					if (row.isLeaf1 == '1' && row.hasAssItem == '1') {
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="accassitem" data-placement="top" title="显示核算" data-toggle="tooltip"><i class="fa fa-eye"></i></button>';
					}
					if (row.isLeaf1 == '0') {
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="subAnalysis" data-placement="top" title="分析" data-toggle="tooltip"><i class="fa fa-pie-chart"></i></button>';
					}
					return renderStr;
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '科目编号',
				name : 'subjectId',
				data : 'subjectId',
				width : '50px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '科目名称',
				name : 'fullName',
				data : 'fullName',
				width : '150px'
			}, {
				targets : tableColIndex ++,
				className : 'text-center',
				title : '币种',
				name : 'currency',
				data : 'currency',
				width : '20px'
			}, {
				targets : tableColIndex ++,
				className : 'text-center',
				title : '科目方向',
				name : 'direction',
				data : 'direction',
				width : '30px'
			} ]
		};
		if (currType == '1') {
			tableCol.columnDefs.push({
				targets : tableColIndex ++,
				className : 'text-right',
				title : '期初余额<br>外币',
				name : 'remain',
				data : 'remain',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '期初余额<br>本位币',
				name : 'remainF',
				data : 'remainF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '借方发生额<br>外币',
				name : 'debitOcc',
				data : 'debitOcc',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '借方发生额<br>本位币',
				name : 'debitOccF',
				data : 'debitOccF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '贷方发生额<br>外币',
				name : 'creditOcc',
				data : 'creditOcc',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '贷方发生额<br>本位币',
				name : 'creditOccF',
				data : 'creditOccF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '期末余额<br>外币',
				name : 'balance',
				data : 'balance',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
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
				targets : tableColIndex ++,
				className : 'text-right',
				title : '期初余额',
				name : 'remainF',
				data : 'remainF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '借方发生额',
				name : 'debitOccF',
				data : 'debitOccF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '贷方发生额',
				name : 'creditOccF',
				data : 'creditOccF',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
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
		tableCol.initComplete = function() {
			if (tableParam && tableParam.param1 == 'jsq' && $account_table.has) {
				$('#' + account_table + '_info').parent().parent().siblings().eq(1).children('div:last-child').html('<button id="jsq_' + account_table + '">计算器</button>');
				$('#jsq_' + account_table).unbind();
				$('#jsq_' + account_table).click(function() {
					$('#modal_jsq_' + account_table).show();
				});
			}
		};
		tableCol.param1 = 'jsq';
		return tableCol;
	}
	// 余额表 列 分月模式
	function accmonthCol(currType) {
		let tableColIndex = 1;
		let tableCol = {
			select : true,
			lengthChange : false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering : true,
			order : [ 2, 'asc' ],
			serverSide : true,
			fixedThead : true,
			fixedHeight : '500px',
			columnDefs : [
			{
				targets : tableColIndex ++,
				orderable : false,
				className : 'text-center',
				title : '处理',
				width : '40px',
				render : function(data, type, row, meta) {
					var renderStr = '';
					if (row.isLeaf1 == '1') {
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="accassitem" data-placement="top" title="显示核算" data-toggle="tooltip">'
								+ '<i class="fa fa-eye"></i></button>';
					}
					if (row.isLeaf1 == '0') {
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="subAnalysis" data-placement="top" title="分析" data-toggle="tooltip"><i class="fa fa-pie-chart"></i></button>';
					}
					return renderStr;
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '科目编号',
				name : 'subjectId',
				data : 'subjectId',
				width : '50px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '科目名称',
				name : 'fullName',
				data : 'fullName',
				width : '150px'
			}, {
				targets : tableColIndex ++,
				className : 'text-center',
				title : '币种',
				name : 'currency',
				data : 'currency',
				width : '20px'
			}, {
				targets : tableColIndex ++,
				className : 'text-center',
				title : '科目方向',
				name : 'direction',
				data : 'direction',
				width : '30px'
			} ]
		};
		if (currType == '1') {
			for (var i = parseInt($('#account_startmonth').val()); i <= parseInt($('#account_endmonth').val()); i++) {
				tableCol.columnDefs.push({
					targets : tableColIndex ++,
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
					targets : tableColIndex ++,
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
			for (var i = parseInt($('#account_startmonth').val()); i <= parseInt($('#account_endmonth').val()); i++) {
				tableCol.columnDefs.push({
					targets : tableColIndex ++,
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
		tableCol.initComplete = function() {
			if (tableParam && tableParam.param1 == 'jsq' && $account_table.has) {
				$('#' + account_table + '_info').parent().parent().siblings().eq(1).children('div:last-child').html('<button id="jsq_' + account_table + '">计算器</button>');
				$('#jsq_' + account_table).unbind();
				$('#jsq_' + account_table).click(function() {
					$('#modal_jsq_' + account_table).show();
				});
			}
		};
		tableCol.param1 = 'jsq';
		return tableCol;
	}

	$account_table.scroll(function() {
		var scrollTop = $(this).scrollTop();
		if ((scrollTop > that.offsetTop) && (scrollTop < that.maxHeight)) {
			that.$dom.css('top', (scrollTop - that.offsetTop + 50) + 'px'); // 这个50是因为我的头部导航固定在顶部 高是50 所以要加上
		} else {
			var topCss = that.$dom.css('top');
			if (topCss === '0px' || topCss === 'auto') {

			} else {
				that.$dom.css('top', '0px');
			}
		}
	});
});