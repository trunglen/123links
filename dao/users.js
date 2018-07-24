const db = require('./init-firebase').db
const firebase = require('firebase');
const userRef = db.ref('users')
// var ref = db.ref("server/saving-data/fireblog");
class User {
  constructor(body) {
    this.user_name = body.user_name;
    this.full_name = body.full_name;
  }

  validate() {
    if (!this.user_name) {
      return Promise.reject('user_name must be not empty');
    }
    if (!this.full_name) {
      return Promise.reject('full_name must be not empty');
    }
    return Promise.resolve('valid')
  }
  create(user) {
    return this.validate().then(res => {
      return new Promise((resolve, reject) => {
        userRef.child(this.user_name).once('value', snapshot => {
          if (snapshot.exists()) {
            reject('author exists!')
          } else {
            var updates = {};
            updates['/users/' + this.user_name] = this;
            resolve(updates)
          }
        })
      }).then(updates=>{
        return db.ref().update(updates)
      })
    })
    // var newUserKey = db.ref().child('users').push().key;
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  }

  lits() {
    return userRef.once("value", function (snapshot) {
      return res.send(snapshotToArray(snapshot))
    });
  }

}

module.exports = User