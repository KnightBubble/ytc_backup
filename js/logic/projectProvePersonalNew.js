/*用户页面 -> projectAuditSchedule.html*/
var projectId = UrlParm.parm("projectId");
var userId = localStorage.getItem("user_id");

$(document).ready(function () {
    var projectType = UrlParm.parm("projectType");
    var projectCategory = UrlParm.parm("projectCategory");
    var proveCheckStatus = UrlParm.parm("proveCheckStatus");

    $("#btnSelected").click(function () {
        //$(this).hide();
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

        var localIDIds = new Array();
        $("#idsDiv>.photoDiv>img").each(function () {
            localIDIds.push($(this).attr("src"));
        });

        if (localIDIds.length != 2) {
            alert("请上传手持身份证正反面共2张图片");
            return;
        }

        var mediaIDIds = new Array();
        uploadImgToWX(localIDIds, mediaIDIds, function () {
            $.postJSON("/projectProve/projectProve", {
                "projectId": projectId,
                "certifications.realName": realName,
                "certifications.idCardNumber": idCardNumber,
                "certifications.idCardFrontImg": mediaIDIds[0],//$("#idCardFrontImg").attr("src"),
                "certifications.idCardBackImg": mediaIDIds[1], //$("#idCardBackImg").attr("src"),
                "mobileBind.mobileNumber": mobileNumber,
                "bankcard.userBankcardId": userBankcardId
                //"proveMaterialsJStr":proveMaterialsJStr
            }, function (data) {
                location.href = "projectProveNextAudit.html?projectId=" + projectId +
                    "&proveCheckStatus=" + $("#checkStatus").val() + "&r=" + Math.random();
            });
        });
    });

    initProjectPersonalAuditNew();
//选择身份证照片
    $("#chooseIdImg").click(function () {
        chooseImgs("addIdDiv");
    });
    //资金用途照片
    $("#chooseUseImg").click(function () {
        chooseImgs("addUseDiv");
    });

    $("#personalBank").click(function () {
        location.href = "personalCard.html?projectId=" + projectId + "&checkStatus=" + $("#checkStatus").val() + "&r=" + Math.random();
    });

});

function initProjectPersonalAuditNew() {
    $.postJSON("/projectProve/projectProveAllInfo", {
        "projectId": projectId,
        "userId": userId
    }, function (data) {
        $("#checkStatus").val(data.checkStatus);
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
                if (i == 0) {
                    $("#proveBank").val(bankVo.bindId);
                    bankDiv += '<em id="bank_' + bankVo.bindId + '" class="iconfont color-green" style="display:block;position: absolute; right: .2rem;top: .1rem;">&#xe61b;</em>';
                } else {
                    bankDiv += '<em id="bank_' + bankVo.bindId + '" class="iconfont color-green" style="display:none;position: absolute; right: .2rem;top: .1rem;">&#xe61b;</em>';
                }
                bankDiv += '</div>';
                $("#personalBank").before(bankDiv);
            }
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
