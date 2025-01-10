import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { UserContext } from "./components/UserContext";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Banner from "./components/Banner.jsx";
import Index from "./components/Index.jsx";
import Browse from "./components/Browse.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import EditProfile from "./components/EditProfile.jsx";
import UserPage from "./components/UserPage.jsx";
import CreateCharacter from "./components/CreateCharacter.jsx";
import CharacterPage from "./components/CharacterPage.jsx";
import EditCharacter from "./components/EditCharacter.jsx";
import EditEquipment from "./components/EditEquipment.jsx";

export default function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Navbar />
      <AppContent />
      <Footer />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const { user } = useContext(UserContext);

  return (
    <>
      {/* Conditionally render Banner only on the Index page */}
      {location.pathname === "/" && <Banner />}

      <div className="wrapper">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/register" element={!user ? <Register /> : <Index />} />
          <Route path="/login" element={!user ? <Login /> : <Index />} />
          <Route path="/user/:username" element={<UserPage />} />
          <Route
            path="/edit-profile"
            element={user ? <EditProfile /> : <Login />}
          />
          <Route
            path="/create_character"
            element={user ? <CreateCharacter /> : <Login />}
          />
          <Route path="/character/:id" element={<CharacterPage />} />
          <Route
            path="/edit_character/:id"
            element={user ? <EditCharacter /> : <Login />}
          />
          <Route
            path="/edit_equipment/:id"
            element={user ? <EditEquipment /> : <Login />}
          />
        </Routes>
      </div>
    </>
  );
}
