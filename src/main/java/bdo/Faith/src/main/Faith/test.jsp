<%@ page import="cn.com.bdo.base.utils.poi.CellStyleTemplate" %>
<%@ page import="cn.com.bdo.dgCenter.service.DgContactsCusService" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	//CellStyleTemplate.reSetStyleMap();
	DgContactsCusService service = new DgContactsCusService();
	JSONObject object = service.queryCusByUscc("审计平台测试客户042");
%>
<%=request.getSession().getId()%>
<%=object.toString()%>
