import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRoutes.js";
import { loginUser } from "./controllers/userController.js";
import doctorRouter from "./routes/doctorRoute.js";
import smsRouter from './routes/sms.js'
//app config
const app = express();
const port = process.env.PORT || 4000;
connectDb();
connectCloudinary();

//middlewire
app.use(express.json());
app.use(cors());

//api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/sms", smsRouter)
app.use("/api/doctor", doctorRouter);
app.get("/", (req, res) => res.status(200).send("Hello World"));
app.listen(port, () => {
  console.log(`server listing port:${port}`);
});
