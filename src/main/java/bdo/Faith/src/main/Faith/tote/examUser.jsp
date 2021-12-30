<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<div class="block-content tab-content">
			<div class="tab-pane active">

				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_exam_search" type="button">
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
									<div class="col-sm-3">
										<div class="form-material">
											<input class="form-control" type="text" id="exam_name">
											<label for="exam_name">考试名称</label>
										</div>
									</div>
								</div>
								<!-- <div class="form-group has-info">
									<div class="col-sm-3">
										<div class="form-material">
											<input class="form-control" type="text" id="subject_name">
											<label for="subject_name">科目名称</label>
										</div>
									</div>
								</div> -->
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
							<h3 class="block-title">查询结果</h3>

						</div>
						<div class="block-content">
							<table id="examTable"
								   class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="${pageContext.request.contextPath}/tote/examUser.js"></script>