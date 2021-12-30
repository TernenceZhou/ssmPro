<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/side.css">
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/form.css">
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/dg.css">

<div class="spread-content">
	<div class="col-xs-3 spread-content-dir">
		<div class="row">
			<!-- Collapsed Tree -->
			<div id="spreadContentDir" class="block block-bordered"
				 style="margin-bottom: 0px;overflow-x: scroll;overflow-y: hidden;">
				<div class="block-header">
					<div style="float:right">
						<button id="delSubjectTreeBtn" style="border: 0px;background-color: rgba(92, 144, 210, 0);color: red; display: none" ><i class="fa fa-trash" title="删除节点"></i></button>
					</div>
					<div style="float:right">
						<button id="updSubjectTreeBtn" style="border: 0px;background-color: rgba(92, 144, 210, 0);color: grey;" ><i class="fa fa-refresh" title="更新节点"></i></button>
					</div>
					<div style="float:right">
						<button id="compressSubjectTreeBtn" style="border: 0px;background-color: rgba(92, 144, 210, 0);color: grey;" ><i class="fa fa-minus-square" title="收缩所有节点"></i></button>
					</div>
					<div style="float:right">
						<button id="expandSubjectTreeBtn" style="border: 0px;background-color: rgba(92, 144, 210, 0);color: grey;" ><i class="fa fa-plus-square" title="展开所有节点"></i></button>
					</div>
					<div style="float:right">
						<button id="searchProjectFileBtn" style="border: 0px;background-color: rgba(92, 144, 210, 0);color: grey;" ><i class="fa fa-search" title="搜索项目文档"></i></button>
					</div>
					<div style="float:right">
						<label class="css-input css-checkbox css-checkbox-primary control-label" title="只看我的底稿">
							<input type="checkbox" id="onlyMyselfCheckBox">
							<span></span>
						</label>
					</div>
					<h3 class="block-title  dg-mulu">目录</h3>
				</div>
				<div class="block-content dircontext pull-l" style="padding-left: 0px;">
					<!-- Tree View Container -->
					<div data-toggle="slimscroll" data-always-visible="false"
						 data-rail-visible="true" data-rail-color="#777"
						 data-rail-opacity=".0" data-height="100%" data-rail-right="-10">
						<div class="dg-tree">
							<div class="js-tree-collapsed"></div>
						</div>
					</div>
				</div>
			</div>
			<!-- END Collapsed Tree -->
		</div>
	</div>
	<div class="col-xs-9 spread-content-file">
		<div class="row">
			<div class="block block-bordered " id="contentBlock" style="position: relative;margin-bottom: 0px;">
				<div class="block-header">
					<div class="block-options block-options-left">
						<button id="toggleDir" type="button" class="btn btn-xs btn-primary push-5-r">
							<i class="toggle-dir-icon si si-arrow-left"></i>
						</button>
						<%--<button id="openProjectProgressSider" type="button" class="btn btn-xs btn-primary push-5-r">
							<i class="fa fa-hourglass-2" title="项目进度"></i>
						</button>
						<button id="openProjectOptLogSider" type="button" class="btn btn-xs btn-primary push-5-r">
							<i class="fa fa-history" title="操作记录"></i>
						</button>--%>
					</div>
					<ul class="block-options">
						<li>
							<button id="fullscreenBtn" type="button" class=" push-5-r">
								<i class="si si-size-fullscreen"></i>
							</button>
						</li>
					</ul>
					<div style="float: left;margin-left: 50px;background: #5c90d2;color: #ffffff;width: auto; text-align: center; height: 22px;position: relative; top: -3px;">
						<span id="headtitle"></span>
						<span id="dgtitle" style="display: none"></span>
					</div>
					<div style="float:right;margin-right: 50px;">
						<!-- <button id="sampling_btn" type="button" class="btn btn-info push-5-r"
								style="width: 62px;height: 22px;padding: 2px 3px 2px 3px;border: 0px;">
							<span>抽凭</span>
						</button> -->
						<button id="merge_report_btn" type="button" class="btn btn-primary push-5-r"
						        style="width: 80px;height: 22px;padding: 2px 3px 2px 3px;border: 0px;">
							<span>合并报表</span>
						</button>
						<button id="report_independence_btn" type="button" class="btn btn-info push-5-r"
								style="width: 80px;height: 22px;padding: 2px 3px 2px 3px;border: 0px;">
							<span>独立性声明</span>
						</button>
						<!-- <button id="report_approval_btn" type="button" class="btn btn-warning push-5-r"
								style="width: 110px;height: 22px;padding: 2px 3px 2px 3px;border: 0px;">
							<span>对外报告审批单</span>
						</button> -->
						<button id="postil_btn" type="button" class="btn btn-danger push-5-r"
								style="width: 62px;height: 22px;padding: 2px 3px 2px 3px;border: 0px;">
							<span>批注</span>
						</button>
						<button id="openFormulaModalBtn" type="button" class="btn btn-success push-5-r"
								style="height: 22px;padding: 2px 3px 2px 3px;border: 0px;">
							<span>公式校验</span>
						</button>
						<button id="openVerifyModalBtn" type="button" class="btn btn-warning push-5-r"
								style="height: 22px;padding: 2px 3px 2px 3px;border: 0px;">
							<span>公式核对</span>
						</button>
					</div>
				</div>
				<div id="subPageRight"></div>
			</div>
		</div>
	</div>
</div>
<div id="sideRegin"></div>
<!-- 模态框（Modal） -->
<div class="modal fade" id="formulaCheckModal" style="left: -460px;top: -30px;" data-backdrop="static" tabindex="-1"
	 role="dialog" aria-labelledby="formulaModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content" style="width: 1100px;border:1px solid #D3D3D3;">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<!-- <li>
							<button type="button" class="btn btn-primary" id="formulaFilterBtn" title="公式过滤">
								<i class="fa fa-filter"></i>
							</button>
						</li> -->
						<li>
							<button type="button" class="btn btn-primary" id="formulaCheckBtn" title="公式校验">
								<i class="fa fa-check"></i>
							</button>
						</li>
						<li>
							<button class="btn btn-primary" type="button" data-dismiss="modal" aria-hidden="true" title="关闭">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">公式校验</h3>
				</div>
			</div>
			<div class="modal-body" style="height:500px;padding-bottom: 0px;">
				<div class="row">
					<div class="form-group has-info">
						<div class="col-sm-8">
							<label>公式校验类型</label>
							<select id="formulaTypeCheck" style="color: #0000009e;border: 1px solid #e9e9e9;">
								<option value=""></option>
								<option value="0">导引表与底稿校验</option>
								<option value="1">底稿与附注校验</option>
								<option value="5">附注与附注校验</option>
								<option value="2">附注与报表校验</option>
								<option value="4">报表与报表校验</option>
								<option value="3">其他</option>
							</select>
						</div>
						<div class="col-sm-4" style="text-align: right;">
							<label>正确数/总数:</label>&nbsp;
							<label id="rightNumCheck"></label><span>&nbsp;/&nbsp;</span><label id="totalNumCheck"></label>
						</div>
					</div>
				</div>
				<table id="formulaCheckTable" class="table table-bordered table-striped table-hover"></table>
			</div>
		</div><!--  /.modal-content -->
	</div><!--  /.modal -->
</div>
<!-- 模态框（Modal） -->
<div class="modal fade" id="formulaCheckModalMerge" style="left: -460px;top: -30px;" data-backdrop="static" tabindex="-1"
	 role="dialog" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content" style="width: 1100px;border:1px solid #D3D3D3;">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<ul class="block-options">
						<li>
							<button type="button" class="btn btn-primary" id="formulaCheckBtnMerge" title="公式校验">
								<i class="fa fa-check"></i>
							</button>
						</li>
						<li>
							<button class="btn btn-primary" type="button" data-dismiss="modal" aria-hidden="true" title="关闭">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">公式校验</h3>
				</div>
			</div>
			<div class="modal-body" style="height:500px;padding-bottom: 0px;">
				<div class="row">
					<div class="form-group has-info">
						<div class="col-sm-8">
							<label>公式校验类型</label>
							<select id="formulaTypeCheckMerge" style="color: #0000009e;border: 1px solid #e9e9e9;">
								<option value=""></option>
								<option value="0">导引表与底稿校验</option>
								<option value="1">底稿与附注校验</option>
								<option value="5">附注与附注校验</option>
								<option value="2">附注与报表校验</option>
								<option value="4">报表与报表校验</option>
								<option value="3">其他</option>
							</select>
						</div>
						<div class="col-sm-4" style="text-align: right;">
							<label>正确数/总数:</label>&nbsp;
							<label id="rightNumCheckMerge"></label><span>&nbsp;/&nbsp;</span><label id="totalNumCheckMerge"></label>
						</div>
					</div>
				</div>
				<table id="formulaCheckTableMerge" class="table table-bordered table-striped table-hover"></table>
			</div>
		</div><!--  /.modal-content -->
	</div><!--  /.modal -->
</div>
<!-- 模态框（Modal） -->
<div class="modal fade" id="verifyModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog">
		<div class="modal-content" style="width: 1100px;border:1px solid #D3D3D3;">
			<!--  style="width: 600px;" -->
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info" style="height: 40px;padding: 10px 20px 10px 20px;">
					<ul class="block-options">
						<li>
							<button id="verifyFormulaBtn" class="btn btn-primary" type="button" title="公式校验">
								<i class="fa fa-check" style="color: white;"> 核对</i>
							</button>
						</li>
						<li>
							<button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h4 class="block-title">核对公式一览</h4>
				</div>
			</div>
			<div class="modal-body" style="height:510px;padding: 10px 20px 10px 20px;">
				<table id="verifyTable" class="table table-bordered table-striped table-hover"></table>
			</div>
		</div>
	</div>
</div>
<!-- 模态框（Modal） -->
<div class="modal" id="remarkModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content" style="border:1px solid #D3D3D3;">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info" style="height: 40px;padding: 10px 20px 10px 20px;">
					<ul class="block-options">
						<li>
							<button id="saveRemarkBtn" class="btn btn-primary" type="button" title="保存备注">
								<i class="fa fa-check" style="color: white;"> 保存</i>
							</button>
						</li>
						<li>
							<button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h4 class="block-title">备注</h4>
				</div>
			</div>
			<input type="text" id="formulaId" style="display: none;">
			<div class="modal-body">
				<div class="row">
					<div class="form-group has-success">
						<div class="col-sm-12">
							<div class="form-material">
								<input id="remark_input" class="form-control" type="text" maxlength="200">
								<label for="remark_input">核对公式备注</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- 模态框（Modal） -->
<div class="modal fade" id="verifyModalMerge" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
	<div class="modal-dialog">
		<div class="modal-content" style="width: 1100px;border:1px solid #D3D3D3;">
			<!--  style="width: 600px;" -->
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info" style="height: 40px;padding: 10px 20px 10px 20px;">
					<ul class="block-options">
						<li>
							<button id="verifyFormulaMergeBtn" class="btn btn-primary" type="button" title="公式校验">
								<i class="fa fa-check" style="color: white;"> 核对</i>
							</button>
						</li>
						<li>
							<button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h4 class="block-title">核对公式一览</h4>
				</div>
			</div>
			<div class="modal-body" style="height:510px;padding: 10px 20px 10px 20px;">
				<table id="verifyTableMerge" class="table table-bordered table-striped table-hover"></table>
			</div>
		</div>
	</div>
</div>
<!-- 模态框（Modal） -->
<div class="modal" id="remarkModalMerge" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content" style="border:1px solid #D3D3D3;">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info" style="height: 40px;padding: 10px 20px 10px 20px;">
					<ul class="block-options">
						<li>
							<button id="saveRemarkBtnMerge" class="btn btn-primary" type="button" title="保存备注">
								<i class="fa fa-check" style="color: white;"> 保存</i>
							</button>
						</li>
						<li>
							<button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h4 class="block-title">备注</h4>
				</div>
			</div>
			<input type="text" id="formulaIdMerge" style="display: none;">
			<div class="modal-body">
				<div class="row">
					<div class="form-group has-success">
						<div class="col-sm-12">
							<div class="form-material">
								<input id="remark_input_merge" class="form-control" type="text" maxlength="200">
								<label for="remark_input_merge">核对公式备注</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- 模态框（Modal） -->
<div class="modal fade" id="formulaMainModal" style="left: -460px;top: -30px;" data-backdrop="static" tabindex="-1"
	 role="dialog" aria-labelledby="formulaModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content" style="width: 1100px;border:1px solid #D3D3D3;">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info" style="height: 40px;padding: 10px 20px 10px 20px;">
					<ul class="block-options">
						<li>
							<button class="btn btn-primary" type="button" data-dismiss="modal" aria-hidden="true" title="关闭">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h4 class="block-title" id="formulaModalLabel">公式</h4>
				</div>
			</div>
			<div class="modal-body" style="height:500px;padding: 10px 20px 10px 20px;">
				<div class="block" style="height: 90%;">
					<div>
						<ul class="nav nav-tabs " data-toggle="tabs">
							<li class="active">
								<a href="#tagMainTab" style="height: 30px;"><h3 class="block-title">标签</h3></a>
							</li>
							<li>
								<a href="#formulaMainTab" style="height: 30px;"><h3 class="block-title">公式</h3></a>
							</li>
						</ul>
					</div>
					<div class="block-content block-content-full" style="height:90%;padding: 0px;">
						<div class="tab-content">
							<div class="postil-content-wrap tab-pane active" id="tagMainTab">
								<div class="block-header bg-primary" style="height:30px;padding: 5px 20px;">
									<div class="row">
										<div class="form-group has-info">
											<div class="col-sm-8">
												<h4 class="block-title">标签一览</h4>
											</div>
											<div class="col-sm-4">
												<div style="float: right;">
													<label>标签类型</label>
													<select id="tagTypeMain" style="color: #0000009e;border: 1px solid #e9e9e9;">
														<option value=""></option>
														<option value="db">TB</option>
														<option value="function">导引表</option>
														<option value="dg">底稿</option>
														<option value="note">附注</option>
														<option value="report">报表</option>
													</select>
												</div>
											</div>
										</div>
									</div>
								</div>
								<input type="text" id="formulaMainSubjectId" style="display: none;">
								<input type="text" id="formulaMainSubjectName" style="display: none;">
								<div class="block-content" style="padding-top: 5px;">
									<table id="tagsMainTable" class="table table-bordered table-striped table-hover"></table>
								</div>
								<div class="block-header bg-primary" style="height:30px;padding: 5px 20px;">
									<ul class="block-options">
										<li>
											<span style="color: white">校验公式类型: 
												<select id="formulaType" style="color: #0000009e; border: 0;">
													<option value="0" selected>导引表与底稿校验</option>
													<option value="1">底稿与附注校验</option>
													<option value="5">附注与附注校验</option>
													<option value="2">附注与报表校验</option>
													<option value="4">报表与报表校验</option>
													<option value="3">其他</option>
												</select>
											</span>
										</li>
										<li>
											<button type="button" class="btn btn-default" style="color: aliceblue;" id="ensureProjectTagMainBtn" title="设置公式">
												<i class="fa fa-send"></i>
											</button>
										</li>
										<li>
											<button type="button" class="btn btn-default" style="color: aliceblue;" id="uodoTagMainBtn" title="撤销">
												<i class="fa fa-undo"></i>
											</button>
										</li>
									</ul>
									<h4 class="block-title">计算公式</h4>
								</div>
								<div class="block-content" style="padding: 0px 20px 1px 20px;">
									<div class="form-material" id="tagMainGroup">
									</div>
								</div>
							</div>
							<div class="postil-content-wrap tab-pane" id="formulaMainTab">
								<div class="block-header bg-primary" style="height:30px;padding: 5px 20px;">
									<div class="col-sm-2" style="padding-left: 0px;">
										<label> 校验数据公式一览</label>
									</div>
									<div class="col-sm-4">
										<label>公式校验类型</label>
										<select id="formulaTypeMain" style="color: #0000009e;border: 1px solid #e9e9e9;">
											<option value=""></option>
											<option value="0">导引表与底稿校验</option>
											<option value="1">底稿与附注校验</option>
											<option value="5">附注与附注校验</option>
											<option value="2">附注与报表校验</option>
											<option value="4">报表与报表校验</option>
											<option value="3">其他</option>
										</select>
									</div>
									<div class="col-sm-4" style="text-align: right;">
										<label>正确数/总数:</label>&nbsp;
										<label id="rightNumMain"></label><span>&nbsp;/&nbsp;</span><label id="totalNumMain"></label>
									</div>
									<div class="col-sm-2" style="text-align: right;padding-right: 0px;">
										<button id="checkFormulaMainBtn" class="btn btn-primary" style="height: 23px;padding-top: 1px;" type="button" title="公式校验">
											<i class="fa fa-check" style="color: white;"> 校验</i>
										</button>
									</div>
								</div>
								<div class="block-content">
									<table id="formulaMainTable"
										   class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div><!--  /.modal-content -->
	</div><!--  /.modal -->
</div>
<!-- 模态框（Modal） -->
<div class="modal fade" id="formulaModal" style="left: -460px;top: -30px;" data-backdrop="static" tabindex="-1"
	 role="dialog" aria-labelledby="formulaModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content" style="width: 1100px;border:1px solid #D3D3D3;">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info" style="height: 40px;padding: 10px 20px 10px 20px;">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="block-title" id="formulaModalLabel">公式</h4>
				</div>
			</div>
			<div class="modal-body" style="height:505px;padding: 10px 20px 10px 20px;">
				<div class="block" style="height: 90%;">
					<div>
						<ul class="nav nav-tabs " data-toggle="tabs">
							<li class="active">
								<a href="#tagTab" style="height: 30px;"><h3 class="block-title">标签</h3></a>
							</li>
							<li>
								<a href="#formulaTab" style="height: 30px;"><h3 class="block-title">公式</h3></a>
							</li>
						</ul>
					</div>
					<div class="block-content block-content-full" style="height:90%;padding: 0px;">
						<div class="tab-content">
							<div class="postil-content-wrap tab-pane active" id="tagTab">
								<div class="block-header bg-primary" style="height:30px;padding: 5px 20px;">
									<label> 标签一览</label>
								</div>
								<input type="text" id="formulaSubjectId" style="display: none;">
								<input type="text" id="formulaSubjectName" style="display: none;">
								<div class="block-content">
									<table id="tagsTable"
										   class="table table-bordered table-striped table-hover"></table>
								</div>
								<div class="block-header bg-primary" style="height:30px;padding: 5px 20px;">
									<label>计算公式</label>
								</div>
								<div class="block-content" style="padding: 0px 20px 1px 20px;">
									<div class="form-material" id="tagGroup">
									</div>
								</div>
								<div style="float:right;">
									<br>
									<button type="button" class="btn btn-default" id="uodoTagBtn">撤销</button>
								</div>
							</div>
							<div class="postil-content-wrap tab-pane" id="formulaTab">
								<div class="block-header bg-primary" style="height:30px;padding: 5px 20px;">
									<ul class="block-options">
										<li>
											<button id="checkFormulaBtn" type="button">
												<i class="fa fa-check" style="color: white;"> 校验</i>
											</button>
										</li>
									</ul>
									<label> 校验数据公式一览</label>
								</div>
								<div class="block-content">
									<table id="formulaTable"
										   class="table table-bordered table-striped table-hover"></table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer" style="padding: 10px 20px 10px 20px;">
				<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
				<button type="button" class="btn btn-primary" id="ensureProjectTagBtn">设置公式</button>
			</div>
		</div><!--  /.modal-content -->
	</div><!--  /.modal -->
</div>
<!-- 模态框（Modal） -->
<div class="modal fade" id="tagSetModal" data-backdrop="static" tabindex="-1" role="dialog"
	 aria-labelledby="projectTagModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content" style="width: 400px;border:1px solid #D3D3D3;">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-info">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="block-title" id="tagSetModalLabel">设置标签</h4>
				</div>
			</div>
			<div class="modal-body">
				<div class="block block-themed">
					<div class="row">
						<div class="form-group has-info">
							<div class="col-sm-8">
								<div class="form-material">
									<input class="form-control" type="text" id="customAlias">
									<label for="customAlias">标签名</label>
								</div>
							</div>
						</div>
					</div>
					<br>
					<div class="row">
						<div class="form-group has-info">
							<div class="col-sm-8">
								<div class="form-material">
									<input class="form-control" type="text" id="aliasPosition" readonly="readonly">
									<label for="aliasPosition">标签位置</label>
								</div>
							</div>
						</div>
					</div>
					<input class="form-control" type="hidden" id="aliasValue">
					<input class="form-control" type="hidden" id="subjectId">
					<input class="form-control" type="hidden" id="subjectName">
					<input class="form-control" type="hidden" id="tagType">
					<input class="form-control" type="hidden" id="tagYyyy">
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
				<button type="button" class="btn btn-primary" id="setTagBtn">确定</button>
			</div>
		</div><!--  /.modal-content -->
	</div><!--  /.modal -->
</div>
<div class="modal fade" id="searchProjectFileModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
         data-keyboard="false">
        <div class="modal-dialog" style="margin-top: 50px;margin-left: 80px;">
            <div class="modal-content" style="width: 800px;">
                <div class="block block-themed block-transparent remove-margin-b">
                    <div class="block-header bg-info">
                        <ul class="block-options">
                            <li>
                                <button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">
                                    <i class="si si-close"></i>
                                </button>
                            </li>
                        </ul>
                        <h4 class="block-title">搜索项目文档</h4>
                    </div>
                </div>
                <div class="modal-body" style="height:60px;padding: 10px;overflow:hidden;">
                    <div class="block block-themed">
                    <div class="row">
                        <div class="form-group has-info">
                            <div class="col-sm-12">
                                <div class="js-form-search push">
                                    <input class="js-search-address form-control form-control-lg form-control-alt" type="text" id="searchProjectFileName" placeholder="搜索项目文档">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
<script type="text/javascript">
	var userLevel = '<%=((cn.com.bdo.base.listener.UserSession)request.getSession().getAttribute("userSession")).getUserLevel()%>';
	var spreadDesignerPath = encodeURI('${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/');
	if (!jQuery.isNumeric(userLevel)) {
		userLevel = '0';
	}
	$.fn.datepicker_ = $.fn.datepicker;
	window.faithPath = "${pageContext.request.contextPath}";
</script>

<link media="all" rel="stylesheet" type="text/css"
	  href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.Release.12.1.0/css/gc.spread.sheets.excel2013white.12.1.0.css">
<link rel="stylesheet" type="text/css"
	  href="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/themes/icon.css">
<link rel="stylesheet" type="text/css"
	  href="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.css">
<link rel="stylesheet" type="text/css"
      href="${pageContext.request.contextPath}/assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css">
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>

<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-autocomplete/jquery.autocomplete.min.js"></script>
<link rel="stylesheet" href="${pageContext.request.contextPath}/dgCenter/js/dg/adjust.css">
<%-- 禁止再往下添加js --%>
<%-- 把需要添加的js 写入 dgCenter/common/dgMain.lib.jsonp --%>
<script src="${pageContext.request.contextPath}/dgCenter/dgMain.lib.js"></script>

