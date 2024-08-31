const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../utils/wrapAsyc");
const { route } = require("./listing");
const passport = require("passport");
const { saveRedirectUrl }= require("../middleware.js");

const userController = require("../controllers/users.js");


// GROUP TOGETHER ROUTES (signup form & signup route)
router
 .route("/signup")
 .get( userController.renderSignupForm )
 .post( asyncWrap( userController.signup ));

 
// GROUP TOGETHER ROUTES (login form & login route)
router
 .route("/login")
 .get( userController.renderLoginForm)
 .post( saveRedirectUrl, 
        passport.authenticate("local", 
        { failureRedirect: '/login', failureFlash: true }), 
        userController.login);


// LOGOUT ROUTE            
router.get("/logout", userController.logout);

module.exports = router;