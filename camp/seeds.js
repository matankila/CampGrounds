var     mongoose = require("mongoose"),
        Campsite = require("./models/campground"),
        Comment = require("./models/comment"),
        //custom array to init the camps
        data     = [
            {
                name:"Camp Park",
                 img:"https://i.imgur.com/jHFYddi.jpg",
                 des:"Outside of central park between 2 jungels the camp resides"
                
            },
            {
                name:"Black Creeck",
                 img:"https://i.imgur.com/RMqGLb4.jpg",
                 des:"camp outside of texsas"
                
            },
            {
                name:"Mountain Range Of The Edge",
                 img:"https://i.imgur.com/bKHz7u9.jpg",
                 des:"At the Edge of Alaska Youll Find This Camp Site!!!!"
                
            }
            ];

function seedDB(){
    //delete all comments
    Comment.remove({},function(err, comment) {
       if(err){console.log(err);}
       else{
           console.log("all caomments delted");
           //delete all camp sites
           Campsite.remove({},function(err,camp){
              if(err){console.log(err);}
              else{
                   console.log("all camps deleted");
                   data.forEach(function(camp){
                    //create camp sites from the static array data
                    Campsite.create(camp,function(err,campground){
                      if(err){console.log(err);}
                      else{
                           console.log("Camp Created");
                           //create comments
                           Comment.create({
                                text   : "the best place to camp on earth",
                                author : "matan killa",
                                id_Camp: campground._id
                           },function(err,comment){
                              if(err){console.log(err);}
                              else{
                                 //add coment to camp site
                                 campground.comments.push(comment);
                                 //save changes
                                 campground.save();
                                 console.log("comment added");
                              }
                           });
                      }
                    });  
                   });
              } 
           }); 
       }
    });
}        

module.exports = seedDB;