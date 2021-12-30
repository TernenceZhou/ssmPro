(function() {
    sessionStorage.clear();
    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    
})();

$(document).ready(function() {
    function getData(url, data, callback) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'post',
                url: url,
                data: data,
                dataType: 'json',
                success(data) {
                    if (data.success) {
                        resolve(data);
                    }else {
                        reject(data);
                    }
                }
            });
        });
    }
    let promise = getData('/sacp/getClientInfo.do');
    promise.then((data) => {
        window.loginPageInfo = data.data;
        $('#systemName').text(window.loginPageInfo.systemName);
        var loginUrl = window.loginPageInfo.loginUrl + '?m=' + window.loginPageInfo.method;

        $(':input[name="fromDomain"]').val(window.loginPageInfo.fromDomain);
        $(':input[name="systemId"]').val(window.loginPageInfo.systemId);
        $(':input[name="method"]').val(window.loginPageInfo.method);
        $(':input[name="loginUrl"]').val(window.loginPageInfo.loginUrl);
        $(':input[name="loginType"]').val(window.loginPageInfo.loginType);
        $(':input[name="chrome"]').val(window.loginPageInfo.chrome);
        if(window.loginPageInfo.errorMsg && window.loginPageInfo.errorMsg != 'null' && window.loginPageInfo.errorMsg > '') {
            $('#errorMessage').css({
                'background-color': 'transparent',
                'opacity': '1'
            }).text(window.loginPageInfo.errorMsg);
        }else {
            $('#errorMessage').css({
                'background-color': 'transparent',
                'opacity': '1'
            }).text('');
        }

        function login() {
            let formData = $('#bdoLoginAction').serialize();
            let p = getData(loginUrl, formData);
            p.then(data => {
                console.log(data);
                let loginData = data.data;
                window.BDO_CUSTOMERNAME_SELECT = loginData.selectedCustomerName;
                window.BDO_CUSTOMER_SELECT = loginData.selectedCustomerId;
                window.BDO_PROJECTNAME_SELECT = loginData.selectedProjectName;
                window.BDO_PROJECT_SELECT = loginData.selectedProjectId;
                window.BDO_SYSTEM_WEB_ROOT = '';
                window.BDO_YEAR_SELECT = loginData.selectedProjectYear;

                window.CUR_CUSTOMERID = loginData.selectedCustomerId;
                window.CUR_CUSTOMERNAME = loginData.selectedCustomerName;
                window.CUR_DGPROJECT_AUTOID = loginData.selectedProjectAutoId;
                window.CUR_PROJECTID = loginData.selectedProjectId;
                window.CUR_PROJECTNAME = loginData.selectedProjectName;
                window.CUR_PROJECT_ACC_YEAR = loginData.selectedProjectYear;
                window.CUR_PROJECT_END_MONTH = loginData.selectedProjectEndMonth;
                window.CUR_PROJECT_END_YEAR = loginData.selectedProjectEndYear;
                window.CUR_PROJECT_START_MONTH = loginData.selectedProjectStartMonth;
                window.CUR_PROJECT_START_YEAR = loginData.selectedProjectStartYear;
                window.CUR_USERID = loginData.userId;

                window.companyIdSession = loginData.companyIdSession;
                window.companyNmSession = loginData.companyNmSession;
                window.departIdSession = loginData.departIdSession;
                window.departIdrSession = loginData.departIdrSession;
                window.departNmSession = loginData.departNmSession;
                window.departNmrSession = loginData.departNmrSession;
                window.officeIdSession = loginData.officeIdSession;
                window.officeNmSession = loginData.officeNmSession;

                window.hrLoginId = loginData.hrLoginId;
                window.loginId = loginData.loginId;
                window.name = loginData.userName;
                window.selfNm = loginData.userName;
                window.sys_menuId = '';
                window.sys_userId = loginData.userId;

                window.systemId = loginData.systemId;
                window.systemName = loginData.systemName;
                window.systemPageTitle = loginData.systemPageTitle;
                window.fromDomain = loginData.fromDomain;
                window.oteServer = loginData.oteServer;
                window.hasSacpCer = loginData.hasSacpCer;
                window.sacpCerExpired = loginData.sacpCerExpired;
                window.sacpCerExpiredDate = loginData.sacpCerExpiredDate;
                window.showHelp = loginData.showHelp;
                window.trinfo = loginData.trInfo;
                window.userCustomers = loginData.userCustomers;
                window.version = '';

                window.bdoVouchingTrInfo = loginData.bdoVouchingTrInfo;
                window.bdoVouchingUrl = loginData.bdoVouchingUrl;
                window.bdoBenfordAnalysis = loginData.bdoBenfordAnalysis;
                window.bdoAccountChecking = loginData.bdoAccountChecking;
                window.generalTableParsingPlatformUrl = loginData.generalTableParsingPlatformUrl;


                window.xxrPageKey = loginData.xxrPageKey;
                window.xxrToken = loginData.xxrToken;
                window.xxrUrl = loginData.xxrUrl;
                $.sessionStorage('loginData', JSON.stringify(loginData));
                window.location.href = '/sacp/main.do';
            }).catch(data => {
                // 异常
                $('#errorMessage').css({
                    'background-color': 'floralwhite',
                    'opacity': '0.8'
                }).html(data.resultInfo);
            });
        }
        // 按Enter键提交 13：Enter
        $(':input[name="ueserLoginId"],:input[name="pwd"]').keyup(function(e) {
            if (e.keyCode == 13) {
                // $('#bdoLoginAction').attr('action', loginUrl);
                // $('#bdoLoginAction').submit();
                /*let formData = $('#bdoLoginAction').serialize();
                let p = getData(loginUrl, formData);
                p.then(data => {
                    // 跳转首页
                }).cach(data => {
                    // 异常
                    $('#errorMessage').css({
                        'background-color': 'floralwhite',
                        'opacity': '0.8'
                    }).html(data.resultInfo);
                });*/
                login();
            }
        });
        // 按"登录"键提交
        $('#loginBtn').click(function(e) {
            /*$('#bdoLoginAction').attr('action', loginUrl);
            $('#bdoLoginAction').submit();*/
            login();
        });

        $('#errorMessage').css({
            'background-color': 'transparent',
            'opacity': '1'
        }).html("");
        /*var errorMessage = '<%=request.getAttribute("errorMessage")%>';
        if (errorMessage != null && errorMessage != 'null' && errorMessage != '' && errorMessage.length > 0) {
            
        }*/
    }, (data) => {
        if(data && data.resultInfo) {
            $('#errorMessage').css({
                'background-color': 'transparent',
                'opacity': '1'
            }).text(data.resultInfo.statusText);
        }
    });
});