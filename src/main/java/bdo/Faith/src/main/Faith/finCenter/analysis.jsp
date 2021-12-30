<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<%@ include file="/finCenter/analysisModel.jsp" %>
<style type="text/css">
	.rightNav {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 9;
		width: 120px;
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
</style>


<div class="content">
	<input type="text" style="display:none" id="projectId"/>
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_analysis">

			<li class="active"><a href="#tab_industryshow" class="langConvert"
								  propKey="industryQuotaAnalysis">行业均值分析</a></li>
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

			<div class="tab-pane active" id="tab_industryshow">
				<div class="content">
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
										<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
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
											<!-- <select class="form-control selectpicker  " id="industry_year">
												<option></option>
											</select> -->
											<input id="industry_year" class="form-control date-picker" type="text"
												   autocomplete="off">
											<label for="industry_year">行业分类年份</label>
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
											<!-- <select class="form-control selectpicker" id="industry_standard">
												<option></option>
											</select> -->
											<input class="form-control" type="text" id="industry_standard">
											<label for="industry_standard">行业分类标准</label>
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
										<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
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
											<label for="industry_startdate" class="langConvert"
												   propKey="startAndStopTime">起止日期</label>
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
							<h3 class="block-title">行业指标数据<span id="validDate"></span></h3>
						</div>
						<div class="block-content">
							<ul id="industryTab" class="nav nav-tabs">
								<li><a href="#industryForPeriod" data-toggle="tab"
									   tableId="industryByPeriod_table" class="langConvert" propKey="byPeriod">
									按季度</a></li>
								<li class="active"><a href="#industryForYear" data-toggle="tab"
													  tableId="industryByYear_table" class="langConvert"
													  propKey="byYear">按年度</a>
								</li>
							</ul>
							<div id="industryTabContent" class="tab-content">
								<div class="tab-pane fade " id="industryForPeriod">
									<div class="block-content">
										<div class="row">
											<div class="col-sm-2 col-xs-2">
												<div class="form-material">
													<select class="form-control selectpicker"
															id="industryQuotaPeriodSelect" multiple data-max-options="3"
															data-size="7">
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
											<!-- <div class="col-sm-6 col-xs-6">
												<div id="quotaIndustryPeriodChart"
													 style="width: 400px;height:550px;"></div>
											</div> -->
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
										<div class="row" id="hangyequotaPeriod">
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
										<div class="row" id="quoPeriod">
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
															id="industryQuotaYearSelect" multiple data-max-options="3"
															data-size="7">
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
											<!-- <div class="col-sm-6 col-xs-6">
												<div id="quotaIndustryYearChart" style="width: 400px;height:550px;"></div>
											</div> -->
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
										<div class="row" id="hangyequotaYear">
											<!-- <div class="col-sm-7 col-xs-7">
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
											</div> -->
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
										<div class="row" id="quoYear">
											<!-- <div class="col-sm-7 col-xs-7">
												<div class="form-material">
													<div id="quotaDetailCompanysYearChart" style="width: 550px;"></div>
												</div>
											</div>
											<div class="col-sm-5 col-xs-5">
												<div class="block-content">
													<table id="detailQuotaCompanysTableYear0"
														   class="table table-bordered table-striped table-hover">
													</table>
													
												</div>
											</div> -->
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="${pageContext.request.contextPath}/finCenter/industry.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/industryChart2.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/echarts/macarons.js"></script>
<script src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>