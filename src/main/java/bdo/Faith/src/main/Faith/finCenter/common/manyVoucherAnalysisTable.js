$($('main .content .content')[0]).css('min-height', 480 + 'px');
var manyVoucherAnalysisTab = function (tabId, param) {

	if ($('#' + tabId + ' li a[href="#tab_accountledger"]').length != 0) {
		$('#' + tabId + ' li a[href="#tab_accountledger"]').remove();
	}

	$('#' + tabId + '').append('<li><a href="#tab_accountledger">对应凭证分析列表&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_accountledger"></div>');

	$('#' + tabId + ' a[href="#tab_accountledger"]').find('.fa-times-circle').click(function () {
		$(this).parents('ul').find('li').eq(2).find('a').click();
		$(this).parents('li').remove();
		$('#tab_accountledger').remove();
	});
	if ($('#removeId').length != 0) {

		$('#removeId').remove();
	}

	var accountledager = '<div class="content" id="removeId"><div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options"><li>'
		+ '<button id="many_edit" type="button" style="float:left;color:white;" title="选择要分析的凭证,小杏仁帮您分析哟"><img src="img/bdo/xxr24.png" style="height: 22px;width: 22px;">&nbsp;推荐分析</button>'
		+ '<button id="many_clear" type="button" style="float:left;"><i class="fa fa-eraser" style="color: white;">&nbsp;清空</i></button>'
		+ '<button id="many_preservation" type="button" style="float:left;"><i class="fa fa-save" style="color: white;">&nbsp;保存</i></button>'
		+ '<button id="many_export" style="float:left;" type="button"><i class="si si-cloud-download" style="color: white;">&nbsp;导出</i></button>'
		+ '</li></ul><h3 class="block-title">对应凭证分析列表一览<span>&nbsp;(' + (param.param4 == '1' ? '借' : '贷') + ' ' + param.param7
		+ ')</span></h3></div><div class="block-content"><div style="clear:both;"></div>'
		+ '<table id="table_accountledger" class="table table-bordered table-striped table-hover"></table>' + '</div></div></div>';

	$('#tab_accountledger').append(accountledager);
	$('#' + tabId + ' a[href="#tab_accountledger"]').click();

	/** table 属性 */
	var dfEdit = '&nbsp;<button class="btn btn-xs btn-warning" type="button" name="dfEdit" data-placement="top" title="填充金额" data-toggle="tooltip"><i class="fa fa-edit"></i></button>';
	var dfClear = '&nbsp;<button class="btn btn-xs btn-info" type="button" name="dfClear" data-placement="top" title="清空" data-toggle="tooltip"><i class="fa fa-eraser"></i></button>';
	var dfAdd = '&nbsp;<button class="btn btn-xs btn-success" type="button" name="dfAdd" data-placement="top" title="增加一行" data-toggle="tooltip"><i class="fa fa-plus"></i></button>';
	var dfDel = '&nbsp;<button class="btn btn-xs btn-danger" type="button" name="dfDel" data-placement="top" title="移除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
	var rowVoucherId;
	var rowColor = '#53F9F9';

	var accountledger_view_index = 1;
	var accountledger_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/CorrespondingVoucherAnalysis.getCorrVoucherList.json',
			urlparam: param
		},
		tableParam: {
			select: true,
			param1: 'jsq',
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			infoCallback: fnInfoCallback,
			pageLength: 30,
			createdRow(row, data, dataIndex) {
				if (dataIndex == 0) {
					rowVoucherId = '';
					rowColor = '#53F9F9';
				}
				if (rowVoucherId != data.voucherId) {
					rowColor = rowColor == '#53F9F9' ? '#FF8800' : '#53F9F9'
					rowVoucherId = data.voucherId;
					$(row).children("td").eq(1).html('<label class="css-input css-checkbox css-checkbox-sm css-checkbox-primary"><input type="checkbox" name="checkrow"><span></span></label>');
				}
				$(row).children("td").eq(2).css({ "background-color": rowColor });
				$(row).children("td").eq(3).css({ "background-color": rowColor });
				$(row).children("td").eq(4).css({ "background-color": rowColor });
			},
			columnDefs: [
				{
					targets: accountledger_view_index++,
					className: 'text-center',
					title: '<label class="css-input css-checkbox css-checkbox-sm css-checkbox-primary"><input type="checkbox" name="checkall"><span></span></label>',
					width: '30px'
				}, {
					targets: accountledger_view_index++,
					className: 'text-left',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '70px'
				}, {
					targets: accountledger_view_index++,
					className: 'text-center',
					title: '凭证号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '50px'
				}, {
					targets: accountledger_view_index++,
					className: 'text-center',
					title: '分录号',
					name: 'serail',
					data: 'serail',
					width: '50px'
				}, {
					targets: accountledger_view_index++,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '150px',
					render: function (data, type, row, meta) {
						if (data && data.length > 15) {
							return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
						}
						return data;
					}
				}, {
					targets: accountledger_view_index++,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '50px'
				}, {
					targets: accountledger_view_index++,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '150px'
				}, {
					targets: accountledger_view_index++,
					className: 'text-right',
					title: '借方发生额',
					name: 'drValue',
					data: 'drValue',
					width: '80px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: accountledger_view_index++,
					className: 'text-right',
					title: '贷方发生额',
					name: 'crValue',
					data: 'crValue',
					width: '80px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: accountledger_view_index++,
					className: 'text-center',
					title: '对应发生额',
					name: 'corrSubjectText',
					data: 'corrSubjectText',
					width: '350px',
					render: function (data, type, row, meta) {
						var rowHtml = '';
						if (param.param4 == row.direction && row.subjectId.startsWith(param.param3)) {
							// 对应科目编号下拉框
							var subjectIdsArr = row.subjectIds.split(',');
							// 是否已有分析
							var corrSubject = row.corrSubject;
							if (corrSubject && corrSubject > '') {
								var corrSubjectArr = corrSubject.split(',');
								$.each(corrSubjectArr, function (i, d) {
									var subjectValueArr = d.split('|');
									var _inputspan = $('<span class="row-input"></span>');
									var _btnspan = $('<span class="row-btn"></span>');
									var dfSubject = '';
									$.each(subjectIdsArr, function (i2, d2) {
										if (d2 && d2 > '') {
											var d2Arr = d2.split(':');
											dfSubject += '<option ' + (subjectValueArr[0] == d2 ? 'selected' : '') + ' value="' + d2 + '">' + (d2Arr[0] == '1' ? '借' : '贷') + d2Arr[1] + '</option>'
										}
									});
									dfSubject = '<select style="width:120px;" name="dfSubject">' + dfSubject + '</select>';
									var dfValue = '&nbsp;<input type="number" name="dfValue" class="text-right" style="width:120px;" value="' + parseFloat(subjectValueArr[1]).toFixed(2) + '">';
									if (i == 0) {
										_inputspan.append(dfSubject).append(dfValue);
										_btnspan.append(dfEdit).append(dfClear).append(dfAdd);
									} else {
										_inputspan.append(dfSubject).append(dfValue);
										_btnspan.append(dfEdit).append(dfClear).append(dfDel);
									}
									rowHtml += ('<div>' + _inputspan.prop('outerHTML') + _btnspan.prop('outerHTML') + '</div>');
								});
							} else {
								var _inputspan = $('<span class="row-input"></span>');
								var _btnspan = $('<span class="row-btn"></span>');
								var dfSubject = '';
								$.each(subjectIdsArr, function (i2, d2) {
									if (d2 && d2 > '') {
										var d2Arr = d2.split(':');
										dfSubject += '<option value="' + d2 + '">' + (d2Arr[0] == '1' ? '借' : '贷') + d2Arr[1] + '</option>'
									}
								});
								dfSubject = '<select style="width:120px;" name="dfSubject">' + dfSubject + '</select>';
								var dfValue = '&nbsp;<input type="number" name="dfValue" style="width:120px;" class="text-right">';
								_inputspan.append(dfSubject).append(dfValue);
								_btnspan.append(dfEdit).append(dfClear).append(dfAdd);
								rowHtml = ('<div>' + _inputspan.prop('outerHTML') + _btnspan.prop('outerHTML') + '</div>');
							}
						}
						return rowHtml;
					}
				}, {
					targets: accountledger_view_index++,
					className: 'text-center',
					title: '是否一致',
					name: 'isBalance',
					data: 'isBalance',
					width: '100px',
					renderer: 'getDicLabelByVal|是否一致',
					render: function (data, type, row, meta) {
						if (data && data == '1') {
							return '<span style="color:green;">一致</span>'
						} else {
							return '<span style="color:red;">不一致</span>'
						}
					}
				}]
		}
	};
	jsq(accountledger_view.tableParam, 'table_accountledger');
	BdoDataTable('table_accountledger', accountledger_view);

	/** 全选 */
	$('#table_accountledger').closest('div.dataTables_scroll').find('div.dataTables_scrollHeadInner table input[name="checkall"]').on('click', function () {
		var isCheckAll = $(this).prop('checked');
		$('#table_accountledger input[name="checkrow"]').each(function () {
			$(this).prop('checked', isCheckAll);
		});
	});

	/** 行按钮 填充金额 */
	$('#table_accountledger').on('click', 'button[name=dfEdit]', function () {
		var object = $('#table_accountledger').DataTable().data()[$(this).closest('tr').index()];
		$(this).closest('tr').attr('data-change', '1');
		$(this).closest('div').find('input[name="dfValue"]').val(parseFloat(object.occurValue).toFixed(2));
	});

	/** 行按钮 清空金额 */
	$('#table_accountledger').on('click', 'button[name=dfClear]', function () {
		$(this).closest('tr').attr('data-change', '1');
		$(this).closest('div').find('input[name="dfValue"]').val('');
	});

	/** 行按钮 新增一行 */
	$('#table_accountledger').on('click', 'button[name=dfAdd]', function () {
		addRow(this);
	});

	function addRow(e) {
		var _inputspan = $(e).closest('div').find('.row-input');
		var _btnspan = $('<span class="row-btn"></span>').append(dfEdit).append(dfClear).append(dfDel);
		$(e).closest('tr').attr('data-change', '1');
		$(e).closest('td').append('<div>' + _inputspan.prop('outerHTML') + _btnspan.prop('outerHTML') + '</div>');
	}

	/** 行按钮 移除 */
	$('#table_accountledger').on('click', 'button[name=dfDel]', function () {
		if ($(this).closest('td').find('div').length == 1) {
			bdoInfoBox('提示', '至少需要保留一行', 1000);
			return;
		}
		$(this).closest('tr').attr('data-change', '1');
		$(this).closest('div').remove();
	});

	$('#table_accountledger').on('change', 'input[name="dfValue"]', function () {
		$(this).closest('tr').attr('data-change', '1');
		$(this).val(parseFloat($(this).val()).toFixed(2));
	});

	$('#table_accountledger').on('change', 'select[name="dfSubject"]', function () {
		$(this).closest('tr').attr('data-change', '1');
	});

	/** 自动填充 */
	$('#many_edit').click(function () {
		// 获取要填充的凭证号
		var voucherIdArr = [];
		$('#table_accountledger input[name="checkrow"]:checked').each(function () {
			var rowObj = $('#table_accountledger').DataTable().row($(this).closest('tr').index()).data();
			voucherIdArr.push(rowObj.voucherId);
		});
		if (voucherIdArr.length > 0) {
			// 获取要填充的凭证数据
			var caluateObj = {};
			$('#table_accountledger tr').each(function () {
				var _tr = $(this);
				var rowObj = $('#table_accountledger').DataTable().row(_tr.index()).data();
				var rowVoucherId = rowObj.voucherId;
				if (voucherIdArr.indexOf(rowVoucherId) >= 0) {
					// 清空页面数据
					_tr.find('button[name="dfDel"]').click();
					_tr.find('input[name="dfValue"]').val('');
					_tr.attr('data-change', '1');
					if (typeof (caluateObj[rowVoucherId]) == 'undefined') {
						caluateObj[rowVoucherId] = [];
					}
					if (typeof (caluateObj[rowVoucherId][rowObj.serail]) == 'undefined') {
						caluateObj[rowVoucherId][rowObj.serail] = {};
					}
					caluateObj[rowVoucherId][rowObj.serail] = {
						serail: rowObj.serail,
						direction: rowObj.direction,
						subjectId: rowObj.subjectId,
						occurValue: rowObj.occurValue,
						corrSubject: []
					};
				}
			});
			// 开始匹配
			$.each(caluateObj, function (voucherId, voucherArr) {
				// 按借贷方分组
				var debitArr = voucherArr.filter(item => item.direction == '1');
				var creditArr = voucherArr.filter(item => item.direction == '-1');
				// 按发生额排序
				debitArr.sort(compare('occurValue', -1));
				creditArr.sort(compare('occurValue', -1));
				// 匹配相同发生额
				/*debitArr.forEach(function (ditem, dindex, darray) {
					creditArr.forEach(function (citem, cindex, carray) {
						if (ditem.occurValue == citem.occurValue) {
							caluateObj[voucherId][ditem.serail]['corrSubject'] = [{
								corrSubjectId: citem.subjectId,
								corrDirection: citem.direction,
								corrSubjectValue: (citem.occurValue).toFixed(2)
							}];
							caluateObj[voucherId][citem.serail]['corrSubject'] = [{
								corrSubjectId: ditem.subjectId,
								corrDirection: ditem.direction,
								corrSubjectValue: (ditem.occurValue).toFixed(2)
							}];
							debitArr.splice(dindex, 0);
							creditArr.splice(cindex, 0);
						}
					});
				});*/
				for (let dindex = 0; dindex < debitArr.length; dindex++) {
					var ditem = debitArr[dindex];
					for (let cindex = 0; cindex < creditArr.length; cindex++) {
						var citem = creditArr[cindex];
						if (ditem.occurValue == citem.occurValue) {
							caluateObj[voucherId][ditem.serail]['corrSubject'] = [{
								corrSubjectId: citem.subjectId,
								corrDirection: citem.direction,
								corrSubjectValue: (citem.occurValue).toFixed(2)
							}];
							caluateObj[voucherId][citem.serail]['corrSubject'] = [{
								corrSubjectId: ditem.subjectId,
								corrDirection: ditem.direction,
								corrSubjectValue: (ditem.occurValue).toFixed(2)
							}];
							debitArr.splice(dindex, 1);
							creditArr.splice(cindex, 1);
							dindex--;
							break;
						}
					}
				}
				// 匹配同方向发生额相反
				for (let dindex1 = 0; dindex1 < (debitArr.length - 1); dindex1++) {
					var ditem1 = debitArr[dindex1];
					for (let dindex2 = (dindex1 + 1); dindex2 < debitArr.length; dindex2++) {
						var ditem2 = debitArr[dindex2];
						if (parseFloat(ditem1.occurValue) + parseFloat(ditem2.occurValue) == 0) {
							caluateObj[voucherId][ditem1.serail]['corrSubject'] = [{
								corrSubjectId: ditem2.subjectId,
								corrDirection: ditem2.direction,
								corrSubjectValue: (ditem1.occurValue).toFixed(2)
							}];
							caluateObj[voucherId][ditem2.serail]['corrSubject'] = [{
								corrSubjectId: ditem1.subjectId,
								corrDirection: ditem1.direction,
								corrSubjectValue: (ditem2.occurValue).toFixed(2)
							}];
							debitArr.splice(dindex2, 1);
							debitArr.splice(dindex1, 1);
							dindex1--;
							break;
						}
					}
				}
				for (let cindex1 = 0; cindex1 < (creditArr.length - 1); cindex1++) {
					var citem1 = creditArr[cindex1];
					for (let cindex2 = (cindex1 + 1); cindex2 < creditArr.length; cindex2++) {
						var citem2 = creditArr[cindex2];
						if (parseFloat(citem1.occurValue) + parseFloat(citem2.occurValue) == 0) {
							caluateObj[voucherId][citem1.serail]['corrSubject'] = [{
								corrSubjectId: citem2.subjectId,
								corrDirection: citem2.direction,
								corrSubjectValue: (citem1.occurValue).toFixed(2)
							}];
							caluateObj[voucherId][citem2.serail]['corrSubject'] = [{
								corrSubjectId: citem1.subjectId,
								corrDirection: citem1.direction,
								corrSubjectValue: (citem2.occurValue).toFixed(2)
							}];
							creditArr.splice(cindex2, 1);
							creditArr.splice(cindex1, 1);
							cindex1--;
							break;
						}
					}
				}
				// 匹配剩余发生额
				var isMatch = false;
				if (debitArr.length > 0 && creditArr.length > 0) {
					var outValue = 0;
					var debitMark = 0;
					var creditMark = 0;
					do {
						var debitObj = debitArr[debitMark];
						var cretitObj = creditArr[creditMark];
						if (outValue == 0) {
							outValue = parseFloat(debitObj.occurValue);
						}
						if (debitMark == 0 || outValue > 0) {
							// 判断本次溢出方
							var occValue = parseFloat((outValue - parseFloat(cretitObj.occurValue)).toFixed(2));
							// 上次借方溢出,贷方继续
							if (occValue >= 0) {
								caluateObj[voucherId][debitObj.serail]['corrSubject'].push({
									corrSubjectId: cretitObj.subjectId,
									corrDirection: cretitObj.direction,
									corrSubjectValue: (cretitObj.occurValue).toFixed(2)
								});
								caluateObj[voucherId][cretitObj.serail]['corrSubject'].push({
									corrSubjectId: debitObj.subjectId,
									corrDirection: debitObj.direction,
									corrSubjectValue: (cretitObj.occurValue).toFixed(2)
								});
								if (occValue == 0) {
									debitMark++;
									creditMark++;
								} else {
									creditMark++;
								}
							} else {
								caluateObj[voucherId][debitObj.serail]['corrSubject'].push({
									corrSubjectId: cretitObj.subjectId,
									corrDirection: cretitObj.direction,
									corrSubjectValue: outValue
								});
								caluateObj[voucherId][cretitObj.serail]['corrSubject'].push({
									corrSubjectId: debitObj.subjectId,
									corrDirection: debitObj.direction,
									corrSubjectValue: outValue
								});
								debitMark++;
							}
							outValue = occValue;
						} else {
							// 判断本次溢出方
							var occValue = parseFloat((outValue + parseFloat(debitObj.occurValue)).toFixed(2));
							// 上次贷方溢出,借方继续
							if (occValue >= 0) {
								caluateObj[voucherId][debitObj.serail]['corrSubject'].push({
									corrSubjectId: cretitObj.subjectId,
									corrDirection: cretitObj.direction,
									corrSubjectValue: -1 * outValue
								});
								caluateObj[voucherId][cretitObj.serail]['corrSubject'].push({
									corrSubjectId: debitObj.subjectId,
									corrDirection: debitObj.direction,
									corrSubjectValue: -1 * outValue
								});
								if (occValue == 0) {
									debitMark++;
									creditMark++;
								} else {
									creditMark++;
								}
							} else {
								caluateObj[voucherId][debitObj.serail]['corrSubject'].push({
									corrSubjectId: cretitObj.subjectId,
									corrDirection: cretitObj.direction,
									corrSubjectValue: (debitObj.occurValue).toFixed(2)
								});
								caluateObj[voucherId][cretitObj.serail]['corrSubject'].push({
									corrSubjectId: debitObj.subjectId,
									corrDirection: debitObj.direction,
									corrSubjectValue: (debitObj.occurValue).toFixed(2)
								});
								debitMark++;
							}
							outValue = occValue;
						}
					} while (debitMark < debitArr.length && creditMark < creditArr.length);
					// 一方结束,另一方未平
					if (outValue != 0) {
						if (debitMark == debitArr.length) {
							// 借方结束,贷方还有剩余
							var credit = creditArr[creditMark];
							for (let i = creditMark + 1; i < creditArr.length; i++) {
								var credit2 = creditArr[i];
								caluateObj[voucherId][credit.serail]['corrSubject'].push({
									corrSubjectId: credit2.subjectId,
									corrDirection: credit2.direction,
									corrSubjectValue: (-1 * credit2.occurValue).toFixed(2)
								});
								caluateObj[voucherId][credit2.serail]['corrSubject'].push({
									corrSubjectId: credit.subjectId,
									corrDirection: credit.direction,
									corrSubjectValue: (-1 * credit2.occurValue).toFixed(2)
								});
							}
						} else if (creditMark == creditArr.length) {
							// 贷方结束,借方还有剩余
							var debit = debitArr[debitMark];
							for (let i = debitMark + 1; i < debitArr.length; i++) {
								var debit2 = debitArr[i];
								caluateObj[voucherId][debit.serail]['corrSubject'].push({
									corrSubjectId: debit2.subjectId,
									corrDirection: debit2.direction,
									corrSubjectValue: (-1 * debit2.occurValue).toFixed(2)
								});
								caluateObj[voucherId][debit2.serail]['corrSubject'].push({
									corrSubjectId: debit.subjectId,
									corrDirection: debit.direction,
									corrSubjectValue: (-1 * debit2.occurValue).toFixed(2)
								});
							}
						}
					}
				}else if (debitArr.length > 0 && creditArr.length == 0) {
					// 贷方结束,借方还有剩余
					isMatch = true;
					// 按借贷方分组
					var creditArr = debitArr.filter(item => item.occurValue < 0);
					var debitArr = debitArr.filter(item => item.occurValue >= 0);
					// 按发生额排序
					debitArr.sort(compare('occurValue', -1));
					creditArr.sort(compare('occurValue', 1));
					
				}else if (debitArr.length == 0 && creditArr.length > 0) {
					// 借方结束,贷方还有剩余
					isMatch = true;
					// 按借贷方分组
					var debitArr = creditArr.filter(item => item.occurValue >= 0);
					var creditArr = creditArr.filter(item => item.occurValue < 0);
					// 按发生额排序
					debitArr.sort(compare('occurValue', -1));
					creditArr.sort(compare('occurValue', 1));
				}
				// 按金额正负区分借贷后再匹配
				if (isMatch && debitArr.length > 0 && creditArr.length > 0) {
					var outValue = 0;
					var debitMark = 0;
					var creditMark = 0;
					do {
						var debitObj = debitArr[debitMark];
						var cretitObj = creditArr[creditMark];
						if (outValue == 0) {
							outValue = parseFloat(debitObj.occurValue);
						}
						if (debitMark == 0 || outValue > 0) {
							// 判断本次溢出方
							var occValue = parseFloat((outValue - parseFloat(-1 * cretitObj.occurValue)).toFixed(2));
							// 上次借方溢出,贷方继续
							if (occValue >= 0) {
								caluateObj[voucherId][debitObj.serail]['corrSubject'].push({
									corrSubjectId: cretitObj.subjectId,
									corrDirection: cretitObj.direction,
									corrSubjectValue: (-1 * cretitObj.occurValue).toFixed(2)
								});
								caluateObj[voucherId][cretitObj.serail]['corrSubject'].push({
									corrSubjectId: debitObj.subjectId,
									corrDirection: debitObj.direction,
									corrSubjectValue: (cretitObj.occurValue).toFixed(2)
								});
								if (occValue == 0) {
									debitMark++;
									creditMark++;
								} else {
									creditMark++;
								}
							} else {
								caluateObj[voucherId][debitObj.serail]['corrSubject'].push({
									corrSubjectId: cretitObj.subjectId,
									corrDirection: cretitObj.direction,
									corrSubjectValue: outValue
								});
								caluateObj[voucherId][cretitObj.serail]['corrSubject'].push({
									corrSubjectId: debitObj.subjectId,
									corrDirection: debitObj.direction,
									corrSubjectValue: -1 * outValue
								});
								debitMark++;
							}
							outValue = occValue;
						} else {
							// 判断本次溢出方
							var occValue = parseFloat((outValue + parseFloat(debitObj.occurValue)).toFixed(2));
							// 上次贷方溢出,借方继续
							if (occValue >= 0) {
								caluateObj[voucherId][debitObj.serail]['corrSubject'].push({
									corrSubjectId: cretitObj.subjectId,
									corrDirection: cretitObj.direction,
									corrSubjectValue: -1 * outValue
								});
								caluateObj[voucherId][cretitObj.serail]['corrSubject'].push({
									corrSubjectId: debitObj.subjectId,
									corrDirection: debitObj.direction,
									corrSubjectValue: outValue
								});
								if (occValue == 0) {
									debitMark++;
									creditMark++;
								} else {
									creditMark++;
								}
							} else {
								caluateObj[voucherId][debitObj.serail]['corrSubject'].push({
									corrSubjectId: cretitObj.subjectId,
									corrDirection: cretitObj.direction,
									corrSubjectValue: (debitObj.occurValue).toFixed(2)
								});
								caluateObj[voucherId][cretitObj.serail]['corrSubject'].push({
									corrSubjectId: debitObj.subjectId,
									corrDirection: debitObj.direction,
									corrSubjectValue: (-1 * debitObj.occurValue).toFixed(2)
								});
								debitMark++;
							}
							outValue = occValue;
						}
					} while (debitMark < debitArr.length && creditMark < creditArr.length);
				}
			});
			// 匹配结果显示在画面上
			$('#table_accountledger tr').each(function () {
				var _tr = $(this);
				var rowObj = $('#table_accountledger').DataTable().row(_tr.index()).data();
				var rowVoucherId = rowObj.voucherId;
				if (caluateObj[rowVoucherId]) {
					var rowVoucher = caluateObj[rowVoucherId][rowObj.serail];
					var corrSubject = rowVoucher['corrSubject'];
					if (corrSubject && corrSubject.length > 0 && param.param4 == rowObj.direction && rowObj.subjectId.startsWith(param.param3)) {
						var corrTimes = corrSubject.length;
						if (corrTimes > 1) {
							for (let i = 0; i < corrTimes - 1; i++) {
								addRow(_tr.find('button[name=dfAdd]'));
							}
						}
						corrSubject.forEach(function (item, index, array) {
							_tr.find('select[name="dfSubject"]:eq(' + index + ')').val(item.corrDirection + ':' + item.corrSubjectId);
							_tr.find('input[name="dfValue"]:eq(' + index + ')').val(parseFloat(item.corrSubjectValue).toFixed(2));
						});
					}
				}
			});
			bdoInfoBox('', '使用小杏仁推荐，本次分析结果仅按照金额相等匹配，请确认无误后点击保存按钮！', 0);
		}
	});

	function compare(property, type) {
		return function (a, b) {
			var value1 = a[property];
			var value2 = b[property];
			if (type == '-1') {
				return value2 - value1;
			} else {
				return value1 - value2;
			}
		}
	}

	/** 清空 */
	$('#many_clear').click(function () {
		var voucherIdArr = [];
		$('#table_accountledger input[name="checkrow"]:checked').each(function () {
			var rowObj = $('#table_accountledger').DataTable().row($(this).closest('tr').index()).data();
			voucherIdArr.push(rowObj.voucherId);
		});
		if (voucherIdArr.length > 0) {
			$('#table_accountledger tr').each(function () {
				var _tr = $(this);
				if (_tr.find('input[name="dfValue"]').length > 0) {
					var rowObj = $('#table_accountledger').DataTable().row($(this).closest('tr').index()).data();
					if (voucherIdArr.indexOf(rowObj.voucherId) >= 0) {
						_tr.attr('data-change', '1');
						_tr.find('input[name="dfValue"]').val('');
					}
				}
			});
		}
	});

	/** 保存 */
	$('#many_preservation').click(function () {
		// 获取要保存的凭证号
		var voucherIdArr = [];
		$('#table_accountledger input[name="checkrow"]:checked').each(function () {
			var rowObj = $('#table_accountledger').DataTable().row($(this).closest('tr').index()).data();
			voucherIdArr.push(rowObj.voucherId);
		});
		if (voucherIdArr.length > 0) {
			var corrObjArr = [];
			$('#table_accountledger tr').each(function () {
				var _row = $(this);
				if (_row.attr('data-change') == '1' && _row.find('select[name="dfSubject"]').length > 0) {
					var rowObj = $('#table_accountledger').DataTable().row(_row.index()).data();
					if (voucherIdArr.indexOf(rowObj.voucherId) >= 0) {
						var corrObj = {
							subjectEntryId: rowObj.autoId,
							voucherId: rowObj.voucherId,
							serail: rowObj.serail,
							corrObjArr: []
						};
						_row.find('select[name="dfSubject"]').each(function () {
							var _select = $(this);
							var _input = _select.closest('div').find('input[name="dfValue"]');
							if (_input.val() != '') {
								corrObj.corrObjArr.push({
									corrSubjectId: _select.val(),
									corrValue: _input.val()
								});
							}
						});
						corrObjArr.push(corrObj);
					}
				}
			});
			if (corrObjArr && corrObjArr.length > 0) {
				bdoConfirmBox('保存分析', '确认是否保存选中的分析金额？', function () {
					bdoInProcessingBox('保存分析中,请稍后!');
					$.ajax({
						type: 'post',
						url: 'finCenter/CorrespondingVoucherAnalysis.updateCorrValue.json',
						data: {
							menuId: window.sys_menuId,
							lockProjectId: param.lockProjectId,
							lockYyyy: param.lockYyyy,
							param1: 'M',
							// subjectId
							param2: param.param3,
							// direction
							param3: param.param4,
							// startMonth
							param4: param.param1,
							// endMonth
							param5: param.param2,
							jsonData: JSON.stringify(corrObjArr)
						},
						dataType: 'json',
						success: function (data) {
							if (data.success) {
								$('#table_accountledger').DataTable().ajax.reload();
								$('input[type="checkbox"][name="checkall"]').prop('checked', false);
								if (data.data && data.data.length > 0) {
									let infoText = '以下科目保存失败<br><div style="height: 200px;overflow-y: auto"><table class="table table-bordered table-striped table-hover dataTable no-footer"><thead><th>凭证日期</th><th>号</th><th>科目</th><th>发生额</th><th>对应发生额</th></thead>';
									$.each(data.data, function (i, d) {
										infoText += '<tr>';
										infoText += '<td class="text-center">' + d.vchDate + '</td>';
										infoText += '<td class="text-center">' + d.oldVoucherId + '</td>';
										infoText += '<td class="text-left">' + d.subjectId + '-' + d.subjectFullName + '</td>';
										infoText += '<td class="text-right">' + formatMoney(d.dyValue1) + '</td>';
										infoText += '<td class="text-right">' + formatMoney(d.dyValue2) + '</td>';
										infoText += '</tr>';
									});
									infoText += '<tbody></div>';
									bdoInfoBox('', infoText, 0);
								} else {
									bdoSuccessBox('成功');
								}
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			}
		}
	});
	/** 导出 */
	$('#many_export').click(function () {
		exportExcelFin(this, '对应凭证分析列表', accountledger_view, 'table_accountledger');
	});
	/** 单元格点击事件 */
	$('#table_accountledger').on('click', 'td', function () {

		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_table_accountledger').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_table_accountledger').val('(' + data + ')');
			} else {
				$('#suanshi_table_accountledger').val(data);
			}
			$('#jieguo_table_accountledger').val(data);
		} else {
			value = $('#suanshi_table_accountledger').val();
			jieguo = $('#jieguo_table_accountledger').val();
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
				$('#suanshi_table_accountledger').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_table_accountledger').val(value + '+' + data);
			}
			$('#jieguo_table_accountledger').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 计算器重置
	$('#jsq_clear_subjectEntry').on('click', function () {

		$('#suanshi_table_accountledger').val('');
		$('#jieguo_table_accountledger').val('');
	});
	
	// 双击表单
	$('#table_accountledger tbody').on('dblclick', 'tr',function(e){
		var index = $(this).parent().context._DT_RowIndex;
		var rowObj = $('#table_accountledger').DataTable().row(index).data();
		voucherAnalysisDetailTable(rowObj, param);
		
		$('#modal_voucherdetail').modal('show');
	});
};