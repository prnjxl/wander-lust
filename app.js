if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const port = 8080;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { throws } = require("assert");

const { listingSchema, reviewSchema } = require("./schema.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const marked = require("marked");
const fs = require("fs");


async function main() {
    await mongoose.connect(dbUrl);
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


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', ejsMate);


const store = MongoStore.create({ //since data base is in mongo and we store session info in it
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRETE
    },
    touchAfter: 24*3600, //in seconds
});

store.on("error", () => {
    console.log("ERROR in Mongo Session Store", err)
});

const sessionOption = {
    store: store,
    secret: process.env.SECRETE,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
}; //no typos here dog


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
})

//Listing
app.use("/listings", listingsRouter);

//Review
app.use("/listings/:id/reviews", reviewsRouter);

//User
app.use("/", userRouter);



//app.all not working it
app.all("/*splat", (req, res, next) => { //it fucking needed a splat wtf is a splat
    next( new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {err});
});