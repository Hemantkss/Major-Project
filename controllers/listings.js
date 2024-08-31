const { query } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// INDEX ROUTE
module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

//NEW ROUTE
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//SHOW ROUTE
module.exports.showListing = async (req, res) => {
    let { id}  = req.params;
    const listing = await Listing.findById(id)
                  .populate({path: "reviews", populate: {path: "author"}})
                  .populate("owner");
    if (!listing) {
        req.flash("error", "listing Does Not Exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});

};

// CRAETE ROUTE
module.exports.createListing = async (req, res) => {
     let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
   
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let saveListing = await newListing.save();
    console.log(saveListing);
    
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

};

//EDIT ROUTE
module.exports.editListing = async (req, res) => {
    let { id }  = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing Does Not Exist!");
        res.redirect("/listings");
    }
    let OriginalImage = listing.image.url;
    let image = OriginalImage.replace("/upload", "/upload/w_200");
    res.render("listings/edit.ejs", { listing, image });
};

//UPDATE ROUTE
module.exports.updateListing = async (req, res) => {   
    try {
        const { id } = req.params;
        let listing = await Listing.findByIdAndUpdate( id, { ...req.body.listing });
        
        if ( typeof req.file !== "undefined") { 
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
        }

        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating listing.");
    }
};

//DELETE ROUTE
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};