/*用户页面 -> projectAuditSchedule.html*/
var projectId = UrlParm.parm("projectId");
//userId从cookie中读取
var userId = localStorage.getItem("user_id");
//var proveMaterialsPath="";
$(document).ready(function () {
    var projectType = UrlParm.parm("projectType");
    var projectCategory = UrlParm.parm("projectCategory");
    initProjectPersonalAuditModify();
    $("#btnSelected").click(function () {
        $(this).hide();
        var localIDIds = new Array();
        $("#idsDiv>.photoDiv>img").each(function () {
            localIDIds.push($(this).attr("src"));
        });

        if (localIDIds.length != 2) {
            alert("请上传手持身份证正反面共2张图片");
            return;
        }
        var mediaIDIds = new Array();
        //uploadImgToWX(localIDIds, mediaIDIds,uploadLastImgToWxAndSubmit(mediaIDIds));
        uploadImgToWX(localIDIds, mediaIDIds, function () {
            var realName = $("#realName").val();
            var idCardNumber = $("#idCardNumber").val();
            var mobileNumber = $("#mobileNumber").val();
            var userBankcardId = $("#proveBank").val();

            if (isEmpty(realName)) {
                alert("真实姓名不能为空");
                return;
            }
            var regID = /^1\d$/;
            if (isEmpty(idCardNumber) || !isIdCard(idCardNumber)) {
                alert("身份证号不能为空或者格式不正确");
                return;
            }
            var reg = /^1\d{10}$/;
            if (isEmpty(mobileNumber) || isNaN(mobileNumber) || !reg.test(mobileNumber)) {
                alert("联系电话不能为空,并且必须为11位数字");
                return;
            }
            if (isEmpty(userBankcardId)) {
                alert("收款人银行卡不能为空");
                return;
            }

            //var proveMaterialsJStr='[{"projectId":'+projectId+'"materialCode":"0001","materialPath":"'+mediaProveIds.join(",")+'"}]';
            $.postJSON("/projectProve/modifyProjectProve", {
                "projectId": projectId,
                "certifications.certificationsId": $("#certificationsId").val(),
                "certifications.realName": realName,
                "certifications.idCardNumber": idCardNumber,
                "certifications.idCardFrontImg": $("#idCardFrontImg").attr("src"),
                "certifications.idCardBackImg": $("#idCardBackImg").attr("src"),
                "mobileBind.mobileNumber": mobileNumber,
                "mobileBind.mobileId": $("#mobileId").val(),
                "bankcard.userBankcardId": userBankcardId,
                "bankcard.bindId": $("#projectBankcardId").val()
                //"proveMaterialsJStr": proveMaterialsJStr
            }, function (data) {
                location.href = "projectProveNextAudit.html?projectId=" + projectId +
                    "&proveCheckStatus=" + $("#checkStatus").val() + "&r=" + Math.random();
            });
        });
    });
    $("#personalBank").click(function () {
        location.href = "personalCard.html?projectId=" + projectId + "&checkStatus=" + $("#checkStatus").val() + "&r=" + Math.random();
    });

});

//function uploadLastImgToWxAndSubmit(mediaIDIds){
//    //alert("mediaIDIds="+mediaIDIds);
//    var localProveIds=new Array();
//    $("#useProveImg>.photoDiv>img").each(function(){
//        localProveIds.push($(this).attr("src"));
//    });
//    var mediaProveIds = new Array();
//
//    uploadImgToWX(localProveIds, mediaProveIds, function(){
//        var realName=$("#realName").val();
//        var idCardNumber=$("#idCardNumber").val();
//        var mobileNumber=$("#mobileNumber").val();
//        var userBankcardId=$("#proveBank").val();
//
//        if(isEmpty(realName)){
//            alert("真实姓名不能为空");
//            return ;
//        }
//        var regID = /^1\d$/;
//        if(isEmpty(idCardNumber)||!isIdCard(idCardNumber)){
//            alert("身份证号不能为空或者格式不正确");
//            return ;
//        }
//        var reg = /^1\d{10}$/;
//        if(isEmpty(mobileNumber)||isNaN(mobileNumber) || !reg.test(mobileNumber)) {
//            alert("联系电话不能为空,并且必须为11位数字");
//            return ;
//        }
//        if(isEmpty(userBankcardId)){
//            alert("收款人银行卡不能为空");
//            return ;
//        }
//
//        //var proveMaterialsJStr='[{"projectId":'+projectId+'"materialCode":"0001","materialPath":"'+mediaProveIds.join(",")+'"}]';
//        $.postJSON("/projectProve/modifyProjectProve", {
//            "projectId": projectId,
//            "certifications.certificationsId": $("#certificationsId").val(),
//            "certifications.realName": realName,
//            "certifications.idCardNumber":idCardNumber,
//            "certifications.idCardFrontImg": $("#idCardFrontImg").attr("src"),
//            "certifications.idCardBackImg": $("#idCardBackImg").attr("src"),
//            "mobileBind.mobileNumber": mobileNumber,
//            "mobileBind.mobileId": $("#mobileId").val(),
//            "bankcard.userBankcardId": userBankcardId,
//            "bankcard.bindId": $("#projectBankcardId").val()
//            //"proveMaterialsJStr": proveMaterialsJStr
//        }, function (data) {
//            location.href = "projectProveNextAudit.html?projectId=" + projectId+
//            "&proveCheckStatus="+$("#checkStatus").val()+"&"+new Date().getMilliseconds();
//        });
//    });
//}

function initProjectPersonalAuditModify() {
    $.postJSON("/projectProve/projectProveAllInfo", {
        "projectId": projectId,
        "userId": userId
    }, function (data) {
        $("#checkStatus").val(data.checkStatus);
        var cert = data.certifications;
        $("#realName").val(cert.realName);
        $("#idCardNumber").val(cert.idCardNumber);
        $("#idCardFrontImg").attr("src", cert.idCardFrontImg);
        $("#idCardBackImg").attr("src", cert.idCardBackImg);
        var tel = data.mobileBind;
        $("#mobileNumber").val(tel.mobileNumber);
        $("#certificationsId").val(cert.certificationsId);
        $("#projectBankcardId").val(data.bankcard.bindId);
        $("#mobileId").val(data.mobileBind.mobileId);
        var banksLen = data.bankcardLst.length;
        if (banksLen > 0) {
            for (var i = 0; i < banksLen; i++) {
                var bankVo = data.bankcardLst[i];
                var bankDiv = '<div  id="bank_div_' + bankVo.bindId + '"  onclick=selectCurrentBank(\'' + bankVo.bindId + '\');' +
                    ' style="border-bottom: 1px solid #e5e5e5; position: relative;line-height: .7rem;" >' +
                    '<i style="width: .35rem; display: inline-block; "><img src="img/' + bankVo.bank + '.png" style="width: 100%;"/>' +
                    '</i>' + bankVo.bankName +
                    '<span class="color-gray9 p" style="position: absolute; left: .6rem; top: .3rem; font-size: .2rem;">尾号' +
                    bankVo.cardNo.substr(-4) + '</span>';
                //alert(data.bankcard.userBankcardId+"   "+bankVo.bindId);
                if (data.bankcard.userBankcardId == bankVo.bindId) {
                    bankDiv += '<em id="bank_' + bankVo.bindId + '" class="iconfont color-green" style="display:block;position: absolute; right: .2rem;top: .1rem;">&#xe61b;</em>';
                } else {
                    bankDiv += '<em id="bank_' + bankVo.bindId + '" class="iconfont color-green" style="display:none;position: absolute; right: .2rem;top: .1rem;">&#xe61b;</em>';
                }
                bankDiv += '</div>';
                $("#personalBank").before(bankDiv);
            }
        }
        var pvMaterial = data.proveMaterials["0001"];
        var paths = pvMaterial.materialPath.split(",");
        var nw = new Date().getMilliseconds();
        for (var n = 0; n < paths.length; n++) {
            var useProveImg = '<div id="' + pvMaterial.materialCode + '_' + nw + '_' + n + '" class="photoDiv"><img src="' + paths[n] + '" />';
            //-1审核资料未提交0审核申请中,1审核通过, 2未审核通过
            useProveImg += '<span></span><i onclick="deleteImg(\'' + pvMaterial.materialCode + '_' + nw + '_' + n + '\')">x</i></div>';
            $("#photoDiv").before(useProveImg);
        }


    });
}

function selectCurrentBank(bindId) {
    $("#proveBank").val(bindId);
    //$("input[id*='code']");//id属性包含code的所有input标签
    $("em[id*='bank_']").each(function (i) {
        $(this).css("display", "none");
    });
    $("#bank_" + bindId).css("display", "block");
}

//function deleteProveImg(proveImgId){
//    $("#"+proveImgId).remove();
//}