/*用户页面 -> projectAuditSchedule.html*/

$(document).ready(function () {

    ///从cookie中读取
    var userId = localStorage.getItem("user_id");
    var projectId = UrlParm.parm("projectId");

    $("#chooseImg").click(function () {
        chooseImgs("chooseDiv");
    });

    $("#btnSelected").click(function () {
        var localIds = new Array();
        $("#imgDiv>.photoDiv>img").each(function () {
            localIds.push($(this).attr("src"));
        });

        var mediaIds = new Array();
        uploadImgToWX(localIds, mediaIds, function () {
            $.postJSON("/projectProgress/projectProgress", {
                "projectId": projectId,
                "instruction": $("#instruction").val(),
                "progressImg": mediaIds.join(",")
            }, function (data) {
                location.href = "projectDetail.html?projectId=" + projectId + "&r=" + Math.random();
            });
        });

    });

})
