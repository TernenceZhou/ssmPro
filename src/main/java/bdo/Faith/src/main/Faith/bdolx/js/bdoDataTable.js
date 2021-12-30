/** 初始化 */
var displayIcon;
var $DataTable = $.fn.dataTable;
$.extend(true, $DataTable.defaults, {
	autoWidth: false,
	pagingType: 'full_numbers',
	searching: false,
	processing: true,
	destroy: true,
	renderer: 'bootstrap',
	//colReorder : true,
	dom: '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
	oLanguage: {
//		sProcessing : '<i class="fa fa-4x fa-cog fa-spin text-warning"></i>',
		sProcessing: '<img src="/Faith/img/bdo/loading.gif" width="100px" height="100px"/>',
		sLengthMenu: '每页<select style="width:40px;"><option value="5">5</option><option value="10">10</option>'
			+ '<option value="15">15</option><option value="20">20</option><option value="30">30</option></select>条'
			+ '&nbsp;<a class="tableRefresh"><i class="fa fa-refresh" style="cursor:pointer;">刷新</i></a>',
//		sInfo : '显示 <b>_START_</b>-<b>_END_</b> 共 <b>_TOTAL_</b>条',
		sInfo: '共 <b>_TOTAL_</b>条',
		sInfoEmpty: '没有数据',
		sEmptyTable: '抱歉， 没有找到你想要的数据',
		oPaginate: {
			sFirst: '<i class="fa fa-angle-double-left"></i>',
			sPrevious: '<i class="fa fa-angle-left"></i>',
			sNext: '<i class="fa fa-angle-right"></i>',
			sLast: '<i class="fa fa-angle-double-right"></i>'
		},
		select: {
			rows: {
				_: '',
				0: ''
			},
			cells: {
				_: '',
				0: ''
			}
		}
	},
	initComplete: function(setting, json) {
//		$('#' + setting.sTableId).closest('div').css('overflow', 'auto');
	}
});

/** 去除自带的错误提示框 */
$DataTable.ext.errMode = 'none';

/** 翻页 */
$DataTable.ext.renderer.pageButton.bootstrap = function(settings, host,
														idx, buttons, page, pages) {
	var api = new $DataTable.Api(settings);
	var classes = settings.oClasses;
	var lang = settings.oLanguage.oPaginate;
	var btnDisplay, btnClass;
	var attach = function(container, buttons) {
		var i, ien, node, button;
		var clickHandler = function(e) {
			e.preventDefault();
			if (!$(e.currentTarget).hasClass('disabled')) {
				api.page(e.data.action).draw(false);
			}
		};
		for (i = 0, ien = buttons.length; i < ien; i++) {
			button = buttons[i];
			if ($.isArray(button)) {
				attach(container, button);
			} else {
				btnDisplay = '';
				btnClass = '';
				switch (button) {
					case 'ellipsis':
						btnDisplay = '&hellip;';
						btnClass = 'disabled';
						break;
					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ? '' : ' disabled');
						break;
					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ? '' : ' disabled');
						break;
					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button
							+ (page < pages - 1 ? '' : ' disabled');
						break;
					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button
							+ (page < pages - 1 ? '' : ' disabled');
						break;
					default:
						btnDisplay = button + 1;
						btnClass = page === button ? 'active' : '';
						break;
				}
				if (btnDisplay) {
					node = $('<li>', {
						'class': classes.sPageButton + ' ' + btnClass,
						'aria-controls': settings.sTableId,
						'tabindex': settings.iTabIndex,
						'id': idx === 0
						&& typeof button === 'string' ? settings.sTableId
							+ '_' + button
							: null
					}).append($('<a>', {
						'href': '#'
					}).html(btnDisplay)).appendTo(container);
					settings.oApi._fnBindAction(node, {
						action: button
					}, clickHandler);
				}
			}
		}
	};
	attach($(host).empty().html('<ul class="pagination"/>').children(
		'ul'), buttons);
};

/** 排序参数设置 */
var dataSort = function(data) {
	if (data.order && data.order.length > 0) {
		if (data.columns[data.order[0].column].name) {
			var dataSortArr = [];
			dataSortArr.push({
				'property': data.columns[data.order[0].column].name,
				'direction': data.order[0].dir
			});
			return JSON.stringify(dataSortArr);
		}
		return '';
	}
	return '';
};

/** 一般表格 */
var BdoDataTables = function(tableId, tableParam) {
	$.fn.dataTable.RowGroup = $.fn.dataTable._RowGroup;
	$.fn.DataTable.RowGroup = $.fn.dataTable._RowGroup;
	/*$.fn.dataTable._RowGroup = RowGroup;
	$.fn.DataTable._RowGroup = RowGroup;*/
	$('ul.ul-context-menu').remove();
	tableParam.tableColumns.push({
		targets: 0,
		orderable: false,
		className: 'text-center',
		title: '序号',
		width: '30px',
		visible: tableParam.tabNum ? tableParam.tabNum : false,
		render: function(data, type, row, meta) {
			return meta.settings._iDisplayStart + meta.row + 1;
		}
	});
	//$('#' + tableId).colResizable({disable:true});
	/** 表格 */
	$('#' + tableId).dataTable({
		// 必需 列定义
		columnDefs: tableParam.tableColumns,
		scrollX: true,
		fixedColumns: {
			leftColumns: 0
		},
		autoWidth: true,
		// 非必需
		scrollY: tableParam.scrollY ? tableParam.scrollY : 500,
		pageLength: tableParam.pageLength ? tableParam.pageLength : 30,
		lengthChange: tableParam.lengthChange ? tableParam.lengthChange : false,
		dom: tableParam.dom ? tableParam.dom : '<"row"<"col-sm-6"l><"col-sm-6"p>><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6"p>>',
		ordering: tableParam.order ? true : false,
		createdRow: tableParam.createdRow ? tableParam.createdRow : function() {
		},
		order: tableParam.order ? tableParam.order : [],
		serverSide: tableParam.serverSide ? tableParam.serverSide : true,
		//数据源
		ajax: function(data, callback, settings) {
			//if(tableParam.sourceData.data){
			if (tableParam.sourceData && JSON.stringify(tableParam.sourceData) != '{}') {
				var backData = {};
				backData.recordsTotal = tableParam.sourceData.totalCount;
				backData.recordsFiltered = tableParam.sourceData.totalCount;
				backData.data = tableParam.sourceData;
				callback(backData);
			} else {
				tableParam.filterParam.page = $('#' + tableId).DataTable().page();
				tableParam.filterParam.start = data.start;
				if (tableParam.lengthChange) {
					tableParam.filterParam.limit = data.length;
				} else {
					tableParam.filterParam.limit = -1;
				}
				if (tableParam.order) {
					tableParam.filterParam.sort = dataSort(data);
				}
				$.ajax({
					type: 'post',
					url: tableParam.sourceUrl,
					data: tableParam.filterParam,
					dataType: 'json',
					bdolxLoader: true,
					success: function(returnData) {
						if (returnData.success == false) {
							if (returnData.resultInfo != null && returnData.resultInfo.statusText != null) {
								bdoErrorBox('错误', returnData.resultInfo.statusText);
								return;
							} else {
								bdoErrorBox('系统错误', '请刷新页面后重试！');
								return;
							}
						}
						var backData = {};
						backData.recordsTotal = returnData.totalCount;
						backData.recordsFiltered = returnData.totalCount;
						$('#' + tableId + '_info').html('共 <b>' + backData.recordsFiltered + '</b>条');
						backData.data = returnData.data;
						callback(backData);
						settings.dataCache = backData;
					},
					error: function() {
						bdoErrorBox('系统错误', '请刷新页面后重试！');
					}
				});
			}
		},
		drawCallback: function(settings) {
			tableParam.drawCallback && $.proxy(tableParam.drawCallback, this)(settings);
		},
		initComplete: function(settings, json) {
			tableParam.initComplete && $.proxy(tableParam.initComplete, this)(settings, json);
		},
		infoCallback: function(setttings, start, end, max, total, pre) {
			tableParam.infoCallback && $.proxy(tableParam.infoCallback, this)(setttings, start, end, max, total, pre);
		}
	});
	$('#' + tableId).off('mouseup', 'tbody tr');
	$('#' + tableId).on('mouseup', 'tbody tr', function() {
		//是否可以多选
		$('#' + tableId).DataTable().$('tr.selected').removeClass('selected');

		$(this).addClass('selected');
	});
	/*$('#'+tableId).off('order.dt');*/
	//排序后重置页面
	/*$('#'+tableId).on('order.dt', function () {
		// 防抖
		if(window.faithDataTableResizeTime) {
			clearTimeout(window.faithDataTableResizeTime);
			window.faithDataTableResizeTime = null;
		}
		window.faithDataTableResizeTime = setTimeout(function(){
			console.log("$('#'+tableId).on('order.dt', function ()");
			//$(document).resize();
			clearTimeout(window.faithDataTableResizeTime);
			window.faithDataTableResizeTime = null;
		}, 200);
	});*/
	$('#' + tableId).off('init.dt');
	// 初始化表事件
	$('#' + tableId).on('init.dt', function(event, dt, data) {
		//$(this).colResizable();

//		var setting = $('#' + tableId).DataTable().context[0];
//		var menuShow = [];
//		menuShow.push({
//			text: '显示'
//		});
//		$.each(setting.aoColumns, function(index, info) {
//			if (info.name) {
//				menuShow.push({
//					html: '<label class="css-input css-checkbox css-checkbox-sm css-checkbox-primary"><input type="checkbox" name="' + info.data + '" ' + ((info.visible == false) ? '' : 'checked') + '><span></span>' + info.title + '</label>',
//					callback: function(e, t) {
//						if ($(e.target).closest('input').attr('name')) {
//							$('input[type="checkbox"][name="' + $(e.target).closest('input').attr('name') + '"]').each(function() {
//								$(this).attr('checked', $(e.target).closest('input').is(':checked'));
//							});
//							$('#' + tableId).DataTable().column(index).visible($(e.target).closest('input').is(':checked'));
//						}
//					}
//				});
//			}
//		});
//		var nowhead = $('#' + tableId);
//		nowhead.find('thead tr th').each(function() {
//			var colinfo = setting.aoColumns[$(this)[0].cellIndex];
//			var contextmenu = [];
//			contextmenu.push({
//				text: '筛选'
//			});
//			if (colinfo.name && colinfo.name != '') {
//				if (!colinfo.filter) {
//					colinfo.filter = {
//						type: 'string'
//					};
//				}
//				if (colinfo.filter.type == 'number') {
//					contextmenu.push({
//						html: '<input class="form-control" type="number" placeholder="=" name="' + colinfo.name + '-eq" data-filter="' + tableId + '" data-type="numeric"><br><input class="form-control" type="number" placeholder=">=" name="' + colinfo.name + '-gt" data-filter="' + tableId + '" data-type="numeric"><br><input class="form-control" type="number" placeholder="<=" name="' + colinfo.name + '-lt" data-filter="' + tableId + '" data-type="numeric">',
//						callback: function(e, t) {
//							$(e.target).unbind().change(function() {
//								var param = [];
//								$('input[data-filter="' + tableId + '"][type!="checkbox"]').each(function() {
//									if ($(this).val() != '') {
//										param.push({
//											'field': $(this).attr('name').split('-')[0],
//											'sqlIndex': $(this).attr('name').split('-')[0],
//											'type': $(this).attr('data-type'),
//											'value': $(this).val(),
//											'operate': $(this).attr('name').split('-')[1]
//										});
//									}
//								});
//								try {
//									tableParam.filterParam.filter = JSON.stringify(param);
//									$('#' + tableId).DataTable().ajax.reload();
//								} catch (e) {
//
//								}
//							});
//						}
//					});
//				} else if (colinfo.filter.type == 'date') {
//					contextmenu.push({
//						html: '<input class="form-control date-picker" type="text" placeholder="发生日" name="' + colinfo.name + '-eq" data-filter="' + tableId + '" data-type="date"><br><input class="form-control date-picker" type="text" placeholder="开始日" name="' + colinfo.name + '-gt" data-filter="' + tableId + '" data-type="date"><br><input class="form-control date-picker" type="text" placeholder="结束日" name="' + colinfo.name + '-lt" data-filter="' + tableId + '" data-type="date">',
//						callback: function(e, t) {
//							$(e.target).unbind('change').change(function() {
//								var param = [];
//								$('input[data-filter="' + tableId + '"][type!="checkbox"]').each(function() {
//									if ($(this).val() != '') {
//										param.push({
//											'field': $(this).attr('name').split('-')[0],
//											'sqlIndex': $(this).attr('name').split('-')[0],
//											'type': $(this).attr('data-type'),
//											'value': $(this).val(),
//											'operate': $(this).attr('name').split('-')[1]
//										});
//									}
//								});
//								try {
//									tableParam.filterParam.filter = JSON.stringify(param);
//									$('#' + tableId).DataTable().ajax.reload();
//								} catch (e) {
//
//								}
//							});
//						}
//					});
//				} else {
//					contextmenu.push({
//						html: '<input class="form-control" type="text" name="' + colinfo.name + '-" data-filter="' + tableId + '" data-type="string">',
//						callback: function(e, t) {
//							$(e.target).unbind().change(function() {
//								var param = [];
//								$('input[data-filter="' + tableId + '"][type!="checkbox"]').each(function() {
//									if ($(this).val() != '') {
//										param.push({
//											'field': $(this).attr('name').split('-')[0],
//											'sqlIndex': $(this).attr('name').split('-')[0],
//											'type': $(this).attr('data-type'),
//											'value': $(this).val(),
//											'operate': $(this).attr('name').split('-')[1]
//										});
//									}
//								});
//								try {
//									tableParam.filterParam.filter = JSON.stringify(param);
//									$('#' + tableId).DataTable().ajax.reload();
//								} catch (e) {
//
//								}
//							});
//						}
//					});
//				}
//			}
//			if ($(this).attr('data-column-index') == '0') {
//				$(this).contextMenu({
//					menu: contextmenu.concat(menuShow)
//				});
//			} else {
//				$(this).contextMenu({
//					menu: contextmenu
//				});
//			}
//		});
		dt.topVal = {};
		$(dt.nTableWrapper).mousewheel(e => {
			if (!dt.topVal[dt.nScrollBody.scrollTop]) {
				dt.topVal[dt.nScrollBody.scrollTop] = 0;
			}
			dt.topVal[dt.nScrollBody.scrollTop] += e.deltaY;
			if (Math.abs(dt.topVal[dt.nScrollBody.scrollTop]) <= 5) {
				e.stopPropagation();
			} else {
				dt.topVal[dt.nScrollBody.scrollTop] = 0;
				e.stopPropagation();
				/*let $slimScrollDiv = $(e.currentTarget).closest('.slimScrollDiv');
				if ($slimScrollDiv.length > 0) {
					let h1 = $slimScrollDiv.height();
					let h2 = $('.slimScrollBar', $slimScrollDiv).height();
					if (h1 == h2) {
						e.stopPropagation();
					}
					//console.info('h1:', h1, 'h2:', h2);
				}*/
			}
			/*
			dt.bdoScreenY += e.deltaY;
			if(!dt.topVal[dt.nScrollBody.scrollTop]) {
				dt.topVal[dt.nScrollBody.scrollTop] = 0;
			}
			dt.topVal[dt.nScrollBody.scrollTop] += e.deltaY;
			if(e.deltaY == -1) {
				if(dt.nScrollBody.scrollTop >= 0 && dt.nTable.offsetHeight >= dt.nScrollBody.scrollTop + dt.nScrollBody.offsetHeight) {
					e.stopPropagation();
				}
			}
			if(e.deltaY == 1) {
				if(dt.nScrollBody.scrollTop > 0 && dt.nTable.offsetHeight >= dt.nScrollBody.scrollTop + dt.nScrollBody.offsetHeight) {
					e.stopPropagation();
				}
			}
			console.info('e.deltaY:',e.deltaY,'\tdt.nScrollBody.scrollTop:',dt.nScrollBody.scrollTop,'\tdt.topVal['+dt.nScrollBody.scrollTop+']:',dt.topVal[dt.nScrollBody.scrollTop]);*/
		});
//		$('body').off('mousedown', 'input.date-picker');
//		$('body').on('mousedown', 'input.date-picker', function() {
//			if (!$(this).hasClass('filter-date-picker')) {
//				$(this).addClass('filter-date-picker').datepicker({
//					autoclose: true,
//					todayHighlight: true,
//					language: 'zh-CN',
//					format: 'yyyy-mm-dd'
//				});
//			}
//		});
	});
	// 刷新数据
	$('.tableRefresh').on('click', function() {
		$('#' + tableId).DataTable().ajax.reload();
	});
};
$DataTable.ext.internal.fnFixedTheadResize = function(setting) {
	let fixedThead = setting.oInit.fixedThead;
	let resizThFlg = setting.oInstance.attr('resize-th');
	if (fixedThead !== true) {
		return;
	}
	let tb = setting.oInstance
		, thead = $('thead', tb)//tb.find('thead')
		, tbody = $('tbody', tb)//tb.find('tbody')
		, thtr = $('tr:eq(0)', thead)//thead.find('tr').eq(0)
		, tbdtr = $('tr', tb)//tbody.find('tr')
		, tbdtd = $('tr td:visible', tb)//tbody.find('tr td:visible')
		, thtrWidth = 0;

	tb.css({
		overflow: 'hidden'
	});

	thtr.css({
		display: 'block',
		float: 'left',
		left: '0px',
		position: 'relative'
	});

	thtr.find('th').css({
		display: 'inline-block'
	});

	tbdtr.css({
		display: 'block'
	});

	tbdtd.css({
		display: 'inline-block'
	});

	let maxHeight = 0;
	let getCssWidth = ($el, property) => {
		return parseFloat(($el.css(property) != null &&
			$el.css(property) != undefined &&
			$el.css(property) &&
			$el.css(property) != '') ? $el.css(property).replace('px', '') : 0);
	};
	let getBorderWidth = $el => {
		return getCssWidth($el, 'border-left-width') + getCssWidth($el, 'border-right-width');
	};
	let getPaddingWidth = $el => {
		return getCssWidth($el, 'padding-left') + getCssWidth($el, 'padding-right');
	};
	let getEv = $el => {
		return getPaddingWidth($el) + getBorderWidth($el);
	};
	let setWidth = (a, b) => {
		let width = $(b).width();
		if ($(b).has('.table-th-fixed').length) {
			$(b).find('.table-th-fixed').remove();
		}
		$(b).append($('<div class="table-th-fixed" style="height: 0px;">&nbsp;</div>').width(width + 'px'));
		$(b).css('display', 'table-cell');
	};
	let maxThHeight = 0;
	thtr.find('th').each((index, el) => {
		let $el = $(el);
		if ($el.width() < 30) {
			$el.width(30);
		}
		if (maxThHeight < $el.height()) {
			maxThHeight = $el.height();
		}
		let ev = getEv($el);
		thtrWidth += ($el.width() + ev);
		tbdtr.each((i, e) => {
			let $td = $(e).find('td').eq(index);
			if ($td.is(':visible')) {
				let mev = getBorderWidth($td);
				$td.width(($el.width() + ev - mev) + 'px');
				setWidth(i, $td);
			}
		});
	});
	thtr.find('th').height(maxThHeight);
	thtr.width((thtrWidth + 2) + 'px');
	tbdtr.width((thtrWidth + 2) + 'px');
	setting.oInit.fixedHeight ? tbody.height(setting.oInit.fixedHeight) : null;
	let parentWidth = tb.parent().width() + 'px' + ' !important;';
	tb.css('cssText', 'min-width: ' + parentWidth + 'max-width: ' + parentWidth + 'width: ' + parentWidth + 'overflow: hidden;');
	tbody.css({
		display: 'block',
		overflow: 'auto',
		minWidth: parentWidth,
		width: parentWidth,
		maxWidth: parentWidth
	});

	let data = tb.fnGetData();
	if (!data || data.length == 0) {
		tbody.find('td')[0].style.width = parentWidth.replace(' !important;', '');
	}
	/*thtr.find('th').css('display', 'table-cell');
	thtr.css('display', 'table-row');*/
	tbody.find('tr').css({
		'display': 'table-row',
		'float': 'left'
	});
	setTimeout(() => {
		tbody.find('tr').css('float', 'none');
	}, 300);
	/*tb.bdosctop = 0;
	tb.on('mousewheel',function(e){
		console.log(e);
		//sctop += (-1*e.deltaY*80);
		let $tbscroll = tb.closest('.dataTables_scrollBody');
		let height = $tbscroll.height();
		tb.bdosctop += e.deltaY;
		if(tb.bdosctop < 0) tb.bdosctop = 0;
		if(tb.bdosctop > height) tb.bdosctop = height;
		$tbscroll.scrollTop(sctop);
		e.preventDefault();
	});*/
	/*tbody.on('scroll', (e) => {
		thtr.css('left', (-tbody.scrollLeft()) + 'px');
		let JCLRLeft = getCssWidth(tb.siblings('.JCLRgrips').find('.JCLRgrip:first'), 'left');
		let firstThWidth = thtr.find('th:first').width() + getEv(thtr.find('th:first'));
		let offset = (-tbody.scrollLeft()) + firstThWidth; // 偏移量
		if(Math.abs(JCLRLeft - offset) > 3) {
			offset = JCLRLeft - (offset + 2);
			tb.siblings('.JCLRgrips').find('.JCLRgrip').sort((a, b) => {
				return a.style.left - b.style.left;
			}).each((i, el) => {
				let leftOffset = (parseInt(getCssWidth($(el), 'left')) - offset);
				$(el).css('left',leftOffset + 'px');
			});
		}
	});*/
	if (resizThFlg != 'true') {
		tb.attr('resize-th', 'true');
		setTimeout(() => {
			thtr.find('th').each((index, el) => {
				let $tr;
				let $th = $(el);
				tbody.find('tr').each((i, tr) => {
					let $m_tr = $(tr);
					if ($m_tr.find('td').length == thtr.find('th').length &&
						$m_tr.find('td').eq(index).is(':visible')) {
						$tr = $m_tr;
					}
				});
				if ($tr) {
					let $td = $tr.find('td').eq(index);
					let tdwidth = $td.width();
					let thwidth = $th.width();
					let ev = getEv($th);
					let mev = getEv($td);
					let thwidth2 = 0;
					if ((thwidth + ev) < (tdwidth + mev)) {
						thtr.width((thtr.width() + (tdwidth + mev) - (thwidth + ev)) + 'px');
						thwidth2 = (tdwidth + mev) - (thwidth + ev) + thwidth;
						$th.width(thwidth2 + 'px');
						//$th.find('.table-th-fixed').width(thwidth2 + 'px');

						$td.width(tdwidth + 'px');
						$td.find('.table-th-fixed').width(tdwidth + 'px');
					}
				}
			});
		}, 300);
	} else {

	}
	//console.log("$DataTable.ext.internal.fnFixedTheadResize");
};
$DataTable.ext.internal.fnSetColVisiblity = function(tableId, dtParam) {
	var tableParam = dtParam.tableParam;
	var setOption = $('#' + tableId).parent().prev().find('tr').eq(0);
	setOption.append('<div class="setBtn" style="position: absolute;background: #ccc;height: 15px;width: 15px;top: 6px;left: 0;border-radius: 0 0 50%;"><span class="fa fa-asterisk" style="vertical-align: top;"></span></div>');
	$('.setBtn').on('click', function(event) {
		event.stopPropagation();
		var domStr = '';
		var parameter = $(this).parents('.dataTables_scroll').find('.dataTables_scrollBody table').DataTable().context[0].aoColumns;
		for (var i = 1; i < parameter.length; i++) {
			var checked = parameter[i].bVisible ? 'checked=\'checked\'' : '';
			domStr += '<tr>' +
				'<td class="index" data-index="' + parameter[i].index + '" style="display:none">' + i + '</td>' +
				'<td>' + parameter[i].title + '</td>' +
				'<td><input type="checkbox" name="setTable" ' + checked + '></td>' +
				'</tr>';
		}
		$('#setValue').html(domStr);
		$('#setTable').one('shown.bs.modal', function() {
			$('#setTable .modal').draggable();
			$('#setTable .modal-content').css('overflow', 'hidden');
			var tabindex = 0;
		});
		var fixHelperModified = function(e, tr) {
				var $originals = tr.children();
				var $helper = tr.clone();
				$helper.children().each(function(index) {
					$(this).width($originals.eq(index).width());
				});
				return $helper;
			},
			updateIndex = function(e, ui) {
				$('td.index', ui.item.parent()).each(function(i) {
					$(this).html(i + 1);
				});
			};
		$('#setTable tbody').sortable({
			helper: fixHelperModified,
			stop: updateIndex
		}).disableSelection();
		$('#setTable').modal('show');
		//点击确定关闭
		$('#setTable_sure').click(function() {
			var arr = [];
			var tr = $('#setValue').find('tr');
			for (var j = 0; j < tr.length; j++) {
				var td = tr.eq(j).find('td');
				var setCk = td.eq(2).find('input').is(':checked');
				var setIndex = td.eq(0).data('index');
				var data = {
					setIndex: setIndex,
					setOption: [j + 1, setCk]
				};
				arr[setIndex - 1] = data;
			}
			$.each(arr, function(index, value) {
				tableParam.aoColumnDefs[index].targets = value.setOption[0];
				tableParam.aoColumnDefs[index].bVisible = value.setOption[1];
			});
			//console.log(tableParam);
			dtParam.tableParam = tableParam;
			BdoDataTable(tableId, dtParam);
			//发送ajax
			$('#setTable').modal('hide');
		});
	});
};

var customizeColModalTpl = customizeColModalTpl || `
	<div class="modal fade" id="setTableModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info" style="display:none">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">表格排序及显示</h3>
					</div>
				</div>
				<div class="modal-body" style="min-height:500px;max-height:500px">
					<table class="table table-condensed" id="setTable">
						<tbody >
						{{each cols item index}}
							<tr>
								<td class="index" data-index="{{item.idx}}" style="display:none">
								<td>{{item.title}}</td>
								<td><input type="checkbox" name="visible" {{if item.visible || item.bVisible}}checked{{/if}}></td>
							</tr>
						{{/each}}
						</tbody>
					</table>
				</div>
				<div class="modal-footer">
					<div class="col-sm-12">
						<button class="btn btn-md btn-primary" type="button" id="saveDefaultTableConf">
							<i class="fa fa-undo"></i><span>&nbsp;恢复默认</span>
						</button>
						<button class="btn btn-md btn-primary" type="button" id="saveTableConf">
							<i class="fa fa-send"></i><span>&nbsp;确定</span>
						</button>
						<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
							<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
`;
window.artTemplate = template;
artTemplate('./bodTableSettingModal', customizeColModalTpl);
/**
 * 获取自定义排序
 * @returns {*}
 */
$DataTable.ext.internal.fnGetCustomizeCol = function() {
	let setting = this.fnSettings();
	let dtd = $.Deferred();
	let defualtColumnsConfig = setting.aoColumns.map(col => {
		return {
			idx: col.idx,
			mData: col.mData,
			name: col.name,
			title: col.title,
			targets: col.targets,
			asSorting: col.asSorting,
			visible: col.visible,
			bVisible: col.bVisible
		};
	});
	//let defualtColumnsConfig = setting.defualtColumnsConfig;
	$.ajax({
		type: 'post',
		url: 'cpBase/General.query.json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'DG00081',
			param1: window.sys_menuId,
			param2: setting.sTableId
		},
		dataType: 'json',
		bdolxLoader: true,
		success(data) {
			if (data.success == true) {
				if (data.data && data.data.length/* && data.data[0].customizeConfig && data.data[0].customizeConfig != 'null'*/) {
					setting.aoCustomizeColumns = JSON.parse(data.data[0].customizeConfig);
				} else {
					setting.aoCustomizeColumns = defualtColumnsConfig;
				}
				dtd.resolve();
			} else {
				dtd.reject();
			}
		},
		error(data) {
			dtd.reject();
		}
	});
	return dtd.promise();
};

/**
 * 初始化自定义数据表列序
 */
$DataTable.ext.internal.fnInitCustomizeCol = function() {
	let $this = this;
	let setting = this.fnSettings();
	setting.defualtColumnsConfig = setting.aoColumns.map(col => {
		return {
			idx: col.idx,
			mData: col.mData,
			name: col.name,
			title: col.title,
			targets: col.targets,
			asSorting: col.asSorting,
			visible: col.visible,
			bVisible: col.bVisible
		};
	});
	let $headerTable = $('table.dataTable', setting.nScrollHead);
	let $setCizeColBtn = $('<div class="set-cize-col-ctn" style="z-index: 1;cursor: pointer;position: absolute;width: 0;height:0;border-width: 20px 30px 30px 0;border-style:solid;border-color: #51c783 transparent transparent;position: absolute;"></div>');
	$setCizeColBtn.insertBefore($headerTable);
	$setCizeColBtn.click((event) => {
		let $modal = $(window.artTemplate('./bodTableSettingModal', {cols: setting.aoCustomizeColumns}));
		let $table = $('#setTable', $modal);
		if ($('body').find('#setTableModal').length > 0) {
			$('#setTableModal').replaceWith($modal);
		} else {
			$modal.appendTo($('body'));
		}
		$modal.on('hidden.bs.modal', event => {
			$modal.remove();
		});
		$('tbody', $table).sortable({
			helper(e, tr) {
				let $originals = tr.children();
				let $helper = tr.clone();
				$helper.children().each(function(index) {
					$(this).width($originals.eq(index).width());
				});
				return $helper;
			},
			stop(e, ui) {

			}
		}).disableSelection();
		$('#saveTableConf', $modal).click(event => {
			let tr = $table.find('tr');
			let arr = [];
			tr.each((index, mtr) => {
				let $tr = $(mtr);
				//console.log("parseInt($tr.find('td.index').attr('data-index')):", parseInt($tr.find('td.index').attr('data-index')));
				arr.push({
					idx: parseInt($tr.find('td.index').attr('data-index')),
					visible: $tr.find('[name="visible"]')[0].checked,
					bVisible: $tr.find('[name="visible"]')[0].checked
				});
			});
			setting.aoCustomizeColumns.sort(function(a, b) {
				let ai = arr.findIndex(m => {
					return m.idx == a.idx;
				});
				let bi = arr.findIndex(m => {
					return m.idx == b.idx;
				});
				a.visible = arr[ai].visible;
				a.bVisible = arr[ai].bVisible;
				b.visible = arr[bi].visible;
				b.bVisible = arr[bi].bVisible;
				return ai - bi;
			});
			//发送ajax
			$modal.modal('hide');
			$this.fnSetCustomizeCol();
			$this.fnSaveCustomizeCol();
			$this.api(true).draw();
		});
		$('#saveDefaultTableConf', $modal).click(event => {
			let config = setting.defualtColumnsConfig;
			setting.aoCustomizeColumns.sort(function(a, b) {
				let ai = config.findIndex(m => {
					return m.idx == a.idx;
				});
				let bi = config.findIndex(m => {
					return m.idx == b.idx;
				});
				a.visible = config[ai].visible;
				a.bVisible = config[ai].bVisible;
				b.visible = config[bi].visible;
				b.bVisible = config[bi].bVisible;
				return ai - bi;
			});
			$this.fnSetCustomizeCol();
			$this.fnSaveCustomizeCol();
			$this.api(true).draw();
		});
		$modal.modal('show');
	});
	if (!setting.aoCustomizeColumns) {
		$.when($this.fnGetCustomizeCol()).done(data => {
			$this.fnSaveCustomizeCol().done(data => {
				$this.fnSetCustomizeCol();
			});
		});
	}
};

/**
 * 保存自定义数据表列序
 */
$DataTable.ext.internal.fnSaveCustomizeCol = function() {
	let setting = arguments[0];
	let cizeColStr = JSON.stringify(setting.aoCustomizeColumns);
	if (!cizeColStr || cizeColStr == 'null' || cizeColStr == 'undefined') {
		setting.aoCustomizeColumns = setting.aoColumns.map(col => {
			return {
				idx: col.idx,
				mData: col.mData,
				name: col.name,
				title: col.title,
				targets: col.targets,
				asSorting: col.asSorting,
				visible: col.visible,
				bVisible: col.bVisible
			};
		});
		cizeColStr = JSON.stringify(setting.aoCustomizeColumns);
	}
	return $.ajax({
		type: 'post',
		url: 'cpBase/Customizetblconf.saveCustomzieConf.json',
		data: {
			menuId: window.sys_menuId,
			jsonData: JSON.stringify({
				menuId: window.sys_menuId,
				clientTableId: setting.sTableId,
				customizeConfig: cizeColStr
			})
		},
		dataType: 'json',
		bdolxLoader: true
	});
};

/**
 * 列序调整
 */
$DataTable.ext.internal.fnSetCustomizeCol = function() {
	if (!$.fn.DataTable.isDataTable(this)) {
		throw new Error('table 未初始化！用法：$(selector).dataTabel().fnSetCustomizeCol()');
	}
	let $this = this;
	let setting = arguments[0];

	let iaoHeaderIdx = [];
	let iaoHeader = new Array(setting.aoCustomizeColumns.length);
	if (setting.aoCustomizeColumns.length > setting.aoColumns.length) {
		// 更新列序
	}
	$(setting.aoCustomizeColumns).each((index, cizeCol) => {
		if (index < setting.aoColumns.length) {
			$.extend(true, setting.aoColumns[index], cizeCol);
			if (cizeCol.visible || cizeCol.bVisible) {
				$(setting.aoColumns[index].nTh).show();
			} else {
				$(setting.aoColumns[index].nTh).hide();
			}
			iaoHeaderIdx.push(cizeCol.idx);
			cizeCol.idx = index;
		}
	});
	setting.aoColumns.sort((a, b) => {
		return a.idx - b.idx;
	});
	/*$(setting.aoColumns).each((index, col) => {
		col.idx = index;
	});*/
	$.each(setting.aoHeader[0], (index, header) => {
		iaoHeader[iaoHeaderIdx[index]] = header;
	});
	$(setting.aoHeader[0].nTr).empty();
	if (iaoHeader.length > setting.aoHeader[0].length) {
		// 更新列序
	}
	$.each(iaoHeader, (index, header) => {
		if (index < setting.aoHeader[0].length) {
			setting.aoHeader[0][index] = header;
			$(setting.aoHeader[0].nTr).append(header.cell);
		}
	});
	$this.api(true).columns.adjust().fixedColumns().relayout();
	setting.doCustomizeCol = true;
	if (setting.sInstance == 'auditProgramTable') {
		console.log('setting.doCustomizeCol = true;');
	}
	$this.fnDraw();
};

function onFilterDatePicker() {
	if (!$(this).hasClass('filter-date-picker')) {
		$(this).addClass('filter-date-picker').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN',
			format: 'yyyy-mm-dd'
		});
	}
}

/*$DataTable.ext.internal.fnBdoFaithOrderDt =  function () {
	let table = this;
	console.log("tableId::["+table.id+"]"+ "fnBdoFaithOrderDt");
	// 防抖
	if(window.faithDataTableResizeTime) {
		return;
		/!*clearTimeout(window.faithDataTableResizeTime);
		window.faithDataTableResizeTime = null;*!/
	}
	window.faithDataTableResizeTime = setTimeout(function(){
		console.log("tableId::["+table.id+"]"+ "$('#'+tableId).on('order.dt', function ()");
		//$(document).resize();
		clearTimeout(window.faithDataTableResizeTime);
		window.faithDataTableResizeTime = null;
		console.log("tableId::["+table.id+"]"+ "$('#'+tableId).on('order.dt', function () end");
	}, 200);
};*/

$DataTable.ext.internal.fnBdoFaithOrderInitDt = function(event, dt, data) {
	//console.log("$(#"+dt.sTableId+").on('init.dt', function()");
//	let localParam = event.data.localParam;
//	let menuShow = [];
//	menuShow.push({
//		text: '显示'
//	});
//	$.each(dt.aoColumns, function(index, info) {
//		if (info.name) {
//			menuShow.push({
//				html: '<label class="css-input css-checkbox css-checkbox-sm css-checkbox-primary"><input type="checkbox" name="' + info.data + '" ' + ((info.visible == false) ? '' : 'checked') + '><span></span>' + info.title + '</label>',
//				callback: function(e, t) {
//					if ($(e.target).closest('input').attr('name')) {
//						$('input[type="checkbox"][name="' + $(e.target).closest('input').attr('name') + '"]').each(function() {
//							$(this).attr('checked', $(e.target).closest('input').is(':checked'));
//						});
//						info.visible = info.bVisible = $(e.target).closest('input').is(':checked');
//						//$('#' + tableId).DataTable().column(index).visible($(e.target).closest('input').is(':checked'));
//					}
//				}
//			});
//		}
//	});
//	$.each(dt.aoHeader[0], (index, head) => {
//		if (head.cell.cellIndex < 0) return;
//		//console.log(head.cell.cellIndex);
//		let colinfo = dt.aoColumns[head.cell.cellIndex];
//		let contextmenu = [];
//		contextmenu.push({
//			text: '筛选'
//		});
//		if (colinfo.name && colinfo.name != '') {
//			if (!colinfo.filter) {
//				colinfo.filter = {
//					type: 'string'
//				};
//			}
//			if (colinfo.filter.type == 'string') {
//				contextmenu.push({
//					html: '<input class="form-control" type="text" name="' + colinfo.name + '-" data-filter="' + dt.sTableId + '" data-type="string">',
//					callback: function(e, t) {
//						$(e.target).unbind().change(function() {
//							let param = [];
//							$('input[data-filter="' + dt.sTableId + '"][type!="checkbox"]').each(function() {
//								if ($(this).val() != '') {
//									param.push({
//										'field': $(this).attr('name').split('-')[0],
//										'sqlIndex': $(this).attr('name').split('-')[0],
//										'type': $(this).attr('data-type'),
//										'value': $(this).val(),
//										'operate': $(this).attr('name').split('-')[1]
//									});
//								}
//							});
//							try {
//								localParam.urlparam.filter = JSON.stringify(param);
//								dt.ajax.reload();
//							} catch (e) {
//
//							}
//						});
//					}
//				});
//			} else if (colinfo.filter.type == 'number') {
//				contextmenu.push({
//					html: '<input class="form-control" type="number" placeholder="=" name="' + colinfo.name + '-eq" data-filter="' + dt.sTableId + '" data-type="numeric"><br><input class="form-control" type="number" placeholder=">=" name="' + colinfo.name + '-gt" data-filter="' + dt.sTableId + '" data-type="numeric"><br><input class="form-control" type="number" placeholder="<=" name="' + colinfo.name + '-lt" data-filter="' + dt.sTableId + '" data-type="numeric">',
//					callback: function(e, t) {
//						$(e.target).unbind().change(function() {
//							var param = [];
//							$('input[data-filter="' + dt.sTableId + '"][type!="checkbox"]').each(function() {
//								if ($(this).val() != '') {
//									param.push({
//										'field': $(this).attr('name').split('-')[0],
//										'sqlIndex': $(this).attr('name').split('-')[0],
//										'type': $(this).attr('data-type'),
//										'value': $(this).val(),
//										'operate': $(this).attr('name').split('-')[1]
//									});
//								}
//							});
//							try {
//								localParam.urlparam.filter = JSON.stringify(param);
//								dt.ajax.reload();
//							} catch (e) {
//
//							}
//						});
//					}
//				});
//			} else if (colinfo.filter.type == 'date') {
//				contextmenu.push({
//					html: '<input class="form-control date-picker" type="text" placeholder="发生日" name="' + colinfo.name + '-eq" data-filter="' + dt.sTableId + '" data-type="date"><br><input class="form-control date-picker" type="text" placeholder="开始日" name="' + colinfo.name + '-gt" data-filter="' + dt.sTableId + '" data-type="date"><br><input class="form-control date-picker" type="text" placeholder="结束日" name="' + colinfo.name + '-lt" data-filter="' + dt.sTableId + '" data-type="date">',
//					callback: function(e, t) {
//						$(e.target).unbind('change').change(function() {
//							var param = [];
//							$('input[data-filter="' + dt.sTableId + '"][type!="checkbox"]').each(function() {
//								if ($(this).val() != '') {
//									param.push({
//										'field': $(this).attr('name').split('-')[0],
//										'sqlIndex': $(this).attr('name').split('-')[0],
//										'type': $(this).attr('data-type'),
//										'value': $(this).val(),
//										'operate': $(this).attr('name').split('-')[1]
//									});
//								}
//							});
//							try {
//								localParam.urlparam.filter = JSON.stringify(param);
//								dt.ajax.reload();
//							} catch (e) {
//
//							}
//						});
//					}
//				});
//			}
//		}
//		if ($(head.cell).attr('data-column-index') == '0') {
//			$(this).contextMenu({
//				menu: contextmenu.concat(menuShow)
//			});
//		} else {
//			$(head.cell).contextMenu({
//				menu: contextmenu
//			});
//		}
//	});
	/*$(dt.nTableWrapper).mousewheel(e => {
		console.info(dt.nScrollBody.offsetHeight, dt.nScrollBody.scrollTop, dt.nScrollBody.scrollHeight);
		console.info(dt.nTable.offsetHeight, dt.nTable.scrollTop, dt.nTable.scrollHeight);
		if(e.deltaY == -1) {
			if(dt.nScrollBody.scrollTop >= 0 && Math.abs(dt.nScrollBody.scrollHeight - (dt.nScrollBody.scrollTop + dt.nScrollBody.offsetHeight)) >= 8 ) {
				console.info('dt.nScrollBody.scrollTop');
				e.stopPropagation();
			}else {
				console.info('!dt.nScrollBody.scrollTop');
			}
		}
		if(e.deltaY == 1) {
			if(dt.nScrollBody.scrollTop > 0) {
				//console.info('dt.nScrollBody.scrollTop2');
				e.stopPropagation();
			}else {
				console.info('!dt.nScrollBody.scrollTop2');
			}
		}
	});*/
	dt.topVal = {};
	$(dt.nTableWrapper).mousewheel(e => {
		if (!dt.topVal[dt.nScrollBody.scrollTop]) {
			dt.topVal[dt.nScrollBody.scrollTop] = 0;
		}
		dt.topVal[dt.nScrollBody.scrollTop] += e.deltaY;
		if (Math.abs(dt.topVal[dt.nScrollBody.scrollTop]) <= 5) {
			e.stopPropagation();
		} else {
			dt.topVal[dt.nScrollBody.scrollTop] = 0;
			let $slimScrollDiv = $(e.currentTarget).closest('.slimScrollDiv');
			if ($slimScrollDiv.length > 0) {
				let h1 = $slimScrollDiv.height();
				let h2 = $('.slimScrollBar', $slimScrollDiv).height();
				if (h1 == h2) {
					e.stopPropagation();
				}
				//console.info('h1:', h1, 'h2:', h2);
			}
		}
		/*if(e.deltaY < 0) {
			if(dt.nScrollBody.scrollTop >= 0 && Math.abs(dt.nScrollBody.scrollHeight - (dt.nScrollBody.scrollTop + dt.nScrollBody.offsetHeight)) >= 8) {
				e.stopPropagation();
			}else {
				console.info('!dt.nScrollBody.scrollTop');
			}
		}
		if(e.deltaY > 0) {
			if(dt.nScrollBody.scrollTop > 0) {
				e.stopPropagation();
			}else {
				console.info('!dt.nScrollBody.scrollTop2');
			}
		}*/

		//console.info('e.deltaY:',e.deltaY,'\tdt.nScrollBody.scrollTop:',dt.nScrollBody.scrollTop,'\tdt.topVal['+dt.nScrollBody.scrollTop+']:',dt.topVal[dt.nScrollBody.scrollTop]);
	});

	$(document).off('mousedown', 'input.date-picker', onFilterDatePicker);
	$(document).on('mousedown', 'input.date-picker', onFilterDatePicker);
};

$DataTable.ext.internal.fnGetBdoConfig = function(settings) {
	return settings.bdoConfig;
};

$DataTable.ext.internal.fnSetBdoConfig = function(settings, configObject) {
	settings.bdoConfig = configObject;
};
/**  */
var BdoDataTable = function(tableId, dtParam, $context) {
	var $context_ = $context ? $context_ : $(document);
	var $table = $('#' + tableId, $context_);

	$.fn.dataTable.RowGroup = $.fn.dataTable._RowGroup;
	$.fn.DataTable.RowGroup = $.fn.dataTable._RowGroup;
	var localParam = dtParam.localParam;
	var tableParam = dtParam.tableParam;
	tableParam.bdolxLoader = tableParam.bdolxLoader === true ? true : false;
	if (dtParam.tableParam.displayIcon === false && dtParam.tableParam.displayIcon != null) {
		$DataTable.defaults.oLanguage.sProcessing = '';
		tableParam.processing = false;
	} else {
		if (tableParam.bdolxLoader === false) {
			$DataTable.defaults.oLanguage.sProcessing = '<div class="faith-data-table-processing"><img src="/Faith/img/bdo/loading.gif" width="100px" height="100px"/></div>';
			//$DataTable.defaults.oLanguage.sProcessing='<div class="faith-data-table-processing">正在加载数据...</div>';
			tableParam.processing = true;
		} else {
			$DataTable.defaults.oLanguage.sProcessing = '';
			tableParam.processing = false;
		}
	}
	//$DataTable.defaults.oLanguage.sProcessing='';
	let initColResizable = function(context) {
		context.colResizable({
			resizeMode: 'flex'
		});
	};

	$('ul.ul-context-menu').remove();
	// 销毁表
	if ($table.hasClass('dataTable')) {
		$table.DataTable().clear();
		$table.DataTable().destroy();
		$table.empty();
	}
	var outerText = $table[0].outerHTML;
	/*var $table_ = $(outerText);
	$table.replaceWith($table_);
	$table = $table_;*/
	// 翻页默认设置
	if (tableParam.pageLength) {
		tableParam.lengthChange = true;
	}
	if (!tableParam.lengthChange) {
		tableParam.pageLength = 1000000;
	}
	// 序号列
	if (tableParam.columnDefs && tableParam.columnDefs[tableParam.columnDefs.length - 1].title != '序号') {
		tableParam.columnDefs.push({
			targets: 0,
			orderable: false,
			className: 'text-center',
			title: '序号',
			width: '30px',
			visible: localParam.tabNum ? localParam.tabNum : false,
			render: function(data, type, row, meta) {
				return meta.settings._iDisplayStart + meta.row + 1;
			}
		});
	}
	// 加载数据
	if (!tableParam.ajax && !tableParam.data) {
		var backData = {};
		if (localParam.data) {
			tableParam.ajax = function(data, callback, settings) {
				backData.recordsTotal = localParam.data.length;
				backData.recordsFiltered = localParam.data.length;
				backData.data = localParam.data;
				if (!backData.data) {
					backData.data = [];
				}
				setTimeout(() => {
					callback(backData);
				}, 300);
			};
		} else if (localParam.url && localParam.url != '') {
			tableParam.ajax = function(data, callback, settings) {
				if (settings.doCustomizeCol/* && settings.dataCache*/) {
					backData.recordsTotal = 9;
					backData.recordsFiltered = 9;
					backData.data = [];
					this._fnCallbackFire(settings, null, 'xhr', [settings, {}, settings.jqXHR]);
					//$(settings.nTable).trigger( 'xhr.dt', args );
					//callback(backData);
					//settings.doCustomizeCol = false;
				} else {
					/*if(settings.sInstance == "auditProgramTable") {
						console.log('if(settings.doCustomizeCol && settings.dataCache)');
					}*/
					/*if(settings.doCustomizeCol && settings.dataCache) {
						settings.doCustomizeCol = false;
						callback(settings.dataCache);
					}*/
					localParam.urlparam.page = $('#' + tableId).DataTable().page();
					localParam.urlparam.start = data.start;
					localParam.urlparam.limit = data.length;
					if (!tableParam.lengthChange) {
						localParam.urlparam.start = -1;
						localParam.urlparam.limit = -1;
					}
					if (tableParam.ordering) {
						localParam.urlparam.sort = dataSort(data);
					}
					$.ajax({
						type: 'post',
						url: localParam.url,
						data: localParam.urlparam ? localParam.urlparam : {},
						dataType: 'json',
						bdolxLoader: tableParam.bdolxLoader,
						success: function(returnData) {
							if (returnData.success == false) {
								if (returnData.resultInfo != null && returnData.resultInfo.statusText != null) {
									bdoErrorBox('错误', returnData.resultInfo.statusText);
								} else {
									bdoErrorBox('系统错误', '请刷新页面后重试！');
									return;
								}
								returnData.data = [];
							}
							backData.recordsTotal = returnData.totalCount;
							backData.recordsFiltered = returnData.totalCount;
							backData.data = returnData.data;
							if (!backData.data) {
								backData.data = [];
							}
							settings.dataCache = backData;
							/*if(settings.sInstance == "auditProgramTable") {
								console.log('callback(settings.dataCache);');
							}*/
							setTimeout(() => {
								callback(settings.dataCache);
							}, 300);
							if (settings.doCustomizeCol) {
								settings.doCustomizeCol = false;
							}
						},
						error: function() {
							bdoErrorBox('系统错误', '请刷新页面后重试！');
						}
					});
				}
			};
		}
	}

	//排序后重置页面
	/*$('#'+tableId).off('order.dt', $DataTable.ext.internal.fnBdoFaithOrderDt);
	$('#'+tableId).on('order.dt', $DataTable.ext.internal.fnBdoFaithOrderDt);*/
	// 初始化表事件
	$table.off('init.dt', $DataTable.ext.internal.fnBdoFaithOrderInitDt);
	$table.on('init.dt', {localParam: localParam}, $DataTable.ext.internal.fnBdoFaithOrderInitDt);
	tableParam.autoWidth = true;
	tableParam.scrollX = true;
	// fixedColumns明确指定为false时保持false不变，也就是可以禁用固定列效果(用以避免和行拖动插件冲突)
	tableParam.fixedColumns !== false && (tableParam.fixedColumns = tableParam.fixedColumns || true);
	tableParam.fixedColumns = false; // #4342 固定列有时会出现错位，暂全体禁用固定列
	tableParam.scrollY = (tableParam.scrollY || tableParam.scrollY === false) ? tableParam.scrollY : 500;
	if(tableParam.scrollY === false) {
		tableParam.fixedColumns = false;
	}
	//初始化table
	var itable = $table.DataTable(tableParam);
	var mItable = $table.dataTable();
	mItable.fnSetBdoConfig(dtParam);
	//mItable.fnSetetBdoConfig(mItable);
	/*if(tableParam.bdoCustomizeColumns == true || typeof tableParam.bdoCustomizeColumns == 'object') {
		mItable.fnSettings().bdoCustomizeColumns = tableParam.bdoCustomizeColumns;
		mItable.fnInitCustomizeCol();
	}*/
	//表设置
	/*let setCol = tableParam.setCol;
	if(setCol !== true){
	}else{
		$DataTable.ext.internal.fnSetColVisiblity(tableId,dtParam)
	}*/

	//$('#' + tableId).dataTable().fnSetCustomizeCol();
	// 是否可选中
	if (tableParam.select != false) {
		//debugger;
		if ($('body').find('#bdo_faith_copycell').length == 0) {
			$('body').append('<input type="hidden" id="bdo_faith_copycell">');
			if (!window.faithCopycell) {
				window.faithCopycell = new ClipboardJS('#bdo_faith_copycell', {
					text: function(target) {
						var tableId = $(target).data('tableId');
						var cliboard = '';
						var isblank = true;
						var tr = '';
						var $table = $('#' + tableId);
						if ($table.length > 0) {
							$table.find('tbody tr').each(function() {

								isblank = true;
								tr = '';
								if ($(this).hasClass('selected')) {
									$(this).find('td').each(function() {
										isblank = false;
										if (tr != '') {
											tr += '\t';
										}
										let title = '';
										$(this).children().each(function(){
											title = $(this).attr('title');
											if (title && title != ''){
												
											}
										});
										if (title && title != ''){
											tr += title;
										} else {
											tr += $(this).text();
										}
									});
								} else {
									$(this).find('td').each(function() {
										if ($(this).hasClass('selected')) {
											isblank = false;
											if (tr != '') {
												tr += '\t';
											}
											let title = '';
											$(this).children().each(function(){
												title = $(this).attr('title');
												if (title && title != ''){
													
												}
											});
											if (title && title != ''){
												tr += title;
											} else {
												tr += $(this).text();
											}
										}
									});
								}
								if (cliboard != '' && !isblank) {
									cliboard += '\n';
								}
								if (!isblank) {
									cliboard += tr;
								}
							});
						}
						//console.log(cliboard);
						return cliboard;
					}
				});
			}
		}
		/*$('#' + tableId + '_copycell').remove();
		$('#' + tableId).after('<input type="hidden" id="' + tableId + '_copycell">');*/
		/*new ClipboardJS('#' + tableId + '_copycell', {
			text : function(target){
				var cliboard = '';
				$('#' + tableId).find('tbody tr').each(function(){
					var isblank = true;
					var tr = '';
					if($(this).hasClass('selected')){
						$(this).find('td').each(function(){
							isblank = false;
							tr += $(this).text() + '\t'
						});
					} else {
						$(this).find('td').each(function(){
							if($(this).hasClass('selected')){
								isblank = false;
								tr += $(this).text() + '\t'
							}
						});
					}
					if(!isblank){
						cliboard += tr + '\n';
					}
				});
				return cliboard;
			}
		});*/
		$table.find('tbody').contextMenu({
			menu: [{
				text: '复制',
				callback: function(e, t) {
					$('#bdo_faith_copycell').data('tableId', tableId);
					$('#bdo_faith_copycell').click();
				}
			}]
		});

		var beforeX, beforeY;
		$table.off('click', 'tbody tr td');
		$table.on('click', 'tbody tr td', function(e) {
			if (typeof(beforeX) != 'undefined' && typeof(beforeY) != 'undefined' && e.shiftKey) {
				var startX, startY, endX, endY;
				if (beforeX < e.currentTarget.cellIndex) {
					startX = beforeX;
					endX = e.currentTarget.cellIndex;
				} else {
					startX = e.currentTarget.cellIndex;
					endX = beforeX;
				}
				if (beforeY < $(this).closest('tr').index()) {
					startY = beforeY;
					endY = $(this).closest('tr').index();
				} else {
					startY = $(this).closest('tr').index();
					endY = beforeY;
				}
				$table.find('tbody tr td').removeClass('selected');
				if (startX == 0 || endX == 0) {
					for (var i = startY; i <= endY; i++) {
						$table.find('tr').eq(i + 1).find('td').addClass('selected');
					}
				} else {
					for (var i = startY; i <= endY; i++) {
						for (var j = startX; j <= endX; j++) {
							$table.find('tr').eq(i + 1).find('td').eq(j).addClass('selected');
						}
					}
				}
				//			beforeX = e.currentTarget.cellIndex;
				//			beforeY = $(this).closest('tr').index();
			} else {
				if (e.currentTarget.cellIndex == 0) {
					if ($(e.currentTarget).hasClass('selected')) {
						$table.find('tbody tr td').removeClass('selected');
					} else {
						$table.find('tbody tr td').removeClass('selected');
						$(this).closest('tr').find('td').addClass('selected');
					}
				} else {
					if ($(e.currentTarget).hasClass('selected')) {
						$table.find('tbody tr td').removeClass('selected');
					} else {
						$table.find('tbody tr td').removeClass('selected');
						$(e.currentTarget).addClass('selected');
					}
				}
				beforeX = e.currentTarget.cellIndex;
				beforeY = $(this).closest('tr').index();
			}
		});
	}
	// 刷新数据
	$('#' + tableId + '_wrapper').off('click', '.tableRefresh');
	$('#' + tableId + '_wrapper').on('click', '.tableRefresh', function(event) {
		$table.DataTable().ajax.reload();
	});
	return backData;
};

/** 首页面表格 */
var BdoBoardTable = function(tableId, tableParam, filterParam) {
	if (tableParam.tableData) {
		var tableHtml = '';
		$.each(tableParam.tableData, function(index, info) {
			tableHtml += '<tr>';
			$.each(tableParam.tableColumns, function(i, col) {
				if (col.render) {
					tableHtml += '<td width="' + col.width + '">' + col.render(info) + '</td>';
				} else {
					tableHtml += '<td width="' + col.width + '">' + info[col.data] + '</td>';
				}
			});
			tableHtml += '</tr>';
		});
		$('#' + tableId).html(tableHtml);
		return;
	}
	filterParam.start = 0;
	filterParam.limit = 1000;
	let url = tableParam.url;
	if(!url) {
		url = 'base/General.query.json';
	}
	$.ajax({
		type: 'post',
		url: url,
		data: filterParam,
		dataType: 'json',
		bdolxLoader: true,
		success: function(data) {
			if (data.success == false) {
				if (data.resultInfo != null && data.resultInfo.statusText != null) {
					bdoErrorBox('错误', data.resultInfo.statusText);
					return;
				} else {
					bdoErrorBox('系统错误', '请刷新页面后重试！');
					return;
				}
			}
			var tableHtml = '';
			$.each(data.data, function(index, info) {
				tableHtml += '<tr>';
				$.each(tableParam.tableColumns, function(i, col) {
					if (col.render) {
						tableHtml += '<td width="' + col.width + '">' + col.render(info) + '</td>';
					} else {
						tableHtml += '<td width="' + col.width + '">' + info[col.data] + '</td>';
					}
				});
				tableHtml += '</tr>';
			});
			$('#' + tableId).html(tableHtml);
		},
		error: function() {
			bdoErrorBox('系统错误', '请刷新页面后重试！');
		}
	});
};

