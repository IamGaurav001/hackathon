import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

let teaData = [];
let nextId = 1;

// Create a new tea entry
app.post("/teas", (req, res) => { 
    const { name, price } = req.body;

    const newTea = {
        id: nextId++,
        name,
        price
    };

    teaData.push(newTea);
    res.status(201).send(newTea);
});

// Get all teas
app.get("/teas", (req, res) => { 
    res.status(200).send(teaData);
});

// Get a tea by ID
app.get("/teas/:id", (req, res) => { 
    const id = parseInt(req.params.id);
    const tea = teaData.find(t => t.id === id);

    if (tea) {
        res.status(200).send(tea);
    } else {
        res.status(404).send({ message: "Tea not found" });
    }
});

// Update a tea by ID
app.put("/teas/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    const tea = teaData.find(t => t.id === id);

    if (tea) {
        tea.name = name || tea.name;
        tea.price = price || tea.price;
        res.status(200).send(tea);
    } else {
        res.status(404).send({ message: "Tea not found" });
    }
});

// Delete a tea by ID
app.delete("/teas/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = teaData.findIndex(t => t.id === id);

    if (index !== -1) {
        teaData.splice(index, 1);
        res.status(200).send({ message: "Tea deleted" });
    } else {
        res.status(404).send({ message: "Tea not found" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
