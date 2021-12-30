// 账套过期时间
function getValidDate(customerId, yyyy, warningId) {
	$.ajax({
		url: 'finCenter/DataCheck.getValidDate.json',
		type: 'post',
		bdolxLoader: false,
		data: {
			lockProjectId: customerId//,
			//lockYyyy: yyyy
		},
		dataType: 'json',
		success: function (data) {
			if (data.data && data.data.length > 0) {
				if (data.data[0].isWarning == '1') {
					//$('#' + warningId).html('&nbsp;账套过期时间：' + data.data[0].validDate);
					bdoInfoBox('提示', '账套过期时间：' + data.data[0].validDate);
				}else{
					$('#' + warningId).html('');
				}
			}
		}
	});
}

