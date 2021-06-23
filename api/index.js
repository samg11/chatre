const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { db, authenticate } = require('./db');

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('morgan')('dev'));

app.use('/api', require('./api').api);

app.get('/', (req, res) => {
    res.send('Chatre');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat', ({ usr, pwd, rec }) => {
        if (authenticate(usr, pwd)) {
            const roomName = [usr, rec].sort();
            io.join(roomName);
            io.to(roomName).emit('user-joined', usr);
        }
    });

    socket.on('message', ({ username, password, msg, signature, rec }) => {
        if (authenticate(username, password)) {
            io.to([username, rec].sort()).emit('message', { signature, msg });   
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});



