const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName && lastName) {
    throw new Error("Please Enter Your First Name & Last Name");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Please Enter An Valid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter A Strong Password");
  }
};

module.exports = { validateSignupData };
