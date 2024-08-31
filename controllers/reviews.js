const Listing = require("../models/listing");
const Review = require("../models/review");

// POST REVIEW ROUTE
module.exports.createReview = async ( req, res ) => {
    console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review created!");
  res.redirect(`/listings/${listing._id}`);
};

// DELETE REVIEW ROUTE
module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate( id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};