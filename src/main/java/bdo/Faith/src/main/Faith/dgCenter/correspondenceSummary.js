/**
 * 函证汇总
 */
function CorrespondenceSummaryPage(context) {
	let $correspondenceTitle = $('#correspondenceTitle');
	let $correspondenceCount1 = $('#correspondenceCount1', $correspondenceTitle);
	let $correspondenceCount2 = $('#correspondenceCount2', $correspondenceTitle);
	let $correspondenceCount3 = $('#correspondenceCount3', $correspondenceTitle);
	let $correspondenceCount4 = $('#correspondenceCount4', $correspondenceTitle);
	let $correspondenceCount5 = $('#correspondenceCount5', $correspondenceTitle);
	let $correspondenceCount6 = $('#correspondenceCount6', $correspondenceTitle);
	let $correspondenceCount7 = $('#correspondenceCount7', $correspondenceTitle);
	let $correspondenceCount8 = $('#correspondenceCount8', $correspondenceTitle);
	let $correspondenceCount9 = $('#correspondenceCount9', $correspondenceTitle);
	let $correspondenceCount10 = $('#correspondenceCount10', $correspondenceTitle);
	let $correspondenceCount11 = $('#correspondenceCount11', $correspondenceTitle);
	let $correspondenceCount12 = $('#correspondenceCount12', $correspondenceTitle);
	let $correspondenceCount13 = $('#correspondenceCount13', $correspondenceTitle);
	let $correspondenceCount14 = $('#correspondenceCount14', $correspondenceTitle);
	let $correspondenceCount15 = $('#correspondenceCount15', $correspondenceTitle);
	let $context = context ? $('#correspondenceSummaryPage') : $;
	let $tabContent = $('#tab_correspondenceSummary_content', $context);
	let $correspondenceSummaryTable = $('#correspondenceSummaryTable');
	/** 模态框设置 */
	/*$('.modal').on('show.bs.modal', function(){
		$(this).draggable({
			handle: '.modal-title',
			cursor: 'move'
		});
		$(this).css('overflow', 'hidden');
	});*/

	/**
	 * 一览配置
	 */
	let tableColIndex = 1;
	const correspondenceSummaryTableCfg = {
		localParam: {
			url: 'dgCenter/DgCorrespondenceSummary.getConformationResult.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: '',
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				limit: -1,
				start: -1
			},
			tabNum: true
		},
		tableParam: {
			select: true,
			lengthChange: false,
			scrollX: true,
			scrollY: '480px',
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			// serverSide: true,
			fixedThead: true,
			scrollCollapse: true,
			createdRow(row, data, dataIndex) {
				if(data.beforeAuditAmount == null){
					data.beforeAuditAmount = 0;
				}
				if(data.adjustedAmount == null){
					data.adjustedAmount = 0;
				}
				if(data.afterAuditAmount == null){
					data.afterAuditAmount = 0;
				}
				if(data.auditedAmount == null){
					data.auditedAmount = 0;
				}
				if(data.beforeAuditAmount != data.adjustedAmount){
					$(row).find('td:eq(2)').css({"color":'red'});
					$(row).find('td:eq(4)').css({"color":'red'});
					$(row).find('td:eq(2)').find('span').css({"color":'red'});
					$(row).find('td:eq(4)').find('span').css({"color":'red'});
				}
				if(data.afterAuditAmount != data.auditedAmount){
					$(row).find('td:eq(3)').css({"color":'red'});
					$(row).find('td:eq(5)').css({"color":'red'});
					$(row).find('td:eq(3)').find('span').css({"color":'red'});
					$(row).find('td:eq(5)').find('span').css({"color":'red'});
				}
			},
			columnDefs: [
				{
					targets : tableColIndex ++,
					className : 'text-left',
					title : '函证查验科目',
					name : 'checkSubject',
					data : 'checkSubject',
					width : '100px'
				}, {
					targets : tableColIndex ++,
					className : 'text-right',
					title : 'PM审计前金额',
					name : 'beforeAuditAmount',
					data : 'beforeAuditAmount',
					width : '100px',
					render : function(data, type, row, meta) {
						if(data != null && data != ''){
							return formatMoney(data);
						}else{
							return '-';
						}
					}
				}, {
					targets : tableColIndex ++,
					className : 'text-right',
					title : 'PM审计后金额',
					name : 'afterAuditAmount',
					data : 'afterAuditAmount',
					width : '100px',
					render : function(data, type, row, meta) {
						if(data != null && data != ''){
							return formatMoney(data);
						}else{
							return '-';
						}
					}
				}, {
					targets : tableColIndex ++,
					className : 'text-right',
					title : 'SACP未审报表金额',
					name : 'adjustedAmount',
					data : 'adjustedAmount',
					width : '100px',
					render : function(data, type, row, meta) {
						if(data != null && data != ''){
							return formatMoney(data);
						}else{
							return '-';
						}
					}
				}, {
					targets : tableColIndex ++,
					className : 'text-right',
					title : 'SACP审定报表金额',
					name : 'auditedAmount',
					data : 'auditedAmount',
					width : '100px',
					render : function(data, type, row, meta) {
						if(data != null && data != ''){
							return formatMoney(data);
						}else{
							return '-';
						}
					}
				}, {
					targets : tableColIndex ++,
					className : 'text-right',
					title : '询证金额（原币）',
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
					title : '回函金额（原币）',
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
					title : '替代确认金额（原币）',
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
					title : '可确认金额（原币）',
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
					title : '差异金额（原币）',
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
					title : '审计前回函金额比例',
					name : 'beforeAmountReplyRate',
					data : 'beforeAmountReplyRate',
					width : '100px'
				}, {
					targets : tableColIndex ++,
					className : 'text-left',
					title : '审计后回函金额比例',
					name : 'afterAmountReplyRate',
					data : 'afterAmountReplyRate',
					width : '100px'
				}, {
					targets : tableColIndex ++,
					className : 'text-left',
					title : '回函数/发函数',
					name : 'countRate',
					data : 'countRate',
					width : '100px'
				}
			]
		}
	};
	
	let notmatchTableColIndex = 1;
	var notmatchConformationDetail_view = {
		localParam: {
			tabNum: true,
			url: 'dgCenter/DgCorrespondenceSummary.getProjectConformationDetail.json',
			urlparam: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				sqlId: '',
				param1: '',
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			scrollY: '300px',
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			rowReorder: {
				update: false
			},
			fixedThead: true,
			fixedHeight: '300px',
			columnDefs: [{
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '函证查验科目',
				name : 'checkSubject',
				data : 'checkSubject',
				width : '100px'
			}, {
				targets: notmatchTableColIndex ++,
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
				targets : notmatchTableColIndex ++,
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
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '发函编号',
				name : 'sendId',
				data : 'sendId',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '回函编号',
				name : 'replyId',
				data : 'replyId',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '收件单位',
				name : 'consigneeCompany',
				data : 'consigneeCompany',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '开户银行',
				name : 'bank',
				data : 'bank',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '银行账号',
				name : 'bankAccount',
				data : 'bankAccount',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-right',
				title : '询证金额',
				name : 'requestAmount',
				data : 'requestAmount',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-right',
				title : '询证金额（人民币）',
				name : 'requestAmountCny',
				data : 'requestAmountCny',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-right',
				title : '回函金额',
				name : 'replyAmount',
				data : 'replyAmount',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-right',
				title : '回函金额（人民币）',
				name : 'replyAmountCny',
				data : 'replyAmountCny',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-right',
				title : '替代确认金额',
				name : 'subRecognitionAmount',
				data : 'subRecognitionAmount',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-right',
				title : '替代确认金额（人民币）',
				name : 'subRecognitionAmountCny',
				data : 'subRecognitionAmountCny',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-right',
				title : '可确认金额',
				name : 'recognitionAmount',
				data : 'recognitionAmount',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-right',
				title : '可确认金额（人民币）',
				name : 'recognitionAmountCny',
				data : 'recognitionAmountCny',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-right',
				title : '差异金额',
				name : 'differenceAmount',
				data : 'differenceAmount',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-right',
				title : '差异金额（人民币）',
				name : 'differenceAmountCny',
				data : 'differenceAmountCny',
				width : '100px',
				render : function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '收件地址',
				name : 'consigneeAddress',
				data : 'consigneeAddress',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '收件人',
				name : 'consigneeName',
				data : 'consigneeName',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '联系电话',
				name : 'consigneePhone',
				data : 'consigneePhone',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '邮政编码',
				name : 'zipCode',
				data : 'zipCode',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '寄件方式',
				name : 'sendType',
				data : 'sendType',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '发函信件单号',
				name : 'expressNumber',
				data : 'expressNumber',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '函证类型',
				name : 'confirmationType',
				data : 'confirmationType',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '发函日期',
				name : 'sendDate',
				data : 'sendDate',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '回函日期',
				name : 'replyInfoDate',
				data : 'replyInfoDate',
				width : '100px'
			}, {
				targets : notmatchTableColIndex ++,
				className : 'text-left',
				title : '回函信件单号',
				name : 'replyExpressNumber',
				data : 'replyExpressNumber',
				width : '100px'
			}
		]}
	};
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
	/**
	 * 统计数据
	 */
	function countInfoInit() {
		$correspondenceCount1.text('');
		$correspondenceCount2.text('');
		$correspondenceCount3.text('');
		$correspondenceCount4.text('');
		$correspondenceCount5.text('');
		$correspondenceCount6.text('');
		$correspondenceCount7.text('');
		$correspondenceCount8.text('');
		$correspondenceCount9.text('');
		$correspondenceCount10.text('');
		$correspondenceCount11.text('');
		$correspondenceCount12.text('');
		$correspondenceCount13.text('');
		$correspondenceCount14.text('');
		$correspondenceCount15.text('');
		$.ajax({
			url: 'dgCenter/DgCorrespondenceSummary.getConformationCount.json',
			data: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			type: 'POST',
			dataType: 'json'
		}).done(function(data) {
			if (data.success && data.data && data.data.length > 0) {
				let dataList = data.data[0];
				$correspondenceCount1.text(dataList.countRate + '% ');
				$correspondenceCount2.text(dataList.sendCount + '/' + dataList.replyCount);
				$correspondenceCount12.text(dataList.centerSendCount);
				$correspondenceCount13.text(dataList.deptSendCount);
				$correspondenceCount4.text(dataList.centerSendRate + '% ');
				$correspondenceCount5.text(dataList.deptSendRate + '% ');
				$correspondenceCount14.text(dataList.sendToCenterCount);
				$correspondenceCount15.text(dataList.sendToAccountantCount);
				$correspondenceCount6.text(dataList.sendToCenterRate + '% ');
				$correspondenceCount7.text(dataList.sendToAccountantRate + '% ');
				$correspondenceCount8.text(dataList.moneyAccordanceRate + '% ');
				$correspondenceCount9.text(dataList.moneyInconformityRate + '% ');
				$correspondenceCount10.text(dataList.addressAccordanceRate + '% ');
				$correspondenceCount11.text(dataList.addressInconformityRate + '% ');
			}
		});
	}
	
	/** 搜索 */
	function getConformationResult() {
		BdoDataTable('correspondenceSummaryTable', correspondenceSummaryTableCfg);
		// 双击显示函证明细
		$correspondenceSummaryTable.find('tbody').on('dblclick', 'tr', function() {
			var object = $correspondenceSummaryTable.DataTable().data()[$(this).closest('tr').index()];
			conformationDetailTab('tab_correspondenceSummary', window.CUR_PROJECTID, object.checkSubject);
		});
	}
	/** 不符明细 */
	function getProjectConformationResult(dataType) {
		notmatchConformationDetail_view.localParam.urlparam.param1 = dataType;
		BdoDataTable('notmatchDetailTable', notmatchConformationDetail_view);
		$('#modal_notmatch_conformation_detail').modal('show');
	}
	/**
	 * 绑定事件
	 */
	function eventBind() {
		/** 搜索按钮 */
		$('#btn_search').click(function() {
			getConformationResult();
		});
		/** 金额不符 */
		$('#amountNotMatch').click(function() {
			$('#notmatchTitle').html('回函金额不符明细');
			getProjectConformationResult('1');
		});
		/** 地址不符 */
		$('#addressNotMatch').click(function() {
			$('#notmatchTitle').html('回函地址不符明细');
			getProjectConformationResult('2');
		});
		/** 弹出附件 */
		$('#notmatchDetailTable').off("click", 'button[name="showFile"]');
		$('#notmatchDetailTable').on('click', 'button[name="showFile"]', function() {
			var object = $('#notmatchDetailTable').DataTable().data()[$(this).closest('tr').index()];
			var sendId = object.sendId;
			attachListTableCfg.localParam.urlparam.param1 = sendId;
			BdoDataTable('attachListTable', attachListTableCfg);
			$('#modal_attachList').modal('show');
		});
		/*$('#correspondenceExportBtn').click(function(event) {
			downloadFile('dgCenter/ExportOtherDg.exportPostilExcel.json', {});
		});*/
	}

	/**
	 * 初始化页面
	 */
	function init() {
		getConformationResult();
		$('#toggleBtn').click();
		countInfoInit();
		eventBind();
		OneUI.initHelper('slimscroll');
	}

	return {
		init
	};
}

$(document).ready(function() {
	new CorrespondenceSummaryPage($('#correspondenceSummaryPage')).init();
});




