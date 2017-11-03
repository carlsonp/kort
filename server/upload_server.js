var mongoose = require('mongoose');
var Upload = mongoose.model('Upload');

module.exports = {
    create: function(req,res){
        if(req.file) {
            console.log(req.file);
            var upload = new Upload({
                    title: req.file.filename,
                    path: req.file.path,
            }).save();
            res.render('upload.ejs',{imgpath: req.file.path});
        }
    },
    // delete: function(req,res){
    
    // },
    // getPathById: function(req,res){
    
    // },   
}
