let mongoose = require('mongoose');

let multer = require('multer');

let path = require('path');

let fs = require('fs');

let ImagePathmanager = "/upload/managerImage";

let RegistermanagerSchema = mongoose.Schema({

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
    managerImage: {
        type: String
    },
    adminIds: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminRegister',
        required: true
    }
});

let imagestroage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../..', ImagePathmanager));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    }
});

RegistermanagerSchema.statics.UploadmanagerImage = multer({ storage: imagestroage }).single('managerImage');
RegistermanagerSchema.statics.managerImgModelPath = ImagePathmanager;

let managerRegister = mongoose.model('managerRegister', RegistermanagerSchema);
module.exports = managerRegister;