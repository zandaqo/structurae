function searchNaive(text, word, start) {
  const wordLength = word.length;
  const max = text.length - wordLength;
  outer: for (let i = start; i <= max; i++) {
    for (let j = 0; j < wordLength; j++) {
      if (text[i + j] !== word[j]) {
        continue outer;
      }
    }
    return i;
  }
  return -1;
}

function searchShiftOr(text, word, start, masks) {
  const m = word.length;
  const m1 = 1 << m;
  masks.fill(-1);
  let r = -2;
  for (let i = 0; i < m; i++) {
    masks[word[i]] &= ~(1 << i);
  }
  for (let i = start; i < text.length; i++) {
    r |= masks[text[i]];
    r <<= 1;
    if ((r & m1) === 0) {
      return (i - m) + 1;
    }
  }
  return -1;
}

module.exports = {
  searchNaive,
  searchShiftOr,
};
