/*用户页面 -> projectAuditSchedule.html*/
var projectId = UrlParm.parm("projectId");
//userId从cookie中读取
var userId = localStorage.getItem("user_id");
$(document).ready(function () {

    var checkStatus = UrlParm.parm("projectId");
    $("#addCardBtn").click(function () {
        $.postJSON("/bankcardBind/bankcard", {
            "userId": userId,
            "bank": $("#bank").val(),
            "cardPersonName": $("#cardPersonName").val(),
            "cardNo": $("#cardNo").val()
        }, function (data) {
            location.href = "myCard.html" + "?r=" + Math.random();
        });
    });
});

