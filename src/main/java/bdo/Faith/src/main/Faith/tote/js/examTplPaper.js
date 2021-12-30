/**
 * 考试模板
 */
var ExamTplPaperPage = (agrs) => {
	var _template
		, _data
		, currentNode
		, mount
		, listener
		, uploadExamTplPaperForm
		, uploadExamTplPaperCfg
		, setHeight
		, getHeight
		, transition // 过度效果接口
		, getExcelData // 获取excel 文件数据接口
		, saveExcelServer // 保存excel 接口
		, storage = window.localStorage // 浏览器缓存接口
		, spread // spread 实例
		, excelIo = new GC.Spread.Excel.IO() // spreadIo 实例
		, height = $('#main-container').height() - $('#pageHead').height() - 60 // 编辑区高度
		, dataURLtoFile // 文件数据类型转换接口
		, blobToDataURL // 文件数据类型转换接口
		, saveExcel // 保存 excel 文件接口
		, exportExcel // 导出 excel 文件接口
		, saveFileInStorage // 保存 excel 文件到浏览器缓存接口
		, getFileFromStorage // 从浏览器缓存中获取文件数据
		, autoId
		, storageId
		, storageStatus
		, storageTime
		, fileName
		, fullPath
		, designer;
	
	_data = _data ? _data : agrs.data;
	currentNode = _data.currentNode;
	_template = agrs.template || tplLoader('tote/html/examTplPaper.html');
	agrs.template = _template;
	
	autoId = _data.extraOptions.autoId;
	fileName = _data.extraOptions.fileName;
	storageId = 'BDOTOTETPL' + autoId;
	storageStatus = 'BDOTOTETPL' + autoId + 'Status';
	storageTime = 'BDOTOTETPL' + autoId + 'Time';

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
		
		designer.toteExtraOptions = _data.extraOptions;
		designer.paperType = 'tote';
		
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
		/**
		 * 保存
		 */
		$('#saveExcelBtn').click((event) => {
			bdoInProcessingBox('保存中');
			transition(() => {
				var json = spread.toJSON();
				saveExcel(json);
			});
		});
		/**
		 * 临时保存
		 */
		$('#saveExcelStorageBtn').click((event) => {
			transition(() => {
				var json = spread.toJSON();
				saveFileInStorage(json);
			});
		});
		/**
		 * 导出
		 */
		$('#exportExcelBtn').click((event) => {
			transition(() => {
				exportExcel();
			});
		});
		/**
		 * 导入
		 */
		$('#uploadExcelBtn').click((event) => {
			// 考试试卷id
			uploadExamTplPaperForm.jsonData.autoId = autoId;
			$('#uploadExamTplPaperFormModal').modal('show');
		});
		/**
		 * 获取最新版本
		 */
		$('#coverBtn').click((event) => {
			if (!currentNode) {
				return;
			}
			storage.removeItem(storageId);
			storage.removeItem(storageStatus);
			storage.removeItem(storageTime);
			getExcelData({
				menuId: window.sys_menuId,
				param1: autoId
			});
		});
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
		uploadExamTplPaperForm = createForm(uploadExamTplPaperCfg);
		listener();
		transition(() => {
			getExcelData({
				menuId: window.sys_menuId,
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
	 * 保存文件（server）
	 */
	saveExcelServer = (param, fileData) => {
		var formData = new FormData();
		$.each(param, (key, val) => {
			formData.append(key, val);
		});
		formData.append('file', fileData);
		$.ajax({
			url: 'tote/ToteExam.saveToteTplFile.json',
			type: 'post',
			data: formData,
			contentType: false,
			processData: false,
			success(data) {
				if (data.success) {
					storage.removeItem(storageId);
					storage.removeItem(storageStatus);
					storage.removeItem(storageTime);
					getExcelData({
						menuId: window.sys_menuId,
						param1: autoId
					});
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
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
		var fileData = getFileFromStorage(storageId);
		if (fileData == null) {
			$.ajax({
				url: 'tote/ToteExam.getToteTplFileInfo.json',
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
						}, e => {
							bdoErrorBox('失败', e.errorMessage);
						});
						bdoSuccessBox('加载完成', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		} else {
			$.ajax({
				url: 'tote/ToteExam.getToteTplFileInfo.json',
				type: 'post',
				data: param,
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.success) {
							var time = data.data[0].time;
							var timeServer = parseInt(storage.getItem(storageTime));
							if (time != timeServer) {
								bdoConfirmBox('提示', '是否将服务器文件覆盖当前浏览器缓存文件？', (isConfirm) => {
									if (storage.length > 300) {
										storage.removeItem(storage.key(2));
										storage.removeItem(storage.key(1));
										storage.removeItem(storage.key(0));
									}
									var excel = data.data[0].excelBase64Data;
									storage.setItem(storageTime, time);
									var file = dataURLtoFile(excel, param.param1);
									blobToDataURL(file, data => {
										storage.setItem(storageId, data);
										storage.setItem(storageStatus, 'server');
									});
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
									}, e => {
										bdoErrorBox('失败', e.errorMessage);
									});
								}, () => {
									var file = dataURLtoFile(fileData, fileName);
									var status = storage.getItem(storageStatus);
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
										if (status == 'local') {
											swal({
												title: '提示',
												text: '该文件上次编辑后未保存到服务器！',
												type: 'warning',
												showConfirmButton: false,
												allowOutsideClick: true,
												timer: 2000
											}).catch(swal.noop);
										}
									}, e => {
										bdoErrorBox('失败', e.errorMessage);
									});
								});
							}
							var file = dataURLtoFile(fileData, fileName);
							var status = storage.getItem(storageStatus);
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
								if (status == 'local') {
									swal({
										title: '提示',
										text: '该文件上次编辑后未保存到服务器！',
										type: 'warning',
										showConfirmButton: false,
										allowOutsideClick: true,
										timer: 2000
									}).catch(swal.noop);
								}
							}, e => {
								bdoErrorBox('失败', e.errorMessage);
							});
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			});
		}
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
			param.autoId = autoId;
			
			saveExcelServer(param, blob);
			blobToDataURL(blob, data => {
				storage.setItem(storageId, data);
				storage.setItem(storageStatus, 'server');
				storage.setItem(storageTime, time);
			});
		}, e => {
			bdoErrorBox('失败', e.errorMessage);
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
	 * 保存文件到本地缓存
	 */
	saveFileInStorage = (json) => {
		if (!currentNode) {
			return;
		}
		excelIo.save(json, blob => {
			blobToDataURL(blob, data => {
				storage.setItem(storageId, data);
				storage.setItem(storageStatus, 'local');
				storage.setItem(storageTime, time);
				bdoSuccessBox('成功');
			});
		}, e => {
			bdoErrorBox('失败', e.errorMessage);
		});
	};

	/**
	 * 从缓存中取文件
	 */
	getFileFromStorage = (storageId) => {
		var fileString = storage.getItem(storageId);
		if (!fileString) return null;
		return fileString.replace('data:application/zip;base64,', '');
	};

	/**
	 * 关闭画面前事件
	 */
	beforClose = () => {
		if (currentNode && currentNode.type == 'FILE') {
			var icon = $('#fullscreenBtn').find('i');
			var fullscreenFlg = icon.hasClass('si-size-actual');
			if (fullscreenFlg) {
				$('#ss').height((height + 40) + 'px');
			} else {
				$('#ss').height((height - 20) + 'px');
			}
			bdoConfirmBox('提示', '是否保存当前文件？', (isConfirm) => {
				var timer = setTimeout(() => {
					clearTimeout(timer);
					transition(() => {
						var json_ = spread.toJSON();
						excelIo.save(json_, blob_ => {
							saveExcel(json_);
							getExcelData({
								menuId: window.sys_menuId,
								param1: autoId
							});
							$('#fileFullPath').text(fullPath);
						}, e => {
						});
					});
				}, 0);
			}, () => {
				var timer = setTimeout(() => {
					clearTimeout(timer);
					transition(() => {
						getExcelData({
							menuId: window.sys_menuId,
							param1: autoId
						});
						$('#fileFullPath').text(fullPath);
					});
				}, 0);
			});
		}
	};

	uploadExamTplPaperCfg = {
		options: {
			propsData: {
				jsonData: {
					paper: [],
					autoId: null
				}
			}
		},
		props: {
			jsonData: Object
		},
		display: 'tableform-one',
		column: 1,
		id: 'uploadExamTplPaperForm',
		data() {
			return {
				ajaxConfig: {
					type: 'post',
					url: 'tote/ToteDownload.noDBuploadExamTplPaper.json',
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							storage.removeItem(storageId);
							storage.removeItem(storageStatus);
							storage.removeItem(storageTime);
							getExcelData({
								menuId: window.sys_menuId,
								param1: autoId
							});
							$('#uploadExamTplPaperFormModal').modal('hide');
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				},
				uploadMode: 'STD'
			};
		},
		methods: {
			onUploadExamTplPaperFileClick(event) {
				var fileCount = $('#paper').fileinput('getFilesCount');
				if (fileCount <= 0) {
					bdoErrorBox('失败', '当前无任何文件！');
					return;
				}
				this.uploadFile(true);
			},
			resetFileClick(event) {
				$('#paper').fileinput('refresh');
				$('#paper').fileinput('clear');
				$('#paper').fileinput('reset');
			}
		},
		buttons: [{
			id: 'resetFileBtn',
			icon: 'fa fa-refresh',
			style: 'btn-primary',
			text: '重置',
			typeAttr: {
				'v-on:click': 'resetFileClick'
			}
		}, {
			id: 'uploadExamTplPaperFileBtn',
			icon: 'fa fa-upload',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onUploadExamTplPaperFileClick'
			}
		}, {
			id: 'cancelUploadExamTplPaperFileBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'data-dismiss': 'modal'
			}
		}],
		items: [{
			id: 'paper',
			type: 'file',
			label: '考试试卷模板',
			rowspan: 1,
			colspan: 2,
			validate: {
				rules: {}
			},
			typeAttr: {
				multiple: false
			},
			show: true,
			plugin: {
				name: 'fileinput',
				options: {
					allowedFileExtensions: ['xlsx'],
					maxFileCount: 1,
					uploadUrl: 'tote/ToteDownload.uploadTempFile.json',
					uploadExtraData: function() {
						return {};
					}
				}
			}
		}]
	};

	mount();
};