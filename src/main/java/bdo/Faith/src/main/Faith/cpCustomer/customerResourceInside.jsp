<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
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
	<div class="block block-bordered" id="contentBlock">
		<div class="block-header">
			<div class="block-options block-options-left " style="margin-bottom: 10px;">
				<button id="addFolderBtn" type="button" class="btn btn-primary push-5-r">
					<i class="si si-folder" >&nbsp;新建文件夹</i>
				</button>
				<button id="uploadFileBtn" type="button" class="btn btn-primary push-5-r">
					<i class="fa fa-upload" ">&nbsp;上传文件</i>
				</button>
				<input type="file" name="Filename" id="fileUploadFileName" style="display: none;"/>
			</div>
			<div class="form-group has-info">
				<label class="col-xs-1 col-sm-1 col-lg-1 control-label" for="" style="text-align: right;padding-top:7px;">当前客户</label>
				<div class="form-material col-xs-4 col-sm-4 col-lg-4" style="margin: 0px;">
					<input class="form-control" type="text" id="customerTreeCombo" />
				</div>
			</div>
		</div>
		<div class="block-content">
			<div class="row">
				<div class="col-xs-4 col-sm-3 col-lg-2">
					<div class="block-header bg-primary" >
						<h3 class="block-title dg-mulu">目录</h3>
					</div>
					<div id="folderTreeWrap" style="border: 1px rgb(149,184,231) solid;pandding: 10px;/* position: absolute; */ overflow: auto; height: 512px; /* z-index: 99999; */ width: 100%;">
						<div id="folderTree" style="width: 100%;overflow: auto;"></div>
					</div>
				</div>
				<div class="col-sm-5 col-lg-5">
					<div class="block block-bordered" style="border-color: rgb(149,184,231);margin-bottom: 0px;border-bottom:none;">
						<div class="block-header " style="border-color: rgb(149,184,231);margin-bottom: 0px;border-bottom:none;">
							<ol id="turnBack" class="breadcrumb push-10-t pull-left border-r" style="display: inline-block;cursor: pointer;margin-right: 10px;padding-right:10px;">
								<li><a class="link-effect"><i class="si si-action-undo">返回</i></a></li>
							</ol>
							<ol id="fsPath" class="breadcrumb push-10-t pull-left" style="display: inline-block;">
							</ol>
							<ol id="fsRefresh" class="breadcrumb push-10-t pull-right" style="display: inline-block;cursor: pointer;">
								<li><a class="link-effect"><i class="si si-refresh">刷新</i></a></li>
							</ol>
						</div>
					</div>
					<table id="folderTreeTable" class="table table-bordered table-striped table-hover" style="border: 0px;">
					</table>
				</div>
				<jsp:include page="tpl/task.html" flush="false" />
			</div>
		</div>
	</div>
	<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-fileinput-upload/themes/explorer/theme.css">
	<script type="text/javascript" src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-fileinput-upload/js/plugins/sortable.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-fileinput-upload/js/locales/zh.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-fileinput-upload/themes/explorer/theme.js"></script>

	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/themes/icon.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.css">
	<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
	<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>
	<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/vue.js"></script>
	
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/cpCustomer/css/crstyle.css">
	<script src="${pageContext.request.contextPath}/cpCustomer/page.js"></script>
	<script src="${pageContext.request.contextPath}/cpCustomer/customerRcTask.js"></script>
	<script src="${pageContext.request.contextPath}/cpCustomer/customerResourceInside.js"></script>
	<script type="text/javascript">
	var userLevel = '<%=((cn.com.bdo.base.listener.UserSession)request.getSession().getAttribute("userSession")).getUserLevel()%>';
	if(!jQuery.isNumeric(userLevel)){
		userLevel = '0';
	}
	</script>