/*用户页面 -> projectComplain.html*/


function chooseImgs(chooseDiv) {
    wxJSSDK.imageApi({
        chooseImage: {
            success: function (res) {
                if (res.localIds.length > 0) {
                    var i = 0;
                    var nw = new Date().getMilliseconds();
                    while (i++ < res.localIds.length) {
                        var localId = res.localIds.pop();
                        var imgDiv = '<div id="' + chooseDiv + "_" + nw + "_" + i + '" class="photoDiv"><img src="' + localId + '" />';
                        imgDiv += '<span></span><i onclick="deleteImg(\'' + chooseDiv + "_" + nw + "_" + i + '\')">x</i></div>';
                        //alert(imgDiv);
                        $("#" + chooseDiv).before(imgDiv);
                    }
                }
            }
        }
    });
}

/**
 *
 * @param localIds
 * @param mediaIds
 * @param callback
 */
function uploadImgToWX(localIds, mediaIds, callback) {
    if (localIds.length == 0) {
        callback();
    } else {
        var localId = localIds.pop();
        if(localId.startWith("http://")){
            mediaIds.push(localId.substring(localId.lastIndexOf("/") + 1, localId.indexOf("?")));
            if (localIds.length == 0) {
                if (callback) {
                    callback();
                }
            } else {
                uploadImgToWX(localIds, mediaIds, callback);
            }
        } else {
            wx.uploadImage({
                localId: localId,
                isShowProgressTips: 1,
                success: function (res) {
                    var mediaId = "wx-" + res.serverId; // 返回图片的服务器端ID
                    mediaIds.push(mediaId);
                    if (localIds.length == 0) {
                        if (callback) {
                            callback();
                        }
                    } else {
                        uploadImgToWX(localIds, mediaIds, callback);
                    }
                }
            });
        }
    }
}
//http://zhongchou2016.oss-cn-beijing.aliyuncs.com/1479223871493_b01df8039b9e424abd92b4df2d1861f5?Expires=1479227644&amp;OSSAccessKeyId=Nz7WIZxYrHguUPJ8&amp;Signature=r8j7HxiF6cg7NYZYuLiXW1ZbKaQ%3D

function deleteImg(imgDivId) {
    $("#" + imgDivId).remove();
}