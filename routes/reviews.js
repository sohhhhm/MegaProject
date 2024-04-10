const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// REVIEWS (Post Route)
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReviews)
);

// REVEIWS (Delete Route)
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
