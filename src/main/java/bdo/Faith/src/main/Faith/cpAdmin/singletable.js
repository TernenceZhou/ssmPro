var getDbColumn = function(dbNm, tableNm) {
	var tableInfo;
	$.ajax({
		url : 'localData/db/column/' + dbNm + '.' + tableNm + '.jsonl',
		type : 'post',
		async : false,
		dataType : 'json',
		success : function(data){
			tableInfo = data;
		}
	});
	return tableInfo;
}

var getDbUkey = function(dbNm, tableNm) {
	var tableInfo;
	$.ajax({
		url : 'localData/db/ukey/' + dbNm + '.' + tableNm + '.jsonl',
		type : 'post',
		async : false,
		dataType : 'json',
		success : function(data){
			tableInfo = data;
		}
	});
	return tableInfo;
}

var SingleTableModal = function(tableparam){
	var tablemodal = '<div class="modal fade" id="' + tableparam.dbNm + '_' + tableparam.tableNm + '_data" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
		+	'<div class="modal-dialog modal-lg">'
		+		'<div class="modal-content">'
		+			'<div class="block block-themed block-transparent remove-margin-b">'
		+				'<div class="block-header bg-info">'
		+					'<ul class="block-options"><li><button type="button" data-dismiss="modal"><i class="si si-close"></i></button></li></ul>'
		+					'<h3 class="block-title">' + tableparam.modalTitle + '</h3>'
		+				'</div>'
		+			'</div>'
		+			'<div class="modal-body">'
		+				'<div class="block block-themed">'
		+					'<div class="block-header bg-primary">'
		+						'<ul class="block-options">'
		+							'<li>'
		+								'<button id="' + tableparam.dbNm + '_' + tableparam.tableNm + '_add" type="button"><i class="fa fa-plus">&nbsp;新增</i></button>'
		+							'</li>'
		+							'<li>'
		+								'<button type="button" data-toggle="block-option" data-action="content_toggle"></button>'
		+							'</li>'
		+						'</ul>'
		+					'</div>'
		+					'<div class="block-content">'
		+						'<table id="' + tableparam.dbNm + '_' + tableparam.tableNm + '_table" class="table table-bordered table-striped table-hover"></table>'
		+					'</div><br>'
		+				'</div>'
		+			'</div>'
		+		'</div>'
		+	'</div>'
		+'</div>';
	$('body').append(tablemodal);
	
	var singlefiltercol = [{
		targets : 1,
		className : 'text-center',
		title : '操作',
		width : '200px',
		orderable : false,
		render : function(data, type, row, meta){
			var renderStr = '';
			renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowEdit" data-placement="top" title="修改" data-toggle="tooltip">'
				+ '<i class="fa fa-edit"></i></button>&nbsp;';
			if(row.ACTIVE_FLAG == '1'){
				renderStr += '<button class="btn btn-xs btn-danger" type="button" name="rowBan" data-placement="top" title="作废" data-toggle="tooltip">'
					+ '<i class="fa fa-ban"></i></button>&nbsp;';
			}
			if(row.ACTIVE_FLAG == '0'){
				renderStr += '<button class="btn btn-xs btn-danger" type="button" name="rowUse" data-placement="top" title="取消作废" data-toggle="tooltip">'
					+ '<i class="fa fa-reply"></i></button>&nbsp;';
			}
			renderStr += '<button class="btn btn-xs btn-danger" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
				+ '<i class="fa fa-times"></i></button>&nbsp;';
			return renderStr;
		}
	}];
	
	$.each(getDbColumn(tableparam.dbNm, tableparam.tableNm), function(index, info){
		console.log(info.renderer);
		if(info.sortNum){
			if(info.dataType == 'datetime'){
				singlefiltercol.push({
					targets : parseInt(info.sortNum) + 1,
					title : ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm,
					name : info.colNm,
					data : info.colNm,
					width : '150px',
					render: function(data, type, row, meta) {
						var date = new Date(data)
						return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
					}
				});
			}
			if(info.colNm == 'ACTIVE_FLAG'){
				singlefiltercol.push({
					targets : parseInt(info.sortNum) + 1,
					title : ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm,
					name : info.colNm,
					data : info.colNm,
					width : '150px',
					render: function(data, type, row, meta) {
						return DicVal2Nm(data, 'activeFlag');
					}
				});
			}
			singlefiltercol.push({
				targets : parseInt(info.sortNum) + 1,
				title : ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm,
				name : info.colNm,
				data : info.colNm,
				width : '150px',
				render: function(data, type, row, meta) {
					if(data){
						if(typeof(data) == 'object'){
							return row[meta.settings.aoColumns[meta.col].data + 'Name'];
						}
						if(data.length > 100){
							return data.substr(0, 100) + '...';
						}
						return data;
					}
					return '';
				}
			});
		}
	});
	var singleparam = {
		tabNum : true,
		scrollX : true,
		lengthChange : true,
		sourceData : {},
		sourceUrl : 'base/General.findForSingleTable.json',
		filterParam : {
			menuId : window.sys_menuId,
			tableNm : tableparam.dbNm + '.' + tableparam.tableNm,
			showWho : 'true',
			filter : ''
		},
		createdRow: function(row, data, index){
			if (data.ACTIVE_FLAG == '0'){ 
				$(row).css('color', 'red');
			}
		},
		tableColumns : []
	}
	
	$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_data').on('shown.bs.modal', function(){
//		$(this).draggable({
//			handle: '.block-header',
//			cursor: 'move'
//	    });
//	    $(this).css('overflow', 'hidden');
		
	    $('#' +tableparam.dbNm + '_' + tableparam.tableNm + '_add').on('click', function(){
	    	tabledataform();
			$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_edit').hide();
	    	$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_ACTIVE_FLAG').val('1');
	    	$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_detail').modal('show');
		});
		
		var tabledataobj;
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_data').on('click', 'button[name="rowEdit"]', function(){
			tabledataform();
			tabledataobj = $('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_table').DataTable().data()[$(this).closest('tr').index()];
			$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_save').hide();
			$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_savenext').hide();
			$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_clear').hide();
			dataformset(tabledataobj);
			$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_detail').modal('show');
		});
		
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_data').on('click', 'button[name="rowBan"]', function() {
			tabledataobj = $('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_table').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('作废', '确定作废吗?', function(){
				var ajaxparam = {
					menuId : window.sys_menuId,
					bdo_table_id : tableparam.dbNm + '.' + tableparam.tableNm,
					bdo_Maintenance_processType : 'abolish'
				}
				$.extend(ajaxparam, tabledataobj);
				$.ajax({
					url : 'base/general.abolishByKey.json',
					type : 'post',
					data : ajaxparam,
					dataType : 'json',
					success : function(data){
						if(data.success === true){
							$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_table').DataTable().draw(false);
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_data').on('click', 'button[name="rowUse"]', function() {
			tabledataobj = $('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_table').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('取消作废', '确定取消作废吗?', function(){
				var ajaxparam = {
					menuId : window.sys_menuId,
					bdo_table_id : tableparam.dbNm + '.' + tableparam.tableNm,
					bdo_Maintenance_processType : 'unabolish'
				}
				$.extend(ajaxparam, tabledataobj);
				$.ajax({
					url : 'base/general.unabolishByKey.json',
					type : 'post',
					data : ajaxparam,
					dataType : 'json',
					success : function(data){
						if(data.success === true){
							$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_table').DataTable().draw(false);
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_data').on('click', 'button[name="rowDelete"]', function() {
			tabledataobj = $('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_table').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('删除', '确定删除吗?', function(){
				var ajaxparam = {
					menuId : window.sys_menuId,
					bdo_table_id : tableparam.dbNm + '.' + tableparam.tableNm,
					bdo_Maintenance_processType : 'delete'
				}
				$.extend(ajaxparam, tabledataobj);
				$.ajax({
					url : 'base/general.deleteByKey.json',
					type : 'post',
					data : ajaxparam,
					dataType : 'json',
					success : function(data){
						if(data.success === true){
							$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_table').DataTable().draw(false);
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		
		if(singlefiltercol.length == 1){
			$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_data').modal('hide');
			bdoErrorBox('失败', '暂时无法查看此表');
		} else{
			singleparam.order = [2, 'desc'];
			singleparam.tableColumns = singlefiltercol;
			BdoDataTables(tableparam.dbNm + '_' + tableparam.tableNm + '_table', singleparam);
		}
	});
	
	$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_data').on('hidden.bs.modal', function(){
		$(this).remove();
	});
	
	var tabledataform = function() {
		var tabledataformht = '<div class="modal fade" id="' + tableparam.dbNm + '_' + tableparam.tableNm + '_detail" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
			+	'<div class="modal-dialog modal-lg">'
			+		'<div class="modal-content">'
			+			'<div class="block block-themed block-transparent remove-margin-b">'
			+				'<div class="block-header bg-info">'
			+					'<ul class="block-options">'
			+						'<li>'
			+							'<button type="button" data-dismiss="modal"><i class="si si-close"></i></button>'
			+						'</li>'
			+					'</ul>'
			+					'<h3 class="block-title">' + tableparam.modalTitle + '详细信息</h3>'
			+				'</div>'
			+			'</div>'
			+			'<div class="modal-body">'
			+				'<form class="form-horizontal" id="' + tableparam.dbNm + '_' + tableparam.tableNm + '_form"></form>'
			+			'</div>'
			+		'</div>'
			+	'</div>'
			+'</div>';
		$('body').append(tabledataformht);
		
		var tabledataformcol = [];
		var noshow = ['CREATION_DATE', 'CREATED_BY', 'LAST_UPDATE_DATE', 'LAST_UPDATED_BY', 'ABOLITION_DATE', 'ABOLISHED_BY', 'PROGRAM_APPLICATION_ID', 'PROGRAM_ID', 'ACTIVE_FLAG'];
		var hasactive = false;
		$.each(getDbColumn(tableparam.dbNm, tableparam.tableNm), function(index, info){
			if(info.colNm == 'ACTIVE_FLAG'){
				hasactive = true;
			} else{
				if(noshow.indexOf(info.colNm) == -1){
					var obj = {};
					obj.id = 'tablecol_' + info.colNm;
					obj.type = 'input';
					obj.validate = {
						rules : {
							required : false,
							maxlength : info.dataLen
						}
					}
					obj.typeAttr = {
						type : '',
						normal : false
					}
					obj.label = ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm;
					if((info.dataType).indexOf('int') > -1){
						obj.typeAttr.type = 'number'
					}
					if(info.dataType == 'datetime'){
						obj.plugin = {
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
					}
					if(info.isNullable == '0'){
						obj.validate.rules.required = true;
					} else{
						obj.typeAttr.normal = true
					}
					tabledataformcol[parseInt(info.sortNum) - 1] = obj;
				}
			}
		});
		tabledataformcol = $.grep(tabledataformcol, function(n){return $.trim(n).length > 0;});
		$.each(tabledataformcol, function(index, info){
			if(info){
				if(index % 2 == 0){
					tabledataformcol[index].rowspan = '1';
				}
			}
		});
		if(hasactive){
			tabledataformcol.push({
				id : tableparam.dbNm + '_' + tableparam.tableNm + '_ACTIVE_FLAG',
				type : 'select',
				label : '是否有效',
				html : ComboDicOption(true, 'activeFlag'),
				typeAttr : {
					disabled : true
				}
			});
		}
		
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_form').formview({
			display : 'tableform-one',
			column : 4,
			buttons : [
				{
					id : tableparam.dbNm + '_' + tableparam.tableNm + '_save',
					icon : 'fa-save',
					style : 'btn-success',
					text : '&nbsp;保存'
				},{
					id : tableparam.dbNm + '_' + tableparam.tableNm + '_savenext',
					icon : 'fa-chevron-right',
					style : 'btn-success',
					text : '&nbsp;保存并继续'
				},{
					id : tableparam.dbNm + '_' + tableparam.tableNm + '_edit',
					icon : 'fa-edit',
					style : 'btn-success',
					text : '&nbsp;修改'
				},{
					id : tableparam.dbNm + '_' + tableparam.tableNm + '_clear',
					icon : 'fa-circle',
					style : 'btn-primary',
					text : '&nbsp;重置'
				},{
					id : tableparam.dbNm + '_' + tableparam.tableNm + '_close',
					icon : 'fa-sign-out',
					style : 'btn-warning',
					text : '&nbsp;关闭'
				}
			],
			items : tabledataformcol
		});
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_detail').on('shown.bs.modal', function(){
//			$(this).draggable({
//				handle: '.block-header',
//				cursor: 'move'
//		    });
//		    $(this).css('overflow', 'hidden');
		});
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_detail').on('hidden.bs.modal', function(){
			$(this).remove();
		});

		/** 保存 */
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_save').click(function(){
			var ajaxparam = {
				menuId : window.sys_menuId,
				bdo_table_id : tableparam.dbNm + '.' + tableparam.tableNm,
				bdo_Maintenance_processType : 'add'
			}
			submitTableDataForm(false, $.extend(ajaxparam, ajaxparamget()));
		});
		/** 保存并继续 */
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_savenext').click(function(){
			var ajaxparam = {
				menuId : window.sys_menuId,
				bdo_table_id : tableparam.dbNm + '.' + tableparam.tableNm,
				bdo_Maintenance_processType : 'add'
			}
			submitTableDataForm(true, $.extend(ajaxparam, ajaxparamget()));
		});
		/** 修改 */
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_edit').click(function(){
			var ajaxparam = {
				menuId : window.sys_menuId,
				bdo_table_id : tableparam.dbNm + '.' + tableparam.tableNm,
				bdo_Maintenance_processType : 'edit'
			}
			submitTableDataForm(false, $.extend(ajaxparam, ajaxparamget()));
		});
		/** 重置 */
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_clear').click(function(){
			$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_detail').find('input, select:not(#' + tableparam.dbNm + '_' + tableparam.tableNm + '_ACTIVE_FLAG)').val('');
		});
		/** 关闭 */
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_close').click(function(){
			$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_detail').modal('hide');
		});
	}
	
	function dataformset(obj){
		var colDef = getDbColumn(tableparam.dbNm, tableparam.tableNm);
		$.each(obj, function(index, info){
			if(colDef[index.toLowerCase()]){
				if(colDef[index.toLowerCase()].dataType == 'datetime'){
					var date = new Date(info)
					$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_' + index).val(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
				} else{
					$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_' + index).val(info);
				}
			}
		});
	}
	
	var ajaxparamget = function(){
		var ajaxparam = {};
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_form input').each(function(){
			ajaxparam[$(this).attr('id').replace(tableparam.dbNm + '_' + tableparam.tableNm + '_', '')] = $(this).val();
		});
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_form select').each(function(){
			ajaxparam[$(this).attr('id').replace(tableparam.dbNm + '_' + tableparam.tableNm + '_', '')] = $(this).val();
		});
		return ajaxparam;
	}
	
	/** 保存,修改提交表单 */
	function submitTableDataForm(submittype, ajaxparam){
		var submiturl;
		if(ajaxparam.bdo_Maintenance_processType == 'edit'){
			submiturl = 'base/general.updateByKey.json';
		} else{
			submiturl = 'base/general.create.json';
		}
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_form').formview(
			'setAjaxConf',
			[
				submiturl,
				ajaxparam,
				'json',
				true,
				function(data) {
					if(data.success === true){
						$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_table').DataTable().draw(false);
						if(!submittype){
							$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_detail').modal('hide');
						}
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			]
		)
		$('#' + tableparam.dbNm + '_' + tableparam.tableNm + '_form').submit();
	}
}