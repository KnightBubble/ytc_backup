$(document).ready(function () {

    $("#amount").text($(".box ul>li.cur").text().replace("元", ""));

    $(".box ul>li").click(function () {
        $(this).addClass("cur").siblings().removeClass("cur");
        $("#otherAmount").val("");
        $("#amount").text($(this).text().replace("元", ""));
    });

    $("#otherAmount").bind('input propertychange', function () {
        $(".box ul>li").removeClass("cur");
        $("#amount").text($(this).val());
    });


    var planId = UrlParm.parm("planId");
    var userId = UrlParm.parm("crUserId");
    var operatorId = localStorage.getItem("user_id");


    $.postJSON("/userBalance/queryMyUserBalanceVo", {
        "userId": userId,
        "planId": planId
    }, function (data) {
        $("#planName").text(data.plan.planName);
        $("#realName").text(data.certifications.realName);
        $("#addDateStr").text(data.addDateStr);
        $("#balance").text(parseFloat(data.balance) / AMOUNT_RATE);//单位：元
        $("#statusName").text(data.statusName);
    });

    var isClick = false;

    $("#planRePay").click(function () {
        if(!isClick) {
            isClick = true;
            var amount = $("#amount").text();
            if (!isAmount(amount) && $("#amountUl > li.cur").size() == 0) {
                alert("请输入支付金额, 支付金额最多保留2位小数。");
                return;
            }

            localStorage.setItem("plan_name_" + planId, $("#planName").text());

            $.postJSON("/plans/planPay", {
                "planId": planId,
                "userId": userId,
                "operatorId": operatorId,
                "totalFee": amount * AMOUNT_RATE, //单位:毫厘
                "openId": localStorage.getItem("open_id")
            }, function (data) {
                wx.chooseWXPay({
                    timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.paySign, // 支付签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        if (res.errMsg == "chooseWXPay:ok") {
                            //支付成功
                            var name = localStorage.getItem("plan_name_" + planId);
                            localStorage.removeItem("plan_name_" + planId);
                            location.href = "../../planPaySuccess.html?planId=" + planId + "&planName=" + name + "&allName=" + "&r=" + Math.random();
                            //location.href = "../../okpage.html?planId=" + planId + "&planNames=" + $("#planName").text() + "&userId=" + operatorId + "&r=" + Math.random();
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
                    }
                });
                isClick = false;
            });
        }
        //alert(userJson);
    });

});