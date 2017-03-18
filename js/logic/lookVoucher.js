var planUserId = UrlParm.parm("planUserId");
var planId = UrlParm.parm("planId");
$(document).ready(function () {
    $(".content .con-bd>ul>li>i").click(function () {
        var sum = $(this).siblings("span").text();
        if ($(this).text() == "") {
            $(this).text("");
        } else {
            $(this).text("");
        }
    });

    showVoucher();

    $("#helpMemberList").click(function () {
        window.location.href = "helpMemberList.html?planId=" + planId + "&r=" + Math.random();
    });

    $("#wxPay").click(function () {
        location.href = "../../wx/pay/continueRecharge.html?planId=" + planId + "&crUserId=" + planUserId + "&r=" + Math.random();
    });

});

function showVoucher() {
    $.postJSON("/userBalance/queryMyUserBalanceVo", {
        "userId": planUserId,
        "planId": planId
    }, function (data) {
        var plan = data.plan;
        $("#planName").text(plan.planName);
        $("#statusTip").text(data.statusTip);
        var limitAmount = parseFloat(plan.limitAmount) / AMOUNT_RATE / AMOUNT_RATE; //单位：万元
        $("#limitAmount").text(limitAmount);
        $("#leijiCnt").text(data.leijiCnt);
        var leijiAmt = parseFloat(data.leijiAmt) / AMOUNT_RATE;//单位：元
        $("#leijiAmt").text(leijiAmt);
        var certifications = data.certifications;
        $("#realName").text(certifications.realName);
        $("#idCardNumber").text(certifications.idCardNumber);
        $("#addDateStr").text(data.addDateStr);
        var balance = parseFloat(data.balance) / AMOUNT_RATE;//单位：元
        $("#balance").text(balance);
        $("#statusName").text(data.statusName);
        /*var preDeposit=parseFloat(plan.preDeposit)/AMOUNT_RATE;//单位：元
         $("#preDeposit").text(preDeposit);*/
    });
}