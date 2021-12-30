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
				title : '用户绑定项目管理系统账号',
				fieldDefaults : {
					labelWidth : 100,
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
					value : "<span class='markLabelImport'>您的域账号还未与项目管理系统账号绑定。<br>为了今后能够正常使用此系统，请尽快绑定。</span>"
						// }, {
						// xtype : 'displayfield',
						// fieldLabel : '',
						// colspan : 3,
						// labelWidth : 2,
						// width : 460,
						// value : "<hr>"
					}, {
					fieldLabel : '原系统账号',
					maxLength : 20,
					colspan : 3,
					id : 'ueserLoginId',
					tabIndex : 1,
					allowBlank : false,
					emptyText : '原项目管理系统账号',
					blankText : '必须输入项目管理系统账号',
					name : 'ueserLoginId',
					value : ''

				}, {
					fieldLabel : '密  码',
					colspan : 3,
					id : 'pwd',
					name : 'pwd',
					allowBlank : false,
					tabIndex : 2,
					maxLength : 20,
					inputType : 'password',
					blankText : '必须输入密码',
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
					inputId : 'isSelfsynAcount',
					value : '1'
				}, {
					xtype : 'hidden',
					inputId : 'm',
					value : 'login'
				}],
				buttons : [{
							scale : 'large',
							tabIndex : 4,
							text : '<b>确定</b>',
							type : 'submit',
							handler : function() {
								var form = this.up('form').getForm();
								if (form.isValid()) {
									Bdo.Ajax.request({
												url : './cpBase/SelfSyn.syn2.json',
												params : {
													param1 : form.findField('ueserLoginId').getValue(),
													param2 : form.findField('pwd').getValue()
												},
												method : 'GET',
												success : function(response) {
													alert("绑定成功!");
													form.submit({
																url : './bdologin.do'
															});
													// extWin.hide();
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

}