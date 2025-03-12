import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancleAppointment,
  paymentRazorpay,
  verifyRazorpay
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/list-appointment", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancleAppointment)
userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)
export default userRouter;
