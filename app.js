// User defined settings -------------------------------------------

const port = process.env.PORT || 3000;
//https://docs.mongodb.com/manual/reference/connection-string/
const mongoURL = 'mongodb://127.0.0.1/kort' //with a username and password: 'mongodb://kort:123@127.0.0.1/kort'
//the admin user is created upon launching the application for the first time
const adminUser = "admin";  //optionally change this
const adminPassword = "admin"; //set this to something different and secure
const secretHash = 'secret'; //change this to your own unique value (used for hash creation and salting)
const uploadDir = './uploads/images';

//------------------------------------------------------------------

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const bodyParser= require('body-parser');
var app = express();
const async = require('async');
const flash = require('connect-flash');
require('pkginfo')(module, 'version');
console.log("Kort version: ", module.exports.version);

//use default ES6 for promises, potential for using bluebird for increased performance
//https://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise
mongoose.Promise = global.Promise;
//https://stackoverflow.com/questions/23293202/export-and-reuse-my-mongoose-connection-across-multiple-models
//https://stackoverflow.com/questions/44749700/how-to-set-usemongoclient-mongoose-4-11-0
const connection = mongoose.connect(mongoURL, { useMongoClient: true });


//load in models
require('./models/user');
require('./models/study');
require('./models/upload');

//setup a default admin account in Mongo
require('./server/createadmin_user')(adminUser, adminPassword);

app.set('view engine', 'ejs');

//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(flash());

//https://stackoverflow.com/questions/14264429/how-to-use-jquery-installed-with-npm-in-express-app
//https://expressjs.com/en/starter/static-files.html
app.use('/css', express.static(__dirname + '/css/'));
app.use('/opensans', express.static(__dirname + '/node_modules/npm-font-open-sans/'));
app.use('/uploads', express.static(__dirname + '/uploads/'));
app.use('/js', express.static(__dirname + '/js/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/clipboard', express.static(__dirname + '/node_modules/clipboard/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/bootbox', express.static(__dirname + '/node_modules/bootbox/'));
app.use('/font-awesome', express.static(__dirname + '/node_modules/font-awesome/'));
app.use('/dragula', express.static(__dirname + '/node_modules/dragula/dist/'));
app.use('/bootstrap-treeview', express.static(__dirname + '/node_modules/bootstrap-treeview/dist/'));
app.use('/plotlyjs', express.static(__dirname + '/node_modules/plotly.js/dist/'));
app.use('/datatables', express.static(__dirname + '/node_modules/datatables.net/js/'));
app.use('/datatables', express.static(__dirname + '/node_modules/datatables.net-dt/'));
app.use('/datatables-buttons', express.static(__dirname + '/node_modules/datatables.net-buttons/js/'));
app.use('/datatables-buttons', express.static(__dirname + '/node_modules/datatables.net-buttons-dt/css/'));
app.use('/public', express.static(__dirname + '/public/'));

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: secretHash,
    store: new MongoStore({ mongooseConnection: connection,
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

require('./server/routes.js')(app, passport, flash, uploadDir);

app.listen(port, function () {
	console.log('Kort running on port: ' + port);
});
