/**
 *
 */
var AdjustPage = function(agrs) {

	var _template = agrs.template
		|| tplLoader('dgCenter/html/dg/adjustTab.html');
	agrs.template = _template;

	var year = window.CUR_PROJECT_ACC_YEAR;
	var lastYear = year - 1;
	var initAdjustTable = function() {
		var adjust_view = DgAdjustPage({handleFlag: '1', data: {extraOptions: {}}}).tableModel;
		adjust_view.localParam.urlparam = {
			menuId: window.sys_menuId,
			sqlId: 'FA10064',
			param1: window.CUR_CUSTOMERID,
			param2: lastYear,
			param3: '2',
			param4: agrs.data.extraOptions.userSubjectId ? agrs.data.extraOptions.userSubjectId : agrs.data.extraOptions.tbSubjectCode,
			param5: window.CUR_PROJECTID,
			param6: year
		};
		//adjust_view.localParam.url = 'dgCenter/DgAdjust.findAdjustTab.json';
		/** 页面列表初始化参数。 */
		var adjustTable = {
			localParam: {
				tabNum: false,
				url: 'dgCenter/DgAdjust.findAdjustTab.json',
				urlparam: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: agrs.data.extraOptions.nodeType,
					param4: agrs.data.extraOptions.autoId,
					param5: agrs.data.extraOptions.autoId
				}
			},
			tableParam: {
				select: true,
				lengthChange: false,
				dom: '<"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				ordering: false,
				order: [1, 'asc'],
				rowGroup: {
					dataSrc: 'indexId',
					startRender: function(rows, data) {
						$(rows.nodes()).each(function(index, node) {
							if (!index) {
								$(this).find('td').eq(0).attr('rowspan',
									rows[0].length);
								$(this).find('td').eq(1).attr('rowspan',
									rows[0].length);
							} else {
								$(this).find('td').eq(0).hide();
								$(this).find('td').eq(1).hide();
							}
						});
						if (!rows[0][0]) {
							$('#adjustTable_info b').html(0);
						}
						$('#adjustTable_info b').html(parseInt($('#adjustTable_info b').html()) + 1);
						$(rows.nodes()).css('background', 'white');
					}
				},
				serverSide: true,
				fixedThead: true,
				fixedHeight: '480px',
				columnDefs: [{
					targets: 1,
					className: 'text-center',
					title: '索引号',
					name: 'indexId',
					data: 'indexId',
					width: '100px'
				}, {
					targets: 2,
					className: 'text-left adjust-row-text',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 3,
					className: 'text-left adjust-row-text',
					title: 'TB科目名称',
					name: 'adjustSubjectTB',
					data: 'adjustSubjectTB',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 4,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'
				}, {
					targets: 5,
					className: 'text-left adjust-row-text',
					title: '科目名称',
					name: 'fullName',
					data: 'fullName',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 6,
					className: 'text-right',
					title: '借方金额',
					name: 'plusOccurValue',
					data: 'plusOccurValue',
					width: '80px',
					render: function(data, type, row, meta) {
						if (row.dirction > 0) {
							return formatMoney(row.occurValue);
						}
						return '';
					}
				}, {
					targets: 7,
					className: 'text-right',
					title: '贷方金额',
					name: 'minusOccurValue',
					data: 'minusOccurValue',
					width: '80px',
					render: function(data, type, row, meta) {
						if (row.dirction < 0) {
							return formatMoney(row.occurValue);
						}
						return '';
					}
				}, {
					targets: 8,
					className: 'text-center',
					title: '状态',
					name: 'status',
					data: 'status',
					width: '30px',
					render: function(data, type, row, meta) {
						if (row.ACTIVE_FLAG == 0) {
							return '未调整';
						} else if (data == 1) {
							return '调整';
						}
					}
				}, {
					targets: 9,
					className: 'text-center adjust-row-text',
					title: '未调整原因',
					name: 'reason',
					data: 'reason',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 10,
					className: 'text-center',
					title: '对税务影响',
					name: 'taxEffect',
					data: 'taxEffect',
					width: '100px',
					render: function(data, type, row, meta) {
						switch (data) {
							case "0":
								return '否';
							case "1":
								return '是';
						}
						// return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
						targets: 11,
						className: 'text-center',
						title: '错报类型',
						name: 'cbType',
						data: 'cbType',
						width: '100px',
						render: function(data, type, row, meta) {
							switch (data) {
								case '0':
									return '事实错报';
								case '1':
									return '判断错报';
								case '2':
									return '推断错报';
							}
							// return '<span title=' + data + '>' + data + '</span>';
						}
					},{
					targets: 12,
					className: 'text-left adjust-row-text',
					title: '制单人',
					name: '__ufillUserName',
					data: '__ufillUserName',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + row.__ufillUserNameName + '>' + row.__ufillUserNameName + '</span>';
					}
				}]
			}
		};
		BdoDataTable('adjustTable', adjust_view);
	};

	var initTbAdjustTable = function() {
		let projectYear = window.CUR_PROJECT_ACC_YEAR;

		var adjustTable = {
			localParam: {
				tabNum: false,
				url: 'dgCenter/DgAdjust.findTbAdjustTab.json',
				urlparam: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: agrs.data.extraOptions.tbSubjectCode
				}
			},
			tableParam: {
				select: true,
				lengthChange: false,
				//dom : '<"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				dom: '<"row"<"col-sm-12"tr>>',
				// ordering: false,
				// order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				fixedHeight: '480px',
				columnDefs: [{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '100px'
				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '200px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 3,
					orderable: false,
					className: 'text-right',
					title: (projectYear - 1) + '年未审数',
					name: 'beforeAdjustPre',
					data: 'beforeAdjustPre',
					width: '100px',
					render: function(data, type, row, meta) {
						if (data) {
							return '<span title=' + data + '>' + formatMoney(data);
							+'</span>';
						} else {
							return '<span title=' + 0 + '>' + formatMoney(0);
							+'</span>';
						}
					}
				}, {
					targets: 4,
					orderable: false,
					className: 'text-right',
					title: (projectYear - 1) + '年调整数',
					name: 'adjustPre',
					data: 'adjustPre',
					width: '100px',
					render: function(data, type, row, meta) {
						if (data) {
							return '<span title=' + data + '>' + formatMoney(data);
							+'</span>';
						} else {
							return '<span title=' + 0 + '>' + formatMoney(0);
							+'</span>';
						}
					}
				}, {
					targets: 5,
					orderable: false,
					className: 'text-right',
					title: (projectYear - 1) + '审定数',
					name: 'afterAdjustPre',
					data: 'afterAdjustPre',
					width: '100px',
					render: function(data, type, row, meta) {
						if (data) {
							return '<span title=' + data + '>' + formatMoney(data);
							+'</span>';
						} else {
							return '<span title=' + 0 + '>' + formatMoney(0);
							+'</span>';
						}
					}
				}, {
					targets: 6,
					orderable: false,
					className: 'text-right',
					title: projectYear + '未审数',
					name: 'beforeAdjust',
					data: 'beforeAdjust',
					width: '100px',
					render: function(data, type, row, meta) {
						if (data) {
							return '<span title=' + data + '>' + formatMoney(data);
							+'</span>';
						} else {
							return '<span title=' + 0 + '>' + formatMoney(0);
							+'</span>';
						}
					}
				}, {
					targets: 7,
					className: 'text-right',
					orderable: false,
					title: projectYear + '年调整数',
					name: 'adjust',
					data: 'adjust',
					width: '100px',
					render: function(data, type, row, meta) {
						if (data) {
							return '<span title=' + data + '>' + formatMoney(data);
							+'</span>';
						} else {
							return '<span title=' + 0 + '>' + formatMoney(0);
							+'</span>';
						}
					}
				}, {
					targets: 8,
					orderable: false,
					className: 'text-right',
					title: projectYear + '审定数',
					name: 'afterAdjust',
					data: 'afterAdjust',
					width: '100px',
					render: function(data, type, row, meta) {
						if (data) {
							return '<span title=' + data + '>' + formatMoney(data);
							+'</span>';
						} else {
							return '<span title=' + 0 + '>' + formatMoney(0);
							+'</span>';
						}
					}
				}]
			}
		};
		BdoDataTable('adjustTable', adjustTable);
	};

	/**
	 * 查询调整对利润与资产的影响
	 */
	let queryAdjustEffect = function queryAdjustEffect() {
		$.ajax({
			type: 'post',
			async: false,
			url: 'dgCenter/AuditAdjust.queryAdjustEffect.json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00202',
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					$('#adjustEffect').html('期初：审计调整对净资产影响：' + formatMoney2(data.data[0].impactLastYearSAssetAudit) + ' 元；   审计调整对净利润影响：' + formatMoney2(data.data[0].impactLastYearSProfitAudit) + '元；' +
						'<br/> 期末：审计调整对净资产影响：' + formatMoney2(data.data[0].impactCurrentYearAssetAudit) + ' 元；   审计调整对净利润影响：' + formatMoney2(data.data[0].impactCurrentYearProfitAudit) + '元；');
					// $('#cus_select2').text('   期初：客户调整对净资产影响：' + formatMoney2(data.data[0].impactLastYearSAssetCusAudit) + ' 元；    客户调整对净利润影响：' + formatMoney2(data.data[0].impactLastYearSProfitCusAudit) + '元；' +
					// 	'期末：客户调整对净资产影响：' + formatMoney2(data.data[0].impactCurrentYearAssetCusAudit) + ' 元；    客户调整对净利润影响：' + formatMoney2(data.data[0].impactCurrentYearProfitCusAudit) + '元；');
					// $('#cus_select3').text('   期初：审计未调整对净资产影响：' + formatMoney2(data.data[0].impactLastYearSAssetUnAudit) + ' 元；   审计未调整对净利润影响：' + formatMoney2(data.data[0].impactLastYearSProfitUnAudit) + '元；'
					// 	+ '   期末：审计未调整对净资产影响：' + formatMoney2(data.data[0].impactCurrentYearAssetUnAudit) + ' 元；   审计未调整对净利润影响：' + formatMoney2(data.data[0].impactCurrentYearProfitUnAudit) + '元；');
					$('#adjustTableTitle').html($('#adjustEffect').html());
				}
			}
		});

	};
	var listener = function () {
		$('#refreshAdjustTableBtn').on('click', function () {
			$('#adjustTable').DataTable().ajax.reload();
			// if (agrs.data.type != 'SUBJECT') {
			queryAdjustEffect();
			// }
		});
	};

	var mount = function () {
		$(agrs.region).empty().append(_template);
		// if (agrs.data.type == 'TBSUBJECT') {
		// 	initTbAdjustTable();
		// } else {
		initAdjustTable();
		// if (agrs.data.type != 'SUBJECT') {
		queryAdjustEffect();
		// }
		// }
		listener();
	};

	mount();
};
