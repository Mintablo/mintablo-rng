import { argv } from "yargs";

import { sha512, generateServerSeed, combine } from "./util";
import { Xoshiro256starstar } from "./models";

const user = {
  serverSeed: generateServerSeed(),
  nonce: 0,
};

const count = (argv.count as number) || 10000000;
const clientseed = (argv.clientseed as string) || "abcdef";

process.stdout.write("#==================================================================\n");
process.stdout.write(`# Xoshiro256**\n`);
process.stdout.write("#==================================================================\n");
process.stdout.write(`type: d\n`);
process.stdout.write(`count: ${count}\n`);
process.stdout.write(`numbit: ${32}\n`);

for (let i = 0; i < count; i++) {
  const rng = new Xoshiro256starstar(sha512(combine(user.serverSeed, clientseed, user.nonce)), user.serverSeed);
  let num = "";
  num = (rng.next() + 2147483648).toString();
  num = "          ".slice(0, 10 - num.length) + num;
  process.stdout.write(num + "\n");
  user.serverSeed = generateServerSeed();
  user.nonce = user.nonce + 1;
}
