$(document).ready(function() {
	uiBlocksApi(false, 'init');
	$('#btn_version_search').click(function() {
		$.ajax({
			url: 'cpBase/General.query.json',
			data: {
				sqlId: 'sys.S300017',
				systemId: systemId
			},
			dataType: 'json',
			success: function(data) {
				if (data.success && data.data) {
					$('#versions').empty();
					for (var i = 0; i < data.data.length; i++) {
						var appendStr='<ul class="list list-timeline pull-t"><li><div class="list-timeline-time">';
						appendStr +='立信智能审计云平台'+data.data[i].version+'</div> <i class="fa fa-database list-timeline-icon bg-smooth"></i>';
						appendStr +='<div class="list-timeline-content"> <label id="versionContent'+i+'"> 发布时间：<input id="versionTime'+i+'" disabled=true style= "background-color:transparent;border:0;" value="'+getMyDate(data.data[i].versionTime)+'">'+data.data[i].content+' </label> </div> </li>';
						$('#versions').append(appendStr);
					}
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);

				}
			}
		});
	});
//时间毫秒数转时间
	function getMyDate(str) {
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oHour = oDate.getHours(),
			oMin = oDate.getMinutes(),
			oSen = oDate.getSeconds(),
			oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
		return oTime;

	}

//补0操作
	function getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + num;
		}
		return num;
	}
});





