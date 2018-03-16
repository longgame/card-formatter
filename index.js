const _ = require("underscore")
const path = require("path")
const fs = require("fs")
const jsonfile = require("jsonfile")


const CARDS_PATH = "/Users/andre/vbshare/cards"

const actions = {
  "seen": {
    "url": null,
    "modelType": null,
    "fields": null
  },
  "swiped": {
    "url": null,
    "modelType": null,
    "fields": null
  },
  "tapped": {
    "url": "some link/url",
    "modelType": "SocialGame",
    "fields": [
      "id"
    ]
  }
}

const makeName = (value) => {
  value = value.replace("'", "").replace("(", "").replace(")", "").replace("$", "").replace("/", "")
  const words = value.split(" ")
  let name = ""
  for (const word of words) {
    if (word === "") {
      continue
    }

    let letters = word.split("")
    const firstLetter = letters[0]
    letters.splice(0, 1)
    name += firstLetter.toUpperCase() + letters.join("")
  }

  return name
}

const formatCards = () => {
  const files = fs.readdirSync(CARDS_PATH)
  for (const file of files) {
    if (file.indexOf(".json") === -1) {
      continue
    }

    console.log(file)
    const filePath = path.join(CARDS_PATH, file)
    const fileData = fs.readFileSync(filePath)
    const card = JSON.parse(fileData)
    card.name = makeName(card.name)
    card.type = makeName(card.type)
    card.actions = actions
    delete card.uiFields.link

    jsonfile.writeFileSync(filePath, card, { spaces: 2 })
  }
}

const checkJson = () => {
  const files = fs.readdirSync(CARDS_PATH)
  for (const file of files) {
    if (file.indexOf(".json") === -1) {
      continue
    }

    const filePath = path.join(CARDS_PATH, file)
    const fileData = fs.readFileSync(filePath)
    try {
      JSON.parse(fileData)
    } catch (error) {
      console.log("File:", file, "is not in json format")
    }
  }
}

const run = () => {
   checkJson()
}

run()
