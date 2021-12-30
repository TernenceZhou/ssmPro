$(document).ready(function(){
	pageRightTitle(pageTitleArr);
	uiBlocksApi(false, 'init');
	var formId = 'regist_form';
	var table = 'example';

	/*$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $(this).css('overflow', 'hidden');
	});*/
	
	/** 下拉框 获取字典 */
	$('#search_state').html(ComboDicOption(true, '业务登记单状态'));
	$('#search_cooperation').html(ComboDicOption(true, '合作意向'));
	$('#search_incomeAssign').html(ComboDicOption(true, '分配意向'));
	$('#search_businessType').treecombo({
		url : './cpBase/TreeCommon.findAuditTypeTree.json',
		params : {},
		view : {
			folderSelectable : false,
			multiSelect : false
		}
	});
	
	$('#search_departId').treecombo({
		url : './base/TreeCommon.findDepartTree.json',
		params : {},
		view : {
			leafIcon: 'fa fa-building text-flat',    
			nodeIcon: 'fa fa-bank text-primary-light',
			folderSelectable: true,
			multiSelect: false
		}
	});
	$('#search_industry').treecombo({
		url : './cpBase/TreeCommon.findIndustryTree.json',
		params : {},
		view : {
			leafIcon : 'fa fa-building text-flat',
			nodeIcon : 'fa fa-bank text-primary-light',
			folderSelectable : false,
			multiSelect : false
		}
	});

	
	  	/** 检索条件设置 */
	var queryFilter = function () {
		var queryFilterArr = [];
		if ($('#search_state').val() != '') {
			queryFilterArr.push({
				'field' : 'state',
				'sqlIndex' : 'r.state',
				'type' : 'numeric',
				'value' : $('#search_state').val(),
				'operate' : 'eq'
			});
		}
		if ($('#search_departId').val() != '') {
			queryFilterArr.push({
				'field' : 'departId',
				'sqlIndex' : 'r.departId',
				'type' : 'list',
				'value' : $('#search_departId').treecombo('getTreeComboValue'),
				'operate' : 'eq'
			});
		}
		if ($('#search_businessType').val() != '') {
			queryFilterArr.push({
				'field' : 'businessType',
				'sqlIndex' : 'r.businessType',
				'type' : 'string',
				'value' : $('#search_businessType').val(),
				'operate' : 'eq'
			});
		}
		if ($('#search_industry').val() != '') {
			queryFilterArr.push({
				'field' : 'industry',
				'sqlIndex' : 'r.industry',
				'type' : 'string',
				'value' : $('#search_industry').treecombo('getTreeComboValue'),
				'operate' : 'eq'
			});
		}
		if ($('#search_cooperation').val() != '') {
			queryFilterArr.push({
				'field' : 'cooperation',
				'sqlIndex' : 'r.cooperation',
				'type' : 'string',
				'value' : $('#search_cooperation').find("option:selected").text(),
				'operate' : 'eq'
			});
		}
		if ($('#search_incomeAssign').val() != '') {
			queryFilterArr.push({
				'field' : 'incomeAssign',
				'sqlIndex' : 'r.incomeAssign',
				'type' : 'string',
				'value' : $('#search_incomeAssign').find("option:selected").text(),
				'operate' : 'eq'
			});
		}
		if ($('#search_customerName').val() != '') {
			queryFilterArr.push({
				'field' : 'customerName',
				'sqlIndex' : 'customerName',
				'type' : 'string',
				'value' : $('#search_customerName').val(),
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
	//	dom : '<"row"<"col-sm-12"tr>>',
		order : [2, 'desc'],
		//必需
		sourceData : {},
		sourceUrl : 'cpBase/General.queryWithChildDeparts.json',
		filterParam : {
			menuId : window.sys_menuId,
			sqlId : 'CP00010',
			param1 : '1',
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
					renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowLetter" data-placement="top" title="关联合同" data-toggle="tooltip">'
							+ '<i class="fa fa-chain"></i></button>';
					if(row.state == 0) {
						renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
						renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
					} else if(row.state != 2) {
						renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="rowScore" data-placement="top" title="评价" data-toggle="tooltip">'
								+ '<i class="fa fa-star"></i></button>';
					}
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
							+ '<i class="fa fa-eye"></i></button>';
					return renderStr;
				}
			}, {
				targets : 2,
				orderable : true,
				className : 'text-center',
				title : '业务登记单编号',
				name : 'registId',
				data : 'registId',
				width : '150px'
			}, {
				targets : 3,
				orderable : true,
				title : '所属部门',
				name : 'departId',
				data : '__ddepartId',
				width : '200px',
				render : function(data, type, row, meta){
					return row.__ddepartId.topManageDepName + '-' + row.__ddepartId.departName;
				}
			}, {
				targets : 4,
				orderable : true,
				title : '联系人',
				name : 'contract',
				data : 'contract',
				width : '100px'
			}, {
				targets : 5,
				orderable : true,
				title : '联系方式',
				name : 'contractWay',
				data : 'contractWay',
				width : '200px'
			}, {
				targets : 6,
				orderable : true,
				title : '客户名称',
				className : 'text-left',
				name : 'customerName',
				data : 'customerName',
				width : '150px'
			}, {
				targets : 7,
				orderable : true,
				title : '企业性质',
				name : 'customerProperties',
				data : 'customerProperties',
				renderer : 'getDicLabelByVal|公司性质',
				width : '100px'
			}, {
				targets : 8,
				orderable : true,
				title : '业务类型',
				name : 'businessType',
				data : 'businessType',
				width : '100px'
			},{
				targets : 9,
				orderable : true,
				title : '项目周期(天)',
				className : 'text-right',
				name : 'projectPeriod',
				data : 'projectPeriod',
				width : '100px'
			}, {
				targets : 10,
				orderable : true,
				title : '所属行业',
				className : 'text-left',
				renderer : 'industryValue2Name',
				name : 'industry',
				data : 'industry',
				width : '100px',
				render : function(data, type, row, meta){
					return IndustryVal2Nm(data);
				}
			},{
				targets : 11,
				orderable : true,
				title : '合作意向',
				name : 'cooperation',
				data : 'cooperation',
				renderer : 'getDicLabelByVal|合作意向',
				width : '100px'
			},{
				targets : 12,
				orderable : true,
				title : '合同涉及金额',
				className : 'text-right',
				name : 'projectCost',
				data : 'projectCost',
				width : '100px',
				render: function(data, type, row, meta){
					return accounting.formatMoney(data, "￥", 2, ",", "."); //--- http://www.jq22.com/yanshi326
				}
			}, {
				targets : 13,
				orderable : true,
				title : '工作地点',
				className : 'text-left',
				name : 'workingPlace',
				data : 'workingPlace',
				width : '200px'
			}, {
				targets : 14,
				orderable : true,
				title : '关联合作方',
				name : 'cooperatorId',
				data : '__ucooperatorId',
				width : '100px',
				render : function(data, type, row, meta){
					if(!data) {
						return '';
					}
					return '<span data-toggle="tooltip" title="电话: ' + data.phone
							+ '\n手机: ' + data.mobilePhone + '\n邮箱: ' + data.email
							+ '">' + data.userName + '</span>';
				}
			}, {
				targets : 15,
				orderable : true,
				title : '状态',
				renderer : 'getDicLabelByVal|业务登记单状态',
				name : 'state',
				data : 'state',
				width : '100px',
				render : function(data, type, row, meta){
					return DicVal2Nm(data, '业务登记单状态');
				}
			}, {
				targets : 16,
				orderable : true,
				title : '合作确认人',
				name : 'confirmUserId',
				data : '__uconfirmUserId',
				width : '100px',
				render : function(data, type, row, meta){
					if(!data) {
						return '';
					}
					return '<span data-toggle="tooltip" title="电话: ' + data.phone
							+ '\n手机: ' + data.mobilePhone + '\n邮箱: ' + data.email
							+ '">' + data.userName + '</span>';
				}
			}, {
				targets : 17,
				orderable : true,
				title : '合作评分',
				className : 'text-left',
				name : 'evaluateScore',
				data : 'evaluateScore',
				width : '100px',
				render : function(data, type, row, meta){
					if(data){
						var $ratingEl = $('<div></div>');
			            $ratingEl.raty({
							score: data,
							number: 5,
							readOnly : true,
							hints : false,
							halfShow :true,
				            starHalf: 'fa fa-fw fa-star-half-o text-warning',
				            starOn:'fa fa-fw fa-star text-warning'
			            });
						return $ratingEl.html();
					}else{
						return data;
					}
				}
			}, {
				targets : 18,
				orderable : true,
				title : '合作评价备注',
				className : 'text-left',
				name : 'evaluateMemo',
				data : 'evaluateMemo',
				width : '200px',
				render : function(data, type, row, meta){
					if(data){
						return '<span data-toggle="tooltip" title="' + data+ '">' + data + '</span>';
					}
					return null;
				}
			}]
	};
	
	/** table */
	BdoDataTables(table, tableParam);
	
	var showRowData = function(event){
		$('form textarea').attr('disabled', 'disabled');
		$('form input').attr('disabled', 'disabled');
		$('form select').attr('disabled', 'disabled');
		$('#'+formId+'_'+ 'submit_projectPeriod').attr('disabled', 'disabled');
		$('#'+formId+'_'+ 'sub_save').hide();
		$('#addTable').hide();
		setModalData(formId,table,this);
		$('#addTable').closest('tr').show();
		$('form table table button').attr('disabled', 'disabled');
		$('form table table input').attr('disabled', 'disabled');
		$('#regist_modal').modal('show');
	};
	
	/** 行双击 */
	$('#'+table+' tbody').on('dblclick', 'tr', showRowData);

	/** 行按钮 查看 */
	$('#'+table).on('click', 'button[name="rowView"]', showRowData);

	/** 行按钮 编辑 */
	$('#'+table).on('click', 'button[name="rowEdit"]', function() {
		$('#'+formId+'_'+ 'submit_projectPeriod').attr('disabled', 'disabled');
		$('#'+formId+'_'+ 'sub_save').show();
		setModalData(formId,table,this);
		$('#addTable').show();
		$('#teamTable').on('click', 'button[name="delTeam"]', function() {
				$(this).closest('tr').remove();
		});
		$('#regist_modal').modal('show');
	});
	
	$('#register_tp').html(ComboDicOption(false, '合同来源'));
	/** 行按钮 关联合同 */
	$('#'+table).on('click', 'button[name="rowLetter"]', function() {
		var object = $('#'+table).DataTable().data()[$(this).closest('tr').index()];
		$('#register_id').val(object.registId);
		$('#register_tp').val('审计');
		$('#register_register').val('0');
		$('#register_finance').val('0');
		$('#modal-letter').modal('show');
	});

	$('#register_link').on('click', function(){
		$.ajax({
			url : 'cpShare/CoopRegist.registerLink.json',
			type : 'post',
			data : {
				param1 : $('#register_id').val(),
				param2 : $('#register_no').val(),
				param3 : $('#register_tp').val(),
				param4 : '0',
				param5 : $('#register_register').val(),
				param6 : $('#register_finance').val()
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#modal-letter').modal('hide');
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});

	$('#regist_form').on('click', 'a[name="registerUnlink"]', function(){
		var num = $(this).closest('tr').find('td').eq(2).html();
		var type = $(this).closest('tr').find('td').eq(1).html();
		bdoConfirmBox('', '确定解除关联此合同吗?', function(){
			$.ajax({
				url : 'cpShare/CoopRegist.registerUnlink.json',
				type : 'post',
				data : {
					param1 : $('#'+formId+'_'+ 'submit_registId').val(),
					param2 : num,
					param3 : type
				},
				dataType : 'json',
				success : function(data){
					registerInfoGet($('#'+formId+'_'+ 'submit_registId').val(), formId + '_submit_register');
					financeTransfer($('#'+formId+'_'+ 'submit_registId').val(), formId + '_submit_transfer');
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	$('#regist_form').on('click', 'a[name="registerMoney"]', function(){
		var num = $(this).closest('tr').find('td').eq(2).html();
		var type = $(this).closest('tr').find('td').eq(1).html();
		$.ajax({
			url : 'cpShare/CoopRegist.registerMoney.json',
			type : 'post',
			data : {
				param1 : $('#'+formId+'_'+ 'submit_registId').val(),
				param2 : num,
				param3 : type
			},
			dataType : 'json',
			success : function(data){
				registerInfoGet($('#'+formId+'_'+ 'submit_registId').val(), formId + '_submit_register');
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
	$('#regist_form').on('click', 'a[name="financeMoney"]', function(){
		var num = $(this).closest('tr').find('td').eq(2).html();
		var type = $(this).closest('tr').find('td').eq(1).html();
		$.ajax({
			url : 'cpShare/CoopRegist.financeMoney.json',
			type : 'post',
			data : {
				param1 : $('#'+formId+'_'+ 'submit_registId').val(),
				param2 : num,
				param3 : type
			},
			dataType : 'json',
			success : function(data){
				registerInfoGet($('#'+formId+'_'+ 'submit_registId').val(), formId + '_submit_register');
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
	
	/** 行按钮 删除 */
	$('#'+table).on('click', 'button[name="rowDelete"]', function() {
		var object = $('#'+table).DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('删除', '确定删除此业务登记单吗？', function() {
			$.ajax({
				type : 'post',
				url : 'cpShare/CoopRegist.registDelete.json',
				data : {
					param1 : object.registId
				},
				dataType : 'json',
				success : function(data) {
					$('#'+table).DataTable().ajax.reload();
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	/** 导出 */
	$('#btn_export').click(function() {
		exportExcel(this, '业务提供一览', tableParam, table);
	});
	
	/** 搜索按钮 */
	$('#btn_search').click(function() {
		tableParam.filterParam.filter = queryFilter();
		$('#'+table).DataTable().ajax.reload();
	});
	
	/** 重置按钮 */
	$('#btn_clear').click(function() {
		$('#search_state').val(null);
		$('#search_departId').treecombo('setTreeComboValue',[null, null]);
		$('#search_businessType').treecombo('setTreeComboValue',[null, null]);
		$('#search_industry').treecombo('setTreeComboValue',[null, null]);
		$('#search_cooperation').val(null);
		$('#search_incomeAssign').val(null);
		$('#search_customerName').val('');
		tableParam.filterParam.filter = queryFilter();
		$('#'+table).DataTable().ajax.reload();
	});
	
	
	/** 新增 */
	$('#btn_add').click(function() {
		$('#'+formId+'_'+ 'sub_save').show();
		var departNmText = companyNmSession + '-' + departNmSession;
		$('#'+formId+'_'+ 'submit_departId').treecombo('setTreeComboValue',[departIdSession,departNmText]);
		$('#'+formId+'_'+ 'submit_partnerId').treecombo('setTreeComboValue',[sys_userId,selfNm]);
		$('#'+formId+'_'+ 'submit_projectPeriod').attr('disabled', 'disabled');
		$('#addTable').show();
		$('#addTable').closest('tr').show();
		var cooperateTeam = '<table style="width: 735px;" class="table table-bordered" id="teamTable">';
		cooperateTeam += '<tr><th width="50px">处理</th>';
		cooperateTeam += '<th width="214px">所属部门</th>';
		cooperateTeam += '<th width="97px">薪酬级别</th>';
		cooperateTeam += '<th width="60px">时薪</th>';
		cooperateTeam += '<th width="150px">人数</th></tr>';
		cooperateTeam += '</table>';
		$('#'+formId+'_'+ 'submit_cooperateTeam').html(cooperateTeam);
		$('#regist_modal').modal('show');
	});

	/**
	 * 模态框数据 加载
	 */
	var setModalData = function(formId, table, me){
		var record = $('#'+ table).DataTable().data()[$(me).closest('tr').index()];
		$('#'+formId+'_'+ 'submit_registId').val(record.registId);
		$('#'+formId+'_'+ 'submit_businessId').val(record.businessId);
		var departNmText = companyNmSession + '-' + departNmSession;
		$('#'+formId+'_'+ 'submit_departId').treecombo('setTreeComboValue',[departIdSession,departNmText]);
		$('#'+formId+'_'+ 'submit_partnerId').treecombo('setTreeComboValue',[sys_userId,selfNm]);
		$('#'+formId+'_'+ 'submit_contract').val(record.contract);
		$('#'+formId+'_'+ 'submit_contractWay').val(record.contractWay);
		$('#'+formId+'_'+ 'submit_businessType').treecombo('setTreeComboValue',[record.businessType,record.businessType]);
		$('#'+formId+'_'+ 'submit_customerName').val(record.customerName);
		$('#'+formId+'_'+ 'submit_customerProperties').val(record.customerProperties);
		$('#'+formId+'_'+ 'submit_packageNum').val(record.packageNum);
		$('#'+formId+'_'+ 'submit_industry').treecombo('setTreeComboValue',[record.industry,IndustryVal2Nm(record.industry)]);
		$('#'+formId+'_'+ 'submit_workingPlace').val(record.workingPlace);
		$('#'+formId+'_'+ 'submit_projectStart').val(record.projectStart);
		$('#'+formId+'_'+ 'submit_projectEnd').val(record.projectEnd);
		$('#'+formId+'_'+ 'submit_projectPeriod').val(record.projectPeriod);
		$('#'+formId+'_'+ 'submit_projectCost').val(record.projectCost);
		$('#'+formId+'_'+ 'submit_cooperation').val(record.cooperation);
		$('#'+formId+'_'+ 'submit_cooperatorId').treecombo('setTreeComboValue',[record.__ucooperatorId.userId,record.__ucooperatorId.userName]);
		registTeamShow(record.__ucooperatorId.userId,record.__ucooperatorId.userName);
		$('#'+formId+'_'+ 'submit_incomeAssign').val(record.incomeAssign);
		$('#'+formId+'_'+ 'submit_incomeAssignOther').val(record.incomeAssignOther);
		$('#'+formId+'_'+ 'submit_memo').val(record.memo);
		$('#'+formId+'_'+ 'submit_remark1').val(record.remark1);
		$('#'+formId+'_'+ 'submit_remark2').val(record.remark2);
		registerInfoGet(record.registId, formId + '_submit_register');
		financeTransfer(record.registId, formId + '_submit_transfer');
		registTeamData(record.registId, formId + '_submit_cooperateTeam');
	};
	
	createRedistForm(formId,table);

	
	$('#eva_form').formview({
		display : 'tableform-one',
		column : 4,
		buttons : [
			{
				id : 'eva_save',
				icon : 'fa-star',
				style : 'btn-primary',
				text : '评价'
			},
			{
				id : 'eva_close',
				icon : 'fa-sign-out',
				style : 'btn-css1 btn-warning',
				text : '关闭'
			}
		],
		items : [
			{
				id : 'eva_registId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				cellType : 'th',
				html : '合作满意度'
			},{
				id : 'eva_score',
				type : 'div',
				plugin : {
					name : 'raty',
					options :{
						score: 0,
		                number: 5,
		                half: true,
		                cancel: false,
		                target: false,
		                targetScore: false,
		                precision: false,
		                cancelOff: 'fa fa-fw fa-times text-danger',
		                cancelOn: 'fa fa-fw fa-times',
		                starHalf: 'fa fa-fw fa-star-half-o text-warning',
		                starOff: 'fa fa-fw fa-star text-gray',
		                starOn:'fa fa-fw fa-star text-warning',
		                click: function(score, evt) {
//		                	var parent = $(evt.target).parent();
//		                	parent.removeAttr('name');
//		                	parent.find('input[name="score"]')
//		                		.removeAttr('disabled')
//		                		.attr('readonly','readonly')
//		                		.attr('type','text')
//		                		.attr('name',parent.attr('id'));
		                }
					}
				}
			},{
				cellType : 'th',
				html : '备注',
				rowspan : 1
			},{
				id : 'eva_memo',
				type : 'textarea',
				typeAttr: {
					placeholder: '选填',
					rows : 3
				},
				colspan : 3
			}
		]
	});
	
	/** 模态框 评分 */
	$('#eva_save').click(function(){
		
		var evaUrl ='cpShare/CoopRegist.evaluateEdit.json';
		var data = {
			param1 : $('#eva_registId').val(),
			param2 : $('#eva_score').raty('score'),
			param3 : $('#eva_memo').val()
		};
		$('#eva_form').formview(
			'setAjaxConf',
			[
				evaUrl,
				data,
				'json',
				true,
				function(data) {
					$('#'+table).DataTable().ajax.reload();
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#eva_modal').modal('hide');
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			]
		);
		$('#eva_form').submit();
		
	});

	var setEvaModalData = function(record){
		$('#eva_registId').val(record.registId);
		$('#eva_score').raty('score',record.evaluateScore);
		$('#eva_memo').removeAttr('disabled').val(record.evaluateMemo);
	};
	
	/** 行按钮 评价 */
	$('#'+table).on( 'click', 'button[name="rowScore"]', function() {
		$('#eva_save').show();
		setEvaModalData($('#'+table).DataTable().data()[$(this).closest('tr').index()]);
		$('#eva_modal').modal('show');
	});
	
	/** 模态框关闭 */
	$('button[name="eva_close"], #eva_close').click(function() {
		$('#eva_modal').modal('hide');
	});	
	
	/** 合作团队模态框数据加载 */
	$('#modal-team').on('shown.bs.modal', function(){
		
		$('#search_teamDepartId').treecombo({
			url : './base/TreeCommon.findDepartTree.json',
			params : {},
			view : {
				leafIcon: 'fa fa-building text-flat',    
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: true,
				multiSelect: false
			}
		});
		
		/** 检索条件设置 */
		var teamQueryFilter = function () {
			var queryFilterArr = [];
			if ($('#search_teamDepartId').val() != '') {
				queryFilterArr.push({
					'type' : 'list',
					'value' : $('#search_teamDepartId').treecombo('getTreeComboValue'),
					'operate' : 'eq'
				});
			}
			return JSON.stringify(queryFilterArr);
		};
		
		$('#btn_teamSearch').off('click');
			
		/** 搜索按钮 */
		$('#btn_teamSearch').click(function() {
			tableTeamParam.filterParam.filter = teamQueryFilter();
			tableTeamParam.sourceUrl = 'cpShare/CoopRegist.searchResetBtn.json';
			$('#teamCooperate').DataTable().ajax.reload();
		});
		
		$('#btn_teamClear').off('click');
		
			/** 重置按钮 */
		$('#btn_teamClear').click(function() {
			$('#search_teamDepartId').treecombo('setTreeComboValue',[null, null]);
			tableTeamParam.filterParam.filter = teamQueryFilter();
			tableTeamParam.sourceUrl = 'cpShare/CoopRegist.searchResetBtn.json';
			$('#teamCooperate').DataTable().ajax.reload();
		});
		
		var partnerId = $("#regist_form_submit_cooperatorId").attr("data-result");
		
		var tableTeamParam = {
			tabNum : false,
			scrollX : true,
			lengthChange : false,
			pageLength : 1000,
			dom : '<"row"<"col-sm-12"tr>>',
			order : [2, 'desc'],
			//必需
			sourceData : {},
			sourceUrl : 'cpShare/CoopRegist.collaborativeTeam.json',
			filterParam : {
				param1 : partnerId,
				menuId : window.sys_menuId,
				filter : teamQueryFilter()
			},
			tableColumns : [
				{	
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '<input type="checkbox" id="selectAll" />',
					width : '120px',
					render : function(data, type, row, meta){
						var checkBox = '';
						checkBox +='<input type="checkbox" name="checkAdd" />';
						return checkBox;
					}
				}, {
					targets : 2,
					orderable : true,
					title : '所属部门',
					name : 'autoid',
					data : '__ddepartId',
					width : '200px',
					render : function(data, type, row, meta){
						return row.__ddepartId.topManageDepName + '-' + row.__ddepartId.departName;
					}
				}, {
					targets : 3,
					orderable : true,
					title : '薪酬级别',
					name : 'sRole',
					data : 'sRole',
					width : '150px'
				},{
					targets : 4,
					orderable : true,
					title : '时薪',
					name : 'hourlyWage',
					data : 'hourlyWage',
					width : '150px'
			}]
		};
		BdoDataTables('teamCooperate', tableTeamParam);
		
		$('#selectAll').click(function() {
			 var checklist = document.getElementsByName ("checkAdd");   
			 if(document.getElementById("selectAll").checked){
			 	for(var i=0;i<checklist.length;i++){
			    	checklist[i].checked = 1;
			    } 
			 }else{
			    for(var j=0;j<checklist.length;j++){
			        checklist[j].checked = 0;
			    }
			 }
		});
		
		$('#teamCooperate').unbind();
		
		$('#teamClose').click(function() {
			$('#modal-team').modal('hide');
		});
		
		$('#teamTable').unbind();
		
		/** 合作团队行按钮 删除 */
		$('#teamTable').on('click', 'button[name="delTeam"]', function() {
			$(this).closest('tr').remove();
		});
		
		$('#teamAdd').off('click');
		
		$('#teamAdd').click(function() {
			if(document.getElementById("teamTable") == null){
				var cooperateTeam = '<table style="width: 735px;" class="table table-bordered" id="teamTable">';
				cooperateTeam += '<tr><th width="50px">处理</th>';
				cooperateTeam += '<th width="214px">所属部门</th>';
				cooperateTeam += '<th width="157px">薪酬级别</th>';
				cooperateTeam += '<th width="100px">时薪</th>';
				cooperateTeam += '<th width="50px">人数</th></tr>';
				cooperateTeam += '</table>';
				$('#'+formId+'_'+ 'submit_cooperateTeam').html(cooperateTeam);
			}
			var flg;
			$('input[name="checkAdd"]:checked').each(function(){
				var object = $('#teamCooperate').DataTable().data()[$(this).closest('tr').index()];
				var trList = $("#teamTable").find("tr");
				for(var i = 1; i < trList.length; i++){
					var teamData = {} ;
					var tdArr = trList.eq(i).find("td");
					teamData.payBand = tdArr.eq(2).find('input').val();
					teamData.hourlyWage = tdArr.eq(3).find('input').val();
					if(teamData.payBand ==  object.sRole && teamData.hourlyWage == object.hourlyWage){
						flg = 1;
						bdoErrorBox('失败', "已添加该合作团队信息");
						return;
					}
				}
				if(flg != 1){
					formdataSet(object);
				}
			});
		});
	});
	
	$('#addTable').off('click');
	
	$('#addTable').click(function() {
		if ($("#regist_form_submit_cooperatorId").attr("data-result")) {
			$('#modal-team').modal('show');
		} else {
			bdoErrorBox('失败', "请填写合作联合方信息");
		}
	});

	function formdataSet(object){
		var addTable = '<tr><td class="text-center"><div class="form-material"><button class="btn btn-xs btn-danger" type="button" name="delTeam" data-placement="top" title="删除" data-toggle="tooltip">'
		 	+ '<i class="fa fa-times"></i></button></div></td>';
		addTable += '<td><div class="form-material"><input class="form-control" type="text" ' +
				'value="'+ object.__ddepartId.topManageDepName + '-' + object.__ddepartId.departName +'" ' +
				'name="'+ object.__ddepartId.departId +'" disabled /></div></td>';
		addTable += '<td><div class="form-material"><input class="form-control" type="text" value="'+ object.sRole +'"  disabled /></div></td>';
		addTable += '<td><div class="form-material"><input class="form-control" type="text" value="'+ object.hourlyWage +'" disabled /></div></td>';
		addTable += '<td><div class="has-success"><div class="form-material"><input class="form-control" type="number" min="1" /></div></div></td></tr>';
		$('#teamTable').append(addTable);
		$('#modal-team').modal('hide');
	}
});