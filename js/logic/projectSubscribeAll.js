/*用户页面 -> projectAuditSchedule.html*/

var offsetSubscribe = 1;
var limitSubscribe = 2;
var projectId = UrlParm.parm("projectId");
var userId = localStorage.getItem("user_id");

$(document).ready(function () {


    $.postJSON("/projectSubscribe/subscribeAmountAndCnt", {
        "projectId": projectId
    }, function (data) {
        $("#subscribeCnt").text(data.totalCount);
        $("#supportAmount").text(data.totalAmount / AMOUNT_RATE);
    });

    //$.postJSON("/projectSubscribe/subscribeAmountAndCnt",{
    //    "projectId": projectId
    //}, function (data) {
    //    $("#subscribeCnt").text(data.totalCount);
    //    $("#supportAmount").text(data.totalAmount/AMOUNT_RATE);
    //});

    $.postJSON("/projectCollects/projectCollectsCntAndIsCollect", {
        "projectId": projectId,
        "userId": userId
    }, function (data) {
        $("#collectCnt").text(data.totalCount + "次");
        //$("#isCollect").val(data.isCollect);
    });


    $.postJSON("/projectSubscribe/projectSubscribeVoPage", {
        "projectId": projectId,
        "offset": offsetSubscribe,
        "limit": limitSubscribe
    }, function (data) {
        //$("#subscribeCnt").text(data.totalCount);
        var cnt = data.totalCount;
        for (var i = 0; i < data.pageData.length; i++) {
            var vo = data.pageData[i];
            var dt = '<li><a href="javascript:;"><div class="pic">' +
                '<img src="' + vo.portraitImgUrl + '"/></div>' +
                '<div class="txt"><h5>' + vo.nickname + '</h5>' +
                '<p  class="color-gray9">' + vo.subscribePre + '</p></div>' +
                '<span class="color-gray9">' + (vo.wcPayAmount / AMOUNT_RATE) + '</span></a></li>';
            $("#scbscribes").append(dt);
        }
        if (limitSubscribe < cnt) {

            var nextIcon = '<a  id="downPage_sub" href="javascript:void(0);" ' +
                'onclick="showNextPageSubscribes(\'' + projectId + '\');" style="display:block;"' +
                ' class="iconfont color-orange2 center" style="transform: rotate(90deg);">&#xe60a;</a>';
            $("#collectsDiv").append(nextIcon);
        }
        offsetSubscribe += limitSubscribe;
    });

})

function showNextPageSubscribes(projectId) {
    $.postJSON("/projectSubscribe/projectSubscribeVoPage", {
        "projectId": projectId,
        "offset": offsetSubscribe,
        "limit": limitSubscribe
    }, function (data) {
        //$("#subscribeCnt").text(data.totalCount);
        var cnt = data.totalCount;
        for (var i = 0; i < data.pageData.length; i++) {
            var vo = data.pageData[i];
            var dt = '<li><a href="javascript:;"><div class="pic">' +
                '<img src="' + vo.portraitImgUrl + '"/></div>' +
                '<div class="txt"><h5>' + vo.nickname + '</h5>' +
                '<p  class="color-gray9">' + vo.subscribePre + '</p></div>' +
                '<span class="color-gray9">' + (vo.wcPayAmount / AMOUNT_RATE) + '</span></a></li>';
            $("#scbscribes").append(dt);
        }
        offsetSubscribe += limitSubscribe;
        if (offsetSubscribe >= cnt) {
            $("#downPage_sub").css("display", "none");
        } else {
            $("#downPage_sub").css("display", "block");
        }
    });
}
