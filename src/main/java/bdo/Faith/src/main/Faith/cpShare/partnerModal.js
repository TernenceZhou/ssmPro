/*$('.modal').on('show.bs.modal', function(){
    $(this).draggable({
		handle: '.block-header',
		cursor: 'move'
    });
    $(this).css('overflow', 'hidden');
});*/

$('#modal_partner').on('hide.bs.modal', function() {
	$('[data-toggle="block-option"][data-action="content_toggle"]').each(function(){
		if($(this).find('i').attr('class') == 'si si-arrow-down'){
			$(this).click();
		}
    });
	$('#partner_nofocus').show(); 
	$('#partnerFocusChart').show();
	$('#modal_partner .modal-body').scrollTop(0);
});

var partnerCVId;
var partnerCVInfo = function(partnerId){
	$('#partner_nofocus').hide();
	$('#partnerMemoEdit').show();
	partnerCVId = partnerId;
	//判断是否是本人
	if(sys_userId != partnerId){
		$('#partnerMemoEdit').hide();
		$('#partnerSelf').show();
	}else {
		$('#partnerMemoEdit').attr('data-toggle','tooltip');
		$('#partnerSelf').hide();
	}
	// 加载用户头像
	$.ajax({
		type : 'post',
		url : 'cpBase/Ldap.getUserPhoto.json',
		data : {
			param1: partnerId
		},
		dataType : 'json',
		success : function(result) {
			if(result.data[0].photoUrl.split("\\")[2] != "null"){
				$('#partnerPhoto')
				.attr('src',result.data[0].photoUrl)
				.error(function(){
					$('#partnerPhoto').attr('src','assets/img/avatars/avatar10.jpg')
				});
			}else{
				$('#partnerPhoto').attr('src','assets/img/avatars/avatar10.jpg')
			}
				
		}
	});
	//获取合伙人信息
	$.ajax({
		type : 'post',
		url : 'cpShare/PartnerInfo.getPartnerData.json',
		async : false,
		data : {
			menuId : window.sys_menuId,
			param2 : partnerId
		},
		dataType : 'json',
		async : false,
		success : function(data) {
			//是否关注该合伙人
			if(data.data[1].isFocusOn == true){
				$('#focusOn').hide();
				$('#focusOff').show();
			}else {
				$('#focusOn').show();
				$('#focusOff').hide();
			}
			//关注,粉丝数
			$('#partnerFocusNum').html(data.data[1].focusNum);
			$('#partnerFansNum').html(data.data[1].fansNum);
			
			//该合伙人信息
			partnerInfo = data.data[0];
			if(partnerInfo.wrokState == '在职'){
				$('#wrokState').removeClass('ribbon-danger').addClass('ribbon-success');
				$('#wrokState').find('span').html(partnerInfo.wrokState);
			} else{
				$('#wrokState').removeClass('ribbon-success').addClass('ribbon-danger');
				$('#wrokState').find('span').html(partnerInfo.wrokState);
			}
			if(partnerInfo.partnerId){
				$('#main_chart_div').show();
				$('#history_pro_div').show();
				$('#can_apply_div').show();
				mainCharts(partnerInfo);
				historyPro(partnerId);
				canApply(partnerId);
			} else{
				$('#partnerMemoEdit').hide();
				$('#main_chart_div').hide();
				$('#history_pro_div').hide();
				$('#can_apply_div').hide();
			}
			
			$('#partnerName').html(partnerInfo.__uidName);
			$('#partnerDepart').html(partnerInfo.__ddepartmentid.topManageDepName + '-' + partnerInfo.__ddepartmentid.departName);
			$('#partnerMobile').html(partnerInfo.__uid.mobilePhone);
			var focusIndustry = '';
			if (partnerInfo.fn1) {
				focusIndustry = partnerInfo.fn1;
			}
			if (partnerInfo.fn2) {
				focusIndustry += ',' + partnerInfo.fn2;
			}
			if (partnerInfo.fn3) {
				focusIndustry += ',' + partnerInfo.fn3;
			}
			if (partnerInfo.fn4) {
				focusIndustry += ',' + partnerInfo.fn4;
			}
			if (partnerInfo.fn5) {
				focusIndustry += ',' + partnerInfo.fn5;
			}
			if(focusIndustry == ''){
				$('#partnerFocus').html('暂无');
			}else {
				$('#partnerFocus').html(focusIndustry);
			}
			$('#partnerPhone').html(partnerInfo.__uid.phone);
			if(partnerInfo.evaluateScore){
				$('#partnerScore').raty({
			        score : (partnerInfo.evaluateScore).toFixed(1),
			        readOnly : true,
			        halfShow :true,
				    number : 5,
				    hints : false,
				    starHalf : 'fa fa-fw fa-star-half-o text-warning',
				    starOn : 'fa fa-fw fa-star text-warning'
			    });
			}else {
				$('#partnerScore').html('暂无');
			}
			$('#partnerEmail').html(partnerInfo.__uid.email);
			$('#partnerRank').html(partnerInfo.__uid.rank);
			
			if(partnerInfo.memo){
				$('#partnerMemo').html('<span data-toggle="tooltip" title="' + partnerInfo.memo + '">' 
					+ ((partnerInfo.memo).length > 20 ? (partnerInfo.memo).substr(0, 20) + '...' : partnerInfo.memo) + '</span>');
			}else {
				$('#partnerMemo').html('<span data-toggle="tooltip" title=""></span>');
			}
			$('#modal_partner').modal('show');
		}
	});
};

/** 主营行业饼图 */
var chartsInit = echarts.init(document.getElementById('partnerFocusChart'));
function mainCharts(object){
	var legendData = [];
	var seriesData = [];
	if(object.mp1 && object.mp1 > 0){
		legendData.push(object.mn1);
		seriesData.push({
			value : object.ms1,
			name : object.mn1
		});
	}
	if(object.mp2 && object.mp2 > 0){
		legendData.push(object.mn2);
		seriesData.push({
			value : object.ms2,
			name : object.mn2
		});
	}
	if(object.mp3 && object.mp3 > 0){
		legendData.push(object.mn3);
		seriesData.push({
			value : object.ms3,
			name : object.mn3
		});
	}
	if(object.mp4 && object.mp4 > 0){
		legendData.push(object.mn4);
		seriesData.push({
			value : object.ms4,
			name : object.mn4
		});
	}
	if(object.mp5 && object.mp5 > 0){
		legendData.push(object.mn5);
		seriesData.push({
			value : object.ms5,
			name : object.mn5
		});
	}
	if(object.mpOther && object.mpOther > 0){
		legendData.push(object.mnOther);
		seriesData.push({
			value : object.msOther,
			name : object.mnOther
		});
	}
	if(seriesData.length == 0){
		$('#partner_nofocus').show();
		$('#partnerFocusChart').hide();
		return;
	}
	var chartsOption = {
//		title : {
//			text : object.__uidName + '的主营行业',
//			x : 'center'
//		},
//		tooltip : {
//			trigger : 'item',
//			formatter : "{b}(单位:万元) <br/> {c} ({d}%)"
//		},
		legend : {
			orient : 'vertical',
			left : 'right',
			data : legendData
		},
		series : [ {
			type : 'pie',
			label : {
				normal : {
					formatter : function(param){
						return param.name + '\n' + (param.value / 10000).toFixed(2) + '万元(' + param.percent + '%)';
					}
				}
			},
			radius : '65%',
			center : [ '50%', '60%' ],
			data : seriesData,
			itemStyle : {
				emphasis : {
					shadowBlur : 10,
					shadowOffsetX : 0,
					shadowColor : 'rgba(0, 0, 0, 0.5)'
				}
			}
		} ]
	};
	chartsInit.setOption(chartsOption);
}

/** 历史签字项目 */
function historyPro(partnerId){
	/** table 属性 */
	var tableParam = {
		tabNum : true,
		scrollX : true,
		pageLength : 10,
		lengthChange : true,
		dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
		//必需
		sourceData : {},
		sourceUrl : 'cusBase/CusGeneral.query.json',
		filterParam : {
			menuId : window.sys_menuId,
			sqlId : 'CP00007',
			filter : '',
			param1 : partnerId
		},
		tableColumns : [
			{
				targets : 1,
				orderable : true,
				className : 'text-center',
				title : '项目年份',
				name : 'projectYear',
				data : 'projectYear',
				width : '100px'
			}, {
				targets : 2,
				orderable : true,
				title : '集团名称',
				name : 'groupName',
				data : 'groupName',
				width : '200px'
			}, {
				targets : 3,
				orderable : true,
				title : '客户名称',
				name : 'customerName',
				data : 'customerName',
				width : '200px'
			}, {
				targets : 4,
				orderable : true,
				title : '客户性质',
				name : 'customerProperties',
				data : 'customerProperties',
				width : '150px'
			}, {
				targets : 5,
				orderable : true,
				title : '行业性质',
				name : 'industrySys',
				data : 'industrySys',
				width : '150px'
			}, {
				targets : 6,
				orderable : true,
				title : '业务类型',
				name : 'businessType',
				data : 'businessType',
				width : '100px'
			}]
	};
	BdoDataTables('historyPro', tableParam);
}

/** 可申请业务机会 */
function canApply(partnerId){
	/** table 属性 */
	var tableParam = {
		tabNum : true,
		scrollX : true,
		pageLength : 10,
		lengthChange : true,
		dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
		//必需
		sourceData : {},
		sourceUrl : 'cusBase/CusGeneral.query.json',
		filterParam : {
			menuId : window.sys_menuId,
			sqlId : 'CP00008',
			filter : '',
			param1 : partnerId
		},
		tableColumns : [
			{
				targets : 1,
				orderable : true,
				title : '业务机会编号',
				className : 'text-center',
				name : 'businessId',
				data : 'businessId',
				width : '150px'
			}, {
				targets : 2,
				orderable : true,
				title : '姓名',
				className : 'text-center',
				name : 'providerId',
				data : '__uproviderId',
				width : '100px',
				render : function(data, type, row, meta){
					return '<span data-toggle="tooltip" title="电话: ' + data.phone
							+ '\n手机: ' + data.mobilePhone + '\n邮箱: ' + data.email
							+ '">' + data.userName + '</span>';
				}
			}, {
				targets : 3,
				orderable : true,
				title : '所属部门',
				name : 'departId|__ddepartId',
				data : '__ddepartId.departName',
				width : '200px',
				render : function(data, type, row, meta){
					return row.__ddepartId.topManageDepName + '-' + row.__ddepartId.departName;
				}
			}, {
				targets : 4,
				orderable : true,
				title : '联系人',
				className : 'text-center',
				name : 'contract',
				data : 'contract',
				width : '100px'
			}, {
				targets : 5,
				orderable : true,
				title : '联系方式',
				name : 'contractWay',
				data : 'contractWay',
				width : '150px'
			}, {
				targets : 6,
				orderable : true,
				title : '业务类型',
				name : 'businessType',
				data : 'businessType',
				width : '100px'
			}, {
				targets : 7,
				orderable : true,
				title : '所属行业',
				name : 'industry',
				data : 'industry',
				width : '150px',
				render : function(data, type, row, meta){
					return IndustryVal2Nm(data);
				}
			}, {
				targets : 8,
				orderable : true,
				title : '所需人数',
				className : 'text-right',
				name : 'menNumRequire',
				data : 'menNumRequire',
				width : '100px'
			}, {
				targets : 9,
				orderable : true,
				title : '合作意向',
				className : 'text-center',
				name : 'cooperation',
				data : 'cooperation',
				width : '150px'
			}, {
				targets : 10,
				orderable : true,
				title : '工作地点',
				name : 'workingPlace',
				data : 'workingPlace',
				width : '250px'
			}, {
				targets : 11,
				orderable : true,
				className : 'text-center',
				title : '发布日期',
				name : 'startDate',
				data : 'startDate',
				width : '150px'
			}, {
				targets : 12,
				orderable : true,
				className : 'text-center',
				title : '截止日期',
				name : 'endDate',
				data : 'endDate',
				width : '150px'
			}]
	};
	BdoDataTables('canApply', tableParam);
}

//维护
$('#partnerMemoEdit').click(function(){
	$('#modal_partner').attr('tabindex', '');
	swal({
	  title : '业务信息',
	  text : '请修改您的备注信息',
	  type: 'warning',
	  input : 'textarea',
	  inputValue : $('#partnerMemo span').attr('title'),
	  showCancelButton: true,
	  cancelButtonText : '取消',
	  confirmButtonText : '确定',
//	  allowEscapeKey: false,
	  allowOutsideClick: false,
	  preConfirm : function(text) {
		return new Promise(function(resolve, reject) {
			if (text.length > 100) {
				reject('请将输入的字符控制在100以内')
			} else {
				resolve()
			}
		})
	  }
	}).then(function(value) {
		$('#modal_partner').attr('tabindex', '-1');
		$.ajax({
			url : 'cpShare/PartnerInfo.partnerManage.json',
			data : {
				param1 : partnerCVId,
				param2 : encodeURI(value)
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#partnerMemo').html('<span data-toggle="tooltip" title="' + value + '">' 
						+ ((value).length > 20 ? (value).substr(0, 20) + '...' : value) + '</span>');
					$('#partnerInfo').DataTable().ajax.reload();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}, function(dismiss) {
		$('#modal_partner').attr('tabindex', '-1');
		$('#modal_partner').focus();
	});
});

//关注
$('#focusOn').click(function(){
	$.ajax({
		url : 'cpShare/PartnerInfo.partnerFocus.json',
		data : {
			param1 : partnerCVId,
			param2 : true
		},
		dataType : 'json',
		success : function(data){
			$('#partnerFansNum').html(parseInt($('#partnerFansNum').html()) + 1);
			$('#focusOn').hide();
			$('#focusOff').show();
		}
	});
});

//取消关注
$('#focusOff').click(function(){
	$.ajax({
		url : 'cpShare/PartnerInfo.partnerFocus.json',
		data : {
			param1 : partnerCVId,
			param2 : false
		},
		dataType : 'json',
		success : function(data){
			$('#partnerFansNum').html(parseInt($('#partnerFansNum').html()) - 1);
			$('#focusOff').hide();
			$('#focusOn').show();
		}
	});
});