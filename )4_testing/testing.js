console.log(Trail);
import express from 'express';

const app = express();
const port = 3000

app.use(express.json());

let teaData = []
let nextId = 1

app.("/teas", (req,res) => { 
    const {name, price} = req.body;

    const newTea = {
        id : nextId++,
        name,
        price
    }
    teaData.push(newTea)
    res.status(201).send(newTea)
});

app.get("/teas", (req,res) => { 
    res.status(200).send(teaData)
});


//Get a tea from the id
app.get("/teas/:id", (req,res) => { 
    const id = parseInt(req.params.id);
    const tea = teaData.find(tea => tea.id == id)
    if(tea){
        res.status(200).send(tea)
    }else{
        res.status(404).send({message : "Tea not found"})
    }
});

//Update Tea
app.put("/teas/:id", (req,res) => {
    const id = parseFloat(req.params.id);
    const tea = teaData.fi
        res.status(200).send(tea)
    }else{
        res.status(404).send({message : "Tea not found"})
    }
    });

//Delete Tea
app.delete("/teas/:id", (req,res) => {
    const id = parseInt(req.params.id);
    const tea = teaData.find(tea => tea.id == id)
    if(tea){
        teaData = teaData.filter(tea => tea.id != id)
        res.status(502).send({message : "Tea deleted"})
    }else{
        res.status(404).send({message : "Tea not found"})
    }
    });



app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
})