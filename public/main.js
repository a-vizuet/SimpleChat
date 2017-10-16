var socket = io();

function addUser(){
	let trimuser = $('#username').val().trim();
	$('#alert1').hide();
	
	if(trimuser){
		let username = $('#username').val();
		$('.login').hide();
		$('.chat').show();
		socket.username = username;
		socket.emit('add user', {id: socket.id, username: username});
	}else $('#alert1').show();
}

function addMessage(){
	let trimmessage = $('#text').val().trim();
	$('#alert2').hide();

	if(trimmessage){
		let message = $('#text').val();
		let messagehtml = `<div class="message alert myalert"><strong>Tú</strong> dices: <p class="pmessage">`+message+`</p></div>`;
		socket.emit('chat message', message);
	}else $('#alert2').show();
}

socket.on('this.connection', (connected) => {
	let connectedhtml = `<div class="message alert alert-info"><strong>`+connected.username+`</strong> dice: <p class="pmessage">`+connected.message+`</p></div>`;
	$('#messages').append(connectedhtml);
});

socket.on('chat message', (msg) => {
	if(socket.username == msg.username){
		let messagehtml = `<div class="message alert myalert"><strong>Tú</strong> dices: <p class="pmessage">`+msg.message+`</p></div>`;
		$('#messages').append(messagehtml);
	}
	else{
		let messagehtml = `<div class="message alert alert-success"><strong>`+msg.username+`</strong> dice: <p class="pmessage">`+msg.message+`</p></div>`;
		$('#messages').append(messagehtml);
	}
});

socket.on('get users', (users) => {
	let usershtml = "";

	users.forEach((user) => {
		if(user.username == socket.username) usershtml += `<li class="list-group-item active"><a>`+user.username+`</a></li>`;
		else usershtml += `<li class="list-group-item"><a href="`+window.location+user.username+`?id=`+user.id+`?myid=`+socket.id+`" target="_blank">`+user.username+`</a></li>`;
	});
	document.querySelector('#user-list').innerHTML = usershtml;
});

socket.on('disconnect', (disconnected, users) => {
	let disconnectedhtml = `<div class="message alert alert-info"><strong>`+disconnected.username+`</strong> dice: <p class="pmessage">`+disconnected.message+`</p></div>`;
	$('#messages').append(disconnectedhtml);
});
