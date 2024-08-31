const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");

// AUTHENTICATION FOR LOOGED IN 
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must logged in to create new listing");
        return res.redirect("/login");
    }

     return next();
};

// AFTER SIGN IN PATH JOINT
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// AUTHORIZATION FOR LISTINGS EDIT
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not owner of this Listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

// VALIDATE LISTING HANDLE
module.exports.validateListing = (req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map( (el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//VALIDATIN FOR REVIEWS
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map( (el) => el.message).join("");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// AUTHORIZATION FOR review delete
module.exports.isReviewAuthor= async (req, res, next) => {
    const { id,  reviewId } = req.params;
    let review = await Review.findById( reviewId );
    if(!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not Author of this Review");
      return res.redirect(`/listings/${id}`);
    }
    next();
};