/*用户页面 -> projectComplain.html*/

$(document).ready(function () {
    var projectId = UrlParm.parm("projectId");

    $("#chooseImg").click(function () {
        chooseImgs("chooseDiv");
    });
    $("#reportBtn").click(function () {
        var cause = $("#cause").val();
        if (isEmpty(cause)) {
            alert("举报原因不能为空");
            return;
        }

        var localIds = new Array();
        $("#reportImgDiv>.photoDiv>img").each(function () {
            localIds.push($(this).attr("src"));
        });
        var mediaIds = new Array();
        uploadImgToWX(localIds, mediaIds, function () {

            $.postJSON("/projectComplain/projectComplain", {
                "projectId": projectId,
                "complainerId": localStorage.getItem("user_id"),
                "cause": cause,
                "mediaIds": mediaIds.join(",")
            }, function (data) {
                //跳转到举报成功页
                location.href = "projectComplainSuccess.html?projectId=" + projectId + "&r=" + Math.random();
            });
        });
    });

})