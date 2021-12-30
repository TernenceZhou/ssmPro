<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	 <!-- Page Header -->
                <div class="content bg-image overflow-hidden" style="background-image: url('img/coop/bdolx.png');">
                    <div class="push-50-t push-15">
                        <h1 class="h2 text-white animated zoomIn">审计业务综合管理平台</h1>
                        <h2 class="h5 text-white-op animated zoomIn">Business Share&Cooperation Platform</h2>
                    </div>
                </div>
                <!-- END Page Header -->
                 <div id="contentData" class="content content-boxed">
                <!-- Header Tiles -->
                <div class="row">
                    <div class="col-sm-6 col-md-3">
                       <div class="block block-rounded block-link-hover3 text-center" href="javascript:void(0)">
                            <div class="block-content block-content-full ">
                                <div id="topCanApplyNum"  class="h1 font-w700 text-success" data-toggle="countTo" data-to=""></div>
                            </div>
                            <div class="block-content block-content-full block-content-mini bg-success text-white font-w600">可申请的业务</div>
                      </div>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <div class="block block-rounded block-link-hover3 text-center" href="javascript:void(0)">
                            <div class="block-content block-content-full ">
                                <div id="topProvidedNum" class="h1 font-w700 text-warning" data-toggle="countTo" data-to=""></div>
                            </div>
                            <div class="block-content block-content-full block-content-mini bg-warning text-white font-w600">已发布的业务</div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <div class="block block-rounded block-link-hover3 text-center" href="javascript:void(0)">
                            <div class="block-content block-content-full ">
                                <div id="topCoopratingNum"  class="h1 font-w700 text-success" data-toggle="countTo" data-to=""></div>
                            </div>
                            <div class="block-content block-content-full block-content-mini bg-success text-white font-w600">合作中的业务</div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <div class="block block-rounded block-link-hover3 text-center" href="javascript:void(0)">
                            <div class="block-content block-content-full ">
                                <div id="topCoopratedNum"  class="h1 font-w700 text-warning" data-toggle="countTo" data-to=""></div>
                            </div>
                            <div class="block-content block-content-full block-content-mini bg-warning text-white font-w600">合作完成的业务</div>
                        </div>
                    </div>
                </div>
                <!-- END Header Tiles -->
                <!-- Overview -->
                    <div class="block block-opt-refresh-icon4">
                        <div class="block-header bg-danger">
                            <ul class="block-options">
                                <li>
                                    <button type="button" data-toggle="block-option" data-action="refresh_toggle" data-action-mode="demo"></button>
                                </li>
                            </ul>
                            <h3 class="block-title text-white">各事业部业务共享合作状况</h3>
                        </div>
                        <div class="block-content block-content-full">
                            <!-- Chart.js Charts (initialized in js/pages/base_pages_ecom_dashboard.js), for more examples you can check out http://www.chartjs.org/docs/ -->
                            <div style="height: 400px;"><canvas class="js-chartjs-overview"></canvas></div>
                        </div>
                    </div>
                    <!-- END Overview -->

                <!-- Top Products and Latest Orders -->
                <div class="row">
                    <div class="col-lg-6">
                        <!-- Top Products -->
                        <div class="block block-opt-refresh-icon4">
                            <div class="block-header bg-modern">
                                <ul class="block-options">
                                    <li>
                                        <button type="button" data-toggle="block-option" data-action="refresh_toggle" data-action-mode="demo"></button>
                                    </li>
                                </ul>
                                <h3 class="block-title text-white">各行业合伙人排名<span class="badge badge-warning">TOP3</span></h3>
                            </div>
                            <div class="block-content">
                                <table class="table table-borderless table-striped table-vcenter ">
                                	<thead>
                                		<tr>
                                			<td width="43%">行业名称</td>
                                			<td width="19%"><img src="img/coop/gold.png"></td>
                                			<td width="19%"><img src="img/coop/silver.png"></td>
                                			<td width="19%"><img src="img/coop/copper.png"></td>
                                		</tr>
                                	</thead>
                                	<tbody id="topRankingTbl"></tbody>
                                </table>
                            </div>
                        </div>
                        <!-- END Top Products -->
                    </div>
                    <div class="col-lg-6">
                        <!-- Latest Orders -->
                        <div class="block block-opt-refresh-icon4">
                            <div class="block-header bg-modern">
                                <ul class="block-options">
                                    <li>
                                        <button type="button" data-toggle="block-option" data-action="refresh_toggle" data-action-mode="demo"></button>
                                    </li>
                                </ul>
                                <h3 class="block-title text-white">最近发布的业务机会</h3>
                            </div>
                            <div class="block-content">
                                <table class="table table-borderless table-striped table-vcenter">     
                                	<thead>
                                		<tr>
                                			<td width="30%">行业名称</td>
                                			<td width="15%">业务类型</td>
                                			<td width="15%">提供人</td>
                                			<td width="25%">部门</td>
                                			<td width="15%">状态</td>
                                		</tr>
                                	</thead>
                                	<tbody id="topChanceTbl"></tbody>                             
                                </table>
                            </div>
                        </div>
                        <!-- END Latest Orders -->
                    </div>
                </div>
                <!-- END Top Products and Latest Orders -->
                </div>
	 <script src="${pageContext.request.contextPath}/cpShare/top.js"></script>