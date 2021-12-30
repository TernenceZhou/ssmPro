/******************在线底稿功能******************/
/**
 * 单向链接
 */
function generateSinglyLink(list){
	for(var data of list){
		// 底稿单元格赋值
		var activeCellValue = data.activeCellValue;
		// 其他底稿sheet索引号
		var otherSheetIndex = data.otherSheetIndex;
		// 其他底稿单元格位置 // A1
		var otherRangeStr = data.otherRangeStr;
		// 其他底稿索引号 // 1002-0003-0001
		var otherIndex = data.otherIndex;
		// 其他底稿autoId
		var otherAutoId = data.otherAutoId;
		// 其他底稿文件名 // 1002-0003-0001-银行存款余额调节表.xlsx
		var otherFileName = data.otherFileName;
		// 源底稿sheet名
		var sheetName = data.sheetName;
		// 源底稿单元格位置 // C3
		var rangeStr = data.rangeStr;
		var cellTagStart = [];
		cellTagStart.push({
			type: 'link',
			isFile: false,
			// 其他底稿sheet索引号 + ':' + 其他底稿单元格位置 // 0:A1
			formula: otherSheetIndex + ':' + otherRangeStr,
			// 其他底稿索引号 // 1002-0003-0001
			displayText: otherIndex,
			// 源底稿sheet名 // Sheet1
			sheetName: sheetName,
			// 其他底稿autoId + ':' + 其他底稿索引号 // 20972:1002-0003-0001
			paperListCell: otherAutoId + ':' + otherIndex,
			// 其他底稿文件名 // 1002-0003-0001-银行存款余额调节表.xlsx
			paperTextCell: otherFileName,
			linkText: 'L1',
			// 源底稿sheet名 + ':' + 源底稿单元格位置 // Sheet1:C3
			cellPosition: sheetName + ':' + rangeStr
		});
		// 源底稿sheet索引
		var sheetIndex = data.sheetIndex;
		// 源底稿行索引 // C3
		var rowIndex = data.rowIndex;
		// 源底稿列索引 // C3
		var colIndex = data.colIndex;
		// 源底稿sheet索引 +':' + 行索引 +':' + 列索引 // 0:2:2
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
		activeCell.value(activeCellValue);
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
	let objSingleLink = {};
	let singleLinkMap = designer.ShowSingleLinkCacheMap;
	for (let [k, v] of singleLinkMap) {
		objSingleLink[k] = v;
	}
	$.ajax({
		url: 'dgCenter/DgFunctions.saveSinglyLink.json',
		// async: false,
		type: 'post',
		dataType: 'json',
		data: {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID,
			param3: designer.workpaperId,
			param4: JSON.stringify(objSingleLink)
		},
		success(data) {
			if(!data.success){
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
}

/**
 * 底稿取值
 */
function generateFetchDgValue(otherAutoId, list){
	var dgFetchCacheMap = new Map();
	for(var data of list){
		// 源底稿文件名
		var fileName = data.fileName;
		// 源底稿autoId
		var autoId = data.autoId;
		// 源底稿索引号
		var index = data.index;
		// 源底稿sheet索引号
		var sheetIndex = data.sheetIndex;
		// 源底稿sheet名
		var sheetName = data.sheetName;
		// 源底稿单元格位置
		var rangeStr = data.rangeStr;
		// 其他底稿sheet索引
		var otherSheetIndex = data.otherSheetIndex;
		// 其他底稿行索引
		var otherRowIndex = data.otherRowIndex;
		// 其他底稿列索引
		var otherColIndex = data.otherColIndex;
		
		var cellTagStart = [];
		cellTagStart.push({
			type: 'link',
			linkText: 'N',
			// 源底稿文件名 // 1002-0001-0001-银行存款明细余额表.xlsx
			dgFileInputVal: fileName,
			// 源底稿autoId + ':' + 源底稿索引号 // 20775:1002-0001-0001
			dgFileInputText: autoId + ':' + index,
			// 源底稿autoId + ':' + 源底稿索引号 // 20775:1002-0001-0001
			dgFileSelectVal: autoId + ':' + index,
			// 源底稿sheet索引号 // 0
			dgSheetSelectVal: sheetIndex,
			// 源底稿autoId // 20775
			dgFileId: autoId,
			// 源底稿sheet名 // 封面
			dgSheetName: sheetName,
			// 源底稿单元格位置 // D13
			dgRange: rangeStr
		});
		// 其他底稿sheet索引 + ':' + 其他底稿行索引 + ':' + 其他底稿列索引 // 0:10:2
		var mapKey = otherSheetIndex + ':' + otherRowIndex + ':' + otherColIndex;
		// 该单元格存在取值链接时，删除再添加
		// 该单元格不存在取值链接时，添加
		if (!dgFetchCacheMap.has(mapKey)) {
			dgFetchCacheMap.set(mapKey, cellTagStart);
		} else if (dgFetchCacheMap.has(mapKey)) {
			dgFetchCacheMap.delete(mapKey);
			dgFetchCacheMap.set(mapKey, cellTagStart);
		}
	}
	var objDgFetch = {};
	for (let[k,v] of dgFetchCacheMap) {
		objDgFetch[k] = v;
	}
	$.ajax({
		url: 'dgCenter/DgFunctions.saveFetchDgValue.json',
		// async: false,
		type: 'post',
		dataType: 'json',
		data: {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID,
			param3: otherAutoId,
			param4: JSON.stringify({DgFetchCacheMap: objDgFetch})
		},
		success(data) {
			if(!data.success){
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
}
// 打开其他底稿
function openOtherDg(otherWorkpaperId){
	$.ajax({
		type: 'post',
		url: 'dgCenter/DgGeneral.query.json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00078',
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID,
			param3: otherWorkpaperId,
			start: -1,
			limit: -1
		},
		dataType: 'json',
		success(data) {
			if (data.success) {
				// 底稿节点信息
				var nodeData = {
					extraOptions: data.data[0],
					currentNode: {
						extraOptions: data.data[0]
					}
				};
				nodeData.autoId = nodeData.extraOptions.autoId;
				nodeData.workpaperId = nodeData.extraOptions.workpaperId;
				nodeData.menuId = window.sys_menuId;
				$.sessionStorage('dgFileNode', JSON.stringify(nodeData));
				window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
				$.sessionStorage('dgFileNode', null);
			}
		}
	});
}
/**
 * 生成的明细行弹出框
 */
function otherDgChioce (redirectList, otherDgName) {
	$('#otherDgNameText').val(otherDgName);
	var redirectArr = redirectList.filter((item, i) => {
		return item.redirectName == otherDgName
	});
	if (redirectArr.length == 0) {
		bdoInfoBox('提示', '无动态底稿需要生成。');
		return
	}
	if(redirectArr[0].id == 256 || redirectArr[0].id == 284){
		// 应收账款明细表--生成应收账款账龄分析表 275
		// 应收账款明细表--生成应收账款坏账准备 278
		// 其他应收款明细表--生成其他应收款坏账准备 286
		$('#otherRedirectId_accountsToCollect').val(redirectArr[0].redirectId);
		if(redirectArr[0].id == 284){
			$('#detailRow_accountsToCollect').val('');
			$('#startCol_accountsToCollect').val('AI');
		}
		$('#accountsToCollectParamModal').modal('show');
	}else if(redirectArr[0].id == 275){
		// 应收账款账龄分析表--生成应收账款周转率分析表
		$.ajax({
			url: 'dgCenter/DgPaper.createOtherDg.json',
			// async: false,
			type: 'post',
			dataType: 'json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: redirectArr[0].redirectId,
				param4: designer.workpaperId,
				param5: designer.Spread.getActiveSheetIndex(),
				param6: designer.Spread.getActiveSheet().name()
			},
			success(data) {
				if(data.success){
					(function(){
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
					})();
					openOtherDg(data.data[0].workpaperId);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}else{
		// 得到需要获取数据的列索引
		if (!redirectArr[0].dgColIndex1 
				&& !redirectArr[0].dgColIndex1Param1 
				&& !redirectArr[0].dgColIndex2 
				&& !redirectArr[0].dgColIndex3) {
			bdoErrorBox('失败', '未获取配置数据列！');
			return
		}
		// 获取数据
		var sheet = designer.Spread.getActiveSheet();
		
		var dataIndex  = redirectArr[0].dgColIndex1.split(",");
		var dataParam = redirectArr[0].dgColIndex1Param1.split(',');
		
		var dataArr = [];
		var rowCount = sheet.getRowCount();
		var colCount = sheet.getColumnCount();
		for (var i = 0; i < rowCount; i++) {
			var genAble = {};
			// 如果校验类为空，则属于不需要勾或者冻结质押判断
			if (!redirectArr[0].checColkIndex) {
				var checkName = sheet.getValue(i + redirectArr[0].paramColIndex3,redirectArr[0].paramColIndex2 - 1);
				if (!checkName || checkName == '合计') {
					break;
				}
				for (var j = 0; j < dataIndex.length; j++) {
					genAble[dataParam[j]] = sheet.getValue(i + redirectArr[0].paramColIndex3,dataIndex[j]);
				}
				dataArr.push(genAble);
			} else {
				var checkName = sheet.getValue(i,redirectArr[0].checColkIndex - 1);
				// 当dg校验列为勾， 或者 为冻结与质押的其中一种
				if (checkName == '√' || checkName == 'v' || checkName == 'V' || checkName == '冻结' || checkName == '质押') {
					for (var j = 0; j < dataIndex.length; j++) {
						genAble[dataParam[j]] = sheet.getValue(i,dataIndex[j]);
					}
					dataArr.push(genAble);
				}
			}
		}
	
		$('#showGenDgList').empty();
		// 页面modal显示可生成的底稿
		let num = 1;
		if(redirectArr[0].id == 9) {
			$.each(dataArr, function(j, item) {
				if (dataArr[j].val1 && 
					((dataArr[j].val4 && dataArr[j].val4 != 0) || 
					(dataArr[j].val5 && dataArr[j].val5 != 0) || 
					(dataArr[j].val11 && dataArr[j].val11 != 0) || 
					(dataArr[j].val12 && dataArr[j].val12 != 0))) {
					let check = '<label style="color: green;font-size: 15px; margin-left: 30px;">√</label><br/>';
					// excel sheet名称的最大长度为30
					if (dataArr[j].val1.length > 30) {
						check = '<label style="color: red;font-size: 15px; margin-left: 30px;">×</label>';
						check = check + '<label style="color: red; margin-left: 5px;">开户银行、机构或科目名称文字过长，请调整！</label><br/>';
					}
					let div = '<input type="checkbox" style="margin-right: 15px;" name="chioceBox" value="' + dataArr[j].val1 + '"/>'
							+ '<label>' + num + '、</label><label>' + dataArr[j].val1 + '</label>'
							+ check;
					$('#showGenDgList').append(div);
					num++;
				}
			});
			$('#show_hasAmount').prop('checked', true)
		} else {
			$.each(dataArr, function(j, item) {
				if (dataArr[j].val1) {
					let check = '<label style="color: green;font-size: 15px; margin-left: 30px;">√</label><br/>';
					// excel sheet名称的最大长度为30
					if (dataArr[j].val1.length > 30) {
						check = '<label style="color: red;font-size: 15px; margin-left: 30px;">×</label>';
						check = check + '<label style="color: red; margin-left: 5px;">开户银行、机构或科目名称文字过长，请调整！</label><br/>';
					}
					let div = '<input type="checkbox" style="margin-right: 15px;" name="chioceBox" value="' + dataArr[j].val1 + '"/>'
							+ '<label>' + num + '、</label><label>' + dataArr[j].val1 + '</label>'
							+ check;
					$('#showGenDgList').append(div);
					num++;
				}
			});
		}
		$('#showGenDgModal').modal('show');
		$('#showGenDgModal').find('h3.block-title').text('生成底稿(' + redirectArr[0].param1+")");
		$('#screenItem').val('');
		$('#diaplayAmount').attr("style","display:none;")
	}
}

/**
 * 明细行再刷新
 */
function refreshOtherDgChioce (redirectList, otherDgName, screenItem, hasAmount) {
	var redirectArr = redirectList.filter((item, i) => {
		return item.redirectName == otherDgName
	});
	
	if (redirectArr.length == 0) {
		bdoInfoBox('提示', '无动态底稿需要生成。');
		return
	}
	
	// 得到需要获取数据的列索引
	if (!redirectArr[0].dgColIndex1 
			&& !redirectArr[0].dgColIndex1Param1 
			&& !redirectArr[0].dgColIndex2 
			&& !redirectArr[0].dgColIndex3) {
		bdoErrorBox('失败', '未获取配置数据列！');
		return
	}
	// 获取数据
	var sheet = designer.Spread.getActiveSheet();
	
	var dataIndex  = redirectArr[0].dgColIndex1.split(",");
	var dataParam = redirectArr[0].dgColIndex1Param1.split(',');
	
	var dataArr = [];
	var rowCount = sheet.getRowCount();
	var colCount = sheet.getColumnCount();
	for (var i = 0; i < rowCount; i++) {
		var genAble = {};
		// 如果校验类为空，则属于不需要勾或者冻结质押判断
		if (!redirectArr[0].checColkIndex) {
			var checkName = sheet.getValue(i + redirectArr[0].paramColIndex3,redirectArr[0].paramColIndex2 - 1);
			if (!checkName || checkName == '合计') {
				break;
			}
			for (var j = 0; j < dataIndex.length; j++) {
				genAble[dataParam[j]] = sheet.getValue(i + redirectArr[0].paramColIndex3,dataIndex[j]);
			}
			dataArr.push(genAble);
		} else {
			var checkName = sheet.getValue(i,redirectArr[0].checColkIndex - 1);
			// 当dg校验列为勾， 或者 为冻结与质押的其中一种
			if (checkName == '√' || checkName == 'v' || checkName == 'V' || checkName == '冻结' || checkName == '质押') {
				for (var j = 0; j < dataIndex.length; j++) {
					genAble[dataParam[j]] = sheet.getValue(i,dataIndex[j]);
				}
				dataArr.push(genAble);
			}
		}
	}

	$('#showGenDgList').empty();
	// 页面modal显示可生成的底稿
	let num = 1;
	if(redirectArr[0].id == 9) {
		$.each(dataArr, function(j, item) {
			if (dataArr[j].val1 && 
				(screenItem == '' || dataArr[j].val1.indexOf(screenItem) != -1) && 
				((hasAmount == 0 && 
				((!dataArr[j].val4 || dataArr[j].val4 == 0) && 
				(!dataArr[j].val5 || dataArr[j].val5 == 0) && 
				(!dataArr[j].val11 || dataArr[j].val11 == 0) && 
				(!dataArr[j].val12 || dataArr[j].val12 == 0))) || 
				(hasAmount == 1 &&
				((dataArr[j].val4 && dataArr[j].val4 != 0) || 
				(dataArr[j].val5 && dataArr[j].val5 != 0) || 
				(dataArr[j].val11 && dataArr[j].val11 != 0) || 
				(dataArr[j].val12 && dataArr[j].val12 != 0))))) {
				let check = '<label style="color: green;font-size: 15px; margin-left: 30px;">√</label><br/>';
				// excel sheet名称的最大长度为30
				if (dataArr[j].val1.length > 30) {
					check = '<label style="color: red;font-size: 15px; margin-left: 30px;">×</label>';
					check = check + '<label style="color: red; margin-left: 5px;">开户银行、机构或科目名称文字过长，请调整！</label><br/>';
				}
				let div = '<input type="checkbox" style="margin-right: 15px;" name="chioceBox" value="' + dataArr[j].val1 + '"/>'
						+ '<label>' + num + '、</label><label>' + dataArr[j].val1 + '</label>'
						+ check;
				$('#showGenDgList').append(div);
				num++;
			}
		});
	}else{
		$.each(dataArr, function(j, item) {
			if (dataArr[j].val1 && 
				(screenItem == '' || dataArr[j].val1.indexOf(screenItem) != -1)) {
				let check = '<label style="color: green;font-size: 15px; margin-left: 30px;">√</label><br/>';
				// excel sheet名称的最大长度为30
				if (dataArr[j].val1.length > 30) {
					check = '<label style="color: red;font-size: 15px; margin-left: 30px;">×</label>';
					check = check + '<label style="color: red; margin-left: 5px;">开户银行、机构或科目名称文字过长，请调整！</label><br/>';
				}
				let div = '<input type="checkbox" style="margin-right: 15px;" name="chioceBox" value="' + dataArr[j].val1 + '"/>'
						+ '<label>' + num + '、</label><label>' + dataArr[j].val1 + '</label>'
						+ check;
				$('#showGenDgList').append(div);
				num++;
			}
		});
	}
	$('#showGenDgModal').modal('show');
}

/**
 * 保存底稿时获取参数（单向链接、交叉索引、抽凭链接、底稿取值）
 */
function getDgParam(param){
	var objSingleLink = {};
	var objMutualIndex = {};
	var objAuditSampling = {};
	var objDgFetch = {};
	// 遍历sheet页
	for(var sheetNum = 0;sheetNum < designer.Spread.sheets.length;sheetNum++){
		var sheet = designer.Spread.getSheet(sheetNum);
		var rowCount = sheet.getRowCount();
		// 遍历sheet页内所有行
		for(var rowNum = 0;rowNum < rowCount;rowNum++){
			var colCount = sheet.getColumnCount()
			// 遍历行所有列
			for(var colNum = 0;colNum < colCount;colNum++){
				var activeCell = sheet.getCell(rowNum, colNum);
				// 当前单元格单元格类型
				var currentCellType = activeCell.cellType();
				if (currentCellType && typeof(currentCellType) != "undefined"){
					// 单向链接
					if (currentCellType.typeName == 'ShowSingleLink') {
						var tag = sheet.getTag(rowNum, colNum);
						objSingleLink[sheetNum + ":" + rowNum + ":" + colNum] = tag.cellTagStart;
					}
					// 交叉索引
					if (currentCellType.typeName == 'ShowMutualIndex') {
						var tag = sheet.getTag(rowNum, colNum);
						objMutualIndex[sheetNum + ":" + rowNum + ":" + colNum] = tag;
					}
					// 抽凭链接
					if (currentCellType.typeName == 'ShowAuditSampling') {
						var tag = sheet.getTag(rowNum, colNum);
						objAuditSampling[sheetNum + ":" + rowNum + ":" + colNum] = tag.cellTagStart;
					}
					// 底稿取值
					if (currentCellType.typeName == 'ShowDgFetch') {
						var tag = sheet.getTag(rowNum, colNum);
						objDgFetch[sheetNum + ":" + rowNum + ":" + colNum] = tag.cellTagStart;
					}
				}
			}
		}
	}
	param.customizeStyle = JSON.stringify({
		ShowSingleLinkCacheMap: objSingleLink,
		ShowMutualIndexCacheMap: objMutualIndex,
		ShowAuditSamplingCacheMap: objAuditSampling
	});
	param.dgValueInfo = JSON.stringify({
		DgFetchCacheMap: objDgFetch
	});
	return param;
}

/**
 * 保存附注时获取参数（交叉索引、附注底稿取值）
 */
function getNoteParam(param){
	var objNote = {};
	var objMutualIndex = {};
	// 遍历sheet页
	for(var sheetNum = 0;sheetNum < designer.Spread.sheets.length;sheetNum++){
		var sheet = designer.Spread.getSheet(sheetNum);
		var rowCount = sheet.getRowCount();
		// 遍历sheet页内所有行
		for(var rowNum = 0;rowNum < rowCount;rowNum++){
			var colCount = sheet.getColumnCount()
			// 遍历行所有列
			for(var colNum = 0;colNum < colCount;colNum++){
				var activeCell = sheet.getCell(rowNum, colNum);
				// 当前单元格单元格类型
				var currentCellType = activeCell.cellType();
				if (currentCellType && typeof(currentCellType) != "undefined"){
					// 交叉索引
					if (currentCellType.typeName == 'ShowMutualIndex') {
						var tag = sheet.getTag(rowNum, colNum);
						objMutualIndex[sheetNum + ":" + rowNum + ":" + colNum] = tag;
					}
					// 附注底稿取值
					if (currentCellType.typeName == 'ShowNoteDgValueInfo') {
						var tag = sheet.getTag(rowNum, colNum);
						objNote[sheetNum + ":" + rowNum + ":" + colNum] = tag.cellTagStart;
					}
				}
			}
		}
	}
	param.noteDgValueInfo = JSON.stringify({
		NoteCacheMap: objNote
	});
	param.customizeStyle = JSON.stringify({
		ShowMutualIndexCacheMap: objMutualIndex
	});
	return param;
}

/**
 * 保存现金流量表时获取参数（现金流量表取值）
 */
function getQYXJParam(param){
	var objCashFlow = {};
	// 遍历sheet页
	for(var sheetNum = 0;sheetNum < designer.Spread.sheets.length;sheetNum++){
		var sheet = designer.Spread.getSheet(sheetNum);
		var rowCount = sheet.getRowCount();
		// 遍历sheet页内所有行
		for(var rowNum = 0;rowNum < rowCount;rowNum++){
			var colCount = sheet.getColumnCount()
			// 遍历行所有列
			for(var colNum = 0;colNum < colCount;colNum++){
				var activeCell = sheet.getCell(rowNum, colNum);
				// 当前单元格单元格类型
				var currentCellType = activeCell.cellType();
				if (currentCellType && typeof(currentCellType) != "undefined"){
					// 现金流量表取值
					if (currentCellType.typeName == 'ShowCashFlowInfo') {
						var tag = sheet.getTag(rowNum, colNum);
						objCashFlow[sheetNum + ":" + rowNum + ":" + colNum] = tag.cellTagStart;
					}
				}
			}
		}
	}
	param.customizeStyle = JSON.stringify({
		CashFlowCacheMap: objCashFlow
	});
	return param;
}

//跳转抽凭附件链接页面
function goToAttachLink(mapKey){
	var cacheMap = designer.ShowAuditSamplingCacheMap;
	if(cacheMap.size > 0){
		var mapCache;
		var isSamplingCell = false;
		for (var mapLink of cacheMap) {
			if(mapLink[0] == mapKey){
				mapCache = mapLink[1];
				isSamplingCell = true;
				break;
			}
		}
		if(isSamplingCell){
			var mapData = {
				customerId: designer.dgExtraOptions.customerId,
				projectId: designer.dgExtraOptions.projectId,
				workpaperId: designer.workpaperId,
				mapKey: mapKey,
				mapCache: mapCache,
				mapType: 'sampling'
			};
			$.sessionStorage('attachPageNode', JSON.stringify(mapData));
			window.open('/Faith/dgcenter.do?m=openAttachPage&projectId=' + designer.dgExtraOptions.projectId);
		}
	}
	cacheMap = designer.ShowSingleLinkCacheMap;
	if(cacheMap.size > 0){
		var mapCache;
		var isSingleLinkCell = false;
		for (var mapLink of cacheMap) {
			if(mapLink[0] == mapKey){
				mapCache = mapLink[1];
				isSingleLinkCell = true;
				break;
			}
		}
		if(isSingleLinkCell){
			var mapData = {
				customerId: designer.dgExtraOptions.customerId,
				projectId: designer.dgExtraOptions.projectId,
				workpaperId: designer.workpaperId,
				mapKey: mapKey,
				mapCache: mapCache,
				mapType: 'singleLink'
			};
			$.sessionStorage('attachPageNode', JSON.stringify(mapData));
			window.open('/Faith/dgcenter.do?m=openAttachPage&projectId=' + designer.dgExtraOptions.projectId);
		}
	}
}

function setCustomizeStyle(data) {
	if (data.data && data.data[0] && (data.data[0].customizeStyle && data.data[0].customizeStyle != '')) {
		// 交叉索引
		designer.setShowMutualIndexCacheMap(JSON.parse(data.data[0].customizeStyle).ShowMutualIndexCacheMap);
		// 单向链接(左link)
		designer.setShowSingleLinkCacheMap(JSON.parse(data.data[0].customizeStyle).ShowSingleLinkCacheMap, {sheet: 0});
		// 抽凭附件链接(左link)
		designer.setShowAuditSamplingCacheMap(JSON.parse(data.data[0].customizeStyle).ShowAuditSamplingCacheMap, {sheet: 0});
	}
	if (data.data && data.data[0] && (data.data[0].dgValueInfo && data.data[0].dgValueInfo != '')) {
		// 底稿取值
		designer.setDgFetchCacheMap(JSON.parse(data.data[0].dgValueInfo).DgFetchCacheMap);
	}
	// 设置活动单元格
	if ($.sessionStorage('cellLinkFormula') != null || $.sessionStorage('cellLinkFormulaBySheetName') != null) {
		designer.setCellLink();
	}
	bdoSuccessBox('加载完成', data.resultInfo.statusText);
}

function getCustomizeStyleFromEditFunction(customerId, workpaperId) {
	$.ajax({
		url: 'dgCenter/DgGeneral.query.json',
		type: 'post',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00072',
			param1: customerId,
			param2: workpaperId
		},
		dataType: 'json',
		success: setCustomizeStyle
	});
}