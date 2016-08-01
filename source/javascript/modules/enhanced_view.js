(function enhanced_view () {
  if (!window.scrollY) { return; }
  var header = document.getElementById('header');
  var main = document.getElementById('main');
  var footer = document.getElementById('footer');

  document.body.className += ' enhanced';
  center_content(header);
  set_main_margin();
  center_content(footer);

  window.addEventListener('resize', function () {
    center_content(header);
  });
  window.addEventListener('resize', set_main_margin);
  window.addEventListener('resize', function () {
    center_content(footer);
  });
  window.addEventListener('scroll', set_footer_visibility);

  function set_main_margin () {
    if (Modernizr.mq('(min-width: 850px)')) {
      main.style.marginTop = window.innerHeight + 'px';
      main.style.marginBottom = window.innerHeight + 'px';
    } else {
      main.style.marginTop = '0px';
      main.style.marginBottom = '0px';
    }
  }

  function center_content (el) {
    var container = el.getElementsByClassName('container')[0];
    el.style.paddingTop =
      ((el.clientHeight - container.clientHeight) / 2)
      + 'px';
  }

  function set_footer_visibility () {
    if (window.scrollY > window.innerHeight) {
      footer.style.zIndex = 1;
    } else {
      footer.style.zIndex = 0;
    }
  }
})();
