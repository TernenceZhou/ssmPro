<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<style>
	#modal_personal .modal-dialog {
		width: 1000px;
	}

	#modal_personal .modal-body {
		height: auto;
		max-height: 700px;
		overflow-y: auto;
	}
</style>
<div class="modal fade" id="modal_personal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-warning">
					<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal"><i class="si si-close"></i></button>
						</li>
					</ul>
					<h3 class="block-title">简历</h3>
				</div>
			</div>
			<div class="modal-body">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option" data-action="content_toggle" style="color: white;"></button>
							</li>
						</ul>
						<h3 class="block-title">基本信息</h3>
					</div>
					<div class="block-content bg-primary-dark-op">
						<div id="getSacpce" style="position:absolute;top:10%;right:5%;cursor:pointer;"><img 
								src="./img/sacpce.png" style="width:80px;"></div>
						<table width="845px" border="0" class="push-20 text-white">
							<tr>
								<td rowspan="7" width="30%">
									<div id="wrokState" class="block-content ribbon ribbon-modern ribbon-danger ribbon-left">
										<div class="ribbon-box">
											<b><span></span></b>
										</div>
										<div class="text-center">
											<img id="personalPhoto" style="width: 126px; height: auto;" src="">
										</div>
									</div>
									<div class="row items-push">
										<div class="col-xs-3"></div>
										<div class="col-xs-3">
											<div class="h3 push-5" id="personalFocusNum">0</div>
											<div class="h5 font-w300 text-warning">关注</div>
										</div>
										<div class="col-xs-3">
											<div class="h3 push-5" id="personalFansNum">0</div>
											<div class="h5 font-w300 text-warning">粉丝</div>
										</div>
										<div class="col-xs-3"></div>
									</div>
								</td>
								<td colspan="4" height="40px">
									<div id="personalSelf">
										<button id="focusOn" class="btn btn-sm btn-warning">
											<i class="fa fa-plus"></i>&nbsp;关注
										</button>
										<button id="focusOff" class="btn btn-sm btn-success">
											<i class="fa fa-check"></i>&nbsp;已关注
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td width="85px">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</td>
								<td width="211px"><span id="personalName"></span></td>
								<td width="85px">所属部门:</td>
								<td width="211px"><span id="personalDepart"></span></td>
							</tr>
							<tr>
								<td width="85px">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级:</td>
								<td width="211px"><span id="personalRank"></span></td>
								<td width="85px">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱:</td>
								<td width="211px"><span id="personalEmail"></span></td>
							</tr>
							<tr>
								<td width="85px">手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机:</td>
								<td width="211px"><span id="personalMobile"></span></td>
								<td width="85px">专注行业:</td>
								<td width="211px" style="word-break: break-all;"><span
										id="personalFocus"></span></td>
							</tr>
							<tr>
								<td width="85px">座&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机:</td>
								<td width="211px"><span id="personalPhone"></span></td>
								<td width="85px">合作评价:</td>
								<td width="211px"><span id="personalScore"></span></td>
							</tr>
							<tr>
								<td width="85px">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</td>
								<td width="211px"><span id="personalMemo"></span>
									&nbsp;&nbsp;<a style="color: white;" title="维护个人业务信息"
												   class="menu link-effect" id="personalMemoEdit"><i
											class="si si-pencil"></i></a></td>
								<td width="85px"></td>
								<td width="211px"></td>
							</tr>
							<tr>
								<td colspan="4" height="40px"></td>
							</tr>
						</table>
					</div>
				</div>
				<div id="main_chart_div" class="block block-bordered" style="display: none">
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
				<div id="history_pro_div" class="block block-bordered" style="display: none">
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
				<div class="block block-bordered">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option" data-action="content_toggle" style="color: white;"></button>
							</li>
						</ul>
						<h3 class="block-title">项目信息</h3>
					</div>
					<div class="block-content">
						<table id="user_project_count" class="table table-bordered table-striped table-hover">
							<thead>
							<tr><th rowspan="2">项目年份</th><th colspan="3">重大项目</th><th colspan="3">非重大项目</th></tr>
							<tr><th>一审经理</th><th>项目负责人</th><th>项目组成员</th><th>一审经理</th><th>项目负责人</th><th>项目组成员</th></tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_project" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog" style="width:1000px;">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal"><i class="si si-close"></i></button>
						</li>
					</ul>
					<h3 class="block-title">项目</h3>
				</div>
			</div>
			<div class="modal-body">
				<div class="block-content">
					<table id="user_project_detail" class="table table-bordered table-striped table-hover"></table>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="personal-modal-sacpce" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="true" data-keyboard="true">
	<div class="modal-dialog" style="width:1000px;">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal"><i class="si si-close"></i></button>
						</li>
					</ul>
					<h3 class="block-title">SACP证书</h3>
				</div>
			</div>
			<div class="modal-body" style="max-height:800px;">
				<img id="personal-modal-sacpce-img" style="width:100%;">
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoStyle.js"></script>
<script src="${pageContext.request.contextPath}/cpBase/personalInfo.js"></script>