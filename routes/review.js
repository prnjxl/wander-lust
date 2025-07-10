const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Create Review ROUTE
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;