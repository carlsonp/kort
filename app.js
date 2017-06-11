var express = require('express');

const bodyParser= require('body-parser');
var app = express();
var db = require('./server/db');

//load in models
require('./models/study');

//load in functions
var study = require('./server/study');

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

app.post('/createStudy', study.createStudy);
app.get('/admin', study.loadAdminPage);
app.get('/deleteStudy/:type/:id', study.deleteStudy);
app.get('/editStudy/:id', study.editStudy);
app.post('/updateStudy/:id', study.updateStudy);
app.get('/cardsort/:id', study.renderCardSort);

app.listen(3000, function () {
	console.log('Kort running on port: 3000');
});

