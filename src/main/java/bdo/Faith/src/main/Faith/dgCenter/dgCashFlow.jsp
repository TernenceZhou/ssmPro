<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<div data-toggle="slimscroll" data-always-visible="false"
	 data-rail-visible="true" data-rail-color="#777"
	 data-rail-opacity=".0" data-height="100%">
	<div id="dgCashFlowPage" style="height: 100%;">
		<div class="block">
			<div>
				<ul class="nav nav-tabs " data-toggle="tabs">
					<li class="active">
						<a href="#cashFlowTab"><h3 class="block-title">现金流量表</h3></a>
					</li>
					<li id="cashFlowExtraTabId" style="display: none;">
						<a href="#cashFlowExtraTab"><h3 class="block-title">现金流量表补充资料</h3></a>
					</li>
					<li id="cashFlowItemTabId" style="display: none;">
						<a href="#cashFlowItemTab"><h3 class="block-title">现金流量表项目</h3></a>
					</li>
					<li>
						<a href="#compareTab"><h3 class="block-title">公式法和直接法的比较</h3></a>
					</li>
				</ul>
			</div>
			<div class="block-content tab-content">
				<div class="postil-content-wrap tab-pane active" id="cashFlowTab">
					<div class="block block-themed" style="margin-bottom: 0px;">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li style="padding-right: 200px;">
									<div class="block-options form-group has-info" style="float: left;">
										<label class="col-sm-4 control-label" for="report_editer" style="text-align: right;padding-top:4px;color: #fff;width: 100px;">编制人:</label>
										<div class="form-material col-sm-8" style="margin: 0;width: 110px">
											<select class="form-control" id="report_editer" size="1" style="color: #fff;padding:0px;">
											</select>
										</div>
									</div>
								</li>
								<li>
									<button id="cashFlow_refresh" type="button">
										<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
									</button>
								</li>
								<li>
									<button id="cashFlow_reset" type="button">
										<i class="fa fa-power-off red-light" title="重置"></i>
									</button>
								</li>
								<li>
									<button id="cashFlow_check" type="button">
										<i class="fa fa-check" style="color: white;" title="确认完成"></i>
									</button>
								</li>
								<li>
									<button id="cashFlow_import" type="button">
										<i class="fa fa-upload" style="color: white;" title="导入"></i>
									</button>
								</li>
								<li>
									<button id="cashFlow_export" type="button">
										<i class="fa fa-download" style="color: white;" title="导出"></i>
									</button>
								</li>
								<li>
									<button id="cashFlow_clone" type="button">
										<i class="fa fa-clone" style="color: white;" title="克隆其他项目的公式法底稿"></i>
									</button>
								</li>
								<li>
									<button id="check_table_hidden" type="button"
											data-toggle="tooltip" title="" data-original-title="校验项"
											style="border: 0px;background-color: #5c90d2">
										<i class="si si-arrow-down" title="校验项"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">现金流量表 <span id="remarkIndex"></span></h3>
						</div>
					</div>
					<div class="block-content" style="padding: 0px;">
						<div class="form-material" style="padding-left: 20px;">
							<div class="row">
								<label class="radio-inline">
									<input type="radio" name="method_radioOptions" value="option1">
									<button name="openXJQYFile" type="button" class="btn btn-xs btn-default push-5-r" title="打开现金流量表">
										<i class="fa fa-file-excel-o">&nbsp;公式法</i>
									</button>
								</label>
								<label class="radio-inline">
									<input type="radio" name="method_radioOptions" value="option2">
									<button name="cashFlowDirectMethod" type="button" class="btn btn-xs btn-default push-5-r" title="现金流量表直接法">
										<i class="fa fa-sign-in">&nbsp;直接法</i>
									</button>
								</label>
								<label id="cashFlowTypeText" style="padding-left: 20px;">
								</label>
							</div>
							<div class="row">
								<div id="check_intwrap" style="display: none">
									<table id="checkTable" style="margin: 0px 0px 20px 0px" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							<div class="row" style="margin-top: 10px;">
								<table id="cashFlowTable" class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
					</div>
				</div>
				<div class="postil-content-wrap tab-pane" id="cashFlowExtraTab">
					<div class="block block-themed" style="margin-bottom: 0px;">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="cashFlowExtra_openNoteFile" type="button">
										<i class="fa fa-file-excel-o" style="color: white;" title="打开现金流量表补充资料附注"></i>
									</button>
								</li>
								<li>
									<button id="cashFlowExtra_refresh" type="button">
										<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
									</button>
								</li>
								<li>
									<button id="cashFlowExtra_insert" type="button">
										<i class="fa fa-sign-in" style="color: white;" title="插入行"></i>
									</button>
								</li>
								<li>
									<button id="checkExtra_table_hidden" type="button"
											data-toggle="tooltip" title="" data-original-title="校验项"
											style="border: 0px;background-color: #5c90d2">
										<i class="si si-arrow-down" title="校验项"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">现金流量表补充资料</h3>
						</div>
					</div>
					<div class="block-content" style="padding: 0px;">
						<div class="form-material" style="padding-left: 20px;">
							<div class="row">
								<div id="checkExtra_intwrap" style="padding-bottom: 20px;display: none">
									<table id="checkExtraTable" style="margin: 0px 0px 20px 0px" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							<div class="row">
								<table id="cashFlowExtraTable" class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
					</div>
				</div>
				<div class="postil-content-wrap tab-pane" id="cashFlowItemTab">
					<div class="block block-themed" style="margin-bottom: 0px;">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="cashFlowItem_openNoteFile" type="button">
										<i class="fa fa-file-excel-o" style="color: white;" title="打开现金流量表项目附注"></i>
									</button>
								</li>
								<li>
									<button id="cashFlowItem_refresh" type="button">
										<i class="fa fa-refresh" style="color: white;" title="刷新"></i>
									</button>
								</li>
								<li>
									<button id="cashFlowItem_insert" type="button">
										<i class="fa fa-sign-in" style="color: white;" title="插入行"></i>
									</button>
								</li>
								<li>
									<button id="checkItem_table_hidden" type="button"
											data-toggle="tooltip" title="" data-original-title="校验项"
											style="border: 0px;background-color: #5c90d2">
										<i class="si si-arrow-down" title="校验项"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">现金流量表项目</h3>
						</div>
					</div>
					<div class="form-material" style="padding-left: 20px;">
							<div class="row">
								<div id="checkItem_intwrap" style="padding-bottom: 20px;display: none">
									<table id="checkItemTable" style="margin: 0px 0px 20px 0px" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							<div class="row">
								<table id="cashFlowItemTable" class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
				</div>
				<div class="postil-content-wrap tab-pane" id="compareTab">
					<table id="compareTable" class="table table-bordered table-striped table-hover"></table>
				</div>
			</div>
		</div>
		<!-- modal -->
		<div id="cashFlowUploadModal" class="modal fade" tabindex="-1" role="dialog"
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
							<h3 class="block-title">导入现金流量表（只导入上期金额）</h3>
						</div>
					</div>
					<div class="modal-body">
						<form class="form-horizontal" id="cashFlowUploadFileForm"></form>
					</div>
				</div>
			</div>
		</div>
		<div id="insertRowsModal" class="modal fade" tabindex="-1" role="dialog"
			 aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog" style="margin-top: 50px;">
				<div class="modal-content">
					<div class="block block-themed block-transparent remove-margin-b">
						<div class="block-header bg-info">
							<ul class="block-options">
								<li>
									<button class="btn btn-md btn-primary" type="button" id="insertRows_sure" title="确定">
										<i class="fa fa-send"></i>
									</button>
								</li>
								<li>
									<button type="button" data-dismiss="modal" title="关闭">
										<i class="si si-close"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">文件插入行</h3>
						</div>
					</div>
					<input type="text" id="note_type_input" style="display: none;">
					<div class="modal-body">
						<div class="row">
							<div class="col-sm-2">
								<label style="margin-top: 20px;">起始行：</label>
							</div>
							<div class="col-sm-6">
								<div class="form-material">
									<input type="text" id="startRow_insert" class="form-control" placeholder="输入起始行" oninput="value=value.replace(/[^\d]/g,'')">
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-2">
								<label style="margin-top: 20px;">行数：</label>
							</div>
							<div class="col-sm-6">
								<div class="form-material">
									<input type="text" id="rowNum_insert" class="form-control" placeholder="输入行数" oninput="value=value.replace(/[^\d]/g,'')">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="cloneProjectModal" tabindex="-1" role="dialog"
			 aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog sm" style="margin-top: 120px;">
				<div class="modal-content" style="height: 300px;">
					<div class="block block-themed block-transparent remove-margin-b">
						<div class="block-header bg-info">
							<ul class="block-options">
								<li>
									<button type="button" data-dismiss="modal">
										<i class="si si-close"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">克隆其他项目的公式法底稿</h3>
						</div>
					</div>
					<div class="modal-body" style="height:450px;padding: 5px 20px 0px 20px;">
						<div class="block-content">
							<div class="form-group">
								<div class="col-sm-12">
									<div class="form-material ">
										<input class="form-control" id="selCloneCustomerId" style="width: 100%;">
										<label for="selCloneCustomerId">客户名称</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-12">
									<div class="form-material ">
										<input class="form-control" id="selCloneProjectId" style="width: 100%;">
										<label for="selCloneProjectId">项目选择</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-12">
									<div class="form-material input-group">
										<input class="form-control" type="text" id="set_clone_auditStartDate" size=10 disabled> <span
										id="search_dateAddon" class="input-group-addon">-</span> <input
										class="form-control" type="text" id="set_clone_auditEndDate"
										size=10 disabled> <label for="set_auditStartDate">审计期间</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-14 block-options-simple">
									<br>
									<button class="btn btn-primary" type="submit" id="set_clone">
										<i class="fa fa-check"></i> 确定
									</button>
									<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
										<i class="fa fa-sign-out"></i><span>&nbsp;取消</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="cashFlowTypeModal" tabindex="-1" role="dialog"
			 aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog sm" style="margin-top: 120px;">
				<div class="modal-content" style="height: 600px;width: 1100px;">
					<div class="block block-themed block-transparent remove-margin-b">
						<div class="block-header bg-info">
							<ul class="block-options">
								<li>
									<button type="button" data-dismiss="modal">
										<i class="si si-close"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">现金流量表类型分类介绍</h3>
						</div>
					</div>
					<div class="modal-body" style="height:550px;padding: 10px 20px 0px 20px;">
						<table style="margin: 0px 0px 0px 0px" class="table table-bordered table-striped table-hover">
							<thead>
								<tr>
									<th></th>
									<th style="width: 80px;">类型</th>
									<th style="width: 100px;">经营现金净流</th>
									<th style="width: 100px;">投资现金净流</th>
									<th style="width: 100px;">筹资现金净流</th>
									<th>分析</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><img src="./dgCenter/css/images/女巫型.png" style="width: 150px;height: 150px;"></td>
									<td style="text-align: center;">女巫型</td>
									<td style="text-align: center;">+</td>
									<td style="text-align: center;">+</td>
									<td style="text-align: center;">+</td>
									<td>这种公司主营业务在现金流方面能自给自足，投资方面收益状况良好，这时仍然进行融资，如果没有新的投资机会，会造成资金浪费。主营是赚钱的，投资也是赚钱的，那还借钱干嘛？所谓事反必妖，这种公司账上的钱说不定就是有问题的，所以需要去借钱。当然，正常情况下是比较少见这种公司。</td>
								</tr>
								<tr>
									<td><img src="./dgCenter/css/images/母鸡型.png" style="width: 150px;height: 150px;"></td>
									<td style="text-align: center;">母鸡型</td>
									<td style="text-align: center;">+</td>
									<td style="text-align: center;">+</td>
									<td style="text-align: center;">-</td>
									<td>这种公司经营和投资良性循环，融资活动的负数是由于偿还借款引起，不足已威胁企业的财务状况。</td>
								</tr>
								<tr>
									<td><img src="./dgCenter/css/images/蛮牛型.png" style="width: 150px;height: 150px;"></td>
									<td style="text-align: center;">蛮牛型</td>
									<td style="text-align: center;">+</td>
									<td style="text-align: center;">-</td>
									<td style="text-align: center;">+</td>
									<td>这种公司经营状况良好，通过筹集资金进行投资，企业往往是处于扩张时期，这时我们应着重分析投资项目的盈利能力。</td>
								</tr>
								<tr>
									<td><img src="./dgCenter/css/images/奶牛型.png" style="width: 150px;height: 150px;"></td>
									<td style="text-align: center;">奶牛型</td>
									<td style="text-align: center;">+</td>
									<td style="text-align: center;">-</td>
									<td style="text-align: center;">-</td>
									<td>这种公司经营赚钱，同时还有余力对内投资以及回报债权人和股东，所以投资和筹资都是负的。这是A股最大的一个类型。</td>
								</tr>
								<tr>
									<td><img src="./dgCenter/css/images/咸鱼型.png" style="width: 150px;height: 150px;"></td>
									<td style="text-align: center;">咸鱼型</td>
									<td style="text-align: center;">-</td>
									<td style="text-align: center;">+</td>
									<td style="text-align: center;">+</td>
									<td>这种公司靠借钱维持生产经营的需要，财务状况可能恶化，应着重分析投资活动现金净流入是来自投资收益还是收回投资，如果是后者，企业的形势将非常严峻。</td>
								</tr>
								<tr>
									<td><img src="./dgCenter/css/images/躺平型.png" style="width: 150px;height: 150px;"></td>
									<td style="text-align: center;">躺平型</td>
									<td style="text-align: center;">-</td>
									<td style="text-align: center;">+</td>
									<td style="text-align: center;">-</td>
									<td>经营活动已经发出危险信号，如果投资活动现金流入主要来自收回投资，则企业将处于破产的边缘，需要高度警惕。</td>
								</tr>
								<tr>
									<td><img src="./dgCenter/css/images/赌徒型.png" style="width: 150px;height: 150px;"></td>
									<td style="text-align: center;">赌徒型</td>
									<td style="text-align: center;">-</td>
									<td style="text-align: center;">-</td>
									<td style="text-align: center;">+</td>
									<td>企业靠借债维持日常经营和生产规模的扩大，财务状况很不稳定，如果是处于投入期的企业，一旦度过难关，还可能有发展，如果是成长期或稳定期的企业，则非常危险。</td>
								</tr>
								<tr>
									<td><img src="./dgCenter/css/images/蝙蝠型.png" style="width: 150px;height: 150px;"></td>
									<td style="text-align: center;">蝙蝠型</td>
									<td style="text-align: center;">-</td>
									<td style="text-align: center;">-</td>
									<td style="text-align: center;">-</td>
									<td>企业财务状况危急，必须及时扭转，这样的情况往往发生在扩张时期，由于市场变化导致经营状况恶化，加上扩张时投入了大量资金，会使企业陷入进退两难的境地。</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div id="cashFlowResetModal" class="modal fade" tabindex="-1" role="dialog"
			 aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog" style="margin-top: 50px;">
				<div class="modal-content">
					<div class="block block-themed block-transparent remove-margin-b">
						<div class="block-header bg-info">
							<ul class="block-options">
								<li>
									<button class="btn btn-md btn-primary" type="button" id="cashFlow_reset_sure" title="确定">
										<i class="fa fa-check"></i>
									</button>
								</li>
								<li>
									<button type="button" data-dismiss="modal" title="关闭">
										<i class="si si-close"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">现金流量表重置</h3>
						</div>
					</div>
					<div class="modal-body">
						<div class="form-material" style="padding-left: 20px;">
							<div class="row">
								<label class="radio-inline">
									<input type="radio" name="reset_type" value="0" checked>
									<span></span>全部重置
								</label>
								<label class="radio-inline">
									<input type="radio" name="reset_type" value="1">
									<span></span>公式法
								</label>
								<label class="radio-inline">
									<input type="radio" name="reset_type" value="2">
									<span></span>直接法
								</label>
							</div>
						</div>
						<div class="row">
							<div id="reset_div_0" style="display: block;">
								<div style="padding-left: 20px;height: 150px;overflow-y: auto;">
									<font color="red">
										1.重置审定报表进度<br>
										2.重置现金流量表公式法底稿<br>
										3.删除现金流量表公式法底稿标签<br>
										4.删除现金流量表公式法底稿校验公式<br>
										5.重置现金流量表公式法底稿数据<br>
										6.重置现金流量表直接法数据
									</font>
								</div>
							</div>
							<div id="reset_div_1" style="display: none;">
								<div style="padding-left: 20px;height: 150px;overflow-y: auto;">
									<font color="red">
										1.重置审定报表进度<br>
										2.重置现金流量表公式法底稿<br>
										3.删除现金流量表公式法底稿标签<br>
										4.删除现金流量表公式法底稿校验公式<br>
										5.重置现金流量表公式法底稿数据
									</font>
								</div>
							</div>
							<div id="reset_div_2" style="display: none;">
								<div style="padding-left: 20px;height: 150px;overflow-y: auto;">
									<font color="red">
										1.重置审定报表进度<br>
										2.重置现金流量表直接法数据
									</font>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="${pageContext.request.contextPath}/dgCenter/dgCashFlow.js"></script>
