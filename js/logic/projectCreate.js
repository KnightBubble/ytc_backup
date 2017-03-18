/*用户页面 -> projectAuditSchedule.html*/

$(document).ready(function () {
///从cookie中读取
    var userId = localStorage.getItem("user_id");
    var unSelected = false;
    var reg = /^\+?(\d+(\.\d{1,2})?)$/;
    $("#btnSelected").click(function () {
        //$(this).hide();
        //$("#btnUnSelected").show();
        unSelected = false;
    });

    //$("#btnUnSelected").click(function () {
    //    $(this).hide();
    //    $("#btnSelected").show();
    //    unSelected = true;
    //});
    //$("div.content > div.btn > button").click(function(){

    $("#nextStepID").click(function () {
        nextStap();
    });
    $("#chooseImg").click(function () {
        chooseImgs("chooseDiv");
    });

    $("#submit").click(function () {
        if (unSelected) {
            //alert("select ");
            return;
        }
        var collectGoalAmount = $("#fund").val();
        if (!isAmount(collectGoalAmount)) {
            alert("请输入筹款资金, 筹款资金最多保留2位小数,资金必须大于0。");
            return;
        }
        collectGoalAmount = Number(collectGoalAmount) * AMOUNT_RATE; //单位：毫厘
        var purpose = $("#purpose").val();
        var title = $("#title").val();
        var collectEndTsStr = $("#collectEndTsStr").text();
        var detailInformation = $("#contents").val();

        if (isEmpty(purpose)) {
            alert("筹款用途不能为空");
            return;
        }
        if (isEmpty(title)) {
            alert("筹款项目标题不能为空");
            return;
        }
        if (isEmpty(detailInformation)) {
            alert("筹款项目详情不能为空");
            return;
        }

        var localIds = new Array();
        $("#projectImgs>.photoDiv>img").each(function () {
            localIds.push($(this).attr("src"));
        });

        if (localIds.length <= 0) {
            alert("项目图片至少要上传1张");
            return;
        }
        if (localIds.length > 8) {
            alert("上传的图片不能超过8张");
            return;
        }
        var mediaIds = new Array();
        uploadImgToWX(localIds, mediaIds, function () {
            $.postJSON("/projects/project", {
                "projectType": "2",
                "projectCategory": "2_1",
                "purpose": purpose,
                "collectGoalAmount": collectGoalAmount,
                "title": title,
                "detailInformation": detailInformation,
                "collectEndTsStr": collectEndTsStr,
                "userId": userId,
                "mediaIds": mediaIds.join(",")
            }, function (data) {
                location.href = "projectCreateComplete.html?projectId=" + data.projectId + "&r=" + Math.random();
            });

        });


    });


})

function nextStap() {
    var collectGoalAmount = parseInt($("#fund").val()) * AMOUNT_RATE;
    var purpose = $("#purpose").val();
    var title = $("#title").val();
    var collectEndTsStr = $("#collectEndTsStr").val();
    var detailInformation = $("#contents").val();

    var options = "collectGoalAmount=" + collectGoalAmount + "&purpose=" + purpose + "&title=" + title +
        "&collectEndTsStr=" + collectEndTsStr + "&detailInformation=" + detailInformation;
    location.href = "projectProveCategory.html?" + options + "&r=" + Math.random();
}
