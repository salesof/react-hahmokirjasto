import React, { useState, useEffect, useContext } from "react"; // <-- Tässä tulee tuoda useState
import { Link, useNavigate } from "react-router-dom";
import {
  FaRegUserCircle,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaPowerOff,
} from "react-icons/fa";
import logo from "../assets/uploads/tht_logo.png";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 840); // Käyttää useState-hookia
  const [showModal, setShowModal] = useState(false);
  const { user, handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 840);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const navLinksLoggedOut = [
    { title: "Etusivu", url: "/" },
    { title: "Selaa hahmoja", url: "/browse" },
  ];

  const navLinksLoggedIn = [
    { title: "Etusivu", url: "/" },
    { title: "Selaa hahmoja", url: "/browse" },
    { title: "Luo uusi hahmo", url: "/create_character" },
  ];

  const iconListLoggedIn = user
    ? [
        { icon: <FaRegUserCircle />, url: `/user/${user.username}` },
        { icon: <FaPowerOff />, onClick: onLogout },
      ]
    : [];

  const iconListLoggedOut = [{ icon: <FaSignInAlt />, url: "/login" }];

  const navLinks = user ? navLinksLoggedIn : navLinksLoggedOut;
  const iconList = user ? iconListLoggedIn : iconListLoggedOut;

  return (
    <>
      {!isMobile ? (
        <nav className="navbar">
          <div className="navbar-container">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
            <ul className="nav-links">
              {navLinks.map((link, index) => (
                <li key={index} className="nav-link">
                  <Link to={link.url}>{link.title}</Link>
                </li>
              ))}
            </ul>
            <ul className="icon-list">
              {iconList.map((item, index) =>
                item.onClick ? (
                  <div key={index} className="icon" onClick={item.onClick}>
                    {item.icon}
                  </div>
                ) : (
                  <Link key={index} to={item.url} className="icon">
                    {item.icon}
                  </Link>
                )
              )}
            </ul>
          </div>
        </nav>
      ) : (
        <nav className="navbar">
          <div className="navbar-container">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
            <div className="icon-list-mobile">
              {iconList.map((item, index) =>
                item.onClick ? (
                  <div key={index} className="icon" onClick={item.onClick}>
                    {item.icon}
                  </div>
                ) : (
                  <Link key={index} to={item.url} className="icon">
                    {item.icon}
                  </Link>
                )
              )}
              <FaBars onClick={toggleModal} className="menu-icon" />
            </div>
          </div>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <FaTimes className="close-icon" onClick={toggleModal} />
                <div className="modal-content">
                  {navLinks.map((link, index) => (
                    <span key={index} className="modal-link">
                      <Link to={link.url}>{link.title}</Link>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;
