window['iso'] = {
  ok: function(msg) {
    this.report('Success: ' + msg);
  },

  fail: function(msg) {
    this.report('Failure: ' + msg);
  },

  insertHtml: function() {
    if (!this._htmlInserted) {
      document.body.innerHTML = (
        document.body.innerHTML +
        '<div>' +
          '<hr></hr>' +
          '<h2>' + this.name + ' result:</h2>' +
          '<p>' + this.result + '</p>' +
          '<button onclick="iso.send()">Okay</button>' +
        '</div>'
      );
      this._htmlInserted = true;
    }
  },

  report: function(result) {
    if (this.result !== undefined) return;
    this.result = result;
    if (iso.manual) {
      this.insertHtml();
    }
    else {
      this.send();
    }
  },

  send: function() {
    document.location = (
      '/?' +
      'result=' + encodeURIComponent(this.result) + '&' +
      'test=' + this.name
    );
  }
};
