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

passport.use(new LocalStrategy(User.authenticate()));   // in User model we added a plugin
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
// When a request hit secret, first it runs isLoggedIn, this function we defined in bottom checks if request is authenticated, if yes
app.get("/secret", isLoggedIn, function(req, res){      //+ then run the next() function, which is our callback that renders the page
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

// Login Routes
// render login form
app.get("/login", function(req, res){
    res.render("login");
});

// login logic
// middleware - When app gets post req, passport.authenticate (middleware)is run immediately
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    // nothing to call back, we keep it empty
});

app.get("/logout", function(req, res){
    req.logout();                       // Due to passport,it's that simple,  it destroys user data
    res.redirect("/")
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){  // this comes from passport
        return next();          // run the next functions, see secret route
    }
    res.redirect("/login");     // if not authenticated request, redirect to login and we are done, our call back in secret never runs
}



// Start the Server and listen on port 3002
app.listen(3002, function(){
    console.log("Server listening at port 3002")
});
