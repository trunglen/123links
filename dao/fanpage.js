const db = require('./init-firebase').db;
class Fanpage {
    constructor(id, postID, phones, emails, info, detail) {
        this.id = id;
        this.postID = postID
        this.phones = phones;
        this.emails = emails;
        this.info = info;
        this.detail = detail
    }

    create() {
        var updates = {};
        updates['/fanpages/' + this.id + '/' + this.postID] = this;
        return db.ref().update(updates)
    }
}
module.exports = Fanpage