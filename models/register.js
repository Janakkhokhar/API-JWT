let mongoose = require('mongoose');

let multer = require('multer');

let path = require('path');

let fs = require('fs');

let ImagePath = "/upload";

let RegisterSchema = mongoose.Schema({

    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    city: {
        type: String
    },
    gender: {
        type: String
    },
    hobby: {
        type: Array
    },
    message: {
        type: String
    },
    image: {
        type: String
    } 
});

let imagestroage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null ,path.join(__dirname,'..',ImagePath));
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now());
    }
});

RegisterSchema.statics.UploadImage = multer({storage :imagestroage}).single('image');
RegisterSchema.statics.ImageModelPath = ImagePath;  

let register = mongoose.model('register', RegisterSchema);
module.exports = register;