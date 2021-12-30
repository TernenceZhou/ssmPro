/**
 * 审计程序页面
 */
var GuidePage = (agrs) => {
	var _template
		, guideTable
		, guideTbTable
		, projectYear
		, mount
		, listener;
	_template = agrs.template || tplLoader('dgCenter/html/dg/guide.html');
	agrs.template = _template;
	listener = () => {
		// 模态框实现拖拽移动
		$('.modal').draggable();

		/** 单元格点击事件 */
		$('#guideTable').on('click', 'td', function() {
			var th = $('#guideTable').DataTable().context[0].aoColumns[$(this).index() + 1];
			if (th.name === 'subjectId') {
				var data = $('#guideTable').DataTable().row($(this).parents('tr')).data();
				$('#formulaMainSubjectId').val(data.subjectId);
				$('#formulaMainSubjectName').val(data.subjectId + '-' + data.subjectName);
				jQuery($('#formulaMainModal [data-toggle="tabs"] a:eq(0)')).tab('show');
				$('#formulaMainModal').modal('show');
			}
		});

		$('#refreshGuideTableBtn').click((event) => {
			$('#guideTable').DataTable().ajax.reload();
		});

		$('#guideTable tbody').on('click', 'td button', function() {
			var table = $('#guideTable').dataTable();
			var rowData = table.fnGetData($(this).attr('data-row'));
			// 科目编号
			var subjectId = rowData.subjectId;
			// 科目名称
			var subjectName = rowData.subjectName;
			// 所在单元格的值
			var textContent = this.parentElement.lastElementChild.textContent.replace(/,/g, '');
			// 所在的列
			var col = $(this).parents('td').index() + 1;
			// 列
			var th = $('#guideTable').DataTable().context[0].aoColumns[col];
			// 列名
			var colName = th.title;
			$('#aliasPosition').val(subjectId + '-' + subjectName + ':' + colName.replace(/[\+\-\=]/g, ''));
			$('#aliasValue').val(textContent);
			$('#subjectId').val(subjectId);
			$('#subjectName').val(subjectId + '-' + subjectName);
			$('#baseSubjectId').val(agrs.data.extraOptions.tbSubjectCode);
			$('#tagType').val(th.name);
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
						// 标签名
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
				type: 'function',
				className: 'cn.com.bdo.dgCenter.service.DgCommonService',
				methodName: 'getTagValueFunction',
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				yyyy: window.CUR_PROJECT_ACC_YEAR,
				subjectId: $('#subjectId').val(),
				subjectName: $('#subjectName').val(),
				baseSubjectId: $('#baseSubjectId').val(),
				field: $('#tagType').val()
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
					param8: 'function',
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

		$('#exportGuideTableBtn').click(event => {
			var isManager = true;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00197',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (sys_userId != data.data[0].manager) {
							isManager = false;
						}
					}
				}
			});
			if (!isManager) {
				bdoInfoBox('提示', '非项目负责人无权限导出导引表！');
				return;
			}
			if (agrs.data.type == 'TBSUBJECT') {
				//debugger;
				$.ajax({
					url: 'dgCenter/ExportOtherDg.exportGuideTbl.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: agrs.data.extraOptions.customerId,
						param2: agrs.data.extraOptions.projectId,
						param3: agrs.data.extraOptions.autoId
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							if (data.data && data.data.length > 0) {
								let dataString = data.data[0].fileData;
								let fileName = data.data[0].fileName;
								let isNew = data.data[0].isNew;
								bdoInfoBox('成功', fileName + '导出成功！');
								saveAs(dataURLtoFile(dataString, fileName), fileName);
								if (!isNew) {
									return;
								}
								getSubjecttree({
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_PROJECTID,
									param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
								}, data => {
									$('.js-tree-collapsed').trigger('rebuild', [{
										data: [data.data[0].treeData],
										levels: (agrs.data.deep + 2),
										callback(tree) {
											tree.expandNode(agrs.data.nodeId, {
												levels: (agrs.data.deep + 2),
												silent: true
											});
											tree.selectNode(agrs.data.nodeId, {silent: true});
											agrs.data = tree.getNode(agrs.data.nodeId);
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
		});
	};
	(function() {
		projectYear = window.CUR_PROJECT_END_YEAR;
		$.ajax({
			url: 'dgCenter/DgAdjust.findProjectInfo.json',
			type: 'post',
			// async : false,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			},
			dataType: 'json',
			success: function(data) {
				if (!data.data || !data.data[0].year) {
					return;
				}
				projectYear = data.data[0].year;
			}
		});
	})();

	mount = () => {
		$(agrs.region).empty().append(_template);
		if (agrs.data.type == 'PROJECT') {
			BdoDataTable('guideTable', guideTable);
		} else {
			BdoDataTable('guideTable', guideTbTable);
		}
		listener();
		if (agrs.data.type == 'TBSUBJECT') {
			$('#exportGuideTableBtn').show();
		} else {
			$('#exportGuideTableBtn').hide();
		}
	};

	function GetPercent(num, total) {
		num = parseFloat(num);
		total = parseFloat(total);
		if (isNaN(num) || isNaN(total)) {
			return '-';
		}
		if (num === total) {
			return '0.00%';
		}
		return total <= 0 ? '<span style="color:red;align=right;">' + 1000 + '%' + ' ↑ </span>' : formatPercentMoney((Math.round((num - total) / total * 10000) / 100.00.toFixed(2) + '%'));
	}

	/**
	 * 格式化百分比
	 *
	 * @param {}
	 *            val
	 * @return {}
	 */
	function formatPercentMoney(val) {
		var val = val.replace('%', '');
		if (isNaN(val)) {
			return val + '%';
		} else if (val == '0.00') {
			return '0.00%';
		} else if (val / 100 > 0) {
			return '<span style="color:red;align=right;">' + val + '%' + ' ↑ </span>';
		} else if (val / 100 < 0) {
			return '<span style="color:green;align=right;">' + val + '%' + ' ↓ </span>';
		}
		return val + '%';
	}

	guideTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00013',
//						limit : 1000,
					param1: agrs.data.extraOptions.projectId,
					param2: agrs.data.extraOptions.customerId,
					param5: window.CUR_PROJECT_ACC_YEAR
				};
				if (agrs.data.type == 'SUBJECT') {
					param.param3 = agrs.data.extraOptions.userSubjectId;
					param.param4 = agrs.data.extraOptions.tbSubjectName;
				}
				if (agrs.data.type == 'TBSUBJECT') {
					param.param4 = agrs.data.extraOptions.tbSubjectName;
				}
				//				if(agrs.data.type == "PROJECT") {
				//					param.param4 = _data.extraOptions.autoId;
				//				}
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
//			scrollX : true,
//			scrollY : true,
//			scrollCollapse: true,
//			pageLength: 1000,
			select: true,
			lengthChange: false,
			ordering: true,
			order: [],
			serverSide: true,
			dom: '<"row"<"col-sm-12"tr>>',
//			paging: false,
			fixedThead: true,
			fixedHeight: '500px',
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					title: '科目编号',
					name: 'userSubjectId',
					data: 'userSubjectId',
					width: '60px'
				}, {
					targets: 2,
					orderable: true,
					title: '科目名称',
					name: 'userSubjectName',
					data: 'userSubjectName',
					width: '100px'
				}, {
					targets: 3,
					className: 'text-right',
					orderable: true,
					title: '期初余额',
					name: 'remain',
					data: 'remain',
					width: '100px',
					render: function(data, type, row, meta) {
						return data == undefined ? 0 : formatMoney(data);
					}
				}, {
					targets: 4,
					orderable: true,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitTotalOcc',
					data: 'debitTotalOcc',
					width: '100px',
					render: function(data, type, row, meta) {
						return data == undefined ? 0 : formatMoney(data);
					}
				}, {
					targets: 5,
					className: 'text-right',
					orderable: true,
					title: '贷方发生额',
					name: 'creditTotalOcc',
					data: 'creditTotalOcc',
					width: '100px',
					render: function(data, type, row, meta) {
						return data == undefined ? 0 : formatMoney(data);
					}
				}, {
					targets: 6,
					className: 'text-right',
					orderable: true,
					title: '期末余额',
					name: 'balance',
					data: 'balance',
					width: '100px',
					render: function(data, type, row, meta) {
						return data == undefined ? 0 : formatMoney(data);
					}
				}, {
					targets: 7,
					orderable: true,
					title: '变化率',
					name: 'rate',
					data: 'rate',
					width: '50px',
					render: function(data, type, row, meta) {
						return formatPercentMoney(data);
					}
				}
			],
			drawCallback(settings) {
				var guideTable = $('#guideTable').dataTable();
				var api = guideTable.api();
				var summery = {
					remain: 0.0,
					debitOcc: 0.0,
					creditOcc: 0.0,
					balance: 0.0
				};
				var rows = api.rows().data();
				api.rows().every((index, tcounter, rcounter) => {
					summery.debitOcc += parseFloat(rows[index].debitTotalOcc);
					summery.creditOcc += parseFloat(rows[index].creditTotalOcc);
					summery.balance += parseFloat(rows[index].balance);
					summery.remain += parseFloat(rows[index].remain);
				});

				$('#guideTable').find('tbody');
				var $tr = $('<tr role="row" style=""></tr>');

				var $td1 = $('<td class="text-center"></td>');
				$td1.text('汇总');
				$td1.attr('colSpan', 3);
				$tr.append($td1);

//				var $td2 = $('<td>');
//				$td2.text('');
//				$tr.append($td2);

				var $td3 = $('<td class="text-right" >');
				$td3.html(formatMoney(summery.remain.toFixed(2)));
				$tr.append($td3);

				var $td4 = $('<td class="text-right" >');
				$td4.html(formatMoney(summery.debitOcc.toFixed(2)));
				$tr.append($td4);

				var $td5 = $('<td class="text-right">');
				$td5.html(formatMoney(summery.creditOcc.toFixed(2)));
				$tr.append($td5);

				var $td6 = $('<td class="text-right">');
				$td6.html(formatMoney(summery.balance.toFixed(2)));
				$tr.append($td6);

				var $td7 = $('<td class="text-left">');
				$td7.html(formatPercentMoney(GetPercent(summery.balance, summery.remain)));
				$tr.append($td7);

				$('#guideTable').find('tbody').append($tr);
			}
		}
	};

	guideTbTable = {
		localParam: {
			url: 'dgCenter/DgAdjust.findGuide.json',
			urlparam: (function() {
				var param = {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: agrs.data.extraOptions.userSubjectId,
					param2: agrs.data.extraOptions.tbSubjectCode,
					param3: agrs.data.type,
					param4: window.CUR_PROJECT_ACC_YEAR
				};
				return param;
			})(),
			tabNum: false
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
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'
				}, {
					targets: 2,
					orderable: false,
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '100px'
				}, {
					targets: 3,
					className: 'text-right',
					orderable: false,
					title: (projectYear - 1) + '年未审数',
					name: 'preBefore',
					data: 'preBefore',
					width: '100px',
					render: function(data, type, row, meta) {
						var value = data == undefined ? 0 : formatMoney(data);
						var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;" data-placement="top" title="设置标签" data-row="' + meta.row + '" data-col="3">'
							+ '<i class="fa fa-edit"></i>'
							+ '</button>' + '&nbsp;&nbsp;&nbsp;<label>' + value + '</label>';
						return renderStr;
					}
				}, {
					targets: 4,
					className: 'text-right',
					orderable: false,
					title: (projectYear - 1) + '年调整数',
					name: 'preAdjust',
					data: 'preAdjust',
					width: '100px',
					render: function(data, type, row, meta) {
						var value = data == undefined ? 0 : formatMoney(data);
						var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;" data-placement="top" title="设置标签" data-row="' + meta.row + '" data-col="4">'
							+ '	<i class="fa fa-edit"></i>'
							+ '	</button>' + '&nbsp;&nbsp;&nbsp;<label>' + value + '</label>';
						return renderStr;
					}
				}, {
					targets: 5,
					className: 'text-right',
					orderable: false,
					title: (projectYear - 1) + '审定数',
					name: 'preAfter',
					data: 'preAfter',
					width: '100px',
					render: function(data, type, row, meta) {
						var value = data == undefined ? 0 : formatMoney(data);
						var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;" data-placement="top" title="设置标签" data-row="' + meta.row + '" data-col="5">'
							+ '	<i class="fa fa-edit"></i>'
							+ '	</button>' + '&nbsp;&nbsp;&nbsp;<label>' + value + '</label>';
						return renderStr;
					}
				}, {
					targets: 6,
					className: 'text-right',
					orderable: false,
					title: projectYear + '年未审数',
					name: 'currentBefore',
					data: 'currentBefore',
					width: '100px',
					render: function(data, type, row, meta) {
						var value = data == undefined ? 0 : formatMoney(data);
						var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;" data-placement="top" title="设置标签" data-row="' + meta.row + '" data-col="6">'
							+ '	<i class="fa fa-edit"></i>'
							+ '	</button>' + '&nbsp;&nbsp;&nbsp;<label>' + value + '</label>';
						return renderStr;
					}
				}, {
					targets: 7,
					className: 'text-right',
					orderable: false,
					title: projectYear + '年调整数',
					name: 'currentAdjust',
					data: 'currentAdjust',
					width: '100px',
					render: function(data, type, row, meta) {
						var value = data == undefined ? 0 : formatMoney(data);
						var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;" data-placement="top" title="设置标签" data-row="' + meta.row + '" data-col="7">'
							+ '	<i class="fa fa-edit"></i>'
							+ '	</button>' + '&nbsp;&nbsp;&nbsp;<label>' + value + '</label>';
						return renderStr;
					}
				}, {
					targets: 8,
					className: 'text-right',
					orderable: false,
					title: projectYear + '审定数',
					name: 'currentAfter',
					data: 'currentAfter',
					width: '100px',
					render: function(data, type, row, meta) {
						var value = data == undefined ? 0 : formatMoney(data);
						var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn" type="button" style="float: left;" data-placement="top" title="设置标签" data-row="' + meta.row + '" data-col="8">'
							+ '	<i class="fa fa-edit"></i>'
							+ '	</button>' + '&nbsp;&nbsp;&nbsp;<label>' + value + '</label>';
						return renderStr;
					}
				}
			],
			drawCallback: function(settings) {
			}
		}
	};
	mount();
};