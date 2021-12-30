function MaterialityPage(agrs) {
	let _template = agrs.template || tplLoader('dgCenter/html/dg/materiality.html')
		, customerId = agrs.data.customerId
		, projectId = agrs.data.projectId;
	$(agrs.region).html(_template);


	function formatSimDate(now) {
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		month = month < 10 ? ('0' + month) : month;
		var date = now.getDate();
		date = date < 10 ? ('0' + date) : date;
		var hour = now.getHours();
		hour = hour < 10 ? ('0' + hour) : hour;
		var minute = now.getMinutes();
		minute = minute < 10 ? ('0' + minute) : minute;
		var second = now.getSeconds();
		second = second < 10 ? ('0' + second) : second;
		return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
	}

	let listener = () => {
		/*$("#upload").click(event => {
			page.uploadWorkpagerPage.jsonData.autoId = null;
			page.uploadWorkpagerPage.uploadMode = 'STD';
			$('#uploadTplFormModal').modal('show');
		});*/
	};
	let mount = () => {
		listener();
	};
	mount();
}