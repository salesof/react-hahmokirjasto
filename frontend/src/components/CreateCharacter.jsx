import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const CreateCharacter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError, // Use the setError function from react-hook-form to manually set errors
  } = useForm();
  const { user: loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ image: null }); // Initialize formData state

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Päivitä kuva myös React Hook Formin sisällä
    setFormData((prevData) => ({
      ...prevData,
      image: file, // Päivitetään tilassa oleva kuva
    }));
  };

  const handleSubmitForm = async (data) => {
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      for (let field in errors) {
        setError(field, { type: "manual", message: errors[field] });
      }
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Lisää kaikki kentät FormDataan
      for (const key in data) {
        if (data[key] && data[key] !== "") {
          formDataToSend.append(key, data[key]);
        }
      }

      // Lisää kuva FormDataan, jos se on valittu
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (loggedInUser && loggedInUser.id) {
        formDataToSend.append("user_id", loggedInUser.id);
      } else {
        alert("Virhe: Käyttäjän ID puuttuu.");
        return;
      }

      const response = await fetch("http://localhost:3000/create_character", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        navigate(`/user/${loggedInUser.username}`);
      } else {
        alert("Hahmon luominen epäonnistui.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Virhe lähetyksessä!");
    }
  };

  const validateForm = (data) => {
    const errors = {};

    // Name field: only letters
    if (!data.name || !/^[a-zA-ZåäöÅÄÖ' .-]+$/.test(data.name)) {
      errors.name =
        "Nimi on pakollinen ja voi sisältää vain kirjaimia, välilyöntejä, ' . ja -";
    }

    // Class field
    if (!data.character_class) errors.character_class = "Valitse hahmoluokka.";

    // Level field: positive integer
    if (
      !data.level ||
      isNaN(data.level) ||
      data.level <= 0 ||
      !Number.isInteger(Number(data.level))
    )
      errors.level =
        "Taso on pakollinen ja sen tulee olla positiivinen kokonaisluku.";

    // Experience stars field: positive integer
    if (
      data.experience_stars &&
      (isNaN(data.experience_stars) ||
        data.experience_stars < 0 ||
        !Number.isInteger(Number(data.experience_stars)))
    )
      errors.experience_stars =
        "Kokemustähtien tulee olla positiivinen kokonaisluku.";

    if (
      data.max_experience_stars &&
      (isNaN(data.max_experience_stars) ||
        data.max_experience_stars < 0 ||
        !Number.isInteger(Number(data.max_experience_stars)))
    )
      errors.max_experience_stars =
        "Maksimi kokemustähtien tulee olla positiivinen kokonaisluku.";

    // Base Speed and Base Accuracy fields: only numbers, "n" and "+"
    const baseSpeedPattern = /^[0-9n+]+$/;
    if (data.base_speed && !baseSpeedPattern.test(data.base_speed))
      errors.base_speed =
        "Nopeusheitossa voi olla vain numeroita, 'n' ja '+' merkkejä.";

    const baseAccuracyPattern = /^[0-9n+]+$/;
    if (data.base_accuracy && !baseAccuracyPattern.test(data.base_accuracy))
      errors.base_accuracy =
        "Osumaheitossa voi olla vain numeroita, 'n' ja '+' merkkejä.";

    // Other field validation (numbers for specified fields)
    const fieldNames = {
      hit_points: "Kestopisteiden",
      current_hit_points: "Tämänhetkisten kestopisteiden",
      armor_class: "Suojaluokan",
      armor_bonus: "Suojaluokan bonuksen",
      balance_points: "Tasapainopisteiden",
      current_balance_points: "Tämänhetkiset tasapainopisteiden",
      magic_points: "Magiapisteiden",
      current_magic_points: "Tämänhetkiset magiapisteiden",
      magic_bonus: "Magiabonusten",
      strength: "Voiman",
      strength_bonus: "Voimabonuksen",
      dexterity: "Ketteryyden",
      dexterity_bonus: "Ketteryysbonuksen",
      constitution: "Kunnon",
      constitution_bonus: "Kuntobonuksen",
      charisma: "Väen",
      charisma_bonus: "Väkibonuksen",
      wisdom: "Älyn",
      wisdom_bonus: "Älybonuksen",
      intelligence: "Vaiston",
      intelligence_bonus: "Vaistobonuksen",
      food: "Ruoka-annosten",
      copper: "Kuparimarkkojen",
      silver: "Hopeataalereiden",
      gold: "Kultakruunujen",
    };

    const numericFields = [
      "hit_points",
      "current_hit_points",
      "armor_class",
      "armor_bonus",
      "balance_points",
      "current_balance_points",
      "magic_points",
      "current_magic_points",
      "magic_bonus",
      "strength",
      "strength_bonus",
      "dexterity",
      "dexterity_bonus",
      "constitution",
      "constitution_bonus",
      "charisma",
      "charisma_bonus",
      "wisdom",
      "wisdom_bonus",
      "intelligence",
      "intelligence_bonus",
      "food",
      "copper",
      "silver",
      "gold",
    ];

    numericFields.forEach((field) => {
      if (
        data[field] &&
        (isNaN(data[field]) ||
          data[field] < 0 ||
          !Number.isInteger(Number(data[field])))
      ) {
        errors[
          field
        ] = `${fieldNames[field]} täytyy olla positiivinen kokonaisluku.`;
      }
    });

    return errors;
  };

  return (
    <div className="section">
      <h1>Luo hahmo</h1>
      <p>Pakolliset tiedot on merkitty tähdellä (*)</p>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <fieldset>
          <legend>Yleistiedot:</legend>
          <p>
            <label>Nimi *</label>
            <br />
            <input type="text" name="name" size="64" {...register("name")} />
            {errors.name && (
              <span style={{ color: "red" }}>[{errors.name.message}]</span>
            )}
          </p>
          <p>
            <label>Luokka *</label>
            <br />
            <select
              name="character_class"
              defaultValue=""
              {...register("character_class")}
            >
              <option value="" disabled>
                Valitse...
              </option>
              <option value="Ritari">Ritari</option>
              <option value="Eränkävijä">Eränkävijä</option>
              <option value="Sikopaimen">Sikopaimen</option>
              <option value="Velho">Velho</option>
              <option value="Aarni">Aarni</option>
              <option value="Niekka">Niekka</option>
              <option value="Staalo">Staalo</option>
              <option value="Prinsessa/Prinssi">Prinsessa/Prinssi</option>
              <option value="Pelimanni">Pelimanni</option>
            </select>
            {errors.character_class && (
              <span style={{ color: "red" }}>
                [{errors.character_class.message}]
              </span>
            )}
          </p>
          <p>
            <label>Taso *</label>
            <br />
            <input type="number" name="level" {...register("level")} />
            {errors.level && (
              <span style={{ color: "red" }}>[{errors.level.message}]</span>
            )}
          </p>
          <p>
            <label>Kokemustähdet</label>
            <br />
            <input
              type="number"
              name="experience_stars"
              {...register("experience_stars")}
            />
            {errors.experience_stars && (
              <span style={{ color: "red" }}>
                [{errors.experience_stars.message}]
              </span>
            )}
          </p>
          <p>
            <label>Maksimi kokemustähdet</label>
            <br />
            <input
              type="number"
              name="max_experience_stars"
              {...register("max_experience_stars")}
            />
            {errors.max_experience_stars && (
              <span style={{ color: "red" }}>
                [{errors.max_experience_stars.message}]
              </span>
            )}
          </p>
          <p>
            <label>Lataa hahmon kuva</label>
            <br />
            <input
              id="image"
              type="file"
              {...register("image")}
              onChange={handleFileChange} // Lisää tämä rivi
            />
            <br />
            {errors.image && (
              <span style={{ color: "red" }}>[{errors.image.message}]</span>
            )}
          </p>
        </fieldset>

        <br />

        <fieldset>
          <legend>Muuttuvat arvot:</legend>
          <p>
            <label>Kestopisteet</label>
            <br />
            <input
              type="number"
              name="hit_points"
              {...register("hit_points")}
            />
            {errors.hit_points && (
              <span style={{ color: "red" }}>
                [{errors.hit_points.message}]
              </span>
            )}
          </p>
          <p>
            <label>Tämänhetkiset kestopisteet</label>
            <br />
            <input
              type="number"
              name="current_hit_points"
              {...register("current_hit_points")}
            />
            {errors.current_hit_points && (
              <span style={{ color: "red" }}>
                [{errors.current_hit_points.message}]
              </span>
            )}
          </p>
          <p>
            <label>Suojaluokka</label>
            <br />
            <input
              type="number"
              name="armor_class"
              {...register("armor_class")}
            />
            {errors.armor_class && (
              <span style={{ color: "red" }}>
                [{errors.armor_class.message}]
              </span>
            )}
          </p>
          <p>
            <label>Suojaluokan bonus</label>
            <br />
            <input
              type="number"
              name="armor_bonus"
              {...register("armor_bonus")}
            />
            {errors.armor_bonus && (
              <span style={{ color: "red" }}>
                [{errors.armor_bonus.message}]
              </span>
            )}
          </p>
          <p>
            <label>Tasapainopisteet</label>
            <br />
            <input
              type="number"
              name="balance_points"
              {...register("balance_points")}
            />
            {errors.balance_points && (
              <span style={{ color: "red" }}>
                [{errors.balance_points.message}]
              </span>
            )}
          </p>
          <p>
            <label>Tämänhetkiset tasapainopisteet</label>
            <br />
            <input
              type="number"
              name="current_balance_points"
              {...register("current_balance_points")}
            />
            {errors.current_balance_points && (
              <span style={{ color: "red" }}>
                [{errors.current_balance_points.message}]
              </span>
            )}
          </p>
          <p>
            <label>Magiapisteet</label>
            <br />
            <input
              type="number"
              name="magic_points"
              {...register("magic_points")}
            />
            {errors.magic_points && (
              <span style={{ color: "red" }}>
                [{errors.magic_points.message}]
              </span>
            )}
          </p>
          <p>
            <label>Magiabonukset</label>
            <br />
            <input
              type="number"
              name="magic_bonus"
              {...register("magic_bonus")}
            />
            {errors.magic_bonus && (
              <span style={{ color: "red" }}>
                [{errors.magic_bonus.message}]
              </span>
            )}
          </p>
          <p>
            <label>Tämänhetkiset magiapisteet</label>
            <br />
            <input
              type="number"
              name="current_magic_points"
              {...register("current_magic_points")}
            />
            {errors.current_magic_points && (
              <span style={{ color: "red" }}>
                [{errors.current_magic_points.message}]
              </span>
            )}
          </p>
        </fieldset>

        <br />

        <fieldset>
          <legend>Heitot:</legend>
          <p>
            <label>Nopeusheitto</label>
            <br />
            <input type="text" name="base_speed" {...register("base_speed")} />
            {errors.base_speed && (
              <span style={{ color: "red" }}>
                [{errors.base_speed.message}]
              </span>
            )}
          </p>
          <p>
            <label>Osumaheitto</label>
            <br />
            <input
              type="text"
              name="base_accuracy"
              {...register("base_accuracy")}
            />
            {errors.base_accuracy && (
              <span style={{ color: "red" }}>
                [{errors.base_accuracy.message}]
              </span>
            )}
          </p>
        </fieldset>

        <br />

        <fieldset>
          <legend>Arvot:</legend>
          <p>
            <label>Voima</label>
            <br />
            <input type="number" name="strength" {...register("strength")} />
            {errors.strength && (
              <span style={{ color: "red" }}>[{errors.strength.message}]</span>
            )}
          </p>
          <p>
            <label>Voimabonus</label>
            <br />
            <input
              type="number"
              name="strength_bonus"
              {...register("strength_bonus")}
            />
            {errors.strength_bonus && (
              <span style={{ color: "red" }}>
                [{errors.strength_bonus.message}]
              </span>
            )}
          </p>
          <p>
            <label>Ketteryys</label>
            <br />
            <input type="number" name="dexterity" {...register("dexterity")} />
            {errors.dexterity && (
              <span style={{ color: "red" }}>[{errors.dexterity.message}]</span>
            )}
          </p>
          <p>
            <label>Ketteryysbonus</label>
            <br />
            <input
              type="number"
              name="dexterity_bonus"
              {...register("dexterity_bonus")}
            />
            {errors.dexterity_bonus && (
              <span style={{ color: "red" }}>
                [{errors.dexterity_bonus.message}]
              </span>
            )}
          </p>
          <p>
            <label>Kunto</label>
            <br />
            <input
              type="number"
              name="constitution"
              {...register("constitution")}
            />
            {errors.constitution && (
              <span style={{ color: "red" }}>
                [{errors.constitution.message}]
              </span>
            )}
          </p>
          <p>
            <label>Kuntobonus</label>
            <br />
            <input
              type="number"
              name="constitution_bonus"
              {...register("constitution_bonus")}
            />
            {errors.constitution_bonus && (
              <span style={{ color: "red" }}>
                [{errors.constitution_bonus.message}]
              </span>
            )}
          </p>
          <p>
            <label>Väki</label>
            <br />
            <input type="number" name="charisma" {...register("charisma")} />
            {errors.charisma && (
              <span style={{ color: "red" }}>[{errors.charisma.message}]</span>
            )}
          </p>
          <p>
            <label>Väkibonus</label>
            <br />
            <input
              type="number"
              name="charisma_bonus"
              {...register("charisma_bonus")}
            />
            {errors.charisma_bonus && (
              <span style={{ color: "red" }}>
                [{errors.charisma_bonus.message}]
              </span>
            )}
          </p>
          <p>
            <label>Äly</label>
            <br />
            <input type="number" name="wisdom" {...register("wisdom")} />
            {errors.wisdom && (
              <span style={{ color: "red" }}>[{errors.wisdom.message}]</span>
            )}
          </p>
          <p>
            <label>Älybonus</label>
            <br />
            <input
              type="number"
              name="wisdom_bonus"
              {...register("wisdom_bonus")}
            />
            {errors.wisdom_bonus && (
              <span style={{ color: "red" }}>
                [{errors.wisdom_bonus.message}]
              </span>
            )}
          </p>
          <p>
            <label>Vaisto</label>
            <br />
            <input
              type="number"
              name="intelligence"
              {...register("intelligence")}
            />
            {errors.intelligence && (
              <span style={{ color: "red" }}>
                [{errors.intelligence.message}]
              </span>
            )}
          </p>
          <p>
            <label>Vaistobonus</label>
            <br />
            <input
              type="number"
              name="intelligence_bonus"
              {...register("intelligence_bonus")}
            />
            {errors.intelligence_bonus && (
              <span style={{ color: "red" }}>
                [{errors.intelligence_bonus.message}]
              </span>
            )}
          </p>
        </fieldset>

        <br />

        <fieldset>
          <legend>Muut:</legend>
          <p>
            <label>Heikkous</label>
            <br />
            <input type="text" name="weakness" {...register("weakness")} />
            {errors.weakness && (
              <span style={{ color: "red" }}>[{errors.weakness.message}]</span>
            )}
          </p>
          <p>
            <label>Ruoka-annoksia</label>
            <br />
            <input type="number" name="food" {...register("food")} />
            {errors.food && (
              <span style={{ color: "red" }}>[{errors.food.message}]</span>
            )}
          </p>
          <p>
            <label>Kuparimarkkoja</label>
            <br />
            <input type="number" name="copper" {...register("copper")} />
            {errors.copper && (
              <span style={{ color: "red" }}>[{errors.copper.message}]</span>
            )}
          </p>
          <p>
            <label>Hopeataalereita</label>
            <br />
            <input type="number" name="silver" {...register("silver")} />
            {errors.silver && (
              <span style={{ color: "red" }}>[{errors.silver.message}]</span>
            )}
          </p>
          <p>
            <label>Kultakruunuja</label>
            <br />
            <input type="number" name="gold" {...register("gold")} />
            {errors.gold && (
              <span style={{ color: "red" }}>[{errors.gold.message}]</span>
            )}
          </p>
        </fieldset>

        <br />
        <button type="submit">Luo hahmo</button>
      </form>
    </div>
  );
};

export default CreateCharacter;
