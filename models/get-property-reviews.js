const db = require("../db/create-connection");

exports.fetchPropertyReviews = async (propertyId) => {
  const { rows: reviews } = await db.query(
    `SELECT r.review_id, r.comment, r.rating, r.created_at, u.first_name AS guest
          FROM reviews r
          JOIN users u
          ON r.guest_id = u.user_id
          WHERE r.property_id = $1 
          ORDER BY r.created_at DESC;`,
    [propertyId]
  );

  let average_rating;

  if (reviews.length > 0) {
    let sum = 0;
    for (const review of reviews) {
      sum += review.rating;
    }
    average_rating = sum / reviews.length;
  }

  return { reviews, average_rating };
};
