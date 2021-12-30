<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<style>
		#modal_detail .modal-dialog{
			width:1200px;
		}
		#modal_detail .modal-body{
			height:auto;
			max-height:700px;
			overflow-y:auto;
		}
	</style>
	<div class="modal fade" id="modal_detail" tabindex="-1" role="dialog"
		aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div id="blackCusTip" class="block-header bg-warning">
						<div id="blackCusDiv" class="ribbon-box font-w600 " style="letter-spacing: 1px;">
							<i class="fa fa-fw fa-exclamation-triangle" style="margin-right:5px;"></i>黑名单客户
		 				</div>
		 				
						<ul class="block-options">
							<li>
								<button id="modal_detail_close" type="button" data-dismiss="modal">
									<i class="si si-close"></i>
								</button>
							</li>
						</ul>
						<h3 class="block-title">客户详细信息</h3>
					</div>
				</div>
					<div class="modal-body">
						<div class="content">
							<div class="block block-themed" id="cus_baseInfo_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_base_toggle"
												data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">基本信息</h3>
								</div>
								<div class="block-content" style="padding:0px;">
									<form class="form-horizontal" id="customer_form"></form>
								</div>
							</div>
							
							<div class="block block-bordered" id="cus_histroyName_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_histroyName_toggle"
												data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">客户曾用名</h3>
								</div>
								<div class="block-content">
									<table id="historyName" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							
							<div class="block block-bordered" id="cus_cusMember_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_cusMember_toggle"
											data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">客户主要成员</h3>
								</div>
								<div class="block-content">
									<table id="cusMember" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							
							<!-- 
							<div class="block block-bordered" id="cus_IcpInfo_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_IcpInfo_toggle"
											data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">ICP备案信息</h3>
								</div>
								<div class="block-content">
									<table id="IcpInfo" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							 -->
							
							<div class="block block-bordered" id="cus_cusStock_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_cusStock_toggle"
											data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">股票信息</h3>
								</div>
								<div class="block-content">
									<table id="cusStock" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							
							<!-- 
							<div class="block block-bordered" id="cus_cusBond_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_cusBond_toggle"
											data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">债券</h3>
								</div>
								<div class="block-content">
									<table id="cusBond" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							 -->
							
							<div class="block block-bordered" id="cus_cusBranch_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button id="cusBranch_add" class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_cusBranch_toggle"
											data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">分支机构</h3>
								</div>
								<div class="block-content">
									<table id="cusBranch" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							<div class="block block-bordered" id="cus_cusInvestment_div" style="display:none;">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_cusInvestment_toggle"
											data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">投资关系（集团）</h3>
								</div>
								<div class="block-content">
									<table id="cusInvestment" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							
							<div class="block block-bordered" id="cus_cusType_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_cusType_toggle"
											data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">客户类型</h3>
								</div>
								<div class="block-content">
									<table id="cusType" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							
							<div class="block block-bordered" id="cus_cusIndustry_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_cusIndustry_toggle"
											data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">行业分类</h3>
								</div>
								<div class="block-content">
									<table id="cusIndustry" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							
							<div class="block block-bordered" id="cus_cusAsset_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_cusAsset_toggle"
											data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">资产状况信息（年报）</h3>
								</div>
								<div class="block-content">
									<table id="cusAsset" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							
							<div class="block block-bordered" id="cus_cusComposition_div">
								<div class="block-header bg-primary">
									<ul class="block-options">
										<li>
											<button class="btn_add" type="button">
												<i class="fa fa-plus" style="color: white;">&nbsp;新增</i>
											</button>
										</li>
										<li>
											<button type="button" data-toggle="block-option" tip="show" id="cus_cusComposition_toggle"
											data-action="content_toggle" style="color: white;"></button>
										</li>
									</ul>
									<h3 class="block-title">主营构成（按产品和服务）</h3>
								</div>
								<div class="block-content">
									<table id="cusComposition" class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
							
						</div>
					</div>
			</div>
		</div>
	</div>
	
	
	
	<div class="modal fade detail-modal" id="histroyName_modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 500px;">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">客户曾用名</h3>
					</div>
				</div>
				<div class="modal-body" style="overflow:auto; border: 5px solid #6fb9eb;">
					<form class="form-horizontal" id="histroyName_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade detail-modal" id="cusMember_modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 500px;">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">客户主要成员</h3>
					</div>
				</div>
				<div class="modal-body" style="overflow:auto; border: 5px solid #6fb9eb;">
					<form class="form-horizontal" id="cusMember_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade detail-modal" id="IcpInfo_modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 500px;">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">ICP备案信息</h3>
					</div>
				</div>
				<div class="modal-body" style="overflow:auto; border: 5px solid #6fb9eb;">
					<form class="form-horizontal" id="IcpInfo_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade detail-modal" id="cusStock_modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 500px;">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">股票信息</h3>
					</div>
				</div>
				<div class="modal-body" style="overflow:auto; border: 5px solid #6fb9eb;">
					<form class="form-horizontal" id="cusStock_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade detail-modal" id="cusBond_modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 500px;">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">债券</h3>
					</div>
				</div>
				<div class="modal-body" style="overflow:auto; border: 5px solid #6fb9eb;">
					<form class="form-horizontal" id="cusBond_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade detail-modal" id="cusBranch_modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 900px;">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">分支机构</h3>
					</div>
				</div>
				<div class="modal-body" style="overflow:auto; border: 5px solid #6fb9eb;">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_searchBranch" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
									</button>
								</li>
								<li>
									<button id="btn_clearBranch" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
										data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">搜索条件设定</h3>
						</div>
						<div id="search-condition-Branch" class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-5">
										<div class="form-material">
											<input class="form-control" type="text" id="search_BranchName" />
											<label for="search_BranchName">客户名称</label>
										</div>
									</div>
								</div>
								<div class="form-group has-info">
									<div class="col-sm-5">
										<div class="form-material">
											<input class="form-control" type="text" id="search_BranchType" />
											<label for="search_BranchType">客户类型</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<table id="cusBranchTable" class="table table-bordered table-striped table-hover"></table>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade detail-modal" id="cusType_modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 500px;">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">客户类型</h3>
					</div>
				</div>
				<div class="modal-body" style="overflow:auto; border: 5px solid #6fb9eb;">
					<form class="form-horizontal" id="cusType_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade detail-modal" id="cusIndustry_modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 500px;">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">行业分类</h3>
					</div>
				</div>
				<div class="modal-body" style="overflow:auto; border: 5px solid #6fb9eb;">
					<form class="form-horizontal" id="cusIndustry_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade detail-modal" id="cusAsset_modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 900px;">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">资产状况信息（年报）</h3>
					</div>
				</div>
				<div class="modal-body" style="overflow:auto; border: 5px solid #6fb9eb;">
					<form class="form-horizontal" id="cusAsset_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade detail-modal" id="cusComposition_modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 900px;">
			<div class="modal-content">
				<div class="block block-themed block-transparent remove-margin-b">
					<div class="block-header bg-info">
						<ul class="block-options">
							<li>
								<button name="sub_close" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">主营构成（按产品和服务）</h3>
					</div>
				</div>
				<div class="modal-body" style="overflow:auto; border: 5px solid #6fb9eb;">
					<form class="form-horizontal" id="cusComposition_form"></form>
				</div>
			</div>
		</div>
	</div>
	
	<script src="${pageContext.request.contextPath}/bdolx/js/bdoStyle.js"></script>
	<script src="${pageContext.request.contextPath}/assets/js/plugins/echarts/echarts.min.js"></script>
	<script src="${pageContext.request.contextPath}/cpCustomer/detail.js"></script>