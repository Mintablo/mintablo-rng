export interface RandomNumberGenerator {
  next: () => number;
  nextFloat: (min: number, max: number) => number;
  nextInt: (min: number, max: number) => number;
}

export { default as Xoshiro256starstar } from "./Xoshiro256starstar";
export { default as FisherYatesShuffle } from "./FisherYates";
