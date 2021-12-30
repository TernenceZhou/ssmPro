var variableId;
var variableName;
/**
 * 创建业务登记单
 * @param {} registFormId form元素Id
 * @param {} table 取record数据的datatable
 */
var createRedistForm = function(registFormId,table){
	/** 模态框设置 */
	$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $('.modal').css('overflow', 'hidden');
	    
	    $('.modal').on('mouseover', 'input', function(){
	    	$(this).closest('span').attr('title', $(this).val());
	    });
	    $('.modal').on('mouseover', 'select', function(){
	    	$(this).closest('span').attr('title', $(this).find("option:selected").text());
	    });
	});
	
	/** 模态框关闭 : 清除表单数据*/
	$('.modal').on('hidden.bs.modal', function (event) {
		$(event.target).find('input, select, textarea').removeAttr('disabled');
  		$(event.target).find('input, select, textarea').val(null);
  		$(event.target).find(':input[isTree]').treecombo('setTreeComboValue',[null, null]);
  		$(event.target).find('[id^="treecombocon"]').remove();
  		$(event.target).find('form td').removeClass('has-error');
  		$(event.target).find('form .help-block').remove();
	})
	
	
	$('#'+registFormId).formview({
		display : 'tableform-one',
		column : 4,
		buttons : [
			{
				id : registFormId + '_' + 'sub_save',
				icon : 'fa-floppy-o',
				style : 'btn-primary',
				text : '保存'
			},
			{
				id :  registFormId + '_' + 'sub_close',
				icon : 'fa-sign-out',
				style : 'btn-css1 btn-warning',
				text : '关闭'
			}
		],
		items : [
			{
				id :  registFormId + '_' + 'submit_registId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  registFormId + '_' + 'submit_businessId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				cellType : 'th',
				html : '基础信息'
			},{
				id :  registFormId + '_' + 'submit_departId',
				colspan : 2,
				label : '部门名称',
				type : 'input',
				typeAttr : {
					readonly : true
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
							folderSelectable: true,
							multiSelect: false
						}
					}
				}
			},{
				id :  registFormId + '_' + 'submit_partnerId',
				label : '分管合伙人',
				type : 'input',
				typeAttr : {
					readonly : true
				},
				validate : {
					rules : {
						required : true
					}
				},
				plugin : {
					name : 'treecombo',
					options :{
						url : './cpBase/TreeCommon.findUserTree.json',
						params : {},
						view : {
							leafIcon: 'fa fa-building text-flat',    
							folderSelectable: false
						}
					}
				}
			},{
				id :  registFormId + '_' + 'submit_contract',
				type : 'input',
				label : '联系人',
				validate : {
					rules : {
						required : true
					}
				}
			},{
				id :  registFormId + '_' + 'submit_contractWay',
				type : 'input',
				label : '联系方式',
				validate : {
					rules : {
						required : true
					}
				}
			},{
				rowspan : 4,
				cellType : 'th',
				html : '业务简介'
			},{
				id :  registFormId + '_' + 'submit_businessType',
				type : 'input',
				rowspan : 1,
				label : '业务类型',
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
				id :  registFormId + '_' + 'submit_customerName',
				type : 'input',
				label : '客户名称',
				validate : {
					rules : {
						required : true
					}
				}
			},{
				id :  registFormId + '_' + 'submit_customerProperties',
				type : 'select',
				label : '客户性质',
				html : ComboDicOption(true, '公司性质'),
				validate : {
					rules : {
						required : true
					}
				}
			},{
				id :  registFormId + '_' + 'submit_packageNum',
				type : 'input',
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
				},
				label : '分/子公司分包数量'
			},{
				id :  registFormId + '_' + 'submit_industry',
				type : 'input',
				label : '所属行业',
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
							leafIcon : 'fa fa-building text-flat',
							nodeIcon : 'fa fa-bank text-primary-light',
							folderSelectable : false,
							multiSelect : false
						}
					}
				}
			},{
				id :  registFormId + '_' + 'submit_workingPlace',
				type : 'input',
				rowspan : 1,
				label : '工作地点',
				validate : {
					rules : {
						required : true
					}
				}
			},{
				id :  registFormId + '_' + 'submit_projectStart',
				type : 'input',
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
				id :  registFormId + '_' + 'submit_projectEnd',
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
				id :  registFormId + '_' + 'submit_projectPeriod',
				type : 'input',
				label : '项目周期(天)',
				typeAttr : {
					normal : true,
					placeholder: '根据项目起止日期自动计算'
				}
			},{
				id :  registFormId + '_' + 'submit_projectCost',
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
				id :  registFormId + '_' + 'submit_cooperation',
				type : 'select',
				html : ComboDicOption(true, '合作意向'),
				rowspan : 1,
				label : '合作意向',
				validate : {
					rules : {
						required : true
					}
				}
			},{
				rowspan : 1,
				cellType : 'th',
				html : '合作信息'
			},{
				id :  registFormId + '_' + 'submit_cooperatorId',
				type : 'input',
				label : '合作联合方',
				validate : {
					rules : {
						required : true
					}
				},
				plugin : {
					name : 'treecombo',
					options :{
						url : './cpBase/TreeCommon.findHehuorenTree.json',
						params : {},
						view : {
							leafIcon: 'fa fa-building text-flat',    
							folderSelectable: false,
							onNodeSelected:　function(event , node){
								var partnerId = node.value;
								var partnerName =  node.text;
								var trList = $("#teamTable").find("tr");
								if(trList.length > 1){
									swal({
										title : '提示',
										text : '修改合作关联方将清空已填写的合作团队，确定要修改吗？',
										type : 'warning',
										showCancelButton : true,
										confirmButtonText : '确定',
										cancelButtonText : '取消'
									}).then(function(isConfirm){
											for(var i = 1; i < trList.length; i++){
												trList.eq(i).remove();
											}
											registTeamShow(partnerId, partnerName);
									},function(dismiss){
										 	$("#regist_form_submit_cooperatorId").attr("data-result",variableId);
											$("#regist_form_submit_cooperatorId").attr("data-content",variableName);
											$("#regist_form_submit_cooperatorId").val(variableName);		
									});
								} else {
									registTeamShow(partnerId, partnerName);
								}
							}
						}
					}
				}
				
			},{
				id :  registFormId + '_' + 'submit_incomeAssign',
				type : 'select',
				html : ComboDicOption(true, '分配意向'),
				label : '分配意向',
				validate : {
					rules : {
						required : true
					}
				}
			},{
				id :  registFormId + '_' + 'submit_incomeAssignOther',
				type : 'textarea',
				typeAttr: {
					normal : true,
					placeholder: '1.按劳取薪：按各级别人工单价及工时结算；2.收入划分：按贡献度划分业务收入；3.其他',
					rows : 1
				},
				validate : {
					rules : {
						maxlength : 100
					}
				},
				colspan : 3,
				label : '其他'
			},{
				rowspan : 1,
				cellType : 'th',
				html : '合同'
			},{
				id :  registFormId + '_' + 'submit_register',
				type : 'div',
				colspan : 5
			},{
				rowspan : 1,
				cellType : 'th',
				html : '财务划转'
			},{
				id :  registFormId + '_' + 'submit_transfer',
				type : 'div',
				colspan : 5
			},{
				rowspan : 2,
				cellType : 'th',
				html : '业务难点'
			},{
				id :  registFormId + '_' + 'submit_remark1',
				type : 'textarea',
				label : '技术指引标准',
				typeAttr: {
					normal : true,
					rows : 2
				},
				validate : {
					rules : {
						maxlength : 200
					}
				},
				colspan : 5
			},{
				id :  registFormId + '_' + 'submit_remark2',
				type : 'textarea',
				label : '客户关系维护',
				rowspan : 1,
				typeAttr: {
					rows : 2
				},
				colspan : 5,
				validate : {
					rules : {
						required : true,
						maxlength : 200
					}
				}
			},{
				rowspan : 1,
				cellType : 'th',
				html : '备注'
			},{
				id :  registFormId + '_' + 'submit_memo',
				type : 'textarea',
				typeAttr: {
					normal : true,
					rows : 2
				},
				validate : {
					rules : {
						maxlength : 200
					}
				},
				colspan : 5
			},{
				rowspan : 1,
				cellType : 'th',
				html : '合作团队<br><a class="btn btn-primary" id="addTable"><i class="fa fa-plus">&nbsp;新增</i></a>'
			},{
				id :  registFormId + '_' + 'submit_cooperateTeam',
				type : 'div',
				colspan : 5
			}
		]
	});
	
	/** 模态框 新增、修改 */
	$('#'+ registFormId + '_' + 'sub_save').click(function(){
		if($('#'+ registFormId + '_' + 'submit_projectStart').val() > $('#'+ registFormId + '_' + 'submit_projectEnd').val()){
			bdoErrorBox('失败', '项目结束日期需大于项目开始日期');
			return;
		}
		var teamDataList = []
		var trList = $("#teamTable").find("tr");
		for(var i = 1; i < trList.length; i++){
			var teamData = {} ;
			var tdArr = trList.eq(i).find("td");
			teamData.deptId = tdArr.eq(1).find('input').attr("name");
			teamData.payBand = tdArr.eq(2).find('input').val();
			teamData.hourlyWage = tdArr.eq(3).find('input').val();
			teamData.peopleNum = tdArr.eq(4).find('input').val().trim();
			if(teamData.peopleNum.length > 5){
				bdoErrorBox('失败', "合作团队输入的人数位数过大");
				return;
			}
			if(teamData.peopleNum.length == 0){
				bdoErrorBox('失败', "请输入合作团队人数");
				return;
			}
			if(teamData.peopleNum < 1){
				bdoErrorBox('失败', "请输入不小于1的数值");
				return;
			}
			teamDataList.push(teamData);
		}
		var data = {
			param1 : JSON.stringify({
				registId : $('#'+ registFormId + '_' + 'submit_registId').val(),
				businessId : $('#'+ registFormId + '_' + 'submit_businessId').val(),
				departId : $('#'+ registFormId + '_' + 'submit_departId').treecombo('getTreeComboValue'),
				partnerId : $('#'+ registFormId + '_' + 'submit_partnerId').treecombo('getTreeComboValue'),
				contract : $('#'+ registFormId + '_' + 'submit_contract').val(),
				contractWay : $('#'+ registFormId + '_' + 'submit_contractWay').val(),
				businessType : $('#'+ registFormId + '_' + 'submit_businessType').treecombo('getTreeComboValue'),
				customerName : $('#'+ registFormId + '_' + 'submit_customerName').val(),
				customerProperties : $('#'+ registFormId + '_' + 'submit_customerProperties').val(),
				packageNum : $('#'+ registFormId + '_' + 'submit_packageNum').val(),
				industry : $('#'+ registFormId + '_' + 'submit_industry').treecombo('getTreeComboValue'),
				workingPlace : $('#'+ registFormId + '_' + 'submit_workingPlace').val(),
				projectStart : $('#'+ registFormId + '_' + 'submit_projectStart').val(),
				projectEnd : $('#'+ registFormId + '_' + 'submit_projectEnd').val(),
				projectCost : $('#'+ registFormId + '_' + 'submit_projectCost').val(),
				cooperation : $('#'+ registFormId + '_' + 'submit_cooperation').val(),
				cooperatorId : $('#'+ registFormId + '_' + 'submit_cooperatorId').treecombo('getTreeComboValue'),
				incomeAssign : $('#'+ registFormId + '_' + 'submit_incomeAssign').val(),
				incomeAssignOther : $('#'+ registFormId + '_' + 'submit_incomeAssignOther').val(),
				remark1 : $('#'+ registFormId + '_' + 'submit_remark1').val(),
				remark2 : $('#'+ registFormId + '_' + 'submit_remark2').val(),
				memo : $('#'+ registFormId + '_' + 'submit_memo').val(),
				teamDataList : teamDataList
			})
		}
		var submitUrl = null;
		var registId = $('#'+ registFormId + '_' + 'submit_registId').val();
		if(registId){
			submitUrl='cpShare/CoopRegist.registEdit.json';
		}else{
			submitUrl='cpShare/CoopRegist.registAdd.json';
		}
		$('#'+registFormId).formview(
			'setAjaxConf',
			[
				submitUrl,
				data,
				'json',true,
				function(data) {
					$('#'+table).DataTable().ajax.reload();
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#'+ registFormId).closest("div.modal").modal('hide');
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			]
		)
		$('#'+registFormId).submit();
	});
	
	/** 模态框 关闭 */
	$('button[name="sub_close"], #'+ registFormId + '_' +'sub_close').click(function() {
		$(this).closest("div.modal").modal('hide');
	});
	
	$('#'+ registFormId + '_' + 'submit_projectStart').change(function(){
		var startTime = $('#'+ registFormId + '_' + 'submit_projectStart').val();
//		var pickdate = new Date(startTime);
//		pickdate.setDate(pickdate.getDate()+90);
//		$('#'+ registFormId + '_' + 'submit_projectEnd').datepicker('setDate', pickdate);
		
		var endTime = $('#'+ registFormId + '_' + 'submit_projectEnd').val();
		Date.prototype.diff = function(date){
			return (this.getTime() - date.getTime())/(24 * 60 * 60 * 1000);
		}
		if(startTime != "" && endTime != ""){
			$('#'+ registFormId + '_' + 'submit_projectPeriod').val(new Date(endTime).diff(new Date(startTime)));	
		} else {
			$('#'+ registFormId + '_' + 'submit_projectPeriod').val("");	
		}
	})

	$('#'+ registFormId + '_' + 'submit_projectEnd').change(function(){
		
		var startTime = $('#'+ registFormId + '_' + 'submit_projectStart').val();
		var endTime = $('#'+ registFormId + '_' + 'submit_projectEnd').val();
		Date.prototype.diff = function(date){
			return (this.getTime() - date.getTime())/(24 * 60 * 60 * 1000);
		}
		if(startTime != "" && endTime != ""){
			$('#'+ registFormId + '_' + 'submit_projectPeriod').val(new Date(endTime).diff(new Date(startTime)));	
		} else {
			$('#'+ registFormId + '_' + 'submit_projectPeriod').val("");	
		}
	})
	
};

function registTeamShow(partnerId, partnerName){
	variableId = partnerId;
	variableName = partnerName;
	$.ajax({
		url : 'cpShare/CoopRegist.searchTopManageDept.json',
		type : 'post',
		data : {
			param1 : partnerId
		},
		dataType: 'json',
		async : false,
		success : function(data){
			if(data.data[0].topManageDepId != 1){
				$('#addTable').closest('tr').hide();
				$('#teamTable').remove();
			} else {
				$('#addTable').closest('tr').show();
			}
		}
	});
}

function registerInfoGet(registId, divId){
	$('#'+divId).html('');
	$.ajax({
		type : 'post',
		url : 'cpShare/CoopRegist.registerInfo.json',
		data : {
			param1 : registId
		},
		dataType : 'json',
		success : function(data){
			if(data.totalCount == 0){
				$('#'+divId).html('没有关联合同');
				return;
			}
			var registertb = '<div style="overflow-x: scroll;width: 740px;max-height: 300px;">';
			registertb +=  '<table id="registerTb" style="width: 1500px;" class="table table-bordered table-striped"><tr>';
			registertb += '<th width="100px">处理</th>';
			registertb += '<th width="150px">来源</th>';
//			registertb += '<th width="100px">项目编号</th>';
//			registertb += '<th width="200px">项目名称</th>';
			registertb += '<th width="150px">流水号</th>';
			registertb += '<th width="250px">编号</th>';
			registertb += '<th width="150px">委托客户</th>';
			registertb += '<th width="100px">签订日期</th>';
			registertb += '<th width="100px">合同金额</th>';
			registertb += '<th width="100px">合同执行状况</th>';
//			registertb += '<th width="100px">报告性质</th>';
//			registertb += '<th width="100px">底稿性质</th>';
//			registertb += '<th width="100px">业务类型</th>';
//			registertb += '<th width="100px">项目负责人</th>';
			registertb += '<th width="100px">合同已开票</th>';
			registertb += '<th width="100px">合同已收款</th></tr>';
			$.each(data.data, function(index, info){
				registertb += '<tr>';
				registertb += '<td class="text-center">';
				if(window.sys_menuId == '20000042' && info.registRole == '0'){
					registertb += '<a name="registerUnlink" class="btn btn-xs btn-danger" data-placement="top" title="解除关联合同" data-toggle="tooltip"><i class="fa fa-times"></i></a>&nbsp;';
					if('1' == info.registerMoneyShow){
						registertb += '<a name="registerMoney" class="btn btn-xs btn-warning" data-placement="top" title="隐藏合同金额" data-toggle="tooltip"><i class="fa fa-file"></i></a>&nbsp;';
					} else{
						registertb += '<a name="registerMoney" class="btn btn-xs btn-success" data-placement="top" title="显示合同金额" data-toggle="tooltip"><i class="fa fa-file"></i></a>&nbsp;';
					}
					if('1' == info.financeMoneyShow){
						registertb += '<a name="financeMoney" class="btn btn-xs btn-warning" data-placement="top" title="隐藏财务金额" data-toggle="tooltip"><i class="fa fa-bar-chart"></i></a>&nbsp;';
					} else{
						registertb += '<a name="financeMoney" class="btn btn-xs btn-success" data-placement="top" title="显示财务金额" data-toggle="tooltip"><i class="fa fa-bar-chart"></i></a>&nbsp;';
					}
				}
				if(window.sys_menuId == '20000046' && info.registRole == '1'){
					registertb += '<a name="registerUnlink" class="btn btn-xs btn-danger" data-placement="top" title="解除关联合同" data-toggle="tooltip"><i class="fa fa-times"></i></a>&nbsp;';
					if('1' == info.registerMoneyShow){
						registertb += '<a name="registerMoney" class="btn btn-xs btn-warning" data-placement="top" title="隐藏合同金额" data-toggle="tooltip"><i class="fa fa-file"></i></a>&nbsp;';
					} else{
						registertb += '<a name="registerMoney" class="btn btn-xs btn-success" data-placement="top" title="显示合同金额" data-toggle="tooltip"><i class="fa fa-file"></i></a>&nbsp;';
					}
					if('1' == info.financeMoneyShow){
						registertb += '<a name="financeMoney" class="btn btn-xs btn-warning" data-placement="top" title="隐藏财务金额" data-toggle="tooltip"><i class="fa fa-bar-chart"></i></a>&nbsp;';
					} else{
						registertb += '<a name="financeMoney" class="btn btn-xs btn-success" data-placement="top" title="显示财务金额" data-toggle="tooltip"><i class="fa fa-bar-chart"></i></a>&nbsp;';
					}
				}
				registertb += '</td>';
				registertb += '<td class="text-center">' + (info.registerType ? info.registerType : '') + '</td>';
//				registertb += '<td class="text-center">' + (info.projectId ? info.projectId : '') + '</td>';
//				registertb += '<td>' + (info.projectName ? info.projectName : '') + '</td>';
				registertb += '<td class="text-center">' + info.registerNum + '</td>';
				registertb += '<td>' + (info.entrustNumber ? info.entrustNumber : '') + '</td>';
				registertb += '<td>' + (info.customerName ? info.customerName : '') + '</td>';
				registertb += '<td class="text-right">' + (info.signedDate ? info.signedDate : '') + '</td>';
				registertb += '<td class="text-center">';
				if(window.sys_menuId == '20000042'){
					if(info.registRole == '1'){
						registertb += ('1' == info.registerMoneyShow) ? info.businessCost : '**';
					} else{
						registertb += (info.businessCost ? info.businessCost : '');
					}
				} else if(window.sys_menuId == '20000046'){
					if(info.registRole == '0'){
						registertb += ('1' == info.registerMoneyShow) ? info.businessCost : '**';
					} else{
						registertb += (info.businessCost ? info.businessCost : '');
					}
				} else{
					registertb += info.businessCost;
				}
				registertb += '</td>';
				registertb += '<td class="text-center">' + (info.state ? info.state : '') + '</td>';
//				registertb += '<td class="text-center">' + (info.reportProperty ? info.reportProperty : '') + '</td>';
//				registertb += '<td class="text-center">' + (info.draftProperty ? info.draftProperty : '') + '</td>';
//				registertb += '<td class="text-center">' + (info.businessType ? info.businessType : '') + '</td>';
//				registertb += '<td class="text-center">' + (info.projectManagerName ? info.projectManagerName : '') + '</td>';
				if(window.sys_menuId == '20000042'){
					if(info.registRole == '1'){
						registertb += '<td class="text-right">' + (('1' == info.financeMoneyShow) ? info.money : '**') + '</td>';
						registertb += '<td class="text-right">' + (('1' == info.financeMoneyShow) ? info.receiceMoney : '**') + '</td>';
					} else{
						registertb += '<td class="text-right">' + info.money + '</td>';
						registertb += '<td class="text-right">' + info.receiceMoney + '</td>';
					}
				} else if(window.sys_menuId == '20000046'){
					if(info.registRole == '0'){
						registertb += '<td class="text-right">' + (('1' == info.financeMoneyShow) ? info.money : '**') + '</td>';
						registertb += '<td class="text-right">' + (('1' == info.financeMoneyShow) ? info.receiceMoney : '**') + '</td>';
					} else{
						registertb += '<td class="text-right">' + (info.money ? info.money : '') + '</td>';
						registertb += '<td class="text-right">' + (info.receiceMoney ? info.receiceMoney : '') + '</td>';
					}
				} else{
					registertb += '<td class="text-right">' + info.money + '</td>';
					registertb += '<td class="text-right">' + info.receiceMoney + '</td>';
				}
				registertb += '</tr>';
			});
			registertb += '</table></div>';
			$('#'+divId).html(registertb);
		}
	})
}

function financeTransfer(registId, divId){
	$('#'+divId).html('');
	$.ajax({
		type : 'post',
		url : 'cpShare/CoopRegist.financeInfo.json',
		data : {
			param1 : registId
		},
		dataType : 'json',
		success : function(data){
			if(data.totalCount == 0){
				$('#'+divId).html('没有财务划转信息');
				return;
			}
			var registertb = '<div style="overflow-x: scroll;width: 740px;max-height: 300px;">';
			registertb +=  '<table id="financeTb" style="width: 1300px;" class="table table-bordered table-striped"><tr>';
			registertb += '<th width="150px">合同流水号</th>';
			registertb += '<th width="250px">合同编号</th>';
			registertb += '<th width="150px">合同来源</th>';
			registertb += '<th width="150px">划转类型</th>';
			registertb += '<th width="100px">划转金额</th>';
			registertb += '<th width="200px">划出部门</th>';
			registertb += '<th width="200px">划入部门</th>';
			$.each(data.data, function(index, info){
				registertb += '<tr>';
				registertb += '<td class="text-center">' + (info.registerNum ? info.registerNum : '') + '</td>';
				registertb += '<td>' + info.entrustNumber + '</td>';
				registertb += '<td class="text-center">' + (info.registerType ? info.registerType : '') + '</td>';
				registertb += '<td class="text-center">' + (info.ssassignType ? info.ssassignType : '') + '</td>';
				registertb += '<td class="text-right">' + (info.disMoney ? info.disMoney : '') + '</td>';
				registertb += '<td>' + (info.__douthrDeptId.departName ? (info.__douthrDeptId.topManageDepName + '-' + info.__douthrDeptId.departName) : '') + '</td>';
				if(info.ssassignType == '内部划转'){
					registertb += '<td>' + (info.__diinhrDeptId.departName ? (info.__diinhrDeptId.topManageDepName + '-' + info.__diinhrDeptId.departName) : '') + '</td>';
				} else{
					registertb += '<td>' + (info.oinhrDeptId ? info.oinhrDeptId : '') + '</td>';
				}
				registertb += '</tr>';
			});
			registertb += '</table></div>';
			$('#'+divId).html(registertb);
		}
	});
}

function registTeamData(registId, divId){
	$.ajax({
		url : 'cusBase/CusGeneral.query.json',
		type : 'post',
		data : {
			param1 : registId,
			menuId : window.sys_menuId,
			sqlId : 'CP00031'
		},
		dataType: 'json',
		async : false,
		success : function(data){
			var dataNum = data.data.length;
			var teamTableData='';
			if(dataNum == 0 || dataNum == null){
				teamTableData += '没有合作团队信息';
				$('#'+divId).html(teamTableData);
			} else {
				teamTableData += '<table style="width: 735px;" class="table table-bordered" id="teamTable">';
				teamTableData += '<tr><th width="50px">处理</th>';
				teamTableData += '<th width="214px">所属部门</th>';
				teamTableData += '<th width="97px">薪酬级别</th>';
				teamTableData += '<th width="60px">时薪</th>';
				teamTableData += '<th width="150px">人数</th></tr>';
				for(var i = 0; i < dataNum; i++){
					 teamTableData += '<tr><td class="text-center"><div class="form-material"><button class="btn btn-xs btn-danger" type="button" name="delTeam" data-placement="top" title="删除" data-toggle="tooltip">'
			 			+ '<i class="fa fa-times"></i></button></div></td>';
					 teamTableData += '<td><div class="form-material"><input class="form-control" type="text" ' +
						'value="'+ data.data[i].__ddepartId.topManageDepName + '-' + data.data[i].__ddepartId.departName +'" ' +
						'name="'+ data.data[i].__ddepartId.departId +'" disabled /></div></td>';
					 teamTableData += '<td><div class="form-material"><input class="form-control" type="text" value="'+ data.data[i].sRole +'"  disabled /></div></td>';
					 teamTableData += '<td><div class="form-material"><input class="form-control" type="text" value="'+ data.data[i].hourlyWage +'" disabled /></div></td>';
					 teamTableData += '<td><div class="has-success"><div class="form-material"><input class="form-control" type="number" min="1" value="'+ data.data[i].menNum +'" /></div></div></td></tr>';
				}
				 teamTableData += '</table>';
			$('#'+divId).html(teamTableData);
			}
		}
	});
}