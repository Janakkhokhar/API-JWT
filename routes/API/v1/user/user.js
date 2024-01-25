let express = require('express');

let routes = express.Router();

let passport = require('passport');

let user = require('../../../../models/user/user');

let usercontroller = require('../../../../controller/API/v1/user/usercontroller');


routes.post('/ragister',user.UploaduserImage,usercontroller.ragister);

routes.post('/login', usercontroller.login);


routes.get("/faillogin", async (req, res) => {

    return res.status(400).json({ msg: 'invalid Login', status: 0 });

});


routes.get('/profile', passport.authenticate('user', { failureRedirect: "/admin/user/faillogin" }), usercontroller.profile);

routes.put('/editprofile/:id', passport.authenticate('user', { failureRedirect: "/admin/user/faillogin" }), usercontroller.editprofile)



module.exports = routes;
