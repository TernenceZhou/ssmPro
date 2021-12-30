var subjectAnalysisTab = function(tabId, customerId, subYear, startMonth, endMonth, subjectId) {
	if ($('#' + tabId + ' li a[href="#tab_subjectAnalysis"]').length != 0) {
		$('#' + tabId + ' li a[href="#tab_subjectAnalysis"]').remove();
	}
	$('#' + tabId + '').append('<li><a href="#tab_subjectAnalysis">科目结构分析&nbsp;&nbsp;<i class="fa fa-times-circle"></i></a></li>');
	$('#' + tabId + '_content').append('<div class="tab-pane" id="tab_subjectAnalysis"></div>');
	$('#' + tabId + ' a[href="#tab_subjectAnalysis"]').find('.fa-times-circle').click(function() {
		$(this).parents('ul').find('li').first().find('a').click();
		$(this).parents('li').remove();
		$('#tab_subjectAnalysis').remove();
	});
	var subjectAnalysisView = '<div class="content"><div class="block block-themed">                                                    '
	+ '	<div class="block-header bg-primary">                                               '
	+ '		<ul class="block-options">                                                        '
	+ '			<li>                                                                            '
	+ '				<button id="subjectAnalysis_search" type="button">                                 '
	+ '					<i class="fa fa-search" style="color: white;">&nbsp;查询</i>                '
	+ '				</button>                                                                     '
	+ '			</li>                                                                           '
	+ '			<li>                                                                            '
	+ '				<button type="button" data-toggle="block-option"                              '
	+ '						data-action="content_toggle"></button>                                    '
	+ '			</li>                                                                           '
	+ '		</ul>                                                                             '
	+ '		<h3 class="block-title">查询条件设定</h3>                                         '
	+ '	</div>                                                                              '
	+ '	<div id="search-condition" class="block-search">                                    '
	+ '		<div>                                                                             '
	+ '			<div class="row">                                                               '
	+ '				<div class="form-group"></div>                                                '
	+ '				<div class="form-group has-info">                                             '
	+ '					<div class="col-sm-2">                                                      '
	+ '						<div class="form-material">                                               '
	+ '							<input class="form-control" type="text" id="subjectAnalysis_subjectid"       '
	+ '								   autocomplete="off">                                                '
	+ '							<label for="subjectAnalysis_subjectid">科目编号</label>                      '
	+ '						</div>                                                                    '
	+ '					</div>                                                                      '
	+ '				</div>                                                                        '
	+ '				<div class="form-group has-info">                                             '
	+ '					<div class="col-sm-3">                                                      '
	+ '						<div class="form-material input-group">                                   '
	+ '							<input id="subjectAnalysis_start" class="form-control date-picker"           '
	+ '								   type="text" autocomplete="off">                                    '
	+ '							<span class="input-group-addon">-</span>                                '
	+ '							<input id="subjectAnalysis_end" class="form-control date-picker" type="text" '
	+ '								   autocomplete="off">                                                '
	+ '							<label for="subjectAnalysis_start">账套年月</label>                          '
	+ '						</div>                                                                    '
	+ '					</div>                                                                      '
	+ '				</div>                                                                        '
	+ '				<div class="form-group has-info">                                             '
	+ '					<div class="col-sm-3">                                                      '
	+ '						<div class="form-material">                                   '
	+ '							<select class="js-select2 form-control" id="subjectAnalysis_sort"           '
	+ '								   style="width: 100%;">                                    '
	+ '							<option></option>                              '
	+ '							</select> <label for="subjectAnalysis_sort">饼图显示数量</label> '
	+ '						</div>                                                                    '
	+ '					</div>                                                                      '
	+ '				</div>                                                                        '
	+ '			</div>                                                                          '
	+ '		</div>                                                                            '
	+ '	</div>                                                                              '
	+ '</div>                                                                               '
	+ '<div class="block block-bordered"><div class="block-header bg-primary"><ul class="block-options"><li>'
			+ '<button id="subjectAnalysis_export" type="button"><i class="si si-cloud-download" style="color: white;" title="导出"></i></button>'
			+ '</li></ul><h3 class="block-title">查询结果</h3></div><div class="block-content">' + '<table id="table_subjectAnalysis" class="table table-bordered table-striped table-hover"></table>'
			+ '</div></div><div class="row" id="subjectAnalysis_charts"></div></div>';
	$('#tab_subjectAnalysis').html(subjectAnalysisView);
	$('#' + tabId + ' a[href="#tab_subjectAnalysis"]').click();
	
	$('#subjectAnalysis_subjectid').val(subjectId);
	$('#subjectAnalysis_start').val(subYear + '-' + startMonth);
	$('#subjectAnalysis_end').val(subYear + '-' + endMonth);
	$('#subjectAnalysis_sort').html(ComboLocalDicOption(false, '科目结构分析饼图显示数量'));
	
	$('#subjectAnalysis_start, #subjectAnalysis_end').datepicker({
		autoclose : true,
		todayHighlight : true,
		language : 'zh-CN',
		format : 'yyyy-mm',
		minViewMode : 1
	});

	// 选择科目
	$('#subjectAnalysis_subjectid').focus(function() {
		if ($('#subjectAnalysis_start').val() == '') {
			$('#subjectAnalysis_start').focus();
			bdoInfoBox('提示', '请选择开始年月');
			return;
		}
		if ($('#subjectAnalysis_end').val() == '') {
			$('#subjectAnalysis_end').focus();
			bdoInfoBox('提示', '请选择结束年月');
			return;
		}
		$('#modal_subjectid_subjectAnalysis').modal('show');
		if ($('#subject_tree_subjectAnalysis').hasClass('treeview')) {
			return;
		}
		$('#subject_tree_subjectAnalysis').tree({
			url : 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params : {
				lockProjectId : customerId,
				lockYyyy : $('#subjectAnalysis_start').val().substr(0, 4),
				searchInputId : 'searchInput_subjectAnalysis'
			},
			singleSelect : true,
			lazyLoad : false,
			onceLoad : true,
			view : {
				leafIcon : 'fa fa-building text-flat',
				nodeIcon : 'fa fa-bank text-primary-light',
				folderSelectable : false,
				multiSelect : false,
				showCheckbox : true,
				selectedColor : '',
				selectedBackColor : ''

			}
		});
	});
	$('#modal_subjectid_subjectAnalysis_sure').click(function() {
		if (typeof ($('#subject_tree_subjectAnalysis').tree('getTreeMultiValue')) == 'object') {
			$('#subjectAnalysis_subjectid').val('');
		} else {
			var checkedData = $('#subject_tree_subjectAnalysis').tree('getCheckedData');
			if(checkedData[0].leaf){
				bdoInfoBox('提示', '请选择非末级科目');
				return;
			}else{
				$('#subjectAnalysis_subjectid').val($('#subject_tree_subjectAnalysis').tree('getTreeMultiValue'));
			}
		}
		$('#modal_subjectid_subjectAnalysis').modal('hide');
	});
	$('#modal_subjectid_subjectAnalysis_reset').click(function() {
		$('#subject_tree_subjectAnalysis').tree('reset');
	});

	// 年度改变科目树更新
	$('#subjectAnalysis_start').change(function() {
		if ($('#subject_tree_subjectAnalysis').hasClass('treeview')) {
			$('#subject_tree_subjectAnalysis').tree('reset');
			$('#subject_tree_subjectAnalysis').tree('destory');
		}
	});
	$('#subjectAnalysis_end').change(function() {
		if ($('#subject_tree_subjectAnalysis').hasClass('treeview')) {
			$('#subject_tree_subjectAnalysis').tree('reset');
			$('#subject_tree_subjectAnalysis').tree('destory');
		}
	});
	
	/** table 属性 */
	var subjectAnalysis_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/Account.getSubjectAnalysis.json',
			urlparam: {
				param1: $('#subjectAnalysis_subjectid').val(),
				param2: $('#subjectAnalysis_start').val().substr(5, 6),
				param3: $('#subjectAnalysis_end').val().substr(5, 6),
				param4: $('#subjectAnalysis_sort').val(),
				lockProjectId: customerId,
				lockYyyy: $('#subjectAnalysis_start').val().substr(0, 4)
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			dom: "<'row'<'col-sm-12'tr>>",
			//serverSide: true,
			//order: [2, 'asc'],
			//pageLength: 30,
			drawCallback: function(settings) {
				$('#subjectAnalysis_charts').empty();
				if(settings.dataCache && settings.dataCache.data.length > 0){
					initChart(settings.dataCache.data[0].remainChart, 'remain', '期初金额分析');
					initChart(settings.dataCache.data[0].debitOccChart, 'debitOcc', '借方发生额分析');
					initChart(settings.dataCache.data[0].creditOccChart, 'creditOcc', '贷方发生额分析');
					initChart(settings.dataCache.data[0].balanceChart, 'balance', '期末余额分析');
				}
			},
			/*infoCallback: function(settings) {
				if(settings.dataCache){
					initChart(settings.dataCache.data, 'remain', '期初金额');
					initChart(settings.dataCache.data, 'debitOcc', '借方发生额');
					initChart(settings.dataCache.data, 'creditOcc', '贷方发生额');
					initChart(settings.dataCache.data, 'balance', '期末余额');
				}
			},*/
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '150px'
				}, {
					targets: 2,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '250px'
				}, {
					targets: 3,
					className: 'text-center',
					title: '方向',
					name: 'direction',
					data: 'direction',
					width: '30px'
				}, {
					targets: 4,
					className: 'text-right',
					title: '期初金额',
					name: 'remain',
					data: 'remain',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 5,
					className: 'text-center',
					title: '期初金额占比',
					name: 'remainRate',
					data: 'remainRate',
					width: '30px'
				}, {
					targets: 6,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitOcc',
					data: 'debitOcc',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 7,
					className: 'text-center',
					title: '借方发生额占比',
					name: 'debitOccRate',
					data: 'debitOccRate',
					width: '30px'
				}, {
					targets: 8,
					className: 'text-right',
					title: '贷方发生额',
					name: 'creditOcc',
					data: 'creditOcc',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 9,
					className: 'text-center',
					title: '贷方发生额占比',
					name: 'creditOccRate',
					data: 'creditOccRate',
					width: '30px'
				}, {
					targets: 10,
					className: 'text-right',
					title: '期末余额',
					name: 'balance',
					data: 'balance',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 11,
					className: 'text-center',
					title: '期末余额占比',
					name: 'balanceRate',
					data: 'balanceRate',
					width: '30px'
				}
			]
		}
	};

	BdoDataTable('table_subjectAnalysis', subjectAnalysis_view);

	/** 导出 */
	$('#subjectAnalysis_export').click(function() {
		exportExcelFin(this, '科目结构分析一览', subjectAnalysis_view, 'table_subjectAnalysis');
	});
	
	// 搜索按钮
	$('#subjectAnalysis_search').click(function() {
		var sujectId = $('#subjectAnalysis_subjectid').val();
		var startYear =  $('#subjectAnalysis_start').val().substr(0, 4);
		var endYear =  $('#subjectAnalysis_end').val().substr(0, 4);
		var startMonth =  $('#subjectAnalysis_start').val().substr(5, 6);
		var endMonth =  $('#subjectAnalysis_end').val().substr(5, 6);
		// 校验参数
		if (sujectId == '') {
			bdoInfoBox('提示', '请选择科目');
			return;
		}
		if ($('#subjectAnalysis_start').val() == '') {
			$('#subjectAnalysis_start').focus();
			bdoInfoBox('提示', '请选择开始年月');
			return;
		}
		if ($('#subjectAnalysis_end').val() == '') {
			$('#subjectAnalysis_end').focus();
			bdoInfoBox('提示', '请选择结束年月');
			return;
		}
		if ($('#subjectAnalysis_start').val() > $('#subjectAnalysis_end').val()) {
			$('#subjectAnalysis_start').focus();
			bdoInfoBox('提示', '结束账套年月不能小于开始账套年月');
			return;
		}
		if (startYear != endYear) {
			$('#subjectAnalysis_start').focus();
			bdoInfoBox('提示', '账套年必须是同一年');
			return;
		}
		subjectAnalysis_view.localParam.urlparam.lockYyyy = startYear;
		subjectAnalysis_view.localParam.urlparam.param1 = sujectId;
		subjectAnalysis_view.localParam.urlparam.param2 = startMonth;
		subjectAnalysis_view.localParam.urlparam.param3 = endMonth;
		subjectAnalysis_view.localParam.urlparam.param4 = $('#subjectAnalysis_sort').val();
		BdoDataTable('table_subjectAnalysis', subjectAnalysis_view);
	});
	
	/** echarts */
	function initChart(object, type, typeName) {
		$('#subjectAnalysis_charts').append('<div class="col-sm-6"><div id="chart_' + type + '" style="width:90%;height:450px;"></div></div>');
		checkchart = echarts.init(document.getElementById('chart_' + type));
		chartoption = {
			title: {
				text: typeName,
				x: 'center'
			},
			tooltip: {
				trigger: 'item'/*,
				formatter: function(param) {
					return '<span>' + param.seriesName + '</span><br><span>' + param.name + ' : ' + formatChart(param.value) + '(' + param.percent + '%)</span>';
				}*/
			},
			legend: {
				type: 'scroll',
				orient: 'vertical',
				left: 'left',
				top: 30,
				data: []
			},
			series: [{
				name: typeName,
				type: 'pie',
				radius: '30%',
				center: ['70%', '50%'],
				data: []
			}]
		};
		$.each(object, function(index, info) {
			chartoption.legend.data.push(info.subjectName);
			chartoption.series[0].data.push({
				name: info.subjectName,
				value: info[type]
			});
		});
		checkchart.setOption(chartoption, true);
	}

};
