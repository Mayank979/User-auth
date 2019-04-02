var generateMessage = (from, text) => {
  return {
    from: from,
    text: text
  }
}

module.exports = {generateMessage};
