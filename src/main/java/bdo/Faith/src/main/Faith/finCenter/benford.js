$(document).ready(function() {
	uiBlocksApi(false, 'init');
	//获取客户下拉
	// 客户
	getUserCustomers('benford_customerId');
	var myDate = new Date();
	var accyear = myDate.getFullYear();//年
	$('#benford_startDate').val(accyear - 3);
	$('#benford_endDate').val(accyear - 1);
	
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		maxViewMode: 2,
		minViewMode: 2,
		language: 'zh-CN', //语言设置
		format: 'yyyy' //日期显示格式
	});
	
	//时间毫秒数转时间
	function getMyDate(str) {
		if (str != null && str != '') {
			var oDate = new Date(str),
				oYear = oDate.getFullYear(),
				oMonth = oDate.getMonth() + 1,
				oDay = oDate.getDate(),
				oHour = oDate.getHours(),
				oMin = oDate.getMinutes(),
				oSen = oDate.getSeconds(),
				oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
			return oTime;
		} else {
			return '';
		}
	}
	
	//补0操作
	function getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + parseInt(num);
		}
		return num;
	}
	
	
	/** 搜索按钮 */
	$('#btn_benford_search').click(function() {
		if ($('#benford_customerId').val() === null || $('#benford_customerId').val() === '') {
			bdoInfoBox('提示', '客户名称不能为空!');
			return;
		}
		var startdate = $('#benford_startDate').val();
		var enddate = $('#benford_endDate').val();
		if (startdate === null || startdate === '') {
			bdoInfoBox('提示', '开始时间不能为空!');
			return;
		}
		if (enddate === null || enddate === '') {
			bdoInfoBox('提示', '结束时间不能为空!');
			return;
		}
		if (startdate !== '' && enddate !== '' && startdate > enddate) {
			bdoInfoBox('提示', '开始年份不能大于结束年份!');
			return;
		}
		// 账套过期时间
		getValidDate($('#benford_customerId').val(), startdate, 'validDate');
		var reportDate = '';
		for(var i = startdate;i <= enddate;i++){
			reportDate = reportDate + i + '-12-31,';
		}
		reportDate = reportDate.substring(0,reportDate.length-1);
		var param ={
			param2 : reportDate,
			param3 : '凭证分录金额,审定报表金额',
			param4 : '1',
			param5 : $('#benford_subjectid').val(),
			lockProjectId : $('#benford_customerId').val(),
			lockYyyy : ''
		};
		benfordChartInit(param);
	
	});
	
	function benfordChartInit(param) {
		
		$.ajax({
			url: 'finCenter/Benford.queryBenfordList.json',
			data: param,
			type: 'POST',
			dataType : 'json'
		}).done((data) => {
			if(data.success) {
				var doc = $('#chartsBenford');
				doc.empty();
				if(data.data && data.data.length > 0) {
					for(var i=0;i<data.data.length;i++){
						var seriesData = [];
						var legendData = [];
						let option = {
							title: {
								text: '本福特'
							},
							tooltip : {
								trigger: 'axis',
								formatter: function(params) {
					            var result = params[0].name + "<br>";
					            params.forEach(function(item) {
					              if (item.value) {
					                result += item.marker + " " + item.seriesName + " : " + (item.value*100).toFixed(2) + "%</br>";
					              } else {
					                result += item.marker + " " + item.seriesName + " :  - </br>";
					              }
					            });
					            return result;
					          }
							},
							grid: {
								left: '3%',
								right: '20%',
								bottom: '3%',
								containLabel: true
							},
							legend: {
								x: '50',
								data: [],
								y: '10%'
							},
							toolbox: {
								show: true,
								feature: {
									restore: {show: true}
								}
							},
							xAxis : [
								{
									type : 'category',
									data : ['1', '2', '3', '4', '5', '6', '7', '8', '9']
								}
							],
							yAxis : {
								minInterval: 0.1,
								type : 'value',
								axisLabel: {
				                    show: true,  
				                    interval: 'auto',  
				                    formatter: function(value,index){
				                        return (value*100).toFixed(2)+'%';
				                    }
				                }
							},
							/*yAxis : {
						        type: 'value'
						    },*/
							series : [
								{
									name:'',
									type:'line',
									barWidth: '60%',
									data:[]
								}
							]
						};
						for(var j=0;j<data.data[i].chart.length;j++){
							let tempData = [];
							tempData.push(data.data[i].chart[j].d1);
							tempData.push(data.data[i].chart[j].d2);
							tempData.push(data.data[i].chart[j].d3);
							tempData.push(data.data[i].chart[j].d4);
							tempData.push(data.data[i].chart[j].d5);
							tempData.push(data.data[i].chart[j].d6);
							tempData.push(data.data[i].chart[j].d7);
							tempData.push(data.data[i].chart[j].d8);
							tempData.push(data.data[i].chart[j].d9);
							var tmpSeries = {
								name: data.data[i].chart[j].name,
								type: 'line',
								data: tempData,
								id: data.data[i].chart[j].reportYear + data.data[i].chart[j].type,
								param1: 1
							};
							seriesData.push(tmpSeries);
							legendData.push(data.data[i].chart[j].name);
							if(data.data[i].chart[j].name.indexOf('客户本福特分布') != -1){
								option.title.text = data.data[i].chart[j].type + '相似度：' + data.data[i].chart[j].result1 + '，差异平方和：'
								+ (data.data[i].chart[j].result2 * 100).toFixed(2) + '%';
							}
						}

						option.series = seriesData;
						option.legend.data = legendData;
						//let dom = document.getElementById("chartsBenford");
						doc.append('<div id="chartsBenford' + i + '" data-height="250" style="height: 300px"></div>')
						let dom = document.getElementById("chartsBenford" + i);
						let myChart = echarts.init(dom);

						if (option && typeof option === "object") {
							myChart.setOption(option, true);
							chartClick(myChart);
						}
					}
				}else{
					doc.append('没有数据')
				}
			}
		});

	}
	function chartClick(elem) {
		elem.off('click');
		elem.on('click', function(e) {
			if(e.seriesId.indexOf('凭证') != -1 && e.seriesId.substr(0,1) != '0'){
				detail_view.localParam.urlparam.lockProjectId = $('#benford_customerId').val();
				detail_view.localParam.urlparam.lockYyyy = e.seriesId.substr(0,4);
				detail_view.localParam.urlparam.param3 = e.name;
				if(e.seriesName.indexOf('科目') != -1){
					detail_view.localParam.urlparam.param4 = $('#benford_subjectid').val();
				}else{
					detail_view.localParam.urlparam.param4 = '';
				}
				detail_view.localParam.urlparam.param5 = '';
				detail_view.localParam.urlparam.param6 = '';
				detail_view.localParam.urlparam.param7 = '';
				//BdoDataTable('benforddetail_table', detail_view);
				// 销毁表
				if ($('#benforddetail_table').hasClass('dataTable')) {
					$('#benforddetail_table').DataTable().clear();
					$('#benforddetail_table').DataTable().destroy();
					$('#benforddetail_table').empty();
				}
				$('#modal_benforddetail').modal('show');
//				benfordBarChartInit(detail_view.localParam.urlparam);
			}
		});
	}
	
	$('#modal_benforddetail').on('shown.bs.modal', function() {
		benfordBarChartInit(detail_view.localParam.urlparam);
		benfordSplitBarChartInit(detail_view.localParam.urlparam);
    });
	var detail_view_index = 1;
	var detail_view = {
			localParam: {
				tabNum: true,
				url: 'finCenter/Benford.getBenfordSubjectEntryView.json',
				urlparam: {
					menuId: window.sys_menuId,
					lockProjectId: $('#benford_customerId').val(),
					lockYyyy: '',
					param1: '',
					param2: '',
					param3: '',
					param4: ''
				}
			},
			tableParam: {
				select: true,
				scrollY: false,
				lengthChange: true,
				dom:
					"<'row'<'col-sm-12'tr>>" +
					"<'row'<'col-sm-6'i><'col-sm-6'p>>",
				ordering: false,
				//serverSide: true,
				pageLength: 20,
				columnDefs: [
								{
									targets: detail_view_index++,
									orderable: false,
									title: 'ID',
									className: 'text-center',
									name: 'autoId',
									data: 'autoId',
									visible: false,
									width: '25px'
				
								}, {
									targets: detail_view_index++,
									orderable: false,
									className: 'text-center',
									title: '凭证日期',
									name: 'vchDate',
									data: 'vchDate',
									width: '85px'
								}, {
									targets: detail_view_index++,
									orderable: true,
									className: 'text-left',
									title: '字',
									name: 'typeId',
									data: 'typeId',
									width: '30px'
				
								}, {
									targets: detail_view_index++,
									orderable: true,
									className: 'text-left',
									title: '号',
									name: 'oldVoucherId',
									data: 'oldVoucherId',
									width: '30px'
								}, {
									targets: detail_view_index++,
									orderable: true,
									className: 'text-left',
									title: '科目',
									name: 'subjectFullName',
									data: 'subjectFullName',
									width: '100px',
									render: function (data, type, row, meta) {
										if (data && data.length > 15) {
											return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
										}
										return data;
									}
								}, {
									targets: detail_view_index++,
									orderable: true,
									className: 'text-left',
									title: '摘要',
									name: 'summary',
									data: 'summary',
									width: '200px',
									render: function (data, type, row, meta) {
										if (data && data.length > 15) {
											return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
										}
										return data;
									}
								}, {
									targets: detail_view_index++,
									orderable: true,
									className: 'text-right',
									title: '借方发生额',
									name: 'debit',
									data: 'debit',
									width: '100px',
									render: function(data, type, row, meta) {
										return formatMoney(data);
									}
								}, {
									targets: detail_view_index++,
									orderable: true,
									className: 'text-right',
									title: '贷方发生额',
									name: 'credit',
									data: 'credit',
									width: '100px',
									render: function(data, type, row, meta) {
										return formatMoney(data);
									}
								}, {
									targets: detail_view_index++,
									orderable: true,
									className: 'text-left',
									title: '对方科目',
									name: 'oppositeSubjectValue',
									data: 'oppositeSubjectValue',
									width: '200px',
									render: function (data, type, row, meta) {
										if (data && data.length > 15) {
											return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
										}
										return data;
									}
								}
					]
			}
			
		};

	// 选择科目
	$('#benford_subjectid').focus(function() {
		if ($('#benford_customerId').val() == '') {
			$('#benford_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#benford_startDate').val() == '') {
			$('#benford_startDate').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid').modal('show');
		if ($('#subject_tree').hasClass('treeview')) {
			return;
		}
		$('#subject_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#benford_customerId').val(),
				lockYyyy: $('#benford_startDate').val(),
				searchInputId: 'searchInput1'
			},
			singleSelect: true,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}
			/*lazyLoad : false,
			view : {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: '',
			}*/
		});
	});
	$('#modal_subjectid_sure').click(function() {
		var selectValue = $('#subject_tree').tree('getTreeMultiValue');
		if (typeof(selectValue) === 'object') {
			$('#benford_subjectid').val('');
		} else {
			$('#benford_subjectid').val(selectValue);

		}
		$('#modal_subjectid').modal('hide');
	});
	$('#modal_subjectid_reset').click(function() {
		$('#subject_tree').tree('reset');
	});
	/** 导出 */
	$('#modal_benforddetail_export').click(function() {
		exportExcelFin(this, '本福特明细', detail_view, 'benforddetail_table');
	});
	
	/** 柱状图 */
	function benfordBarChartInit(param) {
		
		$.ajax({
			url: 'finCenter/Benford.queryBenfordBarList.json',
			data: param,
			type: 'POST',
			dataType : 'json'
		}).done((data) => {
			if(data.success) {
				var doc = $('#chartsBarBenford');
				doc.empty();
				if(data.data && data.data.length > 0) {
					for(var i=0;i<data.data.length;i++){
						var seriesData = [];
						var legendData = [];
						let option = {
							title: {
								text: '分月数量'
							},
							tooltip : {
								trigger: 'axis'
							},
							grid: {
								left: '3%',
								right: '3%',
								bottom: '3%',
								containLabel: true
							},
							legend: {
								x: '50',
								data: [],
								y: '10%'
							},
							toolbox: {
								show: true,
								feature: {
									restore: {show: true}
								}
							},
							xAxis : [
								{
									type : 'category',
									data : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
								}
							],
							yAxis : {
								minInterval: 0.1,
								type : 'value',
								axisLabel: {
				                    show: true,  
				                    interval: 'auto'
				                }
							},
							/*yAxis : {
						        type: 'value'
						    },*/
							series : [
								{
									name:'',
									type:'bar',
									barWidth: '50%',
									data:[]
								}
							]
						};
						let tempData = [];
						for(var j=1;j<13;j++){
							tempData.push(data.data[0]['m'+j]);
						}
						var tmpSeries = {
							name: data.data[0].name,
							type: 'bar',
							data: tempData,
							id: data.data[0].reportYear
						};
						seriesData.push(tmpSeries);
						legendData.push(data.data[0].name);
						option.series = seriesData;
						option.legend.data = legendData;
						//let dom = document.getElementById("chartsBenford");
						doc.append('<div id="chartsBarBenford' + i + '" data-height="200" style="height: 250px"></div>')
						let dom = document.getElementById("chartsBarBenford" + i);
						let myChart = echarts.init(dom);

						if (option && typeof option === "object") {
							myChart.setOption(option, true);
							chartBarClick(myChart);
						}
					}
				}else{
					doc.append('没有数据')
				}
			}
		});
	}
	/** 柱状图点击 */
	function chartBarClick(elem) {
		elem.off('click');
		elem.on('click', function(e) {
			var month = e.name.split('月');
			detail_view.localParam.urlparam.param5 = month[0];
			BdoDataTable('benforddetail_table', detail_view);
		});
	}
	/** 金额分层柱状图 */
	function benfordSplitBarChartInit(param) {
		var yData = [];
		yData.push('全部');
		yData.push(param.param3 + '千万元' + '~');
		yData.push(param.param3 + '百万元' + '~' + param.param3 + '千万元');
		yData.push(param.param3 + '十万元' + '~' + param.param3 + '百万元');
		yData.push(param.param3 + '万元' + '~' + param.param3 + '十万元');
		yData.push(param.param3 + '~' + param.param3 + '万元');
		var monthParam = {};
		monthParam['全部'] = ',';
		monthParam[param.param3 + '千万元' + '~'] = param.param3 + '0000000,';
		monthParam[param.param3 + '百万元' + '~' + param.param3 + '千万元'] = param.param3 + '000000,' + param.param3 + '0000000';
		monthParam[param.param3 + '十万元' + '~' + param.param3 + '百万元'] = param.param3 + '00000,' + param.param3 + '000000';
		monthParam[param.param3 + '万元' + '~' + param.param3 + '十万元'] = param.param3 + '0000,' + param.param3 + '00000';
		monthParam[param.param3 + '~' + param.param3 + '万元'] = param.param3 + ',' + param.param3 + '0000';
		$.ajax({
			url: 'finCenter/Benford.queryBenfordSplitBarList.json',
			data: param,
			type: 'POST',
			dataType : 'json'
		}).done((data) => {
			if(data.success) {
				var doc = $('#chartsBarSplitBenford');
				doc.empty();
				if(data.data && data.data.length > 0) {
					for(var i=0;i<data.data.length;i++){
						var seriesData = [];
						var legendData = [];
						let option = {
							title: {
								text: '金额分层'
							},
							tooltip : {
								trigger: 'axis'
							},
							grid: {
								left: '3%',
								right: '3%',
								bottom: '3%',
								containLabel: true
							},
							legend: {
								x: '50',
								data: [],
								y: '10%'
							},
							toolbox: {
								show: true,
								feature: {
									restore: {show: true}
								}
							},
							yAxis : [
								{
									type : 'category',
									data : yData
								}
							],
							xAxis : {
								minInterval: 0.1,
								type : 'value',
								axisLabel: {
				                    show: true,  
				                    interval: 'auto'
				                }
							},
							series : [
								{
									name:'',
									type:'bar',
									barWidth: '50%',
									data:[]
								}
							]
						};
						let tempData = [];
						for(var j=6;j>0;j--){
							tempData.push(data.data[0]['m'+j]);
						}
						var tmpSeries = {
							name: data.data[0].name,
							type: 'bar',
							data: tempData,
							barMinHeight: 10,
							id: data.data[0].reportYear
						};
						seriesData.push(tmpSeries);
						legendData.push(data.data[0].name);
						option.series = seriesData;
						option.legend.data = legendData;
						//let dom = document.getElementById("chartsBenford");
						doc.append('<div id="chartsBarSplitBenford' + i + '" data-height="200" style="height: 250px"></div>')
						let dom = document.getElementById("chartsBarSplitBenford" + i);
						let myChart = echarts.init(dom);

						if (option && typeof option === "object") {
							myChart.setOption(option, true);
							chartSplitBarClick(myChart, monthParam);
						}
					}
				}else{
					doc.append('没有数据')
				}
			}
		});
	}
	/** 金额分层柱状图点击 */
	function chartSplitBarClick(elem, monthParam) {
		elem.off('click');
		elem.on('click', function(e) {
			console.log(e);
			monthParam[e.name].split(',');
			detail_view.localParam.urlparam.param5 = '';
			detail_view.localParam.urlparam.param6 = monthParam[e.name].split(',')[0];
			detail_view.localParam.urlparam.param7 = monthParam[e.name].split(',')[1];
			BdoDataTable('benforddetail_table', detail_view);
			benfordBarChartInit(detail_view.localParam.urlparam);
		});
	}
});
