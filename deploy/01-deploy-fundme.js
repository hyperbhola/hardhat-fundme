const { network } = require("hardhat");

const networkConfig = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let priceFeedAddress;
  if (networkConfig.developmentChain.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    priceFeedAddress = ethUsdAggregator.address;
    console.log(priceFeedAddress);
  } else {
    priceFeedAddress = networkConfig.networkConfig[chainId]["ethUSDPriceFeed"];
  }
  //let args = [ethUsdPriceFeedAddress];
  console.log(priceFeedAddress);
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [priceFeedAddress],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("---------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
