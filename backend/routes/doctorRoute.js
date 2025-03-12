import express from "express";
import { appointementComplete, cancelAppointement, doctorDashboard, doctorList, doctorProfile, getAllAppointements, loginDoctor, updateDoctorProfile } from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
const doctorRouter = express.Router();
doctorRouter.get("/lists", doctorList);
doctorRouter.post("/login", loginDoctor)
doctorRouter.get("/appointments", authDoctor, getAllAppointements)
doctorRouter.post("/complete-appointment", authDoctor, appointementComplete)
doctorRouter.post("/cancle-appointment", authDoctor, cancelAppointement)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/upadate-profile", authDoctor, updateDoctorProfile)
export default doctorRouter;
