var planId = UrlParm.parm("planId");

$(document).ready(function () {
    var userId = localStorage.getItem("user_id");

    initPlanDetails();

    $(".wenti>ul>li").click(function () {
        if ($(this).find("cite").text() == "") {
            $(this).children("div").show();
            $(this).find("cite").text("");
        } else {
            $(this).children("div").hide();
            $(this).find("cite").text("");
        }
    });

    $(".pouple>i,.pouple>a").click(function () {
        $(".theme-popover-mask").hide(500);
        $(".pouple").hide(300);
    });

    $("#launch").click(function () {
        $.postJSON("/mobileBind/selectByUserId", {
            "userId": userId
        }, function (data) {
            var preDeposit = parseFloat($("#preDeposit").val()) * AMOUNT_RATE; //毫厘
            var url = "wx/pay/addPlan.html?planId=" + planId + "&preDeposit=" + preDeposit + "&planName=" + $("#planName").val() + "&r=" + Math.random();
            if (data = null) {
                var key = userId + Math.random();
                localStorage.setItem(key, url);
                location.href = "mobileInput.html?userId=" + userId + "&url=" + key;
            } else {
                location.href = url;
            }
        });
    });
});

function initPlanDetails() {
    $.postJSON("/plans/planVoDetail", {
        "planId": planId
    }, function (data) {
        $("#memberCnt").text(data.memberCnt);
        $("#totalAmount").text(data.totalAmount / AMOUNT_RATE);
        $("#preDeposit").val(data.preDeposit / AMOUNT_RATE);
        $("#planName").val(data.planName);
        for (var m in data.ruleMap) {
            var rule = data.ruleMap[m];
            var li = ' <li> <a href="javascript:void(0);">' +
                '<span>' + rule.ruleName + '</span>' + rule.ruleValue + '<cite class="iconfont right">&#xe62a;</cite> </a>' +
                '<div class="boxin"> <span></span>' + rule.ruleDesc + ' </div>  </li>';
            $("#rules").append(li);
        }

        $(".rule>ul>li").click(function () {
            if ($(this).find("cite").text() == "") {
                $(this).children("div").show();
                $(this).find("cite").text("");
            } else {
                $(this).children("div").hide();
                $(this).find("cite").text("");
            }
        });
    });
}