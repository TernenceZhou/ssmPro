function init() {
	var loginForm = Ext.create('Ext.FormPanel', {
				renderTo : 'mainDiv',
				method : 'POST',
				standardSubmit : true,
				frame : true,
				width : 468,
				// bodyStyle :
				// "background-image:url(./images/bdo/backgroundMain.png)",
				buttonAlign : 'center',
				title : '用户同步域账号',
				fieldDefaults : {
					labelWidth : 60,
					msgTarget : 'side',
					autoFitErrors : false
				},
				defaultType : 'textfield',
				layout : {
					type : 'table',
					columns : 3
				},
				items : [{
							xtype : 'displayfield',
							fieldLabel : '提示信息',
							colspan : 3,
							htmlEncode : false,
							value : "<span class='markLabelImport'>您的项目管理系统账号还未与域账号绑定。<br>为了今后能够正常使用此系统，请尽快绑定域账号。<br>我们仅在指定期间内提供此绑定功能，如果您在此期间内未完成绑定，今后将无法使用此系统！</span>"
						}, {
							xtype : 'displayfield',
							fieldLabel : '最晚绑定域账户日期',
							colspan : 3,
							labelWidth : 130,
							width : 468,
							value : "<span class='markLabel'>" + canSelfSyn + "</span>"
						}, {
							xtype : 'displayfield',
							fieldLabel : '',
							colspan : 3,
							labelWidth : 2,
							width : 460,
							value : "<hr>"
						}, {
							fieldLabel : '域账号',
							maxLength : 20,
							colspan : 3,
							id : 'hrLoginId',
							tabIndex : 1,
//							allowBlank : false,
							emptyText : '公司邮箱账号',
//							blankText : '必须输入域账号',
							name : 'hrLoginId',
							value : ''

						}, {
							fieldLabel : '密  码',
							colspan : 3,
							id : 'hrPwd',
							name : 'hrPwd',
//							allowBlank : false,
							tabIndex : 2,
							maxLength : 20,
							inputType : 'password',
//							blankText : '必须输入密码',
							value : ''
						}, {
							xtype : 'displayfield',
							fieldLabel : '',
							colspan : 3,
							labelWidth : 2,
							width : 460,
							value : "<br>"
						}, {
							xtype : 'hidden',
							inputId:'userName',
							value : userName
						}, {
							xtype : 'hidden',
							inputId : 'userAuditDepartName',
							value : userAuditDepartName
						}, {
							xtype : 'hidden',
							inputId : 'userAuditDepartmentName',
							value : userAuditDepartmentName

						}, {
							xtype : 'hidden',
							inputId : 'userInfo',
							value : userInfo

						}, {
							xtype : 'hidden',
							inputId : 'trinfo',
							value : trinfo

						}, {
							xtype : 'hidden',
							inputId : 'laster_version',
							value : lastVersion
						}, {
							xtype : 'hidden',
							inputId : 'deskImg',
							value : deskImg
						}, {
							xtype : 'hidden',
							inputId : 'deskImgSt',
							colspan : 2,
							value : deskSt
						}],
						buttons : [{
							scale : 'large',
							tabIndex : 3,
							text : '<b>以后再说</b>',
							handler : function() {
								var form = this.up('form').getForm();
								form.submit({
											url : './bdologin.do?m=gotoDesktop'
										})
//								extWin.hide();
							}
						}, {
							scale : 'large',
							tabIndex : 4,
							text : '<b>确定</b>',
							type : 'submit',
							handler : function() {
								var form = this.up('form').getForm();
								if (form.isValid()) {
									Bdo.Ajax.request({
												url : './cpBase/SelfSyn.syn.json',
												params : {
													param1 : form.findField('hrLoginId').getValue(),
													param2 : form.findField('hrPwd').getValue()
												},
												method : 'GET',
												success : function(response) {
													alert("绑定成功!");
													form.submit({
																url : './bdologin.do?m=gotoDesktop'
															});
//													extWin.hide();
												},
												error : function(response) {
													var obj = Ext.JSON.decode(response.responseText);
													if (Ext.isEmpty(obj.resultInfo.statusText)) {
														alert("出现未知错误，请联系管理员!");
													} else {
														alert(obj.resultInfo.statusText);
													}
												},
												failure : function(response) {
													alert("网络超时,处理失败,请联系管理员!");
												}
											});

								}
							}

						}

				]
						
			});

	// var extWin = new Ext.Window({
	// title : '用户同步域账号',
	// renderTo : 'mainDiv',
	// width : 468,
	// autoHeight : true,
	// minWidth : 468,
	// // minHeight : bdoHeight.window.min,
	// resizable : false,
	// layout : 'fit',
	// items :loginForm ,
	// // closeAction : 'hide',
	// modal : true,
	// plain : true,
	// bodyStyle : 'padding:5px;',
	// buttonAlign : 'center',
	// buttons : [{
	// scale : 'large',
	// tabIndex : 3,
	// text : '<b>以后再说</b>',
	// handler : function() {
	// var form = this.up('form').getForm();
	// form.submit({
	// url : './bdologin.do?m=gotoDesktop'
	// })
	// extWin.hide();
	// }
	// }, {
	// scale : 'large',
	// tabIndex : 4,
	// text : '<b>确定</b>',
	// type : 'submit',
	// handler : function() {
	// var form = this.up('form').getForm();
	// if (form.isValid()) {
	// Bdo.Ajax.request({
	// url : './projectsystem/OAWorkflowFile.printFile.json',
	// params : {
	// param1 : form.findField('hrLoginId').getValue(),
	// param2 : form.findField('hrPwd').getValue()
	// },
	// method : 'GET',
	// success : function(response) {
	// alert("绑定成功!");
	// form.submit({
	// url : './bdologin.do?m=login'
	// });
	// extWin.hide();
	// },
	// error : function(response) {
	// var obj = Ext.JSON.decode(response.responseText);
	// if (Ext.isEmpty(obj.resultInfo.statusText)) {
	// alert("出现未知错误，请联系管理员!");
	// } else {
	// alert(obj.resultInfo.statusText);
	// }
	// },
	// failure : function(response) {
	// alert("网络超时,处理失败,请联系管理员!");
	// }
	// });
	//
	// }
	// }
	//
	// }
	//
	// ]
	// });
	// extWin.show();
}