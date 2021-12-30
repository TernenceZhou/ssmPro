$(function() {
	uiBlocksApi(false, 'init');

	var userCusNowCusId = '';

	// 临时客户 列表
	var userCusTableParamIndex = 1;
	var userCusTableParam = {
		localParam : {
			tabNum : true,
			url : 'cpBase/General.query.json',
			urlparam : {
				menuId : window.sys_menuId,
				sqlId : 'FIN204001',
				param1 : ''
			}
		},
		tableParam : {
			select : true,
			lengthChange : true,
			ordering : true,
			order : [2, 'DESC'],
			serverSide : true,
			columnDefs : [{
				targets : userCusTableParamIndex++,
				orderable : false,
				className : 'text-center',
				title : '处理',
				width : '40px',
				render : function(data, type, row, meta) {
					var renderStr = '';
					renderStr += '<button class="btn btn-xs btn-info" type="button" name="cusUser" data-placement="top" title="人员" data-toggle="tooltip"><i class="fa fa-user"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="cusEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="cusDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
					return renderStr;
				}
			}, {
				targets : userCusTableParamIndex++,
				className : 'text-center',
				title : '临时客户ID',
				name : 'userCustomerId',
				data : 'userCustomerId',
				width : '50px'
			}, {
				targets : userCusTableParamIndex++,
				className : 'text-left',
				title : '临时客户名称',
				name : 'userCustomerName',
				data : 'userCustomerName',
				width : '150px'
			}, {
				targets : userCusTableParamIndex++,
				className : 'text-center',
				title : '创建时间',
				name : 'createDate',
				data : 'createDate',
				width : '20px',
				render : function(data, type, row, meta) {
					return new Date(data).format('yyyy-MM-dd');
				}
			}, {
				targets : userCusTableParamIndex++,
				className : 'text-center',
				title : '过期时间',
				name : 'validDate',
				data : 'validDate',
				width : '20px',
				render : function(data, type, row, meta) {
					if(data != null){
						return new Date(data).format('yyyy-MM-dd');
					}else{
						return data;
					}
				}
			}]
		}
	};

	BdoDataTable('usercus_table', userCusTableParam);

	// 搜索按钮
	$('#usercus_btn_search').click(function() {
		userCusTableParam.localParam.urlparam.param1 = $('#usercus_search_userCustomerName')
				.val();
		BdoDataTable('usercus_table', userCusTableParam);
	});

	// 新增临时客户 弹框
	$('#usercus_btn_addcus').click(function() {
				$('#usercus_modal_savecus').find('input').val('');
				$('#usercus_modal_savecus').modal('show');
			});

	// 新增临时客户 保存
	$('#usercus_modal_savecus_btn_save').click(function() {
		var userCustomerId = $('#usercus_modal_savecus_userCustomerId').val();
		var userCustomerName = $('#usercus_modal_savecus_userCustomerName')
				.val();
		if (!userCustomerName || userCustomerName == '') {
			bdoErrorBox('错误', '请输入客户名称!');
			return;
		}
		$.ajax({
					type : 'post',
					url : 'finCenter/UserCustomerJson.saveUsercustomer.json',
					data : {
						menuId : window.sys_menuId,
						param1 : userCustomerId,
						param2 : userCustomerName
					},
					dataType : 'json',
					success : function(data) {
						if (data.success) {
							$('#usercus_table').DataTable().ajax.reload();
							$('#usercus_modal_savecus').modal('hide');
							bdoSuccessBox('提示', '保存成功');
						} else {
							bdoErrorBox('错误', data.resultInfo.statusText);
						}

					}
				});
	});

	// 临时客户 用户 弹框
	$('#usercus_table').on('click', 'button[name="cusUser"]', function() {
		var object = $('#usercus_table').DataTable().data()[$(this)
				.closest('tr').index()];
		userCusNowCusId = object.userCustomerId;
		$('#usercus_modal_user').modal('show');
	});

	// 临时客户 修改
	$('#usercus_table').on('click', 'button[name="cusEdit"]', function() {
		var object = $('#usercus_table').DataTable().data()[$(this)
				.closest('tr').index()];
		userCusNowCusId = object.userCustomerId;
		$('#usercus_modal_savecus').modal('show');
		$('#usercus_modal_savecus_userCustomerId').val(object.userCustomerId);
		$('#usercus_modal_savecus_userCustomerName')
				.val(object.userCustomerName);
	});

	// 临时客户 删除
	$('#usercus_table').on('click', 'button[name="cusDelete"]', function() {
		var object = $('#usercus_table').DataTable().data()[$(this)
				.closest('tr').index()];
		userCusNowCusId = object.userCustomerId;
		bdoConfirmBox('删除', '确认删除客户' + '[' + object.userCustomerName + ']',
				function() {
					$.ajax({
						type : 'post',
						url : 'finCenter/UserCustomerJson.deleteUsercustomer.json',
						data : {
							menuId : window.sys_menuId,
							param1 : object.userCustomerId
						},
						dataType : 'json',
						success : function(data) {
							if (data.success) {
								$('#usercus_table').DataTable().ajax.reload();
								$('#usercus_modal_savecus').modal('hide');
								bdoSuccessBox('提示', '删除成功');
							} else {
								bdoErrorBox('错误', data.resultInfo.statusText);
							}

						}
					});
				});
	});

	// 临时客户 用户 列表
	$('#usercus_modal_user').on('shown.bs.modal', function() {
		var userCusModalUserParamIndex = 1;
		var userCusModalUserParam = {
			localParam : {
				tabNum : true,
				url : 'cpBase/General.query.json',
				urlparam : {
					menuId : window.sys_menuId,
					sqlId : 'FIN204003',
					param1 : userCusNowCusId
				}
			},
			tableParam : {
				select : true,
				lengthChange : false,
				ordering : true,
				order : [2, 'asc'],
				serverSide : true,
				scrollY : '280',
				dom : '<"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				columnDefs : [{
					targets : userCusModalUserParamIndex++,
					orderable : false,
					className : 'text-center',
					title : '<input type="checkbox" id="user_selectAll">',
					width : '50px',
					render : function(data, type, row, meta) {
						var checkBox = '';
						checkBox += '<input type="checkbox" name="user_selectOne">'
						return checkBox;
					}
				}, {
					targets : userCusModalUserParamIndex++,
					className : 'text-center',
					title : '姓名',
					name : 'userName',
					data : 'userName',
					width : '50px'
				}]
			}
		};

		$('#usercus_modal_user_btn_search').off();
		$('#usercus_modal_user_btn_search').click(function() {
			userCusModalUserParam.localParam.urlparam.filter = getUserFilter();
			BdoDataTable('usercus_modal_user_table', userCusModalUserParam);

			$('#user_selectAll').off();
			$('#user_selectAll').prop("checked", false);
			$('#usercus_modal_user_table').find('input[name="user_selectOne"]')
					.prop("checked", false);
			$('#user_selectAll').click(function() {
				var isCheck = $('#user_selectAll').prop('checked');
				var checklist = $('#usercus_modal_user_table')
						.find('input[name="user_selectOne"]');
				$.each(checklist, function(i, item) {
							$(item).prop('checked', isCheck)
						})
			});
		});
		$('#usercus_modal_user_btn_search').click();
	});

	// 添加人员 弹框
	$('#usercus_modal_user_btn_addUser').click(function() {
				$('#usercus_modal_addUser').modal('show');
			});

	// 删除人员
	$('#usercus_modal_user_btn_deleteUser').click(function() {
		var deleteUserIds = '';
		$('#usercus_modal_user_table')
				.find('input[name="user_selectOne"]:checked').each(function() {
					var object = $('#usercus_modal_user_table').DataTable()
							.data()[$(this).closest('tr').index()];
					if (deleteUserIds != '') {
						deleteUserIds = deleteUserIds + ','
					}
					deleteUserIds += object.userId;
				});
		if (deleteUserIds != '') {
			bdoConfirmBox('删除', '确认删除选择用户', function() {
				$.ajax({
							type : 'post',
							url : 'finCenter/UserCustomerJson.deleteUsercusUser.json',
							data : {
								menuId : window.sys_menuId,
								param1 : userCusNowCusId,
								param2 : deleteUserIds
							},
							dataType : 'json',
							success : function(data) {
								if (data.success) {
									$('#usercus_modal_user_table').DataTable().ajax
											.reload();
									bdoSuccessBox('提示', '删除成功');
								} else {
									bdoErrorBox('错误',
											data.resultInfo.statusText);
								}
							}
						});
			});
		}
	});

	// 添加人员 列表
	$('#usercus_modal_addUser').on('shown.bs.modal', function() {
		var userCusModalAddUserParamIndex = 1;
		var userCusModalAddUserParam = {
			localParam : {
				tabNum : true,
				url : 'cpBase/General.query.json',
				urlparam : {
					menuId : window.sys_menuId,
					sqlId : 'sys.S200149'
				}
			},
			tableParam : {
				select : true,
				lengthChange : false,
				ordering : true,
				order : [2, 'asc'],
				serverSide : true,
				scrollY : '300',
				dom : '<"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				columnDefs : [{
					targets : userCusModalAddUserParamIndex++,
					orderable : false,
					className : 'text-center',
					title : '<input type="checkbox" id="adduser_selectAll">',
					width : '50px',
					render : function(data, type, row, meta) {
						var checkBox = '';
						checkBox += '<input type="checkbox" name="adduser_selectOne">'
						return checkBox;
					}
				}, {
					targets : userCusModalAddUserParamIndex++,
					className : 'text-center',
					title : '姓名',
					name : 'name',
					data : 'name',
					width : '50px'
				}, {
					targets : userCusModalAddUserParamIndex++,
					className : 'text-left',
					title : '部门',
					name : 'departname',
					data : 'departname',
					width : '100px'
				}]
			}
		};

		$('#usercus_modal_addUser_depart').off();
		$('#usercus_modal_addUser_depart').treecombo({
					url : './base/TreeCommon.findDepartTree.json',
					params : {},
					view : {
						leafIcon : 'fa fa-building text-flat',
						nodeIcon : 'fa fa-bank text-primary-light',
						folderSelectable : true,
						multiSelect : false
					}
				});
		$('#usercus_modal_addUser_depart').treecombo('setTreeComboValue',
				[departIdrSession, departNmrSession]);

		$('#usercus_modal_addUser_btn_search').off();
		$('#usercus_modal_addUser_btn_search').click(function() {
			userCusModalAddUserParam.localParam.urlparam.filter = getAddUserFilter();
			BdoDataTable('usercus_modal_addUser_table',
					userCusModalAddUserParam);

			$('#adduser_selectAll').off();
			$('#adduser_selectAll').prop("checked", false);
			$('#usercus_modal_addUser_table')
					.find('input[name="adduser_selectOne"]').prop("checked",
							false);
			$('#adduser_selectAll').click(function() {
				var isCheck = $('#adduser_selectAll').prop('checked');
				var checklist = $('#usercus_modal_addUser_table')
						.find('input[name="adduser_selectOne"]');
				$.each(checklist, function(i, item) {
							$(item).prop('checked', isCheck)
						})
			});
		});
		$('#usercus_modal_addUser_btn_search').click();
	});

	// 临时客户 用户 新增
	$('#usercus_modal_addUser_add').click(function() {
		var addUserIds = '';
		$('#usercus_modal_addUser_table')
				.find('input[name="adduser_selectOne"]:checked').each(
						function() {
							var object = $('#usercus_modal_addUser_table')
									.DataTable().data()[$(this).closest('tr')
									.index()];
							if (addUserIds != '') {
								addUserIds = addUserIds + ','
							}
							addUserIds += object.id;
						});
		if (addUserIds != '') {
			$.ajax({
						type : 'post',
						url : 'finCenter/UserCustomerJson.addUsercusUser.json',
						data : {
							menuId : window.sys_menuId,
							param1 : userCusNowCusId,
							param2 : addUserIds
						},
						dataType : 'json',
						success : function(data) {
							if (data.success) {
								$('#usercus_modal_user_table').DataTable().ajax
										.reload();
								$('#usercus_modal_addUser').modal('hide')
								bdoSuccessBox('提示', '新增成功');
							} else {
								bdoErrorBox('错误', data.resultInfo.statusText);
							}
						}
					});
		}
	});

	var getUserFilter = function() {
		var queryFilterArr = [];
		if ($('#usercus_modal_user_userName').val() != '') {
			queryFilterArr.push({
						'field' : 'name',
						'sqlIndex' : "name",
						'type' : 'list',
						'value' : $('#usercus_modal_user_userName').val()
								.replace(/\s+/g, ","),
						'operate' : 'eq'
					});
		}
		return JSON.stringify(queryFilterArr);
	}

	var getAddUserFilter = function() {
		var queryFilterArr = [];
		if ($('#usercus_modal_addUser_userName').val() != '') {
			queryFilterArr.push({
						'field' : 'name',
						'sqlIndex' : "name",
						'type' : 'list',
						'value' : $('#usercus_modal_addUser_userName').val()
								.replace(/\s+/g, ","),
						'operate' : 'eq'
					});
		}
		if ($('#usercus_modal_addUser_depart').val() != '') {
			queryFilterArr.push({
						'field' : 'departname',
						'sqlIndex' : "departname",
						'type' : 'string',
						'value' : $('#usercus_modal_addUser_depart').val(),
						'operate' : 'eq'
					});
		}
		return JSON.stringify(queryFilterArr);
	}
});