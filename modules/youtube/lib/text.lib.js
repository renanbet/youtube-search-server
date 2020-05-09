const removeChars = (text) => {
  text = text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ' ')
  text = text.replace(/[0-9]/g, ' ').replace(/[^a-zA-Z+]/g, ' ');
  text = text.replace(/\'|\"|!|@|#|\$|%|&|\*|\(|\)|{|}|\[|\]|\?|:|;|>|<|,|\.|\||\\|\/|=|_|ª|º|°/g, ' ');
  text = text.replace(/(\r\n|\n|\r|\t)/gm, ' ')

  return text.trim()
}

const counter = (text) => {
  let arr = {}
  text = removeChars(text)
  let split = text.split(' ')

  for (let i = 0; i < split.length; i++) {
    let word = split[i]

    if (!word || word.length < 3)
      continue
    arr[word] = isNaN(arr[word]) ? 1 : arr[word] + 1
  }

  return arr
}

module.exports = {
  counter,
  removeChars
} 