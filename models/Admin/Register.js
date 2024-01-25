let mongoose = require('mongoose');

let multer = require('multer');

let path = require('path');

let fs = require('fs');

let ImagePathAdmin = "/upload/AdminImage";

let RegisterAdminSchema = mongoose.Schema({

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
    AdminImage: {
        type: String
    },
    managerIds:{
        type:Array,
        ref:'managerRegister'
    } 
});

let imagestroage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null ,path.join(__dirname,'../..',ImagePathAdmin));
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now());
    }
});

RegisterAdminSchema.statics.UploadAdminImage = multer({storage :imagestroage}).single('AdminImage');
RegisterAdminSchema.statics.AdminImgModelPath = ImagePathAdmin;  

let AdminRegister = mongoose.model('AdminRegister', RegisterAdminSchema);
module.exports = AdminRegister;