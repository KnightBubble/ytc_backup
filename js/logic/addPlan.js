var planId = UrlParm.parm("planId");
var preDeposit = parseFloat(UrlParm.parm("preDeposit"));//毫厘
var planName = UrlParm.parm("planName");
var num = 0;
var totAmt = 0;
var cnt = 0;
$(document).ready(function () {
    var userId = UrlParm.parm("userId") || localStorage.getItem("user_id");
    if(null == userId) {
        redirect();
    }

    initAddPlan(userId, planId);

    $("#addPersons").click(function () {
        $(".theme-popover-mask").show(300);
        $(".popupbox").show(500);
    })
    $(".popupbox>i.iconfont").click(function () {
        resetAndHideAddPersons();
    })
    $(".popupbox button").click(function () {
        addPerson();
        resetAndHideAddPersons();
    })


    $("#wxCharge").click(function () {
        var allName = "";
        var userJson = '[';
        var benren = 0;
        var validateMsg = "";
        var count = 0;
        $("form>ul>li>input").each(function (i) {
            var val = $(this).val();
            var id = $(this).attr("id");

            ++count;

            if (id.startWith("nm")) {
                if (val.trim() == "") {
                    validateMsg = "姓名不能为空！";
                    return;
                }
                userJson += '{"realName":"' + val + '",';
                allName += val + ",";
            }
            if (id.startWith("id")) {
                if (val.trim() == "") {
                    validateMsg = "身份证号不能为空！";
                    return;
                }
                if (!isIdCard(val)) {
                    validateMsg = "身份证号格式不正确！";
                    return;
                }
                userJson += '"idCardNumber":"' + val + '",';
                userJson += '"preDeposit":"' + preDeposit + '",';

                var rt = $("#rt" + id.substr(2, id.length)).val();
                userJson += '"relation":"' + rt + '"},';

                if (rt == '10') {
                    benren++;
                }
            }

            /*if (id.startWith("tel")) {
                if (val.trim() != "" && !isMobile(val)) {
                    validateMsg = "手机号格式不正确！";
                    return;
                }
                userJson += '"preDeposit":"' + preDeposit * AMOUNT_RATE + '",';
                userJson += '"mobileNumber":"' + val + '",';

                var nm = id.substr(3, id.length);
//                alert("nm="+nm);
                var rt = $("#rt" + nm).val();
                userJson += '"relation":"' + rt + '"},';

                if (rt == '10') {
                    benren++;
                }
            }*/
        });
        userJson = userJson.substr(0, userJson.length - 1);
        userJson += "]";
        if (validateMsg != "") {
            alert(validateMsg);
            return;
        }
        //alert("userJson="+userJson);
        //alert(allName);
        //alert("当前需要支付金额：" + totAmt / AMOUNT_RATE + "元，方便测试：默认改为：0.01元");
        //totAmt = 100; //毫厘  0.01分

        if (benren > 1) {
            alert("关系为本人的至多只能选择一个,您选择了" + benren + "个");
        }
        $.postJSON("/plans/addPlan", {
            "userJson": userJson,
            "planId": planId,
            "userId": userId,
            "totalFee": totAmt, //单位:毫厘
            "openId": localStorage.getItem("open_id")
        }, function (data) {
            wx.chooseWXPay({
                timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.paySign, // 支付签名
                success: function (res) {
                    // 支付成功后的回调函数
                    if (res.errMsg == "chooseWXPay:ok") {
                        //支付成功
                        location.href = "../../planPaySuccess.html?planId=" + planId + "&planName=" + planName + "&allName=" + allName + "&r=" + Math.random();
                        //alert($.stringify(res));
                    } else {
                        //alert(res.errMsg);
                    }
                },
                cancel: function (res) {
                    //alert(res+"*");
                    //支付取消
                },
                error: function (res) {
                    //alert(res+"-");
                }
            });
        });
        //alert(userJson);
    });
});

var currUserMobileNumber = "";

function initAddPlan(userId, planId) {
    $.postJSON("/plans/validateAndShowUser", {
        "userId": userId,
        "planId": planId
    }, function (data) {
        var cert = data.certifications;
        var realNm = cert == null ? "" : cert.realName;
        var realId = cert == null ? "" : cert.idCardNumber;
        //alert(cert.realName);
        //alert(data.userBalance);
        var mobileNumber = data.mobileBind == null ? "" : data.mobileBind.mobileNumber;
        currUserMobileNumber = mobileNumber;
        var frm = "";
        if (data.userBalance != null) {
            frm = generateBlankFrm(mobileNumber);
        } else {
            frm = generateFrm(realNm, realId, mobileNumber);
        }
        $("#addPersonFrm").before(frm);
        //$("#totAmt").text(preDeposit / AMOUNT_RATE);
    });

}


function resetAndHideAddPersons() {
    $(".theme-popover-mask").hide(500);
    $(".popupbox").hide(300);
    $("#realNm").val("");
    $("#realId").val("");
    $("#realMb").val("");
    $("#relationType").val("0");
}

function generateBlankFrm(mobileNumber) {
//<select class="zhengshi" id="relationType">
//        <option value="4">志愿者</option>
//        <option value="0">亲人</option>
//        <option value="1">朋友</option>
//        </select>
    var frm = '<hr id="hr' + num + '"/><form id="frm' + num + '"><i class="iconfont" onclick="delPerson(\'' + num + '\')">&#xe610;</i>' +
        '<ul>' +
        '<li><span>关系：</span>' +
        '<select class="zhengshi" id="rt' + num + '">' +
        '<option value="10" selected>本人</option>' +
        '<option value="0">亲人</option>' +
        '</select></li>' +
        '<li><span>真实姓名：</span>' +
        '<input type="text" id="nm' + num + '" placeholder="与身份证姓名保持一致"  /></li><li>' +
        '<span>身份证号：</span><input placeholder="仅用于申请保障，会严格保密" type="tel" id="id' + num + '" />' +
        '</li>' +
        /*'<li><span>手机号：</span>' +
        /!*'<input type="tel" id="tel' + num + '" disabled="disabled"' +*!/
        '<input type="tel" id="tel' + num +
        ' value="' + mobileNumber + '" placeholder="仅用于申请保障，会严格保密"  />' +
        '</li>' +*/
        '</ul></form>';
    num++;
    totAmt += preDeposit;
    cnt++;
    if(isNaN(totAmt)){
        totAmt = preDeposit;
    }
    $("#totAmt").text(totAmt / AMOUNT_RATE);
    return frm;
}

function generateFrm(realNm, realId, realMb, relationType) {
    $("#rt" + num).val(relationType);
    var frm = '<hr id="hr' + num + '"/><form id="frm' + num + '"><i class="iconfont" onclick="delPerson(\'' + num + '\')">&#xe610;</i>' +
        '<ul>' +
        '<li><span>关系：</span>' +
        '<select class="zhengshi" id="rt' + num + '">' +
        '<option value="10" >本人</option>' +
        '<option value="0">亲人</option>' +
        '</select></li>' +
        '<li><span>真实姓名：</span>' +
        '<input type="text" id="nm' + num + '"   value="' + realNm + '"/></li><li>' +
        '<span>身份证号：</span><input  type="tel" id="id' + num + '" value="' + realId + '"/>' +
        '</li>';
    /*frm += '<li><span>手机号：</span>' +
        '<input type="tel" id="tel' + num + '"  value="' + realMb + '"/>' +
        '</li>';*/
    frm += '</ul></form>';
    num++;
    totAmt += preDeposit;
    cnt++;
    if(isNaN(totAmt)){
        totAmt = preDeposit;
    }
    $("#totAmt").text(totAmt / AMOUNT_RATE);
    return frm;
}

function addPerson() {
    var realNm = $("#realNm").val();
    var realId = $("#realId").val();
    var realMb = $("#realMb").val();
    var relationType = $("#relationType").val();
    var frm = generateFrm(realNm, realId, realMb, relationType);
    $("#addPersonFrm").before(frm);
}

function delPerson(delNum) {
    $("#frm" + delNum).remove();
    $("#hr" + delNum).remove();
    totAmt -= preDeposit;
    cnt--;
    if(isNaN(totAmt)){
        totAmt = preDeposit;
    }
    $("#totAmt").text(totAmt / AMOUNT_RATE);
}
