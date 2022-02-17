import Market from "../artifacts/contracts/MusicMarket.sol/MusicMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import { nftAddress, nftMarketPlaceAddress } from "../config";
import { ethers } from "ethers";
import { pick } from "underscore";
import axios from "axios";

const artistKeys = ["id", "artistName", "url"];
const songKeys = [
  "itemId",
  "tokenId",
  "owner",
  "price",
  "albumId",
  "trackNumber",
  "artistId",
];

export async function getAlbums() {
  const provider = new ethers.providers.JsonRpcProvider();
  const marketContract = new ethers.Contract(
    nftMarketPlaceAddress,
    Market.abi,
    provider
  );
  return await marketContract.getAlbums();
}

export async function getOwner() {
  const provider = new ethers.providers.JsonRpcProvider();
  const marketContract = new ethers.Contract(
    nftMarketPlaceAddress,
    Market.abi,
    provider
  );
  return await marketContract.owner();
}

export async function getAlbum(id) {
  const provider = new ethers.providers.JsonRpcProvider();
  const marketContract = new ethers.Contract(
    nftMarketPlaceAddress,
    Market.abi,
    provider
  );
  return pick(await marketContract.getAlbum(id),["_album","_artists"]);
}

export async function getArtists() {
  const provider = new ethers.providers.JsonRpcProvider();
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
  const provider = new ethers.providers.JsonRpcProvider();
  const marketContract = new ethers.Contract(
    nftMarketPlaceAddress,
    Market.abi,
    provider
  );
  console.log(id)
  var temp=await marketContract.itemIdToSong(id);
  const data=pick(temp, songKeys)
  data["formatted_price"] = ethers.utils.formatEther(data["price"].toString())
  data["meta"]=(await getMetadata(data.tokenId.toString())).data
  data["album"]=await getAlbum(data.albumId.toString())
  data["artistUrl"]=await(await (axios.get(data.album["_artists"].filter(elem=>elem.id.toString()==data.artistId.toString())[0]["url"]))).data.image
  return data
}


export async function getMetadata(tokenId) {
  const provider = new ethers.providers.JsonRpcProvider();
  const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
  const tokenURI = await tokenContract.tokenURI(tokenId);
  return await axios.get(tokenURI);
}

