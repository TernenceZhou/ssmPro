<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<meta http-equiv="Cache" content="no-cache">
<%--<script>
	var BDO_SYSTEM_WEB_ROOT = "${pageContext.request.contextPath}/";
	var WebRoot = "http://${header['host']}${pageContext.request.contextPath}";
	var version = 1.01;
	//var extVersion = '4.0.7';
	var sys_menuId = '<%=request.getAttribute("menuId")%>';
	if (sys_menuId == 'null') {
		sys_menuId = '';
	}
	var sys_userId = '<%=request.getAttribute("userId")%>';
	if (sys_userId == 'null') {
		sys_userId = '';
	}
</script>--%>

<%--<%@ page import="cn.com.bdo.base.listener.UserSession" %>
<%@ page import="cn.com.bdo.base.util.PropertiesUtil" %>
<%@ page import="cn.com.bdo.cpBase.service.LoginService" %>
<% UserSession userSession = (UserSession) session.getAttribute("userSession");%>--%>
<%--<script type="text/javascript">
	window.companyIdSession = '<%=userSession.getTopManageDepId()%>';
	window.companyNmSession = '<%=userSession.getTopManageDepName()%>';
	window.officeIdSession = '<%=userSession.getOfficeId()%>';
	window.officeNmSession = '<%=userSession.getOfficeNm()%>';
	window.departIdSession = '<%=userSession.getDepartmentId()%>';
	window.departNmSession = '<%=userSession.getDepartmentNm()%>';

	window.departIdrSession = '<%=userSession.getDepartmentIdr()%>';
	window.departNmrSession = '<%=userSession.getDepartmentNmr()%>';

	window.loginId = '<%=userSession.getUserLoginId()%>';
	window.hrLoginId = '<%=userSession.getUserHrLoginId()%>';
	window.selfNm = '<%=userSession.getUserName()%>';

	window.CUR_CUSTOMERID = '<%=userSession.getCurCustomerId()%>';
	window.CUR_CUSTOMERNAME = '<%=userSession.getCurCustomerName()%>';
	window.CUR_PROJECTID = '<%=userSession.getCurProjectId()%>';
	window.CUR_PROJECTNAME = '<%=userSession.getCurProjectName()%>';
	window.CUR_PROJECT_START_YEAR = '<%=userSession.getCurProjectBeginYear()%>';
	window.CUR_PROJECT_END_YEAR = '<%=userSession.getCurProjectEndYear()%>';
	window.CUR_PROJECT_START_MONTH = '<%=userSession.getCurProjectBeginMonth()%>';
	window.CUR_PROJECT_END_MONTH = '<%=userSession.getCurProjectEndMonth()%>';
	window.CUR_PROJECT_ACC_YEAR = '<%=userSession.getCurAccYear()%>';
	window.CUR_DGPROJECT_AUTOID = '<%=userSession.getCurAccYear()%>';
	window.CUR_USERID = '<%=userSession.getUserId()%>';
	window.xxrUrl = '<%=PropertiesUtil.getDBSettedConfig("bdoXXRUrl")%>';
	window.xxrToken = '<%=LoginService.getXxrToken(userSession.getUserLoginId())%>';
	//var sys_menuId = window.CUR_USERID;
	/*if (sys_menuId == '') {
		sys_menuId = '';
	}*/
	if (sys_userId == '') {
		sys_userId = window.CUR_USERID;
	}
	//window.jqFnOnDebug = true; // 开启观察使用jQuery.on方法绑定事件的回调函数执行信息（执行事件）
</script>--%>

<link rel="Shortcut Icon" href="${pageContext.request.contextPath}/img/coop/logo2.png">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/js/plugins/slick/slick.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/js/plugins/slick/slick-theme.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/bootstrap.min.css">
<link rel="stylesheet"
	  href="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-select/bootstrap-select.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/oneui.css" id="css-main">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/js/plugins/sweetalert2/sweetalert2.min.css">
<link rel="stylesheet"
	  href="${pageContext.request.contextPath}/assets/js/plugins/datatables/dataTables.bootstrap4.min.css">
<link rel="stylesheet"
	  href="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/FixedColumns/css/fixedColumns.bootstrap4.css">

<link rel="stylesheet"
	  href="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/RowReorder/css/rowReorder.dataTables.min.css">
<link rel="stylesheet"
	  href="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/ColReorder/css/colReorder.dataTables.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/bdolx/css/bdolxStyle.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/bdolx/css/form.css">
<link rel="stylesheet"
	  href="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/js/plugins/select2/select2.min.css">
<link rel="stylesheet"
	  href="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-fileinput-upload/css/fileinput.css"/>
<link rel="stylesheet"
	  href="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-fileinput-upload/themes/explorer/theme.css">
<link rel="stylesheet"
	  href="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/FixedHeader/css/fixedHeader.dataTables.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/js/plugins/select2/select2-bootstrap.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/fonts/bdo-icons/iconfont.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/js/plugins/vxe-table/vxe-table-2.5.15.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/js/plugins/bdosnap.1.0.0/static/css/bdosnap.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/bdolx/css/themes/14px.css" id="bdoFontSizeThemes">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.css">

<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/side.css">
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/form.css">
<link media="all" rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/bdolx/css/dg.css">
<!--[if IE]>
<script src="${pageContext.request.contextPath}/bdolx/js/html5.js"></script>
<![endif]-->
<script src="${pageContext.request.contextPath}/bdolx/js/bdoJson2.js"></script>
<script src="${pageContext.request.contextPath}/assets/fonts/bdo-icons/iconfont.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/jquery.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-base64/jquery.base64.js"></script>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/jquery.easyui.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/jquery.easyui.mobile.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>--%>
<script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdo.jq.ex.js"></script>
<%-- jquery on 方法重定向 --%>
<script src="${pageContext.request.contextPath}/bdolx/js/bdo.jq.onext.js"></script>
<%-- jquery on 方法重定向 end --%>
<script src="${pageContext.request.contextPath}/assets/js/core/bootstrap.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js"></script>

<script src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-select/bootstrap-select.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/jquery.slimscroll.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/jquery.scrollLock.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/jquery.appear.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/jquery.countTo.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/jquery.placeholder.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/jquery.storage.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/js.cookie.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/FileSaver.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/app.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/echarts/echarts.min.js"></script>

<script src="${pageContext.request.contextPath}/assets/js/plugins/datatables/jquery.dataTables.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/RowGroup/js/dataTables.rowGroup.min.js"></script>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/FixedColumns/js/dataTables.min.js"></script>--%>
<script src="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/FixedColumns/js/dataTables.fixedColumns.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/Scroller/js/dataTables.scroller.min.js"></script>

<script src="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/RowReorder/js/dataTables.rowReorder.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/ColReorder/js/dataTables.colReorder.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/sweetalert2/sweetalert2.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-validation/jquery.validate.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-validation/additional-methods.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/messages_zh.min.js"></script>

<!-- Page JS Plugins -- bootstrap-fileinput-upload > -->
<script src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-fileinput-upload/js/fileinput.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-fileinput-upload/js/locales/zh.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-fileinput-upload/themes/explorer/theme.js"></script>

<!-- Page JS Plugins -->
<script src="${pageContext.request.contextPath}/assets/js/plugins/accounting.js/accounting.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-treeview/bootstrap-treeview.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/chartjs/Chart.min.js"></script>

<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-ui/jquery-ui.min.js"></script>
<%--<script src="${pageContext.request.contextPath}/jquery/plugins/jui/jquery-ui-1.9.2.min.js"></script>--%>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoBaseData.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-raty/jquery.raty.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/base_comp_rating.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/slick/slick.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/select2/select2.full.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery.mousewheel/jquery.mousewheel.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/datatables/extensions/FixedHeader/js/dataTables.fixedHeader.min.js"></script>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/colresizable/colResizable-1.6.js"></script>--%>
<script src="${pageContext.request.contextPath}/assets/js/plugins/clipboard/clipboard.js"></script>

<script src="${pageContext.request.contextPath}/assets/js/plugins/jquery-easyui/easyloader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/summernote/summernote.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/core/underscore-min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/bdosnap.1.0.0/static/js/bdosnap.js"></script>

<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/template-web.js"></script>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/vue.min.js"></script>--%>
<script src="${pageContext.request.contextPath}/assets/js/plugins/vue/vue-2.6.10.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/vxe-table/xe-utils-2.2.4.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/vxe-table/vxe-table-2.5.15.min.js"></script>

<script src="${pageContext.request.contextPath}/bdolx/js/bdoConsts.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoCommon.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoChat.js"></script>
<!-- Page JS Custom -->
<%--<script src="${pageContext.request.contextPath}/bdolx/js/bdoJson2.js"></script>--%>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoExportExecl.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoValidate.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoModal.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoComboData.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoDataTable.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoTree.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoTree3.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoTree4.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoTreeCombo.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoForm.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoAlertBox.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoFormatData.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoTheadContext.js"></script>


<script src="${pageContext.request.contextPath}/bdolx/js/bdoUtils.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoPage.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoSide.js"></script>

<script src="${pageContext.request.contextPath}/bdolx/js/bdoTreeIndustry.js"></script>


<script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=yWMdL1kBmM9d43cfk3RAdD98q8MhbwNo"></script>
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/performance/loader.js"></script>--%>
<%--
<script type="text/javascript" 
        src="https://api.map.baidu.com/getscript?v=2.0&ak=FaEnlIpf8NRUzLdnyghf6gNV6LLOeAGP&services=&t=20190123111209"></script>--%>
