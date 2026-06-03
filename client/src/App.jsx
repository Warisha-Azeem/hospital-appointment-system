import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import Appointment from "./pages/Appointment";
import Confirmation from "./pages/Confirmation";
import Reschedule from "./pages/Reschedule";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import DoctorDashboard from "./pages/DoctorDashboard";
import Analytics from "./pages/Analytics";
import Navbar from "./component/Navbar";
import Appointments from "./pages/Appointments";
import Footer from "./component/Footer";

function App() {

  return (

    <BrowserRouter>
       <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route path="/appointment" element={<Appointment />} />

        <Route path="/confirmation" element={<Confirmation />} />

        <Route path="/reschedule/:appointmentId" element={<Reschedule />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/appointments" element={<Appointments />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

    



      </Routes>
      
      <Footer />

    </BrowserRouter>

  );
}

export default App;