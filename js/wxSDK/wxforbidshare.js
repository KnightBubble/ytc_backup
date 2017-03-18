define(['wxSDK'], function (wx) {
    // 判断是否在微信中打开
    if (isWeiXin) {
        wxService.getParms(location.href).done(function (response, status, xhr) {
            // 微信SDK
            wx.config({
                debug: $_GET['wxdebug'] ? true : false,
                appId: response.appid,
                timestamp: response.timestamp,
                nonceStr: response.noncestr,
                signature: response.signature,
                jsApiList: [
                    // 所有要调用的 API 都要加到这个列表中
                    "onMenuShareTimeline",
                    "onMenuShareAppMessage",
                    "onMenuShareQQ",
                    "onMenuShareWeibo",
                    "onMenuShareQZone",
                    "startRecord",
                    "stopRecord",
                    "onVoiceRecordEnd",
                    "playVoice",
                    "pauseVoice",
                    "stopVoice",
                    "onVoicePlayEnd",
                    "uploadVoice",
                    "downloadVoice",
                    "chooseImage",
                    "previewImage",
                    "uploadImage",
                    "downloadImage",
                    "translateVoice",
                    "getNetworkType",
                    "openLocation",
                    "getLocation",
                    "hideOptionMenu",
                    "showOptionMenu",
                    "hideMenuItems",
                    "showMenuItems",
                    "hideAllNonBaseMenuItem",
                    "showAllNonBaseMenuItem",
                    "closeWindow",
                    "scanQRCode",
                    "chooseWXPay",
                    "openProductSpecificView",
                    "addCard",
                    "chooseCard",
                    "openCard"
                ]
            });
            wx.ready(function () {
                // 隐藏右上角菜单接口
                wx.hideOptionMenu();
                // 显示右上角菜单接口
                //wx.showOptionMenu();
                // 关闭当前网页窗口接口
                //wx.closeWindow();
                // 隐藏分享接口(已失效)
                //wx.hideMenuItems({
                //menuList: ['appMessage', 'timeline', 'qq', 'weiboApp', 'QZone'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                //});
            });
        }).fail(function (err) {
            if (err.status != 0) {
                alert('微信参数获取错误' + err.status);
            }
        });
    }
    return wx;
});
