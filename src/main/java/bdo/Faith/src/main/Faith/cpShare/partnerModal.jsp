<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<style>
		#modal_partner .modal-dialog{
			width:1000px;
		}
		#modal_partner .modal-body{
			height:auto;
			max-height:700px;
			overflow-y:auto;
		}
	</style>
	<div class="modal fade" id="modal_partner" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-warning">
						<ul class="block-options">
							<li>
								<button type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">简历</h3>
					</div>
				</div>
					<div class="modal-body">
						<div class="content">
							<div class="block block-themed">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button type="button" data-toggle="block-option"
												data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">基本信息</h3>
								</div>
								<div class="block-content bg-primary-dark-op">
									<table width="845px" border="0" class="push-20 text-white">
										<tr>
											<td rowspan="7" width="30%">
					                                <div id="wrokState" class="block-content ribbon ribbon-modern ribbon-danger ribbon-left">
					                                    <div class="ribbon-box">
					                                        <b><span></span></b>
					                                    </div>
					                                    <div class="text-center">
					                                        <img id="partnerPhoto" style="width: 126px;height: auto;" src="">
					                                    </div>
					                                </div>
													
				                                    <div class="row items-push">
				                                    	<div class="col-xs-3">
				                                        </div>
				                                        <div class="col-xs-3">
				                                            <div class="h3 push-5" id="partnerFocusNum">0</div>
				                                            <div class="h5 font-w300 text-warning">关注</div>
				                                        </div>
				                                        <div class="col-xs-3">
				                                            <div class="h3 push-5"  id="partnerFansNum">0</div>
				                                            <div class="h5 font-w300 text-warning">粉丝</div>
				                                        </div>
				                                        <div class="col-xs-3">
				                                        </div>
				                                    </div>
												
											    <!-- <div class="animated fadeInRight text-center">
											        <img id="partnerPhoto" style="width: 126px;height: auto;" src="">
											    </div> -->
											</td>
											<td colspan="4" height="40px">
												<div id="partnerSelf">
													<button id="focusOn" class="btn btn-sm btn-warning"><i class="fa fa-plus"></i>&nbsp;关注</button>
													<button id="focusOff" class="btn btn-sm btn-success"><i class="fa fa-check"></i>&nbsp;已关注</button>
												</div>
											</td>
										</tr>
										<tr>
											<td width="85px">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</td>
											<td width="211px"><span id="partnerName"></span></td>
											<td width="85px">所属部门:</td>
											<td width="211px"><span id="partnerDepart"></span></td>
										</tr>
										<tr>
											<td width="85px">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级:</td>
											<td width="211px"><span id="partnerRank"></span></td>
											<td width="85px">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱:</td>
											<td width="211px"><span id="partnerEmail"></span></td>
										</tr>
										<tr>
											<td width="85px">手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机:</td>
											<td width="211px"><span id="partnerMobile"></span></td>
											<td width="85px">专注行业:</td>
											<td width="211px" style="word-break:break-all;"><span id="partnerFocus"></span></td>
										</tr>
										<tr>
											<td width="85px">座&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机:</td>
											<td width="211px"><span id="partnerPhone"></span></td>
											<td width="85px">合作评价:</td>
											<td width="211px"><span id="partnerScore"></span></td>
										</tr>
										<tr>
											<td width="85px">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</td>
											<td width="211px">
												<span id="partnerMemo"></span>
												&nbsp;&nbsp;<a style="color:white;" title="维护个人业务信息" class="menu link-effect" id="partnerMemoEdit"><i class="si si-pencil"></i></a>
											</td>
											<td width="85px"></td>
											<td width="211px"></td>
										</tr>
										<tr><td colspan="4" height="40px"></td></tr>
									</table>
								</div>
							</div>
							<div class="block block-bordered" id="main_chart_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button type="button" data-toggle="block-option"
												data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">主营行业</h3>
								</div>
								<div class="block-content" align="center">
									<div id="partner_nofocus"><h2>暂无</h2></div>
									<div id="partnerFocusChart" style="width: 800px; height: 400px;"></div>
								</div>
							</div>
							<div class="block block-bordered" id="history_pro_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button type="button" data-toggle="block-option"
												data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">历史签字项目</h3>
								</div>
								<div class="block-content">
									<table id="historyPro" class="table table-bordered table-striped table-hover">
									</table>
								</div>
							</div>
							<div class="block block-bordered" id="can_apply_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button type="button" data-toggle="block-option"
												data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">可申请业务机会</h3>
								</div>
								<div class="block-content">
									<table id="canApply" class="table table-bordered table-striped table-hover">
									</table>
								</div>
							</div>
						</div>
					</div>
			</div>
		</div>
	</div>
	<script src="${pageContext.request.contextPath}/bdolx/js/bdoStyle.js"></script>
	<script src="${pageContext.request.contextPath}/assets/js/plugins/echarts/echarts.min.js"></script>
	<script src="${pageContext.request.contextPath}/cpShare/partnerModal.js"></script>