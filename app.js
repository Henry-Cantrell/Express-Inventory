var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const mongoose = require("mongoose");

// Passport deps

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Router deps

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var inventoryRouter = require('./routes/inventory')

// Express app init

var app = express();

//Initialize dotenv

dotenv.config()

// database initialization and connection start

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.abwln.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

// database processes end

// Mongoose connection 

//Set up mongoose connection
var mongoDB =`mongodb+srv://Henry:${process.env.DB_PASSWORD}@cluster0.abwln.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Passport init

app.use(session({ secret: `${process.env.SESH_SECRET}`, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Login route

app.get("/users/login", (req, res) => res.render("login_form"));

// Login passport methods
passport.use(
  //same usernames collide
  new LocalStrategy((username, password, done) => {
      User.findOne({username: username.trim()}, (err, user) => { //2nd argument mongoose findone is a callback function
          if(err) return done(err)

          if(!user){
              return done(null, false, {message: "Incorrect username"})
          }
          bcrypt.compare(password, user.password, (err, res) => {
              if(res){
                  //passwords match
                  return done(null, user)
              } else{
                  //passwords do not match
                  return done(null, false, {message: "Incorrect password"})
              }
          })
      })
  })
)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Logout method

app.get("/users/logout", (req, res) => {
  req.logout();
  res.redirect('/');
});

// Login method

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: ""
  })
);

// Makes user obj globally visible in app, must be before view eng setup methods and after passport init

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inventory', inventoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
