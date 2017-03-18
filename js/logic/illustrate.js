var userId = localStorage.getItem("user_id");

$(document).ready(function () {

    $("#launch").click(function () {
        $.postJSON("/mobileBind/selectByUserId", {
            "userId": userId
        }, function (data) {
            var url = "projectCreate.html?userId=" + userId + "&r=" + Math.random();
            if (data = null) {
                var key = userId + Math.random();
                localStorage.setItem(key, url);
                location.href = "mobileInput.html?userId=" + userId + "&url=" + key + "&r=" + Math.random();
            } else {
                location.href = url;
            }
        });
    });

});
