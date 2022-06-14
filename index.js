const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const billRoute = require('./routes/bills');
const dashboard = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// routes
app.use('/user' , userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute); 
app.use('/bill', billRoute);
app.use('/dashboard', dashboard);

module.exports =app;