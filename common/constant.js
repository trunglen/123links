const fbBaseUrl = 'https://graph.facebook.com/v3.0/'
function getRequestUrl(path) {
    return fbBaseUrl + path
}

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

module.exports = {
    getRequestUrl: getRequestUrl,
    validateToken:validateToken
}