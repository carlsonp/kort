var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var resp = require('./response_server');

function renderPages(study,responseID,responseObj){
    switch(study.type) {
        case 'sus':
            responseObj.render('sus/view.ejs',{singleStudy: study, response: responseID});
            break;
        case 'cardsort':
            responseObj.render('cardsort/view.ejs',{singleStudy: study, response: responseID});
            break;
        case 'treetest':
            responseObj.render('treetest/view.ejs',{singleStudy: study, response: responseID});
            break;
        case 'productreactioncards':
            responseObj.render('productreactioncards/view.ejs',{singleStudy: study, response: responseID});
            break;
        default:
            console.log('study-server.js: renderPages function - default switch case');
            res.redirect('/study404');
            break;
    }
}

module.exports = {
    home: function (req, res, next) {
        Study.find({ownerID: req.user._id}, function (err, studies) {
            if (err) {
                res.status(504);
                console.log("study_server.js: Error edit cardsort.");
                res.end(err);
            } else {
                res.render("studies.ejs", {studies: studies, email: req.user.email});
            }
        });
    },
    homenew: function (req, res, next) {
        Study.find({ownerID: req.user._id}, function (err, studies) {
            if (err) {
                res.status(504);
                console.log("study_server.js: Error edit cardsort.");
                res.end(err);
            } else {
                res.render("studies.ejs", {new: true,studies: studies, email: req.user.email});
            }
        });
    },
    copy: function (req, res, next) {
        Study.findOne({_id: req.params.id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("study_server.js: Error copying study.");
                res.end(err);
            } else {
                var newStudy = new Study({
                    title: "Copy of "+study.title,
                    dateCreated: new Date(Date.now()),
                    type: study.type,
                    data: study.data,
                    status: study.status,
                    ownerID: study.ownerID,
                    private: study.private,
                }).save();
                res.redirect('/studies');
            }
        });
    },
    view: function (req, res, next) {
        Study.findOne({_id: req.params.id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("study_server.js: Error viewing study.");
                res.end(err);
            } else {
				if (study.status == "open") {
				   if (study.private){
						if (req.params.resid && study.incompleteResponses.id(req.params.resid) != null){
							var response = study.incompleteResponses.id(req.params.resid);
							renderPages(study,req.params.resid,res)
						} else {
							res.redirect('/msg/study404');
						}
					} else {
                        //if a response id was not passed, create a response and render page
                        if (req.params.resid == null) {
                            var response = resp.createResponse(req.params.id,"Anonymous");
                            study.incompleteResponses.push(response);
                            study.save();
                            renderPages(study,response._id,res)
                        } else {
                            //if response id was sent - send error page
                            res.redirect('/msg/study404');
                        }
					}
				} else {
					res.redirect('/msg/notactive');
				}
            }
        });
    },
    preview: function (req, res, next) {
        Study.findOne({_id: req.params.id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error previewing cardsort.");
                res.end(err);
            } else {
                renderPages(study,"preview",res)
            }
        });
    },
    delete: function(req, res, next) {
        Study.findOne({ _id: req.params.id, ownerID: req.user._id}, function(err) {
            if (err) {
                req.status(504);
                console.log("study_server.js: Cannot find study to delete:" + req.params.id);
                console.log(err);
                req.end();
            }
        }).remove(function (err) {
            if (err) {
                console.log(err);
                res.end(err);
            } else {
                res.send(true);
                res.end();
            }
        });
    },
    submitResult: function (req, res, next) {
         Study.findOne({_id: req.body.id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("study_server.js: Error viewing cardsort.");
                res.end(err);
            } else {
                //if the study is being previewed, don't record the response
                if (req.body.resid === "preview"){
                    res.redirect('/studies');
                    res.end();
                } else {
                    //find the response object and updated it
                    var response = study.incompleteResponses.id(req.body.resid);
                    response.complete = true;
                    response.date = new Date(Date.now());
                    response.data = JSON.parse(req.body.result);
                    //move response object from incompleteResponses to completeResponses
                    study.completeResponses.push(response);
                    var respIdx = study.incompleteResponses.indexOf(response);
                    study.incompleteResponses.splice(respIdx,1);
                    //save the study object (which will save the child objects)
                    study.save();
                    res.redirect('/msg/thanks');
                    res.end();
                }
               
            }
        });
    },
    clearResponses: function(req, res, next) {
        Study.findOne({ _id: req.params.id, ownerID: req.user._id}, function(err, study) {
            if (err) {
                req.status(504);
                console.log("study_server.js: Cannot find study to clear responses:" + req.params.id);
                console.log(err);
                req.end();
            } else {
                //clear participant responses
                study.incompleteResponses = [];
                study.completeResponses = [];
                study.save();
                res.redirect('/studies');
                res.end();
            }
        });
    },
}
