(function () {
	'use strict';
	var Sheets = GC.Spread.Sheets;
	var designer = Sheets.Designer;
	var dialogHtmlPath = designer.util.resolveHtmlPath('../bdotools', 'mergedialogs.html');

	// 自定义单元格类型
	var ShowMergeNoteInfo = (function () {
		function ShowMergeNoteInfo() {
			this.typeName = "ShowMergeNoteInfo";
			this._cellTagStartCache = undefined;
			this._textWidth = undefined;
		}
		ShowMergeNoteInfo.prototype = new GC.Spread.Sheets.CellTypes.Text();
		ShowMergeNoteInfo.prototype.paintContent = function (ctx, value, x, y, w, h, style, context) {
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

		ShowMergeNoteInfo.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
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
		ShowMergeNoteInfo.prototype.processMouseUp = function (hitInfo) {
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

		ShowMergeNoteInfo.prototype.processMouseMove = function (hitInfo) {
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

		ShowMergeNoteInfo.prototype.processMouseLeave = function (hitInfo) {
			if (this._toolTipElement) {
				document.body.removeChild(this._toolTipElement);
				this._toolTipElement = null;
			}
		};

		ShowMergeNoteInfo.prototype.getAutoFitWidth = function (value, text, cellStyle, zoomFactor, context) {
			if (this._textWidth) {
				// cellStyle.font = "bold " + cellStyle.font;
				return 5 + this._textWidth + GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context);
			} else {
				return GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context)
			}
		};
		return ShowMergeNoteInfo;
	})();
	designer.ShowMergeNoteInfo = ShowMergeNoteInfo;

	// 打开附注
	function openMergeNoteFile(fileId, noteNo, fileName){
		if(fileId !== ''){
			if($('#mergenote_' + fileId, window.parent.document).length == 0){
				$('#dgFileTabs li', window.parent.document).removeClass('active');
				$('#dgFileTabContent div', window.parent.document).removeClass('active');
				setMergeNoteNode(fileId);
				var excelnode = designer.excelnode;
				$.sessionStorage('excelnode', JSON.stringify(excelnode));
				$('#dgFileTabs', window.parent.document).append("<li class='active'><a href='#mergenote_" + fileId + "'><h5 class='block-title'>" + fileName + "&nbsp;<i class='fa fa-remove tab-close' style='cursor:pointer;'></i></h5></a></li>");
				var $div = $('<div class="postil-content-wrap tab-pane active" id="mergenote_' + fileId + '">' 
						+ 	'<iframe id="iframe_note_' + fileId + '" src="/Faith/dgcenter.do?m=openMergeNoteInfoSecond&noteNo=' + noteNo + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'  
						+ '</div>');
				$('#dgFileTabContent', window.parent.document).append($div);
				$('#dgFileTabs a:last', window.parent.document).tab('show');
				if($('.aside-hide', window.parent.document).length !== 0){
					$('body', window.parent.document).toggleClass('aside-hide');
					$(window).resize();
				}
			}else{
				$('[href="#note_' + fileId + '"]', window.parent.document).tab('show');
				$('#note_' + fileId, window.parent.document).addClass('active');
			}
		}
	}

	// 设置附注文件节点信息
	function setMergeNoteNode(fileId) {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async: false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00310',
				param1: fileId,
				param2: designer.noteExtraOptions.customerId,
				param3: designer.noteExtraOptions.projectId,
				param4: designer.noteExtraOptions.mergeProjectId,
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

	// 设置附注sheet名下拉框 param1:下拉框已选择附注 param2:下拉框id
	function setMergeNoteSheet(param1, param2){
		if(param1 == null || param1 == '')return;
		// autoId + ':' + noteNo498:2019001729
		$.ajax({
			type : "post",
			url : 'dgCenter/HbMergeProjectNoteInfo.getMergeNoteSheetName.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				param1: designer.noteExtraOptions.customerId,
				param2: designer.noteExtraOptions.projectId,
				param3: param1.substring(0, param1.indexOf(':')),
				param4: designer.noteExtraOptions.mergeProjectId,
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					$("#" + param2).empty();
					$("#" + param2).append('<option value=""></option>');
					for(let i=0;i<data.data.length;i++){
						$("#" + param2).append('<option value="' + i + '">' + data.data[i][0] + '</option>');
					}
				}
			}
		});
	}

	designer.mergeReportArr = [];
	// 打开底稿时取得该项目下所有TB科目信息
	designer.setMergeReportArr = function () {
		$.ajax({
			url : 'dgCenter/HbMergeProjectNoteInfo.getReportData.json',
			type: 'post',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				param1: designer.noteExtraOptions.customerId,
				param2: designer.noteExtraOptions.projectId,
				param3: window.CUR_PROJECT_ACC_YEAR,
				param4: designer.noteExtraOptions.mergeProjectId,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success: function(data){
				if(data.success) {
					designer.mergeReportArr = data.data;
				}
			}
		});
	};

	designer.mergeNoteArr = [];
	// 打开底稿时取得该项目下所有附注信息
	designer.setMergeNoteArr = function () {
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
			type: 'post',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00309',
				param1: designer.noteExtraOptions.customerId,
				param2: designer.noteExtraOptions.projectId,
				param3: designer.noteExtraOptions.autoId,
				param4: designer.noteExtraOptions.mergeProjectId,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success: function(data){
				if(data.success) {
					designer.mergeNoteArr = data.data;
				}
			}
		});
	};

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
							if(designer.paperType == 'mergeNote'){
								param7 = designer.notePaperId;
								tagInfoParam = {
									type: designer.paperType,
									customerId: designer.noteExtraOptions.customerId,
									projectId: designer.noteExtraOptions.projectId,
									mergeProjectId: designer.noteExtraOptions.mergeProjectId,
									yyyy: window.CUR_PROJECT_ACC_YEAR,
									noteAutoId: designer.notePaperId,
									noteNo: designer.noteNo,
									fileName: designer.fileName,
									tagPosition: self._element.find('.cellPosition').val()
								};
							}
							var tagInfo = [];
							tagInfo.push(tagInfoParam);
							$.ajax({
								type : 'post',
								url : 'dgCenter/HbMergeFormulaCheck.setTag.json',
								// async : false,
								data : {
									menuId: window.sys_menuId,
									param1: designer.noteExtraOptions.customerId,
									param2: designer.noteExtraOptions.projectId,
									param3: self._element.find('.cellAlias').val(),
									param4: cellValue,
									param5: self._element.find('.cellPosition').val(),
									param6: JSON.stringify(tagInfo),
									param7: param7,
									param8: designer.paperType,
									param9: designer.noteExtraOptions.mergeProjectId,
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
			if(designer.paperType == 'mergeNote'){
				cellPosition.val(designer.notePaperId + ':' + sheetName + ':' + rangeStr);
			}else if(designer.paperType = 'mergeDg'){
				cellPosition.val(designer.workpaperId + ':' + sheetName + ':' + rangeStr);
			}
			cellPosition.attr('title', cellPosition.val());
			self._element.find('.cellAlias').val('');
			$.ajax({
				type : 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async : false,
				data : {
					menuId: window.sys_menuId,
					sqlId: 'DG00311',
					param1: designer.noteExtraOptions.customerId,
					param2: designer.noteExtraOptions.projectId,
					param3: designer.noteExtraOptions.mergeProjectId,
					param4: self._element.find('.cellPosition').val(),
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

	designer.MergeNoteCacheMap = new Map();
	// 现金流量表取值
	designer.setMergeNoteCacheMap = function (mapJson) {
		if (mapJson === undefined) {return;}
		// 附注底稿取值
		let strMap = new Map();
		// json转换为map
		for (let k of Object.keys(mapJson)) {
			strMap.set(k, mapJson[k]);
		}
		designer.MergeNoteCacheMap = strMap;
		var mapKeyArr = [];
		for (let cellLink of designer.MergeNoteCacheMap) {
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
				if(indexType == 3){
					var paperId = cellTagStartCache.paperId;
					var index = designer.mergeNoteArr.findIndex((item) => {return item.autoId == paperId});
					if(index == -1){
						mapKeyArr.push(cellLink[0]);
						activeCell.value('');
						continue;
					}
				}
			}
			designer.wrapper.spread.suspendPaint();
			activeCell.cellType(new designer.ShowMergeNoteInfo());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.wrapper.spread.resumePaint();
		}
		for (let mapKey of mapKeyArr) {
			designer.MergeNoteCacheMap.delete(mapKey);
		}
	};

	var MergenoteFeatureDialog = (function (_super) {

		designer.extends(MergenoteFeatureDialog, _super);
		function MergenoteFeatureDialog() {
			_super.call(this, (dialogHtmlPath), '.mergenote-feature-dialog');
		}

		function setMergeReportList(){
			$('#report-list').empty();
			for(let dataList of designer.mergeReportArr){
				$('#report-list').append("<option value='" + dataList.subjectId + "' title='" + dataList.subjectName.trim() + "'>" + dataList.subjectId + '-' + dataList.subjectName.trim() + "</option>");
			}
		}

		function setMergeNoteList(){
			$('#note-list').empty();
			for(let dataList of designer.mergeNoteArr){
				$('#note-list').append("<option value='" + dataList.autoId + ':' + dataList.noteNo + "' title='" + dataList.fileName + "' data-result='" + dataList.mergeProjectId + "'>" + dataList.fileName + "</option>");
			}
			$('#note-sheet').empty();
			$('#note-sheet').append('<option value=""></option>');
		}

		function setStyle_report(_this){
			$('input[name=indexType]').get(0).checked = true;
			// 报表科目
			var reportList = _this._element.find('.reportList');
			// 报表科目名称
			var reportDispInput = _this._element.find('.reportDispInput');
			// 附注
			var noteList = _this._element.find('.noteList');
			// 附注sheet
			var noteSheet = _this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = _this._element.find('.noteCellInput');
			// 打开附注
			var openNoteBtn = _this._element.find('.openNote-button');
			
			reportList.removeAttr('disabled');
			$("input[name='reportValueType']").removeAttr('disabled');
			noteList.attr('disabled', true);
			noteSheet.attr('disabled', true);
			noteCellInput.attr('disabled', true);
			openNoteBtn.attr('disabled', true);
			
			reportList.get(0).selectedIndex = 0;
			reportDispInput.val($(reportList).find("option:selected")[0].title);
			$("input[name='reportValueType']").get(0).checked = true;
			noteList.get(0).selectedIndex = 0;
			setMergeNoteSheet(noteList.val(), 'note-sheet');
			noteSheet.get(0).selectedIndex = 0;
			noteCellInput.val('');
		}

		function setStyle_note(_this){
			$('input[name=indexType]').get(1).checked = true;
			// 报表科目
			var reportList = _this._element.find('.reportList');
			// 报表科目名称
			var reportDispInput = _this._element.find('.reportDispInput');
			// 附注
			var noteList = _this._element.find('.noteList');
			// 附注sheet
			var noteSheet = _this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = _this._element.find('.noteCellInput');
			// 打开附注
			var openNoteBtn = _this._element.find('.openNote-button');
			
			reportList.attr('disabled', true);
			$("input[name='reportValueType']").attr('disabled', true);
			noteList.removeAttr('disabled');
			noteSheet.removeAttr('disabled');
			noteCellInput.removeAttr('disabled');
			openNoteBtn.removeAttr('disabled');
			
			reportList.get(0).selectedIndex = 0;
			reportDispInput.val($(reportList).find("option:selected")[0].title);
			$("input[name='reportValueType']").get(0).checked = true;
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

		MergenoteFeatureDialog.prototype._initOptions = function () {
			var self = this;
			return {
				resizable: false,
				width: 'auto',
				//height: '420px;',
				modal: true,
				title: designer.res.mergenoteFeatureDialog.title,
				buttons: [
					{
						text: designer.res.ok,
						click: function () {
							// radioButton 1--报表 2--底稿 3--附注
							var indexType= self._element.find("input[name=indexType]:checked").val();
							var isError = false;
							if(indexType == 3){
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
							if (!designer.MergeNoteCacheMap.has(mapKey)) {
								designer.MergeNoteCacheMap.set(mapKey, cellTagStart);
							} else if (designer.MergeNoteCacheMap.has(mapKey)) {
								designer.MergeNoteCacheMap.delete(mapKey);
								designer.MergeNoteCacheMap.set(mapKey, cellTagStart);
							}
							$.ajax({
								url : 'dgCenter/HbMergeProjectNoteInfo.initCellTagStart.json',
								type : 'post',
								data : {
									param1: designer.noteExtraOptions.customerId,
									param2: designer.noteExtraOptions.projectId,
									param3: window.CUR_PROJECT_ACC_YEAR,
									param4: designer.noteExtraOptions.mergeProjectId,
									param5: JSON.stringify(cellTagStart)
								},
								dataType : 'json',
								success : function(data){
									if(data.success) {
										let activeCell = sheet.getCell(rowIndex, columnIndex);
										spread.suspendPaint();
										activeCell.value(data.data[0].data);
										activeCell.cellType(new designer.ShowMergeNoteInfo());
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
						text: designer.res.mergenoteFeatureDialog.clearBtn,
						click: function () {
							var sheet = designer.wrapper.spread.getActiveSheet();
							var row = sheet.getActiveRowIndex();
							var col = sheet.getActiveColumnIndex();
							var sheetIndex = designer.wrapper.spread.getActiveSheetIndex();
							var mapKey = sheetIndex + ':' + row + ':' + col;
							// 该附注单元格存在底稿取值链接时，删除
							if (designer.MergeNoteCacheMap.has(mapKey)) {
								designer.MergeNoteCacheMap.delete(mapKey);
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

		MergenoteFeatureDialog.prototype._init = function () {
			var self = this;
			// 报表科目
			var reportList = this._element.find('.reportList');
			// 报表科目名称
			var reportDispInput = this._element.find('.reportDispInput');
			reportList.change(function () {
				reportDispInput.val($(this).find("option:selected")[0].title);
			});
			// 附注
			var noteList = this._element.find('.noteList');
			// 附注sheet
			var noteSheet = this._element.find('.noteSheet');
			// 附注单元格
			var noteCellInput = this._element.find('.noteCellInput');
			noteList.change(function () {
				if(this.value != ''){
					setMergeNoteSheet(this.value, 'note-sheet');
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
			// 打开附注
			var openNoteBtn = this._element.find('.openNote-button');
			openNoteBtn.click(function () {
				// 附注
				var noteList = self._element.find('.noteList');
				if(noteList.val() != null && noteList.val() !== ''){
					var fileId = noteList.val().substring(0, noteList.val().indexOf(':'));
					var noteNo = noteList.val().substring(noteList.val().indexOf(':') + 1);
					var fileName = noteList.find('option:selected').text().substring(0, noteList.find('option:selected').text().lastIndexOf('.'));
					openMergeNoteFile(fileId, noteNo, fileName);
				}else{
					designer.MessageBox.show('请选择附注', '', 3);
				}
			});
			// radioButton 1--报表 2--底稿 3--附注
			var indexType = self._element.find('input[name=indexType]');
			indexType.change(function () {
				if(this.value === '1'){
					setStyle_report(self);
				}else if(this.value === '3'){
					setStyle_note(self);
				}
			});
		};

		MergenoteFeatureDialog.prototype._beforeOpen = function () {
			// 设置报表下拉框
			setMergeReportList();
			// 设置附注下拉框
			setMergeNoteList();
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
			if (currentCellType instanceof ShowMergeNoteInfo) {
				_cellType = currentCellType;
			} else {
				_cellType = new designer.ShowMergeNoteInfo();
			}
			if (_cellType._cellTagStartCache != undefined && _cellType._cellTagStartCache.length > 0) {
				var cellTagStartCache = _cellType._cellTagStartCache[0];
				if(cellTagStartCache){
					if(cellTagStartCache.indexType == 1){
						setStyle_report(_this);
						// 报表科目
						var reportList = _this._element.find('.reportList');
						// 报表科目名称
						var reportDispInput = _this._element.find('.reportDispInput');
						reportList.val(cellTagStartCache.reportCode);
						reportDispInput.val(cellTagStartCache.reportDisp);
						$('input[name=reportValueType]').get(parseInt(cellTagStartCache.reportValueType) - 1).checked = true;
					}else if(cellTagStartCache.indexType == 3){
						setStyle_note(_this);
						// 附注
						var noteList = _this._element.find('.noteList');
						// 附注sheet
						var noteSheet = _this._element.find('.noteSheet');
						// 附注单元格
						var noteCellInput = _this._element.find('.noteCellInput');
						noteList.val(cellTagStartCache.paperId + ':' + cellTagStartCache.paperIndexId);
						setMergeNoteSheet(noteList.val(), 'note-sheet');
						noteSheet.val(cellTagStartCache.sheetIndex);
						noteCellInput.val(cellTagStartCache.rangeStr);
						noteSheet.removeAttr('disabled');
						noteCellInput.removeAttr('disabled');
					}
				}
			}else{
				setStyle_report(_this);
			}
		};
		return MergenoteFeatureDialog;
	})(designer.BaseDialog);
	designer.MergenoteFeatureDialog = MergenoteFeatureDialog;
	/* ZQF 自定义 END */
})();
