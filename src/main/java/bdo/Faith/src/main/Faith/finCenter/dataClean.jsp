<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_dataClean">
			<li class="active"><a id="li_dataClean" href="#tab_tab_dataClean">数据清除</a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul>
		<div class="block-content tab-content" id="tab_dataClean_content">
			<div class="tab-pane active" id="tab_tab_dataClean">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_dataClean_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="btn_dataClean_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询条件设定</h3>
						</div>
						<div id="search-condition" class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<select class="js-select2 form-control" id="dataClean_customerId"
												style="width: 100%;">
												<option></option>
											</select> <label for="dataClean_customerId">客户名称</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option" data-action="fullscreen_toggle"
										style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>
						</div>
						<div class="block-content">
							<table id="table_dataClean" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="${pageContext.request.contextPath}/finCenter/dataClean.js"></script>