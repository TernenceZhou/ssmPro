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
/*		$('.modal').on('show.bs.modal', function(){
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
 		//初始化
 		var initTypeSelect = function() {
	 		var template_type = ComboLocalDicOption(true,'报表模板类型');
			$('#template_type').html(template_type);
 		};
 		//报表查询按钮
 		$('#report_search').on('click', function(){
 			initAll.reportTable();
 		});
 		// 初始化对照
 		$('#notes_initContrast').on('click', function() {
 			$.ajax({
				type : "post",
				url : 'cpBase/NotesManage.initContrast.json',
				// async : false,
				data : {
					param1: $('#report_templateId').attr('data-result')
				},
				dataType : "json",
				success(data) {
					if(data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#notes_subject_table').DataTable().ajax.reload();
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
 		});
 		// 初始化
 		$('#notes_init').on('click', function() {
 			$('#modal_notesInitForm').modal('show');
 		});
 		//科目查询
 		$('#notes_subject_search').on('click', function() {
 			initAll.notesSubTable();
 		});
 		
 		//查看报表附注
 		$('#report_table').on('click', 'button[name="notesDetail"]',  function() {
 			var object = $('#report_table').DataTable().data()[$(this).closest('tr').index()];
 			initAll.notesSubTable(object.autoId, object.ruleName);
 			$('#report_templateId').treecombo('setTreeComboValue',[object.autoId, object.ruleName]);
 			$('#comsubjectManageTopTab a:last').tab('show');
 		});
 		
		// 新增 
		$('#notes_plus').on('click', function() {
			$('#notes_autoId').val('');
			$('#notes_noteNo').val('');
			$('#notes_noteName').val('');
			$('#notes_subject_add').show();
			$('#notes_tpId_group').show();
			$('#notes_tpId').treecombo('setTreeComboValue',['', '']);
			$('#notes_subject_update').hide();
			$('#modal_notesSubForm').modal('show');
		});
		//排序
		$('#notes_sort').on('click', function() {
			var data = '';	
			$('#notes_subject_table').find('tbody tr').each(function(){
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
				url : 'cpBase/NotesManage.saveSort.json',
				type : 'post',
				data : {
					param1 : data
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						$('#notes_subject_table').DataTable().ajax.reload();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		//初始化附注
		$('#notes_subject_table').on('click', 'button[name="initNoteInfo"]',  function() {
			var object = $('#notes_subject_table').DataTable().data()[$(this).closest('tr').index()];
			var nodeData = {
				extraOptions: {
					autoId: object.autoId,
					fileName: object.fileName,
					noteName: object.noteName,
					noteNo: object.noteNo,
					reportTplID: object.reportTplID,
					ruleName: object.ruleName,
				},
				currentNode: {
					extraOptions: {
						autoId: object.autoId,
						fileName: object.fileName,
						noteName: object.noteName,
						noteNo: object.noteNo,
						reportTplID: object.reportTplID,
						ruleName: object.ruleName,
					}
				}
			};
			nodeData.autoId = nodeData.extraOptions.autoId;
			$.sessionStorage('baseNoteNode', JSON.stringify(nodeData));
			window.open('/Faith/generalbase.do?m=openBaseNote&noteNo=' + nodeData.extraOptions.noteNo);
		});
		//修改
		$('#notes_subject_table').on('click', 'button[name="subEdit"]',  function() {
			var object = $('#notes_subject_table').DataTable().data()[$(this).closest('tr').index()];
			$('#notes_autoId').val(object.autoId);
			$('#notes_noteNo').val(object.noteNo);
			$('#notes_noteName').val(object.noteName);
			$('#notes_subject_add').hide();
			$('#notes_tpId_group').hide();
			$('#notes_subject_update').show();
			$('#modal_notesSubForm').modal('show');
		});
		//删除附注科目
		$('#notes_subject_table').on('click', 'button[name="subDelete"]', function() {
			var object = $('#notes_subject_table').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('删除', '是否删除该附注？', function(){
				$.ajax({
					url : 'cpBase/NotesManage.deleteNote.json',
					type : 'post',
					data : {
						param1 : object.autoId,
						param2 : object.noteName
					},
					dataType : 'json',
					success : function(data){
						if(data.success){
							$('#notes_subject_table').DataTable().draw(false);
							//$('#notes_subject_table').DataTable().ajax.reload();
							bdoSuccessBox('成功', data.resultInfo.statusText);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		
		// 下载模板按钮
		$('#notes_subject_table').on('click', 'button[name="downNotes"]', function(){
			var object = $('#notes_subject_table').DataTable().data()[$(this).closest('tr').index()];
			
			$.ajax({
					url : 'cpBase/NotesManage.downNotes.json',
					type : 'post',
					data : {
						param1 : object.autoId,
						param2 : 1
					},
					dataType : 'json',
					success : function(data){
						if(data.success){
							downloadFile('cpBase/NotesManage.downNotes.json', {param1 : object.autoId});
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
		});
		$('#notes_subject_table').on('click', 'button[name="selReportSubject"]', function(){
			var object = $('#notes_subject_table').DataTable().data()[$(this).closest('tr').index()];
			/*ACTIVE_FLAG: "1"
			autoId: 4308
			colCode: null
			colName: null
			fileName: "测试.xlsx"
			noteName: "测试"
			noteNo: "2019001580"
			reportTplID: 23
			ruleName: "2019一般企业单体"*/
			$.ajax({
				type : 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async : false,
				data : {
					menuId: window.sys_menuId,
					sqlId: 'FA40044',
					param1: object.reportTplID,
					start: -1,
					limit: -1
				},
				dataType : 'json',
				success(data) {
					if(data.success) {
						if(data && data.success && data.data && data.data.length > 0){
							if(object.ruleName.indexOf('单体') != -1){
								$('#report_template').empty();
								for(let i = 0;i < data.data.length;i++){
									if(data.data[i].colCode.indexOf('HB_') == -1){
										$('#report_template').append("<option value='" + data.data[i].colCode + "' data-code='" + data.data[i].colCode + "' data-disp='" + data.data[i].colDisp + "'>" + data.data[i].colCode + ' ' + data.data[i].colDisp + '</option>');
									}
								}
							}else if(object.ruleName.indexOf('合并') != -1){
								$('#report_template').empty();
								for(let i = 0;i < data.data.length;i++){
									if(data.data[i].colCode.indexOf('HB_') != -1){
										$('#report_template').append("<option value='" + data.data[i].colCode + "' data-code='" + data.data[i].colCode + "' data-disp='" + data.data[i].colDisp + "'>" + data.data[i].colCode + ' ' + data.data[i].colDisp + '</option>');
									}
								}
							}else{
								$('#report_template').empty();
								for(let i = 0;i < data.data.length;i++){
									$('#report_template').append("<option value='" + data.data[i].colCode + "' data-code='" + data.data[i].colCode + "' data-disp='" + data.data[i].colDisp + "'>" + data.data[i].colCode + ' ' + data.data[i].colDisp + '</option>');
								}
							}
							$('#notes_subject_autoId').val(object.autoId);
							$('#report_colGroup').html('');
							if(object.colCode != null && object.colCode != ''){
								let codeList = object.colCode.split(/[\+\-]+/);
								$('#report_template').val(codeList[codeList.length - 1]);
								setColGroup(object.colCode, object.colName);
							}
							$('#report_colCode').val($('#report_template option:selected').attr('data-code'));
							$('#report_colDisp').val($('#report_template option:selected').attr('data-disp'));
							$('#colDispModal').modal('show');
						}else{
							swal({
								title : '该报表科目为空！',
								html : '请去报表模板维护！',
								type : 'info',
								allowOutsideClick: false,
								allowEscapeKey: false,
								timer : 2000
							}).catch(swal.noop);
						}
					}
				}
			});
		});
		// 打开modal时初始化报表项已选择项
		function setColGroup(colCode, colDisp){
			let codeList = colCode.split(/[\+\-]+/);
			let dispList = colDisp.split(',');
			let sign = colCode.split(/[^\+\-]+/);
			for(let i = 0;i < codeList.length;i++){
				txt = $('<div class=\"col-sm-3\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" value=\"' + codeList[i] + '\" title=\"' + dispList[i] + '\" readonly=\"readonly\"></div></div>');
				$('#report_colGroup').append(txt);
				if (i + 1 < sign.length - 1) {
					txt = $('<div class=\"col-sm-2\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"+">+</option><option value=\"-">-</option></select></div></div>');
					$('#report_colGroup').append(txt);
					$('#report_colGroup .col-sm-2 select')[i].value = sign[i + 1];
				}
			}
		}
		// 报表项
		$('#report_template').change(function(){
			$('#report_colCode').val($('#report_template option:selected').attr('data-code'));
			$('#report_colDisp').val($('#report_template option:selected').attr('data-disp'));
		});
		// 撤销
		$('#uodoColBtn').on('click', function () {
			let length1 = $('#report_colGroup .col-sm-3 input').length;
			if (length1 > 0) {
				$('#report_colGroup .col-sm-3')[length1 - 1].remove();
			}
			let length2 = $('#report_colGroup .col-sm-2 select').length;
			if (length2 > 0) {
				$('#report_colGroup .col-sm-2')[length2 - 1].remove();
			}
		});
		// 选择
		$('#selColBtn').on('click', function () {
			let length = $('#report_colGroup .col-sm-3 input').length;
			let txt;
			if (length > 0) {
				txt = $('<div class=\"col-sm-2\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"+">+</option><option value=\"-">-</option></select></div></div><div class=\"col-sm-3\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
			} else {
				txt = $('<div class=\"col-sm-3\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
			}
			$('#report_colGroup').append(txt);
			$('#report_colGroup .col-sm-3 input')[length].value = $('#report_colCode').val();
			$('#report_colGroup .col-sm-3 input')[length].title = $('#report_colDisp').val();
		});
		// 确定
		$('#selColDispBtn').on('click', function () {
			let length = $('#report_colGroup .col-sm-3 input').length;
			let colCode = '', colDisp = '';
			let colName = '';
			//多个
			if(length > 1){
// 				$('#report_colGroup .col-sm-2 select')[0].value;
				for(let i = 0;i < length;i++){
					let curObj = $('#report_colGroup .col-sm-3 input')[i];
					let value = curObj.value;
					let title = curObj.title;

					let sign =  $(curObj).parent().parent().next().find('select').val();
					if(sign){
						colCode = colCode + value + sign;
						colDisp = colDisp+title+',';
					}else{
						colCode = colCode + value;
						colDisp = colDisp+title;
					}
				}
				colName = $('#report_colGroup .col-sm-3 input')[0].title;
			}else{
				//单个
				colCode = $('#report_colGroup .col-sm-3 input').prop('value');
				//如果为undefined则设置为空 因为 encodeURIComponent 会给undefined传过去
				if (!colCode){
					colCode = '';
				}
				colDisp = $('#report_colGroup .col-sm-3 input').prop('title');
				colName = $('#report_colGroup .col-sm-3 input').prop('title');
			}
			// console.log('colCode::'+colCode);
			// console.log('colDisp::'+colDisp);
			// console.log('colName::'+colName);
			// console.log('autoId::'+$('#notes_subject_autoId').val());
			$.ajax({
				type : "post",
				url : 'cpBase/NotesManage.updateCol.json',
				// async : false,
				data : {
					param1: $('#notes_subject_autoId').val(),
					param2: encodeURIComponent(colCode),
					param3: colDisp,
					param4: colName
				},
				dataType: "json",
				success(data){
					if(data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#colDispModal').modal('hide');
						//$('#notes_subject_table').DataTable().ajax.reload();
						$('#notes_subject_table').DataTable().draw(false);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
		})
		});
		//报表模板树
		var initTree = function() {
			$('#report_templateId').treecombo({
				url : './cpBase/TreeCommon.findRuleaccTypeTree.json',
				params : {},
				view : {
					leafIcon: 'fa fa-file text-primary',
					nodeIcon: 'fa fa-folder text-primary',
					folderSelectable: false,
					multiSelect: false
				}
			});
			//$('#report_templateId').treecombo('setTreeComboValue',[1, '2018通用报表模版']);
			$('#notes_tpId').treecombo({
				url : './cpBase/TreeCommon.findRuleaccTypeTree.json',
				params : {},
				view : {
					leafIcon: 'fa fa-file text-primary',
					nodeIcon: 'fa fa-folder text-primary',
					folderSelectable: false,
					multiSelect: false
				}
			});
			$('#notes_initTp').treecombo({
				url : './cpBase/TreeCommon.findRuleaccTypeTree.json',
				params : {},
				view : {
					leafIcon: 'fa fa-file text-primary',
					nodeIcon: 'fa fa-folder text-primary',
					folderSelectable: false,
					multiSelect: false
				}
			});
			
		};
		
		
		//需要先初始化的控件
		initTypeSelect();
		initAll.notesSubForm();
		initAll.notesInitForm();
		initTree();
 	};
 	
 	//初始化table，form
 	var initTable = function() {
 		//报表表格参数
 		var report_view = {
			localParam : {
				tabNum : true,
				url : 'cpBase/General.query.json',
				urlparam : {
					sqlId : 'FA10080',
					menuId : window.sys_menuId,
					start : -1,
					limit : -1,
					param1 : $("#template_active_flag").val(),
					param2 : $("#template_type").val()
				}
			},
			tableParam : {
				select : true,
				lengthChange : false,
				dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				//order : [2, 'ASC'],
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
						var renderStr = '<button class="btn btn-xs btn-success" type="button" name="notesDetail" data-placement="top" title="查看附注" data-toggle="tooltip"><i class="fa fa-indent"></i></button>&nbsp;';
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
					width : '200px'
				}, {
					targets : 4,
					className : 'text-center',
					title : '附注数量',
					name : 'notesNum',
					data : 'notesNum',
					width : '50px'
				}, {
					targets : 5,
					className : 'text-center',
					title : '最后更新时间',
					name : 'LAST_UPDATE_DATE',
					data : 'LAST_UPDATE_DATE',
					width : '80px'
				}, {
					targets : 6,
					className : 'text-left',
					title : '最后更新者',
					name : 'LAST_UPDATED_BYName',
					data : 'LAST_UPDATED_BYName',
					width : '100px'
				}]
			}
		};
		
		//初始化报表一览
		initAll.reportTable = function() {
			report_view.localParam.urlparam.param1 = $("#template_active_flag").val();
			report_view.localParam.urlparam.param2 = $("#template_type").val();
			BdoDataTable('report_table', report_view);
		};
 		
 		//附注表格参数
 		var notes_subject_view = {
			localParam : {
				tabNum : true,
				url : 'cpBase/General.query.json',
				urlparam : {
					menuId : window.sys_menuId,
					sqlId : 'FA40039'
					//start : -1,
					//limit : -1
				}
			},
			tableParam : {
				select : true,
				lengthChange : true,
				fixedThread:true,
				fixedHeight:"500px",
				ordering : true,
				serverSide : true,
				rowReorder : {
					update : false
				},
				pageLength:30,
				columnDefs : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					width : '60px',
					render : function(data, type, row, meta) {
						var renderStr = renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
						renderStr += '<button class="btn btn-xs btn-warning" type="button" name="initNoteInfo" data-placement="top" title="初始化附注" data-toggle="tooltip"><i class="fa fa-cogs"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-warning" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa fa-edit"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="downNotes" data-placement="top" title="下载模板<' + row.fileName +'>" data-toggle="tooltip"><i class="fa fa-download"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="selReportSubject" data-placement="top" title="选择报表科目" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>';
						return renderStr;
					}
				}, {
					targets : 2,
					className : 'text-left',
					title : '附注编号',
					name : 'noteNo',
					data : 'noteNo',
					width : '60px'
				}, {
					targets : 3,
					className : 'text-left',
					title : '附注名称',
					name : 'noteName',
					data : 'noteName',
					width : '100px'
				}, {
					targets : 4,
					className : 'text-left',
					title : '报表科目编号',
					name : 'colCode',
					data : 'colCode',
					width : '60px'
				}, {
					targets : 5,
					className : 'text-left',
					title : '报表科目名称',
					name : 'colName',
					data : 'colName',
					width : '100px'
				}, {
					targets : 6,
					className : 'text-left',
					title : '模板名称',
					name : 'ruleName',
					data : 'ruleName',
					width : '100px'
				},{
					targets : 7,
					className : 'text-left',
					title : '模板是否变更',
					name : 'isChange',
					data : 'isChange',
					width : '80px',
						render : function(data, type, row, meta) {
							let checked = data == 1 ? 'checked' : '';
							return `<label class="css-input css-checkbox control-label css-checkbox-success"><input type="checkbox" class="note-table-isChange" data-row="` + meta.row + `" name="isForbid" ` + checked + `> <span></span></label>`;
						}
					}
				]
			}
		};

 		//绑定模板变更状态
		$('#').on('click', '[class^=note-table-isChange]', function() {
			var object = $('#notes_subject_table').DataTable().data()[$(this).closest('tr').index()];
			return $.ajax({
				url: 'cpBase/NotesManage.updateIsChange.json',
				type: 'post',
				dataType: 'json',
				data: {
					param1: object.autoId
				},
				success(data) {
						if (data.success){
							bdoSuccessBox('成功');
							$('#notes_subject_table').DataTable().draw(false);
						} else {
							bdoErrorBox('失败');
						}
				}
			});
		});

		//初始化表格
 		initAll.notesSubTable = function(templateId, templateName) {
 			if (!templateId) {
	 			templateId = $('#report_templateId').attr('data-result');
	 			templateName = $('#report_templateId').attr('data-content');
 			}
 			 
 			notes_subject_view.localParam.urlparam.param1 = templateId ? templateId : '';
 			$('#template_select').text('【' + (templateName ? templateName : '全部') + '】');
			$('#template_select').attr('data-result', templateId);
 			BdoDataTable('notes_subject_table', notes_subject_view);
 		};
 		
 		//初始化文件上传
 		initAll.notesSubForm = function() {
 			//var type = $this.attr('data-name');
 			//let flag = true;
			//报表模板
			var pluginOpt = {
					dropZoneEnabled: false,
					dropZoneTitle: '',
					dropZoneClickTitle: '',
					browseLabel: '选择文件',
					showCaption: true,
					showRemove: true,
					showUpload: false,
					showBrowse: true,
					allowedFileExtensions: ['xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlsb', 'xlam', 'jpg'],
					showPreview: false,
					required : false,
					initialPreviewShowDelete: true,
					language: 'zh',
					browseOnZoneClick: true,
					showClose : false, 
					uploadAsync: false,
					showCancel: false,
					maxFileCount: 1,
					showPreview: true,
					dropZoneEnabled: false,
					enctype: 'multipart/form-data',
					validateInitialCount: true,
					//previewFileType: ['xls', 'xlsx', 'jpg'],
					//minImageWidth: 50, //图片的最小宽度
					//minImageHeight: 50,//图片的最小高度
					//maxImageWidth: 100,//图片的最大宽度
					//maxImageHeight: 100,//图片的最大高度
					previewFileIcon: "<iclass='glyphicon glyphicon-king'></i>",
					msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
					//hideThumbnailContent: true,
					layoutTemplates: {
						actionUpload: ''
						//actionZoom: ''
					},
					fileActionSettings: {
						removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
					},
					uploadAsync: true,
					uploadUrl: 'cpBase/NotesManage.saveNote.json',
					uploadExtraData: function() {
						/*var tpId = $('#template_select').attr('data-result');
						var name = $('#notes_noteName').val();
						tpId = tpId ? tpId : $('#report_templateId').attr('data-result');*/
						return {
							param1 : $('#notes_autoId').val(),
							param2 : $('#notes_noteId').val(),
							param3 : $('#notes_noteName').val(),
							param4 : $('#notes_tpId').attr('data-result')
						}
					}
				};
			var $el = $('#notes_fileinput').fileinput(pluginOpt);
		
			//uploadAsync = true 时调用
			$el.on('fileuploaded', function(event, data) {
				bdoSuccessBox('导入成功');
				$('#modal_notesSubForm').modal('hide');
				$('#notes_subject_table').DataTable().ajax.reload();
			});
			//uploadAsync = true 时，后台返回数据data.error 非空是调用
			$el.on('fileuploaderror', function(event, data, msg) {
				var text = msg;
				if (data && data.response.resultInfo) {
					text = data.response.resultInfo.statusText;
				}
				bdoErrorBox('系统提示', msg);
			});
			$el.on('filebatchuploadsuccess', function(event, data) {
				bdoSuccessBox('修改成功');
				$('#modal_notesSubForm').modal('hide');
				$('#notes_subject_table').DataTable().draw(false);
				//$('#notes_subject_table').DataTable().ajax.reload();
			});
			$el.on('filebatchuploaderror', function(event, data, msg) {
				var text = msg;
				if (data && data.response.resultInfo) {
					text = data.response.resultInfo.statusText;
				}
				bdoErrorBox('系统提示', msg);
			});
			// 导入按钮 
			$('#notes_subject_add, #notes_subject_update').on("click", function() {
				$el.fileinput('upload');
			});
			//关闭之后清除事件
			$('#modal_notesSubForm').on('hidden.bs.modal', function(){
				//$('#notes_subject_add, #notes_subject_update').off('click');
				$('#notes_fileinput').fileinput('clear');
				$('#notes_fileinput').fileinput('enable');
			});
		};
 		initAll.notesInitForm = function() {
			//报表模板
			var pluginOpt = {
					dropZoneEnabled: false,
					dropZoneTitle: '',
					dropZoneClickTitle: '',
					browseLabel: '选择文件',
					showCaption: true,
					showRemove: true,
					showUpload: false,
					showBrowse: true,
					allowedFileExtensions: ['xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlsb', 'xlam'],
					showPreview: false,
					required : false,
					initialPreviewShowDelete: true,
					language: 'zh',
					browseOnZoneClick: true,
					showClose : false, 
					uploadAsync: false,
					showCancel: false,
					maxFileCount: 1,
					showPreview: true,
					dropZoneEnabled: false,
					enctype: 'multipart/form-data',
					validateInitialCount: true,
					previewFileIcon: "<iclass='glyphicon glyphicon-king'></i>",
					msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
					hideThumbnailContent: true,
					layoutTemplates: {
						actionUpload: ''
						//actionZoom: ''
					},
					fileActionSettings: {
						removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
					},
					uploadAsync: true,
					uploadUrl: 'cpBase/NotesManage.initNotes.json',
					uploadExtraData: function() {
						return {
							param1 : $('#notes_initTp').attr('data-result')
						}
					}
				};
			var $el = $('#notes_fileInit').fileinput(pluginOpt);
		
			//uploadAsync = true 时调用
			$el.on('fileuploaded', function(event, data) {
				bdoSuccessBox('导入成功');
				$('#modal_notesInitForm').modal('hide');
				$('#notes_subject_table').DataTable().ajax.reload();
			});
			//uploadAsync = true 时，后台返回数据data.error 非空是调用
			$el.on('fileuploaderror', function(event, data, msg) {
				var text = msg;
				if (data && data.response.resultInfo) {
					text = data.response.resultInfo.statusText;
				}
				bdoErrorBox('系统提示', msg);
			});
			$el.on('filebatchuploadsuccess', function(event, data) {
				bdoSuccessBox('修改成功');
				$('#modal_notesInitForm').modal('hide');
				$('#notes_subject_table').DataTable().ajax.reload();
			});
			$el.on('filebatchuploaderror', function(event, data, msg) {
				var text = msg;
				if (data && data.response.resultInfo) {
					text = data.response.resultInfo.statusText;
				}
				bdoErrorBox('系统提示', msg);
			});
			// 导入按钮 
			$('#notes_subject_init').on("click", function() {
				$el.fileinput('upload');
			});
			//关闭之后清除事件
			$('#modal_notesInitForm').on('hidden.bs.modal', function(){
				//$('#notes_subject_add, #notes_subject_update').off('click');
				$('#notes_fileInit').fileinput('clear');
				$('#notes_fileInit').fileinput('enable');
			});
		};
 	
 	};
 	
 	(function() {
 		initTabModal();
	 	initTable();
	 	bindEvent();
	 	initAll.reportTable();
	 	//initAll.notesSubTable();
 	})();
 	
 })();