const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");

//Create Review ROUTE
router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); //data stored inside object
    newReview.author = req.user._id;

    listing.reviews.push(newReview._id); //listings review[] -> review data (ratings and comment)
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync( async(req, res) => {
    let {id, reviewid} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review was deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;