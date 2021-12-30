/**
 * 合并附注（模板）
 */
var MergeNoteTemplatePage = (agrs) => {
	var _template
		, _data
		, currentNode
		, mount
		, listener
		, setHeight
		, getHeight
		, transition // 过度效果接口
		, getExcelData // 获取excel 文件数据接口
		, storage = window.localStorage // 浏览器缓存接口
		, spread // spread 实例
		, excelIo = new GC.Spread.Excel.IO() // spreadIo 实例
		, height = $('#main-container').height() - $('#pageHead').height() - 60 // 编辑区高度
		, dataURLtoFile // 文件数据类型转换接口
		, blobToDataURL // 文件数据类型转换接口
		, autoId
		, storageId
		, storageStatus
		, storageTime
		, fileName
		, fullPath
		, designer;
	
	_data = _data ? _data : agrs.data;
	currentNode = _data.currentNode;
	_template = agrs.template || tplLoader('dgCenter/merge/html/mergeNoteTemplate.html');
	agrs.template = _template;

	autoId = _data.extraOptions.autoId;
	storageId = 'BDOMERGENOTETEMPLATE' + autoId;
	storageStatus = 'BDOMERGENOTETEMPLATE' + autoId + 'Status';
	storageTime = 'BDOMERGENOTETEMPLATE' + autoId + 'Time';
	fileName = _data.extraOptions.fileName;
	fullPath = _data.extraOptions.fullPath;

	if (height <= 0) {
		height = $('body').height() - 20;
	}
	/**
	 * begin
	 */

	var needSuspend;
	var tipWidth = 600;

	function updateLayout() {
		var $spreadContainer = $('#spreadContainer');
		var $spreadWrapper = $('.spreadWrapper', $spreadContainer);
		$spreadContainer.css('position', 'relative');
		$spreadWrapper.css('height', (getHeight() - 66) + 'px');
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
		designer = new GC.Spread.Sheets.Designer.Designer(document.getElementById('spreadContainer'), undefined, undefined);
		
		// 删除菜单栏
		$(designer._container).children('.ribbon').remove();
		
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
	var clickstatus = false;
	var lastX = 0;
	var lastY = 0;
	var lastcX = 0;
	var lastcY = 0;
	document.addEventListener('mousedown', mousedown);
	document.addEventListener('mousemove', mousemove);
	document.addEventListener('mouseup', mouseup);

	function mousedown(e) {
		if (e.target.id === 'modalTitleId') {
			clickstatus = true;
			var moveObject = document.getElementById('mergeNoteFetchDataDiv');
			lastX = moveObject.offsetLeft;
			lastY = moveObject.offsetTop;
			lastcX = e.clientX;
			lastcY = e.clientY;
		}
	}

	function mousemove(e) {
		var moveObject = document.getElementById('mergeNoteFetchDataDiv');
		if (clickstatus) {
			moveObject.style.left = lastX + (e.clientX - lastcX - 10) + 'px';
			moveObject.style.top = lastY + (e.clientY - lastcY - 10) + 'px';
		}
	}

	function mouseup(e) {
		clickstatus = false;
		lastX = 0;
		lastY = 0;
		lastcX = 0;
		lastcY = 0;
	}
	/**
	 * 事件绑定
	 */
	listener = () => {
		/**
		 * 过渡效果
		 */
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
				param1: autoId
			});
			$('#fileFullPath').text(fullPath);
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
			url: 'dgCenter/HbMergeProjectNoteInfo.getMergeNoteTemplate.json',
			type: 'post',
			data: param,
			dataType: 'json',
			success(data) {
				if (data.success) {
					var time = data.data[0].time;
					if (storage.length > 300) {
						storage.removeItem(storage.key(2));
						storage.removeItem(storage.key(1));
						storage.removeItem(storage.key(0));
					}
					storage.setItem(storageTime, time);
					var excel = data.data[0].excelBase64Data;
					var file = dataURLtoFile(excel, param.param1);
					blobToDataURL(file, data => {
						storage.setItem(storageId, data);
						storage.setItem(storageStatus, 'server');
					});
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
						bdoSuccessBox('加载完成', data.resultInfo.statusText);
					}, e => {
						bdoErrorBox('失败', e.errorMessage);
					});
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	};

	mount();
};