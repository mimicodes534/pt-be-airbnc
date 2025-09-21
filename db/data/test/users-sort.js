const { usersData } = require("./index");

const formattedUsersData = usersData.map((type) => {
  return [
    type.first_name,
    type.surname,
    type.email,
    type.phone_number,
    type.is_host,
    type.avatar,
  ];
});

module.exports = formattedUsersData;
