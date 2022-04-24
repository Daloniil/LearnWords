export const shuffle = (arr: any) => {
  return arr.sort(() => Math.round(Math.random() * 100) - 50);
};
