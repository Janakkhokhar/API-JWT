let mongoose = require('mongoose');

let multer = require('multer');

let path = require('path');

let fs = require('fs');

let ImagePathuser = "/upload/userImage";

let RegisteruserSchema = mongoose.Schema({

    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    gender: {
        type: String
    },
    city: {
        type: String
    },
    hobby: {
        type: Array
    },
    userImage: {
        type: String
    } 
});

let imagestroage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null ,path.join(__dirname,'../..',ImagePathuser));
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now());
    }
});

RegisteruserSchema.statics.UploaduserImage = multer({storage :imagestroage}).single('userImage');
RegisteruserSchema.statics.userImgModelPath = ImagePathuser;  

let userRegister = mongoose.model('userRegister', RegisteruserSchema);
module.exports = userRegister;

