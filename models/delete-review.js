const db = require("../db/create-connection");

exports.removeReview = async (reviewId) => {
  const { rowCount } = await db.query(
    `DELETE FROM reviews
     WHERE review_id = $1;`,
    [reviewId]
  );

  if (rowCount === 0) {
    return Promise.reject({ status: 404, msg: "Review not found." });
  }

  return rowCount;
};
