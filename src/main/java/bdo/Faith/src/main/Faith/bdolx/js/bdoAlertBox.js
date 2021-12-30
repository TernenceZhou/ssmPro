var bdoConfirmBox = function(boxtitle, boxtext, e, cancel) {
	swal({
		title: boxtitle,
		html: boxtext,
		type: 'warning',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		allowOutsideClick: false,
		allowEscapeKey: false
	}).then(e, cancel).catch(swal.noop);
};

var bdoConfirmBox2 = function(boxtitle, boxtext, e) {
	swal({
		title: boxtitle,
		html: boxtext,
		type: 'warning',
		showCancelButton: false,
		confirmButtonText: '知道了',
		cancelButtonText: '取消',
		allowOutsideClick: false,
		allowEscapeKey: false
	}).then(e).catch(swal.noop);
};

var bdoSuccessBox = function(boxtitle, boxtext) {
	//OneUI.loader('hide', 0, true);
	swal({
		title: boxtitle,
		html: boxtext,
		type: 'success',
		allowOutsideClick: false,
		allowEscapeKey: false,
		timer: 1000
	}).catch(swal.noop);
};

var bdoErrorBox = function(boxtitle, boxtext) {
	//OneUI.loader('hide', 0, true);
	swal({
		title: boxtitle,
		html: boxtext,
		type: 'error',
		allowOutsideClick: false,
		allowEscapeKey: false
//		timer : 1000
	}).catch(swal.noop);
};

var bdoInfoBox = function(boxtitle, boxtext, timeout) {
	//OneUI.loader('hide', 0, true);
	swal({
		title: boxtitle,
		html: boxtext,
		type: 'info',
		allowOutsideClick: false,
		allowEscapeKey: false,
		timer: timeout
	}).catch(swal.noop);
};

var bdoAjaxBox = function(boxtitle, boxtext, e, cancel) {
	swal.queue([{
		title: boxtitle,
		html: boxtext,
		type: 'warning',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		allowOutsideClick: false,
		allowEscapeKey: false,
		preConfirm: function() {
			return new Promise(e);
		}
	}]).then(function() {
	}, cancel).catch(swal.noop);
};


var bdoInProcessingBox = function(boxtitle, e, cancel) {
	//OneUI.loader('hide', 0, true);
	swal({
		title: boxtitle,
		//html: '<i class=\'fa fa-4x fa-cog fa-spin text-warning\'></i>',
		html: '<div id="showProcessing" class="bdo-loader-icon"></div>',
		showConfirmButton: false,
		showCancelButton: false,
		allowOutsideClick: false,
		allowEscapeKey: false
	}).then(e, cancel).catch(swal.noop);
};