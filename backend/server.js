const express = require('express');
const db = require('./db/config');
const cors = require('cors');
const session = require('express-session');
const app = express();
const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const expensesRoutes = require('./routes/expenses');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }
}))
app.use(express.json());

app.use('/api', notesRoutes);
app.use('/api', authRoutes);
app.use('/api', expensesRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

