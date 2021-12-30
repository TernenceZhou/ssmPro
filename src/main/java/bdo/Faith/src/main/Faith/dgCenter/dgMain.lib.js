$(document).ready(function() {
	let currentDomain = document.domain;
	let url = 'dgCenter/common/dgMain.lib.jsonp?_d=' + (new Date()).getTime();
	if(currentDomain.indexOf('bdo.com.cn') >= 0 || currentDomain.indexOf('lxtax.com') >= 0) {
		url = 'dgCenter/common/dgMain.lib.env.jsonp?_d=' + (new Date()).getTime();
	}
	$.ajax({
		type: 'post',
		url: url,
		data: {},
		dataType: 'json',
		bdolxLoader: false
	}).done(data => {
		//let dgMainLibList = JSON.parse(data);
		dgMainLibHandler(data);
	});
	function dgMainLibHandler(dgMainLibList) {
		BdoFaithUtil.scripts = dgMainLibList.map(item => window.faithPath + item);
		BdoFaithUtil.loadScriptsOnPage(document, BdoFaithUtil.scripts);
	}
});