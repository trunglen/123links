
var express = require('express')
var router = express.Router()
const request = require('request')
const http = require('http')
router.get('/token/generate', (req, res) => {
    const uid = req.param('uid', 0);
    const token = genToken(uid)
    // request.get('http://123link.co/api?api=555b4e5419214f7825a381e19bfa5fe0ec92e2c8&url=https://money.opencoder.org/earn-money/' + token, (err, response, html) => {
    //     console.log(res)
    //     console.log(err)
    //     const body = response.body
    //     if (body.status === 'error') {
    //         res.status(400).send({ status: 'error', msg: 'Đã có lỗi xảy ra' })
    //     } else {
    //         genToken(uid)
    //         res.send({ status: 'success', shortened_url: JSON.parse(body).shortenedUrl })
    //     }
    // })
    http.get({ host: '123link.co', path: '/api?api=555b4e5419214f7825a381e19bfa5fe0ec92e2c8&url=https://money.opencoder.org/#/earn-money/' + token }, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            console.log(data)
            const dataJson = JSON.parse(data)
            if (dataJson.status === 'error') {
                res.status(400).send({ status: 'error', msg: 'Đã có lỗi xảy ra' })
            } else {
                genToken(uid)
                res.send({ status: 'success', shortened_url: dataJson.shortenedUrl })
            }
        })
    });
});

router.get('/token/check', (req, res) => {
    const uid = req.param('uid', 0);
    const token = req.param('token', 0);
    if (checkToken(uid, token)) {
        res.send({ status: 'ok' })
    } else {
        res.status(400).send({ err: 'Không hợp lệ' })
    }
});
const random = 'AaBbCcDdEeGgHh0123456789EeKkJjLlMmNnBbVvCcXxZz'
let globalToken = {}

function genToken(uid = '') {
    let result = ''
    for (let i = 0; i < uid.length; i++) {
        result += (uid[i] + random[Number.parseInt(Math.random() * 10)])
    }
    return result
}

function checkToken(uid = '', token = '') {
    if ((globalToken[uid]) === token) {
        return false
    }
    globalToken[uid] = token
    for (let i = 0; i < token.length; i++) {
        if (i % 2 == 0) {
            if (token[i] !== uid[i / 2]) {
                return false
            }
        }
    }
    return true
}

module.exports = router;