/*用户页面 -> projectAuditSchedule.html*/

///从cookie中读取
var userId = localStorage.getItem("user_id");
var projectId = UrlParm.parm("projectId");
var collectEndTs = UrlParm.parm("collectEndTs");
$(document).ready(function () {

    var unSelected = false;

    //$("#btnSelected").click(function () {
    //    $(this).hide();
    //    //$("#btnUnSelected").show();
    //    unSelected = false;
    //});


    //var projectId="7506c609-f6f5-4336-bf6c-27aee97cf7fe";
    if (projectId != null && projectId != undefined) {
        ///////从数据库中拿数据 并赋值到相应输入框
        $.postJSON("/projects/projectDetail", {
            "projectId": projectId
        }, function (data) {
            $("#fund").val(data.collectGoalAmount / AMOUNT_RATE);//单位：元
            $("#purpose").val(data.purpose);
            $("#title").val(data.title);
            var collectEndTs = new Date(data.collectEndTs).Format("yyyy-MM-dd HH:mm");
            $("#collectEndTsStr").text(collectEndTs);
            $("#collectEndTs").val(data.collectEndTs);
            $("#contents").val(data.detailInformation);

            var paths = data.images.split(",");
            var nw = new Date().getMilliseconds();
            for (var n = 0; n < paths.length; n++) {
                var img = '<div id="chooseDiv' + '_' + nw + '_' + n + '" class="photoDiv"><img src="' + paths[n] + '" />';
                img += '<span></span><i onclick="deleteImg(\'chooseDiv' + '_' + nw + '_' + n + '\')">x</i></div>';
                $("#chooseDiv").before(img);
            }
        });
    }

    $("#chooseImg").click(function () {
        chooseImgs("chooseDiv");
    });


    //$("div.content > div.btn > button").click(function(){
    $("#submit").click(function () {

        //if(unSelected) {
        //    //alert("select ");
        //    return;
        //}
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
            $.postJSON("/projects/project/" + projectId, {
                "purpose": purpose,
                "collectGoalAmount": collectGoalAmount,
                "title": title,
                "detailInformation": detailInformation,
                "collectEndTsStr": collectEndTsStr,
                "userId": userId,
                "mediaIds": mediaIds.join(",")
            }, function (data) {
                location.href = "projectEditComplete.html?projectId=" + projectId + "&r=" + Math.random();
            });

        });

    });

});
