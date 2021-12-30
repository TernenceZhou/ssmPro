<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<div class="modal fade" id="modal_jnadjustform" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog" style="width: 1200px;">

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
					<h3 class="block-title">调整分录</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height: 400px; max-height: 400px;">
				<div class="block block-bordered">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button id="jnadjust_plus" type="button">
									<i class="fa fa-plus" style="color: white;">&nbsp;添加</i>
								</button>
							</li>
							<!-- <li>
										<label class="css-input switch switch-sm switch-warning">
                                            <input type="checkbox" id="jnadjust_use" checked disabled><span></span>启用
                                        </label>
									</li> -->
						</ul>
						<h3 class="block-title">分录项</h3>
					</div>
					<div class="block-content" id="allTableContent">
						<div class="row">
							<div class="form-group"></div>
							<div class="form-group has-info">
								<div class="col-sm-4">
									<div class="form-material">
										<input class="form-control" type="text" id="jnadjust_dgName"
											   disabled> <label for="jnadjust_dgName">客户名称</label>
									</div>
								</div>
							</div>
							<div class="form-group has-info">
								<div class="col-sm-4">
									<div class="form-material">
										<input class="form-control" type="text" id="jnadjust_dgYear" disabled>
										<label for="jnadjust_dgYear">财务账套</label>
									</div>
								</div>
							</div>
							<!-- <div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<select class="form-control" id="jnadjust_vocation" disabled>
													<option></option>
												</select> <label for="jnadjust_vocation">报表模板</label>
												
												
											</div>
										</div>
									</div> -->
							<div class="form-group has-info" style="display: none">
								<div class="col-sm-4">
									<div class="form-material">
										<input class="form-control" type="text" id="jnadjust_type">
										<label for="jnadjust_type">调整类型</label>
									</div>
								</div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-sm-2 col-sm-offset-6">
								差额(借-贷) : <br/><span data-name="jnadjust_balance">0</span>
							</div>
							<div class="col-sm-2 nCol">
								贷方金额(合计) : <br/><span data-name="jnadjust_credit">0</span>
							</div>
							<div class="col-sm-2 nCol">
								借方金额(合计) : <br/><span data-name="jnadjust_debit">0</span>
							</div>
						</div>
						<div class="row">
							<table id="jnadjust_table"
								   class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button"
						id="jnadjust_save">
					<i class="fa fa-save"></i><span>&nbsp;保存</span>
				</button>
				<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_subjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false" style="top:40px;z-index: 1070;">
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
					<h3 class="block-title">选择科目</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:400px;max-height:400px">
				<div id="adsubject_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput2" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button" id="modal_subject_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_subject_sure">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_assitem" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false" style="top:40px;z-index: 1060">
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
					<h3 class="block-title">选择辅助核算</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height:400px;max-height:400px">
				<div id="assitem_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput3" placeholder="搜索客户">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button" id="modal_assitem_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button" id="modal_assitem_sure">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- <script src="${pageContext.request.contextPath}/dgCenter/common/journalAdjust.js"></script> -->
<script src="${pageContext.request.contextPath}/dgCenter/common/DG_CONST_STATE.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/js/dg/adjust.js"></script>
