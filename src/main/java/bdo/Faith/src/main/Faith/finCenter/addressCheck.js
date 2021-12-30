$(document).ready(() => {

	var excelIo = new GC.Spread.Excel.IO(); // spreadIo 实例
	var checkExcel;// 验证excel 接口
	var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'));
	var countRow = 0;
	var errorRow = 0;
	var blankRow = 0;
	/**
	 * 设置高度
	 */
	getHeight = () => {
		return $(window).height();
	};
	(function initialize() {
		$('[data-toggle="block-option"][data-action="content_toggle"]').click();
		$('#ss').css('height', (getHeight() - 360) + 'px');
		spread.options.newTabVisible = false;

		spread.setSheetCount(1);
		spread.setActiveSheetIndex(0);
		initialStyle();
	})();

	function initialStyle() {
		var sheet = spread.getActiveSheet();
		sheet.name('函证地址验证');
		var spreadNS = GC.Spread.Sheets;
		var style = new spreadNS.Style();
		style.backColor = 'lightgreen';
		var textList = ['单位名称','单位地址','企查查单位名称','企查查注册地址','企查查注册地址匹配度','企查查通信地址','企查查通信地址匹配度','百度地址','百度地址匹配度'];
		for(var i = 0;i <= 8;i++){
			sheet.setStyle(0, i, style, spreadNS.SheetArea.viewport);
			sheet.setColumnWidth(i, 160);
			sheet.getCell(0, i).text(textList[i]).hAlign(GC.Spread.Sheets.HorizontalAlign.center);
		}
	}

	var fileName = '函证地址验证.xlsx';

	function getRangeStr() {
		var row = spread.getActiveSheet().getActiveRowIndex();
		var col = spread.getActiveSheet().getActiveColumnIndex();
		var range = new GC.Spread.Sheets.Range(row, col, 1, 1);
		var rangeStr = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, false).toString().replace(/\$/g, '');
		return rangeStr;
	}

	/** 获取单位名称所在列 */
	$('#col_customer').click(function() {
		var rangeStr = getRangeStr();
		$('#colCustomer').val(rangeStr.replace(/\d+/g, ''));
	});

	/** 获取单位地址所在列 */
	$('#col_address').click(function() {
		var rangeStr = getRangeStr();
		$('#colAddress').val(rangeStr.replace(/\d+/g, ''));
	});

	/** 获取企查查单位名称所在列 */
	$('#col_qccCompanyName').click(function() {
		var rangeStr = getRangeStr();
		$('#colQccCompanyName').val(rangeStr.replace(/\d+/g, ''));
	});
	
	/** 获取企查查注册地址所在列 */
	$('#col_qccRegAddress').click(function() {
		var rangeStr = getRangeStr();
		$('#colQccRegAddress').val(rangeStr.replace(/\d+/g, ''));
	});

	/** 获取企查查注册地址匹配度所在列 */
	$('#col_qccRegDegree').click(function() {
		var rangeStr = getRangeStr();
		$('#colQccRegDegree').val(rangeStr.replace(/\d+/g, ''));
	});
	
	/** 获取企查查通信地址所在列 */
	$('#col_qccMailAddress').click(function() {
		var rangeStr = getRangeStr();
		$('#colQccMailAddress').val(rangeStr.replace(/\d+/g, ''));
	});

	/** 获取企查查通信地址匹配度所在列 */
	$('#col_qccMailDegree').click(function() {
		var rangeStr = getRangeStr();
		$('#colQccMailDegree').val(rangeStr.replace(/\d+/g, ''));
	});

	/** 获取百度地址所在列 */
	$('#col_baiduAddress').click(function() {
		var rangeStr = getRangeStr();
		$('#colBaiduAddress').val(rangeStr.replace(/\d+/g, ''));
	});

	/** 获取百度地址匹配度所在列 */
	$('#col_baiduDegree').click(function() {
		var rangeStr = getRangeStr();
		$('#colBaiduDegree').val(rangeStr.replace(/\d+/g, ''));
	});

	/** excel表头字母转换数字 */
	function stringToNum(a) {
		var str = a.toLowerCase().split('');
		var num = 0;
		var al = str.length;
		var getCharNumber = function(charx) {
			return charx.charCodeAt() - 96;
		};
		var numout = 0;
		var charnum = 0;
		for (var i = 0; i < al; i++) {
			charnum = getCharNumber(str[i]);
			numout += charnum * Math.pow(26, al - i - 1);
		}
		return numout;
	}

	/** 模态框设置 */

	/*	$('.modal').on('show.bs.modal', function(){
			$(this).draggable({
				handle: '.block-header',
				cursor: 'move'
			});
			$(this).css('overflow', 'hidden');
		});*/

	function checkParam() {
		if ($('#colCustomer').val() == null || $('#colCustomer').val().trim() == '') {
			$('#colCustomer').focus();
			bdoInfoBox('提示', '请指定单位名称所在列');
			return false;
		}
		if ($('#colAddress').val() == null || $('#colAddress').val().trim() == '') {
			$('#colAddress').focus();
			bdoInfoBox('提示', '请指定单位地址所在列');
			return false;
		}
		if ($('#colQccCompanyName').val() == null || $('#colQccCompanyName').val().trim() == '') {
			$('#colQccCompanyName').focus();
			bdoInfoBox('提示', '请指定企查查单位名称所在列');
			return false;
		}
		if ($('#colQccRegAddress').val() == null || $('#colQccRegAddress').val().trim() == '') {
			$('#colQccRegAddress').focus();
			bdoInfoBox('提示', '请指定企查查注册地址所在列');
			return false;
		}
		if ($('#colQccRegDegree').val() == null || $('#colQccRegDegree').val().trim() == '') {
			$('#colQccRegDegree').focus();
			bdoInfoBox('提示', '请指定企查查注册地址匹配度所在列');
			return false;
		}
		if ($('#colQccMailAddress').val() == null || $('#colQccMailAddress').val().trim() == '') {
			$('#colQccMailAddress').focus();
			bdoInfoBox('提示', '请指定企查查通信地址所在列');
			return false;
		}
		if ($('#colQccMailDegree').val() == null || $('#colQccMailDegree').val().trim() == '') {
			$('#colQccMailDegree').focus();
			bdoInfoBox('提示', '请指定企查查通信地址匹配度所在列');
			return false;
		}
		if ($('#colBaiduAddress').val() == null || $('#colBaiduAddress').val().trim() == '') {
			$('#colBaiduAddress').focus();
			bdoInfoBox('提示', '请指定百度地址所在列');
			return false;
		}
		if ($('#colBaiduDegree').val() == null || $('#colBaiduDegree').val().trim() == '') {
			$('#colBaiduDegree').focus();
			bdoInfoBox('提示', '请指定百度匹配度所在列');
			return false;
		}
		return true;
	}
	// 各验证条件输入框光标离开时校验
	$('.block-search').on('blur', 'input[id^="col"]', event => {
		checkContent($(event.currentTarget));
	});
	// 校验
	function checkContent(data){
		// 校验各验证条件输入框内容不能一致
		var values = '';
		// 寻找要判断的input框
		$('input[id^="col"]').each(function(i, item){
			var value = $(this).val();
			// 获取所有的名称
			values += value; 
		});
		// 获得当前输入框的值
		var val = $(data).val();
		// 去除当前输入框的值
		var newValue = values.replace(val, '');
		if(newValue == ''){
			return false;
		}else{
			// 当前值和newValue作比较
			if(newValue.indexOf(val) > -1){
				bdoInfoBox('提示', '各验证条件不能相等');
				// 将重复的那个input框里的值清空
				$(data).val('');
			}
		}
	}
	/** 重置 */
	$('#file_refresh').click(function() {
		spread.options.newTabVisible = false;

		spread.clearSheets();
		var sheet = new GC.Spread.Sheets.Worksheet('Sheet1');
		spread.addSheet(0, sheet);

		spread.setSheetCount(1);
		spread.setActiveSheetIndex(0);
		initialStyle();
	});

	$('#file_import').click(function() {

		$('#modal-importFile').modal('show');

		var pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			browseLabel: '选择文件',
			showCaption: true,
			showRemove: false,
			showUpload: false,
			showBrowse: true,
			showPreview: false,
			required: true,
			allowedFileExtensions: ['xlsx'],//接收的文件后缀
			initialPreviewShowDelete: true,
			language: 'zh',
			browseOnZoneClick: true,
			showClose: false,
			uploadAsync: false,
			showCancel: false,
			hideThumbnailContent: true,
			layoutTemplates: {
				actionUpload: '',
				actionZoom: ''
			},
			fileActionSettings: {
				removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
			},
			uploadAsync: true,
			uploadUrl: 'finCenter/AddressCheck.importExcel.json',
			uploadExtraData: function() {
				return {
					param1: '',
					param2: ''
				};
			}
		};

		var $el = $('#fileinput').fileinput(pluginOpt);

		//uploadAsync = true 时调用
		$el.on('fileuploaded', function(event, data) {
			var excel = data.response.data[0].excelBase64Data;
			var file = dataURLtoFile(excel, fileName);
			excelIo.open(file, json => {
				spread.fromJSON(json);
				spread.options.newTabVisible = false;
				spread.setActiveSheetIndex(0);
				for (let i = 0; i < spread.getSheetCount(); i++) {
					let sheet = spread.getSheet(i);
					if(sheet.getColumnCount() < 20){
						sheet.setColumnCount(20);
					}else{
						sheet.setColumnCount(sheet.getColumnCount() + 5);
					}
					sheet.setActiveCell(0, 0);
				}
				var activeSheet = spread.getActiveSheet();
				activeSheet.addRows(0, 1);
				initialStyle();
				activeSheet.clear(101, 0, activeSheet.getRowCount(), activeSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
				activeSheet.deleteRows(101, activeSheet.getRowCount() - 101);
			}, e => {
				bdoErrorBox('失败', e.errorMessage);
			});
			bdoSuccessBox('导入成功');
			$('#modal-importFile').modal('hide');
			$('#fileinput').fileinput('clear');
			$('#fileinput').fileinput('enable');
		});

		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', msg);
		});

		//建议文件上传成功之后再提交其他表单数据
		function uploadFile() {
			$el.fileinput('upload');
		}

		/** 导入按钮 */
		$('#import_submit').click(function() {
			var fileUrl = $('#fileinput').val();
			if (fileUrl == null || fileUrl == '') {
				bdoInfoBox('提示', '请选择导入文件');
				return;
			}
			uploadFile();
		});
	});

	/** 验证按钮 */
	$('#address_check').click(function() {
		if (!checkParam()) {
			return;
		}
		var json = spread.toJSON();
		excelIo.save(json, blob => {
			var param = {};
			param.param1 = stringToNum($('#colCustomer').val());
			param.param2 = stringToNum($('#colAddress').val());
			param.param3 = stringToNum($('#colQccCompanyName').val());
			param.param4 = stringToNum($('#colQccRegAddress').val());
			param.param5 = stringToNum($('#colQccRegDegree').val());
			param.param6 = stringToNum($('#colQccMailAddress').val());
			param.param7 = stringToNum($('#colQccMailDegree').val());
			param.param8 = stringToNum($('#colBaiduAddress').val());
			param.param9 = stringToNum($('#colBaiduDegree').val());
			
			checkExcel(param, blob);
		}, e => {
			bdoErrorBox('失败', e.errorMessage);
		});
	});

	function setBaiduAddress(customer, province, i){
		var activeSheet = spread.getActiveSheet();
		var localSearch = new BMap.LocalSearch(province);
		localSearch.search(customer);
		localSearch.setSearchCompleteCallback(function(rs) {
			// 判断是否查找到地址
			if (rs != null && rs.getCurrentNumPois() > 0) {
				countRow++;
				// 单位地址
				var address_A = activeSheet.getValue(i, stringToNum($('#colAddress').val()) - 1);
				// 百度接口查找的单位地址
				var address_B = rs.getPoi(0).address;
				// 百度接口查找的单位地址
				activeSheet.setValue(i, stringToNum($('#colBaiduAddress').val()) - 1, address_B);
			}else{
				errorRow++;
				// 百度接口查找的单位地址
				activeSheet.setValue(i, stringToNum($('#colBaiduAddress').val()) - 1, '无');
			}
			if(countRow + errorRow == activeSheet.getRowCount() - 1 - blankRow){
				var mapJson = [];
				for(var j = 1;j < activeSheet.getRowCount();j++){
					var baiduAddress = activeSheet.getValue(j, stringToNum($('#colBaiduAddress').val()) - 1);
					var address = activeSheet.getValue(j, stringToNum($('#colAddress').val()) - 1);
					var mapString = {};
					mapString = {
						baiduAddress : baiduAddress,
						address : address
					};
					mapJson.push(mapString);
				}
				$.ajax({
					type: 'post',
					url: 'finCenter/AddressCheck.getSimilarDegree.json',
					async: false,
					data: {
						menuId: window.sys_menuId,
						param1: JSON.stringify(mapJson)
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							for(var j = 1;j < activeSheet.getRowCount();j++){
								var customerName = activeSheet.getValue(j, stringToNum($('#colCustomer').val()) - 1);
								if(customerName != null && customerName.trim() != ''){
									var compatibility = data.data[0].compatibility[j - 1];
									// 百度接口查找的单位地址
									activeSheet.setValue(j, stringToNum($('#colBaiduDegree').val()) - 1, compatibility);
									activeSheet.getCell(j, stringToNum($('#colQccRegDegree').val()) - 1).hAlign(GC.Spread.Sheets.HorizontalAlign.right);
									activeSheet.getCell(j, stringToNum($('#colQccMailDegree').val()) - 1).hAlign(GC.Spread.Sheets.HorizontalAlign.right);
									activeSheet.getCell(j, stringToNum($('#colBaiduDegree').val()) - 1).hAlign(GC.Spread.Sheets.HorizontalAlign.right);
								}
							}
							bdoSuccessBox('成功');
						}else{
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			}
		});
	}

	/**
	 * 地址验证
	 */
	checkExcel = (param, fileData) => {
		var formData = new FormData();
		$.each(param, (key, val) => {
			formData.append(key, val);
		});
		formData.append('file', fileData);
		bdoInProcessingBox('验证中');
		$.ajax({
			url: 'finCenter/AddressCheck.checkAddress.json',
			type: 'post',
			data: formData,
			contentType: false,
			processData: false,
			success(data) {
				if (data.success) {
					var excel = data.data[0].excelBase64Data;
					var file = dataURLtoFile(excel, fileName);
					excelIo.open(file, json => {
						spread.fromJSON(json);
						spread.options.newTabVisible = false;
						spread.setActiveSheetIndex(0);
						var activeSheet = spread.getActiveSheet();
						// 已使用区域的最大行
						var row = activeSheet.getRowCount();
						// 已使用区域的最大列
						var col = activeSheet.getColumnCount();
						for (let i = 0; i < spread.getSheetCount(); i++) {
							let sheet = spread.getSheet(i);
							if(sheet.getColumnCount() < 20){
								sheet.setColumnCount(20);
							}else{
								sheet.setColumnCount(sheet.getColumnCount() + 5);
							}
							sheet.setActiveCell(0, 0);
						}
						countRow = 0;
						errorRow = 0;
						blankRow = 0;
						for (let i = 1; i < row; i++) {
							var customer = activeSheet.getValue(i, stringToNum($('#colCustomer').val()) - 1);
							var province = activeSheet.getValue(i, stringToNum($('#colBaiduAddress').val()) - 1);
							if(customer != null && customer.trim() != ''){
								setBaiduAddress(customer, province, i);
							}else{
								blankRow++;
								activeSheet.setValue(i, stringToNum($('#colQccCompanyName').val()) - 1, '');
								activeSheet.setValue(i, stringToNum($('#colQccRegAddress').val()) - 1, '');
								activeSheet.setValue(i, stringToNum($('#colQccRegDegree').val()) - 1, '');
								activeSheet.setValue(i, stringToNum($('#colQccMailAddress').val()) - 1, '');
								activeSheet.setValue(i, stringToNum($('#colQccMailDegree').val()) - 1, '');
								activeSheet.setValue(i, stringToNum($('#colBaiduAddress').val()) - 1, '');
								activeSheet.setValue(i, stringToNum($('#colBaiduDegree').val()) - 1, '');
							}
						}
					}, e => {
						bdoErrorBox('失败', e.errorMessage);
					});
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	};

	/** 导出按钮 */
	$('#file_export').click((event) => {
		var json = spread.toJSON();
		excelIo.save(json, blob => {
			saveAs(blob, fileName);
		}, e => {
			bdoErrorBox('失败', e.errorMessage);
		});
	});

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
	 * 相似度转百分比
	 */
	function similarDegree(str_A, str_B) {
		// 两个字符串最大长度
		var temp = str_A.length > str_B.length ? str_A.length : str_B.length;
		// 两个字符串不同字符长度
		var temp2 = longestDifferentSubstring(str_A, str_B);
		// 两个字符串相同字符长度
		var temp3 = (str_A.length + str_B.length - temp2) / 2;
		return ((temp3 / temp) * 100).toFixed(1) + '%';
	}

	/**
	 * 相似字符
	 */
	function longestDifferentSubstring(s, t) {
		var n = s.length, m = t.length, d = [];
		var i, j, s_i, t_j, cost;
		if (n == 0) return m;
		if (m == 0) return n;
		for (i = 0; i <= n; i++) {
			d[i] = [];
			d[i][0] = i;
		}
		for (j = 0; j <= m; j++) {
			d[0][j] = j;
		}
		for (i = 1; i <= n; i++) {
			s_i = s.charAt(i - 1);
			for (j = 1; j <= m; j++) {
				t_j = t.charAt(j - 1);
				if (s_i == t_j) {
					cost = 0;
				} else {
					cost = 1;
				}
				d[i][j] = minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
			}
		}
		return d[n][m];
	}

	function minimum(a, b, c) {
		return a < b ? (a < c ? a : c) : (b < c ? b : c);
	}
});