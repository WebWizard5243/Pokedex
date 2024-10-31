import express from "express";
import axios from "axios";
import bodyparser from "body-parser";

const app = express();
const port = 3000;
const pokeList = [];

app.use(express.static("public"));

async function fetchPokemonData(pokeName){ 
    try {
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
        const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokeName }`);
        const evolution = await axios.get(species.data.evolution_chain.url);
        return { 
            pokemon : pokemonResponse.data,
            evolution : evolution.data,
        }
    }
    catch(error){
        throw error;
    }
}

app.get("/",(req,res) => {
    res.render("index.ejs", {
     });
});
app.use(bodyparser.urlencoded({extended : true})); 

app.get("/info", async(req,res) => {
    try{
     var pokeName = req.query["pname"];
     if(pokeList.length > 0){
        for(let i=0;i<pokeList.length;i++){
        pokeList.pop();
        }
     }
        pokeList.push(pokeName);
     const pokemonDetails = await fetchPokemonData(pokeName);
    res.render("index.ejs",{
        content : pokemonDetails.pokemon,
        evolution : pokemonDetails.evolution,
    });
    }
  
    catch(error){
        console.error("Failed to Fetch Pokemon Data",error.message);
        res.render("index.ejs", { error : error.message})
    }
});
app.post("/abilityInfo",async(req,res) => {
    try {
        const name = req.body["abilityName"];
        const abilityName = name.slice(0,1).toLowerCase() + name.slice(1,name.length);
        const result = await axios.get(`https://pokeapi.co/api/v2/ability/${abilityName}`);
        res.render("ability.ejs", { ability : result.data});
    }
    catch(error){
        console.error("error 1",console.message);
    }
});

app.post("/red",async(req,res) => {
    try {
    const redirect = await fetchPokemonData(pokeList[0]);
    res.render("index.ejs", {
        content : redirect.pokemon,
        evolution : redirect.evolution,

    });
    }
    catch(error){
        console.error(error.message);
    }  
});

app.get("/evolutionInfo", async(req,res) => {
    try {
        
        const name = req.query["Kname"];
        const evolveName = name.slice(0,1).toLowerCase() + name.slice(1,name.length);
        if(pokeList.length > 0){
            for(let i=0;i<pokeList.length;i++){
            pokeList.pop();
            }
         }
            pokeList.push(evolveName);
        const evolutionDetails = await fetchPokemonData(evolveName);
        res.render("index.ejs", { 
            content : evolutionDetails.pokemon,
            evolution : evolutionDetails.evolution,
        });
    }
    catch(error){
        console.error("error 2",error.message);
    }
});
app.listen(port, () => {
    console.log(`the server is running on ${port}`); 
});
