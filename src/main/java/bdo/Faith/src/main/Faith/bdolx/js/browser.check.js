(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define([], function() {
			return factory(window, document, window.Browser);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function(root, $) {
			if (!root) {
				root = window;
			}
			if (!$) {
				throw Error('jQuery undefined');
			}
			return factory(window, document, window.Browser);
		};
	}
	else {
		window.Browser = factory(window, document, window.Browser);
	}
}(function(window, document, Browser_) {

	var Browser=Browser_ || (function(window){
		var document = window.document,
			navigator = window.navigator,
			agent = navigator.userAgent.toLowerCase(),
			//IE8+支持.返回浏览器渲染当前文档所用的模式
			//IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
			//IE10:10(兼容模式7||8||9)
			IEMode = document.documentMode,
			//chorme
			chrome = window.chrome || false ,
			System = {
				//user-agent
				agent : agent,
				//是否为IE
				isIE : /msie/.test(agent),
				//Gecko内核
				isGecko: agent.indexOf( "gecko" )> 0 && agent.indexOf( "like gecko" )< 0 ,
				//webkit内核
				isWebkit: agent.indexOf( "webkit" )> 0 ,
				//是否为标准模式
				isStrict: document.compatMode === "CSS1Compat" ,
				//是否支持subtitle
				supportSubTitle:function(){
					return "track" in document.createElement( "track" );
				},
				//是否支持scoped
				supportScope:function(){
					return "scoped" in document.createElement( "style" );
				},
				//获取IE的版本号
				ieVersion:function(){
					try {
						return agent.match(/msie ([\d.]+)/)[ 1 ] || 0 ;
					} catch (e) {
						console.log( "error" );
						return IEMode;
					}
				},
				//Opera版本号
				operaVersion:function(){
					try {
						if (window.opera) {
							return agent.match(/opera.([\d.]+)/)[ 1 ];
						} else if (agent.indexOf( "opr" ) > 0 ) {
							return agent.match(/opr\/([\d.]+)/)[ 1 ];
						}
					} catch (e) {
						console.log( "error" );
						return 0 ;
					}
				},
				//描述:version过滤.如31.0.252.152 只保留31.0
				versionFilter:function(){
					if (arguments.length === 1 && typeof arguments[ 0 ] === "string" ) {
						var version = arguments[ 0 ];
						start = version.indexOf( "." );
						if (start> 0 ){
							end = version.indexOf( "." ,start+ 1 );
							if (end !== - 1 ) {
								return version.substr( 0 ,end);
							}
						}
						return version;
					} else if (arguments.length === 1 ) {
						return arguments[ 0 ];
					}
					return 0 ;
				}
			};

		try {
			//浏览器类型(IE、Opera、Chrome、Safari、Firefox)
			System.type = System.isIE? "IE" :
				window.opera || (agent.indexOf( "opr" ) > 0 )? "Opera" :
					(agent.indexOf( "chrome" )> 0 )? "Chrome" :
						//safari也提供了专门的判定方式
						window.openDatabase? "Safari" :
							(agent.indexOf( "firefox" )> 0 )? "Firefox" :
								'unknow' ;

			//版本号
			System.version = (System.type === "IE" )?System.ieVersion():
				(System.type === "Firefox" )?agent.match(/firefox\/([\d.]+)/)[ 1 ]:
					(System.type === "Chrome" )?agent.match(/chrome\/([\d.]+)/)[ 1 ]:
						(System.type === "Opera" )?System.operaVersion():
							(System.type === "Safari" )?agent.match(/version\/([\d.]+)/)[ 1 ]:
								"0" ;

			//浏览器外壳
			System.shell=function(){
				//遨游浏览器
				if (agent.indexOf( "maxthon" ) > 0 ) {
					System.version = agent.match(/maxthon\/([\d.]+)/)[ 1 ] || System.version ;
					return "傲游浏览器" ;
				}
				//QQ浏览器
				if (agent.indexOf( "qqbrowser" ) > 0 ) {
					System.version = agent.match(/qqbrowser\/([\d.]+)/)[ 1 ] || System.version ;
					return "QQ浏览器" ;
				}

				//搜狗浏览器
				if ( agent.indexOf( "se 2.x" )> 0 ) {
					return '搜狗浏览器' ;
				}

				//Chrome:也可以使用window.chrome && window.chrome.webstore判断
				if (chrome && System.type !== "Opera" ) {
					var external = window.external,
						clientInfo = window.clientInformation,
						//客户端语言:zh-cn,zh.360下面会返回undefined
						clientLanguage = clientInfo.languages;

					//猎豹浏览器:或者agent.indexOf("lbbrowser")>0
					if ( external && 'LiebaoGetVersion' in external) {
						return '猎豹浏览器' ;
					}
					//百度浏览器
					if (agent.indexOf( "bidubrowser" )> 0 ) {
						System.version = agent.match(/bidubrowser\/([\d.]+)/)[ 1 ] ||
							agent.match(/chrome\/([\d.]+)/)[ 1 ];
						return "百度浏览器" ;
					}
					//360极速浏览器和360安全浏览器
					if ( System.supportSubTitle() && typeof clientLanguage === "undefined" ) {
						//object.key()返回一个数组.包含可枚举属性和方法名称
						var storeKeyLen = Object.keys(chrome.webstore).length,
							v8Locale = "v8Locale" in window;
						return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器' ;
					}
					return "Chrome" ;
				}
				return System.type;
			};

			//浏览器名称(如果是壳浏览器,则返回壳名称)
			System.name = System.shell();
			//对版本号进行过滤过处理
			System.version = System.versionFilter(System.version);

		} catch (e) {
			console.log( "error" );
		}
		return {
			client:System
		};

	})(window);
	return Browser;
}));

!(window.Browser.client.type === 'Chrome' &&
	window.Browser.client.isWebkit === true &&
	window.Browser.client.name &&
	window.Browser.client.name.indexOf("Chrome") > -1 ) && (function() {
	document.body.innerText = '';
	document.body.innerHTML = '';
	document.body.innerHTML = `
		<link rel="shortcut icon" href="img/coop/logo2.png">
		<link rel="stylesheet" href="assets/css/bootstrap.min.css">
		<link rel="stylesheet" id="css-main" href="assets/css/oneui.css">
		<div class="content bg-white text-center pulldown overflow-hidden">
			<div class="row">
				<div class="col-sm-6 col-sm-offset-3">
					<h3 class="font-s128 font-w300 text-danger animated bounceInDown">请使用Chrome 浏览器!</h3>
				</div>
			</div>
		</div>
	`;
})();