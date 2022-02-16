import Market from "../artifacts/contracts/MusicMarket.sol/MusicMarket.json";
import { nftAddress, nftMarketPlaceAddress } from "../config";
import { ethers } from "ethers";

async function getAlbum() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.rpc);
  const marketContract = new ethers.Contract(
    nftMarketPlaceAddress,
    Market.abi,
    provider
  );
  return await marketContract.getAlbums();
}
