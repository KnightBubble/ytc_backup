/*用户页面 -> projectAuditSchedule.html*/
var projectId = UrlParm.parm("projectId");
//userId从cookie中读取
var userId = localStorage.getItem("user_id");
$(document).ready(function () {
    var projectType = UrlParm.parm("projectType");
    var projectCategory = UrlParm.parm("projectCategory");
    initProjectPersonalAuditStatic();
    $("#btnSelected").click(function () {
        location.href = "projectProveNextAudit.html?projectId=" + projectId +
            "&proveCheckStatus=" + $("#checkStatus").val() + "&r=" + Math.random();
    });
});

function initProjectPersonalAuditStatic() {
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

        var bankVo = data.bankcard;
//alert(data.bankcard.cardNo);
        var bankDiv = '<div ' +
            ' style="border-bottom: 1px solid #e5e5e5; position: relative;line-height: .7rem;" >' +
            '<i style="width: .35rem; display: inline-block; "><img src="img/' + bankVo.bank + '.png" style="width: 100%;"/>' +
            '</i>' + bankVo.bankName +
            '<span class="color-gray9 p" style="position: absolute; left: .6rem; top: .3rem; font-size: .2rem;">尾号' +
            bankVo.cardNo.substr(-4) + '</span>';
        bankDiv += '<em id="bank_' + bankVo.bindId + '" class="iconfont color-green" style="display:block;position: absolute; right: .2rem;top: .1rem;">&#xe61b;</em>';
        bankDiv += '</div>';
        $("#banks").append(bankDiv);

        /*var pvMaterial=data.proveMaterials["0001"];
         var paths=pvMaterial.materialPath.split(",");
         for(var n=0;n<paths.length;n++){
         var useProveImg = '<div id="'+pvMaterial.materialCode+'_'+n+'"  class="photoDiv">' +
         ' <img src="'+paths[n]+'" />';
         //-1审核资料未提交0审核申请中,1审核通过, 2未审核通过
         useProveImg+='</div>';
         $("#useProveImg").append(useProveImg);
         }*/

    });
}

