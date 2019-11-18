const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(`${process.cwd()}/public/views/Inicio.html`, (e) => {
    });
});

router.get('/registro', (req, res, next) => {
    res.sendFile(`${process.cwd()}/public/views/Registro.html`, (e) => {
    });
});

router.get('/chatroom', (req, res, next) => {
    res.sendFile(`${process.cwd()}/public/views/Chatroom.html`, (e) => {
    });
});

module.exports = router;