const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'react_hahmokirjasto',
  port: 3306,
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/assets/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  },
});

const characterImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/assets/character_images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const characterImageUpload = multer({
  storage: characterImageStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  },
});

const itemsPerPage = 24;

app.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;

  let errors = {};

  // Varmista, että kentät eivät ole tyhjiä
  if (!username || !email || !password || !password2) {
    errors = {
      username: 'Please fill in all fields.',
      email: 'Please fill in all fields.',
      password: 'Please fill in all fields.',
      password2: 'Please fill in all fields.'
    };
    return res.status(400).json({ errors });
  }

  // Varmista, että salasanat täsmäävät
  if (password !== password2) {
    errors.password = 'Passwords do not match.';
    errors.password2 = 'Passwords do not match.';
  }

  // Tarkista, että salasana on riittävän vahva
  if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  // Tarkista, onko käyttäjänimi jo käytössä
  const checkUsernameSql = 'SELECT * FROM user WHERE username = ?';
  db.query(checkUsernameSql, [username], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'An error occurred while processing your request.' });
    }

    if (result.length > 0) {
      errors.username = 'Username is already taken.';
    }

    // Tarkista, onko sähköpostiosoite jo käytössä
    const checkEmailSql = 'SELECT * FROM user WHERE email = ?';
    db.query(checkEmailSql, [email], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'An error occurred while processing your request.' });
      }

      if (result.length > 0) {
        errors.email = 'Email is already registered.';
      }

      // Jos on virheitä, palauta ne
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      // Suoritetaan salasanojen salaus
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'An error occurred while hashing the password.' });
        }

        // Lisää uusi käyttäjä tietokantaan
        const sql = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
          if (err) {
            console.error('Error inserting new user:', err);
            return res.status(500).json({ message: 'An error occurred while registering the user.' });
          }

          // Lähetetään onnistumisviesti
          res.status(201).json({
            message: 'User registered successfully!',
          });
        });
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM user WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'An error occurred while processing your request.' });
    } 
    if (result.length > 0) {
      const user = result[0];

      // Vertaa bcryptillä hashattua salasanaa
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing password:', err);
          return res.status(500).json({ message: 'An error occurred while processing the password comparison.' });
        }

        if (isMatch) {
          res.status(200).json({
            message: 'Login successful',
            user: {
              id: user.id,
              username: user.username,
              avatar: user.avatar,
              aboutMe: user.about_me,
            },
          });
        } else {
          res.status(401).json({ message: 'Login failed. Invalid username or password.' });
        }
      });
    } else {
      res.status(401).json({ message: 'Login failed. Invalid username or password.' });
    }
  });
});

app.post('/edit-profile', avatarUpload.single('avatar'), (req, res) => {
  const { userId, username, aboutMe, newPassword } = req.body;
  const avatar = req.file ? `${req.file.filename}` : null;

  let sql = `
    UPDATE user 
    SET username = ?, about_me = ?, avatar = IFNULL(?, avatar) 
    WHERE id = ?
  `;

  if (newPassword) {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Error updating password" });
      }

      sql = `
        UPDATE user 
        SET username = ?, about_me = ?, avatar = IFNULL(?, avatar), password = ? 
        WHERE id = ?
      `;
      db.query(sql, [username, aboutMe, avatar, hashedPassword, userId], (err, result) => {
        if (err) {
          console.error('Error updating profile:', err);
          return res.status(500).json({ message: 'An error occurred while updating profile.' });
        }

        if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Profile updated successfully' });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      });
    });
  } else {
    db.query(sql, [username, aboutMe, avatar, userId], (err, result) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ message: 'An error occurred while updating profile.' });
      }

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Profile updated successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
  }
});

app.get('/characters', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * itemsPerPage;

  const sql = `
    SELECT 
      c.id AS character_id,
      c.name AS character_name,
      c.character_class,
      c.level,
      c.image AS character_image,
      u.username AS user_username,
      u.avatar AS user_avatar
    FROM \`character\` c
    JOIN \`user\` u ON c.user_id = u.id
    ORDER BY c.id DESC
    LIMIT ? OFFSET ?;
  `;
  const params = [itemsPerPage, offset];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error fetching characters:', err);
      return res.status(500).json({ message: 'An error occurred while fetching characters.' });
    }

    const countSql = 'SELECT COUNT(*) AS total FROM `character`';
    db.query(countSql, (err, countResult) => {
      if (err) {
        console.error('Error counting total characters:', err);
        return res.status(500).json({ message: 'An error occurred while counting total characters.' });
      }

      const totalItems = countResult[0].total;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      const nextUrl = page < totalPages ? `/characters?page=${page + 1}` : null;
      const prevUrl = page > 1 ? `/characters?page=${page - 1}` : null;

      res.status(200).json({
        characters: result,
        next_url: nextUrl,
        prev_url: prevUrl,
      });
    });
  });
});

// Fetch user by username
app.get('/user/:username', (req, res) => {
  const { username } = req.params;

  const sql = 'SELECT id, username, avatar, about_me FROM user WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return res.status(500).json({ message: 'An error occurred while fetching user data.' });
    }

    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

app.get('/user/:username/characters', (req, res) => {
  const { username } = req.params;

  const sql = `
    SELECT 
        c.id AS character_id,
        c.name AS character_name,
        c.character_class,
        c.level,
        c.image AS character_image,
        u.username AS user_username,
        u.avatar AS user_avatar
    FROM \`character\` c
    JOIN \`user\` u ON c.user_id = u.id
    WHERE u.username = ?
    ORDER BY c.id DESC
  `;

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error fetching characters for user:', err);
      return res.status(500).json({ message: 'An error occurred while fetching characters.' });
    }
    res.status(200).json(result);
  });
});

app.get('/latest-characters', (req, res) => {
  const sql = `
    SELECT 
        c.id AS character_id,
        c.name AS character_name,
        c.character_class,
        c.level,
        c.image AS character_image,
        u.username AS user_username,
        u.avatar AS user_avatar
    FROM \`character\` c
    JOIN \`user\` u ON c.user_id = u.id
    ORDER BY c.id DESC
    LIMIT 6
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching characters:', err);
      return res.status(500).json({ message: 'An error occurred while fetching characters.' });
    }
    res.status(200).json(result);
  });
});

app.get('/character/:id', (req, res) => {
  const { id } = req.params;

  // Hahmon perustietojen SQL
  const characterSql = `
  SELECT 
    c.id, 
    c.name, 
    c.character_class, 
    c.level, 
    c.experience_stars, 
    c.max_experience_stars, 
    c.hit_points, 
    c.current_hit_points, 
    c.armor_class, 
    c.armor_bonus, 
    c.balance_points, 
    c.current_balance_points, 
    c.magic_points, 
    c.magic_bonus, 
    c.current_magic_points, 
    c.base_speed, 
    c.base_accuracy, 
    c.strength, 
    c.strength_bonus, 
    c.dexterity, 
    c.dexterity_bonus, 
    c.constitution, 
    c.constitution_bonus, 
    c.charisma, 
    c.charisma_bonus, 
    c.wisdom, 
    c.wisdom_bonus, 
    c.intelligence, 
    c.intelligence_bonus, 
    c.weakness, 
    c.food, 
    c.copper, 
    c.silver, 
    c.gold, 
    c.image, 
    c.user_id,
    u.username
  FROM 
    \`character\` c
  JOIN \`user\` u ON c.user_id = u.id
  WHERE 
    c.id = ?;
  `;

  // Kykyjen SQL
  const skillsSql = `
  SELECT id, name, star_price, magic_points
  FROM \`skill\`
  WHERE character_id = ?;
  `;

  // Aseiden SQL
  const weaponsSql = `
  SELECT id, name, damage, critical, other_info
  FROM \`weapon\`
  WHERE character_id = ?;
  `;

  // Haarniskojen SQL
  const armorsSql = `
  SELECT id, name, effect
  FROM \`armor\`
  WHERE character_id = ?;
  `;

  // Muiden varusteiden SQL
  const othersSql = `
  SELECT id, name, effect
  FROM \`other_equipment\`
  WHERE character_id = ?;
  `;

  // Suoritetaan kaikki SQL-kyselyt
  db.query(characterSql, [id], (err, characterResult) => {
    if (err) {
      console.error('Error fetching character data:', err);
      return res.status(500).json({ message: 'An error occurred while fetching character data.' });
    }

    if (characterResult.length === 0) {
      return res.status(404).json({ message: 'Character not found' });
    }

    const character = characterResult[0];

    // Suoritetaan rinnakkain liittyvien tietojen haku
    db.query(skillsSql, [id], (err, skillsResult) => {
      if (err) {
        console.error('Error fetching skills:', err);
        return res.status(500).json({ message: 'An error occurred while fetching skills.' });
      }

      db.query(weaponsSql, [id], (err, weaponsResult) => {
        if (err) {
          console.error('Error fetching weapons:', err);
          return res.status(500).json({ message: 'An error occurred while fetching weapons.' });
        }

        db.query(armorsSql, [id], (err, armorsResult) => {
          if (err) {
            console.error('Error fetching armors:', err);
            return res.status(500).json({ message: 'An error occurred while fetching armors.' });
          }

          db.query(othersSql, [id], (err, othersResult) => {
            if (err) {
              console.error('Error fetching other items:', err);
              return res.status(500).json({ message: 'An error occurred while fetching other items.' });
            }

            // Lähetetään yhdistetty JSON-vastaus
            res.status(200).json({
              character,
              skills: skillsResult,
              weapons: weaponsResult,
              armors: armorsResult,
              others: othersResult,
            });
          });
        });
      });
    });
  });
});

app.post('/create_character', characterImageUpload.single('image'), (req, res) => {
  const {
    user_id,
    name,
    character_class,
    level,
    experience_stars,
    max_experience_stars,
    hit_points,
    current_hit_points,
    armor_class,
    armor_bonus,
    balance_points,
    current_balance_points,
    magic_points,
    magic_bonus,
    current_magic_points,
    strength,
    strength_bonus,
    dexterity,
    dexterity_bonus,
    constitution,
    constitution_bonus,
    charisma,
    charisma_bonus,
    wisdom,
    wisdom_bonus,
    intelligence,
    intelligence_bonus,
    weakness,
    food,
    copper,
    silver,
    gold,
    base_speed,
    base_accuracy
  } = req.body;

  // Tarkistetaan, että käyttäjän ID on mukana
  if (!user_id) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  // Tarkistetaan, onko kuva ladattu
  const image = req.file ? `${req.file.filename}` : null;

  // Muodostetaan SQL-kysely ilman imagea
  let insertQuery = `
    INSERT INTO \`character\` (
      user_id,
      name,
      character_class,
      level,
      experience_stars,
      max_experience_stars,
      hit_points,
      current_hit_points,
      armor_class,
      armor_bonus,
      balance_points,
      current_balance_points,
      magic_points,
      magic_bonus,
      current_magic_points,
      strength,
      strength_bonus,
      dexterity,
      dexterity_bonus,
      constitution,
      constitution_bonus,
      charisma,
      charisma_bonus,
      wisdom,
      wisdom_bonus,
      intelligence,
      intelligence_bonus,
      weakness,
      food,
      copper,
      silver,
      gold,
      base_speed,
      base_accuracy
  `;

  // Lisää image kenttä SQL-kyselyyn, jos kuva on ladattu
  const params = [
    user_id,
    name,
    character_class,
    level,
    experience_stars,
    max_experience_stars,
    hit_points,
    current_hit_points,
    armor_class,
    armor_bonus,
    balance_points,
    current_balance_points,
    magic_points,
    magic_bonus,
    current_magic_points,
    strength,
    strength_bonus,
    dexterity,
    dexterity_bonus,
    constitution,
    constitution_bonus,
    charisma,
    charisma_bonus,
    wisdom,
    wisdom_bonus,
    intelligence,
    intelligence_bonus,
    weakness,
    food,
    copper,
    silver,
    gold,
    base_speed,
    base_accuracy
  ];

  // Jos kuva on ladattu, lisää se sekä SQL-kyselyyn että params-taulukkoon
  if (image) {
    insertQuery += `, image`;
    params.push(image);
  }

  // Päätetään kysely
  insertQuery += `) VALUES (${params.map(() => '?').join(', ')})`;  // Lisää oikea määrä kysymysmerkkejä

  // Suoritetaan SQL-kysely
  db.query(insertQuery, params, (err, result) => {
    if (err) {
      console.error('Error inserting character:', err);
      return res.status(500).json({ message: 'An error occurred while creating the character.' });
    }

    res.status(201).json({ message: 'Character created successfully.' });
  });
});

app.put('/edit_character/:id', characterImageUpload.single('image'), (req, res) => {
  const { id } = req.params;
  const {
    name,
    character_class,
    level,
    experience_stars,
    max_experience_stars,
    hit_points,
    current_hit_points,
    armor_class,
    armor_bonus,
    balance_points,
    current_balance_points,
    magic_points,
    magic_bonus,
    current_magic_points,
    strength,
    strength_bonus,
    dexterity,
    dexterity_bonus,
    constitution,
    constitution_bonus,
    charisma,
    charisma_bonus,
    wisdom,
    wisdom_bonus,
    intelligence,
    intelligence_bonus,
    weakness,
    food,
    copper,
    silver,
    gold,
    base_speed,
    base_accuracy,
  } = req.body;

  const image = req.file ? `${req.file.filename}` : null;

  let sql = `
    UPDATE \`character\` 
    SET 
      name = ?, 
      character_class = ?, 
      level = ?, 
      experience_stars = ?, 
      max_experience_stars = ?, 
      hit_points = ?, 
      current_hit_points = ?, 
      armor_class = ?, 
      armor_bonus = ?, 
      balance_points = ?, 
      current_balance_points = ?, 
      magic_points = ?, 
      magic_bonus = ?, 
      current_magic_points = ?, 
      strength = ?, 
      strength_bonus = ?, 
      dexterity = ?, 
      dexterity_bonus = ?, 
      constitution = ?, 
      constitution_bonus = ?, 
      charisma = ?, 
      charisma_bonus = ?, 
      wisdom = ?, 
      wisdom_bonus = ?, 
      intelligence = ?, 
      intelligence_bonus = ?, 
      weakness = ?, 
      food = ?, 
      copper = ?, 
      silver = ?, 
      gold = ?, 
      base_speed = ?, 
      base_accuracy = ?
  `;

  const params = [
    name,
    character_class,
    level,
    experience_stars,
    max_experience_stars,
    hit_points,
    current_hit_points,
    armor_class,
    armor_bonus,
    balance_points,
    current_balance_points,
    magic_points,
    magic_bonus,
    current_magic_points,
    strength,
    strength_bonus,
    dexterity,
    dexterity_bonus,
    constitution,
    constitution_bonus,
    charisma,
    charisma_bonus,
    wisdom,
    wisdom_bonus,
    intelligence,
    intelligence_bonus,
    weakness,
    food,
    copper,
    silver,
    gold,
    base_speed,
    base_accuracy,
  ];

  if (image) {
    sql += `, image = ?`;
    params.push(image);
  }

  sql += ` WHERE id = ?`;
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating character:', err);
      return res.status(500).json({ message: 'An error occurred while updating the character.' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Character updated successfully.' });
    } else {
      res.status(404).json({ message: 'Character not found.' });
    }
  });
});

app.delete("/character/:id", (req, res) => {
  const { id } = req.params;

  // Poistetaan ensin hahmoon liittyvät tiedot muista tauluista
  const deleteSkillsQuery = "DELETE FROM `skill` WHERE `character_id` = ?";
  const deleteWeaponsQuery = "DELETE FROM `weapon` WHERE `character_id` = ?";
  const deleteArmorQuery = "DELETE FROM `armor` WHERE `character_id` = ?";
  const deleteOtherEquipmentQuery = "DELETE FROM `other_equipment` WHERE `character_id` = ?";

  // Suoritetaan poistoja järjestyksessä, aina hahmon poistoon asti
  db.query(deleteSkillsQuery, [id], (err) => {
    if (err) {
      console.error("Error deleting skills:", err);
      return res.status(500).json({ error: "Database error while deleting skills" });
    }

    db.query(deleteWeaponsQuery, [id], (err) => {
      if (err) {
        console.error("Error deleting weapons:", err);
        return res.status(500).json({ error: "Database error while deleting weapons" });
      }

      db.query(deleteArmorQuery, [id], (err) => {
        if (err) {
          console.error("Error deleting armor:", err);
          return res.status(500).json({ error: "Database error while deleting armor" });
        }

        db.query(deleteOtherEquipmentQuery, [id], (err) => {
          if (err) {
            console.error("Error deleting other equipment:", err);
            return res.status(500).json({ error: "Database error while deleting other equipment" });
          }

          // Lopuksi poistetaan hahmo
          const deleteCharacterQuery = "DELETE FROM `character` WHERE id = ?";
          db.query(deleteCharacterQuery, [id], (err, results) => {
            if (err) {
              console.error("Error deleting character:", err);
              return res.status(500).json({ error: "Database error while deleting character" });
            }

            // Tarkistetaan, poistettiinko hahmo
            if (results.affectedRows === 0) {
              res.status(404).json({ error: "Character not found" });
            } else {
              res.status(200).json({ message: "Character and related data deleted successfully" });
            }
          });
        });
      });
    });
  });
});

// Reitti kyvyn lisäämiseen
app.post('/character/:id/skill', (req, res) => {
  const { id: characterId } = req.params;
  const { name, star_price, magic_points } = req.body;

  if (!name || (!star_price && !magic_points)) {
    return res.status(400).json({ message: 'Skill name and at least one of star_price or magic_points are required.' });
  }

  const query = `
    INSERT INTO skill (character_id, name, star_price, magic_points)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [characterId, name, star_price || null, magic_points || null], (err, result) => {
    if (err) {
      console.error('Error inserting skill:', err);
      return res.status(500).json({ message: 'An error occurred while adding the skill.' });
    }
    res.status(201).json({ id: result.insertId, name, star_price, magic_points });
  });
});

// Reitti kyvyn poistamiseen
app.delete('/character/:characterId/skill/:id', (req, res) => {
  const { characterId, id } = req.params;

  if (!characterId || !id) {
    return res.status(400).json({ message: 'Character ID and Skill ID are required.' });
  }

  const query = `
    DELETE FROM skill
    WHERE id = ? AND character_id = ?
  `;

  db.query(query, [id, characterId], (err, result) => {
    if (err) {
      console.error('Error deleting skill:', err);
      return res.status(500).json({ message: 'An error occurred while deleting the skill.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Skill not found.' });
    }
    res.status(200).json({ message: 'Skill deleted successfully.' });
  });
});

// Reitti kyvyn muokkaamiseen
app.put('/character/:characterId/skill/:id', (req, res) => {
  const { characterId, id } = req.params;
  const { name, star_price, magic_points } = req.body;

  if (!name || (!star_price && !magic_points)) {
    return res.status(400).json({ message: 'Skill name and at least one of star_price or magic_points are required.' });
  }

  const query = `
    UPDATE skill
    SET name = ?, star_price = ?, magic_points = ?
    WHERE id = ? AND character_id = ?
  `;

  db.query(query, [name, star_price || null, magic_points || null, id, characterId], (err, result) => {
    if (err) {
      console.error('Error updating skill:', err);
      return res.status(500).json({ message: 'An error occurred while updating the skill.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Skill not found.' });
    }
    res.status(200).json({ message: 'Skill updated successfully.' });
  });
});

// Reitti muiden varusteiden lisäämiseen
app.post('/character/:id/:type', (req, res) => {
  const { id: characterId, type } = req.params;
  const { name, ...rest } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Equipment name is required.' });
  }

  let tableName;
  switch (type) {
    case 'weapon':
      tableName = 'weapon';
      break;
    case 'armor':
      tableName = 'armor';
      break;
    case 'other':
      tableName = 'other_equipment';
      break;
    default:
      return res.status(400).json({ message: 'Invalid equipment type.' });
  }

  const validKeys = ['damage', 'critical', 'other_info', 'effect'];
  const filteredData = Object.keys(rest).reduce((acc, key) => {
    if (validKeys.includes(key) && rest[key] !== undefined) {
      acc[key] = rest[key];
    }
    return acc;
  }, {});

  // Tarkista, että on vähintään yksi lisättävä kenttä
  if (Object.keys(filteredData).length === 0) {
    return res.status(400).json({ message: 'At least one valid equipment property is required.' });
  }

  const query = `
    INSERT INTO ${tableName} (character_id, name, ${Object.keys(filteredData).join(', ')})
    VALUES (?, ?, ${Object.keys(filteredData).map(() => '?').join(', ')})
  `;

  db.query(query, [characterId, name, ...Object.values(filteredData)], (err, result) => {
    if (err) {
      console.error(`Error inserting ${type}:`, err);
      return res.status(500).json({ message: `An error occurred while adding the ${type}.` });
    }
    res.status(201).json({ id: result.insertId, name, ...filteredData });
  });
});

// Reitti muiden varusteiden poistamiseen
app.delete('/character/:characterId/:type/:id', (req, res) => {
  const { characterId, type, id } = req.params;

  if (!characterId || !id) {
    return res.status(400).json({ message: 'Character ID and Equipment ID are required.' });
  }

  let tableName;
  switch (type) {
    case 'weapon':
      tableName = 'weapon';
      break;
    case 'armor':
      tableName = 'armor';
      break;
    case 'other':
      tableName = 'other_equipment';
      break;
    default:
      return res.status(400).json({ message: 'Invalid equipment type.' });
  }

  const query = `
    DELETE FROM ${tableName}
    WHERE id = ? AND character_id = ?
  `;

  db.query(query, [id, characterId], (err, result) => {
    if (err) {
      console.error(`Error deleting ${type}:`, err);
      return res.status(500).json({ message: `An error occurred while deleting the ${type}.` });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found.` });
    }
    res.status(200).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.` });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
