<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<div class="modal fade" id="modal_templatecolEditform" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md">
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
						<h3 class="block-title">修改模板报表项</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="templatecolEdit_form"></form>
				</div>
			</div>
		</div>
	</div>
	

	
	<script src="${pageContext.request.contextPath}/cpBase/templateDetail.js"></script>