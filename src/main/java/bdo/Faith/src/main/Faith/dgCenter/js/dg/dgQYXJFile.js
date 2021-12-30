/**
 * 所有者权益变动表及现金流量表在线底稿
 */
var DgQYXJFilePage = (agrs) => {
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
		, blobToDataURL // 文件数据类型转换接口
		, saveExcel // 保存 excel 文件接口
		, saveExcelServer // 保存excel 接口
		, storage = window.localStorage // 浏览器缓存接口
		, storageId
		, storageStatus
		, storageTime
		, exportExcel // 导出 excel 文件接口
		, importExcel // 导入 excel 文件接口
		, customerId
		, projectId
		, workpaperId
		, fileName
		, referredAutoId
		, designer
		, dgQYXJImportForm;

	_data = _data ? _data : agrs.data;
	currentNode = _data.currentNode;
	_template = agrs.template || tplLoader('dgCenter/html/dg/dgQYXJFile.html');
	agrs.template = _template;

	workpaperId = _data.extraOptions.workpaperId;
	customerId = _data.extraOptions.customerId;
	projectId = _data.extraOptions.projectId;
	fileName = _data.extraOptions.fileName;
	storageId = 'BDO' + workpaperId;
	storageStatus = 'BDO' + workpaperId + 'Status';
	storageTime = 'BDO' + workpaperId + 'Time';
	if (height <= 0) {
		height = $('body').height() - 20;
	}
	
	/**
	 * begin
	 */
	
	// 校验公式Table
	var formulaTable;
	// 核对公式Table
	var verifyTable;
	// 关联方Table
	var merchantRelatedTable;
	function loadTable(){
		formulaTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00114',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: '',
						param5: $('#formulaCalc').val(),
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
				scrollY: '355px',
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
					title: '公式类型',
					name: 'formulaType',
					data: 'formulaType',
					renderer: 'getDicLabelByVal|校验公式类型',
					width: '100px',
					render(data) {
						return DicVal2Nm(data, '校验公式类型');
					}
				}, {
					targets: 2,
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
					targets: 3,
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
					targets: 4,
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
					targets: 5,
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
					targets: 6,
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
					targets: 7,
					orderable: true,
					title: '校验时间',
					name: 'updateTime',
					data: 'updateTime',
					width: '100px',
					render(data) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 8,
					name: 'autoId',
					data: 'autoId',
					visible: false
				}
				]
			}
		};
		verifyTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00368',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: 'AUDITREPORT',
						param4: workpaperId,
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
				scrollY: '355px',
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
					targets: 2,
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
					targets: 3,
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
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '公式核对结果',
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
					targets: 5,
					orderable: true,
					title: '公式核对备注',
					name: 'checkRemark',
					data: 'checkRemark',
					width: '120px'
				}, {
					targets: 6,
					orderable: true,
					title: '核对时间',
					name: 'updateTime',
					data: 'updateTime',
					width: '100px',
					render(data) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 7,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'operate',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr = '<button class="btn btn-xs btn-success" name="editRemark" type="button" title="填写备注"><i class="fa fa-edit"></i></button>';
						return renderStr;
					}
				}]
			}
		};
		merchantRelatedTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00426',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
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
				scrollY: '355px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '400px',
				columnDefs: [{
					targets:1,
					orderable: false,
					className: 'text-center',
					width:'50px',
					title:'<label class="css-input css-checkbox css-checkbox-primary">'
						+	'<input type="checkbox" name="checkMerchantRelatedAll"/>'
						+	'<span></span>'
						+'</label>',
					render(data, type, row, meta) {
						let renderStr = '<label class="css-input css-checkbox css-checkbox-primary">' 
							+	'<input type="checkbox" name="checkMerchantRelated" value="' + row.autoId + '"/>'
							+	'<span></span>'
							+'</label>';
						return renderStr;
					}
				} ,{
					targets: 2,
					title: '客户',
					name: 'mergeCustomer',
					data: 'mergeCustomer',
					className: 'text-left',
					 width:'300px'
				}, {
					targets: 3,
					title: '项目',
					name: 'mergeProject',
					data: 'mergeProject',
					className: 'text-left',
					width:'350px'
				}, {
					targets: 4,
					title: '公司简称',
					name: 'shortName',
					data: 'shortName',
					className: 'text-left',
					width:'150px'
				}]
			}
		};
	}
	
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
			success: function(data){
				if(data.success) {
					if (data.data && data.data[0] && (data.data[0].customizeStyle && data.data[0].customizeStyle != '')) {
						designer.setCashFlowCacheMap(JSON.parse(data.data[0].customizeStyle).CashFlowCacheMap, {sheet: 0});
					}
					// 设置活动单元格
					if ($.sessionStorage('cellLinkFormula') != null || $.sessionStorage('cellLinkFormulaBySheetName') != null) {
						designer.setCellLink();
					}
					bdoSuccessBox('加载完成', data.resultInfo.statusText);
				}
			}
		});
	}

	function updateLayout() {
		var $spreadContainer = $('#spreadContainer');
		var $spreadWrapper = $('.spreadWrapper', $spreadContainer);
		$spreadContainer.css('position', 'relative');
		$spreadWrapper.css('height', (getHeight() - 255) + 'px');
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
		if(_data.extraOptions.fileName.indexOf('现金流量表.xlsx') > -1){
			_data.extraOptions.tableDiv = 4;
			_data.currentNode.extraOptions.tableDiv = 4;
		}else{
			_data.extraOptions.tableDiv = 5;
			_data.currentNode.extraOptions.tableDiv = 5;
		}
		if(_data.extraOptions.tableDiv == 4){
			designer = initDesignerQyXj_1(_data);
		}else if(_data.extraOptions.tableDiv == 5 || _data.extraOptions.tableDiv == 6){
			designer = initDesignerQyXj_2(_data);
			// 若不为现金流量表时，不显示按钮--关联方
			$('#merchantRelatedModalBtn').remove();
		}
		loadTable();
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
		$('#saveExcelBtn').click((event) => {
			bdoInProcessingBox('保存中');
			transition(() => {
				var json = spread.toJSON();
				saveExcel(json);
			});
		});

		$('#exportExcelBtn').click((event) => {
			transition(() => {
				exportExcel();
			});
		});

		$('#importExcelBtn').click((event) => {
			transition(() => {
				importExcel();
			});
		});

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

		$('#coverBtn').click((event) => {
			if (!currentNode) {
				return;
			}
			getExcelData({
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: workpaperId,
				param2: customerId
			});
		});
		// 重新生成
		$('#reCreateBtn').click((event) => {
			bdoConfirmBox('提示', '是否重新生成' + fileName + '？', function() {
				bdoInProcessingBox('重新生成中');
				$.ajax({
					url: 'dgCenter/DgAuditFile.reCreateFile.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: workpaperId,
						param2: customerId,
						param3: projectId,
						param4: window.CUR_PROJECT_ACC_YEAR,
						param5: _data.extraOptions.tableDiv
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							getExcelData({
								menuId: window.sys_menuId,
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: workpaperId,
								param2: customerId
							});
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		// 重新取值
		$('#resetBtn').click((event) => {
			bdoInProcessingBox('重新取值中');
			$.ajax({
				url: 'dgCenter/DgAuditFile.resetFile.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: workpaperId,
					param2: customerId,
					param3: projectId,
					param4: window.CUR_PROJECT_ACC_YEAR,
					param5: _data.extraOptions.tableDiv
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						getExcelData({
							menuId: window.sys_menuId,
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: workpaperId,
							param2: customerId
						});
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		// 批注
		$('#postilBtn').click((event) => {
			PostilPage({
				region: '#sideRegin',
				data: _data,
				type: 'QYXJ-' + _data.extraOptions.fileIndexId,
				foreignId: _data.extraOptions.workpaperId,
				customerId: _data.extraOptions.customerId,
				projectId: _data.extraOptions.projectId
			});
			$('#sideRegin').show();
		});
		// 打开上期底稿
		$('#openPreBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00230',
					param1: customerId,
					param2: projectId,
					param3: _data.extraOptions.fileIndexId,
					param4: fileName,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null && data.data[0].autoId != null) {
							var dgFileId = data.data[0].autoId;
							var preCustomerId = data.data[0].customerId;
							var preProjectId = data.data[0].projectId;
							setExcelnode(preCustomerId, preProjectId, dgFileId);
							var excelnode = designer.excelnode;
							$.sessionStorage('excelxjqynode', JSON.stringify(excelnode));
							$('#dgFileTabs li', window.parent.document).removeClass('active');
							$('#dgFileTabContent div', window.parent.document).removeClass('active');
							if ($('#qyxj_' + dgFileId, window.parent.document).length == 0) {
								$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#qyxj_' + dgFileId + '\'><h5 class=\'block-title\'>' + fileName.substring(0, fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
								var $div = $('<div class="postil-content-wrap tab-pane active" id="qyxj_' + dgFileId + '">'
									+ '<iframe id="iframe_qyxj_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgXJQYIframe&index=' + _data.extraOptions.fileIndexId + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
									+ '</div>');
								$('#dgFileTabContent', window.parent.document).append($div);
								$('#dgFileTabs a:last', window.parent.document).tab('show');
								if ($('.aside-hide', window.parent.document).length !== 0) {
									$('body', window.parent.document).toggleClass('aside-hide');
									$(window).resize();
								}
							} else {
								$('[href="#qyxj_' + dgFileId + '"]', window.parent.document).tab('show');
								$('#qyxj_' + dgFileId, window.parent.document).addClass('active');
							}
						} else {
							bdoInfoBox('提示', '无前推项目或前推项目尚未生成该底稿！');
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		// 打开校验公式modal
		$('#openFormulaModalBtn').click(e => {
			$('#formulaModal').modal('show');
		});
		$('#formulaModal').on('show.bs.modal', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'AUDITREPORT',
					param4: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							referredAutoId = data.data[0].infoFormula;
						}
					}
				}
			});
			if (referredAutoId == '') {
				referredAutoId = '0';
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00229',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: referredAutoId,
					param5: $('#formulaCalc').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNum').html(data.data[0].totalNum);
							$('#rightNum').html(data.data[0].rightNum);
						}
					}
				}
			});
			formulaTable.localParam.urlparam.param3 = referredAutoId;
			BdoDataTable('formulaTable', formulaTable);
		});
		$('#formulaCalc').change((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'AUDITREPORT',
					param4: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							referredAutoId = data.data[0].infoFormula;
						}
					}
				}
			});
			if (referredAutoId == '') {
				referredAutoId = '0';
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00229',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: referredAutoId,
					param5: $('#formulaCalc').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNum').html(data.data[0].totalNum);
							$('#rightNum').html(data.data[0].rightNum);
						}
					}
				}
			});
			formulaTable.localParam.urlparam.param3 = referredAutoId;
			formulaTable.localParam.urlparam.param5 = $('#formulaCalc').val();
			$('#formulaTable').DataTable().ajax.reload();
		});
		// 校验公式
		$('#checkFormulaBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgCheck.checkFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'AUDITREPORT',
					param4: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						swal({
							title: '正在校验中...',
							html: '请稍后查看!',
							type: 'info',
							allowOutsideClick: false,
							allowEscapeKey: false,
							timer: 3000
						}).catch(swal.noop);
					}
				}
			});
		});
		// 
		$('#formulaTable').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00235',
					param1: tagid,
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success && data.data[0]) {
						var tagInfo = JSON.parse(data.data[0].tagInfo)[0];
						if(tagInfo.type == 'report'){
							var text = '该标签为报表"' + tagInfo.colName + tagInfo.colCode + '"的"' + tagInfo.reportValDesc + '"';
							swal(text);
						}else if(tagInfo.type == 'auditReport'){
							var sheetIndex = parseInt(spread.getSheetIndex(tagInfo.sheetName));
							spread.setActiveSheetIndex(sheetIndex);
							var range = GC.Spread.Sheets.CalcEngine.formulaToRange(spread.getActiveSheet(), tagInfo.rangeStr, 0, 0);
							spread.getActiveSheet().setActiveCell(range.row, range.col);
							var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
							spread.getActiveSheet().showRow(range.row, verticalPosition);
						}else if(tagInfo.type == 'note'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00092',
									param1: tagInfo.noteAutoId,
									param2: window.CUR_CUSTOMERID,
									param3: window.CUR_PROJECTID,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.autoId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('noteInfoNode', JSON.stringify(nodeData));
										$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
										window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}
					}
				}
			});
		});
		// 刷新正确数/总数
		$('#formulaModal').on('click', 'a[class="tableRefresh"]', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00229',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: referredAutoId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNum').html(data.data[0].totalNum);
							$('#rightNum').html(data.data[0].rightNum);
						}
					}
				}
			});
			formulaTable.localParam.urlparam.param3 = referredAutoId;
		});
		// 打开核对公式modal
		$('#openVerifyModalBtn').click(e => {
			$('#verifyModal').modal('show');
		});
		$('#verifyModal').on('show.bs.modal', function() {
			BdoDataTable('verifyTable', verifyTable);
		});
		$('#verifyTable').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00235',
					param1: tagid,
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success && data.data[0]) {
						var tagInfo = JSON.parse(data.data[0].tagInfo)[0];
						if(tagInfo.type == 'note'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00092',
									param1: tagInfo.noteAutoId,
									param2: window.CUR_CUSTOMERID,
									param3: window.CUR_PROJECTID,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.autoId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('noteInfoNode', JSON.stringify(nodeData));
										$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
										window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}else if(tagInfo.type == 'auditReport'){
							var sheetIndex = parseInt(spread.getSheetIndex(tagInfo.sheetName));
							spread.setActiveSheetIndex(sheetIndex);
							var range = GC.Spread.Sheets.CalcEngine.formulaToRange(spread.getActiveSheet(), tagInfo.rangeStr, 0, 0);
							spread.getActiveSheet().setActiveCell(range.row, range.col);
							var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
							spread.getActiveSheet().showRow(range.row, verticalPosition);
						}
					}
				}
			});
		});
		// 弹出编辑备注模态框
		$('#verifyTable').on('click', 'button[name="editRemark"]', function() {
			var object = $('#verifyTable').DataTable().data()[$(this).closest('tr').index()];
			var autoId = object.autoId;
			$('#formulaId').val(autoId);
			var checkRemark = object.checkRemark;
			$('#remark_input').val(checkRemark);
			$('#remarkModal').modal('show');
		});
		// 保存备注
		$('#saveRemarkBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgAuditFile.saveFormulaRemark.json',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: $('#formulaId').val(),
					param4: $('#remark_input').val().trim(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						// $('#verifyTable').DataTable().ajax.reload();
						$('#remarkModal').modal('hide');
						$('#verifyTable').DataTable().draw(false);
						bdoSuccessBox('成功', '保存备注成功！');
					}
				}
			});
		});
		// 校验核对公式
		$('#verifyFormulaBtn').click((event) => {
			bdoInProcessingBox('核对中...');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgAuditFile.checkVerifyFormula.json',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'AUDITREPORT',
					param4: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#verifyTable').DataTable().draw(false);
						bdoSuccessBox('成功', '核对完成！');
					}
				}
			});
		});
		// 设置底稿文件节点信息
		function setExcelnode(preCustomerId, preProjectId, workpaperId) {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00224',
					param1: preCustomerId,
					param2: preProjectId,
					param3: workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						// 底稿节点信息
						var nodeData = {
							extraOptions: data.data[0],
							currentNode: {
								extraOptions: data.data[0]
							}
						};
						nodeData.workpaperId = nodeData.extraOptions.workpaperId;
						nodeData.menuId = window.sys_menuId;
						designer.excelnode = nodeData;
					}
				}
			});
		}
		// 打开选择关联方modal
		$('#merchantRelatedModalBtn').click(e => {
			$('#selectMerchantRelatedModal').modal('show');
		});
		$('#selectMerchantRelatedModal').on('show.bs.modal', function() {
			BdoDataTable('selectMerchantRelatedTable', merchantRelatedTable);
			$('input[name="checkMerchantRelatedAll"]').off('click');
			$('input[name="checkMerchantRelatedAll"]').on('click', checkMerchantRelatedAll);
		});
		function checkMerchantRelatedAll(){
			if ($('input[name="checkMerchantRelatedAll"]').is(":checked")==true){
				$("input[name='checkMerchantRelated']").each(function () {
					this.checked = true;
				});
			}else {
				$('input[name="checkMerchantRelatedAll"]').prop("checked", false);
				$("input[name='checkMerchantRelated']").each(function () {
					this.checked = false;
				});
			}
		}
		// 关联方--确定
		$('#checkMerchantRelatedBtn').click(e => {
			var ids = [];
			$.each($('input[name="checkMerchantRelated"]:checkbox'), function() {
				if (this.checked) {
					var data = $('#selectMerchantRelatedTable').DataTable().data()[$(this).closest('tr').index()];
					ids.push(String(data.autoId));
				}
			});
			if (ids.length < 1) {
				bdoInfoBox('提示', '请至少选择一项关联方!');
				return;
			}
			var displaytext = '生成关联方sheet时会将已修改的现金流量表底稿保存。';
			displaytext += '<br>确定是否生成关联方sheet？'
			bdoConfirmBox('提示', displaytext, function() {
				bdoInProcessingBox('生成中...');
				var sheetName = [];
				for(var i = 0;i < spread.getSheetCount();i++){
					sheetName.push(spread.getSheet(i).name());
				}
				if(currentNode.extraOptions.tableDiv == '4'){
					if($.inArray('封面', sheetName) == -1 || 
							$.inArray('现金流量表', sheetName) == -1 || 
							$.inArray('现底稿1', sheetName) == -1 || 
							$.inArray('现底稿2', sheetName) == -1 || 
							$.inArray('资产负债表', sheetName) == -1 || 
							$.inArray('利润表', sheetName) == -1 ){
						bdoErrorBox('保存失败', '文件需包含"封面"、"现金流量表"、"现底稿1"、"现底稿2"、"资产负债表"、"利润表"sheet页');
						return;
					}
				}else if(currentNode.extraOptions.tableDiv == '5' || currentNode.extraOptions.tableDiv == '6'){
					if($.inArray('封面', sheetName) == -1 || 
							$.inArray('所有者权益变动表', sheetName) == -1 || 
							$.inArray('资产负债表', sheetName) == -1 || 
							$.inArray('试算平衡表', sheetName) == -1 || 
							$.inArray('利润表', sheetName) == -1 ){
						bdoErrorBox('保存失败', '文件需包含"封面"、"所有者权益变动表"、"资产负债表"、"试算平衡表"、"利润表"sheet页');
						return;
					}
				}
				var json = spread.toJSON();
				excelIo.save(json, blob => {
					var param = {};
					param.fileName = fileName;
					param.workpaperId = workpaperId;
					param.customerId = customerId;
					param.projectId = projectId;
					param.yyyy = window.CUR_PROJECT_ACC_YEAR;
					param.tableDiv = _data.extraOptions.tableDiv;
					param = getQYXJParam(param);
					
					var formData = new FormData();
					$.each(param, (key, val) => {
						formData.append(key, val);
					});
					formData.append('file', blob);
					$.ajax({
						url: 'dgCenter/DgAuditFile.saveFile.json',
						type: 'POST',
						data: formData,
						contentType: false,
						processData: false,
						success(data) {
							if (data.success) {
								$.ajax({
									type: 'post',
									url: 'dgCenter/DgAuditFile.createMerchantRelatedsSheet.json',
									dataType: 'json',
									data: {
										customerId: window.CUR_CUSTOMERID,
										projectId: window.CUR_PROJECTID,
										param1: window.CUR_CUSTOMERID,
										param2: window.CUR_PROJECTID,
										param3: workpaperId,
										param4: JSON.stringify(ids),
									},
									success: function(data) {
										if (data.success) {
											getExcelData({
												menuId: window.sys_menuId,
												customerId: window.CUR_CUSTOMERID,
												projectId: window.CUR_PROJECTID,
												param1: workpaperId,
												param2: customerId
											});
										} else {
											bdoErrorBox('失败', data.resultInfo.statusText);
										}
									}
								});
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
					blobToDataURL(blob, data => {
						storage.setItem(storageId, data);
						storage.setItem(storageStatus, 'server');
					});
				}, e => {
					bdoErrorBox('失败', e.errorMessage);
				});
			});
		});
	};

	/**
	 * 挂载
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);
		listener();
		transition(() => {
			getExcelData({
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: workpaperId,
				param2: customerId
			});
		});
		DgDesignerPage({region: '#designerment', data: _data});
		OneUI.initHelper('slimscroll');
		dgQYXJImportForm = createForm(dgQYXJUploadFiltComponet);
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
	 * 转成文件 base64 格式
	 */
	blobToDataURL = (blob, callback) => {
		var a = new FileReader();
		a.onload = e => {
			callback(e.target.result);
		};
		a.readAsDataURL(blob);
	};

	/**
	 * 获取文件
	 */
	getExcelData = (param) => {
		spread = designer.Spread;
		$.ajax({
			url: 'dgCenter/DgMain.getWorkpaper.json',
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
						spread.fromJSON(workbookObj);
						spread.setActiveSheetIndex(0);
						var sheetCount = spread.getSheetCount();
						for (var i = 0; i < spread.getSheetCount(); i++) {
							var sheet = spread.getSheet(i);
							if(sheet.getColumnCount() < 20){
								sheet.setColumnCount(20);
							}else{
								sheet.setColumnCount(sheet.getColumnCount() + 5);
							}
							sheet.setRowCount(sheet.getRowCount() + 5);
							if(sheet.options.protectionOptions.formatColumns){
								sheet.options.protectionOptions.allowResizeColumns = true;
							}
							if(sheet.options.protectionOptions.formatRows){
								sheet.options.protectionOptions.allowResizeRows = true;
							}
						}
						getCustomizeStyle();
					}, e => {
						bdoErrorBox('失败', e.errorMessage);
					});
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	};

	/**
	 * 保存文件
	 */
	saveExcel = (json) => {
		if (!currentNode) {
			return;
		}
		var sheetName = [];
		for(var i = 0;i < spread.getSheetCount();i++){
			sheetName.push(spread.getSheet(i).name());
		}
		if(currentNode.extraOptions.tableDiv == '4'){
			if($.inArray('封面', sheetName) == -1 || 
					$.inArray('现金流量表', sheetName) == -1 || 
					$.inArray('现底稿1', sheetName) == -1 || 
					$.inArray('现底稿2', sheetName) == -1 || 
					$.inArray('资产负债表', sheetName) == -1 || 
					$.inArray('利润表', sheetName) == -1 ){
				bdoErrorBox('保存失败', '文件需包含"封面"、"现金流量表"、"现底稿1"、"现底稿2"、"资产负债表"、"利润表"sheet页');
				return;
			}
		}else if(currentNode.extraOptions.tableDiv == '5' || currentNode.extraOptions.tableDiv == '6'){
			if($.inArray('封面', sheetName) == -1 || 
					$.inArray('所有者权益变动表', sheetName) == -1 || 
					$.inArray('资产负债表', sheetName) == -1 || 
					$.inArray('试算平衡表', sheetName) == -1 || 
					$.inArray('利润表', sheetName) == -1 ){
				bdoErrorBox('保存失败', '文件需包含"封面"、"所有者权益变动表"、"资产负债表"、"试算平衡表"、"利润表"sheet页');
				return;
			}
		}
		excelIo.save(json, blob => {
			var param = {};
			param.fileName = fileName;
			param.workpaperId = workpaperId;
			param.customerId = customerId;
			param.projectId = projectId;
			param.yyyy = window.CUR_PROJECT_ACC_YEAR;
			param.tableDiv = _data.extraOptions.tableDiv;
			param = getQYXJParam(param);
			
			saveExcelServer(param, blob);
			blobToDataURL(blob, data => {
				storage.setItem(storageId, data);
				storage.setItem(storageStatus, 'server');
			});
		}, e => {
			bdoErrorBox('失败', e.errorMessage);
		});
	};

	/**
	 * 保存文件（server）
	 */
	saveExcelServer = (param, fileData) => {
		var formData = new FormData();
		$.each(param, (key, val) => {
			formData.append(key, val);
		});
		formData.append('file', fileData);
		$.ajax({
			url: 'dgCenter/DgAuditFile.saveFile.json',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false,
			success(data) {
				if (data.success) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$.ajax({
						url: 'dgCenter/DgAuditFile.checkAuditReportFormula.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: 'AUDITREPORT',
							param4: workpaperId
						},
						dataType: 'json',
						success(data) {
							if (!data.success) {
								swal({
									title: '错误',
									html: data.resultInfo.statusText,
									type: 'error',
									showCancelButton: true,
									confirmButtonText: '查看',
									cancelButtonText: '取消',
									allowOutsideClick: false,
									allowEscapeKey: false
								}).then((isConfirm) => {
									$('#formulaModal').modal('show');
									$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
									$('#formulaTable').DataTable().ajax.reload();
								}).catch(swal.noop);
							}
						}
					});
				} else {
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

	/**
	 * 导入文件
	 */
	importExcel = () => {
		if (!currentNode) {
			return;
		}
		$('#uploadTplFormModal').modal('show');
	};
	
	const dgQYXJUploadFiltComponet = {
		id: 'uploadTplForm',
		display: 'tableform-one',
		column: 1,
		props: {
			jsonData: Object
		},
		options: {
			propsData: {
				jsonData: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID
				}
			}
		},
		data() {
			return {
				ajaxConfig: {
					type: 'POST',
					url: 'dgCenter/DgAuditFile.importExcel.json',
					dataType: 'json',
					success(data) {
						if (data.success) {
							var excel = data.data[0].excelBase64Data;
							var file = dataURLtoFile(excel, fileName);
							excelIo.open(file, json => {
								var workbookObj = json;
								workbookObj = updateUsedRange(json);
								spread.fromJSON(workbookObj);
								spread.setActiveSheetIndex(0);
								for (var i = 0; i < spread.getSheetCount(); i++) {
									if(spread.getSheet(i).getColumnCount() < 20){
										spread.getSheet(i).setColumnCount(20);
									}else{
										spread.getSheet(i).setColumnCount(spread.getSheet(i).getColumnCount() + 5);
									}
									spread.getSheet(i).setRowCount(spread.getSheet(i).getRowCount() + 5);
								}
								bdoInfoBox('导入成功', '导入后需点击保存才算编辑完成', 2000);
								getCustomizeStyle();
								$('#uploadTplFormModal').modal('hide');
							}, e => {
								bdoErrorBox('导入失败', e.errorMessage);
							});
						} else {
							bdoErrorBox('导入失败', data.resultInfo.statusText);
						}
					}
				}
			};
		},
		methods: {
			onImportFileClick() {
				let file = $('#workpager').fileinput('getFileStack');
				if (!file || file.length < 1) {
					bdoInfoBox('提示', '请先选择文件');
					return;
				}
				bdoInProcessingBox('上传中...');
				this.uploadFile(true);
			},
			onCancelClick() {
				$('#uploadTplFormModal').modal('hide');
			}
		},
		buttons: [{
			id: 'importFileBtn',
			icon: 'fa-floppy-o',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onImportFileClick'
			}
		}, {
			id: 'cancelImportFileBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'v-on:click': 'onCancelClick'
			}
		}],
		items: [{
			id: 'workpager',
			type: 'file',
			label: '上传文件',
			rowspan: 1,
			colspan: 1,
			typeAttr: {
				readonly: false
			},
			validate: {
				rules: {}
			},
			plugin: {
				name: 'fileinput',
				options: {
					uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
					allowedFileExtensions: ['xlsx'],//允许的文件类型]
					maxFilesNum: 1,
					uploadExtraData() {
						return {};
					}
				}
			}
		}]
	};
	mount();
};