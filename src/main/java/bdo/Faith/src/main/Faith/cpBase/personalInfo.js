uiBlocksApi(false, 'init');
/*$('.modal').on('show.bs.modal', function(){
    $(this).draggable({
		handle: '.block-header',
		cursor: 'move'
    });
    $(this).css('overflow', 'hidden');
});*/

$('#modal_personal').on('hide.bs.modal', function() {
	$('[data-toggle="block-option"][data-action="content_toggle"]').each(function(){
		if($(this).find('i').attr('class') == 'si si-arrow-down'){
			$(this).click();
		}
	});
	$('#personal_nofocus').show();
	$('#personalFocusChart').show();
	$('#modal_personal .modal-body').scrollTop(0);
});
var personalId;
var getPersonalInfo = function(userId){
	$('#modal_personal').modal('show');
	personalId = userId;
	$('#personal_nofocus').hide();
	$('#personalMemoEdit').show();
	//判断是否是本人
	if(hrLoginId != userId){
		$('#personalMemoEdit').hide();
		$('#personalSelf').show();
		$('#focusOn').attr('data-value', userId);
		$('#focusOff').attr('data-value', userId);
	}else {
		$('#personalMemoEdit').attr('data-toggle','tooltip');
		$('#personalMemoEdit').attr('data-value', userId);
		$('#personalSelf').hide();
	}
	// 判断是否显示证书
	$.ajax({
		type : 'get',
		url : 'cpBase/Usual.hasSacpCe.json',
		data : {
			param1 : userId
		},
		dataType : 'json',
		success : function(data) {
			if(data.success){
				$('#getSacpce').show();
				$('#getSacpce').off();
				$('#getSacpce').on('click', function(){
					$('#personal-modal-sacpce-img').attr('src', 'cpBase/Usual.getSacpCe.json?param1='+userId);
					$('#personal-modal-sacpce').modal('show');
				});
			} else {
				$('#getSacpce').hide();
			}
		}
	});
	/*if(window.hasSacpCer){
		$('#getSacpce').show();
		$('#getSacpce').off();
		$('#getSacpce').on('click', function(){
			$('#personal-modal-sacpce-img').attr('src', 'cpBase/Usual.getSacpCe.json?param1='+userId);
			$('#personal-modal-sacpce').modal('show');
		});
	}else{
		$('#getSacpce').hide();
	}*/
	// 加载用户头像
	$.ajax({
		type : 'post',
		url : 'cpBase/Ldap.getUserPhoto.json',
		data : {
			param1: userId
		},
		dataType : 'json',
		success : function(result) {
			if(!result.data || !result.data.length > 0) {
				return;
			}
			if(result.data[0].photoUrl.split("\\")[2] != "null"){
				$('#personalPhoto')
					.attr('src',result.data[0].photoUrl)
					.error(function(){
						$('#personalPhoto').attr('src','assets/img/avatars/avatar10.jpg')
					});
			}else{
				$('#personalPhoto').attr('src','assets/img/avatars/avatar10.jpg')
			}

		}
	});
	//获取合伙人信息
	$.ajax({
		type : 'post',
		url : 'cpBase/Usual.getPersonalInfo.json',
		async : false,
		data : {
			menuId : window.sys_menuId,
			param1 : userId
		},
		dataType : 'json',
		async : false,
		success : function(data) {
			if(data.success && data.data && data.data.length > 0) {
				//是否关注该合伙人
				if(data.data[0].isFocus == '1'){
					$('#focusOn').hide();
					$('#focusOff').show();
				}else {
					$('#focusOn').show();
					$('#focusOff').hide();
				}
				//关注,粉丝数
				$('#personalFocusNum').html(data.data[0].focusNum[0].FOCUSNUM);
				$('#personalFansNum').html(data.data[0].focusNum[0].FANSNUM);
				//该合伙人信息
				let personalInfo = data.data[0].info;
				if(personalInfo) {
					if(personalInfo.wrokState == '在职'){
						$('#wrokState').removeClass('ribbon-danger').addClass('ribbon-success');
						$('#wrokState').find('span').html(personalInfo.wrokState);
					} else{
						$('#wrokState').removeClass('ribbon-success').addClass('ribbon-danger');
						$('#wrokState').find('span').html(personalInfo.wrokState);
					}
					$('#personalName').html(personalInfo.userName);
					$('#personalDepart').html(personalInfo.departmentName);
					$('#personalMobile').html(personalInfo.mobilePhone);
					$('#personalPhone').html(personalInfo.phone);
					$('#personalEmail').html(personalInfo.email);
					$('#personalRank').html(personalInfo.rank);
	
					if(personalInfo.evaluateScore){
						$('#personalScore').raty({
							score : (personalInfo.evaluateScore).toFixed(1),
							readOnly : true,
							halfShow :true,
							number : 5,
							hints : false,
							starHalf : 'fa fa-fw fa-star-half-o text-warning',
							starOn : 'fa fa-fw fa-star text-warning'
						});
					}else {
						$('#personalScore').html('暂无');
					}
					if(personalInfo.memo){
						$('#personalMemo').html('<span data-toggle="tooltip" title="' + personalInfo.memo + '">'
							+ ((personalInfo.memo).length > 20 ? (personalInfo.memo).substr(0, 20) + '...' : personalInfo.memo) + '</span>');
					}else {
						$('#personalMemo').html('<span data-toggle="tooltip" title=""></span>');
					}
				}
	
				// 合伙人
				let partnerList = data.data[0].partnerList;
	
				if(partnerList && partnerList.length > 0) {
					let partner = partnerList[0];
					if(partner.partnerId) {
						mainCharts(partner);
						var focusIndustry = '';
						if (partner.fn1) {
							focusIndustry = partner.fn1;
						}
						if (partner.fn2) {
							focusIndustry += ',' + partner.fn2;
						}
						if (partner.fn3) {
							focusIndustry += ',' + partner.fn3;
						}
						if (partner.fn4) {
							focusIndustry += ',' + partner.fn4;
						}
						if (partner.fn5) {
							focusIndustry += ',' + partner.fn5;
						}
						if(partner.focusIndustry == ''){
							$('#personalFocus').html('暂无');
						}else {
							$('#personalFocus').html(focusIndustry);
						}
	
						$('#main_chart_div').show();
						$('#history_pro_div').show();
					}else {
						$('#main_chart_div').hide();
						$('#history_pro_div').hide();
					}
				}else {
					$('#main_chart_div').hide();
					$('#history_pro_div').hide();
				}
			}
		}
	});
	getUserProject(userId);
	historyPro(userId);
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
	}else {
		$('#partner_nofocus').hide();
		$('#partnerFocusChart').show();
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
		sourceUrl : 'cpBase/Usual.querySignProject.json',
		filterParam : {
			menuId : window.sys_menuId,
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
//维护
$('#personalMemoEdit').click(function(){
	$('#modal_personal').attr('tabindex', '');
	swal({
		title : '业务信息',
		text : '请修改您的备注信息',
		type: 'warning',
		input : 'textarea',
		inputValue : $('#personalMemo span').attr('title'),
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
		$('#modal_personal').attr('tabindex', '-1');
		$.ajax({
			url : 'cpBase/Usual.memoEdit.json',
			data : {
				param1 : $('#personalMemoEdit').attr('data-value'),
				param2 : encodeURI(value)
			},
			dataType : 'json',
			success : function(data){
				if(data.success){
					$('#personalMemo').html('<span data-toggle="tooltip" title="' + value + '">' + ((value).length > 20 ? (value).substr(0, 20) + '...' : value) + '</span>');
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}, function(dismiss) {
		$('#modal_personal').attr('tabindex', '-1');
		$('#modal_personal').focus();
	});
});

//关注
$('#focusOn').click(function(){
	$.ajax({
		url : 'cpBase/Usual.partnerFocus.json',
		data : {
			param2 : $('#focusOn').attr('data-value')
		},
		dataType : 'json',
		success : function(data){
			if(data.success){
				$('#focusOff').toggle();
				$('#focusOn').toggle();
				$('#personalFansNum').text(parseInt($('#personalFansNum').text()) + 1);
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
});
//取消关注
$('#focusOff').click(function(){
	$.ajax({
		url : 'cpBase/Usual.partnerFocus.json',
		data : {
			param2 : $('#focusOff').attr('data-value')
		},
		dataType : 'json',
		success : function(data){
			if(data.success){
				$('#focusOff').toggle();
				$('#focusOn').toggle();
				$('#personalFansNum').text(parseInt($('#personalFansNum').text()) - 1);
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
});

function getUserProject(userId){
	$.ajax({
		url : 'cpBase/Usual.getUserProject.json',
		data : {
			param1 : userId
		},
		dataType : 'json',
		success : function(data){
			var prostr = '';
			$.each(data.data, function(index, info){
				prostr += '<tr><td class="text-center">' + info.projectYear + '</td>';

				prostr += '<td class="text-right"><a style="cursor:pointer;" onclick="viewProject(' + info.projectYear + ', 1);">' + info.impPlSum + '</a></td>';
				prostr += '<td class="text-right"><a style="cursor:pointer;" onclick="viewProject(' + info.projectYear + ', 2);">' + info.impPmSum + '</a></td>';
				prostr += '<td class="text-right"><a style="cursor:pointer;" onclick="viewProject(' + info.projectYear + ', 3);">' + info.impMbSum + '</a></td>';

				prostr += '<td class="text-right"><a style="cursor:pointer;" onclick="viewProject(' + info.projectYear + ', 4);">' + info.unimpPlSum + '</a></td>';
				prostr += '<td class="text-right"><a style="cursor:pointer;" onclick="viewProject(' + info.projectYear + ', 5);">' + info.unimpPmSum + '</a></td>';
				prostr += '<td class="text-right"><a style="cursor:pointer;" onclick="viewProject(' + info.projectYear + ', 6);">' + info.unimpMbSum + '</a></td></tr>'
			});
			$('#user_project_count tbody').html(prostr);
		}
	});
}

var project_view;
function viewProject(year, type){
	project_view = {
		localParam : {
			tabNum : true,
			url : 'cpBase/Usual.getUserProjectList.json',
			urlparam : {
				menuId : window.sys_menuId,
				param1 : personalId,
				param2 : year,
				param3 : type
			}
		},
		tableParam : {
			lengthChange : true,
//			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering : true,
			order : [],
			serverSide : true,
			select : {
				style : 'os',
				items : 'cell'
			},
			columnDefs : [
				{
					targets : 1,
					className : 'text-center',
					title : '项目编号',
					name : 'projectId',
					data : 'projectId',
					width : '100px'
				}, {
					targets : 2,
					className : 'text-center',
					title : '项目名称',
					name : 'projectName',
					data : 'projectName',
					width : '100px'
				}, {
					targets : 3,
					className : 'text-center',
					title : '业务类型',
					name : 'auditPara',
					data : 'auditPara',
					width : '100px'
				}, {
					targets : 4,
					className : 'text-center',
					title : '所属部门',
					name : 'departmentName',
					data : 'departmentName',
					width : '150px'
				}]
		}
	};
	$('#modal_project').modal('show');
}

$('#modal_project').on('shown.bs.modal', function(){
	BdoDataTable('user_project_detail', project_view);
});