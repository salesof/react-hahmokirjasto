import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { useParams, useNavigate } from "react-router-dom";
import CharacterCard from "./CharacterCard.jsx";

function UserPage() {
  const { user: loggedInUser } = useContext(UserContext);
  const { username } = useParams(); // Haetaan URL-parametrina käyttäjänimi
  const navigate = useNavigate(); // Käytetään navigointiin

  const [user, setUser] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data and their characters when the component mounts
  useEffect(() => {
    // Fetch user data
    axios
      .get(`http://localhost:3000/user/${username}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });

    // Fetch user's characters
    axios
      .get(`http://localhost:3000/user/${username}/characters`)
      .then((response) => {
        setCharacters(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user's characters:", error);
      });
  }, [username]);

  if (loading) {
    return <div>Odota hetki – sivua ladataan.</div>;
  }

  if (!user) {
    return <div>Käyttäjää ei löytynyt</div>;
  }

  const handleEditProfile = () => {
    navigate("/edit-profile"); // Navigoidaan profiilin muokkaussivulle
  };

  // Oletusavatar tai käyttäjän avatar
  const avatarUrl = user.avatar?.startsWith(
    "../frontend/public/assets/avatars/"
  )
    ? user.avatar
    : `../frontend/public/assets/avatars/${user.avatar || "blank.png"}`;

  return (
    <>
      <div className="section">
        <div className="user-card">
          <img className="user-avatar" src={avatarUrl} alt="User Avatar" />
          <div className="flex-wrapper">
            <div className="flex-inner padding-left">
              <h1>{user.username}</h1>
            </div>
            <div className="flex-inner padding-left">
              {/* Näytetään "Muokkaa profiilia" vain omassa profiilissa */}
              {loggedInUser?.username === user.username && (
                <button onClick={handleEditProfile}>Muokkaa profiilia</button>
              )}
            </div>
            <div className="break"></div>
            <div className="flex-inner padding-left">
              {user.about_me && <p>{user.about_me}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Hahmolistaus:</h2>
        <div className="flex-wrapper center">
          {characters.map((character) => (
            <CharacterCard key={character.character_id} character={character} />
          ))}
        </div>
      </div>
    </>
  );
}

export default UserPage;
