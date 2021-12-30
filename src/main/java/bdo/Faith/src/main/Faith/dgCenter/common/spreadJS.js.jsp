<%--
  Created by IntelliJ IDEA.
  User: fangj
  Date: 2018/11/15
  Time: 10:37
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>

<!-- Libraries -->
<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/lib/jquery-2.0.2.min.js"></script>--%>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/lib/jquery-ui/js/jquery-ui-1.10.3.custom.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/lib/knockout-2.3.0.min.js"></script>

<%--<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.Release.12.1.0/scripts/gc.spread.sheets.all.12.1.0.min.js" type="text/javascript"></script>--%>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.Release.12.1.0/scripts/gc.spread.sheets.all.12.1.0.min.js"
		type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/spread/FileSaver.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.Release.12.1.0/scripts/interop/gc.spread.excelio.12.1.0.min.js"
		type="text/javascript" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.Release.12.1.0/scripts/plugins/gc.spread.sheets.charts.12.1.0.min.js"
		type="text/javascript" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.Release.12.1.0/scripts/resources/ja/gc.spread.sheets.resources.ja.12.1.0.min.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.Release.12.1.0/scripts/resources/zh/gc.spread.sheets.resources.zh.12.1.0.min.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/spread/license.js" type="text/javascript"></script>

<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/lib/zTreeStyle/js/jquery.ztree.all-3.5.min.js"></script>

<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/common/app.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/common/resources.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/common/resources.cn.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/bdotools/custom.cn.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/chartWrapper.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/gcui/gcui.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/colorpicker/colorpicker.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/fontpicker/fontpicker.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/comboframe/comboframe.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/borderpicker/borderpicker.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/widgets/sliderpanel/sliderpanel.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/chart-templates.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/common/colorHelper.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/common/util.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/common/asyncLoader.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/common/metadata.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/spreadWrapper/spreadMeta.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/spreadWrapper/spreadWrapper.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/spreadWrapper/spreadActions.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/spreadWrapper/actions.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/spreadWrapper/ceUtility.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/spreadWrapper/spreadUtility.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/dialogs/baseDialog.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/dialogs/dialogs.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/dialogs/dialogs2.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/dialogs/chartDialogs.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/formatDialog/formatDialog.js"></script>
<!-- 自定义-->
<%--
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/bdotools/dialogs.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/bdotools/dialogs1.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/bdotools/mergedialogs.js"></script>
 --%>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/ribbon/ribbon.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/formulaBar/formulaBar.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/statusBar/statusBar.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chartPreviewer/chartPreviewer.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/addChartElement/chartAddChartElement.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/chartColorPicker/chart-colorPicker.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/chartLayoutPicker/chartLayoutPicker.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/chartTypePicker/chartTypePicker.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/chartSliderPanel.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/chart/chartWrapper.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/contextMenu/contextMenu.js"></script>
<script src="${pageContext.request.contextPath}/assets/js/plugins/Spread.Sheets.v11.2.Designer.Source/src/fileMenu/fileMenu.js"></script>


