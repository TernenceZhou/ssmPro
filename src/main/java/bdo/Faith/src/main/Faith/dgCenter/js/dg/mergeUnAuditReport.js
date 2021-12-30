function MergeUnAuditReport(args) {
	var _template
		, _data
		, mount
		, cnt
		, listener
		, dgAttachTable;
	_template = args.template || tplLoader('dgCenter/html/dg/mergeUnAuditReport.html');
	args.template = _template;
	$(args.region).html(_template);
	$('#headtitle').empty().text(args.data.text);
	var projectYear = window.CUR_PROJECT_ACC_YEAR;
	var vocationId = '';
	var vocationName = '';

	pageRightTitle(pageTitleArr);
	let reportEditId;
	var table = 'rpt_tab';

	//存储页面填写数字
	var customerAmoutMap = {'qy': {'1': {}, '2': {}}};


	/** 页面列表初始化参数。*/
	let adjust_report_view = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: true,
			// order: [[2, 'asc']],
			fixedThead: true,
			fixedHeight: '480px',
			/*scrollY : 480,
			scroller : true,
			colReorder : true,*/

			/*fnInitComplete : function(setting, data) {
				var i = 0;
				$('.group.group-start').each(function(index, node){
					var j = $(node).index();
					if (j - i == 1) {
						$(node).remove();
					}
					i = j;
				});
			},*/
			rowGroup: {
				dataSrc: 'indexId',
				startRender: null,
				endRender: function(rows, data) {
					$(rows.nodes()).css('background', 'white');
					$(rows.nodes()).each(function(index, node) {
						if (!index) {
							$(this).find('td').eq(0).attr('rowspan', rows[0].length);
							// $(this).find('td').eq(1).attr('rowspan', rows[0].length);
						} else {
							$(this).find('td').eq(0).hide();
							// $(this).find('td').eq(1).hide();
						}
						// if ($(this).find('td').eq(0).html() == '') {
						// 	$(this).css('background-color', 'rgb(255, 255, 120)');
						// }
					});
					var $endTr = $(rows.nodes()).last().next();
					if ($endTr.children().length == 1) {
						$endTr.remove();
					}
					var $tableInfo = $('#' + $(rows.nodes()).eq(0).closest('table').attr('id') + '_info b');
					var $table = $(rows.nodes()).eq(0).closest('table');
					if (!rows[0][0]) {
						$tableInfo.html(0);
					}
					$tableInfo.html(parseInt($tableInfo.html()) + 1);
					$table.find('td').css('border-width', '1px');
				}
				//className : 'adjust-group-row1'
			},
			serverSide: true,
			columnDefs: [
/*				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '100px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						var styleName = '';
						// renderStr += '<button class="btn btn-xs btn-success" type="button" name="adEdit" data-placement="top" title="修改" data-toggle="tooltip" ' + styleName + '><i class="fa fa-edit"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="adDelete" data-placement="top" title="删除" data-toggle="tooltip" ' + styleName + '><i class="fa fa-times"></i></button>&nbsp;';
						renderStr += '<button style="display : none" name="offset_autoId">' + row.autoId + '</button>';
						// renderStr += '<button class="btn btn-xs btn-success" type="button" name="adBan" data-placement="top" title="调整" data-toggle="tooltip" ' + styleName + '><i class="fa fa-openid"></i></button>&nbsp;';
						// renderStr += '<button class="btn btn-xs btn-danger" type="button" name="adBan" data-placement="top" title="不调整" data-toggle="tooltip" ' + styleName + '><i class="fa fa-ban"></i></button>&nbsp;';
						// renderStr += '<button name="accpackYear" style="display : none">' + row.subjectYear + '</button>';
						return renderStr;

					}
				},*/ {
					targets: 1,
					className: 'text-left adjust-row-text',
					title: '索引号',
					orderable: false,
					name: 'indexId',
					data: 'indexId',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 2,
					className: 'text-left adjust-row-text',
					orderable: false,
					title: '摘要',
					name: 'digest',
					data: 'digest',
					width: '200px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 3,
					className: 'text-left adjust-row-text',
					orderable: false,
					title: '科目名称',
					name: 'tbSubjectName',
					data: 'tbSubjectName',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 4,
					className: 'text-left adjust-row-text',
					title: '科目编号',
					orderable: false,
					name: 'tbSubjectCode',
					data: 'tbSubjectCode',
					width: '60px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 5,
					className: 'text-right adjust-row-text',
					title: '借方金额',
					orderable: false,
					name: 'deb',
					data: 'deb',
					width: '80px',
					render: function (data, type, row, meta) {
						if (row.direction > 0) {
							return formatMoney(row.occValue);
						}
						return '';
					}
				}, {
					targets: 6,
					className: 'text-right adjust-row-text',
					orderable: false,
					title: '贷方金额',
					name: 'cre',
					data: 'cre',
					width: '80px',
					render: function (data, type, row, meta) {
						if (row.direction < 0) {
							return formatMoney(row.occValue);
						}
						return '';
					}
				}, {
					targets: 7,
					className: 'text-center',
					orderable: false,
					title: '状态',
					name: 'ACTIVE_FLAG',
					data: 'ACTIVE_FLAG',
					renderer: 'getDicLabelByVal|activeFlag',
					width: '45px',
					render: function(data, type, row, meta) {
						return DicVal2Nm(data, 'activeFlag');
					}
				},

				{
					targets: 8,
					className: 'text-left adjust-row-text',
					orderable: false,
					title: '未调整原因',
					name: 'reason',
					data: 'reason',
					width: '200px',
					render: function(data, type, row, meta) {
						data = data ? data : '';
						return '<span title=' + data + '>' + data + '</span>';
					}
				},
				{
					targets: 9,
					className: 'text-center',
					orderable: false,
					title: '调整年份',
					name: 'yyyy',
					data: 'yyyy',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 10,
					className: 'text-center',
					orderable: false,
					title: '制单人',
					name: '__ufillUserName',
					data: '__ufillUserName',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + row.__ufillUserNameName + '>' + row.__ufillUserNameName + '</span>';
					}
				}, {
					targets: 11,
					className: 'text-center',
					orderable: false,
					title: '最后更新时间',
					name: 'lastUpdateDate',
					data: 'lastUpdateDate',
					width: '130px',
					render: function(data, type, row, meta) {
						return '<span title="' + data + '">' + data + '</span>';
					}
				}]
		}
	};

	Counteract({region: '#sideRegin', data: args, adjustTyle: '1'});
	$('#sideRegin').hide();

	//存储
	var thisPageConfig = {
		id: 'zc_report1_table',  	//当前表格id
		showType: '1',				//当前为期初/期末
		TABLE_DIV: '1',			//当前报表类型
		showZero: '2',				//当前显示方式
		rptName: {'1': '资产负债表', '3': '利润表', '4': '现金流量表', '5': '所有者权益变动表'}
	};

	uiBlocksApi(false, 'init');

	// 模板
	$.ajax({
		url: 'dgCenter/DgAdjust.findProjectInfo.json',
		type: 'post',
		async: true,
		data: {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: window.CUR_CUSTOMERID, param2: window.CUR_PROJECTID, param3: window.CUR_PROJECT_ACC_YEAR
		},
		dataType: 'json',
		success: function (data) {
			if (data.success) {
				vocationId = data.data[0].tbReportTemplate;
				vocationName = data.data[0].tbReportTemplateName;
				reportEditId = data.data[0]['ext'].unReportEditer;
				if (CUR_USERID == reportEditId) {
					$('#rpt_adjustReport').show();
				}
				setSelect();
			} else {
				bdoErrorBox('提示', data.resultInfo.statusText);
			}
		}
	});

	function setSelect() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgProject.getProjectMember.json',
			//async : false,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID,
				param2: window.CUR_CUSTOMERID
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					let reportEdit = '<option value="" label="" />';
					data.data.map(item => {
						// if (reportEditId ==  item.id) {
						// 	reportEdit+='<option style="color: #000000"  value="'+ item.id+'" label="'+item.name+'" selected />';
						// }else {
						reportEdit += '<option style="color: #000000"  value="' + item.id + '" label="' + item.name + '" />';
						// }
						// return {id: item.id, text: item.name, value: item.name};
					});
					$('#report_editer').append(reportEdit);
					$('#report_editer').val(reportEditId);
				} else {
					$('#report_editer').val('');
					bdoErrorBox(data.resultInfo.statusText);
				}
			}
		});
	}

	let node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
	$('#unReportIndex').text('【' + node.extraOptions.indexId.substring(0, node.extraOptions.indexId.indexOf('-')) + '-' + DG_CONST_UNAUDITREPORT_ENDING + '】');
	// $('#headtitle').empty().text("合并表");

	/** table 属性 */
	var rpt_view = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/FUnAuditReport.unAuditReport.json',
			urlparam: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				start: -1,
				refreshFlg: '1'
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-12"tr>>',
			columnDefs: []
		}
	};


	/** 加载数据 */
	function loadData(arg) {

	}

	//初始化，4个表格
	var initFourTable = function () {
		$.ajax({
			url: 'dgCenter/HbMergeReport.queryCashFlowStatement.json',
			type: 'post',
			data: {
				start: -1,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					let text = data.resultInfo.statusText;
					let result = data.data[0];
					if (text) {
						bdoInfoBox('提示', text);
					}
					if (result){
						let xj1 = $.extend(true, {}, rpt_view);
						xj1.tableParam = createTbCloum(result.colNames);
						let xj2 = $.extend(true, {}, rpt_view);
						xj2.tableParam = createTbCloum(result.colNames);
						xj1.localParam.data = result.cur;
						xj2.localParam.data = result.pre;
						BdoDataTable('xj_report_table_1', xj1);
						BdoDataTable('xj_report_table_2', xj2);
					}
					return;
				}
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		});
	};


	Promise.resolve().then(() => {
		OneUI.initHelper('slimscroll');
	});
	function createTbCloum(colNames) {
		if (colNames){
			let tbColumns = {
				select: true,
				dom: '<"row"<"col-sm-12"tr>>',//'<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>'
				serverSide: true,
				lengthChange: false,
				ordering: false,
				scrollX: true,
				fixedColumns: true,
				columnDefs: [
					{
						targets: 1,
						orderable: false,
						className: 'text-center width-seq',
						title: '序号',
						//width: '60px',
						visible: true,
						render: function (data, type, row, meta) {
							return meta.settings._iDisplayStart + meta.row + 1;
						}
					},
					{
						targets: 2,
						orderable: false,
						className: 'text-left width-subject-id',
						title: '科目编号',
						name: 'colCode',
						data: 'colCode',
					},
					{
						targets: 3,
						className: 'text-left width-subject-name',
						orderable: false,
						title: '科目名称',
						name: 'colDisp',
						data: 'colDisp',
						// width: '220px',
						render: function (data, type, row, meta) {
							if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
								return '<b>' + data + '</b>';
							} else {
								return data.replace(/ /g,'&nbsp;');
							}
						}
					}
				]
			};
			let colNum = 4;
			for (let i = 0; i < colNames.length; i++) {
				tbColumns.columnDefs.push({
					targets: colNum + i,
					orderable: false,
					className: 'text-right width-je',
					title: colNames[i],
					name: colNames[i],
					data: colNames[i],
					render: function (data, type, row, meta) {
						let val;
						if (data != null && data != undefined && data != '' && data != 'Null') {
							val = formatMoney(data);
						} else if (data == 0 && data == '0') {
							val = 0;
						} else {
							val = '--';
						}
						var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
						return renderStr;
					}
				});

			}

			tbColumns.columnDefs.push({
				targets: colNames.length+4,
				orderable: false,
				className: 'text-right width-je',
				title: '汇总数',
				name: 'totalNumber',
				data: 'totalNumber',
				render: function (data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});
			tbColumns.columnDefs.push({
				targets: colNames.length+5,
				orderable: false,
				className: 'text-right width-je',
				title: '借方抵消',
				name: 'debtor',
				data: 'debtor',
				render: function (data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});
			tbColumns.columnDefs.push({
				targets: colNames.length+6 ,
				orderable: false,
				className: 'text-right width-je',
				title: '贷方抵消',
				name: 'credit',
				data: 'credit',
				render: function (data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});
			tbColumns.columnDefs.push({
				targets: colNames.length+7,
				orderable: false,
				className: 'text-right width-je',
				title: '合并数',
				name: 'numberMerger',
				data: 'numberMerger',
				render: function (data, type, row, meta) {
					let val;
					if (data != null && data != undefined && data != '' && data != 'Null') {
						val = formatMoney(data);
					} else if (data == 0 && data == '0') {
						val = 0;
					} else {
						val = '--';
					}
					var renderStr = '<label style="font-size: 10px;position: relative;top:5px;">' + val + '</label>';
					return renderStr;
				}
			});
			return tbColumns;
		}
	}

	listener = () => {
		$('#subPageRight  [data-toggle="tabs"]').on('click', 'a', function (e) {
			e.preventDefault();
			if ($('#abs-remain').hasClass('active')) {
				$(this).tab('show');
				return;
			}
			if ($(this).closest('ul').attr('id') == 'tab_unAuditReport' && $(this).parent().index() > 1) {
				$('#tab_head_rpt').hide();
			} else {
				$('#tab_head_rpt').show();
			}
			$(this).tab('show');
		});
		$('#subPageRight [data-toggle="tabs"]').on('shown.bs.tab', function (e) {
			//$(this).resize();
			var upperNode = $('#tab_unAuditReport').find('li[class=active] a');
			thisPageConfig.showType = upperNode.attr('data-content');
			window.showType = thisPageConfig.showType;
			var tempId = upperNode.attr('data-result');
			var lowerNode = $('#' + tempId).find('li[class=active] a');
			thisPageConfig.id = lowerNode.attr('data-result');
			thisPageConfig.TABLE_DIV = lowerNode.attr('data-content');
		});

		/** 单元格双击事件 */
		$('#tab_unAuditReport_content').on('dblclick', 'table tbody tr.edit-able td', function () {

			let colType = '';
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
			if ($table.attr('id').indexOf('qy_report') >= 0) return;
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
			if (thisPageConfig.TABLE_DIV == 3 || thisPageConfig.TABLE_DIV == 4) {
				if (th.name.indexOf('remain') >= 0 || th.name.indexOf('unAuditAmount') >= 0) {
					check = true;
				}
			}


			if (colType == 3 || colType == 1) {
				/** 双击客户报表数字列可编辑 */
				if (th.name.indexOf('customerAmount') >= 0 || th.name.indexOf('customerRemain') >= 0 || check) {
					if (data['colType'] != 1) {
						return;
					}
					if (data['colDisp'].indexOf('合计') > 0 || data['colDisp'].indexOf('总计') > 0) {
						return;
					}
					var oldVal = data[th.name];
					td.html('<span><input type=\'text\' style=\'width:100%; align=right;\'></span>');
					var input = $(this).find('input');
					if (oldVal != 0) {
						input.val(oldVal);
					}
					input.focus();
					input.on('keydown', function (e) {
						if (e.keyCode == 13) {
							//console.log(e);
							input.blur();
						}
					});
					input.on('blur', function () {
						let newVal = $(this).val().toString().replace(/,/g, '');

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
							if (!check) {
								if (dfAm - oldVal < 0) {
									dif.html('<span style=\'color:green;\'>' + '-' + cvs(dfAm - oldVal) + '</span>');
								} else if (dfAm - oldVal > 0) {
									dif.html('<span style=\'color:green;\'>' + cvs(dfAm - oldVal) + '</span>');
								}
							}
						} else if (isNaN(newVal)) {
							td.html(oldVal);
						} else {
							var num = newVal * 1;
							td.html(num.toFixed(2));
							if (!check) {
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
							}
						}
						if (td.html() != data[th.name]) {
							data[th.name] = td.html();
							var name = th.name.substring(0, th.name.length - 4);
							var tmpData = {};
							if (data.colCode in customerAmoutMap) {
								tmpData = customerAmoutMap[data.colCode];
							}
							tmpData[name] = data[th.name];//'colCode':data.colCode,
							customerAmoutMap[data.colCode] = tmpData;
						}
					});
					return;
				}
			}


			/** 双击调整数穿透显示调整明细 */
			/*if (data.colType == 2) {
				return;
			}*/
			if (colType == 2) {
				if (th.name.indexOf('adjustAmount') >= 0 || th.name.indexOf('adjustRemain') >= 0) {
					if (thisPageConfig.showType == '1') {
						adjustDetailTab('tab_unAuditReport', window.CUR_CUSTOMERID, projectYear, 1, data.colCode, data.colCode, 'FA10065', DG_CONST_UNAUDITREPORT_BEGINNING);
					} else if (thisPageConfig.showType == '2') {
						adjustDetailTab('tab_unAuditReport', window.CUR_CUSTOMERID, projectYear, 1, data.colCode, data.colCode, 'FA10065', DG_CONST_UNAUDITREPORT_BEGINNING);
					}
				}
			}

		});

/*
		/!** 保存按钮 *!/
		$('#rpt_save').click(function () {
			$('#rpt_save').blur();
			var tempMap = {};
			tempMap = customerAmoutMap;
			var jsonData = JSON.stringify(tempMap);
			if (jsonData == '{}') {
				bdoInfoBox('提示', '客户报表数字未修改，无需保存！');
				return;
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/FUnAuditReport.editCustomerAmount.json',
				data: {
					param1: window.CUR_CUSTOMERID,
					param2: jsonData,
					param3: thisPageConfig.showType,
					param4: 1,
				},
				dataType: 'json',
				success: function (data) {
					if (data.success) {
						customerAmoutMap = {'qy': {'1': {}, '2': {}}};
						//loadData();
						initFourTable(thisPageConfig.showType);
						// initFourTable('2');
						bdoSuccessBox('保存成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('保存失败', data.resultInfo.statusText);
					}
				}
			});
		});
*/

		/** 刷新按钮 */
		$('#rpt_search').click(function () {
			$('#rpt_search').blur();
			// // loadData();
			// initFourTable('1');
			// initFourTable('2');
			initFourTable(thisPageConfig.showType);
			// if (thisPageConfig.showType&& thisPageConfig.showType == '1'){
			// 	BdoDataTable('rpt_tbcheck', Tbcheck);
			// } else {
			// 	BdoDataTable('rpt_tbcheck', Tbcheck2);
			// }
		});

/*		/!** 刷新未审报表 *!/
		$('#rpt_createReport').click(function () {
			$('#rpt_createReport').blur();
			bdoAjaxBox('系统提示', '确定要生成【' + CUR_CUSTOMERNAME + '】<br>' + projectYear + '年未审报表吗', function () {
				bdoInProcessingBox('生成中');
				$.ajax({
					type: 'post',
					url: 'dgCenter/HbMergeReport.createReport.json',
					data: {
						param1: window.CUR_CUSTOMERID,
						param2: projectYear,
						param3: projectYear
					},
					dataType: 'json',
					success: function (data) {
						if (data.success) {
							bdoSuccessBox('操作成功', data.resultInfo.statusText);
							initFourTable('1');
							initFourTable('2');
							$('#rpt_search').click();//刷新未审报表校验
						} else {
							bdoErrorBox('操作失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});*/


		/** 导入客户报表按钮 */
		$('#rpt_importCustomerReport').click(function () {
			$('#modal-importCustomerReport').modal('show');
			var pluginOpt = {
				dropZoneEnabled: false,
				dropZoneTitle: '',
				dropZoneClickTitle: '',
				browseLabel: '选择文件',
				showCaption: true,
				showRemove: false,
				showUpload: false,
				showBrowse: true,
				showPreview: false,
				required: true,
				initialPreviewShowDelete: true,
				language: 'zh',
				browseOnZoneClick: true,
				showClose: false,
				showCancel: false,
				hideThumbnailContent: true,
				layoutTemplates: {
					actionUpload: '',
					actionZoom: ''
				},
				fileActionSettings: {
					removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
				},
				uploadAsync: true,
				allowedFileExtensions: ['xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlsb', 'xlam', 'jpg', 'png', 'doc', 'docx', 'zip', 'rar', 'pdf'],
				uploadUrl: 'dgCenter/FUnAuditReport.uploadCustomerReport.json',
				uploadExtraData: function () {
					return {
						param1: '',
						param2: ''
					};
				}
			};

			pluginOpt.uploadExtraData = function () {
				return {
					param1: window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME,
					param2: projectYear,
					param3: projectYear,
					param4: (function () {
						return vocationId + '-' + vocationName;
					})()
				};
			};
			var $el = $('#fileinput').fileinput(pluginOpt);

			//uploadAsync = true 时调用
			$el.on('fileuploaded', function (event, data) {
				if (data.response.success) {
					uploadFileSuccess(data);
					// bdoSuccessBox('导入成功');
				} else {
					bdoErrorBox('失败', data.response.resultInfo.statusText);
				}
			});
			//uploadAsync = true 时，后台返回数据data.error 非空是调用
			$el.on('fileuploaderror', function (event, data, msg) {
				$('#fileinput').fileinput('clear');
				$('#fileinput').fileinput('enable');
				bdoErrorBox('系统提示', msg);
			});

			//文件上传成功/失败后，处理后台响应函数
			function uploadFileSuccess(data) {
				$.ajax({
						type: 'post',
						url: 'dgCenter/FUnAuditReport.importCustomerReport.json',
						data: {
							//文件id
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: data.response.data[0].id,
						},
						dataType: 'json',
						success: function (data) {
							if (data.success) {
								bdoSuccessBox('导入成功');
								$('#modal-importCustomerReport').modal('hide');
								$('#fileinput').fileinput('clear');
								$('#fileinput').fileinput('enable');
								// loadData();
								$('#rpt_search').click();
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						},
					}
				);
			}

			//建议文件上传成功之后再提交其他表单数据
			function uploadFile() {
				$el.fileinput('upload');
			}

			/** 导入按钮 */
			$('#import_submit').click(function () {
				uploadFile();
			});
		});

		/** 下载模板按钮 */
		$('#import_dlTemplate').click(function () {
			if (!vocationId) {
				bdoErrorBox('提示', '请先配置报表模板');
				return;
			}
			var params = {
				id: '1',
				menuId: '40000040',
				mainDatasSql: 'FA40017',
				detailDatasSql: 'FA40016',
				param1: window.CUR_CUSTOMERNAME,
				param2: projectYear,
				param3: vocationId,//(function(){return vocationId;})(),
				param4: vocationName,//(function(){return vocationName;})(),
				param5: ''
			};
			// 一次下载 四张表
			exportExcelWithTemplate('./dgCenter/FUnAuditReportTemplate.createExcelFile1.json', params);
			/*		bdoConfirmBox('提示', '是否只下载【' + thisPageConfig.rptName[thisPageConfig.TABLE_DIV] + '】？', function(){
						params.param5 = thisPageConfig.TABLE_DIV;
						exportExcelWithTemplate('./dgCenter/FUnAuditReportTemplate.createExcelFile1.json', params);
					}, function(){
						exportExcelWithTemplate('./dgCenter/FUnAuditReportTemplate.createExcelFile1.json', params);
					});*/
		});

/*		//初始化期初表格
		$('#tab3').on('click', 'a', function () {
			let empty = {'qy': {'1': {}, '2': {}}};
			if (JSON.stringify(customerAmoutMap) !== JSON.stringify(empty)) {
				$('#rpt_save').click();
				// bdoConfirmBox("提示","当前页面信息未保存，是否保存么？",function () {
				//
				// },function () {
				// 	customerAmoutMap = empty;
				// });
			}
			$('#unReportIndex').text('【' + node.extraOptions.indexId.substring(0, node.extraOptions.indexId.indexOf('-')) + '-' + DG_CONST_UNAUDITREPORT_BEGINNING + '】');
			$($('#report2_type li')[3]).show();
			$('#tab_head_rpt').show();
			initFourTable('2');
		});*/
		//
		$('#tab1').on('click', 'a', function () {
			let empty = {'qy': {'1': {}, '2': {}}};
			if (JSON.stringify(customerAmoutMap) !== JSON.stringify(empty)) {
				$('#rpt_save').click();
				// bdoConfirmBox("提示","当前页面信息未保存，是否保存么？",function () {
				// },function () {
				// 	customerAmoutMap=empty;
				// });

			}
			$('#unReportIndex').text('【' + node.extraOptions.indexId.substring(0, node.extraOptions.indexId.indexOf('-')) + '-' + DG_CONST_UNAUDITREPORT_ENDING + '】');
			$($('#report1_type li')[3]).show();
			$('#tab_head_rpt').show();
			initFourTable();
		});

/*		//报表编制人选择
		$('#report_editer').change(function () {
			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.saveTbEditer.json',
				//async : false,
				data: {
					param2: '2',
					param3: $(this).val(),
					param4: $(this).find('option:selected').attr('label')
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox("保存报表编制人成功！");
						// $('#tb_editer').append(tbEditer);
					} else {
						bdoErrorBox(data.resultInfo.statusText);
					}
				}
			});


		});*/
		/**
		 * 生成合并现金流量表
		 */
/*
		$('#rpt_create').click(function () {
			$.ajax({
				type: 'post',
				url: 'dgCenter/HbMergeReport.createCash.json',
				//async : false,
				data: {
					// param2: '2',
					// param3: $(this).val(),
					// param4: $(this).find('option:selected').attr('label')
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox("生成现金流量表成功！");
						// $('#tb_editer').append(tbEditer);
					} else {
						bdoErrorBox(data.resultInfo.statusText);
					}
				}
			});
		});
*/

/*

		$('#cash_offset').click(function() {
			let id = $('#report1_type li[class=active] a').prop('hash');
			if (id === '#xj_report1') {
				$('#offset_dgYear2').text(CUR_PROJECT_ACC_YEAR)
			} else {
				$('#offset_dgYear2').text(CUR_PROJECT_ACC_YEAR - 1)
			}
			//隐藏 分录方式 初始化为抵消方式
			$('#journalizing_way').closest('div').hide();
			$('#journalizing_way').val(3);
			//触发事件
			$('#journalizing_way').trigger('change');
			$('#journalizing_type').closest('div').hide();

			$('#sideRegin').show();
		});
*/


		$('#tab1').click(function () {
			$('#tab_report_offset').hide();
			$('#tab_head_rpt').show();
			$('#tab_unAuditReportser').show();
			initFourTable();
		});


		$('#li_report_offset').click(function () {
			$('#tab_unAuditReportser').hide();
			$('#tab_head_rpt').hide();
			$('#tab_report_offset').show();
			adjust_report_view.localParam.urlparam = {
				menuId: window.sys_menuId,
				sqlId: 'DG00296',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3 : window.CUR_PROJECT_ACC_YEAR-1,
				param4: window.CUR_PROJECT_ACC_YEAR,
				param5: 3,
			};
			BdoDataTable('report_offset_table', adjust_report_view);
		});
		$('#btn_rpt_offset_search').click(function () {
			$('#li_report_offset').click();
		});



	};
	mount = () => {
		listener();
		initFourTable();
	};
	mount();
}