var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var resp = require('./response_server');

function renderPages(study,responseID,responseObj){
    switch(study.type) {
        case 'Card Sort':
            responseObj.render('cardsort/view.ejs',{singleStudy: study, response: responseID});
            break;
        case 'Tree Test':
            responseObj.render('treetest/view.ejs',{singleStudy: study, response: responseID});
            break;
        case 'Product Reaction Cards':
            responseObj.render('productreactioncards/view.ejs',{singleStudy: study, response: responseID});
            break;
        default:
            console.log('study-server.js - renderPages - default switch case');
            res.redirect('/study404');
            break;
    }
}

module.exports = {
    home: function (req, res, next) {
        Study.find({}, function (err, studies) {
            if (err) {
                res.status(504);
                console.log("study_server.js: Error edit cardsort.");
                res.end(err);
            } else {
                res.render("studies.ejs", {studies: studies, email: req.user.email});
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
               if (study.private){
                    if (req.params.resid && study.incompleteResponses.id(req.params.resid) != null){
                        var response = study.incompleteResponses.id(req.params.resid);
                        renderPages(study,req.params.resid,res)
                    } else {
                        res.redirect('/study404');
                    }
                } else {
                    var response = resp.createResponse(req.params.id,"Anonymous");
                    study.incompleteResponses.push(response);
                    study.save();
                    renderPages(study,response._id,res)
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
                res.redirect('/studies');
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
                res.redirect('/studies');
                res.end();   
            }
        });
    },
}

