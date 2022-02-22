const { expect } = require("chai");

describe("Auction Test", async function () {
  let market = null;
  let marketplaceAddress = null;
  let nft = null;
  let nftMarketAddres = null;
  let auction;
  let auctionAddress;
  let listingPrice;
  let auction_price;

  this.beforeEach(async function () {
    const _market = await ethers.getContractFactory("MusicMarket");
    market = await _market.deploy();
    await market.deployed();
    marketplaceAddress = market.address;

    const _nft = await ethers.getContractFactory("NFT");
    nft = await _nft.deploy(marketplaceAddress);
    await nft.deployed();
    nftMarketAddress = nft.address;

    const _auction = await ethers.getContractFactory("AuctionFactory");
    auction = await _auction.deploy(marketplaceAddress, nftMarketAddress);
    await auction.deployed();
    auctionAddress = auction.address;

    //Create Artist
    const eminemURI =
      "https://i.iheart.com/v3/surl/aHR0cDovL2ltYWdlLmloZWFydC5jb20vaW1hZ2VzL3JvdmkvNTAwLzAwMDQvMzUxL01JMDAwNDM1MTA4My5qcGc=?ops=fit%28720%2C720%29&sn=eGtleWJhc2UyMDIxMTExMDpdLNoz7zAkGSCGc0l-UhYU-iWVePRDxp115-dx0ZyJSg%3D%3D&surrogate=1cOXl179JY-syhxYSCX6Q1a_Mcu6UO8d-F4oJzpZf1hcUbJr4aImwtcKGFetygNPKx2a2jKgDrRWeMd-3Y81NovggdU4GlcJ7qBJw-Qox0WKye-fZ5aI3yh6uTGfWsn30qRx1dDyCTY4viE2NMODseBXqcXMx_rxHVFJCkuiiORNR53VluNY_iBg3DyjMX2N8_v5ZQlRXLm-v9cwDlhLBJFDedk%3D";
    const nfURI =
      "https://i1.sndcdn.com/artworks-000570669863-fbh69r-t500x500.jpg";
    const tmURL =
      "https://cdns-images.dzcdn.net/images/artist/d570910733deb67c9bc87750c1b289f5/500x500.jpg";

    var tx = await market.createArtist("Eminem", eminemURI);
    tx = await tx.wait();
    var eminemData = tx.events[0].args;

    tx = await market.createArtist("NF", nfURI);
    tx = await tx.wait();
    var nfData = tx.events[0].args;

    tx = await market.createArtist("Tom McDonald", tmURL);
    tx = await tx.wait();
    var tmData = tx.events[0].args;

    var tx = await market.artists(eminemData.artistId.toNumber());

    expect(tx["url"]).to.equal(eminemURI);
    expect(tx["artistName"]).to.equal("Eminem");

    tx = await market.artists(nfData.artistId.toNumber());
    expect(tx["url"]).to.equal(nfData["url"]);
    expect(tx["artistName"]).to.equal("NF");

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
    let tx3 = await token3.wait();

    let tokenId1 = tx1.events[0].args[2].toNumber();
    let tokenId2 = tx2.events[0].args[2].toNumber();
    let tokenId3 = tx3.events[0].args[2].toNumber();

    auction_price = ethers.utils.parseUnits("100", "ether");

    //album cover
    const albumCover =
      "https://images.genius.com/109e5e1425790e8f1b776fea8a074a4d.1000x1000x1.jpg";

    //create Album
    tx = await market.createAlbum("Release", albumCover, [
      eminemData["artistId"].toString(),
      nfData["artistId"].toString(),
    ]);
    tx = await tx.wait();
    const album1 = tx.events[0].args;

    //validate Artist exist
    tx = await market.getAlbum(album1["albumId"].toString());
    expect(tx["_artists"]).to.be.an("Array");
    expect(tx["_artists"].map((x) => x["id"].toString())).to.have.members([
      eminemData["artistId"].toString(),
      nfData["artistId"].toString(),
    ]);
    listingPrice = await market.listingPrice();
    listingPrice = listingPrice.toString();

    tx = await market.createSong(
      nftMarketAddress,
      tokenId1,
      album1["albumId"].toString(),
      eminemData["artistId"].toString(),
      auction_price
    );
    var data1 = await tx.wait();

    tx = await market.createSong(
      nftMarketAddress,
      tokenId2,
      album1["albumId"].toString(),
      eminemData["artistId"].toString(),
      auction_price
    );
    tx = await market.getItemByTokenId(tokenId2);

    const data = await market.getAlbum(album1["albumId"].toString());
    expect(data["_album"]["mintedSongs"].toString()).to.equal("2");
  });

  it("reject Auction not created by the musicNftMarketplace", async function () {
    const [_, buyerAddress] = await ethers.getSigners();
    tx = await market
      .connect(buyerAddress)
      .createSongSale(nftMarketAddress, 1, { value: auction_price });
    tx = await tx.wait();

    // tx=await market
    // .connect(buyerAddress)
    // .createAuction(auctionAddress ,nftMarketAddress, new Date().getTime(),  new Date().getTime() + 15*60*1000 , auction_price, 1)

    // tx= await  tx.wait()

    // var createdAuction=(tx.events[2].args)

    // var auctionId=(createdAuction.auctionId.toString());

    try {
      await auction.createAuction(
        new Date().getTime(),
        new Date().getTime() + 15 * 60 * 1000,
        buyerAddress.address,
        auction_price,
        1
      );
    } catch (e) {
      expect(e.message).to.have.string("not Allowed");
    }
  });
  it("Create Auction", async function () {
    const [_, buyerAddress] = await ethers.getSigners();
    tx = await market
      .connect(buyerAddress)
      .createSongSale(nftMarketAddress, 1, { value: auction_price });
    tx = await tx.wait();

    tx = await market
      .connect(buyerAddress)
      .createAuction(
        auctionAddress,
        nftMarketAddress,
        new Date().getTime(),
        new Date().getTime() + 15 * 60 * 1000,
        auction_price,
        1
      );

    tx = await tx.wait();

    var createdAuction = tx.events[2].args;

    var auctionId = createdAuction.auctionId.toString();

    tx = await auction.auctions(auctionId);
    expect(tx.tokenId.toNumber()).to.equal(1);
  });

  it("Create Auction", async function () {
    const [_, buyerAddress] = await ethers.getSigners();
    tx = await market
      .connect(buyerAddress)
      .createSongSale(nftMarketAddress, 1, { value: auction_price });
    tx = await tx.wait();

    tx = await market
      .connect(buyerAddress)
      .createAuction(
        auctionAddress,
        nftMarketAddress,
        new Date().getTime(),
        new Date().getTime() + 15 * 60 * 1000,
        auction_price,
        1
      );

    tx = await tx.wait();

    var createdAuction = tx.events[2].args;

    var auctionId = createdAuction.auctionId.toString();

    tx = await auction.auctions(auctionId);
  });

  it("Make bids", async function () {
    const [seller, buyerAddress] = await ethers.getSigners();
    tx = await market
      .connect(buyerAddress)
      .createSongSale(nftMarketAddress, 1, { value: auction_price });
    tx = await tx.wait();

    tx = await market
      .connect(buyerAddress)
      .createAuction(
        auctionAddress,
        nftMarketAddress,
        parseInt(new Date().getTime() / 1000),
        parseInt((new Date().getTime() + 5 * 60 * 1000) / 1000),
        auction_price,
        1
      );

    tx = await tx.wait();

    var createdAuction = tx.events[2].args;

    var auctionId = createdAuction.auctionId.toString();

    tx = await auction.auctions(auctionId);

    try {
      tx = await auction
        .connect(seller)
        .makeBid(auctionId, { value: ethers.utils.parseUnits("50", "ether") });
    } catch (e) {
      expect(e.message).to.have.string("bid must exceed current bid");
    }

    tx = await auction
      .connect(seller)
      .makeBid(auctionId, { value: ethers.utils.parseUnits("103", "ether") });
    tx = await tx.wait();

    tx = await auction
      .connect(seller)
      .makeBid(auctionId, { value: ethers.utils.parseUnits("135", "ether") });
    tx = await tx.wait();

    tx = await auction
      .connect(seller)
      .makeBid(auctionId, { value: ethers.utils.parseUnits("150", "ether") });
    tx = await tx.wait();

    tx = await auction.connect(seller).withdraw(auctionId);
    tx = await tx.wait();

    //Assert other bids can be bids can be withdrawn
    expect(
      ethers.utils.formatUnits(tx.events[0].args["amount"]),
      "ether"
    ).to.equal("238.0");
  });

  it("end Auction", async function () {
    const [seller, buyerAddress] = await ethers.getSigners();
    tx = await market
      .connect(buyerAddress)
      .createSongSale(nftMarketAddress, 1, { value: auction_price });
    tx = await tx.wait();

    tx = await market
      .connect(buyerAddress)
      .createAuction(
        auctionAddress,
        nftMarketAddress,
        parseInt(new Date().getTime() / 1000),
        parseInt((new Date().getTime() + 1.25 * 60 * 1000) / 1000),
        auction_price,
        1
      );

    tx = await tx.wait();

    var createdAuction = tx.events[2].args;

    var auctionId = createdAuction.auctionId.toString();

    tx = await auction.auctions(auctionId);

    try {
      tx = await auction
        .connect(seller)
        .makeBid(auctionId, { value: ethers.utils.parseUnits("50", "ether") });
    } catch (e) {
      expect(e.message).to.have.string("bid must exceed current bid");
    }

    tx = await auction
      .connect(seller)
      .makeBid(auctionId, { value: ethers.utils.parseUnits("103", "ether") });
    tx = await tx.wait();

    tx = await auction
      .connect(seller)
      .makeBid(auctionId, { value: ethers.utils.parseUnits("135", "ether") });
    tx = await tx.wait();

    tx = await auction
      .connect(seller)
      .makeBid(auctionId, { value: ethers.utils.parseUnits("150", "ether") });
    tx = await tx.wait();

    tx = await auction.connect(seller).withdraw(auctionId);
    tx = await tx.wait();

    //Assert other bids can be bids can be withdrawn
    expect(
      ethers.utils.formatUnits(tx.events[0].args["amount"]),
      "ether"
    ).to.equal("238.0");

    await new Promise((r) => setTimeout(r, 20 * 1000));
    tx = await auction.closeAuction(auctionId);
    tx = await tx.wait();
    console.debug(tx);

    tx =await market.getItemByTokenId(createdAuction.tokenId.toString());
    expect(tx["owner"]).to.equal(seller.address);
  });
});
