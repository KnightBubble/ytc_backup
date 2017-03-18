/*用户页面 -> userSet.html*/

$(document).ready(function () {

    var openId = UrlParm.parm("openId") || localStorage.getItem("open_id");
    var userId = UrlParm.parm("userId") || localStorage.getItem("user_id");

    if (openId && userId) {
        //alert("openId: " + openId + "\nuserId: " + userId);
        localStorage.setItem("open_id", openId);
        localStorage.setItem("user_id", userId);
    } else {
        redirect();
        return;
    }

})
