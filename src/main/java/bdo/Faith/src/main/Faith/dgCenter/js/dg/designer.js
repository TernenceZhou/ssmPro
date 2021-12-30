var DgDesignerPage = function(agrs) {
	var _template
		, _data
		, mount
		, listener;
	
	_data = _data ? _data : agrs.data;
	_template = agrs.template || tplLoader('dgCenter/html/dg/designer.html');
	agrs.template = _template;
	
	listener = function() {
//-----------------------------------------自定义标签 START-----------------------------------------//
		// 自定义标签--显示
		$('#modal_customTag').on('show.bs.modal', function() {
			var _this = this;
			var sheetName = designer.Spread.getActiveSheet().name();
			var row = designer.Spread.getActiveSheet().getActiveRowIndex();
			if (isNaN(row)){
				bdoInfoBox('失败', '未选择单元格！');
				$('#modal_customTag').modal('hide');
				return;
			}
			var col = designer.Spread.getActiveSheet().getActiveColumnIndex();
			var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			// 单元格位置
			var cellPosition = $(_this).find('.cellPosition');
			if(designer.paperType == 'note'){
				cellPosition.val(designer.notePaperId + ':' + sheetName + ':' + rangeStr);
			}else if(designer.paperType = 'dg'){
				cellPosition.val(designer.workpaperId + ':' + sheetName + ':' + rangeStr);
			}
			cellPosition.attr('title', cellPosition.val());
			$(_this).find('.cellAlias').val('');
			$.ajax({
				type : 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async : false,
				data : {
					menuId: window.sys_menuId,
					sqlId: 'DG00082',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: $(_this).find('.cellPosition').val(),
					start: -1,
					limit: -1
				},
				dataType : 'json',
				success(data) {
					if(data.success && data.data.length !== 0) {
						// 标签名
						$(_this).find('.cellAlias').val(data.data[0].tagName);
					}
				}
			});
		});
		// 自定义标签--确定
		$('#btn_customTag_ensure').on('click', function() {
			var sheet = designer.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var cellValue = '';
			if(sheet.getValue(row,col) != null) {
				cellValue = sheet.getValue(row,col);
			}
			if(cellValue == null || cellValue == ''){
				cellValue = 0;
			}
			var customAlias = $('#modal_customTag').find('.cellAlias').val();
			if(customAlias.indexOf('+') != -1 
					|| customAlias.indexOf('-') != -1
					|| customAlias.indexOf('=') != -1){
				$('#modal_customTag').find('.cellAlias').focus();
				bdoInfoBox('提示', '标签名不能含有+、-、=');
				return;
			}
			if(customAlias == ''){
				$('#modal_customTag').find('.cellAlias').focus();
				bdoInfoBox('提示', '标签名不能为空');
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
					tagPosition: $('#modal_customTag').find('.cellPosition').val()
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
					tagPosition: $('#modal_customTag').find('.cellPosition').val()
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
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: $('#modal_customTag').find('.cellAlias').val(),
					param4: cellValue,
					param5: $('#modal_customTag').find('.cellPosition').val(),
					param6: JSON.stringify(tagInfo),
					param7: param7,
					param8: designer.paperType,
					start: -1,
					limit: -1
				},
				dataType : 'json',
				success(data) {
					if(data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#modal_customTag').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
//-----------------------------------------自定义标签 END-----------------------------------------//

//-----------------------------------------单向链接 START-----------------------------------------//
		// 所有单向链接item
		var singleLinkItems = [];
		// 单向链接--显示
		$('#modal_singleLink').on('show.bs.modal', function() {
			var selectedIndex = -1;
			var _this = this;
			var items = $(_this).find('.items');
			var itemsOptions = items[0].options;
			// radioButton
			var radio = $(_this).find('input[name=linktype]');
			// 要显示的文字
			var displayText = $(_this).find('.displayText');
			// 底稿input框
			var paperTextCell = $(_this).find('.paperTextCell');
			// 底稿下拉框
			var paperListCell = $(_this).find('.paperListCell');
			// 工作表
			var sheetText = $(_this).find('.sheetText');
			// 单元格
			var text = $(_this).find('.text');
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'paper-text-cell' || elem.id == 'paper-list-cell')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#paper-list-cell').css('display', 'none'); //点击的不是div或其子元素
			});
			var clearPaperBtn = $(_this).find('.clearPaper-button');
			clearPaperBtn.unbind('click');
			clearPaperBtn.click(function () {
				paperTextCell.val('');
				paperTextCell.text('');
			});
			var refershPaperBtn = $(_this).find('.refershPaper-button');
			refershPaperBtn.unbind('click');
			refershPaperBtn.click(function () {
				paperTextCell.val('');
				paperTextCell.text('');
				designer.paperArr = [];
				$.ajax({
					type : 'post',
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
					dataType : 'json',
					success(data) {
						if(data.success) {
							designer.paperArr = data.data;
						}
					}
				});
			});
			var openDgBtn = $(_this).find('.openDgBtn-button');
			openDgBtn.unbind('click');
			openDgBtn.click(function () {
				if(paperListCell.val() != null && paperListCell.val() != ''){
					if(paperListCell.find('option:selected').text() == paperTextCell.val()){
						var dgFileName = paperListCell.find('option:selected').text().substring(0, paperListCell.find('option:selected').text().lastIndexOf('.'));
						var dgFileId = paperListCell.val().substring(0, paperListCell.val().indexOf(':'));
						var dgFileIndexId = paperListCell.val().substring(paperListCell.val().indexOf(':') + 1);
						if(designer.paperType == 'dg' && dgFileId == designer.workpaperId) return;
						openDgFile(dgFileId, dgFileIndexId, dgFileName);
					}else{
						bdoInfoBox('失败', '请选择底稿');
					}
				}else{
					bdoInfoBox('失败', '请选择底稿');
				}
			});
			paperTextCell.unbind('focus');
			paperTextCell.on('focus',function(){
				$('#paper-list-cell').css('display', 'block');
				$('#paper-list-cell').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到paperTextLeft.value()的内容，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#paper-list-cell').append("<option value='" + designer.paperArr[i].autoId + ':' + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			paperTextCell.unbind('input');
			paperTextCell.on('input',function(){
				$('#paper-list-cell').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到paperTextLeft.value()的内容，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#paper-list-cell').append("<option value='" + designer.paperArr[i].autoId + ':' + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			paperListCell.unbind('change');
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
			var paperInput = $(_this).find('.paperInput');
			paperInput.val('');
			// 底稿
			var paperText = $(_this).find('.paperText');
			// 附件
			var attachmentText = $(_this).find('.attachmentText');
			// 外部链接显示文字
			var urlText = $(_this).find('.externalDisplayText');
			// 外部链接URL
			var url = $(_this).find('.externalURL');
			// 添加链接
			var addBtn = $(_this).find('.add-button');
			// 删除链接
			var removeBtn = $(_this).find('.remove-button');
			addBtn.button();
			removeBtn.button();
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'paper_list' || elem.id == 'paper-text')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#paper_list').css('display', 'none'); //点击的不是div或其子元素
			});
			var clearDgBtn = $(_this).find('.clearDg-button');
			clearDgBtn.unbind('click');
			clearDgBtn.click(function () {
				paperInput.val('');
				paperInput.text('');
			});
			var refreshDgBtn = $(_this).find('.refreshDg-button');
			refreshDgBtn.unbind('click');
			refreshDgBtn.click(function () {
				paperInput.val('');
				paperInput.text('');
				designer.paperArr = [];
				$.ajax({
					type : 'post',
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
					dataType : 'json',
					success(data) {
						if(data.success) {
							designer.paperArr = data.data;
						}
					}
				});
				designer.attachmentArr = [];
				$.ajax({
					type : 'post',
					url: 'dgCenter/DgGeneral.query.json',
					// async : false,
					data : {
						menuId: window.sys_menuId,
						sqlId: 'DG00069',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					dataType : 'json',
					success(data) {
						if(data.success) {
							designer.attachmentArr = data.data;
						}
					}
				});
			});
			addBtn.unbind('click');
			addBtn.click(function () {
				itemsOptions[itemsOptions.length] = new Option('链接' + itemsOptions.length.toString());
				if (items[0].length === 1) {
					singleLinkItems = [];
				}
				singleLinkItems.push(
					{
						radio: '0',
						text: '',
						sheetText: '',
						sheetName: '',
						paperListCell: designer.paperSelectedId,
						paperTextCell: '',
						displayText: '',
						paperText: designer.paperSelectedId,
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
				items.trigger('change', { selectMoveTo: singleLinkItems.length - 1, action: 'add' });
			});
			removeBtn.unbind('click');
			removeBtn.click(function () {
				itemsOptions.remove(selectedIndex);
				for (var i = selectedIndex; i < itemsOptions.length; i++) {
					itemsOptions[i] = new Option('链接' + i.toString());
				}
				singleLinkItems.splice(selectedIndex, 1);
				var select;
				if (singleLinkItems.length > selectedIndex) {
					select = selectedIndex;
				} else if (singleLinkItems.length > 0) {
					select = selectedIndex - 1;
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
					paperText.val(designer.paperSelectedId);
					attachmentText.val('');
					attachmentText.attr('disabled', true);
					clearPaperBtn.attr('disabled', true);
					refershPaperBtn.attr('disabled', true);
					openDgBtn.attr('disabled', true);
					clearDgBtn.attr('disabled', true);
					refreshDgBtn.attr('disabled', true);
					urlText.val('');
					urlText.attr('disabled', true);
					url.val('');
					url.attr('disabled', true);
				}
				items.trigger('change', { selectMoveTo: select, action: 'remove' });
			});
			items.unbind('change');
			items.change(function (evt, args) {
				var srcElement = evt.target || evt.srcElement;
				var ele = srcElement;
				//Add or switch selected item need save data of item.
				if ((args === undefined || args.action === 'add') && (selectedIndex !== -1 && selectedIndex < singleLinkItems.length)) {
					var attachmentTextVal = '', fileName = '';
					if(paperText.val() != ''){
						if (attachmentText.val() != '') {
							$.each(attachmentText[0].selectedOptions, function(i, item){
								if(item.text != ''){
									fileName = fileName + ',' + item.text;
									attachmentTextVal = attachmentTextVal + ',' + item.value;
								}
							}); 
						}else{
							fileName = paperText.val();
						}
					}
					if(fileName != '' && fileName.startsWith(',')){
						fileName = fileName.substring(1);
					}
					if(attachmentTextVal != '' && attachmentTextVal.startsWith(',')){
						attachmentTextVal = attachmentTextVal.substring(1);
					}
					singleLinkItems[selectedIndex] = {
						radio: $(_this).find("input[name='linktype']:checked").val(),
						text: text.val(),
						sheetText: sheetText.val(),
						sheetName: sheetText.val() != null ? sheetText[0].selectedOptions[0].text : '',
						paperListCell: paperListCell.val(),
						paperTextCell: paperTextCell.val(),
						displayText: displayText.val(),
						paperText: paperText.val(),
						attachmentText: attachmentTextVal,
						fileName: fileName,
						paperInput: paperInput.val(),
						paperName: paperInput.val(),
						urlText: urlText.val(),
						url: url.val()
					};
				}
				//Load data of item.
				if (args === undefined) {
					selectedIndex = parseInt(ele.value.substring(2));
				} else {
					selectedIndex = args.selectMoveTo;
				}
				if (selectedIndex !== -1) {
					$('#attachment_list').empty();
					$('#attachment_list').append('<option value=""></option>');
					$(itemsOptions[selectedIndex]).prop('selected', true);
					$(_this).find("input[name='linktype'][value='"+ singleLinkItems[selectedIndex].radio +"']").prop('checked', true);
					text.val(singleLinkItems[selectedIndex].text);
					sheetText.val(singleLinkItems[selectedIndex].sheetText);
					paperListCell.val(singleLinkItems[selectedIndex].paperListCell);
					paperTextCell.val(singleLinkItems[selectedIndex].paperTextCell);
					displayText.val(singleLinkItems[selectedIndex].displayText);
					paperText.val(singleLinkItems[selectedIndex].paperText);
					paperInput.val(singleLinkItems[selectedIndex].paperInput);
					if(singleLinkItems[selectedIndex].attachmentText && singleLinkItems[selectedIndex].attachmentText != ''){
						for(var attachment of singleLinkItems[selectedIndex].attachmentText.split(',')){
							$("#attachment_list option[value='" + attachment + "']").attr("selected", true);
						}
					}
					urlText.val(singleLinkItems[selectedIndex].urlText);
					url.val(singleLinkItems[selectedIndex].url);
					if (singleLinkItems[selectedIndex].radio === '0') {
						displayText.removeAttr('disabled');
						paperTextCell.removeAttr('disabled');
						sheetText.removeAttr('disabled');
						text.removeAttr('disabled');
						clearPaperBtn.removeAttr('disabled');
						refershPaperBtn.removeAttr('disabled');
						openDgBtn.removeAttr('disabled');
						paperInput.attr('disabled', true);
						attachmentText.attr('disabled', true);
						clearDgBtn.attr('disabled', true);
						refreshDgBtn.attr('disabled', true);
						urlText.val('');
						urlText.attr('disabled', true);
						url.val('');
						url.attr('disabled', true);
						if(paperTextCell.val() != ''){
							setDgSheet(paperListCell.val(), 'sheet_list');
							sheetText.val(singleLinkItems[selectedIndex].sheetText);
						}
						urlText.attr('disabled', true);
						url.attr('disabled', true);
					} else if (singleLinkItems[selectedIndex].radio === '1') {
						displayText.attr('disabled', true);
						paperTextCell.attr('disabled', true);
						sheetText.attr('disabled', true);
						text.attr('disabled', true);
						clearPaperBtn.attr('disabled', true);
						refershPaperBtn.attr('disabled', true);
						openDgBtn.attr('disabled', true);
						paperInput.removeAttr('disabled');
						attachmentText.removeAttr('disabled');
						clearDgBtn.removeAttr('disabled');
						refreshDgBtn.removeAttr('disabled');
						urlText.val('');
						urlText.attr('disabled', true);
						url.val('');
						url.attr('disabled', true);
						for (var i = 0; i < designer.attachmentArr.length; i++) {
							if (designer.attachmentArr[i].workpaperId == singleLinkItems[selectedIndex].paperText.substring(0, singleLinkItems[selectedIndex].paperText.indexOf(':'))){
								$('#attachment_list').append("<option value='" + designer.attachmentArr[i].autoId + ':' + designer.attachmentArr[i].fileIndexId + "' title='" + designer.attachmentArr[i].fileName + "'>" + designer.attachmentArr[i].fileName + "</option>");
							}
						}
						if(singleLinkItems[selectedIndex].attachmentText && singleLinkItems[selectedIndex].attachmentText != ''){
							for(var attachment of singleLinkItems[selectedIndex].attachmentText.split(',')){
								$("#attachment_list option[value='" + attachment + "']").attr("selected", true);
							}
						}
						urlText.attr('disabled', true);
						url.attr('disabled', true);
					} else if (singleLinkItems[selectedIndex].radio === '2') {
						displayText.attr('disabled', true);
						paperTextCell.attr('disabled', true);
						sheetText.attr('disabled', true);
						text.attr('disabled', true);
						clearPaperBtn.attr('disabled', true);
						refershPaperBtn.attr('disabled', true);
						openDgBtn.attr('disabled', true);
						paperInput.attr('disabled', true);
						attachmentText.attr('disabled', true);
						clearDgBtn.attr('disabled', true);
						refreshDgBtn.attr('disabled', true);
						if(paperTextCell.val() != ''){
							setDgSheet(designer.paperSelectedId, 'sheet_list');
							sheetText.val(singleLinkItems[selectedIndex].sheetText);
						}
						urlText.removeAttr('disabled');
						url.removeAttr('disabled');
					}
				}
			});
			radio.unbind('change');
			radio.change(function () {
				if (this.value === '0') {
					displayText.removeAttr('disabled');
					paperTextCell.removeAttr('disabled');
					paperTextCell.val('');
					paperListCell.val(designer.paperSelectedId);
					sheetText.val('');
					sheetText.removeAttr('disabled');
					text.removeAttr('disabled');
					paperInput.val('');
					paperInput.attr('disabled', true);
					paperText.val(designer.paperSelectedId);
					attachmentText.val('');
					attachmentText.attr('disabled', true);
					setDgSheet(designer.paperSelectedId, 'sheet_list');
					clearPaperBtn.removeAttr('disabled');
					refershPaperBtn.removeAttr('disabled');
					openDgBtn.removeAttr('disabled');
					clearDgBtn.attr('disabled', true);
					refreshDgBtn.attr('disabled', true);
					urlText.attr('disabled', true);
					url.attr('disabled', true);
				} else if (this.value === '1') {
					displayText.val('');
					displayText.attr('disabled', true);
					paperTextCell.val('');
					paperTextCell.attr('disabled', true);
					paperListCell.val(designer.paperSelectedId);
					sheetText.val('');
					sheetText.attr('disabled', true);
					text.val('');
					text.attr('disabled', true);
					paperInput.removeAttr('disabled');
					attachmentText.attr('disabled', true);
					attachmentText.removeAttr('disabled');
					attachmentText.val('');
					if (paperText.val() != null && paperText.val() != '') {
						for (var i = 0; i < designer.attachmentArr.length; i++) {
							if (designer.attachmentArr[i].workpaperId == paperText.val().substring(0, paperText.val().indexOf(':'))){
								$('#attachment_list').append("<option value='" + designer.attachmentArr[i].autoId + ':' + designer.attachmentArr[i].fileIndexId + "' title='" + designer.attachmentArr[i].fileName + "'>" + designer.attachmentArr[i].fileName + "</option>");
							}
						}
					}
					clearPaperBtn.attr('disabled', true);
					refershPaperBtn.attr('disabled', true);
					openDgBtn.attr('disabled', true);
					clearDgBtn.removeAttr('disabled');
					refreshDgBtn.removeAttr('disabled');
					urlText.attr('disabled', true);
					url.attr('disabled', true);
				} else if (this.value === '2') {
					displayText.val('');
					displayText.attr('disabled', true);
					paperTextCell.val('');
					paperTextCell.attr('disabled', true);
					paperListCell.val(designer.paperSelectedId);
					sheetText.val('');
					sheetText.attr('disabled', true);
					text.val('');
					text.attr('disabled', true);
					clearPaperBtn.attr('disabled', true);
					refershPaperBtn.attr('disabled', true);
					openDgBtn.attr('disabled', true);
					paperInput.val('');
					paperInput.attr('disabled', true);
					paperText.val(designer.paperSelectedId);
					attachmentText.val('');
					attachmentText.attr('disabled', true);
					clearDgBtn.attr('disabled', true);
					refreshDgBtn.attr('disabled', true);
					urlText.removeAttr('disabled');
					url.removeAttr('disabled');
				}
			});
			paperInput.unbind('focus');
			paperInput.on('focus',function(){
				$('#paper_list').css('display', 'block');
				$('#paper_list').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到paperInput.value()的内容，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#paper_list').append("<option value='" + designer.paperArr[i].autoId + ':' + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			paperInput.unbind('input');
			paperInput.on('input',function(){
				$('#paper_list').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到paperInput.value()的内容，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#paper_list').append("<option value='" + designer.paperArr[i].autoId + ':' + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			paperText.unbind('change');
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
						if (designer.attachmentArr[i].workpaperId == paper.substring(0, paper.indexOf(':'))){
							$('#attachment_list').append("<option value='" + designer.attachmentArr[i].autoId + ':' + designer.attachmentArr[i].fileIndexId + "' title='" + designer.attachmentArr[i].fileName + "'>" + designer.attachmentArr[i].fileName + "</option>");
						}
					}
				} else {
					attachmentText.val('');
					attachmentText.attr('disabled', true);
				}
			});
			// 展示
			$('#paper-list-cell').empty();
			for (var i = 0; i < designer.paperArr.length; i++) {
				$('#paper-list-cell').append("<option value='" + designer.paperArr[i].autoId + ':' + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
			}
			$('#sheet_list').empty();
			$('#sheet_list').append('<option value=""></option>');
			// 底稿
			$('#paper_list').empty();
			for (var i = 0; i < designer.paperArr.length; i++) {
				$('#paper_list').append("<option value='" + designer.paperArr[i].autoId + ':' + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
			}
			$('#attachment_list').empty();
			$('#attachment_list').append('<option value=""></option>');
			// 当前行
			var row = designer.Spread.getActiveSheet().getActiveRowIndex();
			// 当前列
			var col = designer.Spread.getActiveSheet().getActiveColumnIndex();
			// 当前单元格
			var activeCell = designer.Spread.getActiveSheet().getCell(row, col);
			// 当前单元格单元格类型
			var currentCellType = activeCell.cellType();
			var _cellType;
			if (currentCellType && currentCellType.typeName == 'ShowSingleLink') {
				_cellType = currentCellType;
			} else {
				_cellType = new designer.ShowSingleLink();
			}
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
			urlText.attr('disabled', true);
			url.attr('disabled', true);
			singleLinkItems = [];
			if (_cellType._cellTagStartCache != undefined && _cellType._cellTagStartCache.length > 0) {
				for (var i = 0; i < _cellType._cellTagStartCache.length; i++) {
					itemsOptions[itemsOptions.length] = new Option('链接' + itemsOptions.length.toString());
					var isFile = _cellType._cellTagStartCache[i].isFile;
					if (isFile == true) {
						singleLinkItems.push({
							radio: '1',
							text: '',
							sheetText: designer.Spread.getActiveSheetIndex(),
							displayText: '',
							paperText: _cellType._cellTagStartCache[i].paperLink,
							attachmentText: _cellType._cellTagStartCache[i].attachmentLink,
							fileName: _cellType._cellTagStartCache[i].fileName,
							paperInput: _cellType._cellTagStartCache[i].paperName,
							paperName: _cellType._cellTagStartCache[i].paperName
						});
					} else if (isFile == false) {
						singleLinkItems.push({
							radio: '0',
							text: _cellType._cellTagStartCache[i].formula.substring(_cellType._cellTagStartCache[i].formula.indexOf(':') + 1),
							sheetText: _cellType._cellTagStartCache[i].formula.substring(0, _cellType._cellTagStartCache[i].formula.indexOf(':')),
							sheetName: _cellType._cellTagStartCache[i].sheetName,
							paperListCell: _cellType._cellTagStartCache[i].paperListCell,
							paperTextCell: _cellType._cellTagStartCache[i].paperTextCell,
							displayText: _cellType._cellTagStartCache[i].displayText,
							paperText: designer.paperSelectedId,
							attachmentText: '',
							fileName: '',
							paperInput: designer.fileName,
							paperName: designer.fileName
						});
					} else {
						singleLinkItems.push({
							radio: '2',
							urlText: _cellType._cellTagStartCache[i].urlText,
							url: _cellType._cellTagStartCache[i].url,
							urlType: _cellType._cellTagStartCache[i].urlType
						});
					}
				}
				$(itemsOptions[0]).prop('selected', true);
				radio.removeAttr('disabled');
				var isFile = _cellType._cellTagStartCache[0].isFile;
				if (isFile == true) {
					$(_this).find("input[name='linktype'][value='1']").prop('checked', true);
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
						if (designer.attachmentArr[i].workpaperId == paperLink.substring(0, paperLink.indexOf(':'))){
							$('#attachment_list').append("<option value='" + designer.attachmentArr[i].autoId + ':' + designer.attachmentArr[i].fileIndexId + "' title='" + designer.attachmentArr[i].fileName + "'>" + designer.attachmentArr[i].fileName + "</option>");
						}
					}
					if (_cellType._cellTagStartCache[0].isPaper) {
						attachmentText.val('');
					} else {
						var attachments = attachmentLink.split(',');
						for(var attachment of attachments){
							$("#attachment_list option[value='" + attachment + "']").attr("selected", true);
						}
					}
					paperInput.removeAttr('disabled');
					attachmentText.removeAttr('disabled');
					clearDgBtn.removeAttr('disabled');
					refreshDgBtn.removeAttr('disabled');
				} else if (isFile == false) {
					// formula = sheetText(工作表索引) + ':' + text(单元格)
					var formula = _cellType._cellTagStartCache[0].formula;
					// 显示内容
					var display = _cellType._cellTagStartCache[0].displayText;
					$(_this).find("input[name='linktype'][value='0']").prop('checked', true);
					paperInput.val('');
					paperText.val(designer.paperSelectedId);
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
							async : false,
							data : {
								menuId: window.sys_menuId,
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
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
									sheetText.val(formula.substring(0,formula.indexOf(':')));
									sheetText.removeAttr('disabled');
									text.removeAttr('disabled');
								}
							}
						});
					}
				} else {
					urlText.removeAttr('disabled');
					url.removeAttr('disabled');
					urlText.val('');
					url.val('');
					urlText.val(_cellType._cellTagStartCache[0].urlText);
					url.val(_cellType._cellTagStartCache[0].url);
				}
				this.selectedIndex = 0;
			} else {
				$(_this).find("input[name='linktype'][value='0']").prop('checked', true);
				displayText.val('');
				paperTextCell.val('');
				sheetText.val('');
				text.val('');
				paperTextCell.val('');
				paperListCell.val(designer.paperSelectedId);
				paperInput.val('');
				paperText.val(designer.paperSelectedId);
				attachmentText.val('');
				urlText.val('');
				url.val('');
			}
		});
		// 单向链接--确定
		$('#btn_singleLink_ensure').on('click', function() {
			var _this = $('#modal_singleLink');
			var spread = designer.Spread;
			var sheet = spread.getActiveSheet();
			var paperText = _this.find('.paperText');
			var attachmentText = _this.find('.attachmentText');
			var urlText = _this.find('.externalDisplayText');
			var url = _this.find('.externalURL');
			var fileName = '';
			var attachmentTextVal = '';
			if (paperText.val() !== null && paperText.val() !== '') {
				if (attachmentText.val() === '') {
					fileName = paperText[0].selectedOptions[0].text;
				} else {
					$.each(attachmentText[0].selectedOptions, function(i, item){
						if(item.text != ''){
							fileName = fileName + ',' + item.text;
							attachmentTextVal = attachmentTextVal + ',' + item.value;
						}
					}); 
				}
			} else {
				paperText.val('');
			}
			if(fileName.substring(0,1) == ','){
				fileName = fileName.substring(1);
			}
			if(attachmentTextVal.substring(0,1) == ','){
				attachmentTextVal = attachmentTextVal.substring(1);
			}
			if (singleLinkItems.length !== 0) {
				singleLinkItems.splice(_this.find('.items')[0].selectedIndex, 1, {
					radio: _this.find("input[name='linktype']:checked").val(),
					text: _this.find('.text').val(),
					sheetText: _this.find('.sheetText').val(),
					sheetName: _this.find('.sheetText')[0].selectedOptions[0].text,
					paperListCell: _this.find('.paperListCell').val(),
					paperTextCell: _this.find('.paperTextCell').val(),
					displayText: _this.find('.displayText').val(),
					paperText: paperText.val(),
					attachmentText: attachmentTextVal,
					fileName: fileName,
					paperName: _this.find('.paperInput').val(),
					urlText: urlText.val(),
					url: url.val()
				});
			}
			var cellTagStart = [];
			for (var i = 0; i < singleLinkItems.length; i++) {
				if (singleLinkItems[i].radio === '1') {
					if (singleLinkItems[i].paperText === '') {
						singleLinkItems.splice(i,1);
						i = i - 1;
					}
				} else if (singleLinkItems[i].radio === '0') {
					if (singleLinkItems[i].text === '' || singleLinkItems[i].paperTextCell === '' || singleLinkItems[i].sheetText === '') {
						singleLinkItems.splice(i,1);
						i = i - 1;
					}
				} else if (singleLinkItems[i].radio === '2') {
					if (singleLinkItems[i].url === '') {
						singleLinkItems.splice(i,1);
						i = i - 1;
					}
				}
			}
			var sheetName = designer.Spread.getActiveSheet().name();
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			var cellValue = '';
			for (var i = 0; i < singleLinkItems.length; i++) {
				if (singleLinkItems[i].radio === '1') {
					var paperLink = singleLinkItems[i].paperText;
					var attachmentLink = singleLinkItems[i].attachmentText;
					var isPaper = true;
					if (singleLinkItems[i].attachmentText !== '') {
						isPaper = false;
						for(var attachment of singleLinkItems[i].attachmentText.split(',')){
							// 973:1001-0001-0001-F0001
							cellValue = cellValue + '   ' + attachment.substring(attachment.indexOf(':') + 1);
						}
						// cellValue = cellValue + '   ' + attachmentLink.substring(attachmentLink.indexOf(':') + 1);
					} else {
						cellValue = cellValue + '   ' + paperLink.substring(paperLink.indexOf(':') + 1);
					}
					cellTagStart.push({
						type: 'link',
						isFile: true,
						paperLink: paperLink,
						attachmentLink: attachmentLink,
						isPaper: isPaper,
						fileName: singleLinkItems[i].fileName,
						paperName: singleLinkItems[i].paperName,
						linkText: 'L' + (i + 1),
						cellPosition: sheetName + ':' + rangeStr
					});
				} else if (singleLinkItems[i].radio === '0') {
					cellTagStart.push({
						type: 'link',
						isFile: false,
						formula: singleLinkItems[i].sheetText + ':' + singleLinkItems[i].text,
						link: singleLinkItems[i].sheetText + ':' + singleLinkItems[i].text,
						displayText: singleLinkItems[i].displayText,
						sheetName: singleLinkItems[i].sheetName,
						paperListCell: singleLinkItems[i].paperListCell,
						paperTextCell: singleLinkItems[i].paperTextCell,
						linkText: 'L' + (i + 1),
						cellPosition: sheetName + ':' + rangeStr
					});
					cellValue = cellValue + '   ' + singleLinkItems[i].displayText;
				} else if (singleLinkItems[i].radio === '2') {
					cellTagStart.push({
						type: 'link',
						linkText: 'L' + (i + 1),
						isExternal: true,
						linkType: 'URL',
						urlText: singleLinkItems[i].urlText,
						url: singleLinkItems[i].url,
						urlType: singleLinkItems[i].urlType
					});
					cellValue = cellValue + '   ' + singleLinkItems[i].urlText;
				}
			}
			if (cellTagStart.length === 0){
				bdoInfoBox('失败', '请添加单向链接或正确设置单向链接属性！');
			}else{
				var mapKey = sheetIndex + ':' + row + ':' + col;
				// 该底稿单元格存在单向链接时，删除再添加
				// 该底稿单元格不存在单向链接时，添加
				if (!designer.ShowSingleLinkCacheMap.has(mapKey)) {
					designer.ShowSingleLinkCacheMap.set(mapKey,cellTagStart);
				} else if (designer.ShowSingleLinkCacheMap.has(mapKey)) {
					designer.ShowSingleLinkCacheMap.delete(mapKey);
					if (cellTagStart.length !== 0) {
						designer.ShowSingleLinkCacheMap.set(mapKey,cellTagStart);
					}
				}
				designer.Spread.suspendPaint();
				var activeCell = sheet.getCell(row, col);
				activeCell.value(cellValue);
				activeCell.cellType(new designer.ShowSingleLink());
				activeCell.tag({
					cellTagStart: cellTagStart
				});
				// 居左
				activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
				activeCell.foreColor('blue');
				activeCell.textDecoration(GC.Spread.Sheets.TextDecorationType.underline);
				designer.Spread.resumePaint();
				$('#modal_singleLink').modal('hide');
			}
		});
		// 单向链接--清除
		$('#btn_singleLink_clear').on('click', function() {
			var sheet = designer.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			var mapKey = sheetIndex + ':' + row + ':' + col;
			// 该底稿单元格存在单向链接时，删除再添加
			if (designer.ShowSingleLinkCacheMap.has(mapKey)) {
				designer.ShowSingleLinkCacheMap.delete(mapKey);
				designer.Spread.suspendPaint();
				var activeCell = sheet.getCell(row, col);
				activeCell.value('');
				// 清除单元格格式
				activeCell.cellType(void 0);
				designer.Spread.resumePaint();
			}
			$('#modal_singleLink').modal('hide');
		});
//-----------------------------------------单向链接 END-----------------------------------------//

//-----------------------------------------交叉索引 START-----------------------------------------//
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
				type : 'post',
				url : 'dgCenter/DgWapper.setMutualIndex.json',
				async : false,
				data : param,
				dataType : 'json',
				success(data) {
					if(!data.success){
						bReturn = false;
						bdoErrorBox('保存失败', data.resultInfo.statusText);
					}
				}
			});
			return bReturn;
		}
		// 设置TB科目公式
		function setFormula_0(_this){
			// TB科目
			var tbList = $(_this).find('.tbList');
			if(tbList.val() == null || tbList.val() == ''){
				bdoInfoBox('提示', '请选择TB科目');
				return false;
			}
			// 科目项
			var tbColumnList = $(_this).find('.tbColumnList');
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
			var activeCellInput = $(_this).find('.activeCellInput');
			var rightTagName = activeCellInput.val();
			var rightTagValue = activeCellInput.attr('data-value');
			var rightTagPosition = activeCellInput.val();
			var rightTagInfo = getRightTagInfo(rightTagPosition);
			var param = {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
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
			var guideList = $(_this).find('.guideList');
			if(guideList.val() == null || guideList.val() == ''){
				bdoInfoBox('提示', '请选择财务科目');
				return false;
			}
			// 科目项
			var guideColumnList = $(_this).find('.guideColumnList');
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
			var activeCellInput = $(_this).find('.activeCellInput');
			var rightTagName = activeCellInput.val();
			var rightTagValue = activeCellInput.attr('data-value');
			var rightTagPosition = activeCellInput.val();
			var rightTagInfo = getRightTagInfo(rightTagPosition);
			var param = {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
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
			// 底稿输入框
			var dgListText = $(_this).find('.dgListText');
			// 底稿
			var dgList = $(_this).find('.dgList');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheet');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInput');
			if(dgListText.val() == '' || dgList.val() == null || dgList.val() == ''){
				bdoInfoBox('提示', '请选择底稿');
				return false;
			}else{
				if(dgSheet.val() == null || dgSheet.val() == ''){
					bdoInfoBox('提示', '请选择底稿Sheet');
					return false;
				}else{
					if(dgCellInput.val() == ''){
						bdoInfoBox('提示', '请选择底稿单元格');
						return false;
					}else{
						var range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), dgCellInput.val(), 0, 0);
						if (range == null) {
							bdoInfoBox('提示', '底稿单元格位置单元格引用无效！');
							return false;
						}
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
			var activeCellInput = $(_this).find('.activeCellInput');
			var rightTagName = activeCellInput.val();
			var rightTagValue = activeCellInput.attr('data-value');
			var rightTagPosition = activeCellInput.val();
			var rightTagInfo = getRightTagInfo(rightTagPosition);
			var param = {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
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
			// 附注输入框
			var noteListText = $(_this).find('.noteListText');
			// 附注
			var noteList = $(_this).find('.noteList');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheet');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInput');
			if(noteListText.val() == '' || noteList.val() == null || noteList.val() == ''){
				bdoInfoBox('提示', '请选择附注');
				return false;
			}else{
				if(noteSheet.val() == null || noteSheet.val() == ''){
					bdoInfoBox('提示', '请选择附注Sheet');
					return false;
				}else{
					if(noteCellInput.val() == ''){
						bdoInfoBox('提示', '请选择附注单元格');
						return false;
					}else{
						var range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), noteCellInput.val(), 0, 0);
						if (range == null) {
							bdoInfoBox('提示', '附注单元格位置单元格引用无效！');
							return false;
						}
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
			var activeCellInput = $(_this).find('.activeCellInput');
			var rightTagName = activeCellInput.val();
			var rightTagValue = activeCellInput.attr('data-value');
			var rightTagPosition = activeCellInput.val();
			var rightTagInfo = getRightTagInfo(rightTagPosition);
			var param = {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
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
			var sheet = designer.Spread.getActiveSheet();
			var sheetIndex = designer.Spread.getActiveSheetIndex();
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
			var tbList = $(_this).find('.tbList');
			// 科目项
			var tbColumnList = $(_this).find('.tbColumnList');
			// 当前单元格
			var activeCellInput = $(_this).find('.activeCellInput');
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
			var guideList = $(_this).find('.guideList');
			// 科目项
			var guideColumnList = $(_this).find('.guideColumnList');
			// 当前单元格
			var activeCellInput = $(_this).find('.activeCellInput');
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
			var dgList = $(_this).find('.dgList');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheet');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInput');
			// 当前单元格
			var activeCellInput = $(_this).find('.activeCellInput');
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
			var noteList = $(_this).find('.noteList');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheet');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInput');
			// 当前单元格
			var activeCellInput = $(_this).find('.activeCellInput');
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
			var sheet = designer.Spread.getActiveSheet();
			var spread = designer.Spread;
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			// radioButton 0--TB 1--导引表 2--底稿 3--附注
			var leftIndexTypeValue = $(_this).find('input[name=leftIndexType]:checked').val();
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
			let cellTypeMap = designer.ShowSingleLinkCacheMap;
			for (let[k,v] of cellTypeMap) {
				objCellType[k] = v;
			}
			var customizeStyle;
			if(designer.paperType == 'dg'){
				customizeStyle= JSON.stringify({
					ShowSingleLinkCacheMap: objCellType,
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
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
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
				var dgList = $(_this).find('.dgList');
				var customizeStyle1 = getCustomizeStyle(sqlId, dgList.val().substring(0, dgList.val().indexOf(':')));
				var strMap = new Map();
				var ShowSingleLinkCacheMap = new Map();
				var ShowAuditSamplingCacheMap = new Map();
				if(customizeStyle1){
					if(customizeStyle1.ShowSingleLinkCacheMap){
						var mapJson = customizeStyle1.ShowSingleLinkCacheMap;
						// json转换为map
						for (let k of Object.keys(mapJson)) {
							ShowSingleLinkCacheMap.set(k, mapJson[k]);
						}
					}
					if(customizeStyle1.ShowMutualIndexCacheMap){
						var mapJson = customizeStyle1.ShowMutualIndexCacheMap;
						// json转换为map
						for (let k of Object.keys(mapJson)) {
							strMap.set(k, mapJson[k]);
						}
					}
					if(customizeStyle1.ShowAuditSamplingCacheMap){
						var mapJson = customizeStyle1.ShowAuditSamplingCacheMap;
						// json转换为map
						for (let k of Object.keys(mapJson)) {
							ShowAuditSamplingCacheMap.set(k, mapJson[k]);
						}
					}
				}
				// 底稿sheet
				var dgSheet = $(_this).find('.dgSheet');
				// 底稿单元格
				var dgCellInput = $(_this).find('.dgCellInput');
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
				for (let[k,v] of ShowSingleLinkCacheMap) {
					objCellType[k] = v;
				}
				let objMutualIndex = {};
				for (let[k,v] of strMap) {
					objMutualIndex[k] = v;
				}
				let objAuditSampling = {};
				for (let[k,v] of ShowAuditSamplingCacheMap) {
					objAuditSampling[k] = v;
				}
				var setCustomizeStyle = JSON.stringify({
					ShowSingleLinkCacheMap: objCellType,
					ShowMutualIndexCacheMap: objMutualIndex,
					ShowAuditSamplingCacheMap: objAuditSampling
				});
				$.ajax({
					url : 'dgCenter/DgWapper.setDgCustomizeStyle.json',
					async : false,
					type : 'post',
					data : {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
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
				var noteList = $(_this).find('.noteList');
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
				var noteSheet = $(_this).find('.noteSheet');
				// 附注单元格
				var noteCellInput = $(_this).find('.noteCellInput');
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
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
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
				url: 'dgCenter/DgGeneral.query.json',
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
			$('#guide-list').empty();
			for(let dataList of designer.guideArr){
				$('#guide-list').append("<option value='" + dataList.subjectId + "' title='" + dataList.subjectName + "'>" + dataList.subjectId + '-' + dataList.subjectName + "</option>");
			}
		}

		function setGuideColumnList(){
			$('#guideColumn-list').empty();
			$('#guideColumn-list').append("<option value='0'>" + (parseInt(CUR_PROJECT_ACC_YEAR) - 1) + '未审数' + "</option>");
			$('#guideColumn-list').append("<option value='1'>" + (parseInt(CUR_PROJECT_ACC_YEAR) - 1) + '调整数' + "</option>");
			$('#guideColumn-list').append("<option value='2'>" + (parseInt(CUR_PROJECT_ACC_YEAR) - 1) + '审定数' + "</option>");
			$('#guideColumn-list').append("<option value='3'>" + window.CUR_PROJECT_ACC_YEAR + '未审数' + "</option>");
			$('#guideColumn-list').append("<option value='4'>" + window.CUR_PROJECT_ACC_YEAR + '调整数' + "</option>");
			$('#guideColumn-list').append("<option value='5'>" + window.CUR_PROJECT_ACC_YEAR + '审定数' + "</option>");
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

		function setStyle_0(_this){
			// radioButton 0--TB 1--导引表 2--底稿 3--附注
			var leftIndexType = $(_this).find('input[name=leftIndexType]');
			$('input[name=leftIndexType]').get(0).checked = true;
			// TB科目输入框
			var tbListText = $(_this).find('.tbListText');
			// TB科目
			var tbList = $(_this).find('.tbList');
			// 科目项
			var tbColumnList = $(_this).find('.tbColumnList');
			// 财务科目输入框
			var guideListText = $(_this).find('.guideListText');
			// 财务科目
			var guideList = $(_this).find('.guideList');
			// 科目项
			var guideColumnList = $(_this).find('.guideColumnList');
			// 底稿输入框
			var dgListText = $(_this).find('.dgListText');
			// 底稿
			var dgList = $(_this).find('.dgList');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheet');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInput');
			// 附注输入框
			var noteListText = $(_this).find('.noteListText');
			// 附注
			var noteList = $(_this).find('.noteList');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheet');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInput');
			// 打开底稿
			var openDgBtn = $(_this).find('.openDg-button');
			// 刷新底稿
			var refreshDgBtn = $(_this).find('.refreshDg-button');
			// 打开附注
			var openNoteBtn = $(_this).find('.openNote-button');
			// 刷新附注
			var refreshNoteBtn = $(_this).find('.refreshNote-button');
			
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
			var leftIndexType = $(_this).find('input[name=leftIndexType]');
			$('input[name=leftIndexType]').get(1).checked = true;
			// TB科目输入框
			var tbListText = $(_this).find('.tbListText');
			// TB科目
			var tbList = $(_this).find('.tbList');
			// 科目项
			var tbColumnList = $(_this).find('.tbColumnList');
			// 财务科目输入框
			var guideListText = $(_this).find('.guideListText');
			// 财务科目
			var guideList = $(_this).find('.guideList');
			// 科目项
			var guideColumnList = $(_this).find('.guideColumnList');
			// 底稿输入框
			var dgListText = $(_this).find('.dgListText');
			// 底稿
			var dgList = $(_this).find('.dgList');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheet');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInput');
			// 附注输入框
			var noteListText = $(_this).find('.noteListText');
			// 附注
			var noteList = $(_this).find('.noteList');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheet');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInput');
			// 打开底稿
			var openDgBtn = $(_this).find('.openDg-button');
			// 刷新底稿
			var refreshDgBtn = $(_this).find('.refreshDg-button');
			// 打开附注
			var openNoteBtn = $(_this).find('.openNote-button');
			// 刷新附注
			var refreshNoteBtn = $(_this).find('.refreshNote-button');
			
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
			var leftIndexType = $(_this).find('input[name=leftIndexType]');
			$('input[name=leftIndexType]').get(2).checked = true;
			// TB科目输入框
			var tbListText = $(_this).find('.tbListText');
			// TB科目
			var tbList = $(_this).find('.tbList');
			// 科目项
			var tbColumnList = $(_this).find('.tbColumnList');
			// 财务科目输入框
			var guideListText = $(_this).find('.guideListText');
			// 财务科目
			var guideList = $(_this).find('.guideList');
			// 科目项
			var guideColumnList = $(_this).find('.guideColumnList');
			// 底稿输入框
			var dgListText = $(_this).find('.dgListText');
			// 底稿
			var dgList = $(_this).find('.dgList');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheet');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInput');
			// 附注输入框
			var noteListText = $(_this).find('.noteListText');
			// 附注
			var noteList = $(_this).find('.noteList');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheet');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInput');
			// 打开底稿
			var openDgBtn = $(_this).find('.openDg-button');
			// 刷新底稿
			var refreshDgBtn = $(_this).find('.refreshDg-button');
			// 打开附注
			var openNoteBtn = $(_this).find('.openNote-button');
			// 刷新附注
			var refreshNoteBtn = $(_this).find('.refreshNote-button');
			
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
			var leftIndexType = $(_this).find('input[name=leftIndexType]');
			$('input[name=leftIndexType]').get(3).checked = true;
			// TB科目输入框
			var tbListText = $(_this).find('.tbListText');
			// TB科目
			var tbList = $(_this).find('.tbList');
			// 科目项
			var tbColumnList = $(_this).find('.tbColumnList');
			// 财务科目输入框
			var guideListText = $(_this).find('.guideListText');
			// 财务科目
			var guideList = $(_this).find('.guideList');
			// 科目项
			var guideColumnList = $(_this).find('.guideColumnList');
			// 底稿输入框
			var dgListText = $(_this).find('.dgListText');
			// 底稿
			var dgList = $(_this).find('.dgList');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheet');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInput');
			// 附注输入框
			var noteListText = $(_this).find('.noteListText');
			// 附注
			var noteList = $(_this).find('.noteList');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheet');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInput');
			// 打开底稿
			var openDgBtn = $(_this).find('.openDg-button');
			// 刷新底稿
			var refreshDgBtn = $(_this).find('.refreshDg-button');
			// 打开附注
			var openNoteBtn = $(_this).find('.openNote-button');
			// 刷新附注
			var refreshNoteBtn = $(_this).find('.refreshNote-button');
			
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

		function setMutualIndexCell(cellTagCache, _this){
			if(cellTagCache.linkType == '0'){
				setStyle_0(_this);
				var displayText = cellTagCache.displayText;
				var tbListText = displayText.substring(0, displayText.indexOf(':'));
				var tbColumnListText = displayText.substring(displayText.indexOf(':') + 1);
				$('#tb-list-text').val(tbListText);
				$("#tb-list option:contains('" + tbListText + "')").prop('selected', true);
				$("#tbColumn-list option:contains('" + tbColumnListText + "')").prop('selected', true);
			}else if(cellTagCache.linkType == '1'){
				setStyle_1(_this);
				var displayText = cellTagCache.displayText;
				var guideListText = displayText.substring(0, displayText.indexOf(':'));
				var guideColumnListText = displayText.substring(displayText.indexOf(':') + 1);
				$('#guide-list-text').val(guideListText);
				$("#guide-list option:contains('" + guideListText + "')").prop('selected', true);
				$("#guideColumn-list option:contains('" + guideColumnListText + "')").prop('selected', true);
			}else if(cellTagCache.linkType == '2'){
				setStyle_2(_this);
				// 底稿输入框
				var dgListText = $(_this).find('.dgListText');
				// 底稿
				var dgList = $(_this).find('.dgList');
				// 底稿sheet
				var dgSheet = $(_this).find('.dgSheet');
				// 底稿单元格
				var dgCellInput = $(_this).find('.dgCellInput');
				dgListText.val(cellTagCache.paperName);
				dgList.val(cellTagCache.paperId + ':' + cellTagCache.paperIndex);
				setDgSheet(dgList.val(), 'dg-sheet');
				dgSheet.val(cellTagCache.sheetIndex);
				dgCellInput.val(cellTagCache.cell);
				dgSheet.removeAttr('disabled');
				dgCellInput.removeAttr('disabled');
			}else if(cellTagCache.linkType == '3'){
				setStyle_3(_this);
				// 附注输入框
				var noteListText = $(_this).find('.noteListText');
				// 附注
				var noteList = $(_this).find('.noteList');
				// 附注sheet
				var noteSheet = $(_this).find('.noteSheet');
				// 附注单元格
				var noteCellInput = $(_this).find('.noteCellInput');
				noteListText.val(cellTagCache.paperName);
				noteList.val(cellTagCache.paperId + ':' + cellTagCache.paperIndex);
				setNoteSheet(noteList.val(), 'note-sheet');
				noteSheet.val(cellTagCache.sheetIndex);
				noteCellInput.val(cellTagCache.cell);
				noteSheet.removeAttr('disabled');
				noteCellInput.removeAttr('disabled');
			}
		}
		var isExChange = false;
		// 交叉索引--显示
		$('#modal_mutualIndex').on('show.bs.modal', function() {
			isExChange = false;
			var _this = this;
			// radioButton 0--TB 1--导引表 2--底稿 3--附注
			var leftIndexType = $(_this).find('input[name=leftIndexType]');
			// TB科目输入框
			var tbListText = $(_this).find('.tbListText');
			// TB科目
			var tbList = $(_this).find('.tbList');
			// 科目项
			var tbColumnList = $(_this).find('.tbColumnList');
			// 财务科目输入框
			var guideListText = $(_this).find('.guideListText');
			// 财务科目
			var guideList = $(_this).find('.guideList');
			// 科目项
			var guideColumnList = $(_this).find('.guideColumnList');
			// 底稿输入框
			var dgListText = $(_this).find('.dgListText');
			// 底稿
			var dgList = $(_this).find('.dgList');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheet');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInput');
			// 附注输入框
			var noteListText = $(_this).find('.noteListText');
			// 附注
			var noteList = $(_this).find('.noteList');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheet');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInput');
			// 打开底稿
			var openDgBtn = $(_this).find('.openDg-button');
			// 刷新底稿
			var refreshDgBtn = $(_this).find('.refreshDg-button');
			// 打开附注
			var openNoteBtn = $(_this).find('.openNote-button');
			// 刷新附注
			var refreshNoteBtn = $(_this).find('.refreshNote-button');
			leftIndexType.unbind('change');
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
			tbListText.unbind('focus');
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
			tbListText.unbind('input');
			tbListText.on('input',function(){
				$('#tb-list').empty();
				for(var dataList of designer.tbArr){
					var text = dataList.tbSubjectId + '-' + dataList.tbSubjectName;
					if (text.indexOf(this.value) > -1) {
						$('#tb-list').append("<option value='" + dataList.tbSubjectId + "' title='" + dataList.tbSubjectName + "'>" + dataList.tbSubjectId + '-' + dataList.tbSubjectName + "</option>");
					}
				}
			});
			tbList.unbind('change');
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
			guideListText.unbind('focus');
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
			guideListText.unbind('input');
			guideListText.on('input',function(){
				$('#guide-list').empty();
				for(var dataList of designer.guideArr){
					var text = dataList.subjectId + '-' + dataList.subjectName;
					if (text.indexOf(this.value) > -1) {
						$('#guide-list').append("<option value='" + dataList.subjectId + "' title='" + dataList.subjectName + "'>" + dataList.subjectId + '-' + dataList.subjectName + "</option>");
					}
				}
			});
			guideList.unbind('change');
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
			dgListText.unbind('focus');
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
			dgListText.unbind('input');
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
			dgList.unbind('change');
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
			dgSheet.unbind('change');
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
			noteListText.unbind('focus');
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
			noteListText.unbind('input');
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
			noteList.unbind('change');
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
			noteSheet.unbind('change');
			noteSheet.change(function () {
				if(this.value != ''){
					noteCellInput.removeAttr('disabled');
				}else{
					noteCellInput.val('');
					noteCellInput.attr('disabled', true);
				}
			});
			openDgBtn.unbind('click');
			openDgBtn.click(function () {
				// 底稿输入框
				var dgListText = $(_this).find('.dgListText');
				// 底稿
				var dgList = $(_this).find('.dgList');
				if(dgListText.val() !== '' && dgList.val() != null && dgList.val() !== ''){
					var dgFileId = dgList.val().substring(0, dgList.val().indexOf(':'));
					var dgFileIndexId = dgList.val().substring(dgList.val().indexOf(':') + 1);
					var dgFileName = dgList.find('option:selected').text().substring(0, dgList.find('option:selected').text().lastIndexOf('.'));
					if(designer.paperType == 'dg' && dgFileId == designer.workpaperId) return;
					openDgFile(dgFileId, dgFileIndexId, dgFileName);
				}else{
					bdoInfoBox('提示', '请选择底稿');
				}
			});
			refreshDgBtn.unbind('click');
			refreshDgBtn.click(function () {
				designer.paperArr = [];
				$.ajax({
					type : 'post',
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
					dataType : 'json',
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
			openNoteBtn.unbind('click');
			openNoteBtn.click(function () {
				// 附注输入框
				var noteListText = $(_this).find('.noteListText');
				// 附注
				var noteList = $(_this).find('.noteList');
				if(noteListText.val() !== '' && noteList.val() != null && noteList.val() !== ''){
					var dgFileId = noteList.val().substring(0, noteList.val().indexOf(':'));
					var dgFileIndexId = noteList.val().substring(noteList.val().indexOf(':') + 1);
					var dgFileName = noteList.find('option:selected').text().substring(0, noteList.find('option:selected').text().lastIndexOf('.'));
					openNoteFile(dgFileId, dgFileIndexId, dgFileName);
				}else{
					bdoInfoBox('提示', '请选择附注');
				}
			});
			refreshNoteBtn.unbind('click');
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
							setNoteList();
							if(data.data[0].autoId != null && data.data[0].autoId != ''){
								noteSheet.removeAttr('disabled');
								setNoteSheet(data.data[0].autoId + ':' + data.data[0].noteNo, 'note-sheet');
							}
						}
					}
				});
			});
			// **********************************右交叉索引**********************************
			var sheet = designer.Spread.getActiveSheet();
			var sheetName = sheet.name();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			// 当前单元格位置
			var activeCell = $(_this).find('.activeCellInput');
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
			setStyle_0(_this);
			var currentCell = sheet.getCell(row, col);
			// 当前单元格单元格类型
			var currentCellType = currentCell.cellType();
			var _cellType;
			if (currentCellType && currentCellType.typeName == 'ShowMutualIndex') {
				_cellType = currentCellType;
			} else {
				_cellType = new designer.ShowMutualIndex();
			}
			if (_cellType._cellTagStartCache != undefined && _cellType._cellTagStartCache.length > 0) {
				var cellTagCache_0 = _cellType._cellTagStartCache[0];
				if(cellTagCache_0){
					setMutualIndexCell(cellTagCache_0, _this);
					$('#leftLabel').html('左交叉索引');
					$('#rightLabel').html('右交叉索引');
					$('#rightTd').insertAfter($('#leftTd'));
					isExChange = false;
					return;
				}
				var cellTagCache_1 = _cellType._cellTagStartCache[1];
				if(cellTagCache_1){
					setMutualIndexCell(cellTagCache_1, _this);
					$('#leftLabel').html('右交叉索引');
					$('#rightLabel').html('左交叉索引');
					$('#leftTd').insertAfter($('#rightTd'));
					isExChange = true;
				}
			}else{
				$('#leftLabel').html('左交叉索引');
				$('#rightLabel').html('右交叉索引');
				$('#rightTd').insertAfter($('#leftTd'));
				isExChange = false;
			}
		});
		// 交叉索引--确定
		$('#btn_mutualIndex_ensure').on('click', function() {
			var _this = $('#modal_mutualIndex');
			// radioButton 0--TB 1--导引表 2--底稿 3--附注
			var leftIndexTypeValue = $(_this).find('input[name=leftIndexType]:checked').val();
			var isOk = true;
			if(leftIndexTypeValue == '0'){
				isOk = setFormula_0(_this);
			}else if(leftIndexTypeValue == '1'){
				isOk = setFormula_1(_this);
			}else if(leftIndexTypeValue == '2'){
				isOk = setFormula_2(_this);
			}else if(leftIndexTypeValue == '3'){
				isOk = setFormula_3(_this);
			}
			if(!isOk){
				return;
			}
			setShowMutualIndex(_this);
			bdoSuccessBox('成功', '设置成功！');
			$('#modal_mutualIndex').modal('hide');
		});
		// 交叉索引--切换
		$('#btn_mutualIndex_exchange').on('click', function() {
			var _this = $('#modal_mutualIndex');
			var sheet = designer.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var currentCell = sheet.getCell(row, col);
			// 当前单元格单元格类型
			var currentCellType = currentCell.cellType();
			var _cellType;
			if (currentCellType && currentCellType.typeName == 'ShowMutualIndex') {
				_cellType = currentCellType;
			} else {
				_cellType = new designer.ShowMutualIndex();
			}
			setStyle_0(_this);
			if(!isExChange){
				$('#leftLabel').html('右交叉索引');
				$('#rightLabel').html('左交叉索引');
				$('#leftTd').insertAfter($('#rightTd'));
				isExChange = true;
				if (_cellType._cellTagStartCache && _cellType._cellTagStartCache[1] && _cellType._cellTagStartCache.length > 0) {
					var cellTagCache = _cellType._cellTagStartCache[1];
					setMutualIndexCell(cellTagCache, _this);
				}
			}else{
				$('#leftLabel').html('左交叉索引');
				$('#rightLabel').html('右交叉索引');
				$('#rightTd').insertAfter($('#leftTd'));
				isExChange = false;
				if (_cellType._cellTagStartCache && _cellType._cellTagStartCache[0] && _cellType._cellTagStartCache.length > 0) {
					var cellTagCache = _cellType._cellTagStartCache[0];
					setMutualIndexCell(cellTagCache, _this);
				}
			}
		});
		// 交叉索引--清除
		$('#btn_mutualIndex_clear').on('click', function() {
			$('#modal_mutualIndex').modal('hide');
			$('#tagDeleteModal').modal('show');
		});
//-----------------------------------------交叉索引 END-----------------------------------------//

//-----------------------------------------抽凭链接 START-----------------------------------------//
		// 所有抽凭链接item
		var auditSamplingItems = [];
		// 抽凭链接--显示
		$('#modal_auditSampling').on('show.bs.modal', function() {
			var _this = this;
			var selectedIndex = -1;
			$('#sampling_file_subjectid').val(designer.dgExtraOptions.userSubjectId);
			// 抽凭附件下拉框
			var samplingAttachSelect = $(_this).find('.samplingAttach');
			var refreshSamplingAttachBtn = $(_this).find('.refreshSamplingAttach-button');
			refreshSamplingAttachBtn.click(function () {
				setSamplingAttachList();
			});
			var items = $(_this).find('.items');
			var itemsOptions = items[0].options;
			var addBtn = $(_this).find('.add-button');
			var removeBtn = $(_this).find('.remove-button');
			addBtn.button();
			removeBtn.button();
			addBtn.unbind('click');
			addBtn.click(function () {
				itemsOptions[itemsOptions.length] = new Option('链接' + itemsOptions.length.toString());
				if (items[0].length === 1) {
					auditSamplingItems = [];
				}
				var id = samplingAttachSelect.val();
				var text = $(samplingAttachSelect).find('option:selected').text();
				var indexId = text.substring(0, text.indexOf(':'));
				auditSamplingItems.push(
					{
						id : id,
						text : text,
						indexId : indexId
					});
				samplingAttachSelect.removeAttr('disabled');
				refreshSamplingAttachBtn.removeAttr('disabled');
				items.trigger('change', { selectMoveTo: auditSamplingItems.length - 1, action: 'add' });
			});
			removeBtn.unbind('click');
			removeBtn.click(function () {
				itemsOptions.remove(selectedIndex);
				for (var i = selectedIndex; i < itemsOptions.length; i++) {
					itemsOptions[i] = new Option('链接' + i.toString());
				}
				auditSamplingItems.splice(selectedIndex, 1);
				var select;
				if (auditSamplingItems.length > selectedIndex) {
					select = selectedIndex;
				} else if (auditSamplingItems.length > 0) {
					select = selectedIndex - 1;
				} else {
					select = -1;
					samplingAttachSelect.attr('disabled', true);
					refreshSamplingAttachBtn.attr('disabled', true);
				}
				items.trigger('change', { selectMoveTo: select, action: 'remove' });
			});
			items.unbind('change');
			items.change(function (evt, args) {
				var srcElement = evt.target || evt.srcElement;
				var ele = srcElement;
				//Add or switch selected item need save data of item.
				if ((args === undefined || args.action === 'add') && (selectedIndex !== -1 && selectedIndex < auditSamplingItems.length)) {
					var id = samplingAttachSelect.val();
					var text = $(samplingAttachSelect).find('option:selected').text();
					var indexId = text.substring(0, text.indexOf(':'));
					auditSamplingItems[selectedIndex] = {
						id : id,
						text : text,
						indexId : indexId
					};
				}
				//Load data of item.
				if (args === undefined) {
					selectedIndex = parseInt(ele.value.substring(2));
				} else {
					selectedIndex = args.selectMoveTo;
				}
				if (selectedIndex !== -1) {
					$(itemsOptions[selectedIndex]).prop('selected', true);
					samplingAttachSelect.val(auditSamplingItems[selectedIndex].id);
				}
			});
			// 设置抽凭附件下拉框
			setSamplingAttachList();
			samplingAttachSelect.attr('disabled', true);
			refreshSamplingAttachBtn.attr('disabled', true);
			items.empty();
			auditSamplingItems = [];
			// 当前行
			var row = designer.Spread.getActiveSheet().getActiveRowIndex();
			// 当前列
			var col = designer.Spread.getActiveSheet().getActiveColumnIndex();
			// 当前单元格
			var activeCell = designer.Spread.getActiveSheet().getCell(row, col);
			// 当前单元格单元格类型
			var currentCellType = activeCell.cellType();
			var _cellType;
			if (currentCellType && currentCellType.typeName == 'ShowAuditSampling') {
				_cellType = currentCellType;
			} else {
				_cellType = new designer.ShowAuditSampling();
			}
			if (_cellType._cellTagStartCache != undefined && _cellType._cellTagStartCache.length > 0) {
				for (var i = 0; i < _cellType._cellTagStartCache.length; i++) {
					itemsOptions[itemsOptions.length] = new Option('链接' + itemsOptions.length.toString());
					auditSamplingItems.push({
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
		});
		// 抽凭链接--确定
		$('#btn_auditSampling_ensure').on('click', function() {
			// 抽凭附件下拉框
			var samplingAttachSelect = $('#modal_auditSampling').find('.samplingAttach');
			var id = samplingAttachSelect.val();
			var text = $(samplingAttachSelect).find('option:selected').text();
			var indexId = text.substring(0, text.indexOf(':'));
			var spread = designer.Spread;
			var sheet = spread.getActiveSheet();
			
			if (auditSamplingItems.length !== 0) {
				auditSamplingItems.splice($('#modal_auditSampling').find('.items')[0].selectedIndex, 1, {
					id : id,
					text : text,
					indexId : indexId
				});
			}
			var cellTagStart = [];
			for (var i = 0; i < auditSamplingItems.length; i++) {
				if (auditSamplingItems[i].id == null || auditSamplingItems[i].id == '') {
					auditSamplingItems.splice(i,1);
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
			for (var i = 0; i < auditSamplingItems.length; i++) {
				var id = auditSamplingItems[i].id;
				var text = auditSamplingItems[i].text;
				var indexId = auditSamplingItems[i].indexId;
				cellTagStart.push({
					type: 'link',
					id: id,
					text: text,
					indexId: indexId,
					linkText: 'L' + (i + 1)
				});
				cellValue = cellValue + '   ' + auditSamplingItems[i].indexId;
			}
			if (cellTagStart.length === 0){
				bdoInfoBox('提示', '请添加抽凭链接或正确设置抽凭链接属性！');
			}else{
				var mapKey = sheetIndex + ':' + row + ':' + col;
				// 该底稿单元格存在抽凭链接时，删除再添加
				// 该底稿单元格不存在抽凭链接时，添加
				if (!designer.ShowAuditSamplingCacheMap.has(mapKey)) {
					designer.ShowAuditSamplingCacheMap.set(mapKey,cellTagStart);
				} else if (designer.ShowAuditSamplingCacheMap.has(mapKey)) {
					designer.ShowAuditSamplingCacheMap.delete(mapKey);
					if (cellTagStart.length !== 0) {
						designer.ShowAuditSamplingCacheMap.set(mapKey,cellTagStart);
					}
				}
				designer.Spread.suspendPaint();
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
				designer.Spread.resumePaint();
				$('#modal_auditSampling').modal('hide');
			}
		});
		// 抽凭链接--清除
		$('#btn_auditSampling_clear').on('click', function() {
			var sheet = designer.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			var mapKey = sheetIndex + ':' + row + ':' + col;
			// 该底稿单元格存在抽凭链接时，删除再添加
			if (designer.ShowAuditSamplingCacheMap.has(mapKey)) {
				designer.ShowAuditSamplingCacheMap.delete(mapKey);
				designer.Spread.suspendPaint();
				var activeCell = sheet.getCell(row, col);
				activeCell.value('');
				// 清除单元格格式
				activeCell.cellType(void 0);
				designer.Spread.resumePaint();
			}
			$('#modal_auditSampling').modal('hide');
		});
		//选择科目
		$('#sampling_file_subjectid').focus(function() {
			$('#modal_subjectid_sampling_file').modal('show');
			if ($('#subject_tree_sampling_file').hasClass('treeview')) {
				return;
			}
			$('#subject_tree_sampling_file').tree({
				url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
				params: {
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR,
					searchInputId: 'searchInput_sampling_file'
				},
				singleSelect: true,
				lazyLoad: false,
				onceLoad: true,
				view: {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: false,
					showCheckbox: true,
					selectedColor: '',
					selectedBackColor: ''

				}
			});
		});
		$('#modal_subjectid_sure_sampling_file').click(function() {
			var selectValue = $('#subject_tree_sampling_file').tree('getTreeMultiValue');
			if (typeof(selectValue) === 'object') {
				$('#sampling_file_subjectid').val('');
			} else {
				$('#sampling_file_subjectid').val(selectValue).change();

			}
			$('#modal_subjectid_sampling_file').modal('hide');
		});
		$('#modal_subjectid_reset_sampling_file').click(function() {
			$('#subject_tree_sampling_file').tree('reset');
		});
//-----------------------------------------抽凭链接 END-----------------------------------------//

//-----------------------------------------底稿取值 START-----------------------------------------//
		// 底稿取值--显示
		$('#modal_dgFetch').on('show.bs.modal', function() {
			var _this = this;
			// 底稿输入框
			var dgFileInput = $(_this).find('.dgFileInput');
			// 底稿下拉框
			var dgFileSelect = $(_this).find('.dgFileSelect');
			// 底稿sheet下拉框
			var dgSheetSelect = $(_this).find('.dgSheetSelect');
			// 底稿单元格位置
			var dgRange = $(_this).find('.dgRange');
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
			dgFileInput.unbind('focus');
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
			dgFileInput.unbind('input');
			dgFileInput.on('input',function(){
				$('#dg-file-select').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到dgFileInput.value()的内容，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#dg-file-select').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			dgFileSelect.unbind('change');
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
			dgSheetSelect.unbind('change');
			dgSheetSelect.change(function () {
				if(this.value != ''){
					dgRange.removeAttr('disabled');
				}else{
					dgRange.attr('disabled', true);
				}
			});
			var clearDgBtn = $(_this).find('.clearDg-button');
			clearDgBtn.unbind('click');
			clearDgBtn.click(function () {
				dgFileInput.val('');
				dgFileInput.text('');
			});
			var openDgBtn = $(_this).find('.openDg-button');
			openDgBtn.unbind('click');
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
					bdoInfoBox('提示', '请选择底稿');
				}
			});
			var refreshDgBtn = $(_this).find('.refreshDg-button');
			refreshDgBtn.unbind('click');
			refreshDgBtn.click(function () {
				designer.paperArr = [];
				$.ajax({
					type : 'post',
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
					dataType : 'json',
					success(data) {
						if(data.success) {
							designer.paperArr = data.data;
							// 底稿输入框
							var dgFileInput = $(_this).find('.dgFileInput');
							dgFileInput.text('');
							// 底稿下拉框
							var dgFileSelect = $(_this).find('.dgFileSelect');
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
			
			var spread = designer.Spread;
			var sheetIndex = spread.getActiveSheetIndex();
			var sheet = spread.getActiveSheet();
			var rowIndex = sheet.getActiveRowIndex();
			var columnIndex = sheet.getActiveColumnIndex();
			// 当前sheet
			var curSheet = $(_this).find('.curSheet');
			curSheet.val(spread.getActiveSheet().name());
			curSheet.attr('disabled', true);
			// 当前位置
			var curPosition = $(_this).find('.curPosition');
			var range = new GC.Spread.Sheets.Range(rowIndex, columnIndex, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			curPosition.val(rangeStr);
			curPosition.attr('disabled', true);
			dgFileInput.val('');
			$('#dg-file-select').empty();
			$('#dg-file-select').append('<option value=""></option>');
			for(var papaerList of designer.paperArr){
				$('#dg-file-select').append("<option value='" + papaerList.autoId + ":" + papaerList.indexId + "' title='" + papaerList.fileName + "'>" + papaerList.fileName + "</option>");
			}
			dgFileSelect.val('');
			$('#dg-sheet-select').empty();
			$('#dg-sheet-select').append('<option value=""></option>');
			dgRange.attr('disabled', true);
			dgRange.val('');
			
			var mapKey = sheetIndex + ':' + rowIndex + ':' + columnIndex;
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
		});
		// 底稿取值--确定
		$('#btn_dgFetch_ensure').on('click', function() {
			// 底稿输入框
			var dgFileInput = $('#modal_dgFetch').find('.dgFileInput');
			if(dgFileInput.text() === ''){
				bdoInfoBox('提示', '请选择底稿！');
				return;
			}
			// 底稿下拉框
			var dgFileSelect = $('#modal_dgFetch').find('.dgFileSelect');
			// 底稿sheet下拉框
			var dgSheetSelect = $('#modal_dgFetch').find('.dgSheetSelect');
			if(dgSheetSelect[0].selectedIndex === 0){
				bdoInfoBox('提示', '请选择底稿Sheet！');
				return;
			}
			// 底稿单元格位置
			var dgRange = $('#modal_dgFetch').find('.dgRange');
			if(dgRange.val() === ''){
				bdoInfoBox('提示', '请输入底稿单元格位置！');
				return;
			}else{
				let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), dgRange.val(), 0, 0);
				if (range == null) {
					bdoInfoBox('提示', '底稿单元格位置单元格引用无效！');
					return;
				}
			}
			var spread = designer.Spread;
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
			$.ajax({
				url : 'dgCenter/DgWapper.fetchDgValue.json',
				type : 'post',
				data : {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: designer.dgExtraOptions.workpaperId,
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
						$('#modal_dgFetch').modal('hide');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		// 底稿取值--清除
		$('#btn_dgFetch_clear').on('click', function() {
			var sheet = designer.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			var mapKey = sheetIndex + ':' + row + ':' + col;
			// 该单元格存在底稿取值时，删除
			if (designer.DgFetchCacheMap.has(mapKey)) {
				designer.DgFetchCacheMap.delete(mapKey);
				designer.Spread.suspendPaint();
				var activeCell = sheet.getCell(row, col);
				// 清除单元格格式
				activeCell.cellType(void 0);
				designer.Spread.resumePaint();
			}
			$('#modal_dgFetch').modal('hide');
		});
//-----------------------------------------底稿取值 END-----------------------------------------//
		
//-----------------------------------------附注取值 START-----------------------------------------//
		// 附注取值--显示
		$('#modal_noteFeature').on('show.bs.modal', function() {
			var _this = this;
			// 底稿输入框
			var dgFileInput = $(_this).find('.dgFileInputNote');
			// 底稿下拉框
			var dgFileSelect = $(_this).find('.dgFileSelectNote');
			// 底稿sheet下拉框
			var dgSheetSelect = $(_this).find('.dgSheetSelectNote');
			// 底稿区域起始位置
			var dgRangeStart = $(_this).find('.dgRangeStartNote');
			// 底稿区域结束位置
			var dgRangeEnd = $(_this).find('.dgRangeEndNote');
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'dg-file-input-note' || elem.id == 'dg-file-select-note')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#dg-file-select-note').css('display', 'none'); //点击的不是div或其子元素
			});
			dgFileInput.unbind('focus');
			dgFileInput.on('focus',function(){
				$('#dg-file-select-note').css('display', 'block');
				$('#dg-file-select-note').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到dgFileInput.value()的内容的，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#dg-file-select-note').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			dgFileInput.unbind('input');
			dgFileInput.on('input',function(){
				$('#dg-file-select-note').empty();
				for(var i=0; i < designer.paperArr.length; i++){
					//若找到dgFileInput.value()的内容的，添option
					if (designer.paperArr[i].fileName.indexOf(this.value) != -1) {
						$('#dg-file-select-note').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
					}
				}
			});
			dgFileSelect.unbind('change');
			dgFileSelect.change(function () {
				dgFileInput.val(dgFileSelect[0].selectedOptions[0].text);
				dgFileInput.text(dgFileSelect[0].selectedOptions[0].value);
				$('#dg-file-select-note').css('display', 'none');
				if(this.value != ''){
					setDgSheet(this.value, 'dg-sheet-select-note');
				}else{
					dgSheetSelect.val('');
				}
				dgRangeStart.val('');
				dgRangeEnd.val('');
				dgRangeStart.attr('disabled', true);
				dgRangeEnd.attr('disabled', true);
			});
			dgSheetSelect.unbind('change');
			dgSheetSelect.change(function () {
				if(this.value != ''){
					dgRangeStart.removeAttr('disabled');
					dgRangeEnd.removeAttr('disabled');
				}else{
					dgRangeStart.attr('disabled', true);
					dgRangeEnd.attr('disabled', true);
				}
			});
			var clearDgBtn = $(_this).find('.clearDg-button-note');
			clearDgBtn.unbind('click');
			clearDgBtn.click(function () {
				dgFileInput.val('');
				dgFileInput.text('');
			});
			var openDgBtn = $(_this).find('.openDg-button-note');
			openDgBtn.unbind('click');
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
					bdoInfoBox('提示', '请选择底稿');
				}
			});
			var refreshDgBtn = $(_this).find('.refreshDg-button-note');
			refreshDgBtn.unbind('click');
			refreshDgBtn.click(function () {
				designer.paperArr = [];
				$.ajax({
					type : 'post',
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
					dataType : 'json',
					success(data) {
						if(data.success) {
							designer.paperArr = data.data;
							// 底稿输入框
							var dgFileInput = $(_this).find('.dgFileInputNote');
							dgFileInput.text('');
							// 底稿下拉框
							var dgFileSelect = $(_this).find('.dgFileSelectNote');
							$('#dg-file-select-note').empty();
							$('#dg-file-select-note').append('<option value=""></option>');
							for (var i = 0; i < designer.paperArr.length; i++) {
								$('#dg-file-select-note').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
							}
							dgFileSelect.val('');
						}
					}
				});
			});
			dgRangeStart.unbind('keyup');
			dgRangeStart.on('keyup',function(){
				dgRangeEnd.val(dgRangeStart.val().toUpperCase());
			});
			var spread = designer.Spread;
			var sheetIndex = spread.getActiveSheetIndex();
			var sheet = spread.getActiveSheet();
			var rowIndex = sheet.getActiveRowIndex();
			var columnIndex = sheet.getActiveColumnIndex();
			// 当前sheet
			var curSheet = $(_this).find('.curSheetNote');
			curSheet.val(spread.getActiveSheet().name());
			curSheet.attr('disabled', true);
			// 当前位置
			var curPosition = $(_this).find('.curPositionNote');
			var range = new GC.Spread.Sheets.Range(rowIndex, columnIndex, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			curPosition.val(rangeStr);
			curPosition.attr('disabled', true);
			dgFileInput.val('');
			dgFileInput.text('');
			$('#dg-file-select-note').empty();
			$('#dg-file-select-note').append('<option value=""></option>');
			for (var i = 0; i < designer.paperArr.length; i++) {
				$('#dg-file-select-note').append("<option value='" + designer.paperArr[i].autoId + ":" + designer.paperArr[i].indexId + "' title='" + designer.paperArr[i].fileName + "'>" + designer.paperArr[i].fileName + "</option>");
			}
			dgFileSelect.val('');
			$('#dg-sheet-select-note').empty();
			$('#dg-sheet-select-note').append('<option value=""></option>');
			dgRangeStart.attr('disabled', true);
			dgRangeStart.val('');
			dgRangeEnd.attr('disabled', true);
			dgRangeEnd.val('');
			
			var mapKey = sheetIndex + ':' + rowIndex + ':' + columnIndex;
			if (designer.NoteCacheMap.has(mapKey)) {
				var dataMap = designer.NoteCacheMap.get(mapKey)[0];
				dgFileInput.val(dataMap.dgFileInputVal);
				dgFileInput.text(dataMap.dgFileInputText);
				dgFileSelect.val(dataMap.dgFileSelectVal);
				setDgSheet(dataMap.dgFileSelectVal, 'dg-sheet-select-note');
				dgSheetSelect.val(dataMap.dgSheetSelectVal);
				dgRangeStart.val(dataMap.dgRangeStart);
				dgRangeEnd.val(dataMap.dgRangeEnd);
				
				dgFileInput.removeAttr('disabled');
				dgRangeStart.removeAttr('disabled');
				dgRangeEnd.removeAttr('disabled');
			}
		});
		// 附注取值--确定
		$('#btn_noteFeature_ensure').on('click', function() {
			// 底稿输入框
			var dgFileInput = $('#modal_noteFeature').find('.dgFileInputNote');
			if(dgFileInput.text() === ''){
				bdoInfoBox('提示', '请选择底稿！');
				return;
			}
			// 底稿下拉框
			var dgFileSelect = $('#modal_noteFeature').find('.dgFileSelectNote');
			// 底稿sheet下拉框
			var dgSheetSelect = $('#modal_noteFeature').find('.dgSheetSelectNote');
			if(dgSheetSelect[0].selectedIndex === 0){
				bdoInfoBox('提示', '请选择底稿Sheet！');
				return;
			}
			// 底稿区域起始位置
			var dgRangeStart = $('#modal_noteFeature').find('.dgRangeStartNote');
			if(dgRangeStart.val() === ''){
				bdoInfoBox('提示', '请输入底稿起始位置！');
				return;
			}else{
				let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), dgRangeStart.val(), 0, 0);
				if (range == null) {
					bdoInfoBox('提示', '底稿起始位置单元格引用无效！');
					return;
				}
			}
			// 底稿区域结束位置
			var dgRangeEnd = $('#modal_noteFeature').find('.dgRangeEndNote');
			if(dgRangeEnd.val() === ''){
				bdoInfoBox('提示', '请输入底稿结束位置！');
				return;
			}else{
				let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), dgRangeEnd.val(), 0, 0);
				if (range == null) {
					bdoInfoBox('提示', '底稿结束位置单元格引用无效！');
					return;
				}
			}
			var spread = designer.Spread;
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
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00092',
					param1: designer.noteExtraOptions.autoId,
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data[0].isFinished == '1'){
							bdoErrorBox('失败', '已完成的附注不能再编辑');
						}else{
							$.ajax({
							url : 'dgCenter/DgNote.noteDgValue.json',
							type : 'post',
							data : {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
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
									$('#modal_noteFeature').modal('hide');
								}else{
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		// 附注取值--清除
		$('#btn_noteFeature_clear').on('click', function() {
			var sheet = designer.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			var mapKey = sheetIndex + ':' + row + ':' + col;
			// 该附注单元格存在底稿取值链接时，删除
			if (designer.NoteCacheMap.has(mapKey)) {
				designer.NoteCacheMap.delete(mapKey);
				designer.Spread.suspendPaint();
				var activeCell = sheet.getCell(row, col);
				// 清除单元格格式
				activeCell.cellType(void 0);
				designer.Spread.resumePaint();
			}
			$('#modal_noteFeature').modal('hide');
		});
//-----------------------------------------附注取值 END-----------------------------------------//

//-----------------------------------------数据取值 START-----------------------------------------//
		function setReportList_cashflow(){
			$('#report-list-cashflow').empty();
			for(let dataList of designer.reportArr){
				if(dataList.tableDiv != 4){
					$('#report-list-cashflow').append("<option value='" + dataList.colCode + "' title='" + dataList.colDisp.trim() + "'>" + dataList.colCode + '-' + dataList.colDisp.trim() + "</option>");
				}
			}
		}

		function setDgList_cashflow(){
			$('#dg-list-cashflow').empty();
			for(let dataList of designer.paperArr){
				$('#dg-list-cashflow').append("<option value='" + dataList.autoId + ':' + dataList.indexId + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
			}
			$('#dg-sheet-cashflow').empty();
			$('#dg-sheet-cashflow').append('<option value=""></option>');
		}

		function setNoteList_cashflow(){
			$('#note-list-cashflow').empty();
			for(let dataList of designer.noteArr){
				$('#note-list-cashflow').append("<option value='" + dataList.autoId + ':' + dataList.noteNo + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
			}
			$('#note-sheet-cashflow').empty();
			$('#note-sheet-cashflow').append('<option value=""></option>');
		}

		function setStyle_1_cashflow(_this){
			$('input[name=indexTypeCashflow]').get(0).checked = true;
			// 报表科目下拉框
			var reportList = $(_this).find('.reportListCashflow');
			// 报表科目输入框
			var reportListText = $(_this).find('.reportListTextCashflow');
			// 报表科目名称
			var reportDispInput = $(_this).find('.reportDispInputCashflow');
			// 底稿下拉框
			var dgList = $(_this).find('.dgListCashflow');
			// 底稿输入框
			var dgListText = $(_this).find('.dgListTextCashflow');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheetCashflow');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInputCashflow');
			// 附注下拉框
			var noteList = $(_this).find('.noteListCashflow');
			// 附注输入框
			var noteListText = $(_this).find('.noteListTextCashflow');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheetCashflow');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInputCashflow');
			// 打开底稿
			var openDgBtn = $(_this).find('.openDg-button-cashflow');
			// 刷新底稿
			var refreshDgBtn = $(_this).find('.refreshDg-button-cashflow');
			// 打开附注
			var openNoteBtn = $(_this).find('.openNote-button-cashflow');
			// 刷新附注
			var refreshNoteBtn = $(_this).find('.refreshNote-button-cashflow');
			
			reportListText.removeAttr('disabled');
			$("input[name='reportValueTypeCashflow']").removeAttr('disabled');
			dgListText.attr('disabled', true);
			dgSheet.attr('disabled', true);
			dgCellInput.attr('disabled', true);
			noteListText.attr('disabled', true);
			noteSheet.attr('disabled', true);
			noteCellInput.attr('disabled', true);
			openDgBtn.attr('disabled', true);
			refreshDgBtn.attr('disabled', true);
			openNoteBtn.attr('disabled', true);
			refreshNoteBtn.attr('disabled', true);
			
			reportList.get(0).selectedIndex = 0;
			reportListText.val($(reportList).find('option:selected')[0].text);
			reportDispInput.val($(reportList).find('option:selected')[0].title);
			$("input[name='reportValueTypeCashflow']").get(0).checked = true;
			dgListText.val('');
			dgList.get(0).selectedIndex = 0;
			dgCellInput.val('');
			noteListText.val('');
			noteList.get(0).selectedIndex = 0;
			noteCellInput.val('');
		}

		function setStyle_2_cashflow(_this){
			$('input[name=indexTypeCashflow]').get(1).checked = true;
			// 报表科目下拉框
			var reportList = $(_this).find('.reportListCashflow');
			// 报表科目输入框
			var reportListText = $(_this).find('.reportListTextCashflow');
			// 报表科目名称
			var reportDispInput = $(_this).find('.reportDispInputCashflow');
			// 底稿下拉框
			var dgList = $(_this).find('.dgListCashflow');
			// 底稿输入框
			var dgListText = $(_this).find('.dgListTextCashflow');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheetCashflow');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInputCashflow');
			// 附注下拉框
			var noteList = $(_this).find('.noteListCashflow');
			// 附注输入框
			var noteListText = $(_this).find('.noteListTextCashflow');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheetCashflow');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInputCashflow');
			// 打开底稿
			var openDgBtn = $(_this).find('.openDg-button-cashflow');
			// 刷新底稿
			var refreshDgBtn = $(_this).find('.refreshDg-button-cashflow');
			// 打开附注
			var openNoteBtn = $(_this).find('.openNote-button-cashflow');
			// 刷新附注
			var refreshNoteBtn = $(_this).find('.refreshNote-button-cashflow');
			
			reportListText.attr('disabled', true);
			$("input[name='reportValueTypeCashflow']").attr('disabled', true);
			dgListText.removeAttr('disabled');
			dgSheet.removeAttr('disabled');
			dgCellInput.removeAttr('disabled');
			openDgBtn.removeAttr('disabled');
			refreshDgBtn.removeAttr('disabled');
			noteListText.attr('disabled', true);
			noteSheet.attr('disabled', true);
			noteCellInput.attr('disabled', true);
			openNoteBtn.attr('disabled', true);
			refreshNoteBtn.attr('disabled', true);
			
			reportList.get(0).selectedIndex = 0;
			reportListText.val($(reportList).find('option:selected')[0].text);
			reportDispInput.val($(reportList).find('option:selected')[0].title);
			$("input[name='reportValueTypeCashflow']").get(0).checked = true;
			noteListText.val('');
			noteList.get(0).selectedIndex = 0;
			noteCellInput.val('');
		}

		function setStyle_3_cashflow(_this){
			$('input[name=indexTypeCashflow]').get(2).checked = true;
			// 报表科目下拉框
			var reportList = $(_this).find('.reportListCashflow');
			// 报表科目输入框
			var reportListText = $(_this).find('.reportListTextCashflow');
			// 报表科目名称
			var reportDispInput = $(_this).find('.reportDispInputCashflow');
			// 底稿下拉框
			var dgList = $(_this).find('.dgListCashflow');
			// 底稿输入框
			var dgListText = $(_this).find('.dgListTextCashflow');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheetCashflow');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInputCashflow');
			// 附注下拉框
			var noteList = $(_this).find('.noteListCashflow');
			// 附注输入框
			var noteListText = $(_this).find('.noteListTextCashflow');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheetCashflow');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInputCashflow');
			// 打开底稿
			var openDgBtn = $(_this).find('.openDg-button-cashflow');
			// 刷新底稿
			var refreshDgBtn = $(_this).find('.refreshDg-button-cashflow');
			// 打开附注
			var openNoteBtn = $(_this).find('.openNote-button-cashflow');
			// 刷新附注
			var refreshNoteBtn = $(_this).find('.refreshNote-button-cashflow');
			
			reportListText.attr('disabled', true);
			$("input[name='reportValueTypeCashflow']").attr('disabled', true);
			dgListText.attr('disabled', true);
			dgSheet.attr('disabled', true);
			dgCellInput.attr('disabled', true);
			openDgBtn.attr('disabled', true);
			refreshDgBtn.attr('disabled', true);
			noteListText.removeAttr('disabled');
			noteSheet.removeAttr('disabled');
			noteCellInput.removeAttr('disabled');
			openNoteBtn.removeAttr('disabled');
			refreshNoteBtn.removeAttr('disabled');
			
			reportList.get(0).selectedIndex = 0;
			reportListText.val($(reportList).find('option:selected')[0].text);
			reportDispInput.val($(reportList).find('option:selected')[0].title);
			$("input[name='reportValueTypeCashflow']").get(0).checked = true;
			dgListText.val('');
			dgList.get(0).selectedIndex = 0;
			dgCellInput.val('');
		}

		function setCellTagStart_cashflow(_this){
			// radioButton 1--报表 2--底稿 3--附注
			var indexType= $(_this).find('input[name=indexTypeCashflow]:checked').val();
			var cellTagStart = [];
			if(indexType == 1){
				// 报表科目
				var reportCode = $(_this).find('.reportListCashflow').val();
				// 报表科目名称
				var reportDisp = $(_this).find('.reportDispInputCashflow').val();
				// 报表本期或上期审定数
				var reportValueType = $(_this).find('input[name=reportValueTypeCashflow]:checked').val();
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
				var dgList = $(_this).find('.dgListCashflow');
				// 底稿sheet
				var dgSheet = $(_this).find('.dgSheetCashflow');
				// 底稿单元格
				var dgCellInput = $(_this).find('.dgCellInputCashflow');
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
				var noteList = $(_this).find('.noteListCashflow');
				// 底稿sheet
				var noteSheet = $(_this).find('.noteSheetCashflow');
				// 底稿单元格
				var noteCellInput = $(_this).find('.noteCellInputCashflow');
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
		// 数据取值--显示
		$('#modal_cashflowFeature').on('show.bs.modal', function() {
			var _this = this;
			// 报表科目下拉框
			var reportList = $(_this).find('.reportListCashflow');
			// 报表科目输入框
			var reportListText = $(_this).find('.reportListTextCashflow');
			// 报表科目名称
			var reportDispInput = $(_this).find('.reportDispInputCashflow');
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'report-list-text-cashflow' || elem.id == 'report-list-text-cashflow')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#report-list-cashflow').css('display', 'none');
			});
			reportListText.unbind('focus');
			reportListText.on('focus',function(){
				$('#report-list-cashflow').css('display', 'block');
				$('#report-list-cashflow').empty();
				for(var dataList of designer.reportArr){
					if(dataList.tableDiv != 4){
						var text = dataList.colCode + '-' + dataList.colDisp.trim();
						if (text.indexOf(this.value) > -1) {
							$('#report-list-cashflow').append("<option value='" + dataList.colCode + "' title='" + dataList.colDisp.trim() + "'>" + dataList.colCode + '-' + dataList.colDisp.trim() + "</option>");
						}
					}
				}
			});
			reportListText.unbind('input');
			reportListText.on('input',function(){
				$('#report-list-cashflow').empty();
				for(var dataList of designer.reportArr){
					if(dataList.tableDiv != 4){
						var text = dataList.colCode + '-' + dataList.colDisp.trim();
						if (text.indexOf(this.value) > -1) {
							$('#report-list-cashflow').append("<option value='" + dataList.colCode + "' title='" + dataList.colDisp.trim() + "'>" + dataList.colCode + '-' + dataList.colDisp.trim() + "</option>");
						}
					}
				}
			});
			reportList.unbind('change');
			reportList.change(function () {
				if(this.value != ''){
					reportListText.val($(this).find('option:selected').text());
					reportDispInput.val($(this).find('option:selected').attr('title'));
				}else{
					reportListText.val('');
					reportDispInput.val('');
				}
			});
			// 底稿下拉框
			var dgList = $(_this).find('.dgListCashflow');
			// 底稿输入框
			var dgListText = $(_this).find('.dgListTextCashflow');
			// 底稿sheet
			var dgSheet = $(_this).find('.dgSheetCashflow');
			// 底稿单元格
			var dgCellInput = $(_this).find('.dgCellInputCashflow');
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'dg-list-text-cashflow' || elem.id == 'dg-list-text-cashflow')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#dg-list-cashflow').css('display', 'none');
			});
			dgListText.unbind('focus');
			dgListText.on('focus',function(){
				$('#dg-list-cashflow').css('display', 'block');
				$('#dg-list-cashflow').empty();
				for(let dataList of designer.paperArr){
					if (dataList.fileName.indexOf(this.value) > -1) {
						$('#dg-list-cashflow').append("<option value='" + dataList.autoId + ':' + dataList.indexId + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
					}
				}
				$('#dg-sheet-cashflow').empty();
				$('#dg-sheet-cashflow').append('<option value=""></option>');
			});
			dgListText.unbind('input');
			dgListText.on('input',function(){
				$('#dg-list-cashflow').empty();
				for(let dataList of designer.paperArr){
					if (dataList.fileName.indexOf(this.value) > -1) {
						$('#dg-list-cashflow').append("<option value='" + dataList.autoId + ':' + dataList.indexId + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
					}
				}
				$('#dg-sheet-cashflow').empty();
				$('#dg-sheet-cashflow').append('<option value=""></option>');
			});
			dgList.unbind('change');
			dgList.change(function () {
				if(this.value != ''){
					dgListText.val($(this).find('option:selected').text());
					setDgSheet(this.value, 'dg-sheet-cashflow');
					dgSheet.removeAttr('disabled');
				}else{
					dgSheet.val('');
					dgSheet.attr('disabled', true);
					dgCellInput.val('');
					dgCellInput.attr('disabled', true);
				}
			});
			dgSheet.unbind('change');
			dgSheet.change(function () {
				if(this.value != ''){
					dgCellInput.removeAttr('disabled');
				}else{
					dgCellInput.val('');
					dgCellInput.attr('disabled', true);
				}
			});
			// 附注下拉框
			var noteList = $(_this).find('.noteListCashflow');
			// 附注输入框
			var noteListText = $(_this).find('.noteListTextCashflow');
			// 附注sheet
			var noteSheet = $(_this).find('.noteSheetCashflow');
			// 附注单元格
			var noteCellInput = $(_this).find('.noteCellInputCashflow');
			$(document).bind('click', function(e) {
				var e = e || window.event; //浏览器兼容性
				var elem = e.target || e.srcElement;
				while (elem) { //循环判断至跟节点，防止点击的是div子元素
					if (elem.id && (elem.id == 'note-list-text-cashflow' || elem.id == 'note-list-text-cashflow')) {
						return;
					}
					elem = elem.parentNode;
				}
				$('#note-list-cashflow').css('display', 'none');
			});
			noteListText.unbind('focus');
			noteListText.on('focus',function(){
				$('#note-list-cashflow').css('display', 'block');
				$('#note-list-cashflow').empty();
				for(let dataList of designer.noteArr){
					if (dataList.fileName.indexOf(this.value) > -1) {
						$('#note-list-cashflow').append("<option value='" + dataList.autoId + ':' + dataList.noteNo + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
					}
				}
				$('#note-sheet-cashflow').empty();
				$('#note-sheet-cashflow').append('<option value=""></option>');
			});
			noteListText.unbind('input');
			noteListText.on('input',function(){
				$('#note-list-cashflow').empty();
				for(let dataList of designer.noteArr){
					if (dataList.fileName.indexOf(this.value) > -1) {
						$('#note-list-cashflow').append("<option value='" + dataList.autoId + ':' + dataList.noteNo + "' title='" + dataList.fileName + "'>" + dataList.fileName + "</option>");
					}
				}
				$('#note-sheet-cashflow').empty();
				$('#note-sheet-cashflow').append('<option value=""></option>');
			});
			noteList.unbind('change');
			noteList.change(function () {
				if(this.value != ''){
					noteListText.val($(this).find('option:selected').text());
					setNoteSheet(this.value, 'note-sheet-cashflow');
					noteSheet.removeAttr('disabled');
				}else{
					noteSheet.val('');
					noteSheet.attr('disabled', true);
					noteCellInput.val('');
					noteCellInput.attr('disabled', true);
				}
			});
			noteSheet.unbind('change');
			noteSheet.change(function () {
				if(this.value != ''){
					noteCellInput.removeAttr('disabled');
				}else{
					noteCellInput.val('');
					noteCellInput.attr('disabled', true);
				}
			});
			// 打开底稿
			var openDgBtn = $(_this).find('.openDg-button-cashflow');
			// 打开附注
			var openNoteBtn = $(_this).find('.openNote-button-cashflow');
			openDgBtn.unbind('click');
			openDgBtn.click(function () {
				// 底稿
				var dgList = $(_this).find('.dgListCashflow');
				if(dgList.val() !== ''){
					var dgFileId = dgList.val().substring(0, dgList.val().indexOf(':'));
					var dgFileIndexId = dgList.val().substring(dgList.val().indexOf(':') + 1);
					var dgFileName = dgList.find('option:selected').text().substring(0, dgList.find('option:selected').text().lastIndexOf('.'));
					openDgFile(dgFileId, dgFileIndexId, dgFileName);
				}else{
					bdoInfoBox('提示', '请选择底稿');
				}
			});
			openNoteBtn.unbind('click');
			openNoteBtn.click(function () {
				// 附注
				var noteList = $(_this).find('.noteListCashflow');
				if(noteList.val() != null && noteList.val() !== ''){
					var dgFileId = noteList.val().substring(0, noteList.val().indexOf(':'));
					var dgFileIndexId = noteList.val().substring(noteList.val().indexOf(':') + 1);
					var dgFileName = noteList.find('option:selected').text().substring(0, noteList.find('option:selected').text().lastIndexOf('.'));
					openNoteFile(dgFileId, dgFileIndexId, dgFileName);
				}else{
					bdoInfoBox('提示', '请选择附注');
				}
			});
			// radioButton 1--报表 2--底稿 3--附注
			var indexType = $(_this).find('input[name=indexTypeCashflow]');
			indexType.unbind('change');
			indexType.change(function () {
				if(this.value === '1'){
					setStyle_1_cashflow(_this);
				}else if(this.value === '2'){
					setStyle_2_cashflow(_this);
				}else if(this.value === '3'){
					setStyle_3_cashflow(_this);
				}
			});
			// 刷新底稿
			var refreshDgBtn = $(_this).find('.refreshDg-button-cashflow');
			// 刷新附注
			var refreshNoteBtn = $(_this).find('.refreshNote-button-cashflow');
			refreshDgBtn.unbind('click');
			refreshDgBtn.click(function () {
				designer.paperArr = [];
				$.ajax({
					type : 'post',
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
					dataType : 'json',
					success(data) {
						if(data.success) {
							designer.paperArr = data.data;
							// 设置底稿下拉框
							setDgList_cashflow();
							if(data.data[0].autoId != null && data.data[0].autoId != ''){
								dgSheet.removeAttr('disabled');
								setDgSheet(data.data[0].autoId + ':' + data.data[0].indexId, 'dg-sheet-cashflow');
							}
						}
					}
				});
			});
			refreshNoteBtn.unbind('click');
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
							setNoteList_cashflow();
							if(data.data[0].autoId != null && data.data[0].autoId != ''){
								noteSheet.removeAttr('disabled');
								setNoteSheet(data.data[0].autoId + ':' + data.data[0].noteNo, 'note-sheet-cashflow');
							}
						}
					}
				});
			});
			
			// 设置报表下拉框
			setReportList_cashflow();
			// 设置底稿下拉框
			setDgList_cashflow();
			// 设置附注下拉框
			setNoteList_cashflow();
			var spread = designer.Spread;
			var sheetIndex = spread.getActiveSheetIndex();
			var sheet = spread.getActiveSheet();
			var rowIndex = sheet.getActiveRowIndex();
			var columnIndex = sheet.getActiveColumnIndex();
			// 当前sheet
			var curSheet = $(_this).find('.curSheetCashflow');
			curSheet.val(spread.getActiveSheet().name());
			curSheet.attr('disabled', true);
			// 当前位置
			var curPosition = $(_this).find('.curPositionCashflow');
			var range = new GC.Spread.Sheets.Range(rowIndex, columnIndex, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			curPosition.val(rangeStr);
			curPosition.attr('disabled', true);
			var currentCell = sheet.getCell(rowIndex, columnIndex);
			// 当前单元格单元格类型
			var currentCellType = currentCell.cellType();
			var _cellType;
			if (currentCellType && currentCellType.typeName == 'ShowCashFlowInfo') {
				_cellType = currentCellType;
			} else {
				_cellType = new designer.ShowCashFlowInfo();
			}
			if (_cellType._cellTagStartCache != undefined && _cellType._cellTagStartCache.length > 0) {
				var cellTagStartCache = _cellType._cellTagStartCache[0];
				if(cellTagStartCache){
					if(cellTagStartCache.indexType == 1){
						setStyle_1_cashflow(_this);
						reportList.val(cellTagStartCache.reportCode);
						reportDispInput.val(cellTagStartCache.reportDisp);
						$('input[name=reportValueTypeCashflow]').get(parseInt(cellTagStartCache.reportValueType) - 1).checked = true;
					}else if(cellTagStartCache.indexType == 2){
						setStyle_2_cashflow(_this);
						dgList.val(cellTagStartCache.paperId + ':' + cellTagStartCache.paperIndexId);
						dgListText.val(cellTagStartCache.paperName);
						setDgSheet(dgList.val(), 'dg-sheet-cashflow');
						dgSheet.val(cellTagStartCache.sheetIndex);
						dgCellInput.val(cellTagStartCache.rangeStr);
						dgSheet.removeAttr('disabled');
						dgCellInput.removeAttr('disabled');
					}else if(cellTagStartCache.indexType == 3){
						setStyle_3_cashflow(_this);
						noteList.val(cellTagStartCache.paperId + ':' + cellTagStartCache.paperIndexId);
						noteListText.val(cellTagStartCache.paperName);
						setNoteSheet(noteList.val(), 'note-sheet-cashflow');
						noteSheet.val(cellTagStartCache.sheetIndex);
						noteCellInput.val(cellTagStartCache.rangeStr);
						noteSheet.removeAttr('disabled');
						noteCellInput.removeAttr('disabled');
					}
				}
			}else{
				setStyle_1_cashflow(_this);
			}
		});
		// 数据取值--确定
		$('#btn_cashflowFeature_ensure').on('click', function() {
			var _this = $('#modal_cashflowFeature');
			// radioButton 1--报表 2--底稿 3--附注
			var indexType= $(_this).find('input[name=indexTypeCashflow]:checked').val();
			var isError = false;
			if(indexType == 2){
				// 底稿sheet
				var dgSheet = $(_this).find('.dgSheetCashflow');
				// 底稿单元格
				var dgCellInput = $(_this).find('.dgCellInputCashflow');
				if(dgSheet.val() == '' || dgCellInput.val() == ''){
					isError = true;
				}
			}else if(indexType == 3){
				// 附注sheet
				var noteSheet = $(_this).find('.noteSheetCashflow');
				// 附注单元格
				var noteCellInput = $(_this).find('.noteCellInputCashflow');
				if(noteSheet.val() == '' || noteCellInput.val() == ''){
					isError = true;
				}
			}
			if(isError){
				bdoInfoBox('提示', '选项不能为空！');
				return;
			}
			var cellTagStart = setCellTagStart_cashflow(_this);
			
			var spread = designer.Spread;
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
			$.ajax({
				url : 'dgCenter/DgAuditFile.initCellTagStart.json',
				type : 'post',
				data : {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
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
						$('#modal_cashflowFeature').modal('hide');
						bdoSuccessBox('成功', '设置成功！');
					}else{
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
		// 数据取值--清除
		$('#btn_cashflowFeature_clear').on('click', function() {
			var sheet = designer.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var sheetIndex = designer.Spread.getActiveSheetIndex();
			var mapKey = sheetIndex + ':' + row + ':' + col;
			// 该附注单元格存在底稿取值链接时，删除
			if (designer.CashFlowCacheMap.has(mapKey)) {
				designer.CashFlowCacheMap.delete(mapKey);
				designer.Spread.suspendPaint();
				var activeCell = sheet.getCell(row, col);
				// 清除单元格格式
				activeCell.cellType(void 0);
				designer.Spread.resumePaint();
			}
			$('#modal_cashflowFeature').modal('hide');
		});
//-----------------------------------------数据取值 END-----------------------------------------//

//-----------------------------------------合并自定义标签 START-----------------------------------------//
		// 合并自定义标签--显示
		$('#modal_customTagMerge').on('show.bs.modal', function() {
			var _this = this;
			var sheetName = designer.Spread.getActiveSheet().name();
			var row = designer.Spread.getActiveSheet().getActiveRowIndex();
			if (isNaN(row)){
				bdoInfoBox('失败', '未选择单元格！');
				$('#modal_customTagMerge').modal('hide');
			}
			var col = designer.Spread.getActiveSheet().getActiveColumnIndex();
			var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
			var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
			// 单元格位置
			var cellPosition = $(_this).find('.cellPositionMerge');
			if(designer.paperType == 'mergeNote'){
				cellPosition.val(designer.notePaperId + ':' + sheetName + ':' + rangeStr);
			}else if(designer.paperType = 'mergeDg'){
				cellPosition.val(designer.workpaperId + ':' + sheetName + ':' + rangeStr);
			}
			cellPosition.attr('title', cellPosition.val());
			$(_this).find('.cellAliasMerge').val('');
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
					param4: $(_this).find('.cellPositionMerge').val(),
					start: -1,
					limit: -1
				},
				dataType : 'json',
				success(data) {
					if(data.success && data.data.length !== 0) {
						// 标签名
						$(_this).find('.cellAliasMerge').val(data.data[0].tagName);
					}
				}
			});
		});
		// 合并自定义标签--确定
		$('#btn_customTagMerge_ensure').on('click', function() {
			var sheet = designer.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			var cellValue = '';
			if(sheet.getValue(row,col) != null) {
				cellValue = sheet.getValue(row,col);
			}
			if(cellValue == null || cellValue == ''){
				cellValue = 0;
			}
			var customAlias = $('#modal_customTagMerge').find('.cellAliasMerge').val();
			if(customAlias.indexOf('+') != -1 
					|| customAlias.indexOf('-') != -1
					|| customAlias.indexOf('=') != -1){
				bdoInfoBox('提示', '标签名不能含有+、-、=');
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
					tagPosition: $('#modal_customTagMerge').find('.cellPositionMerge').val()
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
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: designer.noteExtraOptions.customerId,
					param2: designer.noteExtraOptions.projectId,
					param3: $('#modal_customTagMerge').find('.cellAliasMerge').val(),
					param4: cellValue,
					param5: $('#modal_customTagMerge').find('.cellPositionMerge').val(),
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
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#modal_customTagMerge').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
//-----------------------------------------合并自定义标签 END-----------------------------------------//
	};

	/**
	 * 挂载
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);
		listener();
	};
	
	mount();
};

var designerConfig = JSON.parse(JSON.stringify(GC.Spread.Sheets.Designer.DefaultConfig));
// 新增菜单栏
var bdoRibbon = {
	'id': 'bdo',
	'text': '立信',
	'buttonGroups': []
};
// 新增菜单栏控件
var ribbonFileCommands = {
	'setIdentifier_1': {
		text: '^',
		title: '竖加正确',
		commandName: 'setIdentifier_1',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('^').foreColor('red');
		}
	},
	'setIdentifier_2': {
		text: '<或X',
		title: '横加正确',
		commandName: 'setIdentifier_2',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('<或X').foreColor('red');
		}
	},
	'setIdentifier_3': {
		text: 'C/￠',
		title: '已发询证函/已收回询证函',
		commandName: 'setIdentifier_3',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('C/￠').foreColor('red');
		}
	},
	'setIdentifier_4': {
		text: '^ Report',
		title: '期初余额与上年审定数一致',
		commandName: 'setIdentifier_4',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('^ Report').foreColor('red');
		}
	},
	'setIdentifier_5': {
		text: 'TB',
		title: '与试算平衡表一致',
		commandName: 'setIdentifier_5',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('TB').foreColor('red');
		}
	},
	'setIdentifier_6': {
		text: 'B/S',
		title: '与资产负债一致',
		commandName: 'setIdentifier_6',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('B/S').foreColor('red');
		}
	},
	'setIdentifier_7': {
		text: 'P/L',
		title: '与利润表一致',
		commandName: 'setIdentifier_7',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('P/L').foreColor('red');
		}
	},
	'setIdentifier_8': {
		text: 'S/S',
		title: '问题事后得到解决',
		commandName: 'setIdentifier_8',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('S/S').foreColor('red');
		}
	},
	'setIdentifier_9': {
		text: 'S/L',
		title: '根据明细分类帐',
		commandName: 'setIdentifier_9',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('S/L').foreColor('red');
		}
	},
	'setIdentifier_10': {
		text: 'G/L',
		title: '根据总分类帐',
		commandName: 'setIdentifier_10',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('G/L').foreColor('red');
		}
	},
	'setIdentifier_11': {
		text: 'V',
		title: '追查至...原始凭证',
		commandName: 'setIdentifier_11',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('V').foreColor('red');
		}
	},
	'setIdentifier_12': {
		text: 'PAJE',
		title: '对损益有影响的调整',
		commandName: 'setIdentifier_12',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('PAJE').foreColor('red');
		}
	},
	'setIdentifier_13': {
		text: 'PRJE',
		title: '对损益无影响的调整',
		commandName: 'setIdentifier_13',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('PRJE').foreColor('red');
		}
	},
	'setIdentifier_14': {
		text: 'N/A',
		title: '不适用',
		commandName: 'setIdentifier_14',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var row = sheet.getActiveRowIndex();
			var col = sheet.getActiveColumnIndex();
			sheet.getCell(row, col).text('N/A').foreColor('red');
		}
	},
	'customlabel': {
		iconClass: 'ribbon-customlabel',
		text: '标签',
		title: '自定义标签',
		commandName: 'customlabel',
		execute: (context) => {
			$('#modal_customTag').modal('show');
		}
	},
	'customlabelMerge': {
		iconClass: 'ribbon-customlabel',
		text: '标签',
		title: '自定义标签',
		commandName: 'customlabelMerge',
		execute: (context) => {
			$('#modal_customTagMerge').modal('show');
		}
	},
	'mutualIndex': {
		iconClass: 'ribbon-mutualIndex',
		text: '交叉索引',
		title: '交叉索引',
		commandName: 'mutualIndex',
		execute: (context) => {
			$('#modal_mutualIndex').modal('show');
		}
	},
	'auditSampling': {
		iconClass: 'ribbon-auditsampling',
		text: '抽凭链接',
		title: '抽凭链接',
		commandName: 'auditSampling',
		execute: (context) => {
			$('#modal_auditSampling').modal('show');
		}
	},
	'billReceive': {
		iconClass: 'ribbon-billreceive',
		text: '监盘系统',
		title: '监盘系统',
		commandName: 'billReceive',
		execute: (context) => {
			var name = context.Spread.getActiveSheet().name();
			if(name == '封面'){
				bdoInfoBox('提示', '请勿在"封面"工作表使用应收票据功能！');
			}else{
				$('#isReceivable').val(0);
				$('#modal_bill_receive').modal('show');
			}
		}
	},
	'singleLink': {
		iconClass: 'ribbon-singleLink',
		text: '单向链接',
		title: '单向链接',
		commandName: 'singleLink',
		execute: (context) => {
			$('#modal_singleLink').modal('show');
		}
	},
	'dgFetch': {
		iconClass: 'ribbon-dgfetch',
		text: '底稿取值',
		title: '底稿取值',
		commandName: 'dgFetch',
		execute: (context) => {
			$('#modal_dgFetch').modal('show');
		}
	},
	'bankStatement': {
		iconClass: 'ribbon-bankstatement',
		text: '银行对账',
		title: '银行对账',
		commandName: 'bankStatement',
		execute: (context) => {
			$('#modal_bank_statement').modal('show');
		}
	},
	'bankHzFetch': {
		iconClass: 'ribbon-bankHzFetch',
		text: '银行函证',
		title: '银行函证',
		commandName: 'bankHzFetch',
		execute: (context) => {
			var name = context.Spread.getActiveSheet().name();
			if(name != '银行函证控制表（必填）'){
				bdoInfoBox('提示', '请在银行函证控制表（必填）使用此功能！');
			}else{
				$('#modal_bank_hz_fetch').modal('show');
			}
		}
	},
	'bankHzResultCheck': {
		iconClass: 'ribbon-bankHzResultCheck',
		text: '获取函证金额',
		title: '获取函证金额',
		commandName: 'bankHzResultCheck',
		execute: (context) => {
			var name = context.Spread.getActiveSheet().name();
			if(name != '函证结果明细表'){
				bdoInfoBox('提示', '请在函证结果明细表使用此功能！');
				return;
			}
			$('#modal_correspondence_amount').modal('show');
			/*bdoConfirmBox('提示', '检查底稿对应的函证明细数据是否最新？', function() {
				$.ajax({
					url: 'dgCenter/DgFunctions.browseBankResultDetail.json',
					type: 'post',
					dataType: 'json',
					data: {
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: designer.workpaperId
				},
					success(data) {
					if(data.success){
						// 获取base64
						var excel = data.data[0].excelBase64Data;
						var file = dataURLtoFile(excel, designer.workpaperId);
						new GC.Spread.Excel.IO().open(file, json => {
							var workbookObj = json;
							workbookObj = updateUsedRange(json);
							designer.Spread.fromJSON(workbookObj);
							designer.Spread.setActiveSheetIndex(0);
							for (var i = 0; i < designer.Spread.getSheetCount(); i++) {
								if(designer.Spread.getSheet(i).getColumnCount() < 20){
									designer.Spread.getSheet(i).setColumnCount(20);
								}else{
									designer.Spread.getSheet(i).setColumnCount(designer.Spread.getSheet(i).getColumnCount() + 5);
								}
								designer.Spread.getSheet(i).setRowCount(designer.Spread.getSheet(i).getRowCount() + 5);
							}
							getCustomizeStyleFromEditFunction(CUR_CUSTOMERID, designer.workpaperId);
						}, e => {
							bdoErrorBox('失败', e.errorMessage);
						});
						bdoSuccessBox('成功', '检查完成');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
				});
			});*/
		}
	},
	'accountAge': {
		iconClass: 'ribbon-accountAge',
		text: '账龄分析',
		title: '账龄分析',
		commandName: 'accountAge',
		execute: (context) => {
			$('#accountAgeBtn').click();
		}
	},
	'billReceivable': {
		iconClass: 'ribbon-billReceivable',
		text: '应收票据',
		title: '应收票据',
		commandName: 'billReceivable',
		execute: (context) => {
			var name = context.Spread.getActiveSheet().name();
			if(name == '封面'){
				bdoInfoBox('提示', '请勿在"封面"工作表使用应收票据功能！');
			}else{
				$('#isReceivable').val(1);
				$('#modal_bill_receive').modal('show');
			}
		}
	},
	'noteFeature': {
		iconClass: 'ribbon-notefeature',
		text: '附注取值',
		title: '附注取值',
		commandName: 'noteFeature',
		execute: (context) => {
			$('#modal_noteFeature').modal('show');
		}
	},
	'cashflowFeature': {
		iconClass: 'ribbon-cashflowfeature',
		text: '数据取值',
		title: '数据取值',
		commandName: 'cashflowFeature',
		execute: (context) => {
			$('#modal_cashflowFeature').modal('show');
		}
	},
	'formatPainter': {
		iconClass: 'ribbon-formatpainter',
		title: '格式刷',
		commandName: 'formatPainter',
		execute: (context) => {
			var sheet = context.Spread.getActiveSheet();
			var selectionRange = sheet.getSelections();
			if(selectionRange.length > 1){
				bdoInfoBox('失败', '无法对多重选择区域执行此操作！');
				return;
			}
			if(designer.isFormatPainting){
				designer.isFormatPainting = false;
				return;
			}
			designer.fromRange = selectionRange[0];
			designer.fromSheet = sheet;
			designer.isFormatPainting = true;
		}
	},
	'depreciation': {
		iconClass: 'ribbon-depreciation',
		text: '固定资产折旧测试',
		title: '固定资产折旧测试',
		commandName: 'depreciation',
		execute: (context) => {
			var name = context.Spread.getActiveSheet().name();
			if(name == '封面'){
				bdoInfoBox('提示', '请勿在"封面"工作表使用应收票据功能！');
			}else{
				$('#progressType').val(1);
				$('#modal_depreciation_amortization_valuation').modal('show');
			}
		}
	},
	'amortization': {
		iconClass: 'ribbon-amortization',
		text: '无形资产摊销测试',
		title: '无形资产摊销测试',
		commandName: 'amortization',
		execute: (context) => {
			var name = context.Spread.getActiveSheet().name();
			if(name == '封面'){
				bdoInfoBox('提示', '请勿在"封面"工作表使用应收票据功能！');
			}else{
				$('#progressType').val(2);
				$('#modal_depreciation_amortization_valuation').modal('show');
			}
		}
	},
	'rowmaterialValuation': {
		iconClass: 'ribbon-rowmaterialValuation',
		text: '原材料计价测试',
		title: '原材料计价测试',
		commandName: 'rowmaterialValuation',
		execute: (context) => {
			var name = context.Spread.getActiveSheet().name();
			if(name == '封面'){
				bdoInfoBox('提示', '请勿在"封面"工作表使用应收票据功能！');
			}else{
				$('#progressType').val(3);
				$('#modal_depreciation_amortization_valuation').modal('show');
			}
		}
	},
	'stockgoodsValuation': {
		iconClass: 'ribbon-stockgoodsValuation',
		text: '库存商品计价测试',
		title: '库存商品计价测试',
		commandName: 'stockgoodsValuation',
		execute: (context) => {
			var name = context.Spread.getActiveSheet().name();
			if(name == '封面'){
				bdoInfoBox('提示', '请勿在"封面"工作表使用应收票据功能！');
			}else{
				$('#progressType').val(4);
				$('#modal_depreciation_amortization_valuation').modal('show');
			}
		}
	},
	'statementBalance': {
		iconClass: 'ribbon-statementBalance',
		text: '获取银行对账单余额',
		title: '获取银行对账单余额',
		commandName: 'statementBalance',
		execute: (context) => {
			var name = context.Spread.getActiveSheet().name();
			if(name != '银行存款明细余额表'){
				bdoInfoBox('提示', '请在"银行存款明细余额表"工作表使用！');
			}else{
				$('#modal_statement_balance').modal('show');
			}
		}
	},
}
var ribbonFileConfigIdentifier = {
	'label': '审计标识符',
	'thumbnailClass': 'ribbon-thumbnail-spreadsettings-identifier',
	'commandGroup': {
		'children': [{
			'direction': 'vertical',
			'commands': ['setIdentifier_1', 'setIdentifier_2', 'setIdentifier_3']
		},{
		'type': 'separator'
		},{
			'direction': 'vertical',
			'commands': ['setIdentifier_4', 'setIdentifier_5', 'setIdentifier_6']
		},{
		'type': 'separator'
		},{
			'direction': 'vertical',
			'commands': ['setIdentifier_7', 'setIdentifier_8', 'setIdentifier_9']
		},{
		'type': 'separator'
		},{
			'direction': 'vertical',
			'commands': ['setIdentifier_10', 'setIdentifier_11', 'setIdentifier_12']
		},{
		'type': 'separator'
		},{
			'direction': 'vertical',
			'commands': ['setIdentifier_13', 'setIdentifier_14']
		}]
	}
};
var ribbonFileConfigCustom = {
	'label': '自定义',
	'thumbnailClass': 'ribbon-thumbnail-spreadsettings-custom',
	'commandGroup': {
		'children': [{
			'direction': 'vertical',
			'commands': ['customlabel']
		}]
	}
};
var ribbonFileConfigCustomMerge = {
	'label': '自定义',
	'thumbnailClass': 'ribbon-thumbnail-spreadsettings-customMerge',
	'commandGroup': {
		'children': [{
			'direction': 'vertical',
			'commands': ['customlabelMerge']
		}]
	}
};
var ribbonFileConfigDg = {
	'label': '底稿',
	'thumbnailClass': 'ribbon-thumbnail-spreadsettings-dg',
	'commandGroup': {
		'children': [{
			'direction': 'vertical',
			'commands': ['mutualIndex', 'auditSampling', 'billReceive']
		},{
			'direction': 'vertical',
			'commands': ['singleLink', 'dgFetch', 'bankStatement']
		}]
	}
};

var ribbonHzConfigDg = {
	'label': '函证',
	'thumbnailClass': 'ribbon-thumbnail-spreadsettings-hz',
	'commandGroup': {
		'children': [{
			'direction': 'vertical',
			'commands': ['bankHzFetch','bankHzResultCheck']
		}]
	}
};
var ribbonContactsConfigDg = {
	'label': '往来',
	'thumbnailClass': 'ribbon-thumbnail-spreadsettings-contacts',
	'commandGroup': {
		'children': [{
			'direction': 'vertical',
			'commands': ['accountAge','billReceivable']
		}]
	}
};
var ribbonDavConfigDg = {
	'label': '折旧摊销计价',
	'thumbnailClass': 'ribbon-thumbnail-spreadsettings-dav',
	'commandGroup': {
		'children': [{
			'direction': 'vertical',
			'commands': ['depreciation','amortization']
		},{
			'direction': 'vertical',
			'commands': ['rowmaterialValuation','stockgoodsValuation']
		}]
	}
};
var ribbonBankStatement = {
	'label': '对账单',
	'thumbnailClass': 'ribbon-thumbnail-spreadsettings-statement',
	'commandGroup': {
		'children': [{
			'direction': 'vertical',
			'commands': ['statementBalance']
		}]
	}
};
var ribbonFileConfigNote = {
	'label': '附注',
	'thumbnailClass': 'ribbon-thumbnail-spreadsettings-note',
	'commandGroup': {
		'children': [{
			'direction': 'vertical',
			'commands': ['noteFeature']
		}]
	}
};
var ribbonFileConfigCashflow = {
	'label': '现金流量表',
	'thumbnailClass': 'ribbon-thumbnail-spreadsettings-cashflow',
	'commandGroup': {
		'children': [{
			'direction': 'vertical',
			'commands': ['cashflowFeature']
		}]
	}
};
function addItemIntoContextMenu(spread) {
	// 注册命令--清除公式以外内容...
	spread.commandManager().register('customClear', {
		canUndo: true,
		name: 'customClear',
		execute: function (context, options, isUndo) {
			var Commands = GC.Spread.Sheets.Commands;
			if (isUndo) {
				Commands.undoTransaction(context, options);
				return true;
			} else {
				Commands.startTransaction(context, options);
				var sheet = context.getSheetFromName(options.sheetName);
				sheet.suspendPaint();
				var columnCount = sheet.getColumnCount();
				for(var i = 0;i < columnCount;i++){
					var formula = sheet.getFormula(sheet.getActiveRowIndex(), i);
					if(formula == null){
						sheet.clear(sheet.getActiveRowIndex(), i, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
					}
				}
				sheet.resumePaint();
				Commands.endTransaction(context, options);
				return true;
			}
		}
	});

	// 显示命令--清除公式以外内容...
	function MyContextMenu() {}
	MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(spread);
	MyContextMenu.prototype.onOpenMenu = function (menuData, itemsDataForShown, hitInfo, spread) {
		// 表单
		if(hitInfo.worksheetHitInfo){
			// 左上角的表单表角
			if(hitInfo.worksheetHitInfo.hitTestType == 0){
				
			}
			// 列头区域
			else if(hitInfo.worksheetHitInfo.hitTestType == 1){
				
			}
			// 行头区域
			else if(hitInfo.worksheetHitInfo.hitTestType == 2){
				// 自定义一个右键菜单  command命令需要根据需求再自定义
				itemsDataForShown.unshift({
					text: '清除公式以外内容...',
					name: 'customClear',
					command: 'customClear',
					workArea: 'rowHeader'
				},
				{
					type: 'separator'
				});
			}
			// 视图区域
			else if(hitInfo.worksheetHitInfo.hitTestType == 3){
				
			}
		}
		// 表单标签区域
		else if(hitInfo.tabStripHitInfo){
			
		}
	};
	var contextMenu = new MyContextMenu();
	spread.contextMenu = contextMenu;
}

/**
 * 底稿设计器
 * 
 * @returns
 */
function initDesignerDg(_data) {
	designerConfig.commandMap = {};
	Object.assign(designerConfig.commandMap, ribbonFileCommands);
	bdoRibbon.buttonGroups.push(ribbonFileConfigIdentifier);
	bdoRibbon.buttonGroups.push(ribbonFileConfigCustom);
	bdoRibbon.buttonGroups.push(ribbonFileConfigDg);
	bdoRibbon.buttonGroups.push(ribbonHzConfigDg);
	bdoRibbon.buttonGroups.push(ribbonContactsConfigDg);
	bdoRibbon.buttonGroups.push(ribbonDavConfigDg);
	bdoRibbon.buttonGroups.push(ribbonBankStatement);
	designerConfig.ribbon.push(bdoRibbon);
	$.each(designerConfig.ribbon, function(i, ribbon){
		if(ribbon.id == 'home'){
			$.each(ribbon.buttonGroups, function(index, buttonGroups){
				if(buttonGroups.thumbnailClass == 'ribbon-thumbnail-clipboard'){
					buttonGroups.commandGroup.children[1].commands.push('formatPainter');
				}
			});
		}
	});
	designer = new GC.Spread.Sheets.Designer.Designer(document.getElementById('spreadContainer'), designerConfig, undefined);
	GC.Spread.CalcEngine.ExcelCompatibleCalcMode = true;
	// 删除菜单栏--文件
	$(designer._container).children('.ribbon').find('.fileButton').remove();
	
	designer.dgExtraOptions = _data.extraOptions;
	designer.paperType = 'dg';
	designer.paperIndexId = _data.extraOptions.indexId;
	designer.workpaperId = _data.extraOptions.workpaperId;
	designer.fileName = _data.extraOptions.nodeName;
	designer.userSubjectId = _data.extraOptions.userSubjectId;
	designer.userSubjectName = _data.extraOptions.userSubjectName;
	
	commonRibbonDisplay();
	
	commonConsts();
	
	return designer;
}
/**
 * 附注设计器
 * 
 * @returns
 */
function initDesignerNote(_data) {
	designerConfig.commandMap = {};
	Object.assign(designerConfig.commandMap, ribbonFileCommands);
	bdoRibbon.buttonGroups.push(ribbonFileConfigIdentifier);
	bdoRibbon.buttonGroups.push(ribbonFileConfigCustom);
	bdoRibbon.buttonGroups.push(ribbonFileConfigNote);
	designerConfig.ribbon.push(bdoRibbon);
	$.each(designerConfig.ribbon, function(i, ribbon){
		if(ribbon.id == 'home'){
			$.each(ribbon.buttonGroups, function(index, buttonGroups){
				if(buttonGroups.thumbnailClass == 'ribbon-thumbnail-clipboard'){
					buttonGroups.commandGroup.children[1].commands.push('formatPainter');
				}
			});
		}
	});
	designer = new GC.Spread.Sheets.Designer.Designer(document.getElementById('spreadContainer'), designerConfig, undefined);
	GC.Spread.CalcEngine.ExcelCompatibleCalcMode = true;
	// 删除菜单栏--文件
	$(designer._container).children('.ribbon').find('.fileButton').remove();
	
	designer.noteExtraOptions = _data.extraOptions;
	designer.paperType = 'note';
	designer.notePaperId = _data.extraOptions.autoId;
	designer.noteNo = _data.extraOptions.noteNo;
	designer.fileName = _data.extraOptions.fileName;
	
	commonRibbonDisplay();
	
	commonConsts();
	
	return designer;
}
/**
 * 合并附注设计器
 * 
 * @returns
 */
function initDesignerMergeNote(_data) {
	designerConfig.commandMap = {};
	Object.assign(designerConfig.commandMap, ribbonFileCommands);
	bdoRibbon.buttonGroups.push(ribbonFileConfigIdentifier);
	bdoRibbon.buttonGroups.push(ribbonFileConfigCustomMerge);
	designerConfig.ribbon.push(bdoRibbon);
	$.each(designerConfig.ribbon, function(i, ribbon){
		if(ribbon.id == 'home'){
			$.each(ribbon.buttonGroups, function(index, buttonGroups){
				if(buttonGroups.thumbnailClass == 'ribbon-thumbnail-clipboard'){
					buttonGroups.commandGroup.children[1].commands.push('formatPainter');
				}
			});
		}
	});
	designer = new GC.Spread.Sheets.Designer.Designer(document.getElementById('spreadContainer'), designerConfig, undefined);
	GC.Spread.CalcEngine.ExcelCompatibleCalcMode = true;
	// 删除菜单栏--文件
	$(designer._container).children('.ribbon').find('.fileButton').remove();
	
	designer.noteExtraOptions = _data.extraOptions;
	designer.paperType = 'mergeNote';
	designer.notePaperId = _data.extraOptions.autoId;
	designer.noteNo = _data.extraOptions.noteNo;
	designer.fileName = _data.extraOptions.fileName;
	
	commonRibbonDisplay();
	
	return designer;
}
/**
 * 审定报表--现金流量表设计器
 * 
 * @returns
 */
function initDesignerQyXj_1(_data) {
	designerConfig.commandMap = {};
	Object.assign(designerConfig.commandMap, ribbonFileCommands);
	bdoRibbon.buttonGroups.push(ribbonFileConfigIdentifier);
	bdoRibbon.buttonGroups.push(ribbonFileConfigCashflow);
	designerConfig.ribbon.push(bdoRibbon);
	$.each(designerConfig.ribbon, function(i, ribbon){
		if(ribbon.id == 'home'){
			$.each(ribbon.buttonGroups, function(index, buttonGroups){
				if(buttonGroups.thumbnailClass == 'ribbon-thumbnail-clipboard'){
					buttonGroups.commandGroup.children[1].commands.push('formatPainter');
				}
			});
		}
	});
	designer = new GC.Spread.Sheets.Designer.Designer(document.getElementById('spreadContainer'), designerConfig, undefined);
	GC.Spread.CalcEngine.ExcelCompatibleCalcMode = true;
	// 删除菜单栏--文件
	$(designer._container).children('.ribbon').find('.fileButton').remove();
	
	designer.qyxjExtraOptions = _data.extraOptions;
	designer.paperType = 'dgQYXJFile';
	
	commonRibbonDisplay();
	
	commonConsts();
	
	return designer;
}
/**
 * 审定报表--所有者权益变动表设计器
 * 
 * @returns
 */
function initDesignerQyXj_2(_data) {
	designerConfig.commandMap = {};
	Object.assign(designerConfig.commandMap, ribbonFileCommands);
	bdoRibbon.buttonGroups.push(ribbonFileConfigIdentifier);
	designerConfig.ribbon.push(bdoRibbon);
	$.each(designerConfig.ribbon, function(i, ribbon){
		if(ribbon.id == 'home'){
			$.each(ribbon.buttonGroups, function(index, buttonGroups){
				if(buttonGroups.thumbnailClass == 'ribbon-thumbnail-clipboard'){
					buttonGroups.commandGroup.children[1].commands.push('formatPainter');
				}
			});
		}
	});
	designer = new GC.Spread.Sheets.Designer.Designer(document.getElementById('spreadContainer'), designerConfig, undefined);
	GC.Spread.CalcEngine.ExcelCompatibleCalcMode = true;
	// 删除菜单栏--文件
	$(designer._container).children('.ribbon').find('.fileButton').remove();
	
	designer.qyxjExtraOptions = _data.extraOptions;
	designer.paperType = 'dgQYXJFile';
	
	commonRibbonDisplay();
	
	commonConsts();
	
	return designer;
}
/**
 * 侧边底稿设计器
 * 
 * @returns
 */
function initDesignerSecondDg(_data){
	designer = new GC.Spread.Sheets.Designer.Designer(document.getElementById('spreadContainer'), undefined, undefined);
	GC.Spread.CalcEngine.ExcelCompatibleCalcMode = true;
	designer.dgExtraOptions = _data.extraOptions;
	designer.paperType = 'dg';
	designer.paperIndexId = _data.extraOptions.indexId;
	designer.workpaperId = _data.extraOptions.workpaperId;
	designer.fileName = _data.text;
	designer.userSubjectId = _data.extraOptions.userSubjectId;
	designer.userSubjectName = _data.extraOptions.userSubjectName;
	
	commonConsts();
	// 删除菜单栏
	$(designer._container).children('.ribbon').remove();
	return designer;
}
/**
 * 侧边附注设计器
 * 
 * @returns
 */
function initDesignerSecondNote(_data){
	designer = new GC.Spread.Sheets.Designer.Designer(document.getElementById('spreadContainer'), undefined, undefined);
	GC.Spread.CalcEngine.ExcelCompatibleCalcMode = true;
	designer.noteExtraOptions = _data.extraOptions;
	designer.paperType = 'note';
	designer.notePaperId = _data.extraOptions.autoId;
	designer.noteNo = _data.extraOptions.noteNo;
	designer.fileName = _data.extraOptions.fileName;
	
	commonConsts();
	// 删除菜单栏
	$(designer._container).children('.ribbon').remove();
	return designer;
}
/**
 * 空白设计器
 * 
 * @returns
 */
function initDesigner(_data) {
	designerConfig.commandMap = {};
	Object.assign(designerConfig.commandMap, ribbonFileCommands);
	$.each(designerConfig.ribbon, function(i, ribbon){
		if(ribbon.id == 'home'){
			$.each(ribbon.buttonGroups, function(index, buttonGroups){
				if(buttonGroups.thumbnailClass == 'ribbon-thumbnail-clipboard'){
					buttonGroups.commandGroup.children[1].commands.push('formatPainter');
				}
			});
		}
	});
	designer = new GC.Spread.Sheets.Designer.Designer(document.getElementById('spreadContainer'), designerConfig, undefined);
	// 删除菜单栏--文件
	$(designer._container).children('.ribbon').find('.fileButton').remove();
	GC.Spread.CalcEngine.ExcelCompatibleCalcMode = true;
	commonRibbonDisplay();
	
	return designer;
}
//打开抽凭附件
// pdf、jpg、png、jpeg预览
// 其他文件格式提示下载
function openSamplingAttach(id, text){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	var fileName = text.substring(text.indexOf(':') + 1);
	var fileSuffix = text.substring(text.lastIndexOf('.') + 1).toLowerCase();
	if (fileSuffix === 'pdf' || fileSuffix === 'jpg' || fileSuffix === 'png' || fileSuffix === 'jpeg' || fileSuffix === 'xlsx') {
		$.ajax({
			type : 'post',
			url: 'dgCenter/DgGeneral.query.json',
			// async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00329',
				param1: customerId,
				param2: projectId,
				param3: id,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success(data) {
				if(data.success) {
					if(data.data[0].num > 0){
						if (fileSuffix === 'pdf' || fileSuffix === 'jpg' || fileSuffix === 'png' || fileSuffix === 'jpeg') {
							window.open('dgCenter/DgPaper.previewFile.json?param1=' + id + '&param2=type2' + '&param3=' + fileName , fileName, 'location=no');
						}else if(fileSuffix === 'xlsx'){
							var rowData = {
								customerId: customerId,
								projectId: projectId,
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
		downloadFile('dgCenter/DgDownload.downloadDgAttachFile.json', {param1: id, param2: customerId, param3: 'type2'});
	}
}
//打开底稿附件
//pdf、jpg、png、jpeg预览
//其他文件格式提示下载
function openDgAttach(fileLink, fileName){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	var autoId = fileLink.substring(0, fileLink.indexOf(':'));
	var fileSuffix = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
	if (fileSuffix === 'pdf' || fileSuffix === 'jpg' || fileSuffix === 'png' || fileSuffix === 'jpeg' || fileSuffix === 'xlsx') {
		$.ajax({
			url : 'dgCenter/DgMain.queryAttachFileExistence.json',
			type : 'post',
			data : {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: autoId,
				param2: customerId
			},
			dataType : 'json',
			success : function(data){
				if(data.success){
					if (fileSuffix === 'pdf' || fileSuffix === 'jpg' || fileSuffix === 'png' || fileSuffix === 'jpeg') {
						window.open('dgCenter/DgPaper.previewFile.json?param1=' + autoId + '&param2=type1' + '&param3=' + fileName , fileName , 'location=no');
					}else if(fileSuffix === 'xlsx'){
						var rowData = {
							customerId: customerId,
							projectId: projectId,
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
		downloadFile('dgCenter/DgDownload.downloadAttach.json', {param1: autoId, param2: customerId});
	}
}

//设置底稿文件节点信息
function setExcelnode(workPaperId){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	$.ajax({
		type : 'post',
		url: 'dgCenter/DgGeneral.query.json',
		async : false,
		data : {
			menuId: window.sys_menuId,
			sqlId: 'DG00078',
			param1: customerId,
			param2: projectId,
			param3: workPaperId,
			start: -1,
			limit: -1
		},
		dataType : 'json',
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
//设置附注文件节点信息
function setNoteNode(autoId){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	$.ajax({
		type : 'post',
		url : 'dgCenter/DgGeneral.query.json',
		async : false,
		data : {
			menuId: window.sys_menuId,
			sqlId: 'DG00092',
			param1: autoId,
			param2: customerId,
			param3: projectId,
			start: -1,
			limit: -1
		},
		dataType : 'json',
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
//设置其他底稿文件节点信息
function setOtherExcelnode(autoId) {
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		async: false,
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00224',
			param1: customerId,
			param2: projectId,
			param3: autoId,
			start: -1,
			limit: -1
		},
		dataType: 'json',
		success(data) {
			if (data.success) {
				// 打开底稿
				var nodeData = {
					extraOptions: data.data[0],
					currentNode: {
						extraOptions: data.data[0]
					}
				};
				nodeData.autoId = nodeData.extraOptions.workpaperId;
				nodeData.workpaperId = nodeData.extraOptions.workpaperId;
				// nodeData.extraOptions.tableDiv = thisPageConfig.TABLE_DIV;
				nodeData.menuId = window.sys_menuId;
				designer.excelnode = nodeData;
			}
		}
	});
}
//设置附注模板文件节点信息
function setTplnode(indexId, reportTplId, noteNo){
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		async: false,
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00231',
			param1: indexId,
			param2: noteNo,
			param3: reportTplId,
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

//检查底稿是否存在
function checkDgExist(workpaperId){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	var isExist = true;
	if(workpaperId == ''){
		return false;
	}
	var result = $.inArray(workpaperId, designer.existedDgArr);
	if(result == -1){
		$.ajax({
			type : 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00179',
				param1: customerId,
				param2: projectId,
				param3: workpaperId,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success(data) {
				if(data.success) {
					if(data.data[0].num == 0){
						isExist = false;
					}else if(data.data[0].num > 0){
						designer.existedDgArr.push(workpaperId);
					}
				}
			}
		});
	}
	return isExist;
}
// 检查底稿附件是否存在
function checkAttachExist(attachmentId){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	var isExist = true;
	var result = $.inArray(attachmentId, designer.existedAttachArr);
	if(result == -1){
		$.ajax({
			type : 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00180',
				param1: customerId,
				param2: projectId,
				param3: attachmentId,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success(data) {
				if(data.success) {
					if(data.data[0].num == 0){
						isExist = false;
					}else if(data.data[0].num > 0){
						designer.existedAttachArr.push(attachmentId);
					}
				}
			}
		});
	}
	return isExist;
}
//检查附注是否存在
function checkNoteExist(noteId){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	var isExist = true;
	var result = $.inArray(noteId, designer.existedNoteArr);
	if(result == -1){
		$.ajax({
			type : 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00181',
				param1: customerId,
				param2: projectId,
				param3: noteId,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success(data) {
				if(data.success) {
					if(data.data[0].num == 0){
						isExist = false;
					}else if(data.data[0].num > 0){
						designer.existedNoteArr.push(noteId);
					}
				}
			}
		});
	}
	return isExist;
}
//检查抽凭附件是否存在
function checkSamplingAttachExist(id){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	var isExist = true;
	var result = $.inArray(id, designer.existedSamplingArr);
	if(result == -1){
		$.ajax({
			type : 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00329',
				param1: customerId,
				param2: projectId,
				param3: id,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success(data) {
				if(data.success) {
					if(data.data[0].num == 0){
						isExist = false;
					}else if(data.data[0].num > 0){
						designer.existedSamplingArr.push(id);
					}
				}
			}
		});
	}
	return isExist;
}

//打开底稿
function openDgFile(dgFileId, dgFileIndexId, dgFileName){
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		projectId = designer.dgExtraOptions.projectId;
	}
	if(dgFileId !== ''){
		if($('#dg_' + dgFileId, window.parent.document).length == 0){
			$('#dgFileTabs li', window.parent.document).removeClass('active');
			$('#dgFileTabContent div', window.parent.document).removeClass('active');
			setExcelnode(dgFileId);
			var excelnode = designer.excelnode;
			$.sessionStorage('excelnode', JSON.stringify(excelnode));
			$('#dgFileTabs', window.parent.document).append("<li class='active'><a href='#dg_" + dgFileId + "'><h5 class='block-title'>" + dgFileName + "&nbsp;<i class='fa fa-remove tab-close' style='cursor:pointer;'></i></h5></a></li>");
			var $div = $('<div class="postil-content-wrap tab-pane active" id="dg_' + dgFileId + '">' 
					+ 	'<iframe id="iframe_dg_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgIframe&index=' + dgFileIndexId + '&projectId=' + projectId + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
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
		bdoInfoBox('失败', '请选择底稿');
	}
}
//打开附注
function openNoteFile(dgFileId, dgFileIndexId, dgFileName){
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		projectId = designer.dgExtraOptions.projectId;
	}
	if(dgFileId !== ''){
		if($('#note_' + dgFileId, window.parent.document).length == 0){
			$('#dgFileTabs li', window.parent.document).removeClass('active');
			$('#dgFileTabContent div', window.parent.document).removeClass('active');
			setNoteNode(dgFileId);
			var excelnode = designer.excelnode;
			$.sessionStorage('excelnode', JSON.stringify(excelnode));
			$('#dgFileTabs', window.parent.document).append("<li class='active'><a href='#note_" + dgFileId + "'><h5 class='block-title'>" + dgFileName + "&nbsp;<i class='fa fa-remove tab-close' style='cursor:pointer;'></i></h5></a></li>");
			var $div = $('<div class="postil-content-wrap tab-pane active" id="note_' + dgFileId + '">' 
					+ 	'<iframe id="iframe_note_' + dgFileId + '" src="/Faith/dgcenter.do?m=openDgNoteIframe&index=' + dgFileIndexId + '&projectId=' + projectId + '" allowfullscreen="true" scrolling="no" width="100%" height="' + window.innerHeight + 'px" style="border: none;"></iframe>'
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
		bdoInfoBox('提示', '请选择附注');
	}
}

//设置底稿sheet名下拉框 paperSelectedId:下拉框已选择底稿 id:下拉框id
function setDgSheet(paperSelectedId, id){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	if(paperSelectedId == null){
		return;
	}
	$.ajax({
		type : 'post',
		url : 'dgCenter/DgMain.getPaperSheetName.json',
		async : false,
		data : {
			menuId: window.sys_menuId,
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: customerId,
			param2: projectId,
			// param3:底稿文件autoId
			param3: paperSelectedId.substring(0, paperSelectedId.indexOf(':')),
			start: -1,
			limit: -1
		},
		dataType : 'json',
		success(data) {
			if(data.success) {
				$('#' + id).empty();
				$('#' + id).append('<option value=""></option>');
				for(let i=0;i<data.data.length;i++){
					$('#' + id).append('<option value="' + i + '">' + data.data[i][0] + '</option>');
				}
			}
		}
	});
}
//设置附注sheet名下拉框 param1:下拉框已选择附注 param2:下拉框id
function setNoteSheet(param1, param2){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	// autoId + ':' + noteNo498:2019001729
	$.ajax({
		type : 'post',
		url : 'dgCenter/DgWapper.getNoteSheetName.json',
		async : false,
		data : {
			menuId: window.sys_menuId,
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: customerId,
			param2: projectId,
			// param3:底稿文件autoId
			param3: param1.substring(0, param1.indexOf(':')),
			start: -1,
			limit: -1
		},
		dataType : 'json',
		success(data) {
			if(data.success) {
				$('#' + param2).empty();
				$('#' + param2).append('<option value=""></option>');
				for(let i = 0;i < data.data.length;i++){
					$('#' + param2).append('<option value="' + i + '">' + data.data[i][0] + '</option>');
				}
			}
		}
	});
}
//设置抽凭附件下拉框
function setSamplingAttachList(){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	if ($('#sampling_file_subjectid').val() == '') {
		$('#sampling_file_subjectid').focus();
		bdoInfoBox('提示', '请选择科目');
		return;
	}
	$.ajax({
		url: 'finCenter/Sampling.querySamplingFile.json',
		type: 'post',
		async : false,
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00328',
			lockCustomerId: customerId,
			lockProjectId: projectId,
			lockYyyy: window.CUR_PROJECT_ACC_YEAR,
			param1: customerId,
			param2: projectId,
			param3: $('#sampling_file_subjectid').val(),
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

// 功能栏点击显示隐藏
function commonRibbonDisplay(){
	// 为右键菜单添加一个项
	addItemIntoContextMenu(designer.Spread);
	var $img = $('<img id="brushIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAB5CAMAAAAqJH57AAAAY1BMVEX///8AAADx8fH19fX8/Pz5+floaGjp6elVVVWUlJRfX19iYmLi4uLFxcU2NjZMTEwgICBBQUETExO3t7cwMDBaWlqOjo6urq6Dg4OamprS0tKlpaXY2Ng7OztHR0fMzMx0dHQCCum/AAAFeklEQVRogcVb6cKqIBR0zRZLW78yW97/Ka8m6gAHQRTv/MuSkeFwzgDmefMhDGdsbAyC3fb/UMc731/F/4M48yusl6cOdv4Pu6UFD1c+w9KCZ36HXbQgb7D1Adflet1L3eC7FHW09gXslqHmpW6QLTHWotQswt1Pruja0902Cwoewhg/PO/Wf3KczQKQelN9jh4LCR5BcN2bS3egdhdmgtQNYKwzV4Kj1I/+MoaZI8FlqRtAmDnJZmFG9rgG9NpBhItRraKeXfAYiG/y10A9d73OBnpcAybXdc7J1VofYoxbQEqZsV6Hw1I3gAifLZthPVYSc9QzlQ+sxwqpG8w9uYyk/iHClDJdcJR6pfvxnIKHYASOgfbnQD3RIGHm8s/CQ6XnUtQ0wpQyRXCsx37OdSJ4Hn0qYeHkshc85Owthld8Uw7AHAYp4F0mVMZP+0hvYughm9mWD8FXZ+11qB5kopxqkLAeN9j/ridPuPQkb51mkALZ0OePJD3fL3gpoW+e4sPjnchLYae6HahHGqS4CaHTYZh5r2wAInxUvW7r8T45DhEPpSk7wdsiUSWt9EKT/kDHl0xtns0y0DLJlcSH4TwOk8uw1209ZoOYKgUnDRkAUopRNgOpGbUqzBRTqkM0ziC19RjCNjmRxAYxC2Ot3agUpGbUpOBfLTHnFDTMTOqTUIpJwfXMWDt0rqJofvcSf0dGOBvnuPw8C6qxcembmZ+DGD3Jixjo6vmST5PIt3KfRs6qM/vtOxW+SAnq1+raJZo/sSXcx9AbuGqg2xHNJMHpCG/xVRNnZimsC8eL2OtgsHwIjhik3hrxel7Z3XEUx1qdzXxhF2G01D/0JSKTqNU5nLfEuM4xt2Jgdi5ShKsFx9QDCWQ7ojiXEEnmgmPdwvpoLHUNNNlvU8FhxuIafpzr/cMWXyJ1QFN3y9vo219cj/S8BS+jlFJIwdthxjXv6IVV+ObalCOcCrMPe2oYKiKh6nDnG5XGmiof398zQ2yNlrrGn9CqNLkowY+P5xefyGoNG4qtmgnOwULqGnKHpAgfLh/96m8kvlJLksGl6vVEqWs85baM6nVHbCe119sDjtrIIDVS2+9SfKhRlA2SIsyUC0wDJORiyrB82EutZJYnF2WQRtRjAqTavlG9HlOPCVAR9oNcNAXBJ0ntUfO5E1yaXFyET5O6ak1JTEU4xMTUc4RiaJtAtgq94FO38veaaiAXTXaDZZHoQGROAeK83jczwaYeAxJ1cPXgJ9d5Fqn3gxWoA6aU/RxSl+QbBKTg3eRixLb1uOE1EboTnHVxBqmL1cCaiUCTUliPtVsRapyNde5QTy5GbL11nz7GdZfhEDCpbc+H0ruON39lWfa+SPWLzQPLIhHeNSayWjGVQVghKf7u1NeGWxEi9AmL37MoH2Igmm5F8IhvNBsgFze6ovS5BpnspJZftpIh7TXVKG9txy3rsUHmUB2Bxuff9qil9dnoaH3/JDqQHlGVai2jWlwwUhg85/ak41AzlHpe3WmBHcLBMxmGs76d8Xjoef2ji5euPgbEbrosHXYSeLsg3pt0eTiwLfHW87oJbKMuD578WSLqD3hPea6okgcX79X1SeRepGlBp28XXe4Sds6yMjXFchfv88XtlCrbKwS1ky63K144eJAEv7gI7Naco9soxDBTn+JPAfNeuAQXN+odvfTPPNBrgFl3sGwJtiOQl/0lQW0nedPrN3LhrJ430nf1vfMwnzpN+R2ZtZO4RuZu6V9yo+zwHw69yz5tyiQpeKl170tMAS4s8teBD2vS2c+FgRr5UvvrOaA+Rt44iy0Ghe/MPo55Fa9+Xdykai31bhHemvoBY51nm3LB/2YF+1s9ry/r5zld6s9R/wAERjrjlbObzQAAAABJRU5ErkJggg==" style="position: absolute;z-index: 10000;height: 20px;display: none">');
	$img.insertAfter($('#spreadContainer').parent());
	// 格式刷
	$("body").mousemove(function(e){
		var e = e ? e : window.event;
		if(!designer.isFormatPainting){
			$("#brushIcon").hide();
			return;
		}
		var posx = e.pageX;
		var posy = e.pageY;
		var offset = $("#spreadContainer").offset();
		if(posx > offset.left && posy > offset.top && posx < offset.left + $("#spreadContainer").width() && posy < offset.top + $("#spreadContainer").height()){
			var brushIcon = $("#brushIcon");
			brushIcon.show();
			brushIcon.css("left", posx + 18 + "px");
			brushIcon.css("top", posy + "px");
		} else {
			$("#brushIcon").hide();
		}
	});
	
	// 删除spreadjs自带的按钮
	$(designer._container).children('.ribbon').find('.collapsedRibbon').remove();
	
	var $ribbonUl = $(designer._container).children('.ribbon').find('.gc-ribbon-bar').find('.ribbon-navigation');
	
	var $div = $('<div style="float: right;border: 0px;position:absolute;z-index:1;top: 6px;right: 20px;">'
		+			'<button title="隐藏" name="ribbon-display" data-result="1">'
		+				'<i class="fa fa-chevron-up"></i>'
		+			'</button>'
		+			'<button title="显示" name="ribbon-display" data-result="2" style="display: none;">'
		+				'<i class="fa fa-chevron-down"></i>'
		+			'</button>'
		+		'</div>');
	$div.insertAfter($ribbonUl);
	
	$(designer._container).on('click', 'button[name="ribbon-display"]', evt => {
		var buttonType = $(evt.currentTarget).attr('data-result');
		$(evt.currentTarget).css('display', 'none');
		var height = $('#main-container').height() - $('#pageHead').height() - 60;
		if(height <= 0) {
			height = $('body').height() - 20;
		}
		var icon = $('#fullscreenBtn').find('i');
		var fullscreenFlg = icon.hasClass('si-size-actual');
		if(fullscreenFlg) {
			height = height + 85;
		}else {
			height = height + 25;
		}
		if(buttonType == 1){
			// 隐藏
			$(evt.currentTarget).next().css('display', 'block');
			$(evt.currentTarget).parent().parent().next().css('display', 'none');
			$(evt.currentTarget).parents('.gc-ribbon-bar').css('height', '0px').css('min-height', '30px');
			$(evt.currentTarget).parents('.ribbon').css('height', '0px').css('min-height', '30px');
			$("#spreadContainer .spreadWrapper").css('height', (height - 135) + 'px')
		}else if(buttonType == 2){
			// 显示
			$(evt.currentTarget).prev().css('display', 'block');
			$(evt.currentTarget).parent().parent().next().css('display', 'block');
			$(evt.currentTarget).parents('.ribbon').css('height', '141px');
			
			$("#spreadContainer .spreadWrapper").css('height', (height - 246) + 'px');
		}
		designer.Spread.refresh();
	});
}
// 共通
function commonConsts(){
	var customerId = window.CUR_CUSTOMERID;
	var projectId = window.CUR_PROJECTID;
	if(designer.paperType == 'dg'){
		customerId = designer.dgExtraOptions.customerId;
		projectId = designer.dgExtraOptions.projectId;
	}
	designer.existedDgArr = [];
	designer.existedNoteArr = [];
	designer.existedAttachArr = [];
	designer.existedSamplingArr = [];
	designer.paperArr = [];
	// 打开底稿时取得该项目下所有底稿信息
	(function(){
		$.ajax({
			type : 'post',
			url: 'dgCenter/DgGeneral.query.json',
			// async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00067',
				param1: customerId,
				param2: projectId,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success(data) {
				if(data.success) {
					designer.paperArr = data.data;
				}
			}
		});
	})();

	designer.attachmentArr = [];
	// 打开底稿时取得该项目下所有底稿附件信息
	(function(){
		$.ajax({
			type : 'post',
			url: 'dgCenter/DgGeneral.query.json',
			// async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00069',
				param1: customerId,
				param2: projectId,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success(data) {
				if(data.success) {
					designer.attachmentArr = data.data;
				}
			}
		});
	})();

	designer.noteArr = [];
	// 打开底稿时取得该项目下所有附注信息
	(function(){
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
			type: 'post',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00125',
				param1: customerId,
				param2: projectId,
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
	})();

	designer.tbArr = [];
	// 打开底稿时取得该项目下所有TB科目信息
	(function(){
		$.ajax({
			url: 'dgCenter/DgGeneral.query.json',
			type: 'post',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00126',
				param1: customerId,
				param2: projectId,
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
	})();

	designer.guideArr = [];
	// 打开底稿时取得该项目下所有财务科目信息
	(function(){
		$.ajax({
			url : 'dgCenter/DgWapper.getGuideList.json',
			// async : false,
			type : 'post',
			data : {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: customerId,
				param2: projectId,
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
	})();

	designer.reportArr = [];
	// 取得该项目下所有报表科目信息
	(function(){
		$.ajax({
			url : 'dgCenter/DgAuditFile.getReportData.json',
			type: 'post',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: customerId,
				param2: projectId,
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
	})();

	var paperSelectedId;
	(function(){
		for (var i= 0; i < designer.paperArr.length; i++) {
			if (designer.workpaperId == designer.paperArr[i].autoId) {
				designer.paperSelectedId = designer.paperArr[i].autoId + ':' + designer.paperArr[i].indexId;
				break;
			}
		}
	})();

	// 交叉索引
	var ShowMutualIndex = (function () {
		function ShowMutualIndex() {
			this.typeName = 'ShowMutualIndex';
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

			if (tag.cellTagStart && tag.cellTagStart.length > 0) {
				var node = tag.cellTagStart[0];
				if (node.type === 'link') {
					style.foreColor = 'blue';
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					this._cellTagStartCache[0] = {
						startX: x + startTextWidth,
						textWidth: textWidth + 3,
						linkType: node.linkType,
						displayText: node.displayText,
						linkText: node.linkText,
						type: node.type
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
			
			if (tag.cellTagEnd && tag.cellTagEnd.length > 0) {
				var node = tag.cellTagEnd[0];
				if (node.type === 'link') {
					style.foreColor = 'blue';
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					this._cellTagStartCache[1] = {
						startX: x + startTextWidth,
						textWidth: textWidth + 3,
						linkType: node.linkType,
						displayText: node.displayText,
						linkText: node.linkText,
						type: node.type
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

			// Set Font to default
			style.foreColor = foreColor;
			style.textDecoration = textDecoration;

			//Paint Value
			// style.font = 'bold ' + style.font;
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
							var range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), rangeStr, 0, 0);
							// var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
							if(linkType == '2'){
								if(nodeType == 'dgNode' && nodePaperId == dgFileId){
									var iframeId = 'iframe_dg_' + dgFileId;
									var sheetIndex = parseInt(self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.Spread.setActiveSheetIndex(sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.Spread.getActiveSheet().setActiveCell(range.row, range.col);
								}else{
									if($('#dg_' + dgFileId, window.parent.document).length > 0){
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
									var iframeId = 'iframe_note_' + dgFileId;
									var sheetIndex = parseInt(self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.Spread.setActiveSheetIndex(sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.Spread.getActiveSheet().setActiveCell(range.row, range.col);
								}else{
									if($('#note_' + dgFileId, window.parent.document).length > 0){
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
							var range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), rangeStr, 0, 0);
							// var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
							if(linkType == '2'){
								if(nodeType == 'dgNode' && nodePaperId == dgFileId){
									var iframeId = 'iframe_dg_' + dgFileId;
									var sheetIndex = parseInt(self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.Spread.setActiveSheetIndex(sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.Spread.getActiveSheet().setActiveCell(range.row, range.col)
								}else{
									if($('#dg_' + dgFileId, window.parent.document).length > 0){
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
									var iframeId = 'iframe_note_' + dgFileId;
									var sheetIndex = parseInt(self._cellTagStartCache[hitInfo.reservedLocation].sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.Spread.setActiveSheetIndex(sheetIndex);
									window.parent.frames[iframeId].contentWindow.designer.Spread.getActiveSheet().setActiveCell(range.row, range.col);
								}else{
									if($('#note_' + dgFileId, window.parent.document).length > 0){
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
			var canvasId = div.id + 'vp_vp';
			var canvas = $('#' + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div = document.createElement('div');
					$(div).css('position', 'absolute')
						.css('border', '1px #C0C0C0 solid')
						.css('box-shadow', '1px 2px 5px rgba(0,0,0,0.4)')
						.css('font', '9pt Arial')
						.css('background', 'white')
						.css('padding', 5);
					this._toolTipElement = div;
				}
				var displayText = this._cellTagStartCache[hitInfo.reservedLocation].displayText;
				$(this._toolTipElement).text(displayText).css('top', hitInfo.y + 190).css('left', hitInfo.x + 15);
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show('fast');
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
				// cellStyle.font = 'bold ' + cellStyle.font;
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
			if(cellTagStart && cellTagStart.length > 0){
				let paperId = cellTagStart[0].paperId;
				let linkType = cellTagStart[0].linkType;
				// 底稿
				if(linkType == '2' && !checkDgExist(paperId)){
					cellTagStart.splice(0 , 1);
				}
				// 附注
				if(linkType == '3' && !checkNoteExist(paperId)){
					cellTagStart.splice(0 , 1);
				}
			}
			if(cellTagEnd && cellTagEnd.length > 0){
				let paperId = cellTagEnd[0].paperId;
				let linkType = cellTagEnd[0].linkType;
				// 底稿
				if(linkType == '2' && !checkDgExist(paperId)){
					cellTagEnd.splice(0 , 1);
				}
				// 附注
				if(linkType == '3' && !checkNoteExist(paperId)){
					cellTagEnd.splice(0 , 1);
				}
			}
			// cellLink[0] = sheetIndex + ':' + row + ':' + col
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(':')));
			designer.Spread.setActiveSheetIndex(sheetIndex);
			var sheet = designer.Spread.getActiveSheet();
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(':') + 1,cellLink[0].lastIndexOf(':')));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(':') + 1));
			
			designer.Spread.suspendPaint();
			var activeCell = sheet.getCell(row, col);
			activeCell.cellType(new designer.ShowMutualIndex());
			activeCell.tag({
				cellTagStart: cellTagStart,
				cellTagEnd: cellTagEnd
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.Spread.resumePaint();
		}
	};

	// 单向链接
	var ShowSingleLink = (function () {
		function ShowSingleLink() {
			this.typeName = 'ShowSingleLink';
			this._cellTagStartCache = undefined;
			this._textWidth = undefined;
		}
		ShowSingleLink.prototype = new GC.Spread.Sheets.CellTypes.Text();
		ShowSingleLink.prototype.paintContent = function (ctx, value, x, y, w, h, style, context) {
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
					style.foreColor = 'blue';
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					var isFile = node.isFile;
					if (isFile == true) {
						this._cellTagStartCache[i] = {
								startX: x + startTextWidth,
								textWidth: textWidth + 3,
								isFile: node.isFile,
								isPaper: node.isPaper,
								paperLink: node.paperLink,
								attachmentLink: node.attachmentLink,
								fileName: node.fileName,
								paperName: node.paperName,
								linkText: node.linkText,
								type: node.type
						};
					} else if (isFile == false) {
						this._cellTagStartCache[i] = {
								startX: x + startTextWidth,
								textWidth: textWidth + 3,
								isFile: node.isFile,
								formula: node.formula == undefined ? node.link : node.formula,
								displayText: node.displayText,
								paperListCell: node.paperListCell,
								paperTextCell: node.paperTextCell,
								sheetName: node.sheetName,
								linkText: node.linkText,
								type: node.type
						};
					} else {
						if (node.isExternal) {
							this._cellTagStartCache[i] = {
									startX: x + startTextWidth,
									textWidth: textWidth + 3,
									isExternal: node.isExternal,
									linkType: node.linkType,
									urlText: node.urlText,
									url: node.url,
									urlType: node.urlType
							};
						}
					}
					startTextWidth += (textWidth + 3);
				}
			}
			this._textWidth += startTextWidth;
			
			// Set Font to default
			style.foreColor = foreColor;
			style.textDecoration = textDecoration;
			
			//Paint Value
			// style.font = 'bold ' + style.font;
			style.hAlign = GC.Spread.Sheets.HorizontalAlign.right;
			style.vAlign = GC.Spread.Sheets.VerticalAlign.center;
			GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, value, x, y, w - endTextWidth - 3, h, style, context)
			
		};
		
		ShowSingleLink.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
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
		ShowSingleLink.prototype.processMouseUp = function (hitInfo) {
			var sheet = hitInfo.sheet, self = this;
			if (sheet && hitInfo.isReservedLocation && hitInfo.reservedLocation >= 0) {
				setTimeout(function () {
					if (self._toolTipElement) {
						document.body.removeChild(self._toolTipElement);
						self._toolTipElement = null;
					}
					var isFile = self._cellTagStartCache[hitInfo.reservedLocation].isFile;
					if (isFile == true) {
						var isPaper = self._cellTagStartCache[hitInfo.reservedLocation].isPaper;
						var fileLink;
						if (isPaper) {
							fileLink = self._cellTagStartCache[hitInfo.reservedLocation].paperLink;
							var dgFileId = fileLink.substring(0, fileLink.indexOf(':'));
							var dgFileIndexId = fileLink.substring(fileLink.indexOf(':') + 1);
							var dgFileName = self._cellTagStartCache[hitInfo.reservedLocation].paperName;
							openDgFile(dgFileId, dgFileIndexId, dgFileName);
						} else {
							var mapKey = hitInfo.sheet.parent.getActiveSheetIndex() + ':' + hitInfo.row + ':' + hitInfo.col;
							// 跳转底稿、抽凭附件链接页面
							goToAttachLink(mapKey);
							/*// 打开附件
							fileLink = self._cellTagStartCache[hitInfo.reservedLocation].attachmentLink;
							var fileName = self._cellTagStartCache[hitInfo.reservedLocation].fileName;
							openDgAttach(fileLink, fileName);*/
						}
					} else if (isFile == false) {
						// paperCell = 底稿文件索引号(6603-0100-0001) : 底稿文件autoId(321)
						let paperCell = self._cellTagStartCache[hitInfo.reservedLocation].paperListCell;
						let indexId = paperCell.substring(paperCell.indexOf(':') + 1);
						let workPaperId = paperCell.substring(0, paperCell.indexOf(':'));
						let formula = self._cellTagStartCache[hitInfo.reservedLocation].formula;
						// 跳转到底稿本身的单元格时，不用打开新底稿
						if(workPaperId == designer.workpaperId){
							let sheetIndex = parseInt(formula.substring(0,formula.indexOf(':')));
							let rangeStr = formula.substring(formula.indexOf(':') + 1);
							let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), rangeStr, 0, 0);
							designer.Spread.setActiveSheetIndex(sheetIndex);
							designer.Spread.getActiveSheet().setActiveCell(range.row, range.col);
							var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
							// var horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
							designer.Spread.getActiveSheet().showRow(range.row, verticalPosition);
							// designer.Spread.getActiveSheet().showCell(range.row, range.col, verticalPosition, horizontalPosition);
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
					} else {
						var isExternal = self._cellTagStartCache[hitInfo.reservedLocation].isExternal;
						if(isExternal){
							var linkType = self._cellTagStartCache[hitInfo.reservedLocation].linkType;
							if(linkType == 'URL'){
								var url = self._cellTagStartCache[hitInfo.reservedLocation].url;
								var fileSuffix = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
								var urlType = self._cellTagStartCache[hitInfo.reservedLocation].urlType;
								if(urlType == 'jianpan'){
									url = '/jianpan' + new URL(url).pathname;
								}
								// bmp,jpg,png,tif,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,WMF,webp,avif
								var isOpenForPreview = /bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|avif|pdf/i.test(fileSuffix);
								if(isOpenForPreview) {
								//if (fileSuffix === 'pdf' || fileSuffix === 'jpg' || fileSuffix === 'png' || fileSuffix === 'jpeg') {
									window.open(url, 'location=no', '_blank');
								} else {
									window.open(url, 'location=no');
								}
							}else if(linkType == 'MODAL'){
								var urlType = self._cellTagStartCache[hitInfo.reservedLocation].urlType;
								if(urlType == 'sampling'){
									var url = self._cellTagStartCache[hitInfo.reservedLocation].url;
									SamplingResult({region: '#voucherTestSamplistResultPage', data: [], samplingId: url});
									$('#modal_voucherTest_samplistResult').modal('show');
								}
							}
						}
					}
				}, 10);
				return true;
			}
			return false;
		};
		
		ShowSingleLink.prototype.processMouseMove = function (hitInfo) {
			var sheet = hitInfo.sheet;
			var div = sheet.getParent().getHost();
			var canvasId = div.id + 'vp_vp';
			var canvas = $('#' + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div1 = document.createElement('div');
					$(div1).css('position', 'absolute')
					.css('border', '1px #C0C0C0 solid')
					.css('box-shadow', '1px 2px 5px rgba(0,0,0,0.4)')
					.css('font', '9pt Arial')
					.css('background', 'white')
					.css('padding', 5);
					this._toolTipElement = div1;
				}
				var isFile = this._cellTagStartCache[hitInfo.reservedLocation].isFile;
				if (isFile == true) {
					var isPaper = this._cellTagStartCache[hitInfo.reservedLocation].isPaper;
					if (isPaper == true) {
						$(this._toolTipElement).text(this._cellTagStartCache[hitInfo.reservedLocation].paperName).css('top', hitInfo.y + 190).css('left', hitInfo.x + 15);
					}else{
						$(this._toolTipElement).text(this._cellTagStartCache[hitInfo.reservedLocation].fileName).css('top', hitInfo.y + 190).css('left', hitInfo.x + 15);
					}
				} else if (isFile == false) {
					var formula = this._cellTagStartCache[hitInfo.reservedLocation].formula;
					$(this._toolTipElement).text(this._cellTagStartCache[hitInfo.reservedLocation].paperTextCell + ':' + this._cellTagStartCache[hitInfo.reservedLocation].sheetName + formula.substring(formula.indexOf(':'))).css('top', hitInfo.y + 190).css('left', hitInfo.x + 15);
				} else {
					var isExternal = this._cellTagStartCache[hitInfo.reservedLocation].isExternal;
					if(isExternal){
						var linkType = this._cellTagStartCache[hitInfo.reservedLocation].linkType;
						if(linkType == 'URL'){
							$(this._toolTipElement).text(this._cellTagStartCache[hitInfo.reservedLocation].urlText).css('top', hitInfo.y + 190).css('left', hitInfo.x + 15);
						}
					}
				}
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show('fast');
				return true;
			}
			return false;
		};
		
		ShowSingleLink.prototype.processMouseLeave = function (hitInfo) {
			if (this._toolTipElement) {
				document.body.removeChild(this._toolTipElement);
				this._toolTipElement = null;
			}
		};
		
		ShowSingleLink.prototype.getAutoFitWidth = function (value, text, cellStyle, zoomFactor, context) {
			if (this._textWidth) {
				// cellStyle.font = 'bold ' + cellStyle.font;
				return 5 + this._textWidth + GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context);
			} else {
				return GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context)
			}
		};
		return ShowSingleLink;
	})();
	designer.ShowSingleLink = ShowSingleLink;
	
	designer.ShowSingleLinkCacheMap = new Map();
	
	// 单向链接 初始化页面时显示所有底稿单向链接
	designer.setShowSingleLinkCacheMap = function (mapJson) {
		if (mapJson === undefined) {return;}
		let strMap = new Map();
		// json转换为map
		for (let k of Object.keys(mapJson)) {
			strMap.set(k, mapJson[k]);
		}
		designer.ShowSingleLinkCacheMap = strMap;
		for (let cellLink of designer.ShowSingleLinkCacheMap) {
			var cellTagStart = cellLink[1];
			for(let i = 0;i < cellTagStart.length;i++){
				let data = cellTagStart[i];
				let workpaperId = '';
				let attachmentId = '';
				if(data.isFile == true){
					workpaperId = data.paperLink.substring(0, data.paperLink.indexOf(':'));
					if(!data.isPaper){
						attachmentId = data.attachmentLink.substring(0, data.attachmentLink.indexOf(':'));
					}
				}else if(data.isFile == false){
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
			// cellLink[0] = sheetIndex + ':' + row + ':' + col
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(':')));
			var sheet = designer.Spread.getSheet(sheetIndex);
			if(sheet == null){
				continue;
			}
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(':') + 1,cellLink[0].lastIndexOf(':')));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(':') + 1));
			designer.Spread.suspendPaint();
			var activeCell = sheet.getCell(row, col);
			if(activeCell == null){
				continue;
			}
			if(activeCell.text() == ''){
				var displayText = '';
				for(var cellTag of cellTagStart){
					if (cellTag.isExternal == true) {
						displayText = displayText + ' ' + cellTag.urlText;
					} else {
						if(cellTag.displayText){
							displayText = displayText + ' ' + cellTag.displayText;
						}
					}
				}
				activeCell.text(displayText);
			}
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			activeCell.foreColor('blue');
			activeCell.textDecoration(GC.Spread.Sheets.TextDecorationType.underline);
			activeCell.cellType(new designer.ShowSingleLink());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.Spread.resumePaint();
		}
	};
	
	// 底稿取值类型
	var ShowDgFetch = (function () {
		function ShowDgFetch() {
			this.typeName = 'ShowDgFetch';
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
					style.foreColor = 'blue';
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					this._cellTagStartCache[i] = {
						startX: x + startTextWidth,
						textWidth: textWidth + 3,
						dgFileId: node.dgFileId,
						dgFileInputVal: node.dgFileInputVal,
						dgFileInputText: node.dgFileInputText,
						dgFileSelectVal: node.dgFileSelectVal,
						dgSheetSelectVal: node.dgSheetSelectVal,
						dgSheetName: node.dgSheetName,
						dgRange: node.dgRange,
						linkText: node.linkText,
						type: node.type
					};
					startTextWidth += (textWidth + 3);
				}
			}
			this._textWidth += startTextWidth;

			// Set Font to default
			style.foreColor = foreColor;
			style.textDecoration = textDecoration;

			//Paint Value
			// style.font = 'bold ' + style.font;
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
					$('#modal_dgFetch').modal('show');
					var dgFileInputText = self._cellTagStartCache[0].dgFileInputText;
					var dgFileId = dgFileInputText.substring(0, dgFileInputText.indexOf(':'));
					var dgFileIndexId = dgFileInputText.substring(dgFileInputText.indexOf(':') + 1);
					var dgFileName = self._cellTagStartCache[0].dgFileInputVal;
					var dgSheetIndex = self._cellTagStartCache[0].dgSheetSelectVal;
					var dgRange = self._cellTagStartCache[0].dgRange;
					if(dgFileId == designer.workpaperId){
						// var iframeId = 'iframe_dg_' + dgFileId;
						var sheetIndex = parseInt(dgSheetIndex);
						designer.Spread.setActiveSheetIndex(sheetIndex);
						var range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), dgRange, 0, 0);
						designer.Spread.getActiveSheet().setActiveCell(range.row, range.col);
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
			var canvasId = div.id + 'vp_vp';
			var canvas = $('#' + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div1 = document.createElement('div');
					$(div1).css('position', 'absolute')
						.css('border', '1px #C0C0C0 solid')
						.css('box-shadow', '1px 2px 5px rgba(0,0,0,0.4)')
						.css('font', '9pt Arial')
						.css('background', 'white')
						.css('padding', 5);
					this._toolTipElement = div1;
				}
				let dgFileInputVal = this._cellTagStartCache[hitInfo.reservedLocation].dgFileInputVal;
				let dgSheetName = this._cellTagStartCache[hitInfo.reservedLocation].dgSheetName;
				let dgRange = this._cellTagStartCache[hitInfo.reservedLocation].dgRange;
				$(this._toolTipElement).text(dgFileInputVal + ' -- ' + dgSheetName + ' -- ' + dgRange).css('top', hitInfo.y + 190).css('left', hitInfo.x + 15);
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show('fast');
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
				// cellStyle.font = 'bold ' + cellStyle.font;
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
		var strMap = new Map();
		// json转换为map
		for (var k of Object.keys(mapJson)) {
			var json = mapJson[k];
			var mappingJson = json.mapping;
			if(mappingJson) {
				for (var key of Object.keys(mappingJson)) {
					var newMap = {};
					newMap['dgFileId'] = json.dgFileId;
					newMap['dgFileInputText'] = json.dgFileInputText;
					newMap['dgFileInputVal'] = json.dgFileInputVal;
					if (json.dgFileSelectVal == '' || json.dgFileSelectVal == null || json.dgFileSelectVal === undefined) {
						newMap['dgFileSelectVal'] = json.dgFileInputText;
					}else{
						newMap['dgFileSelectVal'] = json.dgFileSelectVal;
					}
					newMap['linkText'] = json.linkText;
					newMap['type'] = json.type;
					var json1 = mappingJson[key];
					newMap['dgRange'] = json1.dgRange;
					newMap['dgSheetSelectVal'] = json1.dgSheetSelectVal;
					newMap['dgSheetName'] = json1.dgSheetName;
					var tagInfo = [];
					tagInfo.push(newMap);
					strMap.set(key, tagInfo);
				}
			}
		}
		designer.DgFetchCacheMap = strMap;
		for (var cellLink of designer.DgFetchCacheMap) {
			var cellTagStart = cellLink[1];
			if(cellTagStart && cellTagStart.length > 0){
				var autoId = cellTagStart[0].dgFileId;
				if(!checkDgExist(autoId)){
					cellTagStart.splice(0 , 1);
				}
			}
			// cellLink[0] = sheetIndex + ':' + row + ':' + col
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(':')));
			designer.Spread.setActiveSheetIndex(sheetIndex);
			var sheet = designer.Spread.getActiveSheet();
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(':') + 1,cellLink[0].lastIndexOf(':')));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(':') + 1));
			
			designer.Spread.suspendPaint();
			var activeCell = sheet.getCell(row, col);
			activeCell.cellType(new designer.ShowDgFetch());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.Spread.resumePaint();
		}
	};

	// 抽凭链接
	var ShowAuditSampling = (function () {
		function ShowAuditSampling() {
			this.typeName = 'ShowAuditSampling';
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
					style.foreColor = 'blue';
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					this._cellTagStartCache[i] = {
						startX: x + startTextWidth,
						textWidth: textWidth + 3,
						id: node.id,
						text: node.text,
						indexId: node.indexId,
						linkText: node.linkText,
						type: node.type
					};
					startTextWidth += (textWidth + 3);
				}
			}
			this._textWidth += startTextWidth;

			// Set Font to default
			style.foreColor = foreColor;
			style.textDecoration = textDecoration;

			//Paint Value
			// style.font = 'bold ' + style.font;
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
					var mapKey = hitInfo.sheet.parent.getActiveSheetIndex() + ':' + hitInfo.row + ':' + hitInfo.col;
					// 跳转底稿、抽凭附件链接页面
					goToAttachLink(mapKey);
				}, 10);
				return true;
			}
			return false;
		};

		ShowAuditSampling.prototype.processMouseMove = function (hitInfo) {
			var sheet = hitInfo.sheet;
			var div = sheet.getParent().getHost();
			var canvasId = div.id + 'vp_vp';
			var canvas = $('#' + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div1 = document.createElement('div');
					$(div1).css('position', 'absolute')
						.css('border', '1px #C0C0C0 solid')
						.css('box-shadow', '1px 2px 5px rgba(0,0,0,0.4)')
						.css('font', '9pt Arial')
						.css('background', 'white')
						.css('padding', 5);
					this._toolTipElement = div1;
				}
				$(this._toolTipElement).text(this._cellTagStartCache[hitInfo.reservedLocation].text).css('top', hitInfo.y + 190).css('left', hitInfo.x + 15);
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show('fast');
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
				// cellStyle.font = 'bold ' + cellStyle.font;
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
	designer.setShowAuditSamplingCacheMap = function (mapJson) {
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
			// cellLink[0] = sheetIndex + ':' + row + ':' + col
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(':')));
			var sheet = designer.Spread.getSheet(sheetIndex);
			if(sheet == null){
				continue;
			}
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(':') + 1,cellLink[0].lastIndexOf(':')));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(':') + 1));
			designer.Spread.suspendPaint();
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
			designer.Spread.resumePaint();
		}
	};

	// 现金流量表取值
	var ShowCashFlowInfo = (function () {
		function ShowCashFlowInfo() {
			this.typeName = 'ShowCashFlowInfo';
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
					style.foreColor = 'blue';
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
							reportValueType: node.reportValueType,
							linkText: node.linkText,
							type: node.type
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
							rangeStr: node.rangeStr,
							linkText: node.linkText,
							type: node.type
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
			// style.font = 'bold ' + style.font;
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
					$('#modal_cashflowFeature').modal('show');
				}, 10);
				return true;
			}
			return false;
		};

		ShowCashFlowInfo.prototype.processMouseMove = function (hitInfo) {
			var sheet = hitInfo.sheet;
			var div = sheet.getParent().getHost();
			var canvasId = div.id + 'vp_vp';
			var canvas = $('#' + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div1 = document.createElement('div');
					$(div1).css('position', 'absolute')
						.css('border', '1px #C0C0C0 solid')
						.css('box-shadow', '1px 2px 5px rgba(0,0,0,0.4)')
						.css('font', '9pt Arial')
						.css('background', 'white')
						.css('padding', 5);
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
					$(this._toolTipElement).text(toolTipElementText).css('top', hitInfo.y + 190).css('left', hitInfo.x + 15);
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
					$(this._toolTipElement).text(toolTipElementText).css('top', hitInfo.y + 190).css('left', hitInfo.x + 15);
				}
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show('fast');
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
				// cellStyle.font = 'bold ' + cellStyle.font;
				return 5 + this._textWidth + GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context);
			} else {
				return GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, value, text, cellStyle, zoomFactor, context)
			}
		};
		return ShowCashFlowInfo;
	})();
	designer.ShowCashFlowInfo = ShowCashFlowInfo;
	
	designer.CashFlowCacheMap = new Map();
	
	designer.setCashFlowCacheMap = function (mapJson) {
		if (mapJson === undefined) {return;}
		// 现金流量表取值
		let strMap = new Map();
		// json转换为map
		for (let k of Object.keys(mapJson)) {
			strMap.set(k, mapJson[k]);
		}
		designer.CashFlowCacheMap = strMap;
		var mapKeyArr = [];
		for (let cellLink of designer.CashFlowCacheMap) {
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(':')));
			designer.Spread.setActiveSheetIndex(sheetIndex);
			var sheet = designer.Spread.getActiveSheet();
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(':') + 1,cellLink[0].lastIndexOf(':')));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(':') + 1));
			var activeCell = sheet.getCell(row, col);
			var cellTagStart = cellLink[1];
			if(cellTagStart && cellTagStart.length > 0){
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
			designer.Spread.suspendPaint();
			activeCell.cellType(new designer.ShowCashFlowInfo());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.Spread.resumePaint();
		}
		for (let mapKey of mapKeyArr) {
			designer.CashFlowCacheMap.delete(mapKey);
		}
	};

	// 附注取值底稿类型
	var ShowNoteDgValueInfo = (function () {
		function ShowNoteDgValueInfo() {
			this.typeName = 'ShowNoteDgValueInfo';
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
					style.foreColor = 'blue';
					style.textDecoration = GC.Spread.Sheets.TextDecorationType.underline;
					var linkText = node.linkText;
					GC.Spread.Sheets.CellTypes.Text.prototype.paintContent.call(this, ctx, linkText, x + startTextWidth + 2, y, w - startTextWidth, h, style, context);
					var textWidth = GC.Spread.Sheets.CellTypes.Text.prototype.getAutoFitWidth.call(this, linkText, linkText, style, zoomFactor, context);
					this._cellTagStartCache[i] = {
						startX: x + startTextWidth,
						textWidth: textWidth + 3,
						dgFileId: node.dgFileId,
						dgFileInputVal: node.dgFileInputVal,
						dgFileInputText: node.dgFileInputText,
						dgFileSelectVal: node.dgFileSelectVal,
						dgSheetSelectVal: node.dgSheetSelectVal,
						dgSheetName: node.dgSheetName,
						dgRangeStart: node.dgRangeStart,
						dgRangeEnd: node.dgRangeEnd,
						linkText: node.linkText,
						type: node.type
					};
					startTextWidth += (textWidth + 3);
				}
			}
			this._textWidth += startTextWidth;

			// Set Font to default
			style.foreColor = foreColor;
			style.textDecoration = textDecoration;

			//Paint Value
			// style.font = 'bold ' + style.font;
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
					$('#modal_noteFeature').modal('show');
					var dgFileInputText = self._cellTagStartCache[0].dgFileInputText;
					var dgFileId = dgFileInputText.substring(0, dgFileInputText.indexOf(':'));
					var dgFileIndexId = dgFileInputText.substring(dgFileInputText.indexOf(':') + 1);
					var dgFileName = self._cellTagStartCache[0].dgFileInputVal;
					var dgSheetIndex = self._cellTagStartCache[0].dgSheetSelectVal;
					var dgRange = self._cellTagStartCache[0].dgRangeStart;
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
			var canvasId = div.id + 'vp_vp';
			var canvas = $('#' + canvasId)[0];
			if (sheet && hitInfo.isReservedLocation) {
				canvas.style.cursor = 'pointer';
				if (!this._toolTipElement) {
					var div1 = document.createElement('div');
					$(div1).css('position', 'absolute')
						.css('border', '1px #C0C0C0 solid')
						.css('box-shadow', '1px 2px 5px rgba(0,0,0,0.4)')
						.css('font', '9pt Arial')
						.css('background', 'white')
						.css('padding', 5);
					this._toolTipElement = div1;
				}
				let dgFileInputVal = this._cellTagStartCache[hitInfo.reservedLocation].dgFileInputVal;
				let dgFileInputText = this._cellTagStartCache[hitInfo.reservedLocation].dgFileInputText;
				let dgFileSelectVal = this._cellTagStartCache[hitInfo.reservedLocation].dgFileSelectVal;
				let dgSheetSelectVal = this._cellTagStartCache[hitInfo.reservedLocation].dgSheetSelectVal;
				let dgSheetName = this._cellTagStartCache[hitInfo.reservedLocation].dgSheetName;
				let dgRangeStart = this._cellTagStartCache[hitInfo.reservedLocation].dgRangeStart;
				let dgRangeEnd = this._cellTagStartCache[hitInfo.reservedLocation].dgRangeEnd;
				$(this._toolTipElement).text(dgFileInputVal + ' -- ' + dgSheetName + ' -- ' + dgRangeStart + ':' + dgRangeEnd).css('top', hitInfo.y + 190).css('left', hitInfo.x + 15);
				$(this._toolTipElement).hide();
				document.body.insertBefore(this._toolTipElement, null);
				$(this._toolTipElement).show('fast');
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
				// cellStyle.font = 'bold ' + cellStyle.font;
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
			if(cellTagStart && cellTagStart.length > 0){
				let autoId = cellTagStart[0].dgFileId;
				if(!checkDgExist(autoId)){
					cellTagStart.splice(0 , 1);
				}
			}
			// cellLink[0] = sheetIndex + ':' + row + ':' + col
			var sheetIndex = parseInt(cellLink[0].substring(0,cellLink[0].indexOf(':')));
			designer.Spread.setActiveSheetIndex(sheetIndex);
			var sheet = designer.Spread.getActiveSheet();
			var row = parseInt(cellLink[0].substring(cellLink[0].indexOf(':') + 1,cellLink[0].lastIndexOf(':')));
			var col = parseInt(cellLink[0].substring(cellLink[0].lastIndexOf(':') + 1));
			
			designer.Spread.suspendPaint();
			var activeCell = sheet.getCell(row, col);
			activeCell.cellType(new designer.ShowNoteDgValueInfo());
			activeCell.tag({
				cellTagStart: cellTagStart
			});
			// 居左
			activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
			designer.Spread.resumePaint();
		}
	};

	// 跳转到指定单元格
	designer.setCellLink = function () {
		let cellLinkFormula = $.sessionStorage('cellLinkFormula');
		if(cellLinkFormula != null && cellLinkFormula != '' && JSON.parse(cellLinkFormula) != ''){
			let formula = JSON.parse(cellLinkFormula);
			let sheetIndex = parseInt(formula.substring(0,formula.indexOf(':')));
			designer.Spread.setActiveSheetIndex(sheetIndex);
			let rangeStr = formula.substring(formula.indexOf(':') + 1);
			let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), rangeStr, 0, 0);
			designer.Spread.getActiveSheet().setActiveCell(range.row, range.col);
			var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
			designer.Spread.getActiveSheet().showRow(range.row, verticalPosition);
			// var horizontalPosition = GC.Spread.Sheets.HorizontalPosition.left;
			// designer.Spread.getActiveSheet().showCell(range.row, range.col, verticalPosition, horizontalPosition);
			$.sessionStorage('cellLinkFormula', '');
			return;
		}
		let cellLinkFormulaBySheetName = $.sessionStorage('cellLinkFormulaBySheetName');
		if(cellLinkFormulaBySheetName != null && cellLinkFormulaBySheetName != '' && JSON.parse(cellLinkFormulaBySheetName) != ''){
			let formula = JSON.parse(cellLinkFormulaBySheetName);
			let sheetName = formula.substring(0,formula.indexOf(':'));
			let sheetIndex = parseInt(designer.Spread.getSheetIndex(sheetName));
			designer.Spread.setActiveSheetIndex(sheetIndex);
			let rangeStr = formula.substring(formula.indexOf(':') + 1);
			let range = GC.Spread.Sheets.CalcEngine.formulaToRange(designer.Spread.getActiveSheet(), rangeStr, 0, 0);
			designer.Spread.getActiveSheet().setActiveCell(range.row, range.col);
			var verticalPosition = GC.Spread.Sheets.VerticalPosition.top;
			designer.Spread.getActiveSheet().showRow(range.row, verticalPosition);
			$.sessionStorage('cellLinkFormulaBySheetName', '');
		}
	};
}
