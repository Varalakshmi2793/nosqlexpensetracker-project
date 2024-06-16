require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const loginrouter = require('./router/loginrouter');
const expenserouter = require('./router/expenserouter');
const purchaserouter = require('./router/purchase');
const premium = require('./router/premium');
const forgetpass = require('./router/forgetpass');
// const User = require('./models/user');
// const Expense = require('./models/tracker');
// const Order = require('./models/order');
// const Password = require('./models/forgetPassword');
const morgan = require('morgan');
// const FileUrl = require('./models/fileUrl');
const cors = require('cors');
const helmet = require('helmet');

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(express.static(path.join(__dirname, './public')));
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.static(path.join(__dirname, './public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/expense', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expense.html'));
});

app.use(premium);
app.use(loginrouter);
app.use(expenserouter);
app.use(purchaserouter);
app.get('/forgetpassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forgetpassword.html'))
});
app.use(forgetpass);

app.use(helmet());

mongoose.connect("mongodb://localhost:27017/ExpenseTracker", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT || 1280);
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });
