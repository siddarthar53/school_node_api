const db = require('../config/db');

// Haversine distance function
function getDistance(lat1, lon1, lat2, lon2) {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    const query = 'INSERT INTO school_table (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: "School added successfully" });
    });
};

exports.listSchools = (req, res) => {
    const { lat, lng } = req.query;
    if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ message: "Invalid coordinates" });
    }

    db.query('SELECT * FROM school_table', (err, results) => {
        if (err) return res.status(500).json({ message: err.message });

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        const sorted = results.map(school => ({
            ...school,
            distance: getDistance(userLat, userLng, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.json(sorted);
    });
};
