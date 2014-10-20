window['iso'] = {
  report: function(result) {
    if (iso.manual) {
      if (this._result) send(this._result);
      else {
        document.body.innerHTML = (
          document.body.innerHTML +
          '<div>' +
            '<hr></hr>' +
            '<h2>Test result:</h2>' +
            '<p>' + result + '</p>' +
            '<button onclick="iso.report()">Okay</button>' +
          '</div>'
        );
        this._result = result;
      }
    }
    else {
      send(result);
    }

    function send(result) {
      document.location = (
        '/?' +
        'result=' + encodeURIComponent(result) + '&' +
        'test=' + iso.name
      );
    }
  }
};
