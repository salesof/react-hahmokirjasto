import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};

    // Tarkista, että kentät eivät ole tyhjiä
    if (!formData.username) {
      formErrors.username = "Täytä tämä kenttä.";
    } else {
      // Tarkista, että käyttäjänimi on kelvollinen (vain kirjaimia, numeroita ja erikoismerkkejä . _ -)
      const usernameRegex = /^[a-zA-Z0-9._-]+$/;
      if (!usernameRegex.test(formData.username)) {
        formErrors.username =
          "Käyttäjätunnus voi sisältää vain kirjaimia, numeroita ja erikoismerkkejä . _ -";
      }
    }

    if (!formData.email) {
      formErrors.email = "Täytä tämä kenttä.";
    } else {
      // Tarkista, että sähköpostiosoite on oikeassa muodossa
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        formErrors.email = "Sähköpostiosoite ei ole oikeassa muodossa.";
      }
    }

    if (!formData.password) {
      formErrors.password = "Täytä tämä kenttä.";
    } else {
      // Tarkista, että salasana on riittävän vahva
      if (formData.password.length < 6) {
        formErrors.password = "Salasanan tulee olla vähintään 6 merkkiä pitkä.";
      }
    }

    if (!formData.password2) {
      formErrors.password2 = "Täytä tämä kenttä.";
    } else if (formData.password !== formData.password2) {
      // Tarkista, että salasanat täsmäävät
      formErrors.password2 = "Salasanat eivät täsmää.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Jos virheitä ei ole, lomake on kelvollinen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Varmista, että lomake on validoitu ennen lähettämistä
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        formData
      );

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="section center">
      <h1>Luo tunnus</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Käyttäjätunnus:</label>
          <br />
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Sähköposti:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Salasana:</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password2">Vahvista salasana:</label>
          <br />
          <input
            type="password"
            id="password2"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            className="form-input"
          />
          {errors.password2 && (
            <p style={{ color: "red" }}>{errors.password2}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Rekisteröidy
        </button>
      </form>
    </div>
  );
}

export default Register;
