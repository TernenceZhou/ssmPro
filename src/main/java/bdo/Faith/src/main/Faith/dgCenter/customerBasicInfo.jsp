<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<%--
<%@ page import="cn.com.bdo.base.listener.UserSession" %>
<%@ page import="cn.com.bdo.base.util.PropertiesUtil"%>
<%
	UserSession userSession = (UserSession) session.getAttribute("userSession");
	String coopUrl = PropertiesUtil.getDBSettedConfig("bdoCoopSystemUrl");
	String toUrl = coopUrl + "bdocuslogin.do?m=login&pwd=pwd&operate=view&systemid=faith&userHrLoginId=" + userSession.getUserHrLoginId() + "&customerId={customerId}&ueserLoginId=" + userSession.getUserHrLoginId();
%>
<script>
	var frame = document.getElementById('toFrameId');
	frame.src = "<%=toUrl%>".replace("{customerId}", BDO_CUSTOMER_SELECT) + trinfo;
	pageRightTitle(pageTitleArr);
</script>
<iframe id="toFrameId" name="toFrameName" src="" scrolling="auto" frameborder="0" width="100%" height="800"></iframe>--%>
<div id="cusBaseInfoFrame"></div>
<script src="${pageContext.request.contextPath}/bdolx/js/bdoStyle.js"></script>
<script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
<script>
    $(document).ready(function() {
        let $iframe = '<iframe id="toFrameId" name="toFrameName" ' +
            'src="' + window.bdoCoopSystemUrl.replace("{customerId}", window.BDO_CUSTOMER_SELECT) +  '&' + 
		        window.trinfo +
            '" scrolling="auto" frameborder="0" width="100%" height="800"></iframe>';
	    pageRightTitle(pageTitleArr);
        $('#cusBaseInfoFrame').replaceWith($($iframe));
    });
</script>
