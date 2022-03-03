const hre = require("hardhat");

async function main() {

  const auctionFactory = await hre.ethers.getContractFactory("AuctionFactory");
  const auction = await auctionFactory.deploy("0x83F786567603232CD10cdb07727Fe1FBB191A9bB","0x3fe15571157BAD780dF7C9d1Cc74aE7a4e295412");

  await auction.deployed();

  console.log("Auction deployed to:", auction.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
