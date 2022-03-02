import Market from "../artifacts/contracts/MusicMarket.sol/MusicMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Auction from "../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json";
import { nftAddress, nftMarketPlaceAddress, auctionAddress } from "../config";
import { ethers } from "ethers";
import { pick, map, each, reduce } from "underscore";
import axios from "axios";
import Web3 from "web3";

const rpc = "https://rpc-mumbai.maticvigil.com";
const web3 = new Web3(rpc);
const artistKeys = ["id", "artistName", "url"];
const songKeys = [
  "itemId",
  "tokenId",
  "owner",
  "price",
  "albumId",
  "status",
  "trackNumber",
  "artistId",
];
const AuctionKeys = [
  "id",
  "tokenId",
  "currentBid",
  "startAt",
  "endAt",
  "status",
];

export async function getAlbums() {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const marketContract = new ethers.Contract(
    nftMarketPlaceAddress,
    Market.abi,
    provider
  );
  return await marketContract.getAlbums();
}

export async function getOwner() {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const marketContract = new ethers.Contract(
    nftMarketPlaceAddress,
    Market.abi,
    provider
  );
  return (await marketContract.owner()).toString().toLowerCase();
}

export async function getAlbum(id) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const marketContract = new ethers.Contract(
    nftMarketPlaceAddress,
    Market.abi,
    provider
  );
  return pick(await marketContract.getAlbum(id), ["_album", "_artists"]);
}

export async function getArtists() {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const marketContract = new ethers.Contract(
    nftMarketPlaceAddress,
    Market.abi,
    provider
  );
  return (await marketContract.getArtists()).map((elem) =>
    pick(elem, artistKeys)
  );
}

export async function getSong(id) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const marketContract = new ethers.Contract(
    nftMarketPlaceAddress,
    Market.abi,
    provider
  );
  console.log(id);
  var temp = await marketContract.itemIdToSong(id);
  const data = pick(temp, songKeys);
  data["formatted_price"] = ethers.utils.formatEther(data["price"].toString());
  data["meta"] = (await getMetadata(data.tokenId.toString())).data;
  data["album"] = await getAlbum(data.albumId.toString());
  data["artistUrl"] = await (
    await axios.get(
      data.album["_artists"].filter(
        (elem) => elem.id.toString() == data.artistId.toString()
      )[0]["url"]
    )
  ).data.image;
  return data;
}

export async function getMetadata(tokenId) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
  const tokenURI = await tokenContract.tokenURI(tokenId);
  return await axios.get(tokenURI);
}

export async function getAuctions() {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const auctionContract = new ethers.Contract(
    auctionAddress,
    Auction.abi,
    provider
  );
  const activeAuction = (await auctionContract.getAuctions()).filter(
    (elem) => parseInt(elem.status) != 0
  );
  var data = await Promise.all(
    activeAuction.map(async (elem) => {
      const data = pick(elem, AuctionKeys);
      data.meta = (await getMetadata(elem.tokenId.toString())).data;
      data["formatted_price"] = ethers.utils.formatEther(
        data["currentBid"].toString()
      );
      return data;
    })
  );
  return data;
}
export async function getAuction(id) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const auctionContract = new ethers.Contract(
    auctionAddress,
    Auction.abi,
    provider
  );
  const auction = await auctionContract.auctions(id);
  const data = pick(auction, AuctionKeys);
  data.meta = (await getMetadata(auction.tokenId.toString())).data;
  data["formatted_price"] = ethers.utils.formatEther(
    data["currentBid"].toString()
  );
  console.log(data);
  return data;
}

export async function getAuctionByItemID(id) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const auctionContract = new ethers.Contract(
    auctionAddress,
    Auction.abi,
    provider
  );
  const auction = await auctionContract.getAuctionByItemId(id);
  const data = pick(auction, AuctionKeys);
  data.meta = (await getMetadata(auction.tokenId.toString())).data;
  data["formatted_price"] = ethers.utils.formatEther(
    data["currentBid"].toString()
  );
  console.log(data);
  return data;
}

export async function getLogs(id) {
  const latest = await web3.eth.getBlockNumber();
  const contract = new web3.eth.Contract(Auction.abi, auctionAddress);
  const logs = await contract.getPastEvents("bidEvent", {
    filter: {
      auctionId: id,
    },
    fromBlock: latest-1000,
    toBlock: latest
  });
  console.log(logs);
  var results = logs.map((log) => {
    return {
      tx: log.transactionHash,
      ...log.returnValues,
      amount: ethers.utils.formatEther(log.returnValues["amount"].toString()),
    };
  });
  console.log("ddd", results);
  return results;
}
