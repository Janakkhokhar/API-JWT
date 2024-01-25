let express = require('express');

let bcrypt = require('bcrypt');

let jwtdata = require('jsonwebtoken');

let path = require('path');
let fs = require('fs');

let Register = require('../../../../models/Admin/Register');
let manager = require('../../../../models/manager/manager');

module.exports.ragister = async (req, res) => {
    try {
        if (req.body.password == req.body.confrom_pass) {

            let checkemail = await Register.findOne({ email: req.body.email });

            if (checkemail) {
                return res.status(200).json({ mes: "Email already Exit", status: 1 });

            } else {
                var imagePath = " ";
                if (req.file) {
                    imagePath = Register.AdminImgModelPath + "/" + req.file.filename;
                }
                req.body.AdminImage = imagePath;
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let data = await Register.create(req.body);
                if (data) {
                    return res.status(200).json({ mes: "Data insert success", status: 1 });

                } else {
                    return res.status(400).json({ mes: "Data not insert", status: 0 });

                }
            }
        }
        else {
            console.log("password not match");
            return res.status(400).json({ mes: "Confrom  not match", status: 0 });
        }

    } catch (error) {
        return res.status(400).json({ mes: "something worng", status: 0 });
    }
}


module.exports.login = async (req, res) => {
    try {
        let check = await Register.findOne({ email: req.body.email });
        if (check) {
            if (await bcrypt.compare(req.body.password, check.password)) {
                let token = await jwtdata.sign({ data: check }, 'batch', { expiresIn: '1h' })
                return res.status(200).json({ msg: 'Login Succ.. & token granted Succ....', status: 1, token: token });
            }
            else {
                return res.status(200).json({ msg: 'Password not match', status: 0 });
            }
        }
        else {
            console.log(' invalid email ');
            return res.status(200).json({ msg: 'invalid email', status: 0 });
        }

    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}


module.exports.ViewAllAdmin = async (req, res) => {

    try {
        let admin = await Register.find({});
        if (admin) {
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, rec: admin });
        }
        else {
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }

    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}

module.exports.profile = async (req, res) => {
   
        try { 
            console.log(req.user.id)
            let managerprofile = await Register.findById(req.user.id).populate('managerIds').exec();
    
            return res.status(200).json({ mes: "Manager data is here", status: 1, md: managerprofile });
        }
        catch (error) {
            return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
        }
}

module.exports.editprofile = async (req, res) => {

    try {
        if (req.file) {
            let oldimgData = await Register.findById(req.params.id);

            if (oldimgData.AdminImage) {
                let FullPath = path.join(__dirname, "../../../..", oldimgData.AdminImage);
                console.log(FullPath);
                await fs.unlinkSync(FullPath);
            }
            var imagePath = '';
            imagePath = Register.ImagePathAdmin + "/" + req.file.filename;
            req.body.AdminImage = imagePath;
        }
        else {
            let olddata = await Register.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.AdminImage;
            }
            req.body.AdminImage = imgpath;
        }

        let adminupdated = await Register.findByIdAndUpdate(req.params.id, req.body);

        if (adminupdated) {
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: adminupdated });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }

    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}

module.exports.ManagerAllRecord = async (req, res) => {

    try {
        let manager = await manager.find({});
        if (manager) {
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, rec: manager });
        }
        else {
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }

    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}

    
module.exports.allmanagerdatabyadmin = async(req,res)=>{
    try {
        let managerdata = await manager.find({});
        console.log(managerdata);
        if (managerdata) {
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, rec: managerdata });
        }
        else {
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }

    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}

