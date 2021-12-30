<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<div>
    <script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
    <script language="JavaScript">

        $(document).ready(function () {
            let url = window.bdoVouchingUrl;
            let hrLoginId = window.hrLoginId;
            let trinfo = window.bdoVouchingTrInfo;
            let projectId = window.CUR_PROJECTID;
            if (hrLoginId && hrLoginId > '' && trinfo && trinfo > '' && projectId && projectId > '' && url > '') {
                url = url.replace('{hrLoginId}', hrLoginId)
                    .replace('{token}', trinfo)
                    .replace('{projectId}', projectId);
                window.open(url, '_blank');
            }
        });
    </script>
</div>


