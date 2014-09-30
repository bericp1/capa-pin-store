// ==UserScript==
// @name       CAPA Pin Store Getter
// @namespace  http://brandonep.org
// @version    0.1
// @match      http://capa-new.colorado.edu/capa-bin/classsbin
// @copyright  2014 Brandon Eric Phillips
// ==/UserScript==


(function(){

  // a function that loads jQuery and calls a callback function when jQuery has finished loading
  var addJQuery = function(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
      var script = document.createElement("script");
      script.textContent = "window.capaPinStore$=jQuery.noConflict(true);(" + callback.toString() + ")();";
      document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
  };

  var main = function(){

    var $ = window.capaPinStore$;

    var $container = $('<div></div>');
    $container.css({
      'position': 'fixed',
      'top': 150,
      'right': 8,
      'border': 'black solid 5px',
      'padding': 20,
      'width': '30%',
      'box-sizing': 'border-box',
      'text-align': 'center'
    });

    $container.html('<h1>Stored CAPAs</h1>');

    var $loading = $('<p><strong><em>Loading...</em></strong></p>');
    $container.append($loading).appendTo($('body'));

    $.ajax({
      type:"GET",
      //url: "//capa-pin-store.herokuapp.com/cb=?",
      url: "//chloe.district:5000/?cb=?",
      dataType: "jsonp"
    })
      .done(function(data){
        $loading.hide();
        $.each(data, function(i,e){
          $container.append('<p>' + e.data + '</p>');
        });
      });

  };

  addJQuery(main);

})();
