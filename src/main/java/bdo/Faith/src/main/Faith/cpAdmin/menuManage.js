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
				if(row.active_flag != '0'){
					rowhtml += '<a onClick="editMenu(' + row.id + ');" data-placement="top" title="修改" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-edit"></i></a>&nbsp;&nbsp;';
					rowhtml += '<a onClick="editSortnum(' + row.id + ');" data-placement="top" title="更改顺序" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-arrows-v"></i></a>&nbsp;&nbsp;';
					rowhtml += '<a onClick="deleteMenu(' + row.id + ');" data-placement="top" title="删除" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-times"></i></a>&nbsp;&nbsp;';
					rowhtml += '<a onClick="switchisVisable(' + row.id + ');" data-placement="top" title="更改菜单编号" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-eraser"></i></a>'
				} else {
					rowhtml += '<a onClick="reductionMenu(' + row.id + ');" data-placement="top" title="取消删除" data-toggle="tooltip" style="cursor: pointer"><i class="fa fa-check"></i></a>&nbsp;&nbsp;'
				}
				return rowhtml;
			}},
	        {title:'菜单名称',field:'label',width:250},
	        {title:'菜单编号',field:'id',width:100},
	        {title:'顺序号',field:'sortNum',width:100},
	        {title:'类型',field:'ctype',width:100},
	        {title:'执行地址',field:'act',width:100},
	        {title:'是否有效',field:'active_flag',width:150,formatter: function(value, row, index){return DicVal2Nm(value, 'boolean')}},
	        {title:'菜单权限类型',field:'menuAuthType',width:100},
	        {title:'是否界面显示',field:'isDisplay',width:150,formatter: function(value, row, index){return DicVal2Nm(value, 'boolean')}},
	        {title:'是否内网保护',field:'isProtected',width:150,formatter: function(value, row, index){return DicVal2Nm(value, 'boolean')}},
	        {title:'父菜单编号',field:'parentIdView',width:100},
	        {title:'委托授权菜单编号',field:'authMenuId',width:150},
	        {title:'帮助地址',field:'helpact',width:100},
	        {title:'是否审计',field:'isAudit',width:50},
	        {title:'是否税务',field:'isTax',width:50}
	    ]],
	    loader: function(param, success, error){
	    	$.ajax({
	    		url: './admin/MenuManage.findMenuTree.json',
				type: 'post',
				data: param,
				dataType: 'json',
				success: function(data){
					if(data.success === true && data.data && data.data.length > 0) {
						if(data.data[0].total != '0'){
							if(data.data[0].rows[0]._parentId == '0'){
								delete data.data[0].rows[0]._parentId;
							}
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

///** 模态框设置 */
//$('.modal').on('show.bs.modal', function(){
//    $(this).draggable({
//		handle: '.block-header',
//		cursor: 'move'
//    });
//    $(this).css('overflow', 'hidden');
//});

/** 重置模态框表单 */
$('.modal').on('hidden.bs.modal', function() {
	$(this).find('input, select, textarea').removeAttr('disabled');
	$(this).find('input, textarea').val(null);
	$(this).find(':input[isTree]').treecombo('setTreeComboValue',[null, null]);
	$(this).find('[id^="treecombocon"]').remove();
	$(this).find('form td').removeClass('has-error');
	$(this).find('form .help-block').remove();
});

/** 新增 */
$('#btn_menuAdd').click(function(){
	$('#menutName').html('新增');
	$('#modal_menu').modal('show');
	$('menu_reset').show();
	$('#n_sortNum').val('1');
	$('#n_ctype').val('01');
	$('#n_lowerState').val('0');
	$('#n_canAgent').val('0');
	$('#n_agentAuditFlag').val('0');
	$('#n_isProtected').val('0');
	$('#n_menuAuthType').val('1');
	$('#n_menuAddress').val('general.do');
});

/** 刷新 */
$('#btn_refresh').click(function(){
	$("#menu_tree").treegrid('options').queryParams = {param1: '0'};
	$("#menu_tree").treegrid('reload');
});

/** 模态框 新增/修改 */
$('#sub_menu').formview({
	display : 'tableform-one',
		column : 12,
		buttons : [
			{
				id : 'menu_save',
				icon : 'fa-floppy-o',
				style : 'btn-primary',
				text : '保存'
			},
			{
				id : 'menu_reset',
				icon : 'fa-refresh',
				style : 'btn-success',
				text : '重置'
			},
			{
				id :  'menu_close',
				icon : 'fa-sign-out',
				style : 'btn-css1 btn-warning',
				text : '关闭'
			}
		],
		items : [
		{
			id : 'n_menuId',
			type : 'input',
			label : '菜单编号',
			rowspan : 1,
			colspan : 3,
			typeAttr : {
				normal : true,
				placeholder: '自动生成',
				readonly : true
			}
		},{
			id : 'n_menuName',
			type : 'input',
			label : '菜单名',
			colspan : 3,
			validate : {
				rules : {
					required : true,
					maxlength : 100
				}
			}
		},{
			id :  'n_superiorMenu',
			label : '上级目录',
			type : 'input',
			colspan : 3,
			validate : {
				rules : {
					required : true
				}
			},
			plugin : {
				name : 'treecombo',
				options :{
					url : './admin/MenuTree.findMenuTree.json',
					params : {
						param2 : '0',
						param11 : '1'
					},
					view : {
						leafIcon: 'fa fa-building text-flat',    
						nodeIcon: 'fa fa-bank text-primary-light',
						folderSelectable: true,
						onNodeSelected:　function(event , node){
							fullPath(node.id);
						}
					}
				}
			}
		},{
			id : 'n_menuRoute',
			type : 'input',
			label : '上级目录全路径',
			colspan : 3,
			typeAttr : {
				readonly : true
			}
		},{
			id : 'n_menuAddress',
			type : 'input',
			label : '执行地址',
			rowspan : 1,
			colspan : 6,
			typeAttr : {
				normal : true
			},			
			validate : {
				rules : {
					maxlength : 100
				}
			}
		},{
			html : '<a class="btn btn-primary" id="menuAddition"><i class="fa fa-plus-square">&nbsp;附加配置</i></a>',
			colspan : 6
		},{
			id : 'n_menuHelp',
			type : 'input',
			rowspan : 1,
			colspan : 12,
			label : '帮助地址',
			typeAttr : {
				normal : true
			}
		},{
			id : 'n_ctype',
			type : 'select',
			html : ComboDicOption(false, '菜单类型'),
			rowspan : 1,
			colspan : 3,
			label : '类别',
			typeAttr : {
				normal : true
			}
		},{
			id : 'n_lowerState',
			type : 'select',
			html : ComboDicOption(false, '菜单下级情况'),
			colspan : 3,
			label : '下级情况',
			typeAttr : {
				normal : true
			}
		},{
			html : '<a class="btn btn-primary" id="changePic"><i class="fa fa-plus-square">&nbsp;换图</i></a>',
			colspan : 3
		},{
			id : 'n_pic',
			type : 'div',
			colspan : 3,
			label : '图标',
			typeAttr : {
				disabled : true
			}
		},{
			id : 'n_authMenuId',
			type : 'input',
			label : '委托授权菜单',
			rowspan : 1,
			colspan : 3,
			typeAttr : {
				normal : true
			},
			plugin : {
				name : 'treecombo',
				options :{
					url : './admin/MenuTree.findMenuTree.json',
					params : {
						param2 : '0'
					},
					view : {
						folderSelectable : false,
						multiSelect : false
					}
				}
			}
		},{
			id : 'n_sortNum',
			type : 'input',
			colspan : 3,
			label : '顺序号',
			typeAttr : {
				type : 'number'
			},
			validate : {
				rules : {
					digits : true,
					required : true
				},
				messages : {
					digits : '只能输入正整数'
				}
			}
		},{
			id : 'n_canAgent',
			type : 'select',
			html : ComboDicOption(false, 'boolean'),
			colspan : 3,
			label : '是否可代理',
			typeAttr : {
				normal : true
			}
		},{
			id : 'n_agentAuditFlag',
			type : 'select',
			html : ComboDicOption(false, 'boolean'),
			colspan : 3,
			label : '代理是否审核',
			typeAttr : {
				normal : true
			}
		},{
			id : 'n_isDisplay',
			type : 'select',
			html : ComboDicOption(false, 'boolean'),
			rowspan : 1,
			colspan : 3,
			label : '用户菜单显示',
			typeAttr : {
				normal : true
			}
		},{
			id : 'n_isProtected',
			type : 'select',
			html : ComboDicOption(false, 'boolean'),
			colspan : 3,
			label : '只在内网使用',
			typeAttr : {
				normal : true
			}
		},{
			id : 'n_isCanDep',
			type : 'select',
			html : ComboDicOption(false, 'boolean'),
			colspan : 3,
			label : '判断部门权限',
			typeAttr : {
				normal : true
			}
		},{
			id : 'n_menuAuthType',
			type : 'select',
			html : ComboDicOptionF(false, 'menuAuthType', '', userLevel),
			colspan : 3,
			label : '菜单权限类别',
			typeAttr : {
				normal : true
			}
		},{
			id : 'n_isAudit',
			type : 'select',
			html : ComboDicOption(false, 'boolean'),
			rowspan : 1,
			colspan : 3,
			label : '是否审计',
			typeAttr : {
				normal : true
			}
		},{
			id : 'n_isTax',
			type : 'select',
			html : ComboDicOption(false, 'boolean'),
			colspan : 3,
			label : '是否税务',
			typeAttr : {
				normal : true
			}
		},{
			colspan : 9
		},{
			id : 'n_depth',
			type : 'input',
			rowspan : 1,
			colspan : 12,
			typeAttr : {
				type : 'hidden'
			}
		}
	]
});

$('#menu_save').click(function(){
	var lowerState = $('#n_lowerState').val();
	var ctype = $('#n_ctype').val();
	var act = $('#n_menuAddress').val();
	if (ctype == '00' && lowerState != '1') {
		bdoErrorBox('失败', '【类别】是目录的情况下，【下级情况】必须为有子菜单。');
		return;
	}
	if (ctype == '02' && lowerState != '0') {
		bdoErrorBox('失败', '【类别】是按钮的情况下，【下级情况】必须为无。');
		return;
	}
	if (ctype != '01' && act != '') {
		bdoErrorBox('失败', '【类别】不是菜单的情况下，【执行地址】不能填。');
		return;
	}
	if (ctype == '01' && jQuery.isEmptyObject(act)) {
		bdoErrorBox('失败', '【类别】是菜单的情况下，【执行地址】必须要设定。');
		return;
	}
	var param17 = '';
	var submitUrl = null;
	var menuId = $('#n_menuId').val();
	if(menuId){
		submitUrl='./admin/Menu.updateMenu.json';
	}else{
		submitUrl='./admin/Menu.createMenu.json';
		param17 = $('#n_menuId').val();
	}
	var param18 = $('#n_authMenuId').val();
	if(param18 != ''){
		param18 = $('#n_authMenuId').treecombo('getTreeComboValue');
	}
	var data = {
		menuId : window.sys_menuId,
		param1 : $('#n_menuId').val(),
		param2 : $('#n_menuName').val(),
		param3 : $('#n_superiorMenu').treecombo('getTreeComboValue'),
		param4 : $('#n_lowerState').val(),
		param5 : $('#n_depth').val(),
		param6 : $('#n_ctype').val(),
		param7 : $('#n_menuAddress').val(),
		param8 : $('#n_menuHelp').val(),
		param9 : $('#n_pic').find('input').val(),
		param10 : $('#n_sortNum').val(),
		param11 : $('#n_canAgent').val(),
		param12 : $('#n_agentAuditFlag').val(),
		param13 : $('#n_isDisplay').val(),
		param14 : $('#n_isProtected').val(),
		param15 : $('#n_isCanDep').val(),
		param16 : $('#n_menuAuthType').val(),
		param17 : param17,
		param18 : param18,
		param19 : $('#n_isAudit').val(),
		param20 : $('#n_isTax').val()
	};
	$('#sub_menu').formview(
		'setAjaxConf',
		[
			submitUrl,
			data,
			'json',true,
			function(data) {
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#btn_refresh').click();
					$('#modal_menu').modal('hide');
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#sub_menu').submit();
});

$('#menu_reset').click(function(){
	$('#modal_menu').find('input, textarea').val(null);
	$('#n_sortNum').val('1');
	$('#n_ctype').val('01');
	$('#n_lowerState').val('0');
	$('#n_canAgent').val('0');
	$('#n_agentAuditFlag').val('0');
	$('#n_isProtected').val('0');
	$('#n_menuAuthType').val('1');
	$('#n_menuAddress').val('general.do');
});

$('#menu_close').click(function(){
	$('#modal_menu').modal('hide');
	$('#n_pic').empty();
});

/** 行按钮 修改 */
function editMenu(menuId){
	$('#menu_tree').treegrid('select', menuId);
	var obj = $('#menu_tree').treegrid('getSelected');
	if(obj.id == '1'){
		bdoErrorBox('失败', '菜单根目录不能调整。');
		return;
	}
	if(obj._parentId != ''){
		fullPath(obj._parentId);
	}
	formdataSet(obj);
	$('#menutName').html('修改');
	$('#menu_reset').hide();
	$('#modal_menu').modal('show');
}

$('#modal_menu').on('shown.bs.modal', function(){
	
	$('#menuAddition').off('click');
	$('#menuAddition').click(function(){
		
		var menuAddress = $('#n_menuAddress').val();
		var menuId = $('#n_menuId').val();
		var menuName = $('#n_menuName').val();
		
		if($('#n_menuId').val() == ''){
			bdoErrorBox('失败', '由于菜单ID未确定，请保存菜单设置后再进行此项操作。');
			return;
		}
		
		if (menuAddress == '' || menuAddress.indexOf('general.do') < 0) {
			bdoErrorBox('失败', '此执行地址不是通用地址，不需要进行附加配置操作，（通用地址必须包含general.do）。');
			return;
		}

		menuAdditions(menuId,menuName);
		
		$('#modal_action').modal('show');
	});
	
	$('#changePic').off('click');
	
	$('#changePic').click(function(){
		$.ajax({
			url: 'base/General.query.json',
			type : 'post',
			data : {
				menuId : window.sys_menuId,
				sqlId : 'sys.S100138',
				limit : 1000
			},
			dataType: 'json',
			async : false,
			success : function(data){
				var dataNum = data.data.length;
				var iconsData='';
				$("#add_icons").empty();
				for(var i = 0; i < dataNum; i++){
					iconsData = '<div class="col-sm-6 col-lg-3" align="center"><p><i class="si '+ data.data[i].iconFile +' fa-2x" style="cursor: pointer;">' +
							'</i></p><span>'+ data.data[i].iconFile +'</span><input type = "text" value = "'+ data.data[i].id +'" style="display:none"/></div>';
					$('#add_icons').append(iconsData);
				}
			}
		});
		$('#modal_icons').modal('show');
	});
	
	$('#modal_icons').on('shown.bs.modal', function(){
		$('#add_icons').find('div').on('click',function(){
			var pic = $(this).find('span').html();
			var id = $(this).find('input').val();
			var showPic='';
			showPic = '<p align="center"><i class ="si '+ pic +' fa-3x">' +
					'<input type = "text" value = "'+ id +'" style="display:none"/></p>';
			$('#n_pic').html(showPic);
			$('#modal_icons').modal('hide');
		});
	
		$('#iconsClose').click(function(){
			$('#modal_icons').modal('hide');
		});	
	});

	$('#action_save').click(function(){
		var submitUrl = 'admin/Menu.changeAction.json';
		var param6 = $('#e_describe').val();
		if (param6 == '') {
			param6 = $('#e_menuName').val();
		}
		var data = {
			param1 : $('#e_menuId').val(),
			param2 : $('#e_address').val(),
			param3 : $('#e_fileAddress').val(),
			param5 : $('#e_edition').val(),
			param6 : param6
		};
		$('#sub_action').formview(
			'setAjaxConf',
			[
				submitUrl,
				data,
				'json',true,
				function(data) {
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#modal_action').modal('hide');
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			]
		);
		$('#sub_action').submit();
	});
	
	$('#action_close').click(function(){
		$('#modal_action').modal('hide');
	});
});

/** 模态框 执行action新增/修改 */
$('#sub_action').formview({
	display : 'tableform-one',
		column : 4,
		buttons : [
			{
				id : 'action_save',
				icon : 'fa-floppy-o',
				style : 'btn-primary',
				text : '保存'
			},
			{
				id :  'action_close',
				icon : 'fa-sign-out',
				style : 'btn-css1 btn-warning',
				text : '关闭'
			}
		],
		items : [
		{
			id : 'e_menuId',
			type : 'input',
			label : '菜单编号',
			rowspan : 1,
			colspan : 2,
			typeAttr : {
				readonly : true
			}
		},{
			id : 'e_menuName',
			type : 'input',
			label : '菜单名',
			colspan : 2,
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_address',
			label : '执行地址',
			type : 'input',
			rowspan : 1,
			colspan : 4,
			validate : {
				rules : {
					required : true,
					maxlength : 100
				}
			}
		},{
			id : 'e_fileAddress',
			type : 'input',
			label : '文件地址',
			rowspan : 1,
			colspan : 4,
			typeAttr : {
				normal : true
			},
			validate : {
				rules : {
					maxlength : 100
				}
			}
		},{
			id : 'e_edition',
			type : 'input',
			label : '版本号',
			rowspan : 1,
			colspan : 2,
			typeAttr : {
				normal : true
			},
			validate : {
				rules : {
					maxlength : 100
				}
			}
		},{
			id : 'e_describe',
			type : 'input',
			colspan : 2,
			label : '描述',
			typeAttr : {
				normal : true
			},
			validate : {
				rules : {
					maxlength : 100
				}
			}
		}
	]
});

/** 行按钮 更改菜单顺序 */
function editSortnum(menuId){
	$('#menu_tree').treegrid('select', menuId);
	var obj = $('#menu_tree').treegrid('getSelected');
	if(obj.id == '1'){
		bdoErrorBox('失败', '菜单根目录不能调整。');
		return;
	}
	swal({
	  title : '更改顺序',
	  text : '输入需要调整的顺序号。（数字1~999）',
      type: 'warning',
	  input : 'number',
	  inputValue : obj.sortNum,
	  showCancelButton: true,
	  cancelButtonText : '取消',
	  confirmButtonText : '确定',
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
		$.ajax({
			url : 'admin/Menu.changeSortNum.json',
			data : {
				param1 : obj.id,
				param2 : value
			},
			dataType : 'json',
			success : function(data) {
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#btn_refresh').click();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}).catch(swal.noop);
}

/** 行按钮 删除 */
function deleteMenu(menuId){
	$('#menu_tree').treegrid('select', menuId);
	var obj = $('#menu_tree').treegrid('getSelected');
	if(obj.id == '1'){
		bdoErrorBox('失败', '菜单根目录不能调整。');
		return;
	}
	if(obj.active_flag == '0'){
		bdoErrorBox('失败', '此菜单已经被成功删除了。');
		return;
	}	
	$.ajax({
		url : 'admin/Menu.convertActive.json',
		data : {
			param1 : obj.id,
			param2 : '0'
		},
		dataType : 'json',
		success : function(data) {
			if(data.success === true){
				bdoSuccessBox('成功', data.resultInfo.statusText);
				$('#btn_refresh').click();
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
}

/** 行按钮 取消删除 */
function reductionMenu(menuId){
	$('#menu_tree').treegrid('select', menuId);
	var obj = $('#menu_tree').treegrid('getSelected');
	if(obj.id == '1'){
		bdoErrorBox('失败', '菜单根目录不能调整。');
		return;
	}
	if(obj.active_flag == '1'){
		bdoErrorBox('失败', '此菜单已经被成功恢复了。');
		return;
	}	
	$.ajax({
		url : 'admin/Menu.convertActive.json',
		data : {
			param1 : obj.id,
			param2 : '1'
		},
		dataType : 'json',
		success : function(data) {
			if(data.success === true){
				bdoSuccessBox('成功', data.resultInfo.statusText);
				$('#btn_refresh').click();
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
}

/** 行按钮 更改菜单编号 */
function switchisVisable(menuId){
	$('#menu_tree').treegrid('select', menuId);
	var obj = $('#menu_tree').treegrid('getSelected');
	if(obj.id == '1'){
		bdoErrorBox('失败', '菜单根目录不能调整。');
		return;
	}
	swal({
	  title : '请输入数字',
	  text : '请输入新的编号,菜单编号更改后对系统权限有直接影响！',
	  type: 'warning',
	  input : 'number',
	  showCancelButton: true,
	  cancelButtonText : '取消',
	  confirmButtonText : '确定',
	  allowOutsideClick: false,
	  preConfirm : function(text) {
		return new Promise(function(resolve, reject) {
			if (text < 1) {
				reject('请输入大于1的数')
			} else {
				resolve()
			}
		})
	  }
	}).then(function(value) {
		$.ajax({
			url : 'admin/Menu.changeMenuId.json',
			data : {
				param1 : obj.id,
				param2 : value
			},
			dataType : 'json',
			success : function(data) {
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#btn_refresh').click();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}).catch(swal.noop);
}

/** 动作设置 */
function menuAdditions(menuId,menuName){
	$.ajax({
		url : 'admin/Menu.queryAction.json',
		type : 'post',
		data : {
			param1 : menuId
		},
		dataType: 'json',
		async : false,
		success : function(data){
			var isSetted = false;
			if (data.data.length > 0) {
				var actionSet = data.data[0].action;
				if (actionSet != null) {
					isSetted = true;
					$('#e_menuId').val(menuId);
					$('#e_menuName').val(menuName);
					$('#e_address').val(actionSet.generalLocation);
					$('#e_fileAddress').val(actionSet.gdeLocation);
					$('#e_edition').val(actionSet.version);
					$('#e_describe').val(actionSet.menuComment);
				}
			}
			if (!isSetted) {
				$('#e_menuId').val(menuId);
				$('#e_menuName').val(menuName);
				$('#e_address').val('');
				$('#e_fileAddress').val('');
				$('#e_edition').val('');
				$('#e_describe').val('');
			}
		}
	});
}

/** 上级目录全路径 */
function fullPath(pathId){
	$.ajax({
		url : 'admin/Menu.queryMenuFullPath.json',
		type : 'post',
		data : {
			param1 : pathId
		},
		dataType: 'json',
		async : false,
		success : function(data){
			if(data && data.data && data.success && data.data.length > 0){
				var parentFullName = data.data[0].fullPathName;
				$('#n_menuRoute').val(parentFullName);
				$('#n_depth').val(data.data[0].depth);
			}
		}
	});
}

function formdataSet(obj){
	$('#n_menuId').val(obj.id);
	$('#n_menuName').val(obj.label);
	$('#n_superiorMenu').treecombo('setTreeComboValue',[obj._parentId,obj.parentName]);
	$('#n_menuAddress').val(obj.act);
	$('#n_menuHelp').val(obj.helpact);
	$('#n_ctype').val(obj.ctype);
	$('#n_lowerState').val(obj.lowerState);
	var pic = obj.iconFile;
	var id = obj.imageIndex;
	var showPic='';
	showPic = '<p align="center"><i class ="si '+ pic +' fa-3x">' +
			'<input type = "text" value = "'+ id +'" style="display:none"/></p>';
	$('#n_pic').html(showPic);
	$('#n_authMenuId').treecombo('setTreeComboValue', [obj.authMenuId, obj.authMenuName]);
	$('#n_sortNum').val(obj.sortNum);
	$('#n_canAgent').val(obj.canAgent);
	$('#n_agentAuditFlag').val(obj.agentAuditFlag);
	$('#n_isDisplay').val(obj.isDisplay);
	$('#n_isProtected').val(obj.isProtected);
	$('#n_isCanDep').val(obj.isCanDep);
	$('#n_menuAuthType').val(obj.menuAuthType);
	$('#n_isAudit').val(obj.isAudit);
	$('#n_isTax').val(obj.isTax);
}