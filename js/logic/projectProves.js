/*用户页面 -> projectAuditSchedule.html*/

var projectId = UrlParm.parm("projectId");
var portraitImgUrl = UrlParm.parm("portraitImgUrl");
var title = UrlParm.parm("title");
var projectStatus = UrlParm.parm("status");
var provesArray = new Array();////一维数组 0 offset 1 支持者总数 2向下位置 3向上位置
var offsetProves = 1; //////TA的支持者
var limitProves = 5;

//userId从cookie中读取
var userId = localStorage.getItem("user_id");
//var userId="4f70976f";
$(document).ready(function () {
    $("#projectStatus").text(projectStatus);
    $("#portraitImgUrl").attr("src", portraitImgUrl);
    $("#title").text(title);
    //$("#btnSelected").click(function(){
    //    var relationType=$("#relationType").val();
    //    var cause=$("#cause").val();
    //    $.postJSON("/projectProves/projectProves",{
    //        "projectId": projectId,
    //        "proverId":userId,
    //        "relationType":relationType,
    //        "cause":cause
    //    }, function (data) {
    //        //alert("success");
    //        location.href="projectDetail.html?projectId="+projectId + "&r=" + Math.random();
    //    });
    //});

    $.postJSON("/projectProves/projectProvesVoPage", {
        "projectId": projectId,
        "offset": offsetProves,
        "limit": limitProves
    }, function (data) {
        //alert(data.totalCount);
        //alert(data.pageData);
        var totCnt = data.totalCount;
        $("#provesCnt").text(totCnt);

        for (var i = 1; i <= data.pageData.length; i++) {
            var vo = data.pageData[i - 1];
            var relationType = "亲人"; //////vo.relationType=0
            if (vo.relationType == "1") {
                relationType = "朋友";
            } else if (vo.relationType == "4") {
                relationType = "志愿者";
            }
            var dtl = "<li id='proves_li_" + i + "'><div class='bd'><div class='pic'><img src='" + vo.portraitImgUrl + "'/></div>" +
                "<span class='h5'>" + vo.nickname + "</span> <cite class='color-white bg-orange2'>已实名</cite>" +
                //"<p class='color-gray9 m-top05'>"+vo.provePre+"前</p>"+
                "<p class='color-gray9 m-top05'>" + relationType + "</p>" +
                "<p class='color-gray3'>" + vo.cause + "</p></div></li>";
            $("#provesDetail").append(dtl);

        }
        //0 offset 1 支持者总数 2向下位置 3向上位置
        provesArray[0] = limitProves;
        provesArray[1] = totCnt;
        provesArray[2] = limitProves > totCnt ? totCnt : limitProves;//向下位置
        provesArray[3] = limitProves > totCnt ? totCnt : limitProves;//向上位置
        //
        if (limitProves > totCnt) {
            $("#downPage_proves").css("display", "none");
        } else {
            $("#downPage_proves").css("display", "block");
        }
    });

    $("#downPage_proves").click(projectId, function () {
        showNextProves(projectId);
    });
})

////一维数组 0 offset 1 支持者总数 2向下位置 3向上位置
function showNextProves(projectId) {
    var offset = provesArray[0];
    var cnt = provesArray[1];
    var showIdx = provesArray[2];
    if (offset < cnt && showIdx == offset) {
        $.postJSON("/projectProves/projectProvesVoPage", {
            "projectId": projectId,
            "offset": offset,
            "limit": limitProves
        }, function (data) {
            for (var i = 1; i <= data.pageData.length; i++) {
                var vo = data.pageData[i - 1];
                var relationType = "亲人"; //////vo.relationType=0
                if (vo.relationType == "1") {
                    relationType = "朋友";
                } else if (vo.relationType == "4") {
                    relationType = "志愿者";
                }
                var dtl = "<li id='proves_li_" + (offset + i) + "'><div class='bd'><div class='pic'><img src='" + vo.portraitImgUrl + "'/></div>" +
                    "<span class='h5'>" + vo.nickname + "</span> <cite class='color-white bg-orange2'>已实名</cite>" +
                    //"<p class='color-gray9 m-top05'>"+vo.provePre+"前</p>"+
                    "<p class='color-gray9 m-top05'>" + relationType + "</p>" +
                    "<p class='color-gray3'>" + vo.cause + "</p></div></li>";
                $("#provesDetail").append(dtl);
            }
            provesArray[0] = offset + limitProves;
            provesArray[2] = offset + limitProves > cnt ? cnt : offset + limitProves;
            if ((offset + limitProves) >= cnt) {
                $("#downPage_proves").css("display", "none");
            } else {
                $("#downPage_proves").css("display", "block");
            }
        });
    } else {
        var len = showIdx + limitProves > cnt ? cnt : showIdx + limitProves;
        for (var i = showIdx + 1; i <= len; i++) {
            $("#proves_li_" + i).css("display", "block");
        }
        if (len < cnt) {
            $("#downPage_proves").css("display", "block");
        } else {
            $("#downPage_proves").css("display", "none");
        }
        provesArray[2] = len;
    }
}

