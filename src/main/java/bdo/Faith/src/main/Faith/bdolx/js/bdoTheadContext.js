!function(t, n, e, i) {
	var o = function(t, n) {
		this.init(t, n);
	};

	function onClick() {
		e('.ul-context-menu').hide();
	}

	function onContextmenu(n) {
		let t = arguments[0].data.t;
		n.preventDefault(), t.renderMenu(), t.setPosition(n), t.opts.target
		&& 'function' == typeof t.opts.target
		&& t.opts.target(e(this));
	}

	o.prototype = {
		init: function(t, n) {
			this.ele = t, this.defaults = {
				width: 150,
				itemHeight: 28,
				bgColor: '#fff',
				color: '#333',
				fontSize: 14,
				hoverBgColor: '#f5f5f5'
			}, this.opts = e.extend(!0, {}, this.defaults, n), this.random = (new Date)
					.getTime()
				+ parseInt(1e3 * Math.random()), this.eventBind();
		},
		renderMenu: function() {
			var t = this, n = '#uiContextMenu_' + this.random;
			if (!(e(n).length > 0)) {
				var t = this, i = '<ul class="ul-context-menu" id="uiContextMenu_'
					+ this.random + '">';
				e.each(this.opts.menu, function(t, n) {
					n.html
						? i += '<li class="ui-context-menu-item">' + n.html
						+ '</li>'
						: i += '<li class="ui-context-menu-item"><a style="width:100%;display:block;">'
						+ n.text + '</a></li>';
				}), i += '</ul>', e('body').append(i).find('.ul-context-menu')
					.hide(), this.initStyle(n), e(n).on('click',
					'.ui-context-menu-item', function(n) {
						t.menuItemClick(n, e(this)), n.stopPropagation();
					});
			}
		},
		initStyle: function(t) {
			var n = this.opts;
			e(t).css({
				width: n.width,
				backgroundColor: n.bgColor
			}).find('.ui-context-menu-item a').css({
				color: n.color,
				fontSize: n.fontSize,
				height: n.itemHeight,
				lineHeight: n.itemHeight + 'px'
			}).hover(function() {
				e(this).css({
					backgroundColor: n.hoverBgColor
				});
			}, function() {
				e(this).css({
					backgroundColor: n.bgColor
				});
			});
		},
		menuItemClick: function(event, t) {
			var n = this, e = t.index();
			n.opts.menu[e].callback
			&& 'function' == typeof n.opts.menu[e].callback
			&& n.opts.menu[e].callback(event, t);
			if ($(t).children(':first').length == 0) {
				$(t).parent('.ul-context-menu').hide();
			} else if ($(t).children(':first')[0].tagName == 'A') {
				$(t).parent('.ul-context-menu').hide();
			}
		},
		setPosition: function(t) {
			e('#uiContextMenu_' + this.random).css({
				left: t.pageX + 2,
				top: t.pageY + 2
			}).show();
		},
		eventBind: function() {
			var t = this;

			this.ele.off('contextmenu', onContextmenu),
				this.ele.on('contextmenu', {t: t}, onContextmenu),
				e(n).off('click', onClick),
				e(n).on('click', {t: t}, onClick);
		}
	}, e.fn.contextMenu = function(t) {
		return new o(this, t), this;
	};
}(window, document, jQuery);