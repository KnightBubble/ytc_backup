/*用户页面 -> projectAuditSchedule.html*/

$(document).ready(function () {

    ///从cookie中读取
    var userId = localStorage.getItem("user_id");
    var projectId = UrlParm.parm("projectId");
    //var projectId="7506c609-f6f5-4336-bf6c-27aee97cf7fe";
    var collectEndTsOld = UrlParm.parm("collectEndTs");
    $("#collectEndTsStr").text(collectEndTsOld);

    $("#saveCollectTm").click(function () {
        var collStr = $("#collectEndTsStr").text();
        if (isEmpty(collStr)) {
            alert("结束时间不能为空");
            return;
        }
        $.postJSON("/projects/projectEndTime", {
            "projectId": projectId,
            "collectEndTsStr": collStr
        }, function (data) {
            location.href = "projectDetail.html?projectId=" + projectId + "&r=" + Math.random();
        });
    });


})
