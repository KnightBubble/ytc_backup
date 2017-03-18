//var base_uri = "http://localhost:9999";// http://10.1.82.111:9999
//var base_uri = "http://60.205.5.161:9999/zcservice-main";// http://10.1.82.111:9999
var base_uri = "http://m.yitongchou.cn/api";
var isDebug = false;
var AMOUNT_RATE = 10000;

/*footer*/
$(document).ready(function () {

    $("#index").click(function () {
        location.href = "../index.html?r=" + Math.random();
    });
    $("#dongtai").click(function () {
        location.href = "../projectProgressAll.html?r=" + Math.random();
    });
    $("#plan").click(function () {
        location.href = "../planList.html?r=" + Math.random();
    });
    $("#project").click(function () {
        location.href = "../illustrate.html?r=" + Math.random();
    });
    $("#mine").click(function () {
        location.href = "../mine.html?r=" + Math.random();
    });


});

/**
 * 给jquery添加方法
 */
jQuery.extend({
    /**
     * postJSON方法
     * @param url
     * @param params
     * @param callback, 选填
     * @param version 选填，默认：1
     * @param type 选填，默认：json
     */
    postJSON: function (url, params, callback, version, type) {

        /*params = $.extend({
         top:'auto',
         left:'auto',
         width:'auto',
         height:'auto',
         opacity:true,
         src:'javascript:false;'
         },params||{});*/
        type = type || "json";
        version = version || 1;

        /*defaultParams = {

         };*/

        if (url.endWith("/")) {
            url = url.substr(0, url.length - 1);
        }

        $.post(base_uri + url + "?v=" + version + "&r=" + Math.random(),
            //$.extend(defaultParams, params),
            params,
            function (data) { // callback
                if (data.status == 200) {
                    if (callback) {
                        callback(data.data);
                    }
                } else if(data.status > 1000) {
                    alert(data.message);
                } else {
                    alert(data.message);
                    //localStorage.removeItem("user_id");
                    //localStorage.removeItem("open_id");
                    //redirect();
                    return;
                }
            },
            type
        );
    },

    /**
     * JSON方法
     * @param url
     * @param params
     * @param callback, 选填
     * @param type 选填，默认：json
     * @param version 选填，默认：1
     */
    myGetJSON: function (url, params, callback, version, type) {

        /*params = $.extend({
         top:'auto',
         left:'auto',
         width:'auto',
         height:'auto',
         opacity:true,
         src:'javascript:false;'
         },params||{});*/
        type = type || "json";
        version = version || 1;

        /*defaultParams = {

         };*/

        if (url.endWith("/")) {
            url = url.substr(0, url.length - 1);
        }

        $.get(base_uri + url + "?v=" + version,
            //$.extend(defaultParams, params),
            params,
            function (data) { // callback
                if (data.status == 200) {
                    if (callback) {
                        callback(data.data);
                    }
                } else {
                    //alert(data.message);
                    localStorage.removeItem("user_id");
                    localStorage.removeItem("open_id");
                    redirect();
                    return;
                }
            },
            type
        );
    }
});

/**
 * 用正则表达式将前后空格用空字符串替代
 * @returns {string}
 */
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 *
 * @param s
 * @returns {boolean}
 */
String.prototype.endWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substring(this.length - s.length) == s)
        return true;
    else
        return false;
    return true;
}

/**
 *
 * @param s
 * @returns {boolean}
 */
String.prototype.startWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substr(0, s.length) == s)
        return true;
    else
        return false;
    return true;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 *
 */
var redirect = function () {
    $.postJSON("/wx/getOauthInfo",
        {
            "reUrl": location.href
        },
        function (data) {
            //alert("redirect url : " + data.url);
            $(window.location).attr('href', data.url);
        }
    );
};


function isEmpty(str) {
    if (str == undefined || str == null || str.toString().trim() == "") {
        return true;
    }
    return false;
}

function fromWX(url, param, callback) {
    if (null != url && callback) {
        $.postJSON(url, param,
            function (data) {
                wx.config({
                    debug: data.debug || false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: [ // 必填，需要使用的JS接口列表, 所有要调用的 API 都要加到这个列表中
                        "onMenuShareTimeline",
                        "onMenuShareAppMessage",
                        "onMenuShareQQ",
                        "onMenuShareWeibo",
                        "onMenuShareQZone",
                        "chooseImage",
                        "previewImage",
                        "uploadImage",
                        "downloadImage"
                    ]
                });

                callback(data);
            }
        );
    }
}

function isAmount(str) {
    var re = /^\+?(\d+(\.\d{1,2})?)$/;
    return !isNaN(str) && !isEmpty(str) && re.test(str);
}

function isMobile(str) {
    var re = /^1\d{10}$/;
    return re.test(str);
}

function isEmail(str) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    return re.test(str);
}
/*
 根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
 地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
 出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
 顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
 校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

 出生日期计算方法。
 15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
 2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
 下面是正则表达式:
 出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
 身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
 15位校验规则 6位地址编码+6位出生日期+3位顺序号
 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

 校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
 公式(1)中：
 i----表示号码字符从由至左包括校验码在内的位置序号；
 ai----表示第i位置上的号码字符值；
 Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
 i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
 Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1

 */
//身份证号合法性验证
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
function isIdCard(code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    }

    else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    }
    else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            //var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    //if(!pass) {
    //    alert(tip);
    //}
    return pass;
}

/**
 * 发送短信验证码
 * @param tel
 * @param userId
 * @param type
 * @param callback
 */
function sendSms(tel, userId, type, callback) {
    $.postJSON("/mobile/sendSmsCode", {
        "mobile": tel,
        "userId": userId,
        "type": type    //0-手机号验证 1-忘记密码 2-注册
    }, function (data) {
        if (data.code == "SUCCESS") {
            if (callback) {
                callback();
            }
        } else {
            alert("短信发送失败，请稍后再试");
        }
    });
}

/*
 var t=setTimeout("timedCount()",1000);
 /!**
 *
 *!/
 function timedCount(tim)  {
 var time=parseInt($(tim).val());
 document.getElementById("ttt").innerHTML = time;
 if( t !=null && time==0){clearTimeout(t);return;}
 time--;
 $(tim).innerHTML(time);
 t=setTimeout("timedCount(tim)",1000)
 }*/

