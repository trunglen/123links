const db = require('../dao/init-firebase').db;
var express = require('express')
var router = express.Router()
const snapshotToArray = require('../utils').snapshotToArray
var Post = require('../dao/posts')
router.get('/list', (req, res) => {
    // const skip = req.param('skip', 0);
    db.ref('posts').limitToFirst(10).once("value", function (snapshot) {
        res.send(snapshotToArray(snapshot, true))
    });
});

router.post('/create', (req, res) => {
    new Post(req.body).create().then(success => {
        res.send({ status: 'success' });
    }).catch(err => {
        res.status(400).send({ error: err })
    })
});

module.exports = router;