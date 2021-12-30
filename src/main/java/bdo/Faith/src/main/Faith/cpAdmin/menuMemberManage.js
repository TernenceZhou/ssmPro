pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');

// 加载部门树
easyloader.load(['treegrid'],function(){
	$('#menu_tree').treegrid({
		height: 550,
	    animate: true,
	    queryParams: {
	    	param1: '0'
	    },
		idField: 'id',
		treeField: 'label',
		rowStyler: function(row){
	    	if(row.active_flag == '0'){
	    		 return 'background-color:gray';
	    	} else if (row.isDisplay == '0'){
	    		return 'background-color:#e2ffe2';
	    	} else if(!jQuery.isEmptyObject(row.authMenuId)){
	    		return 'background-color:#B9B9FF';
	    	} else if (row.menuAuthType >5){
	    		return 'background-color:#FFFF93';
	    	}
	    },
		columns:[[
			{title:'处理',field:'operate',width:150,align:'center',formatter: function(value, row, index){
				var rowhtml = '';
				rowhtml += '<a onClick="editMenu(' + row.id + ');" data-placement="top" title="菜单人员对应" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-edit"></i></a>&nbsp;&nbsp;';
				return rowhtml;
			}},
	        {title:'菜单名称',field:'label',width:250},
	        {title:'是否有效',field:'active_flag',width:150,formatter: function(value, row, index){return DicVal2Nm(value, 'boolean')}}
	    ]],
	    loader: function(param, success, error){
	    	$.ajax({
	    		url: './admin/MenuManage.findMenuTree.json',
				type: 'post',
				data: param,
				dataType: 'json',
				success: function(data){
					if(data.success === true && data.data && data.data.length > 0) {
						if(data.data[0].rows[0]._parentId == '0'){
							delete data.data[0].rows[0]._parentId;
						}
						success(data.data[0])
					}else {
						success([]);
					}
				}
			});
	    },
	    onBeforeExpand: function(row){
	    	$("#menu_tree").treegrid('options').queryParams = {param1: row.id};
	    },
	    onLoadSuccess: function(row, data){
	    	$("#menu_tree").treegrid('options').queryParams = {param1: '0'};
	    },
	    onDblClickRow: function(row){
			$('#menu_tree').treegrid('toggle', row.id);
	    }
	});
});

var menuNum;

function editMenu(menuId){
	$('#menu_tree').treegrid('select', menuId);
	var obj = $('#menu_tree').treegrid('getSelected');
	if(obj.id == '1'){
		bdoErrorBox('失败', '菜单根目录不能调整。');
		return;
	}
	menuNum = obj.id;
	$('#modal_user').modal('show');
}
$('#modal_user').on('shown.bs.modal', function(){
	$('#search_dept').treecombo({
		url : './base/TreeCommon.findDepartTree.json',
		params : {},
		view : {
			leafIcon: 'fa fa-building text-flat',    
			nodeIcon: 'fa fa-bank text-primary-light',
			folderSelectable: true,
			multiSelect: false
		}
	});
	
	/** 检索条件设置 */
	var queryFilter = function () {
		var queryFilterArr = [];
		if ($('#search_name').val() != '') {
			queryFilterArr.push({
				'field' : 'a.__uuserId',
				'sqlIndex' : 'a.__uuserId',
				'type' : 'string',
				'value' : $('#search_name').val(),
				'operate' : 'eq'
			});
		}
		if ($('#search_dept').val() != '') {
			queryFilterArr.push({
				'field' : 'a.__ddepartmentid',
				'sqlIndex' : 'a.__ddepartmentid',
				'type' : 'list',
				'value' : $('#search_dept').treecombo('getTreeComboValue'),
				'operate' : 'eq'
			});
		}
		return JSON.stringify(queryFilterArr);
	};
	
	/** 搜索按钮 */
	$('#btn_search').click(function() {
		userTableParam.filterParam.filter = queryFilter();
		$('#userTable').DataTable().ajax.reload();
	});
	
	/** 重置按钮 */
	$('#btn_clear').click(function() {
		$('#search_name').val(null);
		$('#search_dept').treecombo('setTreeComboValue',[null, null]);
		userTableParam.filterParam.filter = queryFilter();
		$('#userTable').DataTable().ajax.reload();
	});
	
	/** table 属性 */
	var userTableParam = {
		tabNum : true,
		scrollX : true,
		lengthChange : true,
	//	dom : '<"row"<"col-sm-12"tr>>',
	//	order : [2, 'asc'],
		//必需
		sourceData : {},
		sourceUrl : 'base/General.query.json',
		filterParam : {
			menuId : window.sys_menuId,
			sqlId : 'sys.S200160',
			param1 : menuNum,
			filter : queryFilter()
		},
		tableColumns :[
			{
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '处理',
				data : null,
				width : '70px',
				render : function(data, type, row, meta) {
					var renderStr = '';
					renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowShow" data-placement="top" title="查看授权部门" data-toggle="tooltip">'
							+ '<i class="fa fa-search"></i></button>';
					return renderStr;
				}
			}, {
				targets : 2,
				orderable : true,
				title : '菜单',
				name : 'menuName',
				data : 'menuName',
				width : '110px'
			}, {
				targets : 3,
				orderable : true,
				title : '员工账号',
				name : 'hrloginId',
				data : 'hrloginId',
				width : '150px'
			}, {
				targets : 4,
				orderable : true,
				title : '登录名',
				name : '__uuserId',
				data : '__uuserId',
				width : '150px',
				render : function(data, type, row, meta){
					return row.__uuserId.userName;
				}
			}, {
				targets : 5,
				orderable : true,
				title : '所在部门',
				name : '__ddepartmentid',
				data : '__ddepartmentid',
				width : '200px',
				render : function(data, type, row, meta){
					return row.__ddepartmentid.departName;
				}
			}, {
				targets : 6,
				orderable : true,
				title : '授权及角色',
				name : 'roleType',
				data : 'roleType',
				width : '150px'
			}]
	};
	
	/** table */
	BdoDataTables('userTable', userTableParam);
	
	/** 导出 */
	$('#btn_export').click(function() {
		exportExcel(this, '菜单人员对应', userTableParam, 'userTable');
	});
	
	$('#userClose').click(function() {
		$('#modal_user').modal('hide');
	});
});

var userId;
/** 行按钮 修改  */
$('#userTable').on('click', 'button[name="rowShow"]', function() {
	var obj = $('#userTable').DataTable().data()[$(this).closest('tr').index()];
	userId = obj.__uuserId.userId;
	menuNum = obj.id;
	$('#modal_userRole').modal('show');
});

$('#modal_userRole').on('shown.bs.modal', function(){
		
	$('#search_roleDept').treecombo({
		url : './base/TreeCommon.findDepartTree.json',
		params : {},
		view : {
			leafIcon: 'fa fa-building text-flat',    
			nodeIcon: 'fa fa-bank text-primary-light',
			folderSelectable: true,
			multiSelect: false
		}
	});
	
	/** 检索条件设置 */
	var roleQueryFilter = function () {
		var queryFilterArr = [];
		if ($('#search_roleName').val() != '') {
			queryFilterArr.push({
				'field' : 'a.roleType',
				'sqlIndex' : 'a.roleType',
				'type' : 'string',
				'value' : $('#search_roleName').val(),
				'operate' : 'eq'
			});
		}
		if ($('#search_roleDept').val() != '') {
			queryFilterArr.push({
				'field' : 'a.__ddepartmentid',
				'sqlIndex' : 'a.__ddepartmentid',
				'type' : 'list',
				'value' : $('#search_roleDept').treecombo('getTreeComboValue'),
				'operate' : 'eq'
			});
		}
		return JSON.stringify(queryFilterArr);
	};
	
	/** 搜索按钮 */
	$('#btn_roleSearch').click(function() {
		roleTableParam.filterParam.filter = roleQueryFilter();
		$('#roleTable').DataTable().ajax.reload();
	});
	
	/** 重置按钮 */
	$('#btn_roleClear').click(function() {
		$('#search_roleName').val(null);
		$('#search_roleDept').treecombo('setTreeComboValue',[null, null]);
		roleTableParam.filterParam.filter = roleQueryFilter();
		$('#roleTable').DataTable().ajax.reload();
	});
	
	/** table 属性 */
	var roleTableParam = {
		tabNum : true,
		scrollX : true,
		lengthChange : true,
		//必需
		sourceData : {},
		sourceUrl : 'base/General.query.json',
		filterParam : {
			menuId : window.sys_menuId,
			sqlId : 'sys.S200161',
			param1 : menuNum,
			param2 : userId,
			filter : roleQueryFilter()
		},
		tableColumns :[
			{
				targets : 1,
				orderable : true,
				title : '已授权部门',
				name : '__ddepartmentid',
				data : '__ddepartmentid',
				width : '200px',
				render : function(data, type, row, meta){
					return row.__ddepartmentId.departName;
				}
			}, {
				targets : 2,
				orderable : true,
				title : '授权及角色',
				name : 'roleType',
				data : 'roleType',
				width : '150px'
			}]
	};
	
	/** table */
	BdoDataTables('roleTable', roleTableParam);
	
		/** 导出 */
	$('#btn_roleExport').click(function() {
		exportExcel(this, '菜单人员对应', roleTableParam, 'roleTable');
	});
	
	$('#roleClose').click(function() {
		$('#modal_userRole').modal('hide');
	});
});