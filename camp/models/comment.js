var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    id_Camp: String
});
 
module.exports = mongoose.model("Comment", commentSchema);