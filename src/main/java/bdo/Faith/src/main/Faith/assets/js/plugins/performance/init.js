$(document).ready(function() {
	if(BdoFaithUtil.webReportUrl) {
		Performance({
			domain: BdoFaithUtil.webReportUrl,
			add:{
				appId:'fKK8M5w1629770728212'
			}
		});
	}
});