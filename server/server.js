const express = require("express");
const app = express();
const fs = require('fs');
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.use(express.json());
const DATA_FILE = "data/data.json"

// Helper function to read and write JSON file
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            throw error;
        }
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/api/dogs', (req, res) => {
    const data = readData();
    res.json(data.dogs);
});

app.post('/api/dogs', (req, res) => {
    const newDog = req.body;
    if (!newDog.name || !newDog.breed) {
        return res.status(400).json({ error: 'Name and breed are required.' });
    }
    const dogs = "dogs";
    const data = readData();
    newDog.id = data[dogs].length > 0 ? data[dogs][data[dogs].length - 1].id + 1 : 1;
    data[dogs].push(newDog);
    writeData(data);
    res.status(201).json(newDog);
});

app.patch('/api/dogs/:id', (req, res) => {
    const { id } = req.params;
    const partialUpdate = req.body;
    const data = readData();
    const dogs = "dogs";
    const index = data[dogs].findIndex((dog) => dog.id == id);
    if (index === -1) {
        return res.status(404).json({ error: 'Dog not found.' });
    }

    const { id: resId, ...datatoUpdate } = partialUpdate || {};
    data[dogs][index] = { ...data[dogs][index], ...datatoUpdate };
    writeData(data);

    res.json(data[dogs][index]);
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
