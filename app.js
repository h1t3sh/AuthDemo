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

app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({    // require express -session and run it with below 3 parameters
    secret: "The world spins round and round and round in a loop",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); // 2 lines req to use passport
app.use(passport.session());

// responsible for reading data from session and encoding and decodign it
passport.serializeUser(User.serializeUser());           // encode data (serialize)
passport.deserializeUser(User.deserializeUser());       // unencoding data (deserializing)

//================
// Routes
//================

// Home Page route - Root route
app.get("/", function(req, res){
    res.render("home");
});

// Secret Page Route
app.get("/secret", function(req, res){
    res.render("secret");
});

// Auth Routes

//Show sign up form
app.get("/register", function(req, res){
    res.render("register");
});

//Handling user sign up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){ // make new user and pass username, pass password as second argument to user.register which hashes it and stores it in DB
        if(err){
            console.log(err);
            return res.render('register');
        }//if noerror
        passport.authenticate("local")(req, res, function(){ //log the user in, run serialize method with local strategy
            res.redirect("/secret");
        });
    });
});





app.listen(3002, function(){
    console.log("Server listening at port 3002")
});
