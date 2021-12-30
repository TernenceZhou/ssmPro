$(document).ready(function () {
	uiBlocksApi(false, 'init');
	var insideTransactionParam = localStorage.getItem("insideTransactionParam");
	
	var insideTransactionTable = function (cus, yy, insideTransactionParam) {
		var obj = JSON.parse(insideTransactionParam);
		var param = {
			'menuId': window.sys_menuId,
			'lockProjectId': cus,
			'lockYyyy': yy,
			'subjectId': obj.subjectId,
			'showType': obj.showType,
			'oppositeSubjectId': obj.oppositeSubjectId,
			'relatedList': obj.relatedList,
			'param1': obj.relatedVoucher
		};
		insideTransactionAnalysisTab('tab_detailaccount', param);
	};
	insideTransactionTable(window.CUR_PROJECTID, window.CUR_PROJECT_ACC_YEAR, insideTransactionParam);
});

