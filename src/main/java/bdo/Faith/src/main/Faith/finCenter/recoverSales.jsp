<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" errorPage="/hasNoRight.jsp" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="spreadjs culture" content="zh-cn"/>
    <title></title>
	<%--<title><%=cn.com.bdo.cpBase.utils.SysNameUtil.getSysName()%></title>--%>
	<%@ include file="/WEB-INF/Views/Sys_INCLUDE/includeForUI.jsp" %>
    <script src="${pageContext.request.contextPath}/bdolx/main/loginData.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/finCenter/recoverSales.js"></script>
	<%--<script>
		window.trinfo = '<%=request.getAttribute("trinfo")%>';
	    window.userCustomers = '<%=userSession.getUserCustomers()%>';
	    window.BDO_CUSTOMER_SELECT = '<%=userSession.getCurCustomerId()%>';
	    window.BDO_CUSTOMERNAME_SELECT = '<%=userSession.getCurCustomerName()%>';
	    window.BDO_YEAR_SELECT = (new Date()).getFullYear() - 1;
	    window.BDO_PROJECT_SELECT = '<%=userSession.getCurProjectId()%>';
	    window.BDO_PROJECTNAME_SELECT = '<%=userSession.getCurProjectName()%>';
    </script>--%>
</head>
<body>
<div class="content">
	<div class="block">
        <ul class="nav nav-tabs" data-toggle="tabs" id="recoverSales">
            <li class="active"><a href="#tab_recoverSalesPage">应收账款回收率和本期销售统计</a></li>
            <li class="pull-right">
                <ul class="block-options push-10-t push-10-r">
                    <li>
                        <button type="button" data-toggle="block-option" data-action="fullscreen_toggle"></button>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="block-content tab-content" id="tab_recoverSales_content">
            <div class="tab-pane active" id="#tab_recoverSalesPage">
                <div class="block">
                    <div class="block block-themed">
                        <div class="block-header bg-primary">
                            <ul class="block-options">
                                <li>
                                    <button id="recoverSales_search" type="button">
                                        <i class="fa fa-search" style="color: white;">&nbsp;查询</i>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" data-toggle="block-option" data-action="content_toggle"></button>
                                </li>
                            </ul>
                            <h3 class="block-title">查询条件设定</h3>
                        </div>
                        <div id="search-condition" class="block-search">
                            <div class='row'>
                                <div class="form-group"></div>
                                <div class="form-group has-info">
                                    <div class="col-sm-4">
                                        <div class="form-material">
                                            <select class="js-select2 form-control" id="recoverSales_customerId" style="width: 100%;">
                                                <option></option>
                                            </select> <label for="account_customerId">客户名称</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group has-info">
                                    <div class="col-sm-2">
                                        <div class="form-material">
                                            <input id="recoverSales_year" class="form-control date-picker" type="text" autocomplete="off"> <label for="account_year">账套年份</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group has-info">
                                    <div class="col-sm-2">
                                        <div class="form-material">
                                            <input class="form-control" type="text" id="recoverSales_subjectid"> <label for="recoverSales_subjectid">科目编号</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group has-info">
                                 <div class="col-sm-3">
                                     <div class="form-material">
                                         <input class="form-control" type="text" id="recoverSales_assitemid">
                                         <label for="recoverSales_assitemid">核算类型</label>
                                     </div>
                                 </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group"></div>
                                <div class="form-group has-info">
                                 <div class="col-sm-3">
                                     <div class="form-material">
                                         <input class="form-control" type="text" id="recoverSales_keyword">
                                         <label for="recoverSales_keyword">摘要关键字（多个以|分割）</label>
                                     </div>
                                 </div>
                                </div>
                                <div class="form-group has-info">
                                    <div class="col-sm-3">
                                        <div class="form-material">
                                            <input class="form-control" type="text" id="recoverSales_oppositeSubjectid"> <label for="recoverSales_oppositeSubjectid">对方科目</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="block block-bordered">
                        <div class="block-header bg-primary">
                            <ul class="block-options">
                                <li>
                                    <button id="recoverSales_export" type="button" style="display: none;">
                                        <i class="si si-cloud-download" style="color: white;" title="导出"></i>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" data-toggle="block-option" data-action="fullscreen_toggle" style="color: white;"></button>
                                </li>
                            </ul>
                            <h3 class="block-title">
                                                                                                 查询结果
                            </h3>
                        </div>
                        <div class="block-content">
                            <table id="recoverSales_table" class="table table-bordered table-striped table-hover">
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modal_subjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="top: 40px; z-index: 1070;">
    <div class="modal-dialog modal-md">
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
                    <h3 class="block-title">选择科目</h3>
                </div>
            </div>
            <div class="modal-body" style="min-height: 500px; max-height: 500px">
                <div id="subject_tree"></div>
            </div>
            <div class="modal-footer">
                <div class="col-sm-3">
                    <input class="form-control" type="text" id="searchInput1" placeholder="搜索科目">
                </div>
                <div class="col-sm-9">
                    <button class="btn btn-md btn-primary" type="button" id="modal_subjectid_reset">
                        <i class="fa fa-repeat"></i><span>&nbsp;重置</span>
                    </button>
                    <button class="btn btn-md btn-primary" type="button" id="modal_subjectid_sure">
                        <i class="fa fa-send"></i><span>&nbsp;确定</span>
                    </button>
                    <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
                        <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modal_assitemid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static"
     data-keyboard="false" style="top:40px;z-index: 1070;">
    <div class="modal-dialog modal-md">
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
                    <h3 class="block-title">选择科目</h3>
                </div>
            </div>
            <div class="modal-body" style="min-height:500px;max-height:500px">
                <div id="assitem_tree"></div>
            </div>
            <div class="modal-footer">
                <div class="col-sm-3">
                    <input class="form-control" type="text" id="searchInputAssitem" placeholder="搜索科目">
                </div>
                <div class="col-sm-9">
                    <button class="btn btn-md btn-primary" type="button" id="modal_assitemid_reset">
                        <i class="fa fa-repeat"></i><span>&nbsp;重置</span>
                    </button>
                    <button class="btn btn-md btn-primary" type="button" id="modal_assitemid_sure">
                        <i class="fa fa-send"></i><span>&nbsp;确定</span>
                    </button>
                    <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
                        <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modal_oppositeSubjectid" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="top: 40px; z-index: 1070;">
    <div class="modal-dialog modal-md">
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
                    <h3 class="block-title">选择科目</h3>
                </div>
            </div>
            <div class="modal-body" style="min-height: 500px; max-height: 500px">
                <div id="subject_tree_opposite"></div>
            </div>
            <div class="modal-footer">
                <div class="col-sm-3">
                    <input class="form-control" type="text" id="searchInput_opposite" placeholder="搜索科目">
                </div>
                <div class="col-sm-9">
                    <button class="btn btn-md btn-primary" type="button" id="modal_subjectid_opposite_reset">
                        <i class="fa fa-repeat"></i><span>&nbsp;重置</span>
                    </button>
                    <button class="btn btn-md btn-primary" type="button" id="modal_subjectid_opposite_sure">
                        <i class="fa fa-send"></i><span>&nbsp;确定</span>
                    </button>
                    <button class="btn btn-md btn-warning" type="button" data-dismiss="modal">
                        <i class="fa fa-sign-out"></i><span>&nbsp;关闭</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
