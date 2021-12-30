$(document).ready(function() {
	uiBlocksApi(false, 'init');

	var myDate = new Date();
	var accyear = myDate.getFullYear();//年
	//$('#benford_startDate').val(accyear - 3);
	//$('#benford_endDate').val(accyear - 1);
	var examId = 0;
	var userType = 1;
	$('#exam_detail_status').html(ComboLocalDicOption(true, '新员工培训科目状态'));
	$('#audit_detail_status').html(ComboLocalDicOption(true, '新员工培训审核状态'));
	$('#examUser_status').html(ComboLocalDicOption(true, '新员工培训科目状态'));
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		maxViewMode: 0,
		minViewMode: 0,
		minuteStep:1,
		language: 'zh-CN', //语言设置
		format: 'yyyy-mm-dd' //日期显示格式
	});
	/*$('.datetime-picker').datetimepicker({
		//autoclose: true,
		//todayHighlight: true,
		//maxView: 0,
		//minView: 0,
		//minuteStep:1,
		language: 'zh-CN', //语言设置
		format: 'yyyy-mm-dd HH:ii:ss' //日期显示格式
	});*/
	//时间毫秒数转时间
	function getMyDate(str) {
		if (str != null && str != '') {
			var oDate = new Date(str),
				oYear = oDate.getFullYear(),
				oMonth = oDate.getMonth() + 1,
				oDay = oDate.getDate(),
				oHour = oDate.getHours(),
				oMin = oDate.getMinutes(),
				oSen = oDate.getSeconds(),
				oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
			return oTime;
		} else {
			return '';
		}
	}
	
	//补0操作
	function getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + num;
		}
		return num;
	}
	/**  人员角色关系  */
	$('#roleuser_depart').treecombo({
		url : 'base/TreeCommon.findDepartTree.json',
		params : {},
		view : {
			leafIcon: 'fa fa-building text-flat',    
			nodeIcon: 'fa fa-bank text-primary-light',
			folderSelectable: true,
			multiSelect: false
		}
	});
	/** table 属性 */
	var exam_view_count = 1;
	var exam_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'TOTE00001',
				menuId: window.sys_menuId,
				param1: $('#exam_name').val(),
				param2: '1' //教学考试
			}
		},
		tableParam: {
			select: true,
			scrollX: true,
			scrollY: false,
			scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			bdolxLoader: true,
			//order: [1, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: exam_view_count++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="examEditBtn" data-placement="top" title="编辑" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="examCopyBtn" data-placement="top" title="复制" data-toggle="tooltip"><i class="fa fa-files-o"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="examDetailBtn" data-placement="top" title="详情" data-toggle="tooltip"><i class="fa fa-eye"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="examUserBtn" data-placement="top" title="考生名单" data-toggle="tooltip"><i class="fa fa-user"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="examStartBtn" data-placement="top" title="开始" data-toggle="tooltip"><i class="fa fa-play"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="examCloseBtn" data-placement="top" title="关闭" data-toggle="tooltip"><i class="fa fa-stop"></i></button>';
						return renderStr;
					}
				}, {
					targets: exam_view_count++,
					orderable: true,
					className: 'text-center',
					title: '考试名称',
					name: 'examName',
					data: 'examName',
					width: '100px'
				}, {
					targets: exam_view_count++,
					orderable: false,
					className: 'text-center',
					title: '创建人',
					name: '__ucreateUserName',
					data: '__ucreateUserName',
					width: '60px'
				}, {
					targets: exam_view_count++,
					orderable: false,
					className: 'text-center',
					title: '考试结束时间',
					name: 'endDate',
					data: 'endDate',
					width: '60px',
					render: function(data, type, row, meta) {
						return getMyDate(data);
					}

				}, {
					targets: exam_view_count++,
					orderable: false,
					className: 'text-center',
					title: '考试状态',
					name: 'examStatusName',
					data: 'examStatusName',
					width: '50px'
				}
			]
		}
	};

	/** table 属性 */
	var exam_subject_view_count = 1;
	var exam_subject_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'TOTE00002',
				menuId: window.sys_menuId,
				param1: examId
			}
		},
		tableParam: {
			select: true,
			scrollX: true,
			scrollY: false,
			scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			bdolxLoader: true,
			//order: [1, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: exam_subject_view_count++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="subjectEditBtn" data-placement="top" title="编辑" data-toggle="tooltip"><i class="fa fa-file-excel-o"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subjectDelBtn" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-close"></i></button>';
						return renderStr;
					}
				}, {
					targets: exam_subject_view_count++,
					orderable: true,
					className: 'text-center',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '100px'
				}, {
					targets: exam_subject_view_count++,
					orderable: false,
					className: 'text-center',
					title: '底稿文件',
					name: 'fileName',
					data: 'fileName',
					width: '100px'
				}
			]
		}
	};

	/** table 属性 */
	var exam_user_view_count = 1;
	var exam_user_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'TOTE00003',
				menuId: window.sys_menuId,
				param1: examId,
				param2: '1'
			}
		},
		tableParam: {
			select: true,
			scrollX: true,
			scrollY: false,
			scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			bdolxLoader: true,
			//order: [1, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: exam_user_view_count++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="userDelBtn" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-close"></i></button>';
						return renderStr;
					}
				}, {
					targets: exam_user_view_count++,
					orderable: true,
					className: 'text-center',
					title: '姓名',
					name: 'name',
					data: 'name',
					width: '100px'
				}, {
					targets: exam_user_view_count++,
					orderable: false,
					className: 'text-center',
					title: '事业部',
					name: 'hrDeptCode018',
					data: 'hrDeptCode018',
					width: '100px'
				}, {
					targets: exam_user_view_count++,
					orderable: false,
					className: 'text-center',
					title: '机构',
					name: 'hrDeptCode019',
					data: 'hrDeptCode019',
					width: '100px'
				}, {
					targets: exam_user_view_count++,
					orderable: false,
					className: 'text-center',
					title: '部门',
					name: '__departmentid',
					data: '__departmentid',
					width: '100px',
					render : function(data, type, row, meta) {
						return data.departName;
					}
				}
			]
		}
	};
	var exam_audit_view = $.extend(true, {}, exam_user_view);
	exam_audit_view.localParam.urlparam.param2 = '2';

	/** table 属性 */
	var exam_user_list_view_count = 1;
	var exam_user_list_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'TOTE00003',
				menuId: window.sys_menuId,
				param1: examId,
				param2: '1',
				param3: $('#examUser_name').val(),
				param4: $('#examUser_status').val()
			}
		},
		tableParam: {
			select: true,
			scrollX: true,
			scrollY: false,
			scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			bdolxLoader: true,
			//order: [1, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: exam_user_list_view_count++,
					orderable: true,
					className: 'text-center',
					title: '姓名',
					name: 'name',
					data: 'name',
					width: '100px'
				}, {
					targets: exam_user_list_view_count++,
					orderable: false,
					className: 'text-center',
					title: '事业部',
					name: 'hrDeptCode018',
					data: 'hrDeptCode018',
					width: '100px'
				}, {
					targets: exam_user_list_view_count++,
					orderable: false,
					className: 'text-center',
					title: '机构',
					name: 'hrDeptCode019',
					data: 'hrDeptCode019',
					width: '100px'
				}, {
					targets: exam_user_list_view_count++,
					orderable: false,
					className: 'text-center',
					title: '部门',
					name: '__departmentid',
					data: '__departmentid',
					width: '100px',
					render : function(data, type, row, meta) {
						return data.departName;
					}
				}, {
					targets: exam_user_list_view_count++,
					orderable: false,
					className: 'text-center',
					title: '考试状态',
					name: 'examStatusName',
					data: 'examStatusName',
					width: '100px'
				}
			]
		}
	};
	
	/** table 属性 */
	var user_select_view_count = 1;
	var user_select_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'TOTE00004',
				menuId: window.sys_menuId,
				param1: $('#user_name').val(),
				param2: $('#roleuser_depart').val()
			}
		},
		tableParam: {
			select: true,
			scrollX: true,
			scrollY: false,
			scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			bdolxLoader: true,
			//order: [1, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: user_select_view_count++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="userselectBtn" data-placement="top" title="添加" data-toggle="tooltip"><i class="fa fa-plus"></i></button>';
						return renderStr;
					}
				}, {
					targets: user_select_view_count++,
					orderable: true,
					className: 'text-center',
					title: '姓名',
					name: 'name',
					data: 'name',
					width: '100px'
				}, {
					targets: user_select_view_count++,
					orderable: false,
					className: 'text-center',
					title: '事业部',
					name: 'hrDeptCode018',
					data: 'hrDeptCode018',
					width: '100px'
				}, {
					targets: user_select_view_count++,
					orderable: false,
					className: 'text-center',
					title: '机构',
					name: 'hrDeptCode019',
					data: 'hrDeptCode019',
					width: '100px'
				}, {
					targets: user_select_view_count++,
					orderable: false,
					className: 'text-center',
					title: '部门',
					name: '__departmentid',
					data: '__departmentid',
					width: '100px',
					render : function(data, type, row, meta) {
						return data.departName;
					}
				}
			]
		}
	};
	/** 搜索按钮 */
	$('#btn_exam_search').click(function() {
		exam_view.localParam.urlparam.param1 = $('#exam_name').val();
		BdoDataTable('examTable', exam_view);
	});
	$('#btn_exam_search').click();
	
	/** 添加考试 */
	$('#exam_add').click(function() {
		$('#exam_name_modal').val('');
		$('#exam_endDate_modal').val('');
		$('#exam_endTime_modal').val('');
		$('#modal_addExm').modal('show');
	});
	
	/** 新增考试 */
	$('#exam_save').click(function() {
		var name_model = $('#exam_name_modal').val();
		if (name_model == null || name_model == '') {
			bdoInfoBox('提示', '请填写考试名称');
			return;
		}
		var exam_endDate_modal = $('#exam_endDate_modal').val();
		if (exam_endDate_modal == null || exam_endDate_modal == '') {
			bdoInfoBox('提示', '请选择考试结束时间');
			return;
		}
		var exam_endTime_modal = $('#exam_endTime_modal').val();
		if (exam_endTime_modal == null || exam_endTime_modal == '') {
			bdoInfoBox('提示', '请选择考试结束时间');
			return;
		}
		if(exam_endTime_modal.length == 5){
			exam_endTime_modal = exam_endTime_modal + ':00';
		}
		var tip = '确认保存？';
		bdoConfirmBox('确认', tip, function() {
			$.ajax({
				url: 'tote/ToteExam.saveToteExam.json',
				type: 'post',
				data: {
					param1: name_model,
					param2: exam_endDate_modal + ' ' + exam_endTime_modal,
					param3: '1'//教学考试
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						$('#modal_addExm').modal('hide');
						$('#examTable').DataTable().ajax.reload(null,false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	/** 复制考试 */
	$('#exam_copy').click(function() {
		var name_model = $('#exam_name_copy').val();
		if (name_model == null || name_model == '') {
			bdoInfoBox('提示', '请填写考试名称');
			return;
		}
		var tip = '确认复制？';
		bdoConfirmBox('确认', tip, function() {
			$.ajax({
				url: 'tote/ToteExam.copyToteExam.json',
				type: 'post',
				data: {
					param1: examId,
					param2: name_model
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						$('#modal_copyExm').modal('hide');
						$('#examTable').DataTable().ajax.reload(null,false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	/** 修改考试 */
	$('#exam_edit_save').click(function() {
		var name_model = $('#exam_name_update').val();
		if (name_model == null || name_model == '') {
			bdoInfoBox('提示', '请填写考试名称');
			return;
		}
		var exam_endDate_modal = $('#exam_endDate_update').val();
		if (exam_endDate_modal == null || exam_endDate_modal == '') {
			bdoInfoBox('提示', '请选择考试结束时间');
			return;
		}
		var exam_endTime_modal = $('#exam_endTime_update').val();
		if (exam_endTime_modal == null || exam_endTime_modal == '') {
			bdoInfoBox('提示', '请选择考试结束时间');
			return;
		}
		if(exam_endTime_modal.length == 5){
			exam_endTime_modal = exam_endTime_modal + ':00';
		}
		var tip = '确认修改？';
		bdoConfirmBox('确认', tip, function() {
			$.ajax({
				url: 'tote/ToteExam.updateToteExam.json',
				type: 'post',
				data: {
					param1: examId,
					param2: name_model,
					param3: exam_endDate_modal + ' ' + exam_endTime_modal
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						$('#modal_examEdit').modal('hide');
						$('#examTable').DataTable().ajax.reload(null,false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//编辑
	$('#examTable').on('click', 'button[name="examEditBtn"]', function() {
		var object = $('#examTable').DataTable().data()[$(this).closest('tr').index()];
		examId = object.autoId;
		var endDate = getMyDate(object.endDate);
		$('#exam_name_update').val(object.examName);
		$('#exam_endDate_update').val(endDate.substr(0,10));
		$('#exam_endTime_update').val(endDate.substr(11,8));
		exam_subject_view.localParam.urlparam.param1 = examId;
		BdoDataTable('examSubjectTable', exam_subject_view);
		exam_user_view.localParam.urlparam.param1 = examId;
		BdoDataTable('examUserTable', exam_user_view);
		exam_audit_view.localParam.urlparam.param1 = examId;
		BdoDataTable('examAuditTable', exam_audit_view);
		$('#modal_examEdit').modal('show');

	});
	//复制
	$('#examTable').on('click', 'button[name="examCopyBtn"]', function() {
		var object = $('#examTable').DataTable().data()[$(this).closest('tr').index()];
		examId = object.autoId;
		$('#exam_name_copy').val('');
		$('#modal_copyExm').modal('show');
	});
	
	//上传科目附件
	$('#exam_subject_add').on('click', function() {
		$('#subject_modal_add').val('');
		$('#modal_upload_examSubject').modal('show');
		//底稿模板
		var pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			browseLabel: '选择文件',
			showCaption: true,
			showRemove: false,
			showUpload: false,
			showBrowse: true,
			showPreview: false,
			required: true,
			initialPreviewShowDelete: true,
			language: 'zh',
			browseOnZoneClick: true,
			showClose: false,
			uploadAsync: false,
			showCancel: false,
			allowedFileExtensions: ['xlsx'],//接收的文件后缀
			maxFileCount: 1, //表示允许同时上传的最大文件个数
			autoReplace:true,//是否可替换
			hideThumbnailContent: true,
			layoutTemplates: {
				actionUpload: '',
				actionZoom: ''
			},
			fileActionSettings: {
				removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
			},
			uploadAsync: true,
			uploadUrl: 'tote/ToteExam.uploadSubject.json',
			uploadExtraData: function() {
				return {
					param1: '',
					param2: ''
				};
			}
		};

		pluginOpt.uploadExtraData = function() {
			return {
				param1: examId,
				param2: $('#subject_modal_add').val()
			};
		};
		$('#upload_fileinput_modal').fileinput('destroy');
		var $el = $('#upload_fileinput_modal').fileinput(pluginOpt);

		//uploadAsync = true 时调用
		$el.on('fileuploaded', function(event, data) {
			bdoSuccessBox('上传成功');
			$('#modal_upload_examSubject').modal('hide');
			$('#upload_fileinput_modal').fileinput('clear');
			$('#upload_fileinput_modal').fileinput('enable');
			$('#examSubjectTable').DataTable().ajax.reload(null,false);
		});
		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', (data && data.response.resultInfo && data.response.resultInfo.statusText) ? data.response.resultInfo.statusText : msg);
			uploadFileSuccess(data);
		});
		//文件上传成功/失败后，处理后台响应函数
		function uploadFileSuccess(data) {
			$('#upload_fileinput_modal').fileinput('clear');
			$('#upload_fileinput_modal').fileinput('enable');
			$('#upload_fileinput_modal').val('');
			$('.fileinput-remove-button').click();
		}
		/** 导入按钮 */
		$('#subjec_upload_modal').on('click', function() {
			var subjectName = $('#subject_modal_add').val();
			if(subjectName == null || subjectName == ''){
				bdoInfoBox('提示', '请填写科目');
				return;
			}
			var fileUrl = $('#upload_fileinput_modal').val();
			console.log(fileUrl);
			if (fileUrl == null || fileUrl == '') {
				bdoInfoBox('提示', '请选择导入文件');
				return;
			}
			/*var suffix = fileUrl.substring(fileUrl.lastIndexOf(".") + 1);
			let reg = new RegExp(/xlsx/i);
			if(!reg.test(suffix)){
				bdoInfoBox('提示', '请上传xlsx文件');
				return;
			}*/
			var tip = '确认保存？';
			bdoConfirmBox('确认', tip, function() {
				$el.fileinput('upload');
			});
		});
		$('#modal_upload_examSubject').one('hidden.bs.modal', function() {
			$('#subjec_upload_modal').off('click');
		});

	});
	//编辑底稿
	$('#examSubjectTable').on('click', 'button[name="subjectEditBtn"]', function() {
		var object = $('#examSubjectTable').DataTable().data()[$(this).closest('tr').index()];
		var nodeData = {
			extraOptions: object,
			currentNode: {
				extraOptions: object
			}
		};
		nodeData.type = 'edit';
		$.sessionStorage('tplFileNode', JSON.stringify(nodeData));
		window.open('/Faith/bdotote.do?m=openToteExamTplFile');
	});
	//选择考试人员
	$('#exam_user_add').on('click', function() {
		userType = 1;
		$('#user_name').val('');
		$('#roleuser_depart').treecombo('setTreeComboValue',['', '']);
		user_select_view.localParam.urlparam.param1 = $('#user_name').val();
		user_select_view.localParam.urlparam.param2 = $('#roleuser_depart').val();
		BdoDataTable('userTable', user_select_view);
		$('#modal_selectUser').modal('show');
	});
	//选择审核人员
	$('#exam_audit_add').on('click', function() {
		userType = 2;
		$('#user_name').val('');
		$('#roleuser_depart').treecombo('setTreeComboValue',['', '']);
		user_select_view.localParam.urlparam.param1 = $('#user_name').val();
		user_select_view.localParam.urlparam.param2 = $('#roleuser_depart').val();
		BdoDataTable('userTable', user_select_view);
		$('#modal_selectUser').modal('show');
	});
	//查询人员
	$('#btn_user_search').on('click', function() {
		user_select_view.localParam.urlparam.param1 = $('#user_name').val();
		user_select_view.localParam.urlparam.param2 = $('#roleuser_depart').treecombo('getTreeComboValue');
		BdoDataTable('userTable', user_select_view);
	});
	//保存人员
	$('#userTable').on('click', 'button[name="userselectBtn"]', function() {
		var object = $('#userTable').DataTable().data()[$(this).closest('tr').index()];
		var tip = '确认添加？';
		bdoConfirmBox('确认', tip, function() {
			$.ajax({
				url: 'tote/ToteExam.saveToteUser.json',
				type: 'post',
				data: {
					param1: examId,
					param2: object.id,
					param3: userType
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						if(userType == 1){
							$('#examUserTable').DataTable().ajax.reload(null,false);
						}else{
							$('#examAuditTable').DataTable().ajax.reload(null,false);
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//删除人员
	$('#examUserTable').on('click', 'button[name="userDelBtn"]', function() {
		var object = $('#examUserTable').DataTable().data()[$(this).closest('tr').index()];
		deleteUser(object.autoId, 1);
	});
	//删除人员
	$('#examAuditTable').on('click', 'button[name="userDelBtn"]', function() {
		var object = $('#examAuditTable').DataTable().data()[$(this).closest('tr').index()];
		deleteUser(object.autoId, 2);
	});
	var deleteUser = function(autoId, type){
		var tip = '确认删除？';
		bdoConfirmBox('确认', tip, function() {
			$.ajax({
				url: 'tote/ToteExam.deleteToteUser.json',
				type: 'post',
				data: {
					param1: autoId,
					param2: examId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						if(type == 1){
							$('#examUserTable').DataTable().ajax.reload(null,false);
						}else{
							$('#examAuditTable').DataTable().ajax.reload(null,false);
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	};
	//删除科目
	$('#examSubjectTable').on('click', 'button[name="subjectDelBtn"]', function() {
		var object = $('#examSubjectTable').DataTable().data()[$(this).closest('tr').index()];
		var tip = '确认删除？';
		bdoConfirmBox('确认', tip, function() {
			$.ajax({
				url: 'tote/ToteExam.deleteToteSubject.json',
				type: 'post',
				data: {
					param1: object.autoId,
					param2: examId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#examSubjectTable').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//关闭考试
	$('#examTable').on('click', 'button[name="examCloseBtn"]', function() {
		var object = $('#examTable').DataTable().data()[$(this).closest('tr').index()];
		var tip = '确认关闭？';
		bdoConfirmBox('确认', tip, function() {
			$.ajax({
				url: 'tote/ToteExam.closeExam.json',
				type: 'post',
				data: {
					param1: object.autoId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#examTable').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//开始考试
	$('#examTable').on('click', 'button[name="examStartBtn"]', function() {
		var object = $('#examTable').DataTable().data()[$(this).closest('tr').index()];
		var tip = '确认开始？';
		bdoConfirmBox('确认', tip, function() {
			bdoInProcessingBox('处理中');
			$.ajax({
				url: 'tote/ToteExam.startExam.json',
				type: 'post',
				data: {
					param1: object.autoId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#examTable').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//考试详情
	$('#examTable').on('click', 'button[name="examDetailBtn"]', function() {
		var object = $('#examTable').DataTable().data()[$(this).closest('tr').index()];
		exam_detail_view.localParam.urlparam.param6 = object.autoId;
		$('#exam_detail_name').val(object.examName);
		$('#btn_exam_detail_search').click();
		$('#exam_detail_a').click();
	});
	//考生名单
	$('#examTable').on('click', 'button[name="examUserBtn"]', function() {
		var object = $('#examTable').DataTable().data()[$(this).closest('tr').index()];
		exam_user_list_view.localParam.urlparam.param1 = object.autoId;
		exam_user_list_view.localParam.urlparam.param3 = '';
		exam_user_list_view.localParam.urlparam.param4 = '';
		BdoDataTable('examUserListTable', exam_user_list_view);
		$('#modal_examUser_list').modal('show');
	});
	/** 搜索按钮 */
	$('#btn_examUser_search').click(function() {
		exam_user_list_view.localParam.urlparam.param3 = $('#examUser_name').val();
		exam_user_list_view.localParam.urlparam.param4 = $('#examUser_status').val();
		BdoDataTable('examUserListTable', exam_user_list_view);
	});
	/** table 属性 */
	var exam_detail_view_count = 1;
	var exam_detail_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'TOTE00005',
				menuId: window.sys_menuId,
				param1: $('#exam_detail_name').val(),
				param2: $('#subject_detail_name').val(),
				param4: $('#user_detail_name').val(),
				param6: '',
				param10: '1', //教学考试
				param11: $('#exam_detail_status').val(),
				param12: $('#audit_detail_status').val()
			}
		},
		tableParam: {
			select: true,
			scrollX: true,
			scrollY: false,
			scrollCollapse: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			bdolxLoader: true,
			//order: [1, 'asc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: exam_detail_view_count++,
					orderable: false,
					className: 'text-center',
					title: '详情',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="examDetailBtn" data-placement="top" title="详情" data-toggle="tooltip"><i class="fa fa-file-excel-o"></i></button>';
						return renderStr;
					}
				}, {
					targets: exam_detail_view_count++,
					orderable: true,
					className: 'text-center',
					title: '考试名称',
					name: 'examName',
					data: 'examName',
					width: '100px'
				}, {
					targets: exam_detail_view_count++,
					orderable: false,
					className: 'text-center',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '100px'
				}, {
					targets: exam_detail_view_count++,
					orderable: true,
					className: 'text-center',
					title: '考生姓名',
					name: 'name',
					data: 'name',
					width: '50px'
				}, {
					targets: exam_detail_view_count++,
					orderable: false,
					className: 'text-center',
					title: '考试结束时间',
					name: 'endDate',
					data: 'endDate',
					width: '60px',
					render: function(data, type, row, meta) {
						return getMyDate(data);
					}

				}, {
					targets: exam_detail_view_count++,
					orderable: false,
					className: 'text-center',
					title: '考试状态',
					name: 'examStatusName',
					data: 'examStatusName',
					width: '50px'
				}, {
					targets: exam_detail_view_count++,
					orderable: false,
					className: 'text-center',
					title: '审核人',
					name: '__uauditUserName',
					data: '__uauditUserName',
					width: '60px'
				}, {
					targets: exam_detail_view_count++,
					orderable: false,
					className: 'text-center',
					title: '审核状态',
					name: 'auditStatusName',
					data: 'auditStatusName',
					width: '50px'
				}
			]
		}
	};

	/** 详情搜索按钮 */
	$('#btn_exam_detail_search').click(function() {
		exam_detail_view.localParam.urlparam.param1 = $('#exam_detail_name').val();
		exam_detail_view.localParam.urlparam.param2 = $('#subject_detail_name').val();
		exam_detail_view.localParam.urlparam.param4 = $('#user_detail_name').val();
		exam_detail_view.localParam.urlparam.param11 = $('#exam_detail_status').val();
		exam_detail_view.localParam.urlparam.param12 = $('#audit_detail_status').val();
		BdoDataTable('examDetailTable', exam_detail_view);
	});

	//导入考生
	$('#exam_user_upload').on('click', function() {
		$('#modal_upload_examUser').modal('show');
		//底稿模板
		var pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			browseLabel: '选择文件',
			showCaption: true,
			showRemove: false,
			showUpload: false,
			showBrowse: true,
			showPreview: false,
			required: true,
			initialPreviewShowDelete: true,
			language: 'zh',
			browseOnZoneClick: true,
			showClose: false,
			uploadAsync: false,
			showCancel: false,
			allowedFileExtensions: ['xlsx'],//接收的文件后缀
			maxFileCount: 1, //表示允许同时上传的最大文件个数
			autoReplace:true,//是否可替换
			hideThumbnailContent: true,
			layoutTemplates: {
				actionUpload: '',
				actionZoom: ''
			},
			fileActionSettings: {
				removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
			},
			uploadAsync: true,
			uploadUrl: 'tote/ToteExam.importExamUser.json',
			uploadExtraData: function() {
				return {
					param1: '',
					param2: ''
				};
			}
		};

		pluginOpt.uploadExtraData = function() {
			return {
				param1: examId
			};
		};
		$('#upload_exam_user_modal').fileinput('destroy');
		var $el = $('#upload_exam_user_modal').fileinput(pluginOpt);

		//uploadAsync = true 时调用
		$el.on('fileuploaded', function(event, data) {
			bdoSuccessBox('上传成功');
			$('#modal_upload_examUser').modal('hide');
			$('#upload_exam_user_modal').fileinput('clear');
			$('#upload_exam_user_modal').fileinput('enable');
			$('#examUserTable').DataTable().ajax.reload(null,false);
		});
		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', (data && data.response.resultInfo && data.response.resultInfo.statusText) ? data.response.resultInfo.statusText : msg);
			uploadFileSuccess(data);
		});
		//文件上传成功/失败后，处理后台响应函数
		function uploadFileSuccess(data) {
			$('#upload_exam_user_modal').fileinput('clear');
			$('#upload_exam_user_modal').fileinput('enable');
			$('#upload_exam_user_modal').val('');
			$('.fileinput-remove-button').click();
		}
		/** 导入按钮 */
		$('#user_upload_modal').on('click', function() {
			var fileUrl = $('#upload_exam_user_modal').val();
			console.log(fileUrl);
			if (fileUrl == null || fileUrl == '') {
				bdoInfoBox('提示', '请选择导入文件');
				return;
			}
			var tip = '确认保存？';
			bdoConfirmBox('确认', tip, function() {
				$el.fileinput('upload');
			});
		});
		$('#modal_upload_examUser').one('hidden.bs.modal', function() {
			$('#user_upload_modal').off('click');
		});

	});
	// 考试详情
	$('#examDetailTable').on('click', 'button[name="examDetailBtn"]', function() {
		var object = $('#examDetailTable').DataTable().data()[$(this).closest('tr').index()];
		var nodeData = {
			extraOptions: object,
			currentNode: {
				extraOptions: object
			}
		};
		nodeData.type = '3';
		$.sessionStorage('fileNode', JSON.stringify(nodeData));
		window.open('/Faith/bdotote.do?m=openToteExamFile');
	});
});
