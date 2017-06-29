(function () {
    var completed = function () {
        setTimeout(function () {
            var RADIX = 10.8;
            var html = document.documentElement;
            var windowWidth = html.clientWidth;
            html.style.fontSize = windowWidth / RADIX+ 'px';
            html.classList.add('site-sales');
        }, 16);
    };

    var isAPP = function () {
      var ua = navigator.userAgent;
      console.log(ua);
      var html = document.documentElement;
      var reg = new RegExp('lianshang_([a-z]+)\/(.+)$', 'g');
      var result = reg.exec(ua) || [];
      if ( result[1] ) {
        html.classList.add('platform-' + result[1]);
      }
    };

    completed();

    isAPP();
    window.onresize = completed;
})();
