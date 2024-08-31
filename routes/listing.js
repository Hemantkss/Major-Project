const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing  } = require("../middleware.js");
const multer  = require('multer')

const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


const listingController = require("../controllers/listings.js");


// GROUP TOGETHER ROUTES (index & create route)
router
 .route("/")
 .get(
    asyncWrap(listingController.index))
 .post( 
    isLoggedIn,
    upload.single('listing[image]'),
    asyncWrap( listingController.createListing )
);


//NEW ROUTE
router.get("/new", 
    isLoggedIn, 
    listingController.renderNewForm);
    
// GROUP TOGETHER ROUTES (show, update & delete route)
router
 .route("/:id")
 .get( 
    asyncWrap( listingController.showListing ))
 .put(
    isLoggedIn,
    isOwner, 
    upload.single('listing[image]'), 
     asyncWrap( listingController.updateListing ))
 .delete( 
    isLoggedIn, 
    isOwner, 
    asyncWrap( listingController.deleteListing )
 );

//EDIT ROUTE
router.get("/:id/edit", 
isLoggedIn,
isOwner, 
asyncWrap (listingController.editListing ));


module.exports = router;