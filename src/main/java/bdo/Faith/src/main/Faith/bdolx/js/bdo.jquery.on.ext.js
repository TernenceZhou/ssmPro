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
	Function.prototype._bdoGuid = null;
	Function.prototype.before = function(beforefn) {
		var self_ = this;
		beforefn.self_ = self_;
		beforefn._bdoGuid = self_._bdoGuid;
		beforefn._bdoEtype = self_._bdoEtype;
		var res = function() {
			beforefn.apply(this, arguments);
			return self_.apply(this, arguments);
		};
		$.extend(res.prototype, self_.prototype);
		res._bdoGuid = beforefn._bdoGuid;
		res._bdoEtype = beforefn._bdoEtype;
		return res;
	};
	Function.prototype.after = function(afterfn) {
		var self_ = this;
		afterfn.self_ = self_;
		afterfn._bdoGuid = self_._bdoGuid;
		afterfn._bdoEtype = self_._bdoEtype;
		var res = function() {
			var ret = self_.apply(this, arguments);
			afterfn.apply(this, arguments);
			//ret._bdoGuid = afterfn._bdoGuid;
			return ret;
		};
		$.extend(res.prototype, self_.prototype);
		res._bdoGuid = afterfn._bdoGuid;
		res._bdoEtype = afterfn._bdoEtype;
		return res;
	};

	function _bdoDefaultBefore() {
		this._bdoOnExtStartTime = new Date().getTime();
		console.info('function[' + arguments.callee._bdoEtype + ':' + arguments.callee._bdoGuid + ':' + this._bdoOnExtStartTime + '] before:', this._bdoOnExtStartTime);
	}

	function _bdoDefaultAfter() {
		this._bdoOnExtEndTime = new Date().getTime();
		console.info('function[' + arguments.callee._bdoEtype + ':' + arguments.callee._bdoGuid + ':' + this._bdoOnExtStartTime + '] after:', this._bdoOnExtEndTime, '\t', this._bdoOnExtEndTime - this._bdoOnExtStartTime, 'ms');
	}

	var _bdoJQOn = $.fn.on;
	var _bdoEid = 0;
	$.fn.on = function() {
		if (window.jqFnOnDebug === true) {
			console.info('bdo.jqOn.ext called!');
		}
		var _arguments = arguments;
		var type = '';
		if (_arguments.length > 0) {
			if (typeof _arguments[0] == 'string') {
				type = _arguments[0];
			}
		}
		for (var i = 0; i < _arguments.length; i++) {
			if (typeof _arguments[i] == 'function') {
				if (_arguments[i]._bdoGuid != null) {
					continue;
				}
				_arguments[i]._bdoGuid = _bdoEid++;
				_arguments[i]._bdoEtype = type;
				if (window.jqFnOnDebug) {
					_arguments[i] = _arguments[i].before(_bdoDefaultBefore).after(_bdoDefaultAfter);
				}
			}
		}
		return _bdoJQOn.apply(this, _arguments);
	};
	return $;
}));