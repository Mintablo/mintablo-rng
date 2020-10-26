# GLI-19 certified  Random Number Generator



## output to txt file for GLI

- `env NODE_ENV=production yarn build`
- `node ./dist/gliOutput.js --rangestart 1 --rangeend 52 --selections 52 --draws 100 > gli.txt`

The additional parameter `--replacements` allows for numbers to be repeated within selections.

> rangestart and rangeend are inclusive

## output to txt file for usage with dieharder

- `env NODE_ENV=production yarn build`
- `node ./dist/dieharderInputFile.js --clientseed abcdef --count 10000000 > xoshiro256.txt`

  This creates a file `xoshiro256.txt` with 10.000.000 values generated with the xoshiro256\*\* algorithm.

  It can be used with the [dieharder](https://webhome.phy.duke.edu/~rgb/General/dieharder.php) test suite: `dieharder -g 202 -f xoshiro256.txt -a`

  Dieharder can be installed via homebrew: `brew install dieharder`
