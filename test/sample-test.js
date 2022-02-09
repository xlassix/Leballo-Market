const { expect } = require("chai");

describe("Nft market", async function () {
  it("Should create and execute sales", async function () {
    const _market = await ethers.getContractFactory("NFTMarket");
    const market = await _market.deploy();
    await market.deployed();
    const marketplaceAddress = market.address;

    const _nft = await ethers.getContractFactory("NFT");
    const nft = await _nft.deploy(marketplaceAddress);
    await nft.deployed();
    const nftMarketAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    let token1 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
    );
    let token2 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png"
    );
    let tx1 = await token1.wait();
    let tx2 = await token2.wait();

    let tokenId1 = tx1.events[0].args[2].toNumber();
    let tokenId2 = tx2.events[0].args[2].toNumber();
    // console.debug(tx2.events[0]['transactionHash'])
    const auction_price = ethers.utils.parseUnits("100", "ether");

    await market.createMarketItem(nftMarketAddress, tokenId1, auction_price, {
      value: listingPrice,
    });

    await market.createMarketItem(nftMarketAddress, tokenId2, auction_price, {
      value: listingPrice,
    });

    const items = await market.getMarketItems(20);

    // console.debug(
    //   await Promise.all(
    //     items.map(async (i) => {
    //       const tokenURI = await nft.tokenURI(i.tokenId);
    //       return {
    //         tokenURI,
    //         price: i.price.toString(),
    //         tokenId: i.tokenId.toString(),
    //         seller: i.seller,
    //         owner: i.owner,
    //       };
    //     })
    //   )
    // );

    const [_, buyerAddress] = await ethers.getSigners();
    await market
      .connect(buyerAddress)
      .createMarketItemSale(nftMarketAddress, 1, { value: auction_price });

    // console.debug("data",market)
    console.debug(
      await Promise.all(
        (
          await market.getMarketItems(20)
        ).map(async (i) => {
          const tokenURI = await nft.tokenURI(i.tokenId);
          return {
            tokenURI,
            price: i.price.toString(),
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
          };
        })
      )
    );
  });
  it("Should create and execute and list sales", async function () {
    const _market = await ethers.getContractFactory("NFTMarket");
    const market = await _market.deploy();
    await market.deployed();
    const marketplaceAddress = market.address;

    const _nft = await ethers.getContractFactory("NFT");
    const nft = await _nft.deploy(marketplaceAddress);
    await nft.deployed();
    const nftMarketAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    let token1 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
    );
    let token2 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png"
    );
    let tx1 = await token1.wait();
    let tx2 = await token2.wait();

    let tokenId1 = tx1.events[0].args[2].toNumber();
    let tokenId2 = tx2.events[0].args[2].toNumber();
    console.debug(tx2.events[0]["transactionHash"]);
    const auction_price = ethers.utils.parseUnits("100", "ether");

    await market.createMarketItem(nftMarketAddress, tokenId1, auction_price, {
      value: listingPrice,
    });

    await market.createMarketItem(nftMarketAddress, tokenId2, auction_price, {
      value: listingPrice,
    });

    const items = await market.getMarketItems(20);

    // console.debug(
    //   await Promise.all(
    //     items.map(async (i) => {
    //       const tokenURI = await nft.tokenURI(i.tokenId);
    //       return {
    //         tokenURI,
    //         price: i.price.toString(),
    //         tokenId: i.tokenId.toString(),
    //         seller: i.seller,
    //         owner: i.owner,
    //       };
    //     })
    //   )
    // );

    const [sellerAddress, buyerAddress] = await ethers.getSigners();

    console.debug({ buyer: buyerAddress.address });
    let data = await market
      .connect(buyerAddress)
      .createMarketItemSale(nftMarketAddress, 1, { value: auction_price });

    data = await data.wait();

    console.debug({ data: data });

    let test_func = async (i) => {
      console.debug(i.events[2]);
      let result = i.events[2].args;
      const tokenURI = await nft.tokenURI(result.tokenId.toString());
      console.debug({ dataz: tokenURI });
      return {
        tokenURI,
        contract: result.nftContract,
        price: result.price.toString(),
        tokenId: result.tokenId.toString(),
        seller: result.seller,
        owner: result.owner,
      };
    };
    let datax = await test_func(data);
    console.debug({ datax, buyer: buyerAddress.address, kk: datax.contract });

    console.debug({ nftMarketAddress, dddd: datax.tokenId });
    let dataxx = await nft.ownerOf(datax.tokenId);
    // dataxx = await dataxx.wait()

    console.debug({ knjkjb: dataxx, owner: buyerAddress.address == dataxx });

    // let xx= await nft.requestTransfer(buyerAddress.address,marketplaceAddress, datax.tokenId,{from:(buyerAddress.address).toString()});
    // let _mine=await xx.wait()

    // console.debug({_mine})

    // let bh= (await nft.ownerOf(datax.tokenId))
    // let dataxy=await nft.approve(marketplaceAddress, datax.tokenId);

    // console.debug(dataxy)

    data = await market
      .connect(buyerAddress)
      .listItem(nftMarketAddress, datax.tokenId, auction_price, {
        value: listingPrice,
      });
    tx = await data.wait();
    console.log({ data });
    data = await market
      .connect(sellerAddress)
      .BuyMarketItem(nftMarketAddress, datax.tokenId,{value:auction_price});

    tx = await data.wait();
    console.log({"da": data });

    console.debug(sellerAddress.address)

    console.debug(
      await Promise.all(
        (
          await market.connect(sellerAddress).fetchMyNfts(20)
        ).map(async (i) => {
          const tokenURI = await nft.tokenURI(i.tokenId);
          return {
            tokenURI,
            price: i.price.toString(),
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
          };
        })
      )
    );
  });

  it("listed Items should be visible in the marketPlace", async function () {
    const _market = await ethers.getContractFactory("NFTMarket");
    const market = await _market.deploy();
    await market.deployed();
    const marketplaceAddress = market.address;

    const _nft = await ethers.getContractFactory("NFT");
    const nft = await _nft.deploy(marketplaceAddress);
    await nft.deployed();
    const nftMarketAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    let token1 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
    );
    let token2 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png"
    );
    let token3 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png"
    );
    let tx1 = await token1.wait();
    let tx2 = await token2.wait();
    let tx3 = await token2.wait();

    let tokenId1 = tx1.events[0].args[2].toNumber();
    let tokenId2 = tx2.events[0].args[2].toNumber();
    console.debug(tx2.events[0]["transactionHash"]);
    const auction_price = ethers.utils.parseUnits("100", "ether");

    await market.createMarketItem(nftMarketAddress, tokenId1, auction_price, {
      value: listingPrice,
    });

    await market.createMarketItem(nftMarketAddress, tokenId2, auction_price, {
      value: listingPrice,
    });

    const items = await market.getMarketItems(20);

    // console.debug(
    //   await Promise.all(
    //     items.map(async (i) => {
    //       const tokenURI = await nft.tokenURI(i.tokenId);
    //       return {
    //         tokenURI,
    //         price: i.price.toString(),
    //         tokenId: i.tokenId.toString(),
    //         seller: i.seller,
    //         owner: i.owner,
    //       };
    //     })
    //   )
    // );

    const [sellerAddress, buyerAddress] = await ethers.getSigners();

    console.debug({ buyer: buyerAddress.address });
    let data = await market
      .connect(buyerAddress)
      .createMarketItemSale(nftMarketAddress, 1, { value: auction_price });

    data = await data.wait();

    console.debug({ data: data });

    data = await market
      .connect(buyerAddress)
      .listItem(nftMarketAddress, 1, auction_price, {
        value: listingPrice,
      });
    tx = await data.wait();
    // console.log({ data });
    // data = await market
    //   .connect(sellerAddress)
    //   .getMarketItems(20);

    tx = await data.wait();
    console.log({"da": data });

    console.debug(sellerAddress.address)
    
    console.debug(
      await Promise.all(
        (
          await market.connect(sellerAddress).getMarketItems(20)
        ).map(async (i) => {
          const tokenURI = await nft.tokenURI(i.tokenId);
          return {
            tokenURI,
            price: i.price.toString(),
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
          };
        })
      )
    );
  });
});
