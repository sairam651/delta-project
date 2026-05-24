const Listing=require("../models/listing");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//for index route
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("index.ejs",{allListings});
};
//for search
module.exports.search=async(req,res)=>{
    console.log(req.query); 
    const location =req.query.location; // Gets value from URL.:/listings/search?location=Delhi
    const listings=await Listing.find({
        location:{
            $regex:location,  //Used for text matching.
            $options:"i"}     //Means case-insensitive. All work:  delhi,DELHI,Delhi
    });
     res.render("listings/search.ejs",{listings})
}
//for new route
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
};
//for show route
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner");
    if(!listing){
         req.flash("error","Listing you requested for does not exist")
         res.redirect("/listings")
      }
    console.log(listing)
    res.render("listings/show.ejs",{listing})
};
//for creatje route
module.exports.createListing=async(req,res,next)=>{
       let response=await geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        })
        .send();
     
    
        let url=req.file.path;    //as we require path of file
        let filename=req.file.filename; //as we require name of file

        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url,filename}
        newListing.geometry= response.body.features[0].geometry

        let savedListing=await newListing.save();
        console.log(savedListing)
        req.flash("success","New Listing Created")
        res.redirect("/listings");
};
 //for edit route
module.exports.renderEditForm=async(req,res)=>{
     let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
         req.flash("error","Listing you requested for does not exist")
         res.redirect("/listings")
    }

    let orignalImageUrl=listing.image.url;
    orignalImageUrl=orignalImageUrl.replace("/upload","/upload/nodemon appw_250")
    res.render("listings/edit.ejs",{listing, orignalImageUrl})
};
//for update route
module.exports.updateListing=async(req,res,next)=>{
      let {id}=req.params;
      let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing}); //finding the listing and updtaing it
      //When editing a listing:
// User uploads new image → update it ✅
// User does NOT upload image → keep old image ✅
// Without this if:
// ❌ Old image would be overwritten with undefined
      if(typeof req.file !=="undefined"){   //this if is used beacuse when we dont update the image then our url and filename will be empty so req.file may be undefined
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};  //replacing old image with new one
      await listing.save();
      }
      req.flash("success","Listing Updated")
      res.redirect(`/listings/${id}`);
     
};
//for delete route
module.exports.destroyListing=async(req,res)=>{
     let {id}=req.params;
     let deletedListing= await Listing.findByIdAndDelete(id);
     console.log( deletedListing);
     req.flash("success","Listing deleted")
     res.redirect("/listings")
};