/*用户页面 -> projectAuditSchedule.html*/

$(document).ready(function () {
    var projectId = UrlParm.parm("projectId");

    // userId
    var userId = UrlParm.parm("userId");
    if (userId) {
        localStorage.userId = userId;
    }

    // openId
    var openId = UrlParm.parm("openId");
    if (userId) {
        localStorage.openId = openId;
    }

    $("#reportBtn").click(function () {
        var reportImg = $("#reportImg").val();
        var cause = $("#cause").val();
        $.postJSON("/projectComplain/projectComplain", {
            "projectId": projectId,
            "complainerId": userId,
            "imgUrl": reportImg,
            "cause": cause
        }, function (data) {
            //alert("success");
            //location.href=base_uri+""

            //跳转到举报成功页
        });
    });


    $("#reportImg").click(function () {
        alert("aaaaaaaaaaaaabbb");
        wx.chooseImage({
            success: function (res) {
                alert("aaaaaaaa");
                var localId = res.localIds;
                alert('上传图片' + localId);
                if (res.localIds.length == 1) {
                }
            }
        });
    });

    if (UrlParm.hasParm("appId")) {
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
            appId: UrlParm.parm("appId"), // 必填，公众号的唯一标识
            timestamp: UrlParm.parm("timestamp"), // 必填，生成签名的时间戳
            nonceStr: UrlParm.parm("nonceStr"), // 必填，生成签名的随机串
            signature: UrlParm.parm("signature"),// 必填，签名，见附录1
            jsApiList: [ // 必填，需要使用的JS接口列表, 所有要调用的 API 都要加到这个列表中
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ",
                "chooseImage",
                "previewImage"
            ]
        });
    }


    /*config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
     *config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
     *则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
     *则可以直接调用，不需要放在ready函数中。
     * */
    wx.ready(function () {
        console.log("初始化成功");
    });

    if (!localStorage.hasLogin) {
        localStorage.hasLogin = 0;
    }

    if (localStorage.hasLogin = 0 && (userId == undefined || openId == undefined || userId == null || openId == null)) {
        localStorage.hasLogin = 1;
        alert("ssssss + " + localStorage.hasLogin);
        $.postJSON("/wx/redirect",
            {
                //"projectId" : projectId
                "openId": localStorage.openId || "",
                "reUrl": location.href
            },
            function (data) {
                alert("dflajfldsafla");
                if (data.url != "") {
                    $(window.location).attr('href', data.url);
                }
            }
        );
    }


    // 拍照或从手机相册中选图
    $("#reportImg1111111").click(function () {
        fromWX("/wx/signature",
            {"url": location.href.replace("http://", "")},
            function (data) {
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
                    appId: data.appid, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.noncestr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: [ // 必填，需要使用的JS接口列表, 所有要调用的 API 都要加到这个列表中
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

                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        alert(res);
                    }
                });
            });
    });


    /*$("#uploadImage").on("change", function(){
     // Get a reference to the fileList
     var files = !!this.files ? this.files : [];
     // If no files were selected, or no FileReader support, return
     if (!files.length || !window.FileReader){
     return;
     }

     // Only proceed if the selected file is an image
     if (/^image/.test(files[0].type)){
     lrz(this.files[0])
     .then(function (rst) {
     // 处理成功会执行
     // Create a new instance of the FileReader
     var reader = new FileReader();

     // Read the local file as a DataURL
     reader.readAsDataURL(files[0]);

     // When loaded, set image data as background of div
     reader.onloadend = function(){
     $("#uploadPreview").attr("src", this.result);
     }
     })
     .catch(function (err) {
     // 处理失败会执行
     })
     .always(function () {
     // 不管是成功失败，都会执行
     });
     }

     });*/

})


