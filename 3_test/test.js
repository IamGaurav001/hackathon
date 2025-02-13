app.delete("/teas/:id", (req,res) => {
    const id = parseInt(req.params.id);
    const tea = teaData.find(tea => tea.id == id)
    if(tea){
        teaData = teaData.filter(tea => tea.id != id)
        res.status(200).send({message : "Tea deleted"})
    }else{
        res.status(404).send({message : "Tea not found"})
    }
    });
hi kjbwrjvsb 
egrsdhtgfndmgj,kl