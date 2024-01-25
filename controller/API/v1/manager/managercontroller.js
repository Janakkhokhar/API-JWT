let express = require('express');

let manager = require('../../../../models/manager/manager');

let admin = require('../../../../models/Admin/Register');

let nodemailer = require("nodemailer");

let bcrypt = require('bcrypt');


let jwtdata = require('jsonwebtoken');

let path = require('path')

let fs = require('fs');




module.exports.add_manager = async (req, res) => {
    try {
        if (req.body.password == req.body.confrom_pass) {

            let check = await manager.findOne({ email: req.body.email })
            // console.log(check)

            if (check) {
                return res.status(200).json({ msg: 'Email alrady  Ragisted....', status: 1 });
            }
            else {
                let password = req.body.password
                var imgpath = '';
                if (req.file) {
                    imgpath = manager.managerImgModelPath + "/" + req.file.filename;
                }
                req.body.adminIds = req.user.id;
                req.body.managerImage = imgpath;
                req.body.password = await bcrypt.hash(req.body.password, 10);

                let data = await manager.create(req.body);

                if (data) {
                    let reg = await admin.findById(req.user.id);
                    reg.managerIds.push(data.id);
                    await admin.findByIdAndUpdate(req.user.id,reg);

                    let transporter = nodemailer.createTransport({

                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                            user: "janakkhokhar28@gmail.com",
                            pass: "lzqoovoivrjvorai",
                        },
                    });

                    const info = await transporter.sendMail({
                        from: 'janakkhokhar28@gmail.com', // sender address
                        to: req.body.email, // list of receivers    
                        text: "Hello Manager", // plain text body
                        html: `<b>email : ${req.body.email}</b><br><b>password:${password}`, // html body
                    });

                    return res.status(200).json({ msg: 'Data Inserted Succ....', status: 1, rec: data });
                }
                else {
                    return res.status(200).json({ msg: 'Data not Inserted Succ....', status: 0 });
                }
            }
        }
        else {

            return res.status(200).json({ msg: 'Confirm Password not Match', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}


module.exports.managerlogin = async (req, res) => {
    try {
        let checkemailmanager = await manager.findOne({ email: req.body.email })
        if (checkemailmanager) {
            if (await bcrypt.compare(req.body.password, checkemailmanager.password)) {
                let token = await jwtdata.sign({ Managerdata: checkemailmanager }, 'Manager', { expiresIn: '1h' });

                return res.status(200).json({ msg: 'Login Succ.. & token granted Succ....', status: 1, token: token });
            }
            else {
                return res.status(200).json({ msg: 'Password not match', status: 0 });
            }
        }
        else {
            return res.status(200).json({ msg: 'Invalid Email', status: 0 });
        }
    } catch (error) {
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}


module.exports.viewmanagerprofile = async (req, res) => {
    try { 
        let managerprofile = await manager.findById(req.user.id).populate('adminIds').exec();

        return res.status(200).json({ mes: "Manager data is here", status: 1, md: managerprofile });
    }
    catch (error) {
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}


module.exports.editmangerprofile = async (req, res) => {
    try {
        if (req.file) {
            console.log("hi");
            let oldimgData = await manager.findById(req.params.id);
            console.log(oldimgData);
            if (oldimgData.managerImage) {
                let FullPath = path.join(__dirname, "../../../..", oldimgData.managerImage);
                console.log(FullPath);
                await fs.unlinkSync(FullPath);
            }
            var imagePath = '';
            imagePath = manager.managerImgModelPath + "/" + req.file.filename;
            req.body.managerImage = imagePath;
        }
        else {
            let olddata = await manager.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.managerImage;
            }
            req.body.managerImage = imgpath;
        }

        let managerupdated = await manager.findByIdAndUpdate(req.params.id, req.body);

        if (managerupdated) {
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: managerupdated });
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