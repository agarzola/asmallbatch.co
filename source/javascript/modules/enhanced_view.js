(function enhanced_view () {
  var footer = document.getElementById('footer');
  var main = document.getElementById('main');
  document.body.className += ' enhanced';

  window.addEventListener('scroll', determine_main_margin);

  determine_main_margin();

  function determine_main_margin () {
    main.style.marginTop = window.innerHeight + 'px';
  }
})();
