import express from "express";
import {
  registerUser,
  loginUser,
  updateUserProfile,
  changePassword,
  logoutUser,
} from "../controllers/auth.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/register", singleUpload, registerUser);
router.post("/login", loginUser);
router.put("/profile/update", isAuthenticated, singleUpload, updateUserProfile);
router.put("/change-password", isAuthenticated, changePassword);
router.get("/logout", isAuthenticated, logoutUser);

export default router;
