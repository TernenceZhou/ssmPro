<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>

	<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/side.css">
	<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/form.css">
	<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/dg.css">
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
	
		.home .progress.progress-none-margin {
			margin-bottom: 0px;
		}
	</style>
	<div class="home block-content" id="reviewSummaryTitle" style="padding-top: 10px;">
		<div class="row" style="height: 105px;">
			<div class="col-sm-4" style="padding-right: 0px;">
				<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="4" data-toggle="tooltip"
					data-original-title="已审核/全部" title="已审核/全部" data-title="已审核/全部">
					<div class="block-header">
						<ul class="block-options">
							<li>
								<i class="si si-info"></i>
							</li>
						</ul>
						<h3 class="block-title">底稿送审检查表</h3>
					</div>
					<div class="block-content block-content-full padding-bottom-20">
						<div class="border-data" id="reviewSummary1">&nbsp;/&nbsp;</div>
					</div>
				</a>
			</div>
			<div class="col-sm-4" style="padding-right: 0px;">
				<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="4" data-toggle="tooltip"
					data-original-title="已审核/全部" title="已审核/全部" data-title="已审核/全部">
					<div class="block-header">
						<ul class="block-options">
							<li>
								<i class="si si-info"></i>
							</li>
						</ul>
						<h3 class="block-title">对外报告审批单</h3>
					</div>
					<div class="block-content block-content-full padding-bottom-20">
						<div class="border-data" id="reviewSummary2">&nbsp;/&nbsp;</div>
					</div>
				</a>
			</div>
			<div class="col-sm-4" style="padding-right: 0px;">
				<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="4" data-toggle="tooltip"
				   data-original-title="已审核/全部" title="已审核/全部" data-title="已审核/全部">
					<div class="block-header">
						<ul class="block-options">
							<li>
								<i class="si si-info"></i>
							</li>
						</ul>
						<h3 class="block-title">档案归档审批单</h3>
					</div>
					<div class="block-content block-content-full padding-bottom-20">
						<div class="border-data" id="reviewSummary3">&nbsp;/&nbsp;</div>
					</div>
				</a>
			</div>
		</div>
	</div>
	<div class="content" id="reviewSummaryPage">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_reviewSummary">
				<li class="active"><a href="#tab_dgReviewCheck">底稿送审检查表</a></li>
				<li><a href="#tab_externalReportApproval">对外报告审批单</a></li>
				<li><a href="#tab_archivesFiledApproval">档案归档审批单</a></li>
				<li class="pull-right">
					<ul class="block-options push-10-t push-10-r">
						<li>
							<button type="button" id="btn_reset" title="重置"><i class="fa fa-refresh"></i></button>
						</li>
						<li>
							<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"><i class="si si-size-fullscreen"></i></button>
						</li>
					</ul>
				</li>
			</ul>
			<div class="block-content tab-content" id="tab_reviewSummary_content">
				<div class="tab-pane active" id="tab_dgReviewCheck">
					<div class="content">
						
					</div>
				</div>
				<div class="tab-pane" id="tab_externalReportApproval">
					<div class="content">
                        
					</div>
				</div>
				<div class="tab-pane" id="tab_archivesFiledApproval">
					<div class="content">
						
					</div>
				</div>
			</div>
		</div>
	</div>
<script src="${pageContext.request.contextPath}/dgCenter/reviewSummary.js"></script>