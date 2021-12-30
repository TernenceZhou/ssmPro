window.trialbalanceMenuId = 40000037;
window.unauditedMenuId = 40000040;
window.identifiedMenuId = 40000057;
window.adjustsumberyMenuId = 40000027;
window.auditedMenuId = 40000059;
window.fuzhuMenuId = 40000068;
window.cashflowMenuId = 40000092;
window.reportMenuId = 40000029;
window.samplingMenuId = 40000084;
window.confirmStatusData = ComboLocalDicOption(false, '审计程序认定');
window.booleanDicData = ComboLabelValueDicData(false, 'boolean');
window.industryData = getIndustryData();

$(document).ready(function() {
	function dgMainPage() {
		pageRightTitle(pageTitleArr); // 内容区title
		uiBlocksApi(false, 'init'); // oneUI 初始化
		let $body = $('body');
		let $mainConainer = $('#main-container');
		let $spreadContentDir = $('#spreadContentDir');
		let $treeCollapsed = $('.js-tree-collapsed');
		let $subPageRight = $('#subPageRight');
		let $toggleDir = $('#toggleDir  .toggle-dir-icon');
		let $spreadContent = $('.spread-content');
		let $fullscreenBtn = $('#fullscreenBtn');
		let $postilBtn = $('#postil_btn');
		let $openFormulaModalBtn = $('#openFormulaModalBtn');
		let $formulaCheckModal = $('#formulaCheckModal');
		let $reportApprovalBtn = $('#report_approval_btn');
		let $reportIndependenceBtn =$('#report_independence_btn');
		let $dgTreeSlimscroll = $('#spreadContentDir [data-toggle="slimscroll"]');
		let $mergeReportBtn = $('#merge_report_btn');
		let isClose = true;
		
		//let $samplingBtn = $('#sampling_btn');
		$spreadContent.css('overflow-y', 'hidden');
		let currentNode, height = $mainConainer.height() - $('#pageHead').height() - 60; // 编辑区高度

		/**
		 * 获取审计科目目录接口
		 */
		$spreadContentDir.bind('rebuildTree', (event, param, callback) => {
			getSubjecttree(param, callback);
		});
		/**
		 * 设置内容区高度
		 */
		$spreadContentDir.height((height + 57) + 'px');
		$subPageRight.height((height + 17) + 'px');

		let treeContextHeight = $spreadContentDir.height();
		$spreadContentDir.find('.dircontext').height(treeContextHeight - 40);

		function NodeSelectedActions() {
			let $this = this;
			this.proxis = function(event, node) {
				$this['SUBTREE_' + node.type] && $this['SUBTREE_' + node.type](node);
			};
			return $this;
		}
		let nodeSelectedActions = new NodeSelectedActions();
		$treeCollapsed.bind('rebuild', (event, options) => {
			$treeCollapsed.treeview({
				data: options.data,
				color: '#555',
				expandIcon: 'fa fa-plus',
				collapseIcon: 'fa fa-minus',
				onhoverColor: '#f9f9f9',
				selectedColor: '#000',
				selectedBackColor: '#f1f1f1',
				showTags: true,
				levels: options.levels
			});
			$treeCollapsed.on('nodeSelected', (event, node) => {
				let dgTreeScrollTop = $dgTreeSlimscroll[0].scrollTop; // 当前科目树的滚动位置
				$('#dgPostilPage').hide();
				window.xxrPageKey = node.text;
				nodeSelectedActions.proxis.bind(this)(event, node);
				currentNode = node;
				delSubjectTreeBtnShow();
				setTimeout(()=>{
					$dgTreeSlimscroll[0].scrollTop = dgTreeScrollTop; // 哪来滚哪去
				});
			});
			$treeCollapsed.on('nodeUnselected nodeCollapsed nodeExpanded', (event, node) => {
				let dgTreeScrollTop = $dgTreeSlimscroll[0].scrollTop; // 当前科目树的滚动位置
				setTimeout(()=>{
					$dgTreeSlimscroll[0].scrollTop = dgTreeScrollTop; // 哪来滚哪去
				});
			});
			options.callback && options.callback($treeCollapsed.treeview(true));
		});

		/********************************************
		 * 科目树选择时间/点击回调
		 *
		 *
		 *********************************************/
		/***
		 *
		 * @param node
		 * @constructor
		 */
		function SUBTREE_RCL(node) {
			RcsPage({
				region: '#subPageRight', data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID
				}
			});
		}

		function SUBTREE_FILE(node) {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00078',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: node.extraOptions.workpaperId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						// 打开底稿
						var nodeData = {
							extraOptions: data.data[0],
							currentNode: {
								extraOptions: data.data[0]
							}
						};
						nodeData.autoId = nodeData.extraOptions.autoId;
						nodeData.workpaperId = nodeData.extraOptions.workpaperId;
						nodeData.menuId = window.sys_menuId;
						$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
						window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
					}
				}
			});
		}

		function SUBTREE_PROJECT(node) {
			$('#headtitle').empty().text(node.text);
			SubjectPage({region: '#subPageRight', data: node});
			if ($.sessionStorage('mergeType') === "1") {
				$('#subPageRight > div > div.block-heade > ul > li> a[href="#guidePageTab"]').parent().remove();
				$('#subPageRight > div > div.block-heade > ul > li> a[href="#samplingCountPageTab"]').parent().remove();
				$('#subPageRight > div > div.block-heade > ul > li> a[href="#adjustPageTab"]').parent().remove();
			}
		}

		function SUBTREE_TBSUBJECT(node) {
			SubjectPage({region: '#subPageRight', data: node});
		}

		function SUBTREE_SUBJECT(node) {
			SubjectPage({region: '#subPageRight', data: node});
		}

		function SUBTREE_SCOPEDEF(node) {
			$('#headtitle').empty().text(node.text);
			AttachListPage({region: '#subPageRight', data: node});
		}

		function SUBTREE_AUDITEVIDENCE(node) {
			$('#headtitle').empty().text(node.text);
			AttachListPage({region: '#subPageRight', data: node});
		}

		function SUBTREE_OPINIONS(node) {
			$('#headtitle').empty().text(node.text);
			AttachListPage({region: '#subPageRight', data: node});
		}

		function SUBTREE_IRA(node) {
			$('#headtitle').empty().text(node.text);
			AttachListPage({region: '#subPageRight', data: node});
		}

		function SUBTREE_DESIGNAUDIT(node) {
			AttachListPage({region: '#subPageRight', data: node});
		}

		function SUBTREE_IMPL(node) {
			let htmlstr;
			MaterialitySetting({
				region: '#subPageRight', data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					htmlstr: node.text,
					autoId: node.extraOptions.autoId,
					nodeId: node.nodeId
				}
			});
			/*MaterialityPage({region: '#subPageRight', data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID
				}});*/
		}

		function SUBTREE_TRIALBALANCE(node) {
			BdoFaithUtil.injectScripts(document, '#' + $subPageRight[0].id, BdoFaithUtil.tplLoader('general.do?menuid=' + trialbalanceMenuId));

		}

		function SUBTREE_UNAUDITED(node) {
			BdoFaithUtil.injectScripts(document, '#' + $subPageRight[0].id, BdoFaithUtil.tplLoader('general.do?menuid=' + unauditedMenuId));
			/*let unauditedTpl = tplLoader('general.do?menuid=' + unauditedMenuId);
			$subPageRight.empty().html(unauditedTpl);*/
			if (CUR_USERID != JSON.parse($.sessionStorage('projectManager')) && JSON.parse($.sessionStorage('projectManager')) != undefined) {
				$('#rpt_adjustReport').hide();
			}
		}

		function SUBTREE_MERGERUNAUDITED(node) {
			MergeUnAuditReport({region: '#subPageRight', data: node});
		}

		function SUBTREE_MERGERTRIALBALANCE(node) {
			MergeTB({region: '#subPageRight', data: node});
		}

		function SUBTREE_MERGEREPORT(node) {
			MergeReport({region: '#subPageRight', data: node});
		}

		function SUBTREE_MONOMERTRIALBALANCE(node) {
			MonomerTB({region: '#subPageRight', data: node});
		}

		function SUBTREE_MONOMERUNAUDITED(node) {
			MonomerUnAuditReport({region: '#subPageRight', data: node});
		}

		function SUBTREE_MONOMERAUDITED(node) {
			MonomerReport({region: '#subPageRight', data: node});
		}

		function SUBTREE_IDENTIFIED(node) {
			SubjectPagePlan({region: '#subPageRight', data: node});
			$('#headtitle').empty().text(node.text);
		}

		function SUBTREE_ADJUSTSUMBERY(node) {
			BdoFaithUtil.injectScripts(document, '#' + $subPageRight[0].id, BdoFaithUtil.tplLoader('general.do?menuid=' + adjustsumberyMenuId));
		}

		function SUBTREE_AUDITED(node) {
			BdoFaithUtil.injectScripts(document, '#' + $subPageRight[0].id, BdoFaithUtil.tplLoader('general.do?menuid=' + auditedMenuId));
			/*let auditedTpl = tplLoader('general.do?menuid=' + auditedMenuId);
			$subPageRight.empty().html(auditedTpl);*/
			$('#headtitle').empty().text(node.text);
		}

		function SUBTREE_FUZHU(node) {
			BdoFaithUtil.injectScripts(document, '#' + $subPageRight[0].id, BdoFaithUtil.tplLoader('general.do?menuid=' + fuzhuMenuId));
			/*let fuzhuTpl = tplLoader('general.do?menuid=' + fuzhuMenuId);
			$subPageRight.empty().html(fuzhuTpl);*/
			$('#headtitle').empty().text(node.text);
		}
		function SUBTREE_CASHFLOW(node) {
			BdoFaithUtil.injectScripts(document, '#' + $subPageRight[0].id, BdoFaithUtil.tplLoader('general.do?menuid=' + cashflowMenuId));
			$('#headtitle').empty().text(node.text);
		}
		function SUBTREE_HBIDENTIFIED(node) {
			HbSubjectPagePlan({region: '#subPageRight', data: node});
			$('#headtitle').empty().text(node.text);

		}

		function SUBTREE_MISSSUMMARY(node) {
			var isManager = true;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00197',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (sys_userId != data.data[0].manager) {
							isManager = false;
						}
					}
				}
			});
			if (!isManager) {
				bdoInfoBox('提示', '只有项目负责人才能生成错报汇总表！');
				return;
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgWapper.createCbSummary.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: node.extraOptions.indexId,
					param4: node.extraOptions.autoId
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							// async : false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00078',
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: data.data[0].workpaperId,
								start: -1,
								limit: -1
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									// 打开底稿
									var nodeData = {
										extraOptions: data.data[0],
										currentNode: {
											extraOptions: data.data[0]
										}
									};
									nodeData.autoId = nodeData.extraOptions.autoId;
									nodeData.workpaperId = nodeData.extraOptions.workpaperId;
									nodeData.menuId = window.sys_menuId;
									$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
									window.open('/Faith/dgcenter.do?m=openCBSummary&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
									$subPageRight.empty();
								}
							}
						});
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}

		function SUBTREE_NOTEREPORTCHECK(node) {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgWapper.createNoteReportCheck.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: node.extraOptions.indexId,
					param4: node.extraOptions.autoId
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							// async : false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00078',
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: data.data[0].workpaperId,
								start: -1,
								limit: -1
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									// 打开底稿
									var nodeData = {
										extraOptions: data.data[0],
										currentNode: {
											extraOptions: data.data[0]
										}
									};
									nodeData.autoId = nodeData.extraOptions.autoId;
									nodeData.workpaperId = nodeData.extraOptions.workpaperId;
									nodeData.menuId = window.sys_menuId;
									$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
									window.open('/Faith/dgcenter.do?m=openNoteReportCheck&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
								}
							}
						});
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}

		function SUBTREE_REPORT(node) {
			BdoFaithUtil.injectScripts(document, '#' + $subPageRight[0].id, BdoFaithUtil.tplLoader('general.do?menuid=' + reportMenuId));
			/*let reportTpl = tplLoader('general.do?menuid=' + reportMenuId);
			$subPageRight.empty().html(reportTpl);*/
			$('#headtitle').empty().text(node.text);
		}

		function SUBTREE_BBREPORT(node) {
			BbReport({region: '#subPageRight', data: node});
			$('#headtitle').empty().text(node.text);
		}

		function opDgFilePage(node) {
			$.sessionStorage('subjecttreeNode', JSON.stringify(node));
			window.open('/Faith/dgcenter.do?m=openGuidepaper&index=' + node.extraOptions.indexId + '&projectId=' + node.extraOptions.projectId);
		}

		function SUBTREE_TBSUBJECTFILE(node) {
			opDgFilePage(node);
		}

		function SUBTREE_TUNAUDITEDFILE(node) {
			opDgFilePage(node);
		}

		function SUBTREE_IDENTIFIEDFILE(node) {
			opDgFilePage(node);
		}

		function SUBTREE_FARFILE(node) {
			opDgFilePage(node);
		}

		function SUBTREE_PARFILE(node) {
			opDgFilePage(node);
		}

		function SUBTREE_AUDITEDFILE(node) {
			opDgFilePage(node);
		}

		function SUBTREE_TBGUIGE(node) {
			opDgFilePage(node);
		}

		function SUBTREE_FAR(node) {
			AnalysisReview({
				region: '#subPageRight', data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					projectYear: window.CUR_PROJECT_ACC_YEAR,
					autoId: node.extraOptions.parentId,
					type: 'IRA'
				}, type: node.extraOptions.indexId
			});
			$('#headtitle').empty().text(node.text);
		}

		function SUBTREE_PAR(node) {
			FinalAnalyticalReview({
				region: '#subPageRight', data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					projectYear: window.CUR_PROJECT_ACC_YEAR,
					autoId: node.extraOptions.parentId,
					type: 'OPINIONS'
				}, type: node.extraOptions.indexId
			});
			$('#headtitle').empty().text(node.text);
		}

		function SUBTREE_MERGETRIALBALANCE(node) {
			MergeTrialBalance({region: '#subPageRight', data: node});
			$('#headtitle').empty().text(node.text);
		}

		function SUBTREE_MERGEAUDITED(node) {
			MergeAudited({region: '#subPageRight', data: node});
			$('#headtitle').empty().text(node.text);
		}

		function SUBTREE_MERGENOTEINFO(node) {
			MergeNoteInfo({region: '#subPageRight', data: node, isParentCompany: false});
			$('#headtitle').empty().text(node.text);
		}

		function SUBTREE_MERGERNOTEINFO(node) {
			MergeNoteInfo({region: '#subPageRight', data: node, isParentCompany: false});
			$('#headtitle').empty().text(node.text);
		}

		function SUBTREE_SAMPLING(node) {
//BdoFaithUtil.injectScripts(document, '#' + $subPageRight[0].id, BdoFaithUtil.tplLoader('general.do?menuid=' + samplingMenuId));
			SamplingList({region: '#subPageRight', data: node});
			$('#headtitle').empty().text('抽凭');
		}
		function SUBTREE_CONTACTS(node) {
			if (window.sys_menuId != null && window.sys_menuId != '' && typeof (window.sys_menuId) != 'undefined') {
				localStorage.setItem("menuId", window.sys_menuId);
			}
			window.open("./contacts/index.html");
		}
		function SUBTREE_BANK(node) {
			console.log(window.sys_menuId);
			if (window.sys_menuId != null && window.sys_menuId != '' && typeof (window.sys_menuId) != 'undefined') {
				localStorage.setItem("menuId", window.sys_menuId);
			}
			window.open("./bank/index.html");
		}
		function SUBTREE_STOCK(node) {
			StockSummary({region: '#subPageRight', data: node});
			$('#headtitle').empty().text('存货汇总');
		}
		/**
		 *
		 */
		$.extend(NodeSelectedActions.prototype, {
			SUBTREE_RCL,
			SUBTREE_FILE,
			SUBTREE_PROJECT,
			SUBTREE_TBSUBJECT,
			SUBTREE_SUBJECT,
			SUBTREE_SCOPEDEF,
			SUBTREE_AUDITEVIDENCE,
			SUBTREE_OPINIONS,
			SUBTREE_IRA,
			SUBTREE_DESIGNAUDIT,
			SUBTREE_IMPL,
			SUBTREE_TRIALBALANCE,
			SUBTREE_UNAUDITED,
			SUBTREE_MERGERUNAUDITED,
			SUBTREE_MERGERTRIALBALANCE,
			SUBTREE_MERGEREPORT,
			SUBTREE_MONOMERTRIALBALANCE,
			SUBTREE_MONOMERUNAUDITED,
			SUBTREE_MONOMERAUDITED,
			SUBTREE_IDENTIFIED,
			SUBTREE_ADJUSTSUMBERY,
			SUBTREE_AUDITED,
			SUBTREE_FUZHU,
			SUBTREE_CASHFLOW,
			SUBTREE_MISSSUMMARY,
			SUBTREE_NOTEREPORTCHECK,
			SUBTREE_REPORT,
			opDgFilePage,
			SUBTREE_TBSUBJECTFILE,
			SUBTREE_TUNAUDITEDFILE,
			SUBTREE_IDENTIFIEDFILE,
			SUBTREE_FARFILE,
			SUBTREE_PARFILE,
			SUBTREE_AUDITEDFILE,
			SUBTREE_TBGUIGE,
			SUBTREE_FAR,
			SUBTREE_PAR,
			SUBTREE_MERGETRIALBALANCE,
			SUBTREE_MERGEAUDITED,
			SUBTREE_MERGENOTEINFO,
			SUBTREE_MERGERNOTEINFO,
			SUBTREE_SAMPLING,
			SUBTREE_CONTACTS,
			SUBTREE_BANK,
			SUBTREE_BBREPORT,
			SUBTREE_HBIDENTIFIED,
			SUBTREE_STOCK
		});
		/********* 科目树选择时间/点击回调 END **/

		function delSubjectTreeBtnShow() {
			switch (currentNode.type) {
				case 'TBSUBJECT':
				case 'SUBJECT':
					$('#delSubjectTreeBtn').show();
					break;
				default:
					$('#delSubjectTreeBtn').hide();
					break;
			}
		}
		(function() {
			let reg = new RegExp('(^|&)tbSubjectId=([^&]*)(&|$)', 'i');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) {
				let subjectId = unescape(r[2]);
				let flag = true;
				window.getSubjecttree = function(param, callback) {
					$.ajax({
						url: 'dgCenter/DgMain.getSubjecttree.json',
						type: 'post',
						data: param,
						dataType: 'json',
						bdolxLoader: false,
						success(data) {
							if (data.success) {
								data.data[0].treeData.nodes = [data.data[0].treeData.nodes[3]];
								$.sessionStorage('subjecttree', JSON.stringify(data.data[0].treeData));
							}
							if (flag && subjectId) {
								$treeCollapsed.trigger('rebuild', [{
									data: [data.data[0].treeData],
									levels: 3,
									callback(tree) {
										let nodes = tree.getTreeData()[0].nodes[0].nodes;
										let id = 0;
										let node = nodes.find(m => subjectId == m.extraOptions.tbSubjectCode);

										if (node) {
											tree.selectNode(node, {silent: false});
										}
										if (!id) return;
										tree.selectNode(id, {silent: false});
									}
								}]);
								flag = false;
								return;
							}
							callback && callback(data);
						}
					});
				};
			}
		})();
		// 批注
		(function() {
			let regType = new RegExp('(^|&)type=([^&]*)(&|$)', 'i');
			let rType = window.location.search.substr(1).match(regType);
			if (rType != null) {
				let type = unescape(rType[2]);
				let flag = true;
				window.getSubjecttree = function(param, callback) {
					$.ajax({
						url: 'dgCenter/DgMain.getSubjecttree.json',
						type: 'post',
						data: param,
						dataType: 'json',
						bdolxLoader: false,
						success(data) {
							if (data.success) {
								$.sessionStorage('subjecttree', JSON.stringify(data.data[0].treeData));
							}
							if (flag && type) {

								$treeCollapsed.trigger('rebuild', [{
									data: [data.data[0].treeData],
									levels: 3,
									callback(tree) {
										let nodes = tree.getAllNodes();
										let id = 0;
										let node = nodes.find(m => type == m.extraOptions.indexId);
										if (node) {
											tree.selectNode(node, {silent: false});
										}
										if (!id) return;
										//tree.expandNode(id, { levels: 3, silent: true });
										tree.selectNode(id, {silent: false});
										//_data = agrs.data = tree.getNode(_data.nodeId);
									}
								}]);
								flag = false;
								return;
							}
							callback && callback(data);
						}
					});
				};
			}
		})();
		/**
		 * 获取树结构
		 */
		getSubjecttree({
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: window.CUR_PROJECTID,
			param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
		}, (data) => {
			$treeCollapsed.trigger('rebuild', [{
				data: [data.data[0].treeData],
				levels: 2
			}]);
		});

		/**
		 * 隐藏右侧栏
		 */
		$('#toggleDir').click((event) => {
			// 取消延迟处理，否则页面响应太慢
			$spreadContent.toggleClass('spread-content-hidedir');
			$toggleDir.toggleClass('si-arrow-left');
			$toggleDir.toggleClass('si-arrow-right');

			// $.when((() => {
			// 	let def = new $.Deferred();
			// 	$spreadContent.toggleClass('spread-content-hidedir');
			// 	$toggleDir.toggleClass('si-arrow-left');
			// 	$toggleDir.toggleClass('si-arrow-right');
			// 	//$subPageRight.resize();
			// 	def.resolve();
			// 	return def;
			// })()).done(() => {
			// 	$subPageRight.resize();
			// 	$mainConainer.resize();
			// 	/*setTimeout(()=>{
			// 		$('.dataTable').each((index, tb)=>{
			// 			$(tb).dataTable().fnFixedTheadResize($(tb).dataTable());
			// 		});
			// 	}, 500);*/
			// });
		});

		/**
		 * 全屏按钮事件
		 */
		$fullscreenBtn.click((event) => {
			$.when((() => {
				let def = new $.Deferred();
				let icon = $fullscreenBtn.find('i');
				let fullscreenFlg = icon.hasClass('si-size-actual');

				icon.toggleClass('si-size-fullscreen');
				icon.toggleClass('si-size-actual');
				$spreadContent.toggleClass('spread-content-opt-fullscreen');
				let scheight = $spreadContent.height();
				if (fullscreenFlg) {
					$spreadContentDir.height((height + 57) + 'px');
					$subPageRight.height((height + 17) + 'px');
				} else {
					$spreadContentDir.height('100%');
					$subPageRight.height((scheight - 40) + 'px');
					$spreadContentDir.height(($spreadContentDir.height() - 3) + 'px');
				}
				let treeContextHeight = $spreadContentDir.height();
				$spreadContentDir.find('.dircontext').height(treeContextHeight - 40);
				//$subPageRight.resize();
				return def;
			})()).done(() => {
				$subPageRight.resize();
				$mainConainer.resize();
				/*setTimeout(()=>{
					$('.dataTable').each((index, tb)=>{
						$(tb).dataTable().fnFixedTheadResize($(tb).dataTable());
					});
				}, 500);*/
			});
		});

		/**
		 * 全屏按钮事件
		 */
		let apfsClick = function(event) {
			let $el = $(event.currentTarget);
			let $blockTab = $el.closest('#auditProgramPageTab');
			let $block = $blockTab.closest('.block-content');
			$.when((() => {
				let def = new $.Deferred();
				let icon = $el.find('i');
				let fullscreenFlg = icon.hasClass('si-size-actual');

				icon.toggleClass('si-size-fullscreen');
				icon.toggleClass('si-size-actual');
				$block.toggleClass('audit-program-fullscreen');
				$body.toggleClass('audit-program-fullscreen-flag');
				return def;
			})()).done(() => {
				//$subPageRight.resize();
				//$mainConainer.resize();
			});
		};
		$mainConainer.off('click', '.audit-program-fullscreen-btn');
		$mainConainer.on('click', '.audit-program-fullscreen-btn', apfsClick);

		OneUI.initHelper('slimscroll');
		$treeCollapsed[0].addEventListener('DOMSubtreeModified', function() {
			let list = $(this).find('.list-group-item');
			for (let i = 1; i < list.length; i++) {
				if (list.eq(i).height() !== 17) {
					$('.slimScrollDiv', $spreadContentDir).width(420);
					return;
				} else {
					$('.slimScrollDiv', $spreadContentDir).width('auto');
				}
			}
		}, false);

		/** 模态框设置 */
		/*$('.modal').on('show.bs.modal', function(){
			$(this).draggable({
				handle: '.block-header',
				cursor: 'move'
			});
			$(this).css('overflow', 'hidden');
		});*/

		/** 批注 */
		$postilBtn.on('click', function() {
			var node = [];
			$.extend(node, $treeCollapsed.treeview(true).getSelected()[0]);
			if (node.nodeId == undefined) {
				$.extend(node, $treeCollapsed.treeview(true).getNode(0));
			}
			delete node.nodes;
			DgPostilPage({
				region: '#sideRegin',
				data: node,
				type: node.extraOptions.indexId,
				foreignId: node.extraOptions.autoId,
				isSingle: false,
				customerId: node.extraOptions.customerId,
				projectId: node.extraOptions.projectId
			});
		});

		$openFormulaModalBtn.on('click', function() {
			if ($.sessionStorage('mergeType') === '1') {
				$('#formulaCheckModalMerge').modal('show');
			}else{
				$formulaCheckModal.modal('show');
			}
		});

		let tagsMainTable;
		tagsMainTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00083',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param4: '',
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '170px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '460px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '标签',
					name: 'autoId',
					data: 'autoId',
					width: '60px',
					render: function(data, type, row, meta) {
						let renderStr = '<a href=\"#\">' + 'p' + data + '</a>';
						return renderStr;
					}
				}, {
					targets: 2,
					orderable: true,
					title: '标签名',
					name: 'tagName',
					data: 'tagName',
					width: '100px'
				}, {
					targets: 3,
					orderable: true,
					title: '标签属性',
					className: 'text-center',
					name: 'tagProperty',
					data: 'tagProperty',
					renderer: 'getDicLabelByVal|标签属性',
					width: '60px',
					render(data) {
						return DicVal2Nm(data, '标签属性');
					}
				}, {
					targets: 4,
					orderable: true,
					title: '标签类型',
					className: 'text-center',
					name: 'tagType',
					data: 'tagType',
					renderer: 'getDicLabelByVal|标签类型',
					width: '60px',
					render(data) {
						return DicVal2Nm(data, '标签类型');
					}
				}, {
					targets: 5,
					orderable: true,
					title: '位置',
					name: 'otherPosition',
					data: 'otherPosition',
					width: '100px'
				}, {
					targets: 6,
					orderable: true,
					title: '详细位置',
					name: 'tagPosition',
					data: 'tagPosition',
					width: '100px',
					render: function(data, type, row, meta) {
						let renderStr = data;
						if(row.tagType === 'dg' || row.tagType === 'note'){
							renderStr = '<a href=\"#\">' + data + '</a>'
						}
						return renderStr;
					}
				}, {
					targets: 7,
					orderable: true,
					className: 'text-right',
					title: '标签值',
					name: 'tagValue',
					data: 'tagValue',
					width: '80px',
					render: function(data, type, row, meta) {
						let renderStr = formatMoney(data);
						return renderStr;
					}
				}, {
					targets: 8,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'tagName',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr;
						if(row.tagProperty == 0){
							renderStr = '<button class=\"btn btn-xs btn-default\" type=\"button\" title=\"删除标签\" disabled><i class=\"fa fa-close\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
						} else {
							renderStr = '<button class=\"btn btn-xs btn-default\" type=\"button\" title=\"删除标签\"><i class=\"fa fa-close\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
						}
						return renderStr;
					}
				}, {
					targets: 9,
					name: 'tagDgId',
					data: 'tagDgId',
					visible: false
				}, {
					targets: 10,
					name: 'tagInfo',
					data: 'tagInfo',
					visible: false
				}]
			}
		};
		let formulaMainTable;
		formulaMainTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00114',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: '',
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '240px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				fixedHeight: '400px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					className: 'text-center',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '60px',
					render: function(data, type, row, meta) {
						let renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					title: '公式类型',
					name: 'formulaType',
					data: 'formulaType',
					renderer: 'getDicLabelByVal|校验公式类型',
					width: '100px',
					render(data) {
						return DicVal2Nm(data, '校验公式类型');
					}
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '公式属性',
					name: 'formulaProperty',
					data: 'formulaProperty',
					renderer: 'getDicLabelByVal|校验公式属性',
					width: '60px',
					render(data) {
						return DicVal2Nm(data, '校验公式属性');
					}
				}, {
					targets: 5,
					orderable: true,
					title: '公式',
					name: 'formula',
					data: 'formula',
					width: '100px',
					render: function(data, type, row, meta) {
						var pAutoId = data.split(/[\+\-\=]+/);
						var sign = data.split(/[^\+\-\=]+/).splice(1, data.split(/[^\+\-\=]+/).length - 2);
						var text = row.formulaText.split(/[\+\-\=]+/);
						var renderStr = '<a name="tag" href="#" title="' + text[0] + '">' + pAutoId[0];
						for(let i = 1;i < pAutoId.length;i++){
							renderStr += '</a><label>' + sign[i - 1] + '</label><a name="tag" href="#" title="' + text[i] + '">' + pAutoId[i];
						}
						renderStr += '</a>';
						return renderStr;
					}
				}, {
					targets: 6,
					orderable: true,
					title: '公式信息',
					name: 'formulaText',
					data: 'formulaText',
					width: '100px',
					render: function(data, type, row, meta) {
						renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 7,
					orderable: true,
					title: '公式值',
					name: 'formulaValue',
					data: 'formulaValue',
					width: '100px',
					render: function(data, type, row, meta) {
						renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 8,
					orderable: true,
					className: 'text-center',
					title: '公式校验结果',
					name: 'formulaCalc',
					data: 'formulaCalc',
					width: '80px',
					render: function(data, type, row, meta) {
						let renderStr = '';
						if (data == 1) {
							renderStr = '<span class="label label-success"><i class="fa fa-check"></i> 通过</span>';
							return renderStr;
						} else if (data == 0) {
							renderStr = '<span class="label label-danger"><i class="fa fa-times"></i> 未通过</span>';
						}
						return renderStr;
					}
				}, {
					targets: 9,
					orderable: true,
					title: '校验时间',
					name: 'updateTime',
					data: 'updateTime',
					width: '100px',
					render(data) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 10,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'autoId',
					width: '80px',
					render: function(data, type, row, meta) {
						let renderStr;
						if(row.formulaProperty == 0){
							renderStr = '<button class=\"btn btn-xs btn-success\" name=\"editFormula\" type=\"button\" title=\"修改校验公式\" disabled><i class=\"fa fa-edit\"></i></button>';
							renderStr += '&nbsp;<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\" disabled><i class=\"fa fa-trash-o\"></i></button>';
						} else {
							renderStr = '<button class=\"btn btn-xs btn-success\" name=\"editFormula\" type=\"button\" title=\"修改校验公式\"><i class=\"fa fa-edit\"></i></button>';
							renderStr += '&nbsp;<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\"><i class=\"fa fa-trash-o\"></i></button>';
						}
						return renderStr;
					}
				}
				]
			}
		};
		let formulaCheckTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00084',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '320px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				fixedHeight: '400px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					className: 'text-center',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px'
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '60px',
					render: function(data, type, row, meta) {
						if(data){
							renderStr = '<label>' + data + '</label>';
						}else{
							renderStr = '<label></label>';
						}
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					className: 'text-center',
					title: '公式类型',
					name: 'formulaType',
					data: 'formulaType',
					renderer: 'getDicLabelByVal|校验公式类型',
					width: '100px',
					render(data) {
						return DicVal2Nm(data, '校验公式类型');
					}
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '公式属性',
					name: 'formulaProperty',
					data: 'formulaProperty',
					renderer: 'getDicLabelByVal|校验公式属性',
					width: '60px',
					render(data) {
						return DicVal2Nm(data, '校验公式属性');
					}
				}, {
					targets: 5,
					orderable: true,
					title: '公式',
					name: 'formula',
					data: 'formula',
					width: '100px',
					render: function(data, type, row, meta) {
						var pAutoId = data.split(/[\+\-\=]+/);
						var sign = data.split(/[^\+\-\=]+/).splice(1, data.split(/[^\+\-\=]+/).length - 2);
						var text = row.formulaText.split(/[\+\-\=]+/);
						var renderStr = '<a name="tag" href="#" title="' + text[0] + '">' + pAutoId[0];
						for(let i = 1;i < pAutoId.length;i++){
							renderStr += '</a><label>' + sign[i - 1] + '</label><a name="tag" href="#" title="' + text[i] + '">' + pAutoId[i];
						}
						renderStr += '</a>';
						return renderStr;
					}
				}, {
					targets: 6,
					orderable: true,
					title: '公式信息',
					name: 'formulaText',
					data: 'formulaText',
					width: '100px',
					render: function(data, type, row, meta) {
						renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 7,
					orderable: true,
					title: '公式值',
					name: 'formulaValue',
					data: 'formulaValue',
					width: '100px',
					render: function(data, type, row, meta) {
						renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 8,
					orderable: true,
					className: 'text-center',
					title: '公式校验结果',
					name: 'formulaCalc',
					data: 'formulaCalc',
					width: '80px',
					render: function(data, type, row, meta) {
						if (data == 1) {
							let renderStr = '<span class=\"label label-success\"><i class=\"fa fa-check\"></i> 通过</span>';
							return renderStr;
						} else if (data == 0) {
							let renderStr = '<span class=\"label label-danger\"><i class=\"fa fa-times\"></i> 未通过</span>';
							return renderStr;
						}
					}
				}, {
					targets: 9,
					orderable: true,
					title: '校验时间',
					name: 'updateTime',
					data: 'updateTime',
					width: '100px',
					render(data) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 10,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'autoId',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr;
						if(row.formulaProperty == 0){
							renderStr = '<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\" disabled><i class=\"fa fa-trash-o\"></i></button>';
						} else {
							renderStr = '<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\"><i class=\"fa fa-trash-o\"></i></button>';
						}
						return renderStr;
					}
				}
				]
			}
		};
		let formulaCheckTableMerge = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00374',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '320px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				fixedHeight: '400px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					className: 'text-center',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px',
					render: function(data, type, row, meta) {
						return data == 'MERGEAUDITREPORT' ? '' : data;
					}
				}, {
					targets: 2,
					orderable: true,
					className: 'text-center',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '60px',
					render: function(data, type, row, meta) {
						let renderStr;
						if(data){
							renderStr = '<label>' + data + '</label>';
						}else{
							renderStr = '<label></label>';
						}
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					className: 'text-center',
					title: '公式类型',
					name: 'formulaType',
					data: 'formulaType',
					renderer: 'getDicLabelByVal|校验公式类型',
					width: '100px',
					render(data) {
						return DicVal2Nm(data, '校验公式类型');
					}
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '公式属性',
					name: 'formulaProperty',
					data: 'formulaProperty',
					renderer: 'getDicLabelByVal|校验公式属性',
					width: '60px',
					render(data) {
						return DicVal2Nm(data, '校验公式属性');
					}
				}, {
					targets: 5,
					orderable: true,
					title: '公式',
					name: 'formula',
					data: 'formula',
					width: '100px',
					render: function(data, type, row, meta) {
						var pAutoId = data.split(/[\+\-\=]+/);
						var sign = data.split(/[^\+\-\=]+/).splice(1, data.split(/[^\+\-\=]+/).length - 2);
						var text = row.formulaText.split(/[\+\-\=]+/);
						var renderStr = '<a name="tag" href="#" title="' + text[0] + '">' + pAutoId[0];
						for(let i = 1;i < pAutoId.length;i++){
							renderStr += '</a><label>' + sign[i - 1] + '</label><a name="tag" href="#" title="' + text[i] + '">' + pAutoId[i];
						}
						renderStr += '</a>';
						return renderStr;
					}
				}, {
					targets: 6,
					orderable: true,
					title: '公式信息',
					name: 'formulaText',
					data: 'formulaText',
					width: '100px',
					render: function(data, type, row, meta) {
						var renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 7,
					orderable: true,
					title: '公式值',
					name: 'formulaValue',
					data: 'formulaValue',
					width: '100px',
					render: function(data, type, row, meta) {
						var renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 8,
					orderable: true,
					className: 'text-center',
					title: '公式校验结果',
					name: 'formulaCalc',
					data: 'formulaCalc',
					width: '80px',
					render: function(data, type, row, meta) {
						if (data == 1) {
							let renderStr = '<span class=\"label label-success\"><i class=\"fa fa-check\"></i> 通过</span>';
							return renderStr;
						} else if (data == 0) {
							let renderStr = '<span class=\"label label-danger\"><i class=\"fa fa-times\"></i> 未通过</span>';
							return renderStr;
						}
					}
				}, {
					targets: 9,
					orderable: true,
					title: '校验时间',
					name: 'updateTime',
					data: 'updateTime',
					width: '100px',
					render(data) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 10,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'autoId',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr;
						if(row.formulaProperty == 0){
							renderStr = '<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\" disabled><i class=\"fa fa-trash-o\"></i></button>';
						} else {
							renderStr = '<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\"><i class=\"fa fa-trash-o\"></i></button>';
						}
						return renderStr;
					}
				}
				]
			}
		};
		$formulaCheckModal.on('show.bs.modal', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00228',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNumCheck').html(data.data[0].totalNum);
							$('#rightNumCheck').html(data.data[0].rightNum);
						}
					}
				}
			});
			BdoDataTable('formulaCheckTable', formulaCheckTable);
		});
		$('#formulaCheckTable').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			openTag(tagid);
		});
		$('#formulaCheckTable').on('click', 'button[name="delFormula"]', function() {
			var object = $('#formulaCheckTable').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('提示', '确定是否删除该校验公式？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgCheck.delFormula.json',
					async: false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: object.autoId
					},
					dataType: 'json',
					success(data) {
						$('#formulaCheckTable').DataTable().ajax.reload();
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							async: false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00228',
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: $('#formulaTypeCheck').val(),
								start: -1,
								limit: -1
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									if (data.data[0] != null) {
										$('#totalNumCheck').html(data.data[0].totalNum);
										$('#rightNumCheck').html(data.data[0].rightNum);
									}
								}
							}
						});
						bdoSuccessBox('成功', '成功删除校验公式！');
					}
				});
			});
		});
		$('#formulaTypeCheck').change((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00228',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: $('#formulaTypeCheck').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNumCheck').html(data.data[0].totalNum);
							$('#rightNumCheck').html(data.data[0].rightNum);
						}
					}
				}
			});
			formulaCheckTable.localParam.urlparam.param4 = $('#formulaTypeCheck').val();
			$('#formulaCheckTable').DataTable().ajax.reload();
		});
		$('#formulaCheckBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgCheck.checkFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						swal({
							title: '正在校验中...',
							html: '请稍后查看!',
							type: 'info',
							allowOutsideClick: false,
							allowEscapeKey: false,
							timer: 3000
						}).catch(swal.noop);
					}
				}
			});
		});
		$('#formulaCheckModalMerge').on('show.bs.modal', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00375',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNumCheckMerge').html(data.data[0].totalNum);
							$('#rightNumCheckMerge').html(data.data[0].rightNum);
						}
					}
				}
			});
			BdoDataTable('formulaCheckTableMerge', formulaCheckTableMerge);
		});
		$('#formulaCheckTableMerge').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			openTagMerge(tagid);
		});
		$('#formulaCheckTableMerge').on('click', 'button[name="delFormula"]', function() {
			var object = $('#formulaCheckTableMerge').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('提示', '确定是否删除该校验公式？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/HbMergeFormulaCheck.delFormula.json',
					// async: false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: object.autoId,
						param2: window.CUR_CUSTOMERID,
						param3: window.CUR_PROJECTID,
						param4: window.CUR_PROJECTID,
						param5: $('#formulaTypeCheckMerge').val()
					},
					dataType: 'json',
					success(data) {
						$('#formulaCheckTableMerge').DataTable().ajax.reload();
						if (data.success && data.data && data.data[0] != null) {
							$('#totalNumCheckMerge').html(data.data[0].totalNum);
							$('#rightNumCheckMerge').html(data.data[0].rightNum);
						}
						bdoSuccessBox('成功', '成功删除校验公式！');
					}
				});
			});
		});
		$('#formulaTypeCheckMerge').change((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00375',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECTID,
					param4: $('#formulaTypeCheckMerge').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success && data.data && data.data[0] != null) {
						$('#totalNumCheckMerge').html(data.data[0].totalNum);
						$('#rightNumCheckMerge').html(data.data[0].rightNum);
					}
				}
			});
			formulaCheckTableMerge.localParam.urlparam.param4 = $('#formulaTypeCheckMerge').val();
			$('#formulaCheckTableMerge').DataTable().ajax.reload();
		});
		$('#formulaCheckBtnMerge').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/HbMergeFormulaCheck.checkFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						swal({
							title: '正在校验中...',
							html: '请稍后查看!',
							type: 'info',
							allowOutsideClick: false,
							allowEscapeKey: false,
							timer: 3000
						}).catch(swal.noop);
					}
				}
			});
		});
		let verifyTable = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00368',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '355px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '400px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '公式',
					name: 'formula',
					data: 'formula',
					width: '100px',
					render: function(data, type, row, meta) {
						var pAutoId = data.split(/[\+\-\=]+/);
						var sign = data.split(/[^\+\-\=]+/).splice(1, data.split(/[^\+\-\=]+/).length - 2);
						var text = row.formulaText.split(/[\+\-\=]+/);
						var renderStr = '<a name="tag" href="#" title="' + text[0] + '">' + pAutoId[0];
						for(let i = 1;i < pAutoId.length;i++){
							renderStr += '</a><label>' + sign[i - 1] + '</label><a name="tag" href="#" title="' + text[i] + '">' + pAutoId[i];
						}
						renderStr += '</a>';
						return renderStr;
					}
				}, {
					targets: 2,
					orderable: true,
					title: '公式信息',
					name: 'formulaText',
					data: 'formulaText',
					width: '100px',
					render: function(data, type, row, meta) {
						renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					title: '公式值',
					name: 'formulaValue',
					data: 'formulaValue',
					width: '100px',
					render: function(data, type, row, meta) {
						renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '公式核对结果',
					name: 'formulaCalc',
					data: 'formulaCalc',
					width: '80px',
					render: function(data, type, row, meta) {
						if (data == 1) {
							let renderStr = '<span class=\"label label-success\"><i class=\"fa fa-check\"></i> 通过</span>';
							return renderStr;
						} else if (data == 0) {
							let renderStr = '<span class=\"label label-danger\"><i class=\"fa fa-times\"></i> 未通过</span>';
							return renderStr;
						}
					}
				}, {
					targets: 5,
					orderable: true,
					title: '公式核对备注',
					name: 'checkRemark',
					data: 'checkRemark',
					width: '120px'
				}, {
					targets: 6,
					orderable: true,
					title: '核对时间',
					name: 'updateTime',
					data: 'updateTime',
					width: '100px',
					render(data) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 7,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'operate',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr = '<button class="btn btn-xs btn-success" name="editRemark" type="button" title="填写备注"><i class="fa fa-edit"></i></button>';
						return renderStr;
					}
				}]
			}
		};
		let verifyTableMerge = {
			localParam: {
				url: 'dgCenter/DgGeneral.query.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: 'DG00373',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				pageLength: 30,
				scrollX: true,
				scrollY: '355px',
				select: false,
				ordering: false,
				order: [1, 'asc'],
				serverSide: true,
				fixedThead: true,
				// paging: false,
				fixedHeight: '400px',
				columnDefs: [{
					targets: 1,
					orderable: true,
					title: '公式',
					name: 'formula',
					data: 'formula',
					width: '100px',
					render: function(data, type, row, meta) {
						var pAutoId = data.split(/[\+\-\=]+/);
						var sign = data.split(/[^\+\-\=]+/).splice(1, data.split(/[^\+\-\=]+/).length - 2);
						var text = row.formulaText.split(/[\+\-\=]+/);
						var renderStr = '<a name="tag" href="#" title="' + text[0] + '">' + pAutoId[0];
						for(let i = 1;i < pAutoId.length;i++){
							renderStr += '</a><label>' + sign[i - 1] + '</label><a name="tag" href="#" title="' + text[i] + '">' + pAutoId[i];
						}
						renderStr += '</a>';
						return renderStr;
					}
				}, {
					targets: 2,
					orderable: true,
					title: '公式信息',
					name: 'formulaText',
					data: 'formulaText',
					width: '100px',
					render: function(data, type, row, meta) {
						renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					title: '公式值',
					name: 'formulaValue',
					data: 'formulaValue',
					width: '100px',
					render: function(data, type, row, meta) {
						renderStr = '<label>' + data + '</label>';
						return renderStr;
					}
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '公式核对结果',
					name: 'formulaCalc',
					data: 'formulaCalc',
					width: '80px',
					render: function(data, type, row, meta) {
						if (data == 1) {
							let renderStr = '<span class=\"label label-success\"><i class=\"fa fa-check\"></i> 通过</span>';
							return renderStr;
						} else if (data == 0) {
							let renderStr = '<span class=\"label label-danger\"><i class=\"fa fa-times\"></i> 未通过</span>';
							return renderStr;
						}
					}
				}, {
					targets: 5,
					orderable: true,
					title: '公式核对备注',
					name: 'checkRemark',
					data: 'checkRemark',
					width: '120px'
				}, {
					targets: 6,
					orderable: true,
					title: '核对时间',
					name: 'updateTime',
					data: 'updateTime',
					width: '100px',
					render(data) {
						return new Date(data).format('yyyy-MM-dd HH:mm:ss');
					}
				}, {
					targets: 7,
					orderable: true,
					title: '操作',
					className: 'text-center',
					name: 'operate',
					data: 'operate',
					width: '40px',
					render: function(data, type, row, meta) {
						let renderStr = '<button class="btn btn-xs btn-success" name="editRemark" type="button" title="填写备注"><i class="fa fa-edit"></i></button>';
						return renderStr;
					}
				}]
			}
		};
		// 打开核对公式modal
		$('#openVerifyModalBtn').click(e => {
			if ($.sessionStorage('mergeType') === '1') {
				$('#verifyModalMerge').modal('show');
			}else{
				$('#verifyModal').modal('show');
			}
		});
		$('#verifyModal').on('show.bs.modal', function() {
			BdoDataTable('verifyTable', verifyTable);
		});
		$('#verifyTable').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			openTag(tagid);
		});
		// 弹出编辑备注模态框
		$('#verifyTable').on('click', 'button[name="editRemark"]', function() {
			var object = $('#verifyTable').DataTable().data()[$(this).closest('tr').index()];
			var autoId = object.autoId;
			$('#formulaId').val(autoId);
			var checkRemark = object.checkRemark;
			$('#remark_input').val(checkRemark);
			$('#remarkModal').modal('show');
		});
		// 保存备注
		$('#saveRemarkBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgAuditFile.saveFormulaRemark.json',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: $('#formulaId').val(),
					param4: $('#remark_input').val().trim(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						// $('#verifyTable').DataTable().ajax.reload();
						$('#remarkModal').modal('hide');
						$('#verifyTable').DataTable().draw(false);
						bdoSuccessBox('成功', '保存备注成功！');
					}
				}
			});
		});
		$('#verifyFormulaBtn').click((event) => {
			bdoInProcessingBox('核对中...');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgAuditFile.checkVerifyFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#verifyTable').DataTable().draw(false);
						bdoSuccessBox('成功', '核对完成！');
					}
				}
			});
		});
		$('#verifyModalMerge').on('show.bs.modal', function() {
			BdoDataTable('verifyTableMerge', verifyTableMerge);
		});
		$('#verifyTableMerge').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			openTagMerge(tagid);
		});
		// 弹出编辑备注模态框
		$('#verifyTableMerge').on('click', 'button[name="editRemark"]', function() {
			var object = $('#verifyTableMerge').DataTable().data()[$(this).closest('tr').index()];
			var autoId = object.autoId;
			$('#formulaIdMerge').val(autoId);
			var checkRemark = object.checkRemark;
			$('#remark_input_merge').val(checkRemark);
			$('#remarkModalMerge').modal('show');
		});
		// 保存备注
		$('#saveRemarkBtnMerge').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/HbMergeFormulaCheck.saveFormulaRemark.json',
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECTID,
					param4: $('#formulaIdMerge').val(),
					param5: $('#remark_input_merge').val().trim(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						// $('#verifyTable').DataTable().ajax.reload();
						$('#remarkModalMerge').modal('hide');
						$('#verifyTableMerge').DataTable().draw(false);
						bdoSuccessBox('成功', '保存备注成功！');
					}
				}
			});
		});
		$('#verifyFormulaMergeBtn').click((event) => {
			bdoInProcessingBox('核对中...');
			$.ajax({
				type: 'post',
				url: 'dgCenter/HbMergeFormulaCheck.checkVerifyFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#verifyTableMerge').DataTable().draw(false);
						bdoSuccessBox('成功', '核对完成！');
					}
				}
			});
		});
		// 打开单体标签
		function openTag(tagid){
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00235',
					param1: tagid,
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success && data.data[0]) {
						var tagInfo = JSON.parse(data.data[0].tagInfo)[0];
						if(tagInfo.type == 'dg'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async : false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00078',
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: tagInfo.workpaperId,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										// 打开底稿
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.autoId;
										nodeData.workpaperId = nodeData.extraOptions.workpaperId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
										$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
										window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
									}
								}
							});
						} else if(tagInfo.type == 'note'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00092',
									param1: tagInfo.noteAutoId,
									param2: window.CUR_CUSTOMERID,
									param3: window.CUR_PROJECTID,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.autoId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('noteInfoNode', JSON.stringify(nodeData));
										$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
										window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						} else if(tagInfo.type == 'db'){
							var yyyy = tagInfo.whereParam.substr(tagInfo.whereParam.indexOf('yyyy') + 7, 4);
							var text = '该标签为试算平衡表"' + tagInfo.subjectName + '"的"' + yyyy;
							var field = tagInfo.field;
							if(field == 'unAuditAmount'){
								text += '年未审数';
							}else if(field == 'adjustAmount'){
								text += '年审计调整数';
							}else if(field == 'auditAmount'){
								text += '年审定数"';
							}
							swal(text);
						} else if(tagInfo.type == 'function'){
							var field = tagInfo.field;
							var yyyy = 0;
							if(field.indexOf('current') != -1){
								yyyy = parseInt(tagInfo.yyyy);
							} else {
								yyyy = parseInt(tagInfo.yyyy) - 1;
							}
							var text = '';
							if(field.indexOf('Before') != -1){
								text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '未审数"';
							}else if(field.indexOf('Adjust') != -1){
								text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '调整数"';
							}else if(field.indexOf('After') != -1){
								text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '审定数"';
							}
							swal(text);
						} else if(tagInfo.type == 'report'){
							var text = '该标签为报表"' + tagInfo.colName + tagInfo.colCode + '"的"' + tagInfo.reportValDesc + '"';
							swal(text);
						} else if(tagInfo.type == 'auditReport'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async : false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00224',
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: tagInfo.workpaperId,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										// 打开底稿
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.workpaperId;
										nodeData.workpaperId = nodeData.extraOptions.workpaperId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
										$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
										window.open('/Faith/dgcenter.do?m=openQYXJFile&projectId=' + nodeData.extraOptions.projectId);
									}
								}
							});
						}
					}
				}
			});
		}
		// 打开合并标签
		function openTagMerge(tagid){
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00376',
					param1: tagid,
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
					param4: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success && data.data[0]) {
						var tagInfo = JSON.parse(data.data[0].tagInfo)[0];
						if(tagInfo.type == 'mergeNote'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00377',
									param1: tagInfo.noteAutoId,
									param2: window.CUR_CUSTOMERID,
									param3: window.CUR_PROJECTID,
									param4: window.CUR_PROJECTID,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.autoId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('mergeNoteInfoNode', JSON.stringify(nodeData));
										window.open('/Faith/dgcenter.do?m=openMergeNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}else if(tagInfo.type == 'mergeReport'){
							var text = '';
							var colName = tagInfo.colName;
							var reportValType = tagInfo.reportValType;
							if (('递延所得税资产' == colName || '递延所得税负债' == colName) && reportValType == null) {
								text = data.data[0].tagName;
							}else{
								text = '该标签为合并报表"' + tagInfo.colCode + '-' + tagInfo.colName + '"的"' + tagInfo.reportValDesc + '"';
							}
							swal(text);
						}
					}
				}
			});
		}
		/*$('#formulaMainModal [data-toggle="tabs"] a').click(function(e) {
			e.preventDefault();
			jQuery(this).tab('show');
		});*/

		$('#formulaMainModal [data-toggle="tabs"] a').on('show.bs.tab', function(evt) {
			let href = evt.target.href;
			let index = href.lastIndexOf('#');
			let id = href.substring(index + 1);
			switch (id) {
				case 'tagMainTab':
					$('#tagsMainTable').DataTable().ajax.reload();
					break;
				case 'formulaMainTab':
					var referredAutoId;
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00113',
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: 'TB',
							param4: $('#formulaMainSubjectId').val(),
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if (data.data[0] != null) {
									referredAutoId = data.data[0].infoFormula;
								}
							}
						}
					});
					if (referredAutoId == '') {
						referredAutoId = '0';
					}
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00229',
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: referredAutoId,
							param4: $('#formulaTypeMain').val(),
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if (data.data[0] != null) {
									$('#totalNumMain').html(data.data[0].totalNum);
									$('#rightNumMain').html(data.data[0].rightNum);
								}
							}
						}
					});
					formulaMainTable.localParam.urlparam.param3 = referredAutoId;
					BdoDataTable('formulaMainTable', formulaMainTable);
					break;
				default:
					break;
			}
		});
		$('#formulaMainModal').on('show.bs.modal', function(e) {
			BdoDataTable('tagsMainTable', tagsMainTable);
			$('#tagMainGroup').html('');
			$('#tagsMainTable tbody').on('click', 'td button', function() {
				let cellAlias = this.lastElementChild.value;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgCheck.deleteTag.json',
					// async : false,
					data: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: cellAlias,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							$('#tagsMainTable').DataTable().ajax.reload();
							bdoSuccessBox('成功', '删除标签成功！');
						}
					}
				});
			});
			$('#tagsMainTable tbody').on('click', 'td a', function() {
				let colIndex = $(this).parents('td').index();
				if (colIndex === 6) {
					let rowIndex = $(this).parents('tr').index();
					let rowData = $('#tagsMainTable').DataTable().row(rowIndex).data();
					if (rowData.tagDgId != null) {
						let tagInfo = JSON.parse(rowData.tagInfo)[0];
						if(tagInfo.type == 'dg'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async : false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00078',
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: tagInfo.workpaperId,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										// 打开底稿
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.autoId;
										nodeData.workpaperId = nodeData.extraOptions.workpaperId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
										$.sessionStorage('cellLinkFormula', '');
										$.sessionStorage('cellLinkFormulaBySheetName', '');
										$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
										window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
									}
								}
							});
						} else if(tagInfo.type == 'note'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00092',
									param1: tagInfo.noteAutoId,
									param2: window.CUR_CUSTOMERID,
									param3: window.CUR_PROJECTID,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.autoId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('noteInfoNode', JSON.stringify(nodeData));
										$.sessionStorage('cellLinkFormula', '');
										$.sessionStorage('cellLinkFormulaBySheetName', '');
										$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
										window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}
					}
				} else if (colIndex === 1) {
					let length = $('#tagMainGroup .col-sm-1 input').length;
					let txt;
					if (length > 0) {
						txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"\"></option><option value=\"=\">=</option><option value=\"+">+</option><option value=\"-\">-</option></select></div></div><div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
					} else {
						txt = $('<div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
					}
					$('#tagMainGroup').append(txt);
					$('#tagMainGroup .col-sm-1 input')[length].value = $(this).text();
					$('#tagMainGroup .col-sm-1 input')[length].title = $(this).parent().next().text();
				}
			});
		});
		$('#formulaCheckModal').on('click', 'a[class="tableRefresh"]', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00228',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNumCheck').html(data.data[0].totalNum);
							$('#rightNumCheck').html(data.data[0].rightNum);
						}
					}
				}
			});
		});
		$('#formulaMainTab').on('click', 'a[class="tableRefresh"]', function() {
			var referredAutoId;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'TB',
					param4: $('#formulaMainSubjectId').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							referredAutoId = data.data[0].infoFormula;
						}
					}
				}
			});
			if (referredAutoId == '') {
				referredAutoId = '0';
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00229',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: referredAutoId,
					param4: $('#formulaTypeMain').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNumMain').html(data.data[0].totalNum);
							$('#rightNumMain').html(data.data[0].rightNum);
						}
					}
				}
			});
		});
		$('#uodoTagMainBtn').click((event) => {
			let length1 = $('#tagMainGroup .col-sm-1 input').length;
			if (length1 > 0) {
				$('#tagMainGroup .col-sm-1')[length1 * 2 - 2].remove();
			}
			let length2 = $('#tagMainGroup .col-sm-1 select').length;
			if (length2 > 0) {
				$('#tagMainGroup .col-sm-1')[length2 * 2 - 1].remove();
			}
		});
		$('#formulaMainTable').on('click', 'a[name="tag"]', function() {
			var tagid = $(this).text().substring(1);
			openTag(tagid);
		});
		$('#formulaMainTable').on('click', 'button[name="editFormula"]', function() {
			var object = $('#formulaMainTable').DataTable().data()[$(this).closest('tr').index()];
			$('#tagMainGroup').html('');
			var title = object.formulaText.split(/[\+\-\=]+/);
			var text = object.formula.split(/[\+\-\=]+/);
			var sign = object.formula.split(/[^\+\-\=]+/);
			var txt;
			for (var i = 0; i < text.length; i++) {
				txt = $('<div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" value=\"' + text[i] + '\" title=\"' + title[i] + '\" readonly=\"readonly\"></div></div>');
				$('#tagMainGroup').append(txt);
				if (i + 1 < sign.length - 1) {
					txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"\"></option><option value=\"=\">=</option><option value=\"+">+</option><option value=\"-\">-</option></select></div></div>');
					$('#tagMainGroup').append(txt);
					$('#tagMainGroup .col-sm-1 select')[i].value = sign[i + 1];
				}
			}
			$('#formulaType').val(object.formulaType);
			$('#formulaMainModal [data-toggle="tabs"] a:first').tab('show');
		});
		$('#formulaMainTable').on('click', 'button[name="delFormula"]', function() {
			var object = $('#formulaMainTable').DataTable().data()[$(this).closest('tr').index()];
			bdoConfirmBox('提示', '确定是否删除该校验公式？', function() {
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgCheck.delFormula.json',
					async: false,
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: object.autoId
					},
					dataType: 'json',
					success(data) {
						var referredAutoId;
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							async: false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00113',
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: 'TB',
								param4: $('#formulaMainSubjectId').val(),
								start: -1,
								limit: -1
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									if (data.data[0] != null) {
										referredAutoId = data.data[0].infoFormula;
									}
								}
							}
						});
						if (referredAutoId == '') {
							referredAutoId = '0';
						}
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							async: false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00229',
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: referredAutoId,
								param4: $('#formulaTypeMain').val(),
								start: -1,
								limit: -1
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									if (data.data[0] != null) {
										$('#totalNumMain').html(data.data[0].totalNum);
										$('#rightNumMain').html(data.data[0].rightNum);
									}
								}
							}
						});
						formulaMainTable.localParam.urlparam.param3 = referredAutoId;
						$('#formulaMainTable').DataTable().ajax.reload();
						bdoSuccessBox('成功', '成功删除校验公式！');
					}
				});
			});
		});
		$('#tagTypeMain').change((event) => {
			tagsMainTable.localParam.urlparam.param4 = $('#tagTypeMain').val();
			$('#tagsMainTable').DataTable().ajax.reload();
		});
		$('#formulaTypeMain').change((event) => {
			var referredAutoId;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00113',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'TB',
					param4: $('#formulaMainSubjectId').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							referredAutoId = data.data[0].infoFormula;
						}
					}
				}
			});
			if (referredAutoId == '') {
				referredAutoId = '0';
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00229',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: referredAutoId,
					param4: $('#formulaTypeMain').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							$('#totalNumMain').html(data.data[0].totalNum);
							$('#rightNumMain').html(data.data[0].rightNum);
						}
					}
				}
			});
			formulaMainTable.localParam.urlparam.param4 = $('#formulaTypeMain').val();
			$('#formulaMainTable').DataTable().ajax.reload();
		});
		$('#checkFormulaMainBtn').click((event) => {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgCheck.checkFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: 'TB',
					param4: $('#formulaMainSubjectId').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						swal({
							title: '正在校验中...',
							html: '请稍后查看!',
							type: 'info',
							allowOutsideClick: false,
							allowEscapeKey: false,
							timer: 3000
						}).catch(swal.noop);
					}
				}
			});
		});

		function getTagValue(inputText) {
			let tagValue = 0;
			let tagId = inputText.replace('p', '');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00235',
					param1: tagId,
					param2: window.CUR_CUSTOMERID,
					param3: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						tagValue = data.data[0].tagValue;
					}
				}
			});
			return parseFloat(tagValue).toFixed(2);
		}

		$('#ensureProjectTagMainBtn').click((event) => {
			let $tagMainGroupSelect = $('#tagMainGroup .col-sm-1 select');
			let $tagMainGroupInput = $('#tagMainGroup .col-sm-1 input');
			let length = $tagMainGroupSelect.length;
			if (length === 0) {
				bdoErrorBox('失败', '请正确设置公式！');
				$('#formulaMainModal [data-toggle="tabs"] a:last').tab('show');
				return;
			}
			let formula = $tagMainGroupInput.val();
			let formulaText = $tagMainGroupInput.attr('title');

			let inputFirstValue = $('#tagMainGroup .col-sm-1 input')[0].value;
			let formulaValue = getTagValue(inputFirstValue);
			for (let i = 0; i < length; i++) {
				let inputValue = $('#tagMainGroup .col-sm-1 input')[i + 1].value;
				let selectValue = $tagMainGroupSelect[i].value;
				if (selectValue == '') {
					$tagMainGroupSelect[i].focus();
					bdoErrorBox('失败', '请选择运算符号！');
					return;
				}
				formula = formula + selectValue + inputValue;
				formulaText = formulaText + selectValue + $('#tagMainGroup .col-sm-1 input')[i + 1].title;

				let value = getTagValue(inputValue);
				formulaValue = formulaValue + selectValue + value;
			}
			if (formula.indexOf('=') === -1 || formula.indexOf('=') !== formula.lastIndexOf('=')) {
				bdoErrorBox('失败', '请正确设置公式！');
				return;
			}
			// 等式左边值
			let formulaValueLeft = formulaValue.substring(0, formulaValue.indexOf('='));
			// 取得具体数值数组
			let formulaValueListLeft = formulaValueLeft.split(/[\+\-]+/);
			// 取得运算符号数组
			let signListLeft = formulaValueLeft.split(/[^\+\-]+/);
			let formulaCalcLeft = formulaValueListLeft[0] == '' ? 0 : formulaValueListLeft[0];
			let formulaValueLeftNew = formulaCalcLeft.toString();
			if (signListLeft.length > 1) {
				let startNumLeft = 1;
				if (signListLeft[0] == '-') {
					startNumLeft = 0;
				}
				for (let i = startNumLeft; i < signListLeft.length - 1; i++) {
					let signLeft = signListLeft[i];
					let signValueLeft = formulaValueListLeft[i + 1 - startNumLeft];
					if (signLeft === '+') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) + parseFloat(signValueLeft);
					} else if (signLeft === '-') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) - parseFloat(signValueLeft);
					} else if (signLeft === '+-') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) - parseFloat(signValueLeft);
					} else if (signLeft === '--') {
						formulaCalcLeft = parseFloat(formulaCalcLeft) + parseFloat(signValueLeft);
					}
				}
			}
			// 等式右边值
			let formulaValueRight = formulaValue.substring(formulaValue.indexOf('=') + 1);
			// 取得具体数值数组
			let formulaValueListRight = formulaValueRight.split(/[\+\-]+/);
			// 取得运算符号数组
			let signListRight = formulaValueRight.split(/[^\+\-]+/);
			let formulaCalcRight = formulaValueListRight[0] == '' ? 0 : formulaValueListRight[0];
			if (signListRight.length > 1) {
				let startNumRight = 1;
				if (signListRight[0] == '-') {
					startNumRight = 0;
				}
				for (let i = startNumRight; i < signListRight.length - 1; i++) {
					let signRight = signListRight[i];
					let signValueRight = formulaValueListRight[i + 1 - startNumRight];
					if (signRight === '+') {
						formulaCalcRight = parseFloat(formulaCalcRight) + parseFloat(signValueRight);
					}
					if (signRight === '-') {
						formulaCalcRight = parseFloat(formulaCalcRight) - parseFloat(signValueRight);
					}
					if (signRight === '+-') {
						formulaCalcRight = parseFloat(formulaCalcRight) - parseFloat(signValueRight);
					}
					if (signRight === '--') {
						formulaCalcRight = parseFloat(formulaCalcRight) + parseFloat(signValueRight);
					}
				}
			}
			// 等式左边等于等式右边 1:计算结果正确
			if (parseFloat(formulaCalcLeft).toFixed(2) == parseFloat(formulaCalcRight).toFixed(2)) {
				var formulaCal = '1';
			} else {
				var formulaCal = '0';
			}
			let formulaAutoId = formula.replace(/p/g,'');
			let tagAllId = formulaAutoId.replace(/=/g,',').replace(/\+/g,',').replace(/-/g,',');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgCheck.setProjectFormula.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: formula.replace(/\+/g, '%2B'),
					param4: formulaText.replace(/\+/g, '%2B'),
					param5: formulaValue.replace(/\+/g, '%2B'),
					param6: formulaCal,
					param7: formulaAutoId.replace(/\+/g, '%2B'),
					param8: $('#formulaMainSubjectId').val(),
					param9: $('#formulaMainSubjectName').val(),
					param10: tagAllId,
					param11: $('#formulaType').val(),
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						bdoSuccessBox('成功', '设置校验数据公式成功！');
						$('#formulaMainModal [data-toggle="tabs"] a:last').tab('show');
						let $tagMainGroup = $('#tagMainGroup .col-sm-1');
						$tagMainGroup.remove();
					} else {
						bdoErrorBox('失败', '设置校验数据公式失败！');
					}
				}
			});
		});
		// 只看我的底稿
		$("#onlyMyselfCheckBox").change(function() {
			// bdoInProcessingBox('节点');
			getSubjecttree({
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID,
				param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
			}, (data) => {
				$treeCollapsed.trigger('rebuild', [{
					data: [data.data[0].treeData],
					levels: 2
				}]);
				// bdoSuccessBox('成功');
			});
		});
		// 展开所有节点
		$('#expandSubjectTreeBtn').click(function(event) {
			getSubjecttree({
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID,
				param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
			}, (data) => {
				$treeCollapsed.trigger('rebuild', [{
					data: [data.data[0].treeData],
					levels: 10
				}]);
			});
		});
		// 收缩所有节点
		$('#compressSubjectTreeBtn').click(function(event) {
			getSubjecttree({
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID,
				param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
			}, (data) => {
				$treeCollapsed.trigger('rebuild', [{
					data: [data.data[0].treeData],
					levels: 2
				}]);
			});
		});
		// 更新节点
		$('#updSubjectTreeBtn').click(function(event) {
			var nodeId;
			if (!currentNode) {
				nodeId = 0;
			} else {
				nodeId = currentNode.extraOptions.autoId;
			}
			getSubjecttree({
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID,
				param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
			}, data => {
				$('.js-tree-collapsed').trigger('rebuild', [{
					data: [data.data[0].treeData],
					levels: 2,
					callback(tree) {
						$.each(tree.findNodes(), (index, tnode) => {
							if (tnode.extraOptions.autoId == nodeId) {
								tree.expandNode(tnode.nodeId, {levels: (tnode.deep + 2), silent: true});
								tree.selectNode(tnode.nodeId, {silent: true});
							}
						});
						bdoSuccessBox('成功', '更新完成。');
					}
				}]);
			});
		});
		// 删除节点
		$('#delSubjectTreeBtn').click(function(event) {
			switch (currentNode.type) {
				case 'TBSUBJECT':
				case 'SUBJECT':
					if(currentNode.nodes && currentNode.nodes.length > 0) {
						bdoErrorBox("错误", '该节点下有子节点，不能删除。');
					}
					bdoConfirmBox('提示', '确定要删除节点【' + currentNode.text + '】吗？', isConfirm => {
						if(!isConfirm) return;
						let parentId = currentNode.extraOptions.parentId;
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgMain.delSubjectTree.json',
							//async : false,
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: currentNode.extraOptions.autoId,
								param2: currentNode.extraOptions.customerId,
								param3: currentNode.extraOptions.projectId
							},
							dataType: 'json',
							success(dataResult) {
								if(dataResult && dataResult.success) {
									getSubjecttree({
										customerId: window.CUR_CUSTOMERID,
										projectId: window.CUR_PROJECTID,
										param1: window.CUR_PROJECTID,
										param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
									}, data => {
										$('.js-tree-collapsed').trigger('rebuild', [{
											data: [data.data[0].treeData],
											levels: 2,
											callback(tree) {
												$.each(tree.findNodes(), (index, tnode) => {
													if (tnode.extraOptions.autoId == parentId) {
														tree.expandNode(tnode.nodeId, {levels: (tnode.deep + 2), silent: true});
														tree.selectNode(tnode.nodeId, {silent: true});
													}
												});
												bdoInfoBox('成功', '删除节点成功。');
											}
										}]);
									});
									$('#delSubjectTreeBtn').hide();
								}else {
									bdoErrorBox('失败', dataResult.resultInfo.statusText);
								}

							}
						});
					});
					break;
				default:
					break;
			}
		});
		$reportApprovalBtn.click(function() {
			let userId = CUR_USERID;
			// let projectManager = $.sessionStorage('projectManager');
			// if (userId != projectManager){
			// 	bdoErrorBox("错误","您不是此项目负责人，没有权限进行此操作！");
			// 	return;
			// }

			$.ajax({
				url: 'dgCenter/DgProject.initReportApproval.json',
				type: 'POST',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						let result = data.data[0];
						$.localStorage('permissions', result);
						$.localStorage('projectType', data.resultInfo.statusText);
						if (result.initialized) {
							window.open('/Faith/dgcenter.do?m=reportApproval');
						} else {
							bdoConfirmBox('提示', '确定要以【' + data.resultInfo.statusText + '】对【对外报告审批单】进行审批么？', function() {
								window.open('/Faith/dgcenter.do?m=reportApproval');
							});
						}
					} else {
						bdoInfoBox('提示', data.resultInfo.statusText);
					}
				}
			});

		});
		$reportIndependenceBtn.click(function() {
			$.ajax({
				url: 'dgCenter/DgProject.initReportIndependence.json',
				type: 'POST',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_PROJECTID
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						let result = data.data[0];
						if (result.initialized) {
							window.open('/Faith/dgcenter.do?m=reportIndependence');
						}else{
							bdoInfoBox( '正在初始化独立性声明') ;
							window.open('/Faith/dgcenter.do?m=reportIndependence');
						}
					} else {
						bdoInfoBox('提示', data.resultInfo.statusText);
					}
				}
			});

		});
		// 搜索文档按钮
		$('#searchProjectFileBtn').click(function(event) {
			$('#searchProjectFileName').val('');
			$('#searchProjectFileModal').modal('show');
		});
		$("#searchProjectFileName").focus(function(event){
			isClose = false;
		});
		$("#searchProjectFileName").blur(function(event){
			isClose = true;
		});
		$('#searchProjectFileName').autocomplete({
			preserveInput: true,
		    lookup: function (query, done) {
		        // Do Ajax call or lookup locally, when done,
		        // call the callback and pass your results:
		    	$.ajax({
					url: 'dgCenter/DgGeneral.query.json',
					type: 'POST',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00397',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: query,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if(data.data && data.data.length > 0){
								var searchResult = [];
								for(var i = 0;i < data.data.length;i++){
									searchResult.push({ "value": data.data[i].fullPath, "data": data.data[i] })
								}
						        var result = {
						            suggestions: searchResult
						        };
						        done(result);
							}else{
								var result = {
						            suggestions: []
						        };
						        done(result);
							}
						} else {
							var result = {
					            suggestions: []
					        };
					        done(result);
							//bdoInfoBox('提示', data.resultInfo.statusText);
						}
				    	if(isClose){
				    		$("#searchProjectFileName").blur();
				    	}
					}
				});
		    },formatResult: function(item) {
		    	if(item.data.autoId == '0'){
		    		return '<div class="search-project-file"><div>' + item.value + '</div></div>';
		    	}else{
		    		if(item.data.fileType == '3'){
		    			if(item.data.workpaperName != '' && item.data.workpaperName != null){
		    				var index = item.data.workpaperName.lastIndexOf(".");
		    				return item.data.workpaperName.substring(0, index) + '/' + item.data.fileName;
		    			}else{
		    				return item.data.fileName;
		    			}
		    		}else{
				    	return item.data.fileName;
		    		}
		    	}
		    },
		    onSelect: function (suggestion) {
		        //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
		        if(suggestion.data.fileType == '1' && suggestion.data.autoId != '0'){
		        	// 节点DG00062
		        	actionDgFile({
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: suggestion.data.autoId,
						param2: suggestion.data.customerId
					}, (data) => {
						var fileSuffix = suggestion.data.fileName.substring(suggestion.data.fileName.lastIndexOf(".") + 1).toLowerCase();
						if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" ) {
							window.open('dgCenter/DgMain.previewProjDgFile.json?param1=' + suggestion.data.autoId + '&param2=' + suggestion.data.customerId, suggestion.data.fileName, 'location=no');
						} else if(fileSuffix === "xlsx") {
							suggestion.data.pageType = 3;
							var nodeData = {
								extraOptions: suggestion.data,
								currentNode: {
									extraOptions: suggestion.data
								}
							};
							$.sessionStorage('fileNode', JSON.stringify(nodeData));
							window.open('/Faith/dgcenter.do?m=previewFile');
						}else{
							// 下载
							actionDgFile({
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: suggestion.data.autoId,
								param2: suggestion.data.customerId
							}, (data) => {
								downloadFile('dgCenter/DgDownload.downloadProjDgFile.json', {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: suggestion.data.autoId,
									param2: suggestion.data.customerId
								});
							});
						}
					});
		        }else if(suggestion.data.fileType == '2' && suggestion.data.autoId != '0'){
			        // 底稿
			        $.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						// async : false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00078',
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: suggestion.data.autoId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								// 打开底稿
								var nodeData = {
									extraOptions: data.data[0],
									currentNode: {
										extraOptions: data.data[0]
									}
								};
								nodeData.autoId = data.data[0].autoId;
								nodeData.workpaperId = data.data[0].workpaperId;
								nodeData.menuId = window.sys_menuId;
								$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
								window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + data.data[0].indexId + '&projectId=' + data.data[0].projectId);
							}
						}
					});
		        }else if(suggestion.data.fileType == '3' && suggestion.data.autoId != '0'){
		        	// 底稿附件DG00116
					$.ajax({
						url: 'dgCenter/DgMain.queryAttachFileExistence.json',
						type: 'post',
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: suggestion.data.autoId,
							param2: suggestion.data.customerId
						},
						dataType: 'json',
						success: function(data) {
							if (data.success) {
								var fileSuffix = suggestion.data.fileName.substring(suggestion.data.fileName.lastIndexOf(".") + 1).toLowerCase();
								if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" ) {
									window.open('dgCenter/DgPaper.previewFile.json?param1=' + suggestion.data.autoId + '&param2=type1' + '&param3=' + suggestion.data.fileName, suggestion.data.fileName, 'location=no');
								} else if (fileSuffix === "xlsx"){
									suggestion.data.pageType = 1;
									var nodeData = {
										extraOptions: suggestion.data,
										currentNode: {
											extraOptions: suggestion.data
										}
									};
									$.sessionStorage('fileNode', JSON.stringify(nodeData));
									window.open('/Faith/dgcenter.do?m=previewFile');
								} else {
									downloadFile('dgCenter/DgDownload.downloadAttach.json', {
										customerId: window.CUR_CUSTOMERID,
										projectId: window.CUR_PROJECTID,
										param1: suggestion.data.autoId,
										param2: suggestion.data.customerId
									});
								}
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
		        }else if(suggestion.data.fileType == '4' && suggestion.data.autoId != '0'){
		        	// 附注
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00092',
							param1: suggestion.data.autoId,
							param2: suggestion.data.customerId,
							param3: suggestion.data.projectId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								var nodeData = {
									extraOptions: data.data[0],
									currentNode: {
										extraOptions: data.data[0]
									}
								};
								nodeData.autoId = nodeData.extraOptions.autoId;
								nodeData.menuId = window.sys_menuId;
								$.sessionStorage('noteInfoNode', JSON.stringify(nodeData));
								window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
		        }else if(suggestion.data.fileType == '5' && suggestion.data.autoId != '0'){
		        	// 抽凭附件
		        	actionSamplingFile({
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: suggestion.data.autoId,
						param2: suggestion.data.customerId,
						param3: '2'
					}, (data) => {
						var fileSuffix = suggestion.data.fileName.substring(suggestion.data.fileName.lastIndexOf(".") + 1).toLowerCase();
						if (fileSuffix === "pdf" || fileSuffix === "jpg" || fileSuffix === "png" || fileSuffix === "jpeg" ) {
							if (data.data == null) {
								window.open('dgCenter/DgPaper.previewFile.json?param1=' + suggestion.data.autoId + '&param2=type2' + '&param3=' + suggestion.data.fileName ,suggestion.data.fileName , 'location=no');
							} else {
								window.open('/Faith/dgcenter.do?m=previewAuditPolicyFileNoRight', suggestion.data.fileName, 'location=no');
							}
						} else if(fileSuffix === "xlsx") {
							suggestion.data.pageType = 2;
							var nodeData = {
								extraOptions: suggestion.data,
								currentNode: {
									extraOptions: suggestion.data
								}
							};
							$.sessionStorage('fileNode', JSON.stringify(nodeData));
							window.open('/Faith/dgcenter.do?m=previewFile');
						}else{
							// 下载
							actionDgFile({
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: suggestion.data.autoId,
								param2: suggestion.data.customerId,
								param3: '2'
							}, (data) => {
								downloadFile('dgCenter/DgDownload.downloadDgAttachFile.json', {
									param1: suggestion.data.autoId,
									param2: suggestion.data.customerId,
									param3: 'type2'
								});
							});
						}
					});
		        }
		    }
		});
		let actionDgFile = (param, callback) => {
			$.ajax({
				url: 'dgCenter/DgMain.queryProjDgFileExist.json',
				type: 'post',
				async: false,
				data: param,
				dataType: 'json',
				success(data) {
					if (data.success) {
						callback(data);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		};
		let actionSamplingFile = (param, callback) => {
			$.ajax({
				url: 'dgCenter/DgMain.querySamplingDgFileExist.json',
				type: 'post',
				data: param,
				dataType: 'json',
				success(data) {
					if (data.success) {
						callback(data);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		};
		if ($.sessionStorage('mergeType') === '1') {
			$mergeReportBtn.click((event) => {
				if (window.sys_menuId != null && window.sys_menuId != '' && typeof (window.sys_menuId) != 'undefined') {
					localStorage.setItem("menuId", window.sys_menuId);
				}
				window.open("./merge/index.html");
			});
		} else {
			$mergeReportBtn.remove();
		}
	}
	$.ajax({
		url: 'dgCenter/DgCheck.checkProjectSetting.json',
		type: 'post',
		async: false,
		data: {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID
		},
		dataType: 'json',
		success(data) {
			if (!data.success) {
				bdoInfoBox('提示', data.resultInfo.statusText);
				$('#spreadContentDir').hide();
				$('#contentBlock').hide();
			}else {
				dgMainPage();
			}
		}
	});
});
