<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
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
		font-size: 15px;
		color: rgba(0, 0, 0, 0.85);
		line-height: 38px;
	}
    .home .tiles.block .block-content .border-data td{
        font-size: 15px;
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
<div class="home block-content" id="correspondenceTitle" style="padding-top: 10px;">
	<div class="row" style="height: 135px;">
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 20%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="4" data-toggle="tooltip"
			   data-original-title="发函/回函" title="发函/回函" data-title="发函/回函">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">收发统计</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<!-- <div class="border-data" id="correspondenceCount1"></div>
					<div class="border-data" id="correspondenceCount2"></div> -->
					<table class="border-data" style="width:100%" border="0">
	                    <tr>
	                      <td style="width:50%">回函比例:</td>
	                      <td style="width:25%"></td>
	                      <td style="width:25%;text-align:right" id="correspondenceCount1"></td>
	                    </tr>
	                    <tr>
                          <td style="width:50%">发函/回函:</td>
                          <td style="width:25%"></td>
                          <td style="width:25%;text-align:right" id="correspondenceCount2"></td>
                        </tr>
                    </table>
					<!-- <div class="border-data" id="correspondenceCount3"></div> -->
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 20%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="1" data-toggle="tooltip"
			   data-original-title="类型统计" title="类型统计" data-title="类型统计">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">类型统计</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<!-- <div class="border-data" id="correspondenceCount4"></div>
					<div class="border-data" id="correspondenceCount5"></div> -->
					<table class="border-data" style="width:100%" border="0">
                        <tr>
                          <td style="width:50%">函证中心发出:</td>
                          <td style="width:25%" id="correspondenceCount12"></td>
                          <td style="width:25%;text-align:right" id="correspondenceCount4"></td>
                        </tr>
                        <tr>
                          <td style="width:50%">部门发出:</td>
                          <td style="width:25%" id="correspondenceCount13"></td>
                          <td style="width:25%;text-align:right" id="correspondenceCount5"></td>
                        </tr>
                    </table>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 20%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="2" data-toggle="tooltip"
			   data-original-title="回函对象统计" title="回函对象统计" data-title="回函对象统计">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">回函对象统计</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<!-- <div class="border-data" id="correspondenceCount6"></div>
                    <div class="border-data" id="correspondenceCount7"></div> -->
                    <table class="border-data" style="width:100%" border="0">
                        <tr>
                          <td style="width:50%">函证中心:</td>
                          <td style="width:25%" id="correspondenceCount14"></td>
                          <td style="width:25%;text-align:right" id="correspondenceCount6"></td>
                        </tr>
                        <tr>
                          <td style="width:50%">注册会计师:</td>
                          <td style="width:25%" id="correspondenceCount15"></td>
                          <td style="width:25%;text-align:right" id="correspondenceCount7"></td>
                        </tr>
                    </table>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 20%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="5" data-toggle="tooltip"
			   data-original-title="回函金额统计" title="回函金额统计" data-title="回函金额统计">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">回函金额统计</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<!-- <div class="border-data" id="correspondenceCount8"></div>
                    <div class="border-data" id="correspondenceCount9"></div> -->
                    <table class="border-data" style="width:100%" border="0">
                        <tr>
                          <td style="width:50%">相符:</td>
                          <td style="width:25%"></td>
                          <td style="width:25%;text-align:right" id="correspondenceCount8"></td>
                        </tr>
                        <tr>
                          <td style="width:50%"><a id="amountNotMatch">不符:</a></td>
                          <td style="width:25%"></td>
                          <td style="width:25%;text-align:right" id="correspondenceCount9"></td>
                        </tr>
                    </table>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 20%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="6" data-toggle="tooltip"
			   data-original-title="回函地址统计" title="回函地址统计" data-title="回函地址统计">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">回函地址统计</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<!-- <div class="border-data" id="correspondenceCount10"></div>
                    <div class="border-data" id="correspondenceCount11"></div> -->
                    <table class="border-data" style="width:100%" border="0">
                        <tr>
                          <td style="width:50%">相符:</td>
                          <td style="width:25%"></td>
                          <td style="width:25%;text-align:right" id="correspondenceCount10"></td>
                        </tr>
                        <tr>
                          <td style="width:50%"><a id="addressNotMatch">不符:</a></td>
                          <td style="width:25%"></td>
                          <td style="width:25%;text-align:right" id="correspondenceCount11"></td>
                        </tr>
                    </table>
				</div>
			</a>
		</div>
	</div>
</div>
<div class="content">
	<div class="block">
		<!-- <ul class="nav nav-tabs" data-toggle="tabs">
			<li class="active"><a href="#postilsPageTab">批注汇总</a></li>
		</ul> -->
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_correspondenceSummary">
            <li class="active"><a href="#tab_conformationResult">函证结果</a></li>
            <li class="pull-right">
                <ul class="block-options push-10-t push-10-r">
                    <li>
                        <button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
                    </li>
                </ul>
            </li>
        </ul>
		<div class="row" id="correspondenceSummaryPage">
			<div class="block" style="height: 100%;max-height: 100%;min-height: 100%;margin-bottom: -40px;">
				<div class="block-content block-content-full" style="padding-bottom: 0px;">
					<div id="tab_correspondenceSummary_content" class="tab-content">
						<div class="tab-pane active" id="tab_conformationResult">
							<div class="block block-themed" style="margin-bottom: 0px;">

								<div class="block-header bg-primary" style="margin-top: 10px;">
									<ul class="block-options">
										<li>
											<!-- <button id="correspondenceExportBtn" type="button" >
												<i class="fa fa-download" style="color: white;" title="导出函证详情">&nbsp;</i>
											</button> -->
										</li>
									</ul>
									<h3 class="block-title">函证汇总一览（双击行查看科目明细）</h3>
								</div>
								<div class="block-content">
									<div style="display: none">
										<input type="text" id="postilsTable_rownum">
									</div>
									<table id="correspondenceSummaryTable" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_notmatch_conformation_detail" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
     data-keyboard="false">
    <div class="modal-dialog modal-md" style="width:1200px">
        <div class="modal-content">
            <div class="block block-themed block-transparent remove-margin-b">
                <div class="block-header bg-info">
                    <ul class="block-options">
                        <li>
                            <button type="button" data-dismiss="modal">
                                <i class="si si-close"></i>
                            </button>
                        </li>
                    </ul>
                    <h3 class="block-title" id="notmatchTitle">不符明细</h3>
                </div>
            </div>
            <div class="modal-body" style="max-height:500px;">
                <table id="notmatchDetailTable"
                       class="table table-bordered table-striped table-hover">
                </table>
            </div>
            <!-- <div class="modal-footer">
                <div class="col-sm-12">
                    <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
                        <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
                    </button>
                </div>
            </div> -->
        </div>
    </div>
</div>
<div class="modal fade" id="modal_attachList" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
     data-keyboard="false">
    <div class="modal-dialog modal-md" style="width:900px">
        <div class="modal-content">
            <div class="block block-themed block-transparent remove-margin-b">
                <div class="block-header bg-info">
                    <ul class="block-options">
                        <li>
                            <button type="button" data-dismiss="modal">
                                <i class="si si-close"></i>
                            </button>
                        </li>
                    </ul>
                    <h3 class="block-title">函证附件</h3>
                </div>
            </div>
            <div class="modal-body" style="max-height:500px;">
                <div class="content">
                    <div class="block block-bordered">
                        <div class="block-header bg-primary">
                            <h3 class="block-title">函证附件</h3>
                        </div>
                        <div class="block-content">
                            <table id="attachListTable"
                                   class="table table-bordered table-striped table-hover">
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="col-sm-12">
                    <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
                        <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="${pageContext.request.contextPath}/dgCenter/correspondenceSummary.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/common/conformationDetail.js"></script>