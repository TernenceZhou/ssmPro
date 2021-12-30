var samplingStatisticsTab = function(tabId, customerId, samplingId, statisticsType, agrs) {
	var statisticsId = 'tab_samplingStatistics' + statisticsType;
	if ($('#' + tabId + ' li a[href="#' + statisticsId + '"]').length != 0) {
		$('#' + tabId + ' a[href="#' + statisticsId + '"]').remove();
		$('#' + statisticsId + '').remove();
	}

	$('#' + tabId + '').append('<li><a href="#' + statisticsId + '">抽凭统计&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="' + statisticsId + '"></div>');

	$('#' + tabId + ' a[href="#' + statisticsId + '"]').find('.fa-times-circle').click(function() {
		$(this).parents('ul').find('li').first().find('a').click();
		$(this).parents('li').remove();
		$('#' + statisticsId + '').remove();
	});
	$('#' + statisticsId + '').empty();
	var samplingStatisticsContent = '<div class="content">'
		+ '<div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options">'
		//+ '<li><button id="voucherDetail_export" type="button"><i class="si si-cloud-download" style="color: white;" title="导出"></i></button></li>'
		+ '</ul><h3 class="block-title">统计 </h3> </div><div class="block-content">'
		+ '<table id="samplingStatistics_tab' + statisticsId + '" class="table table-bordered table-hover"></table>	'
		+ '<br></div></div></div>';
	$('#' + statisticsId + '').html(samplingStatisticsContent);
	//$('#oldvoucherId').html(oldVoucherId);
	$('#' + tabId + ' a[href="#' + statisticsId + '"]').click();
	//$(document).resize();
	/** table 属性 */
	var samplingStatistics_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/Sampling.querySamplingStatistics.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'FINCP100004',
				param1: samplingId,
				param2: statisticsType,
				param3: window.CUR_PROJECTID,
				lockYyyy: window.CUR_PROJECT_ACC_YEAR,
				lockProjectId: customerId,
				lockProjectId : window.CUR_PROJECTID
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			infoCallback: fnInfoCallback,
			rowReorder: {
				update: false
			},
			fixedThead: true,
			fixedHeight: '500px',
			columnDefs: [{
				targets: 1,
				className: 'text-left',
				title: '抽凭方式',
				name: 'sampleMethodName',
				data: 'sampleMethodName',
				width: '100px',
				render: function(data, type, row, meta) {
					if(statisticsType == '2'){
						var renderStr = '';
						//renderStr += '<button class="btn btn-xs btn-success" type="button" name="showSamplingCountResult" data-placement="top" title="抽凭结果" data-toggle="tooltip"><i class="fa fa-eye"></i></button>&nbsp;';
						renderStr += '<a href="#" name="showSamplingCountResult">' + data + '</a>';
						return renderStr;
					}else{
						return data;
					}
				}
			}, {
				targets: 2,
				className: 'text-center',
				title: '样本数量',
				name: 'voucherNum',
				data: 'voucherNum',
				width: '50px'
			}, {
				targets: 3,
				className: 'text-center',
				title: '样本数量占发生额总数量的比例',
				name: 'rate1',
				data: 'rate1',
				width: '50px'
			}, {
				targets: 4,
				className: 'text-right',
				title: '借方抽样金额',
				name: 'debitOcc',
				data: 'debitOcc',
				width: '50px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: 5,
				className: 'text-center',
				title: '借方抽样金额占借方总发生额比例',
				name: 'rate2',
				data: 'rate2',
				width: '50px'
			}, {
				targets: 6,
				className: 'text-right',
				title: '贷方抽样金额',
				name: 'creditOcc',
				data: 'creditOcc',
				width: '50px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: 7,
				className: 'text-center',
				title: '贷方抽样金额占贷方总发生额比例',
				name: 'rate3',
				data: 'rate3',
				width: '50px'
			}, {
				targets: 8,
				className: 'text-left',
				title: '抽凭名称',
				name: 'sampleName',
				data: 'sampleName',
				width: '50px'
			}
		]
		}
	};

	/** 导出 */
	/*$('#voucherDetail_export').click(function() {
		exportExcelFin(this, '凭证详细', voucher_view, 'voucherDetail_tab');
	});*/

	samplingStatisticsSearch();

	function samplingStatisticsSearch() {
		BdoDataTable('samplingStatistics_tab' + statisticsId, samplingStatistics_view);
	}
	/** 弹出抽样抽凭结果 */
	//$('#samplingStatistics_tab' + statisticsId).off("click", 'a[name="showSamplingCountResult"]');
	$('#samplingStatistics_tab' + statisticsId).on('click', 'a[name="showSamplingCountResult"]', function() {
		var object = $('#samplingStatistics_tab' + statisticsId).DataTable().data()[$(this).closest('tr').index()];
		var autoId = object.autoId;
		if(autoId != null && autoId != ''){
			SamplingResult({region: '#samplistResultPage', data: agrs.data, samplingId: autoId});
			$('#modal_samplistResult1').modal('show');
		}
	});
};

