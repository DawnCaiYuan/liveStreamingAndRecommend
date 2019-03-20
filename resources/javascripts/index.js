$(function () {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    (function () {
        var pathname = window.location.pathname.substring(1);
        $('#sidebar-wrapper a[href="' + pathname + '"]').addClass('active');
    })();

    // $(".nav li .active").each(function(index) {
    //     $(".nav  li .active").eq(index).addClass("aClicked");
    // })

    // $(".nav li a.active").each(function(index) {
    //     $(this).click(function() {
    //         $(".nav  li").eq(index).addClass("aClicked").siblings().removeClass("navClicked");
    //     })
    // })

});

$('#myCarousel').carousel('pause')
