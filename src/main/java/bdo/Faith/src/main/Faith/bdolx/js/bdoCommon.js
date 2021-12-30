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
	/**
	 * 日期格式化扩展
	 * @param fmt
	 * @returns {*}
	 */
	Date.prototype.format = function(fmt) { // author: meizz
		let o = {
			'M+': this.getMonth() + 1, // 月份
			'd+': this.getDate(), // 日
			'H+': this.getHours(), // 小时
			'm+': this.getMinutes(), // 分
			's+': this.getSeconds(), // 秒
			'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
			'S': this.getMilliseconds() // 毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
		for (let k in o)
			if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
		return fmt;
	};

	let _BdoFaithUtil = function() {

	};

	let BdoFaithUtil = typeof window === 'object' && window.window === window
		? new _BdoFaithUtil() : typeof self === 'object' && self.self === self
			? new _BdoFaithUtil() : typeof BdoFaithUtil === 'object' && BdoFaithUtil.BdoFaithUtil === BdoFaithUtil
				? BdoFaithUtil
				: this;

	/*********************** jQuery File Download Plugin v1.4.5 begin ************************************/
	(function($, window) {
		// i'll just put them here to get evaluated on script load
		let htmlSpecialCharsRegEx = /[<>&\r\n"']/gm;
		let htmlSpecialCharsPlaceHolders = {
			'<': 'lt;',
			'>': 'gt;',
			'&': 'amp;',
			'\r': '#13;',
			'\n': '#10;',
			'"': 'quot;',
			'\'': '#39;' /*single quotes just to be safe, IE8 doesn't support &apos;, so use &#39; instead */
		};

		$.extend({
			//
			//$.fileDownload('/path/to/url/', options)
			//  see directly below for possible 'options'
			fileDownload: function(fileUrl, options) {

				//provide some reasonable defaults to any unspecified options below
				let settings = $.extend({

					//
					//Requires jQuery UI: provide a message to display to the user when the file download is being prepared before the browser's dialog appears
					//
					preparingMessageHtml: null,

					//
					//Requires jQuery UI: provide a message to display to the user when a file download fails
					//
					failMessageHtml: null,

					//
					//the stock android browser straight up doesn't support file downloads initiated by a non GET: http://code.google.com/p/android/issues/detail?id=1780
					//specify a message here to display if a user tries with an android browser
					//if jQuery UI is installed this will be a dialog, otherwise it will be an alert
					//Set to null to disable the message and attempt to download anyway
					//
					androidPostUnsupportedMessageHtml: 'Unfortunately your Android browser doesn\'t support this type of file download. Please try again with a different browser.',

					//
					//Requires jQuery UI: options to pass into jQuery UI Dialog
					//
					dialogOptions: {modal: true},

					//
					//a function to call while the dowload is being prepared before the browser's dialog appears
					//Args:
					//  url - the original url attempted
					//
					prepareCallback: function(url) {
					},

					//
					//a function to call after a file download successfully completed
					//Args:
					//  url - the original url attempted
					//
					successCallback: function(url) {
					},

					//
					//a function to call after a file download request was canceled
					//Args:
					//  url - the original url attempted
					//
					abortCallback: function(url) {
					},

					//
					//a function to call after a file download failed
					//Args:
					//  responseHtml    - the html that came back in response to the file download. this won't necessarily come back depending on the browser.
					//                      in less than IE9 a cross domain error occurs because 500+ errors cause a cross domain issue due to IE subbing out the
					//                      server's error message with a "helpful" IE built in message
					//  url             - the original url attempted
					//  error           - original error cautch from exception
					//
					failCallback: function(responseHtml, url, error) {
					},

					//
					// the HTTP method to use. Defaults to "GET".
					//
					httpMethod: 'GET',

					//
					// if specified will perform a "httpMethod" request to the specified 'fileUrl' using the specified data.
					// data must be an object (which will be $.param serialized) or already a key=value param string
					//
					data: null,

					//
					//a period in milliseconds to poll to determine if a successful file download has occured or not
					//
					checkInterval: 100,

					//
					//the cookie name to indicate if a file download has occured
					//
					cookieName: 'fileDownload',

					//
					//the cookie value for the above name to indicate that a file download has occured
					//
					cookieValue: 'true',

					//
					//the cookie path for above name value pair
					//
					cookiePath: '/',

					//
					//if specified it will be used when attempting to clear the above name value pair
					//useful for when downloads are being served on a subdomain (e.g. downloads.example.com)
					//
					cookieDomain: null,

					//
					//the title for the popup second window as a download is processing in the case of a mobile browser
					//
					popupWindowTitle: 'Initiating file download...',

					//
					//Functionality to encode HTML entities for a POST, need this if data is an object with properties whose values contains strings with quotation marks.
					//HTML entity encoding is done by replacing all &,<,>,',",\r,\n characters.
					//Note that some browsers will POST the string htmlentity-encoded whilst others will decode it before POSTing.
					//It is recommended that on the server, htmlentity decoding is done irrespective.
					//
					encodeHTMLEntities: true

				}, options);

				let deferred = new $.Deferred();

				//Setup mobile browser detection: Partial credit: http://detectmobilebrowser.com/
				let userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

				let isIos;                  //has full support of features in iOS 4.0+, uses a new window to accomplish this.
				let isAndroid;              //has full support of GET features in 4.0+ by using a new window. Non-GET is completely unsupported by the browser. See above for specifying a message.
				let isOtherMobileBrowser;   //there is no way to reliably guess here so all other mobile devices will GET and POST to the current window.

				if (/ip(ad|hone|od)/.test(userAgent)) {

					isIos = true;

				} else if (userAgent.indexOf('android') !== -1) {

					isAndroid = true;

				} else {

					isOtherMobileBrowser = /avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|playbook|silk|iemobile|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));

				}

				let httpMethodUpper = settings.httpMethod.toUpperCase();

				if (isAndroid && httpMethodUpper !== 'GET' && settings.androidPostUnsupportedMessageHtml) {
					//the stock android browser straight up doesn't support file downloads initiated by non GET requests: http://code.google.com/p/android/issues/detail?id=1780

					if ($().dialog) {
						$('<div>').html(settings.androidPostUnsupportedMessageHtml).dialog(settings.dialogOptions);
					} else {
						alert(settings.androidPostUnsupportedMessageHtml);
					}

					return deferred.reject();
				}

				let $preparingDialog = null;

				let internalCallbacks = {

					onPrepare: function(url) {

						//wire up a jquery dialog to display the preparing message if specified
						if (settings.preparingMessageHtml) {

							$preparingDialog = $('<div>').html(settings.preparingMessageHtml).dialog(settings.dialogOptions);

						} else if (settings.prepareCallback) {

							settings.prepareCallback(url);

						}

					},

					onSuccess: function(url) {

						//remove the perparing message if it was specified
						if ($preparingDialog) {
							$preparingDialog.dialog('close');
						}

						settings.successCallback(url);

						deferred.resolve(url);
					},

					onAbort: function(url) {

						//remove the perparing message if it was specified
						if ($preparingDialog) {
							$preparingDialog.dialog('close');
						}
						settings.abortCallback(url);

						deferred.reject(url);
					},

					onFail: function(responseHtml, url, error) {

						//remove the perparing message if it was specified
						if ($preparingDialog) {
							$preparingDialog.dialog('close');
						}

						//wire up a jquery dialog to display the fail message if specified
						if (settings.failMessageHtml) {
							$('<div>').html(settings.failMessageHtml).dialog(settings.dialogOptions);
						}

						settings.failCallback(responseHtml, url, error);

						deferred.reject(responseHtml, url);
					}
				};

				internalCallbacks.onPrepare(fileUrl);

				//make settings.data a param string if it exists and isn't already
				if (settings.data !== null && typeof settings.data !== 'string') {
					settings.data = $.param(settings.data);
				}


				let $iframe,
					downloadWindow,
					formDoc,
					$form;

				if (httpMethodUpper === 'GET') {

					if (settings.data !== null) {
						//need to merge any fileUrl params with the data object

						let qsStart = fileUrl.indexOf('?');

						if (qsStart !== -1) {
							//we have a querystring in the url

							if (fileUrl.substring(fileUrl.length - 1) !== '&') {
								fileUrl = fileUrl + '&';
							}
						} else {

							fileUrl = fileUrl + '?';
						}

						fileUrl = fileUrl + settings.data;
					}

					if (isIos || isAndroid) {

						downloadWindow = window.open(fileUrl);
						downloadWindow.document.title = settings.popupWindowTitle;
						window.focus();

					} else if (isOtherMobileBrowser) {

						window.location(fileUrl);

					} else {

						//create a temporary iframe that is used to request the fileUrl as a GET request
						$iframe = $('<iframe style=\'display: none\' src=\'' + fileUrl + '\'></iframe>').appendTo('body');
					}

				} else {

					let formInnerHtml = '';

					if (settings.data !== null) {

						$.each(settings.data.replace(/\+/g, ' ').split('&'), function() {

							let kvp = this.split('=');

							//Issue: When value contains sign '=' then the kvp array does have more than 2 items. We have to join value back
							let k = kvp[0];
							kvp.shift();
							let v = kvp.join('=');
							kvp = [k, v];

							let key = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[0])) : decodeURIComponent(kvp[0]);
							if (key) {
								let value = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[1])) : decodeURIComponent(kvp[1]);
								formInnerHtml += '<input type="hidden" name="' + key + '" value="' + value + '" />';
							}
						});
					}

					if (isOtherMobileBrowser) {

						$form = $('<form>').appendTo('body');
						$form.hide()
							.prop('method', settings.httpMethod)
							.prop('action', fileUrl)
							.html(formInnerHtml);

					} else {

						if (isIos) {

							downloadWindow = window.open('about:blank');
							downloadWindow.document.title = settings.popupWindowTitle;
							formDoc = downloadWindow.document;
							window.focus();

						} else {

							$iframe = $('<iframe style=\'display: none\' src=\'about:blank\'></iframe>').appendTo('body');
							formDoc = getiframeDocument($iframe);
						}

						formDoc.write('<html><head></head><body><form method=\'' + settings.httpMethod + '\' action=\'' + fileUrl + '\'>' + formInnerHtml + '</form>' + settings.popupWindowTitle + '</body></html>');
						$form = $(formDoc).find('form');
					}

					$form.submit();
				}


				//check if the file download has completed every checkInterval ms
				setTimeout(checkFileDownloadComplete, settings.checkInterval);


				function checkFileDownloadComplete() {
					//has the cookie been written due to a file download occuring?

					let cookieValue = settings.cookieValue;
					if (typeof cookieValue == 'string') {
						cookieValue = cookieValue.toLowerCase();
					}

					let lowerCaseCookie = settings.cookieName.toLowerCase() + '=' + cookieValue;

					if (document.cookie.toLowerCase().indexOf(lowerCaseCookie) > -1) {

						//execute specified callback
						internalCallbacks.onSuccess(fileUrl);

						//remove cookie
						let cookieData = settings.cookieName + '=; path=' + settings.cookiePath + '; expires=' + new Date(0).toUTCString() + ';';
						if (settings.cookieDomain) cookieData += ' domain=' + settings.cookieDomain + ';';
						document.cookie = cookieData;

						//remove iframe
						cleanUp(false);

						return;
					}

					//has an error occured?
					//if neither containers exist below then the file download is occuring on the current window
					if (downloadWindow || $iframe) {

						//has an error occured?
						try {

							let formDoc = downloadWindow ? downloadWindow.document : getiframeDocument($iframe);

							if (formDoc && formDoc.body !== null && formDoc.body.innerHTML.length) {

								let isFailure = true;

								if ($form && $form.length) {
									let $contents = $(formDoc.body).contents().first();

									try {
										if ($contents.length && $contents[0] === $form[0]) {
											isFailure = false;
										}
									} catch (e) {
										if (e && e.number == -2146828218) {
											// IE 8-10 throw a permission denied after the form reloads on the "$contents[0] === $form[0]" comparison
											isFailure = true;
										} else {
											throw e;
										}
									}
								}

								if (isFailure) {
									// IE 8-10 don't always have the full content available right away, they need a litle bit to finish
									setTimeout(function() {
										internalCallbacks.onFail(formDoc.body.innerHTML, fileUrl);
										cleanUp(true);
									}, 100);

									return;
								}
							}
						}
						catch (err) {

							//500 error less than IE9
							internalCallbacks.onFail('', fileUrl, err);

							cleanUp(true);

							return;
						}
					}


					//keep checking...
					setTimeout(checkFileDownloadComplete, settings.checkInterval);
				}

				//gets an iframes document in a cross browser compatible manner
				function getiframeDocument($iframe) {
					let iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
					if (iframeDoc.document) {
						iframeDoc = iframeDoc.document;
					}
					return iframeDoc;
				}

				function cleanUp(isFailure) {

					setTimeout(function() {

						if (downloadWindow) {

							if (isAndroid) {
								downloadWindow.close();
							}

							if (isIos) {
								if (downloadWindow.focus) {
									downloadWindow.focus(); //ios safari bug doesn't allow a window to be closed unless it is focused
									if (isFailure) {
										downloadWindow.close();
									}
								}
							}
						}

						//iframe cleanup appears to randomly cause the download to fail
						//not doing it seems better than failure...
						//if ($iframe) {
						//    $iframe.remove();
						//}

					}, 0);
				}


				function htmlSpecialCharsEntityEncode(str) {
					return str.replace(htmlSpecialCharsRegEx, function(match) {
						return '&' + htmlSpecialCharsPlaceHolders[match];
					});
				}

				let promise = deferred.promise();
				promise.abort = function() {
					cleanUp();
					$iframe.attr('src', '').html('');
					internalCallbacks.onAbort(fileUrl);
				};
				return promise;
			}
		});

	})(jQuery, this || root);
	/*********************** jQuery File Download Plugin v1.4.5 end ************************************/
	$.ajaxTransport('+binary', function(options, originalOptions, jqXHR) {

		// Check for conditions and support for blob/arraybuffer response type
		if (window.FormData && ((options.dataType && (options.dataType === 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {

			return {

				// Create new XMLHttpRequest
				send: function(headers, callback) {

					// Setup all variables
					let xhr = new XMLHttpRequest(),
						url = options.url,
						type = options.type,
						async = options.async || true,
						// blob or arraybuffer. Default is blob
						dataType = options.responseType || 'blob',
						data = options.data || null,
						username = options.username || null,
						password = options.password || null;

					xhr.addEventListener('load', function() {
						let data = {};
						data[options.dataType] = xhr.response;
						// Make callback and send data
						callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
					});

					xhr.open(type, url, async, username, password);

					// Setup custom headers
					for (let i in headers) {
						xhr.setRequestHeader(i, headers[i]);
					}

					xhr.responseType = dataType;

					xhr.send(data);

				},

				abort: $.noop

			};

		}

	});
	/*********************** FileSaver.js begin ************************************/
	/**
	 * FileSaver.js
	 * A saveAs() FileSaver implementation.
	 *
	 * By Eli Grey, http://eligrey.com
	 *
	 * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
	 * source  : http://purl.eligrey.com/github/FileSaver.js
	 */

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
	/*let _global = typeof window === 'object' && window.window === window
		? window : typeof self === 'object' && self.self === self
			? self : typeof global === 'object' && global.global === global
				? global
				: this;*/
	function bom(blob, opts) {
		if (typeof opts === 'undefined') opts = {autoBom: false};
		else if (typeof opts !== 'object') {
			console.warn('Deprecated: Expected third argument to be a object');
			opts = {autoBom: !opts};
		}

		// prepend BOM for UTF-8 XML and text/* types (including HTML)
		// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
		if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
			return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
		}
		return blob;
	}

	function download(url, name, opts) {
		let data = new FormData();
		for (let key in opts.requestData) {
			data.append(key, opts.requestData[key]);
		}
		return $.ajax(url, {
			data: opts.requestData,
			dataType: 'binary',
			global: false,
			type: 'POST'
		});
	}


// `a.click()` doesn't work for all browsers (#465)
	function click(node) {
		try {
			node.dispatchEvent(new MouseEvent('click'));
		} catch (e) {
			let evt = document.createEvent('MouseEvents');
			evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
				20, false, false, false, false, 0, null);
			node.dispatchEvent(evt);
		}
	}

	let saveAs = _BdoFaithUtil.prototype.saveAs || function saveAs(blob, name, opts) {
		let URL = root.URL || root.webkitURL;
		let a = doc.createElement('a');
		name = name || blob.name || 'download';
		a.download = name;
		a.rel = 'noopener';
		if (typeof blob === 'string') {
			download(blob, name, opts).done(function(blob, status, jqXhr) {
				let disposintion = jqXhr.getResponseHeader('Content-disposition');
				let fname = name;
				try {
					let dispArr = disposintion.split(';');
					let name = dispArr.find(d => d.startsWith('filenameUrl') ? d : null);
					if (name) {
						fname = decodeURI(name.split('=')[1]);
					}
					//fname = disposintion.split(';')[1].split('=')[1];
				} catch (e) {
					console.error('文件名为空！');
				}
				root.saveAs(blob, fname);
			}).fail(function() {
				console.log(arguments);
			}).error(function() {
				console.log(arguments);
			});
		}
	};

	saveAs.saveAs = saveAs;

	/*********************** FileSaver.js end ************************************/


	function getColumnsInfo(tableColumns) {
		let columns = tableColumns;
		let rtn = [];
		let i, ln;
		for (i = 0; i < columns.length; i++) {
			let c = columns[i];
			if (c.title != '&#160;' && c.title != '操作' && c.title != '处理' && c.title != '序号' && c.visible !== false) {
				let columnInfo = {};
				columnInfo.cnName = c.title;
				columnInfo.enName = c.data;
				columnInfo.size = c.width ? (c.width + '').replace('px', '') : 30;
				columnInfo.className = c.className;
				if (c.renderer) {
					columnInfo.renderer = c.renderer;
				}
				rtn.push(columnInfo);
			}
		}
		return rtn;
	}

	function exportExcel(options) {
		let $table = $(options.tableSelecter);
		if (!$table.hasClass('dataTable')) {
			bdoErrorBox('错误！', options.title + '没有初始化！');
		}
		let tableConfig = $table.dataTable().fnGetBdoConfig();

		let columnInfo = BdoFaithUtil.getColumnsInfo(tableConfig.tableParam.columnDefs);
		let myParams = $.extend({}, tableConfig.localParam.urlparam); // applyIf({},table_view.localParam.urlparam);
		myParams.sort && delete  myParams.sort;
		myParams.page = '';
		myParams.start = '';
		myParams.limit = '';
		myParams.queryUrl = tableConfig.localParam.url;
		myParams.columnMap = columnInfo;
		return BdoFaithUtil.saveAs('base/Export.exportExcel.json', '' + '.xlsx', {
			requestData: {
				myParams: JSON2.stringify(myParams),
				title: encodeURI(options.title)
			},
			method: 'POST'
		});
	}

	let defaultConfig = {
		tableSelecter: '',
		title: ''
	};

	function bdoExport(event) {
		let isManager = true;
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async : false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00197',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					if(sys_userId != data.data[0].manager){
						isManager = false;
					}
				}
			}
		});
		let $el = $(event.currentTarget);
		let config = $el.data();
		config.bdoexportTitle = config.bdoexportTitle ? config.bdoexportTitle : $el.attr('data-bdoexport-title');
		if (config.bdoexportTitle && config.bdoexportTitle.toLocaleLowerCase().startsWith('javascript:')) {
			config.bdoexportTitle = eval(config.bdoexportTitle.replace('javascript:', ''));
		}
		let options = $.extend(true, defaultConfig, {
			tableSelecter: '#' + config.bdoexportTableId,
			title: config.bdoexportTitle
		});
		if(!isManager){
			bdoInfoBox('提示', '非项目负责人无权限导出' + config.bdoexportTitle + '！');
			return;
		}
		BdoFaithUtil.exportExcel(options);//.done(() => console.log('bdoExport done;')).field(() => console.log('bdoExport field;'));
	}

	let siderStack = [];

	function findSiderStack(sider) {
		return this.siderStack.findIndex(sider);
	}

	function pushBdoSiderStack(sider){
		let siderIndex = this.siderStack.findIndex(item => item == sider);
		if(!(siderIndex >= 0)) {
			this.siderStack.push(sider);
		}else {
			this.siderStack.push(this.siderStack[siderIndex]);
			this.siderStack[siderIndex] = null;
			this.siderStack = this.siderStack.filter(item => item != null);
		}
		if(this.siderStack.length > 20) {
			this.siderStack = this.siderStack.slice(this.siderStack.length - 20);
		}
	}

	function popBdoSiderStack(sider){
		if(this.topBdoSiderStack() == sider) {
			return this.siderStack.pop();
		}
		return null;
	}

	function topBdoSiderStack() {
		if(this.siderStack.length == 0) {
			return null;
		}
		return this.siderStack[this.siderStack.length - 1];
	}

	let _bdoFaithSiderUtil = function() {};
	$.extend(_bdoFaithSiderUtil.prototype, {
		siderStack,
		topBdoSiderStack,
		popBdoSiderStack,
		pushBdoSiderStack,
		findSiderStack
	});

	$.extend(_BdoFaithUtil.prototype, {
		getColumnsInfo,
		exportExcel,
		bdoExport,
		saveAs,
		loadScriptsOnPage,
		getScriptsFromCharts,
		injectScripts,
		tplMap: {},
		tplLoader,
		onScriptLoad,
		bdoFaithSiderUtil: new _bdoFaithSiderUtil(),
		factory
	});
	$(doc).on('click', '.bdoexport-btn', BdoFaithUtil.bdoExport);

	BdoFaithUtil.tplMap = BdoFaithUtil.tplMap || {};

	function tplLoader(url, data, callback) {
		if (!url) {
			return '';
		}
		/*if(url.indexOf('gotoDesktop') >= 0) {
			debugger;
		}*/
		if (BdoFaithUtil.evnMode != 'dev' && BdoFaithUtil.tplMap[url]) {
			return BdoFaithUtil.tplMap[url];
		}
		let html = '<div style="width: 100%;height: 100%;"></div>';
		/*$.ajax({
			url: url,
			type: 'POST',
			dataType: 'text',
			data: data,
			async : false,
			success: function(result) {
				html = result;
				BdoFaithUtil.tplMap[url] = html;
			}
		});*/
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'text',
			data: data,
			async: false
		}).done(function(result) {
			html = result;
			BdoFaithUtil.tplMap[url] = html;
			callback && callback(result);
		});
		return html;
	}

	function getScriptsFromCharts(target, html) {
		let $div = $('<div style="width: 100%;height: 100%;"></div>');
		$div.html(html);
		let $scripts = $('script[src]', $div);
		BdoFaithUtil.scripts = BdoFaithUtil.scripts || [];
		$scripts.each((index, script) => {
			BdoFaithUtil.scripts.push(script.src);
			$(script).remove();
			//return script.str;//.attr('src');
		});
		$(target).empty().html($div);
		return BdoFaithUtil.scripts;
	}

	function injectScripts(doc, target, html) {
		let scripts = BdoFaithUtil.getScriptsFromCharts(target, html);
		BdoFaithUtil.loadScriptsOnPage(doc, scripts);
	}

	function onScriptLoad(event) {
		if (BdoFaithUtil.scripts.length) {
			BdoFaithUtil.loadScriptsOnPage(doc, BdoFaithUtil.scripts);
		}
	}

	function loadScriptsOnPage(doc, scripts) {
		/*ready(scripts, ()=>{console.log('loadScriptsOnPage')});
		let _src = scripts.shift();
		let $loadedScript = $('script[src="'+_src+'"]');
		if($loadedScript.length) {
			$loadedScript.remove();
		}
		let $s = $('<script type="text/javascript" src="'+_src+'" onload="BdoFaithUtil.onScriptLoad"></script>');
		$('body', doc).append($s);*/
		if (scripts.length == 0) {
			return;
		}
		let _src = scripts.shift();
		let $loadedScript = $('script[src="' + _src + '"]');
		if ($loadedScript.length) {
			$loadedScript.remove();
		}
		let s = doc.createElement('script');
		s.setAttribute('type', 'text/javascript');
		if (doc.body) {
			doc.body.firstElementChild ? doc.body.insertBefore(s, doc.body.firstElementChild)
				: doc.body.appendChild(s);
		} else {
			doc.head.firstElementChild ? doc.head.insertBefore(s, doc.head.firstElementChild) : doc.head.appendChild(s);
		}

		s.onload = BdoFaithUtil.onScriptLoad;
		s.setAttribute('src', _src.replace('.js', '.js?_d=' + new Date().getTime() + '&' /*chrome.extension.getURL(scripts.shift())*/));
	}

	function ready(optionalScriptsDependencies, cb) {
		if (arguments.length === 1) {
			waitForReady(cb);
		} else if (arguments.length === 2) {
			loadScripts(optionalScriptsDependencies, () => {
				waitForReady(cb);
			});
		}
	}

	function waitForReady(cb) {
		$(document).ready(function() {
			cb && cb();
		});
	}

// ajaxLoadedScripts要放到loadScripts外才能起到全局统计的作用
	const ajaxLoadedScripts = {};

	function loadScripts(scripts, callback) {
		$.ajaxPrefilter('script', (opts) => {
			opts.cache = true;
		});
		setTimeout(() => {
			function finishLoading() {
				typeof callback === 'function' && callback();
			}

			let deferredCount = 0;
			let resolved = 0;
			for (let i = 0; i < scripts.length; i++) {
				if (scripts[i]) {
					(() => {
						const scriptName = 'js-' + scripts[i].replace(/[^\w\d-]/g, '-').replace(/--/g, '-');
						ajaxLoadedScripts[scriptName] !== true && deferredCount++;
					})();
				}
			}

			function nextScript(index) {
				index += 1;
				if (index < scripts.length) {
					loadScript(index);
				} else {
					finishLoading();
				}
			}

			function loadScript(index) {
				index = index || 0;
				if (!scripts[index]) {
					return nextScript(index);
				}

				const scriptName = 'js-' + scripts[index].replace(/[^\w\d-]/g, '-').replace(/--/g, '-');
				// 只加载目前为止没有加载过的脚本
				if (ajaxLoadedScripts[scriptName] !== true) {
					$.getScript(scripts[index]).done(() => {
						ajaxLoadedScripts[scriptName] = true;
					}).complete(() => {
						++resolved >= deferredCount ? finishLoading() : nextScript(index);
					});
				} else {
					nextScript(index);
				}
			}

			deferredCount > 0 ? loadScript() : finishLoading();
		}, 10);
	}


	function factory(factory) {
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
			return factory(jQuery, window, document);
		}
	}
	root.BdoFaithUtil = BdoFaithUtil;
	BdoFaithUtil.evnMode = 'dev';
	return BdoFaithUtil;
}));