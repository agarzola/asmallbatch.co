(function () {
  window.zenscroll = require('zenscroll');

  var header = document.getElementById('header');
  var anchor_link = header.getElementsByTagName('a')[0];
  var footer = document.getElementById('footer');
  var first_field = footer.getElementsByTagName('input')[0];
  var footer_target = document.getElementById('tell-us-about-your-project');

  anchor_link.addEventListener('focus', function (event) {
    if (document.body.className.match(/enhanced/)) {
      window.zenscroll.toY(0);
    }
  });

  anchor_link.addEventListener('click', function (event) {
    if (document.body.className.match(/enhanced/)) {
      this.blur()
      event.stopImmediatePropagation();
      event.preventDefault();
      window.zenscroll.to(footer_target, null, function () {
        first_field.focus();
      });
    }
  });

  first_field.addEventListener('focus', function (event) {
    if (document.body.className.match(/enhanced/)) {
      window.zenscroll.to(footer_target);
    }
  });
})();
