var express              = require('express'),
    mongoose             = require('mongoose'),
    passport             = require('passport'),
    bodyParser           = require('body-parser'),
    User                 = require('./models/user'),
    LocalStrategy        = require('passport-local'),
    passportLocaMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/auth_demo_app",{ useNewUrlParser: true , useUnifiedTopology: true });
var app = express();


app.set('view engine', 'ejs');

app.use(require("express-session")({    // require express -session and run with below 3 parameters
    secret: "The world spins round and round and round in a loop",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); // 2 lines req to use passport
app.use(passport.session());

passport.serializeUser(User.serializeUser());   // responsible for readind data from session and encoding and decodign it
passport.deserializeUser(User.deserializeUser());   // unencoding data (deserializing)


// Home Page route - Root route
app.get("/", function(req, res){
    res.render("home");
});

// Secret Page Route
app.get("/secret", function(req, res){
    res.render("secret");
});





app.listen(3002, function(){
    console.log("Server listening at port 3002")
});
