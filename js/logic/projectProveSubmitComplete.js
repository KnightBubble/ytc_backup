/*用户页面 -> projectAuditSchedule.html*/

$(document).ready(function () {
    var projectId = UrlParm.parm("projectId");
    $("#returnProject").click(function () {
        location.href = "projectDetail.html?projectId=" + projectId + "&r=" + Math.random();
    });
});

