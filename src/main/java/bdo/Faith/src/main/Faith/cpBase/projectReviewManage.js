(function(){
	var initTab1Table = function() {
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
		$('#search_condition_activeflg').val('1');
		var review_template_table = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'FA50085',
						param4: 1,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				searching: true,
				scrollX: true,
				scrollY: '240px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '460px',
				columnDefs: [{
					targets: 1,
					title: '处理',
					className: 'text-center',
					name: 'operate',
					width: '90px',
					render: function(data, type, row, meta) {
						var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
						if(row.ACTIVE_FLAG == 1){
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="btn_template_edit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="btn_dg_review_check" data-placement="top" title="模板配置" data-toggle="tooltip"><i class="fa fa-life-ring"></i></button>&nbsp;';
							/*renderStr += '<button class="btn btn-xs btn-success" type="button" name="btn_external_report_approval" data-placement="top" title="对外报告审批单" data-toggle="tooltip" disabled><i class="fa fa-object-group"></i></button>&nbsp;';
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="btn_archives_filed_approval" data-placement="top" title="档案归档审批单" data-toggle="tooltip" disabled><i class="fa fa-archive"></i></button>&nbsp;';*/
							renderStr += '<button class="btn btn-xs btn-danger" type="button" name="btn_template_delete" data-placement="top" title="作废" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
						}else{
							renderStr += '<button class="btn btn-xs btn-danger" type="button" name="btn_template_effec" data-placement="top" title="生效" data-toggle="tooltip"><i class="fa fa-plus"></i></button>&nbsp;';
						}
						return renderStr;
					}
				}, {
					targets: 2,
					title: '模板名称',
					name: 'reviewName',
					data: 'reviewName',
					width: '350px'
				}, {
					targets: 3,
					title: '年份',
					className: 'text-center',
					name: 'yyyy',
					data: 'yyyy',
					width: '60px'
				}, {
					targets: 4,
					title: '模板类型',
					name: 'templateTypeName',
					data: 'templateTypeName',
					width: '120px'
				}, {
					targets : 5,
					className : 'text-center',
					title : '最后更新时间',
					name : 'LAST_UPDATE_DATE',
					data : 'LAST_UPDATE_DATE',
					width : '80px'
				}, {
					targets : 6,
					className : 'text-center',
					title : '最后更新者',
					name : 'LAST_UPDATED_BYName',
					data : 'LAST_UPDATED_BYName',
					width : '100px'
				}
				]
			}
		};
		BdoDataTable('review_template_table', review_template_table);
		
		$('#search_condition_templateType').html(ComboLocalDicOption(true, '标准审核模板类型'));
		$('#add_templateType').html(ComboLocalDicOption(true, '标准审核模板类型'));
		$('#edit_temp_templateType').html(ComboLocalDicOption(true, '标准审核模板类型'));
		$('#edit_temp_yyyy').html(ComboLocalDicOption(true, 'auditplatformyear'));
		$('#add_temp_yyyy').html(ComboLocalDicOption(true, 'auditplatformyear'));
		$('#search_condition_yyyy').html(ComboLocalDicOption(true, 'auditplatformyear'));

		// 查询
		$('#review_template_search').on('click', function() {
			review_template_table.localParam.urlparam.param2 = $('#search_condition_name').val();
			review_template_table.localParam.urlparam.param3 = $('#search_condition_yyyy').val();
			review_template_table.localParam.urlparam.param4 = $('#search_condition_activeflg option:selected').val();
			review_template_table.localParam.urlparam.param5 = $('#search_condition_templateType').val();
			$('#review_template_table').DataTable().ajax.reload();
		});

		// 作废
		$('#review_template_table').on('click', 'button[name="btn_template_delete"]', function() {
			var object = $('#review_template_table').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('提示', '确认作废审核模板"' + object.reviewName + '"吗?', function(){
				$.ajax({
					url : 'cpBase/ReviewsManage.deleteReviewTemplate.json',
					type : 'post',
					data : {
						param1 : object.autoId
					},
					dataType : 'json',
					success : function(data){
						if(data.success){
							$('#review_template_table').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});

		// 生效
		$('#review_template_table').on('click', 'button[name="btn_template_effec"]', function() {
			var object = $('#review_template_table').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('提示', '确认生效审核模板"' + object.reviewName + '"吗?', function(){
				$.ajax({
					url : 'cpBase/ReviewsManage.effecReviewTemplate.json',
					type : 'post',
					data : {
						param1 : object.autoId,
						param2 : object.templateType
					},
					dataType : 'json',
					success : function(data){
						if(data.success){
							$('#review_template_table').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});

		// 修改弹出框
		$('#review_template_table').on('click', 'button[name="btn_template_edit"]', function() {
			var object = $('#review_template_table').DataTable().data()[$(this).closest('tr').index()];
			$('#modal_tempform_edit').modal('show');
			$('#input_edit_temp_tr_num').val($(this).closest('tr').index());
			$('#edit_temp_name').val(object.reviewName);
			$('#edit_temp_yyyy').val(object.yyyy);
			$('#edit_temp_templateType').val(object.templateType);
		});

		// 修改
		$('#btn_edit_save').on('click', function() {
			var object = $('#review_template_table').DataTable().data()[$('#input_edit_temp_tr_num').val()];
			var name = $('#edit_temp_name').val();
			var yyyy = $('#edit_temp_yyyy').val();
			var templateType = $('#edit_temp_templateType').val();
			if(name == '' || yyyy == ''){
				bdoInfoBox('提示', '模板名称及模板年份不能为空');
				return;
			}
			if(name == object.reviewName && yyyy == object.yyyy){
				bdoInfoBox('提示', '模板未做修改');
				return;
			}
			bdoConfirmBox('提示', '确认修改审核模板"' + object.reviewName + '"吗?', function(){
				$.ajax({
					url : 'cpBase/ReviewsManage.editReviewTemplate.json',
					type : 'post',
					data : {
						param1 : object.autoId,
						param2 : object.reviewName,
						param3 : object.yyyy,
						param4 : name,
						param5 : yyyy,
						param6 : templateType
					},
					dataType : 'json',
					success : function(data){
						if(data.success){
							$('#modal_tempform_edit').modal('hide');
							$('#review_template_table').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});

		var reviewTemplateList = [];

		// 新增弹出框
		$('#review_template_add').on('click', function() {
			$('#add_temp_name').val('');
			$('#add_temp_yyyy').val(CUR_PROJECT_ACC_YEAR);
			$('input_add_temp_init').val('');
			$('select_add_temp_init').val('');
			$.ajax({
				type : "post",
				url: 'cpBase/General.query.json',
				// async : false,
				data : {
					menuId: window.sys_menuId,
					sqlId: 'FA50085',
					start: -1,
					limit: -1
				},
				dataType : "json",
				success(data) {
					if(data.success) {
						reviewTemplateList = data.data;
						$('#modal_tempform_add').modal('show');
					}
				}
			});
		});

		// 新增
		$('#btn_add_save').on('click', function() {
			var name = $('#add_temp_name').val();
			var yyyy = $('#add_temp_yyyy').val();
			var templateType = $('#add_templateType').val();
			if(name == '' || yyyy == ''){
				bdoInfoBox('提示', '模板名称及模板年份不能为空');
				return;
			}
			if(templateType == ''){
				bdoInfoBox('提示', '模板类型不能为空');
				return;
			}
			var initTemplateCheck = 0;
			var flage = $('#initTemplateCheck').is(":checked");
			if(flage){
				initTemplateCheck = 1;
				if($('#select_add_temp_init option:selected').val() == undefined || $('#select_add_temp_init option:selected').val() == ''){
					bdoInfoBox('提示', '初始化模板选择不能为空');
					return;
				}
			}
			bdoConfirmBox('提示', '确认新增模板"' + name + '"吗?', function(){
				$.ajax({
					url : 'cpBase/ReviewsManage.addReviewTemplate.json',
					type : 'post',
					data : {
						param1 : name,
						param2 : yyyy,
						param3 : initTemplateCheck,
						param4 : $('#select_add_temp_init option:selected').val(),
						param5 : templateType,
					},
					dataType : 'json',
					success : function(data){
						if(data.success){
							$('#modal_tempform_add').modal('hide');
							$('#review_template_table').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});

		$(document).bind('click', function(e) {
			var e = e || window.event; // 浏览器兼容性
			var elem = e.target || e.srcElement;
			while (elem) { // 循环判断至跟节点，防止点击的是div子元素
				if (elem.id && (elem.id == 'input_add_temp_init' || elem.id == 'select_add_temp_init')) {
					return;
				}
				elem = elem.parentNode;
			}
			$('#select_add_temp_init').css('display', 'none'); // 点击的不是div或其子元素
		});
		$('#input_add_temp_init').on('focus',function(){
			$('#select_add_temp_init').css('display', 'block');
			$("#select_add_temp_init").empty();
			for(var list of reviewTemplateList){
				if(list.reviewName.indexOf(this.value) != -1){
					$("#select_add_temp_init").append("<option value='" + list.autoId + "' title='" + list.reviewName + "'>" + list.reviewName + "</option>");
				}
			}
		});
		$('#input_add_temp_init').on('input',function(){
			$('#select_add_temp_init').css('display', 'block');
			$("#select_add_temp_init").empty();
			for(var list of reviewTemplateList){
				if(list.reviewName.indexOf(this.value) != -1){
					$("#select_add_temp_init").append("<option value='" + list.autoId + "' title='" + list.reviewName + "'>" + list.reviewName + "</option>");
				}
			}
		});
		$('#select_add_temp_init').change(function () {
			$('#input_add_temp_init').val($('#select_add_temp_init option:selected').text());
			$('#select_add_temp_init').css('display', 'none');
		});

		// 底稿送审检查表--审批项
		$('#review_template_table').on('click', 'button[name="btn_dg_review_check"]', function() {
			bdoInProcessingBox('加载中');
			var object = $('#review_template_table').DataTable().data()[$(this).closest('tr').index()];
			$('#dg_review_check_item_tr').val($(this).closest('tr').index());
			$('#dg_review_check_item_reviewId').val(object.autoId);
			$('#dg_review_check_item_reviewName').val(object.reviewName);
			$('#div_body_dg_item').empty();
			$.ajax({
				type : "post",
				url: 'cpBase/General.query.json',
				async : false,
				data : {
					menuId: window.sys_menuId,
					sqlId: 'FA50086',
					param1: object.autoId,
					start: -1,
					limit: -1
				},
				dataType : "json",
				success(data) {
					if(data.success) {
						// 存在审计工作底稿送审检查表时，需显示所有审批项内容
						for(var list of data.data){
							for(var i = 1;i <= 20;i++){
								if(list['approvalItem' + i] != null && list['approvalItem' + i] != ''){
									var $div = $('<div class="row" data-result="' + i + '">'
										+	'<div class="form-group has-info">'
										+		'<div class="col-sm-3">'
										+			'<div class="form-material input-group">'
										+				'<input class="form-control" type="text" autocomplete="off" name="review_check_item" maxLength="20" data-result="' + i + '" value="' + list['approvalItem' + i] + '">'
										+				'<label>审批项</label>'
										+				'<span class="input-group-addon"><i class="fa fa-asterisk"></i></span>'
										+			'</div>'
										+		'</div>'
										+		'<div class="col-sm-3">'
										+			'<div class="form-material">'
										+				'<select class="js-select2 form-control" name="review_check_item_must" style="width: 100%;" data-result="' + i + '">'
										+					'<option value="0" selected>非必须</option>'
										+					'<option value="1">必须</option>'
										+				'</select>'
										+				'<label>必须项</label>'
										+			'</div>'
										+		'</div>'
										+		'<div class="col-sm-3">'
										+			'<div class="form-material">'
										+				'<select class="js-select2 form-control" name="review_check_item_type" style="width: 100%;" data-result="' + i + '">'
										+					'<option value="0" selected>文本</option>'
										+					'<option value="1">下拉框</option>'
										+					'<option value="2">索引号</option>'
										+					'<option value="3">富文本</option>'
										+					'<option value="4">固定文本</option>'
										+				'</select>'
										+				'<label>审批项类型</label>'
										+			'</div>'
										+		'</div>'
										+		'<div class="col-sm-3" data-result="' + i + '" style="display: none;">'
										+			'<div class="form-material input-group">'
										+				'<input class="form-control" type="text" autocomplete="off" name="review_check_item_options" maxLength="100" placeholder="用英文逗号隔开" data-result="' + i + '" value="' + list['approvalItemOptions' + i] + '">'
										+				'<label>下拉框选项</label>'
										+			'</div>'
										+		'</div>'
										+	'</div>'
										+'</div>');
									$div.find('select[name=review_check_item_must]').val(list['approvalItemMust' + i]);
									$div.find('select[name=review_check_item_type]').val(list['approvalItemType' + i]);
									if(list['approvalItemType' + i] == 1){
										$div.find('.col-sm-3[data-result="' + i + '"]').css('display', 'block');
									}
									if(i == 1){
										$('#div_body_dg_item').append($div);
									}else{
										$('#div_body_dg_item').find('.row[data-result="' + (i - 1) + '"]').after($div);
									}
									$('#div_body_dg_item select[name=review_check_item_type]').unbind('change');
									$('#div_body_dg_item select[name=review_check_item_type]').change(function() {
										if (this.value == '1') {
											$('#div_body_dg_item').find('.col-sm-3[data-result="' + $(this).attr('data-result') + '"]').css('display', 'block');
										}else{
											$('#div_body_dg_item').find('.col-sm-3[data-result="' + $(this).attr('data-result') + '"]').css('display', 'none');
										}
									});
								}
							}
						}
						$('#modal_dg_review_check_item').modal('hide');
					}
				}
			});
			$('#div_body_dg').empty();
			$("#modal_dg_review_check").find(".modal-content").css('width', '600px');
			$('#dg_review_check_tr').val($('#dg_review_check_item_tr').val());
			$('#dg_review_check_reviewId').val($('#dg_review_check_item_reviewId').val());
			$('#temp_name_dg').html($('#dg_review_check_item_reviewName').val());
			$.ajax({
				type : "post",
				url: 'cpBase/General.query.json',
				async : false,
				data : {
					menuId: window.sys_menuId,
					sqlId: 'FA50087',
					param1: object.autoId,
					start: -1,
					limit: -1
				},
				dataType : "json",
				success(data) {
					if(data && data.success && data.data) {
						// 存在审计工作底稿送审检查表时，需显示所有审批项
						for(var list of data.data){
							if(list.parentId == 0){
								var $div = $('<div class="row" parent-result="' + list.parentId + '" data-result="' + list.id + '" style="border-top: 2px solid #999;">'
									+	'<div class="form-group has-info">'
									+		'<div class="col-sm-1">'
									+			'<div class="form-material">'
									+				'<button type="button" class="btn" name="content_dg_review_check_add" parent-result="' + list.parentId + '" data-result="' + list.id + '" title="新增"><i class="fa fa-plus"></i></button>'
									+			'</div>'
									+		'</div>'
									+		'<div class="col-sm-1">'
									+			'<div class="form-material">'
									+				'<button type="button" class="btn" name="content_dg_review_check_del" parent-result="' + list.parentId + '" data-result="' + list.id + '" title="删除"><i class="fa fa-minus"></i></button>'
									+			'</div>'
									+		'</div>'
									+		'<div class="col-sm-8">'
									+			'<div class="form-material">'
									+				'<input class="form-control" type="text" autocomplete="off" name="title_dg_review_check" placeholder="标题栏" parent-result="' + list.parentId + '" data-result="' + list.id + '" value="' + list.title + '">'
									+			'</div>'
									+		'</div>'
									+	'</div>'
									+'</div>');
								$('#div_body_dg').append($div);
								$('#div_body_dg').find('.row[data-result="1"]').css('border-top', '0px');
								// 添加审批项
								$('#div_body_dg button[name="content_dg_review_check_add"]').unbind('click');
								$('#div_body_dg button[name="content_dg_review_check_add"]').on('click', function() {
									var text = '';
									var length = $('#div_body_dg').find('.row[parent-result="' + $(this).attr('data-result') + '"]').length + 1;
									var itemLength = $('#div_body_dg_item').find('input[name="review_check_item"]').length;
									var $itemtype1 = $('#div_body_dg_item').find('select[name="review_check_item_type"][data-result="1"] option:selected');
									if(itemLength > 0 && $itemtype1.val() == '3'){
										text = text 
										+	'<div class="col-sm-10">'
										+		'<div class="form-material">'
										+			'<textarea class="form-control" rows="3" style="width: 100%;" autocomplete="off" name="param' + 1 + '" maxLength="200" parent-result="' + $(this).attr('data-result') + '" data-result="' + length+ '" data-type="3"></textarea>'
										+		'</div>'
										+	'</div>';
									}else{
										var colsm = parseInt(12 / (itemLength + 1)) > 2 ? 2 : 1;
										for(var i = 1;i <= itemLength;i++){
											var $item = $('#div_body_dg_item').find('input[name="review_check_item"][data-result="' + i + '"]');
											var $itemtype = $('#div_body_dg_item').find('select[name="review_check_item_type"][data-result="' + i + '"] option:selected');
											if($itemtype.val() == 1){
												var $itemoptions = $('#div_body_dg_item').find('input[name="review_check_item_options"][data-result="' + i + '"]');
												var optionText = '<option value=""></option>';
												for(var j = 0;j < $itemoptions.val().split(',').length;j++){
													optionText = optionText + '<option value="' + j + '">' + $itemoptions.val().split(',')[j] + '</option>';
												}
												text = text 
												+	'<div class="col-sm-1">'
												+		'<div class="form-material">'
												+			'<select class="js-select2 form-control" name="param' + i + '" style="width: 100%;" parent-result="' + $(this).attr('data-result') + '" data-result="' + length + '">'
												+				optionText
												+			'</select>'
												+			'<label>' + $item.val() + '</label>'
												+		'</div>'
												+	'</div>'
											}else{
												var optionText = '<option value=""></option>';
												for(var index of indexList){
													optionText = optionText + '<option value="' + index.indexId + '">' + index.indexId + '-' + index.nodeName + '</option>';
												}
												text = text 
												+	'<div class="col-sm-2">'
												+		'<div class="form-material">'
												+			'<input class="form-control" type="text" autocomplete="off" name="param' + i + '" maxLength="100" parent-result="' + $(this).attr('data-result') + '" data-result="' + length + '" data-type="' + $itemtype.val() + '">'
												+			'<select name="indexlist" class="js-select2 form-control" style="display: none;position: initial;" size="3">'
												+				optionText
												+			'</select>'
												+			'<label>' + $item.val() + '</label>'
												+		'</div>'
												+	'</div>';
											}
										}
									}
									var $div = $('<div class="row" parent-result="' + $(this).attr('data-result') + '" data-result="' + length + '" style="border-top: 1px solid #D3D3D3; padding-top: 10px;">'
										+		'<div class="form-group has-info">'
										+			text
										+			'<div class="col-sm-1">'
										+				'<div class="form-material">'
										+					'<select class="js-select2 form-control" name="auditor_dg" style="width: 100%;" parent-result="' + $(this).attr('data-result') + '" data-result="' + length + '">'
										+						'<option value="manager">项目负责人</option>'
										+						'<option value="signUser">签字合伙人</option>'
										+						'<option value="audit1">一审负责人</option>'
										+						'<option value="audit2">二审负责人</option>'
										+						'<option value="signAccountant2">签字注册会计师2</option>'
										+						'<option value="signAccountant3">签字注册会计师3</option>'
										+						'<option value="reaReviewer">外派复核人</option>'
										+						'<option value="reviewPartner">复核合伙人</option>'
										+					'</select>'
										+					'<label>审核人</label>'
										+				'</div>'
										+			'</div>'
										+		'</div>'
										+	'</div>');
									if(length == 1){
										$div.insertAfter($('#div_body_dg').find('.row[parent-result="0"][data-result="' + $(this).attr('data-result') + '"]'));
									}else{
										$div.insertAfter($('#div_body_dg').find('.row[parent-result="' + $(this).attr('data-result') + '"][data-result="' + (length - 1) + '"]'));
									}
									$("#modal_dg_review_check").find(".modal-content").css('width', '1200px');
									$('#div_body_dg input[data-type="2"]').unbind('input');
									$('#div_body_dg input[data-type="2"]').on('input', function() {
										$(this).next().css('display', 'block');
										var optionText = '<option value=""></option>';
										for(var list of indexList){
											if ((list.indexId + '-' + list.nodeName).indexOf(this.value) > -1) {
												optionText = optionText + '<option value="' + list.indexId + '">' + list.indexId + '-' + list.nodeName + '</option>';
											}
										}
										$(this).next().empty();
										$(this).next().append(optionText);
										$(this).next().change(function () {
											$(this).prev().val($(this).val());
											$(this).prev().attr('title', $(this).find('option:selected').text());
										});
									});
									$('#div_body_dg input[data-type="2"]').unbind('focus');
									$('#div_body_dg input[data-type="2"]').on('focus', function() {
										$(this).next().css('display', 'block');
										var optionText = '<option value=""></option>';
										for(var list of indexList){
											if ((list.indexId + '-' + list.nodeName).indexOf(this.value) > -1) {
												optionText = optionText + '<option value="' + list.indexId + '">' + list.indexId + '-' + list.nodeName + '</option>';
											}
										}
										$(this).next().empty();
										$(this).next().append(optionText);
										$(this).next().change(function () {
											$(this).prev().val($(this).val());
											$(this).prev().attr('title', $(this).find('option:selected').text());
										});
									});
									$('#div_body_dg input[data-type="2"]').unbind('blur');
									$('#div_body_dg input[data-type="2"]').on('blur', function() {
										var $select = $(this).next();
										setTimeout(function(){
											$select.css('display', 'none')
										}, 100);
									});
								});
								// 删除审批项
								$('#div_body_dg button[name="content_dg_review_check_del"]').unbind('click');
								$('#div_body_dg button[name="content_dg_review_check_del"]').on('click', function() {
									var length = $('#div_body_dg').find('.row[parent-result="' + $(this).attr('data-result') + '"]').length;
									if(length > 0){
										$('#div_body_dg').find('.row[parent-result="' + $(this).attr('data-result') + '"][data-result="' + length + '"]').remove();
									}
								});
							}else{
								var text = '';
								if(list.approvalItemType1 == '3'){
									text = text 
									+	'<div class="col-sm-10">'
									+		'<div class="form-material">'
									+			'<textarea class="form-control" rows="3" style="width: 100%;" autocomplete="off" name="param' + 1 + '" maxLength="200" parent-result="' + list.parentId + '" data-result="' + list.id + '" data-type="3"></textarea>'
									+		'</div>'
									+	'</div>';
								}else{
									var itemLength = $('#div_body_dg_item').find('input[name="review_check_item"]').length;
									var colsm = parseInt(12 / (itemLength + 1)) > 2 ? 2 : 1;
									for(var i = 1;i <= itemLength;i++){
										var $item = $('#div_body_dg_item').find('input[name="review_check_item"][data-result="' + i + '"]');
										var $itemtype = $('#div_body_dg_item').find('select[name="review_check_item_type"][data-result="' + i + '"] option:selected');
										if($itemtype.val() == 1){
											var $itemoptions = $('#div_body_dg_item').find('input[name="review_check_item_options"][data-result="' + i + '"]');
											var optionText = '<option value=""></option>';
											for(var j = 0;j < $itemoptions.val().split(',').length;j++){
												optionText = optionText + '<option value="' + j + '">' + $itemoptions.val().split(',')[j] + '</option>';
											}
											text = text 
											+	'<div class="col-sm-1">'
											+		'<div class="form-material">'
											+			'<select class="js-select2 form-control" name="param' + i + '" style="width: 100%;" parent-result="' + list.parentId + '" data-result="' + list.id + '">'
											+				optionText
											+			'</select>'
											+			'<label>' + $item.val() + '</label>'
											+		'</div>'
											+	'</div>'
										}else{
											var optionText = '<option value=""></option>';
											for(var index of indexList){
												optionText = optionText + '<option value="' + index.indexId + '">' + index.indexId + '-' + index.nodeName + '</option>';
											}
											text = text 
											+	'<div class="col-sm-2">'
											+		'<div class="form-material">'
											+			'<input class="form-control" type="text" autocomplete="off" name="param' + i + '" maxLength="100" parent-result="' + list.parentId + '" data-result="' + list.id + '" data-type="' + $itemtype.val() + '">'
											+			'<select name="indexlist" class="js-select2 form-control" style="display: none;position: initial;" size="3">'
											+				optionText
											+			'</select>'
											+			'<label>' + $item.val() + '</label>'
											+		'</div>'
											+	'</div>';
										}
									}
								}
								var $div = $('<div class="row" parent-result="' + list.parentId + '" data-result="' + list.id + '" style="border-top: 1px solid #D3D3D3; padding-top: 10px;">'
									+		'<div class="form-group has-info">'
									+			text
									+			'<div class="col-sm-1">'
									+				'<div class="form-material">'
									+					'<select class="js-select2 form-control" name="auditor_dg" style="width: 100%;" parent-result="' + list.parentId + '" data-result="' + list.id + '">'
									+						'<option value="manager">项目负责人</option>'
									+						'<option value="signUser">签字合伙人</option>'
									+						'<option value="audit1">一审负责人</option>'
									+						'<option value="audit2">二审负责人</option>'
									+						'<option value="signAccountant2">签字注册会计师2</option>'
									+						'<option value="signAccountant3">签字注册会计师3</option>'
									+						'<option value="reaReviewer">外派复核人</option>'
									+						'<option value="reviewPartner">复核合伙人</option>'
									+					'</select>'
									+					'<label>审核人</label>'
									+				'</div>'
									+			'</div>'
									+		'</div>'
									+	'</div>');
								var length = $('#div_body_dg').find('.row[parent-result="' + list.parentId + '"]').length + 1;
								if(length == 1){
									$div.insertAfter($('#div_body_dg').find('.row[parent-result="0"][data-result="' + list.parentId + '"]'));
								}else{
									$div.insertAfter($('#div_body_dg').find('.row[parent-result="' + list.parentId + '"][data-result="' + (list.id - 1) + '"]'));
								}
								var $row = $('#div_body_dg').find('.row[parent-result="' + list.parentId + '"][data-result="' + list.id + '"]');
								var itemLength = $('#div_body_dg_item').find('input[name="review_check_item"]').length;
								for(var k = 1;k <= itemLength;k++){
									if(list['approvalItemType' + k] != null && list['approvalItemType' + k] == 1){
										$row.find('select[name="param' + k + '"]').val(list['approvalItemValue' + k]);
									}else if(list['approvalItemType' + k] != null && list['approvalItemType' + k] == 3){
										$row.find('textarea[name="param' + k + '"]').val(list['approvalItemValue' + k]);
									}else{
										$row.find('input[name="param' + k + '"]').val(list['approvalItemValue' + k]);
									}
								}
								// 审核人
								$row.find('select[name="auditor_dg"]').val(list.auditor);
								$("#modal_dg_review_check").find(".modal-content").css('width', '1200px');
								$('#div_body_dg input[data-type="2"]').unbind('input');
								$('#div_body_dg input[data-type="2"]').on('input', function() {
									$(this).next().css('display', 'block');
									var optionText = '<option value=""></option>';
									for(var list of indexList){
										if ((list.indexId + '-' + list.nodeName).indexOf(this.value) > -1) {
											optionText = optionText + '<option value="' + list.indexId + '">' + list.indexId + '-' + list.nodeName + '</option>';
										}
									}
									$(this).next().empty();
									$(this).next().append(optionText);
									$(this).next().change(function () {
										$(this).prev().val($(this).val());
										$(this).prev().attr('title', $(this).find('option:selected').text());
									});
								});
								$('#div_body_dg input[data-type="2"]').unbind('focus');
								$('#div_body_dg input[data-type="2"]').on('focus', function() {
									$(this).next().css('display', 'block');
									var optionText = '<option value=""></option>';
									for(var list of indexList){
										if ((list.indexId + '-' + list.nodeName).indexOf(this.value) > -1) {
											optionText = optionText + '<option value="' + list.indexId + '">' + list.indexId + '-' + list.nodeName + '</option>';
										}
									}
									$(this).next().empty();
									$(this).next().append(optionText);
									$(this).next().change(function () {
										$(this).prev().val($(this).val());
										$(this).prev().attr('title', $(this).find('option:selected').text());
									});
								});
								$('#div_body_dg input[data-type="2"]').unbind('blur');
								$('#div_body_dg input[data-type="2"]').on('blur', function() {
									var $select = $(this).next();
									setTimeout(function(){
										$select.css('display', 'none')
									}, 100);
								});
							}
						}
						if(data.data.length > 0){
							$('#modal_dg_review_check_item').modal('hide');
							$('#modal_dg_review_check').modal('show');
						}else{
							$('#modal_dg_review_check_item').modal('show');
							$('#modal_dg_review_check').modal('hide');
						}
					}
				}
			});
			bdoSuccessBox('成功', '加载完成');
		});

		// 底稿送审检查表--新增审批项
		$('#btn_dg_review_check_item_add').on('click', function() {
			var length = $('#div_body_dg_item').find('input[name="review_check_item"]').length + 1;
			var $div = $('<div class="row" data-result="' + length + '">'
				+	'<div class="form-group has-info">'
				+		'<div class="col-sm-3">'
				+			'<div class="form-material input-group">'
				+				'<input class="form-control" type="text" autocomplete="off" name="review_check_item" maxLength="20" data-result="' + length + '">'
				+				'<label>审批项</label>'
				+				'<span class="input-group-addon"><i class="fa fa-asterisk"></i></span>'
				+			'</div>'
				+		'</div>'
				+		'<div class="col-sm-3">'
				+			'<div class="form-material">'
				+				'<select class="js-select2 form-control" name="review_check_item_must" style="width: 100%;" data-result="' + length + '">'
				+					'<option value="0" selected>非必须</option>'
				+					'<option value="1">必须</option>'
				+				'</select>'
				+				'<label>必须项</label>'
				+			'</div>'
				+		'</div>'
				+		'<div class="col-sm-3">'
				+			'<div class="form-material">'
				+				'<select class="js-select2 form-control" name="review_check_item_type" style="width: 100%;" data-result="' + length + '">'
				+					'<option value="0" selected>文本</option>'
				+					'<option value="1">下拉框</option>'
				+					'<option value="2">索引号</option>'
				+					'<option value="3">富文本</option>'
				+					'<option value="4">固定文本</option>'
				+				'</select>'
				+				'<label>审批项类型</label>'
				+			'</div>'
				+		'</div>'
				+		'<div class="col-sm-3" data-result="' + length + '" style="display: none;">'
				+			'<div class="form-material input-group">'
				+				'<input class="form-control" type="text" autocomplete="off" name="review_check_item_options" maxLength="100" placeholder="用英文逗号隔开" data-result="' + length + '">'
				+				'<label>下拉框选项</label>'
				+			'</div>'
				+		'</div>'
				+	'</div>'
				+'</div>');
			if(length == 1){
				$('#div_body_dg_item').append($div);
			}else if(length > 20){
				bdoInfoBox('提示', '审批项不能超过20项');
			}else{
				$('#div_body_dg_item').find('.row[data-result="' + (length - 1) + '"]').after($div);
			}
			$('#div_body_dg_item select[name=review_check_item_type]').unbind('change');
			$('#div_body_dg_item select[name=review_check_item_type]').change(function() {
				if (this.value == '1') {
					$('#div_body_dg_item').find('.col-sm-3[data-result="' + $(this).attr('data-result') + '"]').css('display', 'block');
				}else{
					$('#div_body_dg_item').find('.col-sm-4[data-result="' + $(this).attr('data-result') + '"]').css('display', 'none');
				}
			});
		});
		// 底稿送审检查表--删除审批项
		$('#btn_dg_review_check_item_del').on('click', function() {
			var length = $('#div_body_dg_item').find('input[name="review_check_item"]').length;
			$('#div_body_dg_item').find('.row[data-result="' + length + '"]').remove();
		});
		// 底稿送审检查表--返回至设置审批项内容
		$('#btn_dg_review_check_item_forward').on('click', function() {
			$('#modal_dg_review_check').modal('show');
			$('#modal_dg_review_check_item').modal('hide');
		});
		// 底稿送审检查表--确认审批项--跳转至审批项内容
		$('#btn_dg_review_check_item_check').on('click', function() {
			var length = $('#div_body_dg_item').find('input[name="review_check_item"]').length;
			if(length == 0){
				bdoInfoBox('提示', '审批项数量不能为空');
				return;
			}
			for(var i = 1;i <= length;i++){
				var $item = $('#div_body_dg_item').find('input[name="review_check_item"][data-result="' + i + '"]');
				if($item.val() == ''){
					bdoInfoBox('提示', '审批项不能为空');
					return;
				}
			}
			$('#dg_review_check_tr').val($('#dg_review_check_item_tr').val());
			$('#dg_review_check_reviewId').val($('#dg_review_check_item_reviewId').val());
			$('#temp_name_dg').html($('#dg_review_check_item_reviewName').val());
			$('#modal_dg_review_check_item').modal('hide');
			$('#div_body_dg').empty();
			$('#modal_dg_review_check').modal('show');
		});
		// 底稿送审检查表--返回至设置审批项
		$('#btn_dg_review_check_back').on('click', function() {
			$('#modal_dg_review_check').modal('hide');
			$('#modal_dg_review_check_item').modal('show');
		});
		// 底稿送审检查表--关闭弹出框
		$('#btn_dg_review_check_close').on('click', function() {
			$('#modal_dg_review_check').modal('hide');
		});
		// 底稿送审检查表--新增审批项
		$('#btn_dg_review_check_add').on('click', function() {
			var length = $('#div_body_dg').find('input[name="title_dg_review_check"]').length + 1;
			var $div = $('<div class="row" parent-result="0" data-result="' + length + '" style="border-top: 2px solid #999;">'
				+	'<div class="form-group has-info">'
				+		'<div class="col-sm-1">'
				+			'<div class="form-material input-group">'
				+				'<button type="button" class="btn" name="content_dg_review_check_add" parent-result="0" data-result="' + length + '" title="新增"><i class="fa fa-plus"></i></button>'
				+			'</div>'
				+		'</div>'
				+		'<div class="col-sm-1">'
				+			'<div class="form-material input-group">'
				+				'<button type="button" class="btn" name="content_dg_review_check_del" parent-result="0" data-result="' + length + '" title="删除"><i class="fa fa-minus"></i></button>'
				+			'</div>'
				+		'</div>'
				+		'<div class="col-sm-8">'
				+			'<div class="form-material">'
				+				'<input class="form-control" type="text" autocomplete="off" name="title_dg_review_check" placeholder="标题栏" parent-result="0" data-result="' + length + '">'
				+			'</div>'
				+		'</div>'
				+	'</div>'
				+'</div>');
			$('#div_body_dg').append($div);
			$('#div_body_dg').find('.row[data-result="1"]').css('border-top', '0px');
			// 添加审批项
			$('#div_body_dg button[name="content_dg_review_check_add"]').unbind('click');
			$('#div_body_dg button[name="content_dg_review_check_add"]').on('click', function() {
				var text = '';
				var itemLength = $('#div_body_dg_item').find('input[name="review_check_item"]').length;
				var length = $('#div_body_dg').find('.row[parent-result="' + $(this).attr('data-result') + '"]').length + 1;
				var $itemtype1 = $('#div_body_dg_item').find('select[name="review_check_item_type"][data-result="1"] option:selected');
				if(itemLength > 0 && $itemtype1.val() == '3'){
					text = text 
					+	'<div class="col-sm-10">'
					+		'<div class="form-material">'
					+			'<textarea class="form-control" rows="3" style="width: 100%;" autocomplete="off" name="param' + 1 + '" maxLength="200" parent-result="' + $(this).attr('data-result') + '" data-result="' + length+ '" data-type="3"></textarea>'
					+		'</div>'
					+	'</div>';
				}else{
					var colsm = parseInt(12 / (itemLength + 1)) > 2 ? 2 : 1;
					for(var i = 1;i <= itemLength;i++){
						var $item = $('#div_body_dg_item').find('input[name="review_check_item"][data-result="' + i + '"]');
						var $itemtype = $('#div_body_dg_item').find('select[name="review_check_item_type"][data-result="' + i + '"] option:selected');
						if($itemtype.val() == 1){
							var $itemoptions = $('#div_body_dg_item').find('input[name="review_check_item_options"][data-result="' + i + '"]');
							var optionText = '<option value=""></option>';
							for(var j = 0;j < $itemoptions.val().split(',').length;j++){
								optionText = optionText + '<option value="' + j + '">' + $itemoptions.val().split(',')[j] + '</option>';
							}
							text = text 
							+	'<div class="col-sm-1">'
							+		'<div class="form-material">'
							+			'<select class="js-select2 form-control" name="param' + i + '" style="width: 100%;" parent-result="' + $(this).attr('data-result') + '" data-result="' + length + '">'
							+				optionText
							+			'</select>'
							+			'<label>' + $item.val() + '</label>'
							+		'</div>'
							+	'</div>'
						}else{
							var optionText = '<option value=""></option>';
							for(var index of indexList){
								optionText = optionText + '<option value="' + index.indexId + '">' + index.indexId + '-' + index.nodeName + '</option>';
							}
							text = text 
							+	'<div class="col-sm-2">'
							+		'<div class="form-material">'
							+			'<input class="form-control" type="text" autocomplete="off" name="param' + i + '" maxLength="100" parent-result="' + $(this).attr('data-result') + '" data-result="' + length + '" data-type="' + $itemtype.val() + '">'
							+			'<select name="indexlist" class="js-select2 form-control" style="display: none;position: initial;" size="3">'
							+				optionText
							+			'</select>'
							+			'<label>' + $item.val() + '</label>'
							+		'</div>'
							+	'</div>';
						}
					}
				}
				var $div = $('<div class="row" parent-result="' + $(this).attr('data-result') + '" data-result="' + length + '" style="border-top: 1px solid #D3D3D3; padding-top: 10px;">'
					+		'<div class="form-group has-info">'
					+			text
					+			'<div class="col-sm-1">'
					+				'<div class="form-material">'
					+					'<select class="js-select2 form-control" name="auditor_dg" style="width: 100%;" parent-result="' + $(this).attr('data-result') + '" data-result="' + length + '">'
					+						'<option value="manager">项目负责人</option>'
					+						'<option value="signUser">签字合伙人</option>'
					+						'<option value="audit1">一审负责人</option>'
					+						'<option value="audit2">二审负责人</option>'
					+						'<option value="signAccountant2">签字注册会计师2</option>'
					+						'<option value="signAccountant3">签字注册会计师3</option>'
					+						'<option value="reaReviewer">外派复核人</option>'
					+						'<option value="reviewPartner">复核合伙人</option>'
					+					'</select>'
					+					'<label>审核人</label>'
					+				'</div>'
					+			'</div>'
					+		'</div>'
					+	'</div>');
				if(length == 1){
					$div.insertAfter($('#div_body_dg').find('.row[parent-result="0"][data-result="' + $(this).attr('data-result') + '"]'));
				}else{
					$div.insertAfter($('#div_body_dg').find('.row[parent-result="' + $(this).attr('data-result') + '"][data-result="' + (length - 1) + '"]'));
				}
				$("#modal_dg_review_check").find(".modal-content").css('width', '1200px');
				$('#div_body_dg input[data-type="2"]').unbind('input');
				$('#div_body_dg input[data-type="2"]').on('input', function() {
					$(this).next().css('display', 'block');
					var optionText = '<option value=""></option>';
					for(var list of indexList){
						if ((list.indexId + '-' + list.nodeName).indexOf(this.value) > -1) {
							optionText = optionText + '<option value="' + list.indexId + '">' + list.indexId + '-' + list.nodeName + '</option>';
						}
					}
					$(this).next().empty();
					$(this).next().append(optionText);
					$(this).next().change(function () {
						$(this).prev().val($(this).val());
						$(this).prev().attr('title', $(this).find('option:selected').text());
					});
				});
				$('#div_body_dg input[data-type="2"]').unbind('focus');
				$('#div_body_dg input[data-type="2"]').on('focus', function() {
					$(this).next().css('display', 'block');
					var optionText = '<option value=""></option>';
					for(var list of indexList){
						if ((list.indexId + '-' + list.nodeName).indexOf(this.value) > -1) {
							optionText = optionText + '<option value="' + list.indexId + '">' + list.indexId + '-' + list.nodeName + '</option>';
						}
					}
					$(this).next().empty();
					$(this).next().append(optionText);
					$(this).next().change(function () {
						$(this).prev().val($(this).val());
						$(this).prev().attr('title', $(this).find('option:selected').text());
					});
				});
				$('#div_body_dg input[data-type="2"]').unbind('blur');
				$('#div_body_dg input[data-type="2"]').on('blur', function() {
					var $select = $(this).next();
					setTimeout(function(){
						$select.css('display', 'none')
					}, 100);
				});
			});
			// 删除审批项
			$('#div_body_dg button[name="content_dg_review_check_del"]').unbind('click');
			$('#div_body_dg button[name="content_dg_review_check_del"]').on('click', function() {
				var length = $('#div_body_dg').find('.row[parent-result="' + $(this).attr('data-result') + '"]').length;
				if(length > 0){
					$('#div_body_dg').find('.row[parent-result="' + $(this).attr('data-result') + '"][data-result="' + length + '"]').remove();
				}
			});
		});
		// 底稿送审检查表--删除审批项
		$('#btn_dg_review_check_del').on('click', function() {
			var length = $('#div_body_dg').find('input[name="title_dg_review_check"]').length;
			if(length > 0){
				var childLength = $('#div_body_dg').find('.row[parent-result="' + length + '"]').length;
				if(childLength > 0){
					bdoInfoBox('提示', '最末级标题栏下存在审批项，请先删除审批项');
					return;
				}
				$('#div_body_dg').find('.row[parent-result="0"][data-result="' + length + '"]').remove();
			}
		});
		// 底稿送审检查表--保存审批项
		$('#btn_dg_review_check_save').on('click', function() {
			var length = $('#div_body_dg').find('input[name="title_dg_review_check"]').length;
			if(length > 0){
				var reviewId = $('#dg_review_check_reviewId').val();
				var list = [];
				for(var i = 1;i <= length;i++){
					$input = $('#div_body_dg').find('input[name="title_dg_review_check"][data-result="' + i + '"]');
					list.push({
						reviewtemplateId: reviewId,
						id: i,
						title: $input.val(),
						parentId: 0
					});
					var childrowLength = $('#div_body_dg').find('.row[parent-result="' + i + '"]').length;
					if(childrowLength > 0){
						for(var j = 1;j <= childrowLength;j++){
							$auditor = $('#div_body_dg').find('select[name="auditor_dg"][parent-result="' + i + '"][data-result="' + j + '"] option:selected');
							var row = {
									reviewtemplateId: reviewId,
									id: j,
									parentId: i,
									auditor: $auditor.val()
							};
							var itemLength = $('#div_body_dg_item').find('input[name="review_check_item"]').length;
							for(var k = 1;k <= itemLength;k++){
								var $row = $('#div_body_dg').find('.row[parent-result="' + i + '"][data-result="' + j + '"]');
								if($row.find('textarea[name="param' + 1 + '"]').length > 0){
									row['approvalItemType' + 1] = '3';
									row['approvalItemValue' + 1] = $row.find('textarea[name="param' + k + '"]').val();
									break;
								}
								var $item = $('#div_body_dg_item').find('input[name="review_check_item"][data-result="' + k + '"]');
								var $itemtype = $('#div_body_dg_item').find('select[name="review_check_item_type"][data-result="' + k + '"] option:selected');
								var $itemMust = $('#div_body_dg_item').find('select[name="review_check_item_must"][data-result="' + k + '"] option:selected');
								row['approvalItem' + k] = $item.val();
								row['approvalItemType' + k] = $itemtype.val();
								row['approvalItemMust' + k] = $itemMust.val();
								if($itemtype.val() == 1){
									var $itemoptions = $('#div_body_dg_item').find('input[name="review_check_item_options"][data-result="' + k + '"]');
									row['approvalItemOptions' + k] = $itemoptions.val();
									row['approvalItemValue' + k] = $row.find('select[name="param' + k + '"] option:selected').val();
								}else{
									row['approvalItemValue' + k] = $row.find('input[name="param' + k + '"]').val();
								}
							}
							list.push(row);
						}
					}
				}
				bdoInProcessingBox('保存中');
				$.ajax({
					url : 'cpBase/ReviewsManage.updateDgReviewCheck.json',
					type : 'post',
					data : {
						param1 : reviewId,
						param2 : JSON.stringify(list)
					},
					dataType : 'json',
					success : function(data){
						if(data.success){
							$('#modal_dg_review_check').modal('hide');
							$('#review_template_table').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			}
		});

		// 对外报告审批单
		$('#review_template_table').on('click', 'button[name="btn_external_report_approval"]', function() {
			var object = $('#review_template_table').DataTable().data()[$(this).closest('tr').index()];
			$('#input_external_report_approval_tr').val($(this).closest('tr').index());
			$('#temp_name_report').text(object.reviewName);
			$('#modal_external_report_approval').modal('show');
		});

		// 档案归档审批单
		$('#review_template_table').on('click', 'button[name="btn_archives_filed_approval"]', function() {
			var object = $('#review_template_table').DataTable().data()[$(this).closest('tr').index()];
			$('#input_archives_filed_approval_tr').val($(this).closest('tr').index());
			$('#temp_name_archives').text(object.reviewName);
			$('#modal_archives_filed_approval').modal('show');
		});
	}

	initTab1Table();
})();
