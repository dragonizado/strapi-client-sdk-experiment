function pluralize(word: string, count: number): string {
  if (count === 1) {
    return word;
  }
  if (count === 0) {
    return word + "s";
  }

  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
    return word + "es";
  }
  if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word[word.length - 2])) {
    return word.slice(0, -1) + "ies";
  }
  if (word.endsWith('f')) {
    return word.slice(0, -1) + "ves";
  }
  if (word.endsWith('fe')) {
    return word.slice(0, -2) + "ves";
  }

  const irregulars: { [key: string]: string } = {
    'man': 'men',
    'woman': 'women',
    'child': 'children',
    'tooth': 'teeth',
    'foot': 'feet',
    'mouse': 'mice',
    'person': 'people',
    'goose': 'geese',
    'sheep': 'sheep',
    'fish': 'fish',
    'deer': 'deer',
    'leaf': 'leaves'
  };

  const lowerWord = word.toLowerCase();
  if (irregulars[lowerWord]) {
    if (word[0] === word[0].toUpperCase()) {
      return irregulars[lowerWord].charAt(0).toUpperCase() + irregulars[lowerWord].slice(1);
    }
    return irregulars[lowerWord];
  }
  return word + "s";
}
export default pluralize;