$(function() {
  var viewport = $(window).height();
  var position = $('#main .hero').offset();
  $('#main .hero').css({
      'max-height': viewport - position.top,
      'overflow': 'hidden'
  });
});