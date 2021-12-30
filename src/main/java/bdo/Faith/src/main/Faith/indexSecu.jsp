<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
</head>
<body>
</body>
<script src="${pageContext.request.contextPath}/assets/js/core/jquery.min.js"></script>
<script type="text/javascript">
 <!--
 
		function openChromeWindow(url, datas, name) {
			var rtn = null;
			var tempForm = document.createElement("form");
			tempForm.id = "testOpenPostForm";
			tempForm.method = "post";
			tempForm.action = url;
			tempForm.target = name;
			var postDatas = [];
			var fulls = "left=0,screenX=0,top=0,screenY=0,scrollbars=1,toolbar=no,location=no,directories=no,alwaysRaised=yes"; // 定义弹出窗口的参数
			if (window.screen) {
				var ah = screen.availHeight - 30;
				var aw = screen.availWidth - 10;
				fulls += ",height=" + ah;
				fulls += ",innerHeight=" + ah;
				fulls += ",width=" + aw;
				fulls += ",innerWidth=" + aw;
				fulls += ",resizable"
			} else {
				fulls += ",resizable"; // 对于不支持screen属性的浏览器，可以手工进行最大化。
				// manually
			}
			postDatas = datas;
			
			$.each(postDatas,function(index,data) {
						var hideInput = document.createElement("input");
						hideInput.type = "hidden";
						hideInput.name = data.name;
						hideInput.value = data.value;
						tempForm.appendChild(hideInput);
					});

			document.body.appendChild(tempForm);
			tempForm.target = '_self';
			tempForm.submit();

			document.body.removeChild(tempForm);
			return rtn;
		}

		var postDatas = [];
		postDatas.push({name:'m',value:'login'});
		postDatas.push({name:'token',value:'<%=request.getParameter("token")%>'});
		postDatas.push({name:'loginid',value:'<%=request.getParameter("loginid")%>'});
		postDatas.push({name:'mid',value:'<%=request.getParameter("mid")%>'});
		var newWin = openChromeWindow('./bdologin.do?m=login',postDatas,'MyPostWin');

-->
</script>
</html>