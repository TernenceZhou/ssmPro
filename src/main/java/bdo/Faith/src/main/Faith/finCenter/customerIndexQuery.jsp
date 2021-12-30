<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<%@ include file="/finCenter/analysisModel.jsp" %>
<style type="text/css">
	.rightNav {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 9;
		width: 20px;
		cursor: pointer;
		margin: 150px 0 0 0;
	}

	.rightNav a {
		display: block;
		position: relative;
		height: 30px;
		line-height: 30px;
		margin-bottom: 2px;
		background: #fff;
		padding-right: 10px;
		width: 110px;
		overflow: hidden;
		cursor: pointer;
	}

	.rightNav a em {
		display: block;
		float: left;
		width: 30px;
		background: #509CF6;
		color: #fff;
		font-size: 16px;
		text-align: center;
		margin-right: 10px;
		font-style: normal;
	}
	body.modal-open {
	    overflow: auto;
		height: 100%;
		-webkit-overflow-scrolling: touch;
	}
</style>
<div id="right-fixed-nav" class="rightNav">
	<a href="javascript:void(0);" onclick='_scrollTo("node-1")'><em>1</em>指标分析</a>
	<a href="javascript:void(0);" onclick='_scrollTo("node-2")'><em>2</em>主要指标</a>
	<a href="javascript:void(0);" onclick='_scrollTo("node-3")'><em>3</em>报表数据</a>
	<a href="javascript:void(0);" onclick='_scrollTo("node-4")'><em>4</em>杜邦分析</a>
	<a href="javascript:void(0);" onclick='_scrollTo("node-5")'><em>5</em>报表列表</a>
	<a href="javascript:void(0);" onclick='_scrollTo("node-6")'><em>6</em>监管消息</a>
	<a href="javascript:void(0);" onclick='_scrollTo("node-7")'><em>7</em>本福特</a>
	<a href="javascript:void(0);" onclick='_scrollTo("node-8")'><em>8</em>财务预警</a>
</div>
<script type="text/javascript">
	function _scrollTo(id) {
		window.setTimeout(movePositon(), 0);
		var _id = document.getElementById(id);
		window.scrollTo(0, $(_id).offset().top);
	}
	function movePositon() {
		$('html,body').removeAttr("style");
	}
	var btb = $(".rightNav");
	var tempS;
	$(".rightNav").hover(function() {
		var thisObj = $(this);
		tempS = setTimeout(function() {
			thisObj.animate({width: "120px"}, 300);
			thisObj.find("a").each(function(i) {
				var tA = $(this);
				setTimeout(function() {
					tA.animate({right: "0"}, 300);
				}, 50 * i);
			});
		}, 200);
	}, function() {
		if (tempS) {
			clearTimeout(tempS);
		}
		$(this).animate({width: "20px"}, 300);
		$(this).find("a").each(function(i) {
			var tA = $(this);
			setTimeout(function() {
				tA.animate({right: "0"}, 300);
			}, 50 * i);
		});
	});
</script>
<div class="content">
	<input type="text" style="display:none" id="projectId"/>
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_analysis">
			<li class="active"><a href="#tab_analysisser" class="langConvert" propKey="companyQuotaAnalysis">公司指标分析</a>
			</li>
			<!-- <li><a href="#tab_industryshow" class="langConvert" propKey="industryQuotaAnalysis">行业均值分析</a></li> -->
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
			<li class="pull-right"><a style="color:red"><span id="windCustomer"></span></a></li>
			<li class="pull-right"><a style="color:red"><span id="bdoCustomer"></span></a></li>
		</ul>
		<div class="tab-content" id="tab_analysis_content">
			<div class="tab-pane active" id="tab_analysisser">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<!-- <li>
									<button id="showProjectModal" type="button">
										<i class="fa fa-book langConvert" style="color: white;" propKey="">&nbsp;选择项目</i>
									</button>
								</li> -->
								<li>
									<button id="companyCard" type="button">
										<i class="fa fa-home langConvert" style="color: white;" propKey="companyCard">&nbsp;公司名片</i>
									</button>
								</li>
								<li>
									<button id="analysis_search" type="button">
										<i class="fa fa-search langConvert" style="color: white;" propKey="search">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="analysis_clear" type="button">
										<i class="fa fa-repeat langConvert" style="color: white;" propKey="reset">&nbsp;重置</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title langConvert" propKey="setSearchCondition">查询条件设定</h3>
						</div>
						<div id="search-condition" class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select id="slpk" class="form-control selectpicker"
													data-live-search="true"></select>
											<label for="slpk" class="langConvert" propKey="companyName">公司名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="stock_code">
											<label for="stock_code" class="langConvert" propKey="stockCode">股票代码</label>
										</div>
									</div>
								</div>
								<!-- <div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="form-control selectpicker" id="analysis_period"
													multiple="true">
												<option></option>
											</select> <label for="analysis_period" class="langConvert"
															 propKey="reportPeriod">报告类型</label>
										</div>
									</div>
								</div> -->
								<div class="form-group has-info">
									<div class="col-sm-3">
										<div class="form-material input-group">
											<input class="form-control selectDate" type="text" id="customer_startdate"
												   autocomplete="off"
												   value="">
											<span class="input-group-addon">~</span>
											<input class="form-control selectDate" type="text" id="customer_enddate"
												   autocomplete="off"
												   value="">
											<label for="analysis_startdate" class="langConvert"
												   propKey="startAndStopTime">起止日期</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<a id="node-1" style="position: relative;top: -60px;"></a>
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle" style="color: white;"></button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title langConvert" propKey="quotaAnalysis">指标分析<span id="validDate"></span></h3>
						</div>
						<div class="block-content">
							<ul id="chartsTab" class="nav nav-tabs">
								<li><a href="#chartsForPeriod" tableId="analysisForPeriod" data-toggle="tab"
									   class="langConvert" propKey="byPeriod">
									按季度</a></li>
								<li class="active"><a href="#chartsForYear" tableId="analysisForYear" data-toggle="tab"
													  class="langConvert" propKey="byYear">按年度</a>
								</li>
							</ul>
							<div id="chartsTabContent" class="tab-content">
								<div class="tab-pane fade" id="chartsForPeriod">
									<div class="block-content" id="analysisForPeriod">
										<ul id="chartsPeriodTab" class="nav nav-tabs">
											<li class="active"><a href="#chartsPeriodProfit" data-toggle="tab"
																  tableId="chartsProfitForPeriod" class="langConvert"
																  propKey="businessPerformance">
												经营业绩</a></li>
											<li><a href="#chartsPeriodBalance" data-toggle="tab"
												   tableId="chartsBalanceForPeriod" class="langConvert"
												   propKey="assetStatus">资产状况</a></li>
											<li><a href="#chartsPeriodCash" data-toggle="tab"
												   tableId="chartsCashForPeriod" class="langConvert" propKey="cashFlow">现金流</a>
											</li>
										</ul>
										<div class="tab-pane fade  active in" id="chartsPeriodProfit">
											<div class="block-content row" id="chartsProfitForPeriod">

											</div>
										</div>
										<div class="tab-pane fade" id="chartsPeriodBalance">
											<div class="block-content row" id="chartsBalanceForPeriod">

											</div>
										</div>
										<div class="tab-pane fade" id="chartsPeriodCash">
											<div class="block-content row" id="chartsCashForPeriod">

											</div>
										</div>
									</div>
								</div>
								<div class="tab-pane fade in active" id="chartsForYear">
									<div class="block-content" id="analysisForYear">
										<ul id="chartsYearTab" class="nav nav-tabs">
											<li class="active"><a href="#chartsYearProfit" data-toggle="tab"
																  tableId="chartsProfitForYear" class="langConvert"
																  propKey="businessPerformance">
												经营业绩</a></li>
											<li><a href="#chartsYearBalance" data-toggle="tab"
												   tableId="chartsBalanceForYear" class="langConvert"
												   propKey="assetStatus">资产状况</a></li>
											<li><a href="#chartsYearCash" data-toggle="tab"
												   tableId="chartsCashForYear" class="langConvert" propKey="cashFlow">现金流</a>
											</li>
										</ul>
										<div class="tab-pane fade active in" id="chartsYearProfit">
											<div class="block-content row" id="chartsProfitForYear">

											</div>
										</div>
										<div class="tab-pane fade" id="chartsYearBalance">
											<div class="block-content row" id="chartsBalanceForYear">

											</div>
										</div>
										<div class="tab-pane fade" id="chartsYearCash">
											<div class="block-content row" id="chartsCashForYear">

											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<a id="node-2" style="position: relative;top: -60px;"></a>
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="quotaRemix" type="button">
										<i class="fa fa-area-chart" style="color: white;" title="综合走势分析"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle" style="color: white;"></button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">主要指标</h3>
						</div>
						<div class="block-content">
							<ul id="quotaTab" class="nav nav-tabs">
								<li><a href="#quotaforPeriod" data-toggle="tab"
									   tableId="quotaByPeriod_table" class="langConvert" propKey="byPeriod">
									按季度</a></li>
								<li class="active"><a href="#quotaforYear" data-toggle="tab"
													  tableId="quotaByYear_table" class="langConvert" propKey="byYear">按年度</a>
								</li>
							</ul>
							<div id="quotaTabContent" class="tab-content">
								<div class="tab-pane fade" id="quotaforPeriod">
									<div class="block-content">
										<table id="quotaByPeriod_table"
											   class="table table-bordered table-striped table-hover">
										</table>
									</div>
								</div>
								<div class="tab-pane fade in active" id="quotaforYear">
									<div class="block-content">
										<table id="quotaByYear_table"
											   class="table table-bordered table-striped table-hover">
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<a id="node-3" style="position: relative;top: -60px;"></a>
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="abstractRemix" type="button">
										<i class="fa fa-area-chart" style="color: white;" title="综合走势分析"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle" style="color: white;"></button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">报表数据</h3>
						</div>
						<div class="block-content">
							<ul id="abstractTab" class="nav nav-tabs">
								<li><a href="#abstractforPeriod" data-toggle="tab"
									   tableId="abstractByPeriod_table" class="langConvert" propKey="byPeriod">
									按季度</a></li>
								<li class="active"><a href="#abstractforYear" data-toggle="tab"
													  tableId="abstractByYear_table" class="langConvert"
													  propKey="byYear">按年度</a>
								</li>
							</ul>
							<div id="abstractTabContent" class="tab-content">
								<div class="tab-pane fade " id="abstractforPeriod">
									<div class="block-content">
										<table id="abstractByPeriod_table"
											   class="table table-bordered table-striped table-hover">
										</table>
									</div>
								</div>
								<div class="tab-pane fade in active" id="abstractforYear">
									<div class="block-content">
										<table id="abstractByYear_table"
											   class="table table-bordered table-striped table-hover">
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<a id="node-4" style="position: relative;top: -60px;"></a>
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle" style="color: white;"></button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">杜邦分析</h3>
						</div>
						<div class="block-content">
							<ul id="duPontTab" class="nav nav-tabs">
								<li><a href="#duPontforPeriod" data-toggle="tab"
									   tableId="duPontforPeriod" class="langConvert" propKey="byPeriod">
									按季度</a></li>
								<li class="active"><a href="#duPontforYear" data-toggle="tab" tableId="duPontforYear"
													  class="langConvert" propKey="byYear">按年度</a>
								</li>
							</ul>
							<div id="duPontTabContent" class="tab-content">
								<div class="tab-pane fade " id="duPontforPeriod">
								</div>
								<div class="tab-pane fade in active" id="duPontforYear">
								</div>
							</div>
						</div>
						<div class="block-content" style="display: none" id="duPontContent">
							<div style="height: 57px">
								<ul id="duPontDateUl">
									<li>
									</li>
								</ul>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_01.jpg');width: 958px;height: 57px">
								<p style="height: 17px;width: 119px;left: 460px;top: 33px;position: relative"
								   id="row1Cell1">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_02.jpg');width: 958px;height: 55px">
								<p style="height: 17px;width: 119px;left: 305px;top: 29px;position: relative;float: left"
								   id="row2Cell1">-</p>
								<p style="height: 17px;width: 119px;left: 420px;top: 29px;position: relative;float: left"
								   id="row2Cell2">-</p>
								<p style="height: 17px;width: 119px;left: 545px;top: 29px;position: relative;float: left"
								   id="row2Cell3">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_03.jpg');width: 958px;height: 55px">
								<p style="height: 17px;width: 119px;left: 150px;top: 29px;position: relative;float: left"
								   id="row3Cell1">-</p>
								<p style="height: 17px;width: 119px;left: 350px;top: 29px;position: relative;float: left"
								   id="row3Cell2">-</p>
								<p style="height: 17px;width: 119px;left: 545px;top: 29px;position: relative;float: left"
								   id="row3Cell3">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_04.jpg');width: 958px;height: 55px">
								<p style="height: 17px;width: 119px;left: 70px;top: 29px;position: relative;float: left"
								   id="row4Cell1">-</p>
								<p style="height: 17px;width: 119px;left: 110px;top: 29px;position: relative;float: left"
								   id="row4Cell2">-</p>
								<p style="height: 17px;width: 119px;left: 150px;top: 29px;position: relative;float: left"
								   id="row4Cell3">-</p>
								<p style="height: 17px;width: 119px;left: 185px;top: 29px;position: relative;float: left"
								   id="row4Cell4">-</p>
								<p style="height: 17px;width: 119px;left: 225px;top: 29px;position: relative;float: left"
								   id="row4Cell5">-</p>
								<p style="height: 17px;width: 119px;left: 265px;top: 29px;position: relative;float: left"
								   id="row4Cell6">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_05.jpg');width: 958px;height: 55px">
								<p style="height: 17px;width: 119px;left: 70px;top: 29px;position: relative;float: left"
								   id="row5Cell1">-</p>
								<p style="height: 17px;width: 119px;left: 110px;top: 29px;position: relative;float: left"
								   id="row5Cell2">-</p>
								<p style="height: 17px;width: 119px;left: 305px;top: 29px;position: relative;float: left"
								   id="row5Cell3">-</p>
								<p style="height: 17px;width: 119px;left: 345px;top: 29px;position: relative;float: left"
								   id="row5Cell4">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_06.jpg');width: 958px;height: 49px">
								<p style="height: 17px;width: 119px;left: 70px;top: 29px;position: relative;float: left"
								   id="row6Cell1">-</p>
								<p style="height: 17px;width: 119px;left: 110px;top: 29px;position: relative;float: left"
								   id="row6Cell2">-</p>
								<p style="height: 17px;width: 119px;left: 150px;top: 29px;position: relative;float: left"
								   id="row6Cell3">-</p>
								<p style="height: 17px;width: 119px;left: 185px;top: 29px;position: relative;float: left"
								   id="row6Cell4">-</p>
								<p style="height: 17px;width: 119px;left: 225px;top: 29px;position: relative;float: left"
								   id="row6Cell5">-</p>
								<p style="height: 17px;width: 119px;left: 265px;top: 29px;position: relative;float: left"
								   id="row6Cell6">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_07.jpg');width: 958px;height: 37px">
								<p style="height: 17px;width: 119px;left: 70px;top: 18px;position: relative;float: left"
								   id="row7Cell1">-</p>
								<p style="height: 17px;width: 119px;left: 110px;top: 18px;position: relative;float: left"
								   id="row7Cell2">-</p>
								<p style="height: 17px;width: 119px;left: 305px;top: 18px;position: relative;float: left"
								   id="row7Cell3">-</p>
								<p style="height: 17px;width: 119px;left: 345px;top: 18px;position: relative;float: left"
								   id="row7Cell4">-</p>
								<p style="height: 17px;width: 119px;left: 385px;top: 18px;position: relative;float: left"
								   id="row7Cell5">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_08.jpg');width: 958px;height: 38px">
								<p style="height: 17px;width: 119px;left: 70px;top: 18px;position: relative;float: left"
								   id="row8Cell1">-</p>
								<p style="height: 17px;width: 119px;left: 110px;top: 18px;position: relative;float: left"
								   id="row8Cell2">-</p>
								<p style="height: 17px;width: 119px;left: 150px;top: 0px;position: relative;float: left"
								   id="row8Cell3">-</p>
								<p style="height: 17px;width: 119px;left: 185px;top: 18px;position: relative;float: left"
								   id="row8Cell4">-</p>
								<p style="height: 17px;width: 119px;left: 225px;top: 18px;position: relative;float: left"
								   id="row8Cell5">-</p>
								<p style="height: 17px;width: 119px;left: 265px;top: 18px;position: relative;float: left"
								   id="row8Cell6">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_09.jpg');width: 958px;height: 38px">
								<p style="height: 17px;width: 119px;left: 70px;top: 18px;position: relative;float: left"
								   id="row9Cell1">-</p>
								<p style="height: 17px;width: 119px;left: 110px;top: 18px;position: relative;float: left"
								   id="row9Cell2">-</p>
								<p style="height: 17px;width: 119px;left: 150px;top: 0px;position: relative;float: left"
								   id="row9Cell3">-</p>
								<p style="height: 17px;width: 119px;left: 185px;top: 18px;position: relative;float: left"
								   id="row9Cell4">-</p>
								<p style="height: 17px;width: 119px;left: 225px;top: 18px;position: relative;float: left"
								   id="row9Cell5">-</p>
								<p style="height: 17px;width: 119px;left: 265px;top: 18px;position: relative;float: left"
								   id="row9Cell6">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_10.jpg');width: 958px;height: 38px">
								<p style="height: 17px;width: 119px;left: 230px;top: 18px;position: relative;float: left"
								   id="row10Cell1">-</p>
								<p style="height: 17px;width: 119px;left: 270px;top: 0px;position: relative;float: left"
								   id="row10Cell2">-</p>
								<p style="height: 17px;width: 119px;left: 305px;top: 18px;position: relative;float: left"
								   id="row10Cell3">-</p>
								<p style="height: 17px;width: 119px;left: 345px;top: 18px;position: relative;float: left"
								   id="row10Cell4">-</p>
								<p style="height: 17px;width: 119px;left: 385px;top: 18px;position: relative;float: left"
								   id="row10Cell5">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_11.jpg');width: 958px;height: 40px">
								<p style="height: 17px;width: 119px;left: 545px;top: 18px;position: relative;float: left"
								   id="row11Cell1">-</p>
								<p style="height: 17px;width: 119px;left: 585px;top: 18px;position: relative;float: left"
								   id="row11Cell2">-</p>
								<p style="height: 17px;width: 119px;left: 625px;top: 18px;position: relative;float: left"
								   id="row11Cell3">-</p>
							</div>
							<div style="background-image:url('${pageContext.request.contextPath}/images/dupont/db_w_12.jpg');width: 958px;height: 128px">
								<p style="height: 17px;width: 119px;left: 545px;top: 18px;position: relative;float: left"
								   id="row12Cell1">-</p>
							</div>
							<div>
								注：以上数据优先摘录上市公司定期报告中公布的数据，若报告期中没公布此项数据，则通过计算得出此项数据
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<a id="node-5" style="position: relative;top: -60px;"></a>
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle" style="color: white;"></button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">报表列表</h3>
						</div>
						<div class="block-content">
							<table id="analysis_table" class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
					<div class="block block-bordered">
						<a id="node-6" style="position: relative;top: -60px;"></a>
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle" style="color: white;"></button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title langConvert">监管消息</h3>
						</div>
						<div class="block-content">
							<div class="row"></div>
							<div class="row">
								<table id="superviewMsgTable"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
					</div>
					<div class="block block-bordered" id="benfordBlock" style="display:block;">
						<a id="node-7" style="position: relative;top: -60px;"></a>
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle" style="color: white;"></button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title langConvert">本福特分析</h3>
						</div>
						<div class="block-content" id="chartsBenford">

						</div>
					</div>
					<div class="block block-bordered" id="almanBlock" style="display:block;">
						<a id="node-8" style="position: relative;top: -60px;"></a>
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle" style="color: white;"></button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title langConvert">财务预警分析-阿尔曼模型</h3>
						</div>
						<div class="block-content">
							<table id="alman_table" class="table table-bordered table-striped table-hover">
							</table>
							<table id="almanSet_table" class="table table-bordered table-striped table-hover">
							</table>
							<table id="almanResult_table" class="table table-bordered table-striped table-hover">
							</table>
						</div>
						<div class="block-content" id="almanResult">
							
						</div>
						<div class="block-content" id="chartsAlman">
							
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_industryshow">
				<!-- 				<div class="content">
									<div class="block block-themed">
										<div class="block-header bg-primary">
											<ul class="block-options">
												<li>
													<button id="company_search_industry" type="button">
														<i class="fa fa-search" style="color: white;">&nbsp;公司搜索行业</i>
													</button>
												</li>
												<li>
													<button id="industry_clear" type="button">
														<i class="fa fa-repeat style="color: white;">&nbsp;重置</i>
													</button>
												</li>
												<li>
													<button type="button" data-toggle="block-option"
															data-action="content_toggle"></button>
												</li>
											</ul>
											<h3 class="block-title">公司搜索条件</h3>
										</div>
										<div id="search-condition2" class="block-search">
											<div class="row">
												<div class="form-group"></div>
												<div class="form-group has-info">
													<div class="col-sm-2">
														<div class="form-material">
															<select id="slpk2" class="form-control selectpicker  "
																	data-live-search="true" multiple data-max-options="3"></select>
															<label for="slpk2">公司名称</label>
														</div>
													</div>
												</div>
												<div class="form-group has-info">
													<div class="col-sm-2">
														<div class="form-material">
															<select class="form-control selectpicker  " id="industry_year">
																<option></option>
															</select> <label for="industry_year">行业分类年份</label>
														</div>
													</div>
												</div>
												<div class="form-group has-info">
													<div class="col-sm-2">
														<div class="form-material">
															<select class="form-control selectpicker  " id="industry_period">
																<option></option>
															</select> <label for="industry_period">行业分类季度</label>
														</div>
													</div>
												</div>
												<div class="form-group has-info">
													<div class="col-sm-2">
														<div class="form-material">
															<select class="form-control selectpicker" id="industry_standard">
																<option></option>
															</select> <label for="industry_standard">行业分类标准</label>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="block block-themed">
										<div class="block-header bg-primary">
											<ul class="block-options">
												<li>
													<button id="industry_search" type="button">
														<i class="fa fa-search" style="color: white;">&nbsp;搜索行业均值</i>
													</button>
												</li>
												<li>
													<button id="industry_clear2" type="button">
														<i class="fa fa-circle-o" style="color: white;">&nbsp;重置</i>
													</button>
												</li>
												<li>
													<button type="button" data-toggle="block-option"
															data-action="content_toggle"></button>
												</li>
											</ul>
											<h3 class="block-title">行业搜索条件</h3>
										</div>
										<div id="search-condition3" class="block-search">
											<div class="row">
												<div class="form-group"></div>
												<div class="form-group has-info">
													<div class="col-sm-2">
														<div class="form-material">
															<input class="form-control" type="text" id="analysis_industry">
															<label for="analysis_industry">行业名称</label>
														</div>
													</div>
												</div>
												<div class="form-group has-info">
													<div class="col-sm-2">
														<div class="form-material input-group">
															<input class="form-control" type="text" id="totalValue_min"
																   value="">
															<span class="input-group-addon">~</span>
															<input class="form-control" type="text" id="totalValue_max"
																   value="">
															<label for="totalValue_max">市值范围(亿)</label>
														</div>
													</div>
												</div>
												<div class="form-group has-info">
													<div class="col-sm-2">
														<div class="form-material input-group">
															<input class="form-control selectDate" type="text" id="industry_startdate"
																   value="">
															<span class="input-group-addon">~</span>
															<input class="form-control selectDate" type="text" id="industry_enddate"
																   value="">
															<label for="industry_startdate">起止日期</label>
														</div>
													</div>
												</div>
												<div class="form-group has-info">
													<div class="col-sm-2">
														<div class="form-material">
															<select class="form-control selectpicker" id="stockPalteSelect">
																<option></option>
															</select> <label for="industry_standard">板块数据</label>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="block block-bordered">
										<div class="block-header bg-primary">
											<ul class="block-options">
												<li>
													<button type="button" data-toggle="block-option"
															data-action="content_toggle" style="color: white;"></button>
												</li>
												<li>
													<button type="button" data-toggle="block-option"
															data-action="fullscreen_toggle" style="color: white;">
													</button>
												</li>
											</ul>
											<h3 class="block-title">行业指标数据</h3>
										</div>
										<div class="block-content">
											<ul id="industryTab" class="nav nav-tabs">
												<li><a href="#industryForPeriod" data-toggle="tab"
													   tableId="industryByPeriod_table" class="langConvert" propKey="byPeriod">
													按季度</a></li>
												<li class="active"><a href="#industryForYear" data-toggle="tab"
																	  tableId="industryByYear_table" class="langConvert" propKey="byYear">按年度</a>
												</li>
											</ul>
											<div id="industryTabContent" class="tab-content">
												<div class="tab-pane fade " id="industryForPeriod">
													<div class="block-content">
														<div class="row">
															<div class="col-sm-2 col-xs-2">
																<div class="form-material">
																	<select class="form-control selectpicker"
																			id="industryQuotaPeriodSelect" multiple data-max-options="3">
																		<option></option>
																	</select> <label for="industryQuotaPeriodSelect">指标选择</label>
																</div>
															</div>
															<div class="col-sm-2 col-xs-2">
																<div class="form-material">
																	<select class="form-control selectpicker"
																			id="mutiTypePeriodSelect">
																		<option></option>
																	</select> <label for="mutiTypePeriodSelect">多指标维度选择</label>
																</div>
															</div>
														</div>
														<div class="row" id="chartsIndustryForPeriod">
															<div class="col-sm-6 col-xs-6">
																<div id="quotaIndustryPeriodChart" style="width: 400px;height:550px;"></div>
															</div>
														</div>
														<div class="row">
															<div class="col-sm-2 col-xs-2">
																<div class="form-material">
																	<select class="form-control selectpicker"
																			id="industryQuotaStandardPeriod">
																		<option></option>
																	</select> <label for="industryQuotaStandardPeriod">详细数据</label>
																</div>
															</div>
															<div class="col-sm-10 col-xs-10">
																<ul id="industryPeriodDateUl">
																	<li>
																	</li>
																</ul>
															</div>
														</div>
														<div class="row">
															<div class="col-sm-7 col-xs-7">
																<div class="form-material">
																	<div id="quotaDetailIndustryPeriodChart"
																		 style="width: 550px;"></div>
																</div>
															</div>
															<div class="col-sm-5 col-xs-5">
																<div class="block-content">
																	<table id="detailQuotaIndustryTablePeriod"
																		   class="table table-bordered table-striped table-hover">
																	</table>
																</div>
															</div>
														</div>
														<div class="row">
															<div class="col-sm-2 col-xs-2">
															</div>
															<div class="col-sm-10 col-xs-10">
																<ul id="companysPeriodDateUl">
																	<li>
																	</li>
																</ul>
															</div>
														</div>
														<div class="row">
															<div class="col-sm-7 col-xs-7">
																<div class="form-material">
																	<div id="quotaDetailCompanysPeriodChart"
																		 style="width: 550px;"></div>
																</div>
															</div>
															<div class="col-sm-5 col-xs-5">
																<div class="block-content">
																	<table id="detailQuotaCompanysTablePeriod"
																		   class="table table-bordered table-striped table-hover">
																	</table>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="tab-pane fade in active" id="industryForYear">
													<div class="block-content">
														<div class="row">
															<div class="col-sm-2 col-xs-2">
																<div class="form-material">
																	<select class="form-control selectpicker"
																			id="industryQuotaYearSelect" multiple data-max-options="3">
																		<option></option>
																	</select> <label for="industryQuotaYearSelect">指标选择</label>
																</div>
															</div>
															<div class="col-sm-2 col-xs-2">
																<div class="form-material">
																	<select class="form-control selectpicker"
																			id="mutiTypeYearSelect">
																		<option></option>
																	</select> <label for="mutiTypeYearSelect">多指标维度选择</label>
																</div>
															</div>
														</div>
														<div class="row" id="chartsIndustryForYear">
															<div class="col-sm-6 col-xs-6">
																<div id="quotaIndustryYearChart" style="width: 400px;height:550px;"></div>
															</div>
														</div>
														<div class="row">
															<div class="col-sm-2 col-xs-2">
																<div class="form-material">
																	<select class="form-control selectpicker"
																			id="industryQuotaStandardYear">
																		<option></option>
																	</select> <label for="industryQuotaStandardYear">详细数据</label>
																</div>
															</div>
															<div class="col-sm-10 col-xs-10">
																<ul id="industryYearDateUl">
																	<li>
																	</li>
																</ul>
															</div>
														</div>
														<div class="row">
															<div class="col-sm-7 col-xs-7">
																<div class="form-material">
																	<div id="quotaDetailIndustryYearChart" style="width: 550px;"></div>
																</div>
															</div>
															<div class="col-sm-5 col-xs-5">
																<div class="block-content">
																	<table id="detailQuotaIndustryTableYear"
																		   class="table table-bordered table-striped table-hover">
																	</table>
																</div>
															</div>
														</div>
														<div class="row">
															<div class="col-sm-2 col-xs-2">
															</div>
															<div class="col-sm-10 col-xs-10">
																<ul id="companysYearDateUl">
																	<li>
																	</li>
																</ul>
															</div>
														</div>
														<div class="row">
															<div class="col-sm-7 col-xs-7">
																<div class="form-material">
																	<div id="quotaDetailCompanysYearChart" style="width: 550px;"></div>
																</div>
															</div>
															<div class="col-sm-5 col-xs-5">
																<div class="block-content">
																	<table id="detailQuotaCompanysTableYear"
																		   class="table table-bordered table-striped table-hover">
																	</table>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div> -->
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/finCenter/customerIndexQuery.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/industryChart.js"></script>
<script src="${pageContext.request.contextPath}/report/echarts/macarons.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>