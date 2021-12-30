/**
 * 
 */
(function(){
	
	var initTabModal = function() {
		uiBlocksApi(false, 'init');
		/*$('[data-toggle="tabs"]').on('click', 'a', function(e){
			e.preventDefault();
			$(this).tab('show');
		});*/
		/*$('[data-toggle="tabs"]').on('shown.bs.tab', 'a', function(e){
			//$(this).resize();
		});*/
		/** 模态框设置 */
		/*$('.modal').on('show.bs.modal', function(){
			$(this).draggable({
				handle: '.block-header',
				cursor: 'move'
			});
			$(this).css('overflow', 'hidden');
		});*/
	};
	
	var initAll = {
		
	};

	//绑定事件
	var bindEvent = function() {
		// 刷新报告
		$('#report_refresh').click((event)=>{
			$('#report_table').DataTable().ajax.reload();
		});
		// 打开报告配置弹出框
 		$('#report_table').on('click', 'button[name="editReportConfig"]',  function() {
 			var object = $('#report_table').DataTable().data()[$(this).closest('tr').index()];
 			$('#report_autoId').val(object.reportAutoId);
 			$('#report_reportTplID').val(object.autoId);
 			$('#report_rootPath').val(object.rootPath);
 			$('#report_reportPath').val(object.reportPath);
 			$('#report_configPath').val(object.configPath);
 			$('#report_deleteConfigPath').val(object.deleteConfigPath);
 			$('#modal_report').modal('show');
 		});
 		function necessary(){
 			if($('#report_rootPath').val() == ''){
 				swal({
					title : '请填写根目录...',
					html : '',
					type : 'info',
					allowOutsideClick: false,
					allowEscapeKey: false,
					timer : 2000
				}).catch(swal.noop);
 				return false;
 			}
 			if($('#report_reportPath').val() == ''){
 				swal({
					title : '请填写报告文件名称...',
					html : '',
					type : 'info',
					allowOutsideClick: false,
					allowEscapeKey: false,
					timer : 2000
				}).catch(swal.noop);
 				return false;
 			}
 			if($('#report_configPath').val() == ''){
 				swal({
					title : '请填写报告配置文件名称...',
					html : '',
					type : 'info',
					allowOutsideClick: false,
					allowEscapeKey: false,
					timer : 2000
				}).catch(swal.noop);
 				return false;
 			}
 			if($('#report_deleteConfigPath').val() == ''){
 				swal({
					title : '请填写删除条件配置文件名称...',
					html : '',
					type : 'info',
					allowOutsideClick: false,
					allowEscapeKey: false,
					timer : 2000
				}).catch(swal.noop);
 				return false;
 			}
 			return true;
 		}
 		// 修改报告配置
 		$('#report_save').click((event)=>{
 			if(necessary()){
 				$.ajax({
 					type : "post",
 					url : 'cpBase/NotesManage.editReportConfig.json',
 					data : {
 						menuId: window.sys_menuId,
 						param1: $('#report_autoId').val(),
 						param2: $('#report_reportTplID').val(),
 						param3: $('#report_rootPath').val(),
 						param4: $('#report_reportPath').val(),
 						param5: $('#report_configPath').val(),
 						param6: $('#report_deleteConfigPath').val() 
 					},
 					dataType : "json",
 					success(data) {
 						if(data.success == true){
 							bdoSuccessBox('成功', data.resultInfo.statusText);
 							$('#modal_report').modal('hide');
 							$('#report_table').DataTable().ajax.reload();
 						}else{
 							bdoErrorBox('失败', data.resultInfo.statusText);
 						}
 					}
 				});
 			}
 		});
	};
	
	//初始化table
	var initTable = function() {
		//报表表格参数
		var report_view = {
			localParam : {
				tabNum : true,
				url : 'cpBase/General.query.json',
				urlparam : {
					sqlId : 'FA10081',
					menuId : window.sys_menuId,
					start : -1,
					limit : -1
				}
			},
			tableParam : {
				select : true,
				lengthChange : false,
				dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				// order : [2, 'ASC'],
				ordering : true,
				serverSide : true,
				columnDefs : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					width : '60px',
					render : function(data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-success" type="button" name="editReportConfig" data-placement="top" title="报告配置" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
						return renderStr;
					}
				}, {
					targets : 2,
					className : 'text-left',
					title : '报表类型',
					name : 'templateType',
					data : 'templateType',
					width : '80px'
				}, {
					targets : 3,
					className : 'text-left',
					title : '报表名称',
					name : 'ruleName',
					data : 'ruleName',
					width : '150px'
				}, {
					targets : 4,
					className : 'text-left',
					title : '根目录',
					name : 'rootPath',
					data : 'rootPath',
					width : '50px'
				}, {
					targets : 5,
					className : 'text-left',
					title : '报告文件',
					name : 'reportName',
					data : 'reportName',
					width : '100px',
					render : function(data, type, row, meta) {
						if(data != null && data !=''){
							return data.substring(0, data.lastIndexOf('.'));
						}
					}
				}, {
					targets : 6,
					className : 'text-left',
					title : '报告配置文件',
					name : 'configName',
					data : 'configName',
					width : '100px',
					render : function(data, type, row, meta) {
						if(data != null && data !=''){
							return data.substring(0, data.lastIndexOf('.'));
						}
					}
				}, {
					targets : 7,
					className : 'text-left',
					title : '删除条件配置文件',
					name : 'deleteConfigName',
					data : 'deleteConfigName',
					width : '100px',
					render : function(data, type, row, meta) {
						if(data != null && data !=''){
							return data.substring(0, data.lastIndexOf('.'));
						}
					}
				}, {
					targets : 8,
					title : '报告文件',
					name : 'reportPath',
					data : 'reportPath',
					visible : false
				}, {
					targets : 9,
					title : '报告配置文件',
					name : 'configPath',
					data : 'configPath',
					visible : false
				}, {
					targets : 10,
					title : '删除条件配置文件',
					name : 'deleteConfigPath',
					data : 'deleteConfigPath',
					visible : false
				}]
			}
		};
		
		//初始化报表一览
		initAll.reportTable = function() {
			BdoDataTable('report_table', report_view);
		}
	};

	(function() {
		initTabModal();
		initTable();
		bindEvent();
		initAll.reportTable();
	})();
	
})();