/**
 * 审核汇总
 */
function ReviewSummaryPage(context) {
	var $reviewSummaryTitle = $('#reviewSummaryTitle');
	var $reviewSummary1 = $('#reviewSummary1', $reviewSummaryTitle);
	var $reviewSummary2 = $('#reviewSummary2', $reviewSummaryTitle);

	// 项目信息
	var projectInfo;
	if(!(!window.CUR_PROJECTID || !window.CUR_CUSTOMERID || !(window.CUR_CUSTOMERID > '') || !(window.CUR_PROJECTID > ''))) {
		$.ajax({
			type : "post",
			url: 'dgCenter/DgGeneral.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00061',
				param1: window.CUR_PROJECTID,
				param2: window.CUR_CUSTOMERID,
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					projectInfo = data.data[0];
				}
			}
		});
	}
	

	// 底稿索引号
	var indexList = [];
	$.ajax({
		type : "post",
		url: 'dgCenter/DgGeneral.query.json',
		// async : false,
		data : {
			menuId: window.sys_menuId,
			sqlId: 'FA50088',
			start: -1,
			limit: -1
		},
		dataType : "json",
		success(data) {
			if(data.success) {
				indexList = data.data;
			}
		}
	});

	/**
	 * 统计数据
	 */
	function countInfoInit() {
		$.ajax({
			url: 'dgCenter/DgReviewSummary.countInfoInit.json',
			// async: false,
			type: 'post',
			dataType: 'json',
			data: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			success(data) {
				if (data.success) {
					var dataList = data.data[0];
					$reviewSummary1.text(dataList.reviewSummary1 + ' / ' + dataList.reviewSummaryTotal1);
					$reviewSummary2.text(dataList.approvalSummary1 + ' / ' + dataList.approvalSummaryTotal1);
				}
			}
		});
	}
	
	/** table 属性 */
	var externalReportApproval_view = {
		localParam: {
			tabNum: true,
			url: 'dgCenter/DgReviewSummary.queryReportApproval.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			}
		},
		tableParam: {
			select: true,
			dom: "<'row'<'col-sm-12'tr>>",
			scrollX: false,
			scrollY: false,
			scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			bdolxLoader: true,
			//order: [1, 'asc'],
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					className: 'text-center',
					title: '审批节点',
					name: 'auditNode',
					data: 'auditNode',
					width: '100px'
				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '审批人',
					name: 'auditUser',
					data: 'auditUser',
					width: '100px'
				}, {
					targets: 3,
					orderable: false,
					className: 'text-center',
					title: '审批状态',
					name: 'auditType',
					data: 'auditType',
					width: '100px'
				}, {
					targets: 4,
					orderable: false,
					className: 'text-center',
					title: '审批时间',
					name: 'auditDate',
					data: 'auditDate',
					width: '100px',
					render: function(data, type, row, meta) {
						if(data != null){
							return new Date(data).format('yyyy-MM-dd');
						}else{
							return data;
						}
					}
				}
			]
		}
	};
	
	/**
	 * 绑定事件
	 */
	function eventBind() {
		$(function() {
			// 底稿送审检查表
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00343',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data.length == 0){
							if(projectInfo.manager == '' || sys_userId != projectInfo.manager){
								bdoInfoBox('提示', '项目未同步底稿送审检查表，非项目负责人无法同步底稿送审检查表');
							}else{
								bdoConfirmBox('提示', '项目未同步底稿送审检查表，是否同步？', isConfirm => {
									bdoInProcessingBox('同步中');
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgReviewSummary.syncDgReviewCheck.json',
										data: {
											customerId: window.CUR_CUSTOMERID,
											projectId: window.CUR_PROJECTID,
											param1: window.CUR_CUSTOMERID,
											param2: window.CUR_PROJECTID
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												showDgReviewCheck();
											} else {
												bdoErrorBox('同步失败', data.resultInfo.statusText);
											}
										}
									});
								});
							}
						}else{
							showDgReviewCheck();
						}
					}
				}
			});
		});

		// 显示底稿送审检查表
		function showDgReviewCheck(){
			var colNum = 0;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00346',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#tab_dgReviewCheck .content').empty();
						var title = data.data[0];
						var th = '<th style="width: 30px;"></th>';
						for(var i = 1;i <= 20;i++){
							if(title['approvalItem' + i] != null && title['approvalItem' + i] != ''){
								if(title['approvalItemType' + i] == 0){
									if(title['approvalItemMust' + i] == 1){
										th += '<th class="text-center" style="width: 120px;">' + title['approvalItem' + i] + '&nbsp;&nbsp;<i class="fa fa-asterisk" style="color: red;"></i>' + '</th>';
									}else{
										th += '<th class="text-center" style="width: 120px;">' + title['approvalItem' + i] + '</th>';
									}
								}else if(title['approvalItemType' + i] == 1){
									if(title['approvalItemMust' + i] == 1){
										th += '<th class="text-center" style="width: 60px;">' + title['approvalItem' + i] + '&nbsp;&nbsp;<i class="fa fa-asterisk" style="color: red;"></i>' + '</th>';
									}else{
										th += '<th class="text-center" style="width: 60px;">' + title['approvalItem' + i] + '</th>';
									}
								}else if(title['approvalItemType' + i] == 2){
									if(title['approvalItemMust' + i] == 1){
										th += '<th class="text-center" style="width: 60px;">' + title['approvalItem' + i] + '&nbsp;&nbsp;<i class="fa fa-asterisk" style="color: red;"></i>' + '</th>';
									}else{
										th += '<th class="text-center" style="width: 60px;">' + title['approvalItem' + i] + '</th>';
									}
								}else if(title['approvalItemType' + i] == 3){
									if(title['approvalItemMust' + i] == 1){
										th += '<th class="text-center">' + title['approvalItem' + i] + '&nbsp;&nbsp;<i class="fa fa-asterisk" style="color: red;"></i>' + '</th>';
									}else{
										th += '<th class="text-center">' + title['approvalItem' + i] + '</th>';
									}
								}else if(title['approvalItemType' + i] == 4){
									if(title['approvalItemMust' + i] == 1){
										th += '<th class="text-center" style="width: 120px;">' + title['approvalItem' + i] + '&nbsp;&nbsp;<i class="fa fa-asterisk" style="color: red;"></i>' + '</th>';
									}else{
										th += '<th class="text-center" style="width: 120px;">' + title['approvalItem' + i] + '</th>';
									}
								}
								colNum = i;
							}
						}
						th += '<th class="text-center" style="width: 40px;">审核人</th>';
						th += '<th class="text-center" style="width: 80px;">审核意见</th>';
						th += '<th class="text-center" style="width: 60px;">审核时间</th>';
						th += '<th class="text-center" style="width: 80px;">处理</th>';
						$table = $('<table id="dgReviewCheck_table" class="table table-bordered table-striped table-hover" style="">'
							+		'<thead>'
							+			'<tr>'
							+				th
							+			'</tr>'
							+		'</thead>'
							+	'</table>');
						$('#tab_dgReviewCheck .content').append($table);
					}
				}
			});
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00348',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						for(var parentlist of data.data){
							var trStyle = '';
							if(parentlist.num == 0){
								trStyle = 'cursor: pointer;height: 30px;background-color: #46c37b;color: #fff;';
							}else{
								trStyle = 'cursor: pointer;height: 30px;';
							}
							$tbody = $('<tbody class="parent" data-type="tbody_' + parentlist.id + '">'
							+			'<tr style="' + trStyle + '">'
							+				'<td class="text-center"><i class="fa fa-angle-down" data-tyle="0"></i></td>'
							+				'<td class="text-left" colspan="' + (colNum + 4) + '">' + parentlist.title + '</td>'
							+			'</tr>'
							+		'</tbody>');
							$('#dgReviewCheck_table').append($tbody);
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00344',
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: parentlist.id,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										var tr = '';
										for(var list of data.data){
											var disabledText;
											if(list.isAudit == 0){
												disabledText = '';
											}else if(list.isAudit == 1){
												disabledText = 'disabled="true"';
											}
											var td = '<td style="width: 30px;"></td>';
											if(projectInfo.manager == '' || sys_userId != projectInfo.manager){
												bdoInfoBox('提示', '非项目负责人无法填写底稿送审检查表');
												for(var i = 1;i <= colNum;i++){
													var value = list['approvalItemValue' + i] != null ? list['approvalItemValue' + i] : '';
													// 文本
													if(list['approvalItemType' + i] == 0){
														td += '<td class="text-left" style="width: 120px;word-wrap:break-word; word-break:break-all;" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
													}
													// 下拉框
													else if(list['approvalItemType' + i] == 1){
														var options = list['approvalItemOptions' + i] != null ? list['approvalItemOptions' + i] : '';
														if(value == ''){
															td += '<td class="text-center" style="width: 60px;" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
														}else{
															td += '<td class="text-center" style="width: 60px;" data-must="' + list['approvalItemMust' + i] + '">' + options.split(',')[value] + '</td>';
														}
													}
													// 索引号
													else if(list['approvalItemType' + i] == 2){
														td += '<td class="text-center" style="width: 60px;" data-type="2" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
													}
													// 富文本
													else if(list['approvalItemType' + i] == 3){
														td += '<td colspan="' + colNum + '" class="text-left" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
													}
													// 固定文本
													else if(list['approvalItemType' + i] == 4){
														td += '<td class="text-left" style="width: 120px;word-wrap:break-word; word-break:break-all;" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
													}
												}
											}else{
												if(list['approvalItemType' + 1] == 3){
													// 富文本
													var textarea = list['approvalItemValue' + 1] != null ? list['approvalItemValue' + 1] : '';
													td += '<td colspan="' + colNum + '" data-col-id="1" data-must="' + list['approvalItemMust' + 1] + '">'
													+	'<textarea class="form-control" rows="3" style="width: 100%;" maxlength="200"' + disabledText + '>' + textarea + '</textarea>'
													+	'<div style="text-align:right;"><span>剩余可输入200字</span></div>'
													+'</td>';
												}else{
													for(var i = 1;i <= colNum;i++){
														var value = list['approvalItemValue' + i] != null ? list['approvalItemValue' + i] : '';
														if(list['approvalItemType' + i] == 0){
															// 文本
															td += '<td class="text-left" style="width: 120px;" data-col-id="' + i + '" data-must="' + list['approvalItemMust' + i] + '">'
															+	'<input class="form-control" type="text" style="width: 100%;" maxlength="100" value="' + value + '"' + disabledText + '>'
															+'</td>';
														}else if(list['approvalItemType' + i] == 1){
															// 下拉框
															var options = list['approvalItemOptions' + i] != null ? list['approvalItemOptions' + i] : '';
															var optionText = '<option value=""></option>';
															for(var j = 0;j < options.split(',').length;j++){
																if(value != '' && value == j){
																	optionText = optionText + '<option value="' + j + '" selected>' + options.split(',')[j] + '</option>';
																}else{
																	optionText = optionText + '<option value="' + j + '">' + options.split(',')[j] + '</option>';
																}
															}
															td += '<td class="text-left" style="width: 60px;" data-col-id="' + i + '" data-must="' + list['approvalItemMust' + i] + '">'
															+	'<select class="js-select2 form-control" style="width: 100%;"' + disabledText + '>'
															+		optionText
															+	'</select>'
															+'</td>';
															
														}else if(list['approvalItemType' + i] == 2){
															// 索引号
															td += '<td class="text-left" style="width: 60px;" item-type="2" data-col-id="' + i + '" data-must="' + list['approvalItemMust' + i] + '">'
															+	'<button class="btn btn-default" style="background-color: white;padding: 8px 0px 0px 0px;position:absolute;z-index:1;border: none;" type="button" name="gotoDeskTop" title="索引号跳转"><i class="fa fa-location-arrow"></i></button>'
															+	'<input class="form-control" type="text" style="width: 100%;" maxlength="30" value="' + value + '"' + disabledText + '>'
															+'</td>';
														}else if(list['approvalItemType' + i] == 4){
															// 固定文本
															td += '<td class="text-left" style="width: 120px;word-wrap:break-word; word-break:break-all;" data-col-id="' + i + '" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
														} 
													}
												}
											}
											var auditorText = '';
											var isShow = 'none';
											// 签字合伙人
											if(list.auditor == 'signUser'){
												if(projectInfo.signUser){
													if(sys_userId == projectInfo.signUser){
														isShow = 'block';
													}
													auditorText = projectInfo.__usignUserName;
												}else{
													auditorText = '签字合伙人审核';
												}
											}
											// 一审负责人
											else if(list.auditor == 'audit1'){
												if(projectInfo.audit1){
													if(sys_userId == projectInfo.audit1){
														isShow = 'block';
													}
													auditorText = projectInfo.__uaudit1Name;
												}else{
													auditorText = '一审负责人审核';
												}
											}
											// 二审负责人
											else if(list.auditor == 'audit2'){
												if(projectInfo.audit2){
													if(sys_userId == projectInfo.audit2){
														isShow = 'block';
													}
													auditorText = projectInfo.__uaudit2Name;
												}else{
													auditorText = '二审负责人审核';
												}
											}
											// 项目负责人
											else if(list.auditor == 'manager'){
												if(projectInfo.manager){
													if(sys_userId == projectInfo.manager){
														isShow = 'block';
													}
													auditorText = projectInfo.__umanagerName;
												}else{
													auditorText = '项目负责人审核';
												}
											}
											// 审核人
											td += '<td class="text-center" style="width: 40px;">' + auditorText + '</td>';
											// 审核意见
											var auditOpinion = list.auditOpinion != null ? list.auditOpinion : '';
											if(isShow == 'block'){
												td += '<td class="text-center" style="width: 80px;">'
													+	'<input class="form-control" type="text" style="width: 100%;" maxlength="100" value="' + auditOpinion + '"' + disabledText + '>'
													+'</td>';
											}else{
												td += '<td class="text-center" style="width: 80px;word-wrap:break-word; word-break:break-all;">' + auditOpinion + '</td>';
											}
											// 审核按钮
											if(list.isAudit == 0){
												// 审核时间
												td += '<td class="text-center" style="width: 60px;"></td>';
												td += '<td class="text-center" style="width: 80px;">'
												+	'<div class="btn-group">'
												+		'<span class="btn btn-xs bg-danger" style="color:#fff;cursor:default">'
												+			'<i class="si si-close" style="color:#fff"></i>待审核'
												+		'</span>'
												+		'&nbsp;&nbsp;'
												+		'<button class="btn btn-xs btn-success table-btn-operate" name="audit_submit" style="display:' + isShow + ';" type="button" title="审核">'
												+			'<i class="fa fa-check text-white"></i>'
												+		'</button>';
												+	'</div></td>';
											}else if(list.isAudit == 1){
												// 审核时间
												if(list.auditDate != null){
													td += '<td class="text-center" style="width: 60px;">' + list.auditDate + '</td>';
												}else{
													td += '<td class="text-center" style="width: 60px;"></td>';
												}
												td += '<td class="text-center" style="width: 80px;">'
												+	'<div class="btn-group">'
												+		'<span class="btn btn-xs bg-success" style="color:#fff;cursor:default">'
												+			'<i class="si si-check"></i>已审核'
												+		'</span>'
												+		'<button class="btn btn-xs btn-danger table-btn-operate" name="audit_cancel" style="display:' + isShow + ';" type="button" title="撤销审核">'
												+			'<i class="fa fa-close"></i>'
												+		'</button>';
												+	'</div></td>';
											}
											tr = tr + '<tr style="height: 30px;" data-autoid="' + list.autoId + '" data-row-id="' + list.id + '">' + td + '</tr>';
										}
										$tbody = $('<tbody class="child_tbody_' + list.parentId + '">'
										+			tr
										+		'</tbody>');
										$('#dgReviewCheck_table').append($tbody);
										bdoSuccessBox('成功', '加载完成');
									}
								}
							});
						}
					}
				}
			});
			$('#dgReviewCheck_table tbody.parent').click(function(){
				$(this).toggleClass('selected').siblings('.child_' + $(this).attr('data-type')).toggle();
				$i = $($(this).children().children()[0]).find('i');
				if($i.attr('data-tyle') == 0){
					$i.attr('data-tyle', 1);
					$i.removeClass('fa-angle-down');
					$i.addClass('fa-angle-right');
				}else if($i.attr('data-tyle') == 1){
					$i.attr('data-tyle', 0);
					$i.removeClass('fa-angle-right');
					$i.addClass('fa-angle-down');
				}
			}).click();
			$('#dgReviewCheck_table select').change(function() {
				var num = $(this).parents('td').attr('data-col-id');
				var parentId = $(this).parents('tbody').attr('class').replace('child_tbody_', '');
				var id = $(this).parents('tr').attr('data-row-id');
				var autoId = $(this).parents('tr').attr('data-autoid');
				var list = [];
				var row = {
					autoId: autoId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					parentId: parentId,
					id: id
				};
				row['approvalItemValue' + num] = $(this).val();
				list.push(row);
				editDgReviewCheck(list);
			});
			$('#dgReviewCheck_table td[item-type="2"] input').on('input', function() {
				$(this).nextAll().remove();
				var optionText = '';
				for(var index of indexList){
					if(index.indexId.indexOf($(this).val()) != -1){
						optionText = optionText + '<option value="' + index.indexId + '" title="' + index.indexId + '-' + index.nodeName + '">' + index.indexId + '</option>';
					}
				}
				$select = $('<select name="indexSelect" class="js-select2 form-control" style="position: initial;" size="3">'
				+				optionText
				+			'</select>');
				$select.insertAfter($(this));
				$('#dgReviewCheck_table select[name="indexSelect"]').change(function() {
					$(this).prev().val($(this).find('option:selected').val());
				});
			});
			$('#dgReviewCheck_table td[item-type="2"] input').on('focus', function() {
				$(this).nextAll().remove();
				var optionText = '';
				for(var index of indexList){
					if(index.indexId.indexOf($(this).val()) != -1){
						optionText = optionText + '<option value="' + index.indexId + '" title="' + index.indexId + '-' + index.nodeName + '">' + index.indexId + '</option>';
					}
				}
				$select = $('<select name="indexSelect" class="js-select2 form-control" style="position: initial;" size="3">'
				+				optionText
				+			'</select>');
				$select.insertAfter($(this));
				$('#dgReviewCheck_table select[name="indexSelect"]').change(function() {
					$(this).prev().val($(this).find('option:selected').val());
				});
			});
			$('#dgReviewCheck_table td[data-type="2"]').on('click', function() {
				if($(this).html() != ''){
					window.open('/Faith/bdologin.do?m=gotoDesktop&menuId=40000022&type=' + $(this).html());
				}
			});
			$('#dgReviewCheck_table td[item-type="2"] button[name="gotoDeskTop"]').on('click', function() {
				if($(this).next().val() != ''){
					window.open('/Faith/bdologin.do?m=gotoDesktop&menuId=40000022&type=' + $(this).next().val());
				}
			});
			$('#dgReviewCheck_table input').on('blur', function() {
				var _this = this;
				setTimeout(function(){
					$(_this).nextAll().remove();
					var num = $(_this).parents('td').attr('data-col-id');
					var parentId = $(_this).parents('tbody').attr('class').replace('child_tbody_', '');
					var id = $(_this).parents('tr').attr('data-row-id');
					var autoId = $(_this).parents('tr').attr('data-autoid');
					var list = [];
					var row = {
						autoId: autoId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						parentId: parentId,
						id: id
					};
					if (typeof(num) == "undefined"){
						row.auditOpinion = $(_this).val();
						list.push(row);
					}else{
						row['approvalItemValue' + num] = $(_this).val();
						list.push(row);
					}
					editDgReviewCheck(list);
				}, 100);
			});
			$('#dgReviewCheck_table textarea').on('blur', function() {
				var num = $(this).parents('td').attr('data-col-id');
				var parentId = $(this).parents('tbody').attr('class').replace('child_tbody_', '');
				var id = $(this).parents('tr').attr('data-row-id');
				var autoId = $(this).parents('tr').attr('data-autoid');
				var list = [];
				var row = {
					autoId: autoId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					parentId: parentId,
					id: id
				};
				row['approvalItemValue' + num] = $(this).val();
				list.push(row);
				editDgReviewCheck(list);
			});
			$('#dgReviewCheck_table textarea').on('input', function() {
				if($(this).val().length <= 200){
					$(this).next().children().html('剩余可输入' + (200 - $(this).val().length) + '字');
				}
			});
			$('#dgReviewCheck_table button[name=audit_cancel]').unbind('click');
			$('#dgReviewCheck_table button[name=audit_cancel]').on('click', function() {
				cancel(this);
			});
			$('#dgReviewCheck_table button[name=audit_submit]').unbind('click');
			$('#dgReviewCheck_table button[name=audit_submit]').on('click', function() {
				submit(this);
			});
		}

		// 审核按钮绑定事件
		function submit(_this){
			var isCanSubmit = true;
			var length = $(_this).parents('tr').find('td[data-must="1"]').length;
			for(var i = 0;i < length;i++){
				$td = $(_this).parents('tr').find('td[data-must="1"]')[i];
				if($($td).children().length > 0){
					if($($td).find('input').length > 0){
						$($td).find('input').css('border', '0px');
						if($($td).find('input').val().trim() == ''){
							$($td).find('input').css('border', '1px dashed red');
							isCanSubmit = false;
						}
					}
					if($($td).find('select').length > 0){
						$($td).find('select').css('border', '0px');
						if($($td).find('select').find('option:selected').val().trim() == ''){
							$($td).find('select').css('border', '1px dashed red');
							isCanSubmit = false;
						}
					}
					if($($td).find('textarea').length > 0){
						$($td).find('textarea').css('border', '0px');
						if($($td).find('textarea').val().trim() == ''){
							$($td).find('textarea').css('border', '1px dashed red');
							isCanSubmit = false;
						}
					}
				}else{
					if($($td).text().trim() == ''){
						isCanSubmit = false;
					}
				}
			}
			if(!isCanSubmit){
				bdoInfoBox('提示', '必须项为空，不能审核');
				return;
			}
			var parentId = $(_this).parents('tbody').attr('class').replace('child_tbody_', '');
			var id = $(_this).parents('tr').attr('data-row-id');
			var autoId = $(_this).parents('tr').attr('data-autoid');
			var $parentdiv = $(_this).parent();
			var $content = $('<span class="btn btn-xs bg-success" style="color:#fff;cursor:default">'
				+			'<i class="si si-check"></i>已审核'
				+		'</span>'
				+		'<button class="btn btn-xs btn-danger table-btn-operate" name="audit_cancel" type="button" title="撤销审核">'
				+			'<i class="fa fa-close"></i>'
				+		'</button>');
			auditDgReviewCheck(autoId, parentId, id, '1', $parentdiv, $content);
		}

		// 撤销审核按钮绑定事件
		function cancel(_this){
			var parentId = $(_this).parents('tbody').attr('class').replace('child_tbody_', '');
			var id = $(_this).parents('tr').attr('data-row-id');
			var autoId = $(_this).parents('tr').attr('data-autoid');
			var $parentdiv = $(_this).parent();
			var $content = $('<span class="btn btn-xs bg-danger" style="color:#fff;cursor:default">'
				+			'<i class="si si-close" style="color:#fff"></i>待审核'
				+		'</span>'
				+		'&nbsp;&nbsp;'
				+		'<button class="btn btn-xs btn-success table-btn-operate" name="audit_submit" type="button" title="审核">'
				+			'<i class="fa fa-check text-white"></i>'
				+		'</button>');
			auditDgReviewCheck(autoId, parentId, id, '0', $parentdiv, $content);
		}

		// 填写底稿送审检查表
		function editDgReviewCheck(list){
			$.ajax({
				url: 'dgCenter/DgReviewSummary.editDgReviewCheck.json',
				// async: false,
				type: 'post',
				dataType: 'json',
				bdolxLoader: false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: JSON.stringify(list),
					start: -1,
					limit: -1
				},
				success(data) {
					if (data.success) {
						OneUI.notifySuccess('保存成功！');
					} else {
						OneUI.notifyError(data.resultInfo.statusText);
						// bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}

		// 审核
		function auditDgReviewCheck(autoId, parentId, id, value, $parentdiv, $content){
			var list = [{
				autoId: autoId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				parentId: parentId,
				id: id,
				isAudit: value
			}];
			$.ajax({
				url: 'dgCenter/DgReviewSummary.auditDgReviewCheck.json',
				// async: false,
				type: 'post',
				dataType: 'json',
				bdolxLoader: false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: JSON.stringify(list),
					start: -1,
					limit: -1
				},
				success(data) {
					if (data.success) {
						if(value == 1){
							OneUI.notifySuccess('审核成功！');
							$parentdiv.parent().prev().html(data.data[0].date);
							$parentdiv.parent().prev().prev().children().attr('disabled', true);
							if(projectInfo.manager){
								if(sys_userId == projectInfo.manager){
									$($parentdiv.parent().prev().prev().prev().prevAll()).each(function(index,element){
										$(this).find('input').attr('disabled', true);
										$(this).find('select').attr('disabled', true)
										$(this).find('textarea').attr('disabled', true)
									});
								}
							}
							if(data.data[0].isAllAudit == 1){
								$parentdiv.parents('tbody').prev().children().css('background-color', '#46c37b');
								$parentdiv.parents('tbody').prev().children().css('color', '#fff');
							}else{
								$parentdiv.parents('tbody').prev().children().css('background-color', 'rgb(249, 249, 249)');
								$parentdiv.parents('tbody').prev().children().css('color', 'rgb(100, 100, 100)');
							}
						}else if(value == 0){
							OneUI.notifySuccess('撤销审核成功！');
							$parentdiv.parent().prev().html('');
							$parentdiv.parent().prev().prev().children().removeAttr('disabled');
							if(projectInfo.manager){
								if(sys_userId == projectInfo.manager){
									$($parentdiv.parent().prev().prev().prev().prevAll()).each(function(index,element){
										$(this).find('input').removeAttr('disabled');
										$(this).find('select').removeAttr('disabled');
										$(this).find('textarea').removeAttr('disabled');
									});
								}
							}
							$parentdiv.parents('tbody').prev().children().css('background-color', 'rgb(249, 249, 249)');
							$parentdiv.parents('tbody').prev().children().css('color', 'rgb(100, 100, 100)');
						}
						$parentdiv.empty();
						$parentdiv.append($content);
						countInfoInit();
						$('#dgReviewCheck_table button[name=audit_cancel]').unbind('click');
						$('#dgReviewCheck_table button[name=audit_cancel]').on('click', function() {
							cancel(this);
						});
						$('#dgReviewCheck_table button[name=audit_submit]').unbind('click');
						$('#dgReviewCheck_table button[name=audit_submit]').on('click', function() {
							submit(this);
						});
					} else {
						OneUI.notifyError(data.resultInfo.statusText);
					}
				}
			});
		}
		
		// 重置
		$('#btn_reset').on('click', function() {
			var href = $('#tab_reviewSummary').find('.active').children().attr('href').replace('#', '');
			switch(href) {
				case 'tab_dgReviewCheck':
					if(projectInfo.manager == '' || sys_userId != projectInfo.manager){
						bdoInfoBox('提示', '非项目负责人无法重置底稿送审检查表');
					}else{
						bdoConfirmBox('提示', '是否重置底稿送审检查表？', isConfirm => {
							bdoInProcessingBox('重置中');
							$.ajax({
								type: 'post', 
								url: 'dgCenter/DgReviewSummary.refreshDgReviewCheck.json',
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										showDgReviewCheck();
										countInfoInit();
									} else {
										bdoErrorBox('重置失败', data.resultInfo.statusText);
									}
								}
							});
						});
					}
					break;
				case 'tab_externalReportApproval':
					if(projectInfo.manager == '' || sys_userId != projectInfo.manager){
						bdoInfoBox('提示', '非项目负责人无法重置对外报告审批单');
					}else{
						bdoConfirmBox('提示', '是否重置对外报告审批单？', isConfirm => {
							bdoInProcessingBox('重置中');
							$.ajax({
								type: 'post', 
								url: 'dgCenter/DgReviewSummary.refreshDgReportApproval.json',
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										showDgReportApproval();
										countInfoInit();
									} else {
										bdoErrorBox('重置失败', data.resultInfo.statusText);
									}
								}
							});
						});
					}
					break;
				case 'tab_archivesFiledApproval':
					
					break;
				default:
					
			} 
		});
		$('#tab_reviewSummary a, .js-tabs a').on('show.bs.tab', function(evt) {
			window.xxrPageKey = $(evt.currentTarget).text();
			var href = evt.target.href;
			var index = href.lastIndexOf('#');
			var id = href.substring(index + 1);
			switch (id) {
				case 'tab_externalReportApproval':
					// 对外审批单
					/*BdoDataTable('externalReportApproval_table', externalReportApproval_view);
					if(typeof($("#externalReportApprovalFrameId").attr("src"))=="undefined"){
						$("#externalReportApprovalFrameId").attr("src", "/Faith/dgcenter.do?m=reportApproval");
					}*/
					$(function() {
						// 对外报告审批单
						if($('#tab_externalReportApproval .content').children().length === 0 ){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00355',
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										if(data.data.length == 0){
											if(projectInfo.manager == '' || sys_userId != projectInfo.manager){
												bdoInfoBox('提示', '项目未同步对外报告审批单，非项目负责人无法同步对外报告审批单');
											}else{
												bdoConfirmBox('提示', '项目未同步对外报告审批单，是否同步？', isConfirm => {
													bdoInProcessingBox('同步中');
													$.ajax({
														type: 'post',
														url: 'dgCenter/DgReviewSummary.syncDgReportApproval.json',
														data: {
															customerId: window.CUR_CUSTOMERID,
															projectId: window.CUR_PROJECTID,
															param1: window.CUR_CUSTOMERID,
															param2: window.CUR_PROJECTID
														},
														dataType: 'json',
														success(data) {
															if (data.success) {
																showDgReportApproval();
															} else {
																bdoErrorBox('同步失败', data.resultInfo.statusText);
															}
														}
													});
												});
											}
										}else{
											showDgReportApproval();
										}
									}
								}
							});
						}
					});
					break;
			}
		});
		// 显示对外报告审批单
		function showDgReportApproval(){
			var colNum = 0;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00358',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#tab_externalReportApproval .content').empty();
						var title = data.data[0];
						var th = '<th style="width: 30px;"></th>';
						for(var i = 1;i <= 20;i++){
							if(title['approvalItem' + i] != null && title['approvalItem' + i] != ''){
								if(title['approvalItemType' + i] == 0){
									if(title['approvalItemMust' + i] == 1){
										th += '<th class="text-center" style="width: 120px;">' + title['approvalItem' + i] + '&nbsp;&nbsp;<i class="fa fa-asterisk" style="color: red;"></i>' + '</th>';
									}else{
										th += '<th class="text-center" style="width: 120px;">' + title['approvalItem' + i] + '</th>';
									}
								}else if(title['approvalItemType' + i] == 1){
									if(title['approvalItemMust' + i] == 1){
										th += '<th class="text-center" style="width: 60px;">' + title['approvalItem' + i] + '&nbsp;&nbsp;<i class="fa fa-asterisk" style="color: red;"></i>' + '</th>';
									}else{
										th += '<th class="text-center" style="width: 60px;">' + title['approvalItem' + i] + '</th>';
									}
								}else if(title['approvalItemType' + i] == 2){
									if(title['approvalItemMust' + i] == 1){
										th += '<th class="text-center" style="width: 60px;">' + title['approvalItem' + i] + '&nbsp;&nbsp;<i class="fa fa-asterisk" style="color: red;"></i>' + '</th>';
									}else{
										th += '<th class="text-center" style="width: 60px;">' + title['approvalItem' + i] + '</th>';
									}
								}else if(title['approvalItemType' + i] == 3){
									if(title['approvalItemMust' + i] == 1){
										th += '<th class="text-center">' + title['approvalItem' + i] + '&nbsp;&nbsp;<i class="fa fa-asterisk" style="color: red;"></i>' + '</th>';
									}else{
										th += '<th class="text-center">' + title['approvalItem' + i] + '</th>';
									}
								}else if(title['approvalItemType' + i] == 4){
									if(title['approvalItemMust' + i] == 1){
										th += '<th class="text-center" style="width: 120px;">' + title['approvalItem' + i] + '&nbsp;&nbsp;<i class="fa fa-asterisk" style="color: red;"></i>' + '</th>';
									}else{
										th += '<th class="text-center" style="width: 120px;">' + title['approvalItem' + i] + '</th>';
									}
								}
								colNum = i;
							}
						}
						th += '<th class="text-center" style="width: 40px;">审核人</th>';
						th += '<th class="text-center" style="width: 80px;">审核意见</th>';
						th += '<th class="text-center" style="width: 60px;">审核时间</th>';
						th += '<th class="text-center" style="width: 80px;">处理</th>';
						$table = $('<table id="dgReportApproval_table" class="table table-bordered table-striped table-hover" style="">'
							+		'<thead>'
							+			'<tr>'
							+				th
							+			'</tr>'
							+		'</thead>'
							+	'</table>');
						$('#tab_externalReportApproval .content').append($table);
					}
				}
			});
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00359',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						for(var parentlist of data.data){
							var trStyle = '';
							if(parentlist.num == 0){
								trStyle = 'cursor: pointer;height: 30px;background-color: #46c37b;color: #fff;';
							}else{
								trStyle = 'cursor: pointer;height: 30px;';
							}
							$tbody = $('<tbody class="parent" data-type="tbody_' + parentlist.id + '">'
							+			'<tr style="' + trStyle + '">'
							+				'<td class="text-center"><i class="fa fa-angle-down" data-tyle="0"></i></td>'
							+				'<td class="text-left" colspan="' + (colNum + 4) + '">' + parentlist.title + '</td>'
							+			'</tr>'
							+		'</tbody>');
							$('#dgReportApproval_table').append($tbody);
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00356',
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: parentlist.id,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										var tr = '';
										for(var list of data.data){
											var disabledText;
											if(list.isAudit == 0){
												disabledText = '';
											}else if(list.isAudit == 1){
												disabledText = 'disabled="true"';
											}
											var td = '<td style="width: 30px;"></td>';
											if(projectInfo.manager == '' || sys_userId != projectInfo.manager){
												bdoInfoBox('提示', '非项目负责人无法填写对外报告审批单');
												for(var i = 1;i <= colNum;i++){
													var value = list['approvalItemValue' + i] != null ? list['approvalItemValue' + i] : '';
													// 文本
													if(list['approvalItemType' + i] == 0){
														td += '<td class="text-left" style="width: 120px;word-wrap:break-word; word-break:break-all;" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
													}
													// 下拉框
													else if(list['approvalItemType' + i] == 1){
														var options = list['approvalItemOptions' + i] != null ? list['approvalItemOptions' + i] : '';
														if(value == ''){
															td += '<td class="text-center" style="width: 60px;" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
														}else{
															td += '<td class="text-center" style="width: 60px;" data-must="' + list['approvalItemMust' + i] + '">' + options.split(',')[value] + '</td>';
														}
													}
													// 索引号
													else if(list['approvalItemType' + i] == 2){
														td += '<td class="text-center" style="width: 60px;" data-type="2" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
													}
													// 富文本
													else if(list['approvalItemType' + i] == 3){
														td += '<td colspan="' + colNum + '" class="text-left" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
													}
													// 固定文本
													else if(list['approvalItemType' + i] == 4){
														td += '<td class="text-left" style="width: 120px;word-wrap:break-word; word-break:break-all;" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
													}
												}
											}else{
												if(list['approvalItemType' + 1] == 3){
													// 富文本
													var textarea = list['approvalItemValue' + 1] != null ? list['approvalItemValue' + 1] : '';
													td += '<td colspan="' + colNum + '" data-col-id="1" data-must="' + list['approvalItemMust' + 1] + '">'
													+	'<textarea class="form-control" rows="3" style="width: 100%;" maxlength="200"' + disabledText + '>' + textarea + '</textarea>'
													+	'<div style="text-align:right;"><span>剩余可输入200字</span></div>'
													+'</td>';
												}else{
													for(var i = 1;i <= colNum;i++){
														var value = list['approvalItemValue' + i] != null ? list['approvalItemValue' + i] : '';
														if(list['approvalItemType' + i] == 0){
															// 文本
															td += '<td class="text-left" style="width: 120px;" data-col-id="' + i + '" data-must="' + list['approvalItemMust' + i] + '">'
															+	'<input class="form-control" type="text" style="width: 100%;" maxlength="100" value="' + value + '"' + disabledText + '>'
															+'</td>';
														}else if(list['approvalItemType' + i] == 1){
															// 下拉框
															var options = list['approvalItemOptions' + i] != null ? list['approvalItemOptions' + i] : '';
															var optionText = '<option value=""></option>';
															for(var j = 0;j < options.split(',').length;j++){
																if(value != '' && value == j){
																	optionText = optionText + '<option value="' + j + '" selected>' + options.split(',')[j] + '</option>';
																}else{
																	optionText = optionText + '<option value="' + j + '">' + options.split(',')[j] + '</option>';
																}
															}
															td += '<td class="text-left" style="width: 60px;" data-col-id="' + i + '" data-must="' + list['approvalItemMust' + i] + '">'
															+	'<select class="js-select2 form-control" style="width: 100%;"' + disabledText + '>'
															+		optionText
															+	'</select>'
															+'</td>';
															
														}else if(list['approvalItemType' + i] == 2){
															// 索引号
															td += '<td class="text-left" style="width: 60px;" item-type="2" data-col-id="' + i + '" data-must="' + list['approvalItemMust' + i] + '">'
															+	'<button class="btn btn-default" style="background-color: white;padding: 8px 0px 0px 0px;position:absolute;z-index:1;border: none;" type="button" name="gotoDeskTop" title="索引号跳转"><i class="fa fa-location-arrow"></i></button>'
															+	'<input class="form-control" type="text" style="width: 100%;" maxlength="30" value="' + value + '"' + disabledText + '>'
															+'</td>';
														}else if(list['approvalItemType' + i] == 4){
															// 固定文本
															td += '<td class="text-left" style="width: 120px;word-wrap:break-word; word-break:break-all;" data-col-id="' + i + '" data-must="' + list['approvalItemMust' + i] + '">' + value + '</td>';
														} 
													}
												}
											}
											var auditorText = '';
											var isShow = 'none';
											// 签字合伙人
											if(list.auditor == 'signUser'){
												if(projectInfo.signUser){
													if(sys_userId == projectInfo.signUser){
														isShow = 'block';
													}
													auditorText = projectInfo.__usignUserName;
												}else{
													auditorText = '签字合伙人审核';
												}
											}
											// 一审负责人
											else if(list.auditor == 'audit1'){
												if(projectInfo.audit1){
													if(sys_userId == projectInfo.audit1){
														isShow = 'block';
													}
													auditorText = projectInfo.__uaudit1Name;
												}else{
													auditorText = '一审负责人审核';
												}
											}
											// 二审负责人
											else if(list.auditor == 'audit2'){
												if(projectInfo.audit2){
													if(sys_userId == projectInfo.audit2){
														isShow = 'block';
													}
													auditorText = projectInfo.__uaudit2Name;
												}else{
													auditorText = '二审负责人审核';
												}
											}
											// 项目负责人
											else if(list.auditor == 'manager'){
												if(projectInfo.manager){
													if(sys_userId == projectInfo.manager){
														isShow = 'block';
													}
													auditorText = projectInfo.__umanagerName;
												}else{
													auditorText = '项目负责人审核';
												}
											}
											// 签字注册会计师2
											else if(list.auditor == 'signAccountant2'){
												if(projectInfo.signAccountant2){
													if(sys_userId == projectInfo.signAccountant2){
														isShow = 'block';
													}
													auditorText = projectInfo.__usignAccountant2Name;
												}else{
													auditorText = '签字注册会计师2审核';
												}
											}
											// 签字注册会计师3
											else if(list.auditor == 'signAccountant3'){
												if(projectInfo.signAccountant3){
													if(sys_userId == projectInfo.signAccountant3){
														isShow = 'block';
													}
													auditorText = projectInfo.__usignAccountant3Name;
												}else{
													auditorText = '签字注册会计师3审核';
												}
											}
											// 外派复核人
											else if(list.auditor == 'reaReviewer'){
												if(projectInfo.reaReviewer){
													if(sys_userId == projectInfo.reaReviewer){
														isShow = 'block';
													}
													auditorText = projectInfo.__ureaReviewerName;
												}else{
													auditorText = '外派复核人审核';
												}
											}
											// 复核合伙人
											else if(list.auditor == 'reviewPartner'){
												if(projectInfo.reviewPartner){
													if(sys_userId == projectInfo.reviewPartner){
														isShow = 'block';
													}
													auditorText = projectInfo.__ureviewPartnerName;
												}else{
													auditorText = '复核合伙人审核';
												}
											}
											// 审核人
											td += '<td class="text-center" style="width: 40px;">' + auditorText + '</td>';
											// 审核意见
											var auditOpinion = list.auditOpinion != null ? list.auditOpinion : '';
											if(isShow == 'block'){
												td += '<td class="text-center" style="width: 80px;">'
													+	'<input class="form-control" type="text" style="width: 100%;" maxlength="100" value="' + auditOpinion + '"' + disabledText + '>'
													+'</td>';
											}else{
												td += '<td class="text-center" style="width: 80px;word-wrap:break-word; word-break:break-all;">' + auditOpinion + '</td>';
											}
											// 审核按钮
											if(list.isAudit == 0){
												// 审核时间
												td += '<td class="text-center" style="width: 60px;"></td>';
												td += '<td class="text-center" style="width: 80px;">'
												+	'<div class="btn-group">'
												+		'<span class="btn btn-xs bg-danger" style="color:#fff;cursor:default">'
												+			'<i class="si si-close" style="color:#fff"></i>待审核'
												+		'</span>'
												+		'&nbsp;&nbsp;'
												+		'<button class="btn btn-xs btn-success table-btn-operate" name="audit_submit" style="display:' + isShow + ';" type="button" title="审核">'
												+			'<i class="fa fa-check text-white"></i>'
												+		'</button>';
												+	'</div></td>';
											}else if(list.isAudit == 1){
												// 审核时间
												if(list.auditDate != null){
													td += '<td class="text-center" style="width: 60px;">' + list.auditDate + '</td>';
												}else{
													td += '<td class="text-center" style="width: 60px;"></td>';
												}
												td += '<td class="text-center" style="width: 80px;">'
												+	'<div class="btn-group">'
												+		'<span class="btn btn-xs bg-success" style="color:#fff;cursor:default">'
												+			'<i class="si si-check"></i>已审核'
												+		'</span>'
												+		'<button class="btn btn-xs btn-danger table-btn-operate" name="audit_cancel" style="display:' + isShow + ';" type="button" title="撤销审核">'
												+			'<i class="fa fa-close"></i>'
												+		'</button>';
												+	'</div></td>';
											}
											tr = tr + '<tr style="height: 30px;" data-autoid="' + list.autoId + '" data-row-id="' + list.id + '">' + td + '</tr>';
										}
										$tbody = $('<tbody class="child_tbody_' + list.parentId + '">'
										+			tr
										+		'</tbody>');
										$('#dgReportApproval_table').append($tbody);
										bdoSuccessBox('成功', '加载完成');
									}
								}
							});
						}
					}
				}
			});
			$('#dgReportApproval_table tbody.parent').click(function(){
				$(this).toggleClass('selected').siblings('.child_' + $(this).attr('data-type')).toggle();
				$i = $($(this).children().children()[0]).find('i');
				if($i.attr('data-tyle') == 0){
					$i.attr('data-tyle', 1);
					$i.removeClass('fa-angle-down');
					$i.addClass('fa-angle-right');
				}else if($i.attr('data-tyle') == 1){
					$i.attr('data-tyle', 0);
					$i.removeClass('fa-angle-right');
					$i.addClass('fa-angle-down');
				}
			}).click();
			$('#dgReportApproval_table select').change(function() {
				var num = $(this).parents('td').attr('data-col-id');
				var parentId = $(this).parents('tbody').attr('class').replace('child_tbody_', '');
				var id = $(this).parents('tr').attr('data-row-id');
				var autoId = $(this).parents('tr').attr('data-autoid');
				var list = [];
				var row = {
					autoId: autoId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					parentId: parentId,
					id: id
				};
				row['approvalItemValue' + num] = $(this).val();
				list.push(row);
				editDgReportApproval(list);
			});
			$('#dgReportApproval_table td[item-type="2"] input').on('input', function() {
				$(this).nextAll().remove();
				var optionText = '';
				for(var index of indexList){
					if(index.indexId.indexOf($(this).val()) != -1){
						optionText = optionText + '<option value="' + index.indexId + '" title="' + index.indexId + '-' + index.nodeName + '">' + index.indexId + '</option>';
					}
				}
				$select = $('<select name="indexSelect" class="js-select2 form-control" style="position: initial;" size="3">'
				+				optionText
				+			'</select>');
				$select.insertAfter($(this));
				$('#dgReportApproval_table select[name="indexSelect"]').change(function() {
					$(this).prev().val($(this).find('option:selected').val());
				});
			});
			$('#dgReportApproval_table td[item-type="2"] input').on('focus', function() {
				$(this).nextAll().remove();
				var optionText = '';
				for(var index of indexList){
					if(index.indexId.indexOf($(this).val()) != -1){
						optionText = optionText + '<option value="' + index.indexId + '" title="' + index.indexId + '-' + index.nodeName + '">' + index.indexId + '</option>';
					}
				}
				$select = $('<select name="indexSelect" class="js-select2 form-control" style="position: initial;" size="3">'
				+				optionText
				+			'</select>');
				$select.insertAfter($(this));
				$('#dgReportApproval_table select[name="indexSelect"]').change(function() {
					$(this).prev().val($(this).find('option:selected').val());
				});
			});
			/*$('#dgReportApproval_table td[data-type="2"]').on('click', function() {
				if($(this).html() != ''){
					window.open('/Faith/bdologin.do?m=gotoDesktop&menuId=40000022&type=' + $(this).html());
				}
			});
			$('#dgReportApproval_table td[item-type="2"] button[name="gotoDeskTop"]').on('click', function() {
				if($(this).next().val() != ''){
					window.open('/Faith/bdologin.do?m=gotoDesktop&menuId=40000022&type=' + $(this).next().val());
				}
			});*/
			$('#dgReportApproval_table input').on('blur', function() {
				var _this = this;
				setTimeout(function(){
					$(_this).nextAll().remove();
					var num = $(_this).parents('td').attr('data-col-id');
					var parentId = $(_this).parents('tbody').attr('class').replace('child_tbody_', '');
					var id = $(_this).parents('tr').attr('data-row-id');
					var autoId = $(_this).parents('tr').attr('data-autoid');
					var list = [];
					var row = {
						autoId: autoId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						parentId: parentId,
						id: id
					};
					if (typeof(num) == "undefined"){
						row.auditOpinion = $(_this).val();
						list.push(row);
					}else{
						row['approvalItemValue' + num] = $(_this).val();
						list.push(row);
					}
					editDgReportApproval(list);
				}, 100);
			});
			$('#dgReportApproval_table textarea').on('blur', function() {
				var num = $(this).parents('td').attr('data-col-id');
				var parentId = $(this).parents('tbody').attr('class').replace('child_tbody_', '');
				var id = $(this).parents('tr').attr('data-row-id');
				var autoId = $(this).parents('tr').attr('data-autoid');
				var list = [];
				var row = {
					autoId: autoId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					parentId: parentId,
					id: id
				};
				row['approvalItemValue' + num] = $(this).val();
				list.push(row);
				editDgReportApproval(list);
			});
			$('#dgReportApproval_table textarea').on('input', function() {
				if($(this).val().length <= 200){
					$(this).next().children().html('剩余可输入' + (200 - $(this).val().length) + '字');
				}
			});
			$('#dgReportApproval_table button[name=audit_cancel]').unbind('click');
			$('#dgReportApproval_table button[name=audit_cancel]').on('click', function() {
				cancel_report_approval(this);
			});
			$('#dgReportApproval_table button[name=audit_submit]').unbind('click');
			$('#dgReportApproval_table button[name=audit_submit]').on('click', function() {
				submit_report_approval(this);
			});
		}
		// 审核按钮绑定事件
		function submit_report_approval(_this){
			var isCanSubmit = true;
			var length = $(_this).parents('tr').find('td[data-must="1"]').length;
			for(var i = 0;i < length;i++){
				$td = $(_this).parents('tr').find('td[data-must="1"]')[i];
				if($($td).children().length > 0){
					if($($td).find('input').length > 0){
						$($td).find('input').css('border', '0px');
						if($($td).find('input').val().trim() == ''){
							$($td).find('input').css('border', '1px dashed red');
							isCanSubmit = false;
						}
					}
					if($($td).find('select').length > 0){
						$($td).find('select').css('border', '0px');
						if($($td).find('select').find('option:selected').val().trim() == ''){
							$($td).find('select').css('border', '1px dashed red');
							isCanSubmit = false;
						}
					}
					if($($td).find('textarea').length > 0){
						$($td).find('textarea').css('border', '0px');
						if($($td).find('textarea').val().trim() == ''){
							$($td).find('textarea').css('border', '1px dashed red');
							isCanSubmit = false;
						}
					}
				}else{
					if($($td).text().trim() == ''){
						isCanSubmit = false;
					}
				}
			}
			if(!isCanSubmit){
				bdoInfoBox('提示', '必须项为空，不能审核');
				return;
			}
			var parentId = $(_this).parents('tbody').attr('class').replace('child_tbody_', '');
			var id = $(_this).parents('tr').attr('data-row-id');
			var autoId = $(_this).parents('tr').attr('data-autoid');
			var $parentdiv = $(_this).parent();
			var $content = $('<span class="btn btn-xs bg-success" style="color:#fff;cursor:default">'
				+			'<i class="si si-check"></i>已审核'
				+		'</span>'
				+		'<button class="btn btn-xs btn-danger table-btn-operate" name="audit_cancel" type="button" title="撤销审核">'
				+			'<i class="fa fa-close"></i>'
				+		'</button>');
			auditDgReportApproval(autoId, parentId, id, '1', $parentdiv, $content);
		}

		// 撤销审核按钮绑定事件
		function cancel_report_approval(_this){
			var parentId = $(_this).parents('tbody').attr('class').replace('child_tbody_', '');
			var id = $(_this).parents('tr').attr('data-row-id');
			var autoId = $(_this).parents('tr').attr('data-autoid');
			var $parentdiv = $(_this).parent();
			var $content = $('<span class="btn btn-xs bg-danger" style="color:#fff;cursor:default">'
				+			'<i class="si si-close" style="color:#fff"></i>待审核'
				+		'</span>'
				+		'&nbsp;&nbsp;'
				+		'<button class="btn btn-xs btn-success table-btn-operate" name="audit_submit" type="button" title="审核">'
				+			'<i class="fa fa-check text-white"></i>'
				+		'</button>');
			auditDgReportApproval(autoId, parentId, id, '0', $parentdiv, $content);
		}

		// 填写对外报告审批单
		function editDgReportApproval(list){
			$.ajax({
				url: 'dgCenter/DgReviewSummary.editDgReportApproval.json',
				// async: false,
				type: 'post',
				dataType: 'json',
				bdolxLoader: false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: JSON.stringify(list),
					start: -1,
					limit: -1
				},
				success(data) {
					if (data.success) {
						OneUI.notifySuccess('保存成功！');
					} else {
						OneUI.notifyError(data.resultInfo.statusText);
						// bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}

		// 审核
		function auditDgReportApproval(autoId, parentId, id, value, $parentdiv, $content){
			var list = [{
				autoId: autoId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				parentId: parentId,
				id: id,
				isAudit: value
			}];
			$.ajax({
				url: 'dgCenter/DgReviewSummary.auditDgReportApproval.json',
				// async: false,
				type: 'post',
				dataType: 'json',
				bdolxLoader: false,
				data: {
					menuId: window.sys_menuId,
					param1: JSON.stringify(list),
					start: -1,
					limit: -1
				},
				success(data) {
					if (data.success) {
						if(value == 1){
							OneUI.notifySuccess('审核成功！');
							$parentdiv.parent().prev().html(data.data[0].date);
							$parentdiv.parent().prev().prev().children().attr('disabled', true);
							if(projectInfo.manager){
								if(sys_userId == projectInfo.manager){
									$($parentdiv.parent().prev().prev().prev().prevAll()).each(function(index,element){
										$(this).find('input').attr('disabled', true);
										$(this).find('select').attr('disabled', true)
										$(this).find('textarea').attr('disabled', true)
									});
								}
							}
							if(data.data[0].isAllAudit == 1){
								$parentdiv.parents('tbody').prev().children().css('background-color', '#46c37b');
								$parentdiv.parents('tbody').prev().children().css('color', '#fff');
							}else{
								$parentdiv.parents('tbody').prev().children().css('background-color', 'rgb(249, 249, 249)');
								$parentdiv.parents('tbody').prev().children().css('color', 'rgb(100, 100, 100)');
							}
						}else if(value == 0){
							OneUI.notifySuccess('撤销审核成功！');
							$parentdiv.parent().prev().html('');
							$parentdiv.parent().prev().prev().children().removeAttr('disabled');
							if(projectInfo.manager){
								if(sys_userId == projectInfo.manager){
									$($parentdiv.parent().prev().prev().prev().prevAll()).each(function(index,element){
										$(this).find('input').removeAttr('disabled');
										$(this).find('select').removeAttr('disabled');
										$(this).find('textarea').removeAttr('disabled');
									});
								}
							}
							$parentdiv.parents('tbody').prev().children().css('background-color', 'rgb(249, 249, 249)');
							$parentdiv.parents('tbody').prev().children().css('color', 'rgb(100, 100, 100)');
						}
						$parentdiv.empty();
						$parentdiv.append($content);
						countInfoInit();
						$('#dgReportApproval_table button[name=audit_cancel]').unbind('click');
						$('#dgReportApproval_table button[name=audit_cancel]').on('click', function() {
							cancel_report_approval(this);
						});
						$('#dgReportApproval_table button[name=audit_submit]').unbind('click');
						$('#dgReportApproval_table button[name=audit_submit]').on('click', function() {
							submit_report_approval(this);
						});
					} else {
						OneUI.notifyError(data.resultInfo.statusText);
					}
				}
			});
		}
	}

	/**
	 * 初始化页面
	 */
	function init() {
		countInfoInit();
		eventBind();
		OneUI.initHelper('slimscroll');
	}

	return {
		init
	};
}

$(function() {
	new ReviewSummaryPage($('#reviewSummaryPage')).init();
});
