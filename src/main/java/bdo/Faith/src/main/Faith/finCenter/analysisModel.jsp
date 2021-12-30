<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<style>
	#modal_company {
		left: 0px;
		top: 250px;
	}

	#modal_company .modal-dialog {
		width: 1000px;
	}

	#modal_company .modal-body {
		height: auto;
		max-height: 600px;
		overflow-y: auto;
	}

	#modal_quota {
		left: 0px;
		top: 25px;
	}

	#modal_quota .modal-dialog {
		width: 800px;
	}

	#modal_quota .modal-body {
		height: auto;
		max-height: 550px;
		overflow-y: auto;
	}

	#modal_reportDetail {
		left: 0px;
		top: 0px;
	}

	#modal_reportDetail .modal-dialog {
		width: 1000px;
	}

	#modal_reportDetail .modal-body {
		height: auto;
		max-height: 550px;
		overflow-y: auto;
	}

	#modal_selectProject {
		left: 0px;
		top: 250px;
	}

	#modal_selectProject .modal-dialog {
		width: 1000px;
	}

	#modal_selectProject .modal-body {
		height: auto;
		max-height: 550px;
		overflow-y: auto;
	}


</style>

<div class="modal fade" id="modal_selectProject" tabindex="-1" role="dialog"
	 aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog ">
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
					<h3 class="block-title">选择项目</h3>
				</div>
			</div>
			<div class="modal-body">
				<div class="content">
					<div class="block block-themed">
						<div id="selectProjectForm"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


<div class="modal fade" id="modal_company" tabindex="-1" role="dialog"
	 aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog">
		<div class="modal-content" id="content1">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-warning">
					<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">公司名片</h3>
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
							<table width="100%" border="0" class="push-20 text-white"
								   style="border-collapse:separate; border-spacing:10px 10px;">
								<tr>
									<td width="15%">公司简称:</td>
									<td width="35%"><span id="companyName"></span></td>
									<td width="15%">股票代码:</td>
									<td width="35%"><span id="stockCode"></span></td>
								</tr>
								<tr>
									<td width="15%">成立时间:</td>
									<td width="35%"><span id="inceptionDate"></span></td>
									<td width="15%">上市时间:</td>
									<td width="35%"><span id="ipoDate"></span></td>
								</tr>
								<tr>
									<td width="15%">所属类型:</td>
									<td width="35%"><span id="secType"></span></td>
									<td width="15%">注册资本:</td>
									<td width="35%"><span id="regcapital"></span></td>
								</tr>
								<tr>
									<td width="15%">法人代表:</td>
									<td width="35%"><span id="chairman"></span></td>
									<td width="15%">信息披露人:</td>
									<td width="35%"><span id="discloser"></span></td>
								</tr>
								<tr>
									<td width="15%">注册地址:</td>
									<td width="85%" colspan="3"><span id="address"></span></td>
								</tr>
								<tr>
									<td width="15%">办公地址:</td>
									<td width="85%" colspan="3"><span id="office"></span></td>
								</tr>
								<tr>
									<td width="15%">邮政编码:</td>
									<td width="35%"><span id="zipcode"></span></td>
									<td width="15%">电话:</td>
									<td width="35%"><span id="telephone"></span></td>
								</tr>
								<tr>
									<td width="15%">传真/邮箱:</td>
									<td width="35%"><span id="fax"></span></td>
									<td width="15%">网站:</td>
									<td width="35%"><span id="website"></span></td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modal_quota" tabindex="-1" role="dialog"
	 aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog ">
		<div class="modal-content" id="content2">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-warning">
					<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">图表分析</h3>
				</div>
			</div>
			<div class="modal-body">
				<div class="content">
					<div class="block block-themed">
						<div id="quotaChart" style="width: 700px;height:450px;"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


<div class="modal fade" id="modal_reportDetail" tabindex="-1" role="dialog"
	 aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog ">
		<div class="modal-content" id="content3">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-warning">
					<ul class="block-options">
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">报表详情</h3>
				</div>
			</div>
			<div class="modal-body">
				<div class="block block-bordered">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option"
										data-action="content_toggle" style="color: white;"></button>
							</li>
						</ul>
						<h3 class="block-title" id="detailHead">报表名称错误</h3>
					</div>
					<div class="block-content">
						<table id="analysisDetail_table" class="table table-bordered table-striped table-hover">
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/assets/js/plugins/echarts/echarts.min.js"></script>