const express = require("express");
const db = require("./db/create-connection");
const { getProperties } = require("./controllers/get-properties");
const { getPropertyReviews } = require("./controllers/get-property-reviews");
const { newReview } = require("./controllers/post-review");
const { deleteReview } = require("./controllers/delete-review");
const { getUserDetails } = require("./controllers/get-user-details");

const app = express();
app.use(express.json());

app.get("/api/properties", getProperties);

app.get("/api/properties/:id/reviews", getPropertyReviews);

app.get("/api/users/:id", getUserDetails);

app.post("/api/properties/:id/reviews", newReview);

app.delete("/api/reviews/:id", deleteReview);

app.use((err, req, res, next) => {
  const codes = ["25302", "22P02"];

  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request." });
  } else {
    next(err);
  }
});

app.all("/*path", (req, res, next) => {
  res.status(404).send({ msg: "Path not found." });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server Error." });
});

module.exports = app;
