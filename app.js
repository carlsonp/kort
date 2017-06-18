var port = process.env.PORT || 3000;

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser')
var morgan = require('morgan');
const bodyParser= require('body-parser');
var app = express();
var db = require('./server/db');
var async = require('async');

//load in models
require('./models/study');
require('./models/user');

var auth = require('./server/passport');


app.set('view engine', 'ejs');

//https://expressjs.com/en/starter/static-files.html
app.use(express.static('css'))
app.use(express.static('js'))

//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

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
    secret: 'secret',
    //TODO: use our existing mongodb connection in db.js instead of opening a new one
    store: new MongoStore({ url: 'mongodb://localhost/kort',
          collection: 'session', }),
	resave: false,
	saveUninitialized: false
}));


// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./server/routes.js')(app, passport);

app.listen(port, function () {
	console.log('Kort running on port: ' + port);
});
