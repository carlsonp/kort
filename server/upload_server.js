var mongoose = require('mongoose');
var Upload = mongoose.model('Upload');
var fs = require("fs")
var path = require('path');

module.exports = {
    create: function(req,res){
        if(req.file) {
            var upload = new Upload({
                title: req.file.filename,
                path: req.file.path,
            });
            var filepath = path.parse(req.file.path);
            var newFileName = filepath.dir+path.sep+upload._id+filepath.ext;
            fs.rename(req.file.path, newFileName, function (err) {
                if (err) throw err;
            });
            upload.path = newFileName;
            upload.save(function (err) {
                if(err){
                    console.log('upload_server.js: Error creating new upload.');
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
                //if file (not db doc) exists remove it
                fs.stat(doc.path, function (err, stats) {
                   if (err) {
                       return console.error(err);
                   }
                   fs.unlink(doc.path,function(err){
                        if (err) {
                            return console.log(err);
                        } else {
                            //remove document from collection (not file)
                            doc.remove(function (err) {
                                if (err) {
                                    console.log(err);
                                    res.end(err);
                                } else {
                                    res.send(true);
                                    res.end();
                                }
                            });
                        } 
                    });  
                });
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
