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
<div class="home block-content" id="postilsTitle" style="padding-top: 10px;">
	<div class="row" style="height: 105px;">
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 14%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="4" data-toggle="tooltip"
			   data-original-title="注会已完成批注/注会总批注" title="注会已完成批注/注会总批注" data-title="注会已完成批注/注会总批注">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">注会</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<div class="border-data" id="postilCount4"></div>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 14%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="1" data-toggle="tooltip"
			   data-original-title="一审已完成批注/一审总批注" title="一审已完成批注/一审总批注" data-title="一审已完成批注/一审总批注">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">一审</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<div class="border-data" id="postilCount1"></div>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 14%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="2" data-toggle="tooltip"
			   data-original-title="二审已完成批注/一审总批注" title="二审已完成批注/二审总批注" data-title="二审已完成批注/二审总批注">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">二审</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<div class="border-data" id="postilCount2"></div>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 14%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="5" data-toggle="tooltip"
			   data-original-title="外派已完成批注/外派总批注" title="外派已完成批注/外派总批注" data-title="外派已完成批注/外派总批注">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">外派</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<div class="border-data" id="postilCount5"></div>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 14%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="6" data-toggle="tooltip"
			   data-original-title="签字已完成批注/签字总批注" title="签字已完成批注/签字总批注" data-title="签字已完成批注/签字总批注">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">签字</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<div class="border-data" id="postilCount6"></div>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 14%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="3" data-toggle="tooltip"
			   data-original-title="三审已完成批注/三审总批注" title="三审已完成批注/三审总批注" data-title="三审已完成批注/三审总批注">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">三审</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<div class="border-data" id="postilCount3"></div>
				</div>
			</a>
		</div>
		<div class="col-lg-3 col-sm-3 col-xs-3" style="width: 14%;padding-right: 0px;">
			<a class="block block-link-hover3 tiles" href="javascript:void(0)" data-result="7" data-toggle="tooltip"
			   data-original-title="签发已完成批注/签发总批注" title="签发已完成批注/签发总批注" data-title="签发已完成批注/签发总批注">
				<div class="block-header">
					<ul class="block-options">
						<li>
							<i class="si si-info"></i>
						</li>
					</ul>
					<h3 class="block-title">签发</h3>
				</div>
				<div class="block-content block-content-full padding-bottom-20">
					<div class="border-data" id="postilCount7"></div>
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
		<div class="row" id="postilsPage">
			<div class="block" style="height: 100%;max-height: 100%;min-height: 100%;margin-bottom: -40px;">
				<div class="block-content block-content-full" style="padding-bottom: 0px;">
					<div id="navTabContent" class="tab-content">
						<div class="tab-pane active" id="postilsPageTab">
							<div class="block block-themed" style="margin-bottom: 10px;">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button id="btn_search" type="button">
												<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
											</button>
										</li>
										<li>
											<button id="btn_clear" type="button">
												<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
											</button>
										</li>
										<li>
											<button id="toggleBtn" type="button" data-toggle="block-option"
													data-action="content_toggle"><i class="si si-arrow-up"
																					style="color: white;"></i>
											</button>
										</li>
									</ul>
									<h3 class="block-title">查询条件设定</h3>
								</div>
								<div id="search-condition" class="block-search">
									<div class="row">
										<div class="form-group"></div>
										<div class="form-group has-info">
							                <div class="col-sm-2">
							                    <div class="form-material input-group">
							                        <input class="form-control" type="text" id="detail_subjectName">
							                        <label for="detail_subjectName">科目名称</label>
							                    </div>
							                </div>
							            </div>
							            <div class="form-group has-info">
							                <div class="col-sm-2">
							                    <div class="form-material input-group">
							                        <input class="form-control" type="text" id="detail_fileName">
							                        <label for="detail_fileName">节点名称</label>
							                    </div>
							                </div>
							            </div>
										<div class="form-group has-info">
											<div class="col-sm-2">
												<div class="form-material input-group">
													<input class="form-control" type="text" id="detail_content"
														   style="width: 100%;">
													<label for="detail_content">批注</label>
												</div>
											</div>
										</div>
										<div class="form-group has-info">
											<div class="col-sm-2">
												<div class="form-material input-group">
													<input class="form-control" type="text" id="detail_indexId"
														   style="width: 100%;">
													<label for="detail_indexId">索引号</label>
												</div>
											</div>
										</div>
										<div class="form-group has-info">
											<div class="col-sm-2">
												<div class="form-material">
													<select class="form-control" id="detail_auditState"
															style="width: 100%;">
														<option value="" selected="selected"></option>
														<option value="100">一审</option>
														<option value="200">二审</option>
														<option value="300">三审</option>
														<option value="400">注会</option>
														<option value="500">外派</option>
														<option value="600">签字</option>
														<option value="700">签发</option>
													</select>
													<label for="detail_auditState">质控阶段</label>
												</div>
											</div>
										</div>
										<div class="form-group has-info">
											<div class="col-sm-2">
												<div class="form-material">
													<select class="form-control" id="detail_postilLevel"
															style="width: 100%;">
														<option value=""></option>
														<option value="0">高</option>
														<option value="1">中</option>
														<option value="2">低</option>
													</select>
													<label for="detail_postilLevel">优先级</label>
												</div>
											</div>
										</div>
										<div class="form-group has-info">
											<div class="col-sm-2">
												<div class="form-material">
													<select class="form-control" id="detail_activeFlag"
															style="width: 100%;">
														<option value=""></option>
														<option value="1" selected>开启</option>
														<option value="0">关闭</option>
													</select>
													<label for="detail_activeFlag">状态</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="block block-themed" style="margin-bottom: 0px;">

								<div class="block-header bg-primary" style="margin-top: 10px;">
									<ul class="block-options">
										<li>
											<button id="postilsExportBtn" type="button" >
												<i class="fa fa-download" style="color: white;" title="导出批注详情">&nbsp;</i>
											</button>
										</li>
									</ul>
									<h3 class="block-title">批注一览</h3>
								</div>
								<div class="block-content">
									<div style="display: none">
										<input type="text" id="postilsTable_rownum">
									</div>
									<table id="postilsTable" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="postilmodal" style="left: 300px;top: 30px;" data-backdrop="static" tabindex="-1"
	 role="dialog" aria-labelledby="formulaModalLabel" aria-hidden="true">
	<div id="sideRegin"></div>
</div>
<script src="${pageContext.request.contextPath}/dgCenter/postils.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/pagePostil.js"></script>