/*用户页面 -> userSet.html*/

$(document).ready(function () {

    var isClick = false;

    $("#subscribe").click(function () {
        if(isClick) {
            return;
        }
        isClick = true;
        var openId = localStorage.getItem("open_id");
        var userId = localStorage.getItem("user_id");

        if (openId && userId) {
            localStorage.setItem("open_id", openId);
            localStorage.setItem("user_id", userId);
        } else {
            redirect();
            return;
        }

        var subscribe = $("#subscribeNum").val();
        if (!isAmount(subscribe)) {
            alert("请输入支付金额, 支付金额最多保留2位小数。");
            return;
        }

        var projectId = UrlParm.parm("projectId");
        $.postJSON("/projectSubscribe/projectSubscribe", {
            "openId": openId,
            "userId": userId,
            "projectId": projectId,
            "supportAmount": Number(subscribe) * AMOUNT_RATE, //单位：毫厘
            "message": $("#message").val()
        }, function (data) {
            isClick = true;
            wx.chooseWXPay({
                timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.paySign, // 支付签名
                success: function (res) {
                    isClick = false;
                    // 支付成功后的回调函数
                    if (res.errMsg == "chooseWXPay:ok") {
                        //支付成功
                        location.href = "../../projectSubscribeSuccess.html?projectId=" + projectId + "&r=" + Math.random();
                        //alert($.stringify(res));
                    } else {
                        //alert(res.errMsg);
                    }
                },
                cancel: function (res) {
                    //alert(res+"*");
                    //支付取消
                    isClick = false;
                },
                error: function (res) {
                    //alert(res+"-");
                    isClick = false;
                }
            });
        });

    });

})
