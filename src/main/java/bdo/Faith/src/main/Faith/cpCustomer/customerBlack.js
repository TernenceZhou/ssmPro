$(document).ready(function(){
	pageRightTitle(pageTitleArr);
	uiBlocksApi(false, 'init');
	var formId = 'customer_form';
	var table = 'customerTable';
//	var parentRecond = $('#'+table).DataTable().rows('.selected').data()[0];
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
		
		if ($('#search_isBlack').val() != '') {
			queryFilterArr.push({
				'field' : 'isblack',
				'sqlIndex' : 'isblack',
				'type' : 'string',
				'value' : $('#search_isBlack').val(),
				'operate' : ''
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
			sqlId : 'CU00016',
			filter : queryFilter()
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
					var styleCls = ''; 
					var styleClsBtn = ''; 
					var title = ''; 
					if(row.isblack == 1) {
						styleClsBtn = 'btn-danger';
						styleCls = 'fa-credit-card-alt'; 
						title = '移出黑名单';
					}else{
						styleClsBtn = 'btn-info';
						styleCls = 'fa-credit-card'; 
						title = '列入黑名单';
					}
					renderStr += '<button class="btn btn-xs '+styleClsBtn+' table-btn-operate" type="button" name="rowChange" data-placement="top" title="'+ title +'" data-toggle="tooltip">'
							+ '<i class="fa '+ styleCls +'"></i></button>';
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
								+ '<i class="fa fa-eye"></i></button>';
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
	
	/** table */
	BdoDataTables(table, tableParam);
	
	$('#'+table).on('click', 'button[name="rowChange"]', function() {
		var record = $('#'+table).DataTable().data()[$(this).closest('tr').index()];
		var title = '';
		if(record.isblack == 1) {
			title = '移出黑名单';
		}else{
			title = '列入黑名单';
		}
		bdoConfirmBox('提示', '是否将【' + record.customerName + '】'+ title +'?', function(){
			$.ajax({
				url : 'cusBase/Customer.changeBlackState.json',
				type : 'post',
				data : {
					param1 : record.customerId
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#'+table).DataTable().ajax.reload();
						bdoSuccessBox('成功', '设置成功！');
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
		
	/** 导出 */
	$('#btn_export').click(function() {
		exportExcel(this, '客户黑名单信息一览', tableParam, table);
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
		$('#search_isBlack').val(null);
		tableParam.filterParam.filter = queryFilter();
		$('#'+table).DataTable().ajax.reload();
	});
	
	
	var showRowData = function(data){
		$('#customer_form textarea').attr('disabled', 'disabled');
		$('#customer_form input').attr('disabled', 'disabled');
		$('#addCus_industry').parent().find('.caret').hide();  
		$('#customer_form select').attr('disabled', 'disabled');
		$('#modal_detail div[id^="cus_"][id$="_div"]').show();
		setModalData("addCus",table,this);
		$('#modal_detail').modal('show');
	};
	
	/** 行双击 */
	$('#'+table+' tbody').on('dblclick', 'tr', showRowData);

	/** 行按钮 查看 */
	$('#'+table).on('click', 'button[name="rowView"]', showRowData);
	
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
	
	$('#customer_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [],
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
				type : 'input',
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
					visible : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
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
					visible : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
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
					visible : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
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
					visible : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
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
					visible : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
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
					visible : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
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
					visible : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
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
					visible : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
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
					visible : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
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
					visible : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '180px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if($('#addCus_customerType').val() == 1){
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}else{
							renderStr = '工商数据源不能操作~';
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
	
	$('button[name="sub_close"]').click(function() {
		$(this).closest(".modal").modal('hide');
	});	

	/** 模态框关闭 : 清除表单数据*/
	$('#customer_modal.modal, #modal_detail.modal').on('hidden.bs.modal', function (event) {
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
	});
	
	$('#modal_detail.modal').on('show.bs.modal', function(){
		var length = $('#'+table).DataTable().rows('.selected').data().length;
		var recond = $('#'+table).DataTable().rows('.selected').data()[0];
		if(length > 0 && recond && recond.isblack == 1){
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
	});
	
	/*$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $(this).css('overflow', 'hidden');
	});*/
	
	$('#modal_detail.modal button[class="btn_add"]').hide();
});