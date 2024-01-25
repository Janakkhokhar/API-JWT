
let express = require('express');

let bcrypt = require('bcrypt');

let jwtdata = require('jsonwebtoken');

let path = require('path');

let fs = require('fs');

let user = require('../../../../models/user/user');

module.exports.ragister = async (req, res) => {
    try {
        if (req.body.password == req.body.confrom_pass) {

            let checkemail = await user.findOne({ email: req.body.email });

            if (checkemail) {
                return res.status(200).json({ mes: "Email already Exit", status: 1 });

            } else {
                var imagePath = " ";
                if (req.file) {
                    imagePath = user.userImgModelPath + "/" + req.file.filename;
                }
                req.body.userImage = imagePath;
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let data = await user.create(req.body);
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
        return req.status(400).json({ mes: "something worng", status: 0 });
    }
}

module.exports.login = async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);
    try {
        let check = await user.findOne({ email: req.body.email });
        console.log(check);
        if (check) {
            console.log("hiiiii");
            if (await bcrypt.compare(req.body.password, check.password)) {
                let token = await jwtdata.sign({Userdata: check }, 'User', { expiresIn: '1h' })
                return res.status(200).json({ msg: 'Login Succ.. & token granted Succ....', status: 1, token: token });
            }
            else {
                return res.status(200).json({ msg: 'Password not match', status: 0 });
            }
        }
        else {
            return res.status(200).json({ msg: 'invalid email', status: 0 });
        }

    }
    catch (err) {
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}


module.exports.profile = async (req, res) => {
    try {
        let user = await req.user;
        console.log("hiiii");
        console.log(req.user);
        if (user) {
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, userData: user });
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


module.exports.editprofile = async(req,res)=>{
     try {
        if (req.file) {
            let oldimgData = await user.findById(req.params.id);

            if (oldimgData.userImage) {
                let FullPath = path.join(__dirname, "../../../..", oldimgData.userImage);
                console.log(FullPath);
                await fs.unlinkSync(FullPath);
            }
            var imagePath = '';
            imagePath = user.userImgModelPath + "/" + req.file.filename;
            req.body.userImage = imagePath;
        }
        else {
            let olddata = await user.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.userImage;
            }
            req.body.userImage = imgpath;
        }

        let userupdated = await user.findByIdAndUpdate(req.params.id, req.body);

        if (userupdated) {
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, userData: userupdated });
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