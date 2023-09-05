const express = require("express");
const {addUser} = require("../controller/authController");

router.route("/users/add").post(addUser);
const router = express.Router();

