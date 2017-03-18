/*用户页面 -> projectAuditSchedule.html*/

var projectId = UrlParm.parm("projectId");
var userId = localStorage.getItem("user_id");
var offsetProgress = 1;//所有的offset都是从1开始的，如果从0 分页查询第二页的时候查不出来数据
var limitProgress = 5;
var limitReplies = 5;
var limitSubscribe = 3;
var repliesArray = new Array();  ////二维数组 0 动态ID 1该动态offset 2该动态回复总数 3向下位置 4向上位置
var subscribesArray = new Array();////一维数组  0 offset 1 支持者总数 2向下位置 3向上位置
var offsetSubscribe = 1; //////TA的支持者
var projectType = "";
var projectCategory = "";
var muji = 4;

$(document).ready(function () {

/////基本信息
    var projectUserId = "";
    $.postJSON("/projects/projectManagerIndex", {
        "projectId": projectId
    }, function (data) {
        $(document).attr("title", "【一同筹】" + data.title);
        $("#portraitImgUrl").attr("src", data.portraitImgUrl);
        $("#title").text(data.title);
        $("#nickname").text(data.nickname);
        $("#releasePre").text(data.releasePre);
        $("#releaseSuf").text(data.releaseSuf);
        $("#collectGoalAmount").text(data.collectGoalAmount / AMOUNT_RATE);
        $("#raiseAmount").text(data.raiseAmount / AMOUNT_RATE);//单位：元
        $("#supportCnt").text(data.supportCnt);
        $("#detailInformation").text(data.detailInformation.replace(/(\n)/g, "<br />"));
        projectUserId = data.userId;
        //alert(data.images);
        if (data.images != "") {
            var imgs = data.images.split(",");
            for (var im = 0; im < imgs.length; im++) {
                var img = '<li> <img src="' + imgs[im] + '"/> </li>';
                //alert(img);
                $("#imagesOl").append(img);
            }
        }

        $("#projectStatus").val(data.status);
        $("#projectStatusName").val(data.statusName);
        $("#collectEndTs").val(data.collectEndTs);
        var notSub = false;
        var alSub = false;
        if (data.certifications != null) {
            var certSpan = '<span><i class="iconfont color-orange2">&#xe61b;</i>证明资料已提交</span>';
            $("#alreadySub").append(certSpan);
            alSub = true;
        } else {
            var certSpan = '<span><i class="iconfont color-gray9">&#xe627;</i>证明资料未提交</span>';
            $("#noSub").append(certSpan);
            notSub = true;
        }

        if (data.projectMaterialsMap != null && data.projectMaterialsMap["0002"] != null) {
            var yiliaoSpan = '<span><i class="iconfont color-orange2">&#xe61b;</i>捐款用途资料已提交</span>';
            $("#alreadySub").append(yiliaoSpan);
            alSub = true;
        } else {
            var yiliaoSpan = '<span><i class="iconfont color-gray9">&#xe627;</i>捐款用途资料未提交</span>';
            $("#noSub").append(yiliaoSpan);
            notSub = true;
        }

        if (!alSub) {
            $("#asub").css("display", "none");
        }
        if (!notSub) {
            $("#nsub").css("display", "none");
        }

        if (data.userId == userId) {
            $("#manageDiv").css("display", "block");
            $("#reportDiv").css("display", "none");
        } else {
            $("#manageDiv").css("display", "none");
            $("#reportDiv").css("display", "block");
        }
        projectType = data.projectType;
        projectCategory = data.projectCategory;
        projectProgressPage(offsetProgress, data.nickname, data.portraitImgUrl);
    });

/////证明人
    var offsetProves = 1;
    $.postJSON("/projectProves/projectProvesVoPage", {
        "projectId": projectId,
        "offset": offsetProves,
        "limit": 5
    }, function (data) {
        //alert(data.totalCount);
        //alert(data.pageData);
        var totalCount = data.totalCount;
        if (totalCount == 0) {
            $("#provesNul").css("display", "block");
            $("#provesPage").css("display", "none");
        } else {
            $("#provesCnt").text(data.totalCount);
            var len = data.pageData.length;
            if (len > 2) {
                len = 2;
            }
            for (var i = 0; i < len; i++) {
                var vo = data.pageData[i];
                var prvs = "<li><img src=\"" + vo.portraitImgUrl + "\"/></li>";
                $("#proves").append(prvs);
                var dtl = "<li><div class='bd'><div class='pic'><img src='" + vo.portraitImgUrl + "'/></div>" +
                    "<span class='h5'>" + vo.nickname + "</span> <cite class='color-white bg-orange2'>已实名</cite>" +
                    "<p class='color-gray9 m-top05'>" + vo.provePre + "前</p>" +
                    "<p class='color-gray3'>" + vo.cause + "</p></div></li>";
                $("#provesDetail").append(dtl);
            }

            $("#provesNul").css("display", "none");
            $("#provesPage").css("display", "block");
        }
    });

    $("#provesTA").click(function () {
        if (projectUserId == userId) {
            alert("发起人自己不能证实自己的项目！");
        } else {
            $.postJSON("/projectProves/projectProvesCnt", {
                "proverId": userId,
                "projectId": projectId
            }, function (data) {
                if (data > 0) {
                    alert("您已经证实过该项目，不能重复证实！");
                } else {
                    location.href = "projectProvesCreate.html?projectId=" + projectId + "&r=" + Math.random();
                }
            })
        }
    });
    $("#provesTAN").click(function () {
        if (projectUserId == userId) {
            alert("发起人自己不能证实自己的项目！");
        } else {
            location.href = "projectProvesCreate.html?projectId=" + projectId + "&r=" + Math.random();
        }
    });
////// 众筹动态列表

    function projectProgressPage(offsetProgress, nickname, portraitImgUrl) {
        $.postJSON("/projectProgress/projectAllProgressAndRepliesPage", {
            "projectId": projectId,
            "offset": offsetProgress,
            "limit": limitReplies
        }, function (data) {
            $("#progressCnt").text(data.length);
            var replyCnt = 0;
            for (var i = 0; i < data.length; i++) {
                var vo = data[i];
                var prg = '<div class="bd" id="progress_' + vo.progressId + '"><div class="pic"><img src="' + portraitImgUrl + '"/></div>' +
                    '<span class="h5">' + nickname + ' </span> ';
                if (vo.progressType == 0) {
                    prg += '<cite class="color-gray6">发布更新</cite>' +
                        '<p class="color-gray9 m-top05">' + vo.progressPre + '</p>' +
                        '<p class="m-top10 color-gray9">' + vo.instruction + '</p>';
                    if (vo.progressImg) {
                        prg += "<p>";
                        var imgs = vo.progressImg.split(",");
                        for (var j = 0; j < imgs.length; j++) {
                            prg += '<img src="' + imgs[j] + '" />';
                        }
                        prg += "</p>";
                    }
                    prg += '<i id="reply' + vo.progressId + '"class="iconfont color-orange2" style="top: 1.1rem;" ' +
                        'onclick="showReply(\'' + vo.progressId + '\');">' +
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
                        'onclick="showReply(\'' + vo.progressId + '\');">' +
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
                        'onclick="showReply(\'' + vo.progressId + '\');">' +
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
                        'onclick="showReply(\'' + vo.progressId + '\');">' +
                        '&#xe60c;</i></div>';
                }
                $("#progress").append(prg);

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
        });
    }


/////TA的支持者

    $.postJSON("/projectSubscribe/projectSubscribeVoPage", {
        "projectId": projectId,
        "offset": offsetSubscribe,
        "limit": limitSubscribe
    }, function (data) {
        $("#subscribeCnt").text(data.totalCount);
        for (var i = 1; i <= data.pageData.length; i++) {
            var vo = data.pageData[i - 1];
            var dtl = '<div id="subscribe_' + i + '" class="bd"><div class="pic"><img src="' + vo.portraitImgUrl + '"/></div>' +
                '<span class="h5">' + vo.nickname + '</span> <cite class="color-gray6">支持了' +
                '<em class="color-orange2">' + (vo.wcPayAmount / AMOUNT_RATE) + '</em>元</cite>' +
                '<p class="color-gray9 m-top05">' + vo.subscribePre + '</p>' +
                '<p class="color-gray3">' + vo.message + '</p>' +
                '</div>';
            //$("#subscribes").append(dtl);
            $("#testSub").append(dtl);
        }
        var subCnt = data.totalCount;
        subscribesArray[0] = limitSubscribe;
        subscribesArray[1] = subCnt;
        subscribesArray[2] = limitSubscribe > subCnt ? subCnt : limitSubscribe;//向下位置
        subscribesArray[3] = limitSubscribe > subCnt ? subCnt : limitSubscribe;//向上位置
        if (limitSubscribe < data.totalCount) {
            var subscribePage = '<a id="upPage_subscribe" href="javascript:showPreSubscribes(\'' + projectId + '\');"' +
                ' class="color-gray9 m-top10" style="display: none; text-align: center;">︽</a>';
            subscribePage += '<a id="downPage_subscribe" href="javascript:showNextSubscribes(\'' + projectId + '\');"' +
                ' class="color-gray9 m-top10" style="display: block; text-align: center;">︾</a>';
            $("#subscribes").append(subscribePage);
        }

    });
///关注
    var offsetCollect = 0;

    if (userId) {
        $.postJSON("/projectCollects/projectCollectsCntAndIsCollect", {
            "projectId": projectId,
            "userId": userId,
        }, function (data) {
            $("#collectCnt").text(data.totalCount);
            var isCollect = data.isCollect;
            $("#isCollect").val(isCollect);
            if (isCollect == 'UN_COLLECT') {
                $("#collectP").removeClass("color-orange2");
                $("#collectP").addClass("color-gray9");
            }
        });
    }

    $("#collectP").click(function () {
        var isCollect = $("#isCollect").val();
        if (isCollect == 'COLLECT') {
            isCollect = 'UN_COLLECT';
        } else {
            isCollect = 'COLLECT';
        }
        $.postJSON("/projectCollects/collect", {
            "projectId": projectId,
            "userId": userId,
            "isCollect": isCollect
        }, function (data) {
            $("#collectCnt").text(data.totalCount);
            $("#isCollect").val(data.isCollect);
        });
    });


    $("#provesLst").click(function () {
        var portraitImgUrl = $("#portraitImgUrl").attr("src");
        var title = $("#title").text();
        var status = $("#projectStatusName").val();
        //alert("projectProvesAll.html?projectId="+projectId+"&portraitImgUrl="+portraitImgUrl
        //    +"&title="+title+"&status="+status);
        location.href = "projectProvesAll.html?projectId=" + projectId + "&portraitImgUrl=" + portraitImgUrl
            + "&title=" + title + "&status=" + status + "&r=" + Math.random();
    });

    /////////评论
    $("#cancelReply").click(function () {
        $(".theme-popover-mask").hide();
        $(".boxin").hide();
        $("#contentReply").val("");
    });

    if (userId) {

    }
    $("#reply").click(function () {
        var contentReply = $("#contentReply").val();
        if (isEmpty(contentReply)) {
            alert("评论内容不能为空");
            return;
        }
        var progId = $("#progId").val();
        $.postJSON("/progressReplies/replies", {
            "progressId": progId,
            "memberId": userId,
            "content": contentReply,
            "offset": offsetProgress,
            "limit": limitReplies
        }, function (data) {
            //关闭弹出层
            $("#cancelReply").click();
            /////以下是调用分页查询 倒叙显示最新评论
            var idx = getRepliesShowInfo(progId);
            initShowReplies(data.totalCount, data.pageData, idx, progId);
        });
    });

    $("#report").click(function () {
        location.href = "projectComplain.html?projectId=" + projectId + "&r=" + Math.random();
    });

    $("#subscribe").click(function () {
        location.href = 'wx/pay/projectSubscribe.html?projectId=' + projectId + "&r=" + Math.random();
    });

    /////////////////////项目管理
    //去支持列表
    $("#subscribeLst").click(function () {
        location.href = "projectSubscribeAll.html?projectId=" + projectId + "&r=" + Math.random();
    });
    /////编辑项目
    $("#editProject").click(function () {
        if ($("#projectStatus").val() == muji) {
            $.postJSON("/projects/toProjectEdit", {
                "projectId": projectId
            }, function (data) {
                location.href = "projectEdit.html?projectId=" + projectId + "&r=" + Math.random();
            });
        } else {
            alert("项目不再募集中不能编辑")
        }

    });
    ///////修改金额
    $("#modifyAmount").click(function () {
        if ($("#projectStatus").val() == muji) {
            location.href = "projectGoalAmountEdit.html?projectId=" + projectId + "&collectGoalAmount=" + Number($("#collectGoalAmount").text()) * AMOUNT_RATE + "&r=" + Math.random();
        } else {
            alert("项目不再募集中不能修改金额");
        }
    });
    ///////修改募集结束时间
    $("#modifyEndCollectTm").click(function () {
        //alert($("#collectEndTs").val()+"   old detaill.html");
        if ($("#projectStatus").val() == muji) {
            location.href = "projectCollectEndTs.html?projectId=" + projectId + "&collectEndTs=" + $("#collectEndTs").val() + "&r=" + Math.random();
        } else {
            alert("项目不再募集中不能修改结束时间");
        }
    });
    ///////更新动态
    $("#releaseProgress").click(function () {
        if ($("#projectStatus").val() == muji) {
            location.href = "projectProgressCreate.html?projectId=" + projectId + "&r=" + Math.random();
        } else {
            alert("项目不再募集中不能更新动态");
        }
    });
    ////项目验证
    $("#projectProve").click(function () {
        location.href = "projectProveCategory.html?projectId=" + projectId +
            "&projectType=" + projectType + "&projectCategory=" + projectCategory + "&r=" + Math.random();
    });
    ///联系客服
    $("#connectService").click(function () {
        location.href = "service.html?projectId=" + projectId + "&r=" + Math.random();
    });
    //////提前结束
    $("#advanceFinish").click(function () {
        if ($("#projectStatus").val() == muji) {
            $(".theme-popover-mask").show();
            $(".manage").hide();
            $("#advanceReasonDiv").show();
        } else {
            alert("项目不再募集中不能提前结束");
        }
    });
    //确定提前结束
    $("#advance").click(function () {
        var advanceReason = $("#advanceReason").val();
        $.postJSON("/projects/projectAdvanceEnd", {
            "projectId": projectId,
            "reason": advanceReason
        }, function (data) {
            //关闭弹出层
            $("#cancelAdvance").click();
            location.href = "projectDetail.html?projectId=" + projectId + "&r=" + Math.random();
        });
    });
    //取消提前结束
    $("#cancelAdvance").click(function () {
        $(".theme-popover-mask").hide();
        $("#advanceReason").val("");
        $("#advanceReasonDiv").hide();
    });


    //确定删除
    $("#delProject").click(function () {
        $.postJSON("/projects/projectDel", {
            "projectId": projectId
        }, function (data) {
            //关闭弹出层
            $("#cancelDel").click();
            location.href = "deleteSuccess.html?projectId=" + projectId + "&r=" + Math.random();
        });
    });
    //取消删除
    $("#cancelDel").click(function () {
        $(".theme-popover-mask").hide();
        $("#delProjectDiv").hide();
    });

    //////删除项目 需要搬迁到详情页
    $("#deleteProject").click(function () {
        $(".theme-popover-mask").show();
        $(".manage").hide();
        $("#delProjectDiv").show();
    });

    ///////使用帮助
    $("#useHelp").click(function () {
        location.href = "help.html?projectId=" + projectId + "&r=" + Math.random();
    });

});

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

function showReply(progId) {
    //alert(prog.id);
    $("#progId").val(progId);
    $(".theme-popover-mask").show();
    $("#replyDiv").show();
}

function showAdvanceEnd() {
    $(".theme-popover-mask").show();
    $(".boxin").show();
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
        var len = showIdx + limitReplies > cnt ? cnt : showIdx + limitProgress;
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

function showNextSubscribes(projectId) {
    var offset = subscribesArray[0];
    var cnt = subscribesArray[1];
    var showIdx = subscribesArray[2];
    if (offset < cnt && showIdx == offset) {
        $.postJSON("/projectSubscribe/projectSubscribeVoPage", {
            "projectId": projectId,
            "offset": offset,
            "limit": limitSubscribe
        }, function (data) {
            for (var i = 1; i <= data.pageData.length; i++) {
                var vo = data.pageData[i - 1];
                var dtl = '<div id="subscribe_' + (offset + i) + '"class="bd"><div class="pic"><img src="' + vo.portraitImgUrl + '"/></div>' +
                    '<span class="h5">' + vo.nickname + '</span> <cite class="color-gray6">支持了' +
                    '<em class="color-orange2">' + (vo.wcPayAmount / AMOUNT_RATE) + '</em>元</cite>' +
                    '<p class="color-gray9 m-top05">' + vo.subscribePre + '</p>' +
                    '<p class="color-gray3">' + vo.message + '</p>' +
                    '</div>';
                //$("#subscribes").append(dtl);
                $("#testSub").append(dtl);
            }
            subscribesArray[0] = offset + limitSubscribe;
            subscribesArray[2] = offset + limitSubscribe > cnt ? cnt : offset + limitSubscribe;
            if ((offset + limitSubscribe) >= cnt) {
                $("#upPage_subscribe").css("display", "block");
                $("#downPage_subscribe").css("display", "none");
            } else {
                $("#upPage_subscribe").css("display", "block");
                $("#downPage_subscribe").css("display", "block");
            }
        });
    } else {
        var len = showIdx + limitSubscribe > cnt ? cnt : showIdx + limitSubscribe;
        for (var i = showIdx + 1; i <= len; i++) {
            $("#subscribe_" + i).css("display", "block");
        }
        if (len < cnt) {
            $("#upPage_subscribe").css("display", "block");
            $("#downPage_subscribe").css("display", "block");
        } else {
            $("#upPage_subscribe").css("display", "block");
            $("#downPage_subscribe").css("display", "none");
        }
        subscribesArray[2] = len;
    }
}
function showPreSubscribes(projectId) {
    var upIdx = subscribesArray[3];
    var showIdx = subscribesArray[2];
    //0 支持者ID 1 offset 2 支持者总数 3向下位置 4向上位置
    for (var i = upIdx + 1; i <= showIdx; i++) {
        $("#subscribe_" + i).css("display", "none");
    }
    subscribesArray[2] = upIdx;
    $("#upPage_subscribe").css("display", "none");
    $("#downPage_subscribe").css("display", "block");

}