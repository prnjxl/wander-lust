const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");


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

//Create ROUTE
router.post("/", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review); //data stored inside object
    
    listing.reviews.push(newReview._id); //listings review[] -> review data (ratings and comment)
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
router.delete("/:reviewid", wrapAsync( async(req, res) => {
    let {id, reviewid} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review was deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;