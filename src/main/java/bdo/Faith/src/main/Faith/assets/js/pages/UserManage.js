var BaseTableDatatables = function() {
	var initDataTable = function() {
		$('#example').dataTable({
			pagingType : 'full_numbers',
			pageLength : 10,
			searching : true,
			lengthChange : false,
			scrollX : true,
			serverSide : true,
			processing : true,
			columnDefs : [ {
				targets : 0,
				orderable : false,
				className : 'text-center'
			}, {
                targets: 1,
                render: function (data, type, row, meta) {
                	var renderStr = '';
                	renderStr = '<button class="btn btn-xs btn-info" type="button" name="rowEdit" data-placement="top" title="编辑" data-toggle="tooltip">'
                		+ '<i class="fa fa-edit"></i></button>';
                	if($('#search_state').val()=='0'){
                		renderStr += '<button class="btn btn-xs btn-danger" type="button" name="rowForbid" data-placement="top" title="禁用" data-toggle="tooltip">'
                    		+ '<i class="fa fa-times"></i></button>';
            		}else{
            			renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowUse" data-placement="top" title="还原" data-toggle="tooltip">'
                		+ '<i class="fa fa-check"></i></button>';
            		}
                    renderStr += '<button class="btn btn-xs btn-success" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
            		+ '<i class="fa fa-eye"></i></button>';
                    return renderStr;
                },
                orderable : false,
                className : 'text-center'
            } ],
			fnDrawCallback : function(){
			　　var api = this.api();
			　　var startIndex= api.context[0]._iDisplayStart;
			　　api.column(0).nodes().each(function(cell, i) {
			　　　　cell.innerHTML = startIndex + i + 1;
			　　}); 
			},
			order : [ [ 2, 'asc' ] ],
			ajax : function(data, callback, settings) {
				var dataSortStr = dataSort(data);
				var queryFilterStr = queryFilter();
				var param1 = '';
				var param2 = '';
				if($('#search_state').val()=='0'){
					param1 = '1';
				}else{
					param2 = '1';
				}
				$.ajax({
					type : 'post',
					url : './base/General.query.json',
					data : {
						_dc : '1498728319669',
						menuId : '121010',
						sqlId : 'sys.S200153',
						param1 : param1,
						param2 : param2,
						page : '1',
						start : data.start,
						limit : data.length,
						sort : dataSortStr,
						filter : queryFilterStr
					},
					dataType : 'json',
					success : function(data) {
						queryFilterArr=[];
			        	// 返回数据回调处理
				        var returnData = {};
				        returnData.recordsTotal = data.totalCount;
				        // 不知道什么用,去除的话表格左下显示错误
				        returnData.recordsFiltered = data.totalCount;
				        returnData.data = data.data;
				        callback(returnData);
					},
					error:function(XMLResponse){alert(XMLResponse.responseText)}
				});
	        },
	        // 表格列加载的数据源(列对应的字段名)
	        columns : [
	        	{'data' : null,  'width': '50px'},
	        	{'title': '处理', 'data' : null, 'width': '100px'},
	        	{'title': 'ID', 'name' : 'id', 'data' : 'id', 'width': '50px'},
	        	{'title': '姓名', 'name' : 'name', 'data' : 'name', 'width': '150px'},
		        {'title': '性别', 'name' : 'sex', 'data' : 'sex', 'width': '100px'},
				{'title': '登陆名', 'name' : 'hrLoginId', 'data' : 'hrLoginId', 'width': '200px'},
				{'title': '旧系统登录名', 'name' : 'loginid', 'data' : 'loginid', 'width': '200px'},
				{'title': '薪酬级别', 'name' : 'rank', 'data' : 'rank', 'width': '250px'},
				{'title': '所属部门', 'name' : '__departmentid',  'data' : '__departmentid.departName', 'width': '250px'},
				{'title': '权限', 'name' : 'roles', 'data' : 'roles', 'width': '250px'}
	        ]
		});
	};
	// DataTables Bootstrap integration
	var bsDataTables = function() {
		var $DataTable = $.fn.dataTable;
		// Set the defaults for DataTables init
		$.extend(true, $DataTable.defaults, {
			dom : "<'row'<'col-sm-6'l><'col-sm-6'f>>"
					+ "<'row'<'col-sm-12'tr>>"
					+ "<'row'<'col-sm-6'i><'col-sm-6'p>>",
			renderer : 'bootstrap',
			oLanguage : {
				sProcessing : '<i class="fa fa-4x fa-cog fa-spin text-warning"></i>',
				sLengthMenu : '_MENU_',
				sInfo : '显示 <b>_START_</b>-<b>_END_</b> 共 <b>_TOTAL_</b>',
				sInfoEmpty : '没有数据',
				sEmptyTable : '抱歉， 没有找到你想要的数据',
				oPaginate : {
					sFirst : '<i class="fa fa-angle-double-left"></i>',
					sPrevious : '<i class="fa fa-angle-left"></i>',
					sNext : '<i class="fa fa-angle-right"></i>',
					sLast : '<i class="fa fa-angle-double-right"></i>'
				}
			}
		});
		// Bootstrap paging button renderer
		$DataTable.ext.renderer.pageButton.bootstrap = function(settings, host,
				idx, buttons, page, pages) {
			var api = new $DataTable.Api(settings);
			var classes = settings.oClasses;
			var lang = settings.oLanguage.oPaginate;
			var btnDisplay, btnClass;
			var attach = function(container, buttons) {
				var i, ien, node, button;
				var clickHandler = function(e) {
					e.preventDefault();
					if (!$(e.currentTarget).hasClass('disabled')) {
						api.page(e.data.action).draw(false);
					}
				};
				for (i = 0, ien = buttons.length; i < ien; i++) {
					button = buttons[i];
					if ($.isArray(button)) {
						attach(container, button);
					} else {
						btnDisplay = '';
						btnClass = '';
						switch (button) {
						case 'ellipsis':
							btnDisplay = '&hellip;';
							btnClass = 'disabled';
							break;
						case 'first':
							btnDisplay = lang.sFirst;
							btnClass = button + (page > 0 ? '' : ' disabled');
							break;
						case 'previous':
							btnDisplay = lang.sPrevious;
							btnClass = button + (page > 0 ? '' : ' disabled');
							break;
						case 'next':
							btnDisplay = lang.sNext;
							btnClass = button
									+ (page < pages - 1 ? '' : ' disabled');
							break;
						case 'last':
							btnDisplay = lang.sLast;
							btnClass = button
									+ (page < pages - 1 ? '' : ' disabled');
							break;
						default:
							btnDisplay = button + 1;
							btnClass = page === button ? 'active' : '';
							break;
						}
						if (btnDisplay) {
							node = $('<li>', {
								'class' : classes.sPageButton + ' ' + btnClass,
								'aria-controls' : settings.sTableId,
								'tabindex' : settings.iTabIndex,
								'id' : idx === 0
										&& typeof button === 'string' ? settings.sTableId
										+ '_' + button
										: null
							}).append($('<a>', {
								'href' : '#'
							}).html(btnDisplay)).appendTo(container);
							settings.oApi._fnBindAction(node, {
								action : button
							}, clickHandler);
						}
					}
				}
			};
			attach($(host).empty().html('<ul class="pagination"/>').children(
					'ul'), buttons);
		};
	};

	return {
		init : function() {
			bsDataTables();
			initDataTable();
		}
	};
}();

function selectData(itemId, jsonId, existBlank) {
	$.ajax({
		type : 'post',
		url : jsonId,
		dataType : 'json',
		success : function(data) {
			var jsonArr='';
			if (existBlank) {
				jsonArr += '<option value=""></option>';
			}
			$.each(data.data, function(index, info) {
				jsonArr += '<option value="' + info.value + '">' + info.label
						+ '</option>';
			});
			$('#' + itemId).html(jsonArr);
		}
	});
}

function dataSort(data){
	var dataSortArr = new Array();
	dataSortArr.push({'property': data.columns[data.order[0].column].name, 'direction': data.order[0].dir});
	return JSON.stringify(dataSortArr);
}

function queryFilter(){
	var queryFilterArr = new Array();
	if($('#search_name').val()!=''){
		queryFilterArr.push({'field': 'name','sqlIndex': '','type': 'string','value': encodeURI($('#search_name').val()),'operate': ''});
	}
	if($('#search_hrLoginId').val()!=''){
		queryFilterArr.push({'field': 'hrLoginId','sqlIndex': '','type': 'string','value': $('#search_hrLoginId').val(),'operate': ''});
	}
	if($('#search_loginid').val()!=''){
		queryFilterArr.push({'field': 'loginid','sqlIndex': '','type': 'string','value': $('#search_loginid').val(),'operate': ''});
	}
	if($('#search_department').val()!=''){
		queryFilterArr.push({'field': '__departmentid','sqlIndex': '','type': 'string','value': encodeURI($('#search_department').val()),'operate': ''});
	}
	return JSON.stringify(queryFilterArr);
}

function formdata(object){
	$('#sub_name').val(object.name);
	$('#sub_loginid').val(object.loginid);
	$('#sub_hrloginid').val(object.hrLoginId);
	$('#sub_department').val(object.__departmentid.departId);
}

function formSubmit(event){
	var object = $('#example').DataTable().data()[$('#example tbody tr.selected').index()];
	if(event=='1'){
		$.ajax({
			type : 'post',
			url : './cpBase/KUser.checkLoginid.json',
			data : {
				menuId : '121010',
				param1 : $('#sub_loginid').val()
			},
			dataType : 'json',
			success : function(data) {
				if(data.data[0].success=='false'){
					sweetAlert('登录名已存在!', '请重新输入','error');
					return;
				}
				$.ajax({
					type : 'post',
					url : './cpBase/KUser.checkLoginid.json',
					data : {
						menuId : '121010',
						param1 : $('#sub_hrloginid').val()
					},
					dataType : 'json',
					success : function(data) {
						if(data.data[0].success=='false'){
							sweetAlert('HR登录名已存在!', '请重新输入','error');
							return;
						}
						$.ajax({
							type : "post",
							url : "./cpBase/KUser.add.json",
							data : {
								menuId : "121010",
								param1 : $('#sub_name').val(),
								param2 : $('#sub_loginid').val(),
								param3 : $('#sub_hrloginid').val(),
								param4 : $('#sub_department').val()
							},
							dataType : "json",
							success : function(data) {
								swal('新增成功!','','success');
								$('#modal_form').modal('hide');
								$('#example').DataTable().ajax.reload();
							}
						});	
					}
				});
			}
		});
	}else{
		$.ajax({
			type : "post",
			url :  "./cpBase/KUser.edit.json",
			data : {
				menuId : "121010",
				param1:object.id,
				param2:$('#sub_name').val(),
				param3:$('#sub_loginid').val(),
				param4:$('#sub_loginid').val(),
				param5:$('#sub_loginid').val(),
				param6:$('#sub_loginid').val(),
				param7:'',
				param8:$('#sub_department').val(),
				param9:'',
				param10:'',
				param11:'',
				param12:'',
				param13:'',
				param14:'',
				param15:'',
				param16:'',
				param17:'',
				param18:'',
				param19:'',
				param20:'',
				param21:''
			},
			dataType : "json",
			success : function(data) {
				swal('修改成功!','','success');
				$('#modal_form').modal('hide');
				$('#example').DataTable().ajax.reload();
			}
		});	
	}
}

function formValidate(event){
	$('#sub_form').validate({
        ignore: [],
        errorClass: 'help-block animated fadeInDown',
        errorElement: 'div',
        errorPlacement: function(error, e) {
            $(e).parents('.form-group > div').append(error);
        },
        highlight: function(e) {
            var elem = $(e);
            elem.closest('.form-group').removeClass('has-error').addClass('has-error');
            elem.closest('.help-block').remove();
        },
        success: function(e) {
            var elem = $(e);
            elem.closest('.form-group').removeClass('has-error');
            elem.closest('.help-block').remove();
        },
        submitHandler: function(){
        	formSubmit(event);
        },
        rules: {
            'sub_name': {
                required: true
            },
            'sub_loginid': {
                required: true
            },
            'sub_hrloginid': {
                required: true
            },
            'sub_department': {
                required: true
            }
        },
        messages: {
            'sub_name': '请输入姓名!',
            'sub_loginid': '请输入登录名!',
            'sub_hrloginid': '请输入HR登录名!',
            'sub_department': '请选择所属部门!'
        }
    });
}

// Initialize when page loads
$(function() {
	BaseTableDatatables.init();
	
	selectData('sub_department','./base/GeneralCombo.findUsableDepart.json?_dc=1499067801357&blank=false&menuId=121010&page=1&start=0&limit=1000',false);
	
	$('#example tbody').on('click', 'tr', function() {
		$('#example').DataTable().$('tr.selected').removeClass('selected');
		$(this).addClass('selected');
	});
	
	$('#example tbody').on('dblclick', 'tr', function() {
		$('form input').attr('disabled','disabled');
		$('form select').attr('disabled','disabled');
		$('#sub_alter').hide();
		$('#sub_submit').hide();
		
		formdata($('#example').DataTable().data()[$('#example tbody tr.selected').index()]);
		$('#modal_form').modal('show');
	});
	
	$('#btn_search').click(function(){
		$('#example').DataTable().ajax.reload();
	});
	
	$('#btn_clear').click(function(){
		$('#search_name').val('');
		$('#search_hrLoginId').val('');
		$('#search_loginid').val('');
		$('#search_department').val('');
		$('#example').DataTable().ajax.reload();
	});
	
	$('#btn_add').click(function(){
		$('form input').removeAttr('disabled','disabled');
		$('form select').removeAttr('disabled','disabled');
		$('#sub_alter').hide();
		$('#sub_submit').show();
		
		$('#sub_name').val('');
		$('#sub_loginid').val('');
		$('#sub_hrloginid').val('');
		$('#sub_department').val('');
		
		$('#modal_form').modal('show');
	});
	
	$('#example').on('click','button[name="rowEdit"]',function(){
		$('form input').removeAttr('disabled','disabled');
		$('form select').removeAttr('disabled','disabled');
		$('#sub_alter').show();
		$('#sub_submit').hide();
		formdata($('#example').DataTable().data()[$('#example tbody tr.selected').index()]);
		$('#modal_form').modal('show');
	});
	
	$('#example').on('click','button[name="rowForbid"]',function(){
		var object = $('#example').DataTable().data()[$('#example tbody tr.selected').index()];
		swal({ 
			  title: '确定禁用用户['+ object.loginid +']？', 
			  text: '禁用后该人员将无法登录系统，取消禁用可以在还原功能中进行,确定要禁用吗？', 
			  type: 'warning',
			  showCancelButton: true, 
			  confirmButtonColor: '#DD6B55',
			  confirmButtonText: '禁用', 
			  closeOnConfirm: false
		},
		function(){
			$.ajax({
				type : 'post',
				url : './cpBase/KUser.stopUser.json',
				data : {
					menuId : '121010',
					param1 : object.id
				},
				dataType : 'json',
				success : function(data) {
					swal('禁用成功！', '用户['+ object.loginid +']已被禁用', 'success');
					$('#example').DataTable().ajax.reload();
				}
			});
		});
	});
	
	$('#example').on('click','button[name="rowUse"]',function(){
		var object = $('#example').DataTable().data()[$('#example tbody tr.selected').index()];
		swal({ 
			  title: '确定还原用户['+ object.loginid +']？', 
			  text: '', 
			  type: 'warning',
			  showCancelButton: true, 
			  confirmButtonColor: '#DD6B55',
			  confirmButtonText: '还原', 
			  closeOnConfirm: false
		},
		function(){
			$.ajax({
				type : 'post',
				url : './cpBase/KUser.startUser.json',
				data : {
					menuId : '121010',
					param1 : object.id
				},
				dataType : 'json',
				success : function(data) {
					swal('还原成功！', '用户['+ object.loginid +']已还原', 'success');
					$('#example').DataTable().ajax.reload();
				}
			});
		});
	});
	
	$('#example').on('click','button[name="rowView"]',function(){
		$('form input').attr('disabled','disabled');
		$('form select').attr('disabled','disabled');
		$('#sub_alter').hide();
		$('#sub_submit').hide();
		
		formdata($('#example').DataTable().data()[$('#example tbody tr.selected').index()]);
		$('#modal_form').modal('show');
	});
	
	$('#sub_submit').click(function(){
		formValidate("1");
	});
	
	$('#sub_alter').click(function(){
		formValidate("2");
	});
	$('button[name="sub_close"]').click(function(){
		$('form .form-group').removeClass('has-error');
        $('form .help-block').remove();
        $('#modal_form').modal('hide');
	});
});