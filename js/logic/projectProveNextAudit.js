/*用户页面 -> projectComplain.html*/

$(document).ready(function () {
    var projectId = UrlParm.parm("projectId");
    var proveCheckStatus = UrlParm.parm("proveCheckStatus");

    $.postJSON("/projectProve/projectProveNextVo", {
        "projectId": projectId
    }, function (data) {
        if (data != null) {
            var info = data.infoitemsMap["000001"];
            $("#hospitalName").val(info.infoitemValue);
            var mat = data.materialsMap["0002"];
            var matPath = mat.materialPath.split(",");
            for (var i = 0; i < matPath.length; i++) {
                var nw = new Date().getMilliseconds();
                var imgDiv = '<div id="addDiagnosisDiv_"' + nw + "_" + i + '" class="photoDiv"><img src="' + matPath[i] + '" />';

                if (proveCheckStatus == "-1" || proveCheckStatus == "2") {
                    imgDiv += '<span></span><i onclick="deleteImg(\'addDiagnosisDiv_"' + nw + "_" + i + '\')">x</i>';
                }
                imgDiv += '</div>';
                $("#addDiagnosisDiv").before(imgDiv);
            }

            if (proveCheckStatus == "-1" || proveCheckStatus == "2") {
                $("#addDiagnosisDiv").css("display", "none");
                $("#hospitalName").attr("disabled", "disabled");
                $("#proveNextAuditBtn").attr("type", "hidden");
            }
        }
    });

    $("#chooseDiagnosisImg").click(function () {
        chooseImgs("addDiagnosisDiv");
    });
    $("#proveNextAuditBtn").click(function () {
        var hospitalName = $("#hospitalName").val();
        if (isEmpty(hospitalName)) {
            alert("医院名称是必填内容");
            return;
        }

        var localIds = new Array();
        $("#diagnosisImg>.photoDiv>img").each(function () {
            localIds.push($(this).attr("src"));
        });
        if (localIds.length == 0) {
            alert("医疗诊断结果必填");
            return;
        }

        var mediaIds = new Array();
        uploadImgToWX(localIds, mediaIds, function () {
            var infoitemsJson = '[{"infoitemCode":"000001","infoitemValue":"' + hospitalName + '"}]';
            var materialsJson = '[{"materialCode":"0002","materialPath":"' + mediaIds.join(",") + '"}]';
            $.postJSON("/projectProve/projectProveNextAudit", {
                "projectId": projectId,
                "infoitemsJson": infoitemsJson,
                "materialsJson": materialsJson
            }, function (data) {
                //跳转到验证成功页
                location.href = "projectProveSubmitComplete.html?projectId=" + projectId + "&r=" + Math.random();
            });
        });
    });

})