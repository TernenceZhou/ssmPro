function MergeTB(args) {
	var _template
		// , _data
		, mount
		, listener;
	_template = args.template || tplLoader('dgCenter/html/dg/mergeTB.html');
	args.template = _template;
	$(args.region).html(_template);
	$('#headtitle').empty().text(args.data.text);
	args.findMaxIndex = function() {
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
			dataType: 'json',
			async: true,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00038',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				//param3 : CUR_PROJECT_END_YEAR,
				param4: '1'
			},
			success: function(data) {
				if(data.success && data.data && data.data[0]){
					args.maxIndex = data.data[0].maxIndex;
				}
			}
		});
	};
	var adjust = Counteract({region: '#sideRegin', data: args, adjustTyle: '1'});

	// setIndexId = adjust.setIndexId;
	// journal = adjust.journal;
	$('#sideRegin').hide();

	let tbEditerId;
	let projectYear = '';

	function setTbeEditerSelect() {
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
					let tbEditer = '<option value="" label="" />';
					data.data.map(item => {
						if (tbEditerId == item.id) {
							tbEditer += '<option style="color: #000000"  value="' + item.id + '" label="' + item.name + '" selected />';
						} else {
							tbEditer += '<option style="color: #000000"  value="' + item.id + '" label="' + item.name + '" />';
						}
						// return {id: item.id, text: item.name, value: item.name};
					});
					$('#tb_editer').append(tbEditer);
				} else {
					$('#tb_editer').val('');
					bdoInfoBox("提示",data.resultInfo.statusText);
				}
			}
		});
	}

	uiBlocksApi(false, 'init');

	$('#search_customerId').val(window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);
	projectYear = window.CUR_PROJECT_ACC_YEAR;
	let node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
	$('#title_index').text('【' + node.extraOptions.indexId + '】');
	$('#headtitle').empty().text("合并试算平衡表");
	//$('#cus_select1').text('【' + CUR_PROJECTNAME+'   ' + projectYear + '-' + CUR_PROJECT_START_MONTH + '~' + projectYear + '-' + CUR_PROJECT_END_MONTH + '】');
	$('#cus_select2').text('【' + window.CUR_PROJECTNAME + '   ' + projectYear + '-' + window.CUR_PROJECT_START_MONTH + '~' + projectYear + '-' + window.CUR_PROJECT_END_MONTH + '】');

	OneUI.initHelper('slimscroll');
	let table = 'tb_tab';
	let tableCheck = 'tb_tbcheck';


	function createColumnCheck(startYear) {
		let tbColumns = {
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
					width: '422px',
					/*render: function(data, type, row, meta){
							return '<font size=10>' + data + '</font>';
						}*/
				}
			]
		};


		let colNum = 1;
		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right',
			title: startYear + '年<br>未审数',
			name: 'unAuditAmount' ,
			data: 'unAuditAmount' ,
			width: '180px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right',
			title: startYear + '年<br>审计调整数',
			name: 'adjustAmount' ,
			data: 'adjustAmount' ,
			width: '180px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});

		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right',
			title: startYear + '年<br>审定数',
			name: 'auditAmount' ,
			data: 'auditAmount' ,
			width: '180px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});

		let last = startYear - 1;
		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right',
			title: last + '年<br>未审数',
			name: 'preUnAuditAmount',
			data: 'preUnAuditAmount',
			width: '180px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right',
			title: last + '年<br>审计调整数',
			name: 'preAdjustAmount',
			data: 'preAdjustAmount',
			width: '180px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});

		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right',
			title: last + '年<br>审定数',
			name: 'preAuditAmount',
			data: 'preAuditAmount',
			width: '180px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});

		return tbColumns;
	}

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
						render: function (data, type, row, meta) {
							return meta.settings._iDisplayStart + meta.row + 1;
						}
					},
					{
						targets: 2,
						orderable: false,
						className: 'text-left width-subject-id',
						title: 'TB科目编号',
						name: 'colCode',
						data: 'colCode',
						//width: '120px'
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
								return '&nbsp;&nbsp;&nbsp;&nbsp;' + data;
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
	let tb_viewCheck = {
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
	let tb_view2 = {
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
			scrollX: true,
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

	/** 页面列表初始化参数。*/
	let adjust_view = {
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
					title: 'TB科目名称',
					name: 'tbSubjectName',
					data: 'tbSubjectName',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 4,
					className: 'text-left adjust-row-text',
					title: 'TB科目编号',
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
				}, {
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

	function loadData() {
		let year = window.CUR_PROJECT_ACC_YEAR;
		let cur_id = $('#tb_type li[class="active"] a').prop('id');
		if (cur_id && cur_id !== "cur_tb") {
			year = projectYear - 1;
		}
		$.ajax({
			type: 'post',
			url: 'dgCenter/HbMergeTb.tbListAndCheck.json',
			data: {
				'menuId': window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'param1': window.CUR_CUSTOMERID,
				'param2': year,
				'param3': year,
				'param4': $('#showContract').val()
			},
			dataType: 'json',
			success: function (data) {
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
				if (data.success) {
					let result = data.data[0];
					let tb_view = $.extend(true, {}, tb_view2);
					// tb_view.tableParam = createColumn(projectYear, projectYear);
					tb_view.tableParam = createTbCloum(result.colNames);
					tb_view.localParam.data = result.tbData;
					BdoDataTable(table, tb_view);
					let viewCheck = $.extend(true, {}, tb_viewCheck);
					viewCheck.localParam.data = result.checkResult;
					viewCheck.tableParam = createColumnCheck(projectYear);
					BdoDataTable(tableCheck, viewCheck);
				} else {
					if (data.data && data.data.length > 0) {
						bdoConfirmBox('提示', data.resultInfo.statusText, function () {
							bdoInProcessingBox('生成中');
							createTB();
						});
						return;
					}
					bdoInfoBox('提示', data.resultInfo.statusText);
				}
			}
		});
	}

	function createTB() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/HbMergeTb.createTb.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID/*,
					param2 : $('#tb_startYear').val(),
					param3 : $('#tb_endYear').val()*/
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					bdoSuccessBox('操作成功', data.resultInfo.statusText);
					loadData();
				} else {
					bdoErrorBox('操作失败', data.resultInfo.statusText);
				}
			}
		});
	}
	//TB科目操作
	var loadTBbData = function() {
		var init_table_view = {
			localParam: {
				tabNum: true,
				//fixedHeader : {header : true},
				url: 'cpBase/General.query.json',
				urlparam: {
					sqlId: 'DG00057',
					menuId: window.sys_menuId,
					start: -1,
					limit: -1,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				}
			},
			tableParam: {
				select: true,
				lengthChange: false,
				dom: '<"row"<"col-sm-12"tr>>',//'<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>'
				order: [1, 'ASC'],
				setCol: true,
				ordering: false,
				serverSide: true,
				fixedColumns: false,
				rowReorder: {
					update: false
				},
				columnDefs: [{
					targets: 1,
					className: 'text-left width-subject-id',
					index: 1,
					title: '处理',
					data: null,
					render: function(data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="user_tb_edit" data-placement="top" title="修改 " data-toggle="tooltip">'
							+ '<i class="fa fa-edit"></i></button>&nbsp;';

						renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="user_tb_delete" data-placement="top" title="删除 " data-toggle="tooltip">'
							+ '<i class="fa fa-times"></i></button>&nbsp;';
						// 修改tb科目对照
						// if (row.isSubject == 1) {
						// 	renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="user_tb_reContract" data-placement="top" title="修改对照 " data-toggle="tooltip">'
						// 		+ '<i class="fa fa-edit"></i></button>';
						// }
						renderStr += '<input name="autoId" value="' + row.autoId + '" hidden/>';
						return renderStr;
					}
				}, {
					targets: 2,
					index: 2,
					className: 'text-left width-subject-id',
					title: 'TB科目编号',
					name: 'tbSubjectId',
					data: 'tbSubjectId',
				}, {
					targets: 3,
					index: 3,
					className: 'text-left width-subject-name',
					title: 'TB科目名称',
					name: 'tbSubjectName',
					data: 'tbSubjectName',
				}, {
					targets: 4,
					index: 4,
					className: 'text-left width-subject-name',
					title: '报表科目编号',
					name: 'reportSubjectId',
					data: 'reportSubjectId',
				}, {
					targets: 5,
					index: 5,
					className: 'text-left width-subject-name',
					title: '报表科目名称',
					name: 'reportSubjectName',
					data: 'reportSubjectName',
				}, {
					targets: 6,
					index: 6,
					className: 'text-left width-calfun',
					title: '计算公式',
					name: 'calFun',
					data: 'calFun',
					render: function(data, type, row, meta) {
						if (data != null) {
							if (data.length > 35) {
								var str = '<span title="' + data + '">';
								for (var i = 0; i < data.length / 35; i++) {
									str += data.substring(i * 33, (i + 1) * 33) + '<br/>';
								}
								str += '</span>';
								return str;
								/*if(data[34] == '+'){
									return '<span title="'+data+'">'+data.substring(0,33)+'+....'+'</span>'
								}else{
									return '<span title="'+data+'">'+data.substring(0,34)+'+....'+'</span>'
								}*/
							} else {
								return '<span>' + data + '</span>';
							}
						} else {
							return '<span></span>';
						}
					}
				}, {
					targets: 7,
					index: 7,
					className: 'text-center width-subject-name',
					title: '是否科目',
					name: 'isSubject',
					data: 'isSubject',
					render: function(data, type, row, meta) {
						if (data) {
							return '是';
						} else {
							return '否';
						}
					}
				}, {
					targets: 8,
					index: 8,
					className: 'text-center width-seq',
					title: '排序号',
					name: 'sortNo',
					data: 'sortNo',
				}]
			}
		};
		BdoDataTable('user_tb_table', init_table_view);
	};
	var report_view = {
		localParam: {
			tabNum: false,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'FA40046',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param3: '0',
				param4: '0',
				param5: window.CUR_CUSTOMERID,
				param6: window.CUR_PROJECTID
			}
		},
		tableParam: {
			select: true,
			// lengthChange : false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
			serverSide: true,
			//scrollY : 450px,
			dom: '<"row"<"col-sm-12"tr>>',//'<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>'
			// ordering : false,

			infoCallback: function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
				var id = $(this).attr('id'),
					data = $('#tbsubject_table').DataTable().data(),
					already = 0;
				if (data.length > 0) {
					already = data[0].already;
				}
				if (!document.getElementById(id + '_info_next')) {
					return '<div class="dataTables_info" id="' + id + '_info" role="status" aria-live="polite">' + sPre +
						' &nbsp;已对照 ：<span class="tableRefresh" id="' + id + '_info_next">' + already + '</span></div>';
				}
			},
			createdRow(row, data, dataIndex) {
				$(row).find('td:eq(3)').addClass('bg-success-light');
			},
			columnDefs: [{
				targets: 1,
				className: 'text-left',
				orderable: false,
				title: '报表科目编号',
				name: 'colCode',
				data: 'colCode',
				width: '50px'
			}, {
				targets: 2,
				className: 'text-left',
				orderable: false,
				title: '报表科目名称',
				name: 'colDisp',
				data: 'colDisp',
				width: '100px'
			}, {
				targets: 3,
				className: 'text-left',
				title: 'TB科目',
				name: 'tbSubject',
				data: 'tbSubject',
				width: '200px',
				render: function(data, type, row, meta) {
					data = data ? data : '';
					return '<span style="width:auto; display:block; white-space:nowrap;text-overflow:ellipsis; overflow:hidden" title="' + data + '">' + data + '</span>';
				}
			}, {
				targets: 4,
				className: 'text-left',
				orderable: false,
				title: '报表计算公式',
				name: 'cusCalFun',
				data: 'cusCalFun',
				width: '100px'
			}]
		}
	};

	//下拉树初始化
	var initReportTree = function() {
		$('#com_reportSubject').unbind();
		$('#com_reportSubject').treecombo({
			url: 'cpBase/TreeCommon.findReportSubject.json',
			params: {
				param9: tbReportTemplate
			},
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false
			}
		});
		$('#com_isSubject').html(ComboLocalDicOption(false, 'boolean'));
	};
	var tbReportTemplate = '-1';
	projectYear = window.CUR_PROJECT_ACC_YEAR;
	function getTbTemplate(){
		// 初始化 是否科目项 下拉选
		$.ajax({
			url: 'dgCenter/DgAdjust.findProjectInfo.json',
			type: 'post',
			async: true,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID, param2: window.CUR_PROJECTID
			},
			dataType: 'json',
			success: function(data) {
				if (!data.data || !data.data[0].tbTemplate || !data.data[0].tbReportTemplate) {
					//bdoErrorBox('失败', '请先完成项目配置');
					return;
				}
				tbReportTemplate = data.data[0].tbReportTemplate;
			}
		});
	}
	function trim(str){
		return str.replace(/\s/g,"");
	}
	function parseCalFunItems(calFun){
		if (!calFun){
			return [];
		}

		let tmp = calFun.replace(/[-+*\/()]/g, " ");
		return tmp.split(/\s+/).filter(v => v.replace(/\d/g, "") && v.replace(/\d+\.\d+/g, ""));
	}

	function clean(){
		$('#deb_span').val(formatMoney2(0));
		$('#cre_span').val(formatMoney2(0));
		$('#diff_span').val(formatMoney2(0));
	}

	listener = () => {

		//生成合并试算平衡表
/*		$('#tb_createReport').click(function () {
			$('#tb_createReport').blur();
			bdoConfirmBox('系统提示', '确定要重新生成【' + CUR_CUSTOMERNAME + '】<br>'
				+ '试算平衡表吗？<span style="color: red; ">重新生成后原来的试算平衡表将被删除！</span>'
				, function () {
					bdoInProcessingBox('生成中');
					createTB();
				});


		});*/

/*		$('#tb_editer').change(function () {
			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.saveTbEditer.json',
				//async : false,
				data: {
					param2: '1',
					param3: $(this).val(),
					param4: $(this).find('option:selected').attr('label')
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox("保存TB编制人成功！");
						// $('#tb_editer').append(tbEditer);
					} else {
						bdoErrorBox(data.resultInfo.statusText);
					}
				}
			});

		});*/


		$('#tb_search').click(function () {
			$('#tb_search').blur();
			loadData();
		});

		//试算平衡表 显示下拉选 选中事件   全部、已对照、未对照
		// $('#showContract').change(function () {
		// 	loadData();
		// });


		$('#download-offset-template').click(function () {
			let params = {
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param4: 8,
			};
			exportExcelWithTemplate('./dgCenter/HbMergeTb.downloadOffsetTemplate.json', params);
		});
		/*
				$('#tb-init-merge-template').click(function () {
					$.ajax({
						type: 'post',
						url: 'dgCenter/HbMergeTb.initReportTemplate.json',
						//async : false,
						data: {},
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox("初始化合并报表成功！");
							} else {
								bdoInfoBox("提示",data.resultInfo.statusText);
							}
						}
					});
				});
		*/
	//	切换本期上期
		$('#tb_type li').click(function () {
			$('#tb_type li').removeClass("active");
			$(this).addClass("active");
			loadData();
		});

/*		$('#tb-import-offset').click(function() {
			clean();
			let id = $('#tb_type li[class=active] a').prop('id');
			if (id === 'cur_tb') {
				$('#offset_dgYear2').text(CUR_PROJECT_ACC_YEAR)
			} else {
				$('#offset_dgYear2').text(CUR_PROJECT_ACC_YEAR - 1)
			}
			//隐藏 分录方式 初始化为抵消方式
			$('#journalizing_way').closest('div').hide();
			$('#journalizing_way').val(2);
			//触发事件
			$('#journalizing_way').trigger('change');
			$('#journalizing_type').closest('div').hide();

			$('#sideRegin').show();
		});*/
		//删除TB
		$('#user_tb_table').on('click', 'button[name="user_tb_delete"]', function() {
			var object = $('#user_tb_table').DataTable().data()[$(this).closest('tr').index()];
			var patt1 = new RegExp("S001|S002|S003|S004|S005|S006|TA01|TA02|TA03|TB01|TB02|TB03|TB04|TB05|TB06|TB07|TB08|TB09|TB10|TB11|TB12|TB13|TC01|TC02|TC03|TC04|TC05|TC06|TC07|TC08|TC09");
			if (patt1.test(object.tbSubjectId)){
				bdoInfoBox('提示信息','该科目是必须包含的科目项，禁止删除!');
				return;
			}

			// 检查是否被公式引用
			let tbSubjectMap = new Map();
			$.ajax({
				url: 'cpBase/General.query.json',
				type: 'post',
				async: false,
				data: {
					sqlId: 'DG00216',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start : -1,
					limit : -1,
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						data.data.forEach(row => tbSubjectMap.set(row.tbSubjectId, parseCalFunItems(row.calFun)));
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);

					}
				}
			});

			let tbCal = '';
			tbSubjectMap.forEach((v,k) => {
				if (v.includes(object.tbSubjectId)){
					tbCal = k;
				}
			});
			if (tbCal){
				bdoErrorBox('提示', `该科目已被科目【${tbCal}】中的公式引用，不能删除！`);
				return;
			}


			bdoAjaxBox('系统提示', '确定要删除对照吗?', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/FTBSubjectContract.deleteTBSubject.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: object.autoId,
						param2: object.tbSubjectId,
						param3: object.tbSubjectName,
						param4: object.sortNo
					},
					dataType: 'json',
					success: function(data) {
						$('#user_tb_table').DataTable().ajax.reload();

						if (data.success) {
							bdoSuccessBox('删除成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('删除失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		//修改
		$('#user_tb_table').on('click', 'button[name="user_tb_edit"]', function() {
			var object = $('#user_tb_table').DataTable().data()[$(this).closest('tr').index()];
			$('#com_autoId').val(object.autoId),
				$('#com_subjectId').val(object.tbSubjectId),
				$('#com_subjectName').val(object.tbSubjectName),
				initReportTree();
			$('#com_isSubject').val(object.isSubject + '');
			$('#com_calFun').val(object.calFun);
			if (object.isSubject) {
				$('#com_calFun').prop('disabled', true);
				$('#com_reportSubject').prop('disabled', false);
			} else {
				$('#com_calFun').prop('disabled', false);
				$('#com_reportSubject').prop('disabled', true);
			}
			$('#com_reportSubject').treecombo('setTreeComboValue', [object.reportSubjectId, object.reportSubjectName]);
			$('#user_tb_detail').modal('show');
		});
		//修改对照
/*
		$('#user_tb_table').on('click', 'button[name="user_tb_reContract"]', function() {
			var object = $('#user_tb_table').DataTable().data()[$(this).closest('tr').index()];
			$('#com_autoId2').val(object.autoId),
				$('#com_subjectId2').val(object.tbSubjectId),
				$('#com_subjectName2').val(object.tbSubjectName),
				initReportTree();
			$('#com_isSubject2').val(object.isSubject + '');
			$('#com_calFun2').val(object.calFun);
			$('#com_subjectId2').prop('disabled', true);
			$('#com_subjectName2').prop('disabled', true);
			$('#com_isSubject2').prop('disabled', true);
			$('#com_calFun2').prop('disabled', true);
			$('#com_reportSubject2').prop('disabled', false);

			initReportTree2();
			$('#com_reportSubject2').treecombo('setTreeComboValue', [object.reportSubjectId, object.reportSubjectName]);
			$('#user_tb_detail2').modal('show');
		});
*/
		//新增
		$('#user_tb_add').on('click', function () {
			$('#com_autoId').val('');
			$('#com_subjectId').val('');
			$('#com_subjectName').val('');
			initReportTree();
			$('#com_isSubject').val(1);
			$('#com_calFun').val('');
			$('#com_calFun').prop('disabled', true);
			$('#com_reportSubject').prop('disabled', false);
			// $('#com_reportSubject').treecombo('setTreeComboValue', ['', '']);
			$('#user_tb_detail').modal('show');
		});


		$('#tab3').on('click', function() {
			//进入页面
			loadTBbData();
			$('#tab_tbList').hide();
			$('#tab_tb_offset').hide();
			$('#tab_tb_options').show();
		});
		$('#tab2').click(function () {
			$('#tab_tb_options').hide();
			$('#tab_tb_offset').hide();
			$('#tab_tbList').show();
			$('#tb_search').click();
		});

		$('#li_tb_offset').click(function () {
			$('#tab_tb_options').hide();
			$('#tab_tbList').hide();
			$('#tab_tb_offset').show();
			adjust_view.localParam.urlparam = {
				menuId: window.sys_menuId,
				sqlId: 'DG00296',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3 : window.CUR_PROJECT_ACC_YEAR-1,
				param4: window.CUR_PROJECT_ACC_YEAR,
				param5: 2,
			};
			BdoDataTable('tb_offset_table', adjust_view);

		});

		//切换功能
		$('#user_tb_change').on('click', function() {
			$('#user_tb_change').blur();
			let check = $('#user_tb_change').attr('data-item-index');
			if (check == '1') {
				$('#user_tb_change').attr('data-item-index', 0);
				loadTBbData();
				// BdoDataTable('user_tb_table', init_table_view);

			} else {
				$('#user_tb_change').attr('data-item-index', 1);
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
					success: function(data) {
						if (data.success) {
							// console.log("项目信息："+JSON.stringify(data));
							let tbtemplateId = data.data[0].tbTemplate;
							let vocationId = data.data[0].tbReportTemplate;
							report_view.localParam.urlparam.param1 = tbtemplateId;
							report_view.localParam.urlparam.param2 = vocationId;
							BdoDataTable('user_tb_table', report_view);
						} else {
							bdoErrorBox('提示', data.resultInfo.statusText);
						}
					}
				});

			}
		});


		/**
		 *  check报表计算公式
		 * */
		function checkcalFun(str, value_) {
			if (value_ === ''){
				return  true;
			}
			var value = value_;
			var bool = true;
			var ex = function(str) {
				var exv = str.replace(/(\+|\-|\*|\/)+/g, ',');
				return exv;
			};
			var ex2 = function(str) {
				var exv = (/^(.)+-/g).exec(str);
				// 匹配到返回对象，没有匹配到返回null
				// console.log(ex);
				// 为null直接retrun 否则做处理，去掉 -
				return exv && exv[0].replace('-', '');
			};
			// str值处理
			var str1 = str;
			// 转数组
			str1 = str1.split(',');
			// 取公式编号
			// var str1_2 = [];    // 已对照的科目
			/*		str1.forEach(function(str) {
						ex2(str) && str1_2.push(ex2(str));
					});*/
			// value 值处理
			var strList = ['+', '-', '*', '/'];
			strList.find(v => {
				if (value.indexOf(v) > -1) {
					value = ex(value);
				}
			});
			var str2 = value.split(','); // 输入的科目

			// value是否含有str内的编号
			// if (str2.find(v => str1_2.indexOf(v) === -1)) {
			// 	bool = false;
			// }
			str2.forEach(v => {
				let val = v.trim();
				for (let i = 0; i < str1.length; i++) {
					if (str1[i].startsWith(val+'-')){
						bool = true;
						break;
					}else{
						bool = false;
					}
				}
				/*		if (val && ) {
							bool = false;
						}*/
			});

			// 通过str反选value是否含有str内的编号
			/*		if (str1_2.find(v => str2.indexOf(v) === -1)) {
						// bool = false
					}*/
			return bool;
		}

		/**
		 * 双击设置 报表科目计算公式
		 */
		var reprot = {
			'param2': '',
			'param1': '',
			'param3': {}
		};

		$('#user_tb_table').on('dblclick', 'td', function() {
			let isReport = $('#user_tb_change').attr('data-item-index');
			if ($(this).closest('td').index() != 3) {
				return;
			}
			if (isReport === '1') {
				// 如果有错误输入的公式又去编辑其他公式，原错误公式回滚
				let $jsErrInput = $('.js-calfun-err');
				let oldValueOfErrInput = $jsErrInput.attr('old-value') || '';
				$jsErrInput.removeClass('js-calfun-err').val(oldValueOfErrInput);
				$jsErrInput.parent().html('<span style=\'color:green;\'>' + oldValueOfErrInput + '</span>');

				let $table = $(this).closest('table');
				let th = $table.DataTable().context[0].aoColumns[$table.DataTable().cell(this).index().column];
				let data = $table.DataTable().row($(this).closest('tr')).data();
				let oldVal = data[th.name] || '';
				$(this).html(`<span><input type=\'text\' old-value="${oldVal}" style=\'width:100%; align=right;\'></span>`);
				let input = $(this).find('input');
				if (oldVal) {
					input.val(oldVal);
				}
				input.focus();
				input.on('keydown', function(e) {
					if (e.keyCode == 13) {
						//console.log(e);
						input.blur();
					}
				});
				input.on('blur', function() {
					let $table = $(this).closest('table');
					let data = $table.DataTable().row($(this).closest('tr')).data();
					let value = $(this).val();
					reprot.param1 = report_view.localParam.urlparam.param1;
					reprot.param2 = report_view.localParam.urlparam.param2;
					reprot.param3[data.colCode] = data;
					let  funcReg = /[~!@#$%^&\\|,.<>?"'();:_=\[\]{}]/;
					if (funcReg.test(value)){
						bdoErrorBox('失败', '公式只支持四则运算');
						return;
					}

					// if (typeof (data.tbSubject) == 'undefined' || data.tbSubject == null || data.tbSubject == '') {
					// 	$(this).parent().html('');
					// 	reprot.param3 = {};
					// 	bdoErrorBox('失败', '当前报表科目未与TB科目对照');
					// 	return;
					// }

					data.tbSubject == null ? '' : data.tbSubject;

					if (!checkcalFun(data.tbSubject, value)) {
						$(input).addClass('js-calfun-err');
						bdoErrorBox('失败', '当前报表公式中报表科目未与TB科目对照');
						return false;
					}

					data['cusCalFun'] = value.trim(); // 检查正确才保存
					$(this).parent().html('<span style=\'color:green;\'>' + value + '</span>');

					$.ajax({
						url: 'dgCenter/DgAdjust.addProjectTBFun.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: reprot.param1,
							param2: reprot.param2,
							param3: encodeURIComponent(JSON.stringify(reprot.param3))
						},
						dataType: 'json',
						success: function(data) {
							$('#tbsubject_table').DataTable().ajax.reload();
							isSort = false;
							if (data.success) {
								//提交成功后清空
								reprot.param3 = {};

								bdoSuccessBox('成功', data.resultInfo.statusText);
							} else {
								reprot.param3 = {};
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});

				});
			}

		});

		$('#user_tb_form').on('change', '#com_isSubject', function(event) {
			if ($('#com_isSubject option:selected').text() === '是') {
				$('#com_calFun').val('');
			}
		});
		//新增TB科目form参数
		$('#user_tb_form').formview({
			display: 'tableform-one',
			column: 4,
			buttons: [
				{
					id: 'comSubject_save',
					icon: 'fa-save',
					style: 'btn-primary',
					text: '&nbsp;保存'

				}, {
					id: 'comSubject_close',
					icon: 'fa-sign-out',
					style: 'btn-warning',
					text: '&nbsp;关闭'
				}
			],
			items: [
				{
					id: 'com_autoId',
					type: 'input',
					typeAttr: {
						type: 'hidden'
					}
				}, {
					id: 'com_subjectId',
					type: 'input',
					label: '科目编号',
					validate: {
						rules: {
							required: true
						}
					}
				}, {
					id: 'com_subjectName',
					type: 'input',
					label: '科目名称',
					validate: {
						rules: {
							required: true
						}
					}
				}, {
					id: 'com_isSubject',
					type: 'select',
					label: '是否科目项',
					validate: {
						rules: {
							required: true
						}
					},
					rowspan: 1,
					colspan: 2
				}, {
					id: 'com_calFun',
					type: 'input',
					label: '计算公式',
					validate: {
						rules: {
							required: false
						}
					},
					rowspan: 1,
					colspan: 2
				}, {
					id: 'com_reportSubject',
					type: 'input',
					label: '对应报表科目',
					validate: {
						rules: {
							required: false
						}
					},
					rowspan: 1,
					colspan: 2
				}
			]
		});

		$('#com_reportSubject').on('focus', function() {
			initReportTree();
		});

		$('#comSubject_save').on('click', function() {
			let curTbSubjectId = $('#com_subjectId').val();
			let curTbSubjectName = $('#com_subjectName').val();
			//科目名只能包含/
			let nameReg = /[~!@#$%^&*\\|,.<>?"'();:_+\-=\[\]{}\/]/;
			//科目编号不能包含特殊字符
			let idReg = /[~!@#$%^&*\\|,.<>?"'();:_+\-=\[\]{}\/]/;

			let str = new RegExp(/^[A-Za-z].*/);
			if (!str.test(curTbSubjectId)) {
				bdoInfoBox('提示', '科目编号必须以字母开头!');
				return false;
			}
			if (idReg.test(curTbSubjectId)) {
				bdoInfoBox('提示','科目编号不能包含特殊字符!<br/>~!@#$%^&*|,.<>?"\'();:_+-=[]{}\/!');
				return false;
			}
			if (nameReg.test(curTbSubjectName)){
				bdoInfoBox('提示','科目名称不能包含特殊字符!<br/>~!@#$%^&*|,.<>?"\'();:_+-=[]{}\/!');
				return false;
			}
			let reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
			if (reg.test($('#com_subjectId').val())) {

				// 检查公式
				// let curTbSubjectId = $('#com_subjectId').val();
				let cal = $('#com_calFun').val();
				if(cal){

					let calItems = parseCalFunItems(cal);
					for (let i = 0; i < calItems.length; i++) {
						if (curTbSubjectId === calItems[i]){
							bdoInfoBox('提示', `公式有误，不能有自身科目编号【${curTbSubjectId}】!`);
							return false;
						}
					}

					let tbSubjectMap = new Map();
					$.ajax({
						url: 'cpBase/General.query.json',
						type: 'post',
						async: false,
						data: {
							sqlId: 'DG00216',
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							start : -1,
							limit : -1,
						},
						dataType: 'json',
						success: function(data) {
							if (data.success) {
								data.data.forEach(row => tbSubjectMap.set(row.tbSubjectId, row.calFun));
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);

							}
						}
					});

					for (let i = 0; i < calItems.length; i++) {
						if (!tbSubjectMap.has(calItems[i])){
							bdoInfoBox('提示', `公式有误，不能有不存在的科目编号【${calItems[i]}】!`);
							return false;
						}
					}
					// 配置了公式  报表科目清空
					$('#com_reportSubject').val('');
					$('#com_reportSubject').attr('data-result','');
				}


				$.ajax({
					url: 'dgCenter/FTBSubjectContract.saveTBSubject.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: $('#com_autoId').val(),
						param2: $('#com_subjectId').val(),
						param3: trim($('#com_subjectName').val()),
						param4: $('#com_reportSubject').attr('data-result'),
						param5: $('#com_reportSubject').val(),
						param6: $('#com_isSubject').val(),
						param7: encodeURIComponent($('#com_calFun').val())
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
							return;
						}
						$('#user_tb_table').DataTable().ajax.reload();
						$('#user_tb_detail').modal('hide');
					}
				});
			} else {
				bdoInfoBox('提示', '科目编号必须包含数字和字母!');
			}

		});

		$('#com_isSubject').on('change', function() {
			if ($(this).val() == 1) {
				$('#com_calFun').val('');
				$('#com_calFun').prop('disabled', true);
				$('#com_reportSubject').prop('disabled', false);
			} else {
				$('#com_calFun').prop('disabled', false);
				$('#com_reportSubject').prop('disabled', true);
			}
		});

		//保存排序
		$('#tbSubject_sort').on('click', function() {
			bdoConfirmBox('提示', '是否按当前表格顺序保存', function() {
				var sortparam = [];
				let userTbTableTrArr = $('#user_tb_table tbody tr');
				/*$('#user_tb_table tbody tr').each(function(){
					sortparam.push($(this).find('[name="autoId"]').val());
				});*/
				for (let i = 0; i < userTbTableTrArr.length; i++) {
					sortparam.push($(userTbTableTrArr[i]).find('[name="autoId"]').val());
				}

				$.ajax({
					url: 'dgCenter/FTBSubjectContract.sortTbSubject.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: sortparam.toString()
					},
					dataType: 'json',
					success: function(data) {
						$('#user_tb_table').DataTable().ajax.reload();
						//isSort = false;
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});

		$('#btn_tb_search').on('click', function() {
			//刷新
			$('#btn_tb_search').blur();
			$('#user_tb_table').DataTable().ajax.reload();
		});

		$('#tb_offset_table').on('click', 'button[name="adDelete"]', function () {
			let autoId = $(this).parent().find('button[name="offset_autoId"]').text();
			$.ajax({
				url: 'dgCenter/HbElimination.deleteOffset.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: autoId
				},
				success: function (data) {
					$('#tb_offset_table').DataTable().ajax.reload();
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});

		});

		$('#btn_offset_search').click(function () {
			$('#li_tb_offset').click();
		});

	};
	mount = () => {
		$('#tb-init-merge-template').hide();
		$('#tab_tb_options').hide();
		$('#tab_tb_offset').hide();
		getTbTemplate();
		$('#tb_type li a[id="cur_tb"]').addClass("active");
		loadData();
		setTbeEditerSelect();
		listener();
	};

	mount();
}



