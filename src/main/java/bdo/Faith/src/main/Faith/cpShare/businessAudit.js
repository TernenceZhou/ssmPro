pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');
/** 模态框 */
$('#sub_form').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'sub_audit',
			icon : 'fa-check',
			style : 'btn-success',
			text : '&nbsp;审核'
		},{
			id : 'sub_revoke',
			icon : 'fa-reply',
			style : 'btn-danger',
			text : '&nbsp;退回'
		},{
			id : 'sub_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id : 'sub_businessId',
			type : 'input',
			label : '业务机会编号',
			rowspan : 1,
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_providerId',
			type : 'input',
			label : '提供人',
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_departId',
			type : 'input',
			label : '所属部门',
			colspan : 2,
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_contract',
			type : 'input',
			label : '联系人',
			rowspan : 1,
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_contractWay',
			type : 'input',
			label : '联系方式',
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_industry',
			type : 'input',
			label : '所属行业',
			colspan : 2,
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_businessType',
			type : 'input',
			label : '业务类型',
			rowspan : 1,
			html : ComboDicOption(true, '审计类型分类'),
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_menNumRequire',
			type : 'input',
			label : '所需人数',
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_cooperation',
			type : 'select',
			label : '合作意向',
			html : ComboDicOption(true, '合作意向'),
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_projectCost',
			type : 'input',
			label : '项目分配(元)',
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_workingPlace',
			type : 'input',
			rowspan : 1,
			colspan : 2,
			label : '工作地点',
			typeAttr : {
				disabled : true
			}
		}, {
			id : 'sub_customerName',
			type : 'input',
			label : '客户名称',
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_customerProperties',
			type : 'input',
			label : '客户性质',
			typeAttr : {
				disabled : true
			}
		}, {
			id : 'sub_projectStart',
			type : 'input',
			label : '项目开始日期',
			rowspan : 1,
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_projectEnd',
			type : 'input',
			label : '项目结束日期',
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_projectPeriod',
			type : 'input',
			label : '项目周期(天)',
			typeAttr : {
				disabled : true,
				placeholder: '根据项目起止日期自动计算'
			}
		},{},{
			id : 'sub_startDate',
			type : 'input',
			label : '发布日期',
			rowspan : 1,
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_endDate',
			type : 'input',
			label : '截止日期',
			typeAttr : {
				disabled : true
			}
		},{
			colspan : 2
		},{
			id : 'sub_remarks',
			type : 'input',
			rowspan : 1,
			colspan : 4,
			label : '备注',
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_isRegist',
			type : 'select',
			rowspan : 1,
			html : ComboDicOption(true, 'boolean'),
			label : '是否关联登记单',
			typeAttr : {
				disabled : true
			}
		},{
			id : 'sub_auditState',
			type : 'select',
			html : ComboDicOption(true, '业务机会状态'),
			label : '业务机会状态',
			typeAttr : {
				disabled : true
			}
		}
	]
});

/** 模态框 打开 */
/*$('.modal').on('show.bs.modal', function(){
    $(this).draggable({
		handle: '.block-header',
		cursor: 'move'
    });
    $(this).css('overflow', 'hidden');
});*/

/** 模态框 关闭 */
$('.modal').on('hidden.bs.modal', function() {
	$('#modal_form button').show();
});

/** 加载树 */
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
		leafIcon: 'fa fa-building text-flat',    
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: false,
		multiSelect: false
	}
});
$('#search_businessType').treecombo({
	url : './cpBase/TreeCommon.findAuditTypeTree.json',
	params : {},
	view : {
		folderSelectable : false,
		multiSelect : false
	}
});

/** 下拉框 */
$('#search_cooperation').html(ComboDicOption(true, '合作意向'));
$('#search_isRegist').html(ComboDicOption(true, 'boolean'));
$('#search_auditState').html(ComboDicOption(true, '业务机会审核状态'));
$('#search_auditState').val('1');

/** table 属性 */
var tableParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [15, 'desc'],
	//必需
	sourceData : {},
	sourceUrl : 'cpBase/General.queryWithChildDeparts.json',
	filterParam : {
		menuId : window.sys_menuId,
		sqlId : 'CP00005',
		filter : queryFilter()
	},
	tableColumns : [
		{
			targets : 1,
			orderable : false,
			className : 'text-center',
			title : '处理',
			width : '100px',
			render : function(data, type, row, meta) {
				var renderStr = '';
				if (row.auditState=='1') {
					renderStr += '<button class="btn btn-xs btn-primary" type="button" name="rowAudit" data-placement="top" title="审核" data-toggle="tooltip">'
						+ '<i class="fa fa fa-send"></i></button>&nbsp;';
				} 
				if (row.auditState=='2') {
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowRevoke" data-placement="top" title="撤回" data-toggle="tooltip">'
							+ '<i class="fa fa fa-reply"></i></button>&nbsp;';
				}
				renderStr += '<button class="btn btn-xs btn-success" type="button" name="rowView" data-placement="top" title="查看业务机会" data-toggle="tooltip">'
							+ '<i class="fa fa-eye"></i></button>';
				return renderStr;
			}
		}, {
			targets : 2,
			orderable : true,
			className : 'text-center',
			title : '业务机会编号',
			name : 'businessId',
			data : 'businessId',
			width : '150px'
		}, {
			targets : 3,
			orderable : true,
			className : 'text-center',
			title : '提供人',
			name : 'providerId',
			data : '__uproviderId',
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
			targets : 4,
			orderable : true,
			title : '所属部门',
			name : 'departId|__ddepartId',
			data : '__ddepartId',
			width : '200px',
			render : function(data, type, row, meta){
				return row.__ddepartId.topManageDepName + '-' + row.__ddepartId.departName;
			}
		}, {
			targets : 5,
			orderable : true,
			className : 'text-center',
			title : '联系人',
			name : 'contract',
			data : 'contract',
			width : '100px'
		}, {
			targets : 6,
			orderable : true,
			className : 'text-center',
			title : '联系方式',
			name : 'contractWay',
			data : 'contractWay',
			width : '150px'
		}, {
			targets : 7,
			orderable : true,
			title : '业务类型',
			name : 'businessType',
			data : 'businessType',
			width : '100px'
		}, {
			targets : 8,
			orderable : true,
			title : '所属行业',
			renderer : 'industryValue2Name',
			name : 'industry',
			data : 'industry',
			width : '150px',
			render : function(data, type, row, meta){
				return IndustryVal2Nm(data);
			}
		}, {
			targets : 9,
			orderable : true,
			className : 'text-right',
			title : '所需人数',
			name : 'menNumRequire',
			data : 'menNumRequire',
			width : '100px'
		}, {
			targets : 10,
			orderable : true,
			className : 'text-center',
			title : '合作意向',
			name : 'cooperation',
			data : 'cooperation',
			width : '100px'
		}, {
			targets : 11,
			orderable : true,
			className : 'text-right',
			title : '项目分配(元)',
			name : 'projectCost',
			data : 'projectCost',
			width : '100px'
		}, {
			targets : 12,
			orderable : true,
			title : '客户名称',
			name : 'customerName',
			data : 'customerName',
			width : '150px'
		}, {
			targets : 13,
			orderable : true,
			className : 'text-center',
			title : '企业性质',
			name : 'customerProperties',
			data : 'customerProperties',
			width : '150px'
		}, {
			targets : 14,
			orderable : true,
			title : '工作地点',
			name : 'workingPlace',
			data : 'workingPlace',
			width : '200px'
		}, {
			targets : 15,
			orderable : true,
			className : 'text-center',
			title : '是否关联登记单',
			renderer : 'getDicLabelByVal|boolean',
			name : 'isRegist',
			data : 'isRegist',
			width : '150px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, 'boolean');
			}
		}, {
			targets : 16,
			orderable : true,
			className : 'text-right',
			title : '关联登记单数',
			name : 'registNum',
			data : 'registNum',
			width : '100px'
		}, {
			targets : 17,
			orderable : true,
			className : 'text-center',
			title : '业务机会状态',
			renderer : 'getDicLabelByVal|业务机会状态',
			name : 'auditState',
			data : 'auditState',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, '业务机会状态');
			}
		}, {
			targets : 18,
			orderable : true,
			className : 'text-center',
			title : '发布日期',
			name : 'startDate',
			data : 'startDate',
			width : '100px'
		}, {
			targets : 19,
			orderable : true,
			className : 'text-center',
			title : '截止日期',
			name : 'endDate',
			data : 'endDate',
			width : '100px'
		}, {
			targets : 20,
			orderable : true,
			className : 'text-center',
			title : '项目开始时间',
			name : 'projectStart',
			data : 'projectStart',
			width : '100px'
		}, {
			targets : 21,
			orderable : true,
			className : 'text-center',
			title : '项目结束时间',
			name : 'projectEnd',
			data : 'projectEnd',
			width : '100px'
		}, {
			targets : 22,
			orderable : true,
			title : '备注',
			name : 'remarks',
			data : 'remarks',
			width : '200px'
		}]
};

BdoDataTables('chanceInfo', tableParam);

/** 重置按钮 */
$('#btn_clear').click(function() {
	$('#search_providerName').val('');
	$('#search_departId').treecombo('setTreeComboValue',['', '']);
	$('#search_businessType').treecombo('setTreeComboValue',['', '']);
	$('#search_industry').treecombo('setTreeComboValue',['', '']);
	$('#search_menNumRequireMin').val('');
	$('#search_menNumRequireMax').val('');
	$('#search_cooperation').val('');
	$('#search_workingPlace').val('');
	$('#search_isRegist').val('');
	$('#search_auditState').val('1');
	$('#search_customerName').val('');
	tableParam.filterParam.filter = queryFilter();
	$('#chanceInfo').DataTable().ajax.reload();
});

/** 搜索按钮 */
$('#btn_search').click(function() {
	tableParam.filterParam.filter = queryFilter();
	$('#chanceInfo').DataTable().ajax.reload();
});

/** 导出 */
$('#btn_export').click(function() {
	exportExcel(this, '审核业务机会一览', tableParam, 'chanceInfo');
});

/** 行双击 */
$('#chanceInfo tbody').on('dblclick', 'tr', function() {
	formdataSet($('#chanceInfo').DataTable().data()[$(this).closest('tr').index()]);
	$('#sub_audit').hide();
	$('#sub_revoke').hide();
	$('#modal_form').modal('show');
});

var businessId;
/** 行按钮 审核  */
$('#chanceInfo').on('click', 'button[name="rowAudit"]', function() {
	var object = $('#chanceInfo').DataTable().data()[$(this).closest('tr').index()];
	formdataSet(object);
	businessId = object.businessId;
	$('#modal_form').modal('show');
});

/** 行按钮 撤回  */
$('#chanceInfo').on('click', 'button[name="rowRevoke"]', function() {
	var object = $('#chanceInfo').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('撤回', '是否撤回该业务机会吗？', function(){
		$.ajax({
			type : 'post',
			url : 'cpShare/CoopChance.chanceBack.json',
			data : {
				param1 : object.businessId
			},
			dataType : 'json',
			success : function(data) {
				$('#chanceInfo').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

/** 行按钮 查看 */
$('#chanceInfo').on('click', 'button[name="rowView"]', function() {
	$(this).closest('tr').dblclick();
});

/** 审核 通过 */
$('#sub_audit').click(function(){
	chanceAudit(1, $(this).text());
});
/** 审核 退回 */
$('#sub_revoke').click(function(){
	chanceAudit(2, $(this).text());
});

function chanceAudit(auditType, auditName){
	bdoAjaxBox(auditName, '是否'+ auditName +'此项业务机会吗？', function () {
      $.post('cpShare/CoopChance.chanceAudit.json', {param1:businessId, param2 : auditType})
        .done(function (data) {
			$('#modal_form').modal('hide');
			$('#chanceInfo').DataTable().ajax.reload();
			if(data.success === true){
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
        })
    });
}

/** 模态框 关闭 */
$('#sub_close').click(function() {
	$('#modal_form').modal('hide');
});

/** 检索条件设置 */
function queryFilter() {
	var queryFilterArr = [];
	if ($('#search_providerName').val() != '') {
		queryFilterArr.push({
			'field' : '__uproviderId',
			'sqlIndex' : 'providerId',
			'type' : 'string',
			'value' : $('#search_providerName').val(),
			'operate' : 'eq'
		});
	}
	if ($('#search_departId').val() != '') {
		queryFilterArr.push({
			'field' : 'departId',
			'sqlIndex' : 'departId',
			'type' : 'list',
			'value' : $('#search_departId').treecombo('getTreeComboValue'),
			'operate' : 'eq'
		});
	}
	if ($('#search_businessType').val() != '') {
		queryFilterArr.push({
			'field' : 'businessType',
			'sqlIndex' : 'businessType',
			'type' : 'string',
			'value' : $('#search_businessType').val(),
			'operate' : 'eq'
		});
	}
	if ($('#search_industry').val() != '') {
		queryFilterArr.push({
			'field' : 'industry',
			'sqlIndex' : 'industry',
			'type' : 'string',
			'value' : $('#search_industry').treecombo('getTreeComboValue'),
			'operate' : 'eq'
		});
	}
	if ($('#search_menNumRequireMin').val() != '') {
		queryFilterArr.push({
			'field' : 'menNumRequire',
			'sqlIndex' : 'menNumRequire',
			'type' : 'numeric',
			'value' : $('#search_menNumRequireMin').val(),
			'operate' : 'gt'
		});
	}
	if ($('#search_menNumRequireMax').val() != '') {
		queryFilterArr.push({
			'field' : 'menNumRequire',
			'sqlIndex' : 'menNumRequire',
			'type' : 'numeric',
			'value' : $('#search_menNumRequireMax').val(),
			'operate' : 'lt'
		});
	}
	if ($('#search_cooperation').val() != '') {
		queryFilterArr.push({
			'field' : 'cooperation',
			'sqlIndex' : 'cooperation',
			'type' : 'string',
			'value' : $('#search_cooperation').find("option:selected").text(),
			'operate' : 'eq'
		});
	}
	if ($('#search_workingPlace').val() != '') {
		queryFilterArr.push({
			'field' : 'workingPlace',
			'sqlIndex' : 'workingPlace',
			'type' : 'string',
			'value' : $('#search_workingPlace').val(),
			'operate' : 'eq'
		});
	}
	if ($('#search_isRegist').val() != '') {
		queryFilterArr.push({
			'field' : 'isRegist',
			'sqlIndex' : 'isRegist',
			'type' : 'numeric',
			'value' : $('#search_isRegist').val(),
			'operate' : 'eq'
		});
	}
	if ($('#search_auditState').val() != '') {
		queryFilterArr.push({
			'field' : 'auditState',
			'sqlIndex' : 'auditState',
			'type' : 'numeric',
			'value' : $('#search_auditState').val(),
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
}

/** 模态框数据 加载 */
function formdataSet(object) {
	$('#sub_providerId').val(object.__uproviderId.userName);
	$('#sub_businessId').val(object.businessId);
	$('#sub_departId').val(object.__ddepartId.topManageDepName + '-' + object.__ddepartId.departName);
	$('#sub_contract').val(object.contract);
	$('#sub_contractWay').val(object.contractWay);
	$('#sub_businessType').val(object.businessType);
	$('#sub_industry').val(IndustryVal2Nm(object.industry));
	$('#sub_menNumRequire').val(object.menNumRequire);
	$('#sub_cooperation').val(object.cooperation);
	$('#sub_workingPlace').val(object.workingPlace);
	$('#sub_startDate').val(object.startDate);
	$('#sub_endDate').val(object.endDate);
	$('#sub_projectCost').val(object.projectCost);
	$('#sub_customerName').val(object.customerName);
	$('#sub_customerProperties').val(object.customerProperties);
	$('#sub_projectStart').val(object.projectStart);
	$('#sub_projectEnd').val(object.projectEnd);
	$('#sub_projectPeriod').val(object.projectPeriod);
	$('#sub_remarks').val(object.remarks);
	$('#sub_isRegist').val(object.isRegist);
	$('#sub_auditState').val(object.auditState);
}