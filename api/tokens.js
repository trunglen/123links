const db = require('../dao/init-firebase').db;
var express = require('express')
var router = express.Router()
const snapshotToArray = require('../utils').snapshotToArray
var Token = require('../dao/token')
const request = require('request')
const getRequestUrl = require('../common/constant').getRequestUrl
// router.get('/list', (req, res) => {
//     // const skip = req.param('skip', 0);
//     db.ref('posts').limitToFirst(10).once("value", function (snapshot) {
//         res.send(snapshotToArray(snapshot, true))
//     });
// });

function validateToken(token) {
    return new Promise((resolve, reject) => {
        request.get(getRequestUrl('me'), { qs: { access_token: token } }, (err, res) => {
            if (res.statusCode !==200) {
                console.log(err)
                reject('error access_token')
                return
            }
            resolve(res.body)
        })
    })
}
router.post('/create', (req, res) => {
    const body = req.body
    validateToken(body.token).then(response=>{
        response = JSON.parse(response)
        new Token(response.id, response.name, body.token).create().then(success => {
            res.send({ status: 'success' });
        }).catch(err => {
            console.log(err)
            res.status(400).send({ error: err })
        })
    }).catch(err=>{
        console.log(err)
        res.status(400).send({ error: err })
    })
});

module.exports = router;