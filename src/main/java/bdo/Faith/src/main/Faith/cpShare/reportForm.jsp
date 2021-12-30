<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" errorPage="/hasNoRight.jsp"%>
	<div class="content bg-gray-lighter">
		<div class="row items-push">
			<div class="col-sm-7">
				<h1 id="page_head" class="page-heading"></h1>
			</div>
			<div class="col-sm-5 text-right hidden-xs">
				<ol id="page_title" class="breadcrumb push-10-t">
				</ol>
			</div>
		</div>
	</div>
	<div class="content">
		<div class="block block-themed">
			<div class="block-header bg-primary">
				<ul class="block-options">
					<li>
						<button id="btn_search" type="button">
							<i class="fa fa-search" style="color: white;">&nbsp;搜索</i>
						</button>
					</li>
					<li>
						<button type="button" data-toggle="block-option"
							data-action="content_toggle"></button>
					</li>
				</ul>
				<h3 class="block-title">搜索条件设定</h3>
			</div>
			<div class="block-search">
				<div class="row">
					<div class="form-group has-info">
						<div class="col-sm-4">
							<div class="form-material">
								<select class="form-control" id="search_year">
									<option></option>
								</select> <label for="search_year">年度</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-12">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">未关联,已关联业务机会占比</h3>
					</div>
					<div class="block-content" align="center">
						<div id="chance_state" style="height: 400px;"></div>
					</div>
				</div>
			</div>
			<div class="col-sm-12">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">合作中及合作完成业务登记单占比</h3>
					</div>
					<div class="block-content" align="center">
						<div id="regist_state" style="height: 400px;"></div>
					</div>
				</div>
			</div>
			<div class="col-sm-12">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">各合作评分登记单数</h3>
					</div>
					<div class="block-content" align="center">
						<div id="regist_evaluateScore" style="height: 400px;"></div>
					</div>
				</div>
			</div>
			<div class="col-sm-12">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">各行业业务登记单数</h3>
					</div>
					<div class="block-content" align="center">
						<div id="regist_industry" style="height: 400px;"></div>
					</div>
				</div>
			</div>
			<div class="col-sm-12">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">各业务类型业务登记单数</h3>
					</div>
					<div class="block-content" align="center">
						<div id="regist_businessType" style="height: 400px;"></div>
					</div>
				</div>
			</div>
			<div class="col-sm-12">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">各客户性质业务登记单数</h3>
					</div>
					<div class="block-content" align="center">
						<div id="regist_customerProperties" style="height: 400px;"></div>
					</div>
				</div>
			</div>
			<div class="col-sm-12">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">各合作意向业务登记单数</h3>
					</div>
					<div class="block-content" align="center">
						<div id="regist_cooperation" style="height: 400px;"></div>
					</div>
				</div>
			</div>
			<div class="col-sm-12">
				<div class="block block-themed">
					<div class="block-header bg-primary">
						<ul class="block-options">
							<li>
								<button type="button" data-toggle="block-option"
									data-action="content_toggle"></button>
							</li>
						</ul>
						<h3 class="block-title">各分配意向业务登记单数</h3>
					</div>
					<div class="block-content" align="center">
						<div id="regist_incomeAssign" style="height: 400px;"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script src="${pageContext.request.contextPath}/cpShare/reportForm.js"></script>