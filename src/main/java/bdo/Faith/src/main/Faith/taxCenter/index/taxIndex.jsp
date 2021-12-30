<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<style type="text/css">
.home {
	
}

.home .tiles {
	background: rgba(255, 255, 255, 1);
	border-radius: 10px;
}

.home .tiles.block .block-header {
	padding: 20px 24px 0px 24px;
	margin-bottom: 4px;
}

.home .tiles.block .block-content {
	padding: 0px 24px 0px 24px;
	margin-bottom: 4px;
}

.home .tiles.block .block-content.padding-bottom-20 {
	padding-bottom: 20px;
}

.home .tiles.block .block-header .block-title {
	font-weight: 400;
	color: rgba(0, 0, 0, 0.45);
	line-height: 22px;
}

.home .tiles.block .block-content .border-data {
	font-size: 30px;
	color: rgba(0, 0, 0, 0.85);
	line-height: 38px;
}

.home .tiles.block .block-content .tl {
	margin: 20px 0px 0px;
	padding: 0 0;
	display: table;
	width: 100%;
}

.home .tiles.block .block-content .tl .tl-content {
	display: table-cell;
}

.home .tiles.block .block-content .tl .tl-name {
	font-size: 14px;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
	line-height: 22px;
}

.home .tiles.block .block-content .tl .tl-value {
	font-size: 12px;
	color: rgba(0, 0, 0, 0.85);
	line-height: 22px;
}

.home .tiles.block .block-content .tl .tl-content.tl-foot {
	padding-top: 10px;
}

.tiles i.color-g {
	color: #52C41A;
}

.tiles i.color-r {
	color: #F5222D;
}

.home .tiles.block .block-content .chartl {
	height: 25px;
	margin-top: 20px;
}

.home .tiles.block .block-content .chartl div {
	height: 100%;
}

.home .block .block-header .home-block-title {
	line-height: 3;
	color: #1890FF;
}

.home .block .block-header .home-block-title2 {
	line-height: 3;
}

.home .block.home-block-rounded {
	border-radius: 10px;
}
/*.home #homeProjectTableWrap .dataTables_scrollHead {
		display: none !important;
	}*/
.home .progress.progress-none-margin {
	margin-bottom: 0px;
}
</style>
<div class="home block-content" id="homePage">
	<div class="row">
		<div class="pull-right push-15-r">
			数据时间：<span id="currentTime"></span><a class="push-15-l"
				id="refreshData"><i class="fa fa-refresh" title="刷新"></i></a>
		</div>
	</div>
	<div class="row">
		<div class="col-lg-3 col-sm-3 col-xs-3">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)"
				data-toggle="tooltip" data-original-title="在审计平台中导入过财务数据的客户数量"
				title="在审计平台中导入过财务数据的客户数量" data-title="在审计平台中导入过财务数据的客户数量">
				<div class="block-header">
					<ul class="block-options">
						<li><i class="si si-info"></i></li>
					</ul>
					<h3 class="block-title">客户</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<div class="border-data" id="homeCustomerCount"></div>
					<%--<div class="chartl"></div>
					<div class="tl">
						<div class="tl-content border-t tl-foot">
							<span class="tl-name">--</span>
							<span class="tl-value">--</span>
						</div>
					</div>--%>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)"
				data-original-title="在审计平台中创建过底稿中心的项目数" title="在审计平台中创建过底稿中心的项目数"
				data-title="在审计平台中创建过底稿中心的项目数">
				<div class="block-header">
					<ul class="block-options">
						<li><i class="si si-info"></i></li>
					</ul>
					<h3 class="block-title">项目</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<div class="border-data" id="homeProjectCount"></div>
					<%--<div class="chartl">
						&lt;%&ndash;<div id="chart1"></div>&ndash;%&gt;
					</div>
					<div class="tl">
						<div class="tl-content border-t tl-foot">
							&lt;%&ndash;<span class="tl-name">日访问量  </span>
							<span class="tl-value">12,423</span>&ndash;%&gt;
							<span class="tl-name">--</span>
							<span class="tl-value">--</span>
						</div>
					</div>--%>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)"
				data-toggle="tooltip" data-original-title="在执行中的个数/已完成的项目数"
				title="在执行中的个数/已完成的项目数" data-title="在执行中的个数/已完成的项目数">
				<div class="block-header">
					<ul class="block-options">
						<li><i class="si si-info"></i></li>
					</ul>
					<h3 class="block-title">进度</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<div class="border-data" id="homeSpeedProgress"></div>
					<%--<div class="chartl">
					&lt;%&ndash;<div id="chart2"></div>&ndash;%&gt;
				</div>
				<div class="tl">
					<div class="tl-content border-t tl-foot">
						<span class="tl-name">--</span>
						<span class="tl-value">--</span>
						&lt;%&ndash;<span class="tl-name">转化率 </span>
						<span class="tl-value">60%</span>&ndash;%&gt;
					</div>
				</div>--%>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)"
				data-toggle="tooltip" data-original-title="未完成的批注/总的批注"
				title="未完成的批注/总的批注" data-title="未完成的批注/总的批注">
				<div class="block-header">
					<ul class="block-options">
						<li><i class="si si-info" data-toggle="tooltip"
							data-original-title="Edit Client"></i></li>
					</ul>
					<h3 class="block-title">批注</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20 ">
					<div class="border-data" id="homePostilCount"></div>
					<%--<div class="chartl">
						&lt;%&ndash;<div id="chart3"></div>&ndash;%&gt;
					</div>
					<div class="tl">
						<div class="tl-content border-t tl-foot">
							<span class="tl-name">--</span>
							<span class="tl-value">&lt;%&ndash;<i class="si si-question color-g" />&ndash;%&gt;--</span>
						</div>
						<div class="tl-content border-t tl-foot">
							<span class="tl-name">--</span>
							<span class="tl-value">&lt;%&ndash;<i class="si si-question color-r" />&ndash;%&gt;--</span>
						</div>
						&lt;%&ndash;<div class="tl-content border-t tl-foot">
							<span class="tl-name">周同比</span>
							<span class="tl-value"><i class="si si-question color-g" />12%</span>
						</div>
						<div class="tl-content border-t tl-foot">
							<span class="tl-name">日环比</span>
							<span class="tl-value"><i class="si si-question color-r" />11%</span>
						</div>&ndash;%&gt;
					</div>--%>
				</div>
			</a>
		</div>
	</div>
	<div class="row">
		<div class="col-lg-12">
			<div class="block home-block-rounded">
				<div class="block-header">
					<%--<ul class="block-options">
						<li>
							<div class="js-datetimepicker input-group date" style="width: 150px">
								<input class="form-control" type="text" id="startDate"
									   name="startDate" placeholder="开始日期">
								<span class="input-group-addon">
												<span class="fa fa-calendar"></span>
											</span>
							</div>
						</li>
						<li>
							<div class="js-datetimepicker input-group date" style="width: 150px">
								<input class="form-control" type="text" id="endDate"
									   name="example-datetimepicker2" placeholder="结束日期">
								<span class="input-group-addon">
												<span class="fa fa-calendar"></span>
											</span>
							</div>
						</li>
					</ul>--%>
					<!-- <h3 class="block-title home-block-title">客户账套</h3>
					<input class="form-control" type="text" id="home_detail_customerId"> -->
					<div class="row">
						<div class="col-lg-1 col-sm-3 col-xs-3">
							<div class="form-material">
								<h3 class="block-title home-block-title">客户账套</h3>
							</div>
						</div>
						<div class="col-lg-3 col-sm-3 col-xs-3">
							<div class="form-material">
								<!-- <select class="js-select2 form-control" id="home_detail_customerId"  style="width: 100%;">
									<option></option>
								</select> -->
								<input class="form-control" type="text"
									id="home_detail_customerId">
							</div>
						</div>
						<div class="col-lg-3 col-sm-3 col-xs-3">
							<div class="form-material">
								<button id="homeCustomerFinTableSearch" class="btn btn-primary"
									style="width: 100px">查询</button>
								<button id="homeCustomerFinTableReset" class="btn btn-primary"
									style="width: 100px">重置</button>
							</div>
						</div>
					</div>
				</div>
				<div class="block-content pull-t" id="homeCustomerFinTableWrap">
					<table class="table table-borderless text-center remove-margin-b"
						id="homeCustomerFinTable">
					</table>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-lg-12">
			<div class="block home-block-rounded">
				<div class="block-header">
					<%--<ul class="block-options">
						<li>
							<div class="js-datetimepicker input-group date" style="width: 150px">
								<input class="form-control" type="text" id="startDate"
									   name="startDate" placeholder="开始日期">
								<span class="input-group-addon">
												<span class="fa fa-calendar"></span>
											</span>
							</div>
						</li>
						<li>
							<div class="js-datetimepicker input-group date" style="width: 150px">
								<input class="form-control" type="text" id="endDate"
									   name="example-datetimepicker2" placeholder="结束日期">
								<span class="input-group-addon">
												<span class="fa fa-calendar"></span>
											</span>
							</div>
						</li>
					</ul>--%>
					<!-- <h3 class="block-title home-block-title">在执行的项目列表</h3> -->
					<div class="row">
						<div class="col-lg-2 col-sm-3 col-xs-3">
							<div class="form-material">
								<h3 class="block-title home-block-title">在执行的项目列表</h3>
							</div>
						</div>
						<div class="col-lg-3 col-sm-3 col-xs-3">
							<div class="form-material">
								<input class="form-control" type="text" id="home_projectName">
							</div>
						</div>
						<div class="col-lg-3 col-sm-3 col-xs-3">
							<div class="form-material">
								<button id="homeProjectTableSearch" class="btn btn-primary"
									style="width: 100px">查询</button>
								<button id="homeProjectTableReset" class="btn btn-primary"
									style="width: 100px">重置</button>
							</div>
						</div>
					</div>
				</div>
				<div class="block-content pull-t" id="homeProjectTableWrap">
					<table class="table table-borderless text-center remove-margin-b"
						id="homeProjectTable">
					</table>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-lg-12">
			<div class="block home-block-rounded">
				<div class="block-header">
					<ul class="block-options">
						<%--<li>
							<div class="js-datetimepicker input-group date" style="width: 150px">
								<input class="form-control" type="text" id="startDate"
									   name="startDate" placeholder="开始日期">
								<span class="input-group-addon">
												<span class="fa fa-calendar"></span>
											</span>
							</div>
						</li>
						<li>
							<div class="js-datetimepicker input-group date" style="width: 150px">
								<input class="form-control" type="text" id="endDate"
									   name="example-datetimepicker2" placeholder="结束日期">
								<span class="input-group-addon">
												<span class="fa fa-calendar"></span>
											</span>
							</div>
						</li>--%>
					</ul>
					<!-- <h3 class="block-title home-block-title">未完成的批注列表</h3> -->
					<div class="row">
						<div class="col-lg-2 col-sm-3 col-xs-3">
							<div class="form-material">
								<h3 class="block-title home-block-title">未完成的批注列表</h3>
							</div>
						</div>
						<div class="col-lg-3 col-sm-3 col-xs-3">
							<div class="form-material">
								<input class="form-control" type="text"
									id="home_postil_projectName">
							</div>
						</div>
						<div class="col-lg-3 col-sm-3 col-xs-3">
							<div class="form-material">
								<button id="homePostilTableSearch" class="btn btn-primary"
									style="width: 100px">查询</button>
								<button id="homePostilTableReset" class="btn btn-primary"
									style="width: 100px">重置</button>
							</div>
						</div>
					</div>
				</div>
				<div class="block-content pull-t" id="homePostilTableWrap">
					<table class="table table-borderless text-center remove-margin-b"
						id="homePostilTable">
					</table>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-lg-12">
			<div class="block home-block-rounded">
				<div class="block-header">
					<h3 class="block-title home-block-title">项目进度统计</h3>
				</div>
				<div class="block-content">
					<div class="" id="chart4" data-height="250"
						style="height: 300px; width: 100%; max-width: 100%;"></div>
				</div>
			</div>
		</div>
	</div>
</div>
<script
	src="${pageContext.request.contextPath}/taxCenter/index/taxIndex.js"></script>
