var socket;



function connect() {
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
        }
        socket.emit('createRoom', txtNewGroup.value);
        console.log('Creando nuevo grupo')
    }

    function addEventClicksRooms() {
        let roomsList = document.querySelectorAll('#rooms>li');

        for (let i = 0; i < roomsList.length; i++) {
            roomsList[i].onclick = () => {
                socket.emit('changeRoom', roomsList[i].dataset.room)
            }
        }
    }




    function renderUsers(users) {
        let listUsers = document.querySelector(".contacts-list");

        listUsers.innerHTML = '';
        for (const user of users) {
            let el = document.createElement('li');
            el.innerHTML = `${user}`;

            listUsers.appendChild(el);
            console.log('Usuario añadido a Interfaz')
        }
    }
    function renderRooms(rooms) {
        let listRooms = document.querySelector("#rooms");

        listRooms.innerHTML = '';
        for (const room of rooms) {
            let el = document.createElement('li');
            el.dataset.room = room;
            el.innerHTML = `${room}`;
            listRooms.appendChild(el)
        }
        addEventClicksRooms();
    }
}
