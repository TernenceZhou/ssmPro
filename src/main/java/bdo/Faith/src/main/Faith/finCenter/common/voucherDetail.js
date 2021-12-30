var voucherTab = function(tabId, customerId, typeId, oldVoucherId, voucherDate, voucherId) {
	// 如果tab存在先清除
	clearVoucherTab(tabId);
	var samplingParam = {};
	$('#' + tabId + '').append('<li><a href="#tab_voucherdetail">凭证详细&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	var modal_selectProject = '<div class="modal fade" id="modal_selectProject" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false"> '
	+'    <div class="modal-dialog modal-md">                                                                                                       '
	+'        <div class="modal-content">                                                                                                           '
	+'            <div class="block block-themed block-transparent remove-margin-b">                                                                '
	+'                <div class="block-header bg-info">                                                                                            '
	+'                    <ul class="block-options">                                                                                                '
	+'                        <li>                                                                                                                  '
	+'                            <button class="btn btn-md btn-primary" type="button" id="modal_selectProject_sure">                               '
	+'                                <i class="fa fa-hand-lizard-o" title="选择"></i>                                                             '
	+'                            </button>                                                                                                         '
	+'                        </li>                                                                                                                 '
	+'                        <li>                                                                                                                  '
	+'                            <button type="button" data-dismiss="modal">                                                                       '
	+'                                <i class="si si-close"></i>                                                                                   '
	+'                            </button>                                                                                                         '
	+'                        </li>                                                                                                                 '
	+'                    </ul>                                                                                                                     '
	+'                    <h3 class="block-title">选择项目</h3>                                                                                     '
	+'                </div>                                                                                                                        '
	+'            </div>                                                                                                                            '
	+'            <div class="modal-body" style="min-height: 500px; max-height: 500px">                                                             '
	+'                <div id="selectProject_tree"></div>                                                                                           '
	+'            </div>                                                                                                                            '
	+'        </div>                                                                                                                                '
	+'    </div>                                                                                                                                    '
	+'</div>                                                                                                                                        ';
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_voucherdetail"></div><div id="tab_voucherdetail_sampling"></div>' + modal_selectProject);
	$('#' + tabId + ' a[href="#tab_voucherdetail"]').find('.fa-times-circle').click(function() {
		$('#modal_selectProject').remove();
		$(this).parents('ul').find('li').first().find('a').click();
		$(this).parents('li').remove();
		$('#tab_voucherdetail').remove();
		$('#tab_voucherdetail_sampling').remove();
	});
	$('#tab_voucherdetail').empty();
	var voucher = '<div class="content">' + '<label class="css-input switch switch-sm switch-primary"><input type="checkbox" id="show_assItem" value=""><span></span></label>显示核算'
			+ '<div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options">'
			+ '<li><button id="voucherDetail_sampling" type="button"><i class="fa fa-hand-lizard-o" style="color: white;" title="抽凭"></i></button></li>'
			+ '<li><button id="voucherDetail_setTran" type="button"><i class="fa fa-random" style="color: white;" title="设置结转"></i></button></li>'
			+ '<li><button id="voucherDetail_cancelTran" type="button"><i class="fa fa-undo" style="color: white;" title="取消结转"></i></button></li>'
			+ '<li><button id="voucherDetail_export" type="button"><i class="si si-cloud-download" style="color: white;" title="导出"></i></button></li>'
			+ '</ul><h3 class="block-title"><span id="oldvoucherId"></span></h3> </div><div class="block-content">'
			+ '<table id="voucherDetail_tab" class="table table-bordered table-hover"></table>	' + '<div>' + '<br><div class="row">'
			+ '<div class="col-sm-3">财务主管:<span id="voucher_director"></span></div>' + '<div class="col-sm-3">记账人:<span id="voucher_keepUser"></span></div>'
			+ '<div class="col-sm-3">审核人:<span id="voucher_auditUser"></span></div>' + '<div class="col-sm-3">制单人:<span id="voucher_fillUser"></span></div>' + '</div></div><br></div></div></div>';
	$('#tab_voucherdetail').html(voucher);
	$('#oldvoucherId').html('凭证日期：' + voucherDate + '&emsp;&emsp;&emsp;&emsp;&emsp;凭证号：' + typeId + oldVoucherId);
	$('#' + tabId + ' a[href="#tab_voucherdetail"]').click();
	/** table 属性 */
	if (oldVoucherId && oldVoucherId != '') {
		var voucher_view_index = 1;
		var voucher_view = {
			localParam : {
				tabNum : true,
				url : 'finCenter/SubjectEntry.getSubjectEntryDetailView.json',
				urlparam : {
					menuId : window.sys_menuId,
					jsonData : JSON.stringify({
						'vchDate' : voucherDate,
						'voucherId' : voucherId,
						'typeId' : typeId,
						'oldVoucherId' : oldVoucherId,
						'showAssItem' : '0'
					}),
					lockProjectId : customerId,
					lockYyyy : voucherDate.substr(0, 4)
				}
			},
			tableParam : {
				param1 : 'jsq',
				select : true,
				lengthChange : false,
				dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				ordering : false,
				serverSide : true,
				infoCallback : fnInfoCallback,
				rowReorder : {
					update : false
				},
				fixedThead : true,
				fixedHeight : '500px',
				columnDefs : [
						{
							targets : voucher_view_index++,
							orderable : false,
							className : 'text-left',
							title : '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input id="checkAll" onclick="checkAll(this);" type="checkbox" value=""><span></span></label>',
							data : null,
							width : '10px',
							render : function(data, type, row, meta) {
								var renderStr = '';
								if (row.type == '0') {
									renderStr += '<div align="center"><label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox" name="chkEntry" value="'
											+ row.serail + '"><span></span></label></div>';
								}
								return renderStr;
							}
						},
						{
							targets : voucher_view_index++,
							className : 'hidden',
							title : '分录号',
							name : 'serail',
							data : 'serail',
							width : '10px'
						},
						{
							targets : voucher_view_index++,
							className : 'text-left',
							title : '摘要',
							name : 'summary',
							data : 'summary',
							width: '200px',
							render: function (data, type, row, meta) {
								if (data && data.length > 15) {
									return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
								}
								return data;
							}
						},
						{
							targets : voucher_view_index++,
							className : 'text-left',
							title : '科目编号',
							name : 'subjectId',
							data : 'subjectId',
							width : '60px'
						},
						{
							targets : voucher_view_index++,
							className : 'text-left',
							title : '科目名称',
							name : 'subjectFullName',
							data : 'subjectFullName',
							width : '100px'
						},
						{
							targets : voucher_view_index++,
							className : 'text-right',
							title : '借方金额',
							name : 'debitOcc',
							data : 'debitOcc',
							width : '80px',
							render : function(data, type, row, meta) {
								return formatMoney(data);
							}
						},
						{
							targets : voucher_view_index++,
							className : 'text-right',
							title : '贷方金额',
							name : 'creditOcc',
							data : 'creditOcc',
							width : '80px',
							render : function(data, type, row, meta) {
								return formatMoney(data);
							}
						},
						{
							targets : voucher_view_index++,
							className : 'text-left',
							title : '汇率',
							name : 'currrate',
							data : 'currrate',
							width : '30px'
						},
						{
							targets : voucher_view_index++,
							className : 'text-right',
							title : '外币金额',
							name : 'currValue',
							data : 'currValue',
							width : '80px',
							render : function(data, type, row, meta) {
								return formatMoney(data);
							}
						},
						{
							targets : voucher_view_index++,
							className : 'text-left',
							title : '外币名称',
							name : 'currency',
							data : 'currency',
							width : '30px'
						},
						{
							targets : voucher_view_index++,
							className : 'text-left',
							title : '是否结转',
							name : 'isTransferVoucher',
							data : 'isTransferVoucher',
							width : '20px',
							render : function(data, type, row, meta) {
								var html = data;
								if (html == '是') {
									html = '<label style="font-size: 10px;position: relative;top:5px;">'
											+ '<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' + '</label>';
								}
								return html;
							}
						} ]
			}
		};
	} else {
		var voucher_view_index = 1;
		var voucher_view = {
			localParam : {
				tabNum : true,
				url : 'finCenter/SubjectEntry.getDetailVoucher.json',
				urlparam : {
					menuId : window.sys_menuId,
					param2 : typeId,
					param3 : voucherId,
					param4 : voucherDate,
					lockProjectId : customerId,
					lockYyyy : voucherDate.substr(0, 4)
				}
			},
			tableParam : {
				param1 : 'jsq',
				select : true,
				lengthChange : false,
				dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				ordering : false,
				serverSide : true,
				infoCallback : fnInfoCallback,
				rowReorder : {
					update : false
				},
				fixedThead : true,
				fixedHeight : '500px',
				columnDefs : [
						{
							targets : voucher_view_index++,
							orderable : false,
							className : 'text-left',
							title : '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input id="checkAll" onclick="checkAll(this);" type="checkbox" value=""><span></span></label>',
							data : null,
							width : '10px',
							render : function(data, type, row, meta) {
								var renderStr = '';
								if (row.type == '0') {
									renderStr += '<div align="center"><label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox" name="chkEntry" value="'
											+ row.serail + '"><span></span></label></div>';
								}
								return renderStr;
							}
						}, {
							targets : voucher_view_index++,
							className : 'text-left',
							title : '分录号',
							name : 'serail',
							data : 'serail',
							width : '10px'
						}, {
							targets : voucher_view_index++,
							className : 'text-left',
							title : '摘要',
							name : 'summary',
							data : 'summary',
							width: '200px',
							render: function (data, type, row, meta) {
								if (data && data.length > 15) {
									return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
								}
								return data;
							}
						}, {
							targets : voucher_view_index++,
							className : 'text-left',
							title : '科目编号',
							name : 'subjectId',
							data : 'subjectId',
							width : '60px'
						}, {
							targets : voucher_view_index++,
							className : 'text-left',
							title : '科目名称',
							name : 'subjectFullName',
							data : 'subjectFullName',
							width : '100px'
						}, {
							targets : voucher_view_index++,
							className : 'text-right',
							title : '借方金额',
							name : 'debitOcc',
							data : 'debitOcc',
							width : '80px',
							render : function(data, type, row, meta) {
								return formatMoney(data);
							}
						}, {
							targets : voucher_view_index++,
							className : 'text-right',
							title : '贷方金额',
							name : 'creditOcc',
							data : 'creditOcc',
							width : '80px',
							render : function(data, type, row, meta) {
								return formatMoney(data);
							}
						}, {
							targets : voucher_view_index++,
							className : 'text-left',
							title : '汇率',
							name : 'currRate',
							data : 'currRate',
							width : '30px'
						}, {
							targets : voucher_view_index++,
							className : 'text-right',
							title : '外币金额',
							name : 'currValue',
							data : 'currValue',
							width : '80px',
							render : function(data, type, row, meta) {
								return formatMoney(data);
							}
						}, {
							targets : voucher_view_index++,
							className : 'text-left',
							title : '外币名称',
							name : 'currency',
							data : 'currency',
							width : '30px'
						}, {
							targets : voucher_view_index++,
							className : 'text-left',
							title : '是否结转',
							name : 'isTransferVoucher',
							data : 'isTransferVoucher',
							width : '20px'
						} ]
			}
		};
	}

	/** 显示核算 */
	$('#show_assItem').click(function() {
		if ($('#show_assItem').is(':checked')) {
			voucher_view.localParam.urlparam.jsonData = JSON.stringify({'vchDate':voucherDate,'voucherId':voucherId,'typeId':typeId,'oldVoucherId':oldVoucherId,'showAssItem':'1'});
		} else {
			voucher_view.localParam.urlparam.jsonData = JSON.stringify({'vchDate':voucherDate,'voucherId':voucherId,'typeId':typeId,'oldVoucherId':oldVoucherId,'showAssItem':'0'});
		}
		voucherSer();
	});

	/** 设置结转凭证 */
	$('#voucherDetail_setTran').click(function() {
		var serails = '';
		$('input[name="chkEntry"]:checked').each(function() {
			if (serails == '') {
				serails = $(this).val();

			} else {
				serails = serails + ',' + $(this).val();
			}
		});

		if (serails == '') {
			bdoInfoBox('提示', '请选择分录');
			return;
		}
		bdoInProcessingBox('正在设置结转!');

		$.ajax({
			type : 'post',
			url : 'finCenter/SubjectEntry.setTranVoucher.json',
			data : {
				param3 : voucherId,
				param4 : serails,
				param5 : voucherDate,
				lockProjectId : customerId,
				lockYyyy : voucherDate.substr(0, 4)
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					BdoDataTable('voucherDetail_tab', voucher_view);
					bdoSuccessBox('设置成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('设置失败', data.resultInfo.statusText);
				}
			}
		});
	});

	/** 取消设置结转凭证 */
	$('#voucherDetail_cancelTran').click(function() {
		var serails = '';
		$('input[name="chkEntry"]:checked').each(function() {
			if (serails == '') {
				serails = $(this).val();

			} else {
				serails = serails + ',' + $(this).val();
			}
		});

		if (serails == '') {
			bdoInfoBox('提示', '请选择分录');
			return;
		}

		bdoInProcessingBox('正在取消结转!');
		$.ajax({
			type : 'post',
			url : 'finCenter/SubjectEntry.cancelTranVoucher.json',
			data : {
				param3 : voucherId,
				param4 : serails,
				param5 : voucherDate,
				lockProjectId : customerId,
				lockYyyy : voucherDate.substr(0, 4)
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					BdoDataTable('voucherDetail_tab', voucher_view);
					bdoSuccessBox('取消结转成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('取消结转失败', data.resultInfo.statusText);
				}
			}
		});
	});

	/** 导出 */
	$('#voucherDetail_export').click(function() {
		exportExcelFin(this, '凭证详细', voucher_view, 'voucherDetail_tab');
	});

	/** 抽凭 */
	$('#voucherDetail_sampling').click(function() {
		selectProject(customerId,'');
	});

	// 选择项目
	function selectProject(customerId, customername, onExport) {
		if (customerId == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		var serails = '';
		var object = [];
		$('input[name="chkEntry"]:checked').each(function() {
			if (serails == '') {
				serails = $(this).val();
				object = $('#voucherDetail_tab').DataTable().data()[$(this).closest('tr').index()];
			} else {
				serails = serails + ',' + $(this).val();
			}
		});

		if (serails == '') {
			bdoInfoBox('提示', '请选择分录');
			return;
		}
		if (serails.split(',').length > 1) {
			bdoInfoBox('提示', '只能选择1条分录');
			return;
		}
		samplingParam = object;
		
		$('#modal_selectProject').modal('show');
		$('#modal_selectProject_sure').attr('disabled', false);

		if ($('#selectProject_tree').hasClass('treeview')) {

			$('#selectProject_tree').tree('reset');
			$('#selectProject_tree').tree('destory');

		}
		$('#selectProject_tree').tree({
			url: 'cpBase/TreeCommon.findCustomerProject.json',
			params: {
				param1: customerId,
				param2: customername,
				param3: voucherDate
			},
			singleSelect: true,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: false,
				selectedColor: '#fff',
				onlyLeafCheck: true,
				selectedBackColor: '#4ca2e8',
				singleSelect: true
			}
		});
		onExport && $('#modal_selectProject_sure').click(onExport);
	}
	/** 选中项目 */
	$('#modal_selectProject_sure').click(function() {
		let node = getNode();
		if (node) {
			$('#modal_selectProject').modal('hide');
			node.samplingSource = '1';
			node.customerId = samplingParam.customerId;
			node.projectId = customerId;
			node.typeId = typeId;
			node.oldVoucherId = oldVoucherId;
			node.voucherDate = voucherDate;
			node.voucherId = voucherId;
			node.serail = samplingParam.serail;
			node.subjectId = samplingParam.subjectId;
			$('#tab_voucherdetail_sampling').empty();
			SamplingList({region: '#tab_voucherdetail_sampling', data: node});
			$('#samplingSet_add_customize').click();
			$("#samplingList_method option[value='8']").prop("selected", true);
			$('#samplingList_method').change();
		}
	});
	function getNode() {
		$('#modal_tbsubjectid_sure').attr('disabled', true);
		var tree = $('#selectProject_tree').treeview(true);
		var node = tree.getSelected()[0];
		if (node == null || node == '') {
			bdoInfoBox('提示', '请选择项目');
			$('#modal_selectProject_sure').attr('disabled', false);
			return false;
		} else {

			let param = {};
			while (node.parentId != undefined) {
				if (node.typeName == 'project') {
					param.projectId = encodeURI(node.id);
				}
				node = tree.getParent(node);
			}

			return param;
		}
	}
	voucherSer();

	function voucherSer() {
		jsq(voucher_view.tableParam, 'voucherDetail_tab');
		BdoDataTable('voucherDetail_tab', voucher_view);

		/*$('#voucherDetail_tab tbody').on('dblclick', 'tr', function() {
			var object = $('#voucherDetail_tab').DataTable().data()[$(this).closest('tr').index()];
			if (oldVoucherId) {
				accountledagerTab(tabId, customerId, voucherDate.substr(0, 4), object.subjectId);
			} else {
				assitemLedagerTab(tabId, customerId, object.yyyy, object.subjectId, object.assItemId)
			}
		});*/

		$.ajax({
			type : 'post',
			url : 'finCenter/General.query.json',
			data : {
				sqlId : 'FIN100010',
				param2 : typeId,
				param3 : oldVoucherId,
				param4 : voucherDate,
				lockProjectId : customerId,
				lockYyyy : voucherDate.substr(0, 4)
			},
			dataType : 'json',
			success : function(data) {
				if (data != null && data.data != null && data.data.length > 0) {
					$('#voucher_director').text(data.data[0].director);
					$('#voucher_keepUser').text(data.data[0].voucherKeepUser);
					$('#voucher_auditUser').text(data.data[0].voucherAuditUser);
					$('#voucher_fillUser').text(data.data[0].voucherFillUser);
				}
			}
		});
	}

	/** 单元格点击事件 */
	$('#voucherDetail_tab').on('click', 'td', function() {

		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_voucherDetail_tab').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_voucherDetail_tab').val('(' + data + ')');
			} else {
				$('#suanshi_voucherDetail_tab').val(data);
			}
			$('#jieguo_voucherDetail_tab').val(data);
		} else {
			value = $('#suanshi_voucherDetail_tab').val();
			jieguo = $('#jieguo_voucherDetail_tab').val();
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
				$('#suanshi_voucherDetail_tab').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_voucherDetail_tab').val(value + '+' + data);
			}
			$('#jieguo_voucherDetail_tab').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	// 计算器重置
	$('#jsq_clear_voucherDetail_tab').on('click', function() {

		$('#suanshi_voucherDetail_tab').val('');
		$('#jieguo_voucherDetail_tab').val('');
	});
};
var clearVoucherTab = function(tabId) {
	if ($('#' + tabId + ' li a[href="#tab_voucherdetail"]').length != 0) {
		$('#' + tabId + ' a[href="#tab_voucherdetail"]').remove();
		$('#tab_voucherdetail').remove();
		$('#tab_voucherdetail_sampling').remove();
		$('#modal_selectProject').remove();
	}
}
function checkAll(obj) {
	if (obj.checked) {
		$(obj).attr('checked', 'checked');
		$('input[name=\'chkEntry\']').each(function() {
			this.checked = true;
		});
	} else {
		$(obj).removeAttr('checked');
		$('input[name=\'chkEntry\']').each(function() {
			this.checked = false;
		});
	}
}
