const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");

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

//Index ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New ROUTE
router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));

//Show ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//Create ROUTE
router.post("/", wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing); //needs revision
    await newListing.save();        
    res.redirect("/listings");
    })
);

//Edit ROUTE
router.get("/:id/edit",wrapAsync( async (req, res) =>{
    let {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/edit.ejs", { listings });
})
);

//Update ROUTE
router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); //needs revision
    res.redirect(`/listings/${id}`);
})
);

//Delete ROUTE
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);

module.exports = router;