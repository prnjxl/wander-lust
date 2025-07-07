const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner} = require("../middleware.js");


//Index ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New ROUTE
router.get("/new", isLoggedIn, wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));

//Show ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path : "reviews", 
        populate :{ 
            path: "author",
        },
    }).populate("owner"); //needs revision

    if(!listing){
        req.flash("error", "Listing you requested for is not available!");
        return res.redirect("/listings"); //need 
    }
    res.render("listings/show.ejs",{listing});
}));

//Create ROUTE
router.post("/", isLoggedIn, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing); //needs revision
    newListing.owner = req.user._id;
    await newListing.save();        
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
    })
);

//Edit ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( async (req, res) =>{
    let {id} = req.params;
    const listings = await Listing.findById(id);
    if(!listings){
        req.flash("error", "Listing you requested for is not available!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listings });
})
);

//Update ROUTE
router.put("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); //needs revision
    req.flash("success", "Listing was updated!");
    res.redirect(`/listings/${id}`);
})
);

//Delete ROUTE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing was deleted!");
    res.redirect("/listings");
})
);

module.exports = router;