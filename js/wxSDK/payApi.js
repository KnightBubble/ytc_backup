/*
 函数名称：wxJSSDK.payApi
 函数功能：为wxJSSDK增加支付服务
 参数：
 */
wxJSSDK.payApi = function (payApi) {
    if (wxJSSDK.isReady) {//wxJSSDK.isReady 查看微信JSSDK是否初始化完毕
        if (payApi) {

            payApi.chooseWXPay && wx.chooseWXPay({//发起一个微信支付请求
                success: function (res) {
                    payApi.chooseWXPay.success && payApi.chooseWXPay.success(res);
                }
            });

        } else {
            console.log("缺少配置参数");
        }
    } else {
        console.log("抱歉，wx没有初始化完毕，请等待wx初始化完毕，再调用图像接口服务。");
    }

}
