const express = require("express");
const app = express();
const fs = require('fs');
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

app.get('/api/dogs/:id', (req, res) => {
    const { id } = req.params;
    const data = readData().dogs;
    if (data != null && data.length > 0) {
        const index = data.findIndex((dog) => dog.id == id);
        if (index === -1) {
            return res.status(404).json({ error: 'Dog not found.' });
        }
        res.json(data[index]);
    }
    res.json({ error: "No Data found" });
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

app.get("/api/approvals/:id", (req, res) => {
    const { id: userId } = req.params;
    let data = readData();
    let user = data.users.find((item) => item.id == userId);
    console.log(user);
    if (user) {
        if (user.isAdmin) {
            let dogIds = data.dogs.filter((dog) => dog.shelter == user.shelter).map((dog) => dog.id);
            let approvals = data.approvals.filter((approval) => dogIds.includes(approval.dogId)).map((approval) => {
                approval.dog = data.dogs.find((dog) => dog.id == approval.dogId)
                delete approval["dogId"];
                return approval;
            });
            res.json(approvals);
        }
        else {
            let approvals = data.approvals.filter((approval) => approval.userId == userId).map((approval) => {
                approval.dog = data.dogs.find((dog) => dog.id == approval.dogId)
                delete approval["dogId"];
                return approval;
            });
            res.json(approvals);
        }
    }
    res.status(404).json({ error: "User Not found" })
});

app.post("/api/approvals", (req, res) => {
    const { id, dogId } = req.body;
    let data = readData();
    let approval = { userId: id, dogId, status: false };

    data.approvals.push(approval);
    writeData(data);
    res.json(approval);
});

app.patch("/api/approvals/:id", (req, res) => {
    const { id } = req.params;
    const { dogId, userId, status } = req.body;
    let data = readData();

    let user = data.users.find((item) => item.id == id);
    if (user) {
        if (user.isAdmin) {
            let index = data.approvals.findIndex((approval) => approval.userId == userId && approval.dogId == dogId);
            data.approvals[index] = { ...data.approvals[index], status };
            writeData(data);
            res.json(data);
        }
    }
    res.status(404).json({ error: "user Not found" })

});

app.post('/api/signin', (req, res) => {
    const { username, password } = req.body;
    let data = readData();
    let filteredUser = data.users.find((user) =>
        user.name == username && user.password == password
    );

    if (filteredUser) {
        const { password: pass, shelter, ...datatoUpdate } = filteredUser;
        if (datatoUpdate.isAdmin) {
            res.status(200).json({ ...datatoUpdate, shelter });
        }
        res.status(200).json(datatoUpdate);
    }
    res.status(404).json({ error: "username or password" });
});

app.listen(5000, () => {
    console.log("Server started on port 8080");
});
