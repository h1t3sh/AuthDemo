var express = require('express');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/auth_demo_app",{ useNewUrlParser: true , useUnifiedTopology: true });
var app = express();


app.set('view engine', 'ejs');

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
