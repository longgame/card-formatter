const _ = require("underscore")
const path = require("path")
const fs = require("fs")
const jsonfile = require("jsonfile")


const CARDS_PATH = "/Users/andre/vbshare/cards"

const actions = {
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
    card.uiFields.imageUrl = replaceImages(card.category, card.subcategory)

    jsonfile.writeFileSync(filePath, card, { spaces: 2 })
  }
}

const replaceImages = (category, subcategory) {
  let imageUrl
  if (category === 'longgame') {
    switch (subcategory) {
      case 'missions':
        imageUrl = 'https://s3.amazonaws.com/static.longgame.co/img/appImages/CardImages/ctaicon_longgame_jarsmissions%403x.png'
        break
      case 'account':
        imageUrl = 'https://s3.amazonaws.com/static.longgame.co/img/appImages/CardImages/ctaicon_longgame_account%403x.png'
        break
      case 'social':
        imageUrl = 'https://s3.amazonaws.com/static.longgame.co/img/appImages/CardImages/ctaicon_longgame_social%403x.png'
        break
      case 'rewards':
        imageUrl = 'https://s3.amazonaws.com/static.longgame.co/img/appImages/CardImages/ctaicon_longgame_rewards%403x.png'
        break
    }
  } else if (category === 'RWFP') {
    imageUrl = 'https://s3.amazonaws.com/static.longgame.co/img/appImages/CardImages/ctaicon_rwfp_financial%403x.png'
  } else if (category === 'minigames') {
    switch (subcategory) {
      case 'games':
        imageUrl = 'https://s3.amazonaws.com/static.longgame.co/img/appImages/CardImages/ctaicon_minigames_games%403x.png'
        break
      case 'coins':
        imageUrl = 'https://s3.amazonaws.com/static.longgame.co/img/appImages/CardImages/ctaicon_minigames_coins%403x.png'
        break
      case 'socialgames':
        imageUrl = ''
        break
    }
  } else {
    // Default to longgame account
    imageUrl = 'https://s3.amazonaws.com/static.longgame.co/img/appImages/CardImages/ctaicon_longgame_account%403x.png'
  }
  return imageUrl
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
