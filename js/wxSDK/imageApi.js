/*
 函数名称：wxJSSDK.imageApi
 函数功能：为wxJSSDK增加图像服务
 参数：
 imageApi 图像API Object 配置
 */
wxJSSDK.imageApi = function (imageApi) {
    if (wxJSSDK.isReady) {//wxJSSDK.isReady 查看微信JSSDK是否初始化完毕
        if (imageApi) {

            imageApi.chooseImage && wx.chooseImage({//拍照或从手机相册中选图接口
                count: 1, // 默认9
                success: function (res) {
                    imageApi.chooseImage.success && imageApi.chooseImage.success(res);
                }
            });

            imageApi.previewImage && wx.previewImage({// 预览图片接口
                current: imageApi.previewImage.current, // 当前显示的图片链接
                urls: imageApi.previewImage.urls // 需要预览的图片链接列表
            });

            imageApi.uploadImage && wx.uploadImage({//上传图片接口
                localId: imageApi.uploadImage.localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: imageApi.uploadImage.isShowProgressTips || 1, // 默认为1，显示进度提示
                success: function (res) {
                    imageApi.uploadImage.success && imageApi.uploadImage.success(res);
                }
            });

            imageApi.downloadImage && wx.downloadImage({//下载图片接口
                serverId: imageApi.downloadImage.serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                isShowProgressTips: imageApi.downloadImage.isShowProgressTips || 1, // 默认为1，显示进度提示
                success: function (res) {
                    imageApi.downloadImage.success && imageApi.downloadImage.success(res);
                }
            });
        } else {
            console.log("缺少配置参数");
        }
    } else {
        console.log("抱歉，wx没有初始化完毕，请等待wx初始化完毕，再调用图像接口服务。");
    }

}
