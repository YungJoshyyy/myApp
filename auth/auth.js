const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");


const db = new userModel('user.db', "auth.js");

exports.login = function (req, res, next) {
  let username = req.body.username;
  let password = req.body.pass;
 
  db.lookup(username, (err, user) => {
    if (err) {
      console.log("error looking up user", err);
      return res.status(401).send();
    }
    if (!user) {
      console.log("user ", username, " not found");
      return res.render("user/login");
    }
    //compare provided password with stored password
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        //use the payload to store information about the user such as username.
        let payload = { username: user.username };
        //create the access token 
        let accessToken = jwt.sign(payload, process.env.TOKEN_SECRET,{expiresIn: 300}); 
        res.cookie("jwt", accessToken);
        res.cookie("username", username);
        res.cookie("accountDate", user.dateCreated);
        next();
      } else {
        return res.render("user/login"); //res.status(403).send();
      }
    });
  });
};

exports.verify = function (req, res, next) {
 
  let accessToken = req.cookies.jwt;
  if (!accessToken) {
    return res.status(403).send();
  }
  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.TOKEN_SECRET);
    next();
  } catch (e) {
    //if an error occured return request unauthorized error
    res.status(401).send();
  }
};