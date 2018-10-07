const express               = require("express"),
      mongoose              = require("mongoose"),
      passport              = require("passport"),
      body                  = require("body-parser"),
      localStrategy         = require("passport-local").Strategy,
      passportLocalMongoose = require("passport-local-mongoose"),
      expressSession        = require("express-session"),
      bcrypt                = require("bcryptjs"),
      methodOverride        = require('method-override'),
      User                  = require("./models/user"),
      compression           = require('compression');
 
      
//require models
var app      = express(),
    Campsite = require("./models/campground"),
    Comment  = require("./models/comment"),
    seedDB   = require("./seeds");
    
//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
app.use(compression());

// ===================== PASSPORT CONFIGURATION =====================
app.use(expressSession({
    secret: 'eminem', // session secret
    resave: true,
    saveUninitialized: true
}));

app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());

const local = new localStrategy((username, password, done) => {
  User.findOne({ username })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        done(null, false, { message: "Invalid username/password" });
      } else {
        done(null, user);
      }
    })
    .catch(e => done(e));
});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
  User.findById(userId, (err, user) => done(err, user));
});

passport.use("local", local);
//use the body parser to return values from post requests
app.use(body.urlencoded({ extended: true }));
//connect to campDB
//mongoose.connect('mongodb://localhost:27017/camp_sites',{ useNewUrlParser: true });
mongoose.connect('mongodb://matan:matan123@ds123513.mlab.com:23513/camp_sites');//use for the css to use the public folder
app.use(express.static("public"));
//remove all camps&comments and add fill the DB with CAMPS and COMMENTS
seedDB();

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

//all the other routes
app.get('*',function(req, res) {
   res.send("<h1> Error404: Page Do not exsist! </h1>"); 
});

//set server

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server is up and running!"); 
});

