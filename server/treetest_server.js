require('mongoose').model('Study');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var resp = require('./response_server');

function convertResponseArrayToString(arr){
    var ret_str = "";
    for (var i = 1; i < arr.length; i=i+2) {
        ret_str+="/"+arr[i].toString()
    }
    return ret_str
}

function countUniqueInstances(taskArray){
    taskSets = []
    for (var task = 0; task < taskArray.length; task++) {
        var taskSet = {}
        var singleTask = taskArray[task]
        for (var response = 0; response < singleTask.length; response++) {
            taskSet[singleTask[response]] = (taskSet[singleTask[response]] || 0) + 1;
        }
        var taskSum = []
        Object.keys(taskSet).forEach(function(key) {
            taskSum.push(key+" ("+taskSet[key]+" of "+singleTask.length+" responses)");
        });
        taskSets.push(taskSum);
    }
    return taskSets
}

function gatherResponses(tasks, responses){
    var ret_responses = []
    for (var i = 0; i < tasks.length; i++) {
        ret_responses.push([]);
    }

    for (var i = 0; i < responses.length; i++) {
        var response = responses[i]
        for (var j = 0; j < response.data.length; j++) {
            ret_responses[j].push(convertResponseArrayToString(response.data[j]));
        }
    }
    return countUniqueInstances(ret_responses)
}

module.exports = {
    create: function (req, res) {
        var studyData = req.body;
        var newStudy = new Study({
            title: "Default Tree Test Title",
            dateCreated: new Date(Date.now()),
            type: "treetest",
            data: {
                showSiblings: true,
                selectableParents: true,
                tasks: ['Where is the Apple?','Where is the Steak?','Where is the Wine?'],
                tree: ['Food', 'Food/Meat', 'Food/Meat/Steak', 'Food/Meat/Chicken', 'Food/Meat/Pork', 'Food/Fruit', 'Food/Fruit/Apple', 'Food/Fruit/Banana', 'Food/Fruit/Orange', 'Food/Fruit/Lime', 'Food/Fruit/Grapefruit', 'Drink','Drink/Non-alcoholic', 'Drink/Non-alcoholic/Milk', 'Drink/Non-alcoholic/Water', 'Drink/Non-alcoholic/Juice', 'Drink/Alcohol', 'Drink/Alcohol/Beer', 'Drink/Alcohol/Wine'],
            },
            status: 'closed',
            ownerID: req.user._id,
            private: false,
        });
        newStudy.save(function (err) {
            if (err) {
                console.log('treetest_server.js: Error creating new treetest.');
                res.status(504);
                res.end(err);
            } else {
                console.log('treetest_server.js: Created new treetest via POST successfully.');
                var fullUrl = req.protocol + '://' + req.get('host')
                //res.render('treetest/edit.ejs',{title: "Create", singleStudy: newStudy, url: fullUrl,email: req.user.email});
                res.redirect('/edittreetest/'+newStudy._id+'?new=New');
                res.end();
            }
        });
    },
    edit: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("treetest_server.js: Error edit treetest.");
                res.end(err);
            } else {
				var fullUrl = req.protocol + '://' + req.get('host');
                res.render('treetest/edit.ejs',{title: req.query.new || "Edit", singleStudy: study, email: req.user.email, url: fullUrl});
            }
        });
    },
    results: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("treetest_server.js: Error getting study to see results.");
                res.end(err);
            } else {
                var responses = gatherResponses(study.data.tasks, study.completeResponses)
                res.render('treetest/results.ejs',{study: study, email: req.user.email, sumResp: responses});
            }
        });
    },
    update: function (req, res, next) {
        var tasks = req.body.tasks.split(/\r?\n/).map(function(item) {
             return item.trim();
        }).filter(function(n){ return n != '' });
        var tree = req.body.tree.split(/\r?\n/).map(function(item) {
             return item.trim();
        }).filter(function(n){ return n != '' });
        Study.findOne({_id: req.body.id, ownerID: req.user._id},
            function (err, study) {
            if (err) {
                res.status(504);
                console.log('treetest_server.js: error updating treetest');
                res.end(err);
            }
            else {
				study.title = req.body.title;
                study.data = {
                    tasks: tasks,
                    tree: tree,
                    selectableParents: req.body.selectableParents,
                    showSiblings: req.body.showSiblings,
                }
				study.status = req.body.status;
                study.private = req.body.private;
				study.save();
                res.redirect('/studies');
                res.end();
            }
        });
    },
}
