window.bdoMain = window.bdoMain || {};
$(document).ready(function() {
	if (window.bdoMain.isLoaded === true) {
		return true;
	}
	window.bdoMain.isLoaded = true;
	let userPhotoSrc = 'assets/img/avatars/avatar10.jpg';
	reLoadLoginData(false);
	/**
	 * 小杏仁 begin
	 */
	/*bdoChatVm.$mount('#bdoChat');
	bdoChatVm.currentUserPhoto = userPhotoSrc;*/
	/**
	 * 小杏仁 end
	 */

//	$('#header-navbar').slideUp();


//	function mousePos(e){  
//        e=e||window.event;  
//        var scrollX=document.documentElement.scrollLeft||document.body.scrollLeft;//分别兼容ie和chrome  
//        var scrollY=document.documentElement.scrollTop||document.body.scrollTop;  
//        var x=e.pageX||(e.clientX+scrollX);//兼容火狐和其他浏览器  
//        var y=e.pageY||(e.clientY+scrollY);  
//        if(y<=10){
//        	$('#header-navbar').slideDown();
//        }
//        return {x:x,y:y};  
//    }  
//   $("#main-container").mousemove(function(e){
//	   mousePos(e)
//   });
//   //鼠标移出隐藏
//   $("#header-navbar").mouseout(function(e){
//	   $('#header-navbar').slideUp(); 
//   });
//   //点击固定住
//   $("#header-navbar").click(function(e){
//	   console.log($(e.target));
//	  console.log($(e.target).attr("id"));
//	   if($(e.target).attr("id")=="hide_header"){
//		   $("#header-navbar").mouseout(function(e){
//			   $('#header-navbar').slideUp(); 
//		   });
//		   $('#header-navbar').slideUp();
//	   }else{
//		   $('#header-navbar').unbind("mouseout");
//	   }
//   });


	$.getNowPage(window.location.search);

	// 侧边栏自动隐藏
	$('#page-container').click(function(e) {
		if ($(e.target).closest('aside').length == 0 && $(e.target).attr('name') != 'sideToggleBtn') {
			$('#page-container').removeClass('side-overlay-o');
		}
	});
	// 加载用户头像
	$.ajax({
		type: 'post',
		url: 'cpBase/Ldap.getUserPhoto.json',
		data: {
			param1: sys_userId
		},
		dataType: 'json',
		success: function(result) {
			let hasUrl = true;
			if (result.success === true) {
				if (result.data && result.data[0] && result.data[0].photoUrl.split('\\')[2] != 'null') {
					$('#userPhoto2,#sideUserImg')
						.attr('src', result.data[0].photoUrl)
						.error(function() {
							//bdoChatVm.currentUserPhoto = userPhotoSrc;
							$('#userPhoto2,#sideUserImg').attr('src', 'assets/img/avatars/avatar10.jpg');
						});
				} else {
					userPhotoSrc = 'assets/img/avatars/avatar10.jpg';
					//bdoChatVm.currentUserPhoto = userPhotoSrc;
					$('#userPhoto2,#sideUserImg').attr('src', 'assets/img/avatars/avatar10.jpg');
				}
			}
		}
	});
	// 初始化
	var initSummerote = function() {
		let summerotePluginOpt = {
			/*toolbar:
				[
					['style', ['bold', 'italic', 'underline', 'clear']],
					['font', ['strikethrough', 'superscript', 'subscript']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['view', ['fullscreen']],
				],
			codeviewFilter: false,
			codeviewIframeFilter: true,*/
			toolbar:
				[
					// [groupName, [list of button]]
					['style', ['bold', 'italic', 'underline', 'clear']],
					['font', ['strikethrough', 'superscript', 'subscript']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['view', ['fullscreen']],
				],
			codeviewFilter: false,
			codeviewIframeFilter: true,
			codeviewIframeWhitelistSrc: ['localhost', '127.0.0.1', 'sacpdemo.bdo.com.cn', 'sacp.bdo.com.cn'],
			callbacks: {
				onPaste: function(ne) {
					var bufferText = ((ne.originalEvent || ne).clipboardData || window.clipboardData).getData('Text/plain');
					//    ne.preventDefault();
					ne.preventDefault ? ne.preventDefault() : (ne.returnValue = false);
					// Firefox fix
				}
			}
		};
		$('#feebackContent').off('summernote');
		$('#feebackContent').summernote(summerotePluginOpt);
	};
	initSummerote();
	
	// 转换Url
	var getUrl = function(a, f) {
		var d = a;
		//var c = this;
		var e = BDO_SYSTEM_WEB_ROOT.substring(1);
		if (a.indexOf('http://') != 0 && a.indexOf('https://') != 0) {
			if (a.length > e.length && a.indexOf(e) == 0) {
				d = a.substring(e.length);
			}
		}
		if (f != null && f != '') {
			if (d.indexOf('?') > 0) {
				d = d + '&';
			} else {
				d = d + '?';
			}
			d = d + 'menuid=' + f;
		}
		return d;
	};

	// 加载快捷菜单
	var loadShortcutMeum = function() {
		$.ajax({
			type: 'post',
			url: 'base/GeneralIgnoredDepart.queryForPopedom.json',
			data: {
				sqlId: 'CP00015'
			},
			dataType: 'json',
			success: function(result) {
				if (result.resultInfo.status == '0') {
					// 将旧的快捷菜单进行删除
					$.each($('#btn_shortcutmenu').find('li'), function(index, info) {
						if ($(this).length > 0) {
							$(this).remove();
						}
					});
					$.each(result.data, function(index, info) {
						$this = this;
						if (index == 3) {
							return false;
						}
						var li = $('<li></li>');
						var btn = $('<button></button>&nbsp;')
							.attr('target', getUrl(this.act, this.id))
							.attr('mid', this.id)
							.attr('type', 'button')
							.addClass('btn btn-sm btn-danlan');
						var i = $('<i></i>').html(' ' + this.name + '');
						btn.append(i);
						li.append(btn);
						$('#btn_shortcutmenu').append(li);
						btn.on('click', function(e) {
							// 加载按钮所代表的页面
//			        		window.open(window.location.origin + window.location.pathname + '?m=gotoDesktop&menuId=' + $(this).attr('mid'));
							var url = $(this).attr('target');
							window.sys_menuId = $(this).attr('mid');
							$('#main-container').load(url);
							// 自动定位到左边的菜单
							$('.menu').not($('#m' + window.sys_menuId)).removeClass('active');
							$('#m' + window.sys_menuId).closest('ul').closest('li').siblings('li').removeClass('open');
							$('#m' + window.sys_menuId).addClass('active');
							$('#m' + window.sys_menuId).closest('ul').closest('li').addClass('open');
							$('#m' + window.sys_menuId).click();
						});
					});
				}
			}
		});
	};

	// 初始化快捷菜单
	loadShortcutMeum();
	/*$('#navCustomerName').text("客户："+BDO_CUSTOMER_SELECT+'-'+BDO_CUSTOMERNAME_SELECT);
	$('#navProjectName').text("项目："+BDO_PROJECTNAME_SELECT);*/
	/*$('#navCustomerName').text('客户：' + (window.BDO_CUSTOMER_SELECT && window.BDO_CUSTOMER_SELECT != 'null' ? window.BDO_CUSTOMER_SELECT + '-' + window.BDO_CUSTOMERNAME_SELECT : ''));
	$('#navProjectName').text('项目：' + (window.BDO_CUSTOMER_SELECT && window.BDO_PROJECTNAME_SELECT != 'null' ? window.BDO_PROJECTNAME_SELECT : ''));*/

	let navCustomerNameText = (window.BDO_CUSTOMER_SELECT && window.BDO_CUSTOMER_SELECT != 'null' ? window.BDO_CUSTOMER_SELECT + '-' + window.BDO_CUSTOMERNAME_SELECT : '');
	if(navCustomerNameText > '') {
		navCustomerNameText = '客户：' + navCustomerNameText;
	}
	let navProjectNameText = (window.BDO_PROJECTNAME_SELECT && window.BDO_PROJECTNAME_SELECT != 'null' ? window.BDO_PROJECTNAME_SELECT : '');
	if(navProjectNameText > '') {
		navProjectNameText = '项目：' + navProjectNameText;
	}
	$('#navCustomerName').text(navCustomerNameText);
	$('#navProjectName').text(navProjectNameText);
	// 安全登出按钮
	$('#main_logout').click(function(e) {
		$(this).attr('href', 'bdologin.do?m=exitSystem');
		$.sessionStorage('userNm', selfNm);
		$.sessionStorage('loginId', loginId);
	});
	// 函证地址验证
	$('#main_addressCheck').click(function(e) {
		window.open('/Faith/generalbase.do?m=openAddressCheck');
	});
	// 应收账款回收率和本期销售统计
	$('#main_recover_sales').click(function(e) {
		window.open('/Faith/generalbase.do?m=openRecoverSales');
	});
	// 监盘
	$('#main_vouching').click(function(e) {
		/*$.ajax({
			type: 'post',
			url: 'cpBase/Vouching.getVouchingUrl.json',
			data: {
			},
			dataType: 'json',
			success: function(result) {
				let hasUrl = true;
				if (result.success === true) {
					if (result.data && result.data[0]) {
						window.open(result.data[0].bdoVouchingUrl);
					}
				}
			}
		});*/
		let projectId = window.CUR_PROJECTID;
		if( window.hrLoginId &&  window.hrLoginId > '' &&  window.bdoVouchingTrInfo &&  window.bdoVouchingTrInfo > '' && window.bdoVouchingUrl > '') {
			let url =  window.bdoVouchingUrl.replace('{hrLoginId}',  window.hrLoginId)
				.replace('{token}', window.bdoVouchingTrInfo)
				// .replace('{projectId}', projectId)
			;
			//window.open(url, '_blank');
			window.open(url, '_blank');
		}
	});

	// 智能对账云平台
	$('#main_faith_cloud_account_checking').click(function(e) {
		/*$.ajax({
			type: 'post',
			url: 'cpBase/Vouching.getVouchingUrl.json',
			data: {
			},
			dataType: 'json',
			success: function(result) {
				let hasUrl = true;
				if (result.success === true) {
					if (result.data && result.data[0]) {
						window.open(result.data[0].bdoVouchingUrl);
					}
				}
			}
		});*/
		// let projectId = window.CUR_PROJECTID;
		if( window.hrLoginId &&  window.hrLoginId > '' &&  window.bdoVouchingTrInfo &&  window.bdoVouchingTrInfo > '') {
			window.bdoAccountChecking =  window.bdoAccountChecking.replace('{hrLoginId}',  window.hrLoginId)
				.replace('{token}', window.bdoVouchingTrInfo);
			//window.open(url, '_blank');
			window.open(window.bdoAccountChecking, '_blank');
		}
	});
	// 自定义本福特分析
	$('#main_faith_benford_analysis').click(function(e) {
		/*$.ajax({
			type: 'post',
			url: 'cpBase/Vouching.getVouchingUrl.json',
			data: {
			},
			dataType: 'json',
			success: function(result) {
				let hasUrl = true;
				if (result.success === true) {
					if (result.data && result.data[0]) {
						window.open(result.data[0].bdoVouchingUrl);
					}
				}
			}
		});*/
		// let projectId = window.CUR_PROJECTID;
		if( window.hrLoginId &&  window.hrLoginId > '' &&  window.bdoVouchingTrInfo &&  window.bdoVouchingTrInfo > '') {
			window.bdoBenfordAnalysis =  window.bdoBenfordAnalysis.replace('{hrLoginId}',  window.hrLoginId)
				.replace('{token}', window.bdoVouchingTrInfo);
			//window.open(url, '_blank');
			window.open(window.bdoBenfordAnalysis, '_blank');
		}
	});

	// 通用表格解析平台
	$('#general_table_parsing_platform').click(function () {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgMain.getGeneralTableParsingPlatform.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID
			},
			dataType: 'json',
			success: function (result) {
				if (result.success === true) {
					let item = result.data[0];
					if (item) {
						let url = window.generalTableParsingPlatformUrl;
						if (item.token && item.token > '' && url && url > '') {
							url = url.replace('{access_token}', item.token);
							window.open(url, '_blank');
						}

					}
				}
			}
		});

	});



	// 底稿模板
	$('#main_faith_te').click(function(e) {
		window.open('/bdotpl/#/designer/start', '_blank');
	});
	/*$('#TemplateLibrary').click(function(e){
		RcsPage2({region: '#main-containerModal', data: {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID
		}});
	});*/
	$('#utilModal').on('shown.bs.modal', function(e) {
		RcsPage2({
			region: '#main-containerModal', data: {
//			customerId: window.CUR_CUSTOMERID,
//			projectId: window.CUR_PROJECTID
			}
		});
	});
	/** 检索条件设置 */
	var queryFilter = function() {
		var queryFilterArr = [];
		if ($('#search_meun').val() != '') {
			queryFilterArr.push({
				'field': 'name',
				'sqlIndex': 'name',
				'type': 'string',
				'value': $('#search_meun').val(),
				'operate': 'eq'
			});
		}
		if ($('#search_meunpath').val() != '') {
			queryFilterArr.push({
				'field': 'pathName',
				'sqlIndex': 'pathName',
				'type': 'string',
				'value': $('#search_meunpath').val(),
				'operate': 'eq'
			});
		}
		return JSON.stringify(queryFilterArr);
	};

	/** table 属性 */
	var tableParam = {
		tabNum: true,
		scrollX: true,
		lengthChange: true,
		order: [4, 'desc'],
		//必需
		sourceData: {},
		sourceUrl: 'base/GeneralIgnoredDepart.queryForPopedom.json',
		filterParam: {
			menuId: window.sys_menuId,
			sqlId: 'CP00014',
			filter: queryFilter()
		},
		tableColumns: [
			{
				targets: 1,
				orderable: false,
				className: 'text-center',
				title: '配置',
				data: null,
				width: '100px',
				render: function(data, type, row, meta) {
					var renderStr = '';
					// 是否已被设置成快捷菜单
					if (row.isShow == '0') {
						renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowAdd" data-placement="top" title="添加 " data-toggle="tooltip">'
							+ '<i class="fa fa-plus"></i></button>';
					} else {
						renderStr += '<button class="btn btn-xs btn-primary table-btn-operate" type="button" name="rowUp" data-placement="top" title="上移 " data-toggle="tooltip">'
							+ '<i class="fa fa-long-arrow-up"></i></button>';
						if (row.no != '1') {
							renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="rowDown" data-placement="top" title="下移 " data-toggle="tooltip">'
								+ '<i class="fa fa-long-arrow-down"></i></button>';
						}
						renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelete" data-placement="top" title="移除 " data-toggle="tooltip">'
							+ '<i class="fa fa-minus"></i></button>';

					}
					return renderStr;
				}
			}, {
				targets: 2,
				orderable: true,
				title: '菜单名',
				name: 'name',
				data: 'name',
				width: '200px'
			}, {
				targets: 3,
				orderable: true,
				title: '菜单路径信息',
				name: 'pathName',
				data: 'pathName',
				width: '300px',
				render: function(data, type, row, meta) {
					return data;
				}
			}, {
				targets: 4,
				orderable: true,
				title: '显示顺序',
				name: 'no',
				data: 'no',
				width: '50px'
			}]
	};

	// 快捷菜单按钮
	$('#shortcut_meun').click(function(e) {
		$('#shortcut-meun-modal.modal.fade .modal-dialog').css({
			'width': '800px'
		});
		$('#shortcut-meun-modal').modal('show');
	});

	// 我的资料按钮
	$('#user_info').click(function() {
		getPersonalInfo(hrLoginId);
	});

	$('#main_feedback').click(function() {
		$('#feedbackForm.modal.fade .modal-dialog').css({
			'width': '800px'
		});
		$('#feedbackForm').modal('show');
	});
	$('#feedback_close').click(function() {
		$('#feedbackForm').modal('hide');
	});
	$('#feedback_submit').click(function() {
		bdoConfirmBox('提交', '确定提交吗？', function(){
			var content = $('#feebackContent').val();
			let contentText = $('<div>' + content + '</div>').text();
			$.ajax({
				type : 'post',
				url : 'dgCenter/DgMain.addFeeBack.json',
				data : {
					param1 : $.base64.encode(encodeURIComponent(content)),
					param2 : contentText
				},
				dataType : 'json',
				success : function(data) {
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#feedbackForm').modal('hide');
						$('#feebackContent').summernote("reset");
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});



	// 快捷菜单搜索
	$('#btn_search').click(function() {
		tableParam.filterParam.filter = queryFilter();
		$('#shortcut-meun-table').DataTable().ajax.reload();
	});

	$('#sys_version').click(function() {
		$('#main-container').load('cpAdmin/systemVersion.html');
		$.ajax({
			url: 'cpBase/General.query.json',
			data: {
				sqlId: 'sys.S300017',
				systemId: systemId,
				start: 0,
				limit: 5
			},
			dataType: 'json',
			success: function(data) {
				if (data.success && data.data) {
					for (var i = 0; i < data.data.length; i++) {
						var appendStr='<ul class="list list-timeline pull-t"><li><div class="list-timeline-time">';
						appendStr +=systemName+data.data[i].version+'</div> <i class="fa fa-database list-timeline-icon bg-smooth"></i>';
						appendStr +='<div class="list-timeline-content"> <label id="versionContent'+i+'"> 发布时间：<input id="versionTime'+i+'" disabled=true style= "background-color:transparent;border:0;" value="'+getMyDate(data.data[i].versionTime)+'">'+data.data[i].content+' </label> </div> </li>';
						$('#versions').append(appendStr);
					}
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);

				}
			}
		});
	});


	function getMyDate(str) {
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oHour = oDate.getHours(),
			oMin = oDate.getMinutes(),
			oSen = oDate.getSeconds(),
			oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay);//最后拼接时间
		return oTime;

	}
	//补0操作
	function getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + num;
		}
		return num;
	}
	// 快捷菜单搜索清空
	$('#btn_clear').click(function() {
		$('#search_meun').val(null);
		$('#search_meunId').val(null);
		$('#search_meunNum').val(null);
		$('#search_meunpath').val(null);
		tableParam.filterParam.filter = queryFilter();
		$('#shortcut-meun-table').DataTable().ajax.reload();
	});

	// 添加快捷菜单
	$('#shortcut-meun-table').on('click', 'button[name="rowAdd"]', function() {
		var rowData = $('#shortcut-meun-table').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('添加', '确定创建【' + rowData.name + '】菜单的快捷按钮吗？', function() {
			$.ajax({
				type: 'post',
				url: 'base/KPersonalDeskInfo.insertDeskInfo.json',
				data: {
					menuId: rowData.id,
					ctype: 0
				},
				dataType: 'json',
				success: function(data) {
					$('#shortcut-meun-table').DataTable().ajax.reload();
					if (data.success === true) {
						bdoSuccessBox('成功', '成功添加【' + rowData.name + '】的快捷方式 !');
						loadShortcutMeum();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	// 删除快捷菜单
	$('#shortcut-meun-table').on('click', 'button[name="rowDelete"]', function() {
		var rowData = $('#shortcut-meun-table').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('删除', '确定删除【' + rowData.name + '】快捷按钮吗？', function() {
			$.ajax({
				type: 'post',
				url: 'base/KPersonalDeskInfo.deleteDeskInfo.json',
				data: {
					param1: rowData.id,
					menuId: window.sys_menuId
				},
				dataType: 'json',
				success: function(data) {
					$('#shortcut-meun-table').DataTable().ajax.reload();
					if (data.success === true) {
						bdoSuccessBox('成功', '成功地删除了【' + rowData.name + '】的快捷方式 !');
						loadShortcutMeum();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	// 删除快捷菜单
	$('#shortcut-meun-table').on('click', 'button[name="rowUp"],button[name="rowDown"]', function(e) {
		var rowData = $('#shortcut-meun-table').DataTable().data()[$(this).closest('tr').index()];
		var moveType = $(this).attr('name');
		var toNo = null;
		if (moveType == 'rowUp') {
			toNo = rowData.no + 1;
		} else {
			toNo = rowData.no - 1;
		}
		$.ajax({
			type: 'post',
			url: 'base/KPersonalDeskInfo.changeSort.json',
			data: {
				param1: rowData.id,
				param2: toNo
			},
			dataType: 'json',
			success: function(data) {
				$('#shortcut-meun-table').DataTable().ajax.reload();
				if (data.success === true) {
					loadShortcutMeum();
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});


	// 个人设置
	$('#self_setting').click(function(e) {
		$.ajax({
			type: 'post',
			url: 'cpBase/Ldap.getUserPhoto.json',
			data: {
				param1: loginId
			},
			dataType: 'json',
			success: function(result) {
				//console.log(result);
				if (result.split('\\')[2] != 'null') {
					$('#userPhoto2,#sideUserImg').attr('src', result.data[0].photoUrl);
				}
			}
		});
	});


	$('#shortcut-meun-modal').on('shown.bs.modal', function() {
		// 快捷菜单表格
		BdoDataTables('shortcut-meun-table', tableParam);
	});

//	// 是否邮件通知
//	$.get('cpShare/CoopUserExt.getIsEmail.json', function(data){
//		$('#emailNotify').prop('checked', data.data[0].emailNotify);
//	});
//	// 更改是否邮件通知
//	$('#emailNotify').click(function(){
//		$.post('cpShare/CoopUserExt.updateIsEmail.json', {param1: $('#emailNotify').prop('checked') ? '1' : '0'})
//	});

	// 菜单点击及ctrl+左键点击事件
	$('#mainMenu').on('mousedown', 'a[href="#"]', function(e) {
		if (e.button == 0 && e.ctrlKey) {
			window.open(window.location.origin + window.location.pathname + '?m=gotoDesktop');
		}
	});
	$('#mainMenu').on('mousedown', 'a[target^="general.do"]', function(e) {
		var menuId = $(this).attr('mid');
		if(menuId == '40000088'){
			$.ajax({
				url: 'cpBase/BdoPortal.getCustomPortalUrl.json',
				type: 'post',
				data: {
					param1: window.hrLoginId
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						window.open(data.data[0].addressUrl + "?loginId=" + data.data[0].loginId + "&systemName=" + data.data[0].systemName + "&token=" + data.data[0].token, 'location=no,resizable=yes,scrollbars=yes,height=600,width=460');
					}
				}
			});
		}else if(menuId == '40000091'){
			window.open('cusReport/index.html#/riskFetection?menuId=' + window.sys_menuId + '&customerId=' + window.CUR_CUSTOMERID + '&projectId=' + window.CUR_PROJECTID + '&projectYear=' + window.CUR_PROJECT_END_YEAR);
		}else if(menuId == '50010019'){
			window.open('inventory/index.html#/supervision?menuId=' + window.sys_menuId + '&customerId=' + window.CUR_CUSTOMERID + '&projectId=' + window.CUR_PROJECTID);
		}else{
			if (e.button == 0 && e.ctrlKey) {
				if(menuId != '40000022' || checkProjectSetting()){
					window.open(window.location.origin + window.location.pathname + '?m=gotoDesktop&menuId=' + menuId);
				}
			} else {
				e.preventDefault();
				e.stopPropagation();
			}
		}
	});
	
	function checkProjectSetting(){
		var isOk = false;
		$.ajax({
			url: 'dgCenter/DgCheck.checkProjectSetting.json',
			type: 'post',
			async: false,
			data: {
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					isOk = true;
				}else{
					bdoInfoBox('提示', data.resultInfo.statusText);
				}
			}
		});
		return isOk;
	}
	
	$.setBdoAjaxSetup();

	$('#openXXRWindowBtn').click(function() {
		let keyword = '';
		if (window.xxrPageKey && window.xxrPageKey != '') {
			keyword = '&keyword=' + encodeURIComponent(window.xxrPageKey);
		}
		if (window.faithSystemId && window.faithSystemId != '') {
			faithSystemId = '$sysId=' + encodeURIComponent(window.faithSystemId);
		}
		window.open(window.xxrUrl + '?loginId=' + window.hrLoginId + '&token=' + window.xxrToken + keyword, '小杏仁', 'location=no,resizable=yes,scrollbars=yes,height=600,width=460');
	});


	window.$bdosnap.init();
	if(window.showHelp == 1 ){
		$('#mainVersionUpdateInfoModal').on('hidden.bs.modal', () => {
			$.ajax({
				type: 'post',
				url: 'cpBase/KUser.updateShowHelpByVerison.json',
				data: {
					param1: sys_userId
				},
				dataType: 'json',
				success: function(result) {
					if (result.success) {
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		$.ajax({
			url: 'cpBase/General.query.json',
			data: {
				sqlId: 'sys.S300017',
				menuId: window.sys_menuId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success && data.data.length > 0) {
					let $vsModel = $('#mainVersionUpdateInfoModal');
					let $vs = $('#mainVersionUpdateVs', $vsModel);
					let $info = $('#mainVersionUpdateInfo', $vsModel);
					let vs = data.data[0].version;
					let info = '<div style="min-height:250px;max-height: 550px;overflow-y: auto;text-align:left ">'+data.data[0].content+'</div>';
					$vs.empty().html(vs);
					$info.empty().html(info);
					$vsModel.modal('show');
					/*bdoConfirmBox2("更新内容"+data.data[0].version,text, function(confirm) {
						if(confirm) {
							$.ajax({
								type: 'post',
								url: 'cpBase/KUser.updateShowHelpByVerison.json',
								data: {
									param1: sys_userId
								},
								dataType: 'json',
								success: function(result) {
									if (result.success) {
									}else{
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}
					});*/
				}
			}
		});
	}else if(window.hasSacpCer != true) {
		let msg = '\t您未通过审计平台考核，请立即前往考试。题考通过后可以获得财务查询与分析模块权限，题考和机考通过后可以获得底稿中心权限和审计平台证书。';
		bdoConfirmBox('提示', msg, function(confirm) {
			if(confirm) {
				$('body').trigger('transferMenu', [{
					menuId: '40000087'
				}, function() {
				}]);
			}
		});
	}else if(window.sacpCerExpired > 10 && window.sacpCerExpired <= 30) {
		//$('#examCerExpired').html('证书即将到期，请前往考试。');
		let msg = '\t证书即将到期，请前往考试。';
		if(window.sacpCerExpiredDate != null && window.sacpCerExpiredDate != '') {
			msg = msg + '\t证书到期时间：' + window.sacpCerExpiredDate;
		}
		bdoInfoBox('提示', msg);
	}else if(window.sacpCerExpired >= 0 && window.sacpCerExpired <= 10) {
		let msg = '\t您的证书即将到期，请立即前往考试。题考通过后可以获得财务查询与分析模块权限，题考和机考通过后可以获得底稿中心权限和审计平台证书。';
		if(window.sacpCerExpiredDate != null && window.sacpCerExpiredDate != '') {
			msg = msg + '\t证书到期时间：' + window.sacpCerExpiredDate;
		}
		bdoConfirmBox('提示', msg, function(confirm) {
			if(confirm) {
				$('body').trigger('transferMenu', [{
					menuId: '40000087'
				}, function() {
				}]);
			}
		});
	}
	// 合并范围
	// var projectSourceDic = DicJsonlData.responseJSON['合并报表项目来源'];
	$.ajax({
		type: 'post',
		url: 'dgCenter/HbMergeProject.queryMergeProjectType.json',
		data: {
			lockCustomerId: window.CUR_CUSTOMERID,
			lockProjectId: window.CUR_PROJECTID
		},
		dataType: 'json',
		success: function(result) {
			if (result.success === true) {
				if (result.data && result.data[0]) {
					// let mergeScopeDic = DicJsonlData.responseJSON['合并范围'];
					$('#mergeScope').removeAttr("display");
					// DicVal2Nm(result.data[0].mergeScope, '合并范围');
					$('#mergeScope').html(DicVal2Nm(result.data[0].mergeScope, '合并范围'));
				} else {
					$('#mergeScope').css('display', 'none');
				}
			}
		}
	});
	// 是否合并项目bug 改为登陆加载的时候设置是否合并项目
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00061',
			param1: window.CUR_PROJECTID,
			param2: window.CUR_CUSTOMERID
		},
		dataType: 'json',
		success(data) {
			if (data.success) {
				if (data.data[0] != null && data.data[0] !== undefined) {
					$.sessionStorage('projectManager', (data.data[0].manager == null || data.data[0].manager === undefined) ? '0' : data.data[0].manager);
					$.sessionStorage('mergeType', data.data[0].mergeType);
				} else {
					$.sessionStorage('projectManager', 0);
					$.sessionStorage('mergeType', 0);
				}
			}
		}
	});
	// 合并项目列表
	var merge_project_table_view = {
		localParam: {
			tabNum: true,
			url: 'dgCenter/HbMergeProject.queryMergeProjectList.json',
			urlparam: {
				menuId: window.sys_menuId,
				lockCustomerId: window.CUR_CUSTOMERID,
				lockProjectId: window.CUR_PROJECTID
			}
		},
		tableParam: {
			select: true,
			scrollY: '300',
			lengthChange: true,
			ordering: false,
			serverSide: true,
			columnDefs: [{
				targets: 1,
				className: 'text-left',
				title: '客户名称',
				name: 'customerName',
				data: 'customerName',
				width: '150px'
			}, {
				targets: 2,
				className: 'text-left',
				title: '项目名称',
				name: 'projectName',
				data: 'projectName',
				width: '150px'
			}, {
				targets: 3,
				className: 'text-left',
				title: '项目来源',
				name: 'projectSource',
				data: 'projectSource',
				width: '100px',
				renderer: 'getDicLabelByVal|合并报表项目来源',
				render: function (data, type, row, meta) {
					return DicVal2Nm(data, '合并报表项目来源');
				}
				// render: function(data, type, row, meta) {
				// 	if(projectSourceDic[data] != null){
				// 		return projectSourceDic[data];
				// 	}else{
				// 		return data;
				// 	}
				// }
			}, {
				targets: 4,
				className: 'text-left',
				title: '项目负责人',
				name: 'projectManager',
				data: 'projectManager',
				width: '100px'
			}, {
				targets: 5,
				className: 'text-left',
				title: '合并范围',
				name: 'mergeScope',
				data: 'mergeScope',
				width: '50px',
				renderer: 'getDicLabelByVal|合并范围',
				render: function (data, type, row, meta) {
					return DicVal2Nm(data, '合并范围');
				}
				// render: function(data, type, row, meta) {
				// 	if(mergeScopeDic[data] != null){
				// 		return mergeScopeDic[data];
				// 	}else{
				// 		return data;
				// 	}
				// }
			}]
		}
	};
	$('#mergeScope').click(function() {
		$('#mergeProjectModal').modal('show');
		BdoDataTable('modal_merge_project_table', merge_project_table_view);
	});

	if(window.oteServer && window.systemId == 'SACP') {
		$('#sidebar').css('background-color', '#46c37b');
		$('#examSysTitle').show()
		$('#examSysTitle').css({
			"display": "block !important",
			"font-size": "16px",
			"padding": "8px",
			"color": "white",
			"background-color": "red",
			"position": "fixed",
			"top": "10px",
			"align-content": "center",
			"text-align": "center",
			"width": "120px",
			"left": "50%"
		});
	}else if(window.systemId == 'TCP') {
		$('#sidebar').css('background-color', '#7D6DA9');
		$('#faithlogo').css('background-image', 'url("bdolx/img/tcplogo.png")');
		$('#examSysTitle').hide();
	}else {
		$('#examSysTitle').hide();
	}
});

