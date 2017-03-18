/*用户页面 -> userSet.html*/
////userId从cookie中读取
var userId = localStorage.getItem("user_id");
$(document).ready(function () {

    $("#userCertification").click(function () {
        location.href = "userCertification.html?r=" + Math.random();
    });

    $("#myCard").click(function () {
        location.href = "myCard.html?r=" + Math.random();
    });

    $.postJSON("/users/userBasiceInfo", {
        "userId": userId
    }, function (data) {
        $("#nickname").text(data.nickname);
        if (data.mobileBind) {
            $("#mobileNumber").text(data.mobileBind.mobileNumber);
        } else {
            var key = userId + Math.random();
            localStorage.setItem(key, "userSet.html?userId=" + userId + "&r=" + Math.random());
            $("#mobileNumber").append("<a href='../../mobileInput.html?userId=" + userId + "&key=1&url=" + key + "&r=" + Math.random() + "'>未填手机号</a>");
        }
        $("#portraitImgUrl").attr("src", data.portraitImgUrl);
    });

    $("#username").click(function () {
        $(".theme-popover-mask").show(300);
        $("#modName").show(500);
        $("#modName > input").attr("placeholder", $(this).children("div").text())
    })
    $("#nicknameCancel").click(function () {
        $(".theme-popover-mask").hide();
        $("#modName").hide();
        $("#nicknameNew").val("");
    });
    $("#nicknameBtn").click(function () {
        $.postJSON("/users/modifyUser", {
            "userId": userId,
            "nickname": $("#nicknameNew").val()
        }, function (data) {
            $("#nickname").text(data.nickname);
            //$("#portraitImgUrl").attr("src",data.portraitImgUrl);
        });
    });

    $("#exit").click(function () {
        localStorage.removeItem("user_id");
        localStorage.removeItem("open_id");
        location.href = "index.html" + "?r=" + Math.random();
    })


    $(".theme-popover-mask").click(function () {
        $(".theme-popover-mask").hide(500);
        $("#modName").hide(300);
    })
    $(".Prompt>ul>li>a").click(function () {
        $(".theme-popover-mask").hide(500);
        $("#modName").hide(300);
    })

})
