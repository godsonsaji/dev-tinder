const validator = require("validator");
const user = require("../models/user");
const bcrypt = require("bcrypt");

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

const validateEditData = (req) => {
  const allowedEdit = [
    "firstName",
    "lastName",
    "age",
    "about",
    "skills",
    "profileImage",
  ];

  const isAllowedEdit = Object.keys(req.body).every((field) =>
    allowedEdit.includes(field)
  );
  return isAllowedEdit;
};

module.exports = { validateSignupData, validateEditData };
