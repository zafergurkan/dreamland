//node stuff
const admin = require("firebase-admin");

//certificate stuff
var serviceAccount = require("./key/key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dreamland-97839.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin, db };
