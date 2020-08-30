const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs")
const app = express()
const path = require('path');
let PORT = process.env.PORT || 3000




app.use(express.static("public"))
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

let notes = require('./db/db');





app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
  
  app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
  });

  
  
  
  app.get('/api/notes', function (req, res) {
    return res.json(notes);
  });
  
  
  app.get('/api/notes/:note', function (req, res) {
    let chosen = req.params.note;
  
    for (let i = 0; i < notes.length; i++) {
      if (chosen === notes[i].id) {
        return res.json(notes[i]);
      }
    }
  
    return res.json(false);
  });
  

  app.post('/api/notes', function (req, res) {


    fs.readFile("./db/db.json", "utf8", function(error, data) {

      if (error) {
        return console.log(error);
      }

      let tempArray = JSON.parse(data)

      let newNote = req.body;

      newNote.id = newNote.title.replace(/\s+/g, '').toLowerCase();

      notes.push(newNote)
  
    
      tempArray.push(newNote);

      newArray = JSON.stringify(tempArray)

      fs.writeFile ("./db/db.json", newArray, "utf8", function(err){
        if (err){
          throw err;
        }
      })

      res.json(false);
    
    })
    
  });


  app.delete('/api/notes/:id', function (req, res) {

    fs.readFile("./db/db.json", "utf8", function(error, data) {

      if (error) {
        return console.log(error);
      }

      let tempArray = JSON.parse(data)

      const deletedNote = req.params.id;

      const index = notes.map(function(e) {return e.id; }).indexOf(deletedNote);

      tempArray.splice(index, 1)

      notes.splice(index, 1)

      

      newArray = JSON.stringify(tempArray)

      fs.writeFile ("./db/db.json", newArray, "utf8", function(err){
        if (err){
          throw err;
        }
      })

      for (let i = 0; i < notes.length; i++) {
      if (deletedNote === notes[i].id) {
        return res.json(notes[i]);

      }

    }
  
      res.json(true);
    
    })
  
});


  app.listen(PORT, function () {
    console.log(`App listening on PORT: ${PORT}`);
  });
  
  