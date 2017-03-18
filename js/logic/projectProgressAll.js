/*用户页面 -> projectAuditSchedule.html*/

var projectId = UrlParm.parm("projectId");
var userId = localStorage.getItem("user_id");
var offsetProgress = 1;//所有的offset都是从1开始的，如果从0 分页查询第二页的时候查不出来数据
//var limitProgress=5;
var limitReplies = 5;
var repliesArray = new Array();  ////二维数组 0 动态ID 1该动态offset 2该动态回复总数 3向下位置 4向上位置
$(document).ready(function () {

////// 众筹动态列表

    projectProgressAllPage();

    $("#downPage_progress").click(function () {
        projectProgressAllPage();
    });

    /////////评论
    $("#cancelReply").click(function () {
        $(".theme-popover-mask").hide();
        $(".boxin").hide();
        $("#contentReply").val("");
    });


    $("#reply").click(function () {
        var progId = $("#progId").val();
        $.postJSON("/progressReplies/replies", {
            "projectId": $("#projectId").val(),
            "progressId": progId,
            "memberId": userId,
            "content": $("#contentReply").val(),
            "offset": 1,
            "limit": limitReplies
        }, function (data) {
            //关闭弹出层
            $("#cancelReply").click();
            /////以下是调用分页查询 倒叙显示最新评论
            var idx = getRepliesShowInfo(progId);
            initShowReplies(data.totalCount, data.pageData, idx, progId);
        });
    });
});
function projectProgressAllPage() {
    $.postJSON("/projectProgress/allProjectProgressAndRepliesPage", {
        "offset": offsetProgress,
        "limit": limitReplies
    }, function (data) {

        $("#progressCnt").text(data.totalCount);
        //alert(data.totalCount);
        var replyCnt = 0;
        for (var i = 0; i < data.pageData.length; i++) {
            var vo = data.pageData[i];
            var prg = '<div onclick="toProjectDetail(\'' + vo.projectId + '\')" class="bd" id="progress_' + vo.progressId + '"><div class="pic"><img src="' + vo.portraitImgUrl + '"/></div>' +
                '<span class="h5">' + vo.nickname + ' </span> ';
            if (vo.progressType == 0) {
                prg += '<cite class="color-gray6">发布更新</cite>' +
                    '<p class="color-gray9 m-top05">' + vo.progressPre + '</p>' +
                    '<p class="m-top10 color-gray9">' + vo.instruction + '</p>';
                if (vo.progressImg) {
                    prg += '<p>';
                    var imgs = vo.progressImg.split(",");
                    for (var j = 0; j < imgs.length; j++) {
                        prg += '<img src="' + imgs[j] + '" />';
                    }
                    prg += '</p>';
                }
                prg += '<i id="reply' + vo.progressId + '"class="iconfont color-orange2" style="top: 1.1rem;" ' +
                    'onclick="showReply(\'' + vo.progressId + '\', \'' + vo.projectId + '\');">' +
                    '&#xe60c;</i></div>';
            }
            if (vo.progressType == 1) {
                //alert(vo.instruction);目标金额：||35.0元||资金用途：||而特
                var inst = (vo.instruction).split("||");
                prg += '<cite class="color-gray6">发起筹款</cite>' +
                    '<p class="color-gray9 m-top05">' + vo.progressPre + '</p>' +
                    '<p class="m-top10 color-gray9">目标金额：<cite class="color-orange2 p">' +
                    inst[1].substr(0, inst[1].length - 1) + '</cite>元</p>' +
                    '<p class="color-gray9">资金用途：' + inst[3] + '</p>' +
                    '<i id="reply' + vo.progressId + '"class="iconfont color-orange2" style="top: 1.1rem;" ' +
                    'onclick="showReply(\'' + vo.progressId + '\', \'' + vo.projectId + '\');">' +
                    '&#xe60c;</i></div>';
            }
            if (vo.progressType == 2) {
                //alert(vo.instruction);"修改目标金额：||"+(oldGoalAmount/AMOUNT_RATE)+"元改为"+(collectGoalAmount/AMOUNT_RATE)+"元"
                //inst+="||修改金额原因：||"+reason;
                var inst = (vo.instruction).split("||");
                var inst2 = inst[1].split("元改为");
                prg += '<cite class="color-gray6">修改目标金额</cite>' +
                    '<p class="color-gray9 m-top05">' + vo.progressPre + '</p>' +
                    '<p class="m-top10 color-gray9"><cite class="color-orange2 p">' +
                    inst2[0] + '</cite>元改为<cite class="color-orange2 p">' +
                    inst2[1].substr(0, inst2[1].length - 1) + '</cite>元</p>' +
                    '<p class="color-gray9">修改金额原因：' + inst[3] + '</p>' +
                    '<i id="reply' + vo.progressId + '"class="iconfont color-orange2" style="top: 1.1rem;" ' +
                    'onclick="showReply(\'' + vo.progressId + '\', \'' + vo.projectId + '\');">' +
                    '&#xe60c;</i></div>';
            }
            if (vo.progressType == 3) {
                //SimpleDateFormat ft=new SimpleDateFormat("yyyy-MM-dd HH:mm");
                //String inst="修改结束时间：||"+ft.format(oldEndTs)+"改为"+ft.format(endTs);
                var inst = (vo.instruction).split("||")[1].split("改为");
                prg += '<cite class="color-gray6">修改结束时间</cite>' +
                    '<p class="color-gray9 m-top05">' + vo.progressPre + '</p>' +
                    '<p class="m-top10 color-gray9"><cite class="color-orange2 p">' +
                    inst[0] + '</cite>改为<cite class="color-orange2 p">' +
                    inst[1] + '</cite></p>' +
                    '<i id="reply' + vo.progressId + '"class="iconfont color-orange2" style="top: 1.1rem;" ' +
                    'onclick="showReply(\'' + vo.progressId + '\', \'' + vo.projectId + '\');">' +
                    '&#xe60c;</i></div>';
            }
            $("#nextProgress").before(prg);

            ///对该动态的评论分页列表
            var repliesCnt = vo.repliesPage.totalCount;
            if (repliesCnt > 0) {
                var replies = vo.repliesPage.pageData;
                repliesArray[replyCnt] = new Array();
                //0 动态ID 1该动态offset 2该动态回复总数 3向下位置 4向上位置
                repliesArray[replyCnt][0] = vo.progressId;
                repliesArray[replyCnt][1] = limitReplies;
                repliesArray[replyCnt][2] = repliesCnt;
                repliesArray[replyCnt][3] = limitReplies > repliesCnt ? repliesCnt : limitReplies;//向下位置
                repliesArray[replyCnt][4] = limitReplies > repliesCnt ? repliesCnt : limitReplies;//向上位置
                //alert(repliesArray[i][0]+"  "+repliesArray[i][1]+"  "+repliesArray[i][2]+"  "+repliesArray[i][3]);
                var repliesDiv = '<div class="contxt bg-gray m-top20" id="pinglun_div_' + vo.progressId + '"><span class="triangle-up"></span>' +
                    '<ul id="pinglun' + vo.progressId + '">';
                for (var m = 1; m <= replies.length; m++) {
                    var reply = replies[m - 1];
                    var content = reply.content.split("@");
                    if (content.length == 1) {
                        repliesDiv += '<li id="' + vo.progressId + '_' + m + '"><span class="color-blue">' + reply.nickname + '：</span>' + content[0] + '</li>';
                    } else {
                        repliesDiv += '<li id="' + vo.progressId + '_' + m + '"><span class="color-blue">' + reply.nickname + '</span>回复<span class="color-blue">' +
                            content[1] + '</span>' + content[0] + '</li>';
                    }
                }
                if (limitReplies < repliesCnt) {
                    repliesDiv += '</ul><a id="upPage' + '_' + vo.progressId + '" href="javascript:showPreReplies(\'' + reply.progressId + '\');"' +
                        ' class="color-gray9 m-top10" style="display: none; text-align: center;">︽</a>';
                    repliesDiv += '<a id="downPage' + '_' + vo.progressId + '" href="javascript:showNextReplies(\'' + reply.progressId + '\');"' +
                        ' class="color-gray9 m-top10" style="display: block; text-align: center;">︾</a></div>';

                }
                ///只能翻到第一页 不能全部隐藏
                //else{
                //    repliesDiv+='</ul><a id="upPage'+'_'+vo.progressId+'" href="javascript:showPreReplies(\''+reply.progressId+'\');"' +
                //        ' class="color-gray9 m-top10" style="display: block; text-align: center;">︽</a>';
                //    repliesDiv+='<a id="downPage'+'_'+vo.progressId+'" href="javascript:showNextReplies(\''+reply.progressId+'\');"' +
                //        ' class="color-gray9 m-top10" style="display: block; text-align: center;">︾</a></div>';
                //}
                $("#progress_" + vo.progressId).append(repliesDiv);
                replyCnt++;
            }
        }

        offsetProgress += limitReplies;
        if (offsetProgress > data.totalCount) {
            $("#downPage_progress").css("display", "none");
        }
    });
}
function initShowReplies(repliesCnt, replies, idx, progressId) {
    ///对该动态的评论分页列表
    if (repliesCnt > 0) {
        repliesArray[idx] = new Array();
        //0 动态ID 1该动态offset 2该动态回复总数 3向下位置 4向上位置
        repliesArray[idx][0] = progressId;
        repliesArray[idx][1] = limitReplies;
        repliesArray[idx][2] = repliesCnt;
        repliesArray[idx][3] = limitReplies > repliesCnt ? repliesCnt : limitReplies;//向下位置
        repliesArray[idx][4] = limitReplies > repliesCnt ? repliesCnt : limitReplies;//向上位置
        //alert(repliesArray[i][0]+"  "+repliesArray[i][1]+"  "+repliesArray[i][2]+"  "+repliesArray[i][3]);
        $("#pinglun_div_" + progressId).remove();
        var repliesDiv = '<div class="contxt bg-gray m-top20" id="pinglun_div_' + progressId + '"><span class="triangle-up"></span>' +
            '<ul id="pinglun' + progressId + '">';
        for (var m = 1; m <= replies.length; m++) {
            var reply = replies[m - 1];
            var content = reply.content.split("@");
            if (content.length == 1) {
                repliesDiv += '<li id="' + progressId + '_' + m + '"><span class="color-blue">' + reply.nickname + '：</span>' + content[0] + '</li>';
            } else {
                repliesDiv += '<li id="' + progressId + '_' + m + '"><span class="color-blue">' + reply.nickname + '</span>回复<span class="color-blue">' +
                    content[1] + '</span>' + content[0] + '</li>';
            }
        }
        if (limitReplies < repliesCnt) {
            repliesDiv += '</ul><a id="upPage' + '_' + progressId + '" href="javascript:showPreReplies(\'' + progressId + '\');"' +
                ' class="color-gray9 m-top10" style="display: none; text-align: center;">︽</a>';
            repliesDiv += '<a id="downPage' + '_' + progressId + '" href="javascript:showNextReplies(\'' + progressId + '\');"' +
                ' class="color-gray9 m-top10" style="display: block; text-align: center;">︾</a></div>';

        }
        $("#progress_" + progressId).append(repliesDiv);
    }
}

function showReply(progId, projectId) {
    //alert(prog.id);
    //var parent = $("#reply" + progId).parent();
    //parent.unbind("click"); //移除click
    $("#progId").val(progId);
    $("#projectId").val(projectId);
    $(".theme-popover-mask").show();
    $("#replyDiv").show();
    /*parent.click(function () {
        toProjectDetail(projectId);
    });*/
}

//showNextReplies
////0 动态ID 1该动态offset 2该动态回复总数 3向下位置 4向上位置
function getRepliesShowInfo(progressId) {
    for (var i = 0; i < repliesArray.length; i++) {
        if (repliesArray[i][0] == progressId) {
            return i;
        }
    }
}

//upPage downPage
//0 动态ID 1该动态offset 2该动态回复总数 3向下位置 4向上位置
function showNextReplies(progressId) {
    var idx = getRepliesShowInfo(progressId);
    var offset = repliesArray[idx][1];
    var cnt = repliesArray[idx][2];
    var showIdx = repliesArray[idx][3];
    if (offset < cnt && showIdx == offset) {
        $.postJSON("/progressReplies/progressRepliesVoPage", {
            "progressId": progressId,
            "offset": offset,
            "limit": limitReplies
        }, function (data) {
            var replies = data.pageData;
            for (var m = 1; m <= replies.length; m++) {
                var reply = replies[m - 1];
                var content = reply.content.split("@");
                var repliesDiv = "";
                if (content.length == 1) {
                    repliesDiv = '<li id="' + progressId + '_' + (offset + m) + '" style="display:block;"><span class="color-blue">' + reply.nickname + '：</span>' + content[0] + '</li>';
                } else {
                    repliesDiv = '<li id="' + progressId + '_' + (offset + m) + '" style="display:block;"><span class="color-blue">' + reply.nickname + '</span>回复<span class="color-blue">' +
                        content[1] + '</span>' + content[0] + '</li>';
                }
                $("#pinglun" + progressId).append(repliesDiv);
            }
            repliesArray[idx][1] = offset + limitReplies;
            repliesArray[idx][3] = offset + limitReplies > cnt ? cnt : offset + limitReplies;

            if ((offset + limitReplies) >= cnt) {
                $("#upPage" + "_" + progressId).css("display", "block");
                $("#downPage" + "_" + progressId).css("display", "none");
            } else {
                $("#upPage" + "_" + progressId).css("display", "block");
                $("#downPage" + "_" + progressId).css("display", "block");
            }
        });
    } else {
        var len = showIdx + limitReplies > cnt ? cnt : showIdx + limitReplies;
        for (var i = showIdx + 1; i <= len; i++) {
            $("#" + progressId + "_" + i).css("display", "block");
        }
        if (len < cnt) {
            $("#upPage" + "_" + progressId).css("display", "block");
            $("#downPage" + "_" + progressId).css("display", "block");
        } else {
            $("#upPage" + "_" + progressId).css("display", "block");
            $("#downPage" + "_" + progressId).css("display", "none");
        }
        repliesArray[idx][3] = len;
    }
    //grogId
}

function toProjectDetail(projectId) {
    location.href = "projectDetail.html?projectId=" + projectId + "&r=" + Math.random();
}

function showPreReplies(progressId) {
    var idx = getRepliesShowInfo(progressId);
    var upIdx = repliesArray[idx][4];
    var showIdx = repliesArray[idx][3];
    //0 动态ID 1该动态offset 2该动态回复总数 3向下位置 4向上位置
    for (var i = upIdx + 1; i <= showIdx; i++) {
        $("#" + progressId + "_" + i).css("display", "none");
    }
    repliesArray[idx][3] = upIdx;
    $("#upPage" + "_" + progressId).css("display", "none");
    $("#downPage" + "_" + progressId).css("display", "block");

}
