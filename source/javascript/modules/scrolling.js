(function () {
  window.zenscroll = require('zenscroll');

  var header = document.getElementById('header');
  var anchor_link = header.getElementsByTagName('a')[0];
  var footer = document.getElementById('footer');
  var first_field = footer.getElementsByTagName('input')[0];
  var footer_target = document.getElementById('tell-us-about-your-project');

  anchor_link.addEventListener('focus', function (event) {
    if (window.zenscroll && document.body.className.match(/enhanced/)) {
      window.zenscroll.toY(0);
    }
  });

  anchor_link.addEventListener('mousedown', focus_on_form);
  anchor_link.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      focus_on_form(event);
    }
  });

  function focus_on_form (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    if (window.zenscroll) {
      window.zenscroll.to(footer_target);
      var timeout = 1000;
    } else {
      var timeout = 0;
    }

    setTimeout(function () { first_field.focus() }, timeout);
  }
  // first_field.addEventListener('focus', function (event) {
  //   if (document.body.className.match(/enhanced/)) {
  //     window.zenscroll.to(footer_target);
  //   }
  // });
})();
