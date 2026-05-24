const express=require("express")
const router=express.Router();  //👉 This creates a router object.
//Think of it like a mini app inside your appYou use it to define routes like
//router.get("/login", ...) router.post("/signup", ...)
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync")
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/users.js")

//signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//login
router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", 
    {failureRedirect:"/login",
     failureFlash:true}),
     userController.login
     )

//logout
router.get("/logout",userController.logout)

module.exports=router;