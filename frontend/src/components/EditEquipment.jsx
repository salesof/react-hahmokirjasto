import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditEquipment = () => {
  const [character, setCharacter] = useState(null);
  const [skills, setSkills] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [armors, setArmors] = useState([]);
  const [others, setOthers] = useState([]);

  const { id: characterId } = useParams();
  const navigate = useNavigate();

  const [newSkill, setNewSkill] = useState({
    name: "",
    star_price: "",
    magic_points: "",
  });
  const [newWeapon, setNewWeapon] = useState({
    name: "",
    damage: "",
    critical: "",
    other_info: "",
  });
  const [newArmor, setNewArmor] = useState({ name: "", effect: "" });
  const [newOther, setNewOther] = useState({ name: "", effect: "" });

  const [skillErrors, setSkillErrors] = useState({});
  const [weaponErrors, setWeaponErrors] = useState({});
  const [armorErrors, setArmorErrors] = useState({});
  const [otherErrors, setOtherErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/character/${characterId}`
        );
        setCharacter(response.data.character);
        setSkills(response.data.skills || []);
        setWeapons(response.data.weapons || []);
        setArmors(response.data.armors || []);
        setOthers(response.data.others || []);
      } catch (error) {
        console.error(
          "Error fetching character data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, [characterId]);

  // Validation functions
  const isValidName = (value) => /^[a-zA-ZäöüÄÖÜ\s]*$/.test(value);
  const isValidNumber = (value) => /^\d*$/.test(value);
  const isValidText = (value) => /^[a-zA-ZäöüÄÖÜ0-9.,\-\+\s]*$/.test(value);
  const isValidDamage = (value) => /^[nkpt0-9/+]*$/.test(value);
  const isValidCritical = (value) => /^[\d\-]*$/.test(value);

  const validateSkill = (skill) => {
    let isValid = true;
    const newErrors = {};

    if (!skill.name.trim()) {
      newErrors.name = "Tämä kenttä on pakollinen.";
      isValid = false;
    } else if (!isValidName(skill.name)) {
      newErrors.name = "Vain isot ja pienet kirjaimet sallittu.";
      isValid = false;
    }

    // Check if either star_price or magic_points is filled
    if (!skill.star_price && !skill.magic_points) {
      newErrors.star_price_or_magic_points =
        "Täytä joko tähtihinta tai magiapisteet.";
      isValid = false;
    }

    if (skill.star_price && !isValidNumber(skill.star_price)) {
      newErrors.star_price = "Vain numerot sallittu.";
      isValid = false;
    }

    if (skill.magic_points && !isValidNumber(skill.magic_points)) {
      newErrors.magic_points = "Vain numerot sallittu.";
      isValid = false;
    }

    setSkillErrors(newErrors);
    return isValid;
  };

  const validateWeapon = (weapon) => {
    let isValid = true;
    const newErrors = {};

    if (!weapon.name.trim()) {
      newErrors.name = "Tämä kenttä on pakollinen.";
      isValid = false;
    } else if (!isValidName(weapon.name)) {
      newErrors.name = "Vain isot ja pienet kirjaimet sallittu.";
      isValid = false;
    }

    if (!weapon.damage) {
      newErrors.damage = "Tämä kenttä on pakollinen.";
      isValid = false;
    } else if (!isValidDamage(weapon.damage)) {
      newErrors.damage = "Vain n, k, p, t, numerot, / ja + sallittu.";
      isValid = false;
    }

    if (!weapon.critical) {
      newErrors.critical = "Tämä kenttä on pakollinen.";
      isValid = false;
    } else if (!isValidCritical(weapon.critical)) {
      newErrors.critical = "Vain numerot ja - sallittu.";
      isValid = false;
    }

    if (weapon.other_info && !isValidText(weapon.other_info)) {
      newErrors.other_info =
        "Vain kirjaimet, numerot, piste, pilkku, plussa ja väliviiva sallittu.";
      isValid = false;
    }

    setWeaponErrors(newErrors);
    return isValid;
  };

  const validateArmor = (armor) => {
    let isValid = true;
    const newErrors = {};

    if (!armor.name.trim()) {
      newErrors.name = "Tämä kenttä on pakollinen.";
      isValid = false;
    } else if (!isValidName(armor.name)) {
      newErrors.name = "Vain isot ja pienet kirjaimet sallittu.";
      isValid = false;
    }

    if (armor.effect && !isValidText(armor.effect)) {
      newErrors.effect =
        "Vain kirjaimet, numerot, piste, pilkku, plussa ja väliviiva sallittu.";
      isValid = false;
    }

    setArmorErrors(newErrors);
    return isValid;
  };

  const validateOther = (other) => {
    let isValid = true;
    const newErrors = {};

    if (!other.name.trim()) {
      newErrors.name = "Tämä kenttä on pakollinen.";
      isValid = false;
    } else if (!isValidName(other.name)) {
      newErrors.name = "Vain isot ja pienet kirjaimet sallittu.";
      isValid = false;
    }

    if (other.effect && !isValidText(other.effect)) {
      newErrors.effect =
        "Vain kirjaimet, numerot, piste, pilkku, plussa ja väliviiva sallittu.";
      isValid = false;
    }

    setOtherErrors(newErrors);
    return isValid;
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!validateSkill(newSkill)) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/character/${characterId}/skill`,
        newSkill
      );
      setSkills([...skills, response.data]);
      setNewSkill({ name: "", star_price: "", magic_points: "" });
      setSkillErrors({});
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleAddWeapon = async (e) => {
    e.preventDefault();
    if (!validateWeapon(newWeapon)) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/character/${characterId}/weapon`,
        newWeapon
      );
      setWeapons([...weapons, response.data]);
      setNewWeapon({ name: "", damage: "", critical: "", other_info: "" });
      setWeaponErrors({});
    } catch (error) {
      console.error("Error adding weapon:", error);
    }
  };

  const handleAddArmor = async (e) => {
    e.preventDefault();
    if (!validateArmor(newArmor)) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/character/${characterId}/armor`,
        newArmor
      );
      setArmors([...armors, response.data]);
      setNewArmor({ name: "", effect: "" });
      setArmorErrors({});
    } catch (error) {
      console.error("Error adding armor:", error);
    }
  };

  const handleAddOther = async (e) => {
    e.preventDefault();
    if (!validateOther(newOther)) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/character/${characterId}/other`,
        newOther
      );
      setOthers([...others, response.data]);
      setNewOther({ name: "", effect: "" });
      setOtherErrors({});
    } catch (error) {
      console.error("Error adding other equipment:", error);
    }
  };

  const handleDeleteItem = async (type, id) => {
    try {
      await axios.delete(
        `http://localhost:3000/character/${characterId}/${type}/${id}`
      );
      if (type === "skill") setSkills(skills.filter((item) => item.id !== id));
      if (type === "weapon")
        setWeapons(weapons.filter((item) => item.id !== id));
      if (type === "armor") setArmors(armors.filter((item) => item.id !== id));
      if (type === "other") setOthers(others.filter((item) => item.id !== id));
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  if (!character) {
    return <div>Odota hetki – sivua ladataan.</div>;
  }

  return (
    <div className="section">
      <h1>Muokkaa hahmon {character.name} kykyjä ja varusteita</h1>
      <p>Pakolliset tiedot on merkitty tähdellä (*)</p>

      <form onSubmit={handleAddSkill}>
        <fieldset>
          <legend>Kyvyt:</legend>
          Uusintaheitto - Tähtihinta: 1<br />
          {skills.map((skill) => (
            <div key={skill.id}>
              {skill.name} -{" "}
              {skill.star_price
                ? `Tähtihinta: ${skill.star_price}`
                : `Magiapisteet: ${skill.magic_points}`}{" "}
              |
              <button
                type="button"
                className="delete_equipment"
                onClick={() => handleDeleteItem("skill", skill.id)}
              >
                Poista
              </button>
            </div>
          ))}
          <br />
          <hr />
          <br />
          <label>
            Kyvyn nimi *
            <br />
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
            />
            {skillErrors.name && (
              <p style={{ color: "red" }}>[{skillErrors.name}]</p>
            )}
          </label>
          <br />
          <label>
            Tähtihinta
            <br />
            <input
              type="number"
              value={newSkill.star_price}
              onChange={(e) =>
                setNewSkill({ ...newSkill, star_price: e.target.value })
              }
            />
            {skillErrors.star_price && (
              <p style={{ color: "red" }}>[{skillErrors.star_price}]</p>
            )}
          </label>
          <br />
          <label>
            Magiapisteet
            <br />
            <input
              type="number"
              value={newSkill.magic_points}
              onChange={(e) =>
                setNewSkill({ ...newSkill, magic_points: e.target.value })
              }
            />
            {skillErrors.magic_points && (
              <p style={{ color: "red" }}>[{skillErrors.magic_points}]</p>
            )}
            {skillErrors.star_price_or_magic_points && (
              <p style={{ color: "red" }}>
                [{skillErrors.star_price_or_magic_points}]
              </p>
            )}
          </label>
          <br />
          <button type="submit">Lisää kyky</button>
        </fieldset>
      </form>

      <br />

      {/* Weapon Form */}
      <form onSubmit={handleAddWeapon}>
        <fieldset>
          <legend>Aseet:</legend>
          {weapons.map((weapon) => (
            <div key={weapon.id}>
              {weapon.name} - Vahinko: {weapon.damage} - Kriittinen:{" "}
              {weapon.critical}{" "}
              {weapon.other_info && `- Muuta: ${weapon.other_info}`} |
              <button
                type="button"
                className="delete_equipment"
                onClick={() => handleDeleteItem("weapon", weapon.id)}
              >
                Poista
              </button>
            </div>
          ))}
          <br />
          <hr />
          <br />

          <label>
            Aseen nimi *
            <br />
            <input
              type="text"
              value={newWeapon.name}
              onChange={(e) =>
                setNewWeapon({ ...newWeapon, name: e.target.value })
              }
            />
            {weaponErrors.name && (
              <p style={{ color: "red" }}>[{weaponErrors.name}]</p>
            )}
          </label>
          <br />
          <label>
            Vahinko *
            <br />
            <input
              type="text"
              value={newWeapon.damage}
              onChange={(e) =>
                setNewWeapon({ ...newWeapon, damage: e.target.value })
              }
            />
            {weaponErrors.damage && (
              <p style={{ color: "red" }}>[{weaponErrors.damage}]</p>
            )}
          </label>
          <br />
          <label>
            Kriittinen *
            <br />
            <input
              type="text"
              value={newWeapon.critical}
              onChange={(e) =>
                setNewWeapon({ ...newWeapon, critical: e.target.value })
              }
            />
            {weaponErrors.critical && (
              <p style={{ color: "red" }}>[{weaponErrors.critical}]</p>
            )}
          </label>
          <br />
          <label>
            Muuta
            <br />
            <input
              type="text"
              value={newWeapon.other_info}
              onChange={(e) =>
                setNewWeapon({ ...newWeapon, other_info: e.target.value })
              }
            />
            {weaponErrors.other_info && (
              <p style={{ color: "red" }}>[{weaponErrors.other_info}]</p>
            )}
          </label>
          <br />
          <button type="submit">Lisää ase</button>
        </fieldset>
      </form>

      <br />

      {/* Armor Form */}
      <form onSubmit={handleAddArmor}>
        <fieldset>
          <legend>Haarniskat:</legend>
          {armors.map((armor) => (
            <div key={armor.id}>
              {armor.name}
              {armor.effect && <> - Muuta: {armor.effect}</>} |
              <button
                type="button"
                className="delete_equipment"
                onClick={() => handleDeleteItem("armor", armor.id)}
              >
                Poista
              </button>
            </div>
          ))}
          <br />
          <hr />
          <br />

          <label>
            Haarniskan nimi *
            <br />
            <input
              type="text"
              value={newArmor.name}
              onChange={(e) =>
                setNewArmor({ ...newArmor, name: e.target.value })
              }
            />
            {armorErrors.name && (
              <p style={{ color: "red" }}>[{armorErrors.name}]</p>
            )}
          </label>
          <br />
          <label>
            Muuta
            <br />
            <input
              type="text"
              value={newArmor.effect}
              onChange={(e) =>
                setNewArmor({ ...newArmor, effect: e.target.value })
              }
            />
            {armorErrors.effect && (
              <p style={{ color: "red" }}>[{armorErrors.effect}]</p>
            )}
          </label>
          <br />
          <button type="submit">Lisää haarniska</button>
        </fieldset>
      </form>

      <br />

      {/* Other Equipment Form */}
      <form onSubmit={handleAddOther}>
        <fieldset>
          <legend>Muut varusteet:</legend>
          {others.map((other) => (
            <div key={other.id}>
              {other.name} {other.effect && `- ${other.effect}`} |
              <button
                type="button"
                className="delete_equipment"
                onClick={() => handleDeleteItem("other", other.id)}
              >
                Poista
              </button>
            </div>
          ))}
          <br />
          <hr />
          <br />

          <label>
            Varusteen nimi *
            <br />
            <input
              type="text"
              value={newOther.name}
              onChange={(e) =>
                setNewOther({ ...newOther, name: e.target.value })
              }
              size="20"
            />
            {otherErrors.name && (
              <p style={{ color: "red" }}>[{otherErrors.name}]</p>
            )}
          </label>
          <br />
          <label>
            Vaikutus
            <br />
            <input
              type="text"
              value={newOther.effect}
              onChange={(e) =>
                setNewOther({ ...newOther, effect: e.target.value })
              }
            />
            {otherErrors.effect && (
              <p style={{ color: "red" }}>[{otherErrors.effect}]</p>
            )}
          </label>
          <br />
          <button type="submit">Lisää muu varuste</button>
        </fieldset>
      </form>

      <br />
      <button
        className="btn-edit-equipment"
        onClick={() => navigate(`/character/${characterId}`)}
      >
        Palaa hahmon sivulle
      </button>
      <br />
      <br />
    </div>
  );
};

export default EditEquipment;
