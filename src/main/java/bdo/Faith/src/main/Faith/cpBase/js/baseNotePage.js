/**
 * 初始化设置附注模板
 */
var BaseNotePage = (agrs)=>{
	var _template
		,_data
		,currentNode
		,mount
		,listener
		,setHeight
		,getHeight
		,transition // 过度效果接口
		,getExcelData // 获取excel 文件数据接口
		,saveExcelServer // 保存excel 接口
		,storage = window.localStorage // 浏览器缓存接口
		,spread // spread 实例
		,excelIo = new GC.Spread.Excel.IO() // spreadIo 实例
		,height = $('#main-container').height() - $('#pageHead').height() - 60 // 编辑区高度
		,dataURLtoFile // 文件数据类型转换接口
		,blobToDataURL // 文件数据类型转换接口
		,saveExcel // 保存 excel 文件接口
		,exportExcel // 导出 excel 文件接口
		,saveFileInStorage // 保存 excel 文件到浏览器缓存接口
		,getFileFromStorage // 从浏览器缓存中获取文件数据
		,autoId
		,storageId
		,storageStatus
		,fileName
		,fullPath
		,auditProgramList
		,designer;

	_data = _data ? _data : agrs.data;
	currentNode = _data.currentNode;
	_template = agrs.template || tplLoader('cpBase/html/baseNotePage.html');
	agrs.template = _template;
	
	autoId = _data.extraOptions.autoId;
	storageId = 'BDOBaseNote' + autoId;
	storageStatus = 'BDOBaseNote' + autoId + 'Status';
	fileName =  _data.extraOptions.fileName;
	if(height <= 0) {
		height = $('body').height() - 20;
	}
	/**
	 * begin
	 */
	var needSuspend;
	var tipWidth = 600;
	function setFieldInfo(param){
		let baseNote = $.sessionStorage('baseNote');
		let spread = designer.Spread;
		if(baseNote != '' && JSON.parse(baseNote) != ''){
			for(let data of JSON.parse(baseNote)){
				let position = data.fieldPosition;
				if(position == null || position == ''){
					continue;
				}
				let preSheetName = position.substring(0, position.indexOf(':'));
				let preSheet = spread.getSheetFromName(preSheetName);
				let preRangeStr = position.substring(position.indexOf(':') + 1);
				let preRange = GC.Spread.Sheets.CalcEngine.formulaToRange(spread.getSheetFromName(preSheetName), preRangeStr, 0, 0);
				let comment = preSheet.comments.remove(preRange.row, preRange.col);
				comment.displayMode(GC.Spread.Sheets.Comments.DisplayMode.alwaysShown);
				/*let preCell = preSheet.getCell(preRange.row, preRange.col);
				// 清除单元格格式
				preCell.cellType(void 0);
				// 居右
				preCell.hAlign(GC.Spread.Sheets.HorizontalAlign.right);*/
			}
		}
		for(let data of param){
			let position = data.fieldPosition;
			if(position == null || position == ''){continue;}
			let sheet = spread.getActiveSheet();
			let rangeStr = position.substring(position.indexOf(':') + 1);
			let range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, rangeStr, 0, 0);
			sheet.suspendPaint();
			let comment = sheet.comments.add(range.row, range.col, '报备模板字段：' + data.fieldName);
			comment.displayMode(GC.Spread.Sheets.Comments.DisplayMode.alwaysShown);
			/*let cellTagStart = [];
			cellTagStart.push({
				type: 'link',
				linkText: 'F',
				fieldName: data.fieldName,
				fieldPosition: data.fieldPosition
			});
			let activeCell = sheet.getCell(range.row, range.col);
			activeCell.cellType(new designer.ShowFieldInfo());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);*/
			sheet.resumePaint();
		}
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
		if(refreshFlg && spread) {
			spread.refresh();
		}
	}

	var _windowResizeTimer = null;

	function _doWindowResize() {
		if (_windowResizeTimer) {
			window.clearTimeout(_windowResizeTimer);
		}
		_windowResizeTimer = window.setTimeout(function () {
			updateLayout();
			_windowResizeTimer = null;
			if (needSuspend) {
				needSuspend = false;
				window.setTimeout(function () {
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
	
	var ready = function () {
		designer = initDesigner(_data);
		
		designeReadied();
		window.$bdosnap.init();
		//designer.loader.loadContent($('#spreadContainerRoot'));
		$(window).resize(_doWindowResize);
		$(window).resize();

		$("#verticalSplitter").draggable({
			axis: "y",
			containment: "#spreadContainer",
			scroll: false,
			zIndex: 100,
			stop: function (event, ui) {
				var $this = $(this), top = $this.offset().top, offset = top - $(".header").height(), $content = $(".content .fill-spread-content");

				// adjust size of related items
				var oldHeight = $("#formulaBarText").height();
				var newHeight = oldHeight + offset;
				var ORIGINAL_FORMULABARTEXT_HEIGHT = 20;
				if (newHeight < ORIGINAL_FORMULABARTEXT_HEIGHT) { // 20: original height of formulaBarText
					// reset to default
					$("#formulaBarText").css({ height: ORIGINAL_FORMULABARTEXT_HEIGHT });
					top = top + ORIGINAL_FORMULABARTEXT_HEIGHT - newHeight;
				} else {
					$("#formulaBarText").css({ height: newHeight });
				}
				$content.css({ top: top + 10 }); // 10: height of the space for verticalSplitter
				$content.parent().css({ height: $content.height() });
				$(".header").css({ height: top });
				$this.css({ top: 0 });
				designer.Spread.refresh();
			}
		});

		function disableDragDrop(dataTransfer) {
			if (dataTransfer) {
				dataTransfer.effectAllowed = "none";
				dataTransfer.dropEffect = "none";
			}
		}

		window.addEventListener("dragenter", function (e) {
			e = e || event;
			e.preventDefault();
			disableDragDrop(e.dataTransfer);
		}, false);
		window.addEventListener("dragover", function (e) {
			e = e || event;
			e.preventDefault();
			disableDragDrop(e.dataTransfer);
		}, false);
		window.addEventListener("drop", function (e) {
			e = e || event;
			e.preventDefault();
			disableDragDrop(e.dataTransfer);
		}, false);
	};
	
	/**
	 * end
	 */
	var reportTplID = currentNode.extraOptions.reportTplID;
	var kNoteId = currentNode.extraOptions.autoId;
	var noteNo = currentNode.extraOptions.noteNo;
	function initFieldInfo(){
		$.ajax({
			type : 'post',
			url : 'cpBase/General.query.json',
			data : {
				menuId: window.sys_menuId,
				sqlId : 'FA40042',
				param1: reportTplID,
				param2: kNoteId,
				param3: noteNo,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success : function(data){
				if(data.success) {
					let spread = designer.Spread;
					$.sessionStorage('baseNote', JSON.stringify(data.data));
					for (let dataList of data.data) {
						let position = dataList.fieldPosition;
						if(position == null || position == ''){
							continue;
						}
						let sheetName = position.substring(0, position.indexOf(':'));
						let sheet = spread.getSheetFromName(sheetName);
						let rangeStr = position.substring(position.indexOf(':') + 1);
						let range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, rangeStr, 0, 0);
						sheet.suspendPaint();
						let comment = sheet.comments.add(range.row, range.col, '报备模板字段：' + dataList.fieldName);
						comment.displayMode(GC.Spread.Sheets.Comments.DisplayMode.alwaysShown);
						/*var cellTagStart = [];
						cellTagStart.push({
							type: 'link',
							linkText: 'F',
							fieldName: dataList.fieldName,
							fieldPosition: dataList.fieldPosition
						});
						let activeCell = sheet.getCell(range.row, range.col);
						activeCell.cellType(new designer.ShowFieldInfo());
						activeCell.tag({
							cellTagStart: cellTagStart
						});
						// 居左
						activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);*/
						sheet.resumePaint();
					}
				}
			}
		});
	}
	//初始化附注匹配底稿单元格
	var init_match_view = {
		localParam : {
			url : 'cpBase/General.query.json',
			urlparam : (()=>{
				let param = {
					menuId : window.sys_menuId,
					sqlId : 'FA40048',
					param1: reportTplID,
					param2: noteNo,
					start : -1,
					limit : -1
				};
				return param;
			})(),
			tabNum : true
		},
		tableParam : {
			scrollX : false,
			scrollY : '360px',
			select : false,
			ordering : false,
			order : [1, 'asc'],
			serverSide : true,
			fixedThead : true,
			paging: false,
			fixedHeight : '460px',
			columnDefs : [
			{
				targets : 1,
				orderable : false,
				className : 'text-left',
				title : '附注编号',
				name : 'noteNo',
				data : 'noteNo',
				width : '30px'
			}, {
				targets : 2,
				orderable : false,
				className : 'text-left',
				title : '附注名称',
				name : 'noteName',
				data : 'noteName',
				width : '100px'
			}, {
				targets : 3,
				orderable : false,
				className : 'text-center',
				title : '附注sheet序号',
				name : 'noteSheetIndex',
				data : 'noteSheetIndex',
				width : '70px'
			}, {
				targets : 4,
				orderable : false,
				className : 'text-center',
				title : '附注单元格',
				name : 'noteRangeStr',
				data : 'noteRangeStr',
				width : '50px',
				render : function(data, type, row, meta) {
					let noteRowNum = row.noteRowNum - 1;
					let noteColNum = row.noteColNum - 1;
					let range = new GC.Spread.Sheets.Range(noteRowNum, noteColNum, 1, 1);
					let rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
					return rangeStr;
				}
			}, {
				targets : 5,
				orderable : false,
				className : 'text-center',
				title : '底稿索引',
				name : 'dgIndexId',
				data : 'dgIndexId',
				width : '80px'
			}, {
				targets : 6,
				orderable : false,
				className : 'text-center',
				title : '底稿名称',
				name : 'dgName',
				data : 'dgName',
				width : '100px'
			}, {
				targets : 7,
				orderable : false,
				className : 'text-center',
				title : '底稿sheet序号',
				name : 'dgSheetIndex',
				data : 'dgSheetIndex',
				width : '70px'
			}, {
				targets : 8,
				orderable : false,
				className : 'text-center',
				title : '底稿单元格',
				name : 'dgRangeStr',
				data : 'dgRangeStr',
				width : '50px'
			}, {
				targets : 9,
				orderable : false,
				className : 'text-center',
				title : '操作',
				width : '20px',
				render : function(data, type, row, meta) {
					var renderStr = '<button class="btn btn-xs btn-danger" type="button" name="delInitMatch" title="删除"><i class="fa fa-times"></i></button>';
					return renderStr;
				}
			}]
		}
	};
	//附注表格参数
	var field_info_view = {
		localParam : {
			url : 'cpBase/General.query.json',
			urlparam : (()=>{
				let param = {
					menuId : window.sys_menuId,
					sqlId : 'FA40042',
					param1: reportTplID,
					param2: kNoteId,
					param3: noteNo,
					start : -1,
					limit : -1
				};
				return param;
			})(),
			tabNum : true
		},
		tableParam : {
			scrollX : true,
			scrollY : '360px',
			select : false,
			ordering : false,
			order : [1, 'asc'],
			serverSide : true,
			fixedThead : true,
			paging: false,
			fixedHeight : '460px',
			columnDefs : [
			{
				targets : 1,
				className : 'text-left',
				title : '报备模板字段信息',
				name : 'fieldName',
				data : 'fieldName',
				width : '100px'
			}, {
				targets : 2,
				className : 'text-left',
				title : '报备模板字段位置',
				name : 'fieldPosition',
				data : 'fieldPosition',
				width : '100px',
				render : function(data, type, row, meta) {
					var str = data != null ? data : '';
					var renderStr = '<input class=\"form-control\" type=\"text\" name=\"field_position\" value=\"' + str + '\" readonly>';
					return renderStr;
				}
			}, {
				targets : 3,
				orderable : false,
				className : 'text-center',
				title : '处理',
				width : '60px',
				render : function(data, type, row, meta) {
					var renderStr = '<button class="btn btn-xs btn-success" type="button" name="getCellInfo" title="获取当前单元格"><i class="fa fa-location-arrow"></i></button>';
					renderStr += '&nbsp;<button class="btn btn-xs btn-danger" type="button" name="delFieldInfo" title="删除行"><i class="fa fa-times"></i></button>';
					return renderStr;
				}
			}, {
				targets : 4,
				name : 'autoId',
				data : 'autoId',
				visible : false
			}]
		}
	};
	auditProgramList = [];
	// 打开底稿时取得该项目下所有底稿信息
	var getAuditProgram = function () {
		$.ajax({
			type : "post",
			url: 'cpBase/General.query.json',
			data : {
				menuId: window.sys_menuId,
				sqlId: 'FA40049',
				start: -1,
				limit: -1
			},
			dataType : "json",
			success(data) {
				if(data.success) {
					auditProgramList = data.data;
				}
			}
		});
	}();
	var clickstatus = false;
	var lastX = 0;
	var lastY = 0;
	var lastcX = 0;
	var lastcY = 0;
	document.addEventListener('mousedown',mousedown);
	document.addEventListener('mousemove',mousemove);
	document.addEventListener('mouseup',mouseup);
	function mousedown(e){
		if(e.target.id === 'modalTitleId'){
			clickstatus = true;
			var moveObject = document.getElementById('fieldInfoDiv');
			lastX = moveObject.offsetLeft;
			lastY = moveObject.offsetTop;
			lastcX = e.clientX;
			lastcY = e.clientY;
		}
	}
	function mousemove(e){
		var moveObject = document.getElementById('fieldInfoDiv');
		if(clickstatus){
			moveObject.style.left = lastX + (e.clientX - lastcX - 10) + 'px' ;
			moveObject.style.top = lastY + (e.clientY-lastcY - 10) + 'px';
		}
	}

	function mouseup(e){
		clickstatus = false;
		lastX=0;
		lastY=0;
		lastcX=0;
		lastcY=0;
	}
	/**
	 * 事件绑定
	 */
	listener = ()=>{
		$('#saveExcelBtn').click((event) => {
			transition(()=>{
				var json = spread.toJSON();
				saveExcel(json);
			});
		});
		
		$('#saveExcelStorageBtn').click((event)=>{
			transition(()=>{
				var json = spread.toJSON();
				saveFileInStorage(json);
			});
		});
		
		$('#exportExcelBtn').click((event) => {
			transition(() => {
				exportExcel();
			});
		});
		
		$('.progress-mark').on('toggle-progress', (event1, event2) => {
			switch(event2) {
			case 'show':
				$('#contentBlock').addClass('block-opt-cus-refresh');
				break;
			case 'hide':
				$('#contentBlock').removeClass('block-opt-cus-refresh');
				break;
			}
		});
		
		$('#coverBtn').click((event)=>{
			if(!currentNode) {
				return;
			} 
			storage.removeItem(storageId);
			storage.removeItem(storageStatus);
			getExcelData({
				menuId: window.sys_menuId,
				param1: currentNode.autoId
			});
		});
		/**
		 * 报备模板字段信息
		 */
		$('#fieldInfoBtn').click((event)=>{
			$("#fieldInfoDiv").css({'display':''});
			BdoDataTable('fieldInfoTable', field_info_view);
		});
		$('button[name="closeLinkDiv"]').click((event)=>{
			$("#fieldInfoDiv").css({'display':'none'});
			
		});
		// 拖拽
		$('#modal_fieldInfo_add').draggable({
			handle: '.modal-title',
			cursor: 'move'
		});
		$('#addFieldInfoBtn').on( 'click', function () {
			$.ajax({
				url : 'cpBase/NotesManage.addFieldInfo.json',
				type : 'post',
				data : {
					param1: reportTplID,
					param2: kNoteId,
					param3: noteNo,
					param4: $('#fieldInfo_name').val(),
					param5: currentNode.extraOptions.noteName,
					param6: currentNode.extraOptions.fileName
				},
				dataType : 'json',
				success : function(data){
					if(data.success) {
						bdoSuccessBox('添加成功!', data.resultInfo.statusText);
						$('#modal_fieldInfo_add').modal('hide');
						$('#fieldInfoTable').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		$('#fieldInfoTable').on('click', 'button[name="delFieldInfo"]',  function() {
			var object = $('#fieldInfoTable').DataTable().data()[$(this).closest('tr').index()];
			$.ajax({
				type : "post",
				url : 'cpBase/NotesManage.delFieldInfo.json',
				// async : false,
				data : {
					menuId: window.sys_menuId,
					param1: object.autoId,
					start: -1,
					limit: -1
				},
				dataType : "json",
				success(data) {
					if(data.success) {
						bdoSuccessBox('删除成功!', data.resultInfo.statusText);
						$('#fieldInfoTable').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		$('#fieldInfoTable').on('click', 'button[name="getCellInfo"]',  function() {
			let rowIndex = $(this).closest('tr').index();
			let sheet = designer.Spread.getActiveSheet();
			let row = sheet.getActiveRowIndex();
			let col = sheet.getActiveColumnIndex();
			var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			$('#fieldInfoTable input[name="field_position"]')[rowIndex].value = sheet.name() + ':' + rangeStr;
		});
		$('#fieldInfoTable').on('click', 'input[name="field_position"]',  function() {
			let spread = designer.Spread;
			let position = this.value;
			let sheetName = position.substring(0, position.indexOf(':'));
			let sheet = spread.getSheetFromName(sheetName);
			let rangeStr = position.substring(position.indexOf(':') + 1);
			let range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet, rangeStr, 0, 0);
			sheet.setActiveCell(range.row, range.col);
			let verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
			// let horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
			sheet.showRow(range.row, verticalPosition);
			// sheet.showCell(range.row, range.col, verticalPosition, horizontalPosition);
		});
		$('#note_fieldInfo_update').click((event)=>{
			let length = $('input[name="field_position"]').length;
			let param = [];
			for(var i = 0; i < length; i++){
				let fieldPosition = $('input[name="field_position"]')[i].value;
				let rowIndex = parseInt($('input[name="field_position"]')[i].parentElement.parentElement.firstElementChild.innerText);
				let object = $('#fieldInfoTable').DataTable().data()[rowIndex - 1];
				let autoId = object.autoId !== null ? object.autoId : '';
				param.push({
					fieldPosition : fieldPosition,
					autoId : autoId,
					fieldName : object.fieldName
				});
			}
			$.ajax({
				type : 'post',
				url : 'cpBase/NotesManage.updateFieldInfo.json',
				// async : false,
				data : {
					menuId: window.sys_menuId,
					param1: JSON.stringify(param),
					start: -1,
					limit: -1
				},
				dataType : 'json',
				success(data) {
					if(data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#fieldInfoTable').DataTable().ajax.reload();
						setFieldInfo(param);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
			/*
				let isNotNullFieldPosition = true;
				if(fieldPosition == null || fieldPosition == ''){
					isNotNullFieldPosition = false;
					break;
				}
				if(isNotNullFieldPosition)
				bdoErrorBox('失败', '请设置所有报备模板字段位置');
			*/
		});
		/**
		 * 初始化附注匹配底稿单元格
		 */
		$('#initMatchBtn').click((event)=>{
			$('#initMatchModal').modal('show');
			
		});
		$('#initMatchModal').on('show.bs.modal', function () {
			BdoDataTable('initMatchTable', init_match_view);
		});
		$('#modal_initMatch_add').click((event)=>{
			$('#add_initMatch_modal').modal('show');
			
		});
		$('#add_initMatch_modal').on('show.bs.modal', function () {
			$('#noteName').val(currentNode.extraOptions.noteName);
			$('#noteNo').val(currentNode.extraOptions.noteNo);
			$('#noteRangeStr').val('');
			$('#dgName').val('');
			$('#indexId').val('');
			$('#dgRangeStr').val('');
		});
		$(document).bind('click', function(e) {
			var e = e || window.event; //浏览器兼容性
			var elem = e.target || e.srcElement;
			while (elem) { //循环判断至跟节点，防止点击的是div子元素
				if (elem.id && (elem.id == 'indexId_select' || elem.id == "indexId")) {
					return;
				}
				elem = elem.parentNode;
			}
			$('#indexId_select').css('display', 'none'); //点击的不是div或其子元素
		});
		$('#indexId').on('focus',function(){
			$('#indexId_select').empty();
			$("#indexId_select").css({"display":''});
			for(let list of auditProgramList){
				//若找到以输入框的内容开头的，添option
				if ((list.indexId + '-' + list.dgName).indexOf(this.value) != -1) {
					$('#indexId_select').append("<option value='" + list.indexId + "' title='" + list.dgName + "' data-name='" + list.dgName + "' data-result='" + list.autoId + "'>" + list.indexId + '-' + list.dgName + '</option>');
				}
			}
		});
		$('#indexId').on('input',function(){
			$('#indexId_select').empty();
			$('#indexId_select').css({'display':''});
			for(let list of auditProgramList){
				//若找到以输入框的内容开头的，添option
				if ((list.indexId + '-' + list.dgName).indexOf(this.value) != -1) {
					$('#indexId_select').append("<option value='" + list.indexId + "' title='" + list.dgName + "' data-name='" + list.dgName + "' data-result='" + list.autoId + "'>" + list.indexId + '-' + list.dgName + '</option>');
				}
			}
		});
		$('#indexId_select').change(function(){
			var value = $('#indexId_select').val();
			$('#indexId').val(value);
			var name = $('#indexId_select option:selected').attr('data-name');
			$('#dgName').val(name);
			var autoId = $('#indexId_select option:selected').attr('data-result');
			$('#note_auditprogramId').val(autoId);
			$('#indexId_select').css({'display':'none'});
		});
		$('#dgIndexId').on('blur',function(){
			let value = $('#dgIndexId').val();
			if(value == '' || value == '0'){
				$('#dgIndexId').val('');
				return;
			}
			$('#dgIndexId').val(('000' + value).slice(-4));
		});
		$('#addInitMatchBtn').click((event)=>{
			let flag = true;
			var pattern = /^[A-Z]{1,2}[0-9]{1,3}$/;
			if($('#noteRangeStr').val() == ''){
				$('#noteRangeStr').parent().parent().css({'border': '1px dashed red'});
				flag = false;
			}else{
				flag = pattern.test($('#noteRangeStr').val());
			}
			if($('#dgIndexId').val() == ''){
				$('#dgIndexId').parent().parent().css({'border': '1px dashed red'});
				flag = false;
			}
			if($('#dgRangeStr').val() == ''){
				$('#dgRangeStr').parent().parent().css({'border': '1px dashed red'});
				flag = false;
			}else{
				flag = pattern.test($('#dgRangeStr').val());
			}
			if($('#indexId_select').val() != $('#indexId').val()){
				$('#indexId_select').parent().parent().css({'border': '1px dashed red'});
				flag = false;
			}
			if(!flag){
				bdoErrorBox('失败', '请正确填写表单内容！');
				return;
			}
			$.ajax({
				url : 'cpBase/NotesManage.addInitMatch.json',
				type : 'post',
				data : {
					param1: $('#noteName').val(),
					param2: $('#noteNo').val(),
					param3: $('#noteSheetIndex').val(),
					param4: $('#noteRangeStr').val(),
					param5: $('#dgName').val(),
					param6: $('#indexId').val(),
					param7: $('#dgIndexId').val(),
					param8: $('#dgSheetIndex').val(),
					param9: $('#dgRangeStr').val(),
					param10: reportTplID,
					param11: $('#note_auditprogramId').val()
				},
				dataType : 'json',
				success : function(data){
					if(data.success) {
						bdoSuccessBox('添加成功!', data.resultInfo.statusText);
						$('#add_initMatch_modal').modal('hide');
						$('#initMatchTable').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		$('#initMatchTable').on('click', 'button[name="delInitMatch"]',  function() {
			var object = $('#initMatchTable').DataTable().data()[$(this).closest('tr').index()];
			$.ajax({
				url : 'cpBase/NotesManage.delInitMatch.json',
				type : 'post',
				data : {
					param1: object.autoId,
					param2: object.noteNo
				},
				dataType : 'json',
				success : function(data){
					if(data.success) {
						bdoSuccessBox('删除成功!', data.resultInfo.statusText);
						$('#initMatchTable').DataTable().ajax.reload();
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
	mount = ()=>{
		$(agrs.region).empty().append(_template);
		//setHeight();
		listener();
		transition(()=>{
			$('#customRibbon').css('display', 'none');
			$('#dgFileRibbon').css('display', 'none');
			$('#noteFileRibbon').css('display', 'none');
			getExcelData({
				menuId: window.sys_menuId,
				param1: currentNode.autoId
			});
			$('#fileFullPath').text(fullPath);
		});
		ready();
	};
	
	/**
	 * 过渡效果
	 */
	transition = callback => {
		$('.progress-mark').trigger('toggle-progress', 'show');
		var timer;
		var doIt = ()=>{
			timer && clearTimeout(timer);
			callback && callback();
			$('.progress-mark').trigger('toggle-progress', 'hide');
		};
		timer = setTimeout(doIt, 500);
	};
	/**
	 * 设置高度
	 */
	getHeight = ()=>{
		var icon = $('#fullscreenBtn').find('i');
		var fullscreenFlg = icon.hasClass('si-size-actual');
		if(fullscreenFlg) {
			return height+85
		}else {
			return height+25;
		}
	};

	/**
	 * 保存文件（server）
	 */
	saveExcelServer = (param, fileData)=>{
		var formData = new FormData();
		$.each(param, (key, val)=>{
			formData.append(key, val);
		});
		formData.append('file', fileData);
		$.ajax({
			url : 'cpBase/NotesManage.uploadFile.json',
			type : 'POST',
			data : formData,
			contentType : false,
			processData : false,
			success(data){
				if(data.success){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	};
	
	/**
	 * 转base64 成文件格式 
	 */
	dataURLtoFile = (dataString, filename)=>{
		var dl = dataString.indexOf('base64,')+'base64,'.length;
		if(dl > 'base64,'.length) {
			dataString = dataString.substring(dl);
		}
		var mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			bstr = atob(dataString), 
			n = bstr.length, 
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([ u8arr ], filename, {
			type : mime,
			name : filename
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
		if(fileData == null){
			$.ajax({
				url: 'cpBase/NotesManage.getFieldInfopaper.json',
				type: 'POST',
				data: param,
				dataType: 'json',
				success(data){
					if(data.success) {
						var excel = data.data[0].excelBase64Data;
						if(storage.length > 300){
							storage.removeItem(storage.key(1));
							storage.removeItem(storage.key(0));
						}
						var file = dataURLtoFile(excel, param.param1);
						blobToDataURL(file, data => {
							storage.setItem(storageId, data);
							storage.setItem(storageStatus, 'server');
						});
						excelIo.open(file, json => {
							var workbookObj = json;
							workbookObj = updateUsedRange(json);
							spread.fromJSON(workbookObj);
							spread.setActiveSheetIndex(1);
							for (var i = 0; i < spread.getSheetCount(); i++) {
								var sheet = spread.getSheet(i);
								if(sheet.getColumnCount() < 20){
									sheet.setColumnCount(20);
								}else{
									sheet.setColumnCount(sheet.getColumnCount() + 5);
								}
								sheet.setRowCount(sheet.getRowCount() + 5);
							}
							initFieldInfo();
							bdoSuccessBox('加载完成', data.resultInfo.statusText);
						}, e => {
							bdoErrorBox('失败', e.errorMessage);
						});
					}else {
						bdoErrorBox('失败',data.resultInfo.statusText);
					}
				}
			});
		}else {
			var file = dataURLtoFile(fileData, fileName);
			var status = storage.getItem(storageStatus);
			excelIo.open(file, json => {
				var workbookObj = json;
				workbookObj = updateUsedRange(json);
				spread.fromJSON(workbookObj);
				spread.setActiveSheetIndex(1);
				for (var i = 0; i < spread.getSheetCount(); i++) {
					var sheet = spread.getSheet(i);
					if(sheet.getColumnCount() < 20){
						sheet.setColumnCount(20);
					}else{
						sheet.setColumnCount(sheet.getColumnCount() + 5);
					}
					sheet.setRowCount(sheet.getRowCount() + 5);
				}
				initFieldInfo();
				if(status == 'local') {
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
		}
	};
	
	/**
	 * 保存文件
	 */
	saveExcel = (json) => {
		if(!currentNode) {
			return;
		} 
		
		excelIo.save(json, blob => {
			var param = {};
			param.autoId = autoId;

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
	exportExcel = ()=>{
		if(!currentNode) {
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
	saveFileInStorage = (json)=>{
		if(!currentNode) {
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
	getFileFromStorage = (storageId)=>{
		var fileString = storage.getItem(storageId);
		if(!fileString) return null;
		return fileString.replace('data:application/zip;base64,', '');
	};
	
	/**
	 * 关闭画面前事件
	 */
	beforClose = ()=>{
		if(currentNode && currentNode.type == 'FILE') {
			var icon = $('#fullscreenBtn').find('i');
			var fullscreenFlg = icon.hasClass('si-size-actual');
			if(fullscreenFlg) {
				$('#ss').height((height+40)+'px');
			}else {
				$('#ss').height((height-20)+'px');
			}
			bdoConfirmBox('提示', '是否保存当前文件？', (isConfirm) => {
				var timer = setTimeout(()=>{
					clearTimeout(timer);
					transition(()=>{
						var json_ = spread.toJSON();
						excelIo.save(json_, blob_ => {
							saveExcel(json_);
							getExcelData({
								menuId: window.sys_menuId,
								param1: currentNode.autoId
							});
							$('#fileFullPath').text(fullPath);
						}, e => {
						});
					});
				}, 0);
			}, () => {
				var timer = setTimeout(()=>{
					clearTimeout(timer);
					transition(() => {
						getExcelData({
							menuId: window.sys_menuId,
							param1: currentNode.autoId
						});
						$('#fileFullPath').text(fullPath);
					});
				}, 0);
			});
		}
	};
	mount();

};