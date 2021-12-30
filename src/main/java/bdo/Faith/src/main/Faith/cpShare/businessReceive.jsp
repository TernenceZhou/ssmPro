	<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<style> 
		#submit-table{
			border: 1px solid #e9e9e9;
		}
		#submit-table th{
			font-size: 13px;
		}
		#submit-table td{
			font-size: 12px;
		}
		#submit-table .text-danger{
			margin-left: 5px;
		}
		
		#submit-table label{
			font-weight: normal;
		}
		
		#example  {
			text-align: center;
		}
	</style>
	<div class="content bg-gray-lighter">
		<div class="row items-push">
			<div class="col-sm-7">
				<h1 id="page_head" class="page-heading"></h1>
			</div>
			<div class="col-sm-5 text-right hidden-xs">
				<ol id="page_title" class="breadcrumb push-10-t">
				</ol>
			</div>
		</div>
	</div>
	<div class="content">
		<div class="block block-themed">
			<div class="block-header bg-primary">
				<ul class="block-options">
					<li>
						<button id="btn_clear" type="button">
							<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
						</button>
					</li>
					<li>
						<button id="btn_search" type="button">
							<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
						</button>
					</li>
					<li>
						<button type="button" data-toggle="block-option"
							data-action="content_toggle"></button>
					</li>
				</ul>
				<h3 class="block-title">搜索条件设定</h3>
			</div>
			<div id="search-condition" class="block-search">
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info">
						<div class="col-sm-2">
							<div class="form-material">
								<select class="form-control" id="search_state"></select>
								<label for="search_state">登记单状态</label>
							</div>
						</div>
					</div>
					<div class="form-group has-info">
						<div class="col-sm-2">
							<div class="form-material">
								<input class="form-control" type="text" id="search_departId" />
								<label for="search_departId">所属部门</label>
							</div>
						</div>
					</div>
					<div class="form-group has-info">
						<div class="col-sm-2">
							<div class="form-material">
								<input class="form-control" id="search_businessType" />
								<label for="search_businessType">业务类型</label>
							</div>
						</div>
					</div>
					<div class="form-group has-info">
						<div class="col-sm-2">
							<div class="form-material">
								<input class="form-control" id="search_industry" />
								<label for="search_industry">所属行业</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="form-group"></div>
					<div class="form-group has-info ">
						<div class="col-sm-2">
							<div class="form-material">
								<select class="form-control" id="search_cooperation"></select>
								<label for="search_cooperation">合作意向</label>
							</div>
						</div>
					</div>
					<div class="form-group has-info ">
						<div class="col-sm-2">
							<div class="form-material">
								<select class="form-control" id="search_incomeAssign"></select>
								<label for="search_incomeAssign">分配意向</label>
							</div>
						</div>
					</div>
					<div class="form-group has-info">
						<div class="col-sm-2">
							<div class="form-material">
								<input class="form-control" type="text" id="search_customerName">
								<label for="search_customerName">客户名称</label>
							</div>
						</div>
					</div>
				</div>
				
			</div>
		</div>
		<div class="block block-bordered">
			<div class="block-header  bg-primary">
				<ul class="block-options">
					<li>
						<button id="btn_export" type="button">
							<i class="si si-cloud-download" style="color: white;">&nbsp;导出</i>
						</button>
					</li>
				</ul>
				<h3 class="block-title">业务接收一览</h3>
			</div>
			<div class="block-content">
				<table id="example" class="table table-bordered table-striped table-hover">
				</table>
			</div>
		</div>
	</div>

	<div class="modal fade" id="regist_modal" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">业务登记单</h3>
					</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="regist_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="modal-letter" tabindex="-1" role="dialog"
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
						<h3 class="block-title">关联合同</h3>
					</div>
				</div>
				<div class="modal-body" style="height: auto; overflow: visible;">
					<div class="row">
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<input class="form-control" type="hidden" id="register_id">
								</div>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<input class="form-control" type="text" id="register_no">
									<label for="register_no">合同流水号</label>
								</div>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<select class="form-control" id="register_tp"></select>
									<label for="register_tp">合同类型</label>
								</div>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<select class="form-control" id="register_register">
										<option value="0">不显示</option>
										<option value="1">显示</option>
									</select>
									<label for="register_register">是否显示合同金额</label>
								</div>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-12">
								<div class="form-material">
									<select class="form-control" id="register_finance">
										<option value="0">不显示</option>
										<option value="1">显示</option>
									</select>
									<label for="register_finance">是否显示财务金额</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-md btn-primary" type="button" id="register_link">
						<i class="fa fa-send"></i><span>&nbsp;关联</span>
					</button>
					<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
						<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
					</button>
				</div>
			</div>
		</div>
	</div>
	
	<script src="${pageContext.request.contextPath}/cpShare/registForm.js"></script>
	<script src="${pageContext.request.contextPath}/cpShare/businessReceive.js"></script>