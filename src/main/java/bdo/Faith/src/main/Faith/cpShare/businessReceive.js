$(document).ready(function(){
	pageRightTitle(pageTitleArr);
	uiBlocksApi(false, 'init');
	
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
	$('#register_tp').html(ComboDicOption(false, '合同来源'));
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
	var queryFilter = function queryFilter() {
		var queryFilterArr = [];
		if ($('#search_state').val() != '') {
			queryFilterArr.push({
				'field' : 'state',
				'sqlIndex' : 'r.state',
				'type' : 'string',
				'value' : $('#search_state').val(),
				'operate' : ''
			});
		}
		if ($('#search_departId').val() != '') {
			queryFilterArr.push({
				'field' : 'departId',
				'sqlIndex' : 'r.departId',
				'type' : 'list',
				'value' : $('#search_departId').treecombo('getTreeComboValue'),
				'operate' : ''
			});
		}
		if ($('#search_businessType').val() != '') {
			queryFilterArr.push({
				'field' : 'businessType',
				'sqlIndex' : 'r.businessType',
				'type' : 'string',
				'value' : $('#search_businessType').val(),
				'operate' : ''
			});
		}
		if ($('#search_industry').val() != '') {
			queryFilterArr.push({
				'field' : 'industry',
				'sqlIndex' : 'r.industry',
				'type' : 'string',
				'value' : $('#search_industry').treecombo('getTreeComboValue'),
				'operate' : ''
			});
		}
		if ($('#search_cooperation').val() != '') {
			queryFilterArr.push({
				'field' : 'cooperation',
				'sqlIndex' : 'r.cooperation',
				'type' : 'string',
				'value' : $('#search_cooperation').find("option:selected").text(),
				'operate' : ''
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
			param2 : '2',
			filter : queryFilter()
		},
		tableColumns : [
			{
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '处理',
				data : null,
				width : '100px',
				render : function(data, type, row, meta) {
					var renderStr = '';
					renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowLetter" data-placement="top" title="关联合同" data-toggle="tooltip">'
						+ '<i class="fa fa-chain"></i></button>';
					if(row.state == 0){	// 合作
						renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowCoop" data-placement="top" title="确认合作 " data-toggle="tooltip">'
							+ '<i class="fa fa-check"></i></button>';
					}// 查看
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowView" data-placement="top" title="查看 " data-toggle="tooltip">'
						+ '<i class="fa fa-eye"></i></button>';
					return renderStr;
				}
			},{
				targets : 2,
				orderable : true,
				className : 'text-center',
				title : '业务登记单编号',
				name : 'registId',
				data : 'registId',
				width : '150px'
			},{
				targets : 3,
				orderable : true,
				title : '所属部门',
				name : 'departId',
				data : '__ddepartId.departName',
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
				renderer : 'getDicLabelByVal|公司性质',
				name : 'customerProperties',
				data : 'customerProperties',
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
				renderer : 'getDicLabelByVal|合作意向',
				name : 'cooperation',
				data : 'cooperation',
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
	BdoDataTables( 'example', tableParam);

	var showRowData = function(event){
		$('form textarea').attr('disabled', 'disabled');
		$('form input').attr('disabled', 'disabled');
		$('form select').attr('disabled', 'disabled');
		var formId = 'regist_form';
		$('#addTable').hide();
		setModalData(formId, 'example',this);
		$('form table table button').attr('disabled', 'disabled');
		$('form table table input').attr('disabled', 'disabled');
		var btnNm = event.currentTarget.name;
		$('#'+formId+'_'+'sub_save').unbind();
		$('#'+formId+'_'+'sub_save').attr('id',formId+'_'+'sub_coop');
		$('#'+formId+'_'+'sub_coop').find('span').html('确认合作');
		$('#'+formId+'_'+'sub_coop').find('i').removeClass('fa-floppy-o').addClass('fa-link');
		if(btnNm == 'rowCoop'){
			$('#'+formId+'_'+'sub_coop').show();
		}else if(btnNm == 'rowView'){
			$('#'+formId+'_'+'sub_coop').hide();
		}
		
		/** 模态框 确认合作 */
		$('#'+formId+'_'+'sub_coop').click(function(){
			$.ajax({
				type : 'post',
				url : 'cpShare/CoopRegist.coopAdd.json',
				data : {
					param1 : $('#'+formId+'_'+'submit_registId').val()
				},
				dataType : 'json',
				success : function(data) {
					$('#'+formId+'_'+'sub_save').unbind();
					$('#example').DataTable().ajax.reload();
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#regist_modal').modal('hide');
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	
		$('#regist_modal').modal('show');
	};
    
	/** 行双击 */
	$('#example tbody').on('dblclick', 'tr', showRowData);

	/** 行按钮 查看 */
	$('#example').on('click', 'button[name="rowView"],button[name="rowCoop"]', showRowData);

	/** 行按钮 关联合同 */
	$('#example').on('click', 'button[name="rowLetter"]', function() {
		var object = $('#example').DataTable().data()[$(this).closest('tr').index()];
		$('#register_id').val(object.registId);
		$('#register_tp').val('审计');
		$('#register_register').val('0');
		$('#register_finance').val('0');
		$('#modal-letter').modal('show');
	});
	
	/** 搜索按钮 */
	$('#btn_search').click(function() {
		tableParam.filterParam.filter = queryFilter();
		$('#example').DataTable().ajax.reload();
	});
	
	/** 导出 */
	$('#btn_export').click(function() {
		exportExcel(this, '业务接收一览', tableParam, 'example');
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
		$('#example').DataTable().ajax.reload();
	});
	
	$('#register_link').on('click', function(){
		$.ajax({
			url : 'cpShare/CoopRegist.registerLink.json',
			type : 'post',
			data : {
				param1 : $('#register_id').val(),
				param2 : $('#register_no').val(),
				param3 : $('#register_tp').val(),
				param4 : '1',
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
					param1 : $('#regist_form_submit_registId').val(),
					param2 : num,
					param3 : type
				},
				dataType : 'json',
				success : function(data){
					registerInfoGet($('#regist_form_submit_registId').val(), 'regist_form_submit_register');
					financeTransfer($('#regist_form_submit_registId').val(), 'regist_form_submit_transfer');
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
				param1 : $('#regist_form_submit_registId').val(),
				param2 : num,
				param3 : type
			},
			dataType : 'json',
			success : function(data){
				registerInfoGet($('#regist_form_submit_registId').val(), 'regist_form_submit_register');
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
				param1 : $('#regist_form_submit_registId').val(),
				param2 : num,
				param3 : type
			},
			dataType : 'json',
			success : function(data){
				registerInfoGet($('#regist_form_submit_registId').val(), 'regist_form_submit_register');
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
	
	/**
	 * 模态框数据 加载
	 */
	var setModalData = function(formId, table, me){
		var record = $('#'+ table).DataTable().data()[$(me).closest('tr').index()];
		var departId = record.__ddepartId.departId; 
		var departNm = record.__ddepartId.topManageDepName 
					+ '-' + record.__ddepartId.departName;
		var partnerId = record.__upartnerId.userId;
		var partnerNm = record.__upartnerId.userName;
		$('#'+formId+'_'+ 'submit_registId').val(record.registId);
		$('#'+formId+'_'+ 'submit_businessId').val(record.businessId);
		$('#'+formId+'_'+ 'submit_departId').treecombo('setTreeComboValue',[departId,departNm]);
		$('#'+formId+'_'+ 'submit_partnerId').treecombo('setTreeComboValue',[partnerId,partnerNm]);
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
		$('#'+formId+'_'+ 'submit_incomeAssign').val(record.incomeAssign);
		$('#'+formId+'_'+ 'submit_incomeAssignOther').val(record.incomeAssignOther);
		$('#'+formId+'_'+ 'submit_memo').val(record.memo);
		$('#'+formId+'_'+ 'submit_remark1').val(record.remark1);
		$('#'+formId+'_'+ 'submit_remark2').val(record.remark2);
		registerInfoGet(record.registId, formId + '_submit_register');
		financeTransfer(record.registId, formId + '_submit_transfer');
		registTeamData(record.registId, formId + '_submit_cooperateTeam');
	};
	
	createRedistForm('regist_form','example');
});



