/*用户页面 -> projectAuditSchedule.html*/

$(document).ready(function () {
    ///从cookie中读取
    var userId = localStorage.getItem("user_id");
    var projectId = UrlParm.parm("projectId");
    var collectGoalAmountOld = UrlParm.parm("collectGoalAmount");
    $("#collectGoalAmount").val(collectGoalAmountOld / AMOUNT_RATE);

    $("#btnSelected").click(function () {
        var goalAmount = $("#collectGoalAmount").val();
        var reason = $("#reason").val();

        if (!isAmount(goalAmount)) {
            alert("请输入支付金额, 支付金额最多保留2位小数,资金必须大于0。");
            return;
        }
        if (isEmpty(reason)) {
            alert("修改原因不能为空");
            return;
        }

        var collectGoalAmount = Number(goalAmount) * AMOUNT_RATE; //单位：毫厘
        $.postJSON("/projects/projectCollectGoalAmount", {
            "projectId": projectId,
            "collectGoalAmount": collectGoalAmount,
            "reason": reason
        }, function (data) {
            location.href = "projectDetail.html?projectId=" + projectId + "&r=" + Math.random();
        });
    });


});



