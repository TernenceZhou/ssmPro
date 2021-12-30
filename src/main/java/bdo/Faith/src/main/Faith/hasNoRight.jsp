<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="Shortcut Icon" href="${pageContext.request.contextPath}/img/coop/logo2.png">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/bootstrap.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/oneui.css" id="css-main">

<script type="text/javascript">
	var destUrl = window.destUrl;
	function goBack(){
		if(destUrl == '' ||destUrl == 'null'){
			window.history.back();
		}else{
			window.location.href = window.destUrl;
		} 
	}
</script>
<%
	String errorId = (String) session.getAttribute("errorCode");
	String errMsg = "";
	int err = 0;
	if (errorId != null && !errorId.equals("")) {
		err = Integer.parseInt(errorId);
		switch (err) {
		case 1:
			errMsg = "对不起，您没有该权限。";
			break;
		case 2:
			errMsg = "对不起，请重新登陆。";
			break;
		case 3:
			errMsg = "对不起，系统正在启动中，请稍后再试。";
			break;
		case 4:
			errMsg = "对不起，系统正在维护中，请稍后再试。";
			break;
		case 9:
			errMsg = "对不起，发生系统错误，请联系系统管理员。";
			break;
		default:
			break;
		}
	}
	Exception ex = (Exception) request.getAttribute("exception");
	if (ex != null) {
		errMsg = "对不起，发生系统错误，请联系系统管理员。";
	}
	if ("".equals(errMsg)) {
		errMsg = "发生意想不到的错误。";
	}
%>

<!-- Error Content -->
<div class="content bg-white text-center pulldown overflow-hidden">
    <div class="row">
        <div class="col-sm-6 col-sm-offset-3">
            <!-- Error Titles -->
            <h1 class="font-s48 font-w300 text-city animated flipInX">错误提示</h1>
            <h2 class="h3 font-w300 push-50-t push-50 animated fadeInUp" ><%=errMsg%></h2>
            <!-- END Error Titles -->

        </div>
    </div>
</div>
<!-- END Error Content -->

<!-- Error Footer -->
<div class="content pulldown text-muted text-center">
   <input class="flyBT btn btn-minw btn-primary" type="button" name="retry" id="retry" value="重试" onclick="goBack();">
   <input class="flyBT btn btn-minw btn-primary" type="button" name="back"  id="back"  value="返回上一页" onclick="window.history.back();">
</div>
