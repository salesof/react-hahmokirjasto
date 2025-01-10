import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

const CharacterPage = () => {
  const { user: loggedInUser } = useContext(UserContext); // Tähän haetaan nykyinen käyttäjä
  const [character, setCharacter] = useState(null);
  const [skills, setSkills] = useState(null);
  const [weapons, setWeapons] = useState(null);
  const [armors, setArmors] = useState(null);
  const [others, setOthers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/character/${id}`
        );
        const { character, skills, weapons, armors, others } = response.data;

        setCharacter(character); // Asetetaan hahmon perustiedot
        setSkills(skills); // Asetetaan kyvyt
        setWeapons(weapons); // Asetetaan aseet
        setArmors(armors); // Asetetaan haarniskat
        setOthers(others); // Asetetaan muut varusteet
      } catch (error) {
        console.error("Error fetching character:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterData();
  }, [id]);

  // Function to handle deletion confirmation
  const confirmDeletion = () => {
    if (window.confirm("Oletko varma, että haluat poistaa tämän hahmon?")) {
      // Submit the form or make a delete request here
      handleDelete();
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/character/${character.id}`);
      navigate(`/user/${loggedInUser.username}`);
    } catch (error) {
      console.error("Error deleting character:", error);
      alert("Hahmon poistaminen epäonnistui. Yritä uudelleen.");
    }
  };

  if (isLoading) {
    return <div>Odota hetki – sivua ladataan.</div>;
  }

  if (!character) {
    return <div>Hahmoa ei löytynyt.</div>;
  }

  return (
    <div className="section">
      <div className="flex-wrapper">
        <h1>{character.name}</h1>

        {loggedInUser && loggedInUser.username === character.username && (
          <button className="btn-edit">
            <a href={`/edit_character/${character.id}`}>Muokkaa hahmoa</a>
          </button>
        )}
      </div>
      <div className="character-img">
        {character.image ? (
          <img
            src={`../frontend/public/assets/character_images/${character.image}`}
            alt="Character picture"
          />
        ) : (
          <img
            src="../frontend/public/assets/avatars/blank.png"
            alt="Character picture"
          />
        )}
      </div>
      <div className="character-details">
        <p>
          <b>Pelaaja:</b>{" "}
          <a href={`/user/${character.username}`}>{character.username}</a>
          <br />
          <b>Luokka:</b> {character.character_class || "-"}
          <br />
          <b>Taso:</b> {character.level || "-"}
        </p>
        <p>
          <b>Kokemustähdet:</b> {character.experience_stars || "-"} /{" "}
          {character.max_experience_stars || "-"}
          <br />
          <b>Kestopisteet:</b> {character.current_hit_points || "-"} /{" "}
          {character.hit_points || "-"}
          <br />
          <b>Tasapainopisteet:</b> {character.current_balance_points || "-"} /{" "}
          {character.balance_points || "-"}
          <br />
          <b>Magiapisteet:</b> {character.current_magic_points || "-"} /{" "}
          {character.magic_points || "-"} +{character.magic_bonus || "-"}
        </p>
        <p>
          <b>Suojaluokka:</b> {character.armor_class || "-"} +{" "}
          {character.armor_bonus || "-"}
          <br />
          <b>Nopeusheitto:</b> {character.base_speed || "-"}
          <br />
          <b>Osumaheitto:</b> {character.base_accuracy || "-"}
        </p>
        <p>
          <b>Voima:</b> {character.strength || "-"} +
          {character.strength_bonus || "-"}
          <br />
          <b>Ketteryys:</b> {character.dexterity || "-"} +
          {character.dexterity_bonus || "-"}
          <br />
          <b>Kunto:</b> {character.constitution || "-"} +
          {character.constitution_bonus || "-"}
          <br />
          <b>Väki:</b> {character.charisma || "-"} +
          {character.charisma_bonus || "-"}
          <br />
          <b>Äly:</b> {character.wisdom || "-"} +{character.wisdom_bonus || "-"}
          <br />
          <b>Vaisto:</b> {character.intelligence || "-"} +
          {character.intelligence_bonus || "-"}
        </p>
        <p>
          <b>Heikkous:</b> {character.weakness || "-"}
          <br />
          <b>Ruoka-annokset:</b> {character.food || "-"}
          <br />
          <b>Rahat:</b> {character.copper || "-"} kuparimarkkaa,{" "}
          {character.silver || "-"} hopeataaleria, {character.gold || "-"}{" "}
          kultakruunua
        </p>
      </div>
      <hr />
      {loggedInUser && loggedInUser.username === character.username && (
        <button className="btn-edit-equipment">
          <a href={`/edit_equipment/${character.id}`}>
            Muokkaa kykyjä ja varusteita
          </a>
        </button>
      )}
      <br />
      <b>Kyvyt:</b>
      <br />
      Uusintaheitto - Tähtihinta: 1<br />
      {skills.map((skill) => (
        <div key={skill.id}>
          {skill.name} -{" "}
          {skill.star_price
            ? `Tähtihinta: ${skill.star_price}`
            : skill.magic_points
            ? `Magiapisteet: ${skill.magic_points}`
            : null}
          <br />
        </div>
      ))}
      <br />
      <b>Aseet:</b>
      <br />
      {weapons.map((weapon) => (
        <div key={weapon.id}>
          {weapon.name} - Vahinko: {weapon.damage} - Kriittinen:{" "}
          {weapon.critical}{" "}
          {weapon.other_info && `- Muuta: ${weapon.other_info}`}
          <br />
        </div>
      ))}
      <br />
      <b>Haarniskat:</b>
      <br />
      {armors.map((armor) => (
        <div key={armor.id}>
          {armor.name}
          {armor.effect && ` - Muuta: ${armor.effect}`}
          <br />
        </div>
      ))}
      <br />
      <b>Muut varusteet:</b>
      <br />
      {others.map((other) => (
        <div key={other.id}>
          {other.name}
          {other.effect && ` - ${other.effect}`}
          <br />
        </div>
      ))}
      <br />
      {loggedInUser && loggedInUser.username === character.username && (
        <>
          <hr />
          <br />
          <form onSubmit={handleDelete} id="delete-character-form">
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmDeletion}
            >
              Poista hahmo
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CharacterPage;
