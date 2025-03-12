import express from "express";

import {
  addDoctor,
  adminDashboard,
  adminLogin,
  allDoctors,
  appointmentAdmin,
  appointmentCancle,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import adminAuth from "../middlewares/authAdmin.js";
import { changeAvailablity } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", adminAuth, upload.single("image"), addDoctor);
adminRouter.post("/login", adminLogin);
adminRouter.post("/all-doctors", adminAuth, allDoctors);
adminRouter.post("/change-availability", adminAuth, changeAvailablity)
adminRouter.get("/appointments", adminAuth, appointmentAdmin)
adminRouter.post("/cancle-appointment", adminAuth, appointmentCancle)
adminRouter.get("/dashboard", adminAuth, adminDashboard)

export default adminRouter;
