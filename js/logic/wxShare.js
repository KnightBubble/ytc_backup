/*用户页面 -> userSet.html*/

$(document).ready(function () {

    var openId = UrlParm.parm("openId");

    wx.ready(function () {
        // 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline({
            title: $("#title").text() + " - 一同筹",
            desc: $("#detailInformation").text(),
            link: location.href,
            imgUrl: $("#imagesOl > li:first img").attr("src"),
            trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                //alert('用户点击分享到朋友圈');
            },
            success: function (res) {
                //alert('已分享');
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });
    });

    /**
     * 微信分享
     */
    wx.ready(function () {
        // 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage({
            title: $("#title").text() + " - 一同筹",
            desc: $("#detailInformation").text(),
            link: location.href,
            imgUrl: $("#imagesOl > li:first img").attr("src"),
            trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                //alert('用户点击发送给朋友');
            },
            success: function (res) {
                //alert('已分享');
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });
    });

});
