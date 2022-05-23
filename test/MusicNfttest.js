const { expect } = require("chai");

let _market, market, nft, _nft,nftMarketAddress,marketplaceAddress;

function generateRandomAddressSigner() {
  return new ethers.Wallet.createRandom();
}
beforeEach(async () => {
  [owner, account2, account3, account4] = await ethers.getSigners();
  owner = owner.address;

  _market = await ethers.getContractFactory("MusicMarket");
  market = await _market.deploy();
  await market.deployed();
  marketplaceAddress = market.address;

  _nft = await ethers.getContractFactory("LebelloNFT1155");
  nft = await _nft.deploy(marketplaceAddress);
  await nft.deployed();
  nftMarketAddress = nft.address;
  console.log(`Market Contract deployed at : ${market.address}`);
  console.log(`NFT Contract deployed at : ${nft.address}`);
});

describe("MusicNft market", async function () {
  it("Create Artist", async function () {
    const eminemURI =
      "https://i.iheart.com/v3/surl/aHR0cDovL2ltYWdlLmloZWFydC5jb20vaW1hZ2VzL3JvdmkvNTAwLzAwMDQvMzUxL01JMDAwNDM1MTA4My5qcGc=?ops=fit%28720%2C720%29&sn=eGtleWJhc2UyMDIxMTExMDpdLNoz7zAkGSCGc0l-UhYU-iWVePRDxp115-dx0ZyJSg%3D%3D&surrogate=1cOXl179JY-syhxYSCX6Q1a_Mcu6UO8d-F4oJzpZf1hcUbJr4aImwtcKGFetygNPKx2a2jKgDrRWeMd-3Y81NovggdU4GlcJ7qBJw-Qox0WKye-fZ5aI3yh6uTGfWsn30qRx1dDyCTY4viE2NMODseBXqcXMx_rxHVFJCkuiiORNR53VluNY_iBg3DyjMX2N8_v5ZQlRXLm-v9cwDlhLBJFDedk%3D";
    const nfURI =
      "https://i1.sndcdn.com/artworks-000570669863-fbh69r-t500x500.jpg";

    var tx = await market.createArtist("Eminem", eminemURI);
    tx = await tx.wait();
    var eminemData = ("Eminem", tx.events[0].args);

    var tx = await market.createArtist("NF", nfURI);
    tx = await tx.wait();
    var nfData = ("NF", tx.events[0].args);

    var tx = await market.artists(eminemData.artistId.toNumber());

    expect(tx["url"]).to.equal(eminemURI);
    expect(tx["artistName"]).to.equal("Eminem");

    tx = await market.artists(nfData.artistId.toNumber());

    expect(tx["url"]).to.equal(nfData["url"]);
    expect(tx["artistName"]).to.equal("NF");
  });
  it("Create Albums", async function () {

    //Create Artist
    const eminemURI =
      "https://i.iheart.com/v3/surl/aHR0cDovL2ltYWdlLmloZWFydC5jb20vaW1hZ2VzL3JvdmkvNTAwLzAwMDQvMzUxL01JMDAwNDM1MTA4My5qcGc=?ops=fit%28720%2C720%29&sn=eGtleWJhc2UyMDIxMTExMDpdLNoz7zAkGSCGc0l-UhYU-iWVePRDxp115-dx0ZyJSg%3D%3D&surrogate=1cOXl179JY-syhxYSCX6Q1a_Mcu6UO8d-F4oJzpZf1hcUbJr4aImwtcKGFetygNPKx2a2jKgDrRWeMd-3Y81NovggdU4GlcJ7qBJw-Qox0WKye-fZ5aI3yh6uTGfWsn30qRx1dDyCTY4viE2NMODseBXqcXMx_rxHVFJCkuiiORNR53VluNY_iBg3DyjMX2N8_v5ZQlRXLm-v9cwDlhLBJFDedk%3D";
    const nfURI =
      "https://i1.sndcdn.com/artworks-000570669863-fbh69r-t500x500.jpg";

    var tx = await market.createArtist("Eminem", eminemURI);
    tx = await tx.wait();
    var eminemData = ("Eminem", tx.events[0].args);

    var tx = await market.createArtist("NF", nfURI);
    tx = await tx.wait();
    var nfData = ("NF", tx.events[0].args);

    var tx = await market.artists(eminemData.artistId.toNumber());

    expect(tx["url"]).to.equal(eminemURI);
    expect(tx["artistName"]).to.equal("Eminem");

    tx = await market.artists(nfData.artistId.toNumber());
    expect(tx["url"]).to.equal(nfData["url"]);
    expect(tx["artistName"]).to.equal("NF");

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
  });
  it("an Artist Must be on Album to add a song", async function () {});
  it("reject Songs from Artist", async function () {});
  it("Should create and execute and list Songs", async function () {

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
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",20
    );
    let token2 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png",20
    );
    let token3 = await nft.createToken(
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png",20
    );
    let [tx1,tx2,tx3] = await Promise.all([ token1.wait(),token2.wait(),token3.wait()]);


    let tokenId1 = tx1.events[0].args[3].toNumber();
    let tokenId2 = tx2.events[0].args[3].toNumber();
    let tokenId3 = tx3.events[0].args[3].toNumber();

    const auction_price = ethers.utils.parseUnits("100", "ether");

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
    let listingPrice = await market.listingPrice();
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

    // const [_, buyerAddress] = await ethers.getSigners();
    // tx = await market
    //   .connect(buyerAddress)
    //   .createSongSale(nftAddress, 1, { value: auction_price });

    // tx = await tx.wait();
  });
});
