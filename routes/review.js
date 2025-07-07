const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js")
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/Expresserror.js");
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");
const reviewsRouter=require("../controllers/reviews.js")

const validateReview=(req,res,next)=>{
    let { error}=reviewSchema.validate(req.body);
    if(error){
        let ermsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,ermsg);
    }else{
        next();
    };
}

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewsRouter.createReview));
//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewsRouter.deleteReview));

module.exports=router;