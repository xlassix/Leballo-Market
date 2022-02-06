import { ethers } from "ethers";
import { create as ipfs_client } from "ipfs-http-client";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import { nftAddress, nftMarketPlaceAddress } from "../config";

const client = ipfs_client({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: `${process.env.projectId}:`,
  },
});

export default function CreateNft() {
  const [showModal, setModal] = useState();
  const [uploaded, setIsUploading] = useState(true);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  function toggleData() {
    setModal(!showModal);
  }
  const [fileUrl, setFileUrl] = useState(null);
  const [formData, setFormData] = useState({
    price: "",
    name: "",
    description: "",
  });

  async function fileHandler(e) {
    setIsUploading(false);
    const file = e.target.files[0];
    let file_size = e.target.files[0].size;
    try {
      const _added = await client.add(file, {
        progress: (prog) => {
          console.log(prog, file_size);
          setIsUploading(prog == file_size);
        },
      });
      setFileUrl(`https://ipfs.infura.io/ipfs/${_added.path}`);
    } catch (e) {
      console.log(e.message);
    }
  }

  async function createItem() {
    const { name, description, price } = formData;
    console.log("fileUrl", fileUrl, description, name);
    const data = JSON.stringify({ name, price, description, image: fileUrl });
    console.log(data);
    try {
      const _added = await client.add(data);
      createSales(`https://ipfs.infura.io/ipfs/${_added.path}`);
    } catch (e) {
      console.log(e.message);
    }
  }

  async function createSales(url) {
    const web3Model = new Web3Modal();
    const connection = await web3Model.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    //create Nft
    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    console.log(url);
    const _nft = await contract.createToken(url);
    let tx = await _nft.wait();
    const tokenId = tx.events[0].args[2].toNumber();

    //list Nfts on Market place
    const price = ethers.utils.parseUnits(formData.price, "ether");
    contract = new ethers.Contract(nftMarketPlaceAddress, Market.abi, signer);

    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    const transaction = await contract.createMarketItem(
      nftAddress,
      tokenId,
      price,
      {
        value: listingPrice,
      }
    );
    tx = await transaction.wait();
    return tx.events[0]["transactionHash"];
  }

  return (
    <>
      <a className="rounded-button" onClick={() => toggleData()}>
        Upload NFT
      </a>
      {showModal ? (
        <Modal>
          <form className="upload">
          <a onClick={() => toggleData()} style={{fontSize:"2rem",textAlign:"right"}}>&times;</a>
            <input
              placeholder="Asset Name"
              required
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <textarea
              placeholder="Asset Description"
              required
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
              }}
            />
            <input
              placeholder="Asset Price"
              type="number"
              required
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
            <input placeholder="Asset" type="file" onChange={fileHandler} />
            <div className="center">
              {uploaded ? (
                <a
                  className="rounded-button"
                  required
                  onClick={(e) => {
                    console.log("clicked");
                    createItem(e);
                  }}
                >
                  Create Nft
                </a>
              ) : (
                <a>Uploading.....</a>
              )}
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
