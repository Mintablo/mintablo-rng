import { Xoshiro256starstar, FisherYatesShuffle } from "../models";

const shuffle = <T>(userHash: string, serverSeed: string, collection: T[]): T[] => {
  const rand = new Xoshiro256starstar(userHash, serverSeed);
  return FisherYatesShuffle(collection, rand);
};

export default { shuffle };
