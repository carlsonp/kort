var mongoose = require('mongoose');
var Upload = mongoose.model('Upload');
var fs = require("fs")

module.exports = {
    create: function(req,res){
        if(req.file) {
            var upload = new Upload({
                    title: req.file.filename,
                    path: req.file.path,
            });
            //create new file path
            var pathToArray = req.file.path.split('\\');
            var dir = pathToArray[0]+'\\'+pathToArray[1]+"\\";
            var ext = pathToArray[2].split('.')[1];
            var newFileName = upload._id+"."+ext;

            fs.rename(req.file.path, dir+newFileName, function (err) {
              if (err) throw err;
              console.log('renamed complete');
            });
            upload.path = dir+newFileName;
            upload.save(function (err) {
                if(err){
                    console.log('cardsort_server.js: Error creating new cardsort via POST.');
                    res.status(504);
                    res.end(err);
                } else {
                    res.send(upload);
                    res.end();
                }
            });
        }
    },
    delete: function(req, res, next) {
        Upload.findOne({ _id: req.params.id}, function(err,doc) {
            if (err) {
                req.status(504);
                console.log("upload_server.js: Cannot find upload to delete:" + req.params.id);
                console.log(err);
                req.end();
            } else {
                fs.stat(doc.path, function (err, stats) {
                   if (err) {
                       return console.error(err);
                   }
                   fs.unlink(doc.path,function(err){
                        if(err) return console.log(err);
                        console.log(doc.path+' deleted successfully');
                   });  
                });
            }
        }).remove(function (err) {
            if (err) {
                console.log(err);
                res.end(err);
            } else {
                console.log("document removed from db");
                res.send(true);
                res.end();
            }
        });
    },
    getPathById: function(req,res){
        Upload.findOne({_id: req.params.id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error edit cardsort.");
                res.end(err);
            } else {
                res.send(docs.path);
                res.end();
            }
        });
    },   
}
