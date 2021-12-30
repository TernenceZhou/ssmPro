<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<%@ page import="cn.com.bdo.base.security.SecurityUtils" %>
<%@ page import="cn.hutool.core.date.DateUtil" %>
<%@ page import="java.util.Date" %>

<!DOCTYPE html>
<%
	String ua = request.getHeader("User-Agent");
	ua=ua.toLowerCase();
	boolean isChrome = ua.contains("chrome") && ua.contains("webkit") && ua.contains("mozilla");
%>
<% if(isChrome) {%>
<html>

<head>
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="-1" />
	<meta http-equiv="Cache" content="no-cache">
	<meta charset="utf-8">
	<title id="systemName"></title>
	<%@ include file="/WEB-INF/Views/Sys_INCLUDE/includeForUI.jsp" %>
	<script src="${pageContext.request.contextPath}/bdolx/js/browser.check.js"></script>
	<style>
		#examSysTitle {
			display: none;
		}
		.myBadge {
			margin-left: -5px;
			margin-top: -10px;
			margin-right: 10px;
			padding: 1px 1px;
			font-weight: 400;
		}
		.modal-content{
			-webkit-box-shadow: -4px -4px 10px 3px rgba(0, 0, 0, 0.3);
			box-shadow: -4px -4px 10px 3px rgba(0, 0, 0, 0.3);
			-webkit-transform: translateX(0) translateY(0) translateZ(0);
			-ms-transform: translateX(0) translateY(0);
			transform: translateX(0) translateY(0) translateZ(0);
		}
	</style>
	<% if(SacpCerConfigService.isIsSacpExamServer()){%>
	<style>
		#sidebar {
			background-color: #46c37b !important;
		}
		#examSysTitle {
			display: block !important;
			font-size: 16px;
			padding: 8px;
			color: white;
			background-color: red;
			position: fixed;
			top: 10px;
			align-content: center;
			text-align: center;
			width: 120px;
			left: 50%;
		}
	</style>
	<%}%>
</head>

<body>
<%@ include file="/cpBase/personalInfo.jsp" %>
<div id="page-container" class="sidebar-l sidebar-o side-scroll header-navbar-fixed sidebar-mini">
	<!-- Side Overlay-->
	<aside id="side-overlay">
		<!-- Side Overlay Scroll Container -->
		<div id="side-overlay-scroll">
			<!-- Side Header -->
			<div class="side-header side-content text-white bg-morden">
				<!-- Layout API, functionality initialized in App() -> uiLayoutApi() -->
				<button class="btn btn-default pull-right" type="button" data-toggle="layout"
						data-action="side_overlay_close">
					<i class="fa fa-times"></i>
				</button>
				<span>
					<img id="sideUserImg2" style="width:200px"
						 src="${pageContext.request.contextPath}/img/coop/logo.png" alt="">
				</span>
			</div>
			<!-- END Side Header -->
			<!-- Side Content -->
			<div class="side-content remove-padding-t">
				<!-- Side Overlay Tabs -->
				<div class="block pull-r-l border-t">
					<ul class="nav nav-tabs nav-tabs-alt nav-justified" data-toggle="tabs">
						<li class="active" id="tabs-focus-li">
							<a href="#tabs-focus"><i class="fa fa-fw fa-address-book-o"></i>关注</a>
						</li>
						<li id="tabs-sacpce-li">
							<a href="#tabs-sacpce"><i class="fa fa-fw fa-certificate"></i>证书</a>
						</li>
					</ul>

					<div class="block-content tab-content" style="padding:0px 20px 1px !important">
						<!-- Overview Tab -->
						<div class="tab-pane fade fade-right active in" id="tabs-focus">
							<div class="block pull-r-l">
								<div class="block-content block-content-full">
									<div style="position: relative; margin-bottom: 15px;">
										<input class="form-control" type="text" id="tabs-focus-search" placeholder="请输入姓名.." style="padding-right: 40px;">
										<i class="fa fa-search" id="tabs-focus-search-i" style="color: #acacac; position: absolute; top: 10px; right: 15px;"></i>
									</div>
									<ul class="nav-users remove-margin-b"></ul>
								</div>
							</div>
						</div>
						<div class="tab-pane fade fade-right" id="tabs-sacpce">
							<div class="block pull-r-l">
								<div class="block-content block-content-full">
									<div style="position: relative; margin-bottom: 15px;">
										<input class="form-control" type="text" id="tabs-sacpce-search" placeholder="请输入姓名.." style="padding-right: 40px;">
										<i class="fa fa-search" id="tabs-sacpce-search-i" style="color: #acacac; position: absolute; top: 10px; right: 15px;"></i>
									</div>
									<ul class="nav-users remove-margin-b"></ul>
								</div>
							</div>
						</div>
						<!-- END Overview Tab -->
					</div>
				</div>
				<!-- END Side Overlay Tabs -->
			</div>
			<!-- END Side Content -->
		</div>
		<!-- END Side Overlay Scroll Container -->
	</aside>
	<!-- END Side Overlay -->

	<!-- Sidebar -->
	<nav id="sidebar">
		<!-- Sidebar Scroll Container -->
		<div id="sidebar-scroll">
			<!-- Sidebar Content -->
			<!-- Adding .sidebar-mini-hide to an element will hide it when the sidebar is in mini mode -->
			<div class="sidebar-content">
				<!-- Side Header -->
				<div id="faithlogoHeader" class="side-header side-content bg-white-op">
					<!-- Layout API, functionality initialized in App() -> uiLayoutApi() -->
					<%--<button class="btn btn-link text-gray pull-right hidden-md hidden-lg" type="button"
							data-toggle="layout" data-action="sidebar_close">
						<i class="fa fa-times"></i>
					</button>
					<span>
						<img class="img-avatar img-avatar32" id="userPhoto3"
							 src="bdolx/img/faithlogo.png" alt="" onerror="this.src='assets/img/avatars/avatar10.jpg';this.onerror=null">
						<span id="userLabel" class="userLable"></span>
					</span>--%>
					<button class="btn btn-link text-gray pull-right hidden-md hidden-lg menu-sidebar-close" type="button"
							data-toggle="layout" data-action="sidebar_close">
						<i class="fa fa-times"></i>
					</button>
					<div id="faithlogo"></div>
				</div>
				<!-- END Side Header -->
				<!-- Side Content -->
				<div class="side-content">
					<ul id="mainMenu" class="nav-main">
						<li>
							<a id="defaultPage" class='menu nav-submenu' data-toggle='nav-submenu'
							   target="${pageContext.request.contextPath}/general.do?menuid=40000077&bid=40000077" mid="40000077">
								<i class="si si-home"></i>
								<span class="sidebar-mini-hide h5">首页</span>
							</a>
						</li>
					</ul>
				</div>
				<!-- END Side Content -->
			</div>
			<!-- Sidebar Content -->
		</div>
		<!-- END Sidebar Scroll Container -->
	</nav>
	<!-- END Sidebar -->

	<!-- Header -->
	<header id="header-navbar" class="content-mini content-mini-full" style="float:left;">
		<!-- Header Navigation Right -->
		<ul class="nav-header pull-right">
			<li>
				<ul class="nav-header" id="btn_shortcutmenu"></ul>
			</li>
			<li>
				<p id="examCerExpired" style="color:red;"></p>
			</li>
			<li>

				<!-- Layout API, functionality initialized in App() -> uiLayoutApi() -->
				<button id="TemplateLibrary" data-toggle="modal" data-target="#utilModal" name="sideToggleBtn"
						class="btn btn-minw btn-rounded btn-primary"
						type="button">
					<!-- data-toggle="modal" data-target="#utilModal" -->
					<!-- data-toggle="layout"   data-action="side_overlay_toggle" -->
					<i>常用工具下载</i>
				</button>
			</li>
			<li>
				<div class="btn-group">
					<button class="btn btn-default btn-image dropdown-toggle" data-toggle="dropdown" type="button">
						<img src="${pageContext.request.contextPath}/assets/img/avatars/avatar10.jpg" alt="Avatar"
							 id="userPhoto2"
							 onerror="this.src='${pageContext.request.contextPath}/assets/img/avatars/avatar10.jpg';this.onerror=null">
						<span class="caret"></span>
					</button>
					<ul class="dropdown-menu dropdown-menu-right">
						<!--<li class="dropdown-header">我的资料</li> -->
						<li>
							<a tabindex="-1" href="#" id="user_info">
								<i class="si si-user pull-right"></i>我的资料
							</a>
						</li>
						<li>
							<a tabindex="-1" href="javascript:void(0)" id="shortcut_meun">
								<i class="si si-rocket pull-right"></i>快捷菜单
							</a>
						</li>
						<li>
							<a tabindex="-1" href="#" id="sys_version">
								<i class="si si-list pull-right"></i>版本信息
							</a>
						</li>
						<li>
							<a tabindex="-1" href="javascript:void(0)" id="main_feedback">
								<i class="si si-loop pull-right"></i>反馈意见
							</a>
						</li>
						<li>
							<a tabindex="-1" href="javascript:void(0)" id="main_logout">
								<i class="si si-logout pull-right"></i>安全退出
							</a>
						</li>
					</ul>
				</div>
			</li>

			<li>
				<!-- Layout API, functionality initialized in App() -> uiLayoutApi() -->
				<button id="sideToggleBtn" name="sideToggleBtn" class="btn btn-default" data-toggle="layout"
						data-action="side_overlay_toggle"
						type="button">
					<i name="sideToggleBtn" class="fa fa-tasks"></i>
				</button>
			</li>
			<li>
				<div class="btn-group pull-right">
					<button class="btn btn-link text-gray dropdown-toggle" data-toggle="dropdown" type="button">
						<i class="si si-drop"></i>
					</button>
					<ul class="dropdown-menu dropdown-menu-right font-s13 sidebar-mini-hide">
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/10px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">10px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/12px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">12px</span>
							</a>
						</li>
						<li class="active">
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/14px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">14px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/16px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">16px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/18px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">18px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/20px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">20px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/22px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">22px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/24px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">24px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/26px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">26px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/28px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">28px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/30px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">30px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/32px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">32px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/34px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">34px</span>
							</a>
						</li>
						<li>
							<a data-toggle="font-theme" data-theme="bdolx/css/themes/36px.css" tabindex="-1"
							   href="javascript:void(0)">
								<span class="font-w600">36px</span>
							</a>
						</li>
					</ul>
				</div>
			</li>
		</ul>
		<!-- END Header Navigation Right -->
		<!-- Header Navigation Left -->
		<ul class="nav-header pull-left">
			<li class="hidden-md hidden-lg">
				<button class="btn btn-default" data-toggle="layout" data-action="sidebar_toggle" type="button">
					<i class="fa fa-navicon"></i>
				</button>
			</li>
			<li class="hidden-xs hidden-sm">
				<button class="btn btn-default" data-toggle="layout" data-action="sidebar_mini_toggle" type="button">
					<i class="fa fa-ellipsis-v"></i>
				</button>
			</li>
			<li>
				<!--  Opens the Apps modal found at the bottom of the page, before including JS code -->
				<button class="btn btn-bdo-imgicon pull-right" id="openXXRWindowBtn"
						type="button" style="padding: 1.5px;">
					<i class="bdo-imgicon bdo-imgicon-bdoxxr"></i>
				</button>
			</li>
			<li>
				<!--  Opens the Apps modal found at the bottom of the page, before including JS code -->
				<button class="btn btn-bdo-imgicon pull-right" data-toggle="modal" data-target="#bdostore-modal"
						type="button" style="padding: 1.5px;">
					<i class="bdo-imgicon bdo-imgicon-bdostore"></i>
				</button>
			</li>
			<li>
				<div class="font-w300 text-white bg-success" style="margin-top:-5px">
					<div id="navCustomerName"></div>
					<div id="navProjectName"></div>
				</div>
			</li>
		</ul>
		<!-- END Header Navigation Left -->
		<ul id="examSysTitle" class="nav-header pull-left">
			考试环境
		</ul>
	</header>
	<!-- END Header -->

	<!-- Main Container -->

	<div class="modal fade" id="utilModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
		 aria-hidden="true">
		<div class="modal-dialog" style="width: 1090px">
			<div class="modal-content" style="padding: 0px 0px 0px 0px;">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="myModalLabel">常用工具下载</h4>
				</div>
				<div class="modal-body" id="main-containerModal" style="padding: 0px; ">
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="bdostore-modal" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
		<div class="modal-sm modal-dialog modal-dialog-top" style="width: 500px">
			<div class="modal-content">
				<!--  Bdo Store Block -->
				<div class="block block-themed block-transparent">
					<div class="block-header bg-primary-dark">
						<ul class="block-options">
							<li>
								<button data-dismiss="modal" type="button"><i class="si si-close"></i></button>
							</li>
						</ul>
						<h3 class="block-title">Bdo Store</h3>
					</div>
					<div class="block-content">
						<div class="row text-center">
							<div class="col-xs-4">
								<a class="block bdo-store-block" href="javascript:void(0)" id="main_addressCheck">
									<div class="block-content bdo-store-block-content text-info  bg-gray-light" style="min-height:120px">
										<i class="fa fa-address-book-o fa-2x bdo-store-block-icon"></i>
										<div class="font-w600 push-15-t push-15" style="width: 85px;">函证地址验证</div>
									</div>
								</a>
							</div>
							<div class="col-xs-4">
                                <a class="block bdo-store-block" href="javascript:void(0)" id="main_recover_sales">
                                    <div class="block-content bdo-store-block-content text-info  bg-gray-light" style="min-height:120px">
                                        <i class="fa fa-jpy fa-2x bdo-store-block-icon"></i>
                                        <div class="font-w600 push-15-t push-15" style="width: 85px;">应收账款回收率和本期销售</div>
                                    </div>
                                </a>
                            </div>
                            <div class="col-xs-4">
                                <a class="block bdo-store-block" href="javascript:void(0)" id="main_vouching">
                                    <div class="block-content bdo-store-block-content text-info  bg-gray-light" style="min-height:120px">
                                        <i class="fa fa-binoculars fa-2x bdo-store-block-icon"></i>
                                        <div class="font-w600 push-15-t push-15" style="width: 85px;">SACP监盘系统</div>
                                    </div>
                                </a>
                            </div>
							<div class="col-xs-4">
								<a class="block bdo-store-block" href="javascript:void(0)" id="main_faith_te">
									<div class="block-content bdo-store-block-content text-info  bg-gray-light" style="min-height:120px">
										<i class="fa fa-binoculars fa-2x bdo-store-block-icon"></i>
										<div class="font-w600 push-15-t push-15" style="width: 85px;">底稿模板</div>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
				<!--  END Bdo Store Block -->
			</div>
		</div>
	</div>
	<main id="main-container">

	</main>
</div>
<!-- END Page Container -->

<!-- 配置快捷菜单模态框 -->
<div class="modal fade" id="shortcut-meun-modal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-sm modal-dialog">
		<div class="modal-content">
			<div class="block block-themed block-transparent">
				<div class="block-header bg-primary-dark">
					<ul class="block-options">
						<li>
							<button data-dismiss="modal" type="button">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">快捷菜单设置</h3>
				</div>
				<div class="modal-body">

					<div class="content">
						<div class="block block-themed" style="margin-bottom: 10px;">
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
								<h3 class="block-title">搜索</h3>
							</div>
							<div class="block-content">
								<div class="row">
									<div class="form-group">
										<div class="col-sm-6">
											<div class="form-material">
												<input class="form-control" type="text" id="search_meun"/>
												<label for="search_meun">菜单名称</label>
											</div>
										</div>
										<div class="col-sm-6">
											<div class="form-material">
												<input class="form-control" type="text" id="search_meunpath"/>
												<label for="search_meunpath">菜单路径</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>


						<div class="block block-themed">
							<div class="block-header bg-primary">
								<h3 class="block-title">我的快捷菜单</h3>
							</div>
							<div class="block-content">
								<table id="shortcut-meun-table"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!--反馈意见-->
<div class="modal fade" id="feedbackForm" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-sm modal-dialog">
		<div class="modal-content">
			<div class="block block-themed block-transparent">
				<div class="block-header bg-primary">
					<ul class="block-options">
						<li>
							<button data-dismiss="modal" type="button">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">反馈意见</h3>
				</div>
				<div class="modal-body">
					<h3 class="block-title">请简单描述您遇到的问题或意见</h3>
					<div class="block-content bg-gray-lighter" style="padding: 10px 10px 1px;">
						<div class="row form-group" style="margin-bottom: 10px;">
							<div class="col-xs-12" >
								<textarea class="form-control postil-textarea" rows="8" id="feebackContent"></textarea>
							</div>
						</div>
						<div class="row form-group" style="margin-bottom: 10px; float:right">
							<div class="col-xs-12">
								<button class="btn btn-ms btn-primary" id="feedback_submit" >&nbsp;提交</button>
								<button class="btn btn-ms btn-warning " id="feedback_close" >&nbsp;取消</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


<!-- 业务机会--业务机会模态框 -->
<div class="modal fade" id="sideMyAttModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
	 data-keyboard="false">
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
				<form class="form-horizontal" id="sideMyAttForm"></form>
			</div>
		</div>
	</div>
</div>

<!-- 合作伙伴--业务合作清单 -->
<div class="modal fade" id="sideMyCoopRegistModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-sm modal-dialog">
		<div class="modal-content">
			<div class="block block-themed block-transparent">
				<div class="block-header bg-primary-dark">
					<ul class="block-options">
						<li>
							<button data-dismiss="modal" type="button">
								<i class="si si-close"></i>
							</button>
						</li>
					</ul>
					<h3 class="block-title">合作伙伴【
						<span id="sideMyCoopRegistNm"></span>】</h3>
				</div>
				<div class="modal-body">

					<div class="content">
						<div class="block block-themed" style="margin-bottom: 10px;">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button id="btn_sideMyCoopRegist_clear" type="button">
											<i class="fa fa-repeat" style="color: white;">&nbsp;重置</i>
										</button>
									</li>
									<li>
										<button id="btn_sideMyCoopRegist_search" type="button">
											<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
										</button>
									</li>
									<li>
										<button type="button" data-toggle="block-option"
												data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">搜索</h3>
							</div>
							<div class="block-content">
								<div class="row">
									<div class="form-group">
										<div class="col-sm-6">
											<div class="form-material">
												<select class="form-control"
														id="search_sideMyCoopRegist_state"></select>
												<label for="search_sideMyCoopRegist_state">业务登记单状态</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="block block-themed">
							<div class="block-header bg-primary">
								<ul class="block-options">
									<li>
										<button type="button" data-toggle="block-option"
												data-action="content_toggle"></button>
									</li>
								</ul>
								<h3 class="block-title">业务合作记录</h3>
							</div>
							<div class="block-content">
								<table id="sideMyCoopRegistTable"
									   class="table table-bordered table-striped table-hover"></table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="mainVersionUpdateInfoModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-popin modal-lg">
		<div class="modal-content">
			<div class="block block-themed block-transparent remove-margin-b">
				<div class="block-header bg-primary" >
					<%--<ul class="block-options">
						<li>
							<button data-dismiss="modal" type="button"><i class="si si-close"></i></button>
						</li>
					</ul>--%>
					<h3 class="block-title text-center">更新提示</h3>
				</div>
				<div class="block-content">
					<div id="mainVersionUpdateVs"></div>
					<div id="mainVersionUpdateInfo"></div>
				</div>
			</div>
			<div class="modal-footer" style="text-align: center;">
				<button  class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> 知道了</button>
			</div>
		</div>
	</div>
</div>
<%--<div id="" style="align-content: center;text-align: right;position: fixed;bottom: 0;left: 0px;right: 1rem;z-index: 10000;"><i class="fa fa-copyright">2020 立信会计师事务所(特殊普通合伙) All rights reserved. 沪ICP备12039590号-1</i></div>--%>
<%--<div id="" style="align-content: center;
    text-align: right;
    position: fixed;
    width: 20rem;
    height: 1rem;
    right: 0px;
    bottom: 0.5rem;
    padding-right: 1rem;">沪ICP备12039590号-1</div>--%>
<script src="${pageContext.request.contextPath}/bdolx/main/main.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/main/menu.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/main/side.js"></script>
<script>
<%
String hrlId = userSession.getUserHrLoginId();
String bdoVouchingTrInfo = SecurityUtils.getStringMD5(hrlId + DateUtil.format(new Date(System.currentTimeMillis()), "yyyyMMdd") + "sacp");
%>
	window.trinfo = '<%=request.getAttribute("trinfo")%>';
	window.userCustomers = '<%=userSession.getUserCustomers()%>';
	window.BDO_CUSTOMER_SELECT = '<%=userSession.getCurCustomerId()%>';
	window.BDO_CUSTOMERNAME_SELECT = '<%=userSession.getCurCustomerName()%>';
	window.BDO_YEAR_SELECT = (new Date()).getFullYear() - 1;
	window.BDO_PROJECT_SELECT = '<%=userSession.getCurProjectId()%>';
	window.BDO_PROJECTNAME_SELECT = '<%=userSession.getCurProjectName()%>';
	window.bid = '<%=request.getAttribute("bid")%>';
	window.xxrUrl = '<%=PropertiesUtil.getDBSettedConfig("bdoXXRUrl")%>';
	window.xxrToken = '<%=LoginService.getXxrToken(userSession.getUserHrLoginId())%>';
	window.xxrPageKey = 'sacp首页';
	window.hasSacpCer = <%=request.getSession().getAttribute(SysConst.AttrKey.HAS_SACP_CER)%>;
	window.showHelp = <%=userSession.getShowHelp()%>;
	window.sacpCerExpired = <%=request.getSession().getAttribute(SysConst.AttrKey.SACP_CER_EXPIRED)%>;
	window.sacpCerExpiredDate = <%=request.getSession().getAttribute(SysConst.AttrKey.SACP_CER_EXPIRED_DATE)%>;
	window.bdoVouchingUrl = '<%=PropertiesUtil.getDBSettedConfig("bdoVouchingUrl") %>';
	window.bdoVouchingTrInfo = '<%=bdoVouchingTrInfo %>'
</script>
<%--<div id="bdoChat">
</div>--%>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoStyle.js"></script>
<script src="${pageContext.request.contextPath}/dgCenter/common/utils.js"></script>
<script src="${pageContext.request.contextPath}/cpBase/templateToolLibraryDownload.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/browser.check.js"></script>
</body>

</html>
<%} else {%>
<%--<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>--%>
<html class="no-focus" lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="-1" />
	<meta http-equiv="Cache" content="no-cache">
	<title><%=cn.com.bdo.cpBase.utils.SysNameUtil.getSysName()%></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<link rel="shortcut icon" href="${pageContext.request.contextPath}/img/coop/logo2.png">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/bootstrap.min.css">
	<link rel="stylesheet" id="css-main" href="${pageContext.request.contextPath}/assets/css/oneui.css">
</head>
<body>
<div class="content bg-white text-center pulldown overflow-hidden">
	<div class="row">
		<div class="col-sm-6 col-sm-offset-3">
			<h3 class="font-s128 font-w300 text-danger animated bounceInDown">请使用Chrome 浏览器!</h3>
		</div>
	</div>
</div>
</body>
</html>
<%} %>