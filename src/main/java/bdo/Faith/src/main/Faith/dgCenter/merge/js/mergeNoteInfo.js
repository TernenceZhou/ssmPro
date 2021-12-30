/**
 * 合并附注（单个文件）
 */
var MergeNoteInfoPage = (agrs) => {
	var _template
		, _data
		, currentNode
		, mount
		, listener
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
		, customerId
		, projectId
		, mergeProjectId
		, referredAutoId
		, designer;
	
	_data = _data ? _data : agrs.data;
	currentNode = _data.currentNode;
	_template = agrs.template || tplLoader('dgCenter/merge/html/mergeNoteInfo.html');
	agrs.template = _template;

	autoId = _data.extraOptions.autoId;
	customerId = _data.extraOptions.customerId;
	projectId = _data.extraOptions.projectId;
	mergeProjectId = _data.extraOptions.mergeProjectId;
	storageId = 'BDOMERGENOTE' + autoId;
	storageStatus = 'BDOMERGENOTE' + autoId + 'Status';
	storageTime = 'BDOMERGENOTE' + autoId + 'Time';
	fileName = _data.extraOptions.fileName;
	fullPath = _data.extraOptions.fullPath;

	if (height <= 0) {
		height = $('body').height() - 20;
	}
	/**
	 * begin
	 */
	var mergeNoteTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00309',
					param1: customerId,
					param2: projectId,
					param3: autoId,
					param4: '',
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
			scrollY: '300px',
			select: false,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			// paging: false,
			fixedHeight: '460px',
			columnDefs: [
			{
				targets: 1,
				orderable: true,
				title: '项目编号',
				name: 'mergeProjectId',
				data: 'mergeProjectId',
				width: '100px'
			},{
				targets: 2,
				orderable: true,
				title: '附注编号',
				name: 'noteNo',
				data: 'noteNo',
				width: '100px'
			}, {
				targets: 3,
				orderable: true,
				title: '附注名称',
				name: 'noteName',
				data: 'noteName',
				width: '100px'
			}, {
				targets: 4,
				orderable: true,
				title: '操作',
				className: 'text-center',
				name: 'operate',
				data: 'tagName',
				width: '40px',
				render: function(data, type, row, meta) {
					let renderStr = '<button class=\"btn btn-xs btn-success\" name=\"openFile\" type=\"button\" title=\"打开附注\"><i class=\"fa fa-eye\"></i></button>';
					return renderStr;
				}
			}, {
				targets: 5,
				name: 'autoId',
				data: 'autoId',
				visible: false
			}
			]
		}
	};

	var tagsTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00314',
					param1: customerId,
					param2: projectId,
					param3: mergeProjectId,
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
					let renderStr = '<a href=\"#\">' + 'p' + data + '</a>';
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
				width: '100px',
				render: function(data, type, row, meta) {
					// let renderStr = '<a href=\"#\">' + data + '</a>';
					let renderStr = '<label>' + data + '</label>';
					return renderStr;
				}
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
				orderable: true,
				title: '操作',
				className: 'text-center',
				name: 'operate',
				data: 'tagName',
				width: '40px',
				render: function(data, type, row, meta) {
					let renderStr;
					if(row.tagProperty == 0){
						renderStr = '<button class=\"btn btn-xs btn-default\" type=\"button\" title=\"删除标签\" disabled><i class=\"fa fa-close\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
					} else {
						renderStr = '<button class=\"btn btn-xs btn-default\" type=\"button\" title=\"删除标签\"><i class=\"fa fa-close\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
					}
					return renderStr;
				}
			}, {
				targets: 9,
				name: 'tagDgId',
				data: 'tagDgId',
				visible: false
			}, {
				targets: 10,
				name: 'tagInfo',
				data: 'tagInfo',
				visible: false
			}
			]
		}
	};

	var formulaTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00315',
					param1: customerId,
					param2: projectId,
					param3: mergeProjectId,
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
			scrollY: '255px',
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
				orderable: true,
				title: '操作',
				className: 'text-center',
				name: 'operate',
				data: 'tagName',
				width: '80px',
				render: function(data, type, row, meta) {
					let renderStr;
					if(row.formulaProperty == 0){
						renderStr = '<button class=\"btn btn-xs btn-success\" name=\"editFormula\" type=\"button\" title=\"修改校验公式\" disabled><i class=\"fa fa-edit\"></i></button>';
						renderStr += '&nbsp;<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\" disabled><i class=\"fa fa-trash-o\"></i></button>';
					} else {
						renderStr = '<button class=\"btn btn-xs btn-success\" name=\"editFormula\" type=\"button\" title=\"修改校验公式\"><i class=\"fa fa-edit\"></i></button>';
						renderStr += '&nbsp;<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\"><i class=\"fa fa-trash-o\"></i></button>';
					}
					return renderStr;
				}
			}, {
				targets: 9,
				name: 'autoId',
				data: 'autoId',
				visible: false
			}
			]
		}
	};

	var offsetEntryData_table_view = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'HB00024',
					param1: customerId,
					param2: projectId,
					param3: (window.CUR_PROJECT_ACC_YEAR - 1),
					param4: window.CUR_PROJECT_ACC_YEAR,
					param5: autoId,
					start: -1,
					limit: -1
				};
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
			autoWidth: false,
			scrollX: true,
			scrollY: '220px',
			select: false,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			paging: false,
			fixedHeight: '460px',
			columnDefs: [{
				targets: 1,
				title: '年度',
				name: 'yyyy',
				data: 'yyyy',
				width: '80px'
			},{
				targets: 2,
				title: '索引号',
				name: 'indexId',
				data: 'indexId',
				width: '80px'
			}, {
				targets: 3,
				title: '科目编号',
				name: 'tbSubjectCode',
				data: 'tbSubjectCode',
				width: '80px'
			}, {
				targets: 4,
				title: '科目名称',
				name: 'tbSubjectName',
				data: 'tbSubjectName',
				width: '100px'
			}, {
				targets: 5,
				title: '二级科目',
				name: 'secondSubject',
				data: 'secondSubject',
				width: '100px'
			}, {
				targets: 6,
				title: '报表科目编号',
				name: 'reportSubjectId',
				data: 'reportSubjectId',
				width: '100px'
			}, {
				targets: 7,
				title: '报表科目名称',
				name: 'reportSubjectName',
				data: 'reportSubjectName',
				width: '100px'
			}, {
				targets: 8,
				title: '抵销类型',
				name: 'adjustType',
				data: 'adjustType',
				width: '80px',
				render: function(data, type, row, meta) {
					let renderStr = data == 2 ? 'TB抵销' : '现金流量表抵销';
					return renderStr;
				}
			}, {
				targets: 9,
				title: '借方抵销',
				name: 'deb',
				data: 'deb',
				width: '80px',
				render: function(data, type, row, meta) {
					let renderStr = formatMoney(data);
					return renderStr;
				}
			}, {
				targets: 10,
				title: '贷方抵销',
				name: 'cre',
				data: 'cre',
				width: '80px',
				render: function(data, type, row, meta) {
					let renderStr = formatMoney(data);
					return renderStr;
				}
			}, {
				targets: 11,
				title: '分录说明',
				name: 'digest',
				data: 'digest',
				width: '100px'
			}
			]
		}
	};

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
		designer = initDesignerMergeNote(_data);

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
		 * 保存
		 */
		$('#saveExcelBtn').click((event) => {
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
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00323',
					param1: mergeProjectId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success && data.data[0]) {
						var manager = data.data[0].manager;
						var membersId = data.data[0].membersId;
						var isPermission = false;
						if(CUR_USERID == manager){
							isPermission = true;
						}
						//CUR_USERID为开头第一个字符
						var regStart = new RegExp("^" + CUR_USERID);
						//CUR_USERID为结尾的最后一个字符
						var regEnd = new RegExp(CUR_USERID + "$");
						if(membersId != null && (regStart.test(membersId) || regEnd.test(membersId) || membersId.indexOf(',' + CUR_USERID + ',') != -1)) {
							isPermission = true;
						}
						if(isPermission){
							transition(() => {
								exportExcel();
							});
						}else{
							bdoErrorBox('失败', "没有权限！");
						}
					}
				}
			});
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
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: autoId,
				param2: customerId,
				param3: projectId,
				param4: mergeProjectId
			});
		});
		/**
		 * 批注
		 */
		$('#postilBtn').click((event) => {
			PostilPage({
				region: '#sideRegin',
				data: _data,
				type: 'MERGENOTE-' + _data.extraOptions.noteNo,
				foreignId: _data.extraOptions.autoId,
				customerId: _data.extraOptions.customerId,
				projectId: _data.extraOptions.projectId,
				mergeProjectId: _data.extraOptions.mergeProjectId
			});
			$('#sideRegin').show();
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
		/**
		 * 打开其他附注
		 */
		$('#openFilesModalBtn').click(e => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00313',
					param1: customerId,
					param2: projectId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#note_project').empty();
						$('#note_project').append('<option value=""></option>');
						for(var dataList of data.data){
							$('#note_project').append('<option value="' + dataList.projectId + '">' + dataList.projectName + '</option>');
						}
						$('#filesModal').modal('show');
					}
				}
			});
		});
		$('#filesModal').on('show.bs.modal', function() {
			BdoDataTable('mergeNoteTable', mergeNoteTable);
		});
		// 项目
		$('#note_project').change(function () {
			var noteProjectId = $("#note_project").find("option:selected").val();
			mergeNoteTable.localParam.urlparam.param4 = noteProjectId;
			$('#mergeNoteTable').DataTable().ajax.reload();
		});
		// 打开其他附注
		$('#mergeNoteTable').on('click', 'button[name="openFile"]', function() {
			var object = $('#mergeNoteTable').DataTable().data()[$(this).closest('tr').index()];
			var fileId = object.autoId;
			$('#dgFileTabs li', window.parent.document).removeClass('active');
			$('#dgFileTabContent div', window.parent.document).removeClass('active');
			if ($('#mergenote_' + fileId, window.parent.document).length == 0) {
				setNoteNode(fileId, object.mergeProjectId);
				var excelnode = designer.excelnode;
				$.sessionStorage('excelnode', JSON.stringify(excelnode));
				$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#mergenote_' + fileId + '\'><h5 class=\'block-title\'>' + object.fileName.substring(0, object.fileName.lastIndexOf('.')) + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
				var $div = $('<div class="postil-content-wrap tab-pane active" id="mergenote_' + fileId + '">'
					+ '<iframe id="iframe_mergeNote_' + fileId + '" src="/Faith/dgcenter.do?m=openMergeNoteInfoSecond&noteNo=' + object.noteNo + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
					+ '</div>');
				$('#dgFileTabContent', window.parent.document).append($div);
				$('#dgFileTabs a:last', window.parent.document).tab('show');
				if ($('.aside-hide', window.parent.document).length !== 0) {
					$('body', window.parent.document).toggleClass('aside-hide');
					$(window).resize();
				}
			} else {
				$('[href="#mergenote_' + fileId + '"]', window.parent.document).tab('show');
				$('#mergenote_' + fileId, window.parent.document).addClass('active');
			}
		});
		// 校验公式
		$('#openFormulaModalBtn').click(e => {
			$('#formulaModal').modal('show');
		});
		$('#formulaModal').on('show.bs.modal', function() {
			$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
			if($('#tagSort').val() == 'mergeNote'){
				tagsTable.localParam.urlparam.param4 = autoId;
			} else {
				tagsTable.localParam.urlparam.param4 = '';
			}
			BdoDataTable('tagsTable', tagsTable);
			$('#tagGroup').html('');
			$('#tagsTable tbody').on('click', 'td button', function() {
				var tagId = $(this).parents('tr').children().eq(1).text().substring(1);
				$.ajax({
					type: 'post',
					url: 'dgCenter/HbMergeFormulaCheck.deleteTag.json',
					// async : false,
					data: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: customerId,
						param2: projectId,
						param3: mergeProjectId,
						param4: tagId,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#tagsTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', '删除标签成功！');
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
			$('#tagsTable tbody').on('click', 'td a', function() {
				let colIndex = $(this).parents('td').index();
				if (colIndex === 1) {
					let length = $('#tagGroup .col-sm-1 input').length;
					let txt;
					if (length > 0) {
						txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"\"></option><option value=\"=\">=</option><option value=\"+">+</option><option value=\"-\">-</option></select></div></div><div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
					} else {
						txt = $('<div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
					}
					$('#tagGroup').append(txt);
					$('#tagGroup .col-sm-1 input')[length].value = $(this).text();
					$('#tagGroup .col-sm-1 input')[length].title = $(this).parent().next().text();
				}
			});
		});
		$('#formulaModal [data-toggle="tabs"] a').on('show.bs.tab', function(evt) {
			let href = evt.target.href;
			let index = href.lastIndexOf('#');
			let id = href.substring(index + 1);
			switch (id) {
				case 'tagTabDiv':
					$('#tagsTable').DataTable().ajax.reload();
					break;
				case 'formulaTabDiv':
					if($('#formulaSort').val() == 'mergeNote'){
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							async: false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00318',
								param1: customerId,
								param2: projectId,
								param3: mergeProjectId,
								param4: 'MERGENOTE',
								param5: autoId,
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
					}else{
						referredAutoId = '';
					}
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						// async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00316',
							param1: customerId,
							param2: projectId,
							param3: mergeProjectId,
							param4: referredAutoId,
							param5: $('#formulaType1').val(),
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
					formulaTable.localParam.urlparam.param5 = referredAutoId;
					BdoDataTable('formulaTable', formulaTable);
					break;
				default:
					break;
			}
		});
		// 标签分类
		$('#tagSort').change((event) => {
			if($('#tagSort').val() == 'mergeNote'){
				tagsTable.localParam.urlparam.param4 = autoId;
			} else {
				tagsTable.localParam.urlparam.param4 = '';
			}
			$('#tagsTable').DataTable().ajax.reload();
		});
		// 标签类型
		$('#tagType').change((event) => {
			tagsTable.localParam.urlparam.param5 = $('#tagType').val();
			$('#tagsTable').DataTable().ajax.reload();
		});
		// 撤销
		$('#uodoTagBtn').click((event) => {
			let length1 = $('#tagGroup .col-sm-1 input').length;
			if (length1 > 0) {
				$('#tagGroup .col-sm-1')[length1 * 2 - 2].remove();
			}
			let length2 = $('#tagGroup .col-sm-1 select').length;
			if (length2 > 0) {
				$('#tagGroup .col-sm-1')[length2 * 2 - 1].remove();
			}
		});
		// 设置校验数据公式
		$('#ensureBtn').click((event) => {
			let $tagGroupSelect = $('#tagGroup .col-sm-1 select');
			let $tagGroupInput = $('#tagGroup .col-sm-1 input');
			let length = $tagGroupSelect.length;
			if (length === 0) {
				bdoErrorBox('失败', '请正确设置公式！');
				return;
			}
			let formula = $tagGroupInput.val();
			let formulaText = $tagGroupInput.attr('title');

			let inputFirstValue = $('#tagGroup .col-sm-1 input')[0].value;
			let formulaValue = getTagValue(inputFirstValue);
			for (let i = 0; i < length; i++) {
				let inputValue = $('#tagGroup .col-sm-1 input')[i + 1].value;
				let selectValue = $tagGroupSelect[i].value;
				if (selectValue == '') {
					$tagGroupSelect[i].focus();
					bdoErrorBox('失败', '请选择运算符号！');
					return;
				}
				formula = formula + selectValue + inputValue;
				formulaText = formulaText + selectValue + $('#tagGroup .col-sm-1 input')[i + 1].title;

				let value = getTagValue(inputValue);
				formulaValue = formulaValue + selectValue + value;
			}
			if (formula.indexOf('=') === -1 || formula.indexOf('=') !== formula.lastIndexOf('=')) {
				bdoErrorBox('失败', '请正确设置公式！');
				return;
			}
			// 等式左边值
			let formulaValueLeft = formulaValue.substring(0, formulaValue.indexOf('='));
			// 取得具体数值数组
			let formulaValueListLeft = formulaValueLeft.split(/[\+\-]+/);
			// 取得运算符号数组
			let signListLeft = formulaValueLeft.split(/[^\+\-]+/);
			let formulaCalcLeft = formulaValueListLeft[0] == '' ? 0 : formulaValueListLeft[0];
			let formulaValueLeftNew = formulaCalcLeft.toString();
			if (signListLeft.length > 1) {
				let startNumLeft = 1;
				if (signListLeft[0] == '-') {
					startNumLeft = 0;
				}
				for (let i = startNumLeft; i < signListLeft.length - 1; i++) {
					let signLeft = signListLeft[i];
					let signValueLeft = formulaValueListLeft[i + 1 - startNumLeft];
					if (signLeft === '+') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) + parseFloat(signValueLeft);
					} else if (signLeft === '-') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) - parseFloat(signValueLeft);
					} else if (signLeft === '+-') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) - parseFloat(signValueLeft);
					} else if (signLeft === '--') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) + parseFloat(signValueLeft);
					}
				}
			}
			// 等式右边值
			let formulaValueRight = formulaValue.substring(formulaValue.indexOf('=') + 1);
			// 取得具体数值数组
			let formulaValueListRight = formulaValueRight.split(/[\+\-]+/);
			// 取得运算符号数组
			let signListRight = formulaValueRight.split(/[^\+\-]+/);
			let formulaCalcRight = formulaValueListRight[0] == '' ? 0 : formulaValueListRight[0];
			if (signListRight.length > 1) {
				let startNumRight = 1;
				if (signListRight[0] == '-') {
					startNumRight = 0;
				}
				for (let i = startNumRight; i < signListRight.length - 1; i++) {
					let signRight = signListRight[i];
					let signValueRight = formulaValueListRight[i + 1 - startNumRight];
					if (signRight === '+') {
						formulaCalcRight = parseFloat(formulaCalcRight) + parseFloat(signValueRight);
					}
					if (signRight === '-') {
						formulaCalcRight = parseFloat(formulaCalcRight) - parseFloat(signValueRight);
					}
					if (signRight === '+-') {
						formulaCalcRight = parseFloat(formulaCalcRight) - parseFloat(signValueRight);
					}
					if (signRight === '--') {
						formulaCalcRight = parseFloat(formulaCalcRight) + parseFloat(signValueRight);
					}
				}
			}
			// 等式左边等于等式右边 1:计算结果正确
			if (parseFloat(formulaCalcLeft).toFixed(2) == parseFloat(formulaCalcRight).toFixed(2)) {
				var formulaCal = '1';
			} else {
				var formulaCal = '0';
			}
			let formulaAutoId = formula.replace(/p/g,'');
			let tagAllId = formulaAutoId.replace(/=/g,',').replace(/\+/g,',').replace(/-/g,',');
			$.ajax({
				type: 'post',
				url: 'dgCenter/HbMergeFormulaCheck.setProjectFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: mergeProjectId,
					param4: formula.replace(/\+/g, '%2B'),
					param5: formulaText.replace(/\+/g, '%2B'),
					param6: formulaValue.replace(/\+/g, '%2B'),
					param7: formulaCal,
					param8: formulaAutoId.replace(/\+/g, '%2B'),
					param9: '',
					param10: '',
					param11: tagAllId,
					param12: $('#formulaType').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox('成功', '设置校验数据公式成功！');
						$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
						$('#formulaTable').DataTable().ajax.reload();
						let $tagGroup = $('#tagGroup .col-sm-1');
						$tagGroup.remove();
					} else {
						bdoErrorBox('失败', '设置校验数据公式失败！');
					}
				}
			});
		});
		// 获取标签值
		function getTagValue(inputText) {
			var tagValue = 0;
			var tagId = inputText.replace('p', '');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00311',
					param1: customerId,
					param2: projectId,
					param3: mergeProjectId,
					param5: tagId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						tagValue = data.data[0].tagValue;
					}
				}
			});
			return parseFloat(tagValue).toFixed(2);
		}
		$('#formulaTabDiv').on('click', 'a[class="tableRefresh"]', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00316',
					param1: customerId,
					param2: projectId,
					param3: mergeProjectId,
					param4: referredAutoId,
					param5: $('#formulaType1').val(),
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
		});
		// 公式校验分类
		$('#formulaSort').change((event) => {
			if($('#formulaSort').val() == 'mergeNote'){
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00318',
						param1: customerId,
						param2: projectId,
						param3: mergeProjectId,
						param4: 'MERGENOTE',
						param5: autoId,
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
			}else{
				referredAutoId = '';
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00316',
					param1: customerId,
					param2: projectId,
					param3: mergeProjectId,
					param4: referredAutoId,
					param5: $('#formulaType1').val(),
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
			formulaTable.localParam.urlparam.param5 = referredAutoId;
			$('#formulaTable').DataTable().ajax.reload();
		});
		// 公式校验类型
		$('#formulaType1').change((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00316',
					param1: customerId,
					param2: projectId,
					param3: mergeProjectId,
					param4: referredAutoId,
					param5: $('#formulaType1').val(),
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
			formulaTable.localParam.urlparam.param4 = $('#formulaType1').val();
			$('#formulaTable').DataTable().ajax.reload();
		});
		// 校验公式
		$('#checkFormulaBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/HbMergeFormulaCheck.checkFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: customerId,
					param2: projectId,
					param3: mergeProjectId,
					param4: $('#formulaType1').val(),
					param5: referredAutoId,
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
		$('#formulaTable').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00376',
					param1: tagid,
					param2: customerId,
					param3: projectId,
					param4: mergeProjectId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success && data.data[0]) {
						var tagInfo = JSON.parse(data.data[0].tagInfo)[0];
						if(tagInfo.type == 'mergeNote'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00377',
									param1: tagInfo.noteAutoId,
									param2: customerId,
									param3: projectId,
									param4: mergeProjectId,
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
										$.sessionStorage('mergeNoteInfoNode', JSON.stringify(nodeData));
										window.open('/Faith/dgcenter.do?m=openMergeNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}else if(tagInfo.type == 'mergeReport'){
							var text = '';
							var colName = tagInfo.colName;
							var reportValType = tagInfo.reportValType;
							if (('递延所得税资产' == colName || '递延所得税负债' == colName) && reportValType == null) {
								text = data.data[0].tagName;
							}else{
								text = '该标签为合并报表"' + tagInfo.colCode + '-' + tagInfo.colName + '"的"' + tagInfo.reportValDesc + '"';
							}
							swal(text);
						}else if(tagInfo.type == 'mergeAdjust'){
							var text = '该标签为附注"' + designer.noteExtraOptions.noteName + '"的"审计调整数--' + tagInfo.valDesc + '"';
							swal(text);
						}else if(tagInfo.type == 'mergeNoteBak'){
							var fileId = tagInfo.noteAutoId;
							$('#dgFileTabs li', window.parent.document).removeClass('active');
							$('#dgFileTabContent div', window.parent.document).removeClass('active');
							if ($('#mergenote_bak_' + fileId, window.parent.document).length == 0) {
								setNoteNode(fileId, tagInfo.mergeProjectId);
								var excelnode = designer.excelnode;
								excelnode.isBak = 1;
								$.sessionStorage('excelnode', JSON.stringify(excelnode));
								$('#dgFileTabs', window.parent.document).append('<li class=\'active\'><a href=\'#mergenote_bak_' + fileId + '\'><h5 class=\'block-title\'>' + tagInfo.fileName.substring(0, tagInfo.fileName.lastIndexOf('.')) + 'bak' + '<i class=\'fa fa-remove tab-close\' style=\'cursor:pointer;\'></i></h5></a></li>');
								var $div = $('<div class="postil-content-wrap tab-pane active" id="mergenote_bak_' + fileId + '">'
									+ '<iframe id="iframe_mergeNote_bak_' + fileId + '" src="/Faith/dgcenter.do?m=openMergeNoteInfoSecond&noteNo=' + tagInfo.noteNo + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
									+ '</div>');
								$('#dgFileTabContent', window.parent.document).append($div);
								$('#dgFileTabs a:last', window.parent.document).tab('show');
								if ($('.aside-hide', window.parent.document).length !== 0) {
									$('body', window.parent.document).toggleClass('aside-hide');
									$(window).resize();
								}
							} else {
								$('[href="#mergenote_' + fileId + '"]', window.parent.document).tab('show');
								$('#mergenote_' + fileId, window.parent.document).addClass('active');
							}
						}
					}
				}
			});
		});
		// 编辑公式
		$('#formulaTable').on('click', 'button[name="editFormula"]', function() {
			var object = $('#formulaTable').DataTable().data()[$(this).closest('tr').index()];
			$('#tagGroup').html('');
			$('#formulaType').val(object.formulaType);
			var title = object.formulaText.split(/[\+\-\=]+/);
			var text = object.formula.split(/[\+\-\=]+/);
			var sign = object.formula.split(/[^\+\-\=]+/);
			var txt;
			for (var i = 0; i < text.length; i++) {
				txt = $('<div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" value=\"' + text[i] + '\" title=\"' + title[i] + '\" readonly=\"readonly\"></div></div>');
				$('#tagGroup').append(txt);
				if (i + 1 < sign.length - 1) {
					txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"\"></option><option value=\"=\">=</option><option value=\"+">+</option><option value=\"-\">-</option></select></div></div>');
					$('#tagGroup').append(txt);
					$('#tagGroup .col-sm-1 select')[i].value = sign[i + 1];
				}
			}
			$('#formulaModal [data-toggle="tabs"] a:first').tab('show');
		});
		$('#formulaTable').on('click', 'button[name="delFormula"]', function() {
			var object = $('#formulaTable').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('提示', '确定是否删除该校验公式？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/HbMergeFormulaCheck.delFormula.json',
					// async: false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: object.autoId,
						param2: customerId,
						param3: projectId,
						param4: mergeProjectId
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00316',
									param1: customerId,
									param2: projectId,
									param3: mergeProjectId,
									param4: referredAutoId,
									param5: $('#formulaType1').val(),
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
							$('#formulaTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', '成功删除校验公式！');
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});
		// 附注取数弹出框
		$('#mergeNoteFetchDataBtn').click(e => {
			$('#mergeNoteFetchDataDiv').css('display', 'block');
			BdoDataTable('offsetEntryData_table', offsetEntryData_table_view);
		});
		// 关闭附注取数弹出框
		$('#modal_fetchData_cancel').click(function() {
			$('#mergeNoteFetchDataDiv').css('display', 'none');
		});
		// 设置所有抵销数据
		$('#modal_offsetEntry_sure').click(function() {
			bdoConfirmBox('提示', '确定是否设置所有抵销数据？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'HB00025',
						param1: customerId,
						param2: projectId,
						param3: _data.extraOptions.colCode,
						param4: _data.extraOptions.colName,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if(data.data && data.data[0].direction){
								var direction = data.data[0].direction * -1;
								var table = $('#offsetEntryData_table').dataTable();
								var data = table.fnGetData();
								if (data.length == 0) {
									bdoInfoBox('提示', '无抵消分录数据！');
									return;
								}
								var sheetList1 = ['本期金额', '期末余额', '期末余额-账面余额', '期末余额-' + _data.extraOptions.colName];
								var sheetList2 = ['上期金额', '上年年末余额', '上年余额', '上年年末余额-账面余额', '上年年末余额-' + _data.extraOptions.colName];
								var year = window.CUR_PROJECT_ACC_YEAR;
								var lastYear = window.CUR_PROJECT_ACC_YEAR - 1;
								clearExcelEntryData(data, sheetList1, sheetList2, year, lastYear)
								for (var rowData of data) {
									var sheet;
									if(rowData.yyyy == year){
										for (var value of sheetList1) {
											sheet = spread.getSheetFromName(value);
											if(sheet != null) break;
										}
									}else if(rowData.yyyy == lastYear){
										for (var value of sheetList2) {
											sheet = spread.getSheetFromName(value);
											if(sheet != null) break;
										}
									}
									if(sheet == null) continue;
									refreshEntryData(rowData, sheet, direction);
								}
							}
						}
					}
				});
			});
		});
		// 设置抵消分录数据前，清空
		function clearExcelEntryData(data, sheetList1, sheetList2, year, lastYear){
			for (var rowData of data) {
				var sheet;
				if(rowData.yyyy == year){
					for (var value of sheetList1) {
						sheet = spread.getSheetFromName(value);
						if(sheet != null) break;
					}
				}else if(rowData.yyyy == lastYear){
					for (var value of sheetList2) {
						sheet = spread.getSheetFromName(value);
						if(sheet != null) break;
					}
				}
				if(sheet == null) continue;
				for(var i = 0;i < sheet.getRowCount();i++){
					var text = sheet.getText(i, 0).trim();
					if(text == '') continue;
					if(rowData.secondSubject != null){
						if(text == rowData.secondSubject.trim()){
							sheet.clear(i, 2, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
							break;
						}
					}else{
						if(text == '合计'){
							sheet.clear(i, 2, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
							break;
						}
					}
				}
			}
		}
		// 填充抵消分录数据
		function refreshEntryData(rowData, sheet, direction){
			var sheetIndex = parseInt(designer.Spread.getSheetIndex(sheet.name()));
			designer.Spread.setActiveSheetIndex(sheetIndex);
			for(var i = 0;i < sheet.getRowCount();i++){
				var text = sheet.getText(i, 0).trim();
				if(text == '') continue;
				// 抵销数
				var value = sheet.getValue(i, 2);
				// 借方抵销
				var deb = rowData.deb;
				// 贷方抵销
				var cre = rowData.cre;
				var occValue = (deb - cre) * direction;
				// 抵销数
				value = value + occValue;
				if(rowData.secondSubject != null){
					if(text == rowData.secondSubject.trim()){
						sheet.setValue(i, 2, value);
						break;
					}
				}else{
					if(text == '合计'){
						sheet.setValue(i, 2, value);
						break;
					}
				}
			}
		}
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
				param1: autoId,
				param2: customerId,
				param3: projectId,
				param4: mergeProjectId
			});
			$('#fileFullPath').text(fullPath);
		});
		DgDesignerPage({region: '#designerment', data: _data});
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
			url: 'dgCenter/HbMergeProjectNoteInfo.saveMergeNoteInfo.json',
			type: 'post',
			data: formData,
			contentType: false,
			processData: false,
			success(data) {
				if (data.success) {
					var time = data.data[0].time;
					storage.setItem(storageTime, time);
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$.ajax({
						url: 'dgCenter/HbMergeProjectNoteInfo.checkMergeNoteFormula.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: customerId,
							param2: projectId,
							param3: mergeProjectId,
							param4: 'MERGENOTE',
							param5: autoId
						},
						dataType: 'json',
						success(data) {
							if (!data.success) {
								// bdoErrorBox(data.resultInfo.statusText);
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
			url: 'dgCenter/HbMergeProjectNoteInfo.getMergeNoteInfo.json',
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
			param.autoId = autoId;
			param.customerId = customerId;
			param.projectId = projectId;
			param.mergeProjectId = mergeProjectId;
			param.yyyy = window.CUR_PROJECT_ACC_YEAR;
			
			let objMergeNote = {};
			/*let mergeNoteCacheMap = designer.MergeNoteCacheMap;
			for (let[k,v] of mergeNoteCacheMap) {
				objMergeNote[k] = v;
			}*/
			param.customizeStyle = JSON.stringify({
				MergeNoteCacheMap: objMergeNote
			});
			param.customerId = window.CUR_CUSTOMERID;
			param.projectId = window.CUR_PROJECTID;
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
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: autoId,
								param2: customerId,
								param3: projectId,
								param4: mergeProjectId
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
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: autoId,
							param2: customerId,
							param3: projectId,
							param4: mergeProjectId
						});
						$('#fileFullPath').text(fullPath);
					});
				}, 0);
			});
		}
	};

	// 设置附注文件节点信息
	function setNoteNode(fileId, subProjectId) {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async: false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00310',
				param1: fileId,
				param2: customerId,
				param3: projectId,
				param4: subProjectId,
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
					designer.excelnode = nodeData;
				}
			}
		});
	}

	mount();
};