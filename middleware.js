const { model } = require("mongoose");
const Listing = require("./models/listings");
const Review = require("./models/review");

module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
            req.session.redirectUrl=req.originalUrl;
            req.flash("error","You must be logged in to create listing");
            return res.redirect("/login")
        };
        next();
};

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curUsr._id)){
        req.flash("error","You dont have access to do this..");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curUsr._id)){
        req.flash("error","You dont have access to do this..");
        return res.redirect(`/listings/${id}`);
    }
    next();
}