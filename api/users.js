var express = require('express')
const snapshotToArray = require('../utils').snapshotToArray
var router = express.Router()
const db = require('../dao/init-firebase').db;
var User = require('../dao/users')
router.get('/list', (req, res) => {
    return db.ref('users').once("value", function (snapshot) {
        return res.send(snapshotToArray(snapshot, false))
    });
});

router.post('/create', (req, res) => {
    console.log(req.body)
    return new User(req.body).create().then(success => {
        res.send({ status: 'success' });
    }).catch(err => {
        console.log(err);
        res.status(400).send({ error: err });
    })
});

module.exports = router