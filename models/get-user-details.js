const db = require("../db/create-connection");

exports.fetchUserDetails = async (userId) => {
  const { rows } = await db.query(
    `SELECT user_id, first_name, surname, email, phone_number, created_at
          FROM users 
          WHERE user_id = $1 ;`,
    [userId]
  );

  return rows[0];
};
