import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const EditCharacter = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [character, setCharacter] = useState({
    name: "",
    character_class: "",
    level: "",
    experience_stars: "",
    max_experience_stars: "",
    hit_points: "",
    current_hit_points: "",
    armor_class: "",
    armor_bonus: "",
    balance_points: "",
    current_balance_points: "",
    magic_points: "",
    magic_bonus: "",
    current_magic_points: "",
    strength: "",
    strength_bonus: "",
    dexterity: "",
    dexterity_bonus: "",
    constitution: "",
    constitution_bonus: "",
    charisma: "",
    charisma_bonus: "",
    wisdom: "",
    wisdom_bonus: "",
    intelligence: "",
    intelligence_bonus: "",
    weakness: "",
    food: "",
    copper: "",
    silver: "",
    gold: "",
    base_speed: "",
    base_accuracy: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/character/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setCharacter(data); // Tallennetaan tiedot tilaan
          setValue("name", data.character.name);
          setValue("character_class", data.character.character_class);
          setValue("level", data.character.level);
          setValue("experience_stars", data.character.experience_stars);
          setValue("max_experience_stars", data.character.max_experience_stars);
          setValue("hit_points", data.character.hit_points);
          setValue("current_hit_points", data.character.current_hit_points);
          setValue("armor_class", data.character.armor_class);
          setValue("armor_bonus", data.character.armor_bonus);
          setValue("balance_points", data.character.balance_points);
          setValue(
            "current_balance_points",
            data.character.current_balance_points
          );
          setValue("magic_points", data.character.magic_points);
          setValue("magic_bonus", data.character.magic_bonus);
          setValue("current_magic_points", data.character.current_magic_points);
          setValue("strength", data.character.strength);
          setValue("strength_bonus", data.character.strength_bonus);
          setValue("dexterity", data.character.dexterity);
          setValue("dexterity_bonus", data.character.dexterity_bonus);
          setValue("constitution", data.character.constitution);
          setValue("constitution_bonus", data.character.constitution_bonus);
          setValue("charisma", data.character.charisma);
          setValue("charisma_bonus", data.character.charisma_bonus);
          setValue("wisdom", data.character.wisdom);
          setValue("wisdom_bonus", data.character.wisdom_bonus);
          setValue("intelligence", data.character.intelligence);
          setValue("intelligence_bonus", data.character.intelligence_bonus);
          setValue("weakness", data.character.weakness);
          setValue("food", data.character.food);
          setValue("copper", data.character.copper);
          setValue("silver", data.character.silver);
          setValue("gold", data.character.gold);
          setValue("base_speed", data.character.base_speed);
          setValue("base_accuracy", data.character.base_accuracy);
        }
      })
      .catch((error) => console.error("Virhe tietojen hakemisessa:", error));
  }, [id, setValue]);

  const validateForm = (data) => {
    const errors = {};

    // Nimi kenttä: vain kirjaimet
    if (!data.name || !/^[a-zA-ZåäöÅÄÖ' .-]+$/.test(data.name)) {
      errors.name =
        "Nimi on pakollinen ja voi sisältää vain kirjaimia, välilyöntejä, ' . ja -";
    }

    // Luokka kenttä
    if (!data.character_class) errors.character_class = "Valitse hahmoluokka.";

    // Taso kenttä: positiivinen kokonaisluku
    if (
      !data.level ||
      isNaN(data.level) ||
      data.level <= 0 ||
      !Number.isInteger(Number(data.level))
    )
      errors.level =
        "Taso on pakollinen ja sen tulee olla positiivinen kokonaisluku.";

    // Kokemustähdet kenttä: positiivinen kokonaisluku
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

    // Base Speed ja Base Accuracy kentät: vain numerot, "n" ja "+"
    const baseSpeedPattern = /^[0-9n+]+$/;
    if (data.base_speed && !baseSpeedPattern.test(data.base_speed))
      errors.base_speed =
        "Nopeusheitossa voi olla vain numeroita, 'n' ja '+' merkkejä.";

    const baseAccuracyPattern = /^[0-9n+]+$/;
    if (data.base_accuracy && !baseAccuracyPattern.test(data.base_accuracy))
      errors.base_accuracy =
        "Osumaheitossa voi olla vain numeroita, 'n' ja '+' merkkejä.";

    // Muu kenttävalidointi (numerot kentille, jotka ovat määriteltyjä)
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

  const onSubmit = (data) => {
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      for (let field in validationErrors) {
        setError(field, { type: "manual", message: validationErrors[field] });
      }
      return; // Prevent submission
    }

    try {
      const formData = new FormData();

      // Append form fields
      Object.keys(data).forEach((key) => {
        if (data[key] && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

      // Add image if provided
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      // Send data to server
      fetch(`http://localhost:3000/edit_character/${id}`, {
        method: "PUT",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            navigate(`/character/${id}`); // Navigate to the character page
          } else {
            alert("Error saving changes.");
          }
        })
        .catch((error) => console.error("Error updating character:", error));
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission error!");
    }
  };

  return (
    <div className="section">
      <h1>Muokkaa hahmoa</h1>
      <p>Pakolliset tiedot on merkitty tähdellä (*)</p>

      <form onSubmit={handleSubmit(onSubmit)}>
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
              defaultValue={character.character_class}
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
            <input id="image" type="file" {...register("image")} />
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

        <p>
          <button type="submit" className="btn btn-primary">
            Tallenna muutokset
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (window.confirm("Haluatko varmasti peruuttaa muutokset?")) {
                navigate(`/character/${id}`);
              }
            }}
          >
            Peruuta
          </button>
        </p>
      </form>
    </div>
  );
};

export default EditCharacter;
