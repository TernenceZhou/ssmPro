$(document).ready(() => {
	//uiBlocksApi(false, 'init');
	// 客户
	getUserCustomers('recoverSales_customerId');
	$('#recoverSales_year').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy', //日期显示格式
		minViewMode: 2
	});
	$('#recoverSales_year').val(window.CUR_PROJECT_ACC_YEAR);
	
	// 选择科目
	$('#recoverSales_subjectid').focus(function() {
		if ($('#recoverSales_customerId').val() == '') {
			$('#recoverSales_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#recoverSales_year').val() == '') {
			$('#recoverSales_year').focus();
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
				lockProjectId : $('#recoverSales_customerId').val(),
				lockYyyy : $('#recoverSales_year').val(),
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
			$('#recoverSales_subjectid').val('');
		} else {
			$('#recoverSales_subjectid').val(selectValue);

		}
		$('#modal_subjectid').modal('hide');
	});
	$('#modal_subjectid_reset').click(function() {
		$('#subject_tree').tree('reset');
	});
	//核算科目
	$('#recoverSales_assitemid').focus(function() {
		if ($('#recoverSales_customerId').val() == '') {
			$('#recoverSales_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#recoverSales_year').val() == '') {
			$('#recoverSales_year').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		if ($('#recoverSales_subjectid').val() == '') {
			$('#recoverSales_assitemid').blur();
			bdoInfoBox('提示', '请选择科目');
			return;
		}
		$('#modal_assitemid').modal('show');
		if ($('#assitem_tree').hasClass('treeview')) {
			return;
		}
		$('#assitem_tree').tree2({
			url: 'finCenter/FinTreeCommon.findSubjectAssitem.json',
			params: {
				lockProjectId: $('#recoverSales_customerId').val(),
				lockYyyy: $('#recoverSales_year').val(),
				param11: $('#recoverSales_subjectid').val(),
				searchInputId: 'searchInputAssitem'
			},
			singleSelect: false,
			//lazyLoad: false,
			//onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: true,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
		});
	});
	$('#modal_assitemid_sure').click(function() {
		if (typeof($('#assitem_tree').tree2('getTreeMultiValue')) == 'object') {
			$('#recoverSales_assitemid').val('');
		} else {
			$('#recoverSales_assitemid').val($('#assitem_tree').tree2('getTreeMultiValue'));
		}
		$('#modal_assitemid').modal('hide');
	});
	$('#modal_assitemid_reset').click(function() {
		$('#assitem_tree').tree2('reset');
		$('#searchInputAssitem').keyup();
	});
	// 对方科目
	$('#recoverSales_oppositeSubjectid').focus(function() {
		if ($('#recoverSales_customerId').val() == '') {
			$('#recoverSales_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#recoverSales_year').val() == '') {
			$('#recoverSales_year').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_oppositeSubjectid').modal('show');
		if ($('#subject_tree_opposite').hasClass('treeview')) {
			return;
		}
		$('#subject_tree_opposite').tree({
			url : 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params : {
				lockProjectId : $('#recoverSales_customerId').val(),
				lockYyyy : $('#recoverSales_year').val(),
				searchInputId : 'searchInput_opposite'
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
	$('#modal_subjectid_opposite_sure').click(function() {
		var selectValue = $('#subject_tree_opposite').tree('getTreeMultiValue');
		if (typeof (selectValue) === 'object') {
			$('#recoverSales_oppositeSubjectid').val('');
		} else {
			$('#recoverSales_oppositeSubjectid').val(selectValue);

		}
		$('#modal_oppositeSubjectid').modal('hide');
	});
	$('#modal_subjectid_opposite_reset').click(function() {
		$('#subject_tree_opposite').tree('reset');
	});
	
	function getSubject() {
		$.ajax({
			type: 'post',
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			data: {
				lockProjectId: window.BDO_CUSTOMER_SELECT,
				lockYyyy: window.CUR_PROJECT_ACC_YEAR
			},
			dataType: 'json',
			bdolxLoader: false,
			success: function(result) {
				if (result.data && result.data.length > 0) {
					var tempSubject = "";
					var tempOppositeSubject = "";
					for(var i=0;i<result.data.length;i++){
						var label = result.data[i].label.split('-');
						for(var j=0;j<label.length;j++){
							if(label[j] == '应收账款'){
								tempSubject = tempSubject + result.data[i].id;
							}
							if(label[j] == '主营业务收入'){
								tempOppositeSubject = tempOppositeSubject + result.data[i].id + ',';
							}
							if(label[j] == '其他业务收入'){
								tempOppositeSubject = tempOppositeSubject + result.data[i].id + ',';
							}
							
						}
					}
					if(tempOppositeSubject.length > 0){
						tempOppositeSubject=tempOppositeSubject.substring(0,tempOppositeSubject.length-1);
					}
					$('#recoverSales_subjectid').val(tempSubject);
					$('#recoverSales_oppositeSubjectid').val(tempOppositeSubject);
				}
			}
		});
	}

	// table_view
	let tableColIndex = 1;
	var recoverSales_view = {
		localParam : {
			tabNum : true,
			url : 'finCenter/RecoverSales.queryRecoverSalesList.json',
			urlparam : {
				menuId : window.sys_menuId
			}
		},
		tableParam : {
			select : true,
			lengthChange : false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering : true,
			fixedThead : true,
			fixedHeight : '500px',
			//order : [ 2, 'asc' ],
			ordering : false,
			serverSide : true,
			columnDefs : [
			{
				targets : tableColIndex ++,
				className : 'text-left',
				title : '编号',
				name : 'companyId',
				data : 'companyId',
				width : '50px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '名称',
				name : 'companyName',
				data : 'companyName',
				width : '150px'
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '期初余额',
				name : 'remain',
				data : 'remain',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '借方发生额',
				name : 'debitOcc',
				data : 'debitOcc',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '贷方发生额',
				name : 'creditOcc',
				data : 'creditOcc',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '期末余额',
				name : 'balance',
				data : 'balance',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '本期核销',
				name : 'writeOffValue',
				data : 'writeOffValue',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '应收账款回收额',
				name : 'recover',
				data : 'recover',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '应收账款占用及发生额',
				name : 'occurValue',
				data : 'occurValue',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-center',
				title : '应收账款回收率',
				name : 'recoverRate',
				data : 'recoverRate',
				width : '150px'
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '本期销售',
				name : 'salesValue',
				data : 'salesValue',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '所属行业',
				name : 'industry',
				data : 'industry',
				width : '150px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '所属地区',
				name : 'areaPlace',
				data : 'areaPlace',
				width : '150px'
			}]
		}

	};
	// 搜索按钮
	$('#recoverSales_search').click(function() {
		// 校验参数
		if ($('#recoverSales_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#recoverSales_year').val() == '') {
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		if ($('#recoverSales_subjectid').val() == '') {
			bdoInfoBox('提示', '请选择科目');
			return;
		}
		if ($('#recoverSales_keyword').val() == '') {
			bdoInfoBox('提示', '请设置摘要关键字');
			return;
		}
		if ($('#recoverSales_oppositeSubjectid').val() == '') {
			bdoInfoBox('提示', '请选择对方科目');
			return;
		}

		recoverSales_view.localParam.urlparam.lockProjectId = $('#recoverSales_customerId').val();
		recoverSales_view.localParam.urlparam.lockYyyy = $('#recoverSales_year').val();
		recoverSales_view.localParam.urlparam.param1 = $('#recoverSales_subjectid').val();
		if($('#recoverSales_assitemid').val() != ''){
			var recoverSales_assitemid = "'" + $('#recoverSales_assitemid').val().replace(/,/g,"','") + "'";
			recoverSales_view.localParam.urlparam.param2 = recoverSales_assitemid;
		}else{
			recoverSales_view.localParam.urlparam.param2 = '';
		}
		recoverSales_view.localParam.urlparam.param3 = $('#recoverSales_keyword').val();
		if($('#recoverSales_oppositeSubjectid').val() != ''){
			var recoverSales_oppositeSubjectid = "'" + $('#recoverSales_oppositeSubjectid').val().replace(/,/g,"','") + "'";
			recoverSales_view.localParam.urlparam.param4 = recoverSales_oppositeSubjectid;
		}else{
			recoverSales_view.localParam.urlparam.param4 = '';
		}
		BdoDataTable('recoverSales_table', recoverSales_view);
	
		$('#recoverSales_table').on('xhr.dt', function(e, settings, json, xhr) {
			if (json.recordsTotal > 0) {
				$('#recoverSales_export').css('display', 'block');
			} else {
				$('#recoverSales_export').css('display', 'none');
			}
		});
		
	});

	// 一览列表导出
	$('#recoverSales_export').click(function() {
		exportExcelFin(this, '应收账款回收率和本期销售统计', recoverSales_view, 'recoverSales_table');
	});
	
	// 初始化
	init();
	function init() {
		$('#recoverSales_keyword').val('核销|转销');
		getSubject();
	}
});