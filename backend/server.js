const express = require('express');
const db = require('./db/config');
const cors = require('cors');
const sesstion = require('express-session');
const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(sesstion({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }
}))
app.use(express.json());

app.use('/api', require('./router'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

