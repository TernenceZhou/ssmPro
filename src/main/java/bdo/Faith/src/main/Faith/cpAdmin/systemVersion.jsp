<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<div class="content">
	<div class="col-lg-12">
		<h2 class="content-heading"></h2>
		<div class="block block-themed">
			<div class="block-header bg-primary ui-draggable-handle">
				<ul class="block-options">
					<li>
						<button id="btn_version_search"  type="button" >
							<i class="fa fa-search" style="color: white;">查询所有</i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">版本信息</h3>
			</div>
			<div class="block-content" id="versions">
				<ul class="list list-timeline pull-t">
					<%--<li>
						<div class="list-timeline-time">
							立信智能审计云平台<label id="firstVersion"></label></div>
							<i class="fa fa-database list-timeline-icon bg-smooth"></i>
						<div class="list-timeline-content">
							<label id="versionFirst">
								发布时间：<input id="versionFirstTime" disabled=true style= "background-color:transparent;border:0;">
							</label>
						</div>
					</li>
					<!-- 此处填写新增版本 -->
					<li>
						<div class="list-timeline-time">立信智能审计云平台<label id="secondVersion"></label></div>
							<i class="fa fa-database list-timeline-icon bg-smooth"></i>
						<div class="list-timeline-content">
							<label id="versionSecond">
								发布时间：<input  id="versionSecondTime" disabled=true style= "background-color:transparent;border:0;">
							</label>
						</div>
					</li>
					<!-- end -->--%>
				</ul>
			</div>
		</div>
	</div>
</div>



<script src="${pageContext.request.contextPath}/cpAdmin/systemVersion.js"></script>


