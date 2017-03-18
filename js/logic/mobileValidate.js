var userId = localStorage.getItem("user_id");

$(document).ready(function () {
    var key = UrlParm.parm("key");
    var tel = UrlParm.parm("tel");
    $("#tel").text("+86 " + tel);

    $("#validTel").click(function () {
        var smsCode = $("#smsCode").val();
        if (isEmpty(smsCode)) {
            alert("请输入合法的验证码");
            return;
        }

        $.postJSON("/mobile/validSmsCode", {
            "userId": userId,
            "smsCode": smsCode,
            "type": 0,//0-手机号验证 1-忘记密码 2-注册
            "mobile": tel
        }, function (data) {
            if (data.code == "SUCCESS") {
                //location.href = "mine.html?userId=" + userId + "&r=" + Math.random();
                if(key && key == 1) {
                    var urlKey = UrlParm.parm("url");
                    var url = localStorage.getItem(urlKey);
                    localStorage.removeItem(urlKey);
                    location.href = url;
                } else {
                    location.href = UrlParm.parm("url");
                }
            } else {
                alert("验证码不正确");
            }
        });

    });

    $("#reSendSms").click(function () {
        //发送验证码
        //0-手机号验证 1-忘记密码 2-注册
        sendSms(tel, userId, 0, function () {
            location.href = "mobileValidate.html?tel=" + tel + "&r=" + Math.random();
        });
    });

});

