console.log('hello');

var node = document.querySelector('#btn01');

var logger = {
  log: function(s) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST' , 'http://localhost:9090/log');
    xhr.send(s);
  }
}

node.addEventListener('click', function($event) {
  console.log('clicked');
  logger.log('foogoo');
});
