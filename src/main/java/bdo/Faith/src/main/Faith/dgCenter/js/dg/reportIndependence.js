/**
 * 对外报告审批单
 */
var ReportIndependence = (agrs) => {

	var _template
		, _data
		, currentNode
		, mount
		, listener
		, setHeight
		, getHeight
		, getExcelData // 获取excel 文件数据接口
		, spread // spread 实例
		, excelIo = new GC.Spread.Excel.IO() // spreadIo 实例
		, height = $('#main-container').height() - $('#pageHead').height() - 60 // 编辑区高度
		, dataURLtoFile // 文件数据类型转换接口
		, blobToDataURL // 文件数据类型转换接口
		, autoId
		, fileName
		, fullPath
		, designer;
	
	//选择第一个
	_data = _data ? _data : agrs.data;
	currentNode = _data.currentNode;
	_template = agrs.template || tplLoader('dgCenter/html/dg/reportIndependenceIframe.html');
	agrs.template = _template;
	fileName = _data.fileName;

	if (height <= 0) {
		height = $('body').height() - 20;
	}
	/**
	 * begin
	 */
	
	var needSuspend;

	function updateLayout() {
		var $spreadContainer = $('#spreadContainer');
		var $spreadWrapper = $('.spreadWrapper', $spreadContainer);
		$spreadContainer.css('position', 'relative');
		$spreadWrapper.css('height', (getHeight() - 295) + 'px');
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
		
		designer.noteExtraOptions = _data.extraOptions;
		designer.paperType = 'reportIndependence';
		designer.fileName = fileName;
		
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
	 * 事件绑定
	 */
	listener = () => {
		$('#coverBtn').click(function() {
			transition(() => {
				bdoConfirmBox('提示', '此操作会删除原有文件，确定要继续么？', function() {
					$.ajax({
						url: 'dgCenter/DgProject.refreshReportIndependence.json',
						type: 'POST',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_CUSTOMERID
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								bdoSuccessBox('成功');
								location.reload();
							} else {
								bdoErrorBox('提示', data.resultInfo.statusText);
							}
						}
					});
				});
			});
		});


	};

	/**
	 * 挂载
	 */
	mount = () => {
		let $div = $('<div id="iframe_dg_1" class="main-content sidebar-l sidebar-mini sidebar-o side-scroll" ></div>');
		$('#dgFileTabContent').append($div);
		$('#dgFileTabs a:last').tab('show');
		$(agrs.region).empty().append(_template);
		listener();
		transition(() => {
			getExcelData(_data.source, fileName);
			$('#fileFullPath').text(fullPath);
		});
		OneUI.initHelper('slimscroll');
		ready();
	};


	/**
	 * 锁住sheet
	 * allowSelectLockedCells: 布尔值， 用户是否可以选中被锁定的单元格。
	 * allowSelectUnlockedCells: 布尔值, 用户是否可以选中未被锁定的单元格。
	 * allowSort: 布尔值，用户是否可以对一片单元格区域进行排序。
	 * allowFilter: 布尔值，用户是否可以对一片单元格区域进行筛选。
	 * allowEditObjects: 布尔值，用户是否可以编辑浮动元素。
	 * allowResizeRows: 布尔值，用户是否可以改变行高。
	 * allowResizeColumns: 布尔值，用户是否可以改变列宽。
	 * allowDragInsertRows: 布尔值，用户是否可以拖拽插入行。
	 * allowDragInsertColumns: 布尔值，用户是否可以拖拽插入列。
	 * allowInsertRows: 布尔值，用户是否可以插入行。
	 * allowInsertColumns: 布尔值，用户是否可以插入列。
	 * allowDeleteRows: 布尔值，用户是否可以删除行。
	 * allowDeleteColumns: 布尔值，用户是否可以删除列。
	 */
	let lockSheet = (spread, key) => {
		//if (checkPermissions(key) !== true) {
			let lockSheet = spread.getActiveSheet();
			lockSheet.options.protectionOptions = {
				allowSelectLockedCells: true,
				allowSelectUnlockedCells: true,
				allowSort: true,
				allowFilter: true,
				allowEditObjects: true,
				allowResizeRows: true,
				allowResizeColumns: true,
				allowDragInsertRows: true,
				allowDragInsertColumns: true,
				allowInsertRows: true,
				allowInsertColumns: true,
				allowDeleteRows: true,
				allowDeleteColumns: true
			};
			lockSheet.options.isProtected = true;
		//}
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
	getExcelData = (data, fileName) => {
		//获取最新文件
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgProject.getReportIndependenceFile.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID, param2: window.CUR_PROJECTID
			},
			dataType: 'json',
			success: function(data) {
				let _data = data.data[0];
				var file = dataURLtoFile(_data[fileName], fileName);
				excelIo.open(file, json => {
					var workbookObj = json;
					workbookObj = updateUsedRange(json);
					spread.fromJSON(workbookObj);
					spread.setActiveSheetIndex(1);
					for (var i = 0; i < spread.getSheetCount(); i++) {
						if(spread.getSheet(i).getColumnCount() < 20){
							spread.getSheet(i).setColumnCount(20);
						}else{
							spread.getSheet(i).setColumnCount(spread.getSheet(i).getColumnCount() + 5);
						}
						spread.getSheet(i).setRowCount(spread.getSheet(i).getRowCount() + 5);
					}
					lockSheet(spread, fileName.substr(1));
					bdoSuccessBox('加载完成', data.resultInfo.statusText);
				});
			}
		});


	};
	mount();
};