(function() {
  var stem = {
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
            '<h2>' + this.testName + ' result:</h2>' +
            '<p>' + this.result + '</p>' +
            '<button id="okay">Okay</button>' +
          '</div>'
        );
        this._htmlInserted = true;
        document.getElementById('okay').onclick = this.send.bind(this);
      }
    },
  
    report: function(result) {
      if (this.result !== undefined) return;
      this.result = result;
      if (stem.manual) {
        this.insertHtml();
      }
      else {
        this.send();
      }
    },
  
    send: function() {
      document.location = (
        '/__stem?' +
        'result=' + encodeURIComponent(this.result) + '&' +
        'test=' + this.testName
      );
    }
  };

  var test = JSON.parse(
    /stem=(\{[^}]+\})/.exec(document.cookie)[1]
  );
  
  for (var key in test) {
    stem[key] = test[key];
  }

  if (typeof exports == 'undefined') {
    window['stem'] = stem;
  }
  else {
    module.exports = stem;
  }
})();
