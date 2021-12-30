function DgFunctionsPage(agrs) {
	var _template
		, _data
		, mount
		, listener
		, spread // spread 实例
		, spreadSummary // spread 实例
		, excelIo = new GC.Spread.Excel.IO() // spreadIo 实例;
	
	_data = _data ? _data : agrs.data;
	_template = agrs.template || tplLoader('dgCenter/html/dg/functions.html');
	agrs.template = _template;
	var billInfo = [];
	var signinInfo = [];
	var signatureInfo = [];
	var bankFileInfo = {};
	var supervisionSummaryInfo = [];

	listener = function() {
		/*********************银行函证功能start***********************/
		$('#modal_bank_hz_fetch').on('show.bs.modal', function() {
			$("#modal_bank_hz_fetch").find(".modal-content").css('width', '600px');
			var modalWidth = $('#modal_bank_hz_fetch').find(".modal-content").width();
			var left = '-' + parseInt(modalWidth) / 2 + 'px';
			$('#modal_bank_hz_fetch').css('margin-left', left);
			$('#title_hz_receive').html('');
			$('#div_hz_bank_2').css('display', 'none');
			$('#div_hz_bank_1').css('display', 'block');
			$('#div_hz_bank_3').css('display', 'none');
			$('#div_hz_bank_4').css('display', 'none');
			$('#label_hz_bank').html('1');
			$("#button_hz_bank_next").html('下一步');
			$('#button_hz_bank_return').css('display', 'none');
			$('#hz_spreadContent').empty();
			spread = new GC.Spread.Sheets.Workbook(document.getElementById('hz_spreadContent'));
			spread.options.newTabVisible = false;
			$('#inventoryModel_hz_bank').removeAttr('disabled');
			// queryAttachment('attach_hz_bank');
		});
		
		$('#button_hz_bank_next').on('click', function() {
			console.log('选择类型',$('#inventoryModel_hz_bank option:selected').val());
			var step = $('#label_hz_bank').html();
			console.log('step',step);
			if (step == 1) {
				bankFileInfo = {};
				bdoInProcessingBox('加载中');
				$.ajax({
					url: 'dgCenter/DgFunctions.browseBankResult.json',
					type: 'post',
					dataType: 'json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: $('#inventoryModel_hz_bank option:selected').val()
					},
					success(data) {
					if(data.success){
						$("#modal_bank_hz_fetch").find(".modal-content").css('width', '1200px');
						var modalWidth = $('#modal_bill_receive').find(".modal-content").width();
						var left = '-' + parseInt(modalWidth) / 2 + 'px';
						$('#modal_bank_hz_fetch').css('margin-left', left);
						var excel = data.data[0].excelBase64Data;
						var file = dataURLtoFile(excel, '备查簿.xlsx');
						excelIo.open(file, json => {
							var workbookObj = json;
							workbookObj = updateUsedRange(json);
							spread.fromJSON(workbookObj);
							spread.setActiveSheetIndex(0);
							// 重置下拉框
							$("#sheet_hz_bank").empty();
							for (var i = 0; i < spread.getSheetCount(); i++) {
								var sheet = spread.getSheet(i);
								$("#sheet_hz_bank").append("<option value='" + sheet.name() + "'>" + sheet.name() + "</option>");
							}
						}, e => {
							bdoErrorBox('失败', e.errorMessage);
						});
						$('#div_hz_bank_2').css('display', 'block');
						$('#div_hz_bank_1').css('display', 'none');
						$('#div_hz_bank_3').css('display', 'none');
						$('#div_hz_bank_4').css('display', 'none');
						$('#label_hz_bank').html('2');
						$('#title_hz_receive').html('（' + $('#inventoryModel_hz_bank option:selected').html() + ')');
						$("#button_hz_bank_next").html('下一步');
						$('#button_hz_bank_return').css('display', 'none');
						$('#inventoryModel_hz_bank').attr('disabled', 'true');
						bankFileInfo = data.data[1].listFile;
						bdoSuccessBox('成功', '加载完成');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
				});
			} else if (step == 2) {
				$('#hz_startrow_dg_file').parent().parent().css({'border': '0px'});
				$('#hz_endrow_dg_file').parent().parent().css({'border': '0px'});
				$('#hz_titlerow').parent().parent().css({'border': '0px'});
				$('#hz_startrow').parent().parent().css({'border': '0px'});
				$('#hz_endrow').parent().parent().css({'border': '0px'});
				var flag = true;
				var errorText = '';
				if(flag && $('#hz_startrow_dg_file').val() == ''){
					$('#hz_startrow_dg_file').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '底稿起始行';
				}
				if(flag && $('#hz_endrow_dg_file').val() == ''){
					$('#hz_endrow_dg_file').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '底稿结束行';
				}
				if(flag && $('#hz_titlerow').val() == ''){
					$('#hz_titlerow').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '备查簿标题行';
				}
				if(flag && $('#hz_startrow').val() == ''){
					$('#hz_startrow').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '备查簿起始行';
				}
				if(flag && $('#hz_endrow').val() == ''){
					$('#hz_endrow').parent().parent().css({'border': '1px dashed red'});
					flag = false;
					errorText = '备查簿结束行';
				}
				if (!flag) {
					bdoErrorBox('失败', '请输入' + errorText);
					return;
				}
				var titleRowNum = $('#hz_titlerow').val() - 1;
				var sheetName = $('#sheet_hz_bank option:selected').val();
				var sheetIndex = parseInt(spread.getSheetIndex(sheetName));
				var sheet = spread.getSheet(sheetIndex);
				$('select[name="data_hz_receive"]').each(function(){
					$(this).empty();
					$(this).append("<option value=''>未定义</option>");
					// 特殊处理,这五项在模板中为纵向合并，其文本值在第一行中，故当用户选择第二行列头的时候获取不到，所以将其特殊处理写死
					if ($(this).parent().parent().prev().children().children().text() == '询证函编号') {
						$(this).append("<option value='" + 0 + "'selected>询证函编号</option>");
						return true
					}
					if ($(this).parent().parent().prev().children().children().text() == '被询证银行') {
						$(this).append("<option value='" + 1 + "'selected>被询证银行</option>");
						return true
					}
					if ($(this).parent().parent().prev().children().children().text() == '被询证银行地址') {
						$(this).append("<option value='" + 2 + "'selected>被询证银行地址</option>");
						return true
					}
					if ($(this).parent().parent().prev().children().children().text() == '被询证银行联系人') {
						$(this).append("<option value='" + 3 + "'selected>被询证银行联系人</option>");
						return true
					}
					if ($(this).parent().parent().prev().children().children().text() == '联系电话（对公柜台）') {
						$(this).append("<option value='" + 4 + "'selected>联系电话（对公柜台）</option>");
						return true
					}
					for(var i = 0;i < sheet.getColumnCount();i++){
						if(sheet.getText(titleRowNum, i) != ''){
							if($(this).parent().parent().prev().children().children().text().trim() == sheet.getText(titleRowNum, i).trim()){
								$(this).append("<option value='" + i + "' selected>" + sheet.getText(titleRowNum, i) + "</option>");
							}else{
								$(this).append("<option value='" + i + "'>" + sheet.getText(titleRowNum, i) + "</option>");
							}
						}
					}
				});
				$('#div_hz_bank_1').css('display', 'none');
				$('#div_hz_bank_2').css('display', 'none');
				var inventoryModel = $('#inventoryModel_hz_bank option:selected').val();
				if(inventoryModel == 1){
					$('#div_hz_bank_3').css('display', 'block');
				}else if(inventoryModel == 2){
					$('#div_hz_bank_4').css('display', 'block');
				}else if(inventoryModel == 3){
					$('#div_hz_bank_5').css('display', 'block');
				}
				$('#label_hz_bank').html('3');
				$("#button_hz_bank_next").html('确定');
				$('#button_hz_bank_return').css('display', 'block');
			} else if (step == 3) {
				$('#modal_bank_hz_fetch').modal('hide');
				bdoInProcessingBox('数据取入中');
				setTimeout(function(){
					designer.Spread.suspendPaint();
					// 底稿
					var distSheet = designer.Spread.getActiveSheet();
					// 底稿开始行
					var startrow = parseInt($('#hz_startrow_dg_file').val());
					// 底稿结束行
					var endrow = parseInt($('#hz_endrow_dg_file').val());
					// 备查簿
					var srcSheet = spread.getSheet(parseInt(spread.getSheetIndex($('#sheet_hz_bank option:selected').val())));
					// 备查簿开始行
					var startrowSrc = parseInt($('#hz_startrow').val());
					// 备查簿结束行
					var endrowSrc = parseInt($('#hz_endrow').val());
					// 1 银行存款函证程序--div_hz_bank_3
					// 2 其他货币资金函证程序--div_hz_bank_4
					var _this;
					var inventoryModel = $('#inventoryModel_hz_bank option:selected').val();
					if(inventoryModel == 1){
						_this = $('#div_hz_bank_3 select[name="data_hz_receive"]');
					}else if(inventoryModel == 2){
						_this = $('#div_hz_bank_4 select[name="data_hz_receive"]');
					}else if(inventoryModel == 3){
						_this = $('#div_hz_bank_5 select[name="data_hz_receive"]');
					}
					
					/**
					获取源底稿和目标底稿的询证函编号，用map去存储源底稿去和目标底稿比较，map key储存询证函编号，value储存对应的行
					若get为null，则最新的源底稿无目标底稿的询证函编号，标记红色
					若get为有值，则代表具有相同的数据，再次判断其对应的单元格值是否被修改，若被修改，标记成黄色*/
					// 根据模板获取对应的询证函编号， 默认标题行第三行开始，取值单元格为第零列
					var distMap = new Map();
					var srcMap = new Map();
					for (var i = 2; i < srcSheet.getRowCount(); i++) {
						var srcDataNum = srcSheet.getValue(i,0);
						if (srcDataNum) {
							srcMap.set(srcDataNum.toString(),i);
						}
					}
					for (var i = 2; i < distSheet.getRowCount(); i++) {
						var distDataNum = distSheet.getValue(i,0);
						if (distDataNum) {
							if (!srcMap.get(distDataNum.toString())) {
								// 标记红色
								distSheet.getCell(i, 0).backColor("Red");
							}  else if (srcMap.get(distDataNum.toString())) {
								// 说明含有相同的数据，对指定的单元格进行校验，若不相同，标记黄色并修改
								$.each($(_this), function(index, item){
									if($(item).find('option:selected').val() != ''){
										var srcCol = parseInt($(item).find('option:selected').val());
										var distCol = parseInt($(item).attr('id').replace('data_hz_receive_', ''));
										if (distSheet.getCell(i, distCol) != srcSheet.getValue(srcMap.get(distDataNum.toString()), srcCol)) {
											// 标记黄色
											distSheet.getCell(i, 0).backColor("Yellow");
											distSheet.getCell(i, distCol).value(srcSheet.getValue(srcMap.get(distDataNum.toString()), srcCol));
										}
									}
								});
							}

							distMap.set(distDataNum.toString().toString(),i);
						}
					}
					// 底稿取值区域与备查簿取入区域  行数同步(底稿取值区域小则增加行)
					var num = endrowSrc - startrowSrc + 1 - (endrow - startrow);
					if(endrow - startrow < endrowSrc - startrowSrc + 1){
						distSheet.addRows(endrow - 1, num);
						for(var i = 0;i < num;i++){
							distSheet.copyTo(endrow - 1 - 1, 0, endrow - 1 + i, 0, 1, distSheet.getColumnCount(), GC.Spread.Sheets.CopyToOptions.all);
							for(var col = 0;col < distSheet.getColumnCount();col++){
								if(!distSheet.hasFormula(endrow - 1 + i, col)){
									distSheet.clear(endrow - 1 + i, col, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
								}
							}
							// distSheet.clear(endrow - 1 + i, 0, 1, distSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
						}
					}
					distSheet.clear(endrow - 1 + num, 0, 1, distSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
					var doneNum = 0;
					// 新增的时候查看源底稿的询证函编号是否在目标底稿中，不存在的话 插入（需要目标底稿map集合）
					for(var i = startrow;i < endrow - 1 + endrowSrc - startrowSrc + 1;i++){
						var keyCol;
						if(inventoryModel == 1 || inventoryModel == 2){
							keyCol = 0;
						}
						if(distSheet.getValue(i - 1, keyCol) == null || distSheet.getValue(i - 1, keyCol) == ''){
							
							$.each($(_this), function(index, item){
								if($(item).find('option:selected').val() != ''){
									var srcCol = parseInt($(item).find('option:selected').val());
									var distCol = parseInt($(item).attr('id').replace('data_hz_receive_', ''));
									distSheet.getCell(i - 1, distCol).value(srcSheet.getValue(startrowSrc - 1, srcCol));
								}
							});
							// 若源底稿中 询证函编号 存在与目标底稿中， 所以数据存在， 不另外新增， 在之前的逻辑中已经进行修改匹配了
							if (distMap.get(srcSheet.getValue(startrowSrc - 1, 0))) {
								distSheet.deleteRows(i - 1, 1);
								i--;
							}
							srcSheet.deleteRows(startrowSrc - 1, 1);
						}else{
							var isSame = false;
							for(var j = startrowSrc; j < endrowSrc - doneNum;j++){
								if(distSheet.getValue(i - 1, keyCol) == srcSheet.getValue(j - 1, keyCol)){
									$.each($(_this), function(index, item){
										if($(item).find('option:selected').val() != ''){
											var srcCol = parseInt($(item).find('option:selected').val());
											var distCol = parseInt($(item).attr('id').replace('data_hz_receive_', ''));
											distSheet.getCell(i - 1, distCol).value(srcSheet.getValue(j - 1, srcCol));
										}
									});
									srcSheet.deleteRows(startrowSrc - 1, 1);
									isSame = true;
									break;
								}
							}
							if(!isSame){
								$.each($(_this), function(index, item){
									if($(item).find('option:selected').val() != ''){
										var srcCol = parseInt($(item).find('option:selected').val());// data_bill_receive_
										var distCol = parseInt($(item).attr('id').replace('data_hz_receive_', ''));
										distSheet.getCell(i - 1, distCol).value(srcSheet.getValue(startrowSrc - 1, srcCol));
									}
								});
								srcSheet.deleteRows(startrowSrc - 1, 1);
							}
						}
						doneNum++;
						if(doneNum == endrowSrc - startrowSrc + 1){
							break;
						}
					}
					// 写入附件单向链接
					var bankFileSheetIndex = designer.Spread.getActiveSheetIndex();
					//bankFileInfo[202130593749] = bankFileInfo[202130593712];
					for (var i = 2; i < distSheet.getRowCount(); i++) {
						var distDataNum = distSheet.getValue(i,0);
						if(bankFileInfo[distDataNum] != null){
							var imageList = [];
							for(var data of bankFileInfo[distDataNum]){
								var fileUrl = data.fileUrl;
								imageList.push({urlText: '', url: fileUrl.replace(':\\','://'), urlTrpe: ''});
							}
							generateUrlLink(bankFileSheetIndex, i, 15, imageList);
						}
					}
					designer.Spread.resumePaint();
					bdoSuccessBox('成功', '数据取入成功');
				}, 100);
			}
		});
		
		$('#button_hz_bank_return').on('click', function() {
			var step = $('#label_hz_bank').html();
			if(step == 2){
				$("#modal_bank_hz_fetch").find(".modal-content").css('width', '600px');
				var modalWidth = $('#modal_bank_hz_fetch').find(".modal-content").width();
				var left = '-' + parseInt(modalWidth) / 2 + 'px';
				$('#modal_bank_hz_fetch').css('margin-left', left);
				$('#div_hz_bank_1').css('display', 'block');
				$('#div_hz_bank_2').css('display', 'none');
				$('#div_hz_bank_3').css('display', 'none');
				$('#div_hz_bank_4').css('display', 'none');
				$('#div_hz_bank_5').css('display', 'none');
				$('#div_hz_bank_6').css('display', 'none');
				$('#div_hz_bank_7').css('display', 'none');
				$('#label_hz_bank').html('1');
				$('#title_hz_receive').html('');
				$("#button_hz_bank_next").html('下一步');
				$('#button_hz_bank_return').css('display', 'none');
				$('#inventoryModel_hz_bank').removeAttr('disabled');
			}else if(step == 3){
				$('#div_hz_bank_1').css('display', 'none');
				$('#div_hz_bank_2').css('display', 'block');
				$('#div_hz_bank_3').css('display', 'none');
				$('#div_hz_bank_4').css('display', 'none');
				$('#div_hz_bank_5').css('display', 'none');
				$('#div_hz_bank_6').css('display', 'none');
				$('#div_hz_bank_7').css('display', 'none');
				$('#label_hz_bank').html('2');
				$("#button_hz_bank_next").html('下一步');
				$('#button_hz_bank_return').css('display', 'block');
			}
		});

		/*********************银行函证功能end***********************/
		// 应收票据功能
		$('#modal_bill_receive').on('show.bs.modal', function() {
			$('#modal_bill_receive').find('.modal-content').css('width', '600px');
			var modalWidth = $('#modal_bill_receive').find('.modal-content').width();
			var left = '-' + parseInt(modalWidth) / 2 + 'px';
			$('#modal_bill_receive').css('margin-left', left);
			$('#title_bill_receive').html('');
			$('#div_bill_receive_1').css('display', 'block');
			$('#div_bill_receive_2').css('display', 'none');
			$('#div_bill_receive_3').css('display', 'none');
			$('#div_bill_receive_4').css('display', 'none');
			$('#label_bill_receive').html('1');
			$('#button_bill_receive_next').html('下一步');
			$('#button_bill_receive_return').css('display', 'none');
			$('#inventoryModel_bill_receive').removeAttr('disabled');
			$('#radio_ma').show();
			$('#radio_sd').show();
			
			if ($('#isReceivable').val() == 1) {
				$('#headlabel').html('应收票据');
				$('#inventoryModel_bill_receive')[0].selectedIndex=4;
				$('#inventoryModel_bill_receive').attr('disabled','disabled');
				$('#radio_ma').hide();
				$('#radio_sd').hide();
				$('input[name=radio_bill_receive]').get(2).checked=true;
			} else {
				$('#headlabel').html('监盘系统');
				queryAttachment('attach_bill_receive');
			}

			$('#bill_spreadContent').empty();
			spread = new GC.Spread.Sheets.Workbook(document.getElementById('bill_spreadContent'));
			spread.options.newTabVisible = false;
			$('#supervision_summary_spreadContent').empty();
			$('#inventoryModel_supervision_summary').val($('#inventoryModel_bill_receive option:selected').val());
			spreadSummary = new GC.Spread.Sheets.Workbook(document.getElementById('supervision_summary_spreadContent'));
			spreadSummary.options.newTabVisible = false;
		});
		$('input[type=radio][name=radio_bill_receive]').change(function() {
			if (this.value == '1' || this.value == '2' || this.value == '4') {
				$('#bill_fileinput').fileinput('clear');
				$('#bill_fileinput').fileinput('enable');
			}
		});
		$('#button_bill_receive_next').on('click', function() {
			var step = $('#label_bill_receive').html();
			if(step == 1){
				bdoInProcessingBox('加载中');
				billInfo = [];
				signinInfo = [];
				signatureInfo = [];
				$('#sheet_bill_receive').empty();
				var type = $("input[name='radio_bill_receive']:checked").val();
				var inventoryModel = $('#inventoryModel_bill_receive option:selected').val();
				if(inventoryModel == '1'){
					// 1 存货
					$('#titlerow_dg_file').val(2);
					$('#startrow_dg_file').val(3);
					$('#endrow_dg_file').val(13);
				}
				if(inventoryModel == '2'){
					// 2 固定资产
					$('#titlerow_dg_file').val(4);
					$('#startrow_dg_file').val(5);
					$('#endrow_dg_file').val(13);
				}
				if(inventoryModel == '3'){
					// 3 在建工程
					$('#titlerow_dg_file').val(2);
					$('#startrow_dg_file').val(3);
					$('#endrow_dg_file').val(7);
				}
				if(inventoryModel == '4'){
					// 4 库存现金
					$('#titlerow_dg_file').val(2);
					$('#startrow_dg_file').val(3);
					$('#endrow_dg_file').val(11);
				}
				if(inventoryModel == '5'){
					// 5 票据
					if($('#isReceivable').val() == 1){
						$('#titlerow_dg_file').val(3);
						$('#startrow_dg_file').val(5);
						$('#endrow_dg_file').val(10);
					} else {
						$('#titlerow_dg_file').val(2);
						$('#startrow_dg_file').val(3);
						$('#endrow_dg_file').val(9);
					}
				}
				$('#titlerow_bill_receive').val(2);
				$('#startrow_bill_receive').val(3);
				if(type == 1){
					if($('#attach_bill_receive').val() != null && $('#attach_bill_receive option:selected').val() != ''){
						$.ajax({
							url: 'dgCenter/DgFunctions.browseDgAttachment.json',
							// async: false,
							type: 'post',
							dataType: 'json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: $('#attach_bill_receive option:selected').val()
							},
							success(data) {
								if(data.success){
									$('#modal_bill_receive').find('.modal-content').css('width', '1200px');
									var modalWidth = $('#modal_bill_receive').find('.modal-content').width();
									var left = '-' + parseInt(modalWidth) / 2 + 'px';
									$('#modal_bill_receive').css('margin-left', left);
									var excel = data.data[0].excelBase64Data;
									var file = dataURLtoFile(excel, '备查簿.xlsx');
									excelIo.open(file, json => {
										var workbookObj = json;
										workbookObj = updateUsedRange(json);
										spread.fromJSON(workbookObj);
										spread.setActiveSheetIndex(0);
										for (var i = 0; i < spread.getSheetCount(); i++) {
											var sheet = spread.getSheet(i);
											$('#sheet_bill_receive').append("<option value='" + sheet.name() + "'>" + sheet.name() + "</option>");
										}
									}, e => {
										bdoErrorBox('失败', e.errorMessage);
									});
									$('#div_bill_receive_1').css('display', 'none');
									$('#div_bill_receive_2').css('display', 'block');
									$('#div_bill_receive_3').css('display', 'none');
									$('#div_bill_receive_4').css('display', 'none');
									$('#label_bill_receive').html('2');
									$('#button_bill_receive_next').html('下一步');
									$('#button_bill_receive_return').css('display', 'block');
									$('#inventoryModel_bill_receive').attr('disabled', 'true');
									bdoSuccessBox('成功', '加载完成');
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}else{
						bdoInfoBox('提示', '底稿附件选择不能为空');
					}
				}else if(type == 2){
					$.ajax({
						url: 'dgCenter/DgFunctions.browseSuperviseResult.json',
						// async: false,
						type: 'post',
						dataType: 'json',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: $('#inventoryModel_bill_receive option:selected').val()
						},
						success(data) {
							if(data.success){
								$('#modal_bill_receive').find('.modal-content').css('width', '1200px');
								var modalWidth = $('#modal_bill_receive').find('.modal-content').width();
								var left = '-' + parseInt(modalWidth) / 2 + 'px';
								$('#modal_bill_receive').css('margin-left', left);
								var excel = data.data[0].excelBase64Data;
								var file = dataURLtoFile(excel, '备查簿.xlsx');
								excelIo.open(file, json => {
									var workbookObj = json;
									workbookObj = updateUsedRange(json);
									spread.fromJSON(workbookObj);
									spread.setActiveSheetIndex(0);
									for (var i = 0; i < spread.getSheetCount(); i++) {
										var sheet = spread.getSheet(i);
										$('#sheet_bill_receive').append("<option value='" + sheet.name() + "'>" + sheet.name() + "</option>");
									}
								}, e => {
									bdoErrorBox('失败', e.errorMessage);
								});
								$('#div_bill_receive_1').css('display', 'none');
								$('#div_bill_receive_2').css('display', 'block');
								$('#div_bill_receive_3').css('display', 'none');
								$('#div_bill_receive_4').css('display', 'none');
								$('#label_bill_receive').html('2');
								$('#title_bill_receive').html('（' + $('#inventoryModel_bill_receive option:selected').html() + ')');
								$('#button_bill_receive_next').html('下一步');
								$('#button_bill_receive_return').css('display', 'block');
								$('#inventoryModel_bill_receive').attr('disabled', 'true');
								billInfo = data.data[1].list;
								$('#endrow_bill_receive').val(3 + data.data[1].list.length);
								signinInfo = data.data[1].listSignin;
								signatureInfo = data.data[1].listSignature;
								bdoSuccessBox('成功', '加载完成');
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				}else if(type == 3){
					var fileUrl = $('#bill_fileinput').val();
					if (fileUrl == null || fileUrl == '') {
						bdoInfoBox('提示', '请上传备查簿');
						return;
					}
					bill_uploadFile();
				}else if(type == 4){
					$.ajax({
						url: 'dgCenter/DgFunctions.querySuperviseSummary.json',
						// async: false,
						type: 'post',
						dataType: 'json',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: $('#inventoryModel_bill_receive option:selected').val()
						},
						success(data) {
							if(data.success){
								$('#modal_bill_receive').find('.modal-content').css('width', '1200px');
								var modalWidth = $('#modal_bill_receive').find('.modal-content').width();
								var left = '-' + parseInt(modalWidth) / 2 + 'px';
								$('#modal_bill_receive').css('margin-left', left);
								/*$('#modal_bill_receive').modal('hide');
								$('#modal_supervision_summary').modal('show');*/
								/*setTimeout(function(){

								}, 100);*/
								var excel = data.data[0].excelBase64Data;
								var file = dataURLtoFile(excel, '监盘计划清单.xlsx');
								excelIo.open(file, json => {
									var workbookObj = json;
									workbookObj = updateUsedRange(json);
									spreadSummary.fromJSON(workbookObj);
									spreadSummary.setActiveSheetIndex(0);
									for (var i = 0; i < spread.getSheetCount(); i++) {
										var sheet = spread.getSheet(i);
										$('#sheet_bill_receive').append("<option value='" + sheet.name() + "'>" + sheet.name() + "</option>");
									}
								}, e => {
									bdoErrorBox('失败', e.errorMessage);
								});
								$('#div_bill_receive_1').css('display', 'none');
								$('#div_bill_receive_2').css('display', 'none');
								$('#div_bill_receive_3').css('display', 'none');
								$('#div_bill_receive_4').css('display', 'block');
								$('#label_bill_receive').html('2');
								$('#title_bill_receive').html('（' + $('#inventoryModel_bill_receive option:selected').html() + ')');
								$('#button_bill_receive_next').html('确定');
								$('#button_bill_receive_return').css('display', 'block');
								$('#inventoryModel_bill_receive').attr('disabled', 'true');
								supervisionSummaryInfo = data.data[1].list;
								bdoSuccessBox('成功', '加载完成');
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				}
			}else if(step == 2){
				var type = $("input[name='radio_bill_receive']:checked").val();
				if(type == 4){
					$('#modal_bill_receive').modal('hide');
					bdoInProcessingBox('备查簿数据取入中');
					setTimeout(function(){
						designer.Spread.suspendPaint();
						//if(supervisionSummaryInfo.length > 0){
						// 监盘计划清单
						copySheetStyle(spreadSummary, '监盘计划清单');
						copySheetSign(spreadSummary, '监盘计划清单', '监盘计划清单');
						//}
						designer.Spread.resumePaint();
						bdoSuccessBox('成功', '备查簿数据取入成功');
					}, 100);
				}else{
					bdoInProcessingBox('数据加载中');
					setTimeout(function(){
						$('#titlerow_dg_file').parent().parent().css({'border': '0px'});
						$('#startrow_dg_file').parent().parent().css({'border': '0px'});
						$('#endrow_dg_file').parent().parent().css({'border': '0px'});
						$('#titlerow_bill_receive').parent().parent().css({'border': '0px'});
						$('#startrow_bill_receive').parent().parent().css({'border': '0px'});
						$('#endrow_bill_receive').parent().parent().css({'border': '0px'});
						var flag = true;
						var errorText = '';
						if(flag && $('#titlerow_dg_file').val() == ''){
							$('#titlerow_dg_file').parent().parent().css({'border': '1px dashed red'});
							flag = false;
							errorText = '底稿标题行';
						}
						if(flag && $('#startrow_dg_file').val() == ''){
							$('#startrow_dg_file').parent().parent().css({'border': '1px dashed red'});
							flag = false;
							errorText = '底稿起始行';
						}
						if(flag && $('#endrow_dg_file').val() == ''){
							$('#endrow_dg_file').parent().parent().css({'border': '1px dashed red'});
							flag = false;
							errorText = '底稿结束行';
						}
						if(flag && $('#titlerow_bill_receive').val() == ''){
							$('#titlerow_bill_receive').parent().parent().css({'border': '1px dashed red'});
							flag = false;
							errorText = '备查簿标题行';
						}
						if(flag && $('#startrow_bill_receive').val() == ''){
							$('#startrow_bill_receive').parent().parent().css({'border': '1px dashed red'});
							flag = false;
							errorText = '备查簿起始行';
						}
						if(flag && $('#endrow_bill_receive').val() == ''){
							$('#endrow_bill_receive').parent().parent().css({'border': '1px dashed red'});
							flag = false;
							errorText = '备查簿结束行';
						}
						if (!flag) {
							bdoErrorBox('失败', '请输入' + errorText);
							return;
						}
						var titleInfo = [];
						var sheetDg = designer.Spread.getActiveSheet();
						var titleRowDg = $('#titlerow_dg_file').val();
						for(var i = 1;i <= sheetDg.getColumnCount();i++){
							var title = getTitle(sheetDg, titleRowDg, i);
							if(title != null && title != ''){
								var titleInfoParam = {
									col : i,
									text: title
								};
								titleInfo.push(titleInfoParam);
							}
						}
						var length = 0;
						if(titleInfo.length % 2 == 0){
							length = titleInfo.length / 2;
						} else {
							length = (titleInfo.length + 1) / 2;
						}
						$('#div_bill_receive_3').empty();
						var $html = $('<div class="row"><div class="form-group"><div class="col-sm-2" style="border-right: groove;"><div class="form-material"><h4>备查簿列名</h4></div></div><div class="col-sm-2"><div class="form-material"><h4>数据源</h4></div></div><div class="col-sm-2"></div><div class="col-sm-2" style="border-right: groove;"><div class="form-material"><h4>备查簿列名</h4></div></div><div class="col-sm-2"><div class="form-material"><h4>数据源</h4></div></div></div></div>');
						$('#div_bill_receive_3').append($html);
						for(var i = 0;i < length;i++){
							if((i + 1) * 2 <= titleInfo.length){
								var $div = $('<div class="row"><div class="form-group">'
									+ 	'<div class="col-sm-2" style="border-right: groove;">'
									+ 		'<div class="form-material">'
									+ 			'<h6>' + titleInfo[i].text + '</h6>'
									+ 		'</div>'
									+ 	'</div>'
									+ 	'<div class="col-sm-2">'
									+ 		'<div class="form-material" style="margin-top: 0px; margin-bottom: 0px;">'
									+ 			'<select class="js-select2 form-control" id="data_bill_receive_' + (titleInfo[i].col - 1) + '" name="data_bill_receive" style="width: 100%;"></select>'
									+ 		'</div>'
									+ 	'</div>'
									+ 	'<div class="col-sm-2">'
									+ 	'</div>'
									+ 	'<div class="col-sm-2" style="border-right: groove;">'
									+ 		'<div class="form-material">'
									+ 			'<h6>' + titleInfo[i + length].text + '</h6>'
									+ 		'</div>'
									+ 	'</div>'
									+ 	'<div class="col-sm-2">'
									+ 		'<div class="form-material" style="margin-top: 0px; margin-bottom: 0px;">'
									+ 			'<select class="js-select2 form-control" id="data_bill_receive_' + (titleInfo[i + length].col - 1) + '" name="data_bill_receive" style="width: 100%;"></select>'
									+ 		'</div>'
									+ 	'</div>'
									+ '</div></div>');
								$('#div_bill_receive_3').append($div);
							} else {
								var $div = $('<div class="row"><div class="form-group">'
									+ 	'<div class="col-sm-2" style="border-right: groove;">'
									+ 		'<div class="form-material">'
									+ 			'<h6>' + titleInfo[i].text + '</h6>'
									+ 		'</div>'
									+ 	'</div>'
									+ 	'<div class="col-sm-2">'
									+ 		'<div class="form-material" style="margin-top: 0px; margin-bottom: 0px;">'
									+ 			'<select class="js-select2 form-control" id="data_bill_receive_' + (titleInfo[i].col - 1) + '" name="data_bill_receive" style="width: 100%;"></select>'
									+ 		'</div>'
									+ 	'</div>'
									+ 	'<div class="col-sm-2">'
									+ 	'</div>'
									+ '</div></div>');
								$('#div_bill_receive_3').append($div);
							}
						}
						var titleRowNum = $('#titlerow_bill_receive').val() - 1;
						var sheetName = $('#sheet_bill_receive option:selected').val();
						var sheetIndex = parseInt(spread.getSheetIndex(sheetName));
						var sheet = spread.getSheet(sheetIndex);
						$('select[name="data_bill_receive"]').each(function(){
							$(this).empty();
							$(this).append('<option value="" style="color: red;">未定义</option>');
							var hasSelected = false;
							for(var i = 0;i < sheet.getColumnCount();i++){
								if(sheet.getText(titleRowNum, i) != ''){
									if($(this).parent().parent().prev().children().children().text().trim() == sheet.getText(titleRowNum, i).trim()){
										hasSelected = true;
										$(this).append('<option value="' + i + '" selected>' + sheet.getText(titleRowNum, i) + '</option>');
									}else if(!hasSelected && $(this).parent().parent().prev().children().children().text().trim().indexOf(sheet.getText(titleRowNum, i).trim()) >= 0){
										hasSelected = true;
										$(this).append('<option value="' + i + '" selected>' + sheet.getText(titleRowNum, i) + '</option>');
									}else{
										$(this).append('<option value="' + i + '">' + sheet.getText(titleRowNum, i) + '</option>');
									}
								}
							}
							if(this.value == ''){
								$(this).css('color', 'red');
							}
						});
						$('select[name="data_bill_receive"]').click(function(){
							$(this).css('color', 'inherit');
						});
						$('select[name="data_bill_receive"]').blur(function(){
							if(this.value == ''){
								$(this).css('color', 'red');
							}
						});
						/*$('select[name="data_bill_receive"]').change(function(){
                            if(this.value == ''){
                                $(this).css('color', 'red');
                            }
                        });*/
						$('#div_bill_receive_1').css('display', 'none');
						$('#div_bill_receive_2').css('display', 'none');
						$('#div_bill_receive_3').css('display', 'block');
						$('#div_bill_receive_4').css('display', 'none');
						$('#label_bill_receive').html('3');
						$('#button_bill_receive_next').html('确定');
						$('#button_bill_receive_return').css('display', 'block');
						bdoSuccessBox('完成');
					}, 100);
				}

			}else if(step == 3){
				$('#modal_bill_receive').modal('hide');
				bdoInProcessingBox('备查簿数据取入中');
				setTimeout(function(){
					designer.Spread.suspendPaint();
					// 底稿
					var distSheet = designer.Spread.getActiveSheet();
					// 底稿开始行
					var startrow = parseInt($('#startrow_dg_file').val());
					// 底稿结束行
					var endrow = parseInt($('#endrow_dg_file').val());
					// 备查簿
					var srcSheet = spread.getSheet(parseInt(spread.getSheetIndex($('#sheet_bill_receive option:selected').val())));
					// 备查簿开始行
					var startrowSrc = parseInt($('#startrow_bill_receive').val());
					// 备查簿结束行
					var endrowSrc = parseInt($('#endrow_bill_receive').val());
					// 1 存货
					// 2 固定资产
					// 3 在建工程
					// 4 库存现金
					// 5 票据
					var _this = $('#div_bill_receive_3 select[name="data_bill_receive"]');
					var inventoryModel = $('#inventoryModel_bill_receive option:selected').val();
					// 底稿取值区域与备查簿取入区域  行数同步(底稿取值区域小则增加行)
					var num = endrowSrc - startrowSrc + 1 - (endrow - startrow);
					if(endrow - startrow < endrowSrc - startrowSrc + 1){
						distSheet.addRows(endrow - 1, num);
						for(var i = 0;i < num;i++){
							distSheet.copyTo(endrow - 1 - 1, 0, endrow - 1 + i, 0, 1, distSheet.getColumnCount(), GC.Spread.Sheets.CopyToOptions.all);
							for(var col = 0;col < distSheet.getColumnCount();col++){
								if(!distSheet.hasFormula(endrow - 1 + i, col)){
									distSheet.clear(endrow - 1 + i, col, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
								}
							}
							// distSheet.clear(endrow - 1 + i, 0, 1, distSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
						}
					}
					distSheet.clear(endrow - 1 + num, 0, 1, distSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
					var doneNum = 0;
					var tmpendrow = endrow;
					if (startrow == endrow) {
						tmpendrow += 1;
					}
					for(var i = startrow;i < tmpendrow - 1 + endrowSrc - startrowSrc + 1;i++){
						// 存货、固定资产、在建工程--C列
						// 库存现金、票据--B列
						var keyCol;
						if(inventoryModel == 1 || inventoryModel == 2 || inventoryModel == 3){
							keyCol = 2;
						}else if(inventoryModel == 4 || inventoryModel == 5){
							keyCol = 1;
						}
						if(distSheet.getValue(i - 1, keyCol) == null || distSheet.getValue(i - 1, keyCol) == ''){
							$.each($(_this), function(index, item){
								if($(item).find('option:selected').val() != ''){
									var srcCol = parseInt($(item).find('option:selected').val());
									var distCol = parseInt($(item).attr('id').replace('data_bill_receive_', ''));
									distSheet.getCell(i - 1, distCol).value(srcSheet.getValue(startrowSrc - 1, srcCol));
								}
							});
							srcSheet.deleteRows(startrowSrc - 1, 1);
						}else{
							var isSame = false;
							for(var j = startrowSrc; j < endrowSrc - doneNum;j++){
								if(distSheet.getValue(i - 1, keyCol) == srcSheet.getValue(j - 1, keyCol)){
									$.each($(_this), function(index, item){
										if($(item).find('option:selected').val() != ''){
											var srcCol = parseInt($(item).find('option:selected').val());
											var distCol = parseInt($(item).attr('id').replace('data_bill_receive_', ''));
											distSheet.getCell(i - 1, distCol).value(srcSheet.getValue(j - 1, srcCol));
										}
									});
									srcSheet.deleteRows(startrowSrc - 1, 1);
									isSame = true;
									break;
								}
							}
							if(!isSame){
								$.each($(_this), function(index, item){
									if($(item).find('option:selected').val() != ''){
										var srcCol = parseInt($(item).find('option:selected').val());
										var distCol = parseInt($(item).attr('id').replace('data_bill_receive_', ''));
										distSheet.getCell(i - 1, distCol).value(srcSheet.getValue(startrowSrc - 1, srcCol));
									}
								});
								srcSheet.deleteRows(startrowSrc - 1, 1);
							}
						}
						doneNum++;
						if(doneNum == endrowSrc - startrowSrc + 1){
							break;
						}
					}
					if(billInfo.length > 0 || signinInfo.length > 0 || signatureInfo.length > 0){
						// 签到签名
						copySheetStyle(spread, '签到签名');
						//if(signinInfo.length > 0){
							copySheetSign(spread, '签到记录', '签到签名');
						//}
						//if(signatureInfo.length > 0){
							copySheetSign(spread, '签名记录', '签到签名');
						//}
					}
					if($('#isReceivable').val() != 1){
						//var startIndex = spread.getSheetIndex('币种明细模板');
						for(var i = 0;i < spread.getSheetCount();i++){
							if(containsNumber(spread.getSheet(i).name())){
								copySheetSign(spread, spread.getSheet(i).name(), '签到签名');
							}
						}
					}
					// 库存现金盘点核对表
					if(inventoryModel == '4'){
						setCashData();
					}
					// 写入单向链接url
					setUrlLink(inventoryModel, startrow);
					designer.Spread.resumePaint();
					bdoSuccessBox('成功', '备查簿数据取入成功');
				}, 100);
			}
		});

		$('#button_bill_receive_return').on('click', function() {
			var step = $('#label_bill_receive').html();
			if(step == 2){
				$('#modal_bill_receive').find('.modal-content').css('width', '600px');
				var modalWidth = $('#modal_bill_receive').find('.modal-content').width();
				var left = '-' + parseInt(modalWidth) / 2 + 'px';
				$('#modal_bill_receive').css('margin-left', left);
				$('#div_bill_receive_1').css('display', 'block');
				$('#div_bill_receive_2').css('display', 'none');
				$('#div_bill_receive_3').css('display', 'none');
				$('#div_bill_receive_4').css('display', 'none');
				$('#label_bill_receive').html('1');
				$('#title_bill_receive').html('');
				$('#button_bill_receive_next').html('下一步');
				$('#button_bill_receive_return').css('display', 'none');
				if ($('#isReceivable').val() != 1) {
					$('#inventoryModel_bill_receive').removeAttr('disabled');
				}
			}else if(step == 3){
				$('#div_bill_receive_1').css('display', 'none');
				$('#div_bill_receive_2').css('display', 'block');
				$('#div_bill_receive_3').css('display', 'none');
				$('#div_bill_receive_4').css('display', 'none');
				$('#label_bill_receive').html('2');
				$('#button_bill_receive_next').html('下一步');
				$('#button_bill_receive_return').css('display', 'block');
			}
		});

		var bill_pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			browseLabel: '备查簿',
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
			uploadUrl: 'dgCenter/DgFunctions.browseUploadExcel.json',
			uploadExtraData: function() {
				return {
					param1: '',
					param2: ''
				};
			}
		};

		var $bill_el = $('#bill_fileinput').fileinput(bill_pluginOpt);

		//uploadAsync = true 时调用
		$bill_el.on('fileuploaded', function(event, data) {
			$('#modal_bill_receive').find('.modal-content').css('width', '1200px');
			var modalWidth = $('#modal_bill_receive').find('.modal-content').width();
			var left = '-' + parseInt(modalWidth) / 2 + 'px';
			$('#modal_bill_receive').css('margin-left', left);
			var excel = data.response.data[0].excelBase64Data;
			var file = dataURLtoFile(excel, '备查簿.xlsx');
			excelIo.open(file, json => {
				var workbookObj = json;
				workbookObj = updateUsedRange(json);
				spread.fromJSON(workbookObj);
				spread.setActiveSheetIndex(0);
				for (var i = 0; i < spread.getSheetCount(); i++) {
					var sheet = spread.getSheet(i);
					$('#sheet_bill_receive').append("<option value='" + sheet.name() + "'>" + sheet.name() + "</option>");
				}
			}, e => {
				bdoErrorBox('失败', e.errorMessage);
			});
			$('#div_bill_receive_1').css('display', 'none');
			$('#div_bill_receive_2').css('display', 'block');
			$('#div_bill_receive_3').css('display', 'none');
			$('#div_bill_receive_4').css('display', 'none');
			$('#label_bill_receive').html('2');
			$('#button_bill_receive_next').html('下一步');
			$('#button_bill_receive_return').css('display', 'block');
			
			$('#bill_fileinput').fileinput('clear');
			$('#bill_fileinput').fileinput('enable');
			$('#inventoryModel_bill_receive').attr('disabled', 'true');
			bdoSuccessBox('成功', '加载完成');
		});

		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$bill_el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', msg);
		});

		//建议文件上传成功之后再提交其他表单数据
		function bill_uploadFile() {
			$bill_el.fileinput('upload');
		}
		
		// 折旧摊销计价功能
		$('#modal_depreciation_amortization_valuation').on('show.bs.modal', function() {
			$('#modal_depreciation_amortization_valuation').find('.modal-content').css('width', '600px');
			var modalWidth = $('#modal_depreciation_amortization_valuation').find('.modal-content').width();
			var left = '-' + parseInt(modalWidth) / 2 + 'px';
			$('#modal_depreciation_amortization_valuation').css('margin-left', left);
			$('#title_dav').html('');
			$('#div_dav_1').css('display', 'block');
			$('#div_dav_2').css('display', 'none');
			$('#div_dav_3').css('display', 'none');
			$('#div_dav_4').css('display', 'none');
			$('#label_dav').html('1');
			$('#button_dav_next').html('下一步');
			$('#button_dav_return').css('display', 'none');
			if ($('#progressType').val() == 1) {
				$('#davheadlabel').html('固定资产折旧测试');
			} else if ($('#progressType').val() == 2) {
				$('#davheadlabel').html('无形资产摊销测试');
			} else if ($('#progressType').val() == 3) {
				$('#davheadlabel').html('原材料计价测试');
			} else if ($('#progressType').val() == 4) {
				$('#davheadlabel').html('库存商品计价测试');
			}
			$('input[name=radio_dav]').get(0).checked=true;
			$('#dav_spreadContent').empty();
			spread = new GC.Spread.Sheets.Workbook(document.getElementById('dav_spreadContent'));
			spread.options.newTabVisible = false;
			$('#dav_supervision_summary_spreadContent').empty();
			spreadSummary = new GC.Spread.Sheets.Workbook(document.getElementById('dav_supervision_summary_spreadContent'));
			spreadSummary.options.newTabVisible = false;
		});
		$('#button_dav_next').on('click', function() {
			var step = $('#label_dav').html();
			if(step == 1){
				bdoInProcessingBox('加载中');
				$('#sheet_dav').empty();
				var type = $("input[name='radio_dav']:checked").val();
				if($('#progressType').val() == 1) {
					$('#titlerow_dav_dg_file').val(7);
					$('#startrow_dav_dg_file').val(8);
					$('#endrow_dav_dg_file').val(12);
				} else if($('#progressType').val() == 2) {
					$('#titlerow_dav_dg_file').val(2);
					$('#startrow_dav_dg_file').val(3);
					$('#endrow_dav_dg_file').val(7);
				} else {
					$('#titlerow_dav_dg_file').val(4);
					$('#startrow_dav_dg_file').val(5);
					$('#endrow_dav_dg_file').val(17);
				}
				$('#titlerow_dav').val(2);
				$('#startrow_dav').val(3);
				var fileUrl = $('#dav_fileinput').val();
				if (fileUrl == null || fileUrl == '') {
					bdoInfoBox('提示', '请上传备查簿');
					return;
				}
				dav_uploadFile();
			}else if(step == 2){
				var type = $("input[name='radio_dav']:checked").val();
				bdoInProcessingBox('数据加载中');
				setTimeout(function(){
					$('#titlerow_dav_dg_file').parent().parent().css({'border': '0px'});
					$('#startrow_dav_dg_file').parent().parent().css({'border': '0px'});
					$('#endrow_dav_dg_file').parent().parent().css({'border': '0px'});
					$('#titlerow_dav').parent().parent().css({'border': '0px'});
					$('#startrow_dav').parent().parent().css({'border': '0px'});
					$('#endrow_dav').parent().parent().css({'border': '0px'});
					var flag = true;
					var errorText = '';
					if(flag && $('#titlerow_dav_dg_file').val() == ''){
						$('#titlerow_dav_dg_file').parent().parent().css({'border': '1px dashed red'});
						flag = false;
						errorText = '底稿标题行';
					}
					if(flag && $('#startrow_dav_dg_file').val() == ''){
						$('#startrow_dav_dg_file').parent().parent().css({'border': '1px dashed red'});
						flag = false;
						errorText = '底稿起始行';
					}
					if(flag && $('#endrow_dav_dg_file').val() == ''){
						$('#endrow_dav_dg_file').parent().parent().css({'border': '1px dashed red'});
						flag = false;
						errorText = '底稿结束行';
					}
					if(flag && $('#titlerow_dav').val() == ''){
						$('#titlerow_dav').parent().parent().css({'border': '1px dashed red'});
						flag = false;
						errorText = '备查簿标题行';
					}
					if(flag && $('#startrow_dav').val() == ''){
						$('#startrow_dav').parent().parent().css({'border': '1px dashed red'});
						flag = false;
						errorText = '备查簿起始行';
					}
					if(flag && $('#endrow_dav').val() == ''){
						$('#endrow_dav').parent().parent().css({'border': '1px dashed red'});
						flag = false;
						errorText = '备查簿结束行';
					}
					if (!flag) {
						bdoErrorBox('失败', '请输入' + errorText);
						return;
					}
					var titleInfo = [];
					var sheetDg = designer.Spread.getActiveSheet();
					var titleRowDg = $('#titlerow_dav_dg_file').val();
					for(var i = 1;i <= sheetDg.getColumnCount();i++){
						var title = getTitle(sheetDg, titleRowDg, i);
						if(title != null && title != ''){
							if($('#progressType').val() == 1 || $('#progressType').val() == 3 || $('#progressType').val() == 4) {
								var titlePrev= getTitle(sheetDg, titleRowDg - 1, i);
								if (titlePrev != null && titlePrev != '' && titlePrev != title) {
									title = titlePrev + title;
								}
							}
							var titleInfoParam = {
								col : i,
								text: title
							};
							titleInfo.push(titleInfoParam);
						}
					}
					var length = 0;
					if(titleInfo.length % 2 == 0){
						length = titleInfo.length / 2;
					} else {
						length = (titleInfo.length + 1) / 2;
					}
					$('#div_dav_3').empty();
					var $html = $('<div class="row"><div class="form-group"><div class="col-sm-2" style="border-right: groove;"><div class="form-material"><h4>底稿列名</h4></div></div><div class="col-sm-2"><div class="form-material"><h4>数据源-备查簿</h4></div></div><div class="col-sm-2"></div><div class="col-sm-2" style="border-right: groove;"><div class="form-material"><h4>底稿列名</h4></div></div><div class="col-sm-2"><div class="form-material"><h4>数据源-备查簿</h4></div></div></div></div>');
					$('#div_dav_3').append($html);
					if($('#progressType').val() == 1) {
						var $div = $('<div class="row"><div class="form-group">'
							+ 	'<div class="col-sm-2" style="border-right: groove;">'
							+ 		'<div class="form-material">'
							+ 			'<h6>折旧测试开始日</h6>'
							+ 		'</div>'
							+ 	'</div>'
							+ 	'<div class="col-sm-2">'
							+ 		'<div class="form-material" style="margin-top: 0px; margin-bottom: 0px;">'
							+           '<input type="text" id="input_data_dav_0" value=' + sheetDg.getCell(2, 3).value() + ' name="input_data_dav" style="width: 100%;"></input>'
							+ 		'</div>'
							+ 	'</div>'
							+ 	'<div class="col-sm-2">'
							+ 	'</div>'
							+ 	'<div class="col-sm-2" style="border-right: groove;">'
							+ 		'<div class="form-material">'
							+ 			'<h6>折旧测试结束日</h6>'
							+ 		'</div>'
							+ 	'</div>'
							+ 	'<div class="col-sm-2">'
							+ 		'<div class="form-material" style="margin-top: 0px; margin-bottom: 0px;">'
							+           '<input type="text" id="input_data_dav_1" value=' + sheetDg.getCell(3, 3).value() + ' name="input_data_dav" style="width: 100%;"></input>'
							+ 		'</div>'
							+ 	'</div>'
							+ '</div></div>');
						$('#div_dav_3').append($div);
					} else if($('#progressType').val() == 3) {
						var $div = $('<div class="row"><div class="form-group">'
							+ 	'<div class="col-sm-2" style="border-right: groove;">'
							+ 		'<div class="form-material">'
							+ 			'<h6>原材料名称</h6>'
							+ 		'</div>'
							+ 	'</div>'
							+ 	'<div class="col-sm-2">'
							+ 		'<div class="form-material" style="margin-top: 0px; margin-bottom: 0px;">'
							+           '<input type="text" id="input_data_dav_0" name="input_data_dav" style="width: 100%;"></input>'
							+ 		'</div>'
							+ 	'</div>'
							+ 	'<div class="col-sm-2">'
							+ 	'</div>'
							+ '</div></div>');
						$('#div_dav_3').append($div);
					} else if($('#progressType').val() == 4) {
						var $div = $('<div class="row"><div class="form-group">'
							+ 	'<div class="col-sm-2" style="border-right: groove;">'
							+ 		'<div class="form-material">'
							+ 			'<h6>库存商品名称</h6>'
							+ 		'</div>'
							+ 	'</div>'
							+ 	'<div class="col-sm-2">'
							+ 		'<div class="form-material" style="margin-top: 0px; margin-bottom: 0px;">'
							+           '<input type="text" id="input_data_dav_0" name="input_data_dav" style="width: 100%;"></input>'
							+ 		'</div>'
							+ 	'</div>'
							+ 	'<div class="col-sm-2">'
							+ 	'</div>'
							+ '</div></div>');
						$('#div_dav_3').append($div);
					}
					for(var i = 0;i < length;i++){
						if((i + 1) * 2 <= titleInfo.length){
							var $div = $('<div class="row"><div class="form-group">'
								+ 	'<div class="col-sm-2" style="border-right: groove;">'
								+ 		'<div class="form-material">'
								+ 			'<h6>' + titleInfo[i].text + '</h6>'
								+ 		'</div>'
								+ 	'</div>'
								+ 	'<div class="col-sm-2">'
								+ 		'<div class="form-material" style="margin-top: 0px; margin-bottom: 0px;">'
								+ 			'<select class="js-select2 form-control" id="data_dav_' + (titleInfo[i].col - 1) + '" name="data_dav" style="width: 100%;"></select>'
								+ 		'</div>'
								+ 	'</div>'
								+ 	'<div class="col-sm-2">'
								+ 	'</div>'
								+ 	'<div class="col-sm-2" style="border-right: groove;">'
								+ 		'<div class="form-material">'
								+ 			'<h6>' + titleInfo[i + length].text + '</h6>'
								+ 		'</div>'
								+ 	'</div>'
								+ 	'<div class="col-sm-2">'
								+ 		'<div class="form-material" style="margin-top: 0px; margin-bottom: 0px;">'
								+ 			'<select class="js-select2 form-control" id="data_dav_' + (titleInfo[i + length].col - 1) + '" name="data_dav" style="width: 100%;"></select>'
								+ 		'</div>'
								+ 	'</div>'
								+ '</div></div>');
							$('#div_dav_3').append($div);
						} else {
							var $div = $('<div class="row"><div class="form-group">'
								+ 	'<div class="col-sm-2" style="border-right: groove;">'
								+ 		'<div class="form-material">'
								+ 			'<h6>' + titleInfo[i].text + '</h6>'
								+ 		'</div>'
								+ 	'</div>'
								+ 	'<div class="col-sm-2">'
								+ 		'<div class="form-material" style="margin-top: 0px; margin-bottom: 0px;">'
								+ 			'<select class="js-select2 form-control" id="data_dav_' + (titleInfo[i].col - 1) + '" name="data_dav" style="width: 100%;"></select>'
								+ 		'</div>'
								+ 	'</div>'
								+ 	'<div class="col-sm-2">'
								+ 	'</div>'
								+ '</div></div>');
							$('#div_dav_3').append($div);
						}
					}
					var titleRowNum = $('#titlerow_dav').val() - 1;
					var sheetName = $('#sheet_dav option:selected').val();
					var sheetIndex = parseInt(spread.getSheetIndex(sheetName));
					var sheet = spread.getSheet(sheetIndex);
					var titlePrevious = '';
					$('select[name="data_dav"]').each(function(){
						$(this).empty();
						$(this).append('<option value="" style="color: red;">未定义</option>');
						var hasSelected = false;
						for(var i = 0;i < sheet.getColumnCount();i++){
							var title = sheet.getText(titleRowNum, i);
							if($('#progressType').val() == 1 || $('#progressType').val() == 3 || $('#progressType').val() == 4) {
								var titlePrev= sheet.getText(titleRowNum - 1, i);
								if (titlePrev != null && titlePrev != '') {
									titlePrevious = titlePrev;
								}else if(title != null && title != ''){
									titlePrev = titlePrevious;
								}
								if (titlePrev != null && titlePrev != '' && titlePrev != title) {
									if(title != null && title != ''){
										title = titlePrev.trim() + title.trim();
									}else{
										title = titlePrev.trim();
									}
								}
							}
							if(title != null && title != ''){
								if($(this).parent().parent().prev().children().children().text().trim() == title.trim()){
									hasSelected = true;
									$(this).append('<option value="' + i + '" selected>' + title + '</option>');
								}else if(!hasSelected && $(this).parent().parent().prev().children().children().text().trim().indexOf(title.trim()) >= 0){
									hasSelected = true;
									$(this).append('<option value="' + i + '" selected>' + title + '</option>');
								}else{
									$(this).append('<option value="' + i + '">' + title + '</option>');
								}
							}
						}
						if(this.value == ''){
							$(this).css('color', 'red');
						}
					});
					$('select[name="data_dav"]').click(function(){
						$(this).css('color', 'inherit');
					});
					$('select[name="data_dav"]').blur(function(){
						if(this.value == ''){
							$(this).css('color', 'red');
						}
					});
					$('#div_dav_1').css('display', 'none');
					$('#div_dav_2').css('display', 'none');
					$('#div_dav_3').css('display', 'block');
					$('#div_dav_4').css('display', 'none');
					$('#label_dav').html('3');
					$('#button_dav_next').html('确定');
					$('#button_dav_return').css('display', 'block');
					bdoSuccessBox('完成');
				}, 100);

			}else if(step == 3){
				$('#modal_depreciation_amortization_valuation').modal('hide');
				bdoInProcessingBox('备查簿数据取入中');
				setTimeout(function(){
					designer.Spread.suspendPaint();
					// 底稿
					var distSheet = designer.Spread.getActiveSheet();
					// 底稿开始行
					var startrow = parseInt($('#startrow_dav_dg_file').val());
					// 底稿结束行
					var endrow = parseInt($('#endrow_dav_dg_file').val());
					// 备查簿
					var srcSheet = spread.getSheet(parseInt(spread.getSheetIndex($('#sheet_dav option:selected').val())));
					// 备查簿开始行
					var startrowSrc = parseInt($('#startrow_dav').val());
					// 备查簿结束行
					var endrowSrc = parseInt($('#endrow_dav').val());
					
					var _this = $('#div_dav_3 select[name="data_dav"]');
					// 底稿取值区域与备查簿取入区域  行数同步(底稿取值区域小则增加行)
					var num = endrowSrc - startrowSrc + 1 - (endrow - startrow);
					if(endrow - startrow < endrowSrc - startrowSrc + 1){
						distSheet.addRows(endrow - 1, num);
						for(var i = 0;i < num;i++){
							distSheet.copyTo(endrow - 1 - 1, 0, endrow - 1 + i, 0, 1, distSheet.getColumnCount(), GC.Spread.Sheets.CopyToOptions.all);
							for(var col = 0;col < distSheet.getColumnCount();col++){
								if(!distSheet.hasFormula(endrow - 1 + i, col)){
									distSheet.clear(endrow - 1 + i, col, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
								}
							}
						}
					}
					distSheet.clear(endrow - 1 + num, 0, 1, distSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
					var doneNum = 0;
					var tmpendrow = endrow;
					if (startrow == endrow) {
						tmpendrow += 1;
					}
					for(var i = startrow;i < tmpendrow - 1 + endrowSrc - startrowSrc + 1;i++){
						var keyCol;
						keyCol = 1;
						if(distSheet.getValue(i - 1, keyCol) == null || distSheet.getValue(i - 1, keyCol) == ''){
							$.each($(_this), function(index, item){
								if($(item).find('option:selected').val() != ''){
									var srcCol = parseInt($(item).find('option:selected').val());
									var distCol = parseInt($(item).attr('id').replace('data_dav_', ''));
									distSheet.getCell(i - 1, distCol).value(srcSheet.getValue(startrowSrc - 1, srcCol));
								}
							});
							srcSheet.deleteRows(startrowSrc - 1, 1);
						}else{
							var isSame = false;
							for(var j = startrowSrc; j < endrowSrc - doneNum;j++){
								if(distSheet.getValue(i - 1, keyCol) == srcSheet.getValue(j - 1, keyCol)){
									$.each($(_this), function(index, item){
										if($(item).find('option:selected').val() != ''){
											var srcCol = parseInt($(item).find('option:selected').val());
											var distCol = parseInt($(item).attr('id').replace('data_dav_', ''));
											distSheet.getCell(i - 1, distCol).value(srcSheet.getValue(j - 1, srcCol));
										}
									});
									srcSheet.deleteRows(startrowSrc - 1, 1);
									isSame = true;
									break;
								}
							}
							if(!isSame){
								$.each($(_this), function(index, item){
									if($(item).find('option:selected').val() != ''){
										var srcCol = parseInt($(item).find('option:selected').val());
										var distCol = parseInt($(item).attr('id').replace('data_dav_', ''));
										distSheet.getCell(i - 1, distCol).value(srcSheet.getValue(startrowSrc - 1, srcCol));
									}
								});
								srcSheet.deleteRows(startrowSrc - 1, 1);
							}
						}
						doneNum++;
						if(doneNum == endrowSrc - startrowSrc + 1){
							break;
						}
					}

					if($('#progressType').val() == 1) {
						distSheet.clear(2, 3, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
						distSheet.clear(3, 3, 1, 1, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
						distSheet.getCell(2, 3).value($('#input_data_dav_0').val());
						distSheet.getCell(3, 3).value($('#input_data_dav_1').val());
					} else if($('#progressType').val() == 3) {
						distSheet.getCell(1, 2).value($('#input_data_dav_0').val());
					} else if($('#progressType').val() == 4) {
						distSheet.getCell(1, 2).value($('#input_data_dav_0').val());
					}
					designer.Spread.resumePaint();
					bdoSuccessBox('成功', '备查簿数据取入成功');
				}, 100);
			}
		});

		$('#button_dav_return').on('click', function() {
			var step = $('#label_dav').html();
			if(step == 2){
				$('#modal_depreciation_amortization_valuation').find('.modal-content').css('width', '600px');
				var modalWidth = $('#modal_depreciation_amortization_valuation').find('.modal-content').width();
				var left = '-' + parseInt(modalWidth) / 2 + 'px';
				$('#modal_depreciation_amortization_valuation').css('margin-left', left);
				$('#div_dav_1').css('display', 'block');
				$('#div_dav_2').css('display', 'none');
				$('#div_dav_3').css('display', 'none');
				$('#div_dav_4').css('display', 'none');
				$('#label_dav').html('1');
				$('#title_dav').html('');
				$('#button_dav_next').html('下一步');
				$('#button_dav_return').css('display', 'none');
			}else if(step == 3){
				$('#div_dav_1').css('display', 'none');
				$('#div_dav_2').css('display', 'block');
				$('#div_dav_3').css('display', 'none');
				$('#div_dav_4').css('display', 'none');
				$('#label_dav').html('2');
				$('#button_dav_next').html('下一步');
				$('#button_dav_return').css('display', 'block');
			}
		});

		var dav_pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			browseLabel: '备查簿',
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
			uploadUrl: 'dgCenter/DgFunctions.browseUploadExcel.json',
			uploadExtraData: function() {
				return {
					param1: '',
					param2: ''
				};
			}
		};

		var $dav_el = $('#dav_fileinput').fileinput(dav_pluginOpt);

		//uploadAsync = true 时调用
		$dav_el.on('fileuploaded', function(event, data) {
			$('#modal_depreciation_amortization_valuation').find('.modal-content').css('width', '1200px');
			var modalWidth = $('#modal_depreciation_amortization_valuation').find('.modal-content').width();
			var left = '-' + parseInt(modalWidth) / 2 + 'px';
			$('#modal_depreciation_amortization_valuation').css('margin-left', left);
			var excel = data.response.data[0].excelBase64Data;
			var file = dataURLtoFile(excel, '备查簿.xlsx');
			excelIo.open(file, json => {
				var workbookObj = json;
				workbookObj = updateUsedRange(json);
				spread.fromJSON(workbookObj);
				spread.setActiveSheetIndex(0);
				for (var i = 0; i < spread.getSheetCount(); i++) {
					var sheet = spread.getSheet(i);
					$('#sheet_dav').append("<option value='" + sheet.name() + "'>" + sheet.name() + "</option>");
				}
			}, e => {
				bdoErrorBox('失败', e.errorMessage);
			});
			$('#div_dav_1').css('display', 'none');
			$('#div_dav_2').css('display', 'block');
			$('#div_dav_3').css('display', 'none');
			$('#div_dav_4').css('display', 'none');
			$('#label_dav').html('2');
			$('#button_dav_next').html('下一步');
			$('#button_dav_return').css('display', 'block');
			
			$('#dav_fileinput').fileinput('clear');
			$('#dav_fileinput').fileinput('enable');
			bdoSuccessBox('成功', '加载完成');
		});

		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$dav_el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', msg);
		});

		//建议文件上传成功之后再提交其他表单数据
		function dav_uploadFile() {
			$dav_el.fileinput('upload');
		}
		
		// 银行对账功能
		$('#modal_bank_statement').on('show.bs.modal', function() {
			$('#modal_bank_statement').find('.modal-content').css('width', '600px');
			var modalWidth = $('#modal_bank_statement').find('.modal-content').width();
			var left = '-' + parseInt(modalWidth) / 2 + 'px';
			$('#modal_bank_statement').css('margin-left', left);
			$('#div_bank_statement_1').css('display', 'block');
			$('#div_bank_statement_2').css('display', 'none');
			$('#label_bank_statement').html('1');
			$('#button_bank_statement_next').html('下一步');
			$('#button_bank_statement_return').css('display', 'none');
			$('#bank_spreadContent').empty();
			spread = new GC.Spread.Sheets.Workbook(document.getElementById('bank_spreadContent'));
			spread.options.newTabVisible = false;
			queryAttachment('attach_bank_statement');
			queryBankList('list_bank_statement');
		});
		$('#download_bank_statement').on('click', function() {
			downloadFile('dgCenter/DgFunctions.downloadBankStatementTemplate.json', {param1: window.CUR_CUSTOMERID, param2: window.CUR_PROJECTID});
		});
		$('input[type=radio][name=radio_bank_statement]').change(function() {
			if (this.value == '2') {
				$('#bank_fileinput').fileinput('clear');
				$('#bank_fileinput').fileinput('enable');
			}
		});
		$('#button_bank_statement_next').on('click', function() {
			var step = $('#label_bank_statement').html();
			if(step == 1){
				bdoInProcessingBox('加载中');
				$('#sheet_bank_statement').empty();
				var type = $("input[name='radio_bank_statement']:checked").val();
				if(type == 1){
					if($('#attach_bank_statement').val() != null && $('#attach_bank_statement option:selected').val() != ''){
						$.ajax({
							url: 'dgCenter/DgFunctions.browseDgAttachment.json',
							// async: false,
							type: 'post',
							dataType: 'json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: $('#attach_bank_statement option:selected').val()
							},
							success(data) {
								if(data.success){
									loadBankStatement(data);
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}else{
						bdoInfoBox('提示', '底稿附件选择不能为空');
					}
				}else if(type == 2){
					if($('#list_bank_statement').val() != null && $('#list_bank_statement option:selected').val() != ''){
						$.ajax({
							url: 'dgCenter/DgFunctions.browseBankStatementList.json',
							// async: false,
							type: 'post',
							dataType: 'json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: $('#list_bank_statement option:selected').val()
							},
							success(data) {
								if(data.success){
									loadBankStatement(data);
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}else{
						bdoInfoBox('提示', '银行对账单选择不能为空');
					}
				}else if(type == 3){
					var fileUrl = $('#bank_fileinput').val();
					if (fileUrl == null || fileUrl == '') {
						bdoInfoBox('提示', '请上传银行对账单');
						return;
					}
					bank_uploadFile();
				}
			}else if(step == 2){
				$('#account_bank_statement').parent().parent().css({'border': '0px'});
				if($('#account_bank_statement').val() == ''){
					$('#account_bank_statement').parent().parent().css({'border': '1px dashed red'});
					bdoErrorBox('失败', '请输入账套名');
					return;
				}
				var newSheetName = $('#account_bank_statement').val();
				/*if(designer.Spread.getSheetFromName(newSheetName) != null){
					bdoInfoBox('失败', '账套名已存在！请重新输入');
					return;
				}*/
				$('#modal_bank_statement').modal('hide');
				bdoInProcessingBox('银行对账单数据取入中');
				setTimeout(function(){
					designer.Spread.suspendPaint();
					var newSheet;
					/*var templateSheet = designer.Spread.getSheetFromName('银行存款余额调节表模板');
					var templateSheetJson = JSON.stringify(templateSheet.toJSON());
					var newSheet = new GC.Spread.Sheets.Worksheet(newSheetName);
					designer.Spread.addSheet(designer.Spread.getSheetCount(), newSheet);
					newSheet.fromJSON(JSON.parse(templateSheetJson));
					newSheet.name(newSheetName);
					newSheet.visible(true);
					designer.Spread.setActiveSheetIndex(designer.Spread.getSheetCount() - 1);*/
					if(designer.Spread.getSheetFromName(newSheetName) != null){
						newSheet = designer.Spread.getSheetFromName(newSheetName);
					}else{
						var templateSheet = designer.Spread.getSheetFromName('银行存款余额调节表模板');
						var templateSheetJson = JSON.stringify(templateSheet.toJSON());
						newSheet = new GC.Spread.Sheets.Worksheet(newSheetName);
						designer.Spread.addSheet(designer.Spread.getSheetCount(), newSheet);
						newSheet.fromJSON(JSON.parse(templateSheetJson));
						newSheet.name(newSheetName);
						newSheet.visible(true);
						designer.Spread.setActiveSheetIndex(designer.Spread.getSheetCount() - 1);
					}
					// 开始银行：C2
					newSheet.getCell(1, 2).value($('#account_bank_statement').val());
					// 交易时间
					var tradingTimeCol = $('#trading_time_bank option:selected').val();
					// 交易用途
					var tradingPurposesCol = $('#trading_purposes_bank option:selected').val();
					// 对方户名
					var reciprocalAccountNameCol = $('#reciprocal_account_name_bank option:selected').val();
					// 借贷：1 收入支出：2
					var amountType = $('input[name="radio_amount_bank"]:checked').val();
					// 借贷标志
					var marksCol = $('#debit_credit_marks_bank option:selected').val();
					// 发生额
					var occurAccountNameCol = $('#occur_amount_bank option:selected').val();
					// 收入金额
					var incomeAccountNameCol = $('#income_amount_bank option:selected').val();
					// 支出金额
					var paidAccountNameCol = $('#paid_amount_bank option:selected').val();
					// 划入
					var startrowIn = 8;
					// 划出
					var startrowOut = 12;
					var bankStatementSheet = spread.getSheetFromName('对账单匹配失败数据(金额不一致)');
					// 新增行数--对账单
					// 划入新增行
					var insertRowNumInBank = 0;
					// 划出新增行
					var insertRowNumOutBank = 0;
					for(var i = 1;i < bankStatementSheet.getRowCount();i++){
						if(amountType == 1){
							if(marksCol != ''){
								// 借：支出 贷：收入
								if(bankStatementSheet.getText(i, parseInt(marksCol)) == '贷'){
									// 新增一行（如划入起始行为第7行，将在第7行后新增行）
									newSheet.addRows(startrowIn, 1);
									// 将起始行数据copy到新增行
									newSheet.copyTo(startrowIn - 1, 0, startrowIn, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.CopyToOptions.all);
									// 清除新增行数据
									newSheet.clear(startrowIn, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
									// 新增行写数据
									// 交易时间
									if(tradingTimeCol != ''){
										newSheet.getCell(startrowIn, 1).value(bankStatementSheet.getText(i, parseInt(tradingTimeCol)));
									}
									// 交易用途
									if(tradingPurposesCol != ''){
										newSheet.getCell(startrowIn, 2).value(bankStatementSheet.getText(i, parseInt(tradingPurposesCol)));
									}
									// 对方户名
									if(reciprocalAccountNameCol != ''){
										newSheet.getCell(startrowIn, 3).value(bankStatementSheet.getText(i, parseInt(reciprocalAccountNameCol)));
									}
									// 发生额
									if(occurAccountNameCol != ''){
										newSheet.getCell(startrowIn, 4).value(bankStatementSheet.getText(i, parseInt(occurAccountNameCol)));
									}
									insertRowNumInBank++;
								}else if(bankStatementSheet.getText(i, parseInt(marksCol)) == '借'){
									// 新增一行（如划出起始行为第16行，划入新增行为7,将在第23行后新增行）
									newSheet.addRows(startrowOut + insertRowNumInBank, 1);
									// 将起始行数据copy到新增行
									newSheet.copyTo(startrowOut + insertRowNumInBank - 1, 0, startrowOut + insertRowNumInBank, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.CopyToOptions.all);
									// 清除新增行数据
									newSheet.clear(startrowOut + insertRowNumInBank, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
									// 新增行写数据
									// 交易时间
									if(tradingTimeCol != ''){
										newSheet.getCell(startrowOut + insertRowNumInBank, 1).value(bankStatementSheet.getText(i, parseInt(tradingTimeCol)));
									}
									// 交易用途
									if(tradingPurposesCol != ''){
										newSheet.getCell(startrowOut + insertRowNumInBank, 2).value(bankStatementSheet.getText(i, parseInt(tradingPurposesCol)));
									}
									// 对方户名
									if(reciprocalAccountNameCol != ''){
										newSheet.getCell(startrowOut + insertRowNumInBank, 3).value(bankStatementSheet.getText(i, parseInt(reciprocalAccountNameCol)));
									}
									// 发生额
									if(occurAccountNameCol != ''){
										newSheet.getCell(startrowOut + insertRowNumInBank, 4).value(bankStatementSheet.getText(i, parseInt(occurAccountNameCol)));
									}
									insertRowNumOutBank++;
								}
							}
						}else if(amountType == 2){
							// 收入
							if(incomeAccountNameCol != '' && bankStatementSheet.getText(i, parseInt(incomeAccountNameCol)) != '' && bankStatementSheet.getText(i, parseInt(incomeAccountNameCol)) != 0){
								// 新增一行（如划入起始行为第7行，将在第7行后新增行）
								newSheet.addRows(startrowIn, 1);
								// 将起始行数据copy到新增行
								newSheet.copyTo(startrowIn - 1, 0, startrowIn, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.CopyToOptions.all);
								// 清除新增行数据
								newSheet.clear(startrowIn, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
								// 新增行写数据
								// 交易时间
								if(tradingTimeCol != ''){
									newSheet.getCell(startrowIn, 1).value(bankStatementSheet.getText(i, parseInt(tradingTimeCol)));
								}
								// 交易用途
								if(tradingPurposesCol != ''){
									newSheet.getCell(startrowIn, 2).value(bankStatementSheet.getText(i, parseInt(tradingPurposesCol)));
								}
								// 对方户名
								if(reciprocalAccountNameCol != ''){
									newSheet.getCell(startrowIn, 3).value(bankStatementSheet.getText(i, parseInt(reciprocalAccountNameCol)));
								}
								// 收入支出额
								if(incomeAccountNameCol != ''){
									newSheet.getCell(startrowIn, 4).value(bankStatementSheet.getText(i, parseInt(incomeAccountNameCol)));
								}
								insertRowNumInBank++;
							}
							// 支出
							if(paidAccountNameCol != '' && bankStatementSheet.getText(i, parseInt(paidAccountNameCol)) != '' && bankStatementSheet.getText(i, parseInt(paidAccountNameCol)) != 0){
								// 新增一行（如划出起始行为第16行，划入新增行为7,将在第23行后新增行）
								newSheet.addRows(startrowOut + insertRowNumInBank, 1);
								// 将起始行数据copy到新增行
								newSheet.copyTo(startrowOut + insertRowNumInBank - 1, 0, startrowOut + insertRowNumInBank, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.CopyToOptions.all);
								// 清除新增行数据
								newSheet.clear(startrowOut + insertRowNumInBank, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
								// 新增行写数据
								// 交易时间
								if(tradingTimeCol != ''){
									newSheet.getCell(startrowOut + insertRowNumInBank, 1).value(bankStatementSheet.getText(i, parseInt(tradingTimeCol)));
								}
								// 交易用途
								if(tradingPurposesCol != ''){
									newSheet.getCell(startrowOut + insertRowNumInBank, 2).value(bankStatementSheet.getText(i, parseInt(tradingPurposesCol)));
								}
								// 对方户名
								if(reciprocalAccountNameCol != ''){
									newSheet.getCell(startrowOut + insertRowNumInBank, 3).value(bankStatementSheet.getText(i, parseInt(reciprocalAccountNameCol)));
								}
								// 支出金额
								if(paidAccountNameCol != ''){
									newSheet.getCell(startrowOut + insertRowNumInBank, 4).value(bankStatementSheet.getText(i, parseInt(paidAccountNameCol)));
								}
								insertRowNumOutBank++;
							}
						}
					}
					var accountStatementSheet = spread.getSheetFromName('账套匹配失败数据(金额不一致)');
					// 新增行数--账套
					// 划入新增行
					var insertRowNumInAccount = 1;
					// 划出新增行
					var insertRowNumOutAccount = 1;
					var accountRowNumIn = 0;
					var accountRowNumOut = 0;
					// 记账日期(账套) B--2
					// 凭证号 C--3
					// 摘要(账套) D--4
					// 发生额(账套) E--5：正的值是划入的，负值是划出金额
					// 对方科目 G--7
					for(var i = 1;i < accountStatementSheet.getRowCount();i++){
						if(accountStatementSheet.getText(i, 4).trim() != ''){
							// 发生额(账套)转数值 正值划入，负值划出
							var occcurValue = parseFloat(accountStatementSheet.getText(i, 4).trim());
							if(occcurValue > 0){
								// 划入
								// 账套划入新增行数 > 对账单划入新增行数时，则需在划入起始行后新增行
								// 账套划入新增行数 <= 对账单划入新增行数时，则依次写入数据
								if(insertRowNumInAccount > insertRowNumInBank){
									// 新增行
									newSheet.addRows(startrowIn, 1);
									// copy数据
									newSheet.copyTo(startrowIn - 1, 0, startrowIn, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.CopyToOptions.all);
									// 清数据
									newSheet.clear(startrowIn, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
									// 写数据
									// 记账日期(账套) B
									newSheet.getCell(startrowIn, 5).value(accountStatementSheet.getText(i, 1));
									// 凭证号 C
									newSheet.getCell(startrowIn, 6).value(accountStatementSheet.getText(i, 2));
									// 摘要(账套) D
									newSheet.getCell(startrowIn, 7).value(accountStatementSheet.getText(i, 3));
									// 对方科目 G
									newSheet.getCell(startrowIn, 8).value(accountStatementSheet.getText(i, 6));
									// 发生额
									newSheet.getCell(startrowIn, 9).value(occcurValue);
									insertRowNumInBank++;
								}else{
									// 写数据
									// 记账日期(账套) B
									newSheet.getCell(startrowIn + accountRowNumIn, 5).value(accountStatementSheet.getText(i, 1));
									// 凭证号 C
									newSheet.getCell(startrowIn + accountRowNumIn, 6).value(accountStatementSheet.getText(i, 2));
									// 摘要(账套) D
									newSheet.getCell(startrowIn + accountRowNumIn, 7).value(accountStatementSheet.getText(i, 3));
									// 对方科目 G
									newSheet.getCell(startrowIn + accountRowNumIn, 8).value(accountStatementSheet.getText(i, 6));
									// 发生额
									newSheet.getCell(startrowIn + accountRowNumIn, 9).value(occcurValue);
								}
								accountRowNumIn++;
								insertRowNumInAccount++;
							}else{
								// 划出
								// 账套划出新增行数 > 对账单划出新增行数时，则需在划出起始行 + 划入新增行后新增行
								// 账套划出新增行数 <= 对账单划出新增行数时，则依次写入数据
								if(insertRowNumOutAccount > insertRowNumOutBank){
									// 新增行
									newSheet.addRows(startrowOut + insertRowNumInBank, 1);
									// copy数据
									newSheet.copyTo(startrowOut + insertRowNumInBank - 1, 0, startrowOut + insertRowNumInBank, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.CopyToOptions.all);
									// 清数据
									newSheet.clear(startrowOut + insertRowNumInBank, 0, 1, newSheet.getColumnCount(), GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data);
									// 写数据
									// 记账日期(账套) B
									newSheet.getCell(startrowOut + insertRowNumInBank, 5).value(accountStatementSheet.getText(i, 1));
									// 凭证号 C
									newSheet.getCell(startrowOut + insertRowNumInBank, 6).value(accountStatementSheet.getText(i, 2));
									// 摘要(账套) D
									newSheet.getCell(startrowOut + insertRowNumInBank, 7).value(accountStatementSheet.getText(i, 3));
									// 对方科目 G
									newSheet.getCell(startrowOut + insertRowNumInBank, 8).value(accountStatementSheet.getText(i, 6));
									// 发生额
									newSheet.getCell(startrowOut + insertRowNumInBank, 9).value(occcurValue * -1);
									insertRowNumOutBank++;
								}else{
									// 写数据
									// 记账日期(账套) B
									newSheet.getCell(startrowOut + insertRowNumInBank + accountRowNumOut, 5).value(accountStatementSheet.getText(i, 1));
									// 凭证号 C
									newSheet.getCell(startrowOut + insertRowNumInBank + accountRowNumOut, 6).value(accountStatementSheet.getText(i, 2));
									// 摘要(账套) D
									newSheet.getCell(startrowOut + insertRowNumInBank + accountRowNumOut, 7).value(accountStatementSheet.getText(i, 3));
									// 对方科目 G
									newSheet.getCell(startrowOut + insertRowNumInBank + accountRowNumOut, 8).value(accountStatementSheet.getText(i, 6));
									// 发生额
									newSheet.getCell(startrowOut + insertRowNumInBank + accountRowNumOut, 9).value(occcurValue * -1);
								}
								accountRowNumOut++;
								insertRowNumOutAccount++;
							}
						}
					}
					designer.Spread.resumePaint();
					bdoSuccessBox('成功', '银行对账单数据取入成功');
				}, 100);
			}
		});
		$('#button_bank_statement_return').on('click', function() {
			var step = $('#label_bank_statement').html();
			if(step == 2){
				$('#modal_bank_statement').find('.modal-content').css('width', '600px');
				var modalWidth = $('#modal_bank_statement').find('.modal-content').width();
				var left = '-' + parseInt(modalWidth) / 2 + 'px';
				$('#modal_bank_statement').css('margin-left', left);
				$('#div_bank_statement_1').css('display', 'block');
				$('#div_bank_statement_2').css('display', 'none');
				$('#label_bank_statement').html('1');
				$('#button_bank_statement_next').html('下一步');
				$('#button_bank_statement_return').css('display', 'none');
			}
		});
		
		var bank_pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			browseLabel: '小杏仁对账结果',
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
			uploadUrl: 'dgCenter/DgFunctions.browseUploadExcel.json',
			uploadExtraData: function() {
				return {
					param1: '',
					param2: ''
				};
			}
		};

		var $bank_el = $('#bank_fileinput').fileinput(bank_pluginOpt);

		//uploadAsync = true 时调用
		$bank_el.on('fileuploaded', function(event, data) {
			loadBankStatement(data.response);
		});

		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$bank_el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', msg);
		});

		//建议文件上传成功之后再提交其他表单数据
		function bank_uploadFile() {
			$bank_el.fileinput('upload');
		}
	};

	function queryAttachment(id){
		$('#' + id).empty();
		$.ajax({
			type : 'post',
			url: 'dgCenter/DgGeneral.query.json',
			// async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00069',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: designer.workpaperId,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success(data) {
				if(data.success) {
					for(var attachList of data.data){
						$('#' + id).append("<option value='" + attachList.autoId + "' title='" + attachList.fileName + "'>" + attachList.fileName + "</option>");
					}
				}
			}
		});
	}

	function queryBankList(id){
		$('#' + id).empty();
		$.ajax({
			type : 'post',
			url: 'dgCenter/DgGeneral.query.json',
			// async : false,
			data : {
				menuId: window.sys_menuId,
				sqlId: 'DG00339',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType : 'json',
			success(data) {
				if(data.success) {
					for(var bankList of data.data){
						$('#' + id).append("<option value='" + bankList.autoId + "' title='" + bankList.bankName + "'>" + bankList.bankName + "</option>");
					}
				}
			}
		});
	}

	function loadBankStatement(data){
		$('#modal_bank_statement').find('.modal-content').css('width', '1200px');
		var modalWidth = $('#modal_bank_statement').find('.modal-content').width();
		var left = '-' + parseInt(modalWidth) / 2 + 'px';
		$('#modal_bank_statement').css('margin-left', left);
		var excel = data.data[0].excelBase64Data;
		var file = dataURLtoFile(excel, '银行对账单.xlsx');
		excelIo.open(file, json => {
			var workbookObj = json;
			workbookObj = updateUsedRange(json);
			spread.fromJSON(workbookObj);
			spread.setActiveSheetIndex(0);
			var sheet1 = spread.getSheetFromName('对账单匹配失败数据(金额不一致)');
			var sheet2 = spread.getSheetFromName('账套匹配失败数据(金额不一致)');
			if(sheet1 == null || sheet2 == null){
				bdoErrorBox('失败', '对账单不正确，需包含"对账单匹配失败数据"、"账套匹配失败数据"');
				$('#modal_bank_statement').find('.modal-content').css('width', '600px');
				var modalWidth = $('#modal_bank_statement').find('.modal-content').width();
				var left = '-' + parseInt(modalWidth) / 2 + 'px';
				$('#modal_bank_statement').css('margin-left', left);
				$('#div_bank_statement_1').css('display', 'block');
				$('#div_bank_statement_2').css('display', 'none');
				$('#label_bank_statement').html('1');
				$('#button_bank_statement_next').html('下一步');
				$('#button_bank_statement_return').css('display', 'none');
				return;
			}
			$('#sheet_bank_statement').empty();
			for (var i = 0; i < spread.getSheetCount(); i++) {
				var sheet = spread.getSheet(i);
				if(sheet.name().indexOf('金额不一致') != -1){
					$('#sheet_bank_statement').append("<option value='" + sheet.name() + "'>" + sheet.name() + "</option>");
				}else{
					sheet.visible(false);
				}
			}
			$('select[name="data_bank_statement"]').each(function(){
				var sheet = spread.getSheetFromName('对账单匹配失败数据(金额不一致)');
				$(this).empty();
				$(this).append("<option value=''>未定义</option>");
				for(var i = 0;i < sheet.getColumnCount();i++){
					if(sheet.getText(0, i) != ''){
						if($(this).next().text() == sheet.getText(0, i).trim()){
							$(this).append("<option value='" + i + "' selected>" + sheet.getText(0, i) + "</option>");
						}else{
							$(this).append("<option value='" + i + "'>" + sheet.getText(0, i) + "</option>");
						}
					}
				}
			});
		}, e => {
			bdoErrorBox('失败', e.errorMessage);
		});
		$('#div_bank_statement_1').css('display', 'none');
		$('#div_bank_statement_2').css('display', 'block');
		$('#label_bank_statement').html('2');
		$('#button_bank_statement_next').html('确定');
		$('#button_bank_statement_return').css('display', 'block');
		$('#bank_fileinput').fileinput('clear');
		$('#bank_fileinput').fileinput('enable');
		bdoSuccessBox('成功', '加载完成');
	}
	// 复制签到签名sheet
	function copySheetSign(spreadCopy, sheetName, styleTitle){
		var sheetSigninJson = JSON.stringify(spreadCopy.getSheetFromName(sheetName).toJSON());
		if(designer.Spread.getSheetIndex(sheetName) != null){
			designer.Spread.removeSheet(designer.Spread.getSheetIndex(sheetName));
		}
		var indexSignin = designer.Spread.getSheetCount();
		designer.Spread.addSheet(indexSignin);
		designer.Spread.getSheet(indexSignin).fromJSON(JSON.parse(sheetSigninJson));
		designer.Spread.getSheet(indexSignin).name(sheetName);
		//拷贝样式
		var rowCount = designer.Spread.getSheet(indexSignin).getRowCount();
		var columnCount = designer.Spread.getSheet(indexSignin).getColumnCount();
		for(var i = 0;i < rowCount;i++){
			// 行样式
			var rstyle = spreadCopy.getSheetFromName(sheetName).getStyle(i, -1, GC.Spread.Sheets.SheetArea.viewport);
			var rstyleName = spreadCopy.getSheetFromName(sheetName).getStyleName(i, -1, GC.Spread.Sheets.SheetArea.viewport);
			if(rstyle != null){
				var nrstyle = designer.Spread.getNamedStyle(rstyle.name + styleTitle);
				if(nrstyle != null){
					designer.Spread.getSheet(indexSignin).setStyle(i, -1, nrstyle, GC.Spread.Sheets.SheetArea.viewport);
				}else{
					designer.Spread.getSheet(indexSignin).setStyle(i, -1, null, GC.Spread.Sheets.SheetArea.viewport);
				}
			}
			if(rstyleName != null){
				var nrstyleName = designer.Spread.getNamedStyle(rstyleName + styleTitle);
				if(nrstyleName != null){
					designer.Spread.getSheet(indexSignin).setStyleName(i, -1, rstyleName + styleTitle);
				}
			}
			for(var j = 0;j < columnCount;j++){
				if(i == 0){
					// 列样式
					var colstyle = spreadCopy.getSheetFromName(sheetName).getStyle(-1, j, GC.Spread.Sheets.SheetArea.viewport);
					var colstyleName = spreadCopy.getSheetFromName(sheetName).getStyleName(-1, j, GC.Spread.Sheets.SheetArea.viewport);
					if(colstyle != null){
						var ncolstyle = designer.Spread.getNamedStyle(colstyle.name + styleTitle);
						if(ncolstyle != null){
							designer.Spread.getSheet(indexSignin).setStyle(-1, j, ncolstyle, GC.Spread.Sheets.SheetArea.viewport);
						}else{
							designer.Spread.getSheet(indexSignin).setStyle(-1, j, null, GC.Spread.Sheets.SheetArea.viewport);
						}
					}
					if(colstyleName != null){
						var ncolstyleName = designer.Spread.getNamedStyle(colstyleName + styleTitle);
						if(ncolstyleName != null){
							designer.Spread.getSheet(indexSignin).setStyleName(-1, j, colstyleName + styleTitle);
						}
					}
				}
				// 单元格样式
				var cstyle = spreadCopy.getSheetFromName(sheetName).getStyle(i, j, GC.Spread.Sheets.SheetArea.viewport);
				var styleName = spreadCopy.getSheetFromName(sheetName).getStyleName(i, j, GC.Spread.Sheets.SheetArea.viewport);
				if(cstyle != null){
					var nstyle = designer.Spread.getNamedStyle(cstyle.name + styleTitle);
					if(nstyle != null){
						designer.Spread.getSheet(indexSignin).setStyle(i, j, nstyle, GC.Spread.Sheets.SheetArea.viewport);
					}
				}
				if(styleName != null){
					var nstyleName = designer.Spread.getNamedStyle(styleName + styleTitle);
					if(nstyleName != null){
						designer.Spread.getSheet(indexSignin).setStyleName(i, j, styleName + styleTitle);
					}
				}
			}
		}
	}
	// 复制签到签名sheet样式
	function copySheetStyle(spreadCopy, styleTitle){
		//拷贝样式
		spreadCopy.getNamedStyles().forEach(function (namedStyle) {
			namedStyle.name = namedStyle.name + styleTitle;
			var style = designer.Spread.getNamedStyle(namedStyle.name);
			//if(style == null){
				designer.Spread.addNamedStyle(namedStyle);
			//}
		})
	}
	// 库存现金盘点核对表sheet
	function setCashData(){
		var sheet = designer.Spread.getSheetFromName('库存现金盘点核对表');
		var count = 0;
		for(var i = 0;i < billInfo.length;i++){
			if(i >= 10){
				break;
			}
			if(billInfo[i].itemCode == '人民币'){
				sheet.getCell(2, 4).value(billInfo[i].itemCode);
				sheet.getCell(3, 4).value(billInfo[i].itemNumber);
				sheet.getCell(4, 4).value(billInfo[i].incomeAmount);
				sheet.getCell(5, 4).value(billInfo[i].amountPaid);
				sheet.getCell(7, 4).value(billInfo[i].inventoryQuantity);
			}else{
				sheet.getCell(2, count + 5).value(billInfo[i].itemCode);
				sheet.getCell(3, count + 5).value(billInfo[i].itemNumber);
				sheet.getCell(4, count + 5).value(billInfo[i].incomeAmount);
				sheet.getCell(5, count + 5).value(billInfo[i].amountPaid);
				sheet.getCell(7, count + 5).value(billInfo[i].inventoryQuantity);
				count = count + 1;
			}
		}
	}
	// 循环写入单向链接--外部url链接
	function setUrlLink(inventoryModel, startrow){
		var billSheetIndex = designer.Spread.getActiveSheetIndex();
		var billColIndex = '';
		var nameColIndex = 1;
		// 1 存货
		// 2 固定资产
		// 3 在建工程
		// 4 库存现金
		// 5 票据
		switch(inventoryModel) {
			case '1':
				billColIndex = 20;
				break;
			case '2':
				billColIndex = 18;
				break;
			case '3':
				billColIndex = 18;
				break;
			case '4':
				billColIndex = 14;
				break;
			case '5':
				billColIndex = 11;
				break;
			default:
				break;
		}
		// 根据列名获取附件索引列
		var titleRowDg = $('#titlerow_dg_file').val();
		var distSheet = designer.Spread.getActiveSheet();
		for(var i = 1;i <= distSheet.getColumnCount();i++){
			var title = getTitle(distSheet, titleRowDg, i);
			if(title == '附件及索引' || title == '票据复印件索引'){
				billColIndex = i - 1;
				break;
			}
		}
		// 根据列名获取名称列
		for(var i = 1;i <= distSheet.getColumnCount();i++){
			var title = getTitle(distSheet, titleRowDg, i);
			if(title == '资产名' || title == '货品名' || title == '在建工程名' || title == '出票人全称' || title == '币种'){
				nameColIndex = i - 1;
				break;
			}
		}
		if(billColIndex != ''){
			for(var i = 0;i < billInfo.length;i++){
				if(billInfo[i].stockAssetsImageDtos != null){
					var imageList = [];
					for(var data of billInfo[i].stockAssetsImageDtos){
						imageList.push({urlText: '', url: data.imageUrl, urlType: 'jianpan'});
					}
					generateUrlLink(billSheetIndex, startrow + i - 1, billColIndex, imageList);
				}
				if(billInfo[i].manualEntry == '1'){
					// 手动标红
					distSheet.getRange(startrow + i - 1, nameColIndex).backColor("red");
				}
			}
		}
		if(signinInfo.length > 0){
			var signinSheetIndex = designer.Spread.getSheetIndex("签到记录");
			for(var i = 0;i < signinInfo.length;i++){
				if(signinInfo[i].imageUrl != ''){
					var imageList = [{urlText: '', url: signinInfo[i].imageUrl, urlType: 'jianpan'}];
					generateUrlLink(signinSheetIndex, 2 + i, 4, imageList);
				}
			}
		}
		if(signatureInfo.length > 0){
			var signatureInfoSheetIndex = designer.Spread.getSheetIndex("签名记录");
			for(var i = 0;i < signatureInfo.length;i++){
				if(signatureInfo[i].url != ''){
					var imageList = [{urlText: '', url: signatureInfo[i].url, urlType: 'jianpan'}];
					generateUrlLink(signatureInfoSheetIndex, 2 + i, 4, imageList);
				}
			}
		}
	}
	// 单向链接--外部url链接
	function generateUrlLink(sheetIndex, rowIndex, colIndex, list){
		var cellTagStart = [];
		var num = 0;
		for(var data of list){
			num++;
			var url;
			var display;
			var sheetName;
			var formula;
			cellTagStart.push({
				type: 'link',
				linkText: 'L' + num,
				isExternal: true,
				linkType: 'URL',
				urlText: data.urlText,
				url: data.url,
				urlType: data.urlType
			});
		}
		// sheet索引 +':' + 行索引 +':' + 列索引 // 0:12:7
		var mapKey = sheetIndex + ':' + rowIndex + ':' + colIndex;
		// 该底稿单元格存在单向链接时，删除再添加
		// 该底稿单元格不存在单向链接时，添加
		if (!designer.ShowSingleLinkCacheMap.has(mapKey)) {
			designer.ShowSingleLinkCacheMap.set(mapKey,cellTagStart);
		} else if (designer.ShowSingleLinkCacheMap.has(mapKey)) {
			designer.ShowSingleLinkCacheMap.delete(mapKey);
			if (cellTagStart.length !== 0) {
				designer.ShowSingleLinkCacheMap.set(mapKey, cellTagStart);
			}
		}
		designer.Spread.suspendPaint();
		var sheet = designer.Spread.getSheet(sheetIndex);
		// var activeCell = sheet.getCell(row, col);
		var activeCell = sheet.getCell(rowIndex, colIndex); // 待定
		activeCell.cellType(new designer.ShowSingleLink());
		activeCell.tag({
			cellTagStart: cellTagStart
		});
		// 居左
		activeCell.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
		activeCell.foreColor('blue');
		activeCell.textDecoration(GC.Spread.Sheets.TextDecorationType.underline);
		designer.Spread.resumePaint();
	}

	// 根据sheet、标题行、列获取标题
	function getTitle(sheetDg, titleRowDg, titleColDg){
		var title = '';
		sheetDg.setActiveCell(titleRowDg - 1, titleColDg - 1);
		var row = sheetDg.getSelections()[0].row;
		var col = sheetDg.getSelections()[0].col;
		if(sheetDg.getValue(row, col) != null && sheetDg.getValue(row, col) != ''){
			title = sheetDg.getValue(row, col);
			/*for(var j = row;j >= 1;j--){
				var lastTitle = getLastTitle(sheetDg, j, titleColDg);
				if(lastTitle != null && lastTitle != ''){
					title = lastTitle + '-' + title;
				}
			}*/
		}
		return title;
	}

	function getLastTitle(sheetDg, titleRowDg, titleColDg){
		var title = '';
		sheetDg.setActiveCell(titleRowDg - 1, titleColDg - 1);
		var row = sheetDg.getSelections()[0].row;
		var col = sheetDg.getSelections()[0].col;
		if(sheetDg.getValue(row, col) != null && sheetDg.getValue(row, col) != ''){
			title = sheetDg.getValue(row, col);
		}
		return title;
	}
	function containsNumber(str) {
	    var reg=/\d/;
	    return reg.test(str);
	}
	/**
	 * 挂载
	 */
	mount = () => {
		$(agrs.region).empty().append(_template);
		listener();
	};
	
	mount();
}