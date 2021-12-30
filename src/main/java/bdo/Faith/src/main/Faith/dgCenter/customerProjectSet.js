(() => {


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
	if ((window.CUR_CUSTOMERID != null && window.CUR_CUSTOMERID != '')) {
		$('#set_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false, {param1: $('#set_customerId').val()}));
		$('#set_projectId').val(window.CUR_PROJECTID);
		setProjectInfo($('#set_projectId').val());
	}

	//客户选择
	$('#set_customerId').change(function() {
		//BDO_CUSTOMER_SELECT = $(this).val();
		$('#set_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false, {param1: $('#set_customerId').val()}));
		setProjectInfo($('#set_projectId').val());
	});

	//项目选择
	$('#set_projectId').change(function() {
		setProjectInfo($(this).val());
	});

	//确定
	$('#set_save').click(function() {


		var customerName = $('#set_customerId option:checked').text().split('-')[1];

		let param = {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: $('#set_customerId').val(),
			param2: customerName,
			param3: $('#set_projectId').val(),
			param4: $('#set_projectId option:checked').text(),
			param5: $('#set_auditStartDate').val(),
			param6: $('#set_auditEndDate').val()
		};
		if((!param.param3 || param.param3 <= '') || (!param.param1 || param.param1 <= '')) {
			bdoErrorBox('切换项目失败[0006]', '客户编号和项目编号不能为空。');
			return;
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
					window.CUR_CUSTOMERID = $('#set_customerId').val();
					window.BDO_CUSTOMER_SELECT = window.CUR_CUSTOMERID;
					window.CUR_CUSTOMERNAME = customerName;
					window.BDO_CUSTOMERNAME_SELECT = customerName;
					window.CUR_PROJECTID = $('#set_projectId').val();
					window.CUR_PROJECTNAME = $('#set_projectId option:checked').text().split('-')[1];
					window.CUR_PROJECT_START_YEAR = $('#set_auditStartDate').val().substr(0, 4);
					window.CUR_PROJECT_END_YEAR = $('#set_auditEndDate').val().substr(0, 4);
					window.CUR_PROJECT_START_MONTH = parseInt($('#set_auditStartDate').val().substr(5, 2));
					window.CUR_PROJECT_END_MONTH = parseInt($('#set_auditEndDate').val().substr(5, 2));
					window.BDO_PROJECTNAME_SELECT = window.CUR_PROJECTID + '-' + window.CUR_PROJECTNAME;
					/*$('#navCustomerName').text('客户：' + window.BDO_CUSTOMER_SELECT + '-' + window.BDO_CUSTOMERNAME_SELECT);
					$('#navProjectName').text('项目：' + window.BDO_PROJECTNAME_SELECT);*/
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
					
					if (bid && bid != 'null' && bid != 'undefined' && bid != '') {
						$('#main-container').load('general.do?menuid=' + bid);
					}
				} else {
					bdoErrorBox('设置失败', data.resultInfo.statusText);
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


	//查询并显示项目相关信息
	function setProjectInfo(projectId) {
		if ($('#set_projectId').val() == '' || $('#set_projectId').val() == null) {
			return;
		}

		$.ajax({
			type: 'post',
			url: 'dgCenter/CustomerProjectSet.getProjectInfo.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: projectId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success && data.data && data.data.length > 0) {
					var data = data.data[0];
					$('#set_auditStartDate').val(data.auditStartDate);
					$('#set_auditEndDate').val(data.auditEndDate);
					/*$('#set_auditStartDate').val(data.AuditTimeBegin);
					$('#set_auditEndDate').val(data.AuditTimeEnd);*/
				} else {

				}
			}
		});
	}


})();