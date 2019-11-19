const express = require('express');
const db = require('../db');
const router = express.Router();
let password;

router.get('/', (req, res, next) => {
    res.sendFile(`${process.cwd()}/public/views/Inicio.html`, (e) => {
    });
});

router.get('/registro', (req, res, next) => {
    res.sendFile(`${process.cwd()}/public/views/Registro.html`, (e) => {
    });
});

router.get('/chatroom/:username', (req, res, next) => {
    res.sendFile(`${process.cwd()}/public/views/Chatroom.html`, (e) => {
    });
});

router.get('/validation/:username/:password', async (req, res, next) => {
    try {
        let all = await db.all();
        let username = req.params.username;
        let exist = false;
        all.forEach(element => {
            if (element.user == username) {
                exist = true;
            }
        });
        if (exist == true) {
            let results = await db.one(username);
            let password = req.params.password;
            let passwordDB = results[0].password;
            if (password == passwordDB) {
                res.redirect(`http://localhost:3000/chatroom/${req.params.username}`);
            } else {
                console.log('Contraseña incorrecta');
                res.redirect(`http://localhost:3000/`);
            }
        }else{
            console.log('El usuario no existe');
            res.redirect(`http://localhost:3000/`);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;