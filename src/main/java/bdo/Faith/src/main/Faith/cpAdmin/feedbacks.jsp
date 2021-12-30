<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<div class="block-content tab-content" id="tab_feedback_content">
			<div class="tab-pane active">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_feedback_search" type="button">
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
						<div id="search-condition" class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material">
											<input class="form-control" type="text" id="createUser">
											<label for="createUser">创建人</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material ">
											<input id="startDate" class="form-control date-picker" data-toggle="tooltip" data-placement="top"  aria-invalid="false" >
											<label for="startDate" style="color:#646464">开始日期</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-2">
										<div class="form-material ">
											<input id="endDate" class="form-control date-picker" data-toggle="tooltip" data-placement="top"  aria-invalid="false" >
											<label for="endDate" style="color:#646464">结束日期</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered" id="feedback_block">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">查询结果<span name="cus_select"></span></h3>

						</div>
						<div class="block-content">
							<table id="feedbacksForm"
								   class="table table-bordered table-striped table-hover"></table>
							<div id="hot"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="feedbackDeatilForm" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-sm modal-dialog">
		<div class="modal-content">
			<div class="block block-themed block-transparent">
				<div class="block-header bg-primary">
					<ul class="block-options">
						<li>
							<button data-dismiss="modal" type="button">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">意见详情</h3>
				</div>
				<div class="modal-body">
				    <div class="row">
						<div class="col-xs-12" >
							<%--<textarea class="form-control postil-textarea" rows="3" id="feebackContent"></textarea>--%>
							<label id="feebackContentDetails" style="height: 300px"></label>
						</div>
					</div>
					<div class="row">
					   <div class="col-xs-10" >
					       <textarea class="form-control postil-textarea" rows="3" id="replayContent"></textarea>
					   </div>
					   <div class="col-xs-2">
		                   <button class="btn btn-md btn-primary" type="button" id="btn_reply">
		                       <i class="fa fa-send"></i><span>&nbsp;回复</span>
		                   </button>
		               </div>
					</div>

				</div>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/cpAdmin/feedbacks.js"></script>