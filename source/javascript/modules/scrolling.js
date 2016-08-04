(function () {
  window.zenscroll = require('zenscroll');

  var header = document.getElementById('header');
  var anchor_link = header.getElementsByTagName('a')[0];

  anchor_link.addEventListener('focus', function (event) {
    if (document.body.className.match(/enhanced/)) {
      window.zenscroll.toY(0);
    }
  })

  var footer = document.getElementById('footer');
  var email = footer.getElementsByTagName('a')[0];
  var footer_target = document.getElementById('tell-us-about-your-project');

  email.addEventListener('focus', function (event) {
    if (document.body.className.match(/enhanced/)) {
      window.zenscroll.to(footer_target);
    }
  });
})();