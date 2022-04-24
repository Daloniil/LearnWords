export const findLongestWord = (input: string) => {
  return input.split(/\W+/).reduce(function (longest, word) {
    return word.length > longest.length ? word : longest;
  }, "");
};
