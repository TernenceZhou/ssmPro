pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');

$(function(){
	var chancestateInit = echarts.init(document.getElementById('chance_state'));
	var registstateInit = echarts.init(document.getElementById('regist_state'));
	var evaluateScoreInit = echarts.init(document.getElementById('regist_evaluateScore'));
	var industryInit = echarts.init(document.getElementById('regist_industry'));
	var businessTypeInit = echarts.init(document.getElementById('regist_businessType'));
	var customerPropertiesInit = echarts.init(document.getElementById('regist_customerProperties'));
	var cooperationInit = echarts.init(document.getElementById('regist_cooperation'));
	var incomeAssignInit = echarts.init(document.getElementById('regist_incomeAssign'));
	
	$('#search_year').html(ComboDBOption('base/GeneralCombo.findStatisYear.json', false))
	$('#search_year').val((new Date()).getFullYear());
	getChartData($('#search_year').val());
	
	$('#btn_search').click(function(){
		getChartData($('#search_year').val());
	});
	
	function getChartData(nowyear){
		$.ajax({
			url : 'cpShare/ReportForm.reportFormInfo.json',
			type : "get",
			data : {
				param1 : nowyear
			},
			dataType : "json",
			success : function(data){
				var object = data.data[0];
				
				var chance_isRegist = [];
				var chance_isRegistArr = [];
				$.each(object.chance_isRegist, function(index, info){
					chance_isRegist.push({
						value : info.num,
						name : ((info.state == 0) ? '未关联' : '已关联')
					});
					chance_isRegistArr.push(((info.state == 0) ? '未关联' : '已关联'));
				});
				var option1 = {
					divName : 'chance_state',
					title : '未关联,已关联业务机会占比',
					series : '业务机会',
					obj1 : chance_isRegist,
					obj2 : chance_isRegistArr
				}
				pieChartShow(chancestateInit, option1);

				var regist_state = [];
				var regist_stateArr = [];
				$.each(object.regist_state, function(index, info){
					regist_state.push({
						value : info.num,
						name : DicVal2Nm(info.state, '业务登记单状态')
					});
					regist_stateArr.push(DicVal2Nm(info.state, '业务登记单状态'));
				});
				var option2 = {
					divName : 'regist_state',
					title : '合作中及合作完成占比',
					series : '业务登记单',
					obj1 : regist_state,
					obj2 : regist_stateArr
				}
				pieChartShow(registstateInit, option2);

				var regist_evaluateScore = [];
				var regist_evaluateScoreArr = [];
				$.each(object.regist_evaluateScore, function(index, info){
					regist_evaluateScore.push({
						value : info.num,
						name : (parseFloat(info.state)) ? parseFloat(info.state) + '分' : '未评价'
					});
					regist_evaluateScoreArr.push((parseFloat(info.state)) ? parseFloat(info.state) + '分' : '未评价');
				});
				var option3 = {
					divName : 'regist_evaluateScore',
					title : '各合作评分登记单数',
					series : '业务登记单',
					obj1 : regist_evaluateScore,
					obj2 : regist_evaluateScoreArr
				}
				pieChartShow(evaluateScoreInit, option3);

				var regist_industry = [];
				var regist_industryArr = [];
				$.each(object.regist_industry, function(index, info){
					regist_industry.push(IndustryVal2Nm(info.state));
					regist_industryArr.push(info.num);
				});
				var option4 = {
					divName : 'regist_industry',
					title : '各行业业务登记单数',
					series : '业务登记单',
					obj1 : regist_industry,
					obj2 : regist_industryArr
				}
				barChartShow(industryInit, option4);

				var regist_businessType = [];
				var regist_businessTypeArr = [];
				$.each(object.regist_businessType, function(index, info){
					regist_businessType.push(info.state);
					regist_businessTypeArr.push(info.num);
				});
				var option5 = {
					divName : 'regist_businessType',
					title : '各业务类型业务登记单数',
					series : '业务登记单',
					obj1 : regist_businessType,
					obj2 : regist_businessTypeArr
				}
				barChartShow(businessTypeInit, option5);

				var regist_customerProperties = [];
				var regist_customerPropertiesArr = [];
				$.each(object.regist_customerProperties, function(index, info){
					regist_customerProperties.push(info.state);
					regist_customerPropertiesArr.push(info.num);
				});
				var option6 = {
					divName : 'regist_customerProperties',
					title : '各客户性质业务登记单数',
					series : '业务登记单',
					obj1 : regist_customerProperties,
					obj2 : regist_customerPropertiesArr
				}
				barChartShow(customerPropertiesInit, option6);

				var regist_cooperation = [];
				var regist_cooperationArr = [];
				$.each(object.regist_cooperation, function(index, info){
					regist_cooperation.push(info.state);
					regist_cooperationArr.push(info.num);
				});
				var option7 = {
					divName : 'regist_cooperation',
					title : '各合作意向业务登记单数',
					series : '业务登记单',
					obj1 : regist_cooperation,
					obj2 : regist_cooperationArr
				}
				barChartShow(cooperationInit, option7);

				var regist_incomeAssign = [];
				var regist_incomeAssignArr = [];
				$.each(object.regist_incomeAssign, function(index, info){
					regist_incomeAssign.push(info.state);
					regist_incomeAssignArr.push(info.num);
				});
				var option8 = {
					divName : 'regist_incomeAssign',
					title : '各分配意向业务登记单数',
					series : '业务登记单',
					obj1 : regist_incomeAssign,
					obj2 : regist_incomeAssignArr
				}
				barChartShow(incomeAssignInit, option8);
			}
		});
	}
	
});

function pieChartShow(chartsInit, obj){
	option = {
	    title : {
	        text: obj.title,
	        x:'center'
	    },
//		    tooltip : {
//		        trigger: 'item',
//		        formatter: "{a} <br/>{b} : {c}条({d}%)"
//		    },
	    legend: {
	        orient: 'vertical',
	        left: 'left',
	        data: obj.obj2
	    },
	    series : [
	        {
	            name: obj.series,
	            type: 'pie',
	            label : {
					normal : {
						formatter : function(param){
							return param.name + '\n' + param.value + '条 (' + param.percent + '%)';
						}
					}
				},
				radius : '65%',
				center : [ '50%', '60%' ],
	            data:obj.obj1,
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	chartsInit.setOption(option);
}

function barChartShow(chartsInit, obj){
	option = {
	    color: ['#3398DB'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {
	            type : 'shadow'
	        }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : obj.obj1,
	            axisTick: {
	                alignWithLabel: true
	            }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:obj.series,
	            type:'bar',
	            barWidth: '60%',
	            data:obj.obj2
	        }
	    ]
	}
	chartsInit.setOption(option);
}