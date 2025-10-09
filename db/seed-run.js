const seed = require("./seed.js");
const db = require("./create-connection");
const formattedPropertyTypesData = require("./data/test/property-types-sort.js");
const formattedUsersData = require("./data/test/users-sort.js");
const formattedPropertiesData = require("./data/test/properties-sort.js");
const formattedReviewsData = require("./data/test/reviews-sort.js");

seed(
  formattedPropertyTypesData,
  formattedUsersData,
  formattedPropertiesData,
  formattedReviewsData
).then(() => {
  db.end();
});

module.exports = seed;
