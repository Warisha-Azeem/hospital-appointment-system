import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import Appointment from "./pages/Appointment";
import AdminDashboard from "./pages/AdminDashboard";
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

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/appointments"element={<Appointments />}/>

    



      </Routes>
      
      <Footer />

    </BrowserRouter>

  );
}

export default App;