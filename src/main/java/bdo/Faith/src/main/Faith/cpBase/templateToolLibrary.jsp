<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
		<style>
			#folderTree::-webkit-scrollbar{
				display:none;
			}
		</style>
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
		</div>
		<div class="block-content">
			<div class="row">
				<div class="col-xs-4 col-sm-4 col-lg-4">
					<div class="block-header bg-primary" >
						<h3 class="block-title ">目录</h3>
					</div>
					<div id="folderTreeWrap" class="dg-tree" style="border: 1px rgb(149,184,231) solid;pandding: 10px;/* position: absolute; */ overflow: auto; height: 100%; /* z-index: 99999; */ width: 100%;">
						<div id="folderTree" style="width: 100%;overflow: auto;"></div>
					</div>
				</div>
				<div class="col-xs-8 col-sm-8 col-lg-8">
					<div class="block " style="margin-bottom: 0px;border-bottom:none;">
						<div class="block-header " style="border-color: rgb(149,184,231);margin-bottom: 0px;border-bottom:none;">
							<ol id="turnBack" class="breadcrumb push-10-t pull-left border-r" style="display: inline-block;cursor: pointer;margin-right: 10px;padding-right:10px;">
								<li><a class="link-effect"><i class="si si-action-undo">上级</i></a></li>
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
			</div>
		</div>
	</div>
<div class="modal fade" id="rcsuploadTplFormModal" tabindex="-1" role="dialog"
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
					<h3 class="block-title">工具库</h3>
				</div>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" id="rcsuploadFileForm"></form>
			</div>
		</div>
	</div>
</div>
	
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/template-web.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/vue.min.js"></script>--%>
<%--<script src="${pageContext.request.contextPath}/bdolx/js/bdoPage.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoSide.js"></script>--%>
<script src="${pageContext.request.contextPath}/cpBase/templateToolLibrary.js"></script>
