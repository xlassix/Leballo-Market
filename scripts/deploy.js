const hre = require("hardhat");

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("MusicMarket");
  const musicMarket = await NFTMarket.deploy();

  await musicMarket.deployed();

  console.log("MusicMarket deployed to:", musicMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(musicMarket.address);

  await nft.deployed();

  console.log("NFT deployed to:", nft.address);

  const auctionFactory = await hre.ethers.getContractFactory("AuctionFactory");
  const auction = await auctionFactory.deploy(musicMarket.address,nft.address);

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
