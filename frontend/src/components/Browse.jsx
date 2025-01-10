import React, { useState, useEffect } from "react";
import axios from "axios";
import CharacterCard from "./CharacterCard";

const Browse = () => {
  const [characters, setCharacters] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  useEffect(() => {
    fetchCharacters("http://localhost:3000/characters?page=1");
  }, []);

  const fetchCharacters = async (url) => {
    try {
      const response = await axios.get(url);
      if (response.data && Array.isArray(response.data.characters)) {
        setCharacters(response.data.characters);
        setNextUrl(response.data.next_url);
        setPrevUrl(response.data.prev_url);
      } else {
        console.error("Vastaus ei sisällä hahmoja");
        setCharacters([]);
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
      setCharacters([]);
    }
  };

  const handlePagination = (url) => {
    if (url) {
      // Add the base URL (localhost:3000) to the endpoint
      const fullUrl = `http://localhost:3000${url}`;
      fetchCharacters(fullUrl);
    }
  };

  return (
    <div className="section">
      <h1>Selaa muiden pelaajien hahmoja</h1>
      <div className="flex-wrapper center">
        {characters.length > 0 ? (
          characters.map((character) => (
            <CharacterCard key={character.character_id} character={character} />
          ))
        ) : (
          <p>Odota hetki – sivua ladataan.</p>
        )}
      </div>

      <div className="pagination-wrapper center">
        {nextUrl && (
          <button
            className="pagination older-posts"
            onClick={() => handlePagination(nextUrl)}
          >
            &#11013; Selaa vanhempia
          </button>
        )}
        {prevUrl && (
          <button
            className="pagination newer-posts"
            onClick={() => handlePagination(prevUrl)}
          >
            Selaa uudempia &#11157;
          </button>
        )}
      </div>
    </div>
  );
};

export default Browse;
