const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema =new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        // required:true,
    },
    image:{
        url:String, 
        filename:String,
        
    },  
    price: {
        type:Number, 
        required:true 
    },
    location:String,
    country:String,
    //making an array to store object id of review
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",  //using review model as reference from reveiw.js
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",  //as owner refers to user
    },
    geometry:{
        type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category:{
    type:String,
    enum:["mountains","arctic","farms","rooms","campaigns","trending","iconic cities","castles","pools","beach"],
  }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;