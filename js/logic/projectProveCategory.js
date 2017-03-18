/*用户页面 -> projectAuditSchedule.html*/
var projectId = UrlParm.parm("projectId");

$(document).ready(function () {

    var unSelected = false;
    var projectType = UrlParm.parm("projectType");
    var projectCategory = UrlParm.parm("projectCategory");
    $("#btnSelected").click(function () {
        $(this).hide();
        //$("#btnUnSelected").show();
        unSelected = false;
    });

    var proveCheckStatus = "";
    $.postJSON("/projectProve/projectProveDetail", {
        "projectId": projectId
    }, function (data) {
        proveCheckStatus = data.checkStatus;
    });

    $("#personalAccount").click(function () {
        //-1审核资料未提交0审核申请中,1审核通过, 2未审核通过
        //alert("checkStatus="+proveCheckStatus);
        var nw = new Date();
        if (proveCheckStatus == "0" || proveCheckStatus == "1") {
            location.href = "projectProvePersonalStatic.html?projectId=" + projectId +
                "&projectType=" + projectType + "&projectCategory=" + projectCategory + "&s=" + nw.getTime() + "&r=" + Math.random();
        } else if (proveCheckStatus == "-1") {
            location.href = "projectProvePersonalNew.html?projectId=" + projectId +
                "&projectType=" + projectType + "&projectCategory=" + projectCategory + "&s=" + nw.getTime() + "&r=" + Math.random();
        } else {
            location.href = "projectProvePersonalModify.html?projectId=" + projectId +
                "&projectType=" + projectType + "&projectCategory=" + projectCategory + "&s=" + nw.getTime() + "&r=" + Math.random();
        }
    });

})

