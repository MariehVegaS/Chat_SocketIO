var socket;



function connect() {
    let privateRooms = [];

    if (socket) { socket.disconnect(); }
    socket = io();
    socket.on('render', (socketUsers) => {
        // socket.emit('joinLobby', username);
        renderUsers(socketUsers);
        console.log('reeady');
    });

    socket.on('msg', function (msg, username) {
        let chat = document.querySelector("#messages");
        let el = document.createElement('li');
        el.innerHTML = `<strong>${username}</strong> <div>${msg}</div>`;
        chat.appendChild(el);
        el.scrollIntoView(true);
    });

    socket.on('renderRooms', (rooms) => {
        renderRooms(rooms);
    })

    socket.on('changeRoom', function (newChannel) {
        let chat = document.querySelector("#messages");
        chat.innerHTML = '';
    })

    //event send
    let send = document.querySelector("#send");
    send.onclick = () => {
        let msg = document.querySelector('#msg');
        let mensaje = msg.value;
        if (mensaje == '') return false;
        msg.value = '';
        msg.focus();
        socket.emit('msg', mensaje);
    }
    let msg = document.querySelector('#msg');
    msg.onkeyup = () => {
        if (event.keyCode === 13) {
            let msg = document.querySelector('#msg');
            let mensaje = msg.value;
            if (mensaje == '') return false;
            msg.value = '';
            msg.focus();
            socket.emit('msg', mensaje);
        }
    }

    //event onclick rooms


    let backContacts = document.querySelector('.back');
    let btnNewChat = document.querySelector('#addChat');
    backContacts.onclick = () => {
        let contacts = document.querySelector('.contacts-panel');
        contacts.classList.toggle('hide-contacts');
        console.log('Hide')
    }

    btnNewChat.onclick = backContacts.onclick;

    let btnNewGroup = document.querySelector('#btnCreateGroup');
    let txtNewGroup = document.querySelector('#name-group');
    let rooms = document.querySelector('#rooms');

    btnNewGroup.onclick = () => {
        if (txtNewGroup.value == '') {
            console.log('Grupo sin nombre')
            return false;
        }
        socket.emit('createRoom', txtNewGroup.value);
        txtNewGroup.value = '';
        let contacts = document.querySelector('.contacts-panel');
        contacts.classList.toggle('hide-contacts');

        console.log('Creando nuevo grupo')
    }

    txtNewGroup.onkeyup = e => {
        if (e.keyCode === 13) {
            if (txtNewGroup.value == '') {
                console.log('Grupo sin nombre')
                return false;
            }
            socket.emit('createRoom', txtNewGroup.value);
            txtNewGroup.value = '';
            let contacts = document.querySelector('.contacts-panel');
            contacts.classList.toggle('hide-contacts');

            console.log('Creando nuevo grupo')
        }
    }

    function addEventClicksRooms() {
        let roomsList = document.querySelectorAll('#rooms>.roomsito');

        for (let i = 0; i < roomsList.length; i++) {
            roomsList[i].onclick = () => {
                socket.emit('changeRoom', roomsList[i].dataset.room)
            }
        }
        let privateList = document.querySelectorAll('#rooms>.private');

        for (let i = 0; i < privateList.length; i++) {
            privateList[i].onclick = () => {
                socket.emit('addPrivateChat', privateList[i].dataset.id)
            }
        }
    }
    function addEventClicksContacts() {
        let contactsList = document.querySelector('.contacts-list');
        privateRooms = [];
        console.log(contactsList)
        for (let i = 0; i < contactsList.children.length; i++) {
            contactsList.children[i].onclick = () => {
                console.log('private added añadido')
                privateRooms.push({ username: contactsList.children[i].dataset.username, id: contactsList.children[i].dataset.id });
                socket.emit('renderPrivateRooms');
            }
            console.log('Adding events contact')
        }
    }




    function renderUsers(users) {
        let listUsers = document.querySelector(".contacts-list");

        listUsers.innerHTML = '';
        for (const user of users) {
            let el = document.createElement('li');
            el.innerHTML = `${user.username}`;
            el.dataset.username = `${user.username}`
            el.dataset.id = `${user.id}`

            listUsers.appendChild(el);
            console.log('Usuario añadido a Interfaz')
        }
        addEventClicksContacts();
    }
    function renderRooms(rooms) {
        let listRooms = document.querySelector("#rooms");

        listRooms.innerHTML = '';
        for (const room of rooms) {
            let el = document.createElement('li');
            el.classList.add('roomsito');
            el.dataset.room = room;
            el.innerHTML = `${room}`;
            listRooms.appendChild(el)
        }
        for (const contact of privateRooms) {
            let el = document.createElement('li');
            el.classList.add('private');
            el.dataset.room = contact.username;
            el.dataset.id = contact.id;
            el.innerHTML = `${contact.username}`;
            listRooms.appendChild(el)
            console.log('rendering privates');
        }
        console.log('Render rooms ready')
        console.log(privateRooms)
        addEventClicksRooms();
    }
}
