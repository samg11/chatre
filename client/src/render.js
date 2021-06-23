const URL = 'http://localhost:8080';

const io = require('socket.io-client');
const socket = io(URL);

const fetch = require('node-fetch');

const Store = require('electron-store');
const store = new Store();

function auth() {
    const usr = store.get('username');
    const pwd = store.get('password');

    if (typeof usr === 'string' && typeof pwd === 'string') {
        $('.whenSignedOut').hide();
        $('.whenSignedIn').show();
    } else {
        $('.whenSignedOut').show();
        $('.whenSignedIn').hide();
    }
}

auth();

$('#login-form').on('submit', (e) => {
    e.preventDefault();
    const [usr, pwd] = [$('#loginUsrInput').val(), $('#loginPwdInput').val()];
    signIn(usr, pwd).then(a => {
        if (a.failure) {
            alert(a.msg);
        } else {
            alert('Successfully logged in');
            store.set('username', usr);
            store.set('password', pwd);
            $('#loginModal').modal('hide');
        }

        auth();
    });
});

$('#signOutBtn').on('click', () => {
    signOut();
});

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

$('#recipientInputForm').on('submit', (e) => {
    e.preventDefault();
    const usr = store.get('username');
    const pwd = store.get('password');
    const rec = $('#recipientInput').val();
    socket.emit('chat', { usr, pwd, rec });
});

function signOut() {
    store.clear();
    auth();
}