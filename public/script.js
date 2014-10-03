(function($){

    var $container = $('<div></div>')
      .addClass('capa-pin-store-container')
      .addClass('well')
      .html('<h1>Stored CAPAs</h1>')
      .appendTo($('.container'));

    var $status = $('<p><strong><em>Loading...</em></strong></p>').appendTo($container);

    $container.on('click', '.capa-record > button', function(ev){
      ev.preventDefault();
      var id = $(ev.target).parent().data('id');
      $.ajax({
        type: 'DELETE',
        url: '/api',
        data: {id: id}
      }).done(function(){
        location.reload();
      });
    });

    $.ajax({
      type:"GET",
      url: "/api?cb=?",
      dataType: "jsonp"
    })
      .done(function(data){
        if(data.length > 0){
          data = data.reverse();
          $.each(data, function(i,e){
            $capa = $('<div></div>');
            $capa.addClass('capa-record');
            $capa.data('id', e._id);
            $capa.html(e.data.replace(/\r\n/g, '<br>'));
            $capa.append($('<br><button class="btn btn-danger btn-sm">Delete</button>')).appendTo($container);
          });
          $status.hide();
        }else{
          $status.html('<strong><em>None found.</em></strong>');
        }
      });

})(jQuery);
