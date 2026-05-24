const Listing=require("../models/listing")
const Review=require("../models/review")

module.exports.createReview=async(req,res)=>{    //validateReview is used as an middleware from validation for review
   console.log(req.params.id)
   let listing=await Listing.findById(req.params.id);  //req.params.id → Gets the id from the URL.
   let newReview=new Review(req.body.review);  //req.body.review contains the review data.
   newReview.author=req.user._id;
   console.log(newReview)
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   req.flash("success","New review created")

  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted")
    res.redirect(`/listings/${id}`)
};