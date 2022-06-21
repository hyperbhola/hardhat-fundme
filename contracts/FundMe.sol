// SPDX-License-Identifier : MIT

pragma solidity ^0.8.8;

import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;
    address public owner;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    uint256 public miniUSD = 50;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fundMe() public payable {
        require(
            (msg.value.getConversionRate(priceFeed)) >= miniUSD,
            "Not enough Amount"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            addressToAmountFunded[funders[funderIndex]] = 0;
        }

        funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Failed");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Failed");
        _;
    }
}
