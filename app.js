var express = require('express'),
    app = express(),
    http  = require('http'),
    Web3 = require('web3');

app.use(express.static('public'));
app.set('port', 3000);
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/login.html');
})
app.use('/script/web3', express.static(__dirname + '/bower_components/web3/dist/'));
app.use('/script/crypto-js', express.static(__dirname + '/bower_components/crypto-js/'));
app.use('/script/bitcore-mnemonic', express.static(__dirname + '/bower_components/bitcore-mnemonic/'));
app.use('/script/bitcore-mnemonic/lib', express.static(__dirname + '/bower_components/bitcore-mnemonic/lib/'));
app.use('/script/bitcore-lib', express.static(__dirname + '/bower_components/bitcore-lib/'));

var serv = http.createServer(app);
serv.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
