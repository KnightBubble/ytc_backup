/*用户页面 -> mine.html*/
/*用户页面 -> mine.html*/
var url = "/projects/subscribePojectsPage";
var userId = localStorage.getItem("user_id"); //从cookie中读取
var offset = 1;
var limit = 200;
$(document).ready(function () {

    var userId = localStorage.getItem("user_id") || UrlParm.parm("userId"); //从cookie中读取

    // 已成功
    $("#successed").click(
        function () {
            projectList(
                $(this),
                {
                    "status": -2, // 项目结束
                    "offset": offset,
                    "limit": limit,
                    "userId": userId
                }
            )
        }
    );

    // 进行中
    $("#going").click(
        function () {
            projectList(
                $(this),
                {
                    "status": 4, // 13:被下架
                    "offset": offset,
                    "limit": limit,
                    "userId": userId
                }
            )
        }
    );

    // 已失效
    $("#losed").click(
        function () {
            projectList(
                $(this),
                {
                    "multiStatus": '13,-1', // 13:被下架
                    "offset": offset,
                    "limit": limit,
                    "userId": userId
                }
            )
        }
    );

    function projectList(curEle, params) {
        $("#allProjectTitle > li").removeClass("cur");
        $("#allProjectContent").empty();
        curEle.addClass("cur");
        $.postJSON(url,
            params,
            function (data) { // callback
                var content = "";
                $.each(data.pageData, function (i, n) {
                    var img = n.images.split(",")[0];
                    content += "" +
                        "<li>" +
                        "   <a href='projectDetail.html?projectId=" + n.projectId + "&r=" + Math.random() + "' class='more'>" +
                        "       <div class='pic'>" +
                        "       <img src='" + img + "'/>" +
                        "   </div>" +
                        "   <div class='txt'>" +
                        "       <h5>" + n.title + "</h5>" +
                        "       <p>" + n.releasePre + "天前<cite class='color-orange2'>剩余" + n.releaseSuf + "天</cite></p>" +
                        "   </div>" +
                        "   </a>" +
                        "</li>";
                });
                $("#allProjectContent").append(content);
            }
        )
    }

    $("#going").click();

})
