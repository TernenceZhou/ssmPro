(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], function($) {
			return factory($, window, document);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function(root, $) {
			if (!root) {
				root = window;
			}
			if (!$) {
				throw Error('jQuery undefined');
			}
			return factory($, root, root.document);
		};
	}
	else {
		factory(jQuery, window, document);
	}
}(function($, root, doc) {
	var isShowBdoxlLoader = true;
	var getNowPage = function(url) {
//	var url = window.location.search;
		var param = {};
		if (url.indexOf('?') != -1) {
			var str = url.substr(1);
			strs = str.split('&');
			for (var i = 0; i < strs.length; i++) {
				param[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
			}
		}
		if (!param.menuId) {
			return;
		}
		window.sys_menuId = param.menuId;
		$('#main-container').load('general.do?menuid=' + window.sys_menuId);
		$('#page-container').removeClass('sidebar-l').removeClass('header-navbar-fixed');
		$('#header-navbar').remove();
		$('#side-overlay').remove();
		$('#sidebar').remove();
		Promise.resolve().then(() => {
			$('#m' + window.sys_menuId).addClass('active');
			$('#m' + window.sys_menuId).closest('ul').closest('li').addClass('open');
		});
		/*setTimeout(function() {
			// 自动定位到左边的菜单
			$('#m' + window.sys_menuId).addClass('active');
			$('#m' + window.sys_menuId).closest('ul').closest('li').addClass('open');
		}, 1000);*/
	};

	var sendCount = 0;
	var isLock = 0;
	var locker = null;
	var bdoLockTimer = null;

	function bdoLock(jreq, req) {
		sendCount++;
		if (sendCount > 0 && isLock == 0) {
			//console.log('lock');
			$('body').append(`
						<div id="mainLocker"></div>
					`);
			locker = $('#mainLocker', $('body'));
			locker.css({
				'display': 'block',
				'position': 'absolute',
				'top': '0px',
				'left': '0px',
				'right': '0px',
				'bottom': '0px',
				'z-index': '10000000',
				//'background-color': '#000',
				'opacity': 1
			});
			locker.show();
			isLock = 1;
			bdoLockTimer = setTimeout(function() {
				bdoUnLock(jreq, req);
			}, 1000 * 5);
		}
	}

	function bdoUnLock(jreq, req) {
		sendCount--;
		if (sendCount <= 0 && isLock == 1) {
			//console.log('unlock');
			locker.hide();
			locker.remove();
			isLock = 0;
			sendCount = 0;
			isLock = 0;
			locker = null;
		}
		if (bdoLockTimer) {
			clearTimeout(bdoLockTimer);
			bdoLockTimer = null;
		}
	}

	var _ajaxSetup = $.ajaxSetup;

	function BdolxFaithAjaxBeforeSend() {
		isShowBdoxlLoader && OneUI.loader('show');
		let url = arguments[1].url.split('?')[0];
		if (url.endsWith('.json')) {
			isShowBdoxlLoader && bdoLock(arguments[0], arguments[1]);
		}
	}

	function BdolxFaithAjaxComplete() {
		OneUI.loader('hide');
		if (arguments[0].getResponseHeader('Content-Type') &&
			arguments[0].getResponseHeader('Content-Type').indexOf('application/json') >= 0) {
			bdoUnLock(arguments[0], arguments[1]);
		}
	}

	BdolxFaithAjaxBeforeSend.prototype.bdolxGuid = 'BdolxFaithAjaxBeforeSend';
	BdolxFaithAjaxComplete.prototype.bdolxGuid = 'BdolxFaithAjaxComplete';

	function redirAjaxSetup(agr) {
		if (agr.beforeSend) {
			if (agr.beforeSend.bdolxGuid !== 'BdolxFaithAjaxBeforeSend') {
				let _beforeSend = agr.beforeSend;
				agr.beforeSend = function() {
					isShowBdoxlLoader && BdolxFaithAjaxBeforeSend.apply(this, arguments);
					_beforeSend.apply(this, arguments);
				};
				agr.beforeSend.prototype.bdolxGuid = 'BdolxFaithAjaxBeforeSend';
			}
		}
		if (agr.complete) {
			if (agr.complete.bdolxGuid !== 'BdolxFaithAjaxComplete') {
				let _complete = agr.complete;
				agr.complete = function() {
					_complete.apply(this, arguments);
					BdolxFaithAjaxComplete.apply(this, arguments);
				};
				agr.complete.prototype.bdolxGuid = 'BdolxFaithAjaxComplete';
			}
		}
	}

	$.ajaxSetup = function() {
		for (let i = 0; i < arguments.length; i++) {
			redirAjaxSetup(arguments);
		}
		return _ajaxSetup.apply($, arguments);
	};
	var _ajax = $.ajax;

	$.ajax = function(url, options) {
		let options2;
		if (typeof url === 'object') {
			options2 = url;
		}
		options2 = options2 || options;
		if(options2.data) {
			if(!options2.data.menuId || options2.data.menuId == '') {
				options2.data.menuId = window.sys_menuId;
			}
		}
		if (options2.bdolxLoader === false) {
			isShowBdoxlLoader = options2.bdolxLoader;
		} else {
			isShowBdoxlLoader = true;
		}
		redirAjaxSetup(options2);
		/*if(options2.headers) {
			options2.headers['Async-Supported'] = true;
		}else {
			options2.headers = {
				'Async-Supported': true
			};
		}*/
		return _ajax.apply(this, arguments);
	};

	function setAjaxSetup() {
		$.ajaxSetup({
			beforeSend: BdolxFaithAjaxBeforeSend,
			complete: BdolxFaithAjaxComplete,
			global: false,
			type: 'POST'
		});
	}

	$.fn.extend({
		setBdoAjaxSetup: setAjaxSetup,
		getNowPage: getNowPage,
		bdoUnLock,
		bdoLock
	});
	$.extend({
		setBdoAjaxSetup: setAjaxSetup,
		getNowPage: getNowPage,
		bdoUnLock,
		bdoLock
	});
	return $;
}));