const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");

const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { throws } = require("assert");

const { listingSchema, reviewSchema } = require("./schema.js");

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=> {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

app.listen(port, (req, res) => {
    console.log(`Server is listening to port ${port}`);
})

app.get("/", (req, res) =>{
    res.send("This is the root path");
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', ejsMate);


/*const validateListings = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body); //schema.js Joi used
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body); //schema.js Joi used
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}; */  

//error in this part ^ server side validation using JOI


//Index ROUTE
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New ROUTE
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));

//Show ROUTE
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//Create ROUTE
app.post("/listings", wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing); //needs revision
    await newListing.save();        
    res.redirect("/listings");
    })
);

//Edit ROUTE
app.get("/listings/:id/edit",wrapAsync( async (req, res) =>{
    let {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/edit.ejs", { listings });
})
);

//Update ROUTE
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); //needs revision
    res.redirect(`/listings/${id}`);
})
);

//Delete ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);

//Review
//Create ROUTE
app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review); //data stored inside object
    
    listing.reviews.push(newReview._id); //listings review[] -> review data (ratings and comment)
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
app.delete("/listings/:id/reviews/:reviewid", wrapAsync( async(req, res) => {
    let {id, reviewid} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}));




//app.all not working it
app.all("/*splat", (req, res, next) => { //it fucking needed a splat wtf is a splat
    next( new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {err});
});
