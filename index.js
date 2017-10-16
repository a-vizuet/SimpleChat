var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var users = [];
var testing;

function deleteUser(userToDelete){
	let index = users.findIndex((user) => {
		return user.id === userToDelete.id;
	});
	if(index > -1) users.splice(index, 1);
}

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname+'/public/index.html');
});

app.get('/:username', (req, res) => {
	if(testing.username != undefined) res.sendFile(__dirname+'/public/chat.html');
	else res.send({message: 'No tienes permitido ésto.'});
});

io.on('connection', (socket) => {
	
	// public chat
	socket.on('add user', (user) => {
		socket.username = user.username;
		users.push(user);
		io.emit('this.connection', {username: 'Bot', message: 'Se ha conectado el usuario '+socket.username});
		console.log('Se ha conectado el usuario '+socket.username);
		io.emit('get users', users);

		testing = socket;
	});

	socket.on('chat message', (msg) => {
		io.emit('chat message', {username: socket.username, message: msg});
	});

	socket.on('disconnect', () => {
		if(socket.username != undefined){
			deleteUser({id: socket.id, username: socket.username});
			console.info('Se ha desconectado el usuario '+socket.username);
			io.emit('disconnect', {username: 'Bot', message: 'Se ha desconectado el usuario '+socket.username, users: users});
			io.emit('get users', users);
		}
	});

	// private chat
	socket.on('private message', (data) => {
		socket.broadcast.to(data.to).emit('private message', {message: 'k'});
	})

});

server.listen(port, (err) => {
	if(err) console.error("Ha habido un problema al iniciar el servidor :( Error: "+err);
	else console.info("Se ha iniciado el server en http://localhost:"+port+"!!");	
})
