import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom"; // Tuodaan useNavigate

const EditProfile = () => {
  // Käyttäjätiedot, jotka tulevat UserContextista
  const { user: loggedInUser } = useContext(UserContext);

  // Navigointi
  const navigate = useNavigate(); // Luodaan navigointifunktio

  // Tiedot, joita käytetään lomakkeen esitäyttöön
  const [userData, setUserData] = useState({
    username: "",
    aboutMe: "",
    avatar: "",
  });

  const {
    register,
    handleSubmit,
    setValue, // Tätä käytetään lomakkeen kenttien asettamiseen
    formState: { errors },
    watch, // Added watch here to track field values
  } = useForm();

  // Hae käyttäjätiedot
  useEffect(() => {
    if (!loggedInUser?.username) {
      return; // Jos käyttäjätietoja ei ole, ei tehdä mitään
    }

    // Oletetaan, että käyttäjätiedot haetaan backendistä
    fetch(`http://localhost:3000/user/${loggedInUser.username}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setUserData(data); // Tallennetaan tiedot tilaan
          // Täytetään lomakkeen kentät, mutta ei käyttäjänimeä
          setValue("aboutMe", data.about_me);
          setValue("avatar", data.avatar); // Asetetaan avatar kenttä oletusarvoksi
        }
      })
      .catch((error) =>
        console.error("Virhe käyttäjätietojen hakemisessa:", error)
      );
  }, [loggedInUser?.username, setValue]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("userId", loggedInUser.id);
    formData.append("username", loggedInUser.username);
    formData.append("aboutMe", data.aboutMe);

    // Jos avatar on valittu, lisätään se FormDataan
    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    // Lisää salasana, jos se on määritetty
    if (data.newPassword) {
      formData.append("newPassword", data.newPassword);
    }

    // Lähetä data palvelimelle (muista päivittää URL ja metodi backendissä)
    fetch("http://localhost:3000/edit-profile", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const avatarUrl = `http://localhost:3000/frontend/public/assets/avatars/${data.avatar}`;
        navigate(`/user/${loggedInUser.username}`);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="section">
      <h1>Muokkaa profiiliani</h1>
      <br />
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div>
          <label htmlFor="aboutMe">Tietoja minusta</label>
          <br />
          <textarea
            id="aboutMe"
            rows="4"
            cols="50"
            {...register("aboutMe", {
              maxLength: {
                value: 200,
                message: "Enimmäispituus on 200 merkkiä",
              },
            })}
          ></textarea>
          <br />
          {errors.aboutMe && (
            <span style={{ color: "red" }}>[{errors.aboutMe.message}]</span>
          )}
        </div>
        <br />
        <div>
          <label htmlFor="avatar">Lataa profiilikuva</label>
          <br />
          <input id="avatar" type="file" {...register("avatar")} />
          <br />
          {errors.avatar && (
            <span style={{ color: "red" }}>[{errors.avatar.message}]</span>
          )}
        </div>
        <br />
        <div>
          <label htmlFor="newPassword">Uusi salasana</label>
          <br />
          <input
            id="newPassword"
            type="password"
            {...register("newPassword", {
              minLength: {
                value: 6,
                message: "Salasanan on oltava vähintään 6 merkkiä pitkä",
              },
            })}
          />
          <br />
          {errors.newPassword && (
            <span style={{ color: "red" }}>[{errors.newPassword.message}]</span>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword">Vahvista uusi salasana</label>
          <br />
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              validate: (value) =>
                value === watch("newPassword") || "Salasanat eivät täsmää", // Watch for newPassword value
            })}
          />
          <br />
          {errors.confirmPassword && (
            <span style={{ color: "red" }}>
              [{errors.confirmPassword.message}]
            </span>
          )}
        </div>

        <div>
          <button type="submit">Tallenna</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
