<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>


<div class="content">
	<div class="block">
		<div class="block-content tab-content" id="tab_baseVersion_content">
			<div class="tab-pane active">
				<div class="content">
					<div class="block block-themed">
						<div class="block-header bg-primary">
							<ul class="block-options">
								<li>
									<button id="btn_baseVersion_search" type="button">
										<i class="fa fa-search" style="color: white;">&nbsp;查询</i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="content_toggle"></button>
								</li>
							</ul>
							<h3 class="block-title">查询条件设定</h3>
						</div>
					</div>
					<div class="block block-bordered" id="baseVersion_block">
						<div class="block-header  bg-primary">
							<ul class="block-options">
								<li>
									<button id="baseVersion_add" type="button">
										<i class="fa fa-plus" style="color: white;" title="新增"></i>
									</button>
								</li>
								<li>
									<button type="button" data-toggle="block-option"
											data-action="fullscreen_toggle" style="color: white;" title="放大">
									</button>
								</li>
							</ul>
							<h3 class="block-title">版本信息一览<span name="cus_select"></span></h3>

						</div>
						<div class="block-content">
							<table id="baseVersionForm"
								   class="table table-bordered table-striped table-hover"></table>
							<div id="hot"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="baseVersion-modal" tabindex="-1" role="dialog" aria-hidden="true"
	 data-backdrop="static" data-keyboard="false" style="top:40px;">
	<div class="modal-dialog modal-md" style="width:600px">
		<div class="modal-content">
		</div>
	</div>
</div>


<div class="modal fade" id="versionModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button class="btn btn-md btn-primary" type="button" id="version_save">
								<i class="fa fa-save"></i><span>&nbsp;保存</span>
							</button>
						</li>
						<li>
							<button type="button" data-dismiss="modal" id="version_close">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h4 class="block-title">版本信息维护</h4>
				</div>
			</div>
			<div class="modal-body" >
				<div class="bdo-form-view-wrap bdo-form-view-wrap-tools-bar">
					 <table class="table ">
						<tr>
							<td rowspan="1" colspan="1" class="has-success">
								<div class="form-material ">
									<input class="form-control" type="text" data-toggle="tooltip"  id="vserionAutoId"  style="display:none">
									<label >版本号<span class="necessary">*</span></label>
									<input class="form-control" type="text" data-toggle="tooltip"   id="version" >
								</div>
							</td><td colspan="1" class="has-success">
								<div class="form-material ">
									<label >版本发布时间<span class="necessary">*</span></label>
									<input id="versionTime" class="form-control date-picker" type="text">
								</div>
							</td>
							<td colspan="1" class="has-success">
								<div class="form-material ">
									<label >svn版本号<span class="necessary">*</span></label>
									<input class="form-control" type="text" data-toggle="tooltip"  id="svnVserion"  >
								</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="modal-body" >
				<div class="form-version ">
					<label >具体内容<span class="necessary">*</span></label>
					<textarea class="form-control postil-textarea" rows="8" id="versionContent"></textarea>
				</div>
			</div>



		</div>
	</div>
</div>

<script src="${pageContext.request.contextPath}/cpAdmin/baseVersions.js"></script>