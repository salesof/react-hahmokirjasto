import React, { useState, useEffect } from "react";
import axios from "axios";
import CharacterCard from "./CharacterCard.jsx";

const Index = () => {
  // State to store character data
  const [characters, setCharacters] = useState([]);

  // Fetch latest characters on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/latest-characters") // Käytetään uutta reittiä
      .then((response) => {
        setCharacters(response.data); // Päivitetään tila kuudella hahmolla
      })
      .catch((error) => {
        console.error("Error fetching characters:", error);
      });
  }, []);

  return (
    <>
      <div className="section">
        <h2>Mistä on kyse?</h2>
        <p>
          Tämä palvelu on suunniteltu pöytäroolipelaajille, jotka haluavat
          tallentaa ja järjestää pelihahmonsa tiedot yhteen paikkaan. Sen avulla
          voit kirjata hahmosi ominaisuudet, varusteet, taidot ja edistymisen
          helposti, säilyttäen samalla kaikki tärkeät yksityiskohdat aina käden
          ulottuvilla. Hahmoarkisto tarjoaa helppokäyttöisen alustan pelin
          aikana tarvittavien tietojen selaamiseen ja hallintaan, tehden
          pelisessioista saumattomampia ja hahmojen seurannasta yksinkertaista.
          Liity, luo hahmosi, ja anna heidän tarinansa kasvaa ja kehittyä
          yhdessä muiden kanssa!
        </p>
      </div>

      <div className="section">
        <h2>Uusimmat hahmot</h2>

        <div className="flex-wrapper center">
          {characters.map((character) => (
            <CharacterCard key={character.character_id} character={character} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
