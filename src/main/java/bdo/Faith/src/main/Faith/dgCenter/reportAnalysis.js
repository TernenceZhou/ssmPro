$(document).ready(function() {
	function ReportAnalysis() {
		uiBlocksApi(false, 'init');

		var quotaType = 1;
		var quotaAnalysisDtos = [];
		var industryDtos = [];
		var quotaAnalysisTitle = '';
		var industryTitle = '';
		var sendType = '';
		$('#analysis_industry').treecombo({
					url : 'cpBase/TreeCommon.findIndustry2Tree.json',
					params : {},
					view : {
						leafIcon : 'fa fa-building text-flat',
						nodeIcon : 'fa fa-bank text-primary-light',
						folderSelectable : true,
						multiSelect : false
					}
				});
		$.ajax({
					type : 'get',
					url : 'finCenter/analysis.findIndustry.json',
					bdolxLoader : false,
					async : false,
					data : {
						param1 : window.CUR_CUSTOMERID,
						param2 : window.CUR_PROJECTID,
						lockProjectId: window.CUR_PROJECTID,
						lockCustomerId: window.CUR_CUSTOMERID,
						lockYyyy: window.CUR_PROJECT_ACC_YEAR
					},
					dataType : 'json',
					success : function(result) {
						if (result.success) {
							var aa = result.data[0].aa;
							var aacode = result.data[0].aacode;
							$('#analysis_industry').treecombo('setTreeComboValue', [aacode, aa]);
						}
					}
				});

		$('#reportAnalysis_slpk2').prev().find('input').attr('id', 'deviceInput'); // 为input增加id属性.
		var findCompnays = function(selectDoc, inputDoc) {
			// 选中的option
			var selectOptions = selectDoc.children('option:selected');
			var companys = selectDoc.val();
			selectDoc.html('');
			var regex = inputDoc;
			selectDoc.append('<option value="' + window.CUR_CUSTOMERID + '">' + window.CUR_CUSTOMERNAME + '</option>');
			ComboSearch(selectOptions, companys, 'cpBase/combo.findCompanys.json', selectDoc, false, {
						'param1' : regex
					}, false);
		};

		var chiPattern = /^[\u4e00-\u9fa5]+$/;
		/*
		 * var findCompanyInterval; var deviceInput1Val = "";
		 * $('#deviceInput').focus(function () { findCompanyInterval =
		 * self.setInterval(function () { if
		 * (chiPattern.test($('#deviceInput').val()) && deviceInput1Val !==
		 * $('#deviceInput').val()) { findCompnays($('#slpk'),
		 * $('#deviceInput').val()); deviceInput1Val = $('#deviceInput').val(); } },
		 * 500); }).blur(function () {
		 * window.clearInterval(findCompanyInterval); });
		 */

		/*
		 * $("#set_save").click(function () {
		 * $("#modal_selectProject").modal("hide");
		 * $("#projectId").val($('#set_projectId').val());
		 * findCompnays($('#slpk'), $('#set_customerId
		 * option:checked').text().split('-')[1]);
		 * $('#slpk').selectpicker('val', $('#set_customerId').val());
		 * $("#analysis_search").trigger('click'); });
		 * $('#set_clear').click(function() {
		 * $('#set_customerId').val('').trigger("change");
		 * $('#set_projectId').val(''); $('#set_auditStartDate').val('');
		 * $('#set_auditEndDate').val(''); });
		 */

		/**
		 * 获取dic表数据(立信板块) 从全局变量（DicJsonlData）中获取 默认升序排列，若参数 isSortDesc 为
		 * true，则为降序
		 */
		ComboDicOptionNew($('#industryQuotaStandardYear'), ComboLocalDicOption(false, 'windIndustryDetailStandard'));
		ComboDicOptionNew($('#industryQuotaStandardPeriod'), ComboLocalDicOption(false, 'windIndustryDetailStandard'));

		// ComboDicOptionNew($('#stockPalteSelect'), ComboDicOption(false,
		// 'GBStockPalte'));

		ComboDicOptionNew($('#stockPalteSelect'), ComboLocalDicOption(false, 'windStockPalte'));

		// 指标选择下拉框
		$.ajax({
					type : 'get',
					url : 'finCenter/analysis.findDefQuotas.json',
					async : false,
					data : {
						menuId : window.sys_menuId,
						lockProjectId: window.CUR_PROJECTID,
						lockCustomerId: window.CUR_CUSTOMERID,
						lockYyyy: window.CUR_PROJECT_ACC_YEAR
					},
					dataType : 'json',
					success : function(result) {
						if (result.success) {
							var quotaOptions = '';
							var length = Object.getOwnPropertyNames(result.data[0]).length;
							for (var i = 1; i <= length + 5; i++) {
								var tmp = result.data[0]['q' + i];
								if (tmp != null) {
									quotaOptions += '<option value="' + 'q' + i + '"> ' + tmp + ' </option>';
								}
							}
							ComboDicOptionNew($('#industryQuotaPeriodSelect'), quotaOptions);
							ComboDicOptionNew($('#industryQuotaYearSelect'), quotaOptions);
							var str = 'q3';
							var arr = str.split(',');
							$('#industryQuotaYearSelect').selectpicker('val', arr);
							$('#industryQuotaPeriodSelect').selectpicker('val', arr);
						}
					}
				});
		ComboDicOptionNew($('#mutiTypePeriodSelect'), ComboLocalDicOption(false, '指标维度'));

		ComboDicOptionNew($('#mutiTypeYearSelect'), ComboLocalDicOption(false, '指标维度'));

		$('#industry_startdate,#industry_enddate').datepicker({
			autoclose: true,
			todayHighlight: true,
			language: 'zh-CN', //语言设置
			format: 'yyyy', //日期显示格式
			minViewMode: 2
		});

		// 设置结束时间必须晚于开始时间
		$('#industry_enddate').datepicker().on('changeDate', function(e) {
					// 获取选取的开始时间))
					var endTimeStart = $('#industry_startdate').val();
					// 设置结束时间
					$('#industry_enddate').datepicker('setStartDate', endTimeStart);
				});

		/** 默认搜索条件 */
		// 客户
		findCompnays($('#reportAnalysis_slpk2'), window.CUR_CUSTOMERNAME);
		// 默认选中行业

		$('#cusId').html(window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);
		$('#analysis_period').val('1');
		$('#industry_enddate').datepicker('setDate', window.CUR_PROJECT_END_YEAR);
		$('#industry_startdate').datepicker('setDate', (parseInt(window.CUR_PROJECT_END_YEAR) - 3).toString());
		$('#totalValue_max').val(10000);
		$('#totalValue_min').val(0);
		var industryTableId = 'industryByYear_table';
		$('#industryQuotaStandardYear').selectpicker('val', '3,10');
		$('#industryQuotaStandardPeriod').selectpicker('val', '3,10');
		$('#stockPalteSelect').selectpicker('val', '3');

		/** 监管消息table 属性 */
		var superviewMsg_view = {
			localParam : {
				tabNum : true,
				url : 'finCenter/analysis.getSuperViewMsg.json',
				urlparam : {
					menuId : window.sys_menuId,
					lockCustomerId : '',
					param2 : '',
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR
				}
			},
			tableParam : {
				select : true,
				lengthChange : false,
				dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				ordering : true,
				order : [4, 'DESC'],
				serverSide : true,
				columnDefs : [{
							targets : 1,
							className : 'text-center',
							title : '编号',
							visible : false,
							name : 'autoId',
							data : 'autoId',
							width : '100px'
						}, {
							targets : 2,
							className : 'text-center',
							title : '类型',
							name : 'zjhtype',
							data : 'zjhtype',
							width : '50px'
						}, {
							targets : 3,
							className : 'text-center',
							title : '标题',
							name : 'title',
							data : 'title',
							width : '150px'
						}, {
							targets : 4,
							className : 'text-center',
							title : '时间',
							name : 'QTime',
							data : 'QTime',
							width : '50px'
						}, {
							targets : 5,
							className : 'text-left',
							title : '原件',
							name : 'url',
							data : 'url',
							width : '150px',
							render : function(data, type, row, meta) {
								return '<a href="#" onclick="viewZJHFile(\'' + data + '\');">' + data + '</a>';
							}
						}]
			}
		};

		var abstractTableId = 'abstractByYear_table';
		var quotaTableId = 'quotaByYear_table';
		var duPontTableId = 'duPontforYear';
		var chartsTableId = 'chartsProfitForYear';

		// 选项卡被选中时生成相关表格
		$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
					// 获取已激活的标签页的tableId
					var tableId = $(e.target).attr('tableId');
					if (tableId == null) {
						return;
					}
					// 摘要数据tab
					if (tableId.indexOf('abstract') >= 0) {
						abstractTableId = tableId;
						createTab(tableId);
					}
					// 单公司指标分析tab
					if (tableId.indexOf('quota') >= 0) {
						quotaTableId = tableId;
						createTab(tableId);
					}
					// 行业指标分析tab
					if (tableId.indexOf('industry') >= 0) {
						industryTableId = tableId;
						createTab2(tableId);
					}
					// 杜邦分析tab
					if (tableId.indexOf('duPont') >= 0) {
						duPontTableId = tableId;
						createTab(tableId);
					}
					// 指标分析
					if (tableId.indexOf('charts') >= 0) {
						chartsTableId = tableId;
						createTab(tableId);
					}
					// 指标分析
					if (tableId.indexOf('analysis') >= 0) {
						// createTab(tableId);
						var innerTableId = $('#' + tableId).find('ul li.active').children().attr('tableId');
						$('#' + tableId).find('ul li.active').children().tab('show');
						chartsTableId = innerTableId;
						createTab(chartsTableId);
					}
				});

		/*
		 * 生成tab
		 */
		var createTab = function(tableId) {
			// 立信数据不支持按季度
			if (tableId.indexOf('Period') > 0 && parseInt($('#reportAnalysis_slpk2').val()) > 10000000) {
				return;
			}
			// 非杜邦分析 删除原table
			/*
			 * if (tableId.indexOf('duPont') < 0) { if ($('#' +
			 * tableId).hasClass('dataTable')) { var wrapper = $('#' + tableId +
			 * "_wrapper"); var content = wrapper.parent(); var newTable = '<table
			 * id="' + tableId + '" class="table table-bordered table-striped
			 * table-hover"> </table>'; content.append(newTable);
			 * wrapper.remove(); } }
			 */
			var startdate = $('#industry_startdate').val();
			var enddate = $('#industry_enddate').val();
			if ($('#reportAnalysis_slpk2').val() === null || $('#reportAnalysis_slpk2').val() === '') {
				bdoErrorBox('错误', '请选择公司');
				return;
			}
			if (startdate === null || startdate === '') {
				bdoErrorBox('错误', '开始时间不能为空!');
				return;
			}
			if (enddate === null || enddate === '') {
				bdoErrorBox('错误', '结束时间不能为空!');
				return;
			}
			if (startdate !== '' && enddate !== '' && startdate >= enddate) {
				bdoErrorBox('错误', '开始时间不能大于结束时间!');
				return;
			}
			/** 摘要数据table 属性 */
			var abstract_view = {
				localParam : {
					tabNum : false,
					url : '',
					urlparam : {
						menuId : window.sys_menuId,
						param1 : '',
						param2 : '',
						param3 : '',
						param4 : ''
					}
				},
				tableParam : {
					select : true,
					lengthChange : true,
					dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
					ordering : false,
					order : [1, 'ASC'],
					serverSide : true,
					columnDefs : []
				}
			};
			var periodStandard = '';
			// 如果包含period 发送param3为1
			if (tableId.indexOf('Period') > 0) {
				periodStandard = '1';
			}
			// year 发送param3为2
			if (tableId.indexOf('Year') > 0) {
				periodStandard = '2';
			}
			// 生成table cloumn 以及param
			var tmpParam = [];
			abstract_view.localParam.url = '';
			abstract_view.tableParam.columnDefs = [];
			/* 报表数据 */

			if (tableId.indexOf('abstract') >= 0) {
				abstract_view.tableParam.columnDefs.push({
							targets : 1,
							orderable : false,
							className : 'text-left',
							title : '项目',
							name : 'programName',
							data : 'programName',
							width : '250px',
							visible : true,
							render : function(data, type, row, meta) {
								if (2 === row.isTitle) {
									return '<strong>' + data + '</strong>';
								}
								return data;
							}
						});
			}
			/* 主要指标 */
			if (tableId.indexOf('quota') >= 0) {
				abstract_view.tableParam.columnDefs.push({
							targets : 1,
							orderable : false,
							className : 'text-left',
							title : '项目',
							name : 'programName',
							data : 'programName',
							width : '250px',
							visible : true,
							render : function(data, type, row, meta) {
								if (2 === row.isTitle) {
									return '<strong>' + data + '</strong>';
								}
								return '<span class="text-center" data-toggle="popover" onmouseover="showFormulaChi(this,'
										+ '\''
										+ row.formulaChi
										+ '\''
										+ ')" onmouseleave="hideFormulaChi(this,'
										+ '\''
										+ row.formulaChi + '\'' + ')">' + data + '</span>';
							}
						}
				);
			}
			abstract_view.tableParam.columnDefs.push({
						targets : 2,
						name : 'programId',
						data : 'programId',
						visible : false
					});
			abstract_view.tableParam.columnDefs.push({
						targets : 3,
						name : 'isTitle',
						data : 'isTitle',
						visible : false
					});
			abstract_view.tableParam.columnDefs.push({
						targets : 3,
						name : 'formulaChi',
						data : 'formulaChi',
						visible : false,
						render : function(data, type, row, meta) {
							var renderStr = '';

							renderStr += data + '';

							return renderStr;
						}
					});
			$.ajax({
				type : 'get',
				url : 'finCenter/analysis.findPeriods.json',
				bdolxLoader : false,
				dataType : 'json',
				data : {
					param1 : $('#industry_startdate').val(),
					param2 : $('#industry_enddate').val(),
					param3 : periodStandard,
					param5 : '1',
					param6 : $('#analysisYearType').val(),
					lockProjectId: window.CUR_PROJECTID,
					lockCustomerId: window.CUR_CUSTOMERID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR
				},
				success : function(data) {
					if (data.success) {

						// 如果是杜邦分析tab则生成链接按钮
						var proejectId = $('#projectId').val();
						if (tableId.indexOf('duPont') >= 0) {
							// 生成按钮
							$('#duPontDateUl').children().html('');
							for (var i = 0; i < data.data.length; i++) {
								var map = data.data[i];
								$.each(map, function(key, value) {
									$('#duPontDateUl')
											.children()
											.append('<button type="button" class="btn btn-default btn-sm duPontButton" >'
													+ key + '</button>&nbsp;&nbsp;');
								}
								);
							}
							if (proejectId !== null && proejectId !== '') {
								$('#duPontDateUl')
										.children()
										.append('<button type="button" class="btn btn-default btn-sm duPontButton" >未审报表</button>&nbsp;&nbsp;');
								$('#duPontDateUl')
										.children()
										.append('<button type="button" class="btn btn-default btn-sm duPontButton" >审定报表</button>&nbsp;&nbsp;');
							}
							var content = $('#duPontContent');
							content.css('display', 'block');
							var tab = $('#' + tableId);
							tab.html('');
							tab.append(content.clone());
							content.remove();
							$('.duPontButton').click(function() {
										var reportDate = $(this).text();
										showDupont(reportDate);
										$('.duPontButton').removeClass('btn-success');
										$('.duPontButton').addClass('btn-default');
										$(this).addClass('btn-success');
									});
							$('.duPontButton').last().trigger('click');
						} else if (tableId.indexOf('charts') >= 0) {

							// 指标分析
							for (var i = 0; i < data.data.length; i++) {
								var map = data.data[i];
								$.each(map, function(key, value) {
											tmpParam[i] = key;
										});
							}
							var paramStr = tmpParam.join(',').toString();
							if (proejectId != null && proejectId !== '') {
								tmpParam.push('未审报表');
								tmpParam.push('审定报表');
							}
							quotaAnalysisDtos = []; // 先清空
							quotaAnalysisTitle = '指标分析';
							if (tableId.indexOf('Period') >= 0) {
								quotaAnalysisTitle = quotaAnalysisTitle + '-按季度';
							} else if (tableId.indexOf('Year') >= 0) {
								quotaAnalysisTitle = quotaAnalysisTitle + '-按年度';
							}
							if (tableId.indexOf('Profit') >= 0) {
								quotaType = 1;
								quotaAnalysisTitle = quotaAnalysisTitle + '-经营业绩';
							} else if (tableId.indexOf('Balance') >= 0) {
								quotaType = 2;
								quotaAnalysisTitle = quotaAnalysisTitle + '-资产状况';
							} else if (tableId.indexOf('Cash') >= 0) {
								quotaType = 3;
								quotaAnalysisTitle = quotaAnalysisTitle + '-现金流';
							}
							$.ajax({
										type : 'get',
										url : 'finCenter/analysis.getChartsData.json',
										bdolxLoader : false,
										dataType : 'json',
										data : {
											lockCustomerId : $('#reportAnalysis_slpk2').val(),
											// param1:
											// $('#reportAnalysis_slpk2').val(),
											param2 : paramStr,
											param3 : tableId,
											param4 : periodStandard,
											// param5: proejectId
											lockProjectId : proejectId,
											lockYyyy: window.CUR_PROJECT_ACC_YEAR
										},
										success : function(data) {

											if (data.success) {
												// 清除tableId
												var doc = $('#' + tableId);
												// doc.html('');
												$('#chartsTabContent').find('.block-content.row').empty();
												// 封装数据
												for (var i = 0; i < data.data.length; i++) {
													var legendData = [];

													var xAxisData = tmpParam;
													var seriesData = [];
													var yAxisData = [];
													var selectedField = {};
													var tmpChartData = data.data[i];
													var tmpId = tableId + i;
													doc.append('<div id="' + tmpId + '" style="width: '
															+ tmpChartData.width + 'px;height: ' + tmpChartData.height
															+ 'px" class="col-sm-3 col-xs-3"></div>');
													for (var j = 0; j < tmpChartData.dataList.length; j++) {
														var tmpInnerData = tmpChartData.dataList[j];
														legendData.push(tmpInnerData.field);
														if (j <= 2) {
															selectedField[tmpInnerData.field] = true;
														} else {
															selectedField[tmpInnerData.field] = false;
														}
														yAxisData.push({
																	type : 'value',
																	show : false
																});
														var tmpData = [];
														for (var k = 0; k < tmpInnerData.data.length; k++) {
															tmpData.push(parseFloat(tmpInnerData.data[k]));
														}
														var magicType = tmpInnerData.magicType;
														var tmpSeries = {
															name : tmpInnerData.field,
															type : magicType,
															stack : tmpInnerData.stock,
															data : tmpData,
															yAxisIndex : j,
															label : {
																normal : {
																	show : true,
																	position : 'top'
																}
															},
															barMaxWidth : '80',
															barGap : '30%'
														};
														if ('line' === magicType || tmpInnerData.stock !== '') {
															// 折线图不显示数据
															tmpSeries.label.normal.show = false;
														}
														if ('bar' === magicType) {
															// 柱状图公用同Y轴
															tmpSeries.yAxisIndex = 0;
														}
														seriesData.push(tmpSeries);
													}
													// 第一个y轴显示
													yAxisData[0].show = true;
													var option = {
														title : {
															text : tmpChartData.chartName + '(单位:亿)'
														},
														grid : {
															top : '20%'
														},
														tooltip : {
															show : true,
															trigger : 'axis'
														},
														legend : {
															x : '50',
															data : legendData,
															selected : selectedField,
															y : '10%'
														},
														toolbox : {
															show : true,
															feature : {
																restore : {
																	show : true
																}
															}
														},
														calculable : true,
														xAxis : {
															type : 'category',
															data : xAxisData,
															axisLabel : {
																interval : 0,// 横轴信息全部显示
																rotate : -30
																// -30度角倾斜显示
															}
														},
														yAxis : yAxisData,
														series : seriesData
													};
													var tmpChart = echarts.init(document.getElementById(tmpId));
													// 使用刚指定的配置项和数据显示图表。
													tmpChart.setOption(option);
													getThirdPartyChartListDtos(quotaAnalysisDtos, option,
															option.title.text
													);
												}
											}
										}
									});
						} else {
							// 摘要数据和指标展示
							tmpParam = new Array(data.data.length);
							for (var i = 0; i < data.data.length; i++) {
								var map = data.data[i];
								$.each(map, function(key, value) {
											tmpParam[i] = key;
											abstract_view.tableParam.columnDefs.push({
														targets : i + 4,
														orderable : false,
														className : 'text-right',
														title : key,
														name : key,
														data : key,
														visible : true,
														render : function(data, type, row, meta) {
															// 当前数
															var thisData = data;
															var beData;
															// 获取上一个索引的值
															var beIndex = meta.col - 1;
															if (beIndex <= 3) {
																// 上一个索引所在列非含有值的列
																return thisData;
															} else {
																// 上一个索引所在列含有值
																// 取出该值进行比较
																var tmpFiled = meta.settings.aoColumns[beIndex].name;
																beData = row[tmpFiled];
																// 比较前后结果
																return compareData(thisData, beData);
															}
														}
													});
										});
							}
							if (proejectId != null && proejectId !== '') {

								abstract_view.tableParam.columnDefs.push({
											targets : data.data.length + 4,
											orderable : false,
											className : 'text-right',
											title : '未审报表',
											name : '未审报表',
											data : '未审报表',
											visible : true,
											render : function(data, type, row, meta) {
												// 当前数
												var thisData = data;
												var beData;
												// 获取上一个索引的值
												var beIndex = meta.col - 1;
												if (beIndex <= 3) {
													// 上一个索引所在列非含有值的列
													return thisData;
												} else {
													// 上一个索引所在列含有值
													// 取出该值进行比较
													var tmpFiled = meta.settings.aoColumns[beIndex].name;
													beData = row[tmpFiled];
													// 比较前后结果
													return compareData(thisData, beData);
												}
											}
										});
								abstract_view.tableParam.columnDefs.push({
											targets : data.data.length + 5,
											orderable : false,
											className : 'text-right',
											title : '审定报表',
											name : '审定报表',
											data : '审定报表',
											visible : true,
											render : function(data, type, row, meta) {
												// 当前数
												var thisData = data;
												var beData;
												// 获取上一个索引的值
												var beIndex = meta.col - 1;
												if (beIndex <= 3) {
													// 上一个索引所在列非含有值的列
													return thisData;
												} else {
													// 上一个索引所在列含有值
													// 取出该值进行比较
													var tmpFiled = meta.settings.aoColumns[beIndex].name;
													beData = row[tmpFiled];
													// 比较前后结果
													return compareData(thisData, beData);
												}
											}
										});
							}
							paramStr = tmpParam.join(',').toString();
							// 参数设置
							abstract_view.localParam.urlparam.param1 = paramStr;
							// abstract_view.localParam.urlparam.param2
							// =
							// $('#reportAnalysis_slpk2').val();
							abstract_view.localParam.urlparam.lockCustomerId = $('#reportAnalysis_slpk2').val();
							// abstract_view.localParam.urlparam.param4
							// =
							// proejectId;
							abstract_view.localParam.urlparam.lockProjectId = proejectId;
							// 请求路径设置
							if (tableId.indexOf('abstract') >= 0) {
								abstract_view.localParam.url = 'finCenter/analysis.getAbstractData.json';
							}
							if (tableId.indexOf('quota') >= 0) {
								abstract_view.localParam.url = 'finCenter/analysis.getQuotaData.json';
								abstract_view.localParam.urlparam.param3 = periodStandard;
							}

							BdoDataTable(tableId, abstract_view);
							$('#' + tableId).unbind();
							/** 行单击 选中 */
							$('#' + tableId).on('click', 'tr', function() {
										// 使摘要table数据中programId为公式相关数据的行颜色改变
										// $('#' +
										// abstractTableId).dataGridView.Columns[""].DefaultCellStyle.BackColor
										// = Color.Red;
										// 单击选中
										// var object = $('#' +
										// tableId).DataTable().data()[$(this).closest('tr').index()];
										$(this).toggleClass('selected');
									});
							/** 行双击 生成单表 */
							$('#' + tableId).on('dblclick', 'tr', function() {
										var object = $('#' + tableId).DataTable().data()[$(this).closest('tr').index()];
										if (object.isTitle === 2) {
											return;
										}
										var objectArr = [];
										objectArr.push(object);
										createChart(objectArr, 'abstractRemix');
									}
							);
							if (tableId.indexOf('abstract')) {
								$('#abstractRemix').unbind();
								$('#abstractRemix').click(function() {
											var objectArr = $('#' + abstractTableId).DataTable().rows('.selected')
													.data();
											if (objectArr.length === 0) {
												bdoErrorBox('错误', '请至少选择一行数据');
												return;
											}
											if (objectArr.length > 3) {
												bdoErrorBox('错误', '请至多选择三行数据');
												return;
											}
											createChart(objectArr, 'abstractRemix');
										}
								);
							}
							if (tableId.indexOf('quota')) {
								$('#quotaRemix').unbind();
								/**
								 * 多行图表
								 */
								$('#quotaRemix').click(function() {

											var objectArr = $('#' + quotaTableId).DataTable().rows('.selected').data();
											if (objectArr.length === 0) {
												bdoErrorBox('错误', '请至少选择一个指标');
												return;
											}
											if (objectArr.length > 3) {
												bdoErrorBox('错误', '请至多选择三个指标');
												return;
											}
											createChart(objectArr);
										});
							}
						}
					}
				}
			}
			);
		};

		// 比较前后索引上的数据
		var compareData = function(thisData, beData) {
			var thisDataF = parseFloat(thisData);
			var beDataF = parseFloat(beData);
			if (thisDataF != null && beDataF != null) {
				// 如果单位存在'万'的除以10000
				if (thisData != null && thisData.indexOf('万') > 0) {
					thisDataF = thisDataF / 10000.0;
				}
				if (beData != null && beData.indexOf('万') > 0) {
					beDataF = beDataF / 10000.0;
				}
				// 该索引值小于上个索引 减少 加下箭头加红
				if (thisDataF < beDataF) {
					return '<span style="color: red">' + thisData + '  ↓' + '</span>';
				} else if (thisDataF > beDataF) {
					return '<span style="color: green">' + thisData + '  ↑' + '</span>';
				} else {
					return thisData;
				}
			}
		};

		// 生成杜邦数据
		var showDupont = function(reportDate) {
			var companyId = $('#reportAnalysis_slpk2').val();
			if (companyId === null || companyId === '') {
				bdoErrorBox('错误', '请选择公司');
				return;
			}
			$.ajax({
						type : 'get',
						url : 'finCenter/analysis.findDuPontDate.json',
						bdolxLoader : false,
						dataType : 'json',
						data : {
							lockCustomerId : companyId,
							// param1: companyId,
							param2 : reportDate,
							// param3: $('#projectId').val()
							lockProjectId : $('#projectId').val(),
							lockYyyy: window.CUR_PROJECT_ACC_YEAR
						},
						success : function(data) {
							if (data.success) {
								var map = data.data[0];
								$.each(map, function(key, value) {
											$('#' + key).text('');
											$('#' + key).text(value);
										});
							} else {
								$('#duPontContent').find('p').text('-');
							}
						}
					});
		};

		var quotaChart;
		/**
		 * echart生成
		 * 
		 * @param object
		 */
		var createChart = function(objectArr, buttonId) {
			var legendData = [];
			var seriesDataArr = [];
			var xAxisDataFin = [];
			var yAxisData = [];
			var yShow = true;
			if (objectArr.length > 1) {
				yShow = false;
			}
			for (var k = 0; k < objectArr.length; k++) {
				var object = objectArr[k];
				legendData.push(object.programName.replace(/-/g, ''));
				var seriesData = [];
				var xAxisData = [];
				$.each(object, function(key, value) {
							if (key !== 'programName' && key !== 'programId' && key !== 'isTitle'
									&& key !== 'formulaChi') {
								if (value !== '-') {
									value = parseFloat(value);
									seriesData.push(value.toFixed(3));
								} else {
									seriesData.push(null);
								}
								xAxisData.push(key);
							}
						});
				var minYData = parseFloat(seriesData[0]);
				var maxYdata = parseFloat(seriesData[0]);
				for (var i = 0; i < seriesData.length; i++) {
					tmp = parseFloat(seriesData[i]);
					if (minYData === null) {
						minYData = tmp;
					}
					if (maxYdata === null) {
						maxYdata = tmp;
					}
					if (minYData > tmp && tmp !== null) {
						minYData = tmp;
					}
					if (maxYdata < tmp && tmp !== null) {
						maxYdata = tmp;
					}
				}
				var min = (minYData - (maxYdata - minYData) * 0.1).toFixed(2);
				// 冒泡排序
				for (var i = 0; i < xAxisData.length; i++) {
					// 将为0的数据设置为最小值以不显示
					for (var j = i + 1; j < xAxisData.length; j++) {
						if (xAxisData[i] > xAxisData[j]) {
							var tmp1 = xAxisData[i];
							var tmp2 = seriesData[i];
							xAxisData[i] = xAxisData[j];
							seriesData[i] = seriesData[j];
							xAxisData[j] = tmp1;
							seriesData[j] = tmp2;
						}
					}
				}
				// x轴值设定
				if (k === 0) {
					xAxisDataFin = xAxisData;
				}
				// y轴设定
				yAxisData.push({
							type : 'value',
							min : min,
							show : yShow
						});
				// 数据设定
				seriesDataArr.push({
							name : object.programName.replace(/-/g, ''),
							type : 'line',
							data : seriesData,
							markPoint : {
								data : [{
											type : 'max',
											name : '最大值'
										}, {
											type : 'min',
											name : '最小值'
										}]
							},
							markLine : {
								data : [{
											type : 'average',
											name : '平均值'
										}]
							},
							yAxisIndex : 0
						});
			}
			// 指定图表的配置项和数据
			var option = {
				title : {
					text : '指标图表分析'
				},
				tooltip : {
					show : true,
					trigger : 'axis'
				},
				legend : {
					data : legendData
				},
				xAxis : {
					data : xAxisDataFin,
					axisLabel : {
						interval : 0,// 横轴信息全部显示
						rotate : -15
						// -30度角倾斜显示
					},
					type : 'category',
					boundaryGap : false
				},
				calculable : true,
				toolbox : {
					show : true,
					feature : {
						mark : {
							show : true
						},
						dataView : {
							show : true,
							readOnly : false
						},
						magicType : {
							show : true,
							type : ['line', 'bar']
						},
						restore : {
							show : true
						},
						saveAsImage : {
							show : true
						}
					}
				},
				yAxis : yAxisData,
				series : seriesDataArr
			};
			// 基于准备好的dom，初始化echarts实例
			if (quotaChart !== null && quotaChart !== '' && quotaChart !== undefined) {
				quotaChart.dispose();
			}
			quotaChart = echarts.init(document.getElementById('quotaChart'));
			// 使用刚指定的配置项和数据显示图表。
			quotaChart.setOption(option);

			$('#modal_quota').modal('show');

		};

		// 重置按钮
		$('#analysis_clear').click(function() {

					$('#industry_startdate').datepicker('setDate', window.CUR_PROJECT_END_YEAR - 3);
					$('#industry_enddate').datepicker('setDate', window.CUR_PROJECT_END_YEAR);
				});

		/** 检索条件设置 */
		function getQueryparam() {
			var companyIds = [];
			companyIds.push($('#reportAnalysis_slpk2').val());
			return JSON.stringify({
						companyid : companyIds,
						reportType : ['1', '2', '3'],
						monoOrMerge : ['1'],
						period : $('#analysis_period').val(),
						startdate : $('#industry_startdate').val(),
						enddate : $('#industry_enddate').val()
					});
		}

		function viewZJHFile(path) {
			window.open(path);
		}

		// 搜索行业均值/** 搜索按钮 */
		$('#industry_search').click(function() {

					var result = $('#analysis_industry').attr('data-result');
					if (result == null || result == '') {
						bdoErrorBox('错误', '请选择行业');
						return;
					}
					if (result === 'classStandard') {
						bdoErrorBox('错误', '请选择具体行业');
						return;
					}
					var palte = $('#stockPalteSelect').val();
					if (result.indexOf('GB') > 0 && palte <= 2) {
						bdoErrorBox('错误', '抱歉,立信行业分类不支持万得板块数据!');
						return;
					}
					if (result.indexOf('GB') < 0 && palte > 2) {
						bdoErrorBox('错误', '抱歉,非立信行业不支持立信板块数据!');
						return;
					}
					if (result.length > 10 && palte != 1) {
						bdoErrorBox('错误', '抱歉,万得行业分类暂时仅支持万得A股板块数据!');
						return;
					}

					var startdate = $('#industry_startdate').val();
					var enddate = $('#industry_enddate').val();
					if (startdate === null || startdate === '') {
						bdoErrorBox('错误', '开始时间不能为空!');
						return;
					}
					if (enddate === null || enddate === '') {
						bdoErrorBox('错误', '结束时间不能为空!');
						return;
					}
					$('#projectId').val(window.CUR_PROJECTID);
					findCompnays($('#reportAnalysis_slpk2'), window.CUR_CUSTOMERNAME);
					$('#reportAnalysis_slpk2').selectpicker('val', window.CUR_CUSTOMERID);
					analysisSearch();
					createTab2(industryTableId);
				});

		var industryQuotaSelect1 = 'industryQuotaYearSelect';
		var industryQuotaSelect2 = 'industryQuotaPeriodSelect';

		$('#' + industryQuotaSelect1).unbind('change.a');
		$('#' + industryQuotaSelect1).bind('change.a', function() {
					createTab2(industryTableId);
				});
		$('#' + industryQuotaSelect2).unbind('change.a');
		$('#' + industryQuotaSelect2).bind('change.a', function() {
					createTab2(industryTableId);
				});

		function analysisSearch() {
			if ($('#reportAnalysis_slpk2').val() === null || $('#reportAnalysis_slpk2').val() === '') {
				bdoErrorBox('错误', '请选择公司');
				return;
			}

			var startdate = $('#industry_startdate').val();
			var enddate = $('#industry_enddate').val();
			if (startdate === null || startdate === '') {
				bdoErrorBox('错误', '开始时间不能为空!');
				return;
			}
			if (enddate === null || enddate === '') {
				bdoErrorBox('错误', '结束时间不能为空!');
				return;
			}
			if (startdate !== '' && enddate !== '' && startdate >= enddate) {
				bdoErrorBox('错误', '开始时间不能大于结束时间!');
				return;
			}
			// 生成一览表

			$('#analysis_table').html('');

			/** 行双击 */
			$('#analysis_table tbody').unbind();
			$('#analysis_table tbody').on('dblclick', 'tr', function() {
						var object = $('#analysis_table').DataTable().data()[$(this).closest('tr').index()];
						$('#modal_reportDetail').modal('show');
						var count = 1;
						$('#modal_reportDetail').on('shown.bs.modal', function() {
									if (count++ === 1) {
										// 报表名称
										$('#detailHead').html();
										$('#detailHead').html(object.reportName);
										// 参数
										detail_view.localParam.urlparam.param1 = object.reportType;
										detail_view.localParam.urlparam.param2 = object.id;
										var arr = [object.companyid, object.monoOrMerge, object.reportDate];
										detail_view.localParam.urlparam.param3 = arr.join(',');
										$('#analysisDetail_table').html('');
										BdoDataTable('analysisDetail_table', detail_view);
									}
								});
					});
			createTab(abstractTableId);
			createTab(quotaTableId);
			createTab(duPontTableId);
			createTab(chartsTableId);

		}

		// 行业指标数据tab生成
		var createTab2 = function(tableId) {

			var result = $('#analysis_industry').attr('data-result');
			if (result == null || result == '') {
				bdoErrorBox('错误', '请选择行业');
				return;
			}
			if (result === 'classStandard') {
				bdoErrorBox('错误', '请选择具体行业');
				return;
			}
			var palte = $('#stockPalteSelect').val();
			if (result.indexOf('GB') > 0 && palte <= 2) {
				bdoErrorBox('错误', '抱歉,立信行业分类不支持万得板块数据!');
				return;
			}
			if (result.indexOf('GB') < 0 && palte > 2) {
				bdoErrorBox('错误', '抱歉,非立信行业不支持立信板块数据!');
				return;
			}
			if (result.length > 10 && palte != 1) {
				bdoErrorBox('错误', '抱歉,万得行业分类暂时仅支持万得A股板块数据!');
				return;
			}

			if (result.indexOf('GB') > 0 && tableId.indexOf('Period') > 0) {
				bdoErrorBox('错误', '抱歉,立信数据暂时不支持按季度查看!');
				return;
			}
			var startdate = $('#industry_startdate').val();
			var enddate = $('#industry_enddate').val();
			if (startdate === null || startdate === '') {
				bdoErrorBox('错误', '开始时间不能为空!');
				return;
			}
			if (enddate === null || enddate === '') {
				bdoErrorBox('错误', '结束时间不能为空!');
				return;
			}
			var mutiTypeSelect = '';
			var industryQuotaSelect = '';
			var periodStandard = '';
			var industryDateUl = '';
			var quotaIndustryChart = '';
			var industryQuotaStandard = '';
			var detailQuotaIndustryTable = '';
			var quotaDetailIndustryChart = '';
			var companysDateUl = '';
			var detailQuotaCompanysTable = '';
			var quotaDetailCompanysChart = '';
			var chartsIndustry = '';
			// 如果包含period 发送param3为1
			if (tableId.indexOf('Period') > 0) {
				periodStandard = '1';
				industryDateUl = 'industryPeriodDateUl';
				quotaIndustryChart = 'quotaIndustryPeriodChart';
				industryQuotaSelect = 'industryQuotaPeriodSelect';
				industryQuotaStandard = 'industryQuotaStandardPeriod';
				detailQuotaIndustryTable = 'detailQuotaIndustryTablePeriod';
				quotaDetailIndustryChart = 'quotaDetailIndustryPeriodChart';
				companysDateUl = 'companysPeriodDateUl';
				detailQuotaCompanysTable = 'detailQuotaCompanysTablePeriod';
				quotaDetailCompanysChart = 'quotaDetailCompanysPeriodChart';
				mutiTypeSelect = 'mutiTypePeriodSelect';
				chartsIndustry = 'chartsIndustryForPeriod';
				industryTitle = '行业指标数据-按季度';
			}
			// year 发送param3为2
			if (tableId.indexOf('Year') > 0) {
				periodStandard = '2';
				industryDateUl = 'industryYearDateUl';
				quotaIndustryChart = 'quotaIndustryYearChart';
				industryQuotaSelect = 'industryQuotaYearSelect';
				industryQuotaStandard = 'industryQuotaStandardYear';
				detailQuotaIndustryTable = 'detailQuotaIndustryTableYear';
				quotaDetailIndustryChart = 'quotaDetailIndustryYearChart';
				companysDateUl = 'companysYearDateUl';
				detailQuotaCompanysTable = 'detailQuotaCompanysTableYear';
				quotaDetailCompanysChart = 'quotaDetailCompanysYearChart';
				mutiTypeSelect = 'mutiTypeYearSelect';
				chartsIndustry = 'chartsIndustryForYear';
				industryTitle = '行业指标数据-按年度';
			}
			var currentQuota = $('#' + industryQuotaSelect).val();
			if (currentQuota === null || currentQuota === '') {
				return;
			}
			var aa = window.CUR_PROJECT_END_YEAR + '-12-31';
			// 生成按钮 对指标选择select绑定图形化方法
			$.ajax({
				type : 'get',
				url : 'finCenter/analysis.findPeriods.json',
				bdolxLoader : false,
				dataType : 'json',
				data : {
					param1 : startdate,
					param2 : enddate,
					param3 : periodStandard,
					param4 : '1',
					param5 : '1',
					param6 : $('#analysisYearType').val(),
					lockProjectId: window.CUR_PROJECTID,
					lockCustomerId: window.CUR_CUSTOMERID,
					lockYyyy: window.CUR_PROJECT_ACC_YEAR
				},
				success : function(data) {
					if (data.success) {
						// $(".industryQuota").remove();
						// $(".companysQuota").remove();
						$('#' + companysDateUl).children().html('');
						$('#' + industryDateUl).children().html('');
						var dates = [];
						var quotaColumnName = $('#' + industryQuotaSelect).val();
						var quotaName = $('#' + industryQuotaSelect).children('option:selected').text();
						var mutiType = $('#' + mutiTypeSelect).val();
						var mutiTypeName = $('#' + mutiTypeSelect).children('option:selected').text();
						for (var i = 0; i < data.data.length; i++) {
							$.each(data.data[i], function(key) {
										$('#' + industryDateUl)
												.children()
												.append('<button type="button" class="btn btn-default btn-sm industryQuota'
														+ periodStandard + '" >' + key + '</button>&nbsp;&nbsp;');
										$('#' + companysDateUl)
												.children()
												.append('<button type="button" class="btn btn-default btn-sm companysQuota'
														+ periodStandard + '" >' + key + '</button>&nbsp;&nbsp;');
										dates.push(key);
									}
							);
						}
						$('.industryQuota' + periodStandard).click(function() {
							var reportDate = $(this).text();
							industrChar2.showDetail(reportDate, industryQuotaSelect, industryQuotaStandard,
									periodStandard, detailQuotaIndustryTable, quotaDetailIndustryChart
							);
							$('.industryQuota' + periodStandard).removeClass('btn-success');
							$('.industryQuota' + periodStandard).addClass('btn-default');
							$(this).addClass('btn-success');
						}
						);
						$('.companysQuota' + periodStandard).click(function() {

							var reportDate = $(this).text();
							industrChar2.showCompanysQuota(reportDate, periodStandard, detailQuotaCompanysTable,
									quotaDetailCompanysChart, industryQuotaSelect
							);
							$('.companysQuota' + periodStandard).removeClass('btn-success');
							$('.companysQuota' + periodStandard).addClass('btn-default');
							$(this).addClass('btn-success');
						}
						);
						$('#' + industryQuotaSelect).unbind('change.a');
						$('#' + industryQuotaSelect).bind('change.a', function() {
							var quotaColumnName = $('#' + industryQuotaSelect).val();
							var quotaName = $('#' + industryQuotaSelect).children('option:selected').text();
							var mutiType = $('#' + mutiTypeSelect).val();
							var mutiTypeName = $('#' + mutiTypeSelect).children('option:selected').text();
							// 找到行业指标的最大值 最小值 中值 均值 需要传入的参数 指标列名
							// 行业代码 日期
							// 标准
							industrChar2.createIndustryQuotaChart(quotaColumnName, quotaName, dates, periodStandard,
									quotaIndustryChart, mutiType, mutiTypeName, chartsIndustry
							);
							$('.industryQuota' + periodStandard + '.btn-success').trigger('click');
							$('.companysQuota' + periodStandard + '.btn-success').trigger('click');
						}
						);
						$('#' + mutiTypeSelect).unbind('change.a');
						$('#' + mutiTypeSelect).bind('change.a', function() {
							var quotaColumnName = $('#' + industryQuotaSelect).val();
							var quotaName = $('#' + industryQuotaSelect).children('option:selected').text();
							if (quotaColumnName.length === 1) {
								return;
							}
							var mutiType = $('#' + mutiTypeSelect).val();
							var mutiTypeName = $('#' + mutiTypeSelect).children('option:selected').text();
							// 找到行业指标的最大值 最小值 中值 均值 需要传入的参数 指标列名
							// 行业代码 日期 标准
							industrChar2.createIndustryQuotaChart(quotaColumnName, quotaName, dates, periodStandard,
									quotaIndustryChart, mutiType, mutiTypeName, chartsIndustry
							);
						}
						);
						$('#' + industryQuotaStandard).unbind('change.a');
						$('#' + industryQuotaStandard).bind('change.a', function() {
									$('.industryQuota' + periodStandard + '.btn-success').trigger('click');
									$('.companysQuota' + periodStandard + '.btn-success').trigger('click');
								});

						setTimeout(function() {
									industrChar2.createIndustryQuotaChart(quotaColumnName, quotaName, dates,
											periodStandard, quotaIndustryChart, mutiType, mutiTypeName, chartsIndustry
									);
								}, 200);
						setTimeout(function() {
									$('.industryQuota' + periodStandard).last().trigger('click');
									$('.companysQuota' + periodStandard).last().trigger('click');
								}, 400);
					}
				}
			}
			);
		};

		$('#industry_search').trigger('click');

		/** --------------异常指标统计---------------- */
		/*
		 * $('#unusual_year').datepicker({ autoclose: true, todayHighlight:
		 * true, language: 'zh-CN', //语言设置 format: 'yyyy', //日期显示格式 minViewMode:
		 * 2 });
		 */
		ComboDicOptionNew($('#unusual_industry_period'), ComboLocalDicOption(false, 'WindPeriod'));
		var myDate = new Date();
		var year = myDate.getFullYear();// 年
		// $('#unusual_year').val(year - 1);
		var unusual_year = window.CUR_PROJECT_ACC_YEAR;
		$('#unusual_industry').treecombo({
					url : 'cpBase/TreeCommon.findIndustry2Tree.json',
					params : {},
					view : {
						leafIcon : 'fa fa-building text-flat',
						nodeIcon : 'fa fa-bank text-primary-light',
						folderSelectable : true,
						multiSelect : false
					}
				});
		$.ajax({
					type : 'get',
					url : 'finCenter/analysis.findIndustry.json',
					bdolxLoader : false,
					async : false,
					data : {
						param1 : window.CUR_CUSTOMERID,
						param2 : window.CUR_PROJECTID,
						lockProjectId: window.CUR_PROJECTID,
						lockCustomerId: window.CUR_CUSTOMERID,
						lockYyyy: window.CUR_PROJECT_ACC_YEAR
					},
					dataType : 'json',
					success : function(result) {

						if (result.success) {
							var aa = result.data[0].aa;
							var aacode = result.data[0].aacode;
							$('#unusual_industry').treecombo('setTreeComboValue', [aacode, aa]);
						}
					}
				});
		var createTabUnusual = function(tableId) {
			// 立信数据不支持按季度
			/*
			 * if (tableId.indexOf('Period') > 0 &&
			 * parseInt($('#unusual_slpk').val()) > 10000000) { return; }
			 */
			// var startdate = $('#unusual_startdate').val();
			// var enddate = $('#unusual_enddate').val();
			// var year = $('#unusual_year').val();
			var year = unusual_year;
			if ($('#unusual_slpk').val() === null || $('#unusual_slpk').val() === '') {
				bdoErrorBox('错误', '请选择公司');
				return;
			}
			/*
			 * if (startdate === null || startdate === '') { bdoErrorBox('错误',
			 * '开始时间不能为空!'); return; } if (enddate === null || enddate === '') {
			 * bdoErrorBox('错误', '结束时间不能为空!'); return; } if (startdate !== '' &&
			 * enddate !== '' && startdate > enddate) { bdoErrorBox('错误',
			 * '开始年份不能大于结束年份!'); return; }
			 */
			if (year === null || year === '') {
				bdoErrorBox('错误', '年份不能为空!');
				return;
			}
			var periodStandard = '2';
			var tmpParam = [];
			var lastyear = (year - 1) + '-12-31';
			var currentyear = '';
			var industryyear = year + '-12-31';
			// 如果包含period 发送param3为1
			if ($('#unusual_industry_period').val() == '1') {
				periodStandard = '2';
				tmpParam = [(year - 3) + '-12-31', (year - 2) + '-12-31', (year - 1) + '-12-31'];
				currentyear = year + '-12-31';
			} else if ($('#unusual_industry_period').val() == '2') {
				periodStandard = '1';
				tmpParam = [(year - 3) + '-12-31', (year - 2) + '-12-31', (year - 1) + '-03-31'];
				currentyear = year + '-03-31';
			} else if ($('#unusual_industry_period').val() == '3') {
				periodStandard = '1';
				tmpParam = [(year - 3) + '-12-31', (year - 2) + '-12-31', (year - 1) + '-06-31'];
				currentyear = year + '-06-31';
			} else if ($('#unusual_industry_period').val() == '4') {
				periodStandard = '1';
				tmpParam = [(year - 3) + '-12-31', (year - 2) + '-12-31', (year - 1) + '-09-31'];
				currentyear = year + '-09-31';
			}
			// 生成table cloumn 以及param
			// var tmpParam = ['2017-12-31','2018-12-31'];
			var proejectId = $('#projectId').val();
			// 指标分析
			/*
			 * for (var i = 0; i < data.data.length; i++) { var map =
			 * data.data[i]; $.each(map, function(key, value) { tmpParam[i] =
			 * key; }); }
			 */
			var paramStr = tmpParam.join(',').toString();
			// tmpParam.push('行业');
			if (proejectId != null && proejectId !== '') {
				tmpParam.push('未审报表');
				tmpParam.push('审定报表');
			}
			$.ajax({
						type : 'get',
						url : 'finCenter/analysis.getErrorChartData.json',
						dataType : 'json',
						data : {
							lockCustomerId : $('#unusual_slpk').val(),
							lockProjectId : proejectId,
							lockYyyy: window.CUR_PROJECT_ACC_YEAR,
							param2 : paramStr,
							param4 : periodStandard,
							param6 : $('#unusual_industry').attr('data-result'),
							param7 : lastyear,
							param8 : currentyear,
							param9 : industryyear,
							param10 : $('#unusual_isShowAll').val()
						},
						success : function(data) {
							if (data.success) {
								// 清除tableId
								var doc = $('#' + tableId);
								// doc.html('');
								$('#unusual_chartsTabContent').find('.block-content.row').empty();
								// 封装数据
								for (var i = 0; i < data.data.length; i++) {
									var legendData = [];
									var xAxisData = tmpParam;
									var seriesData = [];
									var yAxisData = [];
									var selectedField = {};
									var tmpChartData = data.data[i];
									var tmpId = tableId + i;
									doc
											.append('<div><div id="'
													+ tmpId
													+ '" style="width: '
													+ tmpChartData.width
													+ 'px;height: '
													+ tmpChartData.height
													+ 'px" class="col-sm-3 col-xs-3"></div><div style="display:inline-block width: '
													+ tmpChartData.width + 'px;height: ' + tmpChartData.height
													+ 'px" class="col-sm-3 col-xs-3"><div title="' + tmpChartData.quotaRemark + '" class="si si-question"> ' + tmpChartData.unusualMessage
													+ '</div></div></div>');
									for (var j = 0; j < tmpChartData.dataList.length; j++) {
										var tmpInnerData = tmpChartData.dataList[j];
										legendData.push(tmpInnerData.field);
										if (j <= 2) {
											selectedField[tmpInnerData.field] = true;
										} else {
											selectedField[tmpInnerData.field] = false;
										}
										yAxisData.push({
													type : 'value',
													show : false
												});
										var tmpData = [];
										for (var k = 0; k < tmpInnerData.data.length; k++) {
											if (isNaN(tmpInnerData.data[k])) {
												tmpData.push(tmpInnerData.data[k]);
											} else {
												tmpData.push(parseFloat(tmpInnerData.data[k]));
											}
										}
										var magicType = tmpInnerData.magicType;
										var tmpSeries = {
											name : tmpInnerData.field,
											type : magicType,
											stack : tmpInnerData.stock,
											data : tmpData,
											// yAxisIndex: j,
											label : {
												normal : {
													show : true,
													position : 'top'
												}
											},
											barMaxWidth : '80',
											barGap : '30%'
										};
										if ('line' === magicType || tmpInnerData.stock !== '') {
											// 折线图不显示数据
											tmpSeries.label.normal.show = false;
										}
										if ('bar' === magicType) {
											// 柱状图公用同Y轴
											// tmpSeries.yAxisIndex = 0;
										}
										seriesData.push(tmpSeries);
									}
									// 第一个y轴显示
									yAxisData[0].show = true;
									var option = {
										title : {
                                            text: tmpChartData.chartName,
                                            textStyle: {
                                                color: tmpChartData.isError == '1' ? 'red' : 'green'
                                            }
										},
										grid : {
											top : '20%'
										},
										tooltip : {
											show : true,
											trigger : 'axis'
										},
										legend : {
											x : '50',
											data : legendData,
											selected : selectedField,
											y : '10%'
										},
										toolbox : {
											show : true,
											feature : {
												restore : {
													show : true
												}
											}
										},
										calculable : true,
										xAxis : {
											type : 'category',
											data : xAxisData,
											axisLabel : {
												interval : 0,// 横轴信息全部显示
												rotate : -30
												// -30度角倾斜显示
											}
										},
										// yAxis: yAxisData,
										yAxis : {
											type : 'value'
										},
										series : seriesData
									};
									var tmpChart = echarts.init(document.getElementById(tmpId));
									// 使用刚指定的配置项和数据显示图表。
									tmpChart.setOption(option);
								}
							}
						}
					}
			);
		};

		// 重置按钮
		$('#unusual_clear').click(function() {

					// $('#unusual_startdate').datepicker('setDate',
					// '2016-01-01');
					var date = new Date();
					var year = date.getFullYear();// 年
					var month = date.getMonth() + 1;// 月份
					var day = date.getDate();// 日期
					var str = year + '-' + month + '-' + day;
					// $('#unusual_enddate').datepicker('setDate', str);
					$('#unusual_industry_period').selectpicker('val', '1');
				});

		// 搜索行业均值/** 搜索按钮 */
		$('#unusual_search').click(function() {

					var result = $('#unusual_industry').attr('data-result');
					if (result == null || result == '') {
						bdoErrorBox('错误', '请选择行业');
						return;
					}
					if (result === 'classStandard') {
						bdoErrorBox('错误', '请选择具体行业');
						return;
					}
					var palte = $('#stockPalteSelect').val();
					if (result.indexOf('GB') > 0 && palte <= 2) {
						bdoErrorBox('错误', '抱歉,立信行业分类不支持万得板块数据!');
						return;
					}
					if (result.indexOf('GB') < 0 && palte > 2) {
						bdoErrorBox('错误', '抱歉,非立信行业不支持立信板块数据!');
						return;
					}
					if (result.length > 10 && palte != 1) {
						bdoErrorBox('错误', '抱歉,万得行业分类暂时仅支持万得A股板块数据!');
						return;
					}

					/*
					 * var startdate = $('#unusual_startdate').val(); var
					 * enddate = $('#unusual_enddate').val(); if (startdate ===
					 * null || startdate === '') { bdoErrorBox('错误',
					 * '开始时间不能为空!'); return; } if (enddate === null || enddate
					 * === '') { bdoErrorBox('错误', '结束时间不能为空!'); return; }
					 */
					// var year = $('#unusual_year').val();
					var year = unusual_year;
					if (year === null || year === '') {
						bdoErrorBox('错误', '年份不能为空!');
						return;
					}
					$('#projectId').val(window.CUR_PROJECTID);
					findCompnays($('#unusual_slpk'), window.CUR_CUSTOMERNAME);
					$('#unusual_slpk').selectpicker('val', window.CUR_CUSTOMERID);
					createTabUnusual("unusual_chartsProfitForPeriod");

				});

		// 推送至客户门户
		function sendAnalysisData(analysisTitle, analysisDtos) {
			var thirdPartyTableListDto = {
				projectId : window.CUR_PROJECTID,
				title : $('#reportSend_title').val(),// '报表分析-' +
				// analysisTitle,
				remark : $('#reportSend_remark').val(),
				sourcePlat : 'SACP',
				thirdPartyChartListDtos : analysisDtos,
				token : 'yUFTYE3#@tj27658JKpos'
			};
			var jsonStr = JSON.stringify(thirdPartyTableListDto);
			// jsonStr = JSON.stringify(thirdPartyTableListDto).replace(/\+/g,
			// '%2B');
			$.ajax({
						type : 'post',
						url : 'finCenter/Analysis.pushCustomPortal.json',
						data : {
							jsonData : jsonStr
						},
						dataType : 'json',
						success : function(data) {
							if (data.success) {
								$('#modal_reportSend').modal('hide');
								bdoSuccessBox('推送成功', data.resultInfo.statusText);
							} else {
								bdoErrorBox('推送失败', data.resultInfo.statusText);
							}
						}
					});
		}

		// 获取echarts数据
		function getThirdPartyChartListDtos(thirdPartyChartListDtos, option, chartType) {
			var charts = {
				chartType : chartType,
				chartTypeName : chartType,
				content : option
			};
			thirdPartyChartListDtos.push(charts);
		}
		// 推送至客户门户
		$('#quotaAnalysis_send').on('click', function() {
					if (quotaType == 1) {
						$('#reportSend_jyyj').show();
						$('#reportSend_zczk,#reportSend_xjl').hide();
						$('#reportSend_jyyj').find('textarea').val('');
						$('#reportSend_jyyj').find('input[type="checkbox"]').prop('checked', true);
					} else if (quotaType == 2) {
						$('#reportSend_zczk').show();
						$('#reportSend_jyyj,#reportSend_xjl').hide();
						$('#reportSend_zczk').find('textarea').val('');
						$('#reportSend_zczk').find('input[type="checkbox"]').prop('checked', true);
					} else if (quotaType == 3) {
						$('#reportSend_xjl').show();
						$('#reportSend_jyyj,#reportSend_zczk').hide();
						$('#reportSend_xjl').find('textarea').val('');
						$('#reportSend_xjl').find('input[type="checkbox"]').prop('checked', true);
					}
					$('#quotaAnalysis_send').blur();
					$('#modal_reportSend').modal('show');
					sendType = '1';
					$('#reportSend_title').val(quotaAnalysisTitle);
					$('#reportSend_remark').val('');
				});
		// 推送至客户门户
		$('#industry_send').on('click', function() {
					$('#reportSend_jyyj,#reportSend_zczk,#reportSend_xjl').hide();
					$('#industry_send').blur();
					$('#modal_reportSend').modal('show');
					sendType = '2';
					$('#reportSend_title').val(industryTitle);
					$('#reportSend_remark').val('');
				});
		// 推送至客户门户
		$('#reportSend_submit').on('click', function() {
					if ($('#reportSend_title').val() == '') {
						bdoInfoBox('提示', '标题不能为空');
						return;
					}
					if ($('#reportSend_title').val().length > 20) {
						bdoInfoBox('提示', '请将输入的标题控制在20字以内');
						return;
					}
					if ($('#reportSend_remark').val().length > 100) {
						bdoInfoBox('提示', '请将输入的备注控制在100字以内');
						return;
					}
					$('#reportSend_submit').blur();
					bdoConfirmBox('提示', '是否将指标推送至客户门户？', function() {
								if (sendType == '1') {
									let reportSendDtos = [];
									if (quotaType == 1) {
										$('#reportSend_jyyj').find('input[type="checkbox"]:checked').each(function(){
											let _id = $(this).attr('id');
											let _index = $(this).attr('data-result');
											let reportSendDto = $.extend(true,{},quotaAnalysisDtos[_index]);
											reportSendDto.chartRemark = $('#' + _id + '_remark').val();
											reportSendDtos.push(reportSendDto);
										});
									} else if (quotaType == 2) {
										$('#reportSend_zczk').find('input[type="checkbox"]:checked').each(function(){
											let _id = $(this).attr('id');
											let _index = $(this).attr('data-result');
											let reportSendDto = $.extend(true,{},quotaAnalysisDtos[_index]);
											reportSendDto.chartRemark = $('#' + _id + '_remark').val();
											reportSendDtos.push(reportSendDto);
										});
									} else if (quotaType == 3) {
										$('#reportSend_xjl').find('input[type="checkbox"]:checked').each(function(){
											let _id = $(this).attr('id');
											let _index = $(this).attr('data-result');
											let reportSendDto = $.extend(true,{},quotaAnalysisDtos[_index]);
											reportSendDto.chartRemark = $('#' + _id + '_remark').val();
											reportSendDtos.push(reportSendDto);
										});
									}
									if (!$('#reportSend_wsbb').prop('checked')) {
										$.each(reportSendDtos, function(i, d){
											let inx = d.content.xAxis.data.indexOf('未审报表');
											$.each(d.content.series, function(i2, d2){
												d2.data.splice(inx,1);
											});
											d.content.xAxis.data.splice(inx,1);
										});
									}
									sendAnalysisData(quotaAnalysisTitle, reportSendDtos);
								} else {
									var companyQuotaChart = industrChar2.getCompanysQuota();
									industryDtos = [];
									getThirdPartyChartListDtos(industryDtos, companyQuotaChart.getOption(), '公司指标走势');
									sendAnalysisData(industryTitle, industryDtos);
								}
							});
				});
	}

	$(function() {
				ReportAnalysis();
			});

}
);

// 公式弹出
function showFormulaChi(doc, formulaChi) {
	/*
	 * //$("[data-toggle='popover']").popover('hide'); $.ajax({ type: 'get',
	 * url: 'finCenter/analysis.findFormulaChiByProgramId.json', dataType:
	 * 'json', data: {param1: programId}, success: function (data) { if
	 * (data.success) { $(doc).popover({ trigger: 'hover', animation: true,
	 * html: true, container: 'body', title: data.data[0].formulaChi });
	 * $(doc).popover('show'); } } });
	 */
	$(doc).popover({
				trigger : 'hover',
				animation : true,
				html : true,
				container : 'body',
				title : formulaChi
			});
	$(doc).popover('show');
}

// 公式隐藏
function hideFormulaChi(doc, programId) {
	$('.popover-title').each(function() {
				$(this).popover('hide');
			});
}
