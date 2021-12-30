var templateTab = function(tabId, customerId, templateId,optType){
	if($('#' + tabId + ' li a[href="#tab_templatedetail"]').length != 0){
		$('#' + tabId + ' a[href="#tab_templatedetail"]').remove()
		$('#tab_templatedetail').remove();
	}
	
	$('#' + tabId + '').append('<li><a href="#tab_templatedetail">模板详细&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_templatedetail"></div>');
	
	$('#' + tabId + ' a[href="#tab_templatedetail"]').find('.fa-times-circle').click(function(){
		$(this).parents('ul').find('li').first().find('a').click()
		$(this).parents('li').remove();
		$('#tab_templatedetail').remove();
	});
	

	var template = '<div class="content">';
		template += '<div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options">'
		if (optType == 'edit'){
			template += '<li><button id="templateDetail_saveSort" type="button"><i class="fa fa-save" style="color: white;">&nbsp;保存排序</i></button></li>'
		}
		template +=  '<li><button id="templateDetail_export" type="button"><i class="fa fa-download" style="color: white;">&nbsp;导出</i></button></li>'
		template +=  '</ul><h3 class="block-title">模板详细</h3></div><div class="block-content">'
		template +=  '<table id="templateDetail_table" class="table table-bordered table-hover"></table>'	
		template +=  '</div></div></div>';
			
	$('#tab_templatedetail').append(template);
	$('#' + tabId + ' a[href="#tab_templatedetail"]').click();
			

	var template_view = {
			localParam : {
				tabNum : true,
				url : 'cpBase/General.query.json',
				urlparam : {
					sqlId : 'FA40026',
					menuId : window.sys_menuId,
					start : -1,
					limit : -1,
					'param1' : templateId
				}
			},
			tableParam : {
				select : true,
				lengthChange : false,
				dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				order : [2, 'ASC'],
				serverSide : true,
				rowReorder : {
					update : false
				},
				columnDefs : [
					{
						targets : 1,
						orderable : false,
						className : 'text-center',
						title : '处理',
						width : '60px',
						render : function(data, type, row, meta) {
							var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
							if (optType == 'edit'){
								renderStr += '<button class="btn btn-xs btn-success" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
								renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
							}
							return renderStr;
						}
					},
				 {
					targets : 2,
					className : 'text-left',
					title : '报表项编号',
					name : 'colCode',
					data : 'colCode',
					width : '80px'
				}, {
					targets : 3,
					className : 'text-left',
					title : '报表项表示名',
					name : 'colDisp',
					data : 'colDisp',
					width : '250px',
					render: function(data, type, row, meta){
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0){
							return '<b>' + data + '</b>';
						}else{
							return data.replace(' ','&nbsp;&nbsp;');
						}
					}
				}, {
					targets : 4,
					className : 'text-center',
					title : '类别',
					name : 'subjectTypeName',
					data : 'subjectTypeName',
					width : '80px'
				}, {
					targets : 5,
					className : 'text-left',
					title : '计算公式',
					name : 'calFun',
					data : 'calFun',
					width : '250px'
				}]
			}
		};


	BdoDataTable('templateDetail_table', template_view);

	$('#templatecolEdit_form').formview({
		display : 'tableform-one',
		column : 4,
		buttons : [
			{
				id : 'templatecoledit_save',
				icon : 'fa-save',
				style : 'btn-primary',
				text : '&nbsp;保存'
			}, {
				id : 'templatecoledit_close',
				icon : 'fa-sign-out',
				style : 'btn-warning',
				text : '&nbsp;关闭'
			}
		],
		items : [
			{
				id :  'templatecol_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id : 'templatecol_code',
				type : 'input',
				label : '报表项编号',
				rowspan : 1
			},{
				id : 'templatecol_type',
				type : 'input',
				label : '报表项类别',
				rowspan : 1
			},{
				id : 'templatecol_dispname',
				type : 'input',
				label : '报表项表示名',
				validate : {
					rules : {
						required : true
					}
				},
				rowspan : 1
			},
			{
				id : 'templatecol_calfun',
				type : 'input',
				label : '计算公式',
				validate : {
					rules : {
						required : false
					}
				},
				rowspan : 1
			}
		]
	});

	//模板报表项修改保存
	$('#templatecoledit_save').click(function(){
		$('#templatecolEdit_form').formview(
			'setAjaxConf',
			[
				'dgCenter/SubjectManage.updateTemplateCol.json',
				{
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1 : $('#templatecol_id').val(),
					param2 : $('#templatecol_dispname').val(),
					param3 : encodeURIComponent($('#templatecol_calfun').val())
				},
				'json', true,
				function(data) {

					$('#templateDetail_table').DataTable().ajax.reload();
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
					$('#modal_templatecolEditform').modal('hide');
				}
			]
		)
		$('#templatecolEdit_form').submit();
	});

	$('#templatecoledit_close').click(function(){
		$('#modal_templatecolEditform').modal('hide');
	});



	//修改模板报表项
	$('#templateDetail_table').on('click', 'button[name="subEdit"]', function() {
		
		$('#templatecol_id, #templatecol_code,#templatecol_type').attr('disabled', 'disabled');
		var object = $('#templateDetail_table').DataTable().data()[$(this).closest('tr').index()];
		$('#templatecol_id').val(object.autoId);
		$('#templatecol_code').val(object.colCode);
		$('#templatecol_dispname').val(object.colDisp);
		$('#templatecol_type').val(object.subjectTypeName);
		$('#templatecol_calfun').val(object.calFun);
		$('#modal_templatecolEditform').modal('show');
	});

	//移除模板报表项
	$('#templateDetail_table').on('click', 'button[name="subDelete"]', function() {
		var object = $('#templateDetail_table').DataTable().data()[$(this).closest('tr').index()];
		
		
		$.ajax({
			url : 'dgCenter/SubjectManage.removeTemplateCol.json',
			type : 'post',
			data : {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1 : object.autoId
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#templateDetail_table').DataTable().ajax.reload();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			
			}
		});
		
	});

	
	
	/** 导出 */
	$('#templateDetail_export').click(function() {
		exportExcel(this, '模板详细', template_view, 'templateDetail_table');
	});
	


	//保存排序
	$('#templateDetail_saveSort').click(function() {
		var data = '';	
		$('#templateDetail_table tbody tr').each(function(){
			$(this).find('[name="tempAutoId"]').val();
			if (data == ''){
				data = $(this).find('[name="tempAutoId"]').val();
				
			}else{
				data = data + ',' + $(this).find('[name="tempAutoId"]').val();
			}
		});

		if (data == ''){
			return;
		}
		$.ajax({
			url : 'dgCenter/SubjectManage.saveSort.json',
			type : 'post',
			data : {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1 : data
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			
			}
		});
	});
	
}

