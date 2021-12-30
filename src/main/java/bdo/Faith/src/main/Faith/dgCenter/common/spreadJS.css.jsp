<%--
  Created by IntelliJ IDEA.
  User: fangj
  Date: 2018/11/15
  Time: 10:37
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>
<!-- Libraries -->
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/lib/jquery-ui/css/smoothness/jquery-ui-1.10.3.custom.min.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/lib/gcui.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.Release.12.1.0/css/gc.spread.sheets.excel2013white.12.1.0.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/lib/zTreeStyle/css/zTreeStyle.css"
	  rel="stylesheet" type="text/css"/>

<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/common/common.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/colorpicker/colorpicker.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/fontpicker/fontpicker.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/comboframe/comboframe.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/borderpicker/borderpicker.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/sliderpanel/sliderpanel.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/dialogs/dialogs.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/dialogs/dialogs2.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/dialogs/chartDialogs.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/formatDialog/formatDialog.css"
	  rel="stylesheet" type="text/css"/>
<!-- 自定义-->
<%--
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/bdotools/dialogs.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/bdotools/dialogs1.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/bdotools/mergedialogs.css"
	  rel="stylesheet" type="text/css"/>
--%>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/ribbon/ribbon.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/formulaBar/formulaBar.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/spreadWrapper/spreadWrapper.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/statusBar/statusBar.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/contextMenu/contextMenu.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/fileMenu/fileMenu.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/index/index.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/chartColorPicker/chart-colorPicker.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/addChartElement/chartAddChartElement.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/chartTypePicker/chartTypePicker.css"
	  rel="stylesheet" type="text/css"/>
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/chartLayoutPicker/chartLayoutPicker.css"
	  rel="stylesheet" type="text/css"/>
<!-- CN special -->
<link href="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/common/local.cn.css"
	  rel="stylesheet">

