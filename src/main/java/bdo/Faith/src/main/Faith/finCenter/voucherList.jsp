<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<style>
body.modal-open {
	overflow: visible !important;
}
</style>
<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs" id="tab_voucher">
			<li class="active"><a href="#tab_voucherser">凭证查询</a></li>
			<li class=""><a href="#tab_sameVoucher">相同凭证查询</a></li>
			<li class=""><a href="#tab_sameAmountVoucher">同金额凭证查询</a></li>
			<li class=""><a href="#tab_hedgeVoucher">对冲凭证查询</a></li>
			<li><a href="#tab_groupDetail" style="display: none">分录详细&nbsp;&nbsp;<i
					class="fa fa-times-circle"></i></a></li>
			<li><a href="#tab_groupDate" style="display: none">日期详细&nbsp;&nbsp;<i
					class="fa fa-times-circle"></i></a></li>
			<li class="pull-right">
				<ul class="block-options push-10-t push-10-r">
					<li>
						<button type="button" data-toggle="block-option"
							data-action="fullscreen_toggle"></button>
					</li>
				</ul>
			</li>
		</ul>
		<div class="block-content tab-content" id="tab_voucher_content">
			<div class="tab-pane active" id="tab_voucherser">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="voucher_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="voucher_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;清空</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询条件设定</h3>
						</div>
						<div id="search-condition" class="block-search">
							<div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<select class="js-select2 form-control"
													id="search_customerId">
													<option></option>
												</select> <label for="search_customerId">客户名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material">
												<input id="search_yyyy" class="form-control date-picker"
													type="text" autocomplete="off"> <label
													for="search_yyyy">账套年份</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div id="search_dateGroup" class="form-material input-group">
												<input id="search_startDate"
													class="form-control date-picker" size=10 type="text"
													value="" autocomplete="off"> <span
													id="search_dateAddon" class="input-group-addon">-</span> <input
													id="search_endDate" class="form-control date-picker"
													size=10 type="text" value="" autocomplete="off"> <label
													for="search_dateType">凭证日期</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-3">
											<div class="form-material input-group">
												<select class="form-control" id="search_isInclude"
													placeholder="是否包含">
													<option value='1'>含</option>
													<option value='0'>不含</option>
												</select> <span class="input-group-addon"></span> <input
													class="form-control" type="text" id="search_subjectId">
												<label for="search_subjectId">科目编号</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material">
												<input class="form-control" type="text" id="search_typeId">
												<label for="search_typeId">字</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material">
												<input class="form-control" type="text"
													id="search_voucherId"> <label
													for="search_voucherId">号</label>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="summary_type">
												</select> <label for="summary_type">摘要匹配</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<input class="form-control" type="text" id="search_summary"
													placeholder="以逗号分隔,如 员工,路费"> <label
													for="search_summary">摘要关键字</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material input-group">
												<select class="form-control" id="search_moneyType">
												</select> <span class="input-group-addon"> </span> <select
													class="form-control" id="search_moneyOpt">
												</select> <span class="input-group-addon"></span> <input
													class="form-control" type="number" id="search_money">
												<label for="search_money">金额</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-2">
											<div class="form-material">
												<select class="form-control" id="search_vouchartype">
												</select> <label for="search_vouchartype">凭证类型</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material">
												<select class="form-control" id="search_viewnum">
													<option></option>
												</select> <label for="search_viewnum">显示数量</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material">
												<select class="form-control" id="search_othercurr">
													<option></option>
												</select> <label for="search_othercurr">显示外币</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="voucher_export" type="button"
										style="display: none;">
										<i class="si si-cloud-download" style="color: white;"
											title="导出"></i>
									</button>
								</li>
								<li>
									<button id="account_export_dg" type="button"
										style="display: none;">
										<i class="si si-cloud-download" style="color: white;"
											title="导出到底稿附件"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;"></button>
								</li>
							</ul>
							<h3 class="block-title">
								查询结果<span name="cus_select"></span><span id="validDate"></span>
							</h3>
						</div>
						<div class="block-content">
							<table id="voucher_tab"
								class="table table-bordered table-striped table-hover">
							</table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_sameVoucher">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="sameVoucher_xxranaly" type="button"
										style="color: white;">
										<img src="img/bdo/xxr24.png"
											style="height: 22px; width: 22px;">&nbsp;推荐分析
									</button>
								</li>
								<li>
									<button id="sameVoucher_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="sameVoucher_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;清空</i>
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
							<div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<select class="js-select2 form-control"
													id="sameVoucher_customerId" style="width: 100%;">
													<option></option>
												</select> <label for="sameVoucher_customerId">客户名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material">
												<input id="sameVoucher_yyyy"
													class="form-control date-picker" type="text"
													autocomplete="off"> <label for="sameVoucher_yyyy">账套年份</label>
											</div>
										</div>
									</div>
									<!-- <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div id="sameVoucher_dateGroup" class="form-material input-group">
                                                <input id="sameVoucher_startDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off"> <span id="sameVoucher_dateAddon" class="input-group-addon">-</span> <input
                                                    id="sameVoucher_endDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off"> <label for="sameVoucher_dateType">凭证日期</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-3">
                                            <div class="form-material input-group">
                                                <select class="form-control" id="sameVoucher_isInclude" placeholder="是否包含">
                                                    <option value='1'>含</option>
                                                    <option value='0'>不含</option>
                                                </select> <span class="input-group-addon"></span> <input class="form-control" type="text" id="sameVoucher_subjectId"> <label for="sameVoucher_subjectId">科目编号</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-1">
                                            <div class="form-material">
                                                <input class="form-control" type="text" id="sameVoucher_typeId"> <label for="sameVoucher_typeId">字</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-1">
                                            <div class="form-material">
                                                <input class="form-control" type="text" id="sameVoucher_voucherId"> <label for="sameVoucher_voucherId">号</label>
                                            </div>
                                        </div>
                                    </div> -->
								</div>
								<!-- <div class="row">
                                    <div class="form-group"></div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div class="form-material">
                                                <select class="form-control" id="sameVoucher_summary_type">
                                                </select> <label for="sameVoucher_summary_type">摘要匹配</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div class="form-material">
                                                <input class="form-control" type="text" id="sameVoucher_summary" placeholder="以逗号分隔,如 员工,路费"> <label for="sameVoucher_summary">摘要关键字</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-4">
                                            <div class="form-material input-group">
                                                <select class="form-control" id="sameVoucher_moneyType">
                                                </select> <span class="input-group-addon"> </span> <select class="form-control" id="sameVoucher_moneyOpt">
                                                </select> <span class="input-group-addon"></span> <input class="form-control" type="number" id="sameVoucher_money"> <label for="sameVoucher_money">金额</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div class="form-material">
                                                <select class="form-control" id="sameVoucher_vouchartype">
                                                </select> <label for="sameVoucher_vouchartype">凭证类型</label>
                                            </div>
                                        </div>
                                    </div>
                                </div> -->
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="sameVoucher_export" type="button">
										<i class="si si-cloud-download" style="color: white;"
											title="导出"></i>
									</button>
								</li>
								<li>
									<button id="sameVoucher_export_dg" type="button"
										style="display: none;">
										<i class="si si-cloud-download" style="color: white;"
											title="导出到底稿附件"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;"></button>
								</li>
							</ul>
							<h3 class="block-title">
								查询结果<span name="sameVoucher_select"></span><span id="validDate"></span>
							</h3>
						</div>
						<div class="block-content">
							<div></div>
							<div id="sameVoucher_table_count" class="dataTables_info"></div>
							<table id="sameVoucher_table_title"
								class="table table-bordered table-striped table-hover"
								style="margin-bottom: 0px"></table>
							<div style="height: 300px; overflow: scroll">
								<table id="sameVoucher_table"
									class="table table-bordered table-striped table-hover">
								</table>
							</div>
							<div id="sameVoucher_loadImg"
								style="width: 100%; text-align: center;">
								<img src="/Faith/img/bdo/loading.gif" width="100px"
									height="100px" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_sameAmountVoucher">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<!-- <li>
                                    <button id="sameAmountVoucher_xxranaly" type="button" style="color:white;"><img
                                            src="img/bdo/xxr24.png"
                                            style="height: 22px;width: 22px;">&nbsp;推荐分析</button>
                                </li> -->
								<li>
									<button id="sameAmountVoucher_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="sameAmountVoucher_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;清空</i>
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
							<div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<select class="js-select2 form-control"
													id="sameAmountVoucher_customerId" style="width: 100%;">
													<option></option>
												</select> <label for="sameAmountVoucher_customerId">客户名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material">
												<input id="sameAmountVoucher_yyyy"
													class="form-control date-picker" type="text"
													autocomplete="off"> <label
													for="sameAmountVoucher_yyyy">账套年份</label>
											</div>
										</div>
									</div>
									<!-- <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div id="sameAmountVoucher_dateGroup" class="form-material input-group">
                                                <input id="sameAmountVoucher_startDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off"> <span id="sameAmountVoucher_dateAddon" class="input-group-addon">-</span> <input
                                                    id="sameAmountVoucher_endDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off"> <label for="sameAmountVoucher_dateType">凭证日期</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-3">
                                            <div class="form-material input-group">
                                                <select class="form-control" id="sameAmountVoucher_isInclude" placeholder="是否包含">
                                                    <option value='1'>含</option>
                                                    <option value='0'>不含</option>
                                                </select> <span class="input-group-addon"></span> <input class="form-control" type="text" id="sameAmountVoucher_subjectId"> <label for="sameAmountVoucher_subjectId">科目编号</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-1">
                                            <div class="form-material">
                                                <input class="form-control" type="text" id="sameAmountVoucher_typeId"> <label for="sameAmountVoucher_typeId">字</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-1">
                                            <div class="form-material">
                                                <input class="form-control" type="text" id="sameAmountVoucher_voucherId"> <label for="sameAmountVoucher_voucherId">号</label>
                                            </div>
                                        </div>
                                    </div> -->
								</div>
								<!-- <div class="row">
                                    <div class="form-group"></div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div class="form-material">
                                                <select class="form-control" id="sameAmountVoucher_summary_type">
                                                </select> <label for="sameAmountVoucher_summary_type">摘要匹配</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div class="form-material">
                                                <input class="form-control" type="text" id="sameAmountVoucher_summary" placeholder="以逗号分隔,如 员工,路费"> <label for="sameAmountVoucher_summary">摘要关键字</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-4">
                                            <div class="form-material input-group">
                                                <select class="form-control" id="sameAmountVoucher_moneyType">
                                                </select> <span class="input-group-addon"> </span> <select class="form-control" id="sameAmountVoucher_moneyOpt">
                                                </select> <span class="input-group-addon"></span> <input class="form-control" type="number" id="sameAmountVoucher_money"> <label for="sameAmountVoucher_money">金额</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div class="form-material">
                                                <select class="form-control" id="sameAmountVoucher_vouchartype">
                                                </select> <label for="sameAmountVoucher_vouchartype">凭证类型</label>
                                            </div>
                                        </div>
                                    </div>
                                </div> -->
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="sameAmountVoucher_export" type="button">
										<i class="si si-cloud-download" style="color: white;"
											title="导出"></i>
									</button>
								</li>
								<li>
									<button id="sameAmountVoucher_export_dg" type="button"
										style="display: none;">
										<i class="si si-cloud-download" style="color: white;"
											title="导出到底稿附件"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;"></button>
								</li>
							</ul>
							<h3 class="block-title">
								查询结果<span name="sameAmountVoucher_select"></span><span
									id="validDate"></span>
							</h3>
						</div>
						<div class="block-content">
							<div></div>
							<div id="sameAmountVoucher_table_count" class="dataTables_info"></div>
							<table id="sameAmountVoucher_table_title"
								class="table table-bordered table-striped table-hover"
								style="margin-bottom: 0px"></table>
							<div style="height: 300px; overflow: scroll">
								<table id="sameAmountVoucher_table"
									class="table table-bordered table-striped table-hover">
								</table>
							</div>
							<div id="sameAmountVoucher_loadImg"
								style="width: 100%; text-align: center;">
								<img src="/Faith/img/bdo/loading.gif" width="100px"
									height="100px" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_hedgeVoucher">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<!-- <li>
                                    <button id="hedgeVoucher_xxranaly" type="button" style="color:white;"><img
                                            src="img/bdo/xxr24.png"
                                            style="height: 22px;width: 22px;">&nbsp;推荐分析</button>
                                </li> -->
								<li>
									<button id="hedgeVoucher_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button id="hedgeVoucher_clear" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;清空</i>
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
							<div>
								<div class="row">
									<div class="form-group"></div>
									<div class="form-group has-info">
										<div class="col-sm-4">
											<div class="form-material">
												<select class="js-select2 form-control"
													id="hedgeVoucher_customerId" style="width: 100%;">
													<option></option>
												</select> <label for="hedgeVoucher_customerId">客户名称</label>
											</div>
										</div>
									</div>
									<div class="form-group has-info">
										<div class="col-sm-1">
											<div class="form-material">
												<input id="hedgeVoucher_yyyy"
													class="form-control date-picker" type="text"
													autocomplete="off"> <label for="hedgeVoucher_yyyy">账套年份</label>
											</div>
										</div>
									</div>
									<!-- <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div id="hedgeVoucher_dateGroup" class="form-material input-group">
                                                <input id="hedgeVoucher_startDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off"> <span id="hedgeVoucher_dateAddon" class="input-group-addon">-</span> <input
                                                    id="hedgeVoucher_endDate" class="form-control date-picker" size=10 type="text" value="" autocomplete="off"> <label for="hedgeVoucher_dateType">凭证日期</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-3">
                                            <div class="form-material input-group">
                                                <select class="form-control" id="hedgeVoucher_isInclude" placeholder="是否包含">
                                                    <option value='1'>含</option>
                                                    <option value='0'>不含</option>
                                                </select> <span class="input-group-addon"></span> <input class="form-control" type="text" id="hedgeVoucher_subjectId"> <label for="hedgeVoucher_subjectId">科目编号</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-1">
                                            <div class="form-material">
                                                <input class="form-control" type="text" id="hedgeVoucher_typeId"> <label for="hedgeVoucher_typeId">字</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-1">
                                            <div class="form-material">
                                                <input class="form-control" type="text" id="hedgeVoucher_voucherId"> <label for="hedgeVoucher_voucherId">号</label>
                                            </div>
                                        </div>
                                    </div> -->
								</div>
								<!-- <div class="row">
                                    <div class="form-group"></div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div class="form-material">
                                                <select class="form-control" id="hedgeVoucher_summary_type">
                                                </select> <label for="hedgeVoucher_summary_type">摘要匹配</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div class="form-material">
                                                <input class="form-control" type="text" id="hedgeVoucher_summary" placeholder="以逗号分隔,如 员工,路费"> <label for="hedgeVoucher_summary">摘要关键字</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-4">
                                            <div class="form-material input-group">
                                                <select class="form-control" id="hedgeVoucher_moneyType">
                                                </select> <span class="input-group-addon"> </span> <select class="form-control" id="hedgeVoucher_moneyOpt">
                                                </select> <span class="input-group-addon"></span> <input class="form-control" type="number" id="hedgeVoucher_money"> <label for="hedgeVoucher_money">金额</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group has-info">
                                        <div class="col-sm-2">
                                            <div class="form-material">
                                                <select class="form-control" id="hedgeVoucher_vouchartype">
                                                </select> <label for="hedgeVoucher_vouchartype">凭证类型</label>
                                            </div>
                                        </div>
                                    </div>
                                </div> -->
							</div>
						</div>
					</div>
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="hedgeVoucher_export" type="button">
										<i class="si si-cloud-download" style="color: white;"
											title="导出"></i>
									</button>
								</li>
								<li>
									<button id="hedgeVoucher_export_dg" type="button"
										style="display: none;">
										<i class="si si-cloud-download" style="color: white;"
											title="导出到底稿附件"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="fullscreen_toggle" style="color: white;"></button>
								</li>
							</ul>
							<h3 class="block-title">
								查询结果<span name="hedgeVoucher_select"></span><span id="validDate"></span>
							</h3>
						</div>
						<div class="block-content">
							<div></div>
							<div id="hedgeVoucher_table_count" class="dataTables_info"></div>
							<table id="hedgeVoucher_table_title"
								class="table table-bordered table-striped table-hover"
								style="margin-bottom: 0px"></table>
							<div style="height: 300px; overflow: scroll">
								<table id="hedgeVoucher_table"
									class="table table-bordered table-striped table-hover">
								</table>
							</div>
							<div id="hedgeVoucher_loadImg"
								style="width: 100%; text-align: center;">
								<img src="/Faith/img/bdo/loading.gif" width="100px"
									height="100px" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_groupDetail">
				<div class="content">
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="modal_voucher_detail_export" type="button">
										<i class="si si-cloud-download" style="color: white;"
											title="导出"></i>
									</button>
								</li>
							</ul>
							<h3 class="block-title">
								分录详细<span id="groupDetailTitle"></span>
							</h3>
						</div>
						<div class="block-content">
							<table id="modal_voucher_detail_table"
								class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="tab_groupDate">
				<div class="content">
					<div class="block block-bordered">
						<div class="block-header bg-primary">
							<h3 class="block-title">日期详细</h3>
						</div>
						<div class="block-content">
							<table id="modal_voucher_date_table"
								class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="form_voucher" tabindex="-1" role="dialog"
	aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-lg">
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
					<h3 class="block-title">详细信息</h3>
				</div>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" id="form_voucher"></form>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_subjectid" tabindex="-1" role="dialog"
	aria-hidden="true" data-backdrop="static" data-keyboard="false"
	style="top: 40px; z-index: 1070;">
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
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="accmulsubject_tree"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text" id="searchInput2"
						placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button"
						id="modal_accmulsubjectid_reset">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button"
						id="modal_accmulsubjectid_sure">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_subjectid_sameVoucher" tabindex="-1"
	role="dialog" aria-hidden="true" data-backdrop="static"
	data-keyboard="false" style="top: 40px; z-index: 1070;">
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
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="subject_tree_sameVoucher"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text"
						id="searchInput_sameVoucher" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button"
						id="modal_subjectid_reset_sameVoucher">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button"
						id="modal_subjectid_sure_sameVoucher">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_subjectid_sameAmountVoucher"
	tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	data-keyboard="false" style="top: 40px; z-index: 1070;">
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
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="subject_tree_sameAmountVoucher"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text"
						id="searchInput_sameAmountVoucher" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button"
						id="modal_subjectid_reset_sameAmountVoucher">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button"
						id="modal_subjectid_sure_sameAmountVoucher">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal_subjectid_hedgeVoucher" tabindex="-1"
	role="dialog" aria-hidden="true" data-backdrop="static"
	data-keyboard="false" style="top: 40px; z-index: 1070;">
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
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="subject_tree_hedgeVoucher"></div>
			</div>
			<div class="modal-footer">
				<div class="col-sm-3">
					<input class="form-control" type="text"
						id="searchInput_hedgeVoucher" placeholder="搜索科目">
				</div>
				<div class="col-sm-9">
					<button class="btn btn-md btn-primary" type="button"
						id="modal_subjectid_reset_hedgeVoucher">
						<i class="fa fa-repeat"></i><span>&nbsp;重置</span>
					</button>
					<button class="btn btn-md btn-primary" type="button"
						id="modal_subjectid_sure_hedgeVoucher">
						<i class="fa fa-send"></i><span>&nbsp;确定</span>
					</button>
					<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- 导出到底稿附件树弹框 -->
<div class="modal fade" id="modal_tbsubjectid" tabindex="-1"
	role="dialog" aria-hidden="true" data-backdrop="static"
	data-keyboard="false">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button class="btn btn-md btn-primary" type="button"
								id="modal_tbsubjectid_sure">
								<i class="si si-cloud-download" title="导出"></i>
								<%--<span>&nbsp;导出</span>--%>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">选择TB科目</h3>
				</div>
			</div>
			<div class="modal-body" style="min-height: 500px; max-height: 500px">
				<div id="tbsubject_tree"></div>
			</div>
		</div>
	</div>
</div>
<!-- <div class="modal fade" id="modal_voucher_detail" role="dialog" aria-hidden="true" data-backdrop="static"
     data-keyboard="false">
    <div class="modal-dialog modal-lg" style="width:1200px">
        <div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button id="modal_voucher_detail_export" type="button">
								<i class="si si-cloud-download" style="color: white;" title="导出"></i>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">分录详细</h3>
				</div>
				<div class="modal-body" style="min-height: 300px; max-height: 500px">
					<ul class="nav nav-tabs" data-toggle="tabs"
						id="tab_modal_same_voucher">
						<li class="active"><a href="#tab_same_voucher_entry">分录详细</a></li>
					</ul>
					<div class="block-content tab-content"
						id="tab_modal_same_voucher_content">
						<div class="tab-pane active" id="tab_same_voucher_entry">
							<table id="modal_voucher_detail_table" class="table table-bordered table-striped table-hover"></table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-md btn-warning" type="button"
						data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
    </div>
</div> -->
<!-- <div class="modal fade" id="modal_voucher_date" role="dialog" aria-hidden="true" data-backdrop="static"
     data-keyboard="false">
    <div class="modal-dialog modal-lg" style="width:1200px">
        <div class="modal-content">
            <div class="block block-themed block-transparent remove-margin-b">
                <div class="block-header bg-info">
                    <ul class="block-options">
                        <li>
                            <button id="modal_voucher_detail_export" type="button">
                                <i class="si si-cloud-download" style="color: white;" title="导出"></i>
                            </button>
                        </li>
                        <li>
                            <button type="button" data-dismiss="modal">
                                <i class="si si-close"></i>
                            </button>
                        </li>
                    </ul>
                    <h3 class="block-title">日期详细</h3>
                </div>
            </div>
            <div class="modal-body" style="min-height:300px;max-height:500px;">
                <ul class="nav nav-tabs" data-toggle="tabs"
                    id="tab_modal_same_voucher_date">
                    <li class="active"><a href="#tab_same_voucher_date_entry">日期详细</a></li>
                </ul>
                <div class="block-content tab-content"
                    id="tab_modal_same_voucher_date_content">
                    <div class="tab-pane active" id="tab_same_voucher_date_entry">
                        <table id="modal_voucher_date_table" class="table table-bordered table-striped table-hover"></table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
                    <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
                </button>
            </div>
        </div>
    </div>
</div> -->
<script
	src="${pageContext.request.contextPath}/finCenter/voucherList.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/accountLedager.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/accountDetail.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/voucherDetail.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/exportToDg.js"></script>
<script
	src="${pageContext.request.contextPath}/finCenter/common/getValidDate.js"></script>
<script
	src="${pageContext.request.contextPath}/dgCenter/js/dg/samplingList.js"></script>