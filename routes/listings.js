const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("..//middleware.js");
const multer = require("multer");
const { storage } = require("..//cloudConfig.js"); //cloudinary config
const upload = multer({ storage }); // multer stores file/image in storage of config

const listingController = require("..//controllers/listings.js");

router //Index and Create Route
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"), //multer
    validateListing,
    wrapAsync(listingController.createListing)
  );
 
// New Listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id") // Show Route and Update Route & DELETE ROUTE
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"), //multer will parse the image
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// Search Route
router.get(
  "/:title"
)

module.exports = router;
