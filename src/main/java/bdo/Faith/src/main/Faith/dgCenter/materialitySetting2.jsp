<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none !important;
	}

	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>
<div class="content" id="contentBlock">
	<div class="col-md-12">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_materset">
				<li class="active"><a>计划阶段重要性水平</a></li>
			</ul>
			<div class="block-content" id="tab_materset_content">
				<div class="block ">
					<div class="block-content">
						<from id="mater_form" class="form-horizontal push-10-t">
							<div class="form-group">
								<div class="col-sm-2 has-success">
									<div class="form-material">
										<input type="text" class="form-control" name="mater_index" value="0001"
											   disabled>
										<label>索引号</label>
									</div>
								</div>
								<div class="col-sm-2 has-success">
									<div class="form-material">
										<input type="text" class="form-control" name="mater_editer" disabled>
										<label>编制人</label>
									</div>
								</div>
								<div class="col-sm-2 has-success">
									<div class="form-material">
										<input type="text" class="form-control date-picker" name="mater_editdate"
											   disabled disabled>
										<label>编制日期</label>
									</div>
								</div>
							</div>
							<h3 class="block-title" style="margin-bottom: 20px;">重要性水平计算</h3>
							<div class="form-group">
								<div class="col-sm-1">
									<label class="css-input css-radio css-radio-primary">
										<input type="radio" name="mater_use" data-result="1"><span></span>
									</label>
								</div>
								<div class="col-sm-2 has-success">
									<div class="form-material">
										<input type="text" class="form-control" id="maternum1" name="mater_number"
											   data-result="1" disabled>
										<label>主营业务收入</label>
									</div>
								</div>
								<div class="col-sm-3">
									<span>以收入为主要考量标准</span>
								</div>
								<div class="col-sm-2">
									<span>主营业务收入×0.5%～1%</span>
								</div>
								<div class="col-sm-1" id="add" style="transform: translateX(-30px);">

								</div>
								<div class="col-sm-1 has-success">
									<div class="form-material">
										<input type="number" style="padding-top: 20px;" class="form-control"
											   name="mater_rate" data-result="1" min="0.5" max="1" disabled>
										<label>选择(%)</label>
									</div>
								</div>
								<div class="col-sm-2">
									<div class="form-material">
										<input type="text" class="form-control" name="mater_ratenum" data-result="1"
											   disabled>
										<label>建议的重要性水平</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<label class="css-input css-radio css-radio-primary">
										<input type="radio" name="mater_use" data-result="2"><span></span>
									</label>
								</div>
								<div class="col-sm-2 has-success">
									<div class="form-material">
										<input type="text" class="form-control" id="maternum2" name="mater_number"
											   data-result="2" disabled>
										<label>税前利润</label>
									</div>
								</div>
								<div class="col-sm-3">
									<span>以利润为主要考量标准</span>
								</div>
								<div class="col-sm-2">
									<span>税前利润×3% ～ 10%</span>
								</div>
								<div class="col-sm-1" id="add" style="transform: translateX(-30px);">

								</div>
								<div class="col-sm-1 has-success">
									<div class="form-material">
										<input type="number" style="padding-top: 20px;" class="form-control valid"
											   name="mater_rate" data-result="2" min="3" max="10" disabled>
										<label>选择(%)</label>
									</div>
								</div>
								<div class="col-sm-2">
									<div class="form-material">
										<input type="text" class="form-control" name="mater_ratenum" data-result="2"
											   disabled>
										<label>建议的重要性水平</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<label class="css-input css-radio css-radio-primary">
										<input type="radio" name="mater_use" data-result="3"><span></span>
									</label>
								</div>
								<div class="col-sm-2 has-success">
									<div class="form-material">
										<input type="text" class="form-control" id="maternum3" name="mater_number"
											   data-result="3" disabled>
										<label>总资产或净资产</label>
									</div>
								</div>
								<div class="col-sm-3">
									<span>以资产为主要考量标准/投资公司</span>
								</div>
								<div class="col-sm-2">
									<span>总资产×1%～2%<br>或净资产×2%～5%</span>
								</div>
								<div class="col-sm-1" id="add" style="transform: translateX(-30px);">

								</div>
								<div class="col-sm-1 has-success">
									<div class="form-material">
										<input type="number" style="padding-top: 20px;" class="form-control"
											   name="mater_rate" data-result="3" min="1" max="5" disabled>
										<label>选择(%)</label>
									</div>
								</div>
								<div class="col-sm-2">
									<div class="form-material">
										<input type="text" class="form-control" name="mater_ratenum" data-result="3"
											   disabled>
										<label>建议的重要性水平</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-1">
									<label class="css-input css-radio css-radio-primary">
										<input type="radio" name="mater_use" data-result="4"><span></span>
									</label>
								</div>
								<div class="col-sm-2 has-success">
									<div class="form-material">
										<input type="text" class="form-control" id="maternum4" name="mater_number"
											   data-result="4" disabled>
										<label>收入/费用总额</label>
									</div>
								</div>
								<div class="col-sm-3">
									<span>非盈利组织</span>
								</div>
								<div class="col-sm-2">
									<span>总收入×0.5%～2%<br>或总支出×0.5%～2%</span>
								</div>
								<div class="col-sm-1" id="add" style="transform: translateX(-30px);">

								</div>
								<div class="col-sm-1 has-success">
									<div class="form-material">
										<input type="number" style="padding-top: 20px;" class="form-control"
											   name="mater_rate" data-result="4" min="0.5" max="2" disabled>
										<label>选择(%)</label>
									</div>
								</div>
								<div class="col-sm-2">
									<div class="form-material">
										<input type="text" class="form-control" name="mater_ratenum" data-result="4"
											   disabled>
										<label>建议的重要性水平</label>
									</div>
								</div>
							</div>
							<h3 class="block-title" style="color: red;margin-bottom: 20px;">选择的重要性水平*</h3>
							<div class="form-group">
								<div class="col-sm-3">
									<div class="form-material">
										<input type="text" class="form-control" style="color:#f3b760" id="mater_surenum"
											   disabled>
									</div>
								</div>
								<div class="col-sm-3">
									<span>实际执行的重要性</span>
								</div>
								<div class="col-sm-2">
									<span>BDO标准 50%～75%</span>
								</div>
								<div class="col-sm-1" id="add" style="transform: translateX(-30px);">

								</div>
								<div class="col-sm-1 has-success">
									<div class="form-material">
										<input type="number" style="padding-top: 20px;" class="form-control"
											   name="mater_surerate" min="50" max="75" data-result="1">
										<label>选择(%)</label>
									</div>
								</div>
								<div class="col-sm-2">
									<div class="form-material">
										<input type="text" class="form-control" style="color:#f3b760"
											   name="mater_sureratenum" data-result="1" disabled>
										<label style="color: red;">建议的重要性水平*</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-3 col-sm-offset-3">
									<span>明显微小错报</span>
								</div>
								<div class="col-sm-2">
									<span>BDO标准 1%～10%</span>
								</div>
								<div class="col-sm-1" id="add" style="transform: translateX(-30px);">

								</div>
								<div class="col-sm-1 has-success">
									<div class="form-material">
										<input type="number" style="padding-top: 20px;" class="form-control"
											   name="mater_surerate" min="1" max="10" data-result="2">
										<label>选择(%)</label>
									</div>
								</div>
								<div class="col-sm-2">
									<div class="form-material">
										<input type="text" class="form-control" style="color:#f3b760"
											   name="mater_sureratenum" data-result="2" disabled>
										<label style="color: red;">建议的重要性水平*</label>
									</div>
								</div>
							</div>
						</from>
					</div>
				</div>
			</div>
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_materset1">
				<li class="active"><a
						style="background-color: #337ab7;color: white;border-radius: 0;font-weight: 600;height: 46px;padding-top: 13px;width: 158px;">审计阶段重要性水平</a>
				</li>
			</ul>
			<div class="block-content" id="tab_materset_content1">
				<from id="mater_form2" class="form-horizontal push-10-t">
					<div class="form-group">
						<div class="col-sm-4 has-success">
							<div class="form-material">
								<input type="text" style="width: 100px;" class="form-control" name="mater_profit"
									   value="1000000" disabled>
								<label>主营业务收入</label>
							</div>
						</div>
						<div class="col-sm-4 has-success">
							<div class="form-material">
								<input type="text" style="width: 100px;" class="form-control" name="mater_procent"
									   value="1%" disabled>
								<label>选择百分比(%)</label>
							</div>
						</div>
						<div class="col-sm-4 has-success">
							<div class="form-material">
								<input type="text" style="width: 200px;" class="form-control" name="mater_reason"
									   value="低于实际重要性水平！" disabled>
								<label>结果</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-6 has-success">
							<div class="form-material">
								<!-- <input type="text" class="form-control" name="mater_reason"> -->
								<textarea class="form-control" style="height: 120px;" name="mater_reason"></textarea>
								<label style="color: red;">选择理由*</label>
							</div>
						</div>
						<div class="col-sm-4" style="float:right;margin-top: 9%;">
							<button class="btn btn-md btn-primary" id="mater_set" type="submit"><i
									class="fa fa-save"></i>&nbsp;保存
							</button>
						</div>
					</div>
				</from>
			</div>
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_materset2">
				<li class="active" style="float:left;"><a
						style="background-color: #337ab7;color: white;border-radius: 0;font-weight: 600;height: 46px;padding-top: 13px;width: 158px;">文件附件</a>
				</li>
				<li style="float: right;margin-top: 13px;margin-left: 10px;margin-right: 10px;">
					<button id="refreshTableBtn" type="button"
							style="border: 0px;background-color: #f9f9f9;color: #337ab7;">
						<i class="fa fa-refresh"> 刷新</i>
					</button>
				</li>
				<li style="float: right;margin-top: 13px;">
					<button id="upload" type="button" style="border: 0px;background-color: #f9f9f9;color: #337ab7;">
						<i class="fa fa-upload"> 上传文件</i>
					</button>
				</li>
			</ul>
			<div class="block-content" id="tab_materset_content2">
				<div class="row">
					<table id="fileTable" class="table table-bordered table-striped table-hover"></table>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="materuploadTplFormModal" tabindex="-1" role="dialog"
	 aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog" style="margin-top: 50px;">
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
					<h3 class="block-title">上传文件</h3>
				</div>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" id="materuploadFileForm"></form>
			</div>
		</div>
	</div>
</div>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/template-web.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/vue.min.js"></script>--%>
<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
<%--<script src="${pageContext.request.contextPath}/bdolx/js/bdoPage.js"></script>--%>
<script src="${pageContext.request.contextPath}/dgCenter/materialitySetting2.js"></script>