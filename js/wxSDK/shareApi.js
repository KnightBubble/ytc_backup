/*
 函数名称：wxJSSDK.shareApi
 函数功能：为wxJSSDK增加分享服务
 参数：
 */
wxJSSDK.shareApi = function (shareApi) {
    if (wxJSSDK.isReady) {//wxJSSDK.isReady 查看微信JSSDK是否初始化完毕
        if (shareApi) {
            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            shareApi.onMenuShareTimeline && wx.onMenuShareTimeline({
                title: '', // 分享标题
                link: '', // 分享链接
                imgUrl: '', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareApi.onMenuShareTimeline.success && shareApi.onMenuShareTimeline.success(res);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
            shareApi.onMenuShareAppMessage && wx.onMenuShareAppMessage({
                title: '', // 分享标题
                desc: '', // 分享描述
                link: '', // 分享链接
                imgUrl: '', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareApi.onMenuShareAppMessage.success && shareApi.onMenuShareAppMessage.success(res);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        } else {
            console.log("缺少配置参数");
        }
    } else {
        console.log("抱歉，wx没有初始化完毕，请等待wx初始化完毕，再调用图像接口服务。");
    }

}
