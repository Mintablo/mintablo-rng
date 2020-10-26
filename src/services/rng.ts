import { Xoshiro256starstar } from "../models";

export type GenerateResponse = {
  draws: number[][];
};

const generate = (
  userHash: string,
  serverSeed: string,
  range: { start: number; end: number },
  selection = 1,
  draws = 1,
  replacements = false,
): GenerateResponse => {
  const response: {
    draws: number[][];
  } = { draws: [] };
  const rand = new Xoshiro256starstar(userHash, serverSeed);
  if (!replacements && range.end - range.start + 1 < selection) {
    throw new RangeError(`range too small for desired selection size`);
  }
  for (let i = 0; i < draws; i++) {
    let sel: number[] = [];
    for (let y = 0; y < selection; y++) {
      let next: number;
      if (!replacements) {
        do {
          next = rand.nextInt(range.start, range.end);
        } while (sel.includes(next));
      } else {
        next = rand.nextInt(range.start, range.end);
      }
      sel = [...sel, next];
    }
    response.draws = [...response.draws, sel];
  }
  return response;
};

export default { generate };
