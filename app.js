var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {
    socket.emit('message', 'Vous êtes bien connecté !');

    socket.on('petit_nouveau', function(pseudo) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('message', pseudo + " vient de se connecter !");
    });


    socket.on('message', function (message) {
        console.log(socket.pseudo + ' me parle ! Il me dit : ' + message);
        socket.emit('message', "Me: " + message);
        socket.broadcast.emit('message', socket.pseudo + ": " + message);

    });
});


server.listen(8080);