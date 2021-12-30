$(document).ready(function() {
	let currentDomain = document.domain;
	let domainArr = {
		'sacpuat.bdo.com.cn': 1,
		'sacp.bdo.com.cn': 1,
		'sacpdemo.bdo.com.cn': 1,
		'cloud.bdo.com.cn': 1,
		'cloud-uat.bdo.com.cn': 1,
		'cloud-qac.bdo.com.cn': 1
	}
	
	if((domainArr[currentDomain] === 1 && currentDomain.indexOf('sacpuat') >= 0 ) || !domainArr[currentDomain]) {
		BdoFaithUtil.scripts = [
			'./assets/js/plugins/performance/web-report-default.min.js',
			'./assets/js/plugins/performance/init.js',
		];
		BdoFaithUtil.webReportUrl = '/uimweb/api/v1/report/web';
		if(!domainArr[currentDomain]) {
			BdoFaithUtil.webReportUrl = 'http://172.16.3.193:7001/api/v1/report/web';
		}
		BdoFaithUtil.loadScriptsOnPage(document, BdoFaithUtil.scripts);
	}
	
});