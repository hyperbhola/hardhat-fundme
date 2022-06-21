const networkConfig = {
  31337: {
    name: "localhost",
  },
  4: {
    name: "rinkeby",
    ethUSDPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
};

const developmentChain = ["hardhat", "localhost"];

const DECIMALS = 8;
const INITIAL_ANSWER = 200000000;

module.exports = {
  networkConfig,
  developmentChain,
  DECIMALS,
  INITIAL_ANSWER,
};
