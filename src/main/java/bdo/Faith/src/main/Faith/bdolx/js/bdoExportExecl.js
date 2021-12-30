var applyIf = function(object, config) {
	var property;
	if (object) {
		for (property in config) {
			if (object[property] === undefined) {
				object[property] = config[property];
			}
		}
	}
	return object;
};

/**
 * 获取表头部配置信息，作为execl中的标题
 * @param {} tableColumns
 * @return {}
 */
var getColumnsInfo = function(tableColumns) {
	var columns = tableColumns;
	var rtn = [];
	var i, ln;
	for (i = 0; i < columns.length; i++) {
		var c = columns[i];
		if (c.title != '&#160;' && c.title != '操作' && c.title != '处理' && c.title != '序号' && c.title != '填充金额') {
			if (c.data && c.data != '') {
				var columnInfo = {};
				columnInfo.cnName = c.title;
				columnInfo.enName = c.data;
				if (c.width){
					// 优先用数据的width值
					columnInfo.size = c.width.split('px')[0];
				}else if(c.className){
					// 其次按样式类查找取宽度
					let $el = $('.' + c.className.replace(/\s+/g, '.'));
					if ($el[0]){
						columnInfo.size = $el[0].style.width.replace(/px/i, '');
					}else{
						// 最后不得已使用默认值
						columnInfo.size = '100';
					}
				}else{
					// 最后不得已使用默认值
					columnInfo.size = '100';
				}
				columnInfo.className = c.className;
				if (c.renderer) {
					columnInfo.renderer = c.renderer;
				}
				rtn.push(columnInfo);
			}
		}
	}
	return rtn;
};


/**
 *  导出 单文件多sheet
 * @param {
 * 	me: 点击的元素,
 *  title: execl下载时候的标题,
 *  tableParam： datatable的tableParam参数,
 *  tableId： 那个datatable要导出
 * }
 * @return {}
 */
var exportExcel2 = function(me, title, table_view, tableId) {
	if ($('#' + tableId).DataTable().context[0]._iRecordsTotal > 600000) {
		bdoErrorBox('失败', '导出功能一次最多能导出60000条数据，您目前的检索结果超过上限，请增加过滤条件后再进行导出。');
		return;
	}
	if (title == null && title == '') {
		title = $(me).closest('.block-title').text();
	}
	var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
	var myParam = applyIf({}, table_view.localParam.urlparam);
//	myParams.filter = tableParam.filterParam.filter;
//	myParams.menuId=sys_menuId;
//	myParams.sqlId=tableParam.filterParam.sqlId;
	delete  myParam.sort;
	myParam.page = '';
	myParam.start = '';
	myParam.limit = '';
	myParam.queryUrl = table_view.localParam.url;
	myParam.columnMap = columnInfo;
	//http://www.jb51.net/article/36850.htm --- JQuery的ajax函数的返回类型只有xml、text、json、html等类型，没有“流”类型.
	//所以我们要实现ajax下载，不能够使用相应的ajax函数进行文件下载。
	//但可以用js生成一个form，用这个form提交参数，并返回“流”类型的数据。在实现过程中，页面也没有进行刷新
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', 'cpBase/SubjectManage.exportExcel.json');
	var input1 = $('<input>');
	input1.attr('type', 'hidden');
	input1.attr('name', 'myParams');
	input1.attr('value', JSON2.stringify(myParam));
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'title');
	input2.attr('value', encodeURI(title));
	$('body').append(form);//将表单放置在web中
	form.append(input1);
	form.append(input2);
	form.submit();//表单提交
	form.remove();
};
/**
 * 未审报表导出
 */
var exportExcel3 = function(me, title, table_view, tableId) {
	/*if ($('#'+tableId).DataTable().context[0]._iRecordsTotal > 600000) {
		bdoErrorBox('失败', '导出功能一次最多能导出60000条数据，您目前的检索结果超过上限，请增加过滤条件后再进行导出。');
		return;
	}*/
	if (title == null && title == '') {
		title = $(me).closest('.block-title').text();
	}
	var myParams = [];
	$.each(table_view, function(i, obj) {
		var columnInfo = getColumnsInfo(obj.tableParam.columnDefs);
		myParams[i] = applyIf({}, obj.localParam.urlparam);
		delete  myParams[i].sort;
		myParams[i].page = '';
		myParams[i].start = '';
		myParams[i].limit = '';
		myParams[i].queryUrl = obj.localParam.url;
		myParams[i].columnMap = columnInfo;

	});

//		var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
//		var myParam = applyIf({},table_view.localParam.urlparam);
//	myParams.filter = tableParam.filterParam.filter;
//	myParams.menuId=sys_menuId;
//	myParams.sqlId=tableParam.filterParam.sqlId;
//		
	//所以我们要实现ajax下载，不能够使用相应的ajax函数进行文件下载。
	//但可以用js生成一个form，用这个form提交参数，并返回“流”类型的数据。在实现过程中，页面也没有进行刷新
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', 'dgCenter/FUnAuditReport.exportExcel.json');
	var input1 = $('<input>');
	input1.attr('type', 'hidden');
	input1.attr('name', 'myParams');
	input1.attr('value', JSON2.stringify(myParams));
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'title');
	input2.attr('value', encodeURI(title));
	$('body').append(form);//将表单放置在web中
	form.append(input1);
	form.append(input2);
	form.submit();//表单提交
	form.remove();
};

var exportExcel4 = function(me, title, table_view, tableId) {
	if ($('#' + tableId).DataTable().context[0]._iRecordsTotal > 600000) {
		bdoErrorBox('失败', '导出功能一次最多能导出60000条数据，您目前的检索结果超过上限，请增加过滤条件后再进行导出。');
		return;
	}
	if (title == null && title == '') {
		title = $(me).closest('.block-title').text();
	}
	var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
	var myParams = applyIf({}, table_view.localParam.urlparam);


	delete  myParams.sort;
	myParams.page = '';
	myParams.start = table_view.localParam.urlparam.start;
	myParams.limit = table_view.localParam.urlparam.limit;
	myParams.param1 = table_view.localParam.urlparam.param1;
	myParams.param2 = table_view.localParam.urlparam.param2;
	myParams.sqlId = table_view.localParam.urlparam.sqlId;
	myParams.menuId = table_view.localParam.urlparam.sys_menuId;
	myParams.queryUrl = table_view.localParam.url;
	myParams.columnMap = columnInfo;

	//http://www.jb51.net/article/36850.htm --- JQuery的ajax函数的返回类型只有xml、text、json、html等类型，没有“流”类型.
	//所以我们要实现ajax下载，不能够使用相应的ajax函数进行文件下载。
	//但可以用js生成一个form，用这个form提交参数，并返回“流”类型的数据。在实现过程中，页面也没有进行刷新
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', 'cpBase/SubjectManage.exportNewExcel.json');
	var input1 = $('<input>');
	input1.attr('type', 'hidden');
	input1.attr('name', 'myParams');
	input1.attr('value', JSON2.stringify(myParams));
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'title');
	input2.attr('value', encodeURI(title));
	$('body').append(form);//将表单放置在web中
	form.append(input1);
	form.append(input2);
	form.submit();// 表单提交
	form.remove();
};

var exportExcel6 = function(me, title, table_view, tableId) {
	if ($('#' + tableId).DataTable().context[0]._iRecordsTotal > 600000) {
		bdoErrorBox('失败', '导出功能一次最多能导出60000条数据，您目前的检索结果超过上限，请增加过滤条件后再进行导出。');
		return;
	}
	if (title == null && title == '') {
		title = $(me).closest('.block-title').text();
	}
	var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
	var myParams = applyIf({}, table_view.localParam.urlparam);


	delete  myParams.sort;
	myParams.page = '';
	myParams.start = table_view.localParam.urlparam.start;
	myParams.limit = table_view.localParam.urlparam.limit;
	myParams.param1 = table_view.localParam.urlparam.param1;
	myParams.param2 = table_view.localParam.urlparam.param2;
	myParams.sqlId = table_view.localParam.urlparam.sqlId;
	myParams.menuId = table_view.localParam.urlparam.sys_menuId;
	myParams.queryUrl = table_view.localParam.url;
	myParams.columnMap = columnInfo;

	//http://www.jb51.net/article/36850.htm --- JQuery的ajax函数的返回类型只有xml、text、json、html等类型，没有“流”类型.
	//所以我们要实现ajax下载，不能够使用相应的ajax函数进行文件下载。
	//但可以用js生成一个form，用这个form提交参数，并返回“流”类型的数据。在实现过程中，页面也没有进行刷新
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', 'cpBase/TBSubjectTemplate.exportNewExcel.json');
	var input1 = $('<input>');
	input1.attr('type', 'hidden');
	input1.attr('name', 'myParams');
	input1.attr('value', JSON2.stringify(myParams));
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'title');
	input2.attr('value', encodeURI(title));
	$('body').append(form);//将表单放置在web中
	form.append(input1);
	form.append(input2);
	form.submit();// 表单提交
	form.remove();
};

//科目绝对数带百分数导出
var exportExcel5 = function(me, title, table_view, tableId) {

	if (title == null && title == '') {
		title = $(me).closest('.block-title').text();
	}
	var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
	var myParams = applyIf({}, table_view.localParam.urlparam);
//	myParams.filter = tableParam.filterParam.filter;
//	myParams.menuId=sys_menuId;
//	myParams.sqlId=tableParam.filterParam.sqlId;
	delete  myParams.sort;
	myParams.page = '';
	myParams.start = '';
	myParams.limit = '';
	myParams.queryUrl = table_view.localParam.url;
	myParams.columnMap = columnInfo;

	//http://www.jb51.net/article/36850.htm --- JQuery的ajax函数的返回类型只有xml、text、json、html等类型，没有“流”类型.
	//所以我们要实现ajax下载，不能够使用相应的ajax函数进行文件下载。
	//但可以用js生成一个form，用这个form提交参数，并返回“流”类型的数据。在实现过程中，页面也没有进行刷新
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', 'finCenter/SubjectAbsoluteNumExport.exportExcelr.json');
	var input1 = $('<input>');
	input1.attr('type', 'hidden');
	input1.attr('name', 'myParams');
	input1.attr('value', JSON2.stringify(myParams));
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'title');
	input2.attr('value', encodeURI(title));
	$('body').append(form);//将表单放置在web中
	form.append(input1);
	form.append(input2);
	form.submit();//表单提交
	form.remove();
};

/**
 * @param {
 * 	me: 点击的元素,
 *  title: execl下载时候的标题,
 *  table_view： datatable 数组
 *  tableId： 那个datatable要导出
 * }
 * @return {}
 */
var exportExcel = function(me, title, table_view, tableId) {
	/*if ($('#'+tableId).DataTable().context[0]._iRecordsTotal > 600000) {
		bdoErrorBox('失败', '导出功能一次最多能导出60000条数据，您目前的检索结果超过上限，请增加过滤条件后再进行导出。');
		return;
	}*/
	if (title == null && title == '') {
		title = $(me).closest('.block-title').text();
	}
	var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
	var myParams = applyIf({}, table_view.localParam.urlparam);
//	myParams.filter = tableParam.filterParam.filter;
//	myParams.menuId=sys_menuId;
//	myParams.sqlId=tableParam.filterParam.sqlId;
	delete  myParams.sort;
	myParams.page = '';
	myParams.start = '';
	myParams.limit = '';
	myParams.queryUrl = table_view.localParam.url;
	myParams.columnMap = columnInfo;

	//http://www.jb51.net/article/36850.htm --- JQuery的ajax函数的返回类型只有xml、text、json、html等类型，没有“流”类型.
	//所以我们要实现ajax下载，不能够使用相应的ajax函数进行文件下载。
	//但可以用js生成一个form，用这个form提交参数，并返回“流”类型的数据。在实现过程中，页面也没有进行刷新
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', 'base/Export.exportExcel.json');
	//form.attr("action","dgCenter/DgExport.exportExcel.json");

	var input1 = $('<input>');
	input1.attr('type', 'hidden');
	input1.attr('name', 'myParams');
	input1.attr('value', JSON2.stringify(myParams));
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'title');
	input2.attr('value', encodeURI(title));
	$('body').append(form);//将表单放置在web中
	form.append(input1);
	form.append(input2);
	form.submit();//表单提交
	form.remove();
};

var exportExcelFin = function(me, title, table_view, tableId) {

	if (title == null && title == '') {
		title = $(me).closest('.block-title').text();
	}
	var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
	var myParams = applyIf({}, table_view.localParam.urlparam);
//	myParams.filter = tableParam.filterParam.filter;
//	myParams.menuId=sys_menuId;
//	myParams.sqlId=tableParam.filterParam.sqlId;
//	delete  myParams.sort;
	myParams.page = '';
	myParams.start = '';
	myParams.limit = '';
	myParams.queryUrl = table_view.localParam.url;
	myParams.columnMap = columnInfo;

	//http://www.jb51.net/article/36850.htm --- JQuery的ajax函数的返回类型只有xml、text、json、html等类型，没有“流”类型.
	//所以我们要实现ajax下载，不能够使用相应的ajax函数进行文件下载。
	//但可以用js生成一个form，用这个form提交参数，并返回“流”类型的数据。在实现过程中，页面也没有进行刷新
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', 'finCenter/FinExport.exportExcel.json');
	var input1 = $('<input>');
	input1.attr('type', 'hidden');
	input1.attr('name', 'myParams');
	input1.attr('value', JSON2.stringify(myParams));
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'title');
	input2.attr('value', encodeURI(title));
	$('body').append(form);//将表单放置在web中
	form.append(input1);
	form.append(input2);
	form.submit();//表单提交
	form.remove();
};

/**
 * 配置一些参数
 *
 * @param {
 * 	me: 点击的元素,
 *  title: execl下载时候的标题,
 *  tableParam： datatable的tableParam参数,
 *  tableId： 那个datatable要导出
 * }
 * @return {}
 */
var exportExcelTo = function(me, data) {
	if (data.title == null && data.title == '') {
		data.title = $(me).closest('.block-title').text();
	}

	if ($('#' + data.table).DataTable().context[0]._iRecordsTotal > 600000) {
		bdoErrorBox('失败', '导出功能一次最多能导出60000条数据，您目前的检索结果超过上限，请增加过滤条件后再进行导出。');
		return;
	}
	bdoInProcessingBox('正在导出到底稿附件!');
	var columnInfo = getColumnsInfo(data.view.tableParam.columnDefs);
	var myParams = applyIf({}, data.view.localParam.urlparam);
	delete myParams.sort;
	myParams.page = '';
	myParams.start = '';
	myParams.limit = '';
	myParams.queryUrl = data.view.localParam.url;
	myParams.columnMap = columnInfo;


	let param = data;
	param.myParams = JSON.stringify(myParams);

	delete param.view;

	$.ajax({
		type: 'post',
		url: 'dgCenter/ExportOtherDg.exportExcelTo.json',
		dataType: 'json', /* 预期服务器返回数据的类型 */
		data: param,
		success: function(data) {
			if (data.success) {
				bdoSuccessBox('成功');
				$('#modal_tbsubjectid').modal('hide');
			} else {
				bdoErrorBox('失败');
				$('#modal_tbsubjectid').modal('hide');
			}
		},
		error: function(jqXHR) {
			alert('发生错误：' + jqXHR.status);
		}
	});
};

/**
 * /**带统计图的导出到底稿附件 配置一些参数
 *
 * @param {
 *            me: 点击的元素, title: execl下载时候的标题, tableParam：
 *            datatable的tableParam参数, tableId： 那个datatable要导出 }
 * @return {}
 */
var exportExcelToImage = function(me, data) {

	if (data.title == null && data.title == '') {
		data.title = $(me).closest('.block-title').text();
	}

	if ($('#' + data.table).DataTable().context[0]._iRecordsTotal > 600000) {
		bdoErrorBox('失败', '导出功能一次最多能导出60000条数据，您目前的检索结果超过上限，请增加过滤条件后再进行导出。');
		return;
	}
	bdoInProcessingBox('正在导出到底稿附件!');
	var columnInfo = getColumnsInfo(data.view.tableParam.columnDefs);
	var myParams = applyIf({}, data.view.localParam.urlparam);
	// myParams.filter = tableParam.filterParam.filter;
	// myParams.menuId=sys_menuId;
	// myParams.sqlId=tableParam.filterParam.sqlId;
	delete myParams.sort;
	myParams.page = '';
	myParams.start = '';
	myParams.limit = '';
	myParams.queryUrl = data.view.localParam.url;
	myParams.columnMap = columnInfo;
	myParams.imgData = data.imgData;

	let param = data;
	param.myParams = JSON.stringify(myParams);

	delete param.view;

	/*
	 * form.submit();//表单提交 form.remove();
	 */
	// ajax提交
	$.ajax({
		type: 'post',
		url: 'dgCenter/ExportOtherDg.exportEchatrsExcelTo.json',
		dataType: 'json', /* 预期服务器返回数据的类型 */
		data: param,
		success: function(data) {
			if (data.success) {
				bdoSuccessBox('成功');
				$('#modal_tbsubjectid').modal('hide');
			} else {
				bdoErrorBox('失败');
				$('#modal_tbsubjectid').modal('hide');
			}
		},
		error: function(jqXHR) {
			alert('发生错误：' + jqXHR.status);
		}
	});

};

/**
 * /** 配置一些参数
 *
 * @param {
 * 	me: 点击的元素,
 *  title: execl下载时候的标题,
 *  tableParam： datatable的tableParam参数,
 *  tableId： 那个datatable要导出
 * }
 * @return {}
 */
var exportEchartsExcel = function(me, title, table_view, tableId, imgData) {
	if ($('#' + tableId).DataTable().context[0]._iRecordsTotal > 600000) {
		bdoErrorBox('失败', '导出功能一次最多能导出60000条数据，您目前的检索结果超过上限，请增加过滤条件后再进行导出。');
		return;
	}
	if (title == null && title == '') {
		title = $(me).closest('.block-title').text();
	}

	var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
	var myParams = applyIf({}, table_view.localParam.urlparam);
//	myParams.filter = tableParam.filterParam.filter;
//	myParams.menuId=sys_menuId;
//	myParams.sqlId=tableParam.filterParam.sqlId;
	delete  myParams.sort;
	myParams.page = '';
	myParams.start = '';
	myParams.limit = '';
	myParams.queryUrl = table_view.localParam.url;
	myParams.columnMap = columnInfo;
	myParams.imgData = imgData;

	//http://www.jb51.net/article/36850.htm --- JQuery的ajax函数的返回类型只有xml、text、json、html等类型，没有“流”类型.
	//所以我们要实现ajax下载，不能够使用相应的ajax函数进行文件下载。
	//但可以用js生成一个form，用这个form提交参数，并返回“流”类型的数据。在实现过程中，页面也没有进行刷新
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', 'finCenter/AbsoluateNum.exportEchatrsExcel.json');
	var input1 = $('<input>');
	input1.attr('type', 'hidden');
	input1.attr('name', 'myParams');
	input1.attr('value', JSON2.stringify(myParams));
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'title');
	input2.attr('value', encodeURI(title));
	$('body').append(form);//将表单放置在web中
	form.append(input1);
	form.append(input2);
	form.submit();//表单提交
	form.remove();
};


var exportExcelWithTemplate = function(url, params) {
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', url);
	//alert(url);
	$('body').append(form);//将表单放置在web中
	$.each(params, function(k, v) {
		form.append($('<input type="hidden" name="' + k +
			'" value="' + v + '">'));
	});

	form.submit();//表单提交

	form.remove();


};

/**
 *  历史报告审核导出 单文件多sheet
 * @param {
 * 	me: 点击的元素,
 *  title: execl下载时候的标题,
 *  tableParam： datatable的tableParam参数,
 *  tableId： 那个datatable要导出
 * }
 * @return {}
 */
var exportExcelHistory = function(me, title, table_view, tableId) {
	if ($('#' + tableId).DataTable().context[0]._iRecordsTotal > 600000) {
		bdoErrorBox('失败', '导出功能一次最多能导出60000条数据，您目前的检索结果超过上限，请增加过滤条件后再进行导出。');
		return;
	}
	if (title == null && title == '') {
		title = $(me).closest('.block-title').text();
	}
	var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
	var myParam = applyIf({}, table_view.localParam.urlparam);
//	myParams.filter = tableParam.filterParam.filter;
//	myParams.menuId=sys_menuId;
//	myParams.sqlId=tableParam.filterParam.sqlId;
	delete  myParam.sort;
	myParam.page = '';
	myParam.start = '';
	myParam.limit = '';
	myParam.queryUrl = table_view.localParam.url;
	myParam.columnMap = columnInfo;
	//http://www.jb51.net/article/36850.htm --- JQuery的ajax函数的返回类型只有xml、text、json、html等类型，没有“流”类型.
	//所以我们要实现ajax下载，不能够使用相应的ajax函数进行文件下载。
	//但可以用js生成一个form，用这个form提交参数，并返回“流”类型的数据。在实现过程中，页面也没有进行刷新
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', 'cpBase/SubjectManage.exportExcelHistory.json');
	var input1 = $('<input>');
	input1.attr('type', 'hidden');
	input1.attr('name', 'myParams');
	input1.attr('value', JSON2.stringify(myParam));
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'title');
	input2.attr('value', encodeURI(title));
	$('body').append(form);//将表单放置在web中
	form.append(input1);
	form.append(input2);
	form.submit();//表单提交
	form.remove();
};
/**
 *  报备模板导出 
 */
var exportExcelBb = function(me, title, table_view, tableId) {
	if ($('#' + tableId).DataTable().context[0]._iRecordsTotal > 600000) {
		bdoErrorBox('失败', '导出功能一次最多能导出60000条数据，您目前的检索结果超过上限，请增加过滤条件后再进行导出。');
		return;
	}
	if (title == null && title == '') {
		title = $(me).closest('.block-title').text();
	}
	var columnInfo = getColumnsInfo(table_view.tableParam.columnDefs);
	var myParams = applyIf({}, table_view.localParam.urlparam);


	delete  myParams.sort;
	myParams.page = '';
	myParams.start = table_view.localParam.urlparam.start;
	myParams.limit = table_view.localParam.urlparam.limit;
	myParams.param1 = table_view.localParam.urlparam.param1;
	myParams.param2 = table_view.localParam.urlparam.param2;
	myParams.sqlId = table_view.localParam.urlparam.sqlId;
	myParams.menuId = table_view.localParam.urlparam.sys_menuId;
	myParams.queryUrl = table_view.localParam.url;
	myParams.columnMap = columnInfo;

	//http://www.jb51.net/article/36850.htm --- JQuery的ajax函数的返回类型只有xml、text、json、html等类型，没有“流”类型.
	//所以我们要实现ajax下载，不能够使用相应的ajax函数进行文件下载。
	//但可以用js生成一个form，用这个form提交参数，并返回“流”类型的数据。在实现过程中，页面也没有进行刷新
	var form = $('<form>');//定义一个form表单
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action', 'cpBase/BBSubjectTemplate.exportNewExcel.json');
	var input1 = $('<input>');
	input1.attr('type', 'hidden');
	input1.attr('name', 'myParams');
	input1.attr('value', JSON2.stringify(myParams));
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'title');
	input2.attr('value', encodeURI(title));
	$('body').append(form);//将表单放置在web中
	form.append(input1);
	form.append(input2);
	form.submit();// 表单提交
	form.remove();
};
