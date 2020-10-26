import { argv } from "yargs";

import { sha512, generateServerSeed, combine } from "./util";
import { rng } from "./services";

const user = {
  serverSeed: generateServerSeed(),
  clientSeed: "abcdefghijklmnopqrstuvwxyz",
  nonce: 0,
};

const rangestart = parseInt(argv.rangestart as string, 10) || 0;
const rangeend = parseInt(argv.rangeend as string, 10) || 4294967295;
const selections = parseInt(argv.selections as string, 10) || 1;
const draws = parseInt(argv.draws as string, 10) || 1;
const replacements = !!argv.replacements;

const result = rng.generate(
  sha512(combine(user.serverSeed, user.clientSeed, user.nonce)),
  user.serverSeed,
  { start: rangestart, end: rangeend },
  selections,
  draws,
  replacements,
);

result.draws.forEach((draw) => {
  draw.forEach((rn) => {
    process.stdout.write(rn.toString() + " ");
  });
  process.stdout.write("\n");
});
