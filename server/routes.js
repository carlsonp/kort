//load in functions
var study = require('./study_server');
var cardsort = require('./cardsort_server');
var treetest = require('./treetest_server');
var productreactioncards = require('./productreactioncards_server');
var user = require('./user_server');
var response = require('./response_server');

module.exports = function(app, passport, flash) {

	app.get('/', function (req, res) {
		res.render('index.ejs', { loginMessage: req.flash('loginMessage') });
	});

	app.post('/createcardsort_ajax', isLoggedIn, cardsort.create_ajax);
	app.get('/editcardsort/:id', isLoggedIn, cardsort.edit);
	app.get('/cardsort/:id', cardsort.view);
	app.get('/cardsort/:id/:resid', cardsort.view);
	app.get('/cardsortresults/:id', isLoggedIn, cardsort.results);
	app.post('/updatecardsort', isLoggedIn, cardsort.update);

	app.post('/createtreetest_ajax', isLoggedIn, treetest.create_ajax);
	app.get('/edittreetest/:id', isLoggedIn, treetest.edit);
	app.get('/treetest/:id', treetest.view);
	app.get('/treetest/:id/:resid', treetest.view);
	app.get('/treetestresults/:id', isLoggedIn, treetest.results);
	app.post('/updatetreetest', isLoggedIn, treetest.update);
	
	app.post('/createproductreactioncards_ajax', isLoggedIn, productreactioncards.create_ajax);
	app.get('/editproductreactioncards/:id', isLoggedIn, productreactioncards.edit);
	app.get('/productreactioncards/:id', productreactioncards.view);
	app.get('/productreactioncards/:id/:resid', productreactioncards.view);
	app.get('/productreactioncardsresults/:id', isLoggedIn, productreactioncards.results);
	app.post('/updateproductreactioncards', isLoggedIn, productreactioncards.update);
	
	app.post('/createresponse_ajax/:studyID', isLoggedIn, response.create_ajax);

	app.post('/submitResult', isLoggedIn, study.submitResult);
	app.get('/deletestudy/:id', isLoggedIn, study.delete);

	app.get('/admin', isLoggedIn, function (req, res) {
		res.render('admin.ejs', {email: req.user.email});
	});

	app.get('/studies', isLoggedIn, study.view);

	app.get('/users', isLoggedIn, user.UserManagement);
	  
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
		successRedirect : '/users',
		failureRedirect : '/users',
		failureFlash : true
	}));

	app.get('/deleteuser/:id', isLoggedIn, user.deleteUser);
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
