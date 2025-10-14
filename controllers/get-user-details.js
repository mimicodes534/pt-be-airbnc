const { fetchUserDetails } = require("../models/get-user-details");

exports.getUserDetails = async (req, res, next) => {
  const userId = req.params.id;
  const user = await fetchUserDetails(userId);
  res.status(200).send({ user });
};
