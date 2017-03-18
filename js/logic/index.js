/*用户页面 -> mine.html*/
////userId从cookie中读取
//var userId="474b";
$(document).ready(function () {
    init();

    function init() {
        $.ajax({
            type: 'post',
            url: 'http://m.yitongchou.cn/api/index',
            data: {
                page: 1,
                pageSize: 10
            },
            dataType: 'json',
            timeout: 300,
            success: function (res) {
                console.log(res);
                dealData(res);
            },
            error: function (xhr, type) {
                alert('Ajax error!')
            }
        })
    }

    function dealData(res) {
        if (res.status == 200) {
            var swiper = res.data.headPic;
            var imgDom = "";
            for (var i = 0; i < swiper.length; i++) {
                imgDom += "<img src=" + swiper[i] + " class='swiper-slide'>";
            }
            $('.swiper-wrapper').html(imgDom);
            initSwiper();
            // var data = formatData(res.data);
            var html = template('recommend-list', res.data);
            $('.page-list').html(html);
            $('.list').on('click', function () {
                var projectId = $(this).attr('data-project-id');
                location.href = "projectDetail.html?projectId=" + projectId + "&r=" + Math.random();
            });
        }
    }

    // function formatData(data){
    //     for(var i =0;i<data.pageData.length;i++){
    //         data.pageData[i].images =  data.pageData[i].images.split(',');
    //     }
    //     return data;
    // }

    function initSwiper() {
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            loop: true,
            autoplay: 2000,
            // 如果需要分页器
            pagination: '.swiper-pagination',

            // 如果需要前进后退按钮
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',

            // 如果需要滚动条
            scrollbar: '.swiper-scrollbar',
        })
    };

});