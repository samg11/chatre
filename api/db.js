const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});
  
const db = admin.firestore();

async function authenticate(usr, pwd) {
    const user = (await db.collection('users').doc(usr).get()).data();
    return user?.password === crypto.createHash("sha256").update(pwd).digest("base64") ? user : false;
}

exports.db = db;
exports.authenticate = authenticate;