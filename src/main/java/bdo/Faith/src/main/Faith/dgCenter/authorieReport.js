//$(document).ready(function(){
//	pageRightTitle(pageTitleArr);
//	
//	var table = 'rpt_tab';
//	
//	var customerAmoutMap = {};
//	
//	uiBlocksApi(false, 'init');
//	/*$('[data-toggle="tabs"]').on('click', 'a', function(e){
//		e.preventDefault();
//		$(this).tab('show');
//	});*/
//	/** 模态框设置 */
//	/*$('.modal').on('show.bs.modal', function(){
//	    $(this).draggable({
//			handle: '.block-header',
//			cursor: 'move'
//	    });
//	    $(this).css('overflow', 'hidden');
//	});*/
//	// 客户
//	//getUserCustomers('rpt_customerId');
//	//getUserCustomers2('rpt_customerId',CUR_CUSTOMERID);
//	$('#rpt_customerId').val(CUR_CUSTOMERID + '-' + CUR_CUSTOMERNAME);
//	// 日期
//	getUserYear('rpt_startYear');
//	getUserYear('rpt_endYear');
//	$('#rpt_startYear').val(CUR_PROJECT_START_YEAR);
//	$('#rpt_endYear').val(CUR_PROJECT_END_YEAR);
//	$.ajax({
//		url : 'dgCenter/DgAdjust.findProjectInfo.json',
//		type : 'post',
//		async : false,
//		data : {param1 : window.CUR_CUSTOMERID, param2 : window.CUR_PROJECTID},
//		dataType : 'json',
//		success : function(data) {
//			if (!data.data || !data.data[0].year) {
//				return;
//			}
//			$('#rpt_startYear').val(data.data[0].year);
//			$('#rpt_endYear').val(data.data[0].year);
//		}
//	});
//	$('#cus_select').text('【' + CUR_PROJECTNAME+'   '+CUR_PROJECT_START_YEAR+'-'+CUR_PROJECT_START_MONTH+'~'+CUR_PROJECT_END_YEAR+'-'+CUR_PROJECT_END_MONTH + '】');
//
//	
//	$('#rpt_showZero').val(1);
//	
//	getUserYear('import_startYear');
//	getUserYear('import_endYear');
//
//	/** table 属性 */
//	var rpt_view = {
//			localParam : {
//				tabNum : true,
//				url : 'dgCenter/FUnAuditReport.unAuditReport.json',
//				urlparam : {
//					menuId : window.sys_menuId
//				}
//			},
//			tableParam : {}
//		};
//
//	/** 单元格双击事件 */
//	$('#' + table).on('dblclick','td',function(){
//		var td = $(this);		
//		var th = $('#'+table).DataTable().context[0].aoColumns[$('#' + table).find('tr').find('th').eq($(this).index()).attr('data-column-index')];
//		var data = $('#'+table).DataTable().row($(this).closest('tr')).data();
//		/** 双击客户报表数字列可编辑 */
//		if (th.name.indexOf('customerAmount') >= 0){
//			if (data['colDisp'].indexOf('合计') > 0 || data['colDisp'].indexOf('总计') > 0) {
//				return;
//			}
//			var oldVal = data[th.name];
//			td.html("<input type='text'>");			
//			var input = $(this).find('input');
//			if (oldVal != 0){
//				input.val(oldVal);
//			}
//			input.focus();
//			input.on('blur',function(){
//				if ($(this).val() == ''){
//					td.html(0);
//				}else if(isNaN($(this).val())){
//					td.html(oldVal);
//				}else{
//					var num = $(this).val() * 1;
//					td.html(num.toFixed(2));
//				}
//				if (td.html() != data[th.name]){
//					data[th.name] = td.html();
//					var yyyy = th.name.substring(th.name.length - 4,th.name.length);
//					var tmpData = {'yyyy':yyyy,'colCode':data.colCode,'customerAmount':data[th.name]};
//					customerAmoutMap[yyyy+data.colCode] = tmpData;
//				}
//			});
//		}
//		
//		/** 双击调整数穿透显示调整明细 */
//		if (data.colType == 2) {
//			return;
//		}
//		if (th.name.indexOf('adjustAmount') >= 0){
//			var yyyy = th.name.substring(th.name.length - 4,th.name.length);
//			adjustDetailTab('tab_unAuditReport', window.CUR_CUSTOMERID, yyyy, 1, data.colCode, data.colCode, "FA10065");
//		}
//		
//	});
//	
//	/** 保存按钮 */
//	$('#rpt_save').click(function() {
//		if (JSON.stringify(customerAmoutMap) =='{}'){
//			bdoInfoBox('提示', "客户报表数字未修改，无需保存！");
//			return;
//		}
//		
//		var detailData=[];
//		$.each(customerAmoutMap,function(key,value){ 
//			detailData.push(value);
//		 });  
//		
//		//alert(JSON.stringify(detailData));
//		$.ajax({
//			type : 'post',
//			url : 'dgCenter/FUnAuditReport.editCustomerAmount.json',
//			data : {
//				param1 : window.CUR_CUSTOMERID,
//				param2 : JSON.stringify(detailData)
//			},
//			dataType : 'json',
//			success : function(data) {
//				if(data.success){
//					customerAmoutMap = {};
//					bdoSuccessBox('保存成功', data.resultInfo.statusText);
//					loadData();
//				}else {
//					bdoErrorBox('保存失败', data.resultInfo.statusText);
//				}
//			}
//		});
//	});
//	
//	/** 搜索按钮 */
//	$('#rpt_search').click(function() {
//		
//		if($('#rpt_customerId').val() == ''){
//			bdoInfoBox('提示', '请选择客户');
//			return;
//		}
//		
//		if($('#rpt_startYear').val() == ''){
//			bdoInfoBox('提示', '请选择账套年度');
//			return;
//		}
//		
//		var startYear = $('#rpt_startYear').val();
//		
//		if($('#rpt_endYear').val() == ''){
//			$('#rpt_endYear').val(startYear);
//		}		
//		var endYear = $('#rpt_endYear').val();	
//		
//		loadData();
//	});
//	
//	/**
//	 * 
//	 */
//	$('#rpt_check_Report').on('click', function() {
//		if($('#rpt_customerId').val() == ''){
//			bdoInfoBox('提示', '请选择客户');
//			return;
//		}
//		
//		if($('#rpt_startYear').val() == ''){
//			bdoInfoBox('提示', '请选择账套年度');
//			return;
//		}
//		
//		var startYear = $('#rpt_startYear').val();
//		
//		if($('#rpt_endYear').val() == ''){
//			$('#rpt_endYear').val(startYear);
//		}		
//		var endYear = $('#rpt_endYear').val();	
//
//		//var customer = $('#rpt_customerId option:selected').text().split('-');
//		var year = startYear;
//		if (startYear != endYear){
//			year = startYear + '～' + endYear
//		}
//		
//		bdoAjaxBox('系统提示',year +'年未审报表确定完成核对吗？', function () {
//			$.ajax({
//				type : 'post',
//				url : 'dgCenter/FUnAuditReport.checkAuditReport.json',
//				data : {
//					param1 : window.CUR_CUSTOMERID,
//					param2 : $('#rpt_startYear').val(),
//					param3 : $('#rpt_endYear').val()
//				},
//				dataType : 'json',
//				success : function(data) {
//					if(data.success){
//						bdoSuccessBox('操作成功', data.resultInfo.statusText);
//						loadData();
//					}else {
//						bdoErrorBox('操作失败', data.resultInfo.statusText);
//					}
//				}
//			});
//		});
//	});
//	
//	
//	/** 刷新报表 */
//	$('#rpt_createReport').click(function() {
//		if($('#rpt_customerId').val() == ''){
//			bdoInfoBox('提示', '请选择客户');
//			return;
//		}
//		
//		if($('#rpt_startYear').val() == ''){
//			bdoInfoBox('提示', '请选择账套年度');
//			return;
//		}
//		
//		var startYear = $('#rpt_startYear').val();
//		
//		if($('#rpt_endYear').val() == ''){
//			$('#rpt_endYear').val(startYear);
//		}		
//		var endYear = $('#rpt_endYear').val();	
//
//		//var customer = $('#rpt_customerId option:selected').text().split('-');
//		var year = startYear;
//		if (startYear != endYear){
//			year = startYear + '～' + endYear
//		}
//		
//		bdoAjaxBox('系统提示','确定要刷新【'+ CUR_CUSTOMERNAME + "】<br>" +  year +'年未审报表吗', function () {
//			$.ajax({
//				type : 'post',
//				url : 'dgCenter/FUnAuditReport.createReport.json',
//				data : {
//					param1 : window.CUR_CUSTOMERID,
//					param2 : $('#rpt_startYear').val(),
//					param3 : $('#rpt_endYear').val()
//				},
//				dataType : 'json',
//				/*beforeSend: function(){  //开始loading
//					_thisBlock.append('<div id="loadImg" style="width:100%;text-align:center;"><img src="/Faith/img/bdo/loading.gif" width="100px" height="100px" /></div>');                
//	            },*/
//				success : function(data) {
//					if(data.success){
//						bdoSuccessBox('操作成功', data.resultInfo.statusText);
//						//$('#rpt_search').click();
//						loadData();
//					}else {
//						bdoErrorBox('操作失败', data.resultInfo.statusText);
//					}
//				}/*,
//	            complete: function(){   //结束loading
//	            	_thisBlock.find("#loadImg").remove();
//	            }*/
//			});
//		});
//	});
//	
//	/** 导入客户报表按钮 */
//	$('#rpt_importCustomerReport').click(function() {
//		if($('#rpt_customerId').val() == ''){
//			bdoInfoBox('提示', '请选择客户');
//			return;
//		}
//
//		if($('#rpt_startYear').val() == ''){
//			bdoInfoBox('提示', '请选择账套年度');
//			return;
//		}
//		
//		var startYear = $('#rpt_startYear').val();
//		
//		if($('#rpt_endYear').val() == ''){
//			$('#rpt_endYear').val(startYear);
//		}		
//		var endYear = $('#rpt_endYear').val();	
//		
//		$('#modal-importCustomerReport').modal('show');
//		$('#import_customer').val($('#rpt_customerId').val());
//		$('#import_startYear').val($('#rpt_startYear').val());	
//		$('#import_endYear').val($('#rpt_endYear').val());	
//		
//		//报表模板
//		var customer = $('#import_customer').val().split('-');
//		getCustomerVocation('import_vocationId',{param1:customer[0],param2:$('#import_endYear').val(),param3:departIdSession});
//			
//		var pluginOpt = {
//				dropZoneEnabled: false,
//				dropZoneTitle: '',
//				dropZoneClickTitle: '',
//				browseLabel: '选择文件',
//				showCaption: true,
//				showRemove: false,
//				showUpload: false,
//				showBrowse: true,
//				showPreview: false,
//				required : true,
//				initialPreviewShowDelete: true,
//				language: 'zh',
//				browseOnZoneClick: true,
//				showClose : false, 
//				uploadAsync: false,
//				showCancel: false,
//				hideThumbnailContent: true,
//				layoutTemplates: {
//					actionUpload: '',
//					actionZoom: ''
//				},
//				fileActionSettings: {
//					removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
//				},
//				uploadAsync: true,
//				uploadUrl: 'dgCenter/FUnAuditReport.importCustomerReport.json',
//				uploadExtraData: function() {
//					return {
//						param1: '',
//						param2: ''
//					}
//				}
//			};
//		
//		pluginOpt.uploadExtraData = function() {
//			return {
//				param1 : $('#import_customer').val(),
//				param2 : $('#import_startYear').val(),
//				param3 : $('#import_endYear').val(),
//				param4 : $('#import_vocationId').val() + '-' + $('#import_vocationId').text()
//			}
//		};
//		var $el = $('#fileinput').fileinput(pluginOpt);
//
//		//uploadAsync = true 时调用
//		$el.on('fileuploaded', function(event, data) {
//			bdoSuccessBox('导入成功');
//			$('#modal-importCustomerReport').modal('hide');
//			$('#fileinput').fileinput('clear');
//			$('#fileinput').fileinput('enable');
//			loadData();
//			//uploadFileSuccess(data);
//		});
//		//uploadAsync = true 时，后台返回数据data.error 非空是调用
//		$el.on('fileuploaderror', function(event, data, msg) {
//			bdoErrorBox('系统提示',msg);
//			//uploadFileSuccess(data);
//		});
//
//		//文件上传成功/失败后，处理后台响应函数
//		function uploadFileSuccess(data) {
//		}
//
//		//建议文件上传成功之后再提交其他表单数据
//		function uploadFile() {
//			$el.fileinput('upload');
//		}
//		
//		/** 导入按钮 */
//		$('#import_submit').click(function() {
//			
//			$.ajax({
//				type : 'post',
//				url : 'dgCenter/FUnAuditReport.checkTemplate.json',
//				data : {
//					param1 : $('#import_customer').val().split('-')[0],
//					param2 : $('#import_endYear').val(),
//					param3 : $('#import_vocationId').val()
//				},
//				dataType : 'json',
//				success : function(data) {
//					if (data.data[0].checkFlag == 1){
//						uploadFile();
//					}
//				}
//			});
//		});
//	});
//	
//	//选择年时查询报表模板
//	$('#import_endYear').change(function(){
//		var customer = $('#import_customer').val().split('-');
//		getCustomerVocation('import_vocationId',{param1:customer[0],param2:$('#import_endYear').val(),param3:departIdSession});
//		
//	});
//	
//	/** 下载模板按钮 */
//	$('#import_dlTemplate').click(function() {
//		if($('#import_vocationId').val() == ''){
//			bdoInfoBox('提示', '请选择报表模板');
//			return;
//		}
//		
//		var customer = $('#import_customer').val().split('-');
//		var params = {
//			id : '1',
//			menuId : '40000040',
//			mainDatasSql : 'FA40017',
//			detailDatasSql : 'FA40016',
//			param1: customer[1],
//			param2: $('#import_startYear').val(),
//			param3: $('#import_vocationId').val(),
//			param4: $('#import_vocationId').text()
//		};
//		
//		exportExcelWithTemplate('./dgCenter/FUnAuditReportTemplate.exportExcel.json', params);
//		
//	});
//
//
//	
//	
//	/** 重置按钮 */
//	$('#rpt_clear').click(function() {
//		//$('#rpt_customerId').val('').trigger("change");
//		$('#rpt_startYear').val(CUR_PROJECT_START_YEAR);
//		$('#rpt_endYear').val(CUR_PROJECT_END_YEAR);
//		$('#rpt_showZero').val(1);
//	});
//	
//	
//	/** 导出 */
//	$('#rpt_export').click(function() {
//		exportExcel(this, '未审报表', rpt_view, table);
//	});
//	
//	/** 加载数据 */
//	function loadData(){
//		var startYear = $('#rpt_startYear').val();
//		
//		if($('#rpt_endYear').val() == ''){
//			$('#rpt_endYear').val(startYear);
//		}
//		var endYear = $('#rpt_endYear').val();
//		var params = {
//				'menuId' : window.sys_menuId,
//				'param1' : window.CUR_CUSTOMERID,
//				'param2' : $('#rpt_startYear').val(),
//				'param3' : $('#rpt_endYear').val(),
//				'param4' : $('#rpt_showZero').val()
//		};
//		
//		if ($('#' + table).hasClass('dataTable')) {
//			$('#' + table).DataTable().clear();
//			$('#' + table).DataTable().destroy();
//			$('#' + table).empty();
//		}
//		
//		
//		rpt_view.localParam.urlparam = params;
//		rpt_view.tableParam = createColumn(startYear, endYear);
//		BdoDataTable(table, rpt_view);
//	}
//	
//	/** 生成显示列 */
//	function createColumn(startYear,endYear){
//		var tbColumns = {
//				select : true,
//				lengthChange : true,
//				dom : '<"row"<"col-sm-12"tr>>',
//				serverSide : true,
//				columnDefs : [
//					 {
//							targets : 1,
//							className : 'text-left',
//							title : '编号',
//							name : 'colCode',
//							data : 'colCode',
//							visible : false,
//							width : '60px'
//						}, {
//							targets : 2,
//							className : 'text-left',
//							title : '科目编号',
//							name : 'colCode',
//							data : 'colCode',
//							width : '30px',
//							render: function(data, type, row, meta){
//								if (row.colDisp.indexOf('合计') > 0 || row.colDisp.indexOf('总计') > 0){
//									return '';
//								} else {
//									return data.replace(' ','&nbsp;&nbsp;');
//								}
//							}
//						}, {
//							targets : 3,
//							className : 'text-left',
//							title : '科目名称',
//							name : 'colDisp',
//							data : 'colDisp',
//							width : '150px',
//							render: function(data, type, row, meta){
//								if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0){
//									return '<b>' + data + '</b>';
//								} else {
//									return data.replace(' ','&nbsp;&nbsp;');
//								}
//							}
//						}
//					]
//			};
//		
//		var colNum = 3;
//		for (var i = startYear; i <= endYear ; i++){
//			tbColumns.columnDefs.push({
//				targets : colNum + 1,
//				className : 'text-right',
//				title : i + '年<br>总账金额',
//				name : 'unAuditAmount'+i,
//				data : 'unAuditAmount'+i,
//				width : '60px',
//				render: function(data, type, row, meta){
//					return formatMoney(data);
//				}
//			});
//			
//			tbColumns.columnDefs.push({
//				targets : colNum + 2,
//				className : 'text-right',
//				title : i + '年<br>客户调整数',
//				name : 'adjustAmount'+i,
//				data : 'adjustAmount'+i,
//				width : '60px',
//				render: function(data, type, row, meta){
//					return formatMoney(data);
//				}
//			});
//			
//			tbColumns.columnDefs.push({
//				targets : colNum + 3,
//				className : 'text-right',
//				title : i + '年<br>调整后金额',
//				name : 'adjustedAmount'+i,
//				data : 'adjustedAmount'+i,
//				width : '60px',
//				render: function(data, type, row, meta){
//					return formatMoney(data);
//				}
//			});
//			tbColumns.columnDefs.push({
//				targets : colNum + 4,
//				className : 'text-right',
//				title : i + '年<br>客户报表数字',
//				name : 'customerAmount'+i,
//				data : 'customerAmount'+i,
//				width : '60px',
//				render: function(data, type, row, meta){
//					return formatMoney(data);
//				}
//			});
//			
//			tbColumns.columnDefs.push({
//				targets : colNum + 5,
//				className : 'text-right',
//				title : i + '年<br>差异金额',
//				name : 'differenceAmount'+i,
//				data : 'differenceAmount'+i,
//				width : '60px',
//				render: function(data, type, row, meta){
//					return formatMoney(data);
//				}
//			});
//			
//			if (i < endYear){
//				tbColumns.columnDefs.push({
//					targets : colNum + 6,
//					className : 'text-right',
//					title : '',
//					width : '10px'
//				});
//			}
//			
//			
//			colNum = colNum + 6;
//			
//		}
//		
//		return tbColumns;
//	}
//	loadData();
//});