let passport = require('passport');
let passportjwt = require('passport-jwt');
let Ragister = require('../models/Admin/Register');
let manager = require('../models/manager/manager');
let user = require('../models/user/user');

let jwtStrategy = require('passport-jwt').Strategy;
let jwtExtract = require('passport-jwt').ExtractJwt;

var opts = {
    jwtFromRequest :jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'batch'
}

var opts1 = {
    jwtFromRequest :jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'Manager'
}

var opts2 = {
    jwtFromRequest :jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'User'
}

passport.use(new jwtStrategy(opts , async function(record , done){
    let checkAdmin = await Ragister.findById(record.data._id);
    // console.log(checkAdmin)
    if(checkAdmin){
        return done(null,checkAdmin)
    }
    else{
        return done(null,false);
    }
}))


passport.use("manager",new jwtStrategy(opts1 , async function(record , done){
    // console.log(record);
    let checkmanager = await manager.findById(record.Managerdata._id);
    if(checkmanager){
        return done(null,checkmanager)
    }
    else{
        return done(null,false);
    }
}));


passport.use("user",new jwtStrategy(opts2 , async function(record , done){
    // console.log(record);
    let checkmanager = await user.findById(record.Userdata._id);
    if(checkmanager){
        return done(null,checkmanager)
    }
    else{
        return done(null,false);
    }
}))

passport.serializeUser(function(user,done){
    return done(null,user.id)
})

passport.deserializeUser(async function(id,done){
    let recheck = await Ragister.findById(id);

    if(recheck){
        return done(null,recheck);
    }
    else{
        return done(null,false);
    }
})