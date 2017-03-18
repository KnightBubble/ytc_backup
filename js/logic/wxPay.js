/*用户页面 -> userSet.html*/

$(document).ready(function () {

    var redirect = function () {
        $.postJSON("/wx/redirect",
            {
                "openId": localStorage.getItem("open_id") || "",
                "reUrl": location.href
            },
            function (data) {
                if (data.url != "") {
                    $(window.location).attr('href', data.url);
                }
            }
        );
    };

    var reg = /^\+?(\d+(\.\d{1,2})?)$/;
    /**
     * 微信支付
     */
    $("#subscribe").click(function () {
        var openId = localStorage.getItem("open_id");
        if (!openId) {
            redirect();
        }

        var subscribe = $("#subscribeNum").val();
        if (isNaN(subscribe) || !reg.test(subscribe)) {
            alert("请输入支付金额, 支付金额最多保留2位小数。");
            return;
        }

        $.myGetJSON("/wx/pay",
            {
                "openId": openId,
                "totalFee": subscribe * 100
            },
            function (data) {
                //wxJSSDK.payApi({
                //chooseWXPay:{
                wx.chooseWXPay({
                    timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.paySign, // 支付签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        if (res.errMsg == "chooseWXPay:ok") {
                            //alert("aaaaaaaaaaa");
                            //支付成功
                            //alert($.parseJSON(res));
                        } else {
                            //alert(res.errMsg);
                        }
                    },
                    cancel: function (res) {
                        //alert(res+"*");
                        //支付取消
                    },
                    error: function (res) {
                        //alert(res+"-");
                    },
                    fail: function (res) {
                        //alert($.parseJSON(res));
                    }
                });
                //});
            }
        );
    });

})
