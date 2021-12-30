/**
 * 错报汇总表在线底稿
 */
var DgCBSummaryPage = (agrs) => {
	var _template
		, _data
		, currentNode
		, mount
		, listener
		, getHeight
		, transition // 过度效果接口
		, getExcelData // 获取excel 文件数据接口
		, saveExcelServer // 保存excel 接口
		, spread // spread 实例
		, excelIo = new GC.Spread.Excel.IO() // spreadIo 实例
		, height = $('#main-container').height() - $('#pageHead').height() - 60 // 编辑区高度
		, dataURLtoFile // 文件数据类型转换接口
		, saveExcel // 保存 excel 文件接口
		, exportExcel // 导出 excel 文件接口
		, customerId
		, workpaperId
		, fileName
		, designer;

	_data = _data ? _data : agrs.data;
	currentNode = _data.currentNode;
	_template = agrs.template || tplLoader('dgCenter/html/dg/dgCBSummary.html');
	agrs.template = _template;

	workpaperId = _data.extraOptions.workpaperId;
	customerId = _data.extraOptions.customerId;
	fileName = _data.extraOptions.nodeName + '.xlsx';
	if (height <= 0) {
		height = $('body').height() - 20;
	}
	/**
	 * begin
	 */
	
	var needSuspend;
	var tipWidth = 600;

	function updateLayout() {
		let $spreadContainer = $('#spreadContainer');
		let $spreadWrapper = $('.spreadWrapper', $spreadContainer);
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
		designer = initDesigner(_data);
		
		designer.paperType = 'cbsummary';
		
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

		$('#reCreateBtn').click((event) => {
			bdoInProcessingBox('生成中');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgWapper.reCreateCbSummary.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: workpaperId,
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
					}, e => {
						bdoErrorBox('失败', e.errorMessage);
					});
					bdoSuccessBox('加载完成', data.resultInfo.statusText);
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
		excelIo.save(json, blob => {
			var param = {};
			param.fileName = fileName;
			param.workpaperId = workpaperId;
			param.customerId = customerId;
			param.auditConclusion = spread.getSheet(0).getCell(10, 2).text();
			param.projectId = window.CUR_PROJECTID;
			saveExcelServer(param, blob);
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
			url: 'dgCenter/DgWapper.saveCbSummary.json',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false,
			success(data) {
				if (data.success) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
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

	mount();
};