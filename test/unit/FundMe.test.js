const { inputToConfig } = require("@ethereum-waffle/compiler");
const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", async function () {
  let fundMe;
  let deployer;
  let mockV3Aggregator;
  const sendValue = 100000000000000;

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;

    await deployments.fixture(["all"]);

    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", async function () {
    it("sets aggregator address ", async function () {
      const response = await fundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });
  describe("fund", async function () {
    it("Fails if u dont send enough eth", async function () {
      await expect(fundMe.fundMe()).to.be.reverted;
    });
    it("updated the amount funded DS", async function () {
      await fundMe.fundMe({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });
    it("Add funders to funder array ", async function () {
      await fundMe.fundMe({ value: sendValue });
      const funder = await fundMe.funders(0);
      assert.equal(funder, deployer);
    });
  });

  describe("withdraw", async function () {
    beforeEach(async function () {
      await fundMe.fundMe({ value: sendValue });
    });
    it("Withdraw eth from a single funder", async function () {
      const startFundBalance = await fundMe.provider.getBalance(fundMe.address);
      const startDeployerBalance = await fundMe.provider.getBalance(deployer);

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endFundBalance = await fundMe.provider.getBalance(fundMe.address);
      const endDeployerBalance = await fundMe.provider.getBalance(deployer);

      assert.equal(endFundBalance, 0);
      assert.equal(
        startFundBalance.add(startDeployerBalance),
        endDeployerBalance.add(gasCost).toString()
      );
    });
  });
});
