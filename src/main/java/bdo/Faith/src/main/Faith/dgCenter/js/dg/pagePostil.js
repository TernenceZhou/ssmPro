/**
 * 页面批注
 */
var DgPostilPage = (agrs) => {
	let _template
		, dgPostilPage
		, postilType
		, nodeName
		, foreignId
		, vmPostil
		, listener;
	listener = () => {
		if (agrs.isSingle) {
			$('#closePostilSide').on('click', event => {
				$('#postilmodal').modal('hide');
			});
		}

		/*$('#postilTab [data-toggle="tabs"] a').click(function(e) {
			e.preventDefault();
			jQuery(this).tab('show');
		});*/

		$('#postilTab [data-toggle="tabs"] a').on('show.bs.tab', function(evt) {
			var href = evt.target.href;
			var index = href.lastIndexOf('#');
			var id = href.substring(index + 1);
			vmPostil.newPostilBtnShow = false;
			vmPostil.onPostilClose();
			switch (id) {
				case 'postilTab2':
					if (((vmPostil.userAuditState & (0x1 << 1)) >> 1) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 100;
					break;
				case 'postilTab3':
					if (((vmPostil.userAuditState & (0x1 << 2)) >> 2) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 200;
					break;
				case 'postilTab6':
					if (((vmPostil.userAuditState & (0x1 << 3)) >> 3) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 300;
					break;
				case 'postilTab1':
					if (((vmPostil.userAuditState & (0x1 << 4)) >> 4) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 400;
					break;
				case 'postilTab4':
					if (((vmPostil.userAuditState & (0x1 << 5)) >> 5) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 500;
					break;
				case 'postilTab5':
					if (((vmPostil.userAuditState & (0x1 << 6)) >> 6) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 600;
					break;
				case 'postilTab7':
					if (((vmPostil.userAuditState & (0x1 << 7)) >> 7) == 1) {
						vmPostil.newPostilBtnShow = true;
					}
					vmPostil.auditState = 700;
					break;
				default:
					break;
			}
		});
	};

	vmPostil = new Vue({
		el: '#vmpostilPage',
		data: {
			postils1: [],
			postils2: [],
			postils3: [],
			postils4: [],
			postils5: [],
			postils6: [],
			postils7: [],
			postils: [],
			newContent: false,
			postilContent: '',
			cellContent: nodeName,
			type: '',
			auditState: 0,
			threadParam: {},
			customerId: agrs.customerId,
			projectId: agrs.projectId,
			isSingle: false,
			userAuditState: 0,
			newPostilBtnShow: false,
			postilLevel: 2
		},
		watch: {
			newContent(newVal, oldVal) {
				if (newVal == true) {
					$('.postil-content').css({bottom: '190px'});
				} else {
					$('.postil-content').css({bottom: '0px'});
				}
				if (this.type == postilType) {
					$('#postilFormBlock').find('table').find('td:eq(2)').show();
					$('#postilFormBlock').find('table').find('td:eq(3)').show();
				}else{
					$('#postilFormBlock').find('table').find('td:eq(2)').hide();
					$('#postilFormBlock').find('table').find('td:eq(3)').hide();
				}
			},
			auditState(newVal, oldVal) {
				let me = this;
				let postils = this.getPostils();
				let sqlId='DG00077';
				if(postilType.substring(0,2) == 'HB' || postilType.substring(0,9) == 'MERGENOTE'){
					sqlId='DG20011';
				}
				this.fetch({
					menuId: window.sys_menuId,
					sqlId: sqlId,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: (() => {
						if (agrs.isSingle) {
							return agrs.data.autoId;
						}
						return null;
					})(),
					param4: newVal,
					param5: foreignId,
					param6: postilType,
					start: -1,
					limit: -1
				}, data => {
					if (data.success) {
						me.buildData(data.data);
					} else {
					}
				});
			},
			postilContent(newVal, oldVal) {
				if(this.$postilContentEl) {
					let elCode = this.$postilContentEl.summernote('code');
					if(newVal != elCode) {
						this.$postilContentEl.summernote('code', newVal);
					}
				}
			}
		},
		methods: {
			fetchProjectInfo() {
				let me = this;
				let dfd = $.Deferred();
				if(!window.CUR_PROJECTID || !window.CUR_CUSTOMERID || !(window.CUR_CUSTOMERID > '') || !(window.CUR_PROJECTID > '')) {
					dfd.resolve({});
					return dfd;
				}
				
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00061',
						param1: window.CUR_PROJECTID,
						param2: window.CUR_CUSTOMERID
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							dfd.resolve(data);
						}
					}
				});
				return dfd;
			},
			getPostils() {
				switch (this.auditState) {
					case 100:
						return this.postils2;
					case 200:
						return this.postils3;
					case 300:
						return this.postils6;
					case 400:
						return this.postils1;
					case 500:
						return this.postils4;
					case 600:
						return this.postils5;
					case 700:
						return this.postils7;
				}
			},
			buildData(data) {
				let result = [];
				let map = {};
				$.each(data, (index, obj) => {
					if (obj.type == postilType) {
						map[obj.autoId] = obj;
						result.push(map[obj.autoId]);
					} else {
						let parentObj = map[obj.annotationId];
						if (parentObj && !parentObj.comments) {
							parentObj.comments = [];
						}
						parentObj && parentObj.comments.push(obj);
					}
				});
				if (agrs.isSingle) {
					this.postils = result;
				} else {
					switch (this.auditState) {
						case 100:
							this.postils2 = result;
							return;
						case 200:
							this.postils3 = result;
							return;
						case 300:
							this.postils6 = result;
							return;
						case 400:
							this.postils1 = result;
							return;
						case 500:
							this.postils4 = result;
							return;
						case 600:
							this.postils5 = result;
							return;
						case 700:
							this.postils7 = result;
							return;
						default:
							break;
					}
				}
			},
			submitPostil(data, callback) {
				var url= 'dgCenter/DgPostil.savePostil.json';
				if(postilType.substring(0,2)=='HB' || postilType.substring(0,9)=='MERGENOTE' || postilType.substring(0, 10) == 'MERGENOTE2'){
					url= 'dgCenter/HbMergePostil.savePostil.json';
				}
				$.ajax({
					type: 'post',
					url: url,
					//async : false,
					data: data,
					dataType: 'json',
					success(data) {
						callback && callback(data);
					}
				});
			},
			fetch(data, callback) {
				if (agrs.isSingle) {
					data.param4 = undefined;
				}
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					//async : false,
					data: data,
					dataType: 'json',
					success(data) {
						callback && callback(data);
					}
				});
			},
			onSubmitPostil(event) {
				var me = this;
				var postils = this.getPostils();
				let contentText = $('<div>' + this.postilContent + '</div>').text();
				if (this.type == postilType) {
					if (this.postilContent && this.postilContent != '') {
						let data = {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: me.type,
							jsonData: JSON.stringify({
								customerId: me.customerId,
								projectId: me.projectId,
								content: $.base64.encode(encodeURIComponent(me.postilContent)),
								contentText: contentText,
								cellContent: me.cellContent,
								type: postilType,
								auditState: me.auditState,
								foreignId: foreignId,
								postilLevel: me.postilLevel
							})
						};
						this.submitPostil(data, data => {
							if (data.success) {
								let postilData = data.data[0].data;
								let sqlId='DG00077';
								if(postilType.substring(0,2)=='HB' ||postilType.substring(0,9)=='MERGENOTE'){
									sqlId='DG20011';
								}
								me.fetch({
									menuId: window.sys_menuId,
									sqlId:  sqlId,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: postilData.autoId,
									param4: me.auditState,
									param5: foreignId,
									param6: postilType,
									start: -1,
									limit: -1
								}, data => {
									if (data.success) {
										postils.push(data.data[0]);
									} else {
									}
								});
								me.onPostilClose();
							} else {
								dgPostilPage.autoHide = false;
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						});
					}
				} else if (this.type == 'C001') {
					let item = this.threadParam['postilActionAgrs'][1];
					if (this.postilContent && this.postilContent != '') {
						let data = {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: me.type,
							jsonData: JSON.stringify({
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								content: $.base64.encode(encodeURIComponent(me.postilContent)),
								contentText: contentText,
								cellContent: me.cellContent,
								type: me.type,
								annotationId: item.autoId,
								commentedUser: item.__ucreateUser.userId
							})
						};
						this.submitPostil(data, data => {
							if (data.success) {
								let postilData = data.data[0].data;
								let sqlId='DG00152';
								if(postilType.substring(0,2)=='HB' ||postilType.substring(0,9)=='MERGENOTE'){
									sqlId='DG00332';
								}
								me.fetch({
									menuId: window.sys_menuId,
									sqlId:  sqlId,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: postilData.annotationId,
									param4: me.auditState,
									param5: foreignId,
									param6: postilType,
									param7: postilData.autoId
								}, data => {
									if (data.success) {
										if (!item.comments) {
											item.comments = [];
										}
										item.comments.push(data.data[0]);
									} else {
									}
								});
								me.onPostilClose();
							} else {
								postilPage.autoHide = false;
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						});
					}
				} else if (this.type == 'C002') {
					let item = this.threadParam['postilActionAgrs'][1];
					let itemComment = this.threadParam['postilActionAgrs'][2];
					if (this.postilContent && this.postilContent != '') {
						let data = {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: me.type,
							jsonData: JSON.stringify({
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								content: $.base64.encode(encodeURIComponent(me.postilContent)),
								contentText: contentText,
								cellContent: me.cellContent,
								type: me.type,
								annotationId: itemComment.annotationId,
								commentedUser: itemComment.__ucreateUser.userId,
								commentId: itemComment.autoId
							})
						};
						this.submitPostil(data, data => {
							if (data.success) {
								let postilData = data.data[0].data;
								let sqlId='DG00152';
								if(postilType.substring(0,2)=='HB' ||postilType.substring(0,9)=='MERGENOTE'){
									sqlId='DG00332';
								}
								me.fetch({
									menuId: window.sys_menuId,
									sqlId:  sqlId,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: postilData.annotationId,
									param4: me.auditState,
									param5: foreignId,
									param6: postilType,
									param7: postilData.autoId
								}, data => {
									if (data.success) {
										item.comments.push(data.data[0]);
									} else {
									}
								});
								me.onPostilClose();
							} else {
								postilPage.autoHide = false;
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						});
					}
				}
			},
			onNewPostilBtnClick(event) {
				this.newContent = true;
				this.postilContent = '';
				this.cellContent = nodeName;
				this.type = postilType;
				this.postilLevel = 2;
			},
			gotoPosition(event) {
				if (agrs.type.substring(0, 3) == 'DG-') {
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00143',
							param1: window.CUR_CUSTOMERID,
							param2: window.CUR_PROJECTID,
							param3: agrs.data.foreignId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if(data.data.length == 0){
									bdoErrorBox('失败', '批注索引号关联的文件不存在。');
									return;
								}
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
								$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(agrs.data.cellContent));
								window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
							}
						}
					});
				}else  if(agrs.type.substring(0, 5) == 'QYXJ-'){
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgPostil.queryWorkpaper.json',
						async: false,
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: agrs.data.foreignId
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if(data.data.length == 0){
									bdoErrorBox('失败', '批注索引号关联的文件不存在。');
									return;
								}
								// 打开底稿
								var nodeData = {
									extraOptions: data.data[0],
									currentNode: {
										extraOptions: data.data[0]
									}
								};
								//nodeData.autoId = nodeData.extraOptions.autoId;
								nodeData.extraOptions.workpaperId = nodeData.extraOptions.autoId;
								nodeData.menuId = window.sys_menuId;
								$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
								$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(agrs.data.cellContent));
								window.open('/Faith/dgcenter.do?m=openQYXJFile&customerId='+window.CUR_CUSTOMERID+'&projectId='+window.CUR_PROJECTID+'&fileType=2');
							}
						}
					});
				}else if(agrs.type.substring(0, 2) == 'HB' ){
					$.ajax({
						type: 'post',
						url: 'dgCenter/HbMergePostil.getUrlByIndexId.json',
						async: false,
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: agrs.type
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								// 打开底稿
								var url =data.data[0].url;
								var type=data.data[0].type;
								if(url !=undefined && url !=""){
									let _obj={
										curCustomerName:window.CUR_CUSTOMERID+'-'+window.CUR_CUSTOMERNAME,
										curProjectName:window.CUR_PROJECTNAME,
										curYear:window.CUR_PROJECT_ACC_YEAR,
										curCustomerId:window.CUR_CUSTOMERID,
										curProjectId:window.CUR_PROJECTID,
										departmentIdr:departIdrSession,
										userId:sys_userId
									};
									let _projectobj={
										curYear:window.CUR_PROJECT_ACC_YEAR,
										customerId:window.CUR_CUSTOMERID,
										mergeCustomerId:agrs.data.mergeCustomerId,
										mergeCustomerName:agrs.data.mergeCustomerName,
										projectId:agrs.data.mergeProjectId+'-'+agrs.data.mergeProjectName,
										type:type
									};
									sessionStorage.setItem('curCustomerData',JSON.stringify(_obj));
									sessionStorage.setItem('projectItem',JSON.stringify(_projectobj));
									sessionStorage.setItem('menuID',agrs.type);
									window.open('/Faith/merge/index.html#/'+url);
								} else{
									window.open('/Faith/merge/index.html');
								}
							}
						}
					});

				}else if(agrs.type.substring(0, 4) == 'NOTE'){
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00092',
							param1:  agrs.data.foreignId,
							param2: agrs.data.customerId,
							param3: agrs.data.projectId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success ) {
								if(data.data.length == 0){
									bdoErrorBox('失败', '批注索引号关联的文件不存在。');
									return;
								}
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

				}else if(agrs.type.substring(0, 10) == 'MERGENOTE2'){
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00310',
							param1:  agrs.data.foreignId,
							param2: agrs.data.customerId,
							param3: agrs.data.projectId,
							param4: agrs.data.mergeProjectId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if(data.data.length == 0){
									bdoErrorBox('失败', '批注索引号关联的文件不存在。');
									return;
								}
								var nodeData = {
									extraOptions: data.data[0],
									currentNode: {
										extraOptions: data.data[0]
									}
								};
								nodeData.autoId = nodeData.extraOptions.autoId;
								nodeData.menuId = window.sys_menuId;
								nodeData.type = 2;
								$.sessionStorage('excelnode', JSON.stringify(nodeData));
								window.open('/Faith/dgcenter.do?m=openMergeNoteInfoSecond&noteNo=' + nodeData.extraOptions.noteNo);
							}
						}
					});

				} else if(agrs.type.substring(0, 9) == 'MERGENOTE'){
					$.ajax({
						type: 'post',
						url: 'dgCenter/DgGeneral.query.json',
						async: false,
						data: {
							menuId: window.sys_menuId,
							sqlId: 'DG00310',
							param1:  agrs.data.foreignId,
							param2: agrs.data.customerId,
							param3: agrs.data.projectId,
							param4: agrs.data.mergeProjectId,
							start: -1,
							limit: -1
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								if(data.data.length == 0){
									bdoErrorBox('失败', '批注索引号关联的文件不存在。');
									return;
								}
								var nodeData = {
									extraOptions: data.data[0],
									currentNode: {
										extraOptions: data.data[0]
									}
								};
								nodeData.autoId = nodeData.extraOptions.autoId;
								nodeData.menuId = window.sys_menuId;
								sessionStorage.setItem('mergeNoteInfoNode', JSON.stringify(nodeData));
								window.open('/Faith/dgcenter.do?m=openMergeNoteInfo&noteNo=' + nodeData.extraOptions.noteNo);
							}
						}
					});
				} else {
					if (agrs.isSingle) {
						$('#postilmodal').modal('hide');
					}
					window.open('/Faith/bdologin.do?m=gotoDesktop&menuId=40000022&type=' + agrs.type);
				}
			},
			onPostilClose(event) {
				this.newContent = false;
				this.type = '';
				this.postilContent = '';
				this.cellContent = '';
				this.postilLevel = 2;
			},
			countInfoInit() {
				var $postilsTitle = $('#postilsTitle');
				var $postilCount1 = $('#postilCount1', $postilsTitle);
				var $postilCount2 = $('#postilCount2', $postilsTitle);
				var $postilCount3 = $('#postilCount3', $postilsTitle);
				var $postilCount4 = $('#postilCount4', $postilsTitle);
				var $postilCount5 = $('#postilCount5', $postilsTitle);
				var $postilCount6 = $('#postilCount6', $postilsTitle);
				var $postilCount7 = $('#postilCount7', $postilsTitle);
				$.ajax({
					url: 'dgCenter/DgPostil.countInfoInit.json',
					data: {
						menuId: window.sys_menuId,
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start: -1,
						limit: -1
					},
					type: 'POST',
					dataType: 'json'
				}).done(function(data) {
					if (data.success) {
						let dataList = data.data[0];
						$postilCount1.text(dataList.postil1 + ' / ' + dataList.postilTotal1);
						$postilCount2.text(dataList.postil2 + ' / ' + dataList.postilTotal2);
						$postilCount3.text(dataList.postil3 + ' / ' + dataList.postilTotal3);
						$postilCount4.text(dataList.postil4 + ' / ' + dataList.postilTotal4);
						$postilCount5.text(dataList.postil5 + ' / ' + dataList.postilTotal5);
						$postilCount6.text(dataList.postil6 + ' / ' + dataList.postilTotal6);
						$postilCount7.text(dataList.postil7 + ' / ' + dataList.postilTotal7);
					}
				});
			},
			closePostil() {
				var me = this;
				var item = this.threadParam['postilActionAgrs'][1];
				var url='dgCenter/DgPostil.closePostil.json';
				if(item.type.substring(0,2)=='HB' || item.type.substring(0, 9) == 'MERGENOTE' || item.type.substring(0, 10) == 'MERGENOTE2'){
					url='dgCenter/HbMergePostil.closePostil.json';
				}
				var doIt = () => {
					$.ajax({
						type: 'post',
						url: url,
						//async : false,
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: item.autoId,
							param2: item.customerId
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								item.activeFlag = 0;
								if ($('#postilsPage').length > 0) {
									$('#postilsPage').find('#postilsTable').DataTable().ajax.reload();
									me.countInfoInit();
								}
								bdoSuccessBox('成功', data.resultInfo.statusText);
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				};
				bdoConfirmBox('提示', '确定要关闭这条批注吗？', (isConfirm) => {
					doIt();
				});
			},
			openPostil() {
				var me = this;
				var item = this.threadParam['postilActionAgrs'][1];
				var url='dgCenter/DgPostil.openPostil.json';
				if(item.type.substring(0,2)=='HB' || item.type.substring(0, 9) == 'MERGENOTE' || item.type.substring(0, 10) == 'MERGENOTE2'){
					url='dgCenter/HbMergePostil.openPostil.json';
				}
				var doIt = () => {
					$.ajax({
						type: 'post',
						url: url,
						//async : false,
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: item.autoId,
							param2: item.customerId
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								item.activeFlag = 1;
								if ($('#postilsPage').length > 0) {
									$('#postilsPage').find('#postilsTable').DataTable().ajax.reload();
									me.countInfoInit();
								}
								bdoSuccessBox('成功', data.resultInfo.statusText);
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				};
				bdoConfirmBox('提示', '确定要重新开启这条批注吗？', (isConfirm) => {
					doIt();
				});
			},
			deletePostil() {
				var me = this;
				let item = this.threadParam['postilActionAgrs'][1];
				let _this = this;
				let itemIndex = _this.postils.indexOf(item);
				var url='dgCenter/DgPostil.deletePostil.json';
				if(item.type.substring(0,2)=='HB' || item.type.substring(0, 9) == 'MERGENOTE' || item.type.substring(0, 10) == 'MERGENOTE2'){
					url='dgCenter/HbMergePostil.deletePostil.json';
				}
				bdoConfirmBox('提示', '确定要删除这条批注吗？', (isConfirm) => {
					$.ajax({
						type: 'post',
						url: url,
						//async : false,
						data: {
							customerId: window.CUR_CUSTOMERID,
							projectId: window.CUR_PROJECTID,
							param1: item.autoId,
							param2: window.CUR_CUSTOMERID,
							param3: window.CUR_PROJECTID
						},
						dataType: 'json',
						success(data) {
							if (data.success) {
								_this.postils.splice(itemIndex, 1);
								let index = _this.threadParam['postilActionAgrs'].indexOf(item);
								_this.threadParam['postilActionAgrs'].splice(itemIndex, 1);
								$('#' + item.autoId).remove();
								if (agrs.isSingle) {
									$('#postilmodal').modal('hide');
									$('#postilsTable').DataTable().ajax.reload();
								}
								if ($('#postilsPage').length > 0) {
									$('#postilsPage').find('#postilsTable').DataTable().ajax.reload();
									me.countInfoInit();
								}
								bdoSuccessBox('成功', data.resultInfo.statusText);
							} else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
						}
					});
				});
			},
			postilAction(event, agrs) {
				let type = agrs[0];
				this.threadParam['postilActionAgrs'] = agrs;
				switch (type) {
					case 'C001':
						this.type = type;
						this.newContent = true;
						this.postilContent = '';
						this.cellContent = nodeName;
						break;
					case 'C002':
						this.type = type;
						this.newContent = true;
						this.postilContent = '';
						this.cellContent = nodeName;
						break;
					case '005':
						this.closePostil();
						break;
					case '006':
						this.openPostil();
						break;
					case '007':
						this.deletePostil();
						break;
					default:
						break;
				}
			}
		},
		mounted() {
			let me = this;
			dgPostilPage = side({el: '#dgPostilPage', autoHide: false});
			this.auditState = 400;
			this.fetchProjectInfo().done(function(data) {
				if (data.success) {
					if (data.data && data.data[0]) {
						let projectInfo = data.data[0];
						/*manager 项目负责人
						signAccountant2 签字会计师2
						signAccountant3 签字会计师3
						audit1 一审负责人
						audit2 二审负责人
						reaReviewer 外派复核人
						signUser 签字合伙人
						reviewPartner 复核合伙人
						issuedPeople 签发人*/
						let state = 0;
						if (projectInfo.manager == sys_userId) {
							state += (0x1 << 0);
						}
						if (projectInfo.signAccountant2 == sys_userId || projectInfo.signAccountant3 == sys_userId) {
							state += (0x1 << 4);
						}
						if (projectInfo.audit1 == sys_userId) {
							state += (0x1 << 1);
						}
						if (projectInfo.audit2 == sys_userId) {
							state += (0x1 << 2);
						}
						if (projectInfo.reaReviewer == sys_userId) {
							state += (0x1 << 5);
						}
						if (projectInfo.signUser == sys_userId) {
							state += (0x1 << 6);
						}
						if (projectInfo.reviewPartner == sys_userId) {
							state += (0x1 << 3);
						}
						if (projectInfo.issuedPeople == sys_userId) {
							state += (0x1 << 7);
						}
						me.userAuditState = state;
					}
				}
				if (((me.userAuditState & (0x1 << 4)) >> 4) == 1) {
					me.newPostilBtnShow = true;
				}
			});
			listener();
			OneUI.initHelper('slimscroll');
			if ($.sessionStorage('mergeType') == '1') {
				$('#sideRegin').removeAttr("style","");
			}
			dgPostilPage.show();
			initPostilContentsEditor(this, agrs);
		},
		beforeCreate() {
			if (agrs.isSingle) {
				_template = agrs.template || tplLoader('dgCenter/html/dg/pageSinglePostil.html');
			} else {
				_template = agrs.template || tplLoader('dgCenter/html/dg/pagePostil.html');
			}
			agrs.template = _template;
			postilType = agrs.type;
			foreignId = agrs.foreignId;
			if (agrs.data.extraOptions != undefined && agrs.data.extraOptions.nodeType == 'PROJECT') {
				nodeName = '项目';
			} else {
				nodeName = agrs.data.extraOptions != undefined ? agrs.data.extraOptions.nodeName : (agrs.data.nodeName != undefined ? agrs.data.nodeName : agrs.data.dgName);
			}
			$(agrs.region).empty().append(_template);
		}
	});
};