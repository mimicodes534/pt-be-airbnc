const { reviewsData } = require("./index");
const formattedPropertiesData = require("./properties-sort");

const formattedReviewsData = reviewsData.map((review) => {
  return {
    property_id: undefined,
    guest_id: undefined,
    rating: review.rating,
    comment: review.comment,
    property_name: review.property_name,
    guest_name: review.guest_name,
  };
});

module.exports = formattedReviewsData;
