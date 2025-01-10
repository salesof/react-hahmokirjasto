import React from "react";
import { Link } from "react-router-dom";

function CharacterCard({ character }) {
  const characterImage = character.character_image
    ? `../frontend/public/assets/character_images/${character.character_image}`
    : "../frontend/public/assets/avatars/blank.png";

  const userAvatar =
    character.user_avatar &&
    character.user_avatar.startsWith("../frontend/public/assets/avatars/")
      ? character.user_avatar
      : `../frontend/public/assets/avatars/${
          character.user_avatar || "blank.png"
        }`;

  const username = character.user_username || "Tuntematon käyttäjä";

  return (
    <figure className="character-card">
      <div className="character-card-img">
        <img src={characterImage} alt="Character picture" />
      </div>

      <div className="user-info">
        <span>
          <Link to={`/user/${character.user_username || ""}`}>{username}</Link>
        </span>
        <img className="avatar" src={userAvatar} alt="User Avatar" />
      </div>

      <figcaption>
        <h3>{character.character_name}</h3>
        <p>
          {character.character_class} | Lv {character.level}
        </p>
        <Link to={`/character/${character.character_id}`} className="read-more">
          Tutustu hahmoon
        </Link>
      </figcaption>
    </figure>
  );
}

export default CharacterCard;
