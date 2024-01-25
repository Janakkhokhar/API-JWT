let express = require('express');

let routes = express.Router();

let passport = require('passport');

let admincontroller = require('../../../../controller/API/v1/Admin/admincontroller');

let Register = require('../../../../models/Admin/Register');


routes.post('/ragister', Register.UploadAdminImage, admincontroller.ragister);

routes.post('/login', admincontroller.login);

routes.get('/profile', passport.authenticate('jwt', { failureRedirect: "/admin/faillogin" }), admincontroller.profile);

routes.put('/editprofile/:id', passport.authenticate('jwt', { failureRedirect: "/admin/faillogin" }), Register.UploadAdminImage, admincontroller.editprofile)

routes.get("/faillogin", async (req, res) => {

    return res.status(400).json({ msg: 'invalid Login', status: 0 });

})

routes.get('/ViewAllAdmin', passport.authenticate('jwt', { failureRedirect: "/admin/faillogin" }), admincontroller.ViewAllAdmin);

routes.get('/allmanagerdatabyadmin', passport.authenticate('jwt', { failureRedirect: "/admin/faillogin" }), admincontroller.allmanagerdatabyadmin);

routes.use('/manager', require("../manager/manager"));
  
routes.use('/user', require("../user/user"));



module.exports = routes;
