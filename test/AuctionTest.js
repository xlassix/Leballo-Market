const { expect } = require("chai");

describe("Auction Test", async function () {
  it("Create Artist", async function () {
    const _market = await ethers.getContractFactory("MusicMarket");
    const market = await _market.deploy();
    await market.deployed();
    const marketplaceAddress = market.address;

    const _nft = await ethers.getContractFactory("NFT");
    const nft = await _nft.deploy(marketplaceAddress);
    await nft.deployed();
    const nftMarketAddress = nft.address;

    const _auction = await ethers.getContractFactory("AuctionFactory");
    const auction = await _auction.deploy(marketplaceAddress,nftMarketAddress);
    await auction.deployed();
    const auctionAddress = auction.address;


    
  })
})