//load in functions
var admin = require('./admin');
var cardsort = require('./cardsort_server');
var treetest = require('./treetest_server');
var productreaction = require('./productreaction_server');
var user = require('./user_server');

module.exports = function(app, passport, flash) {

	app.get('/', function (req, res) {
		res.render('index.ejs', { loginMessage: req.flash('loginMessage') });
	});

	app.post('/createcardsort_ajax', isLoggedIn, cardsort.create_ajax);
	app.post('/createcardsort', isLoggedIn, cardsort.create);
	app.get('/editcardsort/:id', isLoggedIn, cardsort.edit);
	app.get('/deletecardsort/:id', isLoggedIn, cardsort.delete);
	app.get('/cardsort/:id', cardsort.view);
	app.get('/cardsortresults/:id', isLoggedIn, cardsort.results);
	app.post('/updatecardsort', isLoggedIn, cardsort.update);
	app.post('/submitCardsortResult', isLoggedIn, cardsort.submitResult);

	app.post('/createtreetest', isLoggedIn, treetest.create);
	app.get('/edittreetest/:id', isLoggedIn, treetest.edit);
	app.get('/deletetreetest/:id', isLoggedIn, treetest.delete);
	app.get('/treetest/:id', treetest.view);
	app.get('/treetestresults/:id', isLoggedIn, treetest.results);
	app.post('/updatetreetest', isLoggedIn, treetest.update);

	app.post('/createproductreaction', isLoggedIn, productreaction.create);
	app.get('/editproductreaction/:id', isLoggedIn, productreaction.edit);
	app.get('/deleteproductreaction/:id', isLoggedIn, productreaction.delete);
	app.get('/productreaction/:id', productreaction.view);
	app.get('/productreactionresults/:id', isLoggedIn, productreaction.results);
	app.post('/updateproductreaction', isLoggedIn, productreaction.update);
	app.post('/submitDesireability', isLoggedIn, productreaction.submitResult);

	app.get('/admin', isLoggedIn, function (req, res) {
		res.render('admin.ejs');
	});

	app.get('/studies', isLoggedIn, admin.Studies);

	app.get('/usermanagement', isLoggedIn, user.UserManagement);
	  
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/admin',
		failureRedirect: '/',
		failureFlash : true
	}));
	  
	app.get('/logout', function(req, res) {
		req.logout();
		req.session.destroy();
		res.redirect('/');
	});
	
	app.post('/createuser', isLoggedIn, passport.authenticate('local-signup', {
		successRedirect : '/usermanagement',
		failureRedirect : '/usermanagement',
		failureFlash : true
	}));

	app.get('/deleteuser/:id', isLoggedIn, user.deleteUser);
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}