import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctor from "./pages/Doctor";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProfilePage from "./pages/ProfilePage";
import MyAppointments from "./pages/MyAppointments";
import Appointments from "./pages/Appointments";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Sucess from "./pages/Sucess";
import ChatBot from "./pages/chatbot/ChatBot";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import EmergencyContact from "./pages/EmergencyContect";

function App() {
  const { token } = useContext(AppContext);
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<ProfilePage />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointments/:docId" element={<Appointments />} />
        <Route path="/success" element={<Sucess />} />
        <Route path="/emergency-contact" element={<EmergencyContact />} />
      </Routes>
      {token && <ChatBot />}
      <Footer />
    </div>
  );
}

export default App;
