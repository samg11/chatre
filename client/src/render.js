const URL = 'http://localhost:8080';

// const io = require('socket.io-client');
const axios = require('axios');
const $ = require('jquery');
require('bootstrap');

$('#login-form').on('submit', async (e) => {
    e.preventDefault();
    const auth = await signIn($('#lusr').val(), $('#lpwd').val());

    if (auth.failure) {
        alert(auth.msg);
    } else {
        alert('Successfully logged in');
        $('#loginModal').hide();
        $('.authButton').hide();
    }
})

async function signIn(usr, pwd) {
    const loginRequst = await axios.post(`${URL}/api/login`, { usr, pwd })
        .catch(console.error)
    
    return loginRequst.data;

}