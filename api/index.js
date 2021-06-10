const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('morgan')('dev'));
// app.use(require('cors')());

app.use('/api', require('./api').api);

app.get('/', (req, res) => {
    res.send('Chatre');
})

server.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});



