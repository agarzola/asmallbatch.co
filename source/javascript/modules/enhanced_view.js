(function enhanced_view () {
  var footer = document.getElementById('footer');
  var main = document.getElementById('main');
  document.body.className += ' enhanced';

  window.addEventListener('scroll', determine_footer_placement);
  window.addEventListener('scroll', determine_main_margins);

  determine_footer_placement();
  determine_main_margins();

  function determine_footer_placement () {
    var position = window.scrollY;
    if (position > window.innerHeight) {
      footer.className += footer.className.match(/enhanced/) ? '' : ' enhanced';
    } else {
      footer.className = footer.className.replace(/ ?enhanced/g, '');
    }
  }

  function determine_main_margins () {
    main.style.marginTop = window.innerHeight + 'px';
    main.style.marginBottom = window.innerHeight + 'px';
  }
})();
