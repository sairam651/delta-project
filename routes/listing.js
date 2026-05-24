const express=require("express")
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn ,isOwner , validateListing}=require("../middleware.js")
 
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})  //takes files  from form data and saves this files in uploads folder

//for index &create route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);

router
.route("/search")
.get(listingController.search);

//New route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//for show,update and delete route
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),  //take 1 file from this input field and put it in req.file
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn, 
    isOwner,
    wrapAsync(listingController.destroyListing))


//Edit route
router.get("/:id/edit",
    isLoggedIn, 
    isOwner,
     wrapAsync(listingController.renderEditForm));




module.exports=router;