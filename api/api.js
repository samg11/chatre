const express = require('express');
const crypto = require('crypto');

const api = express();

const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});
  
const db = admin.firestore();


api.get('/', (req, res) => {
    res.json({
        api: 'currently working fine'
    });
});

api.post('/signup', async (req, res) => {
    try {

        const { fn, ln, usr, pwd } = req.body;

        const usrDocRef = db.collection('users').doc(usr);
        const usrDoc    = await usrDocRef.get();
        if (usrDoc.exists) {
            res.status(401).json({
                failure: true,
                msg: 'Username already taken'
            });
        } else if (usr.length > 15) {
            res.status(418).json({
                failure: true,
                msg: 'Username cannot be longer than 15 characters'
            });
        } else {
            usrDocRef.set({
                first_name: fn,
                last_name: ln,
                username: usr,
                password: crypto.createHash("sha256").update(pwd).digest("base64")
            });

            res.json({
                failure: false
            });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

api.post('/login', async (req, res) => {
    try {
        const { usr, pwd } = req.body;
        const userDocRef = db.collection('users').doc(usr);
        const user       = (await userDocRef.get()).data();
        if (user?.password === crypto.createHash("sha256").update(pwd).digest("base64")) {
            res.json({
                failure: false
            });
        } else {
            res.status(401).json({
                failure: true,
                msg: 'Incorrect Password'
            });
        }
    } catch (err) {
        res.status(500).json({
            failure: true,
            msg: 'Incorrect username or password'
        });
    }
});

async function authenticate(usr, pwd) {
    const user = (await db.collection('users').doc(usr).get()).data();
    return user?.password === crypto.createHash("sha256").update(pwd).digest("base64");
}

exports.api = api;