import { useState,useEffect } from "react";
import { ethers } from "ethers";
import { nftAddress, nftMarketPlaceAddress } from "../config";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import axios from "axios";


export default function Intro() {
  
  const [images, setImages] = useState([
    { id: 0, image: "./img/Asset 1.png" },
    { id: 1, image: "./img/Asset 6.svg" },
    { id: 2, image: "./img/Asset 5(1).svg" },
  ]);
  async function loadNfts() {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today");
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftMarketPlaceAddress,
      Market.abi,
      provider
    );
    const data = await marketContract.getLastMinted(20);

    const items = await Promise.all(
      data.map(async (elem,ind) => {
        const tokenURI = await tokenContract.tokenURI(elem.tokenId);
        const meta = await axios.get(tokenURI);
        console.log(tokenURI, meta);
        let price = ethers.utils.formatUnits(elem.price.toString(), "ether");

        return {
          id: ind,
          image: meta.data.image
        };
      })
    );
    console.log("items", items);
    setImages(items);
    setLoaded(true);
  }

  useEffect(() => {
    loadNfts();
  }, []);



  function changeImg() {
    setImages([...images.slice(1,),...images.slice(0,1)]);
  }
  return (
    <section id="intro">
      <div>
        <h2>DISCOVER, AND COLLECT DIGITAL ART NFTS</h2>
        <p>
          Digital MarketPlace for crypto collectibles and non-fungible
          tokens(NFTs), Buy, Sell and discover exclusive digital assets
        </p>
        <button className="rounded-button">Explore Now</button>
        <ul>
          <li>
            <h3>98k+</h3>
            <p>Artworks</p>
          </li>
          <li>
            <h3>12k+</h3>
            <p>Auction</p>
          </li>
          <li>
            <h3>15k+</h3>
            <p>Artists</p>
          </li>
        </ul>
      </div>
      <div>
        <div className="img-slider" id="img-slider">
          <img
            className="first"
            src={images[0].image}
            alt="test image"
            key={images[0].id}
          />
          <img
            className="second"
            src={images[1].image}
            alt="test image"
            onClick={() => changeImg()}
            key={images[1].id}
          />
          <img
            className="third"
            src={images[2].image}
            alt="test image"
            key={images[2].id}
            onClick={() => changeImg()}
          />
        </div>
        <form className="slider" id="form-slider">
          <input
            type="range"
            min="0"
            max={images.length - 1}
            value={images[0].id}
            className="range_slider"
            name="slide"
            id="myRange"
            onInput={() => changeImg()}
          />
        </form>
      </div>
    </section>
  );
}
