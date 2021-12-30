<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<%@ include file="/WEB-INF/Views/Sys_INCLUDE/includeForUI.jsp"%>     
<%@ include file="/cpCustomer/detail.jsp"%>
<html>
    <head>
        <meta charset="utf-8">
        <title>客户管理系统-新增</title> 
	    <% String url = (String)session.getAttribute("url"); %>
	    <% String operate = (String)session.getAttribute("operate"); %>
	    <% String customerIdTemp = (String)session.getAttribute("customerId"); %>
	    <% String owncustomerId = (String)session.getAttribute("owncustomerId"); %>
        <script type="text/javascript">
			var url = '<%=url%>';
			var operate = '<%=operate%>';
			var customerIdTemp = '<%=customerIdTemp%>';
			var owncustomerId = '<%=owncustomerId%>';
		</script>
	<style> 
		#submit-table{
			border: 1px solid #e9e9e9;
		}

		#example  {
			text-align: center;
		}
		
		#query_modal .modal-dialog,
		#queryTableDB_modal .modal-dialog{
			width:1300px;
		}
		#query_modal .modal-body,
		#queryTableDB_modal .modal-body{
			overflow:auto;
		}
		
		#page-loader:after {
		    display: none;
		}
		#page-loader > div {
		    position:absolute; 
		    top:48%; 
		    left:47%; 
		    color:gainsboro; 
		}
		#waiting {
		    display: inline-block;
		    font-size: 24px;
		    margin: -37px 0 0 55px;
		    position: absolute;
		    width: 200px;
		}
		#queryTableDB_next,
		#queryTable_save{
			float: right;
    		margin: 20px 0 0 0;
		}
		#queryTable_next{
			float: right;
    		margin: 20px 0 0 0;
		}
		#OuterMain, #btnList{
			display: none;
		}
		 
		#btnList {
		    width: 80%;
		    position: absolute;
		    top: 23%;
		    left: 11%;
		}
		#btnList row{
			width: 100%;
		}
		#backbBtn, #newBtn{
			width: 100%;
			margin-bottom: 20px;
		}
	</style>
    </head>
    <body>
    	<div id ="btnList" class="content-grid push-50">
			<div class="row">
				<div id="newBtn" class="col-xs-6 col-sm-4 col-lg-2">
					<a class="block block-link-hover3 text-center" href="javascript:void(0)">
						<div class="block-content block-content-full">
 							<i class="si si-user-follow fa-4x text-success"></i>
							<div class="font-w600 push-15-t">新建客户</div>
						</div>
					</a>
				</div>
			</div>
			<div class="row">
				<div id="backbBtn" class="col-xs-6 col-sm-4 col-lg-2">
					<a class="block block-link-hover3 text-center" href="javascript:void(0)">
						<div class="block-content block-content-full">
							<i class="si si-logout fa-4x text-danger"></i>
							<div class="font-w600 push-15-t">返回列表</div>
						</div>
					</a>
				</div>
			</div>
		</div>
		<div id="OuterMain" class="content">
			<div id="search-condition-container" class="block block-themed">
				<div class="block-header bg-primary">
					<ul class="block-options">
						<li>
							<button id="btn_search" type="button">
								<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
							</button>
						</li>
						<li>
							<button id="btn_clear" type="button">
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
				<div id="search-condition" class="block-search">
					<div class="row">
						<div class="form-group"></div>
						<div class="form-group has-info">
							<div class="col-sm-2">
								<div class="form-material">
									<input class="form-control" type="text" id="search_customerName" />
									<label for="search_customerName">客户名称</label>
								</div>
							</div>
						</div>
						<div class="form-group has-info">
							<div class="col-sm-2">
								<div class="form-material">
									<input class="form-control" type="text" id="search_type" />
									<label for="search_type">客户类型</label>
								</div>
							</div>
						</div>
						<div class="form-group has-info">
							<div class="col-sm-2">
								<div class="form-material">
									<input class="form-control" type="text" id="search_BPR" />
									<label for="search_BPR">注册号</label>
								</div>
							</div>
						</div>
						<div class="form-group has-info ">
							<div class="col-sm-2">
								<div class="form-material">
									<input class="form-control" type="text" id="search_uscc" />
									<label for="search_uscc">统一社会信用代码</label>
								</div>
							</div>
						</div>
						<div class="form-group has-info">
							<div class="col-sm-2">
								<div class="form-material">
									<input class="form-control" type="text" id="search_industryclassification" />
									<label for="search_industryclassification">所属行业</label>
								</div>
							</div>
						</div>
						<div class="form-group has-info">
							<div class="col-sm-2">
								<div class="form-material">
									<select class="form-control" id="search_customerType"></select>
									<label for="search_customerType">客户属性</label>
								</div>
							</div>
						</div>
						<div class="form-group has-info">
							<div class="col-sm-2">
								<div class="form-material">
									<input class="form-control" id="search_customerId" type="hidden"></input>
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
							<button id="btn_add" type="button">
								<i class="fa fa-plus" style="color: white;" title="新增"></i>
							</button>
						</li>
						<li>
							<button id="btn_export" type="button">
								<i class="si si-cloud-download" style="color: white;" title="导出"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">客户一览</h3>
				</div>
				<div class="block-content">
					<table id="customerTable" class="table table-bordered table-striped table-hover"></table>
				</div>
			</div>
		</div>
	
	
		<div class="modal fade" id="chkCus_modal" tabindex="-1" role="dialog"
			aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog modal-lg" style="margin-top: 150px;width: 600px;">
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
							<h3 class="block-title">检查客户是否已创建</h3>
						</div>
					</div>
					<div class="modal-body">
						<form class="form-horizontal" id="chkCus_form"></form>
					</div>
					
				</div>
			</div>
		</div>
		
		<div class="modal fade" id="customer_modal" tabindex="-1" role="dialog"
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
							<h3 class="block-title">客户信息维护</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
			
		
		<div class="modal fade" id="query_modal" tabindex="-1" role="dialog"
			aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog modal-lg" >
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
							<h3 class="block-title">选择客户</h3>
						</div>
					</div>
					<div class="modal-body">
						<div class="block-content">
							<table id="queryTable" class="table table-bordered table-striped table-hover"></table>
						</div>
						<button id="queryTable_back" class="btn btn-warning" type="button"><i class="fa fa-arrow-left"></i>返回</button>
						<button id="queryTable_save" class="btn btn-success" type="button"><i class="fa fa-save"></i>新建</button>
					</div>
				</div>
			</div>
		</div>
		
		<div class="modal fade" id="queryTableDB_modal" tabindex="-1" role="dialog"
			aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog modal-lg">
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
							<h3 class="block-title">客户管理系统检索</h3>
						</div>
					</div>
					<div class="modal-body">
						<div class="block-content">
							<table id="queryTableDB" class="table table-bordered table-striped table-hover"></table>
						</div>
						<button id="queryTableDB_back" class="btn btn-warning" type="button"><i class="fa fa-arrow-left"></i>返回</button>
						<button id="queryTableDB_next" class="btn btn-success" type="button"><i class="fa fa-arrow-right"></i>更多</button>
					</div>
				</div>
			</div>
		</div>
		
		<div id="page-loader" style="display:none; background:#000000ab">
			<div>
				<i class="fa fa-3x fa-cog fa-spin"></i>
				<span id="waiting">正在处理中~<span>
			</div>
		</div>
	
        <script src="${pageContext.request.contextPath}/bdolx/js/bdoStyle.js"></script>
        <script src="${pageContext.request.contextPath}/cpCustomer/customer4Outer.js"></script>
    </body>
</html>