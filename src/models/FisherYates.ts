/**
 * Fisher-Yates unbiased shuffle algorithm (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
 */

import { RandomNumberGenerator } from "./index";

const fisherYatesShuffle = <T>(collection: T[], rng: RandomNumberGenerator): T[] => {
  const shuffled = [...collection];
  let currentIndex = shuffled.length;
  let temporaryValue: T;
  let randomIndex: number;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(rng.nextFloat(0, 1) * currentIndex);
    currentIndex -= 1;
    temporaryValue = shuffled[currentIndex];
    shuffled[currentIndex] = shuffled[randomIndex];
    shuffled[randomIndex] = temporaryValue;
  }

  return shuffled;
};

export default fisherYatesShuffle;
