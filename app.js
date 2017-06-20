const port = process.env.PORT || 3000;
const mongoURL = 'mongodb://127.0.0.1/kort'
const adminUser = "admin";
const adminPassword = "admin";
const secretHash = 'secret'; //change this to your own unique value (used for hash creation and salting)

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const bodyParser= require('body-parser');
var app = express();
var db = require('./server/db')(mongoURL, mongoose);
const async = require('async');
const flash = require('connect-flash');

//load in models
require('./models/user');
require('./models/cardsort');
require('./models/treetest');
require('./models/productreaction');

//setup a default admin account in Mongo
require('./server/createadmin_user')(adminUser, adminPassword);

app.set('view engine', 'ejs');

//https://expressjs.com/en/starter/static-files.html
app.use(express.static('css'))
app.use(express.static('js'))

//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(flash());

//https://stackoverflow.com/questions/14264429/how-to-use-jquery-installed-with-npm-in-express-app
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/font-awesome', express.static(__dirname + '/node_modules/font-awesome/'));
app.use('/dragula', express.static(__dirname + '/node_modules/dragula/dist/'));
app.use('/bootstrap-treeview', express.static(__dirname + '/node_modules/bootstrap-treeview/dist/'));
app.use('/d3', express.static(__dirname + '/node_modules/d3/build/'));

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 
app.use(session({
    secret: secretHash,
	//TODO: look into using our existing single Mongo connection instead of opening up a new one
    store: new MongoStore({ url: mongoURL,
          collection: 'session',
		  ttl: 4 * 60 * 60 // = 4 hours (in seconds)
		}),
	resave: false,
	saveUninitialized: false
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());
require('./server/passport')(passport, flash);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./server/routes.js')(app, passport, flash);

app.listen(port, function () {
	console.log('Kort running on port: ' + port);
});