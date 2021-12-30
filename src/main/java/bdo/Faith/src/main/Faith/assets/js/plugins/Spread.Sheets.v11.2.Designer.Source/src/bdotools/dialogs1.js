(function () {
	'use strict';
	var Sheets = GC.Spread.Sheets;
	var designer = Sheets.Designer;
	var dialogHtmlPath = designer.util.resolveHtmlPath('../bdotools', 'dialogs1.html');

	// 自定义单元格类型
	var ShowCashFlowInfo = (function () {
		function ShowCashFlowInfo() {
			this.typeName = "ShowCashFlowInfo";
			this._cellTagStartCache = undefined;
			this._textWidth = undefined;
		}
		ShowCashFlowInfo.prototype = new GC.Spread.Sheets.CellTypes.Text();
		ShowCashFlowInfo.prototype.paintContent = function (ctx, value, x, y, w, h, style, context) {
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
					var indexType = node.indexType;
					if(indexType == 1){
						this._cellTagStartCache[i] = {
							startX: x + startTextWidth,
							textWidth: textWidth + 3,
							indexType : node.indexType,
							reportCode: node.reportCode,
							reportDisp: node.reportDisp,
							reportValueType: node.reportValueType
						};
					}else{
						this._cellTagStartCache[i] = {
							startX: x + startTextWidth,
							textWidth: textWidth + 3,
							indexType: indexType,
							paperId: node.paperId,
							paperIndexId: node.paperIndexId,
							paperName: node.paperName,
							sheetIndex: node.sheetIndex,
							sheetName: node.sheetName,
							rangeStr: node.rangeStr
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

		ShowCashFlowInfo.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
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
		ShowCashFlowInfo.prototype.processMouseUp = function (hitInfo) {
			var sheet = hitInfo.sheet, self = this;
			if (sheet && hitInfo.isReservedLocation && hitInfo.reservedLocation >= 0) {
				setTimeout(function () {
					if (self._toolTipElement) {
						document.body.removeChild(self._toolTipElement);
						self._toolTipElement = null;
					}
					if (designer && designer.dialog) {
						if (designer.dialog.CashflowFeatureDialog === undefined) {
							designer.dialog.CashflowFeatureDialog = new designer.CashflowFeatureDialog();
						}
						designer.dialog.CashflowFeatureDialog.open();
					}
				}, 10);
				return true;
			}
			return false;
		};

		ShowCashFlowInfo.prototype.processMouseMove = function (hitInfo) {
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
				var indexType = this._cellTagStartCache[hitInfo.reservedLocation].indexType;
				if(indexType == 1){
					var reportCode = this._cellTagStartCache[hitInfo.reservedLocation].reportCode;
					var reportDisp = this._cellTagStartCache[hitInfo.reservedLocation].reportDisp;
					var toolTipElementText = '报表 -- ' + reportCode + ' -- ' + reportDisp;
					var reportValueType = this._cellTagStartCache[hitInfo.reservedLocation].reportValueType;
					if(reportValueType == 1){
						toolTipElementText = toolTipElementText + ' -- ' + '本年审定数';
					}else{
						toolTipElementText = toolTipElementText + ' -- ' + '上年审定数';
					}
					$(this._toolTipElement).text(toolTipElementText).css("top", hitInfo.y + 190).css("left", hitInfo.x + 15);
				}else{
					var paperName = this._cellTagStartCache[hitInfo.reservedLocation].paperName;
					var sheetName = this._cellTagStartCache[hitInfo.reservedLocation].sheetName;
					var rangeStr = this._cellTagStartCache[hitInfo.reservedLocation].rangeStr;
					var toolTipElementText = paperName + ' -- ' + sheetName + ' -- ' + rangeStr;
					if(indexType == 2){
						toolTipElementText = '底稿 -- ' + toolTipElementText;
					}else{
						toolTipElementText = '附注 -- ' + toolTipElementText;
					}
					$(this._toolTipElement).text(toolTipElementText).css("top", hitInfo.y + 190).css("left", hitInfo.x + 15);
				}
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show("fast");
				return true;
			}
			return false;
		};

		ShowCashFlowInfo.prototype.processMouseLeave = function (hitInfo) {
			if (this._toolTipElement) {
				document.body.removeChild(this._toolTipElement);
				this._toolTipElement = null;
			}
		};

		ShowCashFlowInfo.prototype.getAutoFitWidth = function (value, text, cellStyle, zoomFactor, context) {
			if (this._textWidth) {
				// cellStyle.font = "bold " + cellStyle.font;
				return 5 + this._textWidth + GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context);
			} else {
				return GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context)
			}
		};
		return ShowCashFlowInfo;
	})();
	designer.ShowCashFlowInfo = ShowCashFlowInfo;

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
		}
	}

	// 设置底稿文件节点信息
	function setExcelnode(workpaperId){
		$.ajax({
			type : "post",
			url: 'dgCenter/DgGeneral.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00078',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: workpaperId,
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
			url : 'dgCenter/DgGeneral.query.json',
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
	function setDgSheet(param1, param2){
		if(param1 == null || param1 == '')return;
		$.ajax({
			type : "post",
			url : 'dgCenter/DgMain.getPaperSheetName.json',
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

	// 设置附注sheet名下拉框 param1:下拉框已选择附注 param2:下拉框id
	function setNoteSheet(param1, param2){
		if(param1 == null || param1 == '')return;
		// autoId + ':' + noteNo498:2019001729
		$.ajax({
			type : "post",
			url : 'dgCenter/DgWapper.getNoteSheetName.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				// param3:附注文件autoId
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

	designer.reportArr = [];
	// 打开底稿时取得该项目下所有TB科目信息
	var setReportArr = function () {
		$.ajax({
			url : 'dgCenter/DgAuditFile.getReportData.json',
			type: 'post',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: window.CUR_PROJECT_ACC_YEAR,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success: function(data){
				if(data.success) {
					designer.reportArr = data.data;
				}
			}
		});
	}();

	designer.paperArr = [];
	// 打开底稿时取得该项目下所有底稿信息
	var setPaperArr = function () {
		$.ajax({
			type : "post",
			url: 'dgCenter/DgGeneral.query.json',
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

	designer.noteArr = [];
	// 打开底稿时取得该项目下所有附注信息
	var setNoteArr = function () {
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
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

	// 跳转到指定单元格
	designer.setCellLink = function () {
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

	designer.CashFlowCacheMap = new Map();
	// 现金流量表取值
	designer.setCashFlowCacheMap = function (mapJson) {
		if (mapJson === undefined) {return;}
		// 附注底稿取值
		let strMap = new Map();
		// json转换为map
		for (let k of Object.keys(mapJson)) {
			strMap.set(k, mapJson[k]);
		}
		designer.CashFlowCacheMap = strMap;
		var mapKeyArr = [];
		for (let cellLink of designer.CashFlowCacheMap) {
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(":")));
			designer.wrapper.spread.setActiveSheetIndex(sheetIndex);
			var sheet = designer.wrapper.spread.getActiveSheet();
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(":") + 1,cellLink[0].lastIndexOf(":")));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(":") + 1));
			var activeCell = sheet.getCell(row, col);
			var cellTagStart = cellLink[1];
			if(cellTagStart.length > 0){
				var cellTagStartCache = cellTagStart[0];
				var indexType = cellTagStartCache.indexType;
				if(indexType == 2){
					var paperId = cellTagStartCache.paperId;
					var index = designer.paperArr.findIndex((item) => {return item.autoId == paperId});
					if(index == -1){
						mapKeyArr.push(cellLink[0]);
						activeCell.value('');
						continue;
					}
				}else if(indexType == 3){
					var paperId = cellTagStartCache.paperId;
					var index = designer.noteArr.findIndex((item) => {return item.autoId == paperId});
					if(index == -1){
						mapKeyArr.push(cellLink[0]);
						activeCell.value('');
						continue;
					}
				}
			}
			designer.wrapper.spread.suspendPaint();
			activeCell.cellType(new designer.ShowCashFlowInfo());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.wrapper.spread.resumePaint();
		}
		for (let mapKey of mapKeyArr) {
			designer.CashFlowCacheMap.delete(mapKey);
		}
	};

	/* ZQF 自定义 START */
	// 附注功能弹出框
	var CashflowFeatureDialog = (function (_super) {

		designer.extends(CashflowFeatureDialog, _super);
		function CashflowFeatureDialog() {
			_super.call(this, (dialogHtmlPath), '.cashflow-feature-dialog');
		}

		function setReportList(){
			$('#report-list').empty();
			for(let dataList of designer.reportArr){
				if(dataList.tableDiv != 4){
					$('#report-list').append("<option value='" + dataList.colCode + "' title='" + dataList.colDisp.trim() + "'>" + dataList.colCode + '-' + dataList.colDisp.trim() + "</option>");
				}
			}
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
			$('#note-list').empty();
			for(let dataList of designer.noteArr){
				$('#note-list').append("<option value='" + dataList.autoId + ':' + dataList.noteNo + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
			}
			$('#note-sheet').empty();
			$('#note-sheet').append('<option value=""></option>');
		}

		function setStyle_1(_this){
			$('input[name=indexType]').get(0).checked = true;
			// 报表科目
			var reportList = _this._element.find('.reportList');
			// 报表科目名称
			var reportDispInput = _this._element.find('.reportDispInput');
			// 底稿
			var dgList = _this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = _this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = _this._element.find('.dgCellInput');
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
			
			reportList.removeAttr('disabled');
			$("input[name='reportValueType']").removeAttr('disabled');
			dgList.attr('disabled', true);
			dgSheet.attr('disabled', true);
			dgCellInput.attr('disabled', true);
			noteList.attr('disabled', true);
			noteSheet.attr('disabled', true);
			noteCellInput.attr('disabled', true);
			openDgBtn.attr('disabled', true);
			refreshDgBtn.attr('disabled', true);
			openNoteBtn.attr('disabled', true);
			refreshNoteBtn.attr('disabled', true);
			
			reportList.get(0).selectedIndex = 0;
			reportDispInput.val($(reportList).find("option:selected")[0].title);
			$("input[name='reportValueType']").get(0).checked = true;
			dgList.get(0).selectedIndex = 0;
			setDgSheet(dgList.val(), 'dg-sheet');
			dgSheet.get(0).selectedIndex = 0;
			dgCellInput.val('');
			noteList.get(0).selectedIndex = 0;
			setNoteSheet(noteList.val(), 'note-sheet');
			noteSheet.get(0).selectedIndex = 0;
			noteCellInput.val('');
		}

		function setStyle_2(_this){
			$('input[name=indexType]').get(1).checked = true;
			// 报表科目
			var reportList = _this._element.find('.reportList');
			// 报表科目名称
			var reportDispInput = _this._element.find('.reportDispInput');
			// 底稿
			var dgList = _this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = _this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = _this._element.find('.dgCellInput');
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
			
			reportList.attr('disabled', true);
			$("input[name='reportValueType']").attr('disabled', true);
			dgList.removeAttr('disabled');
			dgSheet.removeAttr('disabled');
			dgCellInput.removeAttr('disabled');
			openDgBtn.removeAttr('disabled');
			refreshDgBtn.removeAttr('disabled');
			noteList.attr('disabled', true);
			noteSheet.attr('disabled', true);
			noteCellInput.attr('disabled', true);
			openNoteBtn.attr('disabled', true);
			refreshNoteBtn.attr('disabled', true);
			
			reportList.get(0).selectedIndex = 0;
			reportDispInput.val($(reportList).find("option:selected")[0].title);
			$("input[name='reportValueType']").get(0).checked = true;
			noteList.get(0).selectedIndex = 0;
			setNoteSheet(noteList.val(), 'note-sheet');
			noteSheet.get(0).selectedIndex = 0;
			noteCellInput.val('');
		}

		function setStyle_3(_this){
			$('input[name=indexType]').get(2).checked = true;
			// 报表科目
			var reportList = _this._element.find('.reportList');
			// 报表科目名称
			var reportDispInput = _this._element.find('.reportDispInput');
			// 底稿
			var dgList = _this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = _this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = _this._element.find('.dgCellInput');
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
			
			reportList.attr('disabled', true);
			$("input[name='reportValueType']").attr('disabled', true);
			dgList.attr('disabled', true);
			dgSheet.attr('disabled', true);
			dgCellInput.attr('disabled', true);
			openDgBtn.attr('disabled', true);
			refreshDgBtn.attr('disabled', true);
			noteList.removeAttr('disabled');
			noteSheet.removeAttr('disabled');
			noteCellInput.removeAttr('disabled');
			openNoteBtn.removeAttr('disabled');
			refreshNoteBtn.removeAttr('disabled');
			
			reportList.get(0).selectedIndex = 0;
			reportDispInput.val($(reportList).find("option:selected")[0].title);
			$("input[name='reportValueType']").get(0).checked = true;
			dgList.get(0).selectedIndex = 0;
			setDgSheet(dgList.val(), 'dg-sheet');
			dgSheet.get(0).selectedIndex = 0;
			dgCellInput.val('');
		}

		function setCellTagStart(self){
			// radioButton 1--报表 2--底稿 3--附注
			var indexType= self._element.find("input[name=indexType]:checked").val();
			var cellTagStart = [];
			if(indexType == 1){
				// 报表科目
				var reportCode = self._element.find('.reportList').val();
				// 报表科目名称
				var reportDisp = self._element.find('.reportDispInput').val();
				// 报表本期或上期审定数
				var reportValueType = self._element.find("input[name=reportValueType]:checked").val();
				cellTagStart.push({
					type: 'link',
					linkText: 'N',
					indexType: indexType,
					reportCode: reportCode,
					reportDisp: reportDisp,
					reportValueType: reportValueType
				});
			}else if(indexType == 2){
				// 底稿
				var dgList = self._element.find('.dgList');
				// 底稿sheet
				var dgSheet = self._element.find('.dgSheet');
				// 底稿单元格
				var dgCellInput = self._element.find('.dgCellInput');
				var paperId = dgList.val().substring(0, dgList.val().indexOf(':'));
				var paperIndexId = dgList.val().substring(dgList.val().indexOf(':') + 1);
				var paperName = dgList.find('option:selected').text();
				var sheetIndex = dgSheet.val();
				var sheetName = dgSheet.find('option:selected').text();
				var rangeStr = dgCellInput.val();
				cellTagStart.push({
					type: 'link',
					linkText: 'N',
					indexType: indexType,
					paperId: paperId,
					paperIndexId: paperIndexId,
					paperName: paperName,
					sheetIndex: sheetIndex,
					sheetName: sheetName,
					rangeStr: rangeStr
				});
			}else if(indexType == 3){
				// 底稿
				var noteList = self._element.find('.noteList');
				// 底稿sheet
				var noteSheet = self._element.find('.noteSheet');
				// 底稿单元格
				var noteCellInput = self._element.find('.noteCellInput');
				var paperId = noteList.val().substring(0, noteList.val().indexOf(':'));
				var paperIndexId = noteList.val().substring(noteList.val().indexOf(':') + 1);
				var paperName = noteList.find('option:selected').text();
				var sheetIndex = noteSheet.val();
				var sheetName = noteSheet.find('option:selected').text();
				var rangeStr = noteCellInput.val();
				cellTagStart.push({
					type: 'link',
					linkText: 'N',
					indexType: indexType,
					paperId: paperId,
					paperIndexId: paperIndexId,
					paperName: paperName,
					sheetIndex: sheetIndex,
					sheetName: sheetName,
					rangeStr: rangeStr
				});
			}
			return cellTagStart;
		}
	
		CashflowFeatureDialog.prototype._initOptions = function () {
			var self = this;
			return {
				resizable: false,
				width: 'auto',
				//height: '420px;',
				modal: true,
				title: designer.res.cashflowFeatureDialog.title,
				buttons: [
					{
						text: designer.res.ok,
						click: function () {
							// radioButton 1--报表 2--底稿 3--附注
							var indexType= self._element.find("input[name=indexType]:checked").val();
							var isError = false;
							if(indexType == 2){
								// 底稿sheet
								var dgSheet = self._element.find('.dgSheet');
								// 底稿单元格
								var dgCellInput = self._element.find('.dgCellInput');
								if(dgSheet.val() == '' || dgCellInput.val() == ''){
									isError = true;
								}
							}else if(indexType == 3){
								// 附注sheet
								var noteSheet = self._element.find('.noteSheet');
								// 附注单元格
								var noteCellInput = self._element.find('.noteCellInput');
								if(noteSheet.val() == '' || noteCellInput.val() == ''){
									isError = true;
								}
							}
							if(isError){
								designer.MessageBox.show('选项不能为空！', '', 3 /* error */);
								self.close();
								designer.wrapper.setFocusToSpread();
								return;
							}
							var cellTagStart = setCellTagStart(self);
							var spread = designer.wrapper.spread;
							var sheetIndex = spread.getActiveSheetIndex();
							var sheet = spread.getActiveSheet();
							var rowIndex = sheet.getActiveRowIndex();
							var columnIndex = sheet.getActiveColumnIndex();
							var mapKey = sheetIndex + ':' + rowIndex + ':' + columnIndex;
							// 该现金流量表单元格存在取值链接时，删除再添加
							// 该现金流量表单元格不存在取值链接时，添加
							if (!designer.CashFlowCacheMap.has(mapKey)) {
								designer.CashFlowCacheMap.set(mapKey, cellTagStart);
							} else if (designer.CashFlowCacheMap.has(mapKey)) {
								designer.CashFlowCacheMap.delete(mapKey);
								designer.CashFlowCacheMap.set(mapKey, cellTagStart);
							}
							/*let objCashFlow = {};
							let cashFlowCacheMap = designer.CashFlowCacheMap;
							for (let[k,v] of cashFlowCacheMap) {
								objCashFlow[k] = v;
							}
							var cashFlowInfo = JSON.stringify({
								CashFlowCacheMap: objCashFlow
							});*/
							$.ajax({
								url : 'dgCenter/DgAuditFile.initCellTagStart.json',
								type : 'post',
								data : {
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: window.CUR_PROJECT_ACC_YEAR,
									// param4: designer.qyxjExtraOptions.workpaperId,
									// param5: cashFlowInfo,
									param4: JSON.stringify(cellTagStart)
								},
								dataType : 'json',
								success : function(data){
									if(data.success) {
										let activeCell = sheet.getCell(rowIndex, columnIndex);
										spread.suspendPaint();
										activeCell.value(data.data[0].data);
										activeCell.cellType(new designer.ShowCashFlowInfo());
										activeCell.tag({
											cellTagStart: cellTagStart
										});
										// 居左
										activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
										spread.resumePaint();
										self.close();
										designer.wrapper.setFocusToSpread();
										designer.MessageBox.show('设置成功！', '', 1);
									}else{
										designer.MessageBox.show(data.resultInfo.statusText, '', 3);
									}
								}
							});
						}
					},
					// 清除单元格格式
					{
						text: designer.res.cashflowFeatureDialog.clearBtn,
						click: function () {
							var sheet = designer.wrapper.spread.getActiveSheet();
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var sheetIndex = designer.wrapper.spread.getActiveSheetIndex();
							var mapKey = sheetIndex + ':' + row + ':' + col;
							// 该附注单元格存在底稿取值链接时，删除
							if (designer.CashFlowCacheMap.has(mapKey)) {
								designer.CashFlowCacheMap.delete(mapKey);
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

		CashflowFeatureDialog.prototype._init = function () {
			var self = this;
			// 报表科目
			var reportList = this._element.find('.reportList');
			// 报表科目名称
			var reportDispInput = this._element.find('.reportDispInput');
			reportList.change(function () {
				reportDispInput.val($(this).find("option:selected")[0].title);
			});
			// 底稿
			var dgList = this._element.find('.dgList');
			// 底稿sheet
			var dgSheet = this._element.find('.dgSheet');
			// 底稿单元格
			var dgCellInput = this._element.find('.dgCellInput');
			dgList.change(function () {
				if(this.value != ''){
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
			// 附注
			var noteList = this._element.find('.noteList');
			// 附注sheet
			var noteSheet = this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = this._element.find('.noteCellInput');
			noteList.change(function () {
				if(this.value != ''){
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
			// 打开底稿
			var openDgBtn = this._element.find('.openDg-button');
			// 打开附注
			var openNoteBtn = this._element.find('.openNote-button');
			openDgBtn.click(function () {
				// 底稿
				var dgList = self._element.find('.dgList');
				if(dgList.val() !== ''){
					var dgFileId = dgList.val().substring(0, dgList.val().indexOf(':'));
					var dgFileIndexId = dgList.val().substring(dgList.val().indexOf(':') + 1);
					var dgFileName = dgList.find('option:selected').text().substring(0, dgList.find('option:selected').text().lastIndexOf('.'));
					openDgFile(dgFileId, dgFileIndexId, dgFileName);
				}else{
					designer.MessageBox.show('请选择底稿', '', 3);
				}
			});
			openNoteBtn.click(function () {
				// 附注
				var noteList = self._element.find('.noteList');
				if(noteList.val() != null && noteList.val() !== ''){
					var dgFileId = noteList.val().substring(0, noteList.val().indexOf(':'));
					var dgFileIndexId = noteList.val().substring(noteList.val().indexOf(':') + 1);
					var dgFileName = noteList.find('option:selected').text().substring(0, noteList.find('option:selected').text().lastIndexOf('.'));
					openNoteFile(dgFileId, dgFileIndexId, dgFileName);
				}else{
					designer.MessageBox.show('请选择附注', '', 3);
				}
			});
			// radioButton 1--报表 2--底稿 3--附注
			var indexType = self._element.find('input[name=indexType]');
			indexType.change(function () {
				if(this.value === '1'){
					setStyle_1(self);
				}else if(this.value === '2'){
					setStyle_2(self);
				}else if(this.value === '3'){
					setStyle_3(self);
				}
			});
			// 刷新底稿
			var refreshDgBtn = this._element.find('.refreshDg-button');
			// 刷新附注
			var refreshNoteBtn = this._element.find('.refreshNote-button');
			refreshDgBtn.click(function () {
				designer.paperArr = [];
				$.ajax({
					type : "post",
					url: 'dgCenter/DgGeneral.query.json',
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
							// 设置底稿下拉框
							setDgList();
							if(data.data[0].autoId != null && data.data[0].autoId != ''){
								dgSheet.removeAttr('disabled');
								setDgSheet(data.data[0].autoId + ':' + data.data[0].indexId, 'dg-sheet');
							}
						}
					}
				});
			});
			refreshNoteBtn.click(function () {
				designer.noteArr = [];
				$.ajax({
					url: 'dgCenter/DgGeneral.query.json',
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
							// 设置附注下拉框
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

		CashflowFeatureDialog.prototype._beforeOpen = function () {
			// 设置报表下拉框
			setReportList();
			// 设置底稿下拉框
			setDgList();
			// 设置附注下拉框
			setNoteList();
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
			var currentCell = sheet.getCell(rowIndex, columnIndex);
			// 当前单元格单元格类型
			var currentCellType = currentCell.cellType();
			var _cellType;
			if (currentCellType instanceof ShowCashFlowInfo) {
				_cellType = currentCellType;
			} else {
				_cellType = new designer.ShowCashFlowInfo();
			}
			if (_cellType._cellTagStartCache != undefined && _cellType._cellTagStartCache.length > 0) {
				var cellTagStartCache = _cellType._cellTagStartCache[0];
				if(cellTagStartCache){
					if(cellTagStartCache.indexType == 1){
						setStyle_1(_this);
						// 报表科目
						var reportList = _this._element.find('.reportList');
						// 报表科目名称
						var reportDispInput = _this._element.find('.reportDispInput');
						reportList.val(cellTagStartCache.reportCode);
						reportDispInput.val(cellTagStartCache.reportDisp);
						$('input[name=reportValueType]').get(parseInt(cellTagStartCache.reportValueType) - 1).checked = true;
					}else if(cellTagStartCache.indexType == 2){
						setStyle_2(_this);
						// 底稿
						var dgList = _this._element.find('.dgList');
						// 底稿sheet
						var dgSheet = _this._element.find('.dgSheet');
						// 底稿单元格
						var dgCellInput = _this._element.find('.dgCellInput');
						dgList.val(cellTagStartCache.paperId + ':' + cellTagStartCache.paperIndexId);
						setDgSheet(dgList.val(), 'dg-sheet');
						dgSheet.val(cellTagStartCache.sheetIndex);
						dgCellInput.val(cellTagStartCache.rangeStr);
						dgSheet.removeAttr('disabled');
						dgCellInput.removeAttr('disabled');
					}else if(cellTagStartCache.indexType == 3){
						setStyle_3(_this);
						// 附注
						var noteList = _this._element.find('.noteList');
						// 附注sheet
						var noteSheet = _this._element.find('.noteSheet');
						// 附注单元格
						var noteCellInput = _this._element.find('.noteCellInput');
						noteList.val(cellTagStartCache.paperId + ':' + cellTagStartCache.paperIndexId);
						setNoteSheet(noteList.val(), 'note-sheet');
						noteSheet.val(cellTagStartCache.sheetIndex);
						noteCellInput.val(cellTagStartCache.rangeStr);
						noteSheet.removeAttr('disabled');
						noteCellInput.removeAttr('disabled');
					}
				}
			}else{
				setStyle_1(_this);
			}
		};
		return CashflowFeatureDialog;
	})(designer.BaseDialog);
	designer.CashflowFeatureDialog = CashflowFeatureDialog;
	/* ZQF 自定义 END */
})();
