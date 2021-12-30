/**
 * APT底稿
 */
var AptViewPage = (agrs) => {
	var _template
		, _data
		, currentNode
		, mount
		, listener
		, getHeight
		, transition // 过度效果接口
		, getExcelData // 获取excel 文件数据接口
		, spread // spread 实例
		, excelIo = new GC.Spread.Excel.IO() // spreadIo 实例
		, height = $('#main-container').height() - $('#pageHead').height() - 60 // 编辑区高度
		, dataURLtoFile // 文件数据类型转换接口
		, workpaperId
		, customerId
		, projectId
		, fileName
		, designer;

	_data = _data ? _data : agrs.data;
	currentNode = _data.currentNode;
	_template = agrs.template || tplLoader('aptView/html/aptView.html');
	agrs.template = _template;

	workpaperId = _data.extraOptions.workpaperId;
	customerId = _data.extraOptions.customerId;
	projectId = _data.extraOptions.projectId;
	fileName = _data.extraOptions.nodeName;

	if (height <= 0) {
		height = $('body').height() - 20;
	}
	/**
	 * begin
	 */

	var needSuspend;
	var tipWidth = 600;

	function getCustomizeStyle() {
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
			type: 'post',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00072',
				param1: customerId,
				param2: workpaperId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if (data.data && data.data[0] && (data.data[0].customizeStyle && data.data[0].customizeStyle != '')) {
						// 交叉索引
						designer.setShowMutualIndexCacheMap(JSON.parse(data.data[0].customizeStyle).ShowMutualIndexCacheMap);
						// 单向链接(左link)
						designer.setShowSingleLinkCacheMap(JSON.parse(data.data[0].customizeStyle).ShowSingleLinkCacheMap);
						// 抽凭附件链接(左link)
						designer.setShowAuditSamplingCacheMap(JSON.parse(data.data[0].customizeStyle).ShowAuditSamplingCacheMap);
					}
					if (data.data && data.data[0] && (data.data[0].dgValueInfo && data.data[0].dgValueInfo != '')) {
						// 底稿取值
						designer.setDgFetchCacheMap(JSON.parse(data.data[0].dgValueInfo).DgFetchCacheMap);
					}
					bdoSuccessBox('加载完成', data.resultInfo.statusText);
				}
			}
		});
	}
	// 标签Table
	var tagsMainTable = {
		localParam: {
			url: 'aptView/AptViewMain.getTags.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					// sqlId: 'DG00083',
					param1: customerId,
					param2: projectId,
					param4: '',
					param5: workpaperId,
					start: -1,
					limit: -1
				};
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
			pageLength: 30,
			scrollX: true,
			scrollY: '115px',
			select: false,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			// paging: false,
			fixedHeight: '400px',
			columnDefs: [{
				targets: 1,
				orderable: true,
				title: '标签',
				name: 'autoId',
				data: 'autoId',
				width: '60px',
					render: function(data, type, row, meta) {
						let renderStr = 'p' + data;
						return renderStr;
					}
			}, {
				targets: 2,
				orderable: true,
				title: '标签名',
				name: 'tagName',
				data: 'tagName',
				width: '100px'
			}, {
				targets: 3,
				orderable: true,
				title: '标签属性',
				className: 'text-center',
				name: 'tagProperty',
				data: 'tagProperty',
				renderer: 'getDicLabelByVal|标签属性',
				width: '60px',
				render(data) {
					return DicVal2Nm(data, '标签属性');
				}
			}, {
				targets: 4,
				orderable: true,
				title: '标签类型',
				className: 'text-center',
				name: 'tagType',
				data: 'tagType',
				renderer: 'getDicLabelByVal|标签类型',
				width: '60px',
				render(data) {
					return DicVal2Nm(data, '标签类型');
				}
			}, {
				targets: 5,
				orderable: true,
				title: '位置',
				name: 'otherPosition',
				data: 'otherPosition',
				width: '100px'
			}, {
				targets: 6,
				orderable: true,
				title: '详细位置',
				name: 'tagPosition',
				data: 'tagPosition',
				width: '100px'
			}, {
				targets: 7,
				orderable: true,
				className: 'text-right',
				title: '标签值',
				name: 'tagValue',
				data: 'tagValue',
				width: '80px',
				render: function(data, type, row, meta) {
					let renderStr = formatMoney(data);
					return renderStr;
				}
			}, {
				targets: 8,
				name: 'tagDgId',
				data: 'tagDgId',
				visible: false
			}, {
				targets: 9,
				name: 'tagInfo',
				data: 'tagInfo',
				visible: false
			}
			]
		}
	};
	// 公式Table
	var formulaTable = {
		localParam: {
			url: 'aptView/AptViewMain.getFormulas.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					// sqlId: 'DG00114',
					param1: customerId,
					param2: projectId,
					param3: workpaperId,
					param4: $('#formulaTypeMain').val(),
					start: -1,
					limit: -1
				};
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
			pageLength: 30,
			scrollX: true,
			scrollY: '240px',
			select: false,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			// paging: false,
			fixedHeight: '400px',
			columnDefs: [{
				targets: 1,
				orderable: true,
				className: 'text-center',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '60px'
			}, {
				targets: 2,
				orderable: true,
				className: 'text-center',
				title: '科目名称',
				name: 'subjectName',
				data: 'subjectName',
				width: '60px',
				render: function(data, type, row, meta) {
					if(data){
						renderStr = '<label>' + data + '</label>';
					}else{
						renderStr = '<label></label>';
					}
					return renderStr;
				}
			}, {
				targets: 3,
				orderable: true,
				className: 'text-center',
				title: '公式类型',
				name: 'formulaType',
				data: 'formulaType',
				renderer: 'getDicLabelByVal|校验公式类型',
				width: '100px',
				render(data) {
					return DicVal2Nm(data, '校验公式类型');
				}
			}, {
				targets: 4,
				orderable: true,
				className: 'text-center',
				title: '公式属性',
				name: 'formulaProperty',
				data: 'formulaProperty',
				renderer: 'getDicLabelByVal|校验公式属性',
				width: '60px',
				render(data) {
					return DicVal2Nm(data, '校验公式属性');
				}
			}, {
				targets: 5,
				orderable: true,
				title: '公式',
				name: 'formula',
				data: 'formula',
				width: '100px',
				render: function(data, type, row, meta) {
					var pAutoId = data.split(/[\+\-\=]+/);
					var sign = data.split(/[^\+\-\=]+/).splice(1, data.split(/[^\+\-\=]+/).length - 2);
					var text = row.formulaText.split(/[\+\-\=]+/);
					var renderStr = '<a name="tag" href="#" title="' + text[0] + '">' + pAutoId[0];
					for(let i = 1;i < pAutoId.length;i++){
						renderStr += '</a><label>' + sign[i - 1] + '</label><a name="tag" href="#" title="' + text[i] + '">' + pAutoId[i];
					}
					renderStr += '</a>';
					return renderStr;
				}
			}, {
				targets: 6,
				orderable: true,
				title: '公式信息',
				name: 'formulaText',
				data: 'formulaText',
				width: '100px',
				render: function(data, type, row, meta) {
					renderStr = '<label>' + data + '</label>';
					return renderStr;
				}
			}, {
				targets: 7,
				orderable: true,
				title: '公式值',
				name: 'formulaValue',
				data: 'formulaValue',
				width: '100px',
				render: function(data, type, row, meta) {
					renderStr = '<label>' + data + '</label>';
					return renderStr;
				}
			}, {
				targets: 8,
				orderable: true,
				className: 'text-center',
				title: '公式校验结果',
				name: 'formulaCalc',
				data: 'formulaCalc',
				width: '80px',
				render: function(data, type, row, meta) {
					if (data == 1) {
						let renderStr = '<span class=\"label label-success\"><i class=\"fa fa-check\"></i> 通过</span>';
						return renderStr;
					} else if (data == 0) {
						let renderStr = '<span class=\"label label-danger\"><i class=\"fa fa-times\"></i> 未通过</span>';
						return renderStr;
					}
				}
			}, {
				targets: 9,
				orderable: true,
				title: '校验时间',
				name: 'updateTime',
				data: 'updateTime',
				width: '100px',
				render(data) {
					return new Date(data).format('yyyy-MM-dd HH:mm:ss');
				}
			}, {
				targets: 10,
				name: 'autoId',
				data: 'autoId',
				visible: false
			}
			]
		}
	};
	// 底稿附件Table
	var dgPageAttachTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG00242',
				param1: customerId,
				param2: workpaperId
			},
			tabNum: true
		},
		tableParam: {
			pageLength: 30,
			scrollX: true,
			scrollY: '320px',
			select: false,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			// paging: false,
			fixedHeight: '480px',
			columnDefs: [{
				targets: 1,
				orderable: false,
				className: 'text-center',
				title: '处理',
				data: null,
				width: '50px',
				render: function(data, type, row, meta) {
					var fileType = data.suffix.toLowerCase();
					var renderStr = '';
					renderStr += '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="downloadDgAttach" data-placement="top" title="下载" data-toggle="tooltip" data-row="' + meta.row + '">'
						+ '	<i class="fa fa-download"></i>'
						+ '</button>';
					if (fileType == 'pdf' || fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'xlsx') {
						renderStr += '<button class="btn btn-xs table-btn-operate btn-primary" type="button" name="onlinepreview" data-placement="top" title="在线预览" data-toggle="tooltip" data-row="' + meta.row + '">'
							+ '	<i class="fa fa-eye"></i>'
							+ '</button>';
					}
					return renderStr;
				}
			}, {
				targets: 2,
				orderable: true,
				title: '索引号',
				name: 'fileIndexId',
				data: 'fileIndexId',
				width: '100px'
			}, {
				targets: 3,
				orderable: true,
				title: '底稿名称',
				name: 'dgName',
				data: 'dgName',
				width: '150px'
			}, {
				targets: 4,
				orderable: true,
				title: '文件名称',
				name: 'fileName',
				data: 'fileName',
				width: '150px'
			}, {
				targets: 5,
				orderable: true,
				className: 'text-center',
				title: '是否被关联',
				name: 'referredFlg',
				data: 'referredFlg',
				width: '60px',
				render: function(data, type, row, meta) {
					var renderStr = data == 1 ? '是' : '否';
					return renderStr;
				}
			}, {
				targets: 6,
				orderable: true,
				className: 'text-center',
				title: '上传时间',
				name: 'uploadDate',
				data: 'uploadDate',
				width: '90px',
				render: function(data, type, row, meta) {
					return formatSimDate(new Date(data));
				}
			}, {
				targets: 7,
				orderable: true,
				className: 'text-center',
				title: '上传人',
				name: '__uuploadUserName',
				data: '__uuploadUserName',
				width: '50px'
			}]
		}
	};
	// 抽凭附件Table
	var samplingAttachTable  = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'DG00328',
				param1: customerId,
				param2: projectId,
				param3: _data.extraOptions.userSubjectId,
				start: -1,
				limit: -1
			},
			tabNum: true
		},
		tableParam: {
			pageLength: 30,
			scrollX: true,
			scrollY: '300px',
			select: false,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			// paging: false,
			fixedHeight: '460px',
			columnDefs: [{
				targets: 1,
				className: 'text-left',
				title: '文件索引号',
				name: 'fileIndexId',
				data: 'fileIndexId',
				width: '80px'
			}, {
				targets: 2,
				className: 'text-left',
				title: '文件名称',
				name: 'fileName',
				data: 'fileName',
				width: '120px'
			}, {
				targets: 3,
				orderable: true,
				title: '操作',
				className: 'text-center',
				name: 'operate',
				data: 'tagName',
				width: '40px',
				render: function(data, type, row, meta) {
					let renderStr = '<button class="btn btn-xs table-btn-operate btn-primary" name="openSamplingAttachFile" type="button" title="打开抽凭附件" data-row="' + meta.row + '"><i class="fa fa-eye"></i></button>';
					return renderStr;
				}
			}, {
				targets: 4,
				name: 'autoId',
				data: 'autoId',
				visible: false
			}, {
				targets: 5,
				name: 'subjectentryId',
				data: 'subjectentryId',
				visible: false
			}, {
				targets: 6,
				name: 'suffix',
				data: 'suffix',
				visible: false
			}]
		}
	};
	
	function updateLayout() {
		var $spreadContainer = $('#spreadContainer');
		var $spreadWrapper = $('.spreadWrapper', $spreadContainer);
		$spreadContainer.css('position', 'relative');
		$spreadWrapper.css('height', (getHeight() - 105) + 'px');
		$spreadWrapper.css('position', 'relative');
		$('.ss.gc-no-user-select', $spreadWrapper).css('position', 'relative');
		$('.header').css('width', '100%');
		if ($('.ribbon-bar').data('gcui-gcuiribbon')) {
			$('.ribbon-bar').data('gcui-gcuiribbon').updateRibbonSize();
		}
		//designer.wrapper.reset();
		spread = designer.Spread;
		let refreshFlg = true;
		if (spread && spread.isPaintSuspended()) {
			spread.resumePaint();
			spread.refresh();
			needSuspend = true;
			refreshFlg = false;
		}
		if (refreshFlg && spread) {
			spread.refresh();
		}
	}

	var _windowResizeTimer = null;

	function _doWindowResize() {
		if (_windowResizeTimer) {
			window.clearTimeout(_windowResizeTimer);
		}
		_windowResizeTimer = window.setTimeout(function() {
			updateLayout();
			_windowResizeTimer = null;
			if (needSuspend) {
				needSuspend = false;
				window.setTimeout(function() {
					designer.Spread.suspendPaint();
				}, 300);
			}
		}, 100); //now delay 100ms to resize designer
	}
	
	function designeReadied() {
		//To Fix the designer resize performance issues.
		$(window).unbind('resize.gcuiribbon');
		$('#verticalSplitter').show();
		updateLayout();
	}
	
	var ready = function() {
		designer = initDesignerSecondDg(_data);
		
		designeReadied();
		window.$bdosnap.init();
		//designer.loader.loadContent($('#spreadContainerRoot'));
		$(window).resize(_doWindowResize);
		$(window).resize();

		$('#verticalSplitter').draggable({
			axis: 'y',
			containment: '#spreadContainer',
			scroll: false,
			zIndex: 100,
			stop: function(event, ui) {
				var $this = $(this), top = $this.offset().top, offset = top - $('.header').height(),
					$content = $('.content .fill-spread-content');

				// adjust size of related items
				var oldHeight = $('#formulaBarText').height();
				var newHeight = oldHeight + offset;
				var ORIGINAL_FORMULABARTEXT_HEIGHT = 20;
				if (newHeight < ORIGINAL_FORMULABARTEXT_HEIGHT) { // 20: original height of formulaBarText
					// reset to default
					$('#formulaBarText').css({height: ORIGINAL_FORMULABARTEXT_HEIGHT});
					top = top + ORIGINAL_FORMULABARTEXT_HEIGHT - newHeight;
				} else {
					$('#formulaBarText').css({height: newHeight});
				}
				$content.css({top: top + 10}); // 10: height of the space for verticalSplitter
				$content.parent().css({height: $content.height()});
				$('.header').css({height: top});
				$this.css({top: 0});
				designer.Spread.refresh();
			}
		});

		function disableDragDrop(dataTransfer) {
			if (dataTransfer) {
				dataTransfer.effectAllowed = 'none';
				dataTransfer.dropEffect = 'none';
			}
		}

		window.addEventListener('dragenter', function(e) {
			e = e || event;
			e.preventDefault();
			disableDragDrop(e.dataTransfer);
		}, false);
		window.addEventListener('dragover', function(e) {
			e = e || event;
			e.preventDefault();
			disableDragDrop(e.dataTransfer);
		}, false);
		window.addEventListener('drop', function(e) {
			e = e || event;
			e.preventDefault();
			disableDragDrop(e.dataTransfer);
		}, false);
	};
	
	/**
	 * end
	 */

	/**
	 * 事件绑定
	 */
	listener = () => {
		$('.progress-mark').on('toggle-progress', (event1, event2) => {
			switch (event2) {
				case 'show':
					$('#contentBlock').addClass('block-opt-cus-refresh');
					//$('#contentBlock').addClass('block-opt-refresh');
					break;
				case 'hide':
					$('#contentBlock').removeClass('block-opt-cus-refresh');
					//$('#contentBlock').removeClass('block-opt-refresh');
					break;
			}
		});
		/**
		 * 退出系统
		 */
		$('#logoutBtn').click((event) => {
			$.sessionStorage('userNm', selfNm);
			$.sessionStorage('loginId', loginId);
			window.parent.location.href = 'bdologin.do?m=exitSystem';
		});
		/**
		 * 导出
		 */
		$('#exportExcelBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgWapper.havePermission.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: workpaperId
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						transition(() => {
							exportExcel();
						});
					} else {
						bdoInfoBox('提示', '只有项目负责人或程序控制表中设置的底稿编制人才能导出该底稿!');
					}
				}
			});
		});
		/**
		 * 批注
		 */
		$('#postilBtn').click((event) => {
			PostilPage({
				region: '#sideRegin',
				data: _data,
				type: 'DG-' + _data.extraOptions.indexId,
				foreignId: _data.extraOptions.autoId,
				customerId: customerId,
				projectId: projectId
			});
			$('#sideRegin').show();
		});
		/**
		 * 校验公式
		 */
		$('#openFormulaModalBtn').click(e => {
			$('#formulaSubjectId').val(designer.userSubjectId);
			$('#formulaSubjectName').val(designer.userSubjectId + '-' + designer.userSubjectName);
			$('#formulaModal').modal('show');
		});
		$('#formulaModal').on('show.bs.modal', function() {
			BdoDataTable('tagsMainTable', tagsMainTable);
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: customerId,
					param2: projectId,
					param3: 'DG',
					param4: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							var referredAutoId = data.data[0].infoFormula;
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00229',
									param1: customerId,
									param2: projectId,
									param3: referredAutoId,
									param4: $('#formulaTypeMain').val(),
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										if (data.data[0] != null) {
											$('#totalNumMain').html(data.data[0].totalNum);
											$('#rightNumMain').html(data.data[0].rightNum);
											BdoDataTable('formulaTable', formulaTable);
										}
									}
								}
							});
						}
					}
				}
			});
		});
		$('#formulaModal [data-toggle="tabs"] a').on('show.bs.tab', function(evt) {
			let href = evt.target.href;
			let index = href.lastIndexOf('#');
			let id = href.substring(index + 1);
			switch (id) {
				case 'tagMainTab':
					$('#tagsMainTable').DataTable().ajax.reload();
					break;
				case 'formulaMainTab':
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						// async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00113',
							param1: customerId,
							param2: projectId,
							param3: 'DG',
							param4: workpaperId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if (data.data[0] != null) {
									var referredAutoId = data.data[0].infoFormula;
									$.ajax({
										type: 'post',
										url: 'dgCenter/DgGeneral.query.json',
										// async: false,
										data: {
											menuId: window.sys_menuId,
											sqlId: 'DG00229',
											param1: customerId,
											param2: projectId,
											param3: referredAutoId,
											param4: $('#formulaTypeMain').val(),
											start: -1,
											limit: -1
										},
										dataType: 'json',
										success(data) {
											if (data.success) {
												if (data.data[0] != null) {
													$('#totalNumMain').html(data.data[0].totalNum);
													$('#rightNumMain').html(data.data[0].rightNum);
													$('#formulaTable').DataTable().ajax.reload();
												}
											}
										}
									});
								}
							}
						}
					});
					break;
				default:
					break;
			}
		});
		$('#tagTypeMain').change((event) => {
			tagsMainTable.localParam.urlparam.param4 = $('#tagTypeMain').val();
			$('#tagsMainTable').DataTable().ajax.reload();
		});
		$('#tagSortMain').change((event) => {
			if($('#tagSortMain').val() == 'dg'){
				tagsMainTable.localParam.urlparam.param5 = workpaperId;
			} else if($('#tagSortMain').val() == 'subject'){
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00234',
						param1: customerId,
						param2: projectId,
						param3: workpaperId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if (data.data[0] != null) {
								var autoIdStr = '';
								for(var i = 0;i < data.data.length;i++){
									autoIdStr = autoIdStr + ',' + data.data[i].autoId;
								}
								tagsMainTable.localParam.urlparam.param5 = autoIdStr.substring(1);
							}
						}
					}
				});
			} else {
				tagsMainTable.localParam.urlparam.param5 = '';
			}
			$('#tagsMainTable').DataTable().ajax.reload();
		});
		$('#formulaMainTab').on('click', 'a[class="tableRefresh"]', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: customerId,
					param2: projectId,
					param3: 'DG',
					param4: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							var referredAutoId = data.data[0].infoFormula;
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00229',
									param1: customerId,
									param2: projectId,
									param3: referredAutoId,
									param4: $('#formulaTypeMain').val(),
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										if (data.data[0] != null) {
											$('#totalNumMain').html(data.data[0].totalNum);
											$('#rightNumMain').html(data.data[0].rightNum);
										}
									}
								}
							});
						}
					}
				}
			});
		});
		$('#formulaTypeMain').change((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: customerId,
					param2: projectId,
					param3: 'DG',
					param4: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							var referredAutoId = data.data[0].infoFormula;
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00229',
									param1: customerId,
									param2: projectId,
									param3: referredAutoId,
									param4: $('#formulaTypeMain').val(),
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										if (data.data[0] != null) {
											$('#totalNumMain').html(data.data[0].totalNum);
											$('#rightNumMain').html(data.data[0].rightNum);
											formulaTable.localParam.urlparam.param4 = $('#formulaTypeMain').val();
											$('#formulaTable').DataTable().ajax.reload();
										}
									}
								}
							});
						}
					}
				}
			});
		});
		$('#formulaTable').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00235',
					param1: tagid,
					param2: customerId,
					param3: projectId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							var tagInfo = JSON.parse(data.data[0].tagInfo)[0];
							if(tagInfo.type == 'dg'){
								if(workpaperId != tagInfo.workpaperId){
									// 0:D13
									var formula = tagInfo.tagPosition.substring(tagInfo.tagPosition.indexOf(':') + 1);
									// session节点 跳转到指定单元格 --> designer.setCellLink()
									$.sessionStorage('cellLinkFormula', JSON.stringify(formula));
									openDgFile(tagInfo.workpaperId, tagInfo.paperIndexId, tagInfo.fileName);
								}
							} else if(tagInfo.type == 'note'){
								// 0:D13
								var formula = tagInfo.tagPosition.substring(tagInfo.tagPosition.indexOf(':') + 1);
								// session节点 跳转到指定单元格 --> designer.setCellLink()
								$.sessionStorage('cellLinkFormula', JSON.stringify(formula));
								openNoteFile(tagInfo.noteAutoId, tagInfo.noteNo, tagInfo.fileName);
							} else if(tagInfo.type == 'db'){
								var yyyy = tagInfo.whereParam.substr(tagInfo.whereParam.indexOf('yyyy') + 7, 4);
								var text = '该标签为试算平衡表"' + tagInfo.subjectName + '"的"' + yyyy;
								var field = tagInfo.field;
								if(field == 'unAuditAmount'){
									text += '年未审数';
								}else if(field == 'adjustAmount'){
									text += '年审计调整数';
								}else if(field == 'auditAmount'){
									text += '年审定数"';
								}
								swal(text);
							} else if(tagInfo.type == 'function'){
								var field = tagInfo.field;
								var yyyy = 0;
								if(field.indexOf('current') != -1){
									yyyy = parseInt(tagInfo.yyyy);
								} else {
									yyyy = parseInt(tagInfo.yyyy) - 1;
								}
								var text = '';
								if(field.indexOf('Before') != -1){
									text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '未审数"';
								}else if(field.indexOf('Adjust') != -1){
									text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '调整数"';
								}else if(field.indexOf('After') != -1){
									text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '审定数"';
								}
								swal(text);
							} else if(tagInfo.type == 'report'){
								var text = '该标签为报表"' + tagInfo.colName + tagInfo.colCode + '"的"' + tagInfo.reportValDesc + '"';
								swal(text);
							} else if(tagInfo.type == 'auditReport'){
								// 0:D13
								var formula = tagInfo.tagPosition.substring(tagInfo.tagPosition.indexOf(':') + 1);
								// session节点 跳转到指定单元格 --> designer.setCellLink()
								$.sessionStorage('cellLinkFormula', JSON.stringify(formula));
								openDgFile(tagInfo.workpaperId, 'P005-CF001', tagInfo.fileName);
							}
						}
					}
				}
			});
		});
		/**
		 * 打开底稿附件对话框
		 */
		$('#openDgAttachBtn').click(e => {
			$('#dgAttachModal').modal('show');
		});
		$('#dgAttachModal').on('show.bs.modal', function() {
			BdoDataTable('dgPageAttachTable', dgPageAttachTable);
		});
		/**
		 * 底稿附件下载
		 */
		$('#dgPageAttachTable').on('click', 'button.table-btn-operate[name="downloadDgAttach"]', event => {
			var table = $('#dgPageAttachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			//下载底稿附件
			downloadFile('dgCenter/DgDownload.downloadAttach.json', {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: rowData.autoId,
				param2: rowData.customerId
			});
		});
		/**
		 * 底稿附件预览
		 */
		$('#dgPageAttachTable').on('click', 'button.table-btn-operate[name="onlinepreview"]', event => {
			var table = $('#dgPageAttachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			$.ajax({
				url: 'dgCenter/DgMain.queryAttachFileExistence.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: rowData.autoId,
					param2: rowData.customerId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						var fileSuffix = rowData.fileName.substring(rowData.fileName.lastIndexOf(".") + 1).toLowerCase();
						if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" ) {
							window.open('dgCenter/DgPaper.previewFile.json?param1=' + rowData.autoId + '&param2=type1' + '&param3=' + rowData.fileName ,rowData.fileName , 'location=no');
						} else if (fileSuffix === "xlsx"){
							rowData.pageType = 1;
							var nodeData = {
								extraOptions: rowData,
								currentNode: {
									extraOptions: rowData
								}
							};
							$.sessionStorage('fileNode', JSON.stringify(nodeData));
							window.open('/Faith/dgcenter.do?m=previewFile');
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		/**
		 * 打开抽凭附件对话框
		 */
		$('#openSamplingAttachBtn').click(e => {
			$('#samplingAttachModal').modal('show');
		});
		$('#samplingAttachModal').on('show.bs.modal', function() {
			BdoDataTable('samplingAttachTable', samplingAttachTable);
		});
		/**
		 * 抽凭附件预览
		 */
		$('#samplingAttachTable').on('click', 'button.table-btn-operate[name="openSamplingAttachFile"]', event => {
			var table = $('#samplingAttachTable').dataTable();
			var rowData = table.fnGetData($(event.currentTarget).attr('data-row'));
			// pdf、jpg、png、jpeg预览 xlsx打开
			// 其他文件格式提示下载
			var id = rowData.autoId;
			var fileSuffix = rowData.suffix.toLowerCase();
			if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" || fileSuffix === "xlsx") {
				$.ajax({
					type : "post",
					url: 'dgCenter/DgGeneral.query.json',
					// async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00329',
						param1: customerId,
						param2: projectId,
						param3: id,
						start: -1,
						limit: -1
					},
					dataType : "json",
					success(data) {
						if(data.success) {
							if(data.data[0].num > 0){
								if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg") {
									window.open('dgCenter/DgPaper.previewFile.json?param1=' + id + '&param2=type2' + '&param3=' + rowData.fileName, rowData.fileName,'location=no');
								}else if(fileSuffix === "xlsx"){
									var param = {
										customerId: customerId,
										projectId: projectId,
										autoId: id,
										pageType: 2,
										fileName: rowData.fileName
									};
									var nodeData = {
										extraOptions: param,
										currentNode: {
											extraOptions: param
										}
									};
									$.sessionStorage('fileNode', JSON.stringify(nodeData));
									window.open('/Faith/dgcenter.do?m=previewFile');
								}
							}else{
								bdoErrorBox('失败', '抽凭附件不存在！');
							}
						}
					}
				});
			} else {
				downloadFile('dgCenter/DgDownload.downloadDgAttachFile.json', {param1: id, param2: customerId, param3: 'type2'});
			}
		});
	};

	/**
	 * 挂载
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);
		//setHeight();
		listener();
		transition(() => {
			getExcelData({
				menuId: window.sys_menuId,
				param1: workpaperId,
				param2: customerId,
				param3: projectId
			});
		});
		OneUI.initHelper('slimscroll');
		ready();
	};

	/**
	 * 过渡效果
	 */
	transition = callback => {
		$('.progress-mark').trigger('toggle-progress', 'show');
		var timer;
		var doIt = () => {
			timer && clearTimeout(timer);
			callback && callback();
			$('.progress-mark').trigger('toggle-progress', 'hide');
		};
		timer = setTimeout(doIt, 500);
	};
	/**
	 * 设置高度
	 */
	getHeight = () => {
		var icon = $('#fullscreenBtn').find('i');
		var fullscreenFlg = icon.hasClass('si-size-actual');
		if (fullscreenFlg) {
			return height + 85;
		} else {
			return height + 25;
		}
	};

	/**
	 * 转base64 成文件格式
	 */
	dataURLtoFile = (dataString, filename) => {
		var dl = dataString.indexOf('base64,') + 'base64,'.length;
		if (dl > 'base64,'.length) {
			dataString = dataString.substring(dl);
		}
		var mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			bstr = atob(dataString),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, {
			type: mime,
			name: filename
		});
	};

	/**
	 * 获取文件
	 */
	getExcelData = (param) => {
		spread = designer.Spread;
		$.ajax({
			url: 'aptView/AptViewMain.getWorkpaper.json',
			type: 'POST',
			data: param,
			dataType: 'json',
			success(data) {
				if (data.success) {
					var excel = data.data[0].excelBase64Data;
					var file = dataURLtoFile(excel, param.param1);
					excelIo.open(file, json => {
						var workbookObj = json;
						workbookObj = updateUsedRange(json);
						var jsonOptions = {
							incrementalLoading: true
						}
						spread.fromJSON(workbookObj, jsonOptions);
						spread.setActiveSheetIndex(0);
						for (var i = 0; i < spread.getSheetCount(); i++) {
							if(spread.getSheet(i).getColumnCount() < 20){
								spread.getSheet(i).setColumnCount(20);
							}else{
								spread.getSheet(i).setColumnCount(spread.getSheet(i).getColumnCount() + 5);
							}
							spread.getSheet(i).setRowCount(spread.getSheet(i).getRowCount() + 5);
						}
						getCustomizeStyle();
					});
				} else {
					/*$('#exportExcelBtn').attr('disabled', true);
					$('#coverBtn').attr('disabled', true);
					$('#postilBtn').attr('disabled', true);
					$('#openFormulaModalBtn').attr('disabled', true);
					$('#openDgAttachBtn').attr('disabled', true);
					$('#openSamplingAttachBtn').attr('disabled', true);*/
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	};

	/**
	 * 导出文件
	 */
	exportExcel = () => {
		if (!currentNode) {
			return;
		}
		var json = spread.toJSON();
		excelIo.save(json, blob => {
			saveAs(blob, fileName);
		}, e => {
			bdoErrorBox('失败', e.errorMessage);
		});
	};

	function formatSimDate(now) {
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		month = month < 10 ? ('0' + month) : month;
		var date = now.getDate();
		date = date < 10 ? ('0' + date) : date;
		var hour = now.getHours();
		hour = hour < 10 ? ('0' + hour) : hour;
		var minute = now.getMinutes();
		minute = minute < 10 ? ('0' + minute) : minute;
		var second = now.getSeconds();
		second = second < 10 ? ('0' + second) : second;
		return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
	}
	mount();

};