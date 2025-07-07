const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a Listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl){
        res.locals.redirecturl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {reviewId, id} = req.params;
    let listing = await Listing.findById(id);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "Not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

/*const validateListings = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body); //schema.js Joi used
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};*/

//error in this part ^ server side validation using JOI
//make this a middleware and then add in respective routes

/* const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body); //schema.js Joi used
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}; */  

//error in this part ^ server side validation using JOI
//same for this too