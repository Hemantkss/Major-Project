const express = require("express");
const router = express.Router({mergeParams: true });
const asyncWrap = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { reviewPostRoute } = require("../controllers/reviews.js");


const reviewController = require("../controllers/reviews.js");



//REVIEW ROUTE
router.post("/", 
isLoggedIn,

// validateReview, 
asyncWrap ( reviewController.createReview ));


//DELETE REVIEW BTN ROUTE
router.delete("/:reviewId", 
isLoggedIn,
isReviewAuthor,
asyncWrap ( reviewController.deleteReview ));



module.exports = router;
