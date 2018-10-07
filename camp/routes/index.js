
var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user"),
    bcrypt = require("bcryptjs");

//ROOT ROUTE - home
router.get('/',function (req,res) {
    if (req.isAuthenticated()){
       console.log("you shall pass!");
       res.render('land.ejs',{isLogged:1});
    } 
    else{
       res.render('land.ejs',{isLogged:0});
    } 

});

//==============================   AUTH ROUTES   ===============================
//INDEX - open SignUp page
router.get('/signUp',function(req, res) {
        if (req.isAuthenticated()){
            res.redirect('/');
        }
        else{
            res.render('signUp.ejs',{eMsg:""});
        }
});

//CREATE - create user to DB
router.post("/signUp", function(req, res, next){
    var userN   = req.body.username,
        pass    = req.body.password,
        newUser = new User ({username:userN, password:pass});
    User.findOne({username:userN},function(err, foundUser) {
        if(err){
            console.log(err);
            res.redirect('/signUp');
            
        }
        else{
            bcrypt.genSalt(10, (err, salt) => {
                if(err){
                    console.log(err);
                }
                else{
                    
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            newUser.password = hash;
                            newUser.save(function(err, user) {
                                 if(err){
                                     console.log(err);
                                     if(err.code == 11000){
                                        res.render('signUp.ejs',{eMsg:`The user: ${foundUser.username} already exsist`});
                                     }
                                     else{
                                        res.render('signUp.ejs',{eMsg:`something went wrong if error persist contact admin`});   
                                     }
                                 }
                                 else{
                                     console.log("created");
                                     req.login(user, err => {
                                         if (err) next(err);
                                         else res.redirect("/camp_grounds");
                                     });
                                     
                                 }
                            });
                        }
                    });
                }
            });
        }
    });
});

//INDEX - LogIn page
router.get('/logIn',function(req, res) {
        if (req.isAuthenticated()){
            res.redirect('/');
        }
        else{
           res.render('logIn.ejs',{eMsg:""});
        }
});

//POST - ENTER LOGIN
router.post("/login",function(req, res) {
    if((req.body.username == null || req.body.username == undefined) || (req.body.password == null || req.body.password == undefined)){
                res.render('logIn.ejs',{eMsg:"something went wrong user or password are incorrect"});        
    }
    else if(req.body.username.trim() == "" && req.body.password.trim() == ""){
                res.render('logIn.ejs',{eMsg:"username and password are empty"});         
    }
    else if(req.body.username.trim().includes("&")||req.body.username.trim().includes("*")||req.body.username.trim().includes("$")||req.body.username.trim().includes("#")||req.body.username.trim().includes("@")||req.body.username.trim().includes("{")||req.body.username.trim().includes("}")||req.body.username.trim().includes("_")||req.body.username.trim().includes("%")){
                res.render('logIn.ejs',{eMsg:"username must not caontain strange charecters as $,*,&,#,@ etc.."});         
    }
    else{
        var x;
        User.findOne({username:req.body.username},function(err, user) {
            if(err == null){
                if(user ==null || user==undefined){
                    res.render('logIn.ejs',{eMsg:"something went wrong user or password are incorrect"});                    
                } 
                else{
                    if(bcrypt.compareSync(req.body.password,user.password)){
                        req.login(user, err => {
                            if (err) console.log(err);
                            else res.redirect("/camp_grounds");
                        });//login
                    }//if
                    else{
                        res.render('logIn.ejs',{eMsg:"something went wrong user or password are incorrect"});
                    }
                }//else
            }
        });//find
    }
});//POST LOGIN

//LOGOUT ROUTE
router.all("/logout", function(req, res) {
    if (req.isAuthenticated()){
       console.log("logging out");
       req.logout();
    } 
    else{
       res.redirect('/');
    }
    res.redirect("/");
});

module.exports = router;