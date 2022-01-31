const { expect } = require("chai");

describe("Nft market", async function () {
  it("Should create and execute sales", async function () {
    const _market = await ethers.getContractFactory("NFTMarket");
    const market = await _market.deploy();
    await market.deployed()
    const marketplaceAddress = market.address;


    const _nft = await ethers.getContractFactory("NFT");
    const nft = await _nft.deploy(marketplaceAddress);
    await nft.deployed()
    const nftMarketAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    let token1 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
    );
    let token2 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png"
    );
    let tx1=await token1.wait()
    let tx2=await token2.wait()

    let tokenId1 =tx1.events[0].args[2].toNumber()
    let tokenId2 =tx2.events[0].args[2].toNumber()


    const auction_price = ethers.utils.parseUnits("100", "ether");


    await market.createMarketItem(nftMarketAddress, tokenId1, auction_price, {
      value: listingPrice,
    });

    await market.createMarketItem(nftMarketAddress, tokenId2, auction_price, {
      value: listingPrice,
    });

    const items= await market.getMarketItems();

    console.debug( await Promise.all(items.map(async i=>{
      const tokenURI = await nft.tokenURI(i.tokenId)
      return {
        tokenURI,
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
      }
    })))

    const [_, buyerAddress]=await ethers.getSigners();

    await market.connect(buyerAddress).creatMarketItemSale(nftMarketAddress,1,{value:auction_price});

    console.debug( await Promise.all((await market.getMarketItems()).map(async i=>{
      const tokenURI = await nft.tokenURI(i.tokenId)
      return {
        tokenURI,
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
      }
    })))

  });
});
