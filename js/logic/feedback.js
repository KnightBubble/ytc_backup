/*用户页面 -> mine.html*/
////userId从cookie中读取
var userId = UrlParm.parm("userId");
$(document).ready(function () {

    $("#feedbackBtn").click(function () {
        addFeedback();
    });
});

function addFeedback() {
    var mobileNumber = $("#mobileNumber").val();
    var emailAddr = $("#emailAddr").val();
    var content = $("#content").val();

    if (mobileNumber == "" && emailAddr == "") {
        alert("手机号和邮箱不能同时为空");
        return;
    }
    if (content == "" || content.trim() == "") {
        alert("反馈内容不能为空");
        return;
    }
    if (mobileNumber != "" && !isMobile(mobileNumber)) {
        alert("手机号格式不正确");
        return;
    }
    if (emailAddr != "" && !isEmail(emailAddr)) {
        alert("邮箱格式不正确");
        return;
    }
    $.postJSON("/feedbacks/feedback", {
        "userId": userId,
        "mobileNumber": mobileNumber,
        "emailAddr": emailAddr,
        "content": content
    }, function (data) {
        location.href = "mine.html?r=" + Math.random();
    });
}
