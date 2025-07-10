const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); //data stored inside object
    newReview.author = req.user._id;

    listing.reviews.push(newReview._id); //listings review[] -> review data (ratings and comment)
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req, res) => {
    let {id, reviewid} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review was deleted!");
    res.redirect(`/listings/${id}`);
};