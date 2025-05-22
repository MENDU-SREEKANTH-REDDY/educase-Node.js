import db from '../db.js';

export const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  //valdn

  if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  //data entry
  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  });
};


export const listSchools = (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLong = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLong)) {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }

  db.query('SELECT * FROM schools', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const sorted = results.map(school => {
      const distance = Math.sqrt(
        Math.pow(userLat - school.latitude, 2) +
        Math.pow(userLong - school.longitude, 2)
      );
      return { ...school, distance };
    }).sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  });
};
