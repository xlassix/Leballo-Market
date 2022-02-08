import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Modal from "./Modal";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import MyNftCard from "./MyNftCard";
import { nftAddress, nftMarketPlaceAddress } from "../config";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";

export default function MyNfts() {
  const nftPerPage = 20;
  const [showModal, setModal] = useState();
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(1);
  function toggleData() {
    setModal(!showModal);
  }
  const router = useRouter();
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    loadNfts();
  }, []);

  async function loadNfts() {
    const web3Model = new Web3Modal();
    const connection = await web3Model.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      nftMarketPlaceAddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const data = await contract.fetchMyNfts(nftPerPage * page);
    console.log("fetchMyNft", data);

    const items = await Promise.all(
      data.map(async (elem) => {
        const tokenURI = await tokenContract.tokenURI(elem.tokenId);
        const meta = await axios.get(tokenURI);
        console.log(tokenURI, meta);
        let price = ethers.utils.formatUnits(elem.price.toString(), "ether");

        return {
          price,
          tokenId: elem.tokenId.toNumber(),
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

  async function listNft(nft, sell_price) {
    setLoaded(false);
    const web3Model = new Web3Modal();
    const connection = await web3Model.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      nftMarketPlaceAddress,
      Market.abi,
      signer
    );
    //list Nfts on Market place
    let listingPrice = await contract.getListingPrice();
    const price = ethers.utils.parseUnits(sell_price, "ether");
    console.log(nftAddress,nft.tokenId,price.toString())
    const transaction = await contract.listItem(nftAddress,nft.tokenId,price.toString(),{
        value: listingPrice.toString()
    });
    let tx = await transaction.wait();
    tx.events[0]["transactionHash"];
    setLoaded(true)
    router.push("/")
  }
  return (
    <>
      {nfts.length === 0 && loaded === true ? (
        <p style={{ textAlign: "center", padding: "7rem 0" }}>
          No Available Nfts
        </p>
      ) : (
        <section id="my-nfts">
          {nfts.map((nft, i) => {
            return <MyNftCard nft={nft} status={loading} key={i} listFunc={async(e)=>{await listNft(nft,e)}}/>;
          })}
        </section>
      )}
    </>
  );
}
