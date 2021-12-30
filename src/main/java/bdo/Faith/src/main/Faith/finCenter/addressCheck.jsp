<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="-1" />
	<meta http-equiv="Cache" content="no-cache">
	<meta name="spreadjs culture" content="zh-cn"/>
	<%--<title><%=cn.com.bdo.cpBase.utils.SysNameUtil.getSysName()%></title>--%>
	<%@ include file="/WEB-INF/Views/Sys_INCLUDE/includeForUI.jsp" %>
	<%@ include file="/cpShare/partnerModal.jsp" %>

	<%@ include file="/dgCenter/common/spreadJS14.0.6.css.jsp" %>
	
	<!-- Page JS Code -->
	<script src="${pageContext.request.contextPath}/bdolx/main/side.js"></script>

	<%--<script>
		var sys_userId = '<%=userSession.getUserId()%>';
		var trinfo = '<%=request.getAttribute("trinfo")%>';
		var userCustomers = '<%=userSession.getUserCustomers()%>';
		var BDO_CUSTOMER_SELECT = '<%=userSession.getCurCustomerId()%>';
		var BDO_CUSTOMERNAME_SELECT = '<%=userSession.getCurCustomerName()%>';
		var BDO_YEAR_SELECT = (new Date()).getFullYear() - 1;
		var BDO_PROJECT_SELECT = '<%=userSession.getCurProjectId()%>';
		var BDO_PROJECTNAME_SELECT = '<%=userSession.getCurProjectName()%>';
		var bid = '<%=request.getAttribute("bid")%>';
		var spreadDesignerPath = encodeURI('${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/');
		if (sys_userId == '') {
			sys_userId = window.CUR_USERID;
		}
	</script>--%>
</head>
<body>
<%@ include file="/dgCenter/common/spreadJS14.0.6.js.jsp" %>
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>

<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/finCenter/addressCheck.js"></script>

<div class="content">
	<div class="block">
		<ul class="nav nav-tabs" data-toggle="tabs">
			<li class="active"><a href="#tab_addresscheck">函证地址验证</a></li>
		</ul>
		<div class="block-content tab-content">
			<div class="tab-pane active">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="file_import" type="button">
										<i class="si si-cloud-upload" style="color: white;">&nbsp;&nbsp;导入</i>
									</button>
								</li>
								<li>
									<button id="file_refresh" type="button">
										<i class="fa fa-repeat" style="color: white;">&nbsp;&nbsp;重置</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">验证条件设定</h3>
						</div>
						<div class="block-search">
							<div class="row">
								<div class="form-group"></div>
								<div class="form-group has-info">
									<div class="col-sm-1">
										<div class="form-material">
											<button id="col_customer" type="button" title="获取客户名称所在列"
													style="position:absolute;z-index:1;border: none;height: 24px;right: 0px;top: 10px;">
												<i class="fa fa-info" style="color: white;"></i>
											</button>
											<input class="form-control" type="text" id="colCustomer" value="A" placeholder="客户名称所在列">
											<label for="colCustomer">客户名称</label>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="form-material">
											<button id="col_address" type="button" title="获取客户地址所在列"
													style="position:absolute;z-index:1;border: none;height: 24px;right: 0px;top: 10px;">
												<i class="fa fa-info" style="color: white;"></i>
											</button>
											<input class="form-control" type="text" id="colAddress" value="B" placeholder="客户地址所在列">
											<label for="colAddress">客户地址</label>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="form-material">
											<button id="col_qccCompanyName" type="button" title="获取企查查单位名称所在列"
													style="position:absolute;z-index:1;border: none;height: 24px;right: 0px;top: 10px;">
												<i class="fa fa-info" style="color: white;"></i>
											</button>
											<input class="form-control" type="text" id="colQccCompanyName" value="C" placeholder="单位名称所在列">
											<label for="colQccCompanyName">企查查单位名称</label>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="form-material">
											<button id="col_qccRegAddress" type="button" title="获取企查查注册地址所在列"
													style="position:absolute;z-index:1;border: none;height: 24px;right: 0px;top: 10px;">
												<i class="fa fa-info" style="color: white;"></i>
											</button>
											<input class="form-control" type="text" id="colQccRegAddress" value="D" placeholder="注册地址所在列">
											<label for="colQccAddress">企查查注册地址</label>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="form-material">
											<button id="col_qccRegDegree" type="button" title="获取企查查注册地址匹配度所在列"
													style="position:absolute;z-index:1;border: none;height: 24px;right: 0px;top: 10px;">
												<i class="fa fa-info" style="color: white;"></i>
											</button>
											<input class="form-control" type="text" id="colQccRegDegree" value="E" placeholder="注册地址匹配度所在列">
											<label for="colQccDegree">注册地址匹配度</label>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="form-material">
											<button id="col_qccMailAddress" type="button" title="获取企查查通信地址所在列"
													style="position:absolute;z-index:1;border: none;height: 24px;right: 0px;top: 10px;">
												<i class="fa fa-info" style="color: white;"></i>
											</button>
											<input class="form-control" type="text" id="colQccMailAddress" value="F" placeholder="通信地址所在列">
											<label for="colQccAddress">企查查通信地址</label>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="form-material">
											<button id="col_qccMailDegree" type="button" title="获取企查查通信地址匹配度所在列"
													style="position:absolute;z-index:1;border: none;height: 24px;right: 0px;top: 10px;">
												<i class="fa fa-info" style="color: white;"></i>
											</button>
											<input class="form-control" type="text" id="colQccMailDegree" value="G" placeholder="通信地址匹配度所在列">
											<label for="colQccDegree">通信地址匹配度</label>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="form-material">
											<button id="col_baiduAddress" type="button" title="获取百度地址所在列"
													style="position:absolute;z-index:1;border: none;height: 24px;right: 0px;top: 10px;">
												<i class="fa fa-info" style="color: white;"></i>
											</button>
											<input class="form-control" type="text" id="colBaiduAddress" value="H" placeholder="百度地址所在列">
											<label for="colBaiduAddress">百度地址</label>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="form-material">
											<button id="col_baiduDegree" type="button" title="获取百度地址匹配度所在列"
													style="position:absolute;z-index:1;border: none;height: 24px;right: 0px;top: 10px;">
												<i class="fa fa-info" style="color: white;"></i>
											</button>
											<input class="form-control" type="text" id="colBaiduDegree" value="I" placeholder="百度地址匹配度所在列">
											<label for="colBaiduDegree">百度地址匹配度</label>
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
									<button id="address_check" type="button">
										<i class="fa fa-check" style="color: white;" title="函证地址验证"></i>
									</button>
								</li>
								<li>
									<button id="file_export" type="button">
										<i class="si si-cloud-download" style="color: white;" title="导出"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;">
									</button>
								</li>
							</ul>
							<h3 class="block-title">导入或验证结果<span style="color: red;">&nbsp;&nbsp;（第一行为标题行&nbsp;&nbsp;单次验证最多100个客户）</span></h3>
						</div>
						<div class="block-content" style="padding:0px 20px 0px 20px;overflow: auto;height: 570px;">
							<div id="ss" class="ss fill" style="height: 550px;"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="modal-importFile" tabindex="-1" role="dialog"
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
					<h3 class="block-title">导入文件数据</h3>
				</div>
			</div>
			<div class="modal-body" style="height: auto;overflow: visible;">
				<div class="row">
					<div class="form-group">
						<label class="col-xs-12" for="fileinput">文件数据</label>
						<div class="col-xs-12">
							<input id="fileinput" class="file" type="file" style="width: 100%;"
								   data-preview-file-type="any">
							<div id="errorBlock" class="help-block"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-md btn-primary" type="button" id="import_submit">
					<i class="si si-cloud-upload"></i><span>&nbsp;导入</span>
				</button>
				<button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
					<i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
				</button>
			</div>
		</div>
	</div>
</div>
</body>
</html>
