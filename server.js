// Dependencies 
const express = require("express");
const fs = require("fs");
const path = require("path");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get HTML Routes

app.get('/', (_, res) => {
    res.sendfile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (_, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Get API Routes

let saveNote = fs.readFileSync("./db/db.json", "utf8");

let noteArr = JSON.parse(saveNote);

app.get("/api/notes", (_, res) => {
    return res.json(noteArr);
});

app.get("/api/notes/:note", (req, res) => {
    const singleNote = req.params.note;

    // loop through the array
    for (var i = 0; i < noteArr.length; i++) {
        if (singleNote === noteArr[i].title) {
            return res.json(noteArr[i]);
        }
    }

    return res.json(false);

});

// POST Route

const id = () => {
    return Math.floor(Math.random() * 2);
}

// Create New Note 
app.post("/api/notes", function (req, res) {

    const data = fs.readFileSync("./db/db.json", "utf8");

    noteArr = JSON.parse(data);

    let newNote = {
        id: id(),
        title: req.body.title,
        text: req.body.text
    }

    console.log(newNote)

    noteArr.push(newNote);
    const noteJSON = JSON.stringify(noteArr);

    fs.writeFile("./db/db.json", noteJSON, "utf8", err => {
        if (err) {
            throw err;
        }
        res.json(newNote);
    });

});

// DELETE Route

app.delete("/api/notes/:id", (req, res) => {

    const deletedNote = req.params.id;

    noteArr = noteArr.filter((note) => {
        return note.id != deletedNote;
    });

    console.log(noteArr)
    const deletedNotes = JSON.stringify(noteArr);

    fs.writeFileSync("./db/db.json", deletedNotes, "utf8", err => {
        if (err) throw err;
    });

    res.json(deletedNotes);

});

// Starts the server to begin listening on the port
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`)
});