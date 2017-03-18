/*用户页面 -> projectAuditSchedule.html*/

$(document).ready(function () {

    var projectId = UrlParm.parm("projectId");

    $("#submit").click(function () {
        if (unSelected) {
            //alert("select ");
            return;
        }

        var collectGoalAmount = $("#fund").val();
        if (!isAmount(collectGoalAmount)) {
            alert("请输入筹款资金, 筹款资金最多保留2位小数,资金必须大于0。");
            return;
        }
        collectGoalAmount = Number(collectGoalAmount) * AMOUNT_RATE; //单位：毫厘
        var purpose = $("#purpose").val();
        var title = $("#title").val();
        var collectEndTsStr = $("#collectEndTsStr").text();
        var detailInformation = $("#contents").val();

        $.post(base_uri + "/projects/project", {
            "projectType": "2",
            "projectCategory": "2_1",
            "purpose": purpose,
            "collectGoalAmount": collectGoalAmount,
            "title": title,
            "detailInformation": detailInformation,
            "collectEndTsStr": collectEndTsStr
        }, function (data) {
            // callback
            //alert(data.status+"   "+data.message);
            if (data.status == 200) {
                location.href = "projectCreateComplete.html?r=" + Math.random();
            } else {
                //alert(data.message);
            }
        }, "json");
    });


    $(".footer .l>i").click(function (event) {
        if ($(this).hasClass('color-gray9')) {
            $(this).addClass('color-orange2');
            $(this).removeClass('color-gray9');
        } else {
            $(this).addClass('color-gray9');
            $(this).removeClass('color-orange2');
        }
    });
    $("#fenxian").click(function () {
        $(".theme-popover-mask").show(300);
        $(".fenxian").show(500);
    });
    $(".fenxian>button").click(function () {
        $(".theme-popover-mask").hide(500);
        $(".fenxian").hide(300);
    });
    $("#manage").click(function () {
        $(".theme-popover-mask").show(300);
        $(".manage").show(500);
    });
    $(".manage>button").click(function () {
        $(".theme-popover-mask").hide(500);
        $(".manage").hide(300);
    });

    $("#del").click(function () {
        $(".theme-popover-mask").show(300);
        $(".boxin1").show(500);
        $(".manage").hide();
    })
    $(".boxin1>div>button").click(function () {
        $(".theme-popover-mask").hide(500);
        $(".boxin1").hide(300);
    });

})


