/*用户页面 -> projectAuditSchedule.html*/

//userId从cookie中读取
var userId = localStorage.getItem("user_id");
$(document).ready(function () {

    $.postJSON("/certifications/getCertByUserId",
        {"userId": userId},
        function (data) {
            if (null == data) {
                $("#certTimeLi").hide();
                $("#returnBtn").hide();
                $("#contentDiv input").removeAttr("disabled");
            } else {
                $("#submitBtn").hide();
                $("#contentDiv input").attr("disabled", "disabled");
                $("#realName").val(data.realName);
                $("#idCardNumber").val(data.idCardNumber);
                $("#certTime").val(new Date(parseInt(data.createTs)).Format("yyyy-MM-dd HH:mm"));
                $("#certTimeLi").show();
                $("#returnBtn").show();
            }
        }
    );

    /**
     *
     */
    $("#submitBtn").click(function () {
        var rn = $("#realName").val();
        if (isEmpty(rn)) {
            alert("请输入真实姓名");
            return;
        }

        var icn = $("#idCardNumber").val();
        if (!isIdCard(icn)) {
            alert("身份证号不能为空或者格式不正确");
            return;
        }

        $.postJSON("/certifications/certification", {
            "userId": userId,
            "realName": rn,
            "idCardNumber": icn
        }, function (data) {
            $("#submitBtn").hide();
            $("#contentDiv input").attr("disabled", "disabled");
            $("#realName").val(data.realName);
            $("#idCardNumber").val(data.idCardNumber);
            $("#certTime").val(new Date(parseInt(data.createTs)).Format("yyyy-MM-dd HH:mm"));
            $("#certTimeLi").show();
            $("#returnBtn").show();
        });
    });

    $("#returnBtn").click(function () {
        location.href = "userSet.html" + "?r=" + Math.random();
    })
});
