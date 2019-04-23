var timeoutSet = "60000",
    canSend = true,
    // pubilcUrl = "http://demo.jixinghai.com/xiaobaidaojia/public/index.php",
    pubilcUrl = "https://o2o.114yun.net/sysAdmin",
    passWordRegex = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/,
    hanzi = /^[\u4e00-\u9fa5]+$/,
    telRegex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
    idRegex_18 = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;


function openWindow(_url, _id, _data, _isNeedClose) {
    $("input").blur();
    if (_isNeedClose) {
        plus.webview.close(_id);
    }
    mui.openWindow({
        url: _url,
        id: _id,
        extras: _data
    })
    $(".button-fix").css("top", document.documentElement.clientHeight - 71 + 'px');//防止键盘打开跳转按钮错位
}

$(".button-fix").css("top", document.documentElement.clientHeight - 71 + 'px');

//	$(".button-fix").css("top",window.screen.height - 90 + 'px');
function doAjax(_api, _data, func, _type) {
    plus.nativeUI.showWaiting("加载中...");
//	console.log(_api + ":::" + JSON.stringify(_data) );
    mui.ajax(pubilcUrl + _api, {
        data: _data,
        dataType: 'json',
        type: _type || 'post',
        timeout: timeoutSet,
        success: function (result) {
            plus.nativeUI.closeWaiting();
//			console.log(_api + ":::" + JSON.stringify(result));
            if (result.status == "200" || result.status == "1" || result.status == "202" || (result.status == "402" && _api == "/company/order/createPayOrder")) {
                func(result.data, result.message, result.status);
            } else if (result.status == "402" && _api == "/company/companyAccount/login") {
                openWindow("../set/approval.html");
            } else {
                mui.toast(result.message);
            }
        },
        error: function (xhr, type, errorThrown) {
//			console.log(_api + ":::" + JSON.stringify(xhr) + "+" + type + "+" + errorThrown)
            plus.nativeUI.closeWaiting();
            if (type == "timeout") {
                mui.toast("服务器连接超时，请检查网络");
            } else {
                mui.toast("服务器处理错误");
            }
        }
    });
}

var UserInfo = {
    data: {},
    init: function () {
        var UserInfo = JSON.parse(localStorage.getItem("UserInfo")) || "";
        this.data = UserInfo;
    },
    saveData: function (data) {
        localStorage.setItem("UserInfo", JSON.stringify(data || ""));
        this.init();
    },
    removeData: function () {
        localStorage.removeItem("UserInfo");
    }
};
UserInfo.init();

function countDown(_count) {
    setTimeout(function () {
        $("#getCode small").html(_count + "s后重发");
        _count--;
        if (_count > 0) {
            countDown(_count);
        } else {
            canSend = true;
            $("#getCode small").html("重新发送");
        }
    }, 1000)
}

function areaData(_data) {
    var newData = [];
    for (var i = 0; i < _data.length; i++) {
        var item = _data[i];
        item.value = _data[i].id;
        item.text = _data[i].name;
        if (item.children && item.children.length > 0) {
            item.children = areaData(item.children);
        }
        newData.push(item);
    }
    return newData;
}