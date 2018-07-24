const db = require('../dao/init-firebase').db;
var express = require('express')
var router = express.Router()
const snapshotToArray = require('../utils').snapshotToArray
var Fanpage = require('../dao/fanpage')
var common = require('../common/constant')
const request = require('request')

//web scraper

router.get('/lookup', (req, res) => {
    const fanpageUrl = req.query.fanpage_url;
    console.log(req.query)
    const options = {
        uri: fanpageUrl,
        transform: function (body) {
            return cheerio.load(body);
        },

    };
    request.get('http://www.facebook.com/phukien1121/', (er, response, html) => {
        html = html + ''
        console.log(html.substring(0,10000))
        console.log(html.match(/meta property="al:android:url".*refer/gi));
        console.log(/content="fb:\/\/page\/[0-9]+/g.exec(html));
    })
    res.send(200, { status: 'ok' })
});

router.post('/create', (req, res) => {

    const body = req.body
    const fanpageID = body.fanpage_id
    const token = body.token
    request.get(common.getRequestUrl(fanpageID + '/feed'), { qs: { access_token: token } }, (err, response) => {
        if (response.statusCode !== 200) {
            console.log(err)
            return
        }
        response = JSON.parse(response.body)
        response.data.forEach(element => {
            requestComment(fanpageID, element.id, token)
        });
        if (response.paging.next) {
            requestNextPost(fanpageID, response.paging.next, token)
        }
    })
    res.send({ status: 'success' })

});

function requestNextPost(fanpageID, next, token) {
    request.get(next, (err, response) => {
        if (response.statusCode !== 200) {
            console.log(err)
            return
        }
        response = JSON.parse(response.body)
        response.data.forEach(element => {
            requestComment(fanpageID, element.id)
        });
    })
}

function requestComment(fanpageID, postID, token) {
    request.get(common.getRequestUrl(postID + '/comments?access_token=' + token, { qs: { access_token: token } }), (err, response) => {
        if (response.statusCode !== 200) {
            console.log(err, 'error')
            return
        }
        var comment = ''
        response = JSON.parse(response.body)
        var from = []
        var comment = ''
        response.data.forEach(element => {
            var phone = element.message.match(/0[0-9\s.-]{9,13}/gi)
            var email = element.message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
            if (phone || email) {
                comment += element.message + '&&&'
                element.from.phone = phone
                element.from.email = email
                element.from.message = element.message
                from.push(element.from)
            }
        });
        if (from.length != 0) {
            new Fanpage(fanpageID, postID, getPhoneFromComment(comment), getEmailFromComment(comment), comment, from).create()
        }
    })
}

function getPhoneFromComment(comment) {
    return comment.match(/0[0-9\s.-]{9,13}/gi)
}

function getEmailFromComment(comment) {
    return comment.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
}

module.exports = router;