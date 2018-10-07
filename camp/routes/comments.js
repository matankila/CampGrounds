var express = require("express");
var router  = express.Router({mergeParams: true});
var Campsite = require("../models/campground");
var Comment = require("../models/comment");

//CREATE - create a comment
//secret route
router.post('/camp_grounds/:id/',function(req,res){
    var isauth = Authenticate(req);
    //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});          
    }
    //regular permission
    else if(isauth=="1"){
       Comment.findById(req.params.id,function(err,comment)
       {
           if(err){console.log(err);}
           else{
                   var comment = {
                       text:req.body.comment.text ,
                       author: req.user.username,
                       id_Camp: req.params.id
                   };
                   Comment.create(comment,function(err,comment){
                       if(err){console.log(err);}
                       else{
                           console.log("created!");
                           Campsite.findById(req.params.id,function(err,foundCamp){
                               if(err){console.log(err);}
                               else{
                                   console.log("found camp!");
                                   foundCamp.comments.push(comment);
                                   foundCamp.save();
                                   res.redirect("/camp_grounds/"+req.params.id);
                               }
                           });
                       }
                   });
           
           }
       });
       
    }
});

//SHOW - show more detail about comment
router.get('/camp_grounds/:id/comments/:id',function(req,res){
    var isauth = Authenticate(req);
    //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});        
    }
    //regular permission
    else if(isauth=="1"){
       Comment.findById(req.params.id,function(err,comment)
       {
           console.log(comment);
           if(err){console.log(err);}
           else{
               //this user wrote the comment
               if(req.user.username == comment.author){
                   res.render('comments/add.ejs',{comment:comment,isLogged:1,myComment:1});     
               }
               //this user didnt wrote the comment
               else{
                   res.render('comments/add.ejs',{comment:comment,isLogged:1,myComment:0});
               }
           
           }
       });
       
    }
});

//EDIT - route
router.get('/camp_grounds/:id/comments/:id/edit',function(req, res) {
    var isauth = Authenticate(req);
    //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});        
    }
    //regular permission
    else if(isauth=="1"){
       Comment.findById(req.params.id).populate("comments").exec(function(err,comment)
       {
           if(err){console.log(err);}
           else{
               //this user wrote the comment
               if(req.user.username == comment.author){
                   console.log("comment Found!");
                   res.render('comments/edit.ejs',{comment:comment,isLogged:1});
               }
                //this user didnt wrote the comment
               else{
                   res.redirect(`/camp_grounds/${req.params.id}/comments/${comment._id}`);                     
               }
           }
       });
       
    }
});

//PUT route - save edit changes
router.put('/camp_grounds/:id/comments/:id',function(req,res){
    var isauth = Authenticate(req);
    //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});         
    }
    //regular permission
    else if(isauth=="1"){
       Comment.findById(req.params.id,function(err,comment)
       {
           if(err){console.log(err);}
           else{
               //this user wrote the comment
               if(req.user.username == comment.author){
                   var newCom;
                   newCom={
                       text: req.body.text,
                       author: comment.author,
                       id_Camp: comment.id_Camp
                   }
                   Comment.findByIdAndUpdate(req.params.id,newCom,function(err,updatedComment){
                       if(err){console.log("error "+err);}
                       else{
                           res.redirect("/camp_grounds/"+updatedComment.id_Camp);
                       }
                   });
               }
               //this user didnt wrote the comment
               else{
                   res.redirect(`/camp_grounds/${req.params.id}/comments/${comment._id}`);                   
               }
           }
       });
    }
});

//Delete ROUTE
router.delete('/camp_grounds/:id/comments/:id',function(req, res) {
    var isauth = Authenticate(req);
    //no permission
    if(isauth=="0"){
        res.render('logIn.ejs',{eMsg:"Oops! You must be logged in to complete this action"});         
    }
    //regular permission
    else if(isauth=="1"){
       Comment.findById(req.params.id,function(err,comment)
       {
           if(err){console.log(err);}
           else{
               //this user wrote the comment
               if(req.user.username == comment.author){
                   Comment.findByIdAndRemove(req.params.id,function(err,deletedComm){
                       if(err){console.log("error ",err);}
                       else{
                           console.log(deletedComm);
                           res.redirect("/camp_grounds/"+deletedComm.id_Camp);
                       }
                   });                 
               }
               //this user didnt wrote the comment
               else{
                   res.redirect(`/camp_grounds/${req.params.id}/comments/${comment._id}`);
               }
           }
       });
    }
});

function Authenticate(req){
    if (req.isAuthenticated()){
        return "1";
    }
    else{
        return "0";
    }
}

module.exports = router;