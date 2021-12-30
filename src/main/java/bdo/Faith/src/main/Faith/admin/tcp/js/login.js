$(document).ready(function() {
    sessionStorage.clear();
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
    let promise = getData('/tcp/getClientInfo.do');
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
            let formData = {
                fromDomain: $(':input[name="fromDomain"]').val(),
                systemId: $(':input[name="systemId"]').val(),
                method: $(':input[name="fromDomain"]').val(),
                loginUrl: $(':input[name="loginUrl"]').val(),
                loginType: $(':input[name="loginType"]').val(),
                chrome: $(':input[name="chrome"]').val(),
                ueserLoginId: $(':input[name="ueserLoginId"]').val(),
                pwd: $(':input[name="pwd"]').val()
            };
            let p = getData(loginUrl, formData);
            p.then(data => {
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
                window.location.href = '/tcp/main.do';
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