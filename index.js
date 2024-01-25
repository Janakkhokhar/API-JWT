let express = require('express');

let db = require("./cofig/mongoose");

let port = 8001;
let app = express();
let Register = require("./models/Admin/Register");


let passport = require('passport');
let passportjwt = require('./cofig/passport-jwt-stratergy');
let session = require('express-session');
app.use(express.urlencoded());


app.use(session({
    name: 'JWTSESSION',
    secret: 'batch',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 100
    }
}))

app.use(passport.initialize());
app.use(passport.session());



app.use('/admin', require('./routes/API/v1/Admin/admin'));


app.listen(port, function (err) {
    if (err) console.log("something worng");
    console.log("sunccess running code", port);
});