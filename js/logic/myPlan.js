/*用户页面 -> projectAuditSchedule.html*/

//userId从cookie中读取
var userId = localStorage.getItem("user_id");

$(document).ready(function () {
    queryMyPlan();
})

function queryMyPlan() {

    $.postJSON("/userBalance/allMyUserBalance", {
        "operatorId": userId
    }, function (data) {
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                var vo = data[i];
                //alert(vo.headImg);
                var balance = parseFloat(vo.balance) / AMOUNT_RATE;

                var nextUser = '<div class="con-hd bg-white bdone">' +
                    '<h4 class="color-orange2">' + vo.plan.planName + '</h4>' +
                    '<p>姓名：' + vo.certifications.realName + '</p>' +
                    '<p>加入日期：' + vo.addDateStr + '</p>' +
                    '<p>账户余额：<span class="color-orange2">' + balance + '元</span>' +
                    '<cite class="color-orange2" style="margin-left: .2rem;">' + vo.statusName + '</cite></p>' +
                    '<p><a href="../../wx/pay/continueRecharge.html?planId=' + vo.planId + '&crUserId=' + vo.userId + '&r=' + Math.random() + '" class="color-green" style="margin-right: 1.5rem;">充值</a>' +
                    '<a href="javascript:;" class="color-green" onclick="toLookVoucher(\'' + vo.userId + '\',\'' + vo.planId + '\')">查看凭证</a></p>' +
                    '</div>';
                $("#myPlan").append(nextUser);
            }
        }
    });
}

function toLookVoucher(planUserId, planId) {
    location.href = "lookVoucher.html?planUserId=" + planUserId + "&planId=" + planId + "&r=" + Math.random();
}