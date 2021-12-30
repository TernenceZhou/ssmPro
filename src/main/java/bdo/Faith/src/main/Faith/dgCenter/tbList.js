$(document).ready(function() {
	//pageRightTitle(pageTitleArr);

	var table = 'tb_tab';
	var tableCheck = 'tb_tbcheck';
	var projectYear = window.CUR_PROJECT_ACC_YEAR;
	uiBlocksApi(false, 'init');
	/*$('[data-toggle="tabs"]').on('click', 'a', function(e){
			var time = setTimeout(function(){
				//$(document).resize();
				clearTimeout(time)
			},200);
		e.preventDefault();
		$(this).tab('show');
	});*/
	/** 模态框设置 */
	/*$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $(this).css('overflow', 'hidden');
	});*/
	// 客户
	$('#tb_customerId').val(window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);
	var checkMsgMap = {};

	$('#tb_showZero').val(1);

	/** table 属性 */
	var tb_viewCheck = {
		localParam: {
			tabNum: false,
			data: [],
//			url : 'dgCenter/FTBSubjectContract.tbCheckResult.json',
			urlparam: {
				menuId: window.sys_menuId
			}
		},
		tableParam: {
			scrollY: false,
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			rowReorder: {
				update: false
			},
			columnDefs: []
		}
	};

	/** table 属性 */
	var tb_view2 = {
		localParam: {
			tabNum: false,
			data: [],
			url: 'dgCenter/FTBSubjectContract.tbList.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				menuId: window.sys_menuId
			}
		},
		tableParam: {
			scrollY: false,
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			rowReorder: {
				update: false
			},
			columnDefs: []
		}
	};

	//加载datatable
	//loadData();

	/** 搜索按钮 */
	$('#tb_search').click(function() {
		$('#tb_search').blur();
		loadData();
	});
	//未对照，已对照
	$('#showContract').on('change', function() {
		loadData();
	});

	/** 单元格点击事件 */
	/*$('#' + table).on('click', 'td', function() {
		var th = $('#' + table).DataTable().context[0].aoColumns[$(this).index() + 1];
		if (th.name === 'colCode') {
			var data = $('#' + table).DataTable().row($(this).parents('tr')).data();
			$('#formulaSubjectId').val(data.colCode);
			$('#formulaSubjectName').val(data.colCode + '-' + data.colDisp);
			jQuery($('#formulaModal [data-toggle="tabs"] a:eq(0)')).tab('show');
			$('#formulaModal').modal('show');
		}
	});*/

	/** 单元格双击事件 */
	$('#' + table).on('dblclick', 'td', function() {
		var th = $('#' + table).DataTable().context[0].aoColumns[$(this).index() + 1];
		var data = $('#' + table).DataTable().row($(this).parents('tr')).data();
		var adjustType = '2';
		/** 双击调整数穿透显示调整明细 */
		if (!th.name || data.colType == 2) {
			return;
		} else if (th.name.indexOf('adjustAmount') >= 0) {
			adjustType = '2';
		} else if (th.name.indexOf('adjustCAmount') >= 0) {
			adjustType = '1';
		} else if (th.name.indexOf('colCode') >= 0 || th.name.indexOf('colDisp') >= 0) {
			if (data.colCode) {
				window.open('/Faith/bdologin.do?m=gotoDesktop&menuId=40000022&tbSubjectId=' + data.colCode);
			}
			return;
		} else {
			return;
		}
		/*if (data.colType == 2) {
			return;
		}*/
		var yyyy = th.name.substring(th.name.length - 4, th.name.length);
		var subjectType = data.subjectType2;
		if (data.subjectType2 == data.subjectType1 + '99') {
			subjectType = data.subjectType1;
		}
		adjustDetailTab('tab_contract', window.CUR_CUSTOMERID, yyyy, adjustType, data.colCode, subjectType, 'FA10064');
	});

	$('#' + table).on('click', 'td button', function() {
		var dataTable = $('#' + table).dataTable();
		var rowData = dataTable.fnGetData($(this).attr('data-row'));
		// 科目编号
		var subjectId = rowData.colCode;
		// 科目名称
		var subjectName = rowData.colDisp;
		// 所在单元格的值
		var textContent = this.parentElement.lastElementChild.textContent.replace(/,/g, '');
		// 所在的列
		var col = $(this).parents('td').index();
		// 列名
		var colName = this.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.children[col].textContent;
		$('#aliasPosition').val(subjectId + '-' + subjectName + ':' + colName.replace(/[\+\-\=]/g, ''));
		$('#aliasValue').val(textContent);
		$('#subjectId').val(subjectId);
		$('#subjectName').val(subjectName);
		$('#tagYyyy').val(colName.substring(0, 4));
		switch (col.toString()) {
			case '4':
				$('#tagType').val('unAuditAmount');
				break;
			case '5':
				$('#tagType').val('adjustAmount');
				break;
			case '6':
				$('#tagType').val('auditAmount');
				break;
			case '7':
				$('#tagType').val('unAuditAmount');
				break;
			case '8':
				$('#tagType').val('adjustAmount');
				break;
			case '9':
				$('#tagType').val('auditAmount');
				break;
			default:
				break;
		}
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00082',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: $('#aliasPosition').val(),
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success && data.data.length !== 0) {
					// 标签名
					$('#customAlias').val(data.data[0].tagName);
				} else {
					$('#customAlias').val($('#aliasPosition').val().substring(0, 4) + $('#aliasPosition').val().substring($('#aliasPosition').val().indexOf(':') + 1));
				}
				$('#tagSetModal').modal('show');
			}
		});
	});

	$('#setTagBtn').click((event) => {
		if ($('#customAlias').val() == '') {
			$('#customAlias').focus();
			bdoInfoBox('提示', '请输入标签名');
			return;
		}
		if ($('#customAlias').val().indexOf('+') != -1
			|| $('#customAlias').val().indexOf('-') != -1
			|| $('#customAlias').val().indexOf('=') != -1) {
			$('#customAlias').focus();
			bdoInfoBox('提示', '标签名不能含有+、-、=');
			return;
		}
		let tagInfo = [];
		tagInfo.push({
			type: 'db',
			dbName: 'bdo_dg.dg_tbtable',
			selectParam: 'unAuditAmount, adjustAmount, auditAmount',
			whereParam: ' customerId = ' + window.CUR_CUSTOMERID + ' AND projectId = ' + window.CUR_PROJECTID + ' AND yyyy = ' + $('#tagYyyy').val() + ' AND tbSubjectId = \'' + $('#subjectId').val() + '\' AND ACTIVE_FLAG = \'1\'',
			field: $('#tagType').val(),
			subjectId: $('#subjectId').val(),
			subjectName: $('#subjectId').val() + '-' + $('#subjectName').val()
		});
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgCheck.setTag.json',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: $('#customAlias').val(),
				param4: $('#aliasValue').val(),
				param5: $('#aliasPosition').val(),
				param6: JSON.stringify(tagInfo),
				param8: 'db',
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#tagSetModal').modal('hide');
				} else {
					$('#customAlias').focus();
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});

	/** 刷新TB */
	$('#tb_createReport').click(function() {
		$('#tb_createReport').blur();
		/*if($('#tb_customerId').val() == ''){
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if($('#tb_startYear').val() == ''){
			bdoInfoBox('提示', '请选择账套年度');
			return;
		}*/


//		var objects = $('#example').DataTable().data();
//		console.log(objects);
//		
//		 for(let index in objects) {  
//		        console.log(objects[index].tbSubjectName);
//		        if(objects[index].tbSubjectName==null){
//		        	if(objects[index].remain!=0 && objects[index].balance!=0){
//		        		bdoErrorBox('提示','TB科目未完全对照，无法生成TB');
//		        		return;
//		        	}
//		        	
//		        }
//		    }

		/*var startYear = $('#tb_startYear').val();
	
		if($('#tb_endYear').val() == ''){
			$('#tb_endYear').val(startYear);
		}
		var endYear = $('#tb_endYear').val();*/

		//var _thisBlock = $(this).closest('.block');

		//var customer = $('#tb_customerId option:selected').text().split('-');
		/*var year = startYear;
		if (startYear != endYear){
			year = startYear + '～' + endYear
		}*/

		bdoConfirmBox('系统提示', '确定要重新生成【' + window.CUR_CUSTOMERNAME + '】<br>' + '试算平衡表吗？<font' +
			' color=red>重新生成后原来的试算平衡表将被删除！</font>', function() {
			bdoInProcessingBox('生成中');
			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.createTB.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID/*,
					param2 : $('#tb_startYear').val(),
					param3 : $('#tb_endYear').val()*/
				},
				dataType: 'json',
				//beforeSend: function(){  //开始loading
				//	_thisBlock.addClass("block-opt-refresh");
				//},
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('操作成功', data.resultInfo.statusText);
						$('#tb_search').click();
						// loadData();
					} else {
						var error = data.resultInfo.statusText.search('TB科目对照');
						if (error > 0) {
							bdoConfirmBox('操作失败', data.resultInfo.statusText, function() {
								$('a[href="#tab_tbContract"]').click();
							});
						} else {
							bdoErrorBox('操作失败', data.resultInfo.statusText);
						}
					}
				}
				// complete: function(){   //结束loading
				// 	_thisBlock.removeClass("block-opt-refresh");
				// }
			});
		});


	});

	/** 调整按钮 */
	$('#tb_adjust').click(function() {

		//判断未审报表是否已生成
		$.ajax({
			type: 'post',
			url: 'dgCenter/FTBSubjectContract.checkExist.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID
			},
			dataType: 'json',
			success: function(data) {
				if (data.data[0].chekFlag == 1) {
					journalAdjust(CUR_CUSTOMERID, $('#tb_endYear').val(), '', '', '2', function() {
						loadData();
					});
				} else {
					bdoErrorBox('系统提示', year + '年试算平衡表不存在，不能调整！');
				}
			}

		});
	});


	/** 重置按钮 */
	$('#tb_clear').click(function() {
		/*$('#tb_customerId').val('').trigger("change");		
		$('#tb_startYear').val(CUR_PROJECT_START_YEAR);
		$('#tb_endYear').val(CUR_PROJECT_END_YEAR);*/
		$('#tb_showZero').val(1);
	});

	function exportTBToDg(title, table_view) {
		var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
		var myParams = applyIf({}, table_view.localParam.urlparam);
		delete  myParams.sort;
		myParams.page = '';
		myParams.start = '';
		myParams.limit = '';
		myParams.queryUrl = table_view.localParam.url;
		myParams.columnMap = columnInfo;
		myParams = JSON.stringify(myParams);
		title = encodeURI(title);
		var param = {
			menuId: window.sys_menuId,
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: myParams
		};

		$.ajax({
			url: 'dgCenter/ExportOtherDg.exportTbTbl.json',
			data: param,
			type: 'post',
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if (data.data && data.data.length > 0) {
						let dataString = data.data[0].fileData;
						let fileName = data.data[0].fileName;
						let isNew = data.data[0].isNew;
						bdoInfoBox('成功', fileName + '导出成功！');
						saveAs(dataURLtoFile(dataString, fileName), fileName);
						/*if(!isNew) {

						}*/
						getSubjecttree({
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_PROJECTID,
							param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
						}, data => {
							$('.js-tree-collapsed').trigger('rebuild', [{
								data: [data.data[0].treeData],
								levels: 3,
								callback(tree) {
									$.each(tree.findNodes(), (index, tnode) => {
										if (tnode.extraOptions.nodeType == 'TRIALBALANCE') {
											tree.expandNode(tnode.nodeId, {levels: (tnode.deep + 2), silent: true});
											tree.selectNode(tnode.nodeId, {silent: true});
										}
									});
								}
							}]);
						});
					}
				} else {
					bdoErrorBox('失败', data.resultInfo && data.resultInfo.statusText);
				}
			}
		});
	}

	/** 导出 */
	$('#tb_export').click(function() {
		let export_view = $.extend({}, true, tb_view2);
		var param = {
			'menuId': window.sys_menuId,
			'param1': window.CUR_CUSTOMERID,
			'param4': $('#tb_showZero').val()
		};
		export_view.localParam.url = 'dgCenter/FTBSubjectContract.exportTbTable.json';
		export_view.localParam.urlparam = param;
		// exportExcel(this, '试算平衡表', export_view, table);
		let export_view2 = $.extend({}, true, tb_view2);
		export_view2.localParam.url = 'dgCenter/FTBSubjectContract.tbListAndCheck.json';
		export_view2.localParam.urlparam = {
			'menuId': window.sys_menuId,
			'param1': window.CUR_CUSTOMERID,
			'refreshFlg': '1',
			'param2': projectYear,
			'param3': projectYear,
			'param4': $('#showContract').val()
		};
		exportTBToDg('试算平衡表', export_view2);
	});

	/** 导出APT-TB */
	$('#tb_export_APT').click(function() {
		let tableConfig = $('#' + table).dataTable().fnGetBdoConfig();
		let columnInfo = BdoFaithUtil.getColumnsInfo(tableConfig.tableParam.columnDefs);
		let myParams = $.extend({}, tableConfig.localParam.urlparam); // applyIf({},table_view.localParam.urlparam);
		myParams.sort && delete  myParams.sort;
		myParams.page = '';
		myParams.start = '';
		myParams.limit = '';
		myParams.queryUrl = 'dgCenter/FTBSubjectContract.tbListAndCheck.json';
		myParams.urlparam = {
			'menuId': window.sys_menuId,
			'param1': window.CUR_CUSTOMERID,
			'param2': projectYear,
			'refreshFlg': '1',
			'param3': projectYear,
			'param4': $('#showContract').val()
		};
		myParams.columnMap = columnInfo;
		return BdoFaithUtil.saveAs('dgCenter/FTBSubjectContract.exportAPTTbTbl.json', '' + '.xlsx', {
			requestData: {
				myParams: JSON2.stringify(myParams),
				title: encodeURI('试算平衡表_APT')
			},
			method: 'POST'
		});
	});

	/** 加载数据 */
	function loadData() {
		var startYear = projectYear;

		/*if($('#tb_endYear').val() == ''){
			$('#tb_endYear').val(startYear);
		}*/
		var endYear = projectYear;

		$.ajax({
			type: 'post',
			url: 'dgCenter/FTBSubjectContract.tbListAndCheck.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param1': window.CUR_CUSTOMERID,
				'param2': projectYear,
				'param3': projectYear,
				'refreshFlg': '1',
				'param4': $('#showContract').val()
			},
			dataType: 'json',
			success: function(data) {
				if ($('#' + tableCheck).hasClass('dataTable')) {
					$('#' + tableCheck).DataTable().clear();
					$('#' + tableCheck).DataTable().destroy();
					$('#' + tableCheck).empty();
				}
				if ($('#' + table).hasClass('dataTable')) {
					$('#' + table).DataTable().clear();
					$('#' + table).DataTable().destroy();
					$('#' + table).empty();
				}
				if (data.resultInfo.status != '0') {
					if (data.data && data.data.length > 0) {
						bdoConfirmBox('提示', data.resultInfo.statusText, function() {
							$('a[href="#tab_tbContract"]').click();
						});
						return;
					}
					bdoInfoBox('提示', data.resultInfo.statusText);
					return;
				}
				var data = data.data[0];


				tb_view2.localParam.data = data.tbList;
				tb_view2.tableParam = createColumn(projectYear, projectYear);
				BdoDataTable(table, tb_view2);
				checkMsgMap = data.checkMsg;
				//showHead(tableCheck);
				// data.assetFormula
				tb_viewCheck.localParam.data = data.checkResult;
				tb_viewCheck.tableParam = createColumnCheck(projectYear, projectYear);
				BdoDataTable(tableCheck, tb_viewCheck);
				//hideHead(tableCheck);
			}
		});
	}

	function createColumn(startYear, endYear) {

		var tbColumns = {
			scrollY: 450,
			scrollCollapse: true,
			fixedColumns: true,
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			/*fixedThead: true,
			fixedHeight: '480px',*/
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center width-seq',
					title: '序号',
					//width: '60px',
					visible: true,
					render: function(data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				},
				{
					targets: 1,
					orderable: false,
					className: 'hidden',
					title: '处理',
					data: null,
					//width: '60px'
				},
				{
					targets: 2,
					orderable: false,
					className: 'text-left width-subject-id',
					title: 'TB科目编号',
					name: 'colCode',
					data: 'colCode',
					//width: '120px'
				}, {
					targets: 3,
					className: 'text-left width-subject-name',
					orderable: false,
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					//width: '220px',
					render: function(data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return '&nbsp;&nbsp;&nbsp;&nbsp;' + data;
						}
					}
				}
			]
		};


		var colNum = 3;
		for (var i = startYear; i <= endYear; i++) {
			var thisYear = i;
			tbColumns.columnDefs.push({
				targets: colNum + 1,
				className: 'text-right width-je',
				orderable: false,
				title: i + '年<br>未审数',
				name: 'unAuditAmount' + i,
				data: 'unAuditAmount' + i,
				//width: '180px',
				render: function(data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						//+ row['adjustCAmount' + thisYear]
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					/*
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px;" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="4">'
					  +'<i class="fa fa-edit"></i>'
					  +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					*/
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});
			/*tbColumns.columnDefs.push({
				targets : colNum + 2,
				className : 'text-right',
				title : i + '年<br>客户调整数',
				name : 'adjustCAmount'+i,
				data : 'adjustCAmount'+i,
				width : '100px',
				render: function(data, type, row, meta){
					var html = formatMoney(data);
					if (row.adjustFlag == '1' || row.adjustFlag == '3') {
						html = '<span style="background-color: #53f9f9;width: 90%;margin: 0 0 0 auto;display: block;">' + html + '</span>';
					}
					return html;
				}
			});*/
			tbColumns.columnDefs.push({
				targets: colNum + 2,
				orderable: false,
				className: 'text-right width-je',
				title: i + '年<br>审计调整数',
				name: 'adjustAmount' + i,
				data: 'adjustAmount' + i,
				//width: '180px',
				render: function(data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					var html = formatMoney(val);
					if (row.colType =='1'){
						if (val !='0'&&val !='--' ){
							html = '<label style="font-size: 10px;position: relative;top:5px;">' +
								'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
								'</label>';
							return html;
						}
					}



					/*if (row.adjustFlag == '2' || row.adjustFlag == '3') {
						html = '<label style="font-size: 10px;position: relative;top:5px;">' +
							'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
							'</label>';
						return html;
					}*/
					/*
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="5">'
					  +'<i class="fa fa-edit"></i>'
					  +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;left: 2px;top: 5px">' + html + '</label>';
					*/
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});

			tbColumns.columnDefs.push({
				targets: colNum + 3,
				orderable: false,
				className: 'text-right width-je',
				title: i + '年<br>审定数',
				name: 'auditAmount' + i,
				data: 'auditAmount' + i,
				//width: '180px',
				render: function(data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					/*
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px;" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="6">'
					  +'<i class="fa fa-edit"></i>'
					  +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;top: 5px;">' + val + '</label>';
					*/
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});
			if (i < endYear) {
				tbColumns.columnDefs.push({
					targets: colNum + 4,
					orderable: false,
					className: 'text-right',
					title: '',
					width: '20px'
				});
			}

			colNum = colNum + 4;

		}


		/**
		 *新增上期数据
		 */
		var last = startYear - 1;

		for (var i = last; i <= last; i++) {
			tbColumns.columnDefs.push({
				targets: colNum,
				orderable: false,
				className: 'text-right width-je',
				title: i + '年<br>未审数',
				name: 'unAuditAmount' + i,
				data: 'unAuditAmount' + i,
				//width: '180px',
				render: function(data, type, row, meta) {
					var val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						//+ row['adjustCAmount' + i]
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					/*
                    var render = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px;" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="4">'
                        +'<i class="fa fa-edit"></i>'
                        +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;top: 5px;">'+val+'</label>';
                    */
					var render = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return render;

				}
			});
			tbColumns.columnDefs.push({
				targets: colNum + 1,
				orderable: false,
				className: 'text-right width-je',
				title: i + '年<br>审计调整数',
				name: 'adjustAmount' + i,
				data: 'adjustAmount' + i,
				//width: '180px',
				render: function(data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						// 负数无法正常显示
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					var html = formatMoney(val);
					//审计调整没有上年
					// if (row.adjustFlag == '2' || row.adjustFlag == '3') {
					// 	html = '<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>';
					// }
					/*
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px;" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="5">'
					  +'<i class="fa fa-edit"></i>'
					  +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;top: 5px">' + html + '</label>';
					*/
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});

			tbColumns.columnDefs.push({
				targets: colNum + 2,
				orderable: false,
				className: 'text-right width-je',
				title: i + '年<br>审定数',
				name: 'auditAmount' + i,
				data: 'auditAmount' + i,
				//width: '180px',
				render: function(data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					/*
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;position: relative;top: 0px;" data-placement="top" title="设置标签" data-row="'+meta.row+'" data-col="6">'
					  +'<i class="fa fa-edit"></i>'
					  +'</button>' + '&nbsp;&nbsp;&nbsp;<label style="font-size: 10px;position: relative;top: 5px;">' + val + '</label>';
					*/
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});
			if (i < last) {
				tbColumns.columnDefs.push({
					targets: colNum + 3,
					orderable: false,
					className: 'text-right',
					title: '',
					width: '20px'
				});
			}
			colNum = colNum + 4;
		}


		return tbColumns;
	}

	function createColumnCheck(startYear, endYear) {


		var tbColumns = {
			scrollY: false,
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: false,
			/*fixedThead: true,*/
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '校验项',
					orderable: false,
					name: 'colDisp',
					data: 'colDisp',
					width: '350px',
					render: function (data, type, row, meta) {
						if (!row.checkFlag) {
							return '<a>' + data + '</a>';
						} else {
							return data;
						}
					}
				}
			]
		};


		var colNum = 1;
		for (var i = startYear; i <= endYear; i++) {
			tbColumns.columnDefs.push({
				targets: colNum + 1,
				orderable: false,
				className: 'text-right',
				title: i + '年<br>未审数',
				name: 'unAuditAmount' + i,
				data: 'unAuditAmount' + i,
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});

			/*tbColumns.columnDefs.push({
				targets : colNum + 2,
				className : 'text-right',
				title : i + '年<br>重分类调整数',
				name : 'adjustCAmount'+i,
				data : 'adjustCAmount'+i,
				width : '100px',
				render: function(data, type, row, meta){
					if (data == 0){
						return '平';
					}else if (data != null){
						return formatMoney(data);
					}
				}
			});*/

			tbColumns.columnDefs.push({
				targets: colNum + 2,
				orderable: false,
				className: 'text-right',
				title: i + '年<br>审计调整数',
				name: 'adjustAmount' + i,
				data: 'adjustAmount' + i,
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});

			tbColumns.columnDefs.push({
				targets: colNum + 3,
				orderable: false,
				className: 'text-right',
				title: i + '年<br>审定数',
				name: 'auditAmount' + i,
				data: 'auditAmount' + i,
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});

			if (i < endYear) {
				tbColumns.columnDefs.push({
					targets: colNum + 4,
					orderable: false,
					className: 'text-right',
					title: '',
					width: '10px'
				});
			}

			colNum = colNum + 4;

		}

		var last = startYear - 1;

		for (var i = last; i <= last; i++) {
			tbColumns.columnDefs.push({
				targets: colNum,
				orderable: false,
				className: 'text-right',
				title: i + '年<br>未审数',
				name: 'unAuditAmount' + i,
				data: 'unAuditAmount' + i,
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});
			tbColumns.columnDefs.push({
				targets: colNum + 1,
				orderable: false,
				className: 'text-right',
				title: i + '年<br>审计调整数',
				name: 'adjustAmount' + i,
				data: 'adjustAmount' + i,
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});

			tbColumns.columnDefs.push({
				targets: colNum + 2,
				orderable: false,
				className: 'text-right',
				title: i + '年<br>审定数',
				name: 'auditAmount' + i,
				data: 'auditAmount' + i,
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			});

			colNum = colNum + 4;

		}
		return tbColumns;
	}

	function showHead(tableId) {
		$('#' + tableId + '_wrapper table').removeClass('table_nohead');
	}


	function hideHead(tableId) {
		$.each($('#' + tableId + '_wrapper table thead tr th'), function(i) {
			var width = this.style.width;
			$.each($('#' + tableId + ' tbody tr td'), function(j) {
				if (i == j) {
					this.style.width = width;
				}
			});
		});

		$('#' + tableId + '_wrapper table').addClass('table_nohead');
	}

	$('#tb_tab').on('click', 'button.table-btn-operate[name="createDgSub"]', (event) => {
		var table = $('#tb_tab').dataTable();
		var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
		$.ajax({
			type: 'post',
			url: 'dgCenter/dgMain.createDgTree.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: '002',
				param2: window.CUR_PROJECTID,
				param3: window.CUR_CUSTOMERID,
				param4: rowData.colDisp,
				param5: rowData.colCode,
				param6: rowData.colCode,
				refreshFlg:1
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					bdoSuccessBox('操作成功', data.resultInfo.statusText);
					//$('#tb_search').click();
					//loadData();
				} else {
					bdoErrorBox('操作失败', data.resultInfo.statusText);
				}
			}
		});
	});
	$('#tb_search').click();

	$('#tab_contract a[href="#tab_adjustdetail"]').find('.fa-times-circle').click(function() {
		// $(this).parents('li').remove();
		// $('#tab_contract li a[href="#tab_adjustdetail"]').parent().removeClass('active');
		$('#tab_contract li a[href="#tab_adjustdetail"]').css('display', 'none');
		$(this).parents('ul').find('li').first().find('a').click();
		// $(this).parents('ul').find('li').first().attr('class','active');
		// $('#tab_adjustdetail').remove();
		return false;
	});


	$('#tb_tbcheck').on('click', 'tr td a', function () {
		let index = $('#tb_tbcheck tr').index($(this).closest('tr'));
		let msg = '';
		let item = '';
		switch (index) {
			case 1:
				let asset = checkMsgMap.asset;
				// let assetLast = checkMsgMap.assetLast;
				let assetFormula = checkMsgMap.assetFormula;
				msg = '';
				// if (asset && asset != ''){
				// 	msg += '本年：';
				// 	msg += asset;
				// 	// msg += '\r\n';
				// 	// msg += '<br\>';
				// }
				// if (assetLast && assetLast != ''){
				// 	msg += '上年：';
				// 	msg += assetLast;
				// }
				item += '公式：'
				item += asset;
				item += '<br>';
				item += getFormulaTable(assetFormula);
				// item += '<br>';
				let errorContrastData = checkMsgMap.errorContrast;
				if (errorContrastData && errorContrastData.length > 0) {
					let errorContrastTable = getSubjectTable(errorContrastData);
					item += '错误对照列表';
					item += errorContrastTable;
				}
				let unContrastData = checkMsgMap.unContrast;
				if (unContrastData && unContrastData.length > 0) {
					let unContrastTable = getUnContrastSubjectTable(unContrastData);
					item += '未对照列表';
					item += unContrastTable;
				}
				item += '<br>【<span style="color: #00e7ff;">如已修改对照，请重新生成试算平衡表！</span>】';
				break
			case 2:
				let profit = checkMsgMap.profit;
				// let profitLast = checkMsgMap.profitLast;
				let profitFormula = checkMsgMap.profitFormula;
				let profitMsg = checkMsgMap.profitMsg;
				let profitList = checkMsgMap.profitList;
				item += '公式：'
				item += profit;
				if (profitMsg && profitMsg != '') {
					item += '<br>';
					item += profitMsg;
				}
				item += '<br>';
				item += getFormulaTable(profitFormula)
				if (profitList && profitList.length > 0) {
					item += '未对照列表';
					let unContrastTable = getUnContrastSubjectTable(profitList);
					item += unContrastTable;
				}
				item += '<br>【<span style="color: #00e7ff;">如已修改对照，请重新生成试算平衡表！</span>】';
				break;
			case 3:
				item = checkMsgMap.text
				// bdoInfoBox('提示',checkMsgMap.text)
				break
		}

		// item += `</tbody></table>`;
		// if (index == 3) {
		// 	item = '';
		// }
		swal({
			title: '',
			html: item,
			// type: 'info',
			allowOutsideClick: false,
			allowEscapeKey: false,
			customClass: 'swal-tb-formula-alert',
			width: 650,
			// timer: timeout
		}).catch(swal.noop);
	});

	/**
	 * 生成科目展示表格
	 * @param assetFormula
	 * @returns {string}
	 */
	function getSubjectTable(assetFormula) {
		let item = `<div style="max-height: 300px;overflow-y: auto">
								<table class="table table-bordered table-striped table-hover dataTable no-footer">
								<thead>
								<th class="text-left width-subject-id">科目编号</th>
								<th class="text-left width-subject-name">科目名称</th>
								<th class="text-left width-subject-id">TB科目编号</th>
								<th class="text-left width-subject-name">TB科目名称</th>
								<th class="text-right width-je">期初数</th>
								<th class="text-right width-je">借方发生额</th>
								<th class="text-right width-je">贷方发生额</th>
								<th class="text-right width-je">期末数</th>
								<th class="text-center">年份</th>
								<th class="text-center width-direction" >方向</th>
								</thead>
								<tbody>`;
		for (let i = 0; i < assetFormula.length; i++) {
			// remain,debitTotalOcc,creditTotalOcc,balance,yyyy,direction
			let ele = assetFormula[i];
			item += `<tr>`;
			item += `<td class="text-left width-subject-id">${ele.userSubjectId}</td>`;
			item += `<td class="text-left width-subject-name">${ele.userSubjectName}</td>`;
			item += `<td class="text-left width-subject-id">${ele.tbSubjectCode}</td>`;
			item += `<td class="text-left width-subject-name">${ele.tbSubjectName}</td>`;
			item = append(item, ele);

		}
		item += `</tbody></table></div>`;
		return item;
	}

	/**
	 * 通用追加方法
	 * @param item HTML数据
	 * @param ele 行数据
	 * @returns {*}
	 */
	function append(item, ele) {
		item += `<td class="text-right width-je">${formatMoney(ele['remain'])}</td>`;
		item += `<td class="text-right width-je">${formatMoney(ele['debitTotalOcc'])}</td>`;
		item += `<td class="text-right width-je">${formatMoney(ele['creditTotalOcc'])}</td>`;
		item += `<td class="text-right width-je">${formatMoney(ele['balance'])}</td>`;
		item += `<td class="text-center">${ele['yyyy']}</td>`;
		item += `<td class="text-center width-direction" style="width: 50px;">${DicVal2Nm(ele['direction'], '借贷方向')}</td>`;
		item += `</tr>`;
		return item;
	}

	/**
	 * 未对照数据表格生成方法
	 * @param assetFormula 未对照数据
	 * @returns {string}
	 */
	function getUnContrastSubjectTable(assetFormula) {
		let item = `<div style="max-height: 300px;overflow-y: auto">
								<table class="table table-bordered table-striped table-hover dataTable no-footer">
								<thead>
								<th class="text-left width-subject-id">科目编号</th>
								<th class="text-left width-subject-name">科目名称</th>
								<th class="text-right width-je">期初数</th>
								<th class="text-right width-je">借方发生额</th>
								<th class="text-right width-je">贷方发生额</th>
								<th class="text-right width-je">期末数</th>
								<th class="text-center">年份</th>
								<th class="text-center width-direction" >方向</th>
								</thead>
								<tbody>`;
		for (let i = 0; i < assetFormula.length; i++) {
			// remain,debitTotalOcc,creditTotalOcc,balance,yyyy,direction
			let ele = assetFormula[i];
			item += `<tr>`;
			item += `<td class="text-left width-subject-id">${ele.userSubjectId}</td>`;
			item += `<td class="text-left width-subject-name">${ele.userSubjectName}</td>`;
			item = append(item, ele);
		}
		item += `</tbody></table></div>`;
		return item;
	}


	/**
	 * 生成校验公式表格
	 * @param assetFormula 校验公式数据
	 * @returns {`<div style="max-height: 300px;overflow-y: auto">
								<table class="table table-bordered table-striped table-hover dataTable no-footer">
								<thead>
								<th class="text-left width-subject-id">科目编号</th>
								<th class="text-left width-subject-name">科目名称</th>
								<th class="text-right width-je">${*}未审数</th>
								<th class="text-right width-je">${number}未审数</th>
								</thead>
								<tbody>`}
	 */
	function getFormulaTable(assetFormula) {
		let year = CUR_PROJECT_ACC_YEAR;
		let item = '';
		let lastYear = year - 1;
		item = `<div style="max-height: 300px;overflow-y: auto">
								<table class="table table-bordered table-striped table-hover dataTable no-footer">
								<thead>
								<th class="text-left width-subject-id">科目编号</th>
								<th class="text-left width-subject-name">科目名称</th>
								<th class="text-right width-je">${year}未审数</th>
								<th class="text-right width-je">${lastYear}未审数</th>
								</thead>
								<tbody>`;
		for (let i = 0; i < assetFormula.length; i++) {
			let ele = assetFormula[i];
			item += `<tr>`;
			item += `<td class="text-left width-subject-id">${ele.colCode}</td>`;
			item += `<td class="text-left width-subject-name">${ele.colDisp}</td>`;
			item += `<td class="text-right width-je">${formatMoney(ele['unAuditAmount' + year])}</td>`;
			// item += `<td class="text-right width-je">${formatMoney(ele['adjustAmount' + year])}</td>`;
			// item += `<td class="text-right width-je">${formatMoney(ele['auditAmount' + year])}</td>`;
			item += `<td class="text-right width-je">${formatMoney(ele['unAuditAmount' + lastYear])}</td>`;
			// item += `<td class="text-right width-je">${formatMoney(ele['adjustAmount' + lastYear])}</td>`;
			// item += `<td class="text-right width-je">${formatMoney(ele['auditAmount' + lastYear])}</td>`;
			item += `</tr>`;
		}
		item += `</tbody></table></div>`;
		return item;
	}
});