import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "./UserContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { handleLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("");
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const userData = response.data.user;
        handleLogin(userData); // Kirjaudutaan sisään käyttäjädata
        navigate(`/user/${userData.username}`); // Käytetään userDataa, ei loggedInUseria
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Käyttäjätunnus tai salasana on väärä.");
    }
  };

  return (
    <div className="section center login">
      <h1>Kirjaudu sisään</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Käyttäjätunnus:
          </label>
          <br />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Salasana:
          </label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">
          Kirjaudu sisään
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <p>
        Uusi pelaaja? <Link to="/register">Luo tunnus tästä!</Link>
      </p>
    </div>
  );
}

export default Login;
