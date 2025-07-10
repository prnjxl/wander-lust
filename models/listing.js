const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        filename : String,
        url : {
            type : String,
            default : "https://landlopers.com/wp-content/uploads/2012/07/rsz_img_2827.jpg",
            set : (v) => v === "" ? "https://landlopers.com/wp-content/uploads/2012/07/rsz_img_2827.jpg" : v, //need to go through
        }
    },
    price : Number,
    location : String,
    country : String,
    reviews : [{     //fucking multiple review so use -> array
        type: Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
            coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;