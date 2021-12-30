function init() {
Ext.form.Panel
	var loginForm = Ext.create('Ext.FormPanel', {
				renderTo : 'loginDiv',
				method : 'POST',
				standardSubmit : true,
				frame : true,
				width : 800,
				height:460,
				bodyStyle : "background-image:url(./img/bdo/backgroundMain.png)",
				//title : '立信项目管理系统',
				//headerAsText:false, // 去除title
				fieldDefaults : {
					labelWidth : 40,
					msgTarget : 'side',
					autoFitErrors : false
				},
				defaultType : 'textfield',
				layout : {
					type : 'table',
					columns : 3
				},
				items : [{
							// xtype : 'image',
							// src : './images/logobig.jpg',
							// width : 550
							// }, {
							xtype : 'displayfield',
							rowspan : 4,
							width : 280

						}, {
							xtype : 'displayfield',
							width : 268,
							colspan : 2,
							height : 282

						}, {
							fieldLabel : '账  号',
							maxLength : 20,
							colspan : 2,
							height : 30,
							width : 270,
							id : 'ueserLoginId',
							tabIndex:1,
							allowBlank : false,
							emptyText : loginUserTip,
							blankText : '必须输入账号',
							name : 'ueserLoginId',
							value : ueserLoginId
						}, {
							fieldLabel : '密  码',
							 labelClsExtra:'loginLabel',
							colspan : 2,
							height : 30,
							width : 270,
							id : 'pwd',
							name : 'pwd',
							padding:'5 0 0 0',
							allowBlank : false,
							tabIndex:2,
							maxLength : 20,
							inputType : 'password',
							blankText : '必须输入密码',
							value : ''
						}, {
							colspan : 2,
							xtype : 'displayfield',
							fieldCls :'markLabelError',
							value : errorMessage,
							width : 280,
							height : 20
						}, {
							xtype : 'displayfield',
							id : 'downloadLink',
							html : '<a href="#" onclick="window.open(helpURL)">使用帮助及环境要求</a> ',
							width : 200,
							height : 30
						}, {
							xtype : 'checkbox',
							id : 'rememberPwd',
							checked: rememberPwd,
							boxLabel : '记住账号',
							inputValue:'on',
							tabIndex:3,
							name : 'rememberPwd'
						}, {
							xtype : 'button',
							scale : 'large',
							width : 70,
							height : 30,
							tabIndex:4,
							iconCls:'loginImg',
							text:'登陆',
							type : 'submit',
							handler : function() {
								var form = this.up('form').getForm();
								if (form.isValid()) {
									if(form.findField('pwd').getValue() == 'abcd1234'){
										Bdo.Message.Error("您所使用的账户密码还未修改，请登录https://mail.bdo.com.cn 修改密码。如果您使用的不是本人账号，请联系当事人进行及时修改工作。");
										return;
									}
									form.submit({
											url : Ext.isEmpty(lo) || lo == 'null'?'./bdologin.do?m=login':lo
										})
								}
							}
						}, {
							colspan : 3,
							xtype : 'displayfield',
							width : 500,
							html : '<div align="center" style="font-size:10px">沪ICP备12039590号-3</div>'
						}]
			});
}