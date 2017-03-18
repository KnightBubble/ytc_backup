/*用户页面 -> mine.html*/
////userId从cookie中读取
$(document).ready(function () {
    var userId = localStorage.getItem("user_id");

    $("#userSet").click(function () {
        location.href = "../../userSet.html?r=" + Math.random();
    });

    if (userId) {
        $.postJSON("/users/userBasiceInfo", {
            "userId": userId
        }, function (data) {
            $("#createProjectsCnt").text(data.createCnt);
            $("#subscribeProjectsCnt").text(data.subscribeCnt);
            $("#collectProjectsCnt").text(data.collectCnt);
            $("#nickname").text(data.nickname);
            if (null != data.mobileBind) {
                $("#mobileNumber").text(data.mobileBind.mobileNumber);
            } else {
                var key = userId + Math.random();
                localStorage.setItem(key, "mine.html?userId=" + userId + "&r=" + Math.random());
                $("#mobileNumber").append("<a href='../../mobileInput.html?userId=" + userId + "&key=1&url=" + key + "&r=" + Math.random() + "'>未填手机号</a>");
            }
            if (null != data.myGlory) {
                var glory = parseFloat(data.myGlory.glory) / 10000;
                $("#myGlory").text(glory);
            }
            $("#portraitImgUrl").attr("src", data.portraitImgUrl);
        });
    }

    $("#myPlan").click(function () {
        location.href = "myPlan.html?userId=" + userId + "&r=" + Math.random();
    });

    $("#helpAndFeedback").click(function () {
        location.href = "feedback.html?userId=" + userId + "&r=" + Math.random();
    });

    $("#createProjects").click(function () {
        location.href = "allProjectsCreate.html?userId=" + userId + "&r=" + Math.random();
    });

    $("#subscribeProjects").click(function () {
        location.href = "allProjectsSubscribe.html?userId=" + userId + "&r=" + Math.random();
    });

    $("#collectProjects").click(function () {
        location.href = "allProjectsCollect.html?userId=" + userId + "&r=" + Math.random();
    });


    //<a id="createProjects" href="allProjectsCreate.html">
    // <span id="createProjectsCnt">0</span>
    //
    // <a id="subscribeProjects" href="projectSubscribeAll.html" >
    // <span id="subscribeProjectsCnt" >11</span>
    //
    // <a id="collectProjects" href="allProjectsCollect.html">
    // <span id="collectProjectsCnt">0</span>
});
