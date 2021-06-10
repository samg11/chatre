const URL = 'http://localhost:8080';

// const io = require('socket.io-client');
const $ = require('jquery');
const fetch = require('node-fetch');
require('bootstrap');

$('#login-form').on('submit', async (e) => {
    e.preventDefault();
    const auth = await signIn($('#loginUsrInput').val(), $('#loginPwdInput').val());

    if (auth.failure) {
        alert(auth.msg);
    } else {
        alert('Successfully logged in');
        $('#loginModal').hide();
        $('.authButton').hide();
    }
})

async function signIn(usr, pwd) {
    const res = await fetch(`${URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usr, pwd
        })
    })
        .then(res => res.json())
        .catch(console.error);

    return res;

}