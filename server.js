var express = require('express');
var path = require('path');

var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + "./static"));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('index');
});

var server = app.listen(3000, function() {
	console.log('listening to port 3000');
});

var io=require('socket.io').listen(server);

var users = [];

io.sockets.on('connection', function(socket) {

	socket.on('newUser', function(userData){
		users.push({
			socketID: socket.id,
			name: userData.userName
		});
		io.emit('updateUserList', users);
	});

	socket.on('newMessage', function(userData) {
	io.emit('updateMessageBoard', userData );
	});



	socket.on('disconnect', function() {
		for(var index in users) {
			if(users[index].socketID == socket.id) {
				users.splice(index, 1);
				io.emit('updateUserList', users);
			}
		}
	});
});













