var socket = io();
var xss = /[<].+[>]+(...)+[<&frasl].+[>]|[<].+[>]+[<&frasl].+[>]/i;

function addUser(){
	let user = $('#username').val();
	$('#alert1').hide();
	
	if(xss.test(user)){
		$('#alert1').show();
		$('#username').val("");
	}else{
		let usertrim = $('#username').val().trim();

		if(usertrim){
			let username = $('#username').val();
			$('.login').hide();
			$('.chat').show();
			socket.username = username;
			socket.emit('add user', {id: socket.id, username: username});
		}else{
			$('#alert1').show();
			$('#username').val("");	
		}
	}	
}

function addMessage(){
	let message = $('#text').val(); 
	$('#alert2').hide();

	if(xss.test(message)){
		$('#alert2').show();
		$('#text').val("");
	}else{
		let trimmessage = $('#text').val().trim();

		if(trimmessage){
			socket.emit('chat message', message);
			$('#text').val("");
		}else{ 
			$('#alert2').show();
			$('#text').val("");
		}
	}
}

function addUserKey(){
	var once=0;
	$(document).keyup((e) => { 
		if(e.keyCode == 13 && once == 0) 
			addUser();
			once = 1;
	});
}

function addMessageKey(){
	var once=0;
	$(document).keyup((e) => { 
		if(e.keyCode == 13 && once == 0) 
			addMessage();
			once = 1;
	});
}

function privateMessageChat(v1, v2){
	$('#generalMessage').hide();
	$('#privateMessage').show();
	$('#idPrivate').val(v1);
	$('#usernamePrivate').val(v2);
}

function addPrivateMessage(){
	let message = $('#textPrivate').val(); 
	let idTo = $('#idPrivate').val();
	let usernameTo = $('#usernamePrivate').val();
	$('#alert3').hide();

	if(xss.test(message)){
		$('#alert3').show();
		$('#textPrivate').val("");
	}else{
		let trimmessage = $('#textPrivate').val().trim();

		if(trimmessage){
			let messagehtml = `<div class="message alert alert-warning"><strong>Tú</strong> le has enviado un mensaje privado a <strong>${usernameTo}</strong>: <p class="pmessage">${message}</p></div>`;
			socket.emit('private message',{idTo: idTo, usernameTo: usernameTo, from: socket.username, message: message});
			document.querySelector('#messages').scrollTop = document.querySelector('#messages').scrollHeight;
			$('#messages').append(messagehtml);
			$('#textPrivate').val("");
			$('#generalMessage').show();
			$('#privateMessage').hide();
			$('#idPrivate').val("");
			$('#usernamePrivate').val("");
		}else{ 
			$('#alert3').show();
			$('#textPrivate').val("");
		}
	}
}

function addPrivateMessageKey(){
	var once=0;
	$(document).keyup((e) => { 
		if(e.keyCode == 13 && once == 0) 
			addPrivateMessage();
			once = 1;
	});
}


socket.on('this.connection', (connected) => {
	let connectedhtml = `<div class="message alert alert-info"><strong>${connected.username}</strong> dice: <p class="pmessage">${connected.message}</p></div>`;
	$('#messages').append(connectedhtml);
});

socket.on('chat message', (msg) => {
	if(socket.username == msg.username){
		let messagehtml = `<div class="message alert myalert"><strong>Tú</strong> dices: <p class="pmessage">${msg.message}</p></div>`;
		$('#messages').append(messagehtml);
	}
	else{
		let messagehtml = `<div class="message alert alert-success"><strong>${msg.username}</strong> dice: <p class="pmessage">${msg.message}</p></div>`;
		$('#messages').append(messagehtml);
	}
	document.querySelector('#messages').scrollTop = document.querySelector('#messages').scrollHeight;
});

socket.on('private message', (msg) => {
	let messagehtml = `<div class="message alert alert-warning"><strong>${msg.from}</strong> te envió un mensaje privado: <p class="pmessage">${msg.message}</p></div>`;
	$('#messages').append(messagehtml);

	document.querySelector('#messages').scrollTop = document.querySelector('#messages').scrollHeight;
});

socket.on('get users', (users) => {
	let usershtml = "";

	users.forEach((user) => {
		if(user.username == socket.username) usershtml += `<input type="button" value="${user.username}" class="list-group-item list-group-item-action active disabled">`;
		else usershtml += `<input type="button" value="${user.username}" class="list-group-item list-group-item-action" onclick="privateMessageChat('${user.id}', '${user.username}')">`;
	});
	document.querySelector('#user-list').innerHTML = usershtml;
});

socket.on('disconnect', (disconnected, users) => {
	let disconnectedhtml = `<div class="message alert alert-info"><strong>${disconnected.username}</strong> dice: <p class="pmessage">${disconnected.message}</p></div>`;
	$('#messages').append(disconnectedhtml);
});
