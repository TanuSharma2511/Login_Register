const express=require("express");
const router=express.Router();
const bcrypt = require("bcryptjs")
const passport=require("passport");
//user model
const User=require("../models/User");

//Login  page
router.get("/login",(req,res) => res.render("signin"));

//Register Page
router.get("/register",(req,res) => res.render("signup"));

//Register Handle
router.post("/register",(req,res)=>{
    const {name, email, password, password2 } =req.body;
let errors= []

//Check required Fields
if(!name || !email || !password || !password2){
    errors.push({ msg: "Please fill in all fields"});
}

//Check passwords match
if(password !==password2){
    errors.push({ msg:"Passwords do not match"});
}

//Check Password length
if(password.length<6){     
    errors.push({msg: "password atlest should be 6 characters"});
}

if(errors.length >0){
  res.render("signup",{errors,name,email,password,password2});
}else{
    //vaidation passed
    User.findOne({ email:email })
    .then(user =>{
        if(user){
             //User exists
            errors.push({msg : "Email already registered"})
           
            res.render("signup",{errors,name,email,password,password2});
        }
        else{
          const newUser = new User({
              name,
              email,
              password
          });
        //   console.log(newUser)
        //   res.send('hello');

        //Hash Password
        bcrypt.genSalt(10, (err,salt) =>{
          bcrypt.hash(newUser.password , salt ,(err ,hash) =>{
              if(err) throw err;
              //Set password to hashed
              newUser.password = hash;
              //Save User
              newUser.save()
              .then(user =>{
                  req.flash("success_msg","You are now registerd and can login");
                  res.redirect("/users/login");
              })
              .catch(err =>console.log(err));
          })
        })
        }
    });

}

});

//Login Handle
router.post("/login",(req,res,next) =>{
   passport.authenticate("local",{
       successRedirect:"/dashboard",
       failureRedirect:"/users/login",
       failureFlash:true
   })(req,res,next);
})

//Logout Handle
router.get("/logout",(req,res) =>{
    req.logOut();
    req.flash("success_msg","You are successfullt logged Out");
    res.redirect("/users/login");
})

module.exports = router;