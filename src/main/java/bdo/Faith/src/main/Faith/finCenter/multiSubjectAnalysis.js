$(document).ready(function() {
	uiBlocksApi(false, 'init');
	/*$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $(this).css('overflow', 'hidden');
	});*/

	var tempAssCustomerName;
	var color1 = '#53f9f9';
	var color2 = '#FF8800';
	var color = '#53f9f9';
	
	//客户 日期设置
	//getCustomerForImport('account_customerId_model');
	//获取客户下拉
	// 客户
	getUserCustomers('multiSubjectAnalysis_customerId');
	getUserCustomers('multiSubjectSet_customerId');
	getUserCustomers('assItemSame_customerId');
	var myDate = new Date();
	var accyear = myDate.getFullYear();//年
	$('#multiSubjectAnalysis_startDate').val(accyear - 1);
	$('#multiSubjectSet_startDate').val(accyear - 1);
	$('#assItemSame_yyyy').val(accyear - 1);

	/** table 属性 */
	var accdetail_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.findFinAssItemSameData.json',
			urlparam: {

				sqlId: 'FIN120001',
				menuId: window.sys_menuId,
//				param1: $('#multiSubjectAnalysis_customerId').val(),
				param2: $('#multiSubjectAnalysis_startDate').val(),
				param3: $('#multiSubjectAnalysis_subjectid').val(),
				lockProjectId: $('#multiSubjectAnalysis_customerId').val(),
				lockYyyy: $('#multiSubjectAnalysis_startDate').val()
			}
		},
		tableParam: {
			select: true,
			scrollX: true,
			scrollCollapse: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			//order: [1, 'asc'],
			pageLength: 30,
			createdRow(row, data, dataIndex) {
				if(tempAssCustomerName != data.assItemCustomerName){
					if(color == color1){
						color = color2;
					}else{
						color = color1;
					}
					tempAssCustomerName = data.assItemCustomerName;
				}
				$(row).children("td").eq(1).css({"background-color":color});
			},
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					className: 'text-center',
					title: '核算客户名称',
					name: 'assItemCustomerName',
					data: 'assItemCustomerName',
					width: '100px'
				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '科目代码全路径',
					name: 'subjectFullId',
					data: 'subjectFullId',
					width: '60px'
				}, {
					targets: 3,
					orderable: false,
					className: 'text-center',
					title: '科目名称全路径',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '60px'
				}, {
					targets: 4,
					orderable: false,
					className: 'text-center',
					title: '核算科目代码',
					name: 'assItemId',
					data: 'assItemId',
					width: '60px'

				}, {
					targets: 5,
					orderable: false,
					className: 'text-center',
					title: '核算科目名称全路径',
					name: 'assTotalName',
					data: 'assTotalName',
					width: '100px'

				}, {
					targets: 6,
					orderable: false,
					className: 'text-right',
					title: '余额',
					name: 'balance',
					data: 'balance',
					width: '60px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};
	//BdoDataTable('multiSubjectAnalysisTable', accdetail_view);

	/** table 属性 */
	var assitemsame_view = {
		localParam: {
			tabNum: true,
			url: 'base/General.query.json',
			urlparam: {

				sqlId: 'FA30065',
				menuId: window.sys_menuId,
//				param1: $('#multiSubjectSet_customerId').val(),
				param2: $('#multiSubjectSet_startDate').val(),
				param3: $('#multiSubjectSet_name').val(),
				lockProjectId: $('#multiSubjectSet_customerId').val()
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: true,
			serverSide: true,
			order: [3, 'asc'],
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
					width: 25

				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: 10,
					render: function(data, type, row, meta) {
						var renderStr = '<input type="hidden" name="tempIndexName" value="' + row.indexName + '">&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="assItemSameDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					className: 'text-left',
					title: '核算客户名称',
					name: 'assItemCustomerName',
					data: 'assItemCustomerName',
					width: 50
				}, {
					targets: 4,
					orderable: true,
					className: 'text-left',
					title: '核算科目代码',
					name: 'assItemId',
					data: 'assItemId',
					width: 30
				}, {
					targets: 5,
					orderable: true,
					className: 'text-left',
					title: '核算科目名称',
					name: 'assItemName',
					data: 'assItemName',
					width: 30
				}, {
					targets: 6,
					orderable: true,
					className: 'text-left',
					title: '核算科目名称全路径',
					name: 'assTotalName',
					data: 'assTotalName',
					width: 30
				}, {
					targets: 7,
					orderable: true,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: 30,
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 100px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}
				}, {
					targets: 8,
					orderable: true,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: 30,
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 100px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
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
			num = '0' + num;
		}
		return num;
	}


	/** 搜索按钮 */
	$('#btn_multiSubjectAnalysis_search').click(function() {
		if ($('#multiSubjectAnalysis_customerId').val() == '') {
			$('#multiSubjectAnalysis_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#multiSubjectAnalysis_startDate').val() == '') {
			$('#multiSubjectAnalysis_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		// 账套过期时间
		getValidDate($('#multiSubjectAnalysis_customerId').val(), $('#multiSubjectAnalysis_startDate').val(), 'validDate');
		accdetail_view.localParam.urlparam.lockProjectId = $('#multiSubjectAnalysis_customerId').val();
//		accdetail_view.localParam.urlparam.param1 = $('#multiSubjectAnalysis_customerId').val();
		accdetail_view.localParam.urlparam.param2 = $('#multiSubjectAnalysis_startDate').val();
		accdetail_view.localParam.urlparam.lockYyyy = $('#multiSubjectAnalysis_startDate').val();
		var subjectIds = $('#multiSubjectAnalysis_subjectid').val();
		if(subjectIds != null && subjectIds != ''){
			var obj = subjectIds.split(',');
			var subject = '(';
			for(var i=0;i<obj.length;i++){
				subject = subject + '\'' + obj[i] + '\',';
			}
			subject=subject.substring(0,subject.length-1);
			subject = subject + ')';
			accdetail_view.localParam.urlparam.param3 = subject;
		}else{
			accdetail_view.localParam.urlparam.param3 = '';
		}
		BdoDataTable('multiSubjectAnalysisTable', accdetail_view);

		$('#subjectlist_block').show();
		$('#multiSubjectAnalysisTable').on('xhr.dt', function(e, settings, json, xhr) {

			/*let tableId = 'account_table';*/
			if (json.recordsTotal > 0) {
				$('#multiSubjectAnalysis_export').css('display', 'block');
				$('#multiSubjectAnalysis_export_dg').css('display', 'block');
			} else {
				$('#multiSubjectAnalysis_export').css('display', 'none');
				$('#multiSubjectAnalysis_export_dg').css('display', 'none');
			}

		});
		/** 行双击 */
		$('#multiSubjectAnalysisTable tbody').on('dblclick', 'tr', function() {
			var object = $('#multiSubjectAnalysisTable').DataTable().data()[$(this).closest('tr').index()];
			assitemLedagerTab('tab_multiSubjectAnalysis', $('#multiSubjectAnalysis_customerId').val(), object.subYearMonth, object.accId, object.assItemId);
		});
	});

	/** 搜索按钮 */
	$('#btn_multiSubjectSet_search').click(function() {
		if ($('#multiSubjectSet_customerId').val() == '') {
			$('#multiSubjectSet_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#multiSubjectSet_startDate').val() == '') {
			$('#multiSubjectSet_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		assitemsame_view.localParam.urlparam.lockProjectId = $('#multiSubjectSet_customerId').val();
		assitemsame_view.localParam.urlparam.lockYyyy = $('#multiSubjectSet_startDate').val();
//		assitemsame_view.localParam.urlparam.param1 = $('#multiSubjectSet_customerId').val();
		assitemsame_view.localParam.urlparam.param2 = $('#multiSubjectSet_startDate').val();
		assitemsame_view.localParam.urlparam.param3 = $('#multiSubjectSet_name').val();
		BdoDataTable('multiSubjectSetTable', assitemsame_view);

	});

	//选择科目
	$('#multiSubjectAnalysis_subjectid').focus(function() {
		if ($('#multiSubjectAnalysis_customerId').val() == '') {
			$('#multiSubjectAnalysis_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#multiSubjectAnalysis_startDate').val() == '') {
			$('#multiSubjectAnalysis_startDate').focus();
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
				lockProjectId: $('#multiSubjectAnalysis_customerId').val(),
				lockYyyy: $('#multiSubjectAnalysis_startDate').val(),
				searchInputId: 'searchInput1'
			},
			singleSelect: false,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: true,
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
			$('#multiSubjectAnalysis_subjectid').val('');
		} else {
			$('#multiSubjectAnalysis_subjectid').val(selectValue);

		}
		$('#modal_subjectid').modal('hide');
	});
	$('#modal_subjectid_reset').click(function() {
		$('#subject_tree').tree('reset');
	});


	//选择科目
	$('#assItemSame_assitemid').focus(function() {
		if ($('#assItemSame_customerId').val() == '') {
			$('#assItemSame_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#assItemSame_yyyy').val() == '') {
			$('#assItemSame_yyyy').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_assitemid').modal('show');
		if ($('#assitem_tree').hasClass('treeview')) {
			return;
		}
		/*$('#assitem_tree').tree({
			url: 'cpBase/TreeCommon.findAssitemType.json',
			params: {
				param9: $('#assItemSame_customerId').val(),
				param10: $('#assItemSame_yyyy').val(),
				param11: '',
				searchInputId: 'searchInput2'
			},
			singleSelect: false,
			lazyLoad: false,
			onceLoad: false,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: true,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
		});*/
		multiAssitem_view.localParam.urlparam.param2 = $('#assItemSame_yyyy').val();
		multiAssitem_view.localParam.urlparam.param3 = $('#multiAssitem_name').val();
		multiAssitem_view.localParam.urlparam.lockProjectId = $('#assItemSame_customerId').val();
		multiAssitem_view.localParam.urlparam.lockYyyy = $('#assItemSame_yyyy').val();
		BdoDataTable('multiAssitemtable', multiAssitem_view);
		//判断是否是第一次加载，非第一次进这个方法
		/*if ($(this).attr('isTree') == '1') {
			$('#multiSubjectSet_assitemid').removeAttr('istree');
			$('#multiSubjectSet_assitemid').removeAttr('autocomplete');
			$('#multiSubjectSet_assitemid').removeAttr('data-result');
			$('#multiSubjectSet_assitemid').removeAttr('data-content');
			$('#multiSubjectSet_assitemid').removeAttr('data-contentdata');
			$('span').remove('.caret');
		}

		$('#multiSubjectSet_assitemid').treecombo({
			url: 'cpBase/TreeCommon.findAssitemType.json',
			params: {
				param9: $('#multiSubjectSet_customerId').val(),
				param10: $('#multiSubjectSet_startDate').val(),
				param11: ''

			},
			singleSelect: false,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: true,
				multiSelect: true
			}
		});*/
	});
	$('#modal_assitemid_sure').click(function() {
		/*var selectValue = $('#assitem_tree').tree('getTreeMultiValue');
		if (typeof(selectValue) === 'object') {
			$('#assItemSame_assitemid').val('');
		} else {
			$('#assItemSame_assitemid').val(selectValue);

		}*/
		var jqEl = $('input[name="assItemSelect"]:checked');
		var selectIds = [];
		$.each(jqEl, (index, el) => {
			selectIds.push(el.value);
		});
		if (selectIds.length < 1) {
			bdoErrorBox('', '未选择数据！');
			return;
		}
		$('#assItemSame_assitemid').val(selectIds.join(','));
		$('#modal_assitemid').modal('hide');
	});
	$('#modal_assitemid_reset').click(function() {
		$('#assitem_tree').tree('reset');
	});

	/** 添加对照按钮 */
	$('#multiSubjectSet_add').click(function() {

		$('#modal-multiSubjectAdd').modal('show');
		$('#assItemSame_name').val('');
		$('#assItemSame_assitemid').val('');
		
	});

	//保存
	$('#assItemSame_submit').on('click', function() {
		if ($('#assItemSame_customerId').val() == '') {
			$('#assItemSame_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#assItemSame_yyyy').val() == '') {
			$('#assItemSame_yyyy').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		if ($('#assItemSame_name').val() == '') {
			$('#assItemSame_name').focus();
			bdoInfoBox('提示', '请输入核算客户名称');
			return;
		}
		if ($('#assItemSame_assitemid').val() == '') {
			$('#assItemSame_assitemid').focus();
			bdoInfoBox('提示', '请选择核算科目');
			return;
		}
		bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'finCenter/MultiSubjectAnalysis.saveAssItemSame.json',
				type: 'post',
				data: {
					lockProjectId: $('#assItemSame_customerId').val(),
//					param1: $('#assItemSame_customerId').val(),
					param2: $('#assItemSame_yyyy').val(),
					param3: $('#assItemSame_name').val(),
					param4: $('#assItemSame_assitemid').val(),
					lockYyyy: $('#assItemSame_yyyy').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						//$('#multiSubjectSetTable').DataTable().ajax.reload(null,false);
						$('#btn_multiSubjectSet_search').click();
						$('#modal-multiSubjectAdd').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	//删除对照
	$('#multiSubjectSetTable').on('click', 'button[name="assItemSameDelete"]', function() {
		var object = $('#multiSubjectSetTable').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('删除', '确认删除对照？', function() {
			$.ajax({
				url: 'finCenter/MultiSubjectAnalysis.deleteAssItemSame.json',
				type: 'post',
				data: {
					param1: object.autoId,
					lockProjectId:''
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#multiSubjectSetTable').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	getSubject();
	function getSubject() {
		$.ajax({
			type: 'post',
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			data: {
				lockProjectId: window.BDO_CUSTOMER_SELECT,
				lockYyyy: $('#multiSubjectAnalysis_startDate').val()
			},
			dataType: 'json',
			bdolxLoader: false,
			success: function(result) {
				if (result.data && result.data.length > 0) {
					var tempSubject = "";
					for(var i=0;i<result.data.length;i++){
						var label = result.data[i].label.split('-');
						for(var j=0;j<label.length;j++){
							if(label[j] == '应收账款'){
								tempSubject = tempSubject + result.data[i].id + ',';
							}
							if(label[j] == '其他应收款'){
								tempSubject = tempSubject + result.data[i].id + ',';
							}
							if(label[j] == '预付账款'){
								tempSubject = tempSubject + result.data[i].id + ',';
							}
							if(label[j] == '应付账款'){
								tempSubject = tempSubject + result.data[i].id + ',';
							}
							if(label[j] == '其他应付款'){
								tempSubject = tempSubject + result.data[i].id + ',';
							}
							if(label[j] == '预收账款'){
								tempSubject = tempSubject + result.data[i].id + ',';
							}
							if(label[j] == '长期应收款'){
								tempSubject = tempSubject + result.data[i].id + ',';
							}
							if(label[j] == '长期应付款'){
								tempSubject = tempSubject + result.data[i].id + ',';
							}
						}
					}
					if(tempSubject.length > 0){
						tempSubject=tempSubject.substring(0,tempSubject.length-1);
					}
					$('#multiSubjectAnalysis_subjectid').val(tempSubject);
				}
			}
		});
	}

	/** table 属性 */
	var multiAssitem_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {
				sqlId: 'FIN120002',
				menuId: window.sys_menuId,
//				param1: $('#assItemSame_customerId').val(),
				param2: $('#assItemSame_yyyy').val(),
				param3: $('#multiAssitem_name').val(),
				lockProjectId: $('#assItemSame_customerId').val(),
				lockYyyy: $('#assItemSame_yyyy').val()
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			pageLength: 10,
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					title: 'ID',
					className: 'text-center',
					name: 'id',
					data: 'id',
					visible: false,
					width: 15
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '勾选',
					name: 'assItemName',
					data: 'assItemName',
					width: 15,
					render: function(data, type, row, meta) {
						var renderStr = '<input type="checkbox" name="assItemSelect" value="' + row.id + '"></input>';
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					className: 'text-center',
					title: '核算科目代码',
					name: 'assItemId',
					data: 'assItemId',
					width: 30
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '核算科目名称全路径',
					name: 'label',
					data: 'label',
					width: 30

				}
			]
		}
	};

	/** 搜索按钮 */
	$('#multiAssitem_search').click(function() {
		if ($('#assItemSame_customerId').val() == '') {
			$('#assItemSame_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#assItemSame_yyyy').val() == '') {
			$('#assItemSame_yyyy').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		multiAssitem_view.localParam.urlparam.param2 = $('#assItemSame_yyyy').val();
		multiAssitem_view.localParam.urlparam.param3 = $('#multiAssitem_name').val();
		multiAssitem_view.localParam.urlparam.lockProjectId = $('#assItemSame_customerId').val();
		multiAssitem_view.localParam.urlparam.lockYyyy = $('#assItemSame_yyyy').val();
		BdoDataTable('multiAssitemtable', multiAssitem_view);

	});
	/** 导出 */
	$('#multiSubjectAnalysis_export').click(function() {
		exportExcelFin(this, '多科目一览', accdetail_view, 'multiSubjectAnalysisTable');
	});

	/** 导出到底稿附件  打开Tb附件框 */
	$('#multiSubjectAnalysis_export_dg').click(function() {

		var customerId = $('#multiSubjectAnalysis_customerId').val();

		var customername = $('#multiSubjectAnalysis_customerId option:selected').text();
		ecportToDg(customerId, customername, accdetail_view);

	});
	function onExport(event) {
		let data = huoqunode();

		if (data) {
			data.title = '多科目一览';
			data.view = accdetail_view;
			data.table = 'multiSubjectAnalysisTable';
			data.customerId = $('#multiSubjectAnalysis_customerId').val();
			exportExcelTo(this, data);
		} else {

		}
	}
	/*导出到底稿附件*/
	$('#modal_tbsubjectid_sure').click(onExport);
});
