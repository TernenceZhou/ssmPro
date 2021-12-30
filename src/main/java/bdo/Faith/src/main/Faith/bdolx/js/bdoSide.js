var side = function(options) {
	var $el = $(options.el);
	var obj = {};
	var SiderUtil = BdoFaithUtil.bdoFaithSiderUtil;
	var showSide = function() {
		/*console.log('showSide start');
		console.log(obj);*/
		//debugger;
		//$el = $(options.el);
		$el.addClass('in');
		$el.focus();
		obj.mountin = true;
		options.afterShow && options.afterShow();
		let topObj = SiderUtil.topBdoSiderStack();
		SiderUtil.pushBdoSiderStack(obj);
		if(topObj && topObj != obj) {
			topObj.hide();
		}
		//console.log('showSide end');
	};

	var hideSide = function() {
		//$el = $(options.el);
		$el.removeClass('in');
		options.afterHide && options.afterHide();
		let popObj = SiderUtil.popBdoSiderStack(obj);
		if(popObj == obj) {
			let topObj = SiderUtil.topBdoSiderStack();
			if(topObj && topObj != obj) {
				topObj.show();
			}
		}
	};
	obj = {
		show: showSide,
		hide: hideSide,
		autoHide: !(options.autoHide === false),
		mountin: false
	};

	$el.find('[data-close]').click((event) => {
		obj.hide();
	});

	$el.on('focusout', (event) => {
		if (!obj.mountin && obj.autoHide) {
			obj.hide();
		}
	});

	$el.on('mouseout', (event) => {
		obj.mountin = false;
	});

	$el.on('mouseover', (event) => {
		obj.mountin = true;
	});

	return obj;
};