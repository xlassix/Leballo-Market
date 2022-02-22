import { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import MarketNftCard from "./MarketNftCard";
import { Context } from "./Context";
import { useRouter } from "next/router";

export default function MarketNfts() {
  const {
    nftAddress,
    Market,
    NFT,
    nftMarketPlaceAddress,
    errorInstance,
    setErrorInstance,
    setCurrentNft,
  } = useContext(Context).state;

  const router = useRouter();

  const nftPerPage = 20;
  const [showModal, setModal] = useState();
  const [page, setPage] = useState(1);
  function toggleData() {
    setModal(!showModal);
  }

  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadNfts();
  }, []);

  async function loadNfts() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.maticvigil.com"
    );
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftMarketPlaceAddress,
      Market.abi,
      provider
    );
    const data = await marketContract.getSongs(nftPerPage * page);

    const items = await Promise.all(
      data.map(async (elem) => {
        const tokenURI = await tokenContract.tokenURI(elem.tokenId);
        const meta = await axios.get(tokenURI);
        console.log(tokenURI, meta);
        let price = ethers.utils.formatUnits(elem.price.toString(), "ether");

        return {
          price,
          tokenId: elem.tokenId.toNumber(),
          id: elem.itemId.toNumber(),
          seller: elem.seller,
          owner: elem.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
      })
    );
    console.log("items", items);
    setNfts(items);
    setLoaded(true);
  }

  async function buyNfts(nft) {
    try {
      const web3Model = new Web3Modal();
      const connection = await web3Model.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        nftMarketPlaceAddress,
        Market.abi,
        signer
      );
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createSongSale(
        nftAddress,
        nft.tokenId,
        {
          value: price,
        }
      );

      await transaction.wait();
    } catch (e) {
      console.log(e.message);
      setErrorInstance({
        ...errorInstance,
        status: true,
        message: e.message,
        subtitle: e.data.message,
      });
    }
    loadNfts();
  }

  return (
    <div className="bgcolor_lit_purple">
      <section id="discover">
        <h2>DISCOVER MORE NFT</h2>
        <div id="category">
          <button className="rounded-button">All Category</button>
          <button className="rounded-button">Art</button>
          <button className="rounded-button">Artist</button>
          <button className="rounded-button">Most Viewed</button>
          <button className="rounded-button">Music</button>
          <button className="rounded-button">Crypto</button>
          <button
            className="rounded-button flex flex-center"
            style={{ "--gap": "0.25rem" }}
          >
            <svg
              style={{ height: "10px", width: "15px", fill: "currentColor" }}
              viewBox="0 0 15px 10px"
            >
              <path d="M0 0H15.444V1.824H0V0Z"></path>
              <path d="M2.87 4.275H12.574V6.099H2.87V4.275Z"></path>
              <path d="M5.472 8.333H9.972V10.157H5.472V8.333Z"></path>
            </svg>{" "}
            Filter
          </button>
        </div>
        {loaded === false ? (
          <p style={{ textAlign: "center", padding: "7rem 0" }}>
            Loading MarketNfts .....
          </p>
        ) : null}
        {nfts.length === 0 && loaded === true ? (
          <p style={{ textAlign: "center", padding: "7rem 0" }}>
            No Available Nfts
          </p>
        ) : (
          <div id="nfts">
            {nfts.map((nft, i) => {
              return (
                <MarketNftCard
                  onclick={() => {
                    router.push(`/song/${nft.id}`);
                  }}
                  nft={nft}
                  key={i}
                  onPurchase={() => buyNfts(nft)}
                />
              );
            })}
          </div>
        )}
      </section>
      {errorInstance.status ? (
        <Modal>
          <div className="upload">
            <a
              onClick={() => {
                setErrorInstance({
                  ...errorInstance,
                  status: false,
                  count: errorInstance.count + 1,
                });
              }}
              style={{ fontSize: "2rem", textAlign: "right" }}
            >
              &times;
            </a>
            <h5 style={{ textAlign: "center", padding: "7rem" }}>
              {errorInstance.message ? errorInstance.message : "Disconnected"}
            </h5>
            <p style={{ textAlign: "center" }}>
              {errorInstance.subtitle ? errorInstance.subtitle : ""}
            </p>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
