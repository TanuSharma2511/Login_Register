require("dotenv").config()

const express=require("express");
const expressLayouts=require("express-ejs-layouts");
const mongoose=require("mongoose");
const flash =require("connect-flash");
const session = require('express-session');
const passport=require("passport");


const app=express();

//Passport Config
require("./config/passport")(passport);

//database connectivity
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true });
const db=mongoose.connection;
db.on("error",(error) => console.error(error));
db.once("open",() => console.log("Connected to Database"));

app.use(express.json());

//EJS
app.use(expressLayouts);
app.set("view engine","ejs");

//Body parser
app.use(express.urlencoded({ extended: false}))

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    
  }))

  //Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());
 
//Connect Flash
app.use(flash()); 

//Global Variables
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
})

//routes
app.use("/",require("./routes/index"));
app.use("/users",require("./routes/users"));


const PORT =process.env.PORT || 4000;

app.listen(PORT, console.log("Server Started"));