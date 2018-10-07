//require mongoose
var mongoose = require("mongoose");
//create schema
var campSchema = new mongoose.Schema({
   name: String,
   img: String,
   des: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
//create a model we can work on
var Campsite = mongoose.model("Campsite",campSchema);
//return the model
module.exports = Campsite;