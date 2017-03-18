/*用户页面 -> projectAuditSchedule.html*/

var projectId = UrlParm.parm("projectId");
//userId从cookie中读取
var userId = localStorage.getItem("user_id");
//var userId="4f70976f";
var isCert = false;
$(document).ready(function () {

    initShowProjectProves();

    $("#btnSelected").click(function () {
        var relationType = $("#relationType").val();
        var cause = $("#cause").val();
        var realName = "";
        var idCardNumber = "";
        if (!isCert) {
            realName = $("#realName").val();
            idCardNumber = $("#idCardNumber").val();
            if (realName == "" || realName.trim() == "") {
                alert("用户名不能为空");
                return;
            }
            if (idCardNumber == "" || idCardNumber.trim == "") {
                alert("身份证号不能为空");
                return;
            }
            if (!isIdCard(idCardNumber)) {
                alert("身份证号不能为空或者格式不正确");
                return;
            }
        }
        $.postJSON("/projectProves/projectProves", {
            "projectId": projectId,
            "proverId": userId,
            "relationType": relationType,
            "cause": cause,
            "realName": realName,
            "idCardNumber": idCardNumber
        }, function (data) {
            //alert("success");
            location.href = "projectDetail.html?projectId=" + projectId + "&r=" + Math.random();
        });
    });

});

function initShowProjectProves() {
    $.postJSON("/certifications/getCertByUserId", {
        "userId": userId
    }, function (data) {
        if (data != null) {
            isCert = true;
            $("#realName").css("display", "none");
            $("#idCardNumber").css("display", "none");
        }
    })
}
