const db = require("../db/create-connection");

exports.removeReview = async (reviewId) => {
  await db.query(
    `DELETE FROM reviews
     WHERE review_id = $1;`,
    [reviewId]
  );
};
