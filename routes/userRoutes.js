const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  updateProfile,
  updatePassword,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser).post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router
  .patch("/profileUpdate", validateToken, updateProfile)
  .patch("/passwordUpdate", validateToken, updatePassword);

module.exports = router;
