function CustomerProjectSetPage(options) {
	window.xxrPageKey = '项目设置';
	var template_ = tplLoader('dgCenter/html/dg/customerProjectSet.html');
	$('#customerProjectSetPage').html(template_);
	$('#set_cancel').hide();
	$('#set_proccess').hide();
	pageRightTitle(pageTitleArr);
	uiBlocksApi(false, 'init');

	var table = 'tb_tab';
	var tableCheck = 'tb_tbcheck';

	/*$('[data-toggle="tabs"]').on('click', 'a', function(e){
		e.preventDefault();
		$(this).tab('show');
	});*/

	/** 模态框设置 */
	/*$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $(this).css('overflow', 'hidden');
	});*/
	// 客户
	getUserCustomers2('set_customerId', window.CUR_CUSTOMERID);
	//项目
	if ((CUR_CUSTOMERID != null && window.CUR_CUSTOMERID != '' && window.CUR_CUSTOMERID != 'null')) {
		$('#set_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false, {param1: window.CUR_CUSTOMERID}));
		$('#set_projectId').val(CUR_PROJECTID);
		setProjectInfo($('#set_projectId').val());
	}

	//客户选择
	$('#set_customerId').change(function() {
		//BDO_CUSTOMER_SELECT = $(this).val();
		$('#set_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false, {param1: $('#set_customerId').val()}));
		setProjectInfo($('#set_projectId').val(), true);
	});

	//项目选择
	$('#set_projectId').change(function() {
		setProjectInfo($(this).val(), true);
	});

	
	
	function saveProject(param) {
		if(!param.param3 || param.param3 == '') {
			bdoErrorBox('错误', '项目编号不能为空！');
		}
		$.ajax({
			type: 'post',
			url: 'dgCenter/CustomerProjectSet.save.json',
			data: param,
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					reLoadLoginData();
					bdoSuccessBox('设置成功', data.resultInfo.statusText);
					if (!data.data) {
						options.projectSelected && options.projectSelected();
						return;
					}
					let resultData = data.data[0];
					window.CUR_DGPROJECT_AUTOID = resultData.autoId;
					window.CUR_CUSTOMERID = resultData.customerId;
					window.BDO_CUSTOMER_SELECT = window.CUR_CUSTOMERID;
					window.CUR_CUSTOMERNAME = resultData.customerName;
					window.BDO_CUSTOMERNAME_SELECT = resultData.customerName;
					window.CUR_PROJECTID = resultData.projectId;
					window.CUR_PROJECTNAME = resultData.projectName.split('-')[1];
					window.CUR_PROJECT_START_YEAR = resultData.auditStartYear;
					window.CUR_PROJECT_END_YEAR = resultData.auditEndYear;
					window.CUR_PROJECT_START_MONTH = resultData.auditEndYear;
					window.CUR_PROJECT_END_MONTH = resultData.auditEndMonth;
					window.BDO_PROJECTNAME_SELECT = window.CUR_PROJECTID + '-' + window.CUR_PROJECTNAME;
					window.CUR_PROJECT_ACC_YEAR = resultData.dgAccYear;
					let navCustomerNameText = (window.BDO_CUSTOMER_SELECT && window.BDO_CUSTOMER_SELECT != 'null' ? window.BDO_CUSTOMER_SELECT + '-' + window.BDO_CUSTOMERNAME_SELECT : '');
					if(navCustomerNameText > '') {
						navCustomerNameText = '客户：' + navCustomerNameText;
					}
					let navProjectNameText = (window.BDO_PROJECTNAME_SELECT && window.BDO_PROJECTNAME_SELECT != 'null' ? window.BDO_PROJECTNAME_SELECT : '');
					if(navProjectNameText > '') {
						navProjectNameText = '项目：' + navProjectNameText;
					}
					$('#navCustomerName').text(navCustomerNameText);
					$('#navProjectName').text(navProjectNameText);
					if (bid != window.sys_menuId) {
						if (bid && bid != 'null' && bid != 'undefined' && bid != '') {
							$('#main-container').load('general.do?menuid=' + bid);
							return;
						}
					}
					options.projectSelected && options.projectSelected();
				} else {
					if(data.resultInfo.statusText=='归档中，无法进入项目'){
						$('#set_cancel').show();
					}
					bdoErrorBox('设置失败', data.resultInfo.statusText);
				}
			}
		});
	}

	//确定
	$('#set_save').click(function() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00142',
				param1: $('#set_projectId').val(),
				param2: $('#set_customerId').val(),
				param3: sys_userId,
				limit: -1,
				start: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					$.sessionStorage('loginData', null);
					if (data.data.length == 0) {
						var customerName = $('#set_customerId option:checked').text().split('-')[1];
						let param = {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: $('#set_customerId').val(),
							param2: customerName,
							param3: $('#set_projectId').val(),
							param4: $('#set_projectId option:checked').text(),
							param5: $('#set_auditStartDate').val(),
							param6: $('#set_auditEndDate').val(),
							lockProjectId: '0'
						};
						if((!param.param3 || param.param3 <= '') || (!param.param1 || param.param1 <= '')) {
							bdoErrorBox('切换项目失败[0001]', '客户编号和项目编号不能为空。');
						}
						saveProject(param);
					} else {
						bdoErrorBox('切换项目失败', '您没有该项目权限');
					}

				} else {
					bdoErrorBox('切换项目失败', data.resultInfo.statusText);
				}
			}
		});

	});
	$('#set_cancel').click(function(){
		$.ajax({
			type: 'post',
			url: 'dgCenter/ProjectArchive.saveProjectArchive.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: $('#set_customerId').val(),
				param2: $('#set_projectId').val(),
				param3: 0
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					bdoSuccessBox('成功', '取消归档成功！');
					$('#set_cancel').hide();
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
	$('#set_clear').click(function() {
		$('#set_customerId').val('').trigger('change');
		$('#set_projectId').val('');
		$('#set_auditStartDate').val('');
		$('#set_auditEndDate').val('');
	});

	// 客户刷新
	$('#set_refresh').click(function() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/CustomerProjectSet.refreshUserCustomers.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: sys_userId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					userCustomers = data.data[0].userCustomers;
					$('#set_customerId').empty();
					$('#set_customerId').append('<option value=""></option>');
					// 客户
					getUserCustomers2('set_customerId', window.CUR_CUSTOMERID);
					$('#set_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false, {param1: window.CUR_CUSTOMERID}));
					$('#set_projectId').val(CUR_PROJECTID);
					setProjectInfo($('#set_projectId').val(), true);
					bdoSuccessBox('刷新成功');
				}
			}
		});
	});

	//查询并显示项目相关信息
	function setProjectInfo(projectId, isChangeProject) {
		if ($('#set_projectId').val() == '' || $('#set_projectId').val() == null) {
			return;
		}

		$.ajax({
			type: 'post',
			url: 'dgCenter/CustomerProjectSet.getProjectArchiveState.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: projectId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success && data.data && data.data.length > 0) {
					var data = data.data[0];
					if(data.flag == '1') {
						$('#set_cancel').show();
					} else if(data.flag == '3') {
						$('#set_cancel').hide();
						$('#set_proccess').show();
					} else {
						$('#set_proccess').hide();
						$('#set_cancel').hide();
					}
				} else {
					//bdoInfoBox('提示', data.resultInfo.statusText);
				}
			}
		});
		
		
		$.ajax({
			type: 'post',
			url: 'dgCenter/CustomerProjectSet.getProjectInfo.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: projectId,
				param25: isChangeProject ? 'CHANGE_PROJECT' : null,     // 切换项目，不要提示重置中
			},
			dataType: 'json',
			success: function(data) {
				if (data.success && data.data && data.data.length > 0) {
					var data = data.data[0];
					/*$('#set_auditStartDate').val(data.AuditTimeBegin);
					$('#set_auditEndDate').val(data.AuditTimeEnd);*/
					$('#set_auditStartDate').val(data.auditStartDate);
					$('#set_auditEndDate').val(data.auditEndDate);
				} else {
					//bdoInfoBox('提示', data.resultInfo.statusText);
				}
			}
		});
	}

	if (!options.selectting && (window.CUR_PROJECTID && window.CUR_PROJECTID != '' && window.CUR_PROJECTID != 'null') && (bid == window.sys_menuId || bid == 'null' || bid == '' || !bid || bid == 'undefined')) {
		options.projectSelected && options.projectSelected();
	}
	let colors = ['bg-modern', 'bg-primary', 'bg-success', 'bg-primary-dark', 'bg-amethyst', 'bg-city'];
	let colorsLen = colors.length;
	template('./projectHhistoryTpl', `
		<div class="row">
			{{each historyData item index}}
			<div class="col-sm-12 col-md-6 col-lg-2 n5" style="height:140px;">
				<a class="block block-link-hover3 text-left opt-save-project" href="javascript:void(0)" 
				data-projinfo-index-id="{{index}}"
				>
					<div class="block-content block-content-full {{colors[index%colorsLen]}}">
						<!--<i class="si si-music-tone fa-4x text-primary-darker"></i>-->
						<div class="font-w600 text-white-op push-15-t" ><span class="fa fa-product-hunt" style="font-size:16px;"></span><span style="margin-left:4px;">：</span><span>{{item.projectName}}</span></div>
						<div class="font-w600 text-white-op push-15-t" ><span class="fa fa-user-circle-o" style="font-size:16px;"></span><span style="margin-left:4px;">：</span><span>{{item.__umanagerName}}</span></div>
					</div>
				</a>
			</div>
			{{/each}}
		</div>
	`);
	let projectHistoryInfos = [];

	// 切换项目历史
	function showChangeHistory(data) {
		if (data) {
			projectHistoryInfos = data;
			let html = template('./projectHhistoryTpl', {historyData: data, colors: colors, colorsLen: colorsLen});
			$('#projectSetChangeHistory').empty().html(html);
		}
	}

	function getChangeHistoryData() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00076',
				param1: window.CUR_CUSTOMERID,
				limit: -1,
				start: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					showChangeHistory(data.data);
				} else {
					bdoErrorBox('获取切换项目历史记录失败', data.resultInfo.statusText);
				}
			}
		});
	}

	if (options.selectting) {
		getChangeHistoryData();
		$('#projectSetChangeHistory').on('click', 'a.opt-save-project', function(event) {
			let $el = $(event.currentTarget);
			let index = $el.attr('data-projinfo-index-id');
			let projectInfo = projectHistoryInfos[index];
			/*$('#set_projectId').val(projectInfo.projectId);
			$('#set_customerId').val(projectInfo.customerId);*/
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00142',
					param1: projectInfo.projectId,
					param2: projectInfo.customerId,
					param3: sys_userId,
					limit: -1,
					start: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data.length == 0) {
							event.preventDefault();
							let $el = $(event.currentTarget);
							let index = $el.attr('data-projinfo-index-id');
							let projectInfo = projectHistoryInfos[index];
							let param = {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: projectInfo.customerId,
								param2: projectInfo.customerName.split('-')[1],
								param3: projectInfo.projectId,
								param4: projectInfo.projectName,
								param5: projectInfo.auditTimeBegin,
								param6: projectInfo.auditTimeEnd,
								lockProjectId: '0'
							};
							if((!param.param3 || param.param3 <= '') || (!param.param1 || param.param1 <= '')) {
								bdoErrorBox('切换项目失败[0002]', '客户编号和项目编号不能为空。');
							}
							saveProject(param);
						} else {
							bdoErrorBox('切换项目失败', '您没有该项目权限');
						}

					} else {
						bdoErrorBox('切换项目失败', data.resultInfo.statusText);
					}
				}
			});

		});
	}else{
		getChangeHistoryData();
		$('#projectSetChangeHistory').on('click', 'a.opt-save-project', function(event) {
			let $el = $(event.currentTarget);
			let index = $el.attr('data-projinfo-index-id');
			let projectInfo = projectHistoryInfos[index];
			/*$('#set_projectId').val(projectInfo.projectId);
			$('#set_customerId').val(projectInfo.customerId);*/
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00142',
					param1: projectInfo.projectId,
					param2: projectInfo.customerId,
					param3: sys_userId,
					limit: -1,
					start: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$.sessionStorage('loginData', null);
						if (data.data.length == 0) {
							event.preventDefault();
							let $el = $(event.currentTarget);
							let index = $el.attr('data-projinfo-index-id');
							let projectInfo = projectHistoryInfos[index];
							let param = {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: projectInfo.customerId,
								param2: projectInfo.customerName.split('-')[1],
								param3: projectInfo.projectId,
								param4: projectInfo.projectName,
								param5: projectInfo.auditTimeBegin,
								param6: projectInfo.auditTimeEnd,
								lockProjectId: '0'
							};
							if((!param.param3 || param.param3 <= '') || (!param.param1 || param.param1 <= '')) {
								bdoErrorBox('切换项目失败[0003]', '客户编号和项目编号不能为空。');
							}
							saveProject(param);
						} else {
							bdoErrorBox('切换项目失败', '您没有该项目权限');
						}

					} else {
						bdoErrorBox('切换项目失败', data.resultInfo.statusText);
					}
				}
			});

		});
	}
}

$(document).ready(() => {
	CustomerProjectSetPage({
		projectSelected() {
			ProjectctrPage();
		},
		selectting: false
	});
});