const db = require('./init-firebase').db
var postRef = db.ref("/posts");
module.exports = {
    posts: postRef
}