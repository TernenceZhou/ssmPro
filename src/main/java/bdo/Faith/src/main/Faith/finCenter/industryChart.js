var industryQuotaChart;//存放chart的document
//生成行业指标chart
var midJsonArr;//存放中值
var avgJsonArr;//存放均值
var companyQuotaChart = [null, null, null];
var createIndustryQuotaChart = function(quotaColumnName, quotaName, dates, periodStandard, quotaIndustryChart, mutiType, mutiTypeName, chartsIndustry) {
	var dateStr = dates.join(',');
	var classCode = $('#analysis_industry').attr('data-result');
	if (classCode == null || classCode == '') {
		bdoErrorBox('错误', '请选择行业');
		return;
	}
	var totalValueMax = $('#totalValue_max').val();
	var totalValueMin = $('#totalValue_min').val();
	if (totalValueMax !== null && totalValueMin !== null && parseFloat(totalValueMax) < parseFloat(totalValueMin)) {
		bdoErrorBox('错误', '市值范围错误');
		return;
	}
	if (quotaColumnName == null) {
		//bdoErrorBox('错误', '请选择指标');
		return;
	}
	var stockPalte = $('#stockPalteSelect').selectpicker('val');
	var className = $('#analysis_industry').attr('data-content');
	var companyId = $('#slpk').val();
	var companyIds = '';
	if (companyId !== null) {
		companyIds = companyId.join(',');
	}
	var companyNames = $('button[data-id=\'slpk\']').attr('title');
	var companyNameArr = companyNames.split(',');
	//单个指标 -> 详情数据
	var seriesDataArrAll = [];
	var legendDataAll = [];
	/*if(quotaColumnName.length === 1){
		
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.findQuotaIndustryChartData.json',
			data: {
				menuId: window.sys_menuId,
				param1: quotaColumnName[0],
				param2: dateStr,
				param3: periodStandard,
				param4: classCode,
				param5: companyIds,
				param6 : totalValueMin,
				param7 : totalValueMax,
				param8 : stockPalte
			},
			dataType: 'json',
			async : false,
			success: function (result) {
				if (result.success) {
					//绘制图表
				
					var legendData = ['max', 'min', 'avg', 'mid'];
					var fieldArr = ['max', 'min', 'avg', 'mid'];
					var selectJson = {
						'max': false,
						'min': false
					}
					if (companyId !== null) {
						for (var i = 0; i < companyId.length; i++) {
							legendData.push(companyNameArr[i]);
							fieldArr.push(companyId[i]);
							selectJson[companyNameArr[i]] = false;
						}
					}
					var seriesDataArr = [];
					//最大值默认不显示
					for (var i = 0; i < fieldArr.length; i++) {
						seriesDataArr.push({
							name: legendData[i],
							type: 'line',
							data: [],
							markPoint: {
								data: [
									{type: 'max', name: '最大值'},
									{type: 'min', name: '最小值'}
								]
							}
						});
					}
					var xAxisDataFin = [];
					midJsonArr = {};
					avgJsonArr = {};
					for (var i = 0; i < dates.length; i++) {
						//中值和均值存放 便于详情使用
						var mid = result.data[0][dates[i]].mid;
						var avg = result.data[0][dates[i]].avg;
						if (mid === "-") {
							midJsonArr[dates[i]] = null;
						} else {
							midJsonArr[dates[i]] = mid;
						}
						if (avg === "-") {
							avgJsonArr[dates[i]] = null;
						} else {
							avgJsonArr[dates[i]] = avg;
						}
						xAxisDataFin.push(dates[i]);

						for (var j = 0; j < fieldArr.length; j++) {
							var field = fieldArr[j];
							if ((result.data[0][dates[i]])[field] !== '-') {
								seriesDataArr[j].data.push(parseFloat((result.data[0][dates[i]])[field]));
							} else {
								seriesDataArr[j].data.push(null);
							}
						}
					}

					//绘制图表
					
					var legendDataa = ['max', 'min', 'avg', 'mid'];
					var fieldArr = ['max', 'min', 'avg', 'mid'];
					var selectJson = {
						'max': false,
						'min': false
					}
					if (companyId !== null) {
						for (var i = 0; i < companyId.length; i++) {
							//legendData.push(companyNameArr[i]);
							//fieldArr.push(companyId[i]);
							selectJson[companyNameArr[i]] = false;
						}
					}
					var seriesDataArr1 = [];
					//最大值默认不显示
					for (var i = 0; i < fieldArr.length; i++) {
						seriesDataArr1.push({
							name: legendDataa[i],
							type: 'line',
							data: [],
							markPoint: {
								data: [
									{type: 'max', name: '最大值'},
									{type: 'min', name: '最小值'}
								]
							}
						});
					}
					var xAxisDataFin1 = [];
					midJsonArr = {};
					avgJsonArr = {};
					for (var i = 0; i < dates.length; i++) {
						//中值和均值存放 便于详情使用
						var mid = result.data[0][dates[i]].mid;
						var avg = result.data[0][dates[i]].avg;
						if (mid === "-") {
							midJsonArr[dates[i]] = null;
						} else {
							midJsonArr[dates[i]] = mid;
						}
						if (avg === "-") {
							avgJsonArr[dates[i]] = null;
						} else {
							avgJsonArr[dates[i]] = avg;
						}
						xAxisDataFin1.push(dates[i]);

						for (var j = 0; j < fieldArr.length; j++) {
							var field = fieldArr[j];
							if ((result.data[0][dates[i]])[field] !== '-') {
								seriesDataArr1[j].data.push(parseFloat((result.data[0][dates[i]])[field]));
							} else {
								seriesDataArr1[j].data.push(null);
							}
						}
					}
					
					
					
				
					var legendData = quotaName.trim().split(/\s+/);
					for( let w =0; w<legendData.length;w++){
						legendData[w] =legendData[w]+'(行业)'
					}
			//
					
					
			//		legendData = legendData.concat(legendDataa);
					var fieldArr = quotaColumnName;
					var seriesDataArr = [];
			//		seriesDataArr = seriesDataArr.concat(seriesDataArr1);
					//最大值默认不显示
					for (var i = 0; i < fieldArr.length; i++) {
						seriesDataArr.push({
							name: legendData[i],
							type: 'line',
							data: [],
							markPoint: {
								data: [
									{type: 'max', name: '最大值'},
									{type: 'min', name: '最小值'}
								]
							}
						});
					}
					
					let xAxisDataFin = [];
					for ( f = 0; f < dates.length; f++) {
						xAxisDataFin.push(dates[f]);

						for (let j = 0; j < fieldArr.length; j++) {
							var field = fieldArr[j];
							if ((result.data[0][dates[f]])[field] !== '-') {
								seriesDataArr[j].data.push(parseFloat((result.data[0][dates[f]])[field]));
							} else {
								seriesDataArr[j].data.push(null);
							}
						}
					}
					
					//指定图表的配置项和数据
					var option = {
						title: {
							text : "行业指标走势",
							subtext: className + " - " + quotaName
						},
						grid: {
							top: "15%"
						},
						tooltip: {
							show: true,
							trigger: 'axis'
						},
						legend: {
							data: legendData,
							selected: selectJson,
							y: '10%'
						},
						xAxis: {
							data: xAxisDataFin,
							axisLabel: {
								interval: 0,//横轴信息全部显示
								rotate: -30//-30度角倾斜显示
							},
							type: 'category',
							boundaryGap: false
						},
						calculable: true,
						toolbox: {
							show: true,
							feature: {
								mark: {show: true},
								dataView: {show: true, readOnly: false},
								magicType: {show: true, type: ['line', 'bar']},
								restore: {show: true},
								saveAsImage: {show: true}
							}
						},
						yAxis: {
							type: "value"
						},
						series: seriesDataArr
					};
					// 基于准备好的dom，初始化echarts实例
					if (industryQuotaChart !== null && industryQuotaChart !== "" && industryQuotaChart !== undefined) {
						industryQuotaChart.dispose();
					}
					industryQuotaChart = echarts.init(document.getElementById(quotaIndustryChart));
					// 使用刚指定的配置项和数据显示图表。
					industryQuotaChart.setOption(option);
				}
			}
		})
	}else {*/
	
	//多个指标 -> 按维度展示数据
	$.ajax({
		type: 'get',
		url: 'finCenter/analysis.findMutiQuotaIndustryChartData.json',
		data: {
			menuId: window.sys_menuId,
			param1: quotaColumnName.join(','),
			param2: dateStr,
			param3: periodStandard,
			param4: classCode,
//			param5: companyIds,
			param6: totalValueMin,
			param7: totalValueMax,
			param8: stockPalte,
			param9: mutiType,
			lockCustomerId: companyIds
		},
		dataType: 'json',
		async: false,
		success: function(result) {
			if (result.success) {
				//绘制图表
				var legendDataa = ['max', 'min', 'avg', 'mid'];
				var fieldArr = ['max', 'min', 'avg', 'mid'];
				var selectJson = {
					'max': false,
					'min': false
				};
				if (companyId !== null) {
					for (var i = 0; i < companyId.length; i++) {
						//legendData.push(companyNameArr[i]);
						//fieldArr.push(companyId[i]);
						selectJson[companyNameArr[i]] = false;
					}
				}
				var seriesDataArr1 = [];
				//最大值默认不显示
				for (var i = 0; i < fieldArr.length; i++) {
					seriesDataArr1.push({
						name: legendDataa[i],
						type: 'line',
						data: [],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						}
					});
				}
				var xAxisDataFin1 = [];
				midJsonArr = {};
				avgJsonArr = {};
				for (var i = 0; i < dates.length; i++) {
					//中值和均值存放 便于详情使用
					var mid = result.data[0][dates[i]].mid;
					var avg = result.data[0][dates[i]].avg;
					if (mid === '-') {
						midJsonArr[dates[i]] = null;
					} else {
						midJsonArr[dates[i]] = mid;
					}
					if (avg === '-') {
						avgJsonArr[dates[i]] = null;
					} else {
						avgJsonArr[dates[i]] = avg;
					}
					xAxisDataFin1.push(dates[i]);

					for (var j = 0; j < fieldArr.length; j++) {
						var field = fieldArr[j];
						if ((result.data[0][dates[i]])[field] !== '-') {
							seriesDataArr1[j].data.push(parseFloat((result.data[0][dates[i]])[field]));
						} else {
							seriesDataArr1[j].data.push(null);
						}
					}
				}


				var legendData = quotaName.trim().split(/\s+/);
				for (let w = 0; w < legendData.length; w++) {
					legendData[w] = legendData[w] + '(行业)';
				}
				//


				//		legendData = legendData.concat(legendDataa);
				var fieldArr = quotaColumnName;
				var seriesDataArr = [];
				//		seriesDataArr = seriesDataArr.concat(seriesDataArr1);
				//最大值默认不显示
				for (var i = 0; i < fieldArr.length; i++) {
					seriesDataArr.push({
						name: legendData[i],
						type: 'line',
						data: [],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						}
					});
				}

				let xAxisDataFin = [];
				for (f = 0; f < dates.length; f++) {
					xAxisDataFin.push(dates[f]);

					for (let j = 0; j < fieldArr.length; j++) {
						var field = fieldArr[j];
						if ((result.data[0][dates[f]])[field] !== '-') {
							seriesDataArr[j].data.push(parseFloat((result.data[0][dates[f]])[field]));
						} else {
							seriesDataArr[j].data.push(null);
						}
					}
				}

				//指定图表的配置项和数据
				var option = {
					title: {
						text: '行业指标走势',
						subtext: className + ' - ' + mutiTypeName
					},
					tooltip: {
						show: true,
						trigger: 'axis'
					},
					legend: {
						data: legendData,
						y: '45px'
					},
					xAxis: {
						data: xAxisDataFin,
						axisLabel: {
							interval: 0,//横轴信息全部显示
							rotate: -30//-30度角倾斜显示
						},
						type: 'category',
						boundaryGap: false
					},
					calculable: true,
					toolbox: {
						show: true,
						feature: {
							mark: {show: true},
							dataView: {show: true, readOnly: false},
							magicType: {show: true, type: ['line', 'bar']},
							restore: {show: true},
							saveAsImage: {show: true}
						}
					},
					yAxis: {
						type: 'value'
					},
					series: seriesDataArr
				};
				// 基于准备好的dom，初始化echarts实例
				if (industryQuotaChart !== null && industryQuotaChart !== '' && industryQuotaChart !== undefined) {
					industryQuotaChart.dispose();
				}
				/*industryQuotaChart = echarts.init(document.getElementById(quotaIndustryChart));
				// 使用刚指定的配置项和数据显示图表。
				industryQuotaChart.setOption(option);*/
				seriesDataArrAll = seriesDataArrAll.concat(seriesDataArr);
				legendDataAll = legendDataAll.concat(legendData);
			}
		}

	});

	//公司指标
	//删除原图
	for (var j = 0; j < companyQuotaChart.length; j++) {
		var tmpChart = companyQuotaChart[j];
		if (tmpChart !== null && tmpChart !== '' && tmpChart !== undefined) {
			tmpChart.dispose();
		}
	}
	var doc = $('#' + chartsIndustry);
	//doc.remove('.companyChart');
	doc.children('.companyChart').remove();
	for (var k = 0; k < companyId.length; k++) {
		var tmpIndex = k;
		if(chartsIndustry.indexOf('Year') > 0 ){
			var tmpId = 'companyQuotaChartYear' + tmpIndex;
		}else{
			var tmpId = 'companyQuotaChartPeriod' + tmpIndex;
		}
		doc.append('<div class="col-sm-6 col-xs-6 companyChart"><div id="' + tmpId + '" style="width: 500px;height: 550px"></div></div>');
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.findQuotaCompanyChartData.json',
			bdolxLoader: false,
			data: {
				menuId: window.sys_menuId,
				param1: quotaColumnName.join(','),
				param2: dateStr,
				param3: periodStandard,
//				param4: companyId[tmpIndex],
				lockCustomerId: companyId[tmpIndex],
			},
			dataType: 'json',
			async: false,
			success: function(result) {
				if (result.success) {
					//绘制图表
					var legendData1 = quotaName.trim().split(/\s+/);
					var fieldArr = quotaColumnName;
					var seriesDataArr1 = [];
					//最大值默认不显示
					for (var i = 0; i < fieldArr.length; i++) {
						seriesDataArr1.push({
							name: legendData1[i],
							type: 'line',
							data: [],
							markPoint: {
								data: [
									{type: 'max', name: '最大值'},
									{type: 'min', name: '最小值'}
								]
							}
						});
					}

					let xAxisDataFin = [];
					for (h = 0; h < dates.length; h++) {
						xAxisDataFin.push(dates[h]);

						for (var j = 0; j < fieldArr.length; j++) {
							var field = fieldArr[j];
							if ((result.data[0][dates[h]])[field] !== '-') {
								seriesDataArr1[j].data.push(parseFloat((result.data[0][dates[h]])[field]));
							} else {
								seriesDataArr1[j].data.push(null);
							}
						}
					}
					var seriesdata = seriesDataArrAll;
					seriesDataArrAll = seriesDataArrAll.concat(seriesDataArr1);
					var legenddata = legendDataAll;
					legendDataAll = legendDataAll.concat(legendData1);
					//指定图表的配置项和数据
					var option = {
						title: {
							text: '公司指标走势',
							subtext: companyNameArr[tmpIndex]
						},
						tooltip: {
							show: true,
							trigger: 'axis'
						},
						legend: {
							data: legendDataAll,
							y: '45px'
						},
						xAxis: {
							data: xAxisDataFin,
							axisLabel: {
								interval: 0,//横轴信息全部显示
								rotate: -30//-30度角倾斜显示
							},
							type: 'category',
							boundaryGap: false
						},
						calculable: true,
						toolbox: {
							show: true,
							feature: {
								mark: {show: true},
								dataView: {show: true, readOnly: false},
								magicType: {show: true, type: ['line', 'bar']},
								restore: {show: true},
								saveAsImage: {show: true}
							}
						},
						yAxis: {
							type: 'value'
						},
						series: seriesDataArrAll
					};
					companyQuotaChart[tmpIndex] = echarts.init(document.getElementById(tmpId));
					companyQuotaChart[tmpIndex].setOption(option);
					seriesDataArrAll = seriesdata;
					legendDataAll = legenddata;
				}
			}
		});
	}
};

var quotaDetailIndustryChart = [null, null, null];
//展示详情
var showDetail = function(reportDate, industryQuotaSelect, industryQuotaStandard, periodStandard, detailQuotaIndustryTable, quotaDetailIndustryChartId) {
	var classCode = $('#analysis_industry').attr('data-result');
	if (classCode == null || classCode == '') {
		bdoErrorBox('错误', '请选择行业');
		return;
	}
	var totalValueMax = $('#totalValue_max').val();
	var totalValueMin = $('#totalValue_min').val();
	if (totalValueMax !== null && totalValueMin !== null && parseFloat(totalValueMax) < parseFloat(totalValueMin)) {
		bdoErrorBox('错误', '市值范围错误');
		return;
	}
	if ($('#' + industryQuotaSelect).val() == null) {
		//bdoErrorBox('错误', '请选择指标');
		return;
	}
	var stockPalte = $('#stockPalteSelect').selectpicker('val');
	//建表

	var quotaColumnName = $('#' + industryQuotaSelect).val();
	let hangyequotaName = $('#' + industryQuotaSelect).children('option:selected').text();
	let hangyequotaNames = hangyequotaName.trim().split(/\s+/);

	//需要传入的数据有  quotaColumnName quotaName reportDate  periodStandard, classCode companyIds selectId
	var companyId = $('#slpk').val();
	var companyIds = '';
	if (companyId !== null) {
		companyIds = companyId.join(',');
	}
	var industryQuotaStandard1 = $('#' + industryQuotaStandard).val();
	
	//先删除已有表图
	if(quotaDetailIndustryChartId.indexOf('Year')>0){
		$('#hangyequotaYear').html('');			
		var content1 = $('#hangyequotaYear');
	}else{
		$('#hangyequotaPeriod').html('');			
		var content1 = $('#hangyequotaPeriod');
	}
	for (let v = 0; v < quotaColumnName.length; v++) {
		var hangyequoIndex = v;
		if(quotaDetailIndustryChartId.indexOf('Year')>0){
			var hangyequoId = 'hangyeQuotaChartYear' + hangyequoIndex;
		}else{
			var hangyequoId = 'hangyeQuotaChartPeriod' + hangyequoIndex;
		}
		quotaDetailIndustryChartId = quotaDetailIndustryChartId + v;
		content1.append('<div class="col-sm-7 col-xs-7 hangyequoChart"><div class="form-material">'
			+ '<div id="' + hangyequoId + '" style="width: 550px; height:10px"></div></div></div>');

		var detailQuotaIndustryTable_view = {
			localParam: {
				tabNum: false,
				url: 'finCenter/analysis.findDetailQuotaIndustryChartData.json',
				urlparam: {
					menuId: window.sys_menuId
				}
			},
			tableParam: {
				select: true,
				lengthChange: true,
				dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				serverSide: true,
				scrollY: true,
				columnDefs: [
					{
						targets: 1,
						orderable: false,
						className: 'text-center',
						title: '排名',
						name: 'rank',
						data: 'rank',
						visible: true,
						width: '40px',
						render: function(data, type, row, meta) {
							if ($('#slpk').val() !== null) {
								if ($('#slpk').val().join(',').indexOf(row.companyId) >= 0) {
									return '<span style="color: #ff8c00">' + data + '</span>';
								}
							}
							return data;
						}
					}, {
						targets: 2,
						orderable: false,
						className: 'text-center',
						title: '公司名称',
						name: 'companyName',
						data: 'companyName',
						visible: true,
						width: '200px',
						render: function(data, type, row, meta) {
							if ($('#slpk').val() !== null) {
								if ($('#slpk').val().join(',').indexOf(row.companyId) >= 0) {
									return '<span style="color:#ff8c00">' + data + '</span>';
								}
							}
							return data;
						}
					}]
			}
		};

		detailQuotaIndustryTable_view.localParam.urlparam = {
			menuId: window.sys_menuId,
			param1: quotaColumnName[v],
			param2: reportDate,
			param3: periodStandard,
			param4: classCode,
//			param5: companyIds,
			param6: industryQuotaStandard1,
			param7: totalValueMin,
			param8: totalValueMax,
			param9: stockPalte,
			lockCustomerId: companyIds
		};
		var className = $('#analysis_industry').attr('data-content');

		detailQuotaIndustryTable_view.tableParam.columnDefs.push({
			targets: 3,
			orderable: false,
			className: 'text-center',
			title: className + ' - ' + hangyequotaNames[v],
			name: 'quota',
			data: 'quota',
			visible: true,
			width: '60px',
			render: function(data, type, row, meta) {
				if ($('#slpk').val() !== null) {
					if ($('#slpk').val().join(',').indexOf(row.companyId) >= 0) {
						return '<span style="color:#ff8c00">' + data + '</span>';
					}
				}
				return data;
			}
		});

		var quoTable = detailQuotaIndustryTable;
		detailQuotaIndustryTable = detailQuotaIndustryTable + v;
		var newTable = '<div class="col-sm-5 col-xs-5"><div class="block-content">'
			+ '<table id="' + detailQuotaIndustryTable + '" class="table table-bordered table-striped table-hover">'
			+ '</table></div></div>';
		content1.append(newTable);


		BdoDataTable(detailQuotaIndustryTable, detailQuotaIndustryTable_view);
		//建图
		var yAxisData1 = [];
		var seriesData1 = [];
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.findDetailQuotaIndustryChartData.json',
			bdolxLoader: false,
			data: {
				menuId: window.sys_menuId,
				param1: quotaColumnName[v],
				param2: reportDate,
				param3: periodStandard,
				param4: classCode,
//				param5: companyIds,
				param6: industryQuotaStandard1,
				param7: totalValueMin,
				param8: totalValueMax,
				param9: stockPalte,
				lockCustomerId: companyIds
			},
			async: false,
			dataType: 'json',
			success: function(result) {
				if (result.success) {
					var max = null;
					for (var i = result.data.length - 1; i >= 0; i--) {
						//最大值设置 和 xy轴数据
						yAxisData1.push(result.data[i].companyName.substring(0, 4));
						if (result.data[i].quota !== '……') {
							if (max === null) {
								max = parseFloat(result.data[i].quota);
							}
							if (parseFloat(result.data[i].quota) > max) {
								max = parseFloat(result.data[i].quota);
							}
							seriesData1.push(parseFloat(result.data[i].quota));
						} else {
							seriesData1.push(null);
						}
					}
					if (midJsonArr.hasOwnProperty(reportDate) && max < parseFloat(midJsonArr[reportDate])) {
						max = parseFloat(midJsonArr[reportDate]);
					}
					if (avgJsonArr.hasOwnProperty(reportDate) && max < parseFloat(avgJsonArr[reportDate])) {
						max = parseFloat(avgJsonArr[reportDate]);
					}
					var companyNames = $('button[data-id=\'slpk\']').attr('title');
					var option2 = {
						title: {
							text: '行业指标详情',
							subtext: className + ' - ' + hangyequotaNames[v]
						},
						tooltip: {
							trigger: 'item'
						},
						legend: {
							data: [reportDate]
						},
						toolbox: {
							show: true,
							feature: {
								mark: {show: true},
								dataView: {show: true, readOnly: false},
								magicType: {show: true, type: ['line', 'bar']},
								restore: {show: true},
								saveAsImage: {show: true}
							}
						},
						calculable: true,
						xAxis: [
							{
								type: 'value',
								max: max
							}
						],
						yAxis: [
							{
								type: 'category',
								data: yAxisData1
							}
						],
						series: [
							{
								name: reportDate,
								type: 'bar',
								data: seriesData1,
								label: {
									normal: {
										show: true,
										position: 'inside'
									}
								},
								markLine: {
									data: [
										[
											{
												name: '行业中值',
												label: {
													normal: {
														show: true,
														position: 'inside'
													}
												},
												itemStyle: {
													normal: {
														color: '#c21815'
													}
												},
												value: '行业中值' + midJsonArr[reportDate],
												xAxis: midJsonArr[reportDate],
												yAxis: 0
											},
											{
												xAxis: midJsonArr[reportDate],
												yAxis: seriesData1.length - 1
											}
										],
										[
											{
												name: '行业均值',
												itemStyle: {
													normal: {
														color: '#000000'
													}
												},
												value: '行业均值' + avgJsonArr[reportDate],
												xAxis: avgJsonArr[reportDate],
												yAxis: 0
											},
											{
												xAxis: avgJsonArr[reportDate],
												yAxis: seriesData1.length - 1
											}
										]
									]
								},
								itemStyle: {
									normal: {
										color: function(params) {      //根据预警线的值 显示对应的颜色
											var colorList = ['#ff8c00', '#7ed1ff '];
											if (companyNames.indexOf(params.name) >= 0) {
												return colorList[0];
											} else {
												return colorList[1];
											}
										}
									}
								}

							}
						]
					};

					var height = (yAxisData1.length * 26 + 125);
					// if(height > 625){
					//     height = 625;
					// }
					height = height + 'px';
					$('#' + hangyequoId).css('height', height);
					// 基于准备好的dom，初始化echarts实例
					if (quotaDetailIndustryChart[hangyequoIndex] !== null && quotaDetailIndustryChart[hangyequoIndex] !== '' && quotaDetailIndustryChart[hangyequoIndex] !== undefined) {
						quotaDetailIndustryChart[hangyequoIndex].dispose();
					}
					quotaDetailIndustryChart[hangyequoIndex] = echarts.init(document.getElementById(hangyequoId));
					// 使用刚指定的配置项和数据显示图表。
					quotaDetailIndustryChart[hangyequoIndex].setOption(option2);
				}
			}
		});
	}
};

var quotaDetailCompanysChartDoc = [null, null, null];
//多公司指标比较
var showCompanysQuota = function(reportDate, periodStandard, detailQuotaCompanysTable, quotaDetailCompanysChart, industryQuotaSelect) {

	if ($('#' + industryQuotaSelect).val() == null) {
		//bdoErrorBox('错误', '请选择指标');
		return;
	}
	var companyId = $('#slpk').val();
	var companyIds = '';
	if (companyId !== null) {
		companyIds = companyId.join(',');
	}

	//需要传入的数据
	var seriesData = [];

	var quotaColumnName = $('#' + industryQuotaSelect).val();


	let quotaName = $('#' + industryQuotaSelect).children('option:selected').text();
	let quotaNames = quotaName.trim().split('  ');
	//先重置表图
	if(quotaDetailCompanysChart.indexOf('Year')>0){
		$('#quoYear').html('');			
		var content2 = $('#quoYear');
	}else{
		$('#quoPeriod').html('');			
		var content2 = $('#quoPeriod');
	}
	/*var doc1 = $('#' + quotaDetailCompanysChart);
	doc1.children('.quoChart').remove();*/
	for (j = 0; j < quotaColumnName.length; j++) {
		var yAxisData = [];
		var quoIndex = j;
		if(quotaDetailCompanysChart.indexOf('Year')>0){
			var quoId = 'QuotaChartYear' + quoIndex;
		}else{
			var quoId = 'QuotaChartPeriod' + quoIndex;
		}
		quotaDetailCompanysChart = quotaDetailCompanysChart + j;
		content2.append('<div class="col-sm-7 col-xs-7 quoChart"><div class="form-material">'
			+ '<div id="' + quoId + '" style="width: 550px; height:10px"></div></div></div>');
		/*'<div class="col-sm-6 col-xs-6 quoChart" float="left"><div id="' + quoId + '" style="width: 400px; height:300px"></div></div>');*/
		//建表
		var detailQuotaCompanysTable_view = {
			localParam: {
				tabNum: false,
				url: 'finCenter/analysis.findDetailQuotaCompanysChartData.json',
				urlparam: {
					menuId: window.sys_menuId
				}
			},
			tableParam: {
				select: true,
				lengthChange: true,
				dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				serverSide: true,
				scrollY: true,
				columnDefs: [
					{
						targets: 1,
						orderable: false,
						className: 'text-center',
						title: '排名',
						name: 'rank',
						data: 'rank',
						visible: true,
						width: '40px'
					}, {
						targets: 2,
						orderable: false,
						className: 'text-center',
						title: '公司名称',
						name: 'companyName',
						data: 'companyName',
						visible: true,
						width: '200px'
					}]
			}
		};
		detailQuotaCompanysTable_view.localParam.urlparam = {
			menuId: window.sys_menuId,
			param1: quotaColumnName[j],
			param2: reportDate,
			param3: periodStandard,
//			param4: companyIds
			lockCustomerId: companyIds
		};
		detailQuotaCompanysTable_view.tableParam.columnDefs.push({
			targets: 3,
			orderable: false,
			className: 'text-center',
			title: quotaNames[j],
			name: 'quota',
			data: 'quota',
			visible: true,
			width: '60px'
		});
		var quoTable = detailQuotaCompanysTable;
		detailQuotaCompanysTable = detailQuotaCompanysTable + j;


		var newTable = '<div class="col-sm-5 col-xs-5"><div class="block-content">'
			+ '<table id="' + detailQuotaCompanysTable + '" class="table table-bordered table-striped table-hover">'
			+ '</table></div></div>';
		/*	$('<table id="' + detailQuotaCompanysTable+ '" class="table table-bordered table-striped table-hover" style=" height:50px;"> </table>');*/
		content2.append(newTable);
		BdoDataTable(detailQuotaCompanysTable, detailQuotaCompanysTable_view);
		detailQuotaCompanysTable = quoTable;
		//建图

		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.findDetailQuotaCompanysChartData.json',
			bdolxLoader: false,
			data: {
				menuId: window.sys_menuId,
				param1: quotaColumnName[j],
				param2: reportDate,
				param3: periodStandard,
//				param4: companyIds,
				lockCustomerId: companyIds
			},
			dataType: 'json',
			async: false,
			success: function(result) {
				if (result.success) {
					var seriesDataArr1 = [];
					for (var i = result.data.length - 1; i >= 0; i--) {

						if (result.data[i].quota !== '-') {
							yAxisData.push(result.data[i].companyName.substring(0, 4));
							seriesDataArr1.push(parseFloat(result.data[i].quota));
						}
					}
					var option = {
						title: {
							text: '多公司指标分析',
							subtext: quotaNames[quoIndex]    /*.trim().split(/\s+/)*/
						},
						tooltip: {
							trigger: 'item'
						},
						legend: {
							data: [reportDate]
						},
						toolbox: {
							show: true,
							feature: {
								mark: {show: true},
								dataView: {show: true, readOnly: false},
								magicType: {show: true, type: ['line', 'bar']},
								restore: {show: true},
								saveAsImage: {show: true}
							}
						},
						calculable: true,
						xAxis: [
							{
								type: 'value'
							}
						],
						yAxis: [
							{
								type: 'category',
								data: yAxisData
							}
						],
						series: [
							{
								name: reportDate,
								type: 'bar',
								data: seriesDataArr1,
								label: {
									normal: {
										show: true,
										position: 'inside'
									}
								}, markLine: {
									data: [
										{type: 'average', name: '平均值'}
									]
								}
							}
						]
					};
					var height = (yAxisData.length * 30 + 125);

					height = height + 'px';
					$('#' + quoId).css('height', height);
					// 基于准备好的dom，初始化echarts实例
					if (quotaDetailCompanysChartDoc[quoIndex] !== null && quotaDetailCompanysChartDoc[quoIndex] !== '' && quotaDetailCompanysChartDoc[quoIndex] !== undefined) {
						quotaDetailCompanysChartDoc[quoIndex].dispose();
					}

					quotaDetailCompanysChartDoc[quoIndex] = echarts.init(document.getElementById(quoId));
					// 使用刚指定的配置项和数据显示图表。
					quotaDetailCompanysChartDoc[quoIndex].setOption(option);
				}
			}
		});


	}


};




