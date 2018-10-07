var express = require("express");
var router  = express.Router();
var Campsite = require("../models/campground");


//INDEX - Display all CampGrounds
//secret route
router.get('/camp_grounds',function (req,res) {
    var isauth = Authenticate(req);
    Campsite.find({},function(err, allCampGrounds) {
        if(err){
            console.log('@@@@@@@@@@ Error @@@@@@@@');
            console.log(err);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
        else{
            //no permission
            if(isauth=="0"){
                res.render('campgrounds/index.ejs',{campgrounds:allCampGrounds,isLogged:0,user:"guest"});        
            }
            //regular permission
            else if(isauth=="1"){
               res.render('campgrounds/index.ejs',{campgrounds:allCampGrounds,isLogged:1,user:req.user.username});        
            }
            //admin
            else if(isauth=="1admin"){
               res.render('campgrounds/index.ejs',{campgrounds:allCampGrounds,isLogged:1,user:req.user.username});        
            }
        }
    });
});

//ADD - Page to Add CampGrounds
//secret route
router.get('/camp_grounds/new',function(req,res){
    var isauth = Authenticate(req);
        //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});        
    }
    //regular permission
    else if(isauth=="1"){
         //  window.alert("you must be logged as Web Admin to access this page");
           res.redirect('/camp_grounds');        
    }
    //admin
    else if(isauth=="1admin"){
            res.render('campgrounds/add.ejs',{isLogged:1});
    }
});

//CREATE - Add To DB
//secret route
router.post('/camp_grounds',function(req,res){
    var isauth = Authenticate(req);
    //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});        
    }
    //regular permission
    else if(isauth=="1"){
         //  window.alert("you must be logged as Web Admin to access this page");
           res.redirect('/camp_grounds');        
    }
    //admin
    else if(isauth=="1admin"){
            var camp =    req.body.campName;
            var url =     req.body.campImg;
            var desc =    req.body.campDes;
            var newCamp = {name: camp,img: url, des:desc};
            Campsite.create(newCamp,function(err,camp){
                if(err)
                {
                    console.log('@@@@@@@@@@ Error @@@@@@@@');
                    console.log(err);
                    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
                } 
                else{
                    console.log('@@@@@@ Camp-Created @@@@@@');
                } 
            });
            res.redirect('/camp_grounds');        
    }   
});

//SHOW - show more detail about CampGround
router.get('/camp_grounds/:id',function(req,res){
    var isauth = Authenticate(req);
    //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});        
    }
    Campsite.findById(req.params.id).populate("comments").exec(function(err,camp)
    {
        if(err){console.log(err);}
        else{
            //regular permission
            if(isauth=="1"){
                res.render('campgrounds/show.ejs',{camp:camp,isLogged:1,isEdit:0});        
            }
            //admin
            else if(isauth=="1admin"){
                res.render('campgrounds/show.ejs',{camp:camp,isLogged:1,isEdit:1});        
            }
        }
    });

});

//EDIT Route - a page to edit campground
router.get('/camp_grounds/:id/edit', function(req, res) {
    var isauth = Authenticate(req);
    //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});
    }
    //regular permission
    else if(isauth=="1"){
          // window.alert("you must be logged as Web Admin to access this page");
           res.redirect(`/camp_grounds/${req.params.id}`);        
    }
    //admin
    else if(isauth=="1admin"){
           Campsite.findById(req.params.id).populate("comments").exec(function(err,camp)
           {
                if(err){
                    console.log(err);
                } else{
                    console.log("camp Found!");
                    res.render('campgrounds/edit.ejs',{camp:camp,isLogged:1});
                }
           });        
    }
});

//PUT Route - update the data sent from the EDIT Route
router.put('/camp_grounds/:id',function(req,res){
    var isauth = Authenticate(req);
    //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});
    }
    //regular permission
    else if(isauth=="1"){
           //window.alert("you must be logged as Web Admin to access this page");
           res.redirect(`/camp_grounds/${req.params.id}`);        
    }
    //admin
    else if(isauth=="1admin"){
           var newCamp;
           Campsite.findById(req.params.id,function(err,comment){
               if(err){console.log("error "+err);}
               else{
                   newCamp={
                       name: req.body.campName,
                       img: req.body.campImg,
                       des: req.body.campDes
                   }
                   Campsite.findByIdAndUpdate(req.params.id,newCamp,function(err,updatedCamp){
                       if(err){console.log("error "+err);}
                       else{
                           res.redirect("/camp_grounds/"+updatedCamp._id);
                       }
                   });
              }
           });        
    }
})

//DELETE Route - delete campground
router.delete('/camp_grounds/:id',function(req,res){
    var isauth = Authenticate(req);
    //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});        
    }
    //regular permission
    else if(isauth=="1"){
        //window.alert("you must be logged as Web Admin to access this page");
        res.redirect(`/camp_grounds/${req.params.id}`);        
    }
    //admin permission
    else if(isauth=="1admin"){
           Campsite.findByIdAndRemove(req.params.id,function(err,deletedCamp){
               if(err){console.log("error "+err);}
               else{
                   res.redirect("/camp_grounds");
               }
           });         
    }
});

function Authenticate(req){
    if (req.isAuthenticated()){
       if(req.user.username == "admin"){
           return "1admin";
       }
       else{
           return "1";
       }
    }
    else{
        return "0";
    }
}

module.exports = router;