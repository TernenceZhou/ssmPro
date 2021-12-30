var conformationDetailTab = function(tabId, projectId, checkSubject) {
	var conformationDetailId = 'tab_conformationDetail';
	if ($('#' + tabId + ' li a[href="#' + conformationDetailId + '"]').length != 0) {
		$('#' + tabId + ' a[href="#' + conformationDetailId + '"]').remove();
		$('#' + conformationDetailId + '').remove();
	}

	$('#' + tabId + '').append('<li><a href="#' + conformationDetailId + '">函证明细&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="' + conformationDetailId + '"></div>');

	$('#' + tabId + ' a[href="#' + conformationDetailId + '"]').find('.fa-times-circle').click(function() {
		$(this).parents('ul').find('li').first().find('a').click();
		$(this).parents('li').remove();
		$('#' + conformationDetailId + '').remove();
	});
	$('#' + conformationDetailId + '').empty();
	var conformationDetailContent = '<div class="content">'
		+ '<div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options">'
		//+ '<li><button id="voucherDetail_export" type="button"><i class="si si-cloud-download" style="color: white;" title="导出"></i></button></li>'
		+ '</ul><h3 class="block-title">函证明细 &emsp;' + checkSubject + '</h3> </div><div class="block-content">'
		+ '<table id="conformationDetailTable" class="table table-bordered table-hover"></table>	'
		+ '<br></div></div></div>';
	$('#' + conformationDetailId + '').html(conformationDetailContent);
	//$('#oldvoucherId').html(oldVoucherId);
	$('#' + tabId + ' a[href="#' + conformationDetailId + '"]').click();
	//$(document).resize();
	/** table 属性 */
	let tableColIndex = 1;
	var conformationDetail_view = {
		localParam: {
			tabNum: true,
			url: 'dgCenter/DgCorrespondenceSummary.getConformationDetail.json',
			urlparam: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				sqlId: '',
				param1: checkSubject,
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			rowReorder: {
				update: false
			},
			fixedThead: true,
			fixedHeight: '500px',
			columnDefs: [{
				targets: tableColIndex ++,
				className: 'text-center',
				title: '附件',
				name: 'sendId',
				data: 'sendId',
				width: '50px',
				render: function(data, type, row, meta) {
					var renderStr = '';
					renderStr += '<button class="btn btn-xs btn-success" type="button" name="showFile" data-placement="top" title="附件" data-toggle="tooltip"><i class="fa fa-files-o"></i></button>&nbsp;';
					return renderStr;
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '是否回函',
				name : 'replyFlg',
				data : 'replyFlg',
				width : '100px',
				render: function(data, type, row, meta) {
					if(data == '1'){
						return '是';
					}else if(data == '0'){
						return '否';
					}else{
						return data;
					}
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '发函编号',
				name : 'sendId',
				data : 'sendId',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '回函编号',
				name : 'replyId',
				data : 'replyId',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '收件单位',
				name : 'consigneeCompany',
				data : 'consigneeCompany',
				width : '100px',
				visible : checkSubject.indexOf('银行') != -1 ? false : true
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '开户银行',
				name : 'bank',
				data : 'bank',
				width : '100px',
				visible : checkSubject.indexOf('银行') != -1 ? true : false
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '银行账号',
				name : 'bankAccount',
				data : 'bankAccount',
				width : '100px',
				visible : checkSubject.indexOf('银行') != -1 ? true : false
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '询证金额',
				name : 'requestAmount',
				data : 'requestAmount',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '询证金额（人民币）',
				name : 'requestAmountCny',
				data : 'requestAmountCny',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '回函金额',
				name : 'replyAmount',
				data : 'replyAmount',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '回函金额（人民币）',
				name : 'replyAmountCny',
				data : 'replyAmountCny',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '替代确认金额',
				name : 'subRecognitionAmount',
				data : 'subRecognitionAmount',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '替代确认金额（人民币）',
				name : 'subRecognitionAmountCny',
				data : 'subRecognitionAmountCny',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '可确认金额',
				name : 'recognitionAmount',
				data : 'recognitionAmount',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '可确认金额（人民币）',
				name : 'recognitionAmountCny',
				data : 'recognitionAmountCny',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '差异金额',
				name : 'differenceAmount',
				data : 'differenceAmount',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-right',
				title : '差异金额（人民币）',
				name : 'differenceAmountCny',
				data : 'differenceAmountCny',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '收件地址',
				name : 'consigneeAddress',
				data : 'consigneeAddress',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '收件人',
				name : 'consigneeName',
				data : 'consigneeName',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '联系电话',
				name : 'consigneePhone',
				data : 'consigneePhone',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '邮政编码',
				name : 'zipCode',
				data : 'zipCode',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '寄件方式',
				name : 'sendType',
				data : 'sendType',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '发函信件单号',
				name : 'expressNumber',
				data : 'expressNumber',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '函证类型',
				name : 'confirmationType',
				data : 'confirmationType',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '发函日期',
				name : 'sendDate',
				data : 'sendDate',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '回函日期',
				name : 'replyInfoDate',
				data : 'replyInfoDate',
				width : '100px'
			}, {
				targets : tableColIndex ++,
				className : 'text-left',
				title : '回函信件单号',
				name : 'replyExpressNumber',
				data : 'replyExpressNumber',
				width : '100px'
			}
		]}
	};

	/** 导出 */
	/*$('#voucherDetail_export').click(function() {
		exportExcelFin(this, '凭证详细', voucher_view, 'voucherDetail_tab');
	});*/
	/**
	 * 附件一览配置
	 */
	let attachListColIndex = 1;
	const attachListTableCfg = {
		localParam: {
			url: 'dgCenter/DgCorrespondenceSummary.getAttachList.json',
			urlparam: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				sqlId: '',
				param1: '',
				limit: -1,
				start: -1
			},
			tabNum: true
		},
		tableParam: {
			select: true,
			lengthChange: false,
			scrollX: true,
			scrollY: '300px',
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			// serverSide: true,
			fixedThead: true,
			scrollCollapse: true,
			columnDefs: [
				{
					targets: attachListColIndex ++,
					className: 'text-center',
					title: '附件预览',
					name: 'fileUrl',
					data: 'fileUrl',
					width: '50px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="previewFile" data-placement="top" title="预览" data-toggle="tooltip"><i class="fa fa-eye"></i></button>&nbsp;';
						return renderStr;
					}
				}, {
					targets : attachListColIndex ++,
					className : 'text-left',
					title : '文件名',
					name : 'fileName',
					data : 'fileName',
					width : '200px'
				}, {
					targets : attachListColIndex ++,
					className : 'text-left',
					title : '上传时间',
					name : 'uploadTime',
					data : 'uploadTime',
					width : '150px'
				}, {
					targets : attachListColIndex ++,
					className : 'text-left',
					title : '上传人',
					name : 'uploadUser',
					data : 'uploadUser',
					width : '100px'
				}, {
					targets : attachListColIndex ++,
					className : 'text-left',
					title : '附件类型',
					name : 'fileType',
					data : 'fileType',
					width : '100px',
					render: function(data, type, row, meta) {
						if(data == '1'){
							return '发函附件';
						}else if(data == '2'){
							return '回函附件';
						}else{
							return data;
						}
					}
				}
			]
		}
	};
	
	conformationDetailSearch();
	/** 查询 */
	function conformationDetailSearch() {
		BdoDataTable('conformationDetailTable', conformationDetail_view);
	}
	/** 弹出附件 */
	$('#conformationDetailTable').off("click", 'button[name="showFile"]');
	$('#conformationDetailTable').on('click', 'button[name="showFile"]', function() {
		var object = $('#conformationDetailTable').DataTable().data()[$(this).closest('tr').index()];
		var sendId = object.sendId;
		attachListTableCfg.localParam.urlparam.param1 = sendId;
		BdoDataTable('attachListTable', attachListTableCfg);
		$('#modal_attachList').modal('show');
	});
	/** 预览附件 */
	$('#attachListTable').off("click", 'button[name="previewFile"]');
	$('#attachListTable').on('click', 'button[name="previewFile"]', function() {
		var object = $('#attachListTable').DataTable().data()[$(this).closest('tr').index()];
		var fileUrl = object.fileUrl;
		var fileName = object.fileName;
		window.open(fileUrl.replace(':\\','://'), fileName, 'location=no');
	});
};

