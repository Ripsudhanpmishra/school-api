const express = require("express");
const db = require("./Db");
require("dotenv").config();

const app = express();
app.use(express.json()); 

// Helper: Haversine formula
// Calculates the distance (in km) between two lat/lng points
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat(distance.toFixed(2));
}


// Adds a new school to the database

app.post("/addSchool", async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required: name, address, latitude, longitude" });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Latitude and longitude must be numbers" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );

    res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Returns all schools sorted by distance from the user's location
// /listSchools?latitude=28.61&longitude=77.20
app.get("/listSchools", async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Please provide latitude and longitude as query params" });
  }

  try {
    const [schools] = await db.query("SELECT * FROM schools");

    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance_km: getDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        school.latitude,
        school.longitude
      ),
    }));

    schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    res.json(schoolsWithDistance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});