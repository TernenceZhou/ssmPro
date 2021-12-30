pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');
/** 模态框 */
$('#sub_form').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'sub_savesubmit',
			icon : 'fa-send',
			style : 'btn-primary',
			text : '保存并提交'
		},
		{
			id : 'sub_save',
			icon : 'fa-save',
			style : 'btn-primary',
			text : '&nbsp;保存'
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
				disabled : true,
				placeholder : '自动生成'
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
			},
			validate : {
				rules : {
					required : true
				}
			},
			plugin : {
				name : 'treecombo',
				options :{
					url : './base/TreeCommon.findDepartTree.json',
					params : {},
					view : {
						leafIcon: 'fa fa-building text-flat',    
						nodeIcon: 'fa fa-bank text-primary-light',
						folderSelectable: false,
						multiSelect: false
					}
				}
			}
		},{
			id : 'sub_contract',
			type : 'input',
			label : '联系人',
			rowspan : 1,
			validate : {
				rules : {
					required : true,
					maxlength : 20
				}
			}
		},{
			id : 'sub_contractWay',
			type : 'input',
			label : '联系方式',
			validate : {
				rules : {
					required : true,
					maxlength : 100
				}
			}
		},{
			id : 'sub_industry',
			type : 'input',
			label : '所属行业',
			colspan : 2,
			validate : {
				rules : {
					required : true
				}
			},
			plugin : {
				name : 'treecombo',
				options :{
					url : './cpBase/TreeCommon.findIndustryTree.json',
					params : {},
					view : {
						leafIcon: 'fa fa-building text-flat',    
						folderSelectable: false
					}
				}
			}
			
		},{
			id : 'sub_businessType',
			type : 'input',
			label : '业务类型',
			rowspan : 1,
			validate : {
				rules : {
					required : true
				}
			},
			plugin : {
				name : 'treecombo',
				options :{
					url : './cpBase/TreeCommon.findAuditTypeTree.json',
					params : {},
					view : {
						folderSelectable : false,
						multiSelect : false
					}
				}
			}
		},{
			id : 'sub_menNumRequire',
			type : 'input',
			label : '所需人数',
			typeAttr : {
				normal : true,
				type : 'number'
			},
			validate : {
				rules : {
					digits : true
				},
				messages : {
					digits : '只能输入正整数'
				}
			}
		},{
			id : 'sub_cooperation',
			type : 'select',
			label : '合作意向',
			html : ComboDicOption(true, '合作意向'),
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'sub_projectCost',
			type : 'input',
			label : '项目分配(元)',
			typeAttr : {
				normal : true,
				type : 'number'
			},
			validate : {
				rules : {
					maxlength : 11,
					decimal : 2
				}
			}
		},{
			id : 'sub_workingPlace',
			type : 'input',
			rowspan : 1,
			colspan : 2,
			label : '工作地点',
			validate : {
				rules : {
					required : true,
					maxlength : 100
				}
			}
		},{
			id : 'sub_customerName',
			type : 'input',
			label : '客户名称',
			validate : {
				rules : {
					required : true,
					maxlength : 100
				}
			}
		},{
			id : 'sub_customerProperties',
			type : 'select',
			label : '客户性质',
			html : ComboDicOption(true, '公司性质'),
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'sub_projectStart',
			type : 'input',
			rowspan : 1,
			label : '项目开始日期',
			validate : {
				rules : {
					required : true
				}
			},
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
			id : 'sub_projectEnd',
			type : 'input',
			label : '项目结束日期',
			validate : {
				rules : {
					required : true
				}
			},
			plugin : {
				name : 'datepicker',
				options : {
					weekStart: 1,
					clearBtn: true,
					autoclose: true,
					language: 'zh-CN',
					format: 'yyyy-mm-dd',
					todayHighlight: true,
					startDate: new Date()
				}
			}
		},{
			id : 'sub_projectPeriod',
			type : 'input',
			label : '项目周期(天)',
			typeAttr : {
				placeholder: '根据项目起止日期自动计算'
			}
		},{},{
			id : 'sub_startDate',
			type : 'input',
			label : '发布日期',
			rowspan : 1,
			validate : {
				rules : {
					required : true
				}
			},
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
			id : 'sub_endDate',
			type : 'input',
			label : '截止日期',
			validate : {
				rules : {
					required : true
				}
			},
			plugin : {
				name : 'datepicker',
				options : {
					weekStart: 1,
					clearBtn: true,
					autoclose: true,
					language: 'zh-CN',
					format: 'yyyy-mm-dd',
					todayHighlight: true,
					startDate: new Date()
				}
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
				normal : true
			},
			validate : {
				rules : {
					maxlength : 200
				}
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

/** 模态框设置 */
/*$('.modal').on('show.bs.modal', function(){
    $(this).draggable({
		handle: '.block-header',
		cursor: 'move'
    });
    $('#modal_form').css('overflow', 'hidden');
});*/


/** 重置模态框表单 */
$('#modal_form').on('hidden.bs.modal', function() {
	$('#modal_form button').show();
	$('#modal_form').find('input, select, textarea').removeAttr('disabled','disabled');
	$('#modal_form form')[0].reset();
	$('#modal_form form td').removeClass('has-error');
	$('#modal_form form .help-block').remove();
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

/** 加载下拉框 */
$('#search_businessType, #submit_businessType').html(ComboDicOption(true, '审计类型分类'));
$('#search_cooperation').html(ComboDicOption(true, '合作意向'));
$('#search_isRegist').html(ComboDicOption(true, 'boolean'));
$('#search_auditState').html(ComboDicOption(true, '业务机会状态'));
$('#search_isClose').html(ComboDicOption(false, 'boolean'));
$('#search_isClose').val('0');
$('#sub_cooperation').html(ComboDicOption(true, '合作意向'));
$('#sub_isRegist').html(ComboDicOption(true, 'boolean'));
$('#sub_auditState').html(ComboDicOption(true, '业务机会状态'));

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
		sqlId : 'CP00002',
		filter : queryFilter()
	},
	tableColumns : [
		{
			targets : 1,
			orderable : false,
			className : 'text-center',
			title : '处理',
			width : '200px',
			render : function(data, type, row, meta) {
				var renderStr = '';
				if(row.isClose == '0'){
					if (row.auditState=='2') {
						renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowClose" data-placement="top" title="关闭业务机会" data-toggle="tooltip">'
							+ '<i class="fa fa-ban"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-info" type="button" name="rowCoop" data-placement="top" title="填写业务登记单" data-toggle="tooltip">'
							+ '<i class="fa fa-file-code-o"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="rowRegist" data-placement="top" title="查看业务登记单" data-toggle="tooltip">'
							+ '<i class="fa fa-list"></i></button>&nbsp;';
					}
					if (row.auditState=='0') {
						renderStr += '<button class="btn btn-xs btn-primary" type="button" name="rowEdit" data-placement="top" title="修改业务机会" data-toggle="tooltip">'
							+ '<i class="fa fa-edit"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-info" type="button" name="rowSubmit" data-placement="top" title="提交业务机会" data-toggle="tooltip">'
							+ '<i class="fa fa-send"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="rowDelete" data-placement="top" title="删除业务机会" data-toggle="tooltip">'
							+ '<i class="fa fa-times"></i></button>&nbsp;';
					} 
					if (row.auditState=='1') {
						renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowWithdraw" data-placement="top" title="撤回业务机会(撤回后可修改)" data-toggle="tooltip">'
								+ '<i class="fa fa-reply"></i></button>&nbsp;';
					}
					renderStr += '<button class="btn btn-xs btn-success" type="button" name="rowView" data-placement="top" title="查看业务机会" data-toggle="tooltip">'
								+ '<i class="fa fa-eye"></i></button>';
				} else{
					renderStr += '<button class="btn btn-xs btn-success" type="button" name="rowOpen" data-placement="top" title="开启业务机会" data-toggle="tooltip">'
						+ '<i class="fa fa-check-circle-o"></i></button>';
				}
				return renderStr;
			}
		},{
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
			title : '业务类型',
			name : 'businessType',
			data : 'businessType',
			width : '100px'
		}, {
			targets : 4,
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
			targets : 5,
			orderable : true,
			className : 'text-right',
			title : '所需人数',
			name : 'menNumRequire',
			data : 'menNumRequire',
			width : '100px'
		}, {
			targets : 6,
			orderable : true,
			className : 'text-center',
			title : '合作意向',
			name : 'cooperation',
			data : 'cooperation',
			width : '100px'
		}, {
			targets : 7,
			orderable : true,
			className : 'text-right',
			title : '项目分配(元)',
			name : 'projectCost',
			data : 'projectCost',
			width : '100px'
		}, {
			targets : 8,
			orderable : true,
			title : '客户名称',
			name : 'customerName',
			data : 'customerName',
			width : '150px'
		}, {
			targets : 9,
			orderable : true,
			className : 'text-center',
			title : '企业性质',
			name : 'customerProperties',
			data : 'customerProperties',
			width : '100px'
		}, {
			targets : 10,
			orderable : true,
			title : '工作地点',
			name : 'workingPlace',
			data : 'workingPlace',
			width : '200px'
		}, {
			targets : 11,
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
			targets : 12,
			orderable : true,
			className : 'text-right',
			title : '关联登记单数',
			name : 'registNum',
			data : 'registNum',
			width : '100px'
		}, {
			targets : 13,
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
			targets : 14,
			orderable : true,
			title : '备注',
			name : 'remarks',
			data : 'remarks',
			width : '200px'
		}, {
			targets : 15,
			orderable : true,
			className : 'text-center',
			title : '项目起始时间',
			name : 'projectStart',
			data : 'projectStart',
			width : '100px'
		}, {
			targets : 16,
			orderable : true,
			className : 'text-center',
			title : '项目结束时间',
			name : 'projectEnd',
			data : 'projectEnd',
			width : '100px'
		}, {
			targets : 17,
			orderable : true,
			className : 'text-center',
			title : '发布日期',
			name : 'startDate',
			data : 'startDate',
			width : '100px'
		}, {
			targets : 18,
			orderable : true,
			className : 'text-center',
			title : '截止日期',
			name : 'endDate',
			data : 'endDate',
			width : '100px'
		}, {
			targets : 19,
			orderable : true,
			className : 'text-center',
			title : '联系人',
			name : 'contract',
			data : 'contract',
			width : '100px'
		}, {
			targets : 20,
			orderable : true,
			className : 'text-center',
			title : '联系方式',
			name : 'contractWay',
			data : 'contractWay',
			width : '200px'
		}, {
			targets : 21,
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
			targets : 22,
			orderable : true,
			title : '所属部门',
			name : 'departId|__ddepartId',
			data : '__ddepartId',
			width : '200px',
			render : function(data, type, row, meta){
				return row.__ddepartId.topManageDepName + '-' + row.__ddepartId.departName;
			}
		}]
};

BdoDataTables('chanceInfo', tableParam);

$('#sub_startDate').change(function(){
	var pickdate = new Date($('#sub_startDate').val());
	pickdate.setDate(pickdate.getDate()+90);
	$('#sub_endDate').datepicker('setDate', pickdate);
});
$('#sub_projectStart').change(function(){
	var startTime = $('#sub_projectStart').val();
	var endTime = $('#sub_projectEnd').val();
	Date.prototype.diff = function(date){
		return (this.getTime() - date.getTime())/(24 * 60 * 60 * 1000);
	};
	if(startTime != "" && endTime != ""){
		$('#sub_projectPeriod').val(new Date(endTime).diff(new Date(startTime)));	
	} else {
		$('#sub_projectPeriod').val("");	
	}
});

$('#sub_projectEnd').change(function(){
	var startTime = $('#sub_projectStart').val();
	var endTime = $('#sub_projectEnd').val();
	Date.prototype.diff = function(date){
		return (this.getTime() - date.getTime())/(24 * 60 * 60 * 1000);
	};
	if(startTime != "" && endTime != ""){
		$('#sub_projectPeriod').val(new Date(endTime).diff(new Date(startTime)));	
	} else {
		$('#sub_projectPeriod').val("");	
	}
});


/** 重置按钮 */
$('#btn_clear').click(function() {
	$('#search_departId').treecombo('setTreeComboValue',['', '']);
	$('#search_businessType').treecombo('setTreeComboValue',['', '']);
	$('#search_industry').treecombo('setTreeComboValue',['', '']);
	$('#search_menNumRequireMin').val('');
	$('#search_menNumRequireMax').val('');
	$('#search_cooperation').val('');
	$('#search_workingPlace').val('');
	$('#search_isRegist').val('');
	$('#search_auditState').val('');
	$('#search_isClose').val('0');
	$('#search_customerName').val('');
	tableParam.filterParam.filter = queryFilter();
	$('#chanceInfo').DataTable().ajax.reload();
});

/** 搜索按钮 */
$('#btn_search').click(function() {
	tableParam.filterParam.filter = queryFilter();
	$('#chanceInfo').DataTable().ajax.reload();
});

/** 新增 */
$('#btn_plus').click(function() {
	$('#sub_providerId').val(selfNm);
	$('#sub_departId').treecombo('setTreeComboValue',[departIdSession, companyNmSession + '-' + departNmSession]);
	$('#sub_businessId, #sub_providerId, #sub_departId, #sub_isRegist, #sub_auditState, #sub_projectPeriod').attr('disabled','disabled');
	var now = new Date();
	$('#sub_startDate').datepicker('setDate', now);
	now.setDate(now.getDate()+90);
	$('#sub_endDate').datepicker('setDate', now);
	$('#modal_form').modal('show');
});

/** 导出 */
$('#btn_export').click(function() {
	exportExcel(this, '我的业务机会一览', tableParam, 'chanceInfo');
});

/** 行双击 */
$('#chanceInfo tbody').on('dblclick', 'tr', function() {
	formdataSet($('#chanceInfo').DataTable().data()[$(this).closest('tr').index()]);
	$('#sub_save,#sub_savesubmit').hide();
	$('#modal_form').find('input, select, textarea').attr('disabled','disabled');
	$('#sub_projectPeriod').attr('disabled','disabled');
	$('#modal_form').modal('show');
});

/** 行按钮 查看 */
$('#chanceInfo').on('click', 'button[name="rowView"]', function() {
	$(this).closest('tr').dblclick();
});

/** 行按钮 查看业务登记单 */
$('#chanceInfo').on('click', 'button[name="rowRegist"]', function() {
	registParam.filterParam.param3 = $('#chanceInfo').DataTable().data()[$(this).closest('tr').index()].businessId;
	$('#regist_list').modal('show');
});

/** 行按钮 开启业务机会 */
$('#chanceInfo').on('click', 'button[name="rowOpen"]', function() {
	var openId = $('#chanceInfo').DataTable().data()[$(this).closest('tr').index()].businessId;
	bdoConfirmBox('开启', '确定开启该业务机会吗？', function(){
		$.ajax({
			type : 'post',
			url : 'cpShare/CoopChance.chanceOpen.json',
			data : {
				param1 : openId
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

/** 行按钮 关闭业务机会 */
$('#chanceInfo').on('click', 'button[name="rowClose"]', function() {
	var openId = $('#chanceInfo').DataTable().data()[$(this).closest('tr').index()].businessId;
	bdoConfirmBox('关闭', '确定关闭该业务机会吗？', function(){
		$.ajax({
			type : 'post',
			url : 'cpShare/CoopChance.chanceClose.json',
			data : {
				param1 : openId
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

/** 业务机会关联的业务登记单 属性 */
var registParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
	order : [1, 'desc'],
	//必需
	sourceData : {},
	sourceUrl : 'cpBase/General.queryWithChildDeparts.json',
	filterParam : {
		menuId : window.sys_menuId,
		sqlId : 'CP00010',
		param3 : null,
		filter : '[]'
	},
	tableColumns : [
		{
			targets : 1,
			orderable : true,
			className : 'text-center',
			title : '业务登记单编号',
			name : 'registId',
			data : 'registId',
			width : '150px'
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
			title : '企业性质',
			renderer : 'getDicLabelByVal|公司性质',
			name : 'customerProperties',
			data : 'customerProperties',
			width : '200px'
		}, {
			targets : 4,
			orderable : true,
			title : '业务类型',
			name : 'businessType',
			data : 'businessType',
			width : '100px'
		},{
			targets : 5,
			orderable : true,
			title : '项目周期(天)',
			className : 'text-center',
			name : 'projectPeriod',
			data : 'projectPeriod',
			width : '100px'
		}, {
			targets : 6,
			orderable : true,
			title : '所属行业',
			renderer : 'industryValue2Name',
			name : 'industry',
			data : 'industry',
			width : '150px',
			render : function(data, type, row, meta){
				return IndustryVal2Nm(data);
			}
		},{
			targets : 7,
			orderable : true,
			title : '合作意向',
			className : 'text-center',
			renderer : 'getDicLabelByVal|合作意向',
			name : 'cooperation',
			data : 'cooperation',
			width : '150px'
		},{
			targets : 8,
			orderable : true,
			title : '出报告时间',
			className : 'text-center',
			name : 'reportDate',
			data : 'reportDate',
			width : '150px'
		},{
			targets : 9,
			orderable : true,
			title : '合同涉及金额',
			className : 'text-right',
			name : 'projectCost',
			data : 'projectCost',
			width : '150px',
			render: function(data, type, row, meta){
				return accounting.formatMoney(data, "￥", 2, ",", ".");
			}
		}, {
			targets : 10,
			orderable : true,
			title : '工作地点',
			name : 'workingPlace',
			data : 'workingPlace',
			width : '250px'
		}, {
			targets : 11,
			orderable : true,
			title : '关联合作方',
			className : 'text-center',
			name : 'cooperatorId',
			data : '__ucooperatorId',
			width : '150px',
			render : function(data, type, row, meta){
				if(!data) {
					return '';
				}
				return '<span data-toggle="tooltip" title="电话: ' + data.phone
						+ '\n手机: ' + data.mobilePhone + '\n邮箱: ' + data.email
						+ '">' + data.userName + '</span>';
			}
		}, {
			targets : 12,
			orderable : true,
			title : '状态',
			className : 'text-center',
			renderer : 'getDicLabelByVal|业务登记单状态',
			name : 'state',
			data : 'state',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, '业务登记单状态');
			}
		}, {
			targets : 13,
			orderable : true,
			title : '合作确认人',
			className : 'text-center',
			name : 'confirmUserId',
			data : '__uconfirmUserId',
			width : '200px',
			render : function(data, type, row, meta){
				if(!data) {
					return '';
				}
				return '<span data-toggle="tooltip" title="电话: ' + data.phone
						+ '\n手机: ' + data.mobilePhone + '\n邮箱: ' + data.email
						+ '">' + data.userName + '</span>';
			}
		}, {
			targets : 14,
			orderable : true,
			title : '合作评分',
			className : 'text-center',
			name : 'evaluateScore',
			data : 'evaluateScore',
			width : '80px',
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
			targets : 15,
			orderable : true,
			title : '合作评价备注',
			name : 'evaluateMemo',
			data : 'evaluateMemo',
			width : '200px',
			render : function(data, type, row, meta){
				if(data){
					return '<span data-toggle="tooltip" title="' + data+ '">' + data + '</span>';
				}
				return null;
			}
		}, {
			targets : 16,
			orderable : true,
			title : '联系人',
			className : 'text-center',
			name : 'contract',
			data : 'contract',
			width : '100px'
		}, {
			targets : 17,
			orderable : true,
			title : '联系方式',
			className : 'text-center',
			name : 'contractWay',
			data : 'contractWay',
			width : '200px'
		}, 
		{
			targets : 18,
			orderable : true,
			title : '所属部门',
			name : 'departId',
			data : '__ddepartId.departName',
			width : '200px',
			render : function(data, type, row, meta){
				return row.__ddepartId.topManageDepName + '-' + row.__ddepartId.departName;
			}
		}]
};

$('#regist_list').on('shown.bs.modal', function(){
	BdoDataTables('registlist', registParam);
});

$('#regist_list').on('hide.bs.modal', function(){
	$('#registlist tbody').unbind()
});

/** 行按钮 修改  */
$('#chanceInfo').on('click', 'button[name="rowEdit"]', function() {
	formdataSet($('#chanceInfo').DataTable().data()[$(this).closest('tr').index()]);
	$('#sub_businessId, #sub_providerId, #sub_departId, #sub_isRegist, #sub_auditState, #sub_projectPeriod').attr('disabled','disabled');
	$('#modal_form').modal('show');
});

/** 行按钮 提交 */
$('#chanceInfo').on('click', 'button[name="rowSubmit"]', function() {
	var object = $('#chanceInfo').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('提交', '确定提交该业务机会吗？', function(){
		$.ajax({
			type : 'post',
			url : 'cpShare/CoopChance.chanceSubmit.json',
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

/** 行按钮 删除 */
$('#chanceInfo').on('click', 'button[name="rowDelete"]', function() {
	var object = $('#chanceInfo').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('删除', '确定删除该业务机会吗？', function(){
		$.ajax({
			type : 'post',
			url : 'cpShare/CoopChance.chanceDelete.json',
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

/** 行按钮 撤回 */
$('#chanceInfo').on('click', 'button[name="rowWithdraw"]', function() {
	var object = $('#chanceInfo').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('撤回', '确定撤回该业务机会吗？', function(){
		$.ajax({
			type : 'post',
			url : 'cpShare/CoopChance.chanceCancel.json',
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

/** 模态框 保存并提交 */
$('#sub_savesubmit').click(function(){
	if($('#sub_projectStart').val() > $('#sub_projectEnd').val()){
		bdoErrorBox('失败', '项目结束日期需大于项目开始日期');
		return;
	}
	var data = {
		param1 : '1',
		param2 : JSON.stringify({
			businessId : $('#sub_businessId').val(),
			departId : $('#sub_departId').treecombo('getTreeComboValue'),
			contract : $('#sub_contract').val(),
			contractWay : $('#sub_contractWay').val(),
			businessType : $('#sub_businessType').val(),
			industry : $('#sub_industry').treecombo('getTreeComboValue'),
			menNumRequire : $('#sub_menNumRequire').val(),
			cooperation : $('#sub_cooperation').val(),
			workingPlace : $('#sub_workingPlace').val(),
			startDate : $('#sub_startDate').val(),
			endDate : $('#sub_endDate').val(),
			remarks : $('#sub_remarks').val(),
			projectCost : $('#sub_projectCost').val(),
			customerName : $('#sub_customerName').val(),
			customerProperties : $('#sub_customerProperties').val(),
			projectStart : $('#sub_projectStart').val(),
			projectEnd : $('#sub_projectEnd').val()
		})
	};
	var submitUrl = null;
	if($('#sub_businessId').val()){
		submitUrl='cpShare/CoopChance.chanceEdit.json';
	}else{
		submitUrl='cpShare/CoopChance.chanceAdd.json';
	}
	$('#sub_form').formview(
		'setAjaxConf',
		[
			submitUrl,
			data,
			'json',true,
			function(data) {
				$('#chanceInfo').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_form').modal('hide');
			}
		]
	);
	$('#sub_form').submit();
});

/** 模态框 保存 */
$('#sub_save').click(function(){
	if($('#sub_projectStart').val() > $('#sub_projectEnd').val()){
		bdoErrorBox('失败', '项目结束日期需大于项目开始日期');
		return;
	}
	var data = {
		param1 : '0',
		param2 : JSON.stringify({
			businessId : $('#sub_businessId').val(),
			departId : $('#sub_departId').treecombo('getTreeComboValue'),
			contract : $('#sub_contract').val(),
			contractWay : $('#sub_contractWay').val(),
			businessType : $('#sub_businessType').val(),
			industry : $('#sub_industry').treecombo('getTreeComboValue'),
			menNumRequire : $('#sub_menNumRequire').val(),
			cooperation : $('#sub_cooperation').val(),
			workingPlace : $('#sub_workingPlace').val(),
			startDate : $('#sub_startDate').val(),
			endDate : $('#sub_endDate').val(),
			remarks : $('#sub_remarks').val(),
			projectCost : $('#sub_projectCost').val(),
			customerName : $('#sub_customerName').val(),
			customerProperties : $('#sub_customerProperties').val(),
			projectStart : $('#sub_projectStart').val(),
			projectEnd : $('#sub_projectEnd').val()
		})
	};
	var submitUrl = null;
	if($('#sub_businessId').val()){
		submitUrl='cpShare/CoopChance.chanceEdit.json';
	}else{
		submitUrl='cpShare/CoopChance.chanceAdd.json';
	}
	$('#sub_form').formview(
		'setAjaxConf',
		[
			submitUrl,
			data,
			'json',true,
			function(data) {
				$('#chanceInfo').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_form').modal('hide');
			}
		]
	);
	$('#sub_form').submit();
});

/** 模态框 关闭 */
$('#sub_close').click(function() {
	$('#modal_form').modal('hide');
});	

/** 检索条件设置 */
function queryFilter() {
	var queryFilterArr = [];
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
	if ($('#search_isClose').val() != '') {
		queryFilterArr.push({
			'field' : 'isClose',
			'sqlIndex' : 'isClose',
			'type' : 'numeric',
			'value' : $('#search_isClose').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}

/** 模态框数据 加载 */
function formdataSet(object) {
	$('#sub_providerId').val(object.__uproviderId.userName);
	$('#sub_businessId').val(object.businessId);
	$('#sub_departId').treecombo('setTreeComboValue',[object.__ddepartId.departId, object.__ddepartId.topManageDepName + '-' + object.__ddepartId.departName]);
	$('#sub_contract').val(object.contract);
	$('#sub_contractWay').val(object.contractWay);
	$('#sub_businessType').treecombo('setTreeComboValue',[object.businessType, object.businessType]);
	$('#sub_industry').treecombo('setTreeComboValue',[object.industry, IndustryVal2Nm(object.industry)]);
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
// ==========================================================
	var setModalData = function(formId, table, me){
		var record = $('#'+ table).DataTable().data()[$(me).closest('tr').index()];
		var departNmText = companyNmSession + '-' + departNmSession;
		$('#'+formId+'_'+ 'submit_businessId').val(record.businessId);
		$('#'+formId+'_'+ 'submit_departId')
			.attr('disabled','disabled')
			.treecombo('setTreeComboValue',[departIdSession,departNmText]);
		$('#'+formId+'_'+ 'submit_partnerId')
			.attr('disabled','disabled')
			.treecombo('setTreeComboValue',[sys_userId,selfNm]);
		$('#'+formId+'_'+ 'submit_contract').val(record.contract);
		$('#'+formId+'_'+ 'submit_contractWay').val(record.contractWay);
		$('#'+formId+'_'+ 'submit_businessType').treecombo('setTreeComboValue',[record.businessType,record.businessType]);
		$('#'+formId+'_'+ 'submit_customerName').val(record.customerName);
		$('#'+formId+'_'+ 'submit_customerProperties').val(record.customerProperties);
		$('#'+formId+'_'+ 'submit_packageNum').val(null);
		$('#'+formId+'_'+ 'submit_industry')
			.treecombo('setTreeComboValue',[record.industry,IndustryVal2Nm(record.industry)]);
		$('#'+formId+'_'+ 'submit_workingPlace').val(record.workingPlace);
		$('#'+formId+'_'+ 'submit_projectStart').val(record.projectStart);
		$('#'+formId+'_'+ 'submit_projectEnd').val(record.projectEnd);
		$('#'+formId+'_'+ 'submit_projectPeriod').val(record.projectPeriod);
		$('#'+formId+'_'+ 'submit_projectPeriod').attr('disabled', 'disabled');
		$('#'+formId+'_'+ 'submit_projectCost').val(record.projectCost);
		$('#'+formId+'_'+ 'submit_cooperation').val(record.cooperation);
		$('#'+formId+'_'+ 'submit_cooperatorId').treecombo('setTreeComboValue',null);
		$('#'+formId+'_'+ 'submit_incomeAssign').val(null);
		$('#'+formId+'_'+ 'submit_incomeAssignOther').val(null);
		$('#'+formId+'_'+ 'submit_memo').val(null);
		$('#'+formId+'_'+ 'submit_remark1').val(null);
		$('#'+formId+'_'+ 'submit_remark2').val(null);
	};
	

	createRedistForm('regist_form','chanceInfo');
	$('#chanceInfo').on('click', 'button[name="rowCoop"]', function() {
		setModalData('regist_form','chanceInfo',this);
		$('#addTable').closest('tr').show();
		var cooperateTeam = '<table style="width: 735px;" class="table table-bordered" id="teamTable">';
		cooperateTeam += '<tr><th width="50px">处理</th>';
		cooperateTeam += '<th width="214px">所属部门</th>';
		cooperateTeam += '<th width="97px">薪酬级别</th>';
		cooperateTeam += '<th width="60px">时薪</th>';
		cooperateTeam += '<th width="150px">人数</th></tr>';
		cooperateTeam += '</table>';
		$('#regist_form_submit_cooperateTeam').html(cooperateTeam);
		$('#regist_modal').modal('show');
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
			if (document.getElementById("selectAll").checked) {
				for(var i=0;i<checklist.length;i++){
			    	checklist[i].checked = 1;
			    } 
			} else {
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
				$('#regist_form_submit_cooperateTeam').html(cooperateTeam);
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
					rformdataSet(object);
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

	function rformdataSet(object){
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
