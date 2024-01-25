let express = require('express');

let routes = express.Router();

let passport = require('passport');

let manager = require('../../../../models/manager/manager');

let managercontroller = require('../../../../controller/API/v1/manager/managercontroller');


routes.post('/add_manager', passport.authenticate('jwt', { failureRedirect: "/admin/manager/faillogin" }), manager.UploadmanagerImage, managercontroller.add_manager);

routes.get("/faillogin", async (req, res) => {

    return res.status(400).json({ msg: 'invalid Login', status: 0 });

})

routes.post('/managerlogin', managercontroller.managerlogin);


routes.get('/viewmanagerprofile', passport.authenticate('manager', { failureRedirect: "/admin/manager/faillogin" }), managercontroller.viewmanagerprofile);

routes.put('/editmangerprofile/:id', passport.authenticate('manager', { failureRedirect: "/admin/manager/faillogin" }), manager.UploadmanagerImage, managercontroller.editmangerprofile);


module.exports = routes;    
