<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>

<div class="content">
	<div class="col-md-12">
		<div class="block">
			<ul class="nav nav-tabs" data-toggle="tabs" id="tab_materset">
				<li class="active"><a href="tab_materset">重要性水平设置</a></li>
			</ul>
			<div class="block-content" id="tab_materset_content">
				<div class="block ">
					<div class="block-content">
						<form id="mater_form">
							<div class="row">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group">
										<div class="col-sm-2 has-success">
											<div class="form-material">
												<input type="text" class="form-control" name="mater_index" value="0001"
													   readonly>
												<label>索引号</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2 has-success">
											<div class="form-material">
												<input type="text" class="form-control" name="mater_editer" readonly>
												<label>编制人</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2 has-success">
											<div class="form-material">
												<input type="text" class="form-control date-picker"
													   name="mater_editdate" disabled>
												<label>编制日期</label>
											</div>
										</div>
									</div>
									<!-- <div class="form-group">
										<div class="col-sm-2">
											<div class="form-material">
												<input type="text" class="form-control" name="mater_unit">
												<label>被审计单位</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2">
											<div class="form-material">
												<input type="text" class="form-control" name="mater_reviewer">
												<label>复核人</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2">
											<div class="form-material">
												<input type="text" class="form-control date-picker" name="mater_reviewdate">
												<label>复核日期</label>
											</div>
										</div>
									</div> -->
								</div>
								<!-- <div class="row">
									<div class="form-group"></div>
									<div class="form-group">
										<div class="col-sm-2">
											<div class="form-material">
												<input type="text" class="form-control date-picker" name="mater_date">
												<label>所属时期</label>
											</div>
										</div>
									</div>
								</div> -->
							</div>
							<br>
							<div class="row">
								<h3 class="block-title">重要性水平计算</h3>
							</div>
							<div class="row">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group">
										<div class="col-sm-1">
											<label class="css-input css-radio css-radio-primary">
												<input type="radio" name="mater_use" checked
													   data-result="1"><span></span>
											</label>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2 has-success">
											<div class="form-material">
												<input type="text" class="form-control" id="maternum1"
													   name="mater_number" data-result="1">
												<label>主营业务收入</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>以收入为主要考量标准</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>主营业务收入×0.5%～1%</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-1 has-success">
											<div class="form-material">
												<input type="number" style="padding-top: 20px;" class="form-control"
													   name="mater_rate" data-result="1">
												<label>选择(%)</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2">
											<div class="form-material">
												<input type="text" class="form-control" name="mater_ratenum"
													   data-result="1" disabled>
												<label>建议的重要性水平</label>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group">
										<div class="col-sm-1">
											<label class="css-input css-radio css-radio-primary">
												<input type="radio" name="mater_use" data-result="2"><span></span>
											</label>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2 has-success">
											<div class="form-material">
												<input type="text" class="form-control" id="maternum2"
													   name="mater_number" data-result="2">
												<label>税前利润</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>以利润为主要考量标准</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>税前利润×3% ～ 10%</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-1 has-success">
											<div class="form-material">
												<input type="number" style="padding-top: 20px;" class="form-control"
													   name="mater_rate" data-result="2">
												<label>选择(%)</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2">
											<div class="form-material">
												<input type="text" class="form-control" name="mater_ratenum"
													   data-result="2" disabled>
												<label>建议的重要性水平</label>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group">
										<div class="col-sm-1">
											<label class="css-input css-radio css-radio-primary">
												<input type="radio" name="mater_use" data-result="3"><span></span>
											</label>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2 has-success">
											<div class="form-material">
												<input type="text" class="form-control" id="maternum3"
													   name="mater_number" data-result="3">
												<label>总资产或净资产</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>以资产为主要考量标准/投资公司</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>总资产×1%～2%<br>或净资产×2%～5%</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-1 has-success">
											<div class="form-material">
												<input type="number" style="padding-top: 20px;" class="form-control"
													   name="mater_rate" data-result="3">
												<label>选择(%)</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2">
											<div class="form-material">
												<input type="text" class="form-control" name="mater_ratenum"
													   data-result="3" disabled>
												<label>建议的重要性水平</label>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group">
										<div class="col-sm-1">
											<label class="css-input css-radio css-radio-primary">
												<input type="radio" name="mater_use" data-result="4"><span></span>
											</label>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2 has-success">
											<div class="form-material">
												<input type="text" class="form-control" id="maternum4"
													   name="mater_number" data-result="4">
												<label>收入/费用总额</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>非盈利组织</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>总收入×0.5%～2%<br>或总支出×0.5%～2%</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-1 has-success">
											<div class="form-material">
												<input type="number" style="padding-top: 20px;" class="form-control"
													   name="mater_rate" data-result="4">
												<label>选择(%)</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2">
											<div class="form-material">
												<input type="text" class="form-control" name="mater_ratenum"
													   data-result="4" disabled>
												<label>建议的重要性水平</label>
											</div>
										</div>
									</div>
								</div>
							</div>
							<br>
							<div class="row">
								<h3 class="block-title" style="color: red;">选择的重要性水平*</h3>
							</div>
							<div class="row">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group">
										<div class="col-sm-3">
											<div class="form-material">
												<input type="text" class="form-control" style="color:#f3b760"
													   id="mater_surenum" disabled>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>实际执行的重要性</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>BDO标准 50%～75%</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-1 has-success">
											<div class="form-material">
												<input type="number" style="padding-top: 20px;" class="form-control"
													   name="mater_surerate" data-result="1">
												<label>选择(%)</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2">
											<div class="form-material">
												<input type="text" class="form-control" style="color:#f3b760"
													   name="mater_sureratenum" data-result="1" disabled>
												<label style="color: red;">建议的重要性水平*</label>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group">
										<div class="col-sm-3">
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>明显微小错报</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-3">
											<span>BDO标准 1%～10%</span>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-1 has-success">
											<div class="form-material">
												<input type="number" style="padding-top: 20px;" class="form-control"
													   name="mater_surerate" data-result="2">
												<label>选择(%)</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2">
											<div class="form-material">
												<input type="text" class="form-control" style="color:#f3b760"
													   name="mater_sureratenum" data-result="2" disabled>
												<label style="color: red;">建议的重要性水平*</label>
											</div>
										</div>
									</div>
								</div>
							</div>
							<br>
							<div class="row">
								<h3 class="block-title">选择理由</h3>
							</div>
							<div class="row">
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group">
										<div class="col-sm-6 has-success">
											<div class="form-material">
												<!-- <input type="text" class="form-control" name="mater_reason"> -->
												<textarea class="form-control" style="height: 120px;"
														  name="mater_reason"></textarea>
											</div>
										</div>
									</div>
								</div>
							</div>
							<br>
							<div class="row">
								<div class="row">
									<div class="form-group"></div>
									<!-- <div class="form-group">
										<div class="col-sm-2 has-success">
											<div class="form-material ">
												<input type="text" class="form-control" name="mater_auditer">
												<label>批准人</label>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2 has-success">
											<div class="form-material ">
												<input type="text" class="form-control date-picker" name="mater_auditdate">
												<label>批准日期</label>
											</div>
										</div>
									</div> -->
									<div class="form-group">
										<div class="col-sm-6">
										</div>
									</div>
									<div class="form-group">
										<div class="col-sm-2">
											<button class="btn btn-md btn-primary" id="mater_set" type="submit"><i
													class="fa fa-save"></i>&nbsp;保存
											</button>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/dgCenter/materialitySetting.js"></script>