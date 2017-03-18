/*用户页面 -> projectAuditSchedule.html*/
var projectId = UrlParm.parm("projectId");
//userId从cookie中读取
var userId = localStorage.getItem("user_id");
$(document).ready(function () {

    var checkStatus = UrlParm.parm("checkStatus");
    $("#addCardBtn").click(function () {
        $.postJSON("/bankcardBind/bankcard", {
            "userId": userId,
            "bank": $("#bank").val(),
            "cardPersonName": $("#cardPersonName").val(),
            "cardNo": $("#cardNo").val()
        }, function (data) {
            if (checkStatus == -1) {
                location.href = "projectProvePersonalNew.html?projectId=" + projectId + "&r=" + Math.random();
            } else {
                location.href = "projectProvePersonalModify.html?projectId=" + projectId + "&r=" + Math.random();
            }
        });
    });
});

