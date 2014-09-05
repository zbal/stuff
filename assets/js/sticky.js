$(function() {
  if ($('#main .sidebar').length) {
    // Make menu sticky on scroll
    var top = $('#main .sidebar').offset().top;
    var main = $('#main').offset().top;
    var sticky = function(){
      var scroll = $(window).scrollTop();
      if ((scroll + 20) > top) {
        $('#main .sidebar').addClass('sticky').css({
          'right': 0,
          'top': scroll + 20 - main
        });
      }
      else {
        $('#main .sidebar').removeClass('sticky').css({
          'right': 'auto',
          'top': 'auto'
        });
      }
    };

    sticky();
    $(window).scroll(function() {
       sticky();
    });
  }
});