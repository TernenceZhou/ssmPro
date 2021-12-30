$(document).ready(function(){
	
	$('#histroyName_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [
			{
				id : 'histroyName_save',
				icon : 'fa-floppy-o',
				style : 'btn-success',
				text : '新建'
			},{
				id :  'histroyName_edit',
				icon : 'fa-pencil',
				style : 'btn-css1 btn-info',
				text : '修改'
			},{
				id :  'histroyName_close_detail',
				icon : 'fa-close',
				style : 'btn-css1 btn-danger',
				text : '关闭'
			}
		],
		items : [
			{
				id :  'histroyName_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'histroyName_customerId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			}, {
				id :  'histroyName_userbeforename',
				type : 'input',
				label : '曾用名',
				validate : {
					rules : {
						required : true
					}
				}
			}
		]
	});
	
	// 添加客户信息
	$('#histroyName_save').click(function(){
		$('#histroyName_form').submit();
		if($('#histroyName_form').valid()){
			var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				userbeforename: $('#histroyName_userbeforename').val()
			})
			
			$.ajax({
				url : 'cusBase/CusNameUsed.addNameUsed.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#historyName').DataTable().ajax.reload();
						$('#histroyName_modal').modal('hide');
						bdoSuccessBox('成功', '添加成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	// 修改客户信息
	$('#histroyName_edit').click(function(){
		$('#histroyName_form').submit();
		if($('#histroyName_form').valid()){
			var cusBasicInfo = JSON.stringify({
				nameUsedId: $('#histroyName_id').val(),
				customerId: $('#histroyName_customerId').val(),
				userbeforename: $('#histroyName_userbeforename').val()
			})
			$.ajax({
				url : 'cusBase/CusNameUsed.editNameUsed.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#histroyName_modal').modal('hide');
						$('#historyName').DataTable().ajax.reload();
						bdoSuccessBox('成功', '修改成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	
	$('#cusMember_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [
			{
				id : 'cusMember_save',
				icon : 'fa-floppy-o',
				style : 'btn-success',
				text : '新建'
			},{
				id :  'cusMember_edit',
				icon : 'fa-pencil',
				style : 'btn-css1 btn-info',
				text : '修改'
			},{
				id :  'cusMember_close_detail',
				icon : 'fa-close',
				style : 'btn-css1 btn-danger',
				text : '关闭'
			}
		],
		items : [
			{
				id :  'cusMember_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'cusMember_customerId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			}, {
				id :  'cusMember_membername',
				type : 'input',
				label : '成员姓名',
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'cusMember_zhiwu',
				type : 'input',
				label : '职务',
				validate : {
					rules : {
						required : true
					}
				}
			}
		]
	});
	
	$('#cusMember_save').click(function(){
		$('#cusMember_form').submit();
		if($('#cusMember_form').valid()){
			var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				membername: $('#cusMember_membername').val(),
				zhiwu: $('#cusMember_zhiwu').val()
			})
			
			$.ajax({
				url : 'cusBase/CusMember.addMember.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusMember').DataTable().ajax.reload();
						$('#cusMember_modal').modal('hide');
						bdoSuccessBox('成功', '添加成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusMember_edit').click(function(){
		$('#cusMember_form').submit();
		if($('#cusMember_form').valid()){
			var cusBasicInfo = JSON.stringify({
				id: $('#cusMember_id').val(),
				customerId: $('#cusMember_customerId').val(),
				membername: $('#cusMember_membername').val(),
				zhiwu: $('#cusMember_zhiwu').val()
			})
			$.ajax({
				url : 'cusBase/CusMember.editMember.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusMember_modal').modal('hide');
						$('#cusMember').DataTable().ajax.reload();
						bdoSuccessBox('成功', '修改成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#IcpInfo_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [
			{
				id : 'IcpInfo_save',
				icon : 'fa-floppy-o',
				style : 'btn-success',
				text : '新建'
			},{
				id :  'IcpInfo_edit',
				icon : 'fa-pencil',
				style : 'btn-css1 btn-info',
				text : '修改'
			},{
				id :  'IcpInfo_close_detail',
				icon : 'fa-close',
				style : 'btn-css1 btn-danger',
				text : '关闭'
			}
		],
		items : [
			{
				id :  'IcpInfo_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'IcpInfo_customerId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			}, {
				id :  'IcpInfo_web',
				type : 'input',
				label : '网站名称',
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'IcpInfo_website',
				type : 'input',
				label : '网站域名',
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'IcpInfo_no',
				type : 'input',
				label : '许可证号',
				validate : {
					rules : {
						required : true
					}
				}
			}
		]
	});
	
	$('#IcpInfo_save').click(function(){
		$('#IcpInfo_form').submit();
		if($('#IcpInfo_form').valid()){
			var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				web: $('#IcpInfo_web').val(),
				website: $('#IcpInfo_website').val(),
				no: $('#IcpInfo_no').val()
			})
			
			$.ajax({
				url : 'cusBase/CusICP.addIcpInfo.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#IcpInfo').DataTable().ajax.reload();
						$('#IcpInfo_modal').modal('hide');
						bdoSuccessBox('成功', '添加成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#IcpInfo_edit').click(function(){
		$('#IcpInfo_form').submit();
		if($('#IcpInfo_form').valid()){
			var cusBasicInfo = JSON.stringify({
				id: $('#IcpInfo_id').val(),
				customerId: $('#IcpInfo_customerId').val(),
				web: $('#IcpInfo_web').val(),
				website: $('#IcpInfo_website').val(),
				no: $('#IcpInfo_no').val()
			})
			$.ajax({
				url : 'cusBase/CusICP.editIcpInfo.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#IcpInfo_modal').modal('hide');
						$('#IcpInfo').DataTable().ajax.reload();
						bdoSuccessBox('成功', '修改成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusStock_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [
			{
				id : 'cusStock_save',
				icon : 'fa-floppy-o',
				style : 'btn-success',
				text : '新建'
			},{
				id :  'cusStock_edit',
				icon : 'fa-pencil',
				style : 'btn-css1 btn-info',
				text : '修改'
			},{
				id :  'cusStock_close_detail',
				icon : 'fa-close',
				style : 'btn-css1 btn-danger',
				text : '关闭'
			}
		],
		items : [
			{
				id :  'cusStock_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'cusStock_customerId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			}, {
				id :  'cusStock_stockcode',
				type : 'input',
				label : '股票代码',
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'cusStock_stockname',
				type : 'input',
				label : '股票简称',
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'cusStock_bourse',
				type : 'input',
				label : '上市交易所',
				validate : {
					rules : {
						required : true
					}
				}
			}
		]
	});
	
	$('#cusStock_save').click(function(){
		$('#cusStock_form').submit();
		if($('#cusStock_form').valid()){
			var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				stockcode: $('#cusStock_stockcode').val(),
				stockname: $('#cusStock_stockname').val(),
				bourse: $('#cusStock_bourse').val()
			})
			
			$.ajax({
				url : 'cusBase/CusStock.addCusStock.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusStock').DataTable().ajax.reload();
						$('#cusStock_modal').modal('hide');
						bdoSuccessBox('成功', '添加成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusStock_edit').click(function(){
		$('#cusStock_form').submit();
		if($('#cusStock_form').valid()){
			var cusBasicInfo = JSON.stringify({
				id: $('#cusStock_id').val(),
				customerId: $('#cusStock_customerId').val(),
				stockcode: $('#cusStock_stockcode').val(),
				stockname: $('#cusStock_stockname').val(),
				bourse: $('#cusStock_bourse').val()
			})
			$.ajax({
				url : 'cusBase/CusStock.editCusStock.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusStock_modal').modal('hide');
						$('#cusStock').DataTable().ajax.reload();
						bdoSuccessBox('成功', '修改成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusBond_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [
			{
				id : 'cusBond_save',
				icon : 'fa-floppy-o',
				style : 'btn-success',
				text : '新建'
			},{
				id :  'cusBond_edit',
				icon : 'fa-pencil',
				style : 'btn-css1 btn-info',
				text : '修改'
			},{
				id :  'cusBond_close_detail',
				icon : 'fa-close',
				style : 'btn-css1 btn-danger',
				text : '关闭'
			}
		],
		items : [
			{
				id :  'cusBond_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'cusBond_customerId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			}, {
				id :  'cusBond_bondcode',
				type : 'input',
				label : '债券代码',
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'cusBond_bondname',
				type : 'input',
				label : '债券简称',
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'cusBond_bondtype',
				type : 'input',
				label : '债券类型',
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'cusBond_bonddate',
				type : 'input',
				label : '发债日期',
				validate : {
					rules : {
						required : true
					}
				},
				plugin : {
					name : 'datepicker',
					options : {
						weekStart: 1,
						clearBtn: true,
						autoclose: true,
						language: 'zh-CN',
						format: 'yyyy/mm/dd',
						todayHighlight: true
					}
				}
			}
		]
	});
	
	$('#cusBond_save').click(function(){
		$('#cusBond_form').submit();
		if($('#cusBond_form').valid()){
			var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				bonddate: $('#cusBond_bonddate').val(),
				bondname: $('#cusBond_bondname').val(),
				bondcode: $('#cusBond_bondcode').val(),
				bondtype: $('#cusBond_bondtype').val()
			})
			
			$.ajax({
				url : 'cusBase/CusBond.addCusBond.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusBond').DataTable().ajax.reload();
						$('#cusBond_modal').modal('hide');
						bdoSuccessBox('成功', '添加成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusBond_edit').click(function(){
		$('#cusBond_form').submit();
		if($('#cusBond_form').valid()){
			var cusBasicInfo = JSON.stringify({
				id: $('#cusBond_id').val(),
				customerId: $('#cusBond_customerId').val(),
				bonddate: $('#cusBond_bonddate').val(),
				bondname: $('#cusBond_bondname').val(),
				bondcode: $('#cusBond_bondcode').val(),
				bondtype: $('#cusBond_bondtype').val()
			})
			$.ajax({
				url : 'cusBase/CusBond.editCusBond.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusBond_modal').modal('hide');
						$('#cusBond').DataTable().ajax.reload();
						bdoSuccessBox('成功', '修改成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusType_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [
			{
				id : 'cusType_save',
				icon : 'fa-floppy-o',
				style : 'btn-success',
				text : '新建'
			},{
				id :  'cusType_edit',
				icon : 'fa-pencil',
				style : 'btn-css1 btn-info',
				text : '修改'
			},{
				id :  'cusType_close_detail',
				icon : 'fa-close',
				style : 'btn-css1 btn-danger',
				text : '关闭'
			}
		],
		items : [
			{
				id :  'cusType_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'cusType_customerId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			}, {
				id :  'cusType_customertype',
				type : 'input',
				label : '客户类型',
				validate : {
					rules : {
						required : true
					}
				}
			}
		]
	});
	
	$('#cusType_save').click(function(){
		$('#cusType_form').submit();
		if($('#cusType_form').valid()){
			var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				customertype: $('#cusType_customertype').val()
			})
			
			$.ajax({
				url : 'cusBase/CusType.addCusType.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusType').DataTable().ajax.reload();
						$('#cusType_modal').modal('hide');
						bdoSuccessBox('成功', '添加成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusType_edit').click(function(){
		$('#cusType_form').submit();
		if($('#cusType_form').valid()){
			var cusBasicInfo = JSON.stringify({
				id: $('#cusType_id').val(),
				customerId: $('#cusType_customerId').val(),
				customertype: $('#cusType_customertype').val()
			})
			$.ajax({
				url : 'cusBase/CusType.editCusType.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusType_modal').modal('hide');
						$('#cusType').DataTable().ajax.reload();
						bdoSuccessBox('成功', '修改成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	
	
	
	
	
	
	
	
	
	
	$('#cusIndustry_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [
			{
				id : 'cusIndustry_save',
				icon : 'fa-floppy-o',
				style : 'btn-success',
				text : '新建'
			},{
				id :  'cusIndustry_edit',
				icon : 'fa-pencil',
				style : 'btn-css1 btn-info',
				text : '修改'
			},{
				id :  'cusIndustry_close_detail',
				icon : 'fa-close',
				style : 'btn-css1 btn-danger',
				text : '关闭'
			}
		],
		items : [
			{
				id :  'cusIndustry_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'cusIndustry_customerId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			}, {
				id :  'cusIndustry_industry',
				type : 'input',
				label : '行业分类',
				validate : {
					rules : {
						required : true
					}
				},
				plugin : {
					name : 'treecombo',
					options :{
						url : './cpBase/TreeCommon.findIndustryTreeByCus.json',
						params : {},
						view : {
							leafIcon : 'fa fa-building text-flat',
							nodeIcon : 'fa fa-bank text-primary-light',
							folderSelectable : true,
							multiSelect : false
						}
					}
				}
			}
		]
	});
	
	$('#cusIndustry_save').click(function(){
		var industryVal = $('#cusIndustry_industry').treecombo('getTreeComboValue');
		if(industryVal[0] != null && industryVal[0].nodeName == 'INPUT'){
				industryVal = null;
			}
		$('#cusIndustry_form').submit();
		if($('#cusIndustry_form').valid()){
			var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				industry: industryVal
			})
			
			$.ajax({
				url : 'cusBase/CusIndustry.addCusIndustry.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusIndustry').DataTable().ajax.reload();
						$('#cusIndustry_modal').modal('hide');
						bdoSuccessBox('成功', '添加成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusIndustry_edit').click(function(){
		var industryVal = $('#cusIndustry_industry').treecombo('getTreeComboValue');
		if(industryVal[0] != null && industryVal[0].nodeName == 'INPUT'){
				industryVal = null;
			}
		$('#cusIndustry_form').submit();
		if($('#cusIndustry_form').valid()){
			var cusBasicInfo = JSON.stringify({
				id: $('#cusIndustry_id').val(),
				customerId: $('#cusIndustry_customerId').val(),
				industry: industryVal
			})
			$.ajax({
				url : 'cusBase/CusIndustry.editCusIndustry.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusIndustry_modal').modal('hide');
						$('#cusIndustry').DataTable().ajax.reload();
						bdoSuccessBox('成功', '修改成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusAsset_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [
			{
				id : 'cusAsset_save',
				icon : 'fa-floppy-o',
				style : 'btn-success',
				text : '新建'
			},{
				id :  'cusAsset_edit',
				icon : 'fa-pencil',
				style : 'btn-css1 btn-info',
				text : '修改'
			},{
				id :  'cusAsset_close_detail',
				icon : 'fa-close',
				style : 'btn-css1 btn-danger',
				text : '关闭'
			}
		],
		items : [
			{
				id :  'cusAsset_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'cusAsset_customerId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			}, {
				id :  'cusAsset_year',
				type : 'select',
				label : '年度',
				html : ComboDicOption(true, 'year'),
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'cusAsset_netprofits',
				type : 'input',
				label : '净利润'
			}, {
				id :  'cusAsset_totalprofits',
				type : 'input',
				label : '利润总额'
			}, {
				id :  'cusAsset_ownerequity',
				type : 'input',
				label : '所有者权益总计'
			}, {
				rowspan : 1,
				id :  'cusAsset_totaltax',
				type : 'input',
				label : '纳税总额'
			}, {
				id :  'cusAsset_totalrevenue',
				type : 'input',
				label : '营业总收入'
			}, {
				id :  'cusAsset_mainrevenue',
				type : 'input',
				label : '营业总收入中主营业务收入'
			}, {
				id :  'cusAsset_totaldebt',
				type : 'input',
				label : '负债总额'
			}, {
				rowspan : 1,
				id :  'cusAsset_totalasset',
				type : 'input',
				label : '资产总额'
			}, {
				id :  'cusAsset_curname',
				type : 'select',
				label : '币种',
				html : ComboDicOption(true, 'currency')
			}
		]
	});
	
	$('#cusAsset_save').click(function(){
		$('#cusAsset_form').submit();
		if($('#cusAsset_form').valid()){
			var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				year: $('#cusAsset_year').val(),
				netprofits: $('#cusAsset_netprofits').val(),
				totalprofits: $('#cusAsset_totalprofits').val(),
				ownerequity: $('#cusAsset_ownerequity').val(),
				totaltax: $('#cusAsset_totaltax').val(),
				totalrevenue: $('#cusAsset_totalrevenue').val(),
				mainrevenue: $('#cusAsset_mainrevenue').val(),
				totaldebt: $('#cusAsset_totaldebt').val(),
				totalasset: $('#cusAsset_totalasset').val(),
				curname: $('#cusAsset_curname').val()
			})
			
			$.ajax({
				url : 'cusBase/cusAsset.addAsset.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusAsset').DataTable().ajax.reload();
						$('#cusAsset_modal').modal('hide');
						bdoSuccessBox('成功', '添加成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusAsset_edit').click(function(){
		$('#cusAsset_form').submit();
		if($('#cusAsset_form').valid()){
			var cusBasicInfo = JSON.stringify({
				id: $('#cusAsset_id').val(),
				customerId: $('#cusAsset_customerId').val(),
				year: $('#cusAsset_year').val(),
				netprofits: $('#cusAsset_netprofits').val(),
				totalprofits: $('#cusAsset_totalprofits').val(),
				ownerequity: $('#cusAsset_ownerequity').val(),
				totaltax: $('#cusAsset_totaltax').val(),
				totalrevenue: $('#cusAsset_totalrevenue').val(),
				mainrevenue: $('#cusAsset_mainrevenue').val(),
				totaldebt: $('#cusAsset_totaldebt').val(),
				totalasset: $('#cusAsset_totalasset').val(),
				curname: $('#cusAsset_curname').val()
			})
			$.ajax({
				url : 'cusBase/CusAsset.editAsset.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusAsset_modal').modal('hide');
						$('#cusAsset').DataTable().ajax.reload();
						bdoSuccessBox('成功', '修改成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusComposition_form').formview({
		display : 'tableform-one',
		columns : 6,
		style: {},
		buttons : [
			{
				id : 'cusComposition_save',
				icon : 'fa-floppy-o',
				style : 'btn-success',
				text : '新建'
			},{
				id :  'cusComposition_edit',
				icon : 'fa-pencil',
				style : 'btn-css1 btn-info',
				text : '修改'
			},{
				id :  'cusComposition_close_detail',
				icon : 'fa-close',
				style : 'btn-css1 btn-danger',
				text : '关闭'
			}
		],
		items : [
			{
				id :  'cusComposition_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'cusComposition_customerId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			}, {
				id :  'cusComposition_year',
				type : 'select',
				label : '年度',
				html : ComboDicOption(true, 'year'),
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'cusComposition_quarter',
				type : 'select',
				label : '季度',
				html : ComboDicOption(true, 'season'),
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'cusComposition_type',
				type : 'select',
				label : '类型',
				html : ComboDicOption(true, '主营构成（按产品和服务）'),
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				id :  'cusComposition_name',
				type : 'input',
				label : '名称',
				validate : {
					rules : {
						required : true
					}
				}
			}, {
				rowspan : 1,
				id :  'cusComposition_profitrate',
				type : 'input',
				label : '利润比例 %'
			}, {
				id :  'cusComposition_costratio',
				type : 'input',
				label : '成本比例 %'
			}, {
				id :  'cusComposition_grossprofit',
				type : 'input',
				label : '毛利率 %'
			}, {
				id :  'cusComposition_operatingcost',
				type : 'input',
				label : '营业成本（元）'
			}, {
				rowspan : 1,
				id :  'cusComposition_revenue',
				type : 'input',
				label : '营业收入（元）'
			}
		]
	});
	
	$('#cusComposition_save').click(function(){
		$('#cusComposition_form').submit();
		if($('#cusComposition_form').valid()){
			var cusBasicInfo = JSON.stringify({
				customerId: $('#addCus_customerId').val(),
				year: $('#cusComposition_year').val(),
				quarter: $('#cusComposition_quarter').val(),
				type: $('#cusComposition_type').val(),
				name: $('#cusComposition_name').val(),
				profitrate: $('#cusComposition_profitrate').val(),
				costratio: $('#cusComposition_costratio').val(),
				grossprofit: $('#cusComposition_grossprofit').val(),
				operatingcost: $('#cusComposition_operatingcost').val(),
				revenue: $('#cusComposition_revenue').val()
			})
			
			$.ajax({
				url : 'cusBase/CusComposition.addComposition.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusComposition').DataTable().ajax.reload();
						$('#cusComposition_modal').modal('hide');
						bdoSuccessBox('成功', '添加成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	$('#cusComposition_edit').click(function(){
		$('#cusComposition_form').submit();
		if($('#cusComposition_form').valid()){
			var cusBasicInfo = JSON.stringify({
				id: $('#cusComposition_id').val(),
				customerId: $('#cusComposition_customerId').val(),
				year: $('#cusComposition_year').val(),
				quarter: $('#cusComposition_quarter').val(),
				type: $('#cusComposition_type').val(),
				name: $('#cusComposition_name').val(),
				profitrate: $('#cusComposition_profitrate').val(),
				costratio: $('#cusComposition_costratio').val(),
				grossprofit: $('#cusComposition_grossprofit').val(),
				operatingcost: $('#cusComposition_operatingcost').val(),
				revenue: $('#cusComposition_revenue').val()
			})
			$.ajax({
				url : 'cusBase/CusComposition.editComposition.json',
				type : 'post',
				data : {
					param1 : cusBasicInfo
				},
				dataType: 'json',
				async : false,
				success : function(data){
					if(data.success){
						$('#cusComposition_modal').modal('hide');
						$('#cusComposition').DataTable().ajax.reload();
						bdoSuccessBox('成功', '修改成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
				error : function(data){
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		}
	});
	
	/** 模态框关闭 */
	$('button[id$="_close_detail"]').click(function() {
		$(this).closest(".modal").modal('hide');
	});	
	
	$('button[class="btn_add"]').click(function() {
		var id = $(this).closest("div.block.block-bordered").first().attr('id').split('_')[1];
		if(id != 'cusBranch'){
			$('#'+ id +'_save').show();
			$('#'+ id +'_edit').hide();
			$('#'+ id +'_close').show();
			var state = $('#cus_'+ id +'_toggle').attr("tip");
			if(state != "show"){
				$('#cus_'+ id +'_toggle').click();
			}
			$("#"+ id +"_modal").modal('show');
		}
	});	
	
	/** 模态框关闭 : 清除表单数据*/
	$('.modal.detail-modal').on('hidden.bs.modal', function (event) {
		$(event.target).find('input, select, textarea').removeAttr('disabled');
  		$(event.target).find('input, select, textarea').val(null);
  		$(event.target).find(':input[isTree]').treecombo('setTreeComboValue',[null, null]);
  		$(event.target).find('[id^="treecombocon"]').remove();
  		$(event.target).find('form td').removeClass('has-error');
  		$(event.target).find('form .help-block').remove();
	})
	
});