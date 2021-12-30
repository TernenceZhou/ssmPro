$(document).ready(function(){
	var formId = 'customer_form';
	var table = 'customerTable';
	var cengShow = 1;
	var cengShow2 = 1;
	var cengShow3 = 1;
	var goBack = 0;
	var operateShow = 0;
	var operateShow2 = 0;
	var showBlack = 0;
	var queryFun = function(){
		$('#chkCus_modal').modal('hide');
		var length = $('#chkCus_customerName').val().length;
		if(length < 2 && ( $('#chkCus_nationality').val() == 1 || $('#chkCus_nationality').val() == 3 )){
			bdoErrorBox('提示', '客户名称请输入全称！');
			return;
		}
		var nationality = $("#chkCus_nationality").val();
		if(nationality == "1" || nationality == "3"){ // 国内
			var url = 'cusBase/Customer.getCustomerCheckResult.json';
			var params = {
				param1: $('#chkCus_customerName').val(),
				param2 : $('#chkCus_uscc').val(),
				param3 : sys_userId,
				param4 : "1",
				param5 : ""
			};
			$('#chkCus_form').formview(
				'setAjaxConf',
				[
					url,
					params,
					'json',
					true,
					function(data) {}
				]
			);
			$('#chkCus_form').submit();
			if($('#chkCus_form').valid()){
				$.ajax({
					url : url,
					type : 'post',
					data : params,
					dataType: 'json',
					async : false,
					success : function(data) {
						var obj = $.parseJSON(data.data[0].info);
						var result = obj.result;
						if(result == "true"){
							var type = obj.type;
							var isNew= obj.isNew;
							if(isNew == "true"){
								if(type == "3"){// 3：需要新增
									tableParamQuery.filterParam.param1 = $("#chkCus_customerName").val();
									tableParamQuery.filterParam.param2 = $("#chkCus_uscc").val();
									$('#queryTable').DataTable().ajax.reload(function(){
										$('#queryTableDB_modal').modal('hide');
										var length = $('#queryTable').DataTable().data().length;
										if(length > 0){
											BdoDataTables("queryTable",tableParamQuery);
											$('#query_modal').modal('show');
											App.loader('hide');
										}else{
											showBlack = 0;
											$('#addCus_save').show();
											$('#addCus_edit').hide();
											$('#addCus_close').show();
											$('#addCus_back').show();
											$('#query_modal').modal('hide');
											$('#addCus_customerName').val($('#chkCus_customerName').val());
											$('#addCus_nationality').val($('#chkCus_nationality').val());
											$('#addCus_customerType').val(1);
											$('#modal_detail div[id^="cus_"][id$="_div"]:not(#cus_baseInfo_div)').hide();
											$('#modal_detail').modal('show');
											cengShow3 = 2;
											App.loader('hide');
										}
									});
								}
							}else{
								goBack = 1;
								if(type == "1"){ // 1：无需更新
//									bdoConfirmBox2('提示', '没有更多数据啦~');
//									cengShow = 1;
//									App.loader('hide');
									tableParamQuery.filterParam.param1 = $("#chkCus_customerName").val();
									tableParamQuery.filterParam.param2 = $("#chkCus_uscc").val();
									$('#queryTable').DataTable().ajax.reload(function(){
										$('#queryTableDB_modal').modal('hide');
										var length = $('#queryTable').DataTable().data().length;
										if(length > 0){
											BdoDataTables("queryTable",tableParamQuery);
											$('#query_modal').modal('show');
											App.loader('hide');
										}else{
											showBlack = 0;
											$('#addCus_save').show();
											$('#addCus_edit').hide();
											$('#addCus_close').show();
											$('#addCus_back').show();
											$('#query_modal').modal('hide');
											$('#addCus_customerName').val($('#chkCus_customerName').val());
											$('#addCus_nationality').val($('#chkCus_nationality').val());
											$('#addCus_customerType').val(1);
											$('#modal_detail div[id^="cus_"][id$="_div"]:not(#cus_baseInfo_div)').hide();
											$('#modal_detail').modal('show');
											cengShow3 = 2;
											App.loader('hide');
										}
									});									
								}else if(type == "2"){ // 2：需要更新  
									var resultObj = $.parseJSON(data.data[0].info);
									var usccOrBRP = resultObj.info.uscc;
									if(usccOrBRP == null || usccOrBRP.length <=0){
										usccOrBRP = resultObj.info.BPR;
									}
									bdoConfirmBox('提示', '是否添加客户信息?', function(){
										App.loader('show');
										$.ajax({
											url : 'cusBase/Customer.getCustomerCheckResult.json',
											type : 'post',
											async : false,
											data : {
												param1 : resultObj.info.customerName,
												param2 : usccOrBRP,
												param3 : sys_userId,
												param4 : "2"
											},
											dataType : 'json',
											success : function(data){
												var obj = $.parseJSON(data.data[0].info);
												var result = obj.result;
												if(result == "true"){
													$('#queryTableDB_modal').modal('hide');
													$('#query_modal').modal('hide');
													showRowData(obj.info);
													bdoSuccessBox('成功', '新增成功！');
												}else{
													bdoErrorBox('失败', '新增失败！');
												}
												App.loader('hide');
											},
											error : function(data){
												var obj = $.parseJSON(data);
												bdoErrorBox('失败', obj.resultInfo.statusText);
												App.loader('hide');
											}
										});
									});
								}
							}
							var customerId = obj.customerid;
						}else{
							bdoErrorBox('失败', obj.errorMessage);
						}
					},
					error : function(data){
						var obj = $.parseJSON(data);
						bdoErrorBox('失败', obj.resultInfo.statusText);
						App.loader('hide');
					}
				});
			}
		}else{// 国外
			
		}
	};

	$('#search_customerType').html(ComboDicOption(true, '客户属性'));
	$('#search_industryclassification').treecombo({
		url : './cpBase/TreeCommon.findIndustryTreeByCus.json',
		params : {},
		view : {
			leafIcon : 'fa fa-building text-flat',
			nodeIcon : 'fa fa-bank text-primary-light',
			folderSelectable : true,
			multiSelect : false
		}
	});
	
	  	/** 检索条件设置 */
	var queryFilter = function () {
		var queryFilterArr = [];
		
		if ($('#search_customerName').val() != '') {
			queryFilterArr.push({
				'field' : 'customerName',
				'sqlIndex' : 'customerName',
				'type' : 'string',
				'value' : $('#search_customerName').val(),
				'operate' : ''
			});
		}
		
		if ($('#search_type').val() != '') {
			queryFilterArr.push({
				'field' : 'type',
				'sqlIndex' : 'type',
				'type' : 'string',
				'value' : $('#search_type').val(),
				'operate' : ''
			});
		}

		if ($('#search_BPR').val() != '') {
			queryFilterArr.push({
				'field' : 'BPR',
				'sqlIndex' : 'BPR',
				'type' : 'string',
				'value' : $('#search_BPR').val(),
				'operate' : 'eq'
			});
		}
		
		if ($('#search_uscc').val() != '') {
			queryFilterArr.push({
				'field' : 'uscc',
				'sqlIndex' : 'uscc',
				'type' : 'string',
				'value' : $('#search_uscc').val(),
				'operate' : 'eq'
			});
		}
		
		if ($('#search_industryclassification').val() != '') {
			var value = $('#search_industryclassification').treecombo('getTreeComboValue');
			if(value.length <= 4){
				queryFilterArr.push({
					'field' : 'industryclassification',
					'sqlIndex' : 'industryclassification',
					'type' : 'string',
					'value' : $('#search_industryclassification').treecombo('getTreeComboLabel'),
					'operate' : ''
				});
			}else{
				queryFilterArr.push({
					'field' : 'industrycategory',
					'sqlIndex' : 'industrycategory',
					'type' : 'string',
					'value' : $('#search_industryclassification').treecombo('getTreeComboLabel'),
					'operate' : ''
				});
			}
		}
		
		if ($('#search_customerType').val() != '') {
			queryFilterArr.push({
				'field' : 'customerType',
				'sqlIndex' : 'customerType',
				'type' : 'string',
				'value' : $('#search_customerType').val(),
				'operate' : 'eq'
			});
		}
		
		if ($('#search_customerId').val() != '') {
			queryFilterArr.push({
				'field' : 'customerId',
				'sqlIndex' : 'customerId',
				'type' : 'string',
				'value' : $('#search_customerId').val(),
				'operate' : 'eq'
			});
		}
		
		return JSON.stringify(queryFilterArr);
	};
	
	/** table 属性 */
	var tableParam = {
		tabNum : true,
		scrollX : true,
		lengthChange : true,
		order : [2, 'asc'],
		sourceData : {},
		sourceUrl : 'cpBase/General.queryWithChildDeparts.json',
		filterParam : {
			menuId : window.sys_menuId,
			sqlId : 'CU00001',
			filter : queryFilter()
		},
		createdRow: function(row, data, dataIndex)   {
			if(data.isblack == '1'){
				$(row).css({
					'background-color': '#b4b8bf',
					'color': 'rgb(255, 255, 255)',
    				'font-weight': 'bold'
				}); 
			}
		},
		tableColumns :[
			{
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '处理',
				data : null,
				width : '180px',
				render : function(data, type, row, meta) {
					var renderStr = '';
					if(row.customerType == 1 && operate == 'edit' && row.isblack == 0) {
						renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
					}
					if(operate == 'add') {
						if(row.isblack == 0){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowAdd" data-placement="top" title="新增" data-toggle="tooltip">'
									+ '<i class="fa fa-plus-square"></i></button>';
						}
						renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
								+ '<i class="fa fa-eye"></i></button>';
					}
					if(operate == 'edit') {
//						renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowAudit" data-placement="top" title="审核" data-toggle="tooltip">'
//								+ '<i class="fa fa-send"></i></button>';
					}
					return renderStr;
				}
			}, {
				targets : 2,
				orderable : true,
				className : 'text-center',
				title : '客户编号',
				name : 'customerId',
				data : 'customerId',
				width : '150px'
			}, {
				targets : 3,
				orderable : true,
				title : '客户名称',
				name : 'customerName',
				data : 'customerName',
				width : '200px'
			}, {
				targets : 4,
				orderable : true,
				title : '曾用名',
				name : 'userbeforename',
				data : 'userbeforename',
				width : '100px'
			}, {
				targets : 5,
				orderable : true,
				title : '注册号',
				name : 'BPR',
				data : 'BPR',
				width : '200px'
			}, {
				targets : 6,
				orderable : true,
				title : '统一社会信用代码',
				className : 'text-center',
				name : 'uscc',
				data : 'uscc',
				width : '150px'
			},{
				targets : 7,
				orderable : true,
				title : '地址',
				className : 'text-right',
				name : 'registerAddress',
				data : 'registerAddress',
				width : '100px'
			}, {
				targets : 8,
				orderable : true,
				title : '发照日期',
				name : 'issueDate',
				data : 'issueDate',
				width : '100px'
			}, {
				targets : 9,
				orderable : true,
				title : '吊销日期',
				name : 'revocationDate',
				data : 'revocationDate',
				width : '100px'
			}, {
				targets : 10,
				orderable : true,
				title : '成立日期',
				className : 'text-left',
				name : 'incorporationDate',
				data : 'incorporationDate',
				width : '100px'
			},{
				targets : 11,
				orderable : true,
				title : '核准日期',
				className : 'text-right',
				name : 'approvalDate',
				data : 'approvalDate',
				width : '100px'
			},{
				targets : 12,
				orderable : true,
				title : '法定代表人',
				name : 'corporation',
				data : 'corporation',
				width : '100px'
			}, {
				targets : 13,
				orderable : true,
				title : '注册资本',
				className : 'text-left',
				name : 'register',
				data : 'register',
				width : '200px'
			}, {
				targets : 14,
				orderable : true,
				title : '注册资本币种',
				name : 'curname',
				data : 'curname',
				width : '100px'
			}, {
				targets : 15,
				orderable : true,
				title : '注销时间',
				name : 'writeoffDate',
				data : 'writeoffDate',
				width : '100px'
			}, {
				targets : 16,
				orderable : true,
				title : '登记机关',
				name : 'registerOffice',
				data : 'registerOffice',
				width : '100px'
			}, {
				targets : 17,
				orderable : true,
				title : '登记状态',
				className : 'text-left',
				name : 'registerState',
				data : 'registerState',
				width : '100px'
			}, {
				targets : 18,
				orderable : true,
				title : '省市',
				className : 'text-left',
				name : 'areaPlace',
				data : 'areaPlace',
				width : '80px'
			}, {
				targets : 19,
				orderable : true,
				title : '经营期限自',
				className : 'text-left',
				name : 'startTime',
				data : 'startTime',
				width : '80px'
			}, {
				targets : 20,
				orderable : true,
				title : '经营期限至',
				className : 'text-left',
				name : 'endTime',
				data : 'endTime',
				width : '80px'
			}, {
				targets : 21,
				orderable : true,
				title : '联系电话',
				className : 'text-left',
				name : 'Phone',
				data : 'Phone',
				width : '80px'
			}, {
				targets : 22,
				orderable : true,
				title : '国籍',
				className : 'text-left',
				name : 'nationality',
				data : 'nationality',
				width : '80px',
				render : function(data, type, row, meta){
					return DicVal2Nm(data, '客户国籍');
				}
			}, {
				targets : 23,
				orderable : true,
				title : '行业大类',
				className : 'text-left',
				name : 'industrycategory',
				data : 'industrycategory',
				width : '80px'
			}, {
				targets : 24,
				orderable : true,
				title : '行业门类',
				className : 'text-left',
				name : 'industryclassification',
				data : 'industryclassification',
				width : '80px'
			}, {
				targets : 25,
				orderable : true,
				title : '客户属性',
				className : 'text-left',
				name : 'customerType',
				data : 'customerType',
				width : '80px',
				render : function(data, type, row, meta) {
					return DicVal2Nm(data, '客户属性');
				}
			}, {
				targets : 26,
				orderable : true,
				title : '最上级名',
				className : 'text-left',
				name : 'firstItemName',
				data : 'firstItemName',
				width : '80px'
			}, {
				targets : 27,
				orderable : true,
				title : '集团名',
				className : 'text-left',
				name : 'groupName',
				data : 'groupName',
				width : '80px'
			}]
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	/** table 属性 */
	var tableParamQueryByDB = {
		tabNum : true,
		scrollX : true,
		lengthChange : true,
		order : [2, 'desc'],
		sourceData : {},
		sourceUrl : 'cusBase/CusGeneral.query.json',
		filterParam : {
			menuId : window.sys_menuId,
			sqlId : 'CU00014',
			filter : '',
			param1 : null,
			param2 : null
		},
		createdRow: function(row, data, dataIndex)   {
			if(data.isblack == '1'){
				$(row).css({
					'background-color': '#b4b8bf',
					'color': 'rgb(255, 255, 255)',
    				'font-weight': 'bold'
				}); 
			}
		},
		tableColumns :[
			{
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '处理',
				data : null,
				width : '90px',
				render : function(data, type, row, meta) {
					var renderStr = '';
					if(data.isblack == 0){
						renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowAdd" data-placement="top" title="新增" data-toggle="tooltip">'
							+ '<i class="fa fa-plus-square"></i></button>';
					}
					renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
							+ '<i class="fa fa-eye"></i></button>';
					return renderStr;
				}
			}, {
				targets : 2,
				orderable : true,
				title : '客户名称',
				name : 'customerName',
				data : 'customerName',
				width : '200px'
			}, {
				targets : 3,
				orderable : true,
				title : '曾用名',
				name : 'userbeforename',
				data : 'userbeforename',
				width : '100px'
			}, {
				targets : 4,
				orderable : true,
				title : '注册号',
				name : 'BPR',
				data : 'BPR',
				width : '200px'
			}, {
				targets : 5,
				orderable : true,
				title : '统一社会信用代码',
				className : 'text-center',
				name : 'uscc',
				data : 'uscc',
				width : '150px'
			},{
				targets : 6,
				orderable : true,
				title : '核准日期',
				className : 'text-right',
				name : 'approvalDate',
				data : 'approvalDate',
				width : '100px'
			}, {
				targets : 7,
				orderable : true,
				title : '登记机关',
				name : 'registerOffice',
				data : 'registerOffice',
				width : '100px'
			}, {
				targets : 8,
				orderable : true,
				title : '登记状态',
				className : 'text-left',
				name : 'registerState',
				data : 'registerState',
				width : '100px'
			}]
	};
	
	
	/** 行按钮 新增 */
	$('#queryTableDB').on('click', 'button[name="rowAdd"]', function() {
		
		var record = $('#queryTableDB').DataTable().data()[$(this).closest('tr').index()];
		var cusName = record.customerName;
		var cusUscc = record.uscc;
		if(cusUscc == null || cusUscc.length <=0){
			cusUscc = record.BPR;
		}
						
		$.ajax({
			url : 'cusBase/Customer.getCustomerCheckResult.json',
			type : 'post',
			data : {
				param1 : cusName,
				param2 : cusUscc,
				param3 : sys_userId,
				param4 : "1"
			},
			dataType : 'json',
			success : function(data){
				var obj = $.parseJSON(data.data[0].info);
				var type = obj.type;
				var isNew= obj.isNew;
				if(isNew == "true"){
					if(type == "3"){// 3：需要新增
						
					}
				}else{
					goBack = 1;
					if(type == "1"){ // 1：无需更新
						bdoConfirmBox('提示', '需要新增客户信息吗?', function(){
							bdoSuccessBox('提示', '新增成功！');
							$('#chkCus_modal').modal('hide');
							$('#queryTableDB_modal').modal('hide');
							cengShow = 1;
							showRowData(obj.info);
						});
					}else if(type == "2"){ // 2：需要更新  
						var resultObj = $.parseJSON(data.data[0].info);
						var usccOrBRP = resultObj.info.uscc;
						if(usccOrBRP == null || usccOrBRP.length <=0){
							usccOrBRP = resultObj.info.BPR;
						}
						bdoConfirmBox('提示', '是否添加客户信息?', function(){
							App.loader('show');
							$.ajax({
								url : 'cusBase/Customer.getCustomerCheckResult.json',
								type : 'post',
								data : {
									param1 : resultObj.info.customerName,
									param2 : usccOrBRP,
									param3 : sys_userId,
									param4 : "2"
								},
								dataType : 'json',
								success : function(data){
									var obj = $.parseJSON(data.data[0].info);
									var result = obj.result;
									if(result == "true"){
										$('#chkCus_modal').modal('hide');
										$('#queryTableDB_modal').modal('hide');
										showRowData(obj.info);
										bdoSuccessBox('成功', '新增成功！');
									}else{
										bdoErrorBox('失败', '新增失败！');
									}
									App.loader('hide');
								},
								error : function(data){
									var obj = $.parseJSON(data);
									bdoErrorBox('失败', obj.resultInfo.statusText);
									App.loader('hide');
								}
							});
						});
					}
				}
			}
		});
	});
	
	
	/** 行按钮 新增 */
	$('#queryTableDB').on('click', 'button[name="rowView"]', function() {
		
		var record = $('#queryTableDB').DataTable().data()[$(this).closest('tr').index()];
		
		var cusName = record.customerName;
		var cusUscc = record.uscc;
		if(cusUscc == null || cusUscc.length <=0){
			cusUscc = record.BPR;
		}
						
		$.ajax({
			url : 'cusBase/Customer.getCustomerCheckResult.json',
			type : 'post',
			data : {
				param1 : cusName,
				param2 : cusUscc,
				param3 : sys_userId,
				param4 : "1"
			},
			dataType : 'json',
			success : function(data){
				var obj = $.parseJSON(data.data[0].info);
				$('#queryTableDB_modal').modal('hide');
				cengShow=3;
				obj.info.operateShow = 0;
				showRowData(obj.info);
			}
		});
	});

	/** table 属性 */
	var tableParamQuery = {
		tabNum : true,
		scrollX : true,
		lengthChange : true,
		order : [2, 'desc'],
		sourceData : {},
		sourceUrl : 'cusBase/Customer.findInfo.json',
		filterParam : {
			param1:"s",
			param2:"1"
		},
		tableColumns :[
			{
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '处理',
				data : null,
				width : '50px',
				render : function(data, type, row, meta) {
					var renderStr = '';
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowAdd" data-placement="top" title="查询" data-toggle="tooltip">'
							+ '<i class="fa fa-search-plus"></i></button>';
					return renderStr;
				}
			}, {
				targets : 2,
				orderable : true,
				title : '客户名称',
				name : 'customerName',
				data : 'customerName',
				width : '200px'
			}, {
				targets : 3,
				orderable : true,
				title : '曾用名',
				name : 'userbeforename',
				data : 'userbeforename',
				width : '100px'
			}, {
				targets : 4,
				orderable : true,
				title : '注册号',
				name : 'BPR',
				data : 'BPR',
				width : '200px'
			}, {
				targets : 5,
				orderable : true,
				title : '统一社会信用代码',
				className : 'text-center',
				name : 'uscc',
				data : 'uscc',
				width : '150px'
			},{
				targets : 6,
				orderable : true,
				title : '核准日期',
				className : 'text-right',
				name : 'approvalDate',
				data : 'approvalDate',
				width : '100px'
			}, {
				targets : 7,
				orderable : true,
				title : '登记机关',
				name : 'registerOffice',
				data : 'registerOffice',
				width : '100px'
			}, {
				targets : 8,
				orderable : true,
				title : '登记状态',
				className : 'text-left',
				name : 'registerState',
				data : 'registerState',
				width : '100px'
			}]
	};
	
	/** table */
	BdoDataTables("queryTable",tableParamQuery);
	
	/** 行按钮 新增 */
	$('#queryTable').on('click', 'button[name="rowAdd"]', function() {
		
		var record = $('#queryTable').DataTable().data()[$(this).closest('tr').index()];
		
		var cusName = record.customerName;
		var cusUscc = record.uscc;
		if(cusUscc == null || cusUscc.length <=0){
			cusUscc = record.BPR;
		}
						
		$.ajax({
			url : 'cusBase/Customer.getCustomerCheckResult.json',
			type : 'post',
			data : {
				param1 : cusName,
				param2 : cusUscc,
				param3 : sys_userId,
				param4 : "1"
			},
			dataType : 'json',
			success : function(data){
				var obj = $.parseJSON(data.data[0].info);
				var type = obj.type;
				var isNew= obj.isNew;
				if(isNew == "true"){
					if(type == "3"){// 3：需要新增
						bdoConfirmBox('提示', '需要新增客户信息吗?', function(){
							App.loader('show');
							$.ajax({
								url : 'cusBase/Customer.getCustomerCheckResult.json',
								type : 'post',
								data : {
									param1 : cusName,
									param2 : cusUscc,
									param3 : sys_userId,
									param4 : "2"
								},
								dataType : 'json',
								success : function(data){
									var obj = $.parseJSON(data.data[0].info);
									var result = obj.result;
									if(result == "true"){
										showBlack = 0;
										bdoSuccessBox('成功', '新增成功！');
										$('#chkCus_modal').modal('hide');
										$('#query_modal').modal('hide');
										showRowData(obj.info);
										goBack = 1;
									}else{
										bdoErrorBox('失败', '新增失败！');
									}
									App.loader('hide');
								},
								error : function(data){
									var obj = $.parseJSON(data);
									bdoErrorBox('失败', obj.resultInfo.statusText);
									App.loader('hide');
								}
							});
						});
					}
				}else{
					goBack = 1;
					if(type == "1"){ // 1：无需更新
						bdoSuccessBox('提示', '新增成功！');
						$('#chkCus_modal').modal('hide');
						$('#query_modal').modal('hide');
						cengShow = 1;
						showRowData(obj.info);
					}else if(type == "2"){ // 2：需要更新  
						var resultObj = $.parseJSON(data.data[0].info);
						var usccOrBRP = resultObj.info.uscc;
						if(usccOrBRP == null || usccOrBRP.length <=0){
							usccOrBRP = resultObj.info.BPR;
						}
						bdoConfirmBox('提示', '是否添加客户信息?', function(){
							App.loader('show');
							$.ajax({
								url : 'cusBase/Customer.getCustomerCheckResult.json',
								type : 'post',
								data : {
									param1 : resultObj.info.customerName,
									param2 : usccOrBRP,
									param3 : sys_userId,
									param4 : "2"
								},
								dataType : 'json',
								success : function(data){
									var obj = $.parseJSON(data.data[0].info);
									var result = obj.result;
									if(result == "true"){
										$('#chkCus_modal').modal('hide');
										$('#query_modal').modal('hide');
										showRowData(obj.info);
										bdoSuccessBox('成功', '新增成功！');
									}else{
										bdoErrorBox('失败', '新增失败！');
									}
									App.loader('hide');
								},
								error : function(data){
									var obj = $.parseJSON(data);
									bdoErrorBox('失败', obj.resultInfo.statusText);
									App.loader('hide');
								}
							});
						});
					}
				}
			}
		});
	});
	
	
	/** 导出 */
	$('#btn_export').click(function() {
		exportExcel(this, '客户信息一览', tableParam, table);
	});
	
	/** 搜索按钮 */
	$('#btn_search').click(function() {
		tableParam.filterParam.filter = queryFilter();
		$('#'+table).DataTable().ajax.reload();
	});
	
	/** 重置按钮 */
	$('#btn_clear').click(function() {
		$('#search_customerName').val(null);
		$('#search_type').val(null);
		$('#search_BPR').val(null);
		$('#search_uscc').val(null);
		$('#search_industry').val(null);
		$('#search_customerType').val(null);
		tableParam.filterParam.filter = queryFilter();
		$('#'+table).DataTable().ajax.reload();
	});
	
	
	var showRowData = function(data){
		
		if(operate == 'edit') {
			$('#addCus_save').hide();
			$('#addCus_edit').show();
			$('#addCus_close').hide();
			$('#addCus_back').hide();
			$('#modal_detail div[id^="cus_"][id$="_div"]').show();
			setModalData("addCus",table,this);
			$('#modal_detail').modal('show');
			$('#modal_detail button.btn_add').show();
			operateShow =1;
		}else{
			$('#customer_form textarea').attr('disabled', 'disabled');
			$('#customer_form input').attr('disabled', 'disabled');
			$('#addCus_industry').parent().find('.caret').hide();  
			$('#customer_form select').attr('disabled', 'disabled');
			$('#addCus_save').hide();
			$('#addCus_edit').hide();
			$('#addCus_close').hide();
			$('#addCus_back').hide();
			$('#modal_detail div[id^="cus_"][id$="_div"]').show();
			if(data && data.handleObj == null){
				setModalData2(data);
				operateShow =1;
				if(data.operateShow == 0){
					operateShow =0;
				}
			}else{
				setModalData("addCus",table,this);
				operateShow =0;
				showBlack = 1;
			}
			$('#modal_detail').modal('show');
			if($('#addCus_customerType').val() == 1){
				$('#modal_detail button.btn_add').show();
			}else{
				$('#modal_detail button.btn_add').hide();
			}
			
			if(data && data.handleObj == null){
				
			}else{
				$('#modal_detail button.btn_add').hide();
			}

			if( operateShow != 0){
				
			}else{
				operateShow = 0;
				$('#modal_detail button.btn_add').hide();
			}
		}
	};
	
	/** 行按钮 查看 */
	$('#'+table).on('click', 'button[name="rowView"]', showRowData);
	
	/** 行按钮 编辑 */
	$('#'+table).on('click', 'button[name="rowEdit"]', function(event){
		$('#addCus_save').hide();
		$('#addCus_edit').show();
		$('#addCus_close').hide();
		$('#addCus_back').hide();
		setModalData("addCus",table,this);
		$('#modal_detail div[id^="cus_"][id$="_div"]').show();
		$('#addCus_customerName').attr('readonly','readonly');
		$('#addCus_BPR').attr('readonly','readonly');
		$('#addCus_uscc').attr('readonly','readonly');
		$('#modal_detail').modal('show');
		if($('#addCus_customerType').val() == 1){
			$('#modal_detail button.btn_add').show();
		}else{
			$('#modal_detail button.btn_add').hide();
		}
	});
	

	/** 新增 */
	$('#btn_add').click(function() {
		var val = $('#chkCus_nationality').val();
		if(val != "1"){
			$('#chkCus_nationality').val(1);
			$('#chkCus_nationality').change();
		}
		$('#chkCus_nationality').val(1);
		$('#chkCus_customerName').val(null);
		$('#chkCus_uscc').val(null);
		$('#chkCus_modal').modal('show');
	});
	
	/**
	 * 模态框数据 加载
	 */
	var setModalData = function(formId, table, me){
		
		var record = $('#'+ table).DataTable().data()[$(me).closest('tr').index()];
		$('#'+formId+'_'+ 'customerId').val(record.customerId);
		$('#'+formId+'_'+ 'issueDate').val(record.issueDate);
		$('#'+formId+'_'+ 'revocationDate').val(record.revocationDate);
		$('#'+formId+'_'+ 'customerName').val(record.customerName);
		$('#'+formId+'_'+ 'userbeforename').val(record.userbeforename);
		$('#'+formId+'_'+ 'registerAddress').val(record.registerAddress);
		$('#'+formId+'_'+ 'incorporationDate').val(record.incorporationDate);
		$('#'+formId+'_'+ 'approvalDate').val(record.approvalDate);
		$('#'+formId+'_'+ 'corporation').val(record.corporation);
		$('#'+formId+'_'+ 'BPR').val(record.BPR);
		$('#'+formId+'_'+ 'register').val(record.register);
		$('#'+formId+'_'+ 'curname').val(record.curname);
		$('#'+formId+'_'+ 'writeoffDate').val(record.writeoffDate);
		$('#'+formId+'_'+ 'registerOffice').val(record.registerOffice);
		$('#'+formId+'_'+ 'registerState').val(record.registerState);
		$('#'+formId+'_'+ 'areaPlace').val(record.areaPlace);
		$('#'+formId+'_'+ 'type').val(record.type);
		$('#'+formId+'_'+ 'startTime').val(record.startTime);
		$('#'+formId+'_'+ 'endTime').val(record.endTime);
		$('#'+formId+'_'+ 'uscc').val(record.uscc);
		$('#'+formId+'_'+ 'Phone').val(record.Phone);
		$('#'+formId+'_'+ 'nationality').val(record.nationality);
		var industryTemp = IndustryValByGB(record.industryclassificationcode, record.industrycategorycode);
		$('#'+formId+'_'+ 'industry').treecombo('setTreeComboValue',[industryTemp,IndustryVal2NmByGB(record.industryclassificationcode, record.industrycategorycode)]);
		$('#'+formId+'_'+ 'customerType').val(record.customerType);
		$('#'+formId+'_'+ 'industry').attr("title",$('#'+formId+'_'+ 'industry').treecombo('getTreeComboLabel'));
//		$('#'+formId+'_'+ 'customerName').attr("title",null);
		$('#'+formId+'_'+ 'userbeforename').attr("title",record.userbeforename);
		$('#'+formId+'_'+ 'registerAddress').attr("title",record.registerAddress);
		$('#'+formId+'_'+ 'type').attr("title",record.type);
		$('#'+formId+'_'+ 'uscc').attr("title",record.uscc);
		$('#'+formId+'_'+ 'customerName').attr("data-original-title",record.customerName);
		$('[data-toggle="tooltip"]').tooltip();
//		 data-toggle="tooltip" data-placement="top" title=""
	};
	
	/**
	 * 模态框数据 加载
	 */
	var setModalData2 = function(record){
		var formId = "addCus";
		if(record == null){
			return;
		}
		$('#'+formId+'_'+ 'customerId').val(record.customerId);
		$('#'+formId+'_'+ 'issueDate').val(record.issueDate);
		$('#'+formId+'_'+ 'revocationDate').val(record.revocationDate);
		$('#'+formId+'_'+ 'customerName').val(record.customerName);
		$('#'+formId+'_'+ 'userbeforename').val(record.userbeforename);
		$('#'+formId+'_'+ 'registerAddress').val(record.registerAddress);
		$('#'+formId+'_'+ 'incorporationDate').val(record.incorporationDate);
		$('#'+formId+'_'+ 'approvalDate').val(record.approvalDate);
		$('#'+formId+'_'+ 'corporation').val(record.corporation);
		$('#'+formId+'_'+ 'BPR').val(record.BPR);
		$('#'+formId+'_'+ 'register').val(record.register);
		$('#'+formId+'_'+ 'curname').val(record.curname);
		$('#'+formId+'_'+ 'writeoffDate').val(record.writeoffDate);
		$('#'+formId+'_'+ 'registerOffice').val(record.registerOffice);
		$('#'+formId+'_'+ 'registerState').val(record.registerState);
		$('#'+formId+'_'+ 'areaPlace').val(record.areaPlace);
		$('#'+formId+'_'+ 'type').val(record.type);
		$('#'+formId+'_'+ 'startTime').val(record.startTime);
		$('#'+formId+'_'+ 'endTime').val(record.endTime);
		$('#'+formId+'_'+ 'uscc').val(record.uscc);
		$('#'+formId+'_'+ 'Phone').val(record.Phone);
		$('#'+formId+'_'+ 'nationality').val(record.nationality);
		
		$('#'+formId+'_'+ 'customerType').val(record.customerType);
		$.ajax({
			url : 'cusBase/Customer.getIndustryValue.json',
			type : 'post',
			data : {
				param1 : record.industryclassification,
				param2 : record.industrycategory
			},
			dataType: 'json',
			async : false,
			success : function(data){
				if(data.success){
					var industryTemp = data.data[0].industryValue;
					$('#'+formId+'_'+ 'industry').treecombo('setTreeComboValue',[industryTemp,IndustryVal2Nm(industryTemp)]);
					$('#'+formId+'_'+ 'industry').attr("title",$('#'+formId+'_'+ 'industry').treecombo('getTreeComboLabel'));
				}else{
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			},
			error : function(data){
				bdoErrorBox('失败', data.resultInfo.statusText);

			}
		});
		
		$('#'+formId+'_'+ 'customerName').attr("data-toggle","tooltip");
		$('#'+formId+'_'+ 'customerName').attr("data-placement",'right');
		$('#'+formId+'_'+ 'customerName').attr("title",record.customerName);
		 $('[data-toggle="tooltip"]').tooltip();
		$('#'+formId+'_'+ 'userbeforename').attr("title",record.userbeforename);
		$('#'+formId+'_'+ 'registerAddress').attr("title",record.registerAddress);
		$('#'+formId+'_'+ 'type').attr("title",record.type);
		$('#'+formId+'_'+ 'uscc').attr("title",record.uscc);
		
		
	};
	
	$('#customer_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [
			{
				id :  'addCus_back',
				icon : 'fa-arrow-left',
				style : 'btn-css1 btn-warning',
				text : '上一步'
			},{
				id : 'addCus_save',
				icon : 'fa-floppy-o',
				style : 'btn-success',
				text : '新建'
			},{
				id :  'addCus_edit',
				icon : 'fa-pencil',
				style : 'btn-css1 btn-info',
				text : '修改'
			},{
				id :  'addCus_close',
				icon : 'fa-close',
				style : 'btn-css1 btn-danger',
				text : '关闭'
			}
		],
		items : [
			{
				id :  'addCus_customerId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'addCus_uscc',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'addCus_BPR',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{ 
				id :  'addCus_userbeforename',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'addCus_customerName',
				type : 'input',
				label : '客户名称',
				typeAttr : {
					readonly : 'readonly'
				},
				validate : {
					rules : {
						required : true
					}
				}
			},{
				id :  'addCus_corporation',
				type : 'input',
				label : '法定代表人'
			},{
				id :  'addCus_Phone',
				type : 'input',
				label : '联系电话'
			},{
				id :  'addCus_registerAddress',
				type : 'input',
				label : '地址'
			},{
				id :  'addCus_industry',
				type : 'input',
				label : '行业分类',
				plugin : {
					name : 'treecombo',
					options :{
						url : './cpBase/TreeCommon.findIndustryTreeByCus.json',
						params : {},
						view : {
							leafIcon : 'fa fa-building text-flat',
							nodeIcon : 'fa fa-bank text-primary-light',
							folderSelectable : true,
							multiSelect : false
						}
					}
				}
			},{
				id :  'addCus_type',
				type : 'input',
				label : '客户类型'
			},{
				id : 'addCus_approvalDate',
				label : '核准日期',
				type : 'input',
				rowspan : 1,
				plugin : {
					name : 'datepicker',
					options : {
						weekStart: 1,
						clearBtn: true,
						autoclose: true,
						language: 'zh-CN',
						format: 'yyyy-mm-dd',
						todayHighlight: true
					}
				}
			},{
				id : 'addCus_incorporationDate',
				label : '成立日期',
				type : 'input',
				plugin : {
					name : 'datepicker',
					options : {
						weekStart: 1,
						clearBtn: true,
						autoclose: true,
						language: 'zh-CN',
						format: 'yyyy-mm-dd',
						todayHighlight: true
					}
				}
			},{
				id : 'addCus_revocationDate',
				label : '吊销日期',
				type : 'input',
				plugin : {
					name : 'datepicker',
					options : {
						weekStart: 1,
						clearBtn: true,
						autoclose: true,
						language: 'zh-CN',
						format: 'yyyy-mm-dd',
						todayHighlight: true
					}
				}
			},{
				id :  'addCus_register',
				type : 'input',
				label : '注册资本'
			},{
				id :  'addCus_curname',
				type : 'select',
				label : '注册资本币种',
				html : ComboDicOption(true, 'currency')
			},{
				id :  'addCus_writeoffDate',
				type : 'input',
				label : '注销时间',
				plugin : {
					name : 'datepicker',
					options : {
						weekStart: 1,
						clearBtn: true,
						autoclose: true,
						language: 'zh-CN',
						format: 'yyyy-mm-dd',
						todayHighlight: true
					}
				}
			},{
				id :  'addCus_registerOffice',
				type : 'input',
				rowspan : 1,
				label : '登记机关'
			},{
				id :  'addCus_registerState',
				type : 'select',
				label : '登记状态',
				html : ComboDicOption(true, '客户登记状态')
				
			},{
				id :  'addCus_areaPlace',
				type : 'select',
				label : '省市',
				html : ComboDBOption('./cpBase/Combo.findProvince.json', true)
			},{
				id : 'addCus_issueDate',
				label : '发照日期',
				type : 'input',
				plugin : {
					name : 'datepicker',
					options : {
						weekStart: 1,
						clearBtn: true,
						autoclose: true,
						language: 'zh-CN',
						format: 'yyyy-mm-dd',
						todayHighlight: true
					}
				}
			},{
				id :  'addCus_startTime',
				type : 'input',
				label : '经营期限自',
				plugin : {
					name : 'datepicker',
					options : {
						weekStart: 1,
						clearBtn: true,
						autoclose: true,
						language: 'zh-CN',
						format: 'yyyy-mm-dd',
						todayHighlight: true
					}
				}
			},{
				id :  'addCus_endTime',
				type : 'input',
				label : '经营期限至',
				plugin : {
					name : 'datepicker',
					options : {
						weekStart: 1,
						clearBtn: true,
						autoclose: true,
						language: 'zh-CN',
						format: 'yyyy-mm-dd',
						todayHighlight: true
					}
				}
			},{
				rowspan : 1,
				id :  'addCus_nationality',
				type : 'select',
				label : '客户国籍',
				html : ComboDicOption(true, '客户国籍'),
				typeAttr : {
					disabled : 'disabled'
				}
			},{
				id :  'addCus_customerType',
				type : 'select',
				label : '客户属性',
				html : ComboDicOption(true, '客户属性'),
				typeAttr : {
					disabled : 'disabled'
				}
			}
		]
	});
	
	// 添加客户信息
	$('#addCus_save').click(function(){
		
		$('#modal_detail button.btn_add').show();
		operateShow = 1;
		$('#customer_form').submit();
		if($('#customer_form').valid()){
			var industryVal = $('#addCus_industry').treecombo('getTreeComboValue');
			if(industryVal[0] != null && industryVal[0].nodeName == 'INPUT'){
				industryVal = null;
			}
			var cusBasicInfo = JSON.stringify({
				issueDate: $('#addCus_issueDate').val(),
				revocationDate: $('#addCus_revocationDate').val(),
				customerName: $('#addCus_customerName').val(),
				userbeforename: $('#addCus_userbeforename').val(),
				registerAddress: $('#addCus_registerAddress').val(),
				incorporationDate: $('#addCus_incorporationDate').val(),
				approvalDate: $('#addCus_approvalDate').val(),
				corporation: $('#addCus_corporation').val(),
				BPR: $('#addCus_BPR').val(),
				register: $('#addCus_register').val(),
				curname: $('#addCus_curname').val(),
				writeoffDate: $('#addCus_writeoffDate').val(),
				registerOffice: $('#addCus_registerOffice').val(),
				registerState: $('#addCus_registerState').val(),
				areaPlace: $('#addCus_areaPlace').val(),
				type: $('#addCus_type').val(),
				startTime: $('#addCus_startTime').val(),
				endTime: $('#addCus_endTime').val(),
				uscc: $('#addCus_uscc').val(),
				Phone: $('#addCus_Phone').val(),
				nationality: $('#addCus_nationality').val(),
				industry: industryVal,
				customerType: $('#addCus_customerType').val()
			});
			
			$.ajax({
				url : 'cusBase/Customer.addCustomer.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						bdoSuccessBox('成功', '添加成功！');
						$('#modal_detail [data-toggle="block-option"][data-action="content_toggle"]').each(function(index){
							if(index == 0){return true;}
							if($(this).find('i').attr('class') == 'si si-arrow-up'){
								$(this).click();
							}
					    });
						$('#addCus_customerName').attr('readonly','readonly');
						$('#addCus_BPR').attr('readonly','readonly');
						$('#addCus_uscc').attr('readonly','readonly');
						$('#addCus_customerId').val(data.data[0].customerId);
						$('#modal_detail div[id^="cus_"][id$="_div"]').show();
						$('#addCus_save').hide();
						$('#addCus_edit').show();
						$('#addCus_close').hide();
						$('#addCus_back').hide();
						goBack = 1;
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	// 修改客户信息
	$('#addCus_edit').click(function(){
		$('#customer_form').submit();
		if($('#customer_form').valid()){
			var industryVal = $('#addCus_industry').treecombo('getTreeComboValue');
			if(industryVal[0] != null && industryVal[0].nodeName == 'INPUT'){
				industryVal = null;
			}
			
			var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				issueDate: $('#addCus_issueDate').val(),
				revocationDate: $('#addCus_revocationDate').val(),
				customerName: $('#addCus_customerName').val(),
				userbeforename: $('#addCus_userbeforename').val(),
				registerAddress: $('#addCus_registerAddress').val(),
				incorporationDate: $('#addCus_incorporationDate').val(),
				approvalDate: $('#addCus_approvalDate').val(),
				corporation: $('#addCus_corporation').val(),
				BPR: $('#addCus_BPR').val(),
				register: $('#addCus_register').val(),
				curname: $('#addCus_curname').val(),
				writeoffDate: $('#addCus_writeoffDate').val(),
				registerOffice: $('#addCus_registerOffice').val(),
				registerState: $('#addCus_registerState').val(),
				areaPlace: $('#addCus_areaPlace').val(),
				type: $('#addCus_type').val(),
				startTime: $('#addCus_startTime').val(),
				endTime: $('#addCus_endTime').val(),
				uscc: $('#addCus_uscc').val(),
				Phone: $('#addCus_Phone').val(),
				nationality: $('#addCus_nationality').val(),
				industry: industryVal,
				customerType: $('#addCus_customerType').val()
			
			});
			$.ajax({
				url : 'cusBase/Customer.editCustomer.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#customerTable').DataTable().ajax.reload();
						bdoSuccessBox('成功', '修改成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#chkCus_form').formview({
		display : 'tableform-one',
		column : 2,
		tip: '<p class="text-muted" ' +
				'style="float:left; font-size:12px; color:red;">' +
				'注:【统一社会信用代码】有输入值时，为优先条件！' +
			'</p>',
		style: {},
		buttons : [
			{
				id : 'chkCus_check',
				icon : 'fa-mixcloud',
				style : 'btn-primary',
				text : '继续'
			}
		],
		items : [
			{
				id : 'chkCus_nationality',
				type : 'select',
				label : '客户国籍',
				html : ComboDicOption(false, '客户国籍'),
				validate : {
					rules : {
						required : true
					}
				}
			},{
				id : 'chkCus_customerName',
				label : '客户名称 (模糊匹配)',
				rowspan : 1,
				colspan : 2,
				type : 'input',
				validate : {
					rules : {
						required : true
					}
				}
			},{
				id : 'chkCus_uscc',
				label : '统一社会信用代码 (完全匹配)',
				rowspan : 1,
				colspan : 2,
				type : 'input',
				typeAttr: {
//					placeholder: ''
				}
			}
		]
	});
	
	$('#chkCus_nationality').change(function(){
		var val = $('#chkCus_nationality').val();
		if(val == 1 || val == 3){// 国内
			$("#chkCus_customerName").closest("tr").show();
			$('#chkCus_customerName').show();
			$("#chkCus_uscc").closest("tr").show();
			$('#chkCus_uscc').show();
			$("#chkCus_form tr:last-child p").show();
		}else{// 国外
			$("#chkCus_customerName").closest("tr").hide();
			$('#chkCus_customerName').hide();
			$("#chkCus_uscc").closest("tr").hide();
			$('#chkCus_uscc').hide();
			$("#chkCus_form tr:last-child p").hide();
		}
	});
	
	/** 模态框 检查 */
	$('#chkCus_check').click(function(){
		var length = $('#chkCus_customerName').val().length;
		if(length < 2 
			&& ( $('#chkCus_nationality').val() == 1 || $('#chkCus_nationality').val() == 3 )
		){
			bdoErrorBox('提示', '客户名称请输入全称！');
			return;
		}
		var nationality = $("#chkCus_nationality").val();
		if(nationality == "1" || nationality == "3"){ // 国内
			var url = 'cusBase/Customer.getCustomerCheckResult.json';
			var params = {
				param1: $('#chkCus_customerName').val(),
				param2 : $('#chkCus_uscc').val(),
				param3 : sys_userId,
				param4 : "1",
				param5 : ""
			};
				
			$('#chkCus_form').formview('setAjaxConf', [url, params, 'json', true, function(data){}]);
				
			$('#chkCus_form').submit();
			if($('#chkCus_form').valid()){
				App.loader('show');
				tableParamQueryByDB.filterParam.param1 = $("#chkCus_customerName").val();
				tableParamQueryByDB.filterParam.param2 = $("#chkCus_uscc").val();
				if($("#chkCus_uscc").val() != null && $("#chkCus_uscc").val() != ''){
			   		tableParamQueryByDB.filterParam.param1 = null;
			   	}
				BdoDataTables("queryTableDB",tableParamQueryByDB);
				$('#queryTableDB').DataTable().ajax.reload(function(){
					var length = $('#queryTableDB').DataTable().data().length;
					if(length > 0){
						showBlack = 0;
						operateShow =0;
						$('#chkCus_modal').modal('hide');
						$('#queryTableDB_modal').modal('show');
						BdoDataTables("queryTableDB",tableParamQueryByDB);
						App.loader('hide');
						cengShow3 = 3;
					}else{
						cengShow2 = 2;
						$('#queryTableDB_modal').modal('hide');
						queryFun(); 
					}
				});
			}
		}else{// 国外
			showBlack = 0;
			$('#addCus_customerName').removeAttr('readonly');
			$('#addCus_save').show();
			$('#addCus_edit').hide();
			$('#addCus_close').show();
			$('#addCus_back').show();
			$('#addCus_nationality').val($('#chkCus_nationality').val());
			$('#addCus_customerType').val(1);
			$('#chkCus_modal').modal('hide');
			$('#modal_detail div[id^="cus_"][id$="_div"]:not(#cus_baseInfo_div)').hide();
			$('#modal_detail').modal('show');
		}
	});

	$("#chkCus_modal").delegate("#chkCus_customerName","keyup",function(event){
		if(event.which == 13){
			$('#chkCus_check').click();
		}
	});
	
	$('#addCus_back').click(function(){
		var nationality = $("#chkCus_nationality").val();
		if(nationality == "1" || nationality == "3"){
			if(cengShow3 == 1){
				$('#modal_detail').modal('hide');
				$('#query_modal').modal('show');
			}else if(cengShow3 == 2){
				$('#modal_detail').modal('hide');
				$('#chkCus_modal').modal('show');
			}else if(cengShow3 == 3){
				$('#modal_detail').modal('hide');
				$('#query_modal').modal('show');
			}
			cengShow3 = 1;
		}else{
			$('#modal_detail').modal('hide');
			$('#chkCus_modal').modal('show');
		}
	});
	
	/** 客户曾用名 */
	var historyName = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00002',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1 && operateShow == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							if($('#addCus_customerType').val() == 1 && operateShow == 0){
								renderStr = '只读状态，不可编辑~';
							}else{
								renderStr = '工商数据源不能操作~';
							}
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '曾用名',
					name : 'usedname',
					data : 'usedname',
					width : '350px'
				}, {
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '历史创建日期',
					name : 'createDate',
					data : 'createDate',
					width : '150px'
				}, {
					targets : 4,
					orderable : true,
					className : 'text-center',
					title : '最后更新日期',
					name : 'updateDate',
					data : 'updateDate',
					width : '150px'
				}]
		};
		BdoDataTables('historyName', tableParam);
	};

	var setHistoryNameData = function(me){
		var record = $('#historyName').DataTable().data()[$(me).closest('tr').index()];
		$('#histroyName_id').val(record.id);
		$('#histroyName_customerId').val(record.customerId);
		$('#histroyName_userbeforename').val(record.usedname);
		
	};
	/** 行按钮 编辑 */
	$('#historyName').on('click', 'button[name="rowEdit"]', function(event){
		$('#histroyName_save').hide();
		$('#histroyName_edit').show();
		$('#histroyName_close').show();
		setHistoryNameData(this);
		$('#histroyName_modal').modal('show');
	});
	
	/** 行按钮 删除 */
	$('#historyName').on('click', 'button[name="rowDelete"]', function(event){
		var record = $('#historyName').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({ 
				id: record.id,
				customerId: record.customerId
			});
		bdoConfirmBox('提示', '是否删除曾用名【'+ record.usedname +'】信息?', function(){
			$.ajax({
				url : 'cusBase/CusNameUsed.deleteNameUsed.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#historyName').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	$("#cus_histroyName_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				historyName(customerId);
			}
		}
	});
	
	/** 客户主要成员 */
	var cusMember = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00003',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1 && operateShow == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							if($('#addCus_customerType').val() == 1 && operateShow == 0){
								renderStr = '只读状态，不可编辑~';
							}else{
								renderStr = '工商数据源不能操作~';
							}
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '成员姓名',
					name : 'membername',
					data : 'membername',
					width : '350px'
				}, {
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '职务',
					name : 'zhiwu',
					data : 'zhiwu',
					width : '150px'
				}]
		};
		BdoDataTables('cusMember', tableParam);
	};
	
	var setCusMemberData = function(me){
		var record = $('#cusMember').DataTable().data()[$(me).closest('tr').index()];
		$('#cusMember_id').val(record.id);
		$('#cusMember_customerId').val(record.customerId);
		$('#cusMember_membername').val(record.membername);
		$('#cusMember_zhiwu').val(record.zhiwu);
		
	};
	/** 行按钮 编辑 */
	$('#cusMember').on('click', 'button[name="rowEdit"]', function(event){
		$('#cusMember_save').hide();
		$('#cusMember_edit').show();
		$('#cusMember_close').show();
		setCusMemberData(this);
		$('#cusMember_modal').modal('show');
	});

	/** 行按钮 删除 */
	$('#cusMember').on('click', 'button[name="rowDelete"]', function(event){
		var record = $('#cusMember').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({ id: record.id });
		bdoConfirmBox('提示', '是否删除成员【'+ record.membername +'】信息?', function(){
			$.ajax({
				url : 'cusBase/CusMember.deleteMember.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#cusMember').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	$("#cus_cusMember_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				cusMember(customerId);
			}
		}
	});
	
	/** ICP备案信息 */
	var IcpInfo = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00004',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1 && operateShow == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							if($('#addCus_customerType').val() == 1 && operateShow == 0){
								renderStr = '只读状态，不可编辑~';
							}else{
								renderStr = '工商数据源不能操作~';
							}
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '网站名称',
					name : 'web',
					data : 'web',
					width : '350px'
				}, {
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '网站域名',
					name : 'website',
					data : 'website',
					width : '150px'
				}, {
					targets : 4,
					orderable : true,
					className : 'text-center',
					title : '许可证号',
					name : 'no',
					data : 'no',
					width : '150px'
				}]
		};
		BdoDataTables('IcpInfo', tableParam);
	};
	
	var setIcpInfoData = function(me){
		var record = $('#IcpInfo').DataTable().data()[$(me).closest('tr').index()];
		$('#IcpInfo_id').val(record.id);
		$('#IcpInfo_customerId').val(record.customerId);
		$('#IcpInfo_web').val(record.web);
		$('#IcpInfo_website').val(record.website);
		$('#IcpInfo_no').val(record.no);
		
	};
	/** 行按钮 编辑 */
	$('#IcpInfo').on('click', 'button[name="rowEdit"]', function(event){
		$('#IcpInfo_save').hide();
		$('#IcpInfo_edit').show();
		$('#IcpInfo_close').show();
		setIcpInfoData(this);
		$('#IcpInfo_modal').modal('show');
	});

	/** 行按钮 删除 */
	$('#IcpInfo').on('click', 'button[name="rowDelete"]', function(event){
		var record = $('#IcpInfo').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({
				id: record.id
			});
		bdoConfirmBox('提示', '是否删除ICP网站【'+ record.web +'】信息?', function(){
			$.ajax({
				url : 'cusBase/CusICP.deleteIcpInfo.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#IcpInfo').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	$("#cus_IcpInfo_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				IcpInfo(customerId);
			}
		}
	});
	
	
	/** 股票信息 */
	var cusStock = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00005',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1 && operateShow == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							if($('#addCus_customerType').val() == 1 && operateShow == 0){
								renderStr = '只读状态，不可编辑~';
							}else{
								renderStr = '工商数据源不能操作~';
							}
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '股票代码',
					name : 'stockcode',
					data : 'stockcode',
					width : '350px'
				}, {
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '股票简称',
					name : 'stockname',
					data : 'stockname',
					width : '150px'
				}, {
					targets : 4,
					orderable : true,
					className : 'text-center',
					title : '上市交易所',
					name : 'bourse',
					data : 'bourse',
					width : '150px'
				}]
		};
		BdoDataTables('cusStock', tableParam);
	};
	
	var setCusStockData = function(me){
		var record = $('#cusStock').DataTable().data()[$(me).closest('tr').index()];
		$('#cusStock_id').val(record.id);
		$('#cusStock_customerId').val(record.customerId);
		$('#cusStock_stockcode').val(record.stockcode);
		$('#cusStock_stockname').val(record.stockname);
		$('#cusStock_bourse').val(record.bourse);
		
	};
	/** 行按钮 编辑 */
	$('#cusStock').on('click', 'button[name="rowEdit"]', function(event){
		$('#cusStock_save').hide();
		$('#cusStock_edit').show();
		$('#cusStock_close').show();
		setCusStockData(this);
		$('#cusStock_modal').modal('show');
	});

	/** 行按钮 删除 */
	$('#cusStock').on('click', 'button[name="rowDelete"]', function(event){
		var record = $('#cusStock').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({
				id: record.id
			});
		bdoConfirmBox('提示', '是否删除股票【'+ record.stockname +'】信息?', function(){
			$.ajax({
				url : 'cusBase/CusStock.deleteCusStock.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#cusStock').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	$("#cus_cusStock_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				cusStock(customerId);
			}
		}
	});
	
	
	/** 债券信息 */
	var cusBond = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00006',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1 && operateShow == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							if($('#addCus_customerType').val() == 1 && operateShow == 0){
								renderStr = '只读状态，不可编辑~';
							}else{
								renderStr = '工商数据源不能操作~';
							}
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '发债日期',
					name : 'bonddate',
					data : 'bonddate',
					width : '150px'
				}, {
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '债券简称',
					name : 'bondname',
					data : 'bondname',
					width : '150px'
				}, {
					targets : 4,
					orderable : true,
					className : 'text-center',
					title : '债券代码',
					name : 'bondcode',
					data : 'bondcode',
					width : '150px'
				}, {
					targets : 5,
					orderable : true,
					className : 'text-center',
					title : '债券类型',
					name : 'bondtype',
					data : 'bondtype',
					width : '150px'
				}]
		};
		BdoDataTables('cusBond', tableParam);
	};
	
	var setCusBondData = function(me){
		var record = $('#cusBond').DataTable().data()[$(me).closest('tr').index()];
		$('#cusBond_id').val(record.id);
		$('#cusBond_customerId').val(record.customerId);
		$('#cusBond_bonddate').val(record.bonddate);
		$('#cusBond_bondname').val(record.bondname);
		$('#cusBond_bondcode').val(record.bondcode);
		$('#cusBond_bondtype').val(record.bondtype);
		
	};
	/** 行按钮 编辑 */
	$('#cusBond').on('click', 'button[name="rowEdit"]', function(event){
		$('#cusBond_save').hide();
		$('#cusBond_edit').show();
		$('#cusBond_close').show();
		setCusBondData(this);
		$('#cusBond_modal').modal('show');
	});

	/** 行按钮 删除 */
	$('#cusBond').on('click', 'button[name="rowDelete"]', function(event){
		var record = $('#cusBond').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({
				id: record.id
			});
		bdoConfirmBox('提示', '是否删除债券【'+ record.bondname +'】信息?', function(){
			$.ajax({
				url : 'cusBase/CusBond.deleteCusBond.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#cusBond').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	
	$("#cus_cusBond_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				cusBond(customerId);
			}
		}
	});
	
	/** 分支机构 */
	var cusBranch = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00007',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				 {
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1 && operateShow == 1){
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							if($('#addCus_customerType').val() == 1 && operateShow == 0){
								renderStr = '只读状态，不可编辑~';
							}else{
								renderStr = '工商数据源不能操作~';
							}
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '分支机构名称',
					name : 'customerName',
					data : 'customerName',
					width : '300px'
				}, {
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '统一社会信用代码',
					name : 'uscc',
					data : 'uscc',
					width : '300px'
				}, {
					targets : 4,
					orderable : true,
					className : 'text-center',
					title : '登记状态',
					name : 'registerState',
					data : 'registerState',
					width : '300px'
				}, {
					targets : 5,
					orderable : true,
					className : 'text-center',
					title : '客户类型',
					name : 'type',
					data : 'type',
					width : '300px'
				}]
		};
		BdoDataTables('cusBranch', tableParam);
	};
	
	/** 行按钮 删除 */
	$('#cusBranch').on('click', 'button[name="rowDelete"]', function(event){
		var record = $('#cusBranch').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({
				id: record.id
			});
		bdoConfirmBox('提示', '是否删分支机构【'+ record.customerName +'】?', function(){
			$.ajax({
				url : 'cusBase/CusBranch.deleteCusBranch.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#cusBranch').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	
	  /** 检索条件设置 */
	var queryBranchFilter = function () {
		var queryFilterArr = [];
		
		if ($('#search_BranchName').val() != '') {
			queryFilterArr.push({
				'field' : 'customerName',
				'sqlIndex' : 'customerName',
				'type' : 'string',
				'value' : $('#search_BranchName').val(),
				'operate' : ''
			});
		}
		
		if ($('#search_BranchType').val() != '') {
			queryFilterArr.push({
				'field' : 'type',
				'sqlIndex' : 'type',
				'type' : 'string',
				'value' : $('#search_BranchType').val(),
				'operate' : ''
			});
		}

		queryFilterArr.push({
			'field' : 'customerType',
			'sqlIndex' : 'customerType',
			'type' : 'string',
			'value' : 1,
			'operate' : 'eq'
		});
		
		return JSON.stringify(queryFilterArr);
	};
	
		/** 分支机构 */
		var tableParamBranch = {
			tabNum : true,
			scrollX : true,
			pageLength : 5,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cpBase/General.queryWithChildDeparts.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00015',
				filter : queryBranchFilter(),
				param1 : $('#addCus_customerId').val()
			},
			tableColumns : [
				 {
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowAdd" data-placement="top" title="添加" data-toggle="tooltip">'
								+ '<i class="fa fa-plus-square"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '客户名称',
					name : 'customerName',
					data : 'customerName',
					width : '300px'
				}, {
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '统一社会信用代码',
					name : 'uscc',
					data : 'uscc',
					width : '300px'
				}, {
					targets : 4,
					orderable : true,
					className : 'text-center',
					title : '登记状态',
					name : 'registerState',
					data : 'registerState',
					width : '300px'
				}, {
					targets : 5,
					orderable : true,
					className : 'text-center',
					title : '客户类型',
					name : 'type',
					data : 'type',
					width : '300px'
				}]
		};
		
	
	
	$("#cus_cusBranch_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				cusBranch(customerId);
			}
		}
	});
	
	$('#cusBranch_add').click(function() {
		tableParamBranch.filterParam.param1 = $('#addCus_customerId').val();
		var id = $(this).closest("div.block.block-bordered").first().attr('id').split('_')[1];
		var state = $('#cus_'+ id +'_toggle').attr("tip");
		if(state != "show"){
			$('#cus_'+ id +'_toggle').click();
		}
		$("#"+ id +"_modal").modal('show');
		BdoDataTables('cusBranchTable', tableParamBranch);
	});	
	
	
	$('#cusBranchTable').on('click', 'button[name="rowAdd"]', function(event){
		var record = $('#cusBranchTable').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				branchCustomerId: record.customerId
			});
		bdoConfirmBox('提示', '是否将客户【'+ record.customerName +'】添加为分支机构?', function(){
			$.ajax({
				url : 'cusBase/CusBranch.addCusBranch.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#cusBranchTable').DataTable().ajax.reload();
						bdoSuccessBox('成功', '添加成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	
	/** 搜索按钮 */
	$('#btn_searchBranch').click(function() {
		tableParamBranch.filterParam.filter = queryBranchFilter();
		$('#cusBranchTable').DataTable().ajax.reload();
	});
	
	/** 重置按钮 */
	$('#btn_clearBranch').click(function() {
		$('#search_BranchName').val(null);
		$('#search_BranchType').val(null);
		tableParamBranch.filterParam.filter = queryBranchFilter();
		$('#cusBranchTable').DataTable().ajax.reload();
	});
	
	
	$('#cusBranch_modal.modal').on('hidden.bs.modal', function (event) {
		$('#cusBranch').DataTable().ajax.reload();
	});
	
	
	
	
	
	
	
	
	
	
	
	
	/** 投资关系 */
	var cusInvestment = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00008',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				{
					targets : 1,
					orderable : true,
					className : 'text-center',
					title : '被投资客户编号',
					name : 'investmentcustomerId',
					data : 'investmentcustomerId',
					width : '250px'
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '股东类型',
					name : 'type',
					data : 'type',
					width : '250px'
				},{
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '持股类型',
					name : 'insto',
					data : 'insto',
					width : '250px'
				}]
		};
		BdoDataTables('cusInvestment', tableParam);
	};
	
	$("#cus_cusInvestment_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				cusInvestment(customerId);
			}
		}
	});
	
	/** 客户类型 */
	var cusType = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00009',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1 && operateShow == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							if($('#addCus_customerType').val() == 1 && operateShow == 0){
								renderStr = '只读状态，不可编辑~';
							}else{
								renderStr = '工商数据源不能操作~';
							}
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '客户类型',
					name : 'customertype',
					data : 'customertype',
					width : '250px'
				},{
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '创建时间',
					name : 'createDate',
					data : 'createDate',
					width : '250px'
				}]
		};
		BdoDataTables('cusType', tableParam);
	};
	
	var setCusTypeData = function(me){
		var record = $('#cusType').DataTable().data()[$(me).closest('tr').index()];
		$('#cusType_id').val(record.id);
		$('#cusType_customerId').val(record.customerId);
		$('#cusType_customertype').val(record.customertype);
		
	};
	/** 行按钮 编辑 */
	$('#cusType').on('click', 'button[name="rowEdit"]', function(event){
		$('#cusType_save').hide();
		$('#cusType_edit').show();
		$('#cusType_close').show();
		setCusTypeData(this);
		$('#cusType_modal').modal('show');
	});

	/** 行按钮 删除 */
	$('#cusType').on('click', 'button[name="rowDelete"]', function(event){
		var record = $('#cusType').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({
				id: record.id
			});
		bdoConfirmBox('提示', '请确认是否删除【' + record.customertype + '】?', function(){
			$.ajax({
				url : 'cusBase/CusType.deleteCusType.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#cusType').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	$("#cus_cusType_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				cusType(customerId);
			}
		}
	});
	
	/** 行业分类 */
	var cusIndustry = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00010',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1 && operateShow == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							if($('#addCus_customerType').val() == 1 && operateShow == 0){
								renderStr = '只读状态，不可编辑~';
							}else{
								renderStr = '工商数据源不能操作~';
							}
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '行业门类',
					name : 'industryclassification',
					data : 'industryclassification',
					width : '200px'
				},{
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '行业门类编码',
					name : 'industryclassificationcode',
					data : 'industryclassificationcode',
					width : '200px'
				},{
					targets : 4,
					orderable : true,
					className : 'text-center',
					title : '行业大类',
					name : 'industrycategory',
					data : 'industrycategory',
					width : '200px'
				},{
					targets : 5,
					orderable : true,
					className : 'text-center',	
					title : '行业大类编码',
					name : 'industrycategorycode',
					data : 'industrycategorycode',
					width : '200px'
				}]
		};
		BdoDataTables('cusIndustry', tableParam);
	};
	
	var setCusIndustryData = function(me){
		var record = $('#cusIndustry').DataTable().data()[$(me).closest('tr').index()];
		$('#cusIndustry_id').val(record.id);
		$('#cusIndustry_customerId').val(record.customerId);
		
		$.ajax({
			url : 'cusBase/Customer.getIndustryValue.json',
			type : 'post',
			data : {
				param1 : record.industryclassification,
				param2 : record.industrycategory
			},
			dataType: 'json',
			async : false,
			success : function(data){
				if(data.success){
					var industryTemp = data.data[0].industryValue;
					$('#cusIndustry_industry').treecombo('setTreeComboValue',[industryTemp,IndustryVal2Nm(industryTemp)]);
				}else{
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			},
			error : function(data){
				bdoErrorBox('失败', data.resultInfo.statusText);

			}
		});
	};
	/** 行按钮 编辑 */
	$('#cusIndustry').on('click', 'button[name="rowEdit"]', function(event){
		$('#cusIndustry_save').hide();
		$('#cusIndustry_edit').show();
		$('#cusIndustry_close').show();
		setCusIndustryData(this);
		$('#cusIndustry_modal').modal('show');
	});

	/** 行按钮 删除 */
	$('#cusIndustry').on('click', 'button[name="rowDelete"]', function(event){
		var record = $('#cusIndustry').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({
				id: record.id
			});
		bdoConfirmBox('提示', '请确认是否删除?', function(){
			$.ajax({
				url : 'cusBase/CusIndustry.deleteCusIndustry.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#cusIndustry').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	$("#cus_cusIndustry_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				cusIndustry(customerId);
			}
		}
	});
	
	/** 资产状况信息(年报) */
	var cusAsset = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00011',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1 && operateShow == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							if($('#addCus_customerType').val() == 1 && operateShow == 0){
								renderStr = '只读状态，不可编辑~';
							}else{
								renderStr = '工商数据源不能操作~';
							}
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '年度',
					name : 'year',
					data : 'year',
					width : '50px'
				},{
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '净利润',
					name : 'netprofits',
					data : 'netprofits',
					width : '200px'
				},{
					targets : 4,
					orderable : true,
					className : 'text-center',
					title : '利润总额',
					name : 'totalprofits',
					data : 'totalprofits',
					width : '200px'
				},{
					targets : 5,
					orderable : true,
					className : 'text-center',
					title : '所有者权益总计',
					name : 'ownerequity',
					data : 'ownerequity',
					width : '200px'
				},{
					targets : 6,
					orderable : true,
					className : 'text-center',
					title : '所有者权益总计',
					name : 'ownerequity',
					data : 'ownerequity',
					width : '200px'
				},{
					targets : 7,
					orderable : true,
					className : 'text-center',
					title : '纳税总额',
					name : 'totaltax',
					data : 'totaltax',
					width : '200px'
				},{
					targets : 8,
					orderable : true,
					className : 'text-center',
					title : '营业总收入',
					name : 'totalrevenue',
					data : 'totalrevenue',
					width : '200px'
				},{
					targets : 9,
					orderable : true,
					className : 'text-center',
					title : '营业总收入中主营业务收入',
					name : 'mainrevenue',
					data : 'mainrevenue',
					width : '250px'
				},{
					targets : 10,
					orderable : true,
					className : 'text-center',
					title : '负债总额',
					name : 'totaldebt',
					data : 'totaldebt',
					width : '200px'
				},{
					targets : 11,
					orderable : true,
					className : 'text-center',
					title : '资产总额',
					name : 'totalasset',
					data : 'totalasset',
					width : '200px'
				},{
					targets : 12,
					orderable : true,
					className : 'text-center',
					title : '币种',
					name : 'curname',
					data : 'curname',
					width : '200px'
				}]
		};
		BdoDataTables('cusAsset', tableParam);
	};
	
	var setCusAssetData = function(me){
		var record = $('#cusAsset').DataTable().data()[$(me).closest('tr').index()];
		$('#cusAsset_id').val(record.id);
		$('#cusAsset_customerId').val(record.customerId);
		$('#cusAsset_year').val(record.year);
		$('#cusAsset_netprofits').val(record.netprofits);
		$('#cusAsset_totalprofits').val(record.totalprofits);
		$('#cusAsset_ownerequity').val(record.ownerequity);
		$('#cusAsset_totaltax').val(record.totaltax);
		$('#cusAsset_totalrevenue').val(record.totalrevenue);
		$('#cusAsset_mainrevenue').val(record.mainrevenue);
		$('#cusAsset_totaldebt').val(record.totaldebt);
		$('#cusAsset_totalasset').val(record.totalasset);
		$('#cusAsset_curname').val(record.curname);
		
	};
	/** 行按钮 编辑 */
	$('#cusAsset').on('click', 'button[name="rowEdit"]', function(event){
		$('#cusAsset_save').hide();
		$('#cusAsset_edit').show();
		$('#cusAsset_close').show();
		setCusAssetData(this);
		$('#cusAsset_modal').modal('show');
	});

	/** 行按钮 删除 */
	$('#cusAsset').on('click', 'button[name="rowDelete"]', function(event){
		var record = $('#cusAsset').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({
				id: record.id
			});
		bdoConfirmBox('提示', '请确认是否删除【' + record.year + '】年报信息?', function(){
			$.ajax({
				url : 'cusBase/CusAsset.deleteAsset.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#cusAsset').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	$("#cus_cusAsset_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				cusAsset(customerId);
			}
		}
	});
	
	/** 主营构成（按产品和服务） */
	var cusComposition = function (customerId){
		var tableParam = {
			tabNum : true,
			scrollX : true,
			pageLength : 10,
			lengthChange : true,
			dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
			//必需
			sourceData : {},
			sourceUrl : 'cusBase/CusGeneral.query.json',
			filterParam : {
				menuId : window.sys_menuId,
				sqlId : 'CU00012',
				filter : '',
				param1 : customerId
			},
			tableColumns : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1 && operateShow == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							if($('#addCus_customerType').val() == 1 && operateShow == 0){
								renderStr = '只读状态，不可编辑~';
							}else{
								renderStr = '工商数据源不能操作~';
							}
						}
						return renderStr;
					}
				},{
					targets : 2,
					orderable : true,
					className : 'text-center',
					title : '年度',
					name : 'year',
					data : 'year',
					width : '80px',
					render : function(data, type, row, meta){
						return DicVal2Nm(data, 'year');
					}
				},{
					targets : 3,
					orderable : true,
					className : 'text-center',
					title : '季度',
					name : 'quarter',
					data : 'quarter',
					width : '80px',
					render : function(data, type, row, meta){
						return DicVal2Nm(data, 'season');
					}
				},{
					targets : 4,
					orderable : true,
					className : 'text-center',
					title : '类型',
					name : 'type',
					data : 'type',
					width : '100px',
					render : function(data, type, row, meta){
						return DicVal2Nm(data, '主营构成（按产品和服务）');
					}
				},{
					targets : 5,
					orderable : true,
					className : 'text-center',
					title : '名称',
					name : 'name',
					data : 'name',
					width : '200px'
				},{
					targets : 6,
					orderable : true,
					className : 'text-center',
					title : '利润比例',
					name : 'profitrate',
					data : 'profitrate',
					width : '100px'
				},{
					targets : 7,
					orderable : true,
					className : 'text-center',
					title : '成本比例',
					name : 'costratio',
					data : 'costratio',
					width : '100px'
				},{
					targets : 8,
					orderable : true,
					className : 'text-center',
					title : '毛利率',
					name : 'grossprofit',
					data : 'grossprofit',
					width : '100px'
				},{
					targets : 9,
					orderable : true,
					className : 'text-center',
					title : '营业成本（元）',
					name : 'operatingcost',
					data : 'operatingcost',
					width : '100px'
				},{
					targets : 10,
					orderable : true,
					className : 'text-center',
					title : '营业收入（元）',
					name : 'revenue',
					data : 'revenue',
					width : '100px'
				}]
		};
		BdoDataTables('cusComposition', tableParam);
	};
	
	
	var setCusCompositionData = function(me){
		var record = $('#cusComposition').DataTable().data()[$(me).closest('tr').index()];
		$('#cusComposition_id').val(record.id);
		$('#cusComposition_customerId').val(record.customerId);
		$('#cusComposition_year').val(record.year);
		$('#cusComposition_quarter').val(record.quarter);
		$('#cusComposition_type').val(record.type);
		$('#cusComposition_name').val(record.name);
		$('#cusComposition_profitrate').val(record.profitrate);
		$('#cusComposition_costratio').val(record.costratio);
		$('#cusComposition_grossprofit').val(record.grossprofit);
		$('#cusComposition_operatingcost').val(record.operatingcost);
		$('#cusComposition_revenue').val(record.revenue);
		
	};
	/** 行按钮 编辑 */
	$('#cusComposition').on('click', 'button[name="rowEdit"]', function(event){
		$('#cusComposition_save').hide();
		$('#cusComposition_edit').show();
		$('#cusComposition_close').show();
		setCusCompositionData(this);
		$('#cusComposition_modal').modal('show');
	});

	/** 行按钮 删除 */
	$('#cusComposition').on('click', 'button[name="rowDelete"]', function(event){
		var record = $('#cusComposition').DataTable().data()[$(this).closest('tr').index()];
		var cusBasicInfo = JSON.stringify({
				id: record.id
			});
		bdoConfirmBox('提示', '请确认是否删除【' + record.year + 
				'年第' + record.quarter + '季度】' +
				'主营构成（按产品和服务）信息?', function(){
			$.ajax({
				url : 'cusBase/CusComposition.deleteComposition.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#cusComposition').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					var obj = $.parseJSON(data);
					bdoErrorBox('失败', obj.resultInfo.statusText);
				}
			});
		});
	});
	
	$("#cus_cusComposition_toggle").click(function(){
		var state = $(this).attr("tip");
		$(this).attr("tip",state == "hide" ? "show" : "hide");
		state = $(this).attr("tip");
		if(state == "show"){
			var customerId = $('#addCus_customerId').val();
			if(customerId != null && customerId != ''){
				cusComposition(customerId);
			}
		}
	});
	
	
	/** 模态框关闭 */
	$('button[name="sub_close"], #addCus_close').click(function() {
		$(this).closest(".modal").modal('hide');
	});	

	$('#query_modal button[name="sub_close"]').click(function() {
		$('#chkCus_modal').modal('show');
	});	
	
	/** 模态框关闭 : 清除表单数据*/
	$('#modal_detail.modal').on('hidden.bs.modal', function (event) {
		$(event.target).find('input, select, textarea').removeAttr('disabled');
  		$(event.target).find('input, select, textarea').val(null);
  		$(event.target).find(':input[isTree]').treecombo('setTreeComboValue',[null, null]);
  		$(event.target).find('[id^="treecombocon"]').remove();
  		$(event.target).find('form td').removeClass('has-error');
  		$(event.target).find('form .help-block').remove();
	});

	/** 模态框关闭 : 清除表单数据*/
	$('#modal_detail.modal').on('hidden.bs.modal', function (event) {
		$('#addCus_save').hide();
		$('#addCus_edit').hide();
		$('#addCus_close').hide();
		$('#addCus_back').hide();
		$('#addCus_industry').parent().find('.caret').show();  
		$('#modal_detail [data-toggle="block-option"][data-action="content_toggle"]').each(function(){
			if($(this).find('i').attr('class') == 'si si-arrow-down'){
				$(this).click();
			}
	    });
	    if(cengShow == 2){
	    	tableParamQuery.filterParam.param1 = $("#chkCus_customerName").val();
			tableParamQuery.filterParam.param2 = $("#chkCus_uscc").val();
	    	BdoDataTables("queryTable",tableParamQuery);
	    	$('#query_modal').modal('show');
	    	cengShow =1;
	    }else if(cengShow == 3){
	    	tableParamQueryByDB.filterParam.param1 = $("#chkCus_customerName").val();
			tableParamQueryByDB.filterParam.param2 = $("#chkCus_uscc").val();

			if($("#chkCus_uscc").val() != null && $("#chkCus_uscc").val() != ''){
	    		tableParamQueryByDB.filterParam.param1 = null;
	    	}
	    	BdoDataTables("queryTableDB",tableParamQueryByDB);
	    	$('#queryTableDB_modal').modal('show');
	    	cengShow =1;
	    }
	});
	
	$('#modal_detail.modal').on('show.bs.modal', function(){
		var length = $('#'+table).DataTable().rows('.selected').data().length;
		var recond = $('#'+table).DataTable().rows('.selected').data()[0];
		if(length > 0 && recond && recond.isblack == 1 && showBlack != 0){
			$('#blackCusTip').addClass('ribbon ribbon-bookmark ribbon-danger ribbon-left');
			$('#blackCusTip').css({
				'background-color': '#291e0e'
			});
			$('#blackCusDiv').show();
		}else{
			$('#blackCusTip').removeClass('ribbon ribbon-bookmark ribbon-danger ribbon-left');
			$('#blackCusTip').css({
				'background-color': '#f3b760'
			});
			$('#blackCusDiv').hide();
		}
		$('#modal_detail [data-toggle="block-option"][data-action="content_toggle"]').each(function(){
			if($(this).find('i').attr('class') == 'si si-arrow-up'){
				$(this).click();
			}
	    });
	    $('#cus_cusInvestment_div').hide();
	    $('#modal_detail #cus_baseInfo_div button[id^="cus_"][id$="_toggle"]').click();
		$('#addCus_nationality, #addCus_customerType').attr('disabled','disabled');
//	   $(event.target).find('select:not(#addCus_nationality), select:not(#addCus_customerType)').attr('disabled','disabled');
	});
	
	/*$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $(this).css('overflow', 'hidden');
	});*/
	
	$('#backbBtn').click(function(e){
		if(operate == 'edit'){
			location.href = url + '&customerId=' + customerIdTemp + '&owncustomerid=' + owncustomerId;
		}else{
			location.href = url;
		}
	});

	$('#newBtn').click(function(e){
		$('#chkCus_modal').modal('show');
	});
	
	$('#modal_detail_close').on('click', function(){
		if(operate == 'view'){
			window.close();
			return;
		}
		if(operate == 'edit'){
			goBack = 1
		}
		if(goBack == 1){
			$.ajax({
				url : 'cusBase/Customer.getCustomerCheckResult.json',
				type : 'post',
				data : {
					param1 : $('#addCus_customerName').val(),
					param2 : $('#addCus_uscc').val(),
					param3 : sys_userId,
					param4 : "1"
				},
				dataType : 'json',
				success : function(data){
					var obj = $.parseJSON(data.data[0].info);
					var customerId = obj.info.customerId;
					if(operate == 'edit'){
						location.href = url + '&customerId=' + customerId + '&owncustomerid=' + owncustomerId;
					}else{
						location.href = url + '&customerId=' + customerId;
					}
				}
			});
		}
	});
	
	if(operate == 'add'){
		$('#btnList').show();
		$('#'+table).on('click', 'button[name="rowAdd"]', function() {
			
			var record = $('#'+table).DataTable().data()[$(this).closest('tr').index()];
			
			var cusName = record.customerName;
			var cusUscc = record.uscc;
			if(cusUscc == null || cusUscc.length <=0){
				cusUscc = record.BPR;
			}
			bdoConfirmBox('提示', '是否添加客户信息?', function(){
				$.ajax({
					url : 'cusBase/Customer.getCustomerCheckResult.json',
					type : 'post',
					data : {
						param1 : cusName,
						param2 : cusUscc,
						param3 : sys_userId,
						param4 : "1"
					},
					dataType : 'json',
					success : function(data){
						var obj = $.parseJSON(data.data[0].info);
						showRowData(obj.info);
						goBack = 1;
						bdoSuccessBox('成功', '新增成功！');
						var type = obj.type;
						var isNew= obj.isNew;
						if(isNew == "true"){
							if(type == "3"){// 3：需要新增
								
							}
						}else{
						
							if(type == "1"){ // 1：无需更新
								bdoSuccessBox('提示', '新增成功！');
								showRowData(obj.info);
							}else if(type == "2"){ // 2：需要更新  
								var resultObj = $.parseJSON(data.data[0].info);
								var usccOrBRP = resultObj.info.uscc;
								if(usccOrBRP == null || usccOrBRP.length <=0){
									usccOrBRP = resultObj.info.BPR;
								}
								bdoConfirmBox('提示', '是否更新客户信息?', function(){
									App.loader('show');
									$.ajax({
										url : 'cusBase/Customer.getCustomerCheckResult.json',
										type : 'post',
										data : {
											param1 : resultObj.info.customerName,
											param2 : usccOrBRP,
											param3 : sys_userId,
											param4 : "2"
										},
										dataType : 'json',
										success : function(data){
											var obj = $.parseJSON(data.data[0].info);
											var result = obj.result;
											if(result == "true"){
												showRowData(obj.info);
												bdoSuccessBox('成功', '新增成功！');
											}else{
												bdoErrorBox('失败', '新增失败！');
											}
											App.loader('hide');
										},
										error : function(data){
											var obj = $.parseJSON(data);
											bdoErrorBox('失败', obj.resultInfo.statusText);
											App.loader('hide');
										}
									});
								});
							}
						}
					}
				});
			});
		});
		$('#chkCus_modal').modal('show');
	}
	
	$('#queryTableDB_back').click(function(e){
		$('#queryTableDB_modal').modal('hide');
		$('#chkCus_modal').modal('show');
	});
	
	$('#queryTableDB_next').click(function(e){
		App.loader('hide');
		queryFun();
	});
	
	$('#queryTable_back').click(function(e){
		if(cengShow2 == 2){
	    	$('#query_modal').modal('hide');
	    	$('#chkCus_modal').modal('show');
	    	cengShow2 = 1;
	    }else{
			$('#query_modal').modal('hide');
			$('#queryTableDB_modal').modal('show');
			cengShow2 = 1;
	    }
		
	});
	
	$('#queryTable_save').click(function(e){
		$('#addCus_save').show();
		$('#addCus_edit').hide();
		$('#addCus_close').show();
		$('#addCus_back').show();
		$('#query_modal').modal('hide');
		$('#addCus_customerName').val($('#chkCus_customerName').val());
		$('#addCus_nationality').val($('#chkCus_nationality').val());
		$('#addCus_customerType').val(1);
		$('#modal_detail div[id^="cus_"][id$="_div"]:not(#cus_baseInfo_div)').hide();
		$('#modal_detail').modal('show');
	});
	
	if(operate == 'edit' || operate == 'view'){
		$('#search-condition-container').hide();
		$('#btn_add').hide();
		$('#search_customerId').val(customerIdTemp);
		tableParam.filterParam.filter = queryFilter();
	}
	
	BdoDataTables(table, tableParam);
	
	/** 行双击 */
	$('#'+table+' tbody').on('dblclick', 'tr', showRowData);
	
	if(operate == 'edit'){
		$('#customerTable').DataTable().ajax.reload(function(){
			var record = $('#'+table).DataTable().rows().data()[0];
			$('#addCus_save').hide();
			$('#addCus_edit').show();
			$('#addCus_close').hide();
			$('#addCus_back').hide();
			$('#modal_detail div[id^="cus_"][id$="_div"]').show();
			setModalData2(record);
			$('#modal_detail').modal('show');
			$('#modal_detail button.btn_add').show();
			operateShow =1;
		});
	}
	
	if(operate == 'view'){
		$('#customerTable').DataTable().ajax.reload(function(){
			var record = $('#'+table).DataTable().rows().data()[0];
			$('#addCus_save').hide();
			$('#addCus_edit').hide();
			$('#addCus_close').hide();
			$('#addCus_back').hide();
			$('#modal_detail div[id^="cus_"][id$="_div"]').show();
			setModalData2(record);
			$('#modal_detail').modal('show');
			$('#modal_detail button.btn_add').hide();
			operateShow =0;
		});
	}
});