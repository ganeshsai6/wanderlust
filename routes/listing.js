const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/Expresserror.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listings.js");
const flash=require("connect-flash");
const {isLoggedIn, isOwner}=require("../middleware.js");
const listingroutes=require("../controllers/listing.js");
const multer=require("multer");
const {storage}= require("../cloudConfig.js");
const upload=multer({storage});

const validatelisting=(req,res,next)=>{
    let { error}=listingSchema.validate(req.body);
    if(error){
        let ermsg=error.details.mao((el)=> el.message).join(",");
        throw new ExpressError(400,ermsg);
    }else{
        next();
    };
};

router.get("/",wrapAsync(listingroutes.index));

//create new
router.get("/new",isLoggedIn,wrapAsync((req,res)=>{
    res.render("listings/new.ejs")
}));
//show listing
router.get("/:id",wrapAsync(listingroutes.showListing));
//update
router.post("/",validatelisting,upload.single("listing[image]"), wrapAsync(listingroutes.createNewListing));

router.get("/:id/edit",isLoggedIn,wrapAsync(listingroutes.editListing));

//update

router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validatelisting, wrapAsync(listingroutes.updateListing));

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingroutes.destroyListing));

module.exports=router;
