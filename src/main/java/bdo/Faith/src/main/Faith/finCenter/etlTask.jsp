<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<!-- <ul class="nav nav-tabs" data-toggle="tabs" id="tab_detailaccount">
			<li class="active"><a href="#tab_tab_detailaccountser">etl任务</a></li>
			<li class="pull-right">
                <ul class="block-options push-10-t push-10-r">
                    <li>
                        <button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
                    </li>
                </ul>
            </li>
		</ul> -->
		<div class="block-content tab-content">
			<div class="tab-pane active">

				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_etlTask_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询条件设定</h3>
						</div>
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-4">
										<div class="form-material">
											<input class="form-control" id="etlTask_customerId" type="text">
											<label for="etlTask_customerId">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<select class="form-control" id="etlTask_isImported">
												<option value=''>全部</option>
												<option value='0'>等待etl</option>
												<option value='1'>etl中</option>
												<option value='2'>etl完成</option>
											</select>
											<label for="etlTask_isImported">etl状态</label>
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
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>

						</div>
						<div class="block-content">
							<table id="etlTaskTable"
								   class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="${pageContext.request.contextPath}/finCenter/etlTask.js"></script>