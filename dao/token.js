const db = require('./init-firebase').db;
class Token {
    constructor(id, name, token) {
        this.id = id;
        this.name = name;
        this.token = token;
    }

    create() {
        var updates = {};
        updates['/tokens/' + this.id] = this;
        return db.ref().update(updates)
    }
}
module.exports = Token