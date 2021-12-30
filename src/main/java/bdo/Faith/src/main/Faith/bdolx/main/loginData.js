function initLogin(loginData) {
	if(!loginData) {
		loginData = {};
	}
	window.BDO_CUSTOMERNAME_SELECT = loginData.selectedCustomerName;
	window.BDO_CUSTOMER_SELECT = loginData.selectedCustomerId;
	window.BDO_PROJECTNAME_SELECT = loginData.selectedProjectName;
	window.BDO_PROJECT_SELECT = loginData.selectedProjectId;
	window.BDO_SYSTEM_WEB_ROOT = '';
	window.BDO_YEAR_SELECT = loginData.selectedProjectYear;

	window.CUR_CUSTOMERID = loginData.selectedCustomerId;
	window.CUR_CUSTOMERNAME = loginData.selectedCustomerName;
	window.CUR_DGPROJECT_AUTOID = loginData.selectedProjectAutoId;
	window.CUR_PROJECTID = loginData.selectedProjectId;
	window.CUR_PROJECTNAME = loginData.selectedProjectName;
	window.CUR_PROJECT_ACC_YEAR = loginData.selectedProjectYear;
	window.CUR_PROJECT_END_MONTH = loginData.selectedProjectEndMonth;
	window.CUR_PROJECT_END_YEAR = loginData.selectedProjectEndYear;
	window.CUR_PROJECT_START_MONTH = loginData.selectedProjectStartMonth;
	window.CUR_PROJECT_START_YEAR = loginData.selectedProjectStartYear;
	window.CUR_USERID = loginData.userId;

	window.companyIdSession = loginData.companyIdSession;
	window.companyNmSession = loginData.companyNmSession;
	window.departIdSession = loginData.departIdSession;
	window.departIdrSession = loginData.departIdrSession;
	window.departNmSession = loginData.departNmSession;
	window.departNmrSession = loginData.departNmrSession;
	window.officeIdSession = loginData.officeIdSession;
	window.officeNmSession = loginData.officeNmSession;

	window.hrLoginId = loginData.hrLoginId;
	window.loginId = loginData.loginId;
	window.name = loginData.userName;
	window.selfNm = loginData.userName;
	window.sys_menuId = window.sys_menuId;
	window.sys_userId = loginData.userId;
	window.userLevel = loginData.userLevel;

	window.systemId = loginData.systemId;
	window.systemName = loginData.systemName;
	window.systemPageTitle = loginData.systemPageTitle;
	window.fromDomain = loginData.fromDomain;
	window.oteServer = loginData.oteServer;
	window.hasSacpCer = loginData.hasSacpCer;
	window.sacpCerExpired = loginData.sacpCerExpired;
	window.sacpCerExpiredDate = loginData.sacpCerExpiredDate;
	window.showHelp = loginData.showHelp;
	window.trinfo = loginData.trInfo;
	window.userCustomers = loginData.userCustomers;
	window.version = '';

	window.bdoVouchingTrInfo = loginData.bdoVouchingTrInfo;
	window.bdoVouchingUrl = loginData.bdoVouchingUrl;
	window.bdoBenfordAnalysis = loginData.bdoBenfordAnalysis;
	window.bdoAccountChecking = loginData.bdoAccountChecking;
	window.generalTableParsingPlatformUrl = loginData.generalTableParsingPlatformUrl;

	window.xxrPageKey = loginData.xxrPageKey;
	window.xxrToken = loginData.xxrToken;
	window.xxrUrl = loginData.xxrUrl;

	window.dxnUrl = loginData.dxnUrl;
	window.dxntoken = loginData.dxntoken;
	window.dxnloginid = loginData.dxnloginid;

	window.edataUrl = loginData.edataUrl;
	window.edatatoken = loginData.edatatoken;
	window.edataloginid = loginData.edataloginid;

	window.bdoCoopSystemUrl = loginData.bdoCoopSystemUrl;

	if(window.bid) {
		window.bid = window.bid;
	}else {
		window.bid = '';
	}
	window.spreadDesignerPath = encodeURI('./assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/');
	let $title = $('title');
	if($title.length > 0) {
		$title.text(window.systemName);
	}
}
function reLoadLoginData(asyncFlag) {
	let asyncInner = true;
	if(asyncFlag === false) {
		asyncInner = false;
	}
	$.sessionStorage('loginData', null);
	$.ajax({
		type: 'post',
		url: 'getLoginData.do',
		data: {},
		dataType: 'json',
		async: asyncInner,
		success(data) {
			if (data.success) {
				$.sessionStorage('loginData', JSON.stringify(data.data));
				initLogin(data.data);
			}
		}
	});
}
$(document).ready(function() {
	let loginDataJsonStr = $.sessionStorage('loginData');
	if(loginDataJsonStr) {
		let loginData = JSON.parse(loginDataJsonStr);
		initLogin(loginData);
	}else {
		reLoadLoginData();
	}
});

