const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs-extra")
const bodyParser = require("body-parser")

const app = express()
app.use(cors())
app.use(bodyParser.json())

// I need to decide what is going to be stored here on the backend, and what's going to be sent this direction.
/*
  I won't be needing to save any data, at least not for now. We can keep from using MongoDB. This will limit us to static data stored on the server and the information sent to us.

  Client side will send a JSON string detailing what choices were given for each entity type, and we will parse that data and send back a copy of the original loot table folder, added to and modified based on the JSON given us.

  I can find within the files the vanilla data, and I can copy the thing in nearly its entirety and store it here.

  For now, we will focus solely on the block entities. Functionally, very little should change between the three, but this will allow us to focus in and ignore everything else at first.

  The user will send a request with JSON attached to it. That JSON is going to have an array of block names that were chosen to be a part of the randomizer. example:

    {
      "blocks": [],
      "items": [],
      etc...
    }

  Ours will only have blocks in it for now.

  The randomization will be something like organized chaos each server JSON file associated with each chosen block will be opened and its value stored in an oldBlocks array, that value's "pools" attribute will be copied and appended to a newPools array, and the file will be closed. After being repeated with each block, the newPools array will be shuffled. Finally, each oldBlocks value will have its "pools" attribute replaced with the corresponding newPools array index, each associated file will be written over using the oldPools index data, and then closed again.

  In order for the 

  Let's back up a bit, though, to what's being stored on this server.
  I think all we'll need for this project is the loot_tables folder (well, the data folder, but it only contains loot tables). Other apps might need more folders, but I can modify as necessary. Adding the other folders shouldn't change the way this app works. I might instead want an empty version of the blocks folder in loot tables, so that I can instead write the new pools to a blank folder.  

  Using fs-extra as fs, I can copy the files of dataEmpty into a new folder called "data", write to "data/minecraft/loot_tables" for the functions above, zip data, send or download it to the user, and then delete data.

  I'll need a function that takes in a file name as a parameter and returns its 

  Let's start prewriting the process:

    The user sends a request with block names in a JSON string.
    Check if the block names array is empty, and send a rejection if so.
    Find the associated files with findJSONFiles() and store the result in an array named "files".
    Copy dataEmpty with fs-extra, and name the destination "data".





*/

const BLOCKS_DIRECTORY_PATH = './src/dataLootTables/minecraft/loot_tables/blocks' // the path to the directory where the files are stored

// Find the names of the .json files that are associated with the JSON sent by client. Returns an array.
const findJSONFiles = (files, BLOCKS_DIRECTORY_PATH, callback) => { 

  // Reads the directory, and stores the names in dirFiles.
  fs.readdir(BLOCKS_DIRECTORY_PATH, function(err, dirFiles) {
    if (err) {
      console.log(err)
      return
    }
    
    // Filters the dirFiles array to return only what is in both dirFiles and files, and adds .json to the end of it.
    matchingFiles = dirFiles.filter(function(file) {
      const basename = path.basename(file, '.json') // get the filename without the extension
      return files.indexOf(basename) !== -1 && file.endsWith('.json')
    })

    // Essentially the way react does child to parent data transferring.
    callback(matchingFiles)

  })
}

// Deletes a directory asynchronously.
async function deleteDirectory(path) {
  await fs.remove(path);
}

// HTTP

app.get("/", (req, res) => {

  console.log("viewed!")
  res.sendStatus(200)

})

app.post("/api/blocks", (req, res) => {

  console.log("Received.")
  const files = req.body.data.blocks
  let matchingFiles = []

  // Finds the JSON files that associate with the blocks given to us.
  findJSONFiles(files, BLOCKS_DIRECTORY_PATH, function(matchingFiles) {
    filesToMatch = matchingFiles // set the filesToMatch variable to the matching files
    console.log(filesToMatch)
  })
  
  // Copy directory "source" to "destination" asynchronously
  fs.copy('./src/dataEmpty', './src/data', err => {
    if (err) return console.error(err)
    console.log('success!')
  })

  // Deletes "data" to begin anew.
  // deleteDirectory('./src/data')

  res.sendStatus(200)

})

app.listen(3000)