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

	//card sort routes
	app.get('/createcardsort', isLoggedIn, cardsort.create);
	app.get('/editcardsort/:id', isLoggedIn, cardsort.edit);
	app.get('/cardsort/:id', study.view);
	app.get('/cardsort/preview/:id', isLoggedIn, study.preview);
	app.get('/cardsort/:id/:resid', study.view);
	app.get('/cardsortresults/:id', isLoggedIn, cardsort.results);
	app.post('/updatecardsort', isLoggedIn, cardsort.update);

	//tree test routes
	app.get('/createtreetest', isLoggedIn, treetest.create);
	app.get('/edittreetest/:id', isLoggedIn, treetest.edit);
	app.get('/treetest/:id', study.view);
	app.get('/treetest/preview/:id', isLoggedIn, study.preview);
	app.get('/treetest/:id/:resid', study.view);
	app.get('/treetestresults/:id', isLoggedIn, treetest.results);
	app.post('/updatetreetest', isLoggedIn, treetest.update);

	//product reaction cards routes
	app.get('/createproductreactioncards', isLoggedIn, productreactioncards.create);
	app.get('/editproductreactioncards/:id', isLoggedIn, productreactioncards.edit);
	app.get('/productreactioncards/:id', study.view);
	app.get('/productreactioncards/preview/:id', isLoggedIn, study.preview);
	app.get('/productreactioncards/:id/:resid', study.view);
	app.get('/productreactioncardsresults/:id', isLoggedIn, productreactioncards.results);
	app.post('/updateproductreactioncards', isLoggedIn, productreactioncards.update);

	//study routes
	app.get('/studies', isLoggedIn, study.home);
	app.get('/study/:id', study.view);
	app.get('/study/copy/:id', study.copy);
	app.get('/study/:id/:resid', study.view);
	app.get('/study/preview/:id', isLoggedIn, study.preview);
	app.post('/submitResult', isLoggedIn, study.submitResult);
	app.get('/deletestudy/:id', isLoggedIn, study.delete);
	app.get('/clearstudy/:id', isLoggedIn, study.clearResponses);

	app.get('/msg/:cm', function (req, res) {
		switch(req.params.cm) {
		    case "thanks":
		        res.render('msg.ejs', {titleline: "Thanks!", msg: "Your response has been recorded"});
		        break;
		    case "study404":
		        res.render('msg.ejs', {titleline: "Can't find the study. Sorry :(", msg: "Your study couldn't be found."});
		        break;
			case "notactive":
		        res.render('msg.ejs', {titleline: "Sorry. The study isn't accepting responses.", msg: "Contact your study coordinator."});
		        break;
		    default:
		        res.redirect('/');
		}
	});

	//response routes
	app.post('/createresponse_ajax/:studyID', isLoggedIn, response.create_ajax);
	app.post('/deleteresponse/:studyID/:resid', isLoggedIn, response.delete);

	//???
	app.get('/overview', isLoggedIn, function (req, res) {
		res.render('overview.ejs', {email: req.user.email});
	});

	//user routes
	app.get('/users', isLoggedIn, user.UserManagement);
	app.post('/createuser', isLoggedIn, passport.authenticate('local-signup', {
		successRedirect : '/users',
		failureRedirect : '/users',
		failureFlash : true
	}));
	app.get('/deleteuser/:id', isLoggedIn, user.deleteUser);
	app.post('/resetpassword', isLoggedIn, user.resetPassword);
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/overview',
		failureRedirect: '/',
		failureFlash : true
	}));
	app.get('/logout', function(req, res) {
		req.logout();
		req.session.destroy();
		res.redirect('/');
	});

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
