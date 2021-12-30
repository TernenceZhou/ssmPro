pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');

///** 模态框设置 */
//$('.modal').on('show.bs.modal', function(){
//    $(this).draggable({
//		handle: '.block-header',
//		cursor: 'move'
//    });
//    $(this).css('overflow', 'hidden');
//});

// 新增单位
$('#form_departadd').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'depart_save',
			icon : 'fa-save',
			style : 'btn-success',
			text : '&nbsp;保存'
		},{
			id : 'depart_clear',
			icon : 'fa-circle',
			style : 'btn-primary',
			text : '&nbsp;重置'
		},{
			id : 'depart_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'depart_id',
			type : 'input',
			label : '部门ID',
			typeAttr:{
				type : 'hidden'
			}
		},{
			id : 'depart_departName',
			type : 'input',
			label : '部门名称',
			rowspan : 1,
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'depart_departAbr',
			type : 'input',
			label : '部门缩写',
			rowspan : 1,
			validate : {
				rules : {
					required : true
				}
			}
		}
	]
});

//新增下级部门表单
$('#form_nextdepartadd').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'nextdepart_save',
			icon : 'fa-save',
			style : 'btn-success',
			text : '&nbsp;保存'
		},{
			id : 'nextdepart_edit',
			icon : 'fa-save',
			style : 'btn-success',
			text : '&nbsp;修改'
		},{
			id : 'nextdepart_clear',
			icon : 'fa-circle',
			style : 'btn-primary',
			text : '&nbsp;重置'
		},{
			id : 'nextdepart_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'nextdepart_id',
			type : 'input',
			label : '部门ID',
			typeAttr:{
				type : 'hidden'
			}
		},{
			id : 'nextdepart_departName',
			type : 'input',
			label : '部门名称',
			rowspan : 1,
			validate : {
				rules : {
					required : true,
					maxlength : 20
				}
			}
		},{
			id : 'nextdepart_departAbr',
			type : 'input',
			label : '部门缩写',
			typeAttr : {
				normal : true
			},
			validate : {
				rules : {
					maxlength : 10
				}
			}
		},{
			id : 'nextdepart_upDepart',
			type : 'input',
			label : '上级单位|部门',
			rowspan : 1,
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'nextdepart_topDepart',
			type : 'select',
			label : '最高管理机构',
			validate : {
				rules : {
					required : true
				}
			},
			typeAttr : {
				disabled : true
			}
		},{
			id : 'nextdepart_isRH',
			type : 'select',
			label : '是否地区总部',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'nextdepart_manager',
			type : 'input',
			label : '部门负责人',
			typeAttr : {
				normal : true
			}
		}
	]
});

// 加载部门树
easyloader.load(['treegrid'],function(){
	$('#department_tree').treegrid({
		height: 550,
	    animate: true,
	    queryParams: {
	    	param1: ''
	    },
		idField: 'id',
		treeField: 'label',
		columns:[[
			{title:'处理',field:'operate',width:150,align:'center',formatter: function(value, row, index){
				var rowhtml = '';
				rowhtml += '<a onClick="nextDepart(' + row.id + ');" data-placement="top" title="新增下级部门" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-plus"></i></a>&nbsp;';
				if(row.id != BdoFaithConsts.DEPARTMENT_BDO){
					rowhtml += '<a onClick="editDepart(' + row.id + ');" data-placement="top" title="修改" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-edit"></i></a>&nbsp;&nbsp;'
				}
				rowhtml += '<a onClick="editSortnum(' + row.id + ');" data-placement="top" title="更改顺序" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-arrows-v"></i></a>&nbsp;&nbsp;';
				rowhtml += '<a onClick="deleteDepart(' + row.id + ');" data-placement="top" title="删除" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-times"></i></a>&nbsp;&nbsp;';
				rowhtml += '<a onClick="linkHrDepart(' + row.id + ');" data-placement="top" title="关联HR部门" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-link"></i></a>&nbsp;&nbsp;';
				rowhtml += '<a onClick="switchisVisable(' + row.id + ');" data-placement="top" title="切换是否业务部门" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-refresh"></i></a>';
				return rowhtml;
			}},
	        {title:'部门名称',field:'label',width:300},
	        {title:'顺序号',field:'sortNum',width:50,align:'center'},
	        {title:'部门编号',field:'id',width:100,align:'center'},
	        {title:'上级部门ID',field:'parentid',width:100,align:'center'},
	        {title:'最高级部门',field:'firstItemName',width:150},
	        {title:'最高级部门ID',field:'firstItemId',width:100,align:'center'},
	        {title:'HR部门ID',field:'hrDeptId',width:100,align:'center'},
	        {title:'HR部门编号',field:'hrDeptCode',width:100,align:'center'},
	        {title:'HR部门名称',field:'hrDeptName',width:150},
	        {title:'是否为业务部门',field:'isVisable',width:150,align:'center',formatter: function(value, row, index){return DicVal2Nm(value, 'boolean')}}
	    ]],
	    loader: function(param, success, error){
	    	$.ajax({
				url: 'admin/DepartmentManage.findDepartmentTree.json',
				type: 'post',
				data: param,
				dataType: 'json',
				success: function(data){
					if(data.success === true && data.data && data.data.length > 0) {
						success(data.data[0]);
					}else {
						success([]);
					}
				}
			});
	    },
	    onBeforeExpand: function(row){
	    	$("#department_tree").treegrid('options').queryParams = {param1: row.id};
	    },
	    onLoadSuccess: function(row, data){
	    	$("#department_tree").treegrid('options').queryParams = {param1: ''};
	    },
	    onDblClickRow: function(row){
			$('#department_tree').treegrid('toggle', row.id);
	    }
	});
});

//新增单位
$('#btn_departadd').click(function(){
	$('#modal_departadd').modal('show');
});
//保存
$('#depart_save').click(function(){
	$('#form_departadd').formview(
		'setAjaxConf',
		[
			'admin/Department.addComp.json',
			{
				menuId : window.sys_menuId,
				param6 : $('#depart_departName').val(),
				param7 : $('#depart_departAbr').val(),
				param9 : 'btnAdd'
			},
			'json',true,
			function(data) {
				if(data.success === true){
					$('#modal_departadd').modal('hide');
					$('#btn_refresh').click();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#form_departadd').submit();
});
//重置
$('#depart_clear').click(function(){
	$('#modal_departadd input').val('');
});
//关闭
$('#depart_close').click(function(){
	$('#modal_departadd').modal('hide');
});
$('#modal_departadd').on('hidden.bs.modal', function() {
	$('#modal_departadd input').val('');
	$('#modal_departadd').find('form td').removeClass('has-error');
  	$('#modal_departadd').find('form .help-block').remove();
});

// 刷新
$('#btn_refresh').click(function(){
	$("#department_tree").treegrid('options').queryParams = {param1: ''};
	$("#department_tree").treegrid('reload');
});

// 部门负责人一览
$('#btn_managerview').click(function(){
	$('#modal_departmanager').modal('show');
});
$('#modal_departmanager').on('show.bs.modal', function(){
	BdoDataTables('departmanager', managerParam);
});
function managerFilter() {
	var queryFilterArr = [];
	if ($('#manager_name').val() != '') {
		queryFilterArr.push({
			'field' : 'deptmanagername',
			'sqlIndex' : 'deptmanagername',
			'type' : 'string',
			'value' : $('#manager_name').val(),
			'operate' : 'eq'
		});
	}
	if ($('#manager_deptname').val() != '') {
		queryFilterArr.push({
			'field' : 'deptname',
			'sqlIndex' : 'deptname',
			'type' : 'string',
			'value' : $('#manager_deptname').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}
var managerParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [3, 'desc'],
	sourceData : {},
	sourceUrl : 'base/General.query.json',
	filterParam : {
		menuId : window.sys_menuId,
		sqlId : 'sys.S100121',
		filter : managerFilter()
	},
	tableColumns : [
		{
			targets : 1,
			className : 'text-center',
			title : '员工编号',
			name : 'deptmanager',
			data : 'deptmanager',
			width : '150px'
		}, {
			targets : 2,
			className : 'text-center',
			title : '部门负责人',
			name : 'deptmanagername',
			data : 'deptmanagername',
			width : '150px'
		}, {
			targets : 3,
			className : 'text-left',
			title : '部门名<br><small><font color="red">红色字体为业务部门</font>&nbsp;<font color="blue">蓝色字体为非业务部门</font></small>',
			name : 'deptname',
			data : 'deptname',
			width : '300px',
			render : function(data, type, row, meta){
				return data;
			}
		}]
};
//检索
$('#manager_search').click(function() {
	managerParam.filterParam.filter = managerFilter();
	$('#departmanager').DataTable().ajax.reload();
});
//重置
$('#manager_clear').click(function() {
	$('#manager_name').val('');
	$('#manager_deptname').val('');
	managerParam.filterParam.filter = managerFilter();
	$('#departmanager').DataTable().ajax.reload();
});

////同步
//$('#btn_departsynchro').click(function(){
//	bdoAjaxBox('同步', '是否进行部门同步', function () {
//      $.post('admin/DepartmentManage.departmentSynchro.json')
//        .done(function (data) {
//        	console.log(data)
//			if(data.success === true){
//				$('#btn_refresh').click();
//				bdoSuccessBox('成功', data.resultInfo.statusText);
//			}else {
//				bdoErrorBox('失败', data.resultInfo.statusText);
//			}
//        })
//    });
//});

// 上级单位|部门
$('#nextdepart_upDepart').treecombo({
	url : 'base/TreeCommon.findDepartTree.json',
	params : {},
	view : {
		leafIcon: 'fa fa-building text-flat',    
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: true,
		multiSelect: false
	}
});
// 部门负责人
$('#nextdepart_manager').treecombo({
	url : 'base/TreeCommon.findUserTree.json',
	params : {},
	view : {
		leafIcon: 'fa fa-building text-flat',    
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: false,
		multiSelect: false
	}
});
// 最高管理机构
$('#nextdepart_topDepart').html(ComboDBOption('./base/GeneralCombo.findDepartTopManageByCompany.json', true));
// 是否地区总部
$('#nextdepart_isRH').html(ComboDicOption(true, 'boolean'));
// 新增下级部门
function nextDepart(deptId){
	$('#department_tree').treegrid('select', deptId);
	var obj = $('#department_tree').treegrid('getSelected');
	$('#nextdepart_topDepart').val(obj.firstItemId);
	$('#nextdepart_isRH').val('0');
	$('#nextdepart_upDepart').treecombo('setTreeComboValue',[obj.id, obj.label]);
	$('#nextdepart_edit').hide();
	$('#modal_nextdepartadd').modal('show');
}
//修改
function editDepart(deptId){
	$('#department_tree').treegrid('select', deptId);
	var obj = $('#department_tree').treegrid('getSelected');
	$('#nextdepart_id').val(obj.id);
	$('#nextdepart_departName').val(obj.departname);
	$('#nextdepart_departAbr').val(obj.enname);
	if(obj.parentid == BdoFaithConsts.DEPARTMENT_BDO){
		$('#nextdepart_upDepart').treecombo('setTreeComboValue',[obj.parentid, '立信集团']);
	} else{
		$('#nextdepart_upDepart').treecombo('setTreeComboValue',[obj.parentid, obj.__dparentidName]);
	}
	$('#nextdepart_topDepart').val(obj.topManageDepId);
	$('#nextdepart_isRH').val((obj.isRH ? obj.isRH : '0'));
	$('#nextdepart_manager').treecombo('setTreeComboValue',[obj.deptManager, obj.__udeptManagerName]);
	$('#nextdepart_save,#nextdepart_clear').hide();
	$('#modal_nextdepartadd').modal('show');
}

$('#nextdepart_save').click(function(){
	var param = {
		menuId : window.sys_menuId,
		param1 : $('#nextdepart_upDepart').attr('data-result'),
		param2 : $('#nextdepart_manager').attr('data-result'),
		param4 : $('#nextdepart_topDepart').val(),
		param5 : $('#nextdepart_isRH').val(),
		param6 : $('#nextdepart_departName').val(),
		param7 : $('#nextdepart_departAbr').val(),
		param9 : 'btnAddDept'
	};
	nextdeptsubmit(param);
});
$('#nextdepart_edit').click(function(){
	var param = {
		menuId : window.sys_menuId,
		param1 : $('#nextdepart_upDepart').attr('data-result'),
		param2 : $('#nextdepart_manager').attr('data-result'),
		param4 : $('#nextdepart_topDepart').val(),
		param5 : $('#nextdepart_isRH').val(),
		param6 : $('#nextdepart_departName').val(),
		param7 : $('#nextdepart_departAbr').val(),
		param8 : $('#nextdepart_id').val(),
		param9 : 'btnRecordEdit'
	};
	nextdeptsubmit(param);
});
$('#nextdepart_clear').click(function(){
	$('#modal_nextdepartadd input').val('');
	$('#modal_nextdepartadd input').attr('data-result', '');
	$('#modal_nextdepartadd input').attr('data-content', '');
});
$('#nextdepart_close').click(function(){
	$('#modal_nextdepartadd').modal('hide');
});
$('#modal_nextdepartadd').on('hidden.bs.modal', function() {
	$('#modal_nextdepartadd button').show();
	$('#modal_nextdepartadd input, select').val('');
	$('#modal_nextdepartadd').find('form td').removeClass('has-error');
  	$('#modal_nextdepartadd').find('form .help-block').remove();
});
function nextdeptsubmit(param){
	$('#form_nextdepartadd').formview(
		'setAjaxConf',
		[
			'admin/Department.addDept.json',
			param,
			'json',true,
			function(data) {
				if(data.success === true){
					$('#modal_nextdepartadd').modal('hide');
					$('#btn_refresh').click();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#form_nextdepartadd').submit();
}

// 更改顺序
function editSortnum(deptId){
	$('#department_tree').treegrid('select', deptId);
	var obj = $('#department_tree').treegrid('getSelected');
	swal({
	  title : '更改顺序',
	  text : '输入需要调整的顺序号。（数字1~999）',
	  type: 'warning',
	  input : 'number',
	  inputValue : obj.sortNum ? obj.sortNum :'',
	  showCancelButton: true,
	  cancelButtonText : '取消',
	  confirmButtonText : '确定',
	  allowEscapeKey: false,
	  allowOutsideClick: false,
	  preConfirm : function(value) {
		return new Promise(function(resolve, reject) {
			var regexp = /^[1-9][0-9]{0,2}?$/;
			if(regexp.test(value)){
				resolve()
			} else{
				reject('请将输入1-999的整数')
			}
		})
	  }
	}).then(function(value) {
		var type;
		if (!obj.firstItemId) {
			type = 'btnRecordChangeOrder1';
		} else {
			type = 'btnRecordChangeOrder2';
		}
		$.ajax({
			url: 'admin/Department.changeSortNum.json',
			type: 'post',
			data: {
				menuId : window.sys_menuId,
				param1 : deptId,
				param2 : value,
				param3 : type
			},
			dataType: 'json',
			success : function(data) {
				if(data.success === true){
					$('#btn_refresh').click();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}, function(dismiss) {
	});
}

// 删除
function deleteDepart(deptId){
	bdoConfirmBox('确认', '是否删除部门', function(){
		$('#department_tree').treegrid('select', deptId);
		var obj = $('#department_tree').treegrid('getSelected');
		var type;
		if (!obj.firstItemId) {
			type = 'btnRecordDelete1';
		} else {
			type = 'btnRecordDelete2';
		}
		$.ajax({
			url: 'admin/Department.del.json',
			type: 'post',
			data: {
				menuId : window.sys_menuId,
				param1 : deptId,
				param9 : type
			},
			dataType: 'json',
			success : function(data) {
				if(data.success === true){
					$('#btn_refresh').click();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
}

$('#linkHr_hrDepart').treecombo({
	url : 'base/TreeCommon.findDepartTree.json',
	params : {},
	view : {
		leafIcon: 'fa fa-building text-flat',    
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: true,
		multiSelect: false
	}
});
//关联HR部门
function linkHrDepart(deptId){
	$('#linkHr_departId').val(deptId);
	$('#modal_linkHrDepart').modal('show');
}
$('#btn_linkHrDepart').click(function(){
	$.ajax({
		url: 'cpBase/Department.changeHrDepartname.json',
		type: 'post',
		data: {
			menuId : window.sys_menuId,
			param1 : $('#linkHr_hrDepart').attr('data-result'),
			param2 : $('#linkHr_departId').val()
		},
		dataType: 'json',
		success : function(data) {
			if(data.success === true){
				$('#btn_refresh').click();
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
});

// 切换是否业务部门
$('#switch_isVisable').html(ComboDicOption(false, 'boolean'));
function switchisVisable(deptId){
	$('#department_tree').treegrid('select', deptId);
	var obj = $('#department_tree').treegrid('getSelected');
	$('#switch_departId').val(deptId);
	$('#switch_isVisable').val(obj.isVisable);
	$('#modal_switchisVisable').modal('show');
}
$('#btn_switch').click(function(){
	$.ajax({
		url: 'cpBase/Department.changeIsvisable.json',
		type: 'post',
		data: {
			menuId : window.sys_menuId,
			param1 : $('#switch_departId').val(),
			param2 : $('#switch_isVisable').val()
		},
		dataType: 'json',
		success : function(data) {
			if(data.success === true){
				$('#modal_switchisVisable').modal('hide');
				$('#btn_refresh').click();
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
});