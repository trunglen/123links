const db = require('./init-firebase').db;
class Post {
  constructor(body) {
    this.title = body.title;
    this.content = body.content;
    this.author = body.author;
  }

  validateUser() {
    if (!this.author) {
      return Promise.reject('author must be not empty');
    }
    if (!this.title) {
      return Promise.reject('title must be not empty');
    }
    if (!this.content) {
      return Promise.reject('content must be not empty');
    }
    return Promise.resolve('is valid');
  }
  
  create() {
    return this.validateUser().then(res=>{
      return new Promise((resolve, reject) => {
        db.ref('users').child(this.author).once('value', snapshot => {
          if (snapshot.exists()) {
            var newPostKey = db.ref().child('posts').push().key;
            var updates = {};
            updates['/posts/' + newPostKey] = this;
            resolve(updates);
          } else {
            reject('author not exists');
          }
        })
      });
    }).then(res => {
      return db.ref().update(res)
    });
  }
}
module.exports = Post