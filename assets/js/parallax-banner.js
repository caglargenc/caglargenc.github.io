document.addEventListener('scroll', function() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    var hero = document.querySelector('.hero');
    if (hero) {
        // Move horizontally: x = scrolled * 0.3, y = center
        hero.style.backgroundPosition = (scrolled * 0.1) + 'px center';
    }
});

