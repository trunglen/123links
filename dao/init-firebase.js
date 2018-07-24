var admin = require("firebase-admin");
// download trong project setting firebase console->service account
var serviceAccount = require("../opencoder-89f02-firebase-adminsdk-8rp9b-5041194b8a.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://opencoder-89f02.firebaseio.com'
});
module.exports = {
    db:admin.database()
}