const express=require("express");
const router=express.Router({mergeParams: true});
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userRouters=require("../controllers/users.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(userRouters.signup));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
    savedRedirectUrl,
    passport.authenticate("local",
        { failureRedirect:"/login",
            failureFlash: true,
        }),
        async (req, res)=>{
            req.flash("success","Welcome back..")
            res.redirect(res.locals.redirectUrl);
        }
);

router.get("/logout", (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out..")
            res.redirect("/listings");
    });

});


module.exports=router;