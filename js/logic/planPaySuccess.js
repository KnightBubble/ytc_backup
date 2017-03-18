var planId = UrlParm.parm("planId");
//var preDeposit=parseFloat(UrlParm.parm("preDeposit"));
var planName = UrlParm.parm("planName");
var allName = UrlParm.parm("allName");
var userId = localStorage.getItem("user_id");

$(document).ready(function () {
    initOkpage();
    $("#jixuBtn").click(function () {
        location.href = "wx/pay/addPlan.html?planId=" + planId + "&r=" + Math.random();
    });
    $("#viewMyPlan").click(function () {
        location.href = "myPlan.html?planId=" + planId + "&r=" + Math.random();
    });

});


function initOkpage() {
    $("#planName").text(planName);
    //alert(allName);
    if(allName) {
        var names = allName.split(",");
        for (var n = 0; n < names.length; n++) {
            if (names[n] == "") {
                continue;
            }
            var pDiv = "<p>名称：" + names[n] + "</p>";
            $("#jixuBtn").before(pDiv);
        }
    }
}

