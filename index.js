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

const getCards = () => {
  const cards = []
  const files = fs.readdirSync(CARDS_PATH)
  for (const file of files) {
    if (file.indexOf(".json") === -1) {
      continue
    }

    const filePath = path.join(CARDS_PATH, file)
    cards.push({
      card: jsonfile.readFileSync(filePath),
      path: filePath
    })
  }

  return cards
}

const formatCards = () => {
  const cards = getCards()
  for (const card of cards) {
    card.card.name = makeName(card.card.name)
    card.card.type = makeName(card.card.type)
    card.card.actions = actions
    delete card.card.uiFields.link

    jsonfile.writeFileSync(filePath, card.card, { spaces: 2 })
  }
}

const addMetaDataSource = () => {
  const cards = getCards()
  for (const condition of [ "start", "stop" ]) {
    for (const card of cards) {
      console.log("card:", card.card.name)
      if (!!card.card.conditions[condition].query && !!card.card.conditions[condition].query.metaData) {
        const metaData = card.card.conditions[condition].query.metaData
        for (const key in metaData) {
          metaData[key] = {
            type: metaData[key].type,
            source: "internal",
            value: metaData[key].value
          }
        }

        jsonfile.writeFileSync(card.path, card.card, { spaces: 2 })
      }
    }
  }
}

const replaceImages = (category, subcategory) => {
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

const convertUIData = () => {
  const cards = getCards()
  for (const card of cards) {
    const uiData = card.card.uiData
    let queries = []
    for (const d in uiData) {
      if (uiData[d].queries.length > 0) {
        queries = queries.concat(uiData[d].queries)
      }
    }

    delete card.card.uiData
    card.card.uiQueries = queries
    jsonfile.writeFileSync(card.path, card.card, { spaces: 2 })
  }
}

convertUIData()
