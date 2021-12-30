function spreadJs14Dialogs(designer) {
	/*'use strict';*/
	var Sheets = GC.Spread.Sheets;
	/*var designer = Sheets.Designer;*/
	var dialogHtmlPath = '';

	// 打开附件
	// pdf、jpg、png、jpeg预览
	// 其他文件格式提示下载
	function openSamplingAttach(id, text){
		var fileName = text.substring(text.indexOf(":") + 1);
		var fileSuffix = text.substring(text.lastIndexOf(".") + 1);
		if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" || fileSuffix === "xlsx") {
			$.ajax({
				type : "post",
				url: 'dgCenter/DgGeneral.General.query.json',
				// async : false,
				data : {
					menuId: window.sys_menuId,
					sqlId: 'DG00329',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: id,
					start: -1,
					limit: -1
				},
				dataType : "json",
				success(data) {
					if(data.success) {
						if(data.data[0].num > 0){
							if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg") {
								window.open('/Faith/dgcenter.do?m=previewSamplingAttach&fileName=' + fileName + '&autoId=' + id + '&customerId=' + window.CUR_CUSTOMERID + '&projectId=' + window.CUR_PROJECTID, "_blank" ,"location=no");
							}else if(fileSuffix === "xlsx"){
								var rowData = {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									autoId: id,
									pageType: 2,
									fileName: fileName
								};
								var nodeData = {
									extraOptions: rowData,
									currentNode: {
										extraOptions: rowData
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
			downloadFile('dgCenter/DgDownload.downloadDgAttachFile.json', {param1: id, param2: window.CUR_CUSTOMERID});
		}
	}
	function openDgAttach(fileLink, fileName){
		var autoId = fileLink.substring(0, fileLink.indexOf(":"));
		var fileSuffix = fileName.substring(fileName.lastIndexOf(".") + 1);
		if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" || fileSuffix === "xlsx") {
			$.ajax({
				url : 'dgCenter/DgMain.queryAttachFileExistence.json',
				type : 'post',
				data : {
					param1: autoId,
					param2: window.CUR_CUSTOMERID
				},
				dataType : 'json',
				success : function(data){
					if(data.success){
						if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg") {
							window.open('/Faith/dgcenter.do?m=previewAttach&fileName=' + fileName + '&autoId=' + autoId + '&customerId=' + window.CUR_CUSTOMERID + '&projectId=' + window.CUR_PROJECTID, "_blank" ,"location=no");
						}else if(fileSuffix === "xlsx"){
							var rowData = {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								autoId: autoId,
								pageType: 1,
								fileName: fileName
							};
							var nodeData = {
								extraOptions: rowData,
								currentNode: {
									extraOptions: rowData
								}
							};
							$.sessionStorage('fileNode', JSON.stringify(nodeData));
							window.open('/Faith/dgcenter.do?m=previewFile');
						}
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		} else {
			downloadFile('dgCenter/DgDownload.downloadAttach.json', {param1: autoId, param2: window.CUR_CUSTOMERID});
		}
	}

	// 设置底稿文件节点信息
	function setExcelnode(workPaperId){
		$.ajax({
			type : "post",
			url: 'dgCenter/DgGeneral.General.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00078',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: workPaperId,
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					// 打开底稿
					var nodeData = {
						extraOptions: data.data[0],
						currentNode: {
							extraOptions: data.data[0]
						}
					};
					nodeData.autoId = nodeData.extraOptions.autoId;
					nodeData.workpaperId = nodeData.extraOptions.workpaperId;
					nodeData.menuId = window.sys_menuId;
					designer.excelnode = nodeData;
				}
			}
		});
	}
	// 设置附注文件节点信息
	function setNoteNode(autoId){
		$.ajax({
			type : "post",
			url : 'dgCenter/DgGeneral.General.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00092',
				param1: autoId,
				param2: window.CUR_CUSTOMERID,
				param3: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success){
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

	// 设置底稿sheet名下拉框 paperSelectedId:下拉框已选择底稿 id:下拉框id
	function setDgSheet(paperSelectedId, id){
		if(paperSelectedId == null){
			return;
		}
		$.ajax({
			type : "post",
			url : 'dgCenter/DgMain.getPaperSheetName.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				// param3:底稿文件autoId
				param3: paperSelectedId.substring(0, paperSelectedId.indexOf(':')),
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					$("#" + id).empty();
					$("#" + id).append('<option value=""></option>');
					for(let i=0;i<data.data.length;i++){
						$("#" + id).append('<option value="' + i + '">' + data.data[i][0] + '</option>');
					}
				}
			}
		});
	}

	// 设置附注sheet名下拉框 param1:下拉框已选择附注 param2:下拉框id
	function setNoteSheet(param1, param2){
		// autoId + ':' + noteNo498:2019001729
		$.ajax({
			type : "post",
			url : 'dgCenter/DgWapper.getNoteSheetName.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				// param3:底稿文件autoId
				param3: param1.substring(0, param1.indexOf(':')),
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					$("#" + param2).empty();
					$("#" + param2).append('<option value=""></option>');
					for(let i = 0;i < data.data.length;i++){
						$("#" + param2).append('<option value="' + i + '">' + data.data[i][0] + '</option>');
					}
				}
			}
		});
	}

	// 打开底稿
	function openDgFile(dgFileId, dgFileIndexId, dgFileName){
		if(dgFileId !== ''){
			if($('#dg_' + dgFileId, window.parent.document).length == 0){
				$('#dgFileTabs li', window.parent.document).removeClass('active');
				$('#dgFileTabContent div', window.parent.document).removeClass('active');
				setExcelnode(dgFileId);
				var excelnode = designer.excelnode;
				$.sessionStorage('excelnode', JSON.stringify(excelnode));
				$('#dgFileTabs', window.parent.document).append("<li class='active'><a href='#dg_" + dgFileId + "'><h5 class='block-title'>" + dgFileName + "&nbsp;<i class='fa fa-remove tab-close' style='cursor:pointer;'></i></h5></a></li>");
				var $div = $('<div class="postil-content-wrap tab-pane active" id="dg_' + dgFileId + '">' 
						+ 	'<iframe id="iframe_dg_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgIframe&index=' + dgFileIndexId + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'  
						+ '</div>');
				$('#dgFileTabContent', window.parent.document).append($div);
				$('#dgFileTabs a:last', window.parent.document).tab('show');
				if($('.aside-hide', window.parent.document).length !== 0){
					$('body', window.parent.document).toggleClass('aside-hide');
					$(window).resize();
				}
			}else{
				$('[href="#dg_' + dgFileId + '"]', window.parent.document).tab('show');
				$('#dg_' + dgFileId, window.parent.document).addClass('active');
			}
		}else{
			designer.MessageBox.show('请选择底稿', '', 3);
		}
	}

	// 打开附注
	function openNoteFile(dgFileId, dgFileIndexId, dgFileName){
		if(dgFileId !== ''){
			if($('#note_' + dgFileId, window.parent.document).length == 0){
				$('#dgFileTabs li', window.parent.document).removeClass('active');
				$('#dgFileTabContent div', window.parent.document).removeClass('active');
				setNoteNode(dgFileId);
				var excelnode = designer.excelnode;
				$.sessionStorage('excelnode', JSON.stringify(excelnode));
				$('#dgFileTabs', window.parent.document).append("<li class='active'><a href='#note_" + dgFileId + "'><h5 class='block-title'>" + dgFileName + "&nbsp;<i class='fa fa-remove tab-close' style='cursor:pointer;'></i></h5></a></li>");
				var $div = $('<div class="postil-content-wrap tab-pane active" id="note_' + dgFileId + '">' 
						+ 	'<iframe id="iframe_note_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgNoteIframe&index=' + dgFileIndexId + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'  
						+ '</div>');
				$('#dgFileTabContent', window.parent.document).append($div);
				$('#dgFileTabs a:last', window.parent.document).tab('show');
				if($('.aside-hide', window.parent.document).length !== 0){
					$('body', window.parent.document).toggleClass('aside-hide');
					$(window).resize();
				}
			}else{
				$('[href="#note_' + dgFileId + '"]', window.parent.document).tab('show');
				$('#note_' + dgFileId, window.parent.document).addClass('active');
			}
		}else{
			designer.MessageBox.show('请选择附注', '', 3);
		}
	}

	// 检查底稿是否存在
	function checkDgExist(workpaperId){
		let isExist = true;
		$.ajax({
			type : "post",
			url: 'dgCenter/DgGeneral.General.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00179',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: workpaperId,
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					if(data.data[0].num == 0){
						isExist = false;
					}
				}
			}
		});
		return isExist;
	}

	// 检查底稿附件是否存在
	function checkAttachExist(attachmentId){
		let isExist = true;
		$.ajax({
			type : "post",
			url: 'dgCenter/DgGeneral.General.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00180',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: attachmentId,
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					if(data.data[0].num == 0){
						isExist = false;
					}
				}
			}
		});
		return isExist;
	}

	// 检查附注是否存在
	function checkNoteExist(noteId){
		let isExist = true;
		$.ajax({
			type : "post",
			url: 'dgCenter/DgGeneral.General.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00181',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: noteId,
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					if(data.data[0].num == 0){
						isExist = false;
					}
				}
			}
		});
		return isExist;
	}

	// 检查附注是否存在
	function checkSamplingAttachExist(id){
		let isExist = true;
		$.ajax({
			type : "post",
			url: 'dgCenter/DgGeneral.General.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00329',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: id,
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					if(data.data[0].num == 0){
						isExist = false;
					}
				}
			}
		});
		return isExist;
	}

	/* ZQF 自定义 START */
	//自定义单元格类型
	var ShowTagCellType = (function () {
		function ShowTagCellType() {
			this.typeName = "ShowTagCellType";
			this._cellTagStartCache = undefined;
			this._textWidth = undefined;
		}
		ShowTagCellType.prototype = new GC.Spread.Sheets.CellTypes.Text();
		ShowTagCellType.prototype.paintContent = function (ctx, value, x, y, w, h, style, context) {
			var tag = context.sheet.getTag(context.row, context.col);
			if (tag == '' || tag == null || tag === undefined) {
				this._cellTagStartCache = undefined;
				this._textWidth = undefined;
				GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w, h, style, context);
				return;
			}
			this._cellTagStartCache = [], this._textWidth = 0;
			var startTextWidth = 0, endTextWidth = 0;
			var sheet = context.sheet, zoomFactor = sheet.zoom();
			var foreColor = style.foreColor, textDecoration = style.textDecoration;

			//为了实现简单，单元格垂直居中，如果有其他需求，绘制文字位置重新计算
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;

			for (var i = 0; i < tag.cellTagStart.length; i++) {
				var node = tag.cellTagStart[i];

				if (node.type === 'link') {
					style.foreColor = "blue";
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					if (node.isFile) {
						this._cellTagStartCache[i] = {
							startX: x + startTextWidth,
							textWidth: textWidth + 3,
							isFile: node.isFile,
							isPaper: node.isPaper,
							paperLink: node.paperLink,
							attachmentLink: node.attachmentLink,
							fileName: node.fileName,
							paperName: node.paperName
						};
					} else {
						this._cellTagStartCache[i] = {
							startX: x + startTextWidth,
							textWidth: textWidth + 3,
							isFile: node.isFile,
							formula: node.link,
							displayText: node.displayText,
							paperListCell: node.paperListCell,
							paperTextCell: node.paperTextCell,
							sheetName: node.sheetName
						};
					}
					startTextWidth += (textWidth + 3);
				}
			}
			this._textWidth += startTextWidth;

			// Set Font to default
			style.foreColor = foreColor;
			style.textDecoration = textDecoration;

			//Paint Value
			// style.font = "bold " + style.font;
			style.hAlign = GC.Spread.Sheets.HorizontalAlign.right;
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;
			GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w - endTextWidth - 3, h, style, context)

		};

		ShowTagCellType.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
			var info = {
				x: x,
				y: y,
				row: context.row,
				col: context.col,
				cellRect: cellRect,
				sheetArea: context.sheetArea,
				isReservedLocation: false,
				reservedLocation: -1
			};
			for (var i = 0; i < this._cellTagStartCache.length; i++) {
				var item = this._cellTagStartCache[i];
				if (item) {
					var startX = item.startX;
					if (x - startX > 0 && x < startX + item.textWidth) {
						info.isReservedLocation = true;
						info.reservedLocation = i;
						break;
					}
				}
			}
			return info;
		};
		ShowTagCellType.prototype.processMouseUp = function (hitInfo) {
			var sheet = hitInfo.sheet, self = this;
			if (sheet && hitInfo.isReservedLocation && hitInfo.reservedLocation >= 0) {
				setTimeout(function () {
					if (self._toolTipElement) {
						document.body.removeChild(self._toolTipElement);
						self._toolTipElement = null;
					}
					var isFile = self._cellTagStartCache[hitInfo.reservedLocation].isFile;
					if (isFile) {
						var isPaper = self._cellTagStartCache[hitInfo.reservedLocation].isPaper;
						var fileLink;
						if (isPaper) {
							fileLink = self._cellTagStartCache[hitInfo.reservedLocation].paperLink;
							var dgFileId = fileLink.substring(0, fileLink.indexOf(":"));
							var dgFileIndexId = fileLink.substring(fileLink.indexOf(":") + 1);
							var dgFileName = self._cellTagStartCache[hitInfo.reservedLocation].paperName;
							openDgFile(dgFileId, dgFileIndexId, dgFileName);
						} else {
							// 打开附件
							fileLink = self._cellTagStartCache[hitInfo.reservedLocation].attachmentLink;
							var fileName = self._cellTagStartCache[hitInfo.reservedLocation].fileName;
							openDgAttach(fileLink, fileName);
						}
					} else {
						// paperCell = 底稿文件索引号(6603-0100-0001) : 底稿文件autoId(321)
						let paperCell = self._cellTagStartCache[hitInfo.reservedLocation].paperListCell;
						let indexId = paperCell.substring(paperCell.indexOf(':') + 1);
						let workPaperId = paperCell.substring(0, paperCell.indexOf(':'));
						let formula = self._cellTagStartCache[hitInfo.reservedLocation].formula;
						// 跳转到底稿本身的单元格时，不用打开新底稿
						if(workPaperId == designer.workpaperId){
							let sheetIndex = parseInt(formula.substring(0,formula.indexOf(':')));
							let rangeStr = formula.substring(formula.indexOf(':') + 1);
							let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.wrapper.spread.getActiveSheet(), rangeStr, 0, 0);
							designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
							designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);
							var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
							// var horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
							designer.wrapper.spread.getActiveSheet().showRow(range.row, verticalPosition);
							// designer.wrapper.spread.getActiveSheet().showCell(range.row, range.col, verticalPosition, horizontalPosition);
							return;
						}
						
						if($('#dg_' + workPaperId, window.parent.document).length > 0){
							$('[href="#dg_' + workPaperId + '"]', window.parent.document).parent().remove();
							$('#dg_' + workPaperId, window.parent.document).remove();
						}
						// session节点 跳转到指定单元格 --> designer.setCellLink()
						$.sessionStorage('cellLinkFormula', JSON.stringify(formula));
						let dgFileName = self._cellTagStartCache[hitInfo.reservedLocation].paperTextCell;
						openDgFile(workPaperId, indexId, dgFileName);
					}
				}, 10);
				return true;
			}
			return false;
		};

		ShowTagCellType.prototype.processMouseMove = function (hitInfo) {
			var sheet = hitInfo.sheet;
			var div = sheet.getParent().getHost();
			var canvasId = div.id + "vp_vp";
			var canvas = $("#" + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div1 = document.createElement("div");
					$(div1).css("position", "absolute")
						.css("border", "1px #C0C0C0 solid")
						.css("box-shadow", "1px 2px 5px rgba(0,0,0,0.4)")
						.css("font", "9pt Arial")
						.css("background", "white")
						.css("padding", 5);
					this._toolTipElement = div1;
				}
				if (this._cellTagStartCache[hitInfo.reservedLocation].isFile) {
					$(this._toolTipElement).text(this._cellTagStartCache[hitInfo.reservedLocation].fileName).css("top", hitInfo.y + 190).css("left", hitInfo.x + 15);
				} else {
					var formula = this._cellTagStartCache[hitInfo.reservedLocation].formula;
					$(this._toolTipElement).text(this._cellTagStartCache[hitInfo.reservedLocation].paperTextCell + ':' + this._cellTagStartCache[hitInfo.reservedLocation].sheetName + formula.substring(formula.indexOf(":"))).css("top", hitInfo.y + 190).css("left", hitInfo.x + 15);
				}
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show("fast");
				return true;
			}
			return false;
		};

		ShowTagCellType.prototype.processMouseLeave = function (hitInfo) {
			if (this._toolTipElement) {
				document.body.removeChild(this._toolTipElement);
				this._toolTipElement = null;
			}
		};

		ShowTagCellType.prototype.getAutoFitWidth = function (value, text, cellStyle, zoomFactor, context) {
			if (this._textWidth) {
				// cellStyle.font = "bold " + cellStyle.font;
				return 5 + this._textWidth + GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context);
			} else {
				return GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context)
			}
		};
		return ShowTagCellType;
	})();
	designer.ShowTagCellType = ShowTagCellType;

	designer.ShowTagCellTypeCacheMap = new Map();

	// 单向链接 初始化页面时显示所有底稿单向链接
	designer.setShowTagCellTypeCacheMap = function (mapJson, cellInfo) {
		if (mapJson === undefined) {return;}
		let strMap = new Map();
		// json转换为map
		for (let k of Object.keys(mapJson)) {
			strMap.set(k, mapJson[k]);
		}
		designer.ShowTagCellTypeCacheMap = strMap;
		for (let cellLink of designer.ShowTagCellTypeCacheMap) {
			var cellTagStart = cellLink[1];
			for(let i = 0;i < cellTagStart.length;i++){
				let data = cellTagStart[i];
				let workpaperId = '';
				let attachmentId = '';
				if(data.isFile){
					workpaperId = data.paperLink.substring(0, data.paperLink.indexOf(':'));
					if(!data.isPaper){
						attachmentId = data.attachmentLink.substring(0, data.attachmentLink.indexOf(':'));
					}
				}else{
					workpaperId = data.paperListCell.substring(0, data.paperListCell.indexOf(':'));
				}
				if(attachmentId != ''){
					if(!checkAttachExist(attachmentId)){
						cellTagStart.splice(i , 1);
						i = i - 1;
					}else{
						if(!checkDgExist(workpaperId)){
							cellTagStart.splice(i , 1);
							i = i - 1;
						}
					}
				}else{
					if(!checkDgExist(workpaperId)){
						cellTagStart.splice(i , 1);
						i = i - 1;
					}
				}
			}
			// cellLink[0] = sheetIndex + ":" + row + ":" + col
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(":")));
			var sheet = designer.wrapper.spread.getSheet(sheetIndex);
			if(sheet == null){
				continue;
			}
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(":") + 1,cellLink[0].lastIndexOf(":")));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(":") + 1));
			designer.wrapper.spread.suspendPaint();
			var activeCell = sheet.getCell(row, col);
			if(activeCell == null){
				continue;
			}
			activeCell.cellType(new designer.ShowTagCellType());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.wrapper.spread.resumePaint();
		}
		if (cellInfo.sheet.constructor == String){
			var index = designer.wrapper.spread.getSheetIndex(cellInfo.sheet);
			designer.wrapper.spread.setActiveSheetIndex(index);
		} else {
			designer.wrapper.spread.setActiveSheetIndex(cellInfo.sheet);
		}
		var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
		// var horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
		if (cellInfo.row && cellInfo.col) {
			designer.wrapper.spread.getActiveSheet().setActiveCell(parseInt(cellInfo.row), parseInt(cellInfo.col));
			var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
			designer.wrapper.spread.getActiveSheet().showRow(parseInt(cellInfo.row), verticalPosition);
			// designer.wrapper.spread.getActiveSheet().showCell(parseInt(cellInfo.row), parseInt(cellInfo.col), verticalPosition, horizontalPosition);
		} else {
			designer.wrapper.spread.getActiveSheet().setActiveCell(0, 0);
			designer.wrapper.spread.getActiveSheet().showRow(0, verticalPosition);
			// designer.wrapper.spread.getActiveSheet().showCell(0, 0, verticalPosition, horizontalPosition);
		}
	};

	var ShowAuditSampling = (function () {
		function ShowAuditSampling() {
			this.typeName = "ShowAuditSampling";
			this._cellTagStartCache = undefined;
			this._textWidth = undefined;
		}
		ShowAuditSampling.prototype = new GC.Spread.Sheets.CellTypes.Text();
		ShowAuditSampling.prototype.paintContent = function (ctx, value, x, y, w, h, style, context) {
			var tag = context.sheet.getTag(context.row, context.col);
			if (tag == '' || tag == null || tag === undefined) {
				this._cellTagStartCache = undefined;
				this._textWidth = undefined;
				GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w, h, style, context);
				return;
			}
			this._cellTagStartCache = [], this._textWidth = 0;
			var startTextWidth = 0, endTextWidth = 0;
			var sheet = context.sheet, zoomFactor = sheet.zoom();
			var foreColor = style.foreColor, textDecoration = style.textDecoration;

			//为了实现简单，单元格垂直居中，如果有其他需求，绘制文字位置重新计算
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;

			for (var i = 0; i < tag.cellTagStart.length; i++) {
				var node = tag.cellTagStart[i];

				if (node.type === 'link') {
					style.foreColor = "blue";
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					this._cellTagStartCache[i] = {
						startX: x + startTextWidth,
						textWidth: textWidth + 3,
						id: node.id,
						text: node.text,
						indexId: node.indexId
					};
					startTextWidth += (textWidth + 3);
				}
			}
			this._textWidth += startTextWidth;

			// Set Font to default
			style.foreColor = foreColor;
			style.textDecoration = textDecoration;

			//Paint Value
			// style.font = "bold " + style.font;
			style.hAlign = GC.Spread.Sheets.HorizontalAlign.right;
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;
			GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w - endTextWidth - 3, h, style, context)

		};

		ShowAuditSampling.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
			var info = {
				x: x,
				y: y,
				row: context.row,
				col: context.col,
				cellRect: cellRect,
				sheetArea: context.sheetArea,
				isReservedLocation: false,
				reservedLocation: -1
			};
			for (var i = 0; i < this._cellTagStartCache.length; i++) {
				var item = this._cellTagStartCache[i];
				if (item) {
					var startX = item.startX;
					if (x - startX > 0 && x < startX + item.textWidth) {
						info.isReservedLocation = true;
						info.reservedLocation = i;
						break;
					}
				}
			}
			return info;
		};
		ShowAuditSampling.prototype.processMouseUp = function (hitInfo) {
			var sheet = hitInfo.sheet, self = this;
			if (sheet && hitInfo.isReservedLocation && hitInfo.reservedLocation >= 0) {
				setTimeout(function () {
					if (self._toolTipElement) {
						document.body.removeChild(self._toolTipElement);
						self._toolTipElement = null;
					}
					var id = self._cellTagStartCache[hitInfo.reservedLocation].id;
					var text = self._cellTagStartCache[hitInfo.reservedLocation].text;
					// 打开抽凭附件
					openSamplingAttach(id, text);
				}, 10);
				return true;
			}
			return false;
		};

		ShowAuditSampling.prototype.processMouseMove = function (hitInfo) {
			var sheet = hitInfo.sheet;
			var div = sheet.getParent().getHost();
			var canvasId = div.id + "vp_vp";
			var canvas = $("#" + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div1 = document.createElement("div");
					$(div1).css("position", "absolute")
						.css("border", "1px #C0C0C0 solid")
						.css("box-shadow", "1px 2px 5px rgba(0,0,0,0.4)")
						.css("font", "9pt Arial")
						.css("background", "white")
						.css("padding", 5);
					this._toolTipElement = div1;
				}
				$(this._toolTipElement).text(this._cellTagStartCache[hitInfo.reservedLocation].text).css("top", hitInfo.y + 190).css("left", hitInfo.x + 15);
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show("fast");
				return true;
			}
			return false;
		};

		ShowAuditSampling.prototype.processMouseLeave = function (hitInfo) {
			if (this._toolTipElement) {
				document.body.removeChild(this._toolTipElement);
				this._toolTipElement = null;
			}
		};

		ShowAuditSampling.prototype.getAutoFitWidth = function (value, text, cellStyle, zoomFactor, context) {
			if (this._textWidth) {
				// cellStyle.font = "bold " + cellStyle.font;
				return 5 + this._textWidth + GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context);
			} else {
				return GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context)
			}
		};
		return ShowAuditSampling;
	})();
	designer.ShowAuditSampling = ShowAuditSampling;

	designer.ShowAuditSamplingCacheMap = new Map();

	// 抽凭附件链接
	designer.setShowAuditSamplingCacheMap = function (mapJson, cellInfo) {
		if (mapJson === undefined) {return;}
		let strMap = new Map();
		// json转换为map
		for (let k of Object.keys(mapJson)) {
			strMap.set(k, mapJson[k]);
		}
		designer.ShowAuditSamplingCacheMap = strMap;
		for (let cellLink of designer.ShowAuditSamplingCacheMap) {
			var cellTagStart = cellLink[1];
			for(let i = 0;i < cellTagStart.length;i++){
				let data = cellTagStart[i];
				if(!checkSamplingAttachExist(data.id)){
					cellTagStart.splice(i , 1);
					i = i - 1;
				}
			}
			// cellLink[0] = sheetIndex + ":" + row + ":" + col
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(":")));
			var sheet = designer.wrapper.spread.getSheet(sheetIndex);
			if(sheet == null){
				continue;
			}
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(":") + 1,cellLink[0].lastIndexOf(":")));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(":") + 1));
			designer.wrapper.spread.suspendPaint();
			var activeCell = sheet.getCell(row, col);
			if(activeCell == null){
				continue;
			}
			activeCell.cellType(new designer.ShowAuditSampling());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.wrapper.spread.resumePaint();
		}
		if (cellInfo.sheet.constructor == String){
			var index = designer.wrapper.spread.getSheetIndex(cellInfo.sheet);
			designer.wrapper.spread.setActiveSheetIndex(index);
		} else {
			designer.wrapper.spread.setActiveSheetIndex(cellInfo.sheet);
		}
		var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
		// var horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
		if (cellInfo.row && cellInfo.col) {
			designer.wrapper.spread.getActiveSheet().setActiveCell(parseInt(cellInfo.row), parseInt(cellInfo.col));
			var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
			designer.wrapper.spread.getActiveSheet().showRow(parseInt(cellInfo.row), verticalPosition);
			// designer.wrapper.spread.getActiveSheet().showCell(parseInt(cellInfo.row), parseInt(cellInfo.col), verticalPosition, horizontalPosition);
		} else {
			designer.wrapper.spread.getActiveSheet().setActiveCell(0, 0);
			designer.wrapper.spread.getActiveSheet().showRow(0, verticalPosition);
			// designer.wrapper.spread.getActiveSheet().showCell(0, 0, verticalPosition, horizontalPosition);
		}
	};

	var ShowMutualIndex = (function () {
		function ShowMutualIndex() {
			this.typeName = "ShowMutualIndex";
			this._cellTagStartCache = undefined;
			this._cellTagEndCache = undefined;
			this._textWidth = undefined;
		}
		ShowMutualIndex.prototype = new GC.Spread.Sheets.CellTypes.Text();
		ShowMutualIndex.prototype.paintContent = function (ctx, value, x, y, w, h, style, context) {
			var tag = context.sheet.getTag(context.row, context.col);
			if (tag == '' || tag == null || tag === undefined) {
				this._cellTagStartCache = undefined;
				this._cellTagEndCache = undefined,
				this._textWidth = undefined;
				GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w, h, style, context);
				return;
			}
			this._cellTagStartCache = [], this._cellTagEndCache = [], this._textWidth = 0;
			var startTextWidth = 0, endTextWidth = 0;
			var sheet = context.sheet, zoomFactor = sheet.zoom();
			var foreColor = style.foreColor, textDecoration = style.textDecoration;

			//为了实现简单，单元格垂直居中，如果有其他需求，绘制文字位置重新计算
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;

			if (tag.cellTagStart.length > 0) {
				var node = tag.cellTagStart[0];
				if (node.type === 'link') {
					style.foreColor = "blue";
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					this._cellTagStartCache[0] = {
						startX: x + startTextWidth,
						textWidth: textWidth + 3,
						linkType: node.linkType,
						displayText: node.displayText
					};
					if (node.linkType == '2' || node.linkType == '3') {
						this._cellTagStartCache[0].paperId = node.paperId,
						this._cellTagStartCache[0].paperIndex = node.paperIndex;
						this._cellTagStartCache[0].paperName = node.paperName;
						this._cellTagStartCache[0].sheetIndex = node.sheetIndex;
						this._cellTagStartCache[0].sheetName = node.sheetName;
						this._cellTagStartCache[0].cell = node.cell;
					}
					startTextWidth += (textWidth + 3);
				}
			}
			
			if (tag.cellTagEnd.length > 0) {
				var node = tag.cellTagEnd[0];
				if (node.type === 'link') {
					style.foreColor = "blue";
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					this._cellTagStartCache[1] = {
						startX: x + startTextWidth,
						textWidth: textWidth + 3,
						linkType: node.linkType,
						displayText: node.displayText
					};
					if (node.linkType == '2' || node.linkType == '3') {
						this._cellTagStartCache[1].paperId = node.paperId,
						this._cellTagStartCache[1].paperIndex = node.paperIndex;
						this._cellTagStartCache[1].paperName = node.paperName;
						this._cellTagStartCache[1].sheetIndex = node.sheetIndex;
						this._cellTagStartCache[1].sheetName = node.sheetName;
						this._cellTagStartCache[1].cell = node.cell;
					}
					startTextWidth += (textWidth + 3);
				}
			}
			
			this._textWidth += startTextWidth;

			/*if (tag.cellTagEnd.length > 0) {
				var node = tag.cellTagEnd[0];
				if (node.type === 'link') {
					style.foreColor = "blue";
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + w - endTextWidth - 15, y, endTextWidth + 15, h, style, context);
					this._cellTagEndCache[0] = {
						startX: x + w - endTextWidth - 15,
						textWidth: textWidth + 3,
						linkType: node.linkType,
						displayText: node.displayText
					}
					if (node.linkType == '2' || node.linkType == '3') {
						this._cellTagEndCache[0].paperId = node.paperId,
						this._cellTagEndCache[0].paperIndex = node.paperIndex;
						this._cellTagEndCache[0].paperName = node.paperName;
						this._cellTagEndCache[0].sheetIndex = node.sheetIndex;
						this._cellTagEndCache[0].sheetName = node.sheetName;
						this._cellTagEndCache[0].cell = node.cell;
					}
					endTextWidth += (textWidth + 3);
				}
			}

			this._textWidth += endTextWidth;*/

			// Set Font to default
			style.foreColor = foreColor;
			style.textDecoration = textDecoration;

			//Paint Value
			// style.font = "bold " + style.font;
			style.hAlign = GC.Spread.Sheets.HorizontalAlign.right;
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;
			GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w - endTextWidth - 3, h, style, context)

		};

		ShowMutualIndex.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
			var info = {x: x, y: y, row: context.row, col: context.col,
				cellRect: cellRect, sheetArea: context.sheetArea, isReservedLocation: false,
				reservedLocation: 0, isStart: undefined
			};
			for (var i = 0; i < this._cellTagStartCache.length; i++) {
				var item = this._cellTagStartCache[i];
				if (item) {
					var startX = item.startX;
					if (x - startX > 0 && x < startX + item.textWidth) {
						info.isReservedLocation = true;
						if(i == 0){
							info.isStart = true;
						}else if(i == 1){
							info.isStart = false;
						}
						info.reservedLocation = i;
						return info;
					}
				}
			}
			return info;
		};
		ShowMutualIndex.prototype.processMouseUp = function (hitInfo) {
			var sheet = hitInfo.sheet, self = this;
			if (sheet && hitInfo.isReservedLocation && hitInfo.reservedLocation >= 0) {
				setTimeout(function () {
					if (self._toolTipElement) {
						document.body.removeChild(self._toolTipElement);
						self._toolTipElement = null;
					}
					var nodeData, nodePaperId, nodeType;
					if(window.parent.nodeData.nodeType == 'dg'){
						nodeData = JSON.parse($.sessionStorage('subjecttreeNode'));
						nodePaperId = nodeData.extraOptions.workpaperId;
						nodeType = 'dgNode';
					}else if(window.parent.nodeData.nodeType == 'note'){
						nodeData = JSON.parse($.sessionStorage('noteInfoNode'));
						nodePaperId = nodeData.extraOptions.autoId;
						nodeType = 'noteNode';
					}
					if(hitInfo.isStart){
						var linkType = self._cellTagStartCache[hitInfo.reservedLocation].linkType;
						var dgFileId = self._cellTagStartCache[hitInfo.reservedLocation].paperId;
						var dgFileIndexId = self._cellTagStartCache[hitInfo.reservedLocation].paperIndex;
						var dgFileName = self._cellTagStartCache[hitInfo.reservedLocation].paperName;
						if(linkType == '2' || linkType == '3'){
							var rangeStr = self._cellTagStartCache[hitInfo.reservedLocation].cell;
							var range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.wrapper.spread.getActiveSheet(), rangeStr, 0, 0);
							var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
							if(linkType == '2'){
								if(nodeType == 'dgNode' && nodePaperId == dgFileId){
									var iframeId = "iframe_dg_" + dgFileId;
									var sheetIndex = parseInt(self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);
									/*$('#mainContent', window.parent.document).html('');
									var $div = $('<iframe src="/Faith/dgcenter.do?m=openDgIframeMain&index=' + nodeData.extraOptions.indexId + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>');
									$('#mainContent', window.parent.document).append($div);*/
								}else{
									if($('#dg_' + dgFileId, window.parent.document).length > 0){
										/*var iframeId = "iframe_dg_" + dgFileId;
										window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);
										*/
										$('[href="#dg_' + dgFileId + '"]', window.parent.document).parent().remove();
										$('#dg_' + dgFileId, window.parent.document).remove();
									}
									var formula = self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex + ':' + self._cellTagStartCache[hitInfo.reservedLocation].cell;
									// session节点 跳转到指定单元格 --> designer.setCellLink()
									$.sessionStorage('cellLinkFormula', JSON.stringify(formula));
									openDgFile(dgFileId, dgFileIndexId, dgFileName);
								}
							}
							if(linkType == '3'){
								if(nodeType == 'noteNode' && nodePaperId == dgFileId){
									var iframeId = "iframe_note_" + dgFileId;
									var sheetIndex = parseInt(self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);
									/*$('#mainContent', window.parent.document).html('');
									var $div = $('<iframe src="/Faith/dgcenter.do?m=openDgNoteMain&index=' + nodeData.extraOptions.noteNo + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>');
									$('#mainContent', window.parent.document).append($div);*/
								}else{
									if($('#note_' + dgFileId, window.parent.document).length > 0){
										/*var iframeId = "iframe_note_" + dgFileId;
										window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);*/
										$('[href="#note_' + dgFileId + '"]', window.parent.document).parent().remove();
										$('#note_' + dgFileId, window.parent.document).remove();
									}
									var formula = self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex + ':' + self._cellTagStartCache[hitInfo.reservedLocation].cell;
									// session节点 跳转到指定单元格 --> designer.setCellLink()
									$.sessionStorage('cellLinkFormula', JSON.stringify(formula));
									openNoteFile(dgFileId, dgFileIndexId, dgFileName);
								}
							}
						}
					}else{
						var linkType = self._cellTagStartCache[hitInfo.reservedLocation].linkType;
						var dgFileId = self._cellTagStartCache[hitInfo.reservedLocation].paperId;
						var dgFileIndexId = self._cellTagStartCache[hitInfo.reservedLocation].paperIndex;
						var dgFileName = self._cellTagStartCache[hitInfo.reservedLocation].paperName;
						if(linkType == '2' || linkType == '3'){
							var rangeStr = self._cellTagStartCache[hitInfo.reservedLocation].cell;
							var range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.wrapper.spread.getActiveSheet(), rangeStr, 0, 0);
							var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
							if(linkType == '2'){
								if(nodeType == 'dgNode' && nodePaperId == dgFileId){
									var iframeId = "iframe_dg_" + dgFileId;
									var sheetIndex = parseInt(self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col)
									/*$('#mainContent', window.parent.document).html('');
									var $div = $('<iframe src="/Faith/dgcenter.do?m=openDgIframeMain&index=' + nodeData.extraOptions.indexId + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>');
									$('#mainContent', window.parent.document).append($div);*/
								}else{
									if($('#dg_' + dgFileId, window.parent.document).length > 0){
										/*var iframeId = "iframe_dg_" + dgFileId;
										window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);*/
										$('[href="#dg_' + dgFileId + '"]', window.parent.document).parent().remove();
										$('#dg_' + dgFileId, window.parent.document).remove();
									}
									var formula = self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex + ':' + self._cellTagStartCache[hitInfo.reservedLocation].cell;
									// session节点 跳转到指定单元格 --> designer.setCellLink()
									$.sessionStorage('cellLinkFormula', JSON.stringify(formula));
									openDgFile(dgFileId, dgFileIndexId, dgFileName);
								}
							}
							if(linkType == '3'){
								if(nodeType == 'noteNode' && nodePaperId == dgFileId){
									var iframeId = "iframe_note_" + dgFileId;
									var sheetIndex = parseInt(self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);
									/*$('#mainContent', window.parent.document).html('');
									var $div = $('<iframe src="/Faith/dgcenter.do?m=openDgNoteMain&index=' + nodeData.extraOptions.noteNo + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>');
									$('#mainContent', window.parent.document).append($div);*/
								}else{
									if($('#note_' + dgFileId, window.parent.document).length > 0){
										/*var iframeId = "iframe_note_" + dgFileId;
										window.parent.frames[iframeId].designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);*/
										$('[href="#note_' + dgFileId + '"]', window.parent.document).parent().remove();
										$('#note_' + dgFileId, window.parent.document).remove();
									}
									var formula = self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex + ':' + self._cellTagStartCache[hitInfo.reservedLocation].cell;
									// session节点 跳转到指定单元格 --> designer.setCellLink()
									$.sessionStorage('cellLinkFormula', JSON.stringify(formula));
									openNoteFile(dgFileId, dgFileIndexId, dgFileName);
								}
							}
						}
					}
				}, 10);
				return true;
			}
			return false;
		};

		ShowMutualIndex.prototype.processMouseMove = function (hitInfo) {
			var sheet = hitInfo.sheet;
			var div = sheet.getParent().getHost();
			var canvasId = div.id + "vp_vp";
			var canvas = $("#" + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div = document.createElement("div");
					$(div).css("position", "absolute")
						.css("border", "1px #C0C0C0 solid")
						.css("box-shadow", "1px 2px 5px rgba(0,0,0,0.4)")
						.css("font", "9pt Arial")
						.css("background", "white")
						.css("padding", 5);
					this._toolTipElement = div;
				}
				var displayText = this._cellTagStartCache[hitInfo.reservedLocation].displayText;
				$(this._toolTipElement).text(displayText).css("top", hitInfo.y + 190).css("left", hitInfo.x + 15);
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show("fast");
				return true;
			}
			return false;
		};

		ShowMutualIndex.prototype.processMouseLeave = function (hitInfo) {
			if (this._toolTipElement) {
				document.body.removeChild(this._toolTipElement);
				this._toolTipElement = null;
			}
		};

		ShowMutualIndex.prototype.getAutoFitWidth = function (value, text, cellStyle, zoomFactor, context) {
			if (this._textWidth) {
				// cellStyle.font = "bold " + cellStyle.font;
				return 5 + this._textWidth + GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context);
			} else {
				return GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context)
			}
		};
		return ShowMutualIndex;
	})();
	designer.ShowMutualIndex = ShowMutualIndex;

	designer.ShowMutualIndexCacheMap = new Map();

	// 交叉索引 初始化文件时显示所有文件交叉索引
	designer.setShowMutualIndexCacheMap = function (mapJson) {
		if (mapJson === undefined) {return;}
		let strMap = new Map();
		// json转换为map
		for (let k of Object.keys(mapJson)) {
			strMap.set(k, mapJson[k]);
		}
		designer.ShowMutualIndexCacheMap = strMap;
		for (let cellLink of designer.ShowMutualIndexCacheMap) {
			var cellTagStart = cellLink[1].cellTagStart;
			var cellTagEnd = cellLink[1].cellTagEnd;
			if(cellTagStart.length > 0){
				let paperId = cellTagStart[0].paperId;
				let linkType = cellTagStart[0].linkType;
				// 底稿
				if(linkType == '2' && !checkDgExist(paperId)){
					cellTagStart.splice(1 , 1);
				}
				// 附注
				if(linkType == '3' && !checkNoteExist(paperId)){
					cellTagStart.splice(1 , 1);
				}
			}
			if(cellTagEnd.length > 0){
				let paperId = cellTagEnd[0].paperId;
				let linkType = cellTagEnd[0].linkType;
				// 底稿
				if(linkType == '2' && !checkDgExist(paperId)){
					cellTagEnd.splice(1 , 1);
				}
				// 附注
				if(linkType == '3' && !checkNoteExist(paperId)){
					cellTagEnd.splice(1 , 1);
				}
			}
			// cellLink[0] = sheetIndex + ":" + row + ":" + col
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(":")));
			designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
			var sheet = designer.wrapper.spread.getActiveSheet();
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(":") + 1,cellLink[0].lastIndexOf(":")));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(":") + 1));
			
			designer.wrapper.spread.suspendPaint();
			var activeCell = sheet.getCell(row, col);
			activeCell.cellType(new designer.ShowMutualIndex());
			activeCell.tag({
				cellTagStart: cellTagStart,
				cellTagEnd: cellTagEnd
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.wrapper.spread.resumePaint();
		}
	};

	// 跳转到指定单元格
	designer.setCellLink = function () {
		let cellLinkFormula = $.sessionStorage('cellLinkFormula');
		if(cellLinkFormula != null && cellLinkFormula != '' && JSON.parse(cellLinkFormula) != ''){
			let formula = JSON.parse(cellLinkFormula);
			let sheetIndex = parseInt(formula.substring(0,formula.indexOf(':')));
			designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
			let rangeStr = formula.substring(formula.indexOf(':') + 1);
			let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.wrapper.spread.getActiveSheet(), rangeStr, 0, 0);
			designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);
			var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
			designer.wrapper.spread.getActiveSheet().showRow(range.row, verticalPosition);
			// var horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
			// designer.wrapper.spread.getActiveSheet().showCell(range.row, range.col, verticalPosition, horizontalPosition);
			$.sessionStorage('cellLinkFormula', '');
			return;
		}
		let cellLinkFormulaBySheetName = $.sessionStorage('cellLinkFormulaBySheetName');
		if(cellLinkFormulaBySheetName != null && cellLinkFormulaBySheetName != '' && JSON.parse(cellLinkFormulaBySheetName) != ''){
			let formula = JSON.parse(cellLinkFormulaBySheetName);
			let sheetName = formula.substring(0,formula.indexOf(':'));
			let sheetIndex = parseInt(designer.wrapper.spread.getSheetIndex(sheetName));
			designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
			let rangeStr = formula.substring(formula.indexOf(':') + 1);
			let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.wrapper.spread.getActiveSheet(), rangeStr, 0, 0);
			designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);
			var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
			designer.wrapper.spread.getActiveSheet().showRow(range.row, verticalPosition);
			$.sessionStorage('cellLinkFormulaBySheetName', '');
		}
	};

	// 附注取值底稿类型
	var ShowNoteDgValueInfo = (function () {
		function ShowNoteDgValueInfo() {
			this.typeName = "ShowNoteDgValueInfo";
			this._cellTagStartCache = undefined;
			this._textWidth = undefined;
		}
		ShowNoteDgValueInfo.prototype = new GC.Spread.Sheets.CellTypes.Text();
		ShowNoteDgValueInfo.prototype.paintContent = function (ctx, value, x, y, w, h, style, context) {
			var tag = context.sheet.getTag(context.row, context.col);
			if (tag == '' || tag == null || tag === undefined) {
				this._cellTagStartCache = undefined;
				this._textWidth = undefined;
				GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w, h, style, context);
				return;
			}
			this._cellTagStartCache = [], this._textWidth = 0;
			var startTextWidth = 0, endTextWidth = 0;
			var sheet = context.sheet, zoomFactor = sheet.zoom();
			var foreColor = style.foreColor, textDecoration = style.textDecoration;

			//为了实现简单，单元格垂直居中，如果有其他需求，绘制文字位置重新计算
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;

			for (var i = 0; i < tag.cellTagStart.length; i++) {
				var node = tag.cellTagStart[i];

				if (node.type === 'link') {
					style.foreColor = "blue";
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					this._cellTagStartCache[i] = {
						startX: x + startTextWidth,
						textWidth: textWidth + 3,
						dgFileInputVal: node.dgFileInputVal,
						dgFileInputText: node.dgFileInputText,
						dgFileSelectVal: node.dgFileSelectVal,
						dgSheetSelectVal: node.dgSheetSelectVal,
						dgSheetSelectText: node.dgSheetName,
						dgRangeStartVal: node.dgRangeStart,
						dgRangeEndVal: node.dgRangeEnd
					};
					startTextWidth += (textWidth + 3);
				}
			}
			this._textWidth += startTextWidth;

			// Set Font to default
			style.foreColor = foreColor;
			style.textDecoration = textDecoration;

			//Paint Value
			// style.font = "bold " + style.font;
			style.hAlign = GC.Spread.Sheets.HorizontalAlign.right;
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;
			GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w - endTextWidth - 3, h, style, context)

		};

		ShowNoteDgValueInfo.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
			var info = {
				x: x,
				y: y,
				row: context.row,
				col: context.col,
				cellRect: cellRect,
				sheetArea: context.sheetArea,
				isReservedLocation: false,
				reservedLocation: -1
			};
			for (var i = 0; i < this._cellTagStartCache.length; i++) {
				var item = this._cellTagStartCache[i];
				if (item) {
					var startX = item.startX;
					if (x - startX > 0 && x < startX + item.textWidth) {
						info.isReservedLocation = true;
						info.reservedLocation = i;
						break;
					}
				}
			}
			return info;
		};
		ShowNoteDgValueInfo.prototype.processMouseUp = function (hitInfo) {
			var sheet = hitInfo.sheet, self = this;
			if (sheet && hitInfo.isReservedLocation && hitInfo.reservedLocation >= 0) {
				setTimeout(function () {
					if (self._toolTipElement) {
						document.body.removeChild(self._toolTipElement);
						self._toolTipElement = null;
					}
					if (designer && designer.dialog) {
						if (designer.dialog.NoteFeatureDialog === undefined) {
							designer.dialog.NoteFeatureDialog = new designer.NoteFeatureDialog();
						}
						designer.dialog.NoteFeatureDialog.open();
					}
					var dgFileInputText = self._cellTagStartCache[0].dgFileInputText;
					var dgFileId = dgFileInputText.substring(0, dgFileInputText.indexOf(':'));
					var dgFileIndexId = dgFileInputText.substring(dgFileInputText.indexOf(':') + 1);
					var dgFileName = self._cellTagStartCache[0].dgFileInputVal;
					var dgSheetIndex = self._cellTagStartCache[0].dgSheetSelectVal;
					var dgRange = self._cellTagStartCache[0].dgRangeStartVal;
					if($('#dg_' + dgFileId, window.parent.document).length > 0){
						$('[href="#dg_' + dgFileId + '"]', window.parent.document).parent().remove();
						$('#dg_' + dgFileId, window.parent.document).remove();
					}
					var formula = dgSheetIndex + ':' + dgRange;
					// session节点 跳转到指定单元格 --> designer.setCellLink()
					$.sessionStorage('cellLinkFormula', JSON.stringify(formula));
					openDgFile(dgFileId, dgFileIndexId, dgFileName);
				}, 10);
				return true;
			}
			return false;
		};

		ShowNoteDgValueInfo.prototype.processMouseMove = function (hitInfo) {
			var sheet = hitInfo.sheet;
			var div = sheet.getParent().getHost();
			var canvasId = div.id + "vp_vp";
			var canvas = $("#" + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div1 = document.createElement("div");
					$(div1).css("position", "absolute")
						.css("border", "1px #C0C0C0 solid")
						.css("box-shadow", "1px 2px 5px rgba(0,0,0,0.4)")
						.css("font", "9pt Arial")
						.css("background", "white")
						.css("padding", 5);
					this._toolTipElement = div1;
				}
				let dgFileInputVal = this._cellTagStartCache[hitInfo.reservedLocation].dgFileInputVal;
				let dgFileInputText = this._cellTagStartCache[hitInfo.reservedLocation].dgFileInputText;
				let dgFileSelectVal = this._cellTagStartCache[hitInfo.reservedLocation].dgFileSelectVal;
				let dgSheetSelectVal = this._cellTagStartCache[hitInfo.reservedLocation].dgSheetSelectVal;
				let dgSheetSelectText = this._cellTagStartCache[hitInfo.reservedLocation].dgSheetSelectText;
				let dgRangeStartVal = this._cellTagStartCache[hitInfo.reservedLocation].dgRangeStartVal;
				let dgRangeEndVal = this._cellTagStartCache[hitInfo.reservedLocation].dgRangeEndVal;
				$(this._toolTipElement).text(dgFileInputVal + ' -- ' + dgSheetSelectText + ' -- ' + dgRangeStartVal + ':' + dgRangeEndVal).css("top", hitInfo.y + 190).css("left", hitInfo.x + 15);
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show("fast");
				return true;
			}
			return false;
		};

		ShowNoteDgValueInfo.prototype.processMouseLeave = function (hitInfo) {
			if (this._toolTipElement) {
				document.body.removeChild(this._toolTipElement);
				this._toolTipElement = null;
			}
		};

		ShowNoteDgValueInfo.prototype.getAutoFitWidth = function (value, text, cellStyle, zoomFactor, context) {
			if (this._textWidth) {
				// cellStyle.font = "bold " + cellStyle.font;
				return 5 + this._textWidth + GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context);
			} else {
				return GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context)
			}
		};
		return ShowNoteDgValueInfo;
	})();
	designer.ShowNoteDgValueInfo = ShowNoteDgValueInfo;

	designer.NoteCacheMap = new Map();

	// 附注取值底稿 初始化底稿时显示所有附注取值底稿
	designer.setNoteCacheMap = function (mapJson) {
		if (mapJson === undefined) {return;}
		// 附注底稿取值
		let strMap = new Map();
		// json转换为map
		for (let k of Object.keys(mapJson)) {
			strMap.set(k, mapJson[k]);
		}
		designer.NoteCacheMap = strMap;
		for (let cellLink of designer.NoteCacheMap) {
			var cellTagStart = cellLink[1];
			if(cellTagStart.length > 0){
				let autoId = cellTagStart[0].dgFileId;
				if(!checkDgExist(autoId)){
					cellTagStart.splice(1 , 1);
				}
			}
			// cellLink[0] = sheetIndex + ":" + row + ":" + col
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(":")));
			designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
			var sheet = designer.wrapper.spread.getActiveSheet();
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(":") + 1,cellLink[0].lastIndexOf(":")));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(":") + 1));
			
			designer.wrapper.spread.suspendPaint();
			var activeCell = sheet.getCell(row, col);
			activeCell.cellType(new designer.ShowNoteDgValueInfo());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.wrapper.spread.resumePaint();
		}
	};

	// 底稿取值类型
	var ShowDgFetch = (function () {
		function ShowDgFetch() {
			this.typeName = "ShowDgFetch";
			this._cellTagStartCache = undefined;
			this._textWidth = undefined;
		}
		ShowDgFetch.prototype = new GC.Spread.Sheets.CellTypes.Text();
		ShowDgFetch.prototype.paintContent = function (ctx, value, x, y, w, h, style, context) {
			var tag = context.sheet.getTag(context.row, context.col);
			if (tag == '' || tag == null || tag === undefined) {
				this._cellTagStartCache = undefined;
				this._textWidth = undefined;
				GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w, h, style, context);
				return;
			}
			this._cellTagStartCache = [], this._textWidth = 0;
			var startTextWidth = 0, endTextWidth = 0;
			var sheet = context.sheet, zoomFactor = sheet.zoom();
			var foreColor = style.foreColor, textDecoration = style.textDecoration;

			//为了实现简单，单元格垂直居中，如果有其他需求，绘制文字位置重新计算
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;

			for (var i = 0; i < tag.cellTagStart.length; i++) {
				var node = tag.cellTagStart[i];

				if (node.type === 'link') {
					style.foreColor = "blue";
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					this._cellTagStartCache[i] = {
						startX: x + startTextWidth,
						textWidth: textWidth + 3,
						dgFileInputVal: node.dgFileInputVal,
						dgFileInputText: node.dgFileInputText,
						dgFileSelectVal: node.dgFileSelectVal,
						dgSheetSelectVal: node.dgSheetSelectVal,
						dgSheetSelectText: node.dgSheetName,
						dgRangeVal: node.dgRange,
					};
					startTextWidth += (textWidth + 3);
				}
			}
			this._textWidth += startTextWidth;

			// Set Font to default
			style.foreColor = foreColor;
			style.textDecoration = textDecoration;

			//Paint Value
			// style.font = "bold " + style.font;
			style.hAlign = GC.Spread.Sheets.HorizontalAlign.right;
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;
			GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w - endTextWidth - 3, h, style, context)

		};

		ShowDgFetch.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
			var info = {
				x: x,
				y: y,
				row: context.row,
				col: context.col,
				cellRect: cellRect,
				sheetArea: context.sheetArea,
				isReservedLocation: false,
				reservedLocation: -1
			};
			for (var i = 0; i < this._cellTagStartCache.length; i++) {
				var item = this._cellTagStartCache[i];
				if (item) {
					var startX = item.startX;
					if (x - startX > 0 && x < startX + item.textWidth) {
						info.isReservedLocation = true;
						info.reservedLocation = i;
						break;
					}
				}
			}
			return info;
		};
		ShowDgFetch.prototype.processMouseUp = function (hitInfo) {
			var sheet = hitInfo.sheet, self = this;
			if (sheet && hitInfo.isReservedLocation && hitInfo.reservedLocation >= 0) {
				setTimeout(function () {
					if (self._toolTipElement) {
						document.body.removeChild(self._toolTipElement);
						self._toolTipElement = null;
					}
					if (designer && designer.dialog) {
						if (designer.dialog.DgFetchDialog === undefined) {
							designer.dialog.DgFetchDialog = new designer.DgFetchDialog();
						}
						designer.dialog.DgFetchDialog.open();
					}
					var dgFileInputText = self._cellTagStartCache[0].dgFileInputText;
					var dgFileId = dgFileInputText.substring(0, dgFileInputText.indexOf(':'));
					var dgFileIndexId = dgFileInputText.substring(dgFileInputText.indexOf(':') + 1);
					var dgFileName = self._cellTagStartCache[0].dgFileInputVal;
					var dgSheetIndex = self._cellTagStartCache[0].dgSheetSelectVal;
					var dgRange = self._cellTagStartCache[0].dgRangeVal;
					if(dgFileId == designer.workpaperId){
						var iframeId = "iframe_dg_" + dgFileId;
						var sheetIndex = parseInt(dgSheetIndex);
						designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
						var range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.wrapper.spread.getActiveSheet(), dgRange, 0, 0);
						designer.wrapper.spread.getActiveSheet().setActiveCell(range.row, range.col);
					}else{
						if($('#dg_' + dgFileId, window.parent.document).length > 0){
							$('[href="#dg_' + dgFileId + '"]', window.parent.document).parent().remove();
							$('#dg_' + dgFileId, window.parent.document).remove();
						}
						var formula = dgSheetIndex + ':' + dgRange;
						// session节点 跳转到指定单元格 --> designer.setCellLink()
						$.sessionStorage('cellLinkFormula', JSON.stringify(formula));
						openDgFile(dgFileId, dgFileIndexId, dgFileName);
					}
				}, 10);
				return true;
			}
			return false;
		};

		ShowDgFetch.prototype.processMouseMove = function (hitInfo) {
			var sheet = hitInfo.sheet;
			var div = sheet.getParent().getHost();
			var canvasId = div.id + "vp_vp";
			var canvas = $("#" + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div1 = document.createElement("div");
					$(div1).css("position", "absolute")
						.css("border", "1px #C0C0C0 solid")
						.css("box-shadow", "1px 2px 5px rgba(0,0,0,0.4)")
						.css("font", "9pt Arial")
						.css("background", "white")
						.css("padding", 5);
					this._toolTipElement = div1;
				}
				let dgFileInputVal = this._cellTagStartCache[hitInfo.reservedLocation].dgFileInputVal;
				let dgFileInputText = this._cellTagStartCache[hitInfo.reservedLocation].dgFileInputText;
				let dgFileSelectVal = this._cellTagStartCache[hitInfo.reservedLocation].dgFileSelectVal;
				let dgSheetSelectVal = this._cellTagStartCache[hitInfo.reservedLocation].dgSheetSelectVal;
				let dgSheetSelectText = this._cellTagStartCache[hitInfo.reservedLocation].dgSheetSelectText;
				let dgRangeVal = this._cellTagStartCache[hitInfo.reservedLocation].dgRangeVal;
				$(this._toolTipElement).text(dgFileInputVal + ' -- ' + dgSheetSelectText + ' -- ' + dgRangeVal).css("top", hitInfo.y + 190).css("left", hitInfo.x + 15);
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show("fast");
				return true;
			}
			return false;
		};

		ShowDgFetch.prototype.processMouseLeave = function (hitInfo) {
			if (this._toolTipElement) {
				document.body.removeChild(this._toolTipElement);
				this._toolTipElement = null;
			}
		};

		ShowDgFetch.prototype.getAutoFitWidth = function (value, text, cellStyle, zoomFactor, context) {
			if (this._textWidth) {
				// cellStyle.font = "bold " + cellStyle.font;
				return 5 + this._textWidth + GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context);
			} else {
				return GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context)
			}
		};
		return ShowDgFetch;
	})();
	designer.ShowDgFetch = ShowDgFetch;

	designer.DgFetchCacheMap = new Map();

	// 底稿取值 初始化底稿时显示所有底稿取值
	designer.setDgFetchCacheMap = function (mapJson) {
		if (mapJson === undefined) {return;}
		// 底稿取值
		let strMap = new Map();
		// json转换为map
		for (let k of Object.keys(mapJson)) {
			strMap.set(k, mapJson[k]);
		}
		designer.DgFetchCacheMap = strMap;
		for (let cellLink of designer.DgFetchCacheMap) {
			var cellTagStart = cellLink[1];
			if(cellTagStart.length > 0){
				let autoId = cellTagStart[0].dgFileId;
				if(!checkDgExist(autoId)){
					cellTagStart.splice(1 , 1);
				}
			}
			// cellLink[0] = sheetIndex + ":" + row + ":" + col
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(":")));
			designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
			var sheet = designer.wrapper.spread.getActiveSheet();
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(":") + 1,cellLink[0].lastIndexOf(":")));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(":") + 1));
			
			designer.wrapper.spread.suspendPaint();
			var activeCell = sheet.getCell(row, col);
			activeCell.cellType(new designer.ShowDgFetch());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.wrapper.spread.resumePaint();
		}
	};

	designer.paperArr = [];
	// 打开底稿时取得该项目下所有底稿信息
	var setPaperArr = function () {
		$.ajax({
			type : "post",
			url: 'dgCenter/DgGeneral.General.query.json',
			// async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00067',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					designer.paperArr = data.data;
				}
			}
		});
	}();

	designer.attachmentArr = [];
	// 打开底稿时取得该项目下所有底稿附件信息
	var setAttachmentArr = function () {
		$.ajax({
			type : "post",
			url: 'dgCenter/DgGeneral.General.query.json',
			// async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00069',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					designer.attachmentArr = data.data;
				}
			}
		});
	}();

	designer.noteArr = [];
	// 打开底稿时取得该项目下所有附注信息
	var setNoteArr = function () {
		$.ajax({
			url: 'dgCenter/DgGeneral.General.query.json',
			type: 'post',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00125',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success: function(data){
				if(data.success) {
					designer.noteArr = data.data;
				}
			}
		});
	}();

	designer.tbArr = [];
	// 打开底稿时取得该项目下所有TB科目信息
	var setTbArr = function () {
		$.ajax({
			url: 'dgCenter/DgGeneral.General.query.json',
			type: 'post',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00126',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: window.CUR_PROJECT_ACC_YEAR,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success: function(data){
				if(data.success) {
					designer.tbArr = data.data;
				}
			}
		});
	}();

	designer.guideArr = [];
	// 打开底稿时取得该项目下所有财务科目信息
	var setGuideArr = function () {
		$.ajax({
			url : 'dgCenter/DgWapper.getGuideList.json',
			// async : false,
			type : 'post',
			data : {
				menuId: window.sys_menuId,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: window.CUR_PROJECT_ACC_YEAR,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success : function(data){
				if(data.success) {
					designer.guideArr = data.data;
				}
			}
		});
	}();

	// 单向链接弹出框
	var CellTypeDialog = (function (_super) {

		designer.extends(CellTypeDialog, _super);
		function CellTypeDialog() {
			_super.call(this, (dialogHtmlPath), '.cell-type-dialog');
		}

		// 所有单向链接item
		var thisItems = [];
		
		CellTypeDialog.prototype._initOptions = function () {
			var self = this;
			return {
				resizable: false,
				width: 'auto',
				//height: '420px;',
				modal: true,
				title: designer.res.cellTypeDialog.title,
				buttons: [
					{
						text: designer.res.ok,
						click: function () {
							var sheet = designer.wrapper.spread.getActiveSheet();
							var spread = designer.wrapper.spread;
							var paperText = self._element.find(".paperText");
							var attachmentText = self._element.find(".attachmentText");
							var fileName = '';
							if (paperText.val() !== null && paperText.val() !== '') {
								if (attachmentText.val() === '') {
									fileName = paperText[0].selectedOptions[0].text;
								} else {
									fileName = attachmentText[0].selectedOptions[0].text
								}
							} else {
								paperText.val('');
							}
							if (thisItems.length !== 0) {
								thisItems.splice(self._element.find(".items")[0].selectedIndex, 1, {
									radio: self._element.find("input[name='linktype']:checked").val(),
									text: self._element.find(".text").val(),
									sheetText: self._element.find(".sheetText").val(),
									paperListCell: self._element.find(".paperListCell").val(),
									paperTextCell: self._element.find(".paperTextCell").val(),
									displayText: self._element.find(".displayText").val(),
									paperText: paperText.val(),
									attachmentText: attachmentText.val(),
									fileName: fileName,
									paperName: self._element.find(".paperInput").val()
								});
							}
							var cellTagStart = [];
							for (var i = 0; i < thisItems.length; i++) {
								if (thisItems[i].radio === "1") {
									if (thisItems[i].paperText === '') {
										thisItems.splice(i,1);
										i = i - 1;
									}
								} else if (thisItems[i].radio === "0") {
									if (thisItems[i].text === '' || thisItems[i].paperTextCell === '' || thisItems[i].sheetText === '') {
										thisItems.splice(i,1);
										i = i - 1;
									}
								}
							}
							var sheetIndex = designer.wrapper.spread.getActiveSheetIndex();
							var sheetName = designer.wrapper.spread.getActiveSheet().name();
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
							var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
							
							var cellValue = '';
							for (var i = 0; i < thisItems.length; i++) {
								if (thisItems[i].radio === "1") {
									var paperLink = thisItems[i].paperText;
									var attachmentLink = thisItems[i].attachmentText;
									var isPaper = true;
									if (thisItems[i].attachmentText !== '') {
										isPaper = false;
										cellValue = cellValue + "   " + attachmentLink.substring(attachmentLink.indexOf(":") + 1);
									} else {
										cellValue = cellValue + "   " + paperLink.substring(paperLink.indexOf(":") + 1);
									}
									cellTagStart.push({
										type: 'link',
										isFile: true,
										paperLink: paperLink,
										attachmentLink: attachmentLink,
										isPaper: isPaper,
										fileName: thisItems[i].fileName,
										paperName: thisItems[i].paperName,
										linkText: "L" + (i + 1),
										cellPosition: sheetName + ':' + rangeStr
									});
								} else if (thisItems[i].radio === "0") {
									var range = GC.Spread.Sheets.CalcEngine.formulaToRange(spread.getSheet(parseInt(thisItems[i].sheetText)), thisItems[i].text, 0, 0);
									if (range == null) {
										designer.MessageBox.show('单元格引用无效！', '', 3 /* error */);
										return;
									}
									var sheetName = spread.getSheet(parseInt(thisItems[i].sheetText)).name();
									cellTagStart.push({
										type: 'link',
										isFile: false,
										link: thisItems[i].sheetText + ":" + thisItems[i].text,
										displayText: thisItems[i].displayText,
										sheetName: sheetName,
										paperListCell: thisItems[i].paperListCell,
										paperTextCell: thisItems[i].paperTextCell,
										linkText: "L" + (i + 1),
										cellPosition: sheetName + ':' + rangeStr
									});
									cellValue = cellValue + "   " + thisItems[i].displayText;
								}
							}
							if (cellTagStart.length === 0){
								designer.MessageBox.show('请添加单向链接或正确设置单向链接属性！', '', 1 /* error */);
							}else{
								var mapKey = sheetIndex + ":" + row + ":" + col;
								// 该底稿单元格存在单向链接时，删除再添加
								// 该底稿单元格不存在单向链接时，添加
								if (!designer.ShowTagCellTypeCacheMap.has(mapKey)) {
									designer.ShowTagCellTypeCacheMap.set(mapKey,cellTagStart);
								} else if (designer.ShowTagCellTypeCacheMap.has(mapKey)) {
									designer.ShowTagCellTypeCacheMap.delete(mapKey);
									if (cellTagStart.length !== 0) {
										designer.ShowTagCellTypeCacheMap.set(mapKey,cellTagStart);
									}
								}
								designer.wrapper.spread.suspendPaint();
								var activeCell = sheet.getCell(row, col);
								activeCell.value(cellValue);
								activeCell.cellType(new designer.ShowTagCellType());
								activeCell.tag({
									cellTagStart: cellTagStart
								});
								// 居左
								activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
								activeCell.foreColor('blue');
								activeCell.textDecoration(GC.Spread.Sheets.TextDecorationType.underline);
								designer.wrapper.spread.resumePaint();
							}
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					},
					// 清除单元格格式
					{
						text: designer.res.cellTypeDialog.clearBtn,
						click: function () {
							var sheet = designer.wrapper.spread.getActiveSheet();
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var sheetIndex = designer.wrapper.spread.getActiveSheetIndex();
							var mapKey = sheetIndex + ":" + row + ":" + col;
							// 该底稿单元格存在单向链接时，删除再添加
							if (designer.ShowTagCellTypeCacheMap.has(mapKey)) {
								designer.ShowTagCellTypeCacheMap.delete(mapKey);
								designer.wrapper.spread.suspendPaint();
								var activeCell = sheet.getCell(row, col);
								activeCell.value('');
								// 清除单元格格式
								activeCell.cellType(void 0);
								designer.wrapper.spread.resumePaint();
							}
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					},
					{
						text: designer.res.cancel,
						click: function () {
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					}
				]
			};
		};
		
		var paperSelectedId;
		CellTypeDialog.prototype._init = function () {
			for (var i= 0; i < designer.paperArr.length; i++) {
				if (designer.workpaperId === designer.paperArr[i].autoId) {
					paperSelectedId = designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId;
					break;
				}
			}
			var _this = this;
			this.selectedIndex = -1;

			var items = this._element.find(".items");
			var itemsOptions = items[0].options;
			// radioButton
			var radio = this._element.find("input[name=linktype]");
			// 要显示的文字
			var displayText = this._element.find(".displayText");
			// 底稿input框
			var paperTextCell = this._element.find(".paperTextCell");
			// 底稿下拉框
			var paperListCell = this._element.find(".paperListCell");
			// 工作表
			var sheetText = this._element.find(".sheetText");
			// 单元格
			var text = this._element.find(".text");
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'paper-text-cell' || elem.id == "paper-list-cell")) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#paper-list-cell').css('display', 'none'); //点击的不是div或其子元素
			});
			var clearPaperBtn = this._element.find(".clearPaper-button");
			clearPaperBtn.click(function () {
				paperTextCell.val('');
				paperTextCell.text('');
			});
			var refershPaperBtn = this._element.find(".refershPaper-button");
			refershPaperBtn.click(function () {
				paperTextCell.val('');
				paperTextCell.text('');
				designer.paperArr = [];
				$.ajax({
					type : "post",
					url: 'dgCenter/DgGeneral.General.query.json',
					// async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00067',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					dataType : "json",
					success(data) {
						if(data.success) {
							designer.paperArr = data.data;
						}
					}
				});
			});
			var openDgBtn = this._element.find(".openDgBtn-button");
			openDgBtn.click(function () {
				if(paperListCell.val() != null && paperListCell.val() != ''){
					if(paperListCell.find('option:selected').text() == paperTextCell.val()){
						var dgFileName = paperListCell.find('option:selected').text().substring(0, paperListCell.find('option:selected').text().lastIndexOf('.'));
						var dgFileId = paperListCell.val().substring(0, paperListCell.val().indexOf(':'));
						var dgFileIndexId = paperListCell.val().substring(paperListCell.val().indexOf(':') + 1);
						if(designer.paperType == 'dg' && dgFileId == designer.workpaperId) return;
						openDgFile(dgFileId, dgFileIndexId, dgFileName);
					}else{
						designer.MessageBox.show('请选择底稿', '', 3);
					}
				}else{
					designer.MessageBox.show('请选择底稿', '', 3);
				}
			});
			paperTextCell.on('focus',function(){
				$('#paper-list-cell').css('display', 'block');
				$("#paper-list-cell").empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到paperTextLeft.value()的内容，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$("#paper-list-cell").append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			paperTextCell.on('input',function(){
				$("#paper-list-cell").empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到paperTextLeft.value()的内容，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$("#paper-list-cell").append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			paperListCell.change(function () {
				paperTextCell.val(paperListCell[0].selectedOptions[0].text);
				$('#paper-list-cell').css('display', 'none');
				if(this.value != ''){
					setDgSheet(this.value, 'sheet_list');
					sheetText.removeAttr('disabled');
					text.removeAttr('disabled');
				}else{
					sheetText.val('');
					sheetText.attr('disabled', true);
					text.val('');
					text.attr('disabled', true);
				}
			});
			// 底稿输入框
			var paperInput = this._element.find(".paperInput");
			paperInput.val('');
			// 底稿
			var paperText = this._element.find(".paperText");
			// 附件
			var attachmentText = _this._element.find(".attachmentText");
			var addBtn = this._element.find(".add-button");
			var removeBtn = this._element.find(".remove-button");
			addBtn.button();
			removeBtn.button();
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'paper_list' || elem.id == "paper-text")) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#paper_list').css('display', 'none'); //点击的不是div或其子元素
			});
			var clearDgBtn = this._element.find(".clearDg-button");
			clearDgBtn.click(function () {
				paperInput.val('');
				paperInput.text('');
			});
			var refreshDgBtn = this._element.find(".refreshDg-button");
			refreshDgBtn.click(function () {
				paperInput.val('');
				paperInput.text('');
				designer.paperArr = [];
				$.ajax({
					type : "post",
					url: 'dgCenter/DgGeneral.General.query.json',
					// async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00067',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					dataType : "json",
					success(data) {
						if(data.success) {
							designer.paperArr = data.data;
						}
					}
				});
				designer.attachmentArr = [];
				$.ajax({
					type : "post",
					url: 'dgCenter/DgGeneral.General.query.json',
					// async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00069',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					dataType : "json",
					success(data) {
						if(data.success) {
							designer.attachmentArr = data.data;
						}
					}
				});
			});
			addBtn.click(function () {
				itemsOptions[itemsOptions.length] = new Option("链接" + itemsOptions.length.toString());
				if (items[0].length === 1) {
					thisItems = [];
				}
				thisItems.push(
					{
						radio: "0",
						text: '',
						sheetText: '',
						paperListCell: paperSelectedId,
						paperTextCell: '',
						displayText: '',
						paperText: paperSelectedId,
						attachmentText: '',
						fileName: '',
						paperInput: '',
						paperName: ''
					});
				radio.removeAttr('disabled');
				text.removeAttr('disabled');
				sheetText.removeAttr('disabled');
				paperTextCell.removeAttr('disabled');
				paperListCell.removeAttr('disabled');
				displayText.removeAttr('disabled');
				clearPaperBtn.removeAttr('disabled');
				refershPaperBtn.removeAttr('disabled');
				openDgBtn.removeAttr('disabled');
				items.trigger("change", { selectMoveTo: thisItems.length - 1, action: "add" });
			});
			removeBtn.click(function () {
				itemsOptions.remove(_this.selectedIndex);
				for (var i = _this.selectedIndex; i < itemsOptions.length; i++) {
					itemsOptions[i] = new Option("链接" + i.toString());
				}
				thisItems.splice(_this.selectedIndex, 1);
				var select;
				if (thisItems.length > _this.selectedIndex) {
					select = _this.selectedIndex;
				} else if (thisItems.length > 0) {
					select = _this.selectedIndex - 1;
				} else {
					select = -1;
					radio.attr('disabled', true);
					text.val('');
					text.attr('disabled', true);
					sheetText.val('');
					sheetText.attr('disabled', true);
					paperTextCell.val('');
					paperTextCell.attr('disabled', true);
					displayText.val('');
					displayText.attr('disabled', true);
					paperInput.val('');
					paperInput.attr('disabled', true);
					paperText.val(paperSelectedId);
					attachmentText.val('');
					attachmentText.attr('disabled', true);
					clearPaperBtn.attr('disabled', true);
					refershPaperBtn.attr('disabled', true);
					openDgBtn.attr('disabled', true);
					clearDgBtn.attr('disabled', true);
					refreshDgBtn.attr('disabled', true);
				}
				items.trigger("change", { selectMoveTo: select, action: "remove" });
			});
			items.change(function (evt, args) {
				var srcElement = evt.target || evt.srcElement;
				var ele = srcElement;
				//Add or switch selected item need save data of item.
				if ((args === undefined || args.action === "add") && (_this.selectedIndex !== -1 && _this.selectedIndex < thisItems.length)) {
					thisItems[_this.selectedIndex] = {
						radio: _this._element.find("input[name='linktype']:checked").val(),
						text: text.val(),
						sheetText: sheetText.val(),
						paperListCell: paperListCell.val(),
						paperTextCell: paperTextCell.val(),
						displayText: displayText.val(),
						paperText: paperText.val(),
						attachmentText: attachmentText.val(),
						fileName: paperText.val() === '' ? '' : (attachmentText.val() === '' ? paperInput.val() : attachmentText[0].selectedOptions[0].text),
						paperInput: paperInput.val(),
						paperName: paperInput.val()
					};
				}
				//Load data of item.
				if (args === undefined) {
					_this.selectedIndex = parseInt(ele.value.substring(2));
				} else {
					_this.selectedIndex = args.selectMoveTo;
				}
				if (_this.selectedIndex !== -1) {
					$("#attachment_list").empty();
					$("#attachment_list").append('<option value=""></option>');
					$(itemsOptions[_this.selectedIndex]).prop("selected", true);
					_this._element.find("input[name='linktype'][value='"+ thisItems[_this.selectedIndex].radio +"']").prop("checked", true);
					text.val(thisItems[_this.selectedIndex].text);
					sheetText.val(thisItems[_this.selectedIndex].sheetText);
					paperListCell.val(thisItems[_this.selectedIndex].paperListCell);
					paperTextCell.val(thisItems[_this.selectedIndex].paperTextCell);
					displayText.val(thisItems[_this.selectedIndex].displayText);
					paperText.val(thisItems[_this.selectedIndex].paperText);
					paperInput.val(thisItems[_this.selectedIndex].paperInput);
					attachmentText.val(thisItems[_this.selectedIndex].attachmentText);
					if (thisItems[_this.selectedIndex].radio === "0") {
						displayText.removeAttr('disabled');
						paperTextCell.removeAttr('disabled');
						sheetText.removeAttr('disabled');
						text.removeAttr('disabled');
						paperInput.attr('disabled', true);
						attachmentText.attr('disabled', true);
						if(paperTextCell.val() != ''){
							setDgSheet(paperSelectedId, 'sheet_list');
							sheetText.val(thisItems[_this.selectedIndex].sheetText);
						}
					} else if (thisItems[_this.selectedIndex].radio === "1") {
						displayText.attr('disabled', true);
						paperTextCell.attr('disabled', true);
						sheetText.attr('disabled', true);
						text.attr('disabled', true);
						paperInput.removeAttr('disabled');
						attachmentText.removeAttr('disabled');
						for (var i = 0; i < designer.attachmentArr.length; i++) {
							if (designer.attachmentArr[i].workpaperId == thisItems[_this.selectedIndex].paperText.substring(0, thisItems[_this.selectedIndex].paperText.indexOf(":"))){
								$("#attachment_list").append("<option value='" + designer.attachmentArr[i].autoId + ":" + designer.attachmentArr[i].fileIndexId + "' title='" + designer.attachmentArr[i].fileName + "'>" + designer.attachmentArr[i].fileName + "</option>");
							}
						}
						attachmentText.val(thisItems[_this.selectedIndex].attachmentText);
					}
				}
			});
			radio.change(function () {
				if (this.value === "0") {
					displayText.removeAttr('disabled');
					paperTextCell.removeAttr('disabled');
					paperTextCell.val('');
					paperListCell.val(paperSelectedId);
					sheetText.val('');
					sheetText.removeAttr('disabled');
					text.removeAttr('disabled');
					paperInput.val('');
					paperInput.attr('disabled', true);
					paperText.val(paperSelectedId);
					attachmentText.val('');
					attachmentText.attr('disabled', true);
					setDgSheet(paperSelectedId, 'sheet_list');
					clearPaperBtn.removeAttr('disabled');
					refershPaperBtn.removeAttr('disabled');
					openDgBtn.removeAttr('disabled');
					clearDgBtn.attr('disabled', true);
					refreshDgBtn.attr('disabled', true);
				} else if (this.value === "1") {
					displayText.val('');
					displayText.attr('disabled', true);
					paperTextCell.val('');
					paperTextCell.attr('disabled', true);
					paperListCell.val(paperSelectedId);
					sheetText.val('');
					sheetText.attr('disabled', true);
					text.val('');
					text.attr('disabled', true);
					paperInput.removeAttr('disabled');
					attachmentText.attr('disabled', true);
					attachmentText.removeAttr('disabled');
					attachmentText.val('');
					if (paperText.val() !== '') {
						for (var i = 0; i < designer.attachmentArr.length; i++) {
							if (designer.attachmentArr[i].workpaperId == paperText.val().substring(0, paperText.val().indexOf(":"))){
								$("#attachment_list").append("<option value='" + designer.attachmentArr[i].autoId + ":" + designer.attachmentArr[i].fileIndexId + "' title='" + designer.attachmentArr[i].fileName + "'>" + designer.attachmentArr[i].fileName + "</option>");
							}
						}
					}
					clearPaperBtn.attr('disabled', true);
					refershPaperBtn.attr('disabled', true);
					openDgBtn.attr('disabled', true);
					clearDgBtn.removeAttr('disabled');
					refreshDgBtn.removeAttr('disabled');
				}
			});
			paperInput.on('focus',function(){
				$('#paper_list').css('display', 'block');
				$("#paper_list").empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到以paperInput.value()的内容开头的，添option
					if (designer.paperArr[i].fileName.indexOf(this.value)==0) {
						$("#paper_list").append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			paperInput.on('input',function(){
				$("#paper_list").empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到以paperInput.value()的内容开头的，添option
					if (designer.paperArr[i].fileName.substring(0,this.value.length).indexOf(this.value)==0) {
						$("#paper_list").append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			paperText.change(function () {
				paperInput.val(paperText[0].selectedOptions[0].text);
				$('#paper_list').css('display', 'none');
				$('#attachment_list').empty();
				$('#attachment_list').append('<option value=""></option>');
				var paper = paperText.val();
				if (paper !== '') {
					attachmentText.val('');
					attachmentText.removeAttr('disabled');
					for (var i = 0; i < designer.attachmentArr.length; i++) {
						if (designer.attachmentArr[i].workpaperId == paper.substring(0, paper.indexOf(":"))){
							$('#attachment_list').append("<option value='" + designer.attachmentArr[i].autoId + ":" + designer.attachmentArr[i].fileIndexId + "' title='" + designer.attachmentArr[i].fileName + "'>" + designer.attachmentArr[i].fileName + "</option>");
						}
					}
				} else {
					attachmentText.val('');
					attachmentText.attr('disabled', true);
				}
			});
		};

		CellTypeDialog.prototype._beforeOpen = function () {
			var _this = this;
			// radioButton
			var radio = this._element.find('input[name=linktype]');
			// 要显示的文字
			var displayText = this._element.find('.displayText');
			// 底稿
			var paperTextCell = this._element.find('.paperTextCell');
			var paperListCell = this._element.find('.paperListCell');
			$('#paper-list-cell').empty();
			for (var i = 0; i < designer.paperArr.length; i++) {
				$('#paper-list-cell').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
			}
			// 单元格
			var text = this._element.find('.text');
			// 工作表
			var sheetText = this._element.find('.sheetText');
			$('#sheet_list').empty();
			$('#sheet_list').append('<option value=""></option>');
			// 底稿
			var paperText = this._element.find('.paperText');
			var paperInput = this._element.find('.paperInput');
			$('#paper_list').empty();
			for (var i = 0; i < designer.paperArr.length; i++) {
				$('#paper_list').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
			}
			// 附件
			var attachmentText = this._element.find('.attachmentText');
			$('#attachment_list').empty();
			$('#attachment_list').append('<option value=""></option>');
			var clearPaperBtn = this._element.find(".clearPaper-button");
			var refershPaperBtn = this._element.find(".refershPaper-button");
			var openDgBtn = this._element.find(".openDgBtn-button");
			var clearDgBtn = this._element.find(".clearDg-button");
			var refreshDgBtn = this._element.find(".refreshDg-button");
			// 当前行
			var row = designer.wrapper.spread.getActiveSheet().getActiveRowIndex();
			// 当前列
			var col = designer.wrapper.spread.getActiveSheet().getActiveColumnIndex();
			// 当前单元格
			var activeCell = designer.wrapper.spread.getActiveSheet().getCell(row, col);
			// 当前单元格单元格类型
			var currentCellType = activeCell.cellType();
			var _cellType;
			if (currentCellType instanceof ShowTagCellType) {
				_cellType = currentCellType;
			} else {
				_cellType = new designer.ShowTagCellType();
			}
			var items = this._element.find('.items');
			var itemsOptions = items[0].options;
			items.empty();
			radio.attr('disabled', true);
			displayText.attr('disabled', true);
			paperTextCell.attr('disabled', true);
			sheetText.attr('disabled', true);
			text.attr('disabled', true);
			paperInput.attr('disabled', true);
			attachmentText.attr('disabled', true);
			clearPaperBtn.attr('disabled', true);
			refershPaperBtn.attr('disabled', true);
			openDgBtn.attr('disabled', true);
			clearDgBtn.attr('disabled', true);
			refreshDgBtn.attr('disabled', true);
			thisItems = [];
			if (_cellType._cellTagStartCache != undefined && _cellType._cellTagStartCache.length > 0) {
				for (var i = 0; i < _cellType._cellTagStartCache.length; i++) {
					itemsOptions[itemsOptions.length] = new Option('链接' + itemsOptions.length.toString());
					if (_cellType._cellTagStartCache[i].isFile) {
						thisItems.push({
							radio: '1',
							text: '',
							sheetText: designer.wrapper.spread.getActiveSheetIndex(),
							displayText: '',
							paperText: _cellType._cellTagStartCache[i].paperLink,
							attachmentText: _cellType._cellTagStartCache[i].attachmentLink,
							fileName: _cellType._cellTagStartCache[i].fileName,
							paperInput: _cellType._cellTagStartCache[i].paperName,
							paperName: _cellType._cellTagStartCache[i].paperName
						});
					} else {
						thisItems.push({
							radio: '0',
							text: _cellType._cellTagStartCache[i].formula.substring(_cellType._cellTagStartCache[i].formula.indexOf(":") + 1),
							sheetText: _cellType._cellTagStartCache[i].formula.substring(0, _cellType._cellTagStartCache[i].formula.indexOf(":")),
							paperListCell: _cellType._cellTagStartCache[i].paperListCell,
							paperTextCell: _cellType._cellTagStartCache[i].paperTextCell,
							displayText: _cellType._cellTagStartCache[i].displayText,
							paperText: paperSelectedId,
							attachmentText: '',
							fileName: '',
							paperInput: designer.fileName,
							paperName: designer.fileName
						});
					}
				}
				$(itemsOptions[0]).prop('selected', true);
				radio.removeAttr('disabled');
				var isFile = _cellType._cellTagStartCache[0].isFile;
				if (isFile) {
					this._element.find("input[name='linktype'][value='1']").prop("checked", true);
					displayText.val('');
					paperTextCell.val('');
					sheetText.val('');
					text.val('');
					// 底稿
					var paperLink = _cellType._cellTagStartCache[0].paperLink;
					// 附件
					var attachmentLink = _cellType._cellTagStartCache[0].attachmentLink;
					paperInput.val(_cellType._cellTagStartCache[0].paperName);
					paperText.val(paperLink);
					for (var i = 0; i < designer.attachmentArr.length; i++) {
						if (designer.attachmentArr[i].workpaperId == paperLink.substring(0, paperLink.indexOf(":"))){
							$('#attachment_list').append("<option value='" + designer.attachmentArr[i].autoId + ":" + designer.attachmentArr[i].fileIndexId + "' title='" + designer.attachmentArr[i].fileName + "'>" + designer.attachmentArr[i].fileName + "</option>");
						}
					}
					if (_cellType._cellTagStartCache[0].isPaper) {
						attachmentText.val('');
					} else {
						attachmentText.val(attachmentLink);
					}
					paperInput.removeAttr('disabled');
					attachmentText.removeAttr('disabled');
					clearDgBtn.removeAttr('disabled');
					refreshDgBtn.removeAttr('disabled');
				} else {
					// formula = sheetText(工作表索引) + ":" + text(单元格)
					var formula = _cellType._cellTagStartCache[0].formula;
					// 显示内容
					var display = _cellType._cellTagStartCache[0].displayText;
					this._element.find("input[name='linktype'][value='0']").prop("checked", true);
					paperInput.val('');
					paperText.val(paperSelectedId);
					attachmentText.val('');
					displayText.removeAttr('disabled');
					paperTextCell.removeAttr('disabled');
					clearPaperBtn.removeAttr('disabled');
					refershPaperBtn.removeAttr('disabled');
					openDgBtn.removeAttr('disabled');
					displayText.val(display);
					paperListCell.val(_cellType._cellTagStartCache[0].paperListCell);
					paperTextCell.val(_cellType._cellTagStartCache[0].paperTextCell);
					sheetText.val(formula.substring(0,formula.indexOf(':')));
					text.val(formula.substring(formula.indexOf(':') + 1));
					if(paperTextCell.val() != ''){
						sheetText.removeAttr('disabled');
						text.removeAttr('disabled');
						$.ajax({
							type : 'post',
							url : 'dgCenter/DgMain.getPaperSheetName.json',
							// async : false,
							data : {
								menuId: window.sys_menuId,
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: paperListCell.val().substring(0, paperListCell.val().indexOf(':')),
								start: -1,
								limit: -1
							},
							dataType : 'json',
							success(data) {
								if(data.success) {
									$('#sheet_list').empty();
									$('#sheet_list').append('<option value=""></option>');
									for(let i=0;i<data.data.length;i++){
										$('#sheet_list').append('<option value="' + i + '">' + data.data[i][0] + '</option>');
									}
									sheetText.val(formula.substring(0,formula.indexOf(":")));
									sheetText.removeAttr('disabled');
									text.removeAttr('disabled');
								}
							}
						});
					}
				}
				this.selectedIndex = 0;
			} else {
				this._element.find("input[name='linktype'][value='0']").prop('checked', true);
				displayText.val('');
				paperTextCell.val('');
				sheetText.val('');
				text.val('');
				paperTextCell.val('');
				paperListCell.val(paperSelectedId);
				paperInput.val('');
				paperText.val(paperSelectedId);
				attachmentText.val('');
			}
		};
		return CellTypeDialog;
	})(designer.BaseDialog);
	designer.CellTypeDialog = CellTypeDialog;

	
	var CustomLabelDialog = (function (_super) {

		designer.extends(CustomLabelDialog, _super);
		function CustomLabelDialog() {
			_super.call(this, (dialogHtmlPath), '.custom-label-dialog');
		}
		
		CustomLabelDialog.prototype._initOptions = function () {
			var self = this;
			return {
				resizable: false,
				width: 'auto',
				height: 'auto',
				modal: true,
				title: designer.res.customLabelDialog.title,
				buttons: [
					{
						text: designer.res.ok,
						click: function (e) {
							e.currentTarget.disabled = true;
							var sheet = designer.wrapper.spread.getActiveSheet();
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var cellValue = '';
							if(sheet.getValue(row,col) != null) {
								cellValue = sheet.getValue(row,col);
							}
							if(cellValue == null || cellValue == ''){
								cellValue = 0;
							}
							var customAlias = self._element.find('.cellAlias').val();
							if(customAlias.indexOf('+') != -1 
									|| customAlias.indexOf('-') != -1
									|| customAlias.indexOf('=') != -1){
								self._element.find('.cellAlias').focus();
								designer.MessageBox.show('标签名不能含有+、-、=', '提示', 1 /* info */, 0 /* ok */);
								e.currentTarget.disabled = false;
								return;
							}
							// var cellValue = sheet.getValue(row,col).constructor === Number ? sheet.getValue(row,col) : '';
							var param7;
							var tagInfoParam = {};
							if(designer.paperType == 'note'){
								param7 = designer.notePaperId;
								tagInfoParam = {
									type: 'note',
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									yyyy: window.CUR_PROJECT_ACC_YEAR,
									noteAutoId: designer.notePaperId,
									noteNo: designer.noteNo,
									fileName: designer.fileName,
									tagPosition: self._element.find('.cellPosition').val()
								};
							}else if(designer.paperType = 'dg'){
								param7 = designer.workpaperId;
								tagInfoParam = {
									type: 'dg',
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									yyyy: window.CUR_PROJECT_ACC_YEAR,
									workpaperId: designer.workpaperId,
									paperIndexId: designer.paperIndexId,
									fileName: designer.fileName,
									userSubjectId: designer.userSubjectId,
									userSubjectName: designer.userSubjectId + '-' + designer.userSubjectName,
									tagPosition: self._element.find('.cellPosition').val()
								};
							}
							var tagInfo = [];
							tagInfo.push(tagInfoParam);
							$.ajax({
								type : 'post',
								url : 'dgCenter/DgCheck.setTag.json',
								// async : false,
								data : {
									menuId: window.sys_menuId,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: self._element.find('.cellAlias').val(),
									param4: cellValue,
									param5: self._element.find('.cellPosition').val(),
									param6: JSON.stringify(tagInfo),
									param7: param7,
									param8: designer.paperType,
									start: -1,
									limit: -1
								},
								dataType : 'json',
								success(data) {
									if(data.success) {
										designer.MessageBox.show(data.resultInfo.statusText, '', 1 /* info */, 0 /* ok */, function (evt, result) {
											if (result === 1 /* ok */) {
												self.close();
												designer.wrapper.setFocusToSpread();
												e.currentTarget.disabled = false;
											}
										});
									} else {
										designer.MessageBox.show(data.resultInfo.statusText, '', 1 /* info */, 0 /* ok */);
										e.currentTarget.disabled = false;
									}
								}
							});
						}
					},
					{
						text: designer.res.cancel,
						click: function () {
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					}
				]
			};
		};

		CustomLabelDialog.prototype._beforeOpen = function () {
			var self = this;
			var sheetName = designer.wrapper.spread.getActiveSheet().name();
			var row = designer.wrapper.spread.getActiveSheet().getActiveRowIndex();
			if (isNaN(row)){
				designer.MessageBox.show('未选择单元格！', '失败', 3 /* error */, 0 /* ok */, function (evt, result) {
					if (result === 1 /* ok */) {
						self.close();
						designer.wrapper.setFocusToSpread();

					}
				});
			}
			var col = designer.wrapper.spread.getActiveSheet().getActiveColumnIndex();
			var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			// 单元格位置
			var cellPosition = self._element.find('.cellPosition');
			if(designer.paperType == 'note'){
				cellPosition.val(designer.notePaperId + ':' + sheetName + ':' + rangeStr);
			}else if(designer.paperType = 'dg'){
				cellPosition.val(designer.workpaperId + ':' + sheetName + ':' + rangeStr);
			}
			cellPosition.attr('title', cellPosition.val());
			self._element.find('.cellAlias').val('');
			$.ajax({
				type : 'post',
				url: 'dgCenter/DgGeneral.General.query.json',
				// async : false,
				data : {
					menuId: window.sys_menuId,
					sqlId: 'DG00082',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: self._element.find('.cellPosition').val(),
					start: -1,
					limit: -1
				},
				dataType : 'json',
				success(data) {
					if(data.success && data.data.length !== 0) {
						// 标签名
						self._element.find('.cellAlias').val(data.data[0].tagName);
					}
				}
			});
		};
		return CustomLabelDialog;
	})(designer.BaseDialog);
	designer.CustomLabelDialog = CustomLabelDialog;

	var MutualIndexDialog = (function (_super) {

		designer.extends(MutualIndexDialog, _super);
		function MutualIndexDialog() {
			_super.call(this, (dialogHtmlPath), '.mutual-index-dialog');
		}
		
		MutualIndexDialog.prototype._initOptions = function () {
			var self = this;
			return {
				resizable: false,
				width: 'auto',
				height: 'auto',
				modal: true,
				title: designer.res.mutualIndexDialog.title,
				buttons: [
					{
						text: designer.res.ok,
						click: function () {
							// radioButton 0--TB 1--导引表 2--底稿 3--附注
							var leftIndexTypeValue = self._element.find("input[name=leftIndexType]:checked").val();
							var isOk = true;
							if(leftIndexTypeValue == '0'){
								isOk = setFormula_0(self);
							}else if(leftIndexTypeValue == '1'){
								isOk = setFormula_1(self);
							}else if(leftIndexTypeValue == '2'){
								isOk = setFormula_2(self);
							}else if(leftIndexTypeValue == '3'){
								isOk = setFormula_3(self);
							}
							if(!isOk){
								return;
							}
							setShowMutualIndex(self);
							designer.MessageBox.show('设置成功！', '', 1 /* info */, 0 /* ok */, function (evt, result) {
								if (result === 1 /* ok */) {
									self.close();
									designer.wrapper.setFocusToSpread();
								}
							});
						}
					},
					{
						text: designer.res.mutualIndexDialog.exchangeBtn,
						click: function () {
							var sheet = designer.wrapper.spread.getActiveSheet();
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var currentCell = sheet.getCell(row, col);
							// 当前单元格单元格类型
							var currentCellType = currentCell.cellType();
							var _cellType;
							if (currentCellType instanceof ShowMutualIndex) {
								_cellType = currentCellType;
							} else {
								_cellType = new designer.ShowMutualIndex();
							}
							setStyle_0(self);
							if(!isExChange){
								$('#leftLabel').html('右交叉索引');
								$('#rightLabel').html('左交叉索引');
								$("#leftTd").insertAfter($("#rightTd"));
								isExChange = true;
								if (_cellType._cellTagStartCache && _cellType._cellTagStartCache[1] && _cellType._cellTagStartCache.length > 0) {
									var cellTagCache = _cellType._cellTagStartCache[1];
									setMutualIndexCell(cellTagCache, self);
								}
							}else{
								$('#leftLabel').html('左交叉索引');
								$('#rightLabel').html('右交叉索引');
								$("#rightTd").insertAfter($("#leftTd"));
								isExChange = false;
								if (_cellType._cellTagStartCache && _cellType._cellTagStartCache[0] && _cellType._cellTagStartCache.length > 0) {
									var cellTagCache = _cellType._cellTagStartCache[0];
									setMutualIndexCell(cellTagCache, self);
								}
							}
						}
					},
					{
						text: designer.res.mutualIndexDialog.clearBtn,
						click: function () {
							self.close();
							$('#tagDeleteModal').modal('show');
						}
					},
					{
						text: designer.res.cancel,
						click: function () {
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					}
				]
			};
		};

		var isExChange = false;

		function getRightTagInfo(rightTagPosition){
			let rightTagInfo = [];
			if(designer.paperType == 'note'){
				rightTagInfo.push({
					type: 'note',
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					yyyy: window.CUR_PROJECT_ACC_YEAR,
					noteAutoId: designer.notePaperId,
					noteNo: designer.noteNo,
					fileName: designer.fileName,
					tagPosition: rightTagPosition
				});
			}else if(designer.paperType == 'dg'){
				rightTagInfo.push({
					type: 'dg',
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					yyyy: window.CUR_PROJECT_ACC_YEAR,
					workpaperId: designer.workpaperId,
					paperIndexId: designer.paperIndexId,
					fileName: designer.fileName,
					userSubjectId: designer.userSubjectId,
					userSubjectName: designer.userSubjectId + '-' + designer.userSubjectName,
					tagPosition: rightTagPosition
				});
			}
			return rightTagInfo;
		}
		// 设置公式
		function setFormula(param){
			var bReturn = true;
			$.ajax({
				type : "post",
				url : 'dgCenter/DgWapper.setMutualIndex.json',
				async : false,
				data : param,
				dataType : "json",
				success(data) {
					if(!data.success){
						bReturn = false;
						designer.MessageBox.show('保存失败', data.resultInfo.statusText, 3);
					}
				}
			});
			return bReturn;
		}
		// 设置TB科目公式
		function setFormula_0(_this){
			// TB科目
			var tbList = _this._element.find('.tbList');
			if(tbList.val() == null || tbList.val() == ""){
				designer.MessageBox.show('请选择TB科目', '', 3);
				return false;
			}
			// 科目项
			var tbColumnList = _this._element.find('.tbColumnList');
			var field, leftTagValue;
			var index = designer.tbArr.findIndex((item) => {return item.tbSubjectId == tbList.val()});
			if(tbColumnList.val() == 0){
				field = 'unAuditAmount';
				leftTagValue = designer.tbArr[index].unAuditAmount;
			}else if(tbColumnList.val() == 1){
				field = 'adjustAmount';
				leftTagValue = designer.tbArr[index].adjustAmount;
			}else if(tbColumnList.val() == 2){
				field = 'auditAmount';
				leftTagValue = designer.tbArr[index].auditAmount;
			}
			var leftTagName = tbList.val() + tbList.find('option:selected').attr('title') + window.CUR_PROJECT_ACC_YEAR + '年' + tbColumnList.find('option:selected').text();
			var leftTagPosition = tbList.find('option:selected').text() + ':' + window.CUR_PROJECT_ACC_YEAR + '年' + tbColumnList.find('option:selected').text();
			let leftTagInfo = [];
			leftTagInfo.push({
				type: 'db',
				dbName: 'bdo_dg.dg_tbtable',
				selectParam: 'unAuditAmount, adjustAmount, auditAmount',
				whereParam: ' customerId = ' + window.CUR_CUSTOMERID + ' AND projectId = ' + window.CUR_PROJECTID + ' AND yyyy = ' + window.CUR_PROJECT_ACC_YEAR + " AND tbSubjectId = '" + tbList.val() + "' AND ACTIVE_FLAG = '1'",
				field: field,
				subjectId: tbList.val(),
				subjectName:  tbList.find('option:selected').text()
			});
			// 当前单元格
			var activeCellInput = _this._element.find('.activeCellInput');
			var rightTagName = activeCellInput.val();
			var rightTagValue = activeCellInput.attr('data-value');
			var rightTagPosition = activeCellInput.val();
			var rightTagInfo = getRightTagInfo(rightTagPosition);
			var param = {
				menuId: window.sys_menuId,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			};
			if(!isExChange){
				param.param3 = leftTagName;
				param.param4 = leftTagValue;
				param.param5 = leftTagPosition;
				param.param6 = JSON.stringify(leftTagInfo);
				param.param7 = '';
				param.param8 = 0;
				param.param9 = rightTagName;
				param.param10 = rightTagValue;
				param.param11 = rightTagPosition;
				param.param12 = JSON.stringify(rightTagInfo);
				param.param13 = rightTagPosition.substring(0, rightTagPosition.indexOf(':'));
				param.param14 = designer.paperType == 'dg' ? 2 : 3;
				// 公式右边为单元格
				param.param15 = 0;
			}else{
				param.param3 = rightTagName;
				param.param4 = rightTagValue;
				param.param5 = rightTagPosition;
				param.param6 = JSON.stringify(rightTagInfo);
				param.param7 = rightTagPosition.substring(0, rightTagPosition.indexOf(':'));
				param.param8 = designer.paperType == 'dg' ? 2 : 3;
				param.param9 = leftTagName;
				param.param10 = leftTagValue;
				param.param11 = leftTagPosition;
				param.param12 = JSON.stringify(leftTagInfo);
				param.param13 = '';
				param.param14 = 0;
				// 公式左边为单元格
				param.param15 = 1;
			}
			return setFormula(param);
		}
		// 设置财务科目公式
		function setFormula_1(_this){
			// 财务科目
			var guideList = _this._element.find('.guideList');
			if(guideList.val() == null || guideList.val() == ""){
				designer.MessageBox.show('请选择财务科目', '', 3);
				return false;
			}
			// 科目项
			var guideColumnList = _this._element.find('.guideColumnList');
			var index = designer.guideArr.findIndex((item) => {return item.subjectId == guideList.val()});
			var field, leftTagValue;
			if(guideColumnList.val() == 0){
				field = 'preBefore';
				leftTagValue = designer.guideArr[index].preBefore;
			}else if(guideColumnList.val() == 1){
				field = 'preAdjust';
				leftTagValue = designer.guideArr[index].preAdjust;
			}else if(guideColumnList.val() == 2){
				field = 'preAfter';
				leftTagValue = designer.guideArr[index].preAfter;
			}else if(guideColumnList.val() == 3){
				field = 'currentBefore';
				leftTagValue = designer.guideArr[index].currentBefore;
			}else if(guideColumnList.val() == 4){
				field = 'currentAdjust';
				leftTagValue = designer.guideArr[index].currentAdjust;
			}else if(guideColumnList.val() == 5){
				field = 'currentAfter';
				leftTagValue = designer.guideArr[index].currentAfter;
			}
			var leftTagName = guideList.val() + guideColumnList.find('option:selected').text();
			var leftTagPosition = guideList.find('option:selected').text() + ':' + guideColumnList.find('option:selected').text() + window.CUR_PROJECT_ACC_YEAR;
			let leftTagInfo = [];
			leftTagInfo.push({
				type: 'function',
				className : 'cn.com.bdo.dgCenter.service.DgCommonService',
				methodName: 'getTagValueFunction',
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				yyyy: window.CUR_PROJECT_ACC_YEAR,
				subjectId: designer.guideArr[index].subjectId,
				subjectName: designer.guideArr[index].subjectId + '-' + designer.guideArr[index].subjectName,
				baseSubjectId: designer.guideArr[index].baseSubjectId,
				field: field
			});
			// 当前单元格
			var activeCellInput = _this._element.find('.activeCellInput');
			var rightTagName = activeCellInput.val();
			var rightTagValue = activeCellInput.attr('data-value');
			var rightTagPosition = activeCellInput.val();
			var rightTagInfo = getRightTagInfo(rightTagPosition);
			var param = {
				menuId: window.sys_menuId,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			};
			if(!isExChange){
				param.param3 = leftTagName;
				param.param4 = leftTagValue;
				param.param5 = leftTagPosition;
				param.param6 = JSON.stringify(leftTagInfo);
				param.param7 = '';
				param.param8 = 1;
				param.param9 = rightTagName;
				param.param10 = rightTagValue;
				param.param11 = rightTagPosition;
				param.param12 = JSON.stringify(rightTagInfo);
				param.param13 = rightTagPosition.substring(0, rightTagPosition.indexOf(':'));
				param.param14 = designer.paperType == 'dg' ? 2 : 3;
				param.param15 = 0;
			}else{
				param.param3 = rightTagName;
				param.param4 = rightTagValue;
				param.param5 = rightTagPosition;
				param.param6 = JSON.stringify(rightTagInfo);
				param.param7 = rightTagPosition.substring(0, rightTagPosition.indexOf(':'));
				param.param8 = designer.paperType == 'dg' ? 2 : 3;
				param.param9 = leftTagName;
				param.param10 = leftTagValue;
				param.param11 = leftTagPosition;
				param.param12 = JSON.stringify(leftTagInfo);
				param.param13 = '';
				param.param14 = 1;
				param.param15 = 1;
			}
			return setFormula(param);
		}
		// 设置底稿公式
		function setFormula_2(_this){
			// 底稿
			var dgList = _this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = _this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = _this._element.find('.dgCellInput');
			if(dgList.val() == null || dgList.val() == ""){
				designer.MessageBox.show('请选择底稿', '', 3);
				return false;
			}else{
				if(dgSheet.val() == null || dgSheet.val() == ""){
					designer.MessageBox.show('请选择底稿Sheet', '', 3);
					return false;
				}else{
					if(dgCellInput.val() == ""){
						designer.MessageBox.show('请选择底稿单元格', '', 3);
						return false;
					}
				}
			}
			var index = designer.paperArr.findIndex((item) => {return item.autoId + ':' + item.indexId == dgList.val()});
			var leftTagName = designer.paperArr[index].autoId + ':' + dgSheet.find('option:selected').text() + ':' + dgCellInput.val();
			var leftTagPosition = leftTagName;
			let leftTagInfo = [];
			leftTagInfo.push({
				type: 'dg',
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				yyyy: window.CUR_PROJECT_ACC_YEAR,
				workpaperId: designer.paperArr[index].autoId,
				paperIndexId: designer.paperArr[index].indexId,
				fileName: designer.paperArr[index].fileName,
				userSubjectId: designer.paperArr[index].subjectId,
				userSubjectName: designer.paperArr[index].subjectId + '-' + designer.paperArr[index].subjectName ,
				tagPosition: leftTagPosition
			});
			// 当前单元格
			var activeCellInput = _this._element.find('.activeCellInput');
			var rightTagName = activeCellInput.val();
			var rightTagValue = activeCellInput.attr('data-value');
			var rightTagPosition = activeCellInput.val();
			var rightTagInfo = getRightTagInfo(rightTagPosition);
			var param = {
				menuId: window.sys_menuId,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			};
			if(!isExChange){
				param.param3 = leftTagName;
				param.param4 = '';
				param.param5 = leftTagPosition;
				param.param6 = JSON.stringify(leftTagInfo);
				param.param7 = designer.paperArr[index].autoId;
				param.param8 = 2;
				param.param9 = rightTagName;
				param.param10 = rightTagValue;
				param.param11 = rightTagPosition;
				param.param12 = JSON.stringify(rightTagInfo);
				param.param13 = rightTagPosition.substring(0, rightTagPosition.indexOf(':'));
				param.param14 = designer.paperType == 'dg' ? 2 : 3;
				param.param15 = 0;
			}else{
				param.param3 = rightTagName;
				param.param4 = rightTagValue;
				param.param5 = rightTagPosition;
				param.param6 = JSON.stringify(rightTagInfo);
				param.param7 = rightTagPosition.substring(0, rightTagPosition.indexOf(':'));
				param.param8 = designer.paperType == 'dg' ? 2 : 3;
				param.param9 = leftTagName;
				param.param10 = '';
				param.param11 = leftTagPosition;
				param.param12 = JSON.stringify(leftTagInfo);
				param.param13 = designer.paperArr[index].autoId;
				param.param14 = 2;
				param.param15 = 1;
			}
			return setFormula(param);
		}
		// 设置附注公式
		function setFormula_3(_this){
			// 附注
			var noteList = _this._element.find('.noteList');
			// 附注sheet
			var noteSheet = _this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = _this._element.find('.noteCellInput');
			if(noteList.val() == null || noteList.val() == ""){
				designer.MessageBox.show('请选择附注', '', 3);
				return false;
			}else{
				if(noteSheet.val() == null || noteSheet.val() == ""){
					designer.MessageBox.show('请选择附注Sheet', '', 3);
					return false;
				}else{
					if(noteCellInput.val() == ""){
						designer.MessageBox.show('请选择附注单元格', '', 3);
						return false;
					}
				}
			}
			var index = designer.noteArr.findIndex((item) => {return item.autoId + ':' + item.noteNo == noteList.val()});
			var leftTagName = designer.noteArr[index].autoId + ':' + noteSheet.find('option:selected').text() + ':' + noteCellInput.val();
			var leftTagPosition = leftTagName;
			let leftTagInfo = [];
			leftTagInfo.push({
				type: 'note',
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				yyyy: window.CUR_PROJECT_ACC_YEAR,
				noteAutoId: designer.noteArr[index].autoId,
				noteNo: designer.noteArr[index].noteNo,
				fileName: designer.noteArr[index].fileName,
				tagPosition: leftTagPosition
			});
			// 当前单元格
			var activeCellInput = _this._element.find('.activeCellInput');
			var rightTagName = activeCellInput.val();
			var rightTagValue = activeCellInput.attr('data-value');
			var rightTagPosition = activeCellInput.val();
			var rightTagInfo = getRightTagInfo(rightTagPosition);
			var param = {
				menuId: window.sys_menuId,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			};
			if(!isExChange){
				param.param3 = leftTagName;
				param.param4 = '';
				param.param5 = leftTagPosition;
				param.param6 = JSON.stringify(leftTagInfo);
				param.param7 = designer.noteArr[index].autoId;
				param.param8 = 3;
				param.param9 = rightTagName;
				param.param10 = rightTagValue;
				param.param11 = rightTagPosition;
				param.param12 = JSON.stringify(rightTagInfo);
				param.param13 = rightTagPosition.substring(0, rightTagPosition.indexOf(':'));
				param.param14 = designer.paperType == 'dg' ? 2 : 3;
				param.param15 = 0;
			}else{
				param.param3 = rightTagName;
				param.param4 = rightTagValue;
				param.param5 = rightTagPosition;
				param.param6 = JSON.stringify(rightTagInfo);
				param.param7 = rightTagPosition.substring(0, rightTagPosition.indexOf(':'));
				param.param8 = designer.paperType == 'dg' ? 2 : 3;
				param.param9 = leftTagName;
				param.param10 = '';
				param.param11 = leftTagPosition;
				param.param12 = JSON.stringify(leftTagInfo);
				param.param13 = designer.noteArr[index].autoId;
				param.param14 = 3;
				param.param15 = 1;
			}
			return setFormula(param);
		}

		function getCellTagRight(){
			var sheet = designer.wrapper.spread.getActiveSheet();
			var sheetIndex = designer.wrapper.spread.getActiveSheetIndex();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			var rightParam = {
				type: 'link',
				linkType: designer.paperType == 'dg' ? 2 : 3,
				displayText: designer.fileName + ':' + sheet.name() + ':' + rangeStr,
				paperId:  designer.paperType == 'dg' ? designer.workpaperId : designer.notePaperId,
				paperIndex: designer.paperType == 'dg' ? designer.paperIndexId : designer.noteNo,
				paperName: designer.fileName,
				sheetIndex: sheetIndex,
				sheetName: sheet.name(),
				cell: rangeStr
			};
			var cellTagRight = [];
			if(!isExChange){
				rightParam.linkText = 'R';
			}else{
				rightParam.linkText = 'L';
			}
			cellTagRight.push(rightParam);
			return cellTagRight;
		}

		function setLeftParam_0(_this){
			// TB科目
			var tbList = _this._element.find('.tbList');
			// 科目项
			var tbColumnList = _this._element.find('.tbColumnList');
			// 当前单元格
			var activeCellInput = _this._element.find('.activeCellInput');
			var displayText = tbList.find('option:selected').text() + ':' + tbColumnList.find('option:selected').text();
			var leftParam = {
				type: 'link',
				linkType: 0,
				displayText: displayText,
				linkText: 'L'
			};
			return leftParam;
		}

		function setLeftParam_1(_this){
			// 财务科目
			var guideList = _this._element.find('.guideList');
			// 科目项
			var guideColumnList = _this._element.find('.guideColumnList');
			// 当前单元格
			var activeCellInput = _this._element.find('.activeCellInput');
			var displayText = guideList.find('option:selected').text() + ':' + guideColumnList.find('option:selected').text();
			var leftParam = {
				type: 'link',
				linkType: 1,
				displayText: displayText,
				linkText: 'L'
			};
			return leftParam;
		}

		function setLeftParam_2(_this){
			// 底稿
			var dgList = _this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = _this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = _this._element.find('.dgCellInput');
			// 当前单元格
			var activeCellInput = _this._element.find('.activeCellInput');
			var displayText = dgList.find('option:selected').text() + ':' + dgSheet.find('option:selected').text() + ':' + dgCellInput.val();
			var leftParam = {
				type: 'link',
				linkType: 2,
				displayText: displayText,
				paperId: dgList.val().substring(0, dgList.val().indexOf(':')),
				paperIndex: dgList.val().substring(dgList.val().indexOf(':') + 1),
				paperName: dgList.find('option:selected').text(),
				sheetIndex: dgSheet.val(),
				sheetName: dgSheet.find('option:selected').text(),
				cell: dgCellInput.val()
			};
			return leftParam;
		}

		function setLeftParam_3(_this){
			// 附注
			var noteList = _this._element.find('.noteList');
			// 附注sheet
			var noteSheet = _this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = _this._element.find('.noteCellInput');
			// 当前单元格
			var activeCellInput = _this._element.find('.activeCellInput');
			var displayText = noteList.find('option:selected').text() + ':' + noteSheet.find('option:selected').text() + ':' + noteCellInput.val();
			var leftParam = {
				type: 'link',
				linkType: 3,
				displayText: displayText,
				paperId: noteList.val().substring(0, noteList.val().indexOf(':')),
				paperIndex: noteList.val().substring(noteList.val().indexOf(':') + 1),
				paperName: noteList.find('option:selected').text(),
				sheetIndex: noteSheet.val(),
				sheetName: noteSheet.find('option:selected').text(),
				cell: noteCellInput.val()
			};
			return leftParam;
		}

		function setShowMutualIndex(_this){
			var sheet = designer.wrapper.spread.getActiveSheet();
			var spread = designer.wrapper.spread;
			var sheetIndex = designer.wrapper.spread.getActiveSheetIndex();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			// radioButton 0--TB 1--导引表 2--底稿 3--附注
			var leftIndexTypeValue = _this._element.find("input[name=leftIndexType]:checked").val();
			var leftParam;
			if(leftIndexTypeValue == '0'){
				leftParam = setLeftParam_0(_this);
			}else if(leftIndexTypeValue == '1'){
				leftParam = setLeftParam_1(_this);
			}else if(leftIndexTypeValue == '2'){
				leftParam = setLeftParam_2(_this);
			}else if(leftIndexTypeValue == '3'){
				leftParam = setLeftParam_3(_this);
			}
			var cellTag;
			var cellTagLeft = [];
			var cellTag1;
			var cellTagRight = getCellTagRight();
			if(!isExChange){
				leftParam.linkText = 'L';
				cellTagLeft.push(leftParam);
				cellTag = {
					cellTagStart: cellTagLeft,
					cellTagEnd:[]
				};
				cellTag1 = {
					cellTagStart: [],
					cellTagEnd: cellTagRight
				};
			}else{
				leftParam.linkText = 'R';
				cellTagLeft.push(leftParam);
				cellTag = {
					cellTagStart: [],
					cellTagEnd: cellTagLeft
				};
				cellTag1 = {
					cellTagStart: cellTagRight,
					cellTagEnd: []
				};
			}
			var mapKey = sheetIndex + ':' + row + ':' + col;
			if (!designer.ShowMutualIndexCacheMap.has(mapKey)) {
				designer.ShowMutualIndexCacheMap.set(mapKey,cellTag);
			} else if (designer.ShowMutualIndexCacheMap.has(mapKey)) {
				var keyTag = designer.ShowMutualIndexCacheMap.get(mapKey);
				if(!isExChange){
					cellTag.cellTagEnd = keyTag.cellTagEnd;
				}else{
					cellTag.cellTagStart = keyTag.cellTagStart;
				}
				designer.ShowMutualIndexCacheMap.delete(mapKey);
				designer.ShowMutualIndexCacheMap.set(mapKey,cellTag);
			}
			let objMutualIndex = {};
			let mutualIndexMap = designer.ShowMutualIndexCacheMap;
			for (let[k,v] of mutualIndexMap) {
				objMutualIndex[k] = v;
			}
			designer.setShowMutualIndexCacheMap(objMutualIndex);
			
			let objCellType = {};
			let cellTypeMap = designer.ShowTagCellTypeCacheMap;
			for (let[k,v] of cellTypeMap) {
				objCellType[k] = v;
			}
			var customizeStyle;
			if(designer.paperType == 'dg'){
				customizeStyle= JSON.stringify({
					ShowTagCellTypeCacheMap: objCellType,
					ShowMutualIndexCacheMap: objMutualIndex
				});
			}else{
				customizeStyle= JSON.stringify({
					ShowMutualIndexCacheMap: objMutualIndex
				});
			}
			var url = designer.paperType == 'dg' ? 'dgCenter/DgWapper.setDgCustomizeStyle.json' : 'dgCenter/DgWapper.setNoteCustomizeStyle.json';
			var param = {
				menuId: window.sys_menuId,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: designer.paperType == 'dg' ? designer.workpaperId : designer.notePaperId,
				param4: customizeStyle,
				start: -1,
				limit: -1
			};
			$.ajax({
				url : url,
				async : false,
				type : 'post',
				data : param,
				dataType : 'json',
				success : function(data){}
			});
			if(leftIndexTypeValue == '2'){
				var sqlId = 'DG00132';
				// 底稿
				var dgList = _this._element.find('.dgList');
				var customizeStyle1 = getCustomizeStyle(sqlId, dgList.val().substring(0, dgList.val().indexOf(':')));
				var strMap = new Map();
				var showTagCellTypeCacheMap = new Map();
				if(customizeStyle1){
					if(customizeStyle1.ShowTagCellTypeCacheMap){
						var mapJson = customizeStyle1.ShowTagCellTypeCacheMap;
						// json转换为map
						for (let k of Object.keys(mapJson)) {
							showTagCellTypeCacheMap.set(k, mapJson[k]);
						}
					}
					if(customizeStyle1.ShowMutualIndexCacheMap){
						var mapJson = customizeStyle1.ShowMutualIndexCacheMap;
						// json转换为map
						for (let k of Object.keys(mapJson)) {
							strMap.set(k, mapJson[k]);
						}
					}
				}
				// 底稿sheet
				var dgSheet = _this._element.find('.dgSheet');
				// 底稿单元格
				var dgCellInput = _this._element.find('.dgCellInput');
				var range1 = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, dgCellInput.val(), 0, 0);
				var key = dgSheet.val() + ':' + range1.row + ':' + range1.col;
				if (!strMap.has(key)) {
					strMap.set(key,cellTag1);
				} else if (strMap.has(key)) {
					var keyTag = strMap.get(key);
					if(!isExChange){
						cellTag1.cellTagStart = keyTag.cellTagStart;
					}else{
						cellTag1.cellTagEnd = keyTag.cellTagEnd;
					}
					strMap.delete(key);
					strMap.set(key,cellTag1);
				}
				let objCellType = {};
				for (let[k,v] of showTagCellTypeCacheMap) {
					objCellType[k] = v;
				}
				
				let objMutualIndex = {};
				for (let[k,v] of strMap) {
					objMutualIndex[k] = v;
				}
				var setCustomizeStyle = JSON.stringify({
					ShowTagCellTypeCacheMap: objCellType,
					ShowMutualIndexCacheMap: objMutualIndex
				});
				$.ajax({
					url : 'dgCenter/DgWapper.setDgCustomizeStyle.json',
					async : false,
					type : 'post',
					data : {
						menuId: window.sys_menuId,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: dgList.val().substring(0, dgList.val().indexOf(':')),
						param4: setCustomizeStyle,
						start: -1,
						limit: -1
					},
					dataType : 'json',
					success : function(data){}
				});
			}else if(leftIndexTypeValue == '3'){
				var sqlId = 'DG00133';
				// 附注
				var noteList = _this._element.find('.noteList');
				var customizeStyle1 = getCustomizeStyle(sqlId, noteList.val().substring(0, noteList.val().indexOf(':')));
				var strMap = new Map();
				if(customizeStyle1 && customizeStyle1.ShowMutualIndexCacheMap){
					var mapJson = customizeStyle1.ShowMutualIndexCacheMap;
					// json转换为map
					for (let k of Object.keys(mapJson)) {
						strMap.set(k, mapJson[k]);
					}
				}
				// 附注sheet
				var noteSheet = _this._element.find('.noteSheet');
				// 附注单元格
				var noteCellInput = _this._element.find('.noteCellInput');
				var range1 = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, noteCellInput.val(), 0, 0);
				var key = noteSheet.val() + ':' + range1.row + ':' + range1.col;
				if (!strMap.has(key)) {
					strMap.set(key,cellTag1);
				} else if (strMap.has(key)) {
					var keyTag = strMap.get(key);
					if(!isExChange){
						cellTag1.cellTagStart = keyTag.cellTagStart;
					}else{
						cellTag1.cellTagEnd = keyTag.cellTagEnd;
					}
					strMap.delete(key);
					strMap.set(key,cellTag1);
				}
				let objMutualIndex = {};
				for (let[k,v] of strMap) {
					objMutualIndex[k] = v;
				}
				var setCustomizeStyle = JSON.stringify({
					ShowMutualIndexCacheMap: objMutualIndex
				});
				$.ajax({
					url : 'dgCenter/DgWapper.setNoteCustomizeStyle.json',
					async : false,
					type : 'post',
					data : {
						menuId: window.sys_menuId,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: noteList.val().substring(0, noteList.val().indexOf(':')),
						param4: setCustomizeStyle,
						start: -1,
						limit: -1
					},
					dataType : 'json',
					success : function(data){}
				});
			}
		}
		function getCustomizeStyle(sqlId, fileId) {
			var customizeStyle;
			$.ajax({
				url: 'dgCenter/DgGeneral.General.query.json',
				async : false,
				type: 'post',
				data: {
					menuId: window.sys_menuId,
					sqlId: sqlId,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: fileId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success: function(data){
					if(data.data && data.data[0] && (data.data[0].customizeStyle && data.data[0].customizeStyle != '') ) {
						customizeStyle = JSON.parse(data.data[0].customizeStyle);
					}
				}
			});
			return customizeStyle;
		}

		function setTbList(){
			$('#tb-list').empty();
			for(let dataList of designer.tbArr){
				$('#tb-list').append("<option value='" + dataList.tbSubjectId + "' title='" + dataList.tbSubjectName + "'>" + dataList.tbSubjectId + '-' + dataList.tbSubjectName + "</option>");
			}
		}

		function setGuideList(){
			/*currentAdjust: 0 currentAfter: 13400000 currentBefore: 13400000
			preAdjust: 0 preAfter: 13400000 preBefore: 13400000
			baseSubjectId: "T006"subjectId: "1121" subjectName: "应收票据"*/
			$('#guide-list').empty();
			for(let dataList of designer.guideArr){
				$('#guide-list').append("<option value='" + dataList.subjectId + "' title='" + dataList.subjectName + "'>" + dataList.subjectId + '-' + dataList.subjectName + "</option>");
			}
		}

		function setGuideColumnList(){
			/*<option value="0">审前金额-前序</option>
			<option value="1">调整数-前序</option>
			<option value="2">审定金额-前序</option>
			<option value="3">审前金额</option>
			<option value="4">调整数</option>
			<option value="5">审定金额</option>*/
			$('#guideColumn-list').empty();
			$('#guideColumn-list').append("<option value='0'>" + (parseInt(window.CUR_PROJECT_ACC_YEAR) - 1) + '未审数' + "</option>");
			$('#guideColumn-list').append("<option value='1'>" + (parseInt(window.CUR_PROJECT_ACC_YEAR) - 1) + '调整数' + "</option>");
			$('#guideColumn-list').append("<option value='2'>" + (parseInt(window.CUR_PROJECT_ACC_YEAR) - 1) + '审定数' + "</option>");
			$('#guideColumn-list').append("<option value='3'>" + window.window.CUR_PROJECT_ACC_YEAR + '未审数' + "</option>");
			$('#guideColumn-list').append("<option value='4'>" + window.window.CUR_PROJECT_ACC_YEAR + '调整数' + "</option>");
			$('#guideColumn-list').append("<option value='5'>" + window.window.CUR_PROJECT_ACC_YEAR + '审定数' + "</option>");
		}

		function setDgList(){
			$('#dg-list').empty();
			for(let dataList of designer.paperArr){
				$('#dg-list').append("<option value='" + dataList.autoId + ':' + dataList.indexId + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
			}
			$('#dg-sheet').empty();
			$('#dg-sheet').append('<option value=""></option>');
		}

		function setNoteList(){
			/*autoId: 486 fileName: "目录.xlsm" reportTplId: 39
			fullPath: "2017059353\形成意见\附注\目录.xlsm" knoteId: 4449
			noteDgValueInfo: null noteName: "目录" noteNo: "2019001717"*/
			$('#note-list').empty();
			for(let dataList of designer.noteArr){
				$('#note-list').append("<option value='" + dataList.autoId + ':' + dataList.noteNo + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
			}
			$('#note-sheet').empty();
			$('#note-sheet').append('<option value=""></option>');
		}

		function setStyle_0(_this){
			// radioButton 0--TB 1--导引表 2--底稿 3--附注
			var leftIndexType = _this._element.find('input[name=leftIndexType]');
			$('input[name=leftIndexType]').get(0).checked = true;
			// TB科目输入框
			var tbListText = _this._element.find('.tbListText');
			// TB科目
			var tbList = _this._element.find('.tbList');
			// 科目项
			var tbColumnList = _this._element.find('.tbColumnList');
			// 财务科目输入框
			var guideListText = _this._element.find('.guideListText');
			// 财务科目
			var guideList = _this._element.find('.guideList');
			// 科目项
			var guideColumnList = _this._element.find('.guideColumnList');
			// 底稿输入框
			var dgListText = _this._element.find('.dgListText');
			// 底稿
			var dgList = _this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = _this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = _this._element.find('.dgCellInput');
			// 附注输入框
			var noteListText = _this._element.find('.noteListText');
			// 附注
			var noteList = _this._element.find('.noteList');
			// 附注sheet
			var noteSheet = _this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = _this._element.find('.noteCellInput');
			// 打开底稿
			var openDgBtn = _this._element.find('.openDg-button');
			// 刷新底稿
			var refreshDgBtn = _this._element.find('.refreshDg-button');
			// 打开附注
			var openNoteBtn = _this._element.find('.openNote-button');
			// 刷新附注
			var refreshNoteBtn = _this._element.find('.refreshNote-button');
			
			tbListText.removeAttr('disabled');
			tbList.removeAttr('disabled');
			tbColumnList.removeAttr('disabled');
			guideListText.attr('disabled', true);
			guideList.attr('disabled', true);
			guideColumnList.attr('disabled', true);
			dgListText.attr('disabled', true);
			dgList.attr('disabled', true);
			dgSheet.attr('disabled', true);
			dgCellInput.attr('disabled', true);
			noteListText.attr('disabled', true);
			noteList.attr('disabled', true);
			noteSheet.attr('disabled', true);
			noteCellInput.attr('disabled', true);
			openDgBtn.attr('disabled', true);
			refreshDgBtn.attr('disabled', true);
			openNoteBtn.attr('disabled', true);
			refreshNoteBtn.attr('disabled', true);
			
			tbListText.val('');
			tbList.get(0).selectedIndex = 0;
			tbColumnList.get(0).selectedIndex = 0;
			guideListText.val('');
			guideList.get(0).selectedIndex = 0;
			guideColumnList.get(0).selectedIndex = 0;
			dgListText.val('');
			dgList.get(0).selectedIndex = 0;
			dgCellInput.val('');
			noteListText.val('');
			noteList.get(0).selectedIndex = 0;
			noteCellInput.val('');
		}

		function setStyle_1(_this){
			// radioButton 0--TB 1--导引表 2--底稿 3--附注
			var leftIndexType = _this._element.find('input[name=leftIndexType]');
			$('input[name=leftIndexType]').get(1).checked = true;
			// TB科目输入框
			var tbListText = _this._element.find('.tbListText');
			// TB科目
			var tbList = _this._element.find('.tbList');
			// 科目项
			var tbColumnList = _this._element.find('.tbColumnList');
			// 财务科目输入框
			var guideListText = _this._element.find('.guideListText');
			// 财务科目
			var guideList = _this._element.find('.guideList');
			// 科目项
			var guideColumnList = _this._element.find('.guideColumnList');
			// 底稿输入框
			var dgListText = _this._element.find('.dgListText');
			// 底稿
			var dgList = _this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = _this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = _this._element.find('.dgCellInput');
			// 附注输入框
			var noteListText = _this._element.find('.noteListText');
			// 附注
			var noteList = _this._element.find('.noteList');
			// 附注sheet
			var noteSheet = _this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = _this._element.find('.noteCellInput');
			// 打开底稿
			var openDgBtn = _this._element.find('.openDg-button');
			// 刷新底稿
			var refreshDgBtn = _this._element.find('.refreshDg-button');
			// 打开附注
			var openNoteBtn = _this._element.find('.openNote-button');
			// 刷新附注
			var refreshNoteBtn = _this._element.find('.refreshNote-button');
			
			tbListText.attr('disabled', true);
			tbList.attr('disabled', true);
			tbColumnList.attr('disabled', true);
			guideListText.removeAttr('disabled');
			guideList.removeAttr('disabled');
			guideColumnList.removeAttr('disabled');
			dgListText.attr('disabled', true);
			dgList.attr('disabled', true);
			dgSheet.attr('disabled', true);
			dgCellInput.attr('disabled', true);
			noteListText.attr('disabled', true);
			noteList.attr('disabled', true);
			noteSheet.attr('disabled', true);
			noteCellInput.attr('disabled', true);
			openDgBtn.attr('disabled', true);
			refreshDgBtn.attr('disabled', true);
			openNoteBtn.attr('disabled', true);
			refreshNoteBtn.attr('disabled', true);
			
			tbListText.val('');
			tbList.get(0).selectedIndex = 0;
			tbColumnList.get(0).selectedIndex = 0;
			guideListText.val('');
			guideList.get(0).selectedIndex = 0;
			guideColumnList.get(0).selectedIndex = 0;
			dgListText.val('');
			dgList.get(0).selectedIndex = 0;
			dgCellInput.val('');
			noteListText.val('');
			noteList.get(0).selectedIndex = 0;
			noteCellInput.val('');
		}

		function setStyle_2(_this){
			// radioButton 0--TB 1--导引表 2--底稿 3--附注
			var leftIndexType = _this._element.find('input[name=leftIndexType]');
			$('input[name=leftIndexType]').get(2).checked = true;
			// TB科目输入框
			var tbListText = _this._element.find('.tbListText');
			// TB科目
			var tbList = _this._element.find('.tbList');
			// 科目项
			var tbColumnList = _this._element.find('.tbColumnList');
			// 财务科目输入框
			var guideListText = _this._element.find('.guideListText');
			// 财务科目
			var guideList = _this._element.find('.guideList');
			// 科目项
			var guideColumnList = _this._element.find('.guideColumnList');
			// 底稿输入框
			var dgListText = _this._element.find('.dgListText');
			// 底稿
			var dgList = _this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = _this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = _this._element.find('.dgCellInput');
			// 附注输入框
			var noteListText = _this._element.find('.noteListText');
			// 附注
			var noteList = _this._element.find('.noteList');
			// 附注sheet
			var noteSheet = _this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = _this._element.find('.noteCellInput');
			// 打开底稿
			var openDgBtn = _this._element.find('.openDg-button');
			// 刷新底稿
			var refreshDgBtn = _this._element.find('.refreshDg-button');
			// 打开附注
			var openNoteBtn = _this._element.find('.openNote-button');
			// 刷新附注
			var refreshNoteBtn = _this._element.find('.refreshNote-button');
			
			tbListText.attr('disabled', true);
			tbList.attr('disabled', true);
			tbColumnList.attr('disabled', true);
			guideListText.attr('disabled', true);
			guideList.attr('disabled', true);
			guideColumnList.attr('disabled', true);
			dgListText.removeAttr('disabled');
			dgList.removeAttr('disabled');
			dgSheet.removeAttr('disabled');
			dgCellInput.attr('disabled', true);
			noteListText.attr('disabled', true);
			noteList.attr('disabled', true);
			noteSheet.attr('disabled', true);
			noteCellInput.attr('disabled', true);
			openDgBtn.removeAttr('disabled');
			refreshDgBtn.removeAttr('disabled');
			openNoteBtn.attr('disabled', true);
			refreshNoteBtn.attr('disabled', true);
			
			tbListText.val('');
			tbList.get(0).selectedIndex = 0;
			tbColumnList.get(0).selectedIndex = 0;
			guideListText.val('');
			guideList.get(0).selectedIndex = 0;
			guideColumnList.get(0).selectedIndex = 0;
			dgListText.val('');
			dgList.get(0).selectedIndex = 0;
			dgCellInput.val('');
			noteListText.val('');
			noteList.get(0).selectedIndex = 0;
			noteCellInput.val('');
		}

		function setStyle_3(_this){
			// radioButton 0--TB 1--导引表 2--底稿 3--附注
			var leftIndexType = _this._element.find('input[name=leftIndexType]');
			$('input[name=leftIndexType]').get(3).checked = true;
			// TB科目输入框
			var tbListText = _this._element.find('.tbListText');
			// TB科目
			var tbList = _this._element.find('.tbList');
			// 科目项
			var tbColumnList = _this._element.find('.tbColumnList');
			// 财务科目输入框
			var guideListText = _this._element.find('.guideListText');
			// 财务科目
			var guideList = _this._element.find('.guideList');
			// 科目项
			var guideColumnList = _this._element.find('.guideColumnList');
			// 底稿输入框
			var dgListText = _this._element.find('.dgListText');
			// 底稿
			var dgList = _this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = _this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = _this._element.find('.dgCellInput');
			// 附注输入框
			var noteListText = _this._element.find('.noteListText');
			// 附注
			var noteList = _this._element.find('.noteList');
			// 附注sheet
			var noteSheet = _this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = _this._element.find('.noteCellInput');
			// 打开底稿
			var openDgBtn = _this._element.find('.openDg-button');
			// 刷新底稿
			var refreshDgBtn = _this._element.find('.refreshDg-button');
			// 打开附注
			var openNoteBtn = _this._element.find('.openNote-button');
			// 刷新附注
			var refreshNoteBtn = _this._element.find('.refreshNote-button');
			
			tbListText.attr('disabled', true);
			tbList.attr('disabled', true);
			tbColumnList.attr('disabled', true);
			guideListText.attr('disabled', true);
			guideList.attr('disabled', true);
			guideColumnList.attr('disabled', true);
			dgListText.attr('disabled', true);
			dgList.attr('disabled', true);
			dgSheet.attr('disabled', true);
			dgCellInput.attr('disabled', true);
			noteListText.removeAttr('disabled');
			noteList.removeAttr('disabled');
			noteSheet.removeAttr('disabled');
			noteCellInput.attr('disabled', true);
			openDgBtn.attr('disabled', true);
			refreshDgBtn.attr('disabled', true);
			openNoteBtn.removeAttr('disabled');
			refreshNoteBtn.removeAttr('disabled');
			
			tbListText.val('');
			tbList.get(0).selectedIndex = 0;
			tbColumnList.get(0).selectedIndex = 0;
			guideListText.val('');
			guideList.get(0).selectedIndex = 0;
			guideColumnList.get(0).selectedIndex = 0;
			dgListText.val('');
			dgList.get(0).selectedIndex = 0;
			dgCellInput.val('');
			noteListText.val('');
			noteList.get(0).selectedIndex = 0;
			noteCellInput.val('');
		}

		function setMutualIndexCell(cellTagCache, self){
			if(cellTagCache.linkType == '0'){
				setStyle_0(self);
				var displayText = cellTagCache.displayText;
				var tbListText = displayText.substring(0, displayText.indexOf(':'));
				var tbColumnListText = displayText.substring(displayText.indexOf(':') + 1);
				$("#tb-list-text").val(tbListText);
				$("#tb-list option:contains('" + tbListText + "')").prop('selected', true);
				$("#tbColumn-list option:contains('" + tbColumnListText + "')").prop('selected', true);
			}else if(cellTagCache.linkType == '1'){
				setStyle_1(self);
				var displayText = cellTagCache.displayText;
				var guideListText = displayText.substring(0, displayText.indexOf(':'));
				var guideColumnListText = displayText.substring(displayText.indexOf(':') + 1);
				$("#guide-list-text").val(guideListText);
				$("#guide-list option:contains('" + guideListText + "')").prop('selected', true);
				$("#guideColumn-list option:contains('" + guideColumnListText + "')").prop('selected', true);
			}else if(cellTagCache.linkType == '2'){
				setStyle_2(self);
				// 底稿输入框
				var dgListText = self._element.find('.dgListText');
				// 底稿
				var dgList = self._element.find('.dgList');
				// 底稿sheet
				var dgSheet = self._element.find('.dgSheet');
				// 底稿单元格
				var dgCellInput = self._element.find('.dgCellInput');
				dgListText.val(cellTagCache.paperName);
				dgList.val(cellTagCache.paperId + ':' + cellTagCache.paperIndex);
				setDgSheet(dgList.val(), 'dg-sheet');
				dgSheet.val(cellTagCache.sheetIndex);
				dgCellInput.val(cellTagCache.cell);
				dgSheet.removeAttr('disabled');
				dgCellInput.removeAttr('disabled');
			}else if(cellTagCache.linkType == '3'){
				setStyle_3(self);
				// 附注输入框
				var noteListText = self._element.find('.noteListText');
				// 附注
				var noteList = self._element.find('.noteList');
				// 附注sheet
				var noteSheet = self._element.find('.noteSheet');
				// 附注单元格
				var noteCellInput = self._element.find('.noteCellInput');
				noteListText.val(cellTagCache.paperName);
				noteList.val(cellTagCache.paperId + ':' + cellTagCache.paperIndex);
				setNoteSheet(noteList.val(), 'note-sheet');
				noteSheet.val(cellTagCache.sheetIndex);
				noteCellInput.val(cellTagCache.cell);
				noteSheet.removeAttr('disabled');
				noteCellInput.removeAttr('disabled');
			}
		}

		MutualIndexDialog.prototype._init = function () {
			var _this = this;
			// radioButton 0--TB 1--导引表 2--底稿 3--附注
			var leftIndexType = _this._element.find('input[name=leftIndexType]');
			// TB科目输入框
			var tbListText = _this._element.find('.tbListText');
			// TB科目
			var tbList = _this._element.find('.tbList');
			// 科目项
			var tbColumnList = _this._element.find('.tbColumnList');
			// 财务科目输入框
			var guideListText = _this._element.find('.guideListText');
			// 财务科目
			var guideList = _this._element.find('.guideList');
			// 科目项
			var guideColumnList = _this._element.find('.guideColumnList');
			// 底稿输入框
			var dgListText = _this._element.find('.dgListText');
			// 底稿
			var dgList = _this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = _this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = _this._element.find('.dgCellInput');
			// 附注输入框
			var noteListText = _this._element.find('.noteListText');
			// 附注
			var noteList = _this._element.find('.noteList');
			// 附注sheet
			var noteSheet = _this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = _this._element.find('.noteCellInput');
			// 打开底稿
			var openDgBtn = this._element.find('.openDg-button');
			// 刷新底稿
			var refreshDgBtn = _this._element.find('.refreshDg-button');
			// 打开附注
			var openNoteBtn = _this._element.find('.openNote-button');
			// 刷新附注
			var refreshNoteBtn = _this._element.find('.refreshNote-button');
			
			leftIndexType.change(function () {
				if(this.value === '0'){
					setStyle_0(_this);
				}else if(this.value === '1'){
					setStyle_1(_this);
				}else if(this.value === '2'){
					setStyle_2(_this);
				}else if(this.value === '3'){
					setStyle_3(_this);
				}
			});
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'tb-list-text' || elem.id == 'tb-list-text')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#tb-list').css('display', 'none');
			});
			tbListText.on('focus',function(){
				$('#tb-list').css('display', 'block');
				$('#tb-list').empty();
				for(var dataList of designer.tbArr){
					var text = dataList.tbSubjectId + '-' + dataList.tbSubjectName;
					if (text.indexOf(this.value) > -1) {
						$('#tb-list').append("<option value='" + dataList.tbSubjectId + "' title='" + dataList.tbSubjectName + "'>" + dataList.tbSubjectId + '-' + dataList.tbSubjectName + "</option>");
					}
				}
			});
			tbListText.on('input',function(){
				$('#tb-list').empty();
				for(var dataList of designer.tbArr){
					var text = dataList.tbSubjectId + '-' + dataList.tbSubjectName;
					if (text.indexOf(this.value) > -1) {
						$('#tb-list').append("<option value='" + dataList.tbSubjectId + "' title='" + dataList.tbSubjectName + "'>" + dataList.tbSubjectId + '-' + dataList.tbSubjectName + "</option>");
					}
				}
			});
			tbList.change(function () {
				if(this.value != ''){
					tbListText.val($(this).find('option:selected').text());
				}else{
					tbListText.val('');
				}
			});
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'guide-list-text' || elem.id == 'guide-list-text')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#guide-list').css('display', 'none');
			});
			guideListText.on('focus',function(){
				$('#guide-list').css('display', 'block');
				$('#guide-list').empty();
				for(var dataList of designer.guideArr){
					var text = dataList.subjectId + '-' + dataList.subjectName;
					if (text.indexOf(this.value) > -1) {
						$('#guide-list').append("<option value='" + dataList.subjectId + "' title='" + dataList.subjectName + "'>" + text + "</option>");
					}
				}
			});
			guideListText.on('input',function(){
				$('#guide-list').empty();
				for(var dataList of designer.guideArr){
					var text = dataList.subjectId + '-' + dataList.subjectName;
					if (text.indexOf(this.value) > -1) {
						$('#guide-list').append("<option value='" + dataList.subjectId + "' title='" + dataList.subjectName + "'>" + dataList.subjectId + '-' + dataList.subjectName + "</option>");
					}
				}
			});
			guideList.change(function () {
				if(this.value != ''){
					guideListText.val($(this).find('option:selected').text());
				}else{
					guideListText.val('');
				}
			});
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'dg-list-text' || elem.id == 'dg-list-text')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#dg-list').css('display', 'none');
			});
			dgListText.on('focus',function(){
				$('#dg-list').css('display', 'block');
				$('#dg-list').empty();
				for(let dataList of designer.paperArr){
					if (dataList.fileName.indexOf(this.value) > -1) {
						$('#dg-list').append("<option value='" + dataList.autoId + ':' + dataList.indexId + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
					}
				}
				$('#dg-sheet').empty();
				$('#dg-sheet').append('<option value=""></option>');
			});
			dgListText.on('input',function(){
				$('#dg-list').empty();
				for(let dataList of designer.paperArr){
					if (dataList.fileName.indexOf(this.value) > -1) {
						$('#dg-list').append("<option value='" + dataList.autoId + ':' + dataList.indexId + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
					}
				}
				$('#dg-sheet').empty();
				$('#dg-sheet').append('<option value=""></option>');
			});
			dgList.change(function () {
				if(this.value != ''){
					dgListText.val($(this).find('option:selected').text());
					setDgSheet(this.value, 'dg-sheet');
					dgSheet.removeAttr('disabled');
				}else{
					dgSheet.val('');
					dgSheet.attr('disabled', true);
					dgCellInput.val('');
					dgCellInput.attr('disabled', true);
				}
			});
			dgSheet.change(function () {
				if(this.value != ''){
					dgCellInput.removeAttr('disabled');
				}else{
					dgCellInput.val('');
					dgCellInput.attr('disabled', true);
				}
			});
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'note-list-text' || elem.id == 'note-list-text')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#note-list').css('display', 'none');
			});
			noteListText.on('focus',function(){
				$('#note-list').css('display', 'block');
				$('#note-list').empty();
				for(let dataList of designer.noteArr){
					if (dataList.fileName.indexOf(this.value) > -1) {
						$('#note-list').append("<option value='" + dataList.autoId + ':' + dataList.noteNo + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
					}
				}
				$('#note-sheet').empty();
				$('#note-sheet').append('<option value=""></option>');
			});
			noteListText.on('input',function(){
				$('#note-list').empty();
				for(let dataList of designer.noteArr){
					if (dataList.fileName.indexOf(this.value) > -1) {
						$('#note-list').append("<option value='" + dataList.autoId + ':' + dataList.noteNo + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
					}
				}
				$('#note-sheet').empty();
				$('#note-sheet').append('<option value=""></option>');
			});
			noteList.change(function () {
				if(this.value != ''){
					noteListText.val($(this).find('option:selected').text());
					setNoteSheet(this.value, 'note-sheet');
					noteSheet.removeAttr('disabled');
				}else{
					noteSheet.val('');
					noteSheet.attr('disabled', true);
					noteCellInput.val('');
					noteCellInput.attr('disabled', true);
				}
			});
			noteSheet.change(function () {
				if(this.value != ''){
					noteCellInput.removeAttr('disabled');
				}else{
					noteCellInput.val('');
					noteCellInput.attr('disabled', true);
				}
			});
			openDgBtn.click(function () {
				// 底稿
				var dgList = _this._element.find('.dgList');
				if(dgList.val() !== ''){
					var dgFileId = dgList.val().substring(0, dgList.val().indexOf(':'));
					var dgFileIndexId = dgList.val().substring(dgList.val().indexOf(':') + 1);
					var dgFileName = dgList.find('option:selected').text().substring(0, dgList.find('option:selected').text().lastIndexOf('.'));
					if(designer.paperType == 'dg' && dgFileId == designer.workpaperId) return;
					openDgFile(dgFileId, dgFileIndexId, dgFileName);
				}else{
					designer.MessageBox.show('请选择底稿', '', 3);
				}
			});
			refreshDgBtn.click(function () {
				designer.paperArr = [];
				$.ajax({
					type : "post",
					url: 'dgCenter/DgGeneral.General.query.json',
					// async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00067',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					dataType : "json",
					success(data) {
						if(data.success) {
							designer.paperArr = data.data;
							setDgList();
							if(data.data[0].autoId != null && data.data[0].autoId != ''){
								dgSheet.removeAttr('disabled');
								setDgSheet(data.data[0].autoId + ':' + data.data[0].indexId, 'dg-sheet');
							}
						}
					}
				});
			});
			openNoteBtn.click(function () {
				// 附注
				var noteList = _this._element.find('.noteList');
				if(noteList.val() != null && noteList.val() !== ''){
					var dgFileId = noteList.val().substring(0, noteList.val().indexOf(':'));
					var dgFileIndexId = noteList.val().substring(noteList.val().indexOf(':') + 1);
					var dgFileName = noteList.find('option:selected').text().substring(0, noteList.find('option:selected').text().lastIndexOf('.'));
					openNoteFile(dgFileId, dgFileIndexId, dgFileName);
				}else{
					designer.MessageBox.show('请选择附注', '', 3);
				}
			});
			refreshNoteBtn.click(function () {
				designer.noteArr = [];
				$.ajax({
					url: 'dgCenter/DgGeneral.General.query.json',
					type: 'post',
					// async : false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00125',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success: function(data){
						if(data.success) {
							designer.noteArr = data.data;
							setNoteList();
							if(data.data[0].autoId != null && data.data[0].autoId != ''){
								noteSheet.removeAttr('disabled');
								setNoteSheet(data.data[0].autoId + ':' + data.data[0].noteNo, 'note-sheet');
							}
						}
					}
				});
			});
		};

		MutualIndexDialog.prototype._beforeOpen = function () {
			var self = this;
			// **********************************右交叉索引**********************************
			var sheet = designer.wrapper.spread.getActiveSheet();
			var sheetName = sheet.name();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			// 当前单元格位置
			var activeCell = self._element.find('.activeCellInput');
			if(designer.paperType == 'note'){
				activeCell.val(designer.notePaperId + ':' + sheetName + ':' + rangeStr);
				activeCell.attr('title', designer.notePaperId + ':' + sheetName + ':' + rangeStr);
			}else if(designer.paperType = 'dg'){
				activeCell.val(designer.workpaperId + ':' + sheetName + ':' + rangeStr);
				activeCell.attr('title', designer.workpaperId + ':' + sheetName + ':' + rangeStr);
			}
			var cellValue = 0;
			if(sheet.getValue(row, col) != null && sheet.getValue(row, col) != ''){
				cellValue = sheet.getValue(row, col);
			}
			activeCell.attr('data-value', cellValue);
			// **********************************右交叉索引**********************************
			// **********************************左交叉索引**********************************
			// 设置TB下拉框
			setTbList();
			// 设置导引表下拉框
			setGuideList();
			// 设置导引表科目项下拉框
			setGuideColumnList();
			// 设置底稿下拉框
			setDgList();
			// 设置附注下拉框
			setNoteList();
			// **********************************左交叉索引**********************************
			setStyle_0(self);
			var currentCell = sheet.getCell(row, col);
			// 当前单元格单元格类型
			var currentCellType = currentCell.cellType();
			var _cellType;
			if (currentCellType instanceof ShowMutualIndex) {
				_cellType = currentCellType;
			} else {
				_cellType = new designer.ShowMutualIndex();
			}
			if (_cellType._cellTagStartCache != undefined && _cellType._cellTagStartCache.length > 0) {
				var cellTagCache_0 = _cellType._cellTagStartCache[0];
				if(cellTagCache_0){
					setMutualIndexCell(cellTagCache_0, self);
					$('#leftLabel').html('左交叉索引');
					$('#rightLabel').html('右交叉索引');
					$("#rightTd").insertAfter($("#leftTd"));
					isExChange = false;
					return;
				}
				var cellTagCache_1 = _cellType._cellTagStartCache[1];
				if(cellTagCache_1){
					setMutualIndexCell(cellTagCache_1, self);
					$('#leftLabel').html('右交叉索引');
					$('#rightLabel').html('左交叉索引');
					$("#leftTd").insertAfter($("#rightTd"));
					isExChange = true;
				}
			}else{
				$('#leftLabel').html('左交叉索引');
				$('#rightLabel').html('右交叉索引');
				$("#rightTd").insertAfter($("#leftTd"));
				isExChange = false;
			}
		};
		return MutualIndexDialog;
	})(designer.BaseDialog);
	designer.MutualIndexDialog = MutualIndexDialog;

	var AuditSamplingDialog = (function (_super) {

		designer.extends(AuditSamplingDialog, _super);
		function AuditSamplingDialog() {
			_super.call(this, (dialogHtmlPath), '.audit-sampling-dialog');
		}
		
		function setSamplingAttachList(){
			$.ajax({
				url: 'finCenter/Sampling.querySamplingFile.json',
				type: 'post',
				async : false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00328',
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: designer.dgExtraOptions.userSubjectId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success: function(data){
					if(data.success) {
						$('#sampling-attach').empty();
						for(let dataList of data.data){
							$('#sampling-attach').append("<option value='" + dataList.autoId + "'>" + dataList.fileIndexId + ':' + dataList.fileName + "</option>");
						}
					}
				}
			});
		}

		// 所有单向链接item
		var thisItems = [];

		AuditSamplingDialog.prototype._initOptions = function () {
			var self = this;
			return {
				resizable: false,
				width: 'auto',
				height: 'auto',
				modal: true,
				title: designer.res.auditSamplingDialog.title,
				buttons: [
					{
						text: designer.res.ok,
						click: function () {
							// 抽凭附件下拉框
							var samplingAttachSelect = self._element.find(".samplingAttach");
							var id = samplingAttachSelect.val();
							var text = $(samplingAttachSelect).find("option:selected").text();
							var indexId = text.substring(0, text.indexOf(':'));
							var spread = designer.wrapper.spread;
							var sheet = spread.getActiveSheet();
							
							if (thisItems.length !== 0) {
								thisItems.splice(self._element.find(".items")[0].selectedIndex, 1, {
									id : id,
									text : text,
									indexId : indexId
								});
							}
							var cellTagStart = [];
							for (var i = 0; i < thisItems.length; i++) {
								if (thisItems[i].id === '') {
									thisItems.splice(i,1);
									i = i - 1;
								}
							}
							var sheetIndex = spread.getActiveSheetIndex();
							var sheetName = sheet.name();
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
							var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
							var cellValue = '';
							for (var i = 0; i < thisItems.length; i++) {
								var id = thisItems[i].id;
								var text = thisItems[i].text;
								var indexId = thisItems[i].indexId;
								cellTagStart.push({
									type: 'link',
									id: id,
									text: text,
									indexId: indexId,
									linkText: "L" + (i + 1)
								});
								cellValue = cellValue + "   " + thisItems[i].indexId;
							}
							if (cellTagStart.length === 0){
								designer.MessageBox.show('请添加单向链接或正确设置单向链接属性！', '', 1 /* error */);
							}else{
								var mapKey = sheetIndex + ":" + row + ":" + col;
								// 该底稿单元格存在单向链接时，删除再添加
								// 该底稿单元格不存在单向链接时，添加
								if (!designer.ShowAuditSamplingCacheMap.has(mapKey)) {
									designer.ShowAuditSamplingCacheMap.set(mapKey,cellTagStart);
								} else if (designer.ShowAuditSamplingCacheMap.has(mapKey)) {
									designer.ShowAuditSamplingCacheMap.delete(mapKey);
									if (cellTagStart.length !== 0) {
										designer.ShowAuditSamplingCacheMap.set(mapKey,cellTagStart);
									}
								}
								designer.wrapper.spread.suspendPaint();
								var activeCell = sheet.getCell(row, col);
								activeCell.value(cellValue);
								activeCell.cellType(new designer.ShowAuditSampling());
								activeCell.tag({
									cellTagStart: cellTagStart
								});
								// 居左
								activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
								activeCell.foreColor('blue');
								activeCell.textDecoration(GC.Spread.Sheets.TextDecorationType.underline);
								designer.wrapper.spread.resumePaint();
							}
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					},
					// 清除单元格格式
					{
						text: designer.res.auditSamplingDialog.clearBtn,
						click: function () {
							var sheet = designer.wrapper.spread.getActiveSheet();
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var sheetIndex = designer.wrapper.spread.getActiveSheetIndex();
							var mapKey = sheetIndex + ":" + row + ":" + col;
							// 该底稿单元格存在单向链接时，删除再添加
							if (designer.ShowAuditSamplingCacheMap.has(mapKey)) {
								designer.ShowAuditSamplingCacheMap.delete(mapKey);
								designer.wrapper.spread.suspendPaint();
								var activeCell = sheet.getCell(row, col);
								activeCell.value('');
								// 清除单元格格式
								activeCell.cellType(void 0);
								designer.wrapper.spread.resumePaint();
							}
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					},
					{
						text: designer.res.cancel,
						click: function () {
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					}
				]
			};
		};

		AuditSamplingDialog.prototype._init = function () {
			var _this = this;
			// 抽凭附件下拉框
			var samplingAttachSelect = this._element.find(".samplingAttach");
			var refreshSamplingAttachBtn = this._element.find(".refreshSamplingAttach-button");
			refreshSamplingAttachBtn.click(function () {
				setSamplingAttachList();
			});
			this.selectedIndex = -1;
			var items = _this._element.find(".items");
			var itemsOptions = items[0].options;
			var addBtn = this._element.find(".add-button");
			var removeBtn = this._element.find(".remove-button");
			addBtn.button();
			removeBtn.button();
			addBtn.click(function () {
				itemsOptions[itemsOptions.length] = new Option("链接" + itemsOptions.length.toString());
				if (items[0].length === 1) {
					thisItems = [];
				}
				var id = samplingAttachSelect.val();
				var text = $(samplingAttachSelect).find("option:selected").text();
				var indexId = text.substring(0, text.indexOf(':'));
				thisItems.push(
					{
						id : id,
						text : text,
						indexId : indexId
					});
				samplingAttachSelect.removeAttr('disabled');
				refreshSamplingAttachBtn.removeAttr('disabled');
				items.trigger("change", { selectMoveTo: thisItems.length - 1, action: "add" });
			});
			removeBtn.click(function () {
				itemsOptions.remove(_this.selectedIndex);
				for (var i = _this.selectedIndex; i < itemsOptions.length; i++) {
					itemsOptions[i] = new Option("链接" + i.toString());
				}
				thisItems.splice(_this.selectedIndex, 1);
				var select;
				if (thisItems.length > _this.selectedIndex) {
					select = _this.selectedIndex;
				} else if (thisItems.length > 0) {
					select = _this.selectedIndex - 1;
				} else {
					select = -1;
					samplingAttachSelect.attr('disabled', true);
					refreshSamplingAttachBtn.attr('disabled', true);
				}
				items.trigger("change", { selectMoveTo: select, action: "remove" });
			});
			items.change(function (evt, args) {
				var srcElement = evt.target || evt.srcElement;
				var ele = srcElement;
				//Add or switch selected item need save data of item.
				if ((args === undefined || args.action === "add") && (_this.selectedIndex !== -1 && _this.selectedIndex < thisItems.length)) {
					var id = samplingAttachSelect.val();
					var text = $(samplingAttachSelect).find("option:selected").text();
					var indexId = text.substring(0, text.indexOf(':'));
					thisItems[_this.selectedIndex] = {
						id : id,
						text : text,
						indexId : indexId
					};
				}
				//Load data of item.
				if (args === undefined) {
					_this.selectedIndex = parseInt(ele.value.substring(2));
				} else {
					_this.selectedIndex = args.selectMoveTo;
				}
				if (_this.selectedIndex !== -1) {
					$(itemsOptions[_this.selectedIndex]).prop("selected", true);
					samplingAttachSelect.val(thisItems[_this.selectedIndex].id);
				}
			});
		};

		AuditSamplingDialog.prototype._beforeOpen = function () {
			var self = this;
			// 设置抽凭附件下拉框
			setSamplingAttachList();
			// 抽凭附件下拉框
			var samplingAttachSelect = this._element.find(".samplingAttach");
			samplingAttachSelect.attr('disabled', true);
			var refreshSamplingAttachBtn = this._element.find(".refreshSamplingAttach-button");
			refreshSamplingAttachBtn.attr('disabled', true);
			var items = this._element.find('.items');
			var itemsOptions = items[0].options;
			items.empty();
			thisItems = [];
			// 当前行
			var row = designer.wrapper.spread.getActiveSheet().getActiveRowIndex();
			// 当前列
			var col = designer.wrapper.spread.getActiveSheet().getActiveColumnIndex();
			// 当前单元格
			var activeCell = designer.wrapper.spread.getActiveSheet().getCell(row, col);
			// 当前单元格单元格类型
			var currentCellType = activeCell.cellType();
			var _cellType;
			if (currentCellType instanceof ShowAuditSampling) {
				_cellType = currentCellType;
			} else {
				_cellType = new designer.ShowAuditSampling();
			}
			if (_cellType._cellTagStartCache != undefined && _cellType._cellTagStartCache.length > 0) {
				for (var i = 0; i < _cellType._cellTagStartCache.length; i++) {
					itemsOptions[itemsOptions.length] = new Option('链接' + itemsOptions.length.toString());
					thisItems.push({
						id: _cellType._cellTagStartCache[i].id,
						text: _cellType._cellTagStartCache[i].text,
						indexId: _cellType._cellTagStartCache[i].indexId
					});
				}
				$(itemsOptions[0]).prop('selected', true);
				samplingAttachSelect.val(_cellType._cellTagStartCache[0].id);
				this.selectedIndex = 0;
				samplingAttachSelect.removeAttr('disabled');
				refreshSamplingAttachBtn.removeAttr('disabled');
			}
		};
		return AuditSamplingDialog;
	})(designer.BaseDialog);
	designer.AuditSamplingDialog = AuditSamplingDialog;

	// 附注功能弹出框
	var NoteFeatureDialog = (function (_super) {

		designer.extends(NoteFeatureDialog, _super);
		function NoteFeatureDialog() {
			_super.call(this, (dialogHtmlPath), '.note-feature-dialog');
		}

		NoteFeatureDialog.prototype._initOptions = function () {
			var self = this;
			return {
				resizable: false,
				width: 'auto',
				//height: '420px;',
				modal: true,
				title: designer.res.noteFeatureDialog.title,
				buttons: [
					{
						text: designer.res.ok,
						click: function () {
							// 底稿输入框
							var dgFileInput = self._element.find('.dgFileInput');
							if(dgFileInput.text() === ''){
								designer.MessageBox.show('请选择底稿！', '', 3 /* error */);
								return;
							}
							// 底稿下拉框
							var dgFileSelect = self._element.find('.dgFileSelect');
							// 底稿sheet下拉框
							var dgSheetSelect = self._element.find('.dgSheetSelect');
							if(dgSheetSelect[0].selectedIndex === 0){
								designer.MessageBox.show('请选择底稿Sheet！', '', 3 /* error */);
								return;
							}
							// 底稿区域起始位置
							var dgRangeStart = self._element.find('.dgRangeStart');
							if(dgRangeStart.val() === ''){
								designer.MessageBox.show('请输入底稿起始位置！', '', 3 /* error */);
								return;
							}else{
								let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.wrapper.spread.getActiveSheet(), dgRangeStart.val(), 0, 0);
								if (range == null) {
									designer.MessageBox.show('底稿起始位置单元格引用无效！', '', 3 /* error */);
									return;
								}
							}
							// 底稿区域结束位置
							var dgRangeEnd = self._element.find('.dgRangeEnd');
							if(dgRangeEnd.val() === ''){
								designer.MessageBox.show('请输入底稿结束位置！', '', 3 /* error */);
								return;
							}else{
								let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.wrapper.spread.getActiveSheet(), dgRangeEnd.val(), 0, 0);
								if (range == null) {
									designer.MessageBox.show('底稿结束位置单元格引用无效！', '', 3 /* error */);
									return;
								}
							}
							var spread = designer.wrapper.spread;
							var sheetIndex = spread.getActiveSheetIndex();
							var sheet = spread.getActiveSheet();
							var rowIndex = sheet.getActiveRowIndex();
							var columnIndex = sheet.getActiveColumnIndex();
							var cellTagStart = [];
							cellTagStart.push({
								type: 'link',
								linkText: 'N',
								dgFileInputVal: dgFileInput.val(),
								dgFileInputText: dgFileInput.text(),
								dgFileSelectVal: dgFileSelect.val() != null ? dgFileSelect.val() : dgFileInput.text(),
								dgSheetSelectVal: dgSheetSelect.val(),
								dgFileId: dgFileInput.text().substring(0, dgFileInput.text().indexOf(':')),
								dgSheetName: dgSheetSelect[0].selectedOptions[0].text,
								dgRangeStart: dgRangeStart.val(),
								dgRangeEnd: dgRangeEnd.val()
							});
							var mapKey = sheetIndex + ':' + rowIndex + ':' + columnIndex;
							// 该附注单元格存在取值链接时，删除再添加
							// 该附注单元格不存在取值链接时，添加
							if (!designer.NoteCacheMap.has(mapKey)) {
								designer.NoteCacheMap.set(mapKey, cellTagStart);
							} else if (designer.NoteCacheMap.has(mapKey)) {
								designer.NoteCacheMap.delete(mapKey);
								designer.NoteCacheMap.set(mapKey, cellTagStart);
							}
							let objNote = {};
							let noteCacheMap = designer.NoteCacheMap;
							for (let[k,v] of noteCacheMap) {
								objNote[k] = v;
							}
							var noteDgValueInfo = JSON.stringify({
								NoteCacheMap: objNote
							});
							$.ajax({
								url : 'dgCenter/DgNote.noteDgValue.json',
								type : 'post',
								data : {
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: designer.noteExtraOptions.autoId,
									param4: noteDgValueInfo,
									param5: JSON.stringify(cellTagStart)
								},
								dataType : 'json',
								success : function(data){
									if(data.success) {
										let activeCell = sheet.getCell(rowIndex, columnIndex);
										let formatter = activeCell.formatter();
										let dataList = data.data[0].dgRangeValue;
										let rowNum = data.data[0].rowNum;
										let colNum = data.data[0].colNum;
										spread.suspendPaint();
										sheet.addRows(rowIndex + 1, rowNum - 1);
										for(let i = 1; i < rowNum; i++){
											sheet.copyTo(rowIndex, 0, rowIndex + i, 0, 1, sheet.getColumnCount(), GC.Spread.Sheets.CopyToOptions.all);
											sheet.clear(rowIndex + i, 0, 1, sheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
										}
										let k = 0;
										for(let i = 0; i < rowNum; i++){
											for(let j = 0; j < colNum; j++){
												if(parseFloat(dataList[k]).toString() == 'NaN'){
													sheet.getCell(rowIndex + i, columnIndex + j).value(dataList[k]);
												}else{
													sheet.getCell(rowIndex + i, columnIndex + j).value(parseFloat(dataList[k]));
												}
												k++;
											}
										}
										activeCell.cellType(new designer.ShowNoteDgValueInfo());
										activeCell.tag({
											cellTagStart: cellTagStart
										});
										// 居左
										activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
										spread.resumePaint();
										// $('#saveExcelBtn').click();
										self.close();
										designer.wrapper.setFocusToSpread();
									}else{
										designer.MessageBox.show(data.resultInfo.statusText, '', 3);
									}
								}
							});
						}
					},
					// 清除单元格格式
					{
						text: designer.res.noteFeatureDialog.clearBtn,
						click: function () {
							var sheet = designer.wrapper.spread.getActiveSheet();
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var sheetIndex = designer.wrapper.spread.getActiveSheetIndex();
							var mapKey = sheetIndex + ':' + row + ':' + col;
							// 该附注单元格存在底稿取值链接时，删除
							if (designer.NoteCacheMap.has(mapKey)) {
								designer.NoteCacheMap.delete(mapKey);
								designer.wrapper.spread.suspendPaint();
								var activeCell = sheet.getCell(row, col);
								// 清除单元格格式
								activeCell.cellType(void 0);
								designer.wrapper.spread.resumePaint();
							}
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					},
					{
						text: designer.res.cancel,
						click: function () {
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					}
				]
			};
		};

		NoteFeatureDialog.prototype._init = function () {
			var self = this;
			// 底稿输入框
			var dgFileInput = self._element.find('.dgFileInput');
			// 底稿下拉框
			var dgFileSelect = self._element.find('.dgFileSelect');
			// 底稿sheet下拉框
			var dgSheetSelect = self._element.find('.dgSheetSelect');
			// 底稿区域起始位置
			var dgRangeStart = self._element.find('.dgRangeStart');
			// 底稿区域结束位置
			var dgRangeEnd = self._element.find('.dgRangeEnd');
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'dg-file-input' || elem.id == 'dg-file-select')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#dg-file-select').css('display', 'none'); //点击的不是div或其子元素
			});
			dgFileInput.on('focus',function(){
				$('#dg-file-select').css('display', 'block');
				$('#dg-file-select').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到以dgFileInput.value()的内容开头的，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#dg-file-select').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			dgFileInput.on('input',function(){
				$('#dg-file-select').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到以dgFileInput.value()的内容开头的，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#dg-file-select').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			dgFileSelect.change(function () {
				dgFileInput.val(dgFileSelect[0].selectedOptions[0].text);
				dgFileInput.text(dgFileSelect[0].selectedOptions[0].value);
				$('#dg-file-select').css('display', 'none');
				if(this.value != ''){
					setDgSheet(this.value, 'dg-sheet-select');
				}else{
					dgSheetSelect.val('');
				}
				dgRangeStart.val('');
				dgRangeEnd.val('');
				dgRangeStart.attr('disabled', true);
				dgRangeEnd.attr('disabled', true);
			});
			dgSheetSelect.change(function () {
				if(this.value != ''){
					dgRangeStart.removeAttr('disabled');
					dgRangeEnd.removeAttr('disabled');
				}else{
					dgRangeStart.attr('disabled', true);
					dgRangeEnd.attr('disabled', true);
				}
			});
			var clearDgBtn = this._element.find('.clearDg-button');
			clearDgBtn.click(function () {
				dgFileInput.val('');
				dgFileInput.text('');
			});
			var openDgBtn = this._element.find('.openDg-button');
			openDgBtn.click(function () {
				if(dgFileInput.text() !== ''){
					var dgFileId = dgFileInput.text().substring(0, dgFileInput.text().indexOf(':'));
					var dgFileIndexId = dgFileInput.text().substring(dgFileInput.text().indexOf(':') + 1);
					var dgFileName = dgFileInput.val().substring(0, dgFileInput.val().lastIndexOf('.'));
					$('#dgFileTabs li', window.parent.document).removeClass('active');
					$('#dgFileTabContent div', window.parent.document).removeClass('active');
					if($('#dg_' + dgFileId, window.parent.document).length == 0){
						setExcelnode(dgFileId);
						var excelnode = designer.excelnode;
						$.sessionStorage('excelnode', JSON.stringify(excelnode));
						$('#dgFileTabs', window.parent.document).append("<li class='active'><a href='#dg_" + dgFileId + "'><h5 class='block-title'>" + dgFileName + "<i class='fa fa-remove tab-close' style='cursor:pointer;'></i></h5></a></li>");
						var $div = $('<div class="postil-content-wrap tab-pane active" id="dg_' + dgFileId + '">' 
								+ 	'<iframe id="iframe_dg_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgIframe&index=' + dgFileIndexId + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'  
								+ '</div>');
						$('#dgFileTabContent', window.parent.document).append($div);
						$('#dgFileTabs a:last', window.parent.document).tab('show');
						if($('.aside-hide', window.parent.document).length !== 0){
							$('body', window.parent.document).toggleClass('aside-hide');
							$(window).resize();
						}
					}else{
						$('[href="#dg_' + dgFileId + '"]', window.parent.document).tab('show');
						$('#dg_' + dgFileId, window.parent.document).addClass('active');
					}
				}else{
					designer.MessageBox.show('请选择底稿', '', 3);
				}
			});
			var refreshDgBtn = this._element.find('.refreshDg-button');
			refreshDgBtn.click(function () {
				designer.paperArr = [];
				$.ajax({
					type : "post",
					url: 'dgCenter/DgGeneral.General.query.json',
					// async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00067',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					dataType : "json",
					success(data) {
						if(data.success) {
							designer.paperArr = data.data;
							// 底稿输入框
							var dgFileInput = self._element.find('.dgFileInput');
							dgFileInput.text('');
							// 底稿下拉框
							var dgFileSelect = self._element.find('.dgFileSelect');
							$('#dg-file-select').empty();
							$('#dg-file-select').append("<option value=''></option>");
							for (var i = 0; i < designer.paperArr.length; i++) {
								$('#dg-file-select').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
							}
							dgFileSelect.val('');
						}
					}
				});
			});
			dgRangeStart.on('keyup',function(){
				dgRangeEnd.val(dgRangeStart.val().toUpperCase());
			});
		};

		NoteFeatureDialog.prototype._beforeOpen = function () {
			var _this = this;
			var spread = designer.wrapper.spread;
			var sheetIndex = spread.getActiveSheetIndex();
			var sheet = spread.getActiveSheet();
			var rowIndex = sheet.getActiveRowIndex();
			var columnIndex = sheet.getActiveColumnIndex();
			// 当前sheet
			var curSheet = _this._element.find('.curSheet');
			curSheet.val(spread.getActiveSheet().name());
			curSheet.attr('disabled', true);
			// 当前位置
			var curPosition = _this._element.find('.curPosition');
			var range = new GC.Spread.Sheets.Range(rowIndex, columnIndex, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			curPosition.val(rangeStr);
			curPosition.attr('disabled', true);
			// 底稿输入框
			var dgFileInput = _this._element.find('.dgFileInput');
			dgFileInput.text('');
			// 底稿下拉框
			var dgFileSelect = _this._element.find('.dgFileSelect');
			$('#dg-file-select').empty();
			$('#dg-file-select').append("<option value=''></option>");
			for (var i = 0; i < designer.paperArr.length; i++) {
				$('#dg-file-select').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
			}
			dgFileSelect.val('');
			// 底稿sheet下拉框
			var dgSheetSelect = _this._element.find('.dgSheetSelect');
			$('#dg-sheet-select').empty();
			$('#dg-sheet-select').append('<option value=""></option>');
			// 底稿区域起始位置
			var dgRangeStart = _this._element.find('.dgRangeStart');
			dgRangeStart.attr('disabled', true);
			dgRangeStart.val('');
			// 底稿区域结束位置
			var dgRangeEnd = _this._element.find('.dgRangeEnd');
			dgRangeEnd.attr('disabled', true);
			dgRangeEnd.val('');
			
			var mapKey = sheetIndex + ":" + rowIndex + ":" + columnIndex;
			if (designer.NoteCacheMap.has(mapKey)) {
				var dataMap = designer.NoteCacheMap.get(mapKey)[0];
				dgFileInput.val(dataMap.dgFileInputVal);
				dgFileInput.text(dataMap.dgFileInputText);
				dgFileSelect.val(dataMap.dgFileSelectVal);
				setDgSheet(dataMap.dgFileSelectVal, 'dg-sheet-select');
				dgSheetSelect.val(dataMap.dgSheetSelectVal);
				dgRangeStart.val(dataMap.dgRangeStart);
				dgRangeEnd.val(dataMap.dgRangeEnd);
				
				dgFileInput.removeAttr('disabled');
				dgRangeStart.removeAttr('disabled');
				dgRangeEnd.removeAttr('disabled');
			}
		};
		return NoteFeatureDialog;
	})(designer.BaseDialog);
	designer.NoteFeatureDialog = NoteFeatureDialog;
	
	// 底稿取值弹出框
	var DgFetchDialog = (function (_super) {

		designer.extends(DgFetchDialog, _super);
		function DgFetchDialog() {
			_super.call(this, (dialogHtmlPath), '.dg-fetch-dialog');
		}

		DgFetchDialog.prototype._initOptions = function () {
			var self = this;
			return {
				resizable: false,
				width: 'auto',
				//height: '420px;',
				modal: true,
				title: designer.res.dgFetchDialog.title,
				buttons: [
					{
						text: designer.res.ok,
						click: function () {
							// 底稿输入框
							var dgFileInput = self._element.find('.dgFileInput');
							if(dgFileInput.text() === ''){
								designer.MessageBox.show('请选择底稿！', '', 3 /* error */);
								return;
							}
							// 底稿下拉框
							var dgFileSelect = self._element.find('.dgFileSelect');
							// 底稿sheet下拉框
							var dgSheetSelect = self._element.find('.dgSheetSelect');
							if(dgSheetSelect[0].selectedIndex === 0){
								designer.MessageBox.show('请选择底稿Sheet！', '', 3 /* error */);
								return;
							}
							// 底稿单元格位置
							var dgRange = self._element.find('.dgRange');
							if(dgRange.val() === ''){
								designer.MessageBox.show('请输入底稿单元格位置！', '', 3 /* error */);
								return;
							}else{
								let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.wrapper.spread.getActiveSheet(), dgRange.val(), 0, 0);
								if (range == null) {
									designer.MessageBox.show('底稿单元格位置单元格引用无效！', '', 3 /* error */);
									return;
								}
							}
							var spread = designer.wrapper.spread;
							var sheetIndex = spread.getActiveSheetIndex();
							var sheet = spread.getActiveSheet();
							var rowIndex = sheet.getActiveRowIndex();
							var columnIndex = sheet.getActiveColumnIndex();
							var cellTagStart = [];
							cellTagStart.push({
								type: 'link',
								linkText: 'N',
								dgFileInputVal: dgFileInput.val(),
								dgFileInputText: dgFileInput.text(),
								dgFileSelectVal: dgFileSelect.val() != null ? dgFileSelect.val() : dgFileInput.text(),
								dgSheetSelectVal: dgSheetSelect.val(),
								dgFileId: dgFileInput.text().substring(0, dgFileInput.text().indexOf(':')),
								dgSheetName: dgSheetSelect[0].selectedOptions[0].text,
								dgRange: dgRange.val()
							});
							var mapKey = sheetIndex + ':' + rowIndex + ':' + columnIndex;
							// 该单元格存在取值链接时，删除再添加
							// 该单元格不存在取值链接时，添加
							if (!designer.DgFetchCacheMap.has(mapKey)) {
								designer.DgFetchCacheMap.set(mapKey, cellTagStart);
							} else if (designer.DgFetchCacheMap.has(mapKey)) {
								designer.DgFetchCacheMap.delete(mapKey);
								designer.DgFetchCacheMap.set(mapKey, cellTagStart);
							}
							let objDgFetch = {};
							let dgFetchCacheMap = designer.DgFetchCacheMap;
							for (let[k,v] of dgFetchCacheMap) {
								objDgFetch[k] = v;
							}
							/*var dgValueInfo = JSON.stringify({
								DgFetchCacheMap: objNote
							});*/
							$.ajax({
								url : 'dgCenter/DgWapper.fetchDgValue.json',
								type : 'post',
								data : {
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: designer.dgExtraOptions.workpaperId,
									/*param4: dgValueInfo,*/
									param5: JSON.stringify(cellTagStart)
								},
								dataType : 'json',
								success : function(data){
									if(data.success) {
										var activeCell = sheet.getCell(rowIndex, columnIndex);
										if(data.data[0] && data.data[0].cellValue){
											var dgValue = data.data[0].cellValue;
											spread.suspendPaint();
											activeCell.value(dgValue);
											activeCell.cellType(new designer.ShowDgFetch());
											activeCell.tag({
												cellTagStart: cellTagStart
											});
											// 居左
											activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
											spread.resumePaint();
										}
										self.close();
										designer.wrapper.setFocusToSpread();
									}else{
										designer.MessageBox.show(data.resultInfo.statusText, '', 3);
									}
								}
							});
						}
					},
					// 清除单元格格式
					{
						text: designer.res.dgFetchDialog.clearBtn,
						click: function () {
							var sheet = designer.wrapper.spread.getActiveSheet();
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var sheetIndex = designer.wrapper.spread.getActiveSheetIndex();
							var mapKey = sheetIndex + ':' + row + ':' + col;
							// 该单元格存在底稿取值时，删除
							if (designer.DgFetchCacheMap.has(mapKey)) {
								designer.DgFetchCacheMap.delete(mapKey);
								designer.wrapper.spread.suspendPaint();
								var activeCell = sheet.getCell(row, col);
								// 清除单元格格式
								activeCell.cellType(void 0);
								designer.wrapper.spread.resumePaint();
							}
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					},
					{
						text: designer.res.cancel,
						click: function () {
							self.close();
							designer.wrapper.setFocusToSpread();
						}
					}
				]
			};
		};

		DgFetchDialog.prototype._init = function () {
			var self = this;
			// 底稿输入框
			var dgFileInput = self._element.find('.dgFileInput');
			// 底稿下拉框
			var dgFileSelect = self._element.find('.dgFileSelect');
			// 底稿sheet下拉框
			var dgSheetSelect = self._element.find('.dgSheetSelect');
			// 底稿单元格位置
			var dgRange = self._element.find('.dgRange');
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'dg-file-input' || elem.id == 'dg-file-select')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#dg-file-select').css('display', 'none'); //点击的不是div或其子元素
			});
			dgFileInput.on('focus',function(){
				$('#dg-file-select').css('display', 'block');
				$('#dg-file-select').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到dgFileInput.value()的内容，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#dg-file-select').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			dgFileInput.on('input',function(){
				$('#dg-file-select').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到dgFileInput.value()的内容，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#dg-file-select').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			dgFileSelect.change(function () {
				dgFileInput.val(dgFileSelect[0].selectedOptions[0].text);
				dgFileInput.text(dgFileSelect[0].selectedOptions[0].value);
				$('#dg-file-select').css('display', 'none');
				if(this.value != ''){
					setDgSheet(this.value, 'dg-sheet-select');
				}else{
					dgSheetSelect.val('');
				}
				dgRange.val('');
				dgRange.attr('disabled', true);
			});
			dgSheetSelect.change(function () {
				if(this.value != ''){
					dgRange.removeAttr('disabled');
				}else{
					dgRange.attr('disabled', true);
				}
			});
			var clearDgBtn = this._element.find('.clearDg-button');
			clearDgBtn.click(function () {
				dgFileInput.val('');
				dgFileInput.text('');
			});
			var openDgBtn = this._element.find('.openDg-button');
			openDgBtn.click(function () {
				if(dgFileInput.text() !== ''){
					var dgFileId = dgFileInput.text().substring(0, dgFileInput.text().indexOf(':'));
					var dgFileIndexId = dgFileInput.text().substring(dgFileInput.text().indexOf(':') + 1);
					var dgFileName = dgFileInput.val().substring(0, dgFileInput.val().lastIndexOf('.'));
					$('#dgFileTabs li', window.parent.document).removeClass('active');
					$('#dgFileTabContent div', window.parent.document).removeClass('active');
					if($('#dg_' + dgFileId, window.parent.document).length == 0){
						setExcelnode(dgFileId);
						var excelnode = designer.excelnode;
						$.sessionStorage('excelnode', JSON.stringify(excelnode));
						$('#dgFileTabs', window.parent.document).append("<li class='active'><a href='#dg_" + dgFileId + "'><h5 class='block-title'>" + dgFileName + "<i class='fa fa-remove tab-close' style='cursor:pointer;'></i></h5></a></li>");
						var $div = $('<div class="postil-content-wrap tab-pane active" id="dg_' + dgFileId + '">' 
								+ 	'<iframe id="iframe_dg_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgIframe&index=' + dgFileIndexId + '&projectId=' + window.CUR_PROJECTID + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'  
								+ '</div>');
						$('#dgFileTabContent', window.parent.document).append($div);
						$('#dgFileTabs a:last', window.parent.document).tab('show');
						if($('.aside-hide', window.parent.document).length !== 0){
							$('body', window.parent.document).toggleClass('aside-hide');
							$(window).resize();
						}
					}else{
						$('[href="#dg_' + dgFileId + '"]', window.parent.document).tab('show');
						$('#dg_' + dgFileId, window.parent.document).addClass('active');
					}
				}else{
					designer.MessageBox.show('请选择底稿', '', 3);
				}
			});
			var refreshDgBtn = this._element.find('.refreshDg-button');
			refreshDgBtn.click(function () {
				designer.paperArr = [];
				$.ajax({
					type : "post",
					url: 'dgCenter/DgGeneral.General.query.json',
					// async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00067',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					dataType : "json",
					success(data) {
						if(data.success) {
							designer.paperArr = data.data;
							// 底稿输入框
							var dgFileInput = self._element.find('.dgFileInput');
							dgFileInput.text('');
							// 底稿下拉框
							var dgFileSelect = self._element.find('.dgFileSelect');
							$('#dg-file-select').empty();
							$('#dg-file-select').append("<option value=''></option>");
							for (var i = 0; i < designer.paperArr.length; i++) {
								$('#dg-file-select').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
							}
							dgFileSelect.val('');
						}
					}
				});
			});
		};

		DgFetchDialog.prototype._beforeOpen = function () {
			var _this = this;
			var spread = designer.wrapper.spread;
			var sheetIndex = spread.getActiveSheetIndex();
			var sheet = spread.getActiveSheet();
			var rowIndex = sheet.getActiveRowIndex();
			var columnIndex = sheet.getActiveColumnIndex();
			// 当前sheet
			var curSheet = _this._element.find('.curSheet');
			curSheet.val(spread.getActiveSheet().name());
			curSheet.attr('disabled', true);
			// 当前位置
			var curPosition = _this._element.find('.curPosition');
			var range = new GC.Spread.Sheets.Range(rowIndex, columnIndex, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			curPosition.val(rangeStr);
			curPosition.attr('disabled', true);
			// 底稿输入框
			var dgFileInput = _this._element.find('.dgFileInput');
			dgFileInput.text('');
			// 底稿下拉框
			var dgFileSelect = _this._element.find('.dgFileSelect');
			$('#dg-file-select').empty();
			$('#dg-file-select').append("<option value=''></option>");
			for(var papaerList of designer.paperArr){
				$('#dg-file-select').append("<option value='" + papaerList.autoId + ":" + papaerList.indexId + "' title='" + papaerList.fileName + "'>" + papaerList.fileName + "</option>");
			}
			dgFileSelect.val('');
			// 底稿sheet下拉框
			var dgSheetSelect = _this._element.find('.dgSheetSelect');
			$('#dg-sheet-select').empty();
			$('#dg-sheet-select').append('<option value=""></option>');
			// 底稿单元格位置
			var dgRange = _this._element.find('.dgRange');
			dgRange.attr('disabled', true);
			dgRange.val('');
			
			var mapKey = sheetIndex + ":" + rowIndex + ":" + columnIndex;
			if (designer.DgFetchCacheMap.has(mapKey)) {
				var dataMap = designer.DgFetchCacheMap.get(mapKey)[0];
				dgFileInput.val(dataMap.dgFileInputVal);
				dgFileInput.text(dataMap.dgFileInputText);
				dgFileSelect.val(dataMap.dgFileSelectVal);
				setDgSheet(dataMap.dgFileSelectVal, 'dg-sheet-select');
				dgSheetSelect.val(dataMap.dgSheetSelectVal);
				dgRange.val(dataMap.dgRange);
				
				dgFileInput.removeAttr('disabled');
				dgRange.removeAttr('disabled');
			}
		};
		return DgFetchDialog;
	})(designer.BaseDialog);
	designer.DgFetchDialog = DgFetchDialog;
	/* ZQF 自定义 END */
}
