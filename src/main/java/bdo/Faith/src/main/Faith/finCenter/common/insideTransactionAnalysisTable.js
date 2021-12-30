$($('main .content .content')[0]).css('min-height', 480 + 'px');
var insideTransactionAnalysisTab = function (tabId, param) {

	if ($('#' + tabId + ' li a[href="#tab_insideTransaction"]').length != 0) {
		$('#' + tabId + ' li a[href="#tab_insideTransaction"]').remove();
	}

	$('#' + tabId + '').append('<li><a href="#tab_insideTransaction">关联方对账分析列表&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_insideTransaction"></div>');

	$('#' + tabId + ' a[href="#tab_insideTransaction"]').find('.fa-times-circle').click(function () {
		$(this).parents('ul').find('li').first().find('a').click();
		$(this).parents('li').remove();
		$('#tab_insideTransaction').remove();
	});
	if ($('#removeId').length != 0) {

		$('#removeId').remove();
	}

	var accountledager = '<div class="content" id="removeId">' + '<label class="css-input switch switch-sm switch-primary"><input type="checkbox" id="show_assItem" value=""><span></span></label>显示核算'
		+ '<div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options"><li>';
	//if(param.showType == '1'){
		accountledager = accountledager + '<button id="many_edit" type="button" style="float:left;color:white;" title="选择要分析的凭证,小杏仁帮您分析哟"><img src="img/bdo/xxr24.png" style="height: 22px;width: 22px;">&nbsp;推荐分析</button>'
		+ '<button id="many_clear" type="button" style="float:left;"><i class="fa fa-eraser" style="color: white;">&nbsp;清空</i></button>'
		+ '<button id="many_preservation" type="button" style="float:left;"><i class="fa fa-save" style="color: white;">&nbsp;保存</i></button>';
	//}
	accountledager = accountledager + '<button id="many_export" style="float:left;" type="button"><i class="si si-cloud-download" style="color: white;">&nbsp;导出</i></button>'
	+ '</li></ul><h3 class="block-title">关联方对账分析列表一览<span>&nbsp;'
	+ '</span></h3></div><div class="block-content"><div style="clear:both;"></div>'
	+ '<table id="table_accountledger" class="table table-bordered table-striped table-hover"></table>' + '</div></div></div>';

	$('#tab_insideTransaction').append(accountledager);
	$('#' + tabId + ' a[href="#tab_insideTransaction"]').click();

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
			url: 'finCenter/CorrespondingVoucherAnalysis.getInsideTransactionVoucherList.json',
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
				if(param.showType == '0'){
					for(var i = 0;i < param.relatedList.length;i++){
						if(param.relatedList[i].merchantId == data.subjectId){
							$(row).find('td').eq(7).css({ "background-color": '#00FF00' });
							break;
						}
					}
				}
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
					name: 'corrSubject',
					data: 'corrSubject',
					width: '350px',
					render: function (data, type, row, meta) {
						var rowHtml = '';
						if ('0' == row.type) {
							// 对应科目编号下拉框
							var subjectIdsArr = row.subjectIds.split(',');
							// 是否已有分析
							if (data && data > '') {
								var corrSubjectArr = data.split(',');
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
						} else if (row.type == '1') {
							return '<span style="color:green;"></span>'
						} else {
							return '<span style="color:red;">不一致</span>'
						}
					}
				}]
		}
	};
	jsq(accountledger_view.tableParam, 'table_accountledger');
	if(param.showType == '1'){
		BdoDataTable('table_accountledger', accountledger_view);
	}else{
		$('#show_assItem').attr("checked","checked");
		accountledger_view.localParam.urlparam.param2 = '1';
		BdoDataTable('table_accountledger', accountledger_view);
	}

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
			var groupCaluateObj = {};
			var directionChangeCount = 0;
			var preDirection = '';
			var preVoucherId = '';
			var groupKey = '';
			var dOccurValue = 0;
			var cOccurValue = 0;
			$('#table_accountledger tr').each(function () {
				var _tr = $(this);
				var rowObj = $('#table_accountledger').DataTable().row(_tr.index()).data();
				if(rowObj.type == '0'){
					var rowVoucherId = rowObj.voucherId;
					var rowDirection = rowObj.direction;
					var rowOccurValue = rowObj.occurValue;
					var rowSerail = rowObj.serail;
					if(preDirection == ''){
						preVoucherId = rowVoucherId;
						preDirection = rowDirection;
						groupKey = rowSerail;
					}
					if(preDirection != rowDirection){
						directionChangeCount = directionChangeCount + 1;
						preDirection = rowDirection;
					}
					if(directionChangeCount > 1 || preVoucherId != rowVoucherId){
						preVoucherId = rowVoucherId;
						preDirection = rowDirection;
						groupKey = rowSerail;
						directionChangeCount = 0;
						//dOccurValue = 0;
						//cOccurValue = 0;
					}/*else{
						if(rowDirection == '1'){
							dOccurValue = dOccurValue + rowOccurValue;
						}else if(rowDirection == '-1'){
							cOccurValue = cOccurValue + rowOccurValue;
						}
					}*/
					if (voucherIdArr.indexOf(rowVoucherId) >= 0) {
						// 清空页面数据
						_tr.find('button[name="dfDel"]').click();
						_tr.find('input[name="dfValue"]').val('');
						_tr.attr('data-change', '1');
						/*if (typeof (caluateObj[rowVoucherId]) == 'undefined') {
							caluateObj[rowVoucherId] = new Array();
						}
						if (typeof (caluateObj[rowVoucherId][rowObj.serail]) == 'undefined') {
							caluateObj[rowVoucherId][rowObj.serail] = new Object();
						}
						caluateObj[rowVoucherId][rowObj.serail] = {
							serail: rowObj.serail,
							direction: rowObj.direction,
							subjectId: rowObj.subjectId,
							occurValue: rowObj.occurValue,
							corrSubject: []
						};*/
						if (typeof (groupCaluateObj[rowVoucherId + '-' + groupKey]) == 'undefined') {
							groupCaluateObj[rowVoucherId + '-' + groupKey] = [];
						}
						if (typeof (groupCaluateObj[rowVoucherId + '-' + groupKey][rowObj.serail]) == 'undefined') {
							groupCaluateObj[rowVoucherId + '-' + groupKey][rowObj.serail] = {};
						}
						groupCaluateObj[rowVoucherId + '-' + groupKey][rowObj.serail] = {
							serail: rowObj.serail,
							direction: rowObj.direction,
							subjectId: rowObj.subjectId,
							occurValue: rowObj.occurValue,
							corrSubject: []
						};
					}
				}
			});
			// 开始分组
			$.each(groupCaluateObj, function (voucherId, voucherArr) {
				// 按借贷方分组
				var debitArr = voucherArr.filter(item => item.direction == '1');
				var creditArr = voucherArr.filter(item => item.direction == '-1');
				var debitSum = debitArr.reduce((total, item) => total + item.occurValue, 0);
				var creditSum = creditArr.reduce((total, item) => total + item.occurValue, 0);
				var voucherKey = '';
				if(debitSum == creditSum){
					// 金额相同为同一组
					voucherKey = voucherId;
				}else{
					// 金额不同
					var subIndex = voucherId.indexOf('-');
					voucherKey = voucherId.substring(0, subIndex);
				}
				$.each(voucherArr, function (serail, serailArr) {
					if(typeof (serailArr) != 'undefined'){
						if (typeof (caluateObj[voucherKey]) == 'undefined') {
							caluateObj[voucherKey] = [];
						}
						if (typeof (caluateObj[voucherKey][serail]) == 'undefined') {
							caluateObj[voucherKey][serail] = {};
						}
						caluateObj[voucherKey][serail] = serailArr;
					}
				});
			});
			//console.log(caluateObj);
			// 开始匹配
			$.each(caluateObj, function (voucherId, voucherArr) {
				// 看分析的科目在借方还是贷方
				var dDirection = '1';
				var cDirection = '-1';
				$.each(voucherArr, function (serail, serailArr) {
					if(typeof (serailArr) != 'undefined' && serailArr.subjectId.startsWith(param.subjectId)){
						if(serailArr.direction == '1'){
							dDirection = '1';
							cDirection = '-1';
						}else{
							dDirection = '-1';
							cDirection = '1';
						}
						return false;
					}
				});
				// 按借贷方分组
				var debitArr = voucherArr.filter(item => item.direction == dDirection);
				var creditArr = voucherArr.filter(item => item.direction == cDirection);
				var debitSum = debitArr.reduce((total, item) => total + item.occurValue, 0);
				var creditSum = creditArr.reduce((total, item) => total + item.occurValue, 0);
				// 按发生额排序
				debitArr.sort(compare('occurValue', -1));
				creditArr.sort(compare('occurValue', -1));
				// 按比例分配
				for (let dindex = 0; dindex < debitArr.length; dindex++) {
					var ditem = debitArr[dindex];
					for (let cindex = 0; cindex < creditArr.length; cindex++) {
						var citem = creditArr[cindex];
						var curValue = ((parseFloat(ditem.occurValue) / debitSum) * parseFloat(citem.occurValue));
						if(cindex == creditArr.length - 1){
							var tempSum = caluateObj[voucherId][ditem.serail]['corrSubject'].reduce((total, item) => total + parseFloat(item.corrSubjectValue), 0);
							var curValue = parseFloat(ditem.occurValue) - tempSum;
						}
						if(dindex == debitArr.length - 1){
							var tempSum = caluateObj[voucherId][citem.serail]['corrSubject'].reduce((total, item) => total + parseFloat(item.corrSubjectValue), 0);
							var curValue = parseFloat(citem.occurValue) - tempSum;
						}
						caluateObj[voucherId][ditem.serail]['corrSubject'].push({
							corrSubjectId: citem.subjectId,
							corrDirection: citem.direction,
							corrSubjectValue: curValue.toFixed(2)
						});
						caluateObj[voucherId][citem.serail]['corrSubject'].push({
							corrSubjectId: ditem.subjectId,
							corrDirection: ditem.direction,
							corrSubjectValue: curValue.toFixed(2)
						});
					}
				}
			});
			// 按凭证号赋值
			$.each(caluateObj, function (voucherId, voucherArr) {
				var subIndex = voucherId.indexOf('-');
				if(subIndex > 0){
					var voucherKey = voucherId.substring(0, subIndex);
					$.each(voucherArr, function (serail, serailArr) {
						if(typeof (serailArr) != 'undefined'){
							if (typeof (caluateObj[voucherKey]) == 'undefined') {
								caluateObj[voucherKey] = [];
							}
							if (typeof (caluateObj[voucherKey][serail]) == 'undefined') {
								caluateObj[voucherKey][serail] = {};
							}
							caluateObj[voucherKey][serail] = serailArr;
						}
					});
				}
			});
			// 匹配结果显示在画面上
			$('#table_accountledger tr').each(function () {
				var _tr = $(this);
				var rowObj = $('#table_accountledger').DataTable().row(_tr.index()).data();
				var rowVoucherId = rowObj.voucherId;
				if (caluateObj[rowVoucherId] && rowObj.type == '0') {
					var rowVoucher = caluateObj[rowVoucherId][rowObj.serail];
					var corrSubject = rowVoucher['corrSubject'];
					if (corrSubject && corrSubject.length > 0) {
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
			bdoInfoBox('', '使用小杏仁推荐，本次分析结果仅按照金额比例匹配，请确认无误后点击保存按钮！', 0);
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
							param1: 'R',
							// subjectId
							param2: '0',
							// direction
							param3: '0',
							// startMonth
							param4: '1',
							// endMonth
							param5: '12',
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
		exportExcelFin(this, '关联方对账分析列表', accountledger_view, 'table_accountledger');
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
	/** 显示核算 */
	$('#show_assItem').click(function() {
		if ($('#show_assItem').is(':checked')) {
			accountledger_view.localParam.urlparam.param2 = '1';
		} else {
			accountledger_view.localParam.urlparam.param2 = '0';
		}
		$('#table_accountledger').DataTable().ajax.reload(null,false);
	});

	// 计算器重置
	$('#jsq_clear_subjectEntry').on('click', function () {

		$('#suanshi_table_accountledger').val('');
		$('#jieguo_table_accountledger').val('');
	});
};