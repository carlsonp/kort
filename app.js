
var express = require('express');

const bodyParser= require('body-parser');
var app = express();
var db = require('./server/db');

//load in models
require('./models/study');

//load in functions
var admin = require('./server/admin');
var cardsort = require('./server/cardsort_server');

app.set('view engine', 'ejs');

//https://expressjs.com/en/starter/static-files.html
app.use(express.static('css'))
app.use(express.static('js'))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.render('index.ejs');
});

app.get('/productcards', function (req, res) {
	res.render('productcards.ejs');
});

app.get('/treetest', function (req, res) {
	res.render('treetest.ejs');
});

app.post('/createcardsort', cardsort.create);
app.get('/deletecardsort/:id', cardsort.delete);
app.get('/cardsort/:id', cardsort.view);
app.get('/cardsortresults/:id', cardsort.results);
app.post('/updatecardsort', cardsort.update);

app.get('/admin', function (req, res) {
	res.render('admin.ejs');
});
app.get('/admin/cardsort', admin.CardSortAdmin);
app.get('/admin/treetest', admin.TreeTestAdmin);
app.get('/admin/productreaction', admin.ProductReactionAdmin);




app.listen(3000, function () {
	console.log('Kort running on port: 3000');
});
