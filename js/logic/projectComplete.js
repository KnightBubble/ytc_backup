/*用户页面 -> projectAuditSchedule.html*/

$(document).ready(function () {

    var projectId = UrlParm.parm("projectId");
    $.postJSON("/projectProve/projectProveDetail", {
        "projectId": projectId
    }, function (data) {
        if (data.checkStatus != -1) {
            $("#yanzhengTip").css("display", "none");
        }
    });

    $("#chakan").click(function () {
        location.href = "projectDetail.html?projectId=" + projectId + "&r=" + Math.random();
    });


})

