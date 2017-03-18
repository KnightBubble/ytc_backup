
$(document).ready(function () {

    var userId = UrlParm.parm("userId");
    var openId = UrlParm.parm("openId");

    localStorage.setItem("user_id", userId);
    localStorage.setItem("open_id", openId);

    $("#mobileNext").click(function () {
        var tel = $("#tel").val();
        if (!isMobile(tel)) {
            alert("请输入合法的手机号");
            return;
        }
        //发送验证码
        //0-手机号验证 1-忘记密码 2-注册
        sendSms(tel, userId, 0, function () {
            location.href = "mobileValidate.html?tel=" + tel + "&url=" + UrlParm.parm("url") + "&r=" + Math.random();
        });
    });

});
