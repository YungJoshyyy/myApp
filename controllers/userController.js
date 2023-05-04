const path = require('path');
const dbFilePath = path.join(__dirname, '../models/user.db');
const userModal = require('../models/userModel');
const db = new userModal(dbFilePath);

exports.homepage = (req,res) => {
    res.render('home', {
        title: 'Home'
    })
}

exports.registerpage = (req,res) => {
    res.render('user/register', {
        title: 'Register'
    })
}

exports.loginpage = (req,res) => {
    res.render('user/login', {
        title: 'Login'
    });
    
}

exports.post_login = (req,res) => {
    res.redirect('/account');
}

exports.accountpage = (req,res) => {
    res.render('user/account', {
        title: 'Account'
    });
}


/*
exports.allUsers = (req, res) => {
    db.getAllEntries().then((list) => {

    })
}*/