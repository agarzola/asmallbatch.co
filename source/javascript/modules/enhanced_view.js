(function enhanced_view () {
  var header = document.getElementById('header');
  var main = document.getElementById('main');
  var footer = document.getElementById('footer');

  window.addEventListener('scroll', set_main_margin);

  document.body.className += ' enhanced';
  set_main_margin();
  set_header_padding();

  function set_main_margin () {
    main.style.marginTop = window.innerHeight + 'px';
  }

  function set_header_padding () {
    var container = header.getElementsByClassName('container')[0];
    console.log(header.clientHeight, container.clientHeight, ((header.clientHeight - container.clientHeight) / 2))
    header.style.paddingTop = ((header.clientHeight - container.clientHeight) / 2) + 'px';
  }
})();
