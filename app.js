if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require(".//utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo"); //For connect Mongo
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/users.js");

//Database Connection Code
const dbUrl = process.env.ATLASDB_URL;

// const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";
main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  //store stores data in Atlas DB
  mongoUrl: dbUrl,
  crypto: {
    //for encryption
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // to update the session after 12/24 hrs
});

store.on("error", () => {
  console.log("ERROR_IN_MONGO_SESSION STORE", err);
});

// Session handling
const sessionOpt = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //security purpose(Cross scripting attacks)
  },
};

// // Initial Route
// app.get("/", (req, res) => {
//   res.render("listings/home.ejs");
// });

app.use(session(sessionOpt));
app.use(flash()); //Always use before routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

// Error handling Middleware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("./listings/error.ejs", { err });
  //   res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});