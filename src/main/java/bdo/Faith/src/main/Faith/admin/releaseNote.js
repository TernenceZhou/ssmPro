var releashNotePage = null;
var version = '2.0';

function showReleashNote() {
	var stateProvider = Ext.state.Manager.getProvider();
	//if (version > '1.0'  && Ext.isEmpty(stateProvider.get(Bdo.saveableStateIdPrex + 'rekeaseNote_' + version))) {
	if (version > '1.0') {	
		// 更新内容
		if (releashNotePage == null) {
			releashNotePage = new Ext.Window({
						title : "更新内容 ： ",
						width : bdoWidth.window.large,
						height : bdoHeight.window.large - 150,
						minWidth : bdoWidth.window.min,
						minHeight : bdoHeight.window.min,
						resizable : false,
						closable:false,
						// layout : 'fit',
						contentEl : Ext.DomHelper.append(document.body, {
									tag : 'iframe',
									style : "border 0px none;scrollbar:true",
									src : 'http://172.16.1.154:7189/coopsystem/bus/update.htm',
									height : "100%",
									width : "100%"
								}),
						closeAction : 'hide',
						modal : true,
						plain : true,
						bodyStyle : 'padding:5px;',
						buttonAlign : 'center',
						buttons : ['不再显示', {
									xtype : 'checkbox',
									id : 'chbNotShowReleasse',
									inputValue : '1',
									value : false
								}, {
									text : '关闭',
									handler : function() {
										if(Ext.getCmp('chbNotShowReleasse').getValue() == '1'){
											stateProvider.set(Bdo.saveableStateIdPrex + 'rekeaseNote_' + version,true);
											Bdo.Ajax.request({
												url : './admin/KUser.updateShowHelp.json',
												success : function(response) {
												},
												error : function(e) {
												},
												failure : function(e) {
												}
											});
										}
										releashNotePage.hide();
									}
								}]
					});
		}
		releashNotePage.show();
	}
}
