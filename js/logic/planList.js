/*用户页面 -> projectAuditSchedule.html*/

var offsetPlan = 1;
var limitPlan = 200;
//    var projectId = "4f70976f-474b-47e6-b788-6f07edf91347";
//userId从cookie中读取
var userId = localStorage.getItem("user_id");

$(document).ready(function () {

    showNextPageSubscribes();

})

function showNextPageSubscribes() {

    $.postJSON("/plans/planVoPage", {
        "offset": offsetPlan,
        "limit": limitPlan
    }, function (data) {
        //$("#subscribeCnt").text(data.totalCount);
        var cnt = data.totalCount;
        for (var i = 0; i < data.pageData.length; i++) {
            var vo = data.pageData[i];
            //alert(vo.headImg);
            var nextPlan = '<div class="list m-top20"><div><div class="pto">' +
                '<img src="' + vo.headImg + '"/></div><div class="txt">' +
                '<h6 class="color-orange2">' + vo.planName + '</h6>' +
                '<p class="m-top10">' + vo.planTitle + '</p>' +
                '<p>' + vo.ruleMap['101'].ruleValue + '</p>' +
                '<button class="bg-orange2 color-white m-top10" onclick="toPlanDetail(\'' + vo.planId + '\')">立即加入</button>' +
                '</div></div></div>';

            $("#allPlanDiv").append(nextPlan);
        }
        offsetPlan += limitPlan;
    });
}

function toPlanDetail(planId) {
    location.href = "planDetails.html?planId=" + planId + "&r=" + Math.random();
}