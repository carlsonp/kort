//load in functions
var admin = require('./admin');
var cardsort = require('./cardsort_server');
var treetest = require('./treetest_server');
var productreaction = require('./productreaction_server');


module.exports = function(app, passport) {

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
	app.get('/editcardsort/:id', cardsort.edit);
	app.get('/deletecardsort/:id', cardsort.delete);
	app.get('/cardsort/:id', cardsort.view);
	app.get('/cardsortresults/:id', cardsort.results);
	app.post('/updatecardsort', cardsort.update);

	app.post('/createtreetest', treetest.create);
	app.get('/edittreetest/:id', treetest.edit);
	app.get('/deletetreetest/:id', treetest.delete);
	app.get('/treetest/:id', treetest.view);
	app.get('/treetestresults/:id', treetest.results);
	app.post('/updatetreetest', treetest.update);

	app.post('/createproductreaction', productreaction.create);
	app.get('/editproductreaction/:id', productreaction.edit);
	app.get('/deleteproductreaction/:id', productreaction.delete);
	app.get('/productreaction/:id', productreaction.view);
	app.get('/productreactionresults/:id', productreaction.results);
	app.post('/updateproductreaction', productreaction.update);

	app.get('/admin', function (req, res) {
		res.render('admin.ejs');
	});

	app.get('/studies', admin.Studies);


	app.get('/login', function(req, res) {
		res.render('login.ejs');
	});
	  
	app.post('/login', passport.authenticate('local', { failureRedirect: '/login/fail' }), function(req, res) {
		res.redirect('/');
	});
	  
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	app.get('/createuser', function(req, res) {
		res.render('createuser.ejs');
	});
	
	app.post('/createuser', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/createuser',
		failureFlash : true
	}));
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
