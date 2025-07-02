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

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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


//Listing
app.use("/listings", listings);


//Review
app.use("/listings/:id/reviews", reviews);



//app.all not working it
app.all("/*splat", (req, res, next) => { //it fucking needed a splat wtf is a splat
    next( new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {err});
});
