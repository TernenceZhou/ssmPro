var adjustDetailTab = function(tabId, customerId, year, adjustType, subjectId, subjectType, sqlId, indexType) {
	// if($('#' + tabId + ' li a[href="#tab_adjustdetail"]').length != 0){
	// 	$('#' + tabId + ' a[href="#tab_adjustdetail"]').remove();
	// 	$('#tab_adjustdetail').remove();
	// }
	$('#' + tabId + ' li a[href="#tab_adjustdetail"]').css('display', 'block');
	$('#tab_adjustdetail').empty();
	// $('#' + tabId + '').append('<li><a href="#tab_adjustdetail">调整明细&nbsp;&nbsp;<i class="fa fa-times-circle-o"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_adjustdetail"></div>');

	var adjustDetail = '<div class="">'
		+ '<div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options">'
		+ '<li><button id="adjustDetail_export" type="button"><i class="si si-cloud-download" style="color: white;">&nbsp;导出</i></button></li>'
		+ '</ul><h3 class="block-title">调整明细</h3></div><div class="block-content">'
		+ '<table id="adjustDetail_tab" class="table table-bordered table-hover"></table>	'
		+ '</div></div></div>';

	$('#tab_adjustdetail').append(adjustDetail);
	$('#' + tabId + ' a[href="#tab_adjustdetail"]').click();
	//如果tb科目为TA03时  未分配利润  则应取所有影响到未分配利润的调整分录
	if (subjectId=='TA03'){
		sqlId = 'FA10084';
	}
	var adjust_view = DgAdjustPage({handleFlag: '1', data: {extraOptions: {}}}).tableModel;
	adjust_view.localParam.urlparam = {
		menuId: window.sys_menuId,
		sqlId: sqlId,
		param1: window.CUR_CUSTOMERID,
		param2: year,
		param3: adjustType,
		param4: subjectId,
		param5: window.CUR_PROJECTID,
		param6: year,
		param7: indexType ? indexType : ''
	};

	BdoDataTable('adjustDetail_tab', adjust_view);


	/** 导出 */
	$('#adjustDetail_export').click(function() {
		let exp_view = $.extend(true, {}, adjust_view);
		exp_view.localParam.urlparam.sqlId = 'FA10082';
		exportExcel(this, '调整明细', exp_view, 'adjustDetail_tab');
	});

	/*	// 修改
		$('#adjustDetail_tab').on('click', 'button[name="adEdit"]', function() {
			var object = $('#adjustDetail_tab').DataTable().data()[$(this).closest('tr').index()];
			$.ajax({
				url :'dgCenter/AuditAdjust.getVoucher.json',
				type : 'post',
				data : {
					param1 : object.customerId,
					param2 : object.subjectYear,
					param3 : object.voucherId,
					param4 : object.projectId
				},
				dataType : 'json',
				success : function(data){
					journalAdjust(object.customerId, object.subjectYear, object.voucherId, data.data, adjustType, function(){BdoDataTable('adjustDetail_tab', adjust_view);});
				}
			});

		});


		// 禁用/激活
		$('#adjustDetail_tab').on('click', 'button[name="adBan"]', function() {
			var object = $('#adjustDetail_tab').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('提示', '确认' + $(this).attr('title') + '分录【' + object.subjectId + '-' + object.subjectName + '】?此分录同一凭证下的所有分录都将' + $(this).attr('title'), function(){
				$.ajax({
					url : 'dgCenter/AuditAdjust.journalBolish.json',
					type : 'post',
					data : {
						param1 : object.customerId,
						param2 : object.subjectYear,
						param3 : object.voucherId,
						param4 : object.projectId
					},
					dataType : 'json',
					success : function(data){
						$('#adjustDetail_tab').DataTable().ajax.reload();
						if(data.success){
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});

			});
		});
		*/
};

//未审报表期初期末之间切换的bug修复
/*$('#tab_unAuditReport').on("click",function(){
	    	$(document).resize();
})*/